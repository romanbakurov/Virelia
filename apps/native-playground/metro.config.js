const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.unstable_conditionNames = [
  ...config.resolver.unstable_conditionNames,
  'vellira-source',
];

module.exports = config;
