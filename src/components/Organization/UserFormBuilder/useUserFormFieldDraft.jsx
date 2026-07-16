"use client"

import * as React from "react"
import {
  EMPTY_DRAFT,
  createFieldKey,
  getFieldTypeOptions,
  normalizeFieldKey,
  parseOptions,
} from "./userFormBuilderConfig"

export function useUserFormFieldDraft({ fields, setFields, setErrorMessage, validation }) {
  const [fieldDraft, setFieldDraft] = React.useState(EMPTY_DRAFT)
  const [editingFieldId, setEditingFieldId] = React.useState(null)
  const [fieldKeyDirty, setFieldKeyDirty] = React.useState(false)

  const resetFieldDraft = React.useCallback(() => {
    setFieldDraft(EMPTY_DRAFT)
    setFieldKeyDirty(false)
  }, [])

  const onDraftChange = (field, value) => {
    setFieldDraft((currentDraft) => {
      if (field !== "label") return { ...currentDraft, [field]: value }
      return {
        ...currentDraft,
        label: value,
        fieldKey: fieldKeyDirty ? currentDraft.fieldKey : createFieldKey(value),
      }
    })
  }

  const onFieldKeyChange = (value) => {
    setFieldKeyDirty(true)
    onDraftChange("fieldKey", normalizeFieldKey(value))
  }

  const onEditField = (fieldId) => {
    const field = fields.find((item) => item.id === fieldId)
    if (!field) return

    setEditingFieldId(fieldId)
    setFieldKeyDirty(true)
    setFieldDraft({
      label: field.label,
      fieldKey: field.fieldKey,
      fieldType:
        getFieldTypeOptions().find((option) => option.value === field.fieldType) ||
        null,
      isRequired: field.isRequired,
      options: (field.options || []).join("\n"),
    })
    setErrorMessage("")
  }

  const onCancelEdit = () => {
    setEditingFieldId(null)
    setErrorMessage("")
    resetFieldDraft()
  }

  const onSubmitField = () => {
    const label = fieldDraft.label.trim()
    const fieldKey = normalizeFieldKey(fieldDraft.fieldKey)
    const fieldType = fieldDraft.fieldType
    const parsedOptions = parseOptions(fieldDraft.options)

    if (!label) return setErrorMessage(validation.labelRequired)
    if (!fieldKey) return setErrorMessage(validation.fieldKeyRequired)
    if (!fieldType) return setErrorMessage(validation.fieldTypeRequired)
    if (fieldType.supportsOptions && parsedOptions.length === 0) {
      return setErrorMessage(validation.optionsRequired)
    }
    if (fields.some((item) => item.fieldKey === fieldKey && item.id !== editingFieldId)) {
      return setErrorMessage(validation.duplicateFieldKey)
    }

    const existing = fields.find((item) => item.id === editingFieldId)
    const nextField = {
      id: editingFieldId || crypto.randomUUID(),
      serverFieldId: existing?.serverFieldId || null,
      label,
      fieldKey,
      fieldType: fieldType.value,
      fieldTypeLabel: fieldType.label,
      isRequired: fieldDraft.isRequired,
      options: fieldType.supportsOptions ? parsedOptions : [],
    }

    setFields((current) =>
      editingFieldId
        ? current.map((item) => (item.id === editingFieldId ? nextField : item))
        : [...current, nextField],
    )
    setEditingFieldId(null)
    setErrorMessage("")
    resetFieldDraft()
  }

  return {
    fieldDraft,
    isEditing: Boolean(editingFieldId),
    onCancelEdit,
    onDraftChange,
    onEditField,
    onFieldKeyChange,
    onSubmitField,
  }
}
