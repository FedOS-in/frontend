"use client"

import * as React from "react"
import PriceChangeIcon from "@mui/icons-material/PriceChange"
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material"
import MembershipTypeFeeSplitSection from "./MembershipTypeFeeSplitSection"
import {
  createInitialSplitRow,
  recalculateAmountsFromPercents,
} from "../../utils/membershipFeeSplitUtils"
import "./AddMembershipTypeDrawer.css"

export default function MembershipTypeFeeFields({
  t,
  form,
  setForm,
  federationOptions,
}) {
  const handleFeeChange = (feeField, splitsField, showField, value) => {
    setForm((prev) => {
      const next = { ...prev, [feeField]: value }
      if (prev[showField] && prev[splitsField]?.length) {
        next[splitsField] = recalculateAmountsFromPercents(
          prev[splitsField],
          value,
        )
      }
      return next
    })
  }

  const toggleSplitSection = (showField, splitsField, feeField) => {
    setForm((prev) => {
      if (prev[showField]) {
        return { ...prev, [showField]: false, [splitsField]: [] }
      }
      if (!prev.federationNode?.id) return prev
      return {
        ...prev,
        [showField]: true,
        [splitsField]: [
          createInitialSplitRow(prev.federationNode.id, prev[feeField]),
        ],
      }
    })
  }

  return (
    <>
      <div className="add-membership-type-drawer__fee-row">
        <TextField
          label={t.joiningFee}
          type="number"
          value={form.joiningFee}
          onChange={(event) =>
            handleFeeChange(
              "joiningFee",
              "joiningSplits",
              "showJoiningSplits",
              event.target.value,
            )
          }
          className="add-membership-type-drawer__fee-field"
          required
          slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
        />
        <IconButton
          aria-label={t.splitJoiningAria}
          color={form.showJoiningSplits ? "primary" : "default"}
          onClick={() =>
            toggleSplitSection(
              "showJoiningSplits",
              "joiningSplits",
              "joiningFee",
            )
          }
          disabled={!form.federationNode?.id}>
          <PriceChangeIcon />
        </IconButton>
      </div>

      <div className="add-membership-type-drawer__fee-row">
        <TextField
          label={t.renewalFee}
          type="number"
          value={form.renewalFee}
          onChange={(event) =>
            handleFeeChange(
              "renewalFee",
              "renewalSplits",
              "showRenewalSplits",
              event.target.value,
            )
          }
          className="add-membership-type-drawer__fee-field"
          required
          slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
        />
        <IconButton
          aria-label={t.splitRenewalAria}
          color={form.showRenewalSplits ? "primary" : "default"}
          onClick={() =>
            toggleSplitSection(
              "showRenewalSplits",
              "renewalSplits",
              "renewalFee",
            )
          }
          disabled={!form.federationNode?.id}>
          <PriceChangeIcon />
        </IconButton>
      </div>

      <FormControl fullWidth required>
        <InputLabel id="membership-type-status-label">{t.status}</InputLabel>
        <Select
          labelId="membership-type-status-label"
          label={t.status}
          value={form.status}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, status: event.target.value }))
          }>
          <MenuItem value="1">{t.statusActive}</MenuItem>
          <MenuItem value="0">{t.statusInactive}</MenuItem>
        </Select>
      </FormControl>

      {form.showJoiningSplits ? (
        <MembershipTypeFeeSplitSection
          title={t.joiningSplitTitle}
          amountLabel={t.splitAmount}
          percentageLabel={t.splitPercentage}
          nodeLabel={t.splitNode}
          feeTotal={form.joiningFee}
          selectedNode={form.federationNode}
          federationOptions={federationOptions}
          rows={form.joiningSplits}
          onRowsChange={(joiningSplits) =>
            setForm((prev) => ({ ...prev, joiningSplits }))
          }
          onCloseSection={() =>
            setForm((prev) => ({
              ...prev,
              joiningSplits: [],
              showJoiningSplits: false,
            }))
          }
        />
      ) : null}

      {form.showRenewalSplits ? (
        <MembershipTypeFeeSplitSection
          title={t.renewalSplitTitle}
          amountLabel={t.splitAmount}
          percentageLabel={t.splitPercentage}
          nodeLabel={t.splitNode}
          feeTotal={form.renewalFee}
          selectedNode={form.federationNode}
          federationOptions={federationOptions}
          rows={form.renewalSplits}
          onRowsChange={(renewalSplits) =>
            setForm((prev) => ({ ...prev, renewalSplits }))
          }
          onCloseSection={() =>
            setForm((prev) => ({
              ...prev,
              renewalSplits: [],
              showRenewalSplits: false,
            }))
          }
        />
      ) : null}
    </>
  )
}
