'use client';

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
      title: 'Basic',
      description: 'Primary action button.',
      preview: <ReactButton>Button</ReactButton>,
      code: "import { Button } from '@vellira-ui/react';\n\n<Button>\n  Button\n</Button>",
    },
    {
      title: 'Appearance',
      description: 'Alternative button surface.',
      preview: <ReactButton appearance='outline'>Button</ReactButton>,
      code: "import { Button } from '@vellira-ui/react';\n\n<Button\n  appearance='outline'\n>\n  Button\n</Button>",
    },
    {
      title: 'Semantic color',
      description: 'Semantic tone for destructive or status actions.',
      preview: <ReactButton color='danger'>Button</ReactButton>,
      code: "import { Button } from '@vellira-ui/react';\n\n<Button\n  color='danger'\n>\n  Button\n</Button>",
    },
    {
      title: 'Loading',
      description: 'Shows progress and prevents interaction.',
      preview: (
        <ReactButton loading loadingText='Saving...'>
          Button
        </ReactButton>
      ),
      code: "import { Button } from '@vellira-ui/react';\n\n<Button\n  loading\n  loadingText='Saving...'\n>\n  Button\n</Button>",
    },
    {
      title: 'Disabled',
      description: 'Disabled action state.',
      preview: <ReactButton disabled>Button</ReactButton>,
      code: "import { Button } from '@vellira-ui/react';\n\n<Button\n  disabled\n>\n  Button\n</Button>",
    },
    {
      title: 'Full width',
      description: 'Button expands to fill its container.',
      preview: <ReactButton fullWidth>Button</ReactButton>,
      code: "import { Button } from '@vellira-ui/react';\n\n<Button\n  fullWidth\n>\n  Button\n</Button>",
    },
    {
      title: 'Size and shape',
      description: 'Large rounded button treatment.',
      preview: (
        <ReactButton size='lg' shape='rounded'>
          Button
        </ReactButton>
      ),
      code: "import { Button } from '@vellira-ui/react';\n\n<Button\n  size='lg'\n  shape='rounded'\n>\n  Button\n</Button>",
    },
  ] as const;

  const nativeExamples = [
    {
      title: 'Basic',
      description: 'Primary action button.',
      preview: <NativeButton>Button</NativeButton>,
      code: "import { Button } from '@vellira-ui/react-native';\n\n<Button>\n  Button\n</Button>",
    },
    {
      title: 'Appearance',
      description: 'Alternative button surface.',
      preview: <NativeButton appearance='outline'>Button</NativeButton>,
      code: "import { Button } from '@vellira-ui/react-native';\n\n<Button\n  appearance='outline'\n>\n  Button\n</Button>",
    },
    {
      title: 'Semantic color',
      description: 'Semantic tone for destructive or status actions.',
      preview: <NativeButton color='danger'>Button</NativeButton>,
      code: "import { Button } from '@vellira-ui/react-native';\n\n<Button\n  color='danger'\n>\n  Button\n</Button>",
    },
    {
      title: 'Loading',
      description: 'Shows progress and prevents interaction.',
      preview: (
        <NativeButton loading loadingText='Saving...'>
          Button
        </NativeButton>
      ),
      code: "import { Button } from '@vellira-ui/react-native';\n\n<Button\n  loading\n  loadingText='Saving...'\n>\n  Button\n</Button>",
    },
    {
      title: 'Disabled',
      description: 'Disabled action state.',
      preview: <NativeButton disabled>Button</NativeButton>,
      code: "import { Button } from '@vellira-ui/react-native';\n\n<Button\n  disabled\n>\n  Button\n</Button>",
    },
    {
      title: 'Full width',
      description: 'Button expands to fill its container.',
      preview: <NativeButton fullWidth>Button</NativeButton>,
      code: "import { Button } from '@vellira-ui/react-native';\n\n<Button\n  fullWidth\n>\n  Button\n</Button>",
    },
    {
      title: 'Size and shape',
      description: 'Large rounded button treatment.',
      preview: (
        <NativeButton size='lg' shape='rounded'>
          Button
        </NativeButton>
      ),
      code: "import { Button } from '@vellira-ui/react-native';\n\n<Button\n  size='lg'\n  shape='rounded'\n>\n  Button\n</Button>",
    },
  ] as const;

  return (
    <ComponentExamples
      items={platform === 'react' ? reactExamples : nativeExamples}
    />
  );
}
