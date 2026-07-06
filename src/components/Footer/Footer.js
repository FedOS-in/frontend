"use client"
import * as React from "react"
import { Box, Typography, Stack, Link } from "@mui/material"

export default function Footer() {
  return (
    <Box
      sx={{
        height: 48,
        bgcolor: "#FFFFFF",
        borderTop: "1px solid #DFE1E6",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        flexShrink: 0,
      }}>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        &copy; 2026 FedOS. All rights reserved.
      </Typography>
      <Stack direction="row" spacing={3}>
        <Link
          href="#"
          variant="caption"
          color="text.secondary"
          underline="hover">
          Privacy Policy
        </Link>
        <Link
          href="#"
          variant="caption"
          color="text.secondary"
          underline="hover">
          Terms of Service
        </Link>
      </Stack>
    </Box>
  )
}
