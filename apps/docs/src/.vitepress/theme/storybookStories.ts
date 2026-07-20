export const STORYBOOK_STORIES = {
  'button.icons': 'primitives-button--with-icons',
  'button.matrix': 'primitives-button--matrix',
  'checkbox.states': 'primitives-checkbox--states',
  'dropdown.groups': 'components-dropdown--groups',
  'formField.complete': 'patterns-formfield--with-input-context',
  'input.validation': 'primitives-input--validation',
  'modal.basic': 'components-modal--default',
  'overview.web': 'overview-web--overview',
  'radioGroup.states': 'components-radiogroup--states',
  'select.selection': 'components-select--simple-usage',
  'tabs.controlled': 'components-tabs--controlled',
  'tooltip.triggers': 'components-tooltip--triggers',
} as const;

export type StorybookStoryKey = keyof typeof STORYBOOK_STORIES;
