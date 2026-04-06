// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

// Auth
import LoginPage        from './pages/auth/LoginPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import RegisterPage     from './pages/auth/RegisterPage';

// Admin / HR
import DashboardPage      from './pages/DashboardPage';
import EmployeeListPage   from './pages/employees/EmployeeListPage';
import EmployeeDetailPage from './pages/employees/EmployeeDetailPage';
import EmployeeFormPage   from './pages/employees/EmployeeFormPage';
import EmployeeSearchPage from './pages/employees/EmployeeSearchPage';
import SettingsPage       from './pages/SettingsPage';

// Employee self-service
import EmployeePortalLayout from './pages/employees/EmployeePortalLayout';
import MyProfilePage        from './pages/employees/MyProfilePage';
import MyAttendancePage     from './pages/employees/MyAttendancePage';
import MyLeavePage          from './pages/employees/MyLeavePage';
import MyPayrollPage        from './pages/employees/MyPayrollPage';
import MyHolidaysPage       from './pages/employees/MyHolidaysPage';
import MyDocumentsPage      from './pages/employees/MyDocumentsPage';

function SmartRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === 'Employee'
    ? <Navigate to="/my-profile" replace />
    : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login"          element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/"               element={<SmartRedirect />} />

          {/* Employee self-service */}
          {/* <Route element={<ProtectedRoute  />}> */}
            {/* <Route element={<EmployeePortalLayout />}> */}
            <Route element={<MainLayout />}>
              <Route path="/my-profile"    element={<MyProfilePage />} />
              <Route path="/my-attendance" element={<MyAttendancePage />} />
              <Route path="/my-leave"      element={<MyLeavePage />} />
              <Route path="/my-payroll"    element={<MyPayrollPage />} />
              <Route path="/my-holidays"   element={<MyHolidaysPage />} />
              <Route path="/my-documents"  element={<MyDocumentsPage />} />
              <Route path="/settings"      element={<SettingsPage />} />
            </Route>
          {/* </Route> */}

          {/* Admin & HR */}
          <Route element={<ProtectedRoute allowedRoles={['Admin', 'HR', 'Manager']} />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard"        element={<DashboardPage />} />
              <Route path="/employees"        element={<EmployeeListPage />} />
              <Route path="/employees/search" element={<EmployeeSearchPage />} />
              <Route path="/employees/:id"    element={<EmployeeDetailPage />} />
              <Route path="/settings"         element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Admin & HR write ops */}
          <Route element={<ProtectedRoute allowedRoles={['Admin', 'HR']} />}>
            <Route element={<MainLayout />}>
              <Route path="/employees/new"      element={<EmployeeFormPage />} />
              <Route path="/employees/:id/edit" element={<EmployeeFormPage />} />
              <Route path="/register"           element={<RegisterPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}