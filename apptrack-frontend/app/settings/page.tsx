'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/hooks/useAuth';

const profileSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  timezone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function SettingsPage() {
  const { user, isAuthenticated, logout } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        username: user.username,
        timezone: user.timezone ?? '',
      });
    }
  }, [user, reset]);

  const onSubmit = (data: ProfileFormData) => {
    console.log('Profile update', data);
  };

  return (
    <ProtectedRoute>
      <div className="container max-w-3xl py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Account Settings</h1>
            <p className="text-muted-foreground">Manage your personal information and preferences.</p>
          </div>
          {isAuthenticated && (
            <Button variant="outline" onClick={() => logout()}>
              Sign out
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">First name</label>
                  <Input {...register('first_name')} className="mt-1" />
                  {errors.first_name && (
                    <p className="text-sm text-destructive mt-1">{errors.first_name.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">Last name</label>
                  <Input {...register('last_name')} className="mt-1" />
                  {errors.last_name && (
                    <p className="text-sm text-destructive mt-1">{errors.last_name.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>
                <Input type="email" {...register('email')} className="mt-1" disabled />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Username</label>
                <Input {...register('username')} className="mt-1" />
                {errors.username && (
                  <p className="text-sm text-destructive mt-1">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Timezone</label>
                <Input {...register('timezone')} className="mt-1" />
              </div>

              <Button type="submit" className="w-full md:w-auto">
                Save changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
