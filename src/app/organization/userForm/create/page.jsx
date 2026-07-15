"use client"

import { useRouter } from "next/navigation"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import OrganizationLayout from "@/components/Organization/OrganizationLayout"
import PageHeader from "@/components/Organization/PageHeader"
import UserFormBuilderWorkspace from "@/components/Organization/UserFormBuilder/UserFormBuilderWorkspace"
import { useOrganizationText } from "@/i18n/organizationLanguageStore"
import "./page.css"

export default function CreateUserFormPage() {
  const router = useRouter()
  const text = useOrganizationText()

  return (
    <OrganizationLayout>
      <div className="create-user-form-page">
        <PageHeader
          title={text.userFormPage.createTitle}
          subtitle={text.userFormPage.createSubtitle}
          breadcrumbs={[
            { label: text.common.organization, href: true, id: "structure" },
            { label: text.userFormPage.breadcrumbs.userForms, href: true, id: "userForm" },
            { label: text.userFormPage.breadcrumbs.createForm, href: false },
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

        <UserFormBuilderWorkspace
          onCancel={() => router.push("/organization/userForm")}
        />
      </div>
    </OrganizationLayout>
  )
}