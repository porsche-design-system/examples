import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  ProductFavoritesProvider,
  useProductFavorites,
} from "@/app/components/favorites/ProductFavoritesProvider";
import { writeFavoriteProductSlugs } from "@/app/lib/product-favorites-storage";
import { createMockSessionStorage } from "./helpers/mock-session-storage";

function createWrapper() {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <ProductFavoritesProvider>{children}</ProductFavoritesProvider>;
  };
}

describe("ProductFavoritesProvider", () => {
  let restoreSessionStorage: (() => void) | undefined;

  beforeEach(() => {
    const mock = createMockSessionStorage();
    const previous = globalThis.sessionStorage;
    Object.defineProperty(globalThis, "sessionStorage", {
      value: mock,
      configurable: true,
      writable: true,
    });
    restoreSessionStorage = () => {
      Object.defineProperty(globalThis, "sessionStorage", {
        value: previous,
        configurable: true,
        writable: true,
      });
    };
  });

  afterEach(() => {
    restoreSessionStorage?.();
  });

  it("throws when useProductFavorites is used outside the provider", () => {
    expect(() => renderHook(() => useProductFavorites())).toThrow(
      "useProductFavorites must be used within ProductFavoritesProvider",
    );
  });

  it("hydrates favorites from sessionStorage", async () => {
    writeFavoriteProductSlugs(["cap", "bag"]);

    const { result } = renderHook(() => useProductFavorites(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isHydrated).toBe(true);
    });

    expect(result.current.favoriteSlugs).toEqual(["cap", "bag"]);
    expect(result.current.isFavorite("cap")).toBe(true);
    expect(result.current.isFavorite("missing")).toBe(false);
  });

  it("setLiked adds and removes slugs and persists to storage", async () => {
    const { result } = renderHook(() => useProductFavorites(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    act(() => {
      result.current.setLiked("jacket", true);
    });
    expect(result.current.favoriteSlugs).toEqual(["jacket"]);
    expect(result.current.isFavorite("jacket")).toBe(true);

    act(() => {
      result.current.setLiked("jacket", false);
    });
    expect(result.current.favoriteSlugs).toEqual([]);
    expect(result.current.isFavorite("jacket")).toBe(false);
  });

  it("toggleFavorite adds then removes a slug", async () => {
    const { result } = renderHook(() => useProductFavorites(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    act(() => {
      result.current.toggleFavorite("umbrella");
    });
    expect(result.current.isFavorite("umbrella")).toBe(true);

    act(() => {
      result.current.toggleFavorite("umbrella");
    });
    expect(result.current.isFavorite("umbrella")).toBe(false);
  });

  it("deduplicates when setLiked adds an existing slug", async () => {
    writeFavoriteProductSlugs(["existing"]);

    const { result } = renderHook(() => useProductFavorites(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    act(() => {
      result.current.setLiked("existing", true);
    });
    expect(result.current.favoriteSlugs).toEqual(["existing"]);
  });
});
