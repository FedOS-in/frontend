"use client"

import * as React from "react"
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import FilterListIcon from "@mui/icons-material/FilterList"
import "./MembershipTypesToolbar.css"

export default function MembershipTypesToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  labels,
}) {
  return (
    <Box className="membership-types-toolbar">
      <OutlinedInput
        className="membership-types-toolbar__search"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={labels.searchPlaceholder}
        size="small"
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        }
      />

      <FormControl size="small" className="membership-types-toolbar__status">
        <InputLabel id="membership-types-status-filter-label">
          {labels.statusLabel}
        </InputLabel>
        <Select
          labelId="membership-types-status-filter-label"
          label={labels.statusLabel}
          value={statusFilter}
          onChange={(event) => onStatusChange(event.target.value)}>
          <MenuItem value="all">{labels.statusAll}</MenuItem>
          <MenuItem value="1">{labels.statusActive}</MenuItem>
          <MenuItem value="0">{labels.statusInactive}</MenuItem>
        </Select>
      </FormControl>

      <Button
        className="membership-types-toolbar__filters"
        variant="outlined"
        startIcon={<FilterListIcon />}
        disabled>
        {labels.filters}
      </Button>
    </Box>
  )
}
