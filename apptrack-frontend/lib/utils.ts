import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft:
      'border border-border/60 bg-muted/70 text-muted-foreground dark:border-border/40 dark:bg-card/70 dark:text-muted-foreground',
    submitted:
      'border border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-400/30 dark:bg-blue-400/10 dark:text-blue-100',
    interview:
      'border border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100',
    offer:
      'border border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-100',
    rejected:
      'border border-rose-200 bg-rose-100 text-rose-700 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-100',
    withdrawn:
      'border border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-400/30 dark:bg-slate-400/10 dark:text-slate-100',
  };
  return colors[status] || 'bg-gray-500';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}