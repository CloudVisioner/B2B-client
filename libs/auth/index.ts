import decode from 'jwt-decode';
import { userVar } from '../../apollo/store';
import { User } from '../../apollo/store';
import { initializeApollo } from '../../apollo/client';
import { LOGIN, GOOGLE_LOGIN, SIGNUP } from '../../apollo/user/mutation';

export function decodeJWT<T = any>(token: string): T | null {
  try {
    return decode(token) as T;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

export function updateUserInfo(token: string): void {
  const claims = decodeJWT(token);
  if (claims) {
    userVar({
      _id: claims._id || claims.userId,
      userRole: claims.userRole,
      userStatus: claims.userStatus,
      userAuthType: claims.userAuthType,
      userEmail: claims.userEmail,
      userPhone: claims.userPhone,
      userNick: claims.userNick,
      userImage: claims.userImage,
      userOrganizationId: claims.userOrganizationId,
      userCountry: claims.userCountry,
      userCity: claims.userCity,
      userDescription: claims.userDescription,
      userLanguages: claims.userLanguages,
      accessToken: token,
      ...claims,
    });
  }
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
    
    const userInput: {
      userEmail: string;
      userPassword: string;
      userNick: string;
      userRole: 'BUYER' | 'PROVIDER';
    } = {
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

export function logOut(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    userVar({});
  }
}

export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  const token = getJwtToken();
  return !!token;
}

export function getCurrentUser(): User | null {
  const user = userVar();
  return user?._id ? user : null;
}
