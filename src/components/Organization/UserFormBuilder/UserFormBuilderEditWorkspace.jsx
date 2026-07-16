"use client"

import Alert from "@mui/material/Alert"
import Button from "@mui/material/Button"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import UserFormBuilderForm from "./UserFormBuilderForm"
import UserFormFieldsList from "./UserFormFieldsList"
import { useUserFormEditor } from "./useUserFormEditor"
import { useOrganizationText } from "@/i18n/organizationLanguageStore"
import "./UserFormBuilderWorkspace.css"

export default function UserFormBuilderEditWorkspace({ initialForm, onCancel }) {
  const text = useOrganizationText()
  const state = useUserFormEditor({ initialForm, onCancel })

  return (
    <div className="user-form-builder-workspace">
      <div className="user-form-builder-workspace__main">
        <UserFormBuilderForm
          chapterOptions={state.chapterOptions}
          fieldDraft={state.fieldDraft}
          formName={state.formName}
          isEditing={state.isEditing}
          loadingChapters={state.loadingChapters}
          onCancelEdit={state.onCancelEdit}
          onCancel={onCancel}
          onChapterChange={state.onChapterChange}
          onDraftChange={state.onDraftChange}
          onFieldKeyChange={state.onFieldKeyChange}
          onFormNameChange={state.onFormNameChange}
          onPaymentPeriodChange={state.onPaymentPeriodChange}
          onSubmitField={state.onSubmitField}
          onSubscriptionAmountChange={state.onSubscriptionAmountChange}
          paymentPeriod={state.paymentPeriod}
          selectedChapter={state.selectedChapter}
          subscriptionAmount={state.subscriptionAmount}
        />
        {state.errorMessage ? <Alert severity="error">{state.errorMessage}</Alert> : null}
        {state.successMessage ? <Alert severity="success">{state.successMessage}</Alert> : null}
      </div>

      <div className="user-form-builder-workspace__sidebar">
        <UserFormFieldsList
          fields={state.fields}
          onEditField={state.onEditField}
          onReorderFields={state.onReorderFields}
          onRemoveField={state.onRemoveField}
        />
      </div>

      <div className="user-form-builder-workspace__footer-actions">
        <Button
          variant="contained"
          endIcon={<EditOutlinedIcon />}
          onClick={state.onUpdateForm}
          disabled={state.isSubmittingForm}>
          {state.isSubmittingForm ? text.userFormBuilder.updatingForm : text.userFormBuilder.updateForm}
        </Button>
      </div>
    </div>
  )
}
