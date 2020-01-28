/*global document, chrome,
 PrettyJSON */
document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  events.subscribe('/user/init', function(initRes) {
    var user = initRes.user;

    user._trackingDb.domains.toArray().then(function (domains) {
      domains.sort(function (a, b) {
        return Number(a.dId) > Number(b.dId) ? 1 : -1;
      });
      document.getElementById('domains').innerHTML = "<ol><li>" +
        JSON.stringify(domains).split('},{').join('},</li><li>{') +
        "</li></ol>";
    });

    user._trackingDb.pages.toArray().then(function (pages) {
      pages.sort(function (a, b) {
        if (Number(a.dId) === Number(b.dId)) { return Number(a.pId) > Number(b.pId) ? 1 : -1; }
        return Number(a.dId) > Number(b.dId) ? 1 : -1;
      });
      document.getElementById('pages').innerHTML = "<ol><li>" +
        JSON.stringify(pages).split('},{').join('},</li><li>{') +
      "</li></ol>";
    });

    user._trackingDb.activeFlow.toArray().then(function (activeFlow) {
      document.getElementById('activeFlow').innerHTML = "<ol><li>" +
        JSON.stringify(activeFlow).split('},{').join('},</li><li>{') +
        "</li></ol>";
    });

    user._trackingDb.totalFlow.toArray().then(function (totalFlow) {
      document.getElementById('totalFlow').innerHTML = "<ol><li>" +
        JSON.stringify(totalFlow).split('},{').join('},</li><li>{') +
        "</li></ol>";
    });
  });

  User.init();


}, false);
