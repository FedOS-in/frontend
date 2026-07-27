"use client"

import * as React from "react"
import { Box, Tab, Tabs } from "@mui/material"
import "./RenewalsTabs.css"

const TAB_KEYS = [
  "all",
  "due_30",
  "due_15",
  "due_today",
  "overdue",
  "expired",
]

export default function RenewalsTabs({
  bucket,
  onBucketChange,
  tabCounts,
  labels,
}) {
  return (
    <Box className="renewals-tabs">
      <Tabs
        value={bucket}
        onChange={(_event, value) => onBucketChange(value)}
        variant="scrollable"
        scrollButtons="auto">
        {TAB_KEYS.map((key) => (
          <Tab
            key={key}
            value={key}
            label={`${labels[key] || key} ${tabCounts?.[key] ?? 0}`}
          />
        ))}
      </Tabs>
    </Box>
  )
}
