import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role: string) => {
    const demos: Record<string, [string, string]> = {
      admin: ['admin@cleancity-demo.com', 'Admin@123'],
      staff: ['staff1@cleancity-demo.com', 'Staff@123'],
      citizen: ['citizen1@cleancity-demo.com', 'Citizen@123'],
    };
    const [e, p] = demos[role] || [];
    setEmail(e); setPassword(p);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-teal-500 rounded-xl flex items-center justify-center shadow">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-gray-900 text-xl">Clean <span className="text-primary-600">City</span></span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account to continue</p>
        </div>

        <div className="card shadow-elevated">
          {/* Demo login shortcuts */}
          <div className="mb-5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs font-semibold text-amber-800 mb-2">🧪 Quick Demo Login</p>
            <div className="flex gap-2">
              {['admin', 'staff', 'citizen'].map(role => (
                <button key={role} onClick={() => fillDemo(role)}
                  className="flex-1 text-xs py-1.5 px-2 bg-white border border-amber-200 rounded-lg text-amber-700 hover:bg-amber-50 capitalize font-medium transition-colors">
                  {role}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="alert-error mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-medium hover:text-primary-700">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
