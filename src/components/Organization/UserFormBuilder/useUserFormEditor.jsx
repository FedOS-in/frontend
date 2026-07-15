"use client"

import * as React from "react"
import { EMPTY_DRAFT, createFieldKey, getFieldTypeOptions, normalizeFieldKey, parseOptions } from "./userFormBuilderConfig"
import { reorderFieldItems, toEditableFields } from "./userFormEditorUtils"
import { useOrganizationText } from "@/i18n/organizationLanguageStore"

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

export function useUserFormEditor({ initialForm, onCancel }) {
  const text = useOrganizationText()
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
        if (!response.ok) throw new Error(text.userFormBuilder.messages.loadChaptersError)
        const nodes = await response.json()
        const options = Array.isArray(nodes) ? nodes : []
        setChapterOptions(options)
        const matched = options.find((node) => node.id === initialForm?.federationNodeId) || null
        setSelectedChapter(matched)
      } catch (error) {
        if (error.name !== "AbortError") setErrorMessage(error.message || text.userFormBuilder.messages.loadChaptersError)
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
      fieldType: getFieldTypeOptions().find((option) => option.value === field.fieldType) || null,
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

    if (!label) return setErrorMessage(text.userFormBuilder.validation.labelRequired)
    if (!fieldKey) return setErrorMessage(text.userFormBuilder.validation.fieldKeyRequired)
    if (!fieldType) return setErrorMessage(text.userFormBuilder.validation.fieldTypeRequired)
    if (fieldType.supportsOptions && parsedOptions.length === 0) {
      return setErrorMessage(text.userFormBuilder.validation.optionsRequired)
    }
    if (fields.some((item) => item.fieldKey === fieldKey && item.id !== editingFieldId)) {
      return setErrorMessage(text.userFormBuilder.validation.duplicateFieldKey)
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
    if (!formName.trim()) return setErrorMessage(text.userFormBuilder.validation.formNameRequired)
    if (!selectedChapter?.id) return setErrorMessage(text.userFormBuilder.validation.chapterRequired)
    if (fields.length === 0) return setErrorMessage(text.userFormBuilder.validation.addFieldFirst)

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
        throw new Error(payloadError?.message || text.userFormBuilder.messages.updateFailed)
      }

      setSuccessMessage(text.userFormBuilder.messages.updated)
      onCancel()
    } catch (error) {
      setErrorMessage(error.message || text.userFormBuilder.messages.updateFailed)
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
