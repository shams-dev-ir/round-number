"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((state) => ({
          ids: state.ids.includes(id) ? state.ids.filter((x) => x !== id) : [id, ...state.ids],
        })),
      has: (id) => get().ids.includes(id),
      clear: () => set({ ids: [] }),
    }),
    { name: "rondix.favorites", version: 1 },
  ),
);

interface CompareState {
  ids: string[];
  toggle: (id: string) => void;
  clear: () => void;
}

/** Side-by-side comparison holds at most four numbers — the table stops fitting after that. */
export const useCompare = create<CompareState>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) =>
        set((state) => {
          if (state.ids.includes(id)) return { ids: state.ids.filter((x) => x !== id) };
          return { ids: [...state.ids, id].slice(-4) };
        }),
      clear: () => set({ ids: [] }),
    }),
    { name: "rondix.compare", version: 1 },
  ),
);
