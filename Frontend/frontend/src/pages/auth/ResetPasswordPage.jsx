import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../api/auth';
import { Input, Button, Alert } from '../../components/ui';
import { Mail, Building2, ArrowLeft } from 'lucide-react';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authAPI.resetPassword({ email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-500 rounded-2xl shadow-lg mb-4">
            <Building2 size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Reset Password</h1>
          <p className="text-blue-300 mt-1 text-sm">We'll send a reset link to your email</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto">
                <Mail size={26} className="text-green-300" />
              </div>
              <p className="text-white font-semibold">Check your inbox!</p>
              <p className="text-blue-300 text-sm">A password reset link has been sent to <strong>{email}</strong></p>
              <Link to="/login" className="inline-flex items-center gap-2 text-blue-300 hover:text-white text-sm transition-colors mt-2">
                <ArrowLeft size={14} /> Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Alert message={error} type="error" />
              <Input
                label={<span className="text-blue-100">Email Address</span>}
                type="email"
                placeholder="you@company.com"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder-blue-300 focus:border-blue-300"
              />
              <Button type="submit" loading={loading} className="w-full py-3">
                Send Reset Link
              </Button>
              <div className="text-center">
                <Link to="/login" className="inline-flex items-center gap-1 text-blue-300 hover:text-white text-sm transition-colors">
                  <ArrowLeft size={14} /> Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}