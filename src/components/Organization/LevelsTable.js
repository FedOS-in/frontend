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
  IconButton,
  Box,
  OutlinedInput,
  Button,
  Tooltip,
  InfoIcon,
} from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import SearchIcon from "@mui/icons-material/Search"
import SwapIcon from "@mui/icons-material/SwapVert"
import InfoIconCustom from "@mui/icons-material/Info"

const LEVELS_DATA = [
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
]

export default function LevelsTable() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [federationNodes, setFederationNodes] = React.useState([])
  const [isLoadingNodes, setIsLoadingNodes] = React.useState(true)

  React.useEffect(() => {
    const controller = new AbortController()

    async function loadFederationNodes() {
      try {
        const response = await fetch(
          "http://localhost:3001/api/federation-nodes",
          {
            signal: controller.signal,
          },
        )

        if (!response.ok) {
          throw new Error("Failed to load federation nodes")
        }

        const nodes = await response.json()

        setFederationNodes(
          nodes.map((node, index) => ({
            order: index + 1,
            name: node.name,
            desc: node.parent?.name
              ? `Child of ${node.parent.name}`
              : "Loaded from federation nodes API",
            tag: node.parentId ? "Child Node" : "Root Node",
            chapters: String(node.children?.length ?? 0),
            status: node.isActive ? "Active" : "Inactive",
          })),
        )
      } catch (error) {
        if (error.name !== "AbortError") {
          setFederationNodes([])
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingNodes(false)
        }
      }
    }

    loadFederationNodes()

    return () => {
      controller.abort()
    }
  }, [])

  const combinedData = [...federationNodes, ...LEVELS_DATA].map(
    (row, index) => ({
      ...row,
      displayOrder: index + 1,
    }),
  )

  const filteredData = combinedData.filter((row) =>
    row.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <>
      {/* Search & Toolbars */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{ mb: 3, justifyContent: "space-between", alignItems: "center" }}>
        <OutlinedInput
          placeholder="Search level name..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startAdornment={
            <SearchIcon
              sx={{ color: "text.secondary", mr: 1, fontSize: "1.2rem" }}
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
              {isLoadingNodes ? "..." : filteredData.length}
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

      {/* Table */}
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
            {filteredData.map((row) => (
              <TableRow key={`${row.name}-${row.displayOrder}`} hover>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  {row.displayOrder}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
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
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        bgcolor: "success.main",
                        borderRadius: "50%",
                      }}
                    />
                    <Typography sx={{ fontSize: "0.85rem", fontWeight: 500 }}>
                      {row.status}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} sx={{ justifyContent: "center" }}>
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

      {/* Footer Info */}
      <Stack
        direction="row"
        sx={{ mt: 3, px: 1, justifyContent: "space-between", alignItems: "center" }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <InfoIconCustom
            sx={{ color: "text.secondary", fontSize: "1.1rem" }}
          />
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
            Click on the number in the Chapters column to view organizations at
            that level in the structure.
          </Typography>
        </Stack>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", fontWeight: 500, fontSize: "0.8rem" }}>
          Showing 1 to {filteredData.length} of {combinedData.length} levels
        </Typography>
      </Stack>
    </>
  )
}
