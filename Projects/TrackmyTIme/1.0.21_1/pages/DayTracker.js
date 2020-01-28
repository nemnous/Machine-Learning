/*global document, chrome, google, $  */
(function (DayTracker) {
  "use strict";

  DayTracker = function (date) {
    return date;
  };

  var LAST_HOUR_IN_DAY = 23,
    MAX_GAP = 30000, // time in ms to consider two consecutive site visits
    dayStart = new Date(2015, 3, 16, 0),
    dayFinish = new Date(2015, 3, 16, 24);


  function selectDay(visitsData, dayStart, dayFinish) {
    var ind, periodStart, periodFinish, visitsDay = [],
      startMoment = dayStart.getTime(),
      finishMoment = dayFinish.getTime();

    for (ind = 0; ind < visitsData.length; ind += 1) {
      // selecting big (day or several hours) period
      periodStart = parseInt(visitsData[ind][0], 10);
      periodFinish = parseInt(visitsData[ind][1], 10);

      if ((startMoment < periodStart && periodStart < finishMoment) ||
          (startMoment < periodFinish && periodFinish < finishMoment)) {
        visitsDay.push(visitsData[ind]);
      }
    }
    return visitsDay;
  }

  function urlToHostName(visitsDay) {
    var ind, urlParser = document.createElement('a'), hostNameDay = [];
    for (ind = 0; ind < visitsDay.length; ind += 1) {
      urlParser.href = visitsDay[ind][2];
      hostNameDay.push([visitsDay[ind][0], visitsDay[ind][1], urlParser.hostname]);
    }
    return hostNameDay;
  }

  function splitHoursEdges(visitsDay) {

    var ind, bottomSplit, topSplit, nextSplit, start, finish, visit,
      splittedPeriods = [];
    for (ind = 0; ind < visitsDay.length; ind += 1) {
      visit = visitsDay[ind];
      start = new Date(parseInt(visit[0], 10));
      finish = new Date(parseInt(visit[1], 10));

      if (start.getTime() < finish.getTime() &&
          start.getHours() !== finish.getHours()) {

        bottomSplit = new Date(start.getTime());
        bottomSplit.setHours(start.getHours() + 1);
        bottomSplit.setMinutes(0);
        bottomSplit.setSeconds(0);
        bottomSplit.setMilliseconds(0);

        topSplit = new Date(finish.getTime());
        topSplit.setHours(finish.getHours());
        topSplit.setMinutes(0);
        topSplit.setSeconds(0);
        topSplit.setMilliseconds(0);

        nextSplit = new Date(bottomSplit);
        nextSplit.setHours(bottomSplit.getHours() + 1);
        nextSplit.setMilliseconds(-1);

        splittedPeriods.push([start.getTime(), nextSplit.getTime(), visit[2]]);

        while (bottomSplit.getTime() < topSplit.getTime()) {
          nextSplit = new Date(bottomSplit);
          nextSplit.setHours(bottomSplit.getHours() + 1);
          nextSplit.setMilliseconds(-1);
          splittedPeriods.push([bottomSplit.getTime(), nextSplit.getTime(), visit[2]]);
          bottomSplit.setHours(bottomSplit.getHours() + 1);
        }

        splittedPeriods.push([topSplit.getTime(), finish.getTime(), visit[2]]);

      } else {
        splittedPeriods.push(visit);
      }
    }

    return splittedPeriods;

  }

  function trimDay(visitsDay, dayStart, dayFinish) {
    var ind, periodStart, periodFinish, visitsDayResult = [],
      startMoment = dayStart.getTime(),
      finishMoment = dayFinish.getTime();

    for (ind = 0; ind < visitsDay.length; ind += 1) {
      // selecting big (day or several hours) period
      periodStart = parseInt(visitsDay[ind][0], 10);
      periodFinish = parseInt(visitsDay[ind][1], 10);

      if ((startMoment < periodStart && periodStart < finishMoment) &&
          (startMoment < periodFinish && periodFinish < finishMoment)) {
        visitsDayResult.push(visitsDay[ind]);
      }
    }
    return visitsDayResult;
  }

  function concatenatePeriods(visitsDay, maximumGap) {
    //debugger;
    var ind, concatenatedPeriods = [];
    concatenatedPeriods.push(visitsDay[0].slice(0));
    for (ind = 1; ind < visitsDay.length; ind += 1) {
      if (visitsDay[ind][2] === visitsDay[ind - 1][2] && visitsDay[ind][0] - visitsDay[ind - 1][1] < maximumGap) {
        concatenatedPeriods[concatenatedPeriods.length - 1][1] = visitsDay[ind][1];
      } else {
        concatenatedPeriods.push(visitsDay[ind].slice(0));
      }
    }
    return concatenatedPeriods;
  }

  function prepareDayForChart(visitsDay) {
    var ind, currentHourValue, periodStart, periodFinish, chartData = [];
    for (ind = 0; ind < visitsDay.length; ind += 1) {
      currentHourValue = new Date(visitsDay[ind][0]).getHours();
      periodStart = new Date(visitsDay[ind][0]);
      periodStart.setUTCHours(0);
      periodStart.setUTCFullYear(1970, 0, 1);

      periodFinish = new Date(visitsDay[ind][1]);
      periodFinish.setUTCHours(0);
      periodFinish.setUTCFullYear(1970, 0, 1);

      chartData.push([
        currentHourValue,
        visitsDay[ind][2],
        periodStart.getTime(),
        periodFinish.getTime()
      ]);
    }
    return chartData;
  }

  DayTracker.prototype.preProcessingVisits = function (callback) {

    chrome.storage.local.get('visitsData', function (items) {
      var visitInd, visitsData, siteName, sitesData = {};

      visitsData = selectDay(items.visitsData, dayStart, dayFinish);
      if (visitsData.length === 0) {
        return callback([]);
      }
      visitsData = urlToHostName(visitsData);
      visitsData = concatenatePeriods(visitsData, MAX_GAP);
      visitsData = splitHoursEdges(visitsData);
      visitsData = trimDay(visitsData, dayStart, dayFinish);
      //console.log(visitsData);
      visitsData = prepareDayForChart(visitsData);

      for (visitInd = 0; visitInd < visitsData.length; visitInd += 1) {
        siteName = visitsData[visitInd][1];
        if (!sitesData[siteName]) {
          sitesData[siteName] = {
            visits: []
          };
        }
        sitesData[siteName].push(visitsData[visitInd]);

      }

      document.getElementById("filteredData").innerHTML = JSON.stringify(visitsData, " ", 2);
      callback(null, {visitsData: visitsData, sitesData: sitesData});
    });
  }

//
//  function drawChart(filteredData) {
//    console.log(filteredData);
//    var container = document.getElementById('timeline'),
//      chart = new google.visualization.Timeline(container),
//      dataTable = new google.visualization.DataTable();
//
//    google.visualization.events.addListener(chart, 'select', function (err) {
//      console.log(err);
//    });
//
//    dataTable.addColumn({ type: 'string', id: 'Position' });
//    dataTable.addColumn({ type: 'string', id: 'President' });
//    dataTable.addColumn({ type: 'date', id: 'Start' });
//    dataTable.addColumn({ type: 'date', id: 'End' });
//    dataTable.addRows(filteredData);
//    debugger;
//    chart.draw(dataTable);
//
//  }



  //preProcessingVisits();
//  google.setOnLoadCallback(makeChart);
  /*  chrome.storage.local.get(['lastVisitedUrl', 'visitsData'], function (items) {
   document.getElementById("lastVisitedUrl").innerHTML = items.lastVisitedUrl;
   document.getElementById("visitsData").innerHTML = JSON.stringify(items.visitsData, " ", 2);
   });*/
  window.DayTracker = DayTracker;
}());

