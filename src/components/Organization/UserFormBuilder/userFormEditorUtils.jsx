import { getFieldTypeOptions, parseOptions } from "./userFormBuilderConfig"

export function toEditableFields(fields = []) {
  return fields.map((field) => ({
    id: field.id || crypto.randomUUID(),
    serverFieldId: field.id || null,
    label: field.label || "",
    fieldKey: field.fieldKey || "",
    fieldType: field.fieldType || "TEXT",
    fieldTypeLabel: getOptionLabel(field.fieldType),
    isRequired: Boolean(field.isRequired),
    options: toOptions(field.options),
  }))
}

export function reorderFieldItems(currentFields, sourceFieldId, targetFieldId) {
  const sourceIndex = currentFields.findIndex((field) => field.id === sourceFieldId)
  const targetIndex = currentFields.findIndex((field) => field.id === targetFieldId)
  if (sourceIndex < 0 || targetIndex < 0) return currentFields

  const reordered = [...currentFields]
  const [moved] = reordered.splice(sourceIndex, 1)
  reordered.splice(targetIndex, 0, moved)
  return reordered
}

function getOptionLabel(fieldType) {
  return (
    getFieldTypeOptions().find((option) => option.value === fieldType)?.label ||
    String(fieldType || "")
  )
}

function toOptions(options) {
  if (Array.isArray(options)) return options.filter(Boolean)
  if (typeof options === "string") return parseOptions(options)
  return []
}
