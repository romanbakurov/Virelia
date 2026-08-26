import { defineComponentDocs } from './defineComponentDocs';

// Documentation contract ownership:
// - packages/metadata owns machine-readable facts such as support, category,
//   layer, status, requirements, dependencies, capabilities, and API shape.
// - component docs contracts own editorial content written for humans.
// - Future #592 rendering combines metadata, this contract, and existing API
//   information; a platform block here never declares support by itself.
// - Subjective prose is not inferred from source implementation, and
//   deterministic docs generation must not depend on AI or LLM output.
export const switchDocs = defineComponentDocs({
  component: 'Switch',
  platforms: {
    react: {
      title: 'Switch - React Toggle Component',
      description:
        'Build accessible React switches for immediate boolean settings such as notifications, feature flags, and persistent preferences.',
      summary:
        'Switch represents an immediate boolean setting, where changing the value applies right away.',
      whenToUse: [
        'Enable or disable notifications.',
        'Turn synchronization on or off.',
        'Enable a product feature.',
        'Toggle a persistent preference.',
        'Use Checkbox instead when the value is part of a form submission or represents an independent selection.',
      ],
      storybook: {
        story: 'Default',
        title: 'Primitives/Switch',
        height: 320,
      },
      accessibility: [
        "Switch renders a native button with role='switch' and exposes its state with aria-checked.",
        'Provide a meaningful accessibilityLabel when surrounding content does not already make the purpose obvious.',
        'Do not rely on the default Switch label for production interfaces with multiple switches.',
        'Required, invalid, and disabled state are reflected through platform accessibility semantics.',
      ],
      seeAlso: [
        {
          component: 'Checkbox',
          label: 'Checkbox for independent form selections.',
        },
        {
          component: 'FormField',
          label: 'FormField for labels, descriptions, and validation layout.',
        },
      ],
    },
    'react-native': {
      title: 'React Native Switch',
      description:
        'Build accessible React Native switches for immediate settings with native accessibility semantics.',
      summary:
        'Switch represents an immediate boolean setting such as notifications, synchronization, or a persistent preference.',
      whenToUse: [
        'Notifications.',
        'Background synchronization.',
        'Feature enablement.',
        'Persistent user preferences.',
        'Use Checkbox for form-like independent selections.',
      ],
      accessibility: [
        "Switch uses accessibilityRole='switch' and exposes checked and disabled state through accessibilityState.",
        'Provide a meaningful accessibilityLabel for every production switch whose purpose is not already obvious.',
        "Required and invalid state are currently communicated through the component's accessibility hint.",
        'Verify state announcements with VoiceOver and TalkBack when Switch is used in critical settings flows.',
      ],
      seeAlso: [
        {
          component: 'Checkbox',
          label: 'Checkbox for form-like independent selections.',
        },
        {
          component: 'FormField',
          label: 'FormField for labels, descriptions, and validation layout.',
        },
      ],
    },
  },
});
