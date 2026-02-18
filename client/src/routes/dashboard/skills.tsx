import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Zap, 
  Globe, 
  Mail, 
  Calendar, 
  MessageSquare, 
  Search, 
  Lock,
  CheckCircle2,
  Circle,
  Plus,
  Bot
} from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useTRPC } from '@/integrations/trpc/react'

export const Route = createFileRoute('/dashboard/skills')({
  component: SkillsMarketplace,
})

function SkillsMarketplace() {
  const trpc = useTRPC()
  const { data: skills, isLoading, refetch } = useQuery(trpc.skills.list.queryOptions())
  const toggleSkill = useMutation(trpc.skills.toggle.mutationOptions())

  const handleToggle = (skillId: string, enabled: boolean) => {
    toggleSkill.mutate(
      { skillId, enabled: !enabled },
      {
        onSuccess: () => refetch(),
      }
    )
  }

  if (isLoading) return <p className="text-lux-text-muted text-xs uppercase tracking-widest p-12">Chargement des capacités...</p>

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-serif font-medium text-white tracking-tight">Capacités & Skills</h1>
          <p className="text-lux-text-muted font-light tracking-wide uppercase text-[10px]">Configurez l'intelligence de votre majordome Oscar</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills?.map((skill) => {
          const Icon = skill.slug === 'web-browsing' ? Globe : 
                       skill.slug === 'email-admin' ? Mail :
                       skill.slug === 'calendar-sync' ? Calendar :
                       skill.slug === 'luxury-concierge' ? Zap :
                       skill.slug === 'secure-vault' ? Lock : Bot;

          const isPremium = skill.category === 'Privilèges' || skill.category === 'Sécurité';

          return (
            <div 
              key={skill.id}
              className={`glass-card group relative p-8 rounded-sm border-white/5 transition-all duration-500 overflow-hidden ${isPremium ? 'hover:border-lux-gold/40' : 'hover:border-white/20'}`}
            >
              {isPremium && (
                <div className="absolute top-0 right-0">
                  <div className="bg-lux-gold text-lux-black text-[8px] font-bold px-3 py-1 uppercase tracking-widest translate-x-[20%] translate-y-[20%] rotate-45">
                    Privilège
                  </div>
                </div>
              )}

              <div className="space-y-6 relative z-10">
                <div className={`w-12 h-12 flex items-center justify-center rounded-sm border transition-all duration-500 ${skill.enabled ? 'bg-lux-gold/10 border-lux-gold/30 text-lux-gold' : 'bg-white/5 border-white/10 text-lux-text-muted'}`}>
                  <Icon className="size-5" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-lux-gold/60 font-medium">{skill.category}</span>
                    {skill.enabled ? (
                      <span className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-green-500/80">
                        <CheckCircle2 className="size-3" /> Actif
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-lux-text-muted">
                        <Circle className="size-3" /> Inactif
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-serif text-white tracking-tight group-hover:text-lux-gold transition-colors">{skill.name}</h3>
                  <p className="text-xs text-lux-text-muted leading-relaxed font-light">{skill.description}</p>
                </div>

                <button 
                  disabled={toggleSkill.isPending}
                  onClick={() => handleToggle(skill.id, skill.enabled)}
                  className={`w-full py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 border ${
                    skill.enabled 
                      ? 'bg-transparent border-white/10 text-white hover:bg-white/5' 
                      : isPremium && !skill.enabled
                        ? 'bg-lux-gold border-lux-gold text-lux-black hover:bg-white hover:border-white'
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  } disabled:opacity-50`}
                >
                  {toggleSkill.isPending ? 'Mise à jour...' : skill.enabled ? 'Désactiver' : isPremium ? 'Activer Privilège' : 'Activer Capacité'}
                </button>
              </div>

              {/* Subtle background glow */}
              <div className={`absolute -bottom-24 -right-24 w-48 h-48 rounded-full blur-[80px] transition-opacity duration-500 opacity-0 group-hover:opacity-20 ${isPremium ? 'bg-lux-gold' : 'bg-white'}`} />
            </div>
          );
        })}

        {/* Placeholder for suggesting new skills */}
        <div className="glass-card p-8 rounded-sm border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-4 hover:border-lux-gold/20 transition-all cursor-pointer group">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 group-hover:bg-lux-gold/10 transition-colors">
            <Plus className="size-5 text-lux-text-muted group-hover:text-lux-gold" />
          </div>
          <div>
            <h3 className="text-sm font-serif text-white uppercase tracking-widest">Suggérer une Skill</h3>
            <p className="text-[10px] text-lux-text-muted mt-2">Nous développons sans cesse de nouveaux pouvoirs pour Oscar.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
