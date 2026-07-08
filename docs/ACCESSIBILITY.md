# Accessibility

Accessibility is part of the component contract. A Vellira component is not
complete until it can be used with keyboard, screen readers, disabled states,
and meaningful labels.

## Principles

- Prefer native semantics before ARIA.
- Keep accessible names stable and meaningful.
- Disabled components must block interaction and expose disabled state.
- Focus must be visible for keyboard users.
- Validation messages must be connected to the relevant field.
- Loading states must not allow duplicate actions.
- Renderer APIs should use platform-native accessibility conventions.

## Web Components

Web components should use semantic HTML whenever possible.

Use:

- `button` for actions;
- `input` for text entry;
- `fieldset`/group semantics where appropriate;
- `aria-label` for icon-only actions;
- `aria-labelledby` when visible text labels an element;
- `aria-describedby` for descriptions and error messages;
- `aria-invalid` for invalid form fields;
- `aria-busy` for loading actions.

Avoid adding ARIA roles that duplicate native semantics unless the component is
not backed by a native element.

### Web Button

Web Button uses native button semantics and defaults to `type="button"`.

```tsx
<Button onClick={save}>Save</Button>
<Button aria-label='Search' iconOnly leftIcon={<Search />} />
```

Icon-only web buttons must use the standard `aria-label` attribute. There is no
camelCase accessible-label alias.

## React Native Components

React Native components should use React Native accessibility props.

Use:

- `accessibilityRole`;
- `accessibilityState`;
- `accessibilityLabel` when visible content is absent or ambiguous;
- `accessibilityHint` when the result of an action is not obvious.

### Native Button

Native Button maps to `Pressable`.

```tsx
<Button onPress={save}>Save</Button>
<Button accessibilityLabel='Search' iconOnly leftIcon={<Search />} />
```

Icon-only native buttons must use `accessibilityLabel`.

## Focus

Focus should add an outline, ring, or border treatment without changing the
meaning of the component state.

For buttons, the recommended layering is:

```text
default
hover      → background/state color
pressed    → background/state color
focus      → ring over the current state
disabled   → no interaction
```

Focus must not erase hover or pressed state.

## Icon-Only Actions

Icon-only actions must expose an accessible name.

Good:

```tsx
<Button aria-label='Search' iconOnly leftIcon={<Search />} />
<Button accessibilityLabel='Search' iconOnly leftIcon={<Search />} />
```

Bad:

```tsx
<Button iconOnly leftIcon={<Search />} />
```

Development warnings should catch missing accessible names when possible.

## Tests

Accessibility-relevant behavior should be tested.

Web tests should cover:

- labels and ARIA attributes;
- disabled behavior;
- keyboard or click behavior;
- loading interaction guards;
- axe checks for representative output.

Native tests should cover:

- `accessibilityRole`;
- `accessibilityState`;
- `accessibilityLabel`;
- disabled and loading interaction guards;
- focus and hover state where the mock supports them.

## Documentation

Every component API page should document:

- the accessible naming strategy;
- required props for icon-only usage;
- disabled and loading behavior;
- renderer-specific differences between web and native.
