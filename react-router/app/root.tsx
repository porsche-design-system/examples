import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import {
  getComponentChunkLinks,
  getFontFaceStyles,
  getFontLinks,
  getIconLinks,
  getInitialStyles,
  getMetaTagsAndIconLinks,
} from '@porsche-design-system/components-react/partials';
import { PorscheDesignSystemProvider } from '@porsche-design-system/components-react/ssr';

export async function loader() {
  return {
    headPartials: (
      <>
        {/* necessary for SSR support, injects stylesheet which defines visibility of pre-hydrated PDS components */}
        {getInitialStyles({ format: 'jsx' })}
        {/* injects stylesheet which defines Porsche Next CSS font-face definition (=> minimize FOUT) */}
        {getFontFaceStyles({ format: 'jsx' })}
        {/* preloads Porsche Next font (=> minimize FOUT) */}
        {getFontLinks({ format: 'jsx' })}
        {/* preloads PDS component core chunk from CDN for PDS component hydration (=> improve loading performance) */}
        {getComponentChunkLinks({ format: 'jsx' })}
        {/* preloads Porsche icons (=> minimize FOUC) */}
        {getIconLinks({ format: 'jsx' })}
        {/* injects favicon, apple touch icons, android touch icons, etc. */}
        {getMetaTagsAndIconLinks({ appTitle: 'Porsche', format: 'jsx' })}
      </>
    ),
  };
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const partials = useRouteLoaderData<typeof loader>('root');

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <base href="/examples/react-router/" />
        <Meta />
        <Links />
        {partials?.headPartials}
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <PorscheDesignSystemProvider>
      <Outlet />
    </PorscheDesignSystemProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
