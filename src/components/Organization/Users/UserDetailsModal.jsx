"use client"

import React from "react"
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material"
import { formatDynamicFieldValue } from "./organizationUsersUtils"
import { useOrganizationText } from "@/i18n/organizationLanguageStore"
import "./UserDetailsModal.css"

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

function DetailRow({ label, value }) {
  return (
    <div className="user-details-modal__row">
      <Typography
        component="dt"
        variant="body2"
        className="user-details-modal__label">
        {label}
      </Typography>
      <Typography
        component="dd"
        variant="body2"
        className="user-details-modal__value">
        {value || "—"}
      </Typography>
    </div>
  )
}

export default function UserDetailsModal({
  open,
  user,
  statusLabelMap,
  onClose,
}) {
  const text = useOrganizationText()
  const modalText = text.usersTable.viewModal
  const [formFields, setFormFields] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    if (!open || !user?.formId) {
      setFormFields([])
      setError("")
      return
    }

    const controller = new AbortController()

    async function loadFormFields() {
      setLoading(true)
      setError("")

      try {
        const response = await fetch(
          `${backendUrl}/api/forms/${user.formId}`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error(modalText.loadError)
        }

        const form = await response.json()
        const fields = Array.isArray(form?.fields) ? form.fields : []
        setFormFields(
          [...fields].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
        )
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(loadError.message || modalText.loadError)
          setFormFields([])
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadFormFields()

    return () => controller.abort()
  }, [open, user?.formId, modalText.loadError])

  if (!user) return null

  const dynamicValues = user.dynamicFields || {}
  const statusLabel =
    statusLabelMap.get(user.approvalStatus) || text.usersTable.unknown

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="user-details-modal__title">
        {modalText.title}
      </DialogTitle>
      <DialogContent dividers className="user-details-modal__content">
        <Typography
          variant="subtitle2"
          className="user-details-modal__section-title">
          {modalText.profileSection}
        </Typography>
        <dl className="user-details-modal__list">
          <DetailRow label={modalText.fields.name} value={user.name} />
          <DetailRow label={modalText.fields.email} value={user.email} />
          <DetailRow
            label={modalText.fields.phoneNumber}
            value={user.phoneNumber}
          />
          <DetailRow
            label={modalText.fields.addressLine1}
            value={user.addressLine1}
          />
          <DetailRow
            label={modalText.fields.addressLine2}
            value={user.addressLine2}
          />
          <DetailRow label={modalText.fields.city} value={user.city} />
          <DetailRow label={modalText.fields.state} value={user.state} />
          <DetailRow label={modalText.fields.pincode} value={user.pincode} />
          <DetailRow
            label={modalText.fields.approvalStatus}
            value={statusLabel}
          />
          <DetailRow
            label={modalText.fields.createdAt}
            value={
              user.createdAt
                ? new Date(user.createdAt).toLocaleString()
                : "—"
            }
          />
        </dl>

        <Typography
          variant="subtitle2"
          className="user-details-modal__section-title">
          {modalText.dynamicSection}
        </Typography>

        {loading ? (
          <div className="user-details-modal__loading">
            <CircularProgress size={24} />
          </div>
        ) : null}

        {error ? <Alert severity="error">{error}</Alert> : null}

        {!loading && !error && formFields.length === 0 ? (
          <Typography variant="body2" className="user-details-modal__empty">
            {modalText.emptyDynamic}
          </Typography>
        ) : null}

        {!loading && !error && formFields.length > 0 ? (
          <dl className="user-details-modal__list">
            {formFields.map((field) => (
              <DetailRow
                key={field.id}
                label={field.label}
                value={formatDynamicFieldValue(
                  dynamicValues[field.fieldKey],
                )}
              />
            ))}
          </dl>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{text.common.close}</Button>
      </DialogActions>
    </Dialog>
  )
}
