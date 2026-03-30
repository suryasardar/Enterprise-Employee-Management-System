// Role checks
export const ROLES = { ADMIN: 'admin', HR: 'hr', MANAGER: 'manager', EMPLOYEE: 'employee' };

export const hasRole = (user, ...roles) => roles.includes(user?.role);
export const isAdmin = (user) => hasRole(user, ROLES.ADMIN);
export const isAdminOrHR = (user) => hasRole(user, ROLES.ADMIN, ROLES.HR);
export const isManager = (user) => hasRole(user, ROLES.ADMIN, ROLES.HR, ROLES.MANAGER);

// Formatters
export const formatCurrency = (value, locale = 'en-IN', currency = 'INR') =>
  value != null
    ? new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(value)
    : '—';

export const formatDate = (dateStr) =>
  dateStr ? new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

export const getInitials = (firstName, lastName) =>
  `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();

// Status helpers
export const getStatusVariant = (isActive) => (isActive !== false ? 'green' : 'red');
export const getStatusLabel = (isActive) => (isActive !== false ? 'Active' : 'Terminated');

// API error parser
export const parseApiError = (err) => {
  const data = err?.response?.data;
  if (!data) return 'Something went wrong. Please try again.';
  if (typeof data === 'string') return data;
  if (data.detail) return data.detail;
  if (typeof data === 'object') return Object.values(data).flat().join(' ');
  return 'An unexpected error occurred.';
};