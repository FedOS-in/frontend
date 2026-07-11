"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined"
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  Paper,
  Snackbar,
  Typography,
} from "@mui/material"
import OrganizationLayout from "@/components/Organization/OrganizationLayout"
import PageHeader from "@/components/Organization/PageHeader"
import "./page.css"

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

function getDisplayedFields(fields = []) {
  if (!Array.isArray(fields)) return []
  const maxFields = 5
  const slicedFields = fields.slice(0, maxFields)
  if (fields.length > maxFields) {
    return [...slicedFields, { id: "etc", label: "etc" }]
  }
  return slicedFields
}

export default function UserFormPage() {
  const router = useRouter()
  const [forms, setForms] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [errorMessage, setErrorMessage] = React.useState("")
  const [successMessage, setSuccessMessage] = React.useState("")
  const [selectedForm, setSelectedForm] = React.useState(null)

  React.useEffect(() => {
    const controller = new AbortController()

    ;(async () => {
      try {
        const response = await fetch(`${backendUrl}/api/forms`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error("Unable to load forms")
        }

        const payload = await response.json()
        setForms(Array.isArray(payload) ? payload : [])
      } catch (error) {
        if (error.name !== "AbortError") {
          setErrorMessage(error.message || "Unable to load forms")
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    })()

    return () => controller.abort()
  }, [])

  const handleDelete = async (formId) => {
    const isConfirmed = window.confirm("Delete this form?")
    if (!isConfirmed) return
    setErrorMessage("")
    try {
      const response = await fetch(`${backendUrl}/api/forms/${formId}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const payloadError = await response.json().catch(() => null)
        throw new Error(payloadError?.message || "Failed to delete form")
      }
      setForms((currentForms) =>
        currentForms.filter((form) => form.id !== formId),
      )
    } catch (error) {
      setErrorMessage(error.message || "Failed to delete form")
    }
  }

  const handleShare = async (formId) => {
    try {
      const shareUrl = new URL(`/user/create/${formId}`, window.location.origin)
      await navigator.clipboard.writeText(shareUrl.toString())
      setSuccessMessage("Invite link copied")
    } catch {
      setErrorMessage("Unable to copy share link")
    }
  }

  return (
    <OrganizationLayout>
      <PageHeader
        title="User Forms"
        subtitle="Generate dynamic user forms by defining the fields, validation requirements, and reusable metadata in one place."
        breadcrumbs={[
          { label: "Organization", href: true, id: "structure" },
          { label: "User Forms", href: false },
        ]}
        actions={[
          {
            label: "Create form",
            icon: <AddIcon />,
            variant: "contained",
            onClick: () => router.push("/organization/userForm/create"),
          },
        ]}
      />

      {errorMessage ? (
        <Alert severity="error" className="user-form-page__alert">
          {errorMessage}
        </Alert>
      ) : null}

      {!isLoading && forms.length === 0 ? (
        <Paper variant="outlined" className="user-form-page__empty">
          <Typography variant="h6" className="user-form-page__empty-title">
            No forms found
          </Typography>
          <Typography variant="body2" className="user-form-page__empty-text">
            Create a form to see it listed here.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push("/organization/userForm/create")}>
            Create form
          </Button>
        </Paper>
      ) : null}

      <section className="user-form-page__grid" aria-label="Created forms">
        {forms.map((form) => (
          <Paper key={form.id} variant="outlined" className="user-form-card">
            <div className="user-form-card__head">
              <Typography variant="h6" className="user-form-card__title">
                {form.name}
              </Typography>
              <div className="user-form-card__menu" aria-label="Form actions">
                <IconButton
                  className="user-form-card__menu-trigger"
                  aria-label="Open form actions">
                  <MoreVertIcon />
                </IconButton>
                <div className="user-form-card__menu-dropdown">
                  <button
                    type="button"
                    className="user-form-card__menu-item user-form-card__menu-item--view"
                    onClick={() => setSelectedForm(form)}>
                    <VisibilityOutlinedIcon /> View
                  </button>
                  <button
                    type="button"
                    className="user-form-card__menu-item user-form-card__menu-item--edit"
                    onClick={() =>
                      router.push(
                        `/organization/userForm/edit?formId=${form.id}`,
                      )
                    }>
                    <EditOutlinedIcon /> Edit
                  </button>
                  <button
                    type="button"
                    className="user-form-card__menu-item user-form-card__menu-item--share"
                    onClick={() => handleShare(form.id)}>
                    <ContentCopyIcon /> Invite Users
                  </button>
                  <button
                    type="button"
                    className="user-form-card__menu-item user-form-card__menu-item--delete"
                    onClick={() => handleDelete(form.id)}>
                    <DeleteIcon /> Delete
                  </button>
                </div>
              </div>
            </div>

            <List className="user-form-card__fields">
              {getDisplayedFields(form.fields).map((field, index) => (
                <ListItem
                  key={field.id || `${form.id}-${index}`}
                  className="user-form-card__field-item">
                  <Typography
                    variant="body2"
                    className="user-form-card__field-text">
                    {field.label}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        ))}
      </section>

      <Dialog
        open={Boolean(selectedForm)}
        onClose={() => setSelectedForm(null)}
        fullWidth
        maxWidth="sm">
        <DialogTitle className="user-form-modal__title">
          <span>{selectedForm?.name || "Form details"}</span>
          {selectedForm?.id ? (
            <IconButton
              className="user-form-modal__edit-button"
              aria-label="Edit form"
              onClick={() => {
                const formId = selectedForm.id
                setSelectedForm(null)
                router.push(`/organization/userForm/edit?formId=${formId}`)
              }}>
              <EditOutlinedIcon />
            </IconButton>
          ) : null}
        </DialogTitle>
        <DialogContent dividers>
          <List>
            {(selectedForm?.fields || []).map((field) => (
              <ListItem key={field.id}>
                <Typography variant="body2">
                  {field.label} ({field.fieldType})
                </Typography>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedForm(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={2500}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      </Snackbar>
    </OrganizationLayout>
  )
}
