SKILL: OpenClaw — Architecture & Troubleshooting (Gateway & Tokens)

Ce fichier complète `openclaw.md` en détaillant l'architecture d'authentification interne d'OpenClaw. Il sert de référence pour diagnostiquer et résoudre les erreurs de type `unauthorized` et `device_token_mismatch`.

---

### L'Architecture WebSockets & Gateway

OpenClaw n'est pas un simple script monolithique. Il est divisé en plusieurs composants qui communiquent localement :
1. **The Gateway (Le Serveur)** : Tourne en arrière-plan (souvent sur le port `18789`). C'est le chef d'orchestre qui gère les permissions, les connexions aux messageries (Discord, Telegram) et l'accès aux ressources systèmes.
2. **The Agent (Le Client)** : L'instance qui génère les requêtes LLM et décide des actions à prendre.
3. **The Tools (Les Outils)** : Des services isolés (comme `browser` pour puppeteer ou `exec` pour le shell) qui exécutent les actions ordonnées par l'agent, mais validées par le Gateway.

Ces composants communiquent entre eux via WebSockets locaux.

---

### La Cryptographie et l'Identité Locale

Parce que l'agent a accès au shell et au navigateur de l'utilisateur, OpenClaw utilise une architecture "Zero Trust" même en local. Chaque composant doit s'authentifier auprès du Gateway.

Toute l'identité cryptographique est stockée dans le dossier `~/.openclaw/identity/` :
*   **`device.json`** : Contient les clés cryptographiques publiques et privées (`publicKeyPem`, `privateKeyPem`) de l'agent.
*   **`device-auth.json`** : Gère l'état de l'authentification du périphérique.

Dans le fichier principal `~/.openclaw/openclaw.json`, on trouve également le **`gateway.auth.token`**. C'est un jeton de haute entropie utilisé pour authentifier les clients auprès du Gateway.

---

### L'Erreur : `device_token_mismatch`

**Symptôme :**
```log
[ws] unauthorized conn=... remote=127.0.0.1 client=agent backend vdev reason=device_token_mismatch
gateway connect failed: Error: unauthorized: device token mismatch (rotate/reissue device token)
[tools] browser failed: gateway closed (1008): unauthorized
```

**Cause :**
Une désynchronisation des tokens. Le Gateway s'attend à un token spécifique (ou une paire de clés spécifiques), mais l'Agent ou l'Outil (comme le `browser` ou `exec`) tente de s'y connecter avec un ancien token.
Cela arrive fréquemment lors de :
*   Mises à jour ou réécritures forcées du fichier `openclaw.json` (comme lors de notre intervention sur le champ `minimax/`).
*   Crash du Gateway laissant des processus "zombies" en arrière-plan.
*   Conflits entre les variables d'environnement Docker et les fichiers stockés dans le volume persistant.

---

### Procédures de Résolution (Troubleshooting)

Quand l'OpenClaw tombe dans cet état de sécurité de désynchronisation, l'agent perd l'accès à ses outils et refuse d'opérer.

#### Niveau 1 : Le Réalignement Automatique (Doctor)
La commande prévue nativement par OpenClaw pour réparer ça est :
```bash
openclaw doctor --fix
```
Cette commande tente de tuer les processus zombies, de forcer une rotation interne des tokens (reissue) et de resynchroniser le `gateway.auth.token`. 
*Note : Cette commande échouera silencieusement ou partira en boucle si le fichier `openclaw.json` contient des erreurs de syntaxe.*

#### Niveau 2 : Le Hard Reset de l'Identité (L'Option Nucléaire)
Si le Doctor ne parvient pas à réparer le *mismatch*, la solution la plus fiable est de forcer OpenClaw à recréer son identité de zéro.
Puisque OpenClaw est conçu pour recréer les fichiers manquants au démarrage, on peut purger le dossier d'identité manuellement dans le conteneur :
```bash
rm -rf ~/.openclaw/identity/*
rm ~/.openclaw/openclaw.json.bak
rm ~/.openclaw/devices/paired.json
```
Puis on redémarre le processus/conteneur Gateway. Au démarrage, il va générer de nouveaux `device.json` et un nouveau `gateway.auth.token` parfaitement synchronisés.
