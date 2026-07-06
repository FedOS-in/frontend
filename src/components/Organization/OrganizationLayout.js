"use client"
import * as React from "react"
import { Box } from "@mui/material"
import Sidebar from "../Sidebar/Sidebar"
import Header from "../Header/Header"
import Footer from "../Footer/Footer"

export default function OrganizationLayout({
  children,
  activeMenu,
  onNavigate,
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [orgOpen, setOrgOpen] = React.useState(true)

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}>
      <Sidebar
        activeMenu={activeMenu}
        onNavigate={onNavigate}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        orgOpen={orgOpen}
        setOrgOpen={setOrgOpen}
      />

      <Box
        sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header />
        <Box sx={{ flex: 1, overflowY: "auto", p: 4 }}>{children}</Box>
        <Footer />
      </Box>
    </Box>
  )
}
