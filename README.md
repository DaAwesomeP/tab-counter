tab-counter
===========
A button badge that shows the number of tabs open in a window. This addon was created as a WebExtension Replacement for [Michael Kraft's Tab Counter](https://addons.mozilla.org/en-US/firefox/addon/tab-counter/). Tested for Firefox and Opera.

| [**Firefox**](https://addons.mozilla.org/en-US/firefox/addon/tab-counter-webext/) | [![Mozilla Add-on](https://img.shields.io/badge/firefox-download-orange.svg?style=flat-square)](https://addons.mozilla.org/en-US/firefox/addon/tab-counter-webext/) [![Mozilla Add-on](https://img.shields.io/amo/v/tab-counter-webext.svg?style=flat-square)](https://addons.mozilla.org/en-US/firefox/addon/tab-counter-webext/) [![Mozilla Add-on](https://img.shields.io/amo/d/tab-counter-webext.svg?style=flat-square)](https://addons.mozilla.org/en-US/firefox/addon/tab-counter-webext/) [![Mozilla Add-on](https://img.shields.io/amo/users/tab-counter-webext.svg?style=flat-square)](https://addons.mozilla.org/en-US/firefox/addon/tab-counter-webext/) [![Mozilla Add-on](https://img.shields.io/amo/stars/tab-counter-webext.svg?style=flat-square)](https://addons.mozilla.org/en-US/firefox/addon/tab-counter-webext/) |
|:-------:|-|
| [**Opera**](https://addons.opera.com/en/extensions/details/tab-counter-2/)   | [![Opera Add-on](https://img.shields.io/badge/opera-download-red.svg?style=flat-square)](https://addons.opera.com/en/extensions/details/tab-counter-2/) |
| [**WebExtension**](https://github.com/DaAwesomeP/tab-counter/releases/latest)  | [![WebExtension](https://img.shields.io/badge/webextension-download-lightgrey.svg?style=flat-square)](https://github.com/DaAwesomeP/tab-counter/releases/latest) [![GitHub release](https://img.shields.io/github/release/DaAwesomeP/tab-counter.svg?style=flat-square)](https://github.com/DaAwesomeP/tab-counter/releases/latest) [![WebExtension](https://img.shields.io/github/downloads/DaAwesomeP/tab-counter/total.svg?style=flat-square)](https://github.com/DaAwesomeP/tab-counter/releases/latest) |
| **Chrome**   | *Google charges a developer fee to enlist in the Chrome Web Store. Please use the WebExtension download.* |

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
