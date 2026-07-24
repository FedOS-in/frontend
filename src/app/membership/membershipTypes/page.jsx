"use client"

import React from "react"
import OrganizationLayout from "@/components/Organization/OrganizationLayout"
import PageHeader from "@/components/Organization/PageHeader"
import MembershipTypesWorkspace from "@/components/Membership/MembershipTypesWorkspace"
import AddMembershipTypeDrawer from "@/components/Membership/AddMembershipTypeDrawer"
import AddIcon from "@mui/icons-material/Add"
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined"
import { useOrganizationText } from "@/i18n/organizationLanguageStore"

export default function MembershipTypesPage() {
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [drawerMode, setDrawerMode] = React.useState("create")
  const [membershipTypeToEdit, setMembershipTypeToEdit] = React.useState(null)
  const [refreshKey, setRefreshKey] = React.useState(0)
  const text = useOrganizationText()

  const handleCreate = () => {
    setDrawerMode("create")
    setMembershipTypeToEdit(null)
    setDrawerOpen(true)
  }

  const handleEdit = (membershipType) => {
    setDrawerMode("edit")
    setMembershipTypeToEdit(membershipType)
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setDrawerMode("create")
    setMembershipTypeToEdit(null)
  }

  return (
    <OrganizationLayout>
      <PageHeader
        title={text.membershipTypesPage.title}
        subtitle={text.membershipTypesPage.subtitle}
        breadcrumbs={[
          {
            label: text.membershipTypesPage.breadcrumbs.membership,
            href: false,
          },
          {
            label: text.membershipTypesPage.breadcrumbs.membershipTypes,
            href: false,
          },
        ]}
        actions={[
          {
            label: text.membershipTypesPage.actions.export,
            icon: <FileDownloadOutlinedIcon />,
            variant: "outlined",
          },
          {
            label: text.membershipTypesPage.actions.create,
            icon: <AddIcon />,
            variant: "contained",
            onClick: handleCreate,
          },
        ]}
      />

      <MembershipTypesWorkspace
        refreshKey={refreshKey}
        onEdit={handleEdit}
      />

      <AddMembershipTypeDrawer
        open={drawerOpen}
        mode={drawerMode}
        membershipTypeToEdit={membershipTypeToEdit}
        onClose={handleCloseDrawer}
        onSaved={() => setRefreshKey((key) => key + 1)}
      />
    </OrganizationLayout>
  )
}
