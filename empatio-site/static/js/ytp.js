/*
  Adapted and edited from the original script by Q42
  2014-2015
*/
/***********************************
  Accessible Controls for the YouTube Embedded Video Player
  Copyright (c) 2010 Ken Petri, Web Accessibility Center, The Ohio State University

  ** Licensing **
  This work is licensed under the Creative Commons Attribution-Share Alike 3.0 United States License,
  which allows copying, distributing, and adapting this work for all purposes, including commercial
  ones, so long as attribution is maintained and derivative works are similarly licensed.
  Use is otherwise bound by U.S. Copyright law.
  To view a copy of this license, visit http://creativecommons.org/licenses/by-sa/3.0/us/
  This code uses Google YouTube JavaScript Player APIs (http://code.google.com/apis/youtube/js_api_reference.html),
  which are bound by their Terms of Service: http://code.google.com/apis/youtube/terms.html
  This code relies on SWFObject by Bobby van der Sluis (http://code.google.com/p/swfobject/),
  which maintains an MIT License: http://www.opensource.org/licenses/mit-license.php

  ** Compatibility **
  This code is known to work with Firefox 3+, Opera 9+, Safari 3+, Chrome 2+, IE 6+.
  It has been tested using only the keyboard in Windows and Mac
  and using the screen readers JAWS 10 (Windows, with Firefox and IE), NVDA (Windows, with Firefox) and VoiceOver (MacOS X.5, with Safari).
************************************/
var CustomYtp = {
  // Utility functions
  ytTrim: function(str) {
    var tempstr = str.replace(new RegExp("^\\s+"), "");
    return tempstr.replace(new RegExp("\\s+$"), "");
  },

  ytStopDefaultAction: function(event) {
    event.returnValue = false;
    if (typeof event.preventDefault != "undefined") {
      event.preventDefault();
    }
  },
  // get the instances of the player div to populate
  ytGetInstances: function() {
    var matchedArray = [];
    matchedArray = document.body.querySelectorAll('[data-role="yt-player"]');
    return matchedArray;
  },
  // Generic, cross-browser load and event listeners from Edwards and Adams, "JavaScript Anthology"
  ytAddLoadListener: function(fn) {
    if (typeof window.addEventListener != 'undefined') {
      window.addEventListener('load', fn, false);
    } else
    if (typeof document.addEventListener != 'undefined') {
      document.addEventListener('load', fn, false);
    } else
    if (typeof window.attachEvent != 'undefined') {
      window.attachEvent('onload', fn);
    } else {
      var oldfn = window.onload;
      if (typeof window.onload != 'function') {
        window.onload = fn;
      } else {
        window.onload = function() {
          oldfn();
          fn();
        };
      }
    }
  },

  ytAttachEventListener: function(target, eventType, functionRef, capture) {
    if (typeof target.addEventListener != "undefined") {
      target.addEventListener(eventType, functionRef, capture);
    } else
    if (typeof target.attachEvent != "undefined") {
      target.attachEvent("on" + eventType, functionRef);
    } else {
      eventType = "on" + eventType;
      if (typeof target[eventType] == "function") {
        var oldListener = target[eventType];
        target[eventType] = function() {
          oldListener();
          return functionRef();
        };
      } else {
        target[eventType] = functionRef;
      }
    }
    return true;
  },

  // Rendering functions
  ytPlayerBoxDraw: function(aspect, ytpbox, pid) {
    var width = "100%"; //"640px";
    /*vif (aspect == "normal") {
      width = "640px";
    } else if (aspect == "wide") {
      width = "1024px";
    }*/
    if (ytpbox) {
      ytpbox.style.width = width;
      var buttons = ['Play', 'Stop', 'Forward', 'Back', 'Volume up', 'Volume down', 'Mute', 'Loop']; //TODO translations
      var controls = document.createElement('div');
      controls.classList.add('ytcontrols');
      var semanticControlsTitle = document.createElement('p');
      semanticControlsTitle.classList.add('semantic');
      semanticControlsTitle.innerHTML = 'Player Controls';
      var controlsBtns = document.createElement('ul');
      controlsBtns.classList.add('ytplayerbuttons');
      for (var i = 0; i < buttons.length; i++) {
        var btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        btn.setAttribute('id', 'yt'+buttons[i].toLowerCase().split(' ').join('')+'but'+pid);
        btn.innerHTML = buttons[i];
        btn.classList.add(buttons[i].split(' ').join('-'));
        var li = document.createElement('li');
        li.appendChild(btn);
        controlsBtns.appendChild(li);
      };
      var currentTitle = document.createElement('p');
      currentTitle.innerHTML = 'Currently Playing:';
      var divTitle = document.createElement('span');
      divTitle.setAttribute('id', 'ytvidtitle'+pid);
      var elapsedTime = document.createElement('p');
      elapsedTime.innerHTML = 'Time: ';
      var time = document.createElement('span');
      time.setAttribute('id', 'ytplayertime'+pid);
      elapsedTime.appendChild(time);
      currentTitle.appendChild(divTitle);
      controls.appendChild(semanticControlsTitle);
      controls.appendChild(controlsBtns);
      controls.appendChild(currentTitle);
      controls.appendChild(elapsedTime);
      ytpbox.appendChild(controls);
    }
  },

  ytPlayerInit: function (list, aspect, ytbox, pid) {
    var width = "640";
    if (aspect == "normal") {
      width = "640";
    } else if (aspect = "wide") {
      width = "1024";
    }
    var ytmovurl = list[0].url;
    if (ytmovurl) {
      var ytpl = ytbox.querySelector("#ytplaybut" + pid);
      ytpl.addEventListener("click", function(e) {
        CustomYtp.ytplay(pid);
      });
      var ytf = ytbox.querySelector("#ytforwardbut" + pid);
      ytf.addEventListener("click", function() {
        CustomYtp.ytforward(pid);
      });
      var ytb = ytbox.querySelector("#ytbackbut" + pid);
      ytb.addEventListener("click", function() {
        CustomYtp.ytback(pid);
      });
      var yts = ytbox.querySelector("#ytstopbut" + pid);
      yts.addEventListener("click", function() {
        CustomYtp.ytstop(pid);
      });
      var ytvu = ytbox.querySelector("#ytvolumeupbut" + pid);
      ytvu.addEventListener("click", function() {
        CustomYtp.ytvolup(pid);
      });
      var ytvd = ytbox.querySelector("#ytvolumedownbut" + pid);
      ytvd.addEventListener("click", function() {
        CustomYtp.ytvoldown(pid);
      });
      var ytm = ytbox.querySelector("#ytmutebut" + pid);
      ytm.addEventListener("click", function() {
        CustomYtp.ytmute(pid);
      });
      var ytl = ytbox.querySelector("#ytloopbut" + pid);
      ytl.addEventListener("click", function() {
        CustomYtp.ytloop(pid);
      });
      //CustomYtp.ytPlayerLoad(ytmovurl, width, pid);
      var titlenode = ytbox.querySelector("#ytvidtitle" + pid);
      var titleval = document.createTextNode("\"" + list[0].text + "\"");
      titlenode.appendChild(titleval);
    }
    return; //TEMP
    // only create a playlist if more than one video is specified
    if (list.length > 1) {
      var listH = document.createElement("h3");
      listH.classList.add("playlisth");
      var listHText = document.createTextNode("Video playlist");
      listH.appendChild(listHText);
      ytp.appendChild(listH);
      var listUl = document.createElement("ul");
      listUl.classList.add("ytplaylistl");
      ytp.appendChild(listUl);
      for (var i = 0; i < list.length; i++) {
        var listLi = document.createElement("li");
        var listLink = document.createElement("a");
        listLink.href = "/";
        listLink.id = list[i].url;
        var listLinkText = document.createTextNode(list[i].text);
        listLink.appendChild(listLinkText);
        listLi.appendChild(listLink);
        listUl.appendChild(listLi);
        /*  Have to use old style event attachment.
            MS IE's event registration model uses attachEvent() method, which creates a reference to the
            function, instead of a copy (like other browsers addEventListener() method). */
        listLink.addEventListener('click', function() {
          //CustomYtp.ytLoadNewVideo(pid, this.id, this.firstChild.nodeValue)
        });
        //CustomYtp.ytAttachEventListener(listLink, "click", CustomYtp.ytStopDefaultAction, false);
      }
    }
  },
  ytPlaylistArray: [],
  ytPlayerDispatch: function (ytp, ytpid) {
    var self = this;
    if (ytp) {
      // get movie urls, titles, and other set up variables from page

      var ytPlayerAspect = "normal";
      var movpattern = /^ytmovieurl:.*$/;
      var movmatch = /^ytmovieurl:(.*)$/;
      var aspectpattern = /^ytplayeraspect:.*$/;
      var aspectmatch = /^ytplayeraspect:(.*)$/;

      var ytbox = document.body.querySelector('.ytplayerbox');
      var captions = ytbox.querySelectorAll('[data-url]');
      var aspects = ytbox.querySelectorAll('[data-ratio]');
      for (var i = 0; i < captions.length; i++) {
        var url = captions[i].getAttribute('data-url');
        if (movpattern.test(url)) {
          var str = url;
          var yturl = CustomYtp.ytTrim(str.replace(movmatch, "$1"));
          var yttext = CustomYtp.ytTrim(captions[i].innerHTML);
          var ytlistobj = {
            url: yturl,
            text: yttext
          };
          self.ytPlaylistArray.push(ytlistobj);
        }
      }
      if(aspects) {
        for (var i = 0; i < aspects.length; i++) {
          var ratio = aspects[i].getAttribute('data-ratio');
          if (aspectpattern.test(ratio)) {
            var str = ratio;
            ytPlayerAspect = CustomYtp.ytTrim(str.replace(aspectmatch, "$1"));
          }
        }
      }
      CustomYtp.ytPlayerBoxDraw(ytPlayerAspect, ytbox, ytpid);
      CustomYtp.ytPlayerInit(self.ytPlaylistArray, ytPlayerAspect, ytbox, ytpid);
      /*setInterval(function() {
        CustomYtp.updateButtonState(ytpid);
      }, 250);
      setInterval(function() {
        CustomYtp.updateTime(ytpid);
      }, 500);*/
    }
  },

  // YouTube API-specific code
  ytplayer: null,

  onPlayerStateChange: function(event){
    CustomYtp.updateButtonState(0);
    CustomYtp.updateTime(0);
  },
  onPlayerReady: function(event){
    console.log('yt player ready', event);
  },

  updateButtonState: function (ytpid) {
    var ytp = document.querySelector('.ytplayerbox');
    var player = this.ytplayer;
    var mutebut = ytp.querySelector("#ytmutebut" + ytpid);
    var playbut = ytp.querySelector("#ytplaybut" + ytpid);
    if (player.isMuted()) {
      mutebut.innerHTML = "Unmute";
    } else {
      mutebut.innerHTML = "Mute";
    }
    if (player.getPlayerState() == 1) {
      playbut.innerHTML = _i8n.s('PlayerPauseBtn');
      ytp.classList.add('playing');
    }
    if (player.getPlayerState() == 2) {
      playbut.innerHTML = _i8n.s('PlayerPlayBtn');
    }
    if(player.getPlayerState() == 0){
      ytp.classList.remove('playing');
    }
  },

  prepTime: function (s) {
    var hours = Math.floor(s / 3600);
    var minutes = Math.floor(s / 60) - (hours * 60);
    var seconds = s - (hours * 3600) - (minutes * 60);
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    hours = (hours < 1) ? "" : hours + ":";
    return hours + minutes + ":" + seconds;
  },

  updateTime: function (ytpid) {
    var ytp = document.getElementById("thisytp" + ytpid);
    var player = CustomYtp.ytplayer;
    //if (new RegExp('^(' + CustomYtp.ytplayer.join('|') + ')$').test(ytp.id)) {
      var timespan = document.getElementById("ytplayertime" + ytpid);
      var currTime = CustomYtp.prepTime(Math.round(player.getCurrentTime()))
      var dur = CustomYtp.prepTime(Math.round(player.getDuration()));
      var timeval = document.createTextNode(currTime + " of " + dur);

      if (timespan.firstChild) {
        var temp = timespan.firstChild;
        temp.parentNode.removeChild(temp);
      }
      timespan.appendChild(timeval);
    //}
  },
  ytLoopInterval: [],
  ytloop: function (ytpid) {
    var ytp = document.getElementById("thisytp" + ytpid);
    //if (new RegExp('^(' + CustomYtp.ytplayer.join('|') + ')$').test(ytp.id)) {
      var loopbut = document.getElementById("ytloopbut" + ytpid);
      if (loopbut.firstChild.nodeValue == "Loop") {
        loopbut.firstChild.nodeValue = "UnLoop";
        CustomYtp.ytLoopInterval[ytpid] = window.setInterval(function() {
          ytp.playVideo();
        }, 2000);
      } else {
        loopbut.firstChild.nodeValue = "Loop";
        clearInterval(CustomYtp.ytLoopInterval[ytpid]);
      }
    //}
  },

  ytmute: function (ytpid) {
    var ytp = document.getElementById("thisytp" + ytpid);
    //if (new RegExp('^(' + CustomYtp.ytplayer.join('|') + ')$').test(ytp.id)) {
      if (CustomYtp.ytplayer.isMuted()) {
        CustomYtp.ytplayer.unMute();
      } else {
        CustomYtp.ytplayer.mute();
      }
    //}
  },

  ytvolup: function (ytpid) {
    var ytp = document.getElementById("thisytp" + ytpid);
    //if (new RegExp('^(' + CustomYtp.ytplayer.join('|') + ')$').test(ytp.id)) {
      var vol = CustomYtp.ytplayer.getVolume();
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
      CustomYtp.ytplayer.setVolume(nvol);
    //}
  },

  ytvoldown: function (ytpid) {
    var ytp = document.getElementById("thisytp" + ytpid);
    //if (new RegExp('^(' + CustomYtp.ytplayer.join('|') + ')$').test(ytp.id)) {
      var vol = CustomYtp.ytplayer.getVolume();
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
      CustomYtp.ytplayer.setVolume(nvol);
    //}
  },

  ytplay: function (ytpid) {
    var ytp = document.getElementById("thisytp" + ytpid);
    var parent = document.querySelector('.ytplayerbox');
    //if (new RegExp('^(' + CustomYtp.ytplayer.join('|') + ')$').test(ytp.id)) {
    if (CustomYtp.ytplayer.getPlayerState() == "1") {
      parent.classList.remove('playing');
      CustomYtp.ytplayer.pauseVideo();
    } else {
      CustomYtp.playVideo();
      parent.classList.add('playing');
    }
    //}
  },

  ytstop: function (ytpid) {
    var ytp = document.getElementById("thisytp" + ytpid);
    if (new RegExp('^(' + CustomYtp.ytplayer.join('|') + ')$').test(ytp.id)) {
      ytp.pauseVideo();
      ytp.seekTo("0");
    }
  },

  ytforward: function (ytpid) {
    var ytp = document.getElementById("thisytp" + ytpid);
    if (new RegExp('^(' + CustomYtp.ytplayer.join('|') + ')$').test(ytp.id)) {
      var dur = ytp.getDuration();
      if (dur > 0) {
        var nt = Math.floor(dur * .2) + ytp.getCurrentTime();
        if (nt < dur) {
          ytp.seekTo(nt);
        } else {
          ytp.seekTo(dur);
        }
      }
    }
  },

  ytback: function (ytpid) {
    var ytp = document.getElementById("thisytp" + ytpid);
    if (new RegExp('^(' + CustomYtp.ytplayer.join('|') + ')$').test(ytp.id)) {
      var dur = ytp.getDuration();
      if (dur > 0) {
        var nt = ytp.getCurrentTime() - Math.floor(dur * .2);
        if (nt > 0) {
          ytp.seekTo(nt);
        } else {
          ytp.seekTo(0);
        }
      }
    }
  },

  ytLoadNewVideo: function (ytpid, url, titleval) {
    var ytp = document.getElementById("thisytp" + ytpid);
    if (new RegExp('^(' + CustomYtp.ytplayer.join('|') + ')$').test(ytp.id)) {
      ytp.loadVideoById(url, 0);
      var titlenode = document.getElementById("ytvidtitle" + ytpid);
      if (titlenode.firstChild) {
        var temp = titlenode.firstChild;
        temp.parentNode.removeChild(temp);
      }
      var title = document.createTextNode(titleval);
      titlenode.appendChild(title);
    }
  },

  ytPlayerLoad: function (ytmovurl, width, pid) {
    var myytpid = "thisytp" + pid;
    var ytp = document.getElementById(myytpid);

    var self = this;
  }
}