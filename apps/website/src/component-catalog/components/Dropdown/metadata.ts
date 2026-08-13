import { defineComponentPageMetadata } from '../../metadata';

export default defineComponentPageMetadata({
  react: {
    children: `<Dropdown.Trigger>Actions</Dropdown.Trigger>
<Dropdown.Content>
  <Dropdown.Item>Profile</Dropdown.Item>
  <Dropdown.Item>Settings</Dropdown.Item>
  <Dropdown.Separator />
  <Dropdown.Item color='danger'>Sign out</Dropdown.Item>
</Dropdown.Content>`,
  },
  native: {
    responsivePresentation: true,
    children: `<Dropdown.Trigger>Actions</Dropdown.Trigger>
<Dropdown.Content>
  <Dropdown.Item value='profile'>Profile</Dropdown.Item>
  <Dropdown.Item value='settings'>Settings</Dropdown.Item>
  <Dropdown.Separator />
  <Dropdown.Item value='sign-out' color='danger'>Sign out</Dropdown.Item>
</Dropdown.Content>`,
  },
  demo: {
    initialValues: {
      size: 'md',
      color: 'primary',
      disabled: false,
      loading: false,
      searchable: false,
      command: false,
    },
  },
  defaults: {
    shared: {
      size: 'md',
      color: 'primary',
      disabled: false,
      loading: false,
      closeOnSelect: true,
      searchable: false,
      command: false,
    },
    react: {
      portal: true,
      avoidCollisions: true,
      modal: false,
      loop: true,
      offset: 8,
    },
    native: {
      presentation: 'auto',
      placement: 'bottom-start',
      offset: 8,
      showArrow: true,
    },
  },
  examples: [
    {
      title: 'Basic',
      description: 'Action menu with common items.',
      props: [],
    },
    {
      title: 'Searchable',
      description: 'Filter menu items.',
      props: ['searchable'],
    },
    {
      title: 'Loading',
      description: 'Loading menu state.',
      props: ['loading'],
    },
    {
      title: 'Disabled',
      description: 'Disabled trigger state.',
      props: ['disabled'],
    },
  ],
  api: {
    sections: [
      { name: 'Dropdown.Trigger', exportName: 'DropdownTriggerProps' },
      { name: 'Dropdown.Content', exportName: 'DropdownContentProps' },
      { name: 'Dropdown.Search', exportName: 'DropdownSearchProps' },
      { name: 'Dropdown.Item', exportName: 'DropdownItemProps' },
      { name: 'Dropdown.Group', exportName: 'DropdownGroupProps' },
      { name: 'Dropdown.Label', exportName: 'DropdownLabelProps' },
      { name: 'Dropdown.Separator', exportName: 'DropdownSeparatorProps' },
      { name: 'Dropdown.Empty', exportName: 'DropdownEmptyProps' },
      { name: 'Dropdown.Loading', exportName: 'DropdownLoadingProps' },
    ],
  },
  accessibility: {
    react: [
      {
        title: 'Trigger naming',
        description:
          'Use trigger content that clearly communicates the menu purpose.',
        props: ['children', 'aria-label'],
      },
      {
        title: 'Keyboard menu behavior',
        description:
          'Preserve arrow-key navigation, Escape dismissal, and focus return to the trigger.',
        props: ['loop', 'modal', 'open'],
      },
      {
        title: 'Item states',
        description:
          'Use disabled and color state to communicate unavailable or destructive actions.',
        props: ['disabled', 'color'],
      },
    ],
    native: [
      {
        title: 'Trigger naming',
        description:
          'Provide visible trigger text or accessibilityLabel for the menu trigger.',
        props: ['label', 'accessibilityLabel'],
      },
      {
        title: 'Presentation semantics',
        description:
          'Choose sheet, modal, or popover presentation based on screen size and interaction context.',
        props: ['presentation', 'placement'],
      },
      {
        title: 'Selection state',
        description:
          'Keep selected, disabled, and loading state reflected in item labels and accessibility state.',
        props: ['disabled', 'loading', 'onSelect'],
      },
    ],
  },
  related: ['button', 'select', 'popover'],
});
