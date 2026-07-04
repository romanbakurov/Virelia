import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';
import { fn } from 'storybook/test';

import { Checkbox } from './index';

const meta = {
  title: 'Primitives/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Checkbox Component

Boolean form control for turning a single option on or off.

**Features**
- Controlled checked state
- Optional label
- Disabled checked and unchecked states
- Validation error message
- Change callback for form integration

### Usage

Use Checkbox for independent choices such as accepting terms, enabling settings, or selecting optional preferences.

Correct usage:

\`\`\`tsx
<Checkbox
  label='Accept terms'
  checked={accepted}
  onCheckedChange={setAccepted}
/>
\`\`\`
`,
      },
    },
  },
  args: {
    onCheckedChange: fn(),
  },
  argTypes: {
    label: {
      description: 'Text label displayed next to the checkbox.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    checked: {
      description: 'Current checked state.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    defaultChecked: {
      description: 'Initial checked state for uncontrolled usage.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      description: 'Disables user interaction.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onCheckedChange: {
      description: 'Called when checked state changes.',
      action: 'changed',
      table: {
        type: { summary: '(checked: boolean) => void' },
      },
    },
    error: {
      description: 'Validation error message displayed under the checkbox.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

type CheckboxStoryProps = ComponentProps<typeof Checkbox>;

const InteractiveCheckbox = (args: CheckboxStoryProps) => {
  const [checked, setChecked] = useState(args.checked ?? false);

  return <Checkbox {...args} checked={checked} onCheckedChange={setChecked} />;
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Checked: Story = {
  args: {
    label: 'Accept the terms',
    checked: true,
  },
};

export const Unchecked: Story = {
  args: {
    label: 'Accept the terms',
    checked: false,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Not available',
    disabled: true,
    checked: true,
  },
};

export const DisabledUnchecked: Story = {
  args: {
    label: 'Not available',
    disabled: true,
    checked: false,
  },
};

export const Interactive: Story = {
  args: {
    label: 'Receive email notifications',
    checked: false,
  },
  render: (args) => {
    return <InteractiveCheckbox {...args} />;
  },
};

export const Error: Story = {
  args: {
    label: 'Accept the terms',
    error: 'You must accept the terms',
    checked: false,
  },
};
