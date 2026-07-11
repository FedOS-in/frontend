import * as React from "react"
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material"

function toArray(value) {
  return Array.isArray(value) ? value : []
}

export default function DynamicFieldInput({ field, value, onChange }) {
  const options = toArray(field.options)
  const required = Boolean(field.isRequired)

  const handleTextChange = (event) =>
    onChange(field.fieldKey || field.id, event.target.value)
  const handleBooleanChange = (event) =>
    onChange(field.fieldKey || field.id, event.target.checked)

  const renderByType = () => {
    switch (field.fieldType) {
      case "TEXTAREA":
        return (
          <TextField
            multiline
            minRows={3}
            fullWidth
            required={required}
            value={value || ""}
            onChange={handleTextChange}
          />
        )
      case "NUMBER":
        return (
          <TextField
            type="number"
            fullWidth
            required={required}
            value={value || ""}
            onChange={handleTextChange}
          />
        )
      case "DATE":
        return (
          <TextField
            type="date"
            fullWidth
            required={required}
            value={value || ""}
            onChange={handleTextChange}
          />
        )
      case "EMAIL":
        return (
          <TextField
            type="email"
            fullWidth
            required={required}
            value={value || ""}
            onChange={handleTextChange}
          />
        )
      case "PHONE":
        return (
          <TextField
            type="tel"
            fullWidth
            required={required}
            value={value || ""}
            onChange={handleTextChange}
          />
        )
      case "BOOLEAN":
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(value)}
                onChange={handleBooleanChange}
                required={required}
              />
            }
            label="Yes"
          />
        )
      case "SELECT":
        return (
          <TextField
            select
            fullWidth
            required={required}
            value={value || ""}
            onChange={handleTextChange}>
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        )
      case "MULTI_SELECT":
        return (
          <TextField
            select
            fullWidth
            SelectProps={{ multiple: true }}
            value={toArray(value)}
            onChange={(event) =>
              onChange(field.fieldKey || field.id, event.target.value)
            }>
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        )
      case "CHECKBOX":
        return (
          <FormGroup>
            {options.map((option) => (
              <FormControlLabel
                key={option}
                control={
                  <Checkbox
                    checked={toArray(value).includes(option)}
                    onChange={(event) => {
                      const current = toArray(value)
                      const next = event.target.checked
                        ? [...current, option]
                        : current.filter((item) => item !== option)
                      onChange(field.fieldKey || field.id, next)
                    }}
                  />
                }
                label={option}
              />
            ))}
          </FormGroup>
        )
      case "RADIO":
        return (
          <RadioGroup value={value || ""} onChange={handleTextChange}>
            {options.map((option) => (
              <FormControlLabel
                key={option}
                value={option}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
        )
      case "FILE":
        return (
          <TextField
            type="file"
            fullWidth
            required={required}
            onChange={(event) =>
              onChange(
                field.fieldKey || field.id,
                event.target.files?.[0]?.name || "",
              )
            }
          />
        )
      case "TEXT":
      default:
        return (
          <TextField
            type="text"
            fullWidth
            required={required}
            value={value || ""}
            onChange={handleTextChange}
          />
        )
    }
  }

  return (
    <FormControl fullWidth required={required}>
      <FormLabel>{field.label}</FormLabel>
      {renderByType()}
      {required ? <FormHelperText>Required</FormHelperText> : null}
    </FormControl>
  )
}
