import { useQuery } from '@tanstack/react-query';
import type { Employee } from '../models/employee-model';
import { SEED_EMPLOYEES } from '../seed-data';

const STORAGE_KEY = 'leave-mgmt-employees';

function getStoredEmployees(): Employee[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as Employee[];
  } catch {
    // ignore parse errors
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_EMPLOYEES));
  return SEED_EMPLOYEES;
}

export function useEmployeeList() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async () => getStoredEmployees(),
  });
}
