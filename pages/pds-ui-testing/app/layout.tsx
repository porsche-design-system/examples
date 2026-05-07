import type { Metadata, Viewport } from "next";
import {
  getComponentChunkLinks,
  getFontLinks,
  getIconLinks,
  getMetaTagsAndIconLinks,
} from "@porsche-design-system/components-react/partials";
import { PorscheDesignSystemProvider } from "@porsche-design-system/components-react/ssr";
import "./globals.css";

const APP_TITLE = "PDS UI Testing";

export const metadata: Metadata = {
  title: {
    default: APP_TITLE,
    template: `%s | ${APP_TITLE}`,
  },
  description:
    "Minimal technical baseline for accessibility testing of Porsche Design System components.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="scheme-light-dark">
      <head>
        <base
          href={
            process.env.NEXT_PUBLIC_BASE_PATH
              ? `${process.env.NEXT_PUBLIC_BASE_PATH}/`
              : "/"
          }
        />
        {getFontLinks({ format: "jsx" })}
        {getComponentChunkLinks({ format: "jsx" })}
        {getIconLinks({ format: "jsx" })}
        {getMetaTagsAndIconLinks({ appTitle: APP_TITLE, format: "jsx" })}
      </head>
      <body>
        <PorscheDesignSystemProvider>{children}</PorscheDesignSystemProvider>
      </body>
    </html>
  );
}
