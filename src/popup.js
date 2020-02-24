/* src/popup.js
 * Originally created 3/10/2017 by DaAwesomeP
 * This is the popup script file
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

async function start () {
  const settings = await browser.storage.local.get()

  // Object that is spread (expanded) into tabs.query(obj)
  const ignoreHiddenTabs = {}
  if (await isHidingTabsAvailable()) { ignoreHiddenTabs.hidden = false }

  // Start all Promises
  let currentWindow = browser.tabs.query({ currentWindow: true, ...ignoreHiddenTabs })
    .then(v => v.length.toString())
  let allTabs = browser.tabs.query({ ...ignoreHiddenTabs })
    .then(v => v.length.toString())
  let allWindows = browser.windows.getAll({ populate: false, windowTypes: ['normal'] })
    .then(v => v.length.toString())

  document.getElementById('currentWindow').textContent = await currentWindow
  document.getElementById('allTabs').textContent = await allTabs
  document.getElementById('allWindows').textContent = await allWindows

  // Display (or not) the number of hidden tabs
  if (settings.hiddenInPopup) {
    // ... for this window
    browser.tabs.query({ currentWindow: true, hidden: true })
      .then(v => v.length.toString())
      .then(currentHidden => {
        document.getElementById('currentHidden').hidden = false
        document.getElementById('currentHidden').textContent =
          (currentHidden > 0 ? `(+${currentHidden} hidden)` : '')
      })

    // ... for all windows
    browser.tabs.query({ hidden: true })
      .then(v => v.length.toString())
      .then(allHidden => {
        document.getElementById('allHidden').hidden = false
        document.getElementById('allHidden').textContent =
          (allHidden > 0 ? `(+${allHidden} hidden)` : '')
      })

  } else {
    document.getElementById('currentHidden').hidden = true
    document.getElementById('allHidden').hidden = true
  }
}

start()
