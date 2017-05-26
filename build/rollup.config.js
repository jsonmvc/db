
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')
const uglify = require('rollup-plugin-uglify')

module.exports = {
  entry: __dirname + '/../src/index.js',
  format: 'umd',
  moduleName: 'jsonmvcdb',
  sourceMap: true,
  plugins: [
    uglify(),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [
        [
          'es2015',
          {
            modules: false
          }
        ]
      ],
      plugins: [
        'lodash',
        'external-helpers'
      ]
    }),
    commonjs(),
    resolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    })
  ],
//  external: ['lodash', 'lodash-es', 'setimmediate'],
  dest: __dirname + '/../dist/jsonmvcdb.js'
}
