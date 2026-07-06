"use client"
import * as React from "react"

export default function SidebarMenuItem({
  icon: IconComponent,
  label,
  isActive,
  onClick,
  sidebarCollapsed,
  hasSubmenu,
  isSubmenuOpen,
}) {
  return (
    <div
      onClick={onClick}
      className={`sidebar__menu-item ${isActive ? "sidebar__menu-item--active" : ""}`}>
      <div className="sidebar__menu-content">
        <IconComponent className="sidebar__menu-icon" />
        {!sidebarCollapsed && (
          <span className="sidebar__menu-text">{label}</span>
        )}
      </div>
      {!sidebarCollapsed && hasSubmenu && (
        <>
          {isSubmenuOpen ? (
            <div style={{ fontSize: "1.1rem" }}>−</div>
          ) : (
            <div style={{ fontSize: "1.1rem" }}>+</div>
          )}
        </>
      )}
    </div>
  )
}
