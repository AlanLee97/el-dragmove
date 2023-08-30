const pluginBabel = require('@rollup/plugin-babel');
const pluginTerser = require('@rollup/plugin-terser');
const pluginTypescript = require('@rollup/plugin-typescript');

const input = 'src/index.ts';

const plugins = [
  pluginBabel({ babelHelpers: 'bundled' }),
  pluginTerser(),
  pluginTypescript(),
];

module.exports = [
  {
    input,
    output: {
      file: 'dist/index.esm.js',
      format: 'es',
    },
    plugins,
  },
  {
    input,
    output: {
      file: 'dist/index.common.js',
      format: 'cjs',
    },
    plugins,
  },
  {
    input,
    output: {
      file: 'dist/index.js',
      format: 'umd',
      name: 'DragMoveModel',
    },
    plugins,
  },
];
