'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'provider'>(
    roleParam === 'provider' ? 'provider' : 'buyer'
  );

  useEffect(() => {
    if (roleParam === 'provider') {
      setSelectedRole('provider');
    } else if (roleParam === 'buyer') {
      setSelectedRole('buyer');
    }
  }, [roleParam]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight text-indigo-600">
            SME<span className="text-slate-900">Connect</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-base text-slate-500 hidden sm:inline">Already have an account?</span>
            <Link href="/login" className="text-base font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
              Log in
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[#F9FAFB]" style={{
          backgroundImage: 'radial-gradient(#4f46e5 0.5px, transparent 0.5px), radial-gradient(#4f46e5 0.5px, #f9fafb 0.5px)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 10px 10px',
          opacity: 0.05
        }}></div>
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl"></div>

        <div className="max-w-2xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Join SME Connect</h1>
            <p className="text-slate-500 text-lg">Choose how you want to use the platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <label className="relative group cursor-pointer">
              <input
                checked={selectedRole === 'buyer'}
                onChange={() => setSelectedRole('buyer')}
                className="peer sr-only"
                name="role"
                type="radio"
                value="buyer"
              />
              <div className={`h-full p-8 bg-white border-2 rounded-xl transition-all flex flex-col items-center text-center shadow-sm group-hover:shadow-md ${
                selectedRole === 'buyer'
                  ? 'border-indigo-600 ring-4 ring-indigo-600/5'
                  : 'border-slate-100 hover:border-indigo-600/50'
              }`}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                  selectedRole === 'buyer'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'bg-slate-50 text-slate-400 group-hover:text-indigo-600'
                }`}>
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">I am a Buyer</h3>
                <p className="text-slate-500 text-base leading-relaxed">I want to hire expert service providers for my business.</p>
                <div className={`mt-6 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedRole === 'buyer'
                    ? 'border-indigo-600 bg-indigo-600'
                    : 'border-slate-200'
                }`}>
                  {selectedRole === 'buyer' && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
            </label>

            <label className="relative group cursor-pointer">
              <input
                checked={selectedRole === 'provider'}
                onChange={() => setSelectedRole('provider')}
                className="peer sr-only"
                name="role"
                type="radio"
                value="provider"
              />
              <div className={`h-full p-8 bg-white border-2 rounded-xl transition-all flex flex-col items-center text-center shadow-sm group-hover:shadow-md ${
                selectedRole === 'provider'
                  ? 'border-indigo-600 ring-4 ring-indigo-600/5'
                  : 'border-slate-100 hover:border-indigo-600/50'
              }`}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                  selectedRole === 'provider'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'bg-slate-50 text-slate-400 group-hover:text-indigo-600'
                }`}>
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">I am a Provider</h3>
                <p className="text-slate-500 text-base leading-relaxed">I want to find projects and offer my professional services.</p>
                <div className={`mt-6 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedRole === 'provider'
                    ? 'border-indigo-600 bg-indigo-600'
                    : 'border-slate-200'
                }`}>
                  {selectedRole === 'provider' && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
            </label>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <form action="#" className="space-y-6" method="POST" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-base font-semibold text-slate-700 mb-2" htmlFor="full-name">
                  Full Name
                </label>
                <input
                  className="block w-full px-4 py-3.5 rounded-lg border border-slate-200 text-slate-900 text-base placeholder-slate-400 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all"
                  id="full-name"
                  name="full-name"
                  placeholder="John Doe"
                  required
                  type="text"
                />
              </div>

              <div>
                <label className="block text-base font-semibold text-slate-700 mb-2" htmlFor="email">
                  Work Email
                </label>
                <input
                  className="block w-full px-4 py-3.5 rounded-lg border border-slate-200 text-slate-900 text-base placeholder-slate-400 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all"
                  id="email"
                  name="email"
                  placeholder="john@company.com"
                  required
                  type="email"
                />
              </div>

              <div>
                <label className="block text-base font-semibold text-slate-700 mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  className="block w-full px-4 py-3.5 rounded-lg border border-slate-200 text-slate-900 text-base placeholder-slate-400 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type="password"
                />
                <p className="mt-2 text-sm text-slate-400">Must be at least 8 characters with one number.</p>
              </div>

              <div className="pt-2">
                <button
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-lg shadow-lg shadow-indigo-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  type="submit"
                >
                  Create Account
                </button>
              </div>

              <p className="text-center text-sm text-slate-400 mt-6 leading-relaxed">
                By signing up, you agree to our{' '}
                <a className="text-indigo-600 hover:underline" href="#">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a className="text-indigo-600 hover:underline" href="#">
                  Privacy Policy
                </a>
                .
              </p>
            </form>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="inline-flex items-center text-base font-medium text-slate-500 hover:text-slate-800 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to homepage
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-8 px-6 text-center border-t border-slate-100">
        <p className="text-slate-400 text-sm">© 2024 SME Connect Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
