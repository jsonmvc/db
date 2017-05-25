
import resolve from 'rollup-plugin-node-resolve';
import alias from 'rollup-plugin-alias';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';

export default {
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
  dest: __dirname + '/../dist/jsonmvcdb.js'
}
