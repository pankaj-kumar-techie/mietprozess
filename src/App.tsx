import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Dashboard } from '@/pages/Dashboard';
import { Login } from '@/pages/Login';
import { Help } from '@/pages/Help';
import { Admin } from '@/pages/Admin';
import { ToastContainer } from '@/components/ui/Toast';
import { useUISettings } from '@/store/useUISettings';

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

  React.useEffect(() => {
    initializeUI();
  }, [initializeUI]);

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
