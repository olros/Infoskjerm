import { CacheProvider } from '@emotion/react';
import { CssBaseline, CssVarsProvider } from '@mui/joy';
import { RemixBrowser } from '@remix-run/react';
import { LocaleContextProvider } from '~/LocaleProvider';
import { createEmotionCache } from '~/styles/createEmotionCache';
import { theme } from '~/theme';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';

const emotionCache = createEmotionCache();

const hydrate = () => {
  const locales = window.navigator.languages as string[];
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <CacheProvider value={emotionCache}>
          <LocaleContextProvider locales={locales}>
            <CssVarsProvider defaultColorScheme='dark' defaultMode='dark' theme={theme}>
              <CssBaseline />
              <RemixBrowser />
            </CssVarsProvider>
          </LocaleContextProvider>
        </CacheProvider>
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
