"use client"

import * as React from "react"
import { Alert, Box, CircularProgress, Typography } from "@mui/material"
import { useOrganizationText } from "@/i18n/organizationLanguageStore"
import useRenewalsData from "./useRenewalsData"
import useRenewalsActions from "./useRenewalsActions"
import RenewalsStats from "./RenewalsStats"
import RenewalsToolbar from "./RenewalsToolbar"
import RenewalsTabs from "./RenewalsTabs"
import RenewalsSelectionBar from "./RenewalsSelectionBar"
import RenewalsTable from "./RenewalsTable"
import RenewalsPagination from "./RenewalsPagination"
import RenewalsMemberPanel from "./RenewalsMemberPanel"
import RenewalsDetailModal from "./RenewalsDetailModal"
import "./RenewalsWorkspace.css"

export default function RenewalsWorkspace() {
  const text = useOrganizationText()
  const pageText = text.renewalsPage
  const data = useRenewalsData(pageText)
  const actions = useRenewalsActions(
    pageText,
    text.common.close,
    data.refresh,
  )
  const [detailMember, setDetailMember] = React.useState(null)

  if (data.loading && !data.stats) {
    return (
      <Box className="renewals-workspace__loading">
        <CircularProgress size={28} />
        <Typography variant="body2" color="text.secondary">
          {pageText.loading}
        </Typography>
      </Box>
    )
  }

  if (data.errorMessage && !data.stats) {
    return <Alert severity="error">{data.errorMessage}</Alert>
  }

  return (
    <Box className="renewals-workspace">
      <Box className="renewals-workspace__bulk">
        {actions.renderBulkActions(data.selectedRows)}
      </Box>

      <RenewalsStats
        stats={data.stats}
        labels={pageText.stats}
        currencyPrefix={pageText.currencyPrefix}
      />
      <RenewalsToolbar
        searchQuery={data.searchQuery}
        onSearchChange={data.setSearchQuery}
        dueStatusFilter={data.dueStatusFilter}
        onDueStatusChange={data.setDueStatusFilter}
        paymentStatusFilter={data.paymentStatusFilter}
        onPaymentStatusChange={data.setPaymentStatusFilter}
        membershipTypeId={data.membershipTypeId}
        onMembershipTypeChange={data.setMembershipTypeId}
        federationNodeId={data.federationNodeId}
        onFederationNodeChange={data.setFederationNodeId}
        membershipTypes={data.membershipTypes}
        nodes={data.nodes}
        labels={pageText.toolbar}
      />
      <RenewalsTabs
        bucket={data.bucket}
        onBucketChange={data.setBucket}
        tabCounts={data.tabCounts}
        labels={pageText.tabs}
      />
      <RenewalsSelectionBar
        selectedCount={data.selectedIds.length}
        allSelected={
          data.items.length > 0 &&
          data.selectedIds.length === data.items.length
        }
        onToggleAll={data.toggleSelectAll}
        onGeneratePaymentLink={() => actions.openShare(data.selectedRows)}
        onRecordOfflinePayment={() => actions.openOffline(data.selectedRows)}
        labels={pageText.selection}
      />
      <RenewalsTable
        rows={data.items}
        selectedIds={data.selectedIds}
        onToggleSelect={data.toggleSelect}
        onRowClick={data.setSelectedMember}
        onGeneratePaymentLink={actions.openShare}
        onRecordOfflinePayment={actions.openOffline}
        labels={pageText.columns}
        statusLabels={pageText.status}
        daysLeftLabels={pageText.daysLeft}
        actionLabels={pageText.actions}
        currencyPrefix={pageText.currencyPrefix}
      />
      <RenewalsPagination
        startIndex={data.startIndex}
        endIndex={data.endIndex}
        total={data.total}
        page={data.page}
        totalPages={data.totalPages}
        rowsPerPage={data.rowsPerPage}
        onPageChange={data.setPage}
        onRowsPerPageChange={data.setRowsPerPage}
        labels={pageText.pagination}
      />
      <RenewalsMemberPanel
        open={Boolean(data.selectedMember)}
        member={data.selectedMember}
        onClose={() => data.setSelectedMember(null)}
        onGeneratePaymentLink={actions.openShare}
        onRecordOfflinePayment={actions.openOffline}
        onViewDetail={setDetailMember}
        labels={pageText.panel}
        statusLabels={pageText.status}
        currencyPrefix={pageText.currencyPrefix}
      />
      <RenewalsDetailModal
        open={Boolean(detailMember)}
        member={detailMember}
        onClose={() => setDetailMember(null)}
        labels={pageText.detailModal}
        statusLabels={pageText.status}
        daysLeftLabels={pageText.daysLeft}
        currencyPrefix={pageText.currencyPrefix}
      />
      {actions.renderModals()}
    </Box>
  )
}
