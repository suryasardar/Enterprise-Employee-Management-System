import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { employeesAPI } from '../../api/employees';
import { useEmployees } from '../../hooks/useEmployees';
import { Button, Input, Select, Alert, Card } from '../../components/ui';

const DEPT_OPTIONS = [
  { value: '', label: 'Select department' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'HR', label: 'Human Resources' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Operations', label: 'Operations' },
];

const ROLE_OPTIONS = [
  { value: 'employee', label: 'Employee' },
  { value: 'manager', label: 'Manager' },
  { value: 'hr', label: 'HR' },
  { value: 'admin', label: 'Admin' },
];

const INITIAL = {
  first_name: '', last_name: '', email: '', phone: '',
  department: '', job_title: '', role: 'employee',
  date_joined: '', salary: '',
};

export default function EmployeeFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { createEmployee, updateEmployee } = useEmployees();

  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEdit) {
      setFetchLoading(true);
      employeesAPI.getById(id)
        .then(({ data }) => setForm({ ...INITIAL, ...data }))
        .catch(() => setError('Failed to load employee data'))
        .finally(() => setFetchLoading(false));
    }
  }, [id, isEdit]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEdit) {
        await updateEmployee(id, form);
        setSuccess('Employee updated successfully!');
      } else {
        const emp = await createEmployee(form);
        setSuccess('Employee created successfully!');
        setTimeout(() => navigate(`/employees/${emp.id}`), 1200);
      }
    } catch (err) {
      const data = err.response?.data;
      setError(typeof data === 'object' ? Object.values(data).flat().join(' ') : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div className="text-center py-16 text-slate-400">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">
          {isEdit ? 'Edit Employee' : 'New Employee'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Alert message={error} type="error" />
          <Alert message={success} type="success" />

          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" placeholder="John" value={form.first_name} onChange={set('first_name')} required />
            <Input label="Last Name" placeholder="Doe" value={form.last_name} onChange={set('last_name')} required />
          </div>

          <Input label="Email Address" type="email" placeholder="john@company.com" value={form.email} onChange={set('email')} required />
          <Input label="Phone Number" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />

          <div className="grid grid-cols-2 gap-4">
            <Select label="Department" options={DEPT_OPTIONS} value={form.department} onChange={set('department')} />
            <Input label="Job Title" placeholder="Software Engineer" value={form.job_title} onChange={set('job_title')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select label="Role" options={ROLE_OPTIONS} value={form.role} onChange={set('role')} />
            <Input label="Date Joined" type="date" value={form.date_joined} onChange={set('date_joined')} />
          </div>

          <Input label="Salary (₹)" type="number" placeholder="500000" value={form.salary} onChange={set('salary')} />

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" loading={loading} className="flex-1">
              {isEdit ? 'Save Changes' : 'Create Employee'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}