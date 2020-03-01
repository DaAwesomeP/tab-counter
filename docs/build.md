# Build system

By default, we only build for Firefox.

## Tools

We use Gulp as a build system, and web-ext to run and sign the Webextensions. The most frequently used commands are also included as npm scripts for convenience.

The code is linted using ESLint, transpiled with Babel and packed with Browserify.

## Tasks

Available tasks can be displayed by `gulp --tasks`. For more information, check out the gulpfile.

Here are some common tasks:
```bash
# Clean the build directory
gulp clean # or `npm run clean`

# Build for Firefox
gulp # or `gulp build` or `npm run build`

# Build packed extension
gulp dist # or `npm run dist`

# Build packed extensions for Firefox and Opera
gulp all # or `npm run all`

# Load the extension in Firefox
npm run run # or `web-ext run -s build`
```

## Configuration files

Other than the master gulpfile.js, there are various configuration files that control parts of the build process.

* For ESlint: .eslintrc.json
* For Babel: .babelrc.json, .browserslistrc
