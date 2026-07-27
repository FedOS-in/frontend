"use client"

import * as React from "react"
import {
  Button,
  Menu,
  MenuItem,
  Snackbar,
} from "@mui/material"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import ShareLinkModal from "@/components/Organization/ShareLinkModal"
import RenewalsOfflinePaymentModal from "./RenewalsOfflinePaymentModal"
import { buildRenewalPaymentUrl } from "./renewalsApi"

export default function useRenewalsActions(pageText, closeLabel, refresh) {
  const [bulkAnchor, setBulkAnchor] = React.useState(null)
  const [shareUrl, setShareUrl] = React.useState("")
  const [offlineMembers, setOfflineMembers] = React.useState([])
  const [snackbar, setSnackbar] = React.useState({ open: false, message: "" })

  const openShare = React.useCallback((memberOrMembers) => {
    const first = Array.isArray(memberOrMembers)
      ? memberOrMembers[0]
      : memberOrMembers
    if (!first) return
    setShareUrl(buildRenewalPaymentUrl(first.id))
  }, [])

  const openOffline = React.useCallback((memberOrMembers) => {
    const list = Array.isArray(memberOrMembers)
      ? memberOrMembers
      : memberOrMembers
        ? [memberOrMembers]
        : []
    setOfflineMembers(list)
  }, [])

  const renderBulkActions = (selectedRows) => (
    <>
      <Button
        variant="contained"
        endIcon={<KeyboardArrowDownIcon />}
        onClick={(event) => setBulkAnchor(event.currentTarget)}>
        {pageText.actions.bulkActions}
      </Button>
      <Menu
        anchorEl={bulkAnchor}
        open={Boolean(bulkAnchor)}
        onClose={() => setBulkAnchor(null)}>
        <MenuItem
          disabled={selectedRows.length === 0}
          onClick={() => {
            openShare(selectedRows)
            setBulkAnchor(null)
          }}>
          {pageText.actions.generatePaymentLink}
        </MenuItem>
        <MenuItem
          disabled={selectedRows.length === 0}
          onClick={() => {
            openOffline(selectedRows)
            setBulkAnchor(null)
          }}>
          {pageText.actions.recordOfflinePayment}
        </MenuItem>
      </Menu>
    </>
  )

  const renderModals = () => (
    <>
      <ShareLinkModal
        open={Boolean(shareUrl)}
        onClose={() => setShareUrl("")}
        url={shareUrl}
        title={pageText.share.title}
        urlLabel={pageText.share.urlLabel}
        whatsappLabel={pageText.share.whatsapp}
        emailLabel={pageText.share.email}
        copyLabel={pageText.share.copy}
        closeLabel={closeLabel}
        emailSubject={pageText.share.emailSubject}
        emailBody={pageText.share.emailBody.replace("{url}", shareUrl)}
        onCopySuccess={() =>
          setSnackbar({ open: true, message: pageText.share.copied })
        }
        onCopyError={() =>
          setSnackbar({ open: true, message: pageText.share.copyFailed })
        }
      />
      <RenewalsOfflinePaymentModal
        open={offlineMembers.length > 0}
        members={offlineMembers}
        onClose={() => setOfflineMembers([])}
        onSuccess={(count) => {
          refresh()
          setSnackbar({
            open: true,
            message:
              count > 1
                ? pageText.offlineModal.bulkSuccess.replace(
                    "{count}",
                    String(count),
                  )
                : pageText.offlineModal.success,
          })
        }}
        labels={pageText.offlineModal}
        currencyPrefix={pageText.currencyPrefix}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        message={snackbar.message}
      />
    </>
  )

  return { openShare, openOffline, renderBulkActions, renderModals }
}
