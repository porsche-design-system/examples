"use client";

import {
  PToast,
  useToastManager,
} from "@porsche-design-system/components-react/ssr";
import { useEffect, useRef } from "react";
import { useProductFavorites } from "@/app/components/ProductFavoritesProvider";

export type FavoriteToastCopy = {
  added: string;
  removed: string;
};

type Props = {
  copy: FavoriteToastCopy;
};

/**
 * Observes session favorites and shows PDS toasts on single add/remove actions.
 * Kept separate from {@link ProductFavoritesProvider} so tile/detail favorite toggles stay unchanged.
 */
export function ProductFavoriteToasts({ copy }: Props) {
  const { favoriteSlugs, isHydrated } = useProductFavorites();
  const { addMessage } = useToastManager();
  const previousSlugsRef = useRef<readonly string[] | null>(null);

  useEffect(() => {
    if (!isHydrated) return;

    if (previousSlugsRef.current === null) {
      previousSlugsRef.current = favoriteSlugs;
      return;
    }

    const previous = new Set(previousSlugsRef.current);
    const current = new Set(favoriteSlugs);
    const added = favoriteSlugs.filter((slug) => !previous.has(slug));
    const removed = previousSlugsRef.current.filter((slug) => !current.has(slug));

    previousSlugsRef.current = favoriteSlugs;

    if (added.length === 1 && removed.length === 0) {
      addMessage({
        text: copy.added,
        state: "success",
      });
      return;
    }

    if (removed.length === 1 && added.length === 0) {
      addMessage({
        text: copy.removed,
        state: "warning",
      });
    }
  }, [addMessage, copy.added, copy.removed, favoriteSlugs, isHydrated]);

  return <PToast />;
}
