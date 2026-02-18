import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTRPC } from '@/integrations/trpc/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard } from 'lucide-react'

export const Route = createFileRoute('/dashboard/billing')({
  component: DashboardBilling,
})

function DashboardBilling() {
  const trpc = useTRPC()
  const qc = useQueryClient()
  const { data: subscription } = useQuery(trpc.subscriptions.get.queryOptions())
  const { data: payments } = useQuery(trpc.payments.list.queryOptions())
  const checkout = useMutation(trpc.subscriptions.createCheckout.mutationOptions())

  const handleSubscribe = (plan: 'Hosting' | 'Complet') => {
    checkout.mutate(plan, {
      onSuccess: (data) => {
        if (data.url) window.location.href = data.url
      },
    })
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Facturation</h1>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="size-5 text-primary" />
            <CardTitle>Abonnement</CardTitle>
          </div>
          <CardDescription>
            {subscription ? 'Votre plan actuel' : 'Choisissez un plan'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {subscription ? (
            <div>
              <p className="font-medium capitalize">{subscription.plan}</p>
              <p className="text-sm text-muted-foreground">
                Prochain renouvellement :{' '}
                {subscription.currentPeriodEnd
                  ? new Date(subscription.currentPeriodEnd).toLocaleDateString('fr-FR')
                  : '—'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border/50 p-4">
                <p className="font-medium">Hosting</p>
                <p className="text-2xl font-bold">19€<span className="text-sm font-normal text-muted-foreground">/mois</span></p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Infrastructure. Vous gérez l'IA.
                </p>
                <Button
                  className="mt-3"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSubscribe('Hosting')}
                  disabled={checkout.isPending}
                >
                  Choisir
                </Button>
              </div>
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                <p className="font-medium">Complet</p>
                <p className="text-2xl font-bold">49€<span className="text-sm font-normal text-muted-foreground">/mois</span></p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tout inclus. On gère tout.
                </p>
                <Button
                  className="mt-3"
                  size="sm"
                  onClick={() => handleSubscribe('Complet')}
                  disabled={checkout.isPending}
                >
                  Choisir
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {payments && payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historique des paiements</CardTitle>
            <CardDescription>Vos derniers paiements</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {payments.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between rounded-md border border-border/50 px-3 py-2 text-sm"
                >
                  <span>{(p.amount / 100).toFixed(2)} €</span>
                  <span className="capitalize text-muted-foreground">{p.status}</span>
                  <span>{new Date(p.createdAt).toLocaleDateString('fr-FR')}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
