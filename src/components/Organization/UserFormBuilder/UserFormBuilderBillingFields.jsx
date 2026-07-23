"use client"

import {
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
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
        <FormControl required className="user-form-builder-form__radio-group">
          <FormLabel id="user-form-membership-type-label">
            {text.userFormBuilder.membershipType}
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="user-form-membership-type-label"
            name="membership-type"
            value={membershipTypeId || ""}
            onChange={(event) => onMembershipTypeChange(event.target.value)}>
            {membershipTypeOptions.map((option) => (
              <FormControlLabel
                key={option.id}
                value={String(option.id)}
                control={<Radio />}
                label={option.label}
                disabled={loadingLookups}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </div>
    </>
  )
}
