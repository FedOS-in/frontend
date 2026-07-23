"use client"

import AddIcon from "@mui/icons-material/Add"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
} from "@mui/material"
import { getFieldTypeOptions } from "./userFormBuilderConfig"
import UserFormBuilderSetupFields from "./UserFormBuilderSetupFields"
import { useOrganizationText } from "@/i18n/organizationLanguageStore"
import "./UserFormBuilderForm.css"

export default function UserFormBuilderForm({
  chapterOptions,
  fieldDraft,
  formName,
  isEditing,
  loadingChapters,
  loadingLookups,
  membershipTypeId,
  membershipTypeOptions,
  onCancel,
  onCancelEdit,
  onChapterChange,
  onDraftChange,
  onFieldKeyChange,
  onFormNameChange,
  onMembershipTypeChange,
  onPaymentPeriodChange,
  onSubmitField,
  paymentPeriod,
  selectedChapter,
}) {
  const text = useOrganizationText()
  return (
    <Paper variant="outlined" className="user-form-builder-form">
      <UserFormBuilderSetupFields
        chapterOptions={chapterOptions}
        formName={formName}
        loadingChapters={loadingChapters}
        loadingLookups={loadingLookups}
        membershipTypeId={membershipTypeId}
        membershipTypeOptions={membershipTypeOptions}
        onChapterChange={onChapterChange}
        onFormNameChange={onFormNameChange}
        onMembershipTypeChange={onMembershipTypeChange}
        onPaymentPeriodChange={onPaymentPeriodChange}
        paymentPeriod={paymentPeriod}
        selectedChapter={selectedChapter}
      />

      <div className="user-form-builder-form__divider" />

      <div className="user-form-builder-form__section">
        <Typography
          variant="subtitle1"
          className="user-form-builder-form__title">
          {text.userFormBuilder.addField}
        </Typography>

        <Box className="user-form-builder-form__grid">
          <div className="user-form-builder-form__cell">
            <TextField
              label={text.userFormBuilder.label}
              value={fieldDraft.label}
              onChange={(event) => onDraftChange("label", event.target.value)}
              placeholder={text.userFormBuilder.labelPlaceholder}
              fullWidth
            />
          </div>

          <div className="user-form-builder-form__cell">
            <TextField
              label={text.userFormBuilder.fieldKey}
              value={fieldDraft.fieldKey}
              onChange={(event) => onFieldKeyChange(event.target.value)}
              placeholder={text.userFormBuilder.fieldKeyPlaceholder}
              fullWidth
            />
          </div>

          <div className="user-form-builder-form__cell">
            <Autocomplete
              options={getFieldTypeOptions()}
              value={fieldDraft.fieldType}
              onChange={(_, value) => onDraftChange("fieldType", value)}
              getOptionLabel={(option) => option?.label || ""}
              isOptionEqualToValue={(option, value) =>
                option.value === value?.value
              }
              noOptionsText={text.userFormBuilder.noFieldTypesFound}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={text.userFormBuilder.fieldType}
                  placeholder={text.userFormBuilder.fieldTypePlaceholder}
                />
              )}
            />
          </div>

          <div className="user-form-builder-form__cell user-form-builder-form__cell--checkbox">
            <FormControlLabel
              control={
                <Checkbox
                  checked={fieldDraft.isRequired}
                  onChange={(event) =>
                    onDraftChange("isRequired", event.target.checked)
                  }
                />
              }
              label={text.userFormBuilder.isRequired}
            />
          </div>

          <div className="user-form-builder-form__cell user-form-builder-form__cell--full">
            <TextField
              label={text.userFormBuilder.options}
              value={fieldDraft.options}
              onChange={(event) => onDraftChange("options", event.target.value)}
              placeholder={text.userFormBuilder.optionsPlaceholder}
              helperText={text.userFormBuilder.optionsHelper}
              multiline
              rows={1}
              fullWidth
            />
          </div>
        </Box>

        <div className="user-form-builder-form__actions">
          <Button
            variant="outlined"
            onClick={isEditing ? onCancelEdit : onCancel}>
            {isEditing
              ? text.userFormBuilder.cancelEdit
              : text.userFormBuilder.cancel}
          </Button>
          <Button
            variant="contained"
            endIcon={isEditing ? <EditOutlinedIcon /> : <AddIcon />}
            onClick={onSubmitField}>
            {isEditing
              ? text.userFormBuilder.updateField
              : text.userFormBuilder.addFieldAction}
          </Button>
        </div>
      </div>
    </Paper>
  )
}
