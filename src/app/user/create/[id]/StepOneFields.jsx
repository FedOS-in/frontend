import { TextField } from "@mui/material"

export default function StepOneFields({ staticFields, onChange }) {
  return (
    <>
      <TextField
        label="Name"
        value={staticFields.name}
        onChange={(event) => onChange("name", event.target.value)}
        fullWidth
        required
      />
      <TextField
        label="Email"
        type="email"
        value={staticFields.email}
        onChange={(event) => onChange("email", event.target.value)}
        fullWidth
        required
      />
      <div className="user-create-page__phone-row">
        <TextField
          label="Country code"
          value={staticFields.countryCode}
          fullWidth
          disabled
        />
        <TextField
          label="Phone number"
          type="tel"
          value={staticFields.phoneNumber}
          onChange={(event) => onChange("phoneNumber", event.target.value)}
          fullWidth
          required
        />
      </div>
      <TextField
        label="Address Line 1"
        value={staticFields.addressLine1}
        onChange={(event) => onChange("addressLine1", event.target.value)}
        fullWidth
        required
      />
      <TextField
        label="Address Line 2"
        value={staticFields.addressLine2}
        onChange={(event) => onChange("addressLine2", event.target.value)}
        fullWidth
      />
      <div className="user-create-page__address-row">
        <TextField
          label="City"
          value={staticFields.city}
          onChange={(event) => onChange("city", event.target.value)}
          fullWidth
          required
        />
        <TextField
          label="State"
          value={staticFields.state}
          onChange={(event) => onChange("state", event.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Pincode"
          value={staticFields.pincode}
          onChange={(event) => onChange("pincode", event.target.value)}
          fullWidth
          required
        />
      </div>
    </>
  )
}
