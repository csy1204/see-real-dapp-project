# 01. Javascript EventHandler

## 1. 유저 정보 수집
유저 정보는 크게 2가지로 쿠기, 세션 기반의 유저 정보와 HTML내부의 windows, document element 기반의 유저 정보로 나뉜다. 유입경로, 시청률, 도달률, 이탈률

### 1) Cookie, Session 정보
1. 쿠키 & 세션
    1. uid // 3개월 동안 보관하는 개인 정보 id
    2. sid // 세션마다 기록하는 id, New Session 기록 가능

### 2) Window, Document 정보
1. Navigator
    1. navigator.userAgent
    2. navigator.language
2. Document
    1. document.URL -> URL
    2. document.referrer -> Referrer
3. Window
    1. window.history.length
    2. window.outerWidth, window.outerHeight
4. Date: new Date().getTime()
5. jquery -> ipinfo.io
    1. ip info :json
    2. jQuery Dependency
```javascript
   $.get("http://ipinfo.io", function(response) {
        console.log(response);
    }, "jsonp")

    $.getJSON("https://jsonip.com?callback=?", function(data) {
                alert("Your IP address is :- " + data.ip);
            });
```

## 2. 플레이 정보 수집

1. 영상 자체 정보
    1. 전체 길이 v.duration
    2. 영상 제목 title
    3. 채널 channel
2. 영상 재생 정보 + 업타임
    1. 플레이 시작 - onplay v.currentTime
    2. 일시 정지 
    3. 볼륨 조정 - onvolumechange
    4. Seeking
    5. 영상 Focus, Blur 여부
3. 광고 클릭 정보
    1. 클릭 여부 판단


https://developers.google.com/youtube/iframe_api_reference?hl=ko#Events
