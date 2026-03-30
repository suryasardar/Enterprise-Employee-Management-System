import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

import LoginPage from './pages/auth/LoginPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import EmployeeListPage from './pages/employees/EmployeeListPage';
import EmployeeDetailPage from './pages/employees/EmployeeDetailPage';
import EmployeeFormPage from './pages/employees/EmployeeFormPage';
import EmployeeSearchPage from './pages/employees/EmployeeSearchPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* All authenticated users */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/employees" element={<EmployeeListPage />} />
              <Route path="/employees/search" element={<EmployeeSearchPage />} />
              <Route path="/employees/:id" element={<EmployeeDetailPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Admin & HR only */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'hr']} />}>
            <Route element={<MainLayout />}>
              <Route path="/employees/new" element={<EmployeeFormPage />} />
              <Route path="/employees/:id/edit" element={<EmployeeFormPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}