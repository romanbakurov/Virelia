import { useControllableState } from './useControllableState.js';

export interface UseTabsParams {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export const useTabs = ({
  value: controlledValue,
  defaultValue = '',
  onValueChange,
}: UseTabsParams) => {
  const [value, setValue] = useControllableState({
    value: controlledValue,
    defaultValue,
    onChange: onValueChange,
  });

  return {
    value,
    setValue,
  };
};
