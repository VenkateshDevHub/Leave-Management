import { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { LeaveRequestCard } from '@/components/leave-request-card';
import { ApprovalDialog } from '@/components/approval-dialog';
import { useCurrentEmployee } from '@/hooks/use-current-employee';
import { useLeaveRequestList } from '@/generated/hooks/use-leave-request';
import { useEmployeeList } from '@/generated/hooks/use-employee';
import type { LeaveRequest } from '@/generated/models/leave-request-model';
import type { Employee } from '@/generated/models/employee-model';

export default function ManagerDashboardPage() {
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [approvalOpen, setApprovalOpen] = useState(false);

  const { employee: currentEmployee, isLoading: employeeLoading } = useCurrentEmployee();
  const { data: allRequests, isLoading: requestsLoading } = useLeaveRequestList();
  const { data: employees } = useEmployeeList();

  const isLoading = employeeLoading || requestsLoading;

  // For demo: Get managers (employees without a manager) and use the first one
  const managers = (employees || []).filter((emp: Employee | null | undefined) => {
    if (!emp) return false;
    if (typeof emp !== 'object') return false;
    if (!('id' in emp) || !emp.id) return false;
    // Managers are employees without a manager assigned
    return !emp.manager || !emp.manager.id;
  }) as Employee[];
  const currentManager = managers.length > 0 ? managers[0] : currentEmployee;

  // Filter requests where the current user is the manager - with strict null checks
  const teamRequests = (allRequests || []).filter((req: LeaveRequest) => {
    if (!req || !req.id) return false;
    if (!req.manager || !req.manager.id) return false;
    if (!currentManager || !currentManager.id) return false;
    return req.manager.id === currentManager.id;
  });

  // Categorize requests - ensure each request has an id
  const pendingRequests = teamRequests.filter((r: LeaveRequest) => r && r.id && r.statusKey === 'StatusKey0');
  const approvedRequests = teamRequests.filter((r: LeaveRequest) => r && r.id && r.statusKey === 'StatusKey1');
  const rejectedRequests = teamRequests.filter((r: LeaveRequest) => r && r.id && r.statusKey === 'StatusKey2');

  // Get team members - with strict null checks
  const teamMembers = (employees || []).filter((emp: Employee | null | undefined) => {
    if (!emp) return false;
    if (typeof emp !== 'object') return false;
    if (!('id' in emp) || !emp.id) return false;
    if (!emp.manager || !emp.manager.id) return false;
    if (!currentManager || !currentManager.id) return false;
    return emp.manager.id === currentManager.id;
  }) as Employee[];

  const handleRequestClick = (request: LeaveRequest) => {
    if (!request || !request.id) return;
    setSelectedRequest(request);
    setApprovalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Manager Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Review and manage leave requests from your team
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{teamMembers.length}</p>
                <p className="text-sm text-muted-foreground">Team Members</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <Card className="border-l-4 border-l-amber-400">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingRequests.length}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{approvedRequests.length}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-rose-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{rejectedRequests.length}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Requests Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Team Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="pending" className="gap-2">
                Pending
                {pendingRequests.length > 0 && (
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                    {pendingRequests.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {pendingRequests.length === 0 ? (
                <Empty className="py-12">
                  <EmptyHeader>
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <EmptyTitle>No pending requests</EmptyTitle>
                    <EmptyDescription>
                      All caught up! No leave requests awaiting your review.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <div className="grid gap-4">
                  {pendingRequests.map((request: LeaveRequest) => (
                    <LeaveRequestCard
                      key={request.id}
                      request={request}
                      showEmployee
                      employees={employees}
                      onClick={() => handleRequestClick(request)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="approved">
              {approvedRequests.length === 0 ? (
                <Empty className="py-12">
                  <EmptyHeader>
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <EmptyTitle>No approved requests</EmptyTitle>
                    <EmptyDescription>
                      No leave requests have been approved yet.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <div className="grid gap-4">
                  {approvedRequests.map((request: LeaveRequest) => (
                    <LeaveRequestCard
                      key={request.id}
                      request={request}
                      showEmployee
                      employees={employees}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="rejected">
              {rejectedRequests.length === 0 ? (
                <Empty className="py-12">
                  <EmptyHeader>
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <EmptyTitle>No rejected requests</EmptyTitle>
                    <EmptyDescription>
                      No leave requests have been rejected.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <div className="grid gap-4">
                  {rejectedRequests.map((request: LeaveRequest) => (
                    <LeaveRequestCard
                      key={request.id}
                      request={request}
                      showEmployee
                      employees={employees}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Approval Dialog */}
      <ApprovalDialog
        open={approvalOpen}
        onOpenChange={setApprovalOpen}
        request={selectedRequest}
      />
    </div>
  );
}
