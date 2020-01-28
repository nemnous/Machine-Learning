/*global window, chrome, Promise, HTMLElement,
 moment, d3, $,
 Chart
 */

(function () {
  "use strict";

  /**
  * @class for building d3 FlowChart for user
  * */

  var FlowChart = function (charts) {
    Chart.apply(this, arguments);

    this.flowData          = charts.chartsData.flow;
    this.gettingDataMethod = this.user.getFlow.bind(this.user);
    this.contentElement    = document.getElementById('flow-content');
    this.chartElement      = document.getElementById('flow-chart');

    var self = this,
      flowChartUpdate = events.subscribe('/menu/flow/updating', function() {
        self.build();
      });

  };

  FlowChart.prototype = Object.create(Chart.prototype);
  FlowChart.prototype.constructor = FlowChart;


  FlowChart.prototype.draw = function (flowsData) {
    var self = this;
    return new Promise(function (resolve) {
      var d3Labels, d3Bars, d3Periods;

      function drawChartStructure() {
        var flowChart = document.getElementById('flow-chart');
        if (flowChart) flowChart.parentNode.removeChild(flowChart);

        var chartTemplate = '' +
          '<div id="flow-chart">' +
          '  <div class="head">' +
          '    <div class="time"> Time </div>' +
          '    <div class="title">' +
          '      <div class="period-title"></div>' +
          '      <div class="quarter-label first">15m</div>' +
          '      <div class="quarter-label second">30m</div>' +
          '      <div class="quarter-label third">45m</div>' +
          '    </div>' +
          '    <div style="flex-basis: 19px; flex-shrink: 1"></div>' +
          '  </div>' +
          '  <div class="body">' +
          '    <div class="labels"></div>' +
          '    <div class="bars">' +
          '      <div class="graduation first"></div>' +
          '      <div class="graduation second"></div>' +
          '      <div class="graduation third"></div>' +
          '    </div>' +
          '  </div>' +
          '</div>';
        var e = document.createElement('span');
        e.innerHTML = chartTemplate;
        self.contentElement.appendChild(e.firstChild);
      }
      function drawChartContent() {
        // d3Labels, d3Bars,

        var onePercentWidthPix = $('.bars').width() / 100,
          drawHtml = function(item, ind) {
            var favIco = "",
              width = (item.f - item.s) / 36; // (100[%]/3600[sec]);
            if (flowsData.dIds[item.dId].faviconPath && width * onePercentWidthPix > 24) {
              favIco = '<img class="favicon" src="'
                + flowsData.dIds[item.dId].faviconPath +'"/>';
            }
            return favIco;

          },
          drawClass = function(item, ind) {
            var className = 'period';
            if (item.bordered) className = 'period bordered'
            return className;
          },
          drawMouseOverOutClass = function(item, ind) {
            var className = 'period';
            if (flowsData.dIds[item.dId].bordered) className = 'period bordered'
            return className;
          },
          drawStyle = function(item, ind) {
            var top = (moment(item.s, 'X').startOf('hour').unix() - flowsData.edges[0]) / 120 + 5, // (30[px]/3600[sec])
              left = (item.s - moment(item.s, 'X').startOf('hour').unix()) / 36 , // (100[%]/3600[sec])
              width = (item.f - item.s) / 36,  // (100[%]/3600[sec])
              bgColor = Chart.colors[item.dId % Chart.colors.length] ;
            // bgColor = Chart.colors[flowsData.dIds[item.dId].serialNum % Chart.colors.length] ;
            return "top:" + top + "px;left:" + left + "%;width:" + width + "%;background-color:" + bgColor;
          },
          drawTitle = function(item, ind) {
            var seconds = item.f - item.s,
              duration = [
                '(',
                seconds >  59 ? Math.round(moment.duration(seconds, 'seconds').minutes()) + 'm' : '',
                seconds >  59 && seconds < 119 ? ' ' : '',
                seconds < 119 ? Math.round(moment.duration(seconds, 'seconds').seconds()) + 's' : '',
                ')'
              ].join('');

            var title = [
              moment(item.s, 'X').format('HH:mm'),
              duration,
              flowsData.dIds[item.dId].d,
              flowsData.pIds[item.pId].title || flowsData.pIds[item.pId].p
            ].join(' ');
            return  title;
          };

        d3Labels = d3.select(self.contentElement).select('div.labels').selectAll('div.label').data(
          flowsData.edges, function (item) { return item; });
        d3Labels.exit().remove();
        d3Labels.enter().append('div').attr('class', 'label').html(function(item, ind){
          return moment(item, 'X').format('HH:mm'); });
        d3Labels.attr('class', 'label').html(function(item, ind){
            return moment(item, 'X').format('HH:mm'); });

        d3Bars = d3.select(self.contentElement).select('div.bars').selectAll('div.bar').data(
          flowsData.edges, function (item) { return item; });
        d3Bars.exit().remove();
        d3Bars.enter().append('div').attr('class', 'bar');
        d3Bars.attr('class', 'bar');

        d3Periods = d3.select(self.contentElement).select('div.bars').selectAll('div.period').data(
          flowsData.totalPeriods, function (item) { return item.s; });
        d3Periods.exit().remove();

        d3Periods.enter().append('div')
          .attr('style', drawStyle)
          .attr('title', drawTitle)
          .attr('class', drawClass)
          .html(drawHtml);


        d3Periods
          .attr('style', drawStyle)
          .attr('title', drawTitle)
          .attr('class', drawClass)
          .html(drawHtml);

        d3Periods
          .on('mouseover', function(item, ind) {
            flowsData.dIds[item.dId].bordered = true;
            d3Periods
              .attr('class', drawMouseOverOutClass);
          })
          .on('mouseout', function(item, ind) {
            delete flowsData.dIds[item.dId].bordered;
            d3Periods
              .attr('class', drawMouseOverOutClass);
            // debugger;
          })
          .on('click', function(item, ind) {
            window.open(flowsData.dIds[item.dId].d + flowsData.pIds[item.pId].p, '_blank');
          });
      }

      drawChartStructure();

      Chart.renderChartTitle(
        self.menuData.flowPeriods,
        self.menuData.flowDate,
        self.user._state.configData.weekStart,
        $('#flow-chart .period-title')
      );
      if (!flowsData || !flowsData.dIds ) {

        $(self.contentElement).find('div.bars')
          .html( "<p>There is no Flow Data. Try to reopen extension or chose another day in calendar.</p>") ;
        self.removeSpinner();
        resolve('ok');
        return ; }
      drawChartContent();
      self.removeSpinner();
      resolve('ok');
    });

  }

    window.FlowChart = FlowChart;

}());


