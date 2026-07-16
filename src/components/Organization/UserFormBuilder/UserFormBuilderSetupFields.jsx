"use client"

import {
  Autocomplete,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material"
import { getPaymentPeriodOptions } from "./userFormBuilderConfig"
import { useOrganizationText } from "@/i18n/organizationLanguageStore"

export default function UserFormBuilderSetupFields({
  chapterOptions,
  formName,
  loadingChapters,
  onChapterChange,
  onFormNameChange,
  onPaymentPeriodChange,
  onSubscriptionAmountChange,
  paymentPeriod,
  selectedChapter,
  subscriptionAmount,
}) {
  const text = useOrganizationText()
  const paymentPeriodOptions = getPaymentPeriodOptions()

  return (
    <div className="user-form-builder-form__section">
      <Typography variant="h6" className="user-form-builder-form__title">
        {text.userFormBuilder.formSetup}
      </Typography>

      <Box className="user-form-builder-form__grid">
        <div className="user-form-builder-form__cell">
          <TextField
            label={text.userFormBuilder.formName}
            value={formName}
            onChange={(event) => onFormNameChange(event.target.value)}
            placeholder={text.userFormBuilder.formNamePlaceholder}
            fullWidth
            required
          />
        </div>

        <div className="user-form-builder-form__cell">
          <Autocomplete
            options={chapterOptions ?? []}
            value={selectedChapter}
            onChange={(_, value) => onChapterChange(value ?? null)}
            loading={loadingChapters}
            getOptionLabel={(option) => option?.name || ""}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option.id}>
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>{option.name}</Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {option.parent?.name
                      ? `${text.userFormBuilder.parentPrefix} ${option.parent.name}`
                      : text.userFormBuilder.topLevelNode}
                  </Typography>
                </Box>
              </Box>
            )}
            filterOptions={(options, state) =>
              options.filter((option) =>
                option.name.toLowerCase().includes(state.inputValue.toLowerCase()),
              )
            }
            noOptionsText={
              loadingChapters
                ? text.userFormBuilder.loadingChapters
                : chapterOptions.length === 0
                  ? text.userFormBuilder.noChaptersAvailable
                  : text.userFormBuilder.noMatchingChapter
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={text.userFormBuilder.chapter}
                placeholder={text.userFormBuilder.chapterSearchPlaceholder}
                helperText={text.userFormBuilder.chapterHelper}
                required
              />
            )}
          />
        </div>

        <div className="user-form-builder-form__cell">
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

        <div className="user-form-builder-form__cell">
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
      </Box>
    </div>
  )
}
