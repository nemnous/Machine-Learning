/*global window, chrome, Promise, HTMLElement,
 moment, d3, $,
 Chart
 */

(function () {
  "use strict";

  /**
   * @class for building d3 SummaryChart for user
   * */

  var SummaryChart = function (charts) {
    Chart.apply(this, arguments);
    var self = this;
    this.summaryData         = charts.chartsData.summary;
    this.gettingDataMethod   = this.user.getSummary.bind(this.user);
    this.contentElement      = document.getElementById('summary-content');
    this._activeColumnWidth  = 100;
    this._percentColumnWidth = 45;

    var summaryChartUpdate = events.subscribe('/menu/summary/updating', function() {
      self.showSpinner();
      self.build();
    });
  };

  SummaryChart.prototype = Object.create(Chart.prototype);
  SummaryChart.prototype.constructor = SummaryChart;

  SummaryChart._stringifyPercent = function (second, maxVal) {
    if (maxVal === 0) return '0.00';
    var strVal = String(Math.round(10000 * second / maxVal) / 100),
      pointInd = strVal.indexOf('.');
    if (strVal.indexOf('.') === -1) { return strVal + '.00'; }
    strVal = strVal + '0';
    strVal = strVal.slice(0, pointInd + 3);
    return strVal;

  };

  SummaryChart._stringifyDuration = function (second) {
    var strVal,
      duration = moment.duration(second, 'second'),
      d = Math.floor(duration.asDays()),
      h = duration.hours(),
      m = duration.minutes(),
      s = duration.seconds(),
      sD = '<span class="day-font">' + d + 'd</span> ',
      sH = ('0' + h).slice(-2) + 'h ',
      sM = ('0' + m).slice(-2) + 'm',
      sS = '<span class="second-font "> ' + ('0' + s).slice(-2) + 's</span>';

    if (d) {
      if (m > 30) {
        h += 1;
        sH = ('0' + h).slice(-2) + 'h ';
      }
      strVal = sD + sH;
    } else {
      if (h) {
        strVal = sH + sM;
      }
      else if (m) {
        strVal = sM + sS;
      }
      else {
        strVal = sS;
      }
    }

    return strVal;

  };

  SummaryChart.prototype.renderSummary = function () {
    var self = this;
    return Promise.all([
      self.dStorage.getActiveDays(),
      self.storeKeeper.getState(),
      self.storeKeeper.getSummary(self.exploredDate, self.period)
    ])
      .then(function (res) {
        self.activeDays = res[0];
        self.state = res[1];
        self.data = res[2];
        return self.drawSummaryChart();
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  SummaryChart.prototype.build = function () {
    var self = this;
    if (self.showSpinner) self.showSpinner();
    function drawTableStructure() {
      var summaryChart = document.getElementById('summary-chart');
      if (summaryChart) summaryChart.parentNode.removeChild(summaryChart);

      var summaryTableTemplate = '' +
        '<div id="summary-chart">' +
        '  <div class="head">' +
        // HEAD FIRST LINE
        '    <div class="line">' +
        '      <div class="period center">' +
        '        <span class="period-title" data-content="period-title"></span>' +
        '        <span class="type-title" data-content="type-title"></span>' +
        '        <span class="sort-btn" data-order="url" title="Sort By Site">' +
        '          <i class="fa fa-sort-alpha-asc"></i>' +
        '        </span>' +
        '      </div>' +
        '      <div class="observation views">' +
        '        <span data-order="pages" title="Number of Pages">' +
        '          <i class="fa fa-file-text-o"></i>' +
        '        </span>' +
        '      </div>' +
        // '      <div class="observation views">' +
        // '        <span data-order="views" title="Number of Views">' +
        // '          <i class="fa fa-eye"></i>' +
        // '        </span>' +
        // '      </div>' +
        '      <div class="observation t">' +
        '        Total' +
        '        <span class="sort-btn" data-order="total" title="Sort By Total">' +
        '          <i class="fa fa-sort-amount-desc"></i>' +
        '        </span>' +
        '      </div>' +
        '      <div class="observation s scroll-basis">' +
        '        Active' +
        '        <span class="sort-btn" data-order="active" title="Sort By Active">' +
        '          <i class="fa fa-sort-amount-desc"></i>' +
        '        </span>' +
        '      </div>' +
        '    </div>' +

        // HEAD second LINE
        '    <div class="line">' +
        '      <div class="period flags">' +
        '        <div class="flagstaff total hidden"></div>' +
        '        <div class="flagstaff active hidden" style="top: 13px"></div>' +
        '        <div id="total-time-flag" class="hidden">0</div>' +
        '        <div id="active-time-flag" class="hidden">0</div>' +
        '      </div>' +
        '      <div class="observation views">' +
        '        <span class="sort-btn" data-order="pages" title="Sort By Pages">' +
        '          <i class="fa fa-sort-amount-desc"></i>' +
        '        </span>' +
        '      </div>' +
        // '      <div class="observation views">' +
        // '        <span class="sort-btn" data-order="views" title="Sort By Views">' +
        // '          <i class="fa fa-sort-amount-desc"></i>' +
        // '        </span>' +
        // '      </div>' +
        '      <div class="time">Time</div>' +
        '      <div class="pcnt">%</div>' +
        '      <div class="time">Time</div>' +
        '      <div class="pcnt scroll-basis">%</div>' +
        '    </div>' +
        '  </div>' +
        '  <div class="body">' +
        '    <div class="flagstaff total hidden"></div>' +
        '    <div class="flagstaff active hidden"></div>' +
        '    <div class="flagstaff max-active hidden"></div>' +
        '    <div id="max-active-flag" class="hidden"></div>' +
        '  </div>' +
        '</div>';
      var e = document.createElement('span');
      e.innerHTML = summaryTableTemplate;
      self.contentElement.appendChild(e.firstChild);
    }

    drawTableStructure();
    var body = self.contentElement.getElementsByClassName('body');
    var bodyScrollWidth = body[0].offsetWidth - body[0].clientWidth;
    $('.observation.scroll-basis').css('flex-basis', (self._activeColumnWidth + bodyScrollWidth) + 'px');
    $('.pcnt.scroll-basis').css('flex-basis', (self._percentColumnWidth + bodyScrollWidth) + 'px');

    Chart.renderChartTitle(
      self.menuData.summaryPeriods,
      self.menuData.summaryDate,
      self.user._state.configData.weekStart,
      $('#summary-chart .period-title')
    );

    this.gettingDataMethod().then(function (chartData) {
      self.draw(chartData);
    });
  };

  SummaryChart.prototype.draw = function (summary) {
    var self = this;

    return new Promise(function (resolve) {

      var d3Body, totalLineShift, activeLineShift,
        tableData = summary.data,
        maxTotal = summary.total.t,
        maxBar = summary.maxT;

      function drawTableContent() {

        d3Body = d3.select(self.contentElement).select('div.body')
          .selectAll('div.line').data(tableData, function (item) {
            var key = item.d + (item.p ? item.p : "");
            return key;
          });

        d3Body.exit().remove();
        totalLineShift = 0;
        activeLineShift = 0;

        d3Body
          .enter()
          .append('div')
          .attr('class', defineLineClass)
          .sort(d3Comparator(self.summaryData.order))
          .html(drawPageSummaryLine);

        totalLineShift = 0;
        activeLineShift = 0;
        d3Body
          .attr('class', defineLineClass)
          .sort(d3Comparator(self.summaryData.order))
          .html(drawPageSummaryLine);

        d3Body.on('click', function (item, ind) {
          var coords = d3.mouse(this);
          var event = d3.event;
          var ind;
          if (item.pNum) {
            self.showSpinner();

            if (!item.unfolded) {
              for (ind = 0; ind < summary.data.length; ind += 1) {
                if (item.d === summary.data[ind].d && summary.data[ind].p) {
                  summary.data[ind].display = "block";
                }
              }
              item.unfolded = true;
            } else {
              for (ind = 0; ind < summary.data.length; ind += 1) {
                if (item.d === summary.data[ind].d && summary.data[ind].p) {
                  summary.data[ind].display = "none";
                }
              }
              item.unfolded = false;
            }
            totalLineShift = 0;
            activeLineShift = 0;

            d3Body
              .attr('class', defineLineClass)
              .sort(d3Comparator(self.summaryData.order))
              .html(drawPageSummaryLine);

            self.removeSpinner();
          }
        });

      }

      function defineLineClass(item, ind) {

        var className = 'line';
        if (item.pNum) { className += " domain"; } else { className += " page"; };
        if (item.display === "none") { className += " hidden"; }
        return className;
      }

      function drawPageSummaryLine(item, ind) {

        var url, aBar, tBar, uBar, aPercent, tPercent, aDuration, tDuration, checkOpened,
          pages = '', views = '', favIcon = '',
          pageDiv = this,
          wrapUrlProtocol = function (url) {
            var urlParts = url.split('://');
            if (urlParts[1].substr(0, 4) === 'www.') {
              urlParts[0] = '<span class="grey">' + urlParts[0] + '://www.</span>';
              urlParts[1] = urlParts[1].substr(4);
            } else {
              urlParts[0] = '<span class="grey">' + urlParts[0] + '://</span>';
            }
            return urlParts.join('');
          },
          createPageLink = function (item) {
            return '<a href="' + item.d + item.p + '" target="_blank">' + (item.title || item.p) + '</a>';
          };


        if (item.d === "inAll") {
          pages     = ' <div class="duration views">' +  item.pN + '</div>';
          // views     = ' <div class="duration views">' +  item.vN + '</div>';
          tPercent  = ' <div class="duration pcnt">' +  SummaryChart._stringifyPercent(item.t, maxTotal) + '</div>';
          aPercent  = ' <div class="duration pcnt">' +  SummaryChart._stringifyPercent(item.a, maxTotal) + '</div>';
          tDuration = ' <div class="duration time">' +  SummaryChart._stringifyDuration(item.t) + '</div>';
          aDuration = ' <div class="duration time">' +  SummaryChart._stringifyDuration(item.a) + '</div>';
          uBar = '<div class="bar u" style="margin-left: 12px">In All (' +  item.dN + ' domains)</div>';
          url =  '<div class="url">' + uBar + '</div>';
        } else if (item.p) { // page line
          tBar = ' <div class="bar t" style="width:' + SummaryChart._stringifyPercent(item.pT, maxBar)  + '%"></div>';
          tBar = '';
          aBar = ' <div class="bar a" style="width:' + SummaryChart._stringifyPercent(item.pA, maxBar) + '%"></div>';
          aBar = '';
          checkOpened = '<div class="check-opened" style=""></div>';
          uBar = '<div class="bar u" style="padding-left: 4px">' + createPageLink(item) + '</div>';
          url = checkOpened + '<div class="url ">' + tBar + aBar + uBar + '</div>';
          // views     = ' <div class="duration views">' +  item.pVN + '</div>';
          tPercent  = ' <div class="duration pcnt">' +  SummaryChart._stringifyPercent(item.pT, item.t) + '</div>';
          aPercent  = ' <div class="duration pcnt">' +  SummaryChart._stringifyPercent(item.pA, item.a) + '</div>';
          tDuration = ' <div class="duration time">' +  SummaryChart._stringifyDuration(item.pT) + '</div>';
          aDuration = ' <div class="duration time">' +  SummaryChart._stringifyDuration(item.pA) + '</div>';
        } else { // domain line

          tBar = ' <div ' +
            'class="bar t" ' +
            'style="width:' + SummaryChart._stringifyPercent(item.t, maxTotal) + '%;' +
            '       left: ' + totalLineShift + '%"></div>';

          aBar = ' <div ' +
            'class="bar a" ' +
            'style="width:' + SummaryChart._stringifyPercent(item.a, maxTotal) + '%;' +
            '       left: ' + activeLineShift + '%"></div>';

          activeLineShift += Number(SummaryChart._stringifyPercent(item.a, maxTotal));
          totalLineShift += Number(SummaryChart._stringifyPercent(item.t, maxTotal));

          if (item.unfolded) {
            checkOpened = '<div class="check-opened" style=""><i class="fa fa-caret-down" aria-hidden="true"></i></div>';
          } else {
            checkOpened = '<div class="check-opened" style=""><i class="fa fa-caret-right" aria-hidden="true"></i></div>';
          }

          if (item.fIcon) {
            favIcon = '<img class="favicon" src="' + item.fIcon + '" alt="image/png"/>';
          }
          uBar = '<div class="bar u" style="padding-left: 4px">' + favIcon + wrapUrlProtocol(item.d) + '</div>';
          url = checkOpened + '<div class="url domain">' + tBar + aBar + uBar + '</div>';
          pages = ' <div class="duration views">' + item.pN + '</div>';
          // views     = ' <div class="duration views">' +  item.vN + '</div>';

          tPercent = ' <div class="duration pcnt">' + SummaryChart._stringifyPercent(item.t, maxTotal) + '</div>';
          aPercent = ' <div class="duration pcnt">' + SummaryChart._stringifyPercent(item.a, maxTotal) + '</div>';
          tDuration = ' <div class="duration time">' + SummaryChart._stringifyDuration(item.t) + '</div>';
          aDuration = ' <div class="duration time">' + SummaryChart._stringifyDuration(item.a) + '</div>';
        }

        return url + pages + views + tDuration + tPercent + aDuration + aPercent;
      }

      function d3Comparator(property) {

        var decoderDomain = {"total": "t", "active": "a", "url": "d", "pages": "pN", "views": "vN"},
          decoderPage = {"total": "pT", "active": "pA", "url": "title", "pages": "pPN", "views": "pVN"},
          decodedDomainProperty = decoderDomain[property],
          decodedPageProperty = decoderPage[property];

        if (property !== 'url') {
          return function (a, b) {

            if (a.d !== b.d) {
              if (a[decodedDomainProperty] > b[decodedDomainProperty]) { return -1; }
              if (a[decodedDomainProperty] < b[decodedDomainProperty]) { return 1; }
              if (a.d > b.d) { return  1; }
              if (a.d < b.d) { return -1; }
            }
            else {
              if (a[decodedPageProperty] > b[decodedPageProperty]) { return -1; }
              if (a[decodedPageProperty] < b[decodedPageProperty]) { return 1; }
              if (a.pNum && b.pNum) {
                if (a.p > b.p) { return  1; }
                if (a.p < b.p) { return -1; }
              }
              if (a.pNum) { return  -1; }
              if (b.pNum) { return  1; }
              if (a.p > b.p) { return  1; }
              if (a.p < b.p) { return -1; }
            }
            return 0;
          };
        }

        return function (a, b) {
          var _a, _b;

          _a = a[decodedDomainProperty];
          _b = b[decodedDomainProperty];
          if (_a === 'inAll') { return -1; }
          if (_b === 'inAll') { return 1; }

          if (a.d !== b.d) {

            _a = _a.split('://')[1];
            _b = _b.split('://')[1];

            if (_a && _a.substr(0, 4) === 'www.') { _a = _a.substr(4); }
            if (_b && _b.substr(0, 4) === 'www.') { _b = _b.substr(4); }
            // if (!_a) { _a = ''; }
            // if (!_b) { _b = ''; }

            if (_a > _b) { return 1; }
            if (_a < _b) { return -1; }

            if (a[decodedDomainProperty] > b[decodedDomainProperty]) { return 1; }
            if (a[decodedDomainProperty] < b[decodedDomainProperty]) { return -1; }
          } else {
            if (a[decodedPageProperty] > b[decodedPageProperty]) { return 1; }
            if (a[decodedPageProperty] < b[decodedPageProperty]) { return -1; }
            if (a.pNum) { return  -1; }
            if (b.pNum) { return  1; }
          }
          return 0;
        };
      }

      function addHandlers() {
        $(self.contentElement).find('.sort-btn').click(function (evt) {
          var sortBtn = this;
          self.summaryData.order = sortBtn.dataset.order;

          $(self.contentElement).find('.sort-btn').removeClass('active');
          $(sortBtn).addClass('active');
          drawTableContent();

          self.user.setState();
        });
      }

      function fixChartInterface() {
        var body = self.contentElement.getElementsByClassName('body');
        var bodyScrollWidth = body[0].offsetWidth - body[0].clientWidth;
        $('.observation.scroll-basis').css('flex-basis', (self._activeColumnWidth + bodyScrollWidth) + 'px');
        $('.pcnt.scroll-basis').css('flex-basis', (self._percentColumnWidth + bodyScrollWidth) + 'px');

        $('.sort-btn').each(function (ind, currClass) {
          if (self.summaryData.order === this.dataset.order) {
            $(this).addClass('active');
          }
        });
      }

      // drawTableStructure();
      fixChartInterface();
      drawTableContent();
      addHandlers();
      self.user.setState()
      self.removeSpinner();
      self.activateFlags(summary);
      resolve('ok');
    });

  };

  SummaryChart.prototype.activateFlags = function (summary) {

    var self = this,
      drawFlags = function (totalFlagShiftPcnt, activeFlagShiftPcnt) {
        var flagsContainer = $('#summary-chart .flags').first(),

          totalFlag          = $('#total-time-flag'),
          totalFlagstaff     = $('.flagstaff.total'),
          totalFlagShift     = ((flagsContainer.width() - totalFlag.width()) * totalFlagShiftPcnt / 100 ),

          activeFlag         = $('#active-time-flag'),
          activeFlagstaff    = $('.flagstaff.active'),
          activeFlagShift    = ((flagsContainer.width() - activeFlag.width()) * activeFlagShiftPcnt / 100 ),

          maxActiveFlagPcnt  = Math.round(10000 * summary.total.a / summary.total.t) / 100,
          maxActiveFlag      = $('#max-active-flag'),
          maxActiveFlagstaff = $('.flagstaff.max-active'),
          maxActiveFlagShift = ((flagsContainer.width() - maxActiveFlag.width()) * maxActiveFlagPcnt / 100 );

        totalFlag.html(Math.round(totalFlagShiftPcnt));
        activeFlag.html(Math.round(activeFlagShiftPcnt));
        maxActiveFlag.html(Math.round(maxActiveFlagPcnt));

        totalFlag.data('pcnt', totalFlagShiftPcnt);
        activeFlag.data('pcnt', activeFlagShiftPcnt);
        maxActiveFlag.data('pcnt', maxActiveFlagPcnt);

        totalFlag.removeClass('hidden');
        activeFlag.removeClass('hidden');
        maxActiveFlag.removeClass('hidden');
        $('.flagstaff').removeClass('hidden');

        totalFlag.css('left', totalFlagShift + 'px');
        activeFlag.css('left', activeFlagShift + 'px');
        maxActiveFlag.css("left", maxActiveFlagShift)
        totalFlagstaff.css('left', (totalFlagShift + 19) + 'px');
        activeFlagstaff.css('left', (activeFlagShift + 19) + 'px');
        maxActiveFlagstaff.css('left', (maxActiveFlagShift + 19) + 'px');

      },
      moveFlagListen = function moveFlagListen(evt) {
        var timeFlag = $(this),
          flagType = evt.target.id.split('-')[0],
          flagstaffClass = '.flagstaff.' + flagType,
          flagstaff = $(flagstaffClass),
          pcnt = Math.round(10000 * parseInt(timeFlag.css("left")) / Number(timeFlag.parent().width() - timeFlag.width())) / 100;

        timeFlag.data('pcnt', pcnt);
        timeFlag.html(Math.round(pcnt));
        flagstaff.css("left", (parseFloat(timeFlag.css("left")) + timeFlag.width() + 2) + "px");
        self.summaryData[flagType + 'FlagShift'] = pcnt;
      };


    $("#total-time-flag").draggable({
      axis: "x",
      containment: "parent",
      drag: moveFlagListen,
      stop: function (evt) {
        moveFlagListen.call(this, evt);
        self.user.setState();
      }
    });
    $("#active-time-flag").draggable({
      axis: "x",
      containment: "parent",
      drag: moveFlagListen,
      stop: function (evt) {
        moveFlagListen.call(this, evt);
        self.user.setState();
      }
    });

    drawFlags(self.summaryData.totalFlagShift, self.summaryData.activeFlagShift);

    $(window).resize(function (evt) {
      drawFlags($('#total-time-flag').data('pcnt'), $('#active-time-flag').data('pcnt'));
    });
  };

  window.SummaryChart = SummaryChart;

}());


