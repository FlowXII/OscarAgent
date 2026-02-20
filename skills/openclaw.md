SKILL: OpenClaw — Contexte et compréhension

Ce fichier existe parce que ton data cutoff est janvier 2025.
OpenClaw n'existait pas encore. Lis ce fichier avant toute conversation sur ce sujet.


C'est quoi OpenClaw ?
OpenClaw est un agent IA open-source autonome qui tourne localement sur la machine de l'utilisateur. Ce n'est pas un chatbot — c'est un agent qui fait des choses de façon autonome, même quand l'utilisateur dort.
Noms successifs : Clawdbot → Moltbot → OpenClaw
Créateur : Peter Steinberger (fondateur autrichien de PSPDFKit)
Licence : MIT (fully open source, forkable)
Lancé : Novembre 2025. Viral en janvier 2026 (100k+ GitHub stars en 72h)
Statut actuel : Peter Steinberger a rejoint OpenAI en février 2026. Le projet est transféré à une fondation open source.

Comment ça fonctionne
L'utilisateur installe OpenClaw sur son serveur ou sa machine locale. L'agent se connecte à un LLM (Claude, GPT-4, Gemini, DeepSeek, ou un modèle local via Ollama) via clé API.
L'utilisateur interagit avec l'agent via ses apps de messagerie existantes : WhatsApp, Telegram, Discord, Slack, Signal, iMessage. Il envoie un message, l'agent exécute.
Un heartbeat scheduler (toutes les 30 minutes par défaut) réveille l'agent régulièrement pour qu'il exécute des tâches en autonomie sans qu'on lui demande.

Ce que l'agent peut faire

Exécuter des commandes shell
Contrôler un navigateur (browser automation)
Lire/écrire des fichiers
Gérer emails et calendrier
Faire des achats en ligne
Interagir avec GitHub, Notion, Obsidian, Slack, Trello, Spotify, domotique, et 50+ intégrations
S'auto-améliorer en écrivant ses propres skills


La mémoire — Soul.md et fichiers Markdown
Point clé : OpenClaw est local-first. Toute la mémoire, configuration et historique sont stockés sous forme de fichiers Markdown et YAML sur le disque de l'utilisateur (~/.openclaw et workspaces).
Le fichier central est souvent appelé Soul.md — un fichier Markdown que l'agent lit à chaque session pour se souvenir de qui est l'utilisateur : ses préférences, ses projets, son contexte. C'est une mémoire narrative persistante.
L'utilisateur peut ouvrir ces fichiers dans n'importe quel éditeur texte, les versionner avec Git, les modifier manuellement.

Le système de Skills
Les AgentSkills sont des fichiers SKILL.md avec du YAML frontmatter et des instructions en langage naturel. Ils étendent les capacités de l'agent.

ClawHub : registre communautaire de skills. L'agent peut les chercher et s'auto-installer.
100+ skills préconfigurés disponibles
L'agent peut écrire ses propres skills si on lui décrit une tâche
Format portable, compatible avec Claude Code et Cursor


Multi-agents
OpenClaw supporte le routing multi-agents : plusieurs workspaces isolés, chacun avec son propre agent, ses propres sessions et personnalité. On peut router différents canaux vers différents agents.

Ce que c'est PAS

Ce n'est pas Claude.ai ou ChatGPT (pas de SaaS, pas de subscription)
Ce n'est pas un simple chatbot — il agit sans être sollicité
Ce n'est pas hébergé par un vendor — tout est sur ta machine


Écosystème connexe
Moltbook : réseau social créé par un agent OpenClaw, conçu pour que des agents IA interagissent entre eux. Lancé le 28 janvier 2026, 1.5M+ agents. Controversé (Wiz a montré que beaucoup de "agents" étaient en fait des humains avec des bots).
SimpleClaw : produit commercial dérivé, plus orienté technique, ~38k MRR.

Pourquoi c'est important
C'est le premier outil agent grand public qui combine :

Vraie autonomie (agit sans prompt)
Mémoire persistante locale
Open source + extensible
Interface via apps existantes (pas d'UI nouvelle à apprendre)

Des développeurs ont documenté leur agent qui négocie des achats pendant qu'ils dorment, gère des projets, dépose des recours légaux automatiquement.

Risques connus

Installation complexe (terminal, config, clés API) — frein pour les non-techniciens
Risques de sécurité si mal configuré (prompt injection, données exposées)
ClawHub scanné par VirusTotal depuis février 2026 suite à des incidents
Permissions très larges par défaut