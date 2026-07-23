"use client"

import { useParams } from "next/navigation"
import {
  Alert,
  CircularProgress,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material"
import CreateFormActions from "./CreateFormActions"
import DynamicFieldInput from "./DynamicFieldInput"
import PaymentStep from "./PaymentStep"
import StepOneFields from "./StepOneFields"
import StepTwoPassword from "./StepTwoPassword"
import useUserCreateForm from "./useUserCreateForm"
import "./page.css"

export default function UserCreateByFormIdPage() {
  const params = useParams()
  const formId = String(params?.id || "")
  const formState = useUserCreateForm(formId)
  const {
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
  } = formState

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
            {stepIndex === otherDetailsIndex ? (
              <>
                {dynamicFields.map((field) => (
                  <DynamicFieldInput
                    key={field.id}
                    field={field}
                    value={dynamicValues[field.fieldKey || field.id]}
                    onChange={handleDynamicChange}
                  />
                ))}
              </>
            ) : null}
            {requiresPayment && stepIndex === paymentIndex ? (
              <PaymentStep
                amount={form?.membershipType?.joiningFee}
                selectedMethod={paymentMethod}
                coupon={couponCode}
                paymentError={paymentError}
                onMethodChange={setPaymentMethod}
                onCouponChange={handleCouponChange}
              />
            ) : null}
            {stepIndex === successIndex ? (
              <Alert
                severity="success"
                className="user-create-page__success-step">
                {paymentSucceeded
                  ? <><span>Payment Succeed</span><p>User created successfully. This submission is complete. You will recive an email after profile approval.</p></>
                  : "User created successfully. This submission is complete. You will recive an email after profile approval."}
              </Alert>
            ) : null}
            {stepIndex === otherDetailsIndex && !canSaveStep3 ? (
              <Alert severity="warning">
                Please fill all required dynamic fields.
              </Alert>
            ) : null}
            <CreateFormActions
              stepIndex={stepIndex}
              successIndex={successIndex}
              otherDetailsIndex={otherDetailsIndex}
              paymentIndex={paymentIndex}
              requiresPayment={requiresPayment}
              canGoStep2={canGoStep2}
              canGoStep3={canGoStep3}
              canSaveStep3={canSaveStep3}
              isSaving={isSaving}
              onBack={() => setStepIndex((value) => value - 1)}
              onNext={() => setStepIndex((value) => value + 1)}
              onSave={() => saveUser()}
              onPay={handlePay}
            />
          </form>
        ) : null}
      </section>
    </main>
  )
}
