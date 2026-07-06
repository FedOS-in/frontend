"use client"
import * as React from "react"
import {
  Box,
  Typography,
  Button,
  IconButton,
  Badge,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  OutlinedInput,
  Chip,
  Switch,
  Select,
  MenuItem,
  Breadcrumbs,
  Link,
  Collapse,
  Avatar,
  Divider,
  Stack,
  Tooltip,
} from "@mui/material"
import DashboardIcon from "@mui/icons-material/Dashboard"
import AppsIcon from "@mui/icons-material/Apps"
import PeopleIcon from "@mui/icons-material/People"
import OrgIcon from "@mui/icons-material/CorporateFare"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import RenewIcon from "@mui/icons-material/Autorenew"
import PayIcon from "@mui/icons-material/Payment"
import ReceiptIcon from "@mui/icons-material/Receipt"
import SettingsIcon from "@mui/icons-material/Settings"
import HelpIcon from "@mui/icons-material/HelpOutlineOutlined"
import BellIcon from "@mui/icons-material/Notifications"
import AddIcon from "@mui/icons-material/Add"
import InfoIcon from "@mui/icons-material/Info"
import SearchIcon from "@mui/icons-material/Search"
import SwapIcon from "@mui/icons-material/SwapVert"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import ViewIcon from "@mui/icons-material/Visibility"
import MoreIcon from "@mui/icons-material/MoreVert"
import CalendarIcon from "@mui/icons-material/CalendarToday"
import CloseIcon from "@mui/icons-material/Close"
import ChevronIcon from "@mui/icons-material/ChevronRight"
import BackIcon from "@mui/icons-material/ArrowBack"
import ActiveIcon from "@mui/icons-material/CheckCircle"
import CollapseIcon from "@mui/icons-material/MenuOpen"

export default function Home() {
  // Navigation states
  const [activeMenu, setActiveMenu] = React.useState("levels") // 'levels', 'structure', 'bearers', 'create-position'
  const [orgOpen, setOrgOpen] = React.useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)

  // Filter and alert states
  const [infoBannerOpen, setInfoBannerOpen] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedTab, setSelectedTab] = React.useState("all")

  // Breadcrumb action
  const handleNavigate = (menu) => {
    setActiveMenu(menu)
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}>
      {/* 1. SIDEBAR */}
      <Box
        sx={{
          width: sidebarCollapsed ? 70 : 240,
          bgcolor: "palette.sidebar.background",
          backgroundColor: "#091E42", // Deep dark navy
          color: "#8993A4",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.2s ease-in-out",
          borderRight: "1px solid rgba(255, 255, 255, 0.08)",
          zIndex: 10,
          flexShrink: 0,
        }}>
        {/* Sidebar Header / Logo */}
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "6px",
              backgroundColor: "#0052CC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              color: "#FFFFFF",
              fontSize: "1.2rem",
              fontFamily: "var(--font-outfit)",
            }}>
            F
          </Box>
          {!sidebarCollapsed && (
            <Typography
              variant="h6"
              sx={{
                color: "#FFFFFF",
                fontWeight: 800,
                letterSpacing: "0.05em",
                fontFamily: "var(--font-outfit)",
              }}>
              FedOS
            </Typography>
          )}
        </Box>

        {/* Sidebar Menu Items */}
        <Box sx={{ flex: 1, py: 2, overflowY: "auto" }}>
          <Stack spacing={0.5}>
            {/* Dashboard */}
            <Box
              sx={{
                px: 2,
                py: 1.25,
                display: "flex",
                alignItems: "center",
                gap: 2,
                cursor: "pointer",
                "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
              }}>
              <DashboardIcon sx={{ fontSize: "1.25rem", color: "#8993A4" }} />
              {!sidebarCollapsed && (
                <Typography
                  variant="body2"
                  sx={{ color: "#8993A4", fontWeight: 500 }}>
                  Dashboard
                </Typography>
              )}
            </Box>

            {/* Applications */}
            <Box
              sx={{
                px: 2,
                py: 1.25,
                display: "flex",
                alignItems: "center",
                gap: 2,
                cursor: "pointer",
                "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
              }}>
              <AppsIcon sx={{ fontSize: "1.25rem", color: "#8993A4" }} />
              {!sidebarCollapsed && (
                <Typography
                  variant="body2"
                  sx={{ color: "#8993A4", fontWeight: 500 }}>
                  Applications
                </Typography>
              )}
            </Box>

            {/* Members */}
            <Box
              sx={{
                px: 2,
                py: 1.25,
                display: "flex",
                alignItems: "center",
                gap: 2,
                cursor: "pointer",
                "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
              }}>
              <PeopleIcon sx={{ fontSize: "1.25rem", color: "#8993A4" }} />
              {!sidebarCollapsed && (
                <Typography
                  variant="body2"
                  sx={{ color: "#8993A4", fontWeight: 500 }}>
                  Members
                </Typography>
              )}
            </Box>

            {/* Organization Dropdown */}
            <Box>
              <Box
                onClick={() => setOrgOpen(!orgOpen)}
                sx={{
                  px: 2,
                  py: 1.25,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  bgcolor:
                    activeMenu === "levels" ||
                    activeMenu === "structure" ||
                    activeMenu === "bearers"
                      ? "rgba(255,255,255,0.04)"
                      : "transparent",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
                }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <OrgIcon sx={{ fontSize: "1.25rem", color: "#8993A4" }} />
                  {!sidebarCollapsed && (
                    <Typography
                      variant="body2"
                      sx={{ color: "#8993A4", fontWeight: 500 }}>
                      Organization
                    </Typography>
                  )}
                </Stack>
                {!sidebarCollapsed &&
                  (orgOpen ? (
                    <ExpandLess sx={{ fontSize: "1.1rem" }} />
                  ) : (
                    <ExpandMore sx={{ fontSize: "1.1rem" }} />
                  ))}
              </Box>

              <Collapse
                in={orgOpen && !sidebarCollapsed}
                timeout="auto"
                unmountOnExit>
                <Stack
                  spacing={0.2}
                  sx={{
                    pl: 4.5,
                    py: 0.5,
                    borderLeft: "2px solid rgba(255,255,255,0.05)",
                    ml: 3,
                  }}>
                  <Typography
                    onClick={() => handleNavigate("structure")}
                    variant="body2"
                    sx={{
                      py: 1,
                      px: 2,
                      borderRadius: "4px",
                      cursor: "pointer",
                      color: activeMenu === "structure" ? "#FFFFFF" : "#8993A4",
                      bgcolor:
                        activeMenu === "structure" ? "#0052CC" : "transparent",
                      fontWeight: activeMenu === "structure" ? 600 : 500,
                      "&:hover": {
                        bgcolor:
                          activeMenu === "structure"
                            ? "#0052CC"
                            : "rgba(255,255,255,0.04)",
                      },
                    }}>
                    Structure
                  </Typography>
                  <Typography
                    onClick={() => handleNavigate("bearers")}
                    variant="body2"
                    sx={{
                      py: 1,
                      px: 2,
                      borderRadius: "4px",
                      cursor: "pointer",
                      color: activeMenu === "bearers" ? "#FFFFFF" : "#8993A4",
                      bgcolor:
                        activeMenu === "bearers" ? "#0052CC" : "transparent",
                      fontWeight: activeMenu === "bearers" ? 600 : 500,
                      "&:hover": {
                        bgcolor:
                          activeMenu === "bearers"
                            ? "#0052CC"
                            : "rgba(255,255,255,0.04)",
                      },
                    }}>
                    Office Bearers
                  </Typography>
                  <Typography
                    onClick={() => handleNavigate("levels")}
                    variant="body2"
                    sx={{
                      py: 1,
                      px: 2,
                      borderRadius: "4px",
                      cursor: "pointer",
                      color: activeMenu === "levels" ? "#FFFFFF" : "#8993A4",
                      bgcolor:
                        activeMenu === "levels" ? "#0052CC" : "transparent",
                      fontWeight: activeMenu === "levels" ? 600 : 500,
                      "&:hover": {
                        bgcolor:
                          activeMenu === "levels"
                            ? "#0052CC"
                            : "rgba(255,255,255,0.04)",
                      },
                    }}>
                    Levels
                  </Typography>
                </Stack>
              </Collapse>
            </Box>

            {/* Renewals */}
            <Box
              sx={{
                px: 2,
                py: 1.25,
                display: "flex",
                alignItems: "center",
                gap: 2,
                cursor: "pointer",
                "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
              }}>
              <RenewIcon sx={{ fontSize: "1.25rem", color: "#8993A4" }} />
              {!sidebarCollapsed && (
                <Typography
                  variant="body2"
                  sx={{ color: "#8993A4", fontWeight: 500 }}>
                  Renewals
                </Typography>
              )}
            </Box>

            {/* Payments */}
            <Box
              sx={{
                px: 2,
                py: 1.25,
                display: "flex",
                alignItems: "center",
                gap: 2,
                cursor: "pointer",
                "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
              }}>
              <PayIcon sx={{ fontSize: "1.25rem", color: "#8993A4" }} />
              {!sidebarCollapsed && (
                <Typography
                  variant="body2"
                  sx={{ color: "#8993A4", fontWeight: 500 }}>
                  Payments
                </Typography>
              )}
            </Box>

            {/* Receipts */}
            <Box
              sx={{
                px: 2,
                py: 1.25,
                display: "flex",
                alignItems: "center",
                gap: 2,
                cursor: "pointer",
                "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
              }}>
              <ReceiptIcon sx={{ fontSize: "1.25rem", color: "#8993A4" }} />
              {!sidebarCollapsed && (
                <Typography
                  variant="body2"
                  sx={{ color: "#8993A4", fontWeight: 500 }}>
                  Receipts
                </Typography>
              )}
            </Box>

            {/* Settings */}
            <Box
              sx={{
                px: 2,
                py: 1.25,
                display: "flex",
                alignItems: "center",
                gap: 2,
                cursor: "pointer",
                "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
              }}>
              <SettingsIcon sx={{ fontSize: "1.25rem", color: "#8993A4" }} />
              {!sidebarCollapsed && (
                <Typography
                  variant="body2"
                  sx={{ color: "#8993A4", fontWeight: 500 }}>
                  Settings
                </Typography>
              )}
            </Box>
          </Stack>
        </Box>

        {/* Sidebar Footer User Profile */}
        <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.06)", p: 1.5 }}>
          {!sidebarCollapsed && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1,
                borderRadius: "6px",
                bgcolor: "rgba(255,255,255,0.04)",
                mb: 1,
              }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "#7C4DFF",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}>
                KA
              </Avatar>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#FFFFFF",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                  }}>
                  Kavin Arul
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#8993A4",
                    display: "block",
                    fontSize: "0.7rem",
                  }}>
                  Secretary
                </Typography>
              </Box>
            </Box>
          )}
          <Box
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: sidebarCollapsed ? "center" : "flex-start",
              gap: 1.5,
              py: 1,
              px: sidebarCollapsed ? 0 : 2,
              cursor: "pointer",
              borderRadius: "6px",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.04)",
                color: "#FFFFFF",
              },
            }}>
            <CollapseIcon
              sx={{
                fontSize: "1.2rem",
                transform: sidebarCollapsed ? "rotate(180deg)" : "none",
                transition: "transform 0.2s",
              }}
            />
            {!sidebarCollapsed && (
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Collapse
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* 2. MAIN CONTAINER AREA */}
      <Box
        sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* HEADER / NAVBAR */}
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
          {/* Left Context Selector */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <IconButton
              sx={{ p: 0.5, bgcolor: "#F4F5F7", borderRadius: "6px" }}>
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
          </Stack>

          {/* Right Header Navigation Icons */}
          <Stack direction="row" spacing={2.5} alignItems="center">
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
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ cursor: "pointer" }}>
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
                  sx={{
                    fontWeight: 600,
                    color: "#091E42",
                    fontSize: "0.8rem",
                  }}>
                  Kavin Arul
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#5E6C84",
                    display: "block",
                    fontSize: "0.7rem",
                  }}>
                  Secretary
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Box>

        {/* 3. SCENE RENDERER */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 4 }}>
          {/* A. SCENE: LEVELS TABLE VIEW */}
          {activeMenu === "levels" && (
            <Box>
              {/* Breadcrumbs / Back navigation */}
              <Breadcrumbs
                separator={<ChevronIcon sx={{ fontSize: "1rem" }} />}
                sx={{ mb: 2 }}>
                <Link
                  underline="hover"
                  color="inherit"
                  href="#"
                  onClick={() => handleNavigate("structure")}
                  sx={{ fontSize: "0.8rem", fontWeight: 500 }}>
                  Organization
                </Link>
                <Typography
                  color="text.primary"
                  sx={{ fontSize: "0.8rem", fontWeight: 500 }}>
                  Levels
                </Typography>
              </Breadcrumbs>

              {/* Title & Actions */}
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
                    sx={{
                      fontWeight: 700,
                      mb: 0.5,
                      fontFamily: "var(--font-outfit)",
                    }}>
                    Organization Levels
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Define and manage the hierarchy levels used in your
                    organization structure.
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{ bgcolor: "#0052CC", borderRadius: "6px" }}>
                  Add Level
                </Button>
              </Box>

              {/* Alert Info Banner */}
              {infoBannerOpen && (
                <Box
                  sx={{
                    bgcolor: "info.light",
                    border: "1px solid rgba(7, 71, 166, 0.12)",
                    borderRadius: "8px",
                    p: 2,
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <InfoIcon sx={{ color: "info.main" }} />
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "info.main", fontWeight: 600 }}>
                        Organization levels are the building blocks of your
                        hierarchy.
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "info.main", display: "block" }}>
                        Example: Level 1 - National Federation, Level 2 - State
                        Association, Level 3 - District Association
                      </Typography>
                    </Box>
                  </Stack>
                  <IconButton
                    size="small"
                    onClick={() => setInfoBannerOpen(false)}
                    sx={{ color: "info.main" }}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}

              {/* Search & Toolbars */}
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                sx={{ mb: 3 }}
                justifyContent="space-between"
                alignItems="center">
                <OutlinedInput
                  placeholder="Search level name..."
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  startAdornment={
                    <SearchIcon
                      sx={{
                        color: "text.secondary",
                        mr: 1,
                        fontSize: "1.2rem",
                      }}
                    />
                  }
                  sx={{ width: { xs: "100%", md: 360 }, height: 40 }}
                />

                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ width: { xs: "100%", md: "auto" } }}>
                  <Box
                    sx={{
                      border: "1px solid #DFE1E6",
                      bgcolor: "#FFFFFF",
                      px: 2,
                      py: 0.5,
                      borderRadius: "8px",
                      minWidth: 100,
                    }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        display: "block",
                        fontSize: "0.65rem",
                        textTransform: "uppercase",
                        fontWeight: 600,
                      }}>
                      Total Levels
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, color: "#091E42", mt: -0.5 }}>
                      5
                    </Typography>
                  </Box>

                  <Tooltip title="Contact FedOS support." placement="top">
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<SwapIcon />}
                      sx={{
                        height: 40,
                        px: 2,
                        borderColor: "#DFE1E6",
                        color: "#091E42",
                      }}>
                      Reorder Levels
                    </Button>
                  </Tooltip>
                </Stack>
              </Stack>

              {/* Levels Data Table */}
              <TableContainer
                component={Paper}
                sx={{
                  borderRadius: "8px",
                  border: "1px solid #DFE1E6",
                  boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)",
                }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" style={{ width: 80 }}>
                        Order
                      </TableCell>
                      <TableCell style={{ width: 220 }}>Level Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell style={{ width: 150 }}>Chapters</TableCell>
                      <TableCell style={{ width: 120 }}>Status</TableCell>
                      <TableCell align="center" style={{ width: 120 }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      {
                        order: 1,
                        name: "National Federation",
                        desc: "Top level organization of the federation",
                        tag: "Top Level",
                        chapters: "1",
                        status: "Active",
                      },
                      {
                        order: 2,
                        name: "State Association",
                        desc: "State level association or chapter",
                        chapters: "28",
                        status: "Active",
                      },
                      {
                        order: 3,
                        name: "District Association",
                        desc: "District level association or chapter",
                        chapters: "342",
                        status: "Active",
                      },
                      {
                        order: 4,
                        name: "Local Association",
                        desc: "Local association or branch",
                        chapters: "1,126",
                        status: "Active",
                      },
                      {
                        order: 5,
                        name: "Chapter",
                        desc: "Individual chapter or unit",
                        chapters: "2,859",
                        status: "Active",
                      },
                    ].map((row) => (
                      <TableRow key={row.order} hover>
                        <TableCell align="center" sx={{ fontWeight: 600 }}>
                          {row.order}
                        </TableCell>
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center">
                            <Typography
                              sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                              {row.name}
                            </Typography>
                            {row.tag && (
                              <Chip
                                label={row.tag}
                                size="small"
                                sx={{
                                  bgcolor: "success.light",
                                  color: "success.main",
                                  fontSize: "0.65rem",
                                  fontWeight: 600,
                                  height: 18,
                                }}
                              />
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell
                          sx={{ fontSize: "0.85rem", color: "text.secondary" }}>
                          {row.desc}
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: "0.9rem",
                                color: "#0052CC",
                                cursor: "pointer",
                              }}>
                              {row.chapters}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "text.secondary",
                                fontSize: "0.7rem",
                                display: "block",
                                cursor: "pointer",
                                "&:hover": { textDecoration: "underline" },
                              }}>
                              View chapters
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center">
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                bgcolor: "success.main",
                                borderRadius: "50%",
                              }}
                            />
                            <Typography
                              sx={{ fontSize: "0.85rem", fontWeight: 500 }}>
                              {row.status}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="center">
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center">
                            <IconButton
                              size="small"
                              sx={{
                                border: "1px solid #DFE1E6",
                                borderRadius: "6px",
                                color: "#0052CC",
                              }}>
                              <EditIcon fontSize="inherit" />
                            </IconButton>
                            <IconButton
                              size="small"
                              sx={{
                                border: "1px solid #DFE1E6",
                                borderRadius: "6px",
                                color: "error.main",
                              }}>
                              <DeleteIcon fontSize="inherit" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Table Footer Helper & Pagination info */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: 3, px: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <InfoIcon
                    sx={{ color: "text.secondary", fontSize: "1.1rem" }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
                    Click on the number in the Chapters column to view
                    organizations at that level in the structure.
                  </Typography>
                </Stack>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 500,
                    fontSize: "0.8rem",
                  }}>
                  Showing 1 to 5 of 5 levels
                </Typography>
              </Stack>
            </Box>
          )}

          {/* B. SCENE: OFFICE BEARERS LIST VIEW */}
          {activeMenu === "bearers" && (
            <Box>
              {/* Breadcrumbs */}
              <Breadcrumbs
                separator={<ChevronIcon sx={{ fontSize: "1rem" }} />}
                sx={{ mb: 2 }}>
                <Link
                  underline="hover"
                  color="inherit"
                  href="#"
                  onClick={() => handleNavigate("structure")}
                  sx={{ fontSize: "0.8rem", fontWeight: 500 }}>
                  Organization
                </Link>
                <Typography
                  color="text.primary"
                  sx={{ fontSize: "0.8rem", fontWeight: 500 }}>
                  Office Bearers
                </Typography>
              </Breadcrumbs>

              {/* Title & Actions */}
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
                    sx={{
                      fontWeight: 700,
                      mb: 0.5,
                      fontFamily: "var(--font-outfit)",
                    }}>
                    Office Bearers
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Manage leadership positions and assignments across the
                    organization.
                  </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleNavigate("create-position")}
                    startIcon={<AddIcon />}
                    sx={{ borderColor: "#DFE1E6", color: "#091E42" }}>
                    Create Position
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<PeopleIcon />}
                    sx={{ bgcolor: "#0052CC" }}>
                    Assign Office Bearer
                  </Button>
                </Stack>
              </Box>

              {/* Filter Row */}
              <Card sx={{ mb: 3, p: 2, bgcolor: "#FFFFFF" }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6} md={2.4}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: "text.secondary",
                        display: "block",
                        mb: 0.5,
                      }}>
                      Search
                    </Typography>
                    <OutlinedInput
                      placeholder="Search by position, member or org..."
                      fullWidth
                      size="small"
                      startAdornment={
                        <SearchIcon
                          sx={{
                            color: "text.secondary",
                            mr: 0.5,
                            fontSize: "1.1rem",
                          }}
                        />
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={1.8}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: "text.secondary",
                        display: "block",
                        mb: 0.5,
                      }}>
                      Organization Level
                    </Typography>
                    <Select value="all" fullWidth size="small">
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="national">National</MenuItem>
                      <MenuItem value="state">State</MenuItem>
                    </Select>
                  </Grid>

                  <Grid item xs={12} sm={6} md={1.8}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: "text.secondary",
                        display: "block",
                        mb: 0.5,
                      }}>
                      Organization
                    </Typography>
                    <Select value="all" fullWidth size="small">
                      <MenuItem value="all">All</MenuItem>
                    </Select>
                  </Grid>

                  <Grid item xs={12} sm={6} md={1.8}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: "text.secondary",
                        display: "block",
                        mb: 0.5,
                      }}>
                      Position
                    </Typography>
                    <Select value="all" fullWidth size="small">
                      <MenuItem value="all">All</MenuItem>
                    </Select>
                  </Grid>

                  <Grid item xs={12} sm={6} md={1.8}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: "text.secondary",
                        display: "block",
                        mb: 0.5,
                      }}>
                      Assignment Status
                    </Typography>
                    <Select value="all" fullWidth size="small">
                      <MenuItem value="all">All</MenuItem>
                    </Select>
                  </Grid>

                  <Grid item xs={12} sm={6} md={1.4}>
                    <Button
                      variant="text"
                      sx={{ color: "text.secondary", mt: 2.2, height: 40 }}
                      size="small">
                      Clear Filters
                    </Button>
                  </Grid>
                </Grid>
              </Card>

              {/* Status Tabs */}
              <Stack
                direction="row"
                spacing={3}
                sx={{ borderBottom: "1px solid #DFE1E6", mb: 3 }}>
                {[
                  { id: "all", label: "All Assignments" },
                  { id: "filled", label: "Filled" },
                  { id: "vacant", label: "Vacant" },
                  { id: "expired", label: "Expired" },
                  { id: "upcoming", label: "Upcoming" },
                  { id: "historical", label: "Historical" },
                ].map((tab) => (
                  <Box
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    sx={{
                      pb: 1.5,
                      cursor: "pointer",
                      borderBottom:
                        selectedTab === tab.id ? "2px solid #0052CC" : "none",
                      color: selectedTab === tab.id ? "#0052CC" : "#5E6C84",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                    }}>
                    {tab.label}
                  </Box>
                ))}
              </Stack>

              {/* Bearers List Table */}
              <TableContainer
                component={Paper}
                sx={{ borderRadius: "8px", border: "1px solid #DFE1E6" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: 180 }}>Position</TableCell>
                      <TableCell>Member</TableCell>
                      <TableCell>Organization</TableCell>
                      <TableCell style={{ width: 140 }}>Term</TableCell>
                      <TableCell style={{ width: 140 }}>Term End</TableCell>
                      <TableCell style={{ width: 150 }}>Remaining</TableCell>
                      <TableCell style={{ width: 120 }}>Status</TableCell>
                      <TableCell align="center" style={{ width: 100 }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      {
                        pos: "President",
                        seats: "1 Position",
                        name: "Kavin Arul",
                        id: "M-1001",
                        org: "Tamil Nadu Association",
                        level: "State",
                        term: "01 Jan 2025",
                        end: "31 Dec 2028",
                        rem: "3 years 6 months",
                        remColor: "success",
                        status: "Filled",
                      },
                      {
                        pos: "Secretary",
                        seats: "1 Position",
                        name: "Yazhini Devi",
                        id: "M-1002",
                        org: "Tamil Nadu Association",
                        level: "State",
                        term: "01 Jan 2025",
                        end: "31 Dec 2028",
                        rem: "3 years 6 months",
                        remColor: "success",
                        status: "Filled",
                      },
                      {
                        pos: "Treasurer",
                        seats: "1 Position",
                        name: "Pranav Mani",
                        id: "M-1003",
                        org: "Chennai Chapter",
                        level: "District",
                        term: "01 Jan 2025",
                        end: "31 Dec 2027",
                        rem: "2 years 6 months",
                        remColor: "success",
                        status: "Filled",
                      },
                      {
                        pos: "Vice President",
                        seats: "Multiple",
                        name: "Harini Selvi",
                        id: "M-1004",
                        org: "Coimbatore Chapter",
                        level: "District",
                        term: "01 Jan 2025",
                        end: "31 Dec 2026",
                        rem: "1 year 6 months",
                        remColor: "warning",
                        status: "Filled",
                      },
                      {
                        pos: "Joint Secretary",
                        seats: "Multiple",
                        name: "Vacant",
                        id: "No member assigned",
                        org: "Madurai Chapter",
                        level: "District",
                        term: "01 Jan 2025",
                        end: "31 Dec 2026",
                        rem: "1 year 6 months",
                        remColor: "warning",
                        status: "Vacant",
                      },
                      {
                        pos: "Executive Member",
                        seats: "Multiple",
                        name: "Nila Arasi",
                        id: "M-1005",
                        org: "Salem Chapter",
                        level: "District",
                        term: "01 Jan 2025",
                        end: "31 Dec 2026",
                        rem: "1 year 6 months",
                        remColor: "warning",
                        status: "Filled",
                      },
                    ].map((row, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell>
                          <Typography
                            sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                            {row.pos}
                          </Typography>
                          <Chip
                            label={row.seats}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: "0.65rem",
                              height: 16,
                              borderColor: "#DFE1E6",
                              color: "text.secondary",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {row.status === "Vacant" ? (
                            <Stack
                              direction="row"
                              spacing={1.5}
                              alignItems="center">
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  bgcolor: "#F4F5F7",
                                  color: "#5E6C84",
                                }}>
                                ?
                              </Avatar>
                              <Box>
                                <Typography
                                  sx={{
                                    fontSize: "0.9rem",
                                    color: "text.secondary",
                                    fontStyle: "italic",
                                  }}>
                                  Vacant
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "text.secondary",
                                    display: "block",
                                    fontSize: "0.7rem",
                                  }}>
                                  {row.id}
                                </Typography>
                              </Box>
                            </Stack>
                          ) : (
                            <Stack
                              direction="row"
                              spacing={1.5}
                              alignItems="center">
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  bgcolor:
                                    idx % 2 === 0 ? "#DEEBFF" : "#E3FCEF",
                                  color: "#0747A6",
                                  fontSize: "0.8rem",
                                  fontWeight: 600,
                                }}>
                                {row.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </Avatar>
                              <Box>
                                <Typography
                                  sx={{
                                    fontWeight: 600,
                                    fontSize: "0.9rem",
                                    color: "#0052CC",
                                  }}>
                                  {row.name}
                                </Typography>
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center">
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: "text.secondary",
                                      fontSize: "0.75rem",
                                    }}>
                                    {row.id}
                                  </Typography>
                                  <Box
                                    sx={{
                                      width: 4,
                                      height: 4,
                                      bgcolor: "success.main",
                                      borderRadius: "50%",
                                    }}
                                  />
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: "success.main",
                                      fontSize: "0.7rem",
                                      fontWeight: 600,
                                    }}>
                                    Active Member
                                  </Typography>
                                </Stack>
                              </Box>
                            </Stack>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography
                            sx={{ fontWeight: 500, fontSize: "0.9rem" }}>
                            {row.org}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "text.secondary",
                              fontSize: "0.75rem",
                            }}>
                            {row.level}
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{ fontSize: "0.85rem", color: "text.secondary" }}>
                          <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center">
                            <CalendarIcon sx={{ fontSize: "0.9rem" }} />
                            <span>{row.term}</span>
                          </Stack>
                        </TableCell>
                        <TableCell
                          sx={{ fontSize: "0.85rem", color: "text.secondary" }}>
                          <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center">
                            <CalendarIcon sx={{ fontSize: "0.9rem" }} />
                            <span>{row.end}</span>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.rem}
                            size="small"
                            sx={{
                              bgcolor:
                                row.remColor === "success"
                                  ? "#E3FCEF"
                                  : "#FFF0B3",
                              color:
                                row.remColor === "success"
                                  ? "#006644"
                                  : "#FF8B00",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.status}
                            size="small"
                            sx={{
                              bgcolor:
                                row.status === "Filled" ? "#E3FCEF" : "#FFEAD5",
                              color:
                                row.status === "Filled" ? "#006644" : "#FF8B00",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          {row.status === "Vacant" ? (
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<AddIcon />}
                              sx={{ py: 0.25, px: 1, fontSize: "0.75rem" }}>
                              Assign
                            </Button>
                          ) : (
                            <Stack
                              direction="row"
                              spacing={0.5}
                              justifyContent="center">
                              <IconButton
                                size="small"
                                sx={{
                                  border: "1px solid #DFE1E6",
                                  borderRadius: "6px",
                                }}>
                                <ViewIcon fontSize="inherit" />
                              </IconButton>
                              <IconButton
                                size="small"
                                sx={{
                                  border: "1px solid #DFE1E6",
                                  borderRadius: "6px",
                                }}>
                                <MoreIcon fontSize="inherit" />
                              </IconButton>
                            </Stack>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* C. SCENE: STRUCTURE TREE & CARD DETAILS VIEW */}
          {activeMenu === "structure" && (
            <Box>
              {/* Breadcrumbs */}
              <Breadcrumbs
                separator={<ChevronIcon sx={{ fontSize: "1rem" }} />}
                sx={{ mb: 2 }}>
                <Link
                  underline="hover"
                  color="inherit"
                  href="#"
                  onClick={() => handleNavigate("structure")}
                  sx={{ fontSize: "0.8rem", fontWeight: 500 }}>
                  Organization
                </Link>
                <Typography
                  color="text.primary"
                  sx={{ fontSize: "0.8rem", fontWeight: 500 }}>
                  Structure
                </Typography>
              </Breadcrumbs>

              {/* Title & Actions */}
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
                    sx={{
                      fontWeight: 700,
                      mb: 0.5,
                      fontFamily: "var(--font-outfit)",
                    }}>
                    Organization Structure
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Manage hierarchy levels and chapters
                  </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<AddIcon />}
                    sx={{ borderColor: "#DFE1E6", color: "#091E42" }}>
                    Add Level
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ bgcolor: "#0052CC" }}>
                    Add Chapter
                  </Button>
                </Stack>
              </Box>

              {/* Content Split Grid */}
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
                            sx={{
                              color: "text.secondary",
                              mr: 0.5,
                              fontSize: "1.1rem",
                            }}
                          />
                        }
                        sx={{ mb: 3 }}
                      />

                      {/* Fake hierarchy tree */}
                      <Stack spacing={1}>
                        {/* Level 1: National */}
                        <Box
                          sx={{
                            pl: 1,
                            borderLeft: "2px solid #DFE1E6",
                            py: 0.5,
                          }}>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center">
                            <OrgIcon
                              sx={{ color: "#5E6C84", fontSize: "1.1rem" }}
                            />
                            <Typography
                              sx={{ fontWeight: 700, fontSize: "0.9rem" }}>
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
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center">
                            <OrgIcon
                              sx={{ color: "#0052CC", fontSize: "1.1rem" }}
                            />
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
                              sx={{
                                color: "#0052CC",
                                ml: "auto",
                                fontWeight: 600,
                              }}>
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
                            sx={{
                              pl: 7,
                              borderLeft: "1px dashed #DFE1E6",
                              py: 0.5,
                            }}>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center">
                              <Box
                                sx={{
                                  width: 6,
                                  height: 6,
                                  bgcolor: "#C1C7D0",
                                  borderRadius: "50%",
                                }}
                              />
                              <Typography
                                sx={{
                                  fontSize: "0.85rem",
                                  color: "text.primary",
                                }}>
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
                            sx={{
                              pl: 4,
                              borderLeft: "2px solid #DFE1E6",
                              py: 0.8,
                            }}>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center">
                              <OrgIcon
                                sx={{ color: "#5E6C84", fontSize: "1.1rem" }}
                              />
                              <Typography
                                sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
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
                          <OrgIcon
                            sx={{ color: "#0052CC", fontSize: "2rem" }}
                          />
                        </Box>
                        <Box>
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center">
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
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}>
                            Level: State Association &bull; Parent: National
                            Federation
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
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: 700, mb: 1 }}>
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
                        <Button
                          variant="text"
                          size="small"
                          sx={{ color: "#0052CC" }}>
                          View all →
                        </Button>
                      </Box>

                      <Stack spacing={1.5}>
                        {[
                          {
                            pos: "President",
                            name: "Kavin Arul",
                            tag: "Active",
                          },
                          {
                            pos: "Secretary",
                            name: "Yazhini Devi",
                            tag: "Active",
                          },
                          {
                            pos: "Treasurer",
                            name: "Pranav Mani",
                            tag: "Active",
                          },
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
                            <Stack
                              direction="row"
                              spacing={2}
                              alignItems="center">
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
                                <Typography
                                  sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
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
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="flex-end">
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
                      <Button
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        color="error">
                        Delete
                      </Button>
                    </Stack>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* D. SCENE: CREATE POSITION FORM VIEW */}
          {activeMenu === "create-position" && (
            <Box>
              {/* Back navigation Row */}
              <Box sx={{ mb: 3 }}>
                <Button
                  variant="text"
                  startIcon={<BackIcon />}
                  onClick={() => handleNavigate("bearers")}
                  sx={{ color: "text.secondary", mb: 1 }}>
                  Back to Positions
                </Button>
                <Breadcrumbs
                  separator={<ChevronIcon sx={{ fontSize: "1rem" }} />}>
                  <Link
                    underline="hover"
                    color="inherit"
                    href="#"
                    onClick={() => handleNavigate("structure")}
                    sx={{ fontSize: "0.8rem" }}>
                    Organization
                  </Link>
                  <Link
                    underline="hover"
                    color="inherit"
                    href="#"
                    onClick={() => handleNavigate("bearers")}
                    sx={{ fontSize: "0.8rem" }}>
                    Office Bearers
                  </Link>
                  <Typography
                    color="text.primary"
                    sx={{ fontSize: "0.8rem", fontWeight: 600 }}>
                    Create Position
                  </Typography>
                </Breadcrumbs>
              </Box>

              {/* Title Header */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}>
                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      mb: 0.5,
                      fontFamily: "var(--font-outfit)",
                    }}>
                    Create Position
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Define a new position that can be assigned to members in
                    your organization.
                  </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    onClick={() => handleNavigate("bearers")}
                    sx={{ borderColor: "#DFE1E6", color: "#091E42" }}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleNavigate("bearers")}
                    sx={{ bgcolor: "#0052CC" }}>
                    Save Position
                  </Button>
                </Stack>
              </Box>

              {/* Form Grid */}
              <Grid container spacing={3}>
                {/* Left Form: Basic Information */}
                <Grid item xs={12} md={7}>
                  <Card sx={{ bgcolor: "#FFFFFF", p: 3, mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>
                      Basic Information
                    </Typography>

                    <Stack spacing={3}>
                      {/* Name & Short Code row */}
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={8}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: "text.secondary",
                              mb: 0.5,
                            }}>
                            Position Name{" "}
                            <span style={{ color: "red" }}>*</span>
                          </Typography>
                          <OutlinedInput
                            placeholder="e.g. President, Secretary"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: "text.secondary",
                              mb: 0.5,
                            }}>
                            Short Code <span style={{ color: "red" }}>*</span>
                          </Typography>
                          <OutlinedInput
                            placeholder="e.g. PRES, SEC"
                            fullWidth
                          />
                        </Grid>
                      </Grid>

                      {/* Description */}
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: "text.secondary",
                            mb: 0.5,
                          }}>
                          Description
                        </Typography>
                        <OutlinedInput
                          placeholder="Enter a brief description of this position and its responsibilities"
                          fullWidth
                          multiline
                          rows={3}
                        />
                      </Box>

                      {/* Position Type */}
                      <Box
                        sx={{
                          border: "1px solid #DFE1E6",
                          p: 2,
                          borderRadius: "8px",
                        }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, mb: 1.5 }}>
                          Position Type *
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Box
                              sx={{
                                border: "1px solid #0052CC",
                                bgcolor: "#DEEBFF",
                                p: 1.5,
                                borderRadius: "6px",
                                cursor: "pointer",
                              }}>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 700, color: "#0052CC" }}>
                                Single Seat
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "text.secondary",
                                  fontSize: "0.7rem",
                                }}>
                                Only one member can hold this position at a time
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box
                              sx={{
                                border: "1px solid #DFE1E6",
                                p: 1.5,
                                borderRadius: "6px",
                                cursor: "pointer",
                              }}>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600 }}>
                                Multiple Seats
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "text.secondary",
                                  fontSize: "0.7rem",
                                }}>
                                More than one member can hold this position
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    </Stack>
                  </Card>

                  {/* Scope Card */}
                  <Card sx={{ bgcolor: "#FFFFFF", p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>
                      Position Scope
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: "text.secondary",
                            mb: 0.5,
                          }}>
                          Applies To Level(s){" "}
                          <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <Select value="state" fullWidth size="small">
                          <MenuItem value="state">State Association</MenuItem>
                          <MenuItem value="district">
                            District Association
                          </MenuItem>
                        </Select>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: "text.secondary",
                            mb: 0.5,
                          }}>
                          Applicable To *
                        </Typography>
                        <Select value="all" fullWidth size="small">
                          <MenuItem value="all">
                            All Organizations in Selected Level(s)
                          </MenuItem>
                        </Select>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>

                {/* Right Form: Term settings & configs */}
                <Grid item xs={12} md={5}>
                  {/* Tenure Card */}
                  <Card sx={{ bgcolor: "#FFFFFF", p: 3, mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>
                      Term & Tenure
                    </Typography>

                    <Stack spacing={2.5}>
                      <Grid container spacing={2}>
                        <Grid item xs={8}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: "text.secondary",
                              mb: 0.5,
                            }}>
                            Term Duration *
                          </Typography>
                          <OutlinedInput value="3" fullWidth />
                        </Grid>
                        <Grid item xs={4}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: "text.secondary",
                              mb: 0.5,
                            }}>
                            Unit
                          </Typography>
                          <Select
                            value="years"
                            fullWidth
                            size="small"
                            sx={{ mt: 0.5 }}>
                            <MenuItem value="years">Years</MenuItem>
                            <MenuItem value="months">Months</MenuItem>
                          </Select>
                        </Grid>
                      </Grid>

                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: "text.secondary",
                            mb: 0.5,
                          }}>
                          Maximum Consecutive Terms
                        </Typography>
                        <OutlinedInput value="2" fullWidth />
                      </Box>
                    </Stack>
                  </Card>

                  {/* Settings Toggle Options */}
                  <Card sx={{ bgcolor: "#FFFFFF", p: 3, mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>
                      Position Settings
                    </Typography>

                    <Stack spacing={2}>
                      {[
                        { label: "Is this position mandatory?", val: true },
                        {
                          label: "Allow re-appointment after a gap?",
                          val: true,
                        },
                        { label: "Require active membership?", val: true },
                        { label: "Visible in public directory?", val: false },
                      ].map((item, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}>
                          <Typography
                            sx={{ fontWeight: 500, fontSize: "0.9rem" }}>
                            {item.label}
                          </Typography>
                          <Switch checked={item.val} color="primary" />
                        </Box>
                      ))}
                    </Stack>
                  </Card>

                  {/* Order & Display Order */}
                  <Card sx={{ bgcolor: "#FFFFFF", p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                      Display & Order
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: "text.secondary",
                        mb: 0.5,
                      }}>
                      Display Order *
                    </Typography>
                    <OutlinedInput value="10" fullWidth />
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", mt: 1, display: "block" }}>
                      Lower numbers appear first in lists.
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>

        {/* FOOTER */}
        <Box
          sx={{
            height: 48,
            bgcolor: "#FFFFFF",
            borderTop: "1px solid #DFE1E6",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            flexShrink: 0,
          }}>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            &copy; 2026 FedOS. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={3}>
            <Link
              href="#"
              variant="caption"
              color="text.secondary"
              underline="hover">
              Privacy Policy
            </Link>
            <Link
              href="#"
              variant="caption"
              color="text.secondary"
              underline="hover">
              Terms of Service
            </Link>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
