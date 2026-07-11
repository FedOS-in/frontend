"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import {
  Alert,
  Button,
  CircularProgress,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material"
import DynamicFieldInput from "./DynamicFieldInput"
import StepOneFields from "./StepOneFields"
import StepTwoPassword from "./StepTwoPassword"
import "./page.css"

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
const steps = ["Basic details", "Set password", "Other details", "Success"]

function isStrongPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password)
}

export default function UserCreateByFormIdPage() {
  const params = useParams()
  const formId = String(params?.id || "")
  const [form, setForm] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [errorMessage, setErrorMessage] = React.useState("")
  const [successMessage, setSuccessMessage] = React.useState("")
  const [stepIndex, setStepIndex] = React.useState(0)
  const [isSaving, setIsSaving] = React.useState(false)
  const [staticFields, setStaticFields] = React.useState({
    name: "",
    email: "",
    countryCode: "+91",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    password: "",
    confirmPassword: "",
  })
  const [dynamicValues, setDynamicValues] = React.useState({})

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
        const payload = await response.json()
        setForm(payload)
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

  const canGoStep2 =
    staticFields.name.trim() &&
    staticFields.email.trim() &&
    staticFields.phoneNumber.trim() &&
    staticFields.addressLine1.trim() &&
    staticFields.city.trim() &&
    staticFields.state.trim() &&
    staticFields.pincode.trim()

  const canGoStep3 =
    passwordStrong &&
    staticFields.password.length > 0 &&
    staticFields.password === staticFields.confirmPassword
  const canSaveStep3 = dynamicFields.every(
    (field) =>
      !field.isRequired ||
      (Array.isArray(dynamicValues[field.fieldKey || field.id])
        ? dynamicValues[field.fieldKey || field.id].length > 0
        : Boolean(dynamicValues[field.fieldKey || field.id])),
  )

  const handleStaticChange = (key, value) => {
    setStaticFields((current) => ({ ...current, [key]: value }))
  }

  const saveUser = async () => {
    try {
      setIsSaving(true)
      setErrorMessage("")
      setSuccessMessage("")

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
      setStepIndex(3)
    } catch (error) {
      setErrorMessage(error.message || "Unable to save user")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="user-create-page">
      <section
        className="user-create-page__container"
        aria-label="User registration form">
        <Typography variant="h4" className="user-create-page__title">
          {form?.name || "Create User"}
        </Typography>

        <Stepper
          activeStep={stepIndex}
          className="user-create-page__stepper"
          alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {isLoading ? (
          <div className="user-create-page__loading">
            <CircularProgress size={28} />
            <Typography variant="body2">Loading form...</Typography>
          </div>
        ) : null}

        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

        {!isLoading && !errorMessage ? (
          <form
            className="user-create-page__form"
            onSubmit={(event) => event.preventDefault()}>
            {stepIndex === 0 ? (
              <StepOneFields
                staticFields={staticFields}
                onChange={handleStaticChange}
              />
            ) : null}

            {stepIndex === 1 ? (
              <StepTwoPassword
                password={staticFields.password}
                confirmPassword={staticFields.confirmPassword}
                passwordStrong={passwordStrong}
                onChange={handleStaticChange}
              />
            ) : null}

            {stepIndex === 2 ? (
              <>
                {dynamicFields.map((field) => (
                  <DynamicFieldInput
                    key={field.id}
                    field={field}
                    value={dynamicValues[field.fieldKey || field.id]}
                    onChange={(key, value) => {
                      setDynamicValues((current) => ({
                        ...current,
                        [key]: value,
                      }))
                    }}
                  />
                ))}
              </>
            ) : null}

            {stepIndex === 3 ? (
              <Alert
                severity="success"
                className="user-create-page__success-step">
                User created successfully. This submission is complete. You will
                recive an email after profile approval.
              </Alert>
            ) : null}

            {stepIndex === 2 && !canSaveStep3 ? (
              <Alert severity="warning">
                Please fill all required dynamic fields.
              </Alert>
            ) : null}

            <div className="user-create-page__actions">
              <Button
                variant="outlined"
                disabled={stepIndex === 0 || isSaving || stepIndex === 3}
                onClick={() => setStepIndex((value) => value - 1)}>
                Back
              </Button>
              {stepIndex < 2 ? (
                <Button
                  variant="contained"
                  disabled={
                    (stepIndex === 0 && !canGoStep2) ||
                    (stepIndex === 1 && !canGoStep3)
                  }
                  onClick={() => setStepIndex((value) => value + 1)}>
                  Next
                </Button>
              ) : stepIndex === 2 ? (
                <Button
                  variant="contained"
                  disabled={isSaving || !canSaveStep3}
                  onClick={saveUser}>
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              ) : null}
            </div>
          </form>
        ) : null}
      </section>
    </main>
  )
}
