getSettings(function(settings) {
  if (settings.enableicon === true) {
    chrome.browserAction.enable();
  } else {
    chrome.browserAction.disable();
  }
  chrome.contextMenus.removeAll(function() {
    if (settings.password === '')
      createContextMenu();
  });
});
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  switch (message.name) {
    case 'pageActionLoaded':
      getSettings(function(settings) {
        if (settings.enableicon === true) {
          chrome.browserAction.enable();
        } else {
          chrome.browserAction.disable();
        }
        chrome.contextMenus.removeAll(function() {
          if (settings.password === '')
            createContextMenu();
        });
      });
      break;
    case 'settingsUpdated':
      getSettings(function(settings) {
        if (settings.enableicon === true) {
          chrome.browserAction.enable();
        } else {
          chrome.browserAction.disable();
        }
        chrome.contextMenus.removeAll(function() {
          if (settings.password === '')
            createContextMenu();
        });
      });
      break;
    case 'itemsUpdated':
      chrome.tabs.executeScript(null, {
        code: 'hideVideos();'
      });
      break;
    case 'importItems':
      addItems(JSON.parse(message.data), sendResponse);
      break;
  }
  return true;
});

function createContextMenu() {
  chrome.contextMenus.create({
    'id': 'video_blocker_context_menu',
    'title': chrome.i18n.getMessage('cmBlockVideos'),
    'enabled': true,
    'contexts': [
      'link'
    ],
    'documentUrlPatterns': [
      '*://www.youtube.com/*'
    ],
    'targetUrlPatterns': [
      '*://*.youtube.com/watch*',
      '*://*.youtube.com/user/*',
      '*://*.youtube.com/channel/*'
    ]
  });
}
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  chrome.tabs.sendMessage(tab.id, {
    'name': 'contextMenuClicked'
  });
});
//# sourceMappingURL=background.js.map