export const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

export function isStrongPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password)
}

export function getCreateSteps(requiresPayment) {
  return requiresPayment
    ? ["Basic details", "Set password", "Other details", "Payment", "Success"]
    : ["Basic details", "Set password", "Other details", "Success"]
}

export function areRequiredDynamicFieldsFilled(fields, values) {
  return fields.every((field) => {
    if (!field.isRequired) return true
    const key = field.fieldKey || field.id
    const value = values[key]
    return Array.isArray(value) ? value.length > 0 : Boolean(value)
  })
}

export const INITIAL_STATIC_FIELDS = {
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
}
