"use client"

import React from "react"
import OrganizationLayout from "@/components/Organization/OrganizationLayout"
import PageHeader from "@/components/Organization/PageHeader"
import OrganizationUsersPage from "@/components/Organization/Users/OrganizationUsersPage"
import { useOrganizationText } from "@/i18n/organizationLanguageStore"

export default function MembersPage() {
  const text = useOrganizationText()

  return (
    <OrganizationLayout>
      <PageHeader
        title={text.membersPage.title}
        subtitle={text.membersPage.subtitle}
        breadcrumbs={[
          { label: text.membersPage.breadcrumbs.members, href: false },
        ]}
      />
      <OrganizationUsersPage variant="members" />
    </OrganizationLayout>
  )
}
