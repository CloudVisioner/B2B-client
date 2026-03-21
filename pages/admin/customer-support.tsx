import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar, useQuery, useMutation } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { isLoggedIn, normalizeRole } from '../../libs/auth';
import { AdminSidebar } from '../../libs/components/admin/AdminSidebar';
import { AdminHeader } from '../../libs/components/admin/AdminHeader';
import { GET_CS_CENTER_CONTENT } from '../../apollo/admin/query';
import { CREATE_CS_FAQ, UPDATE_CS_FAQ, DELETE_CS_FAQ } from '../../apollo/admin/mutation';
import { NotificationToast } from '../../libs/components/NotificationToast';

interface FAQ {
  _id?: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export default function AdminCustomerSupportPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);

  // FAQs State
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [faqForm, setFaqForm] = useState<FAQ>({ question: '', answer: '', category: 'general', order: 0 });
  const [toast, setToast] = useState({ isOpen: false, type: 'info' as 'success' | 'error' | 'warning' | 'info', title: '', message: '' });

  const { data: csData, loading: csLoading, refetch: refetchCS } = useQuery(GET_CS_CENTER_CONTENT, {
    skip: !mounted || !isLoggedIn(),
    fetchPolicy: 'network-only',
  });

  const [createFAQ, { loading: creatingFAQ }] = useMutation(CREATE_CS_FAQ);
  const [updateFAQ, { loading: updatingFAQ }] = useMutation(UPDATE_CS_FAQ);
  const [deleteFAQ] = useMutation(DELETE_CS_FAQ);

  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn()) {
      router.push('/admin/login');
      return;
    }
    const role = normalizeRole(currentUser?.userRole);
    if (role && role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [router, currentUser]);

  useEffect(() => {
    if (csData?.getCSCenterContent) {
      const content = csData.getCSCenterContent;
      if (content.faqs) {
        setFaqs(content.faqs.sort((a: FAQ, b: FAQ) => (a.order || 0) - (b.order || 0)));
      }
    }
  }, [csData]);

  const showToast = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    setToast({ isOpen: true, type, title, message });
  };

  const handleSaveFAQ = async () => {
    if (!faqForm.question.trim() || !faqForm.answer.trim()) {
      showToast('warning', 'Validation Error', 'Please fill in both question and answer');
      return;
    }

    try {
      if (editingFaq?._id) {
        await updateFAQ({
          variables: {
            input: {
              faqId: editingFaq._id,
              question: faqForm.question,
              answer: faqForm.answer,
              category: faqForm.category,
              order: faqForm.order,
            },
          },
        });
        showToast('success', 'Success', 'FAQ updated successfully');
      } else {
        await createFAQ({
          variables: {
            input: {
              question: faqForm.question,
              answer: faqForm.answer,
              category: faqForm.category,
              order: faqForm.order || faqs.length,
            },
          },
        });
        showToast('success', 'Success', 'FAQ created successfully');
      }
      setEditingFaq(null);
      setFaqForm({ question: '', answer: '', category: 'general', order: 0 });
      await refetchCS();
    } catch (error: any) {
      showToast('error', 'Error', error.message || 'Failed to save FAQ');
    }
  };

  const handleDeleteFAQ = async (faqId: string) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      await deleteFAQ({
        variables: { faqId },
      });
      showToast('success', 'Success', 'FAQ deleted successfully');
      await refetchCS();
    } catch (error: any) {
      showToast('error', 'Error', error.message || 'Failed to delete FAQ');
    }
  };

  if (!mounted || !isLoggedIn()) {
    return (
      <div className="flex h-screen w-full bg-[#F9FAFB] overflow-hidden">
        <div className="w-64 flex-shrink-0 h-full border-r border-slate-200 bg-white"></div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="h-16 bg-white border-b"></div>
          <main className="flex-1 overflow-y-auto"></main>
        </div>
      </div>
    );
  }

  const role = normalizeRole(currentUser?.userRole);
  if (role && role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="flex h-screen w-full bg-[#F9FAFB] overflow-hidden antialiased" style={{ fontFamily: 'Inter, sans-serif' }}>
      <AdminSidebar />
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <AdminHeader title="Customer Support Center" subtitle="Manage FAQs" />
        <main className="flex-1 overflow-y-auto bg-[#F9FAFB]">
          <div className="max-w-7xl mx-auto px-8 py-10">
            <div className="space-y-6">
              {/* FAQ Form */}
              <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                <h3 className="text-2xl font-black text-slate-900 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {editingFaq ? 'Edit FAQ' : 'Create New FAQ'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Question</label>
                    <input
                      type="text"
                      value={faqForm.question}
                      onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                      placeholder="How do I create a service request?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Answer</label>
                    <textarea
                      value={faqForm.answer}
                      onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                      placeholder="Navigate to your dashboard and click 'Post a Job'..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                      <select
                        value={faqForm.category}
                        onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                      >
                        <option value="general">General</option>
                        <option value="getting-started">Getting Started</option>
                        <option value="service-requests">Service Requests</option>
                        <option value="quotes">Quotes & Orders</option>
                        <option value="payments">Payments</option>
                        <option value="account">Account</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Order</label>
                      <input
                        type="number"
                        value={faqForm.order}
                        onChange={(e) => setFaqForm({ ...faqForm, order: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveFAQ}
                      disabled={creatingFAQ || updatingFAQ}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      {creatingFAQ || updatingFAQ ? 'Saving...' : editingFaq ? 'Update FAQ' : 'Create FAQ'}
                    </button>
                    {editingFaq && (
                      <button
                        onClick={() => {
                          setEditingFaq(null);
                          setFaqForm({ question: '', answer: '', category: 'general', order: 0 });
                        }}
                        className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* FAQs List */}
              <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                <h3 className="text-2xl font-black text-slate-900 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Existing FAQs ({faqs.length})
                </h3>
                <div className="space-y-4">
                  {csLoading ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  ) : faqs.length === 0 ? (
                    <p className="text-slate-500 text-center py-8 font-medium">No FAQs yet. Create your first FAQ above.</p>
                  ) : (
                    faqs.map((faq) => (
                      <div key={faq._id} className="border border-slate-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="text-lg font-black text-slate-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                              {faq.question}
                            </h4>
                            <p className="text-slate-600 font-medium leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                              {faq.answer}
                            </p>
                            <div className="flex items-center gap-4 mt-3">
                              <span className="text-xs font-bold text-slate-400 uppercase">{faq.category}</span>
                              <span className="text-xs font-bold text-slate-400">Order: {faq.order}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => {
                                setEditingFaq(faq);
                                setFaqForm({ question: faq.question, answer: faq.answer, category: faq.category, order: faq.order || 0 });
                              }}
                              className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-bold hover:bg-indigo-100 transition-colors text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => faq._id && handleDeleteFAQ(faq._id)}
                              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition-colors text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Toast Notification */}
      <NotificationToast
        isOpen={toast.isOpen}
        onClose={() => setToast({ ...toast, isOpen: false })}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        duration={5000}
      />
    </div>
  );
}
