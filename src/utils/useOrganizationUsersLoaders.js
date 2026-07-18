import React from "react"

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

export default function useOrganizationUsersLoaders({
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
}) {
  React.useEffect(() => {
    const controller = new AbortController()

    async function loadInitialData() {
      try {
        const [nodesResponse, statusesResponse, paymentStatusesResponse] =
          await Promise.all([
            fetch(`${backendUrl}/api/federation-nodes`, {
              signal: controller.signal,
            }),
            fetch(`${backendUrl}/api/approval-statuses`, {
              signal: controller.signal,
            }),
            membersOnly
              ? fetch(`${backendUrl}/api/payment-statuses`, {
                  signal: controller.signal,
                })
              : Promise.resolve(null),
          ])

        if (!nodesResponse.ok || !statusesResponse.ok) {
          throw new Error(pageText.messages.loadSetupError)
        }

        if (membersOnly && paymentStatusesResponse && !paymentStatusesResponse.ok) {
          throw new Error(pageText.messages.loadSetupError)
        }

        const [nodesData, statusesData] = await Promise.all([
          nodesResponse.json(),
          statusesResponse.json(),
        ])

        const resolvedNodes = Array.isArray(nodesData) ? nodesData : []
        setNodes(resolvedNodes)
        setStatuses(Array.isArray(statusesData) ? statusesData : [])

        if (membersOnly && paymentStatusesResponse) {
          const paymentStatusesData = await paymentStatusesResponse.json()
          setPaymentStatuses(
            Array.isArray(paymentStatusesData) ? paymentStatusesData : [],
          )
        }

        if (resolvedNodes.length > 0) {
          setSelectedNodeId(resolvedNodes[0].id)
        }
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(loadError.message || pageText.messages.loadSetupError)
        }
      }
    }

    loadInitialData()
    return () => controller.abort()
  }, [
    membersOnly,
    pageText,
    setNodes,
    setSelectedNodeId,
    setStatuses,
    setPaymentStatuses,
    setError,
  ])

  React.useEffect(() => {
    const controller = new AbortController()

    async function loadUsersByNode() {
      if (!selectedNodeId || (membersOnly && approvedValue === null)) {
        setUsers([])
        return
      }

      setLoading(true)
      setError("")

      try {
        const params = new URLSearchParams({
          federationNodeId: selectedNodeId,
        })
        if (membersOnly && approvedValue !== null) {
          params.set("approvalStatus", String(approvedValue))
        }

        const response = await fetch(
          `${backendUrl}/api/federation-users?${params.toString()}`,
          { signal: controller.signal },
        )
        if (!response.ok) {
          throw new Error(pageText.messages.loadUsersError)
        }

        const usersData = await response.json()
        setUsers(Array.isArray(usersData) ? usersData : [])
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(loadError.message || pageText.messages.loadUsersError)
          setUsers([])
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadUsersByNode()
    return () => controller.abort()
  }, [
    selectedNodeId,
    membersOnly,
    approvedValue,
    pageText,
    setUsers,
    setLoading,
    setError,
  ])
}

export async function updateFederationUserStatus(userId, approvalStatus) {
  const response = await fetch(`${backendUrl}/api/federation-users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ approvalStatus }),
  })

  if (!response.ok) {
    throw new Error("Failed to update approval status")
  }

  return response.json()
}
