'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/lib/hooks/useDashboard';
import { cn, formatDate } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
  Cell,
} from 'recharts';
import { CalendarCheck, Compass, Rocket, TrendingUp, ArrowUpRight } from 'lucide-react';

const STATUS_META: Record<
  string,
  { label: string; color: string; gradient: string; secondary: string }
> = {
  draft: {
    label: 'Draft',
    color: 'rgba(144, 163, 255, 1)',
    gradient: 'url(#statusDraft)',
    secondary: 'rgba(144, 163, 255, 0.15)',
  },
  submitted: {
    label: 'Submitted',
    color: 'rgba(73, 113, 255, 1)',
    gradient: 'url(#statusSubmitted)',
    secondary: 'rgba(73, 113, 255, 0.18)',
  },
  interview: {
    label: 'Interview',
    color: 'rgba(250, 181, 64, 1)',
    gradient: 'url(#statusInterview)',
    secondary: 'rgba(250, 181, 64, 0.2)',
  },
  offer: {
    label: 'Offer',
    color: 'rgba(65, 197, 133, 1)',
    gradient: 'url(#statusOffer)',
    secondary: 'rgba(65, 197, 133, 0.18)',
  },
  rejected: {
    label: 'Rejected',
    color: 'rgba(244, 86, 117, 1)',
    gradient: 'url(#statusRejected)',
    secondary: 'rgba(244, 86, 117, 0.16)',
  },
  withdrawn: {
    label: 'Withdrawn',
    color: 'rgba(160, 174, 192, 1)',
    gradient: 'url(#statusWithdrawn)',
    secondary: 'rgba(160, 174, 192, 0.16)',
  },
};

const statusOrder = ['draft', 'submitted', 'interview', 'offer', 'rejected', 'withdrawn'];

const StatsCard = ({
  title,
  value,
  icon: Icon,
  subtitle,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}) => (
  <Card className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/90 p-6 shadow-[0_22px_60px_-34px_rgba(64,82,140,0.38)] backdrop-blur transition duration-500 hover:border-primary/35 hover:shadow-[0_28px_76px_-36px_rgba(68,88,154,0.42)] dark:border-border/60 dark:bg-card/80">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(164,188,255,0.25),transparent_55%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    <div className="relative flex items-start justify-between">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground/70">
          {title}
        </p>
        <div className="text-4xl font-semibold text-foreground">{value}</div>
        <p className="text-sm text-muted-foreground/80">{subtitle}</p>
      </div>
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-inner shadow-primary/30">
        <Icon className="h-5 w-5" />
      </span>
    </div>
  </Card>
);

const StatusTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const meta = STATUS_META[(item.payload as { status: string }).status] ?? {
    label,
    color: 'rgba(73,113,255,1)',
  };
  return (
    <div className="rounded-2xl border border-border/50 bg-background/95 px-4 py-3 text-sm shadow-xl">
      <p className="font-semibold text-foreground">{meta.label || label}</p>
      <p className="text-muted-foreground/80">{item.value} applications</p>
    </div>
  );
};

