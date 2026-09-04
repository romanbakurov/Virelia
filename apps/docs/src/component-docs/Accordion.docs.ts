import { defineComponentDocs } from './defineComponentDocs';

export const accordionDocs = defineComponentDocs({
  component: 'Accordion',
  platforms: {
    react: {
      title: 'Accordion - React Disclosure Component',
      description:
        'Build accessible React accordions with compound items, single or multiple expansion, controlled state, default values, and collapsible panels.',
      summary:
        'Accordion organizes related sections that can be expanded in place without navigating away from the current page.',
      whenToUse: [
        'Progressive disclosure in settings, FAQs, summaries, and dense detail pages.',
        'Use single mode when one section should stay in focus at a time.',
        'Use multiple mode when users need to compare details across sections.',
        'Use Tabs instead when sections are peer views that should occupy the same level of navigation.',
      ],
      storybook: {
        story: 'Default',
        title: 'Components/Accordion',
        height: 420,
      },
      accessibility: [
        'Accordion.Trigger renders a native button and exposes expanded state with aria-expanded.',
        'Each trigger is connected to its content region with aria-controls.',
        'Native button keyboard behavior supports Tab navigation plus Enter and Space activation.',
        'Disabled accordions or items are removed from interaction through disabled button semantics.',
      ],
      seeAlso: [
        {
          component: 'Tabs',
          label: 'Tabs for peer sections that act like page-level views.',
        },
        {
          component: 'Dropdown',
          label: 'Dropdown for compact menus and action lists.',
        },
        {
          component: 'Popover',
          label: 'Popover for floating contextual content.',
        },
      ],
    },
    'react-native': {
      title: 'React Native Accordion',
      description:
        'Build React Native accordions with compound items, single or multiple expansion, controlled state, default values, and native disabled semantics.',
      summary:
        'Accordion organizes expandable sections inside a native screen while keeping related content in context.',
      whenToUse: [
        'Settings groups, account details, FAQs, and compact mobile screens.',
        'Use single mode when only one section should be open.',
        'Use multiple mode when users may need several sections visible at once.',
        'Use Tabs when switching between peer screen sections rather than revealing details inline.',
      ],
      accessibility: [
        "Accordion.Trigger uses accessibilityRole='button' and exposes expanded and disabled state through accessibilityState.",
        'React Native does not use DOM attributes such as aria-controls.',
        'Textual children inside Accordion.Content should be rendered with React Native Text components.',
        'Verify important accordion flows with VoiceOver and TalkBack on target devices.',
      ],
      seeAlso: [
        {
          component: 'Tabs',
          label: 'Tabs for peer sections within a screen.',
        },
        {
          component: 'Dropdown',
          label: 'Dropdown for compact native action lists.',
        },
        {
          component: 'Popover',
          label: 'Popover for floating contextual content.',
        },
      ],
    },
  },
});
