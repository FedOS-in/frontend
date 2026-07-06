"use client"
import * as React from "react"
import DashboardIcon from "@mui/icons-material/Dashboard"
import AppsIcon from "@mui/icons-material/Apps"
import PeopleIcon from "@mui/icons-material/People"
import RenewIcon from "@mui/icons-material/Autorenew"
import PayIcon from "@mui/icons-material/Payment"
import ReceiptIcon from "@mui/icons-material/Receipt"
import SettingsIcon from "@mui/icons-material/Settings"
import SidebarMenuItem from "./SidebarMenuItem"
import SidebarOrganizationMenu from "./SidebarOrganizationMenu"

const MENU_ITEMS = [
  { id: "dashboard", icon: DashboardIcon, label: "Dashboard" },
  { id: "applications", icon: AppsIcon, label: "Applications" },
  { id: "members", icon: PeopleIcon, label: "Members" },
  { id: "renewals", icon: RenewIcon, label: "Renewals" },
  { id: "payments", icon: PayIcon, label: "Payments" },
  { id: "receipts", icon: ReceiptIcon, label: "Receipts" },
  { id: "settings", icon: SettingsIcon, label: "Settings" },
]

export default function SidebarMenu({
  activeMenu,
  onNavigate,
  sidebarCollapsed,
  orgOpen,
  setOrgOpen,
}) {
  return (
    <div className="sidebar__menu">
      {MENU_ITEMS.map((item) => (
        <SidebarMenuItem
          key={item.id}
          icon={item.icon}
          label={item.label}
          isActive={activeMenu === item.id}
          onClick={() => onNavigate(item.id)}
          sidebarCollapsed={sidebarCollapsed}
        />
      ))}

      <SidebarOrganizationMenu
        activeMenu={activeMenu}
        onNavigate={onNavigate}
        sidebarCollapsed={sidebarCollapsed}
        orgOpen={orgOpen}
        setOrgOpen={setOrgOpen}
      />
    </div>
  )
}
