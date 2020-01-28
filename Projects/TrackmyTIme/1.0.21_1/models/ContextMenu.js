// NOW CONTEXT MENU DEVELOPMENT IS FROZEN

(function () {
  "use strict";
  /*
   * @class for adding ticks to storage
   * */

  var ContextMenu = function (obj) {
    this.user       = obj.user
    this.state      = obj.user._state;
    this.configData = obj.user.configData
  };

  ContextMenu.init = function (user) {
    var userInit = events.subscribe('/user/init', function (obj) {

      var contextMenu = new ContextMenu(obj);
      contextMenu.initInterface();
    });

    return Promise.resolve({"message": "ContextMenu was init"});
  };


  ContextMenu.prototype.initInterface = function () {
    var self = this;

    return Promise.resolve()
      .then(function() { return self.initSSRadioButtons(); })
      .then(function() { return self.initRadioSwitchListener(); });
  };

  ContextMenu.prototype.initSSRadioButtons = function () {
    var iconPath,
      self            = this,
      configData      = self.configData,
      trackingStopped = self.configData.trackingStopped;

    return new Promise(function(resolve, reject) {
      var wasRejected = false,
        menuItems = 0,
        done = function (err) {
          if (err) { return reject(chrome.runtime.lastError); }
          if (menuItems === 2) { resolve({message: "Context TYW running time tracking button was created"}); }
        };


      iconPath  = '/img/' + trackingStopped === 0 ?'clock_48.png' : 'clock_48_g.png';
      chrome.browserAction.setIcon({path: iconPath});

      self.runningBtn = chrome.contextMenus.create({
        title: "Run Tracking Time",
        contexts: ["browser_action"],
        type: "radio",
        checked: trackingStopped === 0,
        onclick: function () {
          configData.trackingStopped = 0;
          self.user.setState().then(function () {
            events.publish('/context-menu/to-run-conveyor');
          });
        },
      }, function () {
        menuItems += 1;
         done(chrome.runtime.lastError);
      });

      self.stoppingBtn = chrome.contextMenus.create({
        title: "Stop Tracking Time",
        contexts: ["browser_action"],
        type: "radio",
        checked: trackingStopped === 1,
        onclick: function () {
          configData.trackingStopped = 1;
          self.user.setState().then(function () {
            events.publish('/context-menu/to-stop-conveyor');
          });
        },
      }, function () {
        menuItems += 1;
        done(chrome.runtime.lastError);
      });
    });
  };

  ContextMenu.prototype.initRadioSwitchListener = function () {
    var self = this;

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

      if (request.greeting === "/configuration/switch-menu-state") {
        if (request.trackingState === "stop") {
          chrome.contextMenus.update(self.stoppingBtn, {checked: true});
          events.publish('/context-menu/to-stop-conveyor');
        } else {
          chrome.contextMenus.update(self.runningBtn, {checked: true});
          events.publish('/context-menu/to-run-conveyor');
        }
        sendResponse({result: "Ok", command: "/user/reInitUser"});
      }
    });

  };

  window.ContextMenu = ContextMenu;

}());
  