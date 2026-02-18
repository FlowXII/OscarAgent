import { getCookie } from 'hono/cookie'
import type { Context as HonoContext } from 'hono'
import { verifySessionToken } from '../auth.js'
import { prisma } from '../db.js'

const COOKIE_NAME = 'oscar_session'

export async function createContext(c: HonoContext) {
  const token = getCookie(c, COOKIE_NAME)
  let user: { id: string; email: string } | null = null
  if (token) {
    const session = await verifySessionToken(token)
    if (session) {
      const u = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { id: true, email: true },
      })
      user = u
    }
  }
  return { prisma, user }
}

export type Context = Awaited<ReturnType<typeof createContext>>
