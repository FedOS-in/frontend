"use client"

import * as React from "react"
import { Alert, Box, CircularProgress, Typography } from "@mui/material"
import { useOrganizationText } from "@/i18n/organizationLanguageStore"
import { useMembershipTypesData } from "./useMembershipTypesData"
import MembershipTypesStats from "./MembershipTypesStats"
import MembershipTypesToolbar from "./MembershipTypesToolbar"
import MembershipTypesTable from "./MembershipTypesTable"
import MembershipTypesPagination from "./MembershipTypesPagination"
import MembershipTypesSidebar from "./MembershipTypesSidebar"
import "./MembershipTypesWorkspace.css"

export default function MembershipTypesWorkspace({
  refreshKey = 0,
  onEdit,
}) {
  const text = useOrganizationText()
  const pageText = text.membershipTypesPage
  const data = useMembershipTypesData(refreshKey, pageText.loadError)

  if (data.loading) {
    return (
      <Box className="membership-types-workspace__loading">
        <CircularProgress size={28} />
        <Typography variant="body2" color="text.secondary">
          {pageText.loading}
        </Typography>
      </Box>
    )
  }

  if (data.errorMessage) {
    return <Alert severity="error">{data.errorMessage}</Alert>
  }

  return (
    <Box className="membership-types-workspace">
      <Box className="membership-types-workspace__main">
        <MembershipTypesStats
          stats={data.stats}
          labels={pageText.stats}
        />
        <MembershipTypesToolbar
          searchQuery={data.searchQuery}
          onSearchChange={data.setSearchQuery}
          statusFilter={data.statusFilter}
          onStatusChange={data.setStatusFilter}
          labels={pageText.toolbar}
        />
        <MembershipTypesTable
          rows={data.pagedItems}
          labels={pageText.columns}
          statusLabels={pageText.status}
          viewModalLabels={pageText.viewModal}
          closeLabel={text.common.close}
          onEdit={onEdit}
        />
        <MembershipTypesPagination
          startIndex={data.startIndex}
          endIndex={data.endIndex}
          totalFiltered={data.totalFiltered}
          page={data.page}
          totalPages={data.totalPages}
          rowsPerPage={data.rowsPerPage}
          onPageChange={data.setPage}
          onRowsPerPageChange={data.setRowsPerPage}
          labels={pageText.pagination}
        />
      </Box>

      <Box className="membership-types-workspace__side">
        <MembershipTypesSidebar labels={pageText.sidebar} />
      </Box>
    </Box>
  )
}
