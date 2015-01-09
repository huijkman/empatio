var _i8n = new function Translations (){
  var me = this, lib = Terms;

  this.available = {
    nl: 'Nederlands',
    en: 'English'
  };

  this.init = function () {
    var lang = document.documentElement.lang;
    setHTML(lang);
  };

  this.s = function(id) {
    var str = getStr(id);
    for(var i=1;i<arguments.length;i++)
      str = str.replace(/%[i@]/, arguments[i]);
    return str;
  };

  function getStr(lang, id){
    var str = lib[lang][id];
    if(!str) {
      str = '['+id+']';
      console.warn('No translation present for ['+me.currentLang+']:', id);
    }
    return str.replace(/\\n/g,'\n');
  }

  function setHTML(lang) {
    var toTranslate = document.querySelectorAll('[lang-ref]');
    for (var i = 0; i < toTranslate.length; i++) {
      var id = toTranslate[i].getAttribute('lang-ref');
      if(!id) return console.warn('No lang ID set for element!', toTranslate[i]);
      var str = getStr(lang, id);
      toTranslate[i].innerHTML = str;
    }
  }
};
