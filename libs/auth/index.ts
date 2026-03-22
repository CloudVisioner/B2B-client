import decode from 'jwt-decode';
import { userVar } from '../../apollo/store';
import { User } from '../../apollo/store';
import { initializeApollo } from '../../apollo/client';
import { LOGIN, GOOGLE_LOGIN, SIGNUP } from '../../apollo/user/mutation';
import { ADMIN_LOGIN, ADMIN_SIGNUP } from '../../apollo/admin/query';

export function decodeJWT<T = any>(token: string): T | null {
  try {
    return decode(token) as T;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

export function normalizeRole(role: string | undefined | null): string {
  if (!role) return '';
  return role.toUpperCase().trim();
}

export function isValidRole(role: string): boolean {
  const normalized = normalizeRole(role);
  return (
    normalized === 'BUYER' ||
    normalized === 'PROVIDER' ||
    normalized === 'ADMIN' ||
    normalized === 'SUPER_ADMIN'
  );
}

/** Admin UI (Nestar API): `ADMIN` or bootstrap `SUPER_ADMIN`. */
export function isAdminPortalRole(role: string | undefined | null): boolean {
  const r = normalizeRole(role);
  return r === 'ADMIN' || r === 'SUPER_ADMIN';
}

function applyAdminAuthPayload(loginData: {
  token: string;
  user: {
    _id?: string;
    userNick?: string;
    userEmail?: string;
    role?: string;
    status?: string;
  };
}): void {
  const u = loginData.user;
  updateStorage({ jwtToken: loginData.token });
  // Hydrate from JWT first (many APIs put role only in the token).
  updateUserInfo(loginData.token);
  const current = userVar();
  const roleFromMutation = normalizeRole(u?.role);
  const roleFromState = normalizeRole(current.userRole);
  userVar({
    ...current,
    _id: u._id ?? current._id,
    userNick: u.userNick ?? current.userNick,
    userEmail: u.userEmail ?? current.userEmail,
    userRole: roleFromMutation || roleFromState || 'ADMIN',
    userStatus: u.status ?? current.userStatus,
    accessToken: loginData.token,
  });
}

export function updateUserInfo(token: string): void {
  const claims = decodeJWT<Record<string, unknown>>(token);
  if (!claims) return;

  const rawRole = claims.userRole ?? claims.role;
  const userRole =
    typeof rawRole === 'string'
      ? normalizeRole(rawRole)
      : typeof claims.userRole === 'string'
        ? normalizeRole(claims.userRole)
        : '';

  userVar({
    ...claims,
    _id: (claims._id || claims.userId) as string | undefined,
    userNick: claims.userNick as string | undefined,
    userEmail: claims.userEmail as string | undefined,
    userRole: userRole || undefined,
    userStatus: claims.userStatus as string | undefined,
    userAuthType: claims.userAuthType as string | undefined,
    userPhone: claims.userPhone as string | undefined,
    userImage: claims.userImage as string | undefined,
    userOrganizationId: claims.userOrganizationId as string | undefined,
    userDescription: claims.userDescription as string | undefined,
    userLanguages: claims.userLanguages as string[] | undefined,
    accessToken: token,
  });
}

export function getJwtToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

function updateStorage({ jwtToken }: { jwtToken: string }): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', jwtToken);
  }
}

/**
 * Admin portal login — matches Nestar `AdminLoginInput`: `userEmail`, `password`.
 * Falls back to unified `login` (same credentials) if `adminLogin` is unavailable.
 */
export async function adminLogInWithEmail(
  userEmail: string,
  password: string,
): Promise<void> {
  const apolloClient = await initializeApollo();
  const email = userEmail.trim().toLowerCase();

  try {
    const result = await apolloClient.mutate({
      mutation: ADMIN_LOGIN,
      variables: { input: { userEmail: email, password } },
      fetchPolicy: 'network-only',
    });
    const loginData = result?.data?.adminLogin;
    if (loginData?.token) {
      applyAdminAuthPayload(loginData);
      return;
    }
  } catch {
    // Fall through to unified login (e.g. older deployments).
  }

  try {
    await logInWithEmail(email, password);
  } catch (e) {
    await logOut();
    throw e instanceof Error ? e : new Error('Login failed. Please check your credentials.');
  }

  if (isAdminPortalRole(userVar()?.userRole)) {
    return;
  }

  await logOut();
  throw new Error(
    'Access denied. This account is not an administrator. Use an admin or SUPER_ADMIN account.',
  );
}

/**
 * Bootstrap `adminSignup` — Nestar `AdminSignupInput`: `userNick`, `userEmail`, `password`.
 * API only allows first SUPER_ADMIN when none exists.
 */
export async function adminSignUp(input: {
  userNick: string;
  email: string;
  password: string;
}): Promise<void> {
  const apolloClient = await initializeApollo();

  try {
    const result = await apolloClient.mutate({
      mutation: ADMIN_SIGNUP,
      variables: {
        input: {
          userNick: input.userNick.trim(),
          userEmail: input.email.trim().toLowerCase(),
          password: input.password,
        },
      },
      fetchPolicy: 'network-only',
    });

    const data = result?.data?.adminSignup;
    if (!data?.token) {
      throw new Error('No access token received');
    }
    applyAdminAuthPayload(data);
  } catch (err: any) {
    const message =
      err?.graphQLErrors?.[0]?.message || err?.message || 'Admin signup failed';
    throw new Error(message);
  }
}

export async function logInWithEmail(
  userNick: string,
  userPassword: string
): Promise<void> {
  try {
    const { jwtToken, user } = await requestJwtToken({ userNick, userPassword });
    if (jwtToken) {
      updateStorage({ jwtToken });
      updateUserInfo(jwtToken);
    }
  } catch (err) {
    console.warn('login err', err);
    logOut();
    throw new Error('Login failed. Please check your credentials.');
  }
}

async function requestJwtToken({
  userNick,
  userPassword,
}: {
  userNick: string;
  userPassword: string;
}): Promise<{ jwtToken: string; user: any }> {
  const apolloClient = await initializeApollo();

  try {
    const result = await apolloClient.mutate({
      mutation: LOGIN,
      variables: { input: { userNick, userPassword } },
      fetchPolicy: 'network-only',
    });

    const loginData = result?.data?.login;
    if (!loginData?.accessToken) {
      throw new Error('No access token received');
    }
    
    userVar(loginData);
    
    return { jwtToken: loginData.accessToken, user: loginData };
  } catch (err: any) {
    const errorMessage =
      err?.graphQLErrors?.[0]?.message ||
      err?.message ||
      'Failed to authenticate';
    throw new Error(errorMessage);
  }
}

export async function googleLogIn(token: string): Promise<void> {
  try {
    const apolloClient = await initializeApollo();
    const result = await apolloClient.mutate({
      mutation: GOOGLE_LOGIN,
      variables: { token },
      fetchPolicy: 'network-only',
    });

    const { accessToken } = result?.data?.googleLogIn;
    if (accessToken) {
      updateStorage({ jwtToken: accessToken });
      updateUserInfo(accessToken);
    } else {
      throw new Error('No access token received');
    }
  } catch (err: any) {
    const errorMessage =
      err?.graphQLErrors?.[0]?.message ||
      err?.message ||
      'Google login failed';
    throw new Error(errorMessage);
  }
}

export async function signUpNew(input: {
  userNick?: string;
  fullName?: string;
  email: string;
  password: string;
  memberType: 'buyer' | 'provider';
}): Promise<void> {
  try {
    const apolloClient = await initializeApollo();
    
    const userNick = input.userNick || input.fullName || '';
    const userEmail = input.email || '';
    
    if (!userNick || !userEmail || !input.password) {
      throw new Error('Please fill in all required fields');
    }
    
    // SignupInput matches login (LoginInput): required `userPassword`, not `password`.
    const userInput = {
      userEmail: userEmail.trim().toLowerCase(),
      userPassword: input.password,
      userNick: userNick.trim(),
      userRole: input.memberType.toUpperCase() as 'BUYER' | 'PROVIDER',
    };

    console.log('Sending signup request:', {
      input: {
        ...userInput,
        userPassword: '***',
      },
    });

    const result = await apolloClient.mutate({
      mutation: SIGNUP,
      variables: { input: userInput },
      fetchPolicy: 'network-only',
    });

    const signupResponse = result?.data?.signup;
    if (!signupResponse?.accessToken) {
      throw new Error('No access token received');
    }
    
    const { accessToken, user } = signupResponse;
    
    userVar({
      ...user,
      accessToken,
      userOrganization: user?.userOrganization || null,
    });
    updateStorage({ jwtToken: accessToken });
  } catch (err: any) {
    console.error('Signup error details:', {
      graphQLErrors: err?.graphQLErrors,
      networkError: err?.networkError,
      message: err?.message,
      fullError: err,
    });

    let errorMessage = 'Signup failed. Please try again.';
    
    if (err?.graphQLErrors && err.graphQLErrors.length > 0) {
      const graphQLError = err.graphQLErrors[0];
      errorMessage = graphQLError.message || errorMessage;
      
      if (graphQLError.extensions?.exception?.message) {
        errorMessage = graphQLError.extensions.exception.message;
      }
      
      if (graphQLError.extensions?.validationErrors) {
        const validationErrors = graphQLError.extensions.validationErrors;
        errorMessage = validationErrors.map((v: any) => 
          Object.values(v.constraints || {}).join(', ')
        ).join('; ') || errorMessage;
      }
    } else if (err?.networkError) {
      errorMessage = 'Network error. Please check your connection.';
    } else if (err?.message) {
      errorMessage = err.message;
    }
    
    throw new Error(errorMessage);
  }
}

export function logIn(token: string): void {
  if (typeof window !== 'undefined') {
    updateStorage({ jwtToken: token });
    updateUserInfo(token);
  }
}

export function signUp(token: string): void {
  if (typeof window !== 'undefined') {
    updateStorage({ jwtToken: token });
    updateUserInfo(token);
  }
}

export async function logOut(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    userVar({});
    
    const { initializeApollo } = await import('../../apollo/client');
    const apolloClient = initializeApollo();
    await apolloClient.clearStore();
  }
}

function isJwtExpired(token: string): boolean {
  const claims = decodeJWT<{ exp?: number }>(token);
  if (claims?.exp == null) return false;
  return Date.now() >= claims.exp * 1000;
}

export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  const token = getJwtToken();
  if (!token) return false;
  if (isJwtExpired(token)) {
    void logOut();
    return false;
  }
  return true;
}

export function getCurrentUser(): User | null {
  const user = userVar();
  return user?._id ? user : null;
}
