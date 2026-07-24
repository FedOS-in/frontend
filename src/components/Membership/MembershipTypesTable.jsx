"use client"

import * as React from "react"
import {
  Box,
  Button,
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
import BadgeIcon from "@mui/icons-material/Badge"
import { formatMembershipFee } from "./useMembershipTypesData"
import MembershipTypeDetailsModal from "./MembershipTypeDetailsModal"
import "./MembershipTypesTable.css"

export default function MembershipTypesTable({
  rows,
  labels,
  statusLabels,
  viewModalLabels,
  closeLabel,
  onEdit,
}) {
  const [menuAnchor, setMenuAnchor] = React.useState(null)
  const [selectedId, setSelectedId] = React.useState("")
  const [viewItem, setViewItem] = React.useState(null)

  const selectedRow = rows.find((row) => row.id === selectedId) || null

  const handleMenuOpen = (event, rowId) => {
    setMenuAnchor(event.currentTarget)
    setSelectedId(rowId)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
    setSelectedId("")
  }

  const handleEdit = () => {
    if (selectedRow) {
      onEdit?.(selectedRow)
    }
    handleMenuClose()
  }

  return (
    <>
      <TableContainer
        component={Paper}
        elevation={0}
        className="membership-types-table">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{labels.membershipType}</TableCell>
              <TableCell>{labels.code}</TableCell>
              <TableCell>{labels.validity}</TableCell>
              <TableCell>{labels.joiningFee}</TableCell>
              <TableCell>{labels.renewalFee}</TableCell>
              <TableCell align="right">{labels.members}</TableCell>
              <TableCell>{labels.status}</TableCell>
              <TableCell align="right">{labels.actions}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8}>
                  <Typography
                    color="text.secondary"
                    className="membership-types-table__empty">
                    {labels.emptyState}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((item) => {
                const isActive = Number(item.status) === 1
                const isLifetime = /lifetime/i.test(item.validity?.label || "")
                const renewalDisplay =
                  isLifetime && Number(item.renewalFee) === 0
                    ? "—"
                    : formatMembershipFee(item.renewalFee, item.currency)

                return (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Box className="membership-types-table__type">
                        <Box className="membership-types-table__type-icon">
                          <BadgeIcon fontSize="small" />
                        </Box>
                        <Box>
                          <span className="membership-types-table__type-name">
                            {item.label}
                          </span>
                          {item.description ? (
                            <span className="membership-types-table__type-desc">
                              {item.description}
                            </span>
                          ) : null}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography className="membership-types-table__code">
                        {item.code}
                      </Typography>
                    </TableCell>
                    <TableCell>{item.validity?.label || "—"}</TableCell>
                    <TableCell>
                      {formatMembershipFee(item.joiningFee, item.currency)}
                    </TableCell>
                    <TableCell>{renewalDisplay}</TableCell>
                    <TableCell align="right">
                      {(Number(item._count?.users) || 0).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={
                          isActive
                            ? statusLabels.active
                            : statusLabels.inactive
                        }
                        color={isActive ? "success" : "default"}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box className="membership-types-table__actions">
                        <Button
                          size="small"
                          variant="text"
                          onClick={() => setViewItem(item)}>
                          {labels.view}
                        </Button>
                        <IconButton
                          size="small"
                          aria-label="more"
                          onClick={(event) => handleMenuOpen(event, item.id)}>
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}>
        <MenuItem onClick={handleEdit}>{labels.edit}</MenuItem>
      </Menu>

      <MembershipTypeDetailsModal
        open={Boolean(viewItem)}
        membershipType={viewItem}
        labels={viewModalLabels}
        statusLabels={statusLabels}
        closeLabel={closeLabel}
        editLabel={labels.edit}
        onClose={() => setViewItem(null)}
        onEdit={onEdit}
      />
    </>
  )
}
