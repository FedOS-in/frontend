"use client"
import * as React from "react"
import {
  Box,
  Typography,
  Select,
  MenuItem,
  IconButton,
  Badge,
  Divider,
  Avatar,
} from "@mui/material"
import OrgIcon from "@mui/icons-material/CorporateFare"
import HelpIcon from "@mui/icons-material/HelpOutlineOutlined"
import BellIcon from "@mui/icons-material/Notifications"

export default function Header() {
  return (
    <Box
      sx={{
        height: 64,
        bgcolor: "#FFFFFF",
        borderBottom: "1px solid #DFE1E6",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        flexShrink: 0,
      }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}>
        <IconButton sx={{ p: 0.5, bgcolor: "#F4F5F7", borderRadius: "6px" }}>
          <OrgIcon sx={{ color: "#5E6C84", fontSize: "1.3rem" }} />
        </IconButton>
        <Select
          value="ima"
          variant="standard"
          disableUnderline
          sx={{
            fontWeight: 600,
            color: "#091E42",
            fontSize: "0.95rem",
            "& .MuiSelect-select": { py: 0.5, pr: 3 },
          }}>
          <MenuItem value="ima">Indian Medical Association</MenuItem>
          <MenuItem value="state">State Medical Council</MenuItem>
        </Select>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2.5,
        }}>
        <IconButton size="small" sx={{ color: "#5E6C84" }}>
          <HelpIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" sx={{ color: "#5E6C84" }}>
          <Badge
            badgeContent={3}
            color="error"
            sx={{
              "& .MuiBadge-badge": {
                fontSize: "0.65rem",
                height: 16,
                minWidth: 16,
              },
            }}>
            <BellIcon fontSize="small" />
          </Badge>
        </IconButton>
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          sx={{ height: 20, my: "auto" }}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            cursor: "pointer",
          }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: "#5E6C84",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}>
            KA
          </Avatar>
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: "#091E42", fontSize: "0.8rem" }}>
              Kavin Arul
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#5E6C84", display: "block", fontSize: "0.7rem" }}>
              Secretary
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
