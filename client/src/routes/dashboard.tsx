import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '@/integrations/trpc/react'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  const trpc = useTRPC()
  const { data: user, isLoading, isError } = useQuery(trpc.auth.me.queryOptions())

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  if (isError || !user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Vous devez être connecté.</p>
        <Link to="/login" className="text-primary hover:underline">
          Se connecter
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-lux-black text-lux-text relative overflow-hidden flex flex-col">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-bg opacity-10"></div>
      <div className="absolute inset-0 noise-overlay"></div>
      
      <div className="container mx-auto max-w-6xl px-6 pt-24 pb-16 relative z-10 flex-1 flex flex-col">
        <div className="mb-12 flex items-center justify-between border-b border-white/5 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-lux-gold/30 flex items-center justify-center bg-lux-gold/5">
              <span className="material-icons-outlined text-lux-gold">diamond</span>
            </div>
            <div>
              <h2 className="text-xl font-display font-bold tracking-widest text-white uppercase">Mission Control</h2>
              <p className="text-[10px] text-lux-gold uppercase tracking-[0.2em] font-medium">{user.email}</p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={async () => {
              await import('@/lib/api').then((m) => m.logout())
              window.location.href = '/'
            }}
            className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-lux-text-muted hover:text-lux-gold transition-colors"
          >
            <span>Déconnexion</span>
            <span className="material-icons-outlined text-sm transition-transform group-hover:translate-x-1">logout</span>
          </button>
        </div>

        <nav className="mb-12 flex gap-10 border-b border-white/5">
          {[
            { to: '/dashboard', label: 'Aperçu', exact: true },
            { to: '/dashboard/skills', label: 'Capacités' },
            { to: '/dashboard/agent', label: 'Intelligence' },
            { to: '/dashboard/billing', label: 'Privilèges' },
            { to: '/dashboard/admin', label: '🔧 Admin', hidden: true }
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="relative py-4 text-xs font-bold uppercase tracking-[0.2em] text-lux-text-muted hover:text-white transition-colors data-[status=active]:text-lux-gold group"
              activeOptions={{ exact: item.exact }}
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-lux-gold scale-x-0 transition-transform duration-500 origin-left group-[[data-status=active]]:scale-x-100"></span>
              <span className="absolute bottom-0 left-0 w-full h-[6px] bg-lux-gold/20 blur-sm scale-x-0 transition-transform duration-500 origin-left group-[[data-status=active]]:scale-x-100"></span>
            </Link>
          ))}
        </nav>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      {/* Subtle Footer */}
      <div className="container mx-auto max-w-6xl px-6 py-8 border-t border-white/5 relative z-10 flex justify-between items-center opacity-50">
        <p className="text-[8px] uppercase tracking-[0.3em]">Nexus Privé © 2024</p>
        <div className="flex gap-4">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <p className="text-[8px] uppercase tracking-[0.3em]">Système de Conciergerie Actif</p>
        </div>
      </div>
    </div>
  )
}
