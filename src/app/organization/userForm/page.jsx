"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import AddIcon from "@mui/icons-material/Add"
import { Alert, Button, Paper, Snackbar, Typography } from "@mui/material"
import OrganizationLayout from "@/components/Organization/OrganizationLayout"
import PageHeader from "@/components/Organization/PageHeader"
import ShareLinkModal from "@/components/Organization/ShareLinkModal"
import UserFormCard from "@/components/Organization/UserFormCard"
import UserFormDetailsModal from "@/components/Organization/UserFormDetailsModal"
import { useOrganizationText } from "@/i18n/organizationLanguageStore"
import "./page.css"

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

export default function UserFormPage() {
  const router = useRouter()
  const text = useOrganizationText()
  const [forms, setForms] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [errorMessage, setErrorMessage] = React.useState("")
  const [successMessage, setSuccessMessage] = React.useState("")
  const [selectedForm, setSelectedForm] = React.useState(null)
  const [shareForm, setShareForm] = React.useState(null)
  const shareModalText = text.userFormPage.shareModal

  const shareUrl = React.useMemo(() => {
    if (!shareForm?.id || typeof window === "undefined") return ""
    return new URL(
      `/user/create/${shareForm.id}`,
      window.location.origin,
    ).toString()
  }, [shareForm])

  React.useEffect(() => {
    const controller = new AbortController()

    ;(async () => {
      try {
        const response = await fetch(`${backendUrl}/api/forms`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error(text.userFormPage.messages.loadError)
        const payload = await response.json()
        setForms(Array.isArray(payload) ? payload : [])
      } catch (error) {
        if (error.name !== "AbortError") {
          setErrorMessage(error.message || text.userFormPage.messages.loadError)
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    })()

    return () => controller.abort()
  }, [])

  const handleDelete = async (formId) => {
    if (!window.confirm(text.userFormPage.messages.deleteConfirm)) return
    setErrorMessage("")
    try {
      const response = await fetch(`${backendUrl}/api/forms/${formId}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const payloadError = await response.json().catch(() => null)
        throw new Error(
          payloadError?.message || text.userFormPage.messages.deleteFailed,
        )
      }
      setForms((current) => current.filter((form) => form.id !== formId))
    } catch (error) {
      setErrorMessage(error.message || text.userFormPage.messages.deleteFailed)
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

      <section
        className="user-form-page__grid"
        aria-label={text.userFormPage.cards.ariaLabel}>
        {forms.map((form) => (
          <UserFormCard
            key={form.id}
            form={form}
            labels={text.userFormPage.cards}
            onView={setSelectedForm}
            onEdit={(item) =>
              router.push(`/organization/userForm/edit?formId=${item.id}`)
            }
            onShare={(item) => {
              setErrorMessage("")
              setSuccessMessage("")
              setShareForm(item)
            }}
            onDelete={handleDelete}
          />
        ))}
      </section>

      <UserFormDetailsModal
        form={selectedForm}
        titleFallback={text.userFormPage.cards.detailsTitle}
        editLabel={text.userFormPage.cards.editForm}
        closeLabel={text.common.close}
        onClose={() => setSelectedForm(null)}
        onEdit={(formId) => {
          setSelectedForm(null)
          router.push(`/organization/userForm/edit?formId=${formId}`)
        }}
      />

      <ShareLinkModal
        open={Boolean(shareForm)}
        onClose={() => setShareForm(null)}
        url={shareUrl}
        title={shareModalText.title}
        urlLabel={shareModalText.urlLabel}
        whatsappLabel={shareModalText.whatsapp}
        emailLabel={shareModalText.email}
        copyLabel={shareModalText.copy}
        closeLabel={text.common.close}
        emailSubject={shareForm?.name || shareModalText.title}
        emailBody={
          shareForm?.name ? `${shareForm.name}\n\n${shareUrl}` : shareUrl
        }
        onCopySuccess={() =>
          setSuccessMessage(text.userFormPage.messages.copied)
        }
        onCopyError={() =>
          setErrorMessage(text.userFormPage.messages.copyFailed)
        }
      />

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
