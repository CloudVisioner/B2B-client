import React from 'react';
import { Sidebar } from '../libs/components/dashboard/Sidebar';
import { Header } from '../libs/components/dashboard/Header';

export default function BuyerHelpSupportPage() {
  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-50 overflow-hidden antialiased" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title="Help & Support" />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Header (clean gradient, no external photo) */}
            <div className="relative bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 rounded-3xl border border-indigo-500/40 shadow-lg overflow-hidden">
              <div className="relative h-80 flex items-center justify-center">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_#ffffff40,_transparent_55%),radial-gradient(circle_at_bottom,_#0f172a80,_transparent_55%)]" />
                <div className="relative text-center px-8">
                  <h1 className="text-5xl font-black text-white mb-4">Help &amp; Support Center</h1>
                    <p className="text-xl font-semibold text-white/95 max-w-2xl mx-auto">
                      Find answers to frequently asked questions and get the help you need
                    </p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="#getting-started" className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">rocket_launch</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Getting Started</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">New to the platform?</p>
                  </div>
                </div>
              </a>
              <a href="#service-requests" className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">description</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Service Requests</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Post and manage requests</p>
                  </div>
                </div>
              </a>
              <a href="#quotes" className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">request_quote</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Quotes & Orders</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Review and accept quotes</p>
                  </div>
                </div>
              </a>
            </div>

            {/* FAQ Sections */}
            <div className="space-y-6">
              {/* Getting Started */}
              <section id="getting-started" className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">rocket_launch</span>
                  Getting Started
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">How do I create a service request?</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Click "Post a Job" in the sidebar or dashboard. Fill in the details about your project including title, description, category, budget, deadline, and required skills. Once published, providers can submit quotes.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">What information should I include in my request?</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Be as detailed as possible. Include project scope, deliverables, timeline, budget range, and any specific requirements. The more information you provide, the better quotes you'll receive.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">How do I find providers?</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      When you post a service request, qualified providers will find it and submit quotes. You can also browse the marketplace to discover providers and their portfolios.
                    </p>
                  </div>
                </div>
              </section>

              {/* Service Requests */}
              <section id="service-requests" className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">description</span>
                  Service Requests
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">How do I edit or delete my service request?</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Go to "My Service Requests" and click "View Details" on any request. For DRAFT or OPEN requests, you can edit them. Once a request has accepted quotes or orders, editing may be limited.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">What's the difference between DRAFT and OPEN status?</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      DRAFT requests are saved but not visible to providers. OPEN requests are published and providers can submit quotes. You can publish a draft when you're ready.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">How do I view quotes for my request?</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Go to "My Service Requests" and click "View Quotes" on any OPEN request. You'll see all quotes submitted by providers, including amounts, messages, and provider information.
                    </p>
                  </div>
                </div>
              </section>

              {/* Quotes & Orders */}
              <section id="quotes" className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">request_quote</span>
                  Quotes & Orders
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">How do I accept or reject a quote?</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      In "View Quotes", review all submitted quotes. Click "Accept" on the quote you want to proceed with, or "Reject" on quotes you don't want. Once accepted, an order is created automatically.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">What happens after I accept a quote?</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      An order is created and the provider is notified. You can then communicate with the provider, track project progress, and manage deliverables through the order dashboard.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Can I accept multiple quotes?</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      No, you can only accept one quote per service request. Once you accept a quote, other quotes are automatically rejected and the request status changes.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">How do I track my orders?</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Go to Dashboard → Active Orders to see all your active projects, their status, deadlines, and communicate with providers.
                    </p>
                  </div>
                </div>
              </section>

              {/* Account & Settings */}
              <section id="account" className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">settings</span>
                  Account & Settings
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">How do I update my organization information?</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Go to Settings → Organization to update your organization details, including name, industry, location, and description.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">How do I change my password?</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Navigate to Settings → Security to change your password. Make sure to use a strong, unique password.
                    </p>
                  </div>
                </div>
              </section>

              {/* Contact Support */}
              <section className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-xl border border-indigo-200 dark:border-indigo-800 p-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">support_agent</span>
                  Still Need Help?
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  If you couldn't find the answer you're looking for, our support team is here to help.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="mailto:support@smeconnect.com" 
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">email</span>
                    Email Support
                  </a>
                  <button 
                    type="button"
                    className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 cursor-default"
                  >
                    <span className="material-symbols-outlined text-sm">phone</span>
                    Call Support
                  </button>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
