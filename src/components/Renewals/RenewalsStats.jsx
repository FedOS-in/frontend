"use client"

import * as React from "react"
import { Box, Typography } from "@mui/material"
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined"
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined"
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined"
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined"
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined"
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined"
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined"
import { formatRenewalFee } from "./useRenewalsData"
import "./RenewalsStats.css"

export default function RenewalsStats({ stats, labels, currencyPrefix }) {
  if (!stats) return null

  const cards = [
    {
      id: "due_30",
      title: labels.due30Title,
      count: stats.due_30?.count || 0,
      amount: stats.due_30?.amount || 0,
      Icon: EventAvailableOutlinedIcon,
    },
    {
      id: "due_15",
      title: labels.due15Title,
      count: stats.due_15?.count || 0,
      amount: stats.due_15?.amount || 0,
      Icon: ScheduleOutlinedIcon,
    },
    {
      id: "due_today",
      title: labels.dueTodayTitle,
      count: stats.due_today?.count || 0,
      amount: stats.due_today?.amount || 0,
      Icon: TodayOutlinedIcon,
    },
    {
      id: "overdue",
      title: labels.overdueTitle,
      count: stats.overdue?.count || 0,
      amount: stats.overdue?.amount || 0,
      Icon: WarningAmberOutlinedIcon,
    },
    {
      id: "expired",
      title: labels.expiredTitle,
      count: stats.expired?.count || 0,
      amount: stats.expired?.amount || 0,
      Icon: BlockOutlinedIcon,
    },
    {
      id: "renewed",
      title: labels.renewedTitle,
      count: stats.renewedThisMonth?.count || 0,
      amount: stats.renewedThisMonth?.amount || 0,
      Icon: CheckCircleOutlinedIcon,
    },
    {
      id: "collections",
      title: labels.collectionsTitle,
      count: stats.collectionsThisMonth?.count || 0,
      amount: stats.collectionsThisMonth?.amount || 0,
      Icon: PaymentsOutlinedIcon,
      isCollections: true,
    },
  ]

  return (
    <Box className="renewals-stats">
      {cards.map((card) => {
        const Icon = card.Icon
        const subtitle = card.isCollections
          ? labels.paymentsLabel.replace("{count}", String(card.count))
          : labels.membersLabel.replace("{count}", String(card.count))

        return (
          <Box
            key={card.id}
            className={`renewals-stats__card renewals-stats__card--${card.id}`}>
            <Box className="renewals-stats__icon">
              <Icon fontSize="small" />
            </Box>
            <Box className="renewals-stats__content">
              <Typography className="renewals-stats__title">
                {card.title}
              </Typography>
              <Typography className="renewals-stats__value">
                {card.isCollections
                  ? formatRenewalFee(card.amount, currencyPrefix)
                  : card.count}
              </Typography>
              <Typography className="renewals-stats__subtitle">
                {card.isCollections
                  ? subtitle
                  : `${subtitle} · ${formatRenewalFee(card.amount, currencyPrefix)}`}
              </Typography>
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}
