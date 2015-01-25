// youtube player controls:

var _trigger = document.getElementById('controls-trigger');
var _controls = document.getElementById('controls-panel');

_trigger.onclick = function(event){
  event.preventDefault();
  if(_controls.classList.contains('show')){
    _controls.classList.remove('show');
    this.innerHTML = this.getAttribute('data-open-text');
  }
  else {
    _controls.classList.add('show');
    this.innerHTML = this.getAttribute('data-close-text');
  }
};



// https://developers.google.com/youtube/iframe_api_reference

// global variable for the player
var player;

// this function gets called when API is ready to use
function onYouTubePlayerAPIReady() {
  // create the global player from the specific iframe (#video)
  player = new YT.Player('ytvideo', {
    events: {
      // call this function when player is ready to use
      'onReady': onPlayerReady,
      // call this function when player changes state
      'onStateChange': onPlayerStateChange
    }
  });
}

var playPauseButton = document.getElementById("ytplaypausebut");
var volMuteButton = document.getElementById("ytvolumemutebut");

function onPlayerReady(event) {
  
  if (player.isMuted()) player.unMute();

  // bind events
  playPauseButton.addEventListener("click", function() {
    if(player.getPlayerState()!=1){
      player.playVideo();
      this.innerHTML = this.getAttribute('data-text-play');
      this.classList.remove('icon-play2');
      this.classList.add('icon-pause');
    } else {
      player.pauseVideo();
      this.innerHTML = this.getAttribute('data-text-pause');
      this.classList.remove('icon-pause');
      this.classList.add('icon-play2');
    }
  });

  var stopButton = document.getElementById("ytstopbut");
  stopButton.addEventListener("click", function() {
    if(player.getPlayerState()==1) this.innerHTML = this.getAttribute('data-text-play');
    player.pauseVideo();
    player.seekTo("0");
    playPauseButton.classList.remove('icon-pause');
    playPauseButton.classList.add('icon-play2');
    
  });
  
  var fwButton = document.getElementById("ytforwardbut");
  fwButton.addEventListener("click", function() {
    var dur = player.getDuration();
    if (dur > 0) {
      var nt = Math.floor(dur * .2) + player.getCurrentTime();
      if (nt < dur) {
        player.seekTo(nt);
      } else {
        player.seekTo(dur);
      }
    }
  });

  var bwButton = document.getElementById("ytbackwardbut");
  bwButton.addEventListener("click", function() {
    var dur = player.getDuration();
    if (dur > 0) {
      var nt = player.getCurrentTime() - Math.floor(dur * .2);
      if (nt > 0) {
        player.seekTo(nt);
      } else {
        player.seekTo(0);
      }
    }
  });

  var volUpButton = document.getElementById("ytvolumeincreasebut");
  volUpButton.addEventListener("click", function() {
    var vol = player.getVolume();
    var nvol = "0";
    if (vol >= 0) {
      nvol = "20"
    }
    if (vol >= 20) {
      nvol = "40"
    }
    if (vol >= 40) {
      nvol = "60"
    }
    if (vol >= 60) {
      nvol = "80"
    }
    if (vol >= 80) {
      nvol = "100"
    }
    player.setVolume(nvol);  
  });

  var volDownButton = document.getElementById("ytvolumedecreasebut");
  volDownButton.addEventListener("click", function() {
    var vol = player.getVolume();
    var nvol = "100";
    if (vol <= 100) {
      nvol = "80"
    }
    if (vol <= 80) {
      nvol = "60"
    }
    if (vol <= 60) {
      nvol = "40"
    }
    if (vol <= 40) {
      nvol = "20"
    }
    if (vol <= 20) {
      nvol = "0"

    }
    player.setVolume(nvol);
    
  });

  volMuteButton.addEventListener("click", function() {
    if (player.isMuted()) {
      player.unMute();
      this.innerHTML = this.getAttribute('data-text-mute');
      this.classList.remove('icon-volume-medium');
      this.classList.add('icon-volume-mute2');
    } else {
      player.mute();
      this.innerHTML = this.getAttribute('data-text-unmute');
      this.classList.remove('icon-volume-mute2');
      this.classList.add('icon-volume-medium');
    }
  });

  updateTime();
  updateButtonState();

  setInterval(function() {
    updateTime();
  }, 500);

  setInterval(function() {
    updateButtonState();
  }, 250);
  
}

function updateButtonState() {
  if (player.isMuted()) {
    volMuteButton.innerHTML = volMuteButton.getAttribute('data-text-unmute');
    volMuteButton.classList.remove('icon-volume-mute2');
    volMuteButton.classList.add('icon-volume-medium');
  } else {
    volMuteButton.innerHTML = volMuteButton.getAttribute('data-text-mute');
    volMuteButton.classList.add('icon-volume-mute2');
    volMuteButton.classList.remove('icon-volume-medium');
  }
  if (player.getPlayerState() == 1) {
    playPauseButton.innerHTML = playPauseButton.getAttribute('data-text-pause');
    playPauseButton.classList.add('icon-pause');
    playPauseButton.classList.remove('icon-play2');
  }
  if (player.getPlayerState() == 2) {
    playPauseButton.innerHTML = playPauseButton.getAttribute('data-text-play');
    playPauseButton.classList.add('icon-play2');
    playPauseButton.classList.remove('icon-pause');
  }
  if(player.getPlayerState() == 0){
    playPauseButton.innerHTML = playPauseButton.getAttribute('data-text-play');
    playPauseButton.classList.add('icon-play2');
    playPauseButton.classList.remove('icon-pause');
  }
}

function onPlayerStateChange(event){
  updateButtonState();
  updateTime();
}

function prepTime(s) {
  var hours = Math.floor(s / 3600);
  var minutes = Math.floor(s / 60) - (hours * 60);
  var seconds = s - (hours * 3600) - (minutes * 60);
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;
  hours = (hours < 1) ? "" : hours + ":";
  return hours + minutes + ":" + seconds;
}

function updateTime() {
  var timespan = document.getElementById("ytplayertime");
  var timestr = timespan.getAttribute("data-time-text")
  var currTime = prepTime(Math.round(player.getCurrentTime()))
  var dur = prepTime(Math.round(player.getDuration()));
  var timeval = document.createTextNode(currTime + " " + timestr + " " + dur);

  if (timespan.firstChild) {
    var temp = timespan.firstChild;
    temp.parentNode.removeChild(temp);
  }
  timespan.appendChild(timeval);
}

// Inject YouTube API script
var tag = document.createElement('script');
tag.src = "//www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);