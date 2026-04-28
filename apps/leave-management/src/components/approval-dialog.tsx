import { useState } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateLeaveRequest } from '@/generated/hooks/use-leave-request';
import { LeaveStatusBadge } from './leave-status-badge';
import { LeaveTypeBadge } from './leave-type-badge';
import { formatDate, calculateDays } from '@/lib/date-utils';
import type { LeaveRequest, LeaveRequestStatusKey } from '@/generated/models/leave-request-model';

interface ApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: LeaveRequest | null;
}

export function ApprovalDialog({ open, onOpenChange, request }: ApprovalDialogProps) {
  const [comment, setComment] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const updateRequest = useUpdateLeaveRequest();

  const handleDecision = async (decision: 'approve' | 'reject') => {
    if (!request || !request.id) return;

    const newStatus: LeaveRequestStatusKey = decision === 'approve' ? 'StatusKey1' : 'StatusKey2';
    const actionText = decision === 'approve' ? 'approved' : 'rejected';

    if (decision === 'approve') {
      setIsApproving(true);
    } else {
      setIsRejecting(true);
    }

    try {
      await updateRequest.mutateAsync({
        id: request.id,
        changedFields: {
          statusKey: newStatus,
          reviewercomment: comment.trim() || undefined,
          reviewedat: new Date().toISOString(),
        },
      });

      toast.success(`Leave request ${actionText}`, {
        description: `${request.employee?.name1 || 'Employee'}'s request has been ${actionText}.`,
      });
      onOpenChange(false);
      setComment('');
    } catch {
      toast.error(`Failed to ${decision} request`);
    } finally {
      setIsApproving(false);
      setIsRejecting(false);
    }
  };

  // Guard against null or invalid request
  if (!request || !request.id) return null;

  const days = calculateDays(request.startdate, request.enddate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Review Leave Request</DialogTitle>
          <DialogDescription>
            Review and respond to this leave request from {request.employee?.name1 || 'the employee'}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LeaveTypeBadge leaveTypeKey={request.leavetypeKey} />
                <LeaveStatusBadge statusKey={request.statusKey} />
              </div>
              <span className="font-medium">{days} day{days !== 1 ? 's' : ''}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <strong className="text-foreground">Dates:</strong> {formatDate(request.startdate)} — {formatDate(request.enddate)}
            </div>
            <div className="text-sm">
              <strong className="text-foreground">Reason:</strong>
              <p className="text-muted-foreground mt-1">{request.reason}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comment (optional)</Label>
            <Textarea
              id="comment"
              placeholder="Add a comment for the employee..."
              value={comment}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => handleDecision('reject')}
              disabled={isApproving || isRejecting}
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
            >
              {isRejecting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <X className="mr-2 h-4 w-4" />
              )}
              Reject
            </Button>
            <Button
              onClick={() => handleDecision('approve')}
              disabled={isApproving || isRejecting}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isApproving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              Approve
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
