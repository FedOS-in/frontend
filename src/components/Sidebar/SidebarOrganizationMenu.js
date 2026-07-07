"use client"
import * as React from "react"
import { Collapse } from "@mui/material"
import OrgIcon from "@mui/icons-material/CorporateFare"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"

export default function SidebarOrganizationMenu({
  activeMenu,
  onNavigate,
  sidebarCollapsed,
  orgOpen,
  setOrgOpen,
}) {
  const isOrgActive =
    ["levels", "structure", "bearers"].includes(activeMenu) ||
    activeMenu === "create-position"

  const submenuItems = [
    { id: "structure", label: "Structure" },
    { id: "bearers", label: "Office Bearers" },
    { id: "levels", label: "Levels" },
  ]

  return (
    <div>
      <div
        onClick={() => setOrgOpen(!orgOpen)}
        className={`sidebar__menu-item ${isOrgActive ? "sidebar__menu-item--active" : ""}`}>
        <div className="sidebar__menu-content">
          <OrgIcon className="sidebar__menu-icon" />
          {!sidebarCollapsed && (
            <span className="sidebar__menu-text">Organization</span>
          )}
        </div>
        {!sidebarCollapsed &&
          (orgOpen ? (
            <ExpandLess sx={{ fontSize: "1.1rem" }} />
          ) : (
            <ExpandMore sx={{ fontSize: "1.1rem" }} />
          ))}
      </div>

      <Collapse in={orgOpen && !sidebarCollapsed} timeout="auto" unmountOnExit>
        <div className="sidebar__submenu">
          {submenuItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`sidebar__submenu-item ${
                activeMenu === item.id ||
                (item.id === "bearers" && activeMenu === "create-position")
                  ? "sidebar__submenu-item--active"
                  : ""
              }`}>
              {item.label}
            </div>
          ))}
        </div>
      </Collapse>
    </div>
  )
}
