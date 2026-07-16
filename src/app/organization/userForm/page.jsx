"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import WhatsAppIcon from "@mui/icons-material/WhatsApp"
import EmailIcon from "@mui/icons-material/Email"
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
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import OrganizationLayout from "@/components/Organization/OrganizationLayout"
import PageHeader from "@/components/Organization/PageHeader"
import { useOrganizationText } from "@/i18n/organizationLanguageStore"
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
  const text = useOrganizationText()
  const [forms, setForms] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [errorMessage, setErrorMessage] = React.useState("")
  const [successMessage, setSuccessMessage] = React.useState("")
  const [selectedForm, setSelectedForm] = React.useState(null)
  const [shareForm, setShareForm] = React.useState(null)

  const shareUrl = React.useMemo(() => {
    if (!shareForm?.id || typeof window === "undefined") {
      return ""
    }

    return new URL(`/user/create/${shareForm.id}`, window.location.origin).toString()
  }, [shareForm])

  const whatsappShareUrl = React.useMemo(() => {
    if (!shareUrl) return ""
    return `https://wa.me/?text=${encodeURIComponent(shareUrl)}`
  }, [shareUrl])

  const emailShareUrl = React.useMemo(() => {
    if (!shareUrl) return ""

    const subject = encodeURIComponent(
      shareForm?.name || text.userFormPage.shareModal.title,
    )
    const body = encodeURIComponent(
      `${shareForm?.name ? `${shareForm.name}\n\n` : ""}${shareUrl}`,
    )

    return `mailto:?subject=${subject}&body=${body}`
  }, [shareForm, shareUrl, text.userFormPage.shareModal.title])

  React.useEffect(() => {
    const controller = new AbortController()

    ;(async () => {
      try {
        const response = await fetch(`${backendUrl}/api/forms`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(text.userFormPage.messages.loadError)
        }

        const payload = await response.json()
        setForms(Array.isArray(payload) ? payload : [])
      } catch (error) {
        if (error.name !== "AbortError") {
          setErrorMessage(error.message || text.userFormPage.messages.loadError)
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
    const isConfirmed = window.confirm(text.userFormPage.messages.deleteConfirm)
    if (!isConfirmed) return
    setErrorMessage("")
    try {
      const response = await fetch(`${backendUrl}/api/forms/${formId}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const payloadError = await response.json().catch(() => null)
        throw new Error(payloadError?.message || text.userFormPage.messages.deleteFailed)
      }
      setForms((currentForms) =>
        currentForms.filter((form) => form.id !== formId),
      )
    } catch (error) {
      setErrorMessage(error.message || text.userFormPage.messages.deleteFailed)
    }
  }

  const handleOpenShareDialog = (form) => {
    setErrorMessage("")
    setSuccessMessage("")
    setShareForm(form)
  }

  const handleCopyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setSuccessMessage(text.userFormPage.messages.copied)
    } catch {
      setErrorMessage(text.userFormPage.messages.copyFailed)
    }
  }

  return (
    <OrganizationLayout>
      <PageHeader
        title={text.userFormPage.title}
        subtitle={text.userFormPage.subtitle}
        breadcrumbs={[
          { label: text.common.organization, href: true, id: "structure" },
          { label: text.userFormPage.breadcrumbs.userForms, href: false },
        ]}
        actions={[
          {
            label: text.userFormPage.actions.createForm,
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
            {text.userFormPage.emptyState.title}
          </Typography>
          <Typography variant="body2" className="user-form-page__empty-text">
            {text.userFormPage.emptyState.text}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push("/organization/userForm/create")}>
            {text.userFormPage.emptyState.action}
          </Button>
        </Paper>
      ) : null}

      <section className="user-form-page__grid" aria-label={text.userFormPage.cards.ariaLabel}>
        {forms.map((form) => (
          <Paper key={form.id} variant="outlined" className="user-form-card">
            <div className="user-form-card__head">
              <Typography variant="h6" className="user-form-card__title">
                {form.name}
              </Typography>
              <div className="user-form-card__menu" aria-label={text.userFormPage.cards.actionsLabel}>
                <IconButton
                  className="user-form-card__menu-trigger"
                  aria-label={text.userFormPage.cards.openActions}>
                  <MoreVertIcon />
                </IconButton>
                <div className="user-form-card__menu-dropdown">
                  <button
                    type="button"
                    className="user-form-card__menu-item user-form-card__menu-item--view"
                    onClick={() => setSelectedForm(form)}>
                    <VisibilityOutlinedIcon /> {text.userFormPage.cards.view}
                  </button>
                  <button
                    type="button"
                    className="user-form-card__menu-item user-form-card__menu-item--edit"
                    onClick={() =>
                      router.push(
                        `/organization/userForm/edit?formId=${form.id}`,
                      )
                    }>
                    <EditOutlinedIcon /> {text.userFormPage.cards.edit}
                  </button>
                  <button
                    type="button"
                    className="user-form-card__menu-item user-form-card__menu-item--share"
                    onClick={() => handleOpenShareDialog(form)}>
                    <ContentCopyIcon /> {text.userFormPage.cards.inviteUsers}
                  </button>
                  <button
                    type="button"
                    className="user-form-card__menu-item user-form-card__menu-item--delete"
                    onClick={() => handleDelete(form.id)}>
                    <DeleteIcon /> {text.userFormPage.cards.delete}
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
          <span>{selectedForm?.name || text.userFormPage.cards.detailsTitle}</span>
          {selectedForm?.id ? (
            <IconButton
              className="user-form-modal__edit-button"
              aria-label={text.userFormPage.cards.editForm}
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
          <Button onClick={() => setSelectedForm(null)}>{text.common.close}</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(shareForm)}
        onClose={() => setShareForm(null)}
        fullWidth
        maxWidth="sm">
        <DialogTitle className="user-form-modal__title">
          <span>{text.userFormPage.shareModal.title}</span>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label={text.userFormPage.shareModal.urlLabel}
              value={shareUrl}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button
                component="a"
                href={whatsappShareUrl || undefined}
                target="_blank"
                rel="noreferrer"
                fullWidth
                variant="contained"
                disabled={!whatsappShareUrl}
                sx={{
                  bgcolor: "#25D366",
                  color: "#ffffff",
                  "&:hover": { bgcolor: "#1fa855" },
                }}>
                <WhatsAppIcon sx={{ color: "#ffffff" }} />
                {text.userFormPage.shareModal.whatsapp}
              </Button>
              <Button
                component="a"
                href={emailShareUrl || undefined}
                fullWidth
                variant="outlined"
                disabled={!emailShareUrl}
                startIcon={<EmailIcon />}
                sx={{
                  borderColor: "rgba(9, 30, 66, 0.15)",
                  color: "var(--mui-palette-text-primary, #091e42)",
                }}>
                {text.userFormPage.shareModal.email}
              </Button>
              <Button
                type="button"
                fullWidth
                variant="text"
                onClick={handleCopyShareUrl}
                disabled={!shareUrl}
                startIcon={<ContentCopyIcon />}>
                {text.userFormPage.shareModal.copy}
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareForm(null)}>{text.common.close}</Button>
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
