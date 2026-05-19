import { describe, expect, it } from "vitest";
import { defaultLocale, isLocale, locales } from "@/app/i18n/config";

describe("i18n config", () => {
  it("exposes en and de locales", () => {
    expect(locales).toEqual(["en", "de"]);
  });

  it("defaults to en", () => {
    expect(defaultLocale).toBe("en");
  });

  it("isLocale narrows valid locale strings", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("de")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale("")).toBe(false);
  });
});
