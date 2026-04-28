import type { LeaveRequestLeavetypeKey } from './leave-request-model';

export interface LeaveBalance {
  id: string;
  employee?: { id: string; name1: string } | null;
  leavetypeKey: LeaveRequestLeavetypeKey;
  totaldays: number;
  useddays: number;
  year: number;
}
