"use client"

import * as React from "react"
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { useOrganizationText } from "@/i18n/organizationLanguageStore"
import "./MembershipTypesList.css"

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

export default function MembershipTypesList({ refreshKey = 0 }) {
  const text = useOrganizationText()
  const [items, setItems] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [errorMessage, setErrorMessage] = React.useState("")

  React.useEffect(() => {
    const controller = new AbortController()

    async function loadMembershipTypes() {
      setLoading(true)
      setErrorMessage("")

      try {
        const response = await fetch(`${backendUrl}/api/membership-types`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(text.membershipTypesPage.loadError)
        }

        const payload = await response.json()
        setItems(Array.isArray(payload) ? payload : [])
      } catch (error) {
        if (error.name !== "AbortError") {
          setErrorMessage(
            error.message || text.membershipTypesPage.loadError,
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadMembershipTypes()

    return () => {
      controller.abort()
    }
  }, [refreshKey, text.membershipTypesPage.loadError])

  if (loading) {
    return (
      <Box className="membership-types-list__loading">
        <CircularProgress size={28} />
        <Typography variant="body2" color="text.secondary">
          {text.membershipTypesPage.loading}
        </Typography>
      </Box>
    )
  }

  if (errorMessage) {
    return <Alert severity="error">{errorMessage}</Alert>
  }

  if (items.length === 0) {
    return (
      <Paper className="membership-types-list__empty" elevation={0}>
        <Typography color="text.secondary">
          {text.membershipTypesPage.emptyState}
        </Typography>
      </Paper>
    )
  }

  const columns = text.membershipTypesPage.columns

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      className="membership-types-list__table">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{columns.title}</TableCell>
            <TableCell>{columns.code}</TableCell>
            <TableCell>{columns.federation}</TableCell>
            <TableCell>{columns.validity}</TableCell>
            <TableCell>{columns.currency}</TableCell>
            <TableCell align="right">{columns.joiningFee}</TableCell>
            <TableCell align="right">{columns.renewalFee}</TableCell>
            <TableCell>{columns.status}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} hover>
              <TableCell>{item.label}</TableCell>
              <TableCell>{item.code}</TableCell>
              <TableCell>
                {item.federationNode?.name || item.federationNodeId}
              </TableCell>
              <TableCell>{item.validity?.label || "—"}</TableCell>
              <TableCell>{item.currency?.name || "—"}</TableCell>
              <TableCell align="right">{item.joiningFee}</TableCell>
              <TableCell align="right">{item.renewalFee}</TableCell>
              <TableCell>
                <Chip
                  size="small"
                  label={
                    item.status === 1
                      ? text.membershipTypesPage.status.active
                      : text.membershipTypesPage.status.inactive
                  }
                  color={item.status === 1 ? "success" : "default"}
                  variant="outlined"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
