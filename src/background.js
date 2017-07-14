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

const updateIcon = async function updateIcon () {
  // Get tab counter setting
  let settings = await browser.storage.local.get()
  let counterPreference = settings.counter || 0

  // Get current tab to update badge in
  let currentTab = (await browser.tabs.query({ currentWindow: true, active: true }))[0]

  if (counterPreference === 0) { // Badge shows current window
    // Get tabs in current window
    let currentWindow = await browser.tabs.query({ currentWindow: true })
    browser.browserAction.setBadgeText({
      text: (await currentWindow).length.toString(),
      tabId: currentTab.id
    }).catch(err => { console.debug('Caught dead tab', err) })
  } else if (counterPreference === 1) { // Badge shows total of all windows
    // Get tabs in all windows
    let countAll = await browser.tabs.query({})
    browser.browserAction.setBadgeText({
      text: (await countAll).length.toString(),
      tabId: currentTab.id
    }).catch(err => { console.debug('Caught dead tab', err) })
  } else if (counterPreference === 2) { // Badge shows both (Firefox limits to about 4 characters based on width)
    // Get both tabs in current window and in all windows
    let currentWindow = await browser.tabs.query({ currentWindow: true })
    let countAll = await browser.tabs.query({})
    browser.browserAction.setBadgeText({
      text: `${(await currentWindow).length}/${(await countAll).length}`,
      tabId: currentTab.id
    }).catch(err => { console.debug('Caught dead tab', err) })
  }
}

const update = async function update () {
  updateIcon()
  setTimeout(updateIcon, 100) // Will be error if tab has been removed;
  setTimeout(updateIcon, 60)  // onActivated fires slightly before onRemoved,
  setTimeout(updateIcon, 30)  // but tab is gone during onActivated
}

// Init empty badge for when addon starts and not yet loaded tabs
browser.browserAction.setBadgeText({text: '   '})
browser.browserAction.setBadgeBackgroundColor({color: '#000000'})

// Watch for tab and window events
browser.tabs.onActivated.addListener(update)
browser.tabs.onAttached.addListener(update)
browser.tabs.onCreated.addListener(update)
browser.tabs.onDetached.addListener(update)
browser.tabs.onMoved.addListener(update)
browser.tabs.onReplaced.addListener(update)
browser.tabs.onRemoved.addListener(update)
browser.tabs.onUpdated.addListener(update)
browser.windows.onFocusChanged.addListener(update)

// Load and apply icon and badge color settings
const checkSettings = async function checkSettings () {
  // Get settings object
  let settings = await browser.storage.local.get()

  // Perform settings upgrade (placeholder, no breaking changes yet)
  if (settings.hasOwnProperty('version')) {
    if (settings.version !== browser.runtime.getManifest().version) {
      // Upgrade
    }
  } else {
    // New
  }

  // Apply badge color or use default
  if (settings.hasOwnProperty('badgeColor')) browser.browserAction.setBadgeBackgroundColor({color: settings.badgeColor})
  else browser.browserAction.setBadgeBackgroundColor({color: '#000000'})

  // Apply icon selection or use default
  if (settings.hasOwnProperty('icon')) browser.browserAction.setIcon({path: `icons/${settings.icon}`})
  else browser.browserAction.setIcon({path: 'icons/tabcounter.plain.min.svg'})
}

// Load settings and update badge at app start
const applyAll = async function applyAll () {
  await checkSettings()  // Icon and badge color
  await update()         // Badge text options
}
applyAll()

// Listen for settings changes and update color, icon, and badge text instantly
browser.storage.onChanged.addListener(applyAll)
