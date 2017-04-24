translateHTMLfile();
getSettings(function(storage) {
  document.querySelector('#button-settings').addEventListener('click', function(e) {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });
  if (storage.password !== '') {
    initLogin(storage.password);
  } else {
    initList();
  }
});

function initLogin(password) {
  document.body.querySelector('.container-loading').style.display = "none";
  document.body.querySelector('.container-protected').style.display = "block";
  document.body.querySelector('.container-protected input[type="password"]').focus();
  document.body.querySelector('.login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    if (e.target[0].value === password) {
      initList();
    } else {
      e.target[0].value = "";
      document.body.querySelector('.login-error').style.display = "block";
    }
  });
}

function initList() {
  document.body.querySelector('.container-loading').style.display = "none";
  document.body.querySelector('.container-protected').style.display = "none";
  document.body.querySelector('.container-list').style.display = "block";
  document.body.querySelector('#action-search input').focus();
  var menuItems = document.body.querySelectorAll('.list-header ul li');
  for (var _i = 0, menuItems_1 = menuItems; _i < menuItems_1.length; _i++) {
    var menuItem = menuItems_1[_i];
    menuItem.addEventListener('click', function(e) {
      for (var _i = 0, menuItems_2 = menuItems; _i < menuItems_2.length; _i++) {
        var menuItem_1 = menuItems_2[_i];
        menuItem_1.classList.remove('active');
      }
      e.target.classList.add('active');
      var actionContainers = document.body.querySelectorAll('.action');
      for (var _a = 0, actionContainers_1 = actionContainers; _a < actionContainers_1.length; _a++) {
        var actionContainer = actionContainers_1[_a];
        actionContainer.style.display = 'none';
      }
      var targetID = e.target.id;
      switch (targetID) {
        case 'button-search':
          document.body.querySelector('#action-search').style.display = 'block';
          document.body.querySelector('#action-search input').focus();
          break;
        case 'button-add':
          document.body.querySelector('#action-add').style.display = 'block';
          document.body.querySelector('#action-add input').focus();
          break;
        case 'button-empty':
          document.body.querySelector('#action-empty').style.display = 'block';
          break;
      }
    });
  }
  document.body.querySelector('#action-search input').addEventListener('keyup', searchList);
  document.body.querySelector('#action-add form').addEventListener('submit', addItemToList);
  document.querySelector('#button-import').addEventListener('click', importItems);
  document.querySelector('#button-export').addEventListener('click', exportItems);
  document.querySelector('#action-empty button').addEventListener('click', emptyList);
  buildList();
}

function buildList() {
  getItems(function(storage) {
    var items = storage,
      list = document.body.querySelector('.container-list .list-body ul');
    list.innerHTML = '';
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
      var item = items_1[_i];
      var listitem = document.createElement('li');
      listitem.setAttribute('data-key', item.key);
      listitem.setAttribute('data-type', item.type);
      listitem.innerHTML = '<span class="item-type">' + item.type.substr(0, 2) + '</span><span class="item-name">' + item.key + '</span><span class="item-delete">&#10060;</span>';
      var newlistitem = list.appendChild(listitem);
      newlistitem.querySelector('.item-delete').addEventListener('click', removeItemFromList);
    }
    modifyFooterText('normal', items.length);
  });
}

function modifyFooterText(type, count) {
  var footerString = '';
  if (type === 'search' && count === 0)
    footerString = chrome.i18n.getMessage('paNoSearchResults');
  else if (type === 'search' && count === 1)
    footerString = '1 ' + chrome.i18n.getMessage('paSearchResult');
  else if (type === 'search' && count > 1)
    footerString = count + ' ' + chrome.i18n.getMessage('paSearchResults');
  else if (type === 'normal' && (count === 0 || count > 1))
    footerString = count + ' ' + chrome.i18n.getMessage('paItemsTotal');
  else if (type === 'normal' && count === 1)
    footerString = '1 ' + chrome.i18n.getMessage('paItemTotal');
  document.body.querySelector('footer').innerHTML = footerString;
}

function removeItemFromList(e) {
  var key = e.target.parentNode.getAttribute('data-key'),
    type = e.target.parentNode.getAttribute('data-type');
  removeItem({ key: key, type: type }, buildList);
}

function searchList(e) {
  var search = e.target.value;
  if (search !== '') {
    var allItems = document.body.querySelectorAll('.container-list .list-body ul li'),
      counter = 0;
    for (var _i = 0, allItems_1 = allItems; _i < allItems_1.length; _i++) {
      var listItem = allItems_1[_i];
      if (listItem.getAttribute('data-key').toLowerCase().replace(/\s/gi, '').indexOf(search.toLowerCase().replace(/\s/gi, '')) > -1) {
        listItem.style.display = "list-item";
        counter++;
      } else {
        listItem.style.display = "none";
      }
    }
    modifyFooterText('search', counter);
  } else {
    var allItems = document.body.querySelectorAll('.container-list .list-body ul li');
    for (var _a = 0, allItems_2 = allItems; _a < allItems_2.length; _a++) {
      var listItem = allItems_2[_a];
      listItem.style.display = "list-item";
    }
    modifyFooterText('normal', allItems.length);
  }
}

function addItemToList(e) {
  e.preventDefault();
  var key = e.target[0].value,
    type = e.target[1].value;
  addItem({ key: key, type: type }, buildList);
  document.body.querySelector('#action-add input').value = "";
}

function importItems(e) {
  document.body.querySelector('#action-import input').click();
  document.body.querySelector('#action-import input').addEventListener('change', fileSelected, false);

  function fileSelected(fileEvent) {
    var file = fileEvent.target.files[0];
    if (file && file.name.substring(file.name.lastIndexOf('.')) === '.json') {
      var reader = new FileReader();
      reader.onload = function() {
        var json = reader.result;
        if (json) {
          chrome.runtime.sendMessage({ name: 'importItems', data: json }, buildList);
        }
      };
      reader.readAsText(file);
    }
  }
}

function exportItems(e) {
  getItems(function(storage) {
    var items = storage;
    var today = new Date(),
      dd = today.getDate(),
      mm = today.getMonth() + 1,
      yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    var encodedUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(items));
    var link = document.createElement("a");
    link.style.display = "none";
    document.body.appendChild(link);
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Journey's Youtube Video Blocker (" + items.length + " keys " + today + ").json");
    link.setAttribute("target", "_self");
    link.click();
  });
}

function emptyList(e) {
  removeItems('all', buildList);
  document.body.querySelector('#button-search').click();
}
//# sourceMappingURL=pageaction.js.map