"use client"
import React from "react"
import OrganizationLayout from "@/components/Organization/OrganizationLayout"
import PageHeader from "@/components/Organization/PageHeader"
import StructureView from "@/components/Organization/StructureView"
import AddChapterDrawer from "@/components/Organization/AddChapterDrawer"
import AddIcon from "@mui/icons-material/Add"
import { useOrganizationText } from "@/i18n/organizationLanguageStore"

export default function StructurePage() {
  const [addChapterOpen, setAddChapterOpen] = React.useState(false)
  const text = useOrganizationText()

  return (
    <OrganizationLayout>
      <PageHeader
        title={text.structurePage.title}
        subtitle={text.structurePage.subtitle}
        breadcrumbs={[
          { label: text.common.organization, href: true, id: "structure" },
          { label: text.structurePage.breadcrumbs.structure, href: false },
        ]}
        actions={[
          {
            label: text.structurePage.actions.addLevel,
            icon: <AddIcon />,
            variant: "outlined",
          },
          {
            label: text.structurePage.actions.addChapter,
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
