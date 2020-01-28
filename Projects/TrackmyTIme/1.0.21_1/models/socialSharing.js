$(function () {

  var openInNewWindow = function(evt){
    window.open(this.href, '_blank', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
    event.stopPropagation();
    return false;

  };
  $('#share-on-google').click(openInNewWindow);
  $('#share-on-vk').click(openInNewWindow);
  $('#share-on-twitter').click(openInNewWindow);
  $('#share-on-LinkedIn').click(openInNewWindow);

});

