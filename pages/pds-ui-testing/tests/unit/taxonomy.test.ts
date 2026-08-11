import { describe, expect, it } from "vitest";
import {
  isAudienceSlug,
  isCategorySlug,
  isCollectionSlug,
  isLifestyleTagSlug,
  isMerchandisingFlagSlug,
} from "@/app/data/catalog/taxonomy";

describe("taxonomy type guards", () => {
  it("isAudienceSlug accepts valid slugs", () => {
    expect(isAudienceSlug("men")).toBe(true);
    expect(isAudienceSlug("invalid")).toBe(false);
    expect(isAudienceSlug("")).toBe(false);
  });

  it("isCategorySlug accepts valid slugs", () => {
    expect(isCategorySlug("apparel")).toBe(true);
    expect(isCategorySlug("shoes")).toBe(false);
  });

  it("isCollectionSlug accepts valid slugs", () => {
    expect(isCollectionSlug("porsche-design")).toBe(true);
    expect(isCollectionSlug("other")).toBe(false);
  });

  it("isMerchandisingFlagSlug accepts valid slugs", () => {
    expect(isMerchandisingFlagSlug("reduced")).toBe(true);
    expect(isMerchandisingFlagSlug("sale")).toBe(false);
  });

  it("isLifestyleTagSlug accepts valid slugs", () => {
    expect(isLifestyleTagSlug("urbanist")).toBe(true);
    expect(isLifestyleTagSlug("fan")).toBe(false);
  });
});
