import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { logInWithEmail, normalizeRole, isLoggedIn } from '../../libs/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [formData, setFormData] = useState({
    userNick: '',
    userPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect if already logged in as admin
    if (isLoggedIn() && currentUser) {
      const role = normalizeRole(currentUser?.userRole);
      if (role === 'ADMIN') {
        router.push('/admin');
      }
    }
  }, [currentUser, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.userNick || !formData.userPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      await logInWithEmail(formData.userNick, formData.userPassword);

      await new Promise(resolve => setTimeout(resolve, 200));

      const actualUser = userVar();
      const tokenRole = normalizeRole(actualUser?.userRole);

      if (tokenRole !== 'ADMIN') {
        setError('Access denied. This account is not an administrator.');
        setLoading(false);
        return;
      }

      router.push('/admin');
    } catch (err: any) {
      const errorMessage = err?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      console.error('Admin login error:', err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/20 mb-4">
            <span className="material-symbols-outlined text-white text-3xl">admin_panel_settings</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Portal</h1>
          <p className="text-slate-600">Sign in to access the admin dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-red-500">error</span>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="userNick" className="block text-sm font-semibold text-slate-700 mb-2">
                Username or Email
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">
                  person
                </span>
                <input
                  id="userNick"
                  name="userNick"
                  type="text"
                  value={formData.userNick}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                  placeholder="Enter your username or email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="userPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">
                  lock
                </span>
                <input
                  id="userPassword"
                  name="userPassword"
                  type="password"
                  value={formData.userPassword}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/50 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">sync</span>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">login</span>
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center font-medium">
              Secure admin access only. Unauthorized access is prohibited.
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-slate-600 hover:text-slate-900 text-sm transition-colors inline-flex items-center gap-2 font-medium"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back to Home</span>
          </a>
        </div>
      </div>
    </div>
  );
}
