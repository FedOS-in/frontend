"use client"

import * as React from "react"
import { Box } from "@mui/material"
import { usePathname, useRouter } from "next/navigation"
import Sidebar from "@/components/Sidebar/Sidebar"
import { hydrateOrganizationLocale } from "@/i18n/organizationLanguageStore"

const ROUTES_BY_MENU = {
  dashboard: "/",
  members: "/members",
  structure: "/organization/structure",
  levels: "/organization/levels",
  bearers: "/organization/officebearers",
  users: "/organization/users",
  userForms: "/organization/userForm",
  membershipTypes: "/membership/membershipTypes",
}

function getActiveMenu(pathname) {
  if (!pathname) return "dashboard"
  if (pathname === "/") return "dashboard"
  if (pathname.startsWith("/members")) return "members"
  if (pathname.startsWith("/organization/structure")) return "structure"
  if (pathname.startsWith("/organization/levels")) return "levels"
  if (pathname.startsWith("/organization/officebearers")) return "bearers"
  if (pathname.startsWith("/organization/users")) return "users"
  if (pathname.startsWith("/organization/userForm")) return "userForms"
  if (pathname.startsWith("/membership/membershipTypes")) {
    return "membershipTypes"
  }
  return "dashboard"
}

export default function AppShell({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [orgOpen, setOrgOpen] = React.useState(true)
  const [membershipOpen, setMembershipOpen] = React.useState(true)

  React.useEffect(() => {
    hydrateOrganizationLocale()
  }, [])

  const shouldHideSidebar = React.useMemo(
    () =>
      (pathname?.startsWith("/user/create/") ||
        pathname?.startsWith("/payment/")) ??
      false,
    [pathname],
  )

  const activeMenu = React.useMemo(() => getActiveMenu(pathname), [pathname])

  const handleNavigate = (menu) => {
    const route = ROUTES_BY_MENU[menu]
    if (route) {
      router.push(route)
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        height: "100dvh",
        overflow: "hidden",
        bgcolor: "background.default",
      }}>
      {shouldHideSidebar ? null : (
        <Sidebar
          activeMenu={activeMenu}
          onNavigate={handleNavigate}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          orgOpen={orgOpen}
          setOrgOpen={setOrgOpen}
          membershipOpen={membershipOpen}
          setMembershipOpen={setMembershipOpen}
        />
      )}

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          height: "100dvh",
          overflowY: "auto",
          overflowX: "hidden",
        }}>
        {children}
      </Box>
    </Box>
  )
}
