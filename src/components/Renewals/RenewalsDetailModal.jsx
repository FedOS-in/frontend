"use client"

import * as React from "react"
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import {
  formatExpiryDate,
  formatRenewalFee,
} from "./renewalsApi"
import "./RenewalsDetailModal.css"

function DetailRow({ label, children }) {
  return (
    <Box className="renewals-detail-modal__row">
      <Typography className="renewals-detail-modal__label">{label}</Typography>
      <Box className="renewals-detail-modal__value">{children}</Box>
    </Box>
  )
}

export default function RenewalsDetailModal({
  open,
  member,
  onClose,
  labels,
  statusLabels,
  daysLeftLabels,
  currencyPrefix,
}) {
  if (!member) return null

  const paymentMethod = member.lastPayment?.paymentMethod || "—"
  const paymentKind = member.lastPayment?.kind || "—"
  const daysBucketLabel =
    daysLeftLabels?.[member.bucket] || member.bucket || ""

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="renewals-detail-modal__title-row">
        <span>{labels.title}</span>
        <IconButton size="small" onClick={onClose} aria-label="close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers className="renewals-detail-modal__content">
        <Box className="renewals-detail-modal__section">
          <Typography className="renewals-detail-modal__section-title">
            {labels.memberSection}
          </Typography>
          <DetailRow label={labels.memberName}>{member.name}</DetailRow>
          <DetailRow label={labels.memberId}>
            {member.memberId || "—"}
          </DetailRow>
          <DetailRow label={labels.phone}>{member.phoneNumber || "—"}</DetailRow>
          <DetailRow label={labels.email}>{member.email || "—"}</DetailRow>
          <DetailRow label={labels.organization}>
            {member.organization?.name || "—"}
          </DetailRow>
        </Box>

        <Divider />

        <Box className="renewals-detail-modal__section">
          <Typography className="renewals-detail-modal__section-title">
            {labels.membershipSection}
          </Typography>
          <DetailRow label={labels.membershipType}>
            {member.membershipType?.label || "—"}
          </DetailRow>
          <DetailRow label={labels.expiryDate}>
            {formatExpiryDate(member.membershipExpiresAt)}
          </DetailRow>
          <DetailRow label={labels.daysLeft}>
            {member.daysLeft == null
              ? "—"
              : `${member.daysLeft} ${daysBucketLabel}`.trim()}
          </DetailRow>
          <DetailRow label={labels.renewalFee}>
            {formatRenewalFee(member.renewalFee, currencyPrefix)}
          </DetailRow>
          <DetailRow label={labels.renewalStatus}>
            <Chip
              size="small"
              label={statusLabels[member.renewalStatus] || member.renewalStatus}
              className={`renewals-detail-modal__chip renewals-detail-modal__chip--${member.renewalStatus}`}
            />
          </DetailRow>
          <DetailRow label={labels.paymentStatus}>
            <Chip
              size="small"
              label={
                statusLabels[member.paymentStatus] || member.paymentStatus
              }
              className={`renewals-detail-modal__chip renewals-detail-modal__chip--${member.paymentStatus}`}
            />
          </DetailRow>
        </Box>

        <Divider />

        <Box className="renewals-detail-modal__section">
          <Typography className="renewals-detail-modal__section-title">
            {labels.lastPaymentSection}
          </Typography>
          {member.lastPayment ? (
            <>
              <DetailRow label={labels.paymentDate}>
                {formatExpiryDate(member.lastPayment.paymentDate)}
              </DetailRow>
              <DetailRow label={labels.paymentAmount}>
                {formatRenewalFee(member.lastPayment.amount, currencyPrefix)}
              </DetailRow>
              <DetailRow label={labels.paymentMethod}>{paymentMethod}</DetailRow>
              <DetailRow label={labels.paymentKind}>{paymentKind}</DetailRow>
            </>
          ) : (
            <Typography color="text.secondary">{labels.noPayment}</Typography>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  )
}
