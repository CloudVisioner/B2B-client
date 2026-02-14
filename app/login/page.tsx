'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'provider'>('buyer');

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-[#F8FAFC]">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.03),0_10px_10px_-5px_rgba(0,0,0,0.02)] border border-slate-100 p-10 md:p-14">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">Log in to SME Connect</h1>
          <p className="text-slate-500 text-lg">Choose your dashboard to continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <button
            onClick={() => setSelectedRole('buyer')}
            className={`role-card group text-left p-6 border rounded-xl transition-all duration-200 focus:outline-none ${
              selectedRole === 'buyer'
                ? 'border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50/50'
                : 'border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/30'
            }`}
            type="button"
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors ${
              selectedRole === 'buyer'
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'
            }`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Login as Buyer</h3>
            <p className="text-base text-slate-500 leading-relaxed">Manage your requests and hire experts.</p>
          </button>

          <button
            onClick={() => setSelectedRole('provider')}
            className={`role-card group text-left p-6 border rounded-xl transition-all duration-200 focus:outline-none ${
              selectedRole === 'provider'
                ? 'border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50/50'
                : 'border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/30'
            }`}
            type="button"
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors ${
              selectedRole === 'provider'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white'
            }`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Login as Provider</h3>
            <p className="text-base text-slate-500 leading-relaxed">Browse jobs and manage your quotes.</p>
          </button>
        </div>

        <form action="#" className="space-y-7" method="POST" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1.5">
            <label className="text-base font-semibold text-slate-700" htmlFor="email">Email</label>
            <input
              className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-base transition-colors placeholder:text-slate-400 focus:ring-0 focus:border-indigo-600"
              id="email"
              name="email"
              placeholder="name@company.com"
              type="email"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-base font-semibold text-slate-700" htmlFor="password">Password</label>
              <a className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors" href="#">
                Forgot password?
              </a>
            </div>
            <input
              className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-base transition-colors placeholder:text-slate-400 focus:ring-0 focus:border-indigo-600"
              id="password"
              name="password"
              placeholder="Enter your password"
              type="password"
            />
          </div>

          <button
            className="w-full py-4 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-bold rounded-lg shadow-sm transition-all duration-200"
            type="submit"
          >
            Sign In
          </button>

          <div className="relative py-2">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-sm uppercase">
              <span className="bg-white px-3 text-slate-400 font-medium">Or</span>
            </div>
          </div>

          <button
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-base font-semibold rounded-lg shadow-sm transition-all duration-200"
            type="button"
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

        <div className="mt-12 text-center">
          <p className="text-base text-slate-500">
            New to SME Connect?{' '}
            <Link href="/signup" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors ml-1">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
