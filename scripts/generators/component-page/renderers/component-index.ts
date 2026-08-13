import { identifierFromSlug } from '../helpers/format';
import type { Platform } from '../model/types';

export function renderComponentIndex(params: {
  componentName: string;
  slug: string;
  platforms: readonly Platform[];
  generatedFileHeader: string;
}) {
  const { componentName, slug, platforms, generatedFileHeader } = params;
  const slugIdentifier = identifierFromSlug(slug);

  return `${generatedFileHeader}export { ${componentName}Accessibility } from './${componentName}Accessibility';
${platforms.includes('react') ? `export { ${componentName}Demo } from './${componentName}Demo';\n` : ''}export { ${componentName}Examples } from './${componentName}Examples';
export {
  ${componentName}Playground,
  initial${componentName}PlaygroundValue,
} from './${componentName}Playground';
export { ${componentName}Usage } from './${componentName}Usage';
${platforms.includes('react-native') ? `export { Native${componentName}Demo } from './Native${componentName}Demo';\n` : ''}export { ${slugIdentifier}Api } from './${slug}Api';

export type {
  ${componentName}PlaygroundValue,
} from './${componentName}Playground';
`;
}
