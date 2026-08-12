import type { ComponentApiProp } from '../components/ComponentApi';

const sharedCheckboxApi: readonly ComponentApiProp[] = [];

const reactCheckboxApi: readonly ComponentApiProp[] = [...sharedCheckboxApi];

const nativeCheckboxApi: readonly ComponentApiProp[] = [...sharedCheckboxApi];

export const checkboxApi = {
  react: reactCheckboxApi,
  'react-native': nativeCheckboxApi,
} as const;
