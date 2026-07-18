import React from "react"
import {
  buildPaymentLabelMap,
  buildStatusLabelMap,
  buildUserRowActions,
  filterAndSortUsers,
  resolveStatusValue,
} from "@/components/Organization/Users/organizationUsersUtils"
import { useOrganizationText } from "@/i18n/organizationLanguageStore"
import useOrganizationUsersLoaders, {
  updateFederationUserStatus,
} from "@/utils/useOrganizationUsersLoaders"

export default function useOrganizationUsersData({ membersOnly = false } = {}) {
  const text = useOrganizationText()
  const pageText = membersOnly ? text.membersPage : text.usersPage
  const [nodes, setNodes] = React.useState([])
  const [selectedNodeId, setSelectedNodeId] = React.useState("")
  const [users, setUsers] = React.useState([])
  const [statuses, setStatuses] = React.useState([])
  const [paymentStatuses, setPaymentStatuses] = React.useState([])
  const [query, setQuery] = React.useState("")
  const [orderBy, setOrderBy] = React.useState("name")
  const [order, setOrder] = React.useState("asc")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [successMessage, setSuccessMessage] = React.useState("")

  const approvedValue = React.useMemo(
    () => resolveStatusValue(statuses, "approve"),
    [statuses],
  )

  useOrganizationUsersLoaders({
    membersOnly,
    pageText,
    selectedNodeId,
    approvedValue,
    setNodes,
    setSelectedNodeId,
    setStatuses,
    setPaymentStatuses,
    setUsers,
    setLoading,
    setError,
  })

  const statusLabelMap = React.useMemo(
    () => buildStatusLabelMap(statuses),
    [statuses],
  )
  const paymentLabelMap = React.useMemo(
    () => (membersOnly ? buildPaymentLabelMap(paymentStatuses) : null),
    [membersOnly, paymentStatuses],
  )
  const rows = React.useMemo(
    () =>
      filterAndSortUsers({
        users,
        query,
        orderBy,
        order,
        statusLabelMap,
        paymentLabelMap,
      }),
    [users, query, orderBy, order, statusLabelMap, paymentLabelMap],
  )

  const statusActions = React.useMemo(
    () => ({
      pendingValue: resolveStatusValue(statuses, "pending"),
      approvedValue,
      rejectedValue: resolveStatusValue(statuses, "reject"),
      cancelledValue: resolveStatusValue(statuses, "cancel"),
    }),
    [statuses, approvedValue],
  )

  const getRowActions = React.useCallback(
    (user) =>
      buildUserRowActions(user, statusActions, text.usersPage.messages, {
        membersOnly,
        requestPaymentLabel: text.membersPage.messages.requestPayment,
      }),
    [statusActions, text, membersOnly],
  )

  const handleSort = (columnId) => {
    if (orderBy === columnId) {
      setOrder((current) => (current === "asc" ? "desc" : "asc"))
      return
    }
    setOrderBy(columnId)
    setOrder("asc")
  }

  const handleUpdateStatus = async (userId, approvalStatus) => {
    setSuccessMessage("")
    try {
      const updatedUser = await updateFederationUserStatus(
        userId,
        approvalStatus,
      )

      if (
        membersOnly &&
        approvedValue !== null &&
        updatedUser.approvalStatus !== approvedValue
      ) {
        setUsers((current) => current.filter((user) => user.id !== userId))
        return
      }

      setUsers((current) =>
        current.map((user) => (user.id === userId ? updatedUser : user)),
      )
    } catch {
      setError(pageText.messages.updateStatusError)
    }
  }

  const handleRequestPayment = async (user) => {
    if (!user?.id) return
    setError("")
    setSuccessMessage("")
    const paymentUrl = `${window.location.origin}/payment/${user.id}`
    try {
      await navigator.clipboard.writeText(paymentUrl)
      setSuccessMessage(text.membersPage.messages.paymentLinkCopied)
    } catch {
      setError(text.membersPage.messages.paymentLinkCopyFailed)
    }
  }

  return {
    nodes,
    selectedNodeId,
    setSelectedNodeId,
    query,
    setQuery,
    rows,
    orderBy,
    order,
    handleSort,
    loading,
    error,
    successMessage,
    statusLabelMap,
    paymentLabelMap,
    getRowActions,
    handleUpdateStatus,
    handleRequestPayment,
  }
}
