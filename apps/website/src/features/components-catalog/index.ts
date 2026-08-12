export { ComponentsPageHero } from './components/ComponentsPageHero';
export { ComponentSidebar } from './components/ComponentSidebar';
export { ComponentExplorer } from './components/ComponentExplorer';
export { ComponentHeader } from './components/ComponentHeader';
export { ComponentsHeader } from './components/ComponentsHeader';
export { ComponentPlayground } from './components/ComponentPlayground';
export { ComponentPlatformView } from './components/ComponentPlatformView';
export { ComponentCodeBlock } from './components/ComponentCodeBlock';
export { ComponentApi, type ComponentApiProp } from './components/ComponentApi';
export { RelatedComponents } from './components/RelatedComponents';
export {
  ComponentExamples,
  type ComponentExampleItem,
} from './components/ComponentExamples';
export {
  ComponentDemoStateProvider,
  useComponentDemoState,
} from './components/ComponentDemoStateProvider';
export {
  ComponentNavigationProvider,
  useComponentNavigation,
} from './components/ComponentNavigationProvider';
export {
  ComponentAccessibility,
  type AccessibilityItem,
} from './components/ComponentAccessibility';

export { componentGroups } from './data/componentGroups';
export { webComponents } from './data/components';
export { getComponentBySlug } from './data/getComponentBySlug';

export { ComponentNavigationTrigger } from './components/ComponentNavigationTrigger';

export type {
  ComponentCatalogEntry,
  ComponentCategory,
  ComponentPlatform,
  ComponentStatus,
} from './types';
