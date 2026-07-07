"use client"

import * as React from "react"
import { Box } from "@mui/material"
import { usePathname, useRouter } from "next/navigation"
import Sidebar from "@/components/Sidebar/Sidebar"

const ROUTES_BY_MENU = {
  dashboard: "/",
  structure: "/organization/structure",
  levels: "/organization/levels",
  bearers: "/organization/officebearers",
}

function getActiveMenu(pathname) {
  if (!pathname) return "dashboard"
  if (pathname === "/") return "dashboard"
  if (pathname.startsWith("/organization/structure")) return "structure"
  if (pathname.startsWith("/organization/levels")) return "levels"
  if (pathname.startsWith("/organization/officebearers")) return "bearers"
  return "dashboard"
}

export default function AppShell({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [orgOpen, setOrgOpen] = React.useState(true)

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
      <Sidebar
        activeMenu={activeMenu}
        onNavigate={handleNavigate}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        orgOpen={orgOpen}
        setOrgOpen={setOrgOpen}
      />

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
