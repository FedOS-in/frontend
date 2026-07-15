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
import { useOrganizationText } from "@/i18n/organizationLanguageStore"
import "./OrganizationUsersTable.css"

export default function OrganizationUsersTable({
  rows,
  orderBy,
  order,
  statusLabelMap,
  onSort,
  getRowActions,
  onAction,
}) {
  const text = useOrganizationText()
  const columns = [
    { id: "name", label: text.usersTable.columns.name },
    { id: "email", label: text.usersTable.columns.email },
    { id: "phoneNumber", label: text.usersTable.columns.phoneNumber },
    { id: "approvalStatus", label: text.usersTable.columns.approvalStatus },
    { id: "createdAt", label: text.usersTable.columns.createdAt },
  ]
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
            {columns.map((column) => (
              <TableCell key={column.id}>
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={orderBy === column.id ? order : "asc"}
                  onClick={() => onSort(column.id)}>
                  {column.label}
                </TableSortLabel>
              </TableCell>
            ))}
            <TableCell align="center">{text.usersTable.action}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} hover>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.phoneNumber}</TableCell>
              <TableCell>
                {statusLabelMap.get(row.approvalStatus) || text.usersTable.unknown}
              </TableCell>
              <TableCell>
                {new Date(row.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell align="center">
                <IconButton
                  aria-label={text.usersTable.rowActions}
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
                  {text.usersTable.emptyState}
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
