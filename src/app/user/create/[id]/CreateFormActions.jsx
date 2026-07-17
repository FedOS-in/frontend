import { Button } from "@mui/material"

export default function CreateFormActions({
  stepIndex,
  successIndex,
  otherDetailsIndex,
  paymentIndex,
  requiresPayment,
  canGoStep2,
  canGoStep3,
  canSaveStep3,
  isSaving,
  onBack,
  onNext,
  onSave,
  onPay,
}) {
  const isSuccess = stepIndex === successIndex

  return (
    <div className="user-create-page__actions">
      <Button
        variant="outlined"
        disabled={stepIndex === 0 || isSaving || isSuccess}
        onClick={onBack}>
        Back
      </Button>
      {stepIndex < otherDetailsIndex ? (
        <Button
          variant="contained"
          disabled={
            (stepIndex === 0 && !canGoStep2) || (stepIndex === 1 && !canGoStep3)
          }
          onClick={onNext}>
          Next
        </Button>
      ) : null}
      {stepIndex === otherDetailsIndex ? (
        <Button
          variant="contained"
          disabled={isSaving || !canSaveStep3}
          onClick={requiresPayment ? onNext : onSave}>
          {requiresPayment ? "Next" : isSaving ? "Saving..." : "Save"}
        </Button>
      ) : null}
      {requiresPayment && stepIndex === paymentIndex ? (
        <Button variant="contained" disabled={isSaving} onClick={onPay}>
          {isSaving ? "Paying..." : "Pay"}
        </Button>
      ) : null}
    </div>
  )
}
