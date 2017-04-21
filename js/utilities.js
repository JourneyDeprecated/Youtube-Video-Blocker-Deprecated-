function getItems(callback) {
  chrome.storage.local.get('channels', function(storage) {
    if (typeof storage.channels === 'undefined') {
      storage.channels = [];
      setItems(storage.channels);
    }
    callback(storage.channels);
  });
}

function addItem(itemToAdd, callback) {
  var itemsToAdd = [itemToAdd];
  addItems(itemsToAdd, callback);
}

function addItems(itemsToAdd, callback) {
  getItems(function(storage) {
    var items = storage,
      added = false;
    for (var j in itemsToAdd) {
      var exists = false;
      if (itemsToAdd[j].key === '')
        continue;
      for (var i in items) {
        if (items[i].key === itemsToAdd[j].key && items[i].type === itemsToAdd[j].type) {
          exists = true;
          break;
        }
      }
      if (exists === false) {
        added = true;
        items.unshift(itemsToAdd[j]);
      }
    }
    if (added === true) {
      setItems(items, callback);
    }
  });
}

function removeItem(itemToRemove, callback) {
  var itemsToRemove = [itemToRemove];
  removeItems(itemsToRemove, callback);
}

function removeItems(itemsToRemove, callback) {
  if (itemsToRemove === 'all') {
    setItems([], callback);
  } else {
    getItems(function(storage) {
      var items = storage,
        found = false;
      for (var j in itemsToRemove) {
        for (var i in items) {
          if (items[i].key === itemsToRemove[j].key && items[i].type === itemsToRemove[j].type) {
            found = true;
            items.splice(i, 1);
            break;
          }
        }
      }
      if (found === true) {
        setItems(items, callback);
      }
    });
  }
}

function setItems(items, callback) {
  chrome.storage.local.set({
    channels: items
  });
  chrome.runtime.sendMessage({ name: 'itemsUpdated' });
  if (typeof callback !== 'undefined')
    callback();
}

function getSettings(callback) {
  chrome.storage.local.get('settings', function(storage) {
    if (typeof storage.settings === 'undefined') {
      storage.settings = {
        enableicon: true,
        redirect: true,
        password: '',
        version: {
          number: chrome.runtime.getManifest().version,
          updated: false,
          installed: true
        }
      };
      setSettings(storage.settings);
    } else {
      if (typeof storage.settings.enableicon === 'undefined') {
        setSetting('enableicon', true);
      }
      if (typeof storage.settings.redirect === 'undefined') {
        setSetting('redirect', true);
      }
      if (typeof storage.settings.password === 'undefined') {
        setSetting('password', '');
      }
      if (typeof storage.settings.version === 'undefined' || storage.settings.version.number !== chrome.runtime.getManifest().version) {
        setSetting('version', {
          number: chrome.runtime.getManifest().version,
          updated: true,
          installed: false
        });
      }
    }
    callback(storage.settings);
  });
}

function setSetting(setting, value) {
  getSettings(function(storage) {
    storage[setting] = value;
    setSettings(storage);
  });
}

function setSettings(settings) {
  chrome.storage.local.set({
    settings: settings
  });
  chrome.runtime.sendMessage({ 'name': 'settingsUpdated' });
}

function translateHTMLfile() {
  function findTranslation(match, p1) {
    return chrome.i18n.getMessage(p1);
  }
  document.head.innerHTML = document.head.innerHTML.replace(/__MSG_(.+?)__/g, findTranslation);
  document.body.innerHTML = document.body.innerHTML.replace(/__MSG_(.+?)__/g, findTranslation);
}
//# sourceMappingURL=utilities.js.map