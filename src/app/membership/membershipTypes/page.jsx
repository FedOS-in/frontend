"use client"

import React from "react"
import OrganizationLayout from "@/components/Organization/OrganizationLayout"
import PageHeader from "@/components/Organization/PageHeader"
import MembershipTypesList from "@/components/Membership/MembershipTypesList"
import AddMembershipTypeDrawer from "@/components/Membership/AddMembershipTypeDrawer"
import AddIcon from "@mui/icons-material/Add"
import { useOrganizationText } from "@/i18n/organizationLanguageStore"

export default function MembershipTypesPage() {
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [refreshKey, setRefreshKey] = React.useState(0)
  const text = useOrganizationText()

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
            label: text.membershipTypesPage.actions.create,
            icon: <AddIcon />,
            variant: "contained",
            onClick: () => setDrawerOpen(true),
          },
        ]}
      />

      <MembershipTypesList refreshKey={refreshKey} />

      <AddMembershipTypeDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSaved={() => setRefreshKey((key) => key + 1)}
      />
    </OrganizationLayout>
  )
}
