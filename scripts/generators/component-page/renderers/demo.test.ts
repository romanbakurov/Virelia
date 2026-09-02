import { describe, expect, it } from 'vitest';

import { renderDemoFiles } from './demo';

import type { ExtractedProp } from '../model/types';

const label: ExtractedProp = {
  name: 'label',
  kind: 'string',
  required: false,
  type: 'string',
  description: '',
};

const description: ExtractedProp = {
  name: 'description',
  kind: 'string',
  required: false,
  type: 'string',
  description: '',
};

function render(params: {
  reactApiProps: readonly ExtractedProp[];
  nativeApiProps: readonly ExtractedProp[];
}) {
  return renderDemoFiles({
    componentName: 'Example',
    componentConfig: {
      demo: {
        label: 'Account settings',
        description: 'Choose a section to view more details.',
      },
    },
    platforms: ['react', 'react-native'],
    playgroundProps: [],
    reactApiProps: params.reactApiProps,
    nativeApiProps: params.nativeApiProps,
    reactPlaygroundPropBindings: '',
    nativePlaygroundPropBindings: '',
    reactStaticDemoProps: '',
    nativeStaticDemoProps: '',
    reactDemoChildren: '',
    nativeDemoChildren: '',
    nativeResponsivePresentation: false,
    generatedFileHeader: '',
    getChangeHandlerName: () => null,
  });
}

describe('renderDemoFiles', () => {
  it('keeps demo label and description shortcuts when the platform API exposes them', () => {
    const result = render({
      reactApiProps: [label, description],
      nativeApiProps: [label, description],
    });

    expect(result.reactContent).toContain("label='Account settings'");
    expect(result.reactContent).toContain(
      "description='Choose a section to view more details.'"
    );
    expect(result.nativeContent).toContain("label='Account settings'");
    expect(result.nativeContent).toContain(
      "description='Choose a section to view more details.'"
    );
  });

  it('does not forward shortcuts that are absent from a platform API', () => {
    const result = render({
      reactApiProps: [label],
      nativeApiProps: [],
    });

    expect(result.reactContent).toContain("label='Account settings'");
    expect(result.reactContent).not.toContain(
      "description='Choose a section to view more details.'"
    );
    expect(result.nativeContent).not.toContain("label='Account settings'");
    expect(result.nativeContent).not.toContain(
      "description='Choose a section to view more details.'"
    );
  });
});
