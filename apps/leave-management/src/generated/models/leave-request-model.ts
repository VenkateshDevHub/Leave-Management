export type LeaveRequestStatusKey = 'StatusKey0' | 'StatusKey1' | 'StatusKey2';
export type LeaveRequestLeavetypeKey = 'LeavetypeKey0' | 'LeavetypeKey1' | 'LeavetypeKey2';

export interface LeaveRequest {
  id: string;
  requesttitle: string;
  employee?: { id: string; name1: string } | null;
  manager?: { id: string; name1: string } | null;
  leavetypeKey: LeaveRequestLeavetypeKey;
  startdate: string;
  enddate: string;
  reason: string;
  statusKey: LeaveRequestStatusKey;
  submittedat: string;
  reviewercomment?: string;
  reviewedat?: string;
}
