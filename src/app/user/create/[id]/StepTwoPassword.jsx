import { Alert, TextField, Typography } from "@mui/material"

export default function StepTwoPassword({
  password,
  confirmPassword,
  passwordStrong,
  onChange,
}) {
  return (
    <>
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(event) => onChange("password", event.target.value)}
        fullWidth
        required
      />
      <TextField
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(event) => onChange("confirmPassword", event.target.value)}
        fullWidth
        required
      />
      <Typography variant="caption" className="user-create-page__hint">
        Password must be at least 8 characters and include upper, lower, number,
        and special character.
      </Typography>
      {!passwordStrong && password ? (
        <Alert severity="warning">Password is not strong enough.</Alert>
      ) : null}
      {confirmPassword && password !== confirmPassword ? (
        <Alert severity="error">Passwords do not match.</Alert>
      ) : null}
    </>
  )
}
