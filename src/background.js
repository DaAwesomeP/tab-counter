/* src/background.js
 * Originally created 3/10/2017 by DaAwesomeP
 * This is the background task file of the extension
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

import throttle from 'lodash.throttle'
import browser from 'webextension-polyfill'


/* Updating the icon */

const updateIcon = async function updateIcon () {
  // Get settings
  // Is this a performance issue ? -> ~5ms
  let settings = await browser.storage.local.get()

  // Get tab counter setting
  let counterPreference = settings.counter

  // Stop tab badge update if badge disabled
  if (counterPreference === 'none') return

  // Get the active tab int the current window
  //   This is to handle multiple browser windows because
  //   the details.windowId parameter for browserAction.setBadgeText(details)
  //   isn't supported by chromium yet
  // Get tabs in current window, tabs in all windows, and the number of windows as strings
  let [currentTab, currentWindow, allTabs, allWindows] = await Promise.all([
    /* currentTab */ browser.tabs.query({ currentWindow: true, active: true }).then(v => v[0]),
    /* currentWindow */ browser.tabs.query({ currentWindow: true }).then(v => v.length.toString()),
    /* allTabs */ browser.tabs.query({}).then(v => v.length.toString()),
    /* allWindows */ browser.windows.getAll({ populate: false, windowTypes: ['normal'] }).then(v => v.length.toString())
  ])

  if (typeof currentTab !== 'undefined') {
    let text
    if (counterPreference === 'currentWindow') text = currentWindow // Badge shows current window
    else if (counterPreference === 'allWindows') text = allTabs // Badge shows total of all windows
    else if (counterPreference === 'windowAndAll') text = `${currentWindow}/${allTabs}` // Badge shows both (Firefox limits to about 4 characters based on width)
    else if (counterPreference === 'nbWindows') text = allWindows // Badge shows total of all windows

    // Update the badge
    browser.browserAction.setBadgeText({
      text: text,
      tabId: currentTab.id
    })

    // Update the tooltip
    browser.browserAction.setTitle({
      title: `Tab Counter\nTabs in this window:  ${currentWindow}\nTabs in all windows: ${allTabs}\nNumber of windows: ${allWindows}`,
      tabId: currentTab.id
    })
  }
}

// Prevent from firing too frequently or flooding at a window or restore
const update = throttle(updateIcon, 250)

// lateUpdate is used for onRemoved as it fires too early
// and the count is one too many. So wait 150ms
// see https://bugzilla.mozilla.org/show_bug.cgi?id=1396758
const lateUpdate = function lateUpdate () {
  setTimeout(update, 150)
}

// Update immediately, used by onActivated for fluidity
const forceUpdate = function forceUpdate () {
  update()
  update.flush()
}

/* Settings */

// The following two function: upgradeSettings and makeDefaultSettings are
// only used in refreshSettings.
// They are separated for convenience of modification and upgrade

// Convert old setting values to new ones
// It modifies passed object in-place
const upgradeSettings = async function upgradeSettings (settings) {
  let version = settings.version.split('.').map((n) => parseInt(n))

  // Check if parsed successfully
  if (!version.every(n => !isNaN(n))) return

  let [major, minor, patch] = version

  /* UPGRADES */

  // since v0.3.0, icons now adapt to theme so reset icon setting
  if (major === 0 && minor < 3) {
    settings.icon = 'tabcounter.plain.min.svg'
  }

  // Forcefully enable badgeTextColorAuto support if at least v0.4.0 and FF 63
  if (major === 0 && minor < 4) {
    settings.badgeTextColorAuto = await isBadgeTextColorAvailable()
  }
  // Actually forcefully enable it anyways (for browser upgrades)
  settings.badgeTextColorAuto = await isBadgeTextColorAvailable()

  // v0.5.0 changes the values of counter
  // See commit eab84721c214b44265a647826da3b5312a6f30e5
  if (major === 0 && minor < 5) {
    let translationMap = {
      '0': 'currentWindow',
      '1': 'allWindows',
      '2': 'windowAndAll',
      '4': 'nbWindows',
      '3': 'none'
    }
    settings.counter = translationMap[settings.counter]
  }

  // Finalize by updating the version and saving it
  settings.version = browser.runtime.getManifest().version
}

// Assign default value to settings if they don't exist **excluding version**
const makeDefaultSettings = function makeDefaultSettings (settings) {
  const defaults = {
    badgeColor: '#999',
    badgeTextColorAuto: true,
    badgeTextColor: '#000',
    icon: 'tabcounter.plain.min.svg',
    counter: 'currentWindow'
  }

  return Object.assign(defaults, settings)
}

