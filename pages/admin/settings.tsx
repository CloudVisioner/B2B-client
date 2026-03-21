import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar, useMutation, useQuery } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { isLoggedIn, normalizeRole, getJwtToken, decodeJWT, updateUserInfo } from '../../libs/auth';
import { AdminSidebar } from '../../libs/components/admin/AdminSidebar';
import { AdminHeader } from '../../libs/components/admin/AdminHeader';
import { UPDATE_MY_PROFILE, UPLOAD_PROFILE_IMAGE } from '../../apollo/user/mutation';
import { NotificationToast } from '../../libs/components/NotificationToast';
import { getImageUrl } from '../../libs/utils';
import { GET_MY_PROFILE } from '../../apollo/user/query';
import { getHeaders } from '../../apollo/utils';

export default function AdminSettingsPage() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);
  const [mounted, setMounted] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [adminProfile, setAdminProfile] = useState({
    userNick: currentUser?.userNick || '',
    userEmail: currentUser?.userEmail || '',
    userPhone: currentUser?.userPhone || '',
    userDescription: currentUser?.userDescription || '',
    userImage: currentUser?.userImage || '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'info' as 'success' | 'error' | 'warning' | 'info', title: '', message: '' });

  const profileVariables = useMemo(() => ({ userId: currentUser?._id || '' }), [currentUser?._id]);

  const { data: profileData } = useQuery(GET_MY_PROFILE, {
    skip: !currentUser?._id,
    variables: profileVariables,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    context: { headers: getHeaders() },
  });

  const [updateProfile] = useMutation(UPDATE_MY_PROFILE, {
    onCompleted: (data) => {
      if (data?.updateUser) {
        // If backend returns a new accessToken, update JWT + reactive userVar so reload reflects DB changes.
        if (data.updateUser.accessToken) {
          updateUserInfo(data.updateUser.accessToken);
        } else {
          userVar({ ...currentUser, ...data.updateUser });
        }
        setIsDirty(false);
        showToast('success', 'Success', 'Profile updated successfully');
      }
    },
    onError: (error) => {
      showToast('error', 'Error', error.message || 'Failed to update profile');
    },
  });

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
      return;
    }
  }, [router, currentUser]);

  useEffect(() => {
    // Prevent overwriting your local edits while you're typing.
    if (isDirty) return;
    const u = profileData?.getUser || currentUser;
    if (!u) return;

    setAdminProfile({
      userNick: u.userNick || '',
      userEmail: u.userEmail || '',
      userPhone: u.userPhone || '',
      userDescription: u.userDescription || '',
      userImage: u.userImage || '',
    });
  }, [currentUser, profileData, isDirty]);

  const showToast = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    setToast({ isOpen: true, type, title, message });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('error', 'Error', 'Image size must be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        // Store preview as data URL; `getImageUrl()` must return data: URLs unchanged.
        setIsDirty(true);
        setAdminProfile((prev) => ({ ...prev, userImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToBackend = async (file: File): Promise<string> => {
    const result = await uploadImage({
      variables: {
        file,
        target: 'user',
      },
    });
    if (result.data?.imageUploader) {
      return result.data.imageUploader;
    }
    throw new Error('Upload failed: No URL returned');
  };

  const handleSave = async () => {
    if (!adminProfile.userNick.trim()) {
      showToast('warning', 'Validation Error', 'Please enter a display name');
      return;
    }

    try {
      let imageUrl = adminProfile.userImage;
      if (imageFile) {
        setIsUploadingImage(true);
        try {
          imageUrl = await uploadImageToBackend(imageFile);
        } catch (error: any) {
          showToast('error', 'Error', `Failed to upload image: ${error.message || 'Please try again'}`);
          setIsUploadingImage(false);
          return;
        } finally {
          setIsUploadingImage(false);
        }
      }

      const token = getJwtToken();
      const tokenClaims = token ? decodeJWT<any>(token) : null;
      const userIdToSave = currentUser?._id || tokenClaims?._id || tokenClaims?.userId || null;

      if (!userIdToSave) {
        showToast('error', 'Error', 'User ID not found. Please refresh the page and try again.');
        return;
      }

      const updateInput: any = {
        _id: userIdToSave,
        userNick: adminProfile.userNick.trim(),
      };

      // Email is disabled in the UI (admins cannot change it), but we still avoid
      // sending an empty/invalid value to the backend to prevent validation errors.
      const emailToSend = (adminProfile.userEmail || currentUser?.userEmail || '').trim();
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToSend);
      if (isValidEmail) {
        updateInput.userEmail = emailToSend;
      }

      if (adminProfile.userPhone.trim()) {
        updateInput.userPhone = adminProfile.userPhone.trim();
      }
      if (adminProfile.userDescription.trim()) {
        updateInput.userDescription = adminProfile.userDescription.trim();
      }
      if (imageUrl && imageUrl !== currentUser?.userImage) {
        updateInput.userImage = imageUrl;
      }

      await updateProfile({
        variables: { input: updateInput },
      });
    } catch (error: any) {
      showToast('error', 'Error', error.message || 'Failed to update profile');
    }
  };

  if (!mounted) {
    return (
      <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
        <div className="w-64 flex-shrink-0 h-full border-r border-slate-200 bg-white" />
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="h-16 bg-white border-b" />
          <main className="flex-1 overflow-y-auto" />
        </div>
      </div>
    );
  }

  if (!isLoggedIn()) return null;

  const role = normalizeRole(currentUser?.userRole);
  if (role && role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="flex h-screen w-full bg-[#F9FAFB] overflow-hidden antialiased">
      <AdminSidebar />
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <AdminHeader title="Profile" subtitle="Manage your admin profile" />
        <main className="flex-1 overflow-y-auto bg-[#F9FAFB]">
          <div className="max-w-4xl mx-auto px-8 py-10">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-6 pb-6 border-b border-slate-200">
                  <div className="relative">
                    {adminProfile.userImage ? (
                      <img
                        src={getImageUrl(adminProfile.userImage)}
                        alt={adminProfile.userNick}
                        className="w-24 h-24 rounded-full object-cover border-4 border-slate-200"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-slate-200">
                        <span className="material-symbols-outlined text-4xl text-indigo-600">person</span>
                      </div>
                    )}
                    <label className="absolute bottom-0 right-0 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      <span className="material-symbols-outlined text-sm">camera_alt</span>
                    </label>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{adminProfile.userNick || 'Admin User'}</h3>
                    <p className="text-sm text-slate-600">{adminProfile.userEmail}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                      {normalizeRole(currentUser?.userRole) === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'ADMIN'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Display Name</label>
                    <input
                      type="text"
                      value={adminProfile.userNick}
                      onChange={(e) => {
                        setIsDirty(true);
                        setAdminProfile((prev) => ({ ...prev, userNick: e.target.value }));
                      }}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Your display name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={adminProfile.userEmail}
                      disabled
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={adminProfile.userPhone}
                      onChange={(e) => {
                        setIsDirty(true);
                        setAdminProfile((prev) => ({ ...prev, userPhone: e.target.value }));
                      }}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Bio / Description</label>
                  <textarea
                    rows={4}
                    value={adminProfile.userDescription}
                    onChange={(e) => {
                      setIsDirty(true);
                      setAdminProfile((prev) => ({ ...prev, userDescription: e.target.value }));
                    }}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div className="flex items-center justify-end pt-4 border-t border-slate-200">
                  <button
                    onClick={handleSave}
                    disabled={isUploadingImage}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploadingImage ? 'Uploading...' : 'Save Profile'}
                  </button>
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
