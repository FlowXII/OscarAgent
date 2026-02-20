import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useTRPC } from '@/integrations/trpc/react'
import { useState, useEffect } from 'react'
import { 
  Terminal, 
  RefreshCw, 
  Save, 
  MessageSquare,
  Settings,
  AlertTriangle
} from 'lucide-react'

export const Route = createFileRoute('/dashboard/admin')({
  component: AdminDebugPage,
})

export function AdminDebugPage() {
  const trpc = useTRPC()
  const { data: agent } = useQuery(trpc.agents.get.queryOptions())
  const { data: config } = useQuery(trpc.admin.getAgentConfig.queryOptions())
  const { data: logs } = useQuery(trpc.admin.getAgentLogs.queryOptions())
  
  const updateEnv = useMutation(trpc.admin.updateAgentEnv.mutationOptions())
  const restartAgent = useMutation(trpc.admin.restartAgent.mutationOptions())
  const testDiscord = useMutation(trpc.admin.testDiscord.mutationOptions())

  const [discordToken, setDiscordToken] = useState('')
  const [anthropicKey, setAnthropicKey] = useState('')
  const [openaiKey, setOpenaiKey] = useState('')
  const [minimaxKey, setMinimaxKey] = useState('')
  const [aiModel, setAiModel] = useState('MiniMax-M2.5')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Sync with current config when it loads
  useEffect(() => {
    if (config?.envVars) {
      const vars = config.envVars as Record<string, string>
      if (vars.DISCORD_BOT_TOKEN) setDiscordToken(vars.DISCORD_BOT_TOKEN)
      if (vars.ANTHROPIC_API_KEY) setAnthropicKey(vars.ANTHROPIC_API_KEY)
      if (vars.OPENAI_API_KEY) setOpenaiKey(vars.OPENAI_API_KEY)
      if (vars.MINIMAX_API_KEY) setMinimaxKey(vars.MINIMAX_API_KEY)
      if (vars.OPENCLAW_MODEL) setAiModel(vars.OPENCLAW_MODEL)
    }
  }, [config])

  const handleSaveEnv = () => {
    const envVars: Record<string, string> = {}
    
    if (discordToken) envVars.DISCORD_BOT_TOKEN = discordToken
    if (anthropicKey) envVars.ANTHROPIC_API_KEY = anthropicKey
    if (openaiKey) envVars.OPENAI_API_KEY = openaiKey
    if (minimaxKey) envVars.MINIMAX_API_KEY = minimaxKey
    if (aiModel) envVars.OPENCLAW_MODEL = aiModel
    
    updateEnv.mutate({ envVars }, {
      onSuccess: () => {
        setSaveStatus('success')
        setTimeout(() => setSaveStatus('idle'), 3000)
      },
      onError: () => {
        setSaveStatus('error')
        setTimeout(() => setSaveStatus('idle'), 3000)
      }
    })
  }

  const handleRestart = () => {
    if (confirm('Redémarrer le container va interrompre l\'agent. Continuer ?')) {
      restartAgent.mutate()
    }
  }

  const handleTestDiscord = () => {
    testDiscord.mutate({ token: discordToken })
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Warning Banner */}
      <div className="glass-card p-4 border-lux-gold/30 bg-lux-gold/5">
        <div className="flex items-center gap-3">
          <AlertTriangle className="size-5 text-lux-gold" />
          <div>
            <h3 className="text-sm font-bold text-lux-gold uppercase tracking-widest">Interface Admin</h3>
            <p className="text-xs text-lux-text-muted mt-1">Accès direct aux containers OpenClaw. Modifications en temps réel.</p>
          </div>
        </div>
      </div>

      {/* Agent Status */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Terminal className="size-5 text-lux-gold" />
            <h2 className="text-xl font-serif text-white">Agent Status</h2>
          </div>
          <button
            onClick={handleRestart}
            disabled={restartAgent.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs uppercase tracking-widest transition-all disabled:opacity-50"
          >
            <RefreshCw className={`size-4 ${restartAgent.isPending ? 'animate-spin' : ''}`} />
            Restart Container
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-sm">
            <p className="text-xs text-lux-text-muted uppercase tracking-widest mb-1">Status</p>
            <p className="text-lg font-mono text-lux-gold">{agent?.status || 'N/A'}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-sm">
            <p className="text-xs text-lux-text-muted uppercase tracking-widest mb-1">Container ID</p>
            <p className="text-sm font-mono text-white truncate">{agent?.containerId || 'N/A'}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-sm">
            <p className="text-xs text-lux-text-muted uppercase tracking-widest mb-1">Port</p>
            <p className="text-lg font-mono text-lux-gold">{agent?.port || 'N/A'}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-sm">
            <p className="text-xs text-lux-text-muted uppercase tracking-widest mb-1">Memory</p>
            <p className="text-lg font-mono text-lux-gold">2GB</p>
          </div>
        </div>
      </div>

      {/* Discord Configuration */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="size-5 text-lux-gold" />
          <h2 className="text-xl font-serif text-white">Discord Integration</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-lux-text-muted uppercase tracking-widest mb-2">
              Bot Token
            </label>
            <input
              type="password"
              value={discordToken}
              onChange={(e) => setDiscordToken(e.target.value)}
              placeholder="MTIzNDU2Nzg5MDEyMzQ1Njc4OQ.GaBcDe.FgHiJkLmNoPqRsTuVwXyZ..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white font-mono text-sm focus:border-lux-gold/50 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleTestDiscord}
              disabled={!discordToken || testDiscord.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-xs uppercase tracking-widest transition-all disabled:opacity-50"
            >
              <MessageSquare className="size-4" />
              Test Connection
            </button>
            <button
              onClick={handleSaveEnv}
              disabled={updateEnv.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-lux-gold hover:bg-white border border-lux-gold text-lux-black text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50"
            >
              <Save className="size-4" />
              Save & Apply
            </button>
          </div>

          {testDiscord.isSuccess && (
            <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
              ✓ Discord connection successful!
            </div>
          )}
          {testDiscord.isError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              ✗ Connection failed. Check your token.
            </div>
          )}
        </div>
      </div>

      {/* AI API Configuration */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="size-5 text-lux-gold" />
          <h2 className="text-xl font-serif text-white">AI Configuration</h2>
        </div>

        <div className="space-y-4">
          {/* AI Model Selector */}
          <div>
            <label className="block text-xs text-lux-text-muted uppercase tracking-widest mb-2">
              Modèle AI
            </label>
            <select
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm focus:border-lux-gold/50 focus:outline-none transition-colors"
            >
              <optgroup label="Minimax (Économique)">
                <option value="minimax/MiniMax-M2.5">MiniMax M2.5 (Recommandé)</option>
                <option value="minimax/MiniMax-M2.5-highspeed">MiniMax M2.5 High Speed</option>
                <option value="minimax/MiniMax-M2.1">MiniMax M2.1</option>
              </optgroup>
              <optgroup label="Anthropic (Claude)">
                <option value="anthropic/claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
                <option value="anthropic/claude-3-5-haiku-20241022">Claude 3.5 Haiku</option>
                <option value="anthropic/claude-opus-4-6">Claude Opus 4 (Cher)</option>
              </optgroup>
              <optgroup label="OpenAI (GPT)">
                <option value="openai/gpt-4o">GPT-4o</option>
                <option value="openai/gpt-4o-mini">GPT-4o Mini</option>
                <option value="openai/gpt-4-turbo">GPT-4 Turbo</option>
              </optgroup>
            </select>
            <p className="text-xs text-lux-text-muted mt-2">
              Minimax recommandé pour économiser. Claude 3.5 Sonnet pour la qualité.
            </p>
          </div>

          <div>
            <label className="block text-xs text-lux-text-muted uppercase tracking-widest mb-2">
              Anthropic API Key (Claude)
            </label>
            <input
              type="password"
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
              placeholder="sk-ant-api03-..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white font-mono text-sm focus:border-lux-gold/50 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-lux-text-muted uppercase tracking-widest mb-2">
              OpenAI API Key (GPT)
            </label>
            <input
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="sk-proj-..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white font-mono text-sm focus:border-lux-gold/50 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-lux-text-muted uppercase tracking-widest mb-2">
              Minimax API Key
            </label>
            <input
              type="password"
              value={minimaxKey}
              onChange={(e) => setMinimaxKey(e.target.value)}
              placeholder="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white font-mono text-sm focus:border-lux-gold/50 focus:outline-none transition-colors"
            />
          </div>

          {/* Save Feedback */}
          {saveStatus === 'success' && (
            <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <span className="text-lg">✓</span>
              <span>Clés API sauvegardées avec succès ! L'agent utilisera ces clés au prochain redémarrage.</span>
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <span className="text-lg">✗</span>
              <span>Erreur lors de la sauvegarde. Vérifiez que l'agent existe.</span>
            </div>
          )}

          <p className="text-xs text-lux-text-muted">
            OpenClaw utilisera la première clé disponible. Anthropic recommandé pour Claude 3.5 Sonnet.
          </p>
        </div>
      </div>

      {/* Environment Variables */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="size-5 text-lux-gold" />
          <h2 className="text-xl font-serif text-white">Environment Variables</h2>
        </div>

        <div className="space-y-3">
          {config?.envVars && Object.entries(config.envVars as Record<string, string>).map(([key, value]) => (
            <div key={key} className="flex gap-3">
              <input
                type="text"
                value={key}
                disabled
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 text-lux-text-muted font-mono text-sm"
              />
              <input
                type="text"
                value={value}
                disabled
                className="flex-[2] px-3 py-2 bg-white/5 border border-white/10 text-white font-mono text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Container Logs */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Terminal className="size-5 text-lux-gold" />
          <h2 className="text-xl font-serif text-white">Container Logs</h2>
        </div>

        <div className="bg-black/50 p-4 rounded-sm border border-white/10 font-mono text-xs text-green-400 max-h-96 overflow-y-auto">
          {logs ? (
            <pre className="whitespace-pre-wrap">{logs}</pre>
          ) : (
            <p className="text-lux-text-muted">No logs available</p>
          )}
        </div>
      </div>
    </div>
  )
}
