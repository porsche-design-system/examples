"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  readFavoriteProductSlugs,
  writeFavoriteProductSlugs,
} from "@/app/components/product-favorites-storage";

type ProductFavoritesContextValue = {
  /** Slugs currently in session favorites (empty until hydrated on client). */
  favoriteSlugs: readonly string[];
  /** True after session favorites were read from storage (avoids false add/remove on load). */
  isHydrated: boolean;
  isFavorite: (slug: string) => boolean;
  setLiked: (slug: string, liked: boolean) => void;
  /** Toggles favorite from UI where `like` event detail may be missing or unreliable. */
  toggleFavorite: (slug: string) => void;
};

const ProductFavoritesContext =
  createContext<ProductFavoritesContextValue | null>(null);

export function ProductFavoritesProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[] | null>(null);

  useEffect(() => {
    setSlugs(readFavoriteProductSlugs());
  }, []);

  const isHydrated = slugs !== null;
  const favoriteSlugList = useMemo(() => slugs ?? [], [slugs]);
  const favoriteSlugSet = useMemo(
    () => new Set(favoriteSlugList),
    [favoriteSlugList],
  );

  const isFavorite = useCallback(
    (slug: string) => favoriteSlugSet.has(slug),
    [favoriteSlugSet],
  );

  const setLiked = useCallback((slug: string, liked: boolean) => {
    setSlugs((prev) => {
      const base = prev ?? readFavoriteProductSlugs();
      const nextSet = new Set(base);
      if (liked) nextSet.add(slug);
      else nextSet.delete(slug);
      const next = [...nextSet];
      writeFavoriteProductSlugs(next);
      return next;
    });
  }, []);

  const toggleFavorite = useCallback((slug: string) => {
    setSlugs((prev) => {
      const base = prev ?? readFavoriteProductSlugs();
      const nextSet = new Set(base);
      if (nextSet.has(slug)) nextSet.delete(slug);
      else nextSet.add(slug);
      const next = [...nextSet];
      writeFavoriteProductSlugs(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      favoriteSlugs: favoriteSlugList,
      isHydrated,
      isFavorite,
      setLiked,
      toggleFavorite,
    }),
    [favoriteSlugList, isHydrated, isFavorite, setLiked, toggleFavorite],
  );

  return (
    <ProductFavoritesContext.Provider value={value}>
      {children}
    </ProductFavoritesContext.Provider>
  );
}

export function useProductFavorites(): ProductFavoritesContextValue {
  const ctx = useContext(ProductFavoritesContext);
  if (!ctx) {
    throw new Error(
      "useProductFavorites must be used within ProductFavoritesProvider",
    );
  }
  return ctx;
}
