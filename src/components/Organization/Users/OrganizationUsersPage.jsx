"use client"

import React from "react"
import {
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material"
import OrganizationUsersTable from "./OrganizationUsersTable"
import useOrganizationUsersData from "@/utils/useOrganizationUsersData"
import { useOrganizationText } from "@/i18n/organizationLanguageStore"
import "./OrganizationUsersPage.css"

export default function OrganizationUsersPage({ variant = "applicants" }) {
  const text = useOrganizationText()
  const membersOnly = variant === "members"
  const toolbarText = membersOnly ? text.membersToolbar : text.usersToolbar
  const {
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
  } = useOrganizationUsersData({ membersOnly })

  return (
    <div className="org-users">
      <div className="org-users__toolbar">
        <FormControl fullWidth size="small">
          <InputLabel id="federation-node-label">
            {toolbarText.federationNode}
          </InputLabel>
          <Select
            labelId="federation-node-label"
            value={selectedNodeId}
            label={toolbarText.federationNode}
            onChange={(event) => setSelectedNodeId(event.target.value)}>
            {nodes.map((node) => (
              <MenuItem key={node.id} value={node.id}>
                {node.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          size="small"
          label={toolbarText.searchUsers}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <Typography className="org-users__summary">
        {toolbarText.totalUsers}: {rows.length}
      </Typography>

      {error ? <Alert severity="error">{error}</Alert> : null}
      {successMessage ? (
        <Alert severity="success">{successMessage}</Alert>
      ) : null}
      {loading ? <CircularProgress size={24} /> : null}

      <OrganizationUsersTable
        rows={rows}
        orderBy={orderBy}
        order={order}
        statusLabelMap={statusLabelMap}
        paymentLabelMap={paymentLabelMap}
        showPaymentStatus={membersOnly}
        emptyState={
          membersOnly ? text.membersTable.emptyState : text.usersTable.emptyState
        }
        onSort={handleSort}
        getRowActions={getRowActions}
        onAction={handleUpdateStatus}
        onRequestPayment={handleRequestPayment}
      />
    </div>
  )
}
