
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Dashboard } from '@/pages/Dashboard';
import { Login } from '@/pages/Login';
import { Help } from '@/pages/Help';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminBrandingPage } from '@/pages/admin/AdminBrandingPage';
import { Profile } from '@/pages/Profile';
import { NotificationsPage } from '@/pages/NotificationsPage';
import { NotFound } from '@/pages/NotFound';
import { ToastContainer } from '@/components/ui/Toast';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { OfflineBanner } from '@/components/OfflineBanner';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { verifyWhitelist } from '@/lib/auth-logic';

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
          <Route path="/admin/branding" element={<AdminRoute><AdminBrandingPage /></AdminRoute>} />

          {/* User Profile */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Catch-all for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
