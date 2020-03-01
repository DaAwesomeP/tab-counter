# Files

A brief description of every file or group of file in this repository.

Every entry is tagged with what kind of file it is.

`assets` : Not code\
`artifacts` : Generated files (deleting them shouldn't matter)\
`build`: Build and automation\
`docs`: Documentation\
`editor`: Text editor configuration\
`js-tool`: Javascript tools\
`lib`: Libraries\
`project`: Project management\
`src`: Source code\
`vcs`: Version control system (eg. git)

* build/ : `artifacts`
* dev/ : `artifacts`
* dist/ : `artifacts`
* docs/ : `docs`
  * code.md : General description of the code architecture
  * files.md : *Current file* Description of all files
  * notes.md : Various notes about the project and the code
* icons/ : `assets` `artifacts` SVG Icons and generated PNG icons
* node_modules : `lib` `artifacts` NPM module install folder
* src/ : `src` See also *code.md*
  * background.js : Webextension background page code
  * options.html : Settings page HTML
  * options.js : Settings page JS
  * popup.html : Add-on icon popup HTML
  * popup.js : Add-on icon popup JS
  * utils.js : Code used in multiple files (eg. polyfill)
* web-ext-artifacts : `artifacts` Addons signed with web-ext sign go here
* .babelrc.json : `js-tool` Babel (JS transpiler) configuration file
* .browserslistrc : `js-tool` Browserslist configuration file used by Babel
* .editorconfig : `editor` Editorconfig configuration file
* .eslintrc.json : `js-tool` ESLint (JS linter) configuration file
* .gitattributes : `vcs` Git configuration
* .gitignore : `vcs` Git configuration
* .travis.yml : `build` Travis (CI build) configuration file
* CHANGELOG.md : `project`
* gulpfile.js : `build` Gulp (build system) configuration file
* LICENSE : `project` Apache 2.0 license
* manifest.firefox.json : `src` Webextension manifest for Firefox
* manifest.opera.json : `src` Webextension manifest for Opera
* package-lock.json : `lib` NPM (package manager) lock file
* package.json : `lib` `build` NPM (package) configuration with dependency list
* README.md : `project` Project information