// Make sure settings are up to date and valid by loading, checking and saving them
const refreshSettings = async function refreshSettings () {
  let settings = await browser.storage.local.get()
  const currentVersion = browser.runtime.getManifest().version

  if (!settings.hasOwnProperty('version')) {
    // New install
    settings.version = currentVersion
  } else if (settings.version !== currentVersion) {
    // Upgrade settings
    await upgradeSettings(settings)
  }

  // Add in defaults and save
  settings = makeDefaultSettings(settings)
  browser.storage.local.set(settings)
}

// Load and apply icon and badge color settings
const loadSettings = async function loadSettings (settingsUpdate) {
  // Get settings object
  let settings = await browser.storage.local.get()

  // Apply badge color
  browser.browserAction.setBadgeBackgroundColor({ color: settings.badgeColor })

  // Apply badge text color or use default if not set or not supported
  if (await isBadgeTextColorAvailable()) {
    if (settings.badgeTextColorAuto) {
      // Reset to automatic badge color
      browser.browserAction.setBadgeTextColor({ color: null })
    } else {
      browser.browserAction.setBadgeTextColor({ color: settings.badgeTextColor })
    }
  }

  // Apply selected icon
  browser.browserAction.setIcon({ path: `icons/${settings.icon}` })

  // Either add badge update events or don't if not set to
  if (settings.counter !== 'none') {
    // Watch for tab and window events five seconds after browser startup
    setTimeout(() => {
      browser.tabs.onActivated.addListener(forceUpdate)
      browser.tabs.onAttached.addListener(update)
      browser.tabs.onCreated.addListener(update)
      browser.tabs.onDetached.addListener(update)
      browser.tabs.onMoved.addListener(update)
      browser.tabs.onReplaced.addListener(update)
      browser.tabs.onUpdated.addListener(update)
      browser.tabs.onRemoved.addListener(lateUpdate)
      browser.windows.onCreated.addListener(update)
      browser.windows.onRemoved.addListener(update)
      browser.windows.onFocusChanged.addListener(update)
    }, settingsUpdate ? 1 : 5000) // add listeners immeadietly if not browser startup
  } else {
    // remove the listeners that were added
    browser.tabs.onActivated.removeListener(forceUpdate)
    browser.tabs.onAttached.removeListener(update)
    browser.tabs.onCreated.removeListener(update)
    browser.tabs.onDetached.removeListener(update)
    browser.tabs.onMoved.removeListener(update)
    browser.tabs.onReplaced.removeListener(update)
    browser.tabs.onRemoved.removeListener(lateUpdate)
    browser.tabs.onUpdated.removeListener(update)
    browser.windows.onCreated.removeListener(update)
    browser.windows.onRemoved.removeListener(update)
    browser.windows.onFocusChanged.removeListener(update)

    // hide the "wait" badge if set not to show a badge
    browser.browserAction.setBadgeText({ text: '' })
    browser.browserAction.setTitle({ title: 'Tab Counter' })

    // check each tab that was overriden with a counter badge
    let allTabs = await browser.tabs.query({})
    allTabs.forEach((tab) => {
      browser.browserAction.setBadgeText({
        text: '',
        tabId: tab.id
      })
      browser.browserAction.setTitle({
        title: 'Tab Counter',
        tabId: tab.id
      })
    })
  }
}

// Load settings and update badge
const reloadSettings = async function reloadSettings (updated) {
  await loadSettings(updated) // Icon and badge color
  await update() // Badge text options
}

/* Message handlers */
// Listen for internal addon messages
const messageHandler = async function messageHandler (request, sender, sendResponse) {
  // Check for a settings update
  if (request.updateSettings) {
    reloadSettings(/* update now */ true)
  }
}

browser.runtime.onMessage.addListener(messageHandler)
/* Installs and upgrades */
browser.runtime.onInstalled.addListener(async ({ reason, temporary }) => {
  if (temporary) return; // skip during development

  switch (reason) {
  case 'install':
  case 'update':
  case 'browser_update': // To handle enabling new browser features
    refreshSettings()
    break
  }
})

// Init badge for when addon starts and not yet loaded tabs
// NB: loading color is black, setting default is grey
browser.browserAction.setBadgeText({ text: '...' })
browser.browserAction.setBadgeBackgroundColor({ color: '#000' })

// Load settings
refreshSettings()
.then(reloadSettings)
