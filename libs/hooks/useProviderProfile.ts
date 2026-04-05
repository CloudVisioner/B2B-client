/* ═══════════════════════════════════════════════════════════
   Provider Profile React Hooks
   Custom hooks for provider profile APIs
   ═══════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback } from 'react';
import {
  getMyProfile,
  updateProviderProfile,
  ProviderProfile,
  UpdateProviderProfileInput,
} from '../api/providerOrganization';

/* ═══════════════════════════════════════════════════════════
   useProviderProfile Hook
   ═══════════════════════════════════════════════════════════ */

export function useProviderProfile() {
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch profile data
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyProfile();
      setProfile(data);
      return data;
    } catch (err: any) {
      setError(err);
      setProfile(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Update profile
  const update = useCallback(async (input: UpdateProviderProfileInput) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updateProviderProfile(input);
      setProfile(data);
      return data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh profile data
  const refresh = useCallback(() => {
    return fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    update,
    refresh,
  };
}

/* ═══════════════════════════════════════════════════════════
   useUpdateProviderProfile Hook
   ═══════════════════════════════════════════════════════════ */

export function useUpdateProviderProfile() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(async (input: UpdateProviderProfileInput) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updateProviderProfile(input);
      return data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
}
