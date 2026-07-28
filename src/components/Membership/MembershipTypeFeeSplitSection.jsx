"use client"

import * as React from "react"
import { Stack, Typography } from "@mui/material"
import MembershipTypeFeeSplitRow from "./MembershipTypeFeeSplitRow"
import {
  amountFromPercent,
  buildNodesById,
  getAncestorChain,
  nextUnusedAncestor,
  percentFromAmount,
  remainingForSplits,
} from "../../utils/membershipFeeSplitUtils"
import "./MembershipTypeFeeSplitSection.css"

export default function MembershipTypeFeeSplitSection({
  title,
  amountLabel,
  percentageLabel,
  nodeLabel,
  feeTotal,
  selectedNode,
  federationOptions,
  rows,
  onRowsChange,
  onCloseSection,
}) {
  const nodesById = React.useMemo(
    () => buildNodesById(federationOptions),
    [federationOptions],
  )
  const eligibleNodes = React.useMemo(
    () => getAncestorChain(selectedNode, nodesById),
    [selectedNode, nodesById],
  )
  const usedIds = React.useMemo(
    () => new Set(rows.map((row) => row.federationNodeId).filter(Boolean)),
    [rows],
  )
  const canAdd = rows.length < eligibleNodes.length

  const updateRow = (index, patch) => {
    onRowsChange(
      rows.map((row, rowIndex) =>
        rowIndex === index ? { ...row, ...patch } : row,
      ),
    )
  }

  const handleNodeChange = (index, federationNodeId) => {
    updateRow(index, { federationNodeId })
  }

  const handleAmountChange = (index, amountValue) => {
    updateRow(index, {
      amount: amountValue,
      percentage: String(percentFromAmount(feeTotal, amountValue)),
    })
  }

  const handlePercentageChange = (index, percentageValue) => {
    updateRow(index, {
      percentage: percentageValue,
      amount: String(amountFromPercent(feeTotal, percentageValue)),
    })
  }

  const handleAdd = () => {
    const nextNode = nextUnusedAncestor(eligibleNodes, usedIds)
    if (!nextNode) return
    const remaining = remainingForSplits(feeTotal, rows)
    onRowsChange([
      ...rows,
      {
        federationNodeId: nextNode.id,
        amount: String(remaining.amount),
        percentage: String(remaining.percentage),
      },
    ])
  }

  const handleRemove = (index) => {
    const nextRows = rows.filter((_, rowIndex) => rowIndex !== index)
    if (nextRows.length === 0) {
      onCloseSection()
      return
    }
    onRowsChange(nextRows)
  }

  return (
    <Stack
      spacing={1.25}
      className="membership-type-fee-split-section">
      <Typography
        variant="subtitle2"
        className="membership-type-fee-split-section__title">
        {title}
      </Typography>
      {rows.map((row, index) => (
        <MembershipTypeFeeSplitRow
          key={`${row.federationNodeId || "empty"}-${index}`}
          row={row}
          index={index}
          eligibleNodes={eligibleNodes}
          usedIds={usedIds}
          showAdd={canAdd && index === rows.length - 1}
          amountLabel={amountLabel}
          percentageLabel={percentageLabel}
          nodeLabel={nodeLabel}
          onNodeChange={handleNodeChange}
          onAmountChange={handleAmountChange}
          onPercentageChange={handlePercentageChange}
          onAdd={handleAdd}
          onRemove={handleRemove}
        />
      ))}
    </Stack>
  )
}
