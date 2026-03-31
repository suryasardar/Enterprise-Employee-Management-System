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
  { value: 'Employee', label: 'Employee' },
  { value: 'Manager', label: 'Manager' },
  { value: 'HR', label: 'HR' },
  { value: 'Admin', label: 'Admin' },
];

const INITIAL = {
  username: '',
  email: '',
  password: '', // Should probably be hidden/optional in Edit mode
  role: 'Employee',
  phone: '',
  employee_id: '',
  department: '',
  designation: '',
  joining_date: '',
  reporting_manager: 1,
  status: 'Active'
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
          {isEdit ? 'Edit Employee Profile' : 'Register New Employee'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Alert message={error} type="error" />
          <Alert message={success} type="success" />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Username" placeholder="alice_dev" value={form.username} onChange={set('username')} required />
            <Input label="Employee ID" placeholder="EMP001" value={form.employee_id} onChange={set('employee_id')} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Email Address" type="email" placeholder="alice@hrms.com" value={form.email} onChange={set('email')} required />
            <Input label="Password" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required={!isEdit} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone Number" type="tel" placeholder="9123456780" value={form.phone} onChange={set('phone')} />
            <Input label="Designation" placeholder="Software Engineer" value={form.designation} onChange={set('designation')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select label="Department" options={DEPT_OPTIONS} value={form.department} onChange={set('department')} />
            <Select label="Role" options={ROLE_OPTIONS} value={form.role} onChange={set('role')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Joining Date" type="date" value={form.joining_date} onChange={set('joining_date')} />
            <Select 
                label="Status" 
                options={[{value: 'Active', label: 'Active'}, {value: 'Inactive', label: 'Inactive'}]} 
                value={form.status} 
                onChange={set('status')} 
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" loading={loading} className="flex-1">
              {isEdit ? 'Update Record' : 'Save Employee'}
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