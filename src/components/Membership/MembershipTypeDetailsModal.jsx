"use client"

import * as React from "react"
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material"
import { formatMembershipFee } from "./useMembershipTypesData"
import "./MembershipTypeDetailsModal.css"

function DetailRow({ label, value }) {
  return (
    <div className="membership-type-details-modal__row">
      <Typography
        component="dt"
        variant="body2"
        className="membership-type-details-modal__label">
        {label}
      </Typography>
      <Typography
        component="dd"
        variant="body2"
        className="membership-type-details-modal__value">
        {value || "—"}
      </Typography>
    </div>
  )
}

export default function MembershipTypeDetailsModal({
  open,
  membershipType,
  labels,
  statusLabels,
  closeLabel,
  editLabel,
  onClose,
  onEdit,
}) {
  if (!membershipType) return null

  const isActive = Number(membershipType.status) === 1
  const isLifetime = /lifetime/i.test(membershipType.validity?.label || "")
  const renewalDisplay =
    isLifetime && Number(membershipType.renewalFee) === 0
      ? "—"
      : formatMembershipFee(
          membershipType.renewalFee,
          membershipType.currency,
        )

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="membership-type-details-modal__title">
        {labels.title}
      </DialogTitle>
      <DialogContent
        dividers
        className="membership-type-details-modal__content">
        <dl className="membership-type-details-modal__list">
          <DetailRow
            label={labels.fields.title}
            value={membershipType.label}
          />
          <DetailRow
            label={labels.fields.description}
            value={membershipType.description}
          />
          <DetailRow label={labels.fields.code} value={membershipType.code} />
          <DetailRow
            label={labels.fields.federation}
            value={
              membershipType.federationNode?.name ||
              membershipType.federationNodeId
            }
          />
          <DetailRow
            label={labels.fields.validity}
            value={membershipType.validity?.label}
          />
          <DetailRow
            label={labels.fields.currency}
            value={membershipType.currency?.name}
          />
          <DetailRow
            label={labels.fields.joiningFee}
            value={formatMembershipFee(
              membershipType.joiningFee,
              membershipType.currency,
            )}
          />
          <DetailRow
            label={labels.fields.renewalFee}
            value={renewalDisplay}
          />
          <DetailRow
            label={labels.fields.members}
            value={(
              Number(membershipType._count?.users) || 0
            ).toLocaleString()}
          />
          <DetailRow
            label={labels.fields.formsLinked}
            value={(
              Number(membershipType._count?.forms) || 0
            ).toLocaleString()}
          />
          <div className="membership-type-details-modal__row">
            <Typography
              component="dt"
              variant="body2"
              className="membership-type-details-modal__label">
              {labels.fields.status}
            </Typography>
            <dd className="membership-type-details-modal__value">
              <Chip
                size="small"
                label={
                  isActive ? statusLabels.active : statusLabels.inactive
                }
                color={isActive ? "success" : "default"}
                variant="outlined"
              />
            </dd>
          </div>
        </dl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{closeLabel}</Button>
        {onEdit ? (
          <Button
            variant="contained"
            onClick={() => {
              onEdit(membershipType)
              onClose()
            }}>
            {editLabel}
          </Button>
        ) : null}
      </DialogActions>
    </Dialog>
  )
}
