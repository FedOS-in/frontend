import React from "react"

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

export default function useRenewalPayment(userId) {
  const [user, setUser] = React.useState(null)
  const [renewalFee, setRenewalFee] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [errorMessage, setErrorMessage] = React.useState("")
  const [paymentMethod, setPaymentMethod] = React.useState("gpay")
  const [couponCode, setCouponCode] = React.useState("")
  const [paymentError, setPaymentError] = React.useState("")
  const [isPaying, setIsPaying] = React.useState(false)
  const [paymentDone, setPaymentDone] = React.useState(false)

  React.useEffect(() => {
    const controller = new AbortController()

    async function loadPaymentData() {
      if (!userId) {
        setErrorMessage("Member not found")
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setErrorMessage("")

      try {
        const userResponse = await fetch(
          `${backendUrl}/api/federation-users/${userId}`,
          { signal: controller.signal },
        )

        if (userResponse.status === 404) {
          setErrorMessage("Member not found")
          setUser(null)
          return
        }

        if (!userResponse.ok) {
          throw new Error("Failed to load payment details")
        }

        const userData = await userResponse.json()
        setUser(userData)

        let fee = userData.membershipType?.renewalFee
        if (
          fee == null &&
          userData.membershipTypeId
        ) {
          const membershipResponse = await fetch(
            `${backendUrl}/api/membership-types/${userData.membershipTypeId}`,
            { signal: controller.signal },
          )
          if (membershipResponse.ok) {
            const membershipType = await membershipResponse.json()
            fee = membershipType.renewalFee
            setUser((current) =>
              current ? { ...current, membershipType } : current,
            )
          }
        }

        if (fee == null) {
          throw new Error("Renewal fee not configured")
        }

        setRenewalFee(fee)
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setErrorMessage(loadError.message || "Failed to load payment details")
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    loadPaymentData()
    return () => controller.abort()
  }, [userId])

  const handleCouponChange = (value) => {
    setCouponCode(value)
    setPaymentError("")
  }

  const handlePay = async () => {
    if (couponCode.trim().toUpperCase() !== "FEDOS") {
      setPaymentError("Payment failed")
      return
    }

    setIsPaying(true)
    setPaymentError("")

    try {
      const response = await fetch(
        `${backendUrl}/api/renewals/${userId}/online-payment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentMethod: "ONLINE" }),
        },
      )

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.message || "Failed to update payment status")
      }

      setPaymentDone(true)
    } catch (payError) {
      setPaymentError(payError.message || "Failed to update payment status")
    } finally {
      setIsPaying(false)
    }
  }

  return {
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
  }
}
