"use client"
import * as React from "react"
import { Avatar } from "@mui/material"
import { useOrganizationText } from "@/i18n/organizationLanguageStore"

export default function SidebarUserCard() {
  const text = useOrganizationText()

  return (
    <div className="sidebar__user-card">
      <Avatar
        sx={{
          width: 32,
          height: 32,
          bgcolor: "#7C4DFF",
          fontSize: "0.85rem",
          fontWeight: 600,
        }}>
        KA
      </Avatar>
      <div className="sidebar__user-info">
        <span className="sidebar__user-name">{text.sidebar.userName}</span>
        <span className="sidebar__user-role">{text.sidebar.userRole}</span>
      </div>
    </div>
  )
}
