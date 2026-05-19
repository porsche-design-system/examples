"use client";

import { PButton } from "@porsche-design-system/components-react/ssr";
import { useProductFavorites } from "@/app/components/favorites/ProductFavoritesProvider";

type Props = {
  productSlug: string;
  labelAdd: string;
  labelRemove: string;
};

export function ProductDetailFavoriteButton({
  labelAdd,
  labelRemove,
  productSlug,
}: Props) {
  const { isFavorite, setLiked } = useProductFavorites();
  const pressed = isFavorite(productSlug);

  return (
    <PButton
      aria={{
        "aria-label": pressed ? labelRemove : labelAdd,
        "aria-pressed": pressed,
      }}
      hideLabel
      icon={pressed ? "heart-filled" : "heart"}
      onClick={() => setLiked(productSlug, !pressed)}
      type="button"
      variant="secondary"
    >
      {pressed ? labelRemove : labelAdd}
    </PButton>
  );
}
