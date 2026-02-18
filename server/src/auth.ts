import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { getCookie } from 'hono/cookie'
import type { Context, Next } from 'hono'
import { prisma } from './db.js'
import type { User } from '@prisma/client'

const SALT_ROUNDS = 10
const COOKIE_NAME = 'oscar_session'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function getSecret() {
  const secret = process.env.SESSION_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET must be at least 32 characters')
  }
  return new TextEncoder().encode(secret)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createSessionToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getSecret())
}

export async function verifySessionToken(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    const userId = payload.userId as string
    return userId ? { userId } : null
  } catch {
    return null
  }
}

export async function authMiddleware(c: Context, next: Next) {
  const token = getCookie(c, COOKIE_NAME)
  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  const session = await verifySessionToken(token)
  if (!session) {
    return c.json({ error: 'Invalid session' }, 401)
  }
  const user = await prisma.user.findUnique({ where: { id: session.userId } })
  if (!user) {
    return c.json({ error: 'User not found' }, 401)
  }
  c.set('user', user as User)
  await next()
}

export function setSessionCookie(c: Context, token: string) {
  c.header(
    'Set-Cookie',
    `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}`
  )
}

export function clearSessionCookie(c: Context) {
  c.header('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`)
}
