"use client"
import * as React from "react"
import { Box } from "@mui/material"
import SidebarHeader from "./SidebarHeader"
import SidebarMenu from "./SidebarMenu"
import SidebarFooter from "./SidebarFooter"
import "./Sidebar.css"

export default function Sidebar({
  activeMenu,
  onNavigate,
  sidebarCollapsed,
  setSidebarCollapsed,
  orgOpen,
  setOrgOpen,
}) {
  return (
    <Box
      className={`sidebar ${sidebarCollapsed ? "sidebar--collapsed" : ""}`}
      sx={{ width: sidebarCollapsed ? 70 : 240 }}>
      <SidebarHeader sidebarCollapsed={sidebarCollapsed} />
      <SidebarMenu
        activeMenu={activeMenu}
        onNavigate={onNavigate}
        sidebarCollapsed={sidebarCollapsed}
        orgOpen={orgOpen}
        setOrgOpen={setOrgOpen}
      />
      <SidebarFooter
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />
    </Box>
  )
}
