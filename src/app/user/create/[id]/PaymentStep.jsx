import { Alert, TextField, Typography } from "@mui/material"
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined"
import "./PaymentStep.css"

const METHODS = [
  { id: "gpay", label: "GPay", logo: "/payment/googlepay.png" },
  { id: "paytm", label: "Paytm", logo: "/payment/paytm.png" },
  { id: "phonepe", label: "PhonePe", logo: "/payment/phonepe.png" },
  { id: "cards", label: "Cards", icon: true },
]

export default function PaymentStep({
  amount,
  selectedMethod,
  coupon,
  paymentError,
  onMethodChange,
  onCouponChange,
}) {
  const displayAmount =
    amount === null || amount === undefined || amount === ""
      ? "—"
      : `₹${Number(amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`

  return (
    <div className="payment-step">
      <Typography variant="h6" className="payment-step__heading">
        Payment
      </Typography>

      <div className="payment-step__amount">
        <Typography variant="body2" className="payment-step__amount-label">
          Subscription amount
        </Typography>
        <Typography variant="h5" className="payment-step__amount-value">
          {displayAmount}
        </Typography>
      </div>

      <Typography variant="subtitle2" className="payment-step__methods-label">
        Payment method
      </Typography>
      <div className="payment-step__methods" role="radiogroup" aria-label="Payment method">
        {METHODS.map((method) => {
          const isSelected = selectedMethod === method.id
          return (
            <button
              key={method.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={
                isSelected
                  ? "payment-step__method payment-step__method--selected"
                  : "payment-step__method"
              }
              onClick={() => onMethodChange(method.id)}>
              {method.icon ? (
                <CreditCardOutlinedIcon className="payment-step__method-icon" />
              ) : (
                <img
                  src={method.logo}
                  alt=""
                  className="payment-step__method-logo"
                />
              )}
              <span className="payment-step__method-label">{method.label}</span>
            </button>
          )
        })}
      </div>

      <TextField
        label="Coupon code"
        value={coupon}
        onChange={(event) => onCouponChange(event.target.value)}
        fullWidth
        placeholder="Enter coupon"
      />

      {paymentError ? <Alert severity="error">{paymentError}</Alert> : null}
    </div>
  )
}
