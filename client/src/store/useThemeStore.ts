// store/useThemeStore.ts
import { create } from "zustand";

type ThemeState = {
  theme: string;
  setTheme: (theme: string) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme:
    typeof window !== "undefined"
      ? localStorage.getItem("streamify-theme") || "coffee"
      : "coffee",
  setTheme: (theme: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("streamify-theme", theme);
    }
    set({ theme });
  },
}));
