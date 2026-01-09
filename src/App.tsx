import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Dashboard } from '@/pages/Dashboard';
import { Login } from '@/pages/Login';
import { Help } from '@/pages/Help';
import { Admin } from '@/pages/Admin';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminBrandingPage } from '@/pages/admin/AdminBrandingPage';
import { ToastContainer } from '@/components/ui/Toast';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useUISettings } from '@/store/useUISettings';
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
  const initializeUI = useUISettings(state => state.initialize);
  const login = useAuthStore(state => state.login);
  const logout = useAuthStore(state => state.logout);

  useEffect(() => {
    initializeUI();
  }, [initializeUI]);

  // Firebase Auth state listener for session persistence
  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && firebaseUser.email) {
        try {
          const profile = await verifyWhitelist(firebaseUser.email);
          const userRole = profile?.role || 'user';
          const displayName = profile?.displayName;
          login(firebaseUser.email, userRole, displayName);
        } catch (error) {
          console.error('Session restoration failed:', error);
          login(firebaseUser.email, 'user');
        }
      } else {
        logout();
      }
    });

    return () => unsubscribe();
  }, [login, logout]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
          <Route path="/admin/branding" element={<AdminRoute><AdminBrandingPage /></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><Admin /></AdminRoute>} />
          <Route path="/admin/security" element={<AdminRoute><Admin /></AdminRoute>} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
