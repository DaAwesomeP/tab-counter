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

import browser from 'webextension-polyfill'

async function checkBadgeColorManualSetting () {
  let autoSelect = document.getElementById('badgeTextColorAuto').checked
  document.getElementById('badgeTextColor').disabled = autoSelect
}

// Called by an event listener on input/select elements
async function saveOptions (event) {
  let settings = await browser.storage.local.get()

  settings[event.target.id] =
    (event.target.type === 'checkbox' ? event.target.checked : event.target.value)

  browser.storage.local.set(settings)

  // Only return when the settings have been reloaded
  await browser.runtime.sendMessage({ updateSettings: true })
}

async function restoreOptions () {
  let settings = await browser.storage.local.get()

  for (let setting in settings) {
    if (setting !== 'version') {
      let el = document.getElementById(setting)
      if (el.getAttribute('type') === 'checkbox') el.checked = settings[setting]
      else el.value = settings[setting]
    }
  }

  checkBadgeColorManualSetting()
}

// Add a version line at the end of settings form
function insertVersion () {
  let manifest = browser.runtime.getManifest()

  let p = document.createElement('p')
  p.id = 'version-text'
  p.append(`You are using ${manifest.name} v${manifest.version}` +
    (manifest.author !== undefined ? ` by ${manifest.author}` : ''))

  let style = document.createElement('style')
  style.type = 'text/css'
  style.append('' +
  '#version-text {' +
  '  font-style: italic;' +
  '  font-size: x-small;' +
  '}')

  document.head.append(style)
  document.getElementById('settings').append(p)
}

// Badge Test color is only available in Firefox
// So remove those options when it's not available
async function removeTextColorInNotFirefox () {
  if (!(await isBadgeTextColorAvailable())) {
    document.getElementById('badgeTextColorAuto').closest('.option').remove()
    document.getElementById('badgeTextColor').closest('.option').remove()
  }
}

async function start () {
  async function setup () {
    // Restore options
    await restoreOptions()

    // Prevent form submition (even if it's impossible)
    document.getElementById('settings').addEventListener('submit', e => e.preventDefault())

    // Setup handlers
    document.querySelectorAll('#settings .field input,select').forEach(elt => {
      // TODO Preview on input (eg. live color change)
      elt.addEventListener('input', () => {})
      // Save the settings on commited change
      elt.addEventListener('change', saveOptions)
    })

    // Enable/Disable Text color option depending on if we set it automatically
    document.getElementById('badgeTextColorAuto')
      .addEventListener('input', e => {
        document.getElementById('badgeTextColor').disabled = e.target.checked
      })

    // Disable badge text color options in not Firefox browsers
    let removeTextColorP = removeTextColorInNotFirefox()

    return Promise.all([removeTextColorP])
  }

  await setup()

  // Insert version number to subtly indicate that we're done
  insertVersion()
}

// Wait for DOM
document.addEventListener('DOMContentLoaded', start)
