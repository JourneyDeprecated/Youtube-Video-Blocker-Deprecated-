var containerList = [ {
  container: '.lohp-large-shelf-container',
  channelname: '.content-uploader > a',
  videotitle: 'a.lohp-video-link'
}, {
  container: 'ytd-playlist-renderer.style-scope.ytd-item-section-renderer', //Sequence video.
  channelname: 'a.yt-simple-endpoint.style-scope.yt-formatted-string',
  videotitle: 'span.style-scope.ytd-playlist-renderer'
}, {
  container: 'ytd-video-renderer.style-scope.ytd-expanded-shelf-contents-renderer', //Large banner video on trending page
  channelname: 'a.yt-simple-endpoint.style-scope.yt-formatted-string',
  videotitle: 'a.yt-simple-endpoint.style-scope.ytd-video-renderer'
}, {
  container: 'div.grid-subheader.style-scope.ytd-shelf-renderer', //Recommend without title
  channelname: 'span.style-scope.ytd-shelf-renderer',
  videotitle: 'ThereisNoTag.ThereIsNoTitle'
}, {
  container: 'ytd-promoted-video-renderer.style-scope.ytd-search-pyv-renderer', //Recommend without title
  channelname: 'a.yt-simple-endpoint.style-scope.yt-formatted-string',
  videotitle: 'h3.style-scope.ytd-promoted-video-renderer'
}, {
  container: '.ytp-endscreen-content.ytp-videowall-still',
  channelname: '.ytp-videowall-still-info-author',
  videotitle: '.ytp-videowall-still-info-title'
}, {
  container: 'ytd-video-renderer.style-scope.ytd-item-section-renderer',
  channelname: 'a.yt-simple-endpoint.style-scope.yt-formatted-string',
  videotitle: 'a.yt-simple-endpoint.style-scope.ytd-video-renderer'
}, {
  container: 'ytd-grid-video-renderer.style-scope.yt-horizontal-list-renderer',
  channelname: 'a.yt-simple-endpoint.style-scope.yt-formatted-string',
  videotitle: 'a.yt-simple-endpoint.style-scope.ytd-grid-video-renderer'
}, {
  container: '  ytd-grid-video-renderer.style-scope.ytd-grid-renderer',
  channelname: 'a.yt-simple-endpoint.style-scope.yt-formatted-string',
  videotitle: 'a.yt-simple-endpoint.style-scope.ytd-grid-video-renderer'
}, {
  container: 'ytd-channel-renderer.style-scope.ytd-item-section-renderer',
  channelname: 'span.style-scope.ytd-channel-renderer',
  videotitle: 'span.style-scope.ytd-channel-renderer'
}, {
  container: 'ytd-video-renderer.style-scope.ytd-vertical-list-renderer',
  channelname: 'a.yt-simple-endpoint.style-scope.yt-formatted-string',
  videotitle: 'a.yt-simple-endpoint.style-scope.ytd-video-renderer'
}, {
  container: 'ytd-compact-video-renderer.style-scope.ytd-compact-autoplay-renderer', //Right side videos.
  channelname: 'yt-formatted-string.style-scope.ytd-video-meta-block',
  videotitle: 'span.style-scope.ytd-compact-video-renderer'
}, {
  container: 'ytd-compact-video-renderer.style-scope.ytd-watch-next-secondary-results-renderer', //17
  channelname: 'yt-formatted-string.style-scope.ytd-video-meta-block',
  videotitle: 'span.style-scope.ytd-compact-video-renderer'
}, {
  container: 'ytd-video-renderer.style-scope.ytd-item-section-renderer', //Right side videos.
  channelname: 'a.yt-simple-endpoint.style-scope.yt-formatted-string',
  videotitle: 'a.yt-simple-endpoint.style-scope.ytd-video-renderer'
}, {
  container: 'ytd-grid-video-renderer.style-scope.yt-horizontal-list-renderer', //Right side videos.
  channelname: 'a.yt-simple-endpoint.style-scope.yt-formatted-string',
  videotitle: 'a.yt-simple-endpoint.style-scope.ytd-grid-video-renderer'
}, {
  container: 'ytd-radio-renderer.style-scope.ytd-item-section-renderer',
  channelname: 'yt-formatted-string.style-scope.ytd-video-meta-block',
  videotitle: 'span.style-scope.ytd-radio-renderer'
}, {
  container: 'div.yt-gb-shelf-hero', //In browse channel
  channelname: 'a.yt-uix-sessionlink',
  videotitle: 'ThereisNoTag.ThereIsNoTitle'
}, {
  container: 'ytd-grid-playlist-renderer.style-scope.ytd-grid-renderer', //In playlist channel
  channelname: 'ThereisNoTag.ThereName',
  videotitle: 'span.style-scope.ytd-grid-playlist-renderer'
}, {
  container: 'ytd-compact-radio-renderer.style-scope.ytd-watch-next-secondary-results-renderer', //Right video up Next add. Sequence
  channelname: 'yt-formatted-string.style-scope.ytd-video-meta-block',
  videotitle: 'span.style-scope.ytd-compact-radio-renderer'
}, {
  container: 'ytd-compact-playlist-renderer.ytd-watch-next-secondary-results-renderer', //Right video up Next add. Sequence
  channelname: 'yt-formatted-string.style-scope.ytd-video-meta-block.ytd-video-meta-block',
  videotitle: 'span.style-scope.ytd-compact-playlist-renderer'
}, {
  container: 'ytd-watch.style-scope.ytd-page-manager', //Player page. This need to always be the last container. Remove only video on page.
  channelname: 'a.yt-simple-endpoint.style-scope.yt-formatted-string',
  videotitle: 'h1.title.style-scope.ytd-video-primary-info-renderer',
  playerContainer: 'div#player.ytd-watch'
} ];

