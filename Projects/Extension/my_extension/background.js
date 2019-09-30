console.log("background running");
chrome.browserAction.onClicked.addListener(function(){
	chrome.tabs.create({url: chrome.extension.getURL('popup.html')});
});

chrome.runtime.onMessage.addListener(receiver);
window.x = "val";
window.y = "val";
window.time = "time";
window.url = "empty";
window.activity = "nothing";
window.audible= false;
function receiver(request,sender,sendResponse){
	console.log(request.x,request.y,request.time,request.url,request.activity);
	window.x = request.x;
	window.y = request.y;
	window.time = request.time;
	window.url = request.url;
	window.activity = request.activity;
}
chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.query({lastFocusedWindow: true},function(tabs){
  	for (let i in tabs){
  		if (tabs[i].audible)
  		{
  			window.audible = true;
  			break
  		}
  	}
  });
})

