"use client"
import * as React from "react"
import { Typography } from "@mui/material"

export default function SidebarHeader({ sidebarCollapsed }) {
  return (
    <div className="sidebar__logo-container">
      <div className="sidebar__logo-icon">F</div>
      {!sidebarCollapsed && (
        <Typography
          variant="h6"
          className="sidebar__logo-text"
          sx={{ fontFamily: "var(--font-outfit)" }}>
          FedOS
        </Typography>
      )}
    </div>
  )
}
