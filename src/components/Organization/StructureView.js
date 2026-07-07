"use client"

import React from "react"
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  OutlinedInput,
  Typography,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import OrgIcon from "@mui/icons-material/CorporateFare"
import EditIcon from "@mui/icons-material/Edit"
import PeopleIcon from "@mui/icons-material/People"
import SwapIcon from "@mui/icons-material/SwapVert"
import CloseIcon from "@mui/icons-material/Close"
import DeleteIcon from "@mui/icons-material/Delete"
import MoreIcon from "@mui/icons-material/MoreVert"
import AddChapterDrawer from "@/components/Organization/AddChapterDrawer"

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

function buildHierarchyRows(nodes) {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]))
  const childrenByParent = new Map()

  nodes.forEach((node) => {
    if (!node.parentId || !nodeMap.has(node.parentId)) return
    const siblings = childrenByParent.get(node.parentId) || []
    siblings.push(node)
    childrenByParent.set(node.parentId, siblings)
  })

  const roots = nodes
    .filter((node) => !node.parentId || !nodeMap.has(node.parentId))
    .sort((a, b) => a.name.localeCompare(b.name))

  const rows = []
  const visited = new Set()

  const visit = (node, depth) => {
    if (visited.has(node.id)) return
    visited.add(node.id)
    rows.push({ node, depth })

    const children = (childrenByParent.get(node.id) || []).sort((a, b) =>
      a.name.localeCompare(b.name),
    )

    children.forEach((child) => visit(child, depth + 1))
  }

  roots.forEach((root) => visit(root, 0))

  nodes.forEach((node) => {
    if (!visited.has(node.id)) {
      visit(node, 0)
    }
  })

  return rows
}

function staticMembers(depth, index) {
  const base = 1248
  const value = Math.max(120, base - depth * 180 - index * 27)
  return `${value.toLocaleString()} members`
}

