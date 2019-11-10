/**
 * eventlistener DOMContentLoaded.
 * Used to get the username from the background script and set that in popup HTML.
 */
document.addEventListener('DOMContentLoaded', function() {
  userEmail = chrome.extension.getBackgroundPage().user.email;
  var link = document.getElementById('head');
  if (link) {
      link.innerHTML = "Hola " + userEmail + " Lets Go!";
  }
});