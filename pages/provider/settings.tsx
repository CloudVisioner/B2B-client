import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar, useMutation, useQuery } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { isLoggedIn, getJwtToken } from '../../libs/auth';
import { ProviderSidebar } from '../../libs/components/dashboard/ProviderSidebar';
import { ProviderHeader } from '../../libs/components/dashboard/ProviderHeader';
import { CREATE_OR_UPDATE_ORGANIZATION } from '../../apollo/user/mutation';
import { GET_BUYER_ORGANIZATION } from '../../apollo/user/query';
import { getHeaders } from '../../apollo/utils';

export default function ProviderSettingsPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    orgName: '',
    industry: '',
    location: '',
    description: '',
    specialties: [] as string[],
    hourlyRate: '',
    availability: '',
    logoUrl: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [specialtyInput, setSpecialtyInput] = useState('');

  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }
    const role = currentUser?.userRole;
    if (role && role !== 'PROVIDER' && role !== 'provider') {
      router.push('/dashboard');
    }
  }, [router, currentUser]);

  // Fetch existing organization data
  const { data: orgData, loading: orgLoading, refetch } = useQuery(GET_BUYER_ORGANIZATION, {
    skip: !isLoggedIn(),
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    context: {
      headers: isLoggedIn() ? getHeaders() : {},
    },
    onCompleted: (data) => {
      if (data?.getBuyerOrganization && !isEditMode && !logoFile) {
        const org = data.getBuyerOrganization;
        const logoUrl = org.orgLogoImages && org.orgLogoImages.length > 0 ? org.orgLogoImages[0] : '';
        setFormData((prev) => ({
          orgName: org.orgName || '',
          industry: org.orgIndustry || '',
          location: org.location || '',
          description: org.orgDescription || '',
          specialties: org.orgSkills || [],
          hourlyRate: org.startingRate?.toString() || '',
          availability: org.teamSize?.toString() || '',
          logoUrl: logoUrl,
        }));
        if (logoUrl) {
          setLogoPreview((prev) => {
            if (prev && prev.startsWith('blob:')) {
              URL.revokeObjectURL(prev);
            }
            return logoUrl;
          });
        }
      }
    },
  });

  const organizationExists = orgData?.getBuyerOrganization?._id;

  const [createOrUpdateOrg, { loading: isSaving }] = useMutation(CREATE_OR_UPDATE_ORGANIZATION, {
    context: {
      headers: isLoggedIn() ? getHeaders() : {},
    },
    onCompleted: (data) => {
      setShowSuccessMessage(true);
      setIsEditMode(false);
      setLogoFile(null);
      const newLogoUrl = data.createOrUpdateBuyerOrganization?.orgLogoImages?.[0] || '';
      setFormData((prev) => ({ ...prev, logoUrl: newLogoUrl }));
      setLogoPreview(newLogoUrl);
      refetch();
      setTimeout(() => setShowSuccessMessage(false), 3000);
    },
    onError: (error) => {
      console.error('Error saving organization:', error);
      alert('Failed to save organization. Please try again.');
    },
  });

  const handleInputChange = (field: string, value: string | string[]) => {
    if (!isEditMode) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSpecialty = () => {
    if (!specialtyInput.trim() || !isEditMode) return;
    const newSpecialty = specialtyInput.trim();
    if (!formData.specialties.includes(newSpecialty)) {
      handleInputChange('specialties', [...formData.specialties, newSpecialty]);
      setSpecialtyInput('');
    }
  };

  const handleRemoveSpecialty = (specialty: string) => {
    if (!isEditMode) return;
    handleInputChange('specialties', formData.specialties.filter((s) => s !== specialty));
  };

  const handleSave = async () => {
    if (!formData.orgName || !formData.industry || !formData.location) {
      alert('Please fill in all required fields (Name, Industry, Location).');
      return;
    }

    try {
      let logoUrl = formData.logoUrl;
      if (logoFile) {
        setIsUploadingLogo(true);
        try {
          logoUrl = await uploadLogoToBackend(logoFile);
        } catch (error: any) {
          console.error('Error uploading logo:', error);
          alert(`Failed to upload logo: ${error.message || 'Please try again'}`);
          setIsUploadingLogo(false);
          return;
        } finally {
          setIsUploadingLogo(false);
        }
      }

      await createOrUpdateOrg({
        variables: {
          input: {
            orgName: formData.orgName.trim(),
            orgIndustry: formData.industry,
            location: formData.location.trim(),
            orgDescription: formData.description.trim(),
            orgLogoImages: logoUrl ? [logoUrl] : [],
            orgSkills: formData.specialties,
            startingRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : undefined,
            teamSize: formData.availability ? parseInt(formData.availability) : undefined,
          },
        },
      });
    } catch (error) {
      // Error handled in onError callback
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'OR';
  };

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditMode) return;
    const image = e.target.files?.[0];
    if (!image) return;
    if (!image.type.match(/^image\/(jpg|jpeg|png)$/i)) {
      alert('Please upload a valid image file (JPG, JPEG, or PNG)');
      return;
    }
    if (image.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }
    if (logoPreview && logoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(logoPreview);
    }
    setLogoFile(image);
    const previewUrl = URL.createObjectURL(image);
    setLogoPreview(previewUrl);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadLogoToBackend = async (file: File): Promise<string> => {
    const formData = new FormData();
    const token = getJwtToken();
    const apiUrl = process.env.NEXT_PUBLIC_API_GRAPHQL_URL || process.env.REACT_APP_API_GRAPHQL_URL || 'http://localhost:3010/graphql';
    formData.append('operations', JSON.stringify({
      query: `mutation ImageUploader($file: Upload!, $target: String!) {
        imageUploader(file: $file, target: $target)
      }`,
      variables: { file: null, target: 'organization' }
    }));
    formData.append('map', JSON.stringify({ '0': ['variables.file'] }));
    formData.append('0', file);
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'apollo-require-preflight': 'true',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    const result = await response.json();
    if (result.errors) {
      throw new Error(result.errors[0]?.message || 'Upload failed');
    }
    const uploadedUrl = result.data?.imageUploader;
    if (!uploadedUrl) {
      throw new Error('No URL returned from upload');
    }
    return uploadedUrl;
  };

  if (!mounted) {
    return (
      <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
        <div className="w-64 flex-shrink-0 h-full border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" />
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800" />
          <main className="flex-1 overflow-y-auto" />
        </div>
      </div>
    );
  }

  if (!isLoggedIn()) return null;

  if (!organizationExists) {
    return (
      <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-900 overflow-hidden antialiased">
        <ProviderSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <ProviderHeader title="Settings" />
          <main className="flex-1 overflow-y-auto p-8">
            <div className="max-w-5xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center">
              <p className="text-slate-600 dark:text-slate-400">Please create an organization first on the Organizations page.</p>
              <button
                onClick={() => router.push('/provider/organizations')}
                className="mt-4 bg-[var(--primary)] hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all"
              >
                Go to Organizations
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-900 overflow-hidden antialiased">
      <ProviderSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <ProviderHeader title="Settings" />
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-5xl mx-auto space-y-8">
            {showSuccessMessage && (
              <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
                <div className="bg-emerald-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <div>
                    <p className="font-bold text-sm">Success!</p>
                    <p className="text-xs text-emerald-50">Organization updated successfully</p>
                  </div>
                  <button onClick={() => setShowSuccessMessage(false)} className="ml-auto text-white/80 hover:text-white">
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Organization Profile</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Edit your organization information</p>
                </div>
                {!isEditMode && (
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-[var(--primary)] hover:bg-indigo-50 dark:hover:bg-slate-800 border border-indigo-200 dark:border-slate-700 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                    Edit
                  </button>
                )}
                {isEditMode && (
                  <button
                    onClick={() => {
                      setIsEditMode(false);
                      refetch();
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                    Cancel
                  </button>
                )}
              </div>

              <div className="flex items-start gap-8">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    {logoPreview ? (
                      <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-lg">
                        <img src={logoPreview} alt="Organization logo" className="w-full h-full object-cover" />
                        {isUploadingLogo && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="material-symbols-outlined text-white animate-spin">sync</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-200">
                        {getInitials(formData.orgName || 'Organization')}
                      </div>
                    )}
                  </div>
                  {isEditMode && (
                    <>
                      <input ref={fileInputRef} type="file" hidden id="logo-upload-input" onChange={handleLogoSelect} accept="image/jpg, image/jpeg, image/png" disabled={isUploadingLogo} />
                      <label htmlFor="logo-upload-input" className={`text-xs font-bold text-[var(--primary)] hover:underline cursor-pointer ${isUploadingLogo ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {logoFile ? 'Change Logo' : logoPreview ? 'Change Logo' : 'Upload Logo'}
                      </label>
                    </>
                  )}
                </div>

                <div className="flex-1 grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Organization Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.orgName}
                      onChange={(e) => handleInputChange('orgName', e.target.value)}
                      placeholder="Acme Web Studio"
                      disabled={!isEditMode}
                      className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 dark:bg-slate-900/40 disabled:bg-white dark:disabled:bg-slate-900 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Industry/Category <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      placeholder="Web Development"
                      disabled={!isEditMode}
                      className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 dark:bg-slate-900/40 disabled:bg-white dark:disabled:bg-slate-900 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Location <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Busan, South Korea"
                      disabled={!isEditMode}
                      className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 dark:bg-slate-900/40 disabled:bg-white dark:disabled:bg-slate-900 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Short Description
                    </label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Full-stack React/Next.js agency..."
                      disabled={!isEditMode}
                      className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 dark:bg-slate-900/40 resize-y disabled:bg-white dark:disabled:bg-slate-900 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Specialties
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.specialties.map((spec) => (
                        <span key={spec} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-semibold">
                          {spec}
                          {isEditMode && (
                            <button onClick={() => handleRemoveSpecialty(spec)} className="text-indigo-500 hover:text-indigo-700">
                              <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                    {isEditMode && (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={specialtyInput}
                          onChange={(e) => setSpecialtyInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddSpecialty()}
                          placeholder="React, AWS, TypeScript..."
                          className="flex-1 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 dark:bg-slate-900/40"
                        />
                        <button onClick={handleAddSpecialty} className="px-4 py-2.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors">
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Hourly Rate
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">$</span>
                      <input
                        type="number"
                        min={0}
                        value={formData.hourlyRate}
                        onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                        placeholder="75"
                        disabled={!isEditMode}
                        className="w-32 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 dark:bg-slate-900/40 disabled:bg-white dark:disabled:bg-slate-900 disabled:cursor-not-allowed"
                      />
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">/ hour</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Availability
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={80}
                        value={formData.availability}
                        onChange={(e) => handleInputChange('availability', e.target.value)}
                        placeholder="40"
                        disabled={!isEditMode}
                        className="w-20 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 dark:bg-slate-900/40 disabled:bg-white dark:disabled:bg-slate-900 disabled:cursor-not-allowed"
                      />
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">hours / week</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {isEditMode && (
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={isSaving || isUploadingLogo || orgLoading || !formData.orgName || !formData.industry || !formData.location}
                  className="bg-[var(--primary)] hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm flex items-center gap-2"
                >
                  {isSaving || isUploadingLogo ? (
                    <>
                      <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                      {isUploadingLogo ? 'Uploading Logo...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">save</span>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Footer - Matching Buyer Dashboard Style */}
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-[var(--border)]">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-4">Management</p>
              <button
                onClick={() => router.push('/provider/jobs')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">work</span>
                Find Jobs
              </button>
              <button
                onClick={() => router.push('/provider/organizations')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">settings_suggest</span>
                Manage Organizations
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-lg">help</span>
                Help & Support
              </button>
            </div>
            <div className="pb-8">
              <p className="text-xs text-slate-400 font-medium">© 2026 SME Marketplace Provider v2.1</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
