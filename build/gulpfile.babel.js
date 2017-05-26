
const gulp = require('gulp')
const gutil = require('gulp-util')
const rollup = require('rollup')

const rollupAnalyzer = require('rollup-analyzer')({limit: 5})
const rollupConfig = require('./rollup.config.js')

gulp.task('build', () => {
  return rollup.rollup(rollupConfig)
    .then(bundle => {
      rollupAnalyzer.formatted(bundle).then(gutil.log).catch(gutil.error)
    })
})
