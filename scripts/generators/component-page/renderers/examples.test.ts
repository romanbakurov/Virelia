import { describe, expect, it } from 'vitest';

import type { ExtractedProp, GeneratedExample } from '../model/types';
import { buildExamples, renderExamples } from './examples';

type PropKind = ExtractedProp['kind'];
type RenderConfig = Parameters<typeof renderExamples>[0]['componentConfig'];

type RenderParams = {
  generatedExamples?: readonly GeneratedExample[];
  reactApiProps?: readonly ExtractedProp[];
  nativeApiProps?: readonly ExtractedProp[];
  componentConfig?: RenderConfig;
};

function prop(name: string, kind: PropKind, type: string): ExtractedProp {
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

function render(params: RenderParams) {
  const generatedExamples: readonly GeneratedExample[] =
    params.generatedExamples ?? [
      {
        title: 'Basic',
        description: 'Basic example.',
        props: [],
      },
    ];

  return renderExamples({
    componentName: 'Accordion',
    componentConfig: params.componentConfig ?? {},
    generatedExamples,
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

  it('only generates bare shorthand for boolean props', () => {
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
  it('filters unavailable demo shortcuts', () => {
    const content = render({
      componentConfig: {
        demo: {
          label: 'Label',
          description: 'Help',
        },
      },
    });

    expect(content).not.toContain("label='Label'");
    expect(content).not.toContain("description='Help'");
  });

  it('keeps shortcuts exposed by the platform API', () => {
    const content = render({
      componentConfig: {
        demo: {
          label: 'Email',
        },
      },
      reactApiProps: [prop('label', 'string', 'string')],
    });

    expect(content).toContain("<ReactAccordion\n          label='Email'");
    expect(content).not.toContain("<NativeAccordion\n          label='Email'");
  });

  it('rejects bare non-boolean props', () => {
    const renderInvalid = () =>
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
      });

    expect(renderInvalid).toThrow(/non-boolean prop/);
  });

  it('allows bare boolean props', () => {
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

  it('rejects nested component roots in children', () => {
    const renderInvalid = () =>
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
      });

    expect(renderInvalid).toThrow(/second <Accordion> root/);
  });

  it('renders executable setup in isolated platform preview components', () => {
    const content = render({
      generatedExamples: [
        {
          title: 'Controlled',
          description: 'Controlled example.',
          imports: ["import { useState } from 'react';"],
          setup: ["const [value, setValue] = useState('account');"],
          props: ['value={value}', 'onValueChange={setValue}'],
          reactChildren: `<Accordion.Item value='account'>Account</Accordion.Item>`,
          nativeChildren: `<Accordion.Item value='account'>Account</Accordion.Item>`,
        },
      ],
    });

    expect(content).toContain('function ReactAccordionExample1Preview()');
    expect(content).toContain('function NativeAccordionExample1Preview()');
    expect(content).toContain("const [value, setValue] = useState('account');");
    expect(content).toContain('preview: <ReactAccordionExample1Preview />');
    expect(content).toContain('preview: <NativeAccordionExample1Preview />');
    expect(content).toContain('function Example()');
    expect(content.indexOf('function ReactAccordionExample1Preview()')).toBeLessThan(
      content.indexOf('export function AccordionExamples')
    );
  });

  it('keeps platform-specific setup isolated', () => {
    const content = render({
      generatedExamples: [
        {
          title: 'Platform setup',
          description: 'Platform-specific example.',
          props: [],
          reactSetup: ["const platformValue = 'react';"],
          nativeSetup: ["const platformValue = 'react-native';"],
        },
      ],
    });

    expect(content).toContain("const platformValue = 'react';");
    expect(content).toContain("const platformValue = 'react-native';");
    expect(content).toContain('preview: <ReactAccordionExample1Preview />');
    expect(content).toContain('preview: <NativeAccordionExample1Preview />');
  });

  it('preserves inline previews for stateless examples', () => {
    const content = render({});

    expect(content).not.toContain('AccordionExample1Preview');
    expect(content).toContain('preview: (');
  });
});
