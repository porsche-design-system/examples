"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PButton, PHeading, PTag, PText } from "@porsche-design-system/components-react/ssr";
import { CatalogProductGrid } from "@/app/components/CatalogProductGrid";
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
  return {
    audiences: parseFacetValues(searchParams, "audience", isAudienceSlug),
    categories: parseFacetValues(searchParams, "category", isCategorySlug),
    collections: parseFacetValues(searchParams, "collection", isCollectionSlug),
    flags: parseFacetValues(searchParams, "flag", isMerchandisingFlagSlug),
    tags: parseFacetValues(searchParams, "tag", isLifestyleTagSlug),
  };
}

function isSelected<T extends string>(selected: readonly T[] | undefined, value: T) {
  return selected?.includes(value) ?? false;
}

export function ProductCatalogBrowser({ copy, locale, products }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filter = useMemo(
    () => buildFilter(searchParams),
    [searchParams],
  );
  const filteredProducts = useMemo(
    () => filterCatalogProducts(products, filter),
    [filter, products],
  );

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
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function clearFilters() {
    router.replace(pathname, { scroll: false });
  }

  return (
    <>
      <section
        aria-labelledby="product-filter-heading"
        className="col-wide grid gap-fluid-md rounded-lg border border-solid border-neutral-contrast-low p-fluid-md"
      >
        <div className="flex flex-col gap-fluid-sm md:flex-row md:items-center md:justify-between">
          <PHeading id="product-filter-heading" size="large" tag="h2">
            {copy.filters.title}
          </PHeading>
          <PText color="contrast-medium">
            {copy.resultCount.replace("{count}", String(filteredProducts.length))}
          </PText>
        </div>

        <div className="grid gap-fluid-md md:grid-cols-2 lg:grid-cols-3">
          {facets.map((facet) => (
            <fieldset className="grid gap-static-sm" key={facet.param}>
              <legend className="mb-static-xs font-semibold">{facet.legend}</legend>
              {facet.values.map((value) => (
                <label className="flex items-center gap-static-sm" key={value}>
                  <input
                    checked={isSelected(filter[facet.key], value)}
                    onChange={(event) =>
                      updateFacet(facet, value, event.currentTarget.checked)
                    }
                    type="checkbox"
                  />
                  <span>{facet.labels[value]}</span>
                </label>
              ))}
            </fieldset>
          ))}
        </div>

        {activeFilters.length > 0 ? (
          <div className="flex flex-wrap items-center gap-static-sm">
            {activeFilters.map(({ facet, label, value }) => (
              <button
                className="cursor-pointer border-0 bg-transparent p-0"
                key={`${facet.param}-${value}`}
                onClick={() => updateFacet(facet, value, false)}
                type="button"
              >
                <PTag compact>{label}</PTag>
              </button>
            ))}
            <PButton onClick={clearFilters} type="button" variant="secondary">
              {copy.clearFilters}
            </PButton>
          </div>
        ) : null}
      </section>

      {filteredProducts.length > 0 ? (
        <CatalogProductGrid
          locale={locale}
          products={filteredProducts}
          sectionAriaLabel={copy.productsRegionLabel}
        />
      ) : (
        <section className="col-wide grid gap-fluid-sm" role="status">
          <PHeading size="large" tag="h2">
            {copy.emptyTitle}
          </PHeading>
          <PText>{copy.emptyText}</PText>
        </section>
      )}
    </>
  );
}
