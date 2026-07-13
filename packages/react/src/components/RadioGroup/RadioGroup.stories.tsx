import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Radio } from '../../primitives/Radio';

import { RadioGroup } from './index';

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### RadioGroup Component

Groups multiple Radio controls and manages selection of exactly one value.

**Features**
- Controlled and uncontrolled usage
- Composition with standalone Radio controls
- Group label and description
- Vertical and horizontal orientation
- Required and disabled group states
- Disabled individual Radio controls
- Validation error message
- Shared native input name
- Accessible \`radiogroup\` semantics

### Usage

\`\`\`tsx
<RadioGroup
  name='country'
  label='Country'
  description='Choose your country of residence.'
  value={country}
  onValueChange={setCountry}
>
  <Radio value='fr' label='France' />
  <Radio value='es' label='Spain' />
  <Radio value='de' label='Germany' />
</RadioGroup>
\`\`\`
`,
      },
    },
  },
  args: {
    name: 'country',
    label: 'Country',
    orientation: 'vertical',
    disabled: false,
    required: false,
    onValueChange: fn(),
  },
  argTypes: {
    label: {
      description: 'Content displayed as the group label.',
      control: 'text',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    description: {
      description: 'Supporting text displayed below the group label.',
      control: 'text',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    name: {
      description:
        'Native input name shared by all Radio controls in the group.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    value: {
      description: 'Current selected value for controlled usage.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    defaultValue: {
      description: 'Initial selected value for uncontrolled usage.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    orientation: {
      description: 'Layout direction of the Radio controls.',
      control: 'radio',
      options: ['vertical', 'horizontal'],
      table: {
        type: { summary: `'vertical' | 'horizontal'` },
        defaultValue: { summary: 'vertical' },
      },
    },
    size: {
      description: 'Default size applied to Radio controls in the group.',
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      table: {
        type: { summary: `'sm' | 'md' | 'lg'` },
        defaultValue: { summary: 'md' },
      },
    },
    required: {
      description: 'Marks the radio group as required.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      description: 'Disables every Radio control in the group.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    error: {
      description: 'Validation error displayed below the group.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    className: {
      description: 'Class name applied to the RadioGroup root.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    onValueChange: {
      description: 'Called when the selected value changes.',
      action: 'changed',
      table: {
        type: { summary: '(value: string) => void' },
      },
    },
    children: {
      control: false,
      description: 'Radio controls rendered inside the group.',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;
type RadioGroupStoryProps = ComponentProps<typeof RadioGroup>;

const sectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  minWidth: 0,
  maxWidth: 760,
  padding: 20,
  border: '1px solid var(--border-muted)',
  borderRadius: 'var(--radius-xl)',
  background: 'var(--surface-subtle)',
} satisfies CSSProperties;

const subtitleStyle = {
  margin: 0,
  color: 'var(--text-secondary)',
  fontSize: 13,
  fontWeight: 600,
} satisfies CSSProperties;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={sectionStyle}>
      <h3 style={subtitleStyle}>{title}</h3>
      {children}
    </section>
  );
}

function CountryRadios({ disableSpain = false }: { disableSpain?: boolean }) {
  return (
    <>
      <Radio value='fr' label='France' />
      <Radio value='es' label='Spain' disabled={disableSpain} />
      <Radio value='de' label='Germany' />
    </>
  );
}

const ControlledRadioGroup = (args: RadioGroupStoryProps) => {
  const [value, setValue] = useState(args.value ?? args.defaultValue ?? '');

  useEffect(() => {
    setValue(args.value ?? args.defaultValue ?? '');
  }, [args.value, args.defaultValue]);

  return (
    <RadioGroup
      {...args}
      value={value}
      onValueChange={(nextValue) => {
        setValue(nextValue);
        args.onValueChange?.(nextValue);
      }}
    >
      {args.children}
    </RadioGroup>
  );
};

const ControlledCountryGroup = (
  args: Omit<RadioGroupStoryProps, 'children'>
) => {
  const [value, setValue] = useState(args.value ?? args.defaultValue ?? '');

  return (
    <RadioGroup
      {...args}
      value={value}
      onValueChange={(nextValue) => {
        setValue(nextValue);
        args.onValueChange?.(nextValue);
      }}
    >
      <CountryRadios />
    </RadioGroup>
  );
};

export const Playground: Story = {
  args: {
    defaultValue: 'fr',
    children: <CountryRadios />,
  },
  render: (args) => (
    <Section title='Playground'>
      <ControlledRadioGroup {...args} />
    </Section>
  ),
};

export const Default: Story = {
  args: {
    defaultValue: 'fr',
  },
  render: (args) => (
    <Section title='Default'>
      <RadioGroup {...args}>
        <CountryRadios />
      </RadioGroup>
    </Section>
  ),
};

export const Controlled: Story = {
  args: {
    value: 'fr',
  },
  render: (args) => (
    <Section title='Controlled'>
      <ControlledCountryGroup {...args}>
        <CountryRadios />
      </ControlledCountryGroup>
    </Section>
  ),
};

export const Uncontrolled: Story = {
  args: {
    defaultValue: 'fr',
  },
  render: (args) => (
    <Section title='Uncontrolled'>
      <RadioGroup {...args}>
        <CountryRadios />
      </RadioGroup>
    </Section>
  ),
};

export const WithDescription: Story = {
  args: {
    defaultValue: 'fr',
    description: 'Choose your country of residence.',
  },
  render: (args) => (
    <Section title='With description'>
      <RadioGroup {...args}>
        <CountryRadios />
      </RadioGroup>
    </Section>
  ),
};

export const Required: Story = {
  args: {
    required: true,
    defaultValue: 'fr',
  },
  render: (args) => (
    <Section title='Required'>
      <RadioGroup {...args}>
        <CountryRadios />
      </RadioGroup>
    </Section>
  ),
};

export const WithError: Story = {
  args: {
    required: true,
    defaultValue: '',
    error: 'Please select a country.',
  },
  render: (args) => (
    <Section title='Error'>
      <RadioGroup {...args}>
        <CountryRadios />
      </RadioGroup>
    </Section>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'fr',
  },
  render: (args) => (
    <Section title='Disabled group'>
      <RadioGroup {...args}>
        <CountryRadios />
      </RadioGroup>
    </Section>
  ),
};

export const DisabledRadio: Story = {
  args: {
    defaultValue: 'fr',
  },
  render: (args) => (
    <Section title='Disabled Radio'>
      <RadioGroup {...args}>
        <CountryRadios disableSpain />
      </RadioGroup>
    </Section>
  ),
};

export const Horizontal: Story = {
  args: {
    defaultValue: 'fr',
    orientation: 'horizontal',
  },
  render: (args) => (
    <Section title='Horizontal'>
      <RadioGroup {...args}>
        <CountryRadios />
      </RadioGroup>
    </Section>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Section title='Sizes'>
      <div style={{ display: 'grid', gap: 24 }}>
        <RadioGroup
          name='country-small'
          label='Small'
          defaultValue='fr'
          size='sm'
        >
          <CountryRadios />
        </RadioGroup>

        <RadioGroup
          name='country-medium'
          label='Medium'
          defaultValue='fr'
          size='md'
        >
          <CountryRadios />
        </RadioGroup>

        <RadioGroup
          name='country-large'
          label='Large'
          defaultValue='fr'
          size='lg'
        >
          <CountryRadios />
        </RadioGroup>
      </div>
    </Section>
  ),
};

export const WithRadioDescriptions: Story = {
  args: {
    defaultValue: 'standard',
    label: 'Delivery method',
    description: 'Choose how your order should be delivered.',
  },
  render: (args) => (
    <Section title='Radio descriptions'>
      <RadioGroup {...args}>
        <Radio
          value='standard'
          label='Standard delivery'
          description='Delivered within three to five business days.'
        />
        <Radio
          value='express'
          label='Express delivery'
          description='Delivered on the next business day.'
        />
      </RadioGroup>
    </Section>
  ),
};

export const CustomContent: Story = {
  render: () => (
    <Section title='Custom content'>
      <RadioGroup
        name='shipping-speed'
        label={
          <span style={{ display: 'inline-flex', gap: 8 }}>
            Shipping speed
            <strong>Required</strong>
          </span>
        }
        description={
          <span>Choose the speed that matches the current order priority.</span>
        }
        required
        defaultValue='standard'
      >
        <Radio
          value='standard'
          label='Standard'
          description='Delivered within three to five business days.'
        />
        <Radio
          value='express'
          label='Express'
          description='Delivered on the next business day.'
        />
      </RadioGroup>
    </Section>
  ),
};

export const States: Story = {
  render: () => (
    <Section title='States'>
      <div style={{ display: 'grid', gap: 24 }}>
        <RadioGroup name='states-default' label='Default' defaultValue='fr'>
          <CountryRadios />
        </RadioGroup>

        <RadioGroup
          name='states-horizontal'
          label='Horizontal'
          orientation='horizontal'
          defaultValue='fr'
        >
          <CountryRadios />
        </RadioGroup>

        <RadioGroup name='states-required' label='Required' required>
          <CountryRadios />
        </RadioGroup>

        <RadioGroup
          name='states-disabled'
          label='Disabled group'
          defaultValue='fr'
          disabled
        >
          <CountryRadios />
        </RadioGroup>

        <RadioGroup
          name='states-error'
          label='Error'
          error='Please select a country.'
          required
        >
          <CountryRadios disableSpain />
        </RadioGroup>
      </div>
    </Section>
  ),
};

export const Selection: Story = {
  args: {
    defaultValue: '',
  },
  render: (args) => (
    <Section title='Selection'>
      <RadioGroup {...args}>
        <CountryRadios />
      </RadioGroup>
    </Section>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const franceInput = canvas.getByRole('radio', {
      name: 'France',
    });

    const spainInput = canvas.getByRole('radio', {
      name: 'Spain',
    });

    await expect(franceInput).not.toBeChecked();
    await expect(spainInput).not.toBeChecked();

    await userEvent.click(spainInput);

    await expect(spainInput).toBeChecked();
    await expect(franceInput).not.toBeChecked();
  },
};

export const DisabledRadioInteraction: Story = {
  args: {
    defaultValue: 'fr',
  },
  render: (args) => (
    <Section title='Disabled Radio interaction'>
      <RadioGroup {...args}>
        <CountryRadios disableSpain />
      </RadioGroup>
    </Section>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const franceInput = canvas.getByRole('radio', {
      name: 'France',
    });

    const spainInput = canvas.getByRole('radio', {
      name: 'Spain',
    });

    await expect(franceInput).toBeChecked();
    await expect(spainInput).toBeDisabled();

    await userEvent.click(spainInput);

    await expect(franceInput).toBeChecked();
    await expect(spainInput).not.toBeChecked();
  },
};
