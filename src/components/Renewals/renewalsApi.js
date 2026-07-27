"use client"

import * as React from "react"

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

function buildQuery(params) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value == null || value === "" || value === "all") return
    search.set(key, String(value))
  })
  return search.toString()
}

export function useRenewalsFilters() {
  const [nodes, setNodes] = React.useState([])
  const [membershipTypes, setMembershipTypes] = React.useState([])

  React.useEffect(() => {
    const controller = new AbortController()

    async function loadFilters() {
      try {
        const [nodesRes, typesRes] = await Promise.all([
          fetch(`${backendUrl}/api/federation-nodes`, {
            signal: controller.signal,
          }),
          fetch(`${backendUrl}/api/membership-types`, {
            signal: controller.signal,
          }),
        ])
        if (nodesRes.ok) setNodes(await nodesRes.json())
        if (typesRes.ok) setMembershipTypes(await typesRes.json())
      } catch (error) {
        if (error.name !== "AbortError") console.error(error)
      }
    }

    loadFilters()
    return () => controller.abort()
  }, [])

  return { nodes, membershipTypes }
}

export function useRenewalsList({
  debouncedQuery,
  bucket,
  dueStatusFilter,
  paymentStatusFilter,
  membershipTypeId,
  federationNodeId,
  page,
  rowsPerPage,
  refreshKey,
  loadError,
}) {
  const [items, setItems] = React.useState([])
  const [stats, setStats] = React.useState(null)
  const [tabCounts, setTabCounts] = React.useState({})
  const [total, setTotal] = React.useState(0)
  const [totalPages, setTotalPages] = React.useState(1)
  const [loading, setLoading] = React.useState(true)
  const [errorMessage, setErrorMessage] = React.useState("")

  React.useEffect(() => {
    const controller = new AbortController()

    async function loadRenewals() {
      setLoading(true)
      setErrorMessage("")

      try {
        const effectiveBucket =
          dueStatusFilter !== "all" ? dueStatusFilter : bucket
        const listQuery = buildQuery({
          q: debouncedQuery,
          bucket: effectiveBucket,
          paymentStatus: paymentStatusFilter,
          membershipTypeId,
          federationNodeId,
          page,
          pageSize: rowsPerPage,
        })
        const statsQuery = buildQuery({ federationNodeId })

        const [listRes, statsRes] = await Promise.all([
          fetch(`${backendUrl}/api/renewals?${listQuery}`, {
            signal: controller.signal,
          }),
          fetch(`${backendUrl}/api/renewals/stats?${statsQuery}`, {
            signal: controller.signal,
          }),
        ])

        if (!listRes.ok || !statsRes.ok) {
          throw new Error(loadError)
        }

        const listData = await listRes.json()
        const statsData = await statsRes.json()

        setItems(listData.items || [])
        setTotal(listData.total || 0)
        setTotalPages(listData.totalPages || 1)
        setTabCounts(listData.tabCounts || {})
        setStats(statsData)
      } catch (error) {
        if (error.name !== "AbortError") {
          setErrorMessage(error.message || loadError)
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadRenewals()
    return () => controller.abort()
  }, [
    debouncedQuery,
    bucket,
    dueStatusFilter,
    paymentStatusFilter,
    membershipTypeId,
    federationNodeId,
    page,
    rowsPerPage,
    refreshKey,
    loadError,
  ])

  return {
    items,
    stats,
    tabCounts,
    total,
    totalPages,
    loading,
    errorMessage,
  }
}

export async function recordOfflinePayment(userId) {
  const response = await fetch(
    `${backendUrl}/api/renewals/${userId}/offline-payment`,
    { method: "POST", headers: { "Content-Type": "application/json" } },
  )
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    throw new Error(payload.message || "Failed to record offline payment")
  }
  return response.json()
}

export function buildRenewalPaymentUrl(userId) {
  if (typeof window === "undefined") return `/payment/renewal/${userId}`
  return new URL(
    `/payment/renewal/${userId}`,
    window.location.origin,
  ).toString()
}

export function formatRenewalFee(amount, prefix = "₹") {
  if (amount == null || amount === "") return "—"
  const value = Number(amount)
  if (Number.isNaN(value)) return "—"
  return `${prefix}${value.toLocaleString("en-IN")}`
}

export function formatExpiryDate(value) {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}
