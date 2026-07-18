import React from "react"

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

const PAYMENT_DONE_ID = 2

export default function useMemberPayment(userId) {
  const [user, setUser] = React.useState(null)
  const [form, setForm] = React.useState(null)
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
        setPaymentDone(userData.paymentStatus === PAYMENT_DONE_ID)

        if (userData.formId) {
          const formResponse = await fetch(
            `${backendUrl}/api/forms/${userData.formId}`,
            { signal: controller.signal },
          )
          if (formResponse.ok) {
            setForm(await formResponse.json())
          }
        }
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setErrorMessage(loadError.message || "Failed to load payment details")
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
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
        `${backendUrl}/api/federation-users/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentStatus: PAYMENT_DONE_ID }),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to update payment status")
      }

      const updatedUser = await response.json()
      setUser(updatedUser)
      setPaymentDone(true)
    } catch (payError) {
      setPaymentError(payError.message || "Failed to update payment status")
    } finally {
      setIsPaying(false)
    }
  }

  return {
    user,
    form,
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
