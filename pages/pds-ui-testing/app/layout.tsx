import type { Metadata } from "next";
import {
  getComponentChunkLinks,
  getFontLinks,
  getIconLinks,
  getMetaTagsAndIconLinks,
} from "@porsche-design-system/components-react/partials";
import { PorscheDesignSystemProvider } from "@porsche-design-system/components-react/ssr";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PDS UI Testing",
    template: "%s | PDS UI Testing",
  },
  description:
    "Fake e-commerce flow for real-user accessibility testing of Porsche Design System components.",
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
        {getMetaTagsAndIconLinks({
          appTitle: "PDS UI Testing",
          format: "jsx",
        })}
      </head>
      <body>
        <PorscheDesignSystemProvider>{children}</PorscheDesignSystemProvider>
      </body>
    </html>
  );
}
