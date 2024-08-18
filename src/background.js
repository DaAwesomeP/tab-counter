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

import { debounce } from 'underscore'

const updateIcon = async function updateIcon () {
  // Get settings
  let settings = await browser.storage.local.get()

  // Get tab counter setting
  let counterPreference = settings.counter || 0

  // Stop tab badge update if badge disabled
  if (counterPreference === 3) return

  // Get current tab to update badge in
  let currentTab = (await browser.tabs.query({ currentWindow: true, active: true }))[0]

  // Get tabs in current window, tabs in all windows, and the number of windows
  let currentWindow = (await browser.tabs.query({ currentWindow: true, hidden: false })).length.toString()
  let allTabs = (await browser.tabs.query({ hidden: false })).length.toString()
  let allWindows = (await browser.windows.getAll({ populate: false, windowTypes: ['normal'] })).length.toString()

  if (typeof currentTab !== 'undefined') {
    let text
    if (counterPreference === 0) text = currentWindow // Badge shows current window
    else if (counterPreference === 1) text = allTabs // Badge shows total of all windows
    else if (counterPreference === 2) text = `${currentWindow}/${allTabs}` // Badge shows both (Firefox limits to about 4 characters based on width)
    else if (counterPreference === 4) text = allWindows // Badge shows total of all windows

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
const lazyUpdateIcon = debounce(updateIcon, 250)

// Prioritize active leading edge of every 1 second on tab switch (fluid update for new tabs)
const lazyActivateUpdateIcon = debounce(updateIcon, 1000, { leading: true })

// Will be error if tab has been removed, so wait 150ms;
// onActivated fires slightly before onRemoved,
// but tab is gone during onActivated.
// Must be a function to avoid event parameter errors
const update = function update () { setTimeout(lazyUpdateIcon, 150) }

// Init badge for when addon starts and not yet loaded tabs
browser.browserAction.setBadgeText({ text: 'wait' })
browser.browserAction.setBadgeBackgroundColor({ color: '#000000' })

// Handler for when current tab changes
const tabOnActivatedHandler = function tabOnActivatedHandler () {
  // Run normal update for most events
  update()

  // Prioritize active (fluid update for new tabs)
  lazyActivateUpdateIcon()
}

// Load and apply icon and badge color settings
const checkSettings = async function checkSettings (settingsUpdate) {
  // Get settings object
  let settings = await browser.storage.local.get()
  // Get the browser name and version
  let browserInfo
  if (browser.runtime.hasOwnProperty('getBrowserInfo')) browserInfo = await browser.runtime.getBrowserInfo()
  else {
    browserInfo = { // polyfill doesn't seem to support this method, but we're only concerned with FF at the moment
      version: '0',
      vendor: '',
      name: ''
    }
  }
  const browserVersionSplit = browserInfo.version.split('.').map((n) => parseInt(n))

  // Set base defaults if new insall
  if (!settings.hasOwnProperty('version')) {
    settings = {
      version: '0.0.0',
      icon: 'tabcounter.plain.min.svg',
      counter: 0,
      badgeColor: '#999999'
    }
  }

  // Perform settings upgrade
  if (settings.version !== browser.runtime.getManifest().version) {
    let versionSplit = settings.version.split('.').map((n) => parseInt(n))
    // Upgrade

    // since v0.3.0, icons now adapt to theme so reset icon setting
    if (versionSplit[0] === 0 && versionSplit[1] < 3) settings.icon = 'tabcounter.plain.min.svg'

    // disable the "both" counter option in version v0.3.0 due to the four-character badge limit (renders the feature uselss)
    if (versionSplit[0] === 0 && versionSplit[1] < 3) {
      if (settings.hasOwnProperty('counter')) {
        if (settings.counter === 2) settings.counter = 0
      }
    }

    // add badgeTextColor support if at least v0.4.0 and FF 63
    if (versionSplit[0] === 0 && versionSplit[1] < 4 && browserInfo.vendor === 'Mozilla' && browserInfo.name === 'Firefox' && browserVersionSplit[0] >= 63) {
      settings.badgeTextColorAuto = true
      settings.badgeTextColor = '#000000'
    }
  }
  browser.storage.local.set(Object.assign(settings, {
    version: browser.runtime.getManifest().version
  }))

  // Apply badge color or use default
  if (settings.hasOwnProperty('badgeColor')) browser.browserAction.setBadgeBackgroundColor({ color: settings.badgeColor })
  else browser.browserAction.setBadgeBackgroundColor({ color: '#000000' })

  // Apply badge text color or use default if not set or not supported
  if (settings.hasOwnProperty('badgeTextColor')) {
    if (settings.badgeTextColorAuto !== true) browser.browserAction.setBadgeTextColor({ color: settings.badgeTextColor })
    else browser.browserAction.setBadgeTextColor({ color: null })
  }

  // Apply icon selection or use default
  if (settings.hasOwnProperty('icon')) browser.browserAction.setIcon({ path: `icons/${settings.icon}` })
  else browser.browserAction.setIcon({ path: 'icons/tabcounter.plain.min.svg' })

  // Get counter preference
  let counterPreference
  if (!settings.hasOwnProperty('counter')) counterPreference = 0
  else counterPreference = settings.counter

  // Either add badge update events or don't if not set to
  if (counterPreference !== 3) {
    // Watch for tab and window events five seconds after browser startup
    setTimeout(() => {
      browser.tabs.onActivated.addListener(tabOnActivatedHandler)
      browser.tabs.onAttached.addListener(update)
      browser.tabs.onCreated.addListener(update)
      browser.tabs.onDetached.addListener(update)
      browser.tabs.onMoved.addListener(update)
      browser.tabs.onReplaced.addListener(update)
      browser.tabs.onRemoved.addListener(update)
      browser.tabs.onUpdated.addListener(update)
      browser.windows.onCreated.addListener(update)
      browser.windows.onRemoved.addListener(update)
      browser.windows.onFocusChanged.addListener(update)
    }, settingsUpdate ? 1 : 5000) // add listeners immeadietly if not browser startup
  } else {
    // remove the listeners that were added
    browser.tabs.onActivated.removeListener(tabOnActivatedHandler)
    browser.tabs.onAttached.removeListener(update)
    browser.tabs.onCreated.removeListener(update)
    browser.tabs.onDetached.removeListener(update)
    browser.tabs.onMoved.removeListener(update)
    browser.tabs.onReplaced.removeListener(update)
    browser.tabs.onRemoved.removeListener(update)
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

// Load settings and update badge at app start
const applyAll = async function applyAll (settingsUpdate) {
  await checkSettings(settingsUpdate) // Icon and badge color
  await update() // Badge text options
}
applyAll()

// Listen for settings changes and update color, icon, and badge text instantly
// Bug: this listener run nonstop
// browser.storage.onChanged.addListener(applyAll)

// Listen for internal addon messages
const messageHandler = async function messageHandler (request, sender, sendResponse) {
  // Check for a settings update
  if (request.hasOwnProperty('updateSettings')) if (request.updateSettings) applyAll(true)
}
browser.runtime.onMessage.addListener(messageHandler)
