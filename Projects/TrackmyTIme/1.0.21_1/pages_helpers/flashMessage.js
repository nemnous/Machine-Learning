/*global jQuery */
(function ($) {
  "use strict";

  $.fn.flash_message = function (options) {

    options = $.extend({
      text: 'Done',
      time: 1000,
      how: 'before',
      class_name: ' alert '
    }, options);

    return $(this).each(function () {
      if ($(this).parent().find('.flash_message').get(0)) {
        return;
      }


      var message = $('<div />', {
        'class': 'flash_message ' + options.class_name,
        html: options.text
      }).hide().fadeIn('fast');

      $(this)[options.how](message);

      message.delay(options.time).fadeOut('normal', function() {
        $(this).remove();
      });

    });
  };
}(jQuery));


/*
  $('#status-area').flash_message({
    text: 'Added to cart!',
    how: 'append'
  });
*/
