import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../../hooks/useEmployees';
import { Input, Card, Badge } from '../../components/ui';
import { Search } from 'lucide-react';

export default function EmployeeSearchPage() {
  const [query, setQuery] = useState('');
  const { employees, searchEmployees, loading } = useEmployees();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim().length > 1) searchEmployees(value.trim());
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="p-6">
        <Input
          placeholder="Search by name, email, or department..."
          icon={Search}
          value={query}
          onChange={handleSearch}
          className="text-base"
        />
      </Card>

      {loading && <div className="text-center py-8 text-slate-400 text-sm">Searching...</div>}

      {!loading && query.length > 1 && employees.length === 0 && (
        <div className="text-center py-8 text-slate-400 text-sm">No results found for "{query}"</div>
      )}

      {employees.length > 0 && (
        <Card className="overflow-hidden">
          <div className="divide-y divide-slate-50">
            {employees.map((emp) => (
              <div
                key={emp.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-blue-50/40 cursor-pointer transition-colors"
                onClick={() => navigate(`/employees/${emp.id}`)}
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                  {emp.first_name?.[0]}{emp.last_name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{emp?.username}</p>
                  <p className="text-xs text-slate-400 truncate">{emp?.user?.email}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-slate-500">{emp.department}</span>
                  <Badge variant={emp.is_active !== false ? 'green' : 'red'}>
                    {emp.is_active !== false ? 'Active' : 'Off'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}