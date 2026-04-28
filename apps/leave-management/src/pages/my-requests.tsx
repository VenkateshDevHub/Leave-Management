import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { LeaveRequestCard } from '@/components/leave-request-card';
import { LeaveRequestForm } from '@/components/leave-request-form';
import { EditLeaveRequestForm } from '@/components/edit-leave-request-form';
import { LeaveBalanceCard } from '@/components/leave-balance-card';
import { DeleteLeaveDialog } from '@/components/delete-leave-dialog';
import { useCurrentEmployee } from '@/hooks/use-current-employee';
import { useLeaveRequestList } from '@/generated/hooks/use-leave-request';
import { useLeaveBalanceList } from '@/generated/hooks/use-leave-balance';
import type { LeaveRequest, LeaveRequestStatusKey } from '@/generated/models/leave-request-model';
import type { LeaveBalance } from '@/generated/models/leave-balance-model';

export default function MyRequestsPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<LeaveRequest | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingRequest, setDeletingRequest] = useState<LeaveRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState<LeaveRequestStatusKey | 'all'>('all');

  const { employee, isLoading: employeeLoading } = useCurrentEmployee();
  const { data: allRequests, isLoading: requestsLoading } = useLeaveRequestList();
  const { data: allBalances, isLoading: balancesLoading } = useLeaveBalanceList();

  const isLoading = employeeLoading || requestsLoading || balancesLoading;

  // Filter requests for the current employee - with strict null checks
  const myRequests = (allRequests || []).filter((req: LeaveRequest) => {
    if (!req || !req.id) return false;
    if (!req.employee || !req.employee.id) return false;
    if (!employee || !employee.id) return false;
    return req.employee.id === employee.id;
  });

  // Filter balances for the current employee - with strict null checks
  const myBalances = (allBalances || []).filter((bal: LeaveBalance) => {
    if (!bal || !bal.id) return false;
    if (!bal.employee || !bal.employee.id) return false;
    if (!employee || !employee.id) return false;
    return bal.employee.id === employee.id;
  });

  // Apply status filter
  const filteredRequests = statusFilter === 'all'
    ? myRequests
    : myRequests.filter((req: LeaveRequest) => req && req.id && req.statusKey === statusFilter);

  // Count by status - with null checks
  const pendingCount = myRequests.filter((r: LeaveRequest) => r && r.id && r.statusKey === 'StatusKey0').length;
  const approvedCount = myRequests.filter((r: LeaveRequest) => r && r.id && r.statusKey === 'StatusKey1').length;
  const rejectedCount = myRequests.filter((r: LeaveRequest) => r && r.id && r.statusKey === 'StatusKey2').length;

  const handleEditClick = (request: LeaveRequest) => {
    setEditingRequest(request);
    setEditFormOpen(true);
  };

  const handleDeleteClick = (request: LeaveRequest) => {
    setDeletingRequest(request);
    setDeleteDialogOpen(true);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Leave Requests</h1>
          <p className="text-muted-foreground mt-1">Track and manage your time off requests</p>
        </div>
        <Button
          onClick={() => setFormOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Request Leave
        </Button>
      </div>

      {/* Leave Balances */}
      {myBalances.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">My Leave Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {myBalances.map((balance: LeaveBalance, index: number) => (
                <LeaveBalanceCard key={balance.id} balance={balance} index={index} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-l-4 border-l-amber-400">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border-l-4 border-l-emerald-400">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{approvedCount}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="border-l-4 border-l-rose-400">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-rose-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{rejectedCount}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Filter:</span>
        <Select
          value={statusFilter}
          onValueChange={(val: string) => setStatusFilter(val as LeaveRequestStatusKey | 'all')}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Requests</SelectItem>
            <SelectItem value="StatusKey0">Pending</SelectItem>
            <SelectItem value="StatusKey1">Approved</SelectItem>
            <SelectItem value="StatusKey2">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Request List */}
      {filteredRequests.length === 0 ? (
        <Empty className="py-16">
          <EmptyHeader>
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <EmptyTitle>No leave requests</EmptyTitle>
            <EmptyDescription>
              {statusFilter === 'all'
                ? "You haven't submitted any leave requests yet."
                : `No ${statusFilter === 'StatusKey0' ? 'pending' : statusFilter === 'StatusKey1' ? 'approved' : 'rejected'} requests found.`}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-4">
          {filteredRequests.map((request: LeaveRequest) => (
            <LeaveRequestCard
              key={request.id}
              request={request}
              showEditButton
              onEdit={() => handleEditClick(request)}
              onDelete={() => handleDeleteClick(request)}
            />
          ))}
        </div>
      )}

      {/* Form Dialog */}
      {employee && (
        <LeaveRequestForm
          open={formOpen}
          onOpenChange={setFormOpen}
          employee={employee}
        />
      )}

      {/* Edit Form Dialog */}
      {editingRequest && (
        <EditLeaveRequestForm
          open={editFormOpen}
          onOpenChange={setEditFormOpen}
          request={editingRequest}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteLeaveDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        request={deletingRequest}
      />
    </div>
  );
}
