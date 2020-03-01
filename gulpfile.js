/* gulpfile.js
 * Originally created 3/11/2017 by DaAwesomeP
 * This is the main build/task file of the extension
 * https://github.com/DaAwesomeP/tab-counter
 *
 * Copyright 2017-present DaAwesomeP
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 // See gulp --tasks for a better overview

/* eslint-disable no-multi-spaces */
const gulp       = require('gulp')
const del        = require('del')
const lec        = require('gulp-line-ending-corrector')
const bro        = require('gulp-bro')
const babelify   = require('babelify')
const eslint     = require('gulp-eslint')
const rename     = require('gulp-rename')
const sourcemaps = require('gulp-sourcemaps')
const zip        = require('gulp-zip')
const mustache   = require('gulp-mustache')
/* eslint-enable no-multi-spaces */

// Gulp globs
const jsFiles = ['src/**/*.js', 'gulpfile.js']

function lint () {
  return gulp.src(jsFiles)
    .pipe(eslint())
    .pipe(eslint.format())
}
lint.description = 'Run eslint'
exports.lint = lint

function lintError () {
  return gulp.src(jsFiles)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
}
lintError.description = 'Run eslint and fail on error'
exports.lintError = lintError

function fixEOL () {
  return gulp.src('src/**/*.js')
    .pipe(lec())
    .pipe(gulp.dest('src'))
}
fixEOL.description = 'Fix line endings'
exports.fixEOL = fixEOL

function clean () {
  return del(['build/**/*'])
}
clean.description = 'Remove build artifacts'
exports.clean = clean

function compileJs () {
  return gulp.src('src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(bro({
      transform: [
        babelify.configure()
      ]
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/dist'))
}
compileJs.description = 'Compile JS with browserify and babel'
exports.compileJs = compileJs

function compileOtherSources () {
  return gulp.src(['src/**/*', '!src/**/*.js'])
    .pipe(gulp.dest('build/dist'))
}
compileOtherSources.description = 'Compile non JS source files like HTML'
exports.compileOtherSources = compileOtherSources

function compileManifest (view) {
  return gulp.src('manifest.json.mustache')
    .pipe(mustache(view))
    .pipe(rename('manifest.json'))
    .pipe(gulp.dest('build'))
}
compileManifest.description = 'Run the manifest through Mustache'
exports.compileManifest = compileManifest

const compileFirefoxManifest = () => compileManifest({ firefox: true })
const compileOperaManifest = () => compileManifest({ opera: true })

function compileReadable () {
  return gulp.src('LICENSE', 'README.md')
    .pipe(gulp.dest('build'))
}
compileReadable.description = 'Compile project-related files (README, LICENSE)'
//exports.compileReadable = compileReadable

function compileFirefoxIcons () {
  return gulp.src(['icons/**/clear-*.png', 'icons/**/*.min.svg'])
    .pipe(gulp.dest('build/icons'))
}
compileFirefoxIcons.description = 'Copy Firefox icons'
exports.compileFirefoxIcons = compileFirefoxIcons

function compileOperaIcons () {
  return gulp.src(['icons/**/*.png', 'icons/**/*.min.svg'])
    .pipe(gulp.dest('build/icons'))
}
compileOperaIcons.description = 'Copy Opera icons'
exports.compileOperaIcons = compileOperaIcons

const compileFirefox = gulp.parallel(
    compileJs,
    compileOtherSources,
    compileFirefoxManifest,
    compileReadable,
    compileFirefoxIcons
  )
exports.compileFirefox = compileFirefox

const compileOpera = gulp.parallel(
    compileJs,
    compileOtherSources,
    compileOperaManifest,
    compileReadable,
    compileFirefoxIcons
  )
exports.compileOpera = compileOpera

const buildFirefox = gulp.parallel(
  fixEOL,
  lint,
  gulp.series(clean, compileFirefox)
)
buildFirefox.description = 'Cleanly build for Firefox'
exports.buildFirefox = buildFirefox

const buildOpera = gulp.series(
  fixEOL,
  gulp.parallel(
    lint,
    gulp.series(clean, compileOpera)
  )
)
buildOpera.description = 'Cleanly build for Opera'
exports.buildOpera = buildOpera

function pack (browser) {
  return gulp.src(['build/**/*'])
    .pipe(zip(`tab-counter.${browser}.zip`))
    .pipe(gulp.dest('dist'))
}
const packFirefox = () => pack('firefox')
packFirefox.description = 'Pack files in build/ for Firefox'
const packOpera = () => pack('opera')
packOpera.description = 'Pack files in build/ for Opera'

const distFirefox = gulp.series(buildFirefox, packFirefox)
const distOpera = gulp.series(buildOpera, packOpera)
exports.distFirefox = distFirefox
exports.distOpera = distOpera

exports.build = buildFirefox
exports.dist = distFirefox
exports.all = gulp.series(distFirefox, distOpera)
exports.default = exports.build

function watch () {
  gulp.watch(
    ['src/**/*', 'icons/**/*', 'manifest.json.mustache'],
    gulp.parallel(buildFirefox)
  )
}
watch.description = 'Watch source files for changes and rebuild'
exports.watch = watch
