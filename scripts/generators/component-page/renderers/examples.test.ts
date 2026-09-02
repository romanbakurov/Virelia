import { describe, expect, it } from 'vitest';

import type { ExtractedProp, GeneratedExample } from '../model/types';
import { buildExamples, renderExamples } from './examples';

function prop(
  name: string,
  kind: ExtractedProp['kind'],
  type: string
): ExtractedProp {
  if (kind === 'select') {
    return {
      name,
      kind,
      required: false,
      type,
      description: '',
      options: ['one', 'two'],
    };
  }

  return {
    name,
    kind,
    required: false,
    type,
    description: '',
  };
}

function render(params: {
  generatedExamples?: readonly GeneratedExample[];
  reactApiProps?: readonly ExtractedProp[];
  nativeApiProps?: readonly ExtractedProp[];
  componentConfig?: Parameters<typeof renderExamples>[0]['componentConfig'];
}) {
  return renderExamples({
    componentName: 'Accordion',
    componentConfig: params.componentConfig ?? {},
    generatedExamples:
      params.generatedExamples ??
      ([
        {
          title: 'Basic',
          description: 'Basic example.',
          props: [],
        },
      ] satisfies readonly GeneratedExample[]),
    generatedFileHeader: '',
    reactApiProps: params.reactApiProps ?? [],
    nativeApiProps: params.nativeApiProps ?? [],
    getDemoProps: () => '',
  });
}

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

  it('only generates bare shorthand examples for boolean props', () => {
    const examples = buildExamples({
      componentName: 'Accordion',
      componentConfig: {},
      componentProfile: 'compound',
      extractedProps: [prop('disabled', 'string', 'string')],
      playgroundProps: [],
    });

    expect(examples.map((example) => example.title)).toEqual(['Basic']);
  });
});

describe('renderExamples', () => {
  it(
    'does not inherit label or description shortcuts missing from the platform API',
    () => {
      const content = render({
        componentConfig: {
          demo: {
            label: 'Order information',
            description: 'Expandable details.',
          },
        },
      });

      expect(content).not.toContain("label='Order information'");
      expect(content).not.toContain("description='Expandable details.'");
    }
  );

  it('keeps a demo shortcut when the target platform exposes that prop', () => {
    const content = render({
      componentConfig: {
        demo: {
          label: 'Order information',
        },
      },
      reactApiProps: [prop('label', 'string', 'string')],
    });

    expect(content).toContain(
      "<ReactAccordion\n          label='Order information'"
    );
    expect(content).not.toContain(
      "<NativeAccordion\n          label='Order information'"
    );
  });

  it('rejects bare JSX shorthand for a non-boolean prop', () => {
    expect(() =>
      render({
        generatedExamples: [
          {
            title: 'Uncontrolled',
            description: 'Example.',
            props: ['defaultValue'],
            platforms: ['react'],
          },
        ],
        reactApiProps: [
          prop('defaultValue', 'other', 'string | string[] | undefined'),
        ],
      })
    ).toThrow(/bare JSX syntax for non-boolean prop "defaultValue"/);
  });

  it('allows bare JSX shorthand for a boolean prop', () => {
    const content = render({
      generatedExamples: [
        {
          title: 'Collapsible',
          description: 'Example.',
          props: ['collapsible'],
          platforms: ['react'],
        },
      ],
      reactApiProps: [prop('collapsible', 'boolean', 'boolean')],
    });

    expect(content).toContain('collapsible');
  });

  it(
    'rejects platform children that re-wrap the generated component root',
    () => {
      expect(() =>
        render({
          generatedExamples: [
            {
              title: 'Controlled',
              description: 'Example.',
              props: [],
              reactChildren: `<Accordion value='billing'>
  <Accordion.Item value='billing'>Billing</Accordion.Item>
</Accordion>`,
              platforms: ['react'],
            },
          ],
        })
      ).toThrow(/must contain inner child markup, not a second <Accordion> root/);
    }
  );
});
