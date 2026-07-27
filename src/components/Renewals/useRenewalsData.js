"use client"

import * as React from "react"
import {
  useRenewalsFilters,
  useRenewalsList,
} from "./renewalsApi"

export {
  formatRenewalFee,
  formatExpiryDate,
  recordOfflinePayment,
  buildRenewalPaymentUrl,
} from "./renewalsApi"

export default function useRenewalsData(pageText) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [debouncedQuery, setDebouncedQuery] = React.useState("")
  const [bucket, setBucket] = React.useState("all")
  const [dueStatusFilter, setDueStatusFilter] = React.useState("all")
  const [paymentStatusFilter, setPaymentStatusFilter] = React.useState("all")
  const [membershipTypeId, setMembershipTypeId] = React.useState("all")
  const [federationNodeId, setFederationNodeId] = React.useState("all")
  const [page, setPage] = React.useState(1)
  const [rowsPerPage, setRowsPerPage] = React.useState(20)
  const [refreshKey, setRefreshKey] = React.useState(0)
  const [selectedIds, setSelectedIds] = React.useState([])
  const [selectedMember, setSelectedMember] = React.useState(null)

  const { nodes, membershipTypes } = useRenewalsFilters()

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  React.useEffect(() => {
    setPage(1)
  }, [
    debouncedQuery,
    bucket,
    dueStatusFilter,
    paymentStatusFilter,
    membershipTypeId,
    federationNodeId,
    rowsPerPage,
  ])

  const list = useRenewalsList({
    debouncedQuery,
    bucket,
    dueStatusFilter,
    paymentStatusFilter,
    membershipTypeId,
    federationNodeId,
    page,
    rowsPerPage,
    refreshKey,
    loadError: pageText.loadError,
  })

  React.useEffect(() => {
    setSelectedIds((current) =>
      current.filter((id) => list.items.some((item) => item.id === id)),
    )
  }, [list.items])

  const toggleSelect = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === list.items.length) {
      setSelectedIds([])
      return
    }
    setSelectedIds(list.items.map((item) => item.id))
  }

  const selectedRows = React.useMemo(
    () => list.items.filter((item) => selectedIds.includes(item.id)),
    [list.items, selectedIds],
  )

  const startIndex = list.total === 0 ? 0 : (page - 1) * rowsPerPage
  const endIndex = Math.min(startIndex + list.items.length, list.total)

  return {
    ...list,
    searchQuery,
    setSearchQuery,
    bucket,
    setBucket,
    dueStatusFilter,
    setDueStatusFilter,
    paymentStatusFilter,
    setPaymentStatusFilter,
    membershipTypeId,
    setMembershipTypeId,
    federationNodeId,
    setFederationNodeId,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    nodes,
    membershipTypes,
    selectedIds,
    selectedRows,
    toggleSelect,
    toggleSelectAll,
    selectedMember,
    setSelectedMember,
    refresh: () => setRefreshKey((key) => key + 1),
    startIndex,
    endIndex,
  }
}
