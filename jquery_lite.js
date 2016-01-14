(function() {

  if (typeof window.jQueryLite === "undefined") {
    window.jQueryLite = {};
  }

  jQueryLite.$l = function (argument) {
    if (argument instanceof HTMLElement) {
      this.nodeList = new jQueryLite.DOMNodeCollection([argument]);
    } else if (typeof argument === "string") {
      this.nodeList = document.querySelectorAll(argument);
      this.nodeList = [].slice.call(this.nodeList);
      this.nodeList = new jQueryLite.DOMNodeCollection(this.nodeList);
    }
  };

  jQueryLite.DOMNodeCollection = function (HTMLElements) {
    this.HTMLElements = HTMLElements;
  };

  jQueryLite.$l.prototype.html = function (string) {
    if (typeof string === "string") {
      this.nodeList.HTMLElements.forEach(function(element) {
        element.innerHTML = string;
      });
    } else {
      return this.nodeList.HTMLElements[0].innerHTML;
    }
  };

  jQueryLite.$l.prototype.empty = function () {
    this.html("");
  };

  jQueryLite.$l.prototype.append = function (argument) {
    if (typeof argument === "string") {
      this.nodeList.HTMLElements.forEach(function(element) {
        element.innerHTML += argument;
      });
    } else if (argument instanceof HTMLElement) {
      this.nodeList.HTMLElements.forEach(function(element) {
        var newNode = argument.cloneNode();
        newNode.innerHTML = argument.innerHTML;
        element.appendChild(newNode);
      });
    } else if (argument instanceof jQueryLite.$l) {
      for (var i = 0; i < argument.nodeList.HTMLElements.length; i++) {
        this.append(argument.nodeList.HTMLElements[i]);
      }
    }
  };

  jQueryLite.$l.prototype.attr = function (attributeName, value) {
    if (typeof value === "undefined") {
      return this.nodeList.HTMLElements[0].getAttribute(attributeName);
    } else {
      this.nodeList.HTMLElements.forEach(function(element) {
        element.setAttribute(attributeName, value);
      });
    }
  };

  jQueryLite.$l.prototype.addClass = function (newClassName) {
    this.nodeList.HTMLElements.forEach(function(element) {
      if (element.className !== "") {
        element.className += " " + newClassName;
      } else {
        element.className += newClassName;
      }
    });
  };

  jQueryLite.$l.prototype.removeClass = function (classNames) {
    var oldClasses;
    var oldClassesArray;
    var delIdx;
    var i;
    var j;

    if (typeof classNames === "undefined") {
      for (i = 0; i < this.nodeList.HTMLElements.length; i++) {
        this.nodeList.HTMLElements[i].className = "";
      }
    } else {
      var classNameArray = classNames.split(" ");
      for (i = 0; i < classNameArray.length; i ++) {
        for (j = 0; j < this.nodeList.HTMLElements.length; j++) {
          oldClasses = this.nodeList.HTMLElements[j].classList;
          oldClasses.remove(classNameArray[i]);
        }
      }
    }
  };

  jQueryLite.$l.prototype.children = function () {
    var dnCollection = [];
    for (var i = 0; i < this.nodeList.HTMLElements.length; i++) {
      var children = this.nodeList.HTMLElements[i].children;
      children = [].slice.call(children);
      dnCollection.push(children);
    }
    dnCollection = [].concat.apply([], dnCollection);
    return new jQueryLite.DOMNodeCollection(dnCollection);
  };

  jQueryLite.$l.prototype.parent = function () {
    var dnCollection = [];
    for (var i = 0; i < this.nodeList.HTMLElements.length; i++) {
      var parent = this.nodeList.HTMLElements[i].parentNode;
      dnCollection.push(parent);
    }
    // dnCollection = [].concat.apply([], dnCollection);
    return new jQueryLite.DOMNodeCollection(dnCollection);
  };

  jQueryLite.$l.prototype.find = function (selector) {
    var dnCollection = [];

    for (var i = 0; i < this.nodeList.HTMLElements.length; i++) {
      var queryResult = this.nodeList.HTMLElements[i].querySelectorAll(selector);
      queryResult = [].slice.call(queryResult);
      dnCollection.push(queryResult);
    }

    dnCollection = [].concat.apply([], dnCollection);
    return new jQueryLite.DOMNodeCollection(dnCollection);
  };

  jQueryLite.$l.prototype.remove = function () {
    for (var i = 0; i < this.nodeList.HTMLElements.length; i++) {
      this.nodeList.HTMLElements[i].remove();
    }

    this.nodeList.HTMLElements = [];
  };

})();
