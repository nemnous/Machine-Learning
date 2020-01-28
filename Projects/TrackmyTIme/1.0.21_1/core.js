/*global chrome, tyw,
 Conveyor, ContextMenu, User*/

(function () {
  "use strict";

  window.tyw = {};

  Conveyor.init()
    // .then(function(){ return ContextMenu.init(); }) // IS FROZEN
    .then(function(){ return User.init(); })
    .catch(function(err) {
      throw err;
    });

  chrome.runtime.onInstalled.addListener(function(details){
    var thisVersion = chrome.runtime.getManifest().version;
    if (thisVersion === '1.0.9') {
      if(details.reason == "install" ){
        var opt = {
          type: "basic",
          title: "TimeYourWeb 1.0.9 version is installed ",
          message: "Read more about TimeYourWeb features",
          // items: [
          //   { title: "Now you can", message: ""},
          //   { title: "1. See time you spent several of domains", message: ""},
          //   { title: "2. Compare summary of active total time", message: ""},
          // ],
          buttons: [
            { title: "Join to TYW on Facebook" },
          ],
          iconUrl: "/img/clock_128.png"
        };
        chrome.notifications.create(opt);
        chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonIndex){
          if (buttonIndex === 0) {
            chrome.tabs.create({url: 'https://www.facebook.com/groups/timeyourweb/'});
          }
        });
      } else if (details.reason == "update") {
        var opt = {
          type: "basic",
          title: "TimeYourWeb 1.0.9 version is installed",
          message: "Now you can summarize spent time for list of domains. Summary Tab became more powerful.",
          // items: [
          //   { title: "Two draggable indicators were added", message: ""},
          //   { title: "Summarize spent time for list of domains", message: ""},
          //   { title: "Compare active and total time", message: ""},
          // ],
          buttons: [
            { title: "Read more about new TYW features" }
          ],
          iconUrl: "/img/clock_128.png"
        };
        chrome.notifications.create(opt);
        chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonIndex){
          if (buttonIndex === 0) {
            chrome.tabs.create({url: 'https://www.facebook.com/media/set/?set=oa.622692307932633'});
          }
        });
      }
    }

  });

}());

