/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/assets/styles.css":
/*!*******************************!*\
  !*** ./src/assets/styles.css ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/sortablejs/modular/sortable.esm.js":
/*!*********************************************************!*\
  !*** ./node_modules/sortablejs/modular/sortable.esm.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "MultiDrag": () => (/* binding */ MultiDragPlugin),
/* harmony export */   "Sortable": () => (/* binding */ Sortable),
/* harmony export */   "Swap": () => (/* binding */ SwapPlugin)
/* harmony export */ });
/**!
 * Sortable 1.14.0
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var version = "1.14.0";

function userAgent(pattern) {
  if (typeof window !== 'undefined' && window.navigator) {
    return !! /*@__PURE__*/navigator.userAgent.match(pattern);
  }
}

var IE11OrLess = userAgent(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i);
var Edge = userAgent(/Edge/i);
var FireFox = userAgent(/firefox/i);
var Safari = userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
var IOS = userAgent(/iP(ad|od|hone)/i);
var ChromeForAndroid = userAgent(/chrome/i) && userAgent(/android/i);

var captureMode = {
  capture: false,
  passive: false
};

function on(el, event, fn) {
  el.addEventListener(event, fn, !IE11OrLess && captureMode);
}

function off(el, event, fn) {
  el.removeEventListener(event, fn, !IE11OrLess && captureMode);
}

function matches(
/**HTMLElement*/
el,
/**String*/
selector) {
  if (!selector) return;
  selector[0] === '>' && (selector = selector.substring(1));

  if (el) {
    try {
      if (el.matches) {
        return el.matches(selector);
      } else if (el.msMatchesSelector) {
        return el.msMatchesSelector(selector);
      } else if (el.webkitMatchesSelector) {
        return el.webkitMatchesSelector(selector);
      }
    } catch (_) {
      return false;
    }
  }

  return false;
}

function getParentOrHost(el) {
  return el.host && el !== document && el.host.nodeType ? el.host : el.parentNode;
}

function closest(
/**HTMLElement*/
el,
/**String*/
selector,
/**HTMLElement*/
ctx, includeCTX) {
  if (el) {
    ctx = ctx || document;

    do {
      if (selector != null && (selector[0] === '>' ? el.parentNode === ctx && matches(el, selector) : matches(el, selector)) || includeCTX && el === ctx) {
        return el;
      }

      if (el === ctx) break;
      /* jshint boss:true */
    } while (el = getParentOrHost(el));
  }

  return null;
}

var R_SPACE = /\s+/g;

function toggleClass(el, name, state) {
  if (el && name) {
    if (el.classList) {
      el.classList[state ? 'add' : 'remove'](name);
    } else {
      var className = (' ' + el.className + ' ').replace(R_SPACE, ' ').replace(' ' + name + ' ', ' ');
      el.className = (className + (state ? ' ' + name : '')).replace(R_SPACE, ' ');
    }
  }
}

function css(el, prop, val) {
  var style = el && el.style;

  if (style) {
    if (val === void 0) {
      if (document.defaultView && document.defaultView.getComputedStyle) {
        val = document.defaultView.getComputedStyle(el, '');
      } else if (el.currentStyle) {
        val = el.currentStyle;
      }

      return prop === void 0 ? val : val[prop];
    } else {
      if (!(prop in style) && prop.indexOf('webkit') === -1) {
        prop = '-webkit-' + prop;
      }

      style[prop] = val + (typeof val === 'string' ? '' : 'px');
    }
  }
}

function matrix(el, selfOnly) {
  var appliedTransforms = '';

  if (typeof el === 'string') {
    appliedTransforms = el;
  } else {
    do {
      var transform = css(el, 'transform');

      if (transform && transform !== 'none') {
        appliedTransforms = transform + ' ' + appliedTransforms;
      }
      /* jshint boss:true */

    } while (!selfOnly && (el = el.parentNode));
  }

  var matrixFn = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  /*jshint -W056 */

  return matrixFn && new matrixFn(appliedTransforms);
}

function find(ctx, tagName, iterator) {
  if (ctx) {
    var list = ctx.getElementsByTagName(tagName),
        i = 0,
        n = list.length;

    if (iterator) {
      for (; i < n; i++) {
        iterator(list[i], i);
      }
    }

    return list;
  }

  return [];
}

function getWindowScrollingElement() {
  var scrollingElement = document.scrollingElement;

  if (scrollingElement) {
    return scrollingElement;
  } else {
    return document.documentElement;
  }
}
/**
 * Returns the "bounding client rect" of given element
 * @param  {HTMLElement} el                       The element whose boundingClientRect is wanted
 * @param  {[Boolean]} relativeToContainingBlock  Whether the rect should be relative to the containing block of (including) the container
 * @param  {[Boolean]} relativeToNonStaticParent  Whether the rect should be relative to the relative parent of (including) the contaienr
 * @param  {[Boolean]} undoScale                  Whether the container's scale() should be undone
 * @param  {[HTMLElement]} container              The parent the element will be placed in
 * @return {Object}                               The boundingClientRect of el, with specified adjustments
 */


function getRect(el, relativeToContainingBlock, relativeToNonStaticParent, undoScale, container) {
  if (!el.getBoundingClientRect && el !== window) return;
  var elRect, top, left, bottom, right, height, width;

  if (el !== window && el.parentNode && el !== getWindowScrollingElement()) {
    elRect = el.getBoundingClientRect();
    top = elRect.top;
    left = elRect.left;
    bottom = elRect.bottom;
    right = elRect.right;
    height = elRect.height;
    width = elRect.width;
  } else {
    top = 0;
    left = 0;
    bottom = window.innerHeight;
    right = window.innerWidth;
    height = window.innerHeight;
    width = window.innerWidth;
  }

  if ((relativeToContainingBlock || relativeToNonStaticParent) && el !== window) {
    // Adjust for translate()
    container = container || el.parentNode; // solves #1123 (see: https://stackoverflow.com/a/37953806/6088312)
    // Not needed on <= IE11

    if (!IE11OrLess) {
      do {
        if (container && container.getBoundingClientRect && (css(container, 'transform') !== 'none' || relativeToNonStaticParent && css(container, 'position') !== 'static')) {
          var containerRect = container.getBoundingClientRect(); // Set relative to edges of padding box of container

          top -= containerRect.top + parseInt(css(container, 'border-top-width'));
          left -= containerRect.left + parseInt(css(container, 'border-left-width'));
          bottom = top + elRect.height;
          right = left + elRect.width;
          break;
        }
        /* jshint boss:true */

      } while (container = container.parentNode);
    }
  }

  if (undoScale && el !== window) {
    // Adjust for scale()
    var elMatrix = matrix(container || el),
        scaleX = elMatrix && elMatrix.a,
        scaleY = elMatrix && elMatrix.d;

    if (elMatrix) {
      top /= scaleY;
      left /= scaleX;
      width /= scaleX;
      height /= scaleY;
      bottom = top + height;
      right = left + width;
    }
  }

  return {
    top: top,
    left: left,
    bottom: bottom,
    right: right,
    width: width,
    height: height
  };
}
/**
 * Checks if a side of an element is scrolled past a side of its parents
 * @param  {HTMLElement}  el           The element who's side being scrolled out of view is in question
 * @param  {String}       elSide       Side of the element in question ('top', 'left', 'right', 'bottom')
 * @param  {String}       parentSide   Side of the parent in question ('top', 'left', 'right', 'bottom')
 * @return {HTMLElement}               The parent scroll element that the el's side is scrolled past, or null if there is no such element
 */


function isScrolledPast(el, elSide, parentSide) {
  var parent = getParentAutoScrollElement(el, true),
      elSideVal = getRect(el)[elSide];
  /* jshint boss:true */

  while (parent) {
    var parentSideVal = getRect(parent)[parentSide],
        visible = void 0;

    if (parentSide === 'top' || parentSide === 'left') {
      visible = elSideVal >= parentSideVal;
    } else {
      visible = elSideVal <= parentSideVal;
    }

    if (!visible) return parent;
    if (parent === getWindowScrollingElement()) break;
    parent = getParentAutoScrollElement(parent, false);
  }

  return false;
}
/**
 * Gets nth child of el, ignoring hidden children, sortable's elements (does not ignore clone if it's visible)
 * and non-draggable elements
 * @param  {HTMLElement} el       The parent element
 * @param  {Number} childNum      The index of the child
 * @param  {Object} options       Parent Sortable's options
 * @return {HTMLElement}          The child at index childNum, or null if not found
 */


function getChild(el, childNum, options, includeDragEl) {
  var currentChild = 0,
      i = 0,
      children = el.children;

  while (i < children.length) {
    if (children[i].style.display !== 'none' && children[i] !== Sortable.ghost && (includeDragEl || children[i] !== Sortable.dragged) && closest(children[i], options.draggable, el, false)) {
      if (currentChild === childNum) {
        return children[i];
      }

      currentChild++;
    }

    i++;
  }

  return null;
}
/**
 * Gets the last child in the el, ignoring ghostEl or invisible elements (clones)
 * @param  {HTMLElement} el       Parent element
 * @param  {selector} selector    Any other elements that should be ignored
 * @return {HTMLElement}          The last child, ignoring ghostEl
 */


function lastChild(el, selector) {
  var last = el.lastElementChild;

  while (last && (last === Sortable.ghost || css(last, 'display') === 'none' || selector && !matches(last, selector))) {
    last = last.previousElementSibling;
  }

  return last || null;
}
/**
 * Returns the index of an element within its parent for a selected set of
 * elements
 * @param  {HTMLElement} el
 * @param  {selector} selector
 * @return {number}
 */


function index(el, selector) {
  var index = 0;

  if (!el || !el.parentNode) {
    return -1;
  }
  /* jshint boss:true */


  while (el = el.previousElementSibling) {
    if (el.nodeName.toUpperCase() !== 'TEMPLATE' && el !== Sortable.clone && (!selector || matches(el, selector))) {
      index++;
    }
  }

  return index;
}
/**
 * Returns the scroll offset of the given element, added with all the scroll offsets of parent elements.
 * The value is returned in real pixels.
 * @param  {HTMLElement} el
 * @return {Array}             Offsets in the format of [left, top]
 */


function getRelativeScrollOffset(el) {
  var offsetLeft = 0,
      offsetTop = 0,
      winScroller = getWindowScrollingElement();

  if (el) {
    do {
      var elMatrix = matrix(el),
          scaleX = elMatrix.a,
          scaleY = elMatrix.d;
      offsetLeft += el.scrollLeft * scaleX;
      offsetTop += el.scrollTop * scaleY;
    } while (el !== winScroller && (el = el.parentNode));
  }

  return [offsetLeft, offsetTop];
}
/**
 * Returns the index of the object within the given array
 * @param  {Array} arr   Array that may or may not hold the object
 * @param  {Object} obj  An object that has a key-value pair unique to and identical to a key-value pair in the object you want to find
 * @return {Number}      The index of the object in the array, or -1
 */


function indexOfObject(arr, obj) {
  for (var i in arr) {
    if (!arr.hasOwnProperty(i)) continue;

    for (var key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] === arr[i][key]) return Number(i);
    }
  }

  return -1;
}

function getParentAutoScrollElement(el, includeSelf) {
  // skip to window
  if (!el || !el.getBoundingClientRect) return getWindowScrollingElement();
  var elem = el;
  var gotSelf = false;

  do {
    // we don't need to get elem css if it isn't even overflowing in the first place (performance)
    if (elem.clientWidth < elem.scrollWidth || elem.clientHeight < elem.scrollHeight) {
      var elemCSS = css(elem);

      if (elem.clientWidth < elem.scrollWidth && (elemCSS.overflowX == 'auto' || elemCSS.overflowX == 'scroll') || elem.clientHeight < elem.scrollHeight && (elemCSS.overflowY == 'auto' || elemCSS.overflowY == 'scroll')) {
        if (!elem.getBoundingClientRect || elem === document.body) return getWindowScrollingElement();
        if (gotSelf || includeSelf) return elem;
        gotSelf = true;
      }
    }
    /* jshint boss:true */

  } while (elem = elem.parentNode);

  return getWindowScrollingElement();
}

function extend(dst, src) {
  if (dst && src) {
    for (var key in src) {
      if (src.hasOwnProperty(key)) {
        dst[key] = src[key];
      }
    }
  }

  return dst;
}

function isRectEqual(rect1, rect2) {
  return Math.round(rect1.top) === Math.round(rect2.top) && Math.round(rect1.left) === Math.round(rect2.left) && Math.round(rect1.height) === Math.round(rect2.height) && Math.round(rect1.width) === Math.round(rect2.width);
}

var _throttleTimeout;

function throttle(callback, ms) {
  return function () {
    if (!_throttleTimeout) {
      var args = arguments,
          _this = this;

      if (args.length === 1) {
        callback.call(_this, args[0]);
      } else {
        callback.apply(_this, args);
      }

      _throttleTimeout = setTimeout(function () {
        _throttleTimeout = void 0;
      }, ms);
    }
  };
}

function cancelThrottle() {
  clearTimeout(_throttleTimeout);
  _throttleTimeout = void 0;
}

function scrollBy(el, x, y) {
  el.scrollLeft += x;
  el.scrollTop += y;
}

function clone(el) {
  var Polymer = window.Polymer;
  var $ = window.jQuery || window.Zepto;

  if (Polymer && Polymer.dom) {
    return Polymer.dom(el).cloneNode(true);
  } else if ($) {
    return $(el).clone(true)[0];
  } else {
    return el.cloneNode(true);
  }
}

function setRect(el, rect) {
  css(el, 'position', 'absolute');
  css(el, 'top', rect.top);
  css(el, 'left', rect.left);
  css(el, 'width', rect.width);
  css(el, 'height', rect.height);
}

function unsetRect(el) {
  css(el, 'position', '');
  css(el, 'top', '');
  css(el, 'left', '');
  css(el, 'width', '');
  css(el, 'height', '');
}

var expando = 'Sortable' + new Date().getTime();

function AnimationStateManager() {
  var animationStates = [],
      animationCallbackId;
  return {
    captureAnimationState: function captureAnimationState() {
      animationStates = [];
      if (!this.options.animation) return;
      var children = [].slice.call(this.el.children);
      children.forEach(function (child) {
        if (css(child, 'display') === 'none' || child === Sortable.ghost) return;
        animationStates.push({
          target: child,
          rect: getRect(child)
        });

        var fromRect = _objectSpread2({}, animationStates[animationStates.length - 1].rect); // If animating: compensate for current animation


        if (child.thisAnimationDuration) {
          var childMatrix = matrix(child, true);

          if (childMatrix) {
            fromRect.top -= childMatrix.f;
            fromRect.left -= childMatrix.e;
          }
        }

        child.fromRect = fromRect;
      });
    },
    addAnimationState: function addAnimationState(state) {
      animationStates.push(state);
    },
    removeAnimationState: function removeAnimationState(target) {
      animationStates.splice(indexOfObject(animationStates, {
        target: target
      }), 1);
    },
    animateAll: function animateAll(callback) {
      var _this = this;

      if (!this.options.animation) {
        clearTimeout(animationCallbackId);
        if (typeof callback === 'function') callback();
        return;
      }

      var animating = false,
          animationTime = 0;
      animationStates.forEach(function (state) {
        var time = 0,
            target = state.target,
            fromRect = target.fromRect,
            toRect = getRect(target),
            prevFromRect = target.prevFromRect,
            prevToRect = target.prevToRect,
            animatingRect = state.rect,
            targetMatrix = matrix(target, true);

        if (targetMatrix) {
          // Compensate for current animation
          toRect.top -= targetMatrix.f;
          toRect.left -= targetMatrix.e;
        }

        target.toRect = toRect;

        if (target.thisAnimationDuration) {
          // Could also check if animatingRect is between fromRect and toRect
          if (isRectEqual(prevFromRect, toRect) && !isRectEqual(fromRect, toRect) && // Make sure animatingRect is on line between toRect & fromRect
          (animatingRect.top - toRect.top) / (animatingRect.left - toRect.left) === (fromRect.top - toRect.top) / (fromRect.left - toRect.left)) {
            // If returning to same place as started from animation and on same axis
            time = calculateRealTime(animatingRect, prevFromRect, prevToRect, _this.options);
          }
        } // if fromRect != toRect: animate


        if (!isRectEqual(toRect, fromRect)) {
          target.prevFromRect = fromRect;
          target.prevToRect = toRect;

          if (!time) {
            time = _this.options.animation;
          }

          _this.animate(target, animatingRect, toRect, time);
        }

        if (time) {
          animating = true;
          animationTime = Math.max(animationTime, time);
          clearTimeout(target.animationResetTimer);
          target.animationResetTimer = setTimeout(function () {
            target.animationTime = 0;
            target.prevFromRect = null;
            target.fromRect = null;
            target.prevToRect = null;
            target.thisAnimationDuration = null;
          }, time);
          target.thisAnimationDuration = time;
        }
      });
      clearTimeout(animationCallbackId);

      if (!animating) {
        if (typeof callback === 'function') callback();
      } else {
        animationCallbackId = setTimeout(function () {
          if (typeof callback === 'function') callback();
        }, animationTime);
      }

      animationStates = [];
    },
    animate: function animate(target, currentRect, toRect, duration) {
      if (duration) {
        css(target, 'transition', '');
        css(target, 'transform', '');
        var elMatrix = matrix(this.el),
            scaleX = elMatrix && elMatrix.a,
            scaleY = elMatrix && elMatrix.d,
            translateX = (currentRect.left - toRect.left) / (scaleX || 1),
            translateY = (currentRect.top - toRect.top) / (scaleY || 1);
        target.animatingX = !!translateX;
        target.animatingY = !!translateY;
        css(target, 'transform', 'translate3d(' + translateX + 'px,' + translateY + 'px,0)');
        this.forRepaintDummy = repaint(target); // repaint

        css(target, 'transition', 'transform ' + duration + 'ms' + (this.options.easing ? ' ' + this.options.easing : ''));
        css(target, 'transform', 'translate3d(0,0,0)');
        typeof target.animated === 'number' && clearTimeout(target.animated);
        target.animated = setTimeout(function () {
          css(target, 'transition', '');
          css(target, 'transform', '');
          target.animated = false;
          target.animatingX = false;
          target.animatingY = false;
        }, duration);
      }
    }
  };
}

function repaint(target) {
  return target.offsetWidth;
}

function calculateRealTime(animatingRect, fromRect, toRect, options) {
  return Math.sqrt(Math.pow(fromRect.top - animatingRect.top, 2) + Math.pow(fromRect.left - animatingRect.left, 2)) / Math.sqrt(Math.pow(fromRect.top - toRect.top, 2) + Math.pow(fromRect.left - toRect.left, 2)) * options.animation;
}

var plugins = [];
var defaults = {
  initializeByDefault: true
};
var PluginManager = {
  mount: function mount(plugin) {
    // Set default static properties
    for (var option in defaults) {
      if (defaults.hasOwnProperty(option) && !(option in plugin)) {
        plugin[option] = defaults[option];
      }
    }

    plugins.forEach(function (p) {
      if (p.pluginName === plugin.pluginName) {
        throw "Sortable: Cannot mount plugin ".concat(plugin.pluginName, " more than once");
      }
    });
    plugins.push(plugin);
  },
  pluginEvent: function pluginEvent(eventName, sortable, evt) {
    var _this = this;

    this.eventCanceled = false;

    evt.cancel = function () {
      _this.eventCanceled = true;
    };

    var eventNameGlobal = eventName + 'Global';
    plugins.forEach(function (plugin) {
      if (!sortable[plugin.pluginName]) return; // Fire global events if it exists in this sortable

      if (sortable[plugin.pluginName][eventNameGlobal]) {
        sortable[plugin.pluginName][eventNameGlobal](_objectSpread2({
          sortable: sortable
        }, evt));
      } // Only fire plugin event if plugin is enabled in this sortable,
      // and plugin has event defined


      if (sortable.options[plugin.pluginName] && sortable[plugin.pluginName][eventName]) {
        sortable[plugin.pluginName][eventName](_objectSpread2({
          sortable: sortable
        }, evt));
      }
    });
  },
  initializePlugins: function initializePlugins(sortable, el, defaults, options) {
    plugins.forEach(function (plugin) {
      var pluginName = plugin.pluginName;
      if (!sortable.options[pluginName] && !plugin.initializeByDefault) return;
      var initialized = new plugin(sortable, el, sortable.options);
      initialized.sortable = sortable;
      initialized.options = sortable.options;
      sortable[pluginName] = initialized; // Add default options from plugin

      _extends(defaults, initialized.defaults);
    });

    for (var option in sortable.options) {
      if (!sortable.options.hasOwnProperty(option)) continue;
      var modified = this.modifyOption(sortable, option, sortable.options[option]);

      if (typeof modified !== 'undefined') {
        sortable.options[option] = modified;
      }
    }
  },
  getEventProperties: function getEventProperties(name, sortable) {
    var eventProperties = {};
    plugins.forEach(function (plugin) {
      if (typeof plugin.eventProperties !== 'function') return;

      _extends(eventProperties, plugin.eventProperties.call(sortable[plugin.pluginName], name));
    });
    return eventProperties;
  },
  modifyOption: function modifyOption(sortable, name, value) {
    var modifiedValue;
    plugins.forEach(function (plugin) {
      // Plugin must exist on the Sortable
      if (!sortable[plugin.pluginName]) return; // If static option listener exists for this option, call in the context of the Sortable's instance of this plugin

      if (plugin.optionListeners && typeof plugin.optionListeners[name] === 'function') {
        modifiedValue = plugin.optionListeners[name].call(sortable[plugin.pluginName], value);
      }
    });
    return modifiedValue;
  }
};

function dispatchEvent(_ref) {
  var sortable = _ref.sortable,
      rootEl = _ref.rootEl,
      name = _ref.name,
      targetEl = _ref.targetEl,
      cloneEl = _ref.cloneEl,
      toEl = _ref.toEl,
      fromEl = _ref.fromEl,
      oldIndex = _ref.oldIndex,
      newIndex = _ref.newIndex,
      oldDraggableIndex = _ref.oldDraggableIndex,
      newDraggableIndex = _ref.newDraggableIndex,
      originalEvent = _ref.originalEvent,
      putSortable = _ref.putSortable,
      extraEventProperties = _ref.extraEventProperties;
  sortable = sortable || rootEl && rootEl[expando];
  if (!sortable) return;
  var evt,
      options = sortable.options,
      onName = 'on' + name.charAt(0).toUpperCase() + name.substr(1); // Support for new CustomEvent feature

  if (window.CustomEvent && !IE11OrLess && !Edge) {
    evt = new CustomEvent(name, {
      bubbles: true,
      cancelable: true
    });
  } else {
    evt = document.createEvent('Event');
    evt.initEvent(name, true, true);
  }

  evt.to = toEl || rootEl;
  evt.from = fromEl || rootEl;
  evt.item = targetEl || rootEl;
  evt.clone = cloneEl;
  evt.oldIndex = oldIndex;
  evt.newIndex = newIndex;
  evt.oldDraggableIndex = oldDraggableIndex;
  evt.newDraggableIndex = newDraggableIndex;
  evt.originalEvent = originalEvent;
  evt.pullMode = putSortable ? putSortable.lastPutMode : undefined;

  var allEventProperties = _objectSpread2(_objectSpread2({}, extraEventProperties), PluginManager.getEventProperties(name, sortable));

  for (var option in allEventProperties) {
    evt[option] = allEventProperties[option];
  }

  if (rootEl) {
    rootEl.dispatchEvent(evt);
  }

  if (options[onName]) {
    options[onName].call(sortable, evt);
  }
}

var _excluded = ["evt"];

var pluginEvent = function pluginEvent(eventName, sortable) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      originalEvent = _ref.evt,
      data = _objectWithoutProperties(_ref, _excluded);

  PluginManager.pluginEvent.bind(Sortable)(eventName, sortable, _objectSpread2({
    dragEl: dragEl,
    parentEl: parentEl,
    ghostEl: ghostEl,
    rootEl: rootEl,
    nextEl: nextEl,
    lastDownEl: lastDownEl,
    cloneEl: cloneEl,
    cloneHidden: cloneHidden,
    dragStarted: moved,
    putSortable: putSortable,
    activeSortable: Sortable.active,
    originalEvent: originalEvent,
    oldIndex: oldIndex,
    oldDraggableIndex: oldDraggableIndex,
    newIndex: newIndex,
    newDraggableIndex: newDraggableIndex,
    hideGhostForTarget: _hideGhostForTarget,
    unhideGhostForTarget: _unhideGhostForTarget,
    cloneNowHidden: function cloneNowHidden() {
      cloneHidden = true;
    },
    cloneNowShown: function cloneNowShown() {
      cloneHidden = false;
    },
    dispatchSortableEvent: function dispatchSortableEvent(name) {
      _dispatchEvent({
        sortable: sortable,
        name: name,
        originalEvent: originalEvent
      });
    }
  }, data));
};

function _dispatchEvent(info) {
  dispatchEvent(_objectSpread2({
    putSortable: putSortable,
    cloneEl: cloneEl,
    targetEl: dragEl,
    rootEl: rootEl,
    oldIndex: oldIndex,
    oldDraggableIndex: oldDraggableIndex,
    newIndex: newIndex,
    newDraggableIndex: newDraggableIndex
  }, info));
}

var dragEl,
    parentEl,
    ghostEl,
    rootEl,
    nextEl,
    lastDownEl,
    cloneEl,
    cloneHidden,
    oldIndex,
    newIndex,
    oldDraggableIndex,
    newDraggableIndex,
    activeGroup,
    putSortable,
    awaitingDragStarted = false,
    ignoreNextClick = false,
    sortables = [],
    tapEvt,
    touchEvt,
    lastDx,
    lastDy,
    tapDistanceLeft,
    tapDistanceTop,
    moved,
    lastTarget,
    lastDirection,
    pastFirstInvertThresh = false,
    isCircumstantialInvert = false,
    targetMoveDistance,
    // For positioning ghost absolutely
ghostRelativeParent,
    ghostRelativeParentInitialScroll = [],
    // (left, top)
_silent = false,
    savedInputChecked = [];
/** @const */

var documentExists = typeof document !== 'undefined',
    PositionGhostAbsolutely = IOS,
    CSSFloatProperty = Edge || IE11OrLess ? 'cssFloat' : 'float',
    // This will not pass for IE9, because IE9 DnD only works on anchors
supportDraggable = documentExists && !ChromeForAndroid && !IOS && 'draggable' in document.createElement('div'),
    supportCssPointerEvents = function () {
  if (!documentExists) return; // false when <= IE11

  if (IE11OrLess) {
    return false;
  }

  var el = document.createElement('x');
  el.style.cssText = 'pointer-events:auto';
  return el.style.pointerEvents === 'auto';
}(),
    _detectDirection = function _detectDirection(el, options) {
  var elCSS = css(el),
      elWidth = parseInt(elCSS.width) - parseInt(elCSS.paddingLeft) - parseInt(elCSS.paddingRight) - parseInt(elCSS.borderLeftWidth) - parseInt(elCSS.borderRightWidth),
      child1 = getChild(el, 0, options),
      child2 = getChild(el, 1, options),
      firstChildCSS = child1 && css(child1),
      secondChildCSS = child2 && css(child2),
      firstChildWidth = firstChildCSS && parseInt(firstChildCSS.marginLeft) + parseInt(firstChildCSS.marginRight) + getRect(child1).width,
      secondChildWidth = secondChildCSS && parseInt(secondChildCSS.marginLeft) + parseInt(secondChildCSS.marginRight) + getRect(child2).width;

  if (elCSS.display === 'flex') {
    return elCSS.flexDirection === 'column' || elCSS.flexDirection === 'column-reverse' ? 'vertical' : 'horizontal';
  }

  if (elCSS.display === 'grid') {
    return elCSS.gridTemplateColumns.split(' ').length <= 1 ? 'vertical' : 'horizontal';
  }

  if (child1 && firstChildCSS["float"] && firstChildCSS["float"] !== 'none') {
    var touchingSideChild2 = firstChildCSS["float"] === 'left' ? 'left' : 'right';
    return child2 && (secondChildCSS.clear === 'both' || secondChildCSS.clear === touchingSideChild2) ? 'vertical' : 'horizontal';
  }

  return child1 && (firstChildCSS.display === 'block' || firstChildCSS.display === 'flex' || firstChildCSS.display === 'table' || firstChildCSS.display === 'grid' || firstChildWidth >= elWidth && elCSS[CSSFloatProperty] === 'none' || child2 && elCSS[CSSFloatProperty] === 'none' && firstChildWidth + secondChildWidth > elWidth) ? 'vertical' : 'horizontal';
},
    _dragElInRowColumn = function _dragElInRowColumn(dragRect, targetRect, vertical) {
  var dragElS1Opp = vertical ? dragRect.left : dragRect.top,
      dragElS2Opp = vertical ? dragRect.right : dragRect.bottom,
      dragElOppLength = vertical ? dragRect.width : dragRect.height,
      targetS1Opp = vertical ? targetRect.left : targetRect.top,
      targetS2Opp = vertical ? targetRect.right : targetRect.bottom,
      targetOppLength = vertical ? targetRect.width : targetRect.height;
  return dragElS1Opp === targetS1Opp || dragElS2Opp === targetS2Opp || dragElS1Opp + dragElOppLength / 2 === targetS1Opp + targetOppLength / 2;
},

/**
 * Detects first nearest empty sortable to X and Y position using emptyInsertThreshold.
 * @param  {Number} x      X position
 * @param  {Number} y      Y position
 * @return {HTMLElement}   Element of the first found nearest Sortable
 */
_detectNearestEmptySortable = function _detectNearestEmptySortable(x, y) {
  var ret;
  sortables.some(function (sortable) {
    var threshold = sortable[expando].options.emptyInsertThreshold;
    if (!threshold || lastChild(sortable)) return;
    var rect = getRect(sortable),
        insideHorizontally = x >= rect.left - threshold && x <= rect.right + threshold,
        insideVertically = y >= rect.top - threshold && y <= rect.bottom + threshold;

    if (insideHorizontally && insideVertically) {
      return ret = sortable;
    }
  });
  return ret;
},
    _prepareGroup = function _prepareGroup(options) {
  function toFn(value, pull) {
    return function (to, from, dragEl, evt) {
      var sameGroup = to.options.group.name && from.options.group.name && to.options.group.name === from.options.group.name;

      if (value == null && (pull || sameGroup)) {
        // Default pull value
        // Default pull and put value if same group
        return true;
      } else if (value == null || value === false) {
        return false;
      } else if (pull && value === 'clone') {
        return value;
      } else if (typeof value === 'function') {
        return toFn(value(to, from, dragEl, evt), pull)(to, from, dragEl, evt);
      } else {
        var otherGroup = (pull ? to : from).options.group.name;
        return value === true || typeof value === 'string' && value === otherGroup || value.join && value.indexOf(otherGroup) > -1;
      }
    };
  }

  var group = {};
  var originalGroup = options.group;

  if (!originalGroup || _typeof(originalGroup) != 'object') {
    originalGroup = {
      name: originalGroup
    };
  }

  group.name = originalGroup.name;
  group.checkPull = toFn(originalGroup.pull, true);
  group.checkPut = toFn(originalGroup.put);
  group.revertClone = originalGroup.revertClone;
  options.group = group;
},
    _hideGhostForTarget = function _hideGhostForTarget() {
  if (!supportCssPointerEvents && ghostEl) {
    css(ghostEl, 'display', 'none');
  }
},
    _unhideGhostForTarget = function _unhideGhostForTarget() {
  if (!supportCssPointerEvents && ghostEl) {
    css(ghostEl, 'display', '');
  }
}; // #1184 fix - Prevent click event on fallback if dragged but item not changed position


if (documentExists) {
  document.addEventListener('click', function (evt) {
    if (ignoreNextClick) {
      evt.preventDefault();
      evt.stopPropagation && evt.stopPropagation();
      evt.stopImmediatePropagation && evt.stopImmediatePropagation();
      ignoreNextClick = false;
      return false;
    }
  }, true);
}

var nearestEmptyInsertDetectEvent = function nearestEmptyInsertDetectEvent(evt) {
  if (dragEl) {
    evt = evt.touches ? evt.touches[0] : evt;

    var nearest = _detectNearestEmptySortable(evt.clientX, evt.clientY);

    if (nearest) {
      // Create imitation event
      var event = {};

      for (var i in evt) {
        if (evt.hasOwnProperty(i)) {
          event[i] = evt[i];
        }
      }

      event.target = event.rootEl = nearest;
      event.preventDefault = void 0;
      event.stopPropagation = void 0;

      nearest[expando]._onDragOver(event);
    }
  }
};

var _checkOutsideTargetEl = function _checkOutsideTargetEl(evt) {
  if (dragEl) {
    dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
  }
};
/**
 * @class  Sortable
 * @param  {HTMLElement}  el
 * @param  {Object}       [options]
 */


function Sortable(el, options) {
  if (!(el && el.nodeType && el.nodeType === 1)) {
    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(el));
  }

  this.el = el; // root element

  this.options = options = _extends({}, options); // Export instance

  el[expando] = this;
  var defaults = {
    group: null,
    sort: true,
    disabled: false,
    store: null,
    handle: null,
    draggable: /^[uo]l$/i.test(el.nodeName) ? '>li' : '>*',
    swapThreshold: 1,
    // percentage; 0 <= x <= 1
    invertSwap: false,
    // invert always
    invertedSwapThreshold: null,
    // will be set to same as swapThreshold if default
    removeCloneOnHide: true,
    direction: function direction() {
      return _detectDirection(el, this.options);
    },
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
    ignore: 'a, img',
    filter: null,
    preventOnFilter: true,
    animation: 0,
    easing: null,
    setData: function setData(dataTransfer, dragEl) {
      dataTransfer.setData('Text', dragEl.textContent);
    },
    dropBubble: false,
    dragoverBubble: false,
    dataIdAttr: 'data-id',
    delay: 0,
    delayOnTouchOnly: false,
    touchStartThreshold: (Number.parseInt ? Number : window).parseInt(window.devicePixelRatio, 10) || 1,
    forceFallback: false,
    fallbackClass: 'sortable-fallback',
    fallbackOnBody: false,
    fallbackTolerance: 0,
    fallbackOffset: {
      x: 0,
      y: 0
    },
    supportPointer: Sortable.supportPointer !== false && 'PointerEvent' in window && !Safari,
    emptyInsertThreshold: 5
  };
  PluginManager.initializePlugins(this, el, defaults); // Set default options

  for (var name in defaults) {
    !(name in options) && (options[name] = defaults[name]);
  }

  _prepareGroup(options); // Bind all private methods


  for (var fn in this) {
    if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
      this[fn] = this[fn].bind(this);
    }
  } // Setup drag mode


  this.nativeDraggable = options.forceFallback ? false : supportDraggable;

  if (this.nativeDraggable) {
    // Touch start threshold cannot be greater than the native dragstart threshold
    this.options.touchStartThreshold = 1;
  } // Bind events


  if (options.supportPointer) {
    on(el, 'pointerdown', this._onTapStart);
  } else {
    on(el, 'mousedown', this._onTapStart);
    on(el, 'touchstart', this._onTapStart);
  }

  if (this.nativeDraggable) {
    on(el, 'dragover', this);
    on(el, 'dragenter', this);
  }

  sortables.push(this.el); // Restore sorting

  options.store && options.store.get && this.sort(options.store.get(this) || []); // Add animation state manager

  _extends(this, AnimationStateManager());
}

Sortable.prototype =
/** @lends Sortable.prototype */
{
  constructor: Sortable,
  _isOutsideThisEl: function _isOutsideThisEl(target) {
    if (!this.el.contains(target) && target !== this.el) {
      lastTarget = null;
    }
  },
  _getDirection: function _getDirection(evt, target) {
    return typeof this.options.direction === 'function' ? this.options.direction.call(this, evt, target, dragEl) : this.options.direction;
  },
  _onTapStart: function _onTapStart(
  /** Event|TouchEvent */
  evt) {
    if (!evt.cancelable) return;

    var _this = this,
        el = this.el,
        options = this.options,
        preventOnFilter = options.preventOnFilter,
        type = evt.type,
        touch = evt.touches && evt.touches[0] || evt.pointerType && evt.pointerType === 'touch' && evt,
        target = (touch || evt).target,
        originalTarget = evt.target.shadowRoot && (evt.path && evt.path[0] || evt.composedPath && evt.composedPath()[0]) || target,
        filter = options.filter;

    _saveInputCheckedState(el); // Don't trigger start event when an element is been dragged, otherwise the evt.oldindex always wrong when set option.group.


    if (dragEl) {
      return;
    }

    if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) {
      return; // only left button and enabled
    } // cancel dnd if original target is content editable


    if (originalTarget.isContentEditable) {
      return;
    } // Safari ignores further event handling after mousedown


    if (!this.nativeDraggable && Safari && target && target.tagName.toUpperCase() === 'SELECT') {
      return;
    }

    target = closest(target, options.draggable, el, false);

    if (target && target.animated) {
      return;
    }

    if (lastDownEl === target) {
      // Ignoring duplicate `down`
      return;
    } // Get the index of the dragged element within its parent


    oldIndex = index(target);
    oldDraggableIndex = index(target, options.draggable); // Check filter

    if (typeof filter === 'function') {
      if (filter.call(this, evt, target, this)) {
        _dispatchEvent({
          sortable: _this,
          rootEl: originalTarget,
          name: 'filter',
          targetEl: target,
          toEl: el,
          fromEl: el
        });

        pluginEvent('filter', _this, {
          evt: evt
        });
        preventOnFilter && evt.cancelable && evt.preventDefault();
        return; // cancel dnd
      }
    } else if (filter) {
      filter = filter.split(',').some(function (criteria) {
        criteria = closest(originalTarget, criteria.trim(), el, false);

        if (criteria) {
          _dispatchEvent({
            sortable: _this,
            rootEl: criteria,
            name: 'filter',
            targetEl: target,
            fromEl: el,
            toEl: el
          });

          pluginEvent('filter', _this, {
            evt: evt
          });
          return true;
        }
      });

      if (filter) {
        preventOnFilter && evt.cancelable && evt.preventDefault();
        return; // cancel dnd
      }
    }

    if (options.handle && !closest(originalTarget, options.handle, el, false)) {
      return;
    } // Prepare `dragstart`


    this._prepareDragStart(evt, touch, target);
  },
  _prepareDragStart: function _prepareDragStart(
  /** Event */
  evt,
  /** Touch */
  touch,
  /** HTMLElement */
  target) {
    var _this = this,
        el = _this.el,
        options = _this.options,
        ownerDocument = el.ownerDocument,
        dragStartFn;

    if (target && !dragEl && target.parentNode === el) {
      var dragRect = getRect(target);
      rootEl = el;
      dragEl = target;
      parentEl = dragEl.parentNode;
      nextEl = dragEl.nextSibling;
      lastDownEl = target;
      activeGroup = options.group;
      Sortable.dragged = dragEl;
      tapEvt = {
        target: dragEl,
        clientX: (touch || evt).clientX,
        clientY: (touch || evt).clientY
      };
      tapDistanceLeft = tapEvt.clientX - dragRect.left;
      tapDistanceTop = tapEvt.clientY - dragRect.top;
      this._lastX = (touch || evt).clientX;
      this._lastY = (touch || evt).clientY;
      dragEl.style['will-change'] = 'all';

      dragStartFn = function dragStartFn() {
        pluginEvent('delayEnded', _this, {
          evt: evt
        });

        if (Sortable.eventCanceled) {
          _this._onDrop();

          return;
        } // Delayed drag has been triggered
        // we can re-enable the events: touchmove/mousemove


        _this._disableDelayedDragEvents();

        if (!FireFox && _this.nativeDraggable) {
          dragEl.draggable = true;
        } // Bind the events: dragstart/dragend


        _this._triggerDragStart(evt, touch); // Drag start event


        _dispatchEvent({
          sortable: _this,
          name: 'choose',
          originalEvent: evt
        }); // Chosen item


        toggleClass(dragEl, options.chosenClass, true);
      }; // Disable "draggable"


      options.ignore.split(',').forEach(function (criteria) {
        find(dragEl, criteria.trim(), _disableDraggable);
      });
      on(ownerDocument, 'dragover', nearestEmptyInsertDetectEvent);
      on(ownerDocument, 'mousemove', nearestEmptyInsertDetectEvent);
      on(ownerDocument, 'touchmove', nearestEmptyInsertDetectEvent);
      on(ownerDocument, 'mouseup', _this._onDrop);
      on(ownerDocument, 'touchend', _this._onDrop);
      on(ownerDocument, 'touchcancel', _this._onDrop); // Make dragEl draggable (must be before delay for FireFox)

      if (FireFox && this.nativeDraggable) {
        this.options.touchStartThreshold = 4;
        dragEl.draggable = true;
      }

      pluginEvent('delayStart', this, {
        evt: evt
      }); // Delay is impossible for native DnD in Edge or IE

      if (options.delay && (!options.delayOnTouchOnly || touch) && (!this.nativeDraggable || !(Edge || IE11OrLess))) {
        if (Sortable.eventCanceled) {
          this._onDrop();

          return;
        } // If the user moves the pointer or let go the click or touch
        // before the delay has been reached:
        // disable the delayed drag


        on(ownerDocument, 'mouseup', _this._disableDelayedDrag);
        on(ownerDocument, 'touchend', _this._disableDelayedDrag);
        on(ownerDocument, 'touchcancel', _this._disableDelayedDrag);
        on(ownerDocument, 'mousemove', _this._delayedDragTouchMoveHandler);
        on(ownerDocument, 'touchmove', _this._delayedDragTouchMoveHandler);
        options.supportPointer && on(ownerDocument, 'pointermove', _this._delayedDragTouchMoveHandler);
        _this._dragStartTimer = setTimeout(dragStartFn, options.delay);
      } else {
        dragStartFn();
      }
    }
  },
  _delayedDragTouchMoveHandler: function _delayedDragTouchMoveHandler(
  /** TouchEvent|PointerEvent **/
  e) {
    var touch = e.touches ? e.touches[0] : e;

    if (Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1))) {
      this._disableDelayedDrag();
    }
  },
  _disableDelayedDrag: function _disableDelayedDrag() {
    dragEl && _disableDraggable(dragEl);
    clearTimeout(this._dragStartTimer);

    this._disableDelayedDragEvents();
  },
  _disableDelayedDragEvents: function _disableDelayedDragEvents() {
    var ownerDocument = this.el.ownerDocument;
    off(ownerDocument, 'mouseup', this._disableDelayedDrag);
    off(ownerDocument, 'touchend', this._disableDelayedDrag);
    off(ownerDocument, 'touchcancel', this._disableDelayedDrag);
    off(ownerDocument, 'mousemove', this._delayedDragTouchMoveHandler);
    off(ownerDocument, 'touchmove', this._delayedDragTouchMoveHandler);
    off(ownerDocument, 'pointermove', this._delayedDragTouchMoveHandler);
  },
  _triggerDragStart: function _triggerDragStart(
  /** Event */
  evt,
  /** Touch */
  touch) {
    touch = touch || evt.pointerType == 'touch' && evt;

    if (!this.nativeDraggable || touch) {
      if (this.options.supportPointer) {
        on(document, 'pointermove', this._onTouchMove);
      } else if (touch) {
        on(document, 'touchmove', this._onTouchMove);
      } else {
        on(document, 'mousemove', this._onTouchMove);
      }
    } else {
      on(dragEl, 'dragend', this);
      on(rootEl, 'dragstart', this._onDragStart);
    }

    try {
      if (document.selection) {
        // Timeout neccessary for IE9
        _nextTick(function () {
          document.selection.empty();
        });
      } else {
        window.getSelection().removeAllRanges();
      }
    } catch (err) {}
  },
  _dragStarted: function _dragStarted(fallback, evt) {

    awaitingDragStarted = false;

    if (rootEl && dragEl) {
      pluginEvent('dragStarted', this, {
        evt: evt
      });

      if (this.nativeDraggable) {
        on(document, 'dragover', _checkOutsideTargetEl);
      }

      var options = this.options; // Apply effect

      !fallback && toggleClass(dragEl, options.dragClass, false);
      toggleClass(dragEl, options.ghostClass, true);
      Sortable.active = this;
      fallback && this._appendGhost(); // Drag start event

      _dispatchEvent({
        sortable: this,
        name: 'start',
        originalEvent: evt
      });
    } else {
      this._nulling();
    }
  },
  _emulateDragOver: function _emulateDragOver() {
    if (touchEvt) {
      this._lastX = touchEvt.clientX;
      this._lastY = touchEvt.clientY;

      _hideGhostForTarget();

      var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
      var parent = target;

      while (target && target.shadowRoot) {
        target = target.shadowRoot.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
        if (target === parent) break;
        parent = target;
      }

      dragEl.parentNode[expando]._isOutsideThisEl(target);

      if (parent) {
        do {
          if (parent[expando]) {
            var inserted = void 0;
            inserted = parent[expando]._onDragOver({
              clientX: touchEvt.clientX,
              clientY: touchEvt.clientY,
              target: target,
              rootEl: parent
            });

            if (inserted && !this.options.dragoverBubble) {
              break;
            }
          }

          target = parent; // store last element
        }
        /* jshint boss:true */
        while (parent = parent.parentNode);
      }

      _unhideGhostForTarget();
    }
  },
  _onTouchMove: function _onTouchMove(
  /**TouchEvent*/
  evt) {
    if (tapEvt) {
      var options = this.options,
          fallbackTolerance = options.fallbackTolerance,
          fallbackOffset = options.fallbackOffset,
          touch = evt.touches ? evt.touches[0] : evt,
          ghostMatrix = ghostEl && matrix(ghostEl, true),
          scaleX = ghostEl && ghostMatrix && ghostMatrix.a,
          scaleY = ghostEl && ghostMatrix && ghostMatrix.d,
          relativeScrollOffset = PositionGhostAbsolutely && ghostRelativeParent && getRelativeScrollOffset(ghostRelativeParent),
          dx = (touch.clientX - tapEvt.clientX + fallbackOffset.x) / (scaleX || 1) + (relativeScrollOffset ? relativeScrollOffset[0] - ghostRelativeParentInitialScroll[0] : 0) / (scaleX || 1),
          dy = (touch.clientY - tapEvt.clientY + fallbackOffset.y) / (scaleY || 1) + (relativeScrollOffset ? relativeScrollOffset[1] - ghostRelativeParentInitialScroll[1] : 0) / (scaleY || 1); // only set the status to dragging, when we are actually dragging

      if (!Sortable.active && !awaitingDragStarted) {
        if (fallbackTolerance && Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) < fallbackTolerance) {
          return;
        }

        this._onDragStart(evt, true);
      }

      if (ghostEl) {
        if (ghostMatrix) {
          ghostMatrix.e += dx - (lastDx || 0);
          ghostMatrix.f += dy - (lastDy || 0);
        } else {
          ghostMatrix = {
            a: 1,
            b: 0,
            c: 0,
            d: 1,
            e: dx,
            f: dy
          };
        }

        var cssMatrix = "matrix(".concat(ghostMatrix.a, ",").concat(ghostMatrix.b, ",").concat(ghostMatrix.c, ",").concat(ghostMatrix.d, ",").concat(ghostMatrix.e, ",").concat(ghostMatrix.f, ")");
        css(ghostEl, 'webkitTransform', cssMatrix);
        css(ghostEl, 'mozTransform', cssMatrix);
        css(ghostEl, 'msTransform', cssMatrix);
        css(ghostEl, 'transform', cssMatrix);
        lastDx = dx;
        lastDy = dy;
        touchEvt = touch;
      }

      evt.cancelable && evt.preventDefault();
    }
  },
  _appendGhost: function _appendGhost() {
    // Bug if using scale(): https://stackoverflow.com/questions/2637058
    // Not being adjusted for
    if (!ghostEl) {
      var container = this.options.fallbackOnBody ? document.body : rootEl,
          rect = getRect(dragEl, true, PositionGhostAbsolutely, true, container),
          options = this.options; // Position absolutely

      if (PositionGhostAbsolutely) {
        // Get relatively positioned parent
        ghostRelativeParent = container;

        while (css(ghostRelativeParent, 'position') === 'static' && css(ghostRelativeParent, 'transform') === 'none' && ghostRelativeParent !== document) {
          ghostRelativeParent = ghostRelativeParent.parentNode;
        }

        if (ghostRelativeParent !== document.body && ghostRelativeParent !== document.documentElement) {
          if (ghostRelativeParent === document) ghostRelativeParent = getWindowScrollingElement();
          rect.top += ghostRelativeParent.scrollTop;
          rect.left += ghostRelativeParent.scrollLeft;
        } else {
          ghostRelativeParent = getWindowScrollingElement();
        }

        ghostRelativeParentInitialScroll = getRelativeScrollOffset(ghostRelativeParent);
      }

      ghostEl = dragEl.cloneNode(true);
      toggleClass(ghostEl, options.ghostClass, false);
      toggleClass(ghostEl, options.fallbackClass, true);
      toggleClass(ghostEl, options.dragClass, true);
      css(ghostEl, 'transition', '');
      css(ghostEl, 'transform', '');
      css(ghostEl, 'box-sizing', 'border-box');
      css(ghostEl, 'margin', 0);
      css(ghostEl, 'top', rect.top);
      css(ghostEl, 'left', rect.left);
      css(ghostEl, 'width', rect.width);
      css(ghostEl, 'height', rect.height);
      css(ghostEl, 'opacity', '0.8');
      css(ghostEl, 'position', PositionGhostAbsolutely ? 'absolute' : 'fixed');
      css(ghostEl, 'zIndex', '100000');
      css(ghostEl, 'pointerEvents', 'none');
      Sortable.ghost = ghostEl;
      container.appendChild(ghostEl); // Set transform-origin

      css(ghostEl, 'transform-origin', tapDistanceLeft / parseInt(ghostEl.style.width) * 100 + '% ' + tapDistanceTop / parseInt(ghostEl.style.height) * 100 + '%');
    }
  },
  _onDragStart: function _onDragStart(
  /**Event*/
  evt,
  /**boolean*/
  fallback) {
    var _this = this;

    var dataTransfer = evt.dataTransfer;
    var options = _this.options;
    pluginEvent('dragStart', this, {
      evt: evt
    });

    if (Sortable.eventCanceled) {
      this._onDrop();

      return;
    }

    pluginEvent('setupClone', this);

    if (!Sortable.eventCanceled) {
      cloneEl = clone(dragEl);
      cloneEl.draggable = false;
      cloneEl.style['will-change'] = '';

      this._hideClone();

      toggleClass(cloneEl, this.options.chosenClass, false);
      Sortable.clone = cloneEl;
    } // #1143: IFrame support workaround


    _this.cloneId = _nextTick(function () {
      pluginEvent('clone', _this);
      if (Sortable.eventCanceled) return;

      if (!_this.options.removeCloneOnHide) {
        rootEl.insertBefore(cloneEl, dragEl);
      }

      _this._hideClone();

      _dispatchEvent({
        sortable: _this,
        name: 'clone'
      });
    });
    !fallback && toggleClass(dragEl, options.dragClass, true); // Set proper drop events

    if (fallback) {
      ignoreNextClick = true;
      _this._loopId = setInterval(_this._emulateDragOver, 50);
    } else {
      // Undo what was set in _prepareDragStart before drag started
      off(document, 'mouseup', _this._onDrop);
      off(document, 'touchend', _this._onDrop);
      off(document, 'touchcancel', _this._onDrop);

      if (dataTransfer) {
        dataTransfer.effectAllowed = 'move';
        options.setData && options.setData.call(_this, dataTransfer, dragEl);
      }

      on(document, 'drop', _this); // #1276 fix:

      css(dragEl, 'transform', 'translateZ(0)');
    }

    awaitingDragStarted = true;
    _this._dragStartId = _nextTick(_this._dragStarted.bind(_this, fallback, evt));
    on(document, 'selectstart', _this);
    moved = true;

    if (Safari) {
      css(document.body, 'user-select', 'none');
    }
  },
  // Returns true - if no further action is needed (either inserted or another condition)
  _onDragOver: function _onDragOver(
  /**Event*/
  evt) {
    var el = this.el,
        target = evt.target,
        dragRect,
        targetRect,
        revert,
        options = this.options,
        group = options.group,
        activeSortable = Sortable.active,
        isOwner = activeGroup === group,
        canSort = options.sort,
        fromSortable = putSortable || activeSortable,
        vertical,
        _this = this,
        completedFired = false;

    if (_silent) return;

    function dragOverEvent(name, extra) {
      pluginEvent(name, _this, _objectSpread2({
        evt: evt,
        isOwner: isOwner,
        axis: vertical ? 'vertical' : 'horizontal',
        revert: revert,
        dragRect: dragRect,
        targetRect: targetRect,
        canSort: canSort,
        fromSortable: fromSortable,
        target: target,
        completed: completed,
        onMove: function onMove(target, after) {
          return _onMove(rootEl, el, dragEl, dragRect, target, getRect(target), evt, after);
        },
        changed: changed
      }, extra));
    } // Capture animation state


    function capture() {
      dragOverEvent('dragOverAnimationCapture');

      _this.captureAnimationState();

      if (_this !== fromSortable) {
        fromSortable.captureAnimationState();
      }
    } // Return invocation when dragEl is inserted (or completed)


    function completed(insertion) {
      dragOverEvent('dragOverCompleted', {
        insertion: insertion
      });

      if (insertion) {
        // Clones must be hidden before folding animation to capture dragRectAbsolute properly
        if (isOwner) {
          activeSortable._hideClone();
        } else {
          activeSortable._showClone(_this);
        }

        if (_this !== fromSortable) {
          // Set ghost class to new sortable's ghost class
          toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : activeSortable.options.ghostClass, false);
          toggleClass(dragEl, options.ghostClass, true);
        }

        if (putSortable !== _this && _this !== Sortable.active) {
          putSortable = _this;
        } else if (_this === Sortable.active && putSortable) {
          putSortable = null;
        } // Animation


        if (fromSortable === _this) {
          _this._ignoreWhileAnimating = target;
        }

        _this.animateAll(function () {
          dragOverEvent('dragOverAnimationComplete');
          _this._ignoreWhileAnimating = null;
        });

        if (_this !== fromSortable) {
          fromSortable.animateAll();
          fromSortable._ignoreWhileAnimating = null;
        }
      } // Null lastTarget if it is not inside a previously swapped element


      if (target === dragEl && !dragEl.animated || target === el && !target.animated) {
        lastTarget = null;
      } // no bubbling and not fallback


      if (!options.dragoverBubble && !evt.rootEl && target !== document) {
        dragEl.parentNode[expando]._isOutsideThisEl(evt.target); // Do not detect for empty insert if already inserted


        !insertion && nearestEmptyInsertDetectEvent(evt);
      }

      !options.dragoverBubble && evt.stopPropagation && evt.stopPropagation();
      return completedFired = true;
    } // Call when dragEl has been inserted


    function changed() {
      newIndex = index(dragEl);
      newDraggableIndex = index(dragEl, options.draggable);

      _dispatchEvent({
        sortable: _this,
        name: 'change',
        toEl: el,
        newIndex: newIndex,
        newDraggableIndex: newDraggableIndex,
        originalEvent: evt
      });
    }

    if (evt.preventDefault !== void 0) {
      evt.cancelable && evt.preventDefault();
    }

    target = closest(target, options.draggable, el, true);
    dragOverEvent('dragOver');
    if (Sortable.eventCanceled) return completedFired;

    if (dragEl.contains(evt.target) || target.animated && target.animatingX && target.animatingY || _this._ignoreWhileAnimating === target) {
      return completed(false);
    }

    ignoreNextClick = false;

    if (activeSortable && !options.disabled && (isOwner ? canSort || (revert = parentEl !== rootEl) // Reverting item into the original list
    : putSortable === this || (this.lastPutMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) && group.checkPut(this, activeSortable, dragEl, evt))) {
      vertical = this._getDirection(evt, target) === 'vertical';
      dragRect = getRect(dragEl);
      dragOverEvent('dragOverValid');
      if (Sortable.eventCanceled) return completedFired;

      if (revert) {
        parentEl = rootEl; // actualization

        capture();

        this._hideClone();

        dragOverEvent('revert');

        if (!Sortable.eventCanceled) {
          if (nextEl) {
            rootEl.insertBefore(dragEl, nextEl);
          } else {
            rootEl.appendChild(dragEl);
          }
        }

        return completed(true);
      }

      var elLastChild = lastChild(el, options.draggable);

      if (!elLastChild || _ghostIsLast(evt, vertical, this) && !elLastChild.animated) {
        // Insert to end of list
        // If already at end of list: Do not insert
        if (elLastChild === dragEl) {
          return completed(false);
        } // if there is a last element, it is the target


        if (elLastChild && el === evt.target) {
          target = elLastChild;
        }

        if (target) {
          targetRect = getRect(target);
        }

        if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, !!target) !== false) {
          capture();
          el.appendChild(dragEl);
          parentEl = el; // actualization

          changed();
          return completed(true);
        }
      } else if (elLastChild && _ghostIsFirst(evt, vertical, this)) {
        // Insert to start of list
        var firstChild = getChild(el, 0, options, true);

        if (firstChild === dragEl) {
          return completed(false);
        }

        target = firstChild;
        targetRect = getRect(target);

        if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, false) !== false) {
          capture();
          el.insertBefore(dragEl, firstChild);
          parentEl = el; // actualization

          changed();
          return completed(true);
        }
      } else if (target.parentNode === el) {
        targetRect = getRect(target);
        var direction = 0,
            targetBeforeFirstSwap,
            differentLevel = dragEl.parentNode !== el,
            differentRowCol = !_dragElInRowColumn(dragEl.animated && dragEl.toRect || dragRect, target.animated && target.toRect || targetRect, vertical),
            side1 = vertical ? 'top' : 'left',
            scrolledPastTop = isScrolledPast(target, 'top', 'top') || isScrolledPast(dragEl, 'top', 'top'),
            scrollBefore = scrolledPastTop ? scrolledPastTop.scrollTop : void 0;

        if (lastTarget !== target) {
          targetBeforeFirstSwap = targetRect[side1];
          pastFirstInvertThresh = false;
          isCircumstantialInvert = !differentRowCol && options.invertSwap || differentLevel;
        }

        direction = _getSwapDirection(evt, target, targetRect, vertical, differentRowCol ? 1 : options.swapThreshold, options.invertedSwapThreshold == null ? options.swapThreshold : options.invertedSwapThreshold, isCircumstantialInvert, lastTarget === target);
        var sibling;

        if (direction !== 0) {
          // Check if target is beside dragEl in respective direction (ignoring hidden elements)
          var dragIndex = index(dragEl);

          do {
            dragIndex -= direction;
            sibling = parentEl.children[dragIndex];
          } while (sibling && (css(sibling, 'display') === 'none' || sibling === ghostEl));
        } // If dragEl is already beside target: Do not insert


        if (direction === 0 || sibling === target) {
          return completed(false);
        }

        lastTarget = target;
        lastDirection = direction;
        var nextSibling = target.nextElementSibling,
            after = false;
        after = direction === 1;

        var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);

        if (moveVector !== false) {
          if (moveVector === 1 || moveVector === -1) {
            after = moveVector === 1;
          }

          _silent = true;
          setTimeout(_unsilent, 30);
          capture();

          if (after && !nextSibling) {
            el.appendChild(dragEl);
          } else {
            target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
          } // Undo chrome's scroll adjustment (has no effect on other browsers)


          if (scrolledPastTop) {
            scrollBy(scrolledPastTop, 0, scrollBefore - scrolledPastTop.scrollTop);
          }

          parentEl = dragEl.parentNode; // actualization
          // must be done before animation

          if (targetBeforeFirstSwap !== undefined && !isCircumstantialInvert) {
            targetMoveDistance = Math.abs(targetBeforeFirstSwap - getRect(target)[side1]);
          }

          changed();
          return completed(true);
        }
      }

      if (el.contains(dragEl)) {
        return completed(false);
      }
    }

    return false;
  },
  _ignoreWhileAnimating: null,
  _offMoveEvents: function _offMoveEvents() {
    off(document, 'mousemove', this._onTouchMove);
    off(document, 'touchmove', this._onTouchMove);
    off(document, 'pointermove', this._onTouchMove);
    off(document, 'dragover', nearestEmptyInsertDetectEvent);
    off(document, 'mousemove', nearestEmptyInsertDetectEvent);
    off(document, 'touchmove', nearestEmptyInsertDetectEvent);
  },
  _offUpEvents: function _offUpEvents() {
    var ownerDocument = this.el.ownerDocument;
    off(ownerDocument, 'mouseup', this._onDrop);
    off(ownerDocument, 'touchend', this._onDrop);
    off(ownerDocument, 'pointerup', this._onDrop);
    off(ownerDocument, 'touchcancel', this._onDrop);
    off(document, 'selectstart', this);
  },
  _onDrop: function _onDrop(
  /**Event*/
  evt) {
    var el = this.el,
        options = this.options; // Get the index of the dragged element within its parent

    newIndex = index(dragEl);
    newDraggableIndex = index(dragEl, options.draggable);
    pluginEvent('drop', this, {
      evt: evt
    });
    parentEl = dragEl && dragEl.parentNode; // Get again after plugin event

    newIndex = index(dragEl);
    newDraggableIndex = index(dragEl, options.draggable);

    if (Sortable.eventCanceled) {
      this._nulling();

      return;
    }

    awaitingDragStarted = false;
    isCircumstantialInvert = false;
    pastFirstInvertThresh = false;
    clearInterval(this._loopId);
    clearTimeout(this._dragStartTimer);

    _cancelNextTick(this.cloneId);

    _cancelNextTick(this._dragStartId); // Unbind events


    if (this.nativeDraggable) {
      off(document, 'drop', this);
      off(el, 'dragstart', this._onDragStart);
    }

    this._offMoveEvents();

    this._offUpEvents();

    if (Safari) {
      css(document.body, 'user-select', '');
    }

    css(dragEl, 'transform', '');

    if (evt) {
      if (moved) {
        evt.cancelable && evt.preventDefault();
        !options.dropBubble && evt.stopPropagation();
      }

      ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);

      if (rootEl === parentEl || putSortable && putSortable.lastPutMode !== 'clone') {
        // Remove clone(s)
        cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
      }

      if (dragEl) {
        if (this.nativeDraggable) {
          off(dragEl, 'dragend', this);
        }

        _disableDraggable(dragEl);

        dragEl.style['will-change'] = ''; // Remove classes
        // ghostClass is added in dragStarted

        if (moved && !awaitingDragStarted) {
          toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : this.options.ghostClass, false);
        }

        toggleClass(dragEl, this.options.chosenClass, false); // Drag stop event

        _dispatchEvent({
          sortable: this,
          name: 'unchoose',
          toEl: parentEl,
          newIndex: null,
          newDraggableIndex: null,
          originalEvent: evt
        });

        if (rootEl !== parentEl) {
          if (newIndex >= 0) {
            // Add event
            _dispatchEvent({
              rootEl: parentEl,
              name: 'add',
              toEl: parentEl,
              fromEl: rootEl,
              originalEvent: evt
            }); // Remove event


            _dispatchEvent({
              sortable: this,
              name: 'remove',
              toEl: parentEl,
              originalEvent: evt
            }); // drag from one list and drop into another


            _dispatchEvent({
              rootEl: parentEl,
              name: 'sort',
              toEl: parentEl,
              fromEl: rootEl,
              originalEvent: evt
            });

            _dispatchEvent({
              sortable: this,
              name: 'sort',
              toEl: parentEl,
              originalEvent: evt
            });
          }

          putSortable && putSortable.save();
        } else {
          if (newIndex !== oldIndex) {
            if (newIndex >= 0) {
              // drag & drop within the same list
              _dispatchEvent({
                sortable: this,
                name: 'update',
                toEl: parentEl,
                originalEvent: evt
              });

              _dispatchEvent({
                sortable: this,
                name: 'sort',
                toEl: parentEl,
                originalEvent: evt
              });
            }
          }
        }

        if (Sortable.active) {
          /* jshint eqnull:true */
          if (newIndex == null || newIndex === -1) {
            newIndex = oldIndex;
            newDraggableIndex = oldDraggableIndex;
          }

          _dispatchEvent({
            sortable: this,
            name: 'end',
            toEl: parentEl,
            originalEvent: evt
          }); // Save sorting


          this.save();
        }
      }
    }

    this._nulling();
  },
  _nulling: function _nulling() {
    pluginEvent('nulling', this);
    rootEl = dragEl = parentEl = ghostEl = nextEl = cloneEl = lastDownEl = cloneHidden = tapEvt = touchEvt = moved = newIndex = newDraggableIndex = oldIndex = oldDraggableIndex = lastTarget = lastDirection = putSortable = activeGroup = Sortable.dragged = Sortable.ghost = Sortable.clone = Sortable.active = null;
    savedInputChecked.forEach(function (el) {
      el.checked = true;
    });
    savedInputChecked.length = lastDx = lastDy = 0;
  },
  handleEvent: function handleEvent(
  /**Event*/
  evt) {
    switch (evt.type) {
      case 'drop':
      case 'dragend':
        this._onDrop(evt);

        break;

      case 'dragenter':
      case 'dragover':
        if (dragEl) {
          this._onDragOver(evt);

          _globalDragOver(evt);
        }

        break;

      case 'selectstart':
        evt.preventDefault();
        break;
    }
  },

  /**
   * Serializes the item into an array of string.
   * @returns {String[]}
   */
  toArray: function toArray() {
    var order = [],
        el,
        children = this.el.children,
        i = 0,
        n = children.length,
        options = this.options;

    for (; i < n; i++) {
      el = children[i];

      if (closest(el, options.draggable, this.el, false)) {
        order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
      }
    }

    return order;
  },

  /**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
  sort: function sort(order, useAnimation) {
    var items = {},
        rootEl = this.el;
    this.toArray().forEach(function (id, i) {
      var el = rootEl.children[i];

      if (closest(el, this.options.draggable, rootEl, false)) {
        items[id] = el;
      }
    }, this);
    useAnimation && this.captureAnimationState();
    order.forEach(function (id) {
      if (items[id]) {
        rootEl.removeChild(items[id]);
        rootEl.appendChild(items[id]);
      }
    });
    useAnimation && this.animateAll();
  },

  /**
   * Save the current sorting
   */
  save: function save() {
    var store = this.options.store;
    store && store.set && store.set(this);
  },

  /**
   * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
   * @param   {HTMLElement}  el
   * @param   {String}       [selector]  default: `options.draggable`
   * @returns {HTMLElement|null}
   */
  closest: function closest$1(el, selector) {
    return closest(el, selector || this.options.draggable, this.el, false);
  },

  /**
   * Set/get option
   * @param   {string} name
   * @param   {*}      [value]
   * @returns {*}
   */
  option: function option(name, value) {
    var options = this.options;

    if (value === void 0) {
      return options[name];
    } else {
      var modifiedValue = PluginManager.modifyOption(this, name, value);

      if (typeof modifiedValue !== 'undefined') {
        options[name] = modifiedValue;
      } else {
        options[name] = value;
      }

      if (name === 'group') {
        _prepareGroup(options);
      }
    }
  },

  /**
   * Destroy
   */
  destroy: function destroy() {
    pluginEvent('destroy', this);
    var el = this.el;
    el[expando] = null;
    off(el, 'mousedown', this._onTapStart);
    off(el, 'touchstart', this._onTapStart);
    off(el, 'pointerdown', this._onTapStart);

    if (this.nativeDraggable) {
      off(el, 'dragover', this);
      off(el, 'dragenter', this);
    } // Remove draggable attributes


    Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function (el) {
      el.removeAttribute('draggable');
    });

    this._onDrop();

    this._disableDelayedDragEvents();

    sortables.splice(sortables.indexOf(this.el), 1);
    this.el = el = null;
  },
  _hideClone: function _hideClone() {
    if (!cloneHidden) {
      pluginEvent('hideClone', this);
      if (Sortable.eventCanceled) return;
      css(cloneEl, 'display', 'none');

      if (this.options.removeCloneOnHide && cloneEl.parentNode) {
        cloneEl.parentNode.removeChild(cloneEl);
      }

      cloneHidden = true;
    }
  },
  _showClone: function _showClone(putSortable) {
    if (putSortable.lastPutMode !== 'clone') {
      this._hideClone();

      return;
    }

    if (cloneHidden) {
      pluginEvent('showClone', this);
      if (Sortable.eventCanceled) return; // show clone at dragEl or original position

      if (dragEl.parentNode == rootEl && !this.options.group.revertClone) {
        rootEl.insertBefore(cloneEl, dragEl);
      } else if (nextEl) {
        rootEl.insertBefore(cloneEl, nextEl);
      } else {
        rootEl.appendChild(cloneEl);
      }

      if (this.options.group.revertClone) {
        this.animate(dragEl, cloneEl);
      }

      css(cloneEl, 'display', '');
      cloneHidden = false;
    }
  }
};

function _globalDragOver(
/**Event*/
evt) {
  if (evt.dataTransfer) {
    evt.dataTransfer.dropEffect = 'move';
  }

  evt.cancelable && evt.preventDefault();
}

function _onMove(fromEl, toEl, dragEl, dragRect, targetEl, targetRect, originalEvent, willInsertAfter) {
  var evt,
      sortable = fromEl[expando],
      onMoveFn = sortable.options.onMove,
      retVal; // Support for new CustomEvent feature

  if (window.CustomEvent && !IE11OrLess && !Edge) {
    evt = new CustomEvent('move', {
      bubbles: true,
      cancelable: true
    });
  } else {
    evt = document.createEvent('Event');
    evt.initEvent('move', true, true);
  }

  evt.to = toEl;
  evt.from = fromEl;
  evt.dragged = dragEl;
  evt.draggedRect = dragRect;
  evt.related = targetEl || toEl;
  evt.relatedRect = targetRect || getRect(toEl);
  evt.willInsertAfter = willInsertAfter;
  evt.originalEvent = originalEvent;
  fromEl.dispatchEvent(evt);

  if (onMoveFn) {
    retVal = onMoveFn.call(sortable, evt, originalEvent);
  }

  return retVal;
}

function _disableDraggable(el) {
  el.draggable = false;
}

function _unsilent() {
  _silent = false;
}

function _ghostIsFirst(evt, vertical, sortable) {
  var rect = getRect(getChild(sortable.el, 0, sortable.options, true));
  var spacer = 10;
  return vertical ? evt.clientX < rect.left - spacer || evt.clientY < rect.top && evt.clientX < rect.right : evt.clientY < rect.top - spacer || evt.clientY < rect.bottom && evt.clientX < rect.left;
}

function _ghostIsLast(evt, vertical, sortable) {
  var rect = getRect(lastChild(sortable.el, sortable.options.draggable));
  var spacer = 10;
  return vertical ? evt.clientX > rect.right + spacer || evt.clientX <= rect.right && evt.clientY > rect.bottom && evt.clientX >= rect.left : evt.clientX > rect.right && evt.clientY > rect.top || evt.clientX <= rect.right && evt.clientY > rect.bottom + spacer;
}

function _getSwapDirection(evt, target, targetRect, vertical, swapThreshold, invertedSwapThreshold, invertSwap, isLastTarget) {
  var mouseOnAxis = vertical ? evt.clientY : evt.clientX,
      targetLength = vertical ? targetRect.height : targetRect.width,
      targetS1 = vertical ? targetRect.top : targetRect.left,
      targetS2 = vertical ? targetRect.bottom : targetRect.right,
      invert = false;

  if (!invertSwap) {
    // Never invert or create dragEl shadow when target movemenet causes mouse to move past the end of regular swapThreshold
    if (isLastTarget && targetMoveDistance < targetLength * swapThreshold) {
      // multiplied only by swapThreshold because mouse will already be inside target by (1 - threshold) * targetLength / 2
      // check if past first invert threshold on side opposite of lastDirection
      if (!pastFirstInvertThresh && (lastDirection === 1 ? mouseOnAxis > targetS1 + targetLength * invertedSwapThreshold / 2 : mouseOnAxis < targetS2 - targetLength * invertedSwapThreshold / 2)) {
        // past first invert threshold, do not restrict inverted threshold to dragEl shadow
        pastFirstInvertThresh = true;
      }

      if (!pastFirstInvertThresh) {
        // dragEl shadow (target move distance shadow)
        if (lastDirection === 1 ? mouseOnAxis < targetS1 + targetMoveDistance // over dragEl shadow
        : mouseOnAxis > targetS2 - targetMoveDistance) {
          return -lastDirection;
        }
      } else {
        invert = true;
      }
    } else {
      // Regular
      if (mouseOnAxis > targetS1 + targetLength * (1 - swapThreshold) / 2 && mouseOnAxis < targetS2 - targetLength * (1 - swapThreshold) / 2) {
        return _getInsertDirection(target);
      }
    }
  }

  invert = invert || invertSwap;

  if (invert) {
    // Invert of regular
    if (mouseOnAxis < targetS1 + targetLength * invertedSwapThreshold / 2 || mouseOnAxis > targetS2 - targetLength * invertedSwapThreshold / 2) {
      return mouseOnAxis > targetS1 + targetLength / 2 ? 1 : -1;
    }
  }

  return 0;
}
/**
 * Gets the direction dragEl must be swapped relative to target in order to make it
 * seem that dragEl has been "inserted" into that element's position
 * @param  {HTMLElement} target       The target whose position dragEl is being inserted at
 * @return {Number}                   Direction dragEl must be swapped
 */


function _getInsertDirection(target) {
  if (index(dragEl) < index(target)) {
    return 1;
  } else {
    return -1;
  }
}
/**
 * Generate id
 * @param   {HTMLElement} el
 * @returns {String}
 * @private
 */


function _generateId(el) {
  var str = el.tagName + el.className + el.src + el.href + el.textContent,
      i = str.length,
      sum = 0;

  while (i--) {
    sum += str.charCodeAt(i);
  }

  return sum.toString(36);
}

function _saveInputCheckedState(root) {
  savedInputChecked.length = 0;
  var inputs = root.getElementsByTagName('input');
  var idx = inputs.length;

  while (idx--) {
    var el = inputs[idx];
    el.checked && savedInputChecked.push(el);
  }
}

function _nextTick(fn) {
  return setTimeout(fn, 0);
}

function _cancelNextTick(id) {
  return clearTimeout(id);
} // Fixed #973:


if (documentExists) {
  on(document, 'touchmove', function (evt) {
    if ((Sortable.active || awaitingDragStarted) && evt.cancelable) {
      evt.preventDefault();
    }
  });
} // Export utils


Sortable.utils = {
  on: on,
  off: off,
  css: css,
  find: find,
  is: function is(el, selector) {
    return !!closest(el, selector, el, false);
  },
  extend: extend,
  throttle: throttle,
  closest: closest,
  toggleClass: toggleClass,
  clone: clone,
  index: index,
  nextTick: _nextTick,
  cancelNextTick: _cancelNextTick,
  detectDirection: _detectDirection,
  getChild: getChild
};
/**
 * Get the Sortable instance of an element
 * @param  {HTMLElement} element The element
 * @return {Sortable|undefined}         The instance of Sortable
 */

Sortable.get = function (element) {
  return element[expando];
};
/**
 * Mount a plugin to Sortable
 * @param  {...SortablePlugin|SortablePlugin[]} plugins       Plugins being mounted
 */


Sortable.mount = function () {
  for (var _len = arguments.length, plugins = new Array(_len), _key = 0; _key < _len; _key++) {
    plugins[_key] = arguments[_key];
  }

  if (plugins[0].constructor === Array) plugins = plugins[0];
  plugins.forEach(function (plugin) {
    if (!plugin.prototype || !plugin.prototype.constructor) {
      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(plugin));
    }

    if (plugin.utils) Sortable.utils = _objectSpread2(_objectSpread2({}, Sortable.utils), plugin.utils);
    PluginManager.mount(plugin);
  });
};
/**
 * Create sortable instance
 * @param {HTMLElement}  el
 * @param {Object}      [options]
 */


Sortable.create = function (el, options) {
  return new Sortable(el, options);
}; // Export


Sortable.version = version;

var autoScrolls = [],
    scrollEl,
    scrollRootEl,
    scrolling = false,
    lastAutoScrollX,
    lastAutoScrollY,
    touchEvt$1,
    pointerElemChangedInterval;

function AutoScrollPlugin() {
  function AutoScroll() {
    this.defaults = {
      scroll: true,
      forceAutoScrollFallback: false,
      scrollSensitivity: 30,
      scrollSpeed: 10,
      bubbleScroll: true
    }; // Bind all private methods

    for (var fn in this) {
      if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
        this[fn] = this[fn].bind(this);
      }
    }
  }

  AutoScroll.prototype = {
    dragStarted: function dragStarted(_ref) {
      var originalEvent = _ref.originalEvent;

      if (this.sortable.nativeDraggable) {
        on(document, 'dragover', this._handleAutoScroll);
      } else {
        if (this.options.supportPointer) {
          on(document, 'pointermove', this._handleFallbackAutoScroll);
        } else if (originalEvent.touches) {
          on(document, 'touchmove', this._handleFallbackAutoScroll);
        } else {
          on(document, 'mousemove', this._handleFallbackAutoScroll);
        }
      }
    },
    dragOverCompleted: function dragOverCompleted(_ref2) {
      var originalEvent = _ref2.originalEvent;

      // For when bubbling is canceled and using fallback (fallback 'touchmove' always reached)
      if (!this.options.dragOverBubble && !originalEvent.rootEl) {
        this._handleAutoScroll(originalEvent);
      }
    },
    drop: function drop() {
      if (this.sortable.nativeDraggable) {
        off(document, 'dragover', this._handleAutoScroll);
      } else {
        off(document, 'pointermove', this._handleFallbackAutoScroll);
        off(document, 'touchmove', this._handleFallbackAutoScroll);
        off(document, 'mousemove', this._handleFallbackAutoScroll);
      }

      clearPointerElemChangedInterval();
      clearAutoScrolls();
      cancelThrottle();
    },
    nulling: function nulling() {
      touchEvt$1 = scrollRootEl = scrollEl = scrolling = pointerElemChangedInterval = lastAutoScrollX = lastAutoScrollY = null;
      autoScrolls.length = 0;
    },
    _handleFallbackAutoScroll: function _handleFallbackAutoScroll(evt) {
      this._handleAutoScroll(evt, true);
    },
    _handleAutoScroll: function _handleAutoScroll(evt, fallback) {
      var _this = this;

      var x = (evt.touches ? evt.touches[0] : evt).clientX,
          y = (evt.touches ? evt.touches[0] : evt).clientY,
          elem = document.elementFromPoint(x, y);
      touchEvt$1 = evt; // IE does not seem to have native autoscroll,
      // Edge's autoscroll seems too conditional,
      // MACOS Safari does not have autoscroll,
      // Firefox and Chrome are good

      if (fallback || this.options.forceAutoScrollFallback || Edge || IE11OrLess || Safari) {
        autoScroll(evt, this.options, elem, fallback); // Listener for pointer element change

        var ogElemScroller = getParentAutoScrollElement(elem, true);

        if (scrolling && (!pointerElemChangedInterval || x !== lastAutoScrollX || y !== lastAutoScrollY)) {
          pointerElemChangedInterval && clearPointerElemChangedInterval(); // Detect for pointer elem change, emulating native DnD behaviour

          pointerElemChangedInterval = setInterval(function () {
            var newElem = getParentAutoScrollElement(document.elementFromPoint(x, y), true);

            if (newElem !== ogElemScroller) {
              ogElemScroller = newElem;
              clearAutoScrolls();
            }

            autoScroll(evt, _this.options, newElem, fallback);
          }, 10);
          lastAutoScrollX = x;
          lastAutoScrollY = y;
        }
      } else {
        // if DnD is enabled (and browser has good autoscrolling), first autoscroll will already scroll, so get parent autoscroll of first autoscroll
        if (!this.options.bubbleScroll || getParentAutoScrollElement(elem, true) === getWindowScrollingElement()) {
          clearAutoScrolls();
          return;
        }

        autoScroll(evt, this.options, getParentAutoScrollElement(elem, false), false);
      }
    }
  };
  return _extends(AutoScroll, {
    pluginName: 'scroll',
    initializeByDefault: true
  });
}

function clearAutoScrolls() {
  autoScrolls.forEach(function (autoScroll) {
    clearInterval(autoScroll.pid);
  });
  autoScrolls = [];
}

function clearPointerElemChangedInterval() {
  clearInterval(pointerElemChangedInterval);
}

var autoScroll = throttle(function (evt, options, rootEl, isFallback) {
  // Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=505521
  if (!options.scroll) return;
  var x = (evt.touches ? evt.touches[0] : evt).clientX,
      y = (evt.touches ? evt.touches[0] : evt).clientY,
      sens = options.scrollSensitivity,
      speed = options.scrollSpeed,
      winScroller = getWindowScrollingElement();
  var scrollThisInstance = false,
      scrollCustomFn; // New scroll root, set scrollEl

  if (scrollRootEl !== rootEl) {
    scrollRootEl = rootEl;
    clearAutoScrolls();
    scrollEl = options.scroll;
    scrollCustomFn = options.scrollFn;

    if (scrollEl === true) {
      scrollEl = getParentAutoScrollElement(rootEl, true);
    }
  }

  var layersOut = 0;
  var currentParent = scrollEl;

  do {
    var el = currentParent,
        rect = getRect(el),
        top = rect.top,
        bottom = rect.bottom,
        left = rect.left,
        right = rect.right,
        width = rect.width,
        height = rect.height,
        canScrollX = void 0,
        canScrollY = void 0,
        scrollWidth = el.scrollWidth,
        scrollHeight = el.scrollHeight,
        elCSS = css(el),
        scrollPosX = el.scrollLeft,
        scrollPosY = el.scrollTop;

    if (el === winScroller) {
      canScrollX = width < scrollWidth && (elCSS.overflowX === 'auto' || elCSS.overflowX === 'scroll' || elCSS.overflowX === 'visible');
      canScrollY = height < scrollHeight && (elCSS.overflowY === 'auto' || elCSS.overflowY === 'scroll' || elCSS.overflowY === 'visible');
    } else {
      canScrollX = width < scrollWidth && (elCSS.overflowX === 'auto' || elCSS.overflowX === 'scroll');
      canScrollY = height < scrollHeight && (elCSS.overflowY === 'auto' || elCSS.overflowY === 'scroll');
    }

    var vx = canScrollX && (Math.abs(right - x) <= sens && scrollPosX + width < scrollWidth) - (Math.abs(left - x) <= sens && !!scrollPosX);
    var vy = canScrollY && (Math.abs(bottom - y) <= sens && scrollPosY + height < scrollHeight) - (Math.abs(top - y) <= sens && !!scrollPosY);

    if (!autoScrolls[layersOut]) {
      for (var i = 0; i <= layersOut; i++) {
        if (!autoScrolls[i]) {
          autoScrolls[i] = {};
        }
      }
    }

    if (autoScrolls[layersOut].vx != vx || autoScrolls[layersOut].vy != vy || autoScrolls[layersOut].el !== el) {
      autoScrolls[layersOut].el = el;
      autoScrolls[layersOut].vx = vx;
      autoScrolls[layersOut].vy = vy;
      clearInterval(autoScrolls[layersOut].pid);

      if (vx != 0 || vy != 0) {
        scrollThisInstance = true;
        /* jshint loopfunc:true */

        autoScrolls[layersOut].pid = setInterval(function () {
          // emulate drag over during autoscroll (fallback), emulating native DnD behaviour
          if (isFallback && this.layer === 0) {
            Sortable.active._onTouchMove(touchEvt$1); // To move ghost if it is positioned absolutely

          }

          var scrollOffsetY = autoScrolls[this.layer].vy ? autoScrolls[this.layer].vy * speed : 0;
          var scrollOffsetX = autoScrolls[this.layer].vx ? autoScrolls[this.layer].vx * speed : 0;

          if (typeof scrollCustomFn === 'function') {
            if (scrollCustomFn.call(Sortable.dragged.parentNode[expando], scrollOffsetX, scrollOffsetY, evt, touchEvt$1, autoScrolls[this.layer].el) !== 'continue') {
              return;
            }
          }

          scrollBy(autoScrolls[this.layer].el, scrollOffsetX, scrollOffsetY);
        }.bind({
          layer: layersOut
        }), 24);
      }
    }

    layersOut++;
  } while (options.bubbleScroll && currentParent !== winScroller && (currentParent = getParentAutoScrollElement(currentParent, false)));

  scrolling = scrollThisInstance; // in case another function catches scrolling as false in between when it is not
}, 30);

var drop = function drop(_ref) {
  var originalEvent = _ref.originalEvent,
      putSortable = _ref.putSortable,
      dragEl = _ref.dragEl,
      activeSortable = _ref.activeSortable,
      dispatchSortableEvent = _ref.dispatchSortableEvent,
      hideGhostForTarget = _ref.hideGhostForTarget,
      unhideGhostForTarget = _ref.unhideGhostForTarget;
  if (!originalEvent) return;
  var toSortable = putSortable || activeSortable;
  hideGhostForTarget();
  var touch = originalEvent.changedTouches && originalEvent.changedTouches.length ? originalEvent.changedTouches[0] : originalEvent;
  var target = document.elementFromPoint(touch.clientX, touch.clientY);
  unhideGhostForTarget();

  if (toSortable && !toSortable.el.contains(target)) {
    dispatchSortableEvent('spill');
    this.onSpill({
      dragEl: dragEl,
      putSortable: putSortable
    });
  }
};

function Revert() {}

Revert.prototype = {
  startIndex: null,
  dragStart: function dragStart(_ref2) {
    var oldDraggableIndex = _ref2.oldDraggableIndex;
    this.startIndex = oldDraggableIndex;
  },
  onSpill: function onSpill(_ref3) {
    var dragEl = _ref3.dragEl,
        putSortable = _ref3.putSortable;
    this.sortable.captureAnimationState();

    if (putSortable) {
      putSortable.captureAnimationState();
    }

    var nextSibling = getChild(this.sortable.el, this.startIndex, this.options);

    if (nextSibling) {
      this.sortable.el.insertBefore(dragEl, nextSibling);
    } else {
      this.sortable.el.appendChild(dragEl);
    }

    this.sortable.animateAll();

    if (putSortable) {
      putSortable.animateAll();
    }
  },
  drop: drop
};

_extends(Revert, {
  pluginName: 'revertOnSpill'
});

function Remove() {}

Remove.prototype = {
  onSpill: function onSpill(_ref4) {
    var dragEl = _ref4.dragEl,
        putSortable = _ref4.putSortable;
    var parentSortable = putSortable || this.sortable;
    parentSortable.captureAnimationState();
    dragEl.parentNode && dragEl.parentNode.removeChild(dragEl);
    parentSortable.animateAll();
  },
  drop: drop
};

_extends(Remove, {
  pluginName: 'removeOnSpill'
});

var lastSwapEl;

function SwapPlugin() {
  function Swap() {
    this.defaults = {
      swapClass: 'sortable-swap-highlight'
    };
  }

  Swap.prototype = {
    dragStart: function dragStart(_ref) {
      var dragEl = _ref.dragEl;
      lastSwapEl = dragEl;
    },
    dragOverValid: function dragOverValid(_ref2) {
      var completed = _ref2.completed,
          target = _ref2.target,
          onMove = _ref2.onMove,
          activeSortable = _ref2.activeSortable,
          changed = _ref2.changed,
          cancel = _ref2.cancel;
      if (!activeSortable.options.swap) return;
      var el = this.sortable.el,
          options = this.options;

      if (target && target !== el) {
        var prevSwapEl = lastSwapEl;

        if (onMove(target) !== false) {
          toggleClass(target, options.swapClass, true);
          lastSwapEl = target;
        } else {
          lastSwapEl = null;
        }

        if (prevSwapEl && prevSwapEl !== lastSwapEl) {
          toggleClass(prevSwapEl, options.swapClass, false);
        }
      }

      changed();
      completed(true);
      cancel();
    },
    drop: function drop(_ref3) {
      var activeSortable = _ref3.activeSortable,
          putSortable = _ref3.putSortable,
          dragEl = _ref3.dragEl;
      var toSortable = putSortable || this.sortable;
      var options = this.options;
      lastSwapEl && toggleClass(lastSwapEl, options.swapClass, false);

      if (lastSwapEl && (options.swap || putSortable && putSortable.options.swap)) {
        if (dragEl !== lastSwapEl) {
          toSortable.captureAnimationState();
          if (toSortable !== activeSortable) activeSortable.captureAnimationState();
          swapNodes(dragEl, lastSwapEl);
          toSortable.animateAll();
          if (toSortable !== activeSortable) activeSortable.animateAll();
        }
      }
    },
    nulling: function nulling() {
      lastSwapEl = null;
    }
  };
  return _extends(Swap, {
    pluginName: 'swap',
    eventProperties: function eventProperties() {
      return {
        swapItem: lastSwapEl
      };
    }
  });
}

function swapNodes(n1, n2) {
  var p1 = n1.parentNode,
      p2 = n2.parentNode,
      i1,
      i2;
  if (!p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1)) return;
  i1 = index(n1);
  i2 = index(n2);

  if (p1.isEqualNode(p2) && i1 < i2) {
    i2++;
  }

  p1.insertBefore(n2, p1.children[i1]);
  p2.insertBefore(n1, p2.children[i2]);
}

var multiDragElements = [],
    multiDragClones = [],
    lastMultiDragSelect,
    // for selection with modifier key down (SHIFT)
multiDragSortable,
    initialFolding = false,
    // Initial multi-drag fold when drag started
folding = false,
    // Folding any other time
dragStarted = false,
    dragEl$1,
    clonesFromRect,
    clonesHidden;

function MultiDragPlugin() {
  function MultiDrag(sortable) {
    // Bind all private methods
    for (var fn in this) {
      if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
        this[fn] = this[fn].bind(this);
      }
    }

    if (sortable.options.supportPointer) {
      on(document, 'pointerup', this._deselectMultiDrag);
    } else {
      on(document, 'mouseup', this._deselectMultiDrag);
      on(document, 'touchend', this._deselectMultiDrag);
    }

    on(document, 'keydown', this._checkKeyDown);
    on(document, 'keyup', this._checkKeyUp);
    this.defaults = {
      selectedClass: 'sortable-selected',
      multiDragKey: null,
      setData: function setData(dataTransfer, dragEl) {
        var data = '';

        if (multiDragElements.length && multiDragSortable === sortable) {
          multiDragElements.forEach(function (multiDragElement, i) {
            data += (!i ? '' : ', ') + multiDragElement.textContent;
          });
        } else {
          data = dragEl.textContent;
        }

        dataTransfer.setData('Text', data);
      }
    };
  }

  MultiDrag.prototype = {
    multiDragKeyDown: false,
    isMultiDrag: false,
    delayStartGlobal: function delayStartGlobal(_ref) {
      var dragged = _ref.dragEl;
      dragEl$1 = dragged;
    },
    delayEnded: function delayEnded() {
      this.isMultiDrag = ~multiDragElements.indexOf(dragEl$1);
    },
    setupClone: function setupClone(_ref2) {
      var sortable = _ref2.sortable,
          cancel = _ref2.cancel;
      if (!this.isMultiDrag) return;

      for (var i = 0; i < multiDragElements.length; i++) {
        multiDragClones.push(clone(multiDragElements[i]));
        multiDragClones[i].sortableIndex = multiDragElements[i].sortableIndex;
        multiDragClones[i].draggable = false;
        multiDragClones[i].style['will-change'] = '';
        toggleClass(multiDragClones[i], this.options.selectedClass, false);
        multiDragElements[i] === dragEl$1 && toggleClass(multiDragClones[i], this.options.chosenClass, false);
      }

      sortable._hideClone();

      cancel();
    },
    clone: function clone(_ref3) {
      var sortable = _ref3.sortable,
          rootEl = _ref3.rootEl,
          dispatchSortableEvent = _ref3.dispatchSortableEvent,
          cancel = _ref3.cancel;
      if (!this.isMultiDrag) return;

      if (!this.options.removeCloneOnHide) {
        if (multiDragElements.length && multiDragSortable === sortable) {
          insertMultiDragClones(true, rootEl);
          dispatchSortableEvent('clone');
          cancel();
        }
      }
    },
    showClone: function showClone(_ref4) {
      var cloneNowShown = _ref4.cloneNowShown,
          rootEl = _ref4.rootEl,
          cancel = _ref4.cancel;
      if (!this.isMultiDrag) return;
      insertMultiDragClones(false, rootEl);
      multiDragClones.forEach(function (clone) {
        css(clone, 'display', '');
      });
      cloneNowShown();
      clonesHidden = false;
      cancel();
    },
    hideClone: function hideClone(_ref5) {
      var _this = this;

      var sortable = _ref5.sortable,
          cloneNowHidden = _ref5.cloneNowHidden,
          cancel = _ref5.cancel;
      if (!this.isMultiDrag) return;
      multiDragClones.forEach(function (clone) {
        css(clone, 'display', 'none');

        if (_this.options.removeCloneOnHide && clone.parentNode) {
          clone.parentNode.removeChild(clone);
        }
      });
      cloneNowHidden();
      clonesHidden = true;
      cancel();
    },
    dragStartGlobal: function dragStartGlobal(_ref6) {
      var sortable = _ref6.sortable;

      if (!this.isMultiDrag && multiDragSortable) {
        multiDragSortable.multiDrag._deselectMultiDrag();
      }

      multiDragElements.forEach(function (multiDragElement) {
        multiDragElement.sortableIndex = index(multiDragElement);
      }); // Sort multi-drag elements

      multiDragElements = multiDragElements.sort(function (a, b) {
        return a.sortableIndex - b.sortableIndex;
      });
      dragStarted = true;
    },
    dragStarted: function dragStarted(_ref7) {
      var _this2 = this;

      var sortable = _ref7.sortable;
      if (!this.isMultiDrag) return;

      if (this.options.sort) {
        // Capture rects,
        // hide multi drag elements (by positioning them absolute),
        // set multi drag elements rects to dragRect,
        // show multi drag elements,
        // animate to rects,
        // unset rects & remove from DOM
        sortable.captureAnimationState();

        if (this.options.animation) {
          multiDragElements.forEach(function (multiDragElement) {
            if (multiDragElement === dragEl$1) return;
            css(multiDragElement, 'position', 'absolute');
          });
          var dragRect = getRect(dragEl$1, false, true, true);
          multiDragElements.forEach(function (multiDragElement) {
            if (multiDragElement === dragEl$1) return;
            setRect(multiDragElement, dragRect);
          });
          folding = true;
          initialFolding = true;
        }
      }

      sortable.animateAll(function () {
        folding = false;
        initialFolding = false;

        if (_this2.options.animation) {
          multiDragElements.forEach(function (multiDragElement) {
            unsetRect(multiDragElement);
          });
        } // Remove all auxiliary multidrag items from el, if sorting enabled


        if (_this2.options.sort) {
          removeMultiDragElements();
        }
      });
    },
    dragOver: function dragOver(_ref8) {
      var target = _ref8.target,
          completed = _ref8.completed,
          cancel = _ref8.cancel;

      if (folding && ~multiDragElements.indexOf(target)) {
        completed(false);
        cancel();
      }
    },
    revert: function revert(_ref9) {
      var fromSortable = _ref9.fromSortable,
          rootEl = _ref9.rootEl,
          sortable = _ref9.sortable,
          dragRect = _ref9.dragRect;

      if (multiDragElements.length > 1) {
        // Setup unfold animation
        multiDragElements.forEach(function (multiDragElement) {
          sortable.addAnimationState({
            target: multiDragElement,
            rect: folding ? getRect(multiDragElement) : dragRect
          });
          unsetRect(multiDragElement);
          multiDragElement.fromRect = dragRect;
          fromSortable.removeAnimationState(multiDragElement);
        });
        folding = false;
        insertMultiDragElements(!this.options.removeCloneOnHide, rootEl);
      }
    },
    dragOverCompleted: function dragOverCompleted(_ref10) {
      var sortable = _ref10.sortable,
          isOwner = _ref10.isOwner,
          insertion = _ref10.insertion,
          activeSortable = _ref10.activeSortable,
          parentEl = _ref10.parentEl,
          putSortable = _ref10.putSortable;
      var options = this.options;

      if (insertion) {
        // Clones must be hidden before folding animation to capture dragRectAbsolute properly
        if (isOwner) {
          activeSortable._hideClone();
        }

        initialFolding = false; // If leaving sort:false root, or already folding - Fold to new location

        if (options.animation && multiDragElements.length > 1 && (folding || !isOwner && !activeSortable.options.sort && !putSortable)) {
          // Fold: Set all multi drag elements's rects to dragEl's rect when multi-drag elements are invisible
          var dragRectAbsolute = getRect(dragEl$1, false, true, true);
          multiDragElements.forEach(function (multiDragElement) {
            if (multiDragElement === dragEl$1) return;
            setRect(multiDragElement, dragRectAbsolute); // Move element(s) to end of parentEl so that it does not interfere with multi-drag clones insertion if they are inserted
            // while folding, and so that we can capture them again because old sortable will no longer be fromSortable

            parentEl.appendChild(multiDragElement);
          });
          folding = true;
        } // Clones must be shown (and check to remove multi drags) after folding when interfering multiDragElements are moved out


        if (!isOwner) {
          // Only remove if not folding (folding will remove them anyways)
          if (!folding) {
            removeMultiDragElements();
          }

          if (multiDragElements.length > 1) {
            var clonesHiddenBefore = clonesHidden;

            activeSortable._showClone(sortable); // Unfold animation for clones if showing from hidden


            if (activeSortable.options.animation && !clonesHidden && clonesHiddenBefore) {
              multiDragClones.forEach(function (clone) {
                activeSortable.addAnimationState({
                  target: clone,
                  rect: clonesFromRect
                });
                clone.fromRect = clonesFromRect;
                clone.thisAnimationDuration = null;
              });
            }
          } else {
            activeSortable._showClone(sortable);
          }
        }
      }
    },
    dragOverAnimationCapture: function dragOverAnimationCapture(_ref11) {
      var dragRect = _ref11.dragRect,
          isOwner = _ref11.isOwner,
          activeSortable = _ref11.activeSortable;
      multiDragElements.forEach(function (multiDragElement) {
        multiDragElement.thisAnimationDuration = null;
      });

      if (activeSortable.options.animation && !isOwner && activeSortable.multiDrag.isMultiDrag) {
        clonesFromRect = _extends({}, dragRect);
        var dragMatrix = matrix(dragEl$1, true);
        clonesFromRect.top -= dragMatrix.f;
        clonesFromRect.left -= dragMatrix.e;
      }
    },
    dragOverAnimationComplete: function dragOverAnimationComplete() {
      if (folding) {
        folding = false;
        removeMultiDragElements();
      }
    },
    drop: function drop(_ref12) {
      var evt = _ref12.originalEvent,
          rootEl = _ref12.rootEl,
          parentEl = _ref12.parentEl,
          sortable = _ref12.sortable,
          dispatchSortableEvent = _ref12.dispatchSortableEvent,
          oldIndex = _ref12.oldIndex,
          putSortable = _ref12.putSortable;
      var toSortable = putSortable || this.sortable;
      if (!evt) return;
      var options = this.options,
          children = parentEl.children; // Multi-drag selection

      if (!dragStarted) {
        if (options.multiDragKey && !this.multiDragKeyDown) {
          this._deselectMultiDrag();
        }

        toggleClass(dragEl$1, options.selectedClass, !~multiDragElements.indexOf(dragEl$1));

        if (!~multiDragElements.indexOf(dragEl$1)) {
          multiDragElements.push(dragEl$1);
          dispatchEvent({
            sortable: sortable,
            rootEl: rootEl,
            name: 'select',
            targetEl: dragEl$1,
            originalEvt: evt
          }); // Modifier activated, select from last to dragEl

          if (evt.shiftKey && lastMultiDragSelect && sortable.el.contains(lastMultiDragSelect)) {
            var lastIndex = index(lastMultiDragSelect),
                currentIndex = index(dragEl$1);

            if (~lastIndex && ~currentIndex && lastIndex !== currentIndex) {
              // Must include lastMultiDragSelect (select it), in case modified selection from no selection
              // (but previous selection existed)
              var n, i;

              if (currentIndex > lastIndex) {
                i = lastIndex;
                n = currentIndex;
              } else {
                i = currentIndex;
                n = lastIndex + 1;
              }

              for (; i < n; i++) {
                if (~multiDragElements.indexOf(children[i])) continue;
                toggleClass(children[i], options.selectedClass, true);
                multiDragElements.push(children[i]);
                dispatchEvent({
                  sortable: sortable,
                  rootEl: rootEl,
                  name: 'select',
                  targetEl: children[i],
                  originalEvt: evt
                });
              }
            }
          } else {
            lastMultiDragSelect = dragEl$1;
          }

          multiDragSortable = toSortable;
        } else {
          multiDragElements.splice(multiDragElements.indexOf(dragEl$1), 1);
          lastMultiDragSelect = null;
          dispatchEvent({
            sortable: sortable,
            rootEl: rootEl,
            name: 'deselect',
            targetEl: dragEl$1,
            originalEvt: evt
          });
        }
      } // Multi-drag drop


      if (dragStarted && this.isMultiDrag) {
        folding = false; // Do not "unfold" after around dragEl if reverted

        if ((parentEl[expando].options.sort || parentEl !== rootEl) && multiDragElements.length > 1) {
          var dragRect = getRect(dragEl$1),
              multiDragIndex = index(dragEl$1, ':not(.' + this.options.selectedClass + ')');
          if (!initialFolding && options.animation) dragEl$1.thisAnimationDuration = null;
          toSortable.captureAnimationState();

          if (!initialFolding) {
            if (options.animation) {
              dragEl$1.fromRect = dragRect;
              multiDragElements.forEach(function (multiDragElement) {
                multiDragElement.thisAnimationDuration = null;

                if (multiDragElement !== dragEl$1) {
                  var rect = folding ? getRect(multiDragElement) : dragRect;
                  multiDragElement.fromRect = rect; // Prepare unfold animation

                  toSortable.addAnimationState({
                    target: multiDragElement,
                    rect: rect
                  });
                }
              });
            } // Multi drag elements are not necessarily removed from the DOM on drop, so to reinsert
            // properly they must all be removed


            removeMultiDragElements();
            multiDragElements.forEach(function (multiDragElement) {
              if (children[multiDragIndex]) {
                parentEl.insertBefore(multiDragElement, children[multiDragIndex]);
              } else {
                parentEl.appendChild(multiDragElement);
              }

              multiDragIndex++;
            }); // If initial folding is done, the elements may have changed position because they are now
            // unfolding around dragEl, even though dragEl may not have his index changed, so update event
            // must be fired here as Sortable will not.

            if (oldIndex === index(dragEl$1)) {
              var update = false;
              multiDragElements.forEach(function (multiDragElement) {
                if (multiDragElement.sortableIndex !== index(multiDragElement)) {
                  update = true;
                  return;
                }
              });

              if (update) {
                dispatchSortableEvent('update');
              }
            }
          } // Must be done after capturing individual rects (scroll bar)


          multiDragElements.forEach(function (multiDragElement) {
            unsetRect(multiDragElement);
          });
          toSortable.animateAll();
        }

        multiDragSortable = toSortable;
      } // Remove clones if necessary


      if (rootEl === parentEl || putSortable && putSortable.lastPutMode !== 'clone') {
        multiDragClones.forEach(function (clone) {
          clone.parentNode && clone.parentNode.removeChild(clone);
        });
      }
    },
    nullingGlobal: function nullingGlobal() {
      this.isMultiDrag = dragStarted = false;
      multiDragClones.length = 0;
    },
    destroyGlobal: function destroyGlobal() {
      this._deselectMultiDrag();

      off(document, 'pointerup', this._deselectMultiDrag);
      off(document, 'mouseup', this._deselectMultiDrag);
      off(document, 'touchend', this._deselectMultiDrag);
      off(document, 'keydown', this._checkKeyDown);
      off(document, 'keyup', this._checkKeyUp);
    },
    _deselectMultiDrag: function _deselectMultiDrag(evt) {
      if (typeof dragStarted !== "undefined" && dragStarted) return; // Only deselect if selection is in this sortable

      if (multiDragSortable !== this.sortable) return; // Only deselect if target is not item in this sortable

      if (evt && closest(evt.target, this.options.draggable, this.sortable.el, false)) return; // Only deselect if left click

      if (evt && evt.button !== 0) return;

      while (multiDragElements.length) {
        var el = multiDragElements[0];
        toggleClass(el, this.options.selectedClass, false);
        multiDragElements.shift();
        dispatchEvent({
          sortable: this.sortable,
          rootEl: this.sortable.el,
          name: 'deselect',
          targetEl: el,
          originalEvt: evt
        });
      }
    },
    _checkKeyDown: function _checkKeyDown(evt) {
      if (evt.key === this.options.multiDragKey) {
        this.multiDragKeyDown = true;
      }
    },
    _checkKeyUp: function _checkKeyUp(evt) {
      if (evt.key === this.options.multiDragKey) {
        this.multiDragKeyDown = false;
      }
    }
  };
  return _extends(MultiDrag, {
    // Static methods & properties
    pluginName: 'multiDrag',
    utils: {
      /**
       * Selects the provided multi-drag item
       * @param  {HTMLElement} el    The element to be selected
       */
      select: function select(el) {
        var sortable = el.parentNode[expando];
        if (!sortable || !sortable.options.multiDrag || ~multiDragElements.indexOf(el)) return;

        if (multiDragSortable && multiDragSortable !== sortable) {
          multiDragSortable.multiDrag._deselectMultiDrag();

          multiDragSortable = sortable;
        }

        toggleClass(el, sortable.options.selectedClass, true);
        multiDragElements.push(el);
      },

      /**
       * Deselects the provided multi-drag item
       * @param  {HTMLElement} el    The element to be deselected
       */
      deselect: function deselect(el) {
        var sortable = el.parentNode[expando],
            index = multiDragElements.indexOf(el);
        if (!sortable || !sortable.options.multiDrag || !~index) return;
        toggleClass(el, sortable.options.selectedClass, false);
        multiDragElements.splice(index, 1);
      }
    },
    eventProperties: function eventProperties() {
      var _this3 = this;

      var oldIndicies = [],
          newIndicies = [];
      multiDragElements.forEach(function (multiDragElement) {
        oldIndicies.push({
          multiDragElement: multiDragElement,
          index: multiDragElement.sortableIndex
        }); // multiDragElements will already be sorted if folding

        var newIndex;

        if (folding && multiDragElement !== dragEl$1) {
          newIndex = -1;
        } else if (folding) {
          newIndex = index(multiDragElement, ':not(.' + _this3.options.selectedClass + ')');
        } else {
          newIndex = index(multiDragElement);
        }

        newIndicies.push({
          multiDragElement: multiDragElement,
          index: newIndex
        });
      });
      return {
        items: _toConsumableArray(multiDragElements),
        clones: [].concat(multiDragClones),
        oldIndicies: oldIndicies,
        newIndicies: newIndicies
      };
    },
    optionListeners: {
      multiDragKey: function multiDragKey(key) {
        key = key.toLowerCase();

        if (key === 'ctrl') {
          key = 'Control';
        } else if (key.length > 1) {
          key = key.charAt(0).toUpperCase() + key.substr(1);
        }

        return key;
      }
    }
  });
}

function insertMultiDragElements(clonesInserted, rootEl) {
  multiDragElements.forEach(function (multiDragElement, i) {
    var target = rootEl.children[multiDragElement.sortableIndex + (clonesInserted ? Number(i) : 0)];

    if (target) {
      rootEl.insertBefore(multiDragElement, target);
    } else {
      rootEl.appendChild(multiDragElement);
    }
  });
}
/**
 * Insert multi-drag clones
 * @param  {[Boolean]} elementsInserted  Whether the multi-drag elements are inserted
 * @param  {HTMLElement} rootEl
 */


function insertMultiDragClones(elementsInserted, rootEl) {
  multiDragClones.forEach(function (clone, i) {
    var target = rootEl.children[clone.sortableIndex + (elementsInserted ? Number(i) : 0)];

    if (target) {
      rootEl.insertBefore(clone, target);
    } else {
      rootEl.appendChild(clone);
    }
  });
}

function removeMultiDragElements() {
  multiDragElements.forEach(function (multiDragElement) {
    if (multiDragElement === dragEl$1) return;
    multiDragElement.parentNode && multiDragElement.parentNode.removeChild(multiDragElement);
  });
}

Sortable.mount(new AutoScrollPlugin());
Sortable.mount(Remove, Revert);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Sortable);



/***/ }),

/***/ "./node_modules/tslib/tslib.es6.js":
/*!*****************************************!*\
  !*** ./node_modules/tslib/tslib.es6.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "__extends": () => (/* binding */ __extends),
/* harmony export */   "__assign": () => (/* binding */ __assign),
/* harmony export */   "__rest": () => (/* binding */ __rest),
/* harmony export */   "__decorate": () => (/* binding */ __decorate),
/* harmony export */   "__param": () => (/* binding */ __param),
/* harmony export */   "__metadata": () => (/* binding */ __metadata),
/* harmony export */   "__awaiter": () => (/* binding */ __awaiter),
/* harmony export */   "__generator": () => (/* binding */ __generator),
/* harmony export */   "__createBinding": () => (/* binding */ __createBinding),
/* harmony export */   "__exportStar": () => (/* binding */ __exportStar),
/* harmony export */   "__values": () => (/* binding */ __values),
/* harmony export */   "__read": () => (/* binding */ __read),
/* harmony export */   "__spread": () => (/* binding */ __spread),
/* harmony export */   "__spreadArrays": () => (/* binding */ __spreadArrays),
/* harmony export */   "__await": () => (/* binding */ __await),
/* harmony export */   "__asyncGenerator": () => (/* binding */ __asyncGenerator),
/* harmony export */   "__asyncDelegator": () => (/* binding */ __asyncDelegator),
/* harmony export */   "__asyncValues": () => (/* binding */ __asyncValues),
/* harmony export */   "__makeTemplateObject": () => (/* binding */ __makeTemplateObject),
/* harmony export */   "__importStar": () => (/* binding */ __importStar),
/* harmony export */   "__importDefault": () => (/* binding */ __importDefault),
/* harmony export */   "__classPrivateFieldGet": () => (/* binding */ __classPrivateFieldGet),
/* harmony export */   "__classPrivateFieldSet": () => (/* binding */ __classPrivateFieldSet)
/* harmony export */ });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __createBinding(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}

function __exportStar(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}


/***/ }),

/***/ "obsidian":
/*!***************************!*\
  !*** external "obsidian" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("obsidian");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BlockDragging)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var obsidian__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! obsidian */ "obsidian");
/* harmony import */ var obsidian__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(obsidian__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _assets_styles_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assets/styles.css */ "./src/assets/styles.css");
/* harmony import */ var sortablejs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! sortablejs */ "./node_modules/sortablejs/modular/sortable.esm.js");




class BlockDragging extends obsidian__WEBPACK_IMPORTED_MODULE_0__.Plugin {
    constructor() {
        super(...arguments);
        this.map = new Map();
    }
    onload() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__awaiter)(this, void 0, void 0, function* () {
            console.log("Loading Block Dragging v" + this.manifest.version);
            yield this.loadSettings();
            this.registerMarkdownPostProcessor((el, ctx) => (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__awaiter)(this, void 0, void 0, function* () { return yield this.postprocessor(el, ctx); }));
            this.registerEvent(this.app.workspace.on("active-leaf-change", (leaf) => {
                if (!leaf.view || !(leaf.view instanceof obsidian__WEBPACK_IMPORTED_MODULE_0__.MarkdownView))
                    return;
                if (!this.app.workspace.getActiveFile())
                    return;
                if (!leaf.view.containerEl)
                    return;
                const file = this.app.workspace.getActiveFile();
                const { containerEl } = leaf.view;
                const observer = new MutationObserver((list) => {
                    for (const mutation of list) {
                        if (mutation.type === "childList" &&
                            mutation.removedNodes.length) {
                            this.map.delete(containerEl);
                            observer.disconnect();
                        }
                    }
                });
                observer.observe(containerEl.parentElement, {
                    childList: true,
                    attributes: false,
                    subtree: false
                });
                if (!this.map.has(containerEl)) {
                    this.map.set(containerEl, undefined);
                }
                const sizer = containerEl.querySelector(".markdown-preview-sizer");
                if (!sizer || !(sizer instanceof HTMLElement))
                    return;
                let list = sizer.querySelectorAll("div.block-drag-plugin-draggable-element");
                const sort = new sortablejs__WEBPACK_IMPORTED_MODULE_2__.default(sizer, {
                    draggable: "div.block-drag-plugin-draggable-element",
                    filter: ".collapse-indicator",
                    handle: ".block-drag-plugin-handle",
                    delayOnTouchOnly: true,
                    delay: 100,
                    chosenClass: "block-drag-plugin-chosen",
                    ghostClass: "block-drag-plugin-ghost",
                    onEnd: (evt) => (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__awaiter)(this, void 0, void 0, function* () {
                        let removed = 0;
                        let fileText = (yield this.app.vault.read(file)).split("\n");
                        const context = this.map.get(containerEl);
                        const mySection = context.getSectionInfo(evt.item);
                        //my text should also include my newlines
                        const myNewLines = this.getNewlinesAfterIndex(fileText, mySection.lineEnd);
                        const myStart = mySection.lineStart;
                        const myEnd = mySection.lineEnd + myNewLines + 1;
                        const myText = fileText.slice(myStart, myEnd);
                        fileText = [
                            ...fileText.slice(0, myStart),
                            ...fileText.slice(myEnd)
                        ];
                        /** The list will return the element before the dragged item if it goes forward. */
                        const iWentForward = evt.newIndex > evt.oldIndex;
                        removed += (myEnd - myStart) * Number(iWentForward);
                        const elementIAmNowBefore = list.item(evt.newDraggableIndex + Number(iWentForward));
                        const newSection = context.getSectionInfo(elementIAmNowBefore);
                        if (!newSection) {
                            fileText.push(...myText);
                            yield this.app.vault.modify(file, fileText.join("\n"));
                            return;
                        }
                        fileText = [
                            ...fileText.slice(0, newSection.lineStart - removed),
                            ...myText,
                            ...fileText.slice(newSection.lineStart - removed)
                        ];
                        console.log(fileText);
                        yield this.app.vault.modify(file, fileText.join("\n"));
                    }),
                    onStart() {
                        list = sizer.querySelectorAll("div.block-drag-plugin-draggable-element");
                    }
                });
            }));
        });
    }
    getNewlinesAfterIndex(text, index) {
        var _a;
        const toSearch = text.slice(index + 1);
        const findIndex = toSearch.findIndex((line) => line.length);
        return findIndex < 0 ? (_a = toSearch === null || toSearch === void 0 ? void 0 : toSearch.length) !== null && _a !== void 0 ? _a : 0 : findIndex;
    }
    postprocessor(el, ctx) {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__awaiter)(this, void 0, void 0, function* () {
            if (!el.childElementCount)
                return;
            if (el.querySelector("section.footnotes"))
                return;
            if (el.querySelector(".frontmatter"))
                return;
            const view = this.app.workspace.getActiveViewOfType(obsidian__WEBPACK_IMPORTED_MODULE_0__.MarkdownView);
            if (!view)
                return;
            if (!this.map.has(view.containerEl) ||
                this.map.get(view.containerEl) === undefined) {
                this.map.set(view.containerEl, ctx);
            }
            el.addClass("block-drag-plugin-draggable-element");
            el.createSpan({
                cls: "block-drag-plugin-handle",
                text: "⋮⋮"
            });
        });
    }
    onunload() {
        console.log("Unloading Block Dragging");
    }
    loadSettings() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__awaiter)(this, void 0, void 0, function* () { });
    }
    saveSettings() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__awaiter)(this, void 0, void 0, function* () { });
    }
}

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTs7O0FBR1Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRDs7QUFFaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnREFBZ0Q7O0FBRWhEO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxRQUFRO0FBQ1I7OztBQUdBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEM7O0FBRTFDO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFD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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7O0FBRXRDO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLE1BQU07OztBQUdOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTCwrREFBK0Q7O0FBRS9EO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxtQ0FBbUM7O0FBRW5DO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsT0FBTztBQUNQLE1BQU07OztBQUdOO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7O0FBR047QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBLFVBQVU7OztBQUdWO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTs7O0FBR1I7QUFDQTtBQUNBLFFBQVE7OztBQUdSO0FBQ0EsaUVBQWlFOzs7QUFHakU7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTs7O0FBR047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJCQUEyQjs7QUFFM0I7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVOzs7QUFHVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5Qjs7QUFFekI7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EseUJBQXlCOztBQUV6QjtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWixVQUFVOzs7QUFHVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBLFlBQVk7OztBQUdaO0FBQ0E7QUFDQTs7QUFFQSx3Q0FBd0M7QUFDeEM7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0M7O0FBRWhDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLDRDQUE0Qzs7QUFFNUM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSx3Q0FBd0M7OztBQUd4QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSwwQ0FBMEM7QUFDMUM7O0FBRUE7QUFDQTtBQUNBOztBQUVBLDhEQUE4RDs7QUFFOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsR0FBRzs7O0FBR2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEdBQUc7OztBQUdoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7O0FBRUE7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7O0FBRWY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEdBQUc7OztBQUdkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFdBQVcsT0FBTztBQUNsQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLGNBQWMsV0FBVztBQUN6QjtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxlQUFlLGNBQWM7QUFDN0IsZUFBZSxjQUFjO0FBQzdCLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkIsZUFBZSxRQUFRO0FBQ3ZCLGVBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjs7QUFFQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07OztBQUdOO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMENBQTBDOztBQUUxQztBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjOztBQUVkO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxhQUFhO0FBQ3pCLFlBQVksMEJBQTBCO0FBQ3RDOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsYUFBYTtBQUMxQixhQUFhO0FBQ2I7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7OztBQUdGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsRUFBRTs7O0FBR0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLGFBQWE7QUFDekIsWUFBWSw0QkFBNEI7QUFDeEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksb0NBQW9DO0FBQ2hEOzs7QUFHQTtBQUNBLHlFQUF5RSxhQUFhO0FBQ3RGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EscUZBQXFGO0FBQ3JGOztBQUVBLHVFQUF1RTtBQUN2RTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxXQUFXLGNBQWM7QUFDekIsV0FBVyxhQUFhO0FBQ3hCOzs7QUFHQTtBQUNBO0FBQ0EsR0FBRzs7O0FBR0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHVEQUF1RDs7QUFFdkQ7O0FBRUE7QUFDQSwyRUFBMkU7O0FBRTNFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjs7QUFFdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHNCQUFzQixnQkFBZ0I7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0Q7O0FBRXREOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0EsSUFBSTs7QUFFSixrQ0FBa0M7QUFDbEMsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsVUFBVTtBQUNWO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsc0JBQXNCLDhCQUE4QjtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTyxHQUFHOztBQUVWO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWCxVQUFVOzs7QUFHVjtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FB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QyxTQUFTLENBQUM7SUFDN0QsQ0FBQztJQUVLLGFBQWEsQ0FBQyxFQUFlLEVBQUUsR0FBaUM7O1lBQ2xFLElBQUksQ0FBQyxFQUFFLENBQUMsaUJBQWlCO2dCQUFFLE9BQU87WUFDbEMsSUFBSSxFQUFFLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDO2dCQUFFLE9BQU87WUFDbEQsSUFBSSxFQUFFLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQztnQkFBRSxPQUFPO1lBRTdDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLGtEQUFZLENBQUMsQ0FBQztZQUNsRSxJQUFJLENBQUMsSUFBSTtnQkFBRSxPQUFPO1lBRWxCLElBQ0ksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUMvQixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssU0FBUyxFQUM5QztnQkFDRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQ3ZDO1lBQ0QsRUFBRSxDQUFDLFFBQVEsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1lBQ25ELEVBQUUsQ0FBQyxVQUFVLENBQUM7Z0JBQ1YsR0FBRyxFQUFFLDBCQUEwQjtnQkFDL0IsSUFBSSxFQUFFLElBQUk7YUFDYixDQUFDLENBQUM7UUFDUCxDQUFDO0tBQUE7SUFFRCxRQUFRO1FBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFDSyxZQUFZO3FHQUFJLENBQUM7S0FBQTtJQUNqQixZQUFZO3FHQUFJLENBQUM7S0FBQTtDQUMxQiIsInNvdXJjZXMiOlsid2VicGFjazovL2Jsb2NrLWRyYWdnaW5nLy4vc3JjL2Fzc2V0cy9zdHlsZXMuY3NzIiwid2VicGFjazovL2Jsb2NrLWRyYWdnaW5nLy4vbm9kZV9tb2R1bGVzL3NvcnRhYmxlanMvbW9kdWxhci9zb3J0YWJsZS5lc20uanMiLCJ3ZWJwYWNrOi8vYmxvY2stZHJhZ2dpbmcvLi9ub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2LmpzIiwid2VicGFjazovL2Jsb2NrLWRyYWdnaW5nL2V4dGVybmFsIFwib2JzaWRpYW5cIiIsIndlYnBhY2s6Ly9ibG9jay1kcmFnZ2luZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9ibG9jay1kcmFnZ2luZy93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9ibG9jay1kcmFnZ2luZy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmxvY2stZHJhZ2dpbmcvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9ibG9jay1kcmFnZ2luZy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2Jsb2NrLWRyYWdnaW5nLy4vc3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLyoqIVxuICogU29ydGFibGUgMS4xNC4wXG4gKiBAYXV0aG9yXHRSdWJhWGEgICA8dHJhc2hAcnViYXhhLm9yZz5cbiAqIEBhdXRob3JcdG93ZW5tICAgIDxvd2VuMjMzNTVAZ21haWwuY29tPlxuICogQGxpY2Vuc2UgTUlUXG4gKi9cbmZ1bmN0aW9uIG93bktleXMob2JqZWN0LCBlbnVtZXJhYmxlT25seSkge1xuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iamVjdCk7XG5cbiAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcbiAgICB2YXIgc3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMob2JqZWN0KTtcblxuICAgIGlmIChlbnVtZXJhYmxlT25seSkge1xuICAgICAgc3ltYm9scyA9IHN5bWJvbHMuZmlsdGVyKGZ1bmN0aW9uIChzeW0pIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBzeW0pLmVudW1lcmFibGU7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBrZXlzLnB1c2guYXBwbHkoa2V5cywgc3ltYm9scyk7XG4gIH1cblxuICByZXR1cm4ga2V5cztcbn1cblxuZnVuY3Rpb24gX29iamVjdFNwcmVhZDIodGFyZ2V0KSB7XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXSAhPSBudWxsID8gYXJndW1lbnRzW2ldIDoge307XG5cbiAgICBpZiAoaSAlIDIpIHtcbiAgICAgIG93bktleXMoT2JqZWN0KHNvdXJjZSksIHRydWUpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBfZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHNvdXJjZVtrZXldKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoc291cmNlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG93bktleXMoT2JqZWN0KHNvdXJjZSkpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBrZXkpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7XG4gIFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjtcblxuICBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHtcbiAgICBfdHlwZW9mID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmo7XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBfdHlwZW9mID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBfdHlwZW9mKG9iaik7XG59XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHtcbiAgaWYgKGtleSBpbiBvYmopIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9ialtrZXldID0gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufVxuXG5mdW5jdGlvbiBfZXh0ZW5kcygpIHtcbiAgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcblxuICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xuICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9O1xuXG4gIHJldHVybiBfZXh0ZW5kcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5mdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShzb3VyY2UsIGV4Y2x1ZGVkKSB7XG4gIGlmIChzb3VyY2UgPT0gbnVsbCkgcmV0dXJuIHt9O1xuICB2YXIgdGFyZ2V0ID0ge307XG4gIHZhciBzb3VyY2VLZXlzID0gT2JqZWN0LmtleXMoc291cmNlKTtcbiAgdmFyIGtleSwgaTtcblxuICBmb3IgKGkgPSAwOyBpIDwgc291cmNlS2V5cy5sZW5ndGg7IGkrKykge1xuICAgIGtleSA9IHNvdXJjZUtleXNbaV07XG4gICAgaWYgKGV4Y2x1ZGVkLmluZGV4T2Yoa2V5KSA+PSAwKSBjb250aW51ZTtcbiAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuZnVuY3Rpb24gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKHNvdXJjZSwgZXhjbHVkZWQpIHtcbiAgaWYgKHNvdXJjZSA9PSBudWxsKSByZXR1cm4ge307XG5cbiAgdmFyIHRhcmdldCA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKHNvdXJjZSwgZXhjbHVkZWQpO1xuXG4gIHZhciBrZXksIGk7XG5cbiAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcbiAgICB2YXIgc291cmNlU3ltYm9sS2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoc291cmNlKTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBzb3VyY2VTeW1ib2xLZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBrZXkgPSBzb3VyY2VTeW1ib2xLZXlzW2ldO1xuICAgICAgaWYgKGV4Y2x1ZGVkLmluZGV4T2Yoa2V5KSA+PSAwKSBjb250aW51ZTtcbiAgICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHNvdXJjZSwga2V5KSkgY29udGludWU7XG4gICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHtcbiAgcmV0dXJuIF9hcnJheVdpdGhvdXRIb2xlcyhhcnIpIHx8IF9pdGVyYWJsZVRvQXJyYXkoYXJyKSB8fCBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkoYXJyKSB8fCBfbm9uSXRlcmFibGVTcHJlYWQoKTtcbn1cblxuZnVuY3Rpb24gX2FycmF5V2l0aG91dEhvbGVzKGFycikge1xuICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkoYXJyKTtcbn1cblxuZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheShpdGVyKSB7XG4gIGlmICh0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiICYmIGl0ZXJbU3ltYm9sLml0ZXJhdG9yXSAhPSBudWxsIHx8IGl0ZXJbXCJAQGl0ZXJhdG9yXCJdICE9IG51bGwpIHJldHVybiBBcnJheS5mcm9tKGl0ZXIpO1xufVxuXG5mdW5jdGlvbiBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobywgbWluTGVuKSB7XG4gIGlmICghbykgcmV0dXJuO1xuICBpZiAodHlwZW9mIG8gPT09IFwic3RyaW5nXCIpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pO1xuICB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7XG4gIGlmIChuID09PSBcIk9iamVjdFwiICYmIG8uY29uc3RydWN0b3IpIG4gPSBvLmNvbnN0cnVjdG9yLm5hbWU7XG4gIGlmIChuID09PSBcIk1hcFwiIHx8IG4gPT09IFwiU2V0XCIpIHJldHVybiBBcnJheS5mcm9tKG8pO1xuICBpZiAobiA9PT0gXCJBcmd1bWVudHNcIiB8fCAvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKSkgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7XG59XG5cbmZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7XG4gIGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGxlbik7IGkgPCBsZW47IGkrKykgYXJyMltpXSA9IGFycltpXTtcblxuICByZXR1cm4gYXJyMjtcbn1cblxuZnVuY3Rpb24gX25vbkl0ZXJhYmxlU3ByZWFkKCkge1xuICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIHNwcmVhZCBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTtcbn1cblxudmFyIHZlcnNpb24gPSBcIjEuMTQuMFwiO1xuXG5mdW5jdGlvbiB1c2VyQWdlbnQocGF0dGVybikge1xuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lm5hdmlnYXRvcikge1xuICAgIHJldHVybiAhISAvKkBfX1BVUkVfXyovbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaChwYXR0ZXJuKTtcbiAgfVxufVxuXG52YXIgSUUxMU9yTGVzcyA9IHVzZXJBZ2VudCgvKD86VHJpZGVudC4qcnZbIDpdPzExXFwufG1zaWV8aWVtb2JpbGV8V2luZG93cyBQaG9uZSkvaSk7XG52YXIgRWRnZSA9IHVzZXJBZ2VudCgvRWRnZS9pKTtcbnZhciBGaXJlRm94ID0gdXNlckFnZW50KC9maXJlZm94L2kpO1xudmFyIFNhZmFyaSA9IHVzZXJBZ2VudCgvc2FmYXJpL2kpICYmICF1c2VyQWdlbnQoL2Nocm9tZS9pKSAmJiAhdXNlckFnZW50KC9hbmRyb2lkL2kpO1xudmFyIElPUyA9IHVzZXJBZ2VudCgvaVAoYWR8b2R8aG9uZSkvaSk7XG52YXIgQ2hyb21lRm9yQW5kcm9pZCA9IHVzZXJBZ2VudCgvY2hyb21lL2kpICYmIHVzZXJBZ2VudCgvYW5kcm9pZC9pKTtcblxudmFyIGNhcHR1cmVNb2RlID0ge1xuICBjYXB0dXJlOiBmYWxzZSxcbiAgcGFzc2l2ZTogZmFsc2Vcbn07XG5cbmZ1bmN0aW9uIG9uKGVsLCBldmVudCwgZm4pIHtcbiAgZWwuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZm4sICFJRTExT3JMZXNzICYmIGNhcHR1cmVNb2RlKTtcbn1cblxuZnVuY3Rpb24gb2ZmKGVsLCBldmVudCwgZm4pIHtcbiAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgZm4sICFJRTExT3JMZXNzICYmIGNhcHR1cmVNb2RlKTtcbn1cblxuZnVuY3Rpb24gbWF0Y2hlcyhcbi8qKkhUTUxFbGVtZW50Ki9cbmVsLFxuLyoqU3RyaW5nKi9cbnNlbGVjdG9yKSB7XG4gIGlmICghc2VsZWN0b3IpIHJldHVybjtcbiAgc2VsZWN0b3JbMF0gPT09ICc+JyAmJiAoc2VsZWN0b3IgPSBzZWxlY3Rvci5zdWJzdHJpbmcoMSkpO1xuXG4gIGlmIChlbCkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoZWwubWF0Y2hlcykge1xuICAgICAgICByZXR1cm4gZWwubWF0Y2hlcyhzZWxlY3Rvcik7XG4gICAgICB9IGVsc2UgaWYgKGVsLm1zTWF0Y2hlc1NlbGVjdG9yKSB7XG4gICAgICAgIHJldHVybiBlbC5tc01hdGNoZXNTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICB9IGVsc2UgaWYgKGVsLndlYmtpdE1hdGNoZXNTZWxlY3Rvcikge1xuICAgICAgICByZXR1cm4gZWwud2Via2l0TWF0Y2hlc1NlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChfKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBnZXRQYXJlbnRPckhvc3QoZWwpIHtcbiAgcmV0dXJuIGVsLmhvc3QgJiYgZWwgIT09IGRvY3VtZW50ICYmIGVsLmhvc3Qubm9kZVR5cGUgPyBlbC5ob3N0IDogZWwucGFyZW50Tm9kZTtcbn1cblxuZnVuY3Rpb24gY2xvc2VzdChcbi8qKkhUTUxFbGVtZW50Ki9cbmVsLFxuLyoqU3RyaW5nKi9cbnNlbGVjdG9yLFxuLyoqSFRNTEVsZW1lbnQqL1xuY3R4LCBpbmNsdWRlQ1RYKSB7XG4gIGlmIChlbCkge1xuICAgIGN0eCA9IGN0eCB8fCBkb2N1bWVudDtcblxuICAgIGRvIHtcbiAgICAgIGlmIChzZWxlY3RvciAhPSBudWxsICYmIChzZWxlY3RvclswXSA9PT0gJz4nID8gZWwucGFyZW50Tm9kZSA9PT0gY3R4ICYmIG1hdGNoZXMoZWwsIHNlbGVjdG9yKSA6IG1hdGNoZXMoZWwsIHNlbGVjdG9yKSkgfHwgaW5jbHVkZUNUWCAmJiBlbCA9PT0gY3R4KSB7XG4gICAgICAgIHJldHVybiBlbDtcbiAgICAgIH1cblxuICAgICAgaWYgKGVsID09PSBjdHgpIGJyZWFrO1xuICAgICAgLyoganNoaW50IGJvc3M6dHJ1ZSAqL1xuICAgIH0gd2hpbGUgKGVsID0gZ2V0UGFyZW50T3JIb3N0KGVsKSk7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxudmFyIFJfU1BBQ0UgPSAvXFxzKy9nO1xuXG5mdW5jdGlvbiB0b2dnbGVDbGFzcyhlbCwgbmFtZSwgc3RhdGUpIHtcbiAgaWYgKGVsICYmIG5hbWUpIHtcbiAgICBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgICBlbC5jbGFzc0xpc3Rbc3RhdGUgPyAnYWRkJyA6ICdyZW1vdmUnXShuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGNsYXNzTmFtZSA9ICgnICcgKyBlbC5jbGFzc05hbWUgKyAnICcpLnJlcGxhY2UoUl9TUEFDRSwgJyAnKS5yZXBsYWNlKCcgJyArIG5hbWUgKyAnICcsICcgJyk7XG4gICAgICBlbC5jbGFzc05hbWUgPSAoY2xhc3NOYW1lICsgKHN0YXRlID8gJyAnICsgbmFtZSA6ICcnKSkucmVwbGFjZShSX1NQQUNFLCAnICcpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBjc3MoZWwsIHByb3AsIHZhbCkge1xuICB2YXIgc3R5bGUgPSBlbCAmJiBlbC5zdHlsZTtcblxuICBpZiAoc3R5bGUpIHtcbiAgICBpZiAodmFsID09PSB2b2lkIDApIHtcbiAgICAgIGlmIChkb2N1bWVudC5kZWZhdWx0VmlldyAmJiBkb2N1bWVudC5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKSB7XG4gICAgICAgIHZhbCA9IGRvY3VtZW50LmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGUoZWwsICcnKTtcbiAgICAgIH0gZWxzZSBpZiAoZWwuY3VycmVudFN0eWxlKSB7XG4gICAgICAgIHZhbCA9IGVsLmN1cnJlbnRTdHlsZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb3AgPT09IHZvaWQgMCA/IHZhbCA6IHZhbFtwcm9wXTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCEocHJvcCBpbiBzdHlsZSkgJiYgcHJvcC5pbmRleE9mKCd3ZWJraXQnKSA9PT0gLTEpIHtcbiAgICAgICAgcHJvcCA9ICctd2Via2l0LScgKyBwcm9wO1xuICAgICAgfVxuXG4gICAgICBzdHlsZVtwcm9wXSA9IHZhbCArICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJyA/ICcnIDogJ3B4Jyk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIG1hdHJpeChlbCwgc2VsZk9ubHkpIHtcbiAgdmFyIGFwcGxpZWRUcmFuc2Zvcm1zID0gJyc7XG5cbiAgaWYgKHR5cGVvZiBlbCA9PT0gJ3N0cmluZycpIHtcbiAgICBhcHBsaWVkVHJhbnNmb3JtcyA9IGVsO1xuICB9IGVsc2Uge1xuICAgIGRvIHtcbiAgICAgIHZhciB0cmFuc2Zvcm0gPSBjc3MoZWwsICd0cmFuc2Zvcm0nKTtcblxuICAgICAgaWYgKHRyYW5zZm9ybSAmJiB0cmFuc2Zvcm0gIT09ICdub25lJykge1xuICAgICAgICBhcHBsaWVkVHJhbnNmb3JtcyA9IHRyYW5zZm9ybSArICcgJyArIGFwcGxpZWRUcmFuc2Zvcm1zO1xuICAgICAgfVxuICAgICAgLyoganNoaW50IGJvc3M6dHJ1ZSAqL1xuXG4gICAgfSB3aGlsZSAoIXNlbGZPbmx5ICYmIChlbCA9IGVsLnBhcmVudE5vZGUpKTtcbiAgfVxuXG4gIHZhciBtYXRyaXhGbiA9IHdpbmRvdy5ET01NYXRyaXggfHwgd2luZG93LldlYktpdENTU01hdHJpeCB8fCB3aW5kb3cuQ1NTTWF0cml4IHx8IHdpbmRvdy5NU0NTU01hdHJpeDtcbiAgLypqc2hpbnQgLVcwNTYgKi9cblxuICByZXR1cm4gbWF0cml4Rm4gJiYgbmV3IG1hdHJpeEZuKGFwcGxpZWRUcmFuc2Zvcm1zKTtcbn1cblxuZnVuY3Rpb24gZmluZChjdHgsIHRhZ05hbWUsIGl0ZXJhdG9yKSB7XG4gIGlmIChjdHgpIHtcbiAgICB2YXIgbGlzdCA9IGN0eC5nZXRFbGVtZW50c0J5VGFnTmFtZSh0YWdOYW1lKSxcbiAgICAgICAgaSA9IDAsXG4gICAgICAgIG4gPSBsaXN0Lmxlbmd0aDtcblxuICAgIGlmIChpdGVyYXRvcikge1xuICAgICAgZm9yICg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgaXRlcmF0b3IobGlzdFtpXSwgaSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGxpc3Q7XG4gIH1cblxuICByZXR1cm4gW107XG59XG5cbmZ1bmN0aW9uIGdldFdpbmRvd1Njcm9sbGluZ0VsZW1lbnQoKSB7XG4gIHZhciBzY3JvbGxpbmdFbGVtZW50ID0gZG9jdW1lbnQuc2Nyb2xsaW5nRWxlbWVudDtcblxuICBpZiAoc2Nyb2xsaW5nRWxlbWVudCkge1xuICAgIHJldHVybiBzY3JvbGxpbmdFbGVtZW50O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gIH1cbn1cbi8qKlxuICogUmV0dXJucyB0aGUgXCJib3VuZGluZyBjbGllbnQgcmVjdFwiIG9mIGdpdmVuIGVsZW1lbnRcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbCAgICAgICAgICAgICAgICAgICAgICAgVGhlIGVsZW1lbnQgd2hvc2UgYm91bmRpbmdDbGllbnRSZWN0IGlzIHdhbnRlZFxuICogQHBhcmFtICB7W0Jvb2xlYW5dfSByZWxhdGl2ZVRvQ29udGFpbmluZ0Jsb2NrICBXaGV0aGVyIHRoZSByZWN0IHNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGUgY29udGFpbmluZyBibG9jayBvZiAoaW5jbHVkaW5nKSB0aGUgY29udGFpbmVyXG4gKiBAcGFyYW0gIHtbQm9vbGVhbl19IHJlbGF0aXZlVG9Ob25TdGF0aWNQYXJlbnQgIFdoZXRoZXIgdGhlIHJlY3Qgc2hvdWxkIGJlIHJlbGF0aXZlIHRvIHRoZSByZWxhdGl2ZSBwYXJlbnQgb2YgKGluY2x1ZGluZykgdGhlIGNvbnRhaWVuclxuICogQHBhcmFtICB7W0Jvb2xlYW5dfSB1bmRvU2NhbGUgICAgICAgICAgICAgICAgICBXaGV0aGVyIHRoZSBjb250YWluZXIncyBzY2FsZSgpIHNob3VsZCBiZSB1bmRvbmVcbiAqIEBwYXJhbSAge1tIVE1MRWxlbWVudF19IGNvbnRhaW5lciAgICAgICAgICAgICAgVGhlIHBhcmVudCB0aGUgZWxlbWVudCB3aWxsIGJlIHBsYWNlZCBpblxuICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgYm91bmRpbmdDbGllbnRSZWN0IG9mIGVsLCB3aXRoIHNwZWNpZmllZCBhZGp1c3RtZW50c1xuICovXG5cblxuZnVuY3Rpb24gZ2V0UmVjdChlbCwgcmVsYXRpdmVUb0NvbnRhaW5pbmdCbG9jaywgcmVsYXRpdmVUb05vblN0YXRpY1BhcmVudCwgdW5kb1NjYWxlLCBjb250YWluZXIpIHtcbiAgaWYgKCFlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QgJiYgZWwgIT09IHdpbmRvdykgcmV0dXJuO1xuICB2YXIgZWxSZWN0LCB0b3AsIGxlZnQsIGJvdHRvbSwgcmlnaHQsIGhlaWdodCwgd2lkdGg7XG5cbiAgaWYgKGVsICE9PSB3aW5kb3cgJiYgZWwucGFyZW50Tm9kZSAmJiBlbCAhPT0gZ2V0V2luZG93U2Nyb2xsaW5nRWxlbWVudCgpKSB7XG4gICAgZWxSZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgdG9wID0gZWxSZWN0LnRvcDtcbiAgICBsZWZ0ID0gZWxSZWN0LmxlZnQ7XG4gICAgYm90dG9tID0gZWxSZWN0LmJvdHRvbTtcbiAgICByaWdodCA9IGVsUmVjdC5yaWdodDtcbiAgICBoZWlnaHQgPSBlbFJlY3QuaGVpZ2h0O1xuICAgIHdpZHRoID0gZWxSZWN0LndpZHRoO1xuICB9IGVsc2Uge1xuICAgIHRvcCA9IDA7XG4gICAgbGVmdCA9IDA7XG4gICAgYm90dG9tID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIHJpZ2h0ID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gIH1cblxuICBpZiAoKHJlbGF0aXZlVG9Db250YWluaW5nQmxvY2sgfHwgcmVsYXRpdmVUb05vblN0YXRpY1BhcmVudCkgJiYgZWwgIT09IHdpbmRvdykge1xuICAgIC8vIEFkanVzdCBmb3IgdHJhbnNsYXRlKClcbiAgICBjb250YWluZXIgPSBjb250YWluZXIgfHwgZWwucGFyZW50Tm9kZTsgLy8gc29sdmVzICMxMTIzIChzZWU6IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zNzk1MzgwNi82MDg4MzEyKVxuICAgIC8vIE5vdCBuZWVkZWQgb24gPD0gSUUxMVxuXG4gICAgaWYgKCFJRTExT3JMZXNzKSB7XG4gICAgICBkbyB7XG4gICAgICAgIGlmIChjb250YWluZXIgJiYgY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCAmJiAoY3NzKGNvbnRhaW5lciwgJ3RyYW5zZm9ybScpICE9PSAnbm9uZScgfHwgcmVsYXRpdmVUb05vblN0YXRpY1BhcmVudCAmJiBjc3MoY29udGFpbmVyLCAncG9zaXRpb24nKSAhPT0gJ3N0YXRpYycpKSB7XG4gICAgICAgICAgdmFyIGNvbnRhaW5lclJlY3QgPSBjb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7IC8vIFNldCByZWxhdGl2ZSB0byBlZGdlcyBvZiBwYWRkaW5nIGJveCBvZiBjb250YWluZXJcblxuICAgICAgICAgIHRvcCAtPSBjb250YWluZXJSZWN0LnRvcCArIHBhcnNlSW50KGNzcyhjb250YWluZXIsICdib3JkZXItdG9wLXdpZHRoJykpO1xuICAgICAgICAgIGxlZnQgLT0gY29udGFpbmVyUmVjdC5sZWZ0ICsgcGFyc2VJbnQoY3NzKGNvbnRhaW5lciwgJ2JvcmRlci1sZWZ0LXdpZHRoJykpO1xuICAgICAgICAgIGJvdHRvbSA9IHRvcCArIGVsUmVjdC5oZWlnaHQ7XG4gICAgICAgICAgcmlnaHQgPSBsZWZ0ICsgZWxSZWN0LndpZHRoO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIC8qIGpzaGludCBib3NzOnRydWUgKi9cblxuICAgICAgfSB3aGlsZSAoY29udGFpbmVyID0gY29udGFpbmVyLnBhcmVudE5vZGUpO1xuICAgIH1cbiAgfVxuXG4gIGlmICh1bmRvU2NhbGUgJiYgZWwgIT09IHdpbmRvdykge1xuICAgIC8vIEFkanVzdCBmb3Igc2NhbGUoKVxuICAgIHZhciBlbE1hdHJpeCA9IG1hdHJpeChjb250YWluZXIgfHwgZWwpLFxuICAgICAgICBzY2FsZVggPSBlbE1hdHJpeCAmJiBlbE1hdHJpeC5hLFxuICAgICAgICBzY2FsZVkgPSBlbE1hdHJpeCAmJiBlbE1hdHJpeC5kO1xuXG4gICAgaWYgKGVsTWF0cml4KSB7XG4gICAgICB0b3AgLz0gc2NhbGVZO1xuICAgICAgbGVmdCAvPSBzY2FsZVg7XG4gICAgICB3aWR0aCAvPSBzY2FsZVg7XG4gICAgICBoZWlnaHQgLz0gc2NhbGVZO1xuICAgICAgYm90dG9tID0gdG9wICsgaGVpZ2h0O1xuICAgICAgcmlnaHQgPSBsZWZ0ICsgd2lkdGg7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0b3A6IHRvcCxcbiAgICBsZWZ0OiBsZWZ0LFxuICAgIGJvdHRvbTogYm90dG9tLFxuICAgIHJpZ2h0OiByaWdodCxcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHRcbiAgfTtcbn1cbi8qKlxuICogQ2hlY2tzIGlmIGEgc2lkZSBvZiBhbiBlbGVtZW50IGlzIHNjcm9sbGVkIHBhc3QgYSBzaWRlIG9mIGl0cyBwYXJlbnRzXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gIGVsICAgICAgICAgICBUaGUgZWxlbWVudCB3aG8ncyBzaWRlIGJlaW5nIHNjcm9sbGVkIG91dCBvZiB2aWV3IGlzIGluIHF1ZXN0aW9uXG4gKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAgIGVsU2lkZSAgICAgICBTaWRlIG9mIHRoZSBlbGVtZW50IGluIHF1ZXN0aW9uICgndG9wJywgJ2xlZnQnLCAncmlnaHQnLCAnYm90dG9tJylcbiAqIEBwYXJhbSAge1N0cmluZ30gICAgICAgcGFyZW50U2lkZSAgIFNpZGUgb2YgdGhlIHBhcmVudCBpbiBxdWVzdGlvbiAoJ3RvcCcsICdsZWZ0JywgJ3JpZ2h0JywgJ2JvdHRvbScpXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudH0gICAgICAgICAgICAgICBUaGUgcGFyZW50IHNjcm9sbCBlbGVtZW50IHRoYXQgdGhlIGVsJ3Mgc2lkZSBpcyBzY3JvbGxlZCBwYXN0LCBvciBudWxsIGlmIHRoZXJlIGlzIG5vIHN1Y2ggZWxlbWVudFxuICovXG5cblxuZnVuY3Rpb24gaXNTY3JvbGxlZFBhc3QoZWwsIGVsU2lkZSwgcGFyZW50U2lkZSkge1xuICB2YXIgcGFyZW50ID0gZ2V0UGFyZW50QXV0b1Njcm9sbEVsZW1lbnQoZWwsIHRydWUpLFxuICAgICAgZWxTaWRlVmFsID0gZ2V0UmVjdChlbClbZWxTaWRlXTtcbiAgLyoganNoaW50IGJvc3M6dHJ1ZSAqL1xuXG4gIHdoaWxlIChwYXJlbnQpIHtcbiAgICB2YXIgcGFyZW50U2lkZVZhbCA9IGdldFJlY3QocGFyZW50KVtwYXJlbnRTaWRlXSxcbiAgICAgICAgdmlzaWJsZSA9IHZvaWQgMDtcblxuICAgIGlmIChwYXJlbnRTaWRlID09PSAndG9wJyB8fCBwYXJlbnRTaWRlID09PSAnbGVmdCcpIHtcbiAgICAgIHZpc2libGUgPSBlbFNpZGVWYWwgPj0gcGFyZW50U2lkZVZhbDtcbiAgICB9IGVsc2Uge1xuICAgICAgdmlzaWJsZSA9IGVsU2lkZVZhbCA8PSBwYXJlbnRTaWRlVmFsO1xuICAgIH1cblxuICAgIGlmICghdmlzaWJsZSkgcmV0dXJuIHBhcmVudDtcbiAgICBpZiAocGFyZW50ID09PSBnZXRXaW5kb3dTY3JvbGxpbmdFbGVtZW50KCkpIGJyZWFrO1xuICAgIHBhcmVudCA9IGdldFBhcmVudEF1dG9TY3JvbGxFbGVtZW50KHBhcmVudCwgZmFsc2UpO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuLyoqXG4gKiBHZXRzIG50aCBjaGlsZCBvZiBlbCwgaWdub3JpbmcgaGlkZGVuIGNoaWxkcmVuLCBzb3J0YWJsZSdzIGVsZW1lbnRzIChkb2VzIG5vdCBpZ25vcmUgY2xvbmUgaWYgaXQncyB2aXNpYmxlKVxuICogYW5kIG5vbi1kcmFnZ2FibGUgZWxlbWVudHNcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbCAgICAgICBUaGUgcGFyZW50IGVsZW1lbnRcbiAqIEBwYXJhbSAge051bWJlcn0gY2hpbGROdW0gICAgICBUaGUgaW5kZXggb2YgdGhlIGNoaWxkXG4gKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnMgICAgICAgUGFyZW50IFNvcnRhYmxlJ3Mgb3B0aW9uc1xuICogQHJldHVybiB7SFRNTEVsZW1lbnR9ICAgICAgICAgIFRoZSBjaGlsZCBhdCBpbmRleCBjaGlsZE51bSwgb3IgbnVsbCBpZiBub3QgZm91bmRcbiAqL1xuXG5cbmZ1bmN0aW9uIGdldENoaWxkKGVsLCBjaGlsZE51bSwgb3B0aW9ucywgaW5jbHVkZURyYWdFbCkge1xuICB2YXIgY3VycmVudENoaWxkID0gMCxcbiAgICAgIGkgPSAwLFxuICAgICAgY2hpbGRyZW4gPSBlbC5jaGlsZHJlbjtcblxuICB3aGlsZSAoaSA8IGNoaWxkcmVuLmxlbmd0aCkge1xuICAgIGlmIChjaGlsZHJlbltpXS5zdHlsZS5kaXNwbGF5ICE9PSAnbm9uZScgJiYgY2hpbGRyZW5baV0gIT09IFNvcnRhYmxlLmdob3N0ICYmIChpbmNsdWRlRHJhZ0VsIHx8IGNoaWxkcmVuW2ldICE9PSBTb3J0YWJsZS5kcmFnZ2VkKSAmJiBjbG9zZXN0KGNoaWxkcmVuW2ldLCBvcHRpb25zLmRyYWdnYWJsZSwgZWwsIGZhbHNlKSkge1xuICAgICAgaWYgKGN1cnJlbnRDaGlsZCA9PT0gY2hpbGROdW0pIHtcbiAgICAgICAgcmV0dXJuIGNoaWxkcmVuW2ldO1xuICAgICAgfVxuXG4gICAgICBjdXJyZW50Q2hpbGQrKztcbiAgICB9XG5cbiAgICBpKys7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cbi8qKlxuICogR2V0cyB0aGUgbGFzdCBjaGlsZCBpbiB0aGUgZWwsIGlnbm9yaW5nIGdob3N0RWwgb3IgaW52aXNpYmxlIGVsZW1lbnRzIChjbG9uZXMpXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWwgICAgICAgUGFyZW50IGVsZW1lbnRcbiAqIEBwYXJhbSAge3NlbGVjdG9yfSBzZWxlY3RvciAgICBBbnkgb3RoZXIgZWxlbWVudHMgdGhhdCBzaG91bGQgYmUgaWdub3JlZFxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9ICAgICAgICAgIFRoZSBsYXN0IGNoaWxkLCBpZ25vcmluZyBnaG9zdEVsXG4gKi9cblxuXG5mdW5jdGlvbiBsYXN0Q2hpbGQoZWwsIHNlbGVjdG9yKSB7XG4gIHZhciBsYXN0ID0gZWwubGFzdEVsZW1lbnRDaGlsZDtcblxuICB3aGlsZSAobGFzdCAmJiAobGFzdCA9PT0gU29ydGFibGUuZ2hvc3QgfHwgY3NzKGxhc3QsICdkaXNwbGF5JykgPT09ICdub25lJyB8fCBzZWxlY3RvciAmJiAhbWF0Y2hlcyhsYXN0LCBzZWxlY3RvcikpKSB7XG4gICAgbGFzdCA9IGxhc3QucHJldmlvdXNFbGVtZW50U2libGluZztcbiAgfVxuXG4gIHJldHVybiBsYXN0IHx8IG51bGw7XG59XG4vKipcbiAqIFJldHVybnMgdGhlIGluZGV4IG9mIGFuIGVsZW1lbnQgd2l0aGluIGl0cyBwYXJlbnQgZm9yIGEgc2VsZWN0ZWQgc2V0IG9mXG4gKiBlbGVtZW50c1xuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsXG4gKiBAcGFyYW0gIHtzZWxlY3Rvcn0gc2VsZWN0b3JcbiAqIEByZXR1cm4ge251bWJlcn1cbiAqL1xuXG5cbmZ1bmN0aW9uIGluZGV4KGVsLCBzZWxlY3Rvcikge1xuICB2YXIgaW5kZXggPSAwO1xuXG4gIGlmICghZWwgfHwgIWVsLnBhcmVudE5vZGUpIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cbiAgLyoganNoaW50IGJvc3M6dHJ1ZSAqL1xuXG5cbiAgd2hpbGUgKGVsID0gZWwucHJldmlvdXNFbGVtZW50U2libGluZykge1xuICAgIGlmIChlbC5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpICE9PSAnVEVNUExBVEUnICYmIGVsICE9PSBTb3J0YWJsZS5jbG9uZSAmJiAoIXNlbGVjdG9yIHx8IG1hdGNoZXMoZWwsIHNlbGVjdG9yKSkpIHtcbiAgICAgIGluZGV4Kys7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGluZGV4O1xufVxuLyoqXG4gKiBSZXR1cm5zIHRoZSBzY3JvbGwgb2Zmc2V0IG9mIHRoZSBnaXZlbiBlbGVtZW50LCBhZGRlZCB3aXRoIGFsbCB0aGUgc2Nyb2xsIG9mZnNldHMgb2YgcGFyZW50IGVsZW1lbnRzLlxuICogVGhlIHZhbHVlIGlzIHJldHVybmVkIGluIHJlYWwgcGl4ZWxzLlxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsXG4gKiBAcmV0dXJuIHtBcnJheX0gICAgICAgICAgICAgT2Zmc2V0cyBpbiB0aGUgZm9ybWF0IG9mIFtsZWZ0LCB0b3BdXG4gKi9cblxuXG5mdW5jdGlvbiBnZXRSZWxhdGl2ZVNjcm9sbE9mZnNldChlbCkge1xuICB2YXIgb2Zmc2V0TGVmdCA9IDAsXG4gICAgICBvZmZzZXRUb3AgPSAwLFxuICAgICAgd2luU2Nyb2xsZXIgPSBnZXRXaW5kb3dTY3JvbGxpbmdFbGVtZW50KCk7XG5cbiAgaWYgKGVsKSB7XG4gICAgZG8ge1xuICAgICAgdmFyIGVsTWF0cml4ID0gbWF0cml4KGVsKSxcbiAgICAgICAgICBzY2FsZVggPSBlbE1hdHJpeC5hLFxuICAgICAgICAgIHNjYWxlWSA9IGVsTWF0cml4LmQ7XG4gICAgICBvZmZzZXRMZWZ0ICs9IGVsLnNjcm9sbExlZnQgKiBzY2FsZVg7XG4gICAgICBvZmZzZXRUb3AgKz0gZWwuc2Nyb2xsVG9wICogc2NhbGVZO1xuICAgIH0gd2hpbGUgKGVsICE9PSB3aW5TY3JvbGxlciAmJiAoZWwgPSBlbC5wYXJlbnROb2RlKSk7XG4gIH1cblxuICByZXR1cm4gW29mZnNldExlZnQsIG9mZnNldFRvcF07XG59XG4vKipcbiAqIFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBvYmplY3Qgd2l0aGluIHRoZSBnaXZlbiBhcnJheVxuICogQHBhcmFtICB7QXJyYXl9IGFyciAgIEFycmF5IHRoYXQgbWF5IG9yIG1heSBub3QgaG9sZCB0aGUgb2JqZWN0XG4gKiBAcGFyYW0gIHtPYmplY3R9IG9iaiAgQW4gb2JqZWN0IHRoYXQgaGFzIGEga2V5LXZhbHVlIHBhaXIgdW5pcXVlIHRvIGFuZCBpZGVudGljYWwgdG8gYSBrZXktdmFsdWUgcGFpciBpbiB0aGUgb2JqZWN0IHlvdSB3YW50IHRvIGZpbmRcbiAqIEByZXR1cm4ge051bWJlcn0gICAgICBUaGUgaW5kZXggb2YgdGhlIG9iamVjdCBpbiB0aGUgYXJyYXksIG9yIC0xXG4gKi9cblxuXG5mdW5jdGlvbiBpbmRleE9mT2JqZWN0KGFyciwgb2JqKSB7XG4gIGZvciAodmFyIGkgaW4gYXJyKSB7XG4gICAgaWYgKCFhcnIuaGFzT3duUHJvcGVydHkoaSkpIGNvbnRpbnVlO1xuXG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIG9ialtrZXldID09PSBhcnJbaV1ba2V5XSkgcmV0dXJuIE51bWJlcihpKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gLTE7XG59XG5cbmZ1bmN0aW9uIGdldFBhcmVudEF1dG9TY3JvbGxFbGVtZW50KGVsLCBpbmNsdWRlU2VsZikge1xuICAvLyBza2lwIHRvIHdpbmRvd1xuICBpZiAoIWVsIHx8ICFlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QpIHJldHVybiBnZXRXaW5kb3dTY3JvbGxpbmdFbGVtZW50KCk7XG4gIHZhciBlbGVtID0gZWw7XG4gIHZhciBnb3RTZWxmID0gZmFsc2U7XG5cbiAgZG8ge1xuICAgIC8vIHdlIGRvbid0IG5lZWQgdG8gZ2V0IGVsZW0gY3NzIGlmIGl0IGlzbid0IGV2ZW4gb3ZlcmZsb3dpbmcgaW4gdGhlIGZpcnN0IHBsYWNlIChwZXJmb3JtYW5jZSlcbiAgICBpZiAoZWxlbS5jbGllbnRXaWR0aCA8IGVsZW0uc2Nyb2xsV2lkdGggfHwgZWxlbS5jbGllbnRIZWlnaHQgPCBlbGVtLnNjcm9sbEhlaWdodCkge1xuICAgICAgdmFyIGVsZW1DU1MgPSBjc3MoZWxlbSk7XG5cbiAgICAgIGlmIChlbGVtLmNsaWVudFdpZHRoIDwgZWxlbS5zY3JvbGxXaWR0aCAmJiAoZWxlbUNTUy5vdmVyZmxvd1ggPT0gJ2F1dG8nIHx8IGVsZW1DU1Mub3ZlcmZsb3dYID09ICdzY3JvbGwnKSB8fCBlbGVtLmNsaWVudEhlaWdodCA8IGVsZW0uc2Nyb2xsSGVpZ2h0ICYmIChlbGVtQ1NTLm92ZXJmbG93WSA9PSAnYXV0bycgfHwgZWxlbUNTUy5vdmVyZmxvd1kgPT0gJ3Njcm9sbCcpKSB7XG4gICAgICAgIGlmICghZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QgfHwgZWxlbSA9PT0gZG9jdW1lbnQuYm9keSkgcmV0dXJuIGdldFdpbmRvd1Njcm9sbGluZ0VsZW1lbnQoKTtcbiAgICAgICAgaWYgKGdvdFNlbGYgfHwgaW5jbHVkZVNlbGYpIHJldHVybiBlbGVtO1xuICAgICAgICBnb3RTZWxmID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgLyoganNoaW50IGJvc3M6dHJ1ZSAqL1xuXG4gIH0gd2hpbGUgKGVsZW0gPSBlbGVtLnBhcmVudE5vZGUpO1xuXG4gIHJldHVybiBnZXRXaW5kb3dTY3JvbGxpbmdFbGVtZW50KCk7XG59XG5cbmZ1bmN0aW9uIGV4dGVuZChkc3QsIHNyYykge1xuICBpZiAoZHN0ICYmIHNyYykge1xuICAgIGZvciAodmFyIGtleSBpbiBzcmMpIHtcbiAgICAgIGlmIChzcmMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBkc3Rba2V5XSA9IHNyY1trZXldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkc3Q7XG59XG5cbmZ1bmN0aW9uIGlzUmVjdEVxdWFsKHJlY3QxLCByZWN0Mikge1xuICByZXR1cm4gTWF0aC5yb3VuZChyZWN0MS50b3ApID09PSBNYXRoLnJvdW5kKHJlY3QyLnRvcCkgJiYgTWF0aC5yb3VuZChyZWN0MS5sZWZ0KSA9PT0gTWF0aC5yb3VuZChyZWN0Mi5sZWZ0KSAmJiBNYXRoLnJvdW5kKHJlY3QxLmhlaWdodCkgPT09IE1hdGgucm91bmQocmVjdDIuaGVpZ2h0KSAmJiBNYXRoLnJvdW5kKHJlY3QxLndpZHRoKSA9PT0gTWF0aC5yb3VuZChyZWN0Mi53aWR0aCk7XG59XG5cbnZhciBfdGhyb3R0bGVUaW1lb3V0O1xuXG5mdW5jdGlvbiB0aHJvdHRsZShjYWxsYmFjaywgbXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIV90aHJvdHRsZVRpbWVvdXQpIHtcbiAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICAgIF90aGlzID0gdGhpcztcblxuICAgICAgaWYgKGFyZ3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwoX3RoaXMsIGFyZ3NbMF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2suYXBwbHkoX3RoaXMsIGFyZ3MpO1xuICAgICAgfVxuXG4gICAgICBfdGhyb3R0bGVUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIF90aHJvdHRsZVRpbWVvdXQgPSB2b2lkIDA7XG4gICAgICB9LCBtcyk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBjYW5jZWxUaHJvdHRsZSgpIHtcbiAgY2xlYXJUaW1lb3V0KF90aHJvdHRsZVRpbWVvdXQpO1xuICBfdGhyb3R0bGVUaW1lb3V0ID0gdm9pZCAwO1xufVxuXG5mdW5jdGlvbiBzY3JvbGxCeShlbCwgeCwgeSkge1xuICBlbC5zY3JvbGxMZWZ0ICs9IHg7XG4gIGVsLnNjcm9sbFRvcCArPSB5O1xufVxuXG5mdW5jdGlvbiBjbG9uZShlbCkge1xuICB2YXIgUG9seW1lciA9IHdpbmRvdy5Qb2x5bWVyO1xuICB2YXIgJCA9IHdpbmRvdy5qUXVlcnkgfHwgd2luZG93LlplcHRvO1xuXG4gIGlmIChQb2x5bWVyICYmIFBvbHltZXIuZG9tKSB7XG4gICAgcmV0dXJuIFBvbHltZXIuZG9tKGVsKS5jbG9uZU5vZGUodHJ1ZSk7XG4gIH0gZWxzZSBpZiAoJCkge1xuICAgIHJldHVybiAkKGVsKS5jbG9uZSh0cnVlKVswXTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZWwuY2xvbmVOb2RlKHRydWUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldFJlY3QoZWwsIHJlY3QpIHtcbiAgY3NzKGVsLCAncG9zaXRpb24nLCAnYWJzb2x1dGUnKTtcbiAgY3NzKGVsLCAndG9wJywgcmVjdC50b3ApO1xuICBjc3MoZWwsICdsZWZ0JywgcmVjdC5sZWZ0KTtcbiAgY3NzKGVsLCAnd2lkdGgnLCByZWN0LndpZHRoKTtcbiAgY3NzKGVsLCAnaGVpZ2h0JywgcmVjdC5oZWlnaHQpO1xufVxuXG5mdW5jdGlvbiB1bnNldFJlY3QoZWwpIHtcbiAgY3NzKGVsLCAncG9zaXRpb24nLCAnJyk7XG4gIGNzcyhlbCwgJ3RvcCcsICcnKTtcbiAgY3NzKGVsLCAnbGVmdCcsICcnKTtcbiAgY3NzKGVsLCAnd2lkdGgnLCAnJyk7XG4gIGNzcyhlbCwgJ2hlaWdodCcsICcnKTtcbn1cblxudmFyIGV4cGFuZG8gPSAnU29ydGFibGUnICsgbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbmZ1bmN0aW9uIEFuaW1hdGlvblN0YXRlTWFuYWdlcigpIHtcbiAgdmFyIGFuaW1hdGlvblN0YXRlcyA9IFtdLFxuICAgICAgYW5pbWF0aW9uQ2FsbGJhY2tJZDtcbiAgcmV0dXJuIHtcbiAgICBjYXB0dXJlQW5pbWF0aW9uU3RhdGU6IGZ1bmN0aW9uIGNhcHR1cmVBbmltYXRpb25TdGF0ZSgpIHtcbiAgICAgIGFuaW1hdGlvblN0YXRlcyA9IFtdO1xuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuYW5pbWF0aW9uKSByZXR1cm47XG4gICAgICB2YXIgY2hpbGRyZW4gPSBbXS5zbGljZS5jYWxsKHRoaXMuZWwuY2hpbGRyZW4pO1xuICAgICAgY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgICAgaWYgKGNzcyhjaGlsZCwgJ2Rpc3BsYXknKSA9PT0gJ25vbmUnIHx8IGNoaWxkID09PSBTb3J0YWJsZS5naG9zdCkgcmV0dXJuO1xuICAgICAgICBhbmltYXRpb25TdGF0ZXMucHVzaCh7XG4gICAgICAgICAgdGFyZ2V0OiBjaGlsZCxcbiAgICAgICAgICByZWN0OiBnZXRSZWN0KGNoaWxkKVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgZnJvbVJlY3QgPSBfb2JqZWN0U3ByZWFkMih7fSwgYW5pbWF0aW9uU3RhdGVzW2FuaW1hdGlvblN0YXRlcy5sZW5ndGggLSAxXS5yZWN0KTsgLy8gSWYgYW5pbWF0aW5nOiBjb21wZW5zYXRlIGZvciBjdXJyZW50IGFuaW1hdGlvblxuXG5cbiAgICAgICAgaWYgKGNoaWxkLnRoaXNBbmltYXRpb25EdXJhdGlvbikge1xuICAgICAgICAgIHZhciBjaGlsZE1hdHJpeCA9IG1hdHJpeChjaGlsZCwgdHJ1ZSk7XG5cbiAgICAgICAgICBpZiAoY2hpbGRNYXRyaXgpIHtcbiAgICAgICAgICAgIGZyb21SZWN0LnRvcCAtPSBjaGlsZE1hdHJpeC5mO1xuICAgICAgICAgICAgZnJvbVJlY3QubGVmdCAtPSBjaGlsZE1hdHJpeC5lO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNoaWxkLmZyb21SZWN0ID0gZnJvbVJlY3Q7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGFkZEFuaW1hdGlvblN0YXRlOiBmdW5jdGlvbiBhZGRBbmltYXRpb25TdGF0ZShzdGF0ZSkge1xuICAgICAgYW5pbWF0aW9uU3RhdGVzLnB1c2goc3RhdGUpO1xuICAgIH0sXG4gICAgcmVtb3ZlQW5pbWF0aW9uU3RhdGU6IGZ1bmN0aW9uIHJlbW92ZUFuaW1hdGlvblN0YXRlKHRhcmdldCkge1xuICAgICAgYW5pbWF0aW9uU3RhdGVzLnNwbGljZShpbmRleE9mT2JqZWN0KGFuaW1hdGlvblN0YXRlcywge1xuICAgICAgICB0YXJnZXQ6IHRhcmdldFxuICAgICAgfSksIDEpO1xuICAgIH0sXG4gICAgYW5pbWF0ZUFsbDogZnVuY3Rpb24gYW5pbWF0ZUFsbChjYWxsYmFjaykge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuYW5pbWF0aW9uKSB7XG4gICAgICAgIGNsZWFyVGltZW91dChhbmltYXRpb25DYWxsYmFja0lkKTtcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgY2FsbGJhY2soKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgYW5pbWF0aW5nID0gZmFsc2UsXG4gICAgICAgICAgYW5pbWF0aW9uVGltZSA9IDA7XG4gICAgICBhbmltYXRpb25TdGF0ZXMuZm9yRWFjaChmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgdmFyIHRpbWUgPSAwLFxuICAgICAgICAgICAgdGFyZ2V0ID0gc3RhdGUudGFyZ2V0LFxuICAgICAgICAgICAgZnJvbVJlY3QgPSB0YXJnZXQuZnJvbVJlY3QsXG4gICAgICAgICAgICB0b1JlY3QgPSBnZXRSZWN0KHRhcmdldCksXG4gICAgICAgICAgICBwcmV2RnJvbVJlY3QgPSB0YXJnZXQucHJldkZyb21SZWN0LFxuICAgICAgICAgICAgcHJldlRvUmVjdCA9IHRhcmdldC5wcmV2VG9SZWN0LFxuICAgICAgICAgICAgYW5pbWF0aW5nUmVjdCA9IHN0YXRlLnJlY3QsXG4gICAgICAgICAgICB0YXJnZXRNYXRyaXggPSBtYXRyaXgodGFyZ2V0LCB0cnVlKTtcblxuICAgICAgICBpZiAodGFyZ2V0TWF0cml4KSB7XG4gICAgICAgICAgLy8gQ29tcGVuc2F0ZSBmb3IgY3VycmVudCBhbmltYXRpb25cbiAgICAgICAgICB0b1JlY3QudG9wIC09IHRhcmdldE1hdHJpeC5mO1xuICAgICAgICAgIHRvUmVjdC5sZWZ0IC09IHRhcmdldE1hdHJpeC5lO1xuICAgICAgICB9XG5cbiAgICAgICAgdGFyZ2V0LnRvUmVjdCA9IHRvUmVjdDtcblxuICAgICAgICBpZiAodGFyZ2V0LnRoaXNBbmltYXRpb25EdXJhdGlvbikge1xuICAgICAgICAgIC8vIENvdWxkIGFsc28gY2hlY2sgaWYgYW5pbWF0aW5nUmVjdCBpcyBiZXR3ZWVuIGZyb21SZWN0IGFuZCB0b1JlY3RcbiAgICAgICAgICBpZiAoaXNSZWN0RXF1YWwocHJldkZyb21SZWN0LCB0b1JlY3QpICYmICFpc1JlY3RFcXVhbChmcm9tUmVjdCwgdG9SZWN0KSAmJiAvLyBNYWtlIHN1cmUgYW5pbWF0aW5nUmVjdCBpcyBvbiBsaW5lIGJldHdlZW4gdG9SZWN0ICYgZnJvbVJlY3RcbiAgICAgICAgICAoYW5pbWF0aW5nUmVjdC50b3AgLSB0b1JlY3QudG9wKSAvIChhbmltYXRpbmdSZWN0LmxlZnQgLSB0b1JlY3QubGVmdCkgPT09IChmcm9tUmVjdC50b3AgLSB0b1JlY3QudG9wKSAvIChmcm9tUmVjdC5sZWZ0IC0gdG9SZWN0LmxlZnQpKSB7XG4gICAgICAgICAgICAvLyBJZiByZXR1cm5pbmcgdG8gc2FtZSBwbGFjZSBhcyBzdGFydGVkIGZyb20gYW5pbWF0aW9uIGFuZCBvbiBzYW1lIGF4aXNcbiAgICAgICAgICAgIHRpbWUgPSBjYWxjdWxhdGVSZWFsVGltZShhbmltYXRpbmdSZWN0LCBwcmV2RnJvbVJlY3QsIHByZXZUb1JlY3QsIF90aGlzLm9wdGlvbnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSAvLyBpZiBmcm9tUmVjdCAhPSB0b1JlY3Q6IGFuaW1hdGVcblxuXG4gICAgICAgIGlmICghaXNSZWN0RXF1YWwodG9SZWN0LCBmcm9tUmVjdCkpIHtcbiAgICAgICAgICB0YXJnZXQucHJldkZyb21SZWN0ID0gZnJvbVJlY3Q7XG4gICAgICAgICAgdGFyZ2V0LnByZXZUb1JlY3QgPSB0b1JlY3Q7XG5cbiAgICAgICAgICBpZiAoIXRpbWUpIHtcbiAgICAgICAgICAgIHRpbWUgPSBfdGhpcy5vcHRpb25zLmFuaW1hdGlvbjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBfdGhpcy5hbmltYXRlKHRhcmdldCwgYW5pbWF0aW5nUmVjdCwgdG9SZWN0LCB0aW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aW1lKSB7XG4gICAgICAgICAgYW5pbWF0aW5nID0gdHJ1ZTtcbiAgICAgICAgICBhbmltYXRpb25UaW1lID0gTWF0aC5tYXgoYW5pbWF0aW9uVGltZSwgdGltZSk7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRhcmdldC5hbmltYXRpb25SZXNldFRpbWVyKTtcbiAgICAgICAgICB0YXJnZXQuYW5pbWF0aW9uUmVzZXRUaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGFyZ2V0LmFuaW1hdGlvblRpbWUgPSAwO1xuICAgICAgICAgICAgdGFyZ2V0LnByZXZGcm9tUmVjdCA9IG51bGw7XG4gICAgICAgICAgICB0YXJnZXQuZnJvbVJlY3QgPSBudWxsO1xuICAgICAgICAgICAgdGFyZ2V0LnByZXZUb1JlY3QgPSBudWxsO1xuICAgICAgICAgICAgdGFyZ2V0LnRoaXNBbmltYXRpb25EdXJhdGlvbiA9IG51bGw7XG4gICAgICAgICAgfSwgdGltZSk7XG4gICAgICAgICAgdGFyZ2V0LnRoaXNBbmltYXRpb25EdXJhdGlvbiA9IHRpbWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY2xlYXJUaW1lb3V0KGFuaW1hdGlvbkNhbGxiYWNrSWQpO1xuXG4gICAgICBpZiAoIWFuaW1hdGluZykge1xuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSBjYWxsYmFjaygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYW5pbWF0aW9uQ2FsbGJhY2tJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIGNhbGxiYWNrKCk7XG4gICAgICAgIH0sIGFuaW1hdGlvblRpbWUpO1xuICAgICAgfVxuXG4gICAgICBhbmltYXRpb25TdGF0ZXMgPSBbXTtcbiAgICB9LFxuICAgIGFuaW1hdGU6IGZ1bmN0aW9uIGFuaW1hdGUodGFyZ2V0LCBjdXJyZW50UmVjdCwgdG9SZWN0LCBkdXJhdGlvbikge1xuICAgICAgaWYgKGR1cmF0aW9uKSB7XG4gICAgICAgIGNzcyh0YXJnZXQsICd0cmFuc2l0aW9uJywgJycpO1xuICAgICAgICBjc3ModGFyZ2V0LCAndHJhbnNmb3JtJywgJycpO1xuICAgICAgICB2YXIgZWxNYXRyaXggPSBtYXRyaXgodGhpcy5lbCksXG4gICAgICAgICAgICBzY2FsZVggPSBlbE1hdHJpeCAmJiBlbE1hdHJpeC5hLFxuICAgICAgICAgICAgc2NhbGVZID0gZWxNYXRyaXggJiYgZWxNYXRyaXguZCxcbiAgICAgICAgICAgIHRyYW5zbGF0ZVggPSAoY3VycmVudFJlY3QubGVmdCAtIHRvUmVjdC5sZWZ0KSAvIChzY2FsZVggfHwgMSksXG4gICAgICAgICAgICB0cmFuc2xhdGVZID0gKGN1cnJlbnRSZWN0LnRvcCAtIHRvUmVjdC50b3ApIC8gKHNjYWxlWSB8fCAxKTtcbiAgICAgICAgdGFyZ2V0LmFuaW1hdGluZ1ggPSAhIXRyYW5zbGF0ZVg7XG4gICAgICAgIHRhcmdldC5hbmltYXRpbmdZID0gISF0cmFuc2xhdGVZO1xuICAgICAgICBjc3ModGFyZ2V0LCAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZTNkKCcgKyB0cmFuc2xhdGVYICsgJ3B4LCcgKyB0cmFuc2xhdGVZICsgJ3B4LDApJyk7XG4gICAgICAgIHRoaXMuZm9yUmVwYWludER1bW15ID0gcmVwYWludCh0YXJnZXQpOyAvLyByZXBhaW50XG5cbiAgICAgICAgY3NzKHRhcmdldCwgJ3RyYW5zaXRpb24nLCAndHJhbnNmb3JtICcgKyBkdXJhdGlvbiArICdtcycgKyAodGhpcy5vcHRpb25zLmVhc2luZyA/ICcgJyArIHRoaXMub3B0aW9ucy5lYXNpbmcgOiAnJykpO1xuICAgICAgICBjc3ModGFyZ2V0LCAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZTNkKDAsMCwwKScpO1xuICAgICAgICB0eXBlb2YgdGFyZ2V0LmFuaW1hdGVkID09PSAnbnVtYmVyJyAmJiBjbGVhclRpbWVvdXQodGFyZ2V0LmFuaW1hdGVkKTtcbiAgICAgICAgdGFyZ2V0LmFuaW1hdGVkID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY3NzKHRhcmdldCwgJ3RyYW5zaXRpb24nLCAnJyk7XG4gICAgICAgICAgY3NzKHRhcmdldCwgJ3RyYW5zZm9ybScsICcnKTtcbiAgICAgICAgICB0YXJnZXQuYW5pbWF0ZWQgPSBmYWxzZTtcbiAgICAgICAgICB0YXJnZXQuYW5pbWF0aW5nWCA9IGZhbHNlO1xuICAgICAgICAgIHRhcmdldC5hbmltYXRpbmdZID0gZmFsc2U7XG4gICAgICAgIH0sIGR1cmF0aW9uKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIHJlcGFpbnQodGFyZ2V0KSB7XG4gIHJldHVybiB0YXJnZXQub2Zmc2V0V2lkdGg7XG59XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZVJlYWxUaW1lKGFuaW1hdGluZ1JlY3QsIGZyb21SZWN0LCB0b1JlY3QsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyhmcm9tUmVjdC50b3AgLSBhbmltYXRpbmdSZWN0LnRvcCwgMikgKyBNYXRoLnBvdyhmcm9tUmVjdC5sZWZ0IC0gYW5pbWF0aW5nUmVjdC5sZWZ0LCAyKSkgLyBNYXRoLnNxcnQoTWF0aC5wb3coZnJvbVJlY3QudG9wIC0gdG9SZWN0LnRvcCwgMikgKyBNYXRoLnBvdyhmcm9tUmVjdC5sZWZ0IC0gdG9SZWN0LmxlZnQsIDIpKSAqIG9wdGlvbnMuYW5pbWF0aW9uO1xufVxuXG52YXIgcGx1Z2lucyA9IFtdO1xudmFyIGRlZmF1bHRzID0ge1xuICBpbml0aWFsaXplQnlEZWZhdWx0OiB0cnVlXG59O1xudmFyIFBsdWdpbk1hbmFnZXIgPSB7XG4gIG1vdW50OiBmdW5jdGlvbiBtb3VudChwbHVnaW4pIHtcbiAgICAvLyBTZXQgZGVmYXVsdCBzdGF0aWMgcHJvcGVydGllc1xuICAgIGZvciAodmFyIG9wdGlvbiBpbiBkZWZhdWx0cykge1xuICAgICAgaWYgKGRlZmF1bHRzLmhhc093blByb3BlcnR5KG9wdGlvbikgJiYgIShvcHRpb24gaW4gcGx1Z2luKSkge1xuICAgICAgICBwbHVnaW5bb3B0aW9uXSA9IGRlZmF1bHRzW29wdGlvbl07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcGx1Z2lucy5mb3JFYWNoKGZ1bmN0aW9uIChwKSB7XG4gICAgICBpZiAocC5wbHVnaW5OYW1lID09PSBwbHVnaW4ucGx1Z2luTmFtZSkge1xuICAgICAgICB0aHJvdyBcIlNvcnRhYmxlOiBDYW5ub3QgbW91bnQgcGx1Z2luIFwiLmNvbmNhdChwbHVnaW4ucGx1Z2luTmFtZSwgXCIgbW9yZSB0aGFuIG9uY2VcIik7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcGx1Z2lucy5wdXNoKHBsdWdpbik7XG4gIH0sXG4gIHBsdWdpbkV2ZW50OiBmdW5jdGlvbiBwbHVnaW5FdmVudChldmVudE5hbWUsIHNvcnRhYmxlLCBldnQpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdGhpcy5ldmVudENhbmNlbGVkID0gZmFsc2U7XG5cbiAgICBldnQuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgX3RoaXMuZXZlbnRDYW5jZWxlZCA9IHRydWU7XG4gICAgfTtcblxuICAgIHZhciBldmVudE5hbWVHbG9iYWwgPSBldmVudE5hbWUgKyAnR2xvYmFsJztcbiAgICBwbHVnaW5zLmZvckVhY2goZnVuY3Rpb24gKHBsdWdpbikge1xuICAgICAgaWYgKCFzb3J0YWJsZVtwbHVnaW4ucGx1Z2luTmFtZV0pIHJldHVybjsgLy8gRmlyZSBnbG9iYWwgZXZlbnRzIGlmIGl0IGV4aXN0cyBpbiB0aGlzIHNvcnRhYmxlXG5cbiAgICAgIGlmIChzb3J0YWJsZVtwbHVnaW4ucGx1Z2luTmFtZV1bZXZlbnROYW1lR2xvYmFsXSkge1xuICAgICAgICBzb3J0YWJsZVtwbHVnaW4ucGx1Z2luTmFtZV1bZXZlbnROYW1lR2xvYmFsXShfb2JqZWN0U3ByZWFkMih7XG4gICAgICAgICAgc29ydGFibGU6IHNvcnRhYmxlXG4gICAgICAgIH0sIGV2dCkpO1xuICAgICAgfSAvLyBPbmx5IGZpcmUgcGx1Z2luIGV2ZW50IGlmIHBsdWdpbiBpcyBlbmFibGVkIGluIHRoaXMgc29ydGFibGUsXG4gICAgICAvLyBhbmQgcGx1Z2luIGhhcyBldmVudCBkZWZpbmVkXG5cblxuICAgICAgaWYgKHNvcnRhYmxlLm9wdGlvbnNbcGx1Z2luLnBsdWdpbk5hbWVdICYmIHNvcnRhYmxlW3BsdWdpbi5wbHVnaW5OYW1lXVtldmVudE5hbWVdKSB7XG4gICAgICAgIHNvcnRhYmxlW3BsdWdpbi5wbHVnaW5OYW1lXVtldmVudE5hbWVdKF9vYmplY3RTcHJlYWQyKHtcbiAgICAgICAgICBzb3J0YWJsZTogc29ydGFibGVcbiAgICAgICAgfSwgZXZ0KSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIGluaXRpYWxpemVQbHVnaW5zOiBmdW5jdGlvbiBpbml0aWFsaXplUGx1Z2lucyhzb3J0YWJsZSwgZWwsIGRlZmF1bHRzLCBvcHRpb25zKSB7XG4gICAgcGx1Z2lucy5mb3JFYWNoKGZ1bmN0aW9uIChwbHVnaW4pIHtcbiAgICAgIHZhciBwbHVnaW5OYW1lID0gcGx1Z2luLnBsdWdpbk5hbWU7XG4gICAgICBpZiAoIXNvcnRhYmxlLm9wdGlvbnNbcGx1Z2luTmFtZV0gJiYgIXBsdWdpbi5pbml0aWFsaXplQnlEZWZhdWx0KSByZXR1cm47XG4gICAgICB2YXIgaW5pdGlhbGl6ZWQgPSBuZXcgcGx1Z2luKHNvcnRhYmxlLCBlbCwgc29ydGFibGUub3B0aW9ucyk7XG4gICAgICBpbml0aWFsaXplZC5zb3J0YWJsZSA9IHNvcnRhYmxlO1xuICAgICAgaW5pdGlhbGl6ZWQub3B0aW9ucyA9IHNvcnRhYmxlLm9wdGlvbnM7XG4gICAgICBzb3J0YWJsZVtwbHVnaW5OYW1lXSA9IGluaXRpYWxpemVkOyAvLyBBZGQgZGVmYXVsdCBvcHRpb25zIGZyb20gcGx1Z2luXG5cbiAgICAgIF9leHRlbmRzKGRlZmF1bHRzLCBpbml0aWFsaXplZC5kZWZhdWx0cyk7XG4gICAgfSk7XG5cbiAgICBmb3IgKHZhciBvcHRpb24gaW4gc29ydGFibGUub3B0aW9ucykge1xuICAgICAgaWYgKCFzb3J0YWJsZS5vcHRpb25zLmhhc093blByb3BlcnR5KG9wdGlvbikpIGNvbnRpbnVlO1xuICAgICAgdmFyIG1vZGlmaWVkID0gdGhpcy5tb2RpZnlPcHRpb24oc29ydGFibGUsIG9wdGlvbiwgc29ydGFibGUub3B0aW9uc1tvcHRpb25dKTtcblxuICAgICAgaWYgKHR5cGVvZiBtb2RpZmllZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgc29ydGFibGUub3B0aW9uc1tvcHRpb25dID0gbW9kaWZpZWQ7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBnZXRFdmVudFByb3BlcnRpZXM6IGZ1bmN0aW9uIGdldEV2ZW50UHJvcGVydGllcyhuYW1lLCBzb3J0YWJsZSkge1xuICAgIHZhciBldmVudFByb3BlcnRpZXMgPSB7fTtcbiAgICBwbHVnaW5zLmZvckVhY2goZnVuY3Rpb24gKHBsdWdpbikge1xuICAgICAgaWYgKHR5cGVvZiBwbHVnaW4uZXZlbnRQcm9wZXJ0aWVzICE9PSAnZnVuY3Rpb24nKSByZXR1cm47XG5cbiAgICAgIF9leHRlbmRzKGV2ZW50UHJvcGVydGllcywgcGx1Z2luLmV2ZW50UHJvcGVydGllcy5jYWxsKHNvcnRhYmxlW3BsdWdpbi5wbHVnaW5OYW1lXSwgbmFtZSkpO1xuICAgIH0pO1xuICAgIHJldHVybiBldmVudFByb3BlcnRpZXM7XG4gIH0sXG4gIG1vZGlmeU9wdGlvbjogZnVuY3Rpb24gbW9kaWZ5T3B0aW9uKHNvcnRhYmxlLCBuYW1lLCB2YWx1ZSkge1xuICAgIHZhciBtb2RpZmllZFZhbHVlO1xuICAgIHBsdWdpbnMuZm9yRWFjaChmdW5jdGlvbiAocGx1Z2luKSB7XG4gICAgICAvLyBQbHVnaW4gbXVzdCBleGlzdCBvbiB0aGUgU29ydGFibGVcbiAgICAgIGlmICghc29ydGFibGVbcGx1Z2luLnBsdWdpbk5hbWVdKSByZXR1cm47IC8vIElmIHN0YXRpYyBvcHRpb24gbGlzdGVuZXIgZXhpc3RzIGZvciB0aGlzIG9wdGlvbiwgY2FsbCBpbiB0aGUgY29udGV4dCBvZiB0aGUgU29ydGFibGUncyBpbnN0YW5jZSBvZiB0aGlzIHBsdWdpblxuXG4gICAgICBpZiAocGx1Z2luLm9wdGlvbkxpc3RlbmVycyAmJiB0eXBlb2YgcGx1Z2luLm9wdGlvbkxpc3RlbmVyc1tuYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBtb2RpZmllZFZhbHVlID0gcGx1Z2luLm9wdGlvbkxpc3RlbmVyc1tuYW1lXS5jYWxsKHNvcnRhYmxlW3BsdWdpbi5wbHVnaW5OYW1lXSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBtb2RpZmllZFZhbHVlO1xuICB9XG59O1xuXG5mdW5jdGlvbiBkaXNwYXRjaEV2ZW50KF9yZWYpIHtcbiAgdmFyIHNvcnRhYmxlID0gX3JlZi5zb3J0YWJsZSxcbiAgICAgIHJvb3RFbCA9IF9yZWYucm9vdEVsLFxuICAgICAgbmFtZSA9IF9yZWYubmFtZSxcbiAgICAgIHRhcmdldEVsID0gX3JlZi50YXJnZXRFbCxcbiAgICAgIGNsb25lRWwgPSBfcmVmLmNsb25lRWwsXG4gICAgICB0b0VsID0gX3JlZi50b0VsLFxuICAgICAgZnJvbUVsID0gX3JlZi5mcm9tRWwsXG4gICAgICBvbGRJbmRleCA9IF9yZWYub2xkSW5kZXgsXG4gICAgICBuZXdJbmRleCA9IF9yZWYubmV3SW5kZXgsXG4gICAgICBvbGREcmFnZ2FibGVJbmRleCA9IF9yZWYub2xkRHJhZ2dhYmxlSW5kZXgsXG4gICAgICBuZXdEcmFnZ2FibGVJbmRleCA9IF9yZWYubmV3RHJhZ2dhYmxlSW5kZXgsXG4gICAgICBvcmlnaW5hbEV2ZW50ID0gX3JlZi5vcmlnaW5hbEV2ZW50LFxuICAgICAgcHV0U29ydGFibGUgPSBfcmVmLnB1dFNvcnRhYmxlLFxuICAgICAgZXh0cmFFdmVudFByb3BlcnRpZXMgPSBfcmVmLmV4dHJhRXZlbnRQcm9wZXJ0aWVzO1xuICBzb3J0YWJsZSA9IHNvcnRhYmxlIHx8IHJvb3RFbCAmJiByb290RWxbZXhwYW5kb107XG4gIGlmICghc29ydGFibGUpIHJldHVybjtcbiAgdmFyIGV2dCxcbiAgICAgIG9wdGlvbnMgPSBzb3J0YWJsZS5vcHRpb25zLFxuICAgICAgb25OYW1lID0gJ29uJyArIG5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBuYW1lLnN1YnN0cigxKTsgLy8gU3VwcG9ydCBmb3IgbmV3IEN1c3RvbUV2ZW50IGZlYXR1cmVcblxuICBpZiAod2luZG93LkN1c3RvbUV2ZW50ICYmICFJRTExT3JMZXNzICYmICFFZGdlKSB7XG4gICAgZXZ0ID0gbmV3IEN1c3RvbUV2ZW50KG5hbWUsIHtcbiAgICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgICBjYW5jZWxhYmxlOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgZXZ0LmluaXRFdmVudChuYW1lLCB0cnVlLCB0cnVlKTtcbiAgfVxuXG4gIGV2dC50byA9IHRvRWwgfHwgcm9vdEVsO1xuICBldnQuZnJvbSA9IGZyb21FbCB8fCByb290RWw7XG4gIGV2dC5pdGVtID0gdGFyZ2V0RWwgfHwgcm9vdEVsO1xuICBldnQuY2xvbmUgPSBjbG9uZUVsO1xuICBldnQub2xkSW5kZXggPSBvbGRJbmRleDtcbiAgZXZ0Lm5ld0luZGV4ID0gbmV3SW5kZXg7XG4gIGV2dC5vbGREcmFnZ2FibGVJbmRleCA9IG9sZERyYWdnYWJsZUluZGV4O1xuICBldnQubmV3RHJhZ2dhYmxlSW5kZXggPSBuZXdEcmFnZ2FibGVJbmRleDtcbiAgZXZ0Lm9yaWdpbmFsRXZlbnQgPSBvcmlnaW5hbEV2ZW50O1xuICBldnQucHVsbE1vZGUgPSBwdXRTb3J0YWJsZSA/IHB1dFNvcnRhYmxlLmxhc3RQdXRNb2RlIDogdW5kZWZpbmVkO1xuXG4gIHZhciBhbGxFdmVudFByb3BlcnRpZXMgPSBfb2JqZWN0U3ByZWFkMihfb2JqZWN0U3ByZWFkMih7fSwgZXh0cmFFdmVudFByb3BlcnRpZXMpLCBQbHVnaW5NYW5hZ2VyLmdldEV2ZW50UHJvcGVydGllcyhuYW1lLCBzb3J0YWJsZSkpO1xuXG4gIGZvciAodmFyIG9wdGlvbiBpbiBhbGxFdmVudFByb3BlcnRpZXMpIHtcbiAgICBldnRbb3B0aW9uXSA9IGFsbEV2ZW50UHJvcGVydGllc1tvcHRpb25dO1xuICB9XG5cbiAgaWYgKHJvb3RFbCkge1xuICAgIHJvb3RFbC5kaXNwYXRjaEV2ZW50KGV2dCk7XG4gIH1cblxuICBpZiAob3B0aW9uc1tvbk5hbWVdKSB7XG4gICAgb3B0aW9uc1tvbk5hbWVdLmNhbGwoc29ydGFibGUsIGV2dCk7XG4gIH1cbn1cblxudmFyIF9leGNsdWRlZCA9IFtcImV2dFwiXTtcblxudmFyIHBsdWdpbkV2ZW50ID0gZnVuY3Rpb24gcGx1Z2luRXZlbnQoZXZlbnROYW1lLCBzb3J0YWJsZSkge1xuICB2YXIgX3JlZiA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDoge30sXG4gICAgICBvcmlnaW5hbEV2ZW50ID0gX3JlZi5ldnQsXG4gICAgICBkYXRhID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKF9yZWYsIF9leGNsdWRlZCk7XG5cbiAgUGx1Z2luTWFuYWdlci5wbHVnaW5FdmVudC5iaW5kKFNvcnRhYmxlKShldmVudE5hbWUsIHNvcnRhYmxlLCBfb2JqZWN0U3ByZWFkMih7XG4gICAgZHJhZ0VsOiBkcmFnRWwsXG4gICAgcGFyZW50RWw6IHBhcmVudEVsLFxuICAgIGdob3N0RWw6IGdob3N0RWwsXG4gICAgcm9vdEVsOiByb290RWwsXG4gICAgbmV4dEVsOiBuZXh0RWwsXG4gICAgbGFzdERvd25FbDogbGFzdERvd25FbCxcbiAgICBjbG9uZUVsOiBjbG9uZUVsLFxuICAgIGNsb25lSGlkZGVuOiBjbG9uZUhpZGRlbixcbiAgICBkcmFnU3RhcnRlZDogbW92ZWQsXG4gICAgcHV0U29ydGFibGU6IHB1dFNvcnRhYmxlLFxuICAgIGFjdGl2ZVNvcnRhYmxlOiBTb3J0YWJsZS5hY3RpdmUsXG4gICAgb3JpZ2luYWxFdmVudDogb3JpZ2luYWxFdmVudCxcbiAgICBvbGRJbmRleDogb2xkSW5kZXgsXG4gICAgb2xkRHJhZ2dhYmxlSW5kZXg6IG9sZERyYWdnYWJsZUluZGV4LFxuICAgIG5ld0luZGV4OiBuZXdJbmRleCxcbiAgICBuZXdEcmFnZ2FibGVJbmRleDogbmV3RHJhZ2dhYmxlSW5kZXgsXG4gICAgaGlkZUdob3N0Rm9yVGFyZ2V0OiBfaGlkZUdob3N0Rm9yVGFyZ2V0LFxuICAgIHVuaGlkZUdob3N0Rm9yVGFyZ2V0OiBfdW5oaWRlR2hvc3RGb3JUYXJnZXQsXG4gICAgY2xvbmVOb3dIaWRkZW46IGZ1bmN0aW9uIGNsb25lTm93SGlkZGVuKCkge1xuICAgICAgY2xvbmVIaWRkZW4gPSB0cnVlO1xuICAgIH0sXG4gICAgY2xvbmVOb3dTaG93bjogZnVuY3Rpb24gY2xvbmVOb3dTaG93bigpIHtcbiAgICAgIGNsb25lSGlkZGVuID0gZmFsc2U7XG4gICAgfSxcbiAgICBkaXNwYXRjaFNvcnRhYmxlRXZlbnQ6IGZ1bmN0aW9uIGRpc3BhdGNoU29ydGFibGVFdmVudChuYW1lKSB7XG4gICAgICBfZGlzcGF0Y2hFdmVudCh7XG4gICAgICAgIHNvcnRhYmxlOiBzb3J0YWJsZSxcbiAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgb3JpZ2luYWxFdmVudDogb3JpZ2luYWxFdmVudFxuICAgICAgfSk7XG4gICAgfVxuICB9LCBkYXRhKSk7XG59O1xuXG5mdW5jdGlvbiBfZGlzcGF0Y2hFdmVudChpbmZvKSB7XG4gIGRpc3BhdGNoRXZlbnQoX29iamVjdFNwcmVhZDIoe1xuICAgIHB1dFNvcnRhYmxlOiBwdXRTb3J0YWJsZSxcbiAgICBjbG9uZUVsOiBjbG9uZUVsLFxuICAgIHRhcmdldEVsOiBkcmFnRWwsXG4gICAgcm9vdEVsOiByb290RWwsXG4gICAgb2xkSW5kZXg6IG9sZEluZGV4LFxuICAgIG9sZERyYWdnYWJsZUluZGV4OiBvbGREcmFnZ2FibGVJbmRleCxcbiAgICBuZXdJbmRleDogbmV3SW5kZXgsXG4gICAgbmV3RHJhZ2dhYmxlSW5kZXg6IG5ld0RyYWdnYWJsZUluZGV4XG4gIH0sIGluZm8pKTtcbn1cblxudmFyIGRyYWdFbCxcbiAgICBwYXJlbnRFbCxcbiAgICBnaG9zdEVsLFxuICAgIHJvb3RFbCxcbiAgICBuZXh0RWwsXG4gICAgbGFzdERvd25FbCxcbiAgICBjbG9uZUVsLFxuICAgIGNsb25lSGlkZGVuLFxuICAgIG9sZEluZGV4LFxuICAgIG5ld0luZGV4LFxuICAgIG9sZERyYWdnYWJsZUluZGV4LFxuICAgIG5ld0RyYWdnYWJsZUluZGV4LFxuICAgIGFjdGl2ZUdyb3VwLFxuICAgIHB1dFNvcnRhYmxlLFxuICAgIGF3YWl0aW5nRHJhZ1N0YXJ0ZWQgPSBmYWxzZSxcbiAgICBpZ25vcmVOZXh0Q2xpY2sgPSBmYWxzZSxcbiAgICBzb3J0YWJsZXMgPSBbXSxcbiAgICB0YXBFdnQsXG4gICAgdG91Y2hFdnQsXG4gICAgbGFzdER4LFxuICAgIGxhc3REeSxcbiAgICB0YXBEaXN0YW5jZUxlZnQsXG4gICAgdGFwRGlzdGFuY2VUb3AsXG4gICAgbW92ZWQsXG4gICAgbGFzdFRhcmdldCxcbiAgICBsYXN0RGlyZWN0aW9uLFxuICAgIHBhc3RGaXJzdEludmVydFRocmVzaCA9IGZhbHNlLFxuICAgIGlzQ2lyY3Vtc3RhbnRpYWxJbnZlcnQgPSBmYWxzZSxcbiAgICB0YXJnZXRNb3ZlRGlzdGFuY2UsXG4gICAgLy8gRm9yIHBvc2l0aW9uaW5nIGdob3N0IGFic29sdXRlbHlcbmdob3N0UmVsYXRpdmVQYXJlbnQsXG4gICAgZ2hvc3RSZWxhdGl2ZVBhcmVudEluaXRpYWxTY3JvbGwgPSBbXSxcbiAgICAvLyAobGVmdCwgdG9wKVxuX3NpbGVudCA9IGZhbHNlLFxuICAgIHNhdmVkSW5wdXRDaGVja2VkID0gW107XG4vKiogQGNvbnN0ICovXG5cbnZhciBkb2N1bWVudEV4aXN0cyA9IHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcsXG4gICAgUG9zaXRpb25HaG9zdEFic29sdXRlbHkgPSBJT1MsXG4gICAgQ1NTRmxvYXRQcm9wZXJ0eSA9IEVkZ2UgfHwgSUUxMU9yTGVzcyA/ICdjc3NGbG9hdCcgOiAnZmxvYXQnLFxuICAgIC8vIFRoaXMgd2lsbCBub3QgcGFzcyBmb3IgSUU5LCBiZWNhdXNlIElFOSBEbkQgb25seSB3b3JrcyBvbiBhbmNob3JzXG5zdXBwb3J0RHJhZ2dhYmxlID0gZG9jdW1lbnRFeGlzdHMgJiYgIUNocm9tZUZvckFuZHJvaWQgJiYgIUlPUyAmJiAnZHJhZ2dhYmxlJyBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICBzdXBwb3J0Q3NzUG9pbnRlckV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKCFkb2N1bWVudEV4aXN0cykgcmV0dXJuOyAvLyBmYWxzZSB3aGVuIDw9IElFMTFcblxuICBpZiAoSUUxMU9yTGVzcykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3gnKTtcbiAgZWwuc3R5bGUuY3NzVGV4dCA9ICdwb2ludGVyLWV2ZW50czphdXRvJztcbiAgcmV0dXJuIGVsLnN0eWxlLnBvaW50ZXJFdmVudHMgPT09ICdhdXRvJztcbn0oKSxcbiAgICBfZGV0ZWN0RGlyZWN0aW9uID0gZnVuY3Rpb24gX2RldGVjdERpcmVjdGlvbihlbCwgb3B0aW9ucykge1xuICB2YXIgZWxDU1MgPSBjc3MoZWwpLFxuICAgICAgZWxXaWR0aCA9IHBhcnNlSW50KGVsQ1NTLndpZHRoKSAtIHBhcnNlSW50KGVsQ1NTLnBhZGRpbmdMZWZ0KSAtIHBhcnNlSW50KGVsQ1NTLnBhZGRpbmdSaWdodCkgLSBwYXJzZUludChlbENTUy5ib3JkZXJMZWZ0V2lkdGgpIC0gcGFyc2VJbnQoZWxDU1MuYm9yZGVyUmlnaHRXaWR0aCksXG4gICAgICBjaGlsZDEgPSBnZXRDaGlsZChlbCwgMCwgb3B0aW9ucyksXG4gICAgICBjaGlsZDIgPSBnZXRDaGlsZChlbCwgMSwgb3B0aW9ucyksXG4gICAgICBmaXJzdENoaWxkQ1NTID0gY2hpbGQxICYmIGNzcyhjaGlsZDEpLFxuICAgICAgc2Vjb25kQ2hpbGRDU1MgPSBjaGlsZDIgJiYgY3NzKGNoaWxkMiksXG4gICAgICBmaXJzdENoaWxkV2lkdGggPSBmaXJzdENoaWxkQ1NTICYmIHBhcnNlSW50KGZpcnN0Q2hpbGRDU1MubWFyZ2luTGVmdCkgKyBwYXJzZUludChmaXJzdENoaWxkQ1NTLm1hcmdpblJpZ2h0KSArIGdldFJlY3QoY2hpbGQxKS53aWR0aCxcbiAgICAgIHNlY29uZENoaWxkV2lkdGggPSBzZWNvbmRDaGlsZENTUyAmJiBwYXJzZUludChzZWNvbmRDaGlsZENTUy5tYXJnaW5MZWZ0KSArIHBhcnNlSW50KHNlY29uZENoaWxkQ1NTLm1hcmdpblJpZ2h0KSArIGdldFJlY3QoY2hpbGQyKS53aWR0aDtcblxuICBpZiAoZWxDU1MuZGlzcGxheSA9PT0gJ2ZsZXgnKSB7XG4gICAgcmV0dXJuIGVsQ1NTLmZsZXhEaXJlY3Rpb24gPT09ICdjb2x1bW4nIHx8IGVsQ1NTLmZsZXhEaXJlY3Rpb24gPT09ICdjb2x1bW4tcmV2ZXJzZScgPyAndmVydGljYWwnIDogJ2hvcml6b250YWwnO1xuICB9XG5cbiAgaWYgKGVsQ1NTLmRpc3BsYXkgPT09ICdncmlkJykge1xuICAgIHJldHVybiBlbENTUy5ncmlkVGVtcGxhdGVDb2x1bW5zLnNwbGl0KCcgJykubGVuZ3RoIDw9IDEgPyAndmVydGljYWwnIDogJ2hvcml6b250YWwnO1xuICB9XG5cbiAgaWYgKGNoaWxkMSAmJiBmaXJzdENoaWxkQ1NTW1wiZmxvYXRcIl0gJiYgZmlyc3RDaGlsZENTU1tcImZsb2F0XCJdICE9PSAnbm9uZScpIHtcbiAgICB2YXIgdG91Y2hpbmdTaWRlQ2hpbGQyID0gZmlyc3RDaGlsZENTU1tcImZsb2F0XCJdID09PSAnbGVmdCcgPyAnbGVmdCcgOiAncmlnaHQnO1xuICAgIHJldHVybiBjaGlsZDIgJiYgKHNlY29uZENoaWxkQ1NTLmNsZWFyID09PSAnYm90aCcgfHwgc2Vjb25kQ2hpbGRDU1MuY2xlYXIgPT09IHRvdWNoaW5nU2lkZUNoaWxkMikgPyAndmVydGljYWwnIDogJ2hvcml6b250YWwnO1xuICB9XG5cbiAgcmV0dXJuIGNoaWxkMSAmJiAoZmlyc3RDaGlsZENTUy5kaXNwbGF5ID09PSAnYmxvY2snIHx8IGZpcnN0Q2hpbGRDU1MuZGlzcGxheSA9PT0gJ2ZsZXgnIHx8IGZpcnN0Q2hpbGRDU1MuZGlzcGxheSA9PT0gJ3RhYmxlJyB8fCBmaXJzdENoaWxkQ1NTLmRpc3BsYXkgPT09ICdncmlkJyB8fCBmaXJzdENoaWxkV2lkdGggPj0gZWxXaWR0aCAmJiBlbENTU1tDU1NGbG9hdFByb3BlcnR5XSA9PT0gJ25vbmUnIHx8IGNoaWxkMiAmJiBlbENTU1tDU1NGbG9hdFByb3BlcnR5XSA9PT0gJ25vbmUnICYmIGZpcnN0Q2hpbGRXaWR0aCArIHNlY29uZENoaWxkV2lkdGggPiBlbFdpZHRoKSA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCc7XG59LFxuICAgIF9kcmFnRWxJblJvd0NvbHVtbiA9IGZ1bmN0aW9uIF9kcmFnRWxJblJvd0NvbHVtbihkcmFnUmVjdCwgdGFyZ2V0UmVjdCwgdmVydGljYWwpIHtcbiAgdmFyIGRyYWdFbFMxT3BwID0gdmVydGljYWwgPyBkcmFnUmVjdC5sZWZ0IDogZHJhZ1JlY3QudG9wLFxuICAgICAgZHJhZ0VsUzJPcHAgPSB2ZXJ0aWNhbCA/IGRyYWdSZWN0LnJpZ2h0IDogZHJhZ1JlY3QuYm90dG9tLFxuICAgICAgZHJhZ0VsT3BwTGVuZ3RoID0gdmVydGljYWwgPyBkcmFnUmVjdC53aWR0aCA6IGRyYWdSZWN0LmhlaWdodCxcbiAgICAgIHRhcmdldFMxT3BwID0gdmVydGljYWwgPyB0YXJnZXRSZWN0LmxlZnQgOiB0YXJnZXRSZWN0LnRvcCxcbiAgICAgIHRhcmdldFMyT3BwID0gdmVydGljYWwgPyB0YXJnZXRSZWN0LnJpZ2h0IDogdGFyZ2V0UmVjdC5ib3R0b20sXG4gICAgICB0YXJnZXRPcHBMZW5ndGggPSB2ZXJ0aWNhbCA/IHRhcmdldFJlY3Qud2lkdGggOiB0YXJnZXRSZWN0LmhlaWdodDtcbiAgcmV0dXJuIGRyYWdFbFMxT3BwID09PSB0YXJnZXRTMU9wcCB8fCBkcmFnRWxTMk9wcCA9PT0gdGFyZ2V0UzJPcHAgfHwgZHJhZ0VsUzFPcHAgKyBkcmFnRWxPcHBMZW5ndGggLyAyID09PSB0YXJnZXRTMU9wcCArIHRhcmdldE9wcExlbmd0aCAvIDI7XG59LFxuXG4vKipcbiAqIERldGVjdHMgZmlyc3QgbmVhcmVzdCBlbXB0eSBzb3J0YWJsZSB0byBYIGFuZCBZIHBvc2l0aW9uIHVzaW5nIGVtcHR5SW5zZXJ0VGhyZXNob2xkLlxuICogQHBhcmFtICB7TnVtYmVyfSB4ICAgICAgWCBwb3NpdGlvblxuICogQHBhcmFtICB7TnVtYmVyfSB5ICAgICAgWSBwb3NpdGlvblxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9ICAgRWxlbWVudCBvZiB0aGUgZmlyc3QgZm91bmQgbmVhcmVzdCBTb3J0YWJsZVxuICovXG5fZGV0ZWN0TmVhcmVzdEVtcHR5U29ydGFibGUgPSBmdW5jdGlvbiBfZGV0ZWN0TmVhcmVzdEVtcHR5U29ydGFibGUoeCwgeSkge1xuICB2YXIgcmV0O1xuICBzb3J0YWJsZXMuc29tZShmdW5jdGlvbiAoc29ydGFibGUpIHtcbiAgICB2YXIgdGhyZXNob2xkID0gc29ydGFibGVbZXhwYW5kb10ub3B0aW9ucy5lbXB0eUluc2VydFRocmVzaG9sZDtcbiAgICBpZiAoIXRocmVzaG9sZCB8fCBsYXN0Q2hpbGQoc29ydGFibGUpKSByZXR1cm47XG4gICAgdmFyIHJlY3QgPSBnZXRSZWN0KHNvcnRhYmxlKSxcbiAgICAgICAgaW5zaWRlSG9yaXpvbnRhbGx5ID0geCA+PSByZWN0LmxlZnQgLSB0aHJlc2hvbGQgJiYgeCA8PSByZWN0LnJpZ2h0ICsgdGhyZXNob2xkLFxuICAgICAgICBpbnNpZGVWZXJ0aWNhbGx5ID0geSA+PSByZWN0LnRvcCAtIHRocmVzaG9sZCAmJiB5IDw9IHJlY3QuYm90dG9tICsgdGhyZXNob2xkO1xuXG4gICAgaWYgKGluc2lkZUhvcml6b250YWxseSAmJiBpbnNpZGVWZXJ0aWNhbGx5KSB7XG4gICAgICByZXR1cm4gcmV0ID0gc29ydGFibGU7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJldDtcbn0sXG4gICAgX3ByZXBhcmVHcm91cCA9IGZ1bmN0aW9uIF9wcmVwYXJlR3JvdXAob3B0aW9ucykge1xuICBmdW5jdGlvbiB0b0ZuKHZhbHVlLCBwdWxsKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0bywgZnJvbSwgZHJhZ0VsLCBldnQpIHtcbiAgICAgIHZhciBzYW1lR3JvdXAgPSB0by5vcHRpb25zLmdyb3VwLm5hbWUgJiYgZnJvbS5vcHRpb25zLmdyb3VwLm5hbWUgJiYgdG8ub3B0aW9ucy5ncm91cC5uYW1lID09PSBmcm9tLm9wdGlvbnMuZ3JvdXAubmFtZTtcblxuICAgICAgaWYgKHZhbHVlID09IG51bGwgJiYgKHB1bGwgfHwgc2FtZUdyb3VwKSkge1xuICAgICAgICAvLyBEZWZhdWx0IHB1bGwgdmFsdWVcbiAgICAgICAgLy8gRGVmYXVsdCBwdWxsIGFuZCBwdXQgdmFsdWUgaWYgc2FtZSBncm91cFxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT0gbnVsbCB8fCB2YWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIGlmIChwdWxsICYmIHZhbHVlID09PSAnY2xvbmUnKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiB0b0ZuKHZhbHVlKHRvLCBmcm9tLCBkcmFnRWwsIGV2dCksIHB1bGwpKHRvLCBmcm9tLCBkcmFnRWwsIGV2dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgb3RoZXJHcm91cCA9IChwdWxsID8gdG8gOiBmcm9tKS5vcHRpb25zLmdyb3VwLm5hbWU7XG4gICAgICAgIHJldHVybiB2YWx1ZSA9PT0gdHJ1ZSB8fCB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIHZhbHVlID09PSBvdGhlckdyb3VwIHx8IHZhbHVlLmpvaW4gJiYgdmFsdWUuaW5kZXhPZihvdGhlckdyb3VwKSA+IC0xO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICB2YXIgZ3JvdXAgPSB7fTtcbiAgdmFyIG9yaWdpbmFsR3JvdXAgPSBvcHRpb25zLmdyb3VwO1xuXG4gIGlmICghb3JpZ2luYWxHcm91cCB8fCBfdHlwZW9mKG9yaWdpbmFsR3JvdXApICE9ICdvYmplY3QnKSB7XG4gICAgb3JpZ2luYWxHcm91cCA9IHtcbiAgICAgIG5hbWU6IG9yaWdpbmFsR3JvdXBcbiAgICB9O1xuICB9XG5cbiAgZ3JvdXAubmFtZSA9IG9yaWdpbmFsR3JvdXAubmFtZTtcbiAgZ3JvdXAuY2hlY2tQdWxsID0gdG9GbihvcmlnaW5hbEdyb3VwLnB1bGwsIHRydWUpO1xuICBncm91cC5jaGVja1B1dCA9IHRvRm4ob3JpZ2luYWxHcm91cC5wdXQpO1xuICBncm91cC5yZXZlcnRDbG9uZSA9IG9yaWdpbmFsR3JvdXAucmV2ZXJ0Q2xvbmU7XG4gIG9wdGlvbnMuZ3JvdXAgPSBncm91cDtcbn0sXG4gICAgX2hpZGVHaG9zdEZvclRhcmdldCA9IGZ1bmN0aW9uIF9oaWRlR2hvc3RGb3JUYXJnZXQoKSB7XG4gIGlmICghc3VwcG9ydENzc1BvaW50ZXJFdmVudHMgJiYgZ2hvc3RFbCkge1xuICAgIGNzcyhnaG9zdEVsLCAnZGlzcGxheScsICdub25lJyk7XG4gIH1cbn0sXG4gICAgX3VuaGlkZUdob3N0Rm9yVGFyZ2V0ID0gZnVuY3Rpb24gX3VuaGlkZUdob3N0Rm9yVGFyZ2V0KCkge1xuICBpZiAoIXN1cHBvcnRDc3NQb2ludGVyRXZlbnRzICYmIGdob3N0RWwpIHtcbiAgICBjc3MoZ2hvc3RFbCwgJ2Rpc3BsYXknLCAnJyk7XG4gIH1cbn07IC8vICMxMTg0IGZpeCAtIFByZXZlbnQgY2xpY2sgZXZlbnQgb24gZmFsbGJhY2sgaWYgZHJhZ2dlZCBidXQgaXRlbSBub3QgY2hhbmdlZCBwb3NpdGlvblxuXG5cbmlmIChkb2N1bWVudEV4aXN0cykge1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldnQpIHtcbiAgICBpZiAoaWdub3JlTmV4dENsaWNrKSB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24gJiYgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgZXZ0LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiAmJiBldnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICBpZ25vcmVOZXh0Q2xpY2sgPSBmYWxzZTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0sIHRydWUpO1xufVxuXG52YXIgbmVhcmVzdEVtcHR5SW5zZXJ0RGV0ZWN0RXZlbnQgPSBmdW5jdGlvbiBuZWFyZXN0RW1wdHlJbnNlcnREZXRlY3RFdmVudChldnQpIHtcbiAgaWYgKGRyYWdFbCkge1xuICAgIGV2dCA9IGV2dC50b3VjaGVzID8gZXZ0LnRvdWNoZXNbMF0gOiBldnQ7XG5cbiAgICB2YXIgbmVhcmVzdCA9IF9kZXRlY3ROZWFyZXN0RW1wdHlTb3J0YWJsZShldnQuY2xpZW50WCwgZXZ0LmNsaWVudFkpO1xuXG4gICAgaWYgKG5lYXJlc3QpIHtcbiAgICAgIC8vIENyZWF0ZSBpbWl0YXRpb24gZXZlbnRcbiAgICAgIHZhciBldmVudCA9IHt9O1xuXG4gICAgICBmb3IgKHZhciBpIGluIGV2dCkge1xuICAgICAgICBpZiAoZXZ0Lmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgZXZlbnRbaV0gPSBldnRbaV07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZXZlbnQudGFyZ2V0ID0gZXZlbnQucm9vdEVsID0gbmVhcmVzdDtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0ID0gdm9pZCAwO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uID0gdm9pZCAwO1xuXG4gICAgICBuZWFyZXN0W2V4cGFuZG9dLl9vbkRyYWdPdmVyKGV2ZW50KTtcbiAgICB9XG4gIH1cbn07XG5cbnZhciBfY2hlY2tPdXRzaWRlVGFyZ2V0RWwgPSBmdW5jdGlvbiBfY2hlY2tPdXRzaWRlVGFyZ2V0RWwoZXZ0KSB7XG4gIGlmIChkcmFnRWwpIHtcbiAgICBkcmFnRWwucGFyZW50Tm9kZVtleHBhbmRvXS5faXNPdXRzaWRlVGhpc0VsKGV2dC50YXJnZXQpO1xuICB9XG59O1xuLyoqXG4gKiBAY2xhc3MgIFNvcnRhYmxlXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gIGVsXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgIFtvcHRpb25zXVxuICovXG5cblxuZnVuY3Rpb24gU29ydGFibGUoZWwsIG9wdGlvbnMpIHtcbiAgaWYgKCEoZWwgJiYgZWwubm9kZVR5cGUgJiYgZWwubm9kZVR5cGUgPT09IDEpKSB7XG4gICAgdGhyb3cgXCJTb3J0YWJsZTogYGVsYCBtdXN0IGJlIGFuIEhUTUxFbGVtZW50LCBub3QgXCIuY29uY2F0KHt9LnRvU3RyaW5nLmNhbGwoZWwpKTtcbiAgfVxuXG4gIHRoaXMuZWwgPSBlbDsgLy8gcm9vdCBlbGVtZW50XG5cbiAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyA9IF9leHRlbmRzKHt9LCBvcHRpb25zKTsgLy8gRXhwb3J0IGluc3RhbmNlXG5cbiAgZWxbZXhwYW5kb10gPSB0aGlzO1xuICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgZ3JvdXA6IG51bGwsXG4gICAgc29ydDogdHJ1ZSxcbiAgICBkaXNhYmxlZDogZmFsc2UsXG4gICAgc3RvcmU6IG51bGwsXG4gICAgaGFuZGxlOiBudWxsLFxuICAgIGRyYWdnYWJsZTogL15bdW9dbCQvaS50ZXN0KGVsLm5vZGVOYW1lKSA/ICc+bGknIDogJz4qJyxcbiAgICBzd2FwVGhyZXNob2xkOiAxLFxuICAgIC8vIHBlcmNlbnRhZ2U7IDAgPD0geCA8PSAxXG4gICAgaW52ZXJ0U3dhcDogZmFsc2UsXG4gICAgLy8gaW52ZXJ0IGFsd2F5c1xuICAgIGludmVydGVkU3dhcFRocmVzaG9sZDogbnVsbCxcbiAgICAvLyB3aWxsIGJlIHNldCB0byBzYW1lIGFzIHN3YXBUaHJlc2hvbGQgaWYgZGVmYXVsdFxuICAgIHJlbW92ZUNsb25lT25IaWRlOiB0cnVlLFxuICAgIGRpcmVjdGlvbjogZnVuY3Rpb24gZGlyZWN0aW9uKCkge1xuICAgICAgcmV0dXJuIF9kZXRlY3REaXJlY3Rpb24oZWwsIHRoaXMub3B0aW9ucyk7XG4gICAgfSxcbiAgICBnaG9zdENsYXNzOiAnc29ydGFibGUtZ2hvc3QnLFxuICAgIGNob3NlbkNsYXNzOiAnc29ydGFibGUtY2hvc2VuJyxcbiAgICBkcmFnQ2xhc3M6ICdzb3J0YWJsZS1kcmFnJyxcbiAgICBpZ25vcmU6ICdhLCBpbWcnLFxuICAgIGZpbHRlcjogbnVsbCxcbiAgICBwcmV2ZW50T25GaWx0ZXI6IHRydWUsXG4gICAgYW5pbWF0aW9uOiAwLFxuICAgIGVhc2luZzogbnVsbCxcbiAgICBzZXREYXRhOiBmdW5jdGlvbiBzZXREYXRhKGRhdGFUcmFuc2ZlciwgZHJhZ0VsKSB7XG4gICAgICBkYXRhVHJhbnNmZXIuc2V0RGF0YSgnVGV4dCcsIGRyYWdFbC50ZXh0Q29udGVudCk7XG4gICAgfSxcbiAgICBkcm9wQnViYmxlOiBmYWxzZSxcbiAgICBkcmFnb3ZlckJ1YmJsZTogZmFsc2UsXG4gICAgZGF0YUlkQXR0cjogJ2RhdGEtaWQnLFxuICAgIGRlbGF5OiAwLFxuICAgIGRlbGF5T25Ub3VjaE9ubHk6IGZhbHNlLFxuICAgIHRvdWNoU3RhcnRUaHJlc2hvbGQ6IChOdW1iZXIucGFyc2VJbnQgPyBOdW1iZXIgOiB3aW5kb3cpLnBhcnNlSW50KHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvLCAxMCkgfHwgMSxcbiAgICBmb3JjZUZhbGxiYWNrOiBmYWxzZSxcbiAgICBmYWxsYmFja0NsYXNzOiAnc29ydGFibGUtZmFsbGJhY2snLFxuICAgIGZhbGxiYWNrT25Cb2R5OiBmYWxzZSxcbiAgICBmYWxsYmFja1RvbGVyYW5jZTogMCxcbiAgICBmYWxsYmFja09mZnNldDoge1xuICAgICAgeDogMCxcbiAgICAgIHk6IDBcbiAgICB9LFxuICAgIHN1cHBvcnRQb2ludGVyOiBTb3J0YWJsZS5zdXBwb3J0UG9pbnRlciAhPT0gZmFsc2UgJiYgJ1BvaW50ZXJFdmVudCcgaW4gd2luZG93ICYmICFTYWZhcmksXG4gICAgZW1wdHlJbnNlcnRUaHJlc2hvbGQ6IDVcbiAgfTtcbiAgUGx1Z2luTWFuYWdlci5pbml0aWFsaXplUGx1Z2lucyh0aGlzLCBlbCwgZGVmYXVsdHMpOyAvLyBTZXQgZGVmYXVsdCBvcHRpb25zXG5cbiAgZm9yICh2YXIgbmFtZSBpbiBkZWZhdWx0cykge1xuICAgICEobmFtZSBpbiBvcHRpb25zKSAmJiAob3B0aW9uc1tuYW1lXSA9IGRlZmF1bHRzW25hbWVdKTtcbiAgfVxuXG4gIF9wcmVwYXJlR3JvdXAob3B0aW9ucyk7IC8vIEJpbmQgYWxsIHByaXZhdGUgbWV0aG9kc1xuXG5cbiAgZm9yICh2YXIgZm4gaW4gdGhpcykge1xuICAgIGlmIChmbi5jaGFyQXQoMCkgPT09ICdfJyAmJiB0eXBlb2YgdGhpc1tmbl0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXNbZm5dID0gdGhpc1tmbl0uYmluZCh0aGlzKTtcbiAgICB9XG4gIH0gLy8gU2V0dXAgZHJhZyBtb2RlXG5cblxuICB0aGlzLm5hdGl2ZURyYWdnYWJsZSA9IG9wdGlvbnMuZm9yY2VGYWxsYmFjayA/IGZhbHNlIDogc3VwcG9ydERyYWdnYWJsZTtcblxuICBpZiAodGhpcy5uYXRpdmVEcmFnZ2FibGUpIHtcbiAgICAvLyBUb3VjaCBzdGFydCB0aHJlc2hvbGQgY2Fubm90IGJlIGdyZWF0ZXIgdGhhbiB0aGUgbmF0aXZlIGRyYWdzdGFydCB0aHJlc2hvbGRcbiAgICB0aGlzLm9wdGlvbnMudG91Y2hTdGFydFRocmVzaG9sZCA9IDE7XG4gIH0gLy8gQmluZCBldmVudHNcblxuXG4gIGlmIChvcHRpb25zLnN1cHBvcnRQb2ludGVyKSB7XG4gICAgb24oZWwsICdwb2ludGVyZG93bicsIHRoaXMuX29uVGFwU3RhcnQpO1xuICB9IGVsc2Uge1xuICAgIG9uKGVsLCAnbW91c2Vkb3duJywgdGhpcy5fb25UYXBTdGFydCk7XG4gICAgb24oZWwsICd0b3VjaHN0YXJ0JywgdGhpcy5fb25UYXBTdGFydCk7XG4gIH1cblxuICBpZiAodGhpcy5uYXRpdmVEcmFnZ2FibGUpIHtcbiAgICBvbihlbCwgJ2RyYWdvdmVyJywgdGhpcyk7XG4gICAgb24oZWwsICdkcmFnZW50ZXInLCB0aGlzKTtcbiAgfVxuXG4gIHNvcnRhYmxlcy5wdXNoKHRoaXMuZWwpOyAvLyBSZXN0b3JlIHNvcnRpbmdcblxuICBvcHRpb25zLnN0b3JlICYmIG9wdGlvbnMuc3RvcmUuZ2V0ICYmIHRoaXMuc29ydChvcHRpb25zLnN0b3JlLmdldCh0aGlzKSB8fCBbXSk7IC8vIEFkZCBhbmltYXRpb24gc3RhdGUgbWFuYWdlclxuXG4gIF9leHRlbmRzKHRoaXMsIEFuaW1hdGlvblN0YXRlTWFuYWdlcigpKTtcbn1cblxuU29ydGFibGUucHJvdG90eXBlID1cbi8qKiBAbGVuZHMgU29ydGFibGUucHJvdG90eXBlICovXG57XG4gIGNvbnN0cnVjdG9yOiBTb3J0YWJsZSxcbiAgX2lzT3V0c2lkZVRoaXNFbDogZnVuY3Rpb24gX2lzT3V0c2lkZVRoaXNFbCh0YXJnZXQpIHtcbiAgICBpZiAoIXRoaXMuZWwuY29udGFpbnModGFyZ2V0KSAmJiB0YXJnZXQgIT09IHRoaXMuZWwpIHtcbiAgICAgIGxhc3RUYXJnZXQgPSBudWxsO1xuICAgIH1cbiAgfSxcbiAgX2dldERpcmVjdGlvbjogZnVuY3Rpb24gX2dldERpcmVjdGlvbihldnQsIHRhcmdldCkge1xuICAgIHJldHVybiB0eXBlb2YgdGhpcy5vcHRpb25zLmRpcmVjdGlvbiA9PT0gJ2Z1bmN0aW9uJyA/IHRoaXMub3B0aW9ucy5kaXJlY3Rpb24uY2FsbCh0aGlzLCBldnQsIHRhcmdldCwgZHJhZ0VsKSA6IHRoaXMub3B0aW9ucy5kaXJlY3Rpb247XG4gIH0sXG4gIF9vblRhcFN0YXJ0OiBmdW5jdGlvbiBfb25UYXBTdGFydChcbiAgLyoqIEV2ZW50fFRvdWNoRXZlbnQgKi9cbiAgZXZ0KSB7XG4gICAgaWYgKCFldnQuY2FuY2VsYWJsZSkgcmV0dXJuO1xuXG4gICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgZWwgPSB0aGlzLmVsLFxuICAgICAgICBvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuICAgICAgICBwcmV2ZW50T25GaWx0ZXIgPSBvcHRpb25zLnByZXZlbnRPbkZpbHRlcixcbiAgICAgICAgdHlwZSA9IGV2dC50eXBlLFxuICAgICAgICB0b3VjaCA9IGV2dC50b3VjaGVzICYmIGV2dC50b3VjaGVzWzBdIHx8IGV2dC5wb2ludGVyVHlwZSAmJiBldnQucG9pbnRlclR5cGUgPT09ICd0b3VjaCcgJiYgZXZ0LFxuICAgICAgICB0YXJnZXQgPSAodG91Y2ggfHwgZXZ0KS50YXJnZXQsXG4gICAgICAgIG9yaWdpbmFsVGFyZ2V0ID0gZXZ0LnRhcmdldC5zaGFkb3dSb290ICYmIChldnQucGF0aCAmJiBldnQucGF0aFswXSB8fCBldnQuY29tcG9zZWRQYXRoICYmIGV2dC5jb21wb3NlZFBhdGgoKVswXSkgfHwgdGFyZ2V0LFxuICAgICAgICBmaWx0ZXIgPSBvcHRpb25zLmZpbHRlcjtcblxuICAgIF9zYXZlSW5wdXRDaGVja2VkU3RhdGUoZWwpOyAvLyBEb24ndCB0cmlnZ2VyIHN0YXJ0IGV2ZW50IHdoZW4gYW4gZWxlbWVudCBpcyBiZWVuIGRyYWdnZWQsIG90aGVyd2lzZSB0aGUgZXZ0Lm9sZGluZGV4IGFsd2F5cyB3cm9uZyB3aGVuIHNldCBvcHRpb24uZ3JvdXAuXG5cblxuICAgIGlmIChkcmFnRWwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoL21vdXNlZG93bnxwb2ludGVyZG93bi8udGVzdCh0eXBlKSAmJiBldnQuYnV0dG9uICE9PSAwIHx8IG9wdGlvbnMuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjsgLy8gb25seSBsZWZ0IGJ1dHRvbiBhbmQgZW5hYmxlZFxuICAgIH0gLy8gY2FuY2VsIGRuZCBpZiBvcmlnaW5hbCB0YXJnZXQgaXMgY29udGVudCBlZGl0YWJsZVxuXG5cbiAgICBpZiAob3JpZ2luYWxUYXJnZXQuaXNDb250ZW50RWRpdGFibGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9IC8vIFNhZmFyaSBpZ25vcmVzIGZ1cnRoZXIgZXZlbnQgaGFuZGxpbmcgYWZ0ZXIgbW91c2Vkb3duXG5cblxuICAgIGlmICghdGhpcy5uYXRpdmVEcmFnZ2FibGUgJiYgU2FmYXJpICYmIHRhcmdldCAmJiB0YXJnZXQudGFnTmFtZS50b1VwcGVyQ2FzZSgpID09PSAnU0VMRUNUJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRhcmdldCA9IGNsb3Nlc3QodGFyZ2V0LCBvcHRpb25zLmRyYWdnYWJsZSwgZWwsIGZhbHNlKTtcblxuICAgIGlmICh0YXJnZXQgJiYgdGFyZ2V0LmFuaW1hdGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGxhc3REb3duRWwgPT09IHRhcmdldCkge1xuICAgICAgLy8gSWdub3JpbmcgZHVwbGljYXRlIGBkb3duYFxuICAgICAgcmV0dXJuO1xuICAgIH0gLy8gR2V0IHRoZSBpbmRleCBvZiB0aGUgZHJhZ2dlZCBlbGVtZW50IHdpdGhpbiBpdHMgcGFyZW50XG5cblxuICAgIG9sZEluZGV4ID0gaW5kZXgodGFyZ2V0KTtcbiAgICBvbGREcmFnZ2FibGVJbmRleCA9IGluZGV4KHRhcmdldCwgb3B0aW9ucy5kcmFnZ2FibGUpOyAvLyBDaGVjayBmaWx0ZXJcblxuICAgIGlmICh0eXBlb2YgZmlsdGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBpZiAoZmlsdGVyLmNhbGwodGhpcywgZXZ0LCB0YXJnZXQsIHRoaXMpKSB7XG4gICAgICAgIF9kaXNwYXRjaEV2ZW50KHtcbiAgICAgICAgICBzb3J0YWJsZTogX3RoaXMsXG4gICAgICAgICAgcm9vdEVsOiBvcmlnaW5hbFRhcmdldCxcbiAgICAgICAgICBuYW1lOiAnZmlsdGVyJyxcbiAgICAgICAgICB0YXJnZXRFbDogdGFyZ2V0LFxuICAgICAgICAgIHRvRWw6IGVsLFxuICAgICAgICAgIGZyb21FbDogZWxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcGx1Z2luRXZlbnQoJ2ZpbHRlcicsIF90aGlzLCB7XG4gICAgICAgICAgZXZ0OiBldnRcbiAgICAgICAgfSk7XG4gICAgICAgIHByZXZlbnRPbkZpbHRlciAmJiBldnQuY2FuY2VsYWJsZSAmJiBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgcmV0dXJuOyAvLyBjYW5jZWwgZG5kXG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmaWx0ZXIpIHtcbiAgICAgIGZpbHRlciA9IGZpbHRlci5zcGxpdCgnLCcpLnNvbWUoZnVuY3Rpb24gKGNyaXRlcmlhKSB7XG4gICAgICAgIGNyaXRlcmlhID0gY2xvc2VzdChvcmlnaW5hbFRhcmdldCwgY3JpdGVyaWEudHJpbSgpLCBlbCwgZmFsc2UpO1xuXG4gICAgICAgIGlmIChjcml0ZXJpYSkge1xuICAgICAgICAgIF9kaXNwYXRjaEV2ZW50KHtcbiAgICAgICAgICAgIHNvcnRhYmxlOiBfdGhpcyxcbiAgICAgICAgICAgIHJvb3RFbDogY3JpdGVyaWEsXG4gICAgICAgICAgICBuYW1lOiAnZmlsdGVyJyxcbiAgICAgICAgICAgIHRhcmdldEVsOiB0YXJnZXQsXG4gICAgICAgICAgICBmcm9tRWw6IGVsLFxuICAgICAgICAgICAgdG9FbDogZWxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHBsdWdpbkV2ZW50KCdmaWx0ZXInLCBfdGhpcywge1xuICAgICAgICAgICAgZXZ0OiBldnRcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmIChmaWx0ZXIpIHtcbiAgICAgICAgcHJldmVudE9uRmlsdGVyICYmIGV2dC5jYW5jZWxhYmxlICYmIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICByZXR1cm47IC8vIGNhbmNlbCBkbmRcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5oYW5kbGUgJiYgIWNsb3Nlc3Qob3JpZ2luYWxUYXJnZXQsIG9wdGlvbnMuaGFuZGxlLCBlbCwgZmFsc2UpKSB7XG4gICAgICByZXR1cm47XG4gICAgfSAvLyBQcmVwYXJlIGBkcmFnc3RhcnRgXG5cblxuICAgIHRoaXMuX3ByZXBhcmVEcmFnU3RhcnQoZXZ0LCB0b3VjaCwgdGFyZ2V0KTtcbiAgfSxcbiAgX3ByZXBhcmVEcmFnU3RhcnQ6IGZ1bmN0aW9uIF9wcmVwYXJlRHJhZ1N0YXJ0KFxuICAvKiogRXZlbnQgKi9cbiAgZXZ0LFxuICAvKiogVG91Y2ggKi9cbiAgdG91Y2gsXG4gIC8qKiBIVE1MRWxlbWVudCAqL1xuICB0YXJnZXQpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICBlbCA9IF90aGlzLmVsLFxuICAgICAgICBvcHRpb25zID0gX3RoaXMub3B0aW9ucyxcbiAgICAgICAgb3duZXJEb2N1bWVudCA9IGVsLm93bmVyRG9jdW1lbnQsXG4gICAgICAgIGRyYWdTdGFydEZuO1xuXG4gICAgaWYgKHRhcmdldCAmJiAhZHJhZ0VsICYmIHRhcmdldC5wYXJlbnROb2RlID09PSBlbCkge1xuICAgICAgdmFyIGRyYWdSZWN0ID0gZ2V0UmVjdCh0YXJnZXQpO1xuICAgICAgcm9vdEVsID0gZWw7XG4gICAgICBkcmFnRWwgPSB0YXJnZXQ7XG4gICAgICBwYXJlbnRFbCA9IGRyYWdFbC5wYXJlbnROb2RlO1xuICAgICAgbmV4dEVsID0gZHJhZ0VsLm5leHRTaWJsaW5nO1xuICAgICAgbGFzdERvd25FbCA9IHRhcmdldDtcbiAgICAgIGFjdGl2ZUdyb3VwID0gb3B0aW9ucy5ncm91cDtcbiAgICAgIFNvcnRhYmxlLmRyYWdnZWQgPSBkcmFnRWw7XG4gICAgICB0YXBFdnQgPSB7XG4gICAgICAgIHRhcmdldDogZHJhZ0VsLFxuICAgICAgICBjbGllbnRYOiAodG91Y2ggfHwgZXZ0KS5jbGllbnRYLFxuICAgICAgICBjbGllbnRZOiAodG91Y2ggfHwgZXZ0KS5jbGllbnRZXG4gICAgICB9O1xuICAgICAgdGFwRGlzdGFuY2VMZWZ0ID0gdGFwRXZ0LmNsaWVudFggLSBkcmFnUmVjdC5sZWZ0O1xuICAgICAgdGFwRGlzdGFuY2VUb3AgPSB0YXBFdnQuY2xpZW50WSAtIGRyYWdSZWN0LnRvcDtcbiAgICAgIHRoaXMuX2xhc3RYID0gKHRvdWNoIHx8IGV2dCkuY2xpZW50WDtcbiAgICAgIHRoaXMuX2xhc3RZID0gKHRvdWNoIHx8IGV2dCkuY2xpZW50WTtcbiAgICAgIGRyYWdFbC5zdHlsZVsnd2lsbC1jaGFuZ2UnXSA9ICdhbGwnO1xuXG4gICAgICBkcmFnU3RhcnRGbiA9IGZ1bmN0aW9uIGRyYWdTdGFydEZuKCkge1xuICAgICAgICBwbHVnaW5FdmVudCgnZGVsYXlFbmRlZCcsIF90aGlzLCB7XG4gICAgICAgICAgZXZ0OiBldnRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKFNvcnRhYmxlLmV2ZW50Q2FuY2VsZWQpIHtcbiAgICAgICAgICBfdGhpcy5fb25Ecm9wKCk7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gLy8gRGVsYXllZCBkcmFnIGhhcyBiZWVuIHRyaWdnZXJlZFxuICAgICAgICAvLyB3ZSBjYW4gcmUtZW5hYmxlIHRoZSBldmVudHM6IHRvdWNobW92ZS9tb3VzZW1vdmVcblxuXG4gICAgICAgIF90aGlzLl9kaXNhYmxlRGVsYXllZERyYWdFdmVudHMoKTtcblxuICAgICAgICBpZiAoIUZpcmVGb3ggJiYgX3RoaXMubmF0aXZlRHJhZ2dhYmxlKSB7XG4gICAgICAgICAgZHJhZ0VsLmRyYWdnYWJsZSA9IHRydWU7XG4gICAgICAgIH0gLy8gQmluZCB0aGUgZXZlbnRzOiBkcmFnc3RhcnQvZHJhZ2VuZFxuXG5cbiAgICAgICAgX3RoaXMuX3RyaWdnZXJEcmFnU3RhcnQoZXZ0LCB0b3VjaCk7IC8vIERyYWcgc3RhcnQgZXZlbnRcblxuXG4gICAgICAgIF9kaXNwYXRjaEV2ZW50KHtcbiAgICAgICAgICBzb3J0YWJsZTogX3RoaXMsXG4gICAgICAgICAgbmFtZTogJ2Nob29zZScsXG4gICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZ0XG4gICAgICAgIH0pOyAvLyBDaG9zZW4gaXRlbVxuXG5cbiAgICAgICAgdG9nZ2xlQ2xhc3MoZHJhZ0VsLCBvcHRpb25zLmNob3NlbkNsYXNzLCB0cnVlKTtcbiAgICAgIH07IC8vIERpc2FibGUgXCJkcmFnZ2FibGVcIlxuXG5cbiAgICAgIG9wdGlvbnMuaWdub3JlLnNwbGl0KCcsJykuZm9yRWFjaChmdW5jdGlvbiAoY3JpdGVyaWEpIHtcbiAgICAgICAgZmluZChkcmFnRWwsIGNyaXRlcmlhLnRyaW0oKSwgX2Rpc2FibGVEcmFnZ2FibGUpO1xuICAgICAgfSk7XG4gICAgICBvbihvd25lckRvY3VtZW50LCAnZHJhZ292ZXInLCBuZWFyZXN0RW1wdHlJbnNlcnREZXRlY3RFdmVudCk7XG4gICAgICBvbihvd25lckRvY3VtZW50LCAnbW91c2Vtb3ZlJywgbmVhcmVzdEVtcHR5SW5zZXJ0RGV0ZWN0RXZlbnQpO1xuICAgICAgb24ob3duZXJEb2N1bWVudCwgJ3RvdWNobW92ZScsIG5lYXJlc3RFbXB0eUluc2VydERldGVjdEV2ZW50KTtcbiAgICAgIG9uKG93bmVyRG9jdW1lbnQsICdtb3VzZXVwJywgX3RoaXMuX29uRHJvcCk7XG4gICAgICBvbihvd25lckRvY3VtZW50LCAndG91Y2hlbmQnLCBfdGhpcy5fb25Ecm9wKTtcbiAgICAgIG9uKG93bmVyRG9jdW1lbnQsICd0b3VjaGNhbmNlbCcsIF90aGlzLl9vbkRyb3ApOyAvLyBNYWtlIGRyYWdFbCBkcmFnZ2FibGUgKG11c3QgYmUgYmVmb3JlIGRlbGF5IGZvciBGaXJlRm94KVxuXG4gICAgICBpZiAoRmlyZUZveCAmJiB0aGlzLm5hdGl2ZURyYWdnYWJsZSkge1xuICAgICAgICB0aGlzLm9wdGlvbnMudG91Y2hTdGFydFRocmVzaG9sZCA9IDQ7XG4gICAgICAgIGRyYWdFbC5kcmFnZ2FibGUgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBwbHVnaW5FdmVudCgnZGVsYXlTdGFydCcsIHRoaXMsIHtcbiAgICAgICAgZXZ0OiBldnRcbiAgICAgIH0pOyAvLyBEZWxheSBpcyBpbXBvc3NpYmxlIGZvciBuYXRpdmUgRG5EIGluIEVkZ2Ugb3IgSUVcblxuICAgICAgaWYgKG9wdGlvbnMuZGVsYXkgJiYgKCFvcHRpb25zLmRlbGF5T25Ub3VjaE9ubHkgfHwgdG91Y2gpICYmICghdGhpcy5uYXRpdmVEcmFnZ2FibGUgfHwgIShFZGdlIHx8IElFMTFPckxlc3MpKSkge1xuICAgICAgICBpZiAoU29ydGFibGUuZXZlbnRDYW5jZWxlZCkge1xuICAgICAgICAgIHRoaXMuX29uRHJvcCgpO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IC8vIElmIHRoZSB1c2VyIG1vdmVzIHRoZSBwb2ludGVyIG9yIGxldCBnbyB0aGUgY2xpY2sgb3IgdG91Y2hcbiAgICAgICAgLy8gYmVmb3JlIHRoZSBkZWxheSBoYXMgYmVlbiByZWFjaGVkOlxuICAgICAgICAvLyBkaXNhYmxlIHRoZSBkZWxheWVkIGRyYWdcblxuXG4gICAgICAgIG9uKG93bmVyRG9jdW1lbnQsICdtb3VzZXVwJywgX3RoaXMuX2Rpc2FibGVEZWxheWVkRHJhZyk7XG4gICAgICAgIG9uKG93bmVyRG9jdW1lbnQsICd0b3VjaGVuZCcsIF90aGlzLl9kaXNhYmxlRGVsYXllZERyYWcpO1xuICAgICAgICBvbihvd25lckRvY3VtZW50LCAndG91Y2hjYW5jZWwnLCBfdGhpcy5fZGlzYWJsZURlbGF5ZWREcmFnKTtcbiAgICAgICAgb24ob3duZXJEb2N1bWVudCwgJ21vdXNlbW92ZScsIF90aGlzLl9kZWxheWVkRHJhZ1RvdWNoTW92ZUhhbmRsZXIpO1xuICAgICAgICBvbihvd25lckRvY3VtZW50LCAndG91Y2htb3ZlJywgX3RoaXMuX2RlbGF5ZWREcmFnVG91Y2hNb3ZlSGFuZGxlcik7XG4gICAgICAgIG9wdGlvbnMuc3VwcG9ydFBvaW50ZXIgJiYgb24ob3duZXJEb2N1bWVudCwgJ3BvaW50ZXJtb3ZlJywgX3RoaXMuX2RlbGF5ZWREcmFnVG91Y2hNb3ZlSGFuZGxlcik7XG4gICAgICAgIF90aGlzLl9kcmFnU3RhcnRUaW1lciA9IHNldFRpbWVvdXQoZHJhZ1N0YXJ0Rm4sIG9wdGlvbnMuZGVsYXkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZHJhZ1N0YXJ0Rm4oKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIF9kZWxheWVkRHJhZ1RvdWNoTW92ZUhhbmRsZXI6IGZ1bmN0aW9uIF9kZWxheWVkRHJhZ1RvdWNoTW92ZUhhbmRsZXIoXG4gIC8qKiBUb3VjaEV2ZW50fFBvaW50ZXJFdmVudCAqKi9cbiAgZSkge1xuICAgIHZhciB0b3VjaCA9IGUudG91Y2hlcyA/IGUudG91Y2hlc1swXSA6IGU7XG5cbiAgICBpZiAoTWF0aC5tYXgoTWF0aC5hYnModG91Y2guY2xpZW50WCAtIHRoaXMuX2xhc3RYKSwgTWF0aC5hYnModG91Y2guY2xpZW50WSAtIHRoaXMuX2xhc3RZKSkgPj0gTWF0aC5mbG9vcih0aGlzLm9wdGlvbnMudG91Y2hTdGFydFRocmVzaG9sZCAvICh0aGlzLm5hdGl2ZURyYWdnYWJsZSAmJiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxKSkpIHtcbiAgICAgIHRoaXMuX2Rpc2FibGVEZWxheWVkRHJhZygpO1xuICAgIH1cbiAgfSxcbiAgX2Rpc2FibGVEZWxheWVkRHJhZzogZnVuY3Rpb24gX2Rpc2FibGVEZWxheWVkRHJhZygpIHtcbiAgICBkcmFnRWwgJiYgX2Rpc2FibGVEcmFnZ2FibGUoZHJhZ0VsKTtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5fZHJhZ1N0YXJ0VGltZXIpO1xuXG4gICAgdGhpcy5fZGlzYWJsZURlbGF5ZWREcmFnRXZlbnRzKCk7XG4gIH0sXG4gIF9kaXNhYmxlRGVsYXllZERyYWdFdmVudHM6IGZ1bmN0aW9uIF9kaXNhYmxlRGVsYXllZERyYWdFdmVudHMoKSB7XG4gICAgdmFyIG93bmVyRG9jdW1lbnQgPSB0aGlzLmVsLm93bmVyRG9jdW1lbnQ7XG4gICAgb2ZmKG93bmVyRG9jdW1lbnQsICdtb3VzZXVwJywgdGhpcy5fZGlzYWJsZURlbGF5ZWREcmFnKTtcbiAgICBvZmYob3duZXJEb2N1bWVudCwgJ3RvdWNoZW5kJywgdGhpcy5fZGlzYWJsZURlbGF5ZWREcmFnKTtcbiAgICBvZmYob3duZXJEb2N1bWVudCwgJ3RvdWNoY2FuY2VsJywgdGhpcy5fZGlzYWJsZURlbGF5ZWREcmFnKTtcbiAgICBvZmYob3duZXJEb2N1bWVudCwgJ21vdXNlbW92ZScsIHRoaXMuX2RlbGF5ZWREcmFnVG91Y2hNb3ZlSGFuZGxlcik7XG4gICAgb2ZmKG93bmVyRG9jdW1lbnQsICd0b3VjaG1vdmUnLCB0aGlzLl9kZWxheWVkRHJhZ1RvdWNoTW92ZUhhbmRsZXIpO1xuICAgIG9mZihvd25lckRvY3VtZW50LCAncG9pbnRlcm1vdmUnLCB0aGlzLl9kZWxheWVkRHJhZ1RvdWNoTW92ZUhhbmRsZXIpO1xuICB9LFxuICBfdHJpZ2dlckRyYWdTdGFydDogZnVuY3Rpb24gX3RyaWdnZXJEcmFnU3RhcnQoXG4gIC8qKiBFdmVudCAqL1xuICBldnQsXG4gIC8qKiBUb3VjaCAqL1xuICB0b3VjaCkge1xuICAgIHRvdWNoID0gdG91Y2ggfHwgZXZ0LnBvaW50ZXJUeXBlID09ICd0b3VjaCcgJiYgZXZ0O1xuXG4gICAgaWYgKCF0aGlzLm5hdGl2ZURyYWdnYWJsZSB8fCB0b3VjaCkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5zdXBwb3J0UG9pbnRlcikge1xuICAgICAgICBvbihkb2N1bWVudCwgJ3BvaW50ZXJtb3ZlJywgdGhpcy5fb25Ub3VjaE1vdmUpO1xuICAgICAgfSBlbHNlIGlmICh0b3VjaCkge1xuICAgICAgICBvbihkb2N1bWVudCwgJ3RvdWNobW92ZScsIHRoaXMuX29uVG91Y2hNb3ZlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9uKGRvY3VtZW50LCAnbW91c2Vtb3ZlJywgdGhpcy5fb25Ub3VjaE1vdmUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBvbihkcmFnRWwsICdkcmFnZW5kJywgdGhpcyk7XG4gICAgICBvbihyb290RWwsICdkcmFnc3RhcnQnLCB0aGlzLl9vbkRyYWdTdGFydCk7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGlmIChkb2N1bWVudC5zZWxlY3Rpb24pIHtcbiAgICAgICAgLy8gVGltZW91dCBuZWNjZXNzYXJ5IGZvciBJRTlcbiAgICAgICAgX25leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBkb2N1bWVudC5zZWxlY3Rpb24uZW1wdHkoKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7fVxuICB9LFxuICBfZHJhZ1N0YXJ0ZWQ6IGZ1bmN0aW9uIF9kcmFnU3RhcnRlZChmYWxsYmFjaywgZXZ0KSB7XG5cbiAgICBhd2FpdGluZ0RyYWdTdGFydGVkID0gZmFsc2U7XG5cbiAgICBpZiAocm9vdEVsICYmIGRyYWdFbCkge1xuICAgICAgcGx1Z2luRXZlbnQoJ2RyYWdTdGFydGVkJywgdGhpcywge1xuICAgICAgICBldnQ6IGV2dFxuICAgICAgfSk7XG5cbiAgICAgIGlmICh0aGlzLm5hdGl2ZURyYWdnYWJsZSkge1xuICAgICAgICBvbihkb2N1bWVudCwgJ2RyYWdvdmVyJywgX2NoZWNrT3V0c2lkZVRhcmdldEVsKTtcbiAgICAgIH1cblxuICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7IC8vIEFwcGx5IGVmZmVjdFxuXG4gICAgICAhZmFsbGJhY2sgJiYgdG9nZ2xlQ2xhc3MoZHJhZ0VsLCBvcHRpb25zLmRyYWdDbGFzcywgZmFsc2UpO1xuICAgICAgdG9nZ2xlQ2xhc3MoZHJhZ0VsLCBvcHRpb25zLmdob3N0Q2xhc3MsIHRydWUpO1xuICAgICAgU29ydGFibGUuYWN0aXZlID0gdGhpcztcbiAgICAgIGZhbGxiYWNrICYmIHRoaXMuX2FwcGVuZEdob3N0KCk7IC8vIERyYWcgc3RhcnQgZXZlbnRcblxuICAgICAgX2Rpc3BhdGNoRXZlbnQoe1xuICAgICAgICBzb3J0YWJsZTogdGhpcyxcbiAgICAgICAgbmFtZTogJ3N0YXJ0JyxcbiAgICAgICAgb3JpZ2luYWxFdmVudDogZXZ0XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fbnVsbGluZygpO1xuICAgIH1cbiAgfSxcbiAgX2VtdWxhdGVEcmFnT3ZlcjogZnVuY3Rpb24gX2VtdWxhdGVEcmFnT3ZlcigpIHtcbiAgICBpZiAodG91Y2hFdnQpIHtcbiAgICAgIHRoaXMuX2xhc3RYID0gdG91Y2hFdnQuY2xpZW50WDtcbiAgICAgIHRoaXMuX2xhc3RZID0gdG91Y2hFdnQuY2xpZW50WTtcblxuICAgICAgX2hpZGVHaG9zdEZvclRhcmdldCgpO1xuXG4gICAgICB2YXIgdGFyZ2V0ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludCh0b3VjaEV2dC5jbGllbnRYLCB0b3VjaEV2dC5jbGllbnRZKTtcbiAgICAgIHZhciBwYXJlbnQgPSB0YXJnZXQ7XG5cbiAgICAgIHdoaWxlICh0YXJnZXQgJiYgdGFyZ2V0LnNoYWRvd1Jvb3QpIHtcbiAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LnNoYWRvd1Jvb3QuZWxlbWVudEZyb21Qb2ludCh0b3VjaEV2dC5jbGllbnRYLCB0b3VjaEV2dC5jbGllbnRZKTtcbiAgICAgICAgaWYgKHRhcmdldCA9PT0gcGFyZW50KSBicmVhaztcbiAgICAgICAgcGFyZW50ID0gdGFyZ2V0O1xuICAgICAgfVxuXG4gICAgICBkcmFnRWwucGFyZW50Tm9kZVtleHBhbmRvXS5faXNPdXRzaWRlVGhpc0VsKHRhcmdldCk7XG5cbiAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgZG8ge1xuICAgICAgICAgIGlmIChwYXJlbnRbZXhwYW5kb10pIHtcbiAgICAgICAgICAgIHZhciBpbnNlcnRlZCA9IHZvaWQgMDtcbiAgICAgICAgICAgIGluc2VydGVkID0gcGFyZW50W2V4cGFuZG9dLl9vbkRyYWdPdmVyKHtcbiAgICAgICAgICAgICAgY2xpZW50WDogdG91Y2hFdnQuY2xpZW50WCxcbiAgICAgICAgICAgICAgY2xpZW50WTogdG91Y2hFdnQuY2xpZW50WSxcbiAgICAgICAgICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICAgICAgICAgIHJvb3RFbDogcGFyZW50XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKGluc2VydGVkICYmICF0aGlzLm9wdGlvbnMuZHJhZ292ZXJCdWJibGUpIHtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGFyZ2V0ID0gcGFyZW50OyAvLyBzdG9yZSBsYXN0IGVsZW1lbnRcbiAgICAgICAgfVxuICAgICAgICAvKiBqc2hpbnQgYm9zczp0cnVlICovXG4gICAgICAgIHdoaWxlIChwYXJlbnQgPSBwYXJlbnQucGFyZW50Tm9kZSk7XG4gICAgICB9XG5cbiAgICAgIF91bmhpZGVHaG9zdEZvclRhcmdldCgpO1xuICAgIH1cbiAgfSxcbiAgX29uVG91Y2hNb3ZlOiBmdW5jdGlvbiBfb25Ub3VjaE1vdmUoXG4gIC8qKlRvdWNoRXZlbnQqL1xuICBldnQpIHtcbiAgICBpZiAodGFwRXZ0KSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucyxcbiAgICAgICAgICBmYWxsYmFja1RvbGVyYW5jZSA9IG9wdGlvbnMuZmFsbGJhY2tUb2xlcmFuY2UsXG4gICAgICAgICAgZmFsbGJhY2tPZmZzZXQgPSBvcHRpb25zLmZhbGxiYWNrT2Zmc2V0LFxuICAgICAgICAgIHRvdWNoID0gZXZ0LnRvdWNoZXMgPyBldnQudG91Y2hlc1swXSA6IGV2dCxcbiAgICAgICAgICBnaG9zdE1hdHJpeCA9IGdob3N0RWwgJiYgbWF0cml4KGdob3N0RWwsIHRydWUpLFxuICAgICAgICAgIHNjYWxlWCA9IGdob3N0RWwgJiYgZ2hvc3RNYXRyaXggJiYgZ2hvc3RNYXRyaXguYSxcbiAgICAgICAgICBzY2FsZVkgPSBnaG9zdEVsICYmIGdob3N0TWF0cml4ICYmIGdob3N0TWF0cml4LmQsXG4gICAgICAgICAgcmVsYXRpdmVTY3JvbGxPZmZzZXQgPSBQb3NpdGlvbkdob3N0QWJzb2x1dGVseSAmJiBnaG9zdFJlbGF0aXZlUGFyZW50ICYmIGdldFJlbGF0aXZlU2Nyb2xsT2Zmc2V0KGdob3N0UmVsYXRpdmVQYXJlbnQpLFxuICAgICAgICAgIGR4ID0gKHRvdWNoLmNsaWVudFggLSB0YXBFdnQuY2xpZW50WCArIGZhbGxiYWNrT2Zmc2V0LngpIC8gKHNjYWxlWCB8fCAxKSArIChyZWxhdGl2ZVNjcm9sbE9mZnNldCA/IHJlbGF0aXZlU2Nyb2xsT2Zmc2V0WzBdIC0gZ2hvc3RSZWxhdGl2ZVBhcmVudEluaXRpYWxTY3JvbGxbMF0gOiAwKSAvIChzY2FsZVggfHwgMSksXG4gICAgICAgICAgZHkgPSAodG91Y2guY2xpZW50WSAtIHRhcEV2dC5jbGllbnRZICsgZmFsbGJhY2tPZmZzZXQueSkgLyAoc2NhbGVZIHx8IDEpICsgKHJlbGF0aXZlU2Nyb2xsT2Zmc2V0ID8gcmVsYXRpdmVTY3JvbGxPZmZzZXRbMV0gLSBnaG9zdFJlbGF0aXZlUGFyZW50SW5pdGlhbFNjcm9sbFsxXSA6IDApIC8gKHNjYWxlWSB8fCAxKTsgLy8gb25seSBzZXQgdGhlIHN0YXR1cyB0byBkcmFnZ2luZywgd2hlbiB3ZSBhcmUgYWN0dWFsbHkgZHJhZ2dpbmdcblxuICAgICAgaWYgKCFTb3J0YWJsZS5hY3RpdmUgJiYgIWF3YWl0aW5nRHJhZ1N0YXJ0ZWQpIHtcbiAgICAgICAgaWYgKGZhbGxiYWNrVG9sZXJhbmNlICYmIE1hdGgubWF4KE1hdGguYWJzKHRvdWNoLmNsaWVudFggLSB0aGlzLl9sYXN0WCksIE1hdGguYWJzKHRvdWNoLmNsaWVudFkgLSB0aGlzLl9sYXN0WSkpIDwgZmFsbGJhY2tUb2xlcmFuY2UpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9vbkRyYWdTdGFydChldnQsIHRydWUpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZ2hvc3RFbCkge1xuICAgICAgICBpZiAoZ2hvc3RNYXRyaXgpIHtcbiAgICAgICAgICBnaG9zdE1hdHJpeC5lICs9IGR4IC0gKGxhc3REeCB8fCAwKTtcbiAgICAgICAgICBnaG9zdE1hdHJpeC5mICs9IGR5IC0gKGxhc3REeSB8fCAwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBnaG9zdE1hdHJpeCA9IHtcbiAgICAgICAgICAgIGE6IDEsXG4gICAgICAgICAgICBiOiAwLFxuICAgICAgICAgICAgYzogMCxcbiAgICAgICAgICAgIGQ6IDEsXG4gICAgICAgICAgICBlOiBkeCxcbiAgICAgICAgICAgIGY6IGR5XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjc3NNYXRyaXggPSBcIm1hdHJpeChcIi5jb25jYXQoZ2hvc3RNYXRyaXguYSwgXCIsXCIpLmNvbmNhdChnaG9zdE1hdHJpeC5iLCBcIixcIikuY29uY2F0KGdob3N0TWF0cml4LmMsIFwiLFwiKS5jb25jYXQoZ2hvc3RNYXRyaXguZCwgXCIsXCIpLmNvbmNhdChnaG9zdE1hdHJpeC5lLCBcIixcIikuY29uY2F0KGdob3N0TWF0cml4LmYsIFwiKVwiKTtcbiAgICAgICAgY3NzKGdob3N0RWwsICd3ZWJraXRUcmFuc2Zvcm0nLCBjc3NNYXRyaXgpO1xuICAgICAgICBjc3MoZ2hvc3RFbCwgJ21velRyYW5zZm9ybScsIGNzc01hdHJpeCk7XG4gICAgICAgIGNzcyhnaG9zdEVsLCAnbXNUcmFuc2Zvcm0nLCBjc3NNYXRyaXgpO1xuICAgICAgICBjc3MoZ2hvc3RFbCwgJ3RyYW5zZm9ybScsIGNzc01hdHJpeCk7XG4gICAgICAgIGxhc3REeCA9IGR4O1xuICAgICAgICBsYXN0RHkgPSBkeTtcbiAgICAgICAgdG91Y2hFdnQgPSB0b3VjaDtcbiAgICAgIH1cblxuICAgICAgZXZ0LmNhbmNlbGFibGUgJiYgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9LFxuICBfYXBwZW5kR2hvc3Q6IGZ1bmN0aW9uIF9hcHBlbmRHaG9zdCgpIHtcbiAgICAvLyBCdWcgaWYgdXNpbmcgc2NhbGUoKTogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjYzNzA1OFxuICAgIC8vIE5vdCBiZWluZyBhZGp1c3RlZCBmb3JcbiAgICBpZiAoIWdob3N0RWwpIHtcbiAgICAgIHZhciBjb250YWluZXIgPSB0aGlzLm9wdGlvbnMuZmFsbGJhY2tPbkJvZHkgPyBkb2N1bWVudC5ib2R5IDogcm9vdEVsLFxuICAgICAgICAgIHJlY3QgPSBnZXRSZWN0KGRyYWdFbCwgdHJ1ZSwgUG9zaXRpb25HaG9zdEFic29sdXRlbHksIHRydWUsIGNvbnRhaW5lciksXG4gICAgICAgICAgb3B0aW9ucyA9IHRoaXMub3B0aW9uczsgLy8gUG9zaXRpb24gYWJzb2x1dGVseVxuXG4gICAgICBpZiAoUG9zaXRpb25HaG9zdEFic29sdXRlbHkpIHtcbiAgICAgICAgLy8gR2V0IHJlbGF0aXZlbHkgcG9zaXRpb25lZCBwYXJlbnRcbiAgICAgICAgZ2hvc3RSZWxhdGl2ZVBhcmVudCA9IGNvbnRhaW5lcjtcblxuICAgICAgICB3aGlsZSAoY3NzKGdob3N0UmVsYXRpdmVQYXJlbnQsICdwb3NpdGlvbicpID09PSAnc3RhdGljJyAmJiBjc3MoZ2hvc3RSZWxhdGl2ZVBhcmVudCwgJ3RyYW5zZm9ybScpID09PSAnbm9uZScgJiYgZ2hvc3RSZWxhdGl2ZVBhcmVudCAhPT0gZG9jdW1lbnQpIHtcbiAgICAgICAgICBnaG9zdFJlbGF0aXZlUGFyZW50ID0gZ2hvc3RSZWxhdGl2ZVBhcmVudC5wYXJlbnROb2RlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGdob3N0UmVsYXRpdmVQYXJlbnQgIT09IGRvY3VtZW50LmJvZHkgJiYgZ2hvc3RSZWxhdGl2ZVBhcmVudCAhPT0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XG4gICAgICAgICAgaWYgKGdob3N0UmVsYXRpdmVQYXJlbnQgPT09IGRvY3VtZW50KSBnaG9zdFJlbGF0aXZlUGFyZW50ID0gZ2V0V2luZG93U2Nyb2xsaW5nRWxlbWVudCgpO1xuICAgICAgICAgIHJlY3QudG9wICs9IGdob3N0UmVsYXRpdmVQYXJlbnQuc2Nyb2xsVG9wO1xuICAgICAgICAgIHJlY3QubGVmdCArPSBnaG9zdFJlbGF0aXZlUGFyZW50LnNjcm9sbExlZnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZ2hvc3RSZWxhdGl2ZVBhcmVudCA9IGdldFdpbmRvd1Njcm9sbGluZ0VsZW1lbnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdob3N0UmVsYXRpdmVQYXJlbnRJbml0aWFsU2Nyb2xsID0gZ2V0UmVsYXRpdmVTY3JvbGxPZmZzZXQoZ2hvc3RSZWxhdGl2ZVBhcmVudCk7XG4gICAgICB9XG5cbiAgICAgIGdob3N0RWwgPSBkcmFnRWwuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgdG9nZ2xlQ2xhc3MoZ2hvc3RFbCwgb3B0aW9ucy5naG9zdENsYXNzLCBmYWxzZSk7XG4gICAgICB0b2dnbGVDbGFzcyhnaG9zdEVsLCBvcHRpb25zLmZhbGxiYWNrQ2xhc3MsIHRydWUpO1xuICAgICAgdG9nZ2xlQ2xhc3MoZ2hvc3RFbCwgb3B0aW9ucy5kcmFnQ2xhc3MsIHRydWUpO1xuICAgICAgY3NzKGdob3N0RWwsICd0cmFuc2l0aW9uJywgJycpO1xuICAgICAgY3NzKGdob3N0RWwsICd0cmFuc2Zvcm0nLCAnJyk7XG4gICAgICBjc3MoZ2hvc3RFbCwgJ2JveC1zaXppbmcnLCAnYm9yZGVyLWJveCcpO1xuICAgICAgY3NzKGdob3N0RWwsICdtYXJnaW4nLCAwKTtcbiAgICAgIGNzcyhnaG9zdEVsLCAndG9wJywgcmVjdC50b3ApO1xuICAgICAgY3NzKGdob3N0RWwsICdsZWZ0JywgcmVjdC5sZWZ0KTtcbiAgICAgIGNzcyhnaG9zdEVsLCAnd2lkdGgnLCByZWN0LndpZHRoKTtcbiAgICAgIGNzcyhnaG9zdEVsLCAnaGVpZ2h0JywgcmVjdC5oZWlnaHQpO1xuICAgICAgY3NzKGdob3N0RWwsICdvcGFjaXR5JywgJzAuOCcpO1xuICAgICAgY3NzKGdob3N0RWwsICdwb3NpdGlvbicsIFBvc2l0aW9uR2hvc3RBYnNvbHV0ZWx5ID8gJ2Fic29sdXRlJyA6ICdmaXhlZCcpO1xuICAgICAgY3NzKGdob3N0RWwsICd6SW5kZXgnLCAnMTAwMDAwJyk7XG4gICAgICBjc3MoZ2hvc3RFbCwgJ3BvaW50ZXJFdmVudHMnLCAnbm9uZScpO1xuICAgICAgU29ydGFibGUuZ2hvc3QgPSBnaG9zdEVsO1xuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGdob3N0RWwpOyAvLyBTZXQgdHJhbnNmb3JtLW9yaWdpblxuXG4gICAgICBjc3MoZ2hvc3RFbCwgJ3RyYW5zZm9ybS1vcmlnaW4nLCB0YXBEaXN0YW5jZUxlZnQgLyBwYXJzZUludChnaG9zdEVsLnN0eWxlLndpZHRoKSAqIDEwMCArICclICcgKyB0YXBEaXN0YW5jZVRvcCAvIHBhcnNlSW50KGdob3N0RWwuc3R5bGUuaGVpZ2h0KSAqIDEwMCArICclJyk7XG4gICAgfVxuICB9LFxuICBfb25EcmFnU3RhcnQ6IGZ1bmN0aW9uIF9vbkRyYWdTdGFydChcbiAgLyoqRXZlbnQqL1xuICBldnQsXG4gIC8qKmJvb2xlYW4qL1xuICBmYWxsYmFjaykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgZGF0YVRyYW5zZmVyID0gZXZ0LmRhdGFUcmFuc2ZlcjtcbiAgICB2YXIgb3B0aW9ucyA9IF90aGlzLm9wdGlvbnM7XG4gICAgcGx1Z2luRXZlbnQoJ2RyYWdTdGFydCcsIHRoaXMsIHtcbiAgICAgIGV2dDogZXZ0XG4gICAgfSk7XG5cbiAgICBpZiAoU29ydGFibGUuZXZlbnRDYW5jZWxlZCkge1xuICAgICAgdGhpcy5fb25Ecm9wKCk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBwbHVnaW5FdmVudCgnc2V0dXBDbG9uZScsIHRoaXMpO1xuXG4gICAgaWYgKCFTb3J0YWJsZS5ldmVudENhbmNlbGVkKSB7XG4gICAgICBjbG9uZUVsID0gY2xvbmUoZHJhZ0VsKTtcbiAgICAgIGNsb25lRWwuZHJhZ2dhYmxlID0gZmFsc2U7XG4gICAgICBjbG9uZUVsLnN0eWxlWyd3aWxsLWNoYW5nZSddID0gJyc7XG5cbiAgICAgIHRoaXMuX2hpZGVDbG9uZSgpO1xuXG4gICAgICB0b2dnbGVDbGFzcyhjbG9uZUVsLCB0aGlzLm9wdGlvbnMuY2hvc2VuQ2xhc3MsIGZhbHNlKTtcbiAgICAgIFNvcnRhYmxlLmNsb25lID0gY2xvbmVFbDtcbiAgICB9IC8vICMxMTQzOiBJRnJhbWUgc3VwcG9ydCB3b3JrYXJvdW5kXG5cblxuICAgIF90aGlzLmNsb25lSWQgPSBfbmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgcGx1Z2luRXZlbnQoJ2Nsb25lJywgX3RoaXMpO1xuICAgICAgaWYgKFNvcnRhYmxlLmV2ZW50Q2FuY2VsZWQpIHJldHVybjtcblxuICAgICAgaWYgKCFfdGhpcy5vcHRpb25zLnJlbW92ZUNsb25lT25IaWRlKSB7XG4gICAgICAgIHJvb3RFbC5pbnNlcnRCZWZvcmUoY2xvbmVFbCwgZHJhZ0VsKTtcbiAgICAgIH1cblxuICAgICAgX3RoaXMuX2hpZGVDbG9uZSgpO1xuXG4gICAgICBfZGlzcGF0Y2hFdmVudCh7XG4gICAgICAgIHNvcnRhYmxlOiBfdGhpcyxcbiAgICAgICAgbmFtZTogJ2Nsb25lJ1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgIWZhbGxiYWNrICYmIHRvZ2dsZUNsYXNzKGRyYWdFbCwgb3B0aW9ucy5kcmFnQ2xhc3MsIHRydWUpOyAvLyBTZXQgcHJvcGVyIGRyb3AgZXZlbnRzXG5cbiAgICBpZiAoZmFsbGJhY2spIHtcbiAgICAgIGlnbm9yZU5leHRDbGljayA9IHRydWU7XG4gICAgICBfdGhpcy5fbG9vcElkID0gc2V0SW50ZXJ2YWwoX3RoaXMuX2VtdWxhdGVEcmFnT3ZlciwgNTApO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBVbmRvIHdoYXQgd2FzIHNldCBpbiBfcHJlcGFyZURyYWdTdGFydCBiZWZvcmUgZHJhZyBzdGFydGVkXG4gICAgICBvZmYoZG9jdW1lbnQsICdtb3VzZXVwJywgX3RoaXMuX29uRHJvcCk7XG4gICAgICBvZmYoZG9jdW1lbnQsICd0b3VjaGVuZCcsIF90aGlzLl9vbkRyb3ApO1xuICAgICAgb2ZmKGRvY3VtZW50LCAndG91Y2hjYW5jZWwnLCBfdGhpcy5fb25Ecm9wKTtcblxuICAgICAgaWYgKGRhdGFUcmFuc2Zlcikge1xuICAgICAgICBkYXRhVHJhbnNmZXIuZWZmZWN0QWxsb3dlZCA9ICdtb3ZlJztcbiAgICAgICAgb3B0aW9ucy5zZXREYXRhICYmIG9wdGlvbnMuc2V0RGF0YS5jYWxsKF90aGlzLCBkYXRhVHJhbnNmZXIsIGRyYWdFbCk7XG4gICAgICB9XG5cbiAgICAgIG9uKGRvY3VtZW50LCAnZHJvcCcsIF90aGlzKTsgLy8gIzEyNzYgZml4OlxuXG4gICAgICBjc3MoZHJhZ0VsLCAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZVooMCknKTtcbiAgICB9XG5cbiAgICBhd2FpdGluZ0RyYWdTdGFydGVkID0gdHJ1ZTtcbiAgICBfdGhpcy5fZHJhZ1N0YXJ0SWQgPSBfbmV4dFRpY2soX3RoaXMuX2RyYWdTdGFydGVkLmJpbmQoX3RoaXMsIGZhbGxiYWNrLCBldnQpKTtcbiAgICBvbihkb2N1bWVudCwgJ3NlbGVjdHN0YXJ0JywgX3RoaXMpO1xuICAgIG1vdmVkID0gdHJ1ZTtcblxuICAgIGlmIChTYWZhcmkpIHtcbiAgICAgIGNzcyhkb2N1bWVudC5ib2R5LCAndXNlci1zZWxlY3QnLCAnbm9uZScpO1xuICAgIH1cbiAgfSxcbiAgLy8gUmV0dXJucyB0cnVlIC0gaWYgbm8gZnVydGhlciBhY3Rpb24gaXMgbmVlZGVkIChlaXRoZXIgaW5zZXJ0ZWQgb3IgYW5vdGhlciBjb25kaXRpb24pXG4gIF9vbkRyYWdPdmVyOiBmdW5jdGlvbiBfb25EcmFnT3ZlcihcbiAgLyoqRXZlbnQqL1xuICBldnQpIHtcbiAgICB2YXIgZWwgPSB0aGlzLmVsLFxuICAgICAgICB0YXJnZXQgPSBldnQudGFyZ2V0LFxuICAgICAgICBkcmFnUmVjdCxcbiAgICAgICAgdGFyZ2V0UmVjdCxcbiAgICAgICAgcmV2ZXJ0LFxuICAgICAgICBvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuICAgICAgICBncm91cCA9IG9wdGlvbnMuZ3JvdXAsXG4gICAgICAgIGFjdGl2ZVNvcnRhYmxlID0gU29ydGFibGUuYWN0aXZlLFxuICAgICAgICBpc093bmVyID0gYWN0aXZlR3JvdXAgPT09IGdyb3VwLFxuICAgICAgICBjYW5Tb3J0ID0gb3B0aW9ucy5zb3J0LFxuICAgICAgICBmcm9tU29ydGFibGUgPSBwdXRTb3J0YWJsZSB8fCBhY3RpdmVTb3J0YWJsZSxcbiAgICAgICAgdmVydGljYWwsXG4gICAgICAgIF90aGlzID0gdGhpcyxcbiAgICAgICAgY29tcGxldGVkRmlyZWQgPSBmYWxzZTtcblxuICAgIGlmIChfc2lsZW50KSByZXR1cm47XG5cbiAgICBmdW5jdGlvbiBkcmFnT3ZlckV2ZW50KG5hbWUsIGV4dHJhKSB7XG4gICAgICBwbHVnaW5FdmVudChuYW1lLCBfdGhpcywgX29iamVjdFNwcmVhZDIoe1xuICAgICAgICBldnQ6IGV2dCxcbiAgICAgICAgaXNPd25lcjogaXNPd25lcixcbiAgICAgICAgYXhpczogdmVydGljYWwgPyAndmVydGljYWwnIDogJ2hvcml6b250YWwnLFxuICAgICAgICByZXZlcnQ6IHJldmVydCxcbiAgICAgICAgZHJhZ1JlY3Q6IGRyYWdSZWN0LFxuICAgICAgICB0YXJnZXRSZWN0OiB0YXJnZXRSZWN0LFxuICAgICAgICBjYW5Tb3J0OiBjYW5Tb3J0LFxuICAgICAgICBmcm9tU29ydGFibGU6IGZyb21Tb3J0YWJsZSxcbiAgICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICAgIGNvbXBsZXRlZDogY29tcGxldGVkLFxuICAgICAgICBvbk1vdmU6IGZ1bmN0aW9uIG9uTW92ZSh0YXJnZXQsIGFmdGVyKSB7XG4gICAgICAgICAgcmV0dXJuIF9vbk1vdmUocm9vdEVsLCBlbCwgZHJhZ0VsLCBkcmFnUmVjdCwgdGFyZ2V0LCBnZXRSZWN0KHRhcmdldCksIGV2dCwgYWZ0ZXIpO1xuICAgICAgICB9LFxuICAgICAgICBjaGFuZ2VkOiBjaGFuZ2VkXG4gICAgICB9LCBleHRyYSkpO1xuICAgIH0gLy8gQ2FwdHVyZSBhbmltYXRpb24gc3RhdGVcblxuXG4gICAgZnVuY3Rpb24gY2FwdHVyZSgpIHtcbiAgICAgIGRyYWdPdmVyRXZlbnQoJ2RyYWdPdmVyQW5pbWF0aW9uQ2FwdHVyZScpO1xuXG4gICAgICBfdGhpcy5jYXB0dXJlQW5pbWF0aW9uU3RhdGUoKTtcblxuICAgICAgaWYgKF90aGlzICE9PSBmcm9tU29ydGFibGUpIHtcbiAgICAgICAgZnJvbVNvcnRhYmxlLmNhcHR1cmVBbmltYXRpb25TdGF0ZSgpO1xuICAgICAgfVxuICAgIH0gLy8gUmV0dXJuIGludm9jYXRpb24gd2hlbiBkcmFnRWwgaXMgaW5zZXJ0ZWQgKG9yIGNvbXBsZXRlZClcblxuXG4gICAgZnVuY3Rpb24gY29tcGxldGVkKGluc2VydGlvbikge1xuICAgICAgZHJhZ092ZXJFdmVudCgnZHJhZ092ZXJDb21wbGV0ZWQnLCB7XG4gICAgICAgIGluc2VydGlvbjogaW5zZXJ0aW9uXG4gICAgICB9KTtcblxuICAgICAgaWYgKGluc2VydGlvbikge1xuICAgICAgICAvLyBDbG9uZXMgbXVzdCBiZSBoaWRkZW4gYmVmb3JlIGZvbGRpbmcgYW5pbWF0aW9uIHRvIGNhcHR1cmUgZHJhZ1JlY3RBYnNvbHV0ZSBwcm9wZXJseVxuICAgICAgICBpZiAoaXNPd25lcikge1xuICAgICAgICAgIGFjdGl2ZVNvcnRhYmxlLl9oaWRlQ2xvbmUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhY3RpdmVTb3J0YWJsZS5fc2hvd0Nsb25lKF90aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfdGhpcyAhPT0gZnJvbVNvcnRhYmxlKSB7XG4gICAgICAgICAgLy8gU2V0IGdob3N0IGNsYXNzIHRvIG5ldyBzb3J0YWJsZSdzIGdob3N0IGNsYXNzXG4gICAgICAgICAgdG9nZ2xlQ2xhc3MoZHJhZ0VsLCBwdXRTb3J0YWJsZSA/IHB1dFNvcnRhYmxlLm9wdGlvbnMuZ2hvc3RDbGFzcyA6IGFjdGl2ZVNvcnRhYmxlLm9wdGlvbnMuZ2hvc3RDbGFzcywgZmFsc2UpO1xuICAgICAgICAgIHRvZ2dsZUNsYXNzKGRyYWdFbCwgb3B0aW9ucy5naG9zdENsYXNzLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwdXRTb3J0YWJsZSAhPT0gX3RoaXMgJiYgX3RoaXMgIT09IFNvcnRhYmxlLmFjdGl2ZSkge1xuICAgICAgICAgIHB1dFNvcnRhYmxlID0gX3RoaXM7XG4gICAgICAgIH0gZWxzZSBpZiAoX3RoaXMgPT09IFNvcnRhYmxlLmFjdGl2ZSAmJiBwdXRTb3J0YWJsZSkge1xuICAgICAgICAgIHB1dFNvcnRhYmxlID0gbnVsbDtcbiAgICAgICAgfSAvLyBBbmltYXRpb25cblxuXG4gICAgICAgIGlmIChmcm9tU29ydGFibGUgPT09IF90aGlzKSB7XG4gICAgICAgICAgX3RoaXMuX2lnbm9yZVdoaWxlQW5pbWF0aW5nID0gdGFyZ2V0O1xuICAgICAgICB9XG5cbiAgICAgICAgX3RoaXMuYW5pbWF0ZUFsbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZHJhZ092ZXJFdmVudCgnZHJhZ092ZXJBbmltYXRpb25Db21wbGV0ZScpO1xuICAgICAgICAgIF90aGlzLl9pZ25vcmVXaGlsZUFuaW1hdGluZyA9IG51bGw7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChfdGhpcyAhPT0gZnJvbVNvcnRhYmxlKSB7XG4gICAgICAgICAgZnJvbVNvcnRhYmxlLmFuaW1hdGVBbGwoKTtcbiAgICAgICAgICBmcm9tU29ydGFibGUuX2lnbm9yZVdoaWxlQW5pbWF0aW5nID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfSAvLyBOdWxsIGxhc3RUYXJnZXQgaWYgaXQgaXMgbm90IGluc2lkZSBhIHByZXZpb3VzbHkgc3dhcHBlZCBlbGVtZW50XG5cblxuICAgICAgaWYgKHRhcmdldCA9PT0gZHJhZ0VsICYmICFkcmFnRWwuYW5pbWF0ZWQgfHwgdGFyZ2V0ID09PSBlbCAmJiAhdGFyZ2V0LmFuaW1hdGVkKSB7XG4gICAgICAgIGxhc3RUYXJnZXQgPSBudWxsO1xuICAgICAgfSAvLyBubyBidWJibGluZyBhbmQgbm90IGZhbGxiYWNrXG5cblxuICAgICAgaWYgKCFvcHRpb25zLmRyYWdvdmVyQnViYmxlICYmICFldnQucm9vdEVsICYmIHRhcmdldCAhPT0gZG9jdW1lbnQpIHtcbiAgICAgICAgZHJhZ0VsLnBhcmVudE5vZGVbZXhwYW5kb10uX2lzT3V0c2lkZVRoaXNFbChldnQudGFyZ2V0KTsgLy8gRG8gbm90IGRldGVjdCBmb3IgZW1wdHkgaW5zZXJ0IGlmIGFscmVhZHkgaW5zZXJ0ZWRcblxuXG4gICAgICAgICFpbnNlcnRpb24gJiYgbmVhcmVzdEVtcHR5SW5zZXJ0RGV0ZWN0RXZlbnQoZXZ0KTtcbiAgICAgIH1cblxuICAgICAgIW9wdGlvbnMuZHJhZ292ZXJCdWJibGUgJiYgZXZ0LnN0b3BQcm9wYWdhdGlvbiAmJiBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICByZXR1cm4gY29tcGxldGVkRmlyZWQgPSB0cnVlO1xuICAgIH0gLy8gQ2FsbCB3aGVuIGRyYWdFbCBoYXMgYmVlbiBpbnNlcnRlZFxuXG5cbiAgICBmdW5jdGlvbiBjaGFuZ2VkKCkge1xuICAgICAgbmV3SW5kZXggPSBpbmRleChkcmFnRWwpO1xuICAgICAgbmV3RHJhZ2dhYmxlSW5kZXggPSBpbmRleChkcmFnRWwsIG9wdGlvbnMuZHJhZ2dhYmxlKTtcblxuICAgICAgX2Rpc3BhdGNoRXZlbnQoe1xuICAgICAgICBzb3J0YWJsZTogX3RoaXMsXG4gICAgICAgIG5hbWU6ICdjaGFuZ2UnLFxuICAgICAgICB0b0VsOiBlbCxcbiAgICAgICAgbmV3SW5kZXg6IG5ld0luZGV4LFxuICAgICAgICBuZXdEcmFnZ2FibGVJbmRleDogbmV3RHJhZ2dhYmxlSW5kZXgsXG4gICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGV2dC5wcmV2ZW50RGVmYXVsdCAhPT0gdm9pZCAwKSB7XG4gICAgICBldnQuY2FuY2VsYWJsZSAmJiBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICB0YXJnZXQgPSBjbG9zZXN0KHRhcmdldCwgb3B0aW9ucy5kcmFnZ2FibGUsIGVsLCB0cnVlKTtcbiAgICBkcmFnT3ZlckV2ZW50KCdkcmFnT3ZlcicpO1xuICAgIGlmIChTb3J0YWJsZS5ldmVudENhbmNlbGVkKSByZXR1cm4gY29tcGxldGVkRmlyZWQ7XG5cbiAgICBpZiAoZHJhZ0VsLmNvbnRhaW5zKGV2dC50YXJnZXQpIHx8IHRhcmdldC5hbmltYXRlZCAmJiB0YXJnZXQuYW5pbWF0aW5nWCAmJiB0YXJnZXQuYW5pbWF0aW5nWSB8fCBfdGhpcy5faWdub3JlV2hpbGVBbmltYXRpbmcgPT09IHRhcmdldCkge1xuICAgICAgcmV0dXJuIGNvbXBsZXRlZChmYWxzZSk7XG4gICAgfVxuXG4gICAgaWdub3JlTmV4dENsaWNrID0gZmFsc2U7XG5cbiAgICBpZiAoYWN0aXZlU29ydGFibGUgJiYgIW9wdGlvbnMuZGlzYWJsZWQgJiYgKGlzT3duZXIgPyBjYW5Tb3J0IHx8IChyZXZlcnQgPSBwYXJlbnRFbCAhPT0gcm9vdEVsKSAvLyBSZXZlcnRpbmcgaXRlbSBpbnRvIHRoZSBvcmlnaW5hbCBsaXN0XG4gICAgOiBwdXRTb3J0YWJsZSA9PT0gdGhpcyB8fCAodGhpcy5sYXN0UHV0TW9kZSA9IGFjdGl2ZUdyb3VwLmNoZWNrUHVsbCh0aGlzLCBhY3RpdmVTb3J0YWJsZSwgZHJhZ0VsLCBldnQpKSAmJiBncm91cC5jaGVja1B1dCh0aGlzLCBhY3RpdmVTb3J0YWJsZSwgZHJhZ0VsLCBldnQpKSkge1xuICAgICAgdmVydGljYWwgPSB0aGlzLl9nZXREaXJlY3Rpb24oZXZ0LCB0YXJnZXQpID09PSAndmVydGljYWwnO1xuICAgICAgZHJhZ1JlY3QgPSBnZXRSZWN0KGRyYWdFbCk7XG4gICAgICBkcmFnT3ZlckV2ZW50KCdkcmFnT3ZlclZhbGlkJyk7XG4gICAgICBpZiAoU29ydGFibGUuZXZlbnRDYW5jZWxlZCkgcmV0dXJuIGNvbXBsZXRlZEZpcmVkO1xuXG4gICAgICBpZiAocmV2ZXJ0KSB7XG4gICAgICAgIHBhcmVudEVsID0gcm9vdEVsOyAvLyBhY3R1YWxpemF0aW9uXG5cbiAgICAgICAgY2FwdHVyZSgpO1xuXG4gICAgICAgIHRoaXMuX2hpZGVDbG9uZSgpO1xuXG4gICAgICAgIGRyYWdPdmVyRXZlbnQoJ3JldmVydCcpO1xuXG4gICAgICAgIGlmICghU29ydGFibGUuZXZlbnRDYW5jZWxlZCkge1xuICAgICAgICAgIGlmIChuZXh0RWwpIHtcbiAgICAgICAgICAgIHJvb3RFbC5pbnNlcnRCZWZvcmUoZHJhZ0VsLCBuZXh0RWwpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByb290RWwuYXBwZW5kQ2hpbGQoZHJhZ0VsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29tcGxldGVkKHRydWUpO1xuICAgICAgfVxuXG4gICAgICB2YXIgZWxMYXN0Q2hpbGQgPSBsYXN0Q2hpbGQoZWwsIG9wdGlvbnMuZHJhZ2dhYmxlKTtcblxuICAgICAgaWYgKCFlbExhc3RDaGlsZCB8fCBfZ2hvc3RJc0xhc3QoZXZ0LCB2ZXJ0aWNhbCwgdGhpcykgJiYgIWVsTGFzdENoaWxkLmFuaW1hdGVkKSB7XG4gICAgICAgIC8vIEluc2VydCB0byBlbmQgb2YgbGlzdFxuICAgICAgICAvLyBJZiBhbHJlYWR5IGF0IGVuZCBvZiBsaXN0OiBEbyBub3QgaW5zZXJ0XG4gICAgICAgIGlmIChlbExhc3RDaGlsZCA9PT0gZHJhZ0VsKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbXBsZXRlZChmYWxzZSk7XG4gICAgICAgIH0gLy8gaWYgdGhlcmUgaXMgYSBsYXN0IGVsZW1lbnQsIGl0IGlzIHRoZSB0YXJnZXRcblxuXG4gICAgICAgIGlmIChlbExhc3RDaGlsZCAmJiBlbCA9PT0gZXZ0LnRhcmdldCkge1xuICAgICAgICAgIHRhcmdldCA9IGVsTGFzdENoaWxkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRhcmdldCkge1xuICAgICAgICAgIHRhcmdldFJlY3QgPSBnZXRSZWN0KHRhcmdldCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX29uTW92ZShyb290RWwsIGVsLCBkcmFnRWwsIGRyYWdSZWN0LCB0YXJnZXQsIHRhcmdldFJlY3QsIGV2dCwgISF0YXJnZXQpICE9PSBmYWxzZSkge1xuICAgICAgICAgIGNhcHR1cmUoKTtcbiAgICAgICAgICBlbC5hcHBlbmRDaGlsZChkcmFnRWwpO1xuICAgICAgICAgIHBhcmVudEVsID0gZWw7IC8vIGFjdHVhbGl6YXRpb25cblxuICAgICAgICAgIGNoYW5nZWQoKTtcbiAgICAgICAgICByZXR1cm4gY29tcGxldGVkKHRydWUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGVsTGFzdENoaWxkICYmIF9naG9zdElzRmlyc3QoZXZ0LCB2ZXJ0aWNhbCwgdGhpcykpIHtcbiAgICAgICAgLy8gSW5zZXJ0IHRvIHN0YXJ0IG9mIGxpc3RcbiAgICAgICAgdmFyIGZpcnN0Q2hpbGQgPSBnZXRDaGlsZChlbCwgMCwgb3B0aW9ucywgdHJ1ZSk7XG5cbiAgICAgICAgaWYgKGZpcnN0Q2hpbGQgPT09IGRyYWdFbCkge1xuICAgICAgICAgIHJldHVybiBjb21wbGV0ZWQoZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGFyZ2V0ID0gZmlyc3RDaGlsZDtcbiAgICAgICAgdGFyZ2V0UmVjdCA9IGdldFJlY3QodGFyZ2V0KTtcblxuICAgICAgICBpZiAoX29uTW92ZShyb290RWwsIGVsLCBkcmFnRWwsIGRyYWdSZWN0LCB0YXJnZXQsIHRhcmdldFJlY3QsIGV2dCwgZmFsc2UpICE9PSBmYWxzZSkge1xuICAgICAgICAgIGNhcHR1cmUoKTtcbiAgICAgICAgICBlbC5pbnNlcnRCZWZvcmUoZHJhZ0VsLCBmaXJzdENoaWxkKTtcbiAgICAgICAgICBwYXJlbnRFbCA9IGVsOyAvLyBhY3R1YWxpemF0aW9uXG5cbiAgICAgICAgICBjaGFuZ2VkKCk7XG4gICAgICAgICAgcmV0dXJuIGNvbXBsZXRlZCh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0YXJnZXQucGFyZW50Tm9kZSA9PT0gZWwpIHtcbiAgICAgICAgdGFyZ2V0UmVjdCA9IGdldFJlY3QodGFyZ2V0KTtcbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IDAsXG4gICAgICAgICAgICB0YXJnZXRCZWZvcmVGaXJzdFN3YXAsXG4gICAgICAgICAgICBkaWZmZXJlbnRMZXZlbCA9IGRyYWdFbC5wYXJlbnROb2RlICE9PSBlbCxcbiAgICAgICAgICAgIGRpZmZlcmVudFJvd0NvbCA9ICFfZHJhZ0VsSW5Sb3dDb2x1bW4oZHJhZ0VsLmFuaW1hdGVkICYmIGRyYWdFbC50b1JlY3QgfHwgZHJhZ1JlY3QsIHRhcmdldC5hbmltYXRlZCAmJiB0YXJnZXQudG9SZWN0IHx8IHRhcmdldFJlY3QsIHZlcnRpY2FsKSxcbiAgICAgICAgICAgIHNpZGUxID0gdmVydGljYWwgPyAndG9wJyA6ICdsZWZ0JyxcbiAgICAgICAgICAgIHNjcm9sbGVkUGFzdFRvcCA9IGlzU2Nyb2xsZWRQYXN0KHRhcmdldCwgJ3RvcCcsICd0b3AnKSB8fCBpc1Njcm9sbGVkUGFzdChkcmFnRWwsICd0b3AnLCAndG9wJyksXG4gICAgICAgICAgICBzY3JvbGxCZWZvcmUgPSBzY3JvbGxlZFBhc3RUb3AgPyBzY3JvbGxlZFBhc3RUb3Auc2Nyb2xsVG9wIDogdm9pZCAwO1xuXG4gICAgICAgIGlmIChsYXN0VGFyZ2V0ICE9PSB0YXJnZXQpIHtcbiAgICAgICAgICB0YXJnZXRCZWZvcmVGaXJzdFN3YXAgPSB0YXJnZXRSZWN0W3NpZGUxXTtcbiAgICAgICAgICBwYXN0Rmlyc3RJbnZlcnRUaHJlc2ggPSBmYWxzZTtcbiAgICAgICAgICBpc0NpcmN1bXN0YW50aWFsSW52ZXJ0ID0gIWRpZmZlcmVudFJvd0NvbCAmJiBvcHRpb25zLmludmVydFN3YXAgfHwgZGlmZmVyZW50TGV2ZWw7XG4gICAgICAgIH1cblxuICAgICAgICBkaXJlY3Rpb24gPSBfZ2V0U3dhcERpcmVjdGlvbihldnQsIHRhcmdldCwgdGFyZ2V0UmVjdCwgdmVydGljYWwsIGRpZmZlcmVudFJvd0NvbCA/IDEgOiBvcHRpb25zLnN3YXBUaHJlc2hvbGQsIG9wdGlvbnMuaW52ZXJ0ZWRTd2FwVGhyZXNob2xkID09IG51bGwgPyBvcHRpb25zLnN3YXBUaHJlc2hvbGQgOiBvcHRpb25zLmludmVydGVkU3dhcFRocmVzaG9sZCwgaXNDaXJjdW1zdGFudGlhbEludmVydCwgbGFzdFRhcmdldCA9PT0gdGFyZ2V0KTtcbiAgICAgICAgdmFyIHNpYmxpbmc7XG5cbiAgICAgICAgaWYgKGRpcmVjdGlvbiAhPT0gMCkge1xuICAgICAgICAgIC8vIENoZWNrIGlmIHRhcmdldCBpcyBiZXNpZGUgZHJhZ0VsIGluIHJlc3BlY3RpdmUgZGlyZWN0aW9uIChpZ25vcmluZyBoaWRkZW4gZWxlbWVudHMpXG4gICAgICAgICAgdmFyIGRyYWdJbmRleCA9IGluZGV4KGRyYWdFbCk7XG5cbiAgICAgICAgICBkbyB7XG4gICAgICAgICAgICBkcmFnSW5kZXggLT0gZGlyZWN0aW9uO1xuICAgICAgICAgICAgc2libGluZyA9IHBhcmVudEVsLmNoaWxkcmVuW2RyYWdJbmRleF07XG4gICAgICAgICAgfSB3aGlsZSAoc2libGluZyAmJiAoY3NzKHNpYmxpbmcsICdkaXNwbGF5JykgPT09ICdub25lJyB8fCBzaWJsaW5nID09PSBnaG9zdEVsKSk7XG4gICAgICAgIH0gLy8gSWYgZHJhZ0VsIGlzIGFscmVhZHkgYmVzaWRlIHRhcmdldDogRG8gbm90IGluc2VydFxuXG5cbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gMCB8fCBzaWJsaW5nID09PSB0YXJnZXQpIHtcbiAgICAgICAgICByZXR1cm4gY29tcGxldGVkKGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxhc3RUYXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgIGxhc3REaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgICAgIHZhciBuZXh0U2libGluZyA9IHRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmcsXG4gICAgICAgICAgICBhZnRlciA9IGZhbHNlO1xuICAgICAgICBhZnRlciA9IGRpcmVjdGlvbiA9PT0gMTtcblxuICAgICAgICB2YXIgbW92ZVZlY3RvciA9IF9vbk1vdmUocm9vdEVsLCBlbCwgZHJhZ0VsLCBkcmFnUmVjdCwgdGFyZ2V0LCB0YXJnZXRSZWN0LCBldnQsIGFmdGVyKTtcblxuICAgICAgICBpZiAobW92ZVZlY3RvciAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBpZiAobW92ZVZlY3RvciA9PT0gMSB8fCBtb3ZlVmVjdG9yID09PSAtMSkge1xuICAgICAgICAgICAgYWZ0ZXIgPSBtb3ZlVmVjdG9yID09PSAxO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIF9zaWxlbnQgPSB0cnVlO1xuICAgICAgICAgIHNldFRpbWVvdXQoX3Vuc2lsZW50LCAzMCk7XG4gICAgICAgICAgY2FwdHVyZSgpO1xuXG4gICAgICAgICAgaWYgKGFmdGVyICYmICFuZXh0U2libGluZykge1xuICAgICAgICAgICAgZWwuYXBwZW5kQ2hpbGQoZHJhZ0VsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGFyZ2V0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGRyYWdFbCwgYWZ0ZXIgPyBuZXh0U2libGluZyA6IHRhcmdldCk7XG4gICAgICAgICAgfSAvLyBVbmRvIGNocm9tZSdzIHNjcm9sbCBhZGp1c3RtZW50IChoYXMgbm8gZWZmZWN0IG9uIG90aGVyIGJyb3dzZXJzKVxuXG5cbiAgICAgICAgICBpZiAoc2Nyb2xsZWRQYXN0VG9wKSB7XG4gICAgICAgICAgICBzY3JvbGxCeShzY3JvbGxlZFBhc3RUb3AsIDAsIHNjcm9sbEJlZm9yZSAtIHNjcm9sbGVkUGFzdFRvcC5zY3JvbGxUb3ApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHBhcmVudEVsID0gZHJhZ0VsLnBhcmVudE5vZGU7IC8vIGFjdHVhbGl6YXRpb25cbiAgICAgICAgICAvLyBtdXN0IGJlIGRvbmUgYmVmb3JlIGFuaW1hdGlvblxuXG4gICAgICAgICAgaWYgKHRhcmdldEJlZm9yZUZpcnN0U3dhcCAhPT0gdW5kZWZpbmVkICYmICFpc0NpcmN1bXN0YW50aWFsSW52ZXJ0KSB7XG4gICAgICAgICAgICB0YXJnZXRNb3ZlRGlzdGFuY2UgPSBNYXRoLmFicyh0YXJnZXRCZWZvcmVGaXJzdFN3YXAgLSBnZXRSZWN0KHRhcmdldClbc2lkZTFdKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjaGFuZ2VkKCk7XG4gICAgICAgICAgcmV0dXJuIGNvbXBsZXRlZCh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZWwuY29udGFpbnMoZHJhZ0VsKSkge1xuICAgICAgICByZXR1cm4gY29tcGxldGVkKGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIF9pZ25vcmVXaGlsZUFuaW1hdGluZzogbnVsbCxcbiAgX29mZk1vdmVFdmVudHM6IGZ1bmN0aW9uIF9vZmZNb3ZlRXZlbnRzKCkge1xuICAgIG9mZihkb2N1bWVudCwgJ21vdXNlbW92ZScsIHRoaXMuX29uVG91Y2hNb3ZlKTtcbiAgICBvZmYoZG9jdW1lbnQsICd0b3VjaG1vdmUnLCB0aGlzLl9vblRvdWNoTW92ZSk7XG4gICAgb2ZmKGRvY3VtZW50LCAncG9pbnRlcm1vdmUnLCB0aGlzLl9vblRvdWNoTW92ZSk7XG4gICAgb2ZmKGRvY3VtZW50LCAnZHJhZ292ZXInLCBuZWFyZXN0RW1wdHlJbnNlcnREZXRlY3RFdmVudCk7XG4gICAgb2ZmKGRvY3VtZW50LCAnbW91c2Vtb3ZlJywgbmVhcmVzdEVtcHR5SW5zZXJ0RGV0ZWN0RXZlbnQpO1xuICAgIG9mZihkb2N1bWVudCwgJ3RvdWNobW92ZScsIG5lYXJlc3RFbXB0eUluc2VydERldGVjdEV2ZW50KTtcbiAgfSxcbiAgX29mZlVwRXZlbnRzOiBmdW5jdGlvbiBfb2ZmVXBFdmVudHMoKSB7XG4gICAgdmFyIG93bmVyRG9jdW1lbnQgPSB0aGlzLmVsLm93bmVyRG9jdW1lbnQ7XG4gICAgb2ZmKG93bmVyRG9jdW1lbnQsICdtb3VzZXVwJywgdGhpcy5fb25Ecm9wKTtcbiAgICBvZmYob3duZXJEb2N1bWVudCwgJ3RvdWNoZW5kJywgdGhpcy5fb25Ecm9wKTtcbiAgICBvZmYob3duZXJEb2N1bWVudCwgJ3BvaW50ZXJ1cCcsIHRoaXMuX29uRHJvcCk7XG4gICAgb2ZmKG93bmVyRG9jdW1lbnQsICd0b3VjaGNhbmNlbCcsIHRoaXMuX29uRHJvcCk7XG4gICAgb2ZmKGRvY3VtZW50LCAnc2VsZWN0c3RhcnQnLCB0aGlzKTtcbiAgfSxcbiAgX29uRHJvcDogZnVuY3Rpb24gX29uRHJvcChcbiAgLyoqRXZlbnQqL1xuICBldnQpIHtcbiAgICB2YXIgZWwgPSB0aGlzLmVsLFxuICAgICAgICBvcHRpb25zID0gdGhpcy5vcHRpb25zOyAvLyBHZXQgdGhlIGluZGV4IG9mIHRoZSBkcmFnZ2VkIGVsZW1lbnQgd2l0aGluIGl0cyBwYXJlbnRcblxuICAgIG5ld0luZGV4ID0gaW5kZXgoZHJhZ0VsKTtcbiAgICBuZXdEcmFnZ2FibGVJbmRleCA9IGluZGV4KGRyYWdFbCwgb3B0aW9ucy5kcmFnZ2FibGUpO1xuICAgIHBsdWdpbkV2ZW50KCdkcm9wJywgdGhpcywge1xuICAgICAgZXZ0OiBldnRcbiAgICB9KTtcbiAgICBwYXJlbnRFbCA9IGRyYWdFbCAmJiBkcmFnRWwucGFyZW50Tm9kZTsgLy8gR2V0IGFnYWluIGFmdGVyIHBsdWdpbiBldmVudFxuXG4gICAgbmV3SW5kZXggPSBpbmRleChkcmFnRWwpO1xuICAgIG5ld0RyYWdnYWJsZUluZGV4ID0gaW5kZXgoZHJhZ0VsLCBvcHRpb25zLmRyYWdnYWJsZSk7XG5cbiAgICBpZiAoU29ydGFibGUuZXZlbnRDYW5jZWxlZCkge1xuICAgICAgdGhpcy5fbnVsbGluZygpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYXdhaXRpbmdEcmFnU3RhcnRlZCA9IGZhbHNlO1xuICAgIGlzQ2lyY3Vtc3RhbnRpYWxJbnZlcnQgPSBmYWxzZTtcbiAgICBwYXN0Rmlyc3RJbnZlcnRUaHJlc2ggPSBmYWxzZTtcbiAgICBjbGVhckludGVydmFsKHRoaXMuX2xvb3BJZCk7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuX2RyYWdTdGFydFRpbWVyKTtcblxuICAgIF9jYW5jZWxOZXh0VGljayh0aGlzLmNsb25lSWQpO1xuXG4gICAgX2NhbmNlbE5leHRUaWNrKHRoaXMuX2RyYWdTdGFydElkKTsgLy8gVW5iaW5kIGV2ZW50c1xuXG5cbiAgICBpZiAodGhpcy5uYXRpdmVEcmFnZ2FibGUpIHtcbiAgICAgIG9mZihkb2N1bWVudCwgJ2Ryb3AnLCB0aGlzKTtcbiAgICAgIG9mZihlbCwgJ2RyYWdzdGFydCcsIHRoaXMuX29uRHJhZ1N0YXJ0KTtcbiAgICB9XG5cbiAgICB0aGlzLl9vZmZNb3ZlRXZlbnRzKCk7XG5cbiAgICB0aGlzLl9vZmZVcEV2ZW50cygpO1xuXG4gICAgaWYgKFNhZmFyaSkge1xuICAgICAgY3NzKGRvY3VtZW50LmJvZHksICd1c2VyLXNlbGVjdCcsICcnKTtcbiAgICB9XG5cbiAgICBjc3MoZHJhZ0VsLCAndHJhbnNmb3JtJywgJycpO1xuXG4gICAgaWYgKGV2dCkge1xuICAgICAgaWYgKG1vdmVkKSB7XG4gICAgICAgIGV2dC5jYW5jZWxhYmxlICYmIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAhb3B0aW9ucy5kcm9wQnViYmxlICYmIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cblxuICAgICAgZ2hvc3RFbCAmJiBnaG9zdEVsLnBhcmVudE5vZGUgJiYgZ2hvc3RFbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGdob3N0RWwpO1xuXG4gICAgICBpZiAocm9vdEVsID09PSBwYXJlbnRFbCB8fCBwdXRTb3J0YWJsZSAmJiBwdXRTb3J0YWJsZS5sYXN0UHV0TW9kZSAhPT0gJ2Nsb25lJykge1xuICAgICAgICAvLyBSZW1vdmUgY2xvbmUocylcbiAgICAgICAgY2xvbmVFbCAmJiBjbG9uZUVsLnBhcmVudE5vZGUgJiYgY2xvbmVFbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGNsb25lRWwpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZHJhZ0VsKSB7XG4gICAgICAgIGlmICh0aGlzLm5hdGl2ZURyYWdnYWJsZSkge1xuICAgICAgICAgIG9mZihkcmFnRWwsICdkcmFnZW5kJywgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICBfZGlzYWJsZURyYWdnYWJsZShkcmFnRWwpO1xuXG4gICAgICAgIGRyYWdFbC5zdHlsZVsnd2lsbC1jaGFuZ2UnXSA9ICcnOyAvLyBSZW1vdmUgY2xhc3Nlc1xuICAgICAgICAvLyBnaG9zdENsYXNzIGlzIGFkZGVkIGluIGRyYWdTdGFydGVkXG5cbiAgICAgICAgaWYgKG1vdmVkICYmICFhd2FpdGluZ0RyYWdTdGFydGVkKSB7XG4gICAgICAgICAgdG9nZ2xlQ2xhc3MoZHJhZ0VsLCBwdXRTb3J0YWJsZSA/IHB1dFNvcnRhYmxlLm9wdGlvbnMuZ2hvc3RDbGFzcyA6IHRoaXMub3B0aW9ucy5naG9zdENsYXNzLCBmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0b2dnbGVDbGFzcyhkcmFnRWwsIHRoaXMub3B0aW9ucy5jaG9zZW5DbGFzcywgZmFsc2UpOyAvLyBEcmFnIHN0b3AgZXZlbnRcblxuICAgICAgICBfZGlzcGF0Y2hFdmVudCh7XG4gICAgICAgICAgc29ydGFibGU6IHRoaXMsXG4gICAgICAgICAgbmFtZTogJ3VuY2hvb3NlJyxcbiAgICAgICAgICB0b0VsOiBwYXJlbnRFbCxcbiAgICAgICAgICBuZXdJbmRleDogbnVsbCxcbiAgICAgICAgICBuZXdEcmFnZ2FibGVJbmRleDogbnVsbCxcbiAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldnRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHJvb3RFbCAhPT0gcGFyZW50RWwpIHtcbiAgICAgICAgICBpZiAobmV3SW5kZXggPj0gMCkge1xuICAgICAgICAgICAgLy8gQWRkIGV2ZW50XG4gICAgICAgICAgICBfZGlzcGF0Y2hFdmVudCh7XG4gICAgICAgICAgICAgIHJvb3RFbDogcGFyZW50RWwsXG4gICAgICAgICAgICAgIG5hbWU6ICdhZGQnLFxuICAgICAgICAgICAgICB0b0VsOiBwYXJlbnRFbCxcbiAgICAgICAgICAgICAgZnJvbUVsOiByb290RWwsXG4gICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dFxuICAgICAgICAgICAgfSk7IC8vIFJlbW92ZSBldmVudFxuXG5cbiAgICAgICAgICAgIF9kaXNwYXRjaEV2ZW50KHtcbiAgICAgICAgICAgICAgc29ydGFibGU6IHRoaXMsXG4gICAgICAgICAgICAgIG5hbWU6ICdyZW1vdmUnLFxuICAgICAgICAgICAgICB0b0VsOiBwYXJlbnRFbCxcbiAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZ0XG4gICAgICAgICAgICB9KTsgLy8gZHJhZyBmcm9tIG9uZSBsaXN0IGFuZCBkcm9wIGludG8gYW5vdGhlclxuXG5cbiAgICAgICAgICAgIF9kaXNwYXRjaEV2ZW50KHtcbiAgICAgICAgICAgICAgcm9vdEVsOiBwYXJlbnRFbCxcbiAgICAgICAgICAgICAgbmFtZTogJ3NvcnQnLFxuICAgICAgICAgICAgICB0b0VsOiBwYXJlbnRFbCxcbiAgICAgICAgICAgICAgZnJvbUVsOiByb290RWwsXG4gICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIF9kaXNwYXRjaEV2ZW50KHtcbiAgICAgICAgICAgICAgc29ydGFibGU6IHRoaXMsXG4gICAgICAgICAgICAgIG5hbWU6ICdzb3J0JyxcbiAgICAgICAgICAgICAgdG9FbDogcGFyZW50RWwsXG4gICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcHV0U29ydGFibGUgJiYgcHV0U29ydGFibGUuc2F2ZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChuZXdJbmRleCAhPT0gb2xkSW5kZXgpIHtcbiAgICAgICAgICAgIGlmIChuZXdJbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgIC8vIGRyYWcgJiBkcm9wIHdpdGhpbiB0aGUgc2FtZSBsaXN0XG4gICAgICAgICAgICAgIF9kaXNwYXRjaEV2ZW50KHtcbiAgICAgICAgICAgICAgICBzb3J0YWJsZTogdGhpcyxcbiAgICAgICAgICAgICAgICBuYW1lOiAndXBkYXRlJyxcbiAgICAgICAgICAgICAgICB0b0VsOiBwYXJlbnRFbCxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldnRcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgX2Rpc3BhdGNoRXZlbnQoe1xuICAgICAgICAgICAgICAgIHNvcnRhYmxlOiB0aGlzLFxuICAgICAgICAgICAgICAgIG5hbWU6ICdzb3J0JyxcbiAgICAgICAgICAgICAgICB0b0VsOiBwYXJlbnRFbCxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldnRcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFNvcnRhYmxlLmFjdGl2ZSkge1xuICAgICAgICAgIC8qIGpzaGludCBlcW51bGw6dHJ1ZSAqL1xuICAgICAgICAgIGlmIChuZXdJbmRleCA9PSBudWxsIHx8IG5ld0luZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgbmV3SW5kZXggPSBvbGRJbmRleDtcbiAgICAgICAgICAgIG5ld0RyYWdnYWJsZUluZGV4ID0gb2xkRHJhZ2dhYmxlSW5kZXg7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgX2Rpc3BhdGNoRXZlbnQoe1xuICAgICAgICAgICAgc29ydGFibGU6IHRoaXMsXG4gICAgICAgICAgICBuYW1lOiAnZW5kJyxcbiAgICAgICAgICAgIHRvRWw6IHBhcmVudEVsLFxuICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZ0XG4gICAgICAgICAgfSk7IC8vIFNhdmUgc29ydGluZ1xuXG5cbiAgICAgICAgICB0aGlzLnNhdmUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX251bGxpbmcoKTtcbiAgfSxcbiAgX251bGxpbmc6IGZ1bmN0aW9uIF9udWxsaW5nKCkge1xuICAgIHBsdWdpbkV2ZW50KCdudWxsaW5nJywgdGhpcyk7XG4gICAgcm9vdEVsID0gZHJhZ0VsID0gcGFyZW50RWwgPSBnaG9zdEVsID0gbmV4dEVsID0gY2xvbmVFbCA9IGxhc3REb3duRWwgPSBjbG9uZUhpZGRlbiA9IHRhcEV2dCA9IHRvdWNoRXZ0ID0gbW92ZWQgPSBuZXdJbmRleCA9IG5ld0RyYWdnYWJsZUluZGV4ID0gb2xkSW5kZXggPSBvbGREcmFnZ2FibGVJbmRleCA9IGxhc3RUYXJnZXQgPSBsYXN0RGlyZWN0aW9uID0gcHV0U29ydGFibGUgPSBhY3RpdmVHcm91cCA9IFNvcnRhYmxlLmRyYWdnZWQgPSBTb3J0YWJsZS5naG9zdCA9IFNvcnRhYmxlLmNsb25lID0gU29ydGFibGUuYWN0aXZlID0gbnVsbDtcbiAgICBzYXZlZElucHV0Q2hlY2tlZC5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgZWwuY2hlY2tlZCA9IHRydWU7XG4gICAgfSk7XG4gICAgc2F2ZWRJbnB1dENoZWNrZWQubGVuZ3RoID0gbGFzdER4ID0gbGFzdER5ID0gMDtcbiAgfSxcbiAgaGFuZGxlRXZlbnQ6IGZ1bmN0aW9uIGhhbmRsZUV2ZW50KFxuICAvKipFdmVudCovXG4gIGV2dCkge1xuICAgIHN3aXRjaCAoZXZ0LnR5cGUpIHtcbiAgICAgIGNhc2UgJ2Ryb3AnOlxuICAgICAgY2FzZSAnZHJhZ2VuZCc6XG4gICAgICAgIHRoaXMuX29uRHJvcChldnQpO1xuXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdkcmFnZW50ZXInOlxuICAgICAgY2FzZSAnZHJhZ292ZXInOlxuICAgICAgICBpZiAoZHJhZ0VsKSB7XG4gICAgICAgICAgdGhpcy5fb25EcmFnT3ZlcihldnQpO1xuXG4gICAgICAgICAgX2dsb2JhbERyYWdPdmVyKGV2dCk7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnc2VsZWN0c3RhcnQnOlxuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBTZXJpYWxpemVzIHRoZSBpdGVtIGludG8gYW4gYXJyYXkgb2Ygc3RyaW5nLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nW119XG4gICAqL1xuICB0b0FycmF5OiBmdW5jdGlvbiB0b0FycmF5KCkge1xuICAgIHZhciBvcmRlciA9IFtdLFxuICAgICAgICBlbCxcbiAgICAgICAgY2hpbGRyZW4gPSB0aGlzLmVsLmNoaWxkcmVuLFxuICAgICAgICBpID0gMCxcbiAgICAgICAgbiA9IGNoaWxkcmVuLmxlbmd0aCxcbiAgICAgICAgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuICAgIGZvciAoOyBpIDwgbjsgaSsrKSB7XG4gICAgICBlbCA9IGNoaWxkcmVuW2ldO1xuXG4gICAgICBpZiAoY2xvc2VzdChlbCwgb3B0aW9ucy5kcmFnZ2FibGUsIHRoaXMuZWwsIGZhbHNlKSkge1xuICAgICAgICBvcmRlci5wdXNoKGVsLmdldEF0dHJpYnV0ZShvcHRpb25zLmRhdGFJZEF0dHIpIHx8IF9nZW5lcmF0ZUlkKGVsKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG9yZGVyO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTb3J0cyB0aGUgZWxlbWVudHMgYWNjb3JkaW5nIHRvIHRoZSBhcnJheS5cbiAgICogQHBhcmFtICB7U3RyaW5nW119ICBvcmRlciAgb3JkZXIgb2YgdGhlIGl0ZW1zXG4gICAqL1xuICBzb3J0OiBmdW5jdGlvbiBzb3J0KG9yZGVyLCB1c2VBbmltYXRpb24pIHtcbiAgICB2YXIgaXRlbXMgPSB7fSxcbiAgICAgICAgcm9vdEVsID0gdGhpcy5lbDtcbiAgICB0aGlzLnRvQXJyYXkoKS5mb3JFYWNoKGZ1bmN0aW9uIChpZCwgaSkge1xuICAgICAgdmFyIGVsID0gcm9vdEVsLmNoaWxkcmVuW2ldO1xuXG4gICAgICBpZiAoY2xvc2VzdChlbCwgdGhpcy5vcHRpb25zLmRyYWdnYWJsZSwgcm9vdEVsLCBmYWxzZSkpIHtcbiAgICAgICAgaXRlbXNbaWRdID0gZWw7XG4gICAgICB9XG4gICAgfSwgdGhpcyk7XG4gICAgdXNlQW5pbWF0aW9uICYmIHRoaXMuY2FwdHVyZUFuaW1hdGlvblN0YXRlKCk7XG4gICAgb3JkZXIuZm9yRWFjaChmdW5jdGlvbiAoaWQpIHtcbiAgICAgIGlmIChpdGVtc1tpZF0pIHtcbiAgICAgICAgcm9vdEVsLnJlbW92ZUNoaWxkKGl0ZW1zW2lkXSk7XG4gICAgICAgIHJvb3RFbC5hcHBlbmRDaGlsZChpdGVtc1tpZF0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHVzZUFuaW1hdGlvbiAmJiB0aGlzLmFuaW1hdGVBbGwoKTtcbiAgfSxcblxuICAvKipcbiAgICogU2F2ZSB0aGUgY3VycmVudCBzb3J0aW5nXG4gICAqL1xuICBzYXZlOiBmdW5jdGlvbiBzYXZlKCkge1xuICAgIHZhciBzdG9yZSA9IHRoaXMub3B0aW9ucy5zdG9yZTtcbiAgICBzdG9yZSAmJiBzdG9yZS5zZXQgJiYgc3RvcmUuc2V0KHRoaXMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBGb3IgZWFjaCBlbGVtZW50IGluIHRoZSBzZXQsIGdldCB0aGUgZmlyc3QgZWxlbWVudCB0aGF0IG1hdGNoZXMgdGhlIHNlbGVjdG9yIGJ5IHRlc3RpbmcgdGhlIGVsZW1lbnQgaXRzZWxmIGFuZCB0cmF2ZXJzaW5nIHVwIHRocm91Z2ggaXRzIGFuY2VzdG9ycyBpbiB0aGUgRE9NIHRyZWUuXG4gICAqIEBwYXJhbSAgIHtIVE1MRWxlbWVudH0gIGVsXG4gICAqIEBwYXJhbSAgIHtTdHJpbmd9ICAgICAgIFtzZWxlY3Rvcl0gIGRlZmF1bHQ6IGBvcHRpb25zLmRyYWdnYWJsZWBcbiAgICogQHJldHVybnMge0hUTUxFbGVtZW50fG51bGx9XG4gICAqL1xuICBjbG9zZXN0OiBmdW5jdGlvbiBjbG9zZXN0JDEoZWwsIHNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIGNsb3Nlc3QoZWwsIHNlbGVjdG9yIHx8IHRoaXMub3B0aW9ucy5kcmFnZ2FibGUsIHRoaXMuZWwsIGZhbHNlKTtcbiAgfSxcblxuICAvKipcbiAgICogU2V0L2dldCBvcHRpb25cbiAgICogQHBhcmFtICAge3N0cmluZ30gbmFtZVxuICAgKiBAcGFyYW0gICB7Kn0gICAgICBbdmFsdWVdXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgb3B0aW9uOiBmdW5jdGlvbiBvcHRpb24obmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuICAgIGlmICh2YWx1ZSA9PT0gdm9pZCAwKSB7XG4gICAgICByZXR1cm4gb3B0aW9uc1tuYW1lXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIG1vZGlmaWVkVmFsdWUgPSBQbHVnaW5NYW5hZ2VyLm1vZGlmeU9wdGlvbih0aGlzLCBuYW1lLCB2YWx1ZSk7XG5cbiAgICAgIGlmICh0eXBlb2YgbW9kaWZpZWRWYWx1ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgb3B0aW9uc1tuYW1lXSA9IG1vZGlmaWVkVmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcHRpb25zW25hbWVdID0gdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChuYW1lID09PSAnZ3JvdXAnKSB7XG4gICAgICAgIF9wcmVwYXJlR3JvdXAob3B0aW9ucyk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBEZXN0cm95XG4gICAqL1xuICBkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIHBsdWdpbkV2ZW50KCdkZXN0cm95JywgdGhpcyk7XG4gICAgdmFyIGVsID0gdGhpcy5lbDtcbiAgICBlbFtleHBhbmRvXSA9IG51bGw7XG4gICAgb2ZmKGVsLCAnbW91c2Vkb3duJywgdGhpcy5fb25UYXBTdGFydCk7XG4gICAgb2ZmKGVsLCAndG91Y2hzdGFydCcsIHRoaXMuX29uVGFwU3RhcnQpO1xuICAgIG9mZihlbCwgJ3BvaW50ZXJkb3duJywgdGhpcy5fb25UYXBTdGFydCk7XG5cbiAgICBpZiAodGhpcy5uYXRpdmVEcmFnZ2FibGUpIHtcbiAgICAgIG9mZihlbCwgJ2RyYWdvdmVyJywgdGhpcyk7XG4gICAgICBvZmYoZWwsICdkcmFnZW50ZXInLCB0aGlzKTtcbiAgICB9IC8vIFJlbW92ZSBkcmFnZ2FibGUgYXR0cmlidXRlc1xuXG5cbiAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKGVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkcmFnZ2FibGVdJyksIGZ1bmN0aW9uIChlbCkge1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKCdkcmFnZ2FibGUnKTtcbiAgICB9KTtcblxuICAgIHRoaXMuX29uRHJvcCgpO1xuXG4gICAgdGhpcy5fZGlzYWJsZURlbGF5ZWREcmFnRXZlbnRzKCk7XG5cbiAgICBzb3J0YWJsZXMuc3BsaWNlKHNvcnRhYmxlcy5pbmRleE9mKHRoaXMuZWwpLCAxKTtcbiAgICB0aGlzLmVsID0gZWwgPSBudWxsO1xuICB9LFxuICBfaGlkZUNsb25lOiBmdW5jdGlvbiBfaGlkZUNsb25lKCkge1xuICAgIGlmICghY2xvbmVIaWRkZW4pIHtcbiAgICAgIHBsdWdpbkV2ZW50KCdoaWRlQ2xvbmUnLCB0aGlzKTtcbiAgICAgIGlmIChTb3J0YWJsZS5ldmVudENhbmNlbGVkKSByZXR1cm47XG4gICAgICBjc3MoY2xvbmVFbCwgJ2Rpc3BsYXknLCAnbm9uZScpO1xuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnJlbW92ZUNsb25lT25IaWRlICYmIGNsb25lRWwucGFyZW50Tm9kZSkge1xuICAgICAgICBjbG9uZUVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoY2xvbmVFbCk7XG4gICAgICB9XG5cbiAgICAgIGNsb25lSGlkZGVuID0gdHJ1ZTtcbiAgICB9XG4gIH0sXG4gIF9zaG93Q2xvbmU6IGZ1bmN0aW9uIF9zaG93Q2xvbmUocHV0U29ydGFibGUpIHtcbiAgICBpZiAocHV0U29ydGFibGUubGFzdFB1dE1vZGUgIT09ICdjbG9uZScpIHtcbiAgICAgIHRoaXMuX2hpZGVDbG9uZSgpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGNsb25lSGlkZGVuKSB7XG4gICAgICBwbHVnaW5FdmVudCgnc2hvd0Nsb25lJywgdGhpcyk7XG4gICAgICBpZiAoU29ydGFibGUuZXZlbnRDYW5jZWxlZCkgcmV0dXJuOyAvLyBzaG93IGNsb25lIGF0IGRyYWdFbCBvciBvcmlnaW5hbCBwb3NpdGlvblxuXG4gICAgICBpZiAoZHJhZ0VsLnBhcmVudE5vZGUgPT0gcm9vdEVsICYmICF0aGlzLm9wdGlvbnMuZ3JvdXAucmV2ZXJ0Q2xvbmUpIHtcbiAgICAgICAgcm9vdEVsLmluc2VydEJlZm9yZShjbG9uZUVsLCBkcmFnRWwpO1xuICAgICAgfSBlbHNlIGlmIChuZXh0RWwpIHtcbiAgICAgICAgcm9vdEVsLmluc2VydEJlZm9yZShjbG9uZUVsLCBuZXh0RWwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdEVsLmFwcGVuZENoaWxkKGNsb25lRWwpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmdyb3VwLnJldmVydENsb25lKSB7XG4gICAgICAgIHRoaXMuYW5pbWF0ZShkcmFnRWwsIGNsb25lRWwpO1xuICAgICAgfVxuXG4gICAgICBjc3MoY2xvbmVFbCwgJ2Rpc3BsYXknLCAnJyk7XG4gICAgICBjbG9uZUhpZGRlbiA9IGZhbHNlO1xuICAgIH1cbiAgfVxufTtcblxuZnVuY3Rpb24gX2dsb2JhbERyYWdPdmVyKFxuLyoqRXZlbnQqL1xuZXZ0KSB7XG4gIGlmIChldnQuZGF0YVRyYW5zZmVyKSB7XG4gICAgZXZ0LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gJ21vdmUnO1xuICB9XG5cbiAgZXZ0LmNhbmNlbGFibGUgJiYgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG59XG5cbmZ1bmN0aW9uIF9vbk1vdmUoZnJvbUVsLCB0b0VsLCBkcmFnRWwsIGRyYWdSZWN0LCB0YXJnZXRFbCwgdGFyZ2V0UmVjdCwgb3JpZ2luYWxFdmVudCwgd2lsbEluc2VydEFmdGVyKSB7XG4gIHZhciBldnQsXG4gICAgICBzb3J0YWJsZSA9IGZyb21FbFtleHBhbmRvXSxcbiAgICAgIG9uTW92ZUZuID0gc29ydGFibGUub3B0aW9ucy5vbk1vdmUsXG4gICAgICByZXRWYWw7IC8vIFN1cHBvcnQgZm9yIG5ldyBDdXN0b21FdmVudCBmZWF0dXJlXG5cbiAgaWYgKHdpbmRvdy5DdXN0b21FdmVudCAmJiAhSUUxMU9yTGVzcyAmJiAhRWRnZSkge1xuICAgIGV2dCA9IG5ldyBDdXN0b21FdmVudCgnbW92ZScsIHtcbiAgICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgICBjYW5jZWxhYmxlOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgZXZ0LmluaXRFdmVudCgnbW92ZScsIHRydWUsIHRydWUpO1xuICB9XG5cbiAgZXZ0LnRvID0gdG9FbDtcbiAgZXZ0LmZyb20gPSBmcm9tRWw7XG4gIGV2dC5kcmFnZ2VkID0gZHJhZ0VsO1xuICBldnQuZHJhZ2dlZFJlY3QgPSBkcmFnUmVjdDtcbiAgZXZ0LnJlbGF0ZWQgPSB0YXJnZXRFbCB8fCB0b0VsO1xuICBldnQucmVsYXRlZFJlY3QgPSB0YXJnZXRSZWN0IHx8IGdldFJlY3QodG9FbCk7XG4gIGV2dC53aWxsSW5zZXJ0QWZ0ZXIgPSB3aWxsSW5zZXJ0QWZ0ZXI7XG4gIGV2dC5vcmlnaW5hbEV2ZW50ID0gb3JpZ2luYWxFdmVudDtcbiAgZnJvbUVsLmRpc3BhdGNoRXZlbnQoZXZ0KTtcblxuICBpZiAob25Nb3ZlRm4pIHtcbiAgICByZXRWYWwgPSBvbk1vdmVGbi5jYWxsKHNvcnRhYmxlLCBldnQsIG9yaWdpbmFsRXZlbnQpO1xuICB9XG5cbiAgcmV0dXJuIHJldFZhbDtcbn1cblxuZnVuY3Rpb24gX2Rpc2FibGVEcmFnZ2FibGUoZWwpIHtcbiAgZWwuZHJhZ2dhYmxlID0gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIF91bnNpbGVudCgpIHtcbiAgX3NpbGVudCA9IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBfZ2hvc3RJc0ZpcnN0KGV2dCwgdmVydGljYWwsIHNvcnRhYmxlKSB7XG4gIHZhciByZWN0ID0gZ2V0UmVjdChnZXRDaGlsZChzb3J0YWJsZS5lbCwgMCwgc29ydGFibGUub3B0aW9ucywgdHJ1ZSkpO1xuICB2YXIgc3BhY2VyID0gMTA7XG4gIHJldHVybiB2ZXJ0aWNhbCA/IGV2dC5jbGllbnRYIDwgcmVjdC5sZWZ0IC0gc3BhY2VyIHx8IGV2dC5jbGllbnRZIDwgcmVjdC50b3AgJiYgZXZ0LmNsaWVudFggPCByZWN0LnJpZ2h0IDogZXZ0LmNsaWVudFkgPCByZWN0LnRvcCAtIHNwYWNlciB8fCBldnQuY2xpZW50WSA8IHJlY3QuYm90dG9tICYmIGV2dC5jbGllbnRYIDwgcmVjdC5sZWZ0O1xufVxuXG5mdW5jdGlvbiBfZ2hvc3RJc0xhc3QoZXZ0LCB2ZXJ0aWNhbCwgc29ydGFibGUpIHtcbiAgdmFyIHJlY3QgPSBnZXRSZWN0KGxhc3RDaGlsZChzb3J0YWJsZS5lbCwgc29ydGFibGUub3B0aW9ucy5kcmFnZ2FibGUpKTtcbiAgdmFyIHNwYWNlciA9IDEwO1xuICByZXR1cm4gdmVydGljYWwgPyBldnQuY2xpZW50WCA+IHJlY3QucmlnaHQgKyBzcGFjZXIgfHwgZXZ0LmNsaWVudFggPD0gcmVjdC5yaWdodCAmJiBldnQuY2xpZW50WSA+IHJlY3QuYm90dG9tICYmIGV2dC5jbGllbnRYID49IHJlY3QubGVmdCA6IGV2dC5jbGllbnRYID4gcmVjdC5yaWdodCAmJiBldnQuY2xpZW50WSA+IHJlY3QudG9wIHx8IGV2dC5jbGllbnRYIDw9IHJlY3QucmlnaHQgJiYgZXZ0LmNsaWVudFkgPiByZWN0LmJvdHRvbSArIHNwYWNlcjtcbn1cblxuZnVuY3Rpb24gX2dldFN3YXBEaXJlY3Rpb24oZXZ0LCB0YXJnZXQsIHRhcmdldFJlY3QsIHZlcnRpY2FsLCBzd2FwVGhyZXNob2xkLCBpbnZlcnRlZFN3YXBUaHJlc2hvbGQsIGludmVydFN3YXAsIGlzTGFzdFRhcmdldCkge1xuICB2YXIgbW91c2VPbkF4aXMgPSB2ZXJ0aWNhbCA/IGV2dC5jbGllbnRZIDogZXZ0LmNsaWVudFgsXG4gICAgICB0YXJnZXRMZW5ndGggPSB2ZXJ0aWNhbCA/IHRhcmdldFJlY3QuaGVpZ2h0IDogdGFyZ2V0UmVjdC53aWR0aCxcbiAgICAgIHRhcmdldFMxID0gdmVydGljYWwgPyB0YXJnZXRSZWN0LnRvcCA6IHRhcmdldFJlY3QubGVmdCxcbiAgICAgIHRhcmdldFMyID0gdmVydGljYWwgPyB0YXJnZXRSZWN0LmJvdHRvbSA6IHRhcmdldFJlY3QucmlnaHQsXG4gICAgICBpbnZlcnQgPSBmYWxzZTtcblxuICBpZiAoIWludmVydFN3YXApIHtcbiAgICAvLyBOZXZlciBpbnZlcnQgb3IgY3JlYXRlIGRyYWdFbCBzaGFkb3cgd2hlbiB0YXJnZXQgbW92ZW1lbmV0IGNhdXNlcyBtb3VzZSB0byBtb3ZlIHBhc3QgdGhlIGVuZCBvZiByZWd1bGFyIHN3YXBUaHJlc2hvbGRcbiAgICBpZiAoaXNMYXN0VGFyZ2V0ICYmIHRhcmdldE1vdmVEaXN0YW5jZSA8IHRhcmdldExlbmd0aCAqIHN3YXBUaHJlc2hvbGQpIHtcbiAgICAgIC8vIG11bHRpcGxpZWQgb25seSBieSBzd2FwVGhyZXNob2xkIGJlY2F1c2UgbW91c2Ugd2lsbCBhbHJlYWR5IGJlIGluc2lkZSB0YXJnZXQgYnkgKDEgLSB0aHJlc2hvbGQpICogdGFyZ2V0TGVuZ3RoIC8gMlxuICAgICAgLy8gY2hlY2sgaWYgcGFzdCBmaXJzdCBpbnZlcnQgdGhyZXNob2xkIG9uIHNpZGUgb3Bwb3NpdGUgb2YgbGFzdERpcmVjdGlvblxuICAgICAgaWYgKCFwYXN0Rmlyc3RJbnZlcnRUaHJlc2ggJiYgKGxhc3REaXJlY3Rpb24gPT09IDEgPyBtb3VzZU9uQXhpcyA+IHRhcmdldFMxICsgdGFyZ2V0TGVuZ3RoICogaW52ZXJ0ZWRTd2FwVGhyZXNob2xkIC8gMiA6IG1vdXNlT25BeGlzIDwgdGFyZ2V0UzIgLSB0YXJnZXRMZW5ndGggKiBpbnZlcnRlZFN3YXBUaHJlc2hvbGQgLyAyKSkge1xuICAgICAgICAvLyBwYXN0IGZpcnN0IGludmVydCB0aHJlc2hvbGQsIGRvIG5vdCByZXN0cmljdCBpbnZlcnRlZCB0aHJlc2hvbGQgdG8gZHJhZ0VsIHNoYWRvd1xuICAgICAgICBwYXN0Rmlyc3RJbnZlcnRUaHJlc2ggPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXBhc3RGaXJzdEludmVydFRocmVzaCkge1xuICAgICAgICAvLyBkcmFnRWwgc2hhZG93ICh0YXJnZXQgbW92ZSBkaXN0YW5jZSBzaGFkb3cpXG4gICAgICAgIGlmIChsYXN0RGlyZWN0aW9uID09PSAxID8gbW91c2VPbkF4aXMgPCB0YXJnZXRTMSArIHRhcmdldE1vdmVEaXN0YW5jZSAvLyBvdmVyIGRyYWdFbCBzaGFkb3dcbiAgICAgICAgOiBtb3VzZU9uQXhpcyA+IHRhcmdldFMyIC0gdGFyZ2V0TW92ZURpc3RhbmNlKSB7XG4gICAgICAgICAgcmV0dXJuIC1sYXN0RGlyZWN0aW9uO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnZlcnQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZWd1bGFyXG4gICAgICBpZiAobW91c2VPbkF4aXMgPiB0YXJnZXRTMSArIHRhcmdldExlbmd0aCAqICgxIC0gc3dhcFRocmVzaG9sZCkgLyAyICYmIG1vdXNlT25BeGlzIDwgdGFyZ2V0UzIgLSB0YXJnZXRMZW5ndGggKiAoMSAtIHN3YXBUaHJlc2hvbGQpIC8gMikge1xuICAgICAgICByZXR1cm4gX2dldEluc2VydERpcmVjdGlvbih0YXJnZXQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGludmVydCA9IGludmVydCB8fCBpbnZlcnRTd2FwO1xuXG4gIGlmIChpbnZlcnQpIHtcbiAgICAvLyBJbnZlcnQgb2YgcmVndWxhclxuICAgIGlmIChtb3VzZU9uQXhpcyA8IHRhcmdldFMxICsgdGFyZ2V0TGVuZ3RoICogaW52ZXJ0ZWRTd2FwVGhyZXNob2xkIC8gMiB8fCBtb3VzZU9uQXhpcyA+IHRhcmdldFMyIC0gdGFyZ2V0TGVuZ3RoICogaW52ZXJ0ZWRTd2FwVGhyZXNob2xkIC8gMikge1xuICAgICAgcmV0dXJuIG1vdXNlT25BeGlzID4gdGFyZ2V0UzEgKyB0YXJnZXRMZW5ndGggLyAyID8gMSA6IC0xO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAwO1xufVxuLyoqXG4gKiBHZXRzIHRoZSBkaXJlY3Rpb24gZHJhZ0VsIG11c3QgYmUgc3dhcHBlZCByZWxhdGl2ZSB0byB0YXJnZXQgaW4gb3JkZXIgdG8gbWFrZSBpdFxuICogc2VlbSB0aGF0IGRyYWdFbCBoYXMgYmVlbiBcImluc2VydGVkXCIgaW50byB0aGF0IGVsZW1lbnQncyBwb3NpdGlvblxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IHRhcmdldCAgICAgICBUaGUgdGFyZ2V0IHdob3NlIHBvc2l0aW9uIGRyYWdFbCBpcyBiZWluZyBpbnNlcnRlZCBhdFxuICogQHJldHVybiB7TnVtYmVyfSAgICAgICAgICAgICAgICAgICBEaXJlY3Rpb24gZHJhZ0VsIG11c3QgYmUgc3dhcHBlZFxuICovXG5cblxuZnVuY3Rpb24gX2dldEluc2VydERpcmVjdGlvbih0YXJnZXQpIHtcbiAgaWYgKGluZGV4KGRyYWdFbCkgPCBpbmRleCh0YXJnZXQpKSB7XG4gICAgcmV0dXJuIDE7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG59XG4vKipcbiAqIEdlbmVyYXRlIGlkXG4gKiBAcGFyYW0gICB7SFRNTEVsZW1lbnR9IGVsXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICogQHByaXZhdGVcbiAqL1xuXG5cbmZ1bmN0aW9uIF9nZW5lcmF0ZUlkKGVsKSB7XG4gIHZhciBzdHIgPSBlbC50YWdOYW1lICsgZWwuY2xhc3NOYW1lICsgZWwuc3JjICsgZWwuaHJlZiArIGVsLnRleHRDb250ZW50LFxuICAgICAgaSA9IHN0ci5sZW5ndGgsXG4gICAgICBzdW0gPSAwO1xuXG4gIHdoaWxlIChpLS0pIHtcbiAgICBzdW0gKz0gc3RyLmNoYXJDb2RlQXQoaSk7XG4gIH1cblxuICByZXR1cm4gc3VtLnRvU3RyaW5nKDM2KTtcbn1cblxuZnVuY3Rpb24gX3NhdmVJbnB1dENoZWNrZWRTdGF0ZShyb290KSB7XG4gIHNhdmVkSW5wdXRDaGVja2VkLmxlbmd0aCA9IDA7XG4gIHZhciBpbnB1dHMgPSByb290LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpbnB1dCcpO1xuICB2YXIgaWR4ID0gaW5wdXRzLmxlbmd0aDtcblxuICB3aGlsZSAoaWR4LS0pIHtcbiAgICB2YXIgZWwgPSBpbnB1dHNbaWR4XTtcbiAgICBlbC5jaGVja2VkICYmIHNhdmVkSW5wdXRDaGVja2VkLnB1c2goZWwpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9uZXh0VGljayhmbikge1xuICByZXR1cm4gc2V0VGltZW91dChmbiwgMCk7XG59XG5cbmZ1bmN0aW9uIF9jYW5jZWxOZXh0VGljayhpZCkge1xuICByZXR1cm4gY2xlYXJUaW1lb3V0KGlkKTtcbn0gLy8gRml4ZWQgIzk3MzpcblxuXG5pZiAoZG9jdW1lbnRFeGlzdHMpIHtcbiAgb24oZG9jdW1lbnQsICd0b3VjaG1vdmUnLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgaWYgKChTb3J0YWJsZS5hY3RpdmUgfHwgYXdhaXRpbmdEcmFnU3RhcnRlZCkgJiYgZXZ0LmNhbmNlbGFibGUpIHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfSk7XG59IC8vIEV4cG9ydCB1dGlsc1xuXG5cblNvcnRhYmxlLnV0aWxzID0ge1xuICBvbjogb24sXG4gIG9mZjogb2ZmLFxuICBjc3M6IGNzcyxcbiAgZmluZDogZmluZCxcbiAgaXM6IGZ1bmN0aW9uIGlzKGVsLCBzZWxlY3Rvcikge1xuICAgIHJldHVybiAhIWNsb3Nlc3QoZWwsIHNlbGVjdG9yLCBlbCwgZmFsc2UpO1xuICB9LFxuICBleHRlbmQ6IGV4dGVuZCxcbiAgdGhyb3R0bGU6IHRocm90dGxlLFxuICBjbG9zZXN0OiBjbG9zZXN0LFxuICB0b2dnbGVDbGFzczogdG9nZ2xlQ2xhc3MsXG4gIGNsb25lOiBjbG9uZSxcbiAgaW5kZXg6IGluZGV4LFxuICBuZXh0VGljazogX25leHRUaWNrLFxuICBjYW5jZWxOZXh0VGljazogX2NhbmNlbE5leHRUaWNrLFxuICBkZXRlY3REaXJlY3Rpb246IF9kZXRlY3REaXJlY3Rpb24sXG4gIGdldENoaWxkOiBnZXRDaGlsZFxufTtcbi8qKlxuICogR2V0IHRoZSBTb3J0YWJsZSBpbnN0YW5jZSBvZiBhbiBlbGVtZW50XG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudFxuICogQHJldHVybiB7U29ydGFibGV8dW5kZWZpbmVkfSAgICAgICAgIFRoZSBpbnN0YW5jZSBvZiBTb3J0YWJsZVxuICovXG5cblNvcnRhYmxlLmdldCA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gIHJldHVybiBlbGVtZW50W2V4cGFuZG9dO1xufTtcbi8qKlxuICogTW91bnQgYSBwbHVnaW4gdG8gU29ydGFibGVcbiAqIEBwYXJhbSAgey4uLlNvcnRhYmxlUGx1Z2lufFNvcnRhYmxlUGx1Z2luW119IHBsdWdpbnMgICAgICAgUGx1Z2lucyBiZWluZyBtb3VudGVkXG4gKi9cblxuXG5Tb3J0YWJsZS5tb3VudCA9IGZ1bmN0aW9uICgpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIHBsdWdpbnMgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgcGx1Z2luc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIGlmIChwbHVnaW5zWzBdLmNvbnN0cnVjdG9yID09PSBBcnJheSkgcGx1Z2lucyA9IHBsdWdpbnNbMF07XG4gIHBsdWdpbnMuZm9yRWFjaChmdW5jdGlvbiAocGx1Z2luKSB7XG4gICAgaWYgKCFwbHVnaW4ucHJvdG90eXBlIHx8ICFwbHVnaW4ucHJvdG90eXBlLmNvbnN0cnVjdG9yKSB7XG4gICAgICB0aHJvdyBcIlNvcnRhYmxlOiBNb3VudGVkIHBsdWdpbiBtdXN0IGJlIGEgY29uc3RydWN0b3IgZnVuY3Rpb24sIG5vdCBcIi5jb25jYXQoe30udG9TdHJpbmcuY2FsbChwbHVnaW4pKTtcbiAgICB9XG5cbiAgICBpZiAocGx1Z2luLnV0aWxzKSBTb3J0YWJsZS51dGlscyA9IF9vYmplY3RTcHJlYWQyKF9vYmplY3RTcHJlYWQyKHt9LCBTb3J0YWJsZS51dGlscyksIHBsdWdpbi51dGlscyk7XG4gICAgUGx1Z2luTWFuYWdlci5tb3VudChwbHVnaW4pO1xuICB9KTtcbn07XG4vKipcbiAqIENyZWF0ZSBzb3J0YWJsZSBpbnN0YW5jZVxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gIGVsXG4gKiBAcGFyYW0ge09iamVjdH0gICAgICBbb3B0aW9uc11cbiAqL1xuXG5cblNvcnRhYmxlLmNyZWF0ZSA9IGZ1bmN0aW9uIChlbCwgb3B0aW9ucykge1xuICByZXR1cm4gbmV3IFNvcnRhYmxlKGVsLCBvcHRpb25zKTtcbn07IC8vIEV4cG9ydFxuXG5cblNvcnRhYmxlLnZlcnNpb24gPSB2ZXJzaW9uO1xuXG52YXIgYXV0b1Njcm9sbHMgPSBbXSxcbiAgICBzY3JvbGxFbCxcbiAgICBzY3JvbGxSb290RWwsXG4gICAgc2Nyb2xsaW5nID0gZmFsc2UsXG4gICAgbGFzdEF1dG9TY3JvbGxYLFxuICAgIGxhc3RBdXRvU2Nyb2xsWSxcbiAgICB0b3VjaEV2dCQxLFxuICAgIHBvaW50ZXJFbGVtQ2hhbmdlZEludGVydmFsO1xuXG5mdW5jdGlvbiBBdXRvU2Nyb2xsUGx1Z2luKCkge1xuICBmdW5jdGlvbiBBdXRvU2Nyb2xsKCkge1xuICAgIHRoaXMuZGVmYXVsdHMgPSB7XG4gICAgICBzY3JvbGw6IHRydWUsXG4gICAgICBmb3JjZUF1dG9TY3JvbGxGYWxsYmFjazogZmFsc2UsXG4gICAgICBzY3JvbGxTZW5zaXRpdml0eTogMzAsXG4gICAgICBzY3JvbGxTcGVlZDogMTAsXG4gICAgICBidWJibGVTY3JvbGw6IHRydWVcbiAgICB9OyAvLyBCaW5kIGFsbCBwcml2YXRlIG1ldGhvZHNcblxuICAgIGZvciAodmFyIGZuIGluIHRoaXMpIHtcbiAgICAgIGlmIChmbi5jaGFyQXQoMCkgPT09ICdfJyAmJiB0eXBlb2YgdGhpc1tmbl0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpc1tmbl0gPSB0aGlzW2ZuXS5iaW5kKHRoaXMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIEF1dG9TY3JvbGwucHJvdG90eXBlID0ge1xuICAgIGRyYWdTdGFydGVkOiBmdW5jdGlvbiBkcmFnU3RhcnRlZChfcmVmKSB7XG4gICAgICB2YXIgb3JpZ2luYWxFdmVudCA9IF9yZWYub3JpZ2luYWxFdmVudDtcblxuICAgICAgaWYgKHRoaXMuc29ydGFibGUubmF0aXZlRHJhZ2dhYmxlKSB7XG4gICAgICAgIG9uKGRvY3VtZW50LCAnZHJhZ292ZXInLCB0aGlzLl9oYW5kbGVBdXRvU2Nyb2xsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc3VwcG9ydFBvaW50ZXIpIHtcbiAgICAgICAgICBvbihkb2N1bWVudCwgJ3BvaW50ZXJtb3ZlJywgdGhpcy5faGFuZGxlRmFsbGJhY2tBdXRvU2Nyb2xsKTtcbiAgICAgICAgfSBlbHNlIGlmIChvcmlnaW5hbEV2ZW50LnRvdWNoZXMpIHtcbiAgICAgICAgICBvbihkb2N1bWVudCwgJ3RvdWNobW92ZScsIHRoaXMuX2hhbmRsZUZhbGxiYWNrQXV0b1Njcm9sbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb24oZG9jdW1lbnQsICdtb3VzZW1vdmUnLCB0aGlzLl9oYW5kbGVGYWxsYmFja0F1dG9TY3JvbGwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBkcmFnT3ZlckNvbXBsZXRlZDogZnVuY3Rpb24gZHJhZ092ZXJDb21wbGV0ZWQoX3JlZjIpIHtcbiAgICAgIHZhciBvcmlnaW5hbEV2ZW50ID0gX3JlZjIub3JpZ2luYWxFdmVudDtcblxuICAgICAgLy8gRm9yIHdoZW4gYnViYmxpbmcgaXMgY2FuY2VsZWQgYW5kIHVzaW5nIGZhbGxiYWNrIChmYWxsYmFjayAndG91Y2htb3ZlJyBhbHdheXMgcmVhY2hlZClcbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmRyYWdPdmVyQnViYmxlICYmICFvcmlnaW5hbEV2ZW50LnJvb3RFbCkge1xuICAgICAgICB0aGlzLl9oYW5kbGVBdXRvU2Nyb2xsKG9yaWdpbmFsRXZlbnQpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZHJvcDogZnVuY3Rpb24gZHJvcCgpIHtcbiAgICAgIGlmICh0aGlzLnNvcnRhYmxlLm5hdGl2ZURyYWdnYWJsZSkge1xuICAgICAgICBvZmYoZG9jdW1lbnQsICdkcmFnb3ZlcicsIHRoaXMuX2hhbmRsZUF1dG9TY3JvbGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb2ZmKGRvY3VtZW50LCAncG9pbnRlcm1vdmUnLCB0aGlzLl9oYW5kbGVGYWxsYmFja0F1dG9TY3JvbGwpO1xuICAgICAgICBvZmYoZG9jdW1lbnQsICd0b3VjaG1vdmUnLCB0aGlzLl9oYW5kbGVGYWxsYmFja0F1dG9TY3JvbGwpO1xuICAgICAgICBvZmYoZG9jdW1lbnQsICdtb3VzZW1vdmUnLCB0aGlzLl9oYW5kbGVGYWxsYmFja0F1dG9TY3JvbGwpO1xuICAgICAgfVxuXG4gICAgICBjbGVhclBvaW50ZXJFbGVtQ2hhbmdlZEludGVydmFsKCk7XG4gICAgICBjbGVhckF1dG9TY3JvbGxzKCk7XG4gICAgICBjYW5jZWxUaHJvdHRsZSgpO1xuICAgIH0sXG4gICAgbnVsbGluZzogZnVuY3Rpb24gbnVsbGluZygpIHtcbiAgICAgIHRvdWNoRXZ0JDEgPSBzY3JvbGxSb290RWwgPSBzY3JvbGxFbCA9IHNjcm9sbGluZyA9IHBvaW50ZXJFbGVtQ2hhbmdlZEludGVydmFsID0gbGFzdEF1dG9TY3JvbGxYID0gbGFzdEF1dG9TY3JvbGxZID0gbnVsbDtcbiAgICAgIGF1dG9TY3JvbGxzLmxlbmd0aCA9IDA7XG4gICAgfSxcbiAgICBfaGFuZGxlRmFsbGJhY2tBdXRvU2Nyb2xsOiBmdW5jdGlvbiBfaGFuZGxlRmFsbGJhY2tBdXRvU2Nyb2xsKGV2dCkge1xuICAgICAgdGhpcy5faGFuZGxlQXV0b1Njcm9sbChldnQsIHRydWUpO1xuICAgIH0sXG4gICAgX2hhbmRsZUF1dG9TY3JvbGw6IGZ1bmN0aW9uIF9oYW5kbGVBdXRvU2Nyb2xsKGV2dCwgZmFsbGJhY2spIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIHZhciB4ID0gKGV2dC50b3VjaGVzID8gZXZ0LnRvdWNoZXNbMF0gOiBldnQpLmNsaWVudFgsXG4gICAgICAgICAgeSA9IChldnQudG91Y2hlcyA/IGV2dC50b3VjaGVzWzBdIDogZXZ0KS5jbGllbnRZLFxuICAgICAgICAgIGVsZW0gPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KHgsIHkpO1xuICAgICAgdG91Y2hFdnQkMSA9IGV2dDsgLy8gSUUgZG9lcyBub3Qgc2VlbSB0byBoYXZlIG5hdGl2ZSBhdXRvc2Nyb2xsLFxuICAgICAgLy8gRWRnZSdzIGF1dG9zY3JvbGwgc2VlbXMgdG9vIGNvbmRpdGlvbmFsLFxuICAgICAgLy8gTUFDT1MgU2FmYXJpIGRvZXMgbm90IGhhdmUgYXV0b3Njcm9sbCxcbiAgICAgIC8vIEZpcmVmb3ggYW5kIENocm9tZSBhcmUgZ29vZFxuXG4gICAgICBpZiAoZmFsbGJhY2sgfHwgdGhpcy5vcHRpb25zLmZvcmNlQXV0b1Njcm9sbEZhbGxiYWNrIHx8IEVkZ2UgfHwgSUUxMU9yTGVzcyB8fCBTYWZhcmkpIHtcbiAgICAgICAgYXV0b1Njcm9sbChldnQsIHRoaXMub3B0aW9ucywgZWxlbSwgZmFsbGJhY2spOyAvLyBMaXN0ZW5lciBmb3IgcG9pbnRlciBlbGVtZW50IGNoYW5nZVxuXG4gICAgICAgIHZhciBvZ0VsZW1TY3JvbGxlciA9IGdldFBhcmVudEF1dG9TY3JvbGxFbGVtZW50KGVsZW0sIHRydWUpO1xuXG4gICAgICAgIGlmIChzY3JvbGxpbmcgJiYgKCFwb2ludGVyRWxlbUNoYW5nZWRJbnRlcnZhbCB8fCB4ICE9PSBsYXN0QXV0b1Njcm9sbFggfHwgeSAhPT0gbGFzdEF1dG9TY3JvbGxZKSkge1xuICAgICAgICAgIHBvaW50ZXJFbGVtQ2hhbmdlZEludGVydmFsICYmIGNsZWFyUG9pbnRlckVsZW1DaGFuZ2VkSW50ZXJ2YWwoKTsgLy8gRGV0ZWN0IGZvciBwb2ludGVyIGVsZW0gY2hhbmdlLCBlbXVsYXRpbmcgbmF0aXZlIERuRCBiZWhhdmlvdXJcblxuICAgICAgICAgIHBvaW50ZXJFbGVtQ2hhbmdlZEludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG5ld0VsZW0gPSBnZXRQYXJlbnRBdXRvU2Nyb2xsRWxlbWVudChkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KHgsIHkpLCB0cnVlKTtcblxuICAgICAgICAgICAgaWYgKG5ld0VsZW0gIT09IG9nRWxlbVNjcm9sbGVyKSB7XG4gICAgICAgICAgICAgIG9nRWxlbVNjcm9sbGVyID0gbmV3RWxlbTtcbiAgICAgICAgICAgICAgY2xlYXJBdXRvU2Nyb2xscygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhdXRvU2Nyb2xsKGV2dCwgX3RoaXMub3B0aW9ucywgbmV3RWxlbSwgZmFsbGJhY2spO1xuICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgICBsYXN0QXV0b1Njcm9sbFggPSB4O1xuICAgICAgICAgIGxhc3RBdXRvU2Nyb2xsWSA9IHk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGlmIERuRCBpcyBlbmFibGVkIChhbmQgYnJvd3NlciBoYXMgZ29vZCBhdXRvc2Nyb2xsaW5nKSwgZmlyc3QgYXV0b3Njcm9sbCB3aWxsIGFscmVhZHkgc2Nyb2xsLCBzbyBnZXQgcGFyZW50IGF1dG9zY3JvbGwgb2YgZmlyc3QgYXV0b3Njcm9sbFxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5idWJibGVTY3JvbGwgfHwgZ2V0UGFyZW50QXV0b1Njcm9sbEVsZW1lbnQoZWxlbSwgdHJ1ZSkgPT09IGdldFdpbmRvd1Njcm9sbGluZ0VsZW1lbnQoKSkge1xuICAgICAgICAgIGNsZWFyQXV0b1Njcm9sbHMoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBhdXRvU2Nyb2xsKGV2dCwgdGhpcy5vcHRpb25zLCBnZXRQYXJlbnRBdXRvU2Nyb2xsRWxlbWVudChlbGVtLCBmYWxzZSksIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIHJldHVybiBfZXh0ZW5kcyhBdXRvU2Nyb2xsLCB7XG4gICAgcGx1Z2luTmFtZTogJ3Njcm9sbCcsXG4gICAgaW5pdGlhbGl6ZUJ5RGVmYXVsdDogdHJ1ZVxuICB9KTtcbn1cblxuZnVuY3Rpb24gY2xlYXJBdXRvU2Nyb2xscygpIHtcbiAgYXV0b1Njcm9sbHMuZm9yRWFjaChmdW5jdGlvbiAoYXV0b1Njcm9sbCkge1xuICAgIGNsZWFySW50ZXJ2YWwoYXV0b1Njcm9sbC5waWQpO1xuICB9KTtcbiAgYXV0b1Njcm9sbHMgPSBbXTtcbn1cblxuZnVuY3Rpb24gY2xlYXJQb2ludGVyRWxlbUNoYW5nZWRJbnRlcnZhbCgpIHtcbiAgY2xlYXJJbnRlcnZhbChwb2ludGVyRWxlbUNoYW5nZWRJbnRlcnZhbCk7XG59XG5cbnZhciBhdXRvU2Nyb2xsID0gdGhyb3R0bGUoZnVuY3Rpb24gKGV2dCwgb3B0aW9ucywgcm9vdEVsLCBpc0ZhbGxiYWNrKSB7XG4gIC8vIEJ1ZzogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9NTA1NTIxXG4gIGlmICghb3B0aW9ucy5zY3JvbGwpIHJldHVybjtcbiAgdmFyIHggPSAoZXZ0LnRvdWNoZXMgPyBldnQudG91Y2hlc1swXSA6IGV2dCkuY2xpZW50WCxcbiAgICAgIHkgPSAoZXZ0LnRvdWNoZXMgPyBldnQudG91Y2hlc1swXSA6IGV2dCkuY2xpZW50WSxcbiAgICAgIHNlbnMgPSBvcHRpb25zLnNjcm9sbFNlbnNpdGl2aXR5LFxuICAgICAgc3BlZWQgPSBvcHRpb25zLnNjcm9sbFNwZWVkLFxuICAgICAgd2luU2Nyb2xsZXIgPSBnZXRXaW5kb3dTY3JvbGxpbmdFbGVtZW50KCk7XG4gIHZhciBzY3JvbGxUaGlzSW5zdGFuY2UgPSBmYWxzZSxcbiAgICAgIHNjcm9sbEN1c3RvbUZuOyAvLyBOZXcgc2Nyb2xsIHJvb3QsIHNldCBzY3JvbGxFbFxuXG4gIGlmIChzY3JvbGxSb290RWwgIT09IHJvb3RFbCkge1xuICAgIHNjcm9sbFJvb3RFbCA9IHJvb3RFbDtcbiAgICBjbGVhckF1dG9TY3JvbGxzKCk7XG4gICAgc2Nyb2xsRWwgPSBvcHRpb25zLnNjcm9sbDtcbiAgICBzY3JvbGxDdXN0b21GbiA9IG9wdGlvbnMuc2Nyb2xsRm47XG5cbiAgICBpZiAoc2Nyb2xsRWwgPT09IHRydWUpIHtcbiAgICAgIHNjcm9sbEVsID0gZ2V0UGFyZW50QXV0b1Njcm9sbEVsZW1lbnQocm9vdEVsLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICB2YXIgbGF5ZXJzT3V0ID0gMDtcbiAgdmFyIGN1cnJlbnRQYXJlbnQgPSBzY3JvbGxFbDtcblxuICBkbyB7XG4gICAgdmFyIGVsID0gY3VycmVudFBhcmVudCxcbiAgICAgICAgcmVjdCA9IGdldFJlY3QoZWwpLFxuICAgICAgICB0b3AgPSByZWN0LnRvcCxcbiAgICAgICAgYm90dG9tID0gcmVjdC5ib3R0b20sXG4gICAgICAgIGxlZnQgPSByZWN0LmxlZnQsXG4gICAgICAgIHJpZ2h0ID0gcmVjdC5yaWdodCxcbiAgICAgICAgd2lkdGggPSByZWN0LndpZHRoLFxuICAgICAgICBoZWlnaHQgPSByZWN0LmhlaWdodCxcbiAgICAgICAgY2FuU2Nyb2xsWCA9IHZvaWQgMCxcbiAgICAgICAgY2FuU2Nyb2xsWSA9IHZvaWQgMCxcbiAgICAgICAgc2Nyb2xsV2lkdGggPSBlbC5zY3JvbGxXaWR0aCxcbiAgICAgICAgc2Nyb2xsSGVpZ2h0ID0gZWwuc2Nyb2xsSGVpZ2h0LFxuICAgICAgICBlbENTUyA9IGNzcyhlbCksXG4gICAgICAgIHNjcm9sbFBvc1ggPSBlbC5zY3JvbGxMZWZ0LFxuICAgICAgICBzY3JvbGxQb3NZID0gZWwuc2Nyb2xsVG9wO1xuXG4gICAgaWYgKGVsID09PSB3aW5TY3JvbGxlcikge1xuICAgICAgY2FuU2Nyb2xsWCA9IHdpZHRoIDwgc2Nyb2xsV2lkdGggJiYgKGVsQ1NTLm92ZXJmbG93WCA9PT0gJ2F1dG8nIHx8IGVsQ1NTLm92ZXJmbG93WCA9PT0gJ3Njcm9sbCcgfHwgZWxDU1Mub3ZlcmZsb3dYID09PSAndmlzaWJsZScpO1xuICAgICAgY2FuU2Nyb2xsWSA9IGhlaWdodCA8IHNjcm9sbEhlaWdodCAmJiAoZWxDU1Mub3ZlcmZsb3dZID09PSAnYXV0bycgfHwgZWxDU1Mub3ZlcmZsb3dZID09PSAnc2Nyb2xsJyB8fCBlbENTUy5vdmVyZmxvd1kgPT09ICd2aXNpYmxlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhblNjcm9sbFggPSB3aWR0aCA8IHNjcm9sbFdpZHRoICYmIChlbENTUy5vdmVyZmxvd1ggPT09ICdhdXRvJyB8fCBlbENTUy5vdmVyZmxvd1ggPT09ICdzY3JvbGwnKTtcbiAgICAgIGNhblNjcm9sbFkgPSBoZWlnaHQgPCBzY3JvbGxIZWlnaHQgJiYgKGVsQ1NTLm92ZXJmbG93WSA9PT0gJ2F1dG8nIHx8IGVsQ1NTLm92ZXJmbG93WSA9PT0gJ3Njcm9sbCcpO1xuICAgIH1cblxuICAgIHZhciB2eCA9IGNhblNjcm9sbFggJiYgKE1hdGguYWJzKHJpZ2h0IC0geCkgPD0gc2VucyAmJiBzY3JvbGxQb3NYICsgd2lkdGggPCBzY3JvbGxXaWR0aCkgLSAoTWF0aC5hYnMobGVmdCAtIHgpIDw9IHNlbnMgJiYgISFzY3JvbGxQb3NYKTtcbiAgICB2YXIgdnkgPSBjYW5TY3JvbGxZICYmIChNYXRoLmFicyhib3R0b20gLSB5KSA8PSBzZW5zICYmIHNjcm9sbFBvc1kgKyBoZWlnaHQgPCBzY3JvbGxIZWlnaHQpIC0gKE1hdGguYWJzKHRvcCAtIHkpIDw9IHNlbnMgJiYgISFzY3JvbGxQb3NZKTtcblxuICAgIGlmICghYXV0b1Njcm9sbHNbbGF5ZXJzT3V0XSkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPD0gbGF5ZXJzT3V0OyBpKyspIHtcbiAgICAgICAgaWYgKCFhdXRvU2Nyb2xsc1tpXSkge1xuICAgICAgICAgIGF1dG9TY3JvbGxzW2ldID0ge307XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYXV0b1Njcm9sbHNbbGF5ZXJzT3V0XS52eCAhPSB2eCB8fCBhdXRvU2Nyb2xsc1tsYXllcnNPdXRdLnZ5ICE9IHZ5IHx8IGF1dG9TY3JvbGxzW2xheWVyc091dF0uZWwgIT09IGVsKSB7XG4gICAgICBhdXRvU2Nyb2xsc1tsYXllcnNPdXRdLmVsID0gZWw7XG4gICAgICBhdXRvU2Nyb2xsc1tsYXllcnNPdXRdLnZ4ID0gdng7XG4gICAgICBhdXRvU2Nyb2xsc1tsYXllcnNPdXRdLnZ5ID0gdnk7XG4gICAgICBjbGVhckludGVydmFsKGF1dG9TY3JvbGxzW2xheWVyc091dF0ucGlkKTtcblxuICAgICAgaWYgKHZ4ICE9IDAgfHwgdnkgIT0gMCkge1xuICAgICAgICBzY3JvbGxUaGlzSW5zdGFuY2UgPSB0cnVlO1xuICAgICAgICAvKiBqc2hpbnQgbG9vcGZ1bmM6dHJ1ZSAqL1xuXG4gICAgICAgIGF1dG9TY3JvbGxzW2xheWVyc091dF0ucGlkID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vIGVtdWxhdGUgZHJhZyBvdmVyIGR1cmluZyBhdXRvc2Nyb2xsIChmYWxsYmFjayksIGVtdWxhdGluZyBuYXRpdmUgRG5EIGJlaGF2aW91clxuICAgICAgICAgIGlmIChpc0ZhbGxiYWNrICYmIHRoaXMubGF5ZXIgPT09IDApIHtcbiAgICAgICAgICAgIFNvcnRhYmxlLmFjdGl2ZS5fb25Ub3VjaE1vdmUodG91Y2hFdnQkMSk7IC8vIFRvIG1vdmUgZ2hvc3QgaWYgaXQgaXMgcG9zaXRpb25lZCBhYnNvbHV0ZWx5XG5cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgc2Nyb2xsT2Zmc2V0WSA9IGF1dG9TY3JvbGxzW3RoaXMubGF5ZXJdLnZ5ID8gYXV0b1Njcm9sbHNbdGhpcy5sYXllcl0udnkgKiBzcGVlZCA6IDA7XG4gICAgICAgICAgdmFyIHNjcm9sbE9mZnNldFggPSBhdXRvU2Nyb2xsc1t0aGlzLmxheWVyXS52eCA/IGF1dG9TY3JvbGxzW3RoaXMubGF5ZXJdLnZ4ICogc3BlZWQgOiAwO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiBzY3JvbGxDdXN0b21GbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgaWYgKHNjcm9sbEN1c3RvbUZuLmNhbGwoU29ydGFibGUuZHJhZ2dlZC5wYXJlbnROb2RlW2V4cGFuZG9dLCBzY3JvbGxPZmZzZXRYLCBzY3JvbGxPZmZzZXRZLCBldnQsIHRvdWNoRXZ0JDEsIGF1dG9TY3JvbGxzW3RoaXMubGF5ZXJdLmVsKSAhPT0gJ2NvbnRpbnVlJykge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc2Nyb2xsQnkoYXV0b1Njcm9sbHNbdGhpcy5sYXllcl0uZWwsIHNjcm9sbE9mZnNldFgsIHNjcm9sbE9mZnNldFkpO1xuICAgICAgICB9LmJpbmQoe1xuICAgICAgICAgIGxheWVyOiBsYXllcnNPdXRcbiAgICAgICAgfSksIDI0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsYXllcnNPdXQrKztcbiAgfSB3aGlsZSAob3B0aW9ucy5idWJibGVTY3JvbGwgJiYgY3VycmVudFBhcmVudCAhPT0gd2luU2Nyb2xsZXIgJiYgKGN1cnJlbnRQYXJlbnQgPSBnZXRQYXJlbnRBdXRvU2Nyb2xsRWxlbWVudChjdXJyZW50UGFyZW50LCBmYWxzZSkpKTtcblxuICBzY3JvbGxpbmcgPSBzY3JvbGxUaGlzSW5zdGFuY2U7IC8vIGluIGNhc2UgYW5vdGhlciBmdW5jdGlvbiBjYXRjaGVzIHNjcm9sbGluZyBhcyBmYWxzZSBpbiBiZXR3ZWVuIHdoZW4gaXQgaXMgbm90XG59LCAzMCk7XG5cbnZhciBkcm9wID0gZnVuY3Rpb24gZHJvcChfcmVmKSB7XG4gIHZhciBvcmlnaW5hbEV2ZW50ID0gX3JlZi5vcmlnaW5hbEV2ZW50LFxuICAgICAgcHV0U29ydGFibGUgPSBfcmVmLnB1dFNvcnRhYmxlLFxuICAgICAgZHJhZ0VsID0gX3JlZi5kcmFnRWwsXG4gICAgICBhY3RpdmVTb3J0YWJsZSA9IF9yZWYuYWN0aXZlU29ydGFibGUsXG4gICAgICBkaXNwYXRjaFNvcnRhYmxlRXZlbnQgPSBfcmVmLmRpc3BhdGNoU29ydGFibGVFdmVudCxcbiAgICAgIGhpZGVHaG9zdEZvclRhcmdldCA9IF9yZWYuaGlkZUdob3N0Rm9yVGFyZ2V0LFxuICAgICAgdW5oaWRlR2hvc3RGb3JUYXJnZXQgPSBfcmVmLnVuaGlkZUdob3N0Rm9yVGFyZ2V0O1xuICBpZiAoIW9yaWdpbmFsRXZlbnQpIHJldHVybjtcbiAgdmFyIHRvU29ydGFibGUgPSBwdXRTb3J0YWJsZSB8fCBhY3RpdmVTb3J0YWJsZTtcbiAgaGlkZUdob3N0Rm9yVGFyZ2V0KCk7XG4gIHZhciB0b3VjaCA9IG9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXMgJiYgb3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlcy5sZW5ndGggPyBvcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdIDogb3JpZ2luYWxFdmVudDtcbiAgdmFyIHRhcmdldCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQodG91Y2guY2xpZW50WCwgdG91Y2guY2xpZW50WSk7XG4gIHVuaGlkZUdob3N0Rm9yVGFyZ2V0KCk7XG5cbiAgaWYgKHRvU29ydGFibGUgJiYgIXRvU29ydGFibGUuZWwuY29udGFpbnModGFyZ2V0KSkge1xuICAgIGRpc3BhdGNoU29ydGFibGVFdmVudCgnc3BpbGwnKTtcbiAgICB0aGlzLm9uU3BpbGwoe1xuICAgICAgZHJhZ0VsOiBkcmFnRWwsXG4gICAgICBwdXRTb3J0YWJsZTogcHV0U29ydGFibGVcbiAgICB9KTtcbiAgfVxufTtcblxuZnVuY3Rpb24gUmV2ZXJ0KCkge31cblxuUmV2ZXJ0LnByb3RvdHlwZSA9IHtcbiAgc3RhcnRJbmRleDogbnVsbCxcbiAgZHJhZ1N0YXJ0OiBmdW5jdGlvbiBkcmFnU3RhcnQoX3JlZjIpIHtcbiAgICB2YXIgb2xkRHJhZ2dhYmxlSW5kZXggPSBfcmVmMi5vbGREcmFnZ2FibGVJbmRleDtcbiAgICB0aGlzLnN0YXJ0SW5kZXggPSBvbGREcmFnZ2FibGVJbmRleDtcbiAgfSxcbiAgb25TcGlsbDogZnVuY3Rpb24gb25TcGlsbChfcmVmMykge1xuICAgIHZhciBkcmFnRWwgPSBfcmVmMy5kcmFnRWwsXG4gICAgICAgIHB1dFNvcnRhYmxlID0gX3JlZjMucHV0U29ydGFibGU7XG4gICAgdGhpcy5zb3J0YWJsZS5jYXB0dXJlQW5pbWF0aW9uU3RhdGUoKTtcblxuICAgIGlmIChwdXRTb3J0YWJsZSkge1xuICAgICAgcHV0U29ydGFibGUuY2FwdHVyZUFuaW1hdGlvblN0YXRlKCk7XG4gICAgfVxuXG4gICAgdmFyIG5leHRTaWJsaW5nID0gZ2V0Q2hpbGQodGhpcy5zb3J0YWJsZS5lbCwgdGhpcy5zdGFydEluZGV4LCB0aGlzLm9wdGlvbnMpO1xuXG4gICAgaWYgKG5leHRTaWJsaW5nKSB7XG4gICAgICB0aGlzLnNvcnRhYmxlLmVsLmluc2VydEJlZm9yZShkcmFnRWwsIG5leHRTaWJsaW5nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zb3J0YWJsZS5lbC5hcHBlbmRDaGlsZChkcmFnRWwpO1xuICAgIH1cblxuICAgIHRoaXMuc29ydGFibGUuYW5pbWF0ZUFsbCgpO1xuXG4gICAgaWYgKHB1dFNvcnRhYmxlKSB7XG4gICAgICBwdXRTb3J0YWJsZS5hbmltYXRlQWxsKCk7XG4gICAgfVxuICB9LFxuICBkcm9wOiBkcm9wXG59O1xuXG5fZXh0ZW5kcyhSZXZlcnQsIHtcbiAgcGx1Z2luTmFtZTogJ3JldmVydE9uU3BpbGwnXG59KTtcblxuZnVuY3Rpb24gUmVtb3ZlKCkge31cblxuUmVtb3ZlLnByb3RvdHlwZSA9IHtcbiAgb25TcGlsbDogZnVuY3Rpb24gb25TcGlsbChfcmVmNCkge1xuICAgIHZhciBkcmFnRWwgPSBfcmVmNC5kcmFnRWwsXG4gICAgICAgIHB1dFNvcnRhYmxlID0gX3JlZjQucHV0U29ydGFibGU7XG4gICAgdmFyIHBhcmVudFNvcnRhYmxlID0gcHV0U29ydGFibGUgfHwgdGhpcy5zb3J0YWJsZTtcbiAgICBwYXJlbnRTb3J0YWJsZS5jYXB0dXJlQW5pbWF0aW9uU3RhdGUoKTtcbiAgICBkcmFnRWwucGFyZW50Tm9kZSAmJiBkcmFnRWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkcmFnRWwpO1xuICAgIHBhcmVudFNvcnRhYmxlLmFuaW1hdGVBbGwoKTtcbiAgfSxcbiAgZHJvcDogZHJvcFxufTtcblxuX2V4dGVuZHMoUmVtb3ZlLCB7XG4gIHBsdWdpbk5hbWU6ICdyZW1vdmVPblNwaWxsJ1xufSk7XG5cbnZhciBsYXN0U3dhcEVsO1xuXG5mdW5jdGlvbiBTd2FwUGx1Z2luKCkge1xuICBmdW5jdGlvbiBTd2FwKCkge1xuICAgIHRoaXMuZGVmYXVsdHMgPSB7XG4gICAgICBzd2FwQ2xhc3M6ICdzb3J0YWJsZS1zd2FwLWhpZ2hsaWdodCdcbiAgICB9O1xuICB9XG5cbiAgU3dhcC5wcm90b3R5cGUgPSB7XG4gICAgZHJhZ1N0YXJ0OiBmdW5jdGlvbiBkcmFnU3RhcnQoX3JlZikge1xuICAgICAgdmFyIGRyYWdFbCA9IF9yZWYuZHJhZ0VsO1xuICAgICAgbGFzdFN3YXBFbCA9IGRyYWdFbDtcbiAgICB9LFxuICAgIGRyYWdPdmVyVmFsaWQ6IGZ1bmN0aW9uIGRyYWdPdmVyVmFsaWQoX3JlZjIpIHtcbiAgICAgIHZhciBjb21wbGV0ZWQgPSBfcmVmMi5jb21wbGV0ZWQsXG4gICAgICAgICAgdGFyZ2V0ID0gX3JlZjIudGFyZ2V0LFxuICAgICAgICAgIG9uTW92ZSA9IF9yZWYyLm9uTW92ZSxcbiAgICAgICAgICBhY3RpdmVTb3J0YWJsZSA9IF9yZWYyLmFjdGl2ZVNvcnRhYmxlLFxuICAgICAgICAgIGNoYW5nZWQgPSBfcmVmMi5jaGFuZ2VkLFxuICAgICAgICAgIGNhbmNlbCA9IF9yZWYyLmNhbmNlbDtcbiAgICAgIGlmICghYWN0aXZlU29ydGFibGUub3B0aW9ucy5zd2FwKSByZXR1cm47XG4gICAgICB2YXIgZWwgPSB0aGlzLnNvcnRhYmxlLmVsLFxuICAgICAgICAgIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG5cbiAgICAgIGlmICh0YXJnZXQgJiYgdGFyZ2V0ICE9PSBlbCkge1xuICAgICAgICB2YXIgcHJldlN3YXBFbCA9IGxhc3RTd2FwRWw7XG5cbiAgICAgICAgaWYgKG9uTW92ZSh0YXJnZXQpICE9PSBmYWxzZSkge1xuICAgICAgICAgIHRvZ2dsZUNsYXNzKHRhcmdldCwgb3B0aW9ucy5zd2FwQ2xhc3MsIHRydWUpO1xuICAgICAgICAgIGxhc3RTd2FwRWwgPSB0YXJnZXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGFzdFN3YXBFbCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJldlN3YXBFbCAmJiBwcmV2U3dhcEVsICE9PSBsYXN0U3dhcEVsKSB7XG4gICAgICAgICAgdG9nZ2xlQ2xhc3MocHJldlN3YXBFbCwgb3B0aW9ucy5zd2FwQ2xhc3MsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjaGFuZ2VkKCk7XG4gICAgICBjb21wbGV0ZWQodHJ1ZSk7XG4gICAgICBjYW5jZWwoKTtcbiAgICB9LFxuICAgIGRyb3A6IGZ1bmN0aW9uIGRyb3AoX3JlZjMpIHtcbiAgICAgIHZhciBhY3RpdmVTb3J0YWJsZSA9IF9yZWYzLmFjdGl2ZVNvcnRhYmxlLFxuICAgICAgICAgIHB1dFNvcnRhYmxlID0gX3JlZjMucHV0U29ydGFibGUsXG4gICAgICAgICAgZHJhZ0VsID0gX3JlZjMuZHJhZ0VsO1xuICAgICAgdmFyIHRvU29ydGFibGUgPSBwdXRTb3J0YWJsZSB8fCB0aGlzLnNvcnRhYmxlO1xuICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgICBsYXN0U3dhcEVsICYmIHRvZ2dsZUNsYXNzKGxhc3RTd2FwRWwsIG9wdGlvbnMuc3dhcENsYXNzLCBmYWxzZSk7XG5cbiAgICAgIGlmIChsYXN0U3dhcEVsICYmIChvcHRpb25zLnN3YXAgfHwgcHV0U29ydGFibGUgJiYgcHV0U29ydGFibGUub3B0aW9ucy5zd2FwKSkge1xuICAgICAgICBpZiAoZHJhZ0VsICE9PSBsYXN0U3dhcEVsKSB7XG4gICAgICAgICAgdG9Tb3J0YWJsZS5jYXB0dXJlQW5pbWF0aW9uU3RhdGUoKTtcbiAgICAgICAgICBpZiAodG9Tb3J0YWJsZSAhPT0gYWN0aXZlU29ydGFibGUpIGFjdGl2ZVNvcnRhYmxlLmNhcHR1cmVBbmltYXRpb25TdGF0ZSgpO1xuICAgICAgICAgIHN3YXBOb2RlcyhkcmFnRWwsIGxhc3RTd2FwRWwpO1xuICAgICAgICAgIHRvU29ydGFibGUuYW5pbWF0ZUFsbCgpO1xuICAgICAgICAgIGlmICh0b1NvcnRhYmxlICE9PSBhY3RpdmVTb3J0YWJsZSkgYWN0aXZlU29ydGFibGUuYW5pbWF0ZUFsbCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBudWxsaW5nOiBmdW5jdGlvbiBudWxsaW5nKCkge1xuICAgICAgbGFzdFN3YXBFbCA9IG51bGw7XG4gICAgfVxuICB9O1xuICByZXR1cm4gX2V4dGVuZHMoU3dhcCwge1xuICAgIHBsdWdpbk5hbWU6ICdzd2FwJyxcbiAgICBldmVudFByb3BlcnRpZXM6IGZ1bmN0aW9uIGV2ZW50UHJvcGVydGllcygpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN3YXBJdGVtOiBsYXN0U3dhcEVsXG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHN3YXBOb2RlcyhuMSwgbjIpIHtcbiAgdmFyIHAxID0gbjEucGFyZW50Tm9kZSxcbiAgICAgIHAyID0gbjIucGFyZW50Tm9kZSxcbiAgICAgIGkxLFxuICAgICAgaTI7XG4gIGlmICghcDEgfHwgIXAyIHx8IHAxLmlzRXF1YWxOb2RlKG4yKSB8fCBwMi5pc0VxdWFsTm9kZShuMSkpIHJldHVybjtcbiAgaTEgPSBpbmRleChuMSk7XG4gIGkyID0gaW5kZXgobjIpO1xuXG4gIGlmIChwMS5pc0VxdWFsTm9kZShwMikgJiYgaTEgPCBpMikge1xuICAgIGkyKys7XG4gIH1cblxuICBwMS5pbnNlcnRCZWZvcmUobjIsIHAxLmNoaWxkcmVuW2kxXSk7XG4gIHAyLmluc2VydEJlZm9yZShuMSwgcDIuY2hpbGRyZW5baTJdKTtcbn1cblxudmFyIG11bHRpRHJhZ0VsZW1lbnRzID0gW10sXG4gICAgbXVsdGlEcmFnQ2xvbmVzID0gW10sXG4gICAgbGFzdE11bHRpRHJhZ1NlbGVjdCxcbiAgICAvLyBmb3Igc2VsZWN0aW9uIHdpdGggbW9kaWZpZXIga2V5IGRvd24gKFNISUZUKVxubXVsdGlEcmFnU29ydGFibGUsXG4gICAgaW5pdGlhbEZvbGRpbmcgPSBmYWxzZSxcbiAgICAvLyBJbml0aWFsIG11bHRpLWRyYWcgZm9sZCB3aGVuIGRyYWcgc3RhcnRlZFxuZm9sZGluZyA9IGZhbHNlLFxuICAgIC8vIEZvbGRpbmcgYW55IG90aGVyIHRpbWVcbmRyYWdTdGFydGVkID0gZmFsc2UsXG4gICAgZHJhZ0VsJDEsXG4gICAgY2xvbmVzRnJvbVJlY3QsXG4gICAgY2xvbmVzSGlkZGVuO1xuXG5mdW5jdGlvbiBNdWx0aURyYWdQbHVnaW4oKSB7XG4gIGZ1bmN0aW9uIE11bHRpRHJhZyhzb3J0YWJsZSkge1xuICAgIC8vIEJpbmQgYWxsIHByaXZhdGUgbWV0aG9kc1xuICAgIGZvciAodmFyIGZuIGluIHRoaXMpIHtcbiAgICAgIGlmIChmbi5jaGFyQXQoMCkgPT09ICdfJyAmJiB0eXBlb2YgdGhpc1tmbl0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpc1tmbl0gPSB0aGlzW2ZuXS5iaW5kKHRoaXMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzb3J0YWJsZS5vcHRpb25zLnN1cHBvcnRQb2ludGVyKSB7XG4gICAgICBvbihkb2N1bWVudCwgJ3BvaW50ZXJ1cCcsIHRoaXMuX2Rlc2VsZWN0TXVsdGlEcmFnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb24oZG9jdW1lbnQsICdtb3VzZXVwJywgdGhpcy5fZGVzZWxlY3RNdWx0aURyYWcpO1xuICAgICAgb24oZG9jdW1lbnQsICd0b3VjaGVuZCcsIHRoaXMuX2Rlc2VsZWN0TXVsdGlEcmFnKTtcbiAgICB9XG5cbiAgICBvbihkb2N1bWVudCwgJ2tleWRvd24nLCB0aGlzLl9jaGVja0tleURvd24pO1xuICAgIG9uKGRvY3VtZW50LCAna2V5dXAnLCB0aGlzLl9jaGVja0tleVVwKTtcbiAgICB0aGlzLmRlZmF1bHRzID0ge1xuICAgICAgc2VsZWN0ZWRDbGFzczogJ3NvcnRhYmxlLXNlbGVjdGVkJyxcbiAgICAgIG11bHRpRHJhZ0tleTogbnVsbCxcbiAgICAgIHNldERhdGE6IGZ1bmN0aW9uIHNldERhdGEoZGF0YVRyYW5zZmVyLCBkcmFnRWwpIHtcbiAgICAgICAgdmFyIGRhdGEgPSAnJztcblxuICAgICAgICBpZiAobXVsdGlEcmFnRWxlbWVudHMubGVuZ3RoICYmIG11bHRpRHJhZ1NvcnRhYmxlID09PSBzb3J0YWJsZSkge1xuICAgICAgICAgIG11bHRpRHJhZ0VsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKG11bHRpRHJhZ0VsZW1lbnQsIGkpIHtcbiAgICAgICAgICAgIGRhdGEgKz0gKCFpID8gJycgOiAnLCAnKSArIG11bHRpRHJhZ0VsZW1lbnQudGV4dENvbnRlbnQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGF0YSA9IGRyYWdFbC50ZXh0Q29udGVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGRhdGFUcmFuc2Zlci5zZXREYXRhKCdUZXh0JywgZGF0YSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIE11bHRpRHJhZy5wcm90b3R5cGUgPSB7XG4gICAgbXVsdGlEcmFnS2V5RG93bjogZmFsc2UsXG4gICAgaXNNdWx0aURyYWc6IGZhbHNlLFxuICAgIGRlbGF5U3RhcnRHbG9iYWw6IGZ1bmN0aW9uIGRlbGF5U3RhcnRHbG9iYWwoX3JlZikge1xuICAgICAgdmFyIGRyYWdnZWQgPSBfcmVmLmRyYWdFbDtcbiAgICAgIGRyYWdFbCQxID0gZHJhZ2dlZDtcbiAgICB9LFxuICAgIGRlbGF5RW5kZWQ6IGZ1bmN0aW9uIGRlbGF5RW5kZWQoKSB7XG4gICAgICB0aGlzLmlzTXVsdGlEcmFnID0gfm11bHRpRHJhZ0VsZW1lbnRzLmluZGV4T2YoZHJhZ0VsJDEpO1xuICAgIH0sXG4gICAgc2V0dXBDbG9uZTogZnVuY3Rpb24gc2V0dXBDbG9uZShfcmVmMikge1xuICAgICAgdmFyIHNvcnRhYmxlID0gX3JlZjIuc29ydGFibGUsXG4gICAgICAgICAgY2FuY2VsID0gX3JlZjIuY2FuY2VsO1xuICAgICAgaWYgKCF0aGlzLmlzTXVsdGlEcmFnKSByZXR1cm47XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbXVsdGlEcmFnRWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbXVsdGlEcmFnQ2xvbmVzLnB1c2goY2xvbmUobXVsdGlEcmFnRWxlbWVudHNbaV0pKTtcbiAgICAgICAgbXVsdGlEcmFnQ2xvbmVzW2ldLnNvcnRhYmxlSW5kZXggPSBtdWx0aURyYWdFbGVtZW50c1tpXS5zb3J0YWJsZUluZGV4O1xuICAgICAgICBtdWx0aURyYWdDbG9uZXNbaV0uZHJhZ2dhYmxlID0gZmFsc2U7XG4gICAgICAgIG11bHRpRHJhZ0Nsb25lc1tpXS5zdHlsZVsnd2lsbC1jaGFuZ2UnXSA9ICcnO1xuICAgICAgICB0b2dnbGVDbGFzcyhtdWx0aURyYWdDbG9uZXNbaV0sIHRoaXMub3B0aW9ucy5zZWxlY3RlZENsYXNzLCBmYWxzZSk7XG4gICAgICAgIG11bHRpRHJhZ0VsZW1lbnRzW2ldID09PSBkcmFnRWwkMSAmJiB0b2dnbGVDbGFzcyhtdWx0aURyYWdDbG9uZXNbaV0sIHRoaXMub3B0aW9ucy5jaG9zZW5DbGFzcywgZmFsc2UpO1xuICAgICAgfVxuXG4gICAgICBzb3J0YWJsZS5faGlkZUNsb25lKCk7XG5cbiAgICAgIGNhbmNlbCgpO1xuICAgIH0sXG4gICAgY2xvbmU6IGZ1bmN0aW9uIGNsb25lKF9yZWYzKSB7XG4gICAgICB2YXIgc29ydGFibGUgPSBfcmVmMy5zb3J0YWJsZSxcbiAgICAgICAgICByb290RWwgPSBfcmVmMy5yb290RWwsXG4gICAgICAgICAgZGlzcGF0Y2hTb3J0YWJsZUV2ZW50ID0gX3JlZjMuZGlzcGF0Y2hTb3J0YWJsZUV2ZW50LFxuICAgICAgICAgIGNhbmNlbCA9IF9yZWYzLmNhbmNlbDtcbiAgICAgIGlmICghdGhpcy5pc011bHRpRHJhZykgcmV0dXJuO1xuXG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5yZW1vdmVDbG9uZU9uSGlkZSkge1xuICAgICAgICBpZiAobXVsdGlEcmFnRWxlbWVudHMubGVuZ3RoICYmIG11bHRpRHJhZ1NvcnRhYmxlID09PSBzb3J0YWJsZSkge1xuICAgICAgICAgIGluc2VydE11bHRpRHJhZ0Nsb25lcyh0cnVlLCByb290RWwpO1xuICAgICAgICAgIGRpc3BhdGNoU29ydGFibGVFdmVudCgnY2xvbmUnKTtcbiAgICAgICAgICBjYW5jZWwoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgc2hvd0Nsb25lOiBmdW5jdGlvbiBzaG93Q2xvbmUoX3JlZjQpIHtcbiAgICAgIHZhciBjbG9uZU5vd1Nob3duID0gX3JlZjQuY2xvbmVOb3dTaG93bixcbiAgICAgICAgICByb290RWwgPSBfcmVmNC5yb290RWwsXG4gICAgICAgICAgY2FuY2VsID0gX3JlZjQuY2FuY2VsO1xuICAgICAgaWYgKCF0aGlzLmlzTXVsdGlEcmFnKSByZXR1cm47XG4gICAgICBpbnNlcnRNdWx0aURyYWdDbG9uZXMoZmFsc2UsIHJvb3RFbCk7XG4gICAgICBtdWx0aURyYWdDbG9uZXMuZm9yRWFjaChmdW5jdGlvbiAoY2xvbmUpIHtcbiAgICAgICAgY3NzKGNsb25lLCAnZGlzcGxheScsICcnKTtcbiAgICAgIH0pO1xuICAgICAgY2xvbmVOb3dTaG93bigpO1xuICAgICAgY2xvbmVzSGlkZGVuID0gZmFsc2U7XG4gICAgICBjYW5jZWwoKTtcbiAgICB9LFxuICAgIGhpZGVDbG9uZTogZnVuY3Rpb24gaGlkZUNsb25lKF9yZWY1KSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICB2YXIgc29ydGFibGUgPSBfcmVmNS5zb3J0YWJsZSxcbiAgICAgICAgICBjbG9uZU5vd0hpZGRlbiA9IF9yZWY1LmNsb25lTm93SGlkZGVuLFxuICAgICAgICAgIGNhbmNlbCA9IF9yZWY1LmNhbmNlbDtcbiAgICAgIGlmICghdGhpcy5pc011bHRpRHJhZykgcmV0dXJuO1xuICAgICAgbXVsdGlEcmFnQ2xvbmVzLmZvckVhY2goZnVuY3Rpb24gKGNsb25lKSB7XG4gICAgICAgIGNzcyhjbG9uZSwgJ2Rpc3BsYXknLCAnbm9uZScpO1xuXG4gICAgICAgIGlmIChfdGhpcy5vcHRpb25zLnJlbW92ZUNsb25lT25IaWRlICYmIGNsb25lLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICBjbG9uZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGNsb25lKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjbG9uZU5vd0hpZGRlbigpO1xuICAgICAgY2xvbmVzSGlkZGVuID0gdHJ1ZTtcbiAgICAgIGNhbmNlbCgpO1xuICAgIH0sXG4gICAgZHJhZ1N0YXJ0R2xvYmFsOiBmdW5jdGlvbiBkcmFnU3RhcnRHbG9iYWwoX3JlZjYpIHtcbiAgICAgIHZhciBzb3J0YWJsZSA9IF9yZWY2LnNvcnRhYmxlO1xuXG4gICAgICBpZiAoIXRoaXMuaXNNdWx0aURyYWcgJiYgbXVsdGlEcmFnU29ydGFibGUpIHtcbiAgICAgICAgbXVsdGlEcmFnU29ydGFibGUubXVsdGlEcmFnLl9kZXNlbGVjdE11bHRpRHJhZygpO1xuICAgICAgfVxuXG4gICAgICBtdWx0aURyYWdFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChtdWx0aURyYWdFbGVtZW50KSB7XG4gICAgICAgIG11bHRpRHJhZ0VsZW1lbnQuc29ydGFibGVJbmRleCA9IGluZGV4KG11bHRpRHJhZ0VsZW1lbnQpO1xuICAgICAgfSk7IC8vIFNvcnQgbXVsdGktZHJhZyBlbGVtZW50c1xuXG4gICAgICBtdWx0aURyYWdFbGVtZW50cyA9IG11bHRpRHJhZ0VsZW1lbnRzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEuc29ydGFibGVJbmRleCAtIGIuc29ydGFibGVJbmRleDtcbiAgICAgIH0pO1xuICAgICAgZHJhZ1N0YXJ0ZWQgPSB0cnVlO1xuICAgIH0sXG4gICAgZHJhZ1N0YXJ0ZWQ6IGZ1bmN0aW9uIGRyYWdTdGFydGVkKF9yZWY3KSB7XG4gICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgdmFyIHNvcnRhYmxlID0gX3JlZjcuc29ydGFibGU7XG4gICAgICBpZiAoIXRoaXMuaXNNdWx0aURyYWcpIHJldHVybjtcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5zb3J0KSB7XG4gICAgICAgIC8vIENhcHR1cmUgcmVjdHMsXG4gICAgICAgIC8vIGhpZGUgbXVsdGkgZHJhZyBlbGVtZW50cyAoYnkgcG9zaXRpb25pbmcgdGhlbSBhYnNvbHV0ZSksXG4gICAgICAgIC8vIHNldCBtdWx0aSBkcmFnIGVsZW1lbnRzIHJlY3RzIHRvIGRyYWdSZWN0LFxuICAgICAgICAvLyBzaG93IG11bHRpIGRyYWcgZWxlbWVudHMsXG4gICAgICAgIC8vIGFuaW1hdGUgdG8gcmVjdHMsXG4gICAgICAgIC8vIHVuc2V0IHJlY3RzICYgcmVtb3ZlIGZyb20gRE9NXG4gICAgICAgIHNvcnRhYmxlLmNhcHR1cmVBbmltYXRpb25TdGF0ZSgpO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYW5pbWF0aW9uKSB7XG4gICAgICAgICAgbXVsdGlEcmFnRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAobXVsdGlEcmFnRWxlbWVudCkge1xuICAgICAgICAgICAgaWYgKG11bHRpRHJhZ0VsZW1lbnQgPT09IGRyYWdFbCQxKSByZXR1cm47XG4gICAgICAgICAgICBjc3MobXVsdGlEcmFnRWxlbWVudCwgJ3Bvc2l0aW9uJywgJ2Fic29sdXRlJyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdmFyIGRyYWdSZWN0ID0gZ2V0UmVjdChkcmFnRWwkMSwgZmFsc2UsIHRydWUsIHRydWUpO1xuICAgICAgICAgIG11bHRpRHJhZ0VsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKG11bHRpRHJhZ0VsZW1lbnQpIHtcbiAgICAgICAgICAgIGlmIChtdWx0aURyYWdFbGVtZW50ID09PSBkcmFnRWwkMSkgcmV0dXJuO1xuICAgICAgICAgICAgc2V0UmVjdChtdWx0aURyYWdFbGVtZW50LCBkcmFnUmVjdCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgZm9sZGluZyA9IHRydWU7XG4gICAgICAgICAgaW5pdGlhbEZvbGRpbmcgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHNvcnRhYmxlLmFuaW1hdGVBbGwoZnVuY3Rpb24gKCkge1xuICAgICAgICBmb2xkaW5nID0gZmFsc2U7XG4gICAgICAgIGluaXRpYWxGb2xkaW5nID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKF90aGlzMi5vcHRpb25zLmFuaW1hdGlvbikge1xuICAgICAgICAgIG11bHRpRHJhZ0VsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKG11bHRpRHJhZ0VsZW1lbnQpIHtcbiAgICAgICAgICAgIHVuc2V0UmVjdChtdWx0aURyYWdFbGVtZW50KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSAvLyBSZW1vdmUgYWxsIGF1eGlsaWFyeSBtdWx0aWRyYWcgaXRlbXMgZnJvbSBlbCwgaWYgc29ydGluZyBlbmFibGVkXG5cblxuICAgICAgICBpZiAoX3RoaXMyLm9wdGlvbnMuc29ydCkge1xuICAgICAgICAgIHJlbW92ZU11bHRpRHJhZ0VsZW1lbnRzKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZHJhZ092ZXI6IGZ1bmN0aW9uIGRyYWdPdmVyKF9yZWY4KSB7XG4gICAgICB2YXIgdGFyZ2V0ID0gX3JlZjgudGFyZ2V0LFxuICAgICAgICAgIGNvbXBsZXRlZCA9IF9yZWY4LmNvbXBsZXRlZCxcbiAgICAgICAgICBjYW5jZWwgPSBfcmVmOC5jYW5jZWw7XG5cbiAgICAgIGlmIChmb2xkaW5nICYmIH5tdWx0aURyYWdFbGVtZW50cy5pbmRleE9mKHRhcmdldCkpIHtcbiAgICAgICAgY29tcGxldGVkKGZhbHNlKTtcbiAgICAgICAgY2FuY2VsKCk7XG4gICAgICB9XG4gICAgfSxcbiAgICByZXZlcnQ6IGZ1bmN0aW9uIHJldmVydChfcmVmOSkge1xuICAgICAgdmFyIGZyb21Tb3J0YWJsZSA9IF9yZWY5LmZyb21Tb3J0YWJsZSxcbiAgICAgICAgICByb290RWwgPSBfcmVmOS5yb290RWwsXG4gICAgICAgICAgc29ydGFibGUgPSBfcmVmOS5zb3J0YWJsZSxcbiAgICAgICAgICBkcmFnUmVjdCA9IF9yZWY5LmRyYWdSZWN0O1xuXG4gICAgICBpZiAobXVsdGlEcmFnRWxlbWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAvLyBTZXR1cCB1bmZvbGQgYW5pbWF0aW9uXG4gICAgICAgIG11bHRpRHJhZ0VsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKG11bHRpRHJhZ0VsZW1lbnQpIHtcbiAgICAgICAgICBzb3J0YWJsZS5hZGRBbmltYXRpb25TdGF0ZSh7XG4gICAgICAgICAgICB0YXJnZXQ6IG11bHRpRHJhZ0VsZW1lbnQsXG4gICAgICAgICAgICByZWN0OiBmb2xkaW5nID8gZ2V0UmVjdChtdWx0aURyYWdFbGVtZW50KSA6IGRyYWdSZWN0XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdW5zZXRSZWN0KG11bHRpRHJhZ0VsZW1lbnQpO1xuICAgICAgICAgIG11bHRpRHJhZ0VsZW1lbnQuZnJvbVJlY3QgPSBkcmFnUmVjdDtcbiAgICAgICAgICBmcm9tU29ydGFibGUucmVtb3ZlQW5pbWF0aW9uU3RhdGUobXVsdGlEcmFnRWxlbWVudCk7XG4gICAgICAgIH0pO1xuICAgICAgICBmb2xkaW5nID0gZmFsc2U7XG4gICAgICAgIGluc2VydE11bHRpRHJhZ0VsZW1lbnRzKCF0aGlzLm9wdGlvbnMucmVtb3ZlQ2xvbmVPbkhpZGUsIHJvb3RFbCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBkcmFnT3ZlckNvbXBsZXRlZDogZnVuY3Rpb24gZHJhZ092ZXJDb21wbGV0ZWQoX3JlZjEwKSB7XG4gICAgICB2YXIgc29ydGFibGUgPSBfcmVmMTAuc29ydGFibGUsXG4gICAgICAgICAgaXNPd25lciA9IF9yZWYxMC5pc093bmVyLFxuICAgICAgICAgIGluc2VydGlvbiA9IF9yZWYxMC5pbnNlcnRpb24sXG4gICAgICAgICAgYWN0aXZlU29ydGFibGUgPSBfcmVmMTAuYWN0aXZlU29ydGFibGUsXG4gICAgICAgICAgcGFyZW50RWwgPSBfcmVmMTAucGFyZW50RWwsXG4gICAgICAgICAgcHV0U29ydGFibGUgPSBfcmVmMTAucHV0U29ydGFibGU7XG4gICAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuICAgICAgaWYgKGluc2VydGlvbikge1xuICAgICAgICAvLyBDbG9uZXMgbXVzdCBiZSBoaWRkZW4gYmVmb3JlIGZvbGRpbmcgYW5pbWF0aW9uIHRvIGNhcHR1cmUgZHJhZ1JlY3RBYnNvbHV0ZSBwcm9wZXJseVxuICAgICAgICBpZiAoaXNPd25lcikge1xuICAgICAgICAgIGFjdGl2ZVNvcnRhYmxlLl9oaWRlQ2xvbmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXRpYWxGb2xkaW5nID0gZmFsc2U7IC8vIElmIGxlYXZpbmcgc29ydDpmYWxzZSByb290LCBvciBhbHJlYWR5IGZvbGRpbmcgLSBGb2xkIHRvIG5ldyBsb2NhdGlvblxuXG4gICAgICAgIGlmIChvcHRpb25zLmFuaW1hdGlvbiAmJiBtdWx0aURyYWdFbGVtZW50cy5sZW5ndGggPiAxICYmIChmb2xkaW5nIHx8ICFpc093bmVyICYmICFhY3RpdmVTb3J0YWJsZS5vcHRpb25zLnNvcnQgJiYgIXB1dFNvcnRhYmxlKSkge1xuICAgICAgICAgIC8vIEZvbGQ6IFNldCBhbGwgbXVsdGkgZHJhZyBlbGVtZW50cydzIHJlY3RzIHRvIGRyYWdFbCdzIHJlY3Qgd2hlbiBtdWx0aS1kcmFnIGVsZW1lbnRzIGFyZSBpbnZpc2libGVcbiAgICAgICAgICB2YXIgZHJhZ1JlY3RBYnNvbHV0ZSA9IGdldFJlY3QoZHJhZ0VsJDEsIGZhbHNlLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgICBtdWx0aURyYWdFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChtdWx0aURyYWdFbGVtZW50KSB7XG4gICAgICAgICAgICBpZiAobXVsdGlEcmFnRWxlbWVudCA9PT0gZHJhZ0VsJDEpIHJldHVybjtcbiAgICAgICAgICAgIHNldFJlY3QobXVsdGlEcmFnRWxlbWVudCwgZHJhZ1JlY3RBYnNvbHV0ZSk7IC8vIE1vdmUgZWxlbWVudChzKSB0byBlbmQgb2YgcGFyZW50RWwgc28gdGhhdCBpdCBkb2VzIG5vdCBpbnRlcmZlcmUgd2l0aCBtdWx0aS1kcmFnIGNsb25lcyBpbnNlcnRpb24gaWYgdGhleSBhcmUgaW5zZXJ0ZWRcbiAgICAgICAgICAgIC8vIHdoaWxlIGZvbGRpbmcsIGFuZCBzbyB0aGF0IHdlIGNhbiBjYXB0dXJlIHRoZW0gYWdhaW4gYmVjYXVzZSBvbGQgc29ydGFibGUgd2lsbCBubyBsb25nZXIgYmUgZnJvbVNvcnRhYmxlXG5cbiAgICAgICAgICAgIHBhcmVudEVsLmFwcGVuZENoaWxkKG11bHRpRHJhZ0VsZW1lbnQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGZvbGRpbmcgPSB0cnVlO1xuICAgICAgICB9IC8vIENsb25lcyBtdXN0IGJlIHNob3duIChhbmQgY2hlY2sgdG8gcmVtb3ZlIG11bHRpIGRyYWdzKSBhZnRlciBmb2xkaW5nIHdoZW4gaW50ZXJmZXJpbmcgbXVsdGlEcmFnRWxlbWVudHMgYXJlIG1vdmVkIG91dFxuXG5cbiAgICAgICAgaWYgKCFpc093bmVyKSB7XG4gICAgICAgICAgLy8gT25seSByZW1vdmUgaWYgbm90IGZvbGRpbmcgKGZvbGRpbmcgd2lsbCByZW1vdmUgdGhlbSBhbnl3YXlzKVxuICAgICAgICAgIGlmICghZm9sZGluZykge1xuICAgICAgICAgICAgcmVtb3ZlTXVsdGlEcmFnRWxlbWVudHMoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAobXVsdGlEcmFnRWxlbWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgdmFyIGNsb25lc0hpZGRlbkJlZm9yZSA9IGNsb25lc0hpZGRlbjtcblxuICAgICAgICAgICAgYWN0aXZlU29ydGFibGUuX3Nob3dDbG9uZShzb3J0YWJsZSk7IC8vIFVuZm9sZCBhbmltYXRpb24gZm9yIGNsb25lcyBpZiBzaG93aW5nIGZyb20gaGlkZGVuXG5cblxuICAgICAgICAgICAgaWYgKGFjdGl2ZVNvcnRhYmxlLm9wdGlvbnMuYW5pbWF0aW9uICYmICFjbG9uZXNIaWRkZW4gJiYgY2xvbmVzSGlkZGVuQmVmb3JlKSB7XG4gICAgICAgICAgICAgIG11bHRpRHJhZ0Nsb25lcy5mb3JFYWNoKGZ1bmN0aW9uIChjbG9uZSkge1xuICAgICAgICAgICAgICAgIGFjdGl2ZVNvcnRhYmxlLmFkZEFuaW1hdGlvblN0YXRlKHtcbiAgICAgICAgICAgICAgICAgIHRhcmdldDogY2xvbmUsXG4gICAgICAgICAgICAgICAgICByZWN0OiBjbG9uZXNGcm9tUmVjdFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNsb25lLmZyb21SZWN0ID0gY2xvbmVzRnJvbVJlY3Q7XG4gICAgICAgICAgICAgICAgY2xvbmUudGhpc0FuaW1hdGlvbkR1cmF0aW9uID0gbnVsbDtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFjdGl2ZVNvcnRhYmxlLl9zaG93Q2xvbmUoc29ydGFibGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgZHJhZ092ZXJBbmltYXRpb25DYXB0dXJlOiBmdW5jdGlvbiBkcmFnT3ZlckFuaW1hdGlvbkNhcHR1cmUoX3JlZjExKSB7XG4gICAgICB2YXIgZHJhZ1JlY3QgPSBfcmVmMTEuZHJhZ1JlY3QsXG4gICAgICAgICAgaXNPd25lciA9IF9yZWYxMS5pc093bmVyLFxuICAgICAgICAgIGFjdGl2ZVNvcnRhYmxlID0gX3JlZjExLmFjdGl2ZVNvcnRhYmxlO1xuICAgICAgbXVsdGlEcmFnRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAobXVsdGlEcmFnRWxlbWVudCkge1xuICAgICAgICBtdWx0aURyYWdFbGVtZW50LnRoaXNBbmltYXRpb25EdXJhdGlvbiA9IG51bGw7XG4gICAgICB9KTtcblxuICAgICAgaWYgKGFjdGl2ZVNvcnRhYmxlLm9wdGlvbnMuYW5pbWF0aW9uICYmICFpc093bmVyICYmIGFjdGl2ZVNvcnRhYmxlLm11bHRpRHJhZy5pc011bHRpRHJhZykge1xuICAgICAgICBjbG9uZXNGcm9tUmVjdCA9IF9leHRlbmRzKHt9LCBkcmFnUmVjdCk7XG4gICAgICAgIHZhciBkcmFnTWF0cml4ID0gbWF0cml4KGRyYWdFbCQxLCB0cnVlKTtcbiAgICAgICAgY2xvbmVzRnJvbVJlY3QudG9wIC09IGRyYWdNYXRyaXguZjtcbiAgICAgICAgY2xvbmVzRnJvbVJlY3QubGVmdCAtPSBkcmFnTWF0cml4LmU7XG4gICAgICB9XG4gICAgfSxcbiAgICBkcmFnT3ZlckFuaW1hdGlvbkNvbXBsZXRlOiBmdW5jdGlvbiBkcmFnT3ZlckFuaW1hdGlvbkNvbXBsZXRlKCkge1xuICAgICAgaWYgKGZvbGRpbmcpIHtcbiAgICAgICAgZm9sZGluZyA9IGZhbHNlO1xuICAgICAgICByZW1vdmVNdWx0aURyYWdFbGVtZW50cygpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZHJvcDogZnVuY3Rpb24gZHJvcChfcmVmMTIpIHtcbiAgICAgIHZhciBldnQgPSBfcmVmMTIub3JpZ2luYWxFdmVudCxcbiAgICAgICAgICByb290RWwgPSBfcmVmMTIucm9vdEVsLFxuICAgICAgICAgIHBhcmVudEVsID0gX3JlZjEyLnBhcmVudEVsLFxuICAgICAgICAgIHNvcnRhYmxlID0gX3JlZjEyLnNvcnRhYmxlLFxuICAgICAgICAgIGRpc3BhdGNoU29ydGFibGVFdmVudCA9IF9yZWYxMi5kaXNwYXRjaFNvcnRhYmxlRXZlbnQsXG4gICAgICAgICAgb2xkSW5kZXggPSBfcmVmMTIub2xkSW5kZXgsXG4gICAgICAgICAgcHV0U29ydGFibGUgPSBfcmVmMTIucHV0U29ydGFibGU7XG4gICAgICB2YXIgdG9Tb3J0YWJsZSA9IHB1dFNvcnRhYmxlIHx8IHRoaXMuc29ydGFibGU7XG4gICAgICBpZiAoIWV2dCkgcmV0dXJuO1xuICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgICAgY2hpbGRyZW4gPSBwYXJlbnRFbC5jaGlsZHJlbjsgLy8gTXVsdGktZHJhZyBzZWxlY3Rpb25cblxuICAgICAgaWYgKCFkcmFnU3RhcnRlZCkge1xuICAgICAgICBpZiAob3B0aW9ucy5tdWx0aURyYWdLZXkgJiYgIXRoaXMubXVsdGlEcmFnS2V5RG93bikge1xuICAgICAgICAgIHRoaXMuX2Rlc2VsZWN0TXVsdGlEcmFnKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0b2dnbGVDbGFzcyhkcmFnRWwkMSwgb3B0aW9ucy5zZWxlY3RlZENsYXNzLCAhfm11bHRpRHJhZ0VsZW1lbnRzLmluZGV4T2YoZHJhZ0VsJDEpKTtcblxuICAgICAgICBpZiAoIX5tdWx0aURyYWdFbGVtZW50cy5pbmRleE9mKGRyYWdFbCQxKSkge1xuICAgICAgICAgIG11bHRpRHJhZ0VsZW1lbnRzLnB1c2goZHJhZ0VsJDEpO1xuICAgICAgICAgIGRpc3BhdGNoRXZlbnQoe1xuICAgICAgICAgICAgc29ydGFibGU6IHNvcnRhYmxlLFxuICAgICAgICAgICAgcm9vdEVsOiByb290RWwsXG4gICAgICAgICAgICBuYW1lOiAnc2VsZWN0JyxcbiAgICAgICAgICAgIHRhcmdldEVsOiBkcmFnRWwkMSxcbiAgICAgICAgICAgIG9yaWdpbmFsRXZ0OiBldnRcbiAgICAgICAgICB9KTsgLy8gTW9kaWZpZXIgYWN0aXZhdGVkLCBzZWxlY3QgZnJvbSBsYXN0IHRvIGRyYWdFbFxuXG4gICAgICAgICAgaWYgKGV2dC5zaGlmdEtleSAmJiBsYXN0TXVsdGlEcmFnU2VsZWN0ICYmIHNvcnRhYmxlLmVsLmNvbnRhaW5zKGxhc3RNdWx0aURyYWdTZWxlY3QpKSB7XG4gICAgICAgICAgICB2YXIgbGFzdEluZGV4ID0gaW5kZXgobGFzdE11bHRpRHJhZ1NlbGVjdCksXG4gICAgICAgICAgICAgICAgY3VycmVudEluZGV4ID0gaW5kZXgoZHJhZ0VsJDEpO1xuXG4gICAgICAgICAgICBpZiAofmxhc3RJbmRleCAmJiB+Y3VycmVudEluZGV4ICYmIGxhc3RJbmRleCAhPT0gY3VycmVudEluZGV4KSB7XG4gICAgICAgICAgICAgIC8vIE11c3QgaW5jbHVkZSBsYXN0TXVsdGlEcmFnU2VsZWN0IChzZWxlY3QgaXQpLCBpbiBjYXNlIG1vZGlmaWVkIHNlbGVjdGlvbiBmcm9tIG5vIHNlbGVjdGlvblxuICAgICAgICAgICAgICAvLyAoYnV0IHByZXZpb3VzIHNlbGVjdGlvbiBleGlzdGVkKVxuICAgICAgICAgICAgICB2YXIgbiwgaTtcblxuICAgICAgICAgICAgICBpZiAoY3VycmVudEluZGV4ID4gbGFzdEluZGV4KSB7XG4gICAgICAgICAgICAgICAgaSA9IGxhc3RJbmRleDtcbiAgICAgICAgICAgICAgICBuID0gY3VycmVudEluZGV4O1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGkgPSBjdXJyZW50SW5kZXg7XG4gICAgICAgICAgICAgICAgbiA9IGxhc3RJbmRleCArIDE7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBmb3IgKDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh+bXVsdGlEcmFnRWxlbWVudHMuaW5kZXhPZihjaGlsZHJlbltpXSkpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIHRvZ2dsZUNsYXNzKGNoaWxkcmVuW2ldLCBvcHRpb25zLnNlbGVjdGVkQ2xhc3MsIHRydWUpO1xuICAgICAgICAgICAgICAgIG11bHRpRHJhZ0VsZW1lbnRzLnB1c2goY2hpbGRyZW5baV0pO1xuICAgICAgICAgICAgICAgIGRpc3BhdGNoRXZlbnQoe1xuICAgICAgICAgICAgICAgICAgc29ydGFibGU6IHNvcnRhYmxlLFxuICAgICAgICAgICAgICAgICAgcm9vdEVsOiByb290RWwsXG4gICAgICAgICAgICAgICAgICBuYW1lOiAnc2VsZWN0JyxcbiAgICAgICAgICAgICAgICAgIHRhcmdldEVsOiBjaGlsZHJlbltpXSxcbiAgICAgICAgICAgICAgICAgIG9yaWdpbmFsRXZ0OiBldnRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsYXN0TXVsdGlEcmFnU2VsZWN0ID0gZHJhZ0VsJDE7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbXVsdGlEcmFnU29ydGFibGUgPSB0b1NvcnRhYmxlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG11bHRpRHJhZ0VsZW1lbnRzLnNwbGljZShtdWx0aURyYWdFbGVtZW50cy5pbmRleE9mKGRyYWdFbCQxKSwgMSk7XG4gICAgICAgICAgbGFzdE11bHRpRHJhZ1NlbGVjdCA9IG51bGw7XG4gICAgICAgICAgZGlzcGF0Y2hFdmVudCh7XG4gICAgICAgICAgICBzb3J0YWJsZTogc29ydGFibGUsXG4gICAgICAgICAgICByb290RWw6IHJvb3RFbCxcbiAgICAgICAgICAgIG5hbWU6ICdkZXNlbGVjdCcsXG4gICAgICAgICAgICB0YXJnZXRFbDogZHJhZ0VsJDEsXG4gICAgICAgICAgICBvcmlnaW5hbEV2dDogZXZ0XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gLy8gTXVsdGktZHJhZyBkcm9wXG5cblxuICAgICAgaWYgKGRyYWdTdGFydGVkICYmIHRoaXMuaXNNdWx0aURyYWcpIHtcbiAgICAgICAgZm9sZGluZyA9IGZhbHNlOyAvLyBEbyBub3QgXCJ1bmZvbGRcIiBhZnRlciBhcm91bmQgZHJhZ0VsIGlmIHJldmVydGVkXG5cbiAgICAgICAgaWYgKChwYXJlbnRFbFtleHBhbmRvXS5vcHRpb25zLnNvcnQgfHwgcGFyZW50RWwgIT09IHJvb3RFbCkgJiYgbXVsdGlEcmFnRWxlbWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgIHZhciBkcmFnUmVjdCA9IGdldFJlY3QoZHJhZ0VsJDEpLFxuICAgICAgICAgICAgICBtdWx0aURyYWdJbmRleCA9IGluZGV4KGRyYWdFbCQxLCAnOm5vdCguJyArIHRoaXMub3B0aW9ucy5zZWxlY3RlZENsYXNzICsgJyknKTtcbiAgICAgICAgICBpZiAoIWluaXRpYWxGb2xkaW5nICYmIG9wdGlvbnMuYW5pbWF0aW9uKSBkcmFnRWwkMS50aGlzQW5pbWF0aW9uRHVyYXRpb24gPSBudWxsO1xuICAgICAgICAgIHRvU29ydGFibGUuY2FwdHVyZUFuaW1hdGlvblN0YXRlKCk7XG5cbiAgICAgICAgICBpZiAoIWluaXRpYWxGb2xkaW5nKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5hbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgZHJhZ0VsJDEuZnJvbVJlY3QgPSBkcmFnUmVjdDtcbiAgICAgICAgICAgICAgbXVsdGlEcmFnRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAobXVsdGlEcmFnRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIG11bHRpRHJhZ0VsZW1lbnQudGhpc0FuaW1hdGlvbkR1cmF0aW9uID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIGlmIChtdWx0aURyYWdFbGVtZW50ICE9PSBkcmFnRWwkMSkge1xuICAgICAgICAgICAgICAgICAgdmFyIHJlY3QgPSBmb2xkaW5nID8gZ2V0UmVjdChtdWx0aURyYWdFbGVtZW50KSA6IGRyYWdSZWN0O1xuICAgICAgICAgICAgICAgICAgbXVsdGlEcmFnRWxlbWVudC5mcm9tUmVjdCA9IHJlY3Q7IC8vIFByZXBhcmUgdW5mb2xkIGFuaW1hdGlvblxuXG4gICAgICAgICAgICAgICAgICB0b1NvcnRhYmxlLmFkZEFuaW1hdGlvblN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBtdWx0aURyYWdFbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICByZWN0OiByZWN0XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSAvLyBNdWx0aSBkcmFnIGVsZW1lbnRzIGFyZSBub3QgbmVjZXNzYXJpbHkgcmVtb3ZlZCBmcm9tIHRoZSBET00gb24gZHJvcCwgc28gdG8gcmVpbnNlcnRcbiAgICAgICAgICAgIC8vIHByb3Blcmx5IHRoZXkgbXVzdCBhbGwgYmUgcmVtb3ZlZFxuXG5cbiAgICAgICAgICAgIHJlbW92ZU11bHRpRHJhZ0VsZW1lbnRzKCk7XG4gICAgICAgICAgICBtdWx0aURyYWdFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChtdWx0aURyYWdFbGVtZW50KSB7XG4gICAgICAgICAgICAgIGlmIChjaGlsZHJlblttdWx0aURyYWdJbmRleF0pIHtcbiAgICAgICAgICAgICAgICBwYXJlbnRFbC5pbnNlcnRCZWZvcmUobXVsdGlEcmFnRWxlbWVudCwgY2hpbGRyZW5bbXVsdGlEcmFnSW5kZXhdKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXJlbnRFbC5hcHBlbmRDaGlsZChtdWx0aURyYWdFbGVtZW50KTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIG11bHRpRHJhZ0luZGV4Kys7XG4gICAgICAgICAgICB9KTsgLy8gSWYgaW5pdGlhbCBmb2xkaW5nIGlzIGRvbmUsIHRoZSBlbGVtZW50cyBtYXkgaGF2ZSBjaGFuZ2VkIHBvc2l0aW9uIGJlY2F1c2UgdGhleSBhcmUgbm93XG4gICAgICAgICAgICAvLyB1bmZvbGRpbmcgYXJvdW5kIGRyYWdFbCwgZXZlbiB0aG91Z2ggZHJhZ0VsIG1heSBub3QgaGF2ZSBoaXMgaW5kZXggY2hhbmdlZCwgc28gdXBkYXRlIGV2ZW50XG4gICAgICAgICAgICAvLyBtdXN0IGJlIGZpcmVkIGhlcmUgYXMgU29ydGFibGUgd2lsbCBub3QuXG5cbiAgICAgICAgICAgIGlmIChvbGRJbmRleCA9PT0gaW5kZXgoZHJhZ0VsJDEpKSB7XG4gICAgICAgICAgICAgIHZhciB1cGRhdGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgbXVsdGlEcmFnRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAobXVsdGlEcmFnRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGlmIChtdWx0aURyYWdFbGVtZW50LnNvcnRhYmxlSW5kZXggIT09IGluZGV4KG11bHRpRHJhZ0VsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgICB1cGRhdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgaWYgKHVwZGF0ZSkge1xuICAgICAgICAgICAgICAgIGRpc3BhdGNoU29ydGFibGVFdmVudCgndXBkYXRlJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IC8vIE11c3QgYmUgZG9uZSBhZnRlciBjYXB0dXJpbmcgaW5kaXZpZHVhbCByZWN0cyAoc2Nyb2xsIGJhcilcblxuXG4gICAgICAgICAgbXVsdGlEcmFnRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAobXVsdGlEcmFnRWxlbWVudCkge1xuICAgICAgICAgICAgdW5zZXRSZWN0KG11bHRpRHJhZ0VsZW1lbnQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRvU29ydGFibGUuYW5pbWF0ZUFsbCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgbXVsdGlEcmFnU29ydGFibGUgPSB0b1NvcnRhYmxlO1xuICAgICAgfSAvLyBSZW1vdmUgY2xvbmVzIGlmIG5lY2Vzc2FyeVxuXG5cbiAgICAgIGlmIChyb290RWwgPT09IHBhcmVudEVsIHx8IHB1dFNvcnRhYmxlICYmIHB1dFNvcnRhYmxlLmxhc3RQdXRNb2RlICE9PSAnY2xvbmUnKSB7XG4gICAgICAgIG11bHRpRHJhZ0Nsb25lcy5mb3JFYWNoKGZ1bmN0aW9uIChjbG9uZSkge1xuICAgICAgICAgIGNsb25lLnBhcmVudE5vZGUgJiYgY2xvbmUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChjbG9uZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgbnVsbGluZ0dsb2JhbDogZnVuY3Rpb24gbnVsbGluZ0dsb2JhbCgpIHtcbiAgICAgIHRoaXMuaXNNdWx0aURyYWcgPSBkcmFnU3RhcnRlZCA9IGZhbHNlO1xuICAgICAgbXVsdGlEcmFnQ2xvbmVzLmxlbmd0aCA9IDA7XG4gICAgfSxcbiAgICBkZXN0cm95R2xvYmFsOiBmdW5jdGlvbiBkZXN0cm95R2xvYmFsKCkge1xuICAgICAgdGhpcy5fZGVzZWxlY3RNdWx0aURyYWcoKTtcblxuICAgICAgb2ZmKGRvY3VtZW50LCAncG9pbnRlcnVwJywgdGhpcy5fZGVzZWxlY3RNdWx0aURyYWcpO1xuICAgICAgb2ZmKGRvY3VtZW50LCAnbW91c2V1cCcsIHRoaXMuX2Rlc2VsZWN0TXVsdGlEcmFnKTtcbiAgICAgIG9mZihkb2N1bWVudCwgJ3RvdWNoZW5kJywgdGhpcy5fZGVzZWxlY3RNdWx0aURyYWcpO1xuICAgICAgb2ZmKGRvY3VtZW50LCAna2V5ZG93bicsIHRoaXMuX2NoZWNrS2V5RG93bik7XG4gICAgICBvZmYoZG9jdW1lbnQsICdrZXl1cCcsIHRoaXMuX2NoZWNrS2V5VXApO1xuICAgIH0sXG4gICAgX2Rlc2VsZWN0TXVsdGlEcmFnOiBmdW5jdGlvbiBfZGVzZWxlY3RNdWx0aURyYWcoZXZ0KSB7XG4gICAgICBpZiAodHlwZW9mIGRyYWdTdGFydGVkICE9PSBcInVuZGVmaW5lZFwiICYmIGRyYWdTdGFydGVkKSByZXR1cm47IC8vIE9ubHkgZGVzZWxlY3QgaWYgc2VsZWN0aW9uIGlzIGluIHRoaXMgc29ydGFibGVcblxuICAgICAgaWYgKG11bHRpRHJhZ1NvcnRhYmxlICE9PSB0aGlzLnNvcnRhYmxlKSByZXR1cm47IC8vIE9ubHkgZGVzZWxlY3QgaWYgdGFyZ2V0IGlzIG5vdCBpdGVtIGluIHRoaXMgc29ydGFibGVcblxuICAgICAgaWYgKGV2dCAmJiBjbG9zZXN0KGV2dC50YXJnZXQsIHRoaXMub3B0aW9ucy5kcmFnZ2FibGUsIHRoaXMuc29ydGFibGUuZWwsIGZhbHNlKSkgcmV0dXJuOyAvLyBPbmx5IGRlc2VsZWN0IGlmIGxlZnQgY2xpY2tcblxuICAgICAgaWYgKGV2dCAmJiBldnQuYnV0dG9uICE9PSAwKSByZXR1cm47XG5cbiAgICAgIHdoaWxlIChtdWx0aURyYWdFbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGVsID0gbXVsdGlEcmFnRWxlbWVudHNbMF07XG4gICAgICAgIHRvZ2dsZUNsYXNzKGVsLCB0aGlzLm9wdGlvbnMuc2VsZWN0ZWRDbGFzcywgZmFsc2UpO1xuICAgICAgICBtdWx0aURyYWdFbGVtZW50cy5zaGlmdCgpO1xuICAgICAgICBkaXNwYXRjaEV2ZW50KHtcbiAgICAgICAgICBzb3J0YWJsZTogdGhpcy5zb3J0YWJsZSxcbiAgICAgICAgICByb290RWw6IHRoaXMuc29ydGFibGUuZWwsXG4gICAgICAgICAgbmFtZTogJ2Rlc2VsZWN0JyxcbiAgICAgICAgICB0YXJnZXRFbDogZWwsXG4gICAgICAgICAgb3JpZ2luYWxFdnQ6IGV2dFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIF9jaGVja0tleURvd246IGZ1bmN0aW9uIF9jaGVja0tleURvd24oZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmtleSA9PT0gdGhpcy5vcHRpb25zLm11bHRpRHJhZ0tleSkge1xuICAgICAgICB0aGlzLm11bHRpRHJhZ0tleURvd24gPSB0cnVlO1xuICAgICAgfVxuICAgIH0sXG4gICAgX2NoZWNrS2V5VXA6IGZ1bmN0aW9uIF9jaGVja0tleVVwKGV2dCkge1xuICAgICAgaWYgKGV2dC5rZXkgPT09IHRoaXMub3B0aW9ucy5tdWx0aURyYWdLZXkpIHtcbiAgICAgICAgdGhpcy5tdWx0aURyYWdLZXlEb3duID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICByZXR1cm4gX2V4dGVuZHMoTXVsdGlEcmFnLCB7XG4gICAgLy8gU3RhdGljIG1ldGhvZHMgJiBwcm9wZXJ0aWVzXG4gICAgcGx1Z2luTmFtZTogJ211bHRpRHJhZycsXG4gICAgdXRpbHM6IHtcbiAgICAgIC8qKlxuICAgICAgICogU2VsZWN0cyB0aGUgcHJvdmlkZWQgbXVsdGktZHJhZyBpdGVtXG4gICAgICAgKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWwgICAgVGhlIGVsZW1lbnQgdG8gYmUgc2VsZWN0ZWRcbiAgICAgICAqL1xuICAgICAgc2VsZWN0OiBmdW5jdGlvbiBzZWxlY3QoZWwpIHtcbiAgICAgICAgdmFyIHNvcnRhYmxlID0gZWwucGFyZW50Tm9kZVtleHBhbmRvXTtcbiAgICAgICAgaWYgKCFzb3J0YWJsZSB8fCAhc29ydGFibGUub3B0aW9ucy5tdWx0aURyYWcgfHwgfm11bHRpRHJhZ0VsZW1lbnRzLmluZGV4T2YoZWwpKSByZXR1cm47XG5cbiAgICAgICAgaWYgKG11bHRpRHJhZ1NvcnRhYmxlICYmIG11bHRpRHJhZ1NvcnRhYmxlICE9PSBzb3J0YWJsZSkge1xuICAgICAgICAgIG11bHRpRHJhZ1NvcnRhYmxlLm11bHRpRHJhZy5fZGVzZWxlY3RNdWx0aURyYWcoKTtcblxuICAgICAgICAgIG11bHRpRHJhZ1NvcnRhYmxlID0gc29ydGFibGU7XG4gICAgICAgIH1cblxuICAgICAgICB0b2dnbGVDbGFzcyhlbCwgc29ydGFibGUub3B0aW9ucy5zZWxlY3RlZENsYXNzLCB0cnVlKTtcbiAgICAgICAgbXVsdGlEcmFnRWxlbWVudHMucHVzaChlbCk7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIERlc2VsZWN0cyB0aGUgcHJvdmlkZWQgbXVsdGktZHJhZyBpdGVtXG4gICAgICAgKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWwgICAgVGhlIGVsZW1lbnQgdG8gYmUgZGVzZWxlY3RlZFxuICAgICAgICovXG4gICAgICBkZXNlbGVjdDogZnVuY3Rpb24gZGVzZWxlY3QoZWwpIHtcbiAgICAgICAgdmFyIHNvcnRhYmxlID0gZWwucGFyZW50Tm9kZVtleHBhbmRvXSxcbiAgICAgICAgICAgIGluZGV4ID0gbXVsdGlEcmFnRWxlbWVudHMuaW5kZXhPZihlbCk7XG4gICAgICAgIGlmICghc29ydGFibGUgfHwgIXNvcnRhYmxlLm9wdGlvbnMubXVsdGlEcmFnIHx8ICF+aW5kZXgpIHJldHVybjtcbiAgICAgICAgdG9nZ2xlQ2xhc3MoZWwsIHNvcnRhYmxlLm9wdGlvbnMuc2VsZWN0ZWRDbGFzcywgZmFsc2UpO1xuICAgICAgICBtdWx0aURyYWdFbGVtZW50cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZXZlbnRQcm9wZXJ0aWVzOiBmdW5jdGlvbiBldmVudFByb3BlcnRpZXMoKSB7XG4gICAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgICAgdmFyIG9sZEluZGljaWVzID0gW10sXG4gICAgICAgICAgbmV3SW5kaWNpZXMgPSBbXTtcbiAgICAgIG11bHRpRHJhZ0VsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKG11bHRpRHJhZ0VsZW1lbnQpIHtcbiAgICAgICAgb2xkSW5kaWNpZXMucHVzaCh7XG4gICAgICAgICAgbXVsdGlEcmFnRWxlbWVudDogbXVsdGlEcmFnRWxlbWVudCxcbiAgICAgICAgICBpbmRleDogbXVsdGlEcmFnRWxlbWVudC5zb3J0YWJsZUluZGV4XG4gICAgICAgIH0pOyAvLyBtdWx0aURyYWdFbGVtZW50cyB3aWxsIGFscmVhZHkgYmUgc29ydGVkIGlmIGZvbGRpbmdcblxuICAgICAgICB2YXIgbmV3SW5kZXg7XG5cbiAgICAgICAgaWYgKGZvbGRpbmcgJiYgbXVsdGlEcmFnRWxlbWVudCAhPT0gZHJhZ0VsJDEpIHtcbiAgICAgICAgICBuZXdJbmRleCA9IC0xO1xuICAgICAgICB9IGVsc2UgaWYgKGZvbGRpbmcpIHtcbiAgICAgICAgICBuZXdJbmRleCA9IGluZGV4KG11bHRpRHJhZ0VsZW1lbnQsICc6bm90KC4nICsgX3RoaXMzLm9wdGlvbnMuc2VsZWN0ZWRDbGFzcyArICcpJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3SW5kZXggPSBpbmRleChtdWx0aURyYWdFbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIG5ld0luZGljaWVzLnB1c2goe1xuICAgICAgICAgIG11bHRpRHJhZ0VsZW1lbnQ6IG11bHRpRHJhZ0VsZW1lbnQsXG4gICAgICAgICAgaW5kZXg6IG5ld0luZGV4XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpdGVtczogX3RvQ29uc3VtYWJsZUFycmF5KG11bHRpRHJhZ0VsZW1lbnRzKSxcbiAgICAgICAgY2xvbmVzOiBbXS5jb25jYXQobXVsdGlEcmFnQ2xvbmVzKSxcbiAgICAgICAgb2xkSW5kaWNpZXM6IG9sZEluZGljaWVzLFxuICAgICAgICBuZXdJbmRpY2llczogbmV3SW5kaWNpZXNcbiAgICAgIH07XG4gICAgfSxcbiAgICBvcHRpb25MaXN0ZW5lcnM6IHtcbiAgICAgIG11bHRpRHJhZ0tleTogZnVuY3Rpb24gbXVsdGlEcmFnS2V5KGtleSkge1xuICAgICAgICBrZXkgPSBrZXkudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICBpZiAoa2V5ID09PSAnY3RybCcpIHtcbiAgICAgICAgICBrZXkgPSAnQ29udHJvbCc7XG4gICAgICAgIH0gZWxzZSBpZiAoa2V5Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICBrZXkgPSBrZXkuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBrZXkuc3Vic3RyKDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRNdWx0aURyYWdFbGVtZW50cyhjbG9uZXNJbnNlcnRlZCwgcm9vdEVsKSB7XG4gIG11bHRpRHJhZ0VsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKG11bHRpRHJhZ0VsZW1lbnQsIGkpIHtcbiAgICB2YXIgdGFyZ2V0ID0gcm9vdEVsLmNoaWxkcmVuW211bHRpRHJhZ0VsZW1lbnQuc29ydGFibGVJbmRleCArIChjbG9uZXNJbnNlcnRlZCA/IE51bWJlcihpKSA6IDApXTtcblxuICAgIGlmICh0YXJnZXQpIHtcbiAgICAgIHJvb3RFbC5pbnNlcnRCZWZvcmUobXVsdGlEcmFnRWxlbWVudCwgdGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcm9vdEVsLmFwcGVuZENoaWxkKG11bHRpRHJhZ0VsZW1lbnQpO1xuICAgIH1cbiAgfSk7XG59XG4vKipcbiAqIEluc2VydCBtdWx0aS1kcmFnIGNsb25lc1xuICogQHBhcmFtICB7W0Jvb2xlYW5dfSBlbGVtZW50c0luc2VydGVkICBXaGV0aGVyIHRoZSBtdWx0aS1kcmFnIGVsZW1lbnRzIGFyZSBpbnNlcnRlZFxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IHJvb3RFbFxuICovXG5cblxuZnVuY3Rpb24gaW5zZXJ0TXVsdGlEcmFnQ2xvbmVzKGVsZW1lbnRzSW5zZXJ0ZWQsIHJvb3RFbCkge1xuICBtdWx0aURyYWdDbG9uZXMuZm9yRWFjaChmdW5jdGlvbiAoY2xvbmUsIGkpIHtcbiAgICB2YXIgdGFyZ2V0ID0gcm9vdEVsLmNoaWxkcmVuW2Nsb25lLnNvcnRhYmxlSW5kZXggKyAoZWxlbWVudHNJbnNlcnRlZCA/IE51bWJlcihpKSA6IDApXTtcblxuICAgIGlmICh0YXJnZXQpIHtcbiAgICAgIHJvb3RFbC5pbnNlcnRCZWZvcmUoY2xvbmUsIHRhcmdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvb3RFbC5hcHBlbmRDaGlsZChjbG9uZSk7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlTXVsdGlEcmFnRWxlbWVudHMoKSB7XG4gIG11bHRpRHJhZ0VsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKG11bHRpRHJhZ0VsZW1lbnQpIHtcbiAgICBpZiAobXVsdGlEcmFnRWxlbWVudCA9PT0gZHJhZ0VsJDEpIHJldHVybjtcbiAgICBtdWx0aURyYWdFbGVtZW50LnBhcmVudE5vZGUgJiYgbXVsdGlEcmFnRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG11bHRpRHJhZ0VsZW1lbnQpO1xuICB9KTtcbn1cblxuU29ydGFibGUubW91bnQobmV3IEF1dG9TY3JvbGxQbHVnaW4oKSk7XG5Tb3J0YWJsZS5tb3VudChSZW1vdmUsIFJldmVydCk7XG5cbmV4cG9ydCBkZWZhdWx0IFNvcnRhYmxlO1xuZXhwb3J0IHsgTXVsdGlEcmFnUGx1Z2luIGFzIE11bHRpRHJhZywgU29ydGFibGUsIFN3YXBQbHVnaW4gYXMgU3dhcCB9O1xuIiwiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxyXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICAgICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY3JlYXRlQmluZGluZyhvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXlzKCkge1xyXG4gICAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciByID0gQXJyYXkocyksIGsgPSAwLCBpID0gMDsgaSA8IGlsOyBpKyspXHJcbiAgICAgICAgZm9yICh2YXIgYSA9IGFyZ3VtZW50c1tpXSwgaiA9IDAsIGpsID0gYS5sZW5ndGg7IGogPCBqbDsgaisrLCBrKyspXHJcbiAgICAgICAgICAgIHJba10gPSBhW2pdO1xyXG4gICAgcmV0dXJuIHI7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSByZXN1bHRba10gPSBtb2Rba107XHJcbiAgICByZXN1bHQuZGVmYXVsdCA9IG1vZDtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgcHJpdmF0ZU1hcCkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIGdldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBwcml2YXRlTWFwLmdldChyZWNlaXZlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBwcml2YXRlTWFwLCB2YWx1ZSkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIHNldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHByaXZhdGVNYXAuc2V0KHJlY2VpdmVyLCB2YWx1ZSk7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn1cclxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwib2JzaWRpYW5cIik7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IE1hcmtkb3duUG9zdFByb2Nlc3NvckNvbnRleHQsIE1hcmtkb3duVmlldywgUGx1Z2luIH0gZnJvbSBcIm9ic2lkaWFuXCI7XHJcblxyXG5pbXBvcnQgXCIuL2Fzc2V0cy9zdHlsZXMuY3NzXCI7XHJcblxyXG5pbXBvcnQgU29ydGFibGUgZnJvbSBcInNvcnRhYmxlanNcIjtcclxuXHJcbmRlY2xhcmUgbW9kdWxlIFwib2JzaWRpYW5cIiB7XHJcbiAgICBpbnRlcmZhY2UgVmlldyB7XHJcbiAgICAgICAgZmlsZTogVEZpbGU7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmxvY2tEcmFnZ2luZyBleHRlbmRzIFBsdWdpbiB7XHJcbiAgICBtYXA6IE1hcDxIVE1MRWxlbWVudCwgTWFya2Rvd25Qb3N0UHJvY2Vzc29yQ29udGV4dD4gPSBuZXcgTWFwKCk7XHJcbiAgICBhc3luYyBvbmxvYWQoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJMb2FkaW5nIEJsb2NrIERyYWdnaW5nIHZcIiArIHRoaXMubWFuaWZlc3QudmVyc2lvbik7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcclxuXHJcbiAgICAgICAgdGhpcy5yZWdpc3Rlck1hcmtkb3duUG9zdFByb2Nlc3NvcihcclxuICAgICAgICAgICAgYXN5bmMgKGVsLCBjdHgpID0+IGF3YWl0IHRoaXMucG9zdHByb2Nlc3NvcihlbCwgY3R4KVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlckV2ZW50KFxyXG4gICAgICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJhY3RpdmUtbGVhZi1jaGFuZ2VcIiwgKGxlYWYpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghbGVhZi52aWV3IHx8ICEobGVhZi52aWV3IGluc3RhbmNlb2YgTWFya2Rvd25WaWV3KSkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICBpZiAoIWxlYWYudmlldy5jb250YWluZXJFbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB7IGNvbnRhaW5lckVsIH0gPSBsZWFmLnZpZXc7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobGlzdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgbXV0YXRpb24gb2YgbGlzdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtdXRhdGlvbi50eXBlID09PSBcImNoaWxkTGlzdFwiICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtdXRhdGlvbi5yZW1vdmVkTm9kZXMubGVuZ3RoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXAuZGVsZXRlKGNvbnRhaW5lckVsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIG9ic2VydmVyLm9ic2VydmUoY29udGFpbmVyRWwucGFyZW50RWxlbWVudCwge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBzdWJ0cmVlOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLm1hcC5oYXMoY29udGFpbmVyRWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXAuc2V0KGNvbnRhaW5lckVsLCB1bmRlZmluZWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2l6ZXIgPSBjb250YWluZXJFbC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICAgICAgICAgICAgICAgIFwiLm1hcmtkb3duLXByZXZpZXctc2l6ZXJcIlxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIGlmICghc2l6ZXIgfHwgIShzaXplciBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBsaXN0OiBOb2RlTGlzdE9mPEhUTUxEaXZFbGVtZW50PiA9IHNpemVyLnF1ZXJ5U2VsZWN0b3JBbGwoXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkaXYuYmxvY2stZHJhZy1wbHVnaW4tZHJhZ2dhYmxlLWVsZW1lbnRcIlxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNvcnQgPSBuZXcgU29ydGFibGUoc2l6ZXIsIHtcclxuICAgICAgICAgICAgICAgICAgICBkcmFnZ2FibGU6IFwiZGl2LmJsb2NrLWRyYWctcGx1Z2luLWRyYWdnYWJsZS1lbGVtZW50XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiBcIi5jb2xsYXBzZS1pbmRpY2F0b3JcIixcclxuICAgICAgICAgICAgICAgICAgICBoYW5kbGU6IFwiLmJsb2NrLWRyYWctcGx1Z2luLWhhbmRsZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlbGF5T25Ub3VjaE9ubHk6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVsYXk6IDEwMCxcclxuICAgICAgICAgICAgICAgICAgICBjaG9zZW5DbGFzczogXCJibG9jay1kcmFnLXBsdWdpbi1jaG9zZW5cIixcclxuICAgICAgICAgICAgICAgICAgICBnaG9zdENsYXNzOiBcImJsb2NrLWRyYWctcGx1Z2luLWdob3N0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgb25FbmQ6IGFzeW5jIChldnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlbW92ZWQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZmlsZVRleHQgPSAoYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZChmaWxlKSkuc3BsaXQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlxcblwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5tYXAuZ2V0KGNvbnRhaW5lckVsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbXlTZWN0aW9uID0gY29udGV4dC5nZXRTZWN0aW9uSW5mbyhldnQuaXRlbSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL215IHRleHQgc2hvdWxkIGFsc28gaW5jbHVkZSBteSBuZXdsaW5lc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBteU5ld0xpbmVzID0gdGhpcy5nZXROZXdsaW5lc0FmdGVySW5kZXgoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlVGV4dCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG15U2VjdGlvbi5saW5lRW5kXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBteVN0YXJ0ID0gbXlTZWN0aW9uLmxpbmVTdGFydDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbXlFbmQgPSBteVNlY3Rpb24ubGluZUVuZCArIG15TmV3TGluZXMgKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBteVRleHQgPSBmaWxlVGV4dC5zbGljZShteVN0YXJ0LCBteUVuZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlVGV4dCA9IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmZpbGVUZXh0LnNsaWNlKDAsIG15U3RhcnQpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uZmlsZVRleHQuc2xpY2UobXlFbmQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiogVGhlIGxpc3Qgd2lsbCByZXR1cm4gdGhlIGVsZW1lbnQgYmVmb3JlIHRoZSBkcmFnZ2VkIGl0ZW0gaWYgaXQgZ29lcyBmb3J3YXJkLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpV2VudEZvcndhcmQgPSBldnQubmV3SW5kZXggPiBldnQub2xkSW5kZXg7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVkICs9IChteUVuZCAtIG15U3RhcnQpICogTnVtYmVyKGlXZW50Rm9yd2FyZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlbGVtZW50SUFtTm93QmVmb3JlID0gbGlzdC5pdGVtKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZ0Lm5ld0RyYWdnYWJsZUluZGV4ICsgTnVtYmVyKGlXZW50Rm9yd2FyZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3U2VjdGlvbiA9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmdldFNlY3Rpb25JbmZvKGVsZW1lbnRJQW1Ob3dCZWZvcmUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFuZXdTZWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlVGV4dC5wdXNoKC4uLm15VGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5tb2RpZnkoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlVGV4dC5qb2luKFwiXFxuXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlVGV4dCA9IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmZpbGVUZXh0LnNsaWNlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U2VjdGlvbi5saW5lU3RhcnQgLSByZW1vdmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4ubXlUZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uZmlsZVRleHQuc2xpY2UobmV3U2VjdGlvbi5saW5lU3RhcnQgLSByZW1vdmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZmlsZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5tb2RpZnkoZmlsZSwgZmlsZVRleHQuam9pbihcIlxcblwiKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBvblN0YXJ0KCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0ID0gc2l6ZXIucXVlcnlTZWxlY3RvckFsbChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGl2LmJsb2NrLWRyYWctcGx1Z2luLWRyYWdnYWJsZS1lbGVtZW50XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGdldE5ld2xpbmVzQWZ0ZXJJbmRleCh0ZXh0OiBzdHJpbmdbXSwgaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHRvU2VhcmNoID0gdGV4dC5zbGljZShpbmRleCArIDEpO1xyXG4gICAgICAgIGNvbnN0IGZpbmRJbmRleCA9IHRvU2VhcmNoLmZpbmRJbmRleCgobGluZSkgPT4gbGluZS5sZW5ndGgpO1xyXG5cclxuICAgICAgICByZXR1cm4gZmluZEluZGV4IDwgMCA/IHRvU2VhcmNoPy5sZW5ndGggPz8gMCA6IGZpbmRJbmRleDtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBwb3N0cHJvY2Vzc29yKGVsOiBIVE1MRWxlbWVudCwgY3R4OiBNYXJrZG93blBvc3RQcm9jZXNzb3JDb250ZXh0KSB7XHJcbiAgICAgICAgaWYgKCFlbC5jaGlsZEVsZW1lbnRDb3VudCkgcmV0dXJuO1xyXG4gICAgICAgIGlmIChlbC5xdWVyeVNlbGVjdG9yKFwic2VjdGlvbi5mb290bm90ZXNcIikpIHJldHVybjtcclxuICAgICAgICBpZiAoZWwucXVlcnlTZWxlY3RvcihcIi5mcm9udG1hdHRlclwiKSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcclxuICAgICAgICBpZiAoIXZpZXcpIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAhdGhpcy5tYXAuaGFzKHZpZXcuY29udGFpbmVyRWwpIHx8XHJcbiAgICAgICAgICAgIHRoaXMubWFwLmdldCh2aWV3LmNvbnRhaW5lckVsKSA9PT0gdW5kZWZpbmVkXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHRoaXMubWFwLnNldCh2aWV3LmNvbnRhaW5lckVsLCBjdHgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbC5hZGRDbGFzcyhcImJsb2NrLWRyYWctcGx1Z2luLWRyYWdnYWJsZS1lbGVtZW50XCIpO1xyXG4gICAgICAgIGVsLmNyZWF0ZVNwYW4oe1xyXG4gICAgICAgICAgICBjbHM6IFwiYmxvY2stZHJhZy1wbHVnaW4taGFuZGxlXCIsXHJcbiAgICAgICAgICAgIHRleHQ6IFwi4ouu4ouuXCJcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBvbnVubG9hZCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlVubG9hZGluZyBCbG9jayBEcmFnZ2luZ1wiKTtcclxuICAgIH1cclxuICAgIGFzeW5jIGxvYWRTZXR0aW5ncygpIHt9XHJcbiAgICBhc3luYyBzYXZlU2V0dGluZ3MoKSB7fVxyXG59XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==