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
import "./MembershipTypesPagination.css"

export default function MembershipTypesPagination({
  startIndex,
  endIndex,
  totalFiltered,
  page,
  totalPages,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  labels,
}) {
  const showingStart = totalFiltered === 0 ? 0 : startIndex + 1

  return (
    <Box className="membership-types-pagination">
      <Typography className="membership-types-pagination__summary">
        {labels.showing
          .replace("{from}", String(showingStart))
          .replace("{to}", String(endIndex))
          .replace("{total}", String(totalFiltered))}
      </Typography>

      <Box className="membership-types-pagination__controls">
        <IconButton
          size="small"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="previous page">
          <ChevronLeftIcon fontSize="small" />
        </IconButton>
        <Typography className="membership-types-pagination__page">
          {page}
        </Typography>
        <IconButton
          size="small"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="next page">
          <ChevronRightIcon fontSize="small" />
        </IconButton>

        <FormControl
          size="small"
          className="membership-types-pagination__rows">
          <Select
            value={rowsPerPage}
            onChange={(event) =>
              onRowsPerPageChange(Number(event.target.value))
            }>
            {[10, 25, 50].map((size) => (
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
