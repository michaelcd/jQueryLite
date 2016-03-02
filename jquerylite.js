(function() {

  if (typeof window.$l === "undefined") {
    window.$l = {};
  }

  var _docReadyCallbacks = [], _docReady = false;

  document.addEventListener('DOMContentLoaded', function () {
    _docReady = true;
    _docReadyCallbacks.forEach(function(func){ func(); });
  });

  var registerDocReadyCallback = function(func){
    if(!_docReady){
      _docReadyCallbacks.push(func);
    } else {
      func();
    }
  };

  $l = function (argument) {
    var fnArray = [];
    if (argument instanceof HTMLElement) {
      return new DOMNodeCollection([argument]);
    } else if (typeof argument === "string") {
      var nodeList = document.querySelectorAll(argument);
      nodeList = [].slice.call(nodeList);
      return new DOMNodeCollection(nodeList);
    } else if (typeof argument === "function") {
      // fnArray.push(argument);
      // document.addEventListener('DOMContentLoaded', argument, false);
      registerDocReadyCallback(argument);
    }
  };

  var DOMNodeCollection = function (HTMLElements) {
    this.HTMLElements = HTMLElements;
  };

  DOMNodeCollection.prototype.html = function (string) {
    if (typeof string === "string") {
      this.HTMLElements.forEach(function(element) {
        element.innerHTML = string;
      });
    } else {
      return this.HTMLElements[0].innerHTML;
    }
  };

  DOMNodeCollection.prototype.empty = function () {
    this.html("");
  };

  DOMNodeCollection.prototype.append = function (argument) {
    if (typeof argument === "string") {
      this.HTMLElements.forEach(function(element) {
        element.innerHTML += argument;
      });
    } else if (argument instanceof HTMLElement) {
      this.HTMLElements.forEach(function(element) {
        var newNode = argument.cloneNode();
        newNode.innerHTML = argument.innerHTML;
        element.appendChild(newNode);
      });
    } else if (argument instanceof jQueryLite.$l) {
      for (var i = 0; i < argument.HTMLElements.length; i++) {
        this.append(argument.HTMLElements[i]);
      }
    }
  };

  DOMNodeCollection.prototype.attr = function (attributeName, value) {
    if (typeof value === "undefined") {
      return this.HTMLElements[0].getAttribute(attributeName);
    } else {
      this.HTMLElements.forEach(function(element) {
        element.setAttribute(attributeName, value);
      });
    }
  };

  DOMNodeCollection.prototype.addClass = function (newClassName) {
    this.HTMLElements.forEach(function(element) {
      if (element.className !== "") {
        element.className += " " + newClassName;
      } else {
        element.className += newClassName;
      }
    });
  };

  DOMNodeCollection.prototype.removeClass = function (classNames) {
    var oldClasses;
    var oldClassesArray;
    var delIdx;
    var i;
    var j;

    if (typeof classNames === "undefined") {
      for (i = 0; i < this.HTMLElements.length; i++) {
        this.HTMLElements[i].className = "";
      }
    } else {
      var classNameArray = classNames.split(" ");
      for (i = 0; i < classNameArray.length; i ++) {
        for (j = 0; j < this.HTMLElements.length; j++) {
          oldClasses = this.HTMLElements[j].classList;
          oldClasses.remove(classNameArray[i]);
        }
      }
    }
  };

  DOMNodeCollection.prototype.children = function () {
    var dnCollection = [];
    for (var i = 0; i < this.HTMLElements.length; i++) {
      var children = this.HTMLElements[i].children;
      children = [].slice.call(children);
      dnCollection.push(children);
    }
    dnCollection = [].concat.apply([], dnCollection);
    return new DOMNodeCollection(dnCollection);
  };

  DOMNodeCollection.prototype.parent = function () {
    var dnCollection = [];
    for (var i = 0; i < this.HTMLElements.length; i++) {
      var parent = this.HTMLElements[i].parentNode;
      dnCollection.push(parent);
    }
    // dnCollection = [].concat.apply([], dnCollection);
    return new DOMNodeCollection(dnCollection);
  };

  DOMNodeCollection.prototype.find = function (selector) {
    var dnCollection = [];

    for (var i = 0; i < this.HTMLElements.length; i++) {
      var queryResult = this.HTMLElements[i].querySelectorAll(selector);
      queryResult = [].slice.call(queryResult);
      dnCollection.push(queryResult);
    }

    dnCollection = [].concat.apply([], dnCollection);
    return new DOMNodeCollection(dnCollection);
  };

  DOMNodeCollection.prototype.remove = function () {
    for (var i = 0; i < this.HTMLElements.length; i++) {
      this.HTMLElements[i].remove();
    }

    this.HTMLElements = [];
  };

  DOMNodeCollection.prototype.on = function (type, listener) {
    for (var i = 0; i < this.HTMLElements.length; i++) {
      this.HTMLElements[i].addEventListener(type, listener);
    }
  };

  DOMNodeCollection.prototype.off = function (type, listener) {
    for (var i = 0; i < this.HTMLElements.length; i++) {
      this.HTMLElements[i].removeEventListener(type, listener);
    }
  };

  $l.extend = function (obj1, obj2) {
    return Object.assign.apply(null, arguments);
  };

  $l.ajax = function (options) {
    var defaults = {type: 'GET', method: 'GET', url:'#', data: "DATA",
      success: function(data) {
      console.log("Status 200");
      console.log(data);
      },
      error: function () {
        console.error("An error occurred.");
      }, contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
    };
    this.extend(defaults, options);

    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
           if(xmlhttp.status == 200){
             defaults.success(JSON.parse(xmlhttp.response));
           }
           else if(xmlhttp.status == 400) {
              defaults.error();
           }
           else {
              defaults.error();
           }
        }
    };
    xmlhttp.open(defaults.method, defaults.url, true);
    xmlhttp.send();
  };


  var j = new $l(function() {
    console.log("page is loaded");
  });
})();
