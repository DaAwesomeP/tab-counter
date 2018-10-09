/* src/options.js
 * Originally created 3/11/2017 by DaAwesomeP
 * This is the options page script file
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

var domReady = false
var browserReady = false
var restored = false

async function checkBadgeColorManualSetting () {
  let autoSelect = document.querySelector('#badgeTextColorAuto').checked
  document.querySelector('#badgeTextColor').disabled = autoSelect
}

async function saveOptions () {
  checkBadgeColorManualSetting()
  let settings = await browser.storage.local.get()
  for (let setting in settings) {
    if (setting !== 'version') {
      let el = document.querySelector(`#${setting}`)
      if (el.getAttribute('type') === 'checkbox') settings[setting] = el.checked
      else settings[setting] = el.value
      let optionType = el.getAttribute('optionType')
      if (optionType === 'number' && typeof settings[setting] !== 'number') settings[setting] = parseInt(settings[setting])
      else if (optionType === 'string' && typeof settings[setting] !== 'string') settings[setting] = settings[setting].toString()
      else if (optionType === 'boolean' && typeof settings[setting] !== 'boolean') settings[setting] = (settings[setting].toLowerCase() === 'true')
    }
  }
  browser.storage.local.set(settings)
  await browser.runtime.sendMessage({ updateSettings: true })
}

async function restoreOptions () {
  restored = true
  let settings = await browser.storage.local.get()
  for (let setting in settings) {
    if (setting !== 'version') {
      let el = document.querySelector(`#${setting}`)
      if (el.getAttribute('type') === 'checkbox') el.checked = settings[setting]
      else el.value = settings[setting]
      el.parentElement.parentElement.style.display = 'block'
    }
  }
  checkBadgeColorManualSetting()
}

function start () {
  browserReady = true
  if (domReady && !restored) restoreOptions()
  for (let el of document.querySelectorAll('input, select')) {
    el.addEventListener('change', saveOptions)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  domReady = true
  if (browserReady && !restored) restoreOptions()
})

if (typeof browser === 'undefined') {
  var script = document.createElement('script')
  script.addEventListener('load', () => {
    start()
  })
  script.src = '../node_modules/webextension-polyfill/dist/browser-polyfill.js'
  script.async = false
  document.head.appendChild(script)
} else start()
