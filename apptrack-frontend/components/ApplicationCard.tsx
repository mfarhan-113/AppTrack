import Link from 'next/link';
import { Application } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { cn, formatDate, getStatusColor } from '@/lib/utils';
import { Calendar, MapPin, Briefcase } from 'lucide-react';

interface ApplicationCardProps {
  application: Application;
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <Link href={`/applications/${application.id}`}>
      <Card className="group overflow-hidden rounded-3xl border border-border/40 bg-card/90 px-1 pb-1 pt-6 text-card-foreground shadow-[0_24px_60px_-32px_rgba(40,62,120,0.32)] backdrop-blur transition-transform duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_28px_80px_-34px_rgba(66,88,160,0.36)] dark:border-border/60 dark:bg-card/70">
        <div className="absolute inset-x-6 top-0 h-24 rounded-full bg-gradient-to-br from-primary/15 via-transparent to-transparent opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
        <CardHeader className="relative pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl font-semibold tracking-tight text-foreground">
                {application.title}
              </CardTitle>
              <p className="text-sm font-medium text-muted-foreground/90">
                {application.organization}
              </p>
            </div>
            <Badge className={cn('rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors duration-300', getStatusColor(application.status))}>
              {application.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="relative space-y-4 text-sm text-muted-foreground">
          <div className="flex flex-wrap gap-3">
            {application.location_country && (
              <span className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/80 px-3 py-1.5 text-xs font-medium backdrop-blur dark:border-border/50 dark:bg-background/40">
                <MapPin className="h-4 w-4 text-primary" />
                {application.location_country}
              </span>
            )}

            <span className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/80 px-3 py-1.5 text-xs font-medium capitalize backdrop-blur dark:border-border/50 dark:bg-background/40">
              <Briefcase className="h-4 w-4 text-primary" />
              {application.kind}
            </span>
          </div>

          {application.deadline && (
            <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-background/70 px-3 py-2 text-xs font-medium text-muted-foreground/90 dark:border-border/50 dark:bg-background/30">
              <Calendar className="h-4 w-4 text-primary" />
              <span>
                Deadline: <span className="text-foreground/90">{formatDate(application.deadline)}</span>
              </span>
            </div>
          )}

          {application.tags && application.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {application.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="rounded-full border-border/50 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 text-xs font-medium text-muted-foreground/80">
            <span>Tap to view timeline</span>
            <span className="inline-flex items-center gap-1 text-primary">
              View details
              <span aria-hidden className="translate-y-px text-sm">→</span>
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}