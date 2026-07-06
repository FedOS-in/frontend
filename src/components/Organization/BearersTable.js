"use client"
import * as React from "react"
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Stack,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Box,
  OutlinedInput,
  Select,
  MenuItem,
  Button,
  Card,
  Grid,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import ViewIcon from "@mui/icons-material/Visibility"
import MoreIcon from "@mui/icons-material/MoreVert"
import AddIcon from "@mui/icons-material/Add"
import CalendarIcon from "@mui/icons-material/CalendarToday"

const BEARERS_DATA = [
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
]

export default function BearersTable() {
  const [selectedTab, setSelectedTab] = React.useState("all")

  return (
    <>
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
                  sx={{ color: "text.secondary", mr: 0.5, fontSize: "1.1rem" }}
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

      {/* Table */}
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
            {BEARERS_DATA.map((row, idx) => (
              <TableRow key={idx} hover>
                <TableCell>
                  <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
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
                    <Stack direction="row" spacing={1.5} alignItems="center">
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
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: idx % 2 === 0 ? "#DEEBFF" : "#E3FCEF",
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
                        <Stack direction="row" spacing={1} alignItems="center">
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
                  <Typography sx={{ fontWeight: 500, fontSize: "0.9rem" }}>
                    {row.org}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
                    {row.level}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{ fontSize: "0.85rem", color: "text.secondary" }}>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <CalendarIcon sx={{ fontSize: "0.9rem" }} />
                    <span>{row.term}</span>
                  </Stack>
                </TableCell>
                <TableCell
                  sx={{ fontSize: "0.85rem", color: "text.secondary" }}>
                  <Stack direction="row" spacing={0.5} alignItems="center">
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
                        row.remColor === "success" ? "#E3FCEF" : "#FFF0B3",
                      color: row.remColor === "success" ? "#006644" : "#FF8B00",
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
                      bgcolor: row.status === "Filled" ? "#E3FCEF" : "#FFEAD5",
                      color: row.status === "Filled" ? "#006644" : "#FF8B00",
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
    </>
  )
}
