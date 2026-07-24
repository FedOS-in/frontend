"use client"

import * as React from "react"
import {
  INITIAL_MEMBERSHIP_TYPE_FORM,
  buildFormFromMembershipType,
  validateMembershipTypeForm,
  buildMembershipTypePayload,
} from "./membershipTypeFormUtils"

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

export { INITIAL_MEMBERSHIP_TYPE_FORM }

export function useAddMembershipTypeDrawer({
  open,
  onClose,
  onSaved,
  t,
  mode = "create",
  membershipTypeToEdit = null,
}) {
  const isEditMode = mode === "edit" && Boolean(membershipTypeToEdit?.id)
  const [form, setForm] = React.useState(INITIAL_MEMBERSHIP_TYPE_FORM)
  const [federationOptions, setFederationOptions] = React.useState([])
  const [validityOptions, setValidityOptions] = React.useState([])
  const [currencyOptions, setCurrencyOptions] = React.useState([])
  const [loadingLookups, setLoadingLookups] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")
  const [successMessage, setSuccessMessage] = React.useState("")

  const resetForm = () => {
    setForm(INITIAL_MEMBERSHIP_TYPE_FORM)
    setErrorMessage("")
  }

  React.useEffect(() => {
    if (!open) return undefined

    const controller = new AbortController()

    async function loadLookups() {
      setLoadingLookups(true)
      setErrorMessage("")

      try {
        const [nodesRes, validitiesRes, currenciesRes] = await Promise.all([
          fetch(`${backendUrl}/api/federation-nodes`, {
            signal: controller.signal,
          }),
          fetch(`${backendUrl}/api/validities`, { signal: controller.signal }),
          fetch(`${backendUrl}/api/currency-types`, {
            signal: controller.signal,
          }),
        ])

        if (!nodesRes.ok || !validitiesRes.ok || !currenciesRes.ok) {
          throw new Error(t.validation.loadLookupsFailed)
        }

        const [nodes, validities, currencies] = await Promise.all([
          nodesRes.json(),
          validitiesRes.json(),
          currenciesRes.json(),
        ])

        const federationList = Array.isArray(nodes) ? nodes : []
        setFederationOptions(federationList)
        setValidityOptions(Array.isArray(validities) ? validities : [])
        setCurrencyOptions(Array.isArray(currencies) ? currencies : [])

        if (isEditMode) {
          setForm(
            buildFormFromMembershipType(membershipTypeToEdit, federationList),
          )
        } else {
          setForm(INITIAL_MEMBERSHIP_TYPE_FORM)
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          setErrorMessage(error.message || t.validation.loadLookupsFailed)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingLookups(false)
        }
      }
    }

    loadLookups()

    return () => {
      controller.abort()
    }
  }, [open, isEditMode, membershipTypeToEdit, t.validation.loadLookupsFailed])

  const handleClose = () => {
    if (submitting) return
    resetForm()
    onClose()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validationError = validateMembershipTypeForm(form, t)
    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    setSubmitting(true)
    setErrorMessage("")

    try {
      const endpoint = isEditMode
        ? `${backendUrl}/api/membership-types/${membershipTypeToEdit.id}`
        : `${backendUrl}/api/membership-types`
      const response = await fetch(endpoint, {
        method: isEditMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildMembershipTypePayload(form)),
      })

      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error(payload?.message || t.validation.codeExists)
        }
        throw new Error(
          payload?.message ||
            (isEditMode
              ? t.validation.updateFailed
              : t.validation.createFailed),
        )
      }

      resetForm()
      setSuccessMessage(isEditMode ? t.messages.updated : t.messages.created)
      onSaved?.(payload)
      onClose()
    } catch (error) {
      setErrorMessage(
        error.message ||
          (isEditMode ? t.validation.updateFailed : t.validation.createFailed),
      )
    } finally {
      setSubmitting(false)
    }
  }

  return {
    isEditMode,
    form,
    setForm,
    federationOptions,
    validityOptions,
    currencyOptions,
    loadingLookups,
    submitting,
    errorMessage,
    successMessage,
    setSuccessMessage,
    handleClose,
    handleSubmit,
  }
}
