/**
 * Backend DTO limits (UpdateUser / UpdateAdminProfile): enforce on the client so saves don’t loop on validation errors.
 */
export const PROFILE_USER_NICK_MIN = 2;
export const PROFILE_USER_NICK_MAX = 50;
export const PROFILE_USER_DESCRIPTION_MAX = 500;

export function clampUserNick(raw: string): string {
  return raw.trim().slice(0, PROFILE_USER_NICK_MAX);
}

export function clampUserDescription(raw: string): string {
  return raw.trim().slice(0, PROFILE_USER_DESCRIPTION_MAX);
}

/** Returns an error message if invalid, otherwise null. */
export function getUserNickValidationError(raw: string): string | null {
  const n = clampUserNick(raw);
  if (n.length < PROFILE_USER_NICK_MIN) {
    return `Display name must be ${PROFILE_USER_NICK_MIN}–${PROFILE_USER_NICK_MAX} characters (spaces at the ends don’t count).`;
  }
  return null;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString();
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Converts relative image paths to full URLs
 * If the path is already a full URL, returns it as is
 */
export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) return '';
  // If it's already a URL usable directly by <img />, return it as-is.
  // This includes server URLs plus local previews like data: and blob: URLs.
  if (
    imagePath.startsWith('http://') ||
    imagePath.startsWith('https://') ||
    imagePath.startsWith('data:') ||
    imagePath.startsWith('blob:')
  ) {
    return imagePath;
  }
  // If it's a relative path, prepend the base URL
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_GRAPHQL_URL ||
    process.env.REACT_APP_API_GRAPHQL_URL ||
    'http://localhost:4001/graphql';
  const baseUrl = apiUrl.replace('/graphql', '');
  // Remove leading slash from imagePath if present to avoid double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${baseUrl}/${cleanPath}`;
}
