import { create } from 'zustand'

const defaultBackground =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2400&q=90'

type PreferencesState = {
  backgroundUrl: string
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
  backgroundUrl: defaultBackground,
  fontFamily: readStoredValue('lam-nexus-font', 'Inter'),
  setFontFamily: (fontFamily) => {
    window.localStorage.setItem('lam-nexus-font', fontFamily)
    set({ fontFamily })
  },
}))
