import { getOrganizationLocale } from "@/i18n/organizationLanguageStore"
import { getOrganizationText } from "@/i18n/organizationText"

export function getFieldTypeOptions() {
  return getOrganizationText(getOrganizationLocale()).userFormBuilder.fieldTypes
}

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