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

const gulp = require('gulp')
const del = require('del')
const lec = require('gulp-line-ending-corrector')
const bro = require('gulp-bro')
const babelify = require('babelify')
const eslint = require('gulp-eslint')
const rename = require('gulp-rename')
const sourcemaps = require('gulp-sourcemaps')
const zip = require('gulp-zip')

function lint () {
  return gulp.src(['src/**/*.js', 'gulpfile.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
}
lint.description = 'Run eslint and fail on error'
exports.lint = lint

function lintInfo () {
  return gulp.src(['src/**/*.js', 'gulpfile.js'])
    .pipe(eslint())
    .pipe(eslint.format())
}
lintInfo.description = 'Run eslint'
exports.lintInfo = lintInfo

function fixEOL () {
  return gulp.src('src/**/*.js')
    .pipe(lec())
    .pipe(gulp.dest('src'))
}
fixEOL.description = 'Fix line endings'
exports.fixEOL = fixEOL

function clean (callback) {
  del(['dist/*', 'build/*', 'dev/*'])
    .then(() => callback())
}
clean.description = 'Remove build artifacts'
exports.clean = clean

let compile = gulp.parallel(
  function compileJs () {
    return gulp.src('src/**/*.js')
      .pipe(sourcemaps.init())
      .pipe(bro({
        transform: [
          babelify.configure()
        ]
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('dist'))
  },
  function compileOther () {
    return gulp.src(['src/**/*', '!src/**/*.js'])
      .pipe(gulp.dest('dist'))
  }
)
compile.description = 'Compile with babel into dist/'
exports.compile = compile

function cleanDev (callback) {
  del('dev/*')
    .then(() => callback())
}

let devFirefox = gulp.parallel(
  function compileJs () {
    return gulp.src('src/**/*.js')
      .pipe(sourcemaps.init())
      .pipe(bro({
        transform: [
          babelify.configure()
        ]
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('dev/dist'))
  },
  function compileOther () {
    return gulp.src(['src/**/*', '!src/**/*.js'])
      .pipe(gulp.dest('dev/dist'))
  },
  function copyManifest () {
    return gulp.src('manifest.firefox.json')
      .pipe(rename('manifest.json'))
      .pipe(gulp.dest('dev'))
  },
  function copyAssets () {
    return gulp.src(['icons/**/clear-*.png', 'icons/**/*.min.svg'], { cwdbase: true })
      .pipe(gulp.dest('dev'))
  }
)
devFirefox.description = 'Compile files into dev for Firefox testing'
exports.devFirefox = devFirefox
exports.dev = gulp.series(cleanDev, devFirefox)
exports.dev.description = 'Clean Firefox development build'

let devPack = gulp.series(cleanDev, devFirefox, function packFirefox () {
  return gulp.src(['dev/**/*'])
    .pipe(zip('tab-counter.firefox.zip'))
    .pipe(gulp.dest('dev/build'))
})
devPack.description = 'Build for firefox and pack into a zip file'
exports.devPack = devPack

let pack = gulp.parallel(
  function packFirefox () {
    return gulp.src(['dist/**/*', '!dist/**/*.map', 'node_modules/underscore/**/*', 'icons/**/clear-*.png', 'icons/**/*.min.svg', 'manifest.firefox.json', 'LICENSE'], { base: '.' })
      .pipe(rename(path => {
        if (path.basename === 'manifest.firefox') {
          path.basename = 'manifest'
        }
      }))
      .pipe(zip('tab-counter.firefox.zip'))
      .pipe(gulp.dest('build'))
  },
  function packOpera () {
    return gulp.src(['dist/**/*.js', 'dist/**/*.html', 'node_modules/webextension-polyfill/dist/browser-polyfill.js', 'node_modules/underscore/underscore.js', 'icons/**/*.png', 'icons/**/*.min.svg', 'manifest.opera.json', 'LICENSE'], { base: '.' })
      .pipe(rename(path => {
        if (path.basename === 'manifest.opera') {
          path.basename = 'manifest'
        }
      }))
      .pipe(zip('tab-counter.opera.zip'))
      .pipe(gulp.dest('build'))
  }
)
pack.description = 'Create a source archive in build/ for Firefox and Opera'
exports.pack = pack

let watch = gulp.series(lintInfo, compile,
  function watchChanges () {
    return gulp.watch(
      ['src/**/*', 'node_modules/webextension-polyfill/**/*', 'node_modules/underscore/**/*', 'icons/**/*', 'manifest.json', 'package.json'],
      gulp.parallel(lintInfo, compile)
    )
  }
)
watch.description = 'Watch source files (and modules) for changes and rebuild'
exports.watch = watch

let dist = gulp.series(fixEOL, lint, clean, compile)
let build = gulp.series(dist, pack)

exports.dist = dist
exports.build = build
exports.default = build
