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
  let currentWindow = (await browser.tabs.query({ hidden: false, currentWindow: true })).length
  let allTabs = (await browser.tabs.query({ hidden: false })).length
  let allWindows = (await browser.windows.getAll({ populate: false, windowTypes: ['normal'] })).length.toString()
  document.getElementById('currentWindow').textContent = currentWindow
  document.getElementById('allTabs').textContent = allTabs
  document.getElementById('allWindows').textContent = allWindows
}

if (typeof browser === 'undefined') {
  var script = document.createElement('script')
  script.addEventListener('load', () => {
    start()
  })
  script.src = '../node_modules/webextension-polyfill/dist/browser-polyfill.js'
  script.async = false
  document.head.appendChild(script)
} else start()
