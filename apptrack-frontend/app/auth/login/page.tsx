'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/hooks/useAuth';
import { Loader2, Lock, Mail, ArrowRight } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isLoggingIn, loginError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(86,102,255,0.4),transparent_58%)] blur-3xl dark:bg-[radial-gradient(circle_at_15%_15%,rgba(46,82,220,0.42),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(248,250,255,0.9),rgba(240,244,255,0.95))] dark:bg-[linear-gradient(160deg,rgba(7,12,30,0.92),rgba(7,10,24,0.96))]" />

      <div className="relative z-10 flex w-full flex-col lg:flex-row">
        <div className="relative hidden w-full flex-1 flex-col justify-around overflow-hidden px-12 py-16 text-foreground/90 lg:flex">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(107,172,255,0.35),transparent_65%)] dark:bg-[radial-gradient(circle_at_80%_20%,rgba(88,122,255,0.3),transparent_70%)]" />
          <div className="relative space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              Welcome back
            </span>
            <h1 className="max-w-xl text-4xl font-semibold leading-tight text-foreground">
              Sign in to orchestrate your application journey with precision.
            </h1>
            <p className="max-w-lg text-sm text-muted-foreground">
              AppTrack keeps your opportunities, documents, and reminders in one beautifully organized workspace—so you can focus on what matters.
            </p>
          </div>

          <div className="relative mt-10 grid gap-5 text-sm text-muted-foreground">
            {["Visualize your pipeline at a glance", "Automate reminders for key deadlines", "Securely manage documents and notes"].map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-3 rounded-2xl border border-border/40 bg-background/70 px-4 py-3 backdrop-blur dark:border-primary/30 dark:bg-background/15"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Lock className="h-4 w-4" />
                </span>
                <span className="text-foreground/85">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-1 items-center justify-center px-6 py-16 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8 space-y-2 text-center lg:text-left">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">Login</h2>
              <p className="text-sm text-muted-foreground">
                Enter your credentials to access dashboards, reminders, and insights tailored to your search.
              </p>
            </div>

            <Card className="relative overflow-hidden rounded-3xl border border-border/40 bg-card/95 shadow-[0_28px_80px_-40px_rgba(64,82,140,0.35)] backdrop-blur dark:border-primary/25 dark:bg-card/70 dark:shadow-[0_32px_110px_-50px_rgba(34,52,128,0.7)]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(164,188,255,0.28),transparent_60%)] dark:bg-[radial-gradient(circle_at_0%_0%,rgba(90,120,255,0.32),transparent_65%)]" />
              <CardHeader className="relative space-y-2">
                <CardTitle className="text-2xl font-semibold text-foreground">Welcome back</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  We’re excited to see your next move. Let’s pick up where you left off.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="email"
                        {...register('email')}
                        className="pl-10"
                        placeholder="you@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="password"
                        {...register('password')}
                        className="pl-10"
                        placeholder="••••••••"
                      />
                    </div>
                    {errors.password && (
                      <p className="text-xs text-destructive">{errors.password.message}</p>
                    )}
                  </div>

                  {loginError && (
                    <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                      Invalid email or password
                    </p>
                  )}

                  <Button type="submit" className="w-full rounded-full" disabled={isLoggingIn}>
                    {isLoggingIn ? (
                      <span className="inline-flex items-center gap-2 text-sm font-medium">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Logging in
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-sm font-semibold">
                        Access dashboard
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    Don’t have an account yet?{' '}
                    <Link href="/auth/register" className="font-medium text-primary hover:underline">
                      Create one now
                    </Link>
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}