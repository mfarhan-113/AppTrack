import { StatusHistory as StatusHistoryType } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';
import { Card, CardContent } from './ui/card';
import { ArrowRight } from 'lucide-react';

interface StatusHistoryProps {
  history: StatusHistoryType[];
}

export function StatusHistory({ history }: StatusHistoryProps) {
  return (
    <div className="space-y-3">
      {history.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="capitalize font-medium">{item.from_status}</span>
                <ArrowRight className="h-4 w-4" />
                <span className="capitalize font-medium">{item.to_status}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatDateTime(item.timestamp)}
              </span>
            </div>
            {item.note && (
              <p className="text-sm text-muted-foreground mt-2">{item.note}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Changed by: {item.changed_by_name}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}