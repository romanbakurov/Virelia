# Accessibility

Accessibility is part of the component contract. Vellira handles renderer-level
accessibility wiring where a component can do that reliably, while product code
keeps responsibility for context, copy, and user flow.

## What Vellira Handles

| Area     | Responsibility                                                                                     |
| -------- | -------------------------------------------------------------------------------------------------- |
| Labels   | Inputs, fields, selection controls, and grouped controls expose label APIs                         |
| State    | Disabled, required, invalid, checked, selected, and open states are represented in component props |
| Keyboard | Web tabs, menus, overlays, and selection controls use shared interaction logic where appropriate   |
| Focus    | Web overlays and dialogs keep focus management inside the renderer package                         |
| Errors   | Field-level error text is part of component composition                                            |

## What Product Code Owns

- Clear labels and button text.
- Validation timing and error messages.
- Focus target after submit, route changes, or destructive actions.
- Screen-reader announcements for product-specific async work.
- Real-device verification for React Native flows.

## Web Review Checklist

- Every form control has a visible label or intentional accessible name.
- Keyboard users can reach and operate each interactive element.
- Focus indicators are visible in light and dark themes.
- Dialogs can be closed with the expected actions.
- Error states include text, not color alone.

## Native Review Checklist

- Interactive elements have meaningful labels.
- Disabled state is visible and exposed through the component.
- Validation messages are readable in the screen context.
- Touch targets remain usable in dense layouts.
- Important flows are checked on real devices when possible.

## Related Pages

- [Web](/web)
- [Native](/native)
- [Component Gallery](/component-examples)
