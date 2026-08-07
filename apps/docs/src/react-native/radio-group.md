---
title: React Native RadioGroup
description: Build visible single-selection groups with Vellira RadioGroup and Radio using controlled state, orientation, validation, colors, and native accessibility.
---

# RadioGroup

RadioGroup presents a visible set of mutually exclusive choices.

Use it when there are only a few options and keeping all choices visible helps comparison.

## Basic Usage

```tsx
import { Radio, RadioGroup } from '@vellira-ui/react-native';

<RadioGroup label='Plan' defaultValue='basic' orientation='vertical'>
  <Radio value='basic' label='Basic' />
  <Radio value='pro' label='Pro' />
</RadioGroup>;
```

## Controlled Usage

```tsx
<RadioGroup
  label='Billing interval'
  value={interval}
  onValueChange={setInterval}
>
  <Radio value='monthly' label='Monthly' />
  <Radio value='yearly' label='Yearly' description='Save 20%' />
</RadioGroup>
```

## Orientation

```tsx
<RadioGroup orientation='horizontal' defaultValue='grid'>
  <Radio value='grid' label='Grid' />
  <Radio value='list' label='List' />
</RadioGroup>
```

Use horizontal orientation only when labels remain readable at common phone widths.

## Group State

```tsx
<RadioGroup
  label='Environment'
  description='Controls the active API target.'
  required
  disabled={isLocked}
  error={environmentError}
  size='md'
  color='primary'
>
  <Radio value='production' label='Production' />
  <Radio value='staging' label='Staging' />
</RadioGroup>
```

Group `color` and `size` provide defaults for child radios. An individual Radio may override the color.

## Custom Indicator

```tsx
<Radio value='recommended' label='Recommended' icon={<CustomSelectedIcon />} />
```

Use a custom icon only when the default selected dot does not fit the product language.

## Standalone Radio

Radio can be controlled directly, but use RadioGroup for normal mutually exclusive forms.

```tsx
<Radio
  value='pro'
  checked={selected}
  onCheckedChange={setSelected}
  label='Pro'
/>
```

## Accessibility

- Provide a group label whenever possible.
- Use description for persistent context.
- Error messages should explain how to fix the selection.
- Disabled group state should match the visual and interaction state of every child.
- Verify navigation and selected-state announcements with VoiceOver and TalkBack.

## See Also

- [Select](/react-native/select)
- [Checkbox](/react-native/checkbox)
