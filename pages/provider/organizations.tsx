import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar, useMutation, useQuery } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { isLoggedIn, getJwtToken } from '../../libs/auth';
import { getHeaders } from '../../apollo/utils';
import { ProviderSidebar } from '../../libs/components/dashboard/ProviderSidebar';
import { ProviderHeader } from '../../libs/components/dashboard/ProviderHeader';
import { CREATE_PROVIDER_ORG_PROF, UPDATE_PROVIDER_ORG_PROF } from '../../apollo/user/mutation';
import { GET_PROVIDER_ORGANIZATION } from '../../apollo/user/query';

/* ═══════════════════════════════════════════════════════════
   Category and SubCategory Options
   ═══════════════════════════════════════════════════════════ */
const CATEGORIES = [
  { value: 'IT_AND_SOFTWARE', label: 'IT & Software' },
  { value: 'BUSINESS_SERVICES', label: 'Business Services' },
  { value: 'MARKETING_AND_SALES', label: 'Marketing & Sales' },
  { value: 'DESIGN_AND_CREATIVE', label: 'Design & Creative' },
];

const SUBCATEGORIES: Record<string, { value: string; label: string }[]> = {
  IT_AND_SOFTWARE: [
    { value: 'WEB_APP_DEVELOPMENT', label: 'Web & App Development' },
    { value: 'DATA_AND_AI', label: 'Data & AI' },
    { value: 'SOFTWARE_TESTING_AND_QA', label: 'Software Testing & QA' },
    { value: 'INFRASTRUCTURE_AND_CLOUD', label: 'Infrastructure & Cloud' },
  ],
  BUSINESS_SERVICES: [
    { value: 'ADMIN_AND_VIRTUAL_SUPPORT', label: 'Admin & Virtual Support' },
    { value: 'FINANCIAL_AND_LEGAL', label: 'Financial & Legal' },
    { value: 'STRATEGY_AND_CONSULTING', label: 'Strategy & Consulting' },
    { value: 'HR_AND_OPERATIONS', label: 'HR & Operations' },
  ],
  MARKETING_AND_SALES: [
    { value: 'DIGITAL_MARKETING', label: 'Digital Marketing' },
    { value: 'SOCIAL_MEDIA_MANAGEMENT', label: 'Social Media Management' },
    { value: 'CONTENT_AND_COPYWRITING', label: 'Content & Copywriting' },
    { value: 'SALES_AND_LEAD_GEN', label: 'Sales & Lead Gen' },
  ],
  DESIGN_AND_CREATIVE: [
    { value: 'VISUAL_IDENTITY_AND_BRANDING', label: 'Visual Identity & Branding' },
    { value: 'UI_UX_AND_WEB_DESIGN', label: 'UI/UX & Web Design' },
    { value: 'MOTION_AND_VIDEO', label: 'Motion & Video' },
    { value: 'ILLUSTRATION_AND_PRINT', label: 'Illustration & Print' },
  ],
};

export default function ProviderOrganizationsPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(false);
  const imageBlobUrlRef = useRef<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const [formData, setFormData] = useState({
    organizationName: '',
    organizationDescription: '',
    organizationContactEmail: '',
    organizationCountry: '',
    organizationCategories: [] as string[],
    organizationSubCategories: [] as string[],
    organizationImage: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Auth / role gate (keep deps tight to avoid reruns that feel like "auto loops")
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
  }, [router, currentUser?.userRole]);

  // Cleanup "zombies" on unmount (timeouts + blob URLs)
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
        successTimeoutRef.current = null;
      }
      if (imageBlobUrlRef.current) {
        URL.revokeObjectURL(imageBlobUrlRef.current);
        imageBlobUrlRef.current = null;
      }
    };
  }, []);

  // Load organization data
  const { data: orgData, loading: orgLoading, refetch, error: orgError } = useQuery(GET_PROVIDER_ORGANIZATION, {
    skip: !isLoggedIn() || !mounted,
    fetchPolicy: 'network-only', // Always fetch fresh data from server
    errorPolicy: 'all',
    context: {
      headers: isLoggedIn() ? getHeaders() : {},
    },
  });

  // Update form data when organization data is loaded
  useEffect(() => {
    if (orgData?.getProviderOrganization) {
      const org = orgData.getProviderOrganization;
      const categories = Array.isArray(org.categoryId) ? org.categoryId : org.categoryId ? [org.categoryId] : [];
      const subCategories = Array.isArray(org.subCategory) ? org.subCategory : org.subCategory ? [org.subCategory] : [];
      
      // Always set image preview if organization has an image (unless user has selected a new file)
      if (org.organizationImage && !imageFile) {
        const fullImageUrl = getImageUrl(org.organizationImage);
        // Clean up any existing blob URL before setting a server URL
        if (imageBlobUrlRef.current) {
          URL.revokeObjectURL(imageBlobUrlRef.current);
          imageBlobUrlRef.current = null;
        }
        setImagePreview((prev) => (prev === fullImageUrl ? prev : fullImageUrl));
      } else if (!org.organizationImage && !imageFile && !isEditMode) {
        // Only clear preview if there's no image file selected, no org image, and not in edit mode
        if (imageBlobUrlRef.current) {
          URL.revokeObjectURL(imageBlobUrlRef.current);
          imageBlobUrlRef.current = null;
        }
        setImagePreview('');
      }
      
      // Only update form data if not in edit mode to avoid overwriting user input
      if (!isEditMode) {
        setFormData((prev) => ({
          ...prev,
          organizationName: org.organizationName || '',
          organizationDescription: org.organizationDescription || '',
          organizationContactEmail: org.organizationContactEmail || '',
          organizationCountry: org.organizationCountry || '',
          organizationCategories: categories,
          organizationSubCategories: subCategories,
          organizationImage: org.organizationImage || '',
        }));
        // Clear imageFile when exiting edit mode
        setImageFile(null);
        if (categories.length > 0) {
          setSelectedCategory(categories[0]);
        }
      }
    } else if (orgData && !orgData.getProviderOrganization) {
      // If no organization exists and not in edit mode, clear image preview
      if (!isEditMode && !imageFile) {
        if (imageBlobUrlRef.current) {
          URL.revokeObjectURL(imageBlobUrlRef.current);
          imageBlobUrlRef.current = null;
        }
        setImagePreview('');
      }
    }
  }, [orgData, isEditMode, imageFile]);

  // Log errors
  useEffect(() => {
    if (orgError) {
      console.error('Error loading organization:', orgError);
    }
  }, [orgError]);

  // More robust check: organization exists only if we have a valid _id
  const organizationExists = Boolean(
    orgData?.getProviderOrganization?._id && 
    typeof orgData.getProviderOrganization._id === 'string' && 
    orgData.getProviderOrganization._id.trim().length > 0
  );
  
  // Auto-enable edit mode if no organization exists and data has loaded
  useEffect(() => {
    if (!orgLoading && orgData !== undefined && !organizationExists && !isEditMode) {
      setIsEditMode(true);
    }
  }, [orgLoading, orgData, organizationExists, isEditMode]);

  const flashSuccess = () => {
    if (!isMountedRef.current) return;
    setShowSuccessMessage(true);
    if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    successTimeoutRef.current = setTimeout(() => {
      if (!isMountedRef.current) return;
      setShowSuccessMessage(false);
    }, 3000);
  };

  const [createOrg, { loading: isCreating }] = useMutation(CREATE_PROVIDER_ORG_PROF, {
    context: {
      headers: isLoggedIn() ? getHeaders() : {},
    },
    refetchQueries: [{ query: GET_PROVIDER_ORGANIZATION }],
    awaitRefetchQueries: true,
    onCompleted: async (data) => {
      if (!isMountedRef.current) return;
      setIsEditMode(false);
      flashSuccess();
    },
    onError: (error) => {
      console.error('Error creating organization:', error);
      const errorMessage = error?.graphQLErrors?.[0]?.message || error?.message || 'Failed to create organization. Please try again.';
      alert(errorMessage);
    },
  });

  const [updateOrg, { loading: isUpdating }] = useMutation(UPDATE_PROVIDER_ORG_PROF, {
    context: {
      headers: isLoggedIn() ? getHeaders() : {},
    },
    refetchQueries: [{ query: GET_PROVIDER_ORGANIZATION }],
    awaitRefetchQueries: true,
    onCompleted: async (data) => {
      if (!isMountedRef.current) return;
      setIsEditMode(false);
      flashSuccess();
    },
    onError: (error) => {
      console.error('Error updating organization:', error);
      const errorMessage = error?.graphQLErrors?.[0]?.message || error?.message || 'Failed to update organization. Please try again.';
      alert(errorMessage);
    },
  });

  const isSaving = isCreating || isUpdating;

  const handleInputChange = (field: string, value: string | string[]) => {
    if (!isEditMode) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryToggle = (category: string) => {
    if (!isEditMode) return;
    const currentCategories = formData.organizationCategories;
    if (currentCategories.includes(category)) {
      handleInputChange('organizationCategories', currentCategories.filter((c) => c !== category));
      // Remove subcategories for this category
      const subCatsToRemove = SUBCATEGORIES[category]?.map((sc) => sc.value) || [];
      handleInputChange('organizationSubCategories', 
        formData.organizationSubCategories.filter((sc) => !subCatsToRemove.includes(sc))
      );
      if (selectedCategory === category) {
        setSelectedCategory('');
      }
    } else {
      handleInputChange('organizationCategories', [...currentCategories, category]);
      if (!selectedCategory) {
        setSelectedCategory(category);
      }
    }
  };

  const handleSubCategoryToggle = (subCategory: string) => {
    if (!isEditMode) return;
    const currentSubCategories = formData.organizationSubCategories;
    if (currentSubCategories.includes(subCategory)) {
      handleInputChange('organizationSubCategories', currentSubCategories.filter((sc) => sc !== subCategory));
    } else {
      handleInputChange('organizationSubCategories', [...currentSubCategories, subCategory]);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (imageBlobUrlRef.current) {
      URL.revokeObjectURL(imageBlobUrlRef.current);
      imageBlobUrlRef.current = null;
    }
    setImageFile(image);
    const previewUrl = URL.createObjectURL(image);
    imageBlobUrlRef.current = previewUrl;
    setImagePreview(previewUrl);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Helper function to convert relative image paths to full URLs
  const getImageUrl = (imagePath: string | null | undefined): string => {
    if (!imagePath) return '';
    // If it's already a full URL (starts with http:// or https://), return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // If it's a relative path, prepend the base URL
    const apiUrl = process.env.NEXT_PUBLIC_API_GRAPHQL_URL || process.env.REACT_APP_API_GRAPHQL_URL || 'http://localhost:3010/graphql';
    const baseUrl = apiUrl.replace('/graphql', '');
    // Remove leading slash from imagePath if present to avoid double slashes
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${baseUrl}/${cleanPath}`;
  };

  const uploadImageToBackend = async (file: File): Promise<string> => {
    const formDataObj = new FormData();
    const token = getJwtToken();
    const apiUrl = process.env.NEXT_PUBLIC_API_GRAPHQL_URL || process.env.REACT_APP_API_GRAPHQL_URL || 'http://localhost:3010/graphql';
    formDataObj.append('operations', JSON.stringify({
      query: `mutation UploadOrganizationImage($file: Upload!, $target: String!) {
        imageUploader(file: $file, target: $target)
      }`,
      variables: { file: null, target: 'organization' }
    }));
    formDataObj.append('map', JSON.stringify({ '0': ['variables.file'] }));
    formDataObj.append('0', file);
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'apollo-require-preflight': 'true',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formDataObj,
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

  const handleSave = async () => {
    if (!formData.organizationName.trim()) {
      alert('Please fill in the organization name (required).');
      return;
    }

    try {
      // Upload image first if a new image was selected
      let imageUrl = formData.organizationImage;
      if (imageFile) {
        if (isMountedRef.current) setIsUploadingImage(true);
        try {
          imageUrl = await uploadImageToBackend(imageFile);
          // Update formData with the new image URL
          if (isMountedRef.current) setFormData((prev) => ({ ...prev, organizationImage: imageUrl }));
          // Update preview to show the uploaded image URL (not blob)
          if (imageBlobUrlRef.current) {
            URL.revokeObjectURL(imageBlobUrlRef.current);
            imageBlobUrlRef.current = null;
          }
          if (isMountedRef.current) setImagePreview(imageUrl);
          // Clear the file since it's now uploaded
          if (isMountedRef.current) setImageFile(null);
        } catch (error: any) {
          console.error('Error uploading image:', error);
          alert(`Failed to upload image: ${error.message || 'Please try again'}`);
          if (isMountedRef.current) setIsUploadingImage(false);
          return;
        } finally {
          if (isMountedRef.current) setIsUploadingImage(false);
        }
      }

      if (organizationExists) {
        const updateInput: any = {
          organizationId: orgData.getProviderOrganization._id,
          organizationName: formData.organizationName.trim(),
        };

        if (formData.organizationDescription.trim()) {
          updateInput.organizationDescription = formData.organizationDescription.trim();
        }
        if (formData.organizationContactEmail.trim()) {
          updateInput.organizationContactEmail = formData.organizationContactEmail.trim();
        }
        if (formData.organizationCountry.trim()) {
          updateInput.organizationCountry = formData.organizationCountry.trim();
        }
        if (formData.organizationCategories.length > 0) {
          updateInput.organizationCategories = formData.organizationCategories;
        }
        if (formData.organizationSubCategories.length > 0) {
          updateInput.organizationSubCategories = formData.organizationSubCategories;
        }
        if (imageUrl) {
          updateInput.organizationImage = imageUrl;
        }

        await updateOrg({
          variables: { input: updateInput },
        });
      } else {
        const createInput: any = {
          organizationName: formData.organizationName.trim(),
        };

        if (formData.organizationDescription.trim()) {
          createInput.organizationDescription = formData.organizationDescription.trim();
        }
        if (formData.organizationContactEmail.trim()) {
          createInput.organizationContactEmail = formData.organizationContactEmail.trim();
        }
        if (formData.organizationCountry.trim()) {
          createInput.organizationCountry = formData.organizationCountry.trim();
        }
        if (formData.organizationCategories.length > 0) {
          createInput.organizationCategories = formData.organizationCategories;
        }
        if (formData.organizationSubCategories.length > 0) {
          createInput.organizationSubCategories = formData.organizationSubCategories;
        }
        if (imageUrl) {
          createInput.organizationImage = imageUrl;
        }

        await createOrg({
          variables: { input: createInput },
        });
      }
    } catch (error) {
      // Error handled in onError callback
    }
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

  const userName = currentUser?.userNick || 'Provider';

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-900 overflow-hidden antialiased">
      {/* Sidebar */}
      <ProviderSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <ProviderHeader title="Organizations" />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Loading State */}
            {orgLoading && !orgData && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center">
                <p className="text-slate-600 dark:text-slate-400">Loading organization data...</p>
              </div>
            )}

            {showSuccessMessage && (
              <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
                <div className="bg-emerald-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
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

            {/* Top card: Organization profile shared pattern */}
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8">
              <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Organization Profile</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {organizationExists 
                    ? 'Update how clients see your provider organization in the marketplace.'
                    : 'Create your provider organization profile to get started.'}
                </p>
              </div>
                <div className="flex items-center gap-2">
                  {!orgLoading && organizationExists ? (
                    <button
                      onClick={() => router.push('/provider/settings')}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-[var(--primary)] hover:bg-indigo-50 dark:hover:bg-slate-800 border border-indigo-200 dark:border-slate-700 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">edit</span>
                      Edit
                    </button>
                  ) : !orgLoading && !organizationExists ? (
                    !isEditMode ? (
                      <button
                        onClick={() => setIsEditMode(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-[var(--primary)] hover:bg-indigo-50 dark:hover:bg-slate-800 border border-indigo-200 dark:border-slate-700 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">add</span>
                        Create Organization
                      </button>
                    ) : null
                  ) : null}
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
              </div>

            <div className="flex items-start gap-8">
              {/* Logo */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  {(imagePreview || formData.organizationImage) ? (
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-lg">
                      <img 
                        src={imagePreview || getImageUrl(formData.organizationImage)} 
                        alt="Organization Logo" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Image failed to load:', imagePreview || formData.organizationImage);
                          // Fallback to initials if image fails to load
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      {isUploadingImage && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="material-symbols-outlined text-white animate-spin">sync</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-200">
                      {formData.organizationName
                        ? formData.organizationName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)
                        : userName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2) || 'PR'}
                    </div>
                  )}
                </div>
                {isEditMode && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      hidden
                      id="organization-logo-input"
                      onChange={handleImageSelect}
                      accept="image/jpg, image/jpeg, image/png"
                      disabled={isUploadingImage}
                    />
                    <label
                      htmlFor="organization-logo-input"
                      className={`text-xs font-bold text-[var(--primary)] hover:underline cursor-pointer ${isUploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {imageFile ? 'Change Logo' : imagePreview ? 'Change Logo' : 'Upload Logo'}
                    </label>
                  </>
                )}
              </div>

              {/* Fields – provider flavored */}
              <div className="flex-1 grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Organization Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.organizationName}
                    onChange={(e) => handleInputChange('organizationName', e.target.value)}
                    placeholder="Tech Solutions Inc"
                    disabled={!isEditMode}
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 dark:bg-slate-900/40 disabled:bg-white dark:disabled:bg-slate-900 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.organizationContactEmail}
                    onChange={(e) => handleInputChange('organizationContactEmail', e.target.value)}
                    placeholder="contact@example.com"
                    disabled={!isEditMode}
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 dark:bg-slate-900/40 disabled:bg-white dark:disabled:bg-slate-900 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.organizationCountry}
                    onChange={(e) => handleInputChange('organizationCountry', e.target.value)}
                    placeholder="USA"
                    disabled={!isEditMode}
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 dark:bg-slate-900/40 disabled:bg-white dark:disabled:bg-slate-900 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Organization Description
                  </label>
                  <textarea
                    rows={6}
                    value={formData.organizationDescription}
                    onChange={(e) => handleInputChange('organizationDescription', e.target.value)}
                    placeholder="Describe your organization, services, and expertise..."
                    disabled={!isEditMode}
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 dark:bg-slate-900/40 resize-y disabled:bg-white dark:disabled:bg-slate-900 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </section>

            {/* Categories and Subcategories Section */}
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Categories & Subcategories</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Select your organization's specialties to help buyers find you.
              </p>

              <div className="space-y-6">
                {/* Categories Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                    Categories
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => handleCategoryToggle(cat.value)}
                        disabled={!isEditMode}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          formData.organizationCategories.includes(cat.value)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        } ${!isEditMode ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subcategories - Show for all selected categories */}
                {formData.organizationCategories.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                      Subcategories
                    </label>
                    {formData.organizationCategories.map((category) => {
                      const subCats = SUBCATEGORIES[category];
                      if (!subCats || subCats.length === 0) return null;
                      
                      return (
                        <div key={category} className="mb-4">
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            {CATEGORIES.find((c) => c.value === category)?.label}
                          </p>
                          <div className="flex flex-wrap gap-3">
                            {subCats.map((subCat) => (
                              <button
                                key={subCat.value}
                                type="button"
                                onClick={() => handleSubCategoryToggle(subCat.value)}
                                disabled={!isEditMode}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                  formData.organizationSubCategories.includes(subCat.value)
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                } ${!isEditMode ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                              >
                                {subCat.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                      Select subcategories for each category you've chosen. You can select multiple subcategories.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {isEditMode && (
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={isSaving || isUploadingImage || orgLoading || !formData.organizationName.trim()}
                  className="bg-[var(--primary)] hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm flex items-center gap-2"
                >
                  {isSaving || isUploadingImage ? (
                    <>
                      <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                      {isUploadingImage ? 'Uploading Image...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">save</span>
                      {organizationExists ? 'Save Changes' : 'Create Organization'}
                    </>
                  )}
                </button>
              </div>
            )}

          {/* Footer - Matching Buyer Dashboard Style */}
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
            <button 
              onClick={() => router.push('/provider/help-support')}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
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

