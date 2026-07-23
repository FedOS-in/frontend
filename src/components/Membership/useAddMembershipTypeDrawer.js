"use client"

import * as React from "react"

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

export const INITIAL_MEMBERSHIP_TYPE_FORM = {
  federationNode: null,
  title: "",
  description: "",
  code: "",
  validityId: "",
  currencyId: "",
  joiningFee: "",
  renewalFee: "",
  status: "1",
}

export function useAddMembershipTypeDrawer({ open, onClose, onSaved, t }) {
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

        setFederationOptions(Array.isArray(nodes) ? nodes : [])
        setValidityOptions(Array.isArray(validities) ? validities : [])
        setCurrencyOptions(Array.isArray(currencies) ? currencies : [])
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
  }, [open, t.validation.loadLookupsFailed])

  const handleClose = () => {
    if (submitting) return
    resetForm()
    onClose()
  }

  const validateForm = () => {
    if (!form.federationNode?.id) return t.validation.federationRequired
    if (!form.title.trim()) return t.validation.titleRequired
    if (!form.code.trim()) return t.validation.codeRequired
    if (!/^[A-Z0-9_]+$/.test(form.code.trim())) {
      return t.validation.codeUppercase
    }
    if (!form.validityId) return t.validation.validityRequired
    if (!form.currencyId) return t.validation.currencyRequired
    if (form.joiningFee === "" || Number.isNaN(Number(form.joiningFee))) {
      return t.validation.joiningFeeRequired
    }
    if (form.renewalFee === "" || Number.isNaN(Number(form.renewalFee))) {
      return t.validation.renewalFeeRequired
    }
    return ""
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    setSubmitting(true)
    setErrorMessage("")

    try {
      const response = await fetch(`${backendUrl}/api/membership-types`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: form.title.trim(),
          description: form.description.trim(),
          code: form.code.trim().toUpperCase(),
          federationNodeId: form.federationNode.id,
          validityId: Number(form.validityId),
          currencyId: Number(form.currencyId),
          joiningFee: Number(form.joiningFee),
          renewalFee: Number(form.renewalFee),
          status: Number(form.status),
        }),
      })

      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error(payload?.message || t.validation.codeExists)
        }
        throw new Error(payload?.message || t.validation.createFailed)
      }

      resetForm()
      setSuccessMessage(t.messages.created)
      onSaved?.(payload)
      onClose()
    } catch (error) {
      setErrorMessage(error.message || t.validation.createFailed)
    } finally {
      setSubmitting(false)
    }
  }

  return {
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
