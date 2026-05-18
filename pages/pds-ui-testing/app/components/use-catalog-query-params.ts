"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function readWindowSearchParams(): URLSearchParams {
  return new URLSearchParams(
    typeof window === "undefined" ? "" : window.location.search,
  );
}

/**
 * Keeps catalog URL query params in React state and syncs them with the address bar.
 *
 * In static export preview (`output: "export"`), `router.replace` alone does not always
 * update `useSearchParams()` when the page is opened with a query string. Local state
 * plus `history.replaceState` ensures filter chips and the product grid react immediately.
 */
export function useCatalogQueryParams() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [params, setParams] = useState<URLSearchParams>(() => {
    if (typeof window !== "undefined") {
      return readWindowSearchParams();
    }
    return new URLSearchParams(searchParams.toString());
  });

  const searchParamsKey = searchParams.toString();

  // Static export hydrates with empty server search params; read the real URL once on mount.
  useLayoutEffect(() => {
    const windowParams = readWindowSearchParams();
    setParams((prev) => {
      if (prev.toString() === windowParams.toString()) return prev;
      return windowParams;
    });
  }, []);

  // Re-sync when Next reports a navigation (e.g. dev) that changed the query string.
  useEffect(() => {
    if (searchParamsKey === readWindowSearchParams().toString()) return;
    setParams(readWindowSearchParams());
  }, [searchParamsKey]);

  useEffect(() => {
    const onPopState = () => {
      setParams(readWindowSearchParams());
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const replaceParams = useCallback(
    (next: URLSearchParams) => {
      const snapshot = new URLSearchParams(next.toString());
      const query = snapshot.toString();
      const href = query ? `${pathname}?${query}` : pathname;

      setParams(snapshot);

      if (typeof window !== "undefined") {
        window.history.replaceState(window.history.state, "", href);
      }
    },
    [pathname],
  );

  return { params, replaceParams };
}
