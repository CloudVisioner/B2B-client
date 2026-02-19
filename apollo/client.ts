import { ApolloClient, InMemoryCache, ApolloLink, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { onError } from '@apollo/client/link/error';
import { createUploadLink } from 'apollo-upload-client';
import { getHeaders } from './utils';

let apolloClient: ApolloClient<any>;

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      if (message && message.includes('Expected Iterable')) {
        console.warn(
          `[GraphQL warning]: Field ${path?.join('.') || 'unknown'} returned non-iterable value. This will be normalized to an empty array.`
        );
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
  uri: process.env.NEXT_PUBLIC_API_GRAPHQL_URL || process.env.REACT_APP_API_GRAPHQL_URL || 'http://localhost:3010/graphql',
  credentials: 'include',
});

const wsLink = typeof window !== 'undefined'
  ? new GraphQLWsLink(
      createClient({
        url: process.env.NEXT_PUBLIC_API_WS || process.env.REACT_APP_API_WS || 'ws://localhost:3010/graphql',
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

function createApolloClient() {
  return new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, splitLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {},
        },
        Organization: {
          fields: {
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
