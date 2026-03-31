import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, Alert } from '../../components/ui';
import { UserCircle, Lock, Building2 } from 'lucide-react';

const ROLE_DASHBOARD = {
  Admin:  '/dashboard',
  HR:  '/dashboard',
  Manager:  '/dashboard',
  Employee: '/dashboard',
};

export default function LoginPage() {
  const [form, setForm]       = useState({ login: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data       = await login(form);
      const role       = data?.user?.role;
      const redirectTo = ROLE_DASHBOARD[role] || '/dashboard';
      navigate(redirectTo);
    } catch (err) {
      const errData = err.response?.data;
      const message =
        typeof errData === 'object'
          ? Object.values(errData).flat().join(' ')
          : 'Login failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Detect if user is typing an email
  const isEmail     = form.login.includes('@');
  const placeholder = isEmail ? 'you@company.com' : 'your_username';
  const inputLabel  = 'Username or Email';

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
              label={<span className="text-blue-100">{inputLabel}</span>}
              type="text"
              placeholder={placeholder}
              icon={UserCircle}
              value={form.login}
              onChange={(e) => setForm({ ...form, login: e.target.value })}
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
              <Link
                to="/reset-password"
                className="text-xs text-blue-300 hover:text-white transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" loading={loading} className="w-full py-3 text-base">
              Sign In
            </Button>
          </form>

          {/* Hint text */}
          <p className="text-center text-blue-300/60 text-xs mt-6">
            You can sign in using your <span className="text-blue-300">username</span> or <span className="text-blue-300">email address</span>
          </p>
          
        </div>
      </div>
    </div>
  );
}