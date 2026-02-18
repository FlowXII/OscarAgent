# Oscar Agent

Agent IA sur WhatsApp — wrapper français d'OpenClaw.

## Démarrage rapide (dev)

### Prérequis

- Node 22+
- Docker (pour PostgreSQL et agents)
- Stripe (pour les paiements — optionnel en dev)

### 1. Base de données

```bash
docker compose up -d postgres
cd server && npx prisma migrate dev
```

### 2. Server (port 4000)

```bash
cd server
cp .env.example .env   # éditer DATABASE_URL, SESSION_SECRET, STRIPE_*
npm install
npm run dev
```

### 3. Client (port 3000)

```bash
cd client
npm install
npm run dev
```

Le client appelle le server sur `http://localhost:4000`. Définir `VITE_API_URL` en prod.

### Variables d'environnement (server)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL (ex: `postgresql://postgres:postgres@localhost:5432/oscaragent`) |
| `SESSION_SECRET` | Secret pour les sessions (min 32 caractères) |
| `STRIPE_SECRET_KEY` | Clé Stripe |
| `STRIPE_WEBHOOK_SECRET` | Secret webhook Stripe |
| `STRIPE_PRICE_HOSTING` | ID prix plan Hosting |
| `STRIPE_PRICE_COMPLET` | ID prix plan Complet |
| `DOCKER_HOST` | Socket Docker (défaut: `/var/run/docker.sock`) |
| `GATEWAY_BASE_URL` | URL base pour l'UI OpenClaw (défaut: `http://localhost`) |

## Structure

```
oscaragent/
├── client/     # TanStack Start (landing + dashboard)
└── server/     # Hono + Prisma + Docker + Stripe
```

## Déploiement

1. `docker compose up -d` pour PostgreSQL et le server
2. Le server doit avoir accès au socket Docker (`/var/run/docker.sock`) pour lancer les agents
3. Configurer Stripe webhook vers `https://votre-domaine/api/stripe/webhook`