var commentTag = "ytd-comment-thread-renderer";
var commentReplyTag = "ytd-comment-renderer";
var commentContent = "#content";
var replyContainer = "ytd-comment-renderer.style-scope.ytd-comment-replies-renderer";
var replyContent = "#content-text";
var filterWords = [ ];
var timeOutToUseAlternativeTag = 3;

var rgx = new RegExp( filterWords.join( "|" ), "gi" );

document.addEventListener( 'DOMContentLoaded', function ( event ) {

  chrome.runtime.sendMessage( { 'name': 'pageActionLoaded' } );
  getSettings( function ( storage ) {
    if ( storage.version.updated === true ) {
      var container = document.createElement( 'div' );
      container.classList.add( 'videoblocker-container' );
      document.body.appendChild( container );
      var inner = document.createElement( 'div' );
      inner.classList.add( 'videoblocker-inner' );
      container.appendChild( inner );
      var content = document.createElement( 'div' );
      content.classList.add( 'videoblocker-content' );
      content.innerHTML = '' +
        '<h1><img src="' + chrome.extension.getURL( "images/icons/icon32.png" ) + '" alt="__MSG_extName__"> <span>Journeys Youtube Video Blocker - Extension updated (1.0.2)</span></h1>' +
        '<hr>' +
        '<p>Journeys Youtube Video Blocker extension has been successfully updated. Below, I have listed the changes.</p>' +
        '<ul>' +
        '<li>Rename extension to Journeys Youtube Video Blocker</li>' +
        '</ul>' +
        '<p>More information can be found on the settings page under the \'Help\' section.</p>' +
        '<hr>' +
        '<p style="text-align:center; margin-bottom:0; font-weight:500;"><a id="videoblocker-closewindow" href="#">Close this window (until the next update)</a></p>';
      inner.appendChild( content );
      document.getElementById( 'videoblocker-closewindow' ).addEventListener( 'click', function ( event ) {
        document.querySelector( '.videoblocker-container' ).remove();
        setSetting( 'version', { number: chrome.runtime.getManifest().version, updated: false, installed: false } );
      }, false );
    }
    if ( storage.version.installed === true ) {
      var container = document.createElement( 'div' );
      container.classList.add( 'videoblocker-container' );
      document.body.appendChild( container );
      var inner = document.createElement( 'div' );
      inner.classList.add( 'videoblocker-inner' );
      container.appendChild( inner );
      var content = document.createElement( 'div' );
      content.classList.add( 'videoblocker-content' );
      content.innerHTML = '' +
        '<h1><img src="' + chrome.extension.getURL( "images/icons/icon32.png" ) + '" alt="__MSG_extName__"> <span>Journeys Youtube Video Blocker - Extension installed</span></h1>' +
        '<hr>' +
        '<p>Journeys Youtube Video Blocker extension has been successfully installed. Below, I have listed the key features.</p>' +
        '<ul>' +
        '<li>Block videos from specific YouTube channels by adding them manually or via right click on a video thumbnail. *</li>' +
        '<li>Block videos on YouTube with specific keywords in the title</li>' +
        '<li>Set a password to prevent e.g. children to remove items from the \'blocked\' list. (The extension can still be removed without entering the password though.)</li>' +
        '<li>Export your blocked items and import them on a different computer.</li>' +
        '</ul>' +
        '<p>More information can be found on the settings page under the \'Help\' section.</p>' +
        '<hr>' +
        '<p style="text-align:center; margin-bottom:0; font-weight:500;"><a id="videoblocker-closewindow" href="#">Close this window (until the next update)</a></p>';
      inner.appendChild( content );
      document.getElementById( 'videoblocker-closewindow' ).addEventListener( 'click', function ( event ) {
        document.querySelector( '.videoblocker-container' ).remove();
        setSetting( 'version', { number: chrome.runtime.getManifest().version, updated: false, installed: false } );
      }, false );
    }
  } );
  //Do mutations to monitor content changes. See below.
} );

