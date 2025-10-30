'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/hooks/useAuth';
import { ArrowRight, UserRound, Shield, Sparkles } from 'lucide-react';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirm: z.string(),
}).refine((data) => data.password === data.password_confirm, {
  message: "Passwords don't match",
  path: ['password_confirm'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser, isRegistering, registerError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    registerUser(data);
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(120,144,255,0.42),transparent_60%)] blur-3xl dark:bg-[radial-gradient(circle_at_12%_18%,rgba(78,106,255,0.46),transparent_62%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(140deg,rgba(248,250,255,0.92),rgba(238,243,255,0.96))] dark:bg-[linear-gradient(150deg,rgba(5,10,26,0.92),rgba(8,12,30,0.97))]" />

      <div className="relative z-10 flex w-full flex-col lg:flex-row">
        <div className="relative hidden w-full flex-1 flex-col justify-around overflow-hidden px-12 py-16 text-foreground/90 lg:flex">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_25%,rgba(146,202,255,0.32),transparent_68%)] dark:bg-[radial-gradient(circle_at_85%_25%,rgba(98,142,255,0.35),transparent_70%)]" />
          <div className="relative space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              Join the workspace
            </span>
            <h1 className="max-w-xl text-4xl font-semibold leading-tight text-foreground">
              Create an account crafted for ambitious applicants.
            </h1>
            <p className="max-w-lg text-sm text-muted-foreground">
              Build your pipeline, collaborate with mentors, and stay ahead of every deadline—all in one beautifully designed hub.
            </p>
          </div>

          <div className="relative mt-8 grid gap-5 text-sm text-muted-foreground">
            {[
              {
                icon: <Sparkles className="h-4 w-4" />,
                text: 'Personalized insights based on your progress',
              },
              {
                icon: <Shield className="h-4 w-4" />,
                text: 'Enterprise-grade security for documents and notes',
              },
              {
                icon: <UserRound className="h-4 w-4" />,
                text: 'Collaborate with mentors and track feedback with ease',
              },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-3 rounded-2xl border border-border/40 bg-background/70 px-4 py-3 backdrop-blur dark:border-primary/30 dark:bg-background/15"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  {item.icon}
                </span>
                <span className="text-foreground/85">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-1 items-center justify-center px-6 py-16 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8 space-y-2 text-center lg:text-left">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">Create account</h2>
              <p className="text-sm text-muted-foreground">
                Start tracking opportunities with intelligent reminders, beautiful dashboards, and guided workflows.
              </p>
            </div>

            <Card className="relative overflow-hidden rounded-3xl border border-border/40 bg-card/95 shadow-[0_28px_80px_-40px_rgba(64,82,140,0.35)] backdrop-blur dark:border-primary/25 dark:bg-card/70 dark:shadow-[0_36px_120px_-52px_rgba(30,48,122,0.7)]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(180,198,255,0.3),transparent_60%)] dark:bg-[radial-gradient(circle_at_0%_0%,rgba(104,138,255,0.34),transparent_66%)]" />
              <CardHeader className="relative space-y-2">
                <CardTitle className="text-2xl font-semibold text-foreground">Let’s get started</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Tell us a little about yourself so we can tailor the experience to your path.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">First name</label>
                      <Input {...register('first_name')} placeholder="Aisha" />
                      {errors.first_name && (
                        <p className="text-xs text-destructive">{errors.first_name.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Last name</label>
                      <Input {...register('last_name')} placeholder="Rahman" />
                      {errors.last_name && (
                        <p className="text-xs text-destructive">{errors.last_name.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Email</label>
                    <Input type="email" {...register('email')} placeholder="you@example.com" />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Username</label>
                    <Input {...register('username')} placeholder="yourusername" />
                    {errors.username && (
                      <p className="text-xs text-destructive">{errors.username.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Password</label>
                      <Input type="password" {...register('password')} placeholder="••••••••" />
                      {errors.password && (
                        <p className="text-xs text-destructive">{errors.password.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Confirm password</label>
                      <Input type="password" {...register('password_confirm')} placeholder="••••••••" />
                      {errors.password_confirm && (
                        <p className="text-xs text-destructive">{errors.password_confirm.message}</p>
                      )}
                    </div>
                  </div>

                  {registerError && (
                    <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                      Registration failed. Please try again.
                    </p>
                  )}

                  <Button type="submit" className="w-full rounded-full" disabled={isRegistering}>
                    {isRegistering ? (
                      <span className="inline-flex items-center gap-2 text-sm font-medium">
                        Creating account
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-sm font-semibold">
                        Launch workspace
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/auth/login" className="font-medium text-primary hover:underline">
                      Sign in instead
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