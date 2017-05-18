/**
 * Created by liuwanlin on 2017/5/19.
 */
var willPlayDataDic = {};
var erroFrameCount= 0;
var downloadProgres = 0;
var playProgres = 0;
var loadTimer=null;
var PlayTimer=null;

$(function () {
    if(detectOS()=='Mac'){
        $('#playWindow').css({'width':740,'height':535,'font-family':'monospace','font-size':12});
    }

    $('#changeThem').click(function () {
        if($('body').attr("class")=='lightThem'){
            $('body').attr("class","darckThem");
            $(this).attr("value","开灯");
            $('#playWindow').css({'background-color':'rgba(0,0,0,0.6)','box-shadow':'0 0 30px red',
                'border':'1px solid red'});
            $('#controlDiv').css({'background-color':'rgba(0,0,0,0.6)','box-shadow':'0 0 30px red',
                'border':'1px solid red'});
        }else {
            $('body').attr("class","lightThem");
            $(this).attr("value","关灯");
            $('#playWindow').css({'background-color':'rgba(255,255,255,0.6)','box-shadow':'0 0 10px black',
                'border':'1px solid black'});
            $('#controlDiv').css({'background-color':'rgba(255,255,255,0.8)','box-shadow':'0 0 10px black',
                'border':'1px solid black'});
        }
    });
    $('#playButton').click(function () {
        play();
    });
    $('#stopButton').click(function () {
        stopPlay();
    });
    var a = 0;
    loadTimer = setInterval(function () {
        a += 1;
        var httprequest = new XMLHttpRequest();
        var url = "BadAppleText/" + a + ".html";
        httprequest.index = a;
        httprequest.erroCount=0;
        getData(url,httprequest);
        if (a==6574){
            clearInterval(loadTimer);
        }
    },1);

});

//缓冲数据
function getData(url,httprequest) {
    var errorText =  document.getElementById("errorText");
    var downloadProgressDiv = document.getElementById("downloadProgress");
    var downloadProgressText = document.getElementById("downloadProgressText");
    httprequest.open("GET", url, true);
    httprequest.send(null);
    httprequest.onreadystatechange = function () {
        if (this.readyState == 4) {
            if(this.status==200){
                willPlayDataDic[""+this.index]=this.responseText;
                downloadProgres+=1;
                downloadProgressDiv.style.width = parseFloat(downloadProgres)/6574.0*100+"%";
                downloadProgressText.innerHTML = "缓冲进度:"+downloadProgres+"/6574 【"+ (downloadProgres/6574.0*100).toFixed(2)+"%】";
                if(httprequest.erroCount!=0){
                    erroFrameCount--;
                }
            }else{
                if(httprequest.erroCount==0){
                    erroFrameCount++;
                    errorText.innerHTML = "获取失败的帧："+erroFrameCount;
                }
                if (httprequest.erroCount+1<4){
                    httprequest.erroCount++;
                    getData(url,httprequest);
                }
            }
        }
    };
}

//停止
function stopPlay() {
    var playProgressDiv = document.getElementById("playProgress");
    var playProgressText = document.getElementById("playProgressText");
    var musicPlayer = document.getElementById("musicPlayer");
    var playWindow = document.getElementById("playWindow");
    musicPlayer.pause();
    $('#playButton').attr("src","images/play.png");
    musicPlayer.currentTime=0;
    clearInterval(PlayTimer);
    playProgres = 0;
    playProgressDiv.style.width = parseFloat(playProgres)/6754.0*100+"%";
    playProgressText.innerHTML = "播放进度:"+playProgres+"/6574 【"+ (playProgres/6574.0*100).toFixed(2)+"%】";
    playWindow.innerHTML=willPlayDataDic["1"];
}

//播放
function play() {
    var playProgressDiv = document.getElementById("playProgress");
    var playProgressText = document.getElementById("playProgressText");
    var musicPlayer = document.getElementById("musicPlayer");
    var playWindow = document.getElementById("playWindow");
    $('#playButton').attr("src","images/pause.png");
    if (!musicPlayer.paused){
        musicPlayer.pause();
        $('#playButton').attr("src","images/play.png");
        clearInterval(PlayTimer);
        return;
    }
    PlayTimer = setInterval(function () {
        if (playProgres==downloadProgres){
            musicPlayer.pause();
            $('#playButton').attr("src","images/play.png");
            clearInterval(PlayTimer);
            return;
        }
        if (musicPlayer.paused){
            musicPlayer.play();
        }else {
            playProgres++;
            playWindow.innerHTML = willPlayDataDic[""+playProgres];
            playProgressDiv.style.width = parseFloat(playProgres)/6574.0*100+"%";
            playProgressText.innerHTML = "播放进度:"+playProgres+"/6574 【"+ (playProgres/6574.0*100).toFixed(2)+"%】";
        }
        if (playProgres==6574){
            playProgres = 0;
            $('#playButton').attr("src","images/play.png");
            musicPlayer.pause();
            musicPlayer.currentTime=0;
            playWindow.innerHTML=willPlayDataDic["1"];
            clearInterval(PlayTimer);
        }
    },33);
}

//获取操作系统
function detectOS() {
    var sUserAgent = navigator.userAgent;
    var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
    var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
    if (isMac) return "Mac";
    var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
    if (isUnix) return "Unix";
    var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
    if (isLinux) return "Linux";
    if (isWin) {
        var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
        if (isWin2K) return "Win2000";
        var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
        if (isWinXP) return "WinXP";
        var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
        if (isWin2003) return "Win2003";
        var isWinVista= sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
        if (isWinVista) return "WinVista";
        var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
        if (isWin7) return "Win7";
    }
    return "other";
}