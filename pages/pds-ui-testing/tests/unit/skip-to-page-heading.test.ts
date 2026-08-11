import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  PAGE_HEADING_ID,
  skipToPageHeading,
} from "@/app/lib/skip-to-page-heading";

describe("skipToPageHeading", () => {
  const replaceState = vi.fn();

  beforeEach(() => {
    document.body.innerHTML = "";
    vi.stubGlobal("history", { ...history, replaceState, state: null });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does nothing when the page heading is missing", () => {
    skipToPageHeading();
    expect(replaceState).not.toHaveBeenCalled();
  });

  it("scrolls to, focuses, and updates the URL hash", () => {
    const heading = document.createElement("h1");
    heading.id = PAGE_HEADING_ID;
    const scrollIntoView = vi.fn();
    const focus = vi.fn();
    heading.scrollIntoView = scrollIntoView;
    heading.focus = focus;
    document.body.append(heading);

    window.history.replaceState = replaceState;
    Object.defineProperty(window, "location", {
      value: { pathname: "/en/products/", search: "?sort=price" },
      configurable: true,
    });

    skipToPageHeading();

    expect(scrollIntoView).toHaveBeenCalledWith({ block: "start" });
    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
    expect(heading.hasAttribute("tabindex")).toBe(false);
    expect(replaceState).toHaveBeenCalledWith(
      null,
      "",
      `/en/products/?sort=price#${PAGE_HEADING_ID}`,
    );
  });

  it("temporarily sets tabindex when the heading is not focusable", () => {
    const heading = document.createElement("h1");
    heading.id = PAGE_HEADING_ID;
    heading.scrollIntoView = vi.fn();
    heading.focus = vi.fn();
    document.body.append(heading);

    skipToPageHeading();

    expect(heading.hasAttribute("tabindex")).toBe(false);
  });

  it("preserves an existing tabindex attribute", () => {
    const heading = document.createElement("h1");
    heading.id = PAGE_HEADING_ID;
    heading.setAttribute("tabindex", "0");
    heading.scrollIntoView = vi.fn();
    heading.focus = vi.fn();
    document.body.append(heading);

    skipToPageHeading();

    expect(heading.getAttribute("tabindex")).toBe("0");
  });
});
