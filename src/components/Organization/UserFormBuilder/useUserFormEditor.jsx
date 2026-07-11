"use client"

import * as React from "react"
import { EMPTY_DRAFT, FIELD_TYPE_OPTIONS, createFieldKey, normalizeFieldKey, parseOptions } from "./userFormBuilderConfig"
import { reorderFieldItems, toEditableFields } from "./userFormEditorUtils"

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

export function useUserFormEditor({ initialForm, onCancel }) {
  const [formName, setFormName] = React.useState(initialForm?.name || "")
  const [chapterOptions, setChapterOptions] = React.useState([])
  const [selectedChapter, setSelectedChapter] = React.useState(null)
  const [loadingChapters, setLoadingChapters] = React.useState(false)
  const [fieldDraft, setFieldDraft] = React.useState(EMPTY_DRAFT)
  const [fields, setFields] = React.useState(() => toEditableFields(initialForm?.fields || []))
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
        if (!response.ok) throw new Error("Unable to load chapters")
        const nodes = await response.json()
        const options = Array.isArray(nodes) ? nodes : []
        setChapterOptions(options)
        const matched = options.find((node) => node.id === initialForm?.federationNodeId) || null
        setSelectedChapter(matched)
      } catch (error) {
        if (error.name !== "AbortError") setErrorMessage(error.message || "Unable to load chapters")
      } finally {
        if (!controller.signal.aborted) setLoadingChapters(false)
      }
    }

    loadChapters()
    return () => controller.abort()
  }, [initialForm?.federationNodeId])

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
      fieldType: FIELD_TYPE_OPTIONS.find((option) => option.value === field.fieldType) || null,
      isRequired: field.isRequired,
      options: field.options.join("\n"),
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

    if (!label) return setErrorMessage("Label is required")
    if (!fieldKey) return setErrorMessage("Field key is required")
    if (!fieldType) return setErrorMessage("Field type is required")
    if (fieldType.supportsOptions && parsedOptions.length === 0) {
      return setErrorMessage("Add options for select, multi select, checkbox, and radio")
    }
    if (fields.some((item) => item.fieldKey === fieldKey && item.id !== editingFieldId)) {
      return setErrorMessage("Field key must be unique within the form")
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

  const onUpdateForm = async () => {
    if (!formName.trim()) return setErrorMessage("Form name is required")
    if (!selectedChapter?.id) return setErrorMessage("Chapter is required")
    if (fields.length === 0) return setErrorMessage("Add at least one field")

    setIsSubmittingForm(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const payload = {
        federationNodeId: selectedChapter.id,
        name: formName.trim(),
        isActive: initialForm?.isActive ?? true,
        version: initialForm?.version ?? 1,
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

      const response = await fetch(`${backendUrl}/api/forms/${initialForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const payloadError = await response.json().catch(() => null)
        throw new Error(payloadError?.message || "Failed to update form")
      }

      setSuccessMessage("Form updated successfully")
      onCancel()
    } catch (error) {
      setErrorMessage(error.message || "Failed to update form")
    } finally {
      setIsSubmittingForm(false)
    }
  }

  return {
    chapterOptions,
    errorMessage,
    fieldDraft,
    fields,
    formName,
    isEditing: Boolean(editingFieldId),
    isSubmittingForm,
    loadingChapters,
    onCancelEdit,
    onDraftChange,
    onEditField,
    onFieldKeyChange,
    onFormNameChange: setFormName,
    onChapterChange: setSelectedChapter,
    onRemoveField: (fieldId) => setFields((current) => current.filter((field) => field.id !== fieldId)),
    onReorderFields: (sourceFieldId, targetFieldId) =>
      setFields((current) => reorderFieldItems(current, sourceFieldId, targetFieldId)),
    onSubmitField,
    onUpdateForm,
    selectedChapter,
    successMessage,
  }
}
