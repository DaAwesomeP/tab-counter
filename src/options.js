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

async function saveOptions () {
  browser.storage.local.set({
    version: browser.runtime.getManifest().version,
    badgeColor: document.querySelector('#badgeColor').value,
    icon: document.querySelector('#icon').value,
    counter: parseInt(document.querySelector('#counter').value)
  })
}

async function restoreOptions () {
  restored = true
  let settings = await browser.storage.local.get()
  document.querySelector('#badgeColor').value = settings.badgeColor || '#000000'
  document.querySelector('#icon').value = settings.icon || 'tabcounter.plain.min.svg'
  document.querySelector('#counter').value = settings.counter || 0
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
