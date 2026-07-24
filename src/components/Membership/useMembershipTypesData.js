"use client"

import * as React from "react"

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

function matchesSearch(item, query) {
  if (!query) return true
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  const label = String(item.label || "").toLowerCase()
  const code = String(item.code || "").toLowerCase()
  return label.includes(needle) || code.includes(needle)
}

function matchesStatus(item, statusFilter) {
  if (statusFilter === "all" || statusFilter === "") return true
  return Number(item.status) === Number(statusFilter)
}

export function formatMembershipFee(amount, currency) {
  if (amount == null || amount === "") return "—"
  const numeric = Number(amount)
  if (!Number.isFinite(numeric)) return String(amount)

  const formatted = numeric.toLocaleString(undefined, {
    minimumFractionDigits: numeric % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })

  const currencyName = currency?.name || ""
  if (/rupee/i.test(currencyName)) {
    return `₹${formatted}`
  }
  if (currencyName) {
    return `${formatted} ${currencyName}`
  }
  return formatted
}

export function computeMembershipTypeStats(items) {
  const list = Array.isArray(items) ? items : []
  let active = 0
  let inactive = 0
  let formsLinked = 0
  let totalMembers = 0

  for (const item of list) {
    if (Number(item.status) === 1) active += 1
    else inactive += 1
    formsLinked += Number(item._count?.forms) || 0
    totalMembers += Number(item._count?.users) || 0
  }

  return {
    total: list.length,
    active,
    inactive,
    formsLinked,
    totalMembers,
  }
}

export function useMembershipTypesData(refreshKey = 0, loadErrorFallback) {
  const [items, setItems] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [errorMessage, setErrorMessage] = React.useState("")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [page, setPage] = React.useState(1)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  React.useEffect(() => {
    const controller = new AbortController()

    async function loadMembershipTypes() {
      setLoading(true)
      setErrorMessage("")

      try {
        const response = await fetch(`${backendUrl}/api/membership-types`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(loadErrorFallback)
        }

        const payload = await response.json()
        setItems(Array.isArray(payload) ? payload : [])
      } catch (error) {
        if (error.name !== "AbortError") {
          setErrorMessage(error.message || loadErrorFallback)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadMembershipTypes()

    return () => {
      controller.abort()
    }
  }, [refreshKey, loadErrorFallback])

  React.useEffect(() => {
    setPage(1)
  }, [searchQuery, statusFilter, rowsPerPage])

  const filteredItems = React.useMemo(
    () =>
      items.filter(
        (item) =>
          matchesSearch(item, searchQuery) &&
          matchesStatus(item, statusFilter),
      ),
    [items, searchQuery, statusFilter],
  )

  const stats = React.useMemo(
    () => computeMembershipTypeStats(items),
    [items],
  )

  const totalFiltered = filteredItems.length
  const totalPages = Math.max(1, Math.ceil(totalFiltered / rowsPerPage) || 1)
  const safePage = Math.min(page, totalPages)
  const startIndex = (safePage - 1) * rowsPerPage
  const endIndex = Math.min(startIndex + rowsPerPage, totalFiltered)
  const pagedItems = filteredItems.slice(startIndex, endIndex)

  return {
    items,
    filteredItems,
    pagedItems,
    loading,
    errorMessage,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    page: safePage,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    totalFiltered,
    totalPages,
    startIndex,
    endIndex,
    stats,
  }
}
