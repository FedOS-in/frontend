"use client"

import { useParams } from "next/navigation"
import { Alert, Button, CircularProgress, Typography } from "@mui/material"
import PaymentStep from "@/app/user/create/[id]/PaymentStep"
import { useOrganizationText } from "@/i18n/organizationLanguageStore"
import useRenewalPayment from "./useRenewalPayment"
import "../../[id]/page.css"

export default function RenewalPaymentPage() {
  const params = useParams()
  const userId = String(params?.id || "")
  const text = useOrganizationText()
  const pageText = text.paymentPage
  const renewalText = text.renewalsPage
  const {
    user,
    renewalFee,
    isLoading,
    errorMessage,
    paymentMethod,
    setPaymentMethod,
    couponCode,
    paymentError,
    isPaying,
    paymentDone,
    handleCouponChange,
    handlePay,
  } = useRenewalPayment(userId)

  const resolvedError =
    paymentError === "Payment failed"
      ? pageText.paymentFailed
      : paymentError

  return (
    <div className="member-payment-page">
      <div className="member-payment-page__container">
        <header className="member-payment-page__header">
          <Typography variant="h5" className="member-payment-page__title">
            {renewalText?.share?.title || pageText.title}
          </Typography>
          {user?.name ? (
            <Typography className="member-payment-page__subtitle">
              {user.name}
            </Typography>
          ) : null}
        </header>

        {isLoading ? (
          <div className="member-payment-page__loading">
            <CircularProgress size={28} />
          </div>
        ) : null}

        {!isLoading && errorMessage ? (
          <Alert severity="error">
            {errorMessage === "Member not found"
              ? pageText.notFound
              : pageText.loadError}
          </Alert>
        ) : null}

        {!isLoading && !errorMessage && paymentDone ? (
          <div className="member-payment-page__done">
            <div className="member-payment-page__done-icon" aria-hidden>
              ✓
            </div>
            <Typography
              variant="h6"
              className="member-payment-page__done-title">
              {pageText.paymentDoneTitle}
            </Typography>
            <Typography className="member-payment-page__done-message">
              {pageText.paymentDoneMessage}
            </Typography>
          </div>
        ) : null}

        {!isLoading && !errorMessage && !paymentDone ? (
          <div className="member-payment-page__body">
            <PaymentStep
              amount={renewalFee}
              selectedMethod={paymentMethod}
              coupon={couponCode}
              paymentError={resolvedError}
              onMethodChange={setPaymentMethod}
              onCouponChange={handleCouponChange}
              hideHeading
            />
            <div className="member-payment-page__actions">
              <Button
                className="member-payment-page__pay-button"
                variant="contained"
                disabled={isPaying}
                onClick={handlePay}>
                {isPaying ? pageText.paying : pageText.pay}
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
