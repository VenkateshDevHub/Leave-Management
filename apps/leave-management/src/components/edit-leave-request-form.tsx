import { useState, useEffect } from 'react';
import { format, differenceInDays, parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useUpdateLeaveRequest } from '@/generated/hooks/use-leave-request';
import type { LeaveRequest, LeaveRequestLeavetypeKey } from '@/generated/models/leave-request-model';

const LEAVE_TYPES: { key: LeaveRequestLeavetypeKey; label: string }[] = [
  { key: 'LeavetypeKey0', label: 'Casual' },
  { key: 'LeavetypeKey1', label: 'Sick' },
  { key: 'LeavetypeKey2', label: 'Vacation' },
];

interface EditLeaveRequestFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: LeaveRequest;
}

export function EditLeaveRequestForm({ open, onOpenChange, request }: EditLeaveRequestFormProps) {
  const [leaveType, setLeaveType] = useState<LeaveRequestLeavetypeKey>(request.leavetypeKey);
  const [startDate, setStartDate] = useState<Date | undefined>(
    request.startdate ? parseISO(request.startdate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    request.enddate ? parseISO(request.enddate) : undefined
  );
  const [reason, setReason] = useState(request.reason || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateLeaveRequest = useUpdateLeaveRequest();

  // Reset form when dialog opens with a new request
  useEffect(() => {
    if (open) {
      setLeaveType(request.leavetypeKey);
      setStartDate(request.startdate ? parseISO(request.startdate) : undefined);
      setEndDate(request.enddate ? parseISO(request.enddate) : undefined);
      setReason(request.reason || '');
    }
  }, [open, request]);

  const days = startDate && endDate ? differenceInDays(endDate, startDate) + 1 : 0;

  const handleSubmit = async () => {
    if (!startDate || !endDate || !reason.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (endDate < startDate) {
      toast.error('End date must be after start date');
      return;
    }

    setIsSubmitting(true);

    try {
      const leaveTypeLabel = LEAVE_TYPES.find((t) => t.key === leaveType)?.label || 'Leave';

      await updateLeaveRequest.mutateAsync({
        id: request.id,
        changedFields: {
          requesttitle: `${leaveTypeLabel} - ${request.employee?.name1 || 'Employee'}`,
          leavetypeKey: leaveType,
          startdate: format(startDate, 'yyyy-MM-dd'),
          enddate: format(endDate, 'yyyy-MM-dd'),
          reason: reason.trim(),
        },
      });

      toast.success('Leave request updated successfully');
      onOpenChange(false);
    } catch (error: unknown) {
      console.error('Failed to update leave request:', error);
      toast.error('Failed to update leave request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Leave Request</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Leave Type */}
          <div className="space-y-2">
            <Label>Leave Type</Label>
            <Select value={leaveType} onValueChange={(val: string) => setLeaveType(val as LeaveRequestLeavetypeKey)}>
              <SelectTrigger>
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                {LEAVE_TYPES.map((type) => (
                  <SelectItem key={type.key} value={type.key}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !startDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !endDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  disabled={(date: Date) => (startDate ? date < startDate : false)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Duration indicator */}
          {days > 0 && (
            <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
              Duration: <span className="font-medium text-foreground">{days} day{days !== 1 ? 's' : ''}</span>
            </div>
          )}

          {/* Reason */}
          <div className="space-y-2">
            <Label>Reason</Label>
            <Textarea
              placeholder="Please provide a reason for your leave request..."
              value={reason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !startDate || !endDate || !reason.trim()}
            className="bg-teal-600 hover:bg-teal-700"
          >
            {isSubmitting ? 'Updating...' : 'Update Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
