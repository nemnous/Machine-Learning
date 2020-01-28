/*global window, chrome, Promise, HTMLElement,
 moment, d3, $,
 */

(function () {
  "use strict";

  /**
  * @class for work with main extension menu
  * */
  var Menu              = function (userInit) {
    this.activeDays = userInit.activeDays;
    this.menuData   = userInit.user._state.menuData;
    this.configData = userInit.user._state.configData;
    this.user       = userInit.user;
    this.element    = userInit.user._state;
  };

  Menu.init             = function () {
    events.subscribe('/user/init', function(userInit) {
      var menu = new Menu(userInit);
      menu.initInterface();
    });

    return Promise.resolve({message: "Menu was init"});

  };

  Menu.prototype.initInterface = function () {
    var self = this;

    return Promise.resolve()
      .then(function() { return self.initStoppingMessage(); })
      .then(function() { return self.initTabSelection(); })
      .then(function() { return self.initButtonSets(); })
      .then(function() { return self.initCalendars(); })
      .then(function() { return self.initButtons(); })
      .then(function() {
        self.show();
        return Promise.resolve(self);
      });

  };

  Menu.prototype.initStoppingMessage = function() {
    var self = this;
    if (self.configData.trackingStopped) { $('#stopping-message').removeClass('hidden'); }
  };

  Menu.prototype.initTabSelection = function() {
    // 0 - summary, 1 - flow, 2 - stacked
    var activeTabInd,
      self = this,
      data = self.menuData;


    switch (data.activeTab ) {
      case 'summary'      : activeTabInd = 0; break;
      case 'flow'         : activeTabInd = 1; break;
      case 'stacked'      : activeTabInd = 2; break;
      case 'like'         : activeTabInd = 3; break;
      case 'info'         : activeTabInd = 4; break;
      case 'configuration': activeTabInd = 5; break;
    }

    $('#extension').tabs({
      "active": activeTabInd,
      "activate": function(event, ui) {
        var eventPath, tabName = ui.newTab[0].dataset.tabName;
        switch (tabName) {
          case 'summary':
            eventPath = '/menu/summary/updating';
            break;
          case 'flow':
            eventPath = '/menu/flow/updating';
            break;
          case 'stacked':
            eventPath = '/menu/stacked/updating';
            break;
          case 'configuration':
            eventPath = '/menu/configuration/updating';
            break;
        }
        self.user.setState().then(function(){ if (eventPath) events.publish(eventPath, {menuData: data}); });
        data.activeTab = tabName;
        self.user.setState();
        self.setHashAndTitle(tabName);

      },
      "beforeLoad": function(event, ui) {
        if (ui.tab[0].dataset.tabName === 'info') {
          ui.panel.addClass('tab-info');
        }
      },
      "beforeActivate": function(event, ui) {
        var tabName = ui.newTab[0].dataset.tabName;
      }
    });
    $('#extension').bind("tabsshow", function(event, ui) {
      window.location.hash = ui.tab.hash;
    });

  };

  Menu.prototype.setHashAndTitle   = function(tabName) {

    var self = this, data = self.menuData;
    var title,
      flowTypes     = data.flowTypes === 0 ? "Total" : "Active",
      summaryPeriod = data.summaryPeriods === 0 ? "Day":(data.summaryPeriods === 1 ? "Week":"Month"),
      hash = '#' + tabName;
    switch (tabName) {
      case 'summary':
        title = 'Summary - ' + summaryPeriod + ' Chart | TimeYourWeb';
        hash += '-' + summaryPeriod.toLocaleLowerCase();
        break;
      case 'flow':
        title = 'Flow - ' + flowTypes + ' Chart | TimeYourWeb';
        hash += '-' + flowTypes.toLocaleLowerCase();
        break;
      case 'stacked':
        title = 'Stacked Chart | TimeYourWeb';
        break;
      case 'info':
        title = 'Info | TimeYourWeb';
        break;
      case 'configuration':
        title = 'Configuration | TimeYourWeb';
        break;
      default:
        title = 'TimeYourWeb';
        hash = '';
    }

    window.location.hash = hash;
    window.document.title = title;
  };

  Menu.prototype.initButtonSets = function () {

    // "summaryPeriods":  0, // 0 - Day, 1 - Week, 2 - Month
    // "flowPeriods":     1, // 0 - Day, 1 - Week, 2 - Month
    // "stackedPeriods":  2, // 0 - Day, 1 - Week, ---------
    var self = this,
      menuData = self.menuData;

    // --- summaryPeriodsButtonSet ---
    var summaryPeriodsButtonSet = $("#summary-periods").buttonset();
    summaryPeriodsButtonSet.find("input:radio")[menuData.summaryPeriods].checked = true;
    summaryPeriodsButtonSet.buttonset('refresh');
    summaryPeriodsButtonSet.change(function (jEvent) {
      var period = jEvent.target.id.split('-')[2];
      menuData.summaryPeriods = period === 'day' ? 0 : (period === 'week' ? 1 : 2);
      self.user.setState().then(function () {
        self.setHashAndTitle(self.menuData.activeTab);
        events.publish('/menu/summary/updating', {menuData: menuData});
      });
    });

    // --- flowPeriodsButtonSet ---
    var flowPeriodsButtonSet = $("#flow-periods").buttonset();
    flowPeriodsButtonSet.find("input:radio")[menuData.flowPeriods].checked = true;
    flowPeriodsButtonSet.buttonset('refresh');
    flowPeriodsButtonSet.change(function (jEvent) {

      var period = jEvent.target.id.split('-')[2];
      menuData.flowPeriods = period === 'day' ? 0 : (period === 'week' ? 1 : 2);
      self.user.setState().then(function () {
        self.setHashAndTitle(self.menuData.activeTab);
        events.publish('/menu/flow/updating', {menuData: menuData});
      });
    });

    // --- flowTypesButtonSet ---
    var flowTypesButtonSet = $("#flow-types").buttonset();
    flowTypesButtonSet.find("input:radio")[menuData.flowTypes].checked = true;
    flowTypesButtonSet.buttonset('refresh');
    flowTypesButtonSet.change(function (jEvent) {

      var period = jEvent.target.id.split('-')[2];
      menuData.flowTypes = period === 'total' ? 0 : 1;
      self.user.setState().then(function () {
        self.setHashAndTitle(self.menuData.activeTab);
        events.publish('/menu/flow/updating', {menuData: menuData});
      });
    });
    
    // --- stackedTypesButtonSet ---
    var stackedTypesButtonSet = $("#stacked-types").buttonset();
    stackedTypesButtonSet.find("input:radio")[menuData.stackedTypes].checked = true;
    stackedTypesButtonSet.buttonset('refresh');
    stackedTypesButtonSet.change(function (jEvent) {

      var period = jEvent.target.id.split('-')[2];
      menuData.stackedTypes = period === 'total' ? 0 : 1;
      self.user.setState().then(function () {
        self.setHashAndTitle(self.menuData.activeTab);
        events.publish('/menu/stacked/updating', {menuData: menuData});
      });
    });
    
    self.setHashAndTitle(self.menuData.activeTab);

  };

  Menu.prototype.initCalendars    = function() {
    var self = this,
      menuData = self.menuData,
      fixHighlight = function (highlightMode) {

        if (highlightMode === 0) { // 'day'
          // $(calendar).datepicker("option", "showOtherMonths", false);
          $('#ui-datepicker-div').off('.week');
          $('#ui-datepicker-div').off('.month');
        }

        if (highlightMode === 1) {// 'week'
          // $(calendar).datepicker("option", "showOtherMonths", true);
          $('#ui-datepicker-div').off('.month');

          $('#ui-datepicker-div').on('mouseover.week', 'tr', function () {
            $(this).find('td a').addClass('ui-state-hover');
          });

          $('#ui-datepicker-div').on('mouseout.week', 'tr', function () {
            $(this).find('td a').removeClass('ui-state-hover');
          });
        }

        if (highlightMode === 2) { //  'month'
          // $(calendar).datepicker("option", "showOtherMonths", false);
          $('#ui-datepicker-div').off('.week');

          $('#ui-datepicker-div').on('mouseover.month', 'table', function () {
            $(this).find('td a').addClass('ui-state-hover');
          });

          $('#ui-datepicker-div').on('mouseout.month', 'table', function () {
            $(this).find('td a').removeClass('ui-state-hover');
          });
        }
      },
      clorizeWeek = function () {
        window.setTimeout(function () {
          var tr =  $('#ui-datepicker-div .ui-datepicker-current-day a').closest('tr');
          tr.find('td>a').addClass('ui-state-active');
          tr.find('td:first-child').css('font-weight', 900).css('background-color', "rgb(255, 255, 255)");
        });
      },
      clorizeMonth = function () {
        window.setTimeout(function () {
          var table =  $('#ui-datepicker-div .ui-datepicker-current-day a').closest('table');
          table.find('td>a').addClass('ui-state-active');
          table.find('td:first-child').css('font-weight', 900).css('background-color', "rgb(255, 255, 255)");

        });
      },
      datePickerParams = {
        selectOtherMonths: true,
        dateFormat: "yy-mm-dd",
        firstDay: Number(self.configData.weekStart),
        numberOfMonths: [2, 2],
        showCurrentAtPos: 2,
        stepMonths: 2,
        showOtherMonths: true,
        beforeShow: function (textbox, instance) {

          $(textbox).css({ "position": "relative", "z-index": 3 });
          var calendarType = this.id.split("-")[0],
            highlightMode = menuData[calendarType + "Periods"];
          if (calendarType === "stacked") {highlightMode = 2; }
          if (highlightMode === 1) { clorizeWeek(); }
          if (highlightMode === 2) { clorizeMonth(); }
          fixHighlight(highlightMode);
        },
        onChangeMonthYear: function ()  {
          var calendarType = this.id.split("-")[0],
            highlightMode = menuData[calendarType + "Periods"];
          if (calendarType === "stacked") {highlightMode = 2; }
          if (highlightMode === 1) { clorizeWeek(); }
          if (highlightMode === 2) { clorizeMonth(); }
          fixHighlight(highlightMode);

        },
        beforeShowDay: function unavailable(date) {
          // showing only active days
          var dmy = date.getFullYear() + "-" +
            ('0' + (date.getMonth() + 1)).slice(-2) + "-" +
            ('0' + date.getDate()).slice(-2);
          if (self.activeDays.indexOf(dmy) === -1) { return [false, "", "No tracked time"]; }
          return [true, ""];
        },
        onSelect: function (dateStr, instance) {
          var calendarType = instance.id.split("-")[0];
          menuData[calendarType + "Date"] =  new Date(dateStr).toISOString().slice(0,10);
          self.user.setState().then(function(){
            var eventPath = '/menu/' + calendarType + '/updating'
            events.publish(eventPath, {menuData: menuData});
          });
        },

      },
      summaryDate = $( "#summary-calendar" ).datepicker(datePickerParams),
      flowDate    = $( "#flow-calendar" ).datepicker(datePickerParams),
      stackedDate = $( "#stacked-calendar" ).datepicker(datePickerParams);

    summaryDate.datepicker("setDate", new Date(menuData.summaryDate));
    flowDate.datepicker("setDate",    new Date(menuData.flowDate));
    stackedDate.datepicker("setDate", new Date(menuData.stackedDate));

    $( "#summary-calendar-btn" ).button().click(function() { summaryDate.datepicker('show'); });
    $( "#flow-calendar-btn"    ).button().click(function() { flowDate.datepicker('show');    });
    $( "#stacked-calendar-btn" ).button().click(function() { stackedDate.datepicker('show'); });

    events.subscribe('/menu/weekStart/update', function() {
      summaryDate.datepicker( "option", "firstDay", self.configData.weekStart );
      flowDate.datepicker( "option", "firstDay", self.configData.weekStart );
      stackedDate.datepicker( "option", "firstDay", self.configData.weekStart );
    });
  };

  Menu.prototype.initButtons      = function() {
    var self = this;

    var expandBtn = $('#expand-btn');
    expandBtn.button();
    expandBtn.click(function (evt) { chrome.tabs.create({url: 'extension.html'}); });

    var csvDownloadBtn = $('#summary-csv-download-btn');
    csvDownloadBtn.button();
    csvDownloadBtn.click(function (evt) {
      self.user.getSummary().then(function (res) {

        var csv = 'URL,Total(sec),Active(sec),Domain,Page,Title\n'
                + 'inAll,' + res.total.t + ',' + res.total.a + ',0,0,inAll\n';
        console.log(JSON.stringify(res.data))
        Object.keys(res.data).forEach(function (key) {
          var item = res.data[key];
          var title = (item.title ? item.title:'');
          title = title.split('"').join('\"');
          title = title.split(',').join('\,');
          if (item.d !== "inAll" && item.pT && item.pA) {
            csv += '"'
                +  item.d + (item.p ? item.p:"") + '",'
                +  item.pT + ','
                +  item.pA + ','
                + (item.title ? 0:1) + ','
                + (item.title ? 1:0) + ',"'
                +  title + '"\n';
          }
        });
        var csvFileName = 'data.csv';
        Chart.renderChartTitle(
          self.menuData.summaryPeriods,
          self.menuData.summaryDate,
          self.user._state.configData.weekStart,
          {html: function(name) { csvFileName = "Summary - " + name + '.csv';}}
        );


        var downloadLink = document.createElement("a");
        var blob = new Blob(["\ufeff", csv]);
        var url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = csvFileName;

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      });
    });
    
    var csvDownloadBtn = $('#flow-csv-download-btn');
    csvDownloadBtn.button();
    csvDownloadBtn.click(function (evt) {
      self.user.getFlow().then(function (res) {
        console.log("flow" + JSON.stringify(res));
        var csv = 'Domain,Path,Start timestamp,Finish timestamp,URL,Title\n';

        res.totalPeriods.forEach(function (item) {
          var title = res.pIds[item.pId].title;
          title = title.split('"').join('\"');
          title = title.split(',').join('\,');

          csv += '"'
              +  res.dIds[item.dId].d + '","'
              +  res.pIds[item.pId].p + '",'
              +  item.s * 1000 + ','
              +  item.f * 1000 + ',"'
              +  res.dIds[item.dId].d + res.pIds[item.pId].p + '","'
              +  title + '"\n';
        });
        var csvFileName = 'data.csv';

        Chart.renderChartTitle(
          self.menuData.flowPeriods,
          self.menuData.flowDate,
          self.user._state.configData.weekStart,
          {html: function(name) {
            var type  = self.menuData.flowTypes === 0 ? 'Total' : 'Active';
            self.menuData.flowTypes
            csvFileName = "Flow (" + type + ') - ' + name + '.csv';
          }}
        );
        var downloadLink = document.createElement("a");
        var blob = new Blob(["\ufeff", csv]);
        var url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = csvFileName;

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      });
    });

    // $( "#expand-btn" ).button();
    // $( "#sign-out-btn" ).button();
  };

  Menu.prototype.show          = function (chartType) {
    var self = this;
    self.setHashAndTitle(self.menuData.activeTab);
    $('#extension').css( "display", "flex" );
    // $('#extension').show();

//    , renderPromise,
//      chartElem = document.getElementById('content'),
//      spinnerWrapper = document.createElement("div"),
//      spinner = document.createElement("span");
//    spinnerWrapper.className = "spinner-wrapper";
//    spinner.className = "spinner fa fa-spinner fa-spin";
//    spinner.style.textAlign = "center";
//    spinnerWrapper.appendChild(spinner);
//    chartElem.appendChild(spinnerWrapper);
//    return dStorage.
  };

  window.Menu = Menu;

}());


