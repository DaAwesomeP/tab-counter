// This needs to be included first as it exports `browser` globally

import browser from 'webextension-polyfill'

// Make it available in other scripts
window.browser = browser

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
