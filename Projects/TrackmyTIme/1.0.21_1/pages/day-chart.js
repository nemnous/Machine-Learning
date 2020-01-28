/*global Charts, $, moment*/

$(function () {
  "use strict";

  var buildChartsLayout, userName = 'default';
  buildChartsLayout = function () {

  };


  var renderDayChart, calendar, calendarBtn, sortByMenu, storeKeeper, sortTooltip, showTotal,
    curDate = moment();

  renderDayChart = function () {
    //var daySeed = calendar.datepicker('getDate') || moment().format('DD MMM YYYY');
    return storeKeeper.getDaySummary(moment().toDate())
      .then(function (daySummary) {

        var element = document.getElementById('daySummary'),
          summaryData = daySummary,
          sortInd = sortByMenu.val(),
          showInactive;
        Charts.daySummary(element, summaryData, sortInd, showInactive);
      })
      .catch(function (err) { console.log(err); });
  };



  calendarBtn = $("#calendarBtn").button({
    //icons: { primary: "ui-icon-calendar" },
    label: moment().format('DD MMM YYYY')
  }).click(function (event) {
    event.preventDefault();
    calendar.datepicker('show');
  });

  sortByMenu = $("#sortByMenu").selectmenu({
    select: function (event, ui) {
      renderDayChart();
      sortTooltip.tooltip("disable");
    }
  });

  showTotal = $("#check").button();

  $(document).tooltip();
  sortTooltip = $("#sortByMenu-button").tooltip({items: "span", content: 'Sort Summary by'});


  StoreKeeper.init('default').then(function (stKeeper) {
    storeKeeper = stKeeper;
    return storeKeeper.getActiveDays().then(function (dayList) {

      calendar.datepicker("option", "beforeShowDay", function unavailable(date) {
        var dmy = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + ('0' + date.getDate()).slice(-2);
        if ($.inArray(dmy, dayList) === -1) { return [false, "", "No tracked time"]; }
        return [true, ""];
      });
      return storeKeeper;

    }).then(function () {
      renderDayChart();
    });
  }).catch(function (err) { console.log(err); });

  $("#tabs").tabs({heightStyle: "fill"});

  function resizeUi() {
    var h = $(window).height();
    var w = $(window).width();
    $("#tabs").css('height', h-95 );
    $(".ui-tabs-panel").css('height', h-140 );
  };

  var resizeTimer = null;
  $(window).bind('resize', function() {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeUi, 100);
  });
  resizeUi();

}, false);
