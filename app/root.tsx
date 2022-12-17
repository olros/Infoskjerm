import { withEmotionCache } from '@emotion/react';
import styled from '@emotion/styled';
import type { MetaFunction } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useCatch } from '@remix-run/react';
import ServerStyleContext from '~/styles/server.context';
import { useContext } from 'react';

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Infoskjerm',
  viewport: 'width=device-width,initial-scale=1',
});

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}

const Document = withEmotionCache(({ children, title }: DocumentProps, emotionCache) => {
  const serverStyleData = useContext(ServerStyleContext);

  return (
    <html lang='no'>
      <head>
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
        {serverStyleData?.map(({ key, ids, css }) => (
          <style
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: css }}
            data-emotion={`${key} ${ids.join(' ')}`}
            key={key}
          />
        ))}
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
});

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

const Container = styled('div')`
  background-color: #ff0000;
  padding: 1rem;
`;

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Container>
        <p>
          [CatchBoundary]: {caught.status} {caught.statusText}
        </p>
      </Container>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title='Error!'>
      <Container>
        <p>[ErrorBoundary]: There was an error: {error.message}</p>
      </Container>
    </Document>
  );
}
