"use client"

import * as React from "react"
import Alert from "@mui/material/Alert"
import Button from "@mui/material/Button"
import AddIcon from "@mui/icons-material/Add"
import { EMPTY_DRAFT, createFieldKey, getFieldTypeOptions, normalizeFieldKey, parseOptions } from "./userFormBuilderConfig"
import UserFormBuilderForm from "./UserFormBuilderForm"
import UserFormFieldsList from "./UserFormFieldsList"
import { useOrganizationText } from "@/i18n/organizationLanguageStore"
import "./UserFormBuilderWorkspace.css"

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
export default function UserFormBuilderWorkspace({ onCancel }) {
  const text = useOrganizationText()
  const [formName, setFormName] = React.useState("")
  const [chapterOptions, setChapterOptions] = React.useState([])
  const [selectedChapter, setSelectedChapter] = React.useState(null)
  const [loadingChapters, setLoadingChapters] = React.useState(false)
  const [fieldDraft, setFieldDraft] = React.useState(EMPTY_DRAFT)
  const [fields, setFields] = React.useState([])
  const [editingFieldId, setEditingFieldId] = React.useState(null)
  const [fieldKeyDirty, setFieldKeyDirty] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")
  const [successMessage, setSuccessMessage] = React.useState("")
  const [isSubmittingForm, setIsSubmittingForm] = React.useState(false)

  React.useEffect(() => {
    const controller = new AbortController()

    async function loadChapters() {
      setLoadingChapters(true)

      try {
        const response = await fetch(`${backendUrl}/api/federation-nodes`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(text.userFormBuilder.messages.loadChaptersError)
        }

        const nodes = await response.json()
        setChapterOptions(Array.isArray(nodes) ? nodes : [])
      } catch (error) {
        if (error.name !== "AbortError") {
          setErrorMessage(error.message || text.userFormBuilder.messages.loadChaptersError)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingChapters(false)
        }
      }
    }

    loadChapters()

    return () => {
      controller.abort()
    }
  }, [])

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
        getFieldTypeOptions().find(
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
      setErrorMessage(text.userFormBuilder.validation.labelRequired)
      return
    }

    if (!normalizedFieldKey) {
      setErrorMessage(text.userFormBuilder.validation.fieldKeyRequired)
      return
    }

    if (!selectedType) {
      setErrorMessage(text.userFormBuilder.validation.fieldTypeRequired)
      return
    }

    if (
      fields.some(
        (field) =>
          field.fieldKey === normalizedFieldKey && field.id !== editingFieldId,
      )
    ) {
      setErrorMessage(text.userFormBuilder.validation.duplicateFieldKey)
      return
    }

    if (selectedType.supportsOptions && parsedOptions.length === 0) {
      setErrorMessage(text.userFormBuilder.validation.optionsRequired)
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

  const handleCreateForm = async () => {
    const normalizedFormName = formName.trim()

    if (!normalizedFormName) {
      setSuccessMessage("")
      setErrorMessage(text.userFormBuilder.validation.formNameRequired)
      return
    }

    if (!selectedChapter?.id) {
      setSuccessMessage("")
      setErrorMessage(text.userFormBuilder.validation.chapterRequired)
      return
    }

    if (fields.length === 0) {
      setSuccessMessage("")
      setErrorMessage(text.userFormBuilder.validation.addFieldFirst)
      return
    }

    setIsSubmittingForm(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const payload = {
        federationNodeId: selectedChapter.id,
        name: normalizedFormName,
        version: 1,
        isActive: true,
        fields: fields.map((field, index) => ({
          fieldKey: field.fieldKey,
          label: field.label,
          fieldType: field.fieldType,
          isRequired: field.isRequired,
          sortOrder: index + 1,
          ...(field.options?.length
            ? { options: field.options.join(",") }
            : {}),
        })),
      }

      const response = await fetch(`${backendUrl}/api/forms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const payloadError = await response.json().catch(() => null)
        throw new Error(payloadError?.message || text.userFormBuilder.messages.createFailed)
      }

      setSuccessMessage(text.userFormBuilder.messages.created)
      onCancel()
    } catch (error) {
      setErrorMessage(error.message || text.userFormBuilder.messages.createFailed)
    } finally {
      setIsSubmittingForm(false)
    }
  }

  return (
    <div className="user-form-builder-workspace">
      <div className="user-form-builder-workspace__main">
        <UserFormBuilderForm
          chapterOptions={chapterOptions}
          fieldDraft={fieldDraft}
          formName={formName}
          isEditing={Boolean(editingFieldId)}
          loadingChapters={loadingChapters}
          onCancelEdit={handleCancelEdit}
          onCancel={onCancel}
          onChapterChange={setSelectedChapter}
          onDraftChange={handleDraftChange}
          onFieldKeyChange={handleFieldKeyChange}
          onFormNameChange={setFormName}
          onSubmitField={handleSubmitField}
          selectedChapter={selectedChapter}
        />
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
      </div>

      <div className="user-form-builder-workspace__sidebar">
        <UserFormFieldsList
          fields={fields}
          onEditField={handleEditField}
          onReorderFields={handleReorderFields}
          onRemoveField={handleRemoveField}
        />
      </div>

      <div className="user-form-builder-workspace__footer-actions">
        <Button
          variant="contained"
          endIcon={<AddIcon />}
          onClick={handleCreateForm}
          disabled={isSubmittingForm}>
          {isSubmittingForm ? text.userFormBuilder.creatingForm : text.userFormBuilder.createForm}
        </Button>
      </div>
    </div>
  )
}