import { createFileRoute } from '@tanstack/react-router'

const SERVER_URL = process.env.VITE_API_URL || 'http://localhost:4000'

async function handler({ request }: { request: Request }) {
  const url = new URL(request.url)
  const path = url.pathname.replace(/^\/api\/trpc/, '') || ''
  const target = `${SERVER_URL}/api/trpc${path}${url.search}`
  return fetch(target, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    duplex: 'half',
  })
}

export const Route = createFileRoute('/api/trpc/$')({
  server: {
    handlers: {
      GET: handler,
      POST: handler,
    },
  },
})
