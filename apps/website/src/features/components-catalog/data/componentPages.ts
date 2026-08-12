import type { ComponentType } from 'react';

import type { ComponentApiProp } from '../components/ComponentApi';
import type { ComponentPlatform } from '../types';

import { ButtonUsage } from '../demos/ButtonUsage';
import { InputUsage } from '../demos/InputUsage';
import { ButtonExamples } from '../demos/ButtonExamples';
import { InputExamples } from '../demos/InputExamples';
import { ButtonAccessibility } from '../demos/ButtonAccessibility';
import { InputAccessibility } from '../demos/InputAccessibility';
import { ButtonDemo } from '../demos/ButtonDemo';
import { NativeButtonDemo } from '../demos/NativeButtonDemo';
import { InputDemo } from '../demos/InputDemo';
import { NativeInputDemo } from '../demos/NativeInputDemo';

import { buttonApi } from './buttonApi';
import { inputApi } from './inputApi';

// component-page-imports
import { SelectUsage } from '../demos/SelectUsage';
import { SelectExamples } from '../demos/SelectExamples';
import { SelectAccessibility } from '../demos/SelectAccessibility';
import { SelectDemo } from '../demos/SelectDemo';
import { NativeSelectDemo } from '../demos/NativeSelectDemo';
import { selectApi } from './selectApi';
import { RadioUsage } from '../demos/RadioUsage';
import { RadioExamples } from '../demos/RadioExamples';
import { RadioAccessibility } from '../demos/RadioAccessibility';
import { RadioDemo } from '../demos/RadioDemo';
import { NativeRadioDemo } from '../demos/NativeRadioDemo';
import { radioApi } from './radioApi';
import { CheckboxUsage } from '../demos/CheckboxUsage';
import { CheckboxExamples } from '../demos/CheckboxExamples';
import { CheckboxAccessibility } from '../demos/CheckboxAccessibility';
import { CheckboxDemo } from '../demos/CheckboxDemo';
import { NativeCheckboxDemo } from '../demos/NativeCheckboxDemo';

import { checkboxApi } from './checkboxApi';

type PlatformSectionProps = {
  platform: ComponentPlatform;
};

type PlatformSection = ComponentType<PlatformSectionProps>;

type PlatformDemoRegistry = Partial<Record<ComponentPlatform, ComponentType>>;

type ComponentPageConfig = {
  name: string;
  demos: PlatformDemoRegistry;
  Usage: PlatformSection;
  Examples: PlatformSection;
  Accessibility: PlatformSection;
  api: Readonly<Record<ComponentPlatform, readonly ComponentApiProp[]>>;
  related: readonly string[];
};

export const componentPages = {
  // component-page-entries
  select: {
    name: 'Select',
    demos: {
      react: SelectDemo,
      'react-native': NativeSelectDemo,
    },
    Usage: SelectUsage,
    Examples: SelectExamples,
    Accessibility: SelectAccessibility,
    api: selectApi,
    related: [],
  },
  radio: {
    name: 'Radio',
    demos: {
      react: RadioDemo,
      'react-native': NativeRadioDemo,
    },
    Usage: RadioUsage,
    Examples: RadioExamples,
    Accessibility: RadioAccessibility,
    api: radioApi,
    related: [],
  },
  checkbox: {
    name: 'Checkbox',
    demos: {
      react: CheckboxDemo,
      'react-native': NativeCheckboxDemo,
    },
    Usage: CheckboxUsage,
    Examples: CheckboxExamples,
    Accessibility: CheckboxAccessibility,
    api: checkboxApi,
    related: [],
  },
  button: {
    name: 'Button',
    demos: {
      react: ButtonDemo,
      'react-native': NativeButtonDemo,
    },
    Usage: ButtonUsage,
    Examples: ButtonExamples,
    Accessibility: ButtonAccessibility,
    api: buttonApi,
    related: ['input', 'dropdown', 'tooltip'],
  },

  input: {
    name: 'Input',
    demos: {
      react: InputDemo,
      'react-native': NativeInputDemo,
    },
    Usage: InputUsage,
    Examples: InputExamples,
    Accessibility: InputAccessibility,
    api: inputApi,
    related: ['form-field', 'select', 'button'],
  },
} satisfies Record<string, ComponentPageConfig>;
