import React, { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { isLoggedIn, getJwtToken } from '../../auth';
import { CREATE_OR_UPDATE_ORGANIZATION } from '../../../apollo/user/mutation';
import { GET_BUYER_ORGANIZATION } from '../../../apollo/user/query';
import { getHeaders } from '../../../apollo/utils';

export function BuyerOrganizationForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    orgName: '',
    industry: '',
    location: '',
    description: '',
    logoUrl: '',
  });
  const [isSaved, setIsSaved] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Fetch existing organization data
  const { data: orgData, loading: orgLoading, refetch } = useQuery(GET_BUYER_ORGANIZATION, {
    skip: !isLoggedIn(),
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    context: {
      headers: isLoggedIn() ? getHeaders() : {},
    },
  });

  // Sync form data with backend when organization data changes (only when not in edit mode)
  useEffect(() => {
    if (orgData?.getBuyerOrganization && !isEditMode && !logoFile) {
      const org = orgData.getBuyerOrganization;
      const logoUrl = org.orgLogoImages && org.orgLogoImages.length > 0 ? org.orgLogoImages[0] : '';

      setFormData({
        orgName: org.orgName || '',
        industry: org.orgIndustry || '',
        location: org.location || '',
        description: org.orgDescription || '',
        logoUrl: logoUrl,
      });

      if (logoUrl) {
        setLogoPreview((prev) => {
          if (prev && prev.startsWith('blob:')) {
            URL.revokeObjectURL(prev);
          }
          return logoUrl;
        });
      } else {
        setLogoPreview((prev) => {
          if (prev && !prev.startsWith('blob:')) {
            return '';
          }
          return prev;
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgData?.getBuyerOrganization?._id, isEditMode, logoFile]);

  const organizationExists = orgData?.getBuyerOrganization?._id;

  // Auto-enable edit mode if organization doesn't exist yet
  useEffect(() => {
    if (!organizationExists && !isEditMode) {
      setIsEditMode(true);
    }
  }, [organizationExists, isEditMode]);

  // Create/Update organization mutation
  const [createOrUpdateOrg, { loading: isSaving }] = useMutation(CREATE_OR_UPDATE_ORGANIZATION, {
    context: {
      headers: isLoggedIn() ? getHeaders() : {},
    },
    onCompleted: (data) => {
      setIsSaved(true);
      setShowSuccessMessage(true);
      setIsEditMode(false);

      if (data?.createOrUpdateBuyerOrganization?.orgLogoImages?.length > 0) {
        const savedLogoUrl = data.createOrUpdateBuyerOrganization.orgLogoImages[0];
        if (logoPreview && logoPreview.startsWith('blob:')) {
          URL.revokeObjectURL(logoPreview);
        }
        setLogoPreview(savedLogoUrl);
        setFormData((prev) => ({ ...prev, logoUrl: savedLogoUrl }));
      }

      setLogoFile(null);

      setTimeout(() => {
        setIsSaved(false);
        setShowSuccessMessage(false);
      }, 3000);

      refetch();
    },
    onError: (error) => {
      console.error('Error saving organization:', error);
      alert('Failed to save organization. Please try again.');
    },
  });

  const handleInputChange = (field: string, value: string) => {
    if (!isEditMode) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleEditToggle = () => {
    if (isEditMode && orgData?.getBuyerOrganization) {
      const org = orgData.getBuyerOrganization;
      const logoUrl = org.orgLogoImages && org.orgLogoImages.length > 0 ? org.orgLogoImages[0] : '';
      setFormData({
        orgName: org.orgName || '',
        industry: org.orgIndustry || '',
        location: org.location || '',
        description: org.orgDescription || '',
        logoUrl: logoUrl,
      });
      if (logoPreview && logoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(logoPreview);
      }
      setLogoPreview(logoUrl);
      setLogoFile(null);
    }
    setIsEditMode(!isEditMode);
    setIsSaved(false);
  };

  const handleSave = async () => {
    if (!formData.orgName || !formData.industry || !formData.location || !formData.description) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      let logoUrl = formData.logoUrl;

      if (logoFile) {
        setIsUploadingLogo(true);
        try {
          logoUrl = await uploadLogoToBackend(logoFile);
          setFormData((prev) => ({ ...prev, logoUrl }));
          setLogoFile(null);

          if (logoPreview && logoPreview.startsWith('blob:')) {
            URL.revokeObjectURL(logoPreview);
          }
          setLogoPreview(logoUrl);
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
          },
        },
      });
    } catch {
      // handled in onError
    }
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'OR';

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
    setIsSaved(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadLogoToBackend = async (file: File): Promise<string> => {
    const formData = new FormData();
    const token = getJwtToken();
    const apiUrl =
      process.env.NEXT_PUBLIC_API_GRAPHQL_URL ||
      process.env.REACT_APP_API_GRAPHQL_URL ||
      'http://localhost:3010/graphql';

    formData.append(
      'operations',
      JSON.stringify({
        query: `mutation ImageUploader($file: Upload!, $target: String!) {
          imageUploader(file: $file, target: $target)
        }`,
        variables: { file: null, target: 'organization' },
      }),
    );

    formData.append(
      'map',
      JSON.stringify({
        0: ['variables.file'],
      }),
    );

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

  return (
    <div className="space-y-8">
      {/* Success Message Toast */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
          <div className="bg-emerald-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
            <div>
              <p className="font-bold text-sm">Success!</p>
              <p className="text-xs text-emerald-50">
                {organizationExists ? 'Organization updated successfully' : 'Organization created successfully'}
              </p>
            </div>
            <button onClick={() => setShowSuccessMessage(false)} className="ml-auto text-white/80 hover:text-white">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Organization Form Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Organization Profile</h3>
            <p className="text-sm text-slate-500 mt-0.5">
              {organizationExists ? 'Update your organization information' : 'Create your organization to get started'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {organizationExists && !isEditMode && (
              <button
                onClick={handleEditToggle}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-[var(--primary)] hover:bg-indigo-50 border border-indigo-200 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">edit</span>
                Edit
              </button>
            )}
            {isEditMode && (
              <button
                onClick={handleEditToggle}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 border border-slate-200 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
                Cancel
              </button>
            )}
            {isSaved && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                {organizationExists ? 'Saved' : 'Created'}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-start gap-8">
          {/* Logo upload */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {logoPreview ? (
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-lg">
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
            <input
              ref={fileInputRef}
              type="file"
              hidden
              id="buyer-logo-upload-input"
              onChange={handleLogoSelect}
              accept="image/jpg, image/jpeg, image/png"
              disabled={isUploadingLogo || !isEditMode}
            />
            {isEditMode && (
              <label
                htmlFor="buyer-logo-upload-input"
                className={`text-xs font-bold text-[var(--primary)] hover:underline cursor-pointer ${
                  isUploadingLogo ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {logoFile ? 'Change Logo' : logoPreview ? 'Change Logo' : 'Upload Logo'}
              </label>
            )}
            {logoFile && (
              <p className="text-xs text-slate-500 text-center max-w-[96px]">
                New logo selected. Click "Save Changes" to upload.
              </p>
            )}
          </div>

          {/* Fields */}
          <div className="flex-1 grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Organization Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.orgName}
                onChange={(e) => handleInputChange('orgName', e.target.value)}
                placeholder="Enter your organization name"
                disabled={!isEditMode}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 disabled:bg-white disabled:cursor-not-allowed disabled:text-slate-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Industry <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                disabled={!isEditMode}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 disabled:bg-white disabled:cursor-not-allowed disabled:text-slate-600"
              >
                <option value="">Select Industry</option>
                <option value="Technology & Software">Technology & Software</option>
                <option value="Finance & Banking">Finance & Banking</option>
                <option value="Healthcare">Healthcare</option>
                <option value="E-Commerce">E-Commerce</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Retail">Retail</option>
                <option value="Education">Education</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Location <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., San Francisco, CA, USA"
                disabled={!isEditMode}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 disabled:bg-white disabled:cursor-not-allowed disabled:text-slate-600"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Company Description <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={8}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Provide a detailed description of your organization, including what you do, your mission, values, and any other relevant information that would help service providers understand your business..."
                disabled={!isEditMode}
                className="w-full border border-slate-200 rounded-lg px-4 py-3.5 text-sm font-medium text-slate-900 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 resize-y min-h-[200px] disabled:bg-white disabled:cursor-not-allowed disabled:text-slate-600"
              />
              <p className="text-xs text-slate-400 mt-1.5 text-right">
                {formData.description.length} / 2000 characters
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Business Verification (same pattern as settings) */}
      <div className="bg-white border border-slate-200 rounded-xl p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-1">Business Verification</h3>
        <p className="text-sm text-slate-500 mb-6">Your verification status and documents</p>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Business License', status: 'Verified', icon: 'description', color: 'emerald' },
            { label: 'Tax Registration', status: 'Verified', icon: 'receipt_long', color: 'emerald' },
            { label: 'Bank Account', status: 'Pending', icon: 'account_balance', color: 'amber' },
          ].map((doc) => (
            <div
              key={doc.label}
              className="p-4 border border-slate-100 rounded-lg flex items-center gap-4 hover:border-slate-200 transition-colors"
            >
              <div
                className={`w-10 h-10 rounded-lg ${
                  doc.color === 'emerald' ? 'bg-emerald-50' : 'bg-amber-50'
                } flex items-center justify-center`}
              >
                <span
                  className={`material-symbols-outlined ${
                    doc.color === 'emerald' ? 'text-emerald-600' : 'text-amber-600'
                  } text-xl`}
                >
                  {doc.icon}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900">{doc.label}</p>
                <p
                  className={`text-xs font-semibold ${
                    doc.color === 'emerald' ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  {doc.status}
                </p>
              </div>
              <span className="material-symbols-outlined text-slate-300 text-lg">chevron_right</span>
            </div>
          ))}
        </div>
      </div>

      {isEditMode && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={
              isSaving ||
              isUploadingLogo ||
              orgLoading ||
              !formData.orgName ||
              !formData.industry ||
              !formData.location ||
              !formData.description
            }
            className="bg-[var(--primary)] hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm flex items-center gap-2"
          >
            {isSaving || isUploadingLogo ? (
              <>
                <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                {isUploadingLogo ? 'Uploading Logo...' : organizationExists ? 'Saving...' : 'Creating...'}
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">
                  {organizationExists ? 'save' : 'add'}
                </span>
                {organizationExists ? 'Save Changes' : 'Create Organization'}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

