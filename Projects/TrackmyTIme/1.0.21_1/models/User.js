/*global window, chrome, Promise, HTMLElement,
 moment, d3, $,
 */

(function () {
  "use strict";

  /**
   * @class User module 
   *        users: '++uId,uUUID,authorized' // userId, global userData UUID, authorized (0|1) could only one
   *         
   * */
  var LOCAL_USER_ID = "00000000-0000-0000-0000-000000000000";
  var LOCAL_COMPUTER_ID = "00000000-0000-0000-0000-000000000000";

  var User               = function (userSeed) {
    this._state       = userSeed.user.state;
    this.configData   = userSeed.user.state.configData;
    this.chartsData   = userSeed.user.state.chartsData;
    this.menuData     = userSeed.user.state.menuData;
    this.uId          = userSeed.user.uId;
    this.uUUID        = userSeed.user.uUUID;
    this.cUUID        = userSeed.user.cUUID;
    this._trackingDb  = userSeed.trackingDb;
    this._usersDb     = userSeed.usersDb;
  };

  // + 1. Init usersDB
  // + 2. Init Local User (If needed)
  // + 3.  Get AuthorizedUser
  // + 4. Init AuthorizedUser Default dataDB (if needed)
  // - 5. Init AuthorizedUser         dataDB array (skipped on this DEV iteration)
  //   6. return new User Entity
  User.init              = function () {
    var userSeed = {};
    return User.initUsersDB(userSeed)
      .then(function() { return User.initDefaultUser(userSeed);})
      .then(function() { return User.getAuthorizedUser(userSeed); })
      .then(function() { return User.initUserDataDB(userSeed); })
      .then(function() { return User.initEmptyConfigValues(userSeed); })
      .then(function() { return User.currentDayUpdate(userSeed); })
      .then(function() {
        var user = new User(userSeed);
        return user.getActiveDays().then(function(activeDays) {
          events.publish('/user/init', { user: user, activeDays: activeDays });
        }).then(function(activeDays) {
          return {message: "User was init"};
        })
      })
      .catch(function(err) { throw err; });
  };

  User.initUsersDB       = function (userSeed) {
    var usersDb = new Dexie("usersDB");
    // usersDb.delete().then(function (res) { console.log(res); }).catch(function (err) { console.log(err); });
    // var dataDb = new Dexie("00000000-0000-0000-0000-000000000000.00000000-0000-0000-0000-000000000000");
    // dataDb.delete().then(function (res) { console.log(res); }).catch(function (err) { console.log(err); });
    // var defaultDb = new Dexie("default");
    // defaultDb.delete().then(function (res) { console.log(res); }).catch(function (err) { console.log(err); });
    // return;

    // https://docs.google.com/document/d/1id2x515xp1CVe5stbMWJOKtytcOA6Fv8XDS7IhaYSZA/edit#heading=h.xa5l0hsoyk5x
    usersDb.version(1).stores({ users: '++uId,&uUUID,&cUUID,authorised' });
    return usersDb.open().then(function () { userSeed.usersDb = usersDb; return; });
  };

  User.initDefaultUser   = function (userSeed) {
    var currDate = new Date().toISOString().slice(0, 10),
      localUser = {
        "uUUID": LOCAL_USER_ID,
        "cUUID": LOCAL_COMPUTER_ID,
        "authorized": 1,
        "state" : {
          "configData": {
            "ignoringRules":[
              "chrome://newtab",
            ],
            "weekStart": 1, // 0 - Sat, 1 - Mon, 2 - Tue,...
            "trackingStopped": 0, // 0 - Tracking is Running; 1 - Tracking is Stopped
            "secIdleInterval" : 30, // in seconds
            "secTickFrequency": 1  // in seconds
          },
          "menuData": {
            "activeTab":       0, // 0 - summary, 1 - stacked, 2 - flow
            "summaryPeriods":  0, // 0 - Day, 1 - Week, 2 - Month
            "flowPeriods":     0, // 0 - Day, 1 - Week, 2 - Month
            "stackedPeriods":  2, //                    2 - ONLY MONTH SELECTION,
            "flowTypes":       0, // 0 - Total, 1 - Active
            "stackedTypes":    0, // 0 - Total, 1 - Active
            "summaryDate":     currDate,
            "flowDate":        currDate,
            "stackedDate":     currDate

          },
          "chartsData": {
            "summary": {
              "order": "total", // total | active | pages | views | url
              "activeFlagShift": 50,
              "totalFlagShift": 80,
            }
          },
        },
      };
    return userSeed.usersDb.users.where("uUUID").equals(LOCAL_USER_ID).first().then(function(userData) {
      if (!userData) { userSeed.usersDb.users.add(localUser); return ; }
      // localUser = {
      //   "state" : {
      //     "menuData": {
      //       "activeTab":       2, // 0 - summary, 1 - stacked, 2 - flow
      //       "summaryPeriods":  0, // 0 - day, 1 - week, 2 - month
      //       "flowPeriods":     1, // 0 - day, 1 - week, 2 - month
      //       "stackedPeriods":  0, // ALWAYS day
      //       "summaryDate":     currDate,
      //       "flowDate":        currDate,
      //       "stackedDate":     currDate,
      //     }
      //   },
      // };
      // userSeed.usersDb.users.update(userData.uId, localUser);
    })
  };

  User.getAuthorizedUser = function (userSeed) {
    return userSeed.usersDb.users.where("uUUID").equals(LOCAL_USER_ID).first().then(function(user) {
      userSeed.user = user;
    });
  };

  User.initUserDataDB    = function (userSeed) {
    var user = userSeed.user,
      db = new Dexie(user.uUUID + '.' + user.cUUID);

    // https://docs.google.com/document/d/1id2x515xp1CVe5stbMWJOKtytcOA6Fv8XDS7IhaYSZA/edit#heading=h.xa5l0hsoyk5x
    db.version(1).stores({
      // [userID,domain], userId, domain, domainID, pageN umber
      // [domainId,page], [domainId+pageId], page, domainId, pageId, userId
      domains: '++dId,&d',
      pages:   '++pId,&[dId+p],&[dId+pId],p,dId',

      // start, finish, domainId, pageId
      activeFlow: 's,f,dId,pId,&[dId+s]',
      totalFlow:  's,f,dId,pId,&[dId+s]'
    });
    return db.open().then(function () {     // remowing 2016-07-24 day
      // return db.totalFlow.where("s").between(1469307600, 1469307600 + 86400).delete().then(function(res) {
      //
      //   userSeed.trackingDb = db; return;
      // });
      userSeed.trackingDb = db; return;
    });
  };

  User.currentDayUpdate  = function (userSeed) {
    var today = moment().format('YYYY-MM-DD');
    if (userSeed.user.state.today !== today) {
      userSeed.user.state.today = today;
      userSeed.user.state.menuData.summaryDate = today;
      userSeed.user.state.menuData.flowDate    = today;
      userSeed.user.state.menuData.stackedDate = today;
      return userSeed.usersDb.users.update(userSeed.user.uId, {state: userSeed.user.state})
        .catch(function(err) { console.log(err); });
    }
    return userSeed;
  };

  User.initEmptyConfigValues = function (userSeed) {
    return new Promise(function(resolve) {
      if (!userSeed.user.state.menuData.flowTypes) {
        userSeed.user.state.menuData.flowTypes = 0; // 0 - Total; 1 - Active
      };
      if (!userSeed.user.state.menuData.stackedTypes) {
        userSeed.user.state.menuData.stackedTypes = 0; // 0 - Total; 1 - Active
      };
      if (!userSeed.user.state.configData) {
        userSeed.user.state.configData = {
          "ignoringRules": [],
          "weekStart": 1,         // 0 - Sat, 1 - Mon, 2 - Tue,...
          "trackingStopped": 0,   // 0 - Tracking is Running; 1 - Tracking is Stopped
          "secIdleInterval" : 30, // in seconds
          "secTickFrequency": 1   // in seconds
        };
      };
      if (!userSeed.user.state.chartsData.summary.hasOwnProperty('totalFlagShift')) {
        userSeed.user.state.chartsData.summary.totalFlagShift = 80;
      };
      if (!userSeed.user.state.chartsData.summary.hasOwnProperty('activeFlagShift')) {
        userSeed.user.state.chartsData.summary.activeFlagShift = 50;
      };

      resolve(userSeed);
    })
  };

  User.prototype.getState = function() {
    return Promise.resolve(this._state);
  };

  User.prototype.setState = function(stateData) {
    var state = stateData || this._state;
    return this._usersDb.users.update(this.uId, {state: state}).catch(function(err) { console.log(err); });
  };

  User.prototype.getActiveDays = function() {
    var startMoment,  nextDay,
      activeDays = [],
      self = this,
      getDay = function (timestamp) { //
        var date = new Date(timestamp);

        return date.getFullYear() + '-' +
          ("0" + (date.getMonth() + 1)).substr(-2) + '-' +
          ("0" + (date.getDate())).substr(-2);
      };
    return self._trackingDb.totalFlow.limit(1).first().then(function (firstPeriod) {
      if (!firstPeriod) { return [getDay(new Date())]; }
      var dayInd,
        timeReqArray = [];

      // -------------- building activeDays array ----------------
      startMoment  = moment(firstPeriod.s, 'X').startOf('day');
      nextDay = moment().add(1, 'days').startOf('day');
      while (startMoment.isBefore(nextDay)) {
        timeReqArray.push(
          self._trackingDb.totalFlow.where("s").between(startMoment.unix(), startMoment.unix() + 86400).count()
            .then(function(count) {
              if (count) { return count; }
              return null;
            })
        );
        activeDays.push(getDay(startMoment.toDate()));
        startMoment.add(1, 'days');
      }


      return Promise.all(timeReqArray).then(function (res) {
        var currentDay = new Date();
        currentDay.setHours(0, 0, 0, 0);
        var currentDayStr = getDay(currentDay);
        if (activeDays[activeDays.length - 1] !== currentDayStr) { activeDays.push(currentDayStr); }
        return activeDays.filter(function(item, ind) { if (res[ind]) return item; });
      });
    })
  };

  User.prototype.getSummary = function() {
    var self = this;
    return self.getStartStopSec('summary').then(function(startStopSec){


      return Promise.all([
        self._trackingDb.totalFlow.where("s").between(startStopSec.startSec, startStopSec.stopSec).toArray(),
        self._trackingDb.activeFlow.where("s").between(startStopSec.startSec, startStopSec.stopSec).toArray()
      ])
        .then(function (periods) {

          var ind, period, periodLength, domainId, pageId,
            dIds = [],
            pIds = [],
            rawTotalPeriods = periods[0],
            rawActivePeriods = periods[1],
            summaryObj = {total: {t: 0, a: 0, vN: 0, pN: 0}};

          for (ind = 0; ind < rawTotalPeriods.length; ind += 1) {
            period   = rawTotalPeriods[ind];
            domainId = period.dId;
            pageId   = period.pId;
            if (!summaryObj[domainId]) {
              dIds.push(domainId);
              summaryObj[domainId] = {t: 0, a: 0, p: {}, vN: 0, pN: 0};
            }
            if (!summaryObj[domainId].p[pageId]) {
              pIds.push(pageId);
              summaryObj[domainId].p[pageId] = {t: 0, a: 0, vN: 0, pN: 1};
              summaryObj.total.pN             += 1;
              summaryObj[domainId].pN         += 1;
            }
            summaryObj.total.vN               += 1;
            summaryObj[domainId].vN           += 1;
            summaryObj[domainId].p[pageId].vN += 1;

            periodLength = period.f - period.s;
            summaryObj.total.t               += periodLength;
            summaryObj[domainId].t           += periodLength;
            summaryObj[domainId].p[pageId].t += periodLength;
          }

          for (ind = 0; ind < rawActivePeriods.length; ind += 1) {
            period   = rawActivePeriods[ind];
            domainId = period.dId;
            pageId   = period.pId;
            periodLength = period.f - period.s;
            summaryObj.total.a               += periodLength;
            summaryObj[domainId].a           += periodLength;
            summaryObj[domainId].p[pageId].a += periodLength;
          }
          var dIdsProm = Promise.all(dIds.map(
              function(item) { return self._trackingDb.domains.get(item).then(function(res) { return res; }); })),
            pIdsProm = Promise.all(pIds.map(
              function(item) { return self._trackingDb.pages.get(item).then(function(res) { return res; }); }));


          return Promise.all([ dIdsProm, pIdsProm ]).then(function (res) {
            var ind, dKey, pKey, domainObj, pages, pageObj,
              dIdsArray = res[0],
              pIdsArray = res[1],
              dIds      = {},
              pIds      = {},
              result = { total: {
                d: 'inAll',
                a: summaryObj.total.a,
                t: summaryObj.total.t,
                dNum: dIdsArray.length,
                pNum: pIdsArray.length,
                pN:   summaryObj.total.pN,
                vN:   summaryObj.total.vN,
                dN:   0
              }, data: [], maxT: 0 };

            for (ind = 0; ind < dIdsArray.length; ind += 1) {
              dIds[dIdsArray[ind].dId] = { d: dIdsArray[ind].d, faviconPath: dIdsArray[ind].faviconPath};
            }
            for (ind = 0; ind < pIdsArray.length; ind += 1) {
              pIds[pIdsArray[ind].pId] = {p: pIdsArray[ind].p, title: pIdsArray[ind].title} ;
            }

            for (dKey in summaryObj) { if (summaryObj.hasOwnProperty(dKey) && dKey !== "total" && summaryObj[dKey].t > 0) {
              result.total.dN += 1;
              domainObj = {
                a:     summaryObj[dKey].a,
                t:     summaryObj[dKey].t,
                d:     dIds[dKey].d,

                fIcon: dIds[dKey].faviconPath,
                pNum:  0,

                pA:     summaryObj[dKey].a,
                pT:     summaryObj[dKey].t,
                unfolded:   false,

                vN:     summaryObj[dKey].vN,
                pN:     summaryObj[dKey].pN,
                pVN:    summaryObj[dKey].vN,
                pPN:    summaryObj[dKey].pN,
              };
              if (result.maxT < domainObj.t) { result.maxT = domainObj.t; }
              result.data.push(domainObj);
              pages      = summaryObj[dKey].p;
              for (pKey in pages) { if (pages.hasOwnProperty(pKey) && summaryObj[dKey].p[pKey].t > 0) {
                pageObj = {
                  a:  summaryObj[dKey].a,
                  t:  summaryObj[dKey].t,
                  d:  dIds[dKey].d,

                  p:  pIds[pKey].p,
                  pA: summaryObj[dKey].p[pKey].a,
                  pT: summaryObj[dKey].p[pKey].t,

                  vN:  summaryObj[dKey].vN,
                  pN:  summaryObj[dKey].pN,
                  pVN: summaryObj[dKey].p[pKey].vN,
                  pPN: summaryObj[dKey].p[pKey].pN,

                  title: pIds[pKey].title,
                  display: "none"
                };
                result.data.push(pageObj);
                domainObj.pNum += 1;
              }}
            }}
            result.data.push(result.total);
            return result;
          });
        })
        .catch(function (err) {
          console.log(err);
        });
    });
  };

  User.prototype.getFlow = function () {
    var self = this;
    return self.getStartStopSec('flow').then(function(startStopSec){
      var flowName = self.menuData.flowTypes === 0 ? 'totalFlow' : 'activeFlow';
      return Promise.all([
        self._trackingDb[flowName].where("s").between(startStopSec.startSec, startStopSec.stopSec).toArray(),
      ])
        .then(function (periods) {
          if (periods[0].length === 0) { return {}; }
          /* period = { dId: 78, f: 1472611251, pId: 923, s: 1472611217 } */
          var ind, tmpInd, dIdInd,
            tmpTotalPeriods = [], tmpActivePeriods = [],
            dIdKeys,   pIdKeys,
            dIds = {}, pIds = {},
            totalPeriods = periods[0];
          totalPeriods.forEach(function(item) { dIds[item.dId] = {};  pIds[item.pId] = {}; });

          dIdKeys = Object.keys(dIds);
          pIdKeys = Object.keys(pIds);
          var dIdsPromise = Promise.all( dIdKeys.map( function(item) {
              return self._trackingDb.domains.get(Number(item)).then(function(res) { return res; }); })),
            pIdsPromise = Promise.all( pIdKeys.map( function(item) {
              return self._trackingDb.pages.get(Number(item)).then(function(res) { return res; }); }));

          return Promise.all([ dIdsPromise, pIdsPromise ]).then(function (res) {
            var splitInds, splittedPeriods,
              dIdsArray = res[0], pIdsArray = res[1];
            dIdInd = 0;
            dIdsArray.forEach(function(item) { item.serialNum = dIdInd++; dIds[item.dId] = item; });
            pIdsArray.forEach(function(item) { pIds[item.pId] = item; });

            // -------------- building edges array ----------------
            var sec, edges = [], startPoint,
              finishPoint = totalPeriods[totalPeriods.length - 1].f,
              periodsType = self._state.menuData.flowPeriods; // 0-day,1-week,2-month

            if (periodsType === 0) {
              startPoint  = moment(totalPeriods[0].s, 'X').startOf('hour').unix();
              finishPoint = moment(totalPeriods[totalPeriods.length - 1].f, 'X').startOf('hour').unix();
              for (sec = startPoint; sec <= finishPoint; sec += 3600) {
                edges.push(sec);
              }
            } else {
              startPoint  = moment(totalPeriods[0].s, 'X').startOf('day').unix();
              finishPoint = moment(totalPeriods[totalPeriods.length - 1].f, 'X').startOf('day').unix();
              for (sec = startPoint; sec <= finishPoint; sec += 86400) {
                edges.push(sec);
              }
            }

            // -------------- splitting periods on timePeriods edges -------------------
            for (ind = 0; ind < edges.length; ind += 1) {
              splitInds = User.splitInd(totalPeriods, edges[ind], 's');
              if (splitInds.leftIndex === -1) { continue; }
              if (totalPeriods[splitInds.leftIndex].f > edges[ind]) {
                totalPeriods.splice(splitInds.leftIndex, 1, {
                  dId: totalPeriods[splitInds.leftIndex].dId,
                  pId: totalPeriods[splitInds.leftIndex].pId,
                  s:   totalPeriods[splitInds.leftIndex].s,
                  f:   edges[ind]
                }, {
                  dId: totalPeriods[splitInds.leftIndex].dId,
                  pId: totalPeriods[splitInds.leftIndex].pId,
                  s: edges[ind],
                  f: totalPeriods[splitInds.leftIndex].f
                });
              }
            }

            return {
              dIds: dIds,
              pIds: pIds,
              totalPeriods: totalPeriods,
              /*activePeriods: activePeriods,*/
              edges: edges
            }
          });

        });

      });


  };

  User.prototype.getStacked = function () {
    var self = this;
    return self.getStartStopSec('stacked').then(function(startStopSec){
      var flowName = self.menuData.stackedTypes === 0 ? 'totalFlow' : 'activeFlow';
      return Promise.all([
        self._trackingDb[flowName].where("s").between(startStopSec.startSec, startStopSec.stopSec).toArray()
      ])
        .then(function (periods) {
          var ind, dIdInd, summary = {}, summaryTotal = {},
            dIdKeys,  dIds = {},
            totalPeriods = periods[0];
          totalPeriods.forEach(function(item) { dIds[item.dId] = {}; });

          dIdKeys = Object.keys(dIds);
          var dIdsPromises = dIdKeys.map( function(item) {
              return self._trackingDb.domains.get(Number(item)).then(function(res) { return res; }); });

          return Promise.all(dIdsPromises).then(function (dIdsArray) {

            var dayKey, near, segment, firstSegment, secondSegment, sec, startMoment, finishMoment,
              maxDayDuration = 0, edges = [], daysLengths = {};

            dIdInd = 0;
            dIdsArray.forEach(function(item) { item.serialNum = dIdInd++; dIds[item.dId] = item; });

            // -------------- building edges array ----------------
            startMoment  = moment(startStopSec.startSec, 'X').startOf('day');
            finishMoment = moment(totalPeriods[totalPeriods.length - 1].f, 'X').startOf('day');
            while (startMoment.isBefore(finishMoment)) {
              sec = startMoment.unix()
              edges.push(sec);
              summary[sec] = {};
              daysLengths[sec] = 0;
              startMoment.add(1, 'days');
            }

            // -------------- filling summary structure ----------------
            function calculateNearSplitters (segment) {
              var beforeStartSec, afterStartSec,
                day = new Date(segment.s * 1000);
              if (isNaN(day.getTime())) { throw new Error("new Date(" + date + ") generates invalid date"); }
              day.setHours(0, 0, 0 ,0);

              beforeStartSec = Math.ceil(day.getTime() / 1000);
              afterStartSec = beforeStartSec + 86400;
              return { beforeStartSec: beforeStartSec, afterStartSec: afterStartSec };
            }
            function addSegmentToSummaryAndDaysLengths(segment, near) {
              var duration = segment.f - segment.s;

              if (!summary[near.beforeStartSec]) { summary[near.beforeStartSec] = {}; }
              if (!summary[near.beforeStartSec][segment.dId]) {
                summary[near.beforeStartSec][segment.dId] = { dur: duration, dId: segment.dId };
              } else {
                summary[near.beforeStartSec][segment.dId].dur += duration;
              }

              if (!daysLengths[near.beforeStartSec]) {
                daysLengths[near.beforeStartSec] = duration;
              } else {
                daysLengths[near.beforeStartSec] += duration;
              }

              if (!summaryTotal[segment.dId]) {
                summaryTotal[segment.dId] = { dur: duration, dId: segment.dId };
              } else {
                summaryTotal[segment.dId].dur += duration;
              }

            }
            for (ind = 0; ind < totalPeriods.length; ind += 1) {
              segment = totalPeriods[ind];
              near = calculateNearSplitters(segment);
              if (totalPeriods[ind].f > near.afterStartSec) {
                firstSegment = {
                  dId: segment.dId,
                  pId: segment.pId,
                  s:   segment.s,
                  f:   near.afterStartSec
                };
                secondSegment = {
                  dId: segment.dId,
                  pId: segment.pId,
                  s:   near.afterStartSec,
                  f:   segment.f
                };
                addSegmentToSummaryAndDaysLengths(firstSegment, near);
                addSegmentToSummaryAndDaysLengths(secondSegment, near);
              } else {
                addSegmentToSummaryAndDaysLengths(segment, near);
              }
            };

            for (dayKey in daysLengths) {
              if (maxDayDuration < daysLengths[dayKey]) maxDayDuration = daysLengths[dayKey];
            }

            return {
              dIds: dIds,
              maxDayDuration: maxDayDuration,
              summary: summary,
              summaryTotal: summaryTotal,
              daysLengths: daysLengths
            }
          }).catch(function(err) {
            console.log(err);
          });

        });

      });


  };

  User.prototype.getStartStopSec = function (type) {
    var self = this;
    return new Promise(function(resolve) {
      var day, startSec, stopSec, distanceToWeekStart,
        dateType    = type === 'summary' ? 'summaryDate'    : (type === 'flow' ? 'flowDate'    : "stackedDate"),
        periodsType = type === 'summary' ? 'summaryPeriods' : (type === 'flow' ? 'flowPeriods' : "stackedPeriods"),
        date        = self.menuData[dateType],
        periods     = self.menuData[periodsType];

      day = moment(date, "YYYY-MM-DD").toDate();

      if (isNaN(day.getTime())) { throw new Error("new Date(" + date + ") generates invalid date"); }
      day.setMilliseconds(0);
      day.setSeconds(0);
      day.setMinutes(0);
      day.setHours(0);

      startSec = Math.ceil(day.getTime() / 1000);
      stopSec = startSec + 86400;
      // --- week ---
      if (periods === 1) {
        distanceToWeekStart = day.getDay() - self.configData.weekStart;
        if (distanceToWeekStart >= 0) {
          day.setDate(day.getDate() - distanceToWeekStart);
        } else {
          day.setDate(day.getDate() - (7 + distanceToWeekStart));
        }
        startSec = Math.ceil(day.getTime() / 1000);
        day.setDate(day.getDate() + 7);
        stopSec = Math.ceil(day.getTime() / 1000);
      }

      // --- month ---
      if (periods === 2) {
        day.setDate(1);
        startSec = Math.ceil(day.getTime() / 1000);
        day.setMonth(day.getMonth() + 1);
        stopSec = Math.ceil(day.getTime() / 1000);
      }
      return resolve({startSec: startSec, stopSec: stopSec});
    });

  };

  User.splitInd = function (flow, splitSecond, searchProp) {
    var currentVal, middleIndex,
      result = {};
    if (!flow || flow.length < 1) {
      return {message: "Can't calculate cutting index. Periods Array is empty."};
    }
    //debugger;
    result.leftIndex = -1;
    result.rightIndex = flow.length;
    while (result.leftIndex < result.rightIndex && result.rightIndex - result.leftIndex > 1) {
      middleIndex = Math.floor((result.leftIndex + result.rightIndex) / 2);
      currentVal = flow[middleIndex][searchProp];

      if (currentVal < splitSecond) {
        result.leftIndex = middleIndex;
      } else if (currentVal > splitSecond) {
        result.rightIndex = middleIndex;
      } else {
        result.leftIndex = middleIndex - 1;
        result.middleIndex = middleIndex;
        result.rightIndex = middleIndex + 1;
        return result;
      }
    }
    return result;
  };

  // User.getUserData = function (dStorage, userId) {
  //   var userData = {};
  //   return dStorage.usersDb.users.get(userId).then(function(uData) {
  //     userData.user = uData;
  //     return dStorage.usersDb.computers.where('uUUID').equals(uData.uUUID).toArray().then(function(computers) {
  //       userData.computers = computers;
  //       return userData;
  //     })
  //     ;
  //   })
  // };
  //
  // User.prototype.getActiveDays = function() {
  //   var self = this;
  //   self._activeDays = [];
  //   return self.dStorage.usersDb.totalFlow
  //     .where("[uId+cId]")
  //     .equals([self.uId, self.cId])
  //     .first().then(function(firstTick) {
  //       var startDay = new Date(firstTick.s * 1000);
  //       console.log(startDay);
  //     }).catch(function(err) {
  //       console.error(err);
  //     });
  //
  // };
  
  window.User = User;

}());


