import { Bell, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header({ title }) {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h1 className="text-xl font-bold text-slate-800">{title}</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Quick search..."
            className="pl-9 pr-4 py-2 text-sm bg-slate-100 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-300 w-52 transition-all"
          />
        </div>
        <button className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors">
          <Bell size={18} className="text-slate-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
        </button>
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
}