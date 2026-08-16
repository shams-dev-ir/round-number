"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      {children}
      <Toaster
        position="bottom-left"
        dir="rtl"
        closeButton
        toastOptions={{
          className: "!bg-surface !border-border !text-foreground !rounded-xl !font-sans !shadow-lg",
        }}
      />
    </ThemeProvider>
  );
}
