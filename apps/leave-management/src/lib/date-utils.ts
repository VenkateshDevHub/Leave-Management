import { format, differenceInDays, parseISO, isValid } from 'date-fns';

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return '';
  const date = parseISO(dateString);
  return isValid(date) ? format(date, 'MMM d, yyyy') : '';
}

export function formatDateTime(dateString: string | undefined): string {
  if (!dateString) return '';
  const date = parseISO(dateString);
  return isValid(date) ? format(date, 'MMM d, yyyy h:mm a') : '';
}

export function calculateDays(startDate: string, endDate: string): number {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  if (!isValid(start) || !isValid(end)) return 0;
  return differenceInDays(end, start) + 1; // Include both start and end day
}

export function getLeaveTypeLabel(key: string): string {
  const types: Record<string, string> = {
    LeavetypeKey0: 'Casual',
    LeavetypeKey1: 'Sick',
    LeavetypeKey2: 'Vacation',
  };
  return types[key] || key;
}

export function getStatusLabel(key: string): string {
  const statuses: Record<string, string> = {
    StatusKey0: 'Pending',
    StatusKey1: 'Approved',
    StatusKey2: 'Rejected',
  };
  return statuses[key] || key;
}
