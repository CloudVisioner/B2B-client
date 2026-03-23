import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar, useMutation, useQuery } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { isLoggedIn, getJwtToken, updateUserInfo, decodeJWT } from '../../libs/auth';
import { ProviderSidebar } from '../../libs/components/dashboard/ProviderSidebar';
import { ProviderHeader } from '../../libs/components/dashboard/ProviderHeader';
import { CREATE_PROVIDER_ORG_PROF, UPDATE_PROVIDER_ORG_PROF, UPDATE_PROVIDER_PROFILE, UPDATE_MY_PROFILE, CHANGE_MY_PASSWORD } from '../../apollo/user/mutation';
import { GET_PROVIDER_ORGANIZATION, GET_MY_PROFILE_SELF } from '../../apollo/user/query';
import { getHeaders } from '../../apollo/utils';
import { mapCategoryToBackend, mapSubCategoryToBackend } from '../../libs/utils/providerMapper';
import {
  clampUserDescription,
  clampUserNick,
  getUserNickValidationError,
  PROFILE_USER_DESCRIPTION_MAX,
  PROFILE_USER_NICK_MAX,
} from '../../libs/utils';

/* ═══════════════════════════════════════════════════════════
   Tab definitions
   ═══════════════════════════════════════════════════════════ */
const TABS = [
  { id: 'organization', label: 'Organization', icon: 'business' },
  { id: 'profile', label: 'Profile', icon: 'person' },
  { id: 'billing', label: 'Billing', icon: 'credit_card' },
] as const;

type TabId = (typeof TABS)[number]['id'];

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

/* ═══════════════════════════════════════════════════════════
   Organization Tab
   ═══════════════════════════════════════════════════════════ */
