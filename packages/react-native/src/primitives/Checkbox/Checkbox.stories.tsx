import type { Meta, StoryObj } from '@storybook/react-native';
import { Checkbox } from '@vellira-ui/react-native';
import { fn } from 'storybook/test';

const meta: Meta<typeof Checkbox> = {
  title: 'Primitives/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Checkbox Component

Native boolean control with an optional label.

**Features**
- Controlled and uncontrolled state
- Optional label
- Error state
- Disabled state
- Accessible checkbox semantics

### Usage

Use Checkbox for a single on/off choice in forms, preferences, and settings screens.

\`\`\`tsx
<Checkbox
  label="Accept terms"
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
      description: 'Checkbox label.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },

    checked: {
      description: 'Controlled checked state.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
      },
    },

    defaultChecked: {
      description: 'Initial checked state.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    disabled: {
      description: 'Disables interaction.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    error: {
      description: 'Validation error message.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },

    onCheckedChange: {
      description: 'Called when checked state changes.',
      action: 'changed',
      table: {
        type: { summary: '(checked: boolean) => void' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: 'Accept terms',
  },
};

export const Checked: Story = {
  args: {
    label: 'Checked',
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Disabled checked',
    disabled: true,
    defaultChecked: true,
  },
};

export const Error: Story = {
  args: {
    label: 'Accept terms',
    error: 'You must accept the terms',
  },
};
