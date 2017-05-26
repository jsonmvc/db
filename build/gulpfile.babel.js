
const gulp = require('gulp')
const gutil = require('gulp-util')
const rollup = require('rollup')

const rollupConfig = require('./rollup.config.js')

gulp.task('build', () => {
  return rollup.rollup(rollupConfig)
    .then(bundle => {
       bundle.write(rollupConfig)
    })
})
