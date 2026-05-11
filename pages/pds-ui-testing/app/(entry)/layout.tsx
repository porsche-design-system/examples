import type { Metadata, Viewport } from "next";
import { defaultLocale } from "../i18n/config";
import "../globals.css";

const APP_TITLE = "PDS UI Testing";

export const metadata: Metadata = {
  title: { default: APP_TITLE, template: `%s | ${APP_TITLE}` },
  description:
    "Minimal technical baseline for accessibility testing of Porsche Design System components.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

type Props = { children: React.ReactNode };

export default function EntryRootLayout({ children }: Props) {
  return (
    <html lang={defaultLocale}>
      <head>
        <base
          href={
            process.env.NEXT_PUBLIC_BASE_PATH
              ? `${process.env.NEXT_PUBLIC_BASE_PATH}/`
              : "/"
          }
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
