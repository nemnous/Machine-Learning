// var tbody = document.getElementById('tbody');
// var h3body = document.getElementById('h3id');
// h3body.innerHTML = "Erripappa"
// alert("popup")
obj = {}

document.addEventListener("DOMContentLoaded", function() {
    
  chrome.storage.local.get('url', function(result) {
    //data.visited will be in the result object for a specific key. You can change data.visited 
    //to be true here. After changing it to true you can save it again under 
    //the key 'storageKey' or any key you like.
    // t = {}
    // t[epochTime] = value;
    obj = result.url;
    // document.getElementById("h3id").innerHTML = JSON.stringify(obj);
    
    tr = ""
    // obj = obj.sort()
    // document.getElementById('tbody').innerHTML = "";
    for(var key in obj) {
            var val = obj[key];
            var date = new Date(parseInt(key, 10)*1);
            // Hours part from the timestamp
            var hours = date.getHours();
            // Minutes part from the timestamp
            var minutes = "0" + date.getMinutes();
            // Seconds part from the timestamp
            var seconds = "0" + date.getSeconds();
            var day = date.getDate();
            var mon = date.getMonth() + 1;
            var year = date.getFullYear();
            // Will display time in 10:30:23 format
            var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + "\n" + day + "-" + mon + "-" + year;

           
            // tr += "<p style= 'width:10px'></p>"
            tr += "<tr><td style = 'width: 100px'>" + formattedTime + "</td>" + "<td style = 'width: 150px; text-overflow: ellipsis'>" + val + "</td>" + "<td style = 'width:50px; text-align:right; padding-right:15px'><button class='btn' id = " + key + " onclick = 'deleteFunc(this.id)' >DEl</button></td></tr>";
            

    }
    document.getElementById('tbody').innerHTML = tr ;
});
});

function deleteFunc(buttID) {

  document.getElementById('h3id').innerHTML = buttID;
}
// for (var i = 0; i < Object.keys(obj).length; i++) {
//     var tr = "<tr>";

//     // /* Verification to add the last decimal 0 */
//     // if (obj[i].value.toString().substring(obj[i].value.toString().indexOf('.'), obj[i].value.toString().length) < 2) 
//     //     obj[i].value += "0";

//     /* Must not forget the $ sign */
//     tr += "<td>" + obj[i].key + "</td>" + "<td>$" + obj[i].value.toString() + "</td></tr>";

//     /* We add the table row to the table body */
//     tbody.innerHTML += tr;
// }


//   });


     
//   });

// chrome.storage.local.get('url', function(result) {
//     //data.visited will be in the result object for a specific key. You can change data.visited 
//     //to be true here. After changing it to true you can save it again under 
//     //the key 'storageKey' or any key you like.
//     obj = result.url;
//     document.getElementById('h3id').innerHTML = JSON.stringify(result);
//   });


// window.onload = function() {
//     what();
//     function what() {
//     // alert("hola")
//     obj = {}
//     chrome.storage.local.get('url', function(result) {
//         //data.visited will be in the result object for a specific key. You can change data.visited 
//         //to be true here. After changing it to true you can save it again under 
//         //the key 'storageKey' or any key you like.
//         obj = result.url;
//     // document.getElementById('h3id').innerHTML = JSON.stringify(result);
//   });

//         document.getElementById('h3id').innerHTML = JSON.stringify(obj);
//     };
// }

// for (var i = 0; i < obj.length; i++) {
//     var tr = "<tr>";

//     // /* Verification to add the last decimal 0 */
//     // if (obj[i].value.toString().substring(obj[i].value.toString().indexOf('.'), obj[i].value.toString().length) < 2) 
//     //     obj[i].value += "0";

//     /* Must not forget the $ sign */
//     tr += "<td>" + obj[i].key + "</td>" + "<td>$" + obj[i].value.toString() + "</td></tr>";

//     /* We add the table row to the table body */
//     tbody.innerHTML += tr;
// }