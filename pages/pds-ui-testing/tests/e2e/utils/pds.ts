import type { Page } from "@playwright/test";

type PdsStencilHost = HTMLElement & {
  componentOnReady?: () => Promise<void>;
};

/** Waits until a PDS custom element host is defined and ready. */
export async function waitForPdsHost(
  page: Page,
  selector: string,
  timeout = 10_000,
): Promise<void> {
  await page.waitForFunction(
    async (sel) => {
      const host = document.querySelector(sel) as PdsStencilHost | null;
      if (!host) return false;
      await customElements.whenDefined(host.localName);
      if (typeof host.componentOnReady === "function") {
        await host.componentOnReady();
      }
      return true;
    },
    selector,
    { timeout },
  );
}

/** Waits until at least one matching PDS host exists and all are ready. */
export async function waitForPdsHosts(
  page: Page,
  selector: string,
  timeout = 10_000,
): Promise<void> {
  await page.waitForFunction(
    async (sel) => {
      const hosts = Array.from(
        document.querySelectorAll(sel),
      ) as PdsStencilHost[];

      if (hosts.length === 0) return false;

      await Promise.all(
        hosts.map(async (host) => {
          await customElements.whenDefined(host.localName);
          if (typeof host.componentOnReady === "function") {
            await host.componentOnReady();
          }
        }),
      );

      return true;
    },
    selector,
    { timeout },
  );
}
