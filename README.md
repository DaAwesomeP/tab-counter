tab-counter [![Travis][build badge]][travis build] [![GitHub release][release badge]][gh latest]
===========


A button badge that shows the number of tabs open in a window. Tested for Firefox and Opera.

This addon was created as a WebExtension Replacement for [Michael Kraft's Tab Counter](https://addons.mozilla.org/en-US/firefox/addon/tab-counter/).

| Platform | Badges |
| :------: | :----- |
| **Firefox** | [![Mozilla Add-on][firefox badge]][AMO] [![Mozilla Add-on][amo version badge]][AMO] |
| **Opera**  | [![Opera Add-on][opera badge]][opera addons] |
| **WebExtension** | [![WebExtension][webext badge]][gh latest] [![GitHub release][release badge]][gh latest] |
| **Chrome** | *Google charges a developer fee to enlist in the Chrome Web Store. Please use the Opera WebExtension download.* |


[travis build]: https://travis-ci.org/DaAwesomeP/tab-counter
[build badge]: https://img.shields.io/travis/DaAwesomeP/tab-counter.svg?style=flat-square

[AMO]: https://addons.mozilla.org/en-US/firefox/addon/tab-counter-webext/
[opera addons]:  https://addons.opera.com/en/extensions/details/tab-counter-2/
[gh latest]: https://github.com/DaAwesomeP/tab-counter/releases/latest

[firefox badge]: https://img.shields.io/badge/firefox-download-orange.svg?style=flat-square&logo=mozilla-firefox
[opera badge]: https://img.shields.io/badge/opera-download-red.svg?style=flat-square&logo=opera
[webext badge]: https://img.shields.io/badge/webextension-download-lightgrey.svg?style=flat-square&logo=github

[release badge]: https://img.shields.io/github/release/DaAwesomeP/tab-counter.svg?style=flat-square
[amo version badge]: https://img.shields.io/amo/v/tab-counter-webext.svg?style=flat-square

## Development

You will need NodeJS v7 or higher with the NPM v4 or higher.
```bash
# install dependencies
npm i

# build extension (makes ZIP archives in build/)
npm run build

# watch for changes and build dist/ (temporarily rename a manifest to load unpacked)
npm run watch

# check package.json and gulpfile.js for more commands
```

## License
[Apache 2.0](https://github.com/DaAwesomeP/tab-counter/blob/master/LICENSE)
