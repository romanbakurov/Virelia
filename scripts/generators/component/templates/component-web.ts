import type { ComponentTemplateParams } from './component-types';

export function renderWebComponentTemplate({
  componentName,
}: ComponentTemplateParams) {
  const className = `${componentName[0].toLowerCase()}${componentName.slice(1)}`;

  return `import type { ${componentName}Props } from './types';

import styles from './${componentName}.module.scss';

export function ${componentName}({
  children,
}: ${componentName}Props) {
  return <div className={styles.${className}}>{children}</div>;
}
`;
}
