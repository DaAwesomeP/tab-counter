tab-counter [![Travis][build badge]][travis build] [![GitHub release][release badge]][gh latest]
===========


A button badge that shows the number of tabs open in a window. Tested for Firefox and Opera.

This addon is forked from DaAwesomeP who created it as a WebExtension Replacement for [Michael Kraft's Tab Counter](https://addons.mozilla.org/en-US/firefox/addon/tab-counter/).

| Platform | Badges |
| :------: | :----- |
| **Firefox** | [![Mozilla Add-on][firefox badge]][AMO] [![Mozilla Add-on][amo version badge]][AMO] |
| **Opera**  | [![Opera Add-on][opera badge]][opera addons] |
| **WebExtension** | [![WebExtension][webext badge]][gh latest] [![GitHub release][release badge]][gh latest] |
| **Chrome** | *Google charges a developer fee to enlist in the Chrome Web Store. Please use the Opera WebExtension download.* |


[travis build]: https://travis-ci.org/tqdv/tab-counter
[build badge]: https://img.shields.io/travis/tqdv/tab-counter.svg?style=flat-square

[AMO]: https://addons.mozilla.org/en-US/firefox/addon/tab-counter-webext/
[opera addons]:  https://addons.opera.com/en/extensions/details/tab-counter-2/
[gh latest]: https://github.com/tqdv/tab-counter/releases/latest

[firefox badge]: https://img.shields.io/badge/firefox-download-orange.svg?style=flat-square&logo=mozilla-firefox
[opera badge]: https://img.shields.io/badge/opera-download-red.svg?style=flat-square&logo=opera
[webext badge]: https://img.shields.io/badge/webextension-download-lightgrey.svg?style=flat-square&logo=github

[release badge]: https://img.shields.io/github/release/tqdv/tab-counter.svg?style=flat-square
[amo version badge]: https://img.shields.io/amo/v/tab-counter-webext.svg?style=flat-square

## Building

Install NodeJS and NPM.

```bash
npm i
npm run dist
# or `npm run all` if you want to build for Firefox and Opera
```

## Development

You will need a recent NodeJS and NPM.

```bash
# install dependencies
npm i

# build extension (compiles the source code into build/)
npm run build

# Prepare for distribution (creates a zip in dist/)
npm run dist
npm run all # Create archives for both Opera and Firefox

# watch for changes and rebuild
npm run watch

# Run the extension in Firefox and reload on change
npm run run

# check package.json and gulpfile.js for more commands
```

Ressources:
* [Index of files](docs/files.md)
* [Development notes](docs/notes.md)

## Changelog

See [CHANGELOG.md](CHANGELOG.md)

## License
[Apache 2.0](LICENSE)
