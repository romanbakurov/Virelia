import { createContext, useContext } from 'react';

import type { InputSize } from '@vellira-ui/types';

export type NativeFormFieldContextValue = {
  controlId: string;
  labelId?: string;
  descriptionId?: string;
  errorId?: string;
  required: boolean;
  disabled: boolean;
  invalid: boolean;
  size: InputSize;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
};

export const FormFieldContext =
  createContext<NativeFormFieldContextValue | null>(null);

export const useFormFieldContext = () => useContext(FormFieldContext);
