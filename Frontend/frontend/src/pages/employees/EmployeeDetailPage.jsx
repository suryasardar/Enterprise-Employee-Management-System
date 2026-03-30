import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { employeesAPI } from '../../api/employees';
import { Badge, Button, Card } from '../../components/ui';
import { Edit, Trash2, Mail, Phone, Calendar, Briefcase, Building2, DollarSign } from 'lucide-react';

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
        <Icon size={15} className="text-blue-500" />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <p className="text-sm text-slate-700 font-medium mt-0.5">{value || '—'}</p>
      </div>
    </div>
  );
}

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    employeesAPI.getById(id)
      .then(({ data }) => setEmployee(data))
      .catch(() => setError('Employee not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleTerminate = async () => {
    if (window.confirm('Terminate this employee?')) {
      await employeesAPI.terminate(id);
      setEmployee((e) => ({ ...e, is_active: false }));
    }
  };

  if (loading) return <div className="text-center py-16 text-slate-400">Loading employee...</div>;
  if (error) return <div className="text-center py-16 text-red-400">{error}</div>;
  if (!employee) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {employee.first_name?.[0]}{employee.last_name?.[0]}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                {employee.first_name} {employee.last_name}
              </h2>
              <p className="text-slate-500 text-sm mt-0.5">{employee.job_title}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={employee.is_active !== false ? 'green' : 'red'}>
                  {employee.is_active !== false ? 'Active' : 'Terminated'}
                </Badge>
                <Badge variant="blue">{employee.role}</Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => navigate(`/employees/${id}/edit`)}>
              <Edit size={14} /> Edit
            </Button>
            {employee.is_active !== false && (
              <Button variant="danger" size="sm" onClick={handleTerminate}>
                <Trash2 size={14} /> Terminate
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-slate-700 mb-2">Contact Information</h3>
          <div className="divide-y divide-slate-50">
            <InfoRow icon={Mail} label="Email" value={employee.email} />
            <InfoRow icon={Phone} label="Phone" value={employee.phone} />
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold text-slate-700 mb-2">Job Details</h3>
          <div className="divide-y divide-slate-50">
            <InfoRow icon={Building2} label="Department" value={employee.department} />
            <InfoRow icon={Briefcase} label="Job Title" value={employee.job_title} />
            <InfoRow icon={Calendar} label="Date Joined" value={employee.date_joined ? new Date(employee.date_joined).toLocaleDateString() : null} />
            <InfoRow icon={DollarSign} label="Salary" value={employee.salary ? `₹${Number(employee.salary).toLocaleString()}` : null} />
          </div>
        </Card>
      </div>

      <Button variant="ghost" onClick={() => navigate('/employees')}>
        ← Back to Employees
      </Button>
    </div>
  );
}