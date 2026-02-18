import { Hono } from 'hono'
import { handleWebhook } from '../stripe.js'

export const stripeRoutes = new Hono()

stripeRoutes.post('/webhook', async (c) => {
  const raw = await c.req.text()
  const sig = c.req.header('stripe-signature')
  if (!sig) {
    return c.json({ error: 'Missing stripe-signature' }, 400)
  }
  try {
    await handleWebhook(raw, sig)
    return c.json({ received: true })
  } catch (e) {
    console.error('Stripe webhook error:', e)
    return c.json({ error: (e as Error).message }, 400)
  }
})
