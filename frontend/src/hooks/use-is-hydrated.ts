"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * `false` during SSR and the first client render, `true` afterwards.
 *
 * Components backed by persisted stores (cart, favourites, theme) must not
 * render localStorage-derived output until hydration finishes, or the markup
 * won't match. This does that without a `setState` inside an effect, which
 * would schedule an extra cascading render on every such component.
 */
export function useIsHydrated(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
