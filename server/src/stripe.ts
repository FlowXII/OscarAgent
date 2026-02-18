import Stripe from 'stripe'
import { prisma } from './db.js'
import { Plan, SubscriptionStatus, PaymentStatus } from '@prisma/client'
import { createAgent } from './docker.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const PRICE_IDS: Record<Plan, string> = {
  Hosting: process.env.STRIPE_PRICE_HOSTING!,
  Complet: process.env.STRIPE_PRICE_COMPLET!,
}

export async function createCheckoutSession(
  userId: string,
  plan: Plan,
  successUrl: string,
  cancelUrl: string
): Promise<string> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error('User not found')

  let customerId = (
    await prisma.subscription.findFirst({
      where: { userId, stripeCustomerId: { not: null } },
      orderBy: { createdAt: 'desc' },
    })
  )?.stripeCustomerId

  const priceId = PRICE_IDS[plan]
  if (!priceId || priceId.startsWith('price_placeholder')) {
    throw new Error('Stripe price not configured')
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: customerId ? undefined : user.email,
    customer: customerId || undefined,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { userId, plan },
    subscription_data: { metadata: { userId, plan } },
  })

  return session.url!
}

export async function handleWebhook(payload: string | Buffer, signature: string): Promise<void> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret || webhookSecret.startsWith('whsec_placeholder')) {
    throw new Error('Webhook secret not configured')
  }

  const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId
      const plan = session.metadata?.plan as Plan | undefined
      if (!userId || !plan) return

      const subId = session.subscription as string
      const subscription = await stripe.subscriptions.retrieve(subId)

      await prisma.subscription.create({
        data: {
          userId,
          plan,
          status: SubscriptionStatus.active,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: session.customer as string,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      })

      try {
        await createAgent(userId)
      } catch (e) {
        console.error('Failed to create agent after checkout:', e)
      }
      break
    }

    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice
      const subId = invoice.subscription as string
      if (!subId) return

      const sub = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: subId },
      })
      if (!sub) return

      await prisma.payment.create({
        data: {
          userId: sub.userId,
          amount: invoice.amount_paid,
          status: PaymentStatus.succeeded,
          stripeInvoiceId: invoice.id,
        },
      })
      break
    }

    case 'customer.subscription.deleted':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const existing = await prisma.subscription.findFirst({
        where: { stripeSubscriptionId: subscription.id },
      })
      if (!existing) return

      const status =
        subscription.status === 'active'
          ? SubscriptionStatus.active
          : subscription.status === 'past_due'
            ? SubscriptionStatus.past_due
            : SubscriptionStatus.cancelled

      await prisma.subscription.update({
        where: { id: existing.id },
        data: {
          status,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      })

      if (status !== SubscriptionStatus.active) {
        const agent = await prisma.agent.findUnique({ where: { userId: existing.userId } })
        if (agent) {
          const { stopAgent } = await import('./docker.js')
          stopAgent(agent.id).catch(console.error)
        }
      }
      break
    }

    default:
      break
  }
}
