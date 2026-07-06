"use client"
import React from "react"
import {
  Grid,
  Card,
  CardContent,
  OutlinedInput,
  Stack,
  Box,
  Typography,
  Chip,
  IconButton,
  Avatar,
  Divider,
  Button,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import OrgIcon from "@mui/icons-material/CorporateFare"
import EditIcon from "@mui/icons-material/Edit"
import PeopleIcon from "@mui/icons-material/People"
import SwapIcon from "@mui/icons-material/SwapVert"
import CloseIcon from "@mui/icons-material/Close"
import DeleteIcon from "@mui/icons-material/Delete"
import MoreIcon from "@mui/icons-material/MoreVert"

export default function StructureView() {
  return (
    <Grid container spacing={3}>
      {/* Left Side: Tree View List */}
      <Grid item xs={12} md={5}>
        <Card sx={{ height: "100%", bgcolor: "#FFFFFF" }}>
          <CardContent sx={{ p: 2 }}>
            <OutlinedInput
              placeholder="Search chapter or level..."
              fullWidth
              size="small"
              startAdornment={
                <SearchIcon
                  sx={{ color: "text.secondary", mr: 0.5, fontSize: "1.1rem" }}
                />
              }
              sx={{ mb: 3 }}
            />

            {/* Fake hierarchy tree */}
            <Stack spacing={1}>
              {/* Level 1: National */}
              <Box sx={{ pl: 1, borderLeft: "2px solid #DFE1E6", py: 0.5 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <OrgIcon sx={{ color: "#5E6C84", fontSize: "1.1rem" }} />
                  <Typography sx={{ fontWeight: 700, fontSize: "0.9rem" }}>
                    National Federation
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", ml: "auto" }}>
                    1,248 members
                  </Typography>
                </Stack>
              </Box>

              {/* Level 2: State (Active Selected) */}
              <Box
                sx={{
                  pl: 4,
                  borderLeft: "2px solid #0052CC",
                  py: 0.5,
                  bgcolor: "#DEEBFF",
                  borderRadius: "0 4px 4px 0",
                }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <OrgIcon sx={{ color: "#0052CC", fontSize: "1.1rem" }} />
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      color: "#0052CC",
                    }}>
                    Tamil Nadu Association
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "#0052CC", ml: "auto", fontWeight: 600 }}>
                    1,045 members
                  </Typography>
                </Stack>
              </Box>

              {/* Level 3: Districts under State */}
              {[
                "Chennai Chapter",
                "Coimbatore Chapter",
                "Madurai Chapter",
                "Trichy Chapter",
                "Salem Chapter",
                "Tirunelveli Chapter",
              ].map((dist, idx) => (
                <Box
                  key={idx}
                  sx={{ pl: 7, borderLeft: "1px dashed #DFE1E6", py: 0.5 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        bgcolor: "#C1C7D0",
                        borderRadius: "50%",
                      }}
                    />
                    <Typography
                      sx={{ fontSize: "0.85rem", color: "text.primary" }}>
                      {dist}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", ml: "auto" }}>
                      {320 - idx * 50} members
                    </Typography>
                  </Stack>
                </Box>
              ))}

              {/* Other States */}
              {[
                "Karnataka Association",
                "Kerala Association",
                "Maharashtra Association",
                "Gujarat Association",
              ].map((state, idx) => (
                <Box
                  key={idx}
                  sx={{ pl: 4, borderLeft: "2px solid #DFE1E6", py: 0.8 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <OrgIcon sx={{ color: "#5E6C84", fontSize: "1.1rem" }} />
                    <Typography sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                      {state}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", ml: "auto" }}>
                      {890 - idx * 120} members
                    </Typography>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Right Side: Chapter Details Panel */}
      <Grid item xs={12} md={7}>
        <Card sx={{ bgcolor: "#FFFFFF", p: 3 }}>
          {/* Header profile row */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 3,
            }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: "#DEEBFF",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                }}>
                <OrgIcon sx={{ color: "#0052CC", fontSize: "2rem" }} />
              </Box>
              <Box>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Tamil Nadu Association
                  </Typography>
                  <Chip
                    label="Active"
                    size="small"
                    color="success"
                    sx={{ fontSize: "0.7rem", height: 18 }}
                  />
                </Stack>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Level: State Association &bull; Parent: National Federation
                </Typography>
              </Box>
            </Stack>
            <IconButton size="small">
              <MoreIcon />
            </IconButton>
          </Box>

          {/* Stats Widget blocks */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {[
              {
                title: "Members",
                val: "1,045",
                link: "View members →",
                color: "#0052CC",
                bg: "#DEEBFF",
              },
              {
                title: "Office Bearers",
                val: "32",
                link: "View all →",
                color: "#0052CC",
                bg: "#DEEBFF",
              },
              {
                title: "Sub-organizations",
                val: "26",
                link: "View all →",
                color: "#006644",
                bg: "#E3FCEF",
              },
              {
                title: "Collected This FY",
                val: "₹12,45,600",
                link: "View payments →",
                color: "#FF8B00",
                bg: "#FFEAD5",
              },
            ].map((item, idx) => (
              <Grid item xs={6} sm={3} key={idx}>
                <Box
                  sx={{
                    p: 2,
                    border: "1px solid #DFE1E6",
                    borderRadius: "8px",
                    height: "100%",
                  }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 600,
                      display: "block",
                      mb: 0.5,
                    }}>
                    {item.title}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {item.val}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: item.color,
                      cursor: "pointer",
                      fontWeight: 600,
                      "&:hover": { textDecoration: "underline" },
                    }}>
                    {item.link}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Leadership Office Bearers Block */}
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Leadership (Office Bearers)
              </Typography>
              <Button variant="text" size="small" sx={{ color: "#0052CC" }}>
                View all →
              </Button>
            </Box>

            <Stack spacing={1.5}>
              {[
                { pos: "President", name: "Kavin Arul", tag: "Active" },
                { pos: "Secretary", name: "Yazhini Devi", tag: "Active" },
                { pos: "Treasurer", name: "Pranav Mani", tag: "Active" },
              ].map((leader, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 1.5,
                    border: "1px solid #DFE1E6",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "#0052CC",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                      }}>
                      {leader.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          fontWeight: 600,
                          display: "block",
                        }}>
                        {leader.pos}
                      </Typography>
                      <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                        {leader.name}
                      </Typography>
                    </Box>
                  </Stack>
                  <Chip
                    label={leader.tag}
                    size="small"
                    color="success"
                    variant="outlined"
                    sx={{ fontSize: "0.65rem", height: 18 }}
                  />
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Actions toolbar */}
          <Divider sx={{ my: 3 }} />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              sx={{ borderColor: "#DFE1E6", color: "#091E42" }}>
              Edit
            </Button>
            <Button
              variant="outlined"
              startIcon={<PeopleIcon />}
              sx={{ borderColor: "#DFE1E6", color: "#091E42" }}>
              Manage Office Bearers
            </Button>
            <Button
              variant="outlined"
              startIcon={<SwapIcon />}
              sx={{ borderColor: "#DFE1E6", color: "#091E42" }}>
              Move
            </Button>
            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              color="warning">
              Deactivate
            </Button>
            <Button variant="outlined" startIcon={<DeleteIcon />} color="error">
              Delete
            </Button>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  )
}
