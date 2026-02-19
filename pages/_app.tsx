import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';
import { ThemeProvider } from '../libs/contexts/ThemeContext';
import '../styles/globals.css';
import '../scss/app.scss';
import { CssBaseline } from '@mui/material';

export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </ApolloProvider>
  );
}
