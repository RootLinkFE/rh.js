export default {
  entry: 'src/index.js',
  file: 'lib/index.js',
  target: 'node',
  cjs: 'babel',
  pkgs: ['shared', 'material', 'cli', 'components'],
};
