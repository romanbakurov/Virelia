const path = require('node:path');

const { withStorybook } = require('@storybook/react-native/withStorybook');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const velliraNativeEntry = path.resolve(
  workspaceRoot,
  'packages/react-native/src/index.ts'
);

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];

const defaultResolveRequest = config.resolver.resolveRequest;

// Use source files in native Storybook to avoid duplicate ThemeContext
// between package dist and local stories.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '@vellira-ui/react-native') {
    return {
      type: 'sourceFile',
      filePath: velliraNativeEntry,
    };
  }

  return defaultResolveRequest
    ? defaultResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = withStorybook(config);
