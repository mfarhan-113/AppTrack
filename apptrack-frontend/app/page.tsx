'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 top-[-12%] z-0 h-[560px] bg-[radial-gradient(ellipse_at_top,rgba(186,203,255,0.52),rgba(255,255,255,0)_70%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(104,136,255,0.32),transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_88%_-12%,rgba(219,201,255,0.46),transparent_64%)] dark:bg-[radial-gradient(circle_at_85%_-10%,rgba(172,96,255,0.28),transparent_60%)]" />

      <div className="relative z-10">
        <div className="container py-20">
          <div className="mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/12 px-4 py-1 text-sm font-medium text-primary/90">
              <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
              Stay ahead with AppTrack
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Manage every application with clarity and confidence.
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground">
              AppTrack brings your job and scholarship journey into one beautiful dashboard—organize submissions, automate reminders, and visualize progress in a single place.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/auth/register">
                <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/30">
                  Create your workspace
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-border/60 bg-card/90 px-8 backdrop-blur transition-colors duration-300 hover:border-primary/40 dark:border-border/70 dark:bg-card/70"
                >
                  Sign in
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'Unified pipeline',
                description:
                  'Categorize opportunities, attach files, and track conversations across every application effortlessly.',
              },
              {
                title: 'Smart reminders',
                description:
                  'Schedule automated nudges for follow-ups and deadlines so you never miss a critical date.',
              },
              {
                title: 'Insights that guide',
                description:
                  'Visualize conversion rates and status trends to focus energy on what matters most.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/95 p-8 shadow-[0_20px_40px_-28px_rgba(42,58,102,0.28)] backdrop-blur transition duration-300 hover:border-primary/40 hover:shadow-[0_24px_60px_-30px_rgba(64,82,140,0.32)] dark:border-border/60 dark:bg-card/80 dark:shadow-card"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(141,167,255,0.26),transparent_62%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-[radial-gradient(circle_at_top,rgba(102,135,255,0.22),transparent_60%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(155deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_58%)]" />
                <div className="relative">
                  <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-24 grid gap-8 lg:grid-cols-[1.5fr,1fr]">
            <div className="group relative overflow-hidden rounded-3xl border border-border/40 bg-card/95 p-10 text-left shadow-[0_24px_60px_-30px_rgba(44,62,120,0.28)] backdrop-blur transition duration-300 hover:border-primary/35 hover:shadow-[0_28px_70px_-32px_rgba(68,86,150,0.32)] dark:border-border/60 dark:bg-card/85">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(155,180,255,0.32),transparent_68%)] dark:bg-[radial-gradient(circle_at_0%_0%,rgba(112,142,255,0.26),transparent_65%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(155deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_58%)]" />
              <div className="relative z-10 space-y-6">
                <h2 className="text-3xl font-semibold text-foreground">
                  Designed for ambitious applicants who want more control.
                </h2>
                <p className="text-base text-muted-foreground">
                  Organize every opportunity, collaborate with mentors, and sync reminders across your calendar. AppTrack fits seamlessly into your workflow so you can concentrate on the journey ahead.
                </p>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  {['Pipeline snapshots', 'Calendar sync', 'Attachment storage', 'Collaboration ready'].map(
                    (item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/90 px-4 py-2 backdrop-blur"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {item}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-card/95 p-8 shadow-[0_24px_60px_-32px_rgba(42,58,102,0.28)] backdrop-blur transition duration-300 hover:border-primary/35 hover:shadow-[0_28px_74px_-34px_rgba(62,86,148,0.32)] dark:border-border/60 dark:bg-card/85">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(152,204,255,0.24),transparent_68%)] dark:bg-[radial-gradient(circle_at_top,rgba(96,168,255,0.2),transparent_65%)]" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_100%_50%,rgba(144,166,255,0.26),transparent_58%)] dark:bg-[radial-gradient(circle_at_100%_50%,rgba(122,146,255,0.22),transparent_55%)]" />
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-[radial-gradient(circle_at_0%_50%,rgba(149,215,255,0.18),transparent_60%)] dark:bg-[radial-gradient(circle_at_0%_50%,rgba(111,205,255,0.16),transparent_60%)]" />
              <div className="relative z-10 space-y-4 text-center">
                <p className="text-sm font-medium uppercase tracking-wide text-primary">
                  What users appreciate
                </p>
                <blockquote className="text-lg text-muted-foreground">
                  “The clarity AppTrack gives my job search is unreal. The dark theme paired with reminders keeps me focused and calm.”
                </blockquote>
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Aisha R.</span> · Product Designer
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}