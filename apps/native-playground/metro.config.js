const fs = require('node:fs');
const path = require('node:path');

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.unstable_conditionNames = [
  ...config.resolver.unstable_conditionNames,
  'vellira-source',
];

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const originModulePath = context.originModulePath;

  if (
    moduleName.startsWith('.') &&
    moduleName.endsWith('.js') &&
    originModulePath.includes(`${path.sep}packages${path.sep}`) &&
    originModulePath.includes(`${path.sep}src${path.sep}`)
  ) {
    const candidateBase = path.resolve(
      path.dirname(originModulePath),
      moduleName.slice(0, -3)
    );

    for (const extension of ['.ts', '.tsx']) {
      const candidate = `${candidateBase}${extension}`;

      if (fs.existsSync(candidate)) {
        return {
          type: 'sourceFile',
          filePath: candidate,
        };
      }
    }
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
