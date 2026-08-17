import { defineComponentPageMetadata } from '../../metadata';

const reactInputImports = [
  `import { Input as ReactInput } from '@vellira-ui/react';`,
] as const;

const nativeInputImports = [
  `import { Input as NativeInput } from '@vellira-ui/react-native';`,
] as const;

export default defineComponentPageMetadata({
  react: {
    children: `<ReactInput placeholder='name@company.com' type='email' />`,
    imports: reactInputImports,
  },
  native: {
    children: `<NativeInput placeholder='name@company.com' />`,
    imports: nativeInputImports,
  },
  demo: {
    label: 'Email',
    description: 'Used for account notifications.',
    excludeControls: [
      'labelInfo',
      'labelAction',
      'optionalText',
      'orientation',
      'labelPosition',
    ],
    initialValues: {
      label: 'Email',
      description: 'Used for account notifications.',
      message: '',
      messageTone: 'neutral',
      messageLive: 'off',
      required: false,
      disabled: false,
      invalid: false,
      size: 'md',
      orientation: 'vertical',
      labelPosition: 'top',
      error: '',
    },
    previewWidth: 'field',
  },
  defaults: {
    shared: {
      messageTone: 'neutral',
      messageLive: 'off',
      required: false,
      disabled: false,
      invalid: false,
      size: 'md',
      orientation: 'vertical',
    },
    react: {
      labelPosition: 'top',
      bindControl: true,
    },
  },
  examples: [
    {
      title: 'Basic',
      description: 'Labels and describes a composed input control.',
      props: [],
      reactImports: reactInputImports,
      nativeImports: nativeInputImports,
    },
    {
      title: 'Compound API',
      description:
        'Composes label, description, control, and message slots explicitly.',
      props: [],
      inheritDemoProps: false,
      reactImports: reactInputImports,
      nativeImports: nativeInputImports,
      reactChildren: `<FormField.Label>Email</FormField.Label>
<FormField.Description>
  Used for account notifications.
</FormField.Description>
<FormField.Control>
  <ReactInput placeholder='name@company.com' type='email' />
</FormField.Control>
<FormField.Message>
  We will never share your email.
</FormField.Message>`,
      nativeChildren: `<FormField.Label>Email</FormField.Label>
<FormField.Description>
  Used for account notifications.
</FormField.Description>
<FormField.Control>
  <NativeInput placeholder='name@company.com' />
</FormField.Control>
<FormField.Message>
  We will never share your email.
</FormField.Message>`,
    },
    {
      title: 'Required',
      description: 'Shows required field treatment.',
      props: ['required'],
      reactImports: reactInputImports,
      nativeImports: nativeInputImports,
      reactChildren: `<ReactInput placeholder='vellira-design' />`,
      nativeChildren: `<NativeInput placeholder='vellira-design' />`,
    },
    {
      title: 'Error',
      description: 'Prioritizes validation feedback below the control.',
      props: [`error='Enter a valid email address.'`],
      reactImports: reactInputImports,
      nativeImports: nativeInputImports,
    },
    {
      title: 'Message',
      description: 'Displays non-error supporting status content.',
      props: [
        `message='Available workspace slug.'`,
        `messageTone='success'`,
        `messageLive='polite'`,
      ],
      reactImports: reactInputImports,
      nativeImports: nativeInputImports,
      reactChildren: `<ReactInput placeholder='vellira-design' />`,
      nativeChildren: `<NativeInput placeholder='vellira-design' />`,
    },
    {
      title: 'Disabled',
      description: 'Applies disabled field treatment to compatible controls.',
      props: ['disabled'],
      reactImports: reactInputImports,
      nativeImports: nativeInputImports,
    },
  ],
  accessibility: {
    react: [
      {
        title: 'Control relationship',
        description:
          'FormField connects label, description, error, and message ids to compatible controls.',
        props: ['label', 'description', 'error', 'message'],
      },
      {
        title: 'Validation priority',
        description:
          'Error content takes precedence over supporting messages and should explain how to recover.',
        props: ['error', 'invalid', 'message'],
      },
      {
        title: 'Required and disabled state',
        description:
          'Use required and disabled on the field so compatible controls inherit the same state.',
        props: ['required', 'disabled'],
      },
    ],
    native: [
      {
        title: 'Visible field structure',
        description:
          'Use label, description, and error content so the control has clear surrounding context.',
        props: ['label', 'description', 'error'],
      },
      {
        title: 'State propagation',
        description:
          'Compatible Vellira controls inherit disabled, invalid, required, and size through context.',
        props: ['disabled', 'invalid', 'required', 'size'],
      },
      {
        title: 'Accessible state',
        description:
          'Compatible controls announce required and invalid state through React Native accessibility semantics.',
        props: ['required', 'invalid'],
      },
    ],
  },
  related: ['input', 'select', 'checkbox'],
});
