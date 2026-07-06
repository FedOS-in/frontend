<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# FedOS Coding Rules and Guidelines

## Coding Constraints
- **Line Limit**: JS/JSX page or component files must **NOT** exceed **200 lines**. If they cross this limit, refactor and split them into smaller sub-components.
- **Exceptions**: CSS stylesheets are exempt from the 200-line limit.

## Code Reuse & Architecture
- **DRY & KISS**: Prioritize simple, clean code. Do not repeat code.
- **Reusability**: Search the codebase for existing reusable components before building new ones.
- **Utils**: Move repeated helper functions, calculations, or hooks into the `src/utils/` folder and export them.

## Styling & Layout
- **No Inline Styles**: Avoid inline style definitions (`style={{ ... }}`).
- **Separate Styles**: Create a separate CSS stylesheet named after the component or page (e.g. `MyComponent.css`) for all custom styles.
- **BEM Convention**: Use the Block-Element-Modifier (BEM) class naming model for all custom CSS classes.
