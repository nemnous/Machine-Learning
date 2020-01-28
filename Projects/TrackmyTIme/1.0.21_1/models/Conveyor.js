/*global window, chrome, Promise*/

(function () {

  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }


  "use strict";
  var Conveyor,
    parser = document.createElement('a'),
    getDomain = function (site) {

      parser.href = site;

      return (!parser.protocol  ? "" : parser.protocol)
            + (!parser.protocol ? "" : "//")
            + (!parser.host     ? "" : parser.host);
    },
    getPage = function (site) {
      parser.href = site;
      return (!parser.pathname ? "" : parser.pathname)
           + (!parser.search   ? "" : parser.search)
           + (!parser.hash     ? "" : parser.hash);
    };

  /*
  * @class for adding ticks to storage
  * */

  Conveyor                       = function () {
    this.tickEngine       = null;
  };

  Conveyor.prototype.setUser      = function (user) {

    this.user             = user;
    this.db               = user._trackingDb;
    this.ignoringRules    = user._state.configData.ignoringRules;
    this.secIdleInterval  = user._state.configData.secIdleInterval;
    this.secTickFrequency = user._state.configData.secTickFrequency;
    this.tickEngine       = null;

  }


  Conveyor.init                  = function (user) {
    var conveyor = new Conveyor();

    events.subscribe('/user/init', function(obj) {
      conveyor.stop();
      conveyor.setUser(obj.user);

      if (obj.user.configData.trackingStopped === 0) { conveyor.run(); }
      else {  }

      chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

        if (request.to === '/conveyor/to-run') {
          conveyor.run().then(function(){
            sendResponse({result: "Conveyor was run"});
          });
        }

        if (request.to === '/conveyor/to-stop') {
          conveyor.stop().then(function(){
            sendResponse({result: "Conveyor was stopped"});
          });
        }

        if (request.to === '/core/re-init-conveyor-user') {
          User.init().then(function (res) { sendResponse({result: "Conveyor was run"}); });
        }
      });


    });
    return Promise.resolve({"message": "Conveyor was init"});
 };

  Conveyor.prototype.doTick      = function () {
    var self = this;

    chrome.idle.queryState(self.secIdleInterval, function (state) {
      chrome.windows.getLastFocused({populate: true}, function (window) {
        if (chrome.runtime.lastError) { console.log(chrome.runtime.lastError.message); }

        if (!window) { return; }
        var ind, lastVisitedUrl,
          tab = null,
          ignoreTick = false;

        for (ind = 0; ind < window.tabs.length; ind += 1) {
          if (window.tabs[ind].highlighted) {
            tab = window.tabs[ind];
          }
        }

        if (tab && window.focused) { // Else There is no active tab. For ex.: It could be Developer Tool Window
          // console.log(tab.favIconUrl, tab.title);
          lastVisitedUrl = tab.url;

          for (ind = 0; ind < self.ignoringRules.length; ind += 1) {
            if (lastVisitedUrl.slice(0, self.ignoringRules[ind].length) ===  self.ignoringRules[ind]) {
              ignoreTick = true;
            }
          }
          if (!ignoreTick) {
            self.tick(lastVisitedUrl, new Date().getTime(), state === "active", tab.title, tab.favIconUrl)
              .catch(function (e) { console.log(e); });
          } else {
            chrome.browserAction.setBadgeText({text: ""});
          }
        }
      });
    });
  };

  Conveyor.prototype.tick = function (site, msTime, isActive, title, faviconPath) {
    var self  = this,
      db      = self.db,
      secTime = Math.ceil(msTime / 1000),
      domain  = getDomain(site),
      page    = getPage(site);

    return db.transaction('rw', db.domains, db.pages, db.activeFlow, db.totalFlow,  function () {
      return db.domains.where('d').equals(domain).toArray()
      //--- get correspondent stored USER DOMAIN object or create new one
        .then(function (domainArr) {
          var domainRecord = domainArr[0];
          // domains:  '[d+uId],&dId,d,pN,uId',
          if (!domainRecord) {
            return db.domains.add({d: domain, faviconPath: faviconPath}).then(function (dId) {
              return {d: domain, dId: dId, faviconPath: faviconPath};
            });
          }
          // updating all favicon path
          if (domainRecord.faviconPath !== faviconPath) {
            domainRecord.faviconPath = faviconPath;
            return db.domains.update(domainRecord.dId, domainRecord).then(function () {
              return domainRecord;
            });
          }
          return domainRecord;
        })

        //--- get correspondent stored PAGE object or create new one
        .then(function (storedDomain) {
          return db.pages.where('[dId+p]').equals([storedDomain.dId, page]).toArray().then(function (pageArr) {
            var pageRecord = pageArr[0];
            if (!pageRecord) {
              return db.pages.add({dId: storedDomain.dId, p: page, title: title})
                .then(function (pId) {
                  return {dId: storedDomain.dId, p: page, pId: pId, title: title};
                });
            }
            // updating all favicon path

            if (pageRecord.title !== title) {
              pageRecord.title = title;
              return db.pages.update(pageRecord.pId, pageRecord).then(function (pId) {
                return pageRecord;
              });
            }


            return pageRecord;
          });
        })

        //--- update VISITING PERIOD or create new one
        .then(function (storedPage) {

          if (isActive && (!self.lastActive
            || storedPage.dId !== self.lastActive.dId
            || storedPage.pId !== self.lastActive.pId
            || secTime - self.lastActive.f >= 2 * self.secTickFrequency)) {


            self.lastActive = { s: secTime, f: secTime, dId: storedPage.dId, pId: storedPage.pId };
          }
          if (!self.lastTotal
            || storedPage.dId !== self.lastTotal.dId
            || storedPage.pId !== self.lastTotal.pId
            || secTime - self.lastTotal.f >= 2 * self.secTickFrequency) {
            self.lastTotal = { s: secTime, f: secTime, dId: storedPage.dId, pId: storedPage.pId };
          }

          if (secTime - self.lastActive.f < 2 * self.secTickFrequency && isActive) { self.lastActive.f = secTime; }
          if (secTime - self.lastTotal.f  < 2 * self.secTickFrequency) {             self.lastTotal.f  = secTime; }
          // console.log('--- self.lastActive');
          // console.log(self.lastActive);
          // console.log('--- self.lastTotal');
          // console.log(self.lastTotal);

          return Promise.all([
            db.activeFlow.put(self.lastActive),
            db.totalFlow.put(self.lastTotal)
          ]).then(function (res) {
            return storedPage;
          }).catch(function (err) {
            console.log(err);
          });
        })
        .then(function (storedPage) {
          var startSec, dayStart = new Date();
          dayStart.setHours(0,0,0,0);
          startSec = dayStart.getTime() / 1000;
          self.db.totalFlow
            .where('[dId+s]')
            .between([storedPage.dId, startSec], [storedPage.dId, startSec + 86400])
            .toArray()
            .then(function(periods) {
              var ind, domainSecDuration = 0;
              for (ind = 0; ind < periods.length; ind += 1) {
                domainSecDuration += periods[ind].f - periods[ind].s;
              }
              self.updateBadge(domainSecDuration);
            });
        });
    });
  };

  Conveyor.prototype.updateBadge = function (domainSecDuration) {
    var durationLabel;
    if (domainSecDuration < 60) {
      durationLabel = moment.duration(domainSecDuration, 'seconds').seconds() + 's';
    } else if (domainSecDuration < 3600) {
      durationLabel = moment.duration(domainSecDuration, 'seconds').minutes() + 'm';
    } else {
      durationLabel = moment.duration(domainSecDuration, 'seconds').hours()  + ':' +
               ("0" + moment.duration(domainSecDuration, 'seconds').minutes()).substr(-2) ;
    }

    chrome.browserAction.setIcon({path: '/img/clock_48.png'});
    chrome.browserAction.setBadgeBackgroundColor({color: "#333"});
    chrome.browserAction.setBadgeText({text: durationLabel});
  };

  Conveyor.prototype.run         = function () {
    var self = this;

    return Promise.resolve().then(function () {
      chrome.browserAction.setIcon({path: '/img/clock_48.png'});

      self.tickEngine = setInterval(function () {
        self.doTick();
      }, self.secTickFrequency * 1000);

      return self;
    }).catch(function (e) { console.log(e); });
  };

  Conveyor.prototype.stop        = function () {
    var self = this;
    return Promise.resolve().then(function () {
      clearInterval(self.tickEngine);
      chrome.browserAction.setIcon({path: '/img/clock_48_g.png'});
      chrome.browserAction.setBadgeText({text: ""});
    });
  };

  window.Conveyor = Conveyor;

}());


