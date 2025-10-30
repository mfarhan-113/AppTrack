export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface Application {
  id: string;
  kind: 'job' | 'scholarship';
  title: string;
  organization: string;
  location_country: string;
  source_url?: string;
  applied_date?: string;
  deadline?: string;
  status: 'draft' | 'submitted' | 'interview' | 'offer' | 'rejected' | 'withdrawn';
  priority: number;
  notes: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  attachments?: Attachment[];
  status_history?: StatusHistory[];
  reminders?: Reminder[];
}

export interface Attachment {
  id: string;
  filename: string;
  file_size: number;
  content_type: string;
  doc_type: 'cv' | 'transcript' | 'cover_letter' | 'other';
  uploaded_by: number;
  uploaded_at: string;
  file_url: string;
}

export interface StatusHistory {
  id: string;
  from_status: string;
  to_status: string;
  changed_by: number;
  changed_by_name: string;
  note: string;
  timestamp: string;
}

export interface Reminder {
  id: string;
  application: string;
  remind_at: string;
  channel: 'email';
  is_sent: boolean;
  created_at: string;
  scheduled_task_id: string;
}

export interface DashboardSummary {
  upcoming_deadlines: Array<{
    id: string;
    title: string;
    organization: string;
    deadline: string;
  }>;
  status_counts: Record<string, number>;
  monthly_submissions: number;
  conversion_rate: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}