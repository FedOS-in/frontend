"use client"

import * as React from "react"

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

export function useFormSetupLookups(errorFallback) {
  const [currencyOptions, setCurrencyOptions] = React.useState([])
  const [membershipPeriodOptions, setMembershipPeriodOptions] = React.useState(
    [],
  )
  const [loadingLookups, setLoadingLookups] = React.useState(false)
  const [lookupError, setLookupError] = React.useState("")

  React.useEffect(() => {
    const controller = new AbortController()

    async function loadLookups() {
      setLoadingLookups(true)
      setLookupError("")
      try {
        const [currencyRes, membershipRes] = await Promise.all([
          fetch(`${backendUrl}/api/currency-types`, {
            signal: controller.signal,
          }),
          fetch(`${backendUrl}/api/membership-periods`, {
            signal: controller.signal,
          }),
        ])

        if (!currencyRes.ok || !membershipRes.ok) {
          throw new Error(errorFallback)
        }

        const [currencies, membershipPeriods] = await Promise.all([
          currencyRes.json(),
          membershipRes.json(),
        ])

        setCurrencyOptions(Array.isArray(currencies) ? currencies : [])
        setMembershipPeriodOptions(
          Array.isArray(membershipPeriods) ? membershipPeriods : [],
        )
      } catch (error) {
        if (error.name !== "AbortError") {
          setLookupError(error.message || errorFallback)
        }
      } finally {
        if (!controller.signal.aborted) setLoadingLookups(false)
      }
    }

    loadLookups()
    return () => controller.abort()
  }, [errorFallback])

  return {
    currencyOptions,
    loadingLookups,
    lookupError,
    membershipPeriodOptions,
  }
}
