export const FIELD_TYPE_OPTIONS = [
  {
    value: "TEXT",
    label: "Text",
    helperText: "Short single-line text input",
  },
  {
    value: "NUMBER",
    label: "Number",
    helperText: "Numeric input",
  },
  {
    value: "DATE",
    label: "Date",
    helperText: "Date picker input",
  },
  {
    value: "SELECT",
    label: "Select",
    helperText: "Single-choice dropdown",
    supportsOptions: true,
  },
  {
    value: "MULTI_SELECT",
    label: "Multi Select",
    helperText: "Multiple-choice dropdown",
    supportsOptions: true,
  },
  {
    value: "CHECKBOX",
    label: "Checkbox",
    helperText: "Checkbox group",
    supportsOptions: true,
  },
  {
    value: "RADIO",
    label: "Radio",
    helperText: "Single-choice radio group",
    supportsOptions: true,
  },
  {
    value: "BOOLEAN",
    label: "Boolean",
    helperText: "Yes or no switch",
  },
  {
    value: "FILE",
    label: "File",
    helperText: "File upload input",
  },
  {
    value: "EMAIL",
    label: "Email",
    helperText: "Email address input",
  },
  {
    value: "PHONE",
    label: "Phone",
    helperText: "Phone number input",
  },
  {
    value: "TEXTAREA",
    label: "Textarea",
    helperText: "Long-form text input",
  },
]

export const EMPTY_DRAFT = {
  label: "",
  fieldKey: "",
  fieldType: null,
  isRequired: false,
  options: "",
}

export function createFieldKey(label) {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_")
}

export function normalizeFieldKey(fieldKey) {
  return fieldKey
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "")
}

export function parseOptions(optionsText) {
  return optionsText
    .split(/\r?\n|,/)
    .map((option) => option.trim())
    .filter(Boolean)
}