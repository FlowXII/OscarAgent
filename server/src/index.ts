import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { authRoutes } from './routes/auth.js'
import { stripeRoutes } from './routes/stripe.js'
import { trpcRouter } from './trpc/router.js'
import { createContext } from './trpc/context.js'
import { seedSkills } from './seed.js'

type Variables = { user: { id: string; email: string } }
const app = new Hono<{ Variables: Variables }>()

// Seed default skills
seedSkills().catch(e => console.error('Seeding failed:', e))

app.use('*', logger())
app.use(
  '*',
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  })
)

app.get('/health', (c) => c.json({ ok: true }))
app.get('/seed-trigger', async (c) => {
  try {
    const { seedSkills } = await import('./seed.js')
    await seedSkills()
    return c.json({ ok: true, message: 'Seeding triggered' })
  } catch (e) {
    return c.json({ ok: false, error: (e as Error).message })
  }
})
app.route('/api/auth', authRoutes)
app.route('/api/stripe', stripeRoutes)

app.all('/api/trpc/*', async (c) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: c.req.raw,
    router: trpcRouter,
    createContext: () => createContext(c),
  })
})

const port = parseInt(process.env.PORT ?? '4000')
serve({ fetch: app.fetch, port })
console.log(`Server running on http://localhost:${port}`)
