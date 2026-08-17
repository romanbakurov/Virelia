import type { ComponentTemplateParams } from './component-types';

export function renderNativeComponentTemplate({
  componentName,
}: ComponentTemplateParams) {
  const className = `${componentName[0].toLowerCase()}${componentName.slice(1)}`;

  return `import { View } from 'react-native';

import { styles } from './${componentName}.styles';
import type { ${componentName}Props } from './types';

export function ${componentName}({
  children,
}: ${componentName}Props) {
  return <View style={styles.${className}}>{children}</View>;
}
`;
}
