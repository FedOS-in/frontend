"use client"

import * as React from "react"
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Drawer,
  Stack,
  TextField,
  Typography,
  Snackbar,
} from "@mui/material"

const DRAWER_WIDTH = 460
const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

export default function AddChapterDrawer({
  open,
  onClose,
  mode = "create",
  chapterToEdit = null,
  onSaved,
}) {
  const [chapterNameOverride, setChapterNameOverride] = React.useState(undefined)
  const [parentNodeOverride, setParentNodeOverride] = React.useState(undefined)
  const [parentOptions, setParentOptions] = React.useState([])
  const [loadingParents, setLoadingParents] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")
  const [successMessage, setSuccessMessage] = React.useState("")

  const resetForm = () => {
    setChapterNameOverride(undefined)
    setParentNodeOverride(undefined)
    setErrorMessage("")
  }

  const isEditMode = mode === "edit" && Boolean(chapterToEdit?.id)
  const initialChapterName = isEditMode ? chapterToEdit?.name || "" : ""
  const chapterName =
    chapterNameOverride !== undefined ? chapterNameOverride : initialChapterName
  const initialParentNode = React.useMemo(() => {
    if (!isEditMode) return null
    return (
      parentOptions.find((node) => node.id === chapterToEdit?.parentId) || null
    )
  }, [isEditMode, parentOptions, chapterToEdit?.parentId])
  const parentNode =
    parentNodeOverride !== undefined ? parentNodeOverride : initialParentNode

  React.useEffect(() => {
    if (!open) {
      return
    }

    const controller = new AbortController()

    async function loadParentNodes() {
      setLoadingParents(true)
      setErrorMessage("")

      try {
        const response = await fetch(`${backendUrl}/api/federation-nodes`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error("Unable to load parent federation nodes")
        }

        const nodes = await response.json()
        setParentOptions(Array.isArray(nodes) ? nodes : [])
      } catch (error) {
        if (error.name !== "AbortError") {
          setErrorMessage(
            error.message || "Unable to load parent federation nodes",
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingParents(false)
        }
      }
    }

    loadParentNodes()

    return () => {
      controller.abort()
    }
  }, [open])

  const handleClose = () => {
    if (submitting) return
    resetForm()
    onClose()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!chapterName.trim()) {
      setErrorMessage("Chapter name is required")
      return
    }

    setSubmitting(true)
    setErrorMessage("")

    try {
      const endpoint = isEditMode
        ? `${backendUrl}/api/federation-nodes/${chapterToEdit.id}`
        : `${backendUrl}/api/federation-nodes`
      const method = isEditMode ? "PUT" : "POST"

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: chapterName.trim(),
          parentId: parentNode?.id ?? null,
          isActive: chapterToEdit?.isActive ?? true,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.message || "Failed to create chapter")
      }

      const savedNode = await response.json().catch(() => null)

      resetForm()
      setSuccessMessage(
        isEditMode ? "Chapter updated successfully" : "Chapter created successfully",
      )
      onSaved?.(savedNode)
      onClose()
    } catch (error) {
      setErrorMessage(error.message || "Failed to create chapter")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Drawer anchor="right" open={open} onClose={handleClose}>
        <Box sx={{ width: { xs: 320, sm: DRAWER_WIDTH }, p: 3 }}>
          <Stack spacing={3} component="form" onSubmit={handleSubmit}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                {isEditMode ? "Edit Chapter" : "Add Chapter"}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {isEditMode
                  ? "Update chapter details and parent hierarchy."
                  : "Create a chapter under an existing federation node."}
              </Typography>
            </Box>

            <TextField
              label="Chapter Name"
              value={chapterName}
              onChange={(event) => setChapterNameOverride(event.target.value)}
              placeholder="Enter chapter name"
              fullWidth
              required
            />

            <Autocomplete
              options={parentOptions ?? []}
              value={parentNode}
              onChange={(_, value) => setParentNodeOverride(value ?? null)}
              loading={loadingParents}
              getOptionLabel={(option) => option?.name || ""}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              renderOption={(props, option) => (
                <Box component="li" {...props} key={option.id}>
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>
                      {option.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}>
                      {option.parent?.name
                        ? `Parent: ${option.parent.name}`
                        : "Top-level node"}
                    </Typography>
                  </Box>
                </Box>
              )}
              filterOptions={(options, state) =>
                options.filter((option) =>
                  option.name
                    .toLowerCase()
                    .includes(state.inputValue.toLowerCase()),
                )
              }
              noOptionsText={
                loadingParents
                  ? "Loading nodes..."
                  : parentOptions.length === 0
                    ? "No federation nodes available"
                    : "No matching federation node found"
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Parent Federation Node"
                  placeholder="Search federation node by name"
                  helperText="Select the parent federation node for this chapter"
                />
              )}
            />

            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
              <Button
                variant="outlined"
                onClick={handleClose}
                disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                    ? "Update Chapter"
                    : "Create Chapter"}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Drawer>

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  )
}
