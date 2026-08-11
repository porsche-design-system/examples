import { afterEach, describe, expect, it, vi } from "vitest";
import {
  PRODUCTS_FAVORITES_QUERY,
  PRODUCTS_FAVORITES_VALUE,
  appHref,
  contactHref,
  localeHomeHref,
  newsletterHref,
  productDetailHref,
  productsFavoritesHref,
  productsFilterHref,
  productsIndexHref,
} from "@/app/i18n/href";

describe("href helpers", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("appHref", () => {
    it("returns absolute paths without base path", () => {
      expect(appHref("/en/products/")).toBe("/en/products/");
    });

    it("prepends NEXT_PUBLIC_BASE_PATH when set", () => {
      vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/examples/v4/pds-ui-testing");
      expect(appHref("/en/")).toBe("/examples/v4/pds-ui-testing/en/");
    });

    it("strips trailing slash from base path longer than one character", () => {
      vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/base/");
      expect(appHref("/hero.jpg")).toBe("/base/hero.jpg");
    });

    it("normalizes paths without leading slash", () => {
      expect(appHref("hero.jpg")).toBe("/hero.jpg");
    });
  });

  describe("locale routes", () => {
    it("builds locale home href", () => {
      expect(localeHomeHref("de")).toBe("/de/");
    });

    it("builds products index href", () => {
      expect(productsIndexHref("en")).toBe("/en/products/");
    });

    it("builds product detail href with trailing slash", () => {
      expect(productDetailHref("en", "test-slug")).toBe(
        "/en/products/test-slug/",
      );
    });

    it("builds favorites query href", () => {
      expect(productsFavoritesHref("en")).toBe(
        `/en/products/?${PRODUCTS_FAVORITES_QUERY}=${PRODUCTS_FAVORITES_VALUE}`,
      );
    });

    it("builds newsletter href with trailing slash", () => {
      expect(newsletterHref("en")).toBe("/en/newsletter/");
      expect(newsletterHref("de")).toBe("/de/newsletter/");
    });

    it("builds contact href with trailing slash", () => {
      expect(contactHref("en")).toBe("/en/contact/");
      expect(contactHref("de")).toBe("/de/contact/");
    });
  });

  describe("productsFilterHref", () => {
    it("returns index path when filter is empty", () => {
      expect(productsFilterHref("en", {})).toBe("/en/products/");
    });

    it("serializes facet params as comma-separated values", () => {
      const href = productsFilterHref("en", {
        audiences: ["men", "women"],
        categories: ["apparel"],
        collections: ["porsche-design"],
        flags: ["reduced", "new-release"],
        tags: ["urbanist"],
      });
      const url = new URL(href, "http://localhost");
      expect(url.pathname).toBe("/en/products/");
      expect(url.searchParams.get("audience")).toBe("men,women");
      expect(url.searchParams.get("category")).toBe("apparel");
      expect(url.searchParams.get("collection")).toBe("porsche-design");
      expect(url.searchParams.get("flag")).toBe("reduced,new-release");
      expect(url.searchParams.get("tag")).toBe("urbanist");
    });
  });
});
