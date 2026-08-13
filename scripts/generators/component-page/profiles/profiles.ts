import type { ComponentPageMetadata } from '../../../../apps/website/src/component-catalog/metadata';

export type ComponentProfile = NonNullable<ComponentPageMetadata['profile']>;

export function inferComponentProfile(componentName: string): ComponentProfile {
  if (['Modal', 'Popover', 'Tooltip', 'Dropdown'].includes(componentName)) {
    return 'overlay';
  }

  if (['Tabs'].includes(componentName)) {
    return 'navigation';
  }

  if (['Select'].includes(componentName)) {
    return 'compound';
  }

  if (['Radio', 'Checkbox'].includes(componentName)) {
    return 'selection-control';
  }

  if (['Input', 'FormField'].includes(componentName)) {
    return 'form-control';
  }

  return 'primitive';
}

export function getProfileMetadata(
  profile: ComponentProfile
): ComponentPageMetadata {
  if (profile === 'selection-control') {
    return {
      demo: {
        initialValues: {
          checked: false,
          disabled: false,
          required: false,
          indeterminate: false,
          size: 'md',
          color: 'primary',
          error: '',
        },
        previewWidth: 'field',
      },
      defaults: {
        shared: {
          defaultChecked: false,
          disabled: false,
          required: false,
          checked: false,
          indeterminate: false,
          size: 'md',
          color: 'primary',
        },
      },
    };
  }

  if (profile === 'form-control') {
    return {
      demo: {
        previewWidth: 'field',
      },
    };
  }

  return {};
}
