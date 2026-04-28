import { useAuth } from '@/contexts/auth-context';

/**
 * Gets the current logged-in employee from the auth context.
 */
export function useCurrentEmployee() {
  const { user, isLoading } = useAuth();

  return {
    employee: user?.employee ?? null,
    isLoading,
    isManager: user?.isManager ?? false,
  };
}
