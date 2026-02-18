import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { login, register } from '@/lib/api'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(email, password)
      }
      navigate({ to: '/dashboard' })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-lux-black text-lux-text font-sans flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10"></div>
      <div className="absolute inset-0 noise-overlay"></div>
      
      <div className="w-full max-w-md space-y-12 relative z-10 glass-card p-12 rounded-sm border-lux-gold/20">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 relative flex items-center justify-center group">
              <div className="absolute inset-0 bg-lux-gold/10 rotate-45 border border-lux-gold/30"></div>
              <span className="material-icons-outlined text-lux-gold text-3xl">diamond</span>
            </div>
          </div>
          <h1 className="text-4xl font-serif font-medium tracking-tight text-white">
            {mode === 'login' ? 'Accès Privé' : 'Registre Client'}
          </h1>
          <p className="text-xs uppercase tracking-[0.3em] text-lux-gold font-semibold">
            {mode === 'login'
              ? 'Veuillez vous identifier'
              : 'Sur Invitation Uniquement'}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-8">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-[10px] uppercase tracking-[0.2em] text-lux-text-muted">
              Identifiant Sécurisé (Email)
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-lux-charcoal/50 border border-lux-border rounded-none px-4 py-3 text-sm focus:border-lux-gold/50 outline-none transition-colors placeholder:text-gray-700"
              placeholder="v-vip@nexus-prive.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-[10px] uppercase tracking-[0.2em] text-lux-text-muted">
              Mot de Passe Crypté
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-lux-charcoal/50 border border-lux-border rounded-none px-4 py-3 text-sm focus:border-lux-gold/50 outline-none transition-colors"
              required
              minLength={mode === 'register' ? 8 : 1}
            />
            {mode === 'register' && (
              <p className="text-[10px] text-lux-gold/60 uppercase tracking-widest">8 caractères minimum requis</p>
            )}
          </div>
          
          {error && (
            <p className="text-xs text-red-500 bg-red-500/5 border border-red-500/20 px-4 py-3 text-center uppercase tracking-widest">
              {error}
            </p>
          )}

          <button 
            type="submit" 
            className="w-full bg-lux-gold text-lux-black font-serif font-bold py-4 text-lg hover:bg-white transition-all duration-500 shadow-[0_0_20px_rgba(198,168,124,0.1)] active:scale-95 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Traitement...' : mode === 'login' ? 'S’identifier' : 'S’inscrire'}
          </button>
        </form>

        <div className="pt-8 border-t border-white/5 flex flex-col items-center gap-6">
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-[10px] uppercase tracking-[0.25em] text-lux-text-muted hover:text-lux-gold transition-colors"
          >
            {mode === 'login' ? "Demander un Compte" : "Retour au Coffre"}
          </button>
          
          <Link to="/" className="text-[10px] uppercase tracking-[0.25em] text-lux-gold flex items-center gap-2 group">
            <span className="material-icons-outlined text-xs transition-transform group-hover:-translate-x-1">arrow_back</span>
            Retour à l’Entrée
          </Link>
        </div>
      </div>
    </div>
  )
}
