import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import Navbar from '../libs/components/Navbar';
import Footer from '../libs/components/Footer';
import { GET_CS_CENTER_CONTENT } from '../apollo/admin/query';

export default function CustomerSupportPage() {
  const [mounted, setMounted] = useState(false);

  const { data: csData, loading: csLoading } = useQuery(GET_CS_CENTER_CONTENT, {
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const csContent = csData?.getCSCenterContent;
  
  // Default values if backend data is not available
  const contactMethods = csContent?.contactMethods || [
    { type: 'email', label: 'Email', value: 'support@smeconnect.com', availability: 'Response within 24 hours', icon: 'email' },
    { type: 'phone', label: 'Phone', value: '+1 (555) 123-4567', availability: 'Mon-Fri, 9AM-6PM EST', icon: 'phone' },
    { type: 'chat', label: 'Live Chat', value: '', availability: 'Available 24/7', icon: 'chat' },
    { type: 'schedule', label: 'Schedule Call', value: '', availability: 'Personal consultation', icon: 'schedule' },
  ];
  const faqs = csContent?.faqs || [
    { question: 'How do I create a service request?', answer: 'Navigate to your dashboard and click "Post a Job". Fill in all required details including project description, budget, deadline, and required skills. Once published, providers can submit quotes.', category: 'general', order: 0 },
    { question: 'How do I accept a quote?', answer: 'Go to "My Service Requests" and click "View Quotes" on any open request. Review all submitted quotes and click "Accept" on your preferred quote. An order will be created automatically.', category: 'general', order: 1 },
    { question: 'What payment methods are accepted?', answer: 'We accept all major credit cards, bank transfers, and digital payment methods. Payments are securely processed through our platform with full transaction protection.', category: 'payments', order: 0 },
    { question: 'How do I contact a provider?', answer: 'Once you accept a quote, you can communicate directly with the provider through the order dashboard. All messages are logged and secure.', category: 'general', order: 2 },
    { question: 'Can I cancel an order?', answer: 'Orders can be cancelled within 24 hours of acceptance without penalty. After that, cancellation terms depend on the project status and provider agreement.', category: 'quotes', order: 0 },
    { question: 'How do I track my project progress?', answer: 'Visit the "Orders" section in your dashboard. You\'ll see real-time updates, milestones, deliverables, and can communicate with your provider throughout the project.', category: 'quotes', order: 1 },
  ];

  return (
    <div className="app-container relative min-h-screen" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Navbar currentPage="home" />
      
      <main className="main-content relative z-10">
        {/* Animation Section */}
        <section className="relative w-full min-h-[500px] overflow-hidden bg-slate-900">
          <div className="w-full h-full flex items-center justify-center">
            {csLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <video
                className="w-full h-full object-contain"
                src="/animations/customer_support.mov"
                autoPlay
                loop
                muted
                playsInline
              />
            )}
          </div>
        </section>

        {/* Simple Table Layout */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Contact Methods Table */}
            <div className="mb-16">
              <h2 className="text-3xl font-black text-slate-900 mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
                Contact Methods
              </h2>
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-900 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Method
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-900 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Contact
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-900 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Availability
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {contactMethods.map((method, index) => (
                      <tr key={index} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-slate-600">{method.icon}</span>
                            <span className="text-sm font-bold text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                              {method.label}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-slate-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {method.value || 'Coming Soon'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-slate-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {method.availability}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* FAQs Table */}
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
                Frequently Asked Questions
              </h2>
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-900 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Question
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-900 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Answer
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-900 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Category
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {faqs.sort((a, b) => (a.order || 0) - (b.order || 0)).map((faq, index) => (
                      <tr key={index} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {faq.question}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-slate-700 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {faq.answer}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {faq.category}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
