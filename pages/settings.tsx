import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar, useMutation, useQuery } from '@apollo/client';
import { userVar } from '../apollo/store';
import { isLoggedIn, getJwtToken, updateUserInfo, decodeJWT } from '../libs/auth';
import { Sidebar } from '../libs/components/dashboard/Sidebar';
import { Header } from '../libs/components/dashboard/Header';
import { CREATE_ORGANIZATION, UPDATE_ORGANIZATION, UPDATE_MY_PROFILE, CHANGE_MY_PASSWORD, UPLOAD_PROFILE_IMAGE } from '../apollo/user/mutation';
import { GET_BUYER_ORGANIZATION, GET_MY_PROFILE } from '../apollo/user/query';
import { getHeaders } from '../apollo/utils';

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
   Organization Tab (Edit Only)
   ═══════════════════════════════════════════════════════════ */
function OrganizationTab() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [formData, setFormData] = useState({
    orgName: '',
    industry: '',
    location: '',
    description: '',
    budgetRange: '',
    logoUrl: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [logoFile, setLogoFile] = useState<File | null>(null);

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

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
        successTimeoutRef.current = null;
      }
    };
  }, []);

  const { data: orgData, loading: orgLoading, refetch } = useQuery(GET_BUYER_ORGANIZATION, {
    skip: !isLoggedIn(),
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
    context: {
      headers: isLoggedIn() ? getHeaders() : {},
    },
    onCompleted: (data) => {
      if (data?.getBuyerOrganization) {
        const org = data.getBuyerOrganization;
        // organizationImage is now a string, not an array
        // ✅ Safety check: ensure it's always a string, even if backend returns array
        let logoUrl = '';
        if (Array.isArray(org.organizationImage)) {
          logoUrl = org.organizationImage[0] || '';
        } else {
          logoUrl = org.organizationImage || '';
        }
        
        if (!isEditMode && !logoFile) {
          setFormData({
            orgName: org.organizationName || '',
            industry: org.organizationIndustry || '',
            location: org.organizationLocation || '',
            description: org.organizationDescription || '',
            budgetRange: org.budgetRange || '',
            logoUrl: logoUrl,
          });
          
          if (logoUrl) {
            if (logoPreview && logoPreview.startsWith('blob:')) {
              URL.revokeObjectURL(logoPreview);
            }
            const fullImageUrl = getImageUrl(logoUrl);
            setLogoPreview(fullImageUrl);
          } else if (!logoFile) {
            setLogoPreview('');
          }
        }
      }
    },
  });

  const organizationExists = orgData?.getBuyerOrganization?._id;

  // NOTE: Removed redundant useEffect that duplicated onCompleted logic above.
  // The onCompleted callback already handles populating formData and logoPreview
  // when orgData loads. Having both caused double state updates.

  const [createOrg, { loading: isCreating }] = useMutation(CREATE_ORGANIZATION, {
    context: {
      headers: isLoggedIn() ? getHeaders() : {},
    },
    refetchQueries: [
      {
        query: GET_BUYER_ORGANIZATION,
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: async (data) => {
      setShowSuccessMessage(true);
      setIsCreated(true);
      setIsEditMode(false);
      setLogoFile(null);
      
      const org = data?.createOrUpdateBuyerOrganization;
      // organizationImage is now a string, not an array
      // ✅ Safety check: ensure it's always a string, even if backend returns array
      let newLogoUrl = '';
      if (org?.organizationImage) {
        if (Array.isArray(org.organizationImage)) {
          newLogoUrl = org.organizationImage[0] || '';
        } else {
          newLogoUrl = org.organizationImage;
        }
      }
      
      await refetch();

      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = setTimeout(() => {
        setShowSuccessMessage(false);
        setIsCreated(false);
      }, 3000);
    },
    onError: (error) => {
      console.error('Error creating organization:', error);
      alert('Failed to create organization. Please try again.');
    },
  });

  const [updateOrg, { loading: isUpdating }] = useMutation(UPDATE_ORGANIZATION, {
    context: {
      headers: isLoggedIn() ? getHeaders() : {},
    },
    refetchQueries: [
      {
        query: GET_BUYER_ORGANIZATION,
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: async (data) => {
      setShowSuccessMessage(true);
      setIsCreated(false);
      setIsEditMode(false);
      setLogoFile(null);
      
      await refetch();

      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = setTimeout(() => {
        setShowSuccessMessage(false);
        setIsCreated(false);
      }, 3000);
    },
    onError: (error) => {
      console.error('Error updating organization:', error);
      alert('Failed to update organization. Please try again.');
    },
  });

  const isSaving = isCreating || isUpdating;

  const handleInputChange = (field: string, value: string | string[]) => {
    if (!isEditMode) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };


  const handleSave = async () => {
    if (!formData.orgName || !formData.industry || !formData.location) {
      alert('Please fill in all required fields (Name, Industry, Location).');
      return;
    }

    try {
      let logoUrl: string = '';
      // Ensure logoUrl is always a string, not an array
      if (Array.isArray(formData.logoUrl)) {
        logoUrl = formData.logoUrl[0] || '';
      } else {
        logoUrl = formData.logoUrl || '';
      }

      if (logoFile) {
        setIsUploadingLogo(true);
        try {
          logoUrl = await uploadLogoToBackend(logoFile);
          // Ensure it's a string (uploadLogoToBackend should return string, but double-check)
          if (Array.isArray(logoUrl)) {
            logoUrl = logoUrl[0] || '';
          }
          // Update formData with the new image URL
          setFormData((prev) => ({ ...prev, logoUrl }));
          // Update preview to show the uploaded image URL (not blob)
          const fullImageUrl = getImageUrl(logoUrl);
          setLogoPreview(fullImageUrl);
          // Clear the file since it's now uploaded
          setLogoFile(null);
        } catch (error: any) {
          console.error('Error uploading logo:', error);
          alert(`Failed to upload logo: ${error.message || 'Please try again'}`);
          setIsUploadingLogo(false);
          return;
        } finally {
          setIsUploadingLogo(false);
        }
      }

      if (organizationExists) {
        const updateInput: any = {
          orgId: orgData.getBuyerOrganization._id,
          organizationName: formData.orgName.trim(),
          organizationIndustry: formData.industry,
          organizationLocation: formData.location.trim(),
          organizationDescription: formData.description.trim(),
        };

        if (formData.budgetRange.trim()) {
          updateInput.budgetRange = formData.budgetRange.trim();
        }

        if (logoUrl) {
          // ✅ Ensure organizationImage is always a string, not an array
          // Double-check in case logoUrl somehow became an array
          updateInput.organizationImage = Array.isArray(logoUrl) ? logoUrl[0] : logoUrl;
        }

        await updateOrg({
          variables: { input: updateInput },
        });
      } else {
        const createInput: any = {
          organizationName: formData.orgName.trim(),
          organizationIndustry: formData.industry,
          organizationLocation: formData.location.trim(),
          organizationDescription: formData.description.trim(),
        };

        if (formData.budgetRange.trim()) {
          createInput.budgetRange = formData.budgetRange.trim();
        }

        if (logoUrl) {
          // ✅ Ensure organizationImage is always a string, not an array
          // Double-check in case logoUrl somehow became an array
          createInput.organizationImage = Array.isArray(logoUrl) ? logoUrl[0] : logoUrl;
        }

        await createOrg({
          variables: { input: createInput },
        });
      }
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

  if (!organizationExists) {
    return (
      <div className="space-y-8">
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
          <p className="text-slate-600">Please create an organization first on the Organizations page.</p>
          <button
            onClick={() => window.location.href = '/organizations'}
            className="mt-4 bg-[var(--primary)] hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all"
          >
            Go to Organizations
          </button>
        </div>
      </div>
    );
  }

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

      <div className="bg-white border border-slate-200 rounded-xl p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Company Profile</h3>
            <p className="text-sm text-slate-500 mt-0.5">Edit your company information</p>
          </div>
          {!isEditMode && (
            <button
              onClick={() => setIsEditMode(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-[var(--primary)] hover:bg-indigo-50 border border-indigo-200 transition-colors"
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 border border-slate-200 transition-colors"
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
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-lg">
                  <img 
                    src={logoPreview} 
                    alt="Company logo" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Image failed to load:', logoPreview);
                      // Fallback to initials if image fails to load
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {isUploadingLogo && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white animate-spin">sync</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-200">
                  {getInitials(formData.orgName || 'Company')}
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
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Company Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.orgName}
                onChange={(e) => handleInputChange('orgName', e.target.value)}
                placeholder="ABC Corporation"
                disabled={!isEditMode}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 disabled:bg-white disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Industry/Category <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                disabled={!isEditMode}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 disabled:bg-white disabled:cursor-not-allowed"
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
                placeholder="Busan, South Korea"
                disabled={!isEditMode}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 disabled:bg-white disabled:cursor-not-allowed"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Description
              </label>
              <textarea
                rows={12}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Provide a detailed description of your organization, including what you do, your mission, values, and any other relevant information that would help service providers understand your business..."
                disabled={!isEditMode}
                className="w-full border border-slate-200 rounded-lg px-4 py-3.5 text-sm font-medium text-slate-900 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 resize-y min-h-[300px] disabled:bg-white disabled:cursor-not-allowed"
              />
              <p className="text-xs text-slate-400 mt-1.5 text-right">
                {formData.description.length} / 2000 characters
              </p>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Budget Range
              </label>
              <input
                type="text"
                value={formData.budgetRange}
                onChange={(e) => handleInputChange('budgetRange', e.target.value)}
                placeholder="$1,000 - $10,000 per project"
                disabled={!isEditMode}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 disabled:bg-white disabled:cursor-not-allowed"
              />
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
  );
}

/* ═══════════════════════════════════════════════════════════
   Profile Tab
   ═══════════════════════════════════════════════════════════ */
function ProfileTab() {
  const currentUser = useReactiveVar(userVar);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const passwordTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  
  const [formData, setFormData] = useState({
    userNick: '',
    userEmail: '',
    userPhone: '',
    userDescription: '',
    userImage: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Ref to track the latest blob URL for cleanup on unmount
  const imageBlobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (passwordTimeoutRef.current) {
        clearTimeout(passwordTimeoutRef.current);
        passwordTimeoutRef.current = null;
      }
      // Revoke any outstanding blob URL on unmount
      if (imageBlobUrlRef.current) {
        URL.revokeObjectURL(imageBlobUrlRef.current);
        imageBlobUrlRef.current = null;
      }
    };
  }, []);

  // Helper function to convert relative image paths to full URLs
  const getImageUrl = (imagePath: string | null | undefined): string => {
    if (!imagePath) return '';
    // If it's already a full URL (starts with http:// or https://), return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // If it's a relative path, prepend the base URL (same logic as dashboard Header)
    const apiUrl =
      process.env.NEXT_PUBLIC_API_GRAPHQL_URL ||
      process.env.REACT_APP_API_GRAPHQL_URL ||
      'http://localhost:3010/graphql';
    const baseUrl = apiUrl.replace('/graphql', '');
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${baseUrl}/${cleanPath}`;
  };

  // Get userId from multiple sources - userVar or JWT token
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
  
  const { data: profileData, loading: profileLoading, refetch: refetchProfile } = useQuery(GET_MY_PROFILE, {
    skip: !isLoggedIn() || !validUserId,
    variables: { userId: validUserId || '' },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    context: {
      headers: isLoggedIn() ? getHeaders() : {},
    },
    notifyOnNetworkStatusChange: false,
    onCompleted: (data) => {
      if (data?.getUser && !isEditMode && !imageFile) {
        const user = data.getUser;
        setFormData({
          userNick: user.userNick || '',
          userEmail: user.userEmail || '',
          userPhone: user.userPhone || '',
          userDescription: user.userDescription || '',
          userImage: user.userImage || '',
        });
        if (user.userImage) {
          // Revoke any blob URL before switching to server URL
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

  // NOTE: Removed redundant useEffect that duplicated onCompleted logic above.
  // The onCompleted callback already handles populating formData and imagePreview
  // when profileData loads. Having both caused double state updates.

  const [updateProfile, { loading: isUpdatingProfile }] = useMutation(UPDATE_MY_PROFILE, {
    context: {
      headers: isLoggedIn() ? getHeaders() : {},
    },
    refetchQueries: [
      {
        query: GET_MY_PROFILE,
        variables: { userId: validUserId || '' },
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: async (data) => {
      setShowSuccessMessage(true);
      setIsEditMode(false);
      setImageFile(null);
      
      // Update userVar with new profile data including image
      if (data?.updateUser) {
        const updatedUser = data.updateUser;
        const currentUserData = userVar();
        
        // Update userVar with new data, preserving existing fields
        userVar({
          ...currentUserData,
          userNick: updatedUser.userNick || currentUserData.userNick,
          userEmail: updatedUser.userEmail || currentUserData.userEmail,
          userPhone: updatedUser.userPhone || currentUserData.userPhone,
          userImage: updatedUser.userImage || currentUserData.userImage,
          userDescription: updatedUser.userDescription || currentUserData.userDescription,
          accessToken: updatedUser.accessToken || currentUserData.accessToken,
        });
        
        // Also update JWT token if new one is provided
        if (updatedUser.accessToken) {
          updateUserInfo(updatedUser.accessToken);
        }
      }
      
      // Refetch profile to ensure data is up to date
      await refetchProfile();

      if (passwordTimeoutRef.current) clearTimeout(passwordTimeoutRef.current);
      passwordTimeoutRef.current = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
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

  const handleInputChange = (field: string, value: string) => {
    if (!isEditMode) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    // Revoke previous blob URL to prevent memory leak
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

  const uploadImageToBackend = async (file: File): Promise<string> => {
    const formData = new FormData();
    const token = getJwtToken();
    const apiUrl = process.env.NEXT_PUBLIC_API_GRAPHQL_URL || process.env.REACT_APP_API_GRAPHQL_URL || 'http://localhost:3010/graphql';
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
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  const handleSave = async () => {
    if (!formData.userNick || !formData.userEmail) {
      alert('Please fill in all required fields (Display Name, Email).');
      return;
    }

    // Get user ID from multiple sources as fallback
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

    const userIdToSave = profileData?.getUser?._id || 
                         currentUser?._id || 
                         getUserIdFromToken();
    
    if (!userIdToSave) {
      console.error('User ID not found:', { 
        profileData: profileData?.getUser?._id, 
        currentUser: currentUser?._id,
        currentUserFull: currentUser 
      });
      alert('User ID not found. Please refresh the page and try again.');
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

      const updateInput: any = {
        _id: userIdToSave,
        userNick: formData.userNick.trim(),
        userEmail: formData.userEmail.trim(),
      };

      if (formData.userPhone.trim()) {
        updateInput.userPhone = formData.userPhone.trim();
      }

      if (formData.userDescription.trim()) {
        updateInput.userDescription = formData.userDescription.trim();
      }

      if (imageUrl) {
        updateInput.userImage = imageUrl;
      }

      await updateProfile({
        variables: { input: updateInput },
      });
    } catch (error) {
      // Error handled in onError callback
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

    if (passwordData.newPassword.length < 5 || passwordData.newPassword.length > 12) {
      alert('New password must be between 5 and 12 characters.');
      return;
    }

    try {
      await changePassword({
        variables: {
          input: {
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          },
        },
      });
    } catch (error) {
      // Error handled in onError callback
    }
  };

  const handleRemoveImage = () => {
    if (!isEditMode) return;
    if (imageBlobUrlRef.current) {
      URL.revokeObjectURL(imageBlobUrlRef.current);
      imageBlobUrlRef.current = null;
    }
    setImageFile(null);
    setImagePreview('');
    setFormData((prev) => ({ ...prev, userImage: '' }));
  };

  if (profileLoading) {
    return (
      <div className="space-y-8">
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
          <span className="material-symbols-outlined text-slate-400 animate-spin text-4xl">sync</span>
          <p className="text-sm text-slate-500 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

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

      {/* Avatar & Personal Info */}
      <div className="bg-white border border-slate-200 rounded-xl p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
            <p className="text-sm text-slate-500 mt-0.5">Update your personal details and profile photo</p>
          </div>
          {!isEditMode && (
            <button
              onClick={() => setIsEditMode(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-[var(--primary)] hover:bg-indigo-50 border border-indigo-200 transition-colors"
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 border border-slate-200 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">close</span>
              Cancel
            </button>
          )}
        </div>

        <div className="flex items-start gap-8">
          {/* Photo */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {imagePreview ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-200 shadow-lg">
                  <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                  {isUploadingImage && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white animate-spin">sync</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-200">
                  {getInitials(formData.userNick || currentUser?.userNick || 'User')}
                </div>
              )}
              {isEditMode && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-slate-500 text-sm">photo_camera</span>
                </button>
              )}
            </div>
            {isEditMode && (
              <>
                <input ref={fileInputRef} type="file" hidden onChange={handleImageSelect} accept="image/jpg, image/jpeg, image/png" disabled={isUploadingImage} />
                <button
                  onClick={handleRemoveImage}
                  className="text-xs font-bold text-red-500 hover:underline"
                  disabled={!imagePreview}
                >
                  Remove
                </button>
              </>
            )}
          </div>

          {/* Fields */}
          <div className="flex-1 grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Display Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.userNick}
                onChange={(e) => handleInputChange('userNick', e.target.value)}
                placeholder="John Doe"
                disabled={!isEditMode}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 disabled:bg-white disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={formData.userEmail}
                onChange={(e) => handleInputChange('userEmail', e.target.value)}
                placeholder="john@example.com"
                disabled={!isEditMode}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 disabled:bg-white disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.userPhone}
                onChange={(e) => handleInputChange('userPhone', e.target.value)}
                placeholder="+1 (555) 000-0000"
                disabled={!isEditMode}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 disabled:bg-white disabled:cursor-not-allowed"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Bio / Description</label>
              <textarea
                rows={4}
                value={formData.userDescription}
                onChange={(e) => handleInputChange('userDescription', e.target.value)}
                placeholder="Tell us about yourself..."
                disabled={!isEditMode}
                className="w-full border border-slate-200 rounded-lg px-4 py-3.5 text-sm font-medium text-slate-900 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 resize-y disabled:bg-white disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Password Section (Optional) */}
      <div className="bg-white border border-slate-200 rounded-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Security</h3>
            <p className="text-sm text-slate-500 mt-0.5">Change your password (optional)</p>
          </div>
          <button
            onClick={() => setShowPasswordSection(!showPasswordSection)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 border border-slate-200 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">{showPasswordSection ? 'expand_less' : 'expand_more'}</span>
            {showPasswordSection ? 'Hide' : 'Change Password'}
          </button>
        </div>
        
        {showPasswordSection && (
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">
                  {showPasswords ? 'visibility_off' : 'visibility'}
                </span>
                {showPasswords ? 'Hide passwords' : 'Show passwords'}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Password</label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">New Password</label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 placeholder:text-slate-400"
                />
                <p className="text-xs text-slate-400 mt-1">5-12 characters</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Confirm New Password</label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-slate-50/50 placeholder:text-slate-400"
                />
              </div>
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
                    Update Password
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
            disabled={isUpdatingProfile || isUploadingImage || !formData.userNick || !formData.userEmail}
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
   Notifications Tab
   ═══════════════════════════════════════════════════════════ */
function ToggleSwitch({ 
  isOn, 
  onToggle 
}: { 
  isOn: boolean; 
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 ${
        isOn ? 'bg-[var(--primary)]' : 'bg-slate-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
          isOn ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}


/* ═══════════════════════════════════════════════════════════
   Billing Tab
   ═══════════════════════════════════════════════════════════ */
function BillingTab() {
  return (
    <div className="space-y-8">
      {/* Billing Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 shadow-xl border border-indigo-500/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-white/80 uppercase tracking-wider">This Month</span>
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">$2,450.00</p>
          <p className="text-xs text-white/70 font-medium">Total billed</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Next Billing</span>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-600 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-1">Jan 15, 2024</p>
          <p className="text-xs text-slate-500 font-medium">Auto-renewal date</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Plan</span>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-indigo-600 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mb-1">Professional</p>
          <p className="text-xs text-slate-500 font-medium">$99/month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Method */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Payment Method</h3>
              <p className="text-sm text-slate-500">Your default payment method</p>
            </div>
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
              Edit
            </button>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 shadow-lg border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 rounded bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-white text-xs font-bold">VISA</span>
                </div>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                  Default
                </span>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-2xl font-bold text-white tracking-wider mb-2">•••• •••• •••• 4242</p>
              <div className="flex items-center gap-4 text-white/70 text-sm">
                <span>John Doe</span>
                <span>•</span>
                <span>Expires 12/25</span>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Address */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Billing Address</h3>
              <p className="text-sm text-slate-500">Where invoices are sent</p>
            </div>
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
              Edit
            </button>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-900">ABC Corporation</p>
            <p className="text-sm text-slate-600">123 Business Street</p>
            <p className="text-sm text-slate-600">Suite 400</p>
            <p className="text-sm text-slate-600">New York, NY 10001</p>
            <p className="text-sm text-slate-600 mt-2">United States</p>
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Recent Invoices</h3>
            <p className="text-sm text-slate-500">Download and review past invoices</p>
          </div>
          <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">download</span>
            Export All
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-100">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Invoice</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { id: 'INV-2024-001', date: 'Dec 15, 2023', amount: '$99.00', status: 'Paid', statusColor: 'emerald' },
                { id: 'INV-2023-098', date: 'Nov 15, 2023', amount: '$99.00', status: 'Paid', statusColor: 'emerald' },
                { id: 'INV-2023-087', date: 'Oct 15, 2023', amount: '$99.00', status: 'Paid', statusColor: 'emerald' },
                { id: 'INV-2023-076', date: 'Sep 15, 2023', amount: '$99.00', status: 'Paid', statusColor: 'emerald' },
              ].map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">{inv.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600 font-medium">{inv.date}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">{inv.amount}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider ${
                      inv.statusColor === 'emerald'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[var(--primary)] font-semibold text-sm hover:underline flex items-center gap-1.5 ml-auto inline-flex">
                      <span className="material-symbols-outlined text-base">download</span>
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Settings Page
   ═══════════════════════════════════════════════════════════ */
export default function SettingsPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);
  const tabParam = router.query.tab as string;
  const [activeTab, setActiveTab] = useState<TabId>(tabParam && TABS.find(t => t.id === tabParam) ? (tabParam as TabId) : 'organization');

  useEffect(() => {
    if (tabParam && TABS.find(t => t.id === tabParam)) {
      setActiveTab(tabParam as TabId);
    }
  }, [tabParam]);

  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn()) router.push('/login');
  }, [router]);

  if (!mounted) {
    return (
      <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
        <div className="w-64 flex-shrink-0 h-full border-r border-slate-200 bg-white" />
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto" />
        </div>
      </div>
    );
  }
  if (!isLoggedIn()) return null;

  const renderTab = () => {
    switch (activeTab) {
      case 'organization': return <OrganizationTab />;
      case 'profile': return <ProfileTab />;
      case 'billing': return <BillingTab />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#F9FAFB] overflow-hidden antialiased">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="Settings" />
        <main className="flex-1 overflow-y-auto bg-[#F9FAFB]">
          <div className="max-w-5xl mx-auto px-10 py-10">
            {/* Title */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
              <p className="text-sm text-slate-500 font-medium mt-1">Manage your account, organization, and preferences</p>
            </div>

            {/* Tab bar */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1.5 mb-8">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-[var(--primary)] text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-lg"
                    style={activeTab === tab.id ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {renderTab()}

            {/* Management Footer */}
            <div className="flex flex-wrap items-center gap-4 pt-10 mt-10 border-t border-[var(--border)]">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-4">Management</p>
              <button
                onClick={() => router.push('/marketplace')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">groups</span>
                Browse Talent
              </button>
              <button
                onClick={() => router.push('/organizations')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">settings_suggest</span>
                Manage Organizations
              </button>
              <button
                onClick={() => router.push('/help-support')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
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
