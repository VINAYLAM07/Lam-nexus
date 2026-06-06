import { create } from "zustand";

const defaultBackground =
  "https://images.unsplash.com/photo-1557672172-298e090d0f80?auto=format&fit=crop&w=2400&q=90";

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
  backgroundUrl: readStoredValue("lam-nexus-background", defaultBackground),
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
