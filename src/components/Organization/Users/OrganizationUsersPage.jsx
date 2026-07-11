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
import "./OrganizationUsersPage.css"

export default function OrganizationUsersPage() {
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
          <InputLabel id="federation-node-label">Federation Node</InputLabel>
          <Select
            labelId="federation-node-label"
            value={selectedNodeId}
            label="Federation Node"
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
          label="Search users"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <Typography className="org-users__summary">
        Total Users: {rows.length}
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
