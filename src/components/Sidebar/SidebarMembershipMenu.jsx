"use client"
import * as React from "react"
import { Collapse } from "@mui/material"
import CardMembershipIcon from "@mui/icons-material/CardMembership"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import { useOrganizationText } from "@/i18n/organizationLanguageStore"

export default function SidebarMembershipMenu({
  activeMenu,
  onNavigate,
  sidebarCollapsed,
  membershipOpen,
  setMembershipOpen,
}) {
  const text = useOrganizationText()
  const isMembershipActive = ["membershipTypes"].includes(activeMenu)

  const submenuItems = [
    { id: "membershipTypes", label: text.sidebar.membershipTypes },
  ]

  return (
    <div>
      <div
        onClick={() => setMembershipOpen(!membershipOpen)}
        className={`sidebar__menu-item ${isMembershipActive ? "sidebar__menu-item--active" : ""}`}>
        <div className="sidebar__menu-content">
          <CardMembershipIcon className="sidebar__menu-icon" />
          {!sidebarCollapsed && (
            <span className="sidebar__menu-text">{text.sidebar.membership}</span>
          )}
        </div>
        {!sidebarCollapsed &&
          (membershipOpen ? (
            <ExpandLess sx={{ fontSize: "1.1rem" }} />
          ) : (
            <ExpandMore sx={{ fontSize: "1.1rem" }} />
          ))}
      </div>

      <Collapse
        in={membershipOpen && !sidebarCollapsed}
        timeout="auto"
        unmountOnExit>
        <div className="sidebar__submenu">
          {submenuItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`sidebar__submenu-item ${
                activeMenu === item.id ? "sidebar__submenu-item--active" : ""
              }`}>
              {item.label}
            </div>
          ))}
        </div>
      </Collapse>
    </div>
  )
}
