"use client"

import * as React from "react"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import WhatsAppIcon from "@mui/icons-material/WhatsApp"
import EmailIcon from "@mui/icons-material/Email"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material"
import "./ShareLinkModal.css"

export default function ShareLinkModal({
  open,
  onClose,
  url = "",
  title,
  urlLabel,
  whatsappLabel,
  emailLabel,
  copyLabel,
  closeLabel,
  emailSubject = "",
  emailBody = "",
  onCopySuccess,
  onCopyError,
}) {
  const whatsappShareUrl = React.useMemo(() => {
    if (!url) return ""
    return `https://wa.me/?text=${encodeURIComponent(url)}`
  }, [url])

  const emailShareUrl = React.useMemo(() => {
    if (!url) return ""
    const subject = encodeURIComponent(emailSubject || title || "")
    const body = encodeURIComponent(emailBody || url)
    return `mailto:?subject=${subject}&body=${body}`
  }, [url, emailSubject, emailBody, title])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      onCopySuccess?.()
    } catch {
      onCopyError?.()
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="share-link-modal__title">
        <span>{title}</span>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            label={urlLabel}
            value={url}
            fullWidth
            size="small"
            slotProps={{ input: { readOnly: true } }}
          />
          <Stack
            className="share-link-modal__actions"
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}>
            <Button
              className="share-link-modal__whatsapp"
              component="a"
              href={whatsappShareUrl || undefined}
              target="_blank"
              rel="noreferrer"
              fullWidth
              variant="contained"
              disabled={!whatsappShareUrl}>
              <WhatsAppIcon className="share-link-modal__whatsapp-icon" />
              {whatsappLabel}
            </Button>
            <Button
              className="share-link-modal__email"
              component="a"
              href={emailShareUrl || undefined}
              fullWidth
              variant="outlined"
              disabled={!emailShareUrl}
              startIcon={<EmailIcon />}>
              {emailLabel}
            </Button>
            <Button
              type="button"
              fullWidth
              variant="text"
              onClick={handleCopy}
              disabled={!url}
              startIcon={<ContentCopyIcon />}>
              {copyLabel}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{closeLabel}</Button>
      </DialogActions>
    </Dialog>
  )
}
