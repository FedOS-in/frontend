"use client"

import * as React from "react"

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

export function useFormSetupLookups(errorFallback, federationNodeId) {
  const [membershipTypeOptions, setMembershipTypeOptions] = React.useState([])
  const [loadingLookups, setLoadingLookups] = React.useState(false)
  const [lookupError, setLookupError] = React.useState("")

  React.useEffect(() => {
    const controller = new AbortController()

    async function loadLookups() {
      setLoadingLookups(true)
      setLookupError("")
      try {
        const query = new URLSearchParams({ status: "1" })
        if (federationNodeId) {
          query.set("federationNodeId", federationNodeId)
        }

        const membershipRes = await fetch(
          `${backendUrl}/api/membership-types?${query.toString()}`,
          { signal: controller.signal },
        )

        if (!membershipRes.ok) {
          throw new Error(errorFallback)
        }

        const membershipTypes = await membershipRes.json()
        setMembershipTypeOptions(
          Array.isArray(membershipTypes) ? membershipTypes : [],
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
  }, [errorFallback, federationNodeId])

  return {
    loadingLookups,
    lookupError,
    membershipTypeOptions,
  }
}
