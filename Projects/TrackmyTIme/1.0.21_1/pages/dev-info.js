/*global document, chrome,
 StoreKeeper   */
document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var totalSize = 0;

  // ---------------------- All Flow ---------------------
  chrome.storage.local.getBytesInUse("default_flow", function (size) {
    totalSize += size;
    document.getElementById("flowSize").innerHTML = Math.round(size / 1.024) / 1000;
  });

  chrome.storage.local.get("default_flow", function (res) {
    document.getElementById("flowElemNum").innerHTML = res.default_flow.length;
  });

  // ---------------------- idUrl Library ---------------------
  chrome.storage.local.getBytesInUse("default_idUrl", function (size) {
    totalSize += size;
    document.getElementById("idUrlLibSize").innerHTML = Math.round(size / 1.024) / 1000;
  });

  chrome.storage.local.get("default_idUrl", function (res) {
    document.getElementById("idUrlLibElemNum").innerHTML = Object.keys(res.default_idUrl).length;
  });

  // ---------------------- idUrl Library ---------------------
  chrome.storage.local.getBytesInUse("default_urlId", function (size) {
    totalSize += size;
    document.getElementById("urlIdLibSize").innerHTML = Math.round(size / 1.024) / 1000;
    document.getElementById("totalSize").innerHTML = Math.round(totalSize / 1.024) / 1000;
    document.getElementById("totalSizeMb").innerHTML = Math.round(totalSize / (1.024 * 1024)) / 1000;
  });

  chrome.storage.local.get("default_urlId", function (res) {
    document.getElementById("urlIdLibElemNum").innerHTML = Object.keys(res.default_urlId).length;
  });

// ---------------------- day List ---------------------
  StoreKeeper.init('default')
    .then(function (storeKeeper) {
      return storeKeeper.getActiveDays().then(function (days) {
        document.getElementById("dayList").innerHTML = days.map(function (item) {
          return '<li>' + item + '</li>';
        }).join('');
      });
    })
    .catch(function (err) { console.log(err); });

}, false);
