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

async function updateIcon () {
  let currentTab = (await browser.tabs.query({ currentWindow: true, active: true }))[0]
  let currentWindow = (await browser.tabs.query({ currentWindow: true }))
  browser.browserAction.setBadgeText({
    text: currentWindow.length.toString(),
    tabId: currentTab.id
  }).catch(err => { console.debug('Caught dead tab', err) })
  setTimeout(cycleUpdate, 100) // Will be error if tab has been removed
  setTimeout(cycleUpdate, 60)  // (onActivated fires slightly before onRemoved,
  setTimeout(cycleUpdate, 30)  //  but tab is gone during onActivated)
}
async function cycleUpdate () {
  let currentWindow = (await browser.tabs.query({ currentWindow: true }))
  for (let tab of currentWindow) { // Workaround to prevent stuttering between windows
    browser.browserAction.setBadgeText({
      text: currentWindow.length.toString(),
      tabId: tab.id
    }).catch(err => { console.debug('Caught dead tab', err) }) // Catch if tab is gone
  }
}

checkSettings()
updateIcon()

browser.tabs.onActivated.addListener(updateIcon)
browser.tabs.onAttached.addListener(updateIcon)
browser.tabs.onCreated.addListener(updateIcon)
browser.tabs.onDetached.addListener(updateIcon)
browser.tabs.onMoved.addListener(updateIcon)
browser.tabs.onReplaced.addListener(updateIcon)
browser.tabs.onRemoved.addListener(updateIcon)
browser.tabs.onUpdated.addListener(updateIcon)
browser.windows.onFocusChanged.addListener(updateIcon)

async function checkSettings () {
  let settings = await browser.storage.local.get()
  if (settings.hasOwnProperty('version')) {
    if (settings.version !== browser.runtime.getManifest().version) {
      // Upgrade
    }
  } else {
    // New
  }
  if (settings.hasOwnProperty('badgeColor')) browser.browserAction.setBadgeBackgroundColor({color: settings.badgeColor})
  else browser.browserAction.setBadgeBackgroundColor({color: '#000000'})
  if (settings.hasOwnProperty('badgeColor')) browser.browserAction.setIcon({path: `icons/${settings.icon}`})
  else browser.browserAction.setIcon({path: 'icons/tabcounter.plain.min.svg'})
}
browser.storage.onChanged.addListener(checkSettings)
