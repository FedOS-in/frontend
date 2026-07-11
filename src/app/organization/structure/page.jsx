"use client"
import React from "react"
import OrganizationLayout from "@/components/Organization/OrganizationLayout"
import PageHeader from "@/components/Organization/PageHeader"
import StructureView from "@/components/Organization/StructureView"
import AddChapterDrawer from "@/components/Organization/AddChapterDrawer"
import AddIcon from "@mui/icons-material/Add"

export default function StructurePage() {
  const [addChapterOpen, setAddChapterOpen] = React.useState(false)

  return (
    <OrganizationLayout>
      <PageHeader
        title="Organization Structure"
        subtitle="Manage hierarchy levels and chapters"
        breadcrumbs={[
          { label: "Organization", href: true, id: "structure" },
          { label: "Structure", href: false },
        ]}
        actions={[
          { label: "Add Level", icon: <AddIcon />, variant: "outlined" },
          {
            label: "Add Chapter",
            icon: <AddIcon />,
            variant: "contained",
            onClick: () => setAddChapterOpen(true),
          },
        ]}
      />

      <StructureView />
      <AddChapterDrawer
        open={addChapterOpen}
        onClose={() => setAddChapterOpen(false)}
      />
    </OrganizationLayout>
  )
}
