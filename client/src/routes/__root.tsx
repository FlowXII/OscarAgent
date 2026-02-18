import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useRouteContext,
  Link,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import { Provider } from '../integrations/tanstack-query/root-provider'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

import type { TRPCRouter } from '@/integrations/trpc/router'
import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query'

interface MyRouterContext {
  queryClient: QueryClient

  trpc: TRPCOptionsProxy<TRPCRouter>
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
              title: 'Nexus Privé — Votre Majordome Digital',
      },
      {
        name: 'description',
        content:
                'Nexus Privé — Intelligence artificielle de prestige pour la logistique complexe, les voyages et le style de vie via WhatsApp crypté.',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
    ],
  }),

  shellComponent: RootDocument,
  notFoundComponent: () => {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center bg-lux-black text-white">
        <h1 className="text-4xl font-serif mb-4">404</h1>
        <p className="text-lux-text-muted mb-8 tracking-widest uppercase text-xs">Destination Introuvable</p>
        <Link to="/" className="bg-lux-gold text-lux-black px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all">
          Retour au Cockpit
        </Link>
      </div>
    )
  },
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { queryClient } = useRouteContext({ from: '__root__' })
  return (
    <html lang="fr" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        <Provider queryClient={queryClient}>{children}</Provider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
