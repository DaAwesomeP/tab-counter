# Notes

The options page takes about 20ms to load for me (tqdv)

## TODO

* Ignore hidden tabs (true by default, but show them in popup)
* Hide some icon options in opera


* Ignore pinned tabs (false by default, show in tooltip and popup when enabled)
* TODO fix icons in Chrome
* Make use of web-ext and gulp better
* badge color should match firefox theme
* svg icon
* handle large numbers
* Test with Opera.
* Use windowId.

inspiration:
* https://github.com/DaAwesomeP/tab-counter/issues?utf8=%E2%9C%93&q=is%3Aissue
* https://github.com/Loirooriol/tab-counter-plus/issues
* https://github.com/jmmerz/tab-counter-wide

## Components

* Settings page
* Settings loading and applying
* Icon updating
* Popup updating
* Onboarding and upboarding

## Javascript

### Webextension

Don't use getBackgroundPage() as it doesn't work in private windows. Use message passing instead.

#### Tabs

Hiding tabs is available in Firefox 61

Tabs are hidden per window.

### Libraries

I use lodash instead of underscore because throttle has the function property flush that immediately calls the function.

## Version number

The stored settings format version is tied to changes to extension's version.
This means that if you change the format, then you should also update the
extension's version number.

## Browser support

<https://en.wikipedia.org/wiki/Timeline_of_web_browsers>

### Firefox ESR release dates

* Firefox 52 ESR – March 2017
* Firefox 60 ESR – May 2018
* Firefox 68 ESR – July 2019
* Firefox ? ESR – September (?) 2020

### Rationale

I'm considering dropping support for Firefox 52 ESR (March 2017) and bumping it to Firefox 60 ESR (May 2018). There's an ESR release every year, so I'm considering supporting only the last 3 versions. This could help reduce the amount of polyfill and workarounds in the code.

I guess I'll support Opera version that release at around the same time as the last supported Firefox version.

That means dropping Windows XP (EOL: April 2014) and Windows Vista (EOL: April 2017) support as Firefox 52 ESR is the last version that supports them.

But it also means that using ES6 modules will be possible

See `.browserslistrc` for the supported versions.

## Event order

New tab: created, updated, activated\
Remove tab: removed. updated, activated (with tabs.query returning one too many)\
Move tab: detached, attached, updated, activated, updated, activated, focuschanged, updated, focuschanged

Gathered with this snippet:

```js
function l (name) {
  return async function () {
    browser.tabs.query({ currentWindow: true })
    .then(v => v.length.toString())
    .then(count => {
      console.log(`event ${name}: ${count} tabs`)
    })
  }
}

browser.tabs.onActivated.addListener(l('activated'))
browser.tabs.onAttached.addListener(l('attached'))
browser.tabs.onCreated.addListener(l('created'))
browser.tabs.onDetached.addListener(l('detached'))
browser.tabs.onMoved.addListener(l('moved'))
browser.tabs.onReplaced.addListener(l('replaced'))
browser.tabs.onRemoved.addListener(l('removed'))
browser.tabs.onUpdated.addListener(l('updated'))
browser.windows.onCreated.addListener(l('created'))
browser.windows.onRemoved.addListener(l('removed'))
browser.windows.onFocusChanged.addListener(l('focuschanged'))
```

## Porting

setBadgeText's detail.windowId\
setBadgeText Font color -> option disabled\
getBrowserInfo doesn't have a polyfill yet -> workaround, it doesn't really matter

## Settings

```json
{
  "version": "0.5.1",
  "badgeColor": "#999",
  "badgeTextColorAuto": true,
  "badgeTextColor": "#000",
  "icon": "tabcounter.plain.min.svg",
  "counter": "currentWindow"
}
```

## Ideas

### [Repicked up] Keeping track of the number of tabs with events

I had the idea to calculate the number of open tabs from startup based on events,
so we didn't have to query the browser every time.

~~I think it's not worth it. Especially since you need to make sure it doesn't get
desynced. And if you restore tabs on startup, those don't trigger any events~~

Nvm, someone else did it, so I guess I should do it too.

#### Tabs restore

Actually, does the await tabs.query() only return when the browser has finished restoring tabs ?

In Firefox 52-57 at least, getting the value at startup returns 1 (maybe the other tabs fire onCreated ? They do). On 74, it returns the correct number of tabs.

#### Tab switching

Maybe don't recalculate everything everytime we switch to a new tab
