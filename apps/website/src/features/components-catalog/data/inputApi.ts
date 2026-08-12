import type { ComponentApiProp } from '../components/ComponentApi';

const sharedInputApi: readonly ComponentApiProp[] = [
  {
    name: 'label',
    type: 'string',
    description: 'Visible field label.',
  },
  {
    name: 'description',
    type: 'string',
    description:
      'Supporting text rendered with the field and linked to the control.',
  },
  {
    name: 'placeholder',
    type: 'string',
    description: 'Placeholder shown when the value is empty.',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    defaultValue: "'md'",
    description: 'Controls the overall input size.',
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
    description: 'Visual variant for the input chrome.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Disables input interaction.',
  },
  {
    name: 'readOnly',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Makes the control non-editable while preserving focus and value semantics.',
  },
  {
    name: 'required',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Marks the field as required.',
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
    description: 'Shows a loading indicator and makes the field read-only.',
  },
  {
    name: 'clearable',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Shows a clear action when the field has a value.',
  },
  {
    name: 'onClear',
    type: '() => void',
    description: 'Called when the clear action is activated.',
  },
  {
    name: 'revealPassword',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Shows a password visibility toggle for password inputs.',
  },
  {
    name: 'showCounter',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Shows the current character count when maxLength is provided.',
  },
  {
    name: 'mask',
    type: 'InputMask',
    description:
      'Masks input values. String masks use # as a digit placeholder.',
  },
  {
    name: 'format',
    type: 'InputFormatter',
    description:
      'Formats the displayed value without changing the controlled value.',
  },
  {
    name: 'parse',
    type: 'InputParser',
    description:
      'Parses a formatted display value before mask and onValueChange.',
  },
  {
    name: 'error',
    type: 'string',
    description: 'Error message. Also implies invalid state.',
  },
];

const reactInputApi: readonly ComponentApiProp[] = [
  ...sharedInputApi,
  {
    name: 'type',
    type: 'HTML input type',
    defaultValue: "'text'",
    description:
      'Native input type. Search automatically adds a start search icon.',
  },
  {
    name: 'value',
    type: 'HTMLInputElement value',
    description: 'Controlled input value.',
  },
  {
    name: 'defaultValue',
    type: 'HTMLInputElement value',
    description: 'Initial uncontrolled input value.',
  },
  {
    name: 'onValueChange',
    type: '(value: string) => void',
    description: 'Called with the next string value.',
  },
  {
    name: 'id',
    type: 'string',
    description:
      'Control id. Inherits the generated FormField id when omitted.',
  },
  {
    name: 'name',
    type: 'string',
    description: 'Native input name.',
  },
  {
    name: 'startIcon',
    type: 'ReactNode',
    description: 'Icon rendered at the start of the control.',
  },
  {
    name: 'endIcon',
    type: 'ReactNode',
    description:
      'Icon rendered in the right slot when no higher-priority action is active.',
  },
  {
    name: 'startAddon',
    type: 'ReactNode',
    description: 'Segmented addon rendered before the input.',
  },
  {
    name: 'endAddon',
    type: 'ReactNode',
    description: 'Segmented addon rendered after the input.',
  },
  {
    name: 'prefix',
    type: 'ReactNode',
    description: 'Inline prefix rendered inside the input chrome.',
  },
  {
    name: 'suffix',
    type: 'ReactNode',
    description: 'Inline suffix rendered inside the input chrome.',
  },
  {
    name: 'clearIcon',
    type: 'ReactNode',
    description: 'Custom clear action content.',
  },
  {
    name: 'startIconTone',
    type: 'InputAdornmentTone',
    defaultValue: "'default'",
    description: 'Tone applied to the start icon.',
  },
  {
    name: 'endIconTone',
    type: 'InputAdornmentTone',
    defaultValue: "'default'",
    description: 'Tone applied to the end icon.',
  },
  {
    name: 'clearIconTone',
    type: 'InputAdornmentTone',
    defaultValue: "'default'",
    description: 'Tone applied to the clear icon.',
  },
  {
    name: 'wrapperClassName',
    type: 'string',
    description:
      'Class name applied to the outer FormField wrapper in shorthand mode.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Class name applied to the native input element.',
  },
  {
    name: 'autoComplete',
    type: 'string',
    description:
      'Native autocomplete value. Sensible defaults are derived from type when omitted.',
  },
];

const nativeInputApi: readonly ComponentApiProp[] = [
  ...sharedInputApi,
  {
    name: 'type',
    type: "'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'",
    defaultValue: "'text'",
    description:
      'Semantic input type used to derive keyboard and secure-entry behavior.',
  },
  {
    name: 'value',
    type: 'string',
    description: 'Controlled input value.',
  },
  {
    name: 'defaultValue',
    type: 'string',
    description: 'Initial uncontrolled input value.',
  },
  {
    name: 'onValueChange',
    type: '(value: string) => void',
    description: 'Called with the next string value.',
  },
  {
    name: 'startIcon',
    type: 'InputIconElement',
    description: 'Icon rendered at the start of the control.',
  },
  {
    name: 'endIcon',
    type: 'InputIconElement',
    description:
      'Icon rendered at the end of the control when no action is active.',
  },
  {
    name: 'clearIcon',
    type: 'InputIconElement',
    description: 'Custom clear action icon.',
  },
  {
    name: 'startIconTone',
    type: 'InputAdornmentTone',
    defaultValue: "'default'",
    description: 'Tone applied to the start icon.',
  },
  {
    name: 'endIconTone',
    type: 'InputAdornmentTone',
    defaultValue: "'default'",
    description: 'Tone applied to the end icon.',
  },
  {
    name: 'clearIconTone',
    type: 'InputAdornmentTone',
    defaultValue: "'default'",
    description: 'Tone applied to the clear icon.',
  },
  {
    name: 'iconSize',
    type: 'number',
    description: 'Overrides the icon size in pixels.',
  },
  {
    name: 'containerStyle',
    type: 'StyleProp<ViewStyle>',
    description: 'Extra styles applied to the outer container.',
  },
  {
    name: 'inputStyle',
    type: 'StyleProp<TextStyle>',
    description: 'Extra styles applied to the native TextInput.',
  },
  {
    name: 'testID',
    type: 'string',
    description: 'Identifier used by automated tests.',
  },
  {
    name: 'keyboardType',
    type: 'NativeInputKeyboardType',
    description: 'Overrides the native keyboard type.',
  },
  {
    name: 'secureTextEntry',
    type: 'boolean',
    description: 'Overrides native secure text entry behavior.',
  },
];

export const inputApi = {
  react: reactInputApi,
  'react-native': nativeInputApi,
} as const;
