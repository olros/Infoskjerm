import { CacheProvider } from '@emotion/react';
import { CssBaseline, CssVarsProvider } from '@mui/joy';
import { RemixBrowser } from '@remix-run/react';
import { createEmotionCache } from '~/styles/createEmotionCache';
import { theme } from '~/theme';
import { startTransition, StrictMode, useState } from 'react';
import { hydrateRoot } from 'react-dom/client';

interface ClientCacheProviderProps {
  children: React.ReactNode;
}

function ClientCacheProvider({ children }: ClientCacheProviderProps) {
  const [cache] = useState(createEmotionCache());

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}

const hydrate = () => {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <ClientCacheProvider>
          <CssVarsProvider defaultColorScheme='dark' defaultMode='dark' theme={theme}>
            <CssBaseline />
            <RemixBrowser />
          </CssVarsProvider>
        </ClientCacheProvider>
      </StrictMode>,
    );
  });
};

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  window.setTimeout(hydrate, 1);
}
