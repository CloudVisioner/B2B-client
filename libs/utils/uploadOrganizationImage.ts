import { getJwtToken } from '../auth';

/** Same GraphQL HTTP endpoint as `apollo/client` `createUploadLink`. */
function getGraphqlUri(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_GRAPHQL_URL ||
    process.env.REACT_APP_API_GRAPHQL_URL ||
    'http://localhost:4001/graphql'
  );
}

/**
 * Multipart upload for organization logo (`imageUploader`, target `organization`).
 * Returns the stored path or URL string from the API.
 */
export async function uploadOrganizationImage(file: File): Promise<string> {
  const formData = new FormData();
  const token = getJwtToken();
  const uri = getGraphqlUri();

  formData.append(
    'operations',
    JSON.stringify({
      query: `mutation ImageUploader($file: Upload!, $target: String!) {
        imageUploader(file: $file, target: $target)
      }`,
      variables: { file: null, target: 'organization' },
    }),
  );
  formData.append('map', JSON.stringify({ '0': ['variables.file'] }));
  formData.append('0', file);

  const response = await fetch(uri, {
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
  if (result.errors?.length) {
    throw new Error(result.errors[0]?.message || 'Upload failed');
  }

  const url = result.data?.imageUploader;
  if (typeof url !== 'string' || !url.trim()) {
    throw new Error('No URL returned from upload');
  }
  return url.trim();
}
