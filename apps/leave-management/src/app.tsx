import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';

import Layout from '@/pages/_layout';
import { queryClient } from '@/lib/query-client';
import { AuthProvider } from '@/contexts/auth-context';
import { ProtectedRoute } from '@/components/protected-route';

import ErrorBoundary from '@/components/system/error-boundary';

import LoginPage from '@/pages/login';
import MyRequestsPage from '@/pages/my-requests';
import ManagerDashboardPage from '@/pages/manager-dashboard';
import NotFoundPage from '@/pages/not-found';

function App() {
  useEffect(() => {
    // Power Apps initialization handled at platform level
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary resetQueryCache>
        <JotaiProvider>
          <AuthProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<MyRequestsPage />} />
                  <Route
                    path="manager"
                    element={
                      <ProtectedRoute requireManager>
                        <ManagerDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </Router>
          </AuthProvider>
        </JotaiProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;