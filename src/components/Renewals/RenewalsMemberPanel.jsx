"use client"

import * as React from "react"
import {
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined"
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined"
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined"
import {
  formatExpiryDate,
  formatRenewalFee,
} from "./useRenewalsData"
import "./RenewalsMemberPanel.css"

function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

export default function RenewalsMemberPanel({
  open,
  member,
  onClose,
  onGeneratePaymentLink,
  onRecordOfflinePayment,
  onViewDetail,
  labels,
  statusLabels,
  currencyPrefix,
}) {
  if (!member) return null

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      className="renewals-member-panel">
      <Box className="renewals-member-panel__content">
        <Box className="renewals-member-panel__title-row">
          <Typography className="renewals-member-panel__title">
            {labels.title || "Member Preview"}
          </Typography>
          <IconButton onClick={onClose} size="small" aria-label="close">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box className="renewals-member-panel__header">
          <Box className="renewals-member-panel__identity">
            <Box className="renewals-member-panel__avatar">
              {initials(member.name)}
            </Box>
            <Box>
              <Typography className="renewals-member-panel__name">
                {member.name}
              </Typography>
              <Typography className="renewals-member-panel__meta">
                {member.memberId || "—"} · {member.phoneNumber}
              </Typography>
              <Chip
                size="small"
                label={labels.activeMember}
                className="renewals-member-panel__active-chip"
              />
            </Box>
          </Box>
        </Box>

        <Divider />

        <Box className="renewals-member-panel__section">
          <Typography className="renewals-member-panel__section-title">
            {labels.membershipDetails}
          </Typography>
          <Typography className="renewals-member-panel__plan">
            {member.membershipType?.label || "—"}
          </Typography>

          <Box className="renewals-member-panel__grid">
            <Box>
              <Typography className="renewals-member-panel__label">
                {labels.expiryDate}
              </Typography>
              <Typography className="renewals-member-panel__value">
                {formatExpiryDate(member.membershipExpiresAt)}
              </Typography>
            </Box>
            <Box>
              <Typography className="renewals-member-panel__label">
                {labels.daysLeft}
              </Typography>
              <Typography className="renewals-member-panel__value">
                {member.daysLeft ?? "—"}
              </Typography>
            </Box>
            <Box>
              <Typography className="renewals-member-panel__label">
                {labels.renewalFee}
              </Typography>
              <Typography className="renewals-member-panel__value">
                {formatRenewalFee(member.renewalFee, currencyPrefix)}
              </Typography>
            </Box>
            <Box>
              <Typography className="renewals-member-panel__label">
                {labels.paymentStatus}
              </Typography>
              <Typography className="renewals-member-panel__value">
                {statusLabels[member.paymentStatus] || member.paymentStatus}
              </Typography>
            </Box>
            <Box>
              <Typography className="renewals-member-panel__label">
                {labels.renewalStatus}
              </Typography>
              <Typography className="renewals-member-panel__value">
                {statusLabels[member.renewalStatus] || member.renewalStatus}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box className="renewals-member-panel__actions">
          <Button
            fullWidth
            variant="contained"
            startIcon={<LinkOutlinedIcon />}
            onClick={() => onGeneratePaymentLink?.(member)}>
            {labels.generatePaymentLink}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<PaymentsOutlinedIcon />}
            onClick={() => onRecordOfflinePayment?.(member)}>
            {labels.recordOfflinePayment}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<VisibilityOutlinedIcon />}
            onClick={() => onViewDetail?.(member)}>
            {labels.viewDetail}
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}
