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

const updateIcon = debounce(async function () {
  const windows = (await browser.windows.getAll())
  for (const currentWindow of windows) {
    const tabsOfCurrentWindow = (await browser.tabs.query({ windowId: currentWindow.id }))
    const currentTab = (await browser.tabs.query({ windowId: currentWindow.id, active: true }))[0]
    browser.browserAction.setBadgeText({
      text: tabsOfCurrentWindow.length.toString(),
      tabId: currentTab.id
    })
  }
}, 200)

// debounce from underscore.js
// details at https://davidwalsh.name/javascript-debounce-function
function debounce (func, wait, immediate) {
  let timeout
  return function () {
    const context = this
    const args = arguments
    const later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

checkSettings()

// initalize empty badge
browser.browserAction.setBadgeText({
  text: ' '
})

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
