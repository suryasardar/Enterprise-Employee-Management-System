import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/employees': 'Employees',
  '/employees/new': 'Add Employee',
  '/employees/search': 'Search Employees',
  '/settings': 'Settings',
};

export default function MainLayout() {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] || 'HR Management';

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} />
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}