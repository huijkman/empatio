/*$(function(){
  //var previewBtn = document.body.querySelector('[data-role="preview-video"]');
  //previewBtn.addEventListener('click', AccessiblePlayer.startPreview);
  window.on('modal-active', AccessiblePlayer.startPreview);
});*/


window.onYouTubePlayerAPIReady = function () {
  AccessiblePlayer.startPreview();
  AccessiblePlayer.initYT();
};

var AccessiblePlayer = {
  initYT: function  () {
  //initializing YT iframe API
  var url = CustomYtp.ytPlaylistArray[0].url;
  var ytp = CustomYtp.ytGetInstances()[0];//document.getElementById(myytpid);
    CustomYtp.ytplayer = new YT.Player(ytp, {
      videoId: url,
      playerVars: {
          //controls: 0,
          wmode:'transparent',
          rel: 0
      },
      events: {
        //onReady: CustomYtp.onPlayerReady,
        onStateChange: CustomYtp.onPlayerStateChange
      }
    });
  },
  startPreview: function () {
    //loop through YTP player config instances and handle to YTP dispatcher
    var inst = CustomYtp.ytGetInstances();

    for (var i = 0; i < inst.length; i++) {
      CustomYtp.ytPlayerDispatch(inst[i], i);
    }
  }
};