"use client"

import * as React from "react"
import {
  Box,
  Checkbox,
  Chip,
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
  Typography,
} from "@mui/material"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined"
import {
  formatExpiryDate,
  formatRenewalFee,
} from "./useRenewalsData"
import "./RenewalsTable.css"

function statusChipClass(status) {
  return `renewals-table__chip renewals-table__chip--${status || "active"}`
}

function daysLeftLabel(row, daysLeftLabels) {
  const days = row.daysLeft
  if (days == null) return "—"
  const bucketLabel = daysLeftLabels?.[row.bucket] || row.bucket || ""
  return `${days} ${bucketLabel}`
}

export default function RenewalsTable({
  rows,
  selectedIds,
  onToggleSelect,
  onRowClick,
  onGeneratePaymentLink,
  onRecordOfflinePayment,
  labels,
  statusLabels,
  daysLeftLabels,
  actionLabels,
  currencyPrefix,
}) {
  const [menuAnchor, setMenuAnchor] = React.useState(null)
  const [menuRow, setMenuRow] = React.useState(null)

  const handleMenuOpen = (event, row) => {
    event.stopPropagation()
    setMenuAnchor(event.currentTarget)
    setMenuRow(row)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
    setMenuRow(null)
  }

  return (
    <>
      <TableContainer
        component={Paper}
        elevation={0}
        className="renewals-table">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" />
              <TableCell>{labels.memberId}</TableCell>
              <TableCell>{labels.memberName}</TableCell>
              <TableCell>{labels.membershipType}</TableCell>
              <TableCell>{labels.organization}</TableCell>
              <TableCell>{labels.expiryDate}</TableCell>
              <TableCell>{labels.daysLeft}</TableCell>
              <TableCell>{labels.renewalFee}</TableCell>
              <TableCell>{labels.renewalStatus}</TableCell>
              <TableCell>{labels.paymentStatus}</TableCell>
              <TableCell align="right">{labels.actions}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11}>
                  <Typography
                    color="text.secondary"
                    className="renewals-table__empty">
                    {labels.emptyState}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  selected={selectedIds.includes(row.id)}
                  onClick={() => onRowClick?.(row)}
                  className="renewals-table__row">
                  <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      size="small"
                      checked={selectedIds.includes(row.id)}
                      onChange={() => onToggleSelect(row.id)}
                    />
                  </TableCell>
                  <TableCell>{row.memberId || "—"}</TableCell>
                  <TableCell>
                    <Box className="renewals-table__member">
                      <Typography className="renewals-table__member-name">
                        {row.name}
                      </Typography>
                      <Typography className="renewals-table__member-phone">
                        {row.phoneNumber}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={row.membershipType?.label || "—"}
                      className="renewals-table__type-chip"
                    />
                  </TableCell>
                  <TableCell>{row.organization?.name || "—"}</TableCell>
                  <TableCell>
                    {formatExpiryDate(row.membershipExpiresAt)}
                  </TableCell>
                  <TableCell>
                    <Typography
                      className={`renewals-table__days renewals-table__days--${row.renewalStatus || "active"}`}>
                      {daysLeftLabel(row, daysLeftLabels)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {formatRenewalFee(row.renewalFee, currencyPrefix)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={
                        statusLabels[row.renewalStatus] || row.renewalStatus
                      }
                      className={statusChipClass(row.renewalStatus)}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={
                        statusLabels[row.paymentStatus] || row.paymentStatus
                      }
                      className={statusChipClass(row.paymentStatus)}
                    />
                  </TableCell>
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <Box className="renewals-table__actions">
                      <IconButton
                        size="small"
                        aria-label="view member"
                        onClick={() => onRowClick?.(row)}>
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        aria-label="more actions"
                        onClick={(event) => handleMenuOpen(event, row)}>
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            onGeneratePaymentLink?.(menuRow)
            handleMenuClose()
          }}>
          {actionLabels?.generatePaymentLink || "Generate Payment Link"}
        </MenuItem>
        <MenuItem
          onClick={() => {
            onRecordOfflinePayment?.(menuRow)
            handleMenuClose()
          }}>
          {actionLabels?.recordOfflinePayment || "Record Offline Payment"}
        </MenuItem>
      </Menu>
    </>
  )
}
