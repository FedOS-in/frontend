"use client"

import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material"
import { getPaymentPeriodOptions } from "./userFormBuilderConfig"
import { useOrganizationText } from "@/i18n/organizationLanguageStore"

export default function UserFormBuilderBillingFields({
  loadingLookups,
  membershipTypeId,
  membershipTypeOptions,
  onMembershipTypeChange,
  onPaymentPeriodChange,
  paymentPeriod,
}) {
  const text = useOrganizationText()
  const paymentPeriodOptions = getPaymentPeriodOptions()
  const selectedMembershipType =
    membershipTypeOptions.find(
      (option) => String(option.id) === String(membershipTypeId),
    ) || null

  return (
    <>
      <div className="user-form-builder-form__cell user-form-builder-form__cell--full">
        <FormControl fullWidth required>
          <InputLabel id="user-form-payment-period-label">
            {text.userFormBuilder.paymentPeriod}
          </InputLabel>
          <Select
            labelId="user-form-payment-period-label"
            label={text.userFormBuilder.paymentPeriod}
            value={paymentPeriod || ""}
            onChange={(event) => onPaymentPeriodChange(event.target.value)}>
            {paymentPeriodOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="user-form-builder-form__cell user-form-builder-form__cell--full">
        <Autocomplete
          options={membershipTypeOptions ?? []}
          value={selectedMembershipType}
          onChange={(_, value) =>
            onMembershipTypeChange(value ? String(value.id) : "")
          }
          loading={loadingLookups}
          disabled={loadingLookups}
          getOptionLabel={(option) => option?.label || ""}
          isOptionEqualToValue={(option, value) => option.id === value?.id}
          filterOptions={(options, state) =>
            options.filter((option) => {
              const query = state.inputValue.toLowerCase()
              return (
                (option.label || "").toLowerCase().includes(query) ||
                (option.code || "").toLowerCase().includes(query)
              )
            })
          }
          noOptionsText={
            loadingLookups
              ? text.userFormBuilder.loadingMembershipTypes
              : membershipTypeOptions.length === 0
                ? text.userFormBuilder.noMembershipTypesAvailable
                : text.userFormBuilder.noMatchingMembershipType
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={text.userFormBuilder.membershipType}
              placeholder={
                text.userFormBuilder.membershipTypeSearchPlaceholder
              }
              required
            />
          )}
        />
      </div>
    </>
  )
}
