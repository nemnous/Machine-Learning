$(function () {




  var Configuration = function (obj) {
    this.user = obj.user;
    this.state = obj.user._state;
    this.configData = obj.user._state.configData;


  };

  Configuration.init = function () {
    events.subscribe('/user/init', function (userInit) {

      var configuration = new Configuration(userInit);
      configuration.initInterface();
    });

    return Promise.resolve({message: "Configuration was init"});
  };


  Configuration.prototype.initInterface = function () {
    var self = this;

    return Promise.resolve()
      .then(function () { return self.initStopStart(); })
      .then(function () { return self.initWeekStartSelector(); })
      .then(function () { return self.initPermissionRules(); });
  };

  Configuration.prototype.initStopStart = function () {
    var self = this;

    // --- configurationTracking ---
    var configurationTracking = $("#configuration-tracking").buttonset();
    configurationTracking.find("input:radio")[self.configData.trackingStopped].checked = true;
    configurationTracking.change(function (jEvent) {

      var iconPath, trackingState = jEvent.target.id.split('-')[2];
      self.configData.trackingStopped = trackingState === 'stop' ? 1 : 0;
      self.user.setState().then(function () {
        if (trackingState === 'stop') {
          chrome.runtime.sendMessage({to: "/conveyor/to-stop"});
          $('#stopping-message').removeClass('hidden');

        } else {
          chrome.runtime.sendMessage({to: "/conveyor/to-run"});
          $('#stopping-message').addClass('hidden');
        }
      });
    });

    configurationTracking.buttonset('refresh');
  };

  Configuration.prototype.initWeekStartSelector = function () {
    var firstWeekDayFlash = $('#firstWeekDayFlash'), self = this;

    // --- configurationTracking ---
    var selectedButtonInd,
      weekStartSelector = $("#week-start-selector").buttonset();
    switch (Number(self.configData.weekStart)) {
      case   6: selectedButtonInd = 0; break;
      case   0: selectedButtonInd = 1; break;
      default : selectedButtonInd = 2
    }

    weekStartSelector.find("input:radio")[selectedButtonInd].checked = true;
    weekStartSelector.change(function (jEvent) {
      self.configData.weekStart = jEvent.target.id.split('-')[4];
      self.user.setState().then(function(){
        events.publish('/menu/weekStart/update');
        $(firstWeekDayFlash).flash_message({
          text: '<i class="fa fa-check"' + ' style="color: rgb(60, 118, 61); padding: 0 5px 0 2px"></i>' +
          'The first day of week was changed.',
          how: 'append',
          time: 1500,
          class_name: "alert alert-success "
        });

      });
    });

    weekStartSelector.buttonset('refresh');
  };

  Configuration.prototype.initPermissionRules = function () {

    var self = this;
    var ignoringRuleFlash = $('#ignoringRuleFlash');
    var addIgnoringRuleBtn = $('#addIgnoringRule');
    var ignoringList = $('#ignoringList');
    ignoringList.html('');

    var reinitConveyor = function(){
      chrome.runtime.sendMessage({to: "/core/re-init-conveyor-user"});
    }

    addIgnoringRuleBtn.button();
    addIgnoringRuleBtn.click(function (evt) {
      var ignoringRule = String($('#ignoringRule').val());
      if (ignoringRule) {
        self.configData.ignoringRules.push(ignoringRule);
        self.user.setState()
          .then(function (res) {
            reinitConveyor();

            var itemVal = ignoringRule;
            var rule = '<li><div class="rule" title="' + itemVal + '">' + itemVal + '</div>' +
              '<button data-rule="' + itemVal + '"> Remove</button></li>';
            ignoringList.append(rule);
            ignoringList.find('button').button();
            $('#ignoringRule').val("");
            $(ignoringRuleFlash).flash_message({
              text: '<i class="fa fa-check"' + ' style="color: rgb(60, 118, 61); padding: 0 5px 0 2px"></i>' +
              'The new ignoring rule was added.',
              how: 'append',
              time: 1500,
              class_name: "alert alert-success "
            });

          })
          .catch(function (err) {
            $(ignoringRuleFlash).flash_message({
              text: '<i class="fa fa-ban"' +' style="color: rgb(172, 41, 37); padding: 0 5px 0 2px"></i>' +
              'Adding ignoring rule Error: ' + err.message,
              how: 'append',
              time: 1500,
              class_name: "alert alert-danger "
            });
          });
      } else {
        $(ignoringRuleFlash).flash_message({
          text: '<i class="fa fa-exclamation-circle"' + ' style="color: rgb(172, 41, 37); padding: 0 5px 0 2px"></i>' +
          'Please, enter the beginning of URL which you don\'t want to track.',
          how: 'append',
          class_name: 'flash',
          time: 2000
        });
      }

    });

    self.configData.ignoringRules.forEach(function (itemVal) {
      var rule = '<li><div class="rule" title="' + itemVal + '">' + itemVal + '</div>' +
        '<button data-rule="' + itemVal + '"> Remove</button></li>';
      ignoringList.append(rule);
      ignoringList.find('button').button();
    });
    ignoringList.on('click', 'button', function(evt) {
      var currentTarget = evt.currentTarget,
        rule = currentTarget.dataset.rule,
        ruleInd = self.configData.ignoringRules.indexOf(rule);
      self.configData.ignoringRules.splice(ruleInd, 1);

      self.user.setState()
        .then(function (res) {
          reinitConveyor();

          currentTarget.closest('li').remove();
          $(ignoringRuleFlash).flash_message({
            text: '<i class="fa fa-check"' + ' style="color: rgb(60, 118, 61); padding: 0 5px 0 2px"></i>' +
            'Rule "' + rule + '" was successfully removed',
            how: 'append',
            time: 1500,
            class_name: "alert alert-success "
          });

        })

    })



  };


  window.Configuration = Configuration;

});

