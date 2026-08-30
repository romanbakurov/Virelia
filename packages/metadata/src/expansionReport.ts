import { componentMetadata } from './components';
import { componentExpansionCatalog } from './expansionCatalog';

export const componentExpansionReportSchemaVersion = '1' as const;

export interface ComponentExpansionReport {
  schemaVersion: typeof componentExpansionReportSchemaVersion;
  components: typeof componentMetadata;
  targets: typeof componentExpansionCatalog;
}

export function getComponentExpansionReport(): ComponentExpansionReport {
  return {
    schemaVersion: componentExpansionReportSchemaVersion,
    components: componentMetadata,
    targets: componentExpansionCatalog,
  };
}
