import type { Employee } from './models/employee-model';
import type { LeaveRequest } from './models/leave-request-model';
import type { LeaveBalance } from './models/leave-balance-model';

export const SEED_EMPLOYEES: Employee[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name1: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    department: 'Engineering',
    employeecode: 'E001',
    manager: null,
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name1: 'Mike Chen',
    email: 'mike.chen@company.com',
    department: 'Engineering',
    employeecode: 'E002',
    manager: { id: '00000000-0000-0000-0000-000000000001', name1: 'Sarah Johnson' },
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    name1: 'Priya Patel',
    email: 'priya.patel@company.com',
    department: 'Engineering',
    employeecode: 'E003',
    manager: { id: '00000000-0000-0000-0000-000000000001', name1: 'Sarah Johnson' },
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    name1: 'David Kim',
    email: 'david.kim@company.com',
    department: 'Marketing',
    employeecode: 'E004',
    manager: { id: '00000000-0000-0000-0000-000000000001', name1: 'Sarah Johnson' },
  },
];

export const SEED_LEAVE_BALANCES: LeaveBalance[] = [
  // Sarah (manager)
  { id: 'bal-001', employee: { id: '00000000-0000-0000-0000-000000000001', name1: 'Sarah Johnson' }, leavetypeKey: 'LeavetypeKey0', totaldays: 10, useddays: 3, year: 2026 },
  { id: 'bal-002', employee: { id: '00000000-0000-0000-0000-000000000001', name1: 'Sarah Johnson' }, leavetypeKey: 'LeavetypeKey1', totaldays: 10, useddays: 0, year: 2026 },
  { id: 'bal-003', employee: { id: '00000000-0000-0000-0000-000000000001', name1: 'Sarah Johnson' }, leavetypeKey: 'LeavetypeKey2', totaldays: 20, useddays: 10, year: 2026 },
  // Mike
  { id: 'bal-004', employee: { id: '00000000-0000-0000-0000-000000000002', name1: 'Mike Chen' }, leavetypeKey: 'LeavetypeKey0', totaldays: 10, useddays: 2, year: 2026 },
  { id: 'bal-005', employee: { id: '00000000-0000-0000-0000-000000000002', name1: 'Mike Chen' }, leavetypeKey: 'LeavetypeKey1', totaldays: 10, useddays: 1, year: 2026 },
  { id: 'bal-006', employee: { id: '00000000-0000-0000-0000-000000000002', name1: 'Mike Chen' }, leavetypeKey: 'LeavetypeKey2', totaldays: 20, useddays: 5, year: 2026 },
  // Priya
  { id: 'bal-007', employee: { id: '00000000-0000-0000-0000-000000000003', name1: 'Priya Patel' }, leavetypeKey: 'LeavetypeKey0', totaldays: 10, useddays: 0, year: 2026 },
  { id: 'bal-008', employee: { id: '00000000-0000-0000-0000-000000000003', name1: 'Priya Patel' }, leavetypeKey: 'LeavetypeKey1', totaldays: 10, useddays: 0, year: 2026 },
  { id: 'bal-009', employee: { id: '00000000-0000-0000-0000-000000000003', name1: 'Priya Patel' }, leavetypeKey: 'LeavetypeKey2', totaldays: 20, useddays: 8, year: 2026 },
  // David
  { id: 'bal-010', employee: { id: '00000000-0000-0000-0000-000000000004', name1: 'David Kim' }, leavetypeKey: 'LeavetypeKey0', totaldays: 10, useddays: 0, year: 2026 },
  { id: 'bal-011', employee: { id: '00000000-0000-0000-0000-000000000004', name1: 'David Kim' }, leavetypeKey: 'LeavetypeKey1', totaldays: 10, useddays: 3, year: 2026 },
  { id: 'bal-012', employee: { id: '00000000-0000-0000-0000-000000000004', name1: 'David Kim' }, leavetypeKey: 'LeavetypeKey2', totaldays: 20, useddays: 2, year: 2026 },
];

export const SEED_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'req-001',
    requesttitle: 'Casual - Mike Chen',
    employee: { id: '00000000-0000-0000-0000-000000000002', name1: 'Mike Chen' },
    manager: { id: '00000000-0000-0000-0000-000000000001', name1: 'Sarah Johnson' },
    leavetypeKey: 'LeavetypeKey0',
    startdate: '2026-05-05',
    enddate: '2026-05-07',
    reason: 'Personal matters',
    statusKey: 'StatusKey0',
    submittedat: '2026-04-20T10:00:00.000Z',
  },
  {
    id: 'req-002',
    requesttitle: 'Vacation - Priya Patel',
    employee: { id: '00000000-0000-0000-0000-000000000003', name1: 'Priya Patel' },
    manager: { id: '00000000-0000-0000-0000-000000000001', name1: 'Sarah Johnson' },
    leavetypeKey: 'LeavetypeKey2',
    startdate: '2026-06-10',
    enddate: '2026-06-20',
    reason: 'Annual family vacation',
    statusKey: 'StatusKey1',
    submittedat: '2026-04-15T09:00:00.000Z',
    reviewercomment: 'Approved! Have a great vacation.',
    reviewedat: '2026-04-16T11:00:00.000Z',
  },
];
