import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { signUpNew } from '../libs/auth';

export default function SignupPage() {
  const router = useRouter();
  const roleParam = router.query.role as string;
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'provider'>('buyer');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (roleParam === 'provider') {
      setSelectedRole('provider');
    } else if (roleParam === 'buyer') {
      setSelectedRole('buyer');
    }
  }, [roleParam]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.fullName || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Note: Backend may have different password requirements
    // Remove this validation if backend allows shorter passwords
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await signUpNew({
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        memberType: selectedRole,
      });

      // Redirect to home page after successful signup
      router.push('/');
    } catch (err: any) {
      // Display detailed error message
      const errorMessage = err?.message || 'Signup failed. Please try again.';
      setError(errorMessage);
      console.error('Signup error:', {
        message: err?.message,
        graphQLErrors: err?.graphQLErrors,
        networkError: err?.networkError,
        fullError: err,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <header className="signup-header">
        <div className="signup-header-container">
          <Link href="/" className="signup-logo">
            SME<span className="signup-logo-text">Connect</span>
          </Link>
          <div className="signup-header-actions">
            <span className="signup-header-text">Already have an account?</span>
            <Link href="/login" className="signup-header-link">
              Log in
            </Link>
          </div>
        </div>
      </header>

      <main className="signup-main">
        <div className="signup-background"></div>
        <div className="signup-content">
          <div className="signup-title-section">
            <h1 className="signup-title">Join SME Connect</h1>
            <p className="signup-subtitle">Choose how you want to use the platform</p>
          </div>

          <div className="signup-role-selection">
            <label className="signup-role-label">
              <input
                checked={selectedRole === 'buyer'}
                onChange={() => setSelectedRole('buyer')}
                className="signup-role-input"
                name="role"
                type="radio"
                value="buyer"
              />
              <div className={`signup-role-card ${selectedRole === 'buyer' ? 'signup-role-card-active' : ''}`}>
                <div className={`signup-role-icon ${selectedRole === 'buyer' ? 'signup-role-icon-active' : ''}`}>
                  <svg className="signup-role-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="signup-role-title">I am a Buyer</h3>
                <p className="signup-role-description">I want to hire expert service providers for my business.</p>
                <div className={`signup-role-radio ${selectedRole === 'buyer' ? 'signup-role-radio-active' : ''}`}>
                  {selectedRole === 'buyer' && (
                    <div className="signup-role-radio-dot"></div>
                  )}
                </div>
              </div>
            </label>

            <label className="signup-role-label">
              <input
                checked={selectedRole === 'provider'}
                onChange={() => setSelectedRole('provider')}
                className="signup-role-input"
                name="role"
                type="radio"
                value="provider"
              />
              <div className={`signup-role-card ${selectedRole === 'provider' ? 'signup-role-card-active' : ''}`}>
                <div className={`signup-role-icon ${selectedRole === 'provider' ? 'signup-role-icon-active' : ''}`}>
                  <svg className="signup-role-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="signup-role-title">I am a Provider</h3>
                <p className="signup-role-description">I want to find projects and offer my professional services.</p>
                <div className={`signup-role-radio ${selectedRole === 'provider' ? 'signup-role-radio-active' : ''}`}>
                  {selectedRole === 'provider' && (
                    <div className="signup-role-radio-dot"></div>
                  )}
                </div>
              </div>
            </label>
          </div>

          <div className="signup-form-container">
            <form action="#" className="signup-form" method="POST" onSubmit={handleSubmit}>
              {error && (
                <div className="signup-form-error" style={{ 
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

              <div className="signup-form-group">
                <label className="signup-form-label" htmlFor="fullName">
                  Full Name
                </label>
                <input
                  className="signup-form-input"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                  type="text"
                  disabled={loading}
                />
              </div>

              <div className="signup-form-group">
                <label className="signup-form-label" htmlFor="email">
                  Work Email
                </label>
                <input
                  className="signup-form-input"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@company.com"
                  required
                  type="email"
                  disabled={loading}
                />
              </div>

              <div className="signup-form-group">
                <label className="signup-form-label" htmlFor="password">
                  Password
                </label>
                <input
                  className="signup-form-input"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  type="password"
                  disabled={loading}
                />
                <p className="signup-form-hint">Must be at least 8 characters with one number.</p>
              </div>

              <div className="signup-form-submit">
                <button
                  className="signup-form-button"
                  type="submit"
                  disabled={loading}
                  style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>

              <p className="signup-form-footer">
                By signing up, you agree to our{' '}
                <a className="signup-form-link" href="#">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a className="signup-form-link" href="#">
                  Privacy Policy
                </a>
                .
              </p>
            </form>
          </div>

          <div className="signup-back-link">
            <Link href="/" className="signup-back-link-text">
              <svg className="signup-back-link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to homepage
            </Link>
          </div>
        </div>
      </main>

      <footer className="signup-page-footer">
        <p className="signup-page-footer-text">© 2024 SME Connect Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
