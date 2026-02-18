import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTRPC } from '@/integrations/trpc/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bot, RefreshCw, ExternalLink } from 'lucide-react'

export const Route = createFileRoute('/dashboard/agent')({
  component: DashboardAgent,
})

function DashboardAgent() {
  const trpc = useTRPC()
  const qc = useQueryClient()
  const { data: agent, isLoading } = useQuery(trpc.agents.get.queryOptions())
  const restart = useMutation(trpc.agents.restart.mutationOptions())

  const handleRestart = () => {
    restart.mutate(undefined, {
      onSuccess: (r) => {
        if (r.success) qc.invalidateQueries({ queryKey: trpc.agents.get.queryKey() })
        else alert(r.error)
      },
    })
  }

  if (isLoading) return <p className="text-muted-foreground">Chargement...</p>

  if (!agent) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Agent</h1>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              Vous n'avez pas encore d'agent. Souscrivez à un plan pour en créer un.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Agent OpenClaw</h1>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="size-5 text-primary" />
              <CardTitle>Statut</CardTitle>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium capitalize text-primary">
              {agent.status}
            </span>
          </div>
          <CardDescription>
            Votre agent tourne dans un container dédié. Scannez le QR Code dans l'interface OpenClaw pour connecter WhatsApp.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {agent.port && (
            <div>
              <p className="text-sm font-medium">Interface OpenClaw</p>
              <p className="text-sm text-muted-foreground">
                Accédez à l'UI sur le port {agent.port} pour le pairing WhatsApp.
              </p>
              <a
                href={agent.qrUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                Ouvrir l'interface <ExternalLink className="size-3" />
              </a>
            </div>
          )}
          {agent.errorMessage && (
            <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {agent.errorMessage}
            </p>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRestart}
            disabled={restart.isPending}
          >
            <RefreshCw className={`mr-2 size-4 ${restart.isPending ? 'animate-spin' : ''}`} />
            Redémarrer
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
