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
