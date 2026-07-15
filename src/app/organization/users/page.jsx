"use client"

import React from "react"
import OrganizationLayout from "@/components/Organization/OrganizationLayout"
import PageHeader from "@/components/Organization/PageHeader"
import OrganizationUsersPage from "@/components/Organization/Users/OrganizationUsersPage"
import { useOrganizationText } from "@/i18n/organizationLanguageStore"

export default function UsersPage() {
  const text = useOrganizationText()

  return (
    <OrganizationLayout>
      <PageHeader
        title={text.usersPage.title}
        subtitle={text.usersPage.subtitle}
        breadcrumbs={[
          { label: text.common.organization, href: true, id: "structure" },
          { label: text.usersPage.breadcrumbs.users, href: false },
        ]}
      />
      <OrganizationUsersPage />
    </OrganizationLayout>
  )
}
