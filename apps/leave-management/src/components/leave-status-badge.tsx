import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { LeaveRequestStatusKey } from '@/generated/models/leave-request-model';

interface LeaveStatusBadgeProps {
  statusKey: LeaveRequestStatusKey;
  className?: string;
}

export function LeaveStatusBadge({ statusKey, className }: LeaveStatusBadgeProps) {
  const configs: Record<LeaveRequestStatusKey, { label: string; className: string }> = {
    StatusKey0: {
      label: 'Pending',
      className: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100',
    },
    StatusKey1: {
      label: 'Approved',
      className: 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100',
    },
    StatusKey2: {
      label: 'Rejected',
      className: 'bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-100',
    },
  };

  const config = configs[statusKey];

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
