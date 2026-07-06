"use client"
import React from "react"
import {
  Grid,
  Card,
  Typography,
  Stack,
  OutlinedInput,
  Select,
  MenuItem,
  Box,
  Button,
  Switch,
} from "@mui/material"

export default function CreatePositionForm() {
  return (
    <Grid container spacing={3}>
      {/* Left Form: Basic Information */}
      <Grid item xs={12} md={7}>
        <Card sx={{ bgcolor: "#FFFFFF", p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>
            Basic Information
          </Typography>

          <Stack spacing={3}>
            {/* Name & Short Code row */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "text.secondary", mb: 0.5 }}>
                  Position Name <span style={{ color: "red" }}>*</span>
                </Typography>
                <OutlinedInput
                  placeholder="e.g. President, Secretary"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "text.secondary", mb: 0.5 }}>
                  Short Code <span style={{ color: "red" }}>*</span>
                </Typography>
                <OutlinedInput placeholder="e.g. PRES, SEC" fullWidth />
              </Grid>
            </Grid>

            {/* Description */}
            <Box>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "text.secondary", mb: 0.5 }}>
                Description
              </Typography>
              <OutlinedInput
                placeholder="Enter a brief description of this position and its responsibilities"
                fullWidth
                multiline
                rows={3}
              />
            </Box>

            {/* Position Type */}
            <Box
              sx={{ border: "1px solid #DFE1E6", p: 2, borderRadius: "8px" }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
                Position Type *
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      border: "1px solid #0052CC",
                      bgcolor: "#DEEBFF",
                      p: 1.5,
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, color: "#0052CC" }}>
                      Single Seat
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
                      Only one member can hold this position at a time
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      border: "1px solid #DFE1E6",
                      p: 1.5,
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Multiple Seats
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
                      More than one member can hold this position
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </Card>

        {/* Scope Card */}
        <Card sx={{ bgcolor: "#FFFFFF", p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>
            Position Scope
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "text.secondary", mb: 0.5 }}>
                Applies To Level(s) <span style={{ color: "red" }}>*</span>
              </Typography>
              <Select value="state" fullWidth size="small">
                <MenuItem value="state">State Association</MenuItem>
                <MenuItem value="district">District Association</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "text.secondary", mb: 0.5 }}>
                Applicable To *
              </Typography>
              <Select value="all" fullWidth size="small">
                <MenuItem value="all">
                  All Organizations in Selected Level(s)
                </MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Card>
      </Grid>

      {/* Right Form: Term settings & configs */}
      <Grid item xs={12} md={5}>
        {/* Tenure Card */}
        <Card sx={{ bgcolor: "#FFFFFF", p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>
            Term & Tenure
          </Typography>

          <Stack spacing={2.5}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "text.secondary", mb: 0.5 }}>
                  Term Duration *
                </Typography>
                <OutlinedInput value="3" fullWidth />
              </Grid>
              <Grid item xs={4}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "text.secondary", mb: 0.5 }}>
                  Unit
                </Typography>
                <Select value="years" fullWidth size="small" sx={{ mt: 0.5 }}>
                  <MenuItem value="years">Years</MenuItem>
                  <MenuItem value="months">Months</MenuItem>
                </Select>
              </Grid>
            </Grid>

            <Box>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "text.secondary", mb: 0.5 }}>
                Maximum Consecutive Terms
              </Typography>
              <OutlinedInput value="2" fullWidth />
            </Box>
          </Stack>
        </Card>

        {/* Settings Toggle Options */}
        <Card sx={{ bgcolor: "#FFFFFF", p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>
            Position Settings
          </Typography>

          <Stack spacing={2}>
            {[
              { label: "Is this position mandatory?", val: true },
              { label: "Allow re-appointment after a gap?", val: true },
              { label: "Require active membership?", val: true },
              { label: "Visible in public directory?", val: false },
            ].map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                <Typography sx={{ fontWeight: 500, fontSize: "0.9rem" }}>
                  {item.label}
                </Typography>
                <Switch checked={item.val} color="primary" />
              </Box>
            ))}
          </Stack>
        </Card>

        {/* Order & Display Order */}
        <Card sx={{ bgcolor: "#FFFFFF", p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Display & Order
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: "text.secondary", mb: 0.5 }}>
            Display Order *
          </Typography>
          <OutlinedInput value="10" fullWidth />
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", mt: 1, display: "block" }}>
            Lower numbers appear first in lists.
          </Typography>
        </Card>
      </Grid>
    </Grid>
  )
}
