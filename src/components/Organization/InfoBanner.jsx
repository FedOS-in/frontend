"use client"
import * as React from "react"
import { Box, IconButton, Typography, Stack } from "@mui/material"
import InfoIcon from "@mui/icons-material/Info"
import CloseIcon from "@mui/icons-material/Close"

export default function InfoBanner({ title, subtitle, onClose }) {
  const [isOpen, setIsOpen] = React.useState(true)

  const handleClose = () => {
    setIsOpen(false)
    onClose?.()
  }

  if (!isOpen) return null

  return (
    <Box
      sx={{
        bgcolor: "info.light",
        border: "1px solid rgba(7, 71, 166, 0.12)",
        borderRadius: "8px",
        p: 2,
        mb: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
        <InfoIcon sx={{ color: "info.main" }} />
        <Box>
          <Typography
            variant="body2"
            sx={{ color: "info.main", fontWeight: 600 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="caption"
              sx={{ color: "info.main", display: "block" }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </Stack>
      <IconButton
        size="small"
        onClick={handleClose}
        sx={{ color: "info.main" }}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  )
}
