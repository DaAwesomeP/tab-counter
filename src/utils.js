// This needs to be included first as it exports `browser` globally

import browser from 'webextension-polyfill'

// Make it available in other scripts
window.browser = browser

// TODO what happens when using Firefox ESR ? Does the name field change ?

// setBadgeTextColor is available in Firefox >= 63
// The result can be easily cached if it needs to be
async function isBadgeTextColorAvailable () {
  if (!browser.runtime.hasOwnProperty('getBrowserInfo')) {
    // It is not Firefox
    return false
  } else {
    let info = await browser.runtime.getBrowserInfo()
    let majorVersion = parseInt(info.version.split('.')[0])
    return (info.name === 'Firefox' && majorVersion >= 63)
  }
}

window.isBadgeTextColorAvailable = isBadgeTextColorAvailable

// Hiding tabs is an experimental feature available in Firefox >= 61
async function isHidingTabsAvailable () {
  if (!browser.runtime.hasOwnProperty('getBrowserInfo')) {
    // It is not Firefox
    return false
  } else {
    let info = await browser.runtime.getBrowserInfo()
    let majorVersion = parseInt(info.version.split('.')[0])
    return (info.name === 'Firefox' && majorVersion >= 61)
  }
}

window.isHidingTabsAvailable = isHidingTabsAvailable
