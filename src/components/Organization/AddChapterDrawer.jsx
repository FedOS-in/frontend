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
import { useOrganizationText } from "@/i18n/organizationLanguageStore"

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
  const text = useOrganizationText()
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
          throw new Error(text.addChapterDrawer.validation.loadParentsFailed)
        }

        const nodes = await response.json()
        setParentOptions(Array.isArray(nodes) ? nodes : [])
      } catch (error) {
        if (error.name !== "AbortError") {
          setErrorMessage(
            error.message || text.addChapterDrawer.validation.loadParentsFailed,
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
      setErrorMessage(text.addChapterDrawer.validation.chapterNameRequired)
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
        throw new Error(payload?.message || text.addChapterDrawer.validation.createFailed)
      }

      const savedNode = await response.json().catch(() => null)

      resetForm()
      setSuccessMessage(
        isEditMode
          ? text.addChapterDrawer.messages.updated
          : text.addChapterDrawer.messages.created,
      )
      onSaved?.(savedNode)
      onClose()
    } catch (error) {
      setErrorMessage(error.message || text.addChapterDrawer.validation.createFailed)
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
                {isEditMode ? text.addChapterDrawer.title.edit : text.addChapterDrawer.title.create}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {isEditMode
                  ? text.addChapterDrawer.subtitle.edit
                  : text.addChapterDrawer.subtitle.create}
              </Typography>
            </Box>

            <TextField
              label={text.addChapterDrawer.chapterName}
              value={chapterName}
              onChange={(event) => setChapterNameOverride(event.target.value)}
              placeholder={text.addChapterDrawer.chapterNamePlaceholder}
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
                        ? `${text.addChapterDrawer.parentPrefix} ${option.parent.name}`
                        : text.addChapterDrawer.topLevelNode}
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
                  ? text.addChapterDrawer.loadingParents
                  : parentOptions.length === 0
                    ? text.addChapterDrawer.noNodesAvailable
                    : text.addChapterDrawer.noMatchingNode
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={text.addChapterDrawer.parentFederationNode}
                  placeholder={text.addChapterDrawer.parentSearchPlaceholder}
                  helperText={text.addChapterDrawer.parentHelper}
                />
              )}
            />

            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
              <Button
                variant="outlined"
                onClick={handleClose}
                disabled={submitting}>
                {text.addChapterDrawer.cancel}
              </Button>
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting
                  ? isEditMode
                    ? text.addChapterDrawer.updating
                    : text.addChapterDrawer.creating
                  : isEditMode
                    ? text.addChapterDrawer.update
                    : text.addChapterDrawer.create}
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
