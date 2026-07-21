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
  TextField,
} from "@mui/material"
import {
  getCurrencySymbol,
  getPaymentPeriodOptions,
} from "./userFormBuilderConfig"
import { useOrganizationText } from "@/i18n/organizationLanguageStore"

export default function UserFormBuilderBillingFields({
  currencyId,
  currencyOptions,
  loadingLookups,
  membershipPeriodId,
  membershipPeriodOptions,
  onCurrencyChange,
  onMembershipPeriodChange,
  onPaymentPeriodChange,
  onSubscriptionAmountChange,
  paymentPeriod,
  subscriptionAmount,
}) {
  const text = useOrganizationText()
  const paymentPeriodOptions = getPaymentPeriodOptions()

  return (
    <>
      <div className="user-form-builder-form__cell user-form-builder-form__cell--full user-form-builder-form__amount-row">
        <div className="user-form-builder-form__cell user-form-builder-form__cell--currency">
          <FormControl required>
            <Select
              value={currencyId || ""}
              onChange={(event) => onCurrencyChange(event.target.value)}
              disabled={loadingLookups}
              displayEmpty
              aria-label={text.userFormBuilder.currencyType}
              renderValue={(selected) => {
                if (!selected) return "—"
                const selectedCurrency = currencyOptions.find(
                  (option) => String(option.id) === String(selected),
                )
                return getCurrencySymbol(selectedCurrency)
              }}>
              {currencyOptions.map((option) => (
                <MenuItem key={option.id} value={String(option.id)}>
                  {getCurrencySymbol(option)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="user-form-builder-form__cell user-form-builder-form__cell--amount">
          <TextField
            label={text.userFormBuilder.subscriptionAmount}
            value={subscriptionAmount}
            onChange={(event) => onSubscriptionAmountChange(event.target.value)}
            placeholder={text.userFormBuilder.subscriptionAmountPlaceholder}
            type="number"
            slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
            fullWidth
            required
          />
        </div>

        <div className="user-form-builder-form__cell user-form-builder-form__cell--payment-period">
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
      </div>

      <div className="user-form-builder-form__cell user-form-builder-form__cell--full">
        <FormControl required className="user-form-builder-form__radio-group">
          <FormLabel id="user-form-membership-period-label">
            {text.userFormBuilder.membershipPeriod}
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="user-form-membership-period-label"
            name="membership-period"
            value={membershipPeriodId || ""}
            onChange={(event) => onMembershipPeriodChange(event.target.value)}>
            {membershipPeriodOptions.map((option) => (
              <FormControlLabel
                key={option.id}
                value={String(option.id)}
                control={<Radio />}
                label={option.name}
                disabled={loadingLookups}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </div>
    </>
  )
}
