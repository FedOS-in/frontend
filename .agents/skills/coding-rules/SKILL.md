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
