'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FileUpload } from '@/components/FileUpload';
import { StatusHistory } from '@/components/StatusHistory';
import { ReminderForm } from '@/components/ReminderForm';
import { useApplication } from '@/lib/hooks/useApplications';
import { useRouter } from 'next/navigation';
import { formatDate, formatFileSize } from '@/lib/utils';
import Link from 'next/link';
import { Edit, Download, Trash2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function ApplicationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { application, isLoading, deleteApplication, isDeleting } = useApplication(params.id);

  const handleDelete = () => {
    if (!application) return;
    const confirmed = window.confirm(
      `Delete application “${application.title}” at ${application.organization}?`
    );
    if (!confirmed) return;

    deleteApplication(undefined, {
      onSuccess: () => {
        router.push('/applications');
      },
    });
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="container py-8">
          <Skeleton className="h-12 w-64 mb-8" />
          <Skeleton className="h-96" />
        </div>
      </ProtectedRoute>
    );
  }

  if (!application) {
    return (
      <ProtectedRoute>
        <div className="container py-8">
          <p>Application not found</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">{application.title}</h1>
          <div className="flex items-center gap-3">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? 'Deleting…' : 'Delete'}
            </Button>
            <Link href={`/applications/${params.id}/edit`}>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Organization</p>
                  <p className="font-medium">{application.organization}</p>
                </div>

                {application.location_country && (
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{application.location_country}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium capitalize">{application.kind}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{application.status}</p>
                </div>

                {application.deadline && (
                  <div>
                    <p className="text-sm text-muted-foreground">Deadline</p>
                    <p className="font-medium">{formatDate(application.deadline)}</p>
                  </div>
                )}

                {application.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="font-medium">{application.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FileUpload
                  applicationId={params.id}
                  onUploadComplete={() => {
                    queryClient.invalidateQueries({ queryKey: ['application', params.id] });
                  }}
                />

                {application.attachments && application.attachments.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {application.attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{attachment.filename}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(attachment.file_size)}
                          </p>
                        </div>
                        <a href={attachment.file_url} download>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {application.status_history && application.status_history.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Status History</CardTitle>
                </CardHeader>
                <CardContent>
                  <StatusHistory history={application.status_history} />
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Set Reminder</CardTitle>
              </CardHeader>
              <CardContent>
                <ReminderForm
                  applicationId={params.id}
                  onSuccess={() => {
                    queryClient.invalidateQueries({ queryKey: ['application', params.id] });
                  }}
                />
              </CardContent>
            </Card>

            {application.reminders && application.reminders.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Reminders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {application.reminders.map((reminder) => (
                      <div key={reminder.id} className="p-3 border rounded-lg">
                        <p className="font-medium">
                          {formatDate(reminder.remind_at)}
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {reminder.channel}
                        </p>
                        {reminder.is_sent && (
                          <p className="text-xs text-green-600">Sent</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}