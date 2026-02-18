import React, { useEffect, useState } from 'react'

export const LandingPage: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="bg-lux-black text-lux-text font-sans antialiased overflow-x-hidden selection:bg-lux-gold selection:text-black">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none z-0 grid-bg opacity-30"></div>
      <div className="fixed inset-0 pointer-events-none z-0 noise-overlay"></div>

      {/* Navigation */}
      <nav 
        className={`fixed w-full z-50 transition-all duration-500 border-b ${
          scrolled 
            ? 'bg-lux-black/90 backdrop-blur-xl border-white/5 py-4' 
            : 'bg-transparent border-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 relative flex items-center justify-center group cursor-pointer">
                <div className="absolute inset-0 bg-lux-gold/10 rotate-45 border border-lux-gold/30 transition-transform duration-500 group-hover:rotate-90"></div>
                <div className="absolute inset-0 bg-lux-gold/5 rotate-12 border border-lux-gold/10 transition-transform duration-700 group-hover:-rotate-12"></div>
                <span className="material-icons-outlined text-lux-gold relative z-10 text-2xl">diamond</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-display font-bold tracking-[0.2em] text-white uppercase">Nexus</h1>
                <div className="flex items-center gap-2">
                  <div className="h-[1px] w-4 bg-lux-gold"></div>
                  <p className="text-[9px] font-sans text-lux-gold tracking-[0.3em] uppercase">Privé Concierge</p>
                </div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-14">
              {['L’Art', 'Accès', 'Contrôle'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(' ', '-')}`}
                  className="text-xs font-medium tracking-[0.2em] text-lux-text-muted hover:text-lux-gold transition-colors uppercase relative group py-2"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-lux-gold transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
              <a 
                href="/login"
                className="px-8 py-3 border border-lux-gold/40 text-lux-gold hover:bg-lux-gold hover:text-black hover:border-lux-gold transition-all duration-500 text-xs font-bold tracking-[0.15em] uppercase animate-glow"
              >
                Accès Client
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-lux-gold/10 via-transparent to-transparent opacity-40 blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-blue-900/10 via-transparent to-transparent opacity-30 blur-[80px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center z-10 relative">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-lux-gold/30 bg-lux-black/40 backdrop-blur-md">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lux-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-lux-gold"></span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-lux-gold font-semibold">Sur Invitation Uniquement</span>
            </div>

            <h1 className="text-6xl lg:text-8xl font-serif font-medium leading-[0.95] text-white tracking-tight">
              Votre <br/>
              <span className="italic text-lux-gold font-light relative">
                Majordome
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-lux-gold/30" preserveAspectRatio="none" viewBox="0 0 100 10">
                  <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="2"></path>
                </svg>
              </span>
              <br/> Digital
            </h1>

            <p className="text-lg text-lux-text-muted font-light leading-relaxed max-w-xl border-l border-lux-gold/40 pl-8">
              Nexus Privé déploie l'intelligence souveraine d'OpenClaw. Exécution complexe de logistique, voyages et gestion de style de vie, instantanément via WhatsApp sécurisé.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-6">
              <a href="/login" className="group px-10 py-4 bg-lux-gold text-lux-black font-serif font-bold text-lg hover:bg-white transition-all duration-500 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(198,168,124,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]">
                <span>Demander l'Accès</span>
                <span className="material-icons-outlined text-sm transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
              </a>
              <button className="px-10 py-4 border border-white/20 hover:border-lux-gold text-white font-sans font-light text-sm tracking-widest uppercase transition-colors duration-300 flex items-center justify-center gap-3 group">
                <span className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:border-lux-gold transition-colors">
                  <span className="material-icons-outlined text-xs group-hover:text-lux-gold transition-colors">play_arrow</span>
                </span>
                <span>Voir la Démo</span>
              </button>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="relative lg:h-[850px] flex items-center justify-center perspective-[2000px]">
            <div className="absolute inset-0 z-0">
              <svg className="w-full h-full opacity-20" viewBox="0 0 400 800">
                <circle className="animate-[spin_60s_linear_infinite]" cx="200" cy="400" fill="none" r="180" stroke="#C6A87C" strokeDasharray="4 4" strokeWidth="0.5"></circle>
                <circle className="animate-[spin_80s_linear_infinite_reverse]" cx="200" cy="400" fill="none" r="240" stroke="#C6A87C" strokeWidth="0.2"></circle>
              </svg>
            </div>
            
            <div className="relative w-[340px] h-[680px] bg-black rounded-[50px] border-[6px] border-[#1a1a1a] ring-1 ring-[#333] shadow-[0_0_30px_rgba(198,168,124,0.1)] animate-float overflow-hidden z-20 transition-transform duration-700 hover:rotate-0">
              <div className="absolute inset-0 rounded-[44px] border-[8px] border-black pointer-events-none z-50"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-50"></div>
              
              <div className="w-full h-full bg-[#0b141a] flex flex-col relative font-sans">
                {/* Chat Header */}
                <div className="bg-lux-charcoal/95 backdrop-blur-sm px-5 pt-12 pb-3 flex items-center gap-3 border-b border-white/5 z-10">
                  <span className="material-icons-outlined text-lux-gold text-lg">arrow_back_ios</span>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-lux-gold to-lux-gold-dark flex items-center justify-center text-black font-serif font-bold text-sm shadow-lg shadow-lux-gold/20">O</div>
                  <div className="flex-1">
                    <h3 className="text-white text-sm font-medium tracking-wide">Oscar</h3>
                    <p className="text-lux-gold text-[10px] uppercase tracking-wider font-semibold">En ligne</p>
                  </div>
                  <span className="material-icons-outlined text-lux-gold/70">videocam</span>
                  <span className="material-icons-outlined text-lux-gold/70 ml-3">call</span>
                </div>

                {/* Chat Content */}
                <div className="flex-1 p-4 space-y-6 overflow-hidden relative bg-[#080808]">
                  <div className="flex justify-center relative z-10">
                    <span className="bg-[#1f2c34]/80 backdrop-blur text-lux-text-muted text-[10px] px-3 py-1 rounded-full border border-white/5 uppercase tracking-widest font-medium">Aujourd'hui</span>
                  </div>
                  
                  <div className="flex justify-end relative z-10 text-right">
                    <div className="chat-bubble-user p-3 max-w-[85%] inline-block">
                      <p className="text-sm font-light leading-relaxed text-gray-200">Organise un vol pour Paris demain matin, classe affaires. Réserve une suite au Ritz, mes préférences habituelles.</p>
                      <div className="flex justify-end items-center gap-1 mt-1.5 opacity-60">
                        <span className="text-[9px]">10:42</span>
                        <span className="material-icons-outlined text-[10px] text-blue-400">done_all</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-start relative z-10">
                    <div className="chat-bubble-agent p-3 max-w-[85%]">
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                        <span className="text-lux-gold text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-lux-gold rounded-full animate-pulse"></span>
                          Intelligence Oscar
                        </span>
                      </div>
                      <div className="space-y-1 mb-2">
                        <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                          <span>Recherche : Vols</span>
                          <span className="text-green-500">Prêt</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                          <span>Check : Ritz Vendôme</span>
                          <span className="text-lux-gold animate-pulse">En cours...</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-start relative z-10">
                    <div className="chat-bubble-agent p-3 max-w-[85%]">
                      <p className="text-sm font-light leading-relaxed text-gray-200">Confirmé. Air France AF1380, Siège 1A. Ritz Place Vendôme, Grand Suite réservée.</p>
                      <div className="mt-3 bg-black/40 rounded border border-white/5 p-2 flex items-center gap-3 cursor-pointer hover:border-lux-gold/30 transition-colors group">
                        <div className="w-10 h-10 bg-lux-gold/10 rounded flex items-center justify-center border border-lux-gold/20 group-hover:bg-lux-gold/20">
                          <span className="material-icons-outlined text-lux-gold text-sm">description</span>
                        </div>
                        <div className="text-left">
                          <p className="text-xs text-white font-medium">Itinéraire_Paris.pdf</p>
                          <p className="text-[10px] text-lux-gold">Appuyez pour voir • 1.2 MB</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Input */}
                <div className="bg-[#1a1a1a] p-3 flex items-center gap-3 border-t border-white/5 relative z-10">
                  <span className="material-icons-outlined text-lux-gold/50">add</span>
                  <div className="bg-[#050505] flex-1 rounded-full px-4 py-2 border border-white/5 flex justify-between items-center">
                    <p className="text-gray-600 text-xs font-light">Message Oscar...</p>
                    <span className="material-icons-outlined text-gray-600 text-sm">mic</span>
                  </div>
                  <span className="material-icons-outlined text-lux-gold/50">camera_alt</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Powered By Section */}
      <section className="py-32 relative bg-[#080808]" id="lart">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-28">
            <span className="text-lux-gold text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Propulsé par OpenClaw</span>
            <h2 className="text-4xl lg:text-6xl font-serif text-white mb-8">L'Art du Service <span className="italic text-lux-gold font-light">Autonome</span></h2>
            <div className="w-[1px] h-16 bg-gradient-to-b from-lux-gold to-transparent mx-auto mb-8"></div>
            <p className="text-lux-text-muted max-w-2xl mx-auto font-light leading-relaxed text-lg">
              Nexus Privé n'est pas un chatbot. C'est un agent capable, doté de l'autorité souveraine pour exécuter des transactions, gérer la logistique et orchestrer votre vie sans friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Compréhension Cognitive',
                icon: 'neurology',
                desc: 'Au-delà des mots-clés. Oscar saisit le contexte, les préférences et les nuances, s’adaptant à votre style de communication comme un majordome expérimenté.'
              },
              {
                title: 'Exécution Autonome',
                icon: 'account_balance_wallet',
                desc: 'Habilité à transcrire l’intention en action. De la réservation de jets privés aux tables inaccessibles, il agit instantanément pour vous.'
              },
              {
                title: 'Confidentialité Souveraine',
                icon: 'lock',
                desc: 'Vos données sont cryptées et isolées. Votre majordome opère avec la discrétion absolue d’un concierge de haut rang, garantissant votre vie privée.'
              }
            ].map((feature) => (
              <div key={feature.title} className="glass-card p-10 rounded-sm group relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-lux-gold/5 rounded-full blur-2xl group-hover:bg-lux-gold/10 transition-colors"></div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-b from-white/5 to-transparent border border-white/10 flex items-center justify-center mb-8 group-hover:border-lux-gold/50 transition-colors shadow-lg">
                  <span className="material-symbols-outlined text-3xl text-lux-gold font-light">{feature.icon}</span>
                </div>
                <h3 className="text-2xl font-serif text-white mb-4">{feature.title}</h3>
                <p className="text-lux-text-muted font-light text-sm leading-7">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp Access Section */}
      <section className="py-32 bg-lux-black relative overflow-hidden border-t border-white/5" id="acces">
        <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-wa-dark/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
          <div className="order-2 lg:order-1 relative group">
            <div className="absolute inset-0 bg-lux-gold/5 transform rotate-3 translate-x-2 translate-y-2 border border-white/5 rounded-sm transition-transform duration-700 group-hover:rotate-6 group-hover:translate-x-4"></div>
            <div className="relative z-10 glass-card p-10 border-l-4 border-wa-green/60 rounded-sm">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-wa-green to-wa-dark rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.3)] ring-4 ring-black/50">
                    <span className="material-icons-outlined text-white text-2xl">whatsapp</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-wide">Ligne Directe</h3>
                    <p className="text-[10px] text-lux-gold uppercase tracking-[0.2em] font-medium">Canal Prioritaire</p>
                  </div>
                </div>
                <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse"></span>
              </div>
              
              <div className="space-y-8">
                {[
                  { title: 'Zéro Friction', desc: 'Vous utilisez déjà WhatsApp. Votre majordome aussi. Pas de login, pas d’application supplémentaire.' },
                  { title: 'Entrée Multimédia', desc: 'Envoyez des messages vocaux en conduisant, des photos de reçus ou votre position en direct.' },
                  { title: 'Disponibilité 24/7', desc: 'Oscar ne dort jamais, ne prend pas de pause et répond en quelques secondes, partout dans le monde.' }
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-5 group/item">
                    <div className="w-6 h-6 rounded-full border border-wa-green/30 flex items-center justify-center mt-1 group-hover/item:bg-wa-green/10 transition-colors">
                      <span className="material-icons-outlined text-wa-green text-xs">check</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1 text-lg">{item.title}</h4>
                      <p className="text-lux-text-muted text-sm font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-5xl lg:text-6xl font-serif text-white mb-8 leading-tight">Accès Direct. <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-600">Zéro Friction.</span></h2>
            <p className="text-lux-text-muted font-light text-lg leading-8 mb-12">
              Les services de conciergerie traditionnels imposent des appels ou des emails fastidieux. Oscar réside là où vous communiquez déjà. Un simple message déclenche une chaîne complexe de logistique automatisée.
            </p>
            <button className="flex items-center gap-4 text-white group relative pl-4">
              <span className="absolute left-0 top-0 bottom-0 w-[1px] bg-wa-green h-full scale-y-50 group-hover:scale-y-100 transition-transform origin-center"></span>
              <span className="text-sm font-bold uppercase tracking-[0.2em] group-hover:text-wa-green transition-colors">Démarrer la Conversation</span>
              <span className="material-icons-outlined text-sm group-hover:translate-x-2 transition-transform text-wa-green">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* Mission Control Section */}
      <section className="py-32 bg-[#090909] relative border-t border-white/5 overflow-hidden" id="controle">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div>
              <h2 className="text-4xl lg:text-6xl font-serif text-white mb-6">Contrôle de Mission</h2>
              <p className="text-lux-text-muted font-light max-w-lg text-lg">
                Si l'interaction se passe sur WhatsApp, votre tableau de bord personnel vous offre une vue globale sur toutes les tâches actives, dépenses et archives.
              </p>
            </div>
            <a href="/login" className="px-8 py-3 border border-lux-gold text-lux-gold text-xs font-bold tracking-[0.15em] uppercase transition-all hover:bg-lux-gold hover:text-black shadow-[0_0_15px_rgba(198,168,124,0.1)] hover:shadow-[0_0_25px_rgba(198,168,124,0.3)]">
              Voir le Dashboard
            </a>
          </div>

          {/* Dashboard Preview */}
          <div className="relative w-full rounded-lg border border-white/10 bg-[#0C0C0C] overflow-hidden shadow-2xl group ring-1 ring-white/5">
            <div className="h-14 bg-[#141414] border-b border-white/5 flex items-center px-6 gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-black/40 px-6 py-1.5 rounded text-[10px] text-gray-500 font-mono flex items-center gap-2 border border-white/5">
                  <span className="material-icons-outlined text-[10px]">lock</span>
                  nexus-prive.com/dashboard
                </div>
              </div>
            </div>

            <div className="p-10 bg-[#0A0A0A] grid grid-cols-12 gap-8 min-h-[500px] relative z-10">
              <div className="col-span-12 md:col-span-3 border-r border-white/5 pr-8 space-y-4 hidden md:block">
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-8 h-8 bg-lux-gold/20 rounded flex items-center justify-center text-lux-gold font-serif font-bold">N</div>
                  <span className="text-white font-medium tracking-wide">Nexus P.</span>
                </div>
                {['Active Tasks', 'Concierge Log', 'Payments', 'Preferences'].map((nav, i) => (
                  <div key={nav} className={`h-12 w-full rounded flex items-center px-4 ${i === 0 ? 'bg-white/5 border-l-2 border-lux-gold text-white' : 'text-gray-500'} cursor-pointer hover:bg-white/5 hover:text-white transition-colors`}>
                    <span className="text-sm">{nav}</span>
                  </div>
                ))}
              </div>

              <div className="col-span-12 md:col-span-9 space-y-8">
                <div className="flex justify-between items-center pb-6 border-b border-white/5">
                  <h3 className="text-2xl text-white font-serif">Aperçu</h3>
                  <button className="bg-lux-gold text-black text-xs font-bold px-4 py-2 uppercase tracking-wide rounded-sm hover:bg-white transition-colors">
                    + Nouvelle Requête
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { title: 'Voyage Paris', desc: 'AF1380 • Ritz Vendôme', color: 'lux-gold', status: 'Confirmé', progress: 'bg-green-500', width: 'w-full' },
                    { title: 'Réservation Nobu', desc: 'Tokyo • 4 Pers • Salon Privé', color: 'purple-500', status: 'En attente', progress: 'bg-yellow-500', width: 'w-[60%]', animate: true },
                    { title: 'Vintage Rare', desc: 'Patek 5711 • Recherche Dealer', color: 'blue-500', status: 'Recherche', progress: 'bg-blue-500', width: 'w-[30%]' }
                  ].map((card) => (
                    <div key={card.title} className="h-56 rounded bg-[#111] border border-white/5 p-6 relative overflow-hidden hover:border-lux-gold/30 transition-colors">
                      <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-${card.color} to-transparent`}></div>
                      <div className="flex justify-between items-start mb-6">
                        <div className={`w-12 h-12 rounded bg-${card.color}/5 flex items-center justify-center border border-${card.color}/10`}>
                          <span className="material-icons-outlined text-white/50">stars</span>
                        </div>
                        <span className="text-[10px] uppercase opacity-70 tracking-widest">{card.status}</span>
                      </div>
                      <h4 className="text-white text-lg font-medium mb-1">{card.title}</h4>
                      <p className="text-sm text-gray-500 mb-6">{card.desc}</p>
                      <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                        <div className={`${card.progress} h-full ${card.width} ${card.animate ? 'animate-pulse' : ''}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-lux-border py-24 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-lux-gold/5 blur-[120px] pointer-events-none rounded-full"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 md:col-span-2 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 border border-lux-gold/30 flex items-center justify-center bg-lux-gold/5">
                  <span className="material-icons-outlined text-lux-gold text-xl">diamond</span>
                </div>
                <h2 className="text-2xl font-display font-bold text-white uppercase tracking-[0.2em]">Nexus</h2>
              </div>
              <p className="text-lux-text-muted font-light max-w-sm text-sm leading-7">
                Le majordome autonome le plus avancé au monde. Redéfinir le service de luxe par l'intelligence artificielle, la souveraineté et l'intégration parfaite.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/10 rounded-full bg-white/5">
                <span className="material-icons-outlined text-lux-gold text-xs">verified</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">Membre du Cercle Privé 2024</span>
              </div>
            </div>
            {['Plateforme', 'Société'].map((title) => (
              <div key={title}>
                <h4 className="text-white font-serif font-bold mb-8 tracking-wide">{title}</h4>
                <ul className="space-y-4 text-xs font-medium uppercase tracking-widest text-gray-500">
                  {title === 'Plateforme' 
                    ? ['Intelligence', 'Sécurité', 'Tarifs', 'Accès API'].map((l) => <li key={l}><a href="#" className="hover:text-lux-gold transition-colors">{l}</a></li>)
                    : ['À propos', 'Carrières', 'Légal', 'Contact'].map((l) => <li key={l}><a href="#" className="hover:text-lux-gold transition-colors">{l}</a></li>)
                  }
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] text-gray-600 font-light tracking-wider uppercase">© 2024 Nexus Privé. Tous droits réservés.</p>
            <div className="flex gap-8">
              {['Twitter', 'LinkedIn', 'Instagram'].map((s) => (
                <a key={s} href="#" className="text-gray-600 hover:text-lux-gold transition-colors text-xs uppercase tracking-widest">{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
