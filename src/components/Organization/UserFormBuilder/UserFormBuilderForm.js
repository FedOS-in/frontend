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
import { FIELD_TYPE_OPTIONS } from "./userFormBuilderConfig"
import "./UserFormBuilderForm.css"

export default function UserFormBuilderForm({
  chapterOptions,
  fieldDraft,
  formName,
  isEditing,
  loadingChapters,
  onCancel,
  onCancelEdit,
  onChapterChange,
  onDraftChange,
  onFieldKeyChange,
  onFormNameChange,
  onSubmitField,
  selectedChapter,
}) {
  return (
    <Paper variant="outlined" className="user-form-builder-form">
      <div className="user-form-builder-form__section">
        <Typography variant="h6" className="user-form-builder-form__title">
          Form Setup
        </Typography>
        <TextField
          label="Form Name"
          value={formName}
          onChange={(event) => onFormNameChange(event.target.value)}
          placeholder="Member registration form"
          fullWidth
          required
        />
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
                    ? `Parent: ${option.parent.name}`
                    : "Top-level node"}
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
              ? "Loading chapters..."
              : chapterOptions.length === 0
                ? "No chapters available"
                : "No matching chapter found"
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Chapter"
              placeholder="Search chapter by name"
              helperText="Select the chapter to which this form belongs"
              required
            />
          )}
        />
      </div>

      <div className="user-form-builder-form__divider" />

      <div className="user-form-builder-form__section">
        <Typography
          variant="subtitle1"
          className="user-form-builder-form__title">
          Add Field
        </Typography>

        <Box className="user-form-builder-form__grid">
          <div className="user-form-builder-form__cell">
            <TextField
              label="Label"
              value={fieldDraft.label}
              onChange={(event) => onDraftChange("label", event.target.value)}
              placeholder="Phone Number"
              fullWidth
            />
          </div>

          <div className="user-form-builder-form__cell">
            <TextField
              label="fieldKey"
              value={fieldDraft.fieldKey}
              onChange={(event) => onFieldKeyChange(event.target.value)}
              placeholder="phone_number"
              fullWidth
            />
          </div>

          <div className="user-form-builder-form__cell">
            <Autocomplete
              options={FIELD_TYPE_OPTIONS}
              value={fieldDraft.fieldType}
              onChange={(_, value) => onDraftChange("fieldType", value)}
              getOptionLabel={(option) => option?.label || ""}
              isOptionEqualToValue={(option, value) =>
                option.value === value?.value
              }
              noOptionsText="No field types found"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Field Type"
                  placeholder="Search a field type"
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
              label="Is required"
            />
          </div>

          <div className="user-form-builder-form__cell user-form-builder-form__cell--full">
            <TextField
              label="Options"
              value={fieldDraft.options}
              onChange={(event) => onDraftChange("options", event.target.value)}
              placeholder="Use commas or new lines for select-style options"
              helperText="Needed for Select, Multi Select, Checkbox, and Radio"
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
            {isEditing ? "Cancel Edit" : "Cancel"}
          </Button>
          <Button
            variant="contained"
            endIcon={isEditing ? <EditOutlinedIcon /> : <AddIcon />}
            onClick={onSubmitField}>
            {isEditing ? "Update Field" : "Add Field"}
          </Button>
        </div>
      </div>
    </Paper>
  )
}
