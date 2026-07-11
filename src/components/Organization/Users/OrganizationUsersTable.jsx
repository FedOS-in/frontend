"use client"

import React from "react"
import {
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import "./OrganizationUsersTable.css"

const COLUMNS = [
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "phoneNumber", label: "Phone" },
  { id: "approvalStatus", label: "Approval Status" },
  { id: "createdAt", label: "Created" },
]

export default function OrganizationUsersTable({
  rows,
  orderBy,
  order,
  statusLabelMap,
  onSort,
  getRowActions,
  onAction,
}) {
  const [menuAnchor, setMenuAnchor] = React.useState(null)
  const [selectedUserId, setSelectedUserId] = React.useState("")

  const selectedRow = rows.find((row) => row.id === selectedUserId) || null
  const availableActions = selectedRow ? getRowActions(selectedRow) : []

  const handleMenuOpen = (event, userId) => {
    setMenuAnchor(event.currentTarget)
    setSelectedUserId(userId)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
    setSelectedUserId("")
  }

  return (
    <TableContainer component={Paper} className="org-users-table">
      <Table>
        <TableHead>
          <TableRow>
            {COLUMNS.map((column) => (
              <TableCell key={column.id}>
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={orderBy === column.id ? order : "asc"}
                  onClick={() => onSort(column.id)}>
                  {column.label}
                </TableSortLabel>
              </TableCell>
            ))}
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} hover>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.phoneNumber}</TableCell>
              <TableCell>
                {statusLabelMap.get(row.approvalStatus) || "Unknown"}
              </TableCell>
              <TableCell>
                {new Date(row.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell align="center">
                <IconButton
                  aria-label="row actions"
                  onClick={(event) => handleMenuOpen(event, row.id)}
                  size="small">
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}

          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography className="org-users-table__empty">
                  No users found.
                </Typography>
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}>
        {availableActions.map((action) => (
          <MenuItem
            key={action.label}
            onClick={() => {
              onAction(selectedUserId, action.value)
              handleMenuClose()
            }}>
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </TableContainer>
  )
}
