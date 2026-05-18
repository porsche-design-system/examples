"use client";

import {
  type ComponentProps,
  type CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  PAccordion,
  PButton,
  PCheckbox,
  PFlyout,
  PHeading,
  PIcon,
  PInlineNotification,
  PSelect,
  PSelectOption,
  PTabsBar,
  PTagDismissible,
  PText,
} from "@porsche-design-system/components-react/ssr";
import { CatalogProductGrid } from "@/app/components/CatalogProductGrid";
import { useProductFavorites } from "@/app/components/ProductFavoritesProvider";
import {
  type CatalogFacetFilter,
  type CatalogProduct,
  filterCatalogProducts,
} from "@/app/data/get-catalog";
import {
  audienceSlugs,
  categorySlugs,
  collectionSlugs,
  isAudienceSlug,
  isCategorySlug,
  isCollectionSlug,
  isLifestyleTagSlug,
  isMerchandisingFlagSlug,
  lifestyleTagSlugs,
  merchandisingFlagSlugs,
  type AudienceSlug,
  type CategorySlug,
  type CollectionSlug,
  type LifestyleTagSlug,
  type MerchandisingFlagSlug,
} from "@/app/data/catalog/taxonomy";
import type { Locale } from "@/app/i18n/config";
import type { Dictionary } from "@/app/i18n/get-dictionary";
import {
  PRODUCTS_FAVORITES_QUERY,
  PRODUCTS_FAVORITES_VALUE,
} from "@/app/i18n/href";

type ProductListCopy = Dictionary["pages"]["productList"];

type Props = {
  copy: ProductListCopy;
  locale: Locale;
  products: CatalogProduct[];
};

type FacetDefinition<T extends string> = {
  key: keyof CatalogFacetFilter;
  param: string;
  legend: string;
  values: readonly T[];
  labels: Record<string, string>;
  isValid: (value: string) => value is T;
};

type SortKey = "recommended" | "price-asc" | "price-desc" | "name-asc";

type QuickFilterDefinition = {
  label: string;
  filter: Pick<CatalogFacetFilter, "audiences" | "categories" | "collections">;
};

const sortKeys = [
  "recommended",
  "price-asc",
  "price-desc",
  "name-asc",
] as const;

function parseFacetValues<T extends string>(
  searchParams: URLSearchParams,
  param: string,
  isValid: (value: string) => value is T,
): T[] {
  const raw = searchParams.get(param);
  if (!raw) return [];
  return raw.split(",").filter(isValid);
}

function buildFilter(searchParams: URLSearchParams): CatalogFacetFilter {
  const flags = parseFacetValues(searchParams, "flag", isMerchandisingFlagSlug);
  // Legacy share links: `?reduced=1` maps to the Highlights flag `reduced`.
  if (searchParams.get("reduced") === "1" && !flags.includes("reduced")) {
    flags.push("reduced");
  }

  return {
    audiences: parseFacetValues(searchParams, "audience", isAudienceSlug),
    categories: parseFacetValues(searchParams, "category", isCategorySlug),
    collections: parseFacetValues(searchParams, "collection", isCollectionSlug),
    flags,
    tags: parseFacetValues(searchParams, "tag", isLifestyleTagSlug),
  };
}

function isSelected<T extends string>(
  selected: readonly T[] | undefined,
  value: T,
) {
  return selected?.includes(value) ?? false;
}

function formatCount(template: string, count: number): string {
  return template.replace("{count}", String(count));
}

function formatFilterLabel(template: string, filterLabel: string): string {
  return template.replace("{filter}", filterLabel);
}

function isSortKey(value: string | null): value is SortKey {
  return sortKeys.includes(value as SortKey);
}

function getSortKey(searchParams: URLSearchParams): SortKey {
  const sort = searchParams.get("sort");
  return isSortKey(sort) ? sort : "recommended";
}

function sortProducts(
  products: CatalogProduct[],
  sortKey: SortKey,
): CatalogProduct[] {
  const sortedProducts = [...products];

  switch (sortKey) {
    case "price-asc":
      return sortedProducts.sort((a, b) => a.price.amount - b.price.amount);
    case "price-desc":
      return sortedProducts.sort((a, b) => b.price.amount - a.price.amount);
    case "name-asc":
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    case "recommended":
      return sortedProducts;
  }
}

