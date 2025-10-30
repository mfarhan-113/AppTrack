'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import api from '@/lib/api';

const reminderSchema = z.object({
  remind_at: z.string().min(1, 'Date and time required'),
  channel: z.enum(['email']),
});

type ReminderFormData = z.infer<typeof reminderSchema>;

interface ReminderFormProps {
  applicationId: string;
  onSuccess?: () => void;
}

export function ReminderForm({ applicationId, onSuccess }: ReminderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReminderFormData>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      channel: 'email',
    },
  });

  const onSubmit = async (data: ReminderFormData) => {
    setIsSubmitting(true);
    try {
      await api.post(`/applications/${applicationId}/reminders/`, {
        application: applicationId,
        remind_at: new Date(data.remind_at).toISOString(),
        channel: data.channel,
      });
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create reminder:', error);
      alert('Failed to create reminder');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Remind me at</label>
        <Input
          type="datetime-local"
          {...register('remind_at')}
          className="mt-1"
        />
        {errors.remind_at && (
          <p className="text-sm text-destructive mt-1">
            {errors.remind_at.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Creating...' : 'Create Reminder'}
      </Button>
    </form>
  );
}