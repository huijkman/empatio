$(function(){
  var previewBtn = document.body.querySelector('[data-role="preview-video"]');
  previewBtn.addEventListener('click', AccessiblePlayer.startPreview);

});

window.onYouTubePlayerReady = function (playerId) {
  console.log(playerId);
  CustomYtp.ytplayer.push(playerId);
}

var AccessiblePlayer = {
  init: function(){},
  startPreview: function () {

    this.classList.add('hidden');
    //loop through YTP player config instances and handle to YTP dispatcher
    var inst = CustomYtp.ytGetInstances();

    for (var i = 0; i < inst.length; i++) {
      CustomYtp.ytPlayerDispatch(inst[i], i);
    }
  }
};