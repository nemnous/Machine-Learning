/*global window, chrome, Promise, HTMLElement,
 moment, d3, $,
 Chart
 */

(function () {
  "use strict";

  /**
  * @class for building d3 StackedChart for user
  * */

  var StackedChart = function (charts) {
    Chart.apply(this, arguments);

    this.flowData       = charts.chartsData.flow;
    this.gettingDataMethod = this.user.getStacked.bind(this.user);

    this.contentElement    = document.getElementById('stacked-content');
    var self = this,
      stackedChartUpdate = events.subscribe('/menu/stacked/updating', function() {
        self.build();
      });
  };

  StackedChart.prototype = Object.create(Chart.prototype);
  StackedChart.prototype.constructor = StackedChart;

  StackedChart.prototype.draw = function (chartData) {
    var self = this;
    var stackedChart = document.getElementById('stacked-chart');

    return new Promise(function (resolve) {

      function drawChartStructure() {
        if (stackedChart) stackedChart.parentNode.removeChild(stackedChart);

        var chartTemplate = '' +
          '<div id="stacked-chart">' +
          // '  <div class="time"></div>' +
          '  <div class="chart">' +
          '    <div class="head">' +
          '      <div class="title"></div>' +
          '    </div>' +
          '    <div class="body"></div>' +
          '  </div>' +
          '</div>';
        var e = document.createElement('span');
        e.innerHTML = chartTemplate;
        self.contentElement.appendChild(e.firstChild);
      }
      function drawChartContent() {
        var periodKey, periodBlock,
          domainKey, domainsObj, domain, domainBlock, domainsArr,
          domainColor, domainDuration,
          hPercent, shift,
          periodsObj = chartData.summary, periodsArr = [],
          favIco = "",
          onePercentDomainsHeightInPix = ($('#stacked-chart .body').height()) / 100; // (100[%]/3600[sec]);

        for (periodKey in periodsObj) {
          domainsObj = periodsObj[periodKey];
          domainsArr = [];
          shift = 0;
          for (domainKey in domainsObj) {
            favIco = "";
            domain = domainsObj[domainKey];
            hPercent = 100 * domain.dur / chartData.maxDayDuration;
            domainColor = Chart.colors[domain.dId % Chart.colors.length];
            if (chartData.dIds[domain.dId].faviconPath && hPercent * onePercentDomainsHeightInPix > 24) {
              favIco = '<img class="favicon" src="'
                + chartData.dIds[domain.dId].faviconPath + '" type="image/png"/>';
            }
            var hours = moment.duration(domain.dur, 'seconds').hours()
                      ? moment.duration(domain.dur, 'seconds').hours() === 1
                      ? moment.duration(domain.dur, 'seconds').hours() + " hour "
                      : moment.duration(domain.dur, 'seconds').hours() + " hours "
                      : "";
            var minutes = moment.duration(domain.dur, 'seconds').minutes()
                      ? moment.duration(domain.dur, 'seconds').minutes() === 1
                      ? moment.duration(domain.dur, 'seconds').minutes() + " minute"
                      : moment.duration(domain.dur, 'seconds').minutes() + " minutes"
                      : "";
            if (hours === "" && minutes === "") { minutes = "Less than a minute"; }
            domainDuration = [ "(", hours,  minutes, ")" ].join('');
            domainBlock = [
              '<div' +
              ' class="domain"' +
              ' title="', chartData.dIds[domain.dId].d, ' ', domainDuration, '"' +
              ' style="height:', hPercent, '%;' +
              'top:', shift, '%;',
              'background-color:', domainColor, '"',
              '>', favIco, '</div>'
            ].join('');
            shift += hPercent;

            domainsArr.push(domainBlock);
          }
          var totalMarginTop = "";
          // if (shift * onePercentDomainsHeightInPix > 15) { totalMarginTop = "margin-top: -13px;"}
          domainsArr.push([
            '<div ' +
                 'class="total" style="top:', shift, '%;', totalMarginTop, '" ' +
                 'title="', moment.duration(chartData.daysLengths[periodKey], 'seconds').hours(), ' hours ',
                            moment.duration(chartData.daysLengths[periodKey], 'seconds').minutes(), ' minutes">',
              Math.round(moment.duration(chartData.daysLengths[periodKey], 'seconds').asHours() * 10) / 10,  "h",
                /*      moment.duration(chartData.daysLengths[periodKey], 'seconds').minutes(),*/
            '</div>'
          ].join(''));

          periodBlock = [
            '<div class="period">',
            ' <div class="label">', moment(periodKey, 'X').format('DD ddd'), '</div>',
            ' <div class="domains">', domainsArr.join(''), '</div>',
            '</div>',
          ].join('');
          periodsArr.push(periodBlock)
        }
        $('#stacked-chart .body').html('<div class="periods"><div class="totals"></div>' + periodsArr.join('') + '</div>');
      }
      function drawGraduation () {
        var maxHours = moment.duration(chartData.maxDayDuration, 'seconds').asHours();

      }
      drawChartStructure();
      drawChartContent();
      // drawGraduation();
      Chart.renderChartTitle(
        self.menuData.stackedPeriods,
        self.menuData.stackedDate,
        self.user._state.configData.weekStart,
        $('#stacked-chart .title')
      );

      self.removeSpinner();
      resolve('ok');

      // self.contentElement.innerHTML = JSON.stringify(chartData, null, 4);
    });

  };

  window.StackedChart = StackedChart;

}());


