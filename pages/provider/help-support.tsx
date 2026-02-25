import React from 'react';
import Image from 'next/image';
import { ProviderSidebar } from '../../libs/components/dashboard/ProviderSidebar';
import { ProviderHeader } from '../../libs/components/dashboard/ProviderHeader';

export default function ProviderHelpSupportPage() {
  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-50 overflow-hidden antialiased" style={{ fontFamily: 'Inter, sans-serif' }}>
      <ProviderSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <ProviderHeader title="Help & Support" />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Header with Image */}
            <div className="relative bg-white rounded-3xl border border-slate-200/60 shadow-lg overflow-hidden">
              <div className="relative h-80 overflow-hidden">
                <Image
                  src="/images/helpme.webp"
                  alt="Help & Support"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center px-8">
                    <h1 className="text-5xl font-black text-white mb-4">Help & Support Center</h1>
                    <p className="text-xl font-semibold text-white/95 max-w-2xl mx-auto">
                      Find answers to frequently asked questions and get the help you need
                    </p>
                  </div>
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
              <a href="#quotes" className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">request_quote</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Quotes & Bidding</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Manage your quotes</p>
                  </div>
                </div>
              </a>
              <a href="#orders" className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">shopping_bag</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Orders & Projects</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Working on projects</p>
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
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">How do I create my provider profile?</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Go to Settings → Organization and fill in your organization details, including name, description, category, and services. This helps buyers find you when searching for providers.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">What information should I include in my profile?</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Include a clear description of your services, your expertise areas, portfolio examples, and any certifications. The more detailed your profile, the more likely buyers will choose you.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">How do I find jobs to bid on?</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Navigate to "Find Jobs" in the sidebar. You can filter by category, subcategory, budget, and urgency. Browse open service requests and submit quotes for projects that match your expertise.
                    </p>
                  </div>
                </div>
              </section>

              {/* Quotes & Bidding */}
              <section id="quotes" className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">request_quote</span>
                  Quotes & Bidding
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">How do I submit a quote?</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Click "Propose" on any open job listing. Fill in your quote amount, message explaining your approach, and valid until date. Make sure your quote is competitive and clearly explains why you're the best fit.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Can I edit or delete my quote?</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Yes! For PENDING quotes, you can edit or delete them. Go to "View Quotes" on the job, then use the "Edit Quote" or "Delete Quote" buttons. Once a quote is accepted or rejected, you cannot modify it.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">What happens after I submit a quote?</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      The buyer will review your quote along with others. If they accept your quote, you'll receive a notification and an order will be created. You can then start working on the project.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">How do I see all my quotes?</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Go to Dashboard → My Quotes to see all quotes you've submitted, their status (Pending, Accepted, Rejected), and manage them.
                    </p>
                  </div>
                </div>
              </section>

              {/* Orders & Projects */}
              <section id="orders" className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">shopping_bag</span>
                  Orders & Projects
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">What happens when my quote is accepted?</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      An order is automatically created. You'll see it in Dashboard → Active Orders. You can communicate with the buyer and start working on the project deliverables.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">How do I track my active projects?</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Go to Dashboard → Active Orders to see all your active projects, their status, deadlines, and communicate with buyers.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">What if I need to communicate with the buyer?</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Use the messaging system within each order to communicate with buyers. Keep all project-related discussions in one place for better organization.
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
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">How do I update my profile information?</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Go to Settings → Profile to update your personal information, or Settings → Organization to update your organization details.
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
                  <a 
                    href="tel:+1234567890" 
                    className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">phone</span>
                    Call Support
                  </a>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
