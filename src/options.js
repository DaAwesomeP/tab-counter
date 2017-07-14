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

var b = browser
async function saveOptions () {
  b.storage.local.set({
    version: b.runtime.getManifest().version,
    badgeColor: document.querySelector('#badgeColor').value,
    icon: document.querySelector('#icon').value,
    counter: parseInt(document.querySelector('#counter').value)
  })
}

async function restoreOptions () {
  let settings = await browser.storage.local.get()
  if (settings.hasOwnProperty('version')) {
    if (settings.version !== browser.runtime.getManifest().version) {
      // Upgrade
      await saveOptions() // update version
    }
  } else {
    // New
    await saveOptions() // save version
  }
  document.querySelector('#badgeColor').value = settings.badgeColor || '#000000'
  document.querySelector('#icon').value = settings.icon || 'tabcounter.plain.min.svg'
  document.querySelector('#counter').value = settings.counter || 0
}

document.addEventListener('DOMContentLoaded', restoreOptions)
for (let el of document.querySelectorAll('input, select')) {
  el.addEventListener('change', saveOptions)
}
