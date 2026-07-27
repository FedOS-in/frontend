"use client"

import * as React from "react"
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import FilterListIcon from "@mui/icons-material/FilterList"
import "./RenewalsToolbar.css"

export default function RenewalsToolbar({
  searchQuery,
  onSearchChange,
  dueStatusFilter,
  onDueStatusChange,
  paymentStatusFilter,
  onPaymentStatusChange,
  membershipTypeId,
  onMembershipTypeChange,
  federationNodeId,
  onFederationNodeChange,
  membershipTypes,
  nodes,
  labels,
}) {
  return (
    <Box className="renewals-toolbar">
      <TextField
        className="renewals-toolbar__search"
        size="small"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={labels.searchPlaceholder}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />

      <FormControl size="small" className="renewals-toolbar__select">
        <Select
          value={dueStatusFilter}
          displayEmpty
          onChange={(event) => onDueStatusChange(event.target.value)}>
          <MenuItem value="all">{labels.dueStatus}</MenuItem>
          <MenuItem value="due_30">{labels.all} — Due 30</MenuItem>
          <MenuItem value="due_15">Due 15</MenuItem>
          <MenuItem value="due_today">Due Today</MenuItem>
          <MenuItem value="overdue">Overdue</MenuItem>
          <MenuItem value="expired">Expired</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" className="renewals-toolbar__select">
        <Select
          value={paymentStatusFilter}
          displayEmpty
          onChange={(event) => onPaymentStatusChange(event.target.value)}>
          <MenuItem value="all">{labels.paymentStatus}</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="paid">Paid</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" className="renewals-toolbar__select">
        <Select
          value={membershipTypeId}
          displayEmpty
          onChange={(event) => onMembershipTypeChange(event.target.value)}>
          <MenuItem value="all">{labels.membershipType}</MenuItem>
          {membershipTypes.map((type) => (
            <MenuItem key={type.id} value={type.id}>
              {type.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" className="renewals-toolbar__select">
        <Select
          value={federationNodeId}
          displayEmpty
          onChange={(event) => onFederationNodeChange(event.target.value)}>
          <MenuItem value="all">{labels.organization}</MenuItem>
          {nodes.map((node) => (
            <MenuItem key={node.id} value={node.id}>
              {node.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        className="renewals-toolbar__filters"
        variant="outlined"
        startIcon={<FilterListIcon />}
        disabled>
        {labels.filters}
      </Button>
    </Box>
  )
}
