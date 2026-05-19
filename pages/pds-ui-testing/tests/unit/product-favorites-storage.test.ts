import { afterEach, describe, expect, it, vi } from "vitest";
import {
  readFavoriteProductSlugs,
  writeFavoriteProductSlugs,
} from "@/app/components/product-favorites-storage";
import { withMockSessionStorage } from "./helpers/mock-session-storage";

describe("product-favorites-storage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("read returns empty array when sessionStorage is unavailable (SSR)", () => {
    vi.stubGlobal("window", undefined);
    expect(readFavoriteProductSlugs()).toEqual([]);
  });

  it("read returns empty array when key is missing", () => {
    withMockSessionStorage(() => {
      expect(readFavoriteProductSlugs()).toEqual([]);
    });
  });

  it("read returns empty array for invalid JSON", () => {
    withMockSessionStorage(
      () => {
        sessionStorage.setItem(
          "pds-ui-testing:product-favorite-slugs",
          "not-json",
        );
        expect(readFavoriteProductSlugs()).toEqual([]);
      },
      { "pds-ui-testing:product-favorite-slugs": "not-json" },
    );
  });

  it("read returns empty array when stored value is not an array", () => {
    withMockSessionStorage(
      () => {
        expect(readFavoriteProductSlugs()).toEqual([]);
      },
      { "pds-ui-testing:product-favorite-slugs": '{"foo":1}' },
    );
  });

  it("read keeps only string entries", () => {
    withMockSessionStorage(
      () => {
        expect(readFavoriteProductSlugs()).toEqual(["alpha", "beta"]);
      },
      {
        "pds-ui-testing:product-favorite-slugs":
          '["alpha",42,null,"beta",{}]',
      },
    );
  });

  it("write deduplicates slugs and round-trips via read", () => {
    withMockSessionStorage(() => {
      writeFavoriteProductSlugs(["a", "b", "a"]);
      expect(readFavoriteProductSlugs()).toEqual(["a", "b"]);
    });
  });

  it("write is a no-op when window is undefined", () => {
    vi.stubGlobal("window", undefined);
    expect(() => writeFavoriteProductSlugs(["x"])).not.toThrow();
  });

  it("read returns empty array when sessionStorage.getItem throws", () => {
    withMockSessionStorage((mock) => {
      vi.spyOn(mock, "getItem").mockImplementation(() => {
        throw new Error("quota");
      });
      expect(readFavoriteProductSlugs()).toEqual([]);
    });
  });

  it("write does not throw when sessionStorage.setItem throws", () => {
    withMockSessionStorage((mock) => {
      vi.spyOn(mock, "setItem").mockImplementation(() => {
        throw new Error("quota");
      });
      expect(() => writeFavoriteProductSlugs(["slug"])).not.toThrow();
    });
  });
});
