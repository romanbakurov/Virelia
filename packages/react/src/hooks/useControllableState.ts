import { useCallback, useState } from 'react';

//Сделать одинаковую работу для:
// controlled (value + onChange)
// uncontrolled (internal state)
interface UseControllableStateProps<T> {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}

export const useControllableState = <T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateProps<T>) => {
  const [internalValue, setInternalValue] = useState<T>(defaultValue);

  const isControlled = value !== undefined;

  const currentValue = isControlled ? value : internalValue;

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) {
        setInternalValue(next);
      }
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  return [currentValue, setValue] as const;
};
