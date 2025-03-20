const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  '@': './app',
};

config.resolver.sourceExts.push('cjs');

config.resolver.blockList = [
  /node_modules\/react-native-maps\/.*/,
];

config.server = {
  port: 8081,
  host: '0.0.0.0',
};

module.exports = config;