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
  membershipOpen,
  setMembershipOpen,
}) {
  return (
    <Box
      className={`sidebar ${sidebarCollapsed ? "sidebar--collapsed" : ""}`}
      sx={{
        width: sidebarCollapsed ? 70 : 240,
        position: "sticky",
        top: 0,
        alignSelf: "flex-start",
        flexShrink: 0,
      }}>
      <SidebarHeader sidebarCollapsed={sidebarCollapsed} />
      <SidebarMenu
        activeMenu={activeMenu}
        onNavigate={onNavigate}
        sidebarCollapsed={sidebarCollapsed}
        orgOpen={orgOpen}
        setOrgOpen={setOrgOpen}
        membershipOpen={membershipOpen}
        setMembershipOpen={setMembershipOpen}
      />
      <SidebarFooter
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />
    </Box>
  )
}
