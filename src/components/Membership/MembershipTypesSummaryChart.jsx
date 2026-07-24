"use client"

import * as React from "react"
import { Box, Typography } from "@mui/material"
import "./MembershipTypesSummaryChart.css"

const DUMMY_SEGMENTS = [
  { id: "individual", label: "Individual", count: 1240, percent: 47 },
  { id: "student", label: "Student", count: 486, percent: 18 },
  { id: "corporate", label: "Corporate", count: 312, percent: 12 },
  { id: "associate", label: "Associate", count: 211, percent: 8 },
  { id: "life", label: "Life", count: 256, percent: 10 },
  { id: "honorary", label: "Honorary", count: 137, percent: 5 },
]

export default function MembershipTypesSummaryChart({ labels }) {
  return (
    <Box className="membership-types-chart">
      <Typography className="membership-types-chart__title">
        {labels.summaryTitle}
      </Typography>

      <Box className="membership-types-chart__donut-wrap">
        <Box className="membership-types-chart__donut">
          <Box className="membership-types-chart__donut-hole">
            <Typography className="membership-types-chart__total-value">
              2,642
            </Typography>
            <Typography className="membership-types-chart__total-label">
              {labels.totalMembers}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box className="membership-types-chart__legend">
        {DUMMY_SEGMENTS.map((segment) => (
          <Box key={segment.id} className="membership-types-chart__legend-row">
            <Box className="membership-types-chart__legend-left">
              <span
                className={`membership-types-chart__swatch membership-types-chart__swatch--${segment.id}`}
              />
              <Typography className="membership-types-chart__legend-label">
                {segment.label}
              </Typography>
            </Box>
            <Typography className="membership-types-chart__legend-meta">
              {segment.count.toLocaleString()} · {segment.percent}%
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
