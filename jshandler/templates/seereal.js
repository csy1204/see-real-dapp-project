// enum action {
//     o FOCUS
//     o BLUR
//     o AD
//   }
//   enum label{
//     o VOLUMNUP
//     o GETBACK
//     o VOLUMNDOWN
//     o GETOUT
//     o ADCLICK
//     o ADCLOSE
//   }
  
//   asset ViewLog identified by logId{
//     o String logId
//     o String uid // 개인식별정보
//     o String sid // 세션 데이터
//     o Boolean gender // True는 Female, False는 Male
//     o Integer age //나이
//     o String url // 페이지 url
//     o String referer optional // 유입경로
//     o String resolution // 해상도 width+"X"+height
//     o Long time // 데이터 수집 당시의 시간
//     o String programTitle // 프로그램명
//     o String programNum // 프로그램 회차
//     o String channelName // 채널명
//     o Double duration // 전체 길이
//     o Double uptime // 현재 영상 시간
//   }
  
//   asset EventData identified by eventId{
//     o String eventId
//     o String uid // 개인식별정보
//     o String sid // 세션 데이터
//     o Boolean gender // True는 Female, False는 Male
//     o Integer age //나이
//     o String url // 페이지 url
//     o String referer optional // 유입경로
//     o String resolution // 해상도 width+"X"+height
//     o Long time // 데이터 수집 당시의 시간
//     o String programTitle // 프로그램명
//     o String programNum // 프로그램 회차
//     o String channelName // 채널명
//     o Double duration // 전체 길이
//     o Double uptime // 현재 영상 시간
//     o action action
//     o label label
//   }

const tsValue = new Date().getTime();

if (getCookie('uid') != undefined) {
    setCookie("uid", "user_001", 90);
}
setCookie("sid", "session_"+tsValue.toString(), 1);

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

 // 3. This function creates an <iframe> (and YouTube player)
 //    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
   player = new YT.Player('player', {
     height: '480', width: '860', videoId: 'BTKn3VHcMc8',
     events: {
       'onReady': onPlayerReady,
       'onStateChange': onPlayerStateChange
     }
   });
}


var preFocusState = true;
var preVolume = 0;
var preMute = false;
 // 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    preVolume = player.getVolume();
    preMute = player.isMuted();
    document.getElementsByTagName('p')[0].innerText = JSON.stringify(player.getVideoData());
    var myView = setInterval(myViewData, 3000);
    var myEvent = setInterval(myEventData, 1000);
    var myVolume = setInterval(myVolumeData, 1000);
}

function myViewData() {
    if (player.getPlayerState() == 1) {
        sendViewData();
    } else {
        setTimeout(()=>{console.log("hello! Not playing")}, 5000);
    }
}

async function myEventData() {
    const currentFocusState = document.hasFocus();
    if ((preFocusState != currentFocusState)&&(!preFocusState)) {
        console.log("WelcomeBack!");
        sendEventData("FOCUS", "GETBACK");
    } else if ((preFocusState != currentFocusState)&&(preFocusState)) {
        console.log("Turning Blur!");
        sendEventData("BLUR", "GETOUT");
    } else {
        console.log("keeping state");
    }
    preFocusState = currentFocusState;
}

async function myVolumeData() {
    currentVolume = player.getVolume();
    if (currentVolume > preVolume) { 
        console.log('Volume UP!') 
        sendEventData("FOCUS", "VOLUMNUP");
    } else if (currentVolume < preVolume){
        console.log("Volume Down")
        sendEventData("BLUR", "VOLUMNDOWN");
    } else {
    }
    preVolume = currentVolume;
}

 // 5. The API calls this function when the player's state changes.
 //    The function indicates that when playing a video (state=1),
 //    the player should play for six seconds and then stop.
 var done = false;
 function onPlayerStateChange(event) {
   if (event.data == -1) { var readyState = true; console.log('!!');}
   document.getElementsByTagName('p')[1].innerText = event.data;
   document.getElementsByTagName('p')[2].innerText = player.getCurrentTime();

   if ((readyState == true)) {
     console.log('첫 시작');
     readyState = false;
   } else if (event.data == 1) {
     console.log('재생 중', player.getCurrentTime());
   } else {
     console.log('멈춤');
   }
 }

