"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import AddIcon from "@mui/icons-material/Add"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import {
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material"
import OrganizationLayout from "@/components/Organization/OrganizationLayout"
import PageHeader from "@/components/Organization/PageHeader"

export default function UserFormPage() {
  const router = useRouter()

  return (
    <OrganizationLayout>
      <PageHeader
        title="User Forms"
        subtitle="Generate dynamic user forms by defining the fields, validation requirements, and reusable metadata in one place."
        breadcrumbs={[
          { label: "Organization", href: true, id: "structure" },
          { label: "User Forms", href: false },
        ]}
        actions={[
          {
            label: "Create form",
            icon: <AddIcon />,
            variant: "contained",
            onClick: () => router.push("/organization/userForm/create"),
          },
        ]}
      />

      <Paper
        variant="outlined"
        sx={{
          p: { xs: 3, md: 5 },
          borderStyle: "dashed",
          borderColor: "divider",
          borderRadius: 3,
          bgcolor: "background.paper",
        }}>
        <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
          <Chip label="Form Generator" color="primary" size="small" />
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, fontFamily: "var(--font-outfit)" }}>
            Create and manage user forms
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 760 }}>
            Open the dedicated create page to define form fields, validation
            rules, and generate a reusable form payload.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push("/organization/userForm/create")}>
              Go to Create Form
            </Button>
            <Button variant="outlined" startIcon={<AutoAwesomeIcon />} disabled>
              Generated previews are available on the create page
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </OrganizationLayout>
  )
}
