export type StoryTemplateParams = {
  componentName: string;
  layer: string;
  isNative: boolean;
};

export function renderStoryTemplate({
  componentName,
  layer,
  isNative,
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
    '',
    'Correct usage:',
    '',
    '\\`\\`\\`tsx',
    `<${componentName} />`,
    '\\`\\`\\`',
  ].join('\n');

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

export const Default: Story = {};
`;
}
