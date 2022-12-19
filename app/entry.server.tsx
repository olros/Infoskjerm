import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import { CssBaseline, CssVarsProvider } from '@mui/joy';
import type { EntryContext } from '@remix-run/node';
import { RemixServer } from '@remix-run/react';
import { LocaleContextProvider } from '~/LocaleProvider';
import { createEmotionCache } from '~/styles/createEmotionCache';
import StylesContext from '~/styles/server.context';
import { theme } from '~/theme';
import { parseAcceptLanguage } from 'intl-parse-accept-language';
import { renderToString } from 'react-dom/server';

export default function handleRequest(request: Request, responseStatusCode: number, responseHeaders: Headers, remixContext: EntryContext) {
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  const acceptLanguage = request.headers.get('accept-language');
  const locales = parseAcceptLanguage(acceptLanguage, {
    validate: Intl.DateTimeFormat.supportedLocalesOf,
  });

  const MuiRemixServer = () => (
    <CacheProvider value={cache}>
      <LocaleContextProvider locales={locales}>
        <CssVarsProvider defaultColorScheme='dark' defaultMode='dark' theme={theme}>
          <CssBaseline />
          <RemixServer context={remixContext} url={request.url} />
        </CssVarsProvider>
      </LocaleContextProvider>
    </CacheProvider>
  );

  // Render the component to a string.
  const html = renderToString(
    <StylesContext.Provider value={null}>
      <MuiRemixServer />
    </StylesContext.Provider>,
  );

  // Grab the CSS from emotion
  const emotionChunks = extractCriticalToChunks(html);

  // Re-render including the extracted css.
  const markup = renderToString(
    <StylesContext.Provider value={emotionChunks.styles}>
      <MuiRemixServer />
    </StylesContext.Provider>,
  );

  responseHeaders.set('Content-Type', 'text/html');

  return new Response(`<!DOCTYPE html>${markup}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
