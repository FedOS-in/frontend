"use client"

import * as React from "react"
import { Box, Typography } from "@mui/material"
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined"
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined"
import PauseCircleOutlinedIcon from "@mui/icons-material/PauseCircleOutlined"
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined"
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined"
import "./MembershipTypesStats.css"

export default function MembershipTypesStats({ stats, labels }) {
  const cards = [
    {
      id: "total",
      value: stats.total,
      title: labels.totalTitle,
      subtitle: labels.totalSubtitle,
      Icon: CategoryOutlinedIcon,
    },
    {
      id: "active",
      value: stats.active,
      title: labels.activeTitle,
      subtitle: labels.activeSubtitle,
      Icon: CheckCircleOutlinedIcon,
    },
    {
      id: "inactive",
      value: stats.inactive,
      title: labels.inactiveTitle,
      subtitle: labels.inactiveSubtitle,
      Icon: PauseCircleOutlinedIcon,
    },
    {
      id: "forms",
      value: stats.formsLinked,
      title: labels.formsTitle,
      subtitle: labels.formsSubtitle,
      Icon: DescriptionOutlinedIcon,
    },
    {
      id: "members",
      value: stats.totalMembers.toLocaleString(),
      title: labels.membersTitle,
      subtitle: labels.membersSubtitle,
      Icon: PeopleOutlinedIcon,
    },
  ]

  return (
    <Box className="membership-types-stats">
      {cards.map((card) => {
        const Icon = card.Icon
        return (
          <Box
            key={card.id}
            className={`membership-types-stats__card membership-types-stats__card--${card.id}`}>
            <Box className="membership-types-stats__icon">
              <Icon fontSize="small" />
            </Box>
            <Box className="membership-types-stats__content">
              <Typography className="membership-types-stats__title">
                {card.title}
              </Typography>
              <Typography className="membership-types-stats__value">
                {card.value}
              </Typography>
              <Typography className="membership-types-stats__subtitle">
                {card.subtitle}
              </Typography>
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}
