import { getFieldTypeOptions, parseOptions } from "./userFormBuilderConfig"

export function validateFormSetup({
  formName,
  selectedChapter,
  currencyId,
  subscriptionAmount,
  paymentPeriod,
  membershipPeriodId,
  fields,
  validation,
}) {
  if (!formName?.trim()) return validation.formNameRequired
  if (!selectedChapter?.id) return validation.chapterRequired
  if (!currencyId) return validation.currencyTypeRequired

  const normalizedAmount = Number(subscriptionAmount)
  if (
    subscriptionAmount === "" ||
    Number.isNaN(normalizedAmount) ||
    normalizedAmount < 0
  ) {
    return validation.subscriptionAmountRequired
  }
  if (!paymentPeriod) return validation.paymentPeriodRequired
  if (!membershipPeriodId) return validation.membershipPeriodRequired
  if (!fields?.length) return validation.addFieldFirst
  return null
}

export function buildFormPayload({
  selectedChapter,
  formName,
  currencyId,
  subscriptionAmount,
  paymentPeriod,
  membershipPeriodId,
  isActive,
  version,
  fields,
}) {
  return {
    federationNodeId: selectedChapter.id,
    name: formName.trim(),
    currencyId: Number(currencyId),
    subscriptionAmount: Number(subscriptionAmount),
    paymentPeriod,
    membershipPeriodId: Number(membershipPeriodId),
    isActive,
    version,
    fields: fields.map((field, index) => ({
      ...(field.serverFieldId ? { id: field.serverFieldId } : {}),
      fieldKey: field.fieldKey,
      label: field.label,
      fieldType: field.fieldType,
      isRequired: field.isRequired,
      sortOrder: index + 1,
      ...(field.options?.length ? { options: field.options.join(",") } : {}),
    })),
  }
}

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
