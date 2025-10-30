'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApplications } from '@/lib/hooks/useApplications';
import { useRouter } from 'next/navigation';

const applicationSchema = z.object({
  kind: z.enum(['job', 'scholarship']),
  title: z.string().min(1, 'Title is required'),
  organization: z.string().min(1, 'Organization is required'),
  location_country: z.string().optional(),
  source_url: z.string().url().optional().or(z.literal('')),
  deadline: z.string().optional(),
  status: z.enum(['draft', 'submitted', 'interview', 'offer', 'rejected', 'withdrawn']),
  priority: z.coerce.number().min(0).max(10),
  notes: z.string().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

export default function NewApplicationPage() {
  const router = useRouter();
  const { createApplication, isCreating } = useApplications();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      status: 'draft',
      priority: 5,
    },
  });

  const onSubmit = (data: ApplicationFormData) => {
    createApplication(
      { ...data, tags: [] },
      {
        onSuccess: () => {
          router.push('/applications');
        },
      }
    );
  };

  return (
    <ProtectedRoute>
      <div className="container max-w-2xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>New Application</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Type</label>
                <select {...register('kind')} className="w-full mt-1 px-4 py-2 border rounded-md">
                  <option value="job">Job</option>
                  <option value="scholarship">Scholarship</option>
                </select>
                {errors.kind && (
                  <p className="text-sm text-destructive mt-1">{errors.kind.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Title</label>
                <Input {...register('title')} className="mt-1" />
                {errors.title && (
                  <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Organization</label>
                <Input {...register('organization')} className="mt-1" />
                {errors.organization && (
                  <p className="text-sm text-destructive mt-1">{errors.organization.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Location/Country</label>
                <Input {...register('location_country')} className="mt-1" />
              </div>

              <div>
                <label className="text-sm font-medium">Source URL</label>
                <Input type="url" {...register('source_url')} className="mt-1" />
                {errors.source_url && (
                  <p className="text-sm text-destructive mt-1">{errors.source_url.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Deadline</label>
                <Input type="date" {...register('deadline')} className="mt-1" />
              </div>

              <div>
                <label className="text-sm font-medium">Status</label>
                <select {...register('status')} className="w-full mt-1 px-4 py-2 border rounded-md">
                  <option value="draft">Draft</option>
                  <option value="submitted">Submitted</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Priority (0-10)</label>
                <Input type="number" {...register('priority')} className="mt-1" />
                {errors.priority && (
                  <p className="text-sm text-destructive mt-1">{errors.priority.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Notes</label>
                <textarea
                  {...register('notes')}
                  className="w-full mt-1 px-4 py-2 border rounded-md min-h-[100px]"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isCreating} className="flex-1">
                  {isCreating ? 'Creating...' : 'Create Application'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}