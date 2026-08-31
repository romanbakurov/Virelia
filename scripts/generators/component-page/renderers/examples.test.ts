import { describe, expect, it } from 'vitest';

import { buildExamples } from './examples';

describe('buildExamples', () => {
  it('does not duplicate the generic compound composition', () => {
    const examples = buildExamples({
      componentName: 'Accordion',
      componentConfig: {
        profile: 'compound',
        react: {
          children: `<Accordion.Item>
  <Accordion.Trigger>Section</Accordion.Trigger>
  <Accordion.Content>Section content</Accordion.Content>
</Accordion.Item>`,
        },
        native: {
          children: `<Accordion.Item>
  <Accordion.Trigger>Section</Accordion.Trigger>
  <Accordion.Content>Section content</Accordion.Content>
</Accordion.Item>`,
        },
      },
      componentProfile: 'compound',
      extractedProps: [
        {
          name: 'children',
          kind: 'other',
          required: false,
          type: 'ReactNode',
          description: '',
          sourceFilePath: '/tmp/Accordion/types.ts',
        },
      ],
      playgroundProps: [],
    });

    expect(examples.map((example) => example.title)).toEqual(['Basic']);
  });
});
