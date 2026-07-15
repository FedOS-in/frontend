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
import { useOrganizationText } from "@/i18n/organizationLanguageStore"

export default function SidebarMenu({
  activeMenu,
  onNavigate,
  sidebarCollapsed,
  orgOpen,
  setOrgOpen,
}) {
  const text = useOrganizationText()

  const menuItems = [
    { id: "dashboard", icon: DashboardIcon, label: text.sidebar.menu.dashboard },
    { id: "applications", icon: AppsIcon, label: text.sidebar.menu.applications },
    { id: "members", icon: PeopleIcon, label: text.sidebar.menu.members },
    { id: "renewals", icon: RenewIcon, label: text.sidebar.menu.renewals },
    { id: "payments", icon: PayIcon, label: text.sidebar.menu.payments },
    { id: "receipts", icon: ReceiptIcon, label: text.sidebar.menu.receipts },
    { id: "settings", icon: SettingsIcon, label: text.sidebar.menu.settings },
  ]

  return (
    <div className="sidebar__menu">
      {menuItems.map((item) => (
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
