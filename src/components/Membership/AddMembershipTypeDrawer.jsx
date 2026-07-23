"use client"

import * as React from "react"
import {
  Alert,
  Box,
  Button,
  Drawer,
  Stack,
  Typography,
  Snackbar,
} from "@mui/material"
import { useOrganizationText } from "@/i18n/organizationLanguageStore"
import AddMembershipTypeFormFields from "./AddMembershipTypeFormFields"
import { useAddMembershipTypeDrawer } from "./useAddMembershipTypeDrawer"
import "./AddMembershipTypeDrawer.css"

export default function AddMembershipTypeDrawer({ open, onClose, onSaved }) {
  const text = useOrganizationText()
  const t = text.addMembershipTypeDrawer
  const {
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
  } = useAddMembershipTypeDrawer({ open, onClose, onSaved, t })

  return (
    <>
      <Drawer anchor="right" open={open} onClose={handleClose}>
        <Box className="add-membership-type-drawer">
          <Stack
            spacing={2.5}
            component="form"
            onSubmit={handleSubmit}
            className="add-membership-type-drawer__form">
            <Box>
              <Typography
                variant="h6"
                className="add-membership-type-drawer__title">
                {t.title}
              </Typography>
              <Typography
                variant="body2"
                className="add-membership-type-drawer__subtitle">
                {t.subtitle}
              </Typography>
            </Box>

            <AddMembershipTypeFormFields
              text={text}
              form={form}
              setForm={setForm}
              federationOptions={federationOptions}
              validityOptions={validityOptions}
              currencyOptions={currencyOptions}
              loadingLookups={loadingLookups}
            />

            {errorMessage ? (
              <Alert severity="error">{errorMessage}</Alert>
            ) : null}

            <Box className="add-membership-type-drawer__actions">
              <Button
                variant="outlined"
                onClick={handleClose}
                disabled={submitting}>
                {t.cancel}
              </Button>
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? t.creating : t.create}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Drawer>

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  )
}
