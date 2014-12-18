//start playing audio
function MediaPlayer(type){
  this.init = function(){
    this.$player = document.body.querySelector('#people').querySelector('.player');
    this.$play = this.$player.querySelector('.button-play-pause');
    this.media = this.$player.querySelector(type);
    this.playing = false;

    var player = this;
    this.$play.addEventListener('click', function(e){
      player.playPause(e);
    });
  }

  this.open = function(src){
    this.media.src = src
  }

  this.playPause = function(e){
    if(!this.media.src) return;
    if(!(this.playing=!this.playing)) this.media.pause();
    else {
      this.media.play();
      generateOutput();
    }
    this.$player.classList[this.playing?'add':'remove']('playing');
  };
}

$(function(){
  var audio = new MediaPlayer('audio');
  if(document.body.querySelector('#people').querySelector('.player')) {
    audio.init();
    audio.open('https://drive.google.com/uc?id=0B0B0kv_R-fDsYXlzM1pOaDZVWUU&authuser=0&export=download');
  }
});

//recognize the output with speech API
function generateOutput(){
  //first, detect permission to use microphone
  navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

  if (navigator.getUserMedia) {
    navigator.getUserMedia ({
      audio: true
    },

    // if user allows using mic, successCallback
    function(localMediaStream) {
      //start recognizing speech and output recognized text
      return Speech.recognize().then(function(text) {
      //ideally we want to generate a text file with output
        console.log(text);
      });
    },

    // errorCallback
    function(err) {
      console.log("The following error occured: " + err);
    });
  } else {
     console.log("getUserMedia not supported");
  }

}

//an instance of a primise obj
var promise = new Promise(function(resolve) {
  resolve();
});

//speech API constructor
var Speech = {
   speak: function(text) {
      return new Promise(function(resolve, reject) {
         if (!SpeechSynthesisUtterance) {
            reject('API not supported');
         }

         var utterance = new SpeechSynthesisUtterance(text);

         utterance.addEventListener('end', function() {
            console.log('Synthesizing completed');
            resolve();
         });

         utterance.addEventListener('error', function (event) {
            console.log('Synthesizing error');
            reject('An error has occurred while speaking: ' + event.error);
         });

         console.log('Synthesizing the text: ' + text);
         speechSynthesis.speak(utterance);
      });
   },
   recognize: function() {
      return new Promise(function(resolve, reject) {
         var SpeechRecognition = SpeechRecognition        ||
                                 webkitSpeechRecognition  ||
                                 null;

         if (SpeechRecognition === null) {
            reject('API not supported');
         }

         var recognizer = new SpeechRecognition();
         recognizer.lang = 'nl-NL';
         recognizer.continuous = true;
         recognizer.interimResults = true;

         recognizer.addEventListener('result', function (event) {
            console.log('Recognition completed');
            for (var i = event.resultIndex; i < event.results.length; i++) {
               if (event.results[i].isFinal) {
                  resolve(event.results[i][0].transcript);
               }
            }
         });

         recognizer.addEventListener('error', function (event) {
            console.log('Recognition error' + event.error);
            reject('An error has occurred while recognizing: ' + event.error);
         });

         recognizer.addEventListener('nomatch', function (event) {
            console.log('Recognition ended because of nomatch');
            reject('Error: sorry but I could not find a match');
         });

         recognizer.addEventListener('end', function (event) {
            console.log('Recognition ended', event);
            // If the Promise isn't resolved or rejected at this point
            // the demo is running on Chrome and Windows 8.1 (issue #428873).
            reject('Error: sorry but I could not recognize your speech');
         });

         console.log('Recognition started');
         recognizer.start();
      });
   }
};