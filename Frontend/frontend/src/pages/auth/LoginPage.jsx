import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, Alert } from '../../components/ui';
import { Mail, Lock, Building2 } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-500 rounded-2xl shadow-lg mb-4">
            <Building2 size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">HRFlow</h1>
          <p className="text-blue-300 mt-1 text-sm">Sign in to your workspace</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Alert message={error} type="error" />

            <Input
              label={<span className="text-blue-100">Email Address</span>}
              type="email"
              placeholder="you@company.com"
              icon={Mail}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="bg-white/10 border-white/20 text-white placeholder-blue-300 focus:border-blue-300"
            />

            <Input
              label={<span className="text-blue-100">Password</span>}
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="bg-white/10 border-white/20 text-white placeholder-blue-300 focus:border-blue-300"
            />

            <div className="flex justify-end">
              <Link to="/reset-password" className="text-xs text-blue-300 hover:text-white transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" loading={loading} className="w-full py-3 text-base">
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}