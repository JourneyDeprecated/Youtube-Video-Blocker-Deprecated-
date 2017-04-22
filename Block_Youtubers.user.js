// ==UserScript==
// @name         Block youtube users
// @version      0.0.1
// @author       JourneyOver
// @include     *youtube.com/*
// @exclude     *my_videos*
// @grant       GM_getValue
// @grant       GM_setValue
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require     https://gist.github.com/raw/2625891/waitForKeyElements.js
// @downloadURL https://github.com/JourneyOver/Youtube-Video-Blocker/blob/Userscript/Block_Youtubers.user.js
// @updateURL   https://github.com/JourneyOver/Youtube-Video-Blocker/blob/Userscript/Block_Youtubers.user.js
// ==/UserScript==

(function () {
    var script = document.createElement('script');
    script.src = 'https://raw.githubusercontent.com/JourneyOver/Youtube-Video-Blocker/Userscript/Block_Youtubers.js';
    script.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(script);
})();