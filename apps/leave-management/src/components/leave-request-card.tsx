import { motion } from 'motion/react';
import { CalendarDays, MessageSquare, User, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LeaveStatusBadge } from './leave-status-badge';
import { LeaveTypeBadge } from './leave-type-badge';
import { formatDate, calculateDays } from '@/lib/date-utils';
import type { LeaveRequest } from '@/generated/models/leave-request-model';
import type { Employee } from '@/generated/models/employee-model';

interface LeaveRequestCardProps {
  request: LeaveRequest;
  showEmployee?: boolean;
  employees?: Employee[];
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showEditButton?: boolean;
}

export function LeaveRequestCard({ request, showEmployee = false, employees, onClick, onEdit, onDelete, showEditButton = false }: LeaveRequestCardProps) {
  // Guard against null request
  if (!request || !request.id) {
    return null;
  }

  const days = calculateDays(request.startdate, request.enddate);
  
  // Get full employee details to access employee code - safely handle null employee
  const employeeId = request.employee?.id;
  const employeeDetails = employeeId && employees ? employees.find((emp: Employee | null | undefined) => emp && emp.id === employeeId) : null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' as const }}
    >
      <Card
        className={`group overflow-hidden transition-all duration-200 hover:shadow-md ${
          onClick ? 'cursor-pointer hover:border-teal-300' : ''
        }`}
        onClick={onClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {showEmployee && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-teal-700" />
                  </div>
                  <span className="font-medium text-foreground truncate">
                    {request.employee?.name1 || 'Unknown Employee'}
                    {employeeDetails?.employeecode && (
                      <span className="text-muted-foreground font-normal"> ({employeeDetails.employeecode})</span>
                    )}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 flex-wrap">
                <LeaveTypeBadge leaveTypeKey={request.leavetypeKey} />
                <LeaveStatusBadge statusKey={request.statusKey} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {showEditButton && request.statusKey === 'StatusKey0' && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      onEdit?.();
                    }}
                    className="h-8 px-2 text-muted-foreground hover:text-teal-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      onDelete?.();
                    }}
                    className="h-8 px-2 text-muted-foreground hover:text-rose-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
              <div className="text-right text-sm text-muted-foreground">
                <div className="font-medium text-foreground">{days} day{days !== 1 ? 's' : ''}</div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>
              {formatDate(request.startdate)} — {formatDate(request.enddate)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{request.reason}</p>
          {request.reviewercomment && (
            <div className="pt-2 border-t border-border">
              <div className="flex items-start gap-2 text-sm">
                <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <p className="text-muted-foreground italic">"{request.reviewercomment}"</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
