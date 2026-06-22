import { create } from "zustand";

const fallbackBackground = "/32.jpg";

type PreferencesState = {
  backgroundUrl: string;
  fontFamily: string;
  setFontFamily: (fontFamily: string) => void;
  setBackgroundUrl: (backgroundUrl: string) => void;
};

const readStoredValue = (key: string, fallback: string) => {
  if (typeof window === "undefined") {
    return fallback;
  }

  return window.localStorage.getItem(key) || fallback;
};

export const usePreferences = create<PreferencesState>((set) => ({
  backgroundUrl: readStoredValue("lam-nexus-background", fallbackBackground),
  fontFamily: readStoredValue("lam-nexus-font", "Inter"),
  setFontFamily: (fontFamily) => {
    window.localStorage.setItem("lam-nexus-font", fontFamily);
    set({ fontFamily });
  },
  setBackgroundUrl: (backgroundUrl) => {
    window.localStorage.setItem("lam-nexus-background", backgroundUrl);
    set({ backgroundUrl });
  },
}));
