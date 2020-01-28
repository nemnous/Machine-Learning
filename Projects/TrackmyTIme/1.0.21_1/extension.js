/*global chrome, Promise,
  Menu, Charts, Configuration,
  $, moment*/
"use strict";

// (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
//     (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
//   m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
// })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

// ga('create', 'UA-85059525-2', 'auto');
// ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
// ga('require', 'displayfeatures');
// ga('send', 'pageview', '/extension.html');

chrome.tabs.getCurrent(function (tab) {
  // fix popup css to fullScreen css
  if (tab) {
    $('#expand-btn').hide();
    $('html').css({"height": "100%", "min-height": "100%", "width": "100%", "margin": "0px", "padding": "0px"});
    $('body').css({"height": "100%", "min-height": "100%", "width": "100%", "margin": "0px", "padding": "0px"});
  }
});

$(function() {


  var menuElement = document.getElementById('extension'),
    content = document.getElementById('content');
  $( document ).tooltip();

  Promise.all([
    Menu.init(),
    Charts.init(),
    Configuration.init()
  ]).then(function(res) {
    User.init();
  })

});




