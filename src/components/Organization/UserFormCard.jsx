"use client"

import DeleteIcon from "@mui/icons-material/Delete"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined"
import { IconButton, List, ListItem, Paper, Typography } from "@mui/material"

function getDisplayedFields(fields = []) {
  if (!Array.isArray(fields)) return []
  const maxFields = 5
  const slicedFields = fields.slice(0, maxFields)
  if (fields.length > maxFields) {
    return [...slicedFields, { id: "etc", label: "etc" }]
  }
  return slicedFields
}

export default function UserFormCard({
  form,
  labels,
  onView,
  onEdit,
  onShare,
  onDelete,
}) {
  return (
    <Paper variant="outlined" className="user-form-card">
      <div className="user-form-card__head">
        <Typography variant="h6" className="user-form-card__title">
          {form.name}
        </Typography>
        <div className="user-form-card__menu" aria-label={labels.actionsLabel}>
          <IconButton
            className="user-form-card__menu-trigger"
            aria-label={labels.openActions}>
            <MoreVertIcon />
          </IconButton>
          <div className="user-form-card__menu-dropdown">
            <button
              type="button"
              className="user-form-card__menu-item user-form-card__menu-item--view"
              onClick={() => onView(form)}>
              <VisibilityOutlinedIcon /> {labels.view}
            </button>
            <button
              type="button"
              className="user-form-card__menu-item user-form-card__menu-item--edit"
              onClick={() => onEdit(form)}>
              <EditOutlinedIcon /> {labels.edit}
            </button>
            <button
              type="button"
              className="user-form-card__menu-item user-form-card__menu-item--share"
              onClick={() => onShare(form)}>
              <ContentCopyIcon /> {labels.inviteUsers}
            </button>
            <button
              type="button"
              className="user-form-card__menu-item user-form-card__menu-item--delete"
              onClick={() => onDelete(form.id)}>
              <DeleteIcon /> {labels.delete}
            </button>
          </div>
        </div>
      </div>

      <List className="user-form-card__fields">
        {getDisplayedFields(form.fields).map((field, index) => (
          <ListItem
            key={field.id || `${form.id}-${index}`}
            className="user-form-card__field-item">
            <Typography variant="body2" className="user-form-card__field-text">
              {field.label}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}
