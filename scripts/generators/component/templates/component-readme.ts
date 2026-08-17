import type { ComponentTemplateParams } from './component-types';

export function renderReadmeTemplate({
  componentName,
}: ComponentTemplateParams) {
  return `# ${componentName}

TODO: Describe when to use ${componentName} and what problem it solves.

## Usage

\`\`\`tsx
<${componentName} />
\`\`\`

## Accessibility

TODO: Document accessible naming, states, keyboard behavior, focus behavior,
and platform-specific accessibility details where applicable.

## Testing

Before marking the component stable, verify its supported states, interaction
behavior, accessibility contract, and platform-specific behavior.
`;
}
