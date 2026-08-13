import { defineComponentPageMetadata } from '../../metadata';

export default defineComponentPageMetadata({
  react: {
    children: `<Tabs.List>
  <Tabs.Trigger value='account'>Account</Tabs.Trigger>
  <Tabs.Trigger value='billing'>Billing</Tabs.Trigger>
</Tabs.List>
<Tabs.Content value='account'>Account settings</Tabs.Content>
<Tabs.Content value='billing'>Billing details</Tabs.Content>`,
  },
  native: {
    children: `<Tabs.List>
  <Tabs.Trigger value='account'>Account</Tabs.Trigger>
  <Tabs.Trigger value='billing'>Billing</Tabs.Trigger>
</Tabs.List>
<Tabs.Content value='account'><NativeText>Account settings</NativeText></Tabs.Content>
<Tabs.Content value='billing'><NativeText>Billing details</NativeText></Tabs.Content>`,
    imports: [`import { Text as NativeText } from 'react-native';`],
  },
  demo: {
    initialValues: {
      orientation: 'horizontal',
      activationMode: 'automatic',
      variant: 'line',
      color: 'primary',
      size: 'md',
      disabled: false,
    },
  },
  defaults: {
    shared: {
      orientation: 'horizontal',
      activationMode: 'automatic',
      loop: true,
      keepMounted: false,
      lazyMount: false,
      variant: 'line',
      color: 'primary',
      size: 'md',
      disabled: false,
    },
  },
  examples: [
    { title: 'Basic', description: 'Two-panel tab navigation.', props: [] },
    {
      title: 'Pills',
      description: 'Alternative visual treatment.',
      props: [`variant='pills'`],
    },
    {
      title: 'Manual activation',
      description: 'Focus tabs without selecting until activation.',
      props: [`activationMode='manual'`],
    },
    {
      title: 'Disabled',
      description: 'Disabled tab set.',
      props: ['disabled'],
    },
  ],
  api: {
    sections: [
      { name: 'Tabs.List', exportName: 'TabsListProps' },
      { name: 'Tabs.Trigger', exportName: 'TabsTriggerProps' },
      { name: 'Tabs.Content', exportName: 'TabsContentProps' },
    ],
  },
  accessibility: {
    react: [
      {
        title: 'Keyboard navigation',
        description:
          'Support arrow-key movement between triggers and preserve focus order.',
        props: ['orientation', 'activationMode', 'loop'],
      },
      {
        title: 'Panel relationships',
        description:
          'Each trigger value should match exactly one content panel value.',
        props: ['value', 'defaultValue'],
      },
    ],
    native: [
      {
        title: 'Screen reader state',
        description:
          'Expose the selected tab and associated panel content through React Native accessibility state.',
        props: ['value', 'defaultValue'],
      },
      {
        title: 'Activation behavior',
        description:
          'Use activation mode and orientation consistently with the platform navigation pattern.',
        props: ['activationMode', 'orientation'],
      },
    ],
  },
  related: ['radio-group', 'button'],
});
