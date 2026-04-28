import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { LeaveRequestLeavetypeKey } from '@/generated/models/leave-request-model';

interface LeaveTypeBadgeProps {
  leaveTypeKey: LeaveRequestLeavetypeKey;
  className?: string;
}

export function LeaveTypeBadge({ leaveTypeKey, className }: LeaveTypeBadgeProps) {
  const configs: Record<LeaveRequestLeavetypeKey, { label: string; className: string }> = {
    LeavetypeKey0: {
      label: 'Casual',
      className: 'bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-100',
    },
    LeavetypeKey1: {
      label: 'Sick',
      className: 'bg-violet-100 text-violet-800 border-violet-200 hover:bg-violet-100',
    },
    LeavetypeKey2: {
      label: 'Vacation',
      className: 'bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-100',
    },
  };

  const config = configs[leaveTypeKey];

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
