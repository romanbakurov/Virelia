export const STORYBOOK_STORIES = {
  'button.icons': 'primitives-button--with-icons',
  'button.matrix': 'primitives-button--matrix',
  'checkbox.states': 'primitives-checkbox--states',
  'dropdown.groups': 'components-dropdown--with-groups',
  'formField.complete': 'patterns-formfield--complete-example',
  'input.validation': 'primitives-input--validation',
  'modal.basic': 'components-modal--basic',
  'overview.web': 'overview-web--overview',
  'radioGroup.states': 'components-radiogroup--states',
  'select.selection': 'components-select--selection',
  'tabs.controlled': 'components-tabs--controlled',
  'tooltip.triggers': 'components-tooltip--different-triggers',
} as const;

export type StorybookStoryKey = keyof typeof STORYBOOK_STORIES;
