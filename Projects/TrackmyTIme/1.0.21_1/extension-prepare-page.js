/*global chrome,
 Charts, $, moment*/
"use strict";

chrome.tabs.getCurrent(function (tab) {
  // fix popup css to fullScreen css
  if (tab) {
    $('#open-popup-wide').addClass('hidden');
    $('html').css({"height": "100%", "min-height": "100%", "width": "100%"});
    $('body').css({"height": "100%", "min-height": "100%", "width": "100%"});
  }
});
