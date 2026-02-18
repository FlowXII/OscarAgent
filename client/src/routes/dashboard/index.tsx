import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bot, CreditCard, Plus, Clock, Search, Filter } from 'lucide-react'
import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useTRPC } from '@/integrations/trpc/react'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardIndex,
})

function DashboardIndex() {
  const trpc = useTRPC()
  const { data: subscription } = useQuery(trpc.subscriptions.get.queryOptions())
  const [search, setSearch] = useState('')
  const { data: agent, refetch: refetchAgent } = useQuery(trpc.agents.get.queryOptions())

  const { mutate: provisionAgent, isPending: isProvisioning } = useMutation({
    ...trpc.agents.provision.mutationOptions(),
    onSuccess: () => {
      refetchAgent()
    },
  })

  // Mock tasks for development based on the luxury mockup
  const tasks = [
    { id: 1, title: 'Voyage Paris', desc: 'AF1380 • Ritz Vendôme', status: 'Confirmé', color: 'lux-gold', icon: 'flight_takeoff' },
    { id: 2, title: 'Réservation Nobu', desc: 'Tokyo • 4 Pers • Salon Privé', status: 'En cours', color: 'purple-400', icon: 'restaurant', animate: true },
    { id: 3, title: 'Vintage Rare', desc: 'Patek 5711 • Recherche Dealer', status: 'Recherche', color: 'blue-400', icon: 'watch' },
  ]

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-serif font-medium text-white tracking-tight">Vue d'Ensemble</h1>
          <p className="text-lux-text-muted font-light tracking-wide uppercase text-[10px]">Statut des Requêtes Actives</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-lux-text-muted group-focus-within:text-lux-gold transition-colors" />
            <input 
              type="text" 
              placeholder="Rechercher une requête..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-lux-charcoal/30 border border-white/5 pl-9 pr-4 py-2 text-xs text-white placeholder:text-gray-700 focus:border-lux-gold/30 outline-none transition-all w-64 rounded-sm"
            />
          </div>
          <button 
            disabled={isProvisioning}
            onClick={() => provisionAgent()}
            className="bg-lux-gold text-lux-black px-6 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(198,168,124,0.1)] disabled:opacity-50"
          >
            {isProvisioning ? (
              <span className="animate-spin text-sm italic">O</span>
            ) : (
              <Plus className="size-3" />
            )}
            {isProvisioning ? 'Initialisation...' : 'Nouvelle Requête'}
          </button>
        </div>
      </div>

      {/* Main Grid: Tasks & Stats */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Active Tasks List (The Todo List) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
              <Clock className="size-3 text-lux-gold" />
              Requêtes en Cours
            </h3>
            <button className="text-[10px] uppercase tracking-widest text-lux-gold hover:text-white transition-colors flex items-center gap-1">
              <Filter className="size-3" />
              Filtrer
            </button>
          </div>

          <div className="grid gap-4">
            {!agent && (
              <div className="glass-card p-12 text-center border-lux-gold/20 flex flex-col items-center gap-6">
                <div className="w-16 h-16 bg-lux-gold/5 border border-lux-gold/20 flex items-center justify-center rounded-full">
                  <Bot className="size-8 text-lux-gold border-none" />
                </div>
                <div>
                  <h4 className="text-xl font-serif text-white mb-2">Oscar n'est pas encore déployé</h4>
                  <p className="text-lux-text-muted text-sm max-w-sm mx-auto">Votre majordome attend vos instructions depuis sa suite privée.</p>
                </div>
                <button 
                  disabled={isProvisioning}
                  onClick={() => provisionAgent()}
                  className="bg-lux-gold text-lux-black px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-white transition-all disabled:opacity-50"
                >
                  {isProvisioning ? 'Déploiement en cours...' : 'Provisionner Oscar'}
                </button>
              </div>
            )}
            {agent && tasks.map((task) => (
              <div 
                key={task.id} 
                className="glass-card group flex items-center justify-between p-6 rounded-sm border-white/5 hover:border-lux-gold/30 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className={`absolute left-0 top-0 bottom-0 w-[2px] bg-${task.color} opacity-30 group-hover:opacity-100 transition-opacity`}></div>
                
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-white/5 flex items-center justify-center rounded-sm border border-white/5 group-hover:border-lux-gold/20 transition-colors">
                    <span className="material-icons-outlined text-lux-gold text-xl">{task.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium tracking-wide mb-1 transition-colors group-hover:text-lux-gold">{task.title}</h4>
                    <p className="text-xs text-lux-text-muted font-light">{task.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right hidden md:block">
                    <span className="text-[10px] uppercase tracking-widest text-lux-text-muted block mb-1">Status</span>
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full bg-${task.color} ${task.animate ? 'animate-pulse' : ''}`}></span>
                      <span className="text-[10px] font-bold text-white uppercase tracking-tighter">{task.status}</span>
                    </div>
                  </div>
                  <span className="material-icons-outlined text-white/20 group-hover:text-lux-gold transition-colors translate-x-2 group-hover:translate-x-0">chevron_right</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Quick Stats & Subs */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-lux-charcoal/20 border border-white/5 p-8 rounded-sm space-y-8">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white/40">Statut Système</h3>
            
            {/* Agent Status Card */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bot className="size-4 text-lux-gold" />
                  <span className="text-xs font-medium text-white tracking-wide">Intelligence Oscar</span>
                </div>
                <span className={`text-[10px] ${agent?.status === 'running' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'} px-2 py-0.5 rounded-full font-bold uppercase`}>
                  {agent?.status || 'Inactif'}
                </span>
              </div>
              <div className="w-full bg-white/5 h-[1px]"></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-lux-text-muted mb-1">Port</p>
                  <p className="text-[10px] text-white font-mono">{agent?.port || '—'}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-lux-text-muted mb-1">Système</p>
                  <p className="text-[10px] text-white font-mono">OpenClaw v1</p>
                </div>
              </div>
            </div>

            {/* Subscription Card */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="size-4 text-lux-gold" />
                  <span className="text-xs font-medium text-white tracking-wide">Rang Privilège</span>
                </div>
                <span className="text-[10px] text-lux-gold font-bold uppercase italic tracking-widest">{subscription?.plan || 'Prestige'}</span>
              </div>
              <p className="text-[10px] text-lux-text-muted leading-relaxed">
                Votre accès exclusif Nexus Privé est actif jusqu'en Décembre 2024.
              </p>
              <Button asChild variant="ghost" className="w-full border border-white/5 hover:bg-white/5 text-[10px] uppercase tracking-[0.2em] h-10">
                <Link to="/dashboard/billing">Gérer l’Adhésion</Link>
              </Button>
            </div>
          </div>

          {/* Quick Help / Support */}
          <div className="glass-card p-8 rounded-sm border-lux-gold/10">
            <h4 className="text-white text-sm font-serif mb-4 italic">Besoin d'assistance ?</h4>
            <p className="text-xs text-lux-text-muted leading-relaxed mb-6 font-light">
              Votre conseiller personnel est disponible 24/7 sur votre canal WhatsApp dédié.
            </p>
            <button className="flex items-center gap-2 text-wa-green text-[10px] uppercase tracking-[0.2em] font-bold group">
              Ouvrir WhatsApp
              <Plus className="size-3 group-hover:rotate-90 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
