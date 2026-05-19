type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem" | "clear">;

/** In-memory sessionStorage substitute for unit tests. */
export function createMockSessionStorage(
  initial: Record<string, string> = {},
): StorageLike & { store: Map<string, string> } {
  const store = new Map(Object.entries(initial));

  return {
    store,
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
    removeItem(key: string) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
  };
}

/** Replaces `globalThis.sessionStorage` for the duration of `run`. */
export function withMockSessionStorage<T>(
  run: (storage: StorageLike & { store: Map<string, string> }) => T,
  initial: Record<string, string> = {},
): T {
  const mock = createMockSessionStorage(initial);
  const previous = globalThis.sessionStorage;

  Object.defineProperty(globalThis, "sessionStorage", {
    value: mock,
    writable: true,
    configurable: true,
  });

  try {
    return run(mock);
  } finally {
    Object.defineProperty(globalThis, "sessionStorage", {
      value: previous,
      writable: true,
      configurable: true,
    });
  }
}
