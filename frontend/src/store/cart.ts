"use client";

import type { CartLine, PhoneNumber } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
  lines: CartLine[];
  add: (n: PhoneNumber) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
}

/** Numbers are unique goods — a line is either present or not, no quantity. */
export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (n) =>
        set((state) =>
          state.lines.some((l) => l.id === n.id)
            ? state
            : {
                lines: [
                  ...state.lines,
                  {
                    id: n.id,
                    msisdn: n.msisdn,
                    price: n.price,
                    operator: n.operator,
                    simType: n.simType,
                  },
                ],
              },
        ),
      remove: (id) => set((state) => ({ lines: state.lines.filter((l) => l.id !== id) })),
      clear: () => set({ lines: [] }),
      has: (id) => get().lines.some((l) => l.id === id),
    }),
    { name: "rondix.cart", version: 1 },
  ),
);

export const cartTotal = (lines: CartLine[]) => lines.reduce((sum, l) => sum + l.price, 0);

/** 3% platform commission, matching the fee quoted on the FAQ page. */
export const COMMISSION_RATE = 0.03;
export const TRANSFER_FEE = 450_000;
