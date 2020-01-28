/*global document, chrome,
 PrettyJSON */
document.addEventListener("DOMContentLoaded", function () {
  "use strict";

//  var background = chrome.extension.getBackgroundPage();
//
//  background.tyw.dStorage.getSummary('day', '2016-05-01')
//    .then(function (res) { console.log(res); })
//    .catch(function (err) {  console.log(err);  });

  DStorage.init().then(function (dStorage) {
    dStorage.getSummary('2016-05-01', 'day')
      .then(function (res) { console.log(res);
        document.getElementById("daySummary").innerHTML =  JSON.stringify(res).split('},"').join('},\n"'); })
      .catch(function (err) {  console.log(err);  });

    dStorage.getSummary('2016-05-01', 'week')
      .then(function (res) { console.log(res);
        document.getElementById("weekSummary").innerHTML =  JSON.stringify(res).split('},"').join('},\n"'); })
      .catch(function (err) {  console.log(err);  });
  });



}, false);
