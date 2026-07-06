"use client"
import * as React from "react"
import { Box, Typography, Button, Stack, Breadcrumbs } from "@mui/material"
import ChevronIcon from "@mui/icons-material/ChevronRight"
import AddIcon from "@mui/icons-material/Add"
import Link from "next/link"

export default function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  onBreadcrumbClick,
}) {
  return (
    <>
      {breadcrumbs && (
        <Breadcrumbs
          separator={<ChevronIcon sx={{ fontSize: "1rem" }} />}
          sx={{ mb: 2 }}>
          {breadcrumbs.map((crumb, idx) =>
            crumb.href ? (
              <Typography
                key={idx}
                onClick={() => onBreadcrumbClick?.(crumb.id)}
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  color: "inherit",
                  "&:hover": { textDecoration: "underline" },
                }}>
                {crumb.label}
              </Typography>
            ) : (
              <Typography
                key={idx}
                color="text.primary"
                sx={{ fontSize: "0.8rem", fontWeight: 500 }}>
                {crumb.label}
              </Typography>
            ),
          )}
        </Breadcrumbs>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}>
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, mb: 0.5, fontFamily: "var(--font-outfit)" }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {actions && (
          <Stack direction="row" spacing={2}>
            {actions.map((action, idx) => (
              <Button
                key={idx}
                variant={action.variant || "outlined"}
                startIcon={action.icon}
                onClick={action.onClick}
                sx={{
                  bgcolor:
                    action.variant === "contained" ? "#0052CC" : undefined,
                  borderColor: "#DFE1E6",
                  color: action.variant === "contained" ? undefined : "#091E42",
                }}>
                {action.label}
              </Button>
            ))}
          </Stack>
        )}
      </Box>
    </>
  )
}
