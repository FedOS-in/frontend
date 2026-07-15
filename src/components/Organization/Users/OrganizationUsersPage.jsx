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

export default function OrganizationUsersPage() {
  const text = useOrganizationText()
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
    statusLabelMap,
    getRowActions,
    handleUpdateStatus,
  } = useOrganizationUsersData()

  return (
    <div className="org-users">
      <div className="org-users__toolbar">
        <FormControl fullWidth size="small">
          <InputLabel id="federation-node-label">{text.usersToolbar.federationNode}</InputLabel>
          <Select
            labelId="federation-node-label"
            value={selectedNodeId}
            label={text.usersToolbar.federationNode}
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
          label={text.usersToolbar.searchUsers}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <Typography className="org-users__summary">
        {text.usersToolbar.totalUsers}: {rows.length}
      </Typography>

      {error ? <Alert severity="error">{error}</Alert> : null}
      {loading ? <CircularProgress size={24} /> : null}

      <OrganizationUsersTable
        rows={rows}
        orderBy={orderBy}
        order={order}
        statusLabelMap={statusLabelMap}
        onSort={handleSort}
        getRowActions={getRowActions}
        onAction={handleUpdateStatus}
      />
    </div>
  )
}
