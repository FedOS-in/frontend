"use client"

import React from "react"
import OrganizationLayout from "@/components/Organization/OrganizationLayout"
import PageHeader from "@/components/Organization/PageHeader"
import OrganizationUsersPage from "@/components/Organization/Users/OrganizationUsersPage"

export default function UsersPage() {
  return (
    <OrganizationLayout>
      <PageHeader
        title="Users"
        subtitle="Filter users by federation node and manage approval status."
        breadcrumbs={[
          { label: "Organization", href: true, id: "structure" },
          { label: "Users", href: false },
        ]}
      />
      <OrganizationUsersPage />
    </OrganizationLayout>
  )
}
