"use client";

import {
  CSSProperties,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import {
  PButton,
  PButtonPure,
  PDivider,
  PHeading,
  PInputSearch,
  PLinkPure,
  PModal,
  PText,
} from "@porsche-design-system/components-react/ssr";
import type { CatalogProduct } from "@/app/data/get-catalog";
import type { Locale } from "@/app/i18n/config";
import type { Dictionary } from "@/app/i18n/get-dictionary";
import { appHref, productDetailHref } from "@/app/i18n/href";

export type GlobalHeaderSearchCopy = Dictionary["header"]["searchModal"];

type Props = {
  copy: GlobalHeaderSearchCopy;
  label: string;
  locale: Locale;
  triggerSchemeClassName?: string;
};

const MAX_RESULTS = 24;
const MIN_QUERY_LEN = 2;

function loadProducts(locale: Locale): Promise<CatalogProduct[]> {
  return (
    locale === "de"
      ? import("@/app/data/catalog/products.de.json")
      : import("@/app/data/catalog/products.en.json")
  ).then((m) => m.default.products);
}

function searchInputValue(event: Event): string {
  const ce = event as Partial<CustomEvent<{ value?: unknown }>>;
  if (
    ce.detail != null &&
    typeof ce.detail === "object" &&
    "value" in ce.detail
  ) {
    const v = (ce.detail as { value?: unknown }).value;
    if (typeof v === "string") return v;
  }
  const target = event.target as unknown as { value?: unknown };
  if (target != null && typeof target.value === "string") return target.value;
  const current = event.currentTarget as unknown as { value?: unknown };
  if (current != null && typeof current.value === "string")
    return current.value;
  return "";
}

function scoreProduct(product: CatalogProduct, needle: string): number {
  if (needle.length < MIN_QUERY_LEN) return 0;
  const n = needle.toLowerCase();
  let score = 0;
  const bump = (text: string, weight: number) => {
    const h = text.toLowerCase();
    if (!h.includes(n)) return;
    score += weight;
    if (h.startsWith(n)) score += Math.ceil(weight / 3);
  };

  bump(product.name, 14);
  bump(product.teaser, 5);
  bump(product.description, 3);
  bump(product.sku, 12);
  bump(product.slug.replace(/-/g, " "), 6);
  for (const x of product.categories) bump(x, 3);
  for (const x of product.collections) bump(x, 3);
  for (const x of product.tags ?? []) bump(x, 2);
  for (const x of product.audiences ?? []) bump(x, 2);
  return score;
}

function rankProducts(products: CatalogProduct[], q: string): CatalogProduct[] {
  const needle = q.trim().toLowerCase();
  if (needle.length < MIN_QUERY_LEN) return [];
  return [...products]
    .map((p) => ({ p, s: scoreProduct(p, needle) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, MAX_RESULTS)
    .map(({ p }) => p);
}

export function GlobalHeaderProductSearch({
  copy,
  label,
  locale,
  triggerSchemeClassName,
}: Props) {
  const pathname = usePathname();
  const pathWhenOpenedRef = useRef<string | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loadError, setLoadError] = useState(false);
  const deferredQuery = useDeferredValue(query);
  const prevOpenRef = useRef(false);

  useEffect(() => {
    if (open && !prevOpenRef.current) {
      pathWhenOpenedRef.current = pathname;
    }
    prevOpenRef.current = open;
  }, [open, pathname]);

  useEffect(() => {
    if (!open || pathWhenOpenedRef.current === null) return;
    if (pathname !== pathWhenOpenedRef.current) setOpen(false);
  }, [pathname, open]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoadError(false);
    loadProducts(locale).then(
      (list) => {
        if (!cancelled) setProducts(list);
      },
      () => {
        if (!cancelled) setLoadError(true);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [open, locale]);

  useEffect(() => {
    if (open) return;
    setQuery("");
    setProducts([]);
  }, [open]);

  const results = useMemo(
    () => rankProducts(products, deferredQuery),
    [deferredQuery, products],
  );

  const trimmed = query.trim();
  const deferredTrimmed = deferredQuery.trim();
  const showPrompt = trimmed.length < MIN_QUERY_LEN;
  const showSearching =
    trimmed.length >= MIN_QUERY_LEN && trimmed !== deferredTrimmed;

  const MODAL_STYLE = {
    "--p-modal-width": "min(100vw - 2rem, 760px)",
  } as CSSProperties;

  return (
    <>
      <PButtonPure
        aria={{ "aria-haspopup": "dialog" }}
        className={`p-static-xs -m-static-xs ${triggerSchemeClassName ?? ""}`}
        hideLabel
        icon="search"
        onClick={() => setOpen(true)}
        size={{ base: "small", m: "medium" }}
        type="button"
      >
        {label}
      </PButtonPure>

      <PModal
        aria={{ "aria-label": copy.ariaLabel }}
        backdrop="blur"
        onDismiss={() => setOpen(false)}
        open={open}
        className="scheme-light"
        style={MODAL_STYLE}
      >
        <div className="flex flex-col gap-fluid-md">
          <div className="grid gap-static-xs">
            <PHeading size="large" tag="h2">
              {copy.title}
            </PHeading>
            <PText color="contrast-medium" size="small">
              {copy.subtitle}
            </PText>
          </div>

          <PInputSearch
            clear
            indicator
            label={copy.queryLabel}
            description={copy.hint}
            name="global-header-product-search"
            onChange={(e) => setQuery(searchInputValue(e as Event))}
            onInput={(e) => setQuery(searchInputValue(e as Event))}
            placeholder={copy.queryPlaceholder}
            value={query}
          />

          <div className="min-h-[120px]">
            {loadError ? (
              <PText color="contrast-medium">{copy.loadError}</PText>
            ) : products.length === 0 ? (
              <PText color="contrast-medium">{copy.loading}</PText>
            ) : showPrompt ? (
              <PText color="contrast-medium">{copy.emptyPrompt}</PText>
            ) : showSearching ? (
              <PText color="contrast-medium" size="small">
                {copy.searching}
              </PText>
            ) : results.length === 0 ? (
              <PText color="contrast-medium">{copy.noMatches}</PText>
            ) : (
              <ul className="flex flex-col gap-static-sm">
                {results.map((product) => {
                  const img = product.images[0];
                  return (
                    <li key={product.id} className="p-static-sm">
                      <PLinkPure
                        href={productDetailHref(locale, product.slug)}
                        icon="none"
                        stretch
                      >
                        <span className="flex gap-static-sm p-static-xs">
                          {/* biome-ignore lint/performance/noImgElement: Thumbnail matches catalog tile pattern. */}
                          <img
                            alt=""
                            className="h-12 w-12 shrink-0 rounded-md object-cover"
                            src={appHref(
                              img?.src ?? "/home-product-keychain.jpg",
                            )}
                          />
                          <PText color="contrast-medium" size="small">
                            <span className="font-semibold">
                              {product.name}
                            </span>
                            <br />
                            {product.teaser}
                            <span className="ms-static-xs font-semibold">
                              {product.price.formatted}
                            </span>
                          </PText>
                        </span>
                      </PLinkPure>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="flex justify-end">
            <PButton
              onClick={() => setOpen(false)}
              type="button"
              variant="secondary"
            >
              {copy.close}
            </PButton>
          </div>
        </div>
      </PModal>
    </>
  );
}
