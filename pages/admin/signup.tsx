import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { adminSignUp, normalizeRole, isValidRole, isLoggedIn, isAdminPortalRole } from '../../libs/auth';

export default function AdminSignupPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [formData, setFormData] = useState({
    userNick: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [adminExists, setAdminExists] = useState(false);

  useEffect(() => {
    // Check if admin already exists (you might want to add an API call here)
    // For now, we'll allow signup but backend should enforce single admin
    if (isLoggedIn() && currentUser) {
      if (isAdminPortalRole(currentUser?.userRole)) {
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

    // Validation
    if (!formData.userNick || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await adminSignUp({
        userNick: formData.userNick?.trim() || '',
        email: formData.email?.trim().toLowerCase() || '',
        password: formData.password,
      });

      await new Promise(resolve => setTimeout(resolve, 200));

      const actualUser = userVar();
      const userRole = normalizeRole(actualUser?.userRole);

      if (!userRole || !isValidRole(userRole)) {
        setError('Account created but unable to determine role. Please contact support.');
        setLoading(false);
        return;
      }

      // If admin role is set, redirect to admin dashboard
      if (isAdminPortalRole(userRole)) {
        setLoading(false);
        router.push('/admin');
      } else {
        setError('Admin account creation requires special permissions. Please contact system administrator.');
        setLoading(false);
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Signup failed. Please try again.';
      setError(errorMessage);
      console.error('Admin signup error:', err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/50 mb-4">
            <span className="material-symbols-outlined text-white text-3xl">admin_panel_settings</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Admin Account</h1>
          <p className="text-slate-300">Set up the administrator account</p>
        </div>

        {/* Signup Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-red-400">error</span>
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            {adminExists && (
              <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-amber-400">warning</span>
                <p className="text-amber-200 text-sm">An admin account already exists. Only one admin is allowed.</p>
              </div>
            )}

            <div>
              <label htmlFor="userNick" className="block text-sm font-semibold text-slate-200 mb-2">
                Username
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
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Choose a username"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-200 mb-2">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">
                  email
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-200 mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">
                  lock
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Create a password (min. 8 characters)"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-200 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">
                  lock
                </span>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Confirm your password"
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
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">person_add</span>
                  <span>Create Admin Account</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-slate-400 text-center mb-4">
              Already have an admin account?
            </p>
            <Link
              href="/admin/login"
              className="block w-full rounded-lg py-2 text-center text-sm font-semibold text-indigo-300 transition-colors hover:bg-white/5 hover:text-indigo-200"
            >
              Sign in instead
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-white"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