export default function DashboardPage() {
  const { summary, isLoading } = useDashboard();

  const statusData = useMemo(() => {
    if (!summary?.status_counts) return [] as Array<{ status: string; count: number }>;
    return statusOrder
      .filter((key) => summary.status_counts[key] !== undefined)
      .map((status) => ({
        status,
        count: summary.status_counts[status] ?? 0,
      }));
  }, [summary?.status_counts]);

  const upcoming = summary?.upcoming_deadlines ?? [];

  const statCards = [
    {
      title: 'Monthly submissions',
      value: summary?.monthly_submissions ?? 0,
      subtitle: 'Entries made over the last 30 days',
      icon: Rocket,
    },
    {
      title: 'Success rate',
      value: `${summary?.conversion_rate ?? 0}%`,
      subtitle: 'Ratio of offers to submissions',
      icon: TrendingUp,
    },
    {
      title: 'Upcoming deadlines',
      value: upcoming.length,
      subtitle: 'Within the next 7 days',
      icon: CalendarCheck,
    },
    {
      title: 'Active pipelines',
      value: statusData.filter((item) => item.count > 0).length,
      subtitle: 'Statuses currently in motion',
      icon: Compass,
    },
  ];

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="container space-y-8 py-12">
          <Skeleton className="h-12 w-64 rounded-2xl" />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <Skeleton
                key={item}
                className="h-36 rounded-2xl border border-border/40 bg-card/80 shadow-[0_22px_50px_-30px_rgba(72,86,140,0.25)]"
              />
            ))}
          </div>
          <Skeleton className="h-[320px] rounded-3xl border border-border/40 bg-card/80 shadow-[0_32px_80px_-36px_rgba(64,78,130,0.32)]" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 top-[-12%] z-0 bg-[radial-gradient(circle_at_top,rgba(188,205,255,0.58),transparent_68%)] dark:bg-[radial-gradient(circle_at_top,rgba(58,88,210,0.48),rgba(4,8,22,0)_72%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[520px] bg-[linear-gradient(180deg,rgba(246,249,255,0.96),rgba(240,245,255,0.92),rgba(236,242,255,0.98))] dark:bg-[linear-gradient(180deg,rgba(4,8,22,0.75),rgba(4,8,22,0.92),rgba(6,14,32,0.98))]" />

        <div className="relative z-10">
          <div className="container space-y-12 py-12">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/12 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-primary">
                  Dashboard
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </p>
                <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                  Overview of your opportunities at a glance.
                </h1>
                <p className="max-w-2xl text-sm text-muted-foreground">
                  Visualize your pipeline health, action upcoming deadlines, and celebrate the wins you’re closing every week.
                </p>
              </div>

              <Button
                variant="ghost"
                className="rounded-full border border-border/50 bg-background/80 px-6 text-sm font-semibold text-primary shadow-[0_14px_32px_-24px_rgba(68,88,154,0.4)] hover:text-primary"
                asChild
              >
                <Link href="/applications">Go to applications</Link>
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card) => (
                <StatsCard key={card.title} {...card} />
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
              <Card className="relative overflow-hidden rounded-3xl border border-border/40 bg-card/90 p-0 shadow-[0_30px_90px_-38px_rgba(58,76,132,0.38)] backdrop-blur dark:border-primary/25 dark:bg-card/70/80 dark:shadow-[0_44px_120px_-46px_rgba(28,48,122,0.72)]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(164,188,255,0.28),transparent_65%)] dark:bg-[radial-gradient(circle_at_0%_0%,rgba(96,132,255,0.42),transparent_68%)]" />
                <div className="relative space-y-4 p-8">
                  <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground/70">
                        Applications by status
                      </p>
                      <h2 className="text-2xl font-semibold text-foreground">
                        Where your pipeline stands today
                      </h2>
                    </div>
                  </div>

                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart
                      data={statusData}
                      barSize={42}
                      margin={{ top: 16, right: 24, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="statusDraft" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="rgba(144,163,255,0.95)" />
                          <stop offset="95%" stopColor="rgba(144,163,255,0.35)" />
                        </linearGradient>
                        <linearGradient id="statusSubmitted" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="rgba(73,113,255,0.95)" />
                          <stop offset="95%" stopColor="rgba(73,113,255,0.35)" />
                        </linearGradient>
                        <linearGradient id="statusInterview" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="rgba(250,181,64,0.9)" />
                          <stop offset="95%" stopColor="rgba(250,181,64,0.4)" />
                        </linearGradient>
                        <linearGradient id="statusOffer" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="rgba(65,197,133,0.92)" />
                          <stop offset="95%" stopColor="rgba(65,197,133,0.35)" />
                        </linearGradient>
                        <linearGradient id="statusRejected" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="rgba(244,86,117,0.92)" />
                          <stop offset="95%" stopColor="rgba(244,86,117,0.3)" />
                        </linearGradient>
                        <linearGradient id="statusWithdrawn" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="rgba(160,174,192,0.9)" />
                          <stop offset="95%" stopColor="rgba(160,174,192,0.35)" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        vertical={false}
                        strokeDasharray="3 6"
                        stroke="rgba(122, 138, 189, 0.18)"
                        className="dark:stroke-[rgba(100,120,220,0.18)]"
                      />
                      <XAxis
                        dataKey="status"
                        axisLine={false}
                        tickLine={false}
                        tick={({ x, y, payload }) => {
                          const meta = STATUS_META[payload.value] ?? { label: payload.value };
                          return (
                            <text
                              x={x}
                              y={y + 16}
                              textAnchor="middle"
                              className="fill-muted-foreground/80 text-xs font-medium"
                            >
                              {meta.label}
                            </text>
                          );
                        }}
                      />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(88,98,139,0.7)', fontSize: 12 }} />
                      <Tooltip cursor={{ fill: 'rgba(88, 120, 200, 0.08)' }} content={<StatusTooltip />} />
                      <Bar
                        dataKey="count"
                        radius={[18, 18, 6, 6]}
                        animationDuration={700}
                        animationEasing="ease-out"
                      >
                        {statusData.map((entry) => (
                          <Cell key={entry.status} fill={STATUS_META[entry.status]?.gradient ?? STATUS_META.submitted.gradient} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="relative overflow-hidden rounded-3xl border border-border/40 bg-card/90 p-0 shadow-[0_30px_90px_-38px_rgba(58,76,132,0.38)] backdrop-blur dark:border-primary/25 dark:bg-card/70/80 dark:shadow-[0_42px_110px_-42px_rgba(28,46,118,0.65)]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(171,206,255,0.24),transparent_62%)] dark:bg-[radial-gradient(circle_at_100%_0%,rgba(104,160,255,0.32),transparent_65%)]" />
                <CardHeader className="relative space-y-1 px-6 pt-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground/70">
                    Upcoming deadlines
                  </p>
                  <CardTitle className="text-2xl font-semibold text-foreground">
                    Next 7 days
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Prioritize these opportunities to keep momentum going.
                  </p>
                </CardHeader>
                <CardContent className="relative px-6 pb-6">
                  {upcoming.length === 0 ? (
                    <div className="rounded-2xl border border-border/40 bg-background/70 px-5 py-8 text-center text-sm text-muted-foreground dark:border-primary/20 dark:bg-background/20">
                      You’re all caught up. New reminders will appear here as deadlines approach.
                    </div>
                  ) : (
                    <ol className="space-y-4">
                      {upcoming.map((item) => (
                        <li key={item.id} className="group relative">
                          <Link
                            href={`/applications/${item.id}`}
                            className="flex items-center justify-between gap-4 rounded-2xl border border-border/40 bg-background/85 px-4 py-4 text-left shadow-[0_16px_36px_-26px_rgba(68,82,140,0.32)] transition hover:border-primary/35 hover:bg-background/95 dark:border-primary/20 dark:bg-background/25 dark:shadow-[0_24px_60px_-36px_rgba(32,48,122,0.55)]"
                          >
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                {item.title}
                              </p>
                              <p className="text-xs text-muted-foreground/80">{item.organization}</p>
                            </div>
                            <div className="flex flex-col items-end text-xs font-medium text-muted-foreground/80">
                              <span>{formatDate(item.deadline)}</span>
                              <span className="mt-1 inline-flex items-center gap-1 text-primary">
                                View
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              </span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ol>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}