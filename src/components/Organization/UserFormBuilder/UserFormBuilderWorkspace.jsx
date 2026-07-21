"use client"

import * as React from "react"
import Alert from "@mui/material/Alert"
import Button from "@mui/material/Button"
import AddIcon from "@mui/icons-material/Add"
import {
  buildFormPayload,
  reorderFieldItems,
  validateFormSetup,
} from "./userFormEditorUtils"
import { useFormSetupLookups } from "./useFormSetupLookups"
import { useUserFormFieldDraft } from "./useUserFormFieldDraft"
import UserFormBuilderForm from "./UserFormBuilderForm"
import UserFormFieldsList from "./UserFormFieldsList"
import { useOrganizationText } from "@/i18n/organizationLanguageStore"
import "./UserFormBuilderWorkspace.css"

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

export default function UserFormBuilderWorkspace({ onCancel }) {
  const text = useOrganizationText()
  const [formName, setFormName] = React.useState("")
  const [currencyId, setCurrencyId] = React.useState("")
  const [subscriptionAmount, setSubscriptionAmount] = React.useState("")
  const [paymentPeriod, setPaymentPeriod] = React.useState("")
  const [membershipPeriodId, setMembershipPeriodId] = React.useState("")
  const [chapterOptions, setChapterOptions] = React.useState([])
  const [selectedChapter, setSelectedChapter] = React.useState(null)
  const [loadingChapters, setLoadingChapters] = React.useState(false)
  const [fields, setFields] = React.useState([])
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
        setChapterOptions(Array.isArray(nodes) ? nodes : [])
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
  }, [])

  React.useEffect(() => {
    if (lookups.lookupError) setErrorMessage(lookups.lookupError)
  }, [lookups.lookupError])

  const handleCreateForm = async () => {
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
    if (setupError) {
      setSuccessMessage("")
      setErrorMessage(setupError)
      return
    }

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
        isActive: true,
        version: 1,
        fields,
      })

      const response = await fetch(`${backendUrl}/api/forms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const payloadError = await response.json().catch(() => null)
        throw new Error(
          payloadError?.message || text.userFormBuilder.messages.createFailed,
        )
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
          currencyId={currencyId}
          currencyOptions={lookups.currencyOptions}
          fieldDraft={fieldDraftState.fieldDraft}
          formName={formName}
          isEditing={fieldDraftState.isEditing}
          loadingChapters={loadingChapters}
          loadingLookups={lookups.loadingLookups}
          membershipPeriodId={membershipPeriodId}
          membershipPeriodOptions={lookups.membershipPeriodOptions}
          onCancelEdit={fieldDraftState.onCancelEdit}
          onCancel={onCancel}
          onChapterChange={setSelectedChapter}
          onCurrencyChange={setCurrencyId}
          onDraftChange={fieldDraftState.onDraftChange}
          onFieldKeyChange={fieldDraftState.onFieldKeyChange}
          onFormNameChange={setFormName}
          onMembershipPeriodChange={setMembershipPeriodId}
          onPaymentPeriodChange={setPaymentPeriod}
          onSubmitField={fieldDraftState.onSubmitField}
          onSubscriptionAmountChange={setSubscriptionAmount}
          paymentPeriod={paymentPeriod}
          selectedChapter={selectedChapter}
          subscriptionAmount={subscriptionAmount}
        />
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
      </div>

      <div className="user-form-builder-workspace__sidebar">
        <UserFormFieldsList
          fields={fields}
          onEditField={fieldDraftState.onEditField}
          onReorderFields={(sourceFieldId, targetFieldId) =>
            setFields((current) =>
              reorderFieldItems(current, sourceFieldId, targetFieldId),
            )
          }
          onRemoveField={(fieldId) =>
            setFields((current) =>
              current.filter((field) => field.id !== fieldId),
            )
          }
        />
      </div>

      <div className="user-form-builder-workspace__footer-actions">
        <Button
          variant="contained"
          endIcon={<AddIcon />}
          onClick={handleCreateForm}
          disabled={isSubmittingForm}>
          {isSubmittingForm
            ? text.userFormBuilder.creatingForm
            : text.userFormBuilder.createForm}
        </Button>
      </div>
    </div>
  )
}