export default function StructureView() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [nodes, setNodes] = React.useState([])
  const [loadingNodes, setLoadingNodes] = React.useState(true)
  const [errorMessage, setErrorMessage] = React.useState("")
  const [selectedNodeId, setSelectedNodeId] = React.useState(null)
  const [editDrawerOpen, setEditDrawerOpen] = React.useState(false)
  const [refreshCounter, setRefreshCounter] = React.useState(0)

  React.useEffect(() => {
    const controller = new AbortController()

    async function loadNodes() {
      setLoadingNodes(true)
      setErrorMessage("")

      try {
        const response = await fetch(`${backendUrl}/api/federation-nodes`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error("Unable to load federation nodes")
        }

        const data = await response.json()
        setNodes(Array.isArray(data) ? data : [])
      } catch (error) {
        if (error.name !== "AbortError") {
          setErrorMessage(error.message || "Unable to load federation nodes")
          setNodes([])
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingNodes(false)
        }
      }
    }

    loadNodes()

    return () => controller.abort()
  }, [refreshCounter])

  const hierarchyRows = React.useMemo(() => buildHierarchyRows(nodes), [nodes])

  const filteredRows = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return hierarchyRows
    return hierarchyRows.filter(({ node }) =>
      node.name.toLowerCase().includes(query),
    )
  }, [hierarchyRows, searchQuery])

  const effectiveSelectedNodeId = React.useMemo(() => {
    if (!filteredRows.length) {
      return null
    }

    const exists = filteredRows.some(({ node }) => node.id === selectedNodeId)
    return exists ? selectedNodeId : filteredRows[0].node.id
  }, [filteredRows, selectedNodeId])

  const selectedRow = React.useMemo(
    () =>
      hierarchyRows.find(({ node }) => node.id === effectiveSelectedNodeId) ||
      null,
    [hierarchyRows, effectiveSelectedNodeId],
  )

  const selectedNode = selectedRow?.node || null
  const selectedDepth = selectedRow?.depth ?? 0
  const selectedMembers = staticMembers(selectedDepth, 0)
  const selectedChildrenCount = selectedNode?.children?.length ?? 0
  const selectedParentName = selectedNode?.parent?.name || "-"

  return (
    <Box
      sx={{
        display: "grid",
        gap: 3,
        gridTemplateColumns: { xs: "1fr", md: "5fr 7fr" },
      }}>
      <Box>
        <Card sx={{ height: "100%", bgcolor: "#FFFFFF" }}>
          <CardContent sx={{ p: 2 }}>
            <OutlinedInput
              placeholder="Search chapter or level..."
              fullWidth
              size="small"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              startAdornment={
                <SearchIcon
                  sx={{ color: "text.secondary", mr: 0.5, fontSize: "1.1rem" }}
                />
              }
              sx={{ mb: 3 }}
            />

            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            {loadingNodes ? (
              <Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
                <CircularProgress size={28} />
              </Box>
            ) : null}

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {!loadingNodes && filteredRows.length === 0 ? (
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", py: 1 }}>
                  No federation nodes found.
                </Typography>
              ) : null}

              {filteredRows.map(({ node, depth }, idx) => {
                const isActive = node.id === effectiveSelectedNodeId
                return (
                  <Box
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    sx={{
                      pl: 1 + depth * 3,
                      borderLeft: isActive
                        ? "2px solid #0052CC"
                        : "2px solid #DFE1E6",
                      py: 0.8,
                      borderRadius: "0 4px 4px 0",
                      bgcolor: isActive ? "#DEEBFF" : "transparent",
                      cursor: "pointer",
                    }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <OrgIcon
                        sx={{
                          color: isActive ? "#0052CC" : "#5E6C84",
                          fontSize: "1.1rem",
                        }}
                      />
                      <Typography
                        sx={{
                          fontWeight: isActive ? 700 : 600,
                          fontSize: "0.875rem",
                          color: isActive ? "#0052CC" : "text.primary",
                        }}>
                        {node.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: isActive ? "#0052CC" : "text.secondary",
                          ml: "auto",
                        }}>
                        {staticMembers(depth, idx)}
                      </Typography>
                    </Box>
                  </Box>
                )
              })}
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box>
        <Card sx={{ bgcolor: "#FFFFFF", p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 3,
            }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {selectedNode?.name || "No node selected"}
                  </Typography>
                  <Chip
                    label={
                      selectedNode?.isActive === false ? "Inactive" : "Active"
                    }
                    size="small"
                    color={
                      selectedNode?.isActive === false ? "default" : "success"
                    }
                    sx={{ fontSize: "0.7rem", height: 18 }}
                  />
                </Box>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Level: {selectedDepth + 1} &bull; Parent: {selectedParentName}
                </Typography>
              </Box>
            </Box>
            <IconButton size="small">
              <MoreIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "grid",
              gap: 2,
              mb: 4,
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                sm: "repeat(4, minmax(0, 1fr))",
              },
            }}>
            {[
              {
                title: "Members",
                val: selectedMembers,
                link: "View members →",
                color: "#0052CC",
              },
              {
                title: "Office Bearers",
                val: "32",
                link: "View all →",
                color: "#0052CC",
              },
              {
                title: "Sub-organizations",
                val: `${selectedChildrenCount}`,
                link: "View all →",
                color: "#006644",
              },
              {
                title: "Collected This FY",
                val: "₹12,45,600",
                link: "View payments →",
                color: "#FF8B00",
              },
            ].map((item) => (
              <Box
                key={item.title}
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
                  }}>
                  {item.link}
                </Typography>
              </Box>
            ))}
          </Box>

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

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {[
                { pos: "President", name: "Kavin Arul", tag: "Active" },
                { pos: "Secretary", name: "Yazhini Devi", tag: "Active" },
                { pos: "Treasurer", name: "Pranav Mani", tag: "Active" },
              ].map((leader) => (
                <Box
                  key={leader.pos}
                  sx={{
                    p: 1.5,
                    border: "1px solid #DFE1E6",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                  </Box>
                  <Chip
                    label={leader.tag}
                    size="small"
                    color="success"
                    variant="outlined"
                    sx={{ fontSize: "0.65rem", height: 18 }}
                  />
                </Box>
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              flexWrap: "wrap",
            }}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setEditDrawerOpen(true)}
              disabled={!selectedNode}
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
          </Box>
        </Card>
      </Box>

      <AddChapterDrawer
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        mode="edit"
        chapterToEdit={selectedNode}
        onSaved={() => setRefreshCounter((prev) => prev + 1)}
      />
    </Box>
  )
}
