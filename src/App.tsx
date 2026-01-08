import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Dashboard } from '@/pages/Dashboard';
import { Login } from '@/pages/Login';
import { Help } from '@/pages/Help';
import { Admin } from '@/pages/Admin';
import { ToastContainer } from '@/components/ui/Toast';
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

  // Firebase Auth State Listener - Restores session on page refresh
  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && firebaseUser.email) {
        // User is signed in, verify whitelist and restore session
        try {
          const profile = await verifyWhitelist(firebaseUser.email);
          if (profile) {
            login(firebaseUser.email, profile.role);
          } else {
            // User not in whitelist, sign them out
            logout();
          }
        } catch (error) {
          console.error('Session restoration failed:', error);
          logout();
        }
      } else {
        // User is signed out
        logout();
      }
    });

    return () => unsubscribe();
  }, [login, logout]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
