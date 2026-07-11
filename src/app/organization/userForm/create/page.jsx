"use client"

import { useRouter } from "next/navigation"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import OrganizationLayout from "@/components/Organization/OrganizationLayout"
import PageHeader from "@/components/Organization/PageHeader"
import UserFormBuilderWorkspace from "@/components/Organization/UserFormBuilder/UserFormBuilderWorkspace"
import "./page.css"

export default function CreateUserFormPage() {
  const router = useRouter()

  return (
    <OrganizationLayout>
      <div className="create-user-form-page">
        <PageHeader
          title="Create User Form"
          subtitle="Build dynamic user forms in a dedicated workspace and keep the live structure visible while you work."
          breadcrumbs={[
            { label: "Organization", href: true, id: "structure" },
            { label: "User Forms", href: true, id: "userForm" },
            { label: "Create Form", href: false },
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

        <UserFormBuilderWorkspace
          onCancel={() => router.push("/organization/userForm")}
        />
      </div>
    </OrganizationLayout>
  )
}