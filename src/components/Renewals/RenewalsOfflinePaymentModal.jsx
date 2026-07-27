"use client"

import * as React from "react"
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material"
import { formatRenewalFee, recordOfflinePayment } from "./useRenewalsData"
import "./RenewalsOfflinePaymentModal.css"

export default function RenewalsOfflinePaymentModal({
  open,
  members = [],
  onClose,
  onSuccess,
  labels,
  currencyPrefix,
}) {
  const [submitting, setSubmitting] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")

  const totalAmount = members.reduce(
    (sum, member) => sum + Number(member.renewalFee || 0),
    0,
  )

  const handleConfirm = async () => {
    if (!members.length) return
    setSubmitting(true)
    setErrorMessage("")

    try {
      for (const member of members) {
        await recordOfflinePayment(member.id)
      }
      onSuccess?.(members.length)
      onClose?.()
    } catch (error) {
      setErrorMessage(error.message || labels.error)
    } finally {
      setSubmitting(false)
    }
  }

  React.useEffect(() => {
    if (!open) setErrorMessage("")
  }, [open])

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{labels.title}</DialogTitle>
      <DialogContent dividers className="renewals-offline-modal__content">
        {errorMessage ? (
          <Alert severity="error" className="renewals-offline-modal__alert">
            {errorMessage}
          </Alert>
        ) : null}

        {members.length === 1 ? (
          <>
            <Typography className="renewals-offline-modal__label">
              {labels.memberLabel}
            </Typography>
            <Typography className="renewals-offline-modal__value">
              {members[0].name} ({members[0].memberId || "—"})
            </Typography>
          </>
        ) : (
          <Typography className="renewals-offline-modal__value">
            {members.length} members
          </Typography>
        )}

        <Typography className="renewals-offline-modal__label">
          {labels.amountLabel}
        </Typography>
        <Typography className="renewals-offline-modal__amount">
          {formatRenewalFee(totalAmount, currencyPrefix)}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          {labels.cancel}
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={submitting || members.length === 0}>
          {submitting ? labels.submitting : labels.confirm}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
