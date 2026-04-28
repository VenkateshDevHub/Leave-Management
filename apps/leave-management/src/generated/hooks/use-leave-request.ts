import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { LeaveRequest } from '../models/leave-request-model';
import { SEED_LEAVE_REQUESTS } from '../seed-data';

const STORAGE_KEY = 'leave-mgmt-requests';

function getStoredRequests(): LeaveRequest[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as LeaveRequest[];
  } catch {
    // ignore parse errors
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_LEAVE_REQUESTS));
  return SEED_LEAVE_REQUESTS;
}

function saveRequests(requests: LeaveRequest[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

function generateId(): string {
  return `req-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useLeaveRequestList() {
  return useQuery({
    queryKey: ['leave-requests'],
    queryFn: async () => getStoredRequests(),
  });
}

export function useCreateLeaveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<LeaveRequest, 'id'>) => {
      const requests = getStoredRequests();
      const newRequest: LeaveRequest = { ...data, id: generateId() };
      saveRequests([...requests, newRequest]);
      return newRequest;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
    },
  });
}

export function useUpdateLeaveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<LeaveRequest>;
    }) => {
      const requests = getStoredRequests();
      const idx = requests.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error(`Request ${id} not found`);
      requests[idx] = { ...requests[idx], ...changedFields };
      saveRequests(requests);
      return requests[idx];
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
    },
  });
}

export function useDeleteLeaveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const requests = getStoredRequests();
      const filtered = requests.filter((r) => r.id !== id);
      saveRequests(filtered);
      return id;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
    },
  });
}
