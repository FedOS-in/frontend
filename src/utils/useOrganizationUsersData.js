import React from "react"
import {
  buildStatusLabelMap,
  filterAndSortUsers,
  resolveStatusValue,
} from "@/components/Organization/Users/organizationUsersUtils"
import { useOrganizationText } from "@/i18n/organizationLanguageStore"

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

export default function useOrganizationUsersData() {
  const text = useOrganizationText()
  const [nodes, setNodes] = React.useState([])
  const [selectedNodeId, setSelectedNodeId] = React.useState("")
  const [users, setUsers] = React.useState([])
  const [statuses, setStatuses] = React.useState([])
  const [query, setQuery] = React.useState("")
  const [orderBy, setOrderBy] = React.useState("name")
  const [order, setOrder] = React.useState("asc")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    const controller = new AbortController()

    async function loadInitialData() {
      try {
        const [nodesResponse, statusesResponse] = await Promise.all([
          fetch(`${backendUrl}/api/federation-nodes`, {
            signal: controller.signal,
          }),
          fetch(`${backendUrl}/api/approval-statuses`, {
            signal: controller.signal,
          }),
        ])

        if (!nodesResponse.ok || !statusesResponse.ok) {
          throw new Error(text.usersPage.messages.loadSetupError)
        }

        const [nodesData, statusesData] = await Promise.all([
          nodesResponse.json(),
          statusesResponse.json(),
        ])

        const resolvedNodes = Array.isArray(nodesData) ? nodesData : []
        setNodes(resolvedNodes)
        setStatuses(Array.isArray(statusesData) ? statusesData : [])

        if (resolvedNodes.length > 0) {
          setSelectedNodeId(resolvedNodes[0].id)
        }
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(loadError.message || text.usersPage.messages.loadSetupError)
        }
      }
    }

    loadInitialData()

    return () => controller.abort()
  }, [text])

  React.useEffect(() => {
    const controller = new AbortController()

    async function loadUsersByNode() {
      if (!selectedNodeId) {
        setUsers([])
        return
      }

      setLoading(true)
      setError("")

      try {
        const response = await fetch(
          `${backendUrl}/api/federation-users?federationNodeId=${selectedNodeId}`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error(text.usersPage.messages.loadUsersError)
        }

        const usersData = await response.json()
        setUsers(Array.isArray(usersData) ? usersData : [])
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(loadError.message || text.usersPage.messages.loadUsersError)
          setUsers([])
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadUsersByNode()

    return () => controller.abort()
  }, [selectedNodeId, text])

  const statusLabelMap = React.useMemo(
    () => buildStatusLabelMap(statuses),
    [statuses],
  )

  const rows = React.useMemo(
    () =>
      filterAndSortUsers({
        users,
        query,
        orderBy,
        order,
        statusLabelMap,
      }),
    [users, query, orderBy, order, statusLabelMap],
  )

  const statusActions = React.useMemo(() => {
    const pendingValue = resolveStatusValue(statuses, "pending")
    const approvedValue = resolveStatusValue(statuses, "approve")
    const rejectedValue = resolveStatusValue(statuses, "reject")
    const cancelledValue = resolveStatusValue(statuses, "cancel")

    return {
      pendingValue,
      approvedValue,
      rejectedValue,
      cancelledValue,
    }
  }, [statuses])

  const getRowActions = React.useCallback(
    (user) => {
      const actions = []
      const {
        pendingValue,
        approvedValue,
        rejectedValue,
        cancelledValue,
      } = statusActions

      if (pendingValue !== null && user.approvalStatus === pendingValue) {
        if (approvedValue !== null) {
          actions.push({ label: text.usersPage.messages.approve, value: approvedValue })
        }
        if (rejectedValue !== null) {
          actions.push({ label: text.usersPage.messages.reject, value: rejectedValue })
        }
      } else if (approvedValue !== null && user.approvalStatus === approvedValue) {
        if (rejectedValue !== null) {
          actions.push({ label: text.usersPage.messages.reject, value: rejectedValue })
        }
      } else if (rejectedValue !== null && user.approvalStatus === rejectedValue) {
        if (approvedValue !== null) {
          actions.push({ label: text.usersPage.messages.approve, value: approvedValue })
        }
      } else {
        if (approvedValue !== null && user.approvalStatus !== approvedValue) {
          actions.push({ label: text.usersPage.messages.approve, value: approvedValue })
        }
        if (rejectedValue !== null && user.approvalStatus !== rejectedValue) {
          actions.push({ label: text.usersPage.messages.reject, value: rejectedValue })
        }
      }

      if (cancelledValue !== null) {
        actions.push({
          label: text.usersPage.messages.cancel,
          value: cancelledValue,
        })
      }

      return actions
    },
    [statusActions, text],
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
    try {
      const response = await fetch(
        `${backendUrl}/api/federation-users/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ approvalStatus }),
        },
      )

      if (!response.ok) {
        throw new Error(text.usersPage.messages.updateStatusError)
      }

      const updatedUser = await response.json()
      setUsers((current) =>
        current.map((user) => (user.id === userId ? updatedUser : user)),
      )
    } catch (updateError) {
      setError(updateError.message || text.usersPage.messages.updateStatusError)
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
    statusLabelMap,
    getRowActions,
    handleUpdateStatus,
  }
}
