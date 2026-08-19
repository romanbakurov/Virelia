import type { ComponentProfileArg, FormControlKindArg } from '../cli';

export type StoryTemplateParams = {
  componentName: string;
  layer: string;
  isNative: boolean;
  profile?: ComponentProfileArg;
  control?: FormControlKindArg;
};

export function renderStoryTemplate({
  componentName,
  layer,
  isNative,
  profile = 'base',
  control = 'value',
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
    profile === 'form-control'
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
    profile === 'form-control'
      ? `
export const Disabled: Story = {
  args: {
    disabled: true,
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
