'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ApplicationCard } from '@/components/ApplicationCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useApplications } from '@/lib/hooks/useApplications';
import { cn } from '@/lib/utils';
import { CalendarCheck, Filter, ListFilter, Plus } from 'lucide-react';

export default function ApplicationsPage() {
  const [filters, setFilters] = useState({
    status: '',
    kind: '',
  });

  const { applications, isLoading } = useApplications(filters);

  const stats = useMemo(() => {
    const total = applications.length;
    const interviews = applications.filter((app) => app.status === 'interview').length;
    const upcoming = applications.filter(
      (app) => app.deadline && new Date(app.deadline) > new Date()
    ).length;
    const submitted = applications.filter((app) => app.status === 'submitted').length;
    return [
      {
        label: 'Total applications',
        value: total,
      },
      {
        label: 'Upcoming deadlines',
        value: upcoming,
        icon: CalendarCheck,
      },
      {
        label: 'In interview stage',
        value: interviews,
      },
      {
        label: 'Awaiting review',
        value: submitted,
      },
    ];
  }, [applications]);

  const statusOptions = [
    { value: '', label: 'All statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'interview', label: 'Interview' },
    { value: 'offer', label: 'Offer' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'withdrawn', label: 'Withdrawn' },
  ];

  const kindOptions = [
    { value: '', label: 'All types' },
    { value: 'job', label: 'Job' },
    { value: 'scholarship', label: 'Scholarship' },
  ];

  return (
    <ProtectedRoute>
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 top-[-10%] z-0 bg-[radial-gradient(circle_at_top,rgba(196,210,255,0.55),transparent_70%)] dark:bg-[radial-gradient(circle_at_top,rgba(64,88,205,0.45),rgba(6,10,24,0)_72%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[480px] bg-[linear-gradient(180deg,rgba(247,249,255,0.95),rgba(243,247,255,0.9),rgba(240,245,255,0.96))] dark:bg-[linear-gradient(180deg,rgba(6,10,24,0.82),rgba(6,10,24,0.94),rgba(10,14,34,0.98))]" />

        <div className="relative z-10">
          <div className="container space-y-12 py-12">
            <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-card/90 px-8 py-10 shadow-[0_28px_80px_-35px_rgba(58,80,144,0.35)] backdrop-blur-lg transition-colors duration-500 dark:border-primary/30 dark:bg-card/70/80 dark:shadow-[0_40px_120px_-45px_rgba(35,56,152,0.65)]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(164,188,255,0.35),transparent_68%)] dark:bg-[radial-gradient(circle_at_0%_0%,rgba(88,122,255,0.45),transparent_70%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.25),rgba(255,255,255,0))] dark:bg-[linear-gradient(140deg,rgba(66,106,255,0.28),rgba(13,26,70,0))]" />
              <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
                <div className="space-y-4">
                  <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
                    <Filter className="h-4 w-4" />
                    Your opportunity pipeline
                  </p>
                  <h1 className="text-4xl font-semibold leading-tight text-foreground md:text-5xl">
                    Craft your next win with organized applications.
                  </h1>
                  <p className="max-w-2xl text-base text-muted-foreground">
                    Stay on top of every deadline, track momentum across stages, and keep all your supporting material just a tap away.
                  </p>
                </div>

                <Link href="/applications/new" className="flex-shrink-0">
                  <Button size="lg" className="rounded-full px-6 shadow-lg shadow-primary/25">
                    <Plus className="mr-2 h-4 w-4" />
                    New application
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/90 p-5 shadow-[0_20px_50px_-35px_rgba(64,82,140,0.35)] backdrop-blur transition duration-300 hover:border-primary/30 hover:shadow-[0_24px_60px_-38px_rgba(68,88,154,0.42)] dark:border-primary/20 dark:bg-card/60/80 dark:shadow-[0_26px_70px_-42px_rgba(30,44,120,0.75)]"
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(164,188,255,0.25),transparent_58%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:bg-[radial-gradient(circle_at_0%_0%,rgba(92,146,255,0.4),transparent_60%)]" />
                  <div className="relative space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
                        {stat.label}
                      </p>
                      {index === 1 ? (
                        <CalendarCheck className="h-4 w-4 text-primary/70" />
                      ) : (
                        <ListFilter className="h-4 w-4 text-primary/50" />
                      )}
                    </div>
                    <div className="text-3xl font-semibold text-foreground">{stat.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/40 bg-card/90 p-4 shadow-[0_18px_36px_-30px_rgba(56,76,130,0.28)] backdrop-blur dark:border-primary/25 dark:bg-card/60/80 dark:shadow-[0_28px_76px_-40px_rgba(26,44,110,0.65)]">
              <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                <Filter className="h-4 w-4" />
                Refine results
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {[{ id: 'status', options: statusOptions }, { id: 'kind', options: kindOptions }].map(
                  ({ id, options }) => (
                    <select
                      key={id}
                      value={filters[id as 'status' | 'kind']}
                      onChange={(event) =>
                        setFilters((prev) => ({ ...prev, [id]: event.target.value }))
                      }
                      className="rounded-full border border-border/50 bg-background/90 px-4 py-2 text-sm font-medium text-foreground shadow-[0_8px_24px_-16px_rgba(72,88,140,0.32)] transition focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-primary/30 dark:bg-background/30 dark:text-foreground/90"
                    >
                      {options.map((option) => (
                        <option key={option.value} value={option.value} className="text-sm">
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )
                )}

                {(filters.status || filters.kind) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full border border-border/50 bg-background/60 px-4 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground hover:text-primary dark:border-primary/30 dark:bg-background/20 dark:text-muted-foreground/80"
                    onClick={() => setFilters({ status: '', kind: '' })}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Skeleton
                    key={item}
                    className="h-64 rounded-3xl border border-border/40 bg-card/80 shadow-[0_24px_70px_-32px_rgba(56,76,130,0.28)]"
                  />
                ))}
              </div>
            ) : applications.length === 0 ? (
              <div className="mx-auto flex max-w-xl flex-col items-center gap-6 rounded-3xl border border-border/40 bg-card/90 px-10 py-16 text-center shadow-[0_28px_80px_-36px_rgba(56,76,130,0.35)] backdrop-blur dark:border-border/60 dark:bg-card/80">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                  <Plus className="h-7 w-7" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold text-foreground">No applications yet</h2>
                  <p className="text-sm text-muted-foreground">
                    Start tracking your first opportunity to unlock insights, reminders, and a focused workspace designed for your goals.
                  </p>
                </div>
                <Link href="/applications/new">
                  <Button size="lg" className="rounded-full px-6 shadow-lg shadow-primary/25">
                    Create your first application
                  </Button>
                </Link>
              </div>
            ) : (
              <div className={cn('grid gap-6 md:grid-cols-2 lg:grid-cols-3')}>
                {applications.map((app) => (
                  <ApplicationCard key={app.id} application={app} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}