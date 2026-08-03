---
title: React UI Components
description: Browse Vellira's accessible React and React Native UI components, including Button, Input, Modal, Select, Checkbox, Tabs, Tooltip, and more.
---

# Components

Vellira components are documented as product-ready building blocks: when to use
them, how to compose them, what accessibility contract they expect, and where
web and native behavior intentionally differ.

Use these pages for implementation decisions. Use the generated API references
for the full prop tables:

- [Web API](https://github.com/vellira-dev/vellira/blob/main/packages/react/API.md)
- [Native API](https://github.com/vellira-dev/vellira/blob/main/packages/react-native/API.md)

<StorybookFrame
  story="overview.web"
  title="Live component overview"
  :height="760"
/>

<div class="docs-card-grid docs-card-grid-three">
  <a class="docs-card" href="/components/button">
    <strong>Button</strong>
    <span>Primary actions, links, loading, icons, danger actions, and command patterns.</span>
  </a>
  <a class="docs-card" href="/components/input">
    <strong>Input</strong>
    <span>Text entry with labels, helper text, validation, clear actions, and adornments.</span>
  </a>
  <a class="docs-card" href="/components/checkbox">
    <strong>Checkbox</strong>
    <span>Independent boolean choices, agreement rows, mixed state, and settings toggles.</span>
  </a>
  <a class="docs-card" href="/components/radio-group">
    <strong>RadioGroup</strong>
    <span>Visible single-choice selection when comparison matters.</span>
  </a>
  <a class="docs-card" href="/components/select">
    <strong>Select</strong>
    <span>Compact single-value fields with controlled and uncontrolled state.</span>
  </a>
  <a class="docs-card" href="/components/form-field">
    <strong>FormField</strong>
    <span>Consistent label, description, error, required, and disabled layout.</span>
  </a>
  <a class="docs-card" href="/components/dropdown">
    <strong>Dropdown</strong>
    <span>Contextual action menus with groups, separators, danger items, and shortcuts.</span>
  </a>
  <a class="docs-card" href="/components/tabs">
    <strong>Tabs</strong>
    <span>Dense section navigation with keyboard support and controlled state.</span>
  </a>
  <a class="docs-card" href="/components/tooltip">
    <strong>Tooltip</strong>
    <span>Short, non-critical helper text around focused or hovered controls.</span>
  </a>
  <a class="docs-card" href="/components/modal">
    <strong>Modal</strong>
    <span>Focused decisions, destructive confirmations, and blocking workflows.</span>
  </a>
  <a class="docs-card" href="/components/theme-provider">
    <strong>ThemeProvider</strong>
    <span>Controlled and uncontrolled theme state for light, dark, and high contrast modes.</span>
  </a>
</div>

## Component Standards

Every component should satisfy the same baseline before it is considered
production-ready.

| Standard                | Expectation                                                                                                           |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Accessible by default   | Visible labels are preferred. Icon-only or custom trigger controls must provide an explicit accessible name.          |
| Token driven            | Visual states come from Vellira tokens, not local one-off colors.                                                     |
| Controlled where needed | Form and overlay state can be owned by the app when business logic requires it.                                       |
| Native semantics        | Web uses DOM and ARIA semantics. Native uses React Native roles, labels, hints, and touch behavior.                   |
| Stable layout           | Loading, validation, and helper content should avoid surprising layout jumps in dense product UI.                     |
| Composition first       | Components expose slots for icons, helper text, trigger content, and compound sections instead of hard-coded layouts. |

## Choosing Components

| Need                                             | Use                                   |
| ------------------------------------------------ | ------------------------------------- |
| Submit, save, delete, navigate, or run a command | [Button](/components/button)          |
| Enter short free-form text                       | [Input](/components/input)            |
| Toggle an independent option                     | [Checkbox](/components/checkbox)      |
| Choose one option from a visible short list      | [RadioGroup](/components/radio-group) |
| Choose one option from a compact list            | [Select](/components/select)          |
| Open contextual actions                          | [Dropdown](/components/dropdown)      |
| Move between peer sections                       | [Tabs](/components/tabs)              |
| Explain an icon or terse label                   | [Tooltip](/components/tooltip)        |
| Require a focused decision                       | [Modal](/components/modal)            |
