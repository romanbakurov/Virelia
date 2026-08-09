export type ComponentCategory =
  'forms' | 'overlays' | 'navigation' | 'primitives';

export type ComponentStatus = 'stable' | 'beta';

export type ComponentCatalogEntry = {
  slug: string;
  name: string;
  description: string;
  category: ComponentCategory;
  docsUrl: string;
  status: ComponentStatus;
};
