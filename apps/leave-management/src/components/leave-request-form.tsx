import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateLeaveRequest } from '@/generated/hooks/use-leave-request';
import type { Employee } from '@/generated/models/employee-model';
import type { LeaveRequestLeavetypeKey } from '@/generated/models/leave-request-model';

interface LeaveRequestFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee;
}

export function LeaveRequestForm({ open, onOpenChange, employee }: LeaveRequestFormProps) {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [leaveType, setLeaveType] = useState<LeaveRequestLeavetypeKey | ''>('');
  const [reason, setReason] = useState('');

  const createRequest = useCreateLeaveRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate || !leaveType || !reason.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (endDate < startDate) {
      toast.error('End date must be after start date');
      return;
    }

    try {
      await createRequest.mutateAsync({
        requesttitle: `${employee.name1} - ${leaveType === 'LeavetypeKey0' ? 'Casual' : leaveType === 'LeavetypeKey1' ? 'Sick' : 'Vacation'} Leave`,
        employee: { id: employee.id, name1: employee.name1 },
        manager: employee.manager || { id: '', name1: '' },
        leavetypeKey: leaveType,
        startdate: format(startDate, 'yyyy-MM-dd'),
        enddate: format(endDate, 'yyyy-MM-dd'),
        reason: reason.trim(),
        statusKey: 'StatusKey0',
        submittedat: new Date().toISOString(),
      });

      toast.success('Leave request submitted successfully');
      onOpenChange(false);
      resetForm();
    } catch {
      toast.error('Failed to submit leave request');
    }
  };

  const resetForm = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setLeaveType('');
    setReason('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            Request Leave
          </DialogTitle>
          <DialogDescription>
            Submit a new leave request for manager approval.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="leaveType">Leave Type</Label>
            <Select
              value={leaveType || 'placeholder'}
              onValueChange={(val: string) => setLeaveType(val === 'placeholder' ? '' : val as LeaveRequestLeavetypeKey)}
            >
              <SelectTrigger id="leaveType">
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="placeholder" disabled>Select leave type</SelectItem>
                <SelectItem value="LeavetypeKey0">Casual</SelectItem>
                <SelectItem value="LeavetypeKey1">Sick</SelectItem>
                <SelectItem value="LeavetypeKey2">Vacation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                    {startDate ? format(startDate, 'PPP') : <span>Pick date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    disabled={(date: Date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

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
                    {endDate ? format(endDate, 'PPP') : <span>Pick date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date: Date) => date < (startDate || new Date())}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              placeholder="Please provide a reason for your leave request..."
              value={reason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createRequest.isPending}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {createRequest.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
