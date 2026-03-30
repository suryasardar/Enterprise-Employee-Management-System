import { useState } from 'react';
import { authAPI } from '../api/auth';
import { Card, Input, Button, Alert } from '../components/ui';
import { Lock } from 'lucide-react';

export default function SettingsPage() {
  const [form, setForm] = useState({ old_password: '', new_password: '', confirm_password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (form.new_password !== form.confirm_password) {
      setError('New passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authAPI.changePassword({ old_password: form.old_password, new_password: form.new_password });
      setSuccess('Password changed successfully!');
      setForm({ old_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Lock size={18} className="text-blue-600" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800">Change Password</h2>
            <p className="text-xs text-slate-400">Update your account password</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <Alert message={error} type="error" />
          <Alert message={success} type="success" />

          <Input label="Current Password" type="password" placeholder="••••••••" value={form.old_password} onChange={set('old_password')} required />
          <Input label="New Password" type="password" placeholder="••••••••" value={form.new_password} onChange={set('new_password')} required />
          <Input label="Confirm New Password" type="password" placeholder="••••••••" value={form.confirm_password} onChange={set('confirm_password')} required />

          <Button type="submit" loading={loading} className="w-full mt-2">
            Update Password
          </Button>
        </form>
      </Card>
    </div>
  );
}