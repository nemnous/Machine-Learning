function setup(){
	noCanvas();

	let bgpage = chrome.extension.getBackgroundPage();
	let x = bgpage.x;
	let y = bgpage.y;
	let time = bgpage.time;
	let url = bgpage.url;
	let activity = bgpage.activity;
	let video = bgpage.audible;
	console.log(x,y);
	document.getElementById("xy").innerHTML = "x: "+x.toString()+", y: "+y.toString()+", TimeStamp: "+time.toString()+", URL:"+url;
	document.getElementById("activity").innerHTML= "This activity is: "+activity;
	document.getElementById('video').innerHTML = "This is the url that is paying video/audio"+video;
}

