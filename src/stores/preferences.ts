import { create } from 'zustand'

type PreferencesState = {
  fontFamily: string
  setFontFamily: (fontFamily: string) => void
}

const readStoredValue = (key: string, fallback: string) => {
  if (typeof window === 'undefined') {
    return fallback
  }

  return window.localStorage.getItem(key) || fallback
}

export const usePreferences = create<PreferencesState>((set) => ({
  fontFamily: readStoredValue('lam-nexus-font', 'Inter'),
  setFontFamily: (fontFamily) => {
    window.localStorage.setItem('lam-nexus-font', fontFamily)
    set({ fontFamily })
  },
}))
