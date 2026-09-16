import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** False during prerender and hydration, true once the client store (localStorage) is readable. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
