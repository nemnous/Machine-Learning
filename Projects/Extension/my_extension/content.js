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
function getTimeSTamp(){
	let epochTime = (new Date).getTime();
	return epochTime;
}

document.onclick = function(e){
	var x = e.pageX;
	var y = e.pageY;
	let time = getTimeSTamp();
	let url = getUrl();
	let hostname = window.location.hostname;
	let activity = checkActivity(hostname);
	console.log("This is activity",activity);
	let message = {
		x:x,
		y:y,
		time:time,
		url:url,
		activity:activity
	};

	chrome.runtime.sendMessage(message);
}

document.addEventListener("keypress",function(event){
	let current = getTimeSTamp();
	console.log(current,event.key);
});

window.onload = function(){
	let observed = document.getElementsByTagName('a');
	console.log(observed,observed.length);
	for (let i = 0; i < observed.length; i ++){
		// console.log(observed[i].href);
		observed[i].addEventListener('click',function(e){
			let thisevent =window.event||event;
			// alert(observed[i].hostname);
			readTextFile("qna.txt",function(text){
				var data = JSON.parse(text);
				alert(data);
			});
		});
	}
}

function readTextFile(file,callback){
	let rawFile= new XMLHttpRequest();
	rawFile.open("GET",file,false);
	rawFile.onreadystatechange = function(){
		if(rawFile.readyState === 4){
			if(rawFile.status === 200 || rawFile.status == 0)
			{
				// let allText = rawFile.responseText;
				callback(rawFile.responseText);
			}
		}
	}
	rawFile.send(null);
}

