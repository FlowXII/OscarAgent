import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="text-lg font-bold tracking-tight">
          Oscar Agent
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#demo"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Démo
          </a>
          <a
            href="#fonctionnalites"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Fonctionnalités
          </a>
          <a
            href="#tarifs"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Tarifs
          </a>
          <a
            href="#faq"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            FAQ
          </a>
          <Button variant="ghost" asChild>
            <Link to="/login">Connexion</Link>
          </Button>
          <Button asChild>
            <Link to="/dashboard">Démarrer</Link>
          </Button>
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {isOpen && (
        <div className="border-t border-border/50 bg-background px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            <a
              href="#demo"
              onClick={() => setIsOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              Démo
            </a>
            <a
              href="#fonctionnalites"
              onClick={() => setIsOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              Fonctionnalités
            </a>
            <a
              href="#tarifs"
              onClick={() => setIsOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              Tarifs
            </a>
            <a
              href="#faq"
              onClick={() => setIsOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              FAQ
            </a>
            <div className="mt-3 flex gap-2 border-t border-border/50 pt-3">
              <Button variant="outline" className="flex-1" asChild>
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  Connexion
                </Link>
              </Button>
              <Button className="flex-1" asChild>
                <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                  Démarrer
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