function areSameValues<T extends string>(
  currentValues: readonly T[] | undefined,
  expectedValues: readonly T[] | undefined,
): boolean {
  const current = currentValues ?? [];
  const expected = expectedValues ?? [];
  return (
    current.length === expected.length &&
    expected.every((value) => current.includes(value))
  );
}

type FilterDismissibleTagProps = Omit<
  ComponentProps<typeof PTagDismissible>,
  "ref"
> & {
  onDismiss: () => void;
};

/**
 * v4.1.0 `p-tag-dismissible` is a single shadow-DOM `<button>` (no `dismiss` custom event).
 * Clicks must be handled with a native `click` listener on the host so they are not lost
 * to React’s custom-element / shadow-tree event wiring.
 */
function FilterDismissibleTag({
  onDismiss,
  ...props
}: FilterDismissibleTagProps) {
  const hostRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const handleClick = () => {
      onDismiss();
    };
    el.addEventListener("click", handleClick);
    return () => {
      el.removeEventListener("click", handleClick);
    };
  }, [onDismiss]);
  return <PTagDismissible ref={hostRef} {...props} />;
}

export function ProductCatalogBrowser({ copy, locale, products }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { favoriteSlugs, isFavorite } = useProductFavorites();
  const [isFilterFlyoutOpen, setIsFilterFlyoutOpen] = useState(false);
  const [openFacets, setOpenFacets] = useState<Record<string, boolean>>({
    audiences: true,
    categories: false,
    collections: false,
    flags: false,
    tags: false,
  });

  const filter = useMemo(() => buildFilter(searchParams), [searchParams]);
  const sortKey = getSortKey(searchParams);
  const favoritesOnly =
    searchParams.get(PRODUCTS_FAVORITES_QUERY) === PRODUCTS_FAVORITES_VALUE;
  const filteredProducts = useMemo(
    () => filterCatalogProducts(products, filter),
    [filter, products],
  );
  const sortedProducts = useMemo(
    () => sortProducts(filteredProducts, sortKey),
    [filteredProducts, sortKey],
  );
  const displayProducts = useMemo(() => {
    if (!favoritesOnly) return sortedProducts;
    return sortedProducts.filter((p) => isFavorite(p.slug));
  }, [favoritesOnly, isFavorite, sortedProducts]);

  const facets = useMemo(
    () =>
      [
        {
          key: "audiences",
          param: "audience",
          legend: copy.filters.audience,
          values: audienceSlugs,
          labels: copy.filters.audiences as Record<string, string>,
          isValid: isAudienceSlug,
        },
        {
          key: "categories",
          param: "category",
          legend: copy.filters.category,
          values: categorySlugs,
          labels: copy.filters.categories as Record<string, string>,
          isValid: isCategorySlug,
        },
        {
          key: "collections",
          param: "collection",
          legend: copy.filters.collection,
          values: collectionSlugs,
          labels: copy.filters.collections as Record<string, string>,
          isValid: isCollectionSlug,
        },
        {
          key: "flags",
          param: "flag",
          legend: copy.filters.flag,
          values: merchandisingFlagSlugs,
          labels: copy.filters.flags as Record<string, string>,
          isValid: isMerchandisingFlagSlug,
        },
        {
          key: "tags",
          param: "tag",
          legend: copy.filters.tag,
          values: lifestyleTagSlugs,
          labels: copy.filters.tags as Record<string, string>,
          isValid: isLifestyleTagSlug,
        },
      ] satisfies [
        FacetDefinition<AudienceSlug>,
        FacetDefinition<CategorySlug>,
        FacetDefinition<CollectionSlug>,
        FacetDefinition<MerchandisingFlagSlug>,
        FacetDefinition<LifestyleTagSlug>,
      ],
    [copy],
  );

  const quickFilters = useMemo(
    () =>
      [
        {
          label: copy.quickFilters.all,
          filter: {},
        },
        {
          label: copy.quickFilters.womenApparel,
          filter: { audiences: ["women"], categories: ["apparel"] },
        },
        {
          label: copy.quickFilters.menApparel,
          filter: { audiences: ["men"], categories: ["apparel"] },
        },
        {
          label: copy.quickFilters.kidsApparel,
          filter: { audiences: ["kids"], categories: ["apparel"] },
        },
        {
          label: copy.quickFilters.porscheDesign,
          filter: { collections: ["porsche-design"] },
        },
      ] satisfies QuickFilterDefinition[],
    [copy],
  );

  const activeFilters = facets.flatMap((facet) => {
    const selectedValues = filter[facet.key] ?? [];
    return selectedValues.map((value) => ({
      facet,
      value,
      label: facet.labels[value],
    }));
  });

  function updateFacet<T extends string>(
    facet: FacetDefinition<T>,
    value: T,
    checked: boolean,
  ) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("reduced");
    const selected = parseFacetValues(params, facet.param, facet.isValid);
    const nextValues = checked
      ? Array.from(new Set([...selected, value]))
      : selected.filter((selectedValue) => selectedValue !== value);

    if (nextValues.length > 0) {
      params.set(facet.param, nextValues.join(","));
    } else {
      params.delete(facet.param);
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  function applyQuickFilter(quickFilter: QuickFilterDefinition) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("audience");
    params.delete("category");
    params.delete("collection");
    params.delete(PRODUCTS_FAVORITES_QUERY);
    params.delete("reduced");

    if (quickFilter.filter.audiences?.length) {
      params.set("audience", quickFilter.filter.audiences.join(","));
    }
    if (quickFilter.filter.categories?.length) {
      params.set("category", quickFilter.filter.categories.join(","));
    }
    if (quickFilter.filter.collections?.length) {
      params.set("collection", quickFilter.filter.collections.join(","));
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  function updateSort(nextSortKey: SortKey) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextSortKey === "recommended") {
      params.delete("sort");
    } else {
      params.set("sort", nextSortKey);
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("audience");
    params.delete("category");
    params.delete("collection");
    params.delete("flag");
    params.delete("tag");
    params.delete(PRODUCTS_FAVORITES_QUERY);
    params.delete("reduced");

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  function clearFavoritesOnly() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(PRODUCTS_FAVORITES_QUERY);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  function toggleFacetPanel(facetKey: keyof CatalogFacetFilter, open: boolean) {
    setOpenFacets((current) => ({ ...current, [facetKey]: open }));
  }

  const activeQuickFilterIndex = quickFilters.findIndex(
    ({ filter: quickFilter }) => {
      return (
        areSameValues(filter.audiences, quickFilter.audiences) &&
        areSameValues(filter.categories, quickFilter.categories) &&
        areSameValues(filter.collections, quickFilter.collections)
      );
    },
  );

  const resultCountLabel = formatCount(
    copy.resultCount,
    displayProducts.length,
  );
  const showProductsLabel = formatCount(
    copy.showProducts,
    displayProducts.length,
  );

  const emptyNoFavoritesSaved =
    favoritesOnly && favoriteSlugs.length === 0 && displayProducts.length === 0;
  const emptyTitleCopy = emptyNoFavoritesSaved
    ? copy.favoritesEmptyTitle
    : copy.emptyTitle;
  const emptyTextCopy = emptyNoFavoritesSaved
    ? copy.favoritesEmptyText
    : copy.emptyText;

  return (
    <>
      <section aria-label={copy.toolbarLabel} className="col-basic grid">
        <div className="flex justify-center">
          <PTabsBar
            activeTabIndex={
              activeQuickFilterIndex >= 0 ? activeQuickFilterIndex : undefined
            }
            onUpdate={(event) => {
              const quickFilter = quickFilters[event.detail.activeTabIndex];
              if (quickFilter) applyQuickFilter(quickFilter);
            }}
          >
            {quickFilters.map((quickFilter) => (
              <button key={quickFilter.label} type="button">
                {quickFilter.label}
              </button>
            ))}
          </PTabsBar>
        </div>

        <div className="flex flex-col gap-fluid-sm md:flex-row md:items-end md:justify-between mt-fluid-lg">
          <div className="flex flex-wrap items-center gap-static-md">
            <PButton
              icon="adjust"
              onClick={() => setIsFilterFlyoutOpen(true)}
              type="button"
              aria={{ "aria-haspopup": "dialog" }}
            >
              {copy.filterButtonLabel}
            </PButton>
            <PText color="contrast-medium" aria-live="polite">
              {resultCountLabel}
            </PText>
          </div>
          <div className="w-full md:w-[240px]">
            <PSelect
              label={copy.sort.label}
              name="sort"
              onChange={(event) => updateSort(event.detail.value as SortKey)}
              value={sortKey}
            >
              <PSelectOption value="recommended">
                {copy.sort.recommended}
              </PSelectOption>
              <PSelectOption value="price-asc">
                {copy.sort.priceAsc}
              </PSelectOption>
              <PSelectOption value="price-desc">
                {copy.sort.priceDesc}
              </PSelectOption>
              <PSelectOption value="name-asc">
                {copy.sort.nameAsc}
              </PSelectOption>
            </PSelect>
          </div>
        </div>

        {activeFilters.length > 0 || favoritesOnly ? (
          <div className="flex flex-wrap items-center gap-static-sm mt-fluid-md">
            {favoritesOnly ? (
              <FilterDismissibleTag
                aria={{
                  "aria-label": copy.favoritesOnlyDismissAria,
                }}
                compact
                key="favorites-only"
                onDismiss={clearFavoritesOnly}
              >
                {copy.favoritesOnlyLabel}
              </FilterDismissibleTag>
            ) : null}
            {activeFilters.map(({ facet, label, value }) => (
              <FilterDismissibleTag
                aria={{
                  "aria-label": formatFilterLabel(copy.dismissFilter, label),
                }}
                compact
                key={`${facet.param}-${value}`}
                onDismiss={() => updateFacet(facet, value, false)}
              >
                {label}
              </FilterDismissibleTag>
            ))}
            <PButton
              onClick={clearFilters}
              type="button"
              compact
              variant="secondary"
              icon="delete"
            >
              {copy.clearFilters}
            </PButton>
          </div>
        ) : null}
      </section>

      <PFlyout
        aria={{ "aria-label": copy.filters.title }}
        footerBehavior="fixed"
        onDismiss={() => setIsFilterFlyoutOpen(false)}
        open={isFilterFlyoutOpen}
        style={
          {
            "--p-flyout-width": "500px",
          } as CSSProperties
        }
      >
        <div className="grid gap-static-lg">
          <div className="flex items-center gap-static-sm" slot="header">
            <PIcon name="adjust" size="medium" />
            <PHeading size="large" tag="h2">
              {copy.filterButtonLabel}
            </PHeading>
          </div>

          <div className="flex flex-col gap-static-sm">
            {/* Mount facet checkboxes only while the flyout is open so SSR does not
                render PDS DSRCheckbox (native input with `checked` but no `onChange`),
                which triggers React 19 dev warnings. Client-open uses the web component. */}
            {isFilterFlyoutOpen
              ? facets.map((facet) => (
                  <PAccordion
                    alignMarker="end"
                    background="surface"
                    key={facet.param}
                    onUpdate={(event) =>
                      toggleFacetPanel(facet.key, event.detail.open)
                    }
                    open={openFacets[facet.key]}
                  >
                    <span slot="summary">{facet.legend}</span>
                    <div className="flex flex-col gap-static-sm">
                      {facet.values.map((value) => {
                        const selected = isSelected(filter[facet.key], value);

                        return (
                          <PCheckbox
                            checked={selected}
                            key={value}
                            label={facet.labels[value]}
                            name={facet.param}
                            onChange={() =>
                              updateFacet(facet, value, !selected)
                            }
                            value={value}
                          />
                        );
                      })}
                    </div>
                  </PAccordion>
                ))
              : null}
          </div>
        </div>

        <div className="flex gap-static-sm" slot="footer">
          <PButton onClick={() => setIsFilterFlyoutOpen(false)} type="button">
            {showProductsLabel}
          </PButton>
          {activeFilters.length > 0 || favoritesOnly ? (
            <PButton onClick={clearFilters} type="button" variant="secondary">
              {copy.clearFilters}
            </PButton>
          ) : null}
        </div>
      </PFlyout>

      {displayProducts.length > 0 ? (
        <>
          <h2 className="sr-only">{copy.productsRegionLabel}</h2>
          <CatalogProductGrid
            locale={locale}
            newReleaseTagLabel={copy.newReleaseTag}
            pricingCopy={copy.pricing}
            products={displayProducts}
            sectionAriaLabel={copy.productsRegionLabel}
          />
        </>
      ) : null}
      <section className="col-basic grid gap-fluid-sm" role="status">
        {displayProducts.length === 0 ? (
          <PInlineNotification
            description={emptyTextCopy}
            dismissButton={false}
            heading={emptyTitleCopy}
            headingTag="h2"
            state="info"
          />
        ) : null}
      </section>
    </>
  );
}
