import { redirect } from "next/navigation";
import { defaultLocale } from "../i18n/config";

/**
 * Root entry: redirects to the default locale home.
 *
 * Server-rendered redirect; under `output: 'export'` Next.js emits a
 * `<meta http-equiv="refresh">` page so no client JS is needed.
 */
export default function EntryRedirect(): never {
  redirect(`/${defaultLocale}/`);
}
