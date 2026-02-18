import { Hono } from 'hono'
import { z } from 'zod'
import { prisma } from '../db.js'
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
} from '../auth.js'

const registerSchema = z.object({ email: z.string().email(), password: z.string().min(8) })
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) })

export const authRoutes = new Hono()

authRoutes.post('/register', async (c) => {
  const body = await c.req.json()
  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: 'Invalid input', details: parsed.error.flatten() }, 400)
  }
  const { email, password } = parsed.data
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return c.json({ error: 'Email already registered' }, 409)
  }
  const passwordHash = await hashPassword(password)
  const user = await prisma.user.create({
    data: { email, passwordHash },
    select: { id: true, email: true, createdAt: true },
  })
  const token = await createSessionToken(user.id)
  setSessionCookie(c, token)
  return c.json({ user })
})

authRoutes.post('/login', async (c) => {
  const body = await c.req.json()
  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: 'Invalid input' }, 400)
  }
  const { email, password } = parsed.data
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return c.json({ error: 'Invalid email or password' }, 401)
  }
  const ok = await verifyPassword(password, user.passwordHash)
  if (!ok) {
    return c.json({ error: 'Invalid email or password' }, 401)
  }
  const token = await createSessionToken(user.id)
  setSessionCookie(c, token)
  return c.json({ user: { id: user.id, email: user.email, createdAt: user.createdAt } })
})

authRoutes.post('/logout', (c) => {
  clearSessionCookie(c)
  return c.json({ ok: true })
})
