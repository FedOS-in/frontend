"use client"

import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  Typography,
} from "@mui/material"

export default function UserFormDetailsModal({
  form,
  titleFallback,
  editLabel,
  closeLabel,
  onClose,
  onEdit,
}) {
  return (
    <Dialog open={Boolean(form)} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="user-form-modal__title">
        <span>{form?.name || titleFallback}</span>
        {form?.id ? (
          <IconButton
            className="user-form-modal__edit-button"
            aria-label={editLabel}
            onClick={() => onEdit(form.id)}>
            <EditOutlinedIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
      <DialogContent dividers>
        <List>
          {(form?.fields || []).map((field) => (
            <ListItem key={field.id}>
              <Typography variant="body2">
                {field.label} ({field.fieldType})
              </Typography>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{closeLabel}</Button>
      </DialogActions>
    </Dialog>
  )
}