function startObserver() {
  hideVideos();
  var mutationTarget = document.getElementById( "page-manager" );

  if ( mutationTarget === null ) {
    mutationTarget = document.getElementById( "page-container" );

  }

  if ( mutationTarget === null ) {
    mutationTarget = document.getElementById( "page" );
  }

  function textFilter( node, titleSelector ) {
    var titleCheck = node.querySelector( titleSelector );
    var tcontent = titleCheck !== undefined ? titleCheck.textContent.trim() : undefined;
    var rTitle = rgx.test( tcontent );
    if ( rTitle ) {
      if ( node.parentNode )
        node.remove();
      return;
    }

    var content = node !== undefined ? node.outerText.trim() : undefined;

    if ( content != undefined ) {

      var result = rgx.test( content );
      if ( result ) {
        if ( node.parentNode )
          node.remove();
      }
    }
  }

  var mutationObserver = new MutationObserver( function ( mutations ) {
    var hasCommentTag = false;
    var isNodeAdded = 0;

    for ( var i = 0; i < mutations.length; ++i ) {
      var mutation = mutations[ i ];
      if ( mutation.type == "childList" ) {
        var len = mutation.addedNodes.length;
        if ( len > 0 ) {
          for ( var j = len - 1; j >= 0; --j ) {
            var node = mutation.addedNodes[ j ];
            if ( node.localName === commentTag ) {
              textFilter( node, "span.style-scope.ytd-comment-renderer" );

            } else if ( node.localName === commentReplyTag ) {
              textFilter( node, "span.style-scope.ytd-comment-renderer" );

            } else {
              if ( node.nodeName !== "#text" )
                isNodeAdded = true;

            }
          }

        }
      }
    }

    if ( isNodeAdded )
      hideVideos();
  } );
  var mutationConfig = {
    "childList": true,
    "subtree": true
  };

  if ( mutationTarget !== null )
    mutationObserver.observe( mutationTarget, mutationConfig );
}

waitForElement( "page-manager", function () {
  startObserver();
} );

var loadTime = 0;
//Wait for tag to be available. Then use observer to detect changes.
function waitForElement( elementID, callBack ) {
  window.setTimeout( function () {
    var element = document.getElementById( elementID );
    if ( element ) {
      callBack( elementID, element );
    } else {
      loadTime += 0.5;
      if ( loadTime >= timeOutToUseAlternativeTag ) {
        elementID = "page-container";
        loadTime = 0;
      }
      waitForElement( elementID, callBack );
    }
  }, 500 )
}

