/** Primary page heading (`h1`) id — target of the global header skip link. */
export const PAGE_HEADING_ID = "page-heading";

/**
 * Scrolls to and focuses the page `h1`. Used by the skip link because `<base href>`
 * in the locale layout makes `href="#…"` resolve to the base path and trigger a reload.
 */
export function skipToPageHeading(): void {
  const target = document.getElementById(PAGE_HEADING_ID);
  if (!target) return;

  target.scrollIntoView({ block: "start" });

  const hadTabIndex = target.hasAttribute("tabindex");
  if (!hadTabIndex) {
    target.setAttribute("tabindex", "-1");
  }
  target.focus({ preventScroll: true });
  if (!hadTabIndex) {
    target.removeAttribute("tabindex");
  }

  const { pathname, search } = window.location;
  history.replaceState(history.state, "", `${pathname}${search}#${PAGE_HEADING_ID}`);
}
