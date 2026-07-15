"use client"

import * as React from "react"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined"
import { Chip, IconButton, Paper, Typography } from "@mui/material"
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"
import { useOrganizationText } from "@/i18n/organizationLanguageStore"
import "./UserFormFieldsList.css"

export default function UserFormFieldsList({
  fields,
  onEditField,
  onReorderFields,
  onRemoveField,
}) {
  const text = useOrganizationText()
  const [draggedFieldId, setDraggedFieldId] = React.useState(null)
  const [dropTargetFieldId, setDropTargetFieldId] = React.useState(null)

  const clearDragState = () => {
    setDraggedFieldId(null)
    setDropTargetFieldId(null)
  }

  const handleDragStart = (event, fieldId) => {
    setDraggedFieldId(fieldId)
    event.dataTransfer.effectAllowed = "move"
    event.dataTransfer.setData("text/plain", fieldId)
  }

  const handleDragOver = (event, fieldId) => {
    if (!draggedFieldId || draggedFieldId === fieldId) {
      return
    }

    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
    setDropTargetFieldId(fieldId)
  }

  const handleDrop = (event, targetFieldId) => {
    event.preventDefault()
    const sourceFieldId =
      event.dataTransfer.getData("text/plain") || draggedFieldId

    if (!sourceFieldId || sourceFieldId === targetFieldId) {
      clearDragState()
      return
    }

    onReorderFields?.(sourceFieldId, targetFieldId)
    clearDragState()
  }

  return (
    <Paper variant="outlined" className="user-form-fields-list">
      <div className="user-form-fields-list__header">
        <Typography variant="h6" className="user-form-fields-list__title">
          {text.userFormFieldsList.title}
        </Typography>
        <Chip label={`${fields.length} ${text.userFormFieldsList.countSuffix}`} size="small" color="primary" />
      </div>

      {fields.length === 0 ? (
        <div className="user-form-fields-list__empty">
          <Typography className="user-form-fields-list__empty-title">
            {text.userFormFieldsList.emptyTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {text.userFormFieldsList.emptyText}
          </Typography>
        </div>
      ) : (
        <div className="user-form-fields-list__items">
          {fields.map((field) => {
            const isDragging = draggedFieldId === field.id
            const isDropTarget = dropTargetFieldId === field.id

            return (
              <div
                key={field.id}
                className={`user-form-fields-list__item${isDragging ? " user-form-fields-list__item--dragging" : ""}${isDropTarget ? " user-form-fields-list__item--drop-target" : ""}`}
                draggable
                onDragStart={(event) => handleDragStart(event, field.id)}
                onDragOver={(event) => handleDragOver(event, field.id)}
                onDrop={(event) => handleDrop(event, field.id)}
                onDragEnd={clearDragState}>
                <div className="user-form-fields-list__item-main">
                  <div>
                    <Typography className="user-form-fields-list__label">
                      {field.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {field.fieldKey}
                    </Typography>
                  </div>

                  <div className="user-form-fields-list__actions">
                    <IconButton
                      aria-label={`${text.userFormFieldsList.editAriaPrefix} ${field.label}`}
                      onClick={() => onEditField(field.id)}>
                      <EditOutlinedIcon />
                    </IconButton>
                    <IconButton
                      aria-label={`${text.userFormFieldsList.removeAriaPrefix} ${field.label}`}
                      onClick={() => onRemoveField(field.id)}>
                      <DeleteOutlineIcon />
                    </IconButton>
                    <IconButton aria-label={`${text.userFormFieldsList.dragAriaPrefix} ${field.label}`}>
                      <DragIndicatorIcon />
                    </IconButton>
                  </div>
                </div>

                <div className="user-form-fields-list__chips">
                  <Chip label={field.fieldTypeLabel} size="small" />
                  {field.isRequired && (
                    <Chip label={text.userFormFieldsList.required} size="small" color="primary" />
                  )}
                  {field.options.map((option) => (
                    <Chip
                      key={`${field.id}-${option}`}
                      label={option}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Paper>
  )
}
