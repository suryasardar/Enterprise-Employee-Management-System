import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../../hooks/useEmployees';
import { Card, Badge, Button } from '../../components/ui';
import { Plus, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';

export default function EmployeeListPage() {
  const { employees, loading, fetchEmployees, terminateEmployee, pagination } = useEmployees();
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const PAGE_SIZE = 10;

  useEffect(() => {
    fetchEmployees({ page, page_size: PAGE_SIZE });
  }, [page, fetchEmployees]);

  const handleTerminate = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to terminate this employee?')) {
      await terminateEmployee(id);
    }
  };

  const totalPages = Math.ceil((pagination.count || 0) / PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{pagination.count || 0} total employees</p>
        </div>
        <Button onClick={() => navigate('/employees/new')}>
          <Plus size={16} /> Add Employee
        </Button>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wide">Employee</th>
                <th className="text-left px-4 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wide">Department</th>
                <th className="text-left px-4 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wide">Job Title</th>
                <th className="text-left px-4 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wide">Joined</th>
                <th className="px-4 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && (
                <tr><td colSpan={6} className="text-center py-12 text-slate-400">Loading employees...</td></tr>
              )}
              {!loading && employees.map((emp) => (
                <tr
                  key={emp.id}
                  className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                  onClick={() => navigate(`/employees/${emp.id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                        {emp.first_name?.[0]}{emp.last_name?.[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{emp.first_name} {emp.last_name}</p>
                        <p className="text-xs text-slate-400">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{emp.department || '—'}</td>
                  <td className="px-4 py-4 text-slate-600">{emp.job_title || '—'}</td>
                  <td className="px-4 py-4">
                    <Badge variant={emp.is_active !== false ? 'green' : 'red'}>
                      {emp.is_active !== false ? 'Active' : 'Terminated'}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-slate-400 text-xs">
                    {emp.date_joined ? new Date(emp.date_joined).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/employees/${emp.id}/edit`); }}>
                        Edit
                      </Button>
                      {emp.is_active !== false && (
                        <Button variant="danger" size="sm" onClick={(e) => handleTerminate(emp.id, e)}>
                          Terminate
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && employees.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-slate-400">No employees found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
            <p className="text-xs text-slate-400">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => setPage((p) => p - 1)} disabled={!pagination.previous}>
                <ChevronLeft size={14} /> Prev
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setPage((p) => p + 1)} disabled={!pagination.next}>
                Next <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}