import type { ComponentTemplateParams } from './component-types';

export function renderNativeComponentTemplate({
  componentName,
}: ComponentTemplateParams) {
  const className = `${componentName[0].toLowerCase()}${componentName.slice(1)}`;

  return `import { Text, View } from 'react-native';

import { styles } from './${componentName}.styles';
import type { ${componentName}Props } from './types';

export function ${componentName}(_props: ${componentName}Props) {
  return (
    <View style={styles.${className}}>
      <Text>${componentName}</Text>
    </View>
  );
}
`;
}
