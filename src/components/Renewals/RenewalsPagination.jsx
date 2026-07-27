"use client"

import * as React from "react"
import {
  Box,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import "./RenewalsPagination.css"

export default function RenewalsPagination({
  startIndex,
  endIndex,
  total,
  page,
  totalPages,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  labels,
}) {
  const showingStart = total === 0 ? 0 : startIndex + 1

  return (
    <Box className="renewals-pagination">
      <Typography className="renewals-pagination__summary">
        {labels.showing
          .replace("{from}", String(showingStart))
          .replace("{to}", String(endIndex))
          .replace("{total}", String(total))}
      </Typography>

      <Box className="renewals-pagination__controls">
        <IconButton
          size="small"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="previous page">
          <ChevronLeftIcon fontSize="small" />
        </IconButton>
        <Typography className="renewals-pagination__page">{page}</Typography>
        <IconButton
          size="small"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="next page">
          <ChevronRightIcon fontSize="small" />
        </IconButton>

        <FormControl size="small" className="renewals-pagination__rows">
          <Select
            value={rowsPerPage}
            onChange={(event) =>
              onRowsPerPageChange(Number(event.target.value))
            }>
            {[10, 20, 50].map((size) => (
              <MenuItem key={size} value={size}>
                {labels.perPage.replace("{count}", String(size))}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  )
}
