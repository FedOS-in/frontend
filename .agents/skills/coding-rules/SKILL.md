---
name: coding-rules
description: Coding guidelines for FedOS, including page/component line limits (max 200 lines), DRY/KISS, separate stylesheet requirements, and BEM CSS model.
---

# FedOS Coding Rules and Guidelines

All code written by coding assistants must strictly adhere to the following architectural guidelines:

## 1. File Length Limits
- **Pages & Components (JS/JSX)**: Must **NOT** exceed **200 lines** per file.
- If a file crosses this limit, you must refactor and split it into smaller, isolated components.
- **CSS Stylesheets**: Excluded from this limit. They have no line number exceptions.

## 2. Code Quality & Reuse
- **KISS (Keep It Simple, Stupid)**: Keep implementation simple, clear, and direct.
- **DRY (Don't Repeat Yourself)**:
  - Before creating any new component, verify if an existing component can be reused or extended.
  - If any logic (such as calculations, helpers, or hooks) is duplicated or shared, extract it to the `src/utils/` folder and reuse it.

## 3. Styling & Custom CSS
- **No Inline Styles**: Do **NOT** use inline styling (`style={{ ... }}`) on React components.
- **Separate Stylesheets**: Write custom styles in a separate CSS file named exactly after the component or page (e.g. `MyComponent.css` or `page.css`).
- **BEM Model**: Use BEM (Block-Element-Modifier) naming conventions for all classes in custom CSS files (e.g., `.button`, `.button__icon`, `.button--primary`).

## 4. MUI Prop Safety
- Prefer modern MUI layout primitives such as `Box` with CSS grid/flex over legacy `Grid item` and prop-heavy wrapper patterns when they cause React prop-forwarding warnings.
- For `Autocomplete` + `TextField`, do **not** blindly spread render params into the field if that forwards `InputProps` or similar legacy props to DOM nodes.
- When using `Autocomplete.renderInput`, always preserve the generated input ref from `params.slotProps.input.ref` and the html input props from `params.slotProps.htmlInput`.
- If the options list can be empty, provide an explicit empty state (`noOptionsText` and safe null handling) instead of assuming a selected value or non-empty list.
- Prefer the official `renderInput={(params) => <TextField {...params} />}` pattern unless you have a documented reason to override the slot props.
- If you do override `Autocomplete.renderInput`, keep the `params.slotProps` shape intact and avoid reconstructing the input ref by hand.
- Prefer `slotProps` and explicit prop mapping over passing large prop objects through multiple components.
- If a component starts emitting console warnings about unknown DOM props, stop and refactor the prop boundary instead of repeating the same pattern in new components.
