import { ApolloClient, InMemoryCache, ApolloLink, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { onError } from '@apollo/client/link/error';
import { createUploadLink } from 'apollo-upload-client';
import { getHeaders } from './utils';
import { socketVar } from './store';
import { getJwtToken } from '../libs/auth';

let apolloClient: ApolloClient<any>;

/**
 * Custom WebSocket class for public chat (non-GraphQL WebSocket)
 * Stores socket instance in Apollo reactive variable for global access
 */
class LoggingWebSocket {
  private socket: WebSocket;

  constructor(url: string) {
    const token = getJwtToken();
    const wsUrl = token ? `${url}?token=${encodeURIComponent(token)}` : url;
    
    this.socket = new WebSocket(wsUrl);
    socketVar(this.socket);

    this.socket.onopen = () => {
      console.log('🔌 WebSocket connection opened');
    };

    this.socket.onmessage = (msg) => {
      console.log('📨 WebSocket message:', msg.data);
    };

    this.socket.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
    };

    this.socket.onclose = () => {
      console.log('🔌 WebSocket connection closed');
      socketVar(undefined);
    };
  }

  send(data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(data);
    } else {
      console.warn('⚠️ WebSocket is not open. ReadyState:', this.socket.readyState);
    }
  }

  close() {
    this.socket.close();
  }

  get readyState() {
    return this.socket.readyState;
  }
}

// Suppress canonizeResults deprecation warning from Apollo Client 3.14.0
// This is an internal Apollo Client issue that will be fixed in future versions
// The warning comes from Apollo's internal cache.diff operations, not our code
if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    // Check if this is the specific Apollo Client canonizeResults deprecation warning
    const firstArg = args[0];
    const isApolloCanonizeWarning = 
      (typeof firstArg === 'string' && 
       firstArg.includes('An error occurred!') && 
       firstArg.includes('cache.diff') && 
       firstArg.includes('canonizeResults')) ||
      (typeof firstArg === 'string' && 
       firstArg.includes('canonizeResults') && 
       firstArg.includes('Please remove this option'));
    
    // Only suppress the specific canonizeResults warning, allow all other errors
    if (isApolloCanonizeWarning) {
      return;
    }
    originalError.apply(console, args);
  };
}

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      if (message && message.includes('Expected Iterable')) {
        console.warn(
          `[GraphQL warning]: Field ${path?.join('.') || 'unknown'} returned non-iterable value. This will be normalized to an empty array.`
        );
      } else if (
        message &&
        message.includes('organizationImage') &&
        message.includes('conflict')
      ) {
        // Apollo cache invariant sometimes surfaces here; handled via evict + mutation field omission.
        console.warn('[Apollo cache]', message);
      } else {
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ...getHeaders(),
    },
  }));
  return forward(operation);
});

const httpLink = createUploadLink({
  uri:
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_GRAPHQL_URL ||
    process.env.REACT_APP_API_GRAPHQL_URL ||
    'http://localhost:4001/graphql',
  credentials: 'include',
});

const wsLink = typeof window !== 'undefined'
  ? new GraphQLWsLink(
      createClient({
        url:
          process.env.NEXT_PUBLIC_API_WS ||
          process.env.NEXT_PUBLIC_WS_URL ||
          process.env.REACT_APP_API_WS ||
          'ws://localhost:4001/graphql',
        connectionParams: () => ({
          ...getHeaders(),
        }),
      })
    )
  : null;

const splitLink = typeof window !== 'undefined' && wsLink
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink,
      httpLink
    )
  : httpLink;

/**
 * Backend sometimes returns `organizationImage` as `String` or `[String]`.
 * Apollo treats those as incompatible scalars unless we always persist one shape (string | null).
 * No `read` — avoids canonical vs raw mismatches that still trigger merge conflicts.
 */
function normalizeOrganizationImage(value: unknown): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (Array.isArray(value)) {
    const first = value[0];
    if (first == null || first === '') return null;
    return typeof first === 'string' ? first : String(first);
  }
  if (typeof value === 'string') return value;
  return null;
}

const organizationImageFieldPolicy = {
  merge(existing: unknown, incoming: unknown) {
    const next = normalizeOrganizationImage(incoming);
    if (next !== undefined) return next;
    const prev = normalizeOrganizationImage(existing);
    if (prev !== undefined) return prev;
    return existing as string | null | undefined;
  },
};

function createApolloClient() {
  return new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, splitLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            /** Single embedded org per root field — replace whole result, no deep merge fights. */
            getBuyerOrganization: {
              merge(_existing, incoming) {
                return incoming;
              },
            },
            getProviderOrganization: {
              merge(_existing, incoming) {
                return incoming;
              },
            },
          },
        },
        /**
         * Same `_id` can appear under signup `userOrganization`, buyer query, provider query, etc.
         * Normalizing by `_id` merges those writes and triggers scalar conflicts on `organizationImage`.
         * Embed-only: each query path keeps its own org object.
         */
        Organization: {
          keyFields: false,
          fields: {
            organizationImage: organizationImageFieldPolicy,
            orgSkills: {
              read(existing) {
                if (!existing) return [];
                if (Array.isArray(existing)) return existing;
                if (typeof existing === 'string') return [existing];
                return [];
              },
              merge(existing, incoming) {
                if (!incoming) return [];
                if (Array.isArray(incoming)) return incoming;
                if (typeof incoming === 'string') return [incoming];
                return [];
              },
            },
            industries: {
              read(existing) {
                if (!existing) return [];
                if (Array.isArray(existing)) return existing;
                if (typeof existing === 'string') return [existing];
                return [];
              },
              merge(existing, incoming) {
                if (!incoming) return [];
                if (Array.isArray(incoming)) return incoming;
                if (typeof existing === 'string') return [incoming];
                return [];
              },
            },
          },
        },
        BuyerOrganization: {
          keyFields: false,
          fields: {
            organizationImage: organizationImageFieldPolicy,
          },
        },
      },
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
      query: {
        fetchPolicy: 'network-only',
      },
    },
  });
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }

  if (typeof window === 'undefined') return _apolloClient;

  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState: any) {
  return initializeApollo(initialState);
}
