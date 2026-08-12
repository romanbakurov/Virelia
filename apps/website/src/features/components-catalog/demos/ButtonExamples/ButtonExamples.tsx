'use client';

import { ArrowRight, Plus } from '@vellira-ui/icons';
import { Button as ReactButton } from '@vellira-ui/react';
import { Button as NativeButton } from '@vellira-ui/react-native';

import { ComponentExamples } from '../../components/ComponentExamples';
import type { ComponentPlatform } from '../../types';

type ButtonExamplesProps = {
  platform: ComponentPlatform;
};

export function ButtonExamples({ platform }: ButtonExamplesProps) {
  const reactExamples = [
    {
      title: 'With icons',
      description: 'Add visual context before or after the label.',
      preview: (
        <ReactButton iconStart={<Plus />} iconEnd={<ArrowRight />}>
          Create
        </ReactButton>
      ),
      code: `import { ArrowRight, Plus } from '@vellira-ui/icons';
import { Button } from '@vellira-ui/react';

<Button
  iconStart={<Plus />}
  iconEnd={<ArrowRight />}
>
  Create
</Button>`,
    },
    {
      title: 'Loading',
      description: 'Communicate pending actions while preventing interaction.',
      preview: (
        <ReactButton loading loadingText='Saving'>
          Save
        </ReactButton>
      ),
      code: `import { Button } from '@vellira-ui/react';

<Button loading loadingText='Saving'>
  Save
</Button>`,
    },
    {
      title: 'Icon only',
      description: 'Use an accessible name when the label is visually hidden.',
      preview: (
        <ReactButton
          appearance='ghost'
          shape='square'
          iconOnly
          aria-label='Add item'
          iconStart={<Plus />}
        />
      ),
      code: `import { Plus } from '@vellira-ui/icons';
import { Button } from '@vellira-ui/react';

<Button
  appearance='ghost'
  shape='square'
  iconOnly
  aria-label='Add item'
  iconStart={<Plus />}
/>`,
    },
    {
      title: 'As link',
      description: 'Render navigation actions with Button styling.',
      preview: (
        <ReactButton href='https://docs.vellira.dev' target='_blank'>
          Open docs
        </ReactButton>
      ),
      code: `import { Button } from '@vellira-ui/react';

<Button
  href='https://docs.vellira.dev'
  target='_blank'
>
  Open docs
</Button>`,
    },
  ] as const;

  const nativeExamples = [
    {
      title: 'With icons',
      description: 'Add icon elements before or after the label.',
      preview: (
        <NativeButton iconStart={<Plus />} iconEnd={<ArrowRight />}>
          Create
        </NativeButton>
      ),
      code: `import { ArrowRight, Plus } from '@vellira-ui/icons/native';
import { Button } from '@vellira-ui/react-native';

<Button
  iconStart={<Plus />}
  iconEnd={<ArrowRight />}
>
  Create
</Button>`,
    },
    {
      title: 'Loading',
      description: 'Show pending state and disable interaction.',
      preview: (
        <NativeButton loading loadingText='Saving'>
          Save
        </NativeButton>
      ),
      code: `import { Button } from '@vellira-ui/react-native';

<Button loading loadingText='Saving'>
  Save
</Button>`,
    },
    {
      title: 'Icon only',
      description: 'Provide an accessibility label for icon-only actions.',
      preview: (
        <NativeButton
          appearance='ghost'
          shape='square'
          iconOnly
          accessibilityLabel='Add item'
          iconStart={<Plus />}
        />
      ),
      code: `import { Plus } from '@vellira-ui/icons/native';
import { Button } from '@vellira-ui/react-native';

<Button
  appearance='ghost'
  shape='square'
  iconOnly
  accessibilityLabel='Add item'
  iconStart={<Plus />}
/>`,
    },
    {
      title: 'Press action',
      description: 'Handle native interaction with onPress.',
      preview: <NativeButton onPress={() => undefined}>Continue</NativeButton>,
      code: `import { Button } from '@vellira-ui/react-native';

<Button onPress={handlePress}>
  Continue
</Button>`,
    },
  ] as const;

  return (
    <ComponentExamples
      items={platform === 'react' ? reactExamples : nativeExamples}
    />
  );
}
