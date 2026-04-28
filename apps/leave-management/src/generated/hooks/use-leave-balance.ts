import { useQuery } from '@tanstack/react-query';
import type { LeaveBalance } from '../models/leave-balance-model';
import { SEED_LEAVE_BALANCES } from '../seed-data';

const STORAGE_KEY = 'leave-mgmt-balances';

function getStoredBalances(): LeaveBalance[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as LeaveBalance[];
  } catch {
    // ignore parse errors
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_LEAVE_BALANCES));
  return SEED_LEAVE_BALANCES;
}

export function useLeaveBalanceList() {
  return useQuery({
    queryKey: ['leave-balances'],
    queryFn: async () => getStoredBalances(),
  });
}
