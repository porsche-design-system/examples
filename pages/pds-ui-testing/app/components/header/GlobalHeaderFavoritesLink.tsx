"use client";

import { PLinkPure } from "@porsche-design-system/components-react/ssr";
import { useProductFavorites } from "@/app/components/favorites/ProductFavoritesProvider";
import type { Locale } from "@/app/i18n/config";
import type { Dictionary } from "@/app/i18n/get-dictionary";
import { productsFavoritesHref } from "@/app/i18n/href";

export type GlobalHeaderFavoritesCopy = Pick<
  Dictionary["header"],
  | "favorites"
  | "favoritesAriaCount"
  | "favoritesAriaEmpty"
  | "favoritesLiveCount"
  | "favoritesLiveEmpty"
>;

type Props = {
  copy: GlobalHeaderFavoritesCopy;
  locale: Locale;
};

function formatCount(template: string, count: number): string {
  return template.replace("{count}", String(count));
}

export function GlobalHeaderFavoritesLink({ copy, locale }: Props) {
  const { favoriteSlugs } = useProductFavorites();
  const count = favoriteSlugs.length;
  const href = productsFavoritesHref(locale);

  const liveText =
    count === 0
      ? copy.favoritesLiveEmpty
      : formatCount(copy.favoritesLiveCount, count);
  const ariaLabel =
    count === 0
      ? copy.favoritesAriaEmpty
      : formatCount(copy.favoritesAriaCount, count);

  return (
    <span className="relative inline-flex">
      <PLinkPure
        aria={{ "aria-label": ariaLabel }}
        className="p-static-xs -m-static-xs"
        hideLabel
        href={href}
        icon="heart"
        size={{ base: "small", m: "medium" }}
      >
        {copy.favorites}
      </PLinkPure>
      {count > 0 ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-0 end-0 flex min-h-[1.125rem] min-w-[1.125rem] translate-x-1/4 -translate-y-1/4 items-center justify-center rounded-full bg-contrast-high px-static-xxs text-[0.625rem] font-semibold leading-none text-canvas tabular-nums"
        >
          {count}
        </span>
      ) : null}
      <span aria-atomic="true" aria-live="polite" className="sr-only">
        {liveText}
      </span>
    </span>
  );
}
