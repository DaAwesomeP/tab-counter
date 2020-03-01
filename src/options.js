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

// Checking "Automatically set badge text color" disables the "Badge text color" option
async function checkBadgeTextColorManualSetting () {
  const automaticTextColor = document.getElementById('badgeTextColorAuto').checked
  const inputElt = document.getElementById('badgeTextColor')
  const optionElt = inputElt.closest('.option')

  inputElt.disabled = automaticTextColor
  if (automaticTextColor) {
    optionElt.classList.add('disabled')
  } else {
    optionElt.classList.remove('disabled')
  }
}

// Called by an event listener on input/select elements
// It also tells the background page to reload settings
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

  checkBadgeTextColorManualSetting()
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

// Badge Text color is only available in Firefox
// So remove those options when it's not available
async function removeTextColorInNotFirefox () {
  if (!(await isBadgeTextColorAvailable())) {
    document.getElementById('badge-text-color-options').remove()
  }
}

// Hiding tabs is an experimental Firefox feature, so hide it when not available
async function removeHiddenInPopupInNotFirefox () {
  if (!(await isHidingTabsAvailable())) {
    document.getElementById('hidden-tabs-options').remove()
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
      // Preview (actually, save) on input (eg. live color change)
      elt.addEventListener('input', saveOptions)
      // Save the settings on commited change
      elt.addEventListener('change', saveOptions)
    })

    // Enable/Disable Text color option depending on if we set it automatically
    document.getElementById('badgeTextColorAuto')
      .addEventListener('input', checkBadgeTextColorManualSetting)

    // Hide options unsupported by the current browser
    let removeTextColorP = removeTextColorInNotFirefox()
    let removeHiddenInPopupP = removeHiddenInPopupInNotFirefox()

    return Promise.all([removeTextColorP, removeHiddenInPopupP])
  }

  await setup()

  // Insert version number to subtly indicate that we're done
  insertVersion()
}

// Wait for DOM
document.addEventListener('DOMContentLoaded', start)
