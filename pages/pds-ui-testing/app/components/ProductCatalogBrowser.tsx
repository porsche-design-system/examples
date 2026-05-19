"use client";

import {
  type ComponentProps,
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { useCatalogQueryParams } from "@/app/components/use-catalog-query-params";
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
  areSameFacetValues,
  buildCatalogFilterFromParams,
  formatCatalogCount,
  formatCatalogFilterLabel,
  isFacetValueSelected,
  isFavoritesOnlyQuery,
  parseFacetValues,
} from "@/app/lib/catalog-query";
import {
  type CatalogSortKey,
  getCatalogSortKey,
  sortCatalogProducts,
} from "@/app/lib/catalog-sort";
import {
  PRODUCTS_FAVORITES_QUERY,
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

type QuickFilterDefinition = {
  label: string;
  filter: Pick<CatalogFacetFilter, "audiences" | "categories" | "collections">;
};

const TAG_DISMISSIBLE = "p-tag-dismissible";

type PdsStencilHost = HTMLElement & {
  componentOnReady?: () => Promise<void>;
};

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
 *
 * Uses a callback ref and waits for the Stencil host to be defined and ready. A plain
 * `useEffect` + object ref can run before the custom element upgrades (common on static
 * preview loads with URL query filters), leaving chips visible but not interactive.
 */
function FilterDismissibleTag({
  onDismiss,
  ...props
}: FilterDismissibleTagProps) {
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;
  const cleanupRef = useRef<(() => void) | null>(null);

  const hostRef = useCallback((host: HTMLElement | null) => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    if (!host) return;

    const session = { cancelled: false };
    const handleClick = () => {
      onDismissRef.current();
    };

    const attach = () => {
      if (session.cancelled) return;
      host.addEventListener("click", handleClick);
    };

    cleanupRef.current = () => {
      session.cancelled = true;
      host.removeEventListener("click", handleClick);
    };

    void (async () => {
      if (host.localName !== TAG_DISMISSIBLE) {
        await customElements.whenDefined(TAG_DISMISSIBLE);
      }
      if (session.cancelled) return;

      const stencilHost = host as PdsStencilHost;
      if (typeof stencilHost.componentOnReady === "function") {
        await stencilHost.componentOnReady();
      }
      if (session.cancelled) return;

      attach();
    })();
  }, []);

  useEffect(() => () => cleanupRef.current?.(), []);

  return <PTagDismissible ref={hostRef} {...props} />;
}

export function ProductCatalogBrowser({ copy, locale, products }: Props) {
  const { params, replaceParams } = useCatalogQueryParams();
  const { favoriteSlugs, isFavorite } = useProductFavorites();
  const [isFilterFlyoutOpen, setIsFilterFlyoutOpen] = useState(false);
  const [openFacets, setOpenFacets] = useState<Record<string, boolean>>({
    audiences: true,
    categories: false,
    collections: false,
    flags: false,
    tags: false,
  });

  const filter = useMemo(() => buildCatalogFilterFromParams(params), [params]);
  const sortKey = getCatalogSortKey(params);
  const favoritesOnly = isFavoritesOnlyQuery(params);
  const filteredProducts = useMemo(
    () => filterCatalogProducts(products, filter),
    [filter, products],
  );
  const sortedProducts = useMemo(
    () => sortCatalogProducts(filteredProducts, sortKey),
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

  const updateFacet = useCallback(
    <T extends string>(
      facet: FacetDefinition<T>,
      value: T,
      checked: boolean,
    ) => {
      const next = new URLSearchParams(params.toString());
      next.delete("reduced");
      const selected = parseFacetValues(next, facet.param, facet.isValid);
      const nextValues = checked
        ? Array.from(new Set([...selected, value]))
        : selected.filter((selectedValue) => selectedValue !== value);

      if (nextValues.length > 0) {
        next.set(facet.param, nextValues.join(","));
      } else {
        next.delete(facet.param);
      }

      replaceParams(next);
    },
    [params, replaceParams],
  );

  const applyQuickFilter = useCallback(
    (quickFilter: QuickFilterDefinition) => {
      const next = new URLSearchParams();
      next.delete(PRODUCTS_FAVORITES_QUERY);
      next.delete("reduced");

      if (quickFilter.filter.audiences?.length) {
        next.set("audience", quickFilter.filter.audiences.join(","));
      }
      if (quickFilter.filter.categories?.length) {
        next.set("category", quickFilter.filter.categories.join(","));
      }
      if (quickFilter.filter.collections?.length) {
        next.set("collection", quickFilter.filter.collections.join(","));
      }

      replaceParams(next);
    },
    [replaceParams],
  );

  const updateSort = useCallback(
    (nextSortKey: CatalogSortKey) => {
      const next = new URLSearchParams(params.toString());

      if (nextSortKey === "recommended") {
        next.delete("sort");
      } else {
        next.set("sort", nextSortKey);
      }

      replaceParams(next);
    },
    [params, replaceParams],
  );

  const clearFilters = useCallback(() => {
    const next = new URLSearchParams(params.toString());
    next.delete("audience");
    next.delete("category");
    next.delete("collection");
    next.delete("flag");
    next.delete("tag");
    next.delete(PRODUCTS_FAVORITES_QUERY);
    next.delete("reduced");
    replaceParams(next);
  }, [params, replaceParams]);

  const clearFavoritesOnly = useCallback(() => {
    const next = new URLSearchParams(params.toString());
    next.delete(PRODUCTS_FAVORITES_QUERY);
    replaceParams(next);
  }, [params, replaceParams]);

  function toggleFacetPanel(facetKey: keyof CatalogFacetFilter, open: boolean) {
    setOpenFacets((current) => ({ ...current, [facetKey]: open }));
  }

  const activeQuickFilterIndex = quickFilters.findIndex(
    ({ filter: quickFilter }) => {
      return (
        areSameFacetValues(filter.audiences, quickFilter.audiences) &&
        areSameFacetValues(filter.categories, quickFilter.categories) &&
        areSameFacetValues(filter.collections, quickFilter.collections)
      );
    },
  );

  const resultCountLabel = formatCatalogCount(
    copy.resultCount,
    displayProducts.length,
  );
  const showProductsLabel = formatCatalogCount(
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
              onChange={(event) =>
                updateSort(event.detail.value as CatalogSortKey)
              }
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
                  "aria-label": formatCatalogFilterLabel(copy.dismissFilter, label),
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
                        const selected = isFacetValueSelected(filter[facet.key], value);

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
