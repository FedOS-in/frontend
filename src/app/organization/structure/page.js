"use client"
import React from "react"
import OrganizationLayout from "@/components/Organization/OrganizationLayout"
import PageHeader from "@/components/Organization/PageHeader"
import StructureView from "@/components/Organization/StructureView"
import AddIcon from "@mui/icons-material/Add"

export default function StructurePage() {
  return (
    <OrganizationLayout activeMenu="structure" onNavigate={() => {}}>
      <PageHeader
        title="Organization Structure"
        subtitle="Manage hierarchy levels and chapters"
        breadcrumbs={[
          { label: "Organization", href: true, id: "structure" },
          { label: "Structure", href: false },
        ]}
        actions={[
          { label: "Add Level", icon: <AddIcon />, variant: "outlined" },
          { label: "Add Chapter", icon: <AddIcon />, variant: "contained" },
        ]}
      />

      <StructureView />
    </OrganizationLayout>
  )
}
