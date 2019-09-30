// TODO(DEVELOPER): Change the values below using values from the initialization snippet: Firebase Console > Overview > Add Firebase to your web app.
// Initialize Firebase
// F:\Machine Learning\Projects\Extension\quickstart-js\auth\chromextension
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

// var config = {
//   apiKey: '<YOUR_API_KEY>',
//   databaseURL: '<YOUR_DATABASE_URL>',
//   storageBucket: '<YOUR_STORAGE_BUCKET_NAME>'
// };
// firebase.initializeApp(config);

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
//  */
// function initApp() {
//   // Listen for auth state changes.
//   firebase.auth().onAuthStateChanged(function(user) {
//     console.log('User state change detected from the Background script of the Chrome Extension:', user);
//   });
// }

// window.onload = function() {
//   initApp();
// };
