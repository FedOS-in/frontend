"use client"

import * as React from "react"
import { create } from "zustand"
import { useShallow } from "zustand/react/shallow"
import { getOrganizationText, organizationText } from "@/i18n/organizationText"

const STORAGE_KEY = "fedos.organization.locale"
const AVAILABLE_LOCALES = Object.keys(organizationText)

function readStoredLocale() {
  if (typeof window === "undefined") {
    return "en"
  }

  const storedLocale = window.localStorage.getItem(STORAGE_KEY)
  return AVAILABLE_LOCALES.includes(storedLocale) ? storedLocale : "en"
}

function persistLocale(locale) {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, locale)
  document.documentElement.lang = locale
}

export const useOrganizationLanguageStore = create((set, get) => ({
  locale: "en",
  setLocale: (nextLocale) => {
    const locale = AVAILABLE_LOCALES.includes(nextLocale) ? nextLocale : "en"
    if (get().locale === locale) {
      return
    }

    set({ locale })
    persistLocale(locale)
  },
  availableLocales: AVAILABLE_LOCALES,
}))

export function useOrganizationLocale() {
  return useOrganizationLanguageStore(
    useShallow((state) => ({
      locale: state.locale,
      setLocale: state.setLocale,
      availableLocales: state.availableLocales,
    })),
  )
}

export function useOrganizationText() {
  const locale = useOrganizationLanguageStore((state) => state.locale)

  return React.useMemo(() => getOrganizationText(locale), [locale])
}

export function getOrganizationLocale() {
  return useOrganizationLanguageStore.getState().locale
}

export function setOrganizationLocale(locale) {
  useOrganizationLanguageStore.getState().setLocale(locale)
}

export function hydrateOrganizationLocale() {
  setOrganizationLocale(readStoredLocale())
}
