export function buildStatusLabelMap(statuses) {
  return new Map(statuses.map((status) => [status.value, status.name]))
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

export function filterAndSortUsers({
  users,
  query,
  orderBy,
  order,
  statusLabelMap,
}) {
  const normalizedQuery = query.trim().toLowerCase()

  const filtered = normalizedQuery
    ? users.filter((user) => {
        const statusLabel = statusLabelMap.get(user.approvalStatus) || ""
        return [user.name, user.email, user.phoneNumber, statusLabel]
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

    const leftValue = String(left[orderBy] || "")
    const rightValue = String(right[orderBy] || "")
    return leftValue.localeCompare(rightValue) * direction
  })
}
