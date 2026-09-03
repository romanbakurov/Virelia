import type { ComponentCapability } from '@vellira-ui/metadata';
import type { ComponentProfileArg, FormControlKindArg } from '../cli';

export type StoryTemplateParams = {
  componentName: string;
  layer: string;
  isNative: boolean;
  profile?: ComponentProfileArg;
  control?: FormControlKindArg;
  capabilities?: readonly ComponentCapability[];
  parts?: readonly string[];
};

function hasCapability(
  capabilities: readonly ComponentCapability[],
  capability: ComponentCapability
) {
  return capabilities.includes(capability);
}

function renderCompoundChildren(
  componentName: string,
  parts: readonly string[]
) {
  if (!parts.includes('Item') || !parts.includes('Trigger')) {
    return undefined;
  }

  return `<${componentName}.Item value='item-1'>
  <${componentName}.Trigger>Example section</${componentName}.Trigger>
  ${
    parts.includes('Content')
      ? `<${componentName}.Content>Example content</${componentName}.Content>`
      : 'Example content'
  }
</${componentName}.Item>`;
}

function renderCompoundStories(params: {
  componentName: string;
  capabilities: readonly ComponentCapability[];
  parts: readonly string[];
}) {
  const { componentName, capabilities, parts } = params;
  const children = renderCompoundChildren(componentName, parts);

  if (!children) {
    return '';
  }

  const stories: string[] = [];

  if (hasCapability(capabilities, 'controlled')) {
    stories.push(`export const Controlled: Story = {
  args: {
    value: 'item-1',
    onValueChange: () => undefined,
    children: (
      ${children}
    ),
  },
};`);
  }

  if (hasCapability(capabilities, 'uncontrolled')) {
    stories.push(`export const Uncontrolled: Story = {
  args: {
    defaultValue: 'item-1',
    children: (
      ${children}
    ),
  },
};`);
  }

  if (hasCapability(capabilities, 'disabled')) {
    stories.push(`export const Disabled: Story = {
  args: {
    disabled: true,
    children: (
      ${children}
    ),
  },
};`);
  }

  return stories.length > 0 ? `\n${stories.join('\n\n')}\n` : '';
}

export function renderStoryTemplate({
  componentName,
  layer,
  isNative,
  profile = 'base',
  control = 'value',
  capabilities = [],
  parts = [],
}: StoryTemplateParams) {
  const storybookPackage = isNative
    ? '@storybook/react'
    : '@storybook/react-vite';

  const title = `${layer[0].toUpperCase() + layer.slice(1)}/${componentName}`;

  const description = [
    `### ${componentName} Component`,
    '',
    `Describe when to use ${componentName} and what problem it solves.`,
    '',
    '**Features**',
    '- Add the main supported states',
    '- Document important behavior',
    '- Mention platform-specific details when needed',
    '',
    '### Usage',
    '',
    'Replace this section with a real example before publishing the component.',
  ].join('\n');

  const defaultArgs =
    profile === 'compound'
      ? renderCompoundChildren(componentName, parts)
        ? `{
    children: (
      ${renderCompoundChildren(componentName, parts)}
    ),
  }`
        : `{
    children: 'Example content',
  }`
      : profile === 'form-control'
        ? control === 'boolean'
          ? `{
    defaultChecked: false,
  }`
          : `{
    defaultValue: 'Example value',
  }`
        : `{
    children: 'Example content',
  }`;

  const additionalStories =
    profile === 'compound'
      ? renderCompoundStories({ componentName, capabilities, parts })
      : profile === 'form-control'
        ? control === 'boolean'
          ? `
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
`
          : `
export const Controlled: Story = {
  args: {
    value: 'Controlled value',
    onValueChange: () => undefined,
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
`
        : '';

  return `import type { Meta, StoryObj } from '${storybookPackage}';

import { ${componentName} } from './${componentName}';

const meta: Meta<typeof ${componentName}> = {
  title: '${title}',
  component: ${componentName},
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: \`
${description}
\`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ${componentName}>;

export const Default: Story = {
  args: ${defaultArgs},
};
${additionalStories}`;
}
