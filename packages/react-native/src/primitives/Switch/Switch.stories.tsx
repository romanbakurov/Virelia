import type { Meta, StoryObj } from '@storybook/react-native';

import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Primitives/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        // language=Markdown
        component: `
### Switch Component

Describe when to use Switch and what problem it solves.

**Features**
- Add the main supported states
- Document important behavior
- Mention platform-specific details when needed

### Usage

Replace this section with a real example before publishing the component.
`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    defaultChecked: false,
  },
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Controlled: Story = {
  args: {
    checked: true,
    onCheckedChange: () => undefined,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Required: Story = {
  args: {
    required: true,
  },
};

export const Invalid: Story = {
  args: {
    invalid: true,
  },
};
