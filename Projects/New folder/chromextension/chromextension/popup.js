
document.addEventListener('DOMContentLoaded', function() {
  userEmail = chrome.extension.getBackgroundPage().user.email;

  var link = document.getElementById('head');
  if(link){
    link.innerHTML = "Hola " + userEmail + " Lets Go!";
  }
}); 
