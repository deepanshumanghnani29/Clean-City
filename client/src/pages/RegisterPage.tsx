import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match.'); return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const pw = form.password;
    if (!pw) return null;
    if (pw.length < 6) return { label: 'Too short', color: 'text-red-500 bg-red-100' };
    if (pw.length < 8) return { label: 'Weak', color: 'text-orange-500 bg-orange-100' };
    if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) return { label: 'Strong', color: 'text-primary-600 bg-primary-100' };
    return { label: 'Moderate', color: 'text-amber-600 bg-amber-100' };
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-teal-500 rounded-xl flex items-center justify-center shadow">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-gray-900 text-xl">Clean <span className="text-primary-600">City</span></span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Join thousands of citizens making cities cleaner</p>
        </div>

        <div className="card shadow-elevated">
          {error && (
            <div className="alert-error mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input name="name" type="text" className="input" placeholder="Your full name"
                value={form.name} onChange={handleChange} required maxLength={100} />
            </div>

            <div>
              <label className="label">Email address</label>
              <input name="email" type="email" className="input" placeholder="you@example.com"
                value={form.email} onChange={handleChange} required />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input name="password" type={showPw ? 'text' : 'password'} className="input pr-10"
                  placeholder="Minimum 6 characters"
                  value={form.password} onChange={handleChange} required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {strength && (
                <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${strength.color}`}>
                  {strength.label}
                </span>
              )}
            </div>

            <div>
              <label className="label">Confirm Password</label>
              <input name="confirm" type={showPw ? 'text' : 'password'} className="input"
                placeholder="Repeat your password"
                value={form.confirm} onChange={handleChange} required />
              {form.confirm && form.password !== form.confirm && (
                <p className="error-text">Passwords don't match</p>
              )}
              {form.confirm && form.password === form.confirm && form.confirm.length >= 6 && (
                <p className="text-xs text-primary-600 flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Passwords match
                </p>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-4">
            By registering, all accounts are assigned the <strong>Citizen</strong> role. Role changes require admin approval.
          </p>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
