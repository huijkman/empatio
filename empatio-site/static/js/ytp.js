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
    matchedArray = document.body.querySelectorAll('.ytplayerbox');
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
      ytpbox.innerHTML = "<div class=\"video-container\"><div id=\"ytapiplayer" + pid + "\">" +
        "You need Flash player 8+ and JavaScript enabled to view this video." +
        "<\/div><\/div>" +
        "<div class=\"ytcontrols group\">" +
        "<h3 class=\"semantic\">Acessible Player Controls<\/h3>" +
        "<ul class=\"ytplayerbuttons\">" +
        "<li><button type=\"button\" class=\"icon-btn button-play-pause\" id=\"ytplaybut" + pid + "\">Play<\/button><\/li>" +
        "<li><button type=\"button\" class=\"icon-btn button-forward\" id=\"ytforwardbut" + pid + "\">Forward 20%<\/button><\/li>" +
        "<li><button type=\"button\" class=\"icon-btn button-back\" id=\"ytbackbut" + pid + "\">Back 20%<\/button><\/li>" +
        "<li><button type=\"button\" class=\"icon-btn button-stop\" id=\"ytstopbut" + pid + "\">Stop<\/button><\/li>" +
        "<li><button type=\"button\" class=\"icon-btn button-volume-up\" id=\"ytvolupbut" + pid + "\">Volume Up<\/button><\/li>" +
        "<li><button type=\"button\" class=\"icon-btn button-volume-down\" id=\"ytvoldownbut" + pid + "\">Volume Down<\/button><\/li>" +
        "<li><button type=\"button\" class=\"icon-btn button-mute\" id=\"ytmutebut" + pid + "\">Mute<\/button><\/li>" +
        //"<li><button type=\"button\" class=\"button-loop\" id=\"ytloopbut" + pid + "\">Loop<\/button><\/li>" +
        "<\/ul>" +
        "<h4 class=\"pull-left\">Currently Playing: <span id=\"ytvidtitle" + pid + "\"><\/span><\/h4>" +
        "<h4 class=\"pull-right\">Time: <span id=\"ytplayertime" + pid + "\"><\/span><\/h4>" +
        "<\/div>";
    }
  },

  ytPlayerInit: function (list, aspect, ytp, pid) {
    var width = "640";
    if (aspect == "normal") {
      width = "640";
    } else if (aspect = "wide") {
      width = "1024";
    }
    var ytmovurl = list[0].url;
    if (ytmovurl) {
      var ytpl = document.getElementById("ytplaybut" + pid);
      ytpl.addEventListener("click", function(e) {
        CustomYtp.ytplay(pid);
      });
      var ytf = document.getElementById("ytforwardbut" + pid);
      ytf.addEventListener("click", function() {
        CustomYtp.ytforward(pid);
      });
      var ytb = document.getElementById("ytbackbut" + pid);
      ytb.addEventListener("click", function() {
        CustomYtp.ytback(pid);
      });
      var yts = document.getElementById("ytstopbut" + pid);
      yts.addEventListener("click", function() {
        CustomYtp.ytstop(pid);
      });
      var ytvu = document.getElementById("ytvolupbut" + pid);
      ytvu.addEventListener("click", function() {
        CustomYtp.ytvolup(pid);
      });
      var ytvd = document.getElementById("ytvoldownbut" + pid);
      ytvd.addEventListener("click", function() {
        CustomYtp.ytvoldown(pid)
      });
      var ytm = document.getElementById("ytmutebut" + pid);
      ytm.addEventListener("click", function() {
        CustomYtp.ytmute(pid)
      });
      // var ytl = document.getElementById("ytloopbut" + pid);
      // ytl.addEventListener("click", function() {
      //   CustomYtp.ytloop(pid)
      // });
      CustomYtp.ytPlayerLoad(ytmovurl, width, pid);
      var titlenode = document.getElementById("ytvidtitle" + pid);
      var titleval = document.createTextNode("\"" + list[0].text + "\"");
      titlenode.appendChild(titleval);
    }
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
          CustomYtp.ytLoadNewVideo(pid, this.id, this.firstChild.nodeValue)
        });
        CustomYtp.ytAttachEventListener(listLink, "click", CustomYtp.ytStopDefaultAction, false);
      }
    }
  },

  ytPlayerDispatch: function (ytp, ytpid) {
    if (ytp) {
      // get movie urls, titles, and other set up variables from page
      var ytPlaylistArray = [];
      var ytPlayerAspect = "normal";
      var movpattern = /^ytmovieurl:.*$/;
      var movmatch = /^ytmovieurl:(.*)$/;
      var aspectpattern = /^ytplayeraspect:.*$/;
      var aspectmatch = /^ytplayeraspect:(.*)$/;
      var captions = ytp.querySelectorAll('[data-url]');
      var aspects = ytp.querySelectorAll('[data-ratio]')
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
          ytPlaylistArray.push(ytlistobj);
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
      CustomYtp.ytPlayerBoxDraw(ytPlayerAspect, ytp, ytpid);
      CustomYtp.ytPlayerInit(ytPlaylistArray, ytPlayerAspect, ytp, ytpid);
      setInterval(function() {
        CustomYtp.updateButtonState(ytpid);
      }, 250);
      setInterval(function() {
        CustomYtp.updateTime(ytpid);
      }, 500);
    }
  },

  // YouTube API-specific code
  ytplayer: [],

  updateButtonState: function (ytpid) {
    var ytp = document.getElementById("thisytp" + ytpid);
    var player = document.querySelector('.ytplayerbox'); //ytp.parentNode;
    if (new RegExp('^(' + CustomYtp.ytplayer.join('|') + ')$').test(ytp.id)) {
      var mutebut = document.getElementById("ytmutebut" + ytpid);
      var playbut = document.getElementById("ytplaybut" + ytpid);
      if (ytp.isMuted()) {
        mutebut.innerHTML = "Unmute";
        player.classList.add('muted');
      } else {
        mutebut.innerHTML = "Mute";
        player.classList.remove('muted');
      }
      if (ytp.getPlayerState() == 1) {
        playbut.innerHTML = _i8n.s('PlayerPauseBtn');
        player.classList.add('playing');
      }
      if (ytp.getPlayerState() == 2) {
        playbut.innerHTML = _i8n.s('PlayerPlayBtn');
      }
      if(ytp.getPlayerState() == 0){
        player.classList.remove('playing');
      }
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
    if (new RegExp('^(' + CustomYtp.ytplayer.join('|') + ')$').test(ytp.id)) {
      var timespan = document.getElementById("ytplayertime" + ytpid);
      var timeval = document.createTextNode(CustomYtp.prepTime(Math.round(ytp.getCurrentTime())) + " of " + CustomYtp.prepTime(Math.round(ytp.getDuration())));

      if (timespan.firstChild) {
        var temp = timespan.firstChild;
        temp.parentNode.removeChild(temp);
      }
      timespan.appendChild(timeval);
    }
  },
  ytLoopInterval: [],
  ytloop: function (ytpid) {
    var ytp = document.getElementById("thisytp" + ytpid);
    if (new RegExp('^(' + CustomYtp.ytplayer.join('|') + ')$').test(ytp.id)) {
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
    }
  },

  ytmute: function (ytpid) {
    var ytp = document.getElementById("thisytp" + ytpid);
    if (new RegExp('^(' + CustomYtp.ytplayer.join('|') + ')$').test(ytp.id)) {
      if (ytp.isMuted()) {
        ytp.unMute();
      } else {
        ytp.mute();
      }
    }
  },

  ytvolup: function (ytpid) {
    var ytp = document.getElementById("thisytp" + ytpid);
    if (new RegExp('^(' + CustomYtp.ytplayer.join('|') + ')$').test(ytp.id)) {
      var vol = ytp.getVolume();
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
      ytp.setVolume(nvol);
    }
  },

  ytvoldown: function (ytpid) {
    var ytp = document.getElementById("thisytp" + ytpid);
    if (new RegExp('^(' + CustomYtp.ytplayer.join('|') + ')$').test(ytp.id)) {
      var vol = ytp.getVolume();
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
      ytp.setVolume(nvol);
    }
  },

  ytplay: function (ytpid) {
    var ytp = document.getElementById("thisytp" + ytpid);
    var parent = document.querySelector('.ytplayerbox'); //ytp.parentNode;
    if (new RegExp('^(' + CustomYtp.ytplayer.join('|') + ')$').test(ytp.id)) {
      if (ytp.getPlayerState() == "1") {
        parent.classList.remove('playing');
        ytp.pauseVideo();
      } else {
        ytp.playVideo();
        parent.classList.add('playing');
      }
    }
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
  // Player embedding code. Uses SWFObject library.
  // Start with YouTube video default, non-letterbox width of 480x360 (letter is 640x360)
  // Add chrome on YouTube player: 24px high
  // cc_load_policy param turns captions on by default, since there is no JavaScript equiv. for doing that
  // "hd=1" attempts loading high def
  // "rel=0" turns off YT search and relative links
  // "fs=1" allows for full-screen button (no JavaScript equiv.)
  ytPlayerLoad: function (ytmovurl, width, pid) {
    var myytpid = "thisytp" + pid;
    var myytapiplayer = "ytapiplayer" + pid;
    var ytparams = {
      allowScriptAccess: "always",
      allowFullScreen: "true",
      cc_load_policy: "1",
      hd: "1"
    };
    var ytatts = {
      id: myytpid
    };
    swfobject.embedSWF("http://www.youtube.com/v/" +
      ytmovurl +
      "&enablejsapi=1&playerapiid=" + myytpid + "&hd=1&rel=0&fs=1", myytapiplayer, width, "384", "8", null, null, ytparams, ytatts);
  }
}