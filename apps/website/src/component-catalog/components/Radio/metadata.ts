import { defineComponentPageMetadata } from '../../metadata';

export default defineComponentPageMetadata({
  react: {
    demoProps: 'value="option"',
  },
  native: {
    demoProps: 'value="option"',
  },
  demo: {
    label: 'Email notifications',
    description: 'Receive updates by email.',
    excludeControls: ['value', 'required'],
    initialValues: {
      size: 'md',
      color: 'primary',
      checked: false,
      disabled: false,
      error: '',
    },
    previewWidth: 'field',
  },

  defaults: {
    shared: {
      defaultChecked: false,
      disabled: false,
      required: false,
      size: 'md',
      color: 'primary',
    },
  },

  examples: [
    {
      title: 'Basic',
      description: 'Standalone radio option.',
      props: [],
    },
    {
      title: 'Selected',
      description: 'Selected state.',
      props: ['checked'],
    },
    {
      title: 'Disabled',
      description: 'Disabled state.',
      props: ['disabled'],
    },
    {
      title: 'Required',
      description: 'Required form control.',
      props: ['required'],
    },
    {
      title: 'Error',
      description: 'Validation error state.',
      props: [`error='Please choose an option.'`],
    },
    {
      title: 'Size and color',
      description: 'Large semantic radio treatment.',
      props: [`size='lg'`, `color='success'`],
    },
  ],

  related: ['radio-group', 'checkbox', 'select'],
});
