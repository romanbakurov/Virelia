import { defineComponentPageMetadata } from '../../metadata';

export default defineComponentPageMetadata({
  react: {
    children: `<Tooltip.Trigger>Hover for details</Tooltip.Trigger>
<Tooltip.Content>Helpful contextual label.</Tooltip.Content>`,
  },
  native: {
    children: `<Tooltip.Trigger>Press for details</Tooltip.Trigger>
<Tooltip.Content>Helpful contextual label.</Tooltip.Content>`,
  },
  defaults: {
    shared: {
      placement: 'top',
      disabled: false,
    },
  },
  examples: [
    {
      title: 'Basic',
      description: 'Contextual label for a trigger.',
      props: [],
    },
    {
      title: 'Placement',
      description: 'Alternative tooltip placement.',
      props: [`placement='bottom'`],
    },
    {
      title: 'Disabled',
      description: 'Disabled tooltip behavior.',
      props: ['disabled'],
    },
  ],
  api: {
    sections: [
      { name: 'Tooltip.Trigger', exportName: 'TooltipTriggerProps' },
      { name: 'Tooltip.Content', exportName: 'TooltipContentProps' },
    ],
  },
  accessibility: {
    react: [
      {
        title: 'Supplemental text',
        description:
          'Use tooltips for supplemental labels, not as the only way to complete a task.',
        props: ['children', 'disabled'],
      },
      {
        title: 'Delay behavior',
        description:
          'Choose open and close delays that keep hover and focus behavior predictable.',
        props: ['delay', 'onOpenChange'],
      },
    ],
    native: [
      {
        title: 'Supplemental text',
        description:
          'Keep tooltip content concise and make critical information available outside the tooltip.',
        props: ['children', 'disabled'],
      },
      {
        title: 'Placement',
        description:
          'Use placement that keeps the tooltip near its trigger without covering the control.',
        props: ['placement'],
      },
    ],
  },
  related: ['button', 'popover'],
});
