"use client"

import * as React from "react"
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material"
import "./MembershipTypeFeeSplitRow.css"

export default function MembershipTypeFeeSplitRow({
  row,
  index,
  eligibleNodes,
  usedIds,
  showAdd,
  amountLabel,
  percentageLabel,
  nodeLabel,
  onNodeChange,
  onAmountChange,
  onPercentageChange,
  onAdd,
  onRemove,
}) {
  const options = eligibleNodes.filter(
    (node) =>
      node.id === row.federationNodeId || !usedIds.has(node.id),
  )

  return (
    <div className="membership-type-fee-split-row">
      <FormControl
        size="small"
        className="membership-type-fee-split-row__node"
        required>
        <InputLabel id={`fee-split-node-${index}`}>{nodeLabel}</InputLabel>
        <Select
          labelId={`fee-split-node-${index}`}
          label={nodeLabel}
          value={row.federationNodeId}
          onChange={(event) => onNodeChange(index, event.target.value)}>
          {options.map((node) => (
            <MenuItem key={node.id} value={node.id}>
              {node.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        size="small"
        label={amountLabel}
        type="number"
        value={row.amount}
        onChange={(event) => onAmountChange(index, event.target.value)}
        className="membership-type-fee-split-row__amount"
        slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
      />

      <TextField
        size="small"
        label={percentageLabel}
        type="number"
        value={row.percentage}
        onChange={(event) => onPercentageChange(index, event.target.value)}
        className="membership-type-fee-split-row__percent"
        slotProps={{ htmlInput: { min: 0, max: 100, step: "0.01" } }}
      />

      <div className="membership-type-fee-split-row__actions">
        {showAdd ? (
          <IconButton
            aria-label="add-split-row"
            size="small"
            color="primary"
            onClick={onAdd}>
            <AddIcon fontSize="small" />
          </IconButton>
        ) : null}
        <IconButton
          aria-label="remove-split-row"
          size="small"
          color="error"
          onClick={() => onRemove(index)}>
          <RemoveIcon fontSize="small" />
        </IconButton>
      </div>
    </div>
  )
}
