var containerList = [{
    container: '.lohp-large-shelf-container',
    channelname: '.content-uploader > a',
    videotitle: 'a.lohp-video-link'
  },
  {
    container: '.lohp-medium-shelf',
    channelname: '.content-uploader > a',
    videotitle: 'a.lohp-video-link'
  },
  {
    container: '.yt-shelf-grid-item',
    channelname: '.yt-lockup-byline .g-hovercard',
    videotitle: '.yt-lockup-title > a'
  },
  {
    container: '#results .item-section > li .yt-lockup-video',
    channelname: '.yt-lockup-byline > a',
    videotitle: '.yt-lockup-title > a'
  },
  {
    container: '#results .item-section > li .yt-lockup-channel',
    channelname: '.yt-lockup-title > a',
    videotitle: '.yt-lockup-title > a'
  },
  {
    container: '.expanded-shelf .expanded-shelf-content-item-wrapper',
    channelname: '.yt-lockup-byline .g-hovercard',
    videotitle: '.yt-lockup-title > a'
  },
  {
    container: '.video-list-item',
    channelname: 'a .attribution .g-hovercard',
    videotitle: 'a .title'
  },
  {
    container: '.playlist-videos-list > li',
    channelname: 'a .playlist-video-description > .video-uploader-byline > span',
    videotitle: 'a .playlist-video-description > h4'
  },
  {
    container: '.pl-video-table .pl-video',
    channelname: '.pl-video-owner > .g-hovercard',
    videotitle: '.pl-video-title > .pl-video-title-link'
  },
  {
    container: '.branded-page-related-channels-list > .branded-page-related-channels-item',
    channelname: '.yt-lockup-title > a',
    videotitle: '.yt-lockup-title > a'
  },
  {
    container: '.ytp-endscreen-content .ytp-videowall-still',
    channelname: '.ytp-videowall-still-info-author',
    videotitle: '.ytp-videowall-still-info-title'
  }
];
document.addEventListener('DOMContentLoaded', function(event) {
  chrome.runtime.sendMessage({ 'name': 'pageActionLoaded' });
  getSettings(function(storage) {
    if (storage.version.updated === true) {
      var container = document.createElement('div');
      container.classList.add('videoblocker-container');
      document.body.appendChild(container);
      var inner = document.createElement('div');
      inner.classList.add('videoblocker-inner');
      container.appendChild(inner);
      var content = document.createElement('div');
      content.classList.add('videoblocker-content');
      content.innerHTML = '' +
        '<h1><img src="' + chrome.extension.getURL("images/icons/icon32.png") + '" alt="__MSG_extName__"> <span>Video Blocker - Extension updated (5.2.2)</span></h1>' +
        '<hr>' +
        '<p>The Video Blocker extension has been succesfully updated. Below, I have listed the new and improved features.</p>' +
        '<ul>' +
        '<li><strong>Enable/disable redirect</strong> - Toggle the redirection to the homepage when a blocked video is accessed from a link.</li>' +
        '<li><strong>Various fixes</strong> - Various fixes that should solve some issues and improve stability.</li>' +
        '</ul>' +
        '<p>More information can be found on the settings page under the \'Help\' section.</p>' +
        '<hr>' +
        '<p style="text-align:center; margin-bottom:0; font-weight:500;"><a id="videoblocker-closewindow" href="#">Close this window (untill the next update)</a></p>';
      inner.appendChild(content);
      document.getElementById('videoblocker-closewindow').addEventListener('click', function(event) {
        document.querySelector('.videoblocker-container').remove();
        setSetting('version', { number: chrome.runtime.getManifest().version, updated: false, installed: false });
      }, false);
    }
    if (storage.version.installed === true) {
      var container = document.createElement('div');
      container.classList.add('videoblocker-container');
      document.body.appendChild(container);
      var inner = document.createElement('div');
      inner.classList.add('videoblocker-inner');
      container.appendChild(inner);
      var content = document.createElement('div');
      content.classList.add('videoblocker-content');
      content.innerHTML = '' +
        '<h1><img src="' + chrome.extension.getURL("images/icons/icon32.png") + '" alt="__MSG_extName__"> <span>Video Blocker - Extension installed</span></h1>' +
        '<hr>' +
        '<p>The Video Blocker extension has been succesfully installed. Below, I have listed the some key features.</p>' +
        '<ul>' +
        '<li>Block videos from specific YouTube channels by adding them manually or via right click on a video thumbnail.</li>' +
        '<li>Block videos on YouTube with specific keywords in the title</li>' +
        '<li>Set a password to prevent e.g. children to remove items from the \'blocked\' list. (The extension can still be removed without entering the password though.)</li>' +
        '<li>Export your blocked items and import them on a different computer.</li>' +
        '</ul>' +
        '<p>More information can be found on the settings page under the \'Help\' section.</p>' +
        '<hr>' +
        '<p style="text-align:center; margin-bottom:0; font-weight:500;"><a id="videoblocker-closewindow" href="#">Close this window (untill the next update)</a></p>';
      inner.appendChild(content);
      document.getElementById('videoblocker-closewindow').addEventListener('click', function(event) {
        document.querySelector('.videoblocker-container').remove();
        setSetting('version', { number: chrome.runtime.getManifest().version, updated: false, installed: false });
      }, false);
    }
  });
  hideVideos();
  var mutationTarget = document.getElementById("page");
  var mutationObserver = new MutationObserver(function(mutations) {
    hideVideos();
  });
  var mutationConfig = {
    "childList": true,
    "subtree": true
  };
  mutationObserver.observe(mutationTarget, mutationConfig);
});

