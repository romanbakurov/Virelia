import type { ComponentApiProp } from '../components/ComponentApi';

const reactSelectApi: readonly ComponentApiProp[] = [
  {
    name: 'required',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Marks the field and compatible child controls as required.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Disables the field and compatible child controls.',
  },
  {
    name: 'multiple',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Enables multiple selection when true.',
  },
  {
    name: 'value',
    type: 'string | SelectMultipleValue',
    description: 'Controlled selected value or values.',
  },
  {
    name: 'defaultValue',
    type: 'string | SelectMultipleValue',
    description: 'Initial selected value or values for uncontrolled usage.',
  },
  {
    name: 'onValueChange',
    type: '((value: SelectValue) => void) | ((value: SelectMultipleValue) => void)',
    description: 'Called when the selected value or values change.',
  },
  {
    name: 'placeholder',
    type: 'string',
    defaultValue: "'Select...'",
    description: 'Placeholder shown when no value is selected.',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    defaultValue: "'md'",
    description: 'Controls the overall select size.',
  },
  {
    name: 'color',
    type: "'primary' | 'neutral' | 'success' | 'warning' | 'danger'",
    defaultValue: "'primary'",
    description: 'Semantic color palette for the control.',
  },
  {
    name: 'variant',
    type: "'outline' | 'filled' | 'soft'",
    defaultValue: "'outline'",
    description: 'Visual variant for the select trigger.',
  },
  {
    name: 'invalid',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Shows invalid styling without requiring error text.',
  },
  {
    name: 'loading',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Shows the select in a loading state.',
  },
  {
    name: 'clearable',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Shows a clear action when the select has a value.',
  },
  {
    name: 'searchable',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Enables option filtering through a search field.',
  },
  {
    name: 'maxSelected',
    type: 'number',
    description: 'Maximum number of values that can be selected.',
  },
  {
    name: 'closeOnSelect',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Controls whether the overlay closes after selecting an option.',
  },
  {
    name: 'virtual',
    type: 'boolean | SelectVirtualConfig',
    description: 'Enables virtualization for large option collections.',
  },
  {
    name: 'avoidCollisions',
    type: 'boolean',
    defaultValue: 'true',
    description:
      'Adjusts floating content placement to avoid viewport collisions.\nAdjusts floating content to stay within viewport boundaries.',
  },
  {
    name: 'modal',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Uses modal interaction semantics for the overlay.\nUses modal interaction semantics while the dropdown is open.',
  },
  {
    name: 'command',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Enables command-style interaction behavior.\nEnables command-palette style search behavior.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Custom option elements rendered inside the select.',
  },
  {
    name: 'label',
    type: 'ReactNode',
    description: 'Visible field label.',
  },
  {
    name: 'description',
    type: 'ReactNode',
    description: 'Supporting text linked to the control.',
  },
  {
    name: 'id',
    type: 'string',
    description: 'Unique id applied to the select trigger.',
  },
  {
    name: 'name',
    type: 'string',
    description: 'Form field name submitted with the selected value.',
  },
  {
    name: 'aria-label',
    type: 'string',
    description:
      'Accessible name for the select trigger when no visible label is used.',
  },
  {
    name: 'aria-describedby',
    type: 'string',
    description: 'Ids of elements that describe the select trigger.',
  },
  {
    name: 'aria-labelledby',
    type: 'string',
    description: 'Ids of elements that label the select trigger.',
  },
  {
    name: 'error',
    type: 'ReactNode',
    description:
      'Error message linked to the control. Also implies invalid state.',
  },
  {
    name: 'empty',
    type: 'ReactNode',
    description: 'Content shown when no options match the current query.',
  },
  {
    name: 'loadingText',
    type: 'ReactNode',
    description: 'Content shown while options are loading.',
  },
  {
    name: 'placement',
    type: "'top' | 'right' | 'bottom' | 'left'",
    defaultValue: "'bottom'",
    description: 'Floating content placement relative to the trigger.',
  },
  {
    name: 'matchTriggerWidth',
    type: 'boolean',
    defaultValue: 'true',
    description: 'Matches dropdown width to the trigger width.',
  },
  {
    name: 'portal',
    type: 'boolean',
    defaultValue: 'true',
    description: 'Renders dropdown content through a portal.',
  },
  {
    name: 'open',
    type: 'boolean',
    description: 'Controlled open state.',
  },
  {
    name: 'defaultOpen',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Initial open state for uncontrolled usage.',
  },
  {
    name: 'onOpenChange',
    type: '((open: boolean) => void)',
    description: 'Called when the open state changes.',
  },
  {
    name: 'onSearch',
    type: '((value: string) => void)',
    description: 'Called when the search query changes.',
  },
  {
    name: 'onClear',
    type: '(() => void)',
    description: 'Called when the clear action is activated.',
  },
  {
    name: 'startIcon',
    type: 'ReactNode',
    description: 'Icon rendered before the selected value.',
  },
  {
    name: 'endIcon',
    type: 'ReactNode',
    description: 'Icon rendered after the selected value.',
  },
  {
    name: 'prefix',
    type: 'ReactNode',
    description: 'Content rendered before the trigger value.',
  },
  {
    name: 'suffix',
    type: 'ReactNode',
    description: 'Content rendered after the trigger value.',
  },
  {
    name: 'renderValue',
    type: '((context: SelectRenderValueContext) => ReactNode)',
    description: 'Custom renderer for the trigger value.',
  },
  {
    name: 'renderOption',
    type: '((context: SelectRenderOptionContext) => ReactNode)',
    description: 'Custom renderer for each dropdown option.',
  },
  {
    name: 'onBlur',
    type: 'FocusEventHandler<HTMLButtonElement>',
    description: 'Called when the select trigger loses focus.',
  },
  {
    name: 'onFocus',
    type: 'FocusEventHandler<HTMLButtonElement>',
    description: 'Called when the select trigger receives focus.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Class name applied to the root element.',
  },
  {
    name: 'triggerClassName',
    type: 'string',
    description: 'Class name applied to the trigger element.',
  },
  {
    name: 'dropdownClassName',
    type: 'string',
    description: 'Class name applied to the dropdown element.',
  },
];

