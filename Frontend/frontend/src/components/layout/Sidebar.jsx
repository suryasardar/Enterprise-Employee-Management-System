import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Users, UserPlus, Search,
  LogOut, Settings, ChevronRight, Building2
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/employees', icon: Users, label: 'Employees' },
  { to: '/employees/new', icon: UserPlus, label: 'Add Employee' },
  { to: '/employees/search', icon: Search, label: 'Search' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 min-h-screen bg-blue-900 flex flex-col shadow-2xl">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-blue-700">
        <div className="w-9 h-9 bg-blue-400 rounded-xl flex items-center justify-center shadow">
          <Building2 size={20} className="text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-base leading-tight">HRFlow</p>
          <p className="text-blue-300 text-xs">Management Suite</p>
        </div>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-blue-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-sm font-medium truncate">{user?.name || 'User'}</p>
            <p className="text-blue-300 text-xs capitalize">{user?.role || 'employee'}</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all group
              ${isActive
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-900/50'
                : 'text-blue-200 hover:bg-blue-800 hover:text-white'}`
            }
          >
            <Icon size={18} />
            <span className="flex-1">{label}</span>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-4 pb-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-blue-200 hover:bg-red-500/20 hover:text-red-300 transition-all"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}