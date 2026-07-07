"use client"
import * as React from "react"
import { Box } from "@mui/material"
import Header from "../Header/Header"
import Footer from "../Footer/Footer"

export default function OrganizationLayout({ children }) {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}>
      <Box
        sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header />
        <Box sx={{ flex: 1, p: 4 }}>{children}</Box>
        <Footer />
      </Box>
    </Box>
  )
}
