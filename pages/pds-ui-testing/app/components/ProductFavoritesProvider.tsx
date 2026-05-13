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

  const favoriteSlugs = useMemo(() => new Set(slugs ?? []), [slugs]);

  const isFavorite = useCallback(
    (slug: string) => favoriteSlugs.has(slug),
    [favoriteSlugs],
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
    () => ({ isFavorite, setLiked, toggleFavorite }),
    [isFavorite, setLiked, toggleFavorite],
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
