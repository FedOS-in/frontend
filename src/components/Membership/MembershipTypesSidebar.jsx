"use client"

import * as React from "react"
import { Box, Button } from "@mui/material"
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined"
import MembershipTypesSummaryChart from "./MembershipTypesSummaryChart"
import MembershipTypesQuickHelp from "./MembershipTypesQuickHelp"
import "./MembershipTypesSidebar.css"

export default function MembershipTypesSidebar({ labels }) {
  return (
    <Box className="membership-types-sidebar">
      <Box className="membership-types-sidebar__card">
        <MembershipTypesSummaryChart labels={labels.chart} />
      </Box>

      <Box className="membership-types-sidebar__card">
        <MembershipTypesQuickHelp labels={labels.help} />
      </Box>

      <Button
        className="membership-types-sidebar__settings"
        variant="outlined"
        fullWidth
        startIcon={<SettingsOutlinedIcon />}
        disabled>
        {labels.settingsButton}
      </Button>
    </Box>
  )
}
