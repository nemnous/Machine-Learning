// theurl = window.location.href;

// function createMenu(mostvisited) {
    // for(var i = 0; i < mostvisited.length; i++) {
        // console.log(mostvisited[i]);
    // }
// }

// chrome.topSites.get(createMenu)

// getTopSites =  function(callbackfunc) {
//     chrome.topSites.get (function(url_list) {
//         for(var i=0;i<url_list.length;i++) {callbackfunc(url_list[i]);}
//     });
// }
// getTopSites(createMenu);


function getUrl() {
    let url = window.location.href;
    return url;
  }

value = getUrl();

// dictMain = {'dict':{}}
// // var dictMain;
// chrome.storage.local.get(['dictMain'], function(result) {
//     dictMain = result;
//     console.log("updated" + JSON.stringify(dictMain))
//   });
// try {
// chrome.storage.local.get(['dictMain'], function(result) {

//     dictMain = result;

//     console.log("updated" + JSON.stringify(dictMain))
//   });
// } catch(err) {
//     chrome.storage.local.set(dictMain, function() {
//         console.log('Value is set to ' + JSON.stringify(dictMain));
//         console.log("initiated")
//       });
// }
epochTime = (new Date).getTime();
// dictMain['dict'] = value;
// chrome.storage.local.set({DB:{}}, function() {
//     console.log('Value is set to ');
//   });

// a = "naveen"
// chrome.storage.local.get(['nani'], function(result) {
//     // theDB = result['DB'];
//     // theDB.epochTime = value;
//     console.log(a + "before");
//     val = val + result.nani;


//     console.log('Value currently is ' + JSON.stringify(result));
// });


chrome.storage.local.get('url', function(result) {
    //data.visited will be in the result object for a specific key. You can change data.visited 
    //to be true here. After changing it to true you can save it again under 
    //the key 'storageKey' or any key you like.
    // t = {}
    // t[epochTime] = value;
    result.url[parseInt(epochTime)] = value;
    chrome.storage.local.set({url: result.url});
  });

  // chrome.storage.local.set({url: {}});

  chrome.storage.local.get('url', function(result) {
    //data.visited will be in the result object for a specific key. You can change data.visited 
    //to be true here. After changing it to true you can save it again under 
    //the key 'storageKey' or any key you like.

    console.log(JSON.stringify(result));
  });
// DB = {}
// chrome.storage.local.set({nani:a}, function() {
//         console.log('Value is set to ' + JSON.stringify(theDB));
//     });



