---
title: Accessibility – React & React Native
description: Learn how Vellira builds accessible React and React Native components with keyboard navigation, focus management, ARIA support, and WCAG-conscious design.
---

# Accessibility

Accessibility is a core part of Vellira's component API.

The library provides accessible defaults wherever the renderer can guarantee
consistent behavior. Application code remains responsible for product-specific
content, workflows, and user experience.

## Principles

Vellira follows these principles across supported platforms:

- Accessible by default.
- Keyboard-first interactions on the web.
- Semantic APIs over implementation details.
- Consistent behavior across components.
- WCAG-conscious component design.

## What Vellira Handles

| Area      | Responsibility                                                                                                 |
| --------- | -------------------------------------------------------------------------------------------------------------- |
| Labels    | Inputs, fields, selection controls, and grouped controls expose accessible labeling APIs                       |
| State     | Disabled, required, invalid, checked, selected, expanded, and open states are reflected through component APIs |
| Keyboard  | Menus, tabs, dialogs, dropdowns, and selection controls support expected keyboard interaction                  |
| Focus     | Dialogs, overlays, and other focus-managed components restore and trap focus where appropriate                 |
| Errors    | Components expose APIs for associating validation text with form controls                                      |
| Semantics | Components render appropriate roles and accessibility attributes whenever possible                             |

Checkbox supports visible labels, helper descriptions, required and error text,
controlled and uncontrolled checked state, and mixed selection through
`indeterminate`. Use `aria-label` on web or `accessibilityLabel` on native when a
checkbox row has no visible label.

## What Product Code Owns

- Writing meaningful labels and button text.
- Validation logic and error messaging.
- Focus management after navigation or business workflows.
- Screen reader announcements for asynchronous operations.
- Color contrast of custom themes.
- Testing important user journeys on real devices.

## Web Review Checklist

- Every interactive element has an accessible name.
- Every form control has an associated label.
- Keyboard users can complete every workflow.
- Focus indicators remain visible.
- Dialogs trap focus and restore it on close.
- Interactive controls can be operated without a mouse.
- Errors are communicated with text, not color alone.

## Native Review Checklist

- Interactive elements expose meaningful accessibility labels.
- Accessibility roles and states are correctly announced.
- Disabled controls are visually and programmatically disabled.
- Validation messages are understandable in context.
- Touch targets remain comfortable on mobile devices.
- Critical flows are verified with VoiceOver and TalkBack when possible.

## Standards

Vellira aims to align with:

- WCAG 2.2 AA
- WAI-ARIA Authoring Practices
- React Accessibility recommendations
- React Native Accessibility APIs

## Related Pages

- [Web](/react/)
- [Native](/react-native/)
- [Component Gallery](/start/component-overview)
