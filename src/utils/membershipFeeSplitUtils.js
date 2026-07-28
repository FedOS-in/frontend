const SUM_TOLERANCE = 0.01

export function buildNodesById(nodes = []) {
  const map = new Map()
  for (const node of nodes) {
    map.set(node.id, node)
  }
  return map
}

/** Selected node first, then parents walking up to root. */
export function getAncestorChain(selectedNode, nodesById) {
  if (!selectedNode?.id) return []

  const chain = []
  let current =
    nodesById.get(selectedNode.id) || selectedNode

  while (current) {
    chain.push(current)
    const parentId = current.parentId || current.parent?.id
    current = parentId ? nodesById.get(parentId) : null
  }

  return chain
}

export function roundMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100
}

export function roundPercent(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100
}

export function amountFromPercent(fee, percent) {
  const feeNum = Number(fee)
  const percentNum = Number(percent)
  if (!Number.isFinite(feeNum) || !Number.isFinite(percentNum)) return 0
  return roundMoney((feeNum * percentNum) / 100)
}

export function percentFromAmount(fee, amount) {
  const feeNum = Number(fee)
  const amountNum = Number(amount)
  if (!Number.isFinite(feeNum) || feeNum === 0 || !Number.isFinite(amountNum)) {
    return 0
  }
  return roundPercent((amountNum / feeNum) * 100)
}

export function createInitialSplitRow(federationNodeId, fee) {
  const feeNum = Number(fee)
  const amount = Number.isFinite(feeNum) ? roundMoney(feeNum) : 0
  return {
    federationNodeId: federationNodeId || "",
    amount: String(amount),
    percentage: "100",
  }
}

export function remainingForSplits(fee, rows, excludeIndex = -1) {
  const feeNum = Number(fee)
  if (!Number.isFinite(feeNum)) {
    return { amount: 0, percentage: 0 }
  }

  let usedAmount = 0
  let usedPercent = 0

  rows.forEach((row, index) => {
    if (index === excludeIndex) return
    usedAmount += Number(row.amount) || 0
    usedPercent += Number(row.percentage) || 0
  })

  return {
    amount: roundMoney(Math.max(feeNum - usedAmount, 0)),
    percentage: roundPercent(Math.max(100 - usedPercent, 0)),
  }
}

export function nextUnusedAncestor(chain, usedIds) {
  return chain.find((node) => !usedIds.has(node.id)) || null
}

export function recalculateAmountsFromPercents(rows, fee) {
  return rows.map((row) => ({
    ...row,
    amount: String(amountFromPercent(fee, row.percentage)),
  }))
}

export function mapApiSplitsToForm(feeSplits, feeType) {
  if (!Array.isArray(feeSplits)) return []
  return feeSplits
    .filter((split) => split.feeType === feeType)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((split) => ({
      federationNodeId: split.federationNodeId,
      amount: String(split.amount ?? ""),
      percentage: String(split.percentage ?? ""),
    }))
}

export function validateSplitRows(rows, fee, labels, allowedIds) {
  if (!rows.length) return ""

  const seen = new Set()
  let percentSum = 0
  let amountSum = 0

  for (const row of rows) {
    if (!row.federationNodeId) return labels.nodeRequired
    if (!allowedIds.has(row.federationNodeId)) return labels.nodeInvalid
    if (seen.has(row.federationNodeId)) return labels.nodeUnique
    seen.add(row.federationNodeId)

    const amount = Number(row.amount)
    const percentage = Number(row.percentage)
    if (!Number.isFinite(amount) || !Number.isFinite(percentage)) {
      return labels.numberRequired
    }
    percentSum += percentage
    amountSum += amount
  }

  if (Math.abs(percentSum - 100) > SUM_TOLERANCE) {
    return labels.percentTotal
  }
  if (Math.abs(amountSum - Number(fee)) > SUM_TOLERANCE) {
    return labels.amountTotal
  }

  return ""
}

export function toPayloadSplits(rows) {
  return rows.map((row) => ({
    federationNodeId: row.federationNodeId,
    amount: Number(row.amount),
    percentage: Number(row.percentage),
  }))
}
