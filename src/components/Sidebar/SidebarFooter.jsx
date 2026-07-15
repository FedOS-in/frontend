"use client"
import * as React from "react"
import { Avatar } from "@mui/material"
import CollapseIcon from "@mui/icons-material/MenuOpen"
import SidebarUserCard from "./SidebarUserCard"
import { useOrganizationText } from "@/i18n/organizationLanguageStore"

export default function SidebarFooter({
  sidebarCollapsed,
  setSidebarCollapsed,
}) {
  const text = useOrganizationText()
  return (
    <div className="sidebar__footer">
      {!sidebarCollapsed && <SidebarUserCard />}
      <div
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className={`sidebar__collapse-btn ${sidebarCollapsed ? "sidebar__collapse-btn--centered" : ""}`}>
        <CollapseIcon
          sx={{
            fontSize: "1.2rem",
            transform: sidebarCollapsed ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        />
        {!sidebarCollapsed && (
          <span className="sidebar__menu-text">{text.sidebar.collapse}</span>
        )}
      </div>
    </div>
  )
}
