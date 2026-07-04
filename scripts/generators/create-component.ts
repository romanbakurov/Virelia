import fs from 'node:fs';
import path from 'node:path';

import {
  renderIndexTemplate,
  renderNativeComponentTemplate,
  renderNativeStylesTemplate,
  renderStoryTemplate,
  renderStylesTemplate,
  renderTestTemplate,
  renderTypesTemplate,
  renderWebComponentTemplate,
} from './templates';

type Platform = 'web' | 'native' | 'both';
type Layer = 'primitives' | 'components' | 'patterns';

const [, , componentName, platformArg, layerArg] = process.argv;

const platform = platformArg as Platform;
const layer = layerArg as Layer;

if (!componentName || !platform || !layer) {
  console.error(
    'Usage: pnpm create:component ComponentName web|native|both primitives|components|patterns'
  );
  process.exit(1);
}

function getTargetPackages(platform: Platform): string[] {
  switch (platform) {
    case 'web':
      return ['react'];
    case 'native':
      return ['react-native'];
    case 'both':
      return ['react', 'react-native'];
  }
}

function createComponent(params: {
  packageName: string;
  componentName: string;
  layer: Layer;
}) {
  const { packageName, componentName, layer } = params;
  const isNative = packageName === 'react-native';

  const componentDir = path.join(
    process.cwd(),
    'packages',
    packageName,
    'src',
    layer,
    componentName
  );

  if (fs.existsSync(componentDir)) {
    console.error(`Component already exists: ${componentDir}`);
    process.exit(1);
  }

  fs.mkdirSync(componentDir, { recursive: true });

  fs.writeFileSync(
    path.join(componentDir, 'types.ts'),
    renderTypesTemplate({ componentName })
  );

  fs.writeFileSync(
    path.join(componentDir, 'index.ts'),
    renderIndexTemplate({ componentName })
  );

  fs.writeFileSync(
    path.join(componentDir, `${componentName}.tsx`),
    isNative
      ? renderNativeComponentTemplate({ componentName })
      : renderWebComponentTemplate({ componentName })
  );

  fs.writeFileSync(
    path.join(componentDir, `${componentName}.stories.tsx`),
    renderStoryTemplate({ componentName, layer, isNative })
  );

  fs.writeFileSync(
    path.join(componentDir, `${componentName}.test.tsx`),
    renderTestTemplate({ componentName, isNative })
  );

  if (isNative) {
    fs.writeFileSync(
      path.join(componentDir, `${componentName}.styles.ts`),
      renderNativeStylesTemplate({ componentName })
    );
  } else {
    fs.writeFileSync(
      path.join(componentDir, `${componentName}.module.scss`),
      renderStylesTemplate({ componentName })
    );
  }

  const barrelFile = path.join(
    process.cwd(),
    'packages',
    packageName,
    'src',
    layer,
    'index.ts'
  );

  const exportLine = `export * from './${componentName}';`;

  if (fs.existsSync(barrelFile)) {
    const content = fs.readFileSync(barrelFile, 'utf8');

    if (!content.includes(exportLine)) {
      fs.appendFileSync(barrelFile, `\n${exportLine}\n`);
    }
  }

  console.log(`✅ Created ${packageName} ${layer}/${componentName}`);
}

const targetPackages = getTargetPackages(platform);

for (const packageName of targetPackages) {
  createComponent({
    packageName,
    componentName,
    layer,
  });
}
