# Libraries

A short explanation of what each library does. Sublists are used for plugins and direct dependencies. Tags are also used to categorize.

`logic`: for general code\
`build`: for the build system\
`lint` : code linting\
`polyfill`: to polyfill Javascript\
`test`: to test features

+ lodash.throttle : `logic` Standalone throttle function
+ webextension-polyfill : `polyfill` Polyfill for a Webextension promise-based API

* @babel/core : `polyfill` Babel core component
  * @babel/preset-env : A smart Babel plugin preset
  * core-js : Polyfills required by Babel
  * regenerator-runtime : Required by Babel
* babelify : `build` Browserify plugin for Babel (transpiler)
* del : `build` Promise-based API for file deletion
* eslint : `lint` ESLint, javascript linter
  * eslint-config-standard
  * eslint-plugin-import
  * eslint-plugin-node
  * eslint-plugin-promise
  * eslint-plugin-standard
* gulp : `build` Gulp build system
  * gulp-bro : Browserify (bundler) plugin for gulp
  * gulp-cli : Gulp command-line interface
  * gulp-eslint : ESLint (linter) plugin for gulp
  * gulp-line-ending-corrector : Gulp plugin to fix line endings inconsistencies
  * gulp-mustache : Gulp plugin for the Mustache templating language
  * gulp-rename : Gulp plugin to rename files
  * gulp-sourcemaps : Gulp plugin to create sourcemaps
  * gulp-zip : Gulp plugin to create zip files
* web-ext: `build` `test` Firefox tool for Webextensions
