import { describe, expect, it } from "vitest";
import { replaceLocaleInPath } from "@/app/lib/locale-path";

describe("replaceLocaleInPath", () => {
  it("swaps locale segment and keeps trailing slash", () => {
    expect(replaceLocaleInPath("/en/products/", "", "de")).toBe("/de/products/");
  });

  it("swaps locale on nested product detail paths", () => {
    expect(
      replaceLocaleInPath("/en/products/leather-cap/", "", "de"),
    ).toBe("/de/products/leather-cap/");
  });

  it("prepends locale when path has no locale segment", () => {
    expect(replaceLocaleInPath("/products/", "", "de")).toBe("/de/products/");
  });

  it("preserves base path prefix", () => {
    const base = "/examples/v4/pds-ui-testing";
    expect(
      replaceLocaleInPath(`${base}/en/company/glance/`, base, "de"),
    ).toBe(`${base}/de/company/glance/`);
  });

  it("normalizes base path trailing slash", () => {
    const base = "/base/";
    expect(replaceLocaleInPath("/base/en/", base, "de")).toBe("/base/de/");
  });
});
