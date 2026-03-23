/* ═══════════════════════════════════════════════════════════
   Provider Organization React Hooks
   Custom hooks for provider organization APIs
   ═══════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback } from 'react';
import {
  getProviderOrganization,
  createProviderOrganization,
  updateProviderOrganization,
  ProviderOrganization,
  ProviderOrganizationInput,
  UpdateProviderOrganizationInput,
} from '../api/providerOrganization';

/* ═══════════════════════════════════════════════════════════
   useProviderOrganization Hook
   ═══════════════════════════════════════════════════════════ */

export function useProviderOrganization() {
  const [organization, setOrganization] = useState<ProviderOrganization | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch organization data
  const fetchOrganization = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProviderOrganization();
      setOrganization(data);
      return data;
    } catch (err: any) {
      setError(err);
      setOrganization(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchOrganization();
  }, [fetchOrganization]);

  // Create organization
  const create = useCallback(async (input: ProviderOrganizationInput) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createProviderOrganization(input);
      setOrganization(data);
      return data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update organization
  const update = useCallback(async (input: UpdateProviderOrganizationInput) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updateProviderOrganization(input);
      setOrganization(data);
      return data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh organization data
  const refresh = useCallback(() => {
    return fetchOrganization();
  }, [fetchOrganization]);

  return {
    organization,
    loading,
    error,
    create,
    update,
    refresh,
    organizationExists: !!organization?._id,
  };
}

/* ═══════════════════════════════════════════════════════════
   useCreateProviderOrganization Hook
   ═══════════════════════════════════════════════════════════ */

export function useCreateProviderOrganization() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(async (input: ProviderOrganizationInput) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createProviderOrganization(input);
      return data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
}

/* ═══════════════════════════════════════════════════════════
   useUpdateProviderOrganization Hook
   ═══════════════════════════════════════════════════════════ */

export function useUpdateProviderOrganization() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(async (input: UpdateProviderOrganizationInput) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updateProviderOrganization(input);
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
