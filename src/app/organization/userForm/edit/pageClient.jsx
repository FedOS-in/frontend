"use client"

import { useRouter } from "next/navigation"
import Alert from "@mui/material/Alert"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import OrganizationLayout from "@/components/Organization/OrganizationLayout"
import PageHeader from "@/components/Organization/PageHeader"
import UserFormBuilderEditWorkspace from "@/components/Organization/UserFormBuilder/UserFormBuilderEditWorkspace"
import { useOrganizationText } from "@/i18n/organizationLanguageStore"
import "./page.css"

export default function EditUserFormPageClient({ errorMessage, initialForm }) {
  const router = useRouter()
  const text = useOrganizationText()

  return (
    <OrganizationLayout>
      <div className="edit-user-form-page">
        <PageHeader
          title={text.userFormPage.editTitle}
          subtitle={text.userFormPage.editSubtitle}
          breadcrumbs={[
            { label: text.common.organization, href: true, id: "structure" },
            { label: text.userFormPage.breadcrumbs.userForms, href: true, id: "userForm" },
            { label: text.userFormPage.breadcrumbs.editForm, href: false },
          ]}
          actions={[
            {
              label: text.common.backToForms,
              icon: <ArrowBackIcon />,
              variant: "outlined",
              onClick: () => router.push("/organization/userForm"),
            },
          ]}
        />

        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

        {!errorMessage && initialForm ? (
          <UserFormBuilderEditWorkspace
            initialForm={initialForm}
            onCancel={() => router.push("/organization/userForm")}
          />
        ) : null}
      </div>
    </OrganizationLayout>
  )
}
