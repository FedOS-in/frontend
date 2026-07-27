"use client"

import * as React from "react"
import { Box, Button, Checkbox, Typography } from "@mui/material"
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined"
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined"
import "./RenewalsSelectionBar.css"

export default function RenewalsSelectionBar({
  selectedCount,
  allSelected,
  onToggleAll,
  onGeneratePaymentLink,
  onRecordOfflinePayment,
  labels,
}) {
  return (
    <Box className="renewals-selection-bar">
      <Box className="renewals-selection-bar__left">
        <Checkbox
          size="small"
          checked={allSelected}
          indeterminate={selectedCount > 0 && !allSelected}
          onChange={onToggleAll}
        />
        <Typography className="renewals-selection-bar__count">
          {labels.selected.replace("{count}", String(selectedCount))}
        </Typography>
      </Box>

      <Box className="renewals-selection-bar__actions">
        <Button
          size="small"
          variant="outlined"
          startIcon={<LinkOutlinedIcon />}
          disabled={selectedCount === 0}
          onClick={onGeneratePaymentLink}>
          {labels.generatePaymentLink}
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<PaymentsOutlinedIcon />}
          disabled={selectedCount === 0}
          onClick={onRecordOfflinePayment}>
          {labels.recordOfflinePayment}
        </Button>
      </Box>
    </Box>
  )
}
