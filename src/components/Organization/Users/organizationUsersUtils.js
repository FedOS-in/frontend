export function buildStatusLabelMap(statuses) {
  return new Map(statuses.map((status) => [status.value, status.name]))
}

export function buildPaymentLabelMap(statuses) {
  return new Map(statuses.map((status) => [status.id, status.name]))
}

export function formatDynamicFieldValue(value, emptyLabel = "—") {
  if (value === null || value === undefined || value === "") {
    return emptyLabel
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No"
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : emptyLabel
  }

  if (typeof value === "object") {
    return JSON.stringify(value)
  }

  return String(value)
}

export function resolveStatusValue(statuses, keyword, fallbackValue = null) {
  const normalizedKeyword = keyword.toLowerCase()
  const match = statuses.find((status) =>
    status.name.toLowerCase().includes(normalizedKeyword),
  )

  if (match) return match.value
  return fallbackValue
}

const PAYMENT_PENDING_ID = 1

export function isPaymentPending(user) {
  return user?.paymentStatus === PAYMENT_PENDING_ID
}

export function buildUserRowActions(
  user,
  statusActions,
  actionText,
  { membersOnly = false, requestPaymentLabel = "Request payment" } = {},
) {
  const actions = []
  const {
    pendingValue,
    approvedValue: approved,
    rejectedValue,
    cancelledValue,
  } = statusActions

  if (pendingValue !== null && user.approvalStatus === pendingValue) {
    if (approved !== null) {
      actions.push({
        type: "status",
        label: actionText.approve,
        value: approved,
      })
    }
    if (!membersOnly && rejectedValue !== null) {
      actions.push({
        type: "status",
        label: actionText.reject,
        value: rejectedValue,
      })
    }
  } else if (approved !== null && user.approvalStatus === approved) {
    if (!membersOnly && rejectedValue !== null) {
      actions.push({
        type: "status",
        label: actionText.reject,
        value: rejectedValue,
      })
    }
  } else if (rejectedValue !== null && user.approvalStatus === rejectedValue) {
    if (approved !== null) {
      actions.push({
        type: "status",
        label: actionText.approve,
        value: approved,
      })
    }
  } else {
    if (approved !== null && user.approvalStatus !== approved) {
      actions.push({
        type: "status",
        label: actionText.approve,
        value: approved,
      })
    }
    if (!membersOnly && rejectedValue !== null && user.approvalStatus !== rejectedValue) {
      actions.push({
        type: "status",
        label: actionText.reject,
        value: rejectedValue,
      })
    }
  }

  if (cancelledValue !== null) {
    actions.push({
      type: "status",
      label: actionText.cancel,
      value: cancelledValue,
    })
  }

  if (membersOnly && isPaymentPending(user)) {
    actions.push({
      type: "requestPayment",
      label: requestPaymentLabel,
    })
  }

  return actions
}

export function filterAndSortUsers({
  users,
  query,
  orderBy,
  order,
  statusLabelMap,
  paymentLabelMap = null,
}) {
  const normalizedQuery = query.trim().toLowerCase()

  const filtered = normalizedQuery
    ? users.filter((user) => {
        const statusLabel = statusLabelMap.get(user.approvalStatus) || ""
        const paymentLabel = paymentLabelMap
          ? paymentLabelMap.get(user.paymentStatus) || ""
          : ""
        return [
          user.name,
          user.email,
          user.phoneNumber,
          statusLabel,
          paymentLabel,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      })
    : users

  const direction = order === "desc" ? -1 : 1

  return [...filtered].sort((left, right) => {
    if (orderBy === "createdAt") {
      const leftTs = new Date(left.createdAt).getTime()
      const rightTs = new Date(right.createdAt).getTime()
      return (leftTs - rightTs) * direction
    }

    if (orderBy === "approvalStatus") {
      const leftStatus = statusLabelMap.get(left.approvalStatus) || ""
      const rightStatus = statusLabelMap.get(right.approvalStatus) || ""
      return leftStatus.localeCompare(rightStatus) * direction
    }

    if (orderBy === "paymentStatus" && paymentLabelMap) {
      const leftPayment = paymentLabelMap.get(left.paymentStatus) || ""
      const rightPayment = paymentLabelMap.get(right.paymentStatus) || ""
      return leftPayment.localeCompare(rightPayment) * direction
    }

    const leftValue = String(left[orderBy] || "")
    const rightValue = String(right[orderBy] || "")
    return leftValue.localeCompare(rightValue) * direction
  })
}
