
import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { ToastContainer } from '@/components/ui/Toast';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { OfflineBanner } from '@/components/OfflineBanner';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { verifyWhitelist } from '@/lib/auth-logic';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('@/pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Login = lazy(() => import('@/pages/Login').then(m => ({ default: m.Login })));
const Help = lazy(() => import('@/pages/Help').then(m => ({ default: m.Help })));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage').then(m => ({ default: m.AdminUsersPage })));
const TestRunnerPage = lazy(() => import('@/pages/admin/TestRunnerPage').then(m => ({ default: m.TestRunnerPage })));
const Profile = lazy(() => import('@/pages/Profile').then(m => ({ default: m.Profile })));
const PasswordChangePage = lazy(() => import('@/pages/PasswordChangePage').then(m => ({ default: m.PasswordChangePage })));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const NotFound = lazy(() => import('@/pages/NotFound').then(m => ({ default: m.NotFound })));

// Premium loading fallback
const PageLoader = () => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
    <div className="w-16 h-16 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin mb-4"></div>
    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Wird geladen...</p>
  </div>
);

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  const login = useAuthStore(state => state.login);
  const logout = useAuthStore(state => state.logout);

  // Firebase Auth state listener for session persistence
  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && firebaseUser.email) {
        try {
          const profile = await verifyWhitelist(firebaseUser.email);
          const userRole = profile?.role || 'user';
          const displayName = profile?.displayName || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';

          login({
            name: firebaseUser.email,
            email: firebaseUser.email,
            displayName,
            role: userRole,
            createdAt: firebaseUser.metadata.creationTime
          });
        } catch (error) {
          console.error('Session restoration failed:', error);
          login({
            name: firebaseUser.email,
            email: firebaseUser.email,
            displayName: firebaseUser.email?.split('@')[0],
            role: 'user'
          });
        }
      } else {
        logout();
      }
    });

    return () => unsubscribe();
  }, [login, logout]);

  return (
    <ErrorBoundary>
      <OfflineBanner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
            <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
            <Route path="/admin/tests" element={<AdminRoute><TestRunnerPage /></AdminRoute>} />

            {/* User Profile & Security */}
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/change-password" element={<ProtectedRoute><PasswordChangePage /></ProtectedRoute>} />

            {/* Catch-all for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <ToastContainer />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
