
import resolve from 'rollup-plugin-node-resolve';
import alias from 'rollup-plugin-alias';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';

module.exports = {
  entry: __dirname + '/../src/index.js',
  format: 'umd',
  moduleName: 'jsonmvcdb',
  sourceMap: true,
  plugins: [
    alias(),
    commonjs(),
    builtins(),
    resolve()
  ],
  external: ['lodash'],
  dest: __dirname + '/../dist/jsonmvcdb.js'
}
