import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../apollo/store';
import { isLoggedIn } from '../libs/auth';
import { Sidebar } from '../libs/components/dashboard/Sidebar';

/* ═══════════════════════════════════════════════════════════
   Category → Subcategory → Skills mapping
   (matches backend enums in libs/types/category.enum.ts)
   ═══════════════════════════════════════════════════════════ */
interface CategoryData {
  icon: string;
  color: string;
  subcategories: string[];
  skills: string[];
}

const CATEGORY_MAP: Record<string, CategoryData> = {
  'IT & Software': {
    icon: 'code',
    color: 'indigo',
    subcategories: [
      'Web & App Development',
      'Data & AI',
      'Software Testing & QA',
      'Infrastructure & Cloud',
    ],
    skills: ['React', 'Python', 'Node.js', 'AWS', 'TypeScript', 'Docker', 'SQL', 'REST API'],
  },
  'Business Services': {
    icon: 'business_center',
    color: 'indigo',
    subcategories: [
      'Admin & Virtual Support',
      'Financial & Legal',
      'Strategy & Consulting',
      'HR & Operations',
    ],
    skills: ['Business Analysis', 'Financial Modeling', 'Strategic Planning', 'Budgeting', 'Compliance', 'Project Management', 'Market Research', 'Contract Drafting'],
  },
  'Marketing & Sales': {
    icon: 'campaign',
    color: 'indigo',
    subcategories: [
      'Digital Marketing',
      'Social Media Management',
      'Content & Copywriting',
      'Sales & Lead Generation',
    ],
    skills: ['SEO', 'Google Ads', 'Content Strategy', 'Copywriting', 'Social Media', 'Email Marketing', 'Google Analytics', 'Lead Generation'],
  },
  'Design & Creative': {
    icon: 'palette',
    color: 'indigo',
    subcategories: [
      'Visual Identity & Branding',
      'UI/UX & Web Design',
      'Motion & Video',
      'Illustration & Print',
    ],
    skills: ['Figma', 'Photoshop', 'Illustrator', 'UI/UX Design', 'Prototyping', 'Logo Design', 'After Effects', 'Brand Guidelines'],
  },
};

const CATEGORY_NAMES = Object.keys(CATEGORY_MAP);

const ORGANIZATIONS = [
  { id: '1', name: 'Acme Corp', icon: 'AC' },
  { id: '2', name: 'Acme Web Studio', icon: 'AW' },
];

/* ═══════════════════════════════════════════════════════════
   Form state
   ═══════════════════════════════════════════════════════════ */
interface FormData {
  organization: string;
  title: string;
  category: string;
  subcategory: string;
  budgetMin: string;
  budgetMax: string;
  deadline: string;
  description: string;
  attachments: string[];
  skills: string[];
  urgency: 'normal' | 'urgent' | 'critical';
}

const INITIAL: FormData = {
  organization: '1',
  title: '',
  category: '',
  subcategory: '',
  budgetMin: '',
  budgetMax: '',
  deadline: '',
  description: '',
  attachments: [],
  skills: [],
  urgency: 'normal',
};

/* ═══════════════════════════════════════════════════════════
   Preview Card
   ═══════════════════════════════════════════════════════════ */
function PreviewCard({ form }: { form: FormData }) {
  const org = ORGANIZATIONS.find((o) => o.id === form.organization);
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden min-w-0">
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Preview</p>
      </div>
      <div className="p-6 space-y-4 overflow-hidden">
        {/* Org badge */}
        {org && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-indigo-100 flex items-center justify-center">
              <span className="text-[9px] font-bold text-indigo-700">{org.icon}</span>
            </div>
            <span className="text-xs font-semibold text-slate-500">{org.name}</span>
          </div>
        )}

        <h3 className="text-lg font-bold text-slate-900 leading-tight">
          {form.title || <span className="text-slate-300 italic">Untitled Request</span>}
        </h3>

        <div className="flex flex-wrap gap-2">
          {form.category && (
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              {form.category}
            </span>
          )}
          {form.subcategory && (
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
              {form.subcategory}
            </span>
          )}
          <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
            form.urgency === 'critical' ? 'bg-red-50 text-red-700 border border-red-100'
              : form.urgency === 'urgent' ? 'bg-amber-50 text-amber-700 border border-amber-100'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
          }`}>
            {form.urgency}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-400 text-lg">payments</span>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Budget</p>
              <p className="text-sm font-bold text-slate-700">
                {form.budgetMin || form.budgetMax
                  ? `$${form.budgetMin || '0'} – $${form.budgetMax || '∞'}`
                  : <span className="text-slate-300">Not set</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-400 text-lg">calendar_month</span>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Deadline</p>
              <p className="text-sm font-bold text-slate-700">
                {form.deadline
                  ? new Date(form.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : <span className="text-slate-300">Not set</span>}
              </p>
            </div>
          </div>
        </div>

        {form.description && (
          <p className="text-sm text-slate-600 leading-relaxed break-words whitespace-pre-wrap overflow-hidden">{form.description}</p>
        )}

        {form.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {form.skills.map((s) => (
              <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Post Job Page
   ═══════════════════════════════════════════════════════════ */
export default function PostJobPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [skillInput, setSkillInput] = useState('');
  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn()) router.push('/login');
  }, [router]);

  if (!mounted) {
    return (
      <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
        <div className="w-64 flex-shrink-0 h-full border-r border-slate-200 bg-white" />
        <div className="flex flex-1 flex-col overflow-hidden"><main className="flex-1 overflow-y-auto" /></div>
      </div>
    );
  }
  if (!isLoggedIn()) return null;

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !form.skills.includes(trimmed)) {
      update('skills', [...form.skills, trimmed]);
    }
    setSkillInput('');
  };

  const removeSkill = (skill: string) => update('skills', form.skills.filter((s) => s !== skill));

  const filledFields = [form.title, form.category, form.budgetMin, form.deadline, form.description].filter(Boolean).length;
  const progressPct = Math.round((filledFields / 5) * 100);

  return (
    <div className="flex h-screen w-full bg-[#F9FAFB] overflow-hidden antialiased">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-[#F9FAFB]">
          <div className="max-w-6xl mx-auto px-10 py-10">

            {/* ── Back + Title ─────────────────────── */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.back()}
                  className="w-10 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Post New Service Request</h1>
                  <p className="text-sm text-slate-500 font-medium mt-0.5">Fill in the details to publish to the marketplace</p>
                </div>
              </div>

              {/* Progress pill */}
              <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-full px-4 py-2">
                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--primary)] rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-500">{progressPct}%</span>
              </div>
            </div>

            {/* ── Step Indicator ───────────────────── */}
            <div className="flex items-center gap-3 mb-8">
              {[
                { n: 1, label: 'Request Details' },
                { n: 2, label: 'Review & Post' },
              ].map((s, i) => (
                <React.Fragment key={s.n}>
                  {i > 0 && <div className="flex-1 h-px bg-slate-200" />}
                  <button
                    onClick={() => setStep(s.n as 1 | 2)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      step === s.n
                        ? 'bg-[var(--primary)] text-white shadow-sm'
                        : step > s.n
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-white border border-slate-200 text-slate-400'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      step === s.n ? 'bg-white/20 text-white' : step > s.n ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {step > s.n ? '✓' : s.n}
                    </span>
                    {s.label}
                  </button>
                </React.Fragment>
              ))}
            </div>

            {/* ── Two-Column Layout ────────────────── */}
            <div className="grid grid-cols-12 gap-8">

              {/* LEFT — Form */}
              <div className="col-span-8 space-y-6">

                {step === 1 && (
                  <>
                    {/* Organization */}
                    <div className="bg-white border border-slate-200 rounded-xl p-8">
                      <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[var(--primary)]">business</span>
                        Organization
                      </h3>
                      <p className="text-sm text-slate-500 mb-6">Select the organization posting this request</p>

                      <div className="grid grid-cols-2 gap-3">
                        {ORGANIZATIONS.map((org) => (
                          <button
                            key={org.id}
                            onClick={() => update('organization', org.id)}
                            className={`flex items-center gap-3 p-4 border rounded-lg text-left transition-all ${
                              form.organization === org.id
                                ? 'border-[var(--primary)] bg-indigo-50/50 ring-1 ring-indigo-200'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                              form.organization === org.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {org.icon}
                            </div>
                            <span className="text-sm font-bold text-slate-900">{org.name}</span>
                            {form.organization === org.id && (
                              <span className="material-symbols-outlined text-[var(--primary)] ml-auto text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                                check_circle
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Title & Category */}
                    <div className="bg-white border border-slate-200 rounded-xl p-8">
                      <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[var(--primary)]">edit_note</span>
                        Request Details
                      </h3>
                      <p className="text-sm text-slate-500 mb-6">Describe what you need from service providers</p>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Request Title <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={form.title}
                            onChange={(e) => update('title', e.target.value)}
                            placeholder="e.g. Web Design & Brand Identity Refresh"
                            className="w-full border border-slate-200 rounded-lg px-4 py-3.5 text-sm font-medium text-slate-900 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 placeholder:text-slate-300"
                          />
                        </div>

                        {/* Category Selection */}
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                            Category <span className="text-red-400">*</span>
                          </label>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            {CATEGORY_NAMES.map((cat) => {
                              const data = CATEGORY_MAP[cat];
                              const isSelected = form.category === cat;
                              return (
                                <button
                                  key={cat}
                                  onClick={() => {
                                    setForm((prev) => ({
                                      ...prev,
                                      category: cat,
                                      subcategory: '',
                                      skills: [],
                                    }));
                                  }}
                                  className={`flex flex-col items-center gap-2 p-5 border rounded-xl text-center transition-all ${
                                    isSelected
                                      ? 'border-transparent bg-indigo-50 ring-1 ring-indigo-200'
                                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                                  }`}
                                >
                                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                                    isSelected ? 'bg-indigo-100' : 'bg-slate-100'
                                  }`}>
                                    <span className={`material-symbols-outlined text-xl ${
                                      isSelected ? 'text-indigo-700' : 'text-slate-400'
                                    }`}>{data.icon}</span>
                                  </div>
                                  <span className={`text-sm font-bold leading-tight ${isSelected ? 'text-indigo-700' : 'text-slate-700'}`}>
                                    {cat}
                                  </span>
                                  {isSelected && (
                                    <span className="material-symbols-outlined text-base text-indigo-700" style={{ fontVariationSettings: "'FILL' 1" }}>
                                      check_circle
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Subcategory Pills */}
                        {form.category && CATEGORY_MAP[form.category] && (
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                              Subcategory <span className="text-red-400">*</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {CATEGORY_MAP[form.category].subcategories.map((sub) => {
                                const isActive = form.subcategory === sub;
                                return (
                                  <button
                                    key={sub}
                                    onClick={() => update('subcategory', isActive ? '' : sub)}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                                      isActive
                                        ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                                    }`}
                                  >
                                    {sub}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Urgency */}
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Urgency
                          </label>
                          <div className="flex gap-2">
                            {(['normal', 'urgent', 'critical'] as const).map((u) => (
                              <button
                                key={u}
                                onClick={() => update('urgency', u)}
                                className={`flex-1 py-3 rounded-lg text-sm font-bold capitalize transition-all border ${
                                  form.urgency === u
                                    ? u === 'critical' ? 'bg-red-50 text-red-700 border-red-200'
                                      : u === 'urgent' ? 'bg-amber-50 text-amber-700 border-amber-200'
                                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                {u}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Description <span className="text-red-400">*</span>
                          </label>
                          <textarea
                            rows={12}
                            value={form.description}
                            onChange={(e) => update('description', e.target.value)}
                            placeholder="Describe the scope of work, deliverables, and any special requirements..."
                            className="w-full border border-slate-200 rounded-lg px-4 py-3.5 text-sm font-medium text-slate-900 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 resize-y placeholder:text-slate-300"
                          />
                          <p className="text-xs text-slate-400 mt-1.5 text-right">{form.description.length} / 2000</p>
                        </div>
                      </div>
                    </div>

                    {/* Budget & Timeline */}
                    <div className="bg-white border border-slate-200 rounded-xl p-8">
                      <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[var(--primary)]">payments</span>
                        Budget &amp; Timeline
                      </h3>
                      <p className="text-sm text-slate-500 mb-6">Set your expected budget range and project deadline</p>

                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Min Budget <span className="text-red-400">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                            <input
                              type="number"
                              value={form.budgetMin}
                              onChange={(e) => update('budgetMin', e.target.value)}
                              placeholder="500"
                              className="w-full border border-slate-200 rounded-lg pl-8 pr-4 py-3.5 text-sm font-medium text-slate-900 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 placeholder:text-slate-300"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Max Budget
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                            <input
                              type="number"
                              value={form.budgetMax}
                              onChange={(e) => update('budgetMax', e.target.value)}
                              placeholder="1,200"
                              className="w-full border border-slate-200 rounded-lg pl-8 pr-4 py-3.5 text-sm font-medium text-slate-900 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 placeholder:text-slate-300"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Deadline <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="date"
                            value={form.deadline}
                            onChange={(e) => update('deadline', e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-4 py-3.5 text-sm font-medium text-slate-900 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Skills / Tags — dynamic based on category */}
                    <div className="bg-white border border-slate-200 rounded-xl p-8">
                      <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[var(--primary)]">sell</span>
                        Required Skills
                      </h3>
                      <p className="text-sm text-slate-500 mb-6">
                        {form.category
                          ? <>Skills for <span className="font-bold text-slate-700">{form.category}</span> — click to add or type your own</>
                          : 'Select a category above to see relevant skills'
                        }
                      </p>

                      {/* Chip input */}
                      <div className="flex flex-wrap items-center gap-2 p-3 border border-slate-200 rounded-lg bg-slate-50/50 mb-4 min-h-[48px]">
                        {form.skills.map((s) => (
                          <span key={s} className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-md border border-indigo-100">
                            {s}
                            <button onClick={() => removeSkill(s)} className="hover:text-red-500 transition-colors">
                              <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                          </span>
                        ))}
                        <input
                          type="text"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }}
                          placeholder={form.skills.length ? 'Add more...' : 'Type a skill and press Enter...'}
                          className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm text-slate-900 placeholder:text-slate-300"
                        />
                      </div>

                      {/* Dynamic suggestions based on selected category */}
                      {form.category && CATEGORY_MAP[form.category] ? (
                        <div className="flex flex-wrap gap-2">
                          {CATEGORY_MAP[form.category].skills
                            .filter((s) => !form.skills.includes(s))
                            .map((s) => (
                              <button
                                key={s}
                                onClick={() => addSkill(s)}
                                className="px-3 py-1.5 border border-dashed border-slate-200 rounded-lg text-xs font-medium text-slate-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all"
                              >
                                + {s}
                              </button>
                            ))}
                        </div>
                      ) : (
                        <div className="py-6 text-center">
                          <span className="material-symbols-outlined text-slate-300 text-3xl mb-2 block">category</span>
                          <p className="text-sm text-slate-400">Pick a category to see suggested skills</p>
                        </div>
                      )}
                    </div>

                    {/* Attachments placeholder */}
                    <div className="bg-white border border-slate-200 rounded-xl p-8">
                      <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[var(--primary)]">attach_file</span>
                        Attachments
                      </h3>
                      <p className="text-sm text-slate-500 mb-6">Upload any supporting documents, briefs, or references</p>

                      <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                          <span className="material-symbols-outlined text-slate-400 text-2xl">cloud_upload</span>
                        </div>
                        <p className="text-sm font-bold text-slate-700">Drop files here or click to upload</p>
                        <p className="text-xs text-slate-400 mt-1">PDF, DOC, PNG, JPG up to 10MB each</p>
                      </div>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    {/* Full preview */}
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                      <div className="px-8 py-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-bold text-slate-900">Review Your Request</h3>
                          <p className="text-sm text-slate-500 mt-0.5">Make sure everything looks correct before publishing</p>
                        </div>
                        <button
                          onClick={() => setStep(1)}
                          className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-white transition-colors flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                          Edit
                        </button>
                      </div>

                      <div className="p-8 space-y-8">
                        {/* Title section */}
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              {(() => {
                                const org = ORGANIZATIONS.find((o) => o.id === form.organization);
                                return org ? (
                                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded text-xs font-semibold text-slate-600">
                                    {org.name}
                                  </span>
                                ) : null;
                              })()}
                              <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                                form.urgency === 'critical' ? 'bg-red-50 text-red-700 border border-red-100'
                                  : form.urgency === 'urgent' ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              }`}>
                                {form.urgency}
                              </span>
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">{form.title || 'Untitled Request'}</h2>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                            Draft
                          </span>
                        </div>

                        {/* Meta grid */}
                        <div className="grid grid-cols-4 gap-6 p-5 bg-slate-50 rounded-xl">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400 text-lg">payments</span>
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Budget</p>
                              <p className="text-sm font-bold text-slate-700">
                                ${form.budgetMin || '0'} – ${form.budgetMax || '∞'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400 text-lg">calendar_month</span>
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Deadline</p>
                              <p className="text-sm font-bold text-slate-700">
                                {form.deadline
                                  ? new Date(form.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                  : '—'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400 text-lg">sell</span>
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Category</p>
                              <p className="text-sm font-bold text-slate-700">{form.category || '—'}</p>
                              {form.subcategory && (
                                <p className="text-xs text-slate-500 mt-0.5">{form.subcategory}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400 text-lg">speed</span>
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Urgency</p>
                              <p className="text-sm font-bold text-slate-700 capitalize">{form.urgency}</p>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
                          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap break-words overflow-hidden">
                            {form.description || <span className="text-slate-300 italic">No description provided</span>}
                          </p>
                        </div>

                        {/* Skills */}
                        {form.skills.length > 0 && (
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Required Skills</h4>
                            <div className="flex flex-wrap gap-2">
                              {form.skills.map((s) => (
                                <span key={s} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-md border border-indigo-100">{s}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Terms note */}
                    <div className="flex items-start gap-3 p-5 bg-amber-50 border border-amber-100 rounded-xl">
                      <span className="material-symbols-outlined text-amber-600 text-xl mt-0.5">info</span>
                      <div>
                        <p className="text-sm font-bold text-amber-900">Before you post</p>
                        <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                          By publishing this request, you agree to SME Connect&apos;s Terms of Service. Providers will be able to
                          view your request and submit quotes. You can edit or close this request at any time.
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {/* ── Action buttons ──────────────── */}
                <div className="flex items-center justify-between pt-2">
                  {step === 2 ? (
                    <>
                      <button
                        onClick={() => setStep(1)}
                        className="px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-white transition-colors flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Back to Edit
                      </button>
                      <div className="flex items-center gap-3">
                        <button className="px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                          Save as Draft
                        </button>
                        <button
                          onClick={() => router.push('/service-requests')}
                          className="bg-[var(--primary)] hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-sm"
                        >
                          <span className="material-symbols-outlined text-lg">send</span>
                          Publish Request
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => router.back()}
                        className="px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-white transition-colors"
                      >
                        Cancel
                      </button>
                      <div className="flex items-center gap-3">
                        <button className="px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                          Save as Draft
                        </button>
                        <button
                          onClick={() => setStep(2)}
                          className="bg-[var(--primary)] hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-sm"
                        >
                          Preview
                          <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* RIGHT — Sticky preview */}
              <div className="col-span-4">
                <div className="sticky top-10 space-y-6">
                  <PreviewCard form={form} />

                  {/* Tips card */}
                  <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Tips for Success</h4>
                    <ul className="space-y-3">
                      {[
                        { icon: 'title', tip: 'Use a clear, specific title' },
                        { icon: 'payments', tip: 'Set a realistic budget range' },
                        { icon: 'description', tip: 'Describe deliverables in detail' },
                        { icon: 'calendar_month', tip: 'Allow enough time for quality work' },
                        { icon: 'sell', tip: 'Add relevant skills and tags' },
                      ].map((t) => (
                        <li key={t.icon} className="flex items-start gap-2.5">
                          <span className="material-symbols-outlined text-emerald-500 text-lg mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          <span className="text-sm text-slate-600 font-medium">{t.tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Management Footer ─────────────── */}
            <div className="flex flex-wrap items-center gap-4 pt-10 mt-10 border-t border-[var(--border)]">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-4">Management</p>
              <button
                onClick={() => router.push('/marketplace')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">groups</span>
                Browse Talent
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-lg">settings_suggest</span>
                Manage Organizations
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-lg">help</span>
                Help &amp; Support
              </button>
            </div>
            <div className="pb-8 mt-4">
              <p className="text-xs text-slate-400 font-medium">© 2024 SME Connect. Enterprise Buyer Protocol v2.4.1</p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