// * //////////////////////////////////////////////////////
// * //////////////////////////////////////////////////////
// *  Requesting Composer REST API with Payload
// *  params: data
// *  result: Boolean
// * //////////////////////////////////////////////////////
// * //////////////////////////////////////////////////////

function sendEventData(eventAction, eventLabel){
   var tsNew = new Date().getTime()
   var refUrl = (document.referrer == "") ? "https://www.google.co.kr": document.referrer;
   var data = JSON.stringify({
    "$class": "org.platform.data.EventData",
    "eventId": "E-"+getCookie('uid')+"-"+tsNew.toString(),
    "uid": getCookie('uid'),
    "sid": getCookie('sid'),
    "gender": true,
    "age": 23,
    "url": document.URL,
    "referer": refUrl,
    "width": window.outerWidth,
    "height": window.outerHeight,
    "time": tsNew,
    "title": player.getVideoData()['title'],
    "channel": "JTBC",
    "duration": player.getDuration(),
    "uptime": player.getCurrentTime(),
    "action": eventAction,
    "label": eventLabel
  });
  console.log(data);
  apiName = "EventData";  
  sendData(data, apiName);
}

function sendViewData(){
    var tsNew = new Date().getTime()
    var data = JSON.stringify({
     "$class": "org.platform.data.ViewData",
     "dataId": "V-"+getCookie('uid')+"-"+tsNew.toString(),
     "uid": getCookie('uid'),
     "sid": getCookie('sid'),
     "gender": true,
     "age": 23,
     "url": document.URL,
     "referer": document.referrer,
     "width": window.outerWidth,
     "height": window.outerHeight,
     "time": tsNew,
     "title": player.getVideoData()['title'],
     "channel": "JTBC",
     "duration": player.getDuration(),
     "uptime": player.getCurrentTime(),
   });
   console.log(data);
   apiName = "ViewData";
   sendData(data, apiName);
};

function sendData(data, apiName) {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) { console.log(this.responseText);}
    });

    xhr.open("POST", "http://localhost:3000/api/"+apiName);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Accept", "application/json");
    
    xhr.send(data);
}

// * //////////////////////////////////////////////////////
// * 끝
// * //////////////////////////////////////////////////////
 

// var vs = document.getElementsByTagName("iframe")[0].contentWindow.document.getElementsByTagName("video")[0];

console.log(navigator.userAgent);
console.log(navigator.language);
console.log(document.URL);
console.log(document.referrer);
console.log(document.title);
console.log(window.history.length);
console.log(window.outerWidth, window.outerHeight);
console.log(new Date().getTime());

// var v = document.getElementsByTagName("video")[0];

// console.log("vs!", vs);

// var currentVolumn = v.volume;

// v.onvolumechange = () => {
// if (v.volume > currentVolumn) { 
//     console.log('Vol UP!') 
// } else if (v.volume < currentVolumn){
//     console.log("Vol Down")
// } else if (v.muted) {
//     console.log("muted!")
// } else { console.log('unmuted!')}
//     console.log(v.volume);
//     currentVolumn = v.volume;
// }




// v.onplay = () => {
//     console.log('onplay',v.currentTime);
// }


// c_time = v.currentTime
// v.onseeking = () => {
//     console.log('seeking', v.currentTime);
// }
// var times = new Date().getTime()
// var a_data = {
//     user_agent:navigator.userAgent,
//     user_uid:getCookie("ga"),
//     timestamp: times,
// }

// const url = 'http://127.0.0.1:5000/view'
// let params = {
//     method: "POST",
//     headers: {
//         'Accept': 'application/json, text/plain, */*',
//         'Content-Type': 'application/json'
//     },
//     data: JSON.stringify(a_data)
// }
// fetch(url, params)
// .then((response)=>{console.log(params)})
// .catch((err)=>{console.log(err)})


// var settings = {
//     "async": true,
//     "crossDomain": true,
//     "url": "http://127.0.0.1:5000/view",
//     "method": "POST",
//     "headers": {
//         "Content-Type": "application/json"
//     },
//     "processData": false,
//     "data": JSON.stringify(a_data)
//     }
    
// $.ajax(settings).done(function (response) {
// console.log(response);
// });