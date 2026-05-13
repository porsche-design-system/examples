"use client";

import { useCallback } from "react";
import {
  PLinkTileProduct,
} from "@porsche-design-system/components-react/ssr";
import type { CatalogProduct } from "@/app/data/get-catalog";
import type { Locale } from "@/app/i18n/config";
import { appHref, productDetailHref } from "@/app/i18n/href";
import { useProductFavorites } from "@/app/components/ProductFavoritesProvider";

type Props = {
  locale: Locale;
  product: CatalogProduct;
  aspectRatio?: "3/4" | "9/16";
  children?: React.ReactNode;
};

export function FavoriteLinkTileProduct({
  aspectRatio = "3/4",
  children,
  locale,
  product,
}: Props) {
  const { isFavorite, toggleFavorite } = useProductFavorites();
  const liked = isFavorite(product.slug);

  const onLike = useCallback(() => {
    toggleFavorite(product.slug);
  }, [product.slug, toggleFavorite]);

  return (
    <PLinkTileProduct
      aspectRatio={aspectRatio}
      description={product.vatNote}
      heading={product.name}
      href={productDetailHref(locale, product.slug)}
      liked={liked}
      onLike={onLike}
      price={product.price.formatted}
    >
      {children}
      {/* biome-ignore lint/performance/noImgElement: PLinkTileProduct default slot expects a bare <img>. */}
      <img
        alt={product.images[0]?.alt ?? ""}
        src={appHref(
          product.images[0]?.src ?? "/home-product-keychain.jpg",
        )}
      />
    </PLinkTileProduct>
  );
}
