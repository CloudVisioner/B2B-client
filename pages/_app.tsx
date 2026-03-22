import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';
import { ThemeProvider } from '../libs/contexts/ThemeContext';
import { ChatWidgets } from '../libs/components/ChatWidgets';
import ChatbaseIdentity from '../libs/components/ChatbaseIdentity';
import { shouldShowMarketingNavbar } from '../libs/utils/shouldShowMarketingNavbar';
import '../styles/globals.css';
import '../scss/app.scss';
import { CssBaseline } from '@mui/material';

const Navbar = dynamic(() => import('../libs/components/Navbar'), { ssr: false });

function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const showMarketingNav = shouldShowMarketingNavbar(router.pathname);

  return (
    <>
      {showMarketingNav ? <Navbar /> : null}
      {children}
    </>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider>
        <CssBaseline />
        <AppShell>
          <Component {...pageProps} />
        </AppShell>
        <ChatbaseIdentity />
        <ChatWidgets />
      </ThemeProvider>
    </ApolloProvider>
  );
}
