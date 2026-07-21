import { useControllableState } from './useControllableState';

export interface UseTabsParams {
  activeIndex?: number;
  defaultActiveIndex?: number;
  onChange?: (index: number) => void;
  orientation?: 'horizontal' | 'vertical';
}

export const useTabs = ({
  activeIndex: controlledActiveIndex,
  defaultActiveIndex = 0,
  onChange,
}: UseTabsParams) => {
  const [activeIndex, setActiveIndex] = useControllableState({
    value: controlledActiveIndex,
    defaultValue: defaultActiveIndex,
    onChange,
  });

  return {
    activeIndex,
    setActiveIndex,
  };
};
