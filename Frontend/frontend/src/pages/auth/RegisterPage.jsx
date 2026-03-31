import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../api/auth';
import { Card, Input, Select, Button, Alert } from '../../components/ui';
import { UserPlus } from 'lucide-react';

// Updated values to match the JSON casing (e.g., "HR" instead of "hr")
const ROLE_OPTIONS = [
  { value: 'Employee', label: 'Employee' },
  { value: 'Manager', label: 'Manager' },
  { value: 'HR', label: 'HR' },
  { value: 'Admin', label: 'Admin' },
];

const INITIAL = { 
  username: '', 
  email: '', 
  password: '', 
  confirm_password: '', 
  role: 'Employee',
  phone: '' 
};

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
      // Constructing the exact JSON body for the API
      const payload = {
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
        phone: form.phone
      };

      await authAPI.register(payload);
      
      setSuccess('User account created successfully!');
      
      // Redirect to the Employee Creation page next, 
      // passing the email or username to link the next step
      setTimeout(() => navigate('/employees/new', { state: { email: form.email } }), 1500);
      
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
            <h2 className="font-bold text-slate-800">Step 1: Create User Account</h2>
            <p className="text-xs text-slate-400">Establish login credentials first</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Alert message={error} type="error" />
          <Alert message={success} type="success" />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Username" placeholder="johs_hr" value={form.username} onChange={set('username')} required />
            <Input label="Phone Number" placeholder="9876543210" value={form.phone} onChange={set('phone')} required />
          </div>

          <Input label="Email Address" type="email" placeholder="johs@hrms.com" value={form.email} onChange={set('email')} required />
          
          <Select label="Assign Role" options={ROLE_OPTIONS} value={form.role} onChange={set('role')} />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Password" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required />
            <Input label="Confirm Password" type="password" placeholder="••••••••" value={form.confirm_password} onChange={set('confirm_password')} required />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" loading={loading} className="flex-1">Register & Continue</Button>
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}