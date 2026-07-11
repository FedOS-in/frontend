import { Box, Typography } from "@mui/material"

export default function Home() {
  return (
    <Box sx={{ p: { xs: 3, md: 4 } }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, fontFamily: "var(--font-outfit)" }}>
        Dashboard
      </Typography>
    </Box>
  )
}
