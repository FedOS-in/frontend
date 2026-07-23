"use client"

import * as React from "react"
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
import "./AddMembershipTypeDrawer.css"

export default function AddMembershipTypeFormFields({
  text,
  form,
  setForm,
  federationOptions,
  validityOptions,
  currencyOptions,
  loadingLookups,
}) {
  const t = text.addMembershipTypeDrawer

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <>
      <Autocomplete
        options={federationOptions}
        value={form.federationNode}
        onChange={(_, value) => updateField("federationNode", value)}
        loading={loadingLookups}
        getOptionLabel={(option) => option?.name || ""}
        isOptionEqualToValue={(option, value) => option.id === value?.id}
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option.id}>
            <Box>
              <Typography className="add-membership-type-drawer__option-name">
                {option.name}
              </Typography>
              <Typography
                variant="caption"
                className="add-membership-type-drawer__option-meta">
                {option.parent?.name
                  ? `${t.parentPrefix} ${option.parent.name}`
                  : t.topLevelNode}
              </Typography>
            </Box>
          </Box>
        )}
        noOptionsText={
          loadingLookups
            ? t.loadingLookups
            : federationOptions.length === 0
              ? t.noNodesAvailable
              : t.noMatchingNode
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={t.federationNode}
            placeholder={t.federationSearchPlaceholder}
            helperText={t.federationHelper}
            required
          />
        )}
      />

      <TextField
        label={t.titleField}
        value={form.title}
        onChange={(event) => updateField("title", event.target.value)}
        placeholder={t.titlePlaceholder}
        fullWidth
        required
      />

      <TextField
        label={t.description}
        value={form.description}
        onChange={(event) => updateField("description", event.target.value)}
        placeholder={t.descriptionPlaceholder}
        fullWidth
        multiline
        minRows={3}
      />

      <TextField
        label={t.code}
        value={form.code}
        onChange={(event) =>
          updateField("code", event.target.value.toUpperCase())
        }
        placeholder={t.codePlaceholder}
        helperText={t.codeHelper}
        fullWidth
        required
      />

      <FormControl fullWidth required>
        <InputLabel id="membership-type-validity-label">{t.validity}</InputLabel>
        <Select
          labelId="membership-type-validity-label"
          label={t.validity}
          value={form.validityId}
          onChange={(event) => updateField("validityId", event.target.value)}>
          {validityOptions.map((option) => (
            <MenuItem key={option.id} value={String(option.id)}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth required>
        <InputLabel id="membership-type-currency-label">
          {t.currencyType}
        </InputLabel>
        <Select
          labelId="membership-type-currency-label"
          label={t.currencyType}
          value={form.currencyId}
          onChange={(event) => updateField("currencyId", event.target.value)}>
          {currencyOptions.map((option) => (
            <MenuItem key={option.id} value={String(option.id)}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label={t.joiningFee}
        type="number"
        value={form.joiningFee}
        onChange={(event) => updateField("joiningFee", event.target.value)}
        fullWidth
        required
        slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
      />

      <TextField
        label={t.renewalFee}
        type="number"
        value={form.renewalFee}
        onChange={(event) => updateField("renewalFee", event.target.value)}
        fullWidth
        required
        slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
      />

      <FormControl fullWidth required>
        <InputLabel id="membership-type-status-label">{t.status}</InputLabel>
        <Select
          labelId="membership-type-status-label"
          label={t.status}
          value={form.status}
          onChange={(event) => updateField("status", event.target.value)}>
          <MenuItem value="1">{t.statusActive}</MenuItem>
          <MenuItem value="0">{t.statusInactive}</MenuItem>
        </Select>
      </FormControl>
    </>
  )
}
