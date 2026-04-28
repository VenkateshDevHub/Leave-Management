import { motion } from 'motion/react';
import { Umbrella, HeartPulse, TreePalm } from 'lucide-react';
import type { LeaveBalance } from '@/generated/models/leave-balance-model';

const leaveTypeConfig = {
  LeavetypeKey0: { label: 'Casual', icon: Umbrella, color: 'teal' },
  LeavetypeKey1: { label: 'Sick', icon: HeartPulse, color: 'rose' },
  LeavetypeKey2: { label: 'Vacation', icon: TreePalm, color: 'amber' },
};

interface LeaveBalanceCardProps {
  balance: LeaveBalance;
  index?: number;
}

export function LeaveBalanceCard({ balance, index = 0 }: LeaveBalanceCardProps) {
  const config = leaveTypeConfig[balance.leavetypeKey] || leaveTypeConfig.LeavetypeKey0;
  const Icon = config.icon;
  const remaining = balance.totaldays - balance.useddays;
  const usagePercent = (balance.useddays / balance.totaldays) * 100;

  const colorClasses = {
    teal: {
      bg: 'bg-teal-100 dark:bg-teal-900/30',
      icon: 'text-teal-600 dark:text-teal-400',
      bar: 'bg-teal-500',
      track: 'bg-teal-100 dark:bg-teal-900/50',
    },
    rose: {
      bg: 'bg-rose-100 dark:bg-rose-900/30',
      icon: 'text-rose-600 dark:text-rose-400',
      bar: 'bg-rose-500',
      track: 'bg-rose-100 dark:bg-rose-900/50',
    },
    amber: {
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      icon: 'text-amber-600 dark:text-amber-400',
      bar: 'bg-amber-500',
      track: 'bg-amber-100 dark:bg-amber-900/50',
    },
  };

  const colors = colorClasses[config.color as keyof typeof colorClasses];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1, ease: 'easeOut' as const }}
      className="p-4 rounded-lg border bg-card"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${colors.icon}`} />
        </div>
        <div>
          <p className="font-medium text-foreground">{config.label}</p>
          <p className="text-xs text-muted-foreground">{balance.year}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Remaining</span>
          <span className="font-semibold text-foreground">{remaining} / {balance.totaldays} days</span>
        </div>
        <div className={`h-2 rounded-full ${colors.track} overflow-hidden`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${usagePercent}%` }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.2, ease: 'easeOut' as const }}
            className={`h-full ${colors.bar} rounded-full`}
          />
        </div>
        <p className="text-xs text-muted-foreground text-right">
          {balance.useddays} used
        </p>
      </div>
    </motion.div>
  );
}
