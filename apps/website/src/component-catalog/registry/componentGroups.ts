import { componentCategoryLabels, componentCategoryOrder } from '../types';

import { webComponents } from './components';

export const componentGroups = componentCategoryOrder
  .map((category) => ({
    category,
    label: componentCategoryLabels[category],
    components: webComponents
      .filter((component) => component.category === category)
      .sort((a, b) => a.order - b.order),
  }))
  .filter((group) => group.components.length > 0);
