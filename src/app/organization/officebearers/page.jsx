"use client"
import React from "react"
import OrganizationLayout from "@/components/Organization/OrganizationLayout"
import PageHeader from "@/components/Organization/PageHeader"
import BearersTable from "@/components/Organization/BearersTable"
import AddIcon from "@mui/icons-material/Add"
import PeopleIcon from "@mui/icons-material/People"

export default function OfficeBearersPage() {
  return (
    <OrganizationLayout>
      <PageHeader
        title="Office Bearers"
        subtitle="Manage leadership positions and assignments across the organization."
        breadcrumbs={[
          { label: "Organization", href: true, id: "structure" },
          { label: "Office Bearers", href: false },
        ]}
        actions={[
          { label: "Create Position", icon: <AddIcon />, variant: "outlined" },
          {
            label: "Assign Office Bearer",
            icon: <PeopleIcon />,
            variant: "contained",
          },
        ]}
      />

      <BearersTable />
    </OrganizationLayout>
  )
}
