'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from './ui/button';
import { LogOut, Settings, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-[linear-gradient(120deg,rgba(248,250,255,0.86),rgba(244,248,255,0.78))] backdrop-blur-xl transition-colors duration-500 dark:border-border/30 dark:bg-[linear-gradient(120deg,rgba(21,26,42,0.72),rgba(21,26,42,0.55))]">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="relative flex items-center gap-3 text-lg font-semibold tracking-tight text-foreground"
          >
            <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-primary/40 bg-gradient-to-br from-primary/30 via-primary/15 to-transparent text-primary shadow-glow">
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.65),transparent_60%)] dark:bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.55),transparent_60%)]" />
              <User className="h-5 w-5" />
            </span>
            <span>AppTrack</span>
          </Link>

          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-2 rounded-full border border-border/50 bg-card/80/90 p-1 text-sm shadow-navbar backdrop-blur transition-colors duration-500 dark:border-border/40 dark:bg-card/60/90">
              {[
                { href: '/dashboard', label: 'Dashboard' },
                { href: '/applications', label: 'Applications' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-4 py-1.5 font-medium text-foreground/80 transition hover:bg-primary/10 hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden h-9 w-px rounded-full bg-gradient-to-b from-transparent via-border/60 to-transparent sm:block" />
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-3 rounded-full border border-border/50 bg-card/80/90 px-3 py-1.5 text-sm shadow-navbar backdrop-blur transition-colors duration-500 dark:border-border/40 dark:bg-card/60/90">
              <div className="hidden flex-col text-right leading-none md:flex">
                <span className="font-medium text-foreground">
                  {user?.first_name} {user?.last_name}
                </span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
              <Link href="/settings">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => logout()}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" className="rounded-full border border-border/50 bg-card/80 px-5 transition-colors duration-500 dark:border-border/50 dark:bg-card/70">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="rounded-full bg-primary px-5 text-primary-foreground shadow-glow">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}