"use client"

import React from "react"
import OrganizationLayout from "@/components/Organization/OrganizationLayout"
import PageHeader from "@/components/Organization/PageHeader"
import RenewalsWorkspace from "@/components/Renewals/RenewalsWorkspace"
import { useOrganizationText } from "@/i18n/organizationLanguageStore"

export default function RenewalsPage() {
  const text = useOrganizationText()
  const pageText = text.renewalsPage

  return (
    <OrganizationLayout>
      <PageHeader
        title={pageText.title}
        subtitle={pageText.subtitle}
        breadcrumbs={[
          { label: pageText.breadcrumbs.renewals, href: false },
        ]}
      />
      <RenewalsWorkspace />
    </OrganizationLayout>
  )
}
