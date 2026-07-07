"use client"
import React from "react"
import OrganizationLayout from "@/components/Organization/OrganizationLayout"
import PageHeader from "@/components/Organization/PageHeader"
import InfoBanner from "@/components/Organization/InfoBanner"
import LevelsTable from "@/components/Organization/LevelsTable"
import AddIcon from "@mui/icons-material/Add"

export default function LevelsPage() {
  return (
    <OrganizationLayout>
      <PageHeader
        title="Organization Levels"
        subtitle="Define and manage the hierarchy levels used in your organization structure."
        breadcrumbs={[
          { label: "Organization", href: true, id: "structure" },
          { label: "Levels", href: false },
        ]}
        actions={[
          { label: "Add Level", icon: <AddIcon />, variant: "contained" },
        ]}
      />

      <InfoBanner
        title="Organization levels are the building blocks of your hierarchy."
        subtitle="Example: Level 1 - National Federation, Level 2 - State Association, Level 3 - District Association"
      />

      <LevelsTable />
    </OrganizationLayout>
  )
}
