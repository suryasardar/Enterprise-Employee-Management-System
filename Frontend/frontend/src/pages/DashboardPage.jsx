import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../hooks/useEmployees';
import { Card, Badge } from '../components/ui';
import { Users, UserCheck, UserX, TrendingUp, ArrowRight } from 'lucide-react';

function StatCard({ icon: Icon, label, value, color, trend }) {
  return (
    <Card className="p-6 flex items-start gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-3xl font-bold text-slate-800 mt-0.5">{value}</p>
        {trend && <p className="text-xs text-green-600 mt-1">↑ {trend} this month</p>}
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const { employees, fetchEmployees, loading, pagination } = useEmployees();
  const navigate = useNavigate();

  useEffect(() => { fetchEmployees({ page: 1, page_size: 5 }); }, [fetchEmployees]);

  const active = employees.filter((e) => e.is_active !== false).length;
  const inactive = employees.filter((e) => e.is_active === false).length;

  const stats = [
    { icon: Users, label: 'Total Employees', value: pagination.count || employees.length, color: 'bg-blue-500', trend: '3 new' },
    { icon: UserCheck, label: 'Active', value: active, color: 'bg-green-500' },
    { icon: UserX, label: 'Terminated', value: inactive, color: 'bg-red-400' },
    { icon: TrendingUp, label: 'Departments', value: new Set(employees.map((e) => e.department)).size, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Recent Employees */}
      <Card>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Recent Employees</h2>
          <button
            onClick={() => navigate('/employees')}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View all <ArrowRight size={14} />
          </button>
        </div>
        <div className="divide-y divide-slate-50">
          {loading && (
            <div className="px-6 py-8 text-center text-slate-400 text-sm">Loading...</div>
          )}
          {!loading && employees.slice(0, 5).map((emp) => (
            <div
              key={emp.id}
              className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 cursor-pointer transition-colors"
              onClick={() => navigate(`/employees/${emp.id}`)}
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                {emp.first_name?.[0]}{emp.last_name?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {emp.first_name} {emp.last_name}
                </p>
                <p className="text-xs text-slate-400 truncate">{emp.job_title} · {emp.department}</p>
              </div>
              <Badge variant={emp.is_active !== false ? 'green' : 'red'}>
                {emp.is_active !== false ? 'Active' : 'Terminated'}
              </Badge>
            </div>
          ))}
          {!loading && employees.length === 0 && (
            <div className="px-6 py-8 text-center text-slate-400 text-sm">No employees found</div>
          )}
        </div>
      </Card>
    </div>
  );
}