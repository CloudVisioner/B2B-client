import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../apollo/store';
import { logInWithEmail, googleLogIn, normalizeRole, isValidRole } from '../libs/auth';

export default function LoginPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'provider'>('buyer');
  const [formData, setFormData] = useState({
    userNick: '',
    userPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      const expectedRole = normalizeRole(selectedRole);

      if (!tokenRole || !isValidRole(tokenRole)) {
        setError('Unable to determine your account role. Please try again.');
        setLoading(false);
        return;
      }

      if (tokenRole !== expectedRole) {
        const actualLabel = tokenRole === 'PROVIDER' ? 'Provider' : 'Buyer';
        setError(
          `This account is registered as a ${actualLabel}. Please select "${actualLabel}" above to log in, or use a different account.`
        );
        setLoading(false);
        return;
      }

      if (tokenRole === 'PROVIDER') {
        router.push('/provider/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      console.error('Login error:', err);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    
    try {
      // TODO: Implement Google OAuth flow
      // For now, show a message
      setError('Google login coming soon. Please use email/password.');
      // await googleLogIn(googleToken);
      // router.push('/');
    } catch (err: any) {
      setError(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">Log in to SME Connect</h1>
          <p className="login-subtitle">Choose your dashboard to continue</p>
        </div>

        <div className="role-selection">
          <button
            onClick={() => setSelectedRole('buyer')}
            className={`role-card ${selectedRole === 'buyer' ? 'role-card-active' : ''}`}
            type="button"
          >
            <div className={`role-icon ${selectedRole === 'buyer' ? 'role-icon-active' : ''}`}>
              <svg className="role-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="role-title">Login as Buyer</h3>
            <p className="role-description">Manage your requests and hire experts.</p>
          </button>

          <button
            onClick={() => setSelectedRole('provider')}
            className={`role-card ${selectedRole === 'provider' ? 'role-card-active' : ''}`}
            type="button"
          >
            <div className={`role-icon ${selectedRole === 'provider' ? 'role-icon-active' : ''}`}>
              <svg className="role-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="role-title">Login as Provider</h3>
            <p className="role-description">Browse jobs and manage your quotes.</p>
          </button>
        </div>

        <form action="#" className="login-form" method="POST" onSubmit={handleSubmit}>
          {error && (
            <div className="login-form-error" style={{ 
              padding: '12px', 
              marginBottom: '16px', 
              backgroundColor: '#fee', 
              color: '#c33', 
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="userNick">Username</label>
            <input
              className="form-input"
              id="userNick"
              name="userNick"
              value={formData.userNick}
              onChange={handleInputChange}
              placeholder="Enter your username"
              type="text"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label" htmlFor="userPassword">Password</label>
              <a className="form-link" href="#">
                Forgot password?
              </a>
            </div>
            <input
              className="form-input"
              id="userPassword"
              name="userPassword"
              value={formData.userPassword}
              onChange={handleInputChange}
              placeholder="Enter your password"
              type="password"
              required
              disabled={loading}
            />
          </div>

          <button
            className="btn-primary"
            type="submit"
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="form-divider">
            <div className="form-divider-line"></div>
            <div className="form-divider-text">
              <span>Or</span>
            </div>
          </div>

          <button
            className="btn-google"
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            <svg height="18" viewBox="0 0 18 18" width="18">
              <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"></path>
              <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"></path>
              <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"></path>
              <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"></path>
            </svg>
            Sign in with Google
          </button>
        </form>

        <div className="login-footer">
          <p className="login-footer-text">
            New to SME Connect?{' '}
            <Link href="/signup" className="login-footer-link">
              Sign up
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-slate-400 hover:text-slate-600 dark:text-slate-300 dark:hover:text-white text-sm transition-colors inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
