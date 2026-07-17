"use client"

import * as React from "react"
import {
  INITIAL_STATIC_FIELDS,
  areRequiredDynamicFieldsFilled,
  backendUrl,
  getCreateSteps,
  isStrongPassword,
} from "./createFormUtils"

export default function useUserCreateForm(formId) {
  const [form, setForm] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [errorMessage, setErrorMessage] = React.useState("")
  const [stepIndex, setStepIndex] = React.useState(0)
  const [isSaving, setIsSaving] = React.useState(false)
  const [staticFields, setStaticFields] = React.useState(INITIAL_STATIC_FIELDS)
  const [dynamicValues, setDynamicValues] = React.useState({})
  const [paymentMethod, setPaymentMethod] = React.useState("gpay")
  const [couponCode, setCouponCode] = React.useState("")
  const [paymentError, setPaymentError] = React.useState("")
  const [paymentSucceeded, setPaymentSucceeded] = React.useState(false)

  const requiresPayment = form?.paymentPeriod === "PRE_APPROVAL"
  const steps = getCreateSteps(requiresPayment)
  const otherDetailsIndex = 2
  const paymentIndex = requiresPayment ? 3 : -1
  const successIndex = steps.length - 1

  React.useEffect(() => {
    if (!formId) return
    const controller = new AbortController()
    ;(async () => {
      try {
        setErrorMessage("")
        const response = await fetch(`${backendUrl}/api/forms/${formId}`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error("Unable to load form details")
        setForm(await response.json())
      } catch (error) {
        if (error.name !== "AbortError") {
          setErrorMessage(error.message || "Unable to load form details")
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    })()
    return () => controller.abort()
  }, [formId])

  const dynamicFields = React.useMemo(() => {
    const fields = Array.isArray(form?.fields) ? form.fields : []
    return [...fields].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
  }, [form])

  const passwordStrong = isStrongPassword(staticFields.password)
  const canGoStep2 = Boolean(
    staticFields.name.trim() &&
      staticFields.email.trim() &&
      staticFields.phoneNumber.trim() &&
      staticFields.addressLine1.trim() &&
      staticFields.city.trim() &&
      staticFields.state.trim() &&
      staticFields.pincode.trim(),
  )
  const canGoStep3 =
    passwordStrong &&
    staticFields.password.length > 0 &&
    staticFields.password === staticFields.confirmPassword
  const canSaveStep3 = areRequiredDynamicFieldsFilled(
    dynamicFields,
    dynamicValues,
  )

  const handleStaticChange = (key, value) => {
    setStaticFields((current) => ({ ...current, [key]: value }))
  }

  const handleDynamicChange = (key, value) => {
    setDynamicValues((current) => ({ ...current, [key]: value }))
  }

  const saveUser = async ({ fromPayment = false } = {}) => {
    try {
      setIsSaving(true)
      setErrorMessage("")
      const response = await fetch(`${backendUrl}/api/federation-users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          federationNodeId: form.federationNodeId,
          formId,
          name: staticFields.name,
          email: staticFields.email,
          phoneNumber: `${staticFields.countryCode}${staticFields.phoneNumber}`,
          addressLine1: staticFields.addressLine1,
          addressLine2: staticFields.addressLine2,
          city: staticFields.city,
          state: staticFields.state,
          pincode: staticFields.pincode,
          password: staticFields.password,
          dynamicFields: dynamicValues,
        }),
      })
      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.message || "Unable to save user")
      }
      setPaymentSucceeded(fromPayment)
      setStepIndex(getCreateSteps(requiresPayment).length - 1)
    } catch (error) {
      setErrorMessage(error.message || "Unable to save user")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePay = () => {
    if (couponCode.trim().toUpperCase() === "FEDOS") {
      setPaymentError("")
      saveUser({ fromPayment: true })
      return
    }
    setPaymentError("Payment failed")
  }

  const handleCouponChange = (value) => {
    setCouponCode(value)
    setPaymentError("")
  }

  return {
    form,
    isLoading,
    errorMessage,
    stepIndex,
    setStepIndex,
    isSaving,
    staticFields,
    dynamicFields,
    dynamicValues,
    paymentMethod,
    setPaymentMethod,
    couponCode,
    paymentError,
    paymentSucceeded,
    requiresPayment,
    steps,
    otherDetailsIndex,
    paymentIndex,
    successIndex,
    passwordStrong,
    canGoStep2,
    canGoStep3,
    canSaveStep3,
    handleStaticChange,
    handleDynamicChange,
    handleCouponChange,
    handlePay,
    saveUser,
  }
}