function hideVideos() {
  var pageChannelName = undefined;
  if (document.querySelector('.branded-page-header-title-link') !== null)
    pageChannelName = document.querySelector('.branded-page-header-title-link').textContent.trim();
  else if (document.querySelector('#watch-header .yt-user-info .g-hovercard') !== null)
    pageChannelName = document.querySelector('#watch-header .yt-user-info .g-hovercard').textContent.trim();
  var pageVideoTitle = undefined;
  if (document.querySelector('#watch-header .watch-title') !== null)
    pageVideoTitle = document.querySelector('#watch-header .watch-title').textContent.trim();
  getItems(function(storage) {
    var items = storage;
    loop1: for (var i = 0; i < containerList.length; i++) {
      var containers = document.body.querySelectorAll(containerList[i].container);
      loop2: for (var j = 0; j < containers.length; j++) {
        var videotitle = (typeof containerList[i].videotitle !== 'undefined' && containers[j].querySelector(containerList[i].videotitle) !== null) ? containers[j].querySelector(containerList[i].videotitle).textContent.trim() : '',
          channelname = (typeof containerList[i].channelname !== 'undefined' && containers[j].querySelector(containerList[i].channelname) !== null) ? containers[j].querySelector(containerList[i].channelname).textContent.trim() : '',
          block = false,
          blockPage = false;
        if (containerList[i].container === '.ytp-endscreen-content .ytp-videowall-still' && channelname.indexOf('\u2022') > -1)
          channelname = channelname.substr(0, channelname.indexOf('\u2022')).trim();
        loop3: for (var k = 0; k < items.length; k++) {
          var key = items[k].key,
            type = items[k].type,
            regexpobj = key.match(/^\/(.+?)\/(.+)?/);
          if (regexpobj !== null) {
            try {
              var regexp = new RegExp(regexpobj[1], regexpobj[2]);
            } catch (e) {
              var regexp = undefined;
            }
          }
          switch (type) {
            case 'channel':
              if (regexpobj !== null) {
                if (pageChannelName && regexp && regexp.test(pageChannelName) === true) {
                  blockPage = true;
                }
                if (regexp && regexp.test(channelname) === true) {
                  block = true;
                }
              } else {
                if (pageChannelName && pageChannelName === key) {
                  blockPage = true;
                }
                if (channelname === key) {
                  block = true;
                }
              }
              break;
            case 'wildcard':
              if (regexpobj === null) {
                if (channelname.toLowerCase().indexOf(key.toLowerCase()) > -1) {
                  block = true;
                }
              }
              break;
            case 'keyword':
              if (regexpobj !== null) {
                if (pageVideoTitle && regexp && regexp.test(pageVideoTitle) === true) {
                  blockPage = true;
                }
                if (regexp && regexp.test(videotitle) === true) {
                  block = true;
                }
              } else {
                if (pageVideoTitle && pageVideoTitle.toLowerCase().indexOf(key.toLowerCase()) > -1) {
                  blockPage = true;
                }
                if (videotitle.toLowerCase().indexOf(key.toLowerCase()) > -1) {
                  block = true;
                }
              }
              break;
          }
          if (blockPage === true) {
            if (/.+&list=.+/.test(window.location.href) === true) {
              document.body.querySelector('#player-api .ytp-next-button').click();
              break loop1;
            } else {
              getSettings(function(storage) {
                if (storage.redirect === true) {
                  window.location.replace('/');
                }
              });
            }
          }
          if (block === true) {
            containers[j].remove();
            break;
          }
        }
        if (block === false) {
          containers[j].style.visibility = 'visible';
        }
      }
    }
  });
  fixThumbnails();
}
var contextChannelName;
window.addEventListener('contextmenu', function(event) {
  contextChannelName = null;
  for (var i = 0; i < containerList.length; i++) {
    if (event.target.closest(containerList[i].container) !== null) {
      contextChannelName = event.target.closest(containerList[i].container).querySelector(containerList[i].channelname).textContent.trim();
      if (containerList[i].container === '.ytp-endscreen-content .ytp-videowall-still' && contextChannelName.indexOf('\u2022') > -1)
        contextChannelName = contextChannelName.substr(0, contextChannelName.indexOf('\u2022')).trim();
    }
    if (contextChannelName !== null)
      break;
  }
});
chrome.runtime.onMessage.addListener(function(message) {
  if (message.name === 'contextMenuClicked' && contextChannelName !== null) {
    addItem({ key: contextChannelName, type: 'channel' }, hideVideos);
  }
});

function fixThumbnails() {
  var allThumbs = document.body.querySelectorAll(".thumb-link img, .yt-thumb img");
  for (var i = 0; i < allThumbs.length; i++) {
    if (allThumbs[i].hasAttribute('data-thumb') && allThumbs[i].getAttribute('data-thumb') !== allThumbs[i].getAttribute('src'))
      allThumbs[i].setAttribute('src', allThumbs[i].getAttribute('data-thumb'));
  }
}
//# sourceMappingURL=videoblocker.js.map
