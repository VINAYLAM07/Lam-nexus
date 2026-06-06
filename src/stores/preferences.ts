import { create } from 'zustand'

const defaultBackground =
  'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=2400&q=85'

type PreferencesState = {
  backgroundUrl: string
  fontFamily: string
  setBackgroundUrl: (backgroundUrl: string) => void
  setFontFamily: (fontFamily: string) => void
}

const readStoredValue = (key: string, fallback: string) => {
  if (typeof window === 'undefined') {
    return fallback
  }

  return window.localStorage.getItem(key) || fallback
}

export const usePreferences = create<PreferencesState>((set) => ({
  backgroundUrl: readStoredValue('lam-nexus-background', defaultBackground),
  fontFamily: readStoredValue('lam-nexus-font', 'Inter'),
  setBackgroundUrl: (backgroundUrl) => {
    window.localStorage.setItem('lam-nexus-background', backgroundUrl)
    set({ backgroundUrl })
  },
  setFontFamily: (fontFamily) => {
    window.localStorage.setItem('lam-nexus-font', fontFamily)
    set({ fontFamily })
  },
}))
