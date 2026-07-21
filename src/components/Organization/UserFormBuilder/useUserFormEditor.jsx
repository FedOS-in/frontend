"use client"

import * as React from "react"
import {
  buildFormPayload,
  reorderFieldItems,
  toEditableFields,
  validateFormSetup,
} from "./userFormEditorUtils"
import { useFormSetupLookups } from "./useFormSetupLookups"
import { useUserFormFieldDraft } from "./useUserFormFieldDraft"
import { useOrganizationText } from "@/i18n/organizationLanguageStore"

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

export function useUserFormEditor({ initialForm, onCancel }) {
  const text = useOrganizationText()
  const [formName, setFormName] = React.useState(initialForm?.name || "")
  const [currencyId, setCurrencyId] = React.useState(
    initialForm?.currencyId != null ? String(initialForm.currencyId) : "",
  )
  const [subscriptionAmount, setSubscriptionAmount] = React.useState(
    initialForm?.subscriptionAmount != null
      ? String(initialForm.subscriptionAmount)
      : "",
  )
  const [paymentPeriod, setPaymentPeriod] = React.useState(
    initialForm?.paymentPeriod || "",
  )
  const [membershipPeriodId, setMembershipPeriodId] = React.useState(
    initialForm?.membershipPeriodId != null
      ? String(initialForm.membershipPeriodId)
      : "",
  )
  const [chapterOptions, setChapterOptions] = React.useState([])
  const [selectedChapter, setSelectedChapter] = React.useState(null)
  const [loadingChapters, setLoadingChapters] = React.useState(false)
  const [fields, setFields] = React.useState(() =>
    toEditableFields(initialForm?.fields || []),
  )
  const [errorMessage, setErrorMessage] = React.useState("")
  const [successMessage, setSuccessMessage] = React.useState("")
  const [isSubmittingForm, setIsSubmittingForm] = React.useState(false)
  const lookups = useFormSetupLookups(
    text.userFormBuilder.messages.loadLookupsError,
  )

  const fieldDraftState = useUserFormFieldDraft({
    fields,
    setFields,
    setErrorMessage,
    validation: text.userFormBuilder.validation,
  })

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
        const options = Array.isArray(nodes) ? nodes : []
        setChapterOptions(options)
        setSelectedChapter(
          options.find((node) => node.id === initialForm?.federationNodeId) ||
            null,
        )
      } catch (error) {
        if (error.name !== "AbortError") {
          setErrorMessage(
            error.message || text.userFormBuilder.messages.loadChaptersError,
          )
        }
      } finally {
        if (!controller.signal.aborted) setLoadingChapters(false)
      }
    }

    loadChapters()
    return () => controller.abort()
  }, [initialForm?.federationNodeId])

  React.useEffect(() => {
    if (lookups.lookupError) setErrorMessage(lookups.lookupError)
  }, [lookups.lookupError])

  const onUpdateForm = async () => {
    const setupError = validateFormSetup({
      formName,
      selectedChapter,
      currencyId,
      subscriptionAmount,
      paymentPeriod,
      membershipPeriodId,
      fields,
      validation: text.userFormBuilder.validation,
    })
    if (setupError) return setErrorMessage(setupError)

    setIsSubmittingForm(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const payload = buildFormPayload({
        selectedChapter,
        formName,
        currencyId,
        subscriptionAmount,
        paymentPeriod,
        membershipPeriodId,
        isActive: initialForm?.isActive ?? true,
        version: initialForm?.version ?? 1,
        fields,
      })

      const response = await fetch(`${backendUrl}/api/forms/${initialForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const payloadError = await response.json().catch(() => null)
        throw new Error(
          payloadError?.message || text.userFormBuilder.messages.updateFailed,
        )
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
    currencyId,
    currencyOptions: lookups.currencyOptions,
    errorMessage,
    fieldDraft: fieldDraftState.fieldDraft,
    fields,
    formName,
    isEditing: fieldDraftState.isEditing,
    isSubmittingForm,
    loadingChapters,
    loadingLookups: lookups.loadingLookups,
    membershipPeriodId,
    membershipPeriodOptions: lookups.membershipPeriodOptions,
    onCancelEdit: fieldDraftState.onCancelEdit,
    onChapterChange: setSelectedChapter,
    onCurrencyChange: setCurrencyId,
    onDraftChange: fieldDraftState.onDraftChange,
    onEditField: fieldDraftState.onEditField,
    onFieldKeyChange: fieldDraftState.onFieldKeyChange,
    onFormNameChange: setFormName,
    onMembershipPeriodChange: setMembershipPeriodId,
    onPaymentPeriodChange: setPaymentPeriod,
    onRemoveField: (fieldId) =>
      setFields((current) => current.filter((field) => field.id !== fieldId)),
    onReorderFields: (sourceFieldId, targetFieldId) =>
      setFields((current) =>
        reorderFieldItems(current, sourceFieldId, targetFieldId),
      ),
    onSubmitField: fieldDraftState.onSubmitField,
    onSubscriptionAmountChange: setSubscriptionAmount,
    onUpdateForm,
    paymentPeriod,
    selectedChapter,
    subscriptionAmount,
    successMessage,
  }
}