function OrganizationTab() {
  // ========== HOOKS & STATE ==========
  const router = useRouter();
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationDescription: '',
    organizationContactEmail: '',
    organizationCountry: '',
    startingBudget: '',
    organizationCategories: [] as string[],
    organizationSubCategories: [] as string[],
    organizationImage: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const imageBlobUrlRef = useRef<string | null>(null);

  // ========== APOLLO REQUESTS ==========
  const { data: orgData, loading: orgLoading, refetch, error: orgError } = useQuery(GET_PROVIDER_ORGANIZATION, {
    skip: !isLoggedIn(),
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
    context: {
      headers: isLoggedIn() ? getHeaders() : {},
    },
  });

  const organizationExists = orgData?.getProviderOrganization?._id;

  const [createOrg, { loading: isCreating }] = useMutation(CREATE_PROVIDER_ORG_PROF, {
    context: {
      headers: isLoggedIn() ? getHeaders() : {},
    },
    refetchQueries: [
      {
        query: GET_PROVIDER_ORGANIZATION,
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      setShowSuccessMessage(true);
      setIsEditMode(false);
      setIsCreated(true);
      refetch();
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = setTimeout(() => setShowSuccessMessage(false), 3000);
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
    refetchQueries: [
      {
        query: GET_PROVIDER_ORGANIZATION,
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      setShowSuccessMessage(true);
      setIsEditMode(false);
      setIsCreated(false);
      refetch();
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = setTimeout(() => setShowSuccessMessage(false), 3000);
    },
    onError: (error) => {
      console.error('Error updating organization:', error);
      const errorMessage = error?.graphQLErrors?.[0]?.message || error?.message || 'Failed to update organization. Please try again.';
      alert(errorMessage);
    },
  });

  const isSaving = isCreating || isUpdating;

  // ========== LIFECYCLES ==========
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

  // ========== LIFECYCLES ==========
  useEffect(() => {
    if (orgData?.getProviderOrganization) {
      const org = orgData.getProviderOrganization;
      const categories =
        Array.isArray(org.organizationCategories) && org.organizationCategories.length > 0
          ? [...org.organizationCategories]
          : Array.isArray(org.categoryId)
            ? org.categoryId
            : org.categoryId
              ? [org.categoryId]
              : [];
      const subCategories =
        Array.isArray(org.organizationSubCategories) && org.organizationSubCategories.length > 0
          ? [...org.organizationSubCategories]
          : Array.isArray(org.subCategory)
            ? org.subCategory
            : org.subCategory
              ? [org.subCategory]
              : [];
      
      // Always set image preview if organization has an image (unless user has selected a new file)
      if (org.organizationImage && !imageFile) {
        // Clean up any existing blob URL before setting a server URL
        if (imageBlobUrlRef.current) {
          URL.revokeObjectURL(imageBlobUrlRef.current);
          imageBlobUrlRef.current = null;
        }
        const fullImageUrl = getImageUrl(org.organizationImage);
        // Always update imagePreview when org data loads, even if it's the same
        setImagePreview(fullImageUrl);
      } else if (!org.organizationImage && !imageFile) {
        // Clear preview if there's no image file selected and no org image
        if (imageBlobUrlRef.current) {
          URL.revokeObjectURL(imageBlobUrlRef.current);
          imageBlobUrlRef.current = null;
        }
        setImagePreview('');
      }
      
      // Always update form data when organization data loads (but preserve user input in edit mode)
      // Get budget value - check multiple possible field names
      const budgetValue = org.budgetRange || org.minProjectSize || (org as any).startingBudget || '';
      
      // Always update form data when organization data loads
      // This ensures all fields including image are populated on page reload
      setFormData((prev) => {
        // Only preserve user input if in edit mode AND form already has data
        if (isEditMode && prev.organizationName) {
          return {
            ...prev,
            // Still update image and budget even in edit mode if they're empty
            organizationImage: org.organizationImage || prev.organizationImage || '',
            startingBudget: prev.startingBudget || (budgetValue ? String(budgetValue) : ''),
          };
        }
        // Otherwise, update all fields with fresh data
        return {
          organizationName: org.organizationName || '',
          organizationDescription: org.organizationDescription || '',
          organizationContactEmail: org.organizationContactEmail || '',
          organizationCountry: org.organizationCountry || '',
          startingBudget: budgetValue ? String(budgetValue) : '',
          organizationCategories: categories,
          organizationSubCategories: subCategories,
          organizationImage: org.organizationImage || '',
        };
      });
      
      // Clear imageFile when exiting edit mode
      if (!isEditMode) {
        setImageFile(null);
      }
      
      if (categories.length > 0 && !selectedCategory) {
        setSelectedCategory(categories[0]);
      }
    } else if (orgData && !orgData.getProviderOrganization) {
      // If no organization exists and not in edit mode, clear image preview
      if (!isEditMode && !imageFile) {
        setImagePreview('');
      }
    }
  }, [orgData, isEditMode, imageFile]);

  useEffect(() => {
    if (orgError) {
      console.error('Error loading organization:', orgError);
    }
  }, [orgError]);

  // ========== HANDLERS ==========
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
    // Clean up previous blob URL if exists
    if (imageBlobUrlRef.current) {
      URL.revokeObjectURL(imageBlobUrlRef.current);
    }
    setImageFile(image);
    const previewUrl = URL.createObjectURL(image);
    imageBlobUrlRef.current = previewUrl;
    setImagePreview(previewUrl);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ========== UTILITIES ==========
  const getImageUrl = (imagePath: string | null | undefined): string => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_GRAPHQL_URL || process.env.REACT_APP_API_GRAPHQL_URL || 'http://localhost:4001/graphql';
    const baseUrl = apiUrl.replace('/graphql', '');
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${baseUrl}/${cleanPath}`;
  };

  const uploadImageToBackend = async (file: File): Promise<string> => {
    const formDataObj = new FormData();
    const token = getJwtToken();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_GRAPHQL_URL || process.env.REACT_APP_API_GRAPHQL_URL || 'http://localhost:4001/graphql';
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
        setIsUploadingImage(true);
        try {
          imageUrl = await uploadImageToBackend(imageFile);
          // Update formData with the new image URL
          setFormData((prev) => ({ ...prev, organizationImage: imageUrl }));
          // Update preview to show the uploaded image URL (not blob)
          setImagePreview(imageUrl);
          // Clear the file since it's now uploaded
          setImageFile(null);
        } catch (error: any) {
          console.error('Error uploading image:', error);
          alert(`Failed to upload image: ${error.message || 'Please try again'}`);
          setIsUploadingImage(false);
          return;
        } finally {
          setIsUploadingImage(false);
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
        if (formData.startingBudget.trim()) {
          const budgetValue = parseFloat(formData.startingBudget.trim());
          if (!isNaN(budgetValue) && budgetValue > 0) {
            // Use budgetRange instead of minProjectSize as backend expects budgetRange
            // Convert to string as GraphQL schema expects String type
            updateInput.budgetRange = String(budgetValue);
          }
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
        if (formData.startingBudget.trim()) {
          const budgetValue = parseFloat(formData.startingBudget.trim());
          if (!isNaN(budgetValue) && budgetValue > 0) {
            // Use budgetRange instead of minProjectSize as backend expects budgetRange
            // Convert to string as GraphQL schema expects String type
            createInput.budgetRange = String(budgetValue);
          }
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

  // ========== CONDITIONAL RENDERING ==========
  if (!organizationExists && !isEditMode) {
    return (
      <div className="space-y-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">You haven't created your provider organization yet.</p>
          <button
            onClick={() => setIsEditMode(true)}
            className="bg-[var(--primary)] hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all"
          >
            Create Organization
          </button>
        </div>
      </div>
    );
  }

  // ========== RENDER ==========
  return (
    <div className="space-y-8">
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
          <div className="bg-emerald-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <div>
              <p className="font-bold text-sm">Success!</p>
              <p className="text-xs text-emerald-50">
                {isCreated ? 'Organization created successfully' : 'Organization updated successfully'}
              </p>
            </div>
            <button onClick={() => setShowSuccessMessage(false)} className="ml-auto text-white/80 hover:text-white">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>
      )}

      {/* First Card: Organization Profile */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Organization Profile</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage your provider organization</p>
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
          {/* Logo */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {(imagePreview || formData.organizationImage) ? (
                <div className="relative h-24 w-24 overflow-hidden rounded-2xl border-2 border-slate-200 bg-slate-100 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  <img 
                    src={imagePreview || (formData.organizationImage ? getImageUrl(formData.organizationImage) : '')} 
                    alt="Organization Logo" 
                    className="block h-full w-full min-h-0 object-cover object-center"
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
                    : 'OR'}
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

          {/* Fields */}
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
                className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 dark:bg-slate-900/40 disabled:bg-white dark:disabled:bg-slate-900 disabled:cursor-not-allowed"
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
                className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 dark:bg-slate-900/40 disabled:bg-white dark:disabled:bg-slate-900 disabled:cursor-not-allowed"
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
                className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 dark:bg-slate-900/40 disabled:bg-white dark:disabled:bg-slate-900 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Starting Budget
              </label>
              <input
                type="number"
                value={formData.startingBudget}
                onChange={(e) => handleInputChange('startingBudget', e.target.value)}
                placeholder="1000"
                disabled={!isEditMode}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 dark:bg-slate-900/40 disabled:bg-white dark:disabled:bg-slate-900 disabled:cursor-not-allowed"
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
                className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-white focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 dark:bg-slate-900/40 resize-y disabled:bg-white dark:disabled:bg-slate-900 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Second Card: Categories & Subcategories */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8">
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
      </div>

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
                Save Changes
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Profile Tab
   ═══════════════════════════════════════════════════════════ */
function ProfileTab() {
  // ========== HOOKS & STATE ==========
  const currentUser = useReactiveVar(userVar);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const passwordTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const imageBlobUrlRef = useRef<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  
  const [formData, setFormData] = useState({
    providerFullName: '',
    providerDisplayName: '',
    providerEmail: '',
    providerPhone: '',
    userImage: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // ========== UTILITIES ==========
  const getUserIdFromToken = (): string | null => {
    const token = getJwtToken();
    if (token) {
      try {
        const claims = decodeJWT(token);
        return claims?._id || claims?.userId || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const userIdFromVar = currentUser?._id && currentUser._id.trim() && currentUser._id.length === 24 ? currentUser._id : null;
  const userIdFromToken = getUserIdFromToken();
  const validUserId = userIdFromVar || (userIdFromToken && userIdFromToken.trim() && userIdFromToken.length === 24 ? userIdFromToken : null);

  // Helper function to convert relative image paths to full URLs
  const getImageUrl = (imagePath: string | null | undefined): string => {
    if (!imagePath) return '';
    // If it's already a full URL (starts with http:// or https://), return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // If it's a relative path, prepend the base URL (same logic as ProviderHeader)
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_API_GRAPHQL_URL ||
      process.env.REACT_APP_API_GRAPHQL_URL ||
      'http://localhost:3010/graphql';
    const baseUrl = apiUrl.replace('/graphql', '');
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${baseUrl}/${cleanPath}`;
  };
  
  // ========== APOLLO REQUESTS ==========
  const { data: profileData, loading: profileLoading, refetch: refetchProfile } = useQuery(GET_MY_PROFILE_SELF, {
    skip: !isLoggedIn(),
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    context: {
      headers: isLoggedIn() ? getHeaders() : {},
    },
    notifyOnNetworkStatusChange: false,
    onCompleted: (data) => {
      if (data?.getMyProfile && !isEditMode && !imageFile) {
        const user = data.getMyProfile;
        setFormData({
          providerFullName: clampUserDescription(user.userDescription || ''),
          providerDisplayName: clampUserNick(user.userNick || ''),
          providerEmail: user.userEmail || '',
          providerPhone: user.userPhone || '',
          userImage: user.userImage || '',
        });
        if (user.userImage) {
          if (imageBlobUrlRef.current) {
            URL.revokeObjectURL(imageBlobUrlRef.current);
            imageBlobUrlRef.current = null;
          }
          setImagePreview(getImageUrl(user.userImage));
        } else {
          setImagePreview('');
        }
      }
    },
  });

  const [updateProviderProfileMutation, { loading: isUpdatingProfile }] = useMutation(UPDATE_PROVIDER_PROFILE, {
    context: {
      headers: isLoggedIn() ? getHeaders() : {},
    },
    refetchQueries: [{ query: GET_MY_PROFILE_SELF }],
    awaitRefetchQueries: true,
    onError: (error: any) => {
      console.error('Error updating provider profile:', error);
      const errorMessage =
        error?.graphQLErrors?.[0]?.message || error?.message || 'Failed to update profile. Please try again.';
      alert(errorMessage);
    },
  });

  /** Avatar URL only — UpdateProviderProfileInput does not include image in this schema. */
  const [updateUserMutation] = useMutation(UPDATE_MY_PROFILE, {
    context: {
      headers: isLoggedIn() ? getHeaders() : {},
    },
    refetchQueries: [{ query: GET_MY_PROFILE_SELF }],
    awaitRefetchQueries: true,
    onError: (error: any) => {
      console.error('Error updating profile image:', error);
      const errorMessage =
        error?.graphQLErrors?.[0]?.message || error?.message || 'Failed to update profile photo.';
      alert(errorMessage);
    },
  });

  const [changePassword, { loading: isChangingPassword }] = useMutation(CHANGE_MY_PASSWORD, {
    context: {
      headers: isLoggedIn() ? getHeaders() : {},
    },
    onCompleted: () => {
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordSection(false);
      alert('Password changed successfully!');
    },
    onError: (error) => {
      console.error('Error changing password:', error);
      const errorMessage = error?.graphQLErrors?.[0]?.message || error?.message || 'Failed to change password. Please try again.';
      alert(errorMessage);
    },
  });

  // ========== LIFECYCLES ==========
  useEffect(() => {
    return () => {
      if (passwordTimeoutRef.current) {
        clearTimeout(passwordTimeoutRef.current);
        passwordTimeoutRef.current = null;
      }
      if (imageBlobUrlRef.current) {
        URL.revokeObjectURL(imageBlobUrlRef.current);
        imageBlobUrlRef.current = null;
      }
    };
  }, []);

  // ========== HANDLERS ==========
  const handleInputChange = (field: string, value: string) => {
    if (!isEditMode) return;
    let next = value;
    if (field === 'providerDisplayName') next = value.slice(0, PROFILE_USER_NICK_MAX);
    if (field === 'providerFullName') next = value.slice(0, PROFILE_USER_DESCRIPTION_MAX);
    setFormData((prev) => ({ ...prev, [field]: next }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
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
    // Clean up previous blob URL if exists
    if (imageBlobUrlRef.current) {
      URL.revokeObjectURL(imageBlobUrlRef.current);
    }
    setImageFile(image);
    const previewUrl = URL.createObjectURL(image);
    imageBlobUrlRef.current = previewUrl;
    setImagePreview(previewUrl);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImageToBackend = async (file: File): Promise<string> => {
    const formData = new FormData();
    const token = getJwtToken();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_GRAPHQL_URL || process.env.REACT_APP_API_GRAPHQL_URL || 'http://localhost:4001/graphql';
    formData.append('operations', JSON.stringify({
      query: `mutation UploadProfileImage($file: Upload!, $target: String!) {
        imageUploader(file: $file, target: $target)
      }`,
      variables: { file: null, target: 'user' }
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

  const getInitials = (name: string) => {
    if (!name) return 'P';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'P';
  };

  const handleSave = async () => {
    if (!formData.providerDisplayName || !formData.providerEmail) {
      alert('Please fill in all required fields (Display Name, Email).');
      return;
    }

    const nickErr = getUserNickValidationError(formData.providerDisplayName);
    if (nickErr) {
      alert(nickErr);
      return;
    }

    try {
      let imageUrl = formData.userImage;
      if (imageFile) {
        setIsUploadingImage(true);
        try {
          imageUrl = await uploadImageToBackend(imageFile);
        } catch (error: any) {
          console.error('Error uploading image:', error);
          alert(`Failed to upload image: ${error.message || 'Please try again'}`);
          setIsUploadingImage(false);
          return;
        } finally {
          setIsUploadingImage(false);
        }
      }

      const userIdToSave =
        profileData?.getMyProfile?._id || currentUser?._id || validUserId || getUserIdFromToken();

      if (!userIdToSave) {
        alert('User ID not found. Please refresh the page and try again.');
        return;
      }

      const nick = clampUserNick(formData.providerDisplayName);
      const bio = clampUserDescription(formData.providerFullName);

      const providerInput: {
        providerDisplayName: string;
        providerEmail: string;
        providerFullName?: string;
        providerPhone?: string;
      } = {
        providerDisplayName: nick,
        providerEmail: formData.providerEmail.trim(),
      };
      if (bio.length > 0) {
        providerInput.providerFullName = bio;
      }
      const phone = formData.providerPhone.trim();
      if (phone) {
        providerInput.providerPhone = phone;
      }

      const { data: profResult } = await updateProviderProfileMutation({
        variables: { input: providerInput },
      });

      const updated = profResult?.updateProviderProfile;
      if (updated) {
        const currentUserData = userVar();
        userVar({
          ...currentUserData,
          userNick: updated.userNick ?? currentUserData.userNick,
          userEmail: updated.userEmail ?? currentUserData.userEmail,
          userPhone: updated.userPhone ?? currentUserData.userPhone,
          userDescription: updated.userDescription ?? currentUserData.userDescription,
        });
      }

      const prevImage = profileData?.getMyProfile?.userImage;
      const normalizedNew =
        imageUrl && !String(imageUrl).startsWith('data:') ? imageUrl : '';
      const imageDirty = !!imageFile || (normalizedNew && normalizedNew !== prevImage);

      if (imageDirty && normalizedNew && userIdToSave) {
        const { data: imgResult } = await updateUserMutation({
          variables: {
            input: {
              _id: userIdToSave,
              userImage: normalizedNew,
            },
          },
        });
        const imgUser = imgResult?.updateUser;
        if (imgUser?.userImage) {
          const cur = userVar();
          userVar({ ...cur, userImage: imgUser.userImage });
        }
        if (imgUser?.accessToken) {
          updateUserInfo(imgUser.accessToken);
        }
      }

      setFormData((prev) => ({ ...prev, userImage: normalizedNew || prev.userImage }));
      setShowSuccessMessage(true);
      setIsEditMode(false);
      setImageFile(null);
      await refetchProfile();

      if (passwordTimeoutRef.current) clearTimeout(passwordTimeoutRef.current);
      passwordTimeoutRef.current = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Profile save failed:', error);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Please fill in all password fields.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    await changePassword({
      variables: {
        input: {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
      },
    });
  };

  return (
    <div className="space-y-8">
            {showSuccessMessage && (
              <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
                <div className="bg-emerald-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <div>
                    <p className="font-bold text-sm">Success!</p>
              <p className="text-xs text-emerald-50">Profile updated successfully</p>
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
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Profile Information</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage your personal information</p>
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
                refetchProfile();
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
              {imagePreview ? (
                <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="block h-full w-full min-h-0 object-cover object-center"
                  />
                  {isUploadingImage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <span className="material-symbols-outlined animate-spin text-white">sync</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-200" style={{ display: 'flex' }}>
                  {getInitials(formData.providerFullName || formData.providerDisplayName || 'Provider')}
                      </div>
                    )}
                  </div>
                  {isEditMode && (
                    <>
                <input ref={fileInputRef} type="file" hidden id="profile-image-input" onChange={handleImageSelect} accept="image/jpg, image/jpeg, image/png" disabled={isUploadingImage} />
                <label htmlFor="profile-image-input" className={`text-xs font-bold text-[var(--primary)] hover:underline cursor-pointer ${isUploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {imageFile ? 'Change Photo' : imagePreview ? 'Change Photo' : 'Upload Photo'}
                      </label>
                    </>
                  )}
                </div>

                <div className="flex-1 grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Full Name
                    </label>
                    <input
                      type="text"
                value={formData.providerFullName}
                onChange={(e) => handleInputChange('providerFullName', e.target.value)}
                placeholder="John Doe"
                maxLength={PROFILE_USER_DESCRIPTION_MAX}
                      disabled={!isEditMode}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 dark:bg-slate-900/40 disabled:bg-white dark:disabled:bg-slate-900 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Display Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                value={formData.providerDisplayName}
                onChange={(e) => handleInputChange('providerDisplayName', e.target.value)}
                placeholder="johndoe"
                maxLength={PROFILE_USER_NICK_MAX}
                      disabled={!isEditMode}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 dark:bg-slate-900/40 disabled:bg-white dark:disabled:bg-slate-900 disabled:cursor-not-allowed"
                    />
                  </div>
            <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Email <span className="text-red-400">*</span>
                    </label>
                    <input
                type="email"
                value={formData.providerEmail}
                onChange={(e) => handleInputChange('providerEmail', e.target.value)}
                placeholder="john@example.com"
                      disabled={!isEditMode}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 dark:bg-slate-900/40 disabled:bg-white dark:disabled:bg-slate-900 disabled:cursor-not-allowed"
                    />
                  </div>
            <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Phone
                    </label>
              <input
                type="tel"
                value={formData.providerPhone}
                onChange={(e) => handleInputChange('providerPhone', e.target.value)}
                placeholder="+1234567890"
                      disabled={!isEditMode}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 dark:bg-slate-900/40 disabled:bg-white dark:disabled:bg-slate-900 disabled:cursor-not-allowed"
                    />
                  </div>
          </div>
        </div>
      </div>

      {/* Password Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Password</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Change your account password</p>
          </div>
          <button
            onClick={() => setShowPasswordSection(!showPasswordSection)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-[var(--primary)] hover:bg-indigo-50 dark:hover:bg-slate-800 border border-indigo-200 dark:border-slate-700 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">{showPasswordSection ? 'visibility_off' : 'edit'}</span>
            {showPasswordSection ? 'Cancel' : 'Change Password'}
                            </button>
                    </div>

        {showPasswordSection && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Current Password
              </label>
              <div className="relative">
                        <input
                  type={showPasswords ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  placeholder="Enter current password"
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 dark:bg-slate-900/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <span className="material-symbols-outlined text-lg">{showPasswords ? 'visibility_off' : 'visibility'}</span>
                        </button>
                      </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                New Password
                    </label>
                      <input
                type={showPasswords ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                placeholder="Enter new password"
                className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 dark:bg-slate-900/40"
              />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Confirm New Password
                    </label>
                      <input
                type={showPasswords ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                placeholder="Confirm new password"
                className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 dark:bg-slate-900/40"
              />
                    </div>
            <div className="flex justify-end">
              <button
                onClick={handleChangePassword}
                disabled={isChangingPassword || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                className="bg-[var(--primary)] hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm flex items-center gap-2"
              >
                {isChangingPassword ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                    Changing...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">lock</span>
                    Change Password
                  </>
                )}
              </button>
                  </div>
                </div>
        )}
            </div>

            {isEditMode && (
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
            disabled={isUpdatingProfile || isUploadingImage || profileLoading || !formData.providerDisplayName || !formData.providerEmail}
                  className="bg-[var(--primary)] hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm flex items-center gap-2"
                >
            {isUpdatingProfile || isUploadingImage ? (
                    <>
                      <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                {isUploadingImage ? 'Uploading Image...' : 'Saving...'}
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
  );
}


/* ═══════════════════════════════════════════════════════════
   Billing Tab
   ═══════════════════════════════════════════════════════════ */
function BillingTab() {
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'card', last4: '4242', brand: 'Visa', expiry: '12/25', isDefault: true },
  ]);

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Payment Methods</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage your payment methods</p>
        </div>

        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">credit_card</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {method.brand} •••• {method.last4}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Expires {method.expiry}</p>
                </div>
                {method.isDefault && (
                  <span className="px-2 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded">
                    Default
                  </span>
                )}
              </div>
              <button className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                Edit
              </button>
            </div>
          ))}
        </div>

        <button className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-[var(--primary)] hover:bg-indigo-50 dark:hover:bg-slate-800 border border-indigo-200 dark:border-slate-700 transition-colors">
          <span className="material-symbols-outlined text-lg">add</span>
          Add Payment Method
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Billing History</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">View your past transactions</p>
        </div>

        <div className="text-center py-12">
          <span className="material-symbols-outlined text-4xl text-slate-400 mb-4">receipt_long</span>
          <p className="text-slate-500 dark:text-slate-400">No billing history yet</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main Settings Page
   ═══════════════════════════════════════════════════════════ */
export default function ProviderSettingsPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('organization');

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'organization':
        return <OrganizationTab />;
      case 'profile':
        return <ProfileTab />;
      case 'billing':
        return <BillingTab />;
      default:
        return <OrganizationTab />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-900 overflow-hidden antialiased">
      <ProviderSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <ProviderHeader title="Settings" />
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">Settings</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account, organization, and preferences</p>
            </div>

            {/* Tabs */}
            <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-1.5 flex gap-1.5">
              {TABS.map((tab) => {
                const IconComponent = tab.icon === 'business' ? 'business' :
                                    tab.icon === 'person' ? 'person' :
                                    'credit_card';
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                      isActive
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">{IconComponent}</span>
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
