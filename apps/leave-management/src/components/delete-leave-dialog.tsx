import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteLeaveRequest } from '@/generated/hooks/use-leave-request';
import { LeaveTypeBadge } from './leave-type-badge';
import { formatDate, calculateDays } from '@/lib/date-utils';
import type { LeaveRequest } from '@/generated/models/leave-request-model';

interface DeleteLeaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: LeaveRequest | null;
}

export function DeleteLeaveDialog({ open, onOpenChange, request }: DeleteLeaveDialogProps) {
  const deleteLeaveRequest = useDeleteLeaveRequest();

  const handleDelete = () => {
    if (!request) return;

    deleteLeaveRequest.mutate(request.id, {
      onSuccess: () => {
        toast.success('Leave request deleted', {
          description: 'Your leave request has been removed.',
        });
        onOpenChange(false);
      },
      onError: () => {
        toast.error('Failed to delete', {
          description: 'Please try again later.',
        });
      },
    });
  };

  if (!request) return null;

  const days = calculateDays(request.startdate, request.enddate);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Leave Request?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                Are you sure you want to delete this leave request? This action cannot be undone.
              </p>
              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <LeaveTypeBadge leaveTypeKey={request.leavetypeKey} />
                  <span className="text-sm font-medium text-foreground">{days} day{days !== 1 ? 's' : ''}</span>
                </div>
                <p className="text-sm text-foreground">
                  {formatDate(request.startdate)} — {formatDate(request.enddate)}
                </p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Request
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
