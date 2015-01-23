var lang = document.querySelector('html').getAttribute('lang');
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

function onPlayerReady(event) {
  
  if (player.isMuted()) player.unMute();

  // bind events
  var playPauseButton = document.getElementById("ytplaypausebut");
  playPauseButton.addEventListener("click", function() {
    changeBtnVal(this);
    if(player.getPlayerState()!=1){
      player.playVideo();
      this.classList.remove('icon-play2');
      this.classList.add('icon-pause');
    } else {
      player.pauseVideo();
      this.classList.remove('icon-pause');
      this.classList.add('icon-play2');
    }
  });

  function changeBtnVal(btn){
    var currentVal = btn.innerHTML;
      btn.innerHTML = btn.getAttribute('data-alt-text');
      btn.setAttribute('data-alt-text',currentVal);
  }

  var stopButton = document.getElementById("ytstopbut");
  stopButton.addEventListener("click", function() {
    if(player.getPlayerState()==1) changeBtnVal(playPauseButton);
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

  var volMuteButton = document.getElementById("ytvolumemutebut");
  volMuteButton.addEventListener("click", function() {
    changeBtnVal(volMuteButton);
    if (player.isMuted()) {
      player.unMute();
      this.classList.remove('icon-volume-medium');
      this.classList.add('icon-volume-mute2');
    } else {
      player.mute();
      this.classList.remove('icon-volume-mute2');
      this.classList.add('icon-volume-medium');
    }
  });

  updateTime();

  setInterval(function() {
    updateTime();
  }, 500);
  
}

function updateButtonState() {
    alert('bla');
  if (player.isMuted()) {
    mutebut.classList.remove('icon-volume-mute2');
    mutebut.classList.add('icon-volume-medium');
  } else {
    mutebut.classList.add('icon-volume-mute2');
    mutebut.classList.remove('icon-volume-medium');
  }
  if (player.getPlayerState() == 1) {
    playPauseButton.classList.remove('icon-pause');
    playPauseButton.classList.add('icon-play2');
  }
  if (player.getPlayerState() == 2) {
    playbut.classList.add('icon-play2');
    playbut.classList.remove('icon-pause');
  }
  if(player.getPlayerState() == 0){
    playbut.classList.add('icon-play2');
    playbut.classList.remove('icon-pause');
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