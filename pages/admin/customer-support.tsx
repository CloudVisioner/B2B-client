import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar, useQuery, useMutation } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { isLoggedIn, normalizeRole } from '../../libs/auth';
import { AdminSidebar } from '../../libs/components/admin/AdminSidebar';
import { AdminHeader } from '../../libs/components/admin/AdminHeader';
import { GET_CS_CENTER_CONTENT } from '../../apollo/admin/query';
import { UPDATE_CS_CENTER_CONTENT, CREATE_CS_FAQ, UPDATE_CS_FAQ, DELETE_CS_FAQ } from '../../apollo/admin/mutation';
import { UPLOAD_PROFILE_IMAGE } from '../../apollo/user/mutation';
import { getImageUrl } from '../../libs/utils';

interface QuickAccessCard {
  title: string;
  description: string;
  icon: string;
  link: string;
  color: string;
}

interface ContactMethod {
  type: string;
  label: string;
  value: string;
  availability: string;
  icon: string;
}

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
  const [activeTab, setActiveTab] = useState<'hero' | 'cards' | 'contact' | 'faqs'>('hero');
  
  // Hero Section State
  const [heroTitle, setHeroTitle] = useState('');
  const [heroDescription, setHeroDescription] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [isUploadingHeroImage, setIsUploadingHeroImage] = useState(false);

  // Quick Access Cards State
  const [quickAccessCards, setQuickAccessCards] = useState<QuickAccessCard[]>([
    { title: '', description: '', icon: 'support_agent', link: '', color: 'indigo' },
    { title: '', description: '', icon: 'article', link: '', color: 'emerald' },
    { title: '', description: '', icon: 'forum', link: '', color: 'amber' },
  ]);

  // Contact Methods State
  const [contactMethods, setContactMethods] = useState<ContactMethod[]>([
    { type: 'email', label: 'Email', value: '', availability: 'Response within 24 hours', icon: 'email' },
    { type: 'phone', label: 'Phone', value: '', availability: 'Mon-Fri, 9AM-6PM EST', icon: 'phone' },
    { type: 'chat', label: 'Live Chat', value: '', availability: 'Available 24/7', icon: 'chat' },
    { type: 'schedule', label: 'Schedule Call', value: '', availability: 'Personal consultation', icon: 'schedule' },
  ]);

  // FAQs State
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [faqForm, setFaqForm] = useState<FAQ>({ question: '', answer: '', category: 'general', order: 0 });

  const { data: csData, loading: csLoading, refetch: refetchCS } = useQuery(GET_CS_CENTER_CONTENT, {
    skip: !mounted || !isLoggedIn(),
    fetchPolicy: 'network-only',
  });

  const [updateCSContent, { loading: updatingCS }] = useMutation(UPDATE_CS_CENTER_CONTENT);
  const [createFAQ, { loading: creatingFAQ }] = useMutation(CREATE_CS_FAQ);
  const [updateFAQ, { loading: updatingFAQ }] = useMutation(UPDATE_CS_FAQ);
  const [deleteFAQ] = useMutation(DELETE_CS_FAQ);
  const [uploadImage] = useMutation(UPLOAD_PROFILE_IMAGE);

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
      setHeroTitle(content.heroTitle || '');
      setHeroDescription(content.heroDescription || '');
      setHeroImage(content.heroImage || '');
      if (content.quickAccessCards) setQuickAccessCards(content.quickAccessCards);
      if (content.contactMethods) setContactMethods(content.contactMethods);
      if (content.faqs) setFaqs(content.faqs.sort((a: FAQ, b: FAQ) => (a.order || 0) - (b.order || 0)));
    }
  }, [csData]);

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingHeroImage(true);
    try {
      const result = await uploadImage({
        variables: {
          file,
          target: 'cs-center',
        },
      });
      if (result.data?.imageUploader) {
        setHeroImage(result.data.imageUploader);
      }
    } catch (error: any) {
      alert(`Image upload failed: ${error.message}`);
    } finally {
      setIsUploadingHeroImage(false);
    }
  };

  const handleSaveHero = async () => {
    try {
      await updateCSContent({
        variables: {
          input: {
            heroTitle,
            heroDescription,
            heroImage: heroImage || undefined,
          },
        },
      });
      alert('Hero section updated successfully');
      await refetchCS();
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to update hero section'}`);
    }
  };

  const handleSaveCards = async () => {
    try {
      await updateCSContent({
        variables: {
          input: {
            quickAccessCards,
          },
        },
      });
      alert('Quick access cards updated successfully');
      await refetchCS();
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to update cards'}`);
    }
  };

  const handleSaveContact = async () => {
    try {
      await updateCSContent({
        variables: {
          input: {
            contactMethods,
          },
        },
      });
      alert('Contact methods updated successfully');
      await refetchCS();
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to update contact methods'}`);
    }
  };

  const handleSaveFAQ = async () => {
    if (!faqForm.question.trim() || !faqForm.answer.trim()) {
      alert('Please fill in both question and answer');
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
        alert('FAQ updated successfully');
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
        alert('FAQ created successfully');
      }
      setEditingFaq(null);
      setFaqForm({ question: '', answer: '', category: 'general', order: 0 });
      await refetchCS();
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to save FAQ'}`);
    }
  };

  const handleDeleteFAQ = async (faqId: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      await deleteFAQ({
        variables: { faqId },
      });
      alert('FAQ deleted successfully');
      await refetchCS();
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to delete FAQ'}`);
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
        <AdminHeader title="Customer Support Center" subtitle="Manage CS center content and FAQs" />
        <main className="flex-1 overflow-y-auto bg-[#F9FAFB]">
          <div className="max-w-7xl mx-auto px-8 py-10">
            {/* Tabs */}
            <div className="mb-8 border-b border-slate-200">
              <div className="flex gap-4">
                {[
                  { id: 'hero', label: 'Hero Section' },
                  { id: 'cards', label: 'Quick Access Cards' },
                  { id: 'contact', label: 'Contact Methods' },
                  { id: 'faqs', label: 'FAQs' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hero Section Tab */}
            {activeTab === 'hero' && (
              <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                <h3 className="text-2xl font-black text-slate-900 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Hero Section
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Hero Title</label>
                    <input
                      type="text"
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium"
                      placeholder="Customer Support Center"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Hero Description</label>
                    <textarea
                      value={heroDescription}
                      onChange={(e) => setHeroDescription(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium"
                      placeholder="Your dedicated support team is here to help..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Hero Image</label>
                    <div className="flex items-center gap-4">
                      {heroImage && (
                        <img src={getImageUrl(heroImage)} alt="Hero" className="w-32 h-32 object-cover rounded-lg border border-slate-200" />
                      )}
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleHeroImageUpload}
                          disabled={isUploadingHeroImage}
                          className="hidden"
                          id="hero-image-upload"
                        />
                        <label
                          htmlFor="hero-image-upload"
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold cursor-pointer hover:bg-indigo-700 transition-colors inline-block"
                        >
                          {isUploadingHeroImage ? 'Uploading...' : heroImage ? 'Change Image' : 'Upload Image'}
                        </label>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 font-medium">Recommended: Use /images/service_reqs.webp</p>
                  </div>
                  <button
                    onClick={handleSaveHero}
                    disabled={updatingCS}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {updatingCS ? 'Saving...' : 'Save Hero Section'}
                  </button>
                </div>
              </div>
            )}

            {/* Quick Access Cards Tab */}
            {activeTab === 'cards' && (
              <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                <h3 className="text-2xl font-black text-slate-900 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Quick Access Cards
                </h3>
                <div className="space-y-6">
                  {quickAccessCards.map((card, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-6">
                      <h4 className="text-lg font-black text-slate-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Card {index + 1}
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                          <input
                            type="text"
                            value={card.title}
                            onChange={(e) => {
                              const newCards = [...quickAccessCards];
                              newCards[index].title = e.target.value;
                              setQuickAccessCards(newCards);
                            }}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Icon (Material Symbol)</label>
                          <input
                            type="text"
                            value={card.icon}
                            onChange={(e) => {
                              const newCards = [...quickAccessCards];
                              newCards[index].icon = e.target.value;
                              setQuickAccessCards(newCards);
                            }}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                            placeholder="support_agent"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                          <textarea
                            value={card.description}
                            onChange={(e) => {
                              const newCards = [...quickAccessCards];
                              newCards[index].description = e.target.value;
                              setQuickAccessCards(newCards);
                            }}
                            rows={2}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Link</label>
                          <input
                            type="text"
                            value={card.link}
                            onChange={(e) => {
                              const newCards = [...quickAccessCards];
                              newCards[index].link = e.target.value;
                              setQuickAccessCards(newCards);
                            }}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Color</label>
                          <select
                            value={card.color}
                            onChange={(e) => {
                              const newCards = [...quickAccessCards];
                              newCards[index].color = e.target.value;
                              setQuickAccessCards(newCards);
                            }}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                          >
                            <option value="indigo">Indigo</option>
                            <option value="emerald">Emerald</option>
                            <option value="amber">Amber</option>
                            <option value="purple">Purple</option>
                            <option value="blue">Blue</option>
                            <option value="red">Red</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={handleSaveCards}
                    disabled={updatingCS}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {updatingCS ? 'Saving...' : 'Save Cards'}
                  </button>
                </div>
              </div>
            )}

            {/* Contact Methods Tab */}
            {activeTab === 'contact' && (
              <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                <h3 className="text-2xl font-black text-slate-900 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Contact Methods
                </h3>
                <div className="space-y-6">
                  {contactMethods.map((method, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-6">
                      <h4 className="text-lg font-black text-slate-900 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {method.label}
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Value</label>
                          <input
                            type="text"
                            value={method.value}
                            onChange={(e) => {
                              const newMethods = [...contactMethods];
                              newMethods[index].value = e.target.value;
                              setContactMethods(newMethods);
                            }}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                            placeholder={method.type === 'email' ? 'support@smeconnect.com' : method.type === 'phone' ? '+1 (555) 123-4567' : ''}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Availability</label>
                          <input
                            type="text"
                            value={method.availability}
                            onChange={(e) => {
                              const newMethods = [...contactMethods];
                              newMethods[index].availability = e.target.value;
                              setContactMethods(newMethods);
                            }}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={handleSaveContact}
                    disabled={updatingCS}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {updatingCS ? 'Saving...' : 'Save Contact Methods'}
                  </button>
                </div>
              </div>
            )}

            {/* FAQs Tab */}
            {activeTab === 'faqs' && (
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
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
