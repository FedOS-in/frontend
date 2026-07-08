"use client"

import * as React from "react"
import Alert from "@mui/material/Alert"
import { EMPTY_DRAFT, FIELD_TYPE_OPTIONS, createFieldKey, normalizeFieldKey, parseOptions } from "./userFormBuilderConfig"
import UserFormBuilderForm from "./UserFormBuilderForm"
import UserFormFieldsList from "./UserFormFieldsList"
import "./UserFormBuilderWorkspace.css"

export default function UserFormBuilderWorkspace({ onCancel }) {
  const [formName, setFormName] = React.useState("")
  const [fieldDraft, setFieldDraft] = React.useState(EMPTY_DRAFT)
  const [fields, setFields] = React.useState([])
  const [editingFieldId, setEditingFieldId] = React.useState(null)
  const [fieldKeyDirty, setFieldKeyDirty] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")

  const resetFieldDraft = React.useCallback(() => {
    setFieldDraft(EMPTY_DRAFT)
    setFieldKeyDirty(false)
  }, [])

  const handleDraftChange = (field, value) => {
    setFieldDraft((currentDraft) => {
      if (field !== "label") {
        return {
          ...currentDraft,
          [field]: value,
        }
      }

      return {
        ...currentDraft,
        label: value,
        fieldKey: fieldKeyDirty ? currentDraft.fieldKey : createFieldKey(value),
      }
    })
  }

  const handleFieldKeyChange = (value) => {
    setFieldKeyDirty(true)
    handleDraftChange("fieldKey", normalizeFieldKey(value))
  }

  const handleEditField = (fieldId) => {
    const fieldToEdit = fields.find((field) => field.id === fieldId)
    if (!fieldToEdit) return

    setEditingFieldId(fieldId)
    setFieldKeyDirty(true)
    setFieldDraft({
      label: fieldToEdit.label,
      fieldKey: fieldToEdit.fieldKey,
      fieldType:
        FIELD_TYPE_OPTIONS.find(
          (option) => option.value === fieldToEdit.fieldType,
        ) || null,
      isRequired: fieldToEdit.isRequired,
      options: fieldToEdit.options.join("\n"),
    })
    setErrorMessage("")
  }

  const handleCancelEdit = () => {
    setEditingFieldId(null)
    setErrorMessage("")
    resetFieldDraft()
  }

  const handleSubmitField = () => {
    const normalizedLabel = fieldDraft.label.trim()
    const normalizedFieldKey = normalizeFieldKey(fieldDraft.fieldKey)
    const selectedType = fieldDraft.fieldType
    const parsedOptions = parseOptions(fieldDraft.options)

    if (!normalizedLabel) {
      setErrorMessage("Label is required before adding a field")
      return
    }

    if (!normalizedFieldKey) {
      setErrorMessage("Field key is required before adding a field")
      return
    }

    if (!selectedType) {
      setErrorMessage("Field type is required before adding a field")
      return
    }

    if (
      fields.some(
        (field) =>
          field.fieldKey === normalizedFieldKey && field.id !== editingFieldId,
      )
    ) {
      setErrorMessage("Field key must be unique within the form")
      return
    }

    if (selectedType.supportsOptions && parsedOptions.length === 0) {
      setErrorMessage("Add at least one option for select, multi select, checkbox, and radio fields")
      return
    }

    const nextField = {
      id: editingFieldId || crypto.randomUUID(),
      label: normalizedLabel,
      fieldKey: normalizedFieldKey,
      fieldType: selectedType.value,
      fieldTypeLabel: selectedType.label,
      isRequired: fieldDraft.isRequired,
      options: selectedType.supportsOptions ? parsedOptions : [],
    }

    setFields((currentFields) => {
      if (!editingFieldId) return [...currentFields, nextField]
      return currentFields.map((field) =>
        field.id === editingFieldId ? nextField : field,
      )
    })

    setEditingFieldId(null)
    setErrorMessage("")
    resetFieldDraft()
  }

  const handleRemoveField = (fieldId) => {
    setFields((currentFields) =>
      currentFields.filter((field) => field.id !== fieldId),
    )

    if (editingFieldId === fieldId) {
      handleCancelEdit()
    }
  }

  const handleReorderFields = React.useCallback((sourceFieldId, targetFieldId) => {
    if (!sourceFieldId || !targetFieldId || sourceFieldId === targetFieldId) {
      return
    }

    setFields((currentFields) => {
      const sourceIndex = currentFields.findIndex((field) => field.id === sourceFieldId)
      const targetIndex = currentFields.findIndex((field) => field.id === targetFieldId)

      if (sourceIndex < 0 || targetIndex < 0) {
        return currentFields
      }

      const reorderedFields = [...currentFields]
      const [movedField] = reorderedFields.splice(sourceIndex, 1)
      reorderedFields.splice(targetIndex, 0, movedField)
      return reorderedFields
    })
  }, [])

  return (
    <div className="user-form-builder-workspace">
      <div className="user-form-builder-workspace__main">
        <UserFormBuilderForm
          fieldDraft={fieldDraft}
          formName={formName}
          isEditing={Boolean(editingFieldId)}
          onCancelEdit={handleCancelEdit}
          onCancel={onCancel}
          onDraftChange={handleDraftChange}
          onFieldKeyChange={handleFieldKeyChange}
          onFormNameChange={setFormName}
          onSubmitField={handleSubmitField}
        />
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      </div>

      <div className="user-form-builder-workspace__sidebar">
        <UserFormFieldsList
          fields={fields}
          onEditField={handleEditField}
          onReorderFields={handleReorderFields}
          onRemoveField={handleRemoveField}
        />
      </div>
    </div>
  )
}