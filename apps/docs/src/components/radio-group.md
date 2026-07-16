# RadioGroup

RadioGroup presents a visible set of mutually exclusive choices. It is best
when users benefit from comparing every option before choosing one.

## When To Use

Use RadioGroup for short lists, usually two to five choices. Use Select when
the list is longer, the choice is secondary, or space is limited.

```tsx
<RadioGroup
  label='Billing interval'
  value={interval}
  onValueChange={setInterval}
  orientation='horizontal'
>
  <Radio value='monthly' label='Monthly' />
  <Radio value='yearly' label='Yearly' description='Save 20%.' />
</RadioGroup>
```

## Layout Guidance

| Layout | Use For |
| --- | --- |
| Vertical | Plan selection, settings, choices with descriptions. |
| Horizontal | Two or three short labels in compact forms. |
| Disabled group | Entire unavailable setting controlled by account or permission state. |
| Disabled item | A specific option that exists but cannot currently be selected. |

## Controlled State

Use controlled state when the selected value affects other fields, pricing, or
validation.

```tsx
const [plan, setPlan] = useState('pro');

<RadioGroup label='Plan' value={plan} onValueChange={setPlan}>
  <Radio value='starter' label='Starter' />
  <Radio value='pro' label='Pro' />
  <Radio value='enterprise' label='Enterprise' />
</RadioGroup>
```

## Real Example: Billing Interval

```tsx
import { Button, Radio, RadioGroup } from '@vellira-ui/react';
import { useState } from 'react';

export function BillingIntervalForm() {
  const [interval, setInterval] = useState('yearly');

  return (
    <form onSubmit={updateBilling}>
      <RadioGroup
        label='Billing interval'
        description='Choose how often this workspace is billed.'
        value={interval}
        onValueChange={setInterval}
        orientation='vertical'
      >
        <Radio value='monthly' label='Monthly' description='$29 per seat.' />
        <Radio
          value='yearly'
          label='Yearly'
          description='$290 per seat. Includes two months free.'
        />
      </RadioGroup>
      <Button type='submit'>Update billing</Button>
    </form>
  );
}
```

## Accessibility

- Provide a group label whenever the options are not self-explanatory.
- Use descriptions for options with meaningful tradeoffs.
- Do not hide all options behind a custom visual card without preserving radio
  semantics.
- Keep keyboard order the same as visual order.

## See Also

- [Select](/components/select) for compact or longer lists.
- [Checkbox](/components/checkbox) for independent boolean choices.
