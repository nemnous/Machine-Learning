
var user;
chrome.identity.getProfileUserInfo(function(userInfo) {
    user = userInfo;
 });

//  chrome.tabs.getSelected(null, function(tab) {
//     //    var joinedMessage = messageToReturn + backgroundScriptMessage; 
//        alert("Background script is sending a message to contentscript:'" + user.email +"'");
//        chrome.tabs.sendMessage(tab.id, {message: user.email});
//       });


 chrome.extension.onRequest.addListener(function(request, sender)
 {
//   alert("Background script has received a message from contentscript:'" + request.message + "'");
  returnMessage(request.message);
 });
  
 function returnMessage(messageToReturn)
 {
  chrome.tabs.getSelected(null, function(tab) {
//    var joinedMessage = messageToReturn + backgroundScriptMessage; 
//    alert("Background script is sending a message to contentscript:'" + user.email +"'");
   chrome.tabs.sendMessage(tab.id, {message: user.email});
  });
 }
   
 


//  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     chrome.tabs.sendMessage(tabs[0].id, {"info": user});
//     })

// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
//       console.log(response.farewell);
//     });
//   });

// setInterval( chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     chrome.tabs.sendMessage(tabs[0].id, {"info": user}, function(response){});
//     }), 10000);
// chrome.tabs.sendMessage({"info": user});


 chrome.storage.local.set({'storageObjectName': user}, function () {
    /* optional callback */
});
