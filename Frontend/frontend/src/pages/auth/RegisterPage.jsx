import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../api/auth';
import { Card, Input, Select, Button, Alert } from '../../components/ui';
import { UserPlus } from 'lucide-react';

const ROLE_OPTIONS = [
  { value: 'employee', label: 'Employee' },
  { value: 'manager', label: 'Manager' },
  { value: 'hr', label: 'HR' },
  { value: 'admin', label: 'Admin' },
];

const INITIAL = { name: '', email: '', password: '', confirm_password: '', role: 'employee' };

export default function RegisterPage() {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authAPI.register({ name: form.name, email: form.email, password: form.password, role: form.role });
      setSuccess('User account created successfully!');
      setTimeout(() => navigate('/employees'), 1500);
    } catch (err) {
      const data = err.response?.data;
      setError(typeof data === 'object' ? Object.values(data).flat().join(' ') : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <UserPlus size={18} className="text-blue-600" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800">Create User Account</h2>
            <p className="text-xs text-slate-400">Admin & HR only</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Alert message={error} type="error" />
          <Alert message={success} type="success" />

          <Input label="Full Name" placeholder="Jane Smith" value={form.name} onChange={set('name')} required />
          <Input label="Email Address" type="email" placeholder="jane@company.com" value={form.email} onChange={set('email')} required />
          <Select label="Role" options={ROLE_OPTIONS} value={form.role} onChange={set('role')} />
          <Input label="Password" type="password" placeholder="Min. 8 characters" value={form.password} onChange={set('password')} required />
          <Input label="Confirm Password" type="password" placeholder="••••••••" value={form.confirm_password} onChange={set('confirm_password')} required />

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={loading} className="flex-1">Create Account</Button>
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}