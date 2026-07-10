"use client"

import { useRouter } from "next/navigation"
import Alert from "@mui/material/Alert"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import OrganizationLayout from "@/components/Organization/OrganizationLayout"
import PageHeader from "@/components/Organization/PageHeader"
import UserFormBuilderEditWorkspace from "@/components/Organization/UserFormBuilder/UserFormBuilderEditWorkspace"
import "./page.css"

export default function EditUserFormPageClient({ errorMessage, initialForm }) {
  const router = useRouter()

  return (
    <OrganizationLayout>
      <div className="edit-user-form-page">
        <PageHeader
          title="Edit User Form"
          subtitle="Update form details and fields with the same workspace used for creation."
          breadcrumbs={[
            { label: "Organization", href: true, id: "structure" },
            { label: "User Forms", href: true, id: "userForm" },
            { label: "Edit Form", href: false },
          ]}
          actions={[
            {
              label: "Back to forms",
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
