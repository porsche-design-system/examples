import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCatalogQueryParams } from "@/app/components/use-catalog-query-params";

const pathname = "/en/products/";
let searchParamsString = "";

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
  useSearchParams: () => new URLSearchParams(searchParamsString),
}));

function setLocationSearch(search: string) {
  const url = search ? `${pathname}?${search}` : pathname;
  window.history.replaceState(window.history.state, "", url);
  searchParamsString = search;
}

describe("useCatalogQueryParams", () => {
  beforeEach(() => {
    searchParamsString = "";
    setLocationSearch("");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("reads initial params from window.location on mount", async () => {
    setLocationSearch("audience=men");

    const { result } = renderHook(() => useCatalogQueryParams());

    await waitFor(() => {
      expect(result.current.params.get("audience")).toBe("men");
    });
  });

  it("replaceParams updates local state and the address bar", async () => {
    const replaceStateSpy = vi.spyOn(window.history, "replaceState");

    const { result } = renderHook(() => useCatalogQueryParams());

    await waitFor(() => {
      expect(result.current.params.toString()).toBe("");
    });

    act(() => {
      const next = new URLSearchParams({
        category: "apparel",
        sort: "price-asc",
      });
      result.current.replaceParams(next);
    });

    expect(result.current.params.get("category")).toBe("apparel");
    expect(result.current.params.get("sort")).toBe("price-asc");
    expect(replaceStateSpy).toHaveBeenCalledWith(
      window.history.state,
      "",
      "/en/products/?category=apparel&sort=price-asc",
    );

    replaceStateSpy.mockRestore();
  });

  it("replaceParams clears query string when params are empty", async () => {
    const replaceStateSpy = vi.spyOn(window.history, "replaceState");
    setLocationSearch("audience=men");

    const { result } = renderHook(() => useCatalogQueryParams());

    await waitFor(() => {
      expect(result.current.params.get("audience")).toBe("men");
    });

    act(() => {
      result.current.replaceParams(new URLSearchParams());
    });

    expect(result.current.params.toString()).toBe("");
    expect(replaceStateSpy).toHaveBeenLastCalledWith(
      window.history.state,
      "",
      pathname,
    );

    replaceStateSpy.mockRestore();
  });

  it("syncs from window when Next searchParams lag behind the URL", async () => {
    setLocationSearch("audience=men");
    searchParamsString = "";

    const { result } = renderHook(() => useCatalogQueryParams());

    await waitFor(() => {
      expect(result.current.params.get("audience")).toBe("men");
    });
  });

  it("updates params on browser popstate", async () => {
    const { result } = renderHook(() => useCatalogQueryParams());

    await waitFor(() => {
      expect(result.current.params.toString()).toBe("");
    });

    act(() => {
      setLocationSearch("tag=urbanist");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    await waitFor(() => {
      expect(result.current.params.get("tag")).toBe("urbanist");
    });
  });
});
