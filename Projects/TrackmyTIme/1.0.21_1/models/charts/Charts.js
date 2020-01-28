/*global window, chrome, Promise, HTMLElement,
 moment, d3, $
 */

(function () {
  "use strict";

  /**
  * @class for building d3 charts for user
  * */
  var  Charts = function (userInit) {
    this.activeDays = userInit.activeDays;
    this.chartsData = userInit.user._state.chartsData;
    this.menuData   = userInit.user._state.menuData;
    this.user       = userInit.user;
  };

  Charts.init = function () {
    var chartsUserInit = events.subscribe('/user/init', function(userInit) {
      var charts = new Charts(userInit);
      charts.initInterface();
    });

    return Promise.resolve({message: "Charts listeners were init"});
  };

  Charts.prototype.initInterface = function () {
    this.initSummaryChart();
    this.initFlowChart();
    this.initStackedChart();
  };

  Charts.prototype.initSummaryChart = function () {
    var summaryChart = new SummaryChart(this);
    summaryChart.build();
  };

  Charts.prototype.initFlowChart = function () {
    var flowChart = new FlowChart(this);
    flowChart.build();
  };

  Charts.prototype.initStackedChart = function () {
    var stackedChart = new StackedChart(this);
    stackedChart.build();
  };

    window.Charts = Charts;

}());