function hideVideos() {
  var pageChannelName = undefined;
  if ( document.querySelector( '.branded-page-header-title-link' ) !== null )
    pageChannelName = document.querySelector( '.branded-page-header-title-link' ).textContent.trim();
  else if ( document.querySelector( '#watch-header .yt-user-info .g-hovercard' ) !== null )
    pageChannelName = document.querySelector( '#watch-header .yt-user-info .g-hovercard' ).textContent.trim();
  var pageVideoTitle = undefined;
  if ( document.querySelector( '#watch-header .watch-title' ) !== null )
    pageVideoTitle = document.querySelector( '#watch-header .watch-title' ).textContent.trim();
  getItems( function ( storage ) {
    var items = storage;
    loop1: for ( var i = 0; i < containerList.length; i++ ) {

      var containers = document.body.querySelectorAll( containerList[ i ].container );

      var playerContainer = null;
      if ( containerList[ i ].playerContainer !== undefined ) {
        playerContainer = document.body.querySelector( containerList[ i ].playerContainer );
      }
      loop2: for ( var j = 0; j < containers.length; j++ ) {

        var videotitle = containers[ j ].querySelector( containerList[ i ].videotitle ) !== null ? containers[ j ].querySelector( containerList[ i ].videotitle ).textContent.trim() : undefined,
          channelname = containers[ j ].querySelector( containerList[ i ].channelname ) !== null ? containers[ j ].querySelector( containerList[ i ].channelname ).textContent.trim() : undefined,
          block = false,
          blockPage = false;
        if ( containerList[ i ].container === '.ytp-endscreen-content .ytp-videowall-still' && channelname.indexOf( '\u2022' ) > -1 )
          channelname = channelname.substr( 0, channelname.indexOf( '\u2022' ) ).trim();
        loop3: for ( var k = 0; k < items.length; k++ ) {
          var key = items[ k ].key,
            type = items[ k ].type,
            regexpobj = key.match( /^\/(.+?)\/(.+)?/ );
          if ( regexpobj !== null ) {
            try {
              var regexp = new RegExp( regexpobj[ 1 ], regexpobj[ 2 ] );
            } catch ( e ) {
              var regexp = undefined;
            }
          }
          switch ( type ) {
          case 'channel':
            if ( regexpobj !== null ) {
              if ( pageChannelName && regexp && regexp.test( pageChannelName ) === true ) {
                blockPage = true;
              }
              if ( regexp && regexp.test( channelname ) === true ) {
                block = true;
              }
            } else {
              if ( pageChannelName && pageChannelName === key ) {
                blockPage = true;
              }
              if ( channelname === key ) {
                block = true;
              }
            }
            break;
          case 'wildcard':
            if ( regexpobj === null ) {
              if ( channelname != undefined ) {
                if ( channelname.toLowerCase().indexOf( key.toLowerCase() ) > -1 ) {
                  block = true;
                }
              }
            }
            break;
          case 'keyword':
            if ( regexpobj !== null ) {
              if ( pageVideoTitle && regexp && regexp.test( pageVideoTitle ) === true ) {
                blockPage = true;
              }
              if ( regexp && regexp.test( videotitle ) === true ) {
                block = true;
              }
            } else {
              if ( pageVideoTitle && pageVideoTitle.toLowerCase().indexOf( key.toLowerCase() ) > -1 ) {
                blockPage = true;
              }
              if ( videotitle != undefined ) {
                if ( videotitle.toLowerCase().indexOf( key.toLowerCase() ) > -1 ) {
                  block = true;
                }
              }
            }
            break;
          }
          if ( blockPage === true ) {
            if ( /.+&list=.+/.test( window.location.href ) === true ) {
              document.body.querySelector( '#player-api .ytp-next-button' ).click();
              break loop1;
            } else {
              getSettings( function ( storage ) {
                if ( storage.redirect === true ) {
                  window.location.replace( '/' );
                }
              } );
            }
          }
          if ( block === true ) {
            if ( containerList[ i ].playerContainer != undefined ) {
              if ( playerContainer != null )
                playerContainer.remove();
            } else {
              containers[ j ].remove();
            }
            break;
          }
        }
        if ( block === false ) {
          containers[ j ].style.visibility = 'visible';
        }
      }
    }
  } );
  fixThumbnails();
}
var contextChannelName;
window.addEventListener( 'contextmenu', function ( event ) {
  contextChannelName = null;
  for ( var i = 0; i < containerList.length; i++ ) {
    if ( event.target.closest( containerList[ i ].container ) !== null ) {

      var channelQuery = event.target.closest( containerList[ i ].container ).querySelector( containerList[ i ].channelname );

      contextChannelName = channelQuery != null ? channelQuery.textContent.trim() : null;
      if ( containerList[ i ].container === '.ytp-endscreen-content .ytp-videowall-still' && contextChannelName.indexOf( '\u2022' ) > -1 )
        contextChannelName = contextChannelName.substr( 0, contextChannelName.indexOf( '\u2022' ) ).trim();
    }

    if ( contextChannelName !== null )
      break;
  }
} );
chrome.runtime.onMessage.addListener( function ( message ) {
  if ( message.name === 'contextMenuClicked' && contextChannelName !== null ) {
    addItem( { key: contextChannelName, type: 'channel' }, hideVideos );
  }
} );

function fixThumbnails() {
  var allThumbs = document.body.querySelectorAll( ".thumb-link img, .yt-thumb img" );
  for ( var i = 0; i < allThumbs.length; i++ ) {
    if ( allThumbs[ i ].hasAttribute( 'data-thumb' ) && allThumbs[ i ].getAttribute( 'data-thumb' ) !== allThumbs[ i ].getAttribute( 'src' ) )
      allThumbs[ i ].setAttribute( 'src', allThumbs[ i ].getAttribute( 'data-thumb' ) );
  }
}
//# sourceMappingURL=videoblocker.js.map