const nativeSelectApi: readonly ComponentApiProp[] = [
  {
    name: 'placeholder',
    type: 'string',
    defaultValue: "'Select...'",
    description: 'Placeholder shown when no value is selected.',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    defaultValue: "'md'",
    description: 'Controls the overall select size.',
  },
  {
    name: 'color',
    type: "'primary' | 'neutral' | 'success' | 'warning' | 'danger'",
    defaultValue: "'primary'",
    description: 'Semantic color palette for the control.',
  },
  {
    name: 'variant',
    type: "'outline' | 'filled' | 'soft'",
    defaultValue: "'outline'",
    description: 'Visual variant for the select trigger.',
  },
  {
    name: 'invalid',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Shows invalid styling without requiring error text.',
  },
  {
    name: 'required',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Marks the field and compatible child controls as required.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Disables the field and compatible child controls.',
  },
  {
    name: 'loading',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Shows the select in a loading state.',
  },
  {
    name: 'clearable',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Shows a clear action when the select has a value.',
  },
  {
    name: 'searchable',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Enables option filtering through a search field.',
  },
  {
    name: 'maxSelected',
    type: 'number',
    description: 'Maximum number of values that can be selected.',
  },
  {
    name: 'closeOnSelect',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Controls whether the overlay closes after selecting an option.',
  },
  {
    name: 'label',
    type: 'string',
    description: 'Visible field label.',
  },
  {
    name: 'description',
    type: 'string',
    description: 'Supporting text linked to the control.',
  },
  {
    name: 'error',
    type: 'ReactNode',
    description:
      'Error message linked to the control. Also implies invalid state.',
  },
  {
    name: 'open',
    type: 'boolean',
    description: 'Controlled open state.',
  },
  {
    name: 'defaultOpen',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Initial open state for uncontrolled usage.',
  },
  {
    name: 'onOpenChange',
    type: '((open: boolean) => void)',
    description: 'Called when the open state changes.',
  },
  {
    name: 'searchPlaceholder',
    type: 'string',
    description: 'Placeholder shown in the search field.',
  },
  {
    name: 'loadingText',
    type: 'string',
    description: 'Text shown while options are loading.',
  },
  {
    name: 'onSearch',
    type: '((value: string) => void)',
    description: 'Called when the search query changes.',
  },
  {
    name: 'filterOptions',
    type: 'boolean',
    description: 'Enables built-in option filtering for the search query.',
  },
  {
    name: 'filter',
    type: '((option: SelectOption, query: string) => boolean)',
    description:
      'Custom predicate used to filter options for the search query.',
  },
  {
    name: 'empty',
    type: 'ReactNode',
    description: 'Content shown when no options match the current query.',
  },
  {
    name: 'startIcon',
    type: 'SelectIconElement',
    description: 'Icon rendered before the selected value.',
  },
  {
    name: 'endIcon',
    type: 'SelectIconElement',
    description: 'Icon rendered after the selected value.',
  },
  {
    name: 'prefix',
    type: 'ReactNode',
    description: 'Content rendered before the trigger value.',
  },
  {
    name: 'suffix',
    type: 'ReactNode',
    description: 'Content rendered after the trigger value.',
  },
  {
    name: 'renderValue',
    type: 'SelectRenderValue',
    description: 'Custom renderer for the trigger value.',
  },
  {
    name: 'renderOption',
    type: 'SelectRenderOption',
    description: 'Custom renderer for each option row.',
  },
  {
    name: 'presentation',
    type: "'auto' | 'sheet' | 'modal' | 'popover'",
    defaultValue: "'auto'",
    description: 'Presentation mode used for the option overlay.',
  },
  {
    name: 'placement',
    type: "'top' | 'top-start' | 'top-end' | 'right' | 'right-start' | 'right-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end'",
    defaultValue: "'bottom-start'",
    description: 'Floating placement used by popover presentation.',
  },
  {
    name: 'offset',
    type: 'number',
    defaultValue: '8',
    description: 'Distance between the trigger and floating content.',
  },
  {
    name: 'matchTriggerWidth',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Matches floating content width to the trigger width.',
  },
  {
    name: 'dismissOnBackdropPress',
    type: 'boolean',
    defaultValue: 'true',
    description: 'Allows pressing the backdrop to dismiss the select overlay.',
  },
  {
    name: 'virtual',
    type: 'boolean | SelectVirtualConfig',
    description: 'Enables virtualized option rendering for large lists.',
  },
  {
    name: 'options',
    type: 'SelectOption[]',
    description: 'Option data used to populate the native select.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Custom option elements rendered inside the select.',
  },
  {
    name: 'style',
    type: 'StyleProp<ViewStyle>',
    description: 'Style applied to the root container.',
  },
  {
    name: 'triggerStyle',
    type: 'StyleProp<ViewStyle>',
    description: 'Style applied to the trigger container.',
  },
  {
    name: 'textStyle',
    type: 'StyleProp<TextStyle>',
    description: 'Style applied to trigger text.',
  },
  {
    name: 'contentStyle',
    type: 'StyleProp<ViewStyle>',
    description: 'Style applied to the overlay content.',
  },
  {
    name: 'optionStyle',
    type: 'StyleProp<ViewStyle>',
    description: 'Style applied to each option row.',
  },
  {
    name: 'searchStyle',
    type: 'StyleProp<TextStyle>',
    description: 'Style applied to the search input.',
  },
  {
    name: 'accessibilityLabel',
    type: 'string',
    description: 'Accessible name announced by screen readers.',
  },
  {
    name: 'accessibilityHint',
    type: 'string',
    description: 'Additional accessibility hint for the select trigger.',
  },
  {
    name: 'testID',
    type: 'string',
    description: 'Test identifier forwarded to the native control.',
  },
  {
    name: 'multiple',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Enables multiple selection when true.',
  },
  {
    name: 'value',
    type: 'string | string[] | null',
    description: 'Controlled selected value or values.',
  },
  {
    name: 'defaultValue',
    type: 'string | string[] | null',
    description: 'Initial selected value or values for uncontrolled usage.',
  },
  {
    name: 'onValueChange',
    type: '((value: string | null) => void) | ((value: string[]) => void)',
    description: 'Called when the selected value or values change.',
  },
];

const inheritedReactSelectApi: readonly ComponentApiProp[] = [];

const inheritedNativeSelectApi: readonly ComponentApiProp[] = [];

export const selectApi = {
  react: reactSelectApi,
  'react-native': nativeSelectApi,
  inherited: {
    react: inheritedReactSelectApi,
    'react-native': inheritedNativeSelectApi,
  },
} as const;
