"use client"

import * as React from "react"
import { Box, Typography } from "@mui/material"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutlined"
import LinkIcon from "@mui/icons-material/Link"
import TuneIcon from "@mui/icons-material/Tune"
import "./MembershipTypesQuickHelp.css"

export default function MembershipTypesQuickHelp({ labels }) {
  const items = [
    {
      id: "create",
      icon: AddCircleOutlineIcon,
      title: labels.createTitle,
      text: labels.createText,
    },
    {
      id: "link",
      icon: LinkIcon,
      title: labels.linkTitle,
      text: labels.linkText,
    },
    {
      id: "manage",
      icon: TuneIcon,
      title: labels.manageTitle,
      text: labels.manageText,
    },
  ]

  return (
    <Box className="membership-types-help">
      <Typography className="membership-types-help__title">
        {labels.title}
      </Typography>
      <Box className="membership-types-help__list">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <Box key={item.id} className="membership-types-help__item">
              <Box className="membership-types-help__icon">
                <Icon fontSize="small" />
              </Box>
              <Box>
                <Typography className="membership-types-help__item-title">
                  {item.title}
                </Typography>
                <Typography className="membership-types-help__item-text">
                  {item.text}
                </Typography>
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
