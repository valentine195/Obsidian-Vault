'use strict';

var obsidian = require('obsidian');
var child_process = require('child_process');
var util = require('util');
var fs = require('fs');
var path = require('path');

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var path__namespace = /*#__PURE__*/_interopNamespace(path);

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

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function log_error(e) {
    const notice = new obsidian.Notice("", 8000);
    if (e instanceof TemplaterError && e.console_msg) {
        // TODO: Find a better way for this
        // @ts-ignore
        notice.noticeEl.innerHTML = `<b>Templater Error</b>:<br/>${e.message}<br/>Check console for more informations`;
        console.error(`Templater Error:`, e.message, "\n", e.console_msg);
    }
    else {
        // @ts-ignore
        notice.noticeEl.innerHTML = `<b>Templater Error</b>:<br/>${e.message}`;
    }
}

class TemplaterError extends Error {
    constructor(msg, console_msg) {
        super(msg);
        this.console_msg = console_msg;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
function errorWrapper(fn, msg) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield fn();
        }
        catch (e) {
            if (!(e instanceof TemplaterError)) {
                log_error(new TemplaterError(msg, e.message));
            }
            else {
                log_error(e);
            }
            return null;
        }
    });
}
function errorWrapperSync(fn, msg) {
    try {
        return fn();
    }
    catch (e) {
        log_error(new TemplaterError(msg, e.message));
        return null;
    }
}

var top = 'top';
var bottom = 'bottom';
var right = 'right';
var left = 'left';
var auto = 'auto';
var basePlacements = [top, bottom, right, left];
var start = 'start';
var end = 'end';
var clippingParents = 'clippingParents';
var viewport = 'viewport';
var popper = 'popper';
var reference = 'reference';
var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []); // modifiers that need to read the DOM

var beforeRead = 'beforeRead';
var read = 'read';
var afterRead = 'afterRead'; // pure-logic modifiers

var beforeMain = 'beforeMain';
var main = 'main';
var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

var beforeWrite = 'beforeWrite';
var write = 'write';
var afterWrite = 'afterWrite';
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

function getNodeName(element) {
  return element ? (element.nodeName || '').toLowerCase() : null;
}

function getWindow(node) {
  if (node == null) {
    return window;
  }

  if (node.toString() !== '[object Window]') {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }

  return node;
}

function isElement(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}

function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}

function isShadowRoot(node) {
  // IE 11 has no ShadowRoot
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }

  var OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}

// and applies them to the HTMLElements such as popper and arrow

function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function (name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name]; // arrow is optional + virtual elements

    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    } // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowFixMe[cannot-write]


    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function (name) {
      var value = attributes[name];

      if (value === false) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value === true ? '' : value);
      }
    });
  });
}

function effect$2(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: '0',
      top: '0',
      margin: '0'
    },
    arrow: {
      position: 'absolute'
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;

  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }

  return function () {
    Object.keys(state.elements).forEach(function (name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

      var style = styleProperties.reduce(function (style, property) {
        style[property] = '';
        return style;
      }, {}); // arrow is optional + virtual elements

      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }

      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
} // eslint-disable-next-line import/no-unused-modules


var applyStyles$1 = {
  name: 'applyStyles',
  enabled: true,
  phase: 'write',
  fn: applyStyles,
  effect: effect$2,
  requires: ['computeStyles']
};

function getBasePlacement(placement) {
  return placement.split('-')[0];
}

var round$1 = Math.round;
function getBoundingClientRect(element, includeScale) {
  if (includeScale === void 0) {
    includeScale = false;
  }

  var rect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;

  if (isHTMLElement(element) && includeScale) {
    var offsetHeight = element.offsetHeight;
    var offsetWidth = element.offsetWidth; // Do not attempt to divide by 0, otherwise we get `Infinity` as scale
    // Fallback to 1 in case both values are `0`

    if (offsetWidth > 0) {
      scaleX = rect.width / offsetWidth || 1;
    }

    if (offsetHeight > 0) {
      scaleY = rect.height / offsetHeight || 1;
    }
  }

  return {
    width: round$1(rect.width / scaleX),
    height: round$1(rect.height / scaleY),
    top: round$1(rect.top / scaleY),
    right: round$1(rect.right / scaleX),
    bottom: round$1(rect.bottom / scaleY),
    left: round$1(rect.left / scaleX),
    x: round$1(rect.left / scaleX),
    y: round$1(rect.top / scaleY)
  };
}

// means it doesn't take into account transforms.

function getLayoutRect(element) {
  var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
  // Fixes https://github.com/popperjs/popper-core/issues/1223

  var width = element.offsetWidth;
  var height = element.offsetHeight;

  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }

  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }

  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: width,
    height: height
  };
}

function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

  if (parent.contains(child)) {
    return true;
  } // then fallback to custom implementation with Shadow DOM support
  else if (rootNode && isShadowRoot(rootNode)) {
      var next = child;

      do {
        if (next && parent.isSameNode(next)) {
          return true;
        } // $FlowFixMe[prop-missing]: need a better way to handle this...


        next = next.parentNode || next.host;
      } while (next);
    } // Give up, the result is false


  return false;
}

function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}

function isTableElement(element) {
  return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
}

function getDocumentElement(element) {
  // $FlowFixMe[incompatible-return]: assume body is always available
  return ((isElement(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
  element.document) || window.document).documentElement;
}

function getParentNode(element) {
  if (getNodeName(element) === 'html') {
    return element;
  }

  return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || ( // DOM Element detected
    isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    getDocumentElement(element) // fallback

  );
}

function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
  getComputedStyle(element).position === 'fixed') {
    return null;
  }

  return element.offsetParent;
} // `.offsetParent` reports `null` for fixed elements, while absolute elements
// return the containing block


function getContainingBlock(element) {
  var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
  var isIE = navigator.userAgent.indexOf('Trident') !== -1;

  if (isIE && isHTMLElement(element)) {
    // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
    var elementCss = getComputedStyle(element);

    if (elementCss.position === 'fixed') {
      return null;
    }
  }

  var currentNode = getParentNode(element);

  while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle(currentNode); // This is non-exhaustive but covers the most common CSS properties that
    // create a containing block.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }

  return null;
} // Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.


function getOffsetParent(element) {
  var window = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);

  while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent);
  }

  if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle(offsetParent).position === 'static')) {
    return window;
  }

  return offsetParent || getContainingBlock(element) || window;
}

function getMainAxisFromPlacement(placement) {
  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
}

var max = Math.max;
var min = Math.min;
var round = Math.round;

function within(min$1, value, max$1) {
  return max(min$1, min(value, max$1));
}

function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}

function expandToHashMap(value, keys) {
  return keys.reduce(function (hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}

var toPaddingObject = function toPaddingObject(padding, state) {
  padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
};

function arrow(_ref) {
  var _state$modifiersData$;

  var state = _ref.state,
      name = _ref.name,
      options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets = state.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement(state.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? 'height' : 'width';

  if (!arrowElement || !popperOffsets) {
    return;
  }

  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === 'y' ? top : left;
  var maxProp = axis === 'y' ? bottom : right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
  // outside of the popper bounds

  var min = paddingObject[minProp];
  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset = within(min, center, max); // Prevents breaking syntax highlighting...

  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}

function effect$1(_ref2) {
  var state = _ref2.state,
      options = _ref2.options;
  var _options$element = options.element,
      arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

  if (arrowElement == null) {
    return;
  } // CSS selector


  if (typeof arrowElement === 'string') {
    arrowElement = state.elements.popper.querySelector(arrowElement);

    if (!arrowElement) {
      return;
    }
  }

  if (process.env.NODE_ENV !== "production") {
    if (!isHTMLElement(arrowElement)) {
      console.error(['Popper: "arrow" element must be an HTMLElement (not an SVGElement).', 'To use an SVG arrow, wrap it in an HTMLElement that will be used as', 'the arrow.'].join(' '));
    }
  }

  if (!contains(state.elements.popper, arrowElement)) {
    if (process.env.NODE_ENV !== "production") {
      console.error(['Popper: "arrow" modifier\'s `element` must be a child of the popper', 'element.'].join(' '));
    }

    return;
  }

  state.elements.arrow = arrowElement;
} // eslint-disable-next-line import/no-unused-modules


var arrow$1 = {
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  effect: effect$1,
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow']
};

function getVariation(placement) {
  return placement.split('-')[1];
}

var unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto'
}; // Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.

function roundOffsetsByDPR(_ref) {
  var x = _ref.x,
      y = _ref.y;
  var win = window;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round(round(x * dpr) / dpr) || 0,
    y: round(round(y * dpr) / dpr) || 0
  };
}

function mapToStyles(_ref2) {
  var _Object$assign2;

  var popper = _ref2.popper,
      popperRect = _ref2.popperRect,
      placement = _ref2.placement,
      variation = _ref2.variation,
      offsets = _ref2.offsets,
      position = _ref2.position,
      gpuAcceleration = _ref2.gpuAcceleration,
      adaptive = _ref2.adaptive,
      roundOffsets = _ref2.roundOffsets;

  var _ref3 = roundOffsets === true ? roundOffsetsByDPR(offsets) : typeof roundOffsets === 'function' ? roundOffsets(offsets) : offsets,
      _ref3$x = _ref3.x,
      x = _ref3$x === void 0 ? 0 : _ref3$x,
      _ref3$y = _ref3.y,
      y = _ref3$y === void 0 ? 0 : _ref3$y;

  var hasX = offsets.hasOwnProperty('x');
  var hasY = offsets.hasOwnProperty('y');
  var sideX = left;
  var sideY = top;
  var win = window;

  if (adaptive) {
    var offsetParent = getOffsetParent(popper);
    var heightProp = 'clientHeight';
    var widthProp = 'clientWidth';

    if (offsetParent === getWindow(popper)) {
      offsetParent = getDocumentElement(popper);

      if (getComputedStyle(offsetParent).position !== 'static' && position === 'absolute') {
        heightProp = 'scrollHeight';
        widthProp = 'scrollWidth';
      }
    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


    offsetParent = offsetParent;

    if (placement === top || (placement === left || placement === right) && variation === end) {
      sideY = bottom; // $FlowFixMe[prop-missing]

      y -= offsetParent[heightProp] - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (placement === left || (placement === top || placement === bottom) && variation === end) {
      sideX = right; // $FlowFixMe[prop-missing]

      x -= offsetParent[widthProp] - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }

  var commonStyles = Object.assign({
    position: position
  }, adaptive && unsetSides);

  if (gpuAcceleration) {
    var _Object$assign;

    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }

  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
}

function computeStyles(_ref4) {
  var state = _ref4.state,
      options = _ref4.options;
  var _options$gpuAccelerat = options.gpuAcceleration,
      gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
      _options$adaptive = options.adaptive,
      adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
      _options$roundOffsets = options.roundOffsets,
      roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;

  if (process.env.NODE_ENV !== "production") {
    var transitionProperty = getComputedStyle(state.elements.popper).transitionProperty || '';

    if (adaptive && ['transform', 'top', 'right', 'bottom', 'left'].some(function (property) {
      return transitionProperty.indexOf(property) >= 0;
    })) {
      console.warn(['Popper: Detected CSS transitions on at least one of the following', 'CSS properties: "transform", "top", "right", "bottom", "left".', '\n\n', 'Disable the "computeStyles" modifier\'s `adaptive` option to allow', 'for smooth transitions, or remove these properties from the CSS', 'transition declaration on the popper element if only transitioning', 'opacity or background-color for example.', '\n\n', 'We recommend using the popper element as a wrapper around an inner', 'element that can have any CSS property transitioned for animations.'].join(' '));
    }
  }

  var commonStyles = {
    placement: getBasePlacement(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration: gpuAcceleration
  };

  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive: adaptive,
      roundOffsets: roundOffsets
    })));
  }

  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: 'absolute',
      adaptive: false,
      roundOffsets: roundOffsets
    })));
  }

  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-placement': state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


var computeStyles$1 = {
  name: 'computeStyles',
  enabled: true,
  phase: 'beforeWrite',
  fn: computeStyles,
  data: {}
};

var passive = {
  passive: true
};

function effect(_ref) {
  var state = _ref.state,
      instance = _ref.instance,
      options = _ref.options;
  var _options$scroll = options.scroll,
      scroll = _options$scroll === void 0 ? true : _options$scroll,
      _options$resize = options.resize,
      resize = _options$resize === void 0 ? true : _options$resize;
  var window = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

  if (scroll) {
    scrollParents.forEach(function (scrollParent) {
      scrollParent.addEventListener('scroll', instance.update, passive);
    });
  }

  if (resize) {
    window.addEventListener('resize', instance.update, passive);
  }

  return function () {
    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.removeEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.removeEventListener('resize', instance.update, passive);
    }
  };
} // eslint-disable-next-line import/no-unused-modules


var eventListeners = {
  name: 'eventListeners',
  enabled: true,
  phase: 'write',
  fn: function fn() {},
  effect: effect,
  data: {}
};

var hash$1 = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash$1[matched];
  });
}

var hash = {
  start: 'end',
  end: 'start'
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function (matched) {
    return hash[matched];
  });
}

function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft: scrollLeft,
    scrollTop: scrollTop
  };
}

function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  // Popper 1 is broken in this case and never had a bug report so let's assume
  // it's not an issue. I don't think anyone ever specifies width on <html>
  // anyway.
  // Browsers where the left scrollbar doesn't cause an issue report `0` for
  // this (e.g. Edge 2019, IE11, Safari)
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}

function getViewportRect(element) {
  var win = getWindow(element);
  var html = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0; // NB: This isn't supported on iOS <= 12. If the keyboard is open, the popper
  // can be obscured underneath it.
  // Also, `html.clientHeight` adds the bottom bar height in Safari iOS, even
  // if it isn't open, so if this isn't available, the popper will be detected
  // to overflow the bottom of the screen too early.

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height; // Uses Layout Viewport (like Chrome; Safari does not currently)
    // In Chrome, it returns a value very close to 0 (+/-) but contains rounding
    // errors due to floating point numbers, so we need to check precision.
    // Safari returns a number <= 0, usually < -1 when pinch-zoomed
    // Feature detection fails in mobile emulation mode in Chrome.
    // Math.abs(win.innerWidth / visualViewport.scale - visualViewport.width) <
    // 0.001
    // Fallback here: "Not Safari" userAgent

    if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return {
    width: width,
    height: height,
    x: x + getWindowScrollBarX(element),
    y: y
  };
}

// of the `<html>` and `<body>` rect bounds if horizontally scrollable

function getDocumentRect(element) {
  var _element$ownerDocumen;

  var html = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y = -winScroll.scrollTop;

  if (getComputedStyle(body || html).direction === 'rtl') {
    x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }

  return {
    width: width,
    height: height,
    x: x,
    y: y
  };
}

function isScrollParent(element) {
  // Firefox wants us to check `-x` and `-y` variations as well
  var _getComputedStyle = getComputedStyle(element),
      overflow = _getComputedStyle.overflow,
      overflowX = _getComputedStyle.overflowX,
      overflowY = _getComputedStyle.overflowY;

  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

function getScrollParent(node) {
  if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return node.ownerDocument.body;
  }

  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }

  return getScrollParent(getParentNode(node));
}

/*
given a DOM element, return the list of all scroll parents, up the list of ancesors
until we get to the top window object. This list is what we attach scroll listeners
to, because if any of these parent elements scroll, we'll need to re-calculate the
reference element's position.
*/

function listScrollParents(element, list) {
  var _element$ownerDocumen;

  if (list === void 0) {
    list = [];
  }

  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
  updatedList.concat(listScrollParents(getParentNode(target)));
}

function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}

function getInnerBoundingClientRect(element) {
  var rect = getBoundingClientRect(element);
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}

function getClientRectFromMixedType(element, clippingParent) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isHTMLElement(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
} // A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`


function getClippingParents(element) {
  var clippingParents = listScrollParents(getParentNode(element));
  var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

  if (!isElement(clipperElement)) {
    return [];
  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


  return clippingParents.filter(function (clippingParent) {
    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
  });
} // Gets the maximum area that the element is visible in due to any number of
// clipping parents


function getClippingRect(element, boundary, rootBoundary) {
  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents[0];
  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}

function computeOffsets(_ref) {
  var reference = _ref.reference,
      element = _ref.element,
      placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference.x + reference.width / 2 - element.width / 2;
  var commonY = reference.y + reference.height / 2 - element.height / 2;
  var offsets;

  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference.y - element.height
      };
      break;

    case bottom:
      offsets = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;

    case right:
      offsets = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;

    case left:
      offsets = {
        x: reference.x - element.width,
        y: commonY
      };
      break;

    default:
      offsets = {
        x: reference.x,
        y: reference.y
      };
  }

  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

  if (mainAxis != null) {
    var len = mainAxis === 'y' ? 'height' : 'width';

    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
        break;

      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
        break;
    }
  }

  return offsets;
}

function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$placement = _options.placement,
      placement = _options$placement === void 0 ? state.placement : _options$placement,
      _options$boundary = _options.boundary,
      boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
      _options$rootBoundary = _options.rootBoundary,
      rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
      _options$elementConte = _options.elementContext,
      elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
      _options$altBoundary = _options.altBoundary,
      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
      _options$padding = _options.padding,
      padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
  var referenceClientRect = getBoundingClientRect(state.elements.reference);
  var popperOffsets = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement: placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
  // 0 or negative = within the clipping rect

  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

  if (elementContext === popper && offsetData) {
    var offset = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function (key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
      overflowOffsets[key] += offset[axis] * multiply;
    });
  }

  return overflowOffsets;
}

function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      placement = _options.placement,
      boundary = _options.boundary,
      rootBoundary = _options.rootBoundary,
      padding = _options.padding,
      flipVariations = _options.flipVariations,
      _options$allowedAutoP = _options.allowedAutoPlacements,
      allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
    return getVariation(placement) === variation;
  }) : basePlacements;
  var allowedPlacements = placements$1.filter(function (placement) {
    return allowedAutoPlacements.indexOf(placement) >= 0;
  });

  if (allowedPlacements.length === 0) {
    allowedPlacements = placements$1;

    if (process.env.NODE_ENV !== "production") {
      console.error(['Popper: The `allowedAutoPlacements` option did not allow any', 'placements. Ensure the `placement` option matches the variation', 'of the allowed placements.', 'For example, "auto" cannot be used to allow "bottom-start".', 'Use "auto-start" instead.'].join(' '));
    }
  } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


  var overflows = allowedPlacements.reduce(function (acc, placement) {
    acc[placement] = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding
    })[getBasePlacement(placement)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function (a, b) {
    return overflows[a] - overflows[b];
  });
}

function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement(placement) === auto) {
    return [];
  }

  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}

function flip(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;

  if (state.modifiersData[name]._skip) {
    return;
  }

  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
      specifiedFallbackPlacements = options.fallbackPlacements,
      padding = options.padding,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      _options$flipVariatio = options.flipVariations,
      flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
      allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
    return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      flipVariations: flipVariations,
      allowedAutoPlacements: allowedAutoPlacements
    }) : placement);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements[0];

  for (var i = 0; i < placements.length; i++) {
    var placement = placements[i];

    var _basePlacement = getBasePlacement(placement);

    var isStartVariation = getVariation(placement) === start;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? 'width' : 'height';
    var overflow = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      altBoundary: altBoundary,
      padding: padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }

    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];

    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }

    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }

    if (checks.every(function (check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }

    checksMap.set(placement, checks);
  }

  if (makeFallbackChecks) {
    // `2` may be desired in some cases – research later
    var numberOfChecks = flipVariations ? 3 : 1;

    var _loop = function _loop(_i) {
      var fittingPlacement = placements.find(function (placement) {
        var checks = checksMap.get(placement);

        if (checks) {
          return checks.slice(0, _i).every(function (check) {
            return check;
          });
        }
      });

      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };

    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);

      if (_ret === "break") break;
    }
  }

  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
} // eslint-disable-next-line import/no-unused-modules


var flip$1 = {
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requiresIfExists: ['offset'],
  data: {
    _skip: false
  }
};

function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }

  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}

function isAnySideFullyClipped(overflow) {
  return [top, right, bottom, left].some(function (side) {
    return overflow[side] >= 0;
  });
}

function hide(_ref) {
  var state = _ref.state,
      name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state, {
    elementContext: 'reference'
  });
  var popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets: referenceClippingOffsets,
    popperEscapeOffsets: popperEscapeOffsets,
    isReferenceHidden: isReferenceHidden,
    hasPopperEscaped: hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-reference-hidden': isReferenceHidden,
    'data-popper-escaped': hasPopperEscaped
  });
} // eslint-disable-next-line import/no-unused-modules


var hide$1 = {
  name: 'hide',
  enabled: true,
  phase: 'main',
  requiresIfExists: ['preventOverflow'],
  fn: hide
};

function distanceAndSkiddingToXY(placement, rects, offset) {
  var basePlacement = getBasePlacement(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
    placement: placement
  })) : offset,
      skidding = _ref[0],
      distance = _ref[1];

  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}

function offset(_ref2) {
  var state = _ref2.state,
      options = _ref2.options,
      name = _ref2.name;
  var _options$offset = options.offset,
      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = placements.reduce(function (acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement],
      x = _data$state$placement.x,
      y = _data$state$placement.y;

  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


var offset$1 = {
  name: 'offset',
  enabled: true,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: offset
};

function popperOffsets(_ref) {
  var state = _ref.state,
      name = _ref.name;
  // Offsets are the actual position the popper needs to have to be
  // properly positioned near its reference element
  // This is the most basic placement, and will be adjusted by
  // the modifiers in the next step
  state.modifiersData[name] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: 'absolute',
    placement: state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


var popperOffsets$1 = {
  name: 'popperOffsets',
  enabled: true,
  phase: 'read',
  fn: popperOffsets,
  data: {}
};

function getAltAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}

function preventOverflow(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;
  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      padding = options.padding,
      _options$tether = options.tether,
      tether = _options$tether === void 0 ? true : _options$tether,
      _options$tetherOffset = options.tetherOffset,
      tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary: boundary,
    rootBoundary: rootBoundary,
    padding: padding,
    altBoundary: altBoundary
  });
  var basePlacement = getBasePlacement(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var data = {
    x: 0,
    y: 0
  };

  if (!popperOffsets) {
    return;
  }

  if (checkMainAxis || checkAltAxis) {
    var mainSide = mainAxis === 'y' ? top : left;
    var altSide = mainAxis === 'y' ? bottom : right;
    var len = mainAxis === 'y' ? 'height' : 'width';
    var offset = popperOffsets[mainAxis];
    var min$1 = popperOffsets[mainAxis] + overflow[mainSide];
    var max$1 = popperOffsets[mainAxis] - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
    // outside the reference bounds

    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
    // to include its full size in the calculation. If the reference is small
    // and near the edge of a boundary, the popper can overflow even if the
    // reference is not overflowing as well (e.g. virtual elements with no
    // width or height)

    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - tetherOffsetValue : minLen - arrowLen - arrowPaddingMin - tetherOffsetValue;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + tetherOffsetValue : maxLen + arrowLen + arrowPaddingMax + tetherOffsetValue;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = state.modifiersData.offset ? state.modifiersData.offset[state.placement][mainAxis] : 0;
    var tetherMin = popperOffsets[mainAxis] + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = popperOffsets[mainAxis] + maxOffset - offsetModifierValue;

    if (checkMainAxis) {
      var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
      popperOffsets[mainAxis] = preventedOffset;
      data[mainAxis] = preventedOffset - offset;
    }

    if (checkAltAxis) {
      var _mainSide = mainAxis === 'x' ? top : left;

      var _altSide = mainAxis === 'x' ? bottom : right;

      var _offset = popperOffsets[altAxis];

      var _min = _offset + overflow[_mainSide];

      var _max = _offset - overflow[_altSide];

      var _preventedOffset = within(tether ? min(_min, tetherMin) : _min, _offset, tether ? max(_max, tetherMax) : _max);

      popperOffsets[altAxis] = _preventedOffset;
      data[altAxis] = _preventedOffset - _offset;
    }
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


var preventOverflow$1 = {
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requiresIfExists: ['offset']
};

function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}

function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}

function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = rect.width / element.offsetWidth || 1;
  var scaleY = rect.height / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
} // Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.


function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }

  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };

  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
    isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }

    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

function order(modifiers) {
  var map = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function (modifier) {
    map.set(modifier.name, modifier);
  }); // On visiting object, check for its dependencies and visit them recursively

  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function (dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);

        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }

  modifiers.forEach(function (modifier) {
    if (!visited.has(modifier.name)) {
      // check for visited object
      sort(modifier);
    }
  });
  return result;
}

function orderModifiers(modifiers) {
  // order based on dependencies
  var orderedModifiers = order(modifiers); // order based on phase

  return modifierPhases.reduce(function (acc, phase) {
    return acc.concat(orderedModifiers.filter(function (modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}

function debounce(fn) {
  var pending;
  return function () {
    if (!pending) {
      pending = new Promise(function (resolve) {
        Promise.resolve().then(function () {
          pending = undefined;
          resolve(fn());
        });
      });
    }

    return pending;
  };
}

function format(str) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return [].concat(args).reduce(function (p, c) {
    return p.replace(/%s/, c);
  }, str);
}

var INVALID_MODIFIER_ERROR = 'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s';
var MISSING_DEPENDENCY_ERROR = 'Popper: modifier "%s" requires "%s", but "%s" modifier is not available';
var VALID_PROPERTIES = ['name', 'enabled', 'phase', 'fn', 'effect', 'requires', 'options'];
function validateModifiers(modifiers) {
  modifiers.forEach(function (modifier) {
    [].concat(Object.keys(modifier), VALID_PROPERTIES) // IE11-compatible replacement for `new Set(iterable)`
    .filter(function (value, index, self) {
      return self.indexOf(value) === index;
    }).forEach(function (key) {
      switch (key) {
        case 'name':
          if (typeof modifier.name !== 'string') {
            console.error(format(INVALID_MODIFIER_ERROR, String(modifier.name), '"name"', '"string"', "\"" + String(modifier.name) + "\""));
          }

          break;

        case 'enabled':
          if (typeof modifier.enabled !== 'boolean') {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"enabled"', '"boolean"', "\"" + String(modifier.enabled) + "\""));
          }

          break;

        case 'phase':
          if (modifierPhases.indexOf(modifier.phase) < 0) {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"phase"', "either " + modifierPhases.join(', '), "\"" + String(modifier.phase) + "\""));
          }

          break;

        case 'fn':
          if (typeof modifier.fn !== 'function') {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"fn"', '"function"', "\"" + String(modifier.fn) + "\""));
          }

          break;

        case 'effect':
          if (modifier.effect != null && typeof modifier.effect !== 'function') {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"effect"', '"function"', "\"" + String(modifier.fn) + "\""));
          }

          break;

        case 'requires':
          if (modifier.requires != null && !Array.isArray(modifier.requires)) {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requires"', '"array"', "\"" + String(modifier.requires) + "\""));
          }

          break;

        case 'requiresIfExists':
          if (!Array.isArray(modifier.requiresIfExists)) {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requiresIfExists"', '"array"', "\"" + String(modifier.requiresIfExists) + "\""));
          }

          break;

        case 'options':
        case 'data':
          break;

        default:
          console.error("PopperJS: an invalid property has been provided to the \"" + modifier.name + "\" modifier, valid properties are " + VALID_PROPERTIES.map(function (s) {
            return "\"" + s + "\"";
          }).join(', ') + "; but \"" + key + "\" was provided.");
      }

      modifier.requires && modifier.requires.forEach(function (requirement) {
        if (modifiers.find(function (mod) {
          return mod.name === requirement;
        }) == null) {
          console.error(format(MISSING_DEPENDENCY_ERROR, String(modifier.name), requirement, requirement));
        }
      });
    });
  });
}

function uniqueBy(arr, fn) {
  var identifiers = new Set();
  return arr.filter(function (item) {
    var identifier = fn(item);

    if (!identifiers.has(identifier)) {
      identifiers.add(identifier);
      return true;
    }
  });
}

function mergeByName(modifiers) {
  var merged = modifiers.reduce(function (merged, current) {
    var existing = merged[current.name];
    merged[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged;
  }, {}); // IE11 does not support Object.values

  return Object.keys(merged).map(function (key) {
    return merged[key];
  });
}

var INVALID_ELEMENT_ERROR = 'Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.';
var INFINITE_LOOP_ERROR = 'Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.';
var DEFAULT_OPTIONS = {
  placement: 'bottom',
  modifiers: [],
  strategy: 'absolute'
};

function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return !args.some(function (element) {
    return !(element && typeof element.getBoundingClientRect === 'function');
  });
}

function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }

  var _generatorOptions = generatorOptions,
      _generatorOptions$def = _generatorOptions.defaultModifiers,
      defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
      _generatorOptions$def2 = _generatorOptions.defaultOptions,
      defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper(reference, popper, options) {
    if (options === void 0) {
      options = defaultOptions;
    }

    var state = {
      placement: 'bottom',
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference,
        popper: popper
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state: state,
      setOptions: function setOptions(setOptionsAction) {
        var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options);
        state.scrollParents = {
          reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
          popper: listScrollParents(popper)
        }; // Orders the modifiers based on their dependencies and `phase`
        // properties

        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

        state.orderedModifiers = orderedModifiers.filter(function (m) {
          return m.enabled;
        }); // Validate the provided modifiers so that the consumer will get warned
        // if one of the modifiers is invalid for any reason

        if (process.env.NODE_ENV !== "production") {
          var modifiers = uniqueBy([].concat(orderedModifiers, state.options.modifiers), function (_ref) {
            var name = _ref.name;
            return name;
          });
          validateModifiers(modifiers);

          if (getBasePlacement(state.options.placement) === auto) {
            var flipModifier = state.orderedModifiers.find(function (_ref2) {
              var name = _ref2.name;
              return name === 'flip';
            });

            if (!flipModifier) {
              console.error(['Popper: "auto" placements require the "flip" modifier be', 'present and enabled to work.'].join(' '));
            }
          }

          var _getComputedStyle = getComputedStyle(popper),
              marginTop = _getComputedStyle.marginTop,
              marginRight = _getComputedStyle.marginRight,
              marginBottom = _getComputedStyle.marginBottom,
              marginLeft = _getComputedStyle.marginLeft; // We no longer take into account `margins` on the popper, and it can
          // cause bugs with positioning, so we'll warn the consumer


          if ([marginTop, marginRight, marginBottom, marginLeft].some(function (margin) {
            return parseFloat(margin);
          })) {
            console.warn(['Popper: CSS "margin" styles cannot be used to apply padding', 'between the popper and its reference element or boundary.', 'To replicate margin, use the `offset` modifier, as well as', 'the `padding` option in the `preventOverflow` and `flip`', 'modifiers.'].join(' '));
          }
        }

        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }

        var _state$elements = state.elements,
            reference = _state$elements.reference,
            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
        // anymore

        if (!areValidElements(reference, popper)) {
          if (process.env.NODE_ENV !== "production") {
            console.error(INVALID_ELEMENT_ERROR);
          }

          return;
        } // Store the reference and popper rects to be read by modifiers


        state.rects = {
          reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
          popper: getLayoutRect(popper)
        }; // Modifiers have the ability to reset the current update cycle. The
        // most common use case for this is the `flip` modifier changing the
        // placement, which then needs to re-run all the modifiers, because the
        // logic was previously ran for the previous placement and is therefore
        // stale/incorrect

        state.reset = false;
        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
        // is filled with the initial data specified by the modifier. This means
        // it doesn't persist and is fresh on each update.
        // To ensure persistent data, use `${name}#persistent`

        state.orderedModifiers.forEach(function (modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });
        var __debug_loops__ = 0;

        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (process.env.NODE_ENV !== "production") {
            __debug_loops__ += 1;

            if (__debug_loops__ > 100) {
              console.error(INFINITE_LOOP_ERROR);
              break;
            }
          }

          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }

          var _state$orderedModifie = state.orderedModifiers[index],
              fn = _state$orderedModifie.fn,
              _state$orderedModifie2 = _state$orderedModifie.options,
              _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
              name = _state$orderedModifie.name;

          if (typeof fn === 'function') {
            state = fn({
              state: state,
              options: _options,
              name: name,
              instance: instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: debounce(function () {
        return new Promise(function (resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };

    if (!areValidElements(reference, popper)) {
      if (process.env.NODE_ENV !== "production") {
        console.error(INVALID_ELEMENT_ERROR);
      }

      return instance;
    }

    instance.setOptions(options).then(function (state) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state);
      }
    }); // Modifiers have the ability to execute arbitrary code before the first
    // update cycle runs. They will be executed in the same order as the update
    // cycle. This is useful when a modifier adds some persistent data that
    // other modifiers need to use, but the modifier is run after the dependent
    // one.

    function runModifierEffects() {
      state.orderedModifiers.forEach(function (_ref3) {
        var name = _ref3.name,
            _ref3$options = _ref3.options,
            options = _ref3$options === void 0 ? {} : _ref3$options,
            effect = _ref3.effect;

        if (typeof effect === 'function') {
          var cleanupFn = effect({
            state: state,
            name: name,
            instance: instance,
            options: options
          });

          var noopFn = function noopFn() {};

          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }

    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function (fn) {
        return fn();
      });
      effectCleanupFns = [];
    }

    return instance;
  };
}

var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
var createPopper = /*#__PURE__*/popperGenerator({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules

// Credits go to Liam's Periodic Notes Plugin: https://github.com/liamcain/obsidian-periodic-notes
const wrapAround = (value, size) => {
    return ((value % size) + size) % size;
};
class Suggest {
    constructor(owner, containerEl, scope) {
        this.owner = owner;
        this.containerEl = containerEl;
        containerEl.on("click", ".suggestion-item", this.onSuggestionClick.bind(this));
        containerEl.on("mousemove", ".suggestion-item", this.onSuggestionMouseover.bind(this));
        scope.register([], "ArrowUp", (event) => {
            if (!event.isComposing) {
                this.setSelectedItem(this.selectedItem - 1, true);
                return false;
            }
        });
        scope.register([], "ArrowDown", (event) => {
            if (!event.isComposing) {
                this.setSelectedItem(this.selectedItem + 1, true);
                return false;
            }
        });
        scope.register([], "Enter", (event) => {
            if (!event.isComposing) {
                this.useSelectedItem(event);
                return false;
            }
        });
    }
    onSuggestionClick(event, el) {
        event.preventDefault();
        const item = this.suggestions.indexOf(el);
        this.setSelectedItem(item, false);
        this.useSelectedItem(event);
    }
    onSuggestionMouseover(_event, el) {
        const item = this.suggestions.indexOf(el);
        this.setSelectedItem(item, false);
    }
    setSuggestions(values) {
        this.containerEl.empty();
        const suggestionEls = [];
        values.forEach((value) => {
            const suggestionEl = this.containerEl.createDiv("suggestion-item");
            this.owner.renderSuggestion(value, suggestionEl);
            suggestionEls.push(suggestionEl);
        });
        this.values = values;
        this.suggestions = suggestionEls;
        this.setSelectedItem(0, false);
    }
    useSelectedItem(event) {
        const currentValue = this.values[this.selectedItem];
        if (currentValue) {
            this.owner.selectSuggestion(currentValue, event);
        }
    }
    setSelectedItem(selectedIndex, scrollIntoView) {
        const normalizedIndex = wrapAround(selectedIndex, this.suggestions.length);
        const prevSelectedSuggestion = this.suggestions[this.selectedItem];
        const selectedSuggestion = this.suggestions[normalizedIndex];
        prevSelectedSuggestion === null || prevSelectedSuggestion === void 0 ? void 0 : prevSelectedSuggestion.removeClass("is-selected");
        selectedSuggestion === null || selectedSuggestion === void 0 ? void 0 : selectedSuggestion.addClass("is-selected");
        this.selectedItem = normalizedIndex;
        if (scrollIntoView) {
            selectedSuggestion.scrollIntoView(false);
        }
    }
}
class TextInputSuggest {
    constructor(app, inputEl) {
        this.app = app;
        this.inputEl = inputEl;
        this.scope = new obsidian.Scope();
        this.suggestEl = createDiv("suggestion-container");
        const suggestion = this.suggestEl.createDiv("suggestion");
        this.suggest = new Suggest(this, suggestion, this.scope);
        this.scope.register([], "Escape", this.close.bind(this));
        this.inputEl.addEventListener("input", this.onInputChanged.bind(this));
        this.inputEl.addEventListener("focus", this.onInputChanged.bind(this));
        this.inputEl.addEventListener("blur", this.close.bind(this));
        this.suggestEl.on("mousedown", ".suggestion-container", (event) => {
            event.preventDefault();
        });
    }
    onInputChanged() {
        const inputStr = this.inputEl.value;
        const suggestions = this.getSuggestions(inputStr);
        if (!suggestions) {
            this.close();
            return;
        }
        if (suggestions.length > 0) {
            this.suggest.setSuggestions(suggestions);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.open(this.app.dom.appContainerEl, this.inputEl);
        }
        else {
            this.close();
        }
    }
    open(container, inputEl) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.app.keymap.pushScope(this.scope);
        container.appendChild(this.suggestEl);
        this.popper = createPopper(inputEl, this.suggestEl, {
            placement: "bottom-start",
            modifiers: [
                {
                    name: "sameWidth",
                    enabled: true,
                    fn: ({ state, instance }) => {
                        // Note: positioning needs to be calculated twice -
                        // first pass - positioning it according to the width of the popper
                        // second pass - position it with the width bound to the reference element
                        // we need to early exit to avoid an infinite loop
                        const targetWidth = `${state.rects.reference.width}px`;
                        if (state.styles.popper.width === targetWidth) {
                            return;
                        }
                        state.styles.popper.width = targetWidth;
                        instance.update();
                    },
                    phase: "beforeWrite",
                    requires: ["computeStyles"],
                },
            ],
        });
    }
    close() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.app.keymap.popScope(this.scope);
        this.suggest.setSuggestions([]);
        if (this.popper)
            this.popper.destroy();
        this.suggestEl.detach();
    }
}

// Credits go to Liam's Periodic Notes Plugin: https://github.com/liamcain/obsidian-periodic-notes
class FolderSuggest extends TextInputSuggest {
    getSuggestions(inputStr) {
        const abstractFiles = this.app.vault.getAllLoadedFiles();
        const folders = [];
        const lowerCaseInputStr = inputStr.toLowerCase();
        abstractFiles.forEach((folder) => {
            if (folder instanceof obsidian.TFolder &&
                folder.path.toLowerCase().contains(lowerCaseInputStr)) {
                folders.push(folder);
            }
        });
        return folders;
    }
    renderSuggestion(file, el) {
        el.setText(file.path);
    }
    selectSuggestion(file) {
        this.inputEl.value = file.path;
        this.inputEl.trigger("input");
        this.close();
    }
}

const obsidian_module = require("obsidian");
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function escape_RegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
function resolve_tfolder(app, folder_str) {
    folder_str = obsidian.normalizePath(folder_str);
    const folder = app.vault.getAbstractFileByPath(folder_str);
    if (!folder) {
        throw new TemplaterError(`Folder "${folder_str}" doesn't exist`);
    }
    if (!(folder instanceof obsidian.TFolder)) {
        throw new TemplaterError(`${folder_str} is a file, not a folder`);
    }
    return folder;
}
function resolve_tfile(app, file_str) {
    file_str = obsidian.normalizePath(file_str);
    const file = app.vault.getAbstractFileByPath(file_str);
    if (!file) {
        throw new TemplaterError(`File "${file_str}" doesn't exist`);
    }
    if (!(file instanceof obsidian.TFile)) {
        throw new TemplaterError(`${file_str} is a folder, not a file`);
    }
    return file;
}
function get_tfiles_from_folder(app, folder_str) {
    const folder = resolve_tfolder(app, folder_str);
    let files = [];
    obsidian.Vault.recurseChildren(folder, (file) => {
        if (file instanceof obsidian.TFile) {
            files.push(file);
        }
    });
    files.sort((a, b) => {
        return a.basename.localeCompare(b.basename);
    });
    return files;
}

// Credits go to Liam's Periodic Notes Plugin: https://github.com/liamcain/obsidian-periodic-notes
var FileSuggestMode;
(function (FileSuggestMode) {
    FileSuggestMode[FileSuggestMode["TemplateFiles"] = 0] = "TemplateFiles";
    FileSuggestMode[FileSuggestMode["ScriptFiles"] = 1] = "ScriptFiles";
})(FileSuggestMode || (FileSuggestMode = {}));
class FileSuggest extends TextInputSuggest {
    constructor(app, inputEl, plugin, mode) {
        super(app, inputEl);
        this.app = app;
        this.inputEl = inputEl;
        this.plugin = plugin;
        this.mode = mode;
    }
    get_folder(mode) {
        switch (mode) {
            case FileSuggestMode.TemplateFiles:
                return this.plugin.settings.templates_folder;
            case FileSuggestMode.ScriptFiles:
                return this.plugin.settings.user_scripts_folder;
        }
    }
    get_error_msg(mode) {
        switch (mode) {
            case FileSuggestMode.TemplateFiles:
                return `Templates folder doesn't exist`;
            case FileSuggestMode.ScriptFiles:
                return `User Scripts folder doesn't exist`;
        }
    }
    getSuggestions(input_str) {
        const all_files = errorWrapperSync(() => get_tfiles_from_folder(this.app, this.get_folder(this.mode)), this.get_error_msg(this.mode));
        if (!all_files) {
            return [];
        }
        const files = [];
        const lower_input_str = input_str.toLowerCase();
        all_files.forEach((file) => {
            if (file instanceof obsidian.TFile &&
                file.extension === "md" &&
                file.path.toLowerCase().contains(lower_input_str)) {
                files.push(file);
            }
        });
        return files;
    }
    renderSuggestion(file, el) {
        el.setText(file.path);
    }
    selectSuggestion(file) {
        this.inputEl.value = file.path;
        this.inputEl.trigger("input");
        this.close();
    }
}

const DEFAULT_SETTINGS = {
    command_timeout: 5,
    templates_folder: "",
    templates_pairs: [["", ""]],
    trigger_on_file_creation: false,
    enable_system_commands: false,
    shell_path: "",
    user_scripts_folder: undefined,
    empty_file_template: undefined,
    syntax_highlighting: true,
    enabled_templates_hotkeys: [""],
    startup_templates: [""],
};
class TemplaterSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.app = app;
        this.plugin = plugin;
    }
    display() {
        this.containerEl.empty();
        this.add_template_folder_setting();
        this.add_internal_functions_setting();
        this.add_syntax_highlighting_setting();
        this.add_trigger_on_new_file_creation_setting();
        this.add_templates_hotkeys_setting();
        this.add_startup_templates_setting();
        this.add_user_script_functions_setting();
        this.add_user_system_command_functions_setting();
    }
    add_template_folder_setting() {
        new obsidian.Setting(this.containerEl)
            .setName("Template folder location")
            .setDesc("Files in this folder will be available as templates.")
            .addSearch(cb => {
            new FolderSuggest(this.app, cb.inputEl);
            cb.setPlaceholder("Example: folder1/folder2")
                .setValue(this.plugin.settings.templates_folder)
                .onChange((new_folder) => {
                this.plugin.settings.templates_folder = new_folder;
                this.plugin.save_settings();
            });
        });
    }
    add_internal_functions_setting() {
        const desc = document.createDocumentFragment();
        desc.append("Templater provides multiples predefined variables / functions that you can use.", desc.createEl("br"), "Check the ", desc.createEl("a", {
            href: "https://silentvoid13.github.io/Templater/",
            text: "documentation"
        }), " to get a list of all the available internal variables / functions.");
        new obsidian.Setting(this.containerEl)
            .setName("Internal Variables and Functions")
            .setDesc(desc);
    }
    add_syntax_highlighting_setting() {
        const desc = document.createDocumentFragment();
        desc.append("Adds syntax highlighting for Templater commands in edit mode.");
        new obsidian.Setting(this.containerEl)
            .setName("Syntax Highlighting")
            .setDesc(desc)
            .addToggle(toggle => {
            toggle
                .setValue(this.plugin.settings.syntax_highlighting)
                .onChange(syntax_highlighting => {
                this.plugin.settings.syntax_highlighting = syntax_highlighting;
                this.plugin.save_settings();
                this.plugin.event_handler.update_syntax_highlighting();
            });
        });
    }
    add_trigger_on_new_file_creation_setting() {
        let desc = document.createDocumentFragment();
        desc.append("Templater will listen for the new file creation event, and replace every command it finds in the new file's content.", desc.createEl("br"), "This makes Templater compatible with other plugins like the Daily note core plugin, Calendar plugin, Review plugin, Note refactor plugin, ...", desc.createEl("br"), desc.createEl("b", {
            text: "Warning: ",
        }), "This can be dangerous if you create new files with unknown / unsafe content on creation. Make sure that every new file's content is safe on creation.");
        new obsidian.Setting(this.containerEl)
            .setName("Trigger Templater on new file creation")
            .setDesc(desc)
            .addToggle(toggle => {
            toggle
                .setValue(this.plugin.settings.trigger_on_file_creation)
                .onChange(trigger_on_file_creation => {
                this.plugin.settings.trigger_on_file_creation = trigger_on_file_creation;
                this.plugin.save_settings();
                this.plugin.event_handler.update_trigger_file_on_creation();
                // Force refresh
                this.display();
            });
        });
        if (this.plugin.settings.trigger_on_file_creation) {
            desc = document.createDocumentFragment();
            desc.append("Templater will automatically apply this template to new empty files when they are created.", desc.createEl("br"), "The .md extension for the file shouldn't be specified.");
            new obsidian.Setting(this.containerEl)
                .setName("Empty file template")
                .setDesc(desc)
                .addSearch(cb => {
                new FileSuggest(this.app, cb.inputEl, this.plugin, FileSuggestMode.TemplateFiles);
                cb.setPlaceholder("folder1/template_file")
                    .setValue(this.plugin.settings.empty_file_template)
                    .onChange((empty_file_template) => {
                    this.plugin.settings.empty_file_template = empty_file_template;
                    this.plugin.save_settings();
                });
            });
        }
    }
    add_templates_hotkeys_setting() {
        this.containerEl.createEl("h2", { text: "Templates Hotkeys" });
        this.plugin.settings.enabled_templates_hotkeys.forEach((template, index) => {
            const s = new obsidian.Setting(this.containerEl)
                .addSearch(cb => {
                new FileSuggest(this.app, cb.inputEl, this.plugin, FileSuggestMode.TemplateFiles);
                cb.setPlaceholder("Example: folder1/template_file")
                    .setValue(template)
                    .onChange((new_template) => {
                    if (new_template !== "" && this.plugin.settings.enabled_templates_hotkeys.contains(new_template)) {
                        log_error(new TemplaterError("This template is already bound to a hotkey"));
                        return;
                    }
                    this.plugin.command_handler.add_template_hotkey(this.plugin.settings.enabled_templates_hotkeys[index], new_template);
                    this.plugin.settings.enabled_templates_hotkeys[index] = new_template;
                    this.plugin.save_settings();
                });
            })
                .addExtraButton(cb => {
                cb.setIcon("any-key")
                    .setTooltip("Configure Hotkey")
                    .onClick(() => {
                    // TODO: Replace with future "official" way to do this
                    // @ts-ignore
                    this.app.setting.openTabById("hotkeys");
                    // @ts-ignore
                    const tab = this.app.setting.activeTab;
                    tab.searchInputEl.value = "Templater: Insert";
                    tab.updateHotkeyVisibility();
                });
            })
                .addExtraButton(cb => {
                cb.setIcon("cross")
                    .setTooltip("Delete")
                    .onClick(() => {
                    this.plugin.command_handler.remove_template_hotkey(this.plugin.settings.enabled_templates_hotkeys[index]);
                    this.plugin.settings.enabled_templates_hotkeys.splice(index, 1);
                    // Force refresh
                    this.display();
                });
            });
            s.infoEl.remove();
        });
        new obsidian.Setting(this.containerEl)
            .addButton(cb => {
            cb.setButtonText("Add new hotkey for template")
                .setCta()
                .onClick(_ => {
                this.plugin.settings.enabled_templates_hotkeys.push("");
                // Force refresh
                this.display();
            });
        });
    }
    add_startup_templates_setting() {
        this.containerEl.createEl("h2", { text: "Startup Templates" });
        const desc = document.createDocumentFragment();
        desc.append("Startup Templates are templates that will get executed once when Templater starts.", desc.createEl("br"), "These templates won't output anything.", desc.createEl("br"), "This can be useful to set up templates adding hooks to obsidian events for example.");
        new obsidian.Setting(this.containerEl)
            .setDesc(desc);
        this.plugin.settings.startup_templates.forEach((template, index) => {
            const s = new obsidian.Setting(this.containerEl)
                .addSearch(cb => {
                new FileSuggest(this.app, cb.inputEl, this.plugin, FileSuggestMode.TemplateFiles);
                cb.setPlaceholder("Example: folder1/template_file")
                    .setValue(template)
                    .onChange((new_template) => {
                    if (new_template !== "" && this.plugin.settings.startup_templates.contains(new_template)) {
                        log_error(new TemplaterError("This startup template already exist"));
                        return;
                    }
                    this.plugin.settings.startup_templates[index] = new_template;
                    this.plugin.save_settings();
                });
            })
                .addExtraButton(cb => {
                cb.setIcon("cross")
                    .setTooltip("Delete")
                    .onClick(() => {
                    this.plugin.settings.startup_templates.splice(index, 1);
                    // Force refresh
                    this.display();
                });
            });
            s.infoEl.remove();
        });
        new obsidian.Setting(this.containerEl)
            .addButton(cb => {
            cb.setButtonText("Add new startup template")
                .setCta()
                .onClick(_ => {
                this.plugin.settings.startup_templates.push("");
                // Force refresh
                this.display();
            });
        });
    }
    add_user_script_functions_setting() {
        this.containerEl.createEl("h2", { text: "User Script Functions" });
        let desc = document.createDocumentFragment();
        desc.append("All JavaScript files in this folder will be loaded as CommonJS modules, to import custom user functions.", desc.createEl("br"), "The folder needs to be accessible from the vault.", desc.createEl("br"), "Check the ", desc.createEl("a", {
            href: "https://silentvoid13.github.io/Templater/",
            text: "documentation",
        }), " for more informations.");
        new obsidian.Setting(this.containerEl)
            .setName("Script files folder location")
            .setDesc(desc)
            .addSearch(cb => {
            new FolderSuggest(this.app, cb.inputEl);
            cb.setPlaceholder("Example: folder1/folder2")
                .setValue(this.plugin.settings.user_scripts_folder)
                .onChange((new_folder) => {
                this.plugin.settings.user_scripts_folder = new_folder;
                this.plugin.save_settings();
            });
        });
        desc = document.createDocumentFragment();
        let files;
        files = errorWrapperSync(() => get_tfiles_from_folder(this.app, this.plugin.settings.user_scripts_folder), `User Scripts folder doesn't exist`);
        if (!files) {
            files = [];
        }
        let name;
        let count = 0;
        for (const file of files) {
            if (file.extension === "js") {
                count++;
                desc.append(desc.createEl("li", {
                    text: `tp.user.${file.basename}`
                }));
            }
        }
        if (count === 0) {
            name = "No User Scripts detected";
        }
        else {
            name = "Detected User Scripts";
        }
        new obsidian.Setting(this.containerEl)
            .setName(name)
            .setDesc(desc)
            .addExtraButton(extra => {
            extra.setIcon("sync")
                .setTooltip("Refresh")
                .onClick(() => {
                // Force refresh
                this.display();
            });
        });
    }
    add_user_system_command_functions_setting() {
        let desc = document.createDocumentFragment();
        desc.append("Allows you to create user functions linked to system commands.", desc.createEl("br"), desc.createEl("b", {
            text: "Warning: "
        }), "It can be dangerous to execute arbitrary system commands from untrusted sources. Only run system commands that you understand, from trusted sources.");
        this.containerEl.createEl("h2", { text: "User System Command Functions" });
        new obsidian.Setting(this.containerEl)
            .setName("Enable User System Command Functions")
            .setDesc(desc)
            .addToggle(toggle => {
            toggle
                .setValue(this.plugin.settings.enable_system_commands)
                .onChange(enable_system_commands => {
                this.plugin.settings.enable_system_commands = enable_system_commands;
                this.plugin.save_settings();
                // Force refresh
                this.display();
            });
        });
        if (this.plugin.settings.enable_system_commands) {
            new obsidian.Setting(this.containerEl)
                .setName("Timeout")
                .setDesc("Maximum timeout in seconds for a system command.")
                .addText(text => {
                text.setPlaceholder("Timeout")
                    .setValue(this.plugin.settings.command_timeout.toString())
                    .onChange((new_value) => {
                    const new_timeout = Number(new_value);
                    if (isNaN(new_timeout)) {
                        log_error(new TemplaterError("Timeout must be a number"));
                        return;
                    }
                    this.plugin.settings.command_timeout = new_timeout;
                    this.plugin.save_settings();
                });
            });
            desc = document.createDocumentFragment();
            desc.append("Full path to the shell binary to execute the command with.", desc.createEl("br"), "This setting is optional and will default to the system's default shell if not specified.", desc.createEl("br"), "You can use forward slashes ('/') as path separators on all platforms if in doubt.");
            new obsidian.Setting(this.containerEl)
                .setName("Shell binary location")
                .setDesc(desc)
                .addText(text => {
                text.setPlaceholder("Example: /bin/bash, ...")
                    .setValue(this.plugin.settings.shell_path)
                    .onChange((shell_path) => {
                    this.plugin.settings.shell_path = shell_path;
                    this.plugin.save_settings();
                });
            });
            let i = 1;
            this.plugin.settings.templates_pairs.forEach((template_pair) => {
                const div = this.containerEl.createEl('div');
                div.addClass("templater_div");
                const title = this.containerEl.createEl('h4', {
                    text: 'User Function n°' + i,
                });
                title.addClass("templater_title");
                const setting = new obsidian.Setting(this.containerEl)
                    .addExtraButton(extra => {
                    extra.setIcon("cross")
                        .setTooltip("Delete")
                        .onClick(() => {
                        const index = this.plugin.settings.templates_pairs.indexOf(template_pair);
                        if (index > -1) {
                            this.plugin.settings.templates_pairs.splice(index, 1);
                            // Force refresh
                            this.plugin.save_settings();
                            this.display();
                        }
                    });
                })
                    .addText(text => {
                    const t = text.setPlaceholder('Function name')
                        .setValue(template_pair[0])
                        .onChange((new_value) => {
                        console.log(template_pair);
                        const index = this.plugin.settings.templates_pairs.indexOf(template_pair);
                        if (index > -1) {
                            this.plugin.settings.templates_pairs[index][0] = new_value;
                            this.plugin.save_settings();
                        }
                    });
                    t.inputEl.addClass("templater_template");
                    return t;
                })
                    .addTextArea(text => {
                    const t = text.setPlaceholder('System Command')
                        .setValue(template_pair[1])
                        .onChange((new_cmd) => {
                        const index = this.plugin.settings.templates_pairs.indexOf(template_pair);
                        if (index > -1) {
                            this.plugin.settings.templates_pairs[index][1] = new_cmd;
                            this.plugin.save_settings();
                        }
                    });
                    t.inputEl.setAttr("rows", 2);
                    t.inputEl.addClass("templater_cmd");
                    return t;
                });
                setting.infoEl.remove();
                div.appendChild(title);
                div.appendChild(this.containerEl.lastChild);
                i += 1;
            });
            const div = this.containerEl.createEl('div');
            div.addClass("templater_div2");
            const setting = new obsidian.Setting(this.containerEl)
                .addButton(button => {
                button.setButtonText("Add New User Function")
                    .setCta()
                    .onClick(() => {
                    this.plugin.settings.templates_pairs.push(["", ""]);
                    // Force refresh
                    this.display();
                });
            });
            setting.infoEl.remove();
            div.appendChild(this.containerEl.lastChild);
        }
    }
}

var OpenMode;
(function (OpenMode) {
    OpenMode[OpenMode["InsertTemplate"] = 0] = "InsertTemplate";
    OpenMode[OpenMode["CreateNoteTemplate"] = 1] = "CreateNoteTemplate";
})(OpenMode || (OpenMode = {}));
class FuzzySuggester extends obsidian.FuzzySuggestModal {
    constructor(app, plugin) {
        super(app);
        this.app = app;
        this.plugin = plugin;
        this.setPlaceholder("Type name of a template...");
    }
    getItems() {
        if (this.plugin.settings.templates_folder === "") {
            return this.app.vault.getMarkdownFiles();
        }
        const files = errorWrapperSync(() => get_tfiles_from_folder(this.app, this.plugin.settings.templates_folder), `Couldn't retrieve template files from templates folder ${this.plugin.settings.templates_folder}`);
        if (!files) {
            return [];
        }
        return files;
    }
    getItemText(item) {
        return item.basename;
    }
    onChooseItem(item, _evt) {
        switch (this.open_mode) {
            case OpenMode.InsertTemplate:
                this.plugin.templater.append_template_to_active_file(item);
                break;
            case OpenMode.CreateNoteTemplate:
                this.plugin.templater.create_new_note_from_template(item, this.creation_folder);
                break;
        }
    }
    start() {
        try {
            this.open();
        }
        catch (e) {
            log_error(e);
        }
    }
    insert_template() {
        this.open_mode = OpenMode.InsertTemplate;
        this.start();
    }
    create_new_note_from_template(folder) {
        this.creation_folder = folder;
        this.open_mode = OpenMode.CreateNoteTemplate;
        this.start();
    }
}

const UNSUPPORTED_MOBILE_TEMPLATE = "Error_MobileUnsupportedTemplate";
const ICON_DATA = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51.1328 28.7"><path d="M0 15.14 0 10.15 18.67 1.51 18.67 6.03 4.72 12.33 4.72 12.76 18.67 19.22 18.67 23.74 0 15.14ZM33.6928 1.84C33.6928 1.84 33.9761 2.1467 34.5428 2.76C35.1094 3.38 35.3928 4.56 35.3928 6.3C35.3928 8.0466 34.8195 9.54 33.6728 10.78C32.5261 12.02 31.0995 12.64 29.3928 12.64C27.6862 12.64 26.2661 12.0267 25.1328 10.8C23.9928 9.5733 23.4228 8.0867 23.4228 6.34C23.4228 4.6 23.9995 3.1066 25.1528 1.86C26.2994.62 27.7261 0 29.4328 0C31.1395 0 32.5594.6133 33.6928 1.84M49.8228.67 29.5328 28.38 24.4128 28.38 44.7128.67 49.8228.67M31.0328 8.38C31.0328 8.38 31.1395 8.2467 31.3528 7.98C31.5662 7.7067 31.6728 7.1733 31.6728 6.38C31.6728 5.5867 31.4461 4.92 30.9928 4.38C30.5461 3.84 29.9995 3.57 29.3528 3.57C28.7061 3.57 28.1695 3.84 27.7428 4.38C27.3228 4.92 27.1128 5.5867 27.1128 6.38C27.1128 7.1733 27.3361 7.84 27.7828 8.38C28.2361 8.9267 28.7861 9.2 29.4328 9.2C30.0795 9.2 30.6128 8.9267 31.0328 8.38M49.4328 17.9C49.4328 17.9 49.7161 18.2067 50.2828 18.82C50.8495 19.4333 51.1328 20.6133 51.1328 22.36C51.1328 24.1 50.5594 25.59 49.4128 26.83C48.2595 28.0766 46.8295 28.7 45.1228 28.7C43.4228 28.7 42.0028 28.0833 40.8628 26.85C39.7295 25.6233 39.1628 24.1366 39.1628 22.39C39.1628 20.65 39.7361 19.16 40.8828 17.92C42.0361 16.6733 43.4628 16.05 45.1628 16.05C46.8694 16.05 48.2928 16.6667 49.4328 17.9M46.8528 24.52C46.8528 24.52 46.9595 24.3833 47.1728 24.11C47.3795 23.8367 47.4828 23.3033 47.4828 22.51C47.4828 21.7167 47.2595 21.05 46.8128 20.51C46.3661 19.97 45.8162 19.7 45.1628 19.7C44.5161 19.7 43.9828 19.97 43.5628 20.51C43.1428 21.05 42.9328 21.7167 42.9328 22.51C42.9328 23.3033 43.1561 23.9733 43.6028 24.52C44.0494 25.06 44.5961 25.33 45.2428 25.33C45.8895 25.33 46.4261 25.06 46.8528 24.52Z" fill="currentColor"/></svg>`;

class InternalModule {
    constructor(app, plugin) {
        this.app = app;
        this.plugin = plugin;
        this.static_functions = new Map();
        this.dynamic_functions = new Map();
    }
    getName() {
        return this.name;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.create_static_templates();
            this.static_object = Object.fromEntries(this.static_functions);
        });
    }
    generate_object(new_config) {
        return __awaiter(this, void 0, void 0, function* () {
            this.config = new_config;
            yield this.create_dynamic_templates();
            return Object.assign(Object.assign({}, this.static_object), Object.fromEntries(this.dynamic_functions));
        });
    }
}

class InternalModuleDate extends InternalModule {
    constructor() {
        super(...arguments);
        this.name = "date";
    }
    create_static_templates() {
        return __awaiter(this, void 0, void 0, function* () {
            this.static_functions.set("now", this.generate_now());
            this.static_functions.set("tomorrow", this.generate_tomorrow());
            this.static_functions.set("weekday", this.generate_weekday());
            this.static_functions.set("yesterday", this.generate_yesterday());
        });
    }
    create_dynamic_templates() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    generate_now() {
        return (format = "YYYY-MM-DD", offset, reference, reference_format) => {
            if (reference && !window.moment(reference, reference_format).isValid()) {
                throw new TemplaterError("Invalid reference date format, try specifying one with the argument 'reference_format'");
            }
            let duration;
            if (typeof offset === "string") {
                duration = window.moment.duration(offset);
            }
            else if (typeof offset === "number") {
                duration = window.moment.duration(offset, "days");
            }
            return window.moment(reference, reference_format).add(duration).format(format);
        };
    }
    generate_tomorrow() {
        return (format = "YYYY-MM-DD") => {
            return window.moment().add(1, 'days').format(format);
        };
    }
    generate_weekday() {
        return (format = "YYYY-MM-DD", weekday, reference, reference_format) => {
            if (reference && !window.moment(reference, reference_format).isValid()) {
                throw new TemplaterError("Invalid reference date format, try specifying one with the argument 'reference_format'");
            }
            return window.moment(reference, reference_format).weekday(weekday).format(format);
        };
    }
    generate_yesterday() {
        return (format = "YYYY-MM-DD") => {
            return window.moment().add(-1, 'days').format(format);
        };
    }
}

const DEPTH_LIMIT = 10;
class InternalModuleFile extends InternalModule {
    constructor() {
        super(...arguments);
        this.name = "file";
        this.include_depth = 0;
        this.create_new_depth = 0;
        this.linkpath_regex = new RegExp("^\\[\\[(.*)\\]\\]$");
    }
    create_static_templates() {
        return __awaiter(this, void 0, void 0, function* () {
            this.static_functions.set("creation_date", this.generate_creation_date());
            this.static_functions.set("create_new", this.generate_create_new());
            this.static_functions.set("cursor", this.generate_cursor());
            this.static_functions.set("cursor_append", this.generate_cursor_append());
            this.static_functions.set("exists", this.generate_exists());
            this.static_functions.set("find_tfile", this.generate_find_tfile());
            this.static_functions.set("folder", this.generate_folder());
            this.static_functions.set("include", this.generate_include());
            this.static_functions.set("last_modified_date", this.generate_last_modified_date());
            this.static_functions.set("move", this.generate_move());
            this.static_functions.set("path", this.generate_path());
            this.static_functions.set("rename", this.generate_rename());
            this.static_functions.set("selection", this.generate_selection());
        });
    }
    create_dynamic_templates() {
        return __awaiter(this, void 0, void 0, function* () {
            this.dynamic_functions.set("content", yield this.generate_content());
            this.dynamic_functions.set("tags", this.generate_tags());
            this.dynamic_functions.set("title", this.generate_title());
        });
    }
    generate_content() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.app.vault.read(this.config.target_file);
        });
    }
    generate_create_new() {
        return (template, filename, open_new = false, folder) => __awaiter(this, void 0, void 0, function* () {
            this.create_new_depth += 1;
            if (this.create_new_depth > DEPTH_LIMIT) {
                this.create_new_depth = 0;
                throw new TemplaterError("Reached create_new depth limit (max = 10)");
            }
            const new_file = yield this.plugin.templater.create_new_note_from_template(template, folder, filename, open_new);
            this.create_new_depth -= 1;
            return new_file;
        });
    }
    generate_creation_date() {
        return (format = "YYYY-MM-DD HH:mm") => {
            return window.moment(this.config.target_file.stat.ctime).format(format);
        };
    }
    generate_cursor() {
        return (order) => {
            // Hack to prevent empty output
            return `<% tp.file.cursor(${order !== null && order !== void 0 ? order : ''}) %>`;
        };
    }
    generate_cursor_append() {
        return (content) => {
            const active_view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
            if (active_view === null) {
                this.plugin.log_error(new TemplaterError("No active view, can't append to cursor."));
                return;
            }
            const editor = active_view.editor;
            const doc = editor.getDoc();
            doc.replaceSelection(content);
            return "";
        };
    }
    generate_exists() {
        return (filename) => {
            // TODO: Remove this, only here to support the old way
            let match;
            if ((match = this.linkpath_regex.exec(filename)) !== null) {
                filename = match[1];
            }
            const file = this.app.metadataCache.getFirstLinkpathDest(filename, "");
            return file != null;
        };
    }
    generate_find_tfile() {
        return (filename) => {
            const path = obsidian.normalizePath(filename);
            return this.app.metadataCache.getFirstLinkpathDest(path, "");
        };
    }
    generate_folder() {
        return (relative = false) => {
            let parent = this.config.target_file.parent;
            let folder;
            if (relative) {
                folder = parent.path;
            }
            else {
                folder = parent.name;
            }
            return folder;
        };
    }
    generate_include() {
        return (include_link) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            console.log('DEPTH', this.include_depth);
            // TODO: Add mutex for this, this may currently lead to a race condition. 
            // While not very impactful, that could still be annoying.
            this.include_depth += 1;
            if (this.include_depth > DEPTH_LIMIT) {
                this.include_depth -= 1;
                throw new TemplaterError("Reached inclusion depth limit (max = 10)");
            }
            let inc_file_content;
            if (include_link instanceof obsidian.TFile) {
                inc_file_content = yield this.app.vault.read(include_link);
            }
            else {
                let match;
                if ((match = this.linkpath_regex.exec(include_link)) === null) {
                    this.include_depth -= 1;
                    throw new TemplaterError("Invalid file format, provide an obsidian link between quotes.");
                }
                const { path, subpath } = obsidian.parseLinktext(match[1]);
                const inc_file = this.app.metadataCache.getFirstLinkpathDest(path, "");
                if (!inc_file) {
                    this.include_depth -= 1;
                    throw new TemplaterError(`File ${include_link} doesn't exist`);
                }
                inc_file_content = yield this.app.vault.read(inc_file);
                if (subpath) {
                    const cache = this.app.metadataCache.getFileCache(inc_file);
                    if (cache) {
                        const result = obsidian.resolveSubpath(cache, subpath);
                        if (result) {
                            inc_file_content = inc_file_content.slice(result.start.offset, (_a = result.end) === null || _a === void 0 ? void 0 : _a.offset);
                        }
                    }
                }
            }
            try {
                const parsed_content = yield this.plugin.templater.parser.parse_commands(inc_file_content, this.plugin.templater.current_functions_object);
                this.include_depth -= 1;
                return parsed_content;
            }
            catch (e) {
                this.include_depth -= 1;
                throw e;
            }
        });
    }
    generate_last_modified_date() {
        return (format = "YYYY-MM-DD HH:mm") => {
            return window.moment(this.config.target_file.stat.mtime).format(format);
        };
    }
    generate_move() {
        return (path) => __awaiter(this, void 0, void 0, function* () {
            const new_path = obsidian.normalizePath(`${path}.${this.config.target_file.extension}`);
            yield this.app.fileManager.renameFile(this.config.target_file, new_path);
            return "";
        });
    }
    generate_path() {
        return (relative = false) => {
            // TODO: Add mobile support
            if (obsidian.Platform.isMobileApp) {
                return UNSUPPORTED_MOBILE_TEMPLATE;
            }
            if (!(this.app.vault.adapter instanceof obsidian.FileSystemAdapter)) {
                throw new TemplaterError("app.vault is not a FileSystemAdapter instance");
            }
            const vault_path = this.app.vault.adapter.getBasePath();
            if (relative) {
                return this.config.target_file.path;
            }
            else {
                return `${vault_path}/${this.config.target_file.path}`;
            }
        };
    }
    generate_rename() {
        return (new_title) => __awaiter(this, void 0, void 0, function* () {
            if (new_title.match(/[\\\/:]+/g)) {
                throw new TemplaterError("File name cannot contain any of these characters: \\ / :");
            }
            const new_path = obsidian.normalizePath(`${this.config.target_file.parent.path}/${new_title}.${this.config.target_file.extension}`);
            yield this.app.fileManager.renameFile(this.config.target_file, new_path);
            return "";
        });
    }
    generate_selection() {
        return () => {
            const active_view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
            if (active_view == null) {
                throw new TemplaterError("Active view is null, can't read selection.");
            }
            const editor = active_view.editor;
            return editor.getSelection();
        };
    }
    // TODO: Turn this into a function
    generate_tags() {
        const cache = this.app.metadataCache.getFileCache(this.config.target_file);
        return obsidian.getAllTags(cache);
    }
    // TODO: Turn this into a function
    generate_title() {
        return this.config.target_file.basename;
    }
}

class InternalModuleWeb extends InternalModule {
    constructor() {
        super(...arguments);
        this.name = "web";
    }
    create_static_templates() {
        return __awaiter(this, void 0, void 0, function* () {
            this.static_functions.set("daily_quote", this.generate_daily_quote());
            this.static_functions.set("random_picture", this.generate_random_picture());
        });
    }
    create_dynamic_templates() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    getRequest(url) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield fetch(url);
            if (!response.ok) {
                throw new TemplaterError("Error performing GET request");
            }
            return response;
        });
    }
    generate_daily_quote() {
        return () => __awaiter(this, void 0, void 0, function* () {
            let response = yield this.getRequest("https://quotes.rest/qod");
            let json = yield response.json();
            let author = json.contents.quotes[0].author;
            let quote = json.contents.quotes[0].quote;
            let new_content = `> ${quote}\n> &mdash; <cite>${author}</cite>`;
            return new_content;
        });
    }
    generate_random_picture() {
        return (size, query) => __awaiter(this, void 0, void 0, function* () {
            let response = yield this.getRequest(`https://source.unsplash.com/random/${size !== null && size !== void 0 ? size : ''}?${query !== null && query !== void 0 ? query : ''}`);
            let url = response.url;
            return `![tp.web.random_picture](${url})`;
        });
    }
}

class InternalModuleFrontmatter extends InternalModule {
    constructor() {
        super(...arguments);
        this.name = "frontmatter";
    }
    create_static_templates() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    create_dynamic_templates() {
        return __awaiter(this, void 0, void 0, function* () {
            const cache = this.app.metadataCache.getFileCache(this.config.target_file);
            this.dynamic_functions = new Map(Object.entries((cache === null || cache === void 0 ? void 0 : cache.frontmatter) || {}));
        });
    }
}

class PromptModal extends obsidian.Modal {
    constructor(app, prompt_text, default_value) {
        super(app);
        this.prompt_text = prompt_text;
        this.default_value = default_value;
        this.submitted = false;
    }
    onOpen() {
        this.titleEl.setText(this.prompt_text);
        this.createForm();
    }
    onClose() {
        this.contentEl.empty();
        if (!this.submitted) {
            this.reject(new TemplaterError("Cancelled prompt"));
        }
    }
    createForm() {
        var _a;
        const div = this.contentEl.createDiv();
        div.addClass("templater-prompt-div");
        const form = div.createEl("form");
        form.addClass("templater-prompt-form");
        form.type = "submit";
        form.onsubmit = (e) => {
            this.submitted = true;
            e.preventDefault();
            this.resolve(this.promptEl.value);
            this.close();
        };
        this.promptEl = form.createEl("input");
        this.promptEl.type = "text";
        this.promptEl.placeholder = "Type text here...";
        this.promptEl.value = (_a = this.default_value) !== null && _a !== void 0 ? _a : "";
        this.promptEl.addClass("templater-prompt-input");
        this.promptEl.select();
    }
    openAndGetValue(resolve, reject) {
        return __awaiter(this, void 0, void 0, function* () {
            this.resolve = resolve;
            this.reject = reject;
            this.open();
        });
    }
}

class SuggesterModal extends obsidian.FuzzySuggestModal {
    constructor(app, text_items, items, placeholder) {
        super(app);
        this.text_items = text_items;
        this.items = items;
        this.submitted = false;
        this.setPlaceholder(placeholder);
    }
    getItems() {
        return this.items;
    }
    onClose() {
        if (!this.submitted) {
            this.reject(new TemplaterError("Cancelled prompt"));
        }
    }
    selectSuggestion(value, evt) {
        this.submitted = true;
        this.close();
        this.onChooseSuggestion(value, evt);
    }
    getItemText(item) {
        if (this.text_items instanceof Function) {
            return this.text_items(item);
        }
        return this.text_items[this.items.indexOf(item)] || "Undefined Text Item";
    }
    onChooseItem(item, _evt) {
        this.resolve(item);
    }
    openAndGetValue(resolve, reject) {
        return __awaiter(this, void 0, void 0, function* () {
            this.resolve = resolve;
            this.reject = reject;
            this.open();
        });
    }
}

class InternalModuleSystem extends InternalModule {
    constructor() {
        super(...arguments);
        this.name = "system";
    }
    create_static_templates() {
        return __awaiter(this, void 0, void 0, function* () {
            this.static_functions.set("clipboard", this.generate_clipboard());
            this.static_functions.set("prompt", this.generate_prompt());
            this.static_functions.set("suggester", this.generate_suggester());
        });
    }
    create_dynamic_templates() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    generate_clipboard() {
        return () => __awaiter(this, void 0, void 0, function* () {
            // TODO: Add mobile support
            if (obsidian.Platform.isMobileApp) {
                return UNSUPPORTED_MOBILE_TEMPLATE;
            }
            return yield navigator.clipboard.readText();
        });
    }
    generate_prompt() {
        return (prompt_text, default_value, throw_on_cancel = false) => __awaiter(this, void 0, void 0, function* () {
            const prompt = new PromptModal(this.app, prompt_text, default_value);
            const promise = new Promise((resolve, reject) => prompt.openAndGetValue(resolve, reject));
            try {
                return yield promise;
            }
            catch (error) {
                if (throw_on_cancel) {
                    throw error;
                }
                return null;
            }
        });
    }
    generate_suggester() {
        return (text_items, items, throw_on_cancel = false, placeholder = "") => __awaiter(this, void 0, void 0, function* () {
            const suggester = new SuggesterModal(this.app, text_items, items, placeholder);
            const promise = new Promise((resolve, reject) => suggester.openAndGetValue(resolve, reject));
            try {
                return yield promise;
            }
            catch (error) {
                if (throw_on_cancel) {
                    throw error;
                }
                return null;
            }
        });
    }
}

class InternalModuleConfig extends InternalModule {
    constructor() {
        super(...arguments);
        this.name = "config";
    }
    create_static_templates() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    create_dynamic_templates() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    generate_object(config) {
        return __awaiter(this, void 0, void 0, function* () {
            return config;
        });
    }
}

class InternalFunctions {
    constructor(app, plugin) {
        this.app = app;
        this.plugin = plugin;
        this.modules_array = new Array();
        this.modules_array.push(new InternalModuleDate(this.app, this.plugin));
        this.modules_array.push(new InternalModuleFile(this.app, this.plugin));
        this.modules_array.push(new InternalModuleWeb(this.app, this.plugin));
        this.modules_array.push(new InternalModuleFrontmatter(this.app, this.plugin));
        this.modules_array.push(new InternalModuleSystem(this.app, this.plugin));
        this.modules_array.push(new InternalModuleConfig(this.app, this.plugin));
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const mod of this.modules_array) {
                yield mod.init();
            }
        });
    }
    generate_object(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const internal_functions_object = {};
            for (const mod of this.modules_array) {
                internal_functions_object[mod.getName()] = yield mod.generate_object(config);
            }
            return internal_functions_object;
        });
    }
}

class UserSystemFunctions {
    constructor(app, plugin) {
        this.plugin = plugin;
        if (obsidian.Platform.isMobileApp || !(app.vault.adapter instanceof obsidian.FileSystemAdapter)) {
            this.cwd = "";
        }
        else {
            this.cwd = app.vault.adapter.getBasePath();
            this.exec_promise = util.promisify(child_process.exec);
        }
    }
    // TODO: Add mobile support
    generate_system_functions(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_system_functions = new Map();
            const internal_functions_object = yield this.plugin.templater.functions_generator.generate_object(config, FunctionsMode.INTERNAL);
            for (let [template, cmd] of this.plugin.settings.templates_pairs) {
                if (template === "" || cmd === "") {
                    continue;
                }
                if (obsidian.Platform.isMobileApp) {
                    user_system_functions.set(template, (_user_args) => {
                        return new Promise(resolve => resolve(UNSUPPORTED_MOBILE_TEMPLATE));
                    });
                }
                else {
                    cmd = yield this.plugin.templater.parser.parse_commands(cmd, internal_functions_object);
                    user_system_functions.set(template, (user_args) => __awaiter(this, void 0, void 0, function* () {
                        const process_env = Object.assign(Object.assign({}, process.env), user_args);
                        const cmd_options = Object.assign({ timeout: this.plugin.settings.command_timeout * 1000, cwd: this.cwd, env: process_env }, (this.plugin.settings.shell_path !== "" && { shell: this.plugin.settings.shell_path }));
                        try {
                            const { stdout } = yield this.exec_promise(cmd, cmd_options);
                            return stdout.trimRight();
                        }
                        catch (error) {
                            throw new TemplaterError(`Error with User Template ${template}`, error);
                        }
                    }));
                }
            }
            return user_system_functions;
        });
    }
    generate_object(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_system_functions = yield this.generate_system_functions(config);
            return Object.fromEntries(user_system_functions);
        });
    }
}

class UserScriptFunctions {
    constructor(app, plugin) {
        this.app = app;
        this.plugin = plugin;
    }
    generate_user_script_functions(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_script_functions = new Map();
            let files = errorWrapperSync(() => get_tfiles_from_folder(this.app, this.plugin.settings.user_scripts_folder), `Couldn't find user script folder "${this.plugin.settings.user_scripts_folder}"`);
            if (!files) {
                return new Map();
            }
            for (let file of files) {
                if (file.extension.toLowerCase() === "js") {
                    yield this.load_user_script_function(config, file, user_script_functions);
                }
            }
            return user_script_functions;
        });
    }
    load_user_script_function(config, file, user_script_functions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(this.app.vault.adapter instanceof obsidian.FileSystemAdapter)) {
                throw new TemplaterError("app.vault is not a FileSystemAdapter instance");
            }
            let vault_path = this.app.vault.adapter.getBasePath();
            let file_path = `${vault_path}/${file.path}`;
            // https://stackoverflow.com/questions/26633901/reload-module-at-runtime
            // https://stackoverflow.com/questions/1972242/how-to-auto-reload-files-in-node-js
            if (Object.keys(window.require.cache).contains(file_path)) {
                delete window.require.cache[window.require.resolve(file_path)];
            }
            const user_function = yield (function (t) { return Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require(t)); }); })(file_path);
            if (!user_function.default) {
                throw new TemplaterError(`Failed to load user script ${file_path}. No exports detected.`);
            }
            if (!(user_function.default instanceof Function)) {
                throw new TemplaterError(`Failed to load user script ${file_path}. Default export is not a function.`);
            }
            user_script_functions.set(`${file.basename}`, user_function.default);
        });
    }
    generate_object(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_script_functions = yield this.generate_user_script_functions(config);
            return Object.fromEntries(user_script_functions);
        });
    }
}

class UserFunctions {
    constructor(app, plugin) {
        this.plugin = plugin;
        this.user_system_functions = new UserSystemFunctions(app, plugin);
        this.user_script_functions = new UserScriptFunctions(app, plugin);
    }
    generate_object(config) {
        return __awaiter(this, void 0, void 0, function* () {
            let user_system_functions = {};
            let user_script_functions = {};
            if (this.plugin.settings.enable_system_commands) {
                user_system_functions = yield this.user_system_functions.generate_object(config);
            }
            // TODO: Add mobile support
            if (obsidian.Platform.isDesktopApp && this.plugin.settings.user_scripts_folder) {
                user_script_functions = yield this.user_script_functions.generate_object(config);
            }
            return Object.assign(Object.assign({}, user_system_functions), user_script_functions);
        });
    }
}

var FunctionsMode;
(function (FunctionsMode) {
    FunctionsMode[FunctionsMode["INTERNAL"] = 0] = "INTERNAL";
    FunctionsMode[FunctionsMode["USER_INTERNAL"] = 1] = "USER_INTERNAL";
})(FunctionsMode || (FunctionsMode = {}));
class FunctionsGenerator {
    constructor(app, plugin) {
        this.app = app;
        this.plugin = plugin;
        this.internal_functions = new InternalFunctions(this.app, this.plugin);
        this.user_functions = new UserFunctions(this.app, this.plugin);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.internal_functions.init();
        });
    }
    additional_functions() {
        return {
            obsidian: obsidian_module,
        };
    }
    generate_object(config, functions_mode = FunctionsMode.USER_INTERNAL) {
        return __awaiter(this, void 0, void 0, function* () {
            const final_object = {};
            const additional_functions_object = this.additional_functions();
            const internal_functions_object = yield this.internal_functions.generate_object(config);
            let user_functions_object = {};
            Object.assign(final_object, additional_functions_object);
            switch (functions_mode) {
                case FunctionsMode.INTERNAL:
                    Object.assign(final_object, internal_functions_object);
                    break;
                case FunctionsMode.USER_INTERNAL:
                    user_functions_object = yield this.user_functions.generate_object(config);
                    Object.assign(final_object, Object.assign(Object.assign({}, internal_functions_object), { user: user_functions_object }));
                    break;
            }
            return final_object;
        });
    }
}

class CursorJumper {
    constructor(app) {
        this.app = app;
    }
    jump_to_next_cursor_location() {
        return __awaiter(this, void 0, void 0, function* () {
            const active_view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
            if (!active_view) {
                return;
            }
            const active_file = active_view.file;
            yield active_view.save();
            const content = yield this.app.vault.read(active_file);
            const { new_content, positions } = this.replace_and_get_cursor_positions(content);
            if (positions) {
                yield this.app.vault.modify(active_file, new_content);
                this.set_cursor_location(positions);
            }
        });
    }
    get_editor_position_from_index(content, index) {
        const substr = content.substr(0, index);
        let l = 0;
        let offset = -1;
        let r = -1;
        for (; (r = substr.indexOf("\n", r + 1)) !== -1; l++, offset = r)
            ;
        offset += 1;
        const ch = content.substr(offset, index - offset).length;
        return { line: l, ch: ch };
    }
    replace_and_get_cursor_positions(content) {
        let cursor_matches = [];
        let match;
        const cursor_regex = new RegExp("<%\\s*tp.file.cursor\\((?<order>[0-9]{0,2})\\)\\s*%>", "g");
        while ((match = cursor_regex.exec(content)) != null) {
            cursor_matches.push(match);
        }
        if (cursor_matches.length === 0) {
            return {};
        }
        cursor_matches.sort((m1, m2) => {
            return Number(m1.groups["order"]) - Number(m2.groups["order"]);
        });
        const match_str = cursor_matches[0][0];
        cursor_matches = cursor_matches.filter(m => {
            return m[0] === match_str;
        });
        const positions = [];
        let index_offset = 0;
        for (let match of cursor_matches) {
            const index = match.index - index_offset;
            positions.push(this.get_editor_position_from_index(content, index));
            content = content.replace(new RegExp(escape_RegExp(match[0])), "");
            index_offset += match[0].length;
            // For tp.file.cursor(), we keep the default top to bottom
            if (match[1] === "") {
                break;
            }
        }
        return { new_content: content, positions: positions };
    }
    set_cursor_location(positions) {
        const active_view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (!active_view) {
            return;
        }
        const editor = active_view.editor;
        editor.focus();
        let selections = [];
        for (let pos of positions) {
            selections.push({ from: pos });
        }
        let transaction = {
            selections: selections
        };
        editor.transaction(transaction);
    }
}

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
  mod(window.CodeMirror);
})(function(CodeMirror) {

CodeMirror.defineMode("javascript", function(config, parserConfig) {
  var indentUnit = config.indentUnit;
  var statementIndent = parserConfig.statementIndent;
  var jsonldMode = parserConfig.jsonld;
  var jsonMode = parserConfig.json || jsonldMode;
  var trackScope = parserConfig.trackScope !== false;
  var isTS = parserConfig.typescript;
  var wordRE = parserConfig.wordCharacters || /[\w$\xa1-\uffff]/;

  // Tokenizer

  var keywords = function(){
    function kw(type) {return {type: type, style: "keyword"};}
    var A = kw("keyword a"), B = kw("keyword b"), C = kw("keyword c"), D = kw("keyword d");
    var operator = kw("operator"), atom = {type: "atom", style: "atom"};

    return {
      "if": kw("if"), "while": A, "with": A, "else": B, "do": B, "try": B, "finally": B,
      "return": D, "break": D, "continue": D, "new": kw("new"), "delete": C, "void": C, "throw": C,
      "debugger": kw("debugger"), "var": kw("var"), "const": kw("var"), "let": kw("var"),
      "function": kw("function"), "catch": kw("catch"),
      "for": kw("for"), "switch": kw("switch"), "case": kw("case"), "default": kw("default"),
      "in": operator, "typeof": operator, "instanceof": operator,
      "true": atom, "false": atom, "null": atom, "undefined": atom, "NaN": atom, "Infinity": atom,
      "this": kw("this"), "class": kw("class"), "super": kw("atom"),
      "yield": C, "export": kw("export"), "import": kw("import"), "extends": C,
      "await": C
    };
  }();

  var isOperatorChar = /[+\-*&%=<>!?|~^@]/;
  var isJsonldKeyword = /^@(context|id|value|language|type|container|list|set|reverse|index|base|vocab|graph)"/;

  function readRegexp(stream) {
    var escaped = false, next, inSet = false;
    while ((next = stream.next()) != null) {
      if (!escaped) {
        if (next == "/" && !inSet) return;
        if (next == "[") inSet = true;
        else if (inSet && next == "]") inSet = false;
      }
      escaped = !escaped && next == "\\";
    }
  }

  // Used as scratch variables to communicate multiple values without
  // consing up tons of objects.
  var type, content;
  function ret(tp, style, cont) {
    type = tp; content = cont;
    return style;
  }
  function tokenBase(stream, state) {
    var ch = stream.next();
    if (ch == '"' || ch == "'") {
      state.tokenize = tokenString(ch);
      return state.tokenize(stream, state);
    } else if (ch == "." && stream.match(/^\d[\d_]*(?:[eE][+\-]?[\d_]+)?/)) {
      return ret("number", "number");
    } else if (ch == "." && stream.match("..")) {
      return ret("spread", "meta");
    } else if (/[\[\]{}\(\),;\:\.]/.test(ch)) {
      return ret(ch);
    } else if (ch == "=" && stream.eat(">")) {
      return ret("=>", "operator");
    } else if (ch == "0" && stream.match(/^(?:x[\dA-Fa-f_]+|o[0-7_]+|b[01_]+)n?/)) {
      return ret("number", "number");
    } else if (/\d/.test(ch)) {
      stream.match(/^[\d_]*(?:n|(?:\.[\d_]*)?(?:[eE][+\-]?[\d_]+)?)?/);
      return ret("number", "number");
    } else if (ch == "/") {
      if (stream.eat("*")) {
        state.tokenize = tokenComment;
        return tokenComment(stream, state);
      } else if (stream.eat("/")) {
        stream.skipToEnd();
        return ret("comment", "comment");
      } else if (expressionAllowed(stream, state, 1)) {
        readRegexp(stream);
        stream.match(/^\b(([gimyus])(?![gimyus]*\2))+\b/);
        return ret("regexp", "string-2");
      } else {
        stream.eat("=");
        return ret("operator", "operator", stream.current());
      }
    } else if (ch == "`") {
      state.tokenize = tokenQuasi;
      return tokenQuasi(stream, state);
    } else if (ch == "#" && stream.peek() == "!") {
      stream.skipToEnd();
      return ret("meta", "meta");
    } else if (ch == "#" && stream.eatWhile(wordRE)) {
      return ret("variable", "property")
    } else if (ch == "<" && stream.match("!--") ||
               (ch == "-" && stream.match("->") && !/\S/.test(stream.string.slice(0, stream.start)))) {
      stream.skipToEnd();
      return ret("comment", "comment")
    } else if (isOperatorChar.test(ch)) {
      if (ch != ">" || !state.lexical || state.lexical.type != ">") {
        if (stream.eat("=")) {
          if (ch == "!" || ch == "=") stream.eat("=");
        } else if (/[<>*+\-|&?]/.test(ch)) {
          stream.eat(ch);
          if (ch == ">") stream.eat(ch);
        }
      }
      if (ch == "?" && stream.eat(".")) return ret(".")
      return ret("operator", "operator", stream.current());
    } else if (wordRE.test(ch)) {
      stream.eatWhile(wordRE);
      var word = stream.current();
      if (state.lastType != ".") {
        if (keywords.propertyIsEnumerable(word)) {
          var kw = keywords[word];
          return ret(kw.type, kw.style, word)
        }
        if (word == "async" && stream.match(/^(\s|\/\*([^*]|\*(?!\/))*?\*\/)*[\[\(\w]/, false))
          return ret("async", "keyword", word)
      }
      return ret("variable", "variable", word)
    }
  }

  function tokenString(quote) {
    return function(stream, state) {
      var escaped = false, next;
      if (jsonldMode && stream.peek() == "@" && stream.match(isJsonldKeyword)){
        state.tokenize = tokenBase;
        return ret("jsonld-keyword", "meta");
      }
      while ((next = stream.next()) != null) {
        if (next == quote && !escaped) break;
        escaped = !escaped && next == "\\";
      }
      if (!escaped) state.tokenize = tokenBase;
      return ret("string", "string");
    };
  }

  function tokenComment(stream, state) {
    var maybeEnd = false, ch;
    while (ch = stream.next()) {
      if (ch == "/" && maybeEnd) {
        state.tokenize = tokenBase;
        break;
      }
      maybeEnd = (ch == "*");
    }
    return ret("comment", "comment");
  }

  function tokenQuasi(stream, state) {
    var escaped = false, next;
    while ((next = stream.next()) != null) {
      if (!escaped && (next == "`" || next == "$" && stream.eat("{"))) {
        state.tokenize = tokenBase;
        break;
      }
      escaped = !escaped && next == "\\";
    }
    return ret("quasi", "string-2", stream.current());
  }

  var brackets = "([{}])";
  // This is a crude lookahead trick to try and notice that we're
  // parsing the argument patterns for a fat-arrow function before we
  // actually hit the arrow token. It only works if the arrow is on
  // the same line as the arguments and there's no strange noise
  // (comments) in between. Fallback is to only notice when we hit the
  // arrow, and not declare the arguments as locals for the arrow
  // body.
  function findFatArrow(stream, state) {
    if (state.fatArrowAt) state.fatArrowAt = null;
    var arrow = stream.string.indexOf("=>", stream.start);
    if (arrow < 0) return;

    if (isTS) { // Try to skip TypeScript return type declarations after the arguments
      var m = /:\s*(?:\w+(?:<[^>]*>|\[\])?|\{[^}]*\})\s*$/.exec(stream.string.slice(stream.start, arrow));
      if (m) arrow = m.index;
    }

    var depth = 0, sawSomething = false;
    for (var pos = arrow - 1; pos >= 0; --pos) {
      var ch = stream.string.charAt(pos);
      var bracket = brackets.indexOf(ch);
      if (bracket >= 0 && bracket < 3) {
        if (!depth) { ++pos; break; }
        if (--depth == 0) { if (ch == "(") sawSomething = true; break; }
      } else if (bracket >= 3 && bracket < 6) {
        ++depth;
      } else if (wordRE.test(ch)) {
        sawSomething = true;
      } else if (/["'\/`]/.test(ch)) {
        for (;; --pos) {
          if (pos == 0) return
          var next = stream.string.charAt(pos - 1);
          if (next == ch && stream.string.charAt(pos - 2) != "\\") { pos--; break }
        }
      } else if (sawSomething && !depth) {
        ++pos;
        break;
      }
    }
    if (sawSomething && !depth) state.fatArrowAt = pos;
  }

  // Parser

  var atomicTypes = {"atom": true, "number": true, "variable": true, "string": true,
                     "regexp": true, "this": true, "import": true, "jsonld-keyword": true};

  function JSLexical(indented, column, type, align, prev, info) {
    this.indented = indented;
    this.column = column;
    this.type = type;
    this.prev = prev;
    this.info = info;
    if (align != null) this.align = align;
  }

  function inScope(state, varname) {
    if (!trackScope) return false
    for (var v = state.localVars; v; v = v.next)
      if (v.name == varname) return true;
    for (var cx = state.context; cx; cx = cx.prev) {
      for (var v = cx.vars; v; v = v.next)
        if (v.name == varname) return true;
    }
  }

  function parseJS(state, style, type, content, stream) {
    var cc = state.cc;
    // Communicate our context to the combinators.
    // (Less wasteful than consing up a hundred closures on every call.)
    cx.state = state; cx.stream = stream; cx.marked = null, cx.cc = cc; cx.style = style;

    if (!state.lexical.hasOwnProperty("align"))
      state.lexical.align = true;

    while(true) {
      var combinator = cc.length ? cc.pop() : jsonMode ? expression : statement;
      if (combinator(type, content)) {
        while(cc.length && cc[cc.length - 1].lex)
          cc.pop()();
        if (cx.marked) return cx.marked;
        if (type == "variable" && inScope(state, content)) return "variable-2";
        return style;
      }
    }
  }

  // Combinator utils

  var cx = {state: null, column: null, marked: null, cc: null};
  function pass() {
    for (var i = arguments.length - 1; i >= 0; i--) cx.cc.push(arguments[i]);
  }
  function cont() {
    pass.apply(null, arguments);
    return true;
  }
  function inList(name, list) {
    for (var v = list; v; v = v.next) if (v.name == name) return true
    return false;
  }
  function register(varname) {
    var state = cx.state;
    cx.marked = "def";
    if (!trackScope) return
    if (state.context) {
      if (state.lexical.info == "var" && state.context && state.context.block) {
        // FIXME function decls are also not block scoped
        var newContext = registerVarScoped(varname, state.context);
        if (newContext != null) {
          state.context = newContext;
          return
        }
      } else if (!inList(varname, state.localVars)) {
        state.localVars = new Var(varname, state.localVars);
        return
      }
    }
    // Fall through means this is global
    if (parserConfig.globalVars && !inList(varname, state.globalVars))
      state.globalVars = new Var(varname, state.globalVars);
  }
  function registerVarScoped(varname, context) {
    if (!context) {
      return null
    } else if (context.block) {
      var inner = registerVarScoped(varname, context.prev);
      if (!inner) return null
      if (inner == context.prev) return context
      return new Context(inner, context.vars, true)
    } else if (inList(varname, context.vars)) {
      return context
    } else {
      return new Context(context.prev, new Var(varname, context.vars), false)
    }
  }

  function isModifier(name) {
    return name == "public" || name == "private" || name == "protected" || name == "abstract" || name == "readonly"
  }

  // Combinators

  function Context(prev, vars, block) { this.prev = prev; this.vars = vars; this.block = block; }
  function Var(name, next) { this.name = name; this.next = next; }

  var defaultVars = new Var("this", new Var("arguments", null));
  function pushcontext() {
    cx.state.context = new Context(cx.state.context, cx.state.localVars, false);
    cx.state.localVars = defaultVars;
  }
  function pushblockcontext() {
    cx.state.context = new Context(cx.state.context, cx.state.localVars, true);
    cx.state.localVars = null;
  }
  function popcontext() {
    cx.state.localVars = cx.state.context.vars;
    cx.state.context = cx.state.context.prev;
  }
  popcontext.lex = true;
  function pushlex(type, info) {
    var result = function() {
      var state = cx.state, indent = state.indented;
      if (state.lexical.type == "stat") indent = state.lexical.indented;
      else for (var outer = state.lexical; outer && outer.type == ")" && outer.align; outer = outer.prev)
        indent = outer.indented;
      state.lexical = new JSLexical(indent, cx.stream.column(), type, null, state.lexical, info);
    };
    result.lex = true;
    return result;
  }
  function poplex() {
    var state = cx.state;
    if (state.lexical.prev) {
      if (state.lexical.type == ")")
        state.indented = state.lexical.indented;
      state.lexical = state.lexical.prev;
    }
  }
  poplex.lex = true;

  function expect(wanted) {
    function exp(type) {
      if (type == wanted) return cont();
      else if (wanted == ";" || type == "}" || type == ")" || type == "]") return pass();
      else return cont(exp);
    }    return exp;
  }

  function statement(type, value) {
    if (type == "var") return cont(pushlex("vardef", value), vardef, expect(";"), poplex);
    if (type == "keyword a") return cont(pushlex("form"), parenExpr, statement, poplex);
    if (type == "keyword b") return cont(pushlex("form"), statement, poplex);
    if (type == "keyword d") return cx.stream.match(/^\s*$/, false) ? cont() : cont(pushlex("stat"), maybeexpression, expect(";"), poplex);
    if (type == "debugger") return cont(expect(";"));
    if (type == "{") return cont(pushlex("}"), pushblockcontext, block, poplex, popcontext);
    if (type == ";") return cont();
    if (type == "if") {
      if (cx.state.lexical.info == "else" && cx.state.cc[cx.state.cc.length - 1] == poplex)
        cx.state.cc.pop()();
      return cont(pushlex("form"), parenExpr, statement, poplex, maybeelse);
    }
    if (type == "function") return cont(functiondef);
    if (type == "for") return cont(pushlex("form"), pushblockcontext, forspec, statement, popcontext, poplex);
    if (type == "class" || (isTS && value == "interface")) {
      cx.marked = "keyword";
      return cont(pushlex("form", type == "class" ? type : value), className, poplex)
    }
    if (type == "variable") {
      if (isTS && value == "declare") {
        cx.marked = "keyword";
        return cont(statement)
      } else if (isTS && (value == "module" || value == "enum" || value == "type") && cx.stream.match(/^\s*\w/, false)) {
        cx.marked = "keyword";
        if (value == "enum") return cont(enumdef);
        else if (value == "type") return cont(typename, expect("operator"), typeexpr, expect(";"));
        else return cont(pushlex("form"), pattern, expect("{"), pushlex("}"), block, poplex, poplex)
      } else if (isTS && value == "namespace") {
        cx.marked = "keyword";
        return cont(pushlex("form"), expression, statement, poplex)
      } else if (isTS && value == "abstract") {
        cx.marked = "keyword";
        return cont(statement)
      } else {
        return cont(pushlex("stat"), maybelabel);
      }
    }
    if (type == "switch") return cont(pushlex("form"), parenExpr, expect("{"), pushlex("}", "switch"), pushblockcontext,
                                      block, poplex, poplex, popcontext);
    if (type == "case") return cont(expression, expect(":"));
    if (type == "default") return cont(expect(":"));
    if (type == "catch") return cont(pushlex("form"), pushcontext, maybeCatchBinding, statement, poplex, popcontext);
    if (type == "export") return cont(pushlex("stat"), afterExport, poplex);
    if (type == "import") return cont(pushlex("stat"), afterImport, poplex);
    if (type == "async") return cont(statement)
    if (value == "@") return cont(expression, statement)
    return pass(pushlex("stat"), expression, expect(";"), poplex);
  }
  function maybeCatchBinding(type) {
    if (type == "(") return cont(funarg, expect(")"))
  }
  function expression(type, value) {
    return expressionInner(type, value, false);
  }
  function expressionNoComma(type, value) {
    return expressionInner(type, value, true);
  }
  function parenExpr(type) {
    if (type != "(") return pass()
    return cont(pushlex(")"), maybeexpression, expect(")"), poplex)
  }
  function expressionInner(type, value, noComma) {
    if (cx.state.fatArrowAt == cx.stream.start) {
      var body = noComma ? arrowBodyNoComma : arrowBody;
      if (type == "(") return cont(pushcontext, pushlex(")"), commasep(funarg, ")"), poplex, expect("=>"), body, popcontext);
      else if (type == "variable") return pass(pushcontext, pattern, expect("=>"), body, popcontext);
    }

    var maybeop = noComma ? maybeoperatorNoComma : maybeoperatorComma;
    if (atomicTypes.hasOwnProperty(type)) return cont(maybeop);
    if (type == "function") return cont(functiondef, maybeop);
    if (type == "class" || (isTS && value == "interface")) { cx.marked = "keyword"; return cont(pushlex("form"), classExpression, poplex); }
    if (type == "keyword c" || type == "async") return cont(noComma ? expressionNoComma : expression);
    if (type == "(") return cont(pushlex(")"), maybeexpression, expect(")"), poplex, maybeop);
    if (type == "operator" || type == "spread") return cont(noComma ? expressionNoComma : expression);
    if (type == "[") return cont(pushlex("]"), arrayLiteral, poplex, maybeop);
    if (type == "{") return contCommasep(objprop, "}", null, maybeop);
    if (type == "quasi") return pass(quasi, maybeop);
    if (type == "new") return cont(maybeTarget(noComma));
    return cont();
  }
  function maybeexpression(type) {
    if (type.match(/[;\}\)\],]/)) return pass();
    return pass(expression);
  }

  function maybeoperatorComma(type, value) {
    if (type == ",") return cont(maybeexpression);
    return maybeoperatorNoComma(type, value, false);
  }
  function maybeoperatorNoComma(type, value, noComma) {
    var me = noComma == false ? maybeoperatorComma : maybeoperatorNoComma;
    var expr = noComma == false ? expression : expressionNoComma;
    if (type == "=>") return cont(pushcontext, noComma ? arrowBodyNoComma : arrowBody, popcontext);
    if (type == "operator") {
      if (/\+\+|--/.test(value) || isTS && value == "!") return cont(me);
      if (isTS && value == "<" && cx.stream.match(/^([^<>]|<[^<>]*>)*>\s*\(/, false))
        return cont(pushlex(">"), commasep(typeexpr, ">"), poplex, me);
      if (value == "?") return cont(expression, expect(":"), expr);
      return cont(expr);
    }
    if (type == "quasi") { return pass(quasi, me); }
    if (type == ";") return;
    if (type == "(") return contCommasep(expressionNoComma, ")", "call", me);
    if (type == ".") return cont(property, me);
    if (type == "[") return cont(pushlex("]"), maybeexpression, expect("]"), poplex, me);
    if (isTS && value == "as") { cx.marked = "keyword"; return cont(typeexpr, me) }
    if (type == "regexp") {
      cx.state.lastType = cx.marked = "operator";
      cx.stream.backUp(cx.stream.pos - cx.stream.start - 1);
      return cont(expr)
    }
  }
  function quasi(type, value) {
    if (type != "quasi") return pass();
    if (value.slice(value.length - 2) != "${") return cont(quasi);
    return cont(maybeexpression, continueQuasi);
  }
  function continueQuasi(type) {
    if (type == "}") {
      cx.marked = "string-2";
      cx.state.tokenize = tokenQuasi;
      return cont(quasi);
    }
  }
  function arrowBody(type) {
    findFatArrow(cx.stream, cx.state);
    return pass(type == "{" ? statement : expression);
  }
  function arrowBodyNoComma(type) {
    findFatArrow(cx.stream, cx.state);
    return pass(type == "{" ? statement : expressionNoComma);
  }
  function maybeTarget(noComma) {
    return function(type) {
      if (type == ".") return cont(noComma ? targetNoComma : target);
      else if (type == "variable" && isTS) return cont(maybeTypeArgs, noComma ? maybeoperatorNoComma : maybeoperatorComma)
      else return pass(noComma ? expressionNoComma : expression);
    };
  }
  function target(_, value) {
    if (value == "target") { cx.marked = "keyword"; return cont(maybeoperatorComma); }
  }
  function targetNoComma(_, value) {
    if (value == "target") { cx.marked = "keyword"; return cont(maybeoperatorNoComma); }
  }
  function maybelabel(type) {
    if (type == ":") return cont(poplex, statement);
    return pass(maybeoperatorComma, expect(";"), poplex);
  }
  function property(type) {
    if (type == "variable") {cx.marked = "property"; return cont();}
  }
  function objprop(type, value) {
    if (type == "async") {
      cx.marked = "property";
      return cont(objprop);
    } else if (type == "variable" || cx.style == "keyword") {
      cx.marked = "property";
      if (value == "get" || value == "set") return cont(getterSetter);
      var m; // Work around fat-arrow-detection complication for detecting typescript typed arrow params
      if (isTS && cx.state.fatArrowAt == cx.stream.start && (m = cx.stream.match(/^\s*:\s*/, false)))
        cx.state.fatArrowAt = cx.stream.pos + m[0].length;
      return cont(afterprop);
    } else if (type == "number" || type == "string") {
      cx.marked = jsonldMode ? "property" : (cx.style + " property");
      return cont(afterprop);
    } else if (type == "jsonld-keyword") {
      return cont(afterprop);
    } else if (isTS && isModifier(value)) {
      cx.marked = "keyword";
      return cont(objprop)
    } else if (type == "[") {
      return cont(expression, maybetype, expect("]"), afterprop);
    } else if (type == "spread") {
      return cont(expressionNoComma, afterprop);
    } else if (value == "*") {
      cx.marked = "keyword";
      return cont(objprop);
    } else if (type == ":") {
      return pass(afterprop)
    }
  }
  function getterSetter(type) {
    if (type != "variable") return pass(afterprop);
    cx.marked = "property";
    return cont(functiondef);
  }
  function afterprop(type) {
    if (type == ":") return cont(expressionNoComma);
    if (type == "(") return pass(functiondef);
  }
  function commasep(what, end, sep) {
    function proceed(type, value) {
      if (sep ? sep.indexOf(type) > -1 : type == ",") {
        var lex = cx.state.lexical;
        if (lex.info == "call") lex.pos = (lex.pos || 0) + 1;
        return cont(function(type, value) {
          if (type == end || value == end) return pass()
          return pass(what)
        }, proceed);
      }
      if (type == end || value == end) return cont();
      if (sep && sep.indexOf(";") > -1) return pass(what)
      return cont(expect(end));
    }
    return function(type, value) {
      if (type == end || value == end) return cont();
      return pass(what, proceed);
    };
  }
  function contCommasep(what, end, info) {
    for (var i = 3; i < arguments.length; i++)
      cx.cc.push(arguments[i]);
    return cont(pushlex(end, info), commasep(what, end), poplex);
  }
  function block(type) {
    if (type == "}") return cont();
    return pass(statement, block);
  }
  function maybetype(type, value) {
    if (isTS) {
      if (type == ":") return cont(typeexpr);
      if (value == "?") return cont(maybetype);
    }
  }
  function maybetypeOrIn(type, value) {
    if (isTS && (type == ":" || value == "in")) return cont(typeexpr)
  }
  function mayberettype(type) {
    if (isTS && type == ":") {
      if (cx.stream.match(/^\s*\w+\s+is\b/, false)) return cont(expression, isKW, typeexpr)
      else return cont(typeexpr)
    }
  }
  function isKW(_, value) {
    if (value == "is") {
      cx.marked = "keyword";
      return cont()
    }
  }
  function typeexpr(type, value) {
    if (value == "keyof" || value == "typeof" || value == "infer" || value == "readonly") {
      cx.marked = "keyword";
      return cont(value == "typeof" ? expressionNoComma : typeexpr)
    }
    if (type == "variable" || value == "void") {
      cx.marked = "type";
      return cont(afterType)
    }
    if (value == "|" || value == "&") return cont(typeexpr)
    if (type == "string" || type == "number" || type == "atom") return cont(afterType);
    if (type == "[") return cont(pushlex("]"), commasep(typeexpr, "]", ","), poplex, afterType)
    if (type == "{") return cont(pushlex("}"), typeprops, poplex, afterType)
    if (type == "(") return cont(commasep(typearg, ")"), maybeReturnType, afterType)
    if (type == "<") return cont(commasep(typeexpr, ">"), typeexpr)
    if (type == "quasi") { return pass(quasiType, afterType); }
  }
  function maybeReturnType(type) {
    if (type == "=>") return cont(typeexpr)
  }
  function typeprops(type) {
    if (type.match(/[\}\)\]]/)) return cont()
    if (type == "," || type == ";") return cont(typeprops)
    return pass(typeprop, typeprops)
  }
  function typeprop(type, value) {
    if (type == "variable" || cx.style == "keyword") {
      cx.marked = "property";
      return cont(typeprop)
    } else if (value == "?" || type == "number" || type == "string") {
      return cont(typeprop)
    } else if (type == ":") {
      return cont(typeexpr)
    } else if (type == "[") {
      return cont(expect("variable"), maybetypeOrIn, expect("]"), typeprop)
    } else if (type == "(") {
      return pass(functiondecl, typeprop)
    } else if (!type.match(/[;\}\)\],]/)) {
      return cont()
    }
  }
  function quasiType(type, value) {
    if (type != "quasi") return pass();
    if (value.slice(value.length - 2) != "${") return cont(quasiType);
    return cont(typeexpr, continueQuasiType);
  }
  function continueQuasiType(type) {
    if (type == "}") {
      cx.marked = "string-2";
      cx.state.tokenize = tokenQuasi;
      return cont(quasiType);
    }
  }
  function typearg(type, value) {
    if (type == "variable" && cx.stream.match(/^\s*[?:]/, false) || value == "?") return cont(typearg)
    if (type == ":") return cont(typeexpr)
    if (type == "spread") return cont(typearg)
    return pass(typeexpr)
  }
  function afterType(type, value) {
    if (value == "<") return cont(pushlex(">"), commasep(typeexpr, ">"), poplex, afterType)
    if (value == "|" || type == "." || value == "&") return cont(typeexpr)
    if (type == "[") return cont(typeexpr, expect("]"), afterType)
    if (value == "extends" || value == "implements") { cx.marked = "keyword"; return cont(typeexpr) }
    if (value == "?") return cont(typeexpr, expect(":"), typeexpr)
  }
  function maybeTypeArgs(_, value) {
    if (value == "<") return cont(pushlex(">"), commasep(typeexpr, ">"), poplex, afterType)
  }
  function typeparam() {
    return pass(typeexpr, maybeTypeDefault)
  }
  function maybeTypeDefault(_, value) {
    if (value == "=") return cont(typeexpr)
  }
  function vardef(_, value) {
    if (value == "enum") {cx.marked = "keyword"; return cont(enumdef)}
    return pass(pattern, maybetype, maybeAssign, vardefCont);
  }
  function pattern(type, value) {
    if (isTS && isModifier(value)) { cx.marked = "keyword"; return cont(pattern) }
    if (type == "variable") { register(value); return cont(); }
    if (type == "spread") return cont(pattern);
    if (type == "[") return contCommasep(eltpattern, "]");
    if (type == "{") return contCommasep(proppattern, "}");
  }
  function proppattern(type, value) {
    if (type == "variable" && !cx.stream.match(/^\s*:/, false)) {
      register(value);
      return cont(maybeAssign);
    }
    if (type == "variable") cx.marked = "property";
    if (type == "spread") return cont(pattern);
    if (type == "}") return pass();
    if (type == "[") return cont(expression, expect(']'), expect(':'), proppattern);
    return cont(expect(":"), pattern, maybeAssign);
  }
  function eltpattern() {
    return pass(pattern, maybeAssign)
  }
  function maybeAssign(_type, value) {
    if (value == "=") return cont(expressionNoComma);
  }
  function vardefCont(type) {
    if (type == ",") return cont(vardef);
  }
  function maybeelse(type, value) {
    if (type == "keyword b" && value == "else") return cont(pushlex("form", "else"), statement, poplex);
  }
  function forspec(type, value) {
    if (value == "await") return cont(forspec);
    if (type == "(") return cont(pushlex(")"), forspec1, poplex);
  }
  function forspec1(type) {
    if (type == "var") return cont(vardef, forspec2);
    if (type == "variable") return cont(forspec2);
    return pass(forspec2)
  }
  function forspec2(type, value) {
    if (type == ")") return cont()
    if (type == ";") return cont(forspec2)
    if (value == "in" || value == "of") { cx.marked = "keyword"; return cont(expression, forspec2) }
    return pass(expression, forspec2)
  }
  function functiondef(type, value) {
    if (value == "*") {cx.marked = "keyword"; return cont(functiondef);}
    if (type == "variable") {register(value); return cont(functiondef);}
    if (type == "(") return cont(pushcontext, pushlex(")"), commasep(funarg, ")"), poplex, mayberettype, statement, popcontext);
    if (isTS && value == "<") return cont(pushlex(">"), commasep(typeparam, ">"), poplex, functiondef)
  }
  function functiondecl(type, value) {
    if (value == "*") {cx.marked = "keyword"; return cont(functiondecl);}
    if (type == "variable") {register(value); return cont(functiondecl);}
    if (type == "(") return cont(pushcontext, pushlex(")"), commasep(funarg, ")"), poplex, mayberettype, popcontext);
    if (isTS && value == "<") return cont(pushlex(">"), commasep(typeparam, ">"), poplex, functiondecl)
  }
  function typename(type, value) {
    if (type == "keyword" || type == "variable") {
      cx.marked = "type";
      return cont(typename)
    } else if (value == "<") {
      return cont(pushlex(">"), commasep(typeparam, ">"), poplex)
    }
  }
  function funarg(type, value) {
    if (value == "@") cont(expression, funarg);
    if (type == "spread") return cont(funarg);
    if (isTS && isModifier(value)) { cx.marked = "keyword"; return cont(funarg); }
    if (isTS && type == "this") return cont(maybetype, maybeAssign)
    return pass(pattern, maybetype, maybeAssign);
  }
  function classExpression(type, value) {
    // Class expressions may have an optional name.
    if (type == "variable") return className(type, value);
    return classNameAfter(type, value);
  }
  function className(type, value) {
    if (type == "variable") {register(value); return cont(classNameAfter);}
  }
  function classNameAfter(type, value) {
    if (value == "<") return cont(pushlex(">"), commasep(typeparam, ">"), poplex, classNameAfter)
    if (value == "extends" || value == "implements" || (isTS && type == ",")) {
      if (value == "implements") cx.marked = "keyword";
      return cont(isTS ? typeexpr : expression, classNameAfter);
    }
    if (type == "{") return cont(pushlex("}"), classBody, poplex);
  }
  function classBody(type, value) {
    if (type == "async" ||
        (type == "variable" &&
         (value == "static" || value == "get" || value == "set" || (isTS && isModifier(value))) &&
         cx.stream.match(/^\s+[\w$\xa1-\uffff]/, false))) {
      cx.marked = "keyword";
      return cont(classBody);
    }
    if (type == "variable" || cx.style == "keyword") {
      cx.marked = "property";
      return cont(classfield, classBody);
    }
    if (type == "number" || type == "string") return cont(classfield, classBody);
    if (type == "[")
      return cont(expression, maybetype, expect("]"), classfield, classBody)
    if (value == "*") {
      cx.marked = "keyword";
      return cont(classBody);
    }
    if (isTS && type == "(") return pass(functiondecl, classBody)
    if (type == ";" || type == ",") return cont(classBody);
    if (type == "}") return cont();
    if (value == "@") return cont(expression, classBody)
  }
  function classfield(type, value) {
    if (value == "!") return cont(classfield)
    if (value == "?") return cont(classfield)
    if (type == ":") return cont(typeexpr, maybeAssign)
    if (value == "=") return cont(expressionNoComma)
    var context = cx.state.lexical.prev, isInterface = context && context.info == "interface";
    return pass(isInterface ? functiondecl : functiondef)
  }
  function afterExport(type, value) {
    if (value == "*") { cx.marked = "keyword"; return cont(maybeFrom, expect(";")); }
    if (value == "default") { cx.marked = "keyword"; return cont(expression, expect(";")); }
    if (type == "{") return cont(commasep(exportField, "}"), maybeFrom, expect(";"));
    return pass(statement);
  }
  function exportField(type, value) {
    if (value == "as") { cx.marked = "keyword"; return cont(expect("variable")); }
    if (type == "variable") return pass(expressionNoComma, exportField);
  }
  function afterImport(type) {
    if (type == "string") return cont();
    if (type == "(") return pass(expression);
    if (type == ".") return pass(maybeoperatorComma);
    return pass(importSpec, maybeMoreImports, maybeFrom);
  }
  function importSpec(type, value) {
    if (type == "{") return contCommasep(importSpec, "}");
    if (type == "variable") register(value);
    if (value == "*") cx.marked = "keyword";
    return cont(maybeAs);
  }
  function maybeMoreImports(type) {
    if (type == ",") return cont(importSpec, maybeMoreImports)
  }
  function maybeAs(_type, value) {
    if (value == "as") { cx.marked = "keyword"; return cont(importSpec); }
  }
  function maybeFrom(_type, value) {
    if (value == "from") { cx.marked = "keyword"; return cont(expression); }
  }
  function arrayLiteral(type) {
    if (type == "]") return cont();
    return pass(commasep(expressionNoComma, "]"));
  }
  function enumdef() {
    return pass(pushlex("form"), pattern, expect("{"), pushlex("}"), commasep(enummember, "}"), poplex, poplex)
  }
  function enummember() {
    return pass(pattern, maybeAssign);
  }

  function isContinuedStatement(state, textAfter) {
    return state.lastType == "operator" || state.lastType == "," ||
      isOperatorChar.test(textAfter.charAt(0)) ||
      /[,.]/.test(textAfter.charAt(0));
  }

  function expressionAllowed(stream, state, backUp) {
    return state.tokenize == tokenBase &&
      /^(?:operator|sof|keyword [bcd]|case|new|export|default|spread|[\[{}\(,;:]|=>)$/.test(state.lastType) ||
      (state.lastType == "quasi" && /\{\s*$/.test(stream.string.slice(0, stream.pos - (backUp || 0))))
  }

  // Interface

  return {
    startState: function(basecolumn) {
      var state = {
        tokenize: tokenBase,
        lastType: "sof",
        cc: [],
        lexical: new JSLexical((basecolumn || 0) - indentUnit, 0, "block", false),
        localVars: parserConfig.localVars,
        context: parserConfig.localVars && new Context(null, null, false),
        indented: basecolumn || 0
      };
      if (parserConfig.globalVars && typeof parserConfig.globalVars == "object")
        state.globalVars = parserConfig.globalVars;
      return state;
    },

    token: function(stream, state) {
      if (stream.sol()) {
        if (!state.lexical.hasOwnProperty("align"))
          state.lexical.align = false;
        state.indented = stream.indentation();
        findFatArrow(stream, state);
      }
      if (state.tokenize != tokenComment && stream.eatSpace()) return null;
      var style = state.tokenize(stream, state);
      if (type == "comment") return style;
      state.lastType = type == "operator" && (content == "++" || content == "--") ? "incdec" : type;
      return parseJS(state, style, type, content, stream);
    },

    indent: function(state, textAfter) {
      if (state.tokenize == tokenComment || state.tokenize == tokenQuasi) return CodeMirror.Pass;
      if (state.tokenize != tokenBase) return 0;
      var firstChar = textAfter && textAfter.charAt(0), lexical = state.lexical, top;
      // Kludge to prevent 'maybelse' from blocking lexical scope pops
      if (!/^\s*else\b/.test(textAfter)) for (var i = state.cc.length - 1; i >= 0; --i) {
        var c = state.cc[i];
        if (c == poplex) lexical = lexical.prev;
        else if (c != maybeelse && c != popcontext) break;
      }
      while ((lexical.type == "stat" || lexical.type == "form") &&
             (firstChar == "}" || ((top = state.cc[state.cc.length - 1]) &&
                                   (top == maybeoperatorComma || top == maybeoperatorNoComma) &&
                                   !/^[,\.=+\-*:?[\(]/.test(textAfter))))
        lexical = lexical.prev;
      if (statementIndent && lexical.type == ")" && lexical.prev.type == "stat")
        lexical = lexical.prev;
      var type = lexical.type, closing = firstChar == type;

      if (type == "vardef") return lexical.indented + (state.lastType == "operator" || state.lastType == "," ? lexical.info.length + 1 : 0);
      else if (type == "form" && firstChar == "{") return lexical.indented;
      else if (type == "form") return lexical.indented + indentUnit;
      else if (type == "stat")
        return lexical.indented + (isContinuedStatement(state, textAfter) ? statementIndent || indentUnit : 0);
      else if (lexical.info == "switch" && !closing && parserConfig.doubleIndentSwitch != false)
        return lexical.indented + (/^(?:case|default)\b/.test(textAfter) ? indentUnit : 2 * indentUnit);
      else if (lexical.align) return lexical.column + (closing ? 0 : 1);
      else return lexical.indented + (closing ? 0 : indentUnit);
    },

    electricInput: /^\s*(?:case .*?:|default:|\{|\})$/,
    blockCommentStart: jsonMode ? null : "/*",
    blockCommentEnd: jsonMode ? null : "*/",
    blockCommentContinue: jsonMode ? null : " * ",
    lineComment: jsonMode ? null : "//",
    fold: "brace",
    closeBrackets: "()[]{}''\"\"``",

    helperType: jsonMode ? "json" : "javascript",
    jsonldMode: jsonldMode,
    jsonMode: jsonMode,

    expressionAllowed: expressionAllowed,

    skipExpression: function(state) {
      parseJS(state, "atom", "atom", "true", new CodeMirror.StringStream("", 2, null));
    }
  };
});

CodeMirror.registerHelper("wordChars", "javascript", /[\w$]/);

CodeMirror.defineMIME("text/javascript", "javascript");
CodeMirror.defineMIME("text/ecmascript", "javascript");
CodeMirror.defineMIME("application/javascript", "javascript");
CodeMirror.defineMIME("application/x-javascript", "javascript");
CodeMirror.defineMIME("application/ecmascript", "javascript");
CodeMirror.defineMIME("application/json", { name: "javascript", json: true });
CodeMirror.defineMIME("application/x-json", { name: "javascript", json: true });
CodeMirror.defineMIME("application/manifest+json", { name: "javascript", json: true });
CodeMirror.defineMIME("application/ld+json", { name: "javascript", jsonld: true });
CodeMirror.defineMIME("text/typescript", { name: "javascript", typescript: true });
CodeMirror.defineMIME("application/typescript", { name: "javascript", typescript: true });

});

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

// Utility function that allows modes to be combined. The mode given
// as the base argument takes care of most of the normal mode
// functionality, but a second (typically simple) mode is used, which
// can override the style of text. Both modes get to parse all of the
// text, but when both assign a non-null style to a piece of code, the
// overlay wins, unless the combine argument was true and not overridden,
// or state.overlay.combineTokens was true, in which case the styles are
// combined.

(function(mod) {
  mod(window.CodeMirror);
})(function(CodeMirror) {

CodeMirror.customOverlayMode = function(base, overlay, combine) {
  return {
    startState: function() {
      return {
        base: CodeMirror.startState(base),
        overlay: CodeMirror.startState(overlay),
        basePos: 0, baseCur: null,
        overlayPos: 0, overlayCur: null,
        streamSeen: null
      };
    },
    copyState: function(state) {
      return {
        base: CodeMirror.copyState(base, state.base),
        overlay: CodeMirror.copyState(overlay, state.overlay),
        basePos: state.basePos, baseCur: null,
        overlayPos: state.overlayPos, overlayCur: null
      };
    },

    token: function(stream, state) {
      if (stream != state.streamSeen ||
          Math.min(state.basePos, state.overlayPos) < stream.start) {
        state.streamSeen = stream;
        state.basePos = state.overlayPos = stream.start;
      }

      if (stream.start == state.basePos) {
        state.baseCur = base.token(stream, state.base);
        state.basePos = stream.pos;
      }
      if (stream.start == state.overlayPos) {
        stream.pos = stream.start;
        state.overlayCur = overlay.token(stream, state.overlay);
        state.overlayPos = stream.pos;
      }
      stream.pos = Math.min(state.basePos, state.overlayPos);

      // Edge case for codeblocks in templater mode
      if (state.baseCur && state.overlayCur && state.baseCur.contains("line-HyperMD-codeblock")) {
        state.overlayCur = state.overlayCur.replace("line-templater-inline", "");
        state.overlayCur += ` line-background-HyperMD-codeblock-bg`;
      }

      // state.overlay.combineTokens always takes precedence over combine,
      // unless set to null
      if (state.overlayCur == null) return state.baseCur;
      else if (state.baseCur != null &&
               state.overlay.combineTokens ||
               combine && state.overlay.combineTokens == null)
        return state.baseCur + " " + state.overlayCur;
      else return state.overlayCur;
    },

    indent: base.indent && function(state, textAfter, line) {
      return base.indent(state.base, textAfter, line);
    },
    electricChars: base.electricChars,

    innerMode: function(state) { return {state: state.base, mode: base}; },

    blankLine: function(state) {
      var baseToken, overlayToken;
      if (base.blankLine) baseToken = base.blankLine(state.base);
      if (overlay.blankLine) overlayToken = overlay.blankLine(state.overlay);

      return overlayToken == null ?
        baseToken :
        (combine && baseToken != null ? baseToken + " " + overlayToken : overlayToken);
    }
  };
};

});

//import "editor/mode/show-hint";
const TP_CMD_TOKEN_CLASS = "templater-command";
const TP_INLINE_CLASS = "templater-inline";
const TP_OPENING_TAG_TOKEN_CLASS = "templater-opening-tag";
const TP_CLOSING_TAG_TOKEN_CLASS = "templater-closing-tag";
const TP_INTERPOLATION_TAG_TOKEN_CLASS = "templater-interpolation-tag";
const TP_RAW_TAG_TOKEN_CLASS = "templater-raw-tag";
const TP_EXEC_TAG_TOKEN_CLASS = "templater-execution-tag";
class Editor {
    constructor(app, plugin) {
        this.app = app;
        this.plugin = plugin;
        this.cursor_jumper = new CursorJumper(this.app);
    }
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.registerCodeMirrorMode();
            //await this.registerHinter();
        });
    }
    jump_to_next_cursor_location() {
        return __awaiter(this, void 0, void 0, function* () {
            this.cursor_jumper.jump_to_next_cursor_location();
        });
    }
    registerCodeMirrorMode() {
        return __awaiter(this, void 0, void 0, function* () {
            // cm-editor-syntax-highlight-obsidian plugin
            // https://codemirror.net/doc/manual.html#modeapi
            // https://codemirror.net/mode/diff/diff.js
            // https://codemirror.net/demo/mustache.html
            // https://marijnhaverbeke.nl/blog/codemirror-mode-system.html
            if (!this.plugin.settings.syntax_highlighting) {
                return;
            }
            // TODO: Add mobile support
            if (obsidian.Platform.isMobileApp) {
                return;
            }
            const js_mode = window.CodeMirror.getMode({}, "javascript");
            if (js_mode.name === "null") {
                log_error(new TemplaterError("Javascript syntax mode couldn't be found, can't enable syntax highlighting."));
                return;
            }
            // Custom overlay mode used to handle edge cases
            // @ts-ignore
            const overlay_mode = window.CodeMirror.customOverlayMode;
            if (overlay_mode == null) {
                log_error(new TemplaterError("Couldn't find customOverlayMode, can't enable syntax highlighting."));
                return;
            }
            window.CodeMirror.defineMode("templater", function (config, parserConfig) {
                const templaterOverlay = {
                    startState: function () {
                        const js_state = window.CodeMirror.startState(js_mode);
                        return Object.assign(Object.assign({}, js_state), { inCommand: false, tag_class: "", freeLine: false });
                    },
                    copyState: function (state) {
                        const js_state = window.CodeMirror.startState(js_mode);
                        const new_state = Object.assign(Object.assign({}, js_state), { inCommand: state.inCommand, tag_class: state.tag_class, freeLine: state.freeLine });
                        return new_state;
                    },
                    blankLine: function (state) {
                        if (state.inCommand) {
                            return `line-background-templater-command-bg`;
                        }
                        return null;
                    },
                    token: function (stream, state) {
                        if (stream.sol() && state.inCommand) {
                            state.freeLine = true;
                        }
                        if (state.inCommand) {
                            let keywords = "";
                            if (stream.match(/[\-_]{0,1}%>/, true)) {
                                state.inCommand = false;
                                state.freeLine = false;
                                const tag_class = state.tag_class;
                                state.tag_class = "";
                                return `line-${TP_INLINE_CLASS} ${TP_CMD_TOKEN_CLASS} ${TP_CLOSING_TAG_TOKEN_CLASS} ${tag_class}`;
                            }
                            const js_result = js_mode.token(stream, state);
                            if (stream.peek() == null && state.freeLine) {
                                keywords += ` line-background-templater-command-bg`;
                            }
                            if (!state.freeLine) {
                                keywords += ` line-${TP_INLINE_CLASS}`;
                            }
                            return `${keywords} ${TP_CMD_TOKEN_CLASS} ${js_result}`;
                        }
                        const match = stream.match(/<%[\-_]{0,1}\s*([*~+]{0,1})/, true);
                        if (match != null) {
                            switch (match[1]) {
                                case '*':
                                    state.tag_class = TP_EXEC_TAG_TOKEN_CLASS;
                                    break;
                                case '~':
                                    state.tag_class = TP_RAW_TAG_TOKEN_CLASS;
                                    break;
                                default:
                                    state.tag_class = TP_INTERPOLATION_TAG_TOKEN_CLASS;
                                    break;
                            }
                            state.inCommand = true;
                            return `line-${TP_INLINE_CLASS} ${TP_CMD_TOKEN_CLASS} ${TP_OPENING_TAG_TOKEN_CLASS} ${state.tag_class}`;
                        }
                        while (stream.next() != null && !stream.match(/<%/, false))
                            ;
                        return null;
                    }
                };
                return overlay_mode(window.CodeMirror.getMode(config, "hypermd"), templaterOverlay);
            });
        });
    }
    registerHinter() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO
            /*
            await delay(1000);
    
            var comp = [
                ["here", "hither"],
                ["asynchronous", "nonsynchronous"],
                ["completion", "achievement", "conclusion", "culmination", "expirations"],
                ["hinting", "advise", "broach", "imply"],
                ["function","action"],
                ["provide", "add", "bring", "give"],
                ["synonyms", "equivalents"],
                ["words", "token"],
                ["each", "every"],
            ];
        
            function synonyms(cm: any, option: any) {
                return new Promise(function(accept) {
                    setTimeout(function() {
                        var cursor = cm.getCursor(), line = cm.getLine(cursor.line)
                        var start = cursor.ch, end = cursor.ch
                        while (start && /\w/.test(line.charAt(start - 1))) --start
                        while (end < line.length && /\w/.test(line.charAt(end))) ++end
                        var word = line.slice(start, end).toLowerCase()
                        for (var i = 0; i < comp.length; i++) {
                            if (comp[i].indexOf(word) != -1) {
                                return accept({
                                    list: comp[i],
                                    from: window.CodeMirror.Pos(cursor.line, start),
                                    to: window.CodeMirror.Pos(cursor.line, end)
                                });
                            }
                        }
                        return accept(null);
                    }, 100)
                });
            }
    
            this.app.workspace.on("codemirror", cm => {
                cm.setOption("extraKeys", {"Ctrl-Space": "autocomplete"});
                cm.setOption("hintOptions", {hint: synonyms});
            });
    
            this.app.workspace.iterateCodeMirrors(cm => {
                console.log("CM:", cm);
                cm.setOption("extraKeys", {"Space": "autocomplete"});
                cm.setOption("hintOptions", {hint: synonyms});
            });
            */
        });
    }
}

function setPrototypeOf(obj, proto) {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    if (Object.setPrototypeOf) {
        Object.setPrototypeOf(obj, proto);
    }
    else {
        obj.__proto__ = proto;
    }
}
// This is pretty much the only way to get nice, extended Errors
// without using ES6
/**
 * This returns a new Error with a custom prototype. Note that it's _not_ a constructor
 *
 * @param message Error message
 *
 * **Example**
 *
 * ```js
 * throw EtaErr("template not found")
 * ```
 */
function EtaErr(message) {
    var err = new Error(message);
    setPrototypeOf(err, EtaErr.prototype);
    return err;
}
EtaErr.prototype = Object.create(Error.prototype, {
    name: { value: 'Eta Error', enumerable: false }
});
/**
 * Throws an EtaErr with a nicely formatted error and message showing where in the template the error occurred.
 */
function ParseErr(message, str, indx) {
    var whitespace = str.slice(0, indx).split(/\n/);
    var lineNo = whitespace.length;
    var colNo = whitespace[lineNo - 1].length + 1;
    message +=
        ' at line ' +
            lineNo +
            ' col ' +
            colNo +
            ':\n\n' +
            '  ' +
            str.split(/\n/)[lineNo - 1] +
            '\n' +
            '  ' +
            Array(colNo).join(' ') +
            '^';
    throw EtaErr(message);
}

/**
 * @returns The global Promise function
 */
var promiseImpl = new Function('return this')().Promise;
/**
 * @returns A new AsyncFunction constuctor
 */
function getAsyncFunctionConstructor() {
    try {
        return new Function('return (async function(){}).constructor')();
    }
    catch (e) {
        if (e instanceof SyntaxError) {
            throw EtaErr("This environment doesn't support async/await");
        }
        else {
            throw e;
        }
    }
}
/**
 * str.trimLeft polyfill
 *
 * @param str - Input string
 * @returns The string with left whitespace removed
 *
 */
function trimLeft(str) {
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!String.prototype.trimLeft) {
        return str.trimLeft();
    }
    else {
        return str.replace(/^\s+/, '');
    }
}
/**
 * str.trimRight polyfill
 *
 * @param str - Input string
 * @returns The string with right whitespace removed
 *
 */
function trimRight(str) {
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!String.prototype.trimRight) {
        return str.trimRight();
    }
    else {
        return str.replace(/\s+$/, ''); // TODO: do we really need to replace BOM's?
    }
}

// TODO: allow '-' to trim up until newline. Use [^\S\n\r] instead of \s
/* END TYPES */
function hasOwnProp(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}
function copyProps(toObj, fromObj) {
    for (var key in fromObj) {
        if (hasOwnProp(fromObj, key)) {
            toObj[key] = fromObj[key];
        }
    }
    return toObj;
}
/**
 * Takes a string within a template and trims it, based on the preceding tag's whitespace control and `config.autoTrim`
 */
function trimWS(str, config, wsLeft, wsRight) {
    var leftTrim;
    var rightTrim;
    if (Array.isArray(config.autoTrim)) {
        // kinda confusing
        // but _}} will trim the left side of the following string
        leftTrim = config.autoTrim[1];
        rightTrim = config.autoTrim[0];
    }
    else {
        leftTrim = rightTrim = config.autoTrim;
    }
    if (wsLeft || wsLeft === false) {
        leftTrim = wsLeft;
    }
    if (wsRight || wsRight === false) {
        rightTrim = wsRight;
    }
    if (!rightTrim && !leftTrim) {
        return str;
    }
    if (leftTrim === 'slurp' && rightTrim === 'slurp') {
        return str.trim();
    }
    if (leftTrim === '_' || leftTrim === 'slurp') {
        // console.log('trimming left' + leftTrim)
        // full slurp
        str = trimLeft(str);
    }
    else if (leftTrim === '-' || leftTrim === 'nl') {
        // nl trim
        str = str.replace(/^(?:\r\n|\n|\r)/, '');
    }
    if (rightTrim === '_' || rightTrim === 'slurp') {
        // full slurp
        str = trimRight(str);
    }
    else if (rightTrim === '-' || rightTrim === 'nl') {
        // nl trim
        str = str.replace(/(?:\r\n|\n|\r)$/, ''); // TODO: make sure this gets \r\n
    }
    return str;
}
/**
 * A map of special HTML characters to their XML-escaped equivalents
 */
var escMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
};
function replaceChar(s) {
    return escMap[s];
}
/**
 * XML-escapes an input value after converting it to a string
 *
 * @param str - Input value (usually a string)
 * @returns XML-escaped string
 */
function XMLEscape(str) {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    // To deal with XSS. Based on Escape implementations of Mustache.JS and Marko, then customized.
    var newStr = String(str);
    if (/[&<>"']/.test(newStr)) {
        return newStr.replace(/[&<>"']/g, replaceChar);
    }
    else {
        return newStr;
    }
}

/* END TYPES */
var templateLitReg = /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})*}|(?!\${)[^\\`])*`/g;
var singleQuoteReg = /'(?:\\[\s\w"'\\`]|[^\n\r'\\])*?'/g;
var doubleQuoteReg = /"(?:\\[\s\w"'\\`]|[^\n\r"\\])*?"/g;
/** Escape special regular expression characters inside a string */
function escapeRegExp(string) {
    // From MDN
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
function parse(str, config) {
    var buffer = [];
    var trimLeftOfNextStr = false;
    var lastIndex = 0;
    var parseOptions = config.parse;
    if (config.plugins) {
        for (var i = 0; i < config.plugins.length; i++) {
            var plugin = config.plugins[i];
            if (plugin.processTemplate) {
                str = plugin.processTemplate(str, config);
            }
        }
    }
    /* Adding for EJS compatibility */
    if (config.rmWhitespace) {
        // Code taken directly from EJS
        // Have to use two separate replaces here as `^` and `$` operators don't
        // work well with `\r` and empty lines don't work well with the `m` flag.
        // Essentially, this replaces the whitespace at the beginning and end of
        // each line and removes multiple newlines.
        str = str.replace(/[\r\n]+/g, '\n').replace(/^\s+|\s+$/gm, '');
    }
    /* End rmWhitespace option */
    templateLitReg.lastIndex = 0;
    singleQuoteReg.lastIndex = 0;
    doubleQuoteReg.lastIndex = 0;
    function pushString(strng, shouldTrimRightOfString) {
        if (strng) {
            // if string is truthy it must be of type 'string'
            strng = trimWS(strng, config, trimLeftOfNextStr, // this will only be false on the first str, the next ones will be null or undefined
            shouldTrimRightOfString);
            if (strng) {
                // replace \ with \\, ' with \'
                // we're going to convert all CRLF to LF so it doesn't take more than one replace
                strng = strng.replace(/\\|'/g, '\\$&').replace(/\r\n|\n|\r/g, '\\n');
                buffer.push(strng);
            }
        }
    }
    var prefixes = [parseOptions.exec, parseOptions.interpolate, parseOptions.raw].reduce(function (accumulator, prefix) {
        if (accumulator && prefix) {
            return accumulator + '|' + escapeRegExp(prefix);
        }
        else if (prefix) {
            // accumulator is falsy
            return escapeRegExp(prefix);
        }
        else {
            // prefix and accumulator are both falsy
            return accumulator;
        }
    }, '');
    var parseOpenReg = new RegExp('([^]*?)' + escapeRegExp(config.tags[0]) + '(-|_)?\\s*(' + prefixes + ')?\\s*(?![\\s+\\-_' + prefixes + '])', 'g');
    var parseCloseReg = new RegExp('\'|"|`|\\/\\*|(\\s*(-|_)?' + escapeRegExp(config.tags[1]) + ')', 'g');
    // TODO: benchmark having the \s* on either side vs using str.trim()
    var m;
    while ((m = parseOpenReg.exec(str))) {
        lastIndex = m[0].length + m.index;
        var precedingString = m[1];
        var wsLeft = m[2];
        var prefix = m[3] || ''; // by default either ~, =, or empty
        pushString(precedingString, wsLeft);
        parseCloseReg.lastIndex = lastIndex;
        var closeTag = void 0;
        var currentObj = false;
        while ((closeTag = parseCloseReg.exec(str))) {
            if (closeTag[1]) {
                var content = str.slice(lastIndex, closeTag.index);
                parseOpenReg.lastIndex = lastIndex = parseCloseReg.lastIndex;
                trimLeftOfNextStr = closeTag[2];
                var currentType = prefix === parseOptions.exec
                    ? 'e'
                    : prefix === parseOptions.raw
                        ? 'r'
                        : prefix === parseOptions.interpolate
                            ? 'i'
                            : '';
                currentObj = { t: currentType, val: content };
                break;
            }
            else {
                var char = closeTag[0];
                if (char === '/*') {
                    var commentCloseInd = str.indexOf('*/', parseCloseReg.lastIndex);
                    if (commentCloseInd === -1) {
                        ParseErr('unclosed comment', str, closeTag.index);
                    }
                    parseCloseReg.lastIndex = commentCloseInd;
                }
                else if (char === "'") {
                    singleQuoteReg.lastIndex = closeTag.index;
                    var singleQuoteMatch = singleQuoteReg.exec(str);
                    if (singleQuoteMatch) {
                        parseCloseReg.lastIndex = singleQuoteReg.lastIndex;
                    }
                    else {
                        ParseErr('unclosed string', str, closeTag.index);
                    }
                }
                else if (char === '"') {
                    doubleQuoteReg.lastIndex = closeTag.index;
                    var doubleQuoteMatch = doubleQuoteReg.exec(str);
                    if (doubleQuoteMatch) {
                        parseCloseReg.lastIndex = doubleQuoteReg.lastIndex;
                    }
                    else {
                        ParseErr('unclosed string', str, closeTag.index);
                    }
                }
                else if (char === '`') {
                    templateLitReg.lastIndex = closeTag.index;
                    var templateLitMatch = templateLitReg.exec(str);
                    if (templateLitMatch) {
                        parseCloseReg.lastIndex = templateLitReg.lastIndex;
                    }
                    else {
                        ParseErr('unclosed string', str, closeTag.index);
                    }
                }
            }
        }
        if (currentObj) {
            buffer.push(currentObj);
        }
        else {
            ParseErr('unclosed tag', str, m.index + precedingString.length);
        }
    }
    pushString(str.slice(lastIndex, str.length), false);
    if (config.plugins) {
        for (var i = 0; i < config.plugins.length; i++) {
            var plugin = config.plugins[i];
            if (plugin.processAST) {
                buffer = plugin.processAST(buffer, config);
            }
        }
    }
    return buffer;
}

/* END TYPES */
/**
 * Compiles a template string to a function string. Most often users just use `compile()`, which calls `compileToString` and creates a new function using the result
 *
 * **Example**
 *
 * ```js
 * compileToString("Hi <%= it.user %>", eta.config)
 * // "var tR='',include=E.include.bind(E),includeFile=E.includeFile.bind(E);tR+='Hi ';tR+=E.e(it.user);if(cb){cb(null,tR)} return tR"
 * ```
 */
function compileToString(str, config) {
    var buffer = parse(str, config);
    var res = "var tR='',__l,__lP" +
        (config.include ? ',include=E.include.bind(E)' : '') +
        (config.includeFile ? ',includeFile=E.includeFile.bind(E)' : '') +
        '\nfunction layout(p,d){__l=p;__lP=d}\n' +
        (config.globalAwait ? 'const _prs = [];\n' : '') +
        (config.useWith ? 'with(' + config.varName + '||{}){' : '') +
        compileScope(buffer, config) +
        (config.includeFile
            ? 'if(__l)tR=' +
                (config.async ? 'await ' : '') +
                ("includeFile(__l,Object.assign(" + config.varName + ",{body:tR},__lP))\n")
            : config.include
                ? 'if(__l)tR=' +
                    (config.async ? 'await ' : '') +
                    ("include(__l,Object.assign(" + config.varName + ",{body:tR},__lP))\n")
                : '') +
        'if(cb){cb(null,tR)} return tR' +
        (config.useWith ? '}' : '');
    if (config.plugins) {
        for (var i = 0; i < config.plugins.length; i++) {
            var plugin = config.plugins[i];
            if (plugin.processFnString) {
                res = plugin.processFnString(res, config);
            }
        }
    }
    return res;
}
/**
 * Loops through the AST generated by `parse` and transform each item into JS calls
 *
 * **Example**
 *
 * ```js
 * // AST version of 'Hi <%= it.user %>'
 * let templateAST = ['Hi ', { val: 'it.user', t: 'i' }]
 * compileScope(templateAST, eta.config)
 * // "tR+='Hi ';tR+=E.e(it.user);"
 * ```
 */
function compileScope(buff, config) {
    var i;
    var buffLength = buff.length;
    var returnStr = '';
    var REPLACEMENT_STR = "rJ2KqXzxQg";
    for (i = 0; i < buffLength; i++) {
        var currentBlock = buff[i];
        if (typeof currentBlock === 'string') {
            var str = currentBlock;
            // we know string exists
            returnStr += "tR+='" + str + "'\n";
        }
        else {
            var type = currentBlock.t; // ~, s, !, ?, r
            var content = currentBlock.val || '';
            if (type === 'r') {
                // raw
                if (config.globalAwait) {
                    returnStr += "_prs.push(" + content + ");\n";
                    returnStr += "tR+='" + REPLACEMENT_STR + "'\n";
                }
                else {
                    if (config.filter) {
                        content = 'E.filter(' + content + ')';
                    }
                    returnStr += 'tR+=' + content + '\n';
                }
            }
            else if (type === 'i') {
                // interpolate
                if (config.globalAwait) {
                    returnStr += "_prs.push(" + content + ");\n";
                    returnStr += "tR+='" + REPLACEMENT_STR + "'\n";
                }
                else {
                    if (config.filter) {
                        content = 'E.filter(' + content + ')';
                    }
                    returnStr += 'tR+=' + content + '\n';
                    if (config.autoEscape) {
                        content = 'E.e(' + content + ')';
                    }
                    returnStr += 'tR+=' + content + '\n';
                }
            }
            else if (type === 'e') {
                // execute
                returnStr += content + '\n'; // you need a \n in case you have <% } %>
            }
        }
    }
    if (config.globalAwait) {
        returnStr += "const _rst = await Promise.all(_prs);\ntR = tR.replace(/" + REPLACEMENT_STR + "/g, () => _rst.shift());\n";
    }
    return returnStr;
}

/**
 * Handles storage and accessing of values
 *
 * In this case, we use it to store compiled template functions
 * Indexed by their `name` or `filename`
 */
var Cacher = /** @class */ (function () {
    function Cacher(cache) {
        this.cache = cache;
    }
    Cacher.prototype.define = function (key, val) {
        this.cache[key] = val;
    };
    Cacher.prototype.get = function (key) {
        // string | array.
        // TODO: allow array of keys to look down
        // TODO: create plugin to allow referencing helpers, filters with dot notation
        return this.cache[key];
    };
    Cacher.prototype.remove = function (key) {
        delete this.cache[key];
    };
    Cacher.prototype.reset = function () {
        this.cache = {};
    };
    Cacher.prototype.load = function (cacheObj) {
        copyProps(this.cache, cacheObj);
    };
    return Cacher;
}());

/* END TYPES */
/**
 * Eta's template storage
 *
 * Stores partials and cached templates
 */
var templates = new Cacher({});

/* END TYPES */
/**
 * Include a template based on its name (or filepath, if it's already been cached).
 *
 * Called like `include(templateNameOrPath, data)`
 */
function includeHelper(templateNameOrPath, data) {
    var template = this.templates.get(templateNameOrPath);
    if (!template) {
        throw EtaErr('Could not fetch template "' + templateNameOrPath + '"');
    }
    return template(data, this);
}
/** Eta's base (global) configuration */
var config = {
    async: false,
    autoEscape: true,
    autoTrim: [false, 'nl'],
    cache: false,
    e: XMLEscape,
    include: includeHelper,
    parse: {
        exec: '',
        interpolate: '=',
        raw: '~'
    },
    plugins: [],
    rmWhitespace: false,
    tags: ['<%', '%>'],
    templates: templates,
    useWith: false,
    varName: 'it'
};
/**
 * Takes one or two partial (not necessarily complete) configuration objects, merges them 1 layer deep into eta.config, and returns the result
 *
 * @param override Partial configuration object
 * @param baseConfig Partial configuration object to merge before `override`
 *
 * **Example**
 *
 * ```js
 * let customConfig = getConfig({tags: ['!#', '#!']})
 * ```
 */
function getConfig(override, baseConfig) {
    // TODO: run more tests on this
    var res = {}; // Linked
    copyProps(res, config); // Creates deep clone of eta.config, 1 layer deep
    if (baseConfig) {
        copyProps(res, baseConfig);
    }
    if (override) {
        copyProps(res, override);
    }
    return res;
}

/* END TYPES */
/**
 * Takes a template string and returns a template function that can be called with (data, config, [cb])
 *
 * @param str - The template string
 * @param config - A custom configuration object (optional)
 *
 * **Example**
 *
 * ```js
 * let compiledFn = eta.compile("Hi <%= it.user %>")
 * // function anonymous()
 * let compiledFnStr = compiledFn.toString()
 * // "function anonymous(it,E,cb\n) {\nvar tR='',include=E.include.bind(E),includeFile=E.includeFile.bind(E);tR+='Hi ';tR+=E.e(it.user);if(cb){cb(null,tR)} return tR\n}"
 * ```
 */
function compile(str, config) {
    var options = getConfig(config || {});
    /* ASYNC HANDLING */
    // The below code is modified from mde/ejs. All credit should go to them.
    var ctor = options.async ? getAsyncFunctionConstructor() : Function;
    /* END ASYNC HANDLING */
    try {
        return new ctor(options.varName, 'E', // EtaConfig
        'cb', // optional callback
        compileToString(str, options)); // eslint-disable-line no-new-func
    }
    catch (e) {
        if (e instanceof SyntaxError) {
            throw EtaErr('Bad template syntax\n\n' +
                e.message +
                '\n' +
                Array(e.message.length + 1).join('=') +
                '\n' +
                compileToString(str, options) +
                '\n' // This will put an extra newline before the callstack for extra readability
            );
        }
        else {
            throw e;
        }
    }
}

var _BOM = /^\uFEFF/;
/* END TYPES */
/**
 * Get the path to the included file from the parent file path and the
 * specified path.
 *
 * If `name` does not have an extension, it will default to `.eta`
 *
 * @param name specified path
 * @param parentfile parent file path
 * @param isDirectory whether parentfile is a directory
 * @return absolute path to template
 */
function getWholeFilePath(name, parentfile, isDirectory) {
    var includePath = path__namespace.resolve(isDirectory ? parentfile : path__namespace.dirname(parentfile), // returns directory the parent file is in
    name // file
    ) + (path__namespace.extname(name) ? '' : '.eta');
    return includePath;
}
/**
 * Get the absolute path to an included template
 *
 * If this is called with an absolute path (for example, starting with '/' or 'C:\')
 * then Eta will attempt to resolve the absolute path within options.views. If it cannot,
 * Eta will fallback to options.root or '/'
 *
 * If this is called with a relative path, Eta will:
 * - Look relative to the current template (if the current template has the `filename` property)
 * - Look inside each directory in options.views
 *
 * Note: if Eta is unable to find a template using path and options, it will throw an error.
 *
 * @param path    specified path
 * @param options compilation options
 * @return absolute path to template
 */
function getPath(path, options) {
    var includePath = false;
    var views = options.views;
    var searchedPaths = [];
    // If these four values are the same,
    // getPath() will return the same result every time.
    // We can cache the result to avoid expensive
    // file operations.
    var pathOptions = JSON.stringify({
        filename: options.filename,
        path: path,
        root: options.root,
        views: options.views
    });
    if (options.cache && options.filepathCache && options.filepathCache[pathOptions]) {
        // Use the cached filepath
        return options.filepathCache[pathOptions];
    }
    /** Add a filepath to the list of paths we've checked for a template */
    function addPathToSearched(pathSearched) {
        if (!searchedPaths.includes(pathSearched)) {
            searchedPaths.push(pathSearched);
        }
    }
    /**
     * Take a filepath (like 'partials/mypartial.eta'). Attempt to find the template file inside `views`;
     * return the resulting template file path, or `false` to indicate that the template was not found.
     *
     * @param views the filepath that holds templates, or an array of filepaths that hold templates
     * @param path the path to the template
     */
    function searchViews(views, path) {
        var filePath;
        // If views is an array, then loop through each directory
        // And attempt to find the template
        if (Array.isArray(views) &&
            views.some(function (v) {
                filePath = getWholeFilePath(path, v, true);
                addPathToSearched(filePath);
                return fs.existsSync(filePath);
            })) {
            // If the above returned true, we know that the filePath was just set to a path
            // That exists (Array.some() returns as soon as it finds a valid element)
            return filePath;
        }
        else if (typeof views === 'string') {
            // Search for the file if views is a single directory
            filePath = getWholeFilePath(path, views, true);
            addPathToSearched(filePath);
            if (fs.existsSync(filePath)) {
                return filePath;
            }
        }
        // Unable to find a file
        return false;
    }
    // Path starts with '/', 'C:\', etc.
    var match = /^[A-Za-z]+:\\|^\//.exec(path);
    // Absolute path, like /partials/partial.eta
    if (match && match.length) {
        // We have to trim the beginning '/' off the path, or else
        // path.resolve(dir, path) will always resolve to just path
        var formattedPath = path.replace(/^\/*/, '');
        // First, try to resolve the path within options.views
        includePath = searchViews(views, formattedPath);
        if (!includePath) {
            // If that fails, searchViews will return false. Try to find the path
            // inside options.root (by default '/', the base of the filesystem)
            var pathFromRoot = getWholeFilePath(formattedPath, options.root || '/', true);
            addPathToSearched(pathFromRoot);
            includePath = pathFromRoot;
        }
    }
    else {
        // Relative paths
        // Look relative to a passed filename first
        if (options.filename) {
            var filePath = getWholeFilePath(path, options.filename);
            addPathToSearched(filePath);
            if (fs.existsSync(filePath)) {
                includePath = filePath;
            }
        }
        // Then look for the template in options.views
        if (!includePath) {
            includePath = searchViews(views, path);
        }
        if (!includePath) {
            throw EtaErr('Could not find the template "' + path + '". Paths tried: ' + searchedPaths);
        }
    }
    // If caching and filepathCache are enabled,
    // cache the input & output of this function.
    if (options.cache && options.filepathCache) {
        options.filepathCache[pathOptions] = includePath;
    }
    return includePath;
}
/**
 * Reads a file synchronously
 */
function readFile(filePath) {
    try {
        return fs.readFileSync(filePath).toString().replace(_BOM, ''); // TODO: is replacing BOM's necessary?
    }
    catch (_a) {
        throw EtaErr("Failed to read template at '" + filePath + "'");
    }
}

// express is set like: app.engine('html', require('eta').renderFile)
/* END TYPES */
/**
 * Reads a template, compiles it into a function, caches it if caching isn't disabled, returns the function
 *
 * @param filePath Absolute path to template file
 * @param options Eta configuration overrides
 * @param noCache Optionally, make Eta not cache the template
 */
function loadFile(filePath, options, noCache) {
    var config = getConfig(options);
    var template = readFile(filePath);
    try {
        var compiledTemplate = compile(template, config);
        if (!noCache) {
            config.templates.define(config.filename, compiledTemplate);
        }
        return compiledTemplate;
    }
    catch (e) {
        throw EtaErr('Loading file: ' + filePath + ' failed:\n\n' + e.message);
    }
}
/**
 * Get the template from a string or a file, either compiled on-the-fly or
 * read from cache (if enabled), and cache the template if needed.
 *
 * If `options.cache` is true, this function reads the file from
 * `options.filename` so it must be set prior to calling this function.
 *
 * @param options   compilation options
 * @return Eta template function
 */
function handleCache$1(options) {
    var filename = options.filename;
    if (options.cache) {
        var func = options.templates.get(filename);
        if (func) {
            return func;
        }
        return loadFile(filename, options);
    }
    // Caching is disabled, so pass noCache = true
    return loadFile(filename, options, true);
}
/**
 * Get the template function.
 *
 * If `options.cache` is `true`, then the template is cached.
 *
 * This returns a template function and the config object with which that template function should be called.
 *
 * @remarks
 *
 * It's important that this returns a config object with `filename` set.
 * Otherwise, the included file would not be able to use relative paths
 *
 * @param path path for the specified file (if relative, specify `views` on `options`)
 * @param options compilation options
 * @return [Eta template function, new config object]
 */
function includeFile(path, options) {
    // the below creates a new options object, using the parent filepath of the old options object and the path
    var newFileOptions = getConfig({ filename: getPath(path, options) }, options);
    // TODO: make sure properties are currectly copied over
    return [handleCache$1(newFileOptions), newFileOptions];
}

/* END TYPES */
/**
 * Called with `includeFile(path, data)`
 */
function includeFileHelper(path, data) {
    var templateAndConfig = includeFile(path, this);
    return templateAndConfig[0](data, templateAndConfig[1]);
}

/* END TYPES */
function handleCache(template, options) {
    if (options.cache && options.name && options.templates.get(options.name)) {
        return options.templates.get(options.name);
    }
    var templateFunc = typeof template === 'function' ? template : compile(template, options);
    // Note that we don't have to check if it already exists in the cache;
    // it would have returned earlier if it had
    if (options.cache && options.name) {
        options.templates.define(options.name, templateFunc);
    }
    return templateFunc;
}
/**
 * Render a template
 *
 * If `template` is a string, Eta will compile it to a function and then call it with the provided data.
 * If `template` is a template function, Eta will call it with the provided data.
 *
 * If `config.async` is `false`, Eta will return the rendered template.
 *
 * If `config.async` is `true` and there's a callback function, Eta will call the callback with `(err, renderedTemplate)`.
 * If `config.async` is `true` and there's not a callback function, Eta will return a Promise that resolves to the rendered template.
 *
 * If `config.cache` is `true` and `config` has a `name` or `filename` property, Eta will cache the template on the first render and use the cached template for all subsequent renders.
 *
 * @param template Template string or template function
 * @param data Data to render the template with
 * @param config Optional config options
 * @param cb Callback function
 */
function render(template, data, config, cb) {
    var options = getConfig(config || {});
    if (options.async) {
        if (cb) {
            // If user passes callback
            try {
                // Note: if there is an error while rendering the template,
                // It will bubble up and be caught here
                var templateFn = handleCache(template, options);
                templateFn(data, options, cb);
            }
            catch (err) {
                return cb(err);
            }
        }
        else {
            // No callback, try returning a promise
            if (typeof promiseImpl === 'function') {
                return new promiseImpl(function (resolve, reject) {
                    try {
                        resolve(handleCache(template, options)(data, options));
                    }
                    catch (err) {
                        reject(err);
                    }
                });
            }
            else {
                throw EtaErr("Please provide a callback function, this env doesn't support Promises");
            }
        }
    }
    else {
        return handleCache(template, options)(data, options);
    }
}
/**
 * Render a template asynchronously
 *
 * If `template` is a string, Eta will compile it to a function and call it with the provided data.
 * If `template` is a function, Eta will call it with the provided data.
 *
 * If there is a callback function, Eta will call it with `(err, renderedTemplate)`.
 * If there is not a callback function, Eta will return a Promise that resolves to the rendered template
 *
 * @param template Template string or template function
 * @param data Data to render the template with
 * @param config Optional config options
 * @param cb Callback function
 */
function renderAsync(template, data, config, cb) {
    // Using Object.assign to lower bundle size, using spread operator makes it larger because of typescript injected polyfills
    return render(template, data, Object.assign({}, config, { async: true }), cb);
}

// @denoify-ignore
config.includeFile = includeFileHelper;
config.filepathCache = {};

class Parser {
    constructor() { }
    parse_commands(content, object) {
        return __awaiter(this, void 0, void 0, function* () {
            content = (yield renderAsync(content, object, {
                varName: "tp",
                parse: {
                    exec: "*",
                    interpolate: "~",
                    raw: "",
                },
                autoTrim: false,
                globalAwait: true,
            }));
            return content;
        });
    }
}

var RunMode;
(function (RunMode) {
    RunMode[RunMode["CreateNewFromTemplate"] = 0] = "CreateNewFromTemplate";
    RunMode[RunMode["AppendActiveFile"] = 1] = "AppendActiveFile";
    RunMode[RunMode["OverwriteFile"] = 2] = "OverwriteFile";
    RunMode[RunMode["OverwriteActiveFile"] = 3] = "OverwriteActiveFile";
    RunMode[RunMode["DynamicProcessor"] = 4] = "DynamicProcessor";
    RunMode[RunMode["StartupTemplate"] = 5] = "StartupTemplate";
})(RunMode || (RunMode = {}));
class Templater {
    constructor(app, plugin) {
        this.app = app;
        this.plugin = plugin;
        this.functions_generator = new FunctionsGenerator(this.app, this.plugin);
        this.editor = new Editor(this.app, this.plugin);
        this.parser = new Parser();
    }
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.editor.setup();
            yield this.functions_generator.init();
            this.plugin.registerMarkdownPostProcessor((el, ctx) => this.process_dynamic_templates(el, ctx));
        });
    }
    create_running_config(template_file, target_file, run_mode) {
        const active_file = this.app.workspace.getActiveFile();
        return {
            template_file: template_file,
            target_file: target_file,
            run_mode: run_mode,
            active_file: active_file,
        };
    }
    read_and_parse_template(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const template_content = yield this.app.vault.read(config.template_file);
            return this.parse_template(config, template_content);
        });
    }
    parse_template(config, template_content) {
        return __awaiter(this, void 0, void 0, function* () {
            const functions_object = yield this.functions_generator.generate_object(config, FunctionsMode.USER_INTERNAL);
            this.current_functions_object = functions_object;
            const content = yield this.parser.parse_commands(template_content, functions_object);
            return content;
        });
    }
    create_new_note_from_template(template, folder, filename, open_new_note = true) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Maybe there is an obsidian API function for that
            if (!folder) {
                // TODO: Fix that
                // @ts-ignore
                const new_file_location = this.app.vault.getConfig("newFileLocation");
                switch (new_file_location) {
                    case "current":
                        const active_file = this.app.workspace.getActiveFile();
                        if (active_file) {
                            folder = active_file.parent;
                        }
                        break;
                    case "folder":
                        folder = this.app.fileManager.getNewFileParent("");
                        break;
                    case "root":
                        folder = this.app.vault.getRoot();
                        break;
                }
            }
            // TODO: Change that, not stable atm
            // @ts-ignore
            const created_note = yield this.app.fileManager.createNewMarkdownFile(folder, filename !== null && filename !== void 0 ? filename : "Untitled");
            let running_config;
            let output_content;
            if (template instanceof obsidian.TFile) {
                running_config = this.create_running_config(template, created_note, RunMode.CreateNewFromTemplate);
                output_content = yield errorWrapper(() => __awaiter(this, void 0, void 0, function* () { return this.read_and_parse_template(running_config); }), "Template parsing error, aborting.");
            }
            else {
                running_config = this.create_running_config(undefined, created_note, RunMode.CreateNewFromTemplate);
                output_content = yield errorWrapper(() => __awaiter(this, void 0, void 0, function* () { return this.parse_template(running_config, template); }), "Template parsing error, aborting.");
            }
            if (output_content == null) {
                yield this.app.vault.delete(created_note);
                return;
            }
            yield this.app.vault.modify(created_note, output_content);
            if (open_new_note) {
                const active_leaf = this.app.workspace.activeLeaf;
                if (!active_leaf) {
                    log_error(new TemplaterError("No active leaf"));
                    return;
                }
                yield active_leaf.openFile(created_note, { state: { mode: 'source' }, eState: { rename: 'all' } });
                yield this.editor.jump_to_next_cursor_location();
            }
            return created_note;
        });
    }
    append_template_to_active_file(template_file) {
        return __awaiter(this, void 0, void 0, function* () {
            const active_view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
            if (active_view === null) {
                log_error(new TemplaterError("No active view, can't append templates."));
                return;
            }
            const running_config = this.create_running_config(template_file, active_view.file, RunMode.AppendActiveFile);
            const output_content = yield errorWrapper(() => __awaiter(this, void 0, void 0, function* () { return this.read_and_parse_template(running_config); }), "Template parsing error, aborting.");
            // errorWrapper failed 
            if (output_content == null) {
                return;
            }
            const editor = active_view.editor;
            const doc = editor.getDoc();
            doc.replaceSelection(output_content);
            // TODO: Remove this
            yield this.editor.jump_to_next_cursor_location();
        });
    }
    write_template_to_file(template_file, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const running_config = this.create_running_config(template_file, file, RunMode.OverwriteFile);
            const output_content = yield errorWrapper(() => __awaiter(this, void 0, void 0, function* () { return this.read_and_parse_template(running_config); }), "Template parsing error, aborting.");
            // errorWrapper failed 
            if (output_content == null) {
                return;
            }
            yield this.app.vault.modify(file, output_content);
        });
    }
    overwrite_active_file_commands() {
        const active_view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (active_view === null) {
            log_error(new TemplaterError("Active view is null, can't overwrite content"));
            return;
        }
        this.overwrite_file_commands(active_view.file, true);
    }
    overwrite_file_commands(file, active_file = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const running_config = this.create_running_config(file, file, active_file ? RunMode.OverwriteActiveFile : RunMode.OverwriteFile);
            const output_content = yield errorWrapper(() => __awaiter(this, void 0, void 0, function* () { return this.read_and_parse_template(running_config); }), "Template parsing error, aborting.");
            // errorWrapper failed 
            if (output_content == null) {
                return;
            }
            yield this.app.vault.modify(file, output_content);
            // TODO: Remove this
            if (this.app.workspace.getActiveFile() === file) {
                yield this.editor.jump_to_next_cursor_location();
            }
        });
    }
    process_dynamic_templates(el, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const dynamic_command_regex = /(<%(?:-|_)?\s*[*~]{0,1})\+((?:.|\s)*?%>)/g;
            const walker = document.createNodeIterator(el, NodeFilter.SHOW_TEXT);
            let node;
            let pass = false;
            let functions_object;
            while ((node = walker.nextNode())) {
                let content = node.nodeValue;
                let match;
                if ((match = dynamic_command_regex.exec(content)) != null) {
                    const file = this.app.metadataCache.getFirstLinkpathDest("", ctx.sourcePath);
                    if (!file || !(file instanceof obsidian.TFile)) {
                        return;
                    }
                    if (!pass) {
                        pass = true;
                        const config = this.create_running_config(file, file, RunMode.DynamicProcessor);
                        functions_object = yield this.functions_generator.generate_object(config, FunctionsMode.USER_INTERNAL);
                        this.current_functions_object = functions_object;
                    }
                    while (match != null) {
                        // Not the most efficient way to exclude the '+' from the command but I couldn't find something better
                        const complete_command = match[1] + match[2];
                        const command_output = yield errorWrapper(() => __awaiter(this, void 0, void 0, function* () {
                            return yield this.parser.parse_commands(complete_command, functions_object);
                        }), `Command Parsing error in dynamic command '${complete_command}'`);
                        if (command_output == null) {
                            return;
                        }
                        let start = dynamic_command_regex.lastIndex - match[0].length;
                        let end = dynamic_command_regex.lastIndex;
                        content = content.substring(0, start) + command_output + content.substring(end);
                        dynamic_command_regex.lastIndex += (command_output.length - match[0].length);
                        match = dynamic_command_regex.exec(content);
                    }
                    node.nodeValue = content;
                }
            }
        });
    }
    static on_file_creation(templater, file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(file instanceof obsidian.TFile) || file.extension !== "md") {
                return;
            }
            // Avoids template replacement when syncing template files
            const template_folder = obsidian.normalizePath(templater.plugin.settings.templates_folder);
            if (file.path.includes(template_folder) && template_folder !== "/") {
                return;
            }
            // TODO: find a better way to do this
            // Currently, I have to wait for the daily note plugin to add the file content before replacing
            // Not a problem with Calendar however since it creates the file with the existing content
            yield delay(300);
            if (file.stat.size == 0 && templater.plugin.settings.empty_file_template) {
                const template_file = yield errorWrapper(() => __awaiter(this, void 0, void 0, function* () {
                    return resolve_tfile(templater.app, templater.plugin.settings.empty_file_template + ".md");
                }), `Couldn't find Empty file template ${templater.plugin.settings.empty_file_template}`);
                // errorWrapper failed
                if (template_file == null) {
                    return;
                }
                yield templater.write_template_to_file(template_file, file);
            }
            else {
                yield templater.overwrite_file_commands(file);
            }
        });
    }
    execute_startup_scripts() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const template of this.plugin.settings.startup_templates) {
                if (template === "") {
                    continue;
                }
                const file = errorWrapperSync(() => resolve_tfile(this.app, template), `Couldn't find startup template "${template}"`);
                if (!file) {
                    continue;
                }
                const running_config = this.create_running_config(file, file, RunMode.StartupTemplate);
                yield errorWrapper(() => __awaiter(this, void 0, void 0, function* () { return this.read_and_parse_template(running_config); }), `Startup Template parsing error, aborting.`);
            }
        });
    }
}

class EventHandler {
    constructor(app, plugin, templater, settings) {
        this.app = app;
        this.plugin = plugin;
        this.templater = templater;
        this.settings = settings;
    }
    setup() {
        this.app.workspace.onLayoutReady(() => {
            this.update_trigger_file_on_creation();
        });
        this.update_syntax_highlighting();
        this.update_file_menu();
    }
    update_syntax_highlighting() {
        if (this.plugin.settings.syntax_highlighting) {
            this.syntax_highlighting_event = this.app.workspace.on("codemirror", cm => {
                cm.setOption("mode", "templater");
            });
            this.app.workspace.iterateCodeMirrors(cm => {
                cm.setOption("mode", "templater");
            });
            this.plugin.registerEvent(this.syntax_highlighting_event);
        }
        else {
            if (this.syntax_highlighting_event) {
                this.app.vault.offref(this.syntax_highlighting_event);
            }
            this.app.workspace.iterateCodeMirrors(cm => {
                cm.setOption("mode", "hypermd");
            });
        }
    }
    update_trigger_file_on_creation() {
        if (this.settings.trigger_on_file_creation) {
            this.trigger_on_file_creation_event = this.app.vault.on("create", (file) => Templater.on_file_creation(this.templater, file));
            this.plugin.registerEvent(this.trigger_on_file_creation_event);
        }
        else {
            if (this.trigger_on_file_creation_event) {
                this.app.vault.offref(this.trigger_on_file_creation_event);
                this.trigger_on_file_creation_event = undefined;
            }
        }
    }
    update_file_menu() {
        this.plugin.registerEvent(this.app.workspace.on("file-menu", (menu, file) => {
            if (file instanceof obsidian.TFolder) {
                menu.addItem((item) => {
                    item.setTitle("Create new note from template")
                        .setIcon("templater-icon")
                        .onClick(_ => {
                        this.plugin.fuzzy_suggester.create_new_note_from_template(file);
                    });
                });
            }
        }));
    }
}

class CommandHandler {
    constructor(app, plugin) {
        this.app = app;
        this.plugin = plugin;
    }
    setup() {
        this.plugin.addCommand({
            id: "insert-templater",
            name: "Open Insert Template modal",
            hotkeys: [
                {
                    modifiers: ["Alt"],
                    key: 'e',
                },
            ],
            callback: () => {
                this.plugin.fuzzy_suggester.insert_template();
            },
        });
        this.plugin.addCommand({
            id: "replace-in-file-templater",
            name: "Replace templates in the active file",
            hotkeys: [
                {
                    modifiers: ["Alt"],
                    key: 'r',
                },
            ],
            callback: () => {
                this.plugin.templater.overwrite_active_file_commands();
            },
        });
        this.plugin.addCommand({
            id: "jump-to-next-cursor-location",
            name: "Jump to next cursor location",
            hotkeys: [
                {
                    modifiers: ["Alt"],
                    key: "Tab",
                },
            ],
            callback: () => {
                this.plugin.templater.editor.jump_to_next_cursor_location();
            }
        });
        this.plugin.addCommand({
            id: "create-new-note-from-template",
            name: "Create new note from template",
            hotkeys: [
                {
                    modifiers: ["Alt"],
                    key: "n",
                },
            ],
            callback: () => {
                this.plugin.fuzzy_suggester.create_new_note_from_template();
            }
        });
        this.register_templates_hotkeys();
    }
    register_templates_hotkeys() {
        this.plugin.settings.enabled_templates_hotkeys.forEach(template => {
            if (template !== "") {
                this.add_template_hotkey("", template);
            }
        });
    }
    add_template_hotkey(old_template, new_template) {
        this.remove_template_hotkey(old_template);
        if (new_template !== "") {
            this.plugin.addCommand({
                id: new_template,
                name: `Insert ${new_template}`,
                callback: () => {
                    const template = errorWrapperSync(() => resolve_tfile(this.app, new_template), `Couldn't find the template file associated with this hotkey`);
                    if (!template) {
                        return;
                    }
                    this.plugin.templater.append_template_to_active_file(template);
                }
            });
        }
    }
    remove_template_hotkey(template) {
        if (template !== "") {
            // TODO: Find official way to do this
            // @ts-ignore
            this.app.commands.removeCommand(`${this.plugin.manifest.id}:${template}`);
        }
    }
}

class TemplaterPlugin extends obsidian.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.load_settings();
            this.templater = new Templater(this.app, this);
            yield this.templater.setup();
            this.fuzzy_suggester = new FuzzySuggester(this.app, this);
            this.event_handler = new EventHandler(this.app, this, this.templater, this.settings);
            this.event_handler.setup();
            this.command_handler = new CommandHandler(this.app, this);
            this.command_handler.setup();
            obsidian.addIcon("templater-icon", ICON_DATA);
            this.addRibbonIcon('templater-icon', 'Templater', () => __awaiter(this, void 0, void 0, function* () {
                this.fuzzy_suggester.insert_template();
            }));
            this.addSettingTab(new TemplaterSettingTab(this.app, this));
            // Files might not be created yet
            this.app.workspace.onLayoutReady(() => {
                this.templater.execute_startup_scripts();
            });
        });
    }
    save_settings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
    load_settings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
        });
    }
}

module.exports = TemplaterPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy9Mb2cudHMiLCJzcmMvRXJyb3IudHMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2VudW1zLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0Tm9kZU5hbWUuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRXaW5kb3cuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9pbnN0YW5jZU9mLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9tb2RpZmllcnMvYXBwbHlTdHlsZXMuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2dldEJhc2VQbGFjZW1lbnQuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRCb3VuZGluZ0NsaWVudFJlY3QuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRMYXlvdXRSZWN0LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvY29udGFpbnMuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRDb21wdXRlZFN0eWxlLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvaXNUYWJsZUVsZW1lbnQuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXREb2N1bWVudEVsZW1lbnQuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRQYXJlbnROb2RlLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0T2Zmc2V0UGFyZW50LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL21hdGguanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL3dpdGhpbi5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvZ2V0RnJlc2hTaWRlT2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9tZXJnZVBhZGRpbmdPYmplY3QuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2V4cGFuZFRvSGFzaE1hcC5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvbW9kaWZpZXJzL2Fycm93LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRWYXJpYXRpb24uanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL21vZGlmaWVycy9jb21wdXRlU3R5bGVzLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9tb2RpZmllcnMvZXZlbnRMaXN0ZW5lcnMuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2dldE9wcG9zaXRlUGxhY2VtZW50LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRPcHBvc2l0ZVZhcmlhdGlvblBsYWNlbWVudC5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldFdpbmRvd1Njcm9sbC5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldFdpbmRvd1Njcm9sbEJhclguanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRWaWV3cG9ydFJlY3QuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXREb2N1bWVudFJlY3QuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9pc1Njcm9sbFBhcmVudC5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldFNjcm9sbFBhcmVudC5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2xpc3RTY3JvbGxQYXJlbnRzLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9yZWN0VG9DbGllbnRSZWN0LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0Q2xpcHBpbmdSZWN0LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9jb21wdXRlT2Zmc2V0cy5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvZGV0ZWN0T3ZlcmZsb3cuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2NvbXB1dGVBdXRvUGxhY2VtZW50LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9tb2RpZmllcnMvZmxpcC5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvbW9kaWZpZXJzL2hpZGUuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL21vZGlmaWVycy9vZmZzZXQuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL21vZGlmaWVycy9wb3BwZXJPZmZzZXRzLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRBbHRBeGlzLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9tb2RpZmllcnMvcHJldmVudE92ZXJmbG93LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0SFRNTEVsZW1lbnRTY3JvbGwuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXROb2RlU2Nyb2xsLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0Q29tcG9zaXRlUmVjdC5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvb3JkZXJNb2RpZmllcnMuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2RlYm91bmNlLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9mb3JtYXQuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL3ZhbGlkYXRlTW9kaWZpZXJzLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy91bmlxdWVCeS5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvbWVyZ2VCeU5hbWUuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2NyZWF0ZVBvcHBlci5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvcG9wcGVyLmpzIiwic3JjL3N1Z2dlc3RlcnMvc3VnZ2VzdC50cyIsInNyYy9zdWdnZXN0ZXJzL0ZvbGRlclN1Z2dlc3Rlci50cyIsInNyYy9VdGlscy50cyIsInNyYy9zdWdnZXN0ZXJzL0ZpbGVTdWdnZXN0ZXIudHMiLCJzcmMvU2V0dGluZ3MudHMiLCJzcmMvRnV6enlTdWdnZXN0ZXIudHMiLCJzcmMvQ29uc3RhbnRzLnRzIiwic3JjL2Z1bmN0aW9ucy9pbnRlcm5hbF9mdW5jdGlvbnMvSW50ZXJuYWxNb2R1bGUudHMiLCJzcmMvZnVuY3Rpb25zL2ludGVybmFsX2Z1bmN0aW9ucy9kYXRlL0ludGVybmFsTW9kdWxlRGF0ZS50cyIsInNyYy9mdW5jdGlvbnMvaW50ZXJuYWxfZnVuY3Rpb25zL2ZpbGUvSW50ZXJuYWxNb2R1bGVGaWxlLnRzIiwic3JjL2Z1bmN0aW9ucy9pbnRlcm5hbF9mdW5jdGlvbnMvd2ViL0ludGVybmFsTW9kdWxlV2ViLnRzIiwic3JjL2Z1bmN0aW9ucy9pbnRlcm5hbF9mdW5jdGlvbnMvZnJvbnRtYXR0ZXIvSW50ZXJuYWxNb2R1bGVGcm9udG1hdHRlci50cyIsInNyYy9mdW5jdGlvbnMvaW50ZXJuYWxfZnVuY3Rpb25zL3N5c3RlbS9Qcm9tcHRNb2RhbC50cyIsInNyYy9mdW5jdGlvbnMvaW50ZXJuYWxfZnVuY3Rpb25zL3N5c3RlbS9TdWdnZXN0ZXJNb2RhbC50cyIsInNyYy9mdW5jdGlvbnMvaW50ZXJuYWxfZnVuY3Rpb25zL3N5c3RlbS9JbnRlcm5hbE1vZHVsZVN5c3RlbS50cyIsInNyYy9mdW5jdGlvbnMvaW50ZXJuYWxfZnVuY3Rpb25zL2NvbmZpZy9JbnRlcm5hbE1vZHVsZUNvbmZpZy50cyIsInNyYy9mdW5jdGlvbnMvaW50ZXJuYWxfZnVuY3Rpb25zL0ludGVybmFsRnVuY3Rpb25zLnRzIiwic3JjL2Z1bmN0aW9ucy91c2VyX2Z1bmN0aW9ucy9Vc2VyU3lzdGVtRnVuY3Rpb25zLnRzIiwic3JjL2Z1bmN0aW9ucy91c2VyX2Z1bmN0aW9ucy9Vc2VyU2NyaXB0RnVuY3Rpb25zLnRzIiwic3JjL2Z1bmN0aW9ucy91c2VyX2Z1bmN0aW9ucy9Vc2VyRnVuY3Rpb25zLnRzIiwic3JjL2Z1bmN0aW9ucy9GdW5jdGlvbnNHZW5lcmF0b3IudHMiLCJzcmMvZWRpdG9yL0N1cnNvckp1bXBlci50cyIsInNyYy9lZGl0b3IvbW9kZS9qYXZhc2NyaXB0LmpzIiwic3JjL2VkaXRvci9tb2RlL2N1c3RvbV9vdmVybGF5LmpzIiwic3JjL2VkaXRvci9FZGl0b3IudHMiLCJub2RlX21vZHVsZXMvZXRhL2Rpc3QvZXRhLmVzLmpzIiwic3JjL3BhcnNlci9QYXJzZXIudHMiLCJzcmMvVGVtcGxhdGVyLnRzIiwic3JjL0V2ZW50SGFuZGxlci50cyIsInNyYy9Db21tYW5kSGFuZGxlci50cyIsInNyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxyXG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXHJcblxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxyXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXHJcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxyXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXHJcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fY3JlYXRlQmluZGluZyA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgbykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBwKSkgX19jcmVhdGVCaW5kaW5nKG8sIG0sIHApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXlzKCkge1xyXG4gICAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciByID0gQXJyYXkocyksIGsgPSAwLCBpID0gMDsgaSA8IGlsOyBpKyspXHJcbiAgICAgICAgZm9yICh2YXIgYSA9IGFyZ3VtZW50c1tpXSwgaiA9IDAsIGpsID0gYS5sZW5ndGg7IGogPCBqbDsgaisrLCBrKyspXHJcbiAgICAgICAgICAgIHJba10gPSBhW2pdO1xyXG4gICAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5KHRvLCBmcm9tLCBwYWNrKSB7XHJcbiAgICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgIGlmIChhciB8fCAhKGkgaW4gZnJvbSkpIHtcclxuICAgICAgICAgICAgaWYgKCFhcikgYXIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tLCAwLCBpKTtcclxuICAgICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XHJcbn0pIDogZnVuY3Rpb24obywgdikge1xyXG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XHJcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHJlY2VpdmVyLCBzdGF0ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgZ2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgcmVhZCBwcml2YXRlIG1lbWJlciBmcm9tIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XHJcbiAgICByZXR1cm4ga2luZCA9PT0gXCJtXCIgPyBmIDoga2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIpIDogZiA/IGYudmFsdWUgOiBzdGF0ZS5nZXQocmVjZWl2ZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgc3RhdGUsIHZhbHVlLCBraW5kLCBmKSB7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJtXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIG1ldGhvZCBpcyBub3Qgd3JpdGFibGVcIik7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBzZXR0ZXJcIik7XHJcbiAgICBpZiAodHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciAhPT0gc3RhdGUgfHwgIWYgOiAhc3RhdGUuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCB3cml0ZSBwcml2YXRlIG1lbWJlciB0byBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIChraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlciwgdmFsdWUpIDogZiA/IGYudmFsdWUgPSB2YWx1ZSA6IHN0YXRlLnNldChyZWNlaXZlciwgdmFsdWUpKSwgdmFsdWU7XHJcbn1cclxuIiwiaW1wb3J0IHsgTm90aWNlIH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHsgVGVtcGxhdGVyRXJyb3IgfSBmcm9tICdFcnJvcic7XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2dfdXBkYXRlKG1zZzogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3Qgbm90aWNlID0gbmV3IE5vdGljZShcIlwiLCAxNTAwMCk7XG4gICAgLy8gVE9ETzogRmluZCBiZXR0ZXIgd2F5IGZvciB0aGlzXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIG5vdGljZS5ub3RpY2VFbC5pbm5lckhUTUwgPSBgPGI+VGVtcGxhdGVyIHVwZGF0ZTwvYj46PGJyLz4ke21zZ31gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9nX2Vycm9yKGU6IEVycm9yIHwgVGVtcGxhdGVyRXJyb3IpOiB2b2lkIHtcbiAgICBjb25zdCBub3RpY2UgPSBuZXcgTm90aWNlKFwiXCIsIDgwMDApO1xuICAgIGlmIChlIGluc3RhbmNlb2YgVGVtcGxhdGVyRXJyb3IgJiYgZS5jb25zb2xlX21zZykge1xuICAgICAgICAvLyBUT0RPOiBGaW5kIGEgYmV0dGVyIHdheSBmb3IgdGhpc1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIG5vdGljZS5ub3RpY2VFbC5pbm5lckhUTUwgPSBgPGI+VGVtcGxhdGVyIEVycm9yPC9iPjo8YnIvPiR7ZS5tZXNzYWdlfTxici8+Q2hlY2sgY29uc29sZSBmb3IgbW9yZSBpbmZvcm1hdGlvbnNgO1xuICAgICAgICBjb25zb2xlLmVycm9yKGBUZW1wbGF0ZXIgRXJyb3I6YCwgZS5tZXNzYWdlLCBcIlxcblwiLCBlLmNvbnNvbGVfbXNnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgbm90aWNlLm5vdGljZUVsLmlubmVySFRNTCA9IGA8Yj5UZW1wbGF0ZXIgRXJyb3I8L2I+Ojxici8+JHtlLm1lc3NhZ2V9YDtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBsb2dfZXJyb3IgfSBmcm9tICdMb2cnO1xuXG5leHBvcnQgY2xhc3MgVGVtcGxhdGVyRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobXNnOiBzdHJpbmcsIHB1YmxpYyBjb25zb2xlX21zZz86IHN0cmluZykge1xuICAgICAgICBzdXBlcihtc2cpO1xuICAgICAgICB0aGlzLm5hbWUgPSB0aGlzLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHRoaXMuY29uc3RydWN0b3IpO1xuICAgIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGVycm9yV3JhcHBlcihmbjogRnVuY3Rpb24sIG1zZzogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gYXdhaXQgZm4oKTtcbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgaWYgKCEoZSBpbnN0YW5jZW9mIFRlbXBsYXRlckVycm9yKSkge1xuICAgICAgICAgICAgbG9nX2Vycm9yKG5ldyBUZW1wbGF0ZXJFcnJvcihtc2csIGUubWVzc2FnZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbG9nX2Vycm9yKGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVycm9yV3JhcHBlclN5bmMoZm46IEZ1bmN0aW9uLCBtc2c6IHN0cmluZyk6IGFueSB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGZuKCk7XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICAgIGxvZ19lcnJvcihuZXcgVGVtcGxhdGVyRXJyb3IobXNnLCBlLm1lc3NhZ2UpKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufVxuIiwiZXhwb3J0IHZhciB0b3AgPSAndG9wJztcbmV4cG9ydCB2YXIgYm90dG9tID0gJ2JvdHRvbSc7XG5leHBvcnQgdmFyIHJpZ2h0ID0gJ3JpZ2h0JztcbmV4cG9ydCB2YXIgbGVmdCA9ICdsZWZ0JztcbmV4cG9ydCB2YXIgYXV0byA9ICdhdXRvJztcbmV4cG9ydCB2YXIgYmFzZVBsYWNlbWVudHMgPSBbdG9wLCBib3R0b20sIHJpZ2h0LCBsZWZ0XTtcbmV4cG9ydCB2YXIgc3RhcnQgPSAnc3RhcnQnO1xuZXhwb3J0IHZhciBlbmQgPSAnZW5kJztcbmV4cG9ydCB2YXIgY2xpcHBpbmdQYXJlbnRzID0gJ2NsaXBwaW5nUGFyZW50cyc7XG5leHBvcnQgdmFyIHZpZXdwb3J0ID0gJ3ZpZXdwb3J0JztcbmV4cG9ydCB2YXIgcG9wcGVyID0gJ3BvcHBlcic7XG5leHBvcnQgdmFyIHJlZmVyZW5jZSA9ICdyZWZlcmVuY2UnO1xuZXhwb3J0IHZhciB2YXJpYXRpb25QbGFjZW1lbnRzID0gLyojX19QVVJFX18qL2Jhc2VQbGFjZW1lbnRzLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBwbGFjZW1lbnQpIHtcbiAgcmV0dXJuIGFjYy5jb25jYXQoW3BsYWNlbWVudCArIFwiLVwiICsgc3RhcnQsIHBsYWNlbWVudCArIFwiLVwiICsgZW5kXSk7XG59LCBbXSk7XG5leHBvcnQgdmFyIHBsYWNlbWVudHMgPSAvKiNfX1BVUkVfXyovW10uY29uY2F0KGJhc2VQbGFjZW1lbnRzLCBbYXV0b10pLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBwbGFjZW1lbnQpIHtcbiAgcmV0dXJuIGFjYy5jb25jYXQoW3BsYWNlbWVudCwgcGxhY2VtZW50ICsgXCItXCIgKyBzdGFydCwgcGxhY2VtZW50ICsgXCItXCIgKyBlbmRdKTtcbn0sIFtdKTsgLy8gbW9kaWZpZXJzIHRoYXQgbmVlZCB0byByZWFkIHRoZSBET01cblxuZXhwb3J0IHZhciBiZWZvcmVSZWFkID0gJ2JlZm9yZVJlYWQnO1xuZXhwb3J0IHZhciByZWFkID0gJ3JlYWQnO1xuZXhwb3J0IHZhciBhZnRlclJlYWQgPSAnYWZ0ZXJSZWFkJzsgLy8gcHVyZS1sb2dpYyBtb2RpZmllcnNcblxuZXhwb3J0IHZhciBiZWZvcmVNYWluID0gJ2JlZm9yZU1haW4nO1xuZXhwb3J0IHZhciBtYWluID0gJ21haW4nO1xuZXhwb3J0IHZhciBhZnRlck1haW4gPSAnYWZ0ZXJNYWluJzsgLy8gbW9kaWZpZXIgd2l0aCB0aGUgcHVycG9zZSB0byB3cml0ZSB0byB0aGUgRE9NIChvciB3cml0ZSBpbnRvIGEgZnJhbWV3b3JrIHN0YXRlKVxuXG5leHBvcnQgdmFyIGJlZm9yZVdyaXRlID0gJ2JlZm9yZVdyaXRlJztcbmV4cG9ydCB2YXIgd3JpdGUgPSAnd3JpdGUnO1xuZXhwb3J0IHZhciBhZnRlcldyaXRlID0gJ2FmdGVyV3JpdGUnO1xuZXhwb3J0IHZhciBtb2RpZmllclBoYXNlcyA9IFtiZWZvcmVSZWFkLCByZWFkLCBhZnRlclJlYWQsIGJlZm9yZU1haW4sIG1haW4sIGFmdGVyTWFpbiwgYmVmb3JlV3JpdGUsIHdyaXRlLCBhZnRlcldyaXRlXTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXROb2RlTmFtZShlbGVtZW50KSB7XG4gIHJldHVybiBlbGVtZW50ID8gKGVsZW1lbnQubm9kZU5hbWUgfHwgJycpLnRvTG93ZXJDYXNlKCkgOiBudWxsO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFdpbmRvdyhub2RlKSB7XG4gIGlmIChub2RlID09IG51bGwpIHtcbiAgICByZXR1cm4gd2luZG93O1xuICB9XG5cbiAgaWYgKG5vZGUudG9TdHJpbmcoKSAhPT0gJ1tvYmplY3QgV2luZG93XScpIHtcbiAgICB2YXIgb3duZXJEb2N1bWVudCA9IG5vZGUub3duZXJEb2N1bWVudDtcbiAgICByZXR1cm4gb3duZXJEb2N1bWVudCA/IG93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXcgfHwgd2luZG93IDogd2luZG93O1xuICB9XG5cbiAgcmV0dXJuIG5vZGU7XG59IiwiaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi9nZXRXaW5kb3cuanNcIjtcblxuZnVuY3Rpb24gaXNFbGVtZW50KG5vZGUpIHtcbiAgdmFyIE93bkVsZW1lbnQgPSBnZXRXaW5kb3cobm9kZSkuRWxlbWVudDtcbiAgcmV0dXJuIG5vZGUgaW5zdGFuY2VvZiBPd25FbGVtZW50IHx8IG5vZGUgaW5zdGFuY2VvZiBFbGVtZW50O1xufVxuXG5mdW5jdGlvbiBpc0hUTUxFbGVtZW50KG5vZGUpIHtcbiAgdmFyIE93bkVsZW1lbnQgPSBnZXRXaW5kb3cobm9kZSkuSFRNTEVsZW1lbnQ7XG4gIHJldHVybiBub2RlIGluc3RhbmNlb2YgT3duRWxlbWVudCB8fCBub2RlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIGlzU2hhZG93Um9vdChub2RlKSB7XG4gIC8vIElFIDExIGhhcyBubyBTaGFkb3dSb290XG4gIGlmICh0eXBlb2YgU2hhZG93Um9vdCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgT3duRWxlbWVudCA9IGdldFdpbmRvdyhub2RlKS5TaGFkb3dSb290O1xuICByZXR1cm4gbm9kZSBpbnN0YW5jZW9mIE93bkVsZW1lbnQgfHwgbm9kZSBpbnN0YW5jZW9mIFNoYWRvd1Jvb3Q7XG59XG5cbmV4cG9ydCB7IGlzRWxlbWVudCwgaXNIVE1MRWxlbWVudCwgaXNTaGFkb3dSb290IH07IiwiaW1wb3J0IGdldE5vZGVOYW1lIGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0Tm9kZU5hbWUuanNcIjtcbmltcG9ydCB7IGlzSFRNTEVsZW1lbnQgfSBmcm9tIFwiLi4vZG9tLXV0aWxzL2luc3RhbmNlT2YuanNcIjsgLy8gVGhpcyBtb2RpZmllciB0YWtlcyB0aGUgc3R5bGVzIHByZXBhcmVkIGJ5IHRoZSBgY29tcHV0ZVN0eWxlc2AgbW9kaWZpZXJcbi8vIGFuZCBhcHBsaWVzIHRoZW0gdG8gdGhlIEhUTUxFbGVtZW50cyBzdWNoIGFzIHBvcHBlciBhbmQgYXJyb3dcblxuZnVuY3Rpb24gYXBwbHlTdHlsZXMoX3JlZikge1xuICB2YXIgc3RhdGUgPSBfcmVmLnN0YXRlO1xuICBPYmplY3Qua2V5cyhzdGF0ZS5lbGVtZW50cykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciBzdHlsZSA9IHN0YXRlLnN0eWxlc1tuYW1lXSB8fCB7fTtcbiAgICB2YXIgYXR0cmlidXRlcyA9IHN0YXRlLmF0dHJpYnV0ZXNbbmFtZV0gfHwge307XG4gICAgdmFyIGVsZW1lbnQgPSBzdGF0ZS5lbGVtZW50c1tuYW1lXTsgLy8gYXJyb3cgaXMgb3B0aW9uYWwgKyB2aXJ0dWFsIGVsZW1lbnRzXG5cbiAgICBpZiAoIWlzSFRNTEVsZW1lbnQoZWxlbWVudCkgfHwgIWdldE5vZGVOYW1lKGVsZW1lbnQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfSAvLyBGbG93IGRvZXNuJ3Qgc3VwcG9ydCB0byBleHRlbmQgdGhpcyBwcm9wZXJ0eSwgYnV0IGl0J3MgdGhlIG1vc3RcbiAgICAvLyBlZmZlY3RpdmUgd2F5IHRvIGFwcGx5IHN0eWxlcyB0byBhbiBIVE1MRWxlbWVudFxuICAgIC8vICRGbG93Rml4TWVbY2Fubm90LXdyaXRlXVxuXG5cbiAgICBPYmplY3QuYXNzaWduKGVsZW1lbnQuc3R5bGUsIHN0eWxlKTtcbiAgICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICB2YXIgdmFsdWUgPSBhdHRyaWJ1dGVzW25hbWVdO1xuXG4gICAgICBpZiAodmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUgPT09IHRydWUgPyAnJyA6IHZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGVmZmVjdChfcmVmMikge1xuICB2YXIgc3RhdGUgPSBfcmVmMi5zdGF0ZTtcbiAgdmFyIGluaXRpYWxTdHlsZXMgPSB7XG4gICAgcG9wcGVyOiB7XG4gICAgICBwb3NpdGlvbjogc3RhdGUub3B0aW9ucy5zdHJhdGVneSxcbiAgICAgIGxlZnQ6ICcwJyxcbiAgICAgIHRvcDogJzAnLFxuICAgICAgbWFyZ2luOiAnMCdcbiAgICB9LFxuICAgIGFycm93OiB7XG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJ1xuICAgIH0sXG4gICAgcmVmZXJlbmNlOiB7fVxuICB9O1xuICBPYmplY3QuYXNzaWduKHN0YXRlLmVsZW1lbnRzLnBvcHBlci5zdHlsZSwgaW5pdGlhbFN0eWxlcy5wb3BwZXIpO1xuICBzdGF0ZS5zdHlsZXMgPSBpbml0aWFsU3R5bGVzO1xuXG4gIGlmIChzdGF0ZS5lbGVtZW50cy5hcnJvdykge1xuICAgIE9iamVjdC5hc3NpZ24oc3RhdGUuZWxlbWVudHMuYXJyb3cuc3R5bGUsIGluaXRpYWxTdHlsZXMuYXJyb3cpO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBPYmplY3Qua2V5cyhzdGF0ZS5lbGVtZW50cykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgdmFyIGVsZW1lbnQgPSBzdGF0ZS5lbGVtZW50c1tuYW1lXTtcbiAgICAgIHZhciBhdHRyaWJ1dGVzID0gc3RhdGUuYXR0cmlidXRlc1tuYW1lXSB8fCB7fTtcbiAgICAgIHZhciBzdHlsZVByb3BlcnRpZXMgPSBPYmplY3Qua2V5cyhzdGF0ZS5zdHlsZXMuaGFzT3duUHJvcGVydHkobmFtZSkgPyBzdGF0ZS5zdHlsZXNbbmFtZV0gOiBpbml0aWFsU3R5bGVzW25hbWVdKTsgLy8gU2V0IGFsbCB2YWx1ZXMgdG8gYW4gZW1wdHkgc3RyaW5nIHRvIHVuc2V0IHRoZW1cblxuICAgICAgdmFyIHN0eWxlID0gc3R5bGVQcm9wZXJ0aWVzLnJlZHVjZShmdW5jdGlvbiAoc3R5bGUsIHByb3BlcnR5KSB7XG4gICAgICAgIHN0eWxlW3Byb3BlcnR5XSA9ICcnO1xuICAgICAgICByZXR1cm4gc3R5bGU7XG4gICAgICB9LCB7fSk7IC8vIGFycm93IGlzIG9wdGlvbmFsICsgdmlydHVhbCBlbGVtZW50c1xuXG4gICAgICBpZiAoIWlzSFRNTEVsZW1lbnQoZWxlbWVudCkgfHwgIWdldE5vZGVOYW1lKGVsZW1lbnQpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgT2JqZWN0LmFzc2lnbihlbGVtZW50LnN0eWxlLCBzdHlsZSk7XG4gICAgICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xufSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnYXBwbHlTdHlsZXMnLFxuICBlbmFibGVkOiB0cnVlLFxuICBwaGFzZTogJ3dyaXRlJyxcbiAgZm46IGFwcGx5U3R5bGVzLFxuICBlZmZlY3Q6IGVmZmVjdCxcbiAgcmVxdWlyZXM6IFsnY29tcHV0ZVN0eWxlcyddXG59OyIsImltcG9ydCB7IGF1dG8gfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldEJhc2VQbGFjZW1lbnQocGxhY2VtZW50KSB7XG4gIHJldHVybiBwbGFjZW1lbnQuc3BsaXQoJy0nKVswXTtcbn0iLCJpbXBvcnQgeyBpc0hUTUxFbGVtZW50IH0gZnJvbSBcIi4vaW5zdGFuY2VPZi5qc1wiO1xudmFyIHJvdW5kID0gTWF0aC5yb3VuZDtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldEJvdW5kaW5nQ2xpZW50UmVjdChlbGVtZW50LCBpbmNsdWRlU2NhbGUpIHtcbiAgaWYgKGluY2x1ZGVTY2FsZSA9PT0gdm9pZCAwKSB7XG4gICAgaW5jbHVkZVNjYWxlID0gZmFsc2U7XG4gIH1cblxuICB2YXIgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIHZhciBzY2FsZVggPSAxO1xuICB2YXIgc2NhbGVZID0gMTtcblxuICBpZiAoaXNIVE1MRWxlbWVudChlbGVtZW50KSAmJiBpbmNsdWRlU2NhbGUpIHtcbiAgICB2YXIgb2Zmc2V0SGVpZ2h0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgdmFyIG9mZnNldFdpZHRoID0gZWxlbWVudC5vZmZzZXRXaWR0aDsgLy8gRG8gbm90IGF0dGVtcHQgdG8gZGl2aWRlIGJ5IDAsIG90aGVyd2lzZSB3ZSBnZXQgYEluZmluaXR5YCBhcyBzY2FsZVxuICAgIC8vIEZhbGxiYWNrIHRvIDEgaW4gY2FzZSBib3RoIHZhbHVlcyBhcmUgYDBgXG5cbiAgICBpZiAob2Zmc2V0V2lkdGggPiAwKSB7XG4gICAgICBzY2FsZVggPSByZWN0LndpZHRoIC8gb2Zmc2V0V2lkdGggfHwgMTtcbiAgICB9XG5cbiAgICBpZiAob2Zmc2V0SGVpZ2h0ID4gMCkge1xuICAgICAgc2NhbGVZID0gcmVjdC5oZWlnaHQgLyBvZmZzZXRIZWlnaHQgfHwgMTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHdpZHRoOiByb3VuZChyZWN0LndpZHRoIC8gc2NhbGVYKSxcbiAgICBoZWlnaHQ6IHJvdW5kKHJlY3QuaGVpZ2h0IC8gc2NhbGVZKSxcbiAgICB0b3A6IHJvdW5kKHJlY3QudG9wIC8gc2NhbGVZKSxcbiAgICByaWdodDogcm91bmQocmVjdC5yaWdodCAvIHNjYWxlWCksXG4gICAgYm90dG9tOiByb3VuZChyZWN0LmJvdHRvbSAvIHNjYWxlWSksXG4gICAgbGVmdDogcm91bmQocmVjdC5sZWZ0IC8gc2NhbGVYKSxcbiAgICB4OiByb3VuZChyZWN0LmxlZnQgLyBzY2FsZVgpLFxuICAgIHk6IHJvdW5kKHJlY3QudG9wIC8gc2NhbGVZKVxuICB9O1xufSIsImltcG9ydCBnZXRCb3VuZGluZ0NsaWVudFJlY3QgZnJvbSBcIi4vZ2V0Qm91bmRpbmdDbGllbnRSZWN0LmpzXCI7IC8vIFJldHVybnMgdGhlIGxheW91dCByZWN0IG9mIGFuIGVsZW1lbnQgcmVsYXRpdmUgdG8gaXRzIG9mZnNldFBhcmVudC4gTGF5b3V0XG4vLyBtZWFucyBpdCBkb2Vzbid0IHRha2UgaW50byBhY2NvdW50IHRyYW5zZm9ybXMuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldExheW91dFJlY3QoZWxlbWVudCkge1xuICB2YXIgY2xpZW50UmVjdCA9IGdldEJvdW5kaW5nQ2xpZW50UmVjdChlbGVtZW50KTsgLy8gVXNlIHRoZSBjbGllbnRSZWN0IHNpemVzIGlmIGl0J3Mgbm90IGJlZW4gdHJhbnNmb3JtZWQuXG4gIC8vIEZpeGVzIGh0dHBzOi8vZ2l0aHViLmNvbS9wb3BwZXJqcy9wb3BwZXItY29yZS9pc3N1ZXMvMTIyM1xuXG4gIHZhciB3aWR0aCA9IGVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gIHZhciBoZWlnaHQgPSBlbGVtZW50Lm9mZnNldEhlaWdodDtcblxuICBpZiAoTWF0aC5hYnMoY2xpZW50UmVjdC53aWR0aCAtIHdpZHRoKSA8PSAxKSB7XG4gICAgd2lkdGggPSBjbGllbnRSZWN0LndpZHRoO1xuICB9XG5cbiAgaWYgKE1hdGguYWJzKGNsaWVudFJlY3QuaGVpZ2h0IC0gaGVpZ2h0KSA8PSAxKSB7XG4gICAgaGVpZ2h0ID0gY2xpZW50UmVjdC5oZWlnaHQ7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHg6IGVsZW1lbnQub2Zmc2V0TGVmdCxcbiAgICB5OiBlbGVtZW50Lm9mZnNldFRvcCxcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHRcbiAgfTtcbn0iLCJpbXBvcnQgeyBpc1NoYWRvd1Jvb3QgfSBmcm9tIFwiLi9pbnN0YW5jZU9mLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb250YWlucyhwYXJlbnQsIGNoaWxkKSB7XG4gIHZhciByb290Tm9kZSA9IGNoaWxkLmdldFJvb3ROb2RlICYmIGNoaWxkLmdldFJvb3ROb2RlKCk7IC8vIEZpcnN0LCBhdHRlbXB0IHdpdGggZmFzdGVyIG5hdGl2ZSBtZXRob2RcblxuICBpZiAocGFyZW50LmNvbnRhaW5zKGNoaWxkKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IC8vIHRoZW4gZmFsbGJhY2sgdG8gY3VzdG9tIGltcGxlbWVudGF0aW9uIHdpdGggU2hhZG93IERPTSBzdXBwb3J0XG4gIGVsc2UgaWYgKHJvb3ROb2RlICYmIGlzU2hhZG93Um9vdChyb290Tm9kZSkpIHtcbiAgICAgIHZhciBuZXh0ID0gY2hpbGQ7XG5cbiAgICAgIGRvIHtcbiAgICAgICAgaWYgKG5leHQgJiYgcGFyZW50LmlzU2FtZU5vZGUobmV4dCkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSAvLyAkRmxvd0ZpeE1lW3Byb3AtbWlzc2luZ106IG5lZWQgYSBiZXR0ZXIgd2F5IHRvIGhhbmRsZSB0aGlzLi4uXG5cblxuICAgICAgICBuZXh0ID0gbmV4dC5wYXJlbnROb2RlIHx8IG5leHQuaG9zdDtcbiAgICAgIH0gd2hpbGUgKG5leHQpO1xuICAgIH0gLy8gR2l2ZSB1cCwgdGhlIHJlc3VsdCBpcyBmYWxzZVxuXG5cbiAgcmV0dXJuIGZhbHNlO1xufSIsImltcG9ydCBnZXRXaW5kb3cgZnJvbSBcIi4vZ2V0V2luZG93LmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpIHtcbiAgcmV0dXJuIGdldFdpbmRvdyhlbGVtZW50KS5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xufSIsImltcG9ydCBnZXROb2RlTmFtZSBmcm9tIFwiLi9nZXROb2RlTmFtZS5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaXNUYWJsZUVsZW1lbnQoZWxlbWVudCkge1xuICByZXR1cm4gWyd0YWJsZScsICd0ZCcsICd0aCddLmluZGV4T2YoZ2V0Tm9kZU5hbWUoZWxlbWVudCkpID49IDA7XG59IiwiaW1wb3J0IHsgaXNFbGVtZW50IH0gZnJvbSBcIi4vaW5zdGFuY2VPZi5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0RG9jdW1lbnRFbGVtZW50KGVsZW1lbnQpIHtcbiAgLy8gJEZsb3dGaXhNZVtpbmNvbXBhdGlibGUtcmV0dXJuXTogYXNzdW1lIGJvZHkgaXMgYWx3YXlzIGF2YWlsYWJsZVxuICByZXR1cm4gKChpc0VsZW1lbnQoZWxlbWVudCkgPyBlbGVtZW50Lm93bmVyRG9jdW1lbnQgOiAvLyAkRmxvd0ZpeE1lW3Byb3AtbWlzc2luZ11cbiAgZWxlbWVudC5kb2N1bWVudCkgfHwgd2luZG93LmRvY3VtZW50KS5kb2N1bWVudEVsZW1lbnQ7XG59IiwiaW1wb3J0IGdldE5vZGVOYW1lIGZyb20gXCIuL2dldE5vZGVOYW1lLmpzXCI7XG5pbXBvcnQgZ2V0RG9jdW1lbnRFbGVtZW50IGZyb20gXCIuL2dldERvY3VtZW50RWxlbWVudC5qc1wiO1xuaW1wb3J0IHsgaXNTaGFkb3dSb290IH0gZnJvbSBcIi4vaW5zdGFuY2VPZi5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0UGFyZW50Tm9kZShlbGVtZW50KSB7XG4gIGlmIChnZXROb2RlTmFtZShlbGVtZW50KSA9PT0gJ2h0bWwnKSB7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cblxuICByZXR1cm4gKC8vIHRoaXMgaXMgYSBxdWlja2VyIChidXQgbGVzcyB0eXBlIHNhZmUpIHdheSB0byBzYXZlIHF1aXRlIHNvbWUgYnl0ZXMgZnJvbSB0aGUgYnVuZGxlXG4gICAgLy8gJEZsb3dGaXhNZVtpbmNvbXBhdGlibGUtcmV0dXJuXVxuICAgIC8vICRGbG93Rml4TWVbcHJvcC1taXNzaW5nXVxuICAgIGVsZW1lbnQuYXNzaWduZWRTbG90IHx8IC8vIHN0ZXAgaW50byB0aGUgc2hhZG93IERPTSBvZiB0aGUgcGFyZW50IG9mIGEgc2xvdHRlZCBub2RlXG4gICAgZWxlbWVudC5wYXJlbnROb2RlIHx8ICggLy8gRE9NIEVsZW1lbnQgZGV0ZWN0ZWRcbiAgICBpc1NoYWRvd1Jvb3QoZWxlbWVudCkgPyBlbGVtZW50Lmhvc3QgOiBudWxsKSB8fCAvLyBTaGFkb3dSb290IGRldGVjdGVkXG4gICAgLy8gJEZsb3dGaXhNZVtpbmNvbXBhdGlibGUtY2FsbF06IEhUTUxFbGVtZW50IGlzIGEgTm9kZVxuICAgIGdldERvY3VtZW50RWxlbWVudChlbGVtZW50KSAvLyBmYWxsYmFja1xuXG4gICk7XG59IiwiaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi9nZXRXaW5kb3cuanNcIjtcbmltcG9ydCBnZXROb2RlTmFtZSBmcm9tIFwiLi9nZXROb2RlTmFtZS5qc1wiO1xuaW1wb3J0IGdldENvbXB1dGVkU3R5bGUgZnJvbSBcIi4vZ2V0Q29tcHV0ZWRTdHlsZS5qc1wiO1xuaW1wb3J0IHsgaXNIVE1MRWxlbWVudCB9IGZyb20gXCIuL2luc3RhbmNlT2YuanNcIjtcbmltcG9ydCBpc1RhYmxlRWxlbWVudCBmcm9tIFwiLi9pc1RhYmxlRWxlbWVudC5qc1wiO1xuaW1wb3J0IGdldFBhcmVudE5vZGUgZnJvbSBcIi4vZ2V0UGFyZW50Tm9kZS5qc1wiO1xuXG5mdW5jdGlvbiBnZXRUcnVlT2Zmc2V0UGFyZW50KGVsZW1lbnQpIHtcbiAgaWYgKCFpc0hUTUxFbGVtZW50KGVsZW1lbnQpIHx8IC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9wb3BwZXJqcy9wb3BwZXItY29yZS9pc3N1ZXMvODM3XG4gIGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkucG9zaXRpb24gPT09ICdmaXhlZCcpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBlbGVtZW50Lm9mZnNldFBhcmVudDtcbn0gLy8gYC5vZmZzZXRQYXJlbnRgIHJlcG9ydHMgYG51bGxgIGZvciBmaXhlZCBlbGVtZW50cywgd2hpbGUgYWJzb2x1dGUgZWxlbWVudHNcbi8vIHJldHVybiB0aGUgY29udGFpbmluZyBibG9ja1xuXG5cbmZ1bmN0aW9uIGdldENvbnRhaW5pbmdCbG9jayhlbGVtZW50KSB7XG4gIHZhciBpc0ZpcmVmb3ggPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZignZmlyZWZveCcpICE9PSAtMTtcbiAgdmFyIGlzSUUgPSBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ1RyaWRlbnQnKSAhPT0gLTE7XG5cbiAgaWYgKGlzSUUgJiYgaXNIVE1MRWxlbWVudChlbGVtZW50KSkge1xuICAgIC8vIEluIElFIDksIDEwIGFuZCAxMSBmaXhlZCBlbGVtZW50cyBjb250YWluaW5nIGJsb2NrIGlzIGFsd2F5cyBlc3RhYmxpc2hlZCBieSB0aGUgdmlld3BvcnRcbiAgICB2YXIgZWxlbWVudENzcyA9IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XG5cbiAgICBpZiAoZWxlbWVudENzcy5wb3NpdGlvbiA9PT0gJ2ZpeGVkJykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgdmFyIGN1cnJlbnROb2RlID0gZ2V0UGFyZW50Tm9kZShlbGVtZW50KTtcblxuICB3aGlsZSAoaXNIVE1MRWxlbWVudChjdXJyZW50Tm9kZSkgJiYgWydodG1sJywgJ2JvZHknXS5pbmRleE9mKGdldE5vZGVOYW1lKGN1cnJlbnROb2RlKSkgPCAwKSB7XG4gICAgdmFyIGNzcyA9IGdldENvbXB1dGVkU3R5bGUoY3VycmVudE5vZGUpOyAvLyBUaGlzIGlzIG5vbi1leGhhdXN0aXZlIGJ1dCBjb3ZlcnMgdGhlIG1vc3QgY29tbW9uIENTUyBwcm9wZXJ0aWVzIHRoYXRcbiAgICAvLyBjcmVhdGUgYSBjb250YWluaW5nIGJsb2NrLlxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0NTUy9Db250YWluaW5nX2Jsb2NrI2lkZW50aWZ5aW5nX3RoZV9jb250YWluaW5nX2Jsb2NrXG5cbiAgICBpZiAoY3NzLnRyYW5zZm9ybSAhPT0gJ25vbmUnIHx8IGNzcy5wZXJzcGVjdGl2ZSAhPT0gJ25vbmUnIHx8IGNzcy5jb250YWluID09PSAncGFpbnQnIHx8IFsndHJhbnNmb3JtJywgJ3BlcnNwZWN0aXZlJ10uaW5kZXhPZihjc3Mud2lsbENoYW5nZSkgIT09IC0xIHx8IGlzRmlyZWZveCAmJiBjc3Mud2lsbENoYW5nZSA9PT0gJ2ZpbHRlcicgfHwgaXNGaXJlZm94ICYmIGNzcy5maWx0ZXIgJiYgY3NzLmZpbHRlciAhPT0gJ25vbmUnKSB7XG4gICAgICByZXR1cm4gY3VycmVudE5vZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbnROb2RlID0gY3VycmVudE5vZGUucGFyZW50Tm9kZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn0gLy8gR2V0cyB0aGUgY2xvc2VzdCBhbmNlc3RvciBwb3NpdGlvbmVkIGVsZW1lbnQuIEhhbmRsZXMgc29tZSBlZGdlIGNhc2VzLFxuLy8gc3VjaCBhcyB0YWJsZSBhbmNlc3RvcnMgYW5kIGNyb3NzIGJyb3dzZXIgYnVncy5cblxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRPZmZzZXRQYXJlbnQoZWxlbWVudCkge1xuICB2YXIgd2luZG93ID0gZ2V0V2luZG93KGVsZW1lbnQpO1xuICB2YXIgb2Zmc2V0UGFyZW50ID0gZ2V0VHJ1ZU9mZnNldFBhcmVudChlbGVtZW50KTtcblxuICB3aGlsZSAob2Zmc2V0UGFyZW50ICYmIGlzVGFibGVFbGVtZW50KG9mZnNldFBhcmVudCkgJiYgZ2V0Q29tcHV0ZWRTdHlsZShvZmZzZXRQYXJlbnQpLnBvc2l0aW9uID09PSAnc3RhdGljJykge1xuICAgIG9mZnNldFBhcmVudCA9IGdldFRydWVPZmZzZXRQYXJlbnQob2Zmc2V0UGFyZW50KTtcbiAgfVxuXG4gIGlmIChvZmZzZXRQYXJlbnQgJiYgKGdldE5vZGVOYW1lKG9mZnNldFBhcmVudCkgPT09ICdodG1sJyB8fCBnZXROb2RlTmFtZShvZmZzZXRQYXJlbnQpID09PSAnYm9keScgJiYgZ2V0Q29tcHV0ZWRTdHlsZShvZmZzZXRQYXJlbnQpLnBvc2l0aW9uID09PSAnc3RhdGljJykpIHtcbiAgICByZXR1cm4gd2luZG93O1xuICB9XG5cbiAgcmV0dXJuIG9mZnNldFBhcmVudCB8fCBnZXRDb250YWluaW5nQmxvY2soZWxlbWVudCkgfHwgd2luZG93O1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldE1haW5BeGlzRnJvbVBsYWNlbWVudChwbGFjZW1lbnQpIHtcbiAgcmV0dXJuIFsndG9wJywgJ2JvdHRvbSddLmluZGV4T2YocGxhY2VtZW50KSA+PSAwID8gJ3gnIDogJ3knO1xufSIsImV4cG9ydCB2YXIgbWF4ID0gTWF0aC5tYXg7XG5leHBvcnQgdmFyIG1pbiA9IE1hdGgubWluO1xuZXhwb3J0IHZhciByb3VuZCA9IE1hdGgucm91bmQ7IiwiaW1wb3J0IHsgbWF4IGFzIG1hdGhNYXgsIG1pbiBhcyBtYXRoTWluIH0gZnJvbSBcIi4vbWF0aC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gd2l0aGluKG1pbiwgdmFsdWUsIG1heCkge1xuICByZXR1cm4gbWF0aE1heChtaW4sIG1hdGhNaW4odmFsdWUsIG1heCkpO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldEZyZXNoU2lkZU9iamVjdCgpIHtcbiAgcmV0dXJuIHtcbiAgICB0b3A6IDAsXG4gICAgcmlnaHQ6IDAsXG4gICAgYm90dG9tOiAwLFxuICAgIGxlZnQ6IDBcbiAgfTtcbn0iLCJpbXBvcnQgZ2V0RnJlc2hTaWRlT2JqZWN0IGZyb20gXCIuL2dldEZyZXNoU2lkZU9iamVjdC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWVyZ2VQYWRkaW5nT2JqZWN0KHBhZGRpbmdPYmplY3QpIHtcbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGdldEZyZXNoU2lkZU9iamVjdCgpLCBwYWRkaW5nT2JqZWN0KTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBleHBhbmRUb0hhc2hNYXAodmFsdWUsIGtleXMpIHtcbiAgcmV0dXJuIGtleXMucmVkdWNlKGZ1bmN0aW9uIChoYXNoTWFwLCBrZXkpIHtcbiAgICBoYXNoTWFwW2tleV0gPSB2YWx1ZTtcbiAgICByZXR1cm4gaGFzaE1hcDtcbiAgfSwge30pO1xufSIsImltcG9ydCBnZXRCYXNlUGxhY2VtZW50IGZyb20gXCIuLi91dGlscy9nZXRCYXNlUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgZ2V0TGF5b3V0UmVjdCBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldExheW91dFJlY3QuanNcIjtcbmltcG9ydCBjb250YWlucyBmcm9tIFwiLi4vZG9tLXV0aWxzL2NvbnRhaW5zLmpzXCI7XG5pbXBvcnQgZ2V0T2Zmc2V0UGFyZW50IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0T2Zmc2V0UGFyZW50LmpzXCI7XG5pbXBvcnQgZ2V0TWFpbkF4aXNGcm9tUGxhY2VtZW50IGZyb20gXCIuLi91dGlscy9nZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQuanNcIjtcbmltcG9ydCB3aXRoaW4gZnJvbSBcIi4uL3V0aWxzL3dpdGhpbi5qc1wiO1xuaW1wb3J0IG1lcmdlUGFkZGluZ09iamVjdCBmcm9tIFwiLi4vdXRpbHMvbWVyZ2VQYWRkaW5nT2JqZWN0LmpzXCI7XG5pbXBvcnQgZXhwYW5kVG9IYXNoTWFwIGZyb20gXCIuLi91dGlscy9leHBhbmRUb0hhc2hNYXAuanNcIjtcbmltcG9ydCB7IGxlZnQsIHJpZ2h0LCBiYXNlUGxhY2VtZW50cywgdG9wLCBib3R0b20gfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmltcG9ydCB7IGlzSFRNTEVsZW1lbnQgfSBmcm9tIFwiLi4vZG9tLXV0aWxzL2luc3RhbmNlT2YuanNcIjsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG52YXIgdG9QYWRkaW5nT2JqZWN0ID0gZnVuY3Rpb24gdG9QYWRkaW5nT2JqZWN0KHBhZGRpbmcsIHN0YXRlKSB7XG4gIHBhZGRpbmcgPSB0eXBlb2YgcGFkZGluZyA9PT0gJ2Z1bmN0aW9uJyA/IHBhZGRpbmcoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUucmVjdHMsIHtcbiAgICBwbGFjZW1lbnQ6IHN0YXRlLnBsYWNlbWVudFxuICB9KSkgOiBwYWRkaW5nO1xuICByZXR1cm4gbWVyZ2VQYWRkaW5nT2JqZWN0KHR5cGVvZiBwYWRkaW5nICE9PSAnbnVtYmVyJyA/IHBhZGRpbmcgOiBleHBhbmRUb0hhc2hNYXAocGFkZGluZywgYmFzZVBsYWNlbWVudHMpKTtcbn07XG5cbmZ1bmN0aW9uIGFycm93KF9yZWYpIHtcbiAgdmFyIF9zdGF0ZSRtb2RpZmllcnNEYXRhJDtcblxuICB2YXIgc3RhdGUgPSBfcmVmLnN0YXRlLFxuICAgICAgbmFtZSA9IF9yZWYubmFtZSxcbiAgICAgIG9wdGlvbnMgPSBfcmVmLm9wdGlvbnM7XG4gIHZhciBhcnJvd0VsZW1lbnQgPSBzdGF0ZS5lbGVtZW50cy5hcnJvdztcbiAgdmFyIHBvcHBlck9mZnNldHMgPSBzdGF0ZS5tb2RpZmllcnNEYXRhLnBvcHBlck9mZnNldHM7XG4gIHZhciBiYXNlUGxhY2VtZW50ID0gZ2V0QmFzZVBsYWNlbWVudChzdGF0ZS5wbGFjZW1lbnQpO1xuICB2YXIgYXhpcyA9IGdldE1haW5BeGlzRnJvbVBsYWNlbWVudChiYXNlUGxhY2VtZW50KTtcbiAgdmFyIGlzVmVydGljYWwgPSBbbGVmdCwgcmlnaHRdLmluZGV4T2YoYmFzZVBsYWNlbWVudCkgPj0gMDtcbiAgdmFyIGxlbiA9IGlzVmVydGljYWwgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XG5cbiAgaWYgKCFhcnJvd0VsZW1lbnQgfHwgIXBvcHBlck9mZnNldHMpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgcGFkZGluZ09iamVjdCA9IHRvUGFkZGluZ09iamVjdChvcHRpb25zLnBhZGRpbmcsIHN0YXRlKTtcbiAgdmFyIGFycm93UmVjdCA9IGdldExheW91dFJlY3QoYXJyb3dFbGVtZW50KTtcbiAgdmFyIG1pblByb3AgPSBheGlzID09PSAneScgPyB0b3AgOiBsZWZ0O1xuICB2YXIgbWF4UHJvcCA9IGF4aXMgPT09ICd5JyA/IGJvdHRvbSA6IHJpZ2h0O1xuICB2YXIgZW5kRGlmZiA9IHN0YXRlLnJlY3RzLnJlZmVyZW5jZVtsZW5dICsgc3RhdGUucmVjdHMucmVmZXJlbmNlW2F4aXNdIC0gcG9wcGVyT2Zmc2V0c1theGlzXSAtIHN0YXRlLnJlY3RzLnBvcHBlcltsZW5dO1xuICB2YXIgc3RhcnREaWZmID0gcG9wcGVyT2Zmc2V0c1theGlzXSAtIHN0YXRlLnJlY3RzLnJlZmVyZW5jZVtheGlzXTtcbiAgdmFyIGFycm93T2Zmc2V0UGFyZW50ID0gZ2V0T2Zmc2V0UGFyZW50KGFycm93RWxlbWVudCk7XG4gIHZhciBjbGllbnRTaXplID0gYXJyb3dPZmZzZXRQYXJlbnQgPyBheGlzID09PSAneScgPyBhcnJvd09mZnNldFBhcmVudC5jbGllbnRIZWlnaHQgfHwgMCA6IGFycm93T2Zmc2V0UGFyZW50LmNsaWVudFdpZHRoIHx8IDAgOiAwO1xuICB2YXIgY2VudGVyVG9SZWZlcmVuY2UgPSBlbmREaWZmIC8gMiAtIHN0YXJ0RGlmZiAvIDI7IC8vIE1ha2Ugc3VyZSB0aGUgYXJyb3cgZG9lc24ndCBvdmVyZmxvdyB0aGUgcG9wcGVyIGlmIHRoZSBjZW50ZXIgcG9pbnQgaXNcbiAgLy8gb3V0c2lkZSBvZiB0aGUgcG9wcGVyIGJvdW5kc1xuXG4gIHZhciBtaW4gPSBwYWRkaW5nT2JqZWN0W21pblByb3BdO1xuICB2YXIgbWF4ID0gY2xpZW50U2l6ZSAtIGFycm93UmVjdFtsZW5dIC0gcGFkZGluZ09iamVjdFttYXhQcm9wXTtcbiAgdmFyIGNlbnRlciA9IGNsaWVudFNpemUgLyAyIC0gYXJyb3dSZWN0W2xlbl0gLyAyICsgY2VudGVyVG9SZWZlcmVuY2U7XG4gIHZhciBvZmZzZXQgPSB3aXRoaW4obWluLCBjZW50ZXIsIG1heCk7IC8vIFByZXZlbnRzIGJyZWFraW5nIHN5bnRheCBoaWdobGlnaHRpbmcuLi5cblxuICB2YXIgYXhpc1Byb3AgPSBheGlzO1xuICBzdGF0ZS5tb2RpZmllcnNEYXRhW25hbWVdID0gKF9zdGF0ZSRtb2RpZmllcnNEYXRhJCA9IHt9LCBfc3RhdGUkbW9kaWZpZXJzRGF0YSRbYXhpc1Byb3BdID0gb2Zmc2V0LCBfc3RhdGUkbW9kaWZpZXJzRGF0YSQuY2VudGVyT2Zmc2V0ID0gb2Zmc2V0IC0gY2VudGVyLCBfc3RhdGUkbW9kaWZpZXJzRGF0YSQpO1xufVxuXG5mdW5jdGlvbiBlZmZlY3QoX3JlZjIpIHtcbiAgdmFyIHN0YXRlID0gX3JlZjIuc3RhdGUsXG4gICAgICBvcHRpb25zID0gX3JlZjIub3B0aW9ucztcbiAgdmFyIF9vcHRpb25zJGVsZW1lbnQgPSBvcHRpb25zLmVsZW1lbnQsXG4gICAgICBhcnJvd0VsZW1lbnQgPSBfb3B0aW9ucyRlbGVtZW50ID09PSB2b2lkIDAgPyAnW2RhdGEtcG9wcGVyLWFycm93XScgOiBfb3B0aW9ucyRlbGVtZW50O1xuXG4gIGlmIChhcnJvd0VsZW1lbnQgPT0gbnVsbCkge1xuICAgIHJldHVybjtcbiAgfSAvLyBDU1Mgc2VsZWN0b3JcblxuXG4gIGlmICh0eXBlb2YgYXJyb3dFbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgIGFycm93RWxlbWVudCA9IHN0YXRlLmVsZW1lbnRzLnBvcHBlci5xdWVyeVNlbGVjdG9yKGFycm93RWxlbWVudCk7XG5cbiAgICBpZiAoIWFycm93RWxlbWVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICBpZiAoIWlzSFRNTEVsZW1lbnQoYXJyb3dFbGVtZW50KSkge1xuICAgICAgY29uc29sZS5lcnJvcihbJ1BvcHBlcjogXCJhcnJvd1wiIGVsZW1lbnQgbXVzdCBiZSBhbiBIVE1MRWxlbWVudCAobm90IGFuIFNWR0VsZW1lbnQpLicsICdUbyB1c2UgYW4gU1ZHIGFycm93LCB3cmFwIGl0IGluIGFuIEhUTUxFbGVtZW50IHRoYXQgd2lsbCBiZSB1c2VkIGFzJywgJ3RoZSBhcnJvdy4nXS5qb2luKCcgJykpO1xuICAgIH1cbiAgfVxuXG4gIGlmICghY29udGFpbnMoc3RhdGUuZWxlbWVudHMucG9wcGVyLCBhcnJvd0VsZW1lbnQpKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAgICAgY29uc29sZS5lcnJvcihbJ1BvcHBlcjogXCJhcnJvd1wiIG1vZGlmaWVyXFwncyBgZWxlbWVudGAgbXVzdCBiZSBhIGNoaWxkIG9mIHRoZSBwb3BwZXInLCAnZWxlbWVudC4nXS5qb2luKCcgJykpO1xuICAgIH1cblxuICAgIHJldHVybjtcbiAgfVxuXG4gIHN0YXRlLmVsZW1lbnRzLmFycm93ID0gYXJyb3dFbGVtZW50O1xufSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnYXJyb3cnLFxuICBlbmFibGVkOiB0cnVlLFxuICBwaGFzZTogJ21haW4nLFxuICBmbjogYXJyb3csXG4gIGVmZmVjdDogZWZmZWN0LFxuICByZXF1aXJlczogWydwb3BwZXJPZmZzZXRzJ10sXG4gIHJlcXVpcmVzSWZFeGlzdHM6IFsncHJldmVudE92ZXJmbG93J11cbn07IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0VmFyaWF0aW9uKHBsYWNlbWVudCkge1xuICByZXR1cm4gcGxhY2VtZW50LnNwbGl0KCctJylbMV07XG59IiwiaW1wb3J0IHsgdG9wLCBsZWZ0LCByaWdodCwgYm90dG9tLCBlbmQgfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmltcG9ydCBnZXRPZmZzZXRQYXJlbnQgZnJvbSBcIi4uL2RvbS11dGlscy9nZXRPZmZzZXRQYXJlbnQuanNcIjtcbmltcG9ydCBnZXRXaW5kb3cgZnJvbSBcIi4uL2RvbS11dGlscy9nZXRXaW5kb3cuanNcIjtcbmltcG9ydCBnZXREb2N1bWVudEVsZW1lbnQgZnJvbSBcIi4uL2RvbS11dGlscy9nZXREb2N1bWVudEVsZW1lbnQuanNcIjtcbmltcG9ydCBnZXRDb21wdXRlZFN0eWxlIGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0Q29tcHV0ZWRTdHlsZS5qc1wiO1xuaW1wb3J0IGdldEJhc2VQbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldEJhc2VQbGFjZW1lbnQuanNcIjtcbmltcG9ydCBnZXRWYXJpYXRpb24gZnJvbSBcIi4uL3V0aWxzL2dldFZhcmlhdGlvbi5qc1wiO1xuaW1wb3J0IHsgcm91bmQgfSBmcm9tIFwiLi4vdXRpbHMvbWF0aC5qc1wiOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbnZhciB1bnNldFNpZGVzID0ge1xuICB0b3A6ICdhdXRvJyxcbiAgcmlnaHQ6ICdhdXRvJyxcbiAgYm90dG9tOiAnYXV0bycsXG4gIGxlZnQ6ICdhdXRvJ1xufTsgLy8gUm91bmQgdGhlIG9mZnNldHMgdG8gdGhlIG5lYXJlc3Qgc3VpdGFibGUgc3VicGl4ZWwgYmFzZWQgb24gdGhlIERQUi5cbi8vIFpvb21pbmcgY2FuIGNoYW5nZSB0aGUgRFBSLCBidXQgaXQgc2VlbXMgdG8gcmVwb3J0IGEgdmFsdWUgdGhhdCB3aWxsXG4vLyBjbGVhbmx5IGRpdmlkZSB0aGUgdmFsdWVzIGludG8gdGhlIGFwcHJvcHJpYXRlIHN1YnBpeGVscy5cblxuZnVuY3Rpb24gcm91bmRPZmZzZXRzQnlEUFIoX3JlZikge1xuICB2YXIgeCA9IF9yZWYueCxcbiAgICAgIHkgPSBfcmVmLnk7XG4gIHZhciB3aW4gPSB3aW5kb3c7XG4gIHZhciBkcHIgPSB3aW4uZGV2aWNlUGl4ZWxSYXRpbyB8fCAxO1xuICByZXR1cm4ge1xuICAgIHg6IHJvdW5kKHJvdW5kKHggKiBkcHIpIC8gZHByKSB8fCAwLFxuICAgIHk6IHJvdW5kKHJvdW5kKHkgKiBkcHIpIC8gZHByKSB8fCAwXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBUb1N0eWxlcyhfcmVmMikge1xuICB2YXIgX09iamVjdCRhc3NpZ24yO1xuXG4gIHZhciBwb3BwZXIgPSBfcmVmMi5wb3BwZXIsXG4gICAgICBwb3BwZXJSZWN0ID0gX3JlZjIucG9wcGVyUmVjdCxcbiAgICAgIHBsYWNlbWVudCA9IF9yZWYyLnBsYWNlbWVudCxcbiAgICAgIHZhcmlhdGlvbiA9IF9yZWYyLnZhcmlhdGlvbixcbiAgICAgIG9mZnNldHMgPSBfcmVmMi5vZmZzZXRzLFxuICAgICAgcG9zaXRpb24gPSBfcmVmMi5wb3NpdGlvbixcbiAgICAgIGdwdUFjY2VsZXJhdGlvbiA9IF9yZWYyLmdwdUFjY2VsZXJhdGlvbixcbiAgICAgIGFkYXB0aXZlID0gX3JlZjIuYWRhcHRpdmUsXG4gICAgICByb3VuZE9mZnNldHMgPSBfcmVmMi5yb3VuZE9mZnNldHM7XG5cbiAgdmFyIF9yZWYzID0gcm91bmRPZmZzZXRzID09PSB0cnVlID8gcm91bmRPZmZzZXRzQnlEUFIob2Zmc2V0cykgOiB0eXBlb2Ygcm91bmRPZmZzZXRzID09PSAnZnVuY3Rpb24nID8gcm91bmRPZmZzZXRzKG9mZnNldHMpIDogb2Zmc2V0cyxcbiAgICAgIF9yZWYzJHggPSBfcmVmMy54LFxuICAgICAgeCA9IF9yZWYzJHggPT09IHZvaWQgMCA/IDAgOiBfcmVmMyR4LFxuICAgICAgX3JlZjMkeSA9IF9yZWYzLnksXG4gICAgICB5ID0gX3JlZjMkeSA9PT0gdm9pZCAwID8gMCA6IF9yZWYzJHk7XG5cbiAgdmFyIGhhc1ggPSBvZmZzZXRzLmhhc093blByb3BlcnR5KCd4Jyk7XG4gIHZhciBoYXNZID0gb2Zmc2V0cy5oYXNPd25Qcm9wZXJ0eSgneScpO1xuICB2YXIgc2lkZVggPSBsZWZ0O1xuICB2YXIgc2lkZVkgPSB0b3A7XG4gIHZhciB3aW4gPSB3aW5kb3c7XG5cbiAgaWYgKGFkYXB0aXZlKSB7XG4gICAgdmFyIG9mZnNldFBhcmVudCA9IGdldE9mZnNldFBhcmVudChwb3BwZXIpO1xuICAgIHZhciBoZWlnaHRQcm9wID0gJ2NsaWVudEhlaWdodCc7XG4gICAgdmFyIHdpZHRoUHJvcCA9ICdjbGllbnRXaWR0aCc7XG5cbiAgICBpZiAob2Zmc2V0UGFyZW50ID09PSBnZXRXaW5kb3cocG9wcGVyKSkge1xuICAgICAgb2Zmc2V0UGFyZW50ID0gZ2V0RG9jdW1lbnRFbGVtZW50KHBvcHBlcik7XG5cbiAgICAgIGlmIChnZXRDb21wdXRlZFN0eWxlKG9mZnNldFBhcmVudCkucG9zaXRpb24gIT09ICdzdGF0aWMnICYmIHBvc2l0aW9uID09PSAnYWJzb2x1dGUnKSB7XG4gICAgICAgIGhlaWdodFByb3AgPSAnc2Nyb2xsSGVpZ2h0JztcbiAgICAgICAgd2lkdGhQcm9wID0gJ3Njcm9sbFdpZHRoJztcbiAgICAgIH1cbiAgICB9IC8vICRGbG93Rml4TWVbaW5jb21wYXRpYmxlLWNhc3RdOiBmb3JjZSB0eXBlIHJlZmluZW1lbnQsIHdlIGNvbXBhcmUgb2Zmc2V0UGFyZW50IHdpdGggd2luZG93IGFib3ZlLCBidXQgRmxvdyBkb2Vzbid0IGRldGVjdCBpdFxuXG5cbiAgICBvZmZzZXRQYXJlbnQgPSBvZmZzZXRQYXJlbnQ7XG5cbiAgICBpZiAocGxhY2VtZW50ID09PSB0b3AgfHwgKHBsYWNlbWVudCA9PT0gbGVmdCB8fCBwbGFjZW1lbnQgPT09IHJpZ2h0KSAmJiB2YXJpYXRpb24gPT09IGVuZCkge1xuICAgICAgc2lkZVkgPSBib3R0b207IC8vICRGbG93Rml4TWVbcHJvcC1taXNzaW5nXVxuXG4gICAgICB5IC09IG9mZnNldFBhcmVudFtoZWlnaHRQcm9wXSAtIHBvcHBlclJlY3QuaGVpZ2h0O1xuICAgICAgeSAqPSBncHVBY2NlbGVyYXRpb24gPyAxIDogLTE7XG4gICAgfVxuXG4gICAgaWYgKHBsYWNlbWVudCA9PT0gbGVmdCB8fCAocGxhY2VtZW50ID09PSB0b3AgfHwgcGxhY2VtZW50ID09PSBib3R0b20pICYmIHZhcmlhdGlvbiA9PT0gZW5kKSB7XG4gICAgICBzaWRlWCA9IHJpZ2h0OyAvLyAkRmxvd0ZpeE1lW3Byb3AtbWlzc2luZ11cblxuICAgICAgeCAtPSBvZmZzZXRQYXJlbnRbd2lkdGhQcm9wXSAtIHBvcHBlclJlY3Qud2lkdGg7XG4gICAgICB4ICo9IGdwdUFjY2VsZXJhdGlvbiA/IDEgOiAtMTtcbiAgICB9XG4gIH1cblxuICB2YXIgY29tbW9uU3R5bGVzID0gT2JqZWN0LmFzc2lnbih7XG4gICAgcG9zaXRpb246IHBvc2l0aW9uXG4gIH0sIGFkYXB0aXZlICYmIHVuc2V0U2lkZXMpO1xuXG4gIGlmIChncHVBY2NlbGVyYXRpb24pIHtcbiAgICB2YXIgX09iamVjdCRhc3NpZ247XG5cbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgY29tbW9uU3R5bGVzLCAoX09iamVjdCRhc3NpZ24gPSB7fSwgX09iamVjdCRhc3NpZ25bc2lkZVldID0gaGFzWSA/ICcwJyA6ICcnLCBfT2JqZWN0JGFzc2lnbltzaWRlWF0gPSBoYXNYID8gJzAnIDogJycsIF9PYmplY3QkYXNzaWduLnRyYW5zZm9ybSA9ICh3aW4uZGV2aWNlUGl4ZWxSYXRpbyB8fCAxKSA8PSAxID8gXCJ0cmFuc2xhdGUoXCIgKyB4ICsgXCJweCwgXCIgKyB5ICsgXCJweClcIiA6IFwidHJhbnNsYXRlM2QoXCIgKyB4ICsgXCJweCwgXCIgKyB5ICsgXCJweCwgMClcIiwgX09iamVjdCRhc3NpZ24pKTtcbiAgfVxuXG4gIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBjb21tb25TdHlsZXMsIChfT2JqZWN0JGFzc2lnbjIgPSB7fSwgX09iamVjdCRhc3NpZ24yW3NpZGVZXSA9IGhhc1kgPyB5ICsgXCJweFwiIDogJycsIF9PYmplY3QkYXNzaWduMltzaWRlWF0gPSBoYXNYID8geCArIFwicHhcIiA6ICcnLCBfT2JqZWN0JGFzc2lnbjIudHJhbnNmb3JtID0gJycsIF9PYmplY3QkYXNzaWduMikpO1xufVxuXG5mdW5jdGlvbiBjb21wdXRlU3R5bGVzKF9yZWY0KSB7XG4gIHZhciBzdGF0ZSA9IF9yZWY0LnN0YXRlLFxuICAgICAgb3B0aW9ucyA9IF9yZWY0Lm9wdGlvbnM7XG4gIHZhciBfb3B0aW9ucyRncHVBY2NlbGVyYXQgPSBvcHRpb25zLmdwdUFjY2VsZXJhdGlvbixcbiAgICAgIGdwdUFjY2VsZXJhdGlvbiA9IF9vcHRpb25zJGdwdUFjY2VsZXJhdCA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJGdwdUFjY2VsZXJhdCxcbiAgICAgIF9vcHRpb25zJGFkYXB0aXZlID0gb3B0aW9ucy5hZGFwdGl2ZSxcbiAgICAgIGFkYXB0aXZlID0gX29wdGlvbnMkYWRhcHRpdmUgPT09IHZvaWQgMCA/IHRydWUgOiBfb3B0aW9ucyRhZGFwdGl2ZSxcbiAgICAgIF9vcHRpb25zJHJvdW5kT2Zmc2V0cyA9IG9wdGlvbnMucm91bmRPZmZzZXRzLFxuICAgICAgcm91bmRPZmZzZXRzID0gX29wdGlvbnMkcm91bmRPZmZzZXRzID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkcm91bmRPZmZzZXRzO1xuXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICB2YXIgdHJhbnNpdGlvblByb3BlcnR5ID0gZ2V0Q29tcHV0ZWRTdHlsZShzdGF0ZS5lbGVtZW50cy5wb3BwZXIpLnRyYW5zaXRpb25Qcm9wZXJ0eSB8fCAnJztcblxuICAgIGlmIChhZGFwdGl2ZSAmJiBbJ3RyYW5zZm9ybScsICd0b3AnLCAncmlnaHQnLCAnYm90dG9tJywgJ2xlZnQnXS5zb21lKGZ1bmN0aW9uIChwcm9wZXJ0eSkge1xuICAgICAgcmV0dXJuIHRyYW5zaXRpb25Qcm9wZXJ0eS5pbmRleE9mKHByb3BlcnR5KSA+PSAwO1xuICAgIH0pKSB7XG4gICAgICBjb25zb2xlLndhcm4oWydQb3BwZXI6IERldGVjdGVkIENTUyB0cmFuc2l0aW9ucyBvbiBhdCBsZWFzdCBvbmUgb2YgdGhlIGZvbGxvd2luZycsICdDU1MgcHJvcGVydGllczogXCJ0cmFuc2Zvcm1cIiwgXCJ0b3BcIiwgXCJyaWdodFwiLCBcImJvdHRvbVwiLCBcImxlZnRcIi4nLCAnXFxuXFxuJywgJ0Rpc2FibGUgdGhlIFwiY29tcHV0ZVN0eWxlc1wiIG1vZGlmaWVyXFwncyBgYWRhcHRpdmVgIG9wdGlvbiB0byBhbGxvdycsICdmb3Igc21vb3RoIHRyYW5zaXRpb25zLCBvciByZW1vdmUgdGhlc2UgcHJvcGVydGllcyBmcm9tIHRoZSBDU1MnLCAndHJhbnNpdGlvbiBkZWNsYXJhdGlvbiBvbiB0aGUgcG9wcGVyIGVsZW1lbnQgaWYgb25seSB0cmFuc2l0aW9uaW5nJywgJ29wYWNpdHkgb3IgYmFja2dyb3VuZC1jb2xvciBmb3IgZXhhbXBsZS4nLCAnXFxuXFxuJywgJ1dlIHJlY29tbWVuZCB1c2luZyB0aGUgcG9wcGVyIGVsZW1lbnQgYXMgYSB3cmFwcGVyIGFyb3VuZCBhbiBpbm5lcicsICdlbGVtZW50IHRoYXQgY2FuIGhhdmUgYW55IENTUyBwcm9wZXJ0eSB0cmFuc2l0aW9uZWQgZm9yIGFuaW1hdGlvbnMuJ10uam9pbignICcpKTtcbiAgICB9XG4gIH1cblxuICB2YXIgY29tbW9uU3R5bGVzID0ge1xuICAgIHBsYWNlbWVudDogZ2V0QmFzZVBsYWNlbWVudChzdGF0ZS5wbGFjZW1lbnQpLFxuICAgIHZhcmlhdGlvbjogZ2V0VmFyaWF0aW9uKHN0YXRlLnBsYWNlbWVudCksXG4gICAgcG9wcGVyOiBzdGF0ZS5lbGVtZW50cy5wb3BwZXIsXG4gICAgcG9wcGVyUmVjdDogc3RhdGUucmVjdHMucG9wcGVyLFxuICAgIGdwdUFjY2VsZXJhdGlvbjogZ3B1QWNjZWxlcmF0aW9uXG4gIH07XG5cbiAgaWYgKHN0YXRlLm1vZGlmaWVyc0RhdGEucG9wcGVyT2Zmc2V0cyAhPSBudWxsKSB7XG4gICAgc3RhdGUuc3R5bGVzLnBvcHBlciA9IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLnN0eWxlcy5wb3BwZXIsIG1hcFRvU3R5bGVzKE9iamVjdC5hc3NpZ24oe30sIGNvbW1vblN0eWxlcywge1xuICAgICAgb2Zmc2V0czogc3RhdGUubW9kaWZpZXJzRGF0YS5wb3BwZXJPZmZzZXRzLFxuICAgICAgcG9zaXRpb246IHN0YXRlLm9wdGlvbnMuc3RyYXRlZ3ksXG4gICAgICBhZGFwdGl2ZTogYWRhcHRpdmUsXG4gICAgICByb3VuZE9mZnNldHM6IHJvdW5kT2Zmc2V0c1xuICAgIH0pKSk7XG4gIH1cblxuICBpZiAoc3RhdGUubW9kaWZpZXJzRGF0YS5hcnJvdyAhPSBudWxsKSB7XG4gICAgc3RhdGUuc3R5bGVzLmFycm93ID0gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuc3R5bGVzLmFycm93LCBtYXBUb1N0eWxlcyhPYmplY3QuYXNzaWduKHt9LCBjb21tb25TdHlsZXMsIHtcbiAgICAgIG9mZnNldHM6IHN0YXRlLm1vZGlmaWVyc0RhdGEuYXJyb3csXG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgIGFkYXB0aXZlOiBmYWxzZSxcbiAgICAgIHJvdW5kT2Zmc2V0czogcm91bmRPZmZzZXRzXG4gICAgfSkpKTtcbiAgfVxuXG4gIHN0YXRlLmF0dHJpYnV0ZXMucG9wcGVyID0gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuYXR0cmlidXRlcy5wb3BwZXIsIHtcbiAgICAnZGF0YS1wb3BwZXItcGxhY2VtZW50Jzogc3RhdGUucGxhY2VtZW50XG4gIH0pO1xufSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnY29tcHV0ZVN0eWxlcycsXG4gIGVuYWJsZWQ6IHRydWUsXG4gIHBoYXNlOiAnYmVmb3JlV3JpdGUnLFxuICBmbjogY29tcHV0ZVN0eWxlcyxcbiAgZGF0YToge31cbn07IiwiaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldFdpbmRvdy5qc1wiOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbnZhciBwYXNzaXZlID0ge1xuICBwYXNzaXZlOiB0cnVlXG59O1xuXG5mdW5jdGlvbiBlZmZlY3QoX3JlZikge1xuICB2YXIgc3RhdGUgPSBfcmVmLnN0YXRlLFxuICAgICAgaW5zdGFuY2UgPSBfcmVmLmluc3RhbmNlLFxuICAgICAgb3B0aW9ucyA9IF9yZWYub3B0aW9ucztcbiAgdmFyIF9vcHRpb25zJHNjcm9sbCA9IG9wdGlvbnMuc2Nyb2xsLFxuICAgICAgc2Nyb2xsID0gX29wdGlvbnMkc2Nyb2xsID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkc2Nyb2xsLFxuICAgICAgX29wdGlvbnMkcmVzaXplID0gb3B0aW9ucy5yZXNpemUsXG4gICAgICByZXNpemUgPSBfb3B0aW9ucyRyZXNpemUgPT09IHZvaWQgMCA/IHRydWUgOiBfb3B0aW9ucyRyZXNpemU7XG4gIHZhciB3aW5kb3cgPSBnZXRXaW5kb3coc3RhdGUuZWxlbWVudHMucG9wcGVyKTtcbiAgdmFyIHNjcm9sbFBhcmVudHMgPSBbXS5jb25jYXQoc3RhdGUuc2Nyb2xsUGFyZW50cy5yZWZlcmVuY2UsIHN0YXRlLnNjcm9sbFBhcmVudHMucG9wcGVyKTtcblxuICBpZiAoc2Nyb2xsKSB7XG4gICAgc2Nyb2xsUGFyZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChzY3JvbGxQYXJlbnQpIHtcbiAgICAgIHNjcm9sbFBhcmVudC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBpbnN0YW5jZS51cGRhdGUsIHBhc3NpdmUpO1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKHJlc2l6ZSkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBpbnN0YW5jZS51cGRhdGUsIHBhc3NpdmUpO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoc2Nyb2xsKSB7XG4gICAgICBzY3JvbGxQYXJlbnRzLmZvckVhY2goZnVuY3Rpb24gKHNjcm9sbFBhcmVudCkge1xuICAgICAgICBzY3JvbGxQYXJlbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgaW5zdGFuY2UudXBkYXRlLCBwYXNzaXZlKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChyZXNpemUpIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBpbnN0YW5jZS51cGRhdGUsIHBhc3NpdmUpO1xuICAgIH1cbiAgfTtcbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ2V2ZW50TGlzdGVuZXJzJyxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgcGhhc2U6ICd3cml0ZScsXG4gIGZuOiBmdW5jdGlvbiBmbigpIHt9LFxuICBlZmZlY3Q6IGVmZmVjdCxcbiAgZGF0YToge31cbn07IiwidmFyIGhhc2ggPSB7XG4gIGxlZnQ6ICdyaWdodCcsXG4gIHJpZ2h0OiAnbGVmdCcsXG4gIGJvdHRvbTogJ3RvcCcsXG4gIHRvcDogJ2JvdHRvbSdcbn07XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRPcHBvc2l0ZVBsYWNlbWVudChwbGFjZW1lbnQpIHtcbiAgcmV0dXJuIHBsYWNlbWVudC5yZXBsYWNlKC9sZWZ0fHJpZ2h0fGJvdHRvbXx0b3AvZywgZnVuY3Rpb24gKG1hdGNoZWQpIHtcbiAgICByZXR1cm4gaGFzaFttYXRjaGVkXTtcbiAgfSk7XG59IiwidmFyIGhhc2ggPSB7XG4gIHN0YXJ0OiAnZW5kJyxcbiAgZW5kOiAnc3RhcnQnXG59O1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0T3Bwb3NpdGVWYXJpYXRpb25QbGFjZW1lbnQocGxhY2VtZW50KSB7XG4gIHJldHVybiBwbGFjZW1lbnQucmVwbGFjZSgvc3RhcnR8ZW5kL2csIGZ1bmN0aW9uIChtYXRjaGVkKSB7XG4gICAgcmV0dXJuIGhhc2hbbWF0Y2hlZF07XG4gIH0pO1xufSIsImltcG9ydCBnZXRXaW5kb3cgZnJvbSBcIi4vZ2V0V2luZG93LmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRXaW5kb3dTY3JvbGwobm9kZSkge1xuICB2YXIgd2luID0gZ2V0V2luZG93KG5vZGUpO1xuICB2YXIgc2Nyb2xsTGVmdCA9IHdpbi5wYWdlWE9mZnNldDtcbiAgdmFyIHNjcm9sbFRvcCA9IHdpbi5wYWdlWU9mZnNldDtcbiAgcmV0dXJuIHtcbiAgICBzY3JvbGxMZWZ0OiBzY3JvbGxMZWZ0LFxuICAgIHNjcm9sbFRvcDogc2Nyb2xsVG9wXG4gIH07XG59IiwiaW1wb3J0IGdldEJvdW5kaW5nQ2xpZW50UmVjdCBmcm9tIFwiLi9nZXRCb3VuZGluZ0NsaWVudFJlY3QuanNcIjtcbmltcG9ydCBnZXREb2N1bWVudEVsZW1lbnQgZnJvbSBcIi4vZ2V0RG9jdW1lbnRFbGVtZW50LmpzXCI7XG5pbXBvcnQgZ2V0V2luZG93U2Nyb2xsIGZyb20gXCIuL2dldFdpbmRvd1Njcm9sbC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0V2luZG93U2Nyb2xsQmFyWChlbGVtZW50KSB7XG4gIC8vIElmIDxodG1sPiBoYXMgYSBDU1Mgd2lkdGggZ3JlYXRlciB0aGFuIHRoZSB2aWV3cG9ydCwgdGhlbiB0aGlzIHdpbGwgYmVcbiAgLy8gaW5jb3JyZWN0IGZvciBSVEwuXG4gIC8vIFBvcHBlciAxIGlzIGJyb2tlbiBpbiB0aGlzIGNhc2UgYW5kIG5ldmVyIGhhZCBhIGJ1ZyByZXBvcnQgc28gbGV0J3MgYXNzdW1lXG4gIC8vIGl0J3Mgbm90IGFuIGlzc3VlLiBJIGRvbid0IHRoaW5rIGFueW9uZSBldmVyIHNwZWNpZmllcyB3aWR0aCBvbiA8aHRtbD5cbiAgLy8gYW55d2F5LlxuICAvLyBCcm93c2VycyB3aGVyZSB0aGUgbGVmdCBzY3JvbGxiYXIgZG9lc24ndCBjYXVzZSBhbiBpc3N1ZSByZXBvcnQgYDBgIGZvclxuICAvLyB0aGlzIChlLmcuIEVkZ2UgMjAxOSwgSUUxMSwgU2FmYXJpKVxuICByZXR1cm4gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KGdldERvY3VtZW50RWxlbWVudChlbGVtZW50KSkubGVmdCArIGdldFdpbmRvd1Njcm9sbChlbGVtZW50KS5zY3JvbGxMZWZ0O1xufSIsImltcG9ydCBnZXRXaW5kb3cgZnJvbSBcIi4vZ2V0V2luZG93LmpzXCI7XG5pbXBvcnQgZ2V0RG9jdW1lbnRFbGVtZW50IGZyb20gXCIuL2dldERvY3VtZW50RWxlbWVudC5qc1wiO1xuaW1wb3J0IGdldFdpbmRvd1Njcm9sbEJhclggZnJvbSBcIi4vZ2V0V2luZG93U2Nyb2xsQmFyWC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0Vmlld3BvcnRSZWN0KGVsZW1lbnQpIHtcbiAgdmFyIHdpbiA9IGdldFdpbmRvdyhlbGVtZW50KTtcbiAgdmFyIGh0bWwgPSBnZXREb2N1bWVudEVsZW1lbnQoZWxlbWVudCk7XG4gIHZhciB2aXN1YWxWaWV3cG9ydCA9IHdpbi52aXN1YWxWaWV3cG9ydDtcbiAgdmFyIHdpZHRoID0gaHRtbC5jbGllbnRXaWR0aDtcbiAgdmFyIGhlaWdodCA9IGh0bWwuY2xpZW50SGVpZ2h0O1xuICB2YXIgeCA9IDA7XG4gIHZhciB5ID0gMDsgLy8gTkI6IFRoaXMgaXNuJ3Qgc3VwcG9ydGVkIG9uIGlPUyA8PSAxMi4gSWYgdGhlIGtleWJvYXJkIGlzIG9wZW4sIHRoZSBwb3BwZXJcbiAgLy8gY2FuIGJlIG9ic2N1cmVkIHVuZGVybmVhdGggaXQuXG4gIC8vIEFsc28sIGBodG1sLmNsaWVudEhlaWdodGAgYWRkcyB0aGUgYm90dG9tIGJhciBoZWlnaHQgaW4gU2FmYXJpIGlPUywgZXZlblxuICAvLyBpZiBpdCBpc24ndCBvcGVuLCBzbyBpZiB0aGlzIGlzbid0IGF2YWlsYWJsZSwgdGhlIHBvcHBlciB3aWxsIGJlIGRldGVjdGVkXG4gIC8vIHRvIG92ZXJmbG93IHRoZSBib3R0b20gb2YgdGhlIHNjcmVlbiB0b28gZWFybHkuXG5cbiAgaWYgKHZpc3VhbFZpZXdwb3J0KSB7XG4gICAgd2lkdGggPSB2aXN1YWxWaWV3cG9ydC53aWR0aDtcbiAgICBoZWlnaHQgPSB2aXN1YWxWaWV3cG9ydC5oZWlnaHQ7IC8vIFVzZXMgTGF5b3V0IFZpZXdwb3J0IChsaWtlIENocm9tZTsgU2FmYXJpIGRvZXMgbm90IGN1cnJlbnRseSlcbiAgICAvLyBJbiBDaHJvbWUsIGl0IHJldHVybnMgYSB2YWx1ZSB2ZXJ5IGNsb3NlIHRvIDAgKCsvLSkgYnV0IGNvbnRhaW5zIHJvdW5kaW5nXG4gICAgLy8gZXJyb3JzIGR1ZSB0byBmbG9hdGluZyBwb2ludCBudW1iZXJzLCBzbyB3ZSBuZWVkIHRvIGNoZWNrIHByZWNpc2lvbi5cbiAgICAvLyBTYWZhcmkgcmV0dXJucyBhIG51bWJlciA8PSAwLCB1c3VhbGx5IDwgLTEgd2hlbiBwaW5jaC16b29tZWRcbiAgICAvLyBGZWF0dXJlIGRldGVjdGlvbiBmYWlscyBpbiBtb2JpbGUgZW11bGF0aW9uIG1vZGUgaW4gQ2hyb21lLlxuICAgIC8vIE1hdGguYWJzKHdpbi5pbm5lcldpZHRoIC8gdmlzdWFsVmlld3BvcnQuc2NhbGUgLSB2aXN1YWxWaWV3cG9ydC53aWR0aCkgPFxuICAgIC8vIDAuMDAxXG4gICAgLy8gRmFsbGJhY2sgaGVyZTogXCJOb3QgU2FmYXJpXCIgdXNlckFnZW50XG5cbiAgICBpZiAoIS9eKCg/IWNocm9tZXxhbmRyb2lkKS4pKnNhZmFyaS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpIHtcbiAgICAgIHggPSB2aXN1YWxWaWV3cG9ydC5vZmZzZXRMZWZ0O1xuICAgICAgeSA9IHZpc3VhbFZpZXdwb3J0Lm9mZnNldFRvcDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHdpZHRoOiB3aWR0aCxcbiAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICB4OiB4ICsgZ2V0V2luZG93U2Nyb2xsQmFyWChlbGVtZW50KSxcbiAgICB5OiB5XG4gIH07XG59IiwiaW1wb3J0IGdldERvY3VtZW50RWxlbWVudCBmcm9tIFwiLi9nZXREb2N1bWVudEVsZW1lbnQuanNcIjtcbmltcG9ydCBnZXRDb21wdXRlZFN0eWxlIGZyb20gXCIuL2dldENvbXB1dGVkU3R5bGUuanNcIjtcbmltcG9ydCBnZXRXaW5kb3dTY3JvbGxCYXJYIGZyb20gXCIuL2dldFdpbmRvd1Njcm9sbEJhclguanNcIjtcbmltcG9ydCBnZXRXaW5kb3dTY3JvbGwgZnJvbSBcIi4vZ2V0V2luZG93U2Nyb2xsLmpzXCI7XG5pbXBvcnQgeyBtYXggfSBmcm9tIFwiLi4vdXRpbHMvbWF0aC5qc1wiOyAvLyBHZXRzIHRoZSBlbnRpcmUgc2l6ZSBvZiB0aGUgc2Nyb2xsYWJsZSBkb2N1bWVudCBhcmVhLCBldmVuIGV4dGVuZGluZyBvdXRzaWRlXG4vLyBvZiB0aGUgYDxodG1sPmAgYW5kIGA8Ym9keT5gIHJlY3QgYm91bmRzIGlmIGhvcml6b250YWxseSBzY3JvbGxhYmxlXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERvY3VtZW50UmVjdChlbGVtZW50KSB7XG4gIHZhciBfZWxlbWVudCRvd25lckRvY3VtZW47XG5cbiAgdmFyIGh0bWwgPSBnZXREb2N1bWVudEVsZW1lbnQoZWxlbWVudCk7XG4gIHZhciB3aW5TY3JvbGwgPSBnZXRXaW5kb3dTY3JvbGwoZWxlbWVudCk7XG4gIHZhciBib2R5ID0gKF9lbGVtZW50JG93bmVyRG9jdW1lbiA9IGVsZW1lbnQub3duZXJEb2N1bWVudCkgPT0gbnVsbCA/IHZvaWQgMCA6IF9lbGVtZW50JG93bmVyRG9jdW1lbi5ib2R5O1xuICB2YXIgd2lkdGggPSBtYXgoaHRtbC5zY3JvbGxXaWR0aCwgaHRtbC5jbGllbnRXaWR0aCwgYm9keSA/IGJvZHkuc2Nyb2xsV2lkdGggOiAwLCBib2R5ID8gYm9keS5jbGllbnRXaWR0aCA6IDApO1xuICB2YXIgaGVpZ2h0ID0gbWF4KGh0bWwuc2Nyb2xsSGVpZ2h0LCBodG1sLmNsaWVudEhlaWdodCwgYm9keSA/IGJvZHkuc2Nyb2xsSGVpZ2h0IDogMCwgYm9keSA/IGJvZHkuY2xpZW50SGVpZ2h0IDogMCk7XG4gIHZhciB4ID0gLXdpblNjcm9sbC5zY3JvbGxMZWZ0ICsgZ2V0V2luZG93U2Nyb2xsQmFyWChlbGVtZW50KTtcbiAgdmFyIHkgPSAtd2luU2Nyb2xsLnNjcm9sbFRvcDtcblxuICBpZiAoZ2V0Q29tcHV0ZWRTdHlsZShib2R5IHx8IGh0bWwpLmRpcmVjdGlvbiA9PT0gJ3J0bCcpIHtcbiAgICB4ICs9IG1heChodG1sLmNsaWVudFdpZHRoLCBib2R5ID8gYm9keS5jbGllbnRXaWR0aCA6IDApIC0gd2lkdGg7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHdpZHRoOiB3aWR0aCxcbiAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICB4OiB4LFxuICAgIHk6IHlcbiAgfTtcbn0iLCJpbXBvcnQgZ2V0Q29tcHV0ZWRTdHlsZSBmcm9tIFwiLi9nZXRDb21wdXRlZFN0eWxlLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc1Njcm9sbFBhcmVudChlbGVtZW50KSB7XG4gIC8vIEZpcmVmb3ggd2FudHMgdXMgdG8gY2hlY2sgYC14YCBhbmQgYC15YCB2YXJpYXRpb25zIGFzIHdlbGxcbiAgdmFyIF9nZXRDb21wdXRlZFN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KSxcbiAgICAgIG92ZXJmbG93ID0gX2dldENvbXB1dGVkU3R5bGUub3ZlcmZsb3csXG4gICAgICBvdmVyZmxvd1ggPSBfZ2V0Q29tcHV0ZWRTdHlsZS5vdmVyZmxvd1gsXG4gICAgICBvdmVyZmxvd1kgPSBfZ2V0Q29tcHV0ZWRTdHlsZS5vdmVyZmxvd1k7XG5cbiAgcmV0dXJuIC9hdXRvfHNjcm9sbHxvdmVybGF5fGhpZGRlbi8udGVzdChvdmVyZmxvdyArIG92ZXJmbG93WSArIG92ZXJmbG93WCk7XG59IiwiaW1wb3J0IGdldFBhcmVudE5vZGUgZnJvbSBcIi4vZ2V0UGFyZW50Tm9kZS5qc1wiO1xuaW1wb3J0IGlzU2Nyb2xsUGFyZW50IGZyb20gXCIuL2lzU2Nyb2xsUGFyZW50LmpzXCI7XG5pbXBvcnQgZ2V0Tm9kZU5hbWUgZnJvbSBcIi4vZ2V0Tm9kZU5hbWUuanNcIjtcbmltcG9ydCB7IGlzSFRNTEVsZW1lbnQgfSBmcm9tIFwiLi9pbnN0YW5jZU9mLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRTY3JvbGxQYXJlbnQobm9kZSkge1xuICBpZiAoWydodG1sJywgJ2JvZHknLCAnI2RvY3VtZW50J10uaW5kZXhPZihnZXROb2RlTmFtZShub2RlKSkgPj0gMCkge1xuICAgIC8vICRGbG93Rml4TWVbaW5jb21wYXRpYmxlLXJldHVybl06IGFzc3VtZSBib2R5IGlzIGFsd2F5cyBhdmFpbGFibGVcbiAgICByZXR1cm4gbm9kZS5vd25lckRvY3VtZW50LmJvZHk7XG4gIH1cblxuICBpZiAoaXNIVE1MRWxlbWVudChub2RlKSAmJiBpc1Njcm9sbFBhcmVudChub2RlKSkge1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgcmV0dXJuIGdldFNjcm9sbFBhcmVudChnZXRQYXJlbnROb2RlKG5vZGUpKTtcbn0iLCJpbXBvcnQgZ2V0U2Nyb2xsUGFyZW50IGZyb20gXCIuL2dldFNjcm9sbFBhcmVudC5qc1wiO1xuaW1wb3J0IGdldFBhcmVudE5vZGUgZnJvbSBcIi4vZ2V0UGFyZW50Tm9kZS5qc1wiO1xuaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi9nZXRXaW5kb3cuanNcIjtcbmltcG9ydCBpc1Njcm9sbFBhcmVudCBmcm9tIFwiLi9pc1Njcm9sbFBhcmVudC5qc1wiO1xuLypcbmdpdmVuIGEgRE9NIGVsZW1lbnQsIHJldHVybiB0aGUgbGlzdCBvZiBhbGwgc2Nyb2xsIHBhcmVudHMsIHVwIHRoZSBsaXN0IG9mIGFuY2Vzb3JzXG51bnRpbCB3ZSBnZXQgdG8gdGhlIHRvcCB3aW5kb3cgb2JqZWN0LiBUaGlzIGxpc3QgaXMgd2hhdCB3ZSBhdHRhY2ggc2Nyb2xsIGxpc3RlbmVyc1xudG8sIGJlY2F1c2UgaWYgYW55IG9mIHRoZXNlIHBhcmVudCBlbGVtZW50cyBzY3JvbGwsIHdlJ2xsIG5lZWQgdG8gcmUtY2FsY3VsYXRlIHRoZVxucmVmZXJlbmNlIGVsZW1lbnQncyBwb3NpdGlvbi5cbiovXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxpc3RTY3JvbGxQYXJlbnRzKGVsZW1lbnQsIGxpc3QpIHtcbiAgdmFyIF9lbGVtZW50JG93bmVyRG9jdW1lbjtcblxuICBpZiAobGlzdCA9PT0gdm9pZCAwKSB7XG4gICAgbGlzdCA9IFtdO1xuICB9XG5cbiAgdmFyIHNjcm9sbFBhcmVudCA9IGdldFNjcm9sbFBhcmVudChlbGVtZW50KTtcbiAgdmFyIGlzQm9keSA9IHNjcm9sbFBhcmVudCA9PT0gKChfZWxlbWVudCRvd25lckRvY3VtZW4gPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQpID09IG51bGwgPyB2b2lkIDAgOiBfZWxlbWVudCRvd25lckRvY3VtZW4uYm9keSk7XG4gIHZhciB3aW4gPSBnZXRXaW5kb3coc2Nyb2xsUGFyZW50KTtcbiAgdmFyIHRhcmdldCA9IGlzQm9keSA/IFt3aW5dLmNvbmNhdCh3aW4udmlzdWFsVmlld3BvcnQgfHwgW10sIGlzU2Nyb2xsUGFyZW50KHNjcm9sbFBhcmVudCkgPyBzY3JvbGxQYXJlbnQgOiBbXSkgOiBzY3JvbGxQYXJlbnQ7XG4gIHZhciB1cGRhdGVkTGlzdCA9IGxpc3QuY29uY2F0KHRhcmdldCk7XG4gIHJldHVybiBpc0JvZHkgPyB1cGRhdGVkTGlzdCA6IC8vICRGbG93Rml4TWVbaW5jb21wYXRpYmxlLWNhbGxdOiBpc0JvZHkgdGVsbHMgdXMgdGFyZ2V0IHdpbGwgYmUgYW4gSFRNTEVsZW1lbnQgaGVyZVxuICB1cGRhdGVkTGlzdC5jb25jYXQobGlzdFNjcm9sbFBhcmVudHMoZ2V0UGFyZW50Tm9kZSh0YXJnZXQpKSk7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVjdFRvQ2xpZW50UmVjdChyZWN0KSB7XG4gIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCByZWN0LCB7XG4gICAgbGVmdDogcmVjdC54LFxuICAgIHRvcDogcmVjdC55LFxuICAgIHJpZ2h0OiByZWN0LnggKyByZWN0LndpZHRoLFxuICAgIGJvdHRvbTogcmVjdC55ICsgcmVjdC5oZWlnaHRcbiAgfSk7XG59IiwiaW1wb3J0IHsgdmlld3BvcnQgfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmltcG9ydCBnZXRWaWV3cG9ydFJlY3QgZnJvbSBcIi4vZ2V0Vmlld3BvcnRSZWN0LmpzXCI7XG5pbXBvcnQgZ2V0RG9jdW1lbnRSZWN0IGZyb20gXCIuL2dldERvY3VtZW50UmVjdC5qc1wiO1xuaW1wb3J0IGxpc3RTY3JvbGxQYXJlbnRzIGZyb20gXCIuL2xpc3RTY3JvbGxQYXJlbnRzLmpzXCI7XG5pbXBvcnQgZ2V0T2Zmc2V0UGFyZW50IGZyb20gXCIuL2dldE9mZnNldFBhcmVudC5qc1wiO1xuaW1wb3J0IGdldERvY3VtZW50RWxlbWVudCBmcm9tIFwiLi9nZXREb2N1bWVudEVsZW1lbnQuanNcIjtcbmltcG9ydCBnZXRDb21wdXRlZFN0eWxlIGZyb20gXCIuL2dldENvbXB1dGVkU3R5bGUuanNcIjtcbmltcG9ydCB7IGlzRWxlbWVudCwgaXNIVE1MRWxlbWVudCB9IGZyb20gXCIuL2luc3RhbmNlT2YuanNcIjtcbmltcG9ydCBnZXRCb3VuZGluZ0NsaWVudFJlY3QgZnJvbSBcIi4vZ2V0Qm91bmRpbmdDbGllbnRSZWN0LmpzXCI7XG5pbXBvcnQgZ2V0UGFyZW50Tm9kZSBmcm9tIFwiLi9nZXRQYXJlbnROb2RlLmpzXCI7XG5pbXBvcnQgY29udGFpbnMgZnJvbSBcIi4vY29udGFpbnMuanNcIjtcbmltcG9ydCBnZXROb2RlTmFtZSBmcm9tIFwiLi9nZXROb2RlTmFtZS5qc1wiO1xuaW1wb3J0IHJlY3RUb0NsaWVudFJlY3QgZnJvbSBcIi4uL3V0aWxzL3JlY3RUb0NsaWVudFJlY3QuanNcIjtcbmltcG9ydCB7IG1heCwgbWluIH0gZnJvbSBcIi4uL3V0aWxzL21hdGguanNcIjtcblxuZnVuY3Rpb24gZ2V0SW5uZXJCb3VuZGluZ0NsaWVudFJlY3QoZWxlbWVudCkge1xuICB2YXIgcmVjdCA9IGdldEJvdW5kaW5nQ2xpZW50UmVjdChlbGVtZW50KTtcbiAgcmVjdC50b3AgPSByZWN0LnRvcCArIGVsZW1lbnQuY2xpZW50VG9wO1xuICByZWN0LmxlZnQgPSByZWN0LmxlZnQgKyBlbGVtZW50LmNsaWVudExlZnQ7XG4gIHJlY3QuYm90dG9tID0gcmVjdC50b3AgKyBlbGVtZW50LmNsaWVudEhlaWdodDtcbiAgcmVjdC5yaWdodCA9IHJlY3QubGVmdCArIGVsZW1lbnQuY2xpZW50V2lkdGg7XG4gIHJlY3Qud2lkdGggPSBlbGVtZW50LmNsaWVudFdpZHRoO1xuICByZWN0LmhlaWdodCA9IGVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICByZWN0LnggPSByZWN0LmxlZnQ7XG4gIHJlY3QueSA9IHJlY3QudG9wO1xuICByZXR1cm4gcmVjdDtcbn1cblxuZnVuY3Rpb24gZ2V0Q2xpZW50UmVjdEZyb21NaXhlZFR5cGUoZWxlbWVudCwgY2xpcHBpbmdQYXJlbnQpIHtcbiAgcmV0dXJuIGNsaXBwaW5nUGFyZW50ID09PSB2aWV3cG9ydCA/IHJlY3RUb0NsaWVudFJlY3QoZ2V0Vmlld3BvcnRSZWN0KGVsZW1lbnQpKSA6IGlzSFRNTEVsZW1lbnQoY2xpcHBpbmdQYXJlbnQpID8gZ2V0SW5uZXJCb3VuZGluZ0NsaWVudFJlY3QoY2xpcHBpbmdQYXJlbnQpIDogcmVjdFRvQ2xpZW50UmVjdChnZXREb2N1bWVudFJlY3QoZ2V0RG9jdW1lbnRFbGVtZW50KGVsZW1lbnQpKSk7XG59IC8vIEEgXCJjbGlwcGluZyBwYXJlbnRcIiBpcyBhbiBvdmVyZmxvd2FibGUgY29udGFpbmVyIHdpdGggdGhlIGNoYXJhY3RlcmlzdGljIG9mXG4vLyBjbGlwcGluZyAob3IgaGlkaW5nKSBvdmVyZmxvd2luZyBlbGVtZW50cyB3aXRoIGEgcG9zaXRpb24gZGlmZmVyZW50IGZyb21cbi8vIGBpbml0aWFsYFxuXG5cbmZ1bmN0aW9uIGdldENsaXBwaW5nUGFyZW50cyhlbGVtZW50KSB7XG4gIHZhciBjbGlwcGluZ1BhcmVudHMgPSBsaXN0U2Nyb2xsUGFyZW50cyhnZXRQYXJlbnROb2RlKGVsZW1lbnQpKTtcbiAgdmFyIGNhbkVzY2FwZUNsaXBwaW5nID0gWydhYnNvbHV0ZScsICdmaXhlZCddLmluZGV4T2YoZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5wb3NpdGlvbikgPj0gMDtcbiAgdmFyIGNsaXBwZXJFbGVtZW50ID0gY2FuRXNjYXBlQ2xpcHBpbmcgJiYgaXNIVE1MRWxlbWVudChlbGVtZW50KSA/IGdldE9mZnNldFBhcmVudChlbGVtZW50KSA6IGVsZW1lbnQ7XG5cbiAgaWYgKCFpc0VsZW1lbnQoY2xpcHBlckVsZW1lbnQpKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9IC8vICRGbG93Rml4TWVbaW5jb21wYXRpYmxlLXJldHVybl06IGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9mbG93L2lzc3Vlcy8xNDE0XG5cblxuICByZXR1cm4gY2xpcHBpbmdQYXJlbnRzLmZpbHRlcihmdW5jdGlvbiAoY2xpcHBpbmdQYXJlbnQpIHtcbiAgICByZXR1cm4gaXNFbGVtZW50KGNsaXBwaW5nUGFyZW50KSAmJiBjb250YWlucyhjbGlwcGluZ1BhcmVudCwgY2xpcHBlckVsZW1lbnQpICYmIGdldE5vZGVOYW1lKGNsaXBwaW5nUGFyZW50KSAhPT0gJ2JvZHknO1xuICB9KTtcbn0gLy8gR2V0cyB0aGUgbWF4aW11bSBhcmVhIHRoYXQgdGhlIGVsZW1lbnQgaXMgdmlzaWJsZSBpbiBkdWUgdG8gYW55IG51bWJlciBvZlxuLy8gY2xpcHBpbmcgcGFyZW50c1xuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldENsaXBwaW5nUmVjdChlbGVtZW50LCBib3VuZGFyeSwgcm9vdEJvdW5kYXJ5KSB7XG4gIHZhciBtYWluQ2xpcHBpbmdQYXJlbnRzID0gYm91bmRhcnkgPT09ICdjbGlwcGluZ1BhcmVudHMnID8gZ2V0Q2xpcHBpbmdQYXJlbnRzKGVsZW1lbnQpIDogW10uY29uY2F0KGJvdW5kYXJ5KTtcbiAgdmFyIGNsaXBwaW5nUGFyZW50cyA9IFtdLmNvbmNhdChtYWluQ2xpcHBpbmdQYXJlbnRzLCBbcm9vdEJvdW5kYXJ5XSk7XG4gIHZhciBmaXJzdENsaXBwaW5nUGFyZW50ID0gY2xpcHBpbmdQYXJlbnRzWzBdO1xuICB2YXIgY2xpcHBpbmdSZWN0ID0gY2xpcHBpbmdQYXJlbnRzLnJlZHVjZShmdW5jdGlvbiAoYWNjUmVjdCwgY2xpcHBpbmdQYXJlbnQpIHtcbiAgICB2YXIgcmVjdCA9IGdldENsaWVudFJlY3RGcm9tTWl4ZWRUeXBlKGVsZW1lbnQsIGNsaXBwaW5nUGFyZW50KTtcbiAgICBhY2NSZWN0LnRvcCA9IG1heChyZWN0LnRvcCwgYWNjUmVjdC50b3ApO1xuICAgIGFjY1JlY3QucmlnaHQgPSBtaW4ocmVjdC5yaWdodCwgYWNjUmVjdC5yaWdodCk7XG4gICAgYWNjUmVjdC5ib3R0b20gPSBtaW4ocmVjdC5ib3R0b20sIGFjY1JlY3QuYm90dG9tKTtcbiAgICBhY2NSZWN0LmxlZnQgPSBtYXgocmVjdC5sZWZ0LCBhY2NSZWN0LmxlZnQpO1xuICAgIHJldHVybiBhY2NSZWN0O1xuICB9LCBnZXRDbGllbnRSZWN0RnJvbU1peGVkVHlwZShlbGVtZW50LCBmaXJzdENsaXBwaW5nUGFyZW50KSk7XG4gIGNsaXBwaW5nUmVjdC53aWR0aCA9IGNsaXBwaW5nUmVjdC5yaWdodCAtIGNsaXBwaW5nUmVjdC5sZWZ0O1xuICBjbGlwcGluZ1JlY3QuaGVpZ2h0ID0gY2xpcHBpbmdSZWN0LmJvdHRvbSAtIGNsaXBwaW5nUmVjdC50b3A7XG4gIGNsaXBwaW5nUmVjdC54ID0gY2xpcHBpbmdSZWN0LmxlZnQ7XG4gIGNsaXBwaW5nUmVjdC55ID0gY2xpcHBpbmdSZWN0LnRvcDtcbiAgcmV0dXJuIGNsaXBwaW5nUmVjdDtcbn0iLCJpbXBvcnQgZ2V0QmFzZVBsYWNlbWVudCBmcm9tIFwiLi9nZXRCYXNlUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgZ2V0VmFyaWF0aW9uIGZyb20gXCIuL2dldFZhcmlhdGlvbi5qc1wiO1xuaW1wb3J0IGdldE1haW5BeGlzRnJvbVBsYWNlbWVudCBmcm9tIFwiLi9nZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQuanNcIjtcbmltcG9ydCB7IHRvcCwgcmlnaHQsIGJvdHRvbSwgbGVmdCwgc3RhcnQsIGVuZCB9IGZyb20gXCIuLi9lbnVtcy5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY29tcHV0ZU9mZnNldHMoX3JlZikge1xuICB2YXIgcmVmZXJlbmNlID0gX3JlZi5yZWZlcmVuY2UsXG4gICAgICBlbGVtZW50ID0gX3JlZi5lbGVtZW50LFxuICAgICAgcGxhY2VtZW50ID0gX3JlZi5wbGFjZW1lbnQ7XG4gIHZhciBiYXNlUGxhY2VtZW50ID0gcGxhY2VtZW50ID8gZ2V0QmFzZVBsYWNlbWVudChwbGFjZW1lbnQpIDogbnVsbDtcbiAgdmFyIHZhcmlhdGlvbiA9IHBsYWNlbWVudCA/IGdldFZhcmlhdGlvbihwbGFjZW1lbnQpIDogbnVsbDtcbiAgdmFyIGNvbW1vblggPSByZWZlcmVuY2UueCArIHJlZmVyZW5jZS53aWR0aCAvIDIgLSBlbGVtZW50LndpZHRoIC8gMjtcbiAgdmFyIGNvbW1vblkgPSByZWZlcmVuY2UueSArIHJlZmVyZW5jZS5oZWlnaHQgLyAyIC0gZWxlbWVudC5oZWlnaHQgLyAyO1xuICB2YXIgb2Zmc2V0cztcblxuICBzd2l0Y2ggKGJhc2VQbGFjZW1lbnQpIHtcbiAgICBjYXNlIHRvcDpcbiAgICAgIG9mZnNldHMgPSB7XG4gICAgICAgIHg6IGNvbW1vblgsXG4gICAgICAgIHk6IHJlZmVyZW5jZS55IC0gZWxlbWVudC5oZWlnaHRcbiAgICAgIH07XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgYm90dG9tOlxuICAgICAgb2Zmc2V0cyA9IHtcbiAgICAgICAgeDogY29tbW9uWCxcbiAgICAgICAgeTogcmVmZXJlbmNlLnkgKyByZWZlcmVuY2UuaGVpZ2h0XG4gICAgICB9O1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIHJpZ2h0OlxuICAgICAgb2Zmc2V0cyA9IHtcbiAgICAgICAgeDogcmVmZXJlbmNlLnggKyByZWZlcmVuY2Uud2lkdGgsXG4gICAgICAgIHk6IGNvbW1vbllcbiAgICAgIH07XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgbGVmdDpcbiAgICAgIG9mZnNldHMgPSB7XG4gICAgICAgIHg6IHJlZmVyZW5jZS54IC0gZWxlbWVudC53aWR0aCxcbiAgICAgICAgeTogY29tbW9uWVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIG9mZnNldHMgPSB7XG4gICAgICAgIHg6IHJlZmVyZW5jZS54LFxuICAgICAgICB5OiByZWZlcmVuY2UueVxuICAgICAgfTtcbiAgfVxuXG4gIHZhciBtYWluQXhpcyA9IGJhc2VQbGFjZW1lbnQgPyBnZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQoYmFzZVBsYWNlbWVudCkgOiBudWxsO1xuXG4gIGlmIChtYWluQXhpcyAhPSBudWxsKSB7XG4gICAgdmFyIGxlbiA9IG1haW5BeGlzID09PSAneScgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XG5cbiAgICBzd2l0Y2ggKHZhcmlhdGlvbikge1xuICAgICAgY2FzZSBzdGFydDpcbiAgICAgICAgb2Zmc2V0c1ttYWluQXhpc10gPSBvZmZzZXRzW21haW5BeGlzXSAtIChyZWZlcmVuY2VbbGVuXSAvIDIgLSBlbGVtZW50W2xlbl0gLyAyKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgZW5kOlxuICAgICAgICBvZmZzZXRzW21haW5BeGlzXSA9IG9mZnNldHNbbWFpbkF4aXNdICsgKHJlZmVyZW5jZVtsZW5dIC8gMiAtIGVsZW1lbnRbbGVuXSAvIDIpO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2Zmc2V0cztcbn0iLCJpbXBvcnQgZ2V0Q2xpcHBpbmdSZWN0IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0Q2xpcHBpbmdSZWN0LmpzXCI7XG5pbXBvcnQgZ2V0RG9jdW1lbnRFbGVtZW50IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0RG9jdW1lbnRFbGVtZW50LmpzXCI7XG5pbXBvcnQgZ2V0Qm91bmRpbmdDbGllbnRSZWN0IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0Qm91bmRpbmdDbGllbnRSZWN0LmpzXCI7XG5pbXBvcnQgY29tcHV0ZU9mZnNldHMgZnJvbSBcIi4vY29tcHV0ZU9mZnNldHMuanNcIjtcbmltcG9ydCByZWN0VG9DbGllbnRSZWN0IGZyb20gXCIuL3JlY3RUb0NsaWVudFJlY3QuanNcIjtcbmltcG9ydCB7IGNsaXBwaW5nUGFyZW50cywgcmVmZXJlbmNlLCBwb3BwZXIsIGJvdHRvbSwgdG9wLCByaWdodCwgYmFzZVBsYWNlbWVudHMsIHZpZXdwb3J0IH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7XG5pbXBvcnQgeyBpc0VsZW1lbnQgfSBmcm9tIFwiLi4vZG9tLXV0aWxzL2luc3RhbmNlT2YuanNcIjtcbmltcG9ydCBtZXJnZVBhZGRpbmdPYmplY3QgZnJvbSBcIi4vbWVyZ2VQYWRkaW5nT2JqZWN0LmpzXCI7XG5pbXBvcnQgZXhwYW5kVG9IYXNoTWFwIGZyb20gXCIuL2V4cGFuZFRvSGFzaE1hcC5qc1wiOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRldGVjdE92ZXJmbG93KHN0YXRlLCBvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zID09PSB2b2lkIDApIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cblxuICB2YXIgX29wdGlvbnMgPSBvcHRpb25zLFxuICAgICAgX29wdGlvbnMkcGxhY2VtZW50ID0gX29wdGlvbnMucGxhY2VtZW50LFxuICAgICAgcGxhY2VtZW50ID0gX29wdGlvbnMkcGxhY2VtZW50ID09PSB2b2lkIDAgPyBzdGF0ZS5wbGFjZW1lbnQgOiBfb3B0aW9ucyRwbGFjZW1lbnQsXG4gICAgICBfb3B0aW9ucyRib3VuZGFyeSA9IF9vcHRpb25zLmJvdW5kYXJ5LFxuICAgICAgYm91bmRhcnkgPSBfb3B0aW9ucyRib3VuZGFyeSA9PT0gdm9pZCAwID8gY2xpcHBpbmdQYXJlbnRzIDogX29wdGlvbnMkYm91bmRhcnksXG4gICAgICBfb3B0aW9ucyRyb290Qm91bmRhcnkgPSBfb3B0aW9ucy5yb290Qm91bmRhcnksXG4gICAgICByb290Qm91bmRhcnkgPSBfb3B0aW9ucyRyb290Qm91bmRhcnkgPT09IHZvaWQgMCA/IHZpZXdwb3J0IDogX29wdGlvbnMkcm9vdEJvdW5kYXJ5LFxuICAgICAgX29wdGlvbnMkZWxlbWVudENvbnRlID0gX29wdGlvbnMuZWxlbWVudENvbnRleHQsXG4gICAgICBlbGVtZW50Q29udGV4dCA9IF9vcHRpb25zJGVsZW1lbnRDb250ZSA9PT0gdm9pZCAwID8gcG9wcGVyIDogX29wdGlvbnMkZWxlbWVudENvbnRlLFxuICAgICAgX29wdGlvbnMkYWx0Qm91bmRhcnkgPSBfb3B0aW9ucy5hbHRCb3VuZGFyeSxcbiAgICAgIGFsdEJvdW5kYXJ5ID0gX29wdGlvbnMkYWx0Qm91bmRhcnkgPT09IHZvaWQgMCA/IGZhbHNlIDogX29wdGlvbnMkYWx0Qm91bmRhcnksXG4gICAgICBfb3B0aW9ucyRwYWRkaW5nID0gX29wdGlvbnMucGFkZGluZyxcbiAgICAgIHBhZGRpbmcgPSBfb3B0aW9ucyRwYWRkaW5nID09PSB2b2lkIDAgPyAwIDogX29wdGlvbnMkcGFkZGluZztcbiAgdmFyIHBhZGRpbmdPYmplY3QgPSBtZXJnZVBhZGRpbmdPYmplY3QodHlwZW9mIHBhZGRpbmcgIT09ICdudW1iZXInID8gcGFkZGluZyA6IGV4cGFuZFRvSGFzaE1hcChwYWRkaW5nLCBiYXNlUGxhY2VtZW50cykpO1xuICB2YXIgYWx0Q29udGV4dCA9IGVsZW1lbnRDb250ZXh0ID09PSBwb3BwZXIgPyByZWZlcmVuY2UgOiBwb3BwZXI7XG4gIHZhciBwb3BwZXJSZWN0ID0gc3RhdGUucmVjdHMucG9wcGVyO1xuICB2YXIgZWxlbWVudCA9IHN0YXRlLmVsZW1lbnRzW2FsdEJvdW5kYXJ5ID8gYWx0Q29udGV4dCA6IGVsZW1lbnRDb250ZXh0XTtcbiAgdmFyIGNsaXBwaW5nQ2xpZW50UmVjdCA9IGdldENsaXBwaW5nUmVjdChpc0VsZW1lbnQoZWxlbWVudCkgPyBlbGVtZW50IDogZWxlbWVudC5jb250ZXh0RWxlbWVudCB8fCBnZXREb2N1bWVudEVsZW1lbnQoc3RhdGUuZWxlbWVudHMucG9wcGVyKSwgYm91bmRhcnksIHJvb3RCb3VuZGFyeSk7XG4gIHZhciByZWZlcmVuY2VDbGllbnRSZWN0ID0gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KHN0YXRlLmVsZW1lbnRzLnJlZmVyZW5jZSk7XG4gIHZhciBwb3BwZXJPZmZzZXRzID0gY29tcHV0ZU9mZnNldHMoe1xuICAgIHJlZmVyZW5jZTogcmVmZXJlbmNlQ2xpZW50UmVjdCxcbiAgICBlbGVtZW50OiBwb3BwZXJSZWN0LFxuICAgIHN0cmF0ZWd5OiAnYWJzb2x1dGUnLFxuICAgIHBsYWNlbWVudDogcGxhY2VtZW50XG4gIH0pO1xuICB2YXIgcG9wcGVyQ2xpZW50UmVjdCA9IHJlY3RUb0NsaWVudFJlY3QoT2JqZWN0LmFzc2lnbih7fSwgcG9wcGVyUmVjdCwgcG9wcGVyT2Zmc2V0cykpO1xuICB2YXIgZWxlbWVudENsaWVudFJlY3QgPSBlbGVtZW50Q29udGV4dCA9PT0gcG9wcGVyID8gcG9wcGVyQ2xpZW50UmVjdCA6IHJlZmVyZW5jZUNsaWVudFJlY3Q7IC8vIHBvc2l0aXZlID0gb3ZlcmZsb3dpbmcgdGhlIGNsaXBwaW5nIHJlY3RcbiAgLy8gMCBvciBuZWdhdGl2ZSA9IHdpdGhpbiB0aGUgY2xpcHBpbmcgcmVjdFxuXG4gIHZhciBvdmVyZmxvd09mZnNldHMgPSB7XG4gICAgdG9wOiBjbGlwcGluZ0NsaWVudFJlY3QudG9wIC0gZWxlbWVudENsaWVudFJlY3QudG9wICsgcGFkZGluZ09iamVjdC50b3AsXG4gICAgYm90dG9tOiBlbGVtZW50Q2xpZW50UmVjdC5ib3R0b20gLSBjbGlwcGluZ0NsaWVudFJlY3QuYm90dG9tICsgcGFkZGluZ09iamVjdC5ib3R0b20sXG4gICAgbGVmdDogY2xpcHBpbmdDbGllbnRSZWN0LmxlZnQgLSBlbGVtZW50Q2xpZW50UmVjdC5sZWZ0ICsgcGFkZGluZ09iamVjdC5sZWZ0LFxuICAgIHJpZ2h0OiBlbGVtZW50Q2xpZW50UmVjdC5yaWdodCAtIGNsaXBwaW5nQ2xpZW50UmVjdC5yaWdodCArIHBhZGRpbmdPYmplY3QucmlnaHRcbiAgfTtcbiAgdmFyIG9mZnNldERhdGEgPSBzdGF0ZS5tb2RpZmllcnNEYXRhLm9mZnNldDsgLy8gT2Zmc2V0cyBjYW4gYmUgYXBwbGllZCBvbmx5IHRvIHRoZSBwb3BwZXIgZWxlbWVudFxuXG4gIGlmIChlbGVtZW50Q29udGV4dCA9PT0gcG9wcGVyICYmIG9mZnNldERhdGEpIHtcbiAgICB2YXIgb2Zmc2V0ID0gb2Zmc2V0RGF0YVtwbGFjZW1lbnRdO1xuICAgIE9iamVjdC5rZXlzKG92ZXJmbG93T2Zmc2V0cykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICB2YXIgbXVsdGlwbHkgPSBbcmlnaHQsIGJvdHRvbV0uaW5kZXhPZihrZXkpID49IDAgPyAxIDogLTE7XG4gICAgICB2YXIgYXhpcyA9IFt0b3AsIGJvdHRvbV0uaW5kZXhPZihrZXkpID49IDAgPyAneScgOiAneCc7XG4gICAgICBvdmVyZmxvd09mZnNldHNba2V5XSArPSBvZmZzZXRbYXhpc10gKiBtdWx0aXBseTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBvdmVyZmxvd09mZnNldHM7XG59IiwiaW1wb3J0IGdldFZhcmlhdGlvbiBmcm9tIFwiLi9nZXRWYXJpYXRpb24uanNcIjtcbmltcG9ydCB7IHZhcmlhdGlvblBsYWNlbWVudHMsIGJhc2VQbGFjZW1lbnRzLCBwbGFjZW1lbnRzIGFzIGFsbFBsYWNlbWVudHMgfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmltcG9ydCBkZXRlY3RPdmVyZmxvdyBmcm9tIFwiLi9kZXRlY3RPdmVyZmxvdy5qc1wiO1xuaW1wb3J0IGdldEJhc2VQbGFjZW1lbnQgZnJvbSBcIi4vZ2V0QmFzZVBsYWNlbWVudC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY29tcHV0ZUF1dG9QbGFjZW1lbnQoc3RhdGUsIG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuXG4gIHZhciBfb3B0aW9ucyA9IG9wdGlvbnMsXG4gICAgICBwbGFjZW1lbnQgPSBfb3B0aW9ucy5wbGFjZW1lbnQsXG4gICAgICBib3VuZGFyeSA9IF9vcHRpb25zLmJvdW5kYXJ5LFxuICAgICAgcm9vdEJvdW5kYXJ5ID0gX29wdGlvbnMucm9vdEJvdW5kYXJ5LFxuICAgICAgcGFkZGluZyA9IF9vcHRpb25zLnBhZGRpbmcsXG4gICAgICBmbGlwVmFyaWF0aW9ucyA9IF9vcHRpb25zLmZsaXBWYXJpYXRpb25zLFxuICAgICAgX29wdGlvbnMkYWxsb3dlZEF1dG9QID0gX29wdGlvbnMuYWxsb3dlZEF1dG9QbGFjZW1lbnRzLFxuICAgICAgYWxsb3dlZEF1dG9QbGFjZW1lbnRzID0gX29wdGlvbnMkYWxsb3dlZEF1dG9QID09PSB2b2lkIDAgPyBhbGxQbGFjZW1lbnRzIDogX29wdGlvbnMkYWxsb3dlZEF1dG9QO1xuICB2YXIgdmFyaWF0aW9uID0gZ2V0VmFyaWF0aW9uKHBsYWNlbWVudCk7XG4gIHZhciBwbGFjZW1lbnRzID0gdmFyaWF0aW9uID8gZmxpcFZhcmlhdGlvbnMgPyB2YXJpYXRpb25QbGFjZW1lbnRzIDogdmFyaWF0aW9uUGxhY2VtZW50cy5maWx0ZXIoZnVuY3Rpb24gKHBsYWNlbWVudCkge1xuICAgIHJldHVybiBnZXRWYXJpYXRpb24ocGxhY2VtZW50KSA9PT0gdmFyaWF0aW9uO1xuICB9KSA6IGJhc2VQbGFjZW1lbnRzO1xuICB2YXIgYWxsb3dlZFBsYWNlbWVudHMgPSBwbGFjZW1lbnRzLmZpbHRlcihmdW5jdGlvbiAocGxhY2VtZW50KSB7XG4gICAgcmV0dXJuIGFsbG93ZWRBdXRvUGxhY2VtZW50cy5pbmRleE9mKHBsYWNlbWVudCkgPj0gMDtcbiAgfSk7XG5cbiAgaWYgKGFsbG93ZWRQbGFjZW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGFsbG93ZWRQbGFjZW1lbnRzID0gcGxhY2VtZW50cztcblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoWydQb3BwZXI6IFRoZSBgYWxsb3dlZEF1dG9QbGFjZW1lbnRzYCBvcHRpb24gZGlkIG5vdCBhbGxvdyBhbnknLCAncGxhY2VtZW50cy4gRW5zdXJlIHRoZSBgcGxhY2VtZW50YCBvcHRpb24gbWF0Y2hlcyB0aGUgdmFyaWF0aW9uJywgJ29mIHRoZSBhbGxvd2VkIHBsYWNlbWVudHMuJywgJ0ZvciBleGFtcGxlLCBcImF1dG9cIiBjYW5ub3QgYmUgdXNlZCB0byBhbGxvdyBcImJvdHRvbS1zdGFydFwiLicsICdVc2UgXCJhdXRvLXN0YXJ0XCIgaW5zdGVhZC4nXS5qb2luKCcgJykpO1xuICAgIH1cbiAgfSAvLyAkRmxvd0ZpeE1lW2luY29tcGF0aWJsZS10eXBlXTogRmxvdyBzZWVtcyB0byBoYXZlIHByb2JsZW1zIHdpdGggdHdvIGFycmF5IHVuaW9ucy4uLlxuXG5cbiAgdmFyIG92ZXJmbG93cyA9IGFsbG93ZWRQbGFjZW1lbnRzLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBwbGFjZW1lbnQpIHtcbiAgICBhY2NbcGxhY2VtZW50XSA9IGRldGVjdE92ZXJmbG93KHN0YXRlLCB7XG4gICAgICBwbGFjZW1lbnQ6IHBsYWNlbWVudCxcbiAgICAgIGJvdW5kYXJ5OiBib3VuZGFyeSxcbiAgICAgIHJvb3RCb3VuZGFyeTogcm9vdEJvdW5kYXJ5LFxuICAgICAgcGFkZGluZzogcGFkZGluZ1xuICAgIH0pW2dldEJhc2VQbGFjZW1lbnQocGxhY2VtZW50KV07XG4gICAgcmV0dXJuIGFjYztcbiAgfSwge30pO1xuICByZXR1cm4gT2JqZWN0LmtleXMob3ZlcmZsb3dzKS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgcmV0dXJuIG92ZXJmbG93c1thXSAtIG92ZXJmbG93c1tiXTtcbiAgfSk7XG59IiwiaW1wb3J0IGdldE9wcG9zaXRlUGxhY2VtZW50IGZyb20gXCIuLi91dGlscy9nZXRPcHBvc2l0ZVBsYWNlbWVudC5qc1wiO1xuaW1wb3J0IGdldEJhc2VQbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldEJhc2VQbGFjZW1lbnQuanNcIjtcbmltcG9ydCBnZXRPcHBvc2l0ZVZhcmlhdGlvblBsYWNlbWVudCBmcm9tIFwiLi4vdXRpbHMvZ2V0T3Bwb3NpdGVWYXJpYXRpb25QbGFjZW1lbnQuanNcIjtcbmltcG9ydCBkZXRlY3RPdmVyZmxvdyBmcm9tIFwiLi4vdXRpbHMvZGV0ZWN0T3ZlcmZsb3cuanNcIjtcbmltcG9ydCBjb21wdXRlQXV0b1BsYWNlbWVudCBmcm9tIFwiLi4vdXRpbHMvY29tcHV0ZUF1dG9QbGFjZW1lbnQuanNcIjtcbmltcG9ydCB7IGJvdHRvbSwgdG9wLCBzdGFydCwgcmlnaHQsIGxlZnQsIGF1dG8gfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmltcG9ydCBnZXRWYXJpYXRpb24gZnJvbSBcIi4uL3V0aWxzL2dldFZhcmlhdGlvbi5qc1wiOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbmZ1bmN0aW9uIGdldEV4cGFuZGVkRmFsbGJhY2tQbGFjZW1lbnRzKHBsYWNlbWVudCkge1xuICBpZiAoZ2V0QmFzZVBsYWNlbWVudChwbGFjZW1lbnQpID09PSBhdXRvKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgdmFyIG9wcG9zaXRlUGxhY2VtZW50ID0gZ2V0T3Bwb3NpdGVQbGFjZW1lbnQocGxhY2VtZW50KTtcbiAgcmV0dXJuIFtnZXRPcHBvc2l0ZVZhcmlhdGlvblBsYWNlbWVudChwbGFjZW1lbnQpLCBvcHBvc2l0ZVBsYWNlbWVudCwgZ2V0T3Bwb3NpdGVWYXJpYXRpb25QbGFjZW1lbnQob3Bwb3NpdGVQbGFjZW1lbnQpXTtcbn1cblxuZnVuY3Rpb24gZmxpcChfcmVmKSB7XG4gIHZhciBzdGF0ZSA9IF9yZWYuc3RhdGUsXG4gICAgICBvcHRpb25zID0gX3JlZi5vcHRpb25zLFxuICAgICAgbmFtZSA9IF9yZWYubmFtZTtcblxuICBpZiAoc3RhdGUubW9kaWZpZXJzRGF0YVtuYW1lXS5fc2tpcCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBfb3B0aW9ucyRtYWluQXhpcyA9IG9wdGlvbnMubWFpbkF4aXMsXG4gICAgICBjaGVja01haW5BeGlzID0gX29wdGlvbnMkbWFpbkF4aXMgPT09IHZvaWQgMCA/IHRydWUgOiBfb3B0aW9ucyRtYWluQXhpcyxcbiAgICAgIF9vcHRpb25zJGFsdEF4aXMgPSBvcHRpb25zLmFsdEF4aXMsXG4gICAgICBjaGVja0FsdEF4aXMgPSBfb3B0aW9ucyRhbHRBeGlzID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkYWx0QXhpcyxcbiAgICAgIHNwZWNpZmllZEZhbGxiYWNrUGxhY2VtZW50cyA9IG9wdGlvbnMuZmFsbGJhY2tQbGFjZW1lbnRzLFxuICAgICAgcGFkZGluZyA9IG9wdGlvbnMucGFkZGluZyxcbiAgICAgIGJvdW5kYXJ5ID0gb3B0aW9ucy5ib3VuZGFyeSxcbiAgICAgIHJvb3RCb3VuZGFyeSA9IG9wdGlvbnMucm9vdEJvdW5kYXJ5LFxuICAgICAgYWx0Qm91bmRhcnkgPSBvcHRpb25zLmFsdEJvdW5kYXJ5LFxuICAgICAgX29wdGlvbnMkZmxpcFZhcmlhdGlvID0gb3B0aW9ucy5mbGlwVmFyaWF0aW9ucyxcbiAgICAgIGZsaXBWYXJpYXRpb25zID0gX29wdGlvbnMkZmxpcFZhcmlhdGlvID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkZmxpcFZhcmlhdGlvLFxuICAgICAgYWxsb3dlZEF1dG9QbGFjZW1lbnRzID0gb3B0aW9ucy5hbGxvd2VkQXV0b1BsYWNlbWVudHM7XG4gIHZhciBwcmVmZXJyZWRQbGFjZW1lbnQgPSBzdGF0ZS5vcHRpb25zLnBsYWNlbWVudDtcbiAgdmFyIGJhc2VQbGFjZW1lbnQgPSBnZXRCYXNlUGxhY2VtZW50KHByZWZlcnJlZFBsYWNlbWVudCk7XG4gIHZhciBpc0Jhc2VQbGFjZW1lbnQgPSBiYXNlUGxhY2VtZW50ID09PSBwcmVmZXJyZWRQbGFjZW1lbnQ7XG4gIHZhciBmYWxsYmFja1BsYWNlbWVudHMgPSBzcGVjaWZpZWRGYWxsYmFja1BsYWNlbWVudHMgfHwgKGlzQmFzZVBsYWNlbWVudCB8fCAhZmxpcFZhcmlhdGlvbnMgPyBbZ2V0T3Bwb3NpdGVQbGFjZW1lbnQocHJlZmVycmVkUGxhY2VtZW50KV0gOiBnZXRFeHBhbmRlZEZhbGxiYWNrUGxhY2VtZW50cyhwcmVmZXJyZWRQbGFjZW1lbnQpKTtcbiAgdmFyIHBsYWNlbWVudHMgPSBbcHJlZmVycmVkUGxhY2VtZW50XS5jb25jYXQoZmFsbGJhY2tQbGFjZW1lbnRzKS5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgcGxhY2VtZW50KSB7XG4gICAgcmV0dXJuIGFjYy5jb25jYXQoZ2V0QmFzZVBsYWNlbWVudChwbGFjZW1lbnQpID09PSBhdXRvID8gY29tcHV0ZUF1dG9QbGFjZW1lbnQoc3RhdGUsIHtcbiAgICAgIHBsYWNlbWVudDogcGxhY2VtZW50LFxuICAgICAgYm91bmRhcnk6IGJvdW5kYXJ5LFxuICAgICAgcm9vdEJvdW5kYXJ5OiByb290Qm91bmRhcnksXG4gICAgICBwYWRkaW5nOiBwYWRkaW5nLFxuICAgICAgZmxpcFZhcmlhdGlvbnM6IGZsaXBWYXJpYXRpb25zLFxuICAgICAgYWxsb3dlZEF1dG9QbGFjZW1lbnRzOiBhbGxvd2VkQXV0b1BsYWNlbWVudHNcbiAgICB9KSA6IHBsYWNlbWVudCk7XG4gIH0sIFtdKTtcbiAgdmFyIHJlZmVyZW5jZVJlY3QgPSBzdGF0ZS5yZWN0cy5yZWZlcmVuY2U7XG4gIHZhciBwb3BwZXJSZWN0ID0gc3RhdGUucmVjdHMucG9wcGVyO1xuICB2YXIgY2hlY2tzTWFwID0gbmV3IE1hcCgpO1xuICB2YXIgbWFrZUZhbGxiYWNrQ2hlY2tzID0gdHJ1ZTtcbiAgdmFyIGZpcnN0Rml0dGluZ1BsYWNlbWVudCA9IHBsYWNlbWVudHNbMF07XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwbGFjZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHBsYWNlbWVudCA9IHBsYWNlbWVudHNbaV07XG5cbiAgICB2YXIgX2Jhc2VQbGFjZW1lbnQgPSBnZXRCYXNlUGxhY2VtZW50KHBsYWNlbWVudCk7XG5cbiAgICB2YXIgaXNTdGFydFZhcmlhdGlvbiA9IGdldFZhcmlhdGlvbihwbGFjZW1lbnQpID09PSBzdGFydDtcbiAgICB2YXIgaXNWZXJ0aWNhbCA9IFt0b3AsIGJvdHRvbV0uaW5kZXhPZihfYmFzZVBsYWNlbWVudCkgPj0gMDtcbiAgICB2YXIgbGVuID0gaXNWZXJ0aWNhbCA/ICd3aWR0aCcgOiAnaGVpZ2h0JztcbiAgICB2YXIgb3ZlcmZsb3cgPSBkZXRlY3RPdmVyZmxvdyhzdGF0ZSwge1xuICAgICAgcGxhY2VtZW50OiBwbGFjZW1lbnQsXG4gICAgICBib3VuZGFyeTogYm91bmRhcnksXG4gICAgICByb290Qm91bmRhcnk6IHJvb3RCb3VuZGFyeSxcbiAgICAgIGFsdEJvdW5kYXJ5OiBhbHRCb3VuZGFyeSxcbiAgICAgIHBhZGRpbmc6IHBhZGRpbmdcbiAgICB9KTtcbiAgICB2YXIgbWFpblZhcmlhdGlvblNpZGUgPSBpc1ZlcnRpY2FsID8gaXNTdGFydFZhcmlhdGlvbiA/IHJpZ2h0IDogbGVmdCA6IGlzU3RhcnRWYXJpYXRpb24gPyBib3R0b20gOiB0b3A7XG5cbiAgICBpZiAocmVmZXJlbmNlUmVjdFtsZW5dID4gcG9wcGVyUmVjdFtsZW5dKSB7XG4gICAgICBtYWluVmFyaWF0aW9uU2lkZSA9IGdldE9wcG9zaXRlUGxhY2VtZW50KG1haW5WYXJpYXRpb25TaWRlKTtcbiAgICB9XG5cbiAgICB2YXIgYWx0VmFyaWF0aW9uU2lkZSA9IGdldE9wcG9zaXRlUGxhY2VtZW50KG1haW5WYXJpYXRpb25TaWRlKTtcbiAgICB2YXIgY2hlY2tzID0gW107XG5cbiAgICBpZiAoY2hlY2tNYWluQXhpcykge1xuICAgICAgY2hlY2tzLnB1c2gob3ZlcmZsb3dbX2Jhc2VQbGFjZW1lbnRdIDw9IDApO1xuICAgIH1cblxuICAgIGlmIChjaGVja0FsdEF4aXMpIHtcbiAgICAgIGNoZWNrcy5wdXNoKG92ZXJmbG93W21haW5WYXJpYXRpb25TaWRlXSA8PSAwLCBvdmVyZmxvd1thbHRWYXJpYXRpb25TaWRlXSA8PSAwKTtcbiAgICB9XG5cbiAgICBpZiAoY2hlY2tzLmV2ZXJ5KGZ1bmN0aW9uIChjaGVjaykge1xuICAgICAgcmV0dXJuIGNoZWNrO1xuICAgIH0pKSB7XG4gICAgICBmaXJzdEZpdHRpbmdQbGFjZW1lbnQgPSBwbGFjZW1lbnQ7XG4gICAgICBtYWtlRmFsbGJhY2tDaGVja3MgPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGNoZWNrc01hcC5zZXQocGxhY2VtZW50LCBjaGVja3MpO1xuICB9XG5cbiAgaWYgKG1ha2VGYWxsYmFja0NoZWNrcykge1xuICAgIC8vIGAyYCBtYXkgYmUgZGVzaXJlZCBpbiBzb21lIGNhc2VzIOKAkyByZXNlYXJjaCBsYXRlclxuICAgIHZhciBudW1iZXJPZkNoZWNrcyA9IGZsaXBWYXJpYXRpb25zID8gMyA6IDE7XG5cbiAgICB2YXIgX2xvb3AgPSBmdW5jdGlvbiBfbG9vcChfaSkge1xuICAgICAgdmFyIGZpdHRpbmdQbGFjZW1lbnQgPSBwbGFjZW1lbnRzLmZpbmQoZnVuY3Rpb24gKHBsYWNlbWVudCkge1xuICAgICAgICB2YXIgY2hlY2tzID0gY2hlY2tzTWFwLmdldChwbGFjZW1lbnQpO1xuXG4gICAgICAgIGlmIChjaGVja3MpIHtcbiAgICAgICAgICByZXR1cm4gY2hlY2tzLnNsaWNlKDAsIF9pKS5ldmVyeShmdW5jdGlvbiAoY2hlY2spIHtcbiAgICAgICAgICAgIHJldHVybiBjaGVjaztcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmIChmaXR0aW5nUGxhY2VtZW50KSB7XG4gICAgICAgIGZpcnN0Rml0dGluZ1BsYWNlbWVudCA9IGZpdHRpbmdQbGFjZW1lbnQ7XG4gICAgICAgIHJldHVybiBcImJyZWFrXCI7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGZvciAodmFyIF9pID0gbnVtYmVyT2ZDaGVja3M7IF9pID4gMDsgX2ktLSkge1xuICAgICAgdmFyIF9yZXQgPSBfbG9vcChfaSk7XG5cbiAgICAgIGlmIChfcmV0ID09PSBcImJyZWFrXCIpIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmIChzdGF0ZS5wbGFjZW1lbnQgIT09IGZpcnN0Rml0dGluZ1BsYWNlbWVudCkge1xuICAgIHN0YXRlLm1vZGlmaWVyc0RhdGFbbmFtZV0uX3NraXAgPSB0cnVlO1xuICAgIHN0YXRlLnBsYWNlbWVudCA9IGZpcnN0Rml0dGluZ1BsYWNlbWVudDtcbiAgICBzdGF0ZS5yZXNldCA9IHRydWU7XG4gIH1cbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ2ZsaXAnLFxuICBlbmFibGVkOiB0cnVlLFxuICBwaGFzZTogJ21haW4nLFxuICBmbjogZmxpcCxcbiAgcmVxdWlyZXNJZkV4aXN0czogWydvZmZzZXQnXSxcbiAgZGF0YToge1xuICAgIF9za2lwOiBmYWxzZVxuICB9XG59OyIsImltcG9ydCB7IHRvcCwgYm90dG9tLCBsZWZ0LCByaWdodCB9IGZyb20gXCIuLi9lbnVtcy5qc1wiO1xuaW1wb3J0IGRldGVjdE92ZXJmbG93IGZyb20gXCIuLi91dGlscy9kZXRlY3RPdmVyZmxvdy5qc1wiO1xuXG5mdW5jdGlvbiBnZXRTaWRlT2Zmc2V0cyhvdmVyZmxvdywgcmVjdCwgcHJldmVudGVkT2Zmc2V0cykge1xuICBpZiAocHJldmVudGVkT2Zmc2V0cyA9PT0gdm9pZCAwKSB7XG4gICAgcHJldmVudGVkT2Zmc2V0cyA9IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdG9wOiBvdmVyZmxvdy50b3AgLSByZWN0LmhlaWdodCAtIHByZXZlbnRlZE9mZnNldHMueSxcbiAgICByaWdodDogb3ZlcmZsb3cucmlnaHQgLSByZWN0LndpZHRoICsgcHJldmVudGVkT2Zmc2V0cy54LFxuICAgIGJvdHRvbTogb3ZlcmZsb3cuYm90dG9tIC0gcmVjdC5oZWlnaHQgKyBwcmV2ZW50ZWRPZmZzZXRzLnksXG4gICAgbGVmdDogb3ZlcmZsb3cubGVmdCAtIHJlY3Qud2lkdGggLSBwcmV2ZW50ZWRPZmZzZXRzLnhcbiAgfTtcbn1cblxuZnVuY3Rpb24gaXNBbnlTaWRlRnVsbHlDbGlwcGVkKG92ZXJmbG93KSB7XG4gIHJldHVybiBbdG9wLCByaWdodCwgYm90dG9tLCBsZWZ0XS5zb21lKGZ1bmN0aW9uIChzaWRlKSB7XG4gICAgcmV0dXJuIG92ZXJmbG93W3NpZGVdID49IDA7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBoaWRlKF9yZWYpIHtcbiAgdmFyIHN0YXRlID0gX3JlZi5zdGF0ZSxcbiAgICAgIG5hbWUgPSBfcmVmLm5hbWU7XG4gIHZhciByZWZlcmVuY2VSZWN0ID0gc3RhdGUucmVjdHMucmVmZXJlbmNlO1xuICB2YXIgcG9wcGVyUmVjdCA9IHN0YXRlLnJlY3RzLnBvcHBlcjtcbiAgdmFyIHByZXZlbnRlZE9mZnNldHMgPSBzdGF0ZS5tb2RpZmllcnNEYXRhLnByZXZlbnRPdmVyZmxvdztcbiAgdmFyIHJlZmVyZW5jZU92ZXJmbG93ID0gZGV0ZWN0T3ZlcmZsb3coc3RhdGUsIHtcbiAgICBlbGVtZW50Q29udGV4dDogJ3JlZmVyZW5jZSdcbiAgfSk7XG4gIHZhciBwb3BwZXJBbHRPdmVyZmxvdyA9IGRldGVjdE92ZXJmbG93KHN0YXRlLCB7XG4gICAgYWx0Qm91bmRhcnk6IHRydWVcbiAgfSk7XG4gIHZhciByZWZlcmVuY2VDbGlwcGluZ09mZnNldHMgPSBnZXRTaWRlT2Zmc2V0cyhyZWZlcmVuY2VPdmVyZmxvdywgcmVmZXJlbmNlUmVjdCk7XG4gIHZhciBwb3BwZXJFc2NhcGVPZmZzZXRzID0gZ2V0U2lkZU9mZnNldHMocG9wcGVyQWx0T3ZlcmZsb3csIHBvcHBlclJlY3QsIHByZXZlbnRlZE9mZnNldHMpO1xuICB2YXIgaXNSZWZlcmVuY2VIaWRkZW4gPSBpc0FueVNpZGVGdWxseUNsaXBwZWQocmVmZXJlbmNlQ2xpcHBpbmdPZmZzZXRzKTtcbiAgdmFyIGhhc1BvcHBlckVzY2FwZWQgPSBpc0FueVNpZGVGdWxseUNsaXBwZWQocG9wcGVyRXNjYXBlT2Zmc2V0cyk7XG4gIHN0YXRlLm1vZGlmaWVyc0RhdGFbbmFtZV0gPSB7XG4gICAgcmVmZXJlbmNlQ2xpcHBpbmdPZmZzZXRzOiByZWZlcmVuY2VDbGlwcGluZ09mZnNldHMsXG4gICAgcG9wcGVyRXNjYXBlT2Zmc2V0czogcG9wcGVyRXNjYXBlT2Zmc2V0cyxcbiAgICBpc1JlZmVyZW5jZUhpZGRlbjogaXNSZWZlcmVuY2VIaWRkZW4sXG4gICAgaGFzUG9wcGVyRXNjYXBlZDogaGFzUG9wcGVyRXNjYXBlZFxuICB9O1xuICBzdGF0ZS5hdHRyaWJ1dGVzLnBvcHBlciA9IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmF0dHJpYnV0ZXMucG9wcGVyLCB7XG4gICAgJ2RhdGEtcG9wcGVyLXJlZmVyZW5jZS1oaWRkZW4nOiBpc1JlZmVyZW5jZUhpZGRlbixcbiAgICAnZGF0YS1wb3BwZXItZXNjYXBlZCc6IGhhc1BvcHBlckVzY2FwZWRcbiAgfSk7XG59IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdoaWRlJyxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgcGhhc2U6ICdtYWluJyxcbiAgcmVxdWlyZXNJZkV4aXN0czogWydwcmV2ZW50T3ZlcmZsb3cnXSxcbiAgZm46IGhpZGVcbn07IiwiaW1wb3J0IGdldEJhc2VQbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldEJhc2VQbGFjZW1lbnQuanNcIjtcbmltcG9ydCB7IHRvcCwgbGVmdCwgcmlnaHQsIHBsYWNlbWVudHMgfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmV4cG9ydCBmdW5jdGlvbiBkaXN0YW5jZUFuZFNraWRkaW5nVG9YWShwbGFjZW1lbnQsIHJlY3RzLCBvZmZzZXQpIHtcbiAgdmFyIGJhc2VQbGFjZW1lbnQgPSBnZXRCYXNlUGxhY2VtZW50KHBsYWNlbWVudCk7XG4gIHZhciBpbnZlcnREaXN0YW5jZSA9IFtsZWZ0LCB0b3BdLmluZGV4T2YoYmFzZVBsYWNlbWVudCkgPj0gMCA/IC0xIDogMTtcblxuICB2YXIgX3JlZiA9IHR5cGVvZiBvZmZzZXQgPT09ICdmdW5jdGlvbicgPyBvZmZzZXQoT2JqZWN0LmFzc2lnbih7fSwgcmVjdHMsIHtcbiAgICBwbGFjZW1lbnQ6IHBsYWNlbWVudFxuICB9KSkgOiBvZmZzZXQsXG4gICAgICBza2lkZGluZyA9IF9yZWZbMF0sXG4gICAgICBkaXN0YW5jZSA9IF9yZWZbMV07XG5cbiAgc2tpZGRpbmcgPSBza2lkZGluZyB8fCAwO1xuICBkaXN0YW5jZSA9IChkaXN0YW5jZSB8fCAwKSAqIGludmVydERpc3RhbmNlO1xuICByZXR1cm4gW2xlZnQsIHJpZ2h0XS5pbmRleE9mKGJhc2VQbGFjZW1lbnQpID49IDAgPyB7XG4gICAgeDogZGlzdGFuY2UsXG4gICAgeTogc2tpZGRpbmdcbiAgfSA6IHtcbiAgICB4OiBza2lkZGluZyxcbiAgICB5OiBkaXN0YW5jZVxuICB9O1xufVxuXG5mdW5jdGlvbiBvZmZzZXQoX3JlZjIpIHtcbiAgdmFyIHN0YXRlID0gX3JlZjIuc3RhdGUsXG4gICAgICBvcHRpb25zID0gX3JlZjIub3B0aW9ucyxcbiAgICAgIG5hbWUgPSBfcmVmMi5uYW1lO1xuICB2YXIgX29wdGlvbnMkb2Zmc2V0ID0gb3B0aW9ucy5vZmZzZXQsXG4gICAgICBvZmZzZXQgPSBfb3B0aW9ucyRvZmZzZXQgPT09IHZvaWQgMCA/IFswLCAwXSA6IF9vcHRpb25zJG9mZnNldDtcbiAgdmFyIGRhdGEgPSBwbGFjZW1lbnRzLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBwbGFjZW1lbnQpIHtcbiAgICBhY2NbcGxhY2VtZW50XSA9IGRpc3RhbmNlQW5kU2tpZGRpbmdUb1hZKHBsYWNlbWVudCwgc3RhdGUucmVjdHMsIG9mZnNldCk7XG4gICAgcmV0dXJuIGFjYztcbiAgfSwge30pO1xuICB2YXIgX2RhdGEkc3RhdGUkcGxhY2VtZW50ID0gZGF0YVtzdGF0ZS5wbGFjZW1lbnRdLFxuICAgICAgeCA9IF9kYXRhJHN0YXRlJHBsYWNlbWVudC54LFxuICAgICAgeSA9IF9kYXRhJHN0YXRlJHBsYWNlbWVudC55O1xuXG4gIGlmIChzdGF0ZS5tb2RpZmllcnNEYXRhLnBvcHBlck9mZnNldHMgIT0gbnVsbCkge1xuICAgIHN0YXRlLm1vZGlmaWVyc0RhdGEucG9wcGVyT2Zmc2V0cy54ICs9IHg7XG4gICAgc3RhdGUubW9kaWZpZXJzRGF0YS5wb3BwZXJPZmZzZXRzLnkgKz0geTtcbiAgfVxuXG4gIHN0YXRlLm1vZGlmaWVyc0RhdGFbbmFtZV0gPSBkYXRhO1xufSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnb2Zmc2V0JyxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgcGhhc2U6ICdtYWluJyxcbiAgcmVxdWlyZXM6IFsncG9wcGVyT2Zmc2V0cyddLFxuICBmbjogb2Zmc2V0XG59OyIsImltcG9ydCBjb21wdXRlT2Zmc2V0cyBmcm9tIFwiLi4vdXRpbHMvY29tcHV0ZU9mZnNldHMuanNcIjtcblxuZnVuY3Rpb24gcG9wcGVyT2Zmc2V0cyhfcmVmKSB7XG4gIHZhciBzdGF0ZSA9IF9yZWYuc3RhdGUsXG4gICAgICBuYW1lID0gX3JlZi5uYW1lO1xuICAvLyBPZmZzZXRzIGFyZSB0aGUgYWN0dWFsIHBvc2l0aW9uIHRoZSBwb3BwZXIgbmVlZHMgdG8gaGF2ZSB0byBiZVxuICAvLyBwcm9wZXJseSBwb3NpdGlvbmVkIG5lYXIgaXRzIHJlZmVyZW5jZSBlbGVtZW50XG4gIC8vIFRoaXMgaXMgdGhlIG1vc3QgYmFzaWMgcGxhY2VtZW50LCBhbmQgd2lsbCBiZSBhZGp1c3RlZCBieVxuICAvLyB0aGUgbW9kaWZpZXJzIGluIHRoZSBuZXh0IHN0ZXBcbiAgc3RhdGUubW9kaWZpZXJzRGF0YVtuYW1lXSA9IGNvbXB1dGVPZmZzZXRzKHtcbiAgICByZWZlcmVuY2U6IHN0YXRlLnJlY3RzLnJlZmVyZW5jZSxcbiAgICBlbGVtZW50OiBzdGF0ZS5yZWN0cy5wb3BwZXIsXG4gICAgc3RyYXRlZ3k6ICdhYnNvbHV0ZScsXG4gICAgcGxhY2VtZW50OiBzdGF0ZS5wbGFjZW1lbnRcbiAgfSk7XG59IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdwb3BwZXJPZmZzZXRzJyxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgcGhhc2U6ICdyZWFkJyxcbiAgZm46IHBvcHBlck9mZnNldHMsXG4gIGRhdGE6IHt9XG59OyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldEFsdEF4aXMoYXhpcykge1xuICByZXR1cm4gYXhpcyA9PT0gJ3gnID8gJ3knIDogJ3gnO1xufSIsImltcG9ydCB7IHRvcCwgbGVmdCwgcmlnaHQsIGJvdHRvbSwgc3RhcnQgfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmltcG9ydCBnZXRCYXNlUGxhY2VtZW50IGZyb20gXCIuLi91dGlscy9nZXRCYXNlUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgZ2V0TWFpbkF4aXNGcm9tUGxhY2VtZW50IGZyb20gXCIuLi91dGlscy9nZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQuanNcIjtcbmltcG9ydCBnZXRBbHRBeGlzIGZyb20gXCIuLi91dGlscy9nZXRBbHRBeGlzLmpzXCI7XG5pbXBvcnQgd2l0aGluIGZyb20gXCIuLi91dGlscy93aXRoaW4uanNcIjtcbmltcG9ydCBnZXRMYXlvdXRSZWN0IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0TGF5b3V0UmVjdC5qc1wiO1xuaW1wb3J0IGdldE9mZnNldFBhcmVudCBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldE9mZnNldFBhcmVudC5qc1wiO1xuaW1wb3J0IGRldGVjdE92ZXJmbG93IGZyb20gXCIuLi91dGlscy9kZXRlY3RPdmVyZmxvdy5qc1wiO1xuaW1wb3J0IGdldFZhcmlhdGlvbiBmcm9tIFwiLi4vdXRpbHMvZ2V0VmFyaWF0aW9uLmpzXCI7XG5pbXBvcnQgZ2V0RnJlc2hTaWRlT2JqZWN0IGZyb20gXCIuLi91dGlscy9nZXRGcmVzaFNpZGVPYmplY3QuanNcIjtcbmltcG9ydCB7IG1heCBhcyBtYXRoTWF4LCBtaW4gYXMgbWF0aE1pbiB9IGZyb20gXCIuLi91dGlscy9tYXRoLmpzXCI7XG5cbmZ1bmN0aW9uIHByZXZlbnRPdmVyZmxvdyhfcmVmKSB7XG4gIHZhciBzdGF0ZSA9IF9yZWYuc3RhdGUsXG4gICAgICBvcHRpb25zID0gX3JlZi5vcHRpb25zLFxuICAgICAgbmFtZSA9IF9yZWYubmFtZTtcbiAgdmFyIF9vcHRpb25zJG1haW5BeGlzID0gb3B0aW9ucy5tYWluQXhpcyxcbiAgICAgIGNoZWNrTWFpbkF4aXMgPSBfb3B0aW9ucyRtYWluQXhpcyA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJG1haW5BeGlzLFxuICAgICAgX29wdGlvbnMkYWx0QXhpcyA9IG9wdGlvbnMuYWx0QXhpcyxcbiAgICAgIGNoZWNrQWx0QXhpcyA9IF9vcHRpb25zJGFsdEF4aXMgPT09IHZvaWQgMCA/IGZhbHNlIDogX29wdGlvbnMkYWx0QXhpcyxcbiAgICAgIGJvdW5kYXJ5ID0gb3B0aW9ucy5ib3VuZGFyeSxcbiAgICAgIHJvb3RCb3VuZGFyeSA9IG9wdGlvbnMucm9vdEJvdW5kYXJ5LFxuICAgICAgYWx0Qm91bmRhcnkgPSBvcHRpb25zLmFsdEJvdW5kYXJ5LFxuICAgICAgcGFkZGluZyA9IG9wdGlvbnMucGFkZGluZyxcbiAgICAgIF9vcHRpb25zJHRldGhlciA9IG9wdGlvbnMudGV0aGVyLFxuICAgICAgdGV0aGVyID0gX29wdGlvbnMkdGV0aGVyID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkdGV0aGVyLFxuICAgICAgX29wdGlvbnMkdGV0aGVyT2Zmc2V0ID0gb3B0aW9ucy50ZXRoZXJPZmZzZXQsXG4gICAgICB0ZXRoZXJPZmZzZXQgPSBfb3B0aW9ucyR0ZXRoZXJPZmZzZXQgPT09IHZvaWQgMCA/IDAgOiBfb3B0aW9ucyR0ZXRoZXJPZmZzZXQ7XG4gIHZhciBvdmVyZmxvdyA9IGRldGVjdE92ZXJmbG93KHN0YXRlLCB7XG4gICAgYm91bmRhcnk6IGJvdW5kYXJ5LFxuICAgIHJvb3RCb3VuZGFyeTogcm9vdEJvdW5kYXJ5LFxuICAgIHBhZGRpbmc6IHBhZGRpbmcsXG4gICAgYWx0Qm91bmRhcnk6IGFsdEJvdW5kYXJ5XG4gIH0pO1xuICB2YXIgYmFzZVBsYWNlbWVudCA9IGdldEJhc2VQbGFjZW1lbnQoc3RhdGUucGxhY2VtZW50KTtcbiAgdmFyIHZhcmlhdGlvbiA9IGdldFZhcmlhdGlvbihzdGF0ZS5wbGFjZW1lbnQpO1xuICB2YXIgaXNCYXNlUGxhY2VtZW50ID0gIXZhcmlhdGlvbjtcbiAgdmFyIG1haW5BeGlzID0gZ2V0TWFpbkF4aXNGcm9tUGxhY2VtZW50KGJhc2VQbGFjZW1lbnQpO1xuICB2YXIgYWx0QXhpcyA9IGdldEFsdEF4aXMobWFpbkF4aXMpO1xuICB2YXIgcG9wcGVyT2Zmc2V0cyA9IHN0YXRlLm1vZGlmaWVyc0RhdGEucG9wcGVyT2Zmc2V0cztcbiAgdmFyIHJlZmVyZW5jZVJlY3QgPSBzdGF0ZS5yZWN0cy5yZWZlcmVuY2U7XG4gIHZhciBwb3BwZXJSZWN0ID0gc3RhdGUucmVjdHMucG9wcGVyO1xuICB2YXIgdGV0aGVyT2Zmc2V0VmFsdWUgPSB0eXBlb2YgdGV0aGVyT2Zmc2V0ID09PSAnZnVuY3Rpb24nID8gdGV0aGVyT2Zmc2V0KE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLnJlY3RzLCB7XG4gICAgcGxhY2VtZW50OiBzdGF0ZS5wbGFjZW1lbnRcbiAgfSkpIDogdGV0aGVyT2Zmc2V0O1xuICB2YXIgZGF0YSA9IHtcbiAgICB4OiAwLFxuICAgIHk6IDBcbiAgfTtcblxuICBpZiAoIXBvcHBlck9mZnNldHMpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoY2hlY2tNYWluQXhpcyB8fCBjaGVja0FsdEF4aXMpIHtcbiAgICB2YXIgbWFpblNpZGUgPSBtYWluQXhpcyA9PT0gJ3knID8gdG9wIDogbGVmdDtcbiAgICB2YXIgYWx0U2lkZSA9IG1haW5BeGlzID09PSAneScgPyBib3R0b20gOiByaWdodDtcbiAgICB2YXIgbGVuID0gbWFpbkF4aXMgPT09ICd5JyA/ICdoZWlnaHQnIDogJ3dpZHRoJztcbiAgICB2YXIgb2Zmc2V0ID0gcG9wcGVyT2Zmc2V0c1ttYWluQXhpc107XG4gICAgdmFyIG1pbiA9IHBvcHBlck9mZnNldHNbbWFpbkF4aXNdICsgb3ZlcmZsb3dbbWFpblNpZGVdO1xuICAgIHZhciBtYXggPSBwb3BwZXJPZmZzZXRzW21haW5BeGlzXSAtIG92ZXJmbG93W2FsdFNpZGVdO1xuICAgIHZhciBhZGRpdGl2ZSA9IHRldGhlciA/IC1wb3BwZXJSZWN0W2xlbl0gLyAyIDogMDtcbiAgICB2YXIgbWluTGVuID0gdmFyaWF0aW9uID09PSBzdGFydCA/IHJlZmVyZW5jZVJlY3RbbGVuXSA6IHBvcHBlclJlY3RbbGVuXTtcbiAgICB2YXIgbWF4TGVuID0gdmFyaWF0aW9uID09PSBzdGFydCA/IC1wb3BwZXJSZWN0W2xlbl0gOiAtcmVmZXJlbmNlUmVjdFtsZW5dOyAvLyBXZSBuZWVkIHRvIGluY2x1ZGUgdGhlIGFycm93IGluIHRoZSBjYWxjdWxhdGlvbiBzbyB0aGUgYXJyb3cgZG9lc24ndCBnb1xuICAgIC8vIG91dHNpZGUgdGhlIHJlZmVyZW5jZSBib3VuZHNcblxuICAgIHZhciBhcnJvd0VsZW1lbnQgPSBzdGF0ZS5lbGVtZW50cy5hcnJvdztcbiAgICB2YXIgYXJyb3dSZWN0ID0gdGV0aGVyICYmIGFycm93RWxlbWVudCA/IGdldExheW91dFJlY3QoYXJyb3dFbGVtZW50KSA6IHtcbiAgICAgIHdpZHRoOiAwLFxuICAgICAgaGVpZ2h0OiAwXG4gICAgfTtcbiAgICB2YXIgYXJyb3dQYWRkaW5nT2JqZWN0ID0gc3RhdGUubW9kaWZpZXJzRGF0YVsnYXJyb3cjcGVyc2lzdGVudCddID8gc3RhdGUubW9kaWZpZXJzRGF0YVsnYXJyb3cjcGVyc2lzdGVudCddLnBhZGRpbmcgOiBnZXRGcmVzaFNpZGVPYmplY3QoKTtcbiAgICB2YXIgYXJyb3dQYWRkaW5nTWluID0gYXJyb3dQYWRkaW5nT2JqZWN0W21haW5TaWRlXTtcbiAgICB2YXIgYXJyb3dQYWRkaW5nTWF4ID0gYXJyb3dQYWRkaW5nT2JqZWN0W2FsdFNpZGVdOyAvLyBJZiB0aGUgcmVmZXJlbmNlIGxlbmd0aCBpcyBzbWFsbGVyIHRoYW4gdGhlIGFycm93IGxlbmd0aCwgd2UgZG9uJ3Qgd2FudFxuICAgIC8vIHRvIGluY2x1ZGUgaXRzIGZ1bGwgc2l6ZSBpbiB0aGUgY2FsY3VsYXRpb24uIElmIHRoZSByZWZlcmVuY2UgaXMgc21hbGxcbiAgICAvLyBhbmQgbmVhciB0aGUgZWRnZSBvZiBhIGJvdW5kYXJ5LCB0aGUgcG9wcGVyIGNhbiBvdmVyZmxvdyBldmVuIGlmIHRoZVxuICAgIC8vIHJlZmVyZW5jZSBpcyBub3Qgb3ZlcmZsb3dpbmcgYXMgd2VsbCAoZS5nLiB2aXJ0dWFsIGVsZW1lbnRzIHdpdGggbm9cbiAgICAvLyB3aWR0aCBvciBoZWlnaHQpXG5cbiAgICB2YXIgYXJyb3dMZW4gPSB3aXRoaW4oMCwgcmVmZXJlbmNlUmVjdFtsZW5dLCBhcnJvd1JlY3RbbGVuXSk7XG4gICAgdmFyIG1pbk9mZnNldCA9IGlzQmFzZVBsYWNlbWVudCA/IHJlZmVyZW5jZVJlY3RbbGVuXSAvIDIgLSBhZGRpdGl2ZSAtIGFycm93TGVuIC0gYXJyb3dQYWRkaW5nTWluIC0gdGV0aGVyT2Zmc2V0VmFsdWUgOiBtaW5MZW4gLSBhcnJvd0xlbiAtIGFycm93UGFkZGluZ01pbiAtIHRldGhlck9mZnNldFZhbHVlO1xuICAgIHZhciBtYXhPZmZzZXQgPSBpc0Jhc2VQbGFjZW1lbnQgPyAtcmVmZXJlbmNlUmVjdFtsZW5dIC8gMiArIGFkZGl0aXZlICsgYXJyb3dMZW4gKyBhcnJvd1BhZGRpbmdNYXggKyB0ZXRoZXJPZmZzZXRWYWx1ZSA6IG1heExlbiArIGFycm93TGVuICsgYXJyb3dQYWRkaW5nTWF4ICsgdGV0aGVyT2Zmc2V0VmFsdWU7XG4gICAgdmFyIGFycm93T2Zmc2V0UGFyZW50ID0gc3RhdGUuZWxlbWVudHMuYXJyb3cgJiYgZ2V0T2Zmc2V0UGFyZW50KHN0YXRlLmVsZW1lbnRzLmFycm93KTtcbiAgICB2YXIgY2xpZW50T2Zmc2V0ID0gYXJyb3dPZmZzZXRQYXJlbnQgPyBtYWluQXhpcyA9PT0gJ3knID8gYXJyb3dPZmZzZXRQYXJlbnQuY2xpZW50VG9wIHx8IDAgOiBhcnJvd09mZnNldFBhcmVudC5jbGllbnRMZWZ0IHx8IDAgOiAwO1xuICAgIHZhciBvZmZzZXRNb2RpZmllclZhbHVlID0gc3RhdGUubW9kaWZpZXJzRGF0YS5vZmZzZXQgPyBzdGF0ZS5tb2RpZmllcnNEYXRhLm9mZnNldFtzdGF0ZS5wbGFjZW1lbnRdW21haW5BeGlzXSA6IDA7XG4gICAgdmFyIHRldGhlck1pbiA9IHBvcHBlck9mZnNldHNbbWFpbkF4aXNdICsgbWluT2Zmc2V0IC0gb2Zmc2V0TW9kaWZpZXJWYWx1ZSAtIGNsaWVudE9mZnNldDtcbiAgICB2YXIgdGV0aGVyTWF4ID0gcG9wcGVyT2Zmc2V0c1ttYWluQXhpc10gKyBtYXhPZmZzZXQgLSBvZmZzZXRNb2RpZmllclZhbHVlO1xuXG4gICAgaWYgKGNoZWNrTWFpbkF4aXMpIHtcbiAgICAgIHZhciBwcmV2ZW50ZWRPZmZzZXQgPSB3aXRoaW4odGV0aGVyID8gbWF0aE1pbihtaW4sIHRldGhlck1pbikgOiBtaW4sIG9mZnNldCwgdGV0aGVyID8gbWF0aE1heChtYXgsIHRldGhlck1heCkgOiBtYXgpO1xuICAgICAgcG9wcGVyT2Zmc2V0c1ttYWluQXhpc10gPSBwcmV2ZW50ZWRPZmZzZXQ7XG4gICAgICBkYXRhW21haW5BeGlzXSA9IHByZXZlbnRlZE9mZnNldCAtIG9mZnNldDtcbiAgICB9XG5cbiAgICBpZiAoY2hlY2tBbHRBeGlzKSB7XG4gICAgICB2YXIgX21haW5TaWRlID0gbWFpbkF4aXMgPT09ICd4JyA/IHRvcCA6IGxlZnQ7XG5cbiAgICAgIHZhciBfYWx0U2lkZSA9IG1haW5BeGlzID09PSAneCcgPyBib3R0b20gOiByaWdodDtcblxuICAgICAgdmFyIF9vZmZzZXQgPSBwb3BwZXJPZmZzZXRzW2FsdEF4aXNdO1xuXG4gICAgICB2YXIgX21pbiA9IF9vZmZzZXQgKyBvdmVyZmxvd1tfbWFpblNpZGVdO1xuXG4gICAgICB2YXIgX21heCA9IF9vZmZzZXQgLSBvdmVyZmxvd1tfYWx0U2lkZV07XG5cbiAgICAgIHZhciBfcHJldmVudGVkT2Zmc2V0ID0gd2l0aGluKHRldGhlciA/IG1hdGhNaW4oX21pbiwgdGV0aGVyTWluKSA6IF9taW4sIF9vZmZzZXQsIHRldGhlciA/IG1hdGhNYXgoX21heCwgdGV0aGVyTWF4KSA6IF9tYXgpO1xuXG4gICAgICBwb3BwZXJPZmZzZXRzW2FsdEF4aXNdID0gX3ByZXZlbnRlZE9mZnNldDtcbiAgICAgIGRhdGFbYWx0QXhpc10gPSBfcHJldmVudGVkT2Zmc2V0IC0gX29mZnNldDtcbiAgICB9XG4gIH1cblxuICBzdGF0ZS5tb2RpZmllcnNEYXRhW25hbWVdID0gZGF0YTtcbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ3ByZXZlbnRPdmVyZmxvdycsXG4gIGVuYWJsZWQ6IHRydWUsXG4gIHBoYXNlOiAnbWFpbicsXG4gIGZuOiBwcmV2ZW50T3ZlcmZsb3csXG4gIHJlcXVpcmVzSWZFeGlzdHM6IFsnb2Zmc2V0J11cbn07IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0SFRNTEVsZW1lbnRTY3JvbGwoZWxlbWVudCkge1xuICByZXR1cm4ge1xuICAgIHNjcm9sbExlZnQ6IGVsZW1lbnQuc2Nyb2xsTGVmdCxcbiAgICBzY3JvbGxUb3A6IGVsZW1lbnQuc2Nyb2xsVG9wXG4gIH07XG59IiwiaW1wb3J0IGdldFdpbmRvd1Njcm9sbCBmcm9tIFwiLi9nZXRXaW5kb3dTY3JvbGwuanNcIjtcbmltcG9ydCBnZXRXaW5kb3cgZnJvbSBcIi4vZ2V0V2luZG93LmpzXCI7XG5pbXBvcnQgeyBpc0hUTUxFbGVtZW50IH0gZnJvbSBcIi4vaW5zdGFuY2VPZi5qc1wiO1xuaW1wb3J0IGdldEhUTUxFbGVtZW50U2Nyb2xsIGZyb20gXCIuL2dldEhUTUxFbGVtZW50U2Nyb2xsLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXROb2RlU2Nyb2xsKG5vZGUpIHtcbiAgaWYgKG5vZGUgPT09IGdldFdpbmRvdyhub2RlKSB8fCAhaXNIVE1MRWxlbWVudChub2RlKSkge1xuICAgIHJldHVybiBnZXRXaW5kb3dTY3JvbGwobm9kZSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGdldEhUTUxFbGVtZW50U2Nyb2xsKG5vZGUpO1xuICB9XG59IiwiaW1wb3J0IGdldEJvdW5kaW5nQ2xpZW50UmVjdCBmcm9tIFwiLi9nZXRCb3VuZGluZ0NsaWVudFJlY3QuanNcIjtcbmltcG9ydCBnZXROb2RlU2Nyb2xsIGZyb20gXCIuL2dldE5vZGVTY3JvbGwuanNcIjtcbmltcG9ydCBnZXROb2RlTmFtZSBmcm9tIFwiLi9nZXROb2RlTmFtZS5qc1wiO1xuaW1wb3J0IHsgaXNIVE1MRWxlbWVudCB9IGZyb20gXCIuL2luc3RhbmNlT2YuanNcIjtcbmltcG9ydCBnZXRXaW5kb3dTY3JvbGxCYXJYIGZyb20gXCIuL2dldFdpbmRvd1Njcm9sbEJhclguanNcIjtcbmltcG9ydCBnZXREb2N1bWVudEVsZW1lbnQgZnJvbSBcIi4vZ2V0RG9jdW1lbnRFbGVtZW50LmpzXCI7XG5pbXBvcnQgaXNTY3JvbGxQYXJlbnQgZnJvbSBcIi4vaXNTY3JvbGxQYXJlbnQuanNcIjtcblxuZnVuY3Rpb24gaXNFbGVtZW50U2NhbGVkKGVsZW1lbnQpIHtcbiAgdmFyIHJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICB2YXIgc2NhbGVYID0gcmVjdC53aWR0aCAvIGVsZW1lbnQub2Zmc2V0V2lkdGggfHwgMTtcbiAgdmFyIHNjYWxlWSA9IHJlY3QuaGVpZ2h0IC8gZWxlbWVudC5vZmZzZXRIZWlnaHQgfHwgMTtcbiAgcmV0dXJuIHNjYWxlWCAhPT0gMSB8fCBzY2FsZVkgIT09IDE7XG59IC8vIFJldHVybnMgdGhlIGNvbXBvc2l0ZSByZWN0IG9mIGFuIGVsZW1lbnQgcmVsYXRpdmUgdG8gaXRzIG9mZnNldFBhcmVudC5cbi8vIENvbXBvc2l0ZSBtZWFucyBpdCB0YWtlcyBpbnRvIGFjY291bnQgdHJhbnNmb3JtcyBhcyB3ZWxsIGFzIGxheW91dC5cblxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRDb21wb3NpdGVSZWN0KGVsZW1lbnRPclZpcnR1YWxFbGVtZW50LCBvZmZzZXRQYXJlbnQsIGlzRml4ZWQpIHtcbiAgaWYgKGlzRml4ZWQgPT09IHZvaWQgMCkge1xuICAgIGlzRml4ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIHZhciBpc09mZnNldFBhcmVudEFuRWxlbWVudCA9IGlzSFRNTEVsZW1lbnQob2Zmc2V0UGFyZW50KTtcbiAgdmFyIG9mZnNldFBhcmVudElzU2NhbGVkID0gaXNIVE1MRWxlbWVudChvZmZzZXRQYXJlbnQpICYmIGlzRWxlbWVudFNjYWxlZChvZmZzZXRQYXJlbnQpO1xuICB2YXIgZG9jdW1lbnRFbGVtZW50ID0gZ2V0RG9jdW1lbnRFbGVtZW50KG9mZnNldFBhcmVudCk7XG4gIHZhciByZWN0ID0gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KGVsZW1lbnRPclZpcnR1YWxFbGVtZW50LCBvZmZzZXRQYXJlbnRJc1NjYWxlZCk7XG4gIHZhciBzY3JvbGwgPSB7XG4gICAgc2Nyb2xsTGVmdDogMCxcbiAgICBzY3JvbGxUb3A6IDBcbiAgfTtcbiAgdmFyIG9mZnNldHMgPSB7XG4gICAgeDogMCxcbiAgICB5OiAwXG4gIH07XG5cbiAgaWYgKGlzT2Zmc2V0UGFyZW50QW5FbGVtZW50IHx8ICFpc09mZnNldFBhcmVudEFuRWxlbWVudCAmJiAhaXNGaXhlZCkge1xuICAgIGlmIChnZXROb2RlTmFtZShvZmZzZXRQYXJlbnQpICE9PSAnYm9keScgfHwgLy8gaHR0cHM6Ly9naXRodWIuY29tL3BvcHBlcmpzL3BvcHBlci1jb3JlL2lzc3Vlcy8xMDc4XG4gICAgaXNTY3JvbGxQYXJlbnQoZG9jdW1lbnRFbGVtZW50KSkge1xuICAgICAgc2Nyb2xsID0gZ2V0Tm9kZVNjcm9sbChvZmZzZXRQYXJlbnQpO1xuICAgIH1cblxuICAgIGlmIChpc0hUTUxFbGVtZW50KG9mZnNldFBhcmVudCkpIHtcbiAgICAgIG9mZnNldHMgPSBnZXRCb3VuZGluZ0NsaWVudFJlY3Qob2Zmc2V0UGFyZW50LCB0cnVlKTtcbiAgICAgIG9mZnNldHMueCArPSBvZmZzZXRQYXJlbnQuY2xpZW50TGVmdDtcbiAgICAgIG9mZnNldHMueSArPSBvZmZzZXRQYXJlbnQuY2xpZW50VG9wO1xuICAgIH0gZWxzZSBpZiAoZG9jdW1lbnRFbGVtZW50KSB7XG4gICAgICBvZmZzZXRzLnggPSBnZXRXaW5kb3dTY3JvbGxCYXJYKGRvY3VtZW50RWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB4OiByZWN0LmxlZnQgKyBzY3JvbGwuc2Nyb2xsTGVmdCAtIG9mZnNldHMueCxcbiAgICB5OiByZWN0LnRvcCArIHNjcm9sbC5zY3JvbGxUb3AgLSBvZmZzZXRzLnksXG4gICAgd2lkdGg6IHJlY3Qud2lkdGgsXG4gICAgaGVpZ2h0OiByZWN0LmhlaWdodFxuICB9O1xufSIsImltcG9ydCB7IG1vZGlmaWVyUGhhc2VzIH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7IC8vIHNvdXJjZTogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDk4NzUyNTVcblxuZnVuY3Rpb24gb3JkZXIobW9kaWZpZXJzKSB7XG4gIHZhciBtYXAgPSBuZXcgTWFwKCk7XG4gIHZhciB2aXNpdGVkID0gbmV3IFNldCgpO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIG1vZGlmaWVycy5mb3JFYWNoKGZ1bmN0aW9uIChtb2RpZmllcikge1xuICAgIG1hcC5zZXQobW9kaWZpZXIubmFtZSwgbW9kaWZpZXIpO1xuICB9KTsgLy8gT24gdmlzaXRpbmcgb2JqZWN0LCBjaGVjayBmb3IgaXRzIGRlcGVuZGVuY2llcyBhbmQgdmlzaXQgdGhlbSByZWN1cnNpdmVseVxuXG4gIGZ1bmN0aW9uIHNvcnQobW9kaWZpZXIpIHtcbiAgICB2aXNpdGVkLmFkZChtb2RpZmllci5uYW1lKTtcbiAgICB2YXIgcmVxdWlyZXMgPSBbXS5jb25jYXQobW9kaWZpZXIucmVxdWlyZXMgfHwgW10sIG1vZGlmaWVyLnJlcXVpcmVzSWZFeGlzdHMgfHwgW10pO1xuICAgIHJlcXVpcmVzLmZvckVhY2goZnVuY3Rpb24gKGRlcCkge1xuICAgICAgaWYgKCF2aXNpdGVkLmhhcyhkZXApKSB7XG4gICAgICAgIHZhciBkZXBNb2RpZmllciA9IG1hcC5nZXQoZGVwKTtcblxuICAgICAgICBpZiAoZGVwTW9kaWZpZXIpIHtcbiAgICAgICAgICBzb3J0KGRlcE1vZGlmaWVyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJlc3VsdC5wdXNoKG1vZGlmaWVyKTtcbiAgfVxuXG4gIG1vZGlmaWVycy5mb3JFYWNoKGZ1bmN0aW9uIChtb2RpZmllcikge1xuICAgIGlmICghdmlzaXRlZC5oYXMobW9kaWZpZXIubmFtZSkpIHtcbiAgICAgIC8vIGNoZWNrIGZvciB2aXNpdGVkIG9iamVjdFxuICAgICAgc29ydChtb2RpZmllcik7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gb3JkZXJNb2RpZmllcnMobW9kaWZpZXJzKSB7XG4gIC8vIG9yZGVyIGJhc2VkIG9uIGRlcGVuZGVuY2llc1xuICB2YXIgb3JkZXJlZE1vZGlmaWVycyA9IG9yZGVyKG1vZGlmaWVycyk7IC8vIG9yZGVyIGJhc2VkIG9uIHBoYXNlXG5cbiAgcmV0dXJuIG1vZGlmaWVyUGhhc2VzLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBwaGFzZSkge1xuICAgIHJldHVybiBhY2MuY29uY2F0KG9yZGVyZWRNb2RpZmllcnMuZmlsdGVyKGZ1bmN0aW9uIChtb2RpZmllcikge1xuICAgICAgcmV0dXJuIG1vZGlmaWVyLnBoYXNlID09PSBwaGFzZTtcbiAgICB9KSk7XG4gIH0sIFtdKTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkZWJvdW5jZShmbikge1xuICB2YXIgcGVuZGluZztcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXBlbmRpbmcpIHtcbiAgICAgIHBlbmRpbmcgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBwZW5kaW5nID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHJlc29sdmUoZm4oKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBlbmRpbmc7XG4gIH07XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZm9ybWF0KHN0cikge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgYXJnc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICByZXR1cm4gW10uY29uY2F0KGFyZ3MpLnJlZHVjZShmdW5jdGlvbiAocCwgYykge1xuICAgIHJldHVybiBwLnJlcGxhY2UoLyVzLywgYyk7XG4gIH0sIHN0cik7XG59IiwiaW1wb3J0IGZvcm1hdCBmcm9tIFwiLi9mb3JtYXQuanNcIjtcbmltcG9ydCB7IG1vZGlmaWVyUGhhc2VzIH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7XG52YXIgSU5WQUxJRF9NT0RJRklFUl9FUlJPUiA9ICdQb3BwZXI6IG1vZGlmaWVyIFwiJXNcIiBwcm92aWRlZCBhbiBpbnZhbGlkICVzIHByb3BlcnR5LCBleHBlY3RlZCAlcyBidXQgZ290ICVzJztcbnZhciBNSVNTSU5HX0RFUEVOREVOQ1lfRVJST1IgPSAnUG9wcGVyOiBtb2RpZmllciBcIiVzXCIgcmVxdWlyZXMgXCIlc1wiLCBidXQgXCIlc1wiIG1vZGlmaWVyIGlzIG5vdCBhdmFpbGFibGUnO1xudmFyIFZBTElEX1BST1BFUlRJRVMgPSBbJ25hbWUnLCAnZW5hYmxlZCcsICdwaGFzZScsICdmbicsICdlZmZlY3QnLCAncmVxdWlyZXMnLCAnb3B0aW9ucyddO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdmFsaWRhdGVNb2RpZmllcnMobW9kaWZpZXJzKSB7XG4gIG1vZGlmaWVycy5mb3JFYWNoKGZ1bmN0aW9uIChtb2RpZmllcikge1xuICAgIFtdLmNvbmNhdChPYmplY3Qua2V5cyhtb2RpZmllciksIFZBTElEX1BST1BFUlRJRVMpIC8vIElFMTEtY29tcGF0aWJsZSByZXBsYWNlbWVudCBmb3IgYG5ldyBTZXQoaXRlcmFibGUpYFxuICAgIC5maWx0ZXIoZnVuY3Rpb24gKHZhbHVlLCBpbmRleCwgc2VsZikge1xuICAgICAgcmV0dXJuIHNlbGYuaW5kZXhPZih2YWx1ZSkgPT09IGluZGV4O1xuICAgIH0pLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgY2FzZSAnbmFtZSc6XG4gICAgICAgICAgaWYgKHR5cGVvZiBtb2RpZmllci5uYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihmb3JtYXQoSU5WQUxJRF9NT0RJRklFUl9FUlJPUiwgU3RyaW5nKG1vZGlmaWVyLm5hbWUpLCAnXCJuYW1lXCInLCAnXCJzdHJpbmdcIicsIFwiXFxcIlwiICsgU3RyaW5nKG1vZGlmaWVyLm5hbWUpICsgXCJcXFwiXCIpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdlbmFibGVkJzpcbiAgICAgICAgICBpZiAodHlwZW9mIG1vZGlmaWVyLmVuYWJsZWQgIT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihmb3JtYXQoSU5WQUxJRF9NT0RJRklFUl9FUlJPUiwgbW9kaWZpZXIubmFtZSwgJ1wiZW5hYmxlZFwiJywgJ1wiYm9vbGVhblwiJywgXCJcXFwiXCIgKyBTdHJpbmcobW9kaWZpZXIuZW5hYmxlZCkgKyBcIlxcXCJcIikpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ3BoYXNlJzpcbiAgICAgICAgICBpZiAobW9kaWZpZXJQaGFzZXMuaW5kZXhPZihtb2RpZmllci5waGFzZSkgPCAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGZvcm1hdChJTlZBTElEX01PRElGSUVSX0VSUk9SLCBtb2RpZmllci5uYW1lLCAnXCJwaGFzZVwiJywgXCJlaXRoZXIgXCIgKyBtb2RpZmllclBoYXNlcy5qb2luKCcsICcpLCBcIlxcXCJcIiArIFN0cmluZyhtb2RpZmllci5waGFzZSkgKyBcIlxcXCJcIikpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ2ZuJzpcbiAgICAgICAgICBpZiAodHlwZW9mIG1vZGlmaWVyLmZuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGZvcm1hdChJTlZBTElEX01PRElGSUVSX0VSUk9SLCBtb2RpZmllci5uYW1lLCAnXCJmblwiJywgJ1wiZnVuY3Rpb25cIicsIFwiXFxcIlwiICsgU3RyaW5nKG1vZGlmaWVyLmZuKSArIFwiXFxcIlwiKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnZWZmZWN0JzpcbiAgICAgICAgICBpZiAobW9kaWZpZXIuZWZmZWN0ICE9IG51bGwgJiYgdHlwZW9mIG1vZGlmaWVyLmVmZmVjdCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihmb3JtYXQoSU5WQUxJRF9NT0RJRklFUl9FUlJPUiwgbW9kaWZpZXIubmFtZSwgJ1wiZWZmZWN0XCInLCAnXCJmdW5jdGlvblwiJywgXCJcXFwiXCIgKyBTdHJpbmcobW9kaWZpZXIuZm4pICsgXCJcXFwiXCIpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdyZXF1aXJlcyc6XG4gICAgICAgICAgaWYgKG1vZGlmaWVyLnJlcXVpcmVzICE9IG51bGwgJiYgIUFycmF5LmlzQXJyYXkobW9kaWZpZXIucmVxdWlyZXMpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGZvcm1hdChJTlZBTElEX01PRElGSUVSX0VSUk9SLCBtb2RpZmllci5uYW1lLCAnXCJyZXF1aXJlc1wiJywgJ1wiYXJyYXlcIicsIFwiXFxcIlwiICsgU3RyaW5nKG1vZGlmaWVyLnJlcXVpcmVzKSArIFwiXFxcIlwiKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAncmVxdWlyZXNJZkV4aXN0cyc6XG4gICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KG1vZGlmaWVyLnJlcXVpcmVzSWZFeGlzdHMpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGZvcm1hdChJTlZBTElEX01PRElGSUVSX0VSUk9SLCBtb2RpZmllci5uYW1lLCAnXCJyZXF1aXJlc0lmRXhpc3RzXCInLCAnXCJhcnJheVwiJywgXCJcXFwiXCIgKyBTdHJpbmcobW9kaWZpZXIucmVxdWlyZXNJZkV4aXN0cykgKyBcIlxcXCJcIikpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ29wdGlvbnMnOlxuICAgICAgICBjYXNlICdkYXRhJzpcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJQb3BwZXJKUzogYW4gaW52YWxpZCBwcm9wZXJ0eSBoYXMgYmVlbiBwcm92aWRlZCB0byB0aGUgXFxcIlwiICsgbW9kaWZpZXIubmFtZSArIFwiXFxcIiBtb2RpZmllciwgdmFsaWQgcHJvcGVydGllcyBhcmUgXCIgKyBWQUxJRF9QUk9QRVJUSUVTLm1hcChmdW5jdGlvbiAocykge1xuICAgICAgICAgICAgcmV0dXJuIFwiXFxcIlwiICsgcyArIFwiXFxcIlwiO1xuICAgICAgICAgIH0pLmpvaW4oJywgJykgKyBcIjsgYnV0IFxcXCJcIiArIGtleSArIFwiXFxcIiB3YXMgcHJvdmlkZWQuXCIpO1xuICAgICAgfVxuXG4gICAgICBtb2RpZmllci5yZXF1aXJlcyAmJiBtb2RpZmllci5yZXF1aXJlcy5mb3JFYWNoKGZ1bmN0aW9uIChyZXF1aXJlbWVudCkge1xuICAgICAgICBpZiAobW9kaWZpZXJzLmZpbmQoZnVuY3Rpb24gKG1vZCkge1xuICAgICAgICAgIHJldHVybiBtb2QubmFtZSA9PT0gcmVxdWlyZW1lbnQ7XG4gICAgICAgIH0pID09IG51bGwpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGZvcm1hdChNSVNTSU5HX0RFUEVOREVOQ1lfRVJST1IsIFN0cmluZyhtb2RpZmllci5uYW1lKSwgcmVxdWlyZW1lbnQsIHJlcXVpcmVtZW50KSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1bmlxdWVCeShhcnIsIGZuKSB7XG4gIHZhciBpZGVudGlmaWVycyA9IG5ldyBTZXQoKTtcbiAgcmV0dXJuIGFyci5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICB2YXIgaWRlbnRpZmllciA9IGZuKGl0ZW0pO1xuXG4gICAgaWYgKCFpZGVudGlmaWVycy5oYXMoaWRlbnRpZmllcikpIHtcbiAgICAgIGlkZW50aWZpZXJzLmFkZChpZGVudGlmaWVyKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSk7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWVyZ2VCeU5hbWUobW9kaWZpZXJzKSB7XG4gIHZhciBtZXJnZWQgPSBtb2RpZmllcnMucmVkdWNlKGZ1bmN0aW9uIChtZXJnZWQsIGN1cnJlbnQpIHtcbiAgICB2YXIgZXhpc3RpbmcgPSBtZXJnZWRbY3VycmVudC5uYW1lXTtcbiAgICBtZXJnZWRbY3VycmVudC5uYW1lXSA9IGV4aXN0aW5nID8gT2JqZWN0LmFzc2lnbih7fSwgZXhpc3RpbmcsIGN1cnJlbnQsIHtcbiAgICAgIG9wdGlvbnM6IE9iamVjdC5hc3NpZ24oe30sIGV4aXN0aW5nLm9wdGlvbnMsIGN1cnJlbnQub3B0aW9ucyksXG4gICAgICBkYXRhOiBPYmplY3QuYXNzaWduKHt9LCBleGlzdGluZy5kYXRhLCBjdXJyZW50LmRhdGEpXG4gICAgfSkgOiBjdXJyZW50O1xuICAgIHJldHVybiBtZXJnZWQ7XG4gIH0sIHt9KTsgLy8gSUUxMSBkb2VzIG5vdCBzdXBwb3J0IE9iamVjdC52YWx1ZXNcblxuICByZXR1cm4gT2JqZWN0LmtleXMobWVyZ2VkKS5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBtZXJnZWRba2V5XTtcbiAgfSk7XG59IiwiaW1wb3J0IGdldENvbXBvc2l0ZVJlY3QgZnJvbSBcIi4vZG9tLXV0aWxzL2dldENvbXBvc2l0ZVJlY3QuanNcIjtcbmltcG9ydCBnZXRMYXlvdXRSZWN0IGZyb20gXCIuL2RvbS11dGlscy9nZXRMYXlvdXRSZWN0LmpzXCI7XG5pbXBvcnQgbGlzdFNjcm9sbFBhcmVudHMgZnJvbSBcIi4vZG9tLXV0aWxzL2xpc3RTY3JvbGxQYXJlbnRzLmpzXCI7XG5pbXBvcnQgZ2V0T2Zmc2V0UGFyZW50IGZyb20gXCIuL2RvbS11dGlscy9nZXRPZmZzZXRQYXJlbnQuanNcIjtcbmltcG9ydCBnZXRDb21wdXRlZFN0eWxlIGZyb20gXCIuL2RvbS11dGlscy9nZXRDb21wdXRlZFN0eWxlLmpzXCI7XG5pbXBvcnQgb3JkZXJNb2RpZmllcnMgZnJvbSBcIi4vdXRpbHMvb3JkZXJNb2RpZmllcnMuanNcIjtcbmltcG9ydCBkZWJvdW5jZSBmcm9tIFwiLi91dGlscy9kZWJvdW5jZS5qc1wiO1xuaW1wb3J0IHZhbGlkYXRlTW9kaWZpZXJzIGZyb20gXCIuL3V0aWxzL3ZhbGlkYXRlTW9kaWZpZXJzLmpzXCI7XG5pbXBvcnQgdW5pcXVlQnkgZnJvbSBcIi4vdXRpbHMvdW5pcXVlQnkuanNcIjtcbmltcG9ydCBnZXRCYXNlUGxhY2VtZW50IGZyb20gXCIuL3V0aWxzL2dldEJhc2VQbGFjZW1lbnQuanNcIjtcbmltcG9ydCBtZXJnZUJ5TmFtZSBmcm9tIFwiLi91dGlscy9tZXJnZUJ5TmFtZS5qc1wiO1xuaW1wb3J0IGRldGVjdE92ZXJmbG93IGZyb20gXCIuL3V0aWxzL2RldGVjdE92ZXJmbG93LmpzXCI7XG5pbXBvcnQgeyBpc0VsZW1lbnQgfSBmcm9tIFwiLi9kb20tdXRpbHMvaW5zdGFuY2VPZi5qc1wiO1xuaW1wb3J0IHsgYXV0byB9IGZyb20gXCIuL2VudW1zLmpzXCI7XG52YXIgSU5WQUxJRF9FTEVNRU5UX0VSUk9SID0gJ1BvcHBlcjogSW52YWxpZCByZWZlcmVuY2Ugb3IgcG9wcGVyIGFyZ3VtZW50IHByb3ZpZGVkLiBUaGV5IG11c3QgYmUgZWl0aGVyIGEgRE9NIGVsZW1lbnQgb3IgdmlydHVhbCBlbGVtZW50Lic7XG52YXIgSU5GSU5JVEVfTE9PUF9FUlJPUiA9ICdQb3BwZXI6IEFuIGluZmluaXRlIGxvb3AgaW4gdGhlIG1vZGlmaWVycyBjeWNsZSBoYXMgYmVlbiBkZXRlY3RlZCEgVGhlIGN5Y2xlIGhhcyBiZWVuIGludGVycnVwdGVkIHRvIHByZXZlbnQgYSBicm93c2VyIGNyYXNoLic7XG52YXIgREVGQVVMVF9PUFRJT05TID0ge1xuICBwbGFjZW1lbnQ6ICdib3R0b20nLFxuICBtb2RpZmllcnM6IFtdLFxuICBzdHJhdGVneTogJ2Fic29sdXRlJ1xufTtcblxuZnVuY3Rpb24gYXJlVmFsaWRFbGVtZW50cygpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHJldHVybiAhYXJncy5zb21lKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgcmV0dXJuICEoZWxlbWVudCAmJiB0eXBlb2YgZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QgPT09ICdmdW5jdGlvbicpO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBvcHBlckdlbmVyYXRvcihnZW5lcmF0b3JPcHRpb25zKSB7XG4gIGlmIChnZW5lcmF0b3JPcHRpb25zID09PSB2b2lkIDApIHtcbiAgICBnZW5lcmF0b3JPcHRpb25zID0ge307XG4gIH1cblxuICB2YXIgX2dlbmVyYXRvck9wdGlvbnMgPSBnZW5lcmF0b3JPcHRpb25zLFxuICAgICAgX2dlbmVyYXRvck9wdGlvbnMkZGVmID0gX2dlbmVyYXRvck9wdGlvbnMuZGVmYXVsdE1vZGlmaWVycyxcbiAgICAgIGRlZmF1bHRNb2RpZmllcnMgPSBfZ2VuZXJhdG9yT3B0aW9ucyRkZWYgPT09IHZvaWQgMCA/IFtdIDogX2dlbmVyYXRvck9wdGlvbnMkZGVmLFxuICAgICAgX2dlbmVyYXRvck9wdGlvbnMkZGVmMiA9IF9nZW5lcmF0b3JPcHRpb25zLmRlZmF1bHRPcHRpb25zLFxuICAgICAgZGVmYXVsdE9wdGlvbnMgPSBfZ2VuZXJhdG9yT3B0aW9ucyRkZWYyID09PSB2b2lkIDAgPyBERUZBVUxUX09QVElPTlMgOiBfZ2VuZXJhdG9yT3B0aW9ucyRkZWYyO1xuICByZXR1cm4gZnVuY3Rpb24gY3JlYXRlUG9wcGVyKHJlZmVyZW5jZSwgcG9wcGVyLCBvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgICAgb3B0aW9ucyA9IGRlZmF1bHRPcHRpb25zO1xuICAgIH1cblxuICAgIHZhciBzdGF0ZSA9IHtcbiAgICAgIHBsYWNlbWVudDogJ2JvdHRvbScsXG4gICAgICBvcmRlcmVkTW9kaWZpZXJzOiBbXSxcbiAgICAgIG9wdGlvbnM6IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfT1BUSU9OUywgZGVmYXVsdE9wdGlvbnMpLFxuICAgICAgbW9kaWZpZXJzRGF0YToge30sXG4gICAgICBlbGVtZW50czoge1xuICAgICAgICByZWZlcmVuY2U6IHJlZmVyZW5jZSxcbiAgICAgICAgcG9wcGVyOiBwb3BwZXJcbiAgICAgIH0sXG4gICAgICBhdHRyaWJ1dGVzOiB7fSxcbiAgICAgIHN0eWxlczoge31cbiAgICB9O1xuICAgIHZhciBlZmZlY3RDbGVhbnVwRm5zID0gW107XG4gICAgdmFyIGlzRGVzdHJveWVkID0gZmFsc2U7XG4gICAgdmFyIGluc3RhbmNlID0ge1xuICAgICAgc3RhdGU6IHN0YXRlLFxuICAgICAgc2V0T3B0aW9uczogZnVuY3Rpb24gc2V0T3B0aW9ucyhzZXRPcHRpb25zQWN0aW9uKSB7XG4gICAgICAgIHZhciBvcHRpb25zID0gdHlwZW9mIHNldE9wdGlvbnNBY3Rpb24gPT09ICdmdW5jdGlvbicgPyBzZXRPcHRpb25zQWN0aW9uKHN0YXRlLm9wdGlvbnMpIDogc2V0T3B0aW9uc0FjdGlvbjtcbiAgICAgICAgY2xlYW51cE1vZGlmaWVyRWZmZWN0cygpO1xuICAgICAgICBzdGF0ZS5vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdE9wdGlvbnMsIHN0YXRlLm9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgICBzdGF0ZS5zY3JvbGxQYXJlbnRzID0ge1xuICAgICAgICAgIHJlZmVyZW5jZTogaXNFbGVtZW50KHJlZmVyZW5jZSkgPyBsaXN0U2Nyb2xsUGFyZW50cyhyZWZlcmVuY2UpIDogcmVmZXJlbmNlLmNvbnRleHRFbGVtZW50ID8gbGlzdFNjcm9sbFBhcmVudHMocmVmZXJlbmNlLmNvbnRleHRFbGVtZW50KSA6IFtdLFxuICAgICAgICAgIHBvcHBlcjogbGlzdFNjcm9sbFBhcmVudHMocG9wcGVyKVxuICAgICAgICB9OyAvLyBPcmRlcnMgdGhlIG1vZGlmaWVycyBiYXNlZCBvbiB0aGVpciBkZXBlbmRlbmNpZXMgYW5kIGBwaGFzZWBcbiAgICAgICAgLy8gcHJvcGVydGllc1xuXG4gICAgICAgIHZhciBvcmRlcmVkTW9kaWZpZXJzID0gb3JkZXJNb2RpZmllcnMobWVyZ2VCeU5hbWUoW10uY29uY2F0KGRlZmF1bHRNb2RpZmllcnMsIHN0YXRlLm9wdGlvbnMubW9kaWZpZXJzKSkpOyAvLyBTdHJpcCBvdXQgZGlzYWJsZWQgbW9kaWZpZXJzXG5cbiAgICAgICAgc3RhdGUub3JkZXJlZE1vZGlmaWVycyA9IG9yZGVyZWRNb2RpZmllcnMuZmlsdGVyKGZ1bmN0aW9uIChtKSB7XG4gICAgICAgICAgcmV0dXJuIG0uZW5hYmxlZDtcbiAgICAgICAgfSk7IC8vIFZhbGlkYXRlIHRoZSBwcm92aWRlZCBtb2RpZmllcnMgc28gdGhhdCB0aGUgY29uc3VtZXIgd2lsbCBnZXQgd2FybmVkXG4gICAgICAgIC8vIGlmIG9uZSBvZiB0aGUgbW9kaWZpZXJzIGlzIGludmFsaWQgZm9yIGFueSByZWFzb25cblxuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICAgICAgdmFyIG1vZGlmaWVycyA9IHVuaXF1ZUJ5KFtdLmNvbmNhdChvcmRlcmVkTW9kaWZpZXJzLCBzdGF0ZS5vcHRpb25zLm1vZGlmaWVycyksIGZ1bmN0aW9uIChfcmVmKSB7XG4gICAgICAgICAgICB2YXIgbmFtZSA9IF9yZWYubmFtZTtcbiAgICAgICAgICAgIHJldHVybiBuYW1lO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHZhbGlkYXRlTW9kaWZpZXJzKG1vZGlmaWVycyk7XG5cbiAgICAgICAgICBpZiAoZ2V0QmFzZVBsYWNlbWVudChzdGF0ZS5vcHRpb25zLnBsYWNlbWVudCkgPT09IGF1dG8pIHtcbiAgICAgICAgICAgIHZhciBmbGlwTW9kaWZpZXIgPSBzdGF0ZS5vcmRlcmVkTW9kaWZpZXJzLmZpbmQoZnVuY3Rpb24gKF9yZWYyKSB7XG4gICAgICAgICAgICAgIHZhciBuYW1lID0gX3JlZjIubmFtZTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5hbWUgPT09ICdmbGlwJztcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoIWZsaXBNb2RpZmllcikge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFsnUG9wcGVyOiBcImF1dG9cIiBwbGFjZW1lbnRzIHJlcXVpcmUgdGhlIFwiZmxpcFwiIG1vZGlmaWVyIGJlJywgJ3ByZXNlbnQgYW5kIGVuYWJsZWQgdG8gd29yay4nXS5qb2luKCcgJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBfZ2V0Q29tcHV0ZWRTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUocG9wcGVyKSxcbiAgICAgICAgICAgICAgbWFyZ2luVG9wID0gX2dldENvbXB1dGVkU3R5bGUubWFyZ2luVG9wLFxuICAgICAgICAgICAgICBtYXJnaW5SaWdodCA9IF9nZXRDb21wdXRlZFN0eWxlLm1hcmdpblJpZ2h0LFxuICAgICAgICAgICAgICBtYXJnaW5Cb3R0b20gPSBfZ2V0Q29tcHV0ZWRTdHlsZS5tYXJnaW5Cb3R0b20sXG4gICAgICAgICAgICAgIG1hcmdpbkxlZnQgPSBfZ2V0Q29tcHV0ZWRTdHlsZS5tYXJnaW5MZWZ0OyAvLyBXZSBubyBsb25nZXIgdGFrZSBpbnRvIGFjY291bnQgYG1hcmdpbnNgIG9uIHRoZSBwb3BwZXIsIGFuZCBpdCBjYW5cbiAgICAgICAgICAvLyBjYXVzZSBidWdzIHdpdGggcG9zaXRpb25pbmcsIHNvIHdlJ2xsIHdhcm4gdGhlIGNvbnN1bWVyXG5cblxuICAgICAgICAgIGlmIChbbWFyZ2luVG9wLCBtYXJnaW5SaWdodCwgbWFyZ2luQm90dG9tLCBtYXJnaW5MZWZ0XS5zb21lKGZ1bmN0aW9uIChtYXJnaW4pIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KG1hcmdpbik7XG4gICAgICAgICAgfSkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihbJ1BvcHBlcjogQ1NTIFwibWFyZ2luXCIgc3R5bGVzIGNhbm5vdCBiZSB1c2VkIHRvIGFwcGx5IHBhZGRpbmcnLCAnYmV0d2VlbiB0aGUgcG9wcGVyIGFuZCBpdHMgcmVmZXJlbmNlIGVsZW1lbnQgb3IgYm91bmRhcnkuJywgJ1RvIHJlcGxpY2F0ZSBtYXJnaW4sIHVzZSB0aGUgYG9mZnNldGAgbW9kaWZpZXIsIGFzIHdlbGwgYXMnLCAndGhlIGBwYWRkaW5nYCBvcHRpb24gaW4gdGhlIGBwcmV2ZW50T3ZlcmZsb3dgIGFuZCBgZmxpcGAnLCAnbW9kaWZpZXJzLiddLmpvaW4oJyAnKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcnVuTW9kaWZpZXJFZmZlY3RzKCk7XG4gICAgICAgIHJldHVybiBpbnN0YW5jZS51cGRhdGUoKTtcbiAgICAgIH0sXG4gICAgICAvLyBTeW5jIHVwZGF0ZSDigJMgaXQgd2lsbCBhbHdheXMgYmUgZXhlY3V0ZWQsIGV2ZW4gaWYgbm90IG5lY2Vzc2FyeS4gVGhpc1xuICAgICAgLy8gaXMgdXNlZnVsIGZvciBsb3cgZnJlcXVlbmN5IHVwZGF0ZXMgd2hlcmUgc3luYyBiZWhhdmlvciBzaW1wbGlmaWVzIHRoZVxuICAgICAgLy8gbG9naWMuXG4gICAgICAvLyBGb3IgaGlnaCBmcmVxdWVuY3kgdXBkYXRlcyAoZS5nLiBgcmVzaXplYCBhbmQgYHNjcm9sbGAgZXZlbnRzKSwgYWx3YXlzXG4gICAgICAvLyBwcmVmZXIgdGhlIGFzeW5jIFBvcHBlciN1cGRhdGUgbWV0aG9kXG4gICAgICBmb3JjZVVwZGF0ZTogZnVuY3Rpb24gZm9yY2VVcGRhdGUoKSB7XG4gICAgICAgIGlmIChpc0Rlc3Ryb3llZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBfc3RhdGUkZWxlbWVudHMgPSBzdGF0ZS5lbGVtZW50cyxcbiAgICAgICAgICAgIHJlZmVyZW5jZSA9IF9zdGF0ZSRlbGVtZW50cy5yZWZlcmVuY2UsXG4gICAgICAgICAgICBwb3BwZXIgPSBfc3RhdGUkZWxlbWVudHMucG9wcGVyOyAvLyBEb24ndCBwcm9jZWVkIGlmIGByZWZlcmVuY2VgIG9yIGBwb3BwZXJgIGFyZSBub3QgdmFsaWQgZWxlbWVudHNcbiAgICAgICAgLy8gYW55bW9yZVxuXG4gICAgICAgIGlmICghYXJlVmFsaWRFbGVtZW50cyhyZWZlcmVuY2UsIHBvcHBlcikpIHtcbiAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKElOVkFMSURfRUxFTUVOVF9FUlJPUik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IC8vIFN0b3JlIHRoZSByZWZlcmVuY2UgYW5kIHBvcHBlciByZWN0cyB0byBiZSByZWFkIGJ5IG1vZGlmaWVyc1xuXG5cbiAgICAgICAgc3RhdGUucmVjdHMgPSB7XG4gICAgICAgICAgcmVmZXJlbmNlOiBnZXRDb21wb3NpdGVSZWN0KHJlZmVyZW5jZSwgZ2V0T2Zmc2V0UGFyZW50KHBvcHBlciksIHN0YXRlLm9wdGlvbnMuc3RyYXRlZ3kgPT09ICdmaXhlZCcpLFxuICAgICAgICAgIHBvcHBlcjogZ2V0TGF5b3V0UmVjdChwb3BwZXIpXG4gICAgICAgIH07IC8vIE1vZGlmaWVycyBoYXZlIHRoZSBhYmlsaXR5IHRvIHJlc2V0IHRoZSBjdXJyZW50IHVwZGF0ZSBjeWNsZS4gVGhlXG4gICAgICAgIC8vIG1vc3QgY29tbW9uIHVzZSBjYXNlIGZvciB0aGlzIGlzIHRoZSBgZmxpcGAgbW9kaWZpZXIgY2hhbmdpbmcgdGhlXG4gICAgICAgIC8vIHBsYWNlbWVudCwgd2hpY2ggdGhlbiBuZWVkcyB0byByZS1ydW4gYWxsIHRoZSBtb2RpZmllcnMsIGJlY2F1c2UgdGhlXG4gICAgICAgIC8vIGxvZ2ljIHdhcyBwcmV2aW91c2x5IHJhbiBmb3IgdGhlIHByZXZpb3VzIHBsYWNlbWVudCBhbmQgaXMgdGhlcmVmb3JlXG4gICAgICAgIC8vIHN0YWxlL2luY29ycmVjdFxuXG4gICAgICAgIHN0YXRlLnJlc2V0ID0gZmFsc2U7XG4gICAgICAgIHN0YXRlLnBsYWNlbWVudCA9IHN0YXRlLm9wdGlvbnMucGxhY2VtZW50OyAvLyBPbiBlYWNoIHVwZGF0ZSBjeWNsZSwgdGhlIGBtb2RpZmllcnNEYXRhYCBwcm9wZXJ0eSBmb3IgZWFjaCBtb2RpZmllclxuICAgICAgICAvLyBpcyBmaWxsZWQgd2l0aCB0aGUgaW5pdGlhbCBkYXRhIHNwZWNpZmllZCBieSB0aGUgbW9kaWZpZXIuIFRoaXMgbWVhbnNcbiAgICAgICAgLy8gaXQgZG9lc24ndCBwZXJzaXN0IGFuZCBpcyBmcmVzaCBvbiBlYWNoIHVwZGF0ZS5cbiAgICAgICAgLy8gVG8gZW5zdXJlIHBlcnNpc3RlbnQgZGF0YSwgdXNlIGAke25hbWV9I3BlcnNpc3RlbnRgXG5cbiAgICAgICAgc3RhdGUub3JkZXJlZE1vZGlmaWVycy5mb3JFYWNoKGZ1bmN0aW9uIChtb2RpZmllcikge1xuICAgICAgICAgIHJldHVybiBzdGF0ZS5tb2RpZmllcnNEYXRhW21vZGlmaWVyLm5hbWVdID0gT2JqZWN0LmFzc2lnbih7fSwgbW9kaWZpZXIuZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgX19kZWJ1Z19sb29wc19fID0gMDtcblxuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgc3RhdGUub3JkZXJlZE1vZGlmaWVycy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICAgICAgICBfX2RlYnVnX2xvb3BzX18gKz0gMTtcblxuICAgICAgICAgICAgaWYgKF9fZGVidWdfbG9vcHNfXyA+IDEwMCkge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKElORklOSVRFX0xPT1BfRVJST1IpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc3RhdGUucmVzZXQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHN0YXRlLnJlc2V0ID0gZmFsc2U7XG4gICAgICAgICAgICBpbmRleCA9IC0xO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIF9zdGF0ZSRvcmRlcmVkTW9kaWZpZSA9IHN0YXRlLm9yZGVyZWRNb2RpZmllcnNbaW5kZXhdLFxuICAgICAgICAgICAgICBmbiA9IF9zdGF0ZSRvcmRlcmVkTW9kaWZpZS5mbixcbiAgICAgICAgICAgICAgX3N0YXRlJG9yZGVyZWRNb2RpZmllMiA9IF9zdGF0ZSRvcmRlcmVkTW9kaWZpZS5vcHRpb25zLFxuICAgICAgICAgICAgICBfb3B0aW9ucyA9IF9zdGF0ZSRvcmRlcmVkTW9kaWZpZTIgPT09IHZvaWQgMCA/IHt9IDogX3N0YXRlJG9yZGVyZWRNb2RpZmllMixcbiAgICAgICAgICAgICAgbmFtZSA9IF9zdGF0ZSRvcmRlcmVkTW9kaWZpZS5uYW1lO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgc3RhdGUgPSBmbih7XG4gICAgICAgICAgICAgIHN0YXRlOiBzdGF0ZSxcbiAgICAgICAgICAgICAgb3B0aW9uczogX29wdGlvbnMsXG4gICAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICAgIGluc3RhbmNlOiBpbnN0YW5jZVxuICAgICAgICAgICAgfSkgfHwgc3RhdGU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgLy8gQXN5bmMgYW5kIG9wdGltaXN0aWNhbGx5IG9wdGltaXplZCB1cGRhdGUg4oCTIGl0IHdpbGwgbm90IGJlIGV4ZWN1dGVkIGlmXG4gICAgICAvLyBub3QgbmVjZXNzYXJ5IChkZWJvdW5jZWQgdG8gcnVuIGF0IG1vc3Qgb25jZS1wZXItdGljaylcbiAgICAgIHVwZGF0ZTogZGVib3VuY2UoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgICAgICBpbnN0YW5jZS5mb3JjZVVwZGF0ZSgpO1xuICAgICAgICAgIHJlc29sdmUoc3RhdGUpO1xuICAgICAgICB9KTtcbiAgICAgIH0pLFxuICAgICAgZGVzdHJveTogZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgICAgY2xlYW51cE1vZGlmaWVyRWZmZWN0cygpO1xuICAgICAgICBpc0Rlc3Ryb3llZCA9IHRydWU7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmICghYXJlVmFsaWRFbGVtZW50cyhyZWZlcmVuY2UsIHBvcHBlcikpIHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihJTlZBTElEX0VMRU1FTlRfRVJST1IpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgaW5zdGFuY2Uuc2V0T3B0aW9ucyhvcHRpb25zKS50aGVuKGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgaWYgKCFpc0Rlc3Ryb3llZCAmJiBvcHRpb25zLm9uRmlyc3RVcGRhdGUpIHtcbiAgICAgICAgb3B0aW9ucy5vbkZpcnN0VXBkYXRlKHN0YXRlKTtcbiAgICAgIH1cbiAgICB9KTsgLy8gTW9kaWZpZXJzIGhhdmUgdGhlIGFiaWxpdHkgdG8gZXhlY3V0ZSBhcmJpdHJhcnkgY29kZSBiZWZvcmUgdGhlIGZpcnN0XG4gICAgLy8gdXBkYXRlIGN5Y2xlIHJ1bnMuIFRoZXkgd2lsbCBiZSBleGVjdXRlZCBpbiB0aGUgc2FtZSBvcmRlciBhcyB0aGUgdXBkYXRlXG4gICAgLy8gY3ljbGUuIFRoaXMgaXMgdXNlZnVsIHdoZW4gYSBtb2RpZmllciBhZGRzIHNvbWUgcGVyc2lzdGVudCBkYXRhIHRoYXRcbiAgICAvLyBvdGhlciBtb2RpZmllcnMgbmVlZCB0byB1c2UsIGJ1dCB0aGUgbW9kaWZpZXIgaXMgcnVuIGFmdGVyIHRoZSBkZXBlbmRlbnRcbiAgICAvLyBvbmUuXG5cbiAgICBmdW5jdGlvbiBydW5Nb2RpZmllckVmZmVjdHMoKSB7XG4gICAgICBzdGF0ZS5vcmRlcmVkTW9kaWZpZXJzLmZvckVhY2goZnVuY3Rpb24gKF9yZWYzKSB7XG4gICAgICAgIHZhciBuYW1lID0gX3JlZjMubmFtZSxcbiAgICAgICAgICAgIF9yZWYzJG9wdGlvbnMgPSBfcmVmMy5vcHRpb25zLFxuICAgICAgICAgICAgb3B0aW9ucyA9IF9yZWYzJG9wdGlvbnMgPT09IHZvaWQgMCA/IHt9IDogX3JlZjMkb3B0aW9ucyxcbiAgICAgICAgICAgIGVmZmVjdCA9IF9yZWYzLmVmZmVjdDtcblxuICAgICAgICBpZiAodHlwZW9mIGVmZmVjdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHZhciBjbGVhbnVwRm4gPSBlZmZlY3Qoe1xuICAgICAgICAgICAgc3RhdGU6IHN0YXRlLFxuICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgIGluc3RhbmNlOiBpbnN0YW5jZSxcbiAgICAgICAgICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHZhciBub29wRm4gPSBmdW5jdGlvbiBub29wRm4oKSB7fTtcblxuICAgICAgICAgIGVmZmVjdENsZWFudXBGbnMucHVzaChjbGVhbnVwRm4gfHwgbm9vcEZuKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYW51cE1vZGlmaWVyRWZmZWN0cygpIHtcbiAgICAgIGVmZmVjdENsZWFudXBGbnMuZm9yRWFjaChmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgcmV0dXJuIGZuKCk7XG4gICAgICB9KTtcbiAgICAgIGVmZmVjdENsZWFudXBGbnMgPSBbXTtcbiAgICB9XG5cbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH07XG59XG5leHBvcnQgdmFyIGNyZWF0ZVBvcHBlciA9IC8qI19fUFVSRV9fKi9wb3BwZXJHZW5lcmF0b3IoKTsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5leHBvcnQgeyBkZXRlY3RPdmVyZmxvdyB9OyIsImltcG9ydCB7IHBvcHBlckdlbmVyYXRvciwgZGV0ZWN0T3ZlcmZsb3cgfSBmcm9tIFwiLi9jcmVhdGVQb3BwZXIuanNcIjtcbmltcG9ydCBldmVudExpc3RlbmVycyBmcm9tIFwiLi9tb2RpZmllcnMvZXZlbnRMaXN0ZW5lcnMuanNcIjtcbmltcG9ydCBwb3BwZXJPZmZzZXRzIGZyb20gXCIuL21vZGlmaWVycy9wb3BwZXJPZmZzZXRzLmpzXCI7XG5pbXBvcnQgY29tcHV0ZVN0eWxlcyBmcm9tIFwiLi9tb2RpZmllcnMvY29tcHV0ZVN0eWxlcy5qc1wiO1xuaW1wb3J0IGFwcGx5U3R5bGVzIGZyb20gXCIuL21vZGlmaWVycy9hcHBseVN0eWxlcy5qc1wiO1xuaW1wb3J0IG9mZnNldCBmcm9tIFwiLi9tb2RpZmllcnMvb2Zmc2V0LmpzXCI7XG5pbXBvcnQgZmxpcCBmcm9tIFwiLi9tb2RpZmllcnMvZmxpcC5qc1wiO1xuaW1wb3J0IHByZXZlbnRPdmVyZmxvdyBmcm9tIFwiLi9tb2RpZmllcnMvcHJldmVudE92ZXJmbG93LmpzXCI7XG5pbXBvcnQgYXJyb3cgZnJvbSBcIi4vbW9kaWZpZXJzL2Fycm93LmpzXCI7XG5pbXBvcnQgaGlkZSBmcm9tIFwiLi9tb2RpZmllcnMvaGlkZS5qc1wiO1xudmFyIGRlZmF1bHRNb2RpZmllcnMgPSBbZXZlbnRMaXN0ZW5lcnMsIHBvcHBlck9mZnNldHMsIGNvbXB1dGVTdHlsZXMsIGFwcGx5U3R5bGVzLCBvZmZzZXQsIGZsaXAsIHByZXZlbnRPdmVyZmxvdywgYXJyb3csIGhpZGVdO1xudmFyIGNyZWF0ZVBvcHBlciA9IC8qI19fUFVSRV9fKi9wb3BwZXJHZW5lcmF0b3Ioe1xuICBkZWZhdWx0TW9kaWZpZXJzOiBkZWZhdWx0TW9kaWZpZXJzXG59KTsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5leHBvcnQgeyBjcmVhdGVQb3BwZXIsIHBvcHBlckdlbmVyYXRvciwgZGVmYXVsdE1vZGlmaWVycywgZGV0ZWN0T3ZlcmZsb3cgfTsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5leHBvcnQgeyBjcmVhdGVQb3BwZXIgYXMgY3JlYXRlUG9wcGVyTGl0ZSB9IGZyb20gXCIuL3BvcHBlci1saXRlLmpzXCI7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuZXhwb3J0ICogZnJvbSBcIi4vbW9kaWZpZXJzL2luZGV4LmpzXCI7IiwiLy8gQ3JlZGl0cyBnbyB0byBMaWFtJ3MgUGVyaW9kaWMgTm90ZXMgUGx1Z2luOiBodHRwczovL2dpdGh1Yi5jb20vbGlhbWNhaW4vb2JzaWRpYW4tcGVyaW9kaWMtbm90ZXNcblxuaW1wb3J0IHtBcHAsIElTdWdnZXN0T3duZXIsIFNjb3BlfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7Y3JlYXRlUG9wcGVyLCBJbnN0YW5jZSBhcyBQb3BwZXJJbnN0YW5jZX0gZnJvbSBcIkBwb3BwZXJqcy9jb3JlXCI7XG5cbmNvbnN0IHdyYXBBcm91bmQgPSAodmFsdWU6IG51bWJlciwgc2l6ZTogbnVtYmVyKTogbnVtYmVyID0+IHtcbiAgICByZXR1cm4gKCh2YWx1ZSAlIHNpemUpICsgc2l6ZSkgJSBzaXplO1xufTtcblxuY2xhc3MgU3VnZ2VzdDxUPiB7XG4gICAgcHJpdmF0ZSBvd25lcjogSVN1Z2dlc3RPd25lcjxUPjtcbiAgICBwcml2YXRlIHZhbHVlczogVFtdO1xuICAgIHByaXZhdGUgc3VnZ2VzdGlvbnM6IEhUTUxEaXZFbGVtZW50W107XG4gICAgcHJpdmF0ZSBzZWxlY3RlZEl0ZW06IG51bWJlcjtcbiAgICBwcml2YXRlIGNvbnRhaW5lckVsOiBIVE1MRWxlbWVudDtcblxuICAgIGNvbnN0cnVjdG9yKG93bmVyOiBJU3VnZ2VzdE93bmVyPFQ+LCBjb250YWluZXJFbDogSFRNTEVsZW1lbnQsIHNjb3BlOiBTY29wZSkge1xuICAgICAgICB0aGlzLm93bmVyID0gb3duZXI7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRWwgPSBjb250YWluZXJFbDtcblxuICAgICAgICBjb250YWluZXJFbC5vbihcbiAgICAgICAgICAgIFwiY2xpY2tcIixcbiAgICAgICAgICAgIFwiLnN1Z2dlc3Rpb24taXRlbVwiLFxuICAgICAgICAgICAgdGhpcy5vblN1Z2dlc3Rpb25DbGljay5iaW5kKHRoaXMpXG4gICAgICAgICk7XG4gICAgICAgIGNvbnRhaW5lckVsLm9uKFxuICAgICAgICAgICAgXCJtb3VzZW1vdmVcIixcbiAgICAgICAgICAgIFwiLnN1Z2dlc3Rpb24taXRlbVwiLFxuICAgICAgICAgICAgdGhpcy5vblN1Z2dlc3Rpb25Nb3VzZW92ZXIuYmluZCh0aGlzKVxuICAgICAgICApO1xuXG4gICAgICAgIHNjb3BlLnJlZ2lzdGVyKFtdLCBcIkFycm93VXBcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAoIWV2ZW50LmlzQ29tcG9zaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3RlZEl0ZW0odGhpcy5zZWxlY3RlZEl0ZW0gLSAxLCB0cnVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNjb3BlLnJlZ2lzdGVyKFtdLCBcIkFycm93RG93blwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICghZXZlbnQuaXNDb21wb3NpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNlbGVjdGVkSXRlbSh0aGlzLnNlbGVjdGVkSXRlbSArIDEsIHRydWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2NvcGUucmVnaXN0ZXIoW10sIFwiRW50ZXJcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAoIWV2ZW50LmlzQ29tcG9zaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51c2VTZWxlY3RlZEl0ZW0oZXZlbnQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb25TdWdnZXN0aW9uQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQsIGVsOiBIVE1MRGl2RWxlbWVudCk6IHZvaWQge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLnN1Z2dlc3Rpb25zLmluZGV4T2YoZWwpO1xuICAgICAgICB0aGlzLnNldFNlbGVjdGVkSXRlbShpdGVtLCBmYWxzZSk7XG4gICAgICAgIHRoaXMudXNlU2VsZWN0ZWRJdGVtKGV2ZW50KTtcbiAgICB9XG5cbiAgICBvblN1Z2dlc3Rpb25Nb3VzZW92ZXIoX2V2ZW50OiBNb3VzZUV2ZW50LCBlbDogSFRNTERpdkVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuc3VnZ2VzdGlvbnMuaW5kZXhPZihlbCk7XG4gICAgICAgIHRoaXMuc2V0U2VsZWN0ZWRJdGVtKGl0ZW0sIGZhbHNlKTtcbiAgICB9XG5cbiAgICBzZXRTdWdnZXN0aW9ucyh2YWx1ZXM6IFRbXSkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lckVsLmVtcHR5KCk7XG4gICAgICAgIGNvbnN0IHN1Z2dlc3Rpb25FbHM6IEhUTUxEaXZFbGVtZW50W10gPSBbXTtcblxuICAgICAgICB2YWx1ZXMuZm9yRWFjaCgodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHN1Z2dlc3Rpb25FbCA9IHRoaXMuY29udGFpbmVyRWwuY3JlYXRlRGl2KFwic3VnZ2VzdGlvbi1pdGVtXCIpO1xuICAgICAgICAgICAgdGhpcy5vd25lci5yZW5kZXJTdWdnZXN0aW9uKHZhbHVlLCBzdWdnZXN0aW9uRWwpO1xuICAgICAgICAgICAgc3VnZ2VzdGlvbkVscy5wdXNoKHN1Z2dlc3Rpb25FbCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMudmFsdWVzID0gdmFsdWVzO1xuICAgICAgICB0aGlzLnN1Z2dlc3Rpb25zID0gc3VnZ2VzdGlvbkVscztcbiAgICAgICAgdGhpcy5zZXRTZWxlY3RlZEl0ZW0oMCwgZmFsc2UpO1xuICAgIH1cblxuICAgIHVzZVNlbGVjdGVkSXRlbShldmVudDogTW91c2VFdmVudCB8IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgY29uc3QgY3VycmVudFZhbHVlID0gdGhpcy52YWx1ZXNbdGhpcy5zZWxlY3RlZEl0ZW1dO1xuICAgICAgICBpZiAoY3VycmVudFZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLm93bmVyLnNlbGVjdFN1Z2dlc3Rpb24oY3VycmVudFZhbHVlLCBldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRTZWxlY3RlZEl0ZW0oc2VsZWN0ZWRJbmRleDogbnVtYmVyLCBzY3JvbGxJbnRvVmlldzogYm9vbGVhbikge1xuICAgICAgICBjb25zdCBub3JtYWxpemVkSW5kZXggPSB3cmFwQXJvdW5kKHNlbGVjdGVkSW5kZXgsIHRoaXMuc3VnZ2VzdGlvbnMubGVuZ3RoKTtcbiAgICAgICAgY29uc3QgcHJldlNlbGVjdGVkU3VnZ2VzdGlvbiA9IHRoaXMuc3VnZ2VzdGlvbnNbdGhpcy5zZWxlY3RlZEl0ZW1dO1xuICAgICAgICBjb25zdCBzZWxlY3RlZFN1Z2dlc3Rpb24gPSB0aGlzLnN1Z2dlc3Rpb25zW25vcm1hbGl6ZWRJbmRleF07XG5cbiAgICAgICAgcHJldlNlbGVjdGVkU3VnZ2VzdGlvbj8ucmVtb3ZlQ2xhc3MoXCJpcy1zZWxlY3RlZFwiKTtcbiAgICAgICAgc2VsZWN0ZWRTdWdnZXN0aW9uPy5hZGRDbGFzcyhcImlzLXNlbGVjdGVkXCIpO1xuXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtID0gbm9ybWFsaXplZEluZGV4O1xuXG4gICAgICAgIGlmIChzY3JvbGxJbnRvVmlldykge1xuICAgICAgICAgICAgc2VsZWN0ZWRTdWdnZXN0aW9uLnNjcm9sbEludG9WaWV3KGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFRleHRJbnB1dFN1Z2dlc3Q8VD4gaW1wbGVtZW50cyBJU3VnZ2VzdE93bmVyPFQ+IHtcbiAgICBwcm90ZWN0ZWQgYXBwOiBBcHA7XG4gICAgcHJvdGVjdGVkIGlucHV0RWw6IEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MVGV4dEFyZWFFbGVtZW50O1xuXG4gICAgcHJpdmF0ZSBwb3BwZXI6IFBvcHBlckluc3RhbmNlO1xuICAgIHByaXZhdGUgc2NvcGU6IFNjb3BlO1xuICAgIHByaXZhdGUgc3VnZ2VzdEVsOiBIVE1MRWxlbWVudDtcbiAgICBwcml2YXRlIHN1Z2dlc3Q6IFN1Z2dlc3Q8VD47XG5cbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgaW5wdXRFbDogSFRNTElucHV0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG4gICAgICAgIHRoaXMuaW5wdXRFbCA9IGlucHV0RWw7XG4gICAgICAgIHRoaXMuc2NvcGUgPSBuZXcgU2NvcGUoKTtcblxuICAgICAgICB0aGlzLnN1Z2dlc3RFbCA9IGNyZWF0ZURpdihcInN1Z2dlc3Rpb24tY29udGFpbmVyXCIpO1xuICAgICAgICBjb25zdCBzdWdnZXN0aW9uID0gdGhpcy5zdWdnZXN0RWwuY3JlYXRlRGl2KFwic3VnZ2VzdGlvblwiKTtcbiAgICAgICAgdGhpcy5zdWdnZXN0ID0gbmV3IFN1Z2dlc3QodGhpcywgc3VnZ2VzdGlvbiwgdGhpcy5zY29wZSk7XG5cbiAgICAgICAgdGhpcy5zY29wZS5yZWdpc3RlcihbXSwgXCJFc2NhcGVcIiwgdGhpcy5jbG9zZS5iaW5kKHRoaXMpKTtcblxuICAgICAgICB0aGlzLmlucHV0RWwuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIHRoaXMub25JbnB1dENoYW5nZWQuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuaW5wdXRFbC5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgdGhpcy5vbklucHV0Q2hhbmdlZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5pbnB1dEVsLmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIHRoaXMuY2xvc2UuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuc3VnZ2VzdEVsLm9uKFxuICAgICAgICAgICAgXCJtb3VzZWRvd25cIixcbiAgICAgICAgICAgIFwiLnN1Z2dlc3Rpb24tY29udGFpbmVyXCIsXG4gICAgICAgICAgICAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIG9uSW5wdXRDaGFuZ2VkKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBpbnB1dFN0ciA9IHRoaXMuaW5wdXRFbC52YWx1ZTtcbiAgICAgICAgY29uc3Qgc3VnZ2VzdGlvbnMgPSB0aGlzLmdldFN1Z2dlc3Rpb25zKGlucHV0U3RyKTtcblxuICAgICAgICBpZiAoIXN1Z2dlc3Rpb25zKSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3VnZ2VzdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5zdWdnZXN0LnNldFN1Z2dlc3Rpb25zKHN1Z2dlc3Rpb25zKTtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgICAgICAgICB0aGlzLm9wZW4oKDxhbnk+dGhpcy5hcHApLmRvbS5hcHBDb250YWluZXJFbCwgdGhpcy5pbnB1dEVsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb3Blbihjb250YWluZXI6IEhUTUxFbGVtZW50LCBpbnB1dEVsOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgICAgICAoPGFueT50aGlzLmFwcCkua2V5bWFwLnB1c2hTY29wZSh0aGlzLnNjb3BlKTtcblxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5zdWdnZXN0RWwpO1xuICAgICAgICB0aGlzLnBvcHBlciA9IGNyZWF0ZVBvcHBlcihpbnB1dEVsLCB0aGlzLnN1Z2dlc3RFbCwge1xuICAgICAgICAgICAgcGxhY2VtZW50OiBcImJvdHRvbS1zdGFydFwiLFxuICAgICAgICAgICAgbW9kaWZpZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNhbWVXaWR0aFwiLFxuICAgICAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBmbjogKHsgc3RhdGUsIGluc3RhbmNlIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5vdGU6IHBvc2l0aW9uaW5nIG5lZWRzIHRvIGJlIGNhbGN1bGF0ZWQgdHdpY2UgLVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmlyc3QgcGFzcyAtIHBvc2l0aW9uaW5nIGl0IGFjY29yZGluZyB0byB0aGUgd2lkdGggb2YgdGhlIHBvcHBlclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2Vjb25kIHBhc3MgLSBwb3NpdGlvbiBpdCB3aXRoIHRoZSB3aWR0aCBib3VuZCB0byB0aGUgcmVmZXJlbmNlIGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdlIG5lZWQgdG8gZWFybHkgZXhpdCB0byBhdm9pZCBhbiBpbmZpbml0ZSBsb29wXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRXaWR0aCA9IGAke3N0YXRlLnJlY3RzLnJlZmVyZW5jZS53aWR0aH1weGA7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdGUuc3R5bGVzLnBvcHBlci53aWR0aCA9PT0gdGFyZ2V0V2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5zdHlsZXMucG9wcGVyLndpZHRoID0gdGFyZ2V0V2lkdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZS51cGRhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcGhhc2U6IFwiYmVmb3JlV3JpdGVcIixcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZXM6IFtcImNvbXB1dGVTdHlsZXNcIl0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNsb3NlKCk6IHZvaWQge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgICAgICAoPGFueT50aGlzLmFwcCkua2V5bWFwLnBvcFNjb3BlKHRoaXMuc2NvcGUpO1xuXG4gICAgICAgIHRoaXMuc3VnZ2VzdC5zZXRTdWdnZXN0aW9ucyhbXSk7XG4gICAgICAgIGlmICh0aGlzLnBvcHBlcilcbiAgICAgICAgICAgIHRoaXMucG9wcGVyLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5zdWdnZXN0RWwuZGV0YWNoKCk7XG4gICAgfVxuXG4gICAgYWJzdHJhY3QgZ2V0U3VnZ2VzdGlvbnMoaW5wdXRTdHI6IHN0cmluZyk6IFRbXTtcbiAgICBhYnN0cmFjdCByZW5kZXJTdWdnZXN0aW9uKGl0ZW06IFQsIGVsOiBIVE1MRWxlbWVudCk6IHZvaWQ7XG4gICAgYWJzdHJhY3Qgc2VsZWN0U3VnZ2VzdGlvbihpdGVtOiBUKTogdm9pZDtcbn1cbiIsIi8vIENyZWRpdHMgZ28gdG8gTGlhbSdzIFBlcmlvZGljIE5vdGVzIFBsdWdpbjogaHR0cHM6Ly9naXRodWIuY29tL2xpYW1jYWluL29ic2lkaWFuLXBlcmlvZGljLW5vdGVzXG5cbmltcG9ydCB7IFRBYnN0cmFjdEZpbGUsIFRGb2xkZXIgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IFRleHRJbnB1dFN1Z2dlc3QgfSBmcm9tIFwic3VnZ2VzdGVycy9zdWdnZXN0XCI7XG5cbmV4cG9ydCBjbGFzcyBGb2xkZXJTdWdnZXN0IGV4dGVuZHMgVGV4dElucHV0U3VnZ2VzdDxURm9sZGVyPiB7XG4gICAgZ2V0U3VnZ2VzdGlvbnMoaW5wdXRTdHI6IHN0cmluZyk6IFRGb2xkZXJbXSB7XG4gICAgICAgIGNvbnN0IGFic3RyYWN0RmlsZXMgPSB0aGlzLmFwcC52YXVsdC5nZXRBbGxMb2FkZWRGaWxlcygpO1xuICAgICAgICBjb25zdCBmb2xkZXJzOiBURm9sZGVyW10gPSBbXTtcbiAgICAgICAgY29uc3QgbG93ZXJDYXNlSW5wdXRTdHIgPSBpbnB1dFN0ci50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgIGFic3RyYWN0RmlsZXMuZm9yRWFjaCgoZm9sZGVyOiBUQWJzdHJhY3RGaWxlKSA9PiB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgZm9sZGVyIGluc3RhbmNlb2YgVEZvbGRlciAmJlxuICAgICAgICAgICAgICAgIGZvbGRlci5wYXRoLnRvTG93ZXJDYXNlKCkuY29udGFpbnMobG93ZXJDYXNlSW5wdXRTdHIpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBmb2xkZXJzLnB1c2goZm9sZGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGZvbGRlcnM7XG4gICAgfVxuXG4gICAgcmVuZGVyU3VnZ2VzdGlvbihmaWxlOiBURm9sZGVyLCBlbDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgZWwuc2V0VGV4dChmaWxlLnBhdGgpO1xuICAgIH1cblxuICAgIHNlbGVjdFN1Z2dlc3Rpb24oZmlsZTogVEZvbGRlcik6IHZvaWQge1xuICAgICAgICB0aGlzLmlucHV0RWwudmFsdWUgPSBmaWxlLnBhdGg7XG4gICAgICAgIHRoaXMuaW5wdXRFbC50cmlnZ2VyKFwiaW5wdXRcIik7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBUZW1wbGF0ZXJFcnJvciB9IGZyb20gXCJFcnJvclwiO1xuaW1wb3J0IHsgQXBwLCBub3JtYWxpemVQYXRoLCBUQWJzdHJhY3RGaWxlLCBURmlsZSwgVEZvbGRlciwgVmF1bHQgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuZXhwb3J0IGNvbnN0IG9ic2lkaWFuX21vZHVsZSA9IHJlcXVpcmUoXCJvYnNpZGlhblwiKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGRlbGF5KG1zOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoIHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykgKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBlc2NhcGVfUmVnRXhwKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLCAnXFxcXCQmJyk7IC8vICQmIG1lYW5zIHRoZSB3aG9sZSBtYXRjaGVkIHN0cmluZ1xufSBcblxuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVfdGZvbGRlcihhcHA6IEFwcCwgZm9sZGVyX3N0cjogc3RyaW5nKTogVEZvbGRlciB7XG4gICAgZm9sZGVyX3N0ciAgPSBub3JtYWxpemVQYXRoKGZvbGRlcl9zdHIpO1xuXG4gICAgY29uc3QgZm9sZGVyID0gYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChmb2xkZXJfc3RyKTtcbiAgICBpZiAoIWZvbGRlcikge1xuICAgICAgICB0aHJvdyBuZXcgVGVtcGxhdGVyRXJyb3IoYEZvbGRlciBcIiR7Zm9sZGVyX3N0cn1cIiBkb2Vzbid0IGV4aXN0YCk7XG4gICAgfVxuICAgIGlmICghKGZvbGRlciBpbnN0YW5jZW9mIFRGb2xkZXIpKSB7XG4gICAgICAgIHRocm93IG5ldyBUZW1wbGF0ZXJFcnJvcihgJHtmb2xkZXJfc3RyfSBpcyBhIGZpbGUsIG5vdCBhIGZvbGRlcmApO1xuICAgIH1cblxuICAgIHJldHVybiBmb2xkZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlX3RmaWxlKGFwcDogQXBwLCBmaWxlX3N0cjogc3RyaW5nKTogVEZpbGUge1xuICAgIGZpbGVfc3RyID0gbm9ybWFsaXplUGF0aChmaWxlX3N0cik7XG5cbiAgICBjb25zdCBmaWxlID0gYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChmaWxlX3N0cik7XG4gICAgaWYgKCFmaWxlKSB7XG4gICAgICAgIHRocm93IG5ldyBUZW1wbGF0ZXJFcnJvcihgRmlsZSBcIiR7ZmlsZV9zdHJ9XCIgZG9lc24ndCBleGlzdGApO1xuICAgIH1cbiAgICBpZiAoIShmaWxlIGluc3RhbmNlb2YgVEZpbGUpKSB7XG4gICAgICAgIHRocm93IG5ldyBUZW1wbGF0ZXJFcnJvcihgJHtmaWxlX3N0cn0gaXMgYSBmb2xkZXIsIG5vdCBhIGZpbGVgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmlsZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldF90ZmlsZXNfZnJvbV9mb2xkZXIoYXBwOiBBcHAsIGZvbGRlcl9zdHI6IHN0cmluZyk6IEFycmF5PFRGaWxlPiB7XG4gICAgY29uc3QgZm9sZGVyID0gcmVzb2x2ZV90Zm9sZGVyKGFwcCwgZm9sZGVyX3N0cik7XG5cbiAgICBsZXQgZmlsZXM6IEFycmF5PFRGaWxlPiA9IFtdO1xuICAgIFZhdWx0LnJlY3Vyc2VDaGlsZHJlbihmb2xkZXIsIChmaWxlOiBUQWJzdHJhY3RGaWxlKSA9PiB7XG4gICAgICAgIGlmIChmaWxlIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICAgICAgICAgIGZpbGVzLnB1c2goZmlsZSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGZpbGVzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgcmV0dXJuIGEuYmFzZW5hbWUubG9jYWxlQ29tcGFyZShiLmJhc2VuYW1lKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBmaWxlcztcbn1cbiIsIi8vIENyZWRpdHMgZ28gdG8gTGlhbSdzIFBlcmlvZGljIE5vdGVzIFBsdWdpbjogaHR0cHM6Ly9naXRodWIuY29tL2xpYW1jYWluL29ic2lkaWFuLXBlcmlvZGljLW5vdGVzXG5cbmltcG9ydCB7IEFwcCwgVEFic3RyYWN0RmlsZSwgVEZpbGUgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IFRleHRJbnB1dFN1Z2dlc3QgfSBmcm9tIFwic3VnZ2VzdGVycy9zdWdnZXN0XCI7XG5pbXBvcnQgeyBnZXRfdGZpbGVzX2Zyb21fZm9sZGVyIH0gZnJvbSAnVXRpbHMnO1xuaW1wb3J0IFRlbXBsYXRlclBsdWdpbiBmcm9tICdtYWluJztcbmltcG9ydCB7IGVycm9yV3JhcHBlclN5bmMgfSBmcm9tICdFcnJvcic7XG5cbmV4cG9ydCBlbnVtIEZpbGVTdWdnZXN0TW9kZSB7XG4gICAgVGVtcGxhdGVGaWxlcyxcbiAgICBTY3JpcHRGaWxlcyxcbn07XG5cbmV4cG9ydCBjbGFzcyBGaWxlU3VnZ2VzdCBleHRlbmRzIFRleHRJbnB1dFN1Z2dlc3Q8VEZpbGU+IHtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgYXBwOiBBcHAsIHB1YmxpYyBpbnB1dEVsOiBIVE1MSW5wdXRFbGVtZW50LCBwcml2YXRlIHBsdWdpbjogVGVtcGxhdGVyUGx1Z2luLCBwcml2YXRlIG1vZGU6IEZpbGVTdWdnZXN0TW9kZSkge1xuICAgICAgICBzdXBlcihhcHAsIGlucHV0RWwpO1xuICAgIH1cblxuICAgIGdldF9mb2xkZXIobW9kZTogRmlsZVN1Z2dlc3RNb2RlKTogc3RyaW5nIHtcbiAgICAgICAgc3dpdGNoIChtb2RlKSB7XG4gICAgICAgICAgICBjYXNlIEZpbGVTdWdnZXN0TW9kZS5UZW1wbGF0ZUZpbGVzOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZXNfZm9sZGVyO1xuICAgICAgICAgICAgY2FzZSBGaWxlU3VnZ2VzdE1vZGUuU2NyaXB0RmlsZXM6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGx1Z2luLnNldHRpbmdzLnVzZXJfc2NyaXB0c19mb2xkZXI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRfZXJyb3JfbXNnKG1vZGU6IEZpbGVTdWdnZXN0TW9kZSk6IHN0cmluZyB7XG4gICAgICAgIHN3aXRjaCAobW9kZSkge1xuICAgICAgICAgICAgY2FzZSBGaWxlU3VnZ2VzdE1vZGUuVGVtcGxhdGVGaWxlczpcbiAgICAgICAgICAgICAgICByZXR1cm4gYFRlbXBsYXRlcyBmb2xkZXIgZG9lc24ndCBleGlzdGA7XG4gICAgICAgICAgICBjYXNlIEZpbGVTdWdnZXN0TW9kZS5TY3JpcHRGaWxlczpcbiAgICAgICAgICAgICAgICByZXR1cm4gYFVzZXIgU2NyaXB0cyBmb2xkZXIgZG9lc24ndCBleGlzdGA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRTdWdnZXN0aW9ucyhpbnB1dF9zdHI6IHN0cmluZyk6IFRGaWxlW10ge1xuICAgICAgICBjb25zdCBhbGxfZmlsZXMgPSBlcnJvcldyYXBwZXJTeW5jKCgpID0+IGdldF90ZmlsZXNfZnJvbV9mb2xkZXIodGhpcy5hcHAsIHRoaXMuZ2V0X2ZvbGRlcih0aGlzLm1vZGUpKSwgdGhpcy5nZXRfZXJyb3JfbXNnKHRoaXMubW9kZSkpO1xuICAgICAgICBpZiAoIWFsbF9maWxlcykge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZmlsZXM6IFRGaWxlW10gPSBbXTtcbiAgICAgICAgY29uc3QgbG93ZXJfaW5wdXRfc3RyID0gaW5wdXRfc3RyLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgYWxsX2ZpbGVzLmZvckVhY2goKGZpbGU6IFRBYnN0cmFjdEZpbGUpID0+IHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBmaWxlIGluc3RhbmNlb2YgVEZpbGUgJiZcbiAgICAgICAgICAgICAgICBmaWxlLmV4dGVuc2lvbiA9PT0gXCJtZFwiICYmXG4gICAgICAgICAgICAgICAgZmlsZS5wYXRoLnRvTG93ZXJDYXNlKCkuY29udGFpbnMobG93ZXJfaW5wdXRfc3RyKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgZmlsZXMucHVzaChmaWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGZpbGVzO1xuICAgIH1cblxuICAgIHJlbmRlclN1Z2dlc3Rpb24oZmlsZTogVEZpbGUsIGVsOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgICAgICBlbC5zZXRUZXh0KGZpbGUucGF0aCk7XG4gICAgfVxuXG4gICAgc2VsZWN0U3VnZ2VzdGlvbihmaWxlOiBURmlsZSk6IHZvaWQge1xuICAgICAgICB0aGlzLmlucHV0RWwudmFsdWUgPSBmaWxlLnBhdGg7XG4gICAgICAgIHRoaXMuaW5wdXRFbC50cmlnZ2VyKFwiaW5wdXRcIik7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBBcHAsIFBsdWdpblNldHRpbmdUYWIsIFNldHRpbmcsIFRGaWxlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBlcnJvcldyYXBwZXJTeW5jLCBUZW1wbGF0ZXJFcnJvciB9IGZyb20gXCJFcnJvclwiO1xuaW1wb3J0IHsgRm9sZGVyU3VnZ2VzdCB9IGZyb20gJ3N1Z2dlc3RlcnMvRm9sZGVyU3VnZ2VzdGVyJztcbmltcG9ydCB7IEZpbGVTdWdnZXN0LCBGaWxlU3VnZ2VzdE1vZGUgfSBmcm9tICdzdWdnZXN0ZXJzL0ZpbGVTdWdnZXN0ZXInO1xuaW1wb3J0IFRlbXBsYXRlclBsdWdpbiBmcm9tICcuL21haW4nO1xuaW1wb3J0IHsgZ2V0X3RmaWxlc19mcm9tX2ZvbGRlciB9IGZyb20gJ1V0aWxzJztcbmltcG9ydCB7IGxvZ19lcnJvciB9IGZyb20gJ0xvZyc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1NFVFRJTkdTOiBTZXR0aW5ncyA9IHtcblx0Y29tbWFuZF90aW1lb3V0OiA1LFxuXHR0ZW1wbGF0ZXNfZm9sZGVyOiBcIlwiLFxuXHR0ZW1wbGF0ZXNfcGFpcnM6IFtbXCJcIiwgXCJcIl1dLFxuXHR0cmlnZ2VyX29uX2ZpbGVfY3JlYXRpb246IGZhbHNlLFxuXHRlbmFibGVfc3lzdGVtX2NvbW1hbmRzOiBmYWxzZSxcblx0c2hlbGxfcGF0aDogXCJcIixcblx0dXNlcl9zY3JpcHRzX2ZvbGRlcjogdW5kZWZpbmVkLFxuXHRlbXB0eV9maWxlX3RlbXBsYXRlOiB1bmRlZmluZWQsXG5cdHN5bnRheF9oaWdobGlnaHRpbmc6IHRydWUsXG4gICAgZW5hYmxlZF90ZW1wbGF0ZXNfaG90a2V5czogW1wiXCJdLFxuICAgIHN0YXJ0dXBfdGVtcGxhdGVzOiBbXCJcIl0sXG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIFNldHRpbmdzIHtcblx0Y29tbWFuZF90aW1lb3V0OiBudW1iZXI7XG5cdHRlbXBsYXRlc19mb2xkZXI6IHN0cmluZztcblx0dGVtcGxhdGVzX3BhaXJzOiBBcnJheTxbc3RyaW5nLCBzdHJpbmddPjtcblx0ZW5hYmxlX3N5c3RlbV9jb21tYW5kczogYm9vbGVhbjtcblx0c2hlbGxfcGF0aDogc3RyaW5nLFxuXHR1c2VyX3NjcmlwdHNfZm9sZGVyOiBzdHJpbmcsXG5cdGVtcHR5X2ZpbGVfdGVtcGxhdGU6IHN0cmluZyxcblx0dHJpZ2dlcl9vbl9maWxlX2NyZWF0aW9uOiBib29sZWFuO1xuXHRzeW50YXhfaGlnaGxpZ2h0aW5nOiBib29sZWFuLFxuICAgIGVuYWJsZWRfdGVtcGxhdGVzX2hvdGtleXM6IEFycmF5PHN0cmluZz4sXG4gICAgc3RhcnR1cF90ZW1wbGF0ZXM6IEFycmF5PHN0cmluZz4sXG59O1xuXG5leHBvcnQgY2xhc3MgVGVtcGxhdGVyU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuXHRjb25zdHJ1Y3RvcihwdWJsaWMgYXBwOiBBcHAsIHByaXZhdGUgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW4pIHtcblx0XHRzdXBlcihhcHAsIHBsdWdpbik7XG5cdH1cblxuXHRkaXNwbGF5KCk6IHZvaWQge1xuXHRcdHRoaXMuY29udGFpbmVyRWwuZW1wdHkoKTtcblxuICAgICAgICB0aGlzLmFkZF90ZW1wbGF0ZV9mb2xkZXJfc2V0dGluZygpO1xuICAgICAgICB0aGlzLmFkZF9pbnRlcm5hbF9mdW5jdGlvbnNfc2V0dGluZygpO1xuICAgICAgICB0aGlzLmFkZF9zeW50YXhfaGlnaGxpZ2h0aW5nX3NldHRpbmcoKTtcbiAgICAgICAgdGhpcy5hZGRfdHJpZ2dlcl9vbl9uZXdfZmlsZV9jcmVhdGlvbl9zZXR0aW5nKCk7XG4gICAgICAgIHRoaXMuYWRkX3RlbXBsYXRlc19ob3RrZXlzX3NldHRpbmcoKTtcbiAgICAgICAgdGhpcy5hZGRfc3RhcnR1cF90ZW1wbGF0ZXNfc2V0dGluZygpO1xuICAgICAgICB0aGlzLmFkZF91c2VyX3NjcmlwdF9mdW5jdGlvbnNfc2V0dGluZygpO1xuICAgICAgICB0aGlzLmFkZF91c2VyX3N5c3RlbV9jb21tYW5kX2Z1bmN0aW9uc19zZXR0aW5nKCk7XG5cdH1cblxuICAgIGFkZF90ZW1wbGF0ZV9mb2xkZXJfc2V0dGluZygpIHtcblx0XHRuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKVxuXHRcdFx0LnNldE5hbWUoXCJUZW1wbGF0ZSBmb2xkZXIgbG9jYXRpb25cIilcblx0XHRcdC5zZXREZXNjKFwiRmlsZXMgaW4gdGhpcyBmb2xkZXIgd2lsbCBiZSBhdmFpbGFibGUgYXMgdGVtcGxhdGVzLlwiKVxuXHRcdFx0LmFkZFNlYXJjaChjYiA9PiB7XG4gICAgICAgICAgICAgICAgbmV3IEZvbGRlclN1Z2dlc3QodGhpcy5hcHAsIGNiLmlucHV0RWwpO1xuXHRcdFx0XHRjYi5zZXRQbGFjZWhvbGRlcihcIkV4YW1wbGU6IGZvbGRlcjEvZm9sZGVyMlwiKVxuXHRcdFx0XHRcdC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZXNfZm9sZGVyKVxuXHRcdFx0XHRcdC5vbkNoYW5nZSgobmV3X2ZvbGRlcikgPT4ge1xuXHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVzX2ZvbGRlciA9IG5ld19mb2xkZXI7XG5cdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zYXZlX3NldHRpbmdzKCk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdH0pO1xuICAgIH1cblxuICAgIGFkZF9pbnRlcm5hbF9mdW5jdGlvbnNfc2V0dGluZygpIHtcblx0XHRjb25zdCBkZXNjID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXHRcdGRlc2MuYXBwZW5kKFxuXHRcdFx0XCJUZW1wbGF0ZXIgcHJvdmlkZXMgbXVsdGlwbGVzIHByZWRlZmluZWQgdmFyaWFibGVzIC8gZnVuY3Rpb25zIHRoYXQgeW91IGNhbiB1c2UuXCIsXG5cdFx0XHRkZXNjLmNyZWF0ZUVsKFwiYnJcIiksXG5cdFx0XHRcIkNoZWNrIHRoZSBcIixcblx0XHRcdGRlc2MuY3JlYXRlRWwoXCJhXCIsIHtcblx0XHRcdFx0aHJlZjogXCJodHRwczovL3NpbGVudHZvaWQxMy5naXRodWIuaW8vVGVtcGxhdGVyL1wiLFxuXHRcdFx0XHR0ZXh0OiBcImRvY3VtZW50YXRpb25cIlxuXHRcdFx0fSksXG5cdFx0XHRcIiB0byBnZXQgYSBsaXN0IG9mIGFsbCB0aGUgYXZhaWxhYmxlIGludGVybmFsIHZhcmlhYmxlcyAvIGZ1bmN0aW9ucy5cIixcblx0XHQpO1xuXG5cdFx0bmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcblx0XHRcdC5zZXROYW1lKFwiSW50ZXJuYWwgVmFyaWFibGVzIGFuZCBGdW5jdGlvbnNcIilcblx0XHRcdC5zZXREZXNjKGRlc2MpO1xuICAgIH1cblxuICAgIGFkZF9zeW50YXhfaGlnaGxpZ2h0aW5nX3NldHRpbmcoKSB7XG5cdFx0Y29uc3QgZGVzYyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblx0XHRkZXNjLmFwcGVuZChcblx0XHRcdFwiQWRkcyBzeW50YXggaGlnaGxpZ2h0aW5nIGZvciBUZW1wbGF0ZXIgY29tbWFuZHMgaW4gZWRpdCBtb2RlLlwiLFxuXHRcdCk7XHRcblxuXHRcdG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpXG5cdFx0XHQuc2V0TmFtZShcIlN5bnRheCBIaWdobGlnaHRpbmdcIilcblx0XHRcdC5zZXREZXNjKGRlc2MpXG5cdFx0XHQuYWRkVG9nZ2xlKHRvZ2dsZSA9PiB7XG5cdFx0XHRcdHRvZ2dsZVxuXHRcdFx0XHRcdC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW50YXhfaGlnaGxpZ2h0aW5nKVxuXHRcdFx0XHRcdC5vbkNoYW5nZShzeW50YXhfaGlnaGxpZ2h0aW5nID0+IHtcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bnRheF9oaWdobGlnaHRpbmcgPSBzeW50YXhfaGlnaGxpZ2h0aW5nO1xuXHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2F2ZV9zZXR0aW5ncygpO1xuXHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4uZXZlbnRfaGFuZGxlci51cGRhdGVfc3ludGF4X2hpZ2hsaWdodGluZygpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHR9KTtcbiAgICB9XG5cblxuICAgIGFkZF90cmlnZ2VyX29uX25ld19maWxlX2NyZWF0aW9uX3NldHRpbmcoKSB7XG5cdFx0bGV0IGRlc2MgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdFx0ZGVzYy5hcHBlbmQoXG5cdFx0XHRcIlRlbXBsYXRlciB3aWxsIGxpc3RlbiBmb3IgdGhlIG5ldyBmaWxlIGNyZWF0aW9uIGV2ZW50LCBhbmQgcmVwbGFjZSBldmVyeSBjb21tYW5kIGl0IGZpbmRzIGluIHRoZSBuZXcgZmlsZSdzIGNvbnRlbnQuXCIsXG5cdFx0XHRkZXNjLmNyZWF0ZUVsKFwiYnJcIiksXG5cdFx0XHRcIlRoaXMgbWFrZXMgVGVtcGxhdGVyIGNvbXBhdGlibGUgd2l0aCBvdGhlciBwbHVnaW5zIGxpa2UgdGhlIERhaWx5IG5vdGUgY29yZSBwbHVnaW4sIENhbGVuZGFyIHBsdWdpbiwgUmV2aWV3IHBsdWdpbiwgTm90ZSByZWZhY3RvciBwbHVnaW4sIC4uLlwiLFxuXHRcdFx0ZGVzYy5jcmVhdGVFbChcImJyXCIpLFxuXHRcdFx0ZGVzYy5jcmVhdGVFbChcImJcIiwge1xuXHRcdFx0XHR0ZXh0OiBcIldhcm5pbmc6IFwiLFxuXHRcdFx0fSksXG5cdFx0XHRcIlRoaXMgY2FuIGJlIGRhbmdlcm91cyBpZiB5b3UgY3JlYXRlIG5ldyBmaWxlcyB3aXRoIHVua25vd24gLyB1bnNhZmUgY29udGVudCBvbiBjcmVhdGlvbi4gTWFrZSBzdXJlIHRoYXQgZXZlcnkgbmV3IGZpbGUncyBjb250ZW50IGlzIHNhZmUgb24gY3JlYXRpb24uXCJcblx0XHQpO1x0XG5cblx0XHRuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKVxuXHRcdFx0LnNldE5hbWUoXCJUcmlnZ2VyIFRlbXBsYXRlciBvbiBuZXcgZmlsZSBjcmVhdGlvblwiKVxuXHRcdFx0LnNldERlc2MoZGVzYylcblx0XHRcdC5hZGRUb2dnbGUodG9nZ2xlID0+IHtcblx0XHRcdFx0dG9nZ2xlXG5cdFx0XHRcdFx0LnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnRyaWdnZXJfb25fZmlsZV9jcmVhdGlvbilcblx0XHRcdFx0XHQub25DaGFuZ2UodHJpZ2dlcl9vbl9maWxlX2NyZWF0aW9uID0+IHtcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLnRyaWdnZXJfb25fZmlsZV9jcmVhdGlvbiA9IHRyaWdnZXJfb25fZmlsZV9jcmVhdGlvbjtcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNhdmVfc2V0dGluZ3MoKTtcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLmV2ZW50X2hhbmRsZXIudXBkYXRlX3RyaWdnZXJfZmlsZV9vbl9jcmVhdGlvbigpO1xuXHRcdFx0XHRcdFx0Ly8gRm9yY2UgcmVmcmVzaFxuXHRcdFx0XHRcdFx0dGhpcy5kaXNwbGF5KCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblxuXHRcdGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy50cmlnZ2VyX29uX2ZpbGVfY3JlYXRpb24pIHtcblx0XHRcdGRlc2MgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdFx0XHRkZXNjLmFwcGVuZChcblx0XHRcdFx0XCJUZW1wbGF0ZXIgd2lsbCBhdXRvbWF0aWNhbGx5IGFwcGx5IHRoaXMgdGVtcGxhdGUgdG8gbmV3IGVtcHR5IGZpbGVzIHdoZW4gdGhleSBhcmUgY3JlYXRlZC5cIixcblx0XHRcdFx0ZGVzYy5jcmVhdGVFbChcImJyXCIpLFxuXHRcdFx0XHRcIlRoZSAubWQgZXh0ZW5zaW9uIGZvciB0aGUgZmlsZSBzaG91bGRuJ3QgYmUgc3BlY2lmaWVkLlwiXG5cdFx0XHQpO1xuXHRcdFx0XG5cdFx0XHRuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKVxuXHRcdFx0XHQuc2V0TmFtZShcIkVtcHR5IGZpbGUgdGVtcGxhdGVcIilcblx0XHRcdFx0LnNldERlc2MoZGVzYylcblx0XHRcdFx0LmFkZFNlYXJjaChjYiA9PiB7XG4gICAgICAgICAgICAgICAgICAgIG5ldyBGaWxlU3VnZ2VzdCh0aGlzLmFwcCwgY2IuaW5wdXRFbCwgdGhpcy5wbHVnaW4sIEZpbGVTdWdnZXN0TW9kZS5UZW1wbGF0ZUZpbGVzKTtcblxuXHRcdFx0XHRcdGNiLnNldFBsYWNlaG9sZGVyKFwiZm9sZGVyMS90ZW1wbGF0ZV9maWxlXCIpXG5cdFx0XHRcdFx0XHQuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZW1wdHlfZmlsZV90ZW1wbGF0ZSlcblx0XHRcdFx0XHRcdC5vbkNoYW5nZSgoZW1wdHlfZmlsZV90ZW1wbGF0ZSkgPT4ge1xuXHRcdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbXB0eV9maWxlX3RlbXBsYXRlID0gZW1wdHlfZmlsZV90ZW1wbGF0ZTtcblx0XHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2F2ZV9zZXR0aW5ncygpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdH1cbiAgICB9XG5cbiAgICBhZGRfdGVtcGxhdGVzX2hvdGtleXNfc2V0dGluZygpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXJFbC5jcmVhdGVFbChcImgyXCIsIHsgdGV4dDogXCJUZW1wbGF0ZXMgSG90a2V5c1wifSk7XG5cbiAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlZF90ZW1wbGF0ZXNfaG90a2V5cy5mb3JFYWNoKCh0ZW1wbGF0ZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHMgPSBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKVxuICAgICAgICAgICAgICAgIC5hZGRTZWFyY2goY2IgPT4ge1xuICAgICAgICAgICAgICAgICAgICBuZXcgRmlsZVN1Z2dlc3QodGhpcy5hcHAsIGNiLmlucHV0RWwsIHRoaXMucGx1Z2luLCBGaWxlU3VnZ2VzdE1vZGUuVGVtcGxhdGVGaWxlcyk7XG4gICAgICAgICAgICAgICAgICAgIGNiLnNldFBsYWNlaG9sZGVyKFwiRXhhbXBsZTogZm9sZGVyMS90ZW1wbGF0ZV9maWxlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGVtcGxhdGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoKG5ld190ZW1wbGF0ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXdfdGVtcGxhdGUgIT09IFwiXCIgJiYgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlZF90ZW1wbGF0ZXNfaG90a2V5cy5jb250YWlucyhuZXdfdGVtcGxhdGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ19lcnJvcihuZXcgVGVtcGxhdGVyRXJyb3IoXCJUaGlzIHRlbXBsYXRlIGlzIGFscmVhZHkgYm91bmQgdG8gYSBob3RrZXlcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmNvbW1hbmRfaGFuZGxlci5hZGRfdGVtcGxhdGVfaG90a2V5KHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZWRfdGVtcGxhdGVzX2hvdGtleXNbaW5kZXhdLCBuZXdfdGVtcGxhdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZWRfdGVtcGxhdGVzX2hvdGtleXNbaW5kZXhdID0gbmV3X3RlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVfc2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmFkZEV4dHJhQnV0dG9uKGNiID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY2Iuc2V0SWNvbihcImFueS1rZXlcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRUb29sdGlwKFwiQ29uZmlndXJlIEhvdGtleVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRPRE86IFJlcGxhY2Ugd2l0aCBmdXR1cmUgXCJvZmZpY2lhbFwiIHdheSB0byBkbyB0aGlzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwLnNldHRpbmcub3BlblRhYkJ5SWQoXCJob3RrZXlzXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0YWIgPSB0aGlzLmFwcC5zZXR0aW5nLmFjdGl2ZVRhYjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWIuc2VhcmNoSW5wdXRFbC52YWx1ZSA9IFwiVGVtcGxhdGVyOiBJbnNlcnRcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWIudXBkYXRlSG90a2V5VmlzaWJpbGl0eSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuYWRkRXh0cmFCdXR0b24oY2IgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjYi5zZXRJY29uKFwiY3Jvc3NcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRUb29sdGlwKFwiRGVsZXRlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uY29tbWFuZF9oYW5kbGVyLnJlbW92ZV90ZW1wbGF0ZV9ob3RrZXkodGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlZF90ZW1wbGF0ZXNfaG90a2V5c1tpbmRleF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZWRfdGVtcGxhdGVzX2hvdGtleXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3JjZSByZWZyZXNoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHMuaW5mb0VsLnJlbW92ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLmFkZEJ1dHRvbihjYiA9PiB7XG4gICAgICAgICAgICAgICAgY2Iuc2V0QnV0dG9uVGV4dChcIkFkZCBuZXcgaG90a2V5IGZvciB0ZW1wbGF0ZVwiKVxuICAgICAgICAgICAgICAgICAgICAuc2V0Q3RhKClcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soXyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVkX3RlbXBsYXRlc19ob3RrZXlzLnB1c2goXCJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3JjZSByZWZyZXNoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhZGRfc3RhcnR1cF90ZW1wbGF0ZXNfc2V0dGluZygpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXJFbC5jcmVhdGVFbChcImgyXCIsIHsgdGV4dDogXCJTdGFydHVwIFRlbXBsYXRlc1wifSk7XG5cblx0XHRjb25zdCBkZXNjID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXHRcdGRlc2MuYXBwZW5kKFxuXHRcdFx0XCJTdGFydHVwIFRlbXBsYXRlcyBhcmUgdGVtcGxhdGVzIHRoYXQgd2lsbCBnZXQgZXhlY3V0ZWQgb25jZSB3aGVuIFRlbXBsYXRlciBzdGFydHMuXCIsXG5cdFx0XHRkZXNjLmNyZWF0ZUVsKFwiYnJcIiksXG5cdFx0XHRcIlRoZXNlIHRlbXBsYXRlcyB3b24ndCBvdXRwdXQgYW55dGhpbmcuXCIsXG5cdFx0XHRkZXNjLmNyZWF0ZUVsKFwiYnJcIiksXG5cdFx0XHRcIlRoaXMgY2FuIGJlIHVzZWZ1bCB0byBzZXQgdXAgdGVtcGxhdGVzIGFkZGluZyBob29rcyB0byBvYnNpZGlhbiBldmVudHMgZm9yIGV4YW1wbGUuXCIsXG5cdFx0KTtcbiAgICAgICAgXG5cdFx0bmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcblx0XHRcdC5zZXREZXNjKGRlc2MpO1xuXG4gICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnN0YXJ0dXBfdGVtcGxhdGVzLmZvckVhY2goKHRlbXBsYXRlLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcyA9IG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpXG4gICAgICAgICAgICAgICAgLmFkZFNlYXJjaChjYiA9PiB7XG4gICAgICAgICAgICAgICAgICAgIG5ldyBGaWxlU3VnZ2VzdCh0aGlzLmFwcCwgY2IuaW5wdXRFbCwgdGhpcy5wbHVnaW4sIEZpbGVTdWdnZXN0TW9kZS5UZW1wbGF0ZUZpbGVzKTtcbiAgICAgICAgICAgICAgICAgICAgY2Iuc2V0UGxhY2Vob2xkZXIoXCJFeGFtcGxlOiBmb2xkZXIxL3RlbXBsYXRlX2ZpbGVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0ZW1wbGF0ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgobmV3X3RlbXBsYXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5ld190ZW1wbGF0ZSAhPT0gXCJcIiAmJiB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zdGFydHVwX3RlbXBsYXRlcy5jb250YWlucyhuZXdfdGVtcGxhdGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ19lcnJvcihuZXcgVGVtcGxhdGVyRXJyb3IoXCJUaGlzIHN0YXJ0dXAgdGVtcGxhdGUgYWxyZWFkeSBleGlzdFwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3RhcnR1cF90ZW1wbGF0ZXNbaW5kZXhdID0gbmV3X3RlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVfc2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmFkZEV4dHJhQnV0dG9uKGNiID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY2Iuc2V0SWNvbihcImNyb3NzXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2V0VG9vbHRpcChcIkRlbGV0ZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnN0YXJ0dXBfdGVtcGxhdGVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yY2UgcmVmcmVzaFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzLmluZm9FbC5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcbiAgICAgICAgICAgIC5hZGRCdXR0b24oY2IgPT4ge1xuICAgICAgICAgICAgICAgIGNiLnNldEJ1dHRvblRleHQoXCJBZGQgbmV3IHN0YXJ0dXAgdGVtcGxhdGVcIilcbiAgICAgICAgICAgICAgICAgICAgLnNldEN0YSgpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNsaWNrKF8gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3RhcnR1cF90ZW1wbGF0ZXMucHVzaChcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvcmNlIHJlZnJlc2hcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFkZF91c2VyX3NjcmlwdF9mdW5jdGlvbnNfc2V0dGluZygpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXJFbC5jcmVhdGVFbChcImgyXCIsIHsgdGV4dDogXCJVc2VyIFNjcmlwdCBGdW5jdGlvbnNcIn0pO1xuXG5cdFx0bGV0IGRlc2MgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cdFx0ZGVzYy5hcHBlbmQoXG5cdFx0XHRcIkFsbCBKYXZhU2NyaXB0IGZpbGVzIGluIHRoaXMgZm9sZGVyIHdpbGwgYmUgbG9hZGVkIGFzIENvbW1vbkpTIG1vZHVsZXMsIHRvIGltcG9ydCBjdXN0b20gdXNlciBmdW5jdGlvbnMuXCIsIFxuXHRcdFx0ZGVzYy5jcmVhdGVFbChcImJyXCIpLFxuXHRcdFx0XCJUaGUgZm9sZGVyIG5lZWRzIHRvIGJlIGFjY2Vzc2libGUgZnJvbSB0aGUgdmF1bHQuXCIsXG5cdFx0XHRkZXNjLmNyZWF0ZUVsKFwiYnJcIiksXG5cdFx0XHRcIkNoZWNrIHRoZSBcIixcblx0XHRcdGRlc2MuY3JlYXRlRWwoXCJhXCIsIHtcblx0XHRcdFx0aHJlZjogXCJodHRwczovL3NpbGVudHZvaWQxMy5naXRodWIuaW8vVGVtcGxhdGVyL1wiLFxuXHRcdFx0XHR0ZXh0OiBcImRvY3VtZW50YXRpb25cIixcblx0XHRcdH0pLFxuXHRcdFx0XCIgZm9yIG1vcmUgaW5mb3JtYXRpb25zLlwiLFxuXHRcdCk7XG5cblx0XHRuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKVxuXHRcdFx0LnNldE5hbWUoXCJTY3JpcHQgZmlsZXMgZm9sZGVyIGxvY2F0aW9uXCIpXG5cdFx0XHQuc2V0RGVzYyhkZXNjKVxuXHRcdFx0LmFkZFNlYXJjaChjYiA9PiB7XG4gICAgICAgICAgICAgICAgbmV3IEZvbGRlclN1Z2dlc3QodGhpcy5hcHAsIGNiLmlucHV0RWwpO1xuXHRcdFx0XHRjYi5zZXRQbGFjZWhvbGRlcihcIkV4YW1wbGU6IGZvbGRlcjEvZm9sZGVyMlwiKVxuXHRcdFx0XHRcdC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy51c2VyX3NjcmlwdHNfZm9sZGVyKVxuXHRcdFx0XHRcdC5vbkNoYW5nZSgobmV3X2ZvbGRlcikgPT4ge1xuXHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3MudXNlcl9zY3JpcHRzX2ZvbGRlciA9IG5ld19mb2xkZXI7XG5cdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zYXZlX3NldHRpbmdzKCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblxuICAgICAgICBkZXNjID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgICBsZXQgZmlsZXM6IFRGaWxlW107XG4gICAgICAgIGZpbGVzID0gZXJyb3JXcmFwcGVyU3luYygoKSA9PiBnZXRfdGZpbGVzX2Zyb21fZm9sZGVyKHRoaXMuYXBwLCB0aGlzLnBsdWdpbi5zZXR0aW5ncy51c2VyX3NjcmlwdHNfZm9sZGVyKSwgYFVzZXIgU2NyaXB0cyBmb2xkZXIgZG9lc24ndCBleGlzdGApO1xuICAgICAgICBpZiAoIWZpbGVzKSB7XG4gICAgICAgICAgICBmaWxlcyA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG5hbWU6IHN0cmluZztcbiAgICAgICAgbGV0IGNvdW50ID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBmaWxlIG9mIGZpbGVzKSB7XG4gICAgICAgICAgICBpZiAoZmlsZS5leHRlbnNpb24gPT09IFwianNcIikge1xuICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICAgICAgZGVzYy5hcHBlbmQoXG4gICAgICAgICAgICAgICAgICAgIGRlc2MuY3JlYXRlRWwoXCJsaVwiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBgdHAudXNlci4ke2ZpbGUuYmFzZW5hbWV9YFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvdW50ID09PSAwKSB7XG4gICAgICAgICAgICBuYW1lID0gXCJObyBVc2VyIFNjcmlwdHMgZGV0ZWN0ZWRcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5hbWUgPSBcIkRldGVjdGVkIFVzZXIgU2NyaXB0c1wiO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKG5hbWUpXG4gICAgICAgICAgICAuc2V0RGVzYyhkZXNjKVxuICAgICAgICAgICAgLmFkZEV4dHJhQnV0dG9uKGV4dHJhID0+IHtcbiAgICAgICAgICAgICAgICBleHRyYS5zZXRJY29uKFwic3luY1wiKVxuICAgICAgICAgICAgICAgICAgICAuc2V0VG9vbHRpcChcIlJlZnJlc2hcIilcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yY2UgcmVmcmVzaFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7ICBcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhZGRfdXNlcl9zeXN0ZW1fY29tbWFuZF9mdW5jdGlvbnNfc2V0dGluZygpIHtcblx0XHRsZXQgZGVzYyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblx0XHRkZXNjLmFwcGVuZChcblx0XHRcdFwiQWxsb3dzIHlvdSB0byBjcmVhdGUgdXNlciBmdW5jdGlvbnMgbGlua2VkIHRvIHN5c3RlbSBjb21tYW5kcy5cIixcblx0XHRcdGRlc2MuY3JlYXRlRWwoXCJiclwiKSxcblx0XHRcdGRlc2MuY3JlYXRlRWwoXCJiXCIsIHtcblx0XHRcdFx0dGV4dDogXCJXYXJuaW5nOiBcIlxuXHRcdFx0fSksXG5cdFx0XHRcIkl0IGNhbiBiZSBkYW5nZXJvdXMgdG8gZXhlY3V0ZSBhcmJpdHJhcnkgc3lzdGVtIGNvbW1hbmRzIGZyb20gdW50cnVzdGVkIHNvdXJjZXMuIE9ubHkgcnVuIHN5c3RlbSBjb21tYW5kcyB0aGF0IHlvdSB1bmRlcnN0YW5kLCBmcm9tIHRydXN0ZWQgc291cmNlcy5cIixcblx0XHQpO1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoMlwiLCB7IHRleHQ6IFwiVXNlciBTeXN0ZW0gQ29tbWFuZCBGdW5jdGlvbnNcIn0pO1xuXG5cdFx0bmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcblx0XHRcdC5zZXROYW1lKFwiRW5hYmxlIFVzZXIgU3lzdGVtIENvbW1hbmQgRnVuY3Rpb25zXCIpXG5cdFx0XHQuc2V0RGVzYyhkZXNjKVxuXHRcdFx0LmFkZFRvZ2dsZSh0b2dnbGUgPT4ge1xuXHRcdFx0XHR0b2dnbGVcblx0XHRcdFx0XHQuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlX3N5c3RlbV9jb21tYW5kcylcblx0XHRcdFx0XHQub25DaGFuZ2UoZW5hYmxlX3N5c3RlbV9jb21tYW5kcyA9PiB7XG5cdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVfc3lzdGVtX2NvbW1hbmRzID0gZW5hYmxlX3N5c3RlbV9jb21tYW5kcztcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNhdmVfc2V0dGluZ3MoKTtcblx0XHRcdFx0XHRcdC8vIEZvcmNlIHJlZnJlc2hcblx0XHRcdFx0XHRcdHRoaXMuZGlzcGxheSgpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cblx0XHRpZiAodGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlX3N5c3RlbV9jb21tYW5kcykge1xuICAgICAgICAgICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcbiAgICAgICAgICAgICAgICAuc2V0TmFtZShcIlRpbWVvdXRcIilcbiAgICAgICAgICAgICAgICAuc2V0RGVzYyhcIk1heGltdW0gdGltZW91dCBpbiBzZWNvbmRzIGZvciBhIHN5c3RlbSBjb21tYW5kLlwiKVxuICAgICAgICAgICAgICAgIC5hZGRUZXh0KHRleHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0LnNldFBsYWNlaG9sZGVyKFwiVGltZW91dFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbW1hbmRfdGltZW91dC50b1N0cmluZygpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKChuZXdfdmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdfdGltZW91dCA9IE51bWJlcihuZXdfdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc05hTihuZXdfdGltZW91dCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nX2Vycm9yKG5ldyBUZW1wbGF0ZXJFcnJvcihcIlRpbWVvdXQgbXVzdCBiZSBhIG51bWJlclwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY29tbWFuZF90aW1lb3V0ID0gbmV3X3RpbWVvdXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZV9zZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KTtcblxuXHRcdFx0ZGVzYyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblx0XHRcdGRlc2MuYXBwZW5kKFxuXHRcdFx0XHRcIkZ1bGwgcGF0aCB0byB0aGUgc2hlbGwgYmluYXJ5IHRvIGV4ZWN1dGUgdGhlIGNvbW1hbmQgd2l0aC5cIixcblx0XHRcdFx0ZGVzYy5jcmVhdGVFbChcImJyXCIpLFxuXHRcdFx0XHRcIlRoaXMgc2V0dGluZyBpcyBvcHRpb25hbCBhbmQgd2lsbCBkZWZhdWx0IHRvIHRoZSBzeXN0ZW0ncyBkZWZhdWx0IHNoZWxsIGlmIG5vdCBzcGVjaWZpZWQuXCIsXG5cdFx0XHRcdGRlc2MuY3JlYXRlRWwoXCJiclwiKSxcblx0XHRcdFx0XCJZb3UgY2FuIHVzZSBmb3J3YXJkIHNsYXNoZXMgKCcvJykgYXMgcGF0aCBzZXBhcmF0b3JzIG9uIGFsbCBwbGF0Zm9ybXMgaWYgaW4gZG91YnQuXCJcblx0XHRcdCk7XG5cdFx0XHRuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKVxuXHRcdFx0XHQuc2V0TmFtZShcIlNoZWxsIGJpbmFyeSBsb2NhdGlvblwiKVxuXHRcdFx0XHQuc2V0RGVzYyhkZXNjKVxuXHRcdFx0XHQuYWRkVGV4dCh0ZXh0ID0+IHtcblx0XHRcdFx0XHR0ZXh0LnNldFBsYWNlaG9sZGVyKFwiRXhhbXBsZTogL2Jpbi9iYXNoLCAuLi5cIilcblx0XHRcdFx0XHRcdC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaGVsbF9wYXRoKVxuXHRcdFx0XHRcdFx0Lm9uQ2hhbmdlKChzaGVsbF9wYXRoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLnNoZWxsX3BhdGggPSBzaGVsbF9wYXRoO1xuXHRcdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zYXZlX3NldHRpbmdzKCk7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0bGV0IGkgPSAxO1xuXHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVzX3BhaXJzLmZvckVhY2goKHRlbXBsYXRlX3BhaXIpID0+IHtcblx0XHRcdFx0Y29uc3QgZGl2ID0gdGhpcy5jb250YWluZXJFbC5jcmVhdGVFbCgnZGl2Jyk7XG5cdFx0XHRcdGRpdi5hZGRDbGFzcyhcInRlbXBsYXRlcl9kaXZcIik7XG5cblx0XHRcdFx0Y29uc3QgdGl0bGUgPSB0aGlzLmNvbnRhaW5lckVsLmNyZWF0ZUVsKCdoNCcsIHtcblx0XHRcdFx0XHR0ZXh0OiAnVXNlciBGdW5jdGlvbiBuwrAnICsgaSxcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHRpdGxlLmFkZENsYXNzKFwidGVtcGxhdGVyX3RpdGxlXCIpO1xuXG5cdFx0XHRcdGNvbnN0IHNldHRpbmcgPSBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKVxuXHRcdFx0XHRcdC5hZGRFeHRyYUJ1dHRvbihleHRyYSA9PiB7XG5cdFx0XHRcdFx0XHRleHRyYS5zZXRJY29uKFwiY3Jvc3NcIilcblx0XHRcdFx0XHRcdFx0LnNldFRvb2x0aXAoXCJEZWxldGVcIilcblx0XHRcdFx0XHRcdFx0Lm9uQ2xpY2soKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IGluZGV4ID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVzX3BhaXJzLmluZGV4T2YodGVtcGxhdGVfcGFpcik7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGluZGV4ID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLnRlbXBsYXRlc19wYWlycy5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gRm9yY2UgcmVmcmVzaFxuXHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2F2ZV9zZXR0aW5ncygpO1xuXHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5kaXNwbGF5KCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmFkZFRleHQodGV4dCA9PiB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHQgPSB0ZXh0LnNldFBsYWNlaG9sZGVyKCdGdW5jdGlvbiBuYW1lJylcblx0XHRcdFx0XHRcdFx0LnNldFZhbHVlKHRlbXBsYXRlX3BhaXJbMF0pXG5cdFx0XHRcdFx0XHRcdC5vbkNoYW5nZSgobmV3X3ZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRlbXBsYXRlX3BhaXIpO1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IGluZGV4ID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVzX3BhaXJzLmluZGV4T2YodGVtcGxhdGVfcGFpcik7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGluZGV4ID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLnRlbXBsYXRlc19wYWlyc1tpbmRleF1bMF0gPSBuZXdfdmFsdWU7XG5cdFx0XHRcdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zYXZlX3NldHRpbmdzKCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0dC5pbnB1dEVsLmFkZENsYXNzKFwidGVtcGxhdGVyX3RlbXBsYXRlXCIpO1xuXG5cdFx0XHRcdFx0XHRcdHJldHVybiB0O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdClcblx0XHRcdFx0XHQuYWRkVGV4dEFyZWEodGV4dCA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCB0ID0gdGV4dC5zZXRQbGFjZWhvbGRlcignU3lzdGVtIENvbW1hbmQnKVxuXHRcdFx0XHRcdFx0LnNldFZhbHVlKHRlbXBsYXRlX3BhaXJbMV0pXG5cdFx0XHRcdFx0XHQub25DaGFuZ2UoKG5ld19jbWQpID0+IHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgaW5kZXggPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZXNfcGFpcnMuaW5kZXhPZih0ZW1wbGF0ZV9wYWlyKTtcblx0XHRcdFx0XHRcdFx0aWYgKGluZGV4ID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZXNfcGFpcnNbaW5kZXhdWzFdID0gbmV3X2NtZDtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zYXZlX3NldHRpbmdzKCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHR0LmlucHV0RWwuc2V0QXR0cihcInJvd3NcIiwgMik7XG5cdFx0XHRcdFx0XHR0LmlucHV0RWwuYWRkQ2xhc3MoXCJ0ZW1wbGF0ZXJfY21kXCIpO1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gdDtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRzZXR0aW5nLmluZm9FbC5yZW1vdmUoKTtcblxuXHRcdFx0XHRkaXYuYXBwZW5kQ2hpbGQodGl0bGUpO1xuXHRcdFx0XHRkaXYuYXBwZW5kQ2hpbGQodGhpcy5jb250YWluZXJFbC5sYXN0Q2hpbGQpO1xuXG5cdFx0XHRcdGkrPTE7XG5cdFx0XHR9KTtcblxuXHRcdFx0Y29uc3QgZGl2ID0gdGhpcy5jb250YWluZXJFbC5jcmVhdGVFbCgnZGl2Jyk7XG5cdFx0XHRkaXYuYWRkQ2xhc3MoXCJ0ZW1wbGF0ZXJfZGl2MlwiKTtcblxuXHRcdFx0Y29uc3Qgc2V0dGluZyA9IG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpXG5cdFx0XHRcdC5hZGRCdXR0b24oYnV0dG9uID0+IHtcblx0XHRcdFx0XHRidXR0b24uc2V0QnV0dG9uVGV4dChcIkFkZCBOZXcgVXNlciBGdW5jdGlvblwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNldEN0YSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVzX3BhaXJzLnB1c2goW1wiXCIsIFwiXCJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3JjZSByZWZyZXNoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHRzZXR0aW5nLmluZm9FbC5yZW1vdmUoKTtcblxuXHRcdFx0ZGl2LmFwcGVuZENoaWxkKHRoaXMuY29udGFpbmVyRWwubGFzdENoaWxkKTtcblx0XHR9XHRcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBBcHAsIEZ1enp5U3VnZ2VzdE1vZGFsLCBURmlsZSwgVEZvbGRlciwgbm9ybWFsaXplUGF0aCwgVmF1bHQsIFRBYnN0cmFjdEZpbGUgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IGdldF90ZmlsZXNfZnJvbV9mb2xkZXIgfSBmcm9tIFwiVXRpbHNcIjtcbmltcG9ydCBUZW1wbGF0ZXJQbHVnaW4gZnJvbSAnLi9tYWluJztcbmltcG9ydCB7IGVycm9yV3JhcHBlclN5bmMgfSBmcm9tICdFcnJvcic7XG5pbXBvcnQgeyBsb2dfZXJyb3IgfSBmcm9tICdMb2cnO1xuXG5leHBvcnQgZW51bSBPcGVuTW9kZSB7XG4gICAgSW5zZXJ0VGVtcGxhdGUsXG4gICAgQ3JlYXRlTm90ZVRlbXBsYXRlLFxufTtcblxuZXhwb3J0IGNsYXNzIEZ1enp5U3VnZ2VzdGVyIGV4dGVuZHMgRnV6enlTdWdnZXN0TW9kYWw8VEZpbGU+IHtcbiAgICBwdWJsaWMgYXBwOiBBcHA7XG4gICAgcHJpdmF0ZSBwbHVnaW46IFRlbXBsYXRlclBsdWdpbjtcbiAgICBwcml2YXRlIG9wZW5fbW9kZTogT3Blbk1vZGU7XG4gICAgcHJpdmF0ZSBjcmVhdGlvbl9mb2xkZXI6IFRGb2xkZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW4pIHtcbiAgICAgICAgc3VwZXIoYXBwKTtcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG4gICAgICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xuICAgICAgICB0aGlzLnNldFBsYWNlaG9sZGVyKFwiVHlwZSBuYW1lIG9mIGEgdGVtcGxhdGUuLi5cIik7XG4gICAgfVxuXG4gICAgZ2V0SXRlbXMoKTogVEZpbGVbXSB7XG4gICAgICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZXNfZm9sZGVyID09PSBcIlwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGZpbGVzID0gZXJyb3JXcmFwcGVyU3luYygoKSA9PiBnZXRfdGZpbGVzX2Zyb21fZm9sZGVyKHRoaXMuYXBwLCB0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZXNfZm9sZGVyKSwgYENvdWxkbid0IHJldHJpZXZlIHRlbXBsYXRlIGZpbGVzIGZyb20gdGVtcGxhdGVzIGZvbGRlciAke3RoaXMucGx1Z2luLnNldHRpbmdzLnRlbXBsYXRlc19mb2xkZXJ9YCk7XG4gICAgICAgIGlmICghZmlsZXMpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmlsZXM7XG4gICAgfVxuXG4gICAgZ2V0SXRlbVRleHQoaXRlbTogVEZpbGUpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gaXRlbS5iYXNlbmFtZTtcbiAgICB9XG5cbiAgICBvbkNob29zZUl0ZW0oaXRlbTogVEZpbGUsIF9ldnQ6IE1vdXNlRXZlbnQgfCBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgICAgIHN3aXRjaCh0aGlzLm9wZW5fbW9kZSkge1xuICAgICAgICAgICAgY2FzZSBPcGVuTW9kZS5JbnNlcnRUZW1wbGF0ZTpcbiAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi50ZW1wbGF0ZXIuYXBwZW5kX3RlbXBsYXRlX3RvX2FjdGl2ZV9maWxlKGl0ZW0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBPcGVuTW9kZS5DcmVhdGVOb3RlVGVtcGxhdGU6XG4gICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4udGVtcGxhdGVyLmNyZWF0ZV9uZXdfbm90ZV9mcm9tX3RlbXBsYXRlKGl0ZW0sIHRoaXMuY3JlYXRpb25fZm9sZGVyKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXJ0KCk6IHZvaWQge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5vcGVuKCk7XG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgbG9nX2Vycm9yKGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW5zZXJ0X3RlbXBsYXRlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLm9wZW5fbW9kZSA9IE9wZW5Nb2RlLkluc2VydFRlbXBsYXRlO1xuICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgfVxuXG4gICAgY3JlYXRlX25ld19ub3RlX2Zyb21fdGVtcGxhdGUoZm9sZGVyPzogVEZvbGRlcik6IHZvaWQge1xuICAgICAgICB0aGlzLmNyZWF0aW9uX2ZvbGRlciA9IGZvbGRlcjtcbiAgICAgICAgdGhpcy5vcGVuX21vZGUgPSBPcGVuTW9kZS5DcmVhdGVOb3RlVGVtcGxhdGU7XG4gICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICB9XG59XG4iLCJleHBvcnQgY29uc3QgVU5TVVBQT1JURURfTU9CSUxFX1RFTVBMQVRFOiBzdHJpbmcgPSBcIkVycm9yX01vYmlsZVVuc3VwcG9ydGVkVGVtcGxhdGVcIjtcbmV4cG9ydCBjb25zdCBJQ09OX0RBVEE6IHN0cmluZyA9IGA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDUxLjEzMjggMjguN1wiPjxwYXRoIGQ9XCJNMCAxNS4xNCAwIDEwLjE1IDE4LjY3IDEuNTEgMTguNjcgNi4wMyA0LjcyIDEyLjMzIDQuNzIgMTIuNzYgMTguNjcgMTkuMjIgMTguNjcgMjMuNzQgMCAxNS4xNFpNMzMuNjkyOCAxLjg0QzMzLjY5MjggMS44NCAzMy45NzYxIDIuMTQ2NyAzNC41NDI4IDIuNzZDMzUuMTA5NCAzLjM4IDM1LjM5MjggNC41NiAzNS4zOTI4IDYuM0MzNS4zOTI4IDguMDQ2NiAzNC44MTk1IDkuNTQgMzMuNjcyOCAxMC43OEMzMi41MjYxIDEyLjAyIDMxLjA5OTUgMTIuNjQgMjkuMzkyOCAxMi42NEMyNy42ODYyIDEyLjY0IDI2LjI2NjEgMTIuMDI2NyAyNS4xMzI4IDEwLjhDMjMuOTkyOCA5LjU3MzMgMjMuNDIyOCA4LjA4NjcgMjMuNDIyOCA2LjM0QzIzLjQyMjggNC42IDIzLjk5OTUgMy4xMDY2IDI1LjE1MjggMS44NkMyNi4yOTk0LjYyIDI3LjcyNjEgMCAyOS40MzI4IDBDMzEuMTM5NSAwIDMyLjU1OTQuNjEzMyAzMy42OTI4IDEuODRNNDkuODIyOC42NyAyOS41MzI4IDI4LjM4IDI0LjQxMjggMjguMzggNDQuNzEyOC42NyA0OS44MjI4LjY3TTMxLjAzMjggOC4zOEMzMS4wMzI4IDguMzggMzEuMTM5NSA4LjI0NjcgMzEuMzUyOCA3Ljk4QzMxLjU2NjIgNy43MDY3IDMxLjY3MjggNy4xNzMzIDMxLjY3MjggNi4zOEMzMS42NzI4IDUuNTg2NyAzMS40NDYxIDQuOTIgMzAuOTkyOCA0LjM4QzMwLjU0NjEgMy44NCAyOS45OTk1IDMuNTcgMjkuMzUyOCAzLjU3QzI4LjcwNjEgMy41NyAyOC4xNjk1IDMuODQgMjcuNzQyOCA0LjM4QzI3LjMyMjggNC45MiAyNy4xMTI4IDUuNTg2NyAyNy4xMTI4IDYuMzhDMjcuMTEyOCA3LjE3MzMgMjcuMzM2MSA3Ljg0IDI3Ljc4MjggOC4zOEMyOC4yMzYxIDguOTI2NyAyOC43ODYxIDkuMiAyOS40MzI4IDkuMkMzMC4wNzk1IDkuMiAzMC42MTI4IDguOTI2NyAzMS4wMzI4IDguMzhNNDkuNDMyOCAxNy45QzQ5LjQzMjggMTcuOSA0OS43MTYxIDE4LjIwNjcgNTAuMjgyOCAxOC44MkM1MC44NDk1IDE5LjQzMzMgNTEuMTMyOCAyMC42MTMzIDUxLjEzMjggMjIuMzZDNTEuMTMyOCAyNC4xIDUwLjU1OTQgMjUuNTkgNDkuNDEyOCAyNi44M0M0OC4yNTk1IDI4LjA3NjYgNDYuODI5NSAyOC43IDQ1LjEyMjggMjguN0M0My40MjI4IDI4LjcgNDIuMDAyOCAyOC4wODMzIDQwLjg2MjggMjYuODVDMzkuNzI5NSAyNS42MjMzIDM5LjE2MjggMjQuMTM2NiAzOS4xNjI4IDIyLjM5QzM5LjE2MjggMjAuNjUgMzkuNzM2MSAxOS4xNiA0MC44ODI4IDE3LjkyQzQyLjAzNjEgMTYuNjczMyA0My40NjI4IDE2LjA1IDQ1LjE2MjggMTYuMDVDNDYuODY5NCAxNi4wNSA0OC4yOTI4IDE2LjY2NjcgNDkuNDMyOCAxNy45TTQ2Ljg1MjggMjQuNTJDNDYuODUyOCAyNC41MiA0Ni45NTk1IDI0LjM4MzMgNDcuMTcyOCAyNC4xMUM0Ny4zNzk1IDIzLjgzNjcgNDcuNDgyOCAyMy4zMDMzIDQ3LjQ4MjggMjIuNTFDNDcuNDgyOCAyMS43MTY3IDQ3LjI1OTUgMjEuMDUgNDYuODEyOCAyMC41MUM0Ni4zNjYxIDE5Ljk3IDQ1LjgxNjIgMTkuNyA0NS4xNjI4IDE5LjdDNDQuNTE2MSAxOS43IDQzLjk4MjggMTkuOTcgNDMuNTYyOCAyMC41MUM0My4xNDI4IDIxLjA1IDQyLjkzMjggMjEuNzE2NyA0Mi45MzI4IDIyLjUxQzQyLjkzMjggMjMuMzAzMyA0My4xNTYxIDIzLjk3MzMgNDMuNjAyOCAyNC41MkM0NC4wNDk0IDI1LjA2IDQ0LjU5NjEgMjUuMzMgNDUuMjQyOCAyNS4zM0M0NS44ODk1IDI1LjMzIDQ2LjQyNjEgMjUuMDYgNDYuODUyOCAyNC41MlpcIiBmaWxsPVwiY3VycmVudENvbG9yXCIvPjwvc3ZnPmA7IiwiaW1wb3J0IFRlbXBsYXRlclBsdWdpbiBmcm9tIFwibWFpblwiO1xuaW1wb3J0IHsgQXBwIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBSdW5uaW5nQ29uZmlnIH0gZnJvbSBcIlRlbXBsYXRlclwiO1xuaW1wb3J0IHsgSUdlbmVyYXRlT2JqZWN0IH0gZnJvbSAnZnVuY3Rpb25zL0lHZW5lcmF0ZU9iamVjdCc7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBJbnRlcm5hbE1vZHVsZSBpbXBsZW1lbnRzIElHZW5lcmF0ZU9iamVjdCB7XG4gICAgcHVibGljIGFic3RyYWN0IG5hbWU6IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgc3RhdGljX2Z1bmN0aW9uczogTWFwPHN0cmluZywgYW55PiA9IG5ldyBNYXAoKTtcbiAgICBwcm90ZWN0ZWQgZHluYW1pY19mdW5jdGlvbnM6IE1hcDxzdHJpbmcsIGFueT4gPSBuZXcgTWFwKCk7XG4gICAgcHJvdGVjdGVkIGNvbmZpZzogUnVubmluZ0NvbmZpZztcbiAgICBwcm90ZWN0ZWQgc3RhdGljX29iamVjdDoge1t4OiBzdHJpbmddOiBhbnl9O1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGFwcDogQXBwLCBwcm90ZWN0ZWQgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW4pIHt9XG5cbiAgICBnZXROYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWU7XG4gICAgfVxuXG4gICAgYWJzdHJhY3QgY3JlYXRlX3N0YXRpY190ZW1wbGF0ZXMoKTogUHJvbWlzZTx2b2lkPjtcbiAgICBhYnN0cmFjdCBjcmVhdGVfZHluYW1pY190ZW1wbGF0ZXMoKTogUHJvbWlzZTx2b2lkPjtcblxuICAgIGFzeW5jIGluaXQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGF3YWl0IHRoaXMuY3JlYXRlX3N0YXRpY190ZW1wbGF0ZXMoKTtcbiAgICAgICAgdGhpcy5zdGF0aWNfb2JqZWN0ID0gT2JqZWN0LmZyb21FbnRyaWVzKHRoaXMuc3RhdGljX2Z1bmN0aW9ucyk7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2VuZXJhdGVfb2JqZWN0KG5ld19jb25maWc6IFJ1bm5pbmdDb25maWcpOiBQcm9taXNlPHtbeDogc3RyaW5nXTogYW55fT4ge1xuICAgICAgICB0aGlzLmNvbmZpZyA9IG5ld19jb25maWc7XG4gICAgICAgIGF3YWl0IHRoaXMuY3JlYXRlX2R5bmFtaWNfdGVtcGxhdGVzKCk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLnRoaXMuc3RhdGljX29iamVjdCxcbiAgICAgICAgICAgIC4uLk9iamVjdC5mcm9tRW50cmllcyh0aGlzLmR5bmFtaWNfZnVuY3Rpb25zKSxcbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBUZW1wbGF0ZXJFcnJvciB9IGZyb20gXCJFcnJvclwiO1xuaW1wb3J0IHsgSW50ZXJuYWxNb2R1bGUgfSBmcm9tIFwiLi4vSW50ZXJuYWxNb2R1bGVcIjtcblxuZXhwb3J0IGNsYXNzIEludGVybmFsTW9kdWxlRGF0ZSBleHRlbmRzIEludGVybmFsTW9kdWxlIHtcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nID0gXCJkYXRlXCI7XG5cbiAgICBhc3luYyBjcmVhdGVfc3RhdGljX3RlbXBsYXRlcygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdGhpcy5zdGF0aWNfZnVuY3Rpb25zLnNldChcIm5vd1wiLCB0aGlzLmdlbmVyYXRlX25vdygpKTtcbiAgICAgICAgdGhpcy5zdGF0aWNfZnVuY3Rpb25zLnNldChcInRvbW9ycm93XCIsIHRoaXMuZ2VuZXJhdGVfdG9tb3Jyb3coKSk7XG4gICAgICAgIHRoaXMuc3RhdGljX2Z1bmN0aW9ucy5zZXQoXCJ3ZWVrZGF5XCIsIHRoaXMuZ2VuZXJhdGVfd2Vla2RheSgpKTtcbiAgICAgICAgdGhpcy5zdGF0aWNfZnVuY3Rpb25zLnNldChcInllc3RlcmRheVwiLCB0aGlzLmdlbmVyYXRlX3llc3RlcmRheSgpKTtcbiAgICB9XG5cbiAgICBhc3luYyBjcmVhdGVfZHluYW1pY190ZW1wbGF0ZXMoKTogUHJvbWlzZTx2b2lkPiB7fVxuXG4gICAgZ2VuZXJhdGVfbm93KCk6IEZ1bmN0aW9uIHtcbiAgICAgICAgcmV0dXJuIChmb3JtYXQ6IHN0cmluZyA9IFwiWVlZWS1NTS1ERFwiLCBvZmZzZXQ/OiBudW1iZXJ8c3RyaW5nLCByZWZlcmVuY2U/OiBzdHJpbmcsIHJlZmVyZW5jZV9mb3JtYXQ/OiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGlmIChyZWZlcmVuY2UgJiYgIXdpbmRvdy5tb21lbnQocmVmZXJlbmNlLCByZWZlcmVuY2VfZm9ybWF0KS5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVGVtcGxhdGVyRXJyb3IoXCJJbnZhbGlkIHJlZmVyZW5jZSBkYXRlIGZvcm1hdCwgdHJ5IHNwZWNpZnlpbmcgb25lIHdpdGggdGhlIGFyZ3VtZW50ICdyZWZlcmVuY2VfZm9ybWF0J1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBkdXJhdGlvbjtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb2Zmc2V0ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb24gPSB3aW5kb3cubW9tZW50LmR1cmF0aW9uKG9mZnNldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2Ygb2Zmc2V0ID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb24gPSB3aW5kb3cubW9tZW50LmR1cmF0aW9uKG9mZnNldCwgXCJkYXlzXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gd2luZG93Lm1vbWVudChyZWZlcmVuY2UsIHJlZmVyZW5jZV9mb3JtYXQpLmFkZChkdXJhdGlvbikuZm9ybWF0KGZvcm1hdCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZW5lcmF0ZV90b21vcnJvdygpOiBGdW5jdGlvbiB7XG4gICAgICAgIHJldHVybiAoZm9ybWF0OiBzdHJpbmcgPSBcIllZWVktTU0tRERcIikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5tb21lbnQoKS5hZGQoMSwgJ2RheXMnKS5mb3JtYXQoZm9ybWF0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRlX3dlZWtkYXkoKTogRnVuY3Rpb24ge1xuICAgICAgICByZXR1cm4gKGZvcm1hdDogc3RyaW5nID0gXCJZWVlZLU1NLUREXCIsIHdlZWtkYXk6IG51bWJlciwgcmVmZXJlbmNlPzogc3RyaW5nLCByZWZlcmVuY2VfZm9ybWF0Pzogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVmZXJlbmNlICYmICF3aW5kb3cubW9tZW50KHJlZmVyZW5jZSwgcmVmZXJlbmNlX2Zvcm1hdCkuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFRlbXBsYXRlckVycm9yKFwiSW52YWxpZCByZWZlcmVuY2UgZGF0ZSBmb3JtYXQsIHRyeSBzcGVjaWZ5aW5nIG9uZSB3aXRoIHRoZSBhcmd1bWVudCAncmVmZXJlbmNlX2Zvcm1hdCdcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gd2luZG93Lm1vbWVudChyZWZlcmVuY2UsIHJlZmVyZW5jZV9mb3JtYXQpLndlZWtkYXkod2Vla2RheSkuZm9ybWF0KGZvcm1hdCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZW5lcmF0ZV95ZXN0ZXJkYXkoKTogRnVuY3Rpb24ge1xuICAgICAgICByZXR1cm4gKGZvcm1hdDogc3RyaW5nID0gXCJZWVlZLU1NLUREXCIpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cubW9tZW50KCkuYWRkKC0xLCAnZGF5cycpLmZvcm1hdChmb3JtYXQpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSW50ZXJuYWxNb2R1bGUgfSBmcm9tIFwiLi4vSW50ZXJuYWxNb2R1bGVcIjtcblxuaW1wb3J0IHsgRmlsZVN5c3RlbUFkYXB0ZXIsIGdldEFsbFRhZ3MsIE1hcmtkb3duVmlldywgbm9ybWFsaXplUGF0aCwgcGFyc2VMaW5rdGV4dCwgUGxhdGZvcm0sIHJlc29sdmVTdWJwYXRoLCBURmlsZSwgVEZvbGRlciB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgVU5TVVBQT1JURURfTU9CSUxFX1RFTVBMQVRFIH0gZnJvbSBcIkNvbnN0YW50c1wiO1xuaW1wb3J0IHsgVGVtcGxhdGVyRXJyb3IgfSBmcm9tIFwiRXJyb3JcIjtcbmltcG9ydCB7IEZ1bmN0aW9uc01vZGUgfSBmcm9tICdmdW5jdGlvbnMvRnVuY3Rpb25zR2VuZXJhdG9yJztcblxuZXhwb3J0IGNvbnN0IERFUFRIX0xJTUlUID0gMTA7XG5cbmV4cG9ydCBjbGFzcyBJbnRlcm5hbE1vZHVsZUZpbGUgZXh0ZW5kcyBJbnRlcm5hbE1vZHVsZSB7XG4gICAgcHVibGljIG5hbWU6IHN0cmluZyA9IFwiZmlsZVwiO1xuICAgIHByaXZhdGUgaW5jbHVkZV9kZXB0aDogbnVtYmVyID0gMDtcbiAgICBwcml2YXRlIGNyZWF0ZV9uZXdfZGVwdGg6IG51bWJlciA9IDA7XG4gICAgcHJpdmF0ZSBsaW5rcGF0aF9yZWdleDogUmVnRXhwID0gbmV3IFJlZ0V4cChcIl5cXFxcW1xcXFxbKC4qKVxcXFxdXFxcXF0kXCIpO1xuXG4gICAgYXN5bmMgY3JlYXRlX3N0YXRpY190ZW1wbGF0ZXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRoaXMuc3RhdGljX2Z1bmN0aW9ucy5zZXQoXCJjcmVhdGlvbl9kYXRlXCIsIHRoaXMuZ2VuZXJhdGVfY3JlYXRpb25fZGF0ZSgpKTtcbiAgICAgICAgdGhpcy5zdGF0aWNfZnVuY3Rpb25zLnNldChcImNyZWF0ZV9uZXdcIiwgdGhpcy5nZW5lcmF0ZV9jcmVhdGVfbmV3KCkpO1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwiY3Vyc29yXCIsIHRoaXMuZ2VuZXJhdGVfY3Vyc29yKCkpO1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwiY3Vyc29yX2FwcGVuZFwiLCB0aGlzLmdlbmVyYXRlX2N1cnNvcl9hcHBlbmQoKSk7XG4gICAgICAgIHRoaXMuc3RhdGljX2Z1bmN0aW9ucy5zZXQoXCJleGlzdHNcIiwgdGhpcy5nZW5lcmF0ZV9leGlzdHMoKSk7XG4gICAgICAgIHRoaXMuc3RhdGljX2Z1bmN0aW9ucy5zZXQoXCJmaW5kX3RmaWxlXCIsIHRoaXMuZ2VuZXJhdGVfZmluZF90ZmlsZSgpKTtcbiAgICAgICAgdGhpcy5zdGF0aWNfZnVuY3Rpb25zLnNldChcImZvbGRlclwiLCB0aGlzLmdlbmVyYXRlX2ZvbGRlcigpKTtcbiAgICAgICAgdGhpcy5zdGF0aWNfZnVuY3Rpb25zLnNldChcImluY2x1ZGVcIiwgdGhpcy5nZW5lcmF0ZV9pbmNsdWRlKCkpO1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwibGFzdF9tb2RpZmllZF9kYXRlXCIsIHRoaXMuZ2VuZXJhdGVfbGFzdF9tb2RpZmllZF9kYXRlKCkpO1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwibW92ZVwiLCB0aGlzLmdlbmVyYXRlX21vdmUoKSk7XG4gICAgICAgIHRoaXMuc3RhdGljX2Z1bmN0aW9ucy5zZXQoXCJwYXRoXCIsIHRoaXMuZ2VuZXJhdGVfcGF0aCgpKTtcbiAgICAgICAgdGhpcy5zdGF0aWNfZnVuY3Rpb25zLnNldChcInJlbmFtZVwiLCB0aGlzLmdlbmVyYXRlX3JlbmFtZSgpKTtcbiAgICAgICAgdGhpcy5zdGF0aWNfZnVuY3Rpb25zLnNldChcInNlbGVjdGlvblwiLCB0aGlzLmdlbmVyYXRlX3NlbGVjdGlvbigpKTtcbiAgICB9XG5cbiAgICBhc3luYyBjcmVhdGVfZHluYW1pY190ZW1wbGF0ZXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRoaXMuZHluYW1pY19mdW5jdGlvbnMuc2V0KFwiY29udGVudFwiLCBhd2FpdCB0aGlzLmdlbmVyYXRlX2NvbnRlbnQoKSk7XG4gICAgICAgIHRoaXMuZHluYW1pY19mdW5jdGlvbnMuc2V0KFwidGFnc1wiLCB0aGlzLmdlbmVyYXRlX3RhZ3MoKSk7XG4gICAgICAgIHRoaXMuZHluYW1pY19mdW5jdGlvbnMuc2V0KFwidGl0bGVcIiwgdGhpcy5nZW5lcmF0ZV90aXRsZSgpKTtcbiAgICB9IFxuXG4gICAgYXN5bmMgZ2VuZXJhdGVfY29udGVudCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZCh0aGlzLmNvbmZpZy50YXJnZXRfZmlsZSk7XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfY3JlYXRlX25ldygpOiBGdW5jdGlvbiB7XG4gICAgICAgIHJldHVybiBhc3luYyAodGVtcGxhdGU6IFRGaWxlIHwgc3RyaW5nLCBmaWxlbmFtZT86IHN0cmluZywgb3Blbl9uZXc6IGJvb2xlYW4gPSBmYWxzZSwgZm9sZGVyPzogVEZvbGRlcikgPT4ge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVfbmV3X2RlcHRoICs9IDE7XG4gICAgICAgICAgICBpZiAodGhpcy5jcmVhdGVfbmV3X2RlcHRoID4gREVQVEhfTElNSVQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZV9uZXdfZGVwdGggPSAwO1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUZW1wbGF0ZXJFcnJvcihcIlJlYWNoZWQgY3JlYXRlX25ldyBkZXB0aCBsaW1pdCAobWF4ID0gMTApXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBuZXdfZmlsZSA9IGF3YWl0IHRoaXMucGx1Z2luLnRlbXBsYXRlci5jcmVhdGVfbmV3X25vdGVfZnJvbV90ZW1wbGF0ZSh0ZW1wbGF0ZSwgZm9sZGVyLCBmaWxlbmFtZSwgb3Blbl9uZXcpXG5cbiAgICAgICAgICAgIHRoaXMuY3JlYXRlX25ld19kZXB0aCAtPSAxO1xuXG4gICAgICAgICAgICByZXR1cm4gbmV3X2ZpbGU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZW5lcmF0ZV9jcmVhdGlvbl9kYXRlKCk6IEZ1bmN0aW9uIHtcbiAgICAgICAgcmV0dXJuIChmb3JtYXQ6IHN0cmluZyA9IFwiWVlZWS1NTS1ERCBISDptbVwiKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gd2luZG93Lm1vbWVudCh0aGlzLmNvbmZpZy50YXJnZXRfZmlsZS5zdGF0LmN0aW1lKS5mb3JtYXQoZm9ybWF0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRlX2N1cnNvcigpOiBGdW5jdGlvbiB7XG4gICAgICAgIHJldHVybiAob3JkZXI/OiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgIC8vIEhhY2sgdG8gcHJldmVudCBlbXB0eSBvdXRwdXRcbiAgICAgICAgICAgIHJldHVybiBgPCUgdHAuZmlsZS5jdXJzb3IoJHtvcmRlciA/PyAnJ30pICU+YDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRlX2N1cnNvcl9hcHBlbmQoKTogRnVuY3Rpb24ge1xuICAgICAgICByZXR1cm4gKGNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICBjb25zdCBhY3RpdmVfdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgICAgICAgICBpZiAoYWN0aXZlX3ZpZXcgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5sb2dfZXJyb3IobmV3IFRlbXBsYXRlckVycm9yKFwiTm8gYWN0aXZlIHZpZXcsIGNhbid0IGFwcGVuZCB0byBjdXJzb3IuXCIpKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGVkaXRvciA9IGFjdGl2ZV92aWV3LmVkaXRvcjtcbiAgICAgICAgICAgIGNvbnN0IGRvYyA9IGVkaXRvci5nZXREb2MoKTtcbiAgICAgICAgICAgIGRvYy5yZXBsYWNlU2VsZWN0aW9uKGNvbnRlbnQpO1xuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZW5lcmF0ZV9leGlzdHMoKTogRnVuY3Rpb24ge1xuICAgICAgICByZXR1cm4gKGZpbGVuYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIC8vIFRPRE86IFJlbW92ZSB0aGlzLCBvbmx5IGhlcmUgdG8gc3VwcG9ydCB0aGUgb2xkIHdheVxuICAgICAgICAgICAgbGV0IG1hdGNoO1xuICAgICAgICAgICAgaWYgKChtYXRjaCA9IHRoaXMubGlua3BhdGhfcmVnZXguZXhlYyhmaWxlbmFtZSkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZmlsZW5hbWUgPSBtYXRjaFsxXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Rmlyc3RMaW5rcGF0aERlc3QoZmlsZW5hbWUsIFwiXCIpO1xuICAgICAgICAgICAgcmV0dXJuIGZpbGUgIT0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRlX2ZpbmRfdGZpbGUoKTogRnVuY3Rpb24ge1xuICAgICAgICByZXR1cm4gKGZpbGVuYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBhdGggPSBub3JtYWxpemVQYXRoKGZpbGVuYW1lKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldEZpcnN0TGlua3BhdGhEZXN0KHBhdGgsIFwiXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfZm9sZGVyKCk6IEZ1bmN0aW9uIHtcbiAgICAgICAgcmV0dXJuIChyZWxhdGl2ZTogYm9vbGVhbiA9IGZhbHNlKSA9PiB7XG4gICAgICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy5jb25maWcudGFyZ2V0X2ZpbGUucGFyZW50O1xuICAgICAgICAgICAgbGV0IGZvbGRlcjtcblxuICAgICAgICAgICAgaWYgKHJlbGF0aXZlKSB7XG4gICAgICAgICAgICAgICAgZm9sZGVyID0gcGFyZW50LnBhdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb2xkZXIgPSBwYXJlbnQubmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGZvbGRlcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRlX2luY2x1ZGUoKTogRnVuY3Rpb24ge1xuICAgICAgICByZXR1cm4gYXN5bmMgKGluY2x1ZGVfbGluazogc3RyaW5nIHwgVEZpbGUpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdERVBUSCcsIHRoaXMuaW5jbHVkZV9kZXB0aCk7XG4gICAgICAgICAgICAvLyBUT0RPOiBBZGQgbXV0ZXggZm9yIHRoaXMsIHRoaXMgbWF5IGN1cnJlbnRseSBsZWFkIHRvIGEgcmFjZSBjb25kaXRpb24uIFxuICAgICAgICAgICAgLy8gV2hpbGUgbm90IHZlcnkgaW1wYWN0ZnVsLCB0aGF0IGNvdWxkIHN0aWxsIGJlIGFubm95aW5nLlxuICAgICAgICAgICAgdGhpcy5pbmNsdWRlX2RlcHRoICs9IDE7XG4gICAgICAgICAgICBpZiAodGhpcy5pbmNsdWRlX2RlcHRoID4gREVQVEhfTElNSVQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluY2x1ZGVfZGVwdGggLT0gMTtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVGVtcGxhdGVyRXJyb3IoXCJSZWFjaGVkIGluY2x1c2lvbiBkZXB0aCBsaW1pdCAobWF4ID0gMTApXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgaW5jX2ZpbGVfY29udGVudDogc3RyaW5nO1xuXG4gICAgICAgICAgICBpZiAoaW5jbHVkZV9saW5rIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICAgICAgICAgICAgICBpbmNfZmlsZV9jb250ZW50ID0gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZChpbmNsdWRlX2xpbmspO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgbWF0Y2g7XG4gICAgICAgICAgICAgICAgaWYgKChtYXRjaCA9IHRoaXMubGlua3BhdGhfcmVnZXguZXhlYyhpbmNsdWRlX2xpbmspKSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmluY2x1ZGVfZGVwdGggLT0gMTtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFRlbXBsYXRlckVycm9yKFwiSW52YWxpZCBmaWxlIGZvcm1hdCwgcHJvdmlkZSBhbiBvYnNpZGlhbiBsaW5rIGJldHdlZW4gcXVvdGVzLlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3Qge3BhdGgsIHN1YnBhdGh9ID0gcGFyc2VMaW5rdGV4dChtYXRjaFsxXSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBpbmNfZmlsZSA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Rmlyc3RMaW5rcGF0aERlc3QocGF0aCwgXCJcIik7XG4gICAgICAgICAgICAgICAgaWYgKCFpbmNfZmlsZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmluY2x1ZGVfZGVwdGggLT0gMTtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFRlbXBsYXRlckVycm9yKGBGaWxlICR7aW5jbHVkZV9saW5rfSBkb2Vzbid0IGV4aXN0YCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGluY19maWxlX2NvbnRlbnQgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5yZWFkKGluY19maWxlKTtcblxuICAgICAgICAgICAgICAgIGlmIChzdWJwYXRoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhY2hlID0gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUoaW5jX2ZpbGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2FjaGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHJlc29sdmVTdWJwYXRoKGNhY2hlLCBzdWJwYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNfZmlsZV9jb250ZW50ID0gaW5jX2ZpbGVfY29udGVudC5zbGljZShyZXN1bHQuc3RhcnQub2Zmc2V0LCByZXN1bHQuZW5kPy5vZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWRfY29udGVudCA9IGF3YWl0IHRoaXMucGx1Z2luLnRlbXBsYXRlci5wYXJzZXIucGFyc2VfY29tbWFuZHMoaW5jX2ZpbGVfY29udGVudCwgdGhpcy5wbHVnaW4udGVtcGxhdGVyLmN1cnJlbnRfZnVuY3Rpb25zX29iamVjdCk7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmNsdWRlX2RlcHRoIC09IDE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlZF9jb250ZW50O1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5jbHVkZV9kZXB0aCAtPSAxO1xuICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9IFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfbGFzdF9tb2RpZmllZF9kYXRlKCk6IEZ1bmN0aW9uIHtcbiAgICAgICAgcmV0dXJuIChmb3JtYXQ6IHN0cmluZyA9IFwiWVlZWS1NTS1ERCBISDptbVwiKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cubW9tZW50KHRoaXMuY29uZmlnLnRhcmdldF9maWxlLnN0YXQubXRpbWUpLmZvcm1hdChmb3JtYXQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfbW92ZSgpOiBGdW5jdGlvbiB7XG4gICAgICAgIHJldHVybiBhc3luYyAocGF0aDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZXdfcGF0aCA9IG5vcm1hbGl6ZVBhdGgoYCR7cGF0aH0uJHt0aGlzLmNvbmZpZy50YXJnZXRfZmlsZS5leHRlbnNpb259YCk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmFwcC5maWxlTWFuYWdlci5yZW5hbWVGaWxlKHRoaXMuY29uZmlnLnRhcmdldF9maWxlLCBuZXdfcGF0aCk7XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRlX3BhdGgoKTogRnVuY3Rpb24ge1xuICAgICAgICByZXR1cm4gKHJlbGF0aXZlOiBib29sZWFuID0gZmFsc2UpID0+IHtcbiAgICAgICAgICAgIC8vIFRPRE86IEFkZCBtb2JpbGUgc3VwcG9ydFxuICAgICAgICAgICAgaWYgKFBsYXRmb3JtLmlzTW9iaWxlQXBwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFVOU1VQUE9SVEVEX01PQklMRV9URU1QTEFURTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghKHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIgaW5zdGFuY2VvZiBGaWxlU3lzdGVtQWRhcHRlcikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVGVtcGxhdGVyRXJyb3IoXCJhcHAudmF1bHQgaXMgbm90IGEgRmlsZVN5c3RlbUFkYXB0ZXIgaW5zdGFuY2VcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB2YXVsdF9wYXRoID0gdGhpcy5hcHAudmF1bHQuYWRhcHRlci5nZXRCYXNlUGF0aCgpO1xuXG4gICAgICAgICAgICBpZiAocmVsYXRpdmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb25maWcudGFyZ2V0X2ZpbGUucGF0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBgJHt2YXVsdF9wYXRofS8ke3RoaXMuY29uZmlnLnRhcmdldF9maWxlLnBhdGh9YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRlX3JlbmFtZSgpOiBGdW5jdGlvbiB7XG4gICAgICAgIHJldHVybiBhc3luYyAobmV3X3RpdGxlOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGlmIChuZXdfdGl0bGUubWF0Y2goL1tcXFxcXFwvOl0rL2cpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFRlbXBsYXRlckVycm9yKFwiRmlsZSBuYW1lIGNhbm5vdCBjb250YWluIGFueSBvZiB0aGVzZSBjaGFyYWN0ZXJzOiBcXFxcIC8gOlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG5ld19wYXRoID0gbm9ybWFsaXplUGF0aChgJHt0aGlzLmNvbmZpZy50YXJnZXRfZmlsZS5wYXJlbnQucGF0aH0vJHtuZXdfdGl0bGV9LiR7dGhpcy5jb25maWcudGFyZ2V0X2ZpbGUuZXh0ZW5zaW9ufWApO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5hcHAuZmlsZU1hbmFnZXIucmVuYW1lRmlsZSh0aGlzLmNvbmZpZy50YXJnZXRfZmlsZSwgbmV3X3BhdGgpO1xuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZW5lcmF0ZV9zZWxlY3Rpb24oKTogRnVuY3Rpb24ge1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYWN0aXZlX3ZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgICAgICAgICAgaWYgKGFjdGl2ZV92aWV3ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVGVtcGxhdGVyRXJyb3IoXCJBY3RpdmUgdmlldyBpcyBudWxsLCBjYW4ndCByZWFkIHNlbGVjdGlvbi5cIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGVkaXRvciA9IGFjdGl2ZV92aWV3LmVkaXRvcjtcbiAgICAgICAgICAgIHJldHVybiBlZGl0b3IuZ2V0U2VsZWN0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUT0RPOiBUdXJuIHRoaXMgaW50byBhIGZ1bmN0aW9uXG4gICAgZ2VuZXJhdGVfdGFncygpOiBzdHJpbmdbXSB7XG4gICAgICAgIGNvbnN0IGNhY2hlID0gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUodGhpcy5jb25maWcudGFyZ2V0X2ZpbGUpO1xuICAgICAgICByZXR1cm4gZ2V0QWxsVGFncyhjYWNoZSk7XG4gICAgfVxuXG4gICAgLy8gVE9ETzogVHVybiB0aGlzIGludG8gYSBmdW5jdGlvblxuICAgIGdlbmVyYXRlX3RpdGxlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy50YXJnZXRfZmlsZS5iYXNlbmFtZTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBUZW1wbGF0ZXJFcnJvciB9IGZyb20gXCJFcnJvclwiO1xuaW1wb3J0IHsgSW50ZXJuYWxNb2R1bGUgfSBmcm9tIFwiLi4vSW50ZXJuYWxNb2R1bGVcIjtcblxuZXhwb3J0IGNsYXNzIEludGVybmFsTW9kdWxlV2ViIGV4dGVuZHMgSW50ZXJuYWxNb2R1bGUge1xuICAgIG5hbWUgPSBcIndlYlwiO1xuXG4gICAgYXN5bmMgY3JlYXRlX3N0YXRpY190ZW1wbGF0ZXMoKSB7XG4gICAgICAgIHRoaXMuc3RhdGljX2Z1bmN0aW9ucy5zZXQoXCJkYWlseV9xdW90ZVwiLCB0aGlzLmdlbmVyYXRlX2RhaWx5X3F1b3RlKCkpO1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwicmFuZG9tX3BpY3R1cmVcIiwgdGhpcy5nZW5lcmF0ZV9yYW5kb21fcGljdHVyZSgpKTtcbiAgICB9XG4gICAgXG4gICAgYXN5bmMgY3JlYXRlX2R5bmFtaWNfdGVtcGxhdGVzKCkge31cblxuICAgIGFzeW5jIGdldFJlcXVlc3QodXJsOiBzdHJpbmcpOiBQcm9taXNlPFJlc3BvbnNlPiB7XG4gICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCk7XG4gICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUZW1wbGF0ZXJFcnJvcihcIkVycm9yIHBlcmZvcm1pbmcgR0VUIHJlcXVlc3RcIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH1cblxuICAgIGdlbmVyYXRlX2RhaWx5X3F1b3RlKCkge1xuICAgICAgICByZXR1cm4gYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5nZXRSZXF1ZXN0KFwiaHR0cHM6Ly9xdW90ZXMucmVzdC9xb2RcIik7XG4gICAgICAgICAgICBsZXQganNvbiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcblxuICAgICAgICAgICAgbGV0IGF1dGhvciA9IGpzb24uY29udGVudHMucXVvdGVzWzBdLmF1dGhvcjtcbiAgICAgICAgICAgIGxldCBxdW90ZSA9IGpzb24uY29udGVudHMucXVvdGVzWzBdLnF1b3RlO1xuICAgICAgICAgICAgbGV0IG5ld19jb250ZW50ID0gYD4gJHtxdW90ZX1cXG4+ICZtZGFzaDsgPGNpdGU+JHthdXRob3J9PC9jaXRlPmA7XG5cbiAgICAgICAgICAgIHJldHVybiBuZXdfY29udGVudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRlX3JhbmRvbV9waWN0dXJlKCkge1xuICAgICAgICByZXR1cm4gYXN5bmMgKHNpemU6IHN0cmluZywgcXVlcnk/OiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IHRoaXMuZ2V0UmVxdWVzdChgaHR0cHM6Ly9zb3VyY2UudW5zcGxhc2guY29tL3JhbmRvbS8ke3NpemUgPz8gJyd9PyR7cXVlcnkgPz8gJyd9YCk7XG4gICAgICAgICAgICBsZXQgdXJsID0gcmVzcG9uc2UudXJsO1xuICAgICAgICAgICAgcmV0dXJuIGAhW3RwLndlYi5yYW5kb21fcGljdHVyZV0oJHt1cmx9KWA7ICAgXG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJbnRlcm5hbE1vZHVsZSB9IGZyb20gXCIuLi9JbnRlcm5hbE1vZHVsZVwiO1xuXG5leHBvcnQgY2xhc3MgSW50ZXJuYWxNb2R1bGVGcm9udG1hdHRlciBleHRlbmRzIEludGVybmFsTW9kdWxlIHtcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nID0gXCJmcm9udG1hdHRlclwiO1xuXG4gICAgYXN5bmMgY3JlYXRlX3N0YXRpY190ZW1wbGF0ZXMoKTogUHJvbWlzZTx2b2lkPiB7fVxuXG4gICAgYXN5bmMgY3JlYXRlX2R5bmFtaWNfdGVtcGxhdGVzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBjb25zdCBjYWNoZSA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKHRoaXMuY29uZmlnLnRhcmdldF9maWxlKVxuICAgICAgICB0aGlzLmR5bmFtaWNfZnVuY3Rpb25zID0gbmV3IE1hcChPYmplY3QuZW50cmllcyhjYWNoZT8uZnJvbnRtYXR0ZXIgfHwge30pKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBUZW1wbGF0ZXJFcnJvciB9IGZyb20gXCJFcnJvclwiO1xuaW1wb3J0IHsgQXBwLCBNb2RhbCB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5leHBvcnQgY2xhc3MgUHJvbXB0TW9kYWwgZXh0ZW5kcyBNb2RhbCB7XG4gICAgcHJpdmF0ZSBwcm9tcHRFbDogSFRNTElucHV0RWxlbWVudDtcbiAgICBwcml2YXRlIHJlc29sdmU6ICh2YWx1ZTogc3RyaW5nKSA9PiB2b2lkO1xuICAgIHByaXZhdGUgcmVqZWN0OiAocmVhc29uPzogYW55KSA9PiB2b2lkO1xuICAgIHByaXZhdGUgc3VibWl0dGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcHJpdmF0ZSBwcm9tcHRfdGV4dDogc3RyaW5nLCBwcml2YXRlIGRlZmF1bHRfdmFsdWU6IHN0cmluZykge1xuICAgICAgICBzdXBlcihhcHApO1xuICAgIH1cblxuICAgIG9uT3BlbigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy50aXRsZUVsLnNldFRleHQodGhpcy5wcm9tcHRfdGV4dCk7XG4gICAgICAgIHRoaXMuY3JlYXRlRm9ybSgpO1xuICAgIH1cblxuICAgIG9uQ2xvc2UoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY29udGVudEVsLmVtcHR5KCk7XG4gICAgICAgIGlmICghdGhpcy5zdWJtaXR0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVqZWN0KG5ldyBUZW1wbGF0ZXJFcnJvcihcIkNhbmNlbGxlZCBwcm9tcHRcIikpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlRm9ybSgpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGl2ID0gdGhpcy5jb250ZW50RWwuY3JlYXRlRGl2KCk7XG4gICAgICAgIGRpdi5hZGRDbGFzcyhcInRlbXBsYXRlci1wcm9tcHQtZGl2XCIpO1xuXG4gICAgICAgIGNvbnN0IGZvcm0gPSBkaXYuY3JlYXRlRWwoXCJmb3JtXCIpO1xuICAgICAgICBmb3JtLmFkZENsYXNzKFwidGVtcGxhdGVyLXByb21wdC1mb3JtXCIpO1xuICAgICAgICBmb3JtLnR5cGUgPSBcInN1Ym1pdFwiO1xuICAgICAgICBmb3JtLm9uc3VibWl0ID0gKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnN1Ym1pdHRlZCA9IHRydWU7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLnJlc29sdmUodGhpcy5wcm9tcHRFbC52YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnByb21wdEVsID0gZm9ybS5jcmVhdGVFbChcImlucHV0XCIpO1xuICAgICAgICB0aGlzLnByb21wdEVsLnR5cGUgPSBcInRleHRcIjtcbiAgICAgICAgdGhpcy5wcm9tcHRFbC5wbGFjZWhvbGRlciA9IFwiVHlwZSB0ZXh0IGhlcmUuLi5cIjtcbiAgICAgICAgdGhpcy5wcm9tcHRFbC52YWx1ZSA9IHRoaXMuZGVmYXVsdF92YWx1ZSA/PyBcIlwiO1xuICAgICAgICB0aGlzLnByb21wdEVsLmFkZENsYXNzKFwidGVtcGxhdGVyLXByb21wdC1pbnB1dFwiKVxuICAgICAgICB0aGlzLnByb21wdEVsLnNlbGVjdCgpO1xuICAgIH1cblxuICAgIGFzeW5jIG9wZW5BbmRHZXRWYWx1ZShyZXNvbHZlOiAodmFsdWU6IHN0cmluZykgPT4gdm9pZCwgcmVqZWN0OiAocmVhc29uPzogYW55KSA9PiB2b2lkKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRoaXMucmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICAgIHRoaXMucmVqZWN0ID0gcmVqZWN0O1xuICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgVGVtcGxhdGVyRXJyb3IgfSBmcm9tIFwiRXJyb3JcIjtcbmltcG9ydCB7IEFwcCwgRnV6enlNYXRjaCwgRnV6enlTdWdnZXN0TW9kYWwgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuXG5leHBvcnQgY2xhc3MgU3VnZ2VzdGVyTW9kYWw8VD4gZXh0ZW5kcyBGdXp6eVN1Z2dlc3RNb2RhbDxUPiB7XG4gICAgcHJpdmF0ZSByZXNvbHZlOiAodmFsdWU6IFQpID0+IHZvaWQ7XG4gICAgcHJpdmF0ZSByZWplY3Q6IChyZWFzb24/OiBhbnkpID0+IHZvaWQ7XG4gICAgcHJpdmF0ZSBzdWJtaXR0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwcml2YXRlIHRleHRfaXRlbXM6IHN0cmluZ1tdIHwgKChpdGVtOiBUKSA9PiBzdHJpbmcpLCBwcml2YXRlIGl0ZW1zOiBUW10sIHBsYWNlaG9sZGVyOiBzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIoYXBwKTtcbiAgICAgICAgdGhpcy5zZXRQbGFjZWhvbGRlcihwbGFjZWhvbGRlcik7XG4gICAgfVxuXG4gICAgZ2V0SXRlbXMoKTogVFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXRlbXM7XG4gICAgfVxuICAgIFxuICAgIG9uQ2xvc2UoKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5zdWJtaXR0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVqZWN0KG5ldyBUZW1wbGF0ZXJFcnJvcihcIkNhbmNlbGxlZCBwcm9tcHRcIikpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2VsZWN0U3VnZ2VzdGlvbih2YWx1ZTogRnV6enlNYXRjaDxUPiwgZXZ0OiBNb3VzZUV2ZW50IHwgS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgICAgICB0aGlzLnN1Ym1pdHRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgdGhpcy5vbkNob29zZVN1Z2dlc3Rpb24odmFsdWUsIGV2dCk7XG4gICAgfVxuXG4gICAgZ2V0SXRlbVRleHQoaXRlbTogVCk6IHN0cmluZyB7XG4gICAgICAgIGlmICh0aGlzLnRleHRfaXRlbXMgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudGV4dF9pdGVtcyhpdGVtKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy50ZXh0X2l0ZW1zW3RoaXMuaXRlbXMuaW5kZXhPZihpdGVtKV0gfHwgXCJVbmRlZmluZWQgVGV4dCBJdGVtXCI7XG4gICAgfVxuXG4gICAgb25DaG9vc2VJdGVtKGl0ZW06IFQsIF9ldnQ6IE1vdXNlRXZlbnQgfCBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgICAgIHRoaXMucmVzb2x2ZShpdGVtKTtcbiAgICB9XG5cbiAgICBhc3luYyBvcGVuQW5kR2V0VmFsdWUocmVzb2x2ZTogKHZhbHVlOiBUKSA9PiB2b2lkLCByZWplY3Q6IChyZWFzb24/OiBhbnkpID0+IHZvaWQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdGhpcy5yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgICAgdGhpcy5yZWplY3QgPSByZWplY3Q7XG4gICAgICAgIHRoaXMub3BlbigpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBVTlNVUFBPUlRFRF9NT0JJTEVfVEVNUExBVEUgfSBmcm9tIFwiQ29uc3RhbnRzXCI7XG5pbXBvcnQgeyBJbnRlcm5hbE1vZHVsZSB9IGZyb20gJy4uL0ludGVybmFsTW9kdWxlJztcbmltcG9ydCB7IFBsYXRmb3JtIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBQcm9tcHRNb2RhbCB9IGZyb20gXCIuL1Byb21wdE1vZGFsXCI7XG5pbXBvcnQgeyBTdWdnZXN0ZXJNb2RhbCB9IGZyb20gXCIuL1N1Z2dlc3Rlck1vZGFsXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnRlcm5hbE1vZHVsZVN5c3RlbSBleHRlbmRzIEludGVybmFsTW9kdWxlIHtcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nID0gXCJzeXN0ZW1cIjtcblxuICAgIGFzeW5jIGNyZWF0ZV9zdGF0aWNfdGVtcGxhdGVzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwiY2xpcGJvYXJkXCIsIHRoaXMuZ2VuZXJhdGVfY2xpcGJvYXJkKCkpO1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwicHJvbXB0XCIsIHRoaXMuZ2VuZXJhdGVfcHJvbXB0KCkpO1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwic3VnZ2VzdGVyXCIsIHRoaXMuZ2VuZXJhdGVfc3VnZ2VzdGVyKCkpO1xuICAgIH1cblxuICAgIGFzeW5jIGNyZWF0ZV9keW5hbWljX3RlbXBsYXRlcygpOiBQcm9taXNlPHZvaWQ+IHt9XG5cbiAgICBnZW5lcmF0ZV9jbGlwYm9hcmQoKTogRnVuY3Rpb24ge1xuICAgICAgICByZXR1cm4gYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgLy8gVE9ETzogQWRkIG1vYmlsZSBzdXBwb3J0XG4gICAgICAgICAgICBpZiAoUGxhdGZvcm0uaXNNb2JpbGVBcHApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gVU5TVVBQT1JURURfTU9CSUxFX1RFTVBMQVRFO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQucmVhZFRleHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRlX3Byb21wdCgpOiBGdW5jdGlvbiB7XG4gICAgICAgIHJldHVybiBhc3luYyAocHJvbXB0X3RleHQ/OiBzdHJpbmcsIGRlZmF1bHRfdmFsdWU/OiBzdHJpbmcsIHRocm93X29uX2NhbmNlbDogYm9vbGVhbiA9IGZhbHNlKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHByb21wdCA9IG5ldyBQcm9tcHRNb2RhbCh0aGlzLmFwcCwgcHJvbXB0X3RleHQsIGRlZmF1bHRfdmFsdWUpO1xuICAgICAgICAgICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlOiAodmFsdWU6IHN0cmluZykgPT4gdm9pZCwgcmVqZWN0OiAocmVhc29uPzogYW55KSA9PiB2b2lkKSA9PiBwcm9tcHQub3BlbkFuZEdldFZhbHVlKHJlc29sdmUsIHJlamVjdCkpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgcHJvbWlzZTtcbiAgICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhyb3dfb25fY2FuY2VsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdlbmVyYXRlX3N1Z2dlc3RlcigpOiBGdW5jdGlvbiB7XG4gICAgICAgIHJldHVybiBhc3luYyA8VD4odGV4dF9pdGVtczogc3RyaW5nW10gfCAoKGl0ZW06IFQpID0+IHN0cmluZyksIGl0ZW1zOiBUW10sIHRocm93X29uX2NhbmNlbDogYm9vbGVhbiA9IGZhbHNlLCBwbGFjZWhvbGRlcjogc3RyaW5nID0gXCJcIik6IFByb21pc2U8VD4gPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3VnZ2VzdGVyID0gbmV3IFN1Z2dlc3Rlck1vZGFsKHRoaXMuYXBwLCB0ZXh0X2l0ZW1zLCBpdGVtcywgcGxhY2Vob2xkZXIpO1xuICAgICAgICAgICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlOiAodmFsdWU6IFQpID0+IHZvaWQsIHJlamVjdDogKHJlYXNvbj86IGFueSkgPT4gdm9pZCkgPT4gc3VnZ2VzdGVyLm9wZW5BbmRHZXRWYWx1ZShyZXNvbHZlLCByZWplY3QpKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHByb21pc2VcbiAgICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhyb3dfb25fY2FuY2VsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IEludGVybmFsTW9kdWxlIH0gZnJvbSBcImZ1bmN0aW9ucy9pbnRlcm5hbF9mdW5jdGlvbnMvSW50ZXJuYWxNb2R1bGVcIjtcbmltcG9ydCB7IFJ1bm5pbmdDb25maWcgfSBmcm9tIFwiVGVtcGxhdGVyXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnRlcm5hbE1vZHVsZUNvbmZpZyBleHRlbmRzIEludGVybmFsTW9kdWxlIHtcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nID0gXCJjb25maWdcIjtcblxuICAgIGFzeW5jIGNyZWF0ZV9zdGF0aWNfdGVtcGxhdGVzKCk6IFByb21pc2U8dm9pZD4ge31cblxuICAgIGFzeW5jIGNyZWF0ZV9keW5hbWljX3RlbXBsYXRlcygpOiBQcm9taXNlPHZvaWQ+IHt9XG5cbiAgICBhc3luYyBnZW5lcmF0ZV9vYmplY3QoY29uZmlnOiBSdW5uaW5nQ29uZmlnKTogUHJvbWlzZTx7W3g6IHN0cmluZ106IGFueX0+IHtcbiAgICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBBcHAgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW1wb3J0IFRlbXBsYXRlclBsdWdpbiBmcm9tIFwibWFpblwiO1xuaW1wb3J0IHsgSUdlbmVyYXRlT2JqZWN0IH0gZnJvbSAnZnVuY3Rpb25zL0lHZW5lcmF0ZU9iamVjdCc7XG5pbXBvcnQgeyBJbnRlcm5hbE1vZHVsZSB9IGZyb20gXCIuL0ludGVybmFsTW9kdWxlXCI7XG5pbXBvcnQgeyBJbnRlcm5hbE1vZHVsZURhdGUgfSBmcm9tIFwiLi9kYXRlL0ludGVybmFsTW9kdWxlRGF0ZVwiO1xuaW1wb3J0IHsgSW50ZXJuYWxNb2R1bGVGaWxlIH0gZnJvbSBcIi4vZmlsZS9JbnRlcm5hbE1vZHVsZUZpbGVcIjtcbmltcG9ydCB7IEludGVybmFsTW9kdWxlV2ViIH0gZnJvbSBcIi4vd2ViL0ludGVybmFsTW9kdWxlV2ViXCI7XG5pbXBvcnQgeyBJbnRlcm5hbE1vZHVsZUZyb250bWF0dGVyIH0gZnJvbSBcIi4vZnJvbnRtYXR0ZXIvSW50ZXJuYWxNb2R1bGVGcm9udG1hdHRlclwiO1xuaW1wb3J0IHsgSW50ZXJuYWxNb2R1bGVTeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW0vSW50ZXJuYWxNb2R1bGVTeXN0ZW1cIjtcbmltcG9ydCB7IFJ1bm5pbmdDb25maWcgfSBmcm9tIFwiVGVtcGxhdGVyXCI7XG5pbXBvcnQgeyBJbnRlcm5hbE1vZHVsZUNvbmZpZyB9IGZyb20gXCIuL2NvbmZpZy9JbnRlcm5hbE1vZHVsZUNvbmZpZ1wiO1xuXG5leHBvcnQgY2xhc3MgSW50ZXJuYWxGdW5jdGlvbnMgaW1wbGVtZW50cyBJR2VuZXJhdGVPYmplY3Qge1xuICAgIHByaXZhdGUgbW9kdWxlc19hcnJheTogQXJyYXk8SW50ZXJuYWxNb2R1bGU+ID0gbmV3IEFycmF5KCk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgYXBwOiBBcHAsIHByb3RlY3RlZCBwbHVnaW46IFRlbXBsYXRlclBsdWdpbikge1xuICAgICAgICB0aGlzLm1vZHVsZXNfYXJyYXkucHVzaChuZXcgSW50ZXJuYWxNb2R1bGVEYXRlKHRoaXMuYXBwLCB0aGlzLnBsdWdpbikpO1xuICAgICAgICB0aGlzLm1vZHVsZXNfYXJyYXkucHVzaChuZXcgSW50ZXJuYWxNb2R1bGVGaWxlKHRoaXMuYXBwLCB0aGlzLnBsdWdpbikpO1xuICAgICAgICB0aGlzLm1vZHVsZXNfYXJyYXkucHVzaChuZXcgSW50ZXJuYWxNb2R1bGVXZWIodGhpcy5hcHAsIHRoaXMucGx1Z2luKSk7XG4gICAgICAgIHRoaXMubW9kdWxlc19hcnJheS5wdXNoKG5ldyBJbnRlcm5hbE1vZHVsZUZyb250bWF0dGVyKHRoaXMuYXBwLCB0aGlzLnBsdWdpbikpO1xuICAgICAgICB0aGlzLm1vZHVsZXNfYXJyYXkucHVzaChuZXcgSW50ZXJuYWxNb2R1bGVTeXN0ZW0odGhpcy5hcHAsIHRoaXMucGx1Z2luKSk7XG4gICAgICAgIHRoaXMubW9kdWxlc19hcnJheS5wdXNoKG5ldyBJbnRlcm5hbE1vZHVsZUNvbmZpZyh0aGlzLmFwcCwgdGhpcy5wbHVnaW4pKTtcbiAgICB9XG5cbiAgICBhc3luYyBpbml0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBmb3IgKGNvbnN0IG1vZCBvZiB0aGlzLm1vZHVsZXNfYXJyYXkpIHtcbiAgICAgICAgICAgIGF3YWl0IG1vZC5pbml0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBnZW5lcmF0ZV9vYmplY3QoY29uZmlnOiBSdW5uaW5nQ29uZmlnKTogUHJvbWlzZTx7fT4ge1xuICAgICAgICBjb25zdCBpbnRlcm5hbF9mdW5jdGlvbnNfb2JqZWN0OiB7W2tleTogc3RyaW5nXTogYW55fSA9IHt9O1xuXG4gICAgICAgIGZvciAoY29uc3QgbW9kIG9mIHRoaXMubW9kdWxlc19hcnJheSkge1xuICAgICAgICAgICAgaW50ZXJuYWxfZnVuY3Rpb25zX29iamVjdFttb2QuZ2V0TmFtZSgpXSA9IGF3YWl0IG1vZC5nZW5lcmF0ZV9vYmplY3QoY29uZmlnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpbnRlcm5hbF9mdW5jdGlvbnNfb2JqZWN0O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IGV4ZWMgfSBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiO1xuaW1wb3J0IHsgcHJvbWlzaWZ5IH0gZnJvbSBcInV0aWxcIjtcbmltcG9ydCB7IEFwcCwgUGxhdGZvcm0sIEZpbGVTeXN0ZW1BZGFwdGVyIH0gZnJvbSAnb2JzaWRpYW4nO1xuXG5pbXBvcnQgVGVtcGxhdGVyUGx1Z2luIGZyb20gJ21haW4nO1xuaW1wb3J0IHsgSUdlbmVyYXRlT2JqZWN0IH0gZnJvbSAnZnVuY3Rpb25zL0lHZW5lcmF0ZU9iamVjdCc7XG5pbXBvcnQgeyBSdW5uaW5nQ29uZmlnIH0gZnJvbSAnVGVtcGxhdGVyJztcbmltcG9ydCB7IFVOU1VQUE9SVEVEX01PQklMRV9URU1QTEFURSB9IGZyb20gJ0NvbnN0YW50cyc7XG5pbXBvcnQgeyBUZW1wbGF0ZXJFcnJvciB9IGZyb20gJ0Vycm9yJztcbmltcG9ydCB7IEZ1bmN0aW9uc01vZGUgfSBmcm9tICdmdW5jdGlvbnMvRnVuY3Rpb25zR2VuZXJhdG9yJztcblxuZXhwb3J0IGNsYXNzIFVzZXJTeXN0ZW1GdW5jdGlvbnMgaW1wbGVtZW50cyBJR2VuZXJhdGVPYmplY3Qge1xuICAgIHByaXZhdGUgY3dkOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBleGVjX3Byb21pc2U6IEZ1bmN0aW9uO1xuXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHByaXZhdGUgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW4pIHtcbiAgICAgICAgaWYgKFBsYXRmb3JtLmlzTW9iaWxlQXBwIHx8ICEoYXBwLnZhdWx0LmFkYXB0ZXIgaW5zdGFuY2VvZiBGaWxlU3lzdGVtQWRhcHRlcikpIHtcbiAgICAgICAgICAgIHRoaXMuY3dkID0gXCJcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3dkID0gYXBwLnZhdWx0LmFkYXB0ZXIuZ2V0QmFzZVBhdGgoKTtcbiAgICAgICAgICAgIHRoaXMuZXhlY19wcm9taXNlID0gcHJvbWlzaWZ5KGV4ZWMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gVE9ETzogQWRkIG1vYmlsZSBzdXBwb3J0XG4gICAgYXN5bmMgZ2VuZXJhdGVfc3lzdGVtX2Z1bmN0aW9ucyhjb25maWc6IFJ1bm5pbmdDb25maWcpOiBQcm9taXNlPE1hcDxzdHJpbmcsICh1c2VyX2FyZ3M/OiBhbnkpID0+IFByb21pc2U8c3RyaW5nPj4+IHtcbiAgICAgICAgY29uc3QgdXNlcl9zeXN0ZW1fZnVuY3Rpb25zOiBNYXA8c3RyaW5nLCAodXNlcl9hcmdzPzogYW55KSA9PiBQcm9taXNlPHN0cmluZz4+ID0gbmV3IE1hcCgpO1xuICAgICAgICBjb25zdCBpbnRlcm5hbF9mdW5jdGlvbnNfb2JqZWN0ID0gYXdhaXQgdGhpcy5wbHVnaW4udGVtcGxhdGVyLmZ1bmN0aW9uc19nZW5lcmF0b3IuZ2VuZXJhdGVfb2JqZWN0KGNvbmZpZywgRnVuY3Rpb25zTW9kZS5JTlRFUk5BTCk7XG5cbiAgICAgICAgZm9yIChsZXQgW3RlbXBsYXRlLCBjbWRdIG9mIHRoaXMucGx1Z2luLnNldHRpbmdzLnRlbXBsYXRlc19wYWlycykge1xuICAgICAgICAgICAgaWYgKHRlbXBsYXRlID09PSBcIlwiIHx8IGNtZCA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoUGxhdGZvcm0uaXNNb2JpbGVBcHApIHtcbiAgICAgICAgICAgICAgICB1c2VyX3N5c3RlbV9mdW5jdGlvbnMuc2V0KHRlbXBsYXRlLCAoX3VzZXJfYXJncz86IGFueSk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHJlc29sdmUoVU5TVVBQT1JURURfTU9CSUxFX1RFTVBMQVRFKSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY21kID0gYXdhaXQgdGhpcy5wbHVnaW4udGVtcGxhdGVyLnBhcnNlci5wYXJzZV9jb21tYW5kcyhjbWQsIGludGVybmFsX2Z1bmN0aW9uc19vYmplY3QpO1xuXG4gICAgICAgICAgICAgICAgdXNlcl9zeXN0ZW1fZnVuY3Rpb25zLnNldCh0ZW1wbGF0ZSwgYXN5bmMgKHVzZXJfYXJncz86IGFueSk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb2Nlc3NfZW52ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4ucHJvY2Vzcy5lbnYsXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi51c2VyX2FyZ3MsXG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY21kX29wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lb3V0OiB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb21tYW5kX3RpbWVvdXQgKiAxMDAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3dkOiB0aGlzLmN3ZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudjogcHJvY2Vzc19lbnYsXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi4odGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hlbGxfcGF0aCAhPT0gXCJcIiAmJiB7c2hlbGw6IHRoaXMucGx1Z2luLnNldHRpbmdzLnNoZWxsX3BhdGh9KSxcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qge3N0ZG91dH0gPSBhd2FpdCB0aGlzLmV4ZWNfcHJvbWlzZShjbWQsIGNtZF9vcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGRvdXQudHJpbVJpZ2h0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUZW1wbGF0ZXJFcnJvcihgRXJyb3Igd2l0aCBVc2VyIFRlbXBsYXRlICR7dGVtcGxhdGV9YCwgZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVzZXJfc3lzdGVtX2Z1bmN0aW9ucztcbiAgICB9XG5cbiAgICBhc3luYyBnZW5lcmF0ZV9vYmplY3QoY29uZmlnOiBSdW5uaW5nQ29uZmlnKTogUHJvbWlzZTx7fT4ge1xuICAgICAgICBjb25zdCB1c2VyX3N5c3RlbV9mdW5jdGlvbnMgPSBhd2FpdCB0aGlzLmdlbmVyYXRlX3N5c3RlbV9mdW5jdGlvbnMoY29uZmlnKTtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyh1c2VyX3N5c3RlbV9mdW5jdGlvbnMpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEFwcCwgRmlsZVN5c3RlbUFkYXB0ZXIsIFRGaWxlIH0gZnJvbSAnb2JzaWRpYW4nO1xuXG5pbXBvcnQgVGVtcGxhdGVyUGx1Z2luIGZyb20gJ21haW4nO1xuaW1wb3J0IHsgSUdlbmVyYXRlT2JqZWN0IH0gZnJvbSAnZnVuY3Rpb25zL0lHZW5lcmF0ZU9iamVjdCc7XG5pbXBvcnQgeyBSdW5uaW5nQ29uZmlnIH0gZnJvbSAnVGVtcGxhdGVyJztcbmltcG9ydCB7IGdldF90ZmlsZXNfZnJvbV9mb2xkZXIgfSBmcm9tICdVdGlscyc7XG5pbXBvcnQgeyBlcnJvcldyYXBwZXJTeW5jLCBUZW1wbGF0ZXJFcnJvciB9IGZyb20gJ0Vycm9yJztcblxuZXhwb3J0IGNsYXNzIFVzZXJTY3JpcHRGdW5jdGlvbnMgaW1wbGVtZW50cyBJR2VuZXJhdGVPYmplY3Qge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBwOiBBcHAsIHByaXZhdGUgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW4pIHt9XG5cbiAgICBhc3luYyBnZW5lcmF0ZV91c2VyX3NjcmlwdF9mdW5jdGlvbnMoY29uZmlnOiBSdW5uaW5nQ29uZmlnKTogUHJvbWlzZTxNYXA8c3RyaW5nLCBGdW5jdGlvbj4+IHtcbiAgICAgICAgY29uc3QgdXNlcl9zY3JpcHRfZnVuY3Rpb25zOiBNYXA8c3RyaW5nLCBGdW5jdGlvbj4gPSBuZXcgTWFwKCk7XG4gICAgICAgIGxldCBmaWxlcyA9IGVycm9yV3JhcHBlclN5bmMoKCkgPT4gZ2V0X3RmaWxlc19mcm9tX2ZvbGRlcih0aGlzLmFwcCwgdGhpcy5wbHVnaW4uc2V0dGluZ3MudXNlcl9zY3JpcHRzX2ZvbGRlciksIGBDb3VsZG4ndCBmaW5kIHVzZXIgc2NyaXB0IGZvbGRlciBcIiR7dGhpcy5wbHVnaW4uc2V0dGluZ3MudXNlcl9zY3JpcHRzX2ZvbGRlcn1cImApO1xuICAgICAgICBpZiAoIWZpbGVzKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE1hcCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgZmlsZSBvZiBmaWxlcykge1xuICAgICAgICAgICAgaWYgKGZpbGUuZXh0ZW5zaW9uLnRvTG93ZXJDYXNlKCkgPT09IFwianNcIikge1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMubG9hZF91c2VyX3NjcmlwdF9mdW5jdGlvbihjb25maWcsIGZpbGUsIHVzZXJfc2NyaXB0X2Z1bmN0aW9ucyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVzZXJfc2NyaXB0X2Z1bmN0aW9ucztcbiAgICB9XG5cbiAgICBhc3luYyBsb2FkX3VzZXJfc2NyaXB0X2Z1bmN0aW9uKGNvbmZpZzogUnVubmluZ0NvbmZpZywgZmlsZTogVEZpbGUsIHVzZXJfc2NyaXB0X2Z1bmN0aW9uczogTWFwPHN0cmluZywgRnVuY3Rpb24+KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGlmICghKHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIgaW5zdGFuY2VvZiBGaWxlU3lzdGVtQWRhcHRlcikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUZW1wbGF0ZXJFcnJvcihcImFwcC52YXVsdCBpcyBub3QgYSBGaWxlU3lzdGVtQWRhcHRlciBpbnN0YW5jZVwiKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgdmF1bHRfcGF0aCA9IHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIuZ2V0QmFzZVBhdGgoKTtcbiAgICAgICAgbGV0IGZpbGVfcGF0aCA9IGAke3ZhdWx0X3BhdGh9LyR7ZmlsZS5wYXRofWA7XG5cbiAgICAgICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjY2MzM5MDEvcmVsb2FkLW1vZHVsZS1hdC1ydW50aW1lXG4gICAgICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE5NzIyNDIvaG93LXRvLWF1dG8tcmVsb2FkLWZpbGVzLWluLW5vZGUtanNcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKHdpbmRvdy5yZXF1aXJlLmNhY2hlKS5jb250YWlucyhmaWxlX3BhdGgpKSB7XG4gICAgICAgICAgICBkZWxldGUgd2luZG93LnJlcXVpcmUuY2FjaGVbd2luZG93LnJlcXVpcmUucmVzb2x2ZShmaWxlX3BhdGgpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHVzZXJfZnVuY3Rpb24gPSBhd2FpdCBpbXBvcnQoZmlsZV9wYXRoKTtcbiAgICAgICAgaWYgKCF1c2VyX2Z1bmN0aW9uLmRlZmF1bHQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUZW1wbGF0ZXJFcnJvcihgRmFpbGVkIHRvIGxvYWQgdXNlciBzY3JpcHQgJHtmaWxlX3BhdGh9LiBObyBleHBvcnRzIGRldGVjdGVkLmApO1xuICAgICAgICB9XG4gICAgICAgIGlmICghKHVzZXJfZnVuY3Rpb24uZGVmYXVsdCBpbnN0YW5jZW9mIEZ1bmN0aW9uKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFRlbXBsYXRlckVycm9yKGBGYWlsZWQgdG8gbG9hZCB1c2VyIHNjcmlwdCAke2ZpbGVfcGF0aH0uIERlZmF1bHQgZXhwb3J0IGlzIG5vdCBhIGZ1bmN0aW9uLmApO1xuICAgICAgICB9XG4gICAgICAgIHVzZXJfc2NyaXB0X2Z1bmN0aW9ucy5zZXQoYCR7ZmlsZS5iYXNlbmFtZX1gLCB1c2VyX2Z1bmN0aW9uLmRlZmF1bHQpO1xuICAgIH1cblxuICAgIGFzeW5jIGdlbmVyYXRlX29iamVjdChjb25maWc6IFJ1bm5pbmdDb25maWcpOiBQcm9taXNlPHt9PiB7XG4gICAgICAgIGNvbnN0IHVzZXJfc2NyaXB0X2Z1bmN0aW9ucyA9IGF3YWl0IHRoaXMuZ2VuZXJhdGVfdXNlcl9zY3JpcHRfZnVuY3Rpb25zKGNvbmZpZyk7XG4gICAgICAgIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXModXNlcl9zY3JpcHRfZnVuY3Rpb25zKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBBcHAsIFBsYXRmb3JtIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmltcG9ydCBUZW1wbGF0ZXJQbHVnaW4gZnJvbSBcIm1haW5cIjtcbmltcG9ydCB7IFJ1bm5pbmdDb25maWcgfSBmcm9tIFwiVGVtcGxhdGVyXCI7XG5pbXBvcnQgeyBJR2VuZXJhdGVPYmplY3QgfSBmcm9tICdmdW5jdGlvbnMvSUdlbmVyYXRlT2JqZWN0JztcbmltcG9ydCB7IFVzZXJTeXN0ZW1GdW5jdGlvbnMgfSBmcm9tICdmdW5jdGlvbnMvdXNlcl9mdW5jdGlvbnMvVXNlclN5c3RlbUZ1bmN0aW9ucyc7XG5pbXBvcnQgeyBVc2VyU2NyaXB0RnVuY3Rpb25zIH0gZnJvbSAnZnVuY3Rpb25zL3VzZXJfZnVuY3Rpb25zL1VzZXJTY3JpcHRGdW5jdGlvbnMnO1xuXG5leHBvcnQgY2xhc3MgVXNlckZ1bmN0aW9ucyBpbXBsZW1lbnRzIElHZW5lcmF0ZU9iamVjdCB7XG4gICAgcHJpdmF0ZSB1c2VyX3N5c3RlbV9mdW5jdGlvbnM6IFVzZXJTeXN0ZW1GdW5jdGlvbnM7XG4gICAgcHJpdmF0ZSB1c2VyX3NjcmlwdF9mdW5jdGlvbnM6IFVzZXJTY3JpcHRGdW5jdGlvbnM7XG5cbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcHJpdmF0ZSBwbHVnaW46IFRlbXBsYXRlclBsdWdpbikge1xuICAgICAgICB0aGlzLnVzZXJfc3lzdGVtX2Z1bmN0aW9ucyA9IG5ldyBVc2VyU3lzdGVtRnVuY3Rpb25zKGFwcCwgcGx1Z2luKTtcbiAgICAgICAgdGhpcy51c2VyX3NjcmlwdF9mdW5jdGlvbnMgPSBuZXcgVXNlclNjcmlwdEZ1bmN0aW9ucyhhcHAsIHBsdWdpbik7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2VuZXJhdGVfb2JqZWN0KGNvbmZpZzogUnVubmluZ0NvbmZpZyk6IFByb21pc2U8e30+IHtcbiAgICAgICAgbGV0IHVzZXJfc3lzdGVtX2Z1bmN0aW9ucyA9IHt9O1xuICAgICAgICBsZXQgdXNlcl9zY3JpcHRfZnVuY3Rpb25zID0ge307XG5cbiAgICAgICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZV9zeXN0ZW1fY29tbWFuZHMpIHtcbiAgICAgICAgICAgIHVzZXJfc3lzdGVtX2Z1bmN0aW9ucyA9IGF3YWl0IHRoaXMudXNlcl9zeXN0ZW1fZnVuY3Rpb25zLmdlbmVyYXRlX29iamVjdChjb25maWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVE9ETzogQWRkIG1vYmlsZSBzdXBwb3J0XG4gICAgICAgIGlmIChQbGF0Zm9ybS5pc0Rlc2t0b3BBcHAgJiYgdGhpcy5wbHVnaW4uc2V0dGluZ3MudXNlcl9zY3JpcHRzX2ZvbGRlcikge1xuICAgICAgICAgICAgdXNlcl9zY3JpcHRfZnVuY3Rpb25zID0gYXdhaXQgdGhpcy51c2VyX3NjcmlwdF9mdW5jdGlvbnMuZ2VuZXJhdGVfb2JqZWN0KGNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4udXNlcl9zeXN0ZW1fZnVuY3Rpb25zLFxuICAgICAgICAgICAgLi4udXNlcl9zY3JpcHRfZnVuY3Rpb25zLFxuICAgICAgICB9O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEFwcCB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5pbXBvcnQgeyBJbnRlcm5hbEZ1bmN0aW9ucyB9IGZyb20gXCJmdW5jdGlvbnMvaW50ZXJuYWxfZnVuY3Rpb25zL0ludGVybmFsRnVuY3Rpb25zXCI7XG5pbXBvcnQgeyBVc2VyRnVuY3Rpb25zIH0gZnJvbSAnZnVuY3Rpb25zL3VzZXJfZnVuY3Rpb25zL1VzZXJGdW5jdGlvbnMnO1xuaW1wb3J0IFRlbXBsYXRlclBsdWdpbiBmcm9tIFwibWFpblwiO1xuaW1wb3J0IHsgSUdlbmVyYXRlT2JqZWN0IH0gZnJvbSAnZnVuY3Rpb25zL0lHZW5lcmF0ZU9iamVjdCc7XG5pbXBvcnQgeyBvYnNpZGlhbl9tb2R1bGUgfSBmcm9tIFwiVXRpbHNcIjtcbmltcG9ydCB7IFJ1bm5pbmdDb25maWcgfSBmcm9tIFwiVGVtcGxhdGVyXCI7XG5cbmV4cG9ydCBlbnVtIEZ1bmN0aW9uc01vZGUge1xuICAgIElOVEVSTkFMLFxuICAgIFVTRVJfSU5URVJOQUwsXG59O1xuXG5leHBvcnQgY2xhc3MgRnVuY3Rpb25zR2VuZXJhdG9yIGltcGxlbWVudHMgSUdlbmVyYXRlT2JqZWN0IHtcbiAgICBwdWJsaWMgaW50ZXJuYWxfZnVuY3Rpb25zOiBJbnRlcm5hbEZ1bmN0aW9ucztcblx0cHVibGljIHVzZXJfZnVuY3Rpb25zOiBVc2VyRnVuY3Rpb25zO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhcHA6IEFwcCwgcHJpdmF0ZSBwbHVnaW46IFRlbXBsYXRlclBsdWdpbikge1xuICAgICAgICB0aGlzLmludGVybmFsX2Z1bmN0aW9ucyA9IG5ldyBJbnRlcm5hbEZ1bmN0aW9ucyh0aGlzLmFwcCwgdGhpcy5wbHVnaW4pO1xuICAgICAgICB0aGlzLnVzZXJfZnVuY3Rpb25zID0gbmV3IFVzZXJGdW5jdGlvbnModGhpcy5hcHAsIHRoaXMucGx1Z2luKTtcbiAgICB9XG5cbiAgICBhc3luYyBpbml0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBhd2FpdCB0aGlzLmludGVybmFsX2Z1bmN0aW9ucy5pbml0KCk7XG4gICAgfVxuXG4gICAgYWRkaXRpb25hbF9mdW5jdGlvbnMoKToge30ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgb2JzaWRpYW46IG9ic2lkaWFuX21vZHVsZSxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBhc3luYyBnZW5lcmF0ZV9vYmplY3QoY29uZmlnOiBSdW5uaW5nQ29uZmlnLCBmdW5jdGlvbnNfbW9kZTogRnVuY3Rpb25zTW9kZSA9IEZ1bmN0aW9uc01vZGUuVVNFUl9JTlRFUk5BTCk6IFByb21pc2U8e30+IHtcbiAgICAgICAgY29uc3QgZmluYWxfb2JqZWN0ID0ge307XG4gICAgICAgIGNvbnN0IGFkZGl0aW9uYWxfZnVuY3Rpb25zX29iamVjdCA9IHRoaXMuYWRkaXRpb25hbF9mdW5jdGlvbnMoKTtcbiAgICAgICAgY29uc3QgaW50ZXJuYWxfZnVuY3Rpb25zX29iamVjdCA9IGF3YWl0IHRoaXMuaW50ZXJuYWxfZnVuY3Rpb25zLmdlbmVyYXRlX29iamVjdChjb25maWcpO1xuICAgICAgICBsZXQgdXNlcl9mdW5jdGlvbnNfb2JqZWN0ID0ge307XG5cbiAgICAgICAgT2JqZWN0LmFzc2lnbihmaW5hbF9vYmplY3QsIGFkZGl0aW9uYWxfZnVuY3Rpb25zX29iamVjdCk7XG4gICAgICAgIHN3aXRjaCAoZnVuY3Rpb25zX21vZGUpIHtcbiAgICAgICAgICAgIGNhc2UgRnVuY3Rpb25zTW9kZS5JTlRFUk5BTDpcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKGZpbmFsX29iamVjdCwgaW50ZXJuYWxfZnVuY3Rpb25zX29iamVjdCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEZ1bmN0aW9uc01vZGUuVVNFUl9JTlRFUk5BTDpcbiAgICAgICAgICAgICAgICB1c2VyX2Z1bmN0aW9uc19vYmplY3QgPSBhd2FpdCB0aGlzLnVzZXJfZnVuY3Rpb25zLmdlbmVyYXRlX29iamVjdChjb25maWcpO1xuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oZmluYWxfb2JqZWN0LCB7XG4gICAgICAgICAgICAgICAgICAgIC4uLmludGVybmFsX2Z1bmN0aW9uc19vYmplY3QsXG4gICAgICAgICAgICAgICAgICAgIHVzZXI6IHVzZXJfZnVuY3Rpb25zX29iamVjdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaW5hbF9vYmplY3Q7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQXBwLCBFZGl0b3JQb3NpdGlvbiwgRWRpdG9yUmFuZ2VPckNhcmV0LCBFZGl0b3JUcmFuc2FjdGlvbiwgTWFya2Rvd25WaWV3IH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBlc2NhcGVfUmVnRXhwIH0gZnJvbSBcIlV0aWxzXCI7XG5cbmV4cG9ydCBjbGFzcyBDdXJzb3JKdW1wZXIge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBwOiBBcHApIHt9XG5cbiAgICBhc3luYyBqdW1wX3RvX25leHRfY3Vyc29yX2xvY2F0aW9uKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBjb25zdCBhY3RpdmVfdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgICAgIGlmICghYWN0aXZlX3ZpZXcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhY3RpdmVfZmlsZSA9IGFjdGl2ZV92aWV3LmZpbGU7XG4gICAgICAgIGF3YWl0IGFjdGl2ZV92aWV3LnNhdmUoKTtcblxuICAgICAgICBjb25zdCBjb250ZW50ID0gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZChhY3RpdmVfZmlsZSk7XG5cbiAgICAgICAgY29uc3Qge25ld19jb250ZW50LCBwb3NpdGlvbnN9ID0gdGhpcy5yZXBsYWNlX2FuZF9nZXRfY3Vyc29yX3Bvc2l0aW9ucyhjb250ZW50KTtcbiAgICAgICAgaWYgKHBvc2l0aW9ucykge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQubW9kaWZ5KGFjdGl2ZV9maWxlLCBuZXdfY29udGVudCk7XG4gICAgICAgICAgICB0aGlzLnNldF9jdXJzb3JfbG9jYXRpb24ocG9zaXRpb25zKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldF9lZGl0b3JfcG9zaXRpb25fZnJvbV9pbmRleChjb250ZW50OiBzdHJpbmcsIGluZGV4OiBudW1iZXIpOiBFZGl0b3JQb3NpdGlvbiB7XG4gICAgICAgIGNvbnN0IHN1YnN0ciA9IGNvbnRlbnQuc3Vic3RyKDAsIGluZGV4KTtcblxuICAgICAgICBsZXQgbCA9IDA7XG4gICAgICAgIGxldCBvZmZzZXQgPSAtMTtcbiAgICAgICAgbGV0IHIgPSAtMTtcbiAgICAgICAgZm9yICg7IChyID0gc3Vic3RyLmluZGV4T2YoXCJcXG5cIiwgcisxKSkgIT09IC0xIDsgbCsrLCBvZmZzZXQ9cik7XG4gICAgICAgIG9mZnNldCArPSAxO1xuXG4gICAgICAgIGNvbnN0IGNoID0gY29udGVudC5zdWJzdHIob2Zmc2V0LCBpbmRleC1vZmZzZXQpLmxlbmd0aDtcblxuICAgICAgICByZXR1cm4ge2xpbmU6IGwsIGNoOiBjaH07XG4gICAgfVxuXG4gICAgcmVwbGFjZV9hbmRfZ2V0X2N1cnNvcl9wb3NpdGlvbnMoY29udGVudDogc3RyaW5nKToge25ld19jb250ZW50Pzogc3RyaW5nLCBwb3NpdGlvbnM/OiBFZGl0b3JQb3NpdGlvbltdfSB7XG4gICAgICAgIGxldCBjdXJzb3JfbWF0Y2hlcyA9IFtdO1xuICAgICAgICBsZXQgbWF0Y2g7XG4gICAgICAgIGNvbnN0IGN1cnNvcl9yZWdleDogUmVnRXhwID0gbmV3IFJlZ0V4cChcIjwlXFxcXHMqdHAuZmlsZS5jdXJzb3JcXFxcKCg/PG9yZGVyPlswLTldezAsMn0pXFxcXClcXFxccyolPlwiLCBcImdcIik7XHRcblxuICAgICAgICB3aGlsZSgobWF0Y2ggPSBjdXJzb3JfcmVnZXguZXhlYyhjb250ZW50KSkgIT0gbnVsbCkge1xuICAgICAgICAgICAgY3Vyc29yX21hdGNoZXMucHVzaChtYXRjaCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGN1cnNvcl9tYXRjaGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgY3Vyc29yX21hdGNoZXMuc29ydCgobTEsIG0yKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gTnVtYmVyKG0xLmdyb3Vwc1tcIm9yZGVyXCJdKSAtIE51bWJlcihtMi5ncm91cHNbXCJvcmRlclwiXSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBtYXRjaF9zdHIgPSBjdXJzb3JfbWF0Y2hlc1swXVswXTtcblxuICAgICAgICBjdXJzb3JfbWF0Y2hlcyA9IGN1cnNvcl9tYXRjaGVzLmZpbHRlcihtID0+IHtcbiAgICAgICAgICAgIHJldHVybiBtWzBdID09PSBtYXRjaF9zdHI7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHBvc2l0aW9ucyA9IFtdO1xuICAgICAgICBsZXQgaW5kZXhfb2Zmc2V0ID0gMDtcbiAgICAgICAgZm9yIChsZXQgbWF0Y2ggb2YgY3Vyc29yX21hdGNoZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gbWF0Y2guaW5kZXggLSBpbmRleF9vZmZzZXQ7XG4gICAgICAgICAgICBwb3NpdGlvbnMucHVzaCh0aGlzLmdldF9lZGl0b3JfcG9zaXRpb25fZnJvbV9pbmRleChjb250ZW50LCBpbmRleCkpO1xuXG4gICAgICAgICAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlKG5ldyBSZWdFeHAoZXNjYXBlX1JlZ0V4cChtYXRjaFswXSkpLCBcIlwiKTtcbiAgICAgICAgICAgIGluZGV4X29mZnNldCArPSBtYXRjaFswXS5sZW5ndGg7XG5cbiAgICAgICAgICAgIC8vIEZvciB0cC5maWxlLmN1cnNvcigpLCB3ZSBrZWVwIHRoZSBkZWZhdWx0IHRvcCB0byBib3R0b21cbiAgICAgICAgICAgIGlmIChtYXRjaFsxXSA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtuZXdfY29udGVudDogY29udGVudCwgcG9zaXRpb25zOiBwb3NpdGlvbnN9O1xuICAgIH1cblxuICAgIHNldF9jdXJzb3JfbG9jYXRpb24ocG9zaXRpb25zOiBFZGl0b3JQb3NpdGlvbltdKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGFjdGl2ZV92aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcbiAgICAgICAgaWYgKCFhY3RpdmVfdmlldykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZWRpdG9yID0gYWN0aXZlX3ZpZXcuZWRpdG9yO1xuICAgICAgICBlZGl0b3IuZm9jdXMoKTtcblxuICAgICAgICBsZXQgc2VsZWN0aW9uczogQXJyYXk8RWRpdG9yUmFuZ2VPckNhcmV0PiA9IFtdO1xuICAgICAgICBmb3IgKGxldCBwb3Mgb2YgcG9zaXRpb25zKSB7XG4gICAgICAgICAgICBzZWxlY3Rpb25zLnB1c2goe2Zyb206IHBvc30pO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHRyYW5zYWN0aW9uOiBFZGl0b3JUcmFuc2FjdGlvbiA9IHtcbiAgICAgICAgICAgIHNlbGVjdGlvbnM6IHNlbGVjdGlvbnNcbiAgICAgICAgfTtcbiAgICAgICAgZWRpdG9yLnRyYW5zYWN0aW9uKHRyYW5zYWN0aW9uKTtcbiAgICB9XG59XG4iLCIvLyBDb2RlTWlycm9yLCBjb3B5cmlnaHQgKGMpIGJ5IE1hcmlqbiBIYXZlcmJla2UgYW5kIG90aGVyc1xuLy8gRGlzdHJpYnV0ZWQgdW5kZXIgYW4gTUlUIGxpY2Vuc2U6IGh0dHBzOi8vY29kZW1pcnJvci5uZXQvTElDRU5TRVxuXG4oZnVuY3Rpb24obW9kKSB7XG4gIG1vZCh3aW5kb3cuQ29kZU1pcnJvcik7XG59KShmdW5jdGlvbihDb2RlTWlycm9yKSB7XG5cInVzZSBzdHJpY3RcIjtcblxuQ29kZU1pcnJvci5kZWZpbmVNb2RlKFwiamF2YXNjcmlwdFwiLCBmdW5jdGlvbihjb25maWcsIHBhcnNlckNvbmZpZykge1xuICB2YXIgaW5kZW50VW5pdCA9IGNvbmZpZy5pbmRlbnRVbml0O1xuICB2YXIgc3RhdGVtZW50SW5kZW50ID0gcGFyc2VyQ29uZmlnLnN0YXRlbWVudEluZGVudDtcbiAgdmFyIGpzb25sZE1vZGUgPSBwYXJzZXJDb25maWcuanNvbmxkO1xuICB2YXIganNvbk1vZGUgPSBwYXJzZXJDb25maWcuanNvbiB8fCBqc29ubGRNb2RlO1xuICB2YXIgdHJhY2tTY29wZSA9IHBhcnNlckNvbmZpZy50cmFja1Njb3BlICE9PSBmYWxzZVxuICB2YXIgaXNUUyA9IHBhcnNlckNvbmZpZy50eXBlc2NyaXB0O1xuICB2YXIgd29yZFJFID0gcGFyc2VyQ29uZmlnLndvcmRDaGFyYWN0ZXJzIHx8IC9bXFx3JFxceGExLVxcdWZmZmZdLztcblxuICAvLyBUb2tlbml6ZXJcblxuICB2YXIga2V5d29yZHMgPSBmdW5jdGlvbigpe1xuICAgIGZ1bmN0aW9uIGt3KHR5cGUpIHtyZXR1cm4ge3R5cGU6IHR5cGUsIHN0eWxlOiBcImtleXdvcmRcIn07fVxuICAgIHZhciBBID0ga3coXCJrZXl3b3JkIGFcIiksIEIgPSBrdyhcImtleXdvcmQgYlwiKSwgQyA9IGt3KFwia2V5d29yZCBjXCIpLCBEID0ga3coXCJrZXl3b3JkIGRcIik7XG4gICAgdmFyIG9wZXJhdG9yID0ga3coXCJvcGVyYXRvclwiKSwgYXRvbSA9IHt0eXBlOiBcImF0b21cIiwgc3R5bGU6IFwiYXRvbVwifTtcblxuICAgIHJldHVybiB7XG4gICAgICBcImlmXCI6IGt3KFwiaWZcIiksIFwid2hpbGVcIjogQSwgXCJ3aXRoXCI6IEEsIFwiZWxzZVwiOiBCLCBcImRvXCI6IEIsIFwidHJ5XCI6IEIsIFwiZmluYWxseVwiOiBCLFxuICAgICAgXCJyZXR1cm5cIjogRCwgXCJicmVha1wiOiBELCBcImNvbnRpbnVlXCI6IEQsIFwibmV3XCI6IGt3KFwibmV3XCIpLCBcImRlbGV0ZVwiOiBDLCBcInZvaWRcIjogQywgXCJ0aHJvd1wiOiBDLFxuICAgICAgXCJkZWJ1Z2dlclwiOiBrdyhcImRlYnVnZ2VyXCIpLCBcInZhclwiOiBrdyhcInZhclwiKSwgXCJjb25zdFwiOiBrdyhcInZhclwiKSwgXCJsZXRcIjoga3coXCJ2YXJcIiksXG4gICAgICBcImZ1bmN0aW9uXCI6IGt3KFwiZnVuY3Rpb25cIiksIFwiY2F0Y2hcIjoga3coXCJjYXRjaFwiKSxcbiAgICAgIFwiZm9yXCI6IGt3KFwiZm9yXCIpLCBcInN3aXRjaFwiOiBrdyhcInN3aXRjaFwiKSwgXCJjYXNlXCI6IGt3KFwiY2FzZVwiKSwgXCJkZWZhdWx0XCI6IGt3KFwiZGVmYXVsdFwiKSxcbiAgICAgIFwiaW5cIjogb3BlcmF0b3IsIFwidHlwZW9mXCI6IG9wZXJhdG9yLCBcImluc3RhbmNlb2ZcIjogb3BlcmF0b3IsXG4gICAgICBcInRydWVcIjogYXRvbSwgXCJmYWxzZVwiOiBhdG9tLCBcIm51bGxcIjogYXRvbSwgXCJ1bmRlZmluZWRcIjogYXRvbSwgXCJOYU5cIjogYXRvbSwgXCJJbmZpbml0eVwiOiBhdG9tLFxuICAgICAgXCJ0aGlzXCI6IGt3KFwidGhpc1wiKSwgXCJjbGFzc1wiOiBrdyhcImNsYXNzXCIpLCBcInN1cGVyXCI6IGt3KFwiYXRvbVwiKSxcbiAgICAgIFwieWllbGRcIjogQywgXCJleHBvcnRcIjoga3coXCJleHBvcnRcIiksIFwiaW1wb3J0XCI6IGt3KFwiaW1wb3J0XCIpLCBcImV4dGVuZHNcIjogQyxcbiAgICAgIFwiYXdhaXRcIjogQ1xuICAgIH07XG4gIH0oKTtcblxuICB2YXIgaXNPcGVyYXRvckNoYXIgPSAvWytcXC0qJiU9PD4hP3x+XkBdLztcbiAgdmFyIGlzSnNvbmxkS2V5d29yZCA9IC9eQChjb250ZXh0fGlkfHZhbHVlfGxhbmd1YWdlfHR5cGV8Y29udGFpbmVyfGxpc3R8c2V0fHJldmVyc2V8aW5kZXh8YmFzZXx2b2NhYnxncmFwaClcIi87XG5cbiAgZnVuY3Rpb24gcmVhZFJlZ2V4cChzdHJlYW0pIHtcbiAgICB2YXIgZXNjYXBlZCA9IGZhbHNlLCBuZXh0LCBpblNldCA9IGZhbHNlO1xuICAgIHdoaWxlICgobmV4dCA9IHN0cmVhbS5uZXh0KCkpICE9IG51bGwpIHtcbiAgICAgIGlmICghZXNjYXBlZCkge1xuICAgICAgICBpZiAobmV4dCA9PSBcIi9cIiAmJiAhaW5TZXQpIHJldHVybjtcbiAgICAgICAgaWYgKG5leHQgPT0gXCJbXCIpIGluU2V0ID0gdHJ1ZTtcbiAgICAgICAgZWxzZSBpZiAoaW5TZXQgJiYgbmV4dCA9PSBcIl1cIikgaW5TZXQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGVzY2FwZWQgPSAhZXNjYXBlZCAmJiBuZXh0ID09IFwiXFxcXFwiO1xuICAgIH1cbiAgfVxuXG4gIC8vIFVzZWQgYXMgc2NyYXRjaCB2YXJpYWJsZXMgdG8gY29tbXVuaWNhdGUgbXVsdGlwbGUgdmFsdWVzIHdpdGhvdXRcbiAgLy8gY29uc2luZyB1cCB0b25zIG9mIG9iamVjdHMuXG4gIHZhciB0eXBlLCBjb250ZW50O1xuICBmdW5jdGlvbiByZXQodHAsIHN0eWxlLCBjb250KSB7XG4gICAgdHlwZSA9IHRwOyBjb250ZW50ID0gY29udDtcbiAgICByZXR1cm4gc3R5bGU7XG4gIH1cbiAgZnVuY3Rpb24gdG9rZW5CYXNlKHN0cmVhbSwgc3RhdGUpIHtcbiAgICB2YXIgY2ggPSBzdHJlYW0ubmV4dCgpO1xuICAgIGlmIChjaCA9PSAnXCInIHx8IGNoID09IFwiJ1wiKSB7XG4gICAgICBzdGF0ZS50b2tlbml6ZSA9IHRva2VuU3RyaW5nKGNoKTtcbiAgICAgIHJldHVybiBzdGF0ZS50b2tlbml6ZShzdHJlYW0sIHN0YXRlKTtcbiAgICB9IGVsc2UgaWYgKGNoID09IFwiLlwiICYmIHN0cmVhbS5tYXRjaCgvXlxcZFtcXGRfXSooPzpbZUVdWytcXC1dP1tcXGRfXSspPy8pKSB7XG4gICAgICByZXR1cm4gcmV0KFwibnVtYmVyXCIsIFwibnVtYmVyXCIpO1xuICAgIH0gZWxzZSBpZiAoY2ggPT0gXCIuXCIgJiYgc3RyZWFtLm1hdGNoKFwiLi5cIikpIHtcbiAgICAgIHJldHVybiByZXQoXCJzcHJlYWRcIiwgXCJtZXRhXCIpO1xuICAgIH0gZWxzZSBpZiAoL1tcXFtcXF17fVxcKFxcKSw7XFw6XFwuXS8udGVzdChjaCkpIHtcbiAgICAgIHJldHVybiByZXQoY2gpO1xuICAgIH0gZWxzZSBpZiAoY2ggPT0gXCI9XCIgJiYgc3RyZWFtLmVhdChcIj5cIikpIHtcbiAgICAgIHJldHVybiByZXQoXCI9PlwiLCBcIm9wZXJhdG9yXCIpO1xuICAgIH0gZWxzZSBpZiAoY2ggPT0gXCIwXCIgJiYgc3RyZWFtLm1hdGNoKC9eKD86eFtcXGRBLUZhLWZfXSt8b1swLTdfXSt8YlswMV9dKyluPy8pKSB7XG4gICAgICByZXR1cm4gcmV0KFwibnVtYmVyXCIsIFwibnVtYmVyXCIpO1xuICAgIH0gZWxzZSBpZiAoL1xcZC8udGVzdChjaCkpIHtcbiAgICAgIHN0cmVhbS5tYXRjaCgvXltcXGRfXSooPzpufCg/OlxcLltcXGRfXSopPyg/OltlRV1bK1xcLV0/W1xcZF9dKyk/KT8vKTtcbiAgICAgIHJldHVybiByZXQoXCJudW1iZXJcIiwgXCJudW1iZXJcIik7XG4gICAgfSBlbHNlIGlmIChjaCA9PSBcIi9cIikge1xuICAgICAgaWYgKHN0cmVhbS5lYXQoXCIqXCIpKSB7XG4gICAgICAgIHN0YXRlLnRva2VuaXplID0gdG9rZW5Db21tZW50O1xuICAgICAgICByZXR1cm4gdG9rZW5Db21tZW50KHN0cmVhbSwgc3RhdGUpO1xuICAgICAgfSBlbHNlIGlmIChzdHJlYW0uZWF0KFwiL1wiKSkge1xuICAgICAgICBzdHJlYW0uc2tpcFRvRW5kKCk7XG4gICAgICAgIHJldHVybiByZXQoXCJjb21tZW50XCIsIFwiY29tbWVudFwiKTtcbiAgICAgIH0gZWxzZSBpZiAoZXhwcmVzc2lvbkFsbG93ZWQoc3RyZWFtLCBzdGF0ZSwgMSkpIHtcbiAgICAgICAgcmVhZFJlZ2V4cChzdHJlYW0pO1xuICAgICAgICBzdHJlYW0ubWF0Y2goL15cXGIoKFtnaW15dXNdKSg/IVtnaW15dXNdKlxcMikpK1xcYi8pO1xuICAgICAgICByZXR1cm4gcmV0KFwicmVnZXhwXCIsIFwic3RyaW5nLTJcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHJlYW0uZWF0KFwiPVwiKTtcbiAgICAgICAgcmV0dXJuIHJldChcIm9wZXJhdG9yXCIsIFwib3BlcmF0b3JcIiwgc3RyZWFtLmN1cnJlbnQoKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChjaCA9PSBcImBcIikge1xuICAgICAgc3RhdGUudG9rZW5pemUgPSB0b2tlblF1YXNpO1xuICAgICAgcmV0dXJuIHRva2VuUXVhc2koc3RyZWFtLCBzdGF0ZSk7XG4gICAgfSBlbHNlIGlmIChjaCA9PSBcIiNcIiAmJiBzdHJlYW0ucGVlaygpID09IFwiIVwiKSB7XG4gICAgICBzdHJlYW0uc2tpcFRvRW5kKCk7XG4gICAgICByZXR1cm4gcmV0KFwibWV0YVwiLCBcIm1ldGFcIik7XG4gICAgfSBlbHNlIGlmIChjaCA9PSBcIiNcIiAmJiBzdHJlYW0uZWF0V2hpbGUod29yZFJFKSkge1xuICAgICAgcmV0dXJuIHJldChcInZhcmlhYmxlXCIsIFwicHJvcGVydHlcIilcbiAgICB9IGVsc2UgaWYgKGNoID09IFwiPFwiICYmIHN0cmVhbS5tYXRjaChcIiEtLVwiKSB8fFxuICAgICAgICAgICAgICAgKGNoID09IFwiLVwiICYmIHN0cmVhbS5tYXRjaChcIi0+XCIpICYmICEvXFxTLy50ZXN0KHN0cmVhbS5zdHJpbmcuc2xpY2UoMCwgc3RyZWFtLnN0YXJ0KSkpKSB7XG4gICAgICBzdHJlYW0uc2tpcFRvRW5kKClcbiAgICAgIHJldHVybiByZXQoXCJjb21tZW50XCIsIFwiY29tbWVudFwiKVxuICAgIH0gZWxzZSBpZiAoaXNPcGVyYXRvckNoYXIudGVzdChjaCkpIHtcbiAgICAgIGlmIChjaCAhPSBcIj5cIiB8fCAhc3RhdGUubGV4aWNhbCB8fCBzdGF0ZS5sZXhpY2FsLnR5cGUgIT0gXCI+XCIpIHtcbiAgICAgICAgaWYgKHN0cmVhbS5lYXQoXCI9XCIpKSB7XG4gICAgICAgICAgaWYgKGNoID09IFwiIVwiIHx8IGNoID09IFwiPVwiKSBzdHJlYW0uZWF0KFwiPVwiKVxuICAgICAgICB9IGVsc2UgaWYgKC9bPD4qK1xcLXwmP10vLnRlc3QoY2gpKSB7XG4gICAgICAgICAgc3RyZWFtLmVhdChjaClcbiAgICAgICAgICBpZiAoY2ggPT0gXCI+XCIpIHN0cmVhbS5lYXQoY2gpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChjaCA9PSBcIj9cIiAmJiBzdHJlYW0uZWF0KFwiLlwiKSkgcmV0dXJuIHJldChcIi5cIilcbiAgICAgIHJldHVybiByZXQoXCJvcGVyYXRvclwiLCBcIm9wZXJhdG9yXCIsIHN0cmVhbS5jdXJyZW50KCkpO1xuICAgIH0gZWxzZSBpZiAod29yZFJFLnRlc3QoY2gpKSB7XG4gICAgICBzdHJlYW0uZWF0V2hpbGUod29yZFJFKTtcbiAgICAgIHZhciB3b3JkID0gc3RyZWFtLmN1cnJlbnQoKVxuICAgICAgaWYgKHN0YXRlLmxhc3RUeXBlICE9IFwiLlwiKSB7XG4gICAgICAgIGlmIChrZXl3b3Jkcy5wcm9wZXJ0eUlzRW51bWVyYWJsZSh3b3JkKSkge1xuICAgICAgICAgIHZhciBrdyA9IGtleXdvcmRzW3dvcmRdXG4gICAgICAgICAgcmV0dXJuIHJldChrdy50eXBlLCBrdy5zdHlsZSwgd29yZClcbiAgICAgICAgfVxuICAgICAgICBpZiAod29yZCA9PSBcImFzeW5jXCIgJiYgc3RyZWFtLm1hdGNoKC9eKFxcc3xcXC9cXCooW14qXXxcXCooPyFcXC8pKSo/XFwqXFwvKSpbXFxbXFwoXFx3XS8sIGZhbHNlKSlcbiAgICAgICAgICByZXR1cm4gcmV0KFwiYXN5bmNcIiwgXCJrZXl3b3JkXCIsIHdvcmQpXG4gICAgICB9XG4gICAgICByZXR1cm4gcmV0KFwidmFyaWFibGVcIiwgXCJ2YXJpYWJsZVwiLCB3b3JkKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHRva2VuU3RyaW5nKHF1b3RlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHN0cmVhbSwgc3RhdGUpIHtcbiAgICAgIHZhciBlc2NhcGVkID0gZmFsc2UsIG5leHQ7XG4gICAgICBpZiAoanNvbmxkTW9kZSAmJiBzdHJlYW0ucGVlaygpID09IFwiQFwiICYmIHN0cmVhbS5tYXRjaChpc0pzb25sZEtleXdvcmQpKXtcbiAgICAgICAgc3RhdGUudG9rZW5pemUgPSB0b2tlbkJhc2U7XG4gICAgICAgIHJldHVybiByZXQoXCJqc29ubGQta2V5d29yZFwiLCBcIm1ldGFcIik7XG4gICAgICB9XG4gICAgICB3aGlsZSAoKG5leHQgPSBzdHJlYW0ubmV4dCgpKSAhPSBudWxsKSB7XG4gICAgICAgIGlmIChuZXh0ID09IHF1b3RlICYmICFlc2NhcGVkKSBicmVhaztcbiAgICAgICAgZXNjYXBlZCA9ICFlc2NhcGVkICYmIG5leHQgPT0gXCJcXFxcXCI7XG4gICAgICB9XG4gICAgICBpZiAoIWVzY2FwZWQpIHN0YXRlLnRva2VuaXplID0gdG9rZW5CYXNlO1xuICAgICAgcmV0dXJuIHJldChcInN0cmluZ1wiLCBcInN0cmluZ1wiKTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gdG9rZW5Db21tZW50KHN0cmVhbSwgc3RhdGUpIHtcbiAgICB2YXIgbWF5YmVFbmQgPSBmYWxzZSwgY2g7XG4gICAgd2hpbGUgKGNoID0gc3RyZWFtLm5leHQoKSkge1xuICAgICAgaWYgKGNoID09IFwiL1wiICYmIG1heWJlRW5kKSB7XG4gICAgICAgIHN0YXRlLnRva2VuaXplID0gdG9rZW5CYXNlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIG1heWJlRW5kID0gKGNoID09IFwiKlwiKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldChcImNvbW1lbnRcIiwgXCJjb21tZW50XCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gdG9rZW5RdWFzaShzdHJlYW0sIHN0YXRlKSB7XG4gICAgdmFyIGVzY2FwZWQgPSBmYWxzZSwgbmV4dDtcbiAgICB3aGlsZSAoKG5leHQgPSBzdHJlYW0ubmV4dCgpKSAhPSBudWxsKSB7XG4gICAgICBpZiAoIWVzY2FwZWQgJiYgKG5leHQgPT0gXCJgXCIgfHwgbmV4dCA9PSBcIiRcIiAmJiBzdHJlYW0uZWF0KFwie1wiKSkpIHtcbiAgICAgICAgc3RhdGUudG9rZW5pemUgPSB0b2tlbkJhc2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZXNjYXBlZCA9ICFlc2NhcGVkICYmIG5leHQgPT0gXCJcXFxcXCI7XG4gICAgfVxuICAgIHJldHVybiByZXQoXCJxdWFzaVwiLCBcInN0cmluZy0yXCIsIHN0cmVhbS5jdXJyZW50KCkpO1xuICB9XG5cbiAgdmFyIGJyYWNrZXRzID0gXCIoW3t9XSlcIjtcbiAgLy8gVGhpcyBpcyBhIGNydWRlIGxvb2thaGVhZCB0cmljayB0byB0cnkgYW5kIG5vdGljZSB0aGF0IHdlJ3JlXG4gIC8vIHBhcnNpbmcgdGhlIGFyZ3VtZW50IHBhdHRlcm5zIGZvciBhIGZhdC1hcnJvdyBmdW5jdGlvbiBiZWZvcmUgd2VcbiAgLy8gYWN0dWFsbHkgaGl0IHRoZSBhcnJvdyB0b2tlbi4gSXQgb25seSB3b3JrcyBpZiB0aGUgYXJyb3cgaXMgb25cbiAgLy8gdGhlIHNhbWUgbGluZSBhcyB0aGUgYXJndW1lbnRzIGFuZCB0aGVyZSdzIG5vIHN0cmFuZ2Ugbm9pc2VcbiAgLy8gKGNvbW1lbnRzKSBpbiBiZXR3ZWVuLiBGYWxsYmFjayBpcyB0byBvbmx5IG5vdGljZSB3aGVuIHdlIGhpdCB0aGVcbiAgLy8gYXJyb3csIGFuZCBub3QgZGVjbGFyZSB0aGUgYXJndW1lbnRzIGFzIGxvY2FscyBmb3IgdGhlIGFycm93XG4gIC8vIGJvZHkuXG4gIGZ1bmN0aW9uIGZpbmRGYXRBcnJvdyhzdHJlYW0sIHN0YXRlKSB7XG4gICAgaWYgKHN0YXRlLmZhdEFycm93QXQpIHN0YXRlLmZhdEFycm93QXQgPSBudWxsO1xuICAgIHZhciBhcnJvdyA9IHN0cmVhbS5zdHJpbmcuaW5kZXhPZihcIj0+XCIsIHN0cmVhbS5zdGFydCk7XG4gICAgaWYgKGFycm93IDwgMCkgcmV0dXJuO1xuXG4gICAgaWYgKGlzVFMpIHsgLy8gVHJ5IHRvIHNraXAgVHlwZVNjcmlwdCByZXR1cm4gdHlwZSBkZWNsYXJhdGlvbnMgYWZ0ZXIgdGhlIGFyZ3VtZW50c1xuICAgICAgdmFyIG0gPSAvOlxccyooPzpcXHcrKD86PFtePl0qPnxcXFtcXF0pP3xcXHtbXn1dKlxcfSlcXHMqJC8uZXhlYyhzdHJlYW0uc3RyaW5nLnNsaWNlKHN0cmVhbS5zdGFydCwgYXJyb3cpKVxuICAgICAgaWYgKG0pIGFycm93ID0gbS5pbmRleFxuICAgIH1cblxuICAgIHZhciBkZXB0aCA9IDAsIHNhd1NvbWV0aGluZyA9IGZhbHNlO1xuICAgIGZvciAodmFyIHBvcyA9IGFycm93IC0gMTsgcG9zID49IDA7IC0tcG9zKSB7XG4gICAgICB2YXIgY2ggPSBzdHJlYW0uc3RyaW5nLmNoYXJBdChwb3MpO1xuICAgICAgdmFyIGJyYWNrZXQgPSBicmFja2V0cy5pbmRleE9mKGNoKTtcbiAgICAgIGlmIChicmFja2V0ID49IDAgJiYgYnJhY2tldCA8IDMpIHtcbiAgICAgICAgaWYgKCFkZXB0aCkgeyArK3BvczsgYnJlYWs7IH1cbiAgICAgICAgaWYgKC0tZGVwdGggPT0gMCkgeyBpZiAoY2ggPT0gXCIoXCIpIHNhd1NvbWV0aGluZyA9IHRydWU7IGJyZWFrOyB9XG4gICAgICB9IGVsc2UgaWYgKGJyYWNrZXQgPj0gMyAmJiBicmFja2V0IDwgNikge1xuICAgICAgICArK2RlcHRoO1xuICAgICAgfSBlbHNlIGlmICh3b3JkUkUudGVzdChjaCkpIHtcbiAgICAgICAgc2F3U29tZXRoaW5nID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoL1tcIidcXC9gXS8udGVzdChjaCkpIHtcbiAgICAgICAgZm9yICg7OyAtLXBvcykge1xuICAgICAgICAgIGlmIChwb3MgPT0gMCkgcmV0dXJuXG4gICAgICAgICAgdmFyIG5leHQgPSBzdHJlYW0uc3RyaW5nLmNoYXJBdChwb3MgLSAxKVxuICAgICAgICAgIGlmIChuZXh0ID09IGNoICYmIHN0cmVhbS5zdHJpbmcuY2hhckF0KHBvcyAtIDIpICE9IFwiXFxcXFwiKSB7IHBvcy0tOyBicmVhayB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoc2F3U29tZXRoaW5nICYmICFkZXB0aCkge1xuICAgICAgICArK3BvcztcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzYXdTb21ldGhpbmcgJiYgIWRlcHRoKSBzdGF0ZS5mYXRBcnJvd0F0ID0gcG9zO1xuICB9XG5cbiAgLy8gUGFyc2VyXG5cbiAgdmFyIGF0b21pY1R5cGVzID0ge1wiYXRvbVwiOiB0cnVlLCBcIm51bWJlclwiOiB0cnVlLCBcInZhcmlhYmxlXCI6IHRydWUsIFwic3RyaW5nXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICBcInJlZ2V4cFwiOiB0cnVlLCBcInRoaXNcIjogdHJ1ZSwgXCJpbXBvcnRcIjogdHJ1ZSwgXCJqc29ubGQta2V5d29yZFwiOiB0cnVlfTtcblxuICBmdW5jdGlvbiBKU0xleGljYWwoaW5kZW50ZWQsIGNvbHVtbiwgdHlwZSwgYWxpZ24sIHByZXYsIGluZm8pIHtcbiAgICB0aGlzLmluZGVudGVkID0gaW5kZW50ZWQ7XG4gICAgdGhpcy5jb2x1bW4gPSBjb2x1bW47XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB0aGlzLnByZXYgPSBwcmV2O1xuICAgIHRoaXMuaW5mbyA9IGluZm87XG4gICAgaWYgKGFsaWduICE9IG51bGwpIHRoaXMuYWxpZ24gPSBhbGlnbjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluU2NvcGUoc3RhdGUsIHZhcm5hbWUpIHtcbiAgICBpZiAoIXRyYWNrU2NvcGUpIHJldHVybiBmYWxzZVxuICAgIGZvciAodmFyIHYgPSBzdGF0ZS5sb2NhbFZhcnM7IHY7IHYgPSB2Lm5leHQpXG4gICAgICBpZiAodi5uYW1lID09IHZhcm5hbWUpIHJldHVybiB0cnVlO1xuICAgIGZvciAodmFyIGN4ID0gc3RhdGUuY29udGV4dDsgY3g7IGN4ID0gY3gucHJldikge1xuICAgICAgZm9yICh2YXIgdiA9IGN4LnZhcnM7IHY7IHYgPSB2Lm5leHQpXG4gICAgICAgIGlmICh2Lm5hbWUgPT0gdmFybmFtZSkgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VKUyhzdGF0ZSwgc3R5bGUsIHR5cGUsIGNvbnRlbnQsIHN0cmVhbSkge1xuICAgIHZhciBjYyA9IHN0YXRlLmNjO1xuICAgIC8vIENvbW11bmljYXRlIG91ciBjb250ZXh0IHRvIHRoZSBjb21iaW5hdG9ycy5cbiAgICAvLyAoTGVzcyB3YXN0ZWZ1bCB0aGFuIGNvbnNpbmcgdXAgYSBodW5kcmVkIGNsb3N1cmVzIG9uIGV2ZXJ5IGNhbGwuKVxuICAgIGN4LnN0YXRlID0gc3RhdGU7IGN4LnN0cmVhbSA9IHN0cmVhbTsgY3gubWFya2VkID0gbnVsbCwgY3guY2MgPSBjYzsgY3guc3R5bGUgPSBzdHlsZTtcblxuICAgIGlmICghc3RhdGUubGV4aWNhbC5oYXNPd25Qcm9wZXJ0eShcImFsaWduXCIpKVxuICAgICAgc3RhdGUubGV4aWNhbC5hbGlnbiA9IHRydWU7XG5cbiAgICB3aGlsZSh0cnVlKSB7XG4gICAgICB2YXIgY29tYmluYXRvciA9IGNjLmxlbmd0aCA/IGNjLnBvcCgpIDoganNvbk1vZGUgPyBleHByZXNzaW9uIDogc3RhdGVtZW50O1xuICAgICAgaWYgKGNvbWJpbmF0b3IodHlwZSwgY29udGVudCkpIHtcbiAgICAgICAgd2hpbGUoY2MubGVuZ3RoICYmIGNjW2NjLmxlbmd0aCAtIDFdLmxleClcbiAgICAgICAgICBjYy5wb3AoKSgpO1xuICAgICAgICBpZiAoY3gubWFya2VkKSByZXR1cm4gY3gubWFya2VkO1xuICAgICAgICBpZiAodHlwZSA9PSBcInZhcmlhYmxlXCIgJiYgaW5TY29wZShzdGF0ZSwgY29udGVudCkpIHJldHVybiBcInZhcmlhYmxlLTJcIjtcbiAgICAgICAgcmV0dXJuIHN0eWxlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIENvbWJpbmF0b3IgdXRpbHNcblxuICB2YXIgY3ggPSB7c3RhdGU6IG51bGwsIGNvbHVtbjogbnVsbCwgbWFya2VkOiBudWxsLCBjYzogbnVsbH07XG4gIGZ1bmN0aW9uIHBhc3MoKSB7XG4gICAgZm9yICh2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgY3guY2MucHVzaChhcmd1bWVudHNbaV0pO1xuICB9XG4gIGZ1bmN0aW9uIGNvbnQoKSB7XG4gICAgcGFzcy5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGZ1bmN0aW9uIGluTGlzdChuYW1lLCBsaXN0KSB7XG4gICAgZm9yICh2YXIgdiA9IGxpc3Q7IHY7IHYgPSB2Lm5leHQpIGlmICh2Lm5hbWUgPT0gbmFtZSkgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgZnVuY3Rpb24gcmVnaXN0ZXIodmFybmFtZSkge1xuICAgIHZhciBzdGF0ZSA9IGN4LnN0YXRlO1xuICAgIGN4Lm1hcmtlZCA9IFwiZGVmXCI7XG4gICAgaWYgKCF0cmFja1Njb3BlKSByZXR1cm5cbiAgICBpZiAoc3RhdGUuY29udGV4dCkge1xuICAgICAgaWYgKHN0YXRlLmxleGljYWwuaW5mbyA9PSBcInZhclwiICYmIHN0YXRlLmNvbnRleHQgJiYgc3RhdGUuY29udGV4dC5ibG9jaykge1xuICAgICAgICAvLyBGSVhNRSBmdW5jdGlvbiBkZWNscyBhcmUgYWxzbyBub3QgYmxvY2sgc2NvcGVkXG4gICAgICAgIHZhciBuZXdDb250ZXh0ID0gcmVnaXN0ZXJWYXJTY29wZWQodmFybmFtZSwgc3RhdGUuY29udGV4dClcbiAgICAgICAgaWYgKG5ld0NvbnRleHQgIT0gbnVsbCkge1xuICAgICAgICAgIHN0YXRlLmNvbnRleHQgPSBuZXdDb250ZXh0XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIWluTGlzdCh2YXJuYW1lLCBzdGF0ZS5sb2NhbFZhcnMpKSB7XG4gICAgICAgIHN0YXRlLmxvY2FsVmFycyA9IG5ldyBWYXIodmFybmFtZSwgc3RhdGUubG9jYWxWYXJzKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9XG4gICAgLy8gRmFsbCB0aHJvdWdoIG1lYW5zIHRoaXMgaXMgZ2xvYmFsXG4gICAgaWYgKHBhcnNlckNvbmZpZy5nbG9iYWxWYXJzICYmICFpbkxpc3QodmFybmFtZSwgc3RhdGUuZ2xvYmFsVmFycykpXG4gICAgICBzdGF0ZS5nbG9iYWxWYXJzID0gbmV3IFZhcih2YXJuYW1lLCBzdGF0ZS5nbG9iYWxWYXJzKVxuICB9XG4gIGZ1bmN0aW9uIHJlZ2lzdGVyVmFyU2NvcGVkKHZhcm5hbWUsIGNvbnRleHQpIHtcbiAgICBpZiAoIWNvbnRleHQpIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfSBlbHNlIGlmIChjb250ZXh0LmJsb2NrKSB7XG4gICAgICB2YXIgaW5uZXIgPSByZWdpc3RlclZhclNjb3BlZCh2YXJuYW1lLCBjb250ZXh0LnByZXYpXG4gICAgICBpZiAoIWlubmVyKSByZXR1cm4gbnVsbFxuICAgICAgaWYgKGlubmVyID09IGNvbnRleHQucHJldikgcmV0dXJuIGNvbnRleHRcbiAgICAgIHJldHVybiBuZXcgQ29udGV4dChpbm5lciwgY29udGV4dC52YXJzLCB0cnVlKVxuICAgIH0gZWxzZSBpZiAoaW5MaXN0KHZhcm5hbWUsIGNvbnRleHQudmFycykpIHtcbiAgICAgIHJldHVybiBjb250ZXh0XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgQ29udGV4dChjb250ZXh0LnByZXYsIG5ldyBWYXIodmFybmFtZSwgY29udGV4dC52YXJzKSwgZmFsc2UpXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaXNNb2RpZmllcihuYW1lKSB7XG4gICAgcmV0dXJuIG5hbWUgPT0gXCJwdWJsaWNcIiB8fCBuYW1lID09IFwicHJpdmF0ZVwiIHx8IG5hbWUgPT0gXCJwcm90ZWN0ZWRcIiB8fCBuYW1lID09IFwiYWJzdHJhY3RcIiB8fCBuYW1lID09IFwicmVhZG9ubHlcIlxuICB9XG5cbiAgLy8gQ29tYmluYXRvcnNcblxuICBmdW5jdGlvbiBDb250ZXh0KHByZXYsIHZhcnMsIGJsb2NrKSB7IHRoaXMucHJldiA9IHByZXY7IHRoaXMudmFycyA9IHZhcnM7IHRoaXMuYmxvY2sgPSBibG9jayB9XG4gIGZ1bmN0aW9uIFZhcihuYW1lLCBuZXh0KSB7IHRoaXMubmFtZSA9IG5hbWU7IHRoaXMubmV4dCA9IG5leHQgfVxuXG4gIHZhciBkZWZhdWx0VmFycyA9IG5ldyBWYXIoXCJ0aGlzXCIsIG5ldyBWYXIoXCJhcmd1bWVudHNcIiwgbnVsbCkpXG4gIGZ1bmN0aW9uIHB1c2hjb250ZXh0KCkge1xuICAgIGN4LnN0YXRlLmNvbnRleHQgPSBuZXcgQ29udGV4dChjeC5zdGF0ZS5jb250ZXh0LCBjeC5zdGF0ZS5sb2NhbFZhcnMsIGZhbHNlKVxuICAgIGN4LnN0YXRlLmxvY2FsVmFycyA9IGRlZmF1bHRWYXJzXG4gIH1cbiAgZnVuY3Rpb24gcHVzaGJsb2NrY29udGV4dCgpIHtcbiAgICBjeC5zdGF0ZS5jb250ZXh0ID0gbmV3IENvbnRleHQoY3guc3RhdGUuY29udGV4dCwgY3guc3RhdGUubG9jYWxWYXJzLCB0cnVlKVxuICAgIGN4LnN0YXRlLmxvY2FsVmFycyA9IG51bGxcbiAgfVxuICBmdW5jdGlvbiBwb3Bjb250ZXh0KCkge1xuICAgIGN4LnN0YXRlLmxvY2FsVmFycyA9IGN4LnN0YXRlLmNvbnRleHQudmFyc1xuICAgIGN4LnN0YXRlLmNvbnRleHQgPSBjeC5zdGF0ZS5jb250ZXh0LnByZXZcbiAgfVxuICBwb3Bjb250ZXh0LmxleCA9IHRydWVcbiAgZnVuY3Rpb24gcHVzaGxleCh0eXBlLCBpbmZvKSB7XG4gICAgdmFyIHJlc3VsdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHN0YXRlID0gY3guc3RhdGUsIGluZGVudCA9IHN0YXRlLmluZGVudGVkO1xuICAgICAgaWYgKHN0YXRlLmxleGljYWwudHlwZSA9PSBcInN0YXRcIikgaW5kZW50ID0gc3RhdGUubGV4aWNhbC5pbmRlbnRlZDtcbiAgICAgIGVsc2UgZm9yICh2YXIgb3V0ZXIgPSBzdGF0ZS5sZXhpY2FsOyBvdXRlciAmJiBvdXRlci50eXBlID09IFwiKVwiICYmIG91dGVyLmFsaWduOyBvdXRlciA9IG91dGVyLnByZXYpXG4gICAgICAgIGluZGVudCA9IG91dGVyLmluZGVudGVkO1xuICAgICAgc3RhdGUubGV4aWNhbCA9IG5ldyBKU0xleGljYWwoaW5kZW50LCBjeC5zdHJlYW0uY29sdW1uKCksIHR5cGUsIG51bGwsIHN0YXRlLmxleGljYWwsIGluZm8pO1xuICAgIH07XG4gICAgcmVzdWx0LmxleCA9IHRydWU7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBmdW5jdGlvbiBwb3BsZXgoKSB7XG4gICAgdmFyIHN0YXRlID0gY3guc3RhdGU7XG4gICAgaWYgKHN0YXRlLmxleGljYWwucHJldikge1xuICAgICAgaWYgKHN0YXRlLmxleGljYWwudHlwZSA9PSBcIilcIilcbiAgICAgICAgc3RhdGUuaW5kZW50ZWQgPSBzdGF0ZS5sZXhpY2FsLmluZGVudGVkO1xuICAgICAgc3RhdGUubGV4aWNhbCA9IHN0YXRlLmxleGljYWwucHJldjtcbiAgICB9XG4gIH1cbiAgcG9wbGV4LmxleCA9IHRydWU7XG5cbiAgZnVuY3Rpb24gZXhwZWN0KHdhbnRlZCkge1xuICAgIGZ1bmN0aW9uIGV4cCh0eXBlKSB7XG4gICAgICBpZiAodHlwZSA9PSB3YW50ZWQpIHJldHVybiBjb250KCk7XG4gICAgICBlbHNlIGlmICh3YW50ZWQgPT0gXCI7XCIgfHwgdHlwZSA9PSBcIn1cIiB8fCB0eXBlID09IFwiKVwiIHx8IHR5cGUgPT0gXCJdXCIpIHJldHVybiBwYXNzKCk7XG4gICAgICBlbHNlIHJldHVybiBjb250KGV4cCk7XG4gICAgfTtcbiAgICByZXR1cm4gZXhwO1xuICB9XG5cbiAgZnVuY3Rpb24gc3RhdGVtZW50KHR5cGUsIHZhbHVlKSB7XG4gICAgaWYgKHR5cGUgPT0gXCJ2YXJcIikgcmV0dXJuIGNvbnQocHVzaGxleChcInZhcmRlZlwiLCB2YWx1ZSksIHZhcmRlZiwgZXhwZWN0KFwiO1wiKSwgcG9wbGV4KTtcbiAgICBpZiAodHlwZSA9PSBcImtleXdvcmQgYVwiKSByZXR1cm4gY29udChwdXNobGV4KFwiZm9ybVwiKSwgcGFyZW5FeHByLCBzdGF0ZW1lbnQsIHBvcGxleCk7XG4gICAgaWYgKHR5cGUgPT0gXCJrZXl3b3JkIGJcIikgcmV0dXJuIGNvbnQocHVzaGxleChcImZvcm1cIiksIHN0YXRlbWVudCwgcG9wbGV4KTtcbiAgICBpZiAodHlwZSA9PSBcImtleXdvcmQgZFwiKSByZXR1cm4gY3guc3RyZWFtLm1hdGNoKC9eXFxzKiQvLCBmYWxzZSkgPyBjb250KCkgOiBjb250KHB1c2hsZXgoXCJzdGF0XCIpLCBtYXliZWV4cHJlc3Npb24sIGV4cGVjdChcIjtcIiksIHBvcGxleCk7XG4gICAgaWYgKHR5cGUgPT0gXCJkZWJ1Z2dlclwiKSByZXR1cm4gY29udChleHBlY3QoXCI7XCIpKTtcbiAgICBpZiAodHlwZSA9PSBcIntcIikgcmV0dXJuIGNvbnQocHVzaGxleChcIn1cIiksIHB1c2hibG9ja2NvbnRleHQsIGJsb2NrLCBwb3BsZXgsIHBvcGNvbnRleHQpO1xuICAgIGlmICh0eXBlID09IFwiO1wiKSByZXR1cm4gY29udCgpO1xuICAgIGlmICh0eXBlID09IFwiaWZcIikge1xuICAgICAgaWYgKGN4LnN0YXRlLmxleGljYWwuaW5mbyA9PSBcImVsc2VcIiAmJiBjeC5zdGF0ZS5jY1tjeC5zdGF0ZS5jYy5sZW5ndGggLSAxXSA9PSBwb3BsZXgpXG4gICAgICAgIGN4LnN0YXRlLmNjLnBvcCgpKCk7XG4gICAgICByZXR1cm4gY29udChwdXNobGV4KFwiZm9ybVwiKSwgcGFyZW5FeHByLCBzdGF0ZW1lbnQsIHBvcGxleCwgbWF5YmVlbHNlKTtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gY29udChmdW5jdGlvbmRlZik7XG4gICAgaWYgKHR5cGUgPT0gXCJmb3JcIikgcmV0dXJuIGNvbnQocHVzaGxleChcImZvcm1cIiksIHB1c2hibG9ja2NvbnRleHQsIGZvcnNwZWMsIHN0YXRlbWVudCwgcG9wY29udGV4dCwgcG9wbGV4KTtcbiAgICBpZiAodHlwZSA9PSBcImNsYXNzXCIgfHwgKGlzVFMgJiYgdmFsdWUgPT0gXCJpbnRlcmZhY2VcIikpIHtcbiAgICAgIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiXG4gICAgICByZXR1cm4gY29udChwdXNobGV4KFwiZm9ybVwiLCB0eXBlID09IFwiY2xhc3NcIiA/IHR5cGUgOiB2YWx1ZSksIGNsYXNzTmFtZSwgcG9wbGV4KVxuICAgIH1cbiAgICBpZiAodHlwZSA9PSBcInZhcmlhYmxlXCIpIHtcbiAgICAgIGlmIChpc1RTICYmIHZhbHVlID09IFwiZGVjbGFyZVwiKSB7XG4gICAgICAgIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiXG4gICAgICAgIHJldHVybiBjb250KHN0YXRlbWVudClcbiAgICAgIH0gZWxzZSBpZiAoaXNUUyAmJiAodmFsdWUgPT0gXCJtb2R1bGVcIiB8fCB2YWx1ZSA9PSBcImVudW1cIiB8fCB2YWx1ZSA9PSBcInR5cGVcIikgJiYgY3guc3RyZWFtLm1hdGNoKC9eXFxzKlxcdy8sIGZhbHNlKSkge1xuICAgICAgICBjeC5tYXJrZWQgPSBcImtleXdvcmRcIlxuICAgICAgICBpZiAodmFsdWUgPT0gXCJlbnVtXCIpIHJldHVybiBjb250KGVudW1kZWYpO1xuICAgICAgICBlbHNlIGlmICh2YWx1ZSA9PSBcInR5cGVcIikgcmV0dXJuIGNvbnQodHlwZW5hbWUsIGV4cGVjdChcIm9wZXJhdG9yXCIpLCB0eXBlZXhwciwgZXhwZWN0KFwiO1wiKSk7XG4gICAgICAgIGVsc2UgcmV0dXJuIGNvbnQocHVzaGxleChcImZvcm1cIiksIHBhdHRlcm4sIGV4cGVjdChcIntcIiksIHB1c2hsZXgoXCJ9XCIpLCBibG9jaywgcG9wbGV4LCBwb3BsZXgpXG4gICAgICB9IGVsc2UgaWYgKGlzVFMgJiYgdmFsdWUgPT0gXCJuYW1lc3BhY2VcIikge1xuICAgICAgICBjeC5tYXJrZWQgPSBcImtleXdvcmRcIlxuICAgICAgICByZXR1cm4gY29udChwdXNobGV4KFwiZm9ybVwiKSwgZXhwcmVzc2lvbiwgc3RhdGVtZW50LCBwb3BsZXgpXG4gICAgICB9IGVsc2UgaWYgKGlzVFMgJiYgdmFsdWUgPT0gXCJhYnN0cmFjdFwiKSB7XG4gICAgICAgIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiXG4gICAgICAgIHJldHVybiBjb250KHN0YXRlbWVudClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjb250KHB1c2hsZXgoXCJzdGF0XCIpLCBtYXliZWxhYmVsKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHR5cGUgPT0gXCJzd2l0Y2hcIikgcmV0dXJuIGNvbnQocHVzaGxleChcImZvcm1cIiksIHBhcmVuRXhwciwgZXhwZWN0KFwie1wiKSwgcHVzaGxleChcIn1cIiwgXCJzd2l0Y2hcIiksIHB1c2hibG9ja2NvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrLCBwb3BsZXgsIHBvcGxleCwgcG9wY29udGV4dCk7XG4gICAgaWYgKHR5cGUgPT0gXCJjYXNlXCIpIHJldHVybiBjb250KGV4cHJlc3Npb24sIGV4cGVjdChcIjpcIikpO1xuICAgIGlmICh0eXBlID09IFwiZGVmYXVsdFwiKSByZXR1cm4gY29udChleHBlY3QoXCI6XCIpKTtcbiAgICBpZiAodHlwZSA9PSBcImNhdGNoXCIpIHJldHVybiBjb250KHB1c2hsZXgoXCJmb3JtXCIpLCBwdXNoY29udGV4dCwgbWF5YmVDYXRjaEJpbmRpbmcsIHN0YXRlbWVudCwgcG9wbGV4LCBwb3Bjb250ZXh0KTtcbiAgICBpZiAodHlwZSA9PSBcImV4cG9ydFwiKSByZXR1cm4gY29udChwdXNobGV4KFwic3RhdFwiKSwgYWZ0ZXJFeHBvcnQsIHBvcGxleCk7XG4gICAgaWYgKHR5cGUgPT0gXCJpbXBvcnRcIikgcmV0dXJuIGNvbnQocHVzaGxleChcInN0YXRcIiksIGFmdGVySW1wb3J0LCBwb3BsZXgpO1xuICAgIGlmICh0eXBlID09IFwiYXN5bmNcIikgcmV0dXJuIGNvbnQoc3RhdGVtZW50KVxuICAgIGlmICh2YWx1ZSA9PSBcIkBcIikgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbiwgc3RhdGVtZW50KVxuICAgIHJldHVybiBwYXNzKHB1c2hsZXgoXCJzdGF0XCIpLCBleHByZXNzaW9uLCBleHBlY3QoXCI7XCIpLCBwb3BsZXgpO1xuICB9XG4gIGZ1bmN0aW9uIG1heWJlQ2F0Y2hCaW5kaW5nKHR5cGUpIHtcbiAgICBpZiAodHlwZSA9PSBcIihcIikgcmV0dXJuIGNvbnQoZnVuYXJnLCBleHBlY3QoXCIpXCIpKVxuICB9XG4gIGZ1bmN0aW9uIGV4cHJlc3Npb24odHlwZSwgdmFsdWUpIHtcbiAgICByZXR1cm4gZXhwcmVzc2lvbklubmVyKHR5cGUsIHZhbHVlLCBmYWxzZSk7XG4gIH1cbiAgZnVuY3Rpb24gZXhwcmVzc2lvbk5vQ29tbWEodHlwZSwgdmFsdWUpIHtcbiAgICByZXR1cm4gZXhwcmVzc2lvbklubmVyKHR5cGUsIHZhbHVlLCB0cnVlKTtcbiAgfVxuICBmdW5jdGlvbiBwYXJlbkV4cHIodHlwZSkge1xuICAgIGlmICh0eXBlICE9IFwiKFwiKSByZXR1cm4gcGFzcygpXG4gICAgcmV0dXJuIGNvbnQocHVzaGxleChcIilcIiksIG1heWJlZXhwcmVzc2lvbiwgZXhwZWN0KFwiKVwiKSwgcG9wbGV4KVxuICB9XG4gIGZ1bmN0aW9uIGV4cHJlc3Npb25Jbm5lcih0eXBlLCB2YWx1ZSwgbm9Db21tYSkge1xuICAgIGlmIChjeC5zdGF0ZS5mYXRBcnJvd0F0ID09IGN4LnN0cmVhbS5zdGFydCkge1xuICAgICAgdmFyIGJvZHkgPSBub0NvbW1hID8gYXJyb3dCb2R5Tm9Db21tYSA6IGFycm93Qm9keTtcbiAgICAgIGlmICh0eXBlID09IFwiKFwiKSByZXR1cm4gY29udChwdXNoY29udGV4dCwgcHVzaGxleChcIilcIiksIGNvbW1hc2VwKGZ1bmFyZywgXCIpXCIpLCBwb3BsZXgsIGV4cGVjdChcIj0+XCIpLCBib2R5LCBwb3Bjb250ZXh0KTtcbiAgICAgIGVsc2UgaWYgKHR5cGUgPT0gXCJ2YXJpYWJsZVwiKSByZXR1cm4gcGFzcyhwdXNoY29udGV4dCwgcGF0dGVybiwgZXhwZWN0KFwiPT5cIiksIGJvZHksIHBvcGNvbnRleHQpO1xuICAgIH1cblxuICAgIHZhciBtYXliZW9wID0gbm9Db21tYSA/IG1heWJlb3BlcmF0b3JOb0NvbW1hIDogbWF5YmVvcGVyYXRvckNvbW1hO1xuICAgIGlmIChhdG9taWNUeXBlcy5oYXNPd25Qcm9wZXJ0eSh0eXBlKSkgcmV0dXJuIGNvbnQobWF5YmVvcCk7XG4gICAgaWYgKHR5cGUgPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gY29udChmdW5jdGlvbmRlZiwgbWF5YmVvcCk7XG4gICAgaWYgKHR5cGUgPT0gXCJjbGFzc1wiIHx8IChpc1RTICYmIHZhbHVlID09IFwiaW50ZXJmYWNlXCIpKSB7IGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiOyByZXR1cm4gY29udChwdXNobGV4KFwiZm9ybVwiKSwgY2xhc3NFeHByZXNzaW9uLCBwb3BsZXgpOyB9XG4gICAgaWYgKHR5cGUgPT0gXCJrZXl3b3JkIGNcIiB8fCB0eXBlID09IFwiYXN5bmNcIikgcmV0dXJuIGNvbnQobm9Db21tYSA/IGV4cHJlc3Npb25Ob0NvbW1hIDogZXhwcmVzc2lvbik7XG4gICAgaWYgKHR5cGUgPT0gXCIoXCIpIHJldHVybiBjb250KHB1c2hsZXgoXCIpXCIpLCBtYXliZWV4cHJlc3Npb24sIGV4cGVjdChcIilcIiksIHBvcGxleCwgbWF5YmVvcCk7XG4gICAgaWYgKHR5cGUgPT0gXCJvcGVyYXRvclwiIHx8IHR5cGUgPT0gXCJzcHJlYWRcIikgcmV0dXJuIGNvbnQobm9Db21tYSA/IGV4cHJlc3Npb25Ob0NvbW1hIDogZXhwcmVzc2lvbik7XG4gICAgaWYgKHR5cGUgPT0gXCJbXCIpIHJldHVybiBjb250KHB1c2hsZXgoXCJdXCIpLCBhcnJheUxpdGVyYWwsIHBvcGxleCwgbWF5YmVvcCk7XG4gICAgaWYgKHR5cGUgPT0gXCJ7XCIpIHJldHVybiBjb250Q29tbWFzZXAob2JqcHJvcCwgXCJ9XCIsIG51bGwsIG1heWJlb3ApO1xuICAgIGlmICh0eXBlID09IFwicXVhc2lcIikgcmV0dXJuIHBhc3MocXVhc2ksIG1heWJlb3ApO1xuICAgIGlmICh0eXBlID09IFwibmV3XCIpIHJldHVybiBjb250KG1heWJlVGFyZ2V0KG5vQ29tbWEpKTtcbiAgICByZXR1cm4gY29udCgpO1xuICB9XG4gIGZ1bmN0aW9uIG1heWJlZXhwcmVzc2lvbih0eXBlKSB7XG4gICAgaWYgKHR5cGUubWF0Y2goL1s7XFx9XFwpXFxdLF0vKSkgcmV0dXJuIHBhc3MoKTtcbiAgICByZXR1cm4gcGFzcyhleHByZXNzaW9uKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1heWJlb3BlcmF0b3JDb21tYSh0eXBlLCB2YWx1ZSkge1xuICAgIGlmICh0eXBlID09IFwiLFwiKSByZXR1cm4gY29udChtYXliZWV4cHJlc3Npb24pO1xuICAgIHJldHVybiBtYXliZW9wZXJhdG9yTm9Db21tYSh0eXBlLCB2YWx1ZSwgZmFsc2UpO1xuICB9XG4gIGZ1bmN0aW9uIG1heWJlb3BlcmF0b3JOb0NvbW1hKHR5cGUsIHZhbHVlLCBub0NvbW1hKSB7XG4gICAgdmFyIG1lID0gbm9Db21tYSA9PSBmYWxzZSA/IG1heWJlb3BlcmF0b3JDb21tYSA6IG1heWJlb3BlcmF0b3JOb0NvbW1hO1xuICAgIHZhciBleHByID0gbm9Db21tYSA9PSBmYWxzZSA/IGV4cHJlc3Npb24gOiBleHByZXNzaW9uTm9Db21tYTtcbiAgICBpZiAodHlwZSA9PSBcIj0+XCIpIHJldHVybiBjb250KHB1c2hjb250ZXh0LCBub0NvbW1hID8gYXJyb3dCb2R5Tm9Db21tYSA6IGFycm93Qm9keSwgcG9wY29udGV4dCk7XG4gICAgaWYgKHR5cGUgPT0gXCJvcGVyYXRvclwiKSB7XG4gICAgICBpZiAoL1xcK1xcK3wtLS8udGVzdCh2YWx1ZSkgfHwgaXNUUyAmJiB2YWx1ZSA9PSBcIiFcIikgcmV0dXJuIGNvbnQobWUpO1xuICAgICAgaWYgKGlzVFMgJiYgdmFsdWUgPT0gXCI8XCIgJiYgY3guc3RyZWFtLm1hdGNoKC9eKFtePD5dfDxbXjw+XSo+KSo+XFxzKlxcKC8sIGZhbHNlKSlcbiAgICAgICAgcmV0dXJuIGNvbnQocHVzaGxleChcIj5cIiksIGNvbW1hc2VwKHR5cGVleHByLCBcIj5cIiksIHBvcGxleCwgbWUpO1xuICAgICAgaWYgKHZhbHVlID09IFwiP1wiKSByZXR1cm4gY29udChleHByZXNzaW9uLCBleHBlY3QoXCI6XCIpLCBleHByKTtcbiAgICAgIHJldHVybiBjb250KGV4cHIpO1xuICAgIH1cbiAgICBpZiAodHlwZSA9PSBcInF1YXNpXCIpIHsgcmV0dXJuIHBhc3MocXVhc2ksIG1lKTsgfVxuICAgIGlmICh0eXBlID09IFwiO1wiKSByZXR1cm47XG4gICAgaWYgKHR5cGUgPT0gXCIoXCIpIHJldHVybiBjb250Q29tbWFzZXAoZXhwcmVzc2lvbk5vQ29tbWEsIFwiKVwiLCBcImNhbGxcIiwgbWUpO1xuICAgIGlmICh0eXBlID09IFwiLlwiKSByZXR1cm4gY29udChwcm9wZXJ0eSwgbWUpO1xuICAgIGlmICh0eXBlID09IFwiW1wiKSByZXR1cm4gY29udChwdXNobGV4KFwiXVwiKSwgbWF5YmVleHByZXNzaW9uLCBleHBlY3QoXCJdXCIpLCBwb3BsZXgsIG1lKTtcbiAgICBpZiAoaXNUUyAmJiB2YWx1ZSA9PSBcImFzXCIpIHsgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7IHJldHVybiBjb250KHR5cGVleHByLCBtZSkgfVxuICAgIGlmICh0eXBlID09IFwicmVnZXhwXCIpIHtcbiAgICAgIGN4LnN0YXRlLmxhc3RUeXBlID0gY3gubWFya2VkID0gXCJvcGVyYXRvclwiXG4gICAgICBjeC5zdHJlYW0uYmFja1VwKGN4LnN0cmVhbS5wb3MgLSBjeC5zdHJlYW0uc3RhcnQgLSAxKVxuICAgICAgcmV0dXJuIGNvbnQoZXhwcilcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gcXVhc2kodHlwZSwgdmFsdWUpIHtcbiAgICBpZiAodHlwZSAhPSBcInF1YXNpXCIpIHJldHVybiBwYXNzKCk7XG4gICAgaWYgKHZhbHVlLnNsaWNlKHZhbHVlLmxlbmd0aCAtIDIpICE9IFwiJHtcIikgcmV0dXJuIGNvbnQocXVhc2kpO1xuICAgIHJldHVybiBjb250KG1heWJlZXhwcmVzc2lvbiwgY29udGludWVRdWFzaSk7XG4gIH1cbiAgZnVuY3Rpb24gY29udGludWVRdWFzaSh0eXBlKSB7XG4gICAgaWYgKHR5cGUgPT0gXCJ9XCIpIHtcbiAgICAgIGN4Lm1hcmtlZCA9IFwic3RyaW5nLTJcIjtcbiAgICAgIGN4LnN0YXRlLnRva2VuaXplID0gdG9rZW5RdWFzaTtcbiAgICAgIHJldHVybiBjb250KHF1YXNpKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gYXJyb3dCb2R5KHR5cGUpIHtcbiAgICBmaW5kRmF0QXJyb3coY3guc3RyZWFtLCBjeC5zdGF0ZSk7XG4gICAgcmV0dXJuIHBhc3ModHlwZSA9PSBcIntcIiA/IHN0YXRlbWVudCA6IGV4cHJlc3Npb24pO1xuICB9XG4gIGZ1bmN0aW9uIGFycm93Qm9keU5vQ29tbWEodHlwZSkge1xuICAgIGZpbmRGYXRBcnJvdyhjeC5zdHJlYW0sIGN4LnN0YXRlKTtcbiAgICByZXR1cm4gcGFzcyh0eXBlID09IFwie1wiID8gc3RhdGVtZW50IDogZXhwcmVzc2lvbk5vQ29tbWEpO1xuICB9XG4gIGZ1bmN0aW9uIG1heWJlVGFyZ2V0KG5vQ29tbWEpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24odHlwZSkge1xuICAgICAgaWYgKHR5cGUgPT0gXCIuXCIpIHJldHVybiBjb250KG5vQ29tbWEgPyB0YXJnZXROb0NvbW1hIDogdGFyZ2V0KTtcbiAgICAgIGVsc2UgaWYgKHR5cGUgPT0gXCJ2YXJpYWJsZVwiICYmIGlzVFMpIHJldHVybiBjb250KG1heWJlVHlwZUFyZ3MsIG5vQ29tbWEgPyBtYXliZW9wZXJhdG9yTm9Db21tYSA6IG1heWJlb3BlcmF0b3JDb21tYSlcbiAgICAgIGVsc2UgcmV0dXJuIHBhc3Mobm9Db21tYSA/IGV4cHJlc3Npb25Ob0NvbW1hIDogZXhwcmVzc2lvbik7XG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiB0YXJnZXQoXywgdmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gXCJ0YXJnZXRcIikgeyBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjsgcmV0dXJuIGNvbnQobWF5YmVvcGVyYXRvckNvbW1hKTsgfVxuICB9XG4gIGZ1bmN0aW9uIHRhcmdldE5vQ29tbWEoXywgdmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gXCJ0YXJnZXRcIikgeyBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjsgcmV0dXJuIGNvbnQobWF5YmVvcGVyYXRvck5vQ29tbWEpOyB9XG4gIH1cbiAgZnVuY3Rpb24gbWF5YmVsYWJlbCh0eXBlKSB7XG4gICAgaWYgKHR5cGUgPT0gXCI6XCIpIHJldHVybiBjb250KHBvcGxleCwgc3RhdGVtZW50KTtcbiAgICByZXR1cm4gcGFzcyhtYXliZW9wZXJhdG9yQ29tbWEsIGV4cGVjdChcIjtcIiksIHBvcGxleCk7XG4gIH1cbiAgZnVuY3Rpb24gcHJvcGVydHkodHlwZSkge1xuICAgIGlmICh0eXBlID09IFwidmFyaWFibGVcIikge2N4Lm1hcmtlZCA9IFwicHJvcGVydHlcIjsgcmV0dXJuIGNvbnQoKTt9XG4gIH1cbiAgZnVuY3Rpb24gb2JqcHJvcCh0eXBlLCB2YWx1ZSkge1xuICAgIGlmICh0eXBlID09IFwiYXN5bmNcIikge1xuICAgICAgY3gubWFya2VkID0gXCJwcm9wZXJ0eVwiO1xuICAgICAgcmV0dXJuIGNvbnQob2JqcHJvcCk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09IFwidmFyaWFibGVcIiB8fCBjeC5zdHlsZSA9PSBcImtleXdvcmRcIikge1xuICAgICAgY3gubWFya2VkID0gXCJwcm9wZXJ0eVwiO1xuICAgICAgaWYgKHZhbHVlID09IFwiZ2V0XCIgfHwgdmFsdWUgPT0gXCJzZXRcIikgcmV0dXJuIGNvbnQoZ2V0dGVyU2V0dGVyKTtcbiAgICAgIHZhciBtIC8vIFdvcmsgYXJvdW5kIGZhdC1hcnJvdy1kZXRlY3Rpb24gY29tcGxpY2F0aW9uIGZvciBkZXRlY3RpbmcgdHlwZXNjcmlwdCB0eXBlZCBhcnJvdyBwYXJhbXNcbiAgICAgIGlmIChpc1RTICYmIGN4LnN0YXRlLmZhdEFycm93QXQgPT0gY3guc3RyZWFtLnN0YXJ0ICYmIChtID0gY3guc3RyZWFtLm1hdGNoKC9eXFxzKjpcXHMqLywgZmFsc2UpKSlcbiAgICAgICAgY3guc3RhdGUuZmF0QXJyb3dBdCA9IGN4LnN0cmVhbS5wb3MgKyBtWzBdLmxlbmd0aFxuICAgICAgcmV0dXJuIGNvbnQoYWZ0ZXJwcm9wKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJudW1iZXJcIiB8fCB0eXBlID09IFwic3RyaW5nXCIpIHtcbiAgICAgIGN4Lm1hcmtlZCA9IGpzb25sZE1vZGUgPyBcInByb3BlcnR5XCIgOiAoY3guc3R5bGUgKyBcIiBwcm9wZXJ0eVwiKTtcbiAgICAgIHJldHVybiBjb250KGFmdGVycHJvcCk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09IFwianNvbmxkLWtleXdvcmRcIikge1xuICAgICAgcmV0dXJuIGNvbnQoYWZ0ZXJwcm9wKTtcbiAgICB9IGVsc2UgaWYgKGlzVFMgJiYgaXNNb2RpZmllcih2YWx1ZSkpIHtcbiAgICAgIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiXG4gICAgICByZXR1cm4gY29udChvYmpwcm9wKVxuICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcIltcIikge1xuICAgICAgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbiwgbWF5YmV0eXBlLCBleHBlY3QoXCJdXCIpLCBhZnRlcnByb3ApO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcInNwcmVhZFwiKSB7XG4gICAgICByZXR1cm4gY29udChleHByZXNzaW9uTm9Db21tYSwgYWZ0ZXJwcm9wKTtcbiAgICB9IGVsc2UgaWYgKHZhbHVlID09IFwiKlwiKSB7XG4gICAgICBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjtcbiAgICAgIHJldHVybiBjb250KG9ianByb3ApO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcIjpcIikge1xuICAgICAgcmV0dXJuIHBhc3MoYWZ0ZXJwcm9wKVxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBnZXR0ZXJTZXR0ZXIodHlwZSkge1xuICAgIGlmICh0eXBlICE9IFwidmFyaWFibGVcIikgcmV0dXJuIHBhc3MoYWZ0ZXJwcm9wKTtcbiAgICBjeC5tYXJrZWQgPSBcInByb3BlcnR5XCI7XG4gICAgcmV0dXJuIGNvbnQoZnVuY3Rpb25kZWYpO1xuICB9XG4gIGZ1bmN0aW9uIGFmdGVycHJvcCh0eXBlKSB7XG4gICAgaWYgKHR5cGUgPT0gXCI6XCIpIHJldHVybiBjb250KGV4cHJlc3Npb25Ob0NvbW1hKTtcbiAgICBpZiAodHlwZSA9PSBcIihcIikgcmV0dXJuIHBhc3MoZnVuY3Rpb25kZWYpO1xuICB9XG4gIGZ1bmN0aW9uIGNvbW1hc2VwKHdoYXQsIGVuZCwgc2VwKSB7XG4gICAgZnVuY3Rpb24gcHJvY2VlZCh0eXBlLCB2YWx1ZSkge1xuICAgICAgaWYgKHNlcCA/IHNlcC5pbmRleE9mKHR5cGUpID4gLTEgOiB0eXBlID09IFwiLFwiKSB7XG4gICAgICAgIHZhciBsZXggPSBjeC5zdGF0ZS5sZXhpY2FsO1xuICAgICAgICBpZiAobGV4LmluZm8gPT0gXCJjYWxsXCIpIGxleC5wb3MgPSAobGV4LnBvcyB8fCAwKSArIDE7XG4gICAgICAgIHJldHVybiBjb250KGZ1bmN0aW9uKHR5cGUsIHZhbHVlKSB7XG4gICAgICAgICAgaWYgKHR5cGUgPT0gZW5kIHx8IHZhbHVlID09IGVuZCkgcmV0dXJuIHBhc3MoKVxuICAgICAgICAgIHJldHVybiBwYXNzKHdoYXQpXG4gICAgICAgIH0sIHByb2NlZWQpO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGUgPT0gZW5kIHx8IHZhbHVlID09IGVuZCkgcmV0dXJuIGNvbnQoKTtcbiAgICAgIGlmIChzZXAgJiYgc2VwLmluZGV4T2YoXCI7XCIpID4gLTEpIHJldHVybiBwYXNzKHdoYXQpXG4gICAgICByZXR1cm4gY29udChleHBlY3QoZW5kKSk7XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbih0eXBlLCB2YWx1ZSkge1xuICAgICAgaWYgKHR5cGUgPT0gZW5kIHx8IHZhbHVlID09IGVuZCkgcmV0dXJuIGNvbnQoKTtcbiAgICAgIHJldHVybiBwYXNzKHdoYXQsIHByb2NlZWQpO1xuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gY29udENvbW1hc2VwKHdoYXQsIGVuZCwgaW5mbykge1xuICAgIGZvciAodmFyIGkgPSAzOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxuICAgICAgY3guY2MucHVzaChhcmd1bWVudHNbaV0pO1xuICAgIHJldHVybiBjb250KHB1c2hsZXgoZW5kLCBpbmZvKSwgY29tbWFzZXAod2hhdCwgZW5kKSwgcG9wbGV4KTtcbiAgfVxuICBmdW5jdGlvbiBibG9jayh0eXBlKSB7XG4gICAgaWYgKHR5cGUgPT0gXCJ9XCIpIHJldHVybiBjb250KCk7XG4gICAgcmV0dXJuIHBhc3Moc3RhdGVtZW50LCBibG9jayk7XG4gIH1cbiAgZnVuY3Rpb24gbWF5YmV0eXBlKHR5cGUsIHZhbHVlKSB7XG4gICAgaWYgKGlzVFMpIHtcbiAgICAgIGlmICh0eXBlID09IFwiOlwiKSByZXR1cm4gY29udCh0eXBlZXhwcik7XG4gICAgICBpZiAodmFsdWUgPT0gXCI/XCIpIHJldHVybiBjb250KG1heWJldHlwZSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIG1heWJldHlwZU9ySW4odHlwZSwgdmFsdWUpIHtcbiAgICBpZiAoaXNUUyAmJiAodHlwZSA9PSBcIjpcIiB8fCB2YWx1ZSA9PSBcImluXCIpKSByZXR1cm4gY29udCh0eXBlZXhwcilcbiAgfVxuICBmdW5jdGlvbiBtYXliZXJldHR5cGUodHlwZSkge1xuICAgIGlmIChpc1RTICYmIHR5cGUgPT0gXCI6XCIpIHtcbiAgICAgIGlmIChjeC5zdHJlYW0ubWF0Y2goL15cXHMqXFx3K1xccytpc1xcYi8sIGZhbHNlKSkgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbiwgaXNLVywgdHlwZWV4cHIpXG4gICAgICBlbHNlIHJldHVybiBjb250KHR5cGVleHByKVxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBpc0tXKF8sIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09IFwiaXNcIikge1xuICAgICAgY3gubWFya2VkID0gXCJrZXl3b3JkXCJcbiAgICAgIHJldHVybiBjb250KClcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gdHlwZWV4cHIodHlwZSwgdmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gXCJrZXlvZlwiIHx8IHZhbHVlID09IFwidHlwZW9mXCIgfHwgdmFsdWUgPT0gXCJpbmZlclwiIHx8IHZhbHVlID09IFwicmVhZG9ubHlcIikge1xuICAgICAgY3gubWFya2VkID0gXCJrZXl3b3JkXCJcbiAgICAgIHJldHVybiBjb250KHZhbHVlID09IFwidHlwZW9mXCIgPyBleHByZXNzaW9uTm9Db21tYSA6IHR5cGVleHByKVxuICAgIH1cbiAgICBpZiAodHlwZSA9PSBcInZhcmlhYmxlXCIgfHwgdmFsdWUgPT0gXCJ2b2lkXCIpIHtcbiAgICAgIGN4Lm1hcmtlZCA9IFwidHlwZVwiXG4gICAgICByZXR1cm4gY29udChhZnRlclR5cGUpXG4gICAgfVxuICAgIGlmICh2YWx1ZSA9PSBcInxcIiB8fCB2YWx1ZSA9PSBcIiZcIikgcmV0dXJuIGNvbnQodHlwZWV4cHIpXG4gICAgaWYgKHR5cGUgPT0gXCJzdHJpbmdcIiB8fCB0eXBlID09IFwibnVtYmVyXCIgfHwgdHlwZSA9PSBcImF0b21cIikgcmV0dXJuIGNvbnQoYWZ0ZXJUeXBlKTtcbiAgICBpZiAodHlwZSA9PSBcIltcIikgcmV0dXJuIGNvbnQocHVzaGxleChcIl1cIiksIGNvbW1hc2VwKHR5cGVleHByLCBcIl1cIiwgXCIsXCIpLCBwb3BsZXgsIGFmdGVyVHlwZSlcbiAgICBpZiAodHlwZSA9PSBcIntcIikgcmV0dXJuIGNvbnQocHVzaGxleChcIn1cIiksIHR5cGVwcm9wcywgcG9wbGV4LCBhZnRlclR5cGUpXG4gICAgaWYgKHR5cGUgPT0gXCIoXCIpIHJldHVybiBjb250KGNvbW1hc2VwKHR5cGVhcmcsIFwiKVwiKSwgbWF5YmVSZXR1cm5UeXBlLCBhZnRlclR5cGUpXG4gICAgaWYgKHR5cGUgPT0gXCI8XCIpIHJldHVybiBjb250KGNvbW1hc2VwKHR5cGVleHByLCBcIj5cIiksIHR5cGVleHByKVxuICAgIGlmICh0eXBlID09IFwicXVhc2lcIikgeyByZXR1cm4gcGFzcyhxdWFzaVR5cGUsIGFmdGVyVHlwZSk7IH1cbiAgfVxuICBmdW5jdGlvbiBtYXliZVJldHVyblR5cGUodHlwZSkge1xuICAgIGlmICh0eXBlID09IFwiPT5cIikgcmV0dXJuIGNvbnQodHlwZWV4cHIpXG4gIH1cbiAgZnVuY3Rpb24gdHlwZXByb3BzKHR5cGUpIHtcbiAgICBpZiAodHlwZS5tYXRjaCgvW1xcfVxcKVxcXV0vKSkgcmV0dXJuIGNvbnQoKVxuICAgIGlmICh0eXBlID09IFwiLFwiIHx8IHR5cGUgPT0gXCI7XCIpIHJldHVybiBjb250KHR5cGVwcm9wcylcbiAgICByZXR1cm4gcGFzcyh0eXBlcHJvcCwgdHlwZXByb3BzKVxuICB9XG4gIGZ1bmN0aW9uIHR5cGVwcm9wKHR5cGUsIHZhbHVlKSB7XG4gICAgaWYgKHR5cGUgPT0gXCJ2YXJpYWJsZVwiIHx8IGN4LnN0eWxlID09IFwia2V5d29yZFwiKSB7XG4gICAgICBjeC5tYXJrZWQgPSBcInByb3BlcnR5XCJcbiAgICAgIHJldHVybiBjb250KHR5cGVwcm9wKVxuICAgIH0gZWxzZSBpZiAodmFsdWUgPT0gXCI/XCIgfHwgdHlwZSA9PSBcIm51bWJlclwiIHx8IHR5cGUgPT0gXCJzdHJpbmdcIikge1xuICAgICAgcmV0dXJuIGNvbnQodHlwZXByb3ApXG4gICAgfSBlbHNlIGlmICh0eXBlID09IFwiOlwiKSB7XG4gICAgICByZXR1cm4gY29udCh0eXBlZXhwcilcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJbXCIpIHtcbiAgICAgIHJldHVybiBjb250KGV4cGVjdChcInZhcmlhYmxlXCIpLCBtYXliZXR5cGVPckluLCBleHBlY3QoXCJdXCIpLCB0eXBlcHJvcClcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCIoXCIpIHtcbiAgICAgIHJldHVybiBwYXNzKGZ1bmN0aW9uZGVjbCwgdHlwZXByb3ApXG4gICAgfSBlbHNlIGlmICghdHlwZS5tYXRjaCgvWztcXH1cXClcXF0sXS8pKSB7XG4gICAgICByZXR1cm4gY29udCgpXG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHF1YXNpVHlwZSh0eXBlLCB2YWx1ZSkge1xuICAgIGlmICh0eXBlICE9IFwicXVhc2lcIikgcmV0dXJuIHBhc3MoKTtcbiAgICBpZiAodmFsdWUuc2xpY2UodmFsdWUubGVuZ3RoIC0gMikgIT0gXCIke1wiKSByZXR1cm4gY29udChxdWFzaVR5cGUpO1xuICAgIHJldHVybiBjb250KHR5cGVleHByLCBjb250aW51ZVF1YXNpVHlwZSk7XG4gIH1cbiAgZnVuY3Rpb24gY29udGludWVRdWFzaVR5cGUodHlwZSkge1xuICAgIGlmICh0eXBlID09IFwifVwiKSB7XG4gICAgICBjeC5tYXJrZWQgPSBcInN0cmluZy0yXCI7XG4gICAgICBjeC5zdGF0ZS50b2tlbml6ZSA9IHRva2VuUXVhc2k7XG4gICAgICByZXR1cm4gY29udChxdWFzaVR5cGUpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiB0eXBlYXJnKHR5cGUsIHZhbHVlKSB7XG4gICAgaWYgKHR5cGUgPT0gXCJ2YXJpYWJsZVwiICYmIGN4LnN0cmVhbS5tYXRjaCgvXlxccypbPzpdLywgZmFsc2UpIHx8IHZhbHVlID09IFwiP1wiKSByZXR1cm4gY29udCh0eXBlYXJnKVxuICAgIGlmICh0eXBlID09IFwiOlwiKSByZXR1cm4gY29udCh0eXBlZXhwcilcbiAgICBpZiAodHlwZSA9PSBcInNwcmVhZFwiKSByZXR1cm4gY29udCh0eXBlYXJnKVxuICAgIHJldHVybiBwYXNzKHR5cGVleHByKVxuICB9XG4gIGZ1bmN0aW9uIGFmdGVyVHlwZSh0eXBlLCB2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSBcIjxcIikgcmV0dXJuIGNvbnQocHVzaGxleChcIj5cIiksIGNvbW1hc2VwKHR5cGVleHByLCBcIj5cIiksIHBvcGxleCwgYWZ0ZXJUeXBlKVxuICAgIGlmICh2YWx1ZSA9PSBcInxcIiB8fCB0eXBlID09IFwiLlwiIHx8IHZhbHVlID09IFwiJlwiKSByZXR1cm4gY29udCh0eXBlZXhwcilcbiAgICBpZiAodHlwZSA9PSBcIltcIikgcmV0dXJuIGNvbnQodHlwZWV4cHIsIGV4cGVjdChcIl1cIiksIGFmdGVyVHlwZSlcbiAgICBpZiAodmFsdWUgPT0gXCJleHRlbmRzXCIgfHwgdmFsdWUgPT0gXCJpbXBsZW1lbnRzXCIpIHsgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7IHJldHVybiBjb250KHR5cGVleHByKSB9XG4gICAgaWYgKHZhbHVlID09IFwiP1wiKSByZXR1cm4gY29udCh0eXBlZXhwciwgZXhwZWN0KFwiOlwiKSwgdHlwZWV4cHIpXG4gIH1cbiAgZnVuY3Rpb24gbWF5YmVUeXBlQXJncyhfLCB2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSBcIjxcIikgcmV0dXJuIGNvbnQocHVzaGxleChcIj5cIiksIGNvbW1hc2VwKHR5cGVleHByLCBcIj5cIiksIHBvcGxleCwgYWZ0ZXJUeXBlKVxuICB9XG4gIGZ1bmN0aW9uIHR5cGVwYXJhbSgpIHtcbiAgICByZXR1cm4gcGFzcyh0eXBlZXhwciwgbWF5YmVUeXBlRGVmYXVsdClcbiAgfVxuICBmdW5jdGlvbiBtYXliZVR5cGVEZWZhdWx0KF8sIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09IFwiPVwiKSByZXR1cm4gY29udCh0eXBlZXhwcilcbiAgfVxuICBmdW5jdGlvbiB2YXJkZWYoXywgdmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gXCJlbnVtXCIpIHtjeC5tYXJrZWQgPSBcImtleXdvcmRcIjsgcmV0dXJuIGNvbnQoZW51bWRlZil9XG4gICAgcmV0dXJuIHBhc3MocGF0dGVybiwgbWF5YmV0eXBlLCBtYXliZUFzc2lnbiwgdmFyZGVmQ29udCk7XG4gIH1cbiAgZnVuY3Rpb24gcGF0dGVybih0eXBlLCB2YWx1ZSkge1xuICAgIGlmIChpc1RTICYmIGlzTW9kaWZpZXIodmFsdWUpKSB7IGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiOyByZXR1cm4gY29udChwYXR0ZXJuKSB9XG4gICAgaWYgKHR5cGUgPT0gXCJ2YXJpYWJsZVwiKSB7IHJlZ2lzdGVyKHZhbHVlKTsgcmV0dXJuIGNvbnQoKTsgfVxuICAgIGlmICh0eXBlID09IFwic3ByZWFkXCIpIHJldHVybiBjb250KHBhdHRlcm4pO1xuICAgIGlmICh0eXBlID09IFwiW1wiKSByZXR1cm4gY29udENvbW1hc2VwKGVsdHBhdHRlcm4sIFwiXVwiKTtcbiAgICBpZiAodHlwZSA9PSBcIntcIikgcmV0dXJuIGNvbnRDb21tYXNlcChwcm9wcGF0dGVybiwgXCJ9XCIpO1xuICB9XG4gIGZ1bmN0aW9uIHByb3BwYXR0ZXJuKHR5cGUsIHZhbHVlKSB7XG4gICAgaWYgKHR5cGUgPT0gXCJ2YXJpYWJsZVwiICYmICFjeC5zdHJlYW0ubWF0Y2goL15cXHMqOi8sIGZhbHNlKSkge1xuICAgICAgcmVnaXN0ZXIodmFsdWUpO1xuICAgICAgcmV0dXJuIGNvbnQobWF5YmVBc3NpZ24pO1xuICAgIH1cbiAgICBpZiAodHlwZSA9PSBcInZhcmlhYmxlXCIpIGN4Lm1hcmtlZCA9IFwicHJvcGVydHlcIjtcbiAgICBpZiAodHlwZSA9PSBcInNwcmVhZFwiKSByZXR1cm4gY29udChwYXR0ZXJuKTtcbiAgICBpZiAodHlwZSA9PSBcIn1cIikgcmV0dXJuIHBhc3MoKTtcbiAgICBpZiAodHlwZSA9PSBcIltcIikgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbiwgZXhwZWN0KCddJyksIGV4cGVjdCgnOicpLCBwcm9wcGF0dGVybik7XG4gICAgcmV0dXJuIGNvbnQoZXhwZWN0KFwiOlwiKSwgcGF0dGVybiwgbWF5YmVBc3NpZ24pO1xuICB9XG4gIGZ1bmN0aW9uIGVsdHBhdHRlcm4oKSB7XG4gICAgcmV0dXJuIHBhc3MocGF0dGVybiwgbWF5YmVBc3NpZ24pXG4gIH1cbiAgZnVuY3Rpb24gbWF5YmVBc3NpZ24oX3R5cGUsIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09IFwiPVwiKSByZXR1cm4gY29udChleHByZXNzaW9uTm9Db21tYSk7XG4gIH1cbiAgZnVuY3Rpb24gdmFyZGVmQ29udCh0eXBlKSB7XG4gICAgaWYgKHR5cGUgPT0gXCIsXCIpIHJldHVybiBjb250KHZhcmRlZik7XG4gIH1cbiAgZnVuY3Rpb24gbWF5YmVlbHNlKHR5cGUsIHZhbHVlKSB7XG4gICAgaWYgKHR5cGUgPT0gXCJrZXl3b3JkIGJcIiAmJiB2YWx1ZSA9PSBcImVsc2VcIikgcmV0dXJuIGNvbnQocHVzaGxleChcImZvcm1cIiwgXCJlbHNlXCIpLCBzdGF0ZW1lbnQsIHBvcGxleCk7XG4gIH1cbiAgZnVuY3Rpb24gZm9yc3BlYyh0eXBlLCB2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSBcImF3YWl0XCIpIHJldHVybiBjb250KGZvcnNwZWMpO1xuICAgIGlmICh0eXBlID09IFwiKFwiKSByZXR1cm4gY29udChwdXNobGV4KFwiKVwiKSwgZm9yc3BlYzEsIHBvcGxleCk7XG4gIH1cbiAgZnVuY3Rpb24gZm9yc3BlYzEodHlwZSkge1xuICAgIGlmICh0eXBlID09IFwidmFyXCIpIHJldHVybiBjb250KHZhcmRlZiwgZm9yc3BlYzIpO1xuICAgIGlmICh0eXBlID09IFwidmFyaWFibGVcIikgcmV0dXJuIGNvbnQoZm9yc3BlYzIpO1xuICAgIHJldHVybiBwYXNzKGZvcnNwZWMyKVxuICB9XG4gIGZ1bmN0aW9uIGZvcnNwZWMyKHR5cGUsIHZhbHVlKSB7XG4gICAgaWYgKHR5cGUgPT0gXCIpXCIpIHJldHVybiBjb250KClcbiAgICBpZiAodHlwZSA9PSBcIjtcIikgcmV0dXJuIGNvbnQoZm9yc3BlYzIpXG4gICAgaWYgKHZhbHVlID09IFwiaW5cIiB8fCB2YWx1ZSA9PSBcIm9mXCIpIHsgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7IHJldHVybiBjb250KGV4cHJlc3Npb24sIGZvcnNwZWMyKSB9XG4gICAgcmV0dXJuIHBhc3MoZXhwcmVzc2lvbiwgZm9yc3BlYzIpXG4gIH1cbiAgZnVuY3Rpb24gZnVuY3Rpb25kZWYodHlwZSwgdmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gXCIqXCIpIHtjeC5tYXJrZWQgPSBcImtleXdvcmRcIjsgcmV0dXJuIGNvbnQoZnVuY3Rpb25kZWYpO31cbiAgICBpZiAodHlwZSA9PSBcInZhcmlhYmxlXCIpIHtyZWdpc3Rlcih2YWx1ZSk7IHJldHVybiBjb250KGZ1bmN0aW9uZGVmKTt9XG4gICAgaWYgKHR5cGUgPT0gXCIoXCIpIHJldHVybiBjb250KHB1c2hjb250ZXh0LCBwdXNobGV4KFwiKVwiKSwgY29tbWFzZXAoZnVuYXJnLCBcIilcIiksIHBvcGxleCwgbWF5YmVyZXR0eXBlLCBzdGF0ZW1lbnQsIHBvcGNvbnRleHQpO1xuICAgIGlmIChpc1RTICYmIHZhbHVlID09IFwiPFwiKSByZXR1cm4gY29udChwdXNobGV4KFwiPlwiKSwgY29tbWFzZXAodHlwZXBhcmFtLCBcIj5cIiksIHBvcGxleCwgZnVuY3Rpb25kZWYpXG4gIH1cbiAgZnVuY3Rpb24gZnVuY3Rpb25kZWNsKHR5cGUsIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09IFwiKlwiKSB7Y3gubWFya2VkID0gXCJrZXl3b3JkXCI7IHJldHVybiBjb250KGZ1bmN0aW9uZGVjbCk7fVxuICAgIGlmICh0eXBlID09IFwidmFyaWFibGVcIikge3JlZ2lzdGVyKHZhbHVlKTsgcmV0dXJuIGNvbnQoZnVuY3Rpb25kZWNsKTt9XG4gICAgaWYgKHR5cGUgPT0gXCIoXCIpIHJldHVybiBjb250KHB1c2hjb250ZXh0LCBwdXNobGV4KFwiKVwiKSwgY29tbWFzZXAoZnVuYXJnLCBcIilcIiksIHBvcGxleCwgbWF5YmVyZXR0eXBlLCBwb3Bjb250ZXh0KTtcbiAgICBpZiAoaXNUUyAmJiB2YWx1ZSA9PSBcIjxcIikgcmV0dXJuIGNvbnQocHVzaGxleChcIj5cIiksIGNvbW1hc2VwKHR5cGVwYXJhbSwgXCI+XCIpLCBwb3BsZXgsIGZ1bmN0aW9uZGVjbClcbiAgfVxuICBmdW5jdGlvbiB0eXBlbmFtZSh0eXBlLCB2YWx1ZSkge1xuICAgIGlmICh0eXBlID09IFwia2V5d29yZFwiIHx8IHR5cGUgPT0gXCJ2YXJpYWJsZVwiKSB7XG4gICAgICBjeC5tYXJrZWQgPSBcInR5cGVcIlxuICAgICAgcmV0dXJuIGNvbnQodHlwZW5hbWUpXG4gICAgfSBlbHNlIGlmICh2YWx1ZSA9PSBcIjxcIikge1xuICAgICAgcmV0dXJuIGNvbnQocHVzaGxleChcIj5cIiksIGNvbW1hc2VwKHR5cGVwYXJhbSwgXCI+XCIpLCBwb3BsZXgpXG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGZ1bmFyZyh0eXBlLCB2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSBcIkBcIikgY29udChleHByZXNzaW9uLCBmdW5hcmcpXG4gICAgaWYgKHR5cGUgPT0gXCJzcHJlYWRcIikgcmV0dXJuIGNvbnQoZnVuYXJnKTtcbiAgICBpZiAoaXNUUyAmJiBpc01vZGlmaWVyKHZhbHVlKSkgeyBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjsgcmV0dXJuIGNvbnQoZnVuYXJnKTsgfVxuICAgIGlmIChpc1RTICYmIHR5cGUgPT0gXCJ0aGlzXCIpIHJldHVybiBjb250KG1heWJldHlwZSwgbWF5YmVBc3NpZ24pXG4gICAgcmV0dXJuIHBhc3MocGF0dGVybiwgbWF5YmV0eXBlLCBtYXliZUFzc2lnbik7XG4gIH1cbiAgZnVuY3Rpb24gY2xhc3NFeHByZXNzaW9uKHR5cGUsIHZhbHVlKSB7XG4gICAgLy8gQ2xhc3MgZXhwcmVzc2lvbnMgbWF5IGhhdmUgYW4gb3B0aW9uYWwgbmFtZS5cbiAgICBpZiAodHlwZSA9PSBcInZhcmlhYmxlXCIpIHJldHVybiBjbGFzc05hbWUodHlwZSwgdmFsdWUpO1xuICAgIHJldHVybiBjbGFzc05hbWVBZnRlcih0eXBlLCB2YWx1ZSk7XG4gIH1cbiAgZnVuY3Rpb24gY2xhc3NOYW1lKHR5cGUsIHZhbHVlKSB7XG4gICAgaWYgKHR5cGUgPT0gXCJ2YXJpYWJsZVwiKSB7cmVnaXN0ZXIodmFsdWUpOyByZXR1cm4gY29udChjbGFzc05hbWVBZnRlcik7fVxuICB9XG4gIGZ1bmN0aW9uIGNsYXNzTmFtZUFmdGVyKHR5cGUsIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09IFwiPFwiKSByZXR1cm4gY29udChwdXNobGV4KFwiPlwiKSwgY29tbWFzZXAodHlwZXBhcmFtLCBcIj5cIiksIHBvcGxleCwgY2xhc3NOYW1lQWZ0ZXIpXG4gICAgaWYgKHZhbHVlID09IFwiZXh0ZW5kc1wiIHx8IHZhbHVlID09IFwiaW1wbGVtZW50c1wiIHx8IChpc1RTICYmIHR5cGUgPT0gXCIsXCIpKSB7XG4gICAgICBpZiAodmFsdWUgPT0gXCJpbXBsZW1lbnRzXCIpIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiO1xuICAgICAgcmV0dXJuIGNvbnQoaXNUUyA/IHR5cGVleHByIDogZXhwcmVzc2lvbiwgY2xhc3NOYW1lQWZ0ZXIpO1xuICAgIH1cbiAgICBpZiAodHlwZSA9PSBcIntcIikgcmV0dXJuIGNvbnQocHVzaGxleChcIn1cIiksIGNsYXNzQm9keSwgcG9wbGV4KTtcbiAgfVxuICBmdW5jdGlvbiBjbGFzc0JvZHkodHlwZSwgdmFsdWUpIHtcbiAgICBpZiAodHlwZSA9PSBcImFzeW5jXCIgfHxcbiAgICAgICAgKHR5cGUgPT0gXCJ2YXJpYWJsZVwiICYmXG4gICAgICAgICAodmFsdWUgPT0gXCJzdGF0aWNcIiB8fCB2YWx1ZSA9PSBcImdldFwiIHx8IHZhbHVlID09IFwic2V0XCIgfHwgKGlzVFMgJiYgaXNNb2RpZmllcih2YWx1ZSkpKSAmJlxuICAgICAgICAgY3guc3RyZWFtLm1hdGNoKC9eXFxzK1tcXHckXFx4YTEtXFx1ZmZmZl0vLCBmYWxzZSkpKSB7XG4gICAgICBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjtcbiAgICAgIHJldHVybiBjb250KGNsYXNzQm9keSk7XG4gICAgfVxuICAgIGlmICh0eXBlID09IFwidmFyaWFibGVcIiB8fCBjeC5zdHlsZSA9PSBcImtleXdvcmRcIikge1xuICAgICAgY3gubWFya2VkID0gXCJwcm9wZXJ0eVwiO1xuICAgICAgcmV0dXJuIGNvbnQoY2xhc3NmaWVsZCwgY2xhc3NCb2R5KTtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT0gXCJudW1iZXJcIiB8fCB0eXBlID09IFwic3RyaW5nXCIpIHJldHVybiBjb250KGNsYXNzZmllbGQsIGNsYXNzQm9keSk7XG4gICAgaWYgKHR5cGUgPT0gXCJbXCIpXG4gICAgICByZXR1cm4gY29udChleHByZXNzaW9uLCBtYXliZXR5cGUsIGV4cGVjdChcIl1cIiksIGNsYXNzZmllbGQsIGNsYXNzQm9keSlcbiAgICBpZiAodmFsdWUgPT0gXCIqXCIpIHtcbiAgICAgIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiO1xuICAgICAgcmV0dXJuIGNvbnQoY2xhc3NCb2R5KTtcbiAgICB9XG4gICAgaWYgKGlzVFMgJiYgdHlwZSA9PSBcIihcIikgcmV0dXJuIHBhc3MoZnVuY3Rpb25kZWNsLCBjbGFzc0JvZHkpXG4gICAgaWYgKHR5cGUgPT0gXCI7XCIgfHwgdHlwZSA9PSBcIixcIikgcmV0dXJuIGNvbnQoY2xhc3NCb2R5KTtcbiAgICBpZiAodHlwZSA9PSBcIn1cIikgcmV0dXJuIGNvbnQoKTtcbiAgICBpZiAodmFsdWUgPT0gXCJAXCIpIHJldHVybiBjb250KGV4cHJlc3Npb24sIGNsYXNzQm9keSlcbiAgfVxuICBmdW5jdGlvbiBjbGFzc2ZpZWxkKHR5cGUsIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09IFwiIVwiKSByZXR1cm4gY29udChjbGFzc2ZpZWxkKVxuICAgIGlmICh2YWx1ZSA9PSBcIj9cIikgcmV0dXJuIGNvbnQoY2xhc3NmaWVsZClcbiAgICBpZiAodHlwZSA9PSBcIjpcIikgcmV0dXJuIGNvbnQodHlwZWV4cHIsIG1heWJlQXNzaWduKVxuICAgIGlmICh2YWx1ZSA9PSBcIj1cIikgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbk5vQ29tbWEpXG4gICAgdmFyIGNvbnRleHQgPSBjeC5zdGF0ZS5sZXhpY2FsLnByZXYsIGlzSW50ZXJmYWNlID0gY29udGV4dCAmJiBjb250ZXh0LmluZm8gPT0gXCJpbnRlcmZhY2VcIlxuICAgIHJldHVybiBwYXNzKGlzSW50ZXJmYWNlID8gZnVuY3Rpb25kZWNsIDogZnVuY3Rpb25kZWYpXG4gIH1cbiAgZnVuY3Rpb24gYWZ0ZXJFeHBvcnQodHlwZSwgdmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gXCIqXCIpIHsgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7IHJldHVybiBjb250KG1heWJlRnJvbSwgZXhwZWN0KFwiO1wiKSk7IH1cbiAgICBpZiAodmFsdWUgPT0gXCJkZWZhdWx0XCIpIHsgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7IHJldHVybiBjb250KGV4cHJlc3Npb24sIGV4cGVjdChcIjtcIikpOyB9XG4gICAgaWYgKHR5cGUgPT0gXCJ7XCIpIHJldHVybiBjb250KGNvbW1hc2VwKGV4cG9ydEZpZWxkLCBcIn1cIiksIG1heWJlRnJvbSwgZXhwZWN0KFwiO1wiKSk7XG4gICAgcmV0dXJuIHBhc3Moc3RhdGVtZW50KTtcbiAgfVxuICBmdW5jdGlvbiBleHBvcnRGaWVsZCh0eXBlLCB2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSBcImFzXCIpIHsgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7IHJldHVybiBjb250KGV4cGVjdChcInZhcmlhYmxlXCIpKTsgfVxuICAgIGlmICh0eXBlID09IFwidmFyaWFibGVcIikgcmV0dXJuIHBhc3MoZXhwcmVzc2lvbk5vQ29tbWEsIGV4cG9ydEZpZWxkKTtcbiAgfVxuICBmdW5jdGlvbiBhZnRlckltcG9ydCh0eXBlKSB7XG4gICAgaWYgKHR5cGUgPT0gXCJzdHJpbmdcIikgcmV0dXJuIGNvbnQoKTtcbiAgICBpZiAodHlwZSA9PSBcIihcIikgcmV0dXJuIHBhc3MoZXhwcmVzc2lvbik7XG4gICAgaWYgKHR5cGUgPT0gXCIuXCIpIHJldHVybiBwYXNzKG1heWJlb3BlcmF0b3JDb21tYSk7XG4gICAgcmV0dXJuIHBhc3MoaW1wb3J0U3BlYywgbWF5YmVNb3JlSW1wb3J0cywgbWF5YmVGcm9tKTtcbiAgfVxuICBmdW5jdGlvbiBpbXBvcnRTcGVjKHR5cGUsIHZhbHVlKSB7XG4gICAgaWYgKHR5cGUgPT0gXCJ7XCIpIHJldHVybiBjb250Q29tbWFzZXAoaW1wb3J0U3BlYywgXCJ9XCIpO1xuICAgIGlmICh0eXBlID09IFwidmFyaWFibGVcIikgcmVnaXN0ZXIodmFsdWUpO1xuICAgIGlmICh2YWx1ZSA9PSBcIipcIikgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7XG4gICAgcmV0dXJuIGNvbnQobWF5YmVBcyk7XG4gIH1cbiAgZnVuY3Rpb24gbWF5YmVNb3JlSW1wb3J0cyh0eXBlKSB7XG4gICAgaWYgKHR5cGUgPT0gXCIsXCIpIHJldHVybiBjb250KGltcG9ydFNwZWMsIG1heWJlTW9yZUltcG9ydHMpXG4gIH1cbiAgZnVuY3Rpb24gbWF5YmVBcyhfdHlwZSwgdmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gXCJhc1wiKSB7IGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiOyByZXR1cm4gY29udChpbXBvcnRTcGVjKTsgfVxuICB9XG4gIGZ1bmN0aW9uIG1heWJlRnJvbShfdHlwZSwgdmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gXCJmcm9tXCIpIHsgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7IHJldHVybiBjb250KGV4cHJlc3Npb24pOyB9XG4gIH1cbiAgZnVuY3Rpb24gYXJyYXlMaXRlcmFsKHR5cGUpIHtcbiAgICBpZiAodHlwZSA9PSBcIl1cIikgcmV0dXJuIGNvbnQoKTtcbiAgICByZXR1cm4gcGFzcyhjb21tYXNlcChleHByZXNzaW9uTm9Db21tYSwgXCJdXCIpKTtcbiAgfVxuICBmdW5jdGlvbiBlbnVtZGVmKCkge1xuICAgIHJldHVybiBwYXNzKHB1c2hsZXgoXCJmb3JtXCIpLCBwYXR0ZXJuLCBleHBlY3QoXCJ7XCIpLCBwdXNobGV4KFwifVwiKSwgY29tbWFzZXAoZW51bW1lbWJlciwgXCJ9XCIpLCBwb3BsZXgsIHBvcGxleClcbiAgfVxuICBmdW5jdGlvbiBlbnVtbWVtYmVyKCkge1xuICAgIHJldHVybiBwYXNzKHBhdHRlcm4sIG1heWJlQXNzaWduKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzQ29udGludWVkU3RhdGVtZW50KHN0YXRlLCB0ZXh0QWZ0ZXIpIHtcbiAgICByZXR1cm4gc3RhdGUubGFzdFR5cGUgPT0gXCJvcGVyYXRvclwiIHx8IHN0YXRlLmxhc3RUeXBlID09IFwiLFwiIHx8XG4gICAgICBpc09wZXJhdG9yQ2hhci50ZXN0KHRleHRBZnRlci5jaGFyQXQoMCkpIHx8XG4gICAgICAvWywuXS8udGVzdCh0ZXh0QWZ0ZXIuY2hhckF0KDApKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGV4cHJlc3Npb25BbGxvd2VkKHN0cmVhbSwgc3RhdGUsIGJhY2tVcCkge1xuICAgIHJldHVybiBzdGF0ZS50b2tlbml6ZSA9PSB0b2tlbkJhc2UgJiZcbiAgICAgIC9eKD86b3BlcmF0b3J8c29mfGtleXdvcmQgW2JjZF18Y2FzZXxuZXd8ZXhwb3J0fGRlZmF1bHR8c3ByZWFkfFtcXFt7fVxcKCw7Ol18PT4pJC8udGVzdChzdGF0ZS5sYXN0VHlwZSkgfHxcbiAgICAgIChzdGF0ZS5sYXN0VHlwZSA9PSBcInF1YXNpXCIgJiYgL1xce1xccyokLy50ZXN0KHN0cmVhbS5zdHJpbmcuc2xpY2UoMCwgc3RyZWFtLnBvcyAtIChiYWNrVXAgfHwgMCkpKSlcbiAgfVxuXG4gIC8vIEludGVyZmFjZVxuXG4gIHJldHVybiB7XG4gICAgc3RhcnRTdGF0ZTogZnVuY3Rpb24oYmFzZWNvbHVtbikge1xuICAgICAgdmFyIHN0YXRlID0ge1xuICAgICAgICB0b2tlbml6ZTogdG9rZW5CYXNlLFxuICAgICAgICBsYXN0VHlwZTogXCJzb2ZcIixcbiAgICAgICAgY2M6IFtdLFxuICAgICAgICBsZXhpY2FsOiBuZXcgSlNMZXhpY2FsKChiYXNlY29sdW1uIHx8IDApIC0gaW5kZW50VW5pdCwgMCwgXCJibG9ja1wiLCBmYWxzZSksXG4gICAgICAgIGxvY2FsVmFyczogcGFyc2VyQ29uZmlnLmxvY2FsVmFycyxcbiAgICAgICAgY29udGV4dDogcGFyc2VyQ29uZmlnLmxvY2FsVmFycyAmJiBuZXcgQ29udGV4dChudWxsLCBudWxsLCBmYWxzZSksXG4gICAgICAgIGluZGVudGVkOiBiYXNlY29sdW1uIHx8IDBcbiAgICAgIH07XG4gICAgICBpZiAocGFyc2VyQ29uZmlnLmdsb2JhbFZhcnMgJiYgdHlwZW9mIHBhcnNlckNvbmZpZy5nbG9iYWxWYXJzID09IFwib2JqZWN0XCIpXG4gICAgICAgIHN0YXRlLmdsb2JhbFZhcnMgPSBwYXJzZXJDb25maWcuZ2xvYmFsVmFycztcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9LFxuXG4gICAgdG9rZW46IGZ1bmN0aW9uKHN0cmVhbSwgc3RhdGUpIHtcbiAgICAgIGlmIChzdHJlYW0uc29sKCkpIHtcbiAgICAgICAgaWYgKCFzdGF0ZS5sZXhpY2FsLmhhc093blByb3BlcnR5KFwiYWxpZ25cIikpXG4gICAgICAgICAgc3RhdGUubGV4aWNhbC5hbGlnbiA9IGZhbHNlO1xuICAgICAgICBzdGF0ZS5pbmRlbnRlZCA9IHN0cmVhbS5pbmRlbnRhdGlvbigpO1xuICAgICAgICBmaW5kRmF0QXJyb3coc3RyZWFtLCBzdGF0ZSk7XG4gICAgICB9XG4gICAgICBpZiAoc3RhdGUudG9rZW5pemUgIT0gdG9rZW5Db21tZW50ICYmIHN0cmVhbS5lYXRTcGFjZSgpKSByZXR1cm4gbnVsbDtcbiAgICAgIHZhciBzdHlsZSA9IHN0YXRlLnRva2VuaXplKHN0cmVhbSwgc3RhdGUpO1xuICAgICAgaWYgKHR5cGUgPT0gXCJjb21tZW50XCIpIHJldHVybiBzdHlsZTtcbiAgICAgIHN0YXRlLmxhc3RUeXBlID0gdHlwZSA9PSBcIm9wZXJhdG9yXCIgJiYgKGNvbnRlbnQgPT0gXCIrK1wiIHx8IGNvbnRlbnQgPT0gXCItLVwiKSA/IFwiaW5jZGVjXCIgOiB0eXBlO1xuICAgICAgcmV0dXJuIHBhcnNlSlMoc3RhdGUsIHN0eWxlLCB0eXBlLCBjb250ZW50LCBzdHJlYW0pO1xuICAgIH0sXG5cbiAgICBpbmRlbnQ6IGZ1bmN0aW9uKHN0YXRlLCB0ZXh0QWZ0ZXIpIHtcbiAgICAgIGlmIChzdGF0ZS50b2tlbml6ZSA9PSB0b2tlbkNvbW1lbnQgfHwgc3RhdGUudG9rZW5pemUgPT0gdG9rZW5RdWFzaSkgcmV0dXJuIENvZGVNaXJyb3IuUGFzcztcbiAgICAgIGlmIChzdGF0ZS50b2tlbml6ZSAhPSB0b2tlbkJhc2UpIHJldHVybiAwO1xuICAgICAgdmFyIGZpcnN0Q2hhciA9IHRleHRBZnRlciAmJiB0ZXh0QWZ0ZXIuY2hhckF0KDApLCBsZXhpY2FsID0gc3RhdGUubGV4aWNhbCwgdG9wXG4gICAgICAvLyBLbHVkZ2UgdG8gcHJldmVudCAnbWF5YmVsc2UnIGZyb20gYmxvY2tpbmcgbGV4aWNhbCBzY29wZSBwb3BzXG4gICAgICBpZiAoIS9eXFxzKmVsc2VcXGIvLnRlc3QodGV4dEFmdGVyKSkgZm9yICh2YXIgaSA9IHN0YXRlLmNjLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBjID0gc3RhdGUuY2NbaV07XG4gICAgICAgIGlmIChjID09IHBvcGxleCkgbGV4aWNhbCA9IGxleGljYWwucHJldjtcbiAgICAgICAgZWxzZSBpZiAoYyAhPSBtYXliZWVsc2UgJiYgYyAhPSBwb3Bjb250ZXh0KSBicmVhaztcbiAgICAgIH1cbiAgICAgIHdoaWxlICgobGV4aWNhbC50eXBlID09IFwic3RhdFwiIHx8IGxleGljYWwudHlwZSA9PSBcImZvcm1cIikgJiZcbiAgICAgICAgICAgICAoZmlyc3RDaGFyID09IFwifVwiIHx8ICgodG9wID0gc3RhdGUuY2Nbc3RhdGUuY2MubGVuZ3RoIC0gMV0pICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh0b3AgPT0gbWF5YmVvcGVyYXRvckNvbW1hIHx8IHRvcCA9PSBtYXliZW9wZXJhdG9yTm9Db21tYSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIS9eWyxcXC49K1xcLSo6P1tcXChdLy50ZXN0KHRleHRBZnRlcikpKSlcbiAgICAgICAgbGV4aWNhbCA9IGxleGljYWwucHJldjtcbiAgICAgIGlmIChzdGF0ZW1lbnRJbmRlbnQgJiYgbGV4aWNhbC50eXBlID09IFwiKVwiICYmIGxleGljYWwucHJldi50eXBlID09IFwic3RhdFwiKVxuICAgICAgICBsZXhpY2FsID0gbGV4aWNhbC5wcmV2O1xuICAgICAgdmFyIHR5cGUgPSBsZXhpY2FsLnR5cGUsIGNsb3NpbmcgPSBmaXJzdENoYXIgPT0gdHlwZTtcblxuICAgICAgaWYgKHR5cGUgPT0gXCJ2YXJkZWZcIikgcmV0dXJuIGxleGljYWwuaW5kZW50ZWQgKyAoc3RhdGUubGFzdFR5cGUgPT0gXCJvcGVyYXRvclwiIHx8IHN0YXRlLmxhc3RUeXBlID09IFwiLFwiID8gbGV4aWNhbC5pbmZvLmxlbmd0aCArIDEgOiAwKTtcbiAgICAgIGVsc2UgaWYgKHR5cGUgPT0gXCJmb3JtXCIgJiYgZmlyc3RDaGFyID09IFwie1wiKSByZXR1cm4gbGV4aWNhbC5pbmRlbnRlZDtcbiAgICAgIGVsc2UgaWYgKHR5cGUgPT0gXCJmb3JtXCIpIHJldHVybiBsZXhpY2FsLmluZGVudGVkICsgaW5kZW50VW5pdDtcbiAgICAgIGVsc2UgaWYgKHR5cGUgPT0gXCJzdGF0XCIpXG4gICAgICAgIHJldHVybiBsZXhpY2FsLmluZGVudGVkICsgKGlzQ29udGludWVkU3RhdGVtZW50KHN0YXRlLCB0ZXh0QWZ0ZXIpID8gc3RhdGVtZW50SW5kZW50IHx8IGluZGVudFVuaXQgOiAwKTtcbiAgICAgIGVsc2UgaWYgKGxleGljYWwuaW5mbyA9PSBcInN3aXRjaFwiICYmICFjbG9zaW5nICYmIHBhcnNlckNvbmZpZy5kb3VibGVJbmRlbnRTd2l0Y2ggIT0gZmFsc2UpXG4gICAgICAgIHJldHVybiBsZXhpY2FsLmluZGVudGVkICsgKC9eKD86Y2FzZXxkZWZhdWx0KVxcYi8udGVzdCh0ZXh0QWZ0ZXIpID8gaW5kZW50VW5pdCA6IDIgKiBpbmRlbnRVbml0KTtcbiAgICAgIGVsc2UgaWYgKGxleGljYWwuYWxpZ24pIHJldHVybiBsZXhpY2FsLmNvbHVtbiArIChjbG9zaW5nID8gMCA6IDEpO1xuICAgICAgZWxzZSByZXR1cm4gbGV4aWNhbC5pbmRlbnRlZCArIChjbG9zaW5nID8gMCA6IGluZGVudFVuaXQpO1xuICAgIH0sXG5cbiAgICBlbGVjdHJpY0lucHV0OiAvXlxccyooPzpjYXNlIC4qPzp8ZGVmYXVsdDp8XFx7fFxcfSkkLyxcbiAgICBibG9ja0NvbW1lbnRTdGFydDoganNvbk1vZGUgPyBudWxsIDogXCIvKlwiLFxuICAgIGJsb2NrQ29tbWVudEVuZDoganNvbk1vZGUgPyBudWxsIDogXCIqL1wiLFxuICAgIGJsb2NrQ29tbWVudENvbnRpbnVlOiBqc29uTW9kZSA/IG51bGwgOiBcIiAqIFwiLFxuICAgIGxpbmVDb21tZW50OiBqc29uTW9kZSA/IG51bGwgOiBcIi8vXCIsXG4gICAgZm9sZDogXCJicmFjZVwiLFxuICAgIGNsb3NlQnJhY2tldHM6IFwiKClbXXt9JydcXFwiXFxcImBgXCIsXG5cbiAgICBoZWxwZXJUeXBlOiBqc29uTW9kZSA/IFwianNvblwiIDogXCJqYXZhc2NyaXB0XCIsXG4gICAganNvbmxkTW9kZToganNvbmxkTW9kZSxcbiAgICBqc29uTW9kZToganNvbk1vZGUsXG5cbiAgICBleHByZXNzaW9uQWxsb3dlZDogZXhwcmVzc2lvbkFsbG93ZWQsXG5cbiAgICBza2lwRXhwcmVzc2lvbjogZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgIHBhcnNlSlMoc3RhdGUsIFwiYXRvbVwiLCBcImF0b21cIiwgXCJ0cnVlXCIsIG5ldyBDb2RlTWlycm9yLlN0cmluZ1N0cmVhbShcIlwiLCAyLCBudWxsKSlcbiAgICB9XG4gIH07XG59KTtcblxuQ29kZU1pcnJvci5yZWdpc3RlckhlbHBlcihcIndvcmRDaGFyc1wiLCBcImphdmFzY3JpcHRcIiwgL1tcXHckXS8pO1xuXG5Db2RlTWlycm9yLmRlZmluZU1JTUUoXCJ0ZXh0L2phdmFzY3JpcHRcIiwgXCJqYXZhc2NyaXB0XCIpO1xuQ29kZU1pcnJvci5kZWZpbmVNSU1FKFwidGV4dC9lY21hc2NyaXB0XCIsIFwiamF2YXNjcmlwdFwiKTtcbkNvZGVNaXJyb3IuZGVmaW5lTUlNRShcImFwcGxpY2F0aW9uL2phdmFzY3JpcHRcIiwgXCJqYXZhc2NyaXB0XCIpO1xuQ29kZU1pcnJvci5kZWZpbmVNSU1FKFwiYXBwbGljYXRpb24veC1qYXZhc2NyaXB0XCIsIFwiamF2YXNjcmlwdFwiKTtcbkNvZGVNaXJyb3IuZGVmaW5lTUlNRShcImFwcGxpY2F0aW9uL2VjbWFzY3JpcHRcIiwgXCJqYXZhc2NyaXB0XCIpO1xuQ29kZU1pcnJvci5kZWZpbmVNSU1FKFwiYXBwbGljYXRpb24vanNvblwiLCB7IG5hbWU6IFwiamF2YXNjcmlwdFwiLCBqc29uOiB0cnVlIH0pO1xuQ29kZU1pcnJvci5kZWZpbmVNSU1FKFwiYXBwbGljYXRpb24veC1qc29uXCIsIHsgbmFtZTogXCJqYXZhc2NyaXB0XCIsIGpzb246IHRydWUgfSk7XG5Db2RlTWlycm9yLmRlZmluZU1JTUUoXCJhcHBsaWNhdGlvbi9tYW5pZmVzdCtqc29uXCIsIHsgbmFtZTogXCJqYXZhc2NyaXB0XCIsIGpzb246IHRydWUgfSlcbkNvZGVNaXJyb3IuZGVmaW5lTUlNRShcImFwcGxpY2F0aW9uL2xkK2pzb25cIiwgeyBuYW1lOiBcImphdmFzY3JpcHRcIiwganNvbmxkOiB0cnVlIH0pO1xuQ29kZU1pcnJvci5kZWZpbmVNSU1FKFwidGV4dC90eXBlc2NyaXB0XCIsIHsgbmFtZTogXCJqYXZhc2NyaXB0XCIsIHR5cGVzY3JpcHQ6IHRydWUgfSk7XG5Db2RlTWlycm9yLmRlZmluZU1JTUUoXCJhcHBsaWNhdGlvbi90eXBlc2NyaXB0XCIsIHsgbmFtZTogXCJqYXZhc2NyaXB0XCIsIHR5cGVzY3JpcHQ6IHRydWUgfSk7XG5cbn0pO1xuIiwiLy8gQ29kZU1pcnJvciwgY29weXJpZ2h0IChjKSBieSBNYXJpam4gSGF2ZXJiZWtlIGFuZCBvdGhlcnNcbi8vIERpc3RyaWJ1dGVkIHVuZGVyIGFuIE1JVCBsaWNlbnNlOiBodHRwczovL2NvZGVtaXJyb3IubmV0L0xJQ0VOU0VcblxuLy8gVXRpbGl0eSBmdW5jdGlvbiB0aGF0IGFsbG93cyBtb2RlcyB0byBiZSBjb21iaW5lZC4gVGhlIG1vZGUgZ2l2ZW5cbi8vIGFzIHRoZSBiYXNlIGFyZ3VtZW50IHRha2VzIGNhcmUgb2YgbW9zdCBvZiB0aGUgbm9ybWFsIG1vZGVcbi8vIGZ1bmN0aW9uYWxpdHksIGJ1dCBhIHNlY29uZCAodHlwaWNhbGx5IHNpbXBsZSkgbW9kZSBpcyB1c2VkLCB3aGljaFxuLy8gY2FuIG92ZXJyaWRlIHRoZSBzdHlsZSBvZiB0ZXh0LiBCb3RoIG1vZGVzIGdldCB0byBwYXJzZSBhbGwgb2YgdGhlXG4vLyB0ZXh0LCBidXQgd2hlbiBib3RoIGFzc2lnbiBhIG5vbi1udWxsIHN0eWxlIHRvIGEgcGllY2Ugb2YgY29kZSwgdGhlXG4vLyBvdmVybGF5IHdpbnMsIHVubGVzcyB0aGUgY29tYmluZSBhcmd1bWVudCB3YXMgdHJ1ZSBhbmQgbm90IG92ZXJyaWRkZW4sXG4vLyBvciBzdGF0ZS5vdmVybGF5LmNvbWJpbmVUb2tlbnMgd2FzIHRydWUsIGluIHdoaWNoIGNhc2UgdGhlIHN0eWxlcyBhcmVcbi8vIGNvbWJpbmVkLlxuXG4oZnVuY3Rpb24obW9kKSB7XG4gIG1vZCh3aW5kb3cuQ29kZU1pcnJvcik7XG59KShmdW5jdGlvbihDb2RlTWlycm9yKSB7XG5cInVzZSBzdHJpY3RcIjtcblxuQ29kZU1pcnJvci5jdXN0b21PdmVybGF5TW9kZSA9IGZ1bmN0aW9uKGJhc2UsIG92ZXJsYXksIGNvbWJpbmUpIHtcbiAgcmV0dXJuIHtcbiAgICBzdGFydFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGJhc2U6IENvZGVNaXJyb3Iuc3RhcnRTdGF0ZShiYXNlKSxcbiAgICAgICAgb3ZlcmxheTogQ29kZU1pcnJvci5zdGFydFN0YXRlKG92ZXJsYXkpLFxuICAgICAgICBiYXNlUG9zOiAwLCBiYXNlQ3VyOiBudWxsLFxuICAgICAgICBvdmVybGF5UG9zOiAwLCBvdmVybGF5Q3VyOiBudWxsLFxuICAgICAgICBzdHJlYW1TZWVuOiBudWxsXG4gICAgICB9O1xuICAgIH0sXG4gICAgY29weVN0YXRlOiBmdW5jdGlvbihzdGF0ZSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgYmFzZTogQ29kZU1pcnJvci5jb3B5U3RhdGUoYmFzZSwgc3RhdGUuYmFzZSksXG4gICAgICAgIG92ZXJsYXk6IENvZGVNaXJyb3IuY29weVN0YXRlKG92ZXJsYXksIHN0YXRlLm92ZXJsYXkpLFxuICAgICAgICBiYXNlUG9zOiBzdGF0ZS5iYXNlUG9zLCBiYXNlQ3VyOiBudWxsLFxuICAgICAgICBvdmVybGF5UG9zOiBzdGF0ZS5vdmVybGF5UG9zLCBvdmVybGF5Q3VyOiBudWxsXG4gICAgICB9O1xuICAgIH0sXG5cbiAgICB0b2tlbjogZnVuY3Rpb24oc3RyZWFtLCBzdGF0ZSkge1xuICAgICAgaWYgKHN0cmVhbSAhPSBzdGF0ZS5zdHJlYW1TZWVuIHx8XG4gICAgICAgICAgTWF0aC5taW4oc3RhdGUuYmFzZVBvcywgc3RhdGUub3ZlcmxheVBvcykgPCBzdHJlYW0uc3RhcnQpIHtcbiAgICAgICAgc3RhdGUuc3RyZWFtU2VlbiA9IHN0cmVhbTtcbiAgICAgICAgc3RhdGUuYmFzZVBvcyA9IHN0YXRlLm92ZXJsYXlQb3MgPSBzdHJlYW0uc3RhcnQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdHJlYW0uc3RhcnQgPT0gc3RhdGUuYmFzZVBvcykge1xuICAgICAgICBzdGF0ZS5iYXNlQ3VyID0gYmFzZS50b2tlbihzdHJlYW0sIHN0YXRlLmJhc2UpO1xuICAgICAgICBzdGF0ZS5iYXNlUG9zID0gc3RyZWFtLnBvcztcbiAgICAgIH1cbiAgICAgIGlmIChzdHJlYW0uc3RhcnQgPT0gc3RhdGUub3ZlcmxheVBvcykge1xuICAgICAgICBzdHJlYW0ucG9zID0gc3RyZWFtLnN0YXJ0O1xuICAgICAgICBzdGF0ZS5vdmVybGF5Q3VyID0gb3ZlcmxheS50b2tlbihzdHJlYW0sIHN0YXRlLm92ZXJsYXkpO1xuICAgICAgICBzdGF0ZS5vdmVybGF5UG9zID0gc3RyZWFtLnBvcztcbiAgICAgIH1cbiAgICAgIHN0cmVhbS5wb3MgPSBNYXRoLm1pbihzdGF0ZS5iYXNlUG9zLCBzdGF0ZS5vdmVybGF5UG9zKTtcblxuICAgICAgLy8gRWRnZSBjYXNlIGZvciBjb2RlYmxvY2tzIGluIHRlbXBsYXRlciBtb2RlXG4gICAgICBpZiAoc3RhdGUuYmFzZUN1ciAmJiBzdGF0ZS5vdmVybGF5Q3VyICYmIHN0YXRlLmJhc2VDdXIuY29udGFpbnMoXCJsaW5lLUh5cGVyTUQtY29kZWJsb2NrXCIpKSB7XG4gICAgICAgIHN0YXRlLm92ZXJsYXlDdXIgPSBzdGF0ZS5vdmVybGF5Q3VyLnJlcGxhY2UoXCJsaW5lLXRlbXBsYXRlci1pbmxpbmVcIiwgXCJcIik7XG4gICAgICAgIHN0YXRlLm92ZXJsYXlDdXIgKz0gYCBsaW5lLWJhY2tncm91bmQtSHlwZXJNRC1jb2RlYmxvY2stYmdgO1xuICAgICAgfVxuXG4gICAgICAvLyBzdGF0ZS5vdmVybGF5LmNvbWJpbmVUb2tlbnMgYWx3YXlzIHRha2VzIHByZWNlZGVuY2Ugb3ZlciBjb21iaW5lLFxuICAgICAgLy8gdW5sZXNzIHNldCB0byBudWxsXG4gICAgICBpZiAoc3RhdGUub3ZlcmxheUN1ciA9PSBudWxsKSByZXR1cm4gc3RhdGUuYmFzZUN1cjtcbiAgICAgIGVsc2UgaWYgKHN0YXRlLmJhc2VDdXIgIT0gbnVsbCAmJlxuICAgICAgICAgICAgICAgc3RhdGUub3ZlcmxheS5jb21iaW5lVG9rZW5zIHx8XG4gICAgICAgICAgICAgICBjb21iaW5lICYmIHN0YXRlLm92ZXJsYXkuY29tYmluZVRva2VucyA9PSBudWxsKVxuICAgICAgICByZXR1cm4gc3RhdGUuYmFzZUN1ciArIFwiIFwiICsgc3RhdGUub3ZlcmxheUN1cjtcbiAgICAgIGVsc2UgcmV0dXJuIHN0YXRlLm92ZXJsYXlDdXI7XG4gICAgfSxcblxuICAgIGluZGVudDogYmFzZS5pbmRlbnQgJiYgZnVuY3Rpb24oc3RhdGUsIHRleHRBZnRlciwgbGluZSkge1xuICAgICAgcmV0dXJuIGJhc2UuaW5kZW50KHN0YXRlLmJhc2UsIHRleHRBZnRlciwgbGluZSk7XG4gICAgfSxcbiAgICBlbGVjdHJpY0NoYXJzOiBiYXNlLmVsZWN0cmljQ2hhcnMsXG5cbiAgICBpbm5lck1vZGU6IGZ1bmN0aW9uKHN0YXRlKSB7IHJldHVybiB7c3RhdGU6IHN0YXRlLmJhc2UsIG1vZGU6IGJhc2V9OyB9LFxuXG4gICAgYmxhbmtMaW5lOiBmdW5jdGlvbihzdGF0ZSkge1xuICAgICAgdmFyIGJhc2VUb2tlbiwgb3ZlcmxheVRva2VuO1xuICAgICAgaWYgKGJhc2UuYmxhbmtMaW5lKSBiYXNlVG9rZW4gPSBiYXNlLmJsYW5rTGluZShzdGF0ZS5iYXNlKTtcbiAgICAgIGlmIChvdmVybGF5LmJsYW5rTGluZSkgb3ZlcmxheVRva2VuID0gb3ZlcmxheS5ibGFua0xpbmUoc3RhdGUub3ZlcmxheSk7XG5cbiAgICAgIHJldHVybiBvdmVybGF5VG9rZW4gPT0gbnVsbCA/XG4gICAgICAgIGJhc2VUb2tlbiA6XG4gICAgICAgIChjb21iaW5lICYmIGJhc2VUb2tlbiAhPSBudWxsID8gYmFzZVRva2VuICsgXCIgXCIgKyBvdmVybGF5VG9rZW4gOiBvdmVybGF5VG9rZW4pO1xuICAgIH1cbiAgfTtcbn07XG5cbn0pO1xuIiwiaW1wb3J0IHsgQXBwLCBQbGF0Zm9ybSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IFRlbXBsYXRlclBsdWdpbiBmcm9tIFwibWFpblwiO1xuaW1wb3J0IHsgVGVtcGxhdGVyRXJyb3IgfSBmcm9tIFwiRXJyb3JcIjtcbmltcG9ydCB7IEN1cnNvckp1bXBlciB9IGZyb20gJ2VkaXRvci9DdXJzb3JKdW1wZXInO1xuaW1wb3J0IHsgbG9nX2Vycm9yIH0gZnJvbSAnTG9nJztcblxuaW1wb3J0IFwiZWRpdG9yL21vZGUvamF2YXNjcmlwdFwiO1xuaW1wb3J0IFwiZWRpdG9yL21vZGUvY3VzdG9tX292ZXJsYXlcIjtcbi8vaW1wb3J0IFwiZWRpdG9yL21vZGUvc2hvdy1oaW50XCI7XG5cbmNvbnN0IFRQX0NNRF9UT0tFTl9DTEFTUzogc3RyaW5nID0gXCJ0ZW1wbGF0ZXItY29tbWFuZFwiO1xuY29uc3QgVFBfSU5MSU5FX0NMQVNTOiBzdHJpbmcgPSBcInRlbXBsYXRlci1pbmxpbmVcIjtcblxuY29uc3QgVFBfT1BFTklOR19UQUdfVE9LRU5fQ0xBU1M6IHN0cmluZyA9IFwidGVtcGxhdGVyLW9wZW5pbmctdGFnXCI7XG5jb25zdCBUUF9DTE9TSU5HX1RBR19UT0tFTl9DTEFTUzogc3RyaW5nID0gXCJ0ZW1wbGF0ZXItY2xvc2luZy10YWdcIjtcblxuY29uc3QgVFBfSU5URVJQT0xBVElPTl9UQUdfVE9LRU5fQ0xBU1M6IHN0cmluZyA9IFwidGVtcGxhdGVyLWludGVycG9sYXRpb24tdGFnXCI7XG5jb25zdCBUUF9SQVdfVEFHX1RPS0VOX0NMQVNTOiBzdHJpbmcgPSBcInRlbXBsYXRlci1yYXctdGFnXCI7XG5jb25zdCBUUF9FWEVDX1RBR19UT0tFTl9DTEFTUzogc3RyaW5nID0gXCJ0ZW1wbGF0ZXItZXhlY3V0aW9uLXRhZ1wiO1xuXG5leHBvcnQgY2xhc3MgRWRpdG9yIHtcbiAgICBwcml2YXRlIGN1cnNvcl9qdW1wZXI6IEN1cnNvckp1bXBlcjtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihwcml2YXRlIGFwcDogQXBwLCBwcml2YXRlIHBsdWdpbjogVGVtcGxhdGVyUGx1Z2luKSB7XG4gICAgICAgIHRoaXMuY3Vyc29yX2p1bXBlciA9IG5ldyBDdXJzb3JKdW1wZXIodGhpcy5hcHApO1xuICAgIH1cblxuICAgIGFzeW5jIHNldHVwKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBhd2FpdCB0aGlzLnJlZ2lzdGVyQ29kZU1pcnJvck1vZGUoKTtcbiAgICAgICAgLy9hd2FpdCB0aGlzLnJlZ2lzdGVySGludGVyKCk7XG4gICAgfVxuXG4gICAgYXN5bmMganVtcF90b19uZXh0X2N1cnNvcl9sb2NhdGlvbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdGhpcy5jdXJzb3JfanVtcGVyLmp1bXBfdG9fbmV4dF9jdXJzb3JfbG9jYXRpb24oKTtcbiAgICB9XG5cblx0YXN5bmMgcmVnaXN0ZXJDb2RlTWlycm9yTW9kZSgpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHQvLyBjbS1lZGl0b3Itc3ludGF4LWhpZ2hsaWdodC1vYnNpZGlhbiBwbHVnaW5cblx0XHQvLyBodHRwczovL2NvZGVtaXJyb3IubmV0L2RvYy9tYW51YWwuaHRtbCNtb2RlYXBpXG5cdFx0Ly8gaHR0cHM6Ly9jb2RlbWlycm9yLm5ldC9tb2RlL2RpZmYvZGlmZi5qc1xuICAgICAgICAvLyBodHRwczovL2NvZGVtaXJyb3IubmV0L2RlbW8vbXVzdGFjaGUuaHRtbFxuXHRcdC8vIGh0dHBzOi8vbWFyaWpuaGF2ZXJiZWtlLm5sL2Jsb2cvY29kZW1pcnJvci1tb2RlLXN5c3RlbS5odG1sXG5cbiAgICAgICAgaWYgKCF0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW50YXhfaGlnaGxpZ2h0aW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUT0RPOiBBZGQgbW9iaWxlIHN1cHBvcnRcblx0XHRpZiAoUGxhdGZvcm0uaXNNb2JpbGVBcHApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cbiAgICAgICAgY29uc3QganNfbW9kZSA9IHdpbmRvdy5Db2RlTWlycm9yLmdldE1vZGUoe30sIFwiamF2YXNjcmlwdFwiKTtcblx0XHRpZiAoanNfbW9kZS5uYW1lID09PSBcIm51bGxcIikge1xuICAgICAgICAgICAgbG9nX2Vycm9yKG5ldyBUZW1wbGF0ZXJFcnJvcihcIkphdmFzY3JpcHQgc3ludGF4IG1vZGUgY291bGRuJ3QgYmUgZm91bmQsIGNhbid0IGVuYWJsZSBzeW50YXggaGlnaGxpZ2h0aW5nLlwiKSk7XG4gICAgICAgICAgICByZXR1cm47XG5cdFx0fVxuXG4gICAgICAgIC8vIEN1c3RvbSBvdmVybGF5IG1vZGUgdXNlZCB0byBoYW5kbGUgZWRnZSBjYXNlc1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGNvbnN0IG92ZXJsYXlfbW9kZSA9IHdpbmRvdy5Db2RlTWlycm9yLmN1c3RvbU92ZXJsYXlNb2RlO1xuICAgICAgICBpZiAob3ZlcmxheV9tb2RlID09IG51bGwpIHtcbiAgICAgICAgICAgIGxvZ19lcnJvcihuZXcgVGVtcGxhdGVyRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGN1c3RvbU92ZXJsYXlNb2RlLCBjYW4ndCBlbmFibGUgc3ludGF4IGhpZ2hsaWdodGluZy5cIikpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgd2luZG93LkNvZGVNaXJyb3IuZGVmaW5lTW9kZShcInRlbXBsYXRlclwiLCBmdW5jdGlvbihjb25maWcsIHBhcnNlckNvbmZpZykge1xuXHRcdFx0Y29uc3QgdGVtcGxhdGVyT3ZlcmxheSA9IHtcbiAgICAgICAgICAgICAgICBzdGFydFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QganNfc3RhdGUgPSB3aW5kb3cuQ29kZU1pcnJvci5zdGFydFN0YXRlKGpzX21vZGUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4uanNfc3RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbkNvbW1hbmQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFnX2NsYXNzOiBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgZnJlZUxpbmU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY29weVN0YXRlOiBmdW5jdGlvbihzdGF0ZTogYW55KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGpzX3N0YXRlID0gd2luZG93LkNvZGVNaXJyb3Iuc3RhcnRTdGF0ZShqc19tb2RlKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3X3N0YXRlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4uanNfc3RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbkNvbW1hbmQ6IHN0YXRlLmluQ29tbWFuZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZ19jbGFzczogc3RhdGUudGFnX2NsYXNzLFxuICAgICAgICAgICAgICAgICAgICAgICAgZnJlZUxpbmU6IHN0YXRlLmZyZWVMaW5lLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3X3N0YXRlO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYmxhbmtMaW5lOiBmdW5jdGlvbihzdGF0ZTogYW55KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5pbkNvbW1hbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBgbGluZS1iYWNrZ3JvdW5kLXRlbXBsYXRlci1jb21tYW5kLWJnYDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRva2VuOiBmdW5jdGlvbihzdHJlYW06IGFueSwgc3RhdGU6IGFueSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3RyZWFtLnNvbCgpICYmIHN0YXRlLmluQ29tbWFuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuZnJlZUxpbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXRlLmluQ29tbWFuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGtleXdvcmRzID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdHJlYW0ubWF0Y2goL1tcXC1fXXswLDF9JT4vLCB0cnVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmluQ29tbWFuZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmZyZWVMaW5lID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFnX2NsYXNzID0gc3RhdGUudGFnX2NsYXNzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLnRhZ19jbGFzcyA9IFwiXCI7XG4gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGBsaW5lLSR7VFBfSU5MSU5FX0NMQVNTfSAke1RQX0NNRF9UT0tFTl9DTEFTU30gJHtUUF9DTE9TSU5HX1RBR19UT0tFTl9DTEFTU30gJHt0YWdfY2xhc3N9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGpzX3Jlc3VsdCA9IGpzX21vZGUudG9rZW4oc3RyZWFtLCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RyZWFtLnBlZWsoKSA9PSBudWxsICYmIHN0YXRlLmZyZWVMaW5lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5d29yZHMgKz0gYCBsaW5lLWJhY2tncm91bmQtdGVtcGxhdGVyLWNvbW1hbmQtYmdgO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzdGF0ZS5mcmVlTGluZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleXdvcmRzICs9IGAgbGluZS0ke1RQX0lOTElORV9DTEFTU31gO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7a2V5d29yZHN9ICR7VFBfQ01EX1RPS0VOX0NMQVNTfSAke2pzX3Jlc3VsdH1gO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBzdHJlYW0ubWF0Y2goLzwlW1xcLV9dezAsMX1cXHMqKFsqfitdezAsMX0pLywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKG1hdGNoWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnKic6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLnRhZ19jbGFzcyA9IFRQX0VYRUNfVEFHX1RPS0VOX0NMQVNTO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICd+JzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUudGFnX2NsYXNzID0gVFBfUkFXX1RBR19UT0tFTl9DTEFTUztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUudGFnX2NsYXNzID0gVFBfSU5URVJQT0xBVElPTl9UQUdfVE9LRU5fQ0xBU1M7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuaW5Db21tYW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBgbGluZS0ke1RQX0lOTElORV9DTEFTU30gJHtUUF9DTURfVE9LRU5fQ0xBU1N9ICR7VFBfT1BFTklOR19UQUdfVE9LRU5fQ0xBU1N9ICR7c3RhdGUudGFnX2NsYXNzfWA7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoc3RyZWFtLm5leHQoKSAhPSBudWxsICYmICFzdHJlYW0ubWF0Y2goLzwlLywgZmFsc2UpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgfVxuXHRcdFx0fTtcbiAgICAgICAgICAgIHJldHVybiBvdmVybGF5X21vZGUod2luZG93LkNvZGVNaXJyb3IuZ2V0TW9kZShjb25maWcsIFwiaHlwZXJtZFwiKSwgdGVtcGxhdGVyT3ZlcmxheSk7XG5cdFx0fSk7IFxuXHR9XG5cbiAgICBhc3luYyByZWdpc3RlckhpbnRlcigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgLy8gVE9ET1xuICAgICAgICAvKlxuICAgICAgICBhd2FpdCBkZWxheSgxMDAwKTtcblxuICAgICAgICB2YXIgY29tcCA9IFtcbiAgICAgICAgICAgIFtcImhlcmVcIiwgXCJoaXRoZXJcIl0sXG4gICAgICAgICAgICBbXCJhc3luY2hyb25vdXNcIiwgXCJub25zeW5jaHJvbm91c1wiXSxcbiAgICAgICAgICAgIFtcImNvbXBsZXRpb25cIiwgXCJhY2hpZXZlbWVudFwiLCBcImNvbmNsdXNpb25cIiwgXCJjdWxtaW5hdGlvblwiLCBcImV4cGlyYXRpb25zXCJdLFxuICAgICAgICAgICAgW1wiaGludGluZ1wiLCBcImFkdmlzZVwiLCBcImJyb2FjaFwiLCBcImltcGx5XCJdLFxuICAgICAgICAgICAgW1wiZnVuY3Rpb25cIixcImFjdGlvblwiXSxcbiAgICAgICAgICAgIFtcInByb3ZpZGVcIiwgXCJhZGRcIiwgXCJicmluZ1wiLCBcImdpdmVcIl0sXG4gICAgICAgICAgICBbXCJzeW5vbnltc1wiLCBcImVxdWl2YWxlbnRzXCJdLFxuICAgICAgICAgICAgW1wid29yZHNcIiwgXCJ0b2tlblwiXSxcbiAgICAgICAgICAgIFtcImVhY2hcIiwgXCJldmVyeVwiXSxcbiAgICAgICAgXTtcbiAgICBcbiAgICAgICAgZnVuY3Rpb24gc3lub255bXMoY206IGFueSwgb3B0aW9uOiBhbnkpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihhY2NlcHQpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY3Vyc29yID0gY20uZ2V0Q3Vyc29yKCksIGxpbmUgPSBjbS5nZXRMaW5lKGN1cnNvci5saW5lKVxuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhcnQgPSBjdXJzb3IuY2gsIGVuZCA9IGN1cnNvci5jaFxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoc3RhcnQgJiYgL1xcdy8udGVzdChsaW5lLmNoYXJBdChzdGFydCAtIDEpKSkgLS1zdGFydFxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoZW5kIDwgbGluZS5sZW5ndGggJiYgL1xcdy8udGVzdChsaW5lLmNoYXJBdChlbmQpKSkgKytlbmRcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdvcmQgPSBsaW5lLnNsaWNlKHN0YXJ0LCBlbmQpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb21wLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcFtpXS5pbmRleE9mKHdvcmQpICE9IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFjY2VwdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3Q6IGNvbXBbaV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb206IHdpbmRvdy5Db2RlTWlycm9yLlBvcyhjdXJzb3IubGluZSwgc3RhcnQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0bzogd2luZG93LkNvZGVNaXJyb3IuUG9zKGN1cnNvci5saW5lLCBlbmQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFjY2VwdChudWxsKTtcbiAgICAgICAgICAgICAgICB9LCAxMDApXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImNvZGVtaXJyb3JcIiwgY20gPT4ge1xuICAgICAgICAgICAgY20uc2V0T3B0aW9uKFwiZXh0cmFLZXlzXCIsIHtcIkN0cmwtU3BhY2VcIjogXCJhdXRvY29tcGxldGVcIn0pO1xuICAgICAgICAgICAgY20uc2V0T3B0aW9uKFwiaGludE9wdGlvbnNcIiwge2hpbnQ6IHN5bm9ueW1zfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5pdGVyYXRlQ29kZU1pcnJvcnMoY20gPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDTTpcIiwgY20pO1xuICAgICAgICAgICAgY20uc2V0T3B0aW9uKFwiZXh0cmFLZXlzXCIsIHtcIlNwYWNlXCI6IFwiYXV0b2NvbXBsZXRlXCJ9KTtcbiAgICAgICAgICAgIGNtLnNldE9wdGlvbihcImhpbnRPcHRpb25zXCIsIHtoaW50OiBzeW5vbnltc30pO1xuICAgICAgICB9KTtcbiAgICAgICAgKi9cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBleGlzdHNTeW5jLCByZWFkRmlsZVN5bmMgfSBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuXG4vKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXHJcblxyXG5QZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcclxucHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLlxyXG5cclxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVMgV0lUSFxyXG5SRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFlcclxuQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULFxyXG5JTkRJUkVDVCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST01cclxuTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1JcclxuT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUlxyXG5QRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG5cclxudmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH07XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufTtcblxuZnVuY3Rpb24gc2V0UHJvdG90eXBlT2Yob2JqLCBwcm90bykge1xyXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XHJcbiAgICBpZiAoT2JqZWN0LnNldFByb3RvdHlwZU9mKSB7XHJcbiAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKG9iaiwgcHJvdG8pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgb2JqLl9fcHJvdG9fXyA9IHByb3RvO1xyXG4gICAgfVxyXG59XHJcbi8vIFRoaXMgaXMgcHJldHR5IG11Y2ggdGhlIG9ubHkgd2F5IHRvIGdldCBuaWNlLCBleHRlbmRlZCBFcnJvcnNcclxuLy8gd2l0aG91dCB1c2luZyBFUzZcclxuLyoqXHJcbiAqIFRoaXMgcmV0dXJucyBhIG5ldyBFcnJvciB3aXRoIGEgY3VzdG9tIHByb3RvdHlwZS4gTm90ZSB0aGF0IGl0J3MgX25vdF8gYSBjb25zdHJ1Y3RvclxyXG4gKlxyXG4gKiBAcGFyYW0gbWVzc2FnZSBFcnJvciBtZXNzYWdlXHJcbiAqXHJcbiAqICoqRXhhbXBsZSoqXHJcbiAqXHJcbiAqIGBgYGpzXHJcbiAqIHRocm93IEV0YUVycihcInRlbXBsYXRlIG5vdCBmb3VuZFwiKVxyXG4gKiBgYGBcclxuICovXHJcbmZ1bmN0aW9uIEV0YUVycihtZXNzYWdlKSB7XHJcbiAgICB2YXIgZXJyID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xyXG4gICAgc2V0UHJvdG90eXBlT2YoZXJyLCBFdGFFcnIucHJvdG90eXBlKTtcclxuICAgIHJldHVybiBlcnI7XHJcbn1cclxuRXRhRXJyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlLCB7XHJcbiAgICBuYW1lOiB7IHZhbHVlOiAnRXRhIEVycm9yJywgZW51bWVyYWJsZTogZmFsc2UgfVxyXG59KTtcclxuLyoqXHJcbiAqIFRocm93cyBhbiBFdGFFcnIgd2l0aCBhIG5pY2VseSBmb3JtYXR0ZWQgZXJyb3IgYW5kIG1lc3NhZ2Ugc2hvd2luZyB3aGVyZSBpbiB0aGUgdGVtcGxhdGUgdGhlIGVycm9yIG9jY3VycmVkLlxyXG4gKi9cclxuZnVuY3Rpb24gUGFyc2VFcnIobWVzc2FnZSwgc3RyLCBpbmR4KSB7XHJcbiAgICB2YXIgd2hpdGVzcGFjZSA9IHN0ci5zbGljZSgwLCBpbmR4KS5zcGxpdCgvXFxuLyk7XHJcbiAgICB2YXIgbGluZU5vID0gd2hpdGVzcGFjZS5sZW5ndGg7XHJcbiAgICB2YXIgY29sTm8gPSB3aGl0ZXNwYWNlW2xpbmVObyAtIDFdLmxlbmd0aCArIDE7XHJcbiAgICBtZXNzYWdlICs9XHJcbiAgICAgICAgJyBhdCBsaW5lICcgK1xyXG4gICAgICAgICAgICBsaW5lTm8gK1xyXG4gICAgICAgICAgICAnIGNvbCAnICtcclxuICAgICAgICAgICAgY29sTm8gK1xyXG4gICAgICAgICAgICAnOlxcblxcbicgK1xyXG4gICAgICAgICAgICAnICAnICtcclxuICAgICAgICAgICAgc3RyLnNwbGl0KC9cXG4vKVtsaW5lTm8gLSAxXSArXHJcbiAgICAgICAgICAgICdcXG4nICtcclxuICAgICAgICAgICAgJyAgJyArXHJcbiAgICAgICAgICAgIEFycmF5KGNvbE5vKS5qb2luKCcgJykgK1xyXG4gICAgICAgICAgICAnXic7XHJcbiAgICB0aHJvdyBFdGFFcnIobWVzc2FnZSk7XHJcbn1cblxuLyoqXHJcbiAqIEByZXR1cm5zIFRoZSBnbG9iYWwgUHJvbWlzZSBmdW5jdGlvblxyXG4gKi9cclxudmFyIHByb21pc2VJbXBsID0gbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCkuUHJvbWlzZTtcclxuLyoqXHJcbiAqIEByZXR1cm5zIEEgbmV3IEFzeW5jRnVuY3Rpb24gY29uc3R1Y3RvclxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0QXN5bmNGdW5jdGlvbkNvbnN0cnVjdG9yKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKCdyZXR1cm4gKGFzeW5jIGZ1bmN0aW9uKCl7fSkuY29uc3RydWN0b3InKSgpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIFN5bnRheEVycm9yKSB7XHJcbiAgICAgICAgICAgIHRocm93IEV0YUVycihcIlRoaXMgZW52aXJvbm1lbnQgZG9lc24ndCBzdXBwb3J0IGFzeW5jL2F3YWl0XCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIHN0ci50cmltTGVmdCBwb2x5ZmlsbFxyXG4gKlxyXG4gKiBAcGFyYW0gc3RyIC0gSW5wdXQgc3RyaW5nXHJcbiAqIEByZXR1cm5zIFRoZSBzdHJpbmcgd2l0aCBsZWZ0IHdoaXRlc3BhY2UgcmVtb3ZlZFxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gdHJpbUxlZnQoc3RyKSB7XHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZXh0cmEtYm9vbGVhbi1jYXN0XHJcbiAgICBpZiAoISFTdHJpbmcucHJvdG90eXBlLnRyaW1MZWZ0KSB7XHJcbiAgICAgICAgcmV0dXJuIHN0ci50cmltTGVmdCgpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzKy8sICcnKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogc3RyLnRyaW1SaWdodCBwb2x5ZmlsbFxyXG4gKlxyXG4gKiBAcGFyYW0gc3RyIC0gSW5wdXQgc3RyaW5nXHJcbiAqIEByZXR1cm5zIFRoZSBzdHJpbmcgd2l0aCByaWdodCB3aGl0ZXNwYWNlIHJlbW92ZWRcclxuICpcclxuICovXHJcbmZ1bmN0aW9uIHRyaW1SaWdodChzdHIpIHtcclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1leHRyYS1ib29sZWFuLWNhc3RcclxuICAgIGlmICghIVN0cmluZy5wcm90b3R5cGUudHJpbVJpZ2h0KSB7XHJcbiAgICAgICAgcmV0dXJuIHN0ci50cmltUmlnaHQoKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvXFxzKyQvLCAnJyk7IC8vIFRPRE86IGRvIHdlIHJlYWxseSBuZWVkIHRvIHJlcGxhY2UgQk9NJ3M/XHJcbiAgICB9XHJcbn1cblxuLy8gVE9ETzogYWxsb3cgJy0nIHRvIHRyaW0gdXAgdW50aWwgbmV3bGluZS4gVXNlIFteXFxTXFxuXFxyXSBpbnN0ZWFkIG9mIFxcc1xyXG4vKiBFTkQgVFlQRVMgKi9cclxuZnVuY3Rpb24gaGFzT3duUHJvcChvYmosIHByb3ApIHtcclxuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcclxufVxyXG5mdW5jdGlvbiBjb3B5UHJvcHModG9PYmosIGZyb21PYmopIHtcclxuICAgIGZvciAodmFyIGtleSBpbiBmcm9tT2JqKSB7XHJcbiAgICAgICAgaWYgKGhhc093blByb3AoZnJvbU9iaiwga2V5KSkge1xyXG4gICAgICAgICAgICB0b09ialtrZXldID0gZnJvbU9ialtrZXldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0b09iajtcclxufVxyXG4vKipcclxuICogVGFrZXMgYSBzdHJpbmcgd2l0aGluIGEgdGVtcGxhdGUgYW5kIHRyaW1zIGl0LCBiYXNlZCBvbiB0aGUgcHJlY2VkaW5nIHRhZydzIHdoaXRlc3BhY2UgY29udHJvbCBhbmQgYGNvbmZpZy5hdXRvVHJpbWBcclxuICovXHJcbmZ1bmN0aW9uIHRyaW1XUyhzdHIsIGNvbmZpZywgd3NMZWZ0LCB3c1JpZ2h0KSB7XHJcbiAgICB2YXIgbGVmdFRyaW07XHJcbiAgICB2YXIgcmlnaHRUcmltO1xyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoY29uZmlnLmF1dG9UcmltKSkge1xyXG4gICAgICAgIC8vIGtpbmRhIGNvbmZ1c2luZ1xyXG4gICAgICAgIC8vIGJ1dCBffX0gd2lsbCB0cmltIHRoZSBsZWZ0IHNpZGUgb2YgdGhlIGZvbGxvd2luZyBzdHJpbmdcclxuICAgICAgICBsZWZ0VHJpbSA9IGNvbmZpZy5hdXRvVHJpbVsxXTtcclxuICAgICAgICByaWdodFRyaW0gPSBjb25maWcuYXV0b1RyaW1bMF07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBsZWZ0VHJpbSA9IHJpZ2h0VHJpbSA9IGNvbmZpZy5hdXRvVHJpbTtcclxuICAgIH1cclxuICAgIGlmICh3c0xlZnQgfHwgd3NMZWZ0ID09PSBmYWxzZSkge1xyXG4gICAgICAgIGxlZnRUcmltID0gd3NMZWZ0O1xyXG4gICAgfVxyXG4gICAgaWYgKHdzUmlnaHQgfHwgd3NSaWdodCA9PT0gZmFsc2UpIHtcclxuICAgICAgICByaWdodFRyaW0gPSB3c1JpZ2h0O1xyXG4gICAgfVxyXG4gICAgaWYgKCFyaWdodFRyaW0gJiYgIWxlZnRUcmltKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0cjtcclxuICAgIH1cclxuICAgIGlmIChsZWZ0VHJpbSA9PT0gJ3NsdXJwJyAmJiByaWdodFRyaW0gPT09ICdzbHVycCcpIHtcclxuICAgICAgICByZXR1cm4gc3RyLnRyaW0oKTtcclxuICAgIH1cclxuICAgIGlmIChsZWZ0VHJpbSA9PT0gJ18nIHx8IGxlZnRUcmltID09PSAnc2x1cnAnKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3RyaW1taW5nIGxlZnQnICsgbGVmdFRyaW0pXHJcbiAgICAgICAgLy8gZnVsbCBzbHVycFxyXG4gICAgICAgIHN0ciA9IHRyaW1MZWZ0KHN0cik7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChsZWZ0VHJpbSA9PT0gJy0nIHx8IGxlZnRUcmltID09PSAnbmwnKSB7XHJcbiAgICAgICAgLy8gbmwgdHJpbVxyXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9eKD86XFxyXFxufFxcbnxcXHIpLywgJycpO1xyXG4gICAgfVxyXG4gICAgaWYgKHJpZ2h0VHJpbSA9PT0gJ18nIHx8IHJpZ2h0VHJpbSA9PT0gJ3NsdXJwJykge1xyXG4gICAgICAgIC8vIGZ1bGwgc2x1cnBcclxuICAgICAgICBzdHIgPSB0cmltUmlnaHQoc3RyKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHJpZ2h0VHJpbSA9PT0gJy0nIHx8IHJpZ2h0VHJpbSA9PT0gJ25sJykge1xyXG4gICAgICAgIC8vIG5sIHRyaW1cclxuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZSgvKD86XFxyXFxufFxcbnxcXHIpJC8sICcnKTsgLy8gVE9ETzogbWFrZSBzdXJlIHRoaXMgZ2V0cyBcXHJcXG5cclxuICAgIH1cclxuICAgIHJldHVybiBzdHI7XHJcbn1cclxuLyoqXHJcbiAqIEEgbWFwIG9mIHNwZWNpYWwgSFRNTCBjaGFyYWN0ZXJzIHRvIHRoZWlyIFhNTC1lc2NhcGVkIGVxdWl2YWxlbnRzXHJcbiAqL1xyXG52YXIgZXNjTWFwID0ge1xyXG4gICAgJyYnOiAnJmFtcDsnLFxyXG4gICAgJzwnOiAnJmx0OycsXHJcbiAgICAnPic6ICcmZ3Q7JyxcclxuICAgICdcIic6ICcmcXVvdDsnLFxyXG4gICAgXCInXCI6ICcmIzM5OydcclxufTtcclxuZnVuY3Rpb24gcmVwbGFjZUNoYXIocykge1xyXG4gICAgcmV0dXJuIGVzY01hcFtzXTtcclxufVxyXG4vKipcclxuICogWE1MLWVzY2FwZXMgYW4gaW5wdXQgdmFsdWUgYWZ0ZXIgY29udmVydGluZyBpdCB0byBhIHN0cmluZ1xyXG4gKlxyXG4gKiBAcGFyYW0gc3RyIC0gSW5wdXQgdmFsdWUgKHVzdWFsbHkgYSBzdHJpbmcpXHJcbiAqIEByZXR1cm5zIFhNTC1lc2NhcGVkIHN0cmluZ1xyXG4gKi9cclxuZnVuY3Rpb24gWE1MRXNjYXBlKHN0cikge1xyXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XHJcbiAgICAvLyBUbyBkZWFsIHdpdGggWFNTLiBCYXNlZCBvbiBFc2NhcGUgaW1wbGVtZW50YXRpb25zIG9mIE11c3RhY2hlLkpTIGFuZCBNYXJrbywgdGhlbiBjdXN0b21pemVkLlxyXG4gICAgdmFyIG5ld1N0ciA9IFN0cmluZyhzdHIpO1xyXG4gICAgaWYgKC9bJjw+XCInXS8udGVzdChuZXdTdHIpKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ld1N0ci5yZXBsYWNlKC9bJjw+XCInXS9nLCByZXBsYWNlQ2hhcik7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gbmV3U3RyO1xyXG4gICAgfVxyXG59XG5cbi8qIEVORCBUWVBFUyAqL1xyXG52YXIgdGVtcGxhdGVMaXRSZWcgPSAvYCg/OlxcXFxbXFxzXFxTXXxcXCR7KD86W157fV18eyg/Oltee31dfHtbXn1dKn0pKn0pKn18KD8hXFwkeylbXlxcXFxgXSkqYC9nO1xyXG52YXIgc2luZ2xlUXVvdGVSZWcgPSAvJyg/OlxcXFxbXFxzXFx3XCInXFxcXGBdfFteXFxuXFxyJ1xcXFxdKSo/Jy9nO1xyXG52YXIgZG91YmxlUXVvdGVSZWcgPSAvXCIoPzpcXFxcW1xcc1xcd1wiJ1xcXFxgXXxbXlxcblxcclwiXFxcXF0pKj9cIi9nO1xyXG4vKiogRXNjYXBlIHNwZWNpYWwgcmVndWxhciBleHByZXNzaW9uIGNoYXJhY3RlcnMgaW5zaWRlIGEgc3RyaW5nICovXHJcbmZ1bmN0aW9uIGVzY2FwZVJlZ0V4cChzdHJpbmcpIHtcclxuICAgIC8vIEZyb20gTUROXHJcbiAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoL1suKitcXC0/XiR7fSgpfFtcXF1cXFxcXS9nLCAnXFxcXCQmJyk7IC8vICQmIG1lYW5zIHRoZSB3aG9sZSBtYXRjaGVkIHN0cmluZ1xyXG59XHJcbmZ1bmN0aW9uIHBhcnNlKHN0ciwgY29uZmlnKSB7XHJcbiAgICB2YXIgYnVmZmVyID0gW107XHJcbiAgICB2YXIgdHJpbUxlZnRPZk5leHRTdHIgPSBmYWxzZTtcclxuICAgIHZhciBsYXN0SW5kZXggPSAwO1xyXG4gICAgdmFyIHBhcnNlT3B0aW9ucyA9IGNvbmZpZy5wYXJzZTtcclxuICAgIGlmIChjb25maWcucGx1Z2lucykge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29uZmlnLnBsdWdpbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHBsdWdpbiA9IGNvbmZpZy5wbHVnaW5zW2ldO1xyXG4gICAgICAgICAgICBpZiAocGx1Z2luLnByb2Nlc3NUZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgc3RyID0gcGx1Z2luLnByb2Nlc3NUZW1wbGF0ZShzdHIsIGNvbmZpZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKiBBZGRpbmcgZm9yIEVKUyBjb21wYXRpYmlsaXR5ICovXHJcbiAgICBpZiAoY29uZmlnLnJtV2hpdGVzcGFjZSkge1xyXG4gICAgICAgIC8vIENvZGUgdGFrZW4gZGlyZWN0bHkgZnJvbSBFSlNcclxuICAgICAgICAvLyBIYXZlIHRvIHVzZSB0d28gc2VwYXJhdGUgcmVwbGFjZXMgaGVyZSBhcyBgXmAgYW5kIGAkYCBvcGVyYXRvcnMgZG9uJ3RcclxuICAgICAgICAvLyB3b3JrIHdlbGwgd2l0aCBgXFxyYCBhbmQgZW1wdHkgbGluZXMgZG9uJ3Qgd29yayB3ZWxsIHdpdGggdGhlIGBtYCBmbGFnLlxyXG4gICAgICAgIC8vIEVzc2VudGlhbGx5LCB0aGlzIHJlcGxhY2VzIHRoZSB3aGl0ZXNwYWNlIGF0IHRoZSBiZWdpbm5pbmcgYW5kIGVuZCBvZlxyXG4gICAgICAgIC8vIGVhY2ggbGluZSBhbmQgcmVtb3ZlcyBtdWx0aXBsZSBuZXdsaW5lcy5cclxuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZSgvW1xcclxcbl0rL2csICdcXG4nKS5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nbSwgJycpO1xyXG4gICAgfVxyXG4gICAgLyogRW5kIHJtV2hpdGVzcGFjZSBvcHRpb24gKi9cclxuICAgIHRlbXBsYXRlTGl0UmVnLmxhc3RJbmRleCA9IDA7XHJcbiAgICBzaW5nbGVRdW90ZVJlZy5sYXN0SW5kZXggPSAwO1xyXG4gICAgZG91YmxlUXVvdGVSZWcubGFzdEluZGV4ID0gMDtcclxuICAgIGZ1bmN0aW9uIHB1c2hTdHJpbmcoc3RybmcsIHNob3VsZFRyaW1SaWdodE9mU3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHN0cm5nKSB7XHJcbiAgICAgICAgICAgIC8vIGlmIHN0cmluZyBpcyB0cnV0aHkgaXQgbXVzdCBiZSBvZiB0eXBlICdzdHJpbmcnXHJcbiAgICAgICAgICAgIHN0cm5nID0gdHJpbVdTKHN0cm5nLCBjb25maWcsIHRyaW1MZWZ0T2ZOZXh0U3RyLCAvLyB0aGlzIHdpbGwgb25seSBiZSBmYWxzZSBvbiB0aGUgZmlyc3Qgc3RyLCB0aGUgbmV4dCBvbmVzIHdpbGwgYmUgbnVsbCBvciB1bmRlZmluZWRcclxuICAgICAgICAgICAgc2hvdWxkVHJpbVJpZ2h0T2ZTdHJpbmcpO1xyXG4gICAgICAgICAgICBpZiAoc3RybmcpIHtcclxuICAgICAgICAgICAgICAgIC8vIHJlcGxhY2UgXFwgd2l0aCBcXFxcLCAnIHdpdGggXFwnXHJcbiAgICAgICAgICAgICAgICAvLyB3ZSdyZSBnb2luZyB0byBjb252ZXJ0IGFsbCBDUkxGIHRvIExGIHNvIGl0IGRvZXNuJ3QgdGFrZSBtb3JlIHRoYW4gb25lIHJlcGxhY2VcclxuICAgICAgICAgICAgICAgIHN0cm5nID0gc3RybmcucmVwbGFjZSgvXFxcXHwnL2csICdcXFxcJCYnKS5yZXBsYWNlKC9cXHJcXG58XFxufFxcci9nLCAnXFxcXG4nKTtcclxuICAgICAgICAgICAgICAgIGJ1ZmZlci5wdXNoKHN0cm5nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHZhciBwcmVmaXhlcyA9IFtwYXJzZU9wdGlvbnMuZXhlYywgcGFyc2VPcHRpb25zLmludGVycG9sYXRlLCBwYXJzZU9wdGlvbnMucmF3XS5yZWR1Y2UoZnVuY3Rpb24gKGFjY3VtdWxhdG9yLCBwcmVmaXgpIHtcclxuICAgICAgICBpZiAoYWNjdW11bGF0b3IgJiYgcHJlZml4KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhY2N1bXVsYXRvciArICd8JyArIGVzY2FwZVJlZ0V4cChwcmVmaXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChwcmVmaXgpIHtcclxuICAgICAgICAgICAgLy8gYWNjdW11bGF0b3IgaXMgZmFsc3lcclxuICAgICAgICAgICAgcmV0dXJuIGVzY2FwZVJlZ0V4cChwcmVmaXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gcHJlZml4IGFuZCBhY2N1bXVsYXRvciBhcmUgYm90aCBmYWxzeVxyXG4gICAgICAgICAgICByZXR1cm4gYWNjdW11bGF0b3I7XHJcbiAgICAgICAgfVxyXG4gICAgfSwgJycpO1xyXG4gICAgdmFyIHBhcnNlT3BlblJlZyA9IG5ldyBSZWdFeHAoJyhbXl0qPyknICsgZXNjYXBlUmVnRXhwKGNvbmZpZy50YWdzWzBdKSArICcoLXxfKT9cXFxccyooJyArIHByZWZpeGVzICsgJyk/XFxcXHMqKD8hW1xcXFxzK1xcXFwtXycgKyBwcmVmaXhlcyArICddKScsICdnJyk7XHJcbiAgICB2YXIgcGFyc2VDbG9zZVJlZyA9IG5ldyBSZWdFeHAoJ1xcJ3xcInxgfFxcXFwvXFxcXCp8KFxcXFxzKigtfF8pPycgKyBlc2NhcGVSZWdFeHAoY29uZmlnLnRhZ3NbMV0pICsgJyknLCAnZycpO1xyXG4gICAgLy8gVE9ETzogYmVuY2htYXJrIGhhdmluZyB0aGUgXFxzKiBvbiBlaXRoZXIgc2lkZSB2cyB1c2luZyBzdHIudHJpbSgpXHJcbiAgICB2YXIgbTtcclxuICAgIHdoaWxlICgobSA9IHBhcnNlT3BlblJlZy5leGVjKHN0cikpKSB7XHJcbiAgICAgICAgbGFzdEluZGV4ID0gbVswXS5sZW5ndGggKyBtLmluZGV4O1xyXG4gICAgICAgIHZhciBwcmVjZWRpbmdTdHJpbmcgPSBtWzFdO1xyXG4gICAgICAgIHZhciB3c0xlZnQgPSBtWzJdO1xyXG4gICAgICAgIHZhciBwcmVmaXggPSBtWzNdIHx8ICcnOyAvLyBieSBkZWZhdWx0IGVpdGhlciB+LCA9LCBvciBlbXB0eVxyXG4gICAgICAgIHB1c2hTdHJpbmcocHJlY2VkaW5nU3RyaW5nLCB3c0xlZnQpO1xyXG4gICAgICAgIHBhcnNlQ2xvc2VSZWcubGFzdEluZGV4ID0gbGFzdEluZGV4O1xyXG4gICAgICAgIHZhciBjbG9zZVRhZyA9IHZvaWQgMDtcclxuICAgICAgICB2YXIgY3VycmVudE9iaiA9IGZhbHNlO1xyXG4gICAgICAgIHdoaWxlICgoY2xvc2VUYWcgPSBwYXJzZUNsb3NlUmVnLmV4ZWMoc3RyKSkpIHtcclxuICAgICAgICAgICAgaWYgKGNsb3NlVGFnWzFdKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29udGVudCA9IHN0ci5zbGljZShsYXN0SW5kZXgsIGNsb3NlVGFnLmluZGV4KTtcclxuICAgICAgICAgICAgICAgIHBhcnNlT3BlblJlZy5sYXN0SW5kZXggPSBsYXN0SW5kZXggPSBwYXJzZUNsb3NlUmVnLmxhc3RJbmRleDtcclxuICAgICAgICAgICAgICAgIHRyaW1MZWZ0T2ZOZXh0U3RyID0gY2xvc2VUYWdbMl07XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudFR5cGUgPSBwcmVmaXggPT09IHBhcnNlT3B0aW9ucy5leGVjXHJcbiAgICAgICAgICAgICAgICAgICAgPyAnZSdcclxuICAgICAgICAgICAgICAgICAgICA6IHByZWZpeCA9PT0gcGFyc2VPcHRpb25zLnJhd1xyXG4gICAgICAgICAgICAgICAgICAgICAgICA/ICdyJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IHByZWZpeCA9PT0gcGFyc2VPcHRpb25zLmludGVycG9sYXRlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdpJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnJztcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRPYmogPSB7IHQ6IGN1cnJlbnRUeXBlLCB2YWw6IGNvbnRlbnQgfTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNoYXIgPSBjbG9zZVRhZ1swXTtcclxuICAgICAgICAgICAgICAgIGlmIChjaGFyID09PSAnLyonKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbW1lbnRDbG9zZUluZCA9IHN0ci5pbmRleE9mKCcqLycsIHBhcnNlQ2xvc2VSZWcubGFzdEluZGV4KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY29tbWVudENsb3NlSW5kID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQYXJzZUVycigndW5jbG9zZWQgY29tbWVudCcsIHN0ciwgY2xvc2VUYWcuaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBwYXJzZUNsb3NlUmVnLmxhc3RJbmRleCA9IGNvbW1lbnRDbG9zZUluZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNoYXIgPT09IFwiJ1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2luZ2xlUXVvdGVSZWcubGFzdEluZGV4ID0gY2xvc2VUYWcuaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNpbmdsZVF1b3RlTWF0Y2ggPSBzaW5nbGVRdW90ZVJlZy5leGVjKHN0cik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNpbmdsZVF1b3RlTWF0Y2gpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VDbG9zZVJlZy5sYXN0SW5kZXggPSBzaW5nbGVRdW90ZVJlZy5sYXN0SW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQYXJzZUVycigndW5jbG9zZWQgc3RyaW5nJywgc3RyLCBjbG9zZVRhZy5pbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoY2hhciA9PT0gJ1wiJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvdWJsZVF1b3RlUmVnLmxhc3RJbmRleCA9IGNsb3NlVGFnLmluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkb3VibGVRdW90ZU1hdGNoID0gZG91YmxlUXVvdGVSZWcuZXhlYyhzdHIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkb3VibGVRdW90ZU1hdGNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlQ2xvc2VSZWcubGFzdEluZGV4ID0gZG91YmxlUXVvdGVSZWcubGFzdEluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUGFyc2VFcnIoJ3VuY2xvc2VkIHN0cmluZycsIHN0ciwgY2xvc2VUYWcuaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNoYXIgPT09ICdgJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlTGl0UmVnLmxhc3RJbmRleCA9IGNsb3NlVGFnLmluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZUxpdE1hdGNoID0gdGVtcGxhdGVMaXRSZWcuZXhlYyhzdHIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZW1wbGF0ZUxpdE1hdGNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlQ2xvc2VSZWcubGFzdEluZGV4ID0gdGVtcGxhdGVMaXRSZWcubGFzdEluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUGFyc2VFcnIoJ3VuY2xvc2VkIHN0cmluZycsIHN0ciwgY2xvc2VUYWcuaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY3VycmVudE9iaikge1xyXG4gICAgICAgICAgICBidWZmZXIucHVzaChjdXJyZW50T2JqKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIFBhcnNlRXJyKCd1bmNsb3NlZCB0YWcnLCBzdHIsIG0uaW5kZXggKyBwcmVjZWRpbmdTdHJpbmcubGVuZ3RoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdXNoU3RyaW5nKHN0ci5zbGljZShsYXN0SW5kZXgsIHN0ci5sZW5ndGgpLCBmYWxzZSk7XHJcbiAgICBpZiAoY29uZmlnLnBsdWdpbnMpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbmZpZy5wbHVnaW5zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBwbHVnaW4gPSBjb25maWcucGx1Z2luc1tpXTtcclxuICAgICAgICAgICAgaWYgKHBsdWdpbi5wcm9jZXNzQVNUKSB7XHJcbiAgICAgICAgICAgICAgICBidWZmZXIgPSBwbHVnaW4ucHJvY2Vzc0FTVChidWZmZXIsIGNvbmZpZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYnVmZmVyO1xyXG59XG5cbi8qIEVORCBUWVBFUyAqL1xyXG4vKipcclxuICogQ29tcGlsZXMgYSB0ZW1wbGF0ZSBzdHJpbmcgdG8gYSBmdW5jdGlvbiBzdHJpbmcuIE1vc3Qgb2Z0ZW4gdXNlcnMganVzdCB1c2UgYGNvbXBpbGUoKWAsIHdoaWNoIGNhbGxzIGBjb21waWxlVG9TdHJpbmdgIGFuZCBjcmVhdGVzIGEgbmV3IGZ1bmN0aW9uIHVzaW5nIHRoZSByZXN1bHRcclxuICpcclxuICogKipFeGFtcGxlKipcclxuICpcclxuICogYGBganNcclxuICogY29tcGlsZVRvU3RyaW5nKFwiSGkgPCU9IGl0LnVzZXIgJT5cIiwgZXRhLmNvbmZpZylcclxuICogLy8gXCJ2YXIgdFI9JycsaW5jbHVkZT1FLmluY2x1ZGUuYmluZChFKSxpbmNsdWRlRmlsZT1FLmluY2x1ZGVGaWxlLmJpbmQoRSk7dFIrPSdIaSAnO3RSKz1FLmUoaXQudXNlcik7aWYoY2Ipe2NiKG51bGwsdFIpfSByZXR1cm4gdFJcIlxyXG4gKiBgYGBcclxuICovXHJcbmZ1bmN0aW9uIGNvbXBpbGVUb1N0cmluZyhzdHIsIGNvbmZpZykge1xyXG4gICAgdmFyIGJ1ZmZlciA9IHBhcnNlKHN0ciwgY29uZmlnKTtcclxuICAgIHZhciByZXMgPSBcInZhciB0Uj0nJyxfX2wsX19sUFwiICtcclxuICAgICAgICAoY29uZmlnLmluY2x1ZGUgPyAnLGluY2x1ZGU9RS5pbmNsdWRlLmJpbmQoRSknIDogJycpICtcclxuICAgICAgICAoY29uZmlnLmluY2x1ZGVGaWxlID8gJyxpbmNsdWRlRmlsZT1FLmluY2x1ZGVGaWxlLmJpbmQoRSknIDogJycpICtcclxuICAgICAgICAnXFxuZnVuY3Rpb24gbGF5b3V0KHAsZCl7X19sPXA7X19sUD1kfVxcbicgK1xyXG4gICAgICAgIChjb25maWcuZ2xvYmFsQXdhaXQgPyAnY29uc3QgX3BycyA9IFtdO1xcbicgOiAnJykgK1xyXG4gICAgICAgIChjb25maWcudXNlV2l0aCA/ICd3aXRoKCcgKyBjb25maWcudmFyTmFtZSArICd8fHt9KXsnIDogJycpICtcclxuICAgICAgICBjb21waWxlU2NvcGUoYnVmZmVyLCBjb25maWcpICtcclxuICAgICAgICAoY29uZmlnLmluY2x1ZGVGaWxlXHJcbiAgICAgICAgICAgID8gJ2lmKF9fbCl0Uj0nICtcclxuICAgICAgICAgICAgICAgIChjb25maWcuYXN5bmMgPyAnYXdhaXQgJyA6ICcnKSArXHJcbiAgICAgICAgICAgICAgICAoXCJpbmNsdWRlRmlsZShfX2wsT2JqZWN0LmFzc2lnbihcIiArIGNvbmZpZy52YXJOYW1lICsgXCIse2JvZHk6dFJ9LF9fbFApKVxcblwiKVxyXG4gICAgICAgICAgICA6IGNvbmZpZy5pbmNsdWRlXHJcbiAgICAgICAgICAgICAgICA/ICdpZihfX2wpdFI9JyArXHJcbiAgICAgICAgICAgICAgICAgICAgKGNvbmZpZy5hc3luYyA/ICdhd2FpdCAnIDogJycpICtcclxuICAgICAgICAgICAgICAgICAgICAoXCJpbmNsdWRlKF9fbCxPYmplY3QuYXNzaWduKFwiICsgY29uZmlnLnZhck5hbWUgKyBcIix7Ym9keTp0Un0sX19sUCkpXFxuXCIpXHJcbiAgICAgICAgICAgICAgICA6ICcnKSArXHJcbiAgICAgICAgJ2lmKGNiKXtjYihudWxsLHRSKX0gcmV0dXJuIHRSJyArXHJcbiAgICAgICAgKGNvbmZpZy51c2VXaXRoID8gJ30nIDogJycpO1xyXG4gICAgaWYgKGNvbmZpZy5wbHVnaW5zKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb25maWcucGx1Z2lucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcGx1Z2luID0gY29uZmlnLnBsdWdpbnNbaV07XHJcbiAgICAgICAgICAgIGlmIChwbHVnaW4ucHJvY2Vzc0ZuU3RyaW5nKSB7XHJcbiAgICAgICAgICAgICAgICByZXMgPSBwbHVnaW4ucHJvY2Vzc0ZuU3RyaW5nKHJlcywgY29uZmlnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXM7XHJcbn1cclxuLyoqXHJcbiAqIExvb3BzIHRocm91Z2ggdGhlIEFTVCBnZW5lcmF0ZWQgYnkgYHBhcnNlYCBhbmQgdHJhbnNmb3JtIGVhY2ggaXRlbSBpbnRvIEpTIGNhbGxzXHJcbiAqXHJcbiAqICoqRXhhbXBsZSoqXHJcbiAqXHJcbiAqIGBgYGpzXHJcbiAqIC8vIEFTVCB2ZXJzaW9uIG9mICdIaSA8JT0gaXQudXNlciAlPidcclxuICogbGV0IHRlbXBsYXRlQVNUID0gWydIaSAnLCB7IHZhbDogJ2l0LnVzZXInLCB0OiAnaScgfV1cclxuICogY29tcGlsZVNjb3BlKHRlbXBsYXRlQVNULCBldGEuY29uZmlnKVxyXG4gKiAvLyBcInRSKz0nSGkgJzt0Uis9RS5lKGl0LnVzZXIpO1wiXHJcbiAqIGBgYFxyXG4gKi9cclxuZnVuY3Rpb24gY29tcGlsZVNjb3BlKGJ1ZmYsIGNvbmZpZykge1xyXG4gICAgdmFyIGk7XHJcbiAgICB2YXIgYnVmZkxlbmd0aCA9IGJ1ZmYubGVuZ3RoO1xyXG4gICAgdmFyIHJldHVyblN0ciA9ICcnO1xyXG4gICAgdmFyIFJFUExBQ0VNRU5UX1NUUiA9IFwickoyS3FYenhRZ1wiO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IGJ1ZmZMZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBjdXJyZW50QmxvY2sgPSBidWZmW2ldO1xyXG4gICAgICAgIGlmICh0eXBlb2YgY3VycmVudEJsb2NrID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICB2YXIgc3RyID0gY3VycmVudEJsb2NrO1xyXG4gICAgICAgICAgICAvLyB3ZSBrbm93IHN0cmluZyBleGlzdHNcclxuICAgICAgICAgICAgcmV0dXJuU3RyICs9IFwidFIrPSdcIiArIHN0ciArIFwiJ1xcblwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHR5cGUgPSBjdXJyZW50QmxvY2sudDsgLy8gfiwgcywgISwgPywgclxyXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IGN1cnJlbnRCbG9jay52YWwgfHwgJyc7XHJcbiAgICAgICAgICAgIGlmICh0eXBlID09PSAncicpIHtcclxuICAgICAgICAgICAgICAgIC8vIHJhd1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvbmZpZy5nbG9iYWxBd2FpdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblN0ciArPSBcIl9wcnMucHVzaChcIiArIGNvbnRlbnQgKyBcIik7XFxuXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuU3RyICs9IFwidFIrPSdcIiArIFJFUExBQ0VNRU5UX1NUUiArIFwiJ1xcblwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbmZpZy5maWx0ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudCA9ICdFLmZpbHRlcignICsgY29udGVudCArICcpJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuU3RyICs9ICd0Uis9JyArIGNvbnRlbnQgKyAnXFxuJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlID09PSAnaScpIHtcclxuICAgICAgICAgICAgICAgIC8vIGludGVycG9sYXRlXHJcbiAgICAgICAgICAgICAgICBpZiAoY29uZmlnLmdsb2JhbEF3YWl0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuU3RyICs9IFwiX3Bycy5wdXNoKFwiICsgY29udGVudCArIFwiKTtcXG5cIjtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm5TdHIgKz0gXCJ0Uis9J1wiICsgUkVQTEFDRU1FTlRfU1RSICsgXCInXFxuXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY29uZmlnLmZpbHRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gJ0UuZmlsdGVyKCcgKyBjb250ZW50ICsgJyknO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm5TdHIgKz0gJ3RSKz0nICsgY29udGVudCArICdcXG4nO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb25maWcuYXV0b0VzY2FwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gJ0UuZSgnICsgY29udGVudCArICcpJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuU3RyICs9ICd0Uis9JyArIGNvbnRlbnQgKyAnXFxuJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlID09PSAnZScpIHtcclxuICAgICAgICAgICAgICAgIC8vIGV4ZWN1dGVcclxuICAgICAgICAgICAgICAgIHJldHVyblN0ciArPSBjb250ZW50ICsgJ1xcbic7IC8vIHlvdSBuZWVkIGEgXFxuIGluIGNhc2UgeW91IGhhdmUgPCUgfSAlPlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKGNvbmZpZy5nbG9iYWxBd2FpdCkge1xyXG4gICAgICAgIHJldHVyblN0ciArPSBcImNvbnN0IF9yc3QgPSBhd2FpdCBQcm9taXNlLmFsbChfcHJzKTtcXG50UiA9IHRSLnJlcGxhY2UoL1wiICsgUkVQTEFDRU1FTlRfU1RSICsgXCIvZywgKCkgPT4gX3JzdC5zaGlmdCgpKTtcXG5cIjtcclxuICAgIH1cclxuICAgIHJldHVybiByZXR1cm5TdHI7XHJcbn1cblxuLyoqXHJcbiAqIEhhbmRsZXMgc3RvcmFnZSBhbmQgYWNjZXNzaW5nIG9mIHZhbHVlc1xyXG4gKlxyXG4gKiBJbiB0aGlzIGNhc2UsIHdlIHVzZSBpdCB0byBzdG9yZSBjb21waWxlZCB0ZW1wbGF0ZSBmdW5jdGlvbnNcclxuICogSW5kZXhlZCBieSB0aGVpciBgbmFtZWAgb3IgYGZpbGVuYW1lYFxyXG4gKi9cclxudmFyIENhY2hlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIENhY2hlcihjYWNoZSkge1xyXG4gICAgICAgIHRoaXMuY2FjaGUgPSBjYWNoZTtcclxuICAgIH1cclxuICAgIENhY2hlci5wcm90b3R5cGUuZGVmaW5lID0gZnVuY3Rpb24gKGtleSwgdmFsKSB7XHJcbiAgICAgICAgdGhpcy5jYWNoZVtrZXldID0gdmFsO1xyXG4gICAgfTtcclxuICAgIENhY2hlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgIC8vIHN0cmluZyB8IGFycmF5LlxyXG4gICAgICAgIC8vIFRPRE86IGFsbG93IGFycmF5IG9mIGtleXMgdG8gbG9vayBkb3duXHJcbiAgICAgICAgLy8gVE9ETzogY3JlYXRlIHBsdWdpbiB0byBhbGxvdyByZWZlcmVuY2luZyBoZWxwZXJzLCBmaWx0ZXJzIHdpdGggZG90IG5vdGF0aW9uXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVba2V5XTtcclxuICAgIH07XHJcbiAgICBDYWNoZXIucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICBkZWxldGUgdGhpcy5jYWNoZVtrZXldO1xyXG4gICAgfTtcclxuICAgIENhY2hlci5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5jYWNoZSA9IHt9O1xyXG4gICAgfTtcclxuICAgIENhY2hlci5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uIChjYWNoZU9iaikge1xyXG4gICAgICAgIGNvcHlQcm9wcyh0aGlzLmNhY2hlLCBjYWNoZU9iaik7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIENhY2hlcjtcclxufSgpKTtcblxuLyogRU5EIFRZUEVTICovXHJcbi8qKlxyXG4gKiBFdGEncyB0ZW1wbGF0ZSBzdG9yYWdlXHJcbiAqXHJcbiAqIFN0b3JlcyBwYXJ0aWFscyBhbmQgY2FjaGVkIHRlbXBsYXRlc1xyXG4gKi9cclxudmFyIHRlbXBsYXRlcyA9IG5ldyBDYWNoZXIoe30pO1xuXG4vKiBFTkQgVFlQRVMgKi9cclxuLyoqXHJcbiAqIEluY2x1ZGUgYSB0ZW1wbGF0ZSBiYXNlZCBvbiBpdHMgbmFtZSAob3IgZmlsZXBhdGgsIGlmIGl0J3MgYWxyZWFkeSBiZWVuIGNhY2hlZCkuXHJcbiAqXHJcbiAqIENhbGxlZCBsaWtlIGBpbmNsdWRlKHRlbXBsYXRlTmFtZU9yUGF0aCwgZGF0YSlgXHJcbiAqL1xyXG5mdW5jdGlvbiBpbmNsdWRlSGVscGVyKHRlbXBsYXRlTmFtZU9yUGF0aCwgZGF0YSkge1xyXG4gICAgdmFyIHRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZXMuZ2V0KHRlbXBsYXRlTmFtZU9yUGF0aCk7XHJcbiAgICBpZiAoIXRlbXBsYXRlKSB7XHJcbiAgICAgICAgdGhyb3cgRXRhRXJyKCdDb3VsZCBub3QgZmV0Y2ggdGVtcGxhdGUgXCInICsgdGVtcGxhdGVOYW1lT3JQYXRoICsgJ1wiJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGVtcGxhdGUoZGF0YSwgdGhpcyk7XHJcbn1cclxuLyoqIEV0YSdzIGJhc2UgKGdsb2JhbCkgY29uZmlndXJhdGlvbiAqL1xyXG52YXIgY29uZmlnID0ge1xyXG4gICAgYXN5bmM6IGZhbHNlLFxyXG4gICAgYXV0b0VzY2FwZTogdHJ1ZSxcclxuICAgIGF1dG9UcmltOiBbZmFsc2UsICdubCddLFxyXG4gICAgY2FjaGU6IGZhbHNlLFxyXG4gICAgZTogWE1MRXNjYXBlLFxyXG4gICAgaW5jbHVkZTogaW5jbHVkZUhlbHBlcixcclxuICAgIHBhcnNlOiB7XHJcbiAgICAgICAgZXhlYzogJycsXHJcbiAgICAgICAgaW50ZXJwb2xhdGU6ICc9JyxcclxuICAgICAgICByYXc6ICd+J1xyXG4gICAgfSxcclxuICAgIHBsdWdpbnM6IFtdLFxyXG4gICAgcm1XaGl0ZXNwYWNlOiBmYWxzZSxcclxuICAgIHRhZ3M6IFsnPCUnLCAnJT4nXSxcclxuICAgIHRlbXBsYXRlczogdGVtcGxhdGVzLFxyXG4gICAgdXNlV2l0aDogZmFsc2UsXHJcbiAgICB2YXJOYW1lOiAnaXQnXHJcbn07XHJcbi8qKlxyXG4gKiBUYWtlcyBvbmUgb3IgdHdvIHBhcnRpYWwgKG5vdCBuZWNlc3NhcmlseSBjb21wbGV0ZSkgY29uZmlndXJhdGlvbiBvYmplY3RzLCBtZXJnZXMgdGhlbSAxIGxheWVyIGRlZXAgaW50byBldGEuY29uZmlnLCBhbmQgcmV0dXJucyB0aGUgcmVzdWx0XHJcbiAqXHJcbiAqIEBwYXJhbSBvdmVycmlkZSBQYXJ0aWFsIGNvbmZpZ3VyYXRpb24gb2JqZWN0XHJcbiAqIEBwYXJhbSBiYXNlQ29uZmlnIFBhcnRpYWwgY29uZmlndXJhdGlvbiBvYmplY3QgdG8gbWVyZ2UgYmVmb3JlIGBvdmVycmlkZWBcclxuICpcclxuICogKipFeGFtcGxlKipcclxuICpcclxuICogYGBganNcclxuICogbGV0IGN1c3RvbUNvbmZpZyA9IGdldENvbmZpZyh7dGFnczogWychIycsICcjISddfSlcclxuICogYGBgXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRDb25maWcob3ZlcnJpZGUsIGJhc2VDb25maWcpIHtcclxuICAgIC8vIFRPRE86IHJ1biBtb3JlIHRlc3RzIG9uIHRoaXNcclxuICAgIHZhciByZXMgPSB7fTsgLy8gTGlua2VkXHJcbiAgICBjb3B5UHJvcHMocmVzLCBjb25maWcpOyAvLyBDcmVhdGVzIGRlZXAgY2xvbmUgb2YgZXRhLmNvbmZpZywgMSBsYXllciBkZWVwXHJcbiAgICBpZiAoYmFzZUNvbmZpZykge1xyXG4gICAgICAgIGNvcHlQcm9wcyhyZXMsIGJhc2VDb25maWcpO1xyXG4gICAgfVxyXG4gICAgaWYgKG92ZXJyaWRlKSB7XHJcbiAgICAgICAgY29weVByb3BzKHJlcywgb3ZlcnJpZGUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlcztcclxufVxyXG4vKiogVXBkYXRlIEV0YSdzIGJhc2UgY29uZmlnICovXHJcbmZ1bmN0aW9uIGNvbmZpZ3VyZShvcHRpb25zKSB7XHJcbiAgICByZXR1cm4gY29weVByb3BzKGNvbmZpZywgb3B0aW9ucyk7XHJcbn1cblxuLyogRU5EIFRZUEVTICovXHJcbi8qKlxyXG4gKiBUYWtlcyBhIHRlbXBsYXRlIHN0cmluZyBhbmQgcmV0dXJucyBhIHRlbXBsYXRlIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIGNhbGxlZCB3aXRoIChkYXRhLCBjb25maWcsIFtjYl0pXHJcbiAqXHJcbiAqIEBwYXJhbSBzdHIgLSBUaGUgdGVtcGxhdGUgc3RyaW5nXHJcbiAqIEBwYXJhbSBjb25maWcgLSBBIGN1c3RvbSBjb25maWd1cmF0aW9uIG9iamVjdCAob3B0aW9uYWwpXHJcbiAqXHJcbiAqICoqRXhhbXBsZSoqXHJcbiAqXHJcbiAqIGBgYGpzXHJcbiAqIGxldCBjb21waWxlZEZuID0gZXRhLmNvbXBpbGUoXCJIaSA8JT0gaXQudXNlciAlPlwiKVxyXG4gKiAvLyBmdW5jdGlvbiBhbm9ueW1vdXMoKVxyXG4gKiBsZXQgY29tcGlsZWRGblN0ciA9IGNvbXBpbGVkRm4udG9TdHJpbmcoKVxyXG4gKiAvLyBcImZ1bmN0aW9uIGFub255bW91cyhpdCxFLGNiXFxuKSB7XFxudmFyIHRSPScnLGluY2x1ZGU9RS5pbmNsdWRlLmJpbmQoRSksaW5jbHVkZUZpbGU9RS5pbmNsdWRlRmlsZS5iaW5kKEUpO3RSKz0nSGkgJzt0Uis9RS5lKGl0LnVzZXIpO2lmKGNiKXtjYihudWxsLHRSKX0gcmV0dXJuIHRSXFxufVwiXHJcbiAqIGBgYFxyXG4gKi9cclxuZnVuY3Rpb24gY29tcGlsZShzdHIsIGNvbmZpZykge1xyXG4gICAgdmFyIG9wdGlvbnMgPSBnZXRDb25maWcoY29uZmlnIHx8IHt9KTtcclxuICAgIC8qIEFTWU5DIEhBTkRMSU5HICovXHJcbiAgICAvLyBUaGUgYmVsb3cgY29kZSBpcyBtb2RpZmllZCBmcm9tIG1kZS9lanMuIEFsbCBjcmVkaXQgc2hvdWxkIGdvIHRvIHRoZW0uXHJcbiAgICB2YXIgY3RvciA9IG9wdGlvbnMuYXN5bmMgPyBnZXRBc3luY0Z1bmN0aW9uQ29uc3RydWN0b3IoKSA6IEZ1bmN0aW9uO1xyXG4gICAgLyogRU5EIEFTWU5DIEhBTkRMSU5HICovXHJcbiAgICB0cnkge1xyXG4gICAgICAgIHJldHVybiBuZXcgY3RvcihvcHRpb25zLnZhck5hbWUsICdFJywgLy8gRXRhQ29uZmlnXHJcbiAgICAgICAgJ2NiJywgLy8gb3B0aW9uYWwgY2FsbGJhY2tcclxuICAgICAgICBjb21waWxlVG9TdHJpbmcoc3RyLCBvcHRpb25zKSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3LWZ1bmNcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBTeW50YXhFcnJvcikge1xyXG4gICAgICAgICAgICB0aHJvdyBFdGFFcnIoJ0JhZCB0ZW1wbGF0ZSBzeW50YXhcXG5cXG4nICtcclxuICAgICAgICAgICAgICAgIGUubWVzc2FnZSArXHJcbiAgICAgICAgICAgICAgICAnXFxuJyArXHJcbiAgICAgICAgICAgICAgICBBcnJheShlLm1lc3NhZ2UubGVuZ3RoICsgMSkuam9pbignPScpICtcclxuICAgICAgICAgICAgICAgICdcXG4nICtcclxuICAgICAgICAgICAgICAgIGNvbXBpbGVUb1N0cmluZyhzdHIsIG9wdGlvbnMpICtcclxuICAgICAgICAgICAgICAgICdcXG4nIC8vIFRoaXMgd2lsbCBwdXQgYW4gZXh0cmEgbmV3bGluZSBiZWZvcmUgdGhlIGNhbGxzdGFjayBmb3IgZXh0cmEgcmVhZGFiaWxpdHlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IGU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XG5cbnZhciBfQk9NID0gL15cXHVGRUZGLztcclxuLyogRU5EIFRZUEVTICovXHJcbi8qKlxyXG4gKiBHZXQgdGhlIHBhdGggdG8gdGhlIGluY2x1ZGVkIGZpbGUgZnJvbSB0aGUgcGFyZW50IGZpbGUgcGF0aCBhbmQgdGhlXHJcbiAqIHNwZWNpZmllZCBwYXRoLlxyXG4gKlxyXG4gKiBJZiBgbmFtZWAgZG9lcyBub3QgaGF2ZSBhbiBleHRlbnNpb24sIGl0IHdpbGwgZGVmYXVsdCB0byBgLmV0YWBcclxuICpcclxuICogQHBhcmFtIG5hbWUgc3BlY2lmaWVkIHBhdGhcclxuICogQHBhcmFtIHBhcmVudGZpbGUgcGFyZW50IGZpbGUgcGF0aFxyXG4gKiBAcGFyYW0gaXNEaXJlY3Rvcnkgd2hldGhlciBwYXJlbnRmaWxlIGlzIGEgZGlyZWN0b3J5XHJcbiAqIEByZXR1cm4gYWJzb2x1dGUgcGF0aCB0byB0ZW1wbGF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0V2hvbGVGaWxlUGF0aChuYW1lLCBwYXJlbnRmaWxlLCBpc0RpcmVjdG9yeSkge1xyXG4gICAgdmFyIGluY2x1ZGVQYXRoID0gcGF0aC5yZXNvbHZlKGlzRGlyZWN0b3J5ID8gcGFyZW50ZmlsZSA6IHBhdGguZGlybmFtZShwYXJlbnRmaWxlKSwgLy8gcmV0dXJucyBkaXJlY3RvcnkgdGhlIHBhcmVudCBmaWxlIGlzIGluXHJcbiAgICBuYW1lIC8vIGZpbGVcclxuICAgICkgKyAocGF0aC5leHRuYW1lKG5hbWUpID8gJycgOiAnLmV0YScpO1xyXG4gICAgcmV0dXJuIGluY2x1ZGVQYXRoO1xyXG59XHJcbi8qKlxyXG4gKiBHZXQgdGhlIGFic29sdXRlIHBhdGggdG8gYW4gaW5jbHVkZWQgdGVtcGxhdGVcclxuICpcclxuICogSWYgdGhpcyBpcyBjYWxsZWQgd2l0aCBhbiBhYnNvbHV0ZSBwYXRoIChmb3IgZXhhbXBsZSwgc3RhcnRpbmcgd2l0aCAnLycgb3IgJ0M6XFwnKVxyXG4gKiB0aGVuIEV0YSB3aWxsIGF0dGVtcHQgdG8gcmVzb2x2ZSB0aGUgYWJzb2x1dGUgcGF0aCB3aXRoaW4gb3B0aW9ucy52aWV3cy4gSWYgaXQgY2Fubm90LFxyXG4gKiBFdGEgd2lsbCBmYWxsYmFjayB0byBvcHRpb25zLnJvb3Qgb3IgJy8nXHJcbiAqXHJcbiAqIElmIHRoaXMgaXMgY2FsbGVkIHdpdGggYSByZWxhdGl2ZSBwYXRoLCBFdGEgd2lsbDpcclxuICogLSBMb29rIHJlbGF0aXZlIHRvIHRoZSBjdXJyZW50IHRlbXBsYXRlIChpZiB0aGUgY3VycmVudCB0ZW1wbGF0ZSBoYXMgdGhlIGBmaWxlbmFtZWAgcHJvcGVydHkpXHJcbiAqIC0gTG9vayBpbnNpZGUgZWFjaCBkaXJlY3RvcnkgaW4gb3B0aW9ucy52aWV3c1xyXG4gKlxyXG4gKiBOb3RlOiBpZiBFdGEgaXMgdW5hYmxlIHRvIGZpbmQgYSB0ZW1wbGF0ZSB1c2luZyBwYXRoIGFuZCBvcHRpb25zLCBpdCB3aWxsIHRocm93IGFuIGVycm9yLlxyXG4gKlxyXG4gKiBAcGFyYW0gcGF0aCAgICBzcGVjaWZpZWQgcGF0aFxyXG4gKiBAcGFyYW0gb3B0aW9ucyBjb21waWxhdGlvbiBvcHRpb25zXHJcbiAqIEByZXR1cm4gYWJzb2x1dGUgcGF0aCB0byB0ZW1wbGF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0UGF0aChwYXRoLCBvcHRpb25zKSB7XHJcbiAgICB2YXIgaW5jbHVkZVBhdGggPSBmYWxzZTtcclxuICAgIHZhciB2aWV3cyA9IG9wdGlvbnMudmlld3M7XHJcbiAgICB2YXIgc2VhcmNoZWRQYXRocyA9IFtdO1xyXG4gICAgLy8gSWYgdGhlc2UgZm91ciB2YWx1ZXMgYXJlIHRoZSBzYW1lLFxyXG4gICAgLy8gZ2V0UGF0aCgpIHdpbGwgcmV0dXJuIHRoZSBzYW1lIHJlc3VsdCBldmVyeSB0aW1lLlxyXG4gICAgLy8gV2UgY2FuIGNhY2hlIHRoZSByZXN1bHQgdG8gYXZvaWQgZXhwZW5zaXZlXHJcbiAgICAvLyBmaWxlIG9wZXJhdGlvbnMuXHJcbiAgICB2YXIgcGF0aE9wdGlvbnMgPSBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgZmlsZW5hbWU6IG9wdGlvbnMuZmlsZW5hbWUsXHJcbiAgICAgICAgcGF0aDogcGF0aCxcclxuICAgICAgICByb290OiBvcHRpb25zLnJvb3QsXHJcbiAgICAgICAgdmlld3M6IG9wdGlvbnMudmlld3NcclxuICAgIH0pO1xyXG4gICAgaWYgKG9wdGlvbnMuY2FjaGUgJiYgb3B0aW9ucy5maWxlcGF0aENhY2hlICYmIG9wdGlvbnMuZmlsZXBhdGhDYWNoZVtwYXRoT3B0aW9uc10pIHtcclxuICAgICAgICAvLyBVc2UgdGhlIGNhY2hlZCBmaWxlcGF0aFxyXG4gICAgICAgIHJldHVybiBvcHRpb25zLmZpbGVwYXRoQ2FjaGVbcGF0aE9wdGlvbnNdO1xyXG4gICAgfVxyXG4gICAgLyoqIEFkZCBhIGZpbGVwYXRoIHRvIHRoZSBsaXN0IG9mIHBhdGhzIHdlJ3ZlIGNoZWNrZWQgZm9yIGEgdGVtcGxhdGUgKi9cclxuICAgIGZ1bmN0aW9uIGFkZFBhdGhUb1NlYXJjaGVkKHBhdGhTZWFyY2hlZCkge1xyXG4gICAgICAgIGlmICghc2VhcmNoZWRQYXRocy5pbmNsdWRlcyhwYXRoU2VhcmNoZWQpKSB7XHJcbiAgICAgICAgICAgIHNlYXJjaGVkUGF0aHMucHVzaChwYXRoU2VhcmNoZWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogVGFrZSBhIGZpbGVwYXRoIChsaWtlICdwYXJ0aWFscy9teXBhcnRpYWwuZXRhJykuIEF0dGVtcHQgdG8gZmluZCB0aGUgdGVtcGxhdGUgZmlsZSBpbnNpZGUgYHZpZXdzYDtcclxuICAgICAqIHJldHVybiB0aGUgcmVzdWx0aW5nIHRlbXBsYXRlIGZpbGUgcGF0aCwgb3IgYGZhbHNlYCB0byBpbmRpY2F0ZSB0aGF0IHRoZSB0ZW1wbGF0ZSB3YXMgbm90IGZvdW5kLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB2aWV3cyB0aGUgZmlsZXBhdGggdGhhdCBob2xkcyB0ZW1wbGF0ZXMsIG9yIGFuIGFycmF5IG9mIGZpbGVwYXRocyB0aGF0IGhvbGQgdGVtcGxhdGVzXHJcbiAgICAgKiBAcGFyYW0gcGF0aCB0aGUgcGF0aCB0byB0aGUgdGVtcGxhdGVcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gc2VhcmNoVmlld3Modmlld3MsIHBhdGgpIHtcclxuICAgICAgICB2YXIgZmlsZVBhdGg7XHJcbiAgICAgICAgLy8gSWYgdmlld3MgaXMgYW4gYXJyYXksIHRoZW4gbG9vcCB0aHJvdWdoIGVhY2ggZGlyZWN0b3J5XHJcbiAgICAgICAgLy8gQW5kIGF0dGVtcHQgdG8gZmluZCB0aGUgdGVtcGxhdGVcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2aWV3cykgJiZcclxuICAgICAgICAgICAgdmlld3Muc29tZShmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICAgICAgZmlsZVBhdGggPSBnZXRXaG9sZUZpbGVQYXRoKHBhdGgsIHYsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgYWRkUGF0aFRvU2VhcmNoZWQoZmlsZVBhdGgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGV4aXN0c1N5bmMoZmlsZVBhdGgpO1xyXG4gICAgICAgICAgICB9KSkge1xyXG4gICAgICAgICAgICAvLyBJZiB0aGUgYWJvdmUgcmV0dXJuZWQgdHJ1ZSwgd2Uga25vdyB0aGF0IHRoZSBmaWxlUGF0aCB3YXMganVzdCBzZXQgdG8gYSBwYXRoXHJcbiAgICAgICAgICAgIC8vIFRoYXQgZXhpc3RzIChBcnJheS5zb21lKCkgcmV0dXJucyBhcyBzb29uIGFzIGl0IGZpbmRzIGEgdmFsaWQgZWxlbWVudClcclxuICAgICAgICAgICAgcmV0dXJuIGZpbGVQYXRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlb2Ygdmlld3MgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIC8vIFNlYXJjaCBmb3IgdGhlIGZpbGUgaWYgdmlld3MgaXMgYSBzaW5nbGUgZGlyZWN0b3J5XHJcbiAgICAgICAgICAgIGZpbGVQYXRoID0gZ2V0V2hvbGVGaWxlUGF0aChwYXRoLCB2aWV3cywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGFkZFBhdGhUb1NlYXJjaGVkKGZpbGVQYXRoKTtcclxuICAgICAgICAgICAgaWYgKGV4aXN0c1N5bmMoZmlsZVBhdGgpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmlsZVBhdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gVW5hYmxlIHRvIGZpbmQgYSBmaWxlXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgLy8gUGF0aCBzdGFydHMgd2l0aCAnLycsICdDOlxcJywgZXRjLlxyXG4gICAgdmFyIG1hdGNoID0gL15bQS1aYS16XSs6XFxcXHxeXFwvLy5leGVjKHBhdGgpO1xyXG4gICAgLy8gQWJzb2x1dGUgcGF0aCwgbGlrZSAvcGFydGlhbHMvcGFydGlhbC5ldGFcclxuICAgIGlmIChtYXRjaCAmJiBtYXRjaC5sZW5ndGgpIHtcclxuICAgICAgICAvLyBXZSBoYXZlIHRvIHRyaW0gdGhlIGJlZ2lubmluZyAnLycgb2ZmIHRoZSBwYXRoLCBvciBlbHNlXHJcbiAgICAgICAgLy8gcGF0aC5yZXNvbHZlKGRpciwgcGF0aCkgd2lsbCBhbHdheXMgcmVzb2x2ZSB0byBqdXN0IHBhdGhcclxuICAgICAgICB2YXIgZm9ybWF0dGVkUGF0aCA9IHBhdGgucmVwbGFjZSgvXlxcLyovLCAnJyk7XHJcbiAgICAgICAgLy8gRmlyc3QsIHRyeSB0byByZXNvbHZlIHRoZSBwYXRoIHdpdGhpbiBvcHRpb25zLnZpZXdzXHJcbiAgICAgICAgaW5jbHVkZVBhdGggPSBzZWFyY2hWaWV3cyh2aWV3cywgZm9ybWF0dGVkUGF0aCk7XHJcbiAgICAgICAgaWYgKCFpbmNsdWRlUGF0aCkge1xyXG4gICAgICAgICAgICAvLyBJZiB0aGF0IGZhaWxzLCBzZWFyY2hWaWV3cyB3aWxsIHJldHVybiBmYWxzZS4gVHJ5IHRvIGZpbmQgdGhlIHBhdGhcclxuICAgICAgICAgICAgLy8gaW5zaWRlIG9wdGlvbnMucm9vdCAoYnkgZGVmYXVsdCAnLycsIHRoZSBiYXNlIG9mIHRoZSBmaWxlc3lzdGVtKVxyXG4gICAgICAgICAgICB2YXIgcGF0aEZyb21Sb290ID0gZ2V0V2hvbGVGaWxlUGF0aChmb3JtYXR0ZWRQYXRoLCBvcHRpb25zLnJvb3QgfHwgJy8nLCB0cnVlKTtcclxuICAgICAgICAgICAgYWRkUGF0aFRvU2VhcmNoZWQocGF0aEZyb21Sb290KTtcclxuICAgICAgICAgICAgaW5jbHVkZVBhdGggPSBwYXRoRnJvbVJvb3Q7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy8gUmVsYXRpdmUgcGF0aHNcclxuICAgICAgICAvLyBMb29rIHJlbGF0aXZlIHRvIGEgcGFzc2VkIGZpbGVuYW1lIGZpcnN0XHJcbiAgICAgICAgaWYgKG9wdGlvbnMuZmlsZW5hbWUpIHtcclxuICAgICAgICAgICAgdmFyIGZpbGVQYXRoID0gZ2V0V2hvbGVGaWxlUGF0aChwYXRoLCBvcHRpb25zLmZpbGVuYW1lKTtcclxuICAgICAgICAgICAgYWRkUGF0aFRvU2VhcmNoZWQoZmlsZVBhdGgpO1xyXG4gICAgICAgICAgICBpZiAoZXhpc3RzU3luYyhmaWxlUGF0aCkpIHtcclxuICAgICAgICAgICAgICAgIGluY2x1ZGVQYXRoID0gZmlsZVBhdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gVGhlbiBsb29rIGZvciB0aGUgdGVtcGxhdGUgaW4gb3B0aW9ucy52aWV3c1xyXG4gICAgICAgIGlmICghaW5jbHVkZVBhdGgpIHtcclxuICAgICAgICAgICAgaW5jbHVkZVBhdGggPSBzZWFyY2hWaWV3cyh2aWV3cywgcGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghaW5jbHVkZVBhdGgpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXRhRXJyKCdDb3VsZCBub3QgZmluZCB0aGUgdGVtcGxhdGUgXCInICsgcGF0aCArICdcIi4gUGF0aHMgdHJpZWQ6ICcgKyBzZWFyY2hlZFBhdGhzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBJZiBjYWNoaW5nIGFuZCBmaWxlcGF0aENhY2hlIGFyZSBlbmFibGVkLFxyXG4gICAgLy8gY2FjaGUgdGhlIGlucHV0ICYgb3V0cHV0IG9mIHRoaXMgZnVuY3Rpb24uXHJcbiAgICBpZiAob3B0aW9ucy5jYWNoZSAmJiBvcHRpb25zLmZpbGVwYXRoQ2FjaGUpIHtcclxuICAgICAgICBvcHRpb25zLmZpbGVwYXRoQ2FjaGVbcGF0aE9wdGlvbnNdID0gaW5jbHVkZVBhdGg7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaW5jbHVkZVBhdGg7XHJcbn1cclxuLyoqXHJcbiAqIFJlYWRzIGEgZmlsZSBzeW5jaHJvbm91c2x5XHJcbiAqL1xyXG5mdW5jdGlvbiByZWFkRmlsZShmaWxlUGF0aCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gcmVhZEZpbGVTeW5jKGZpbGVQYXRoKS50b1N0cmluZygpLnJlcGxhY2UoX0JPTSwgJycpOyAvLyBUT0RPOiBpcyByZXBsYWNpbmcgQk9NJ3MgbmVjZXNzYXJ5P1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKF9hKSB7XHJcbiAgICAgICAgdGhyb3cgRXRhRXJyKFwiRmFpbGVkIHRvIHJlYWQgdGVtcGxhdGUgYXQgJ1wiICsgZmlsZVBhdGggKyBcIidcIik7XHJcbiAgICB9XHJcbn1cblxuLy8gZXhwcmVzcyBpcyBzZXQgbGlrZTogYXBwLmVuZ2luZSgnaHRtbCcsIHJlcXVpcmUoJ2V0YScpLnJlbmRlckZpbGUpXHJcbi8qIEVORCBUWVBFUyAqL1xyXG4vKipcclxuICogUmVhZHMgYSB0ZW1wbGF0ZSwgY29tcGlsZXMgaXQgaW50byBhIGZ1bmN0aW9uLCBjYWNoZXMgaXQgaWYgY2FjaGluZyBpc24ndCBkaXNhYmxlZCwgcmV0dXJucyB0aGUgZnVuY3Rpb25cclxuICpcclxuICogQHBhcmFtIGZpbGVQYXRoIEFic29sdXRlIHBhdGggdG8gdGVtcGxhdGUgZmlsZVxyXG4gKiBAcGFyYW0gb3B0aW9ucyBFdGEgY29uZmlndXJhdGlvbiBvdmVycmlkZXNcclxuICogQHBhcmFtIG5vQ2FjaGUgT3B0aW9uYWxseSwgbWFrZSBFdGEgbm90IGNhY2hlIHRoZSB0ZW1wbGF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gbG9hZEZpbGUoZmlsZVBhdGgsIG9wdGlvbnMsIG5vQ2FjaGUpIHtcclxuICAgIHZhciBjb25maWcgPSBnZXRDb25maWcob3B0aW9ucyk7XHJcbiAgICB2YXIgdGVtcGxhdGUgPSByZWFkRmlsZShmaWxlUGF0aCk7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHZhciBjb21waWxlZFRlbXBsYXRlID0gY29tcGlsZSh0ZW1wbGF0ZSwgY29uZmlnKTtcclxuICAgICAgICBpZiAoIW5vQ2FjaGUpIHtcclxuICAgICAgICAgICAgY29uZmlnLnRlbXBsYXRlcy5kZWZpbmUoY29uZmlnLmZpbGVuYW1lLCBjb21waWxlZFRlbXBsYXRlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvbXBpbGVkVGVtcGxhdGU7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIHRocm93IEV0YUVycignTG9hZGluZyBmaWxlOiAnICsgZmlsZVBhdGggKyAnIGZhaWxlZDpcXG5cXG4nICsgZS5tZXNzYWdlKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogR2V0IHRoZSB0ZW1wbGF0ZSBmcm9tIGEgc3RyaW5nIG9yIGEgZmlsZSwgZWl0aGVyIGNvbXBpbGVkIG9uLXRoZS1mbHkgb3JcclxuICogcmVhZCBmcm9tIGNhY2hlIChpZiBlbmFibGVkKSwgYW5kIGNhY2hlIHRoZSB0ZW1wbGF0ZSBpZiBuZWVkZWQuXHJcbiAqXHJcbiAqIElmIGBvcHRpb25zLmNhY2hlYCBpcyB0cnVlLCB0aGlzIGZ1bmN0aW9uIHJlYWRzIHRoZSBmaWxlIGZyb21cclxuICogYG9wdGlvbnMuZmlsZW5hbWVgIHNvIGl0IG11c3QgYmUgc2V0IHByaW9yIHRvIGNhbGxpbmcgdGhpcyBmdW5jdGlvbi5cclxuICpcclxuICogQHBhcmFtIG9wdGlvbnMgICBjb21waWxhdGlvbiBvcHRpb25zXHJcbiAqIEByZXR1cm4gRXRhIHRlbXBsYXRlIGZ1bmN0aW9uXHJcbiAqL1xyXG5mdW5jdGlvbiBoYW5kbGVDYWNoZSQxKG9wdGlvbnMpIHtcclxuICAgIHZhciBmaWxlbmFtZSA9IG9wdGlvbnMuZmlsZW5hbWU7XHJcbiAgICBpZiAob3B0aW9ucy5jYWNoZSkge1xyXG4gICAgICAgIHZhciBmdW5jID0gb3B0aW9ucy50ZW1wbGF0ZXMuZ2V0KGZpbGVuYW1lKTtcclxuICAgICAgICBpZiAoZnVuYykge1xyXG4gICAgICAgICAgICByZXR1cm4gZnVuYztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxvYWRGaWxlKGZpbGVuYW1lLCBvcHRpb25zKTtcclxuICAgIH1cclxuICAgIC8vIENhY2hpbmcgaXMgZGlzYWJsZWQsIHNvIHBhc3Mgbm9DYWNoZSA9IHRydWVcclxuICAgIHJldHVybiBsb2FkRmlsZShmaWxlbmFtZSwgb3B0aW9ucywgdHJ1ZSk7XHJcbn1cclxuLyoqXHJcbiAqIFRyeSBjYWxsaW5nIGhhbmRsZUNhY2hlIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMgYW5kIGRhdGEgYW5kIGNhbGwgdGhlXHJcbiAqIGNhbGxiYWNrIHdpdGggdGhlIHJlc3VsdC4gSWYgYW4gZXJyb3Igb2NjdXJzLCBjYWxsIHRoZSBjYWxsYmFjayB3aXRoXHJcbiAqIHRoZSBlcnJvci4gVXNlZCBieSByZW5kZXJGaWxlKCkuXHJcbiAqXHJcbiAqIEBwYXJhbSBkYXRhIHRlbXBsYXRlIGRhdGFcclxuICogQHBhcmFtIG9wdGlvbnMgY29tcGlsYXRpb24gb3B0aW9uc1xyXG4gKiBAcGFyYW0gY2IgY2FsbGJhY2tcclxuICovXHJcbmZ1bmN0aW9uIHRyeUhhbmRsZUNhY2hlKGRhdGEsIG9wdGlvbnMsIGNiKSB7XHJcbiAgICBpZiAoY2IpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAvLyBOb3RlOiBpZiB0aGVyZSBpcyBhbiBlcnJvciB3aGlsZSByZW5kZXJpbmcgdGhlIHRlbXBsYXRlLFxyXG4gICAgICAgICAgICAvLyBJdCB3aWxsIGJ1YmJsZSB1cCBhbmQgYmUgY2F1Z2h0IGhlcmVcclxuICAgICAgICAgICAgdmFyIHRlbXBsYXRlRm4gPSBoYW5kbGVDYWNoZSQxKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZUZuKGRhdGEsIG9wdGlvbnMsIGNiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICAvLyBObyBjYWxsYmFjaywgdHJ5IHJldHVybmluZyBhIHByb21pc2VcclxuICAgICAgICBpZiAodHlwZW9mIHByb21pc2VJbXBsID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgcHJvbWlzZUltcGwoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcGxhdGVGbiA9IGhhbmRsZUNhY2hlJDEob3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRlbXBsYXRlRm4oZGF0YSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IEV0YUVycihcIlBsZWFzZSBwcm92aWRlIGEgY2FsbGJhY2sgZnVuY3Rpb24sIHRoaXMgZW52IGRvZXNuJ3Qgc3VwcG9ydCBQcm9taXNlc1wiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIEdldCB0aGUgdGVtcGxhdGUgZnVuY3Rpb24uXHJcbiAqXHJcbiAqIElmIGBvcHRpb25zLmNhY2hlYCBpcyBgdHJ1ZWAsIHRoZW4gdGhlIHRlbXBsYXRlIGlzIGNhY2hlZC5cclxuICpcclxuICogVGhpcyByZXR1cm5zIGEgdGVtcGxhdGUgZnVuY3Rpb24gYW5kIHRoZSBjb25maWcgb2JqZWN0IHdpdGggd2hpY2ggdGhhdCB0ZW1wbGF0ZSBmdW5jdGlvbiBzaG91bGQgYmUgY2FsbGVkLlxyXG4gKlxyXG4gKiBAcmVtYXJrc1xyXG4gKlxyXG4gKiBJdCdzIGltcG9ydGFudCB0aGF0IHRoaXMgcmV0dXJucyBhIGNvbmZpZyBvYmplY3Qgd2l0aCBgZmlsZW5hbWVgIHNldC5cclxuICogT3RoZXJ3aXNlLCB0aGUgaW5jbHVkZWQgZmlsZSB3b3VsZCBub3QgYmUgYWJsZSB0byB1c2UgcmVsYXRpdmUgcGF0aHNcclxuICpcclxuICogQHBhcmFtIHBhdGggcGF0aCBmb3IgdGhlIHNwZWNpZmllZCBmaWxlIChpZiByZWxhdGl2ZSwgc3BlY2lmeSBgdmlld3NgIG9uIGBvcHRpb25zYClcclxuICogQHBhcmFtIG9wdGlvbnMgY29tcGlsYXRpb24gb3B0aW9uc1xyXG4gKiBAcmV0dXJuIFtFdGEgdGVtcGxhdGUgZnVuY3Rpb24sIG5ldyBjb25maWcgb2JqZWN0XVxyXG4gKi9cclxuZnVuY3Rpb24gaW5jbHVkZUZpbGUocGF0aCwgb3B0aW9ucykge1xyXG4gICAgLy8gdGhlIGJlbG93IGNyZWF0ZXMgYSBuZXcgb3B0aW9ucyBvYmplY3QsIHVzaW5nIHRoZSBwYXJlbnQgZmlsZXBhdGggb2YgdGhlIG9sZCBvcHRpb25zIG9iamVjdCBhbmQgdGhlIHBhdGhcclxuICAgIHZhciBuZXdGaWxlT3B0aW9ucyA9IGdldENvbmZpZyh7IGZpbGVuYW1lOiBnZXRQYXRoKHBhdGgsIG9wdGlvbnMpIH0sIG9wdGlvbnMpO1xyXG4gICAgLy8gVE9ETzogbWFrZSBzdXJlIHByb3BlcnRpZXMgYXJlIGN1cnJlY3RseSBjb3BpZWQgb3ZlclxyXG4gICAgcmV0dXJuIFtoYW5kbGVDYWNoZSQxKG5ld0ZpbGVPcHRpb25zKSwgbmV3RmlsZU9wdGlvbnNdO1xyXG59XHJcbmZ1bmN0aW9uIHJlbmRlckZpbGUoZmlsZW5hbWUsIGRhdGEsIGNvbmZpZywgY2IpIHtcclxuICAgIC8qXHJcbiAgICBIZXJlIHdlIGhhdmUgc29tZSBmdW5jdGlvbiBvdmVybG9hZGluZy5cclxuICAgIEVzc2VudGlhbGx5LCB0aGUgZmlyc3QgMiBhcmd1bWVudHMgdG8gcmVuZGVyRmlsZSBzaG91bGQgYWx3YXlzIGJlIHRoZSBmaWxlbmFtZSBhbmQgZGF0YVxyXG4gICAgSG93ZXZlciwgd2l0aCBFeHByZXNzLCBjb25maWd1cmF0aW9uIG9wdGlvbnMgd2lsbCBiZSBwYXNzZWQgYWxvbmcgd2l0aCB0aGUgZGF0YS5cclxuICAgIFRodXMsIEV4cHJlc3Mgd2lsbCBjYWxsIHJlbmRlckZpbGUgd2l0aCAoZmlsZW5hbWUsIGRhdGFBbmRPcHRpb25zLCBjYilcclxuICAgIEFuZCB3ZSB3YW50IHRvIGFsc28gbWFrZSAoZmlsZW5hbWUsIGRhdGEsIG9wdGlvbnMsIGNiKSBhdmFpbGFibGVcclxuICAgICovXHJcbiAgICB2YXIgcmVuZGVyQ29uZmlnO1xyXG4gICAgdmFyIGNhbGxiYWNrO1xyXG4gICAgZGF0YSA9IGRhdGEgfHwge307IC8vIElmIGRhdGEgaXMgdW5kZWZpbmVkLCB3ZSBkb24ndCB3YW50IGFjY2Vzc2luZyBkYXRhLnNldHRpbmdzIHRvIGVycm9yXHJcbiAgICAvLyBGaXJzdCwgYXNzaWduIG91ciBjYWxsYmFjayBmdW5jdGlvbiB0byBgY2FsbGJhY2tgXHJcbiAgICAvLyBXZSBjYW4gbGVhdmUgaXQgdW5kZWZpbmVkIGlmIG5laXRoZXIgcGFyYW1ldGVyIGlzIGEgZnVuY3Rpb247XHJcbiAgICAvLyBDYWxsYmFja3MgYXJlIG9wdGlvbmFsXHJcbiAgICBpZiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgLy8gVGhlIDR0aCBhcmd1bWVudCBpcyB0aGUgY2FsbGJhY2tcclxuICAgICAgICBjYWxsYmFjayA9IGNiO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIC8vIFRoZSAzcmQgYXJnIGlzIHRoZSBjYWxsYmFja1xyXG4gICAgICAgIGNhbGxiYWNrID0gY29uZmlnO1xyXG4gICAgfVxyXG4gICAgLy8gSWYgdGhlcmUgaXMgYSBjb25maWcgb2JqZWN0IHBhc3NlZCBpbiBleHBsaWNpdGx5LCB1c2UgaXRcclxuICAgIGlmICh0eXBlb2YgY29uZmlnID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIHJlbmRlckNvbmZpZyA9IGdldENvbmZpZyhjb25maWcgfHwge30pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBnZXQgdGhlIGNvbmZpZyBmcm9tIHRoZSBkYXRhIG9iamVjdFxyXG4gICAgICAgIC8vIEFuZCB0aGVuIGdyYWIgc29tZSBjb25maWcgb3B0aW9ucyBmcm9tIGRhdGEuc2V0dGluZ3NcclxuICAgICAgICAvLyBXaGljaCBpcyB3aGVyZSBFeHByZXNzIHNvbWV0aW1lcyBzdG9yZXMgdGhlbVxyXG4gICAgICAgIHJlbmRlckNvbmZpZyA9IGdldENvbmZpZyhkYXRhKTtcclxuICAgICAgICBpZiAoZGF0YS5zZXR0aW5ncykge1xyXG4gICAgICAgICAgICAvLyBQdWxsIGEgZmV3IHRoaW5ncyBmcm9tIGtub3duIGxvY2F0aW9uc1xyXG4gICAgICAgICAgICBpZiAoZGF0YS5zZXR0aW5ncy52aWV3cykge1xyXG4gICAgICAgICAgICAgICAgcmVuZGVyQ29uZmlnLnZpZXdzID0gZGF0YS5zZXR0aW5ncy52aWV3cztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZGF0YS5zZXR0aW5nc1sndmlldyBjYWNoZSddKSB7XHJcbiAgICAgICAgICAgICAgICByZW5kZXJDb25maWcuY2FjaGUgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIFVuZG9jdW1lbnRlZCBhZnRlciBFeHByZXNzIDIsIGJ1dCBzdGlsbCB1c2FibGUsIGVzcC4gZm9yXHJcbiAgICAgICAgICAgIC8vIGl0ZW1zIHRoYXQgYXJlIHVuc2FmZSB0byBiZSBwYXNzZWQgYWxvbmcgd2l0aCBkYXRhLCBsaWtlIGByb290YFxyXG4gICAgICAgICAgICB2YXIgdmlld09wdHMgPSBkYXRhLnNldHRpbmdzWyd2aWV3IG9wdGlvbnMnXTtcclxuICAgICAgICAgICAgaWYgKHZpZXdPcHRzKSB7XHJcbiAgICAgICAgICAgICAgICBjb3B5UHJvcHMocmVuZGVyQ29uZmlnLCB2aWV3T3B0cyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBTZXQgdGhlIGZpbGVuYW1lIG9wdGlvbiBvbiB0aGUgdGVtcGxhdGVcclxuICAgIC8vIFRoaXMgd2lsbCBmaXJzdCB0cnkgdG8gcmVzb2x2ZSB0aGUgZmlsZSBwYXRoIChzZWUgZ2V0UGF0aCBmb3IgZGV0YWlscylcclxuICAgIHJlbmRlckNvbmZpZy5maWxlbmFtZSA9IGdldFBhdGgoZmlsZW5hbWUsIHJlbmRlckNvbmZpZyk7XHJcbiAgICByZXR1cm4gdHJ5SGFuZGxlQ2FjaGUoZGF0YSwgcmVuZGVyQ29uZmlnLCBjYWxsYmFjayk7XHJcbn1cclxuZnVuY3Rpb24gcmVuZGVyRmlsZUFzeW5jKGZpbGVuYW1lLCBkYXRhLCBjb25maWcsIGNiKSB7XHJcbiAgICByZXR1cm4gcmVuZGVyRmlsZShmaWxlbmFtZSwgdHlwZW9mIGNvbmZpZyA9PT0gJ2Z1bmN0aW9uJyA/IF9fYXNzaWduKF9fYXNzaWduKHt9LCBkYXRhKSwgeyBhc3luYzogdHJ1ZSB9KSA6IGRhdGEsIHR5cGVvZiBjb25maWcgPT09ICdvYmplY3QnID8gX19hc3NpZ24oX19hc3NpZ24oe30sIGNvbmZpZyksIHsgYXN5bmM6IHRydWUgfSkgOiBjb25maWcsIGNiKTtcclxufVxuXG4vKiBFTkQgVFlQRVMgKi9cclxuLyoqXHJcbiAqIENhbGxlZCB3aXRoIGBpbmNsdWRlRmlsZShwYXRoLCBkYXRhKWBcclxuICovXHJcbmZ1bmN0aW9uIGluY2x1ZGVGaWxlSGVscGVyKHBhdGgsIGRhdGEpIHtcclxuICAgIHZhciB0ZW1wbGF0ZUFuZENvbmZpZyA9IGluY2x1ZGVGaWxlKHBhdGgsIHRoaXMpO1xyXG4gICAgcmV0dXJuIHRlbXBsYXRlQW5kQ29uZmlnWzBdKGRhdGEsIHRlbXBsYXRlQW5kQ29uZmlnWzFdKTtcclxufVxuXG4vKiBFTkQgVFlQRVMgKi9cclxuZnVuY3Rpb24gaGFuZGxlQ2FjaGUodGVtcGxhdGUsIG9wdGlvbnMpIHtcclxuICAgIGlmIChvcHRpb25zLmNhY2hlICYmIG9wdGlvbnMubmFtZSAmJiBvcHRpb25zLnRlbXBsYXRlcy5nZXQob3B0aW9ucy5uYW1lKSkge1xyXG4gICAgICAgIHJldHVybiBvcHRpb25zLnRlbXBsYXRlcy5nZXQob3B0aW9ucy5uYW1lKTtcclxuICAgIH1cclxuICAgIHZhciB0ZW1wbGF0ZUZ1bmMgPSB0eXBlb2YgdGVtcGxhdGUgPT09ICdmdW5jdGlvbicgPyB0ZW1wbGF0ZSA6IGNvbXBpbGUodGVtcGxhdGUsIG9wdGlvbnMpO1xyXG4gICAgLy8gTm90ZSB0aGF0IHdlIGRvbid0IGhhdmUgdG8gY2hlY2sgaWYgaXQgYWxyZWFkeSBleGlzdHMgaW4gdGhlIGNhY2hlO1xyXG4gICAgLy8gaXQgd291bGQgaGF2ZSByZXR1cm5lZCBlYXJsaWVyIGlmIGl0IGhhZFxyXG4gICAgaWYgKG9wdGlvbnMuY2FjaGUgJiYgb3B0aW9ucy5uYW1lKSB7XHJcbiAgICAgICAgb3B0aW9ucy50ZW1wbGF0ZXMuZGVmaW5lKG9wdGlvbnMubmFtZSwgdGVtcGxhdGVGdW5jKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0ZW1wbGF0ZUZ1bmM7XHJcbn1cclxuLyoqXHJcbiAqIFJlbmRlciBhIHRlbXBsYXRlXHJcbiAqXHJcbiAqIElmIGB0ZW1wbGF0ZWAgaXMgYSBzdHJpbmcsIEV0YSB3aWxsIGNvbXBpbGUgaXQgdG8gYSBmdW5jdGlvbiBhbmQgdGhlbiBjYWxsIGl0IHdpdGggdGhlIHByb3ZpZGVkIGRhdGEuXHJcbiAqIElmIGB0ZW1wbGF0ZWAgaXMgYSB0ZW1wbGF0ZSBmdW5jdGlvbiwgRXRhIHdpbGwgY2FsbCBpdCB3aXRoIHRoZSBwcm92aWRlZCBkYXRhLlxyXG4gKlxyXG4gKiBJZiBgY29uZmlnLmFzeW5jYCBpcyBgZmFsc2VgLCBFdGEgd2lsbCByZXR1cm4gdGhlIHJlbmRlcmVkIHRlbXBsYXRlLlxyXG4gKlxyXG4gKiBJZiBgY29uZmlnLmFzeW5jYCBpcyBgdHJ1ZWAgYW5kIHRoZXJlJ3MgYSBjYWxsYmFjayBmdW5jdGlvbiwgRXRhIHdpbGwgY2FsbCB0aGUgY2FsbGJhY2sgd2l0aCBgKGVyciwgcmVuZGVyZWRUZW1wbGF0ZSlgLlxyXG4gKiBJZiBgY29uZmlnLmFzeW5jYCBpcyBgdHJ1ZWAgYW5kIHRoZXJlJ3Mgbm90IGEgY2FsbGJhY2sgZnVuY3Rpb24sIEV0YSB3aWxsIHJldHVybiBhIFByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0aGUgcmVuZGVyZWQgdGVtcGxhdGUuXHJcbiAqXHJcbiAqIElmIGBjb25maWcuY2FjaGVgIGlzIGB0cnVlYCBhbmQgYGNvbmZpZ2AgaGFzIGEgYG5hbWVgIG9yIGBmaWxlbmFtZWAgcHJvcGVydHksIEV0YSB3aWxsIGNhY2hlIHRoZSB0ZW1wbGF0ZSBvbiB0aGUgZmlyc3QgcmVuZGVyIGFuZCB1c2UgdGhlIGNhY2hlZCB0ZW1wbGF0ZSBmb3IgYWxsIHN1YnNlcXVlbnQgcmVuZGVycy5cclxuICpcclxuICogQHBhcmFtIHRlbXBsYXRlIFRlbXBsYXRlIHN0cmluZyBvciB0ZW1wbGF0ZSBmdW5jdGlvblxyXG4gKiBAcGFyYW0gZGF0YSBEYXRhIHRvIHJlbmRlciB0aGUgdGVtcGxhdGUgd2l0aFxyXG4gKiBAcGFyYW0gY29uZmlnIE9wdGlvbmFsIGNvbmZpZyBvcHRpb25zXHJcbiAqIEBwYXJhbSBjYiBDYWxsYmFjayBmdW5jdGlvblxyXG4gKi9cclxuZnVuY3Rpb24gcmVuZGVyKHRlbXBsYXRlLCBkYXRhLCBjb25maWcsIGNiKSB7XHJcbiAgICB2YXIgb3B0aW9ucyA9IGdldENvbmZpZyhjb25maWcgfHwge30pO1xyXG4gICAgaWYgKG9wdGlvbnMuYXN5bmMpIHtcclxuICAgICAgICBpZiAoY2IpIHtcclxuICAgICAgICAgICAgLy8gSWYgdXNlciBwYXNzZXMgY2FsbGJhY2tcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIC8vIE5vdGU6IGlmIHRoZXJlIGlzIGFuIGVycm9yIHdoaWxlIHJlbmRlcmluZyB0aGUgdGVtcGxhdGUsXHJcbiAgICAgICAgICAgICAgICAvLyBJdCB3aWxsIGJ1YmJsZSB1cCBhbmQgYmUgY2F1Z2h0IGhlcmVcclxuICAgICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZUZuID0gaGFuZGxlQ2FjaGUodGVtcGxhdGUsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVGbihkYXRhLCBvcHRpb25zLCBjYik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIE5vIGNhbGxiYWNrLCB0cnkgcmV0dXJuaW5nIGEgcHJvbWlzZVxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHByb21pc2VJbXBsID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHByb21pc2VJbXBsKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGhhbmRsZUNhY2hlKHRlbXBsYXRlLCBvcHRpb25zKShkYXRhLCBvcHRpb25zKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFdGFFcnIoXCJQbGVhc2UgcHJvdmlkZSBhIGNhbGxiYWNrIGZ1bmN0aW9uLCB0aGlzIGVudiBkb2Vzbid0IHN1cHBvcnQgUHJvbWlzZXNcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gaGFuZGxlQ2FjaGUodGVtcGxhdGUsIG9wdGlvbnMpKGRhdGEsIG9wdGlvbnMpO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBSZW5kZXIgYSB0ZW1wbGF0ZSBhc3luY2hyb25vdXNseVxyXG4gKlxyXG4gKiBJZiBgdGVtcGxhdGVgIGlzIGEgc3RyaW5nLCBFdGEgd2lsbCBjb21waWxlIGl0IHRvIGEgZnVuY3Rpb24gYW5kIGNhbGwgaXQgd2l0aCB0aGUgcHJvdmlkZWQgZGF0YS5cclxuICogSWYgYHRlbXBsYXRlYCBpcyBhIGZ1bmN0aW9uLCBFdGEgd2lsbCBjYWxsIGl0IHdpdGggdGhlIHByb3ZpZGVkIGRhdGEuXHJcbiAqXHJcbiAqIElmIHRoZXJlIGlzIGEgY2FsbGJhY2sgZnVuY3Rpb24sIEV0YSB3aWxsIGNhbGwgaXQgd2l0aCBgKGVyciwgcmVuZGVyZWRUZW1wbGF0ZSlgLlxyXG4gKiBJZiB0aGVyZSBpcyBub3QgYSBjYWxsYmFjayBmdW5jdGlvbiwgRXRhIHdpbGwgcmV0dXJuIGEgUHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRoZSByZW5kZXJlZCB0ZW1wbGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0gdGVtcGxhdGUgVGVtcGxhdGUgc3RyaW5nIG9yIHRlbXBsYXRlIGZ1bmN0aW9uXHJcbiAqIEBwYXJhbSBkYXRhIERhdGEgdG8gcmVuZGVyIHRoZSB0ZW1wbGF0ZSB3aXRoXHJcbiAqIEBwYXJhbSBjb25maWcgT3B0aW9uYWwgY29uZmlnIG9wdGlvbnNcclxuICogQHBhcmFtIGNiIENhbGxiYWNrIGZ1bmN0aW9uXHJcbiAqL1xyXG5mdW5jdGlvbiByZW5kZXJBc3luYyh0ZW1wbGF0ZSwgZGF0YSwgY29uZmlnLCBjYikge1xyXG4gICAgLy8gVXNpbmcgT2JqZWN0LmFzc2lnbiB0byBsb3dlciBidW5kbGUgc2l6ZSwgdXNpbmcgc3ByZWFkIG9wZXJhdG9yIG1ha2VzIGl0IGxhcmdlciBiZWNhdXNlIG9mIHR5cGVzY3JpcHQgaW5qZWN0ZWQgcG9seWZpbGxzXHJcbiAgICByZXR1cm4gcmVuZGVyKHRlbXBsYXRlLCBkYXRhLCBPYmplY3QuYXNzaWduKHt9LCBjb25maWcsIHsgYXN5bmM6IHRydWUgfSksIGNiKTtcclxufVxuXG4vLyBAZGVub2lmeS1pZ25vcmVcclxuY29uZmlnLmluY2x1ZGVGaWxlID0gaW5jbHVkZUZpbGVIZWxwZXI7XHJcbmNvbmZpZy5maWxlcGF0aENhY2hlID0ge307XG5cbmV4cG9ydCB7IHJlbmRlckZpbGUgYXMgX19leHByZXNzLCBjb21waWxlLCBjb21waWxlVG9TdHJpbmcsIGNvbmZpZywgY29uZmlndXJlLCBjb25maWcgYXMgZGVmYXVsdENvbmZpZywgZ2V0Q29uZmlnLCBsb2FkRmlsZSwgcGFyc2UsIHJlbmRlciwgcmVuZGVyQXN5bmMsIHJlbmRlckZpbGUsIHJlbmRlckZpbGVBc3luYywgdGVtcGxhdGVzIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ldGEuZXMuanMubWFwXG4iLCJpbXBvcnQgKiBhcyBFdGEgZnJvbSBcImV0YVwiO1xuXG5leHBvcnQgY2xhc3MgUGFyc2VyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgICBhc3luYyBwYXJzZV9jb21tYW5kcyhjb250ZW50OiBzdHJpbmcsIG9iamVjdDogYW55KTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgY29udGVudCA9IGF3YWl0IEV0YS5yZW5kZXJBc3luYyhjb250ZW50LCBvYmplY3QsIHtcbiAgICAgICAgICAgIHZhck5hbWU6IFwidHBcIixcbiAgICAgICAgICAgIHBhcnNlOiB7XG4gICAgICAgICAgICAgICAgZXhlYzogXCIqXCIsXG4gICAgICAgICAgICAgICAgaW50ZXJwb2xhdGU6IFwiflwiLFxuICAgICAgICAgICAgICAgIHJhdzogXCJcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhdXRvVHJpbTogZmFsc2UsXG4gICAgICAgICAgICBnbG9iYWxBd2FpdDogdHJ1ZSxcbiAgICAgICAgfSkgYXMgc3RyaW5nO1xuXG4gICAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEFwcCwgbm9ybWFsaXplUGF0aCwgTWFya2Rvd25Qb3N0UHJvY2Vzc29yQ29udGV4dCwgTWFya2Rvd25WaWV3LCBUQWJzdHJhY3RGaWxlLCBURmlsZSwgVEZvbGRlciB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5pbXBvcnQgeyByZXNvbHZlX3RmaWxlLCBkZWxheSB9IGZyb20gJ1V0aWxzJztcbmltcG9ydCBUZW1wbGF0ZXJQbHVnaW4gZnJvbSBcIm1haW5cIjtcbmltcG9ydCB7IEZ1bmN0aW9uc01vZGUsIEZ1bmN0aW9uc0dlbmVyYXRvciB9IGZyb20gXCJmdW5jdGlvbnMvRnVuY3Rpb25zR2VuZXJhdG9yXCI7XG5pbXBvcnQgeyBlcnJvcldyYXBwZXIsIGVycm9yV3JhcHBlclN5bmMsIFRlbXBsYXRlckVycm9yIH0gZnJvbSBcIkVycm9yXCI7XG5pbXBvcnQgeyBFZGl0b3IgfSBmcm9tICdlZGl0b3IvRWRpdG9yJztcbmltcG9ydCB7IFBhcnNlciB9IGZyb20gJ3BhcnNlci9QYXJzZXInO1xuaW1wb3J0IHsgbG9nX2Vycm9yIH0gZnJvbSAnTG9nJztcblxuZXhwb3J0IGVudW0gUnVuTW9kZSB7XG4gICAgQ3JlYXRlTmV3RnJvbVRlbXBsYXRlLFxuICAgIEFwcGVuZEFjdGl2ZUZpbGUsXG4gICAgT3ZlcndyaXRlRmlsZSxcbiAgICBPdmVyd3JpdGVBY3RpdmVGaWxlLFxuICAgIER5bmFtaWNQcm9jZXNzb3IsXG4gICAgU3RhcnR1cFRlbXBsYXRlLFxufTtcblxuZXhwb3J0IGludGVyZmFjZSBSdW5uaW5nQ29uZmlnIHtcbiAgICB0ZW1wbGF0ZV9maWxlOiBURmlsZSxcbiAgICB0YXJnZXRfZmlsZTogVEZpbGUsXG4gICAgcnVuX21vZGU6IFJ1bk1vZGUsXG4gICAgYWN0aXZlX2ZpbGU/OiBURmlsZSxcbn07XG5cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZXIge1xuICAgIHB1YmxpYyBwYXJzZXI6IFBhcnNlcjtcbiAgICBwdWJsaWMgZnVuY3Rpb25zX2dlbmVyYXRvcjogRnVuY3Rpb25zR2VuZXJhdG9yO1xuXHRwdWJsaWMgZWRpdG9yOiBFZGl0b3I7XG4gICAgcHVibGljIGN1cnJlbnRfZnVuY3Rpb25zX29iamVjdDoge307XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFwcDogQXBwLCBwcml2YXRlIHBsdWdpbjogVGVtcGxhdGVyUGx1Z2luKSB7XG5cdFx0dGhpcy5mdW5jdGlvbnNfZ2VuZXJhdG9yID0gbmV3IEZ1bmN0aW9uc0dlbmVyYXRvcih0aGlzLmFwcCwgdGhpcy5wbHVnaW4pO1xuXHRcdHRoaXMuZWRpdG9yID0gbmV3IEVkaXRvcih0aGlzLmFwcCwgdGhpcy5wbHVnaW4pO1xuICAgICAgICB0aGlzLnBhcnNlciA9IG5ldyBQYXJzZXIoKTtcbiAgICB9XG5cbiAgICBhc3luYyBzZXR1cCgpIHtcblx0XHRhd2FpdCB0aGlzLmVkaXRvci5zZXR1cCgpO1xuICAgICAgICBhd2FpdCB0aGlzLmZ1bmN0aW9uc19nZW5lcmF0b3IuaW5pdCgpO1xuXHRcdHRoaXMucGx1Z2luLnJlZ2lzdGVyTWFya2Rvd25Qb3N0UHJvY2Vzc29yKChlbCwgY3R4KSA9PiB0aGlzLnByb2Nlc3NfZHluYW1pY190ZW1wbGF0ZXMoZWwsIGN0eCkpO1xuICAgIH1cblxuICAgIGNyZWF0ZV9ydW5uaW5nX2NvbmZpZyh0ZW1wbGF0ZV9maWxlOiBURmlsZSwgdGFyZ2V0X2ZpbGU6IFRGaWxlLCBydW5fbW9kZTogUnVuTW9kZSkge1xuICAgICAgIGNvbnN0IGFjdGl2ZV9maWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdGVtcGxhdGVfZmlsZTogdGVtcGxhdGVfZmlsZSxcbiAgICAgICAgICAgIHRhcmdldF9maWxlOiB0YXJnZXRfZmlsZSxcbiAgICAgICAgICAgIHJ1bl9tb2RlOiBydW5fbW9kZSxcbiAgICAgICAgICAgIGFjdGl2ZV9maWxlOiBhY3RpdmVfZmlsZSxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBhc3luYyByZWFkX2FuZF9wYXJzZV90ZW1wbGF0ZShjb25maWc6IFJ1bm5pbmdDb25maWcpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICBjb25zdCB0ZW1wbGF0ZV9jb250ZW50ID0gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZChjb25maWcudGVtcGxhdGVfZmlsZSk7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlX3RlbXBsYXRlKGNvbmZpZywgdGVtcGxhdGVfY29udGVudCk7XG4gICAgfVxuXG4gICAgYXN5bmMgcGFyc2VfdGVtcGxhdGUoY29uZmlnOiBSdW5uaW5nQ29uZmlnLCB0ZW1wbGF0ZV9jb250ZW50OiBzdHJpbmcpOiBQcm9taXNlIDxzdHJpbmc+IHtcbiAgICAgICAgY29uc3QgZnVuY3Rpb25zX29iamVjdCA9IGF3YWl0IHRoaXMuZnVuY3Rpb25zX2dlbmVyYXRvci5nZW5lcmF0ZV9vYmplY3QoY29uZmlnLCBGdW5jdGlvbnNNb2RlLlVTRVJfSU5URVJOQUwpO1xuICAgICAgICB0aGlzLmN1cnJlbnRfZnVuY3Rpb25zX29iamVjdCA9IGZ1bmN0aW9uc19vYmplY3Q7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCB0aGlzLnBhcnNlci5wYXJzZV9jb21tYW5kcyh0ZW1wbGF0ZV9jb250ZW50LCBmdW5jdGlvbnNfb2JqZWN0KTtcbiAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfVxuXG4gICAgYXN5bmMgY3JlYXRlX25ld19ub3RlX2Zyb21fdGVtcGxhdGUodGVtcGxhdGU6IFRGaWxlIHwgc3RyaW5nLCBmb2xkZXI/OiBURm9sZGVyLCBmaWxlbmFtZT86IHN0cmluZywgb3Blbl9uZXdfbm90ZTogYm9vbGVhbiA9IHRydWUpOiBQcm9taXNlPFRGaWxlPiB7XG5cbiAgICAgICAgLy8gVE9ETzogTWF5YmUgdGhlcmUgaXMgYW4gb2JzaWRpYW4gQVBJIGZ1bmN0aW9uIGZvciB0aGF0XG4gICAgICAgIGlmICghZm9sZGVyKSB7XG4gICAgICAgICAgICAvLyBUT0RPOiBGaXggdGhhdFxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgY29uc3QgbmV3X2ZpbGVfbG9jYXRpb24gPSB0aGlzLmFwcC52YXVsdC5nZXRDb25maWcoXCJuZXdGaWxlTG9jYXRpb25cIik7XG4gICAgICAgICAgICBzd2l0Y2ggKG5ld19maWxlX2xvY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcImN1cnJlbnRcIjpcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWN0aXZlX2ZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlX2ZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbGRlciA9IGFjdGl2ZV9maWxlLnBhcmVudDsgXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcImZvbGRlclwiOlxuICAgICAgICAgICAgICAgICAgICBmb2xkZXIgPSB0aGlzLmFwcC5maWxlTWFuYWdlci5nZXROZXdGaWxlUGFyZW50KFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwicm9vdFwiOlxuICAgICAgICAgICAgICAgICAgICBmb2xkZXIgPSB0aGlzLmFwcC52YXVsdC5nZXRSb290KCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gVE9ETzogQ2hhbmdlIHRoYXQsIG5vdCBzdGFibGUgYXRtXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgY29uc3QgY3JlYXRlZF9ub3RlID0gYXdhaXQgdGhpcy5hcHAuZmlsZU1hbmFnZXIuY3JlYXRlTmV3TWFya2Rvd25GaWxlKGZvbGRlciwgZmlsZW5hbWUgPz8gXCJVbnRpdGxlZFwiKTtcblxuICAgICAgICBsZXQgcnVubmluZ19jb25maWc6IFJ1bm5pbmdDb25maWc7XG4gICAgICAgIGxldCBvdXRwdXRfY29udGVudDogc3RyaW5nO1xuICAgICAgICBpZiAodGVtcGxhdGUgaW5zdGFuY2VvZiBURmlsZSkge1xuICAgICAgICAgICAgcnVubmluZ19jb25maWcgPSB0aGlzLmNyZWF0ZV9ydW5uaW5nX2NvbmZpZyh0ZW1wbGF0ZSwgY3JlYXRlZF9ub3RlLCBSdW5Nb2RlLkNyZWF0ZU5ld0Zyb21UZW1wbGF0ZSk7XG4gICAgICAgICAgICBvdXRwdXRfY29udGVudCA9IGF3YWl0IGVycm9yV3JhcHBlcihhc3luYyAoKSA9PiB0aGlzLnJlYWRfYW5kX3BhcnNlX3RlbXBsYXRlKHJ1bm5pbmdfY29uZmlnKSwgXCJUZW1wbGF0ZSBwYXJzaW5nIGVycm9yLCBhYm9ydGluZy5cIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBydW5uaW5nX2NvbmZpZyA9IHRoaXMuY3JlYXRlX3J1bm5pbmdfY29uZmlnKHVuZGVmaW5lZCwgY3JlYXRlZF9ub3RlLCBSdW5Nb2RlLkNyZWF0ZU5ld0Zyb21UZW1wbGF0ZSk7XG4gICAgICAgICAgICBvdXRwdXRfY29udGVudCA9IGF3YWl0IGVycm9yV3JhcHBlcihhc3luYyAoKSA9PiB0aGlzLnBhcnNlX3RlbXBsYXRlKHJ1bm5pbmdfY29uZmlnLCB0ZW1wbGF0ZSksIFwiVGVtcGxhdGUgcGFyc2luZyBlcnJvciwgYWJvcnRpbmcuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG91dHB1dF9jb250ZW50ID09IG51bGwpIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0LmRlbGV0ZShjcmVhdGVkX25vdGUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQubW9kaWZ5KGNyZWF0ZWRfbm90ZSwgb3V0cHV0X2NvbnRlbnQpO1xuXG4gICAgICAgIGlmIChvcGVuX25ld19ub3RlKSB7XG4gICAgICAgICAgICBjb25zdCBhY3RpdmVfbGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmO1xuICAgICAgICAgICAgaWYgKCFhY3RpdmVfbGVhZikge1xuICAgICAgICAgICAgICAgIGxvZ19lcnJvcihuZXcgVGVtcGxhdGVyRXJyb3IoXCJObyBhY3RpdmUgbGVhZlwiKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXdhaXQgYWN0aXZlX2xlYWYub3BlbkZpbGUoY3JlYXRlZF9ub3RlLCB7c3RhdGU6IHttb2RlOiAnc291cmNlJ30sIGVTdGF0ZToge3JlbmFtZTogJ2FsbCd9fSk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmVkaXRvci5qdW1wX3RvX25leHRfY3Vyc29yX2xvY2F0aW9uKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY3JlYXRlZF9ub3RlO1xuICAgIH1cblxuICAgIGFzeW5jIGFwcGVuZF90ZW1wbGF0ZV90b19hY3RpdmVfZmlsZSh0ZW1wbGF0ZV9maWxlOiBURmlsZSk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBjb25zdCBhY3RpdmVfdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgICAgIGlmIChhY3RpdmVfdmlldyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgbG9nX2Vycm9yKG5ldyBUZW1wbGF0ZXJFcnJvcihcIk5vIGFjdGl2ZSB2aWV3LCBjYW4ndCBhcHBlbmQgdGVtcGxhdGVzLlwiKSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcnVubmluZ19jb25maWcgPSB0aGlzLmNyZWF0ZV9ydW5uaW5nX2NvbmZpZyh0ZW1wbGF0ZV9maWxlLCBhY3RpdmVfdmlldy5maWxlLCBSdW5Nb2RlLkFwcGVuZEFjdGl2ZUZpbGUpO1xuICAgICAgICBjb25zdCBvdXRwdXRfY29udGVudCA9IGF3YWl0IGVycm9yV3JhcHBlcihhc3luYyAoKSA9PiB0aGlzLnJlYWRfYW5kX3BhcnNlX3RlbXBsYXRlKHJ1bm5pbmdfY29uZmlnKSwgXCJUZW1wbGF0ZSBwYXJzaW5nIGVycm9yLCBhYm9ydGluZy5cIik7XG4gICAgICAgIC8vIGVycm9yV3JhcHBlciBmYWlsZWQgXG4gICAgICAgIGlmIChvdXRwdXRfY29udGVudCA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBlZGl0b3IgPSBhY3RpdmVfdmlldy5lZGl0b3I7XG4gICAgICAgIGNvbnN0IGRvYyA9IGVkaXRvci5nZXREb2MoKTtcbiAgICAgICAgZG9jLnJlcGxhY2VTZWxlY3Rpb24ob3V0cHV0X2NvbnRlbnQpO1xuXG4gICAgICAgIC8vIFRPRE86IFJlbW92ZSB0aGlzXG4gICAgICAgIGF3YWl0IHRoaXMuZWRpdG9yLmp1bXBfdG9fbmV4dF9jdXJzb3JfbG9jYXRpb24oKTtcbiAgICB9XG5cbiAgICBhc3luYyB3cml0ZV90ZW1wbGF0ZV90b19maWxlKHRlbXBsYXRlX2ZpbGU6IFRGaWxlLCBmaWxlOiBURmlsZSkge1xuICAgICAgICBjb25zdCBydW5uaW5nX2NvbmZpZyA9IHRoaXMuY3JlYXRlX3J1bm5pbmdfY29uZmlnKHRlbXBsYXRlX2ZpbGUsIGZpbGUsIFJ1bk1vZGUuT3ZlcndyaXRlRmlsZSk7XG4gICAgICAgIGNvbnN0IG91dHB1dF9jb250ZW50ID0gYXdhaXQgZXJyb3JXcmFwcGVyKGFzeW5jICgpID0+IHRoaXMucmVhZF9hbmRfcGFyc2VfdGVtcGxhdGUocnVubmluZ19jb25maWcpLCBcIlRlbXBsYXRlIHBhcnNpbmcgZXJyb3IsIGFib3J0aW5nLlwiKTtcbiAgICAgICAgLy8gZXJyb3JXcmFwcGVyIGZhaWxlZCBcbiAgICAgICAgaWYgKG91dHB1dF9jb250ZW50ID09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5tb2RpZnkoZmlsZSwgb3V0cHV0X2NvbnRlbnQpO1xuICAgIH1cblxuICAgIG92ZXJ3cml0ZV9hY3RpdmVfZmlsZV9jb21tYW5kcygpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgYWN0aXZlX3ZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgICAgICBpZiAoYWN0aXZlX3ZpZXcgPT09IG51bGwpIHtcblx0XHRcdGxvZ19lcnJvcihuZXcgVGVtcGxhdGVyRXJyb3IoXCJBY3RpdmUgdmlldyBpcyBudWxsLCBjYW4ndCBvdmVyd3JpdGUgY29udGVudFwiKSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vdmVyd3JpdGVfZmlsZV9jb21tYW5kcyhhY3RpdmVfdmlldy5maWxlLCB0cnVlKTtcblx0fVxuXG4gICAgYXN5bmMgb3ZlcndyaXRlX2ZpbGVfY29tbWFuZHMoZmlsZTogVEZpbGUsIGFjdGl2ZV9maWxlOiBib29sZWFuID0gZmFsc2UpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgcnVubmluZ19jb25maWcgPSB0aGlzLmNyZWF0ZV9ydW5uaW5nX2NvbmZpZyhmaWxlLCBmaWxlLCBhY3RpdmVfZmlsZSA/IFJ1bk1vZGUuT3ZlcndyaXRlQWN0aXZlRmlsZSA6IFJ1bk1vZGUuT3ZlcndyaXRlRmlsZSk7XG4gICAgICAgIGNvbnN0IG91dHB1dF9jb250ZW50ID0gYXdhaXQgZXJyb3JXcmFwcGVyKGFzeW5jICgpID0+IHRoaXMucmVhZF9hbmRfcGFyc2VfdGVtcGxhdGUocnVubmluZ19jb25maWcpLCBcIlRlbXBsYXRlIHBhcnNpbmcgZXJyb3IsIGFib3J0aW5nLlwiKTtcbiAgICAgICAgLy8gZXJyb3JXcmFwcGVyIGZhaWxlZCBcbiAgICAgICAgaWYgKG91dHB1dF9jb250ZW50ID09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5tb2RpZnkoZmlsZSwgb3V0cHV0X2NvbnRlbnQpO1xuICAgICAgICAvLyBUT0RPOiBSZW1vdmUgdGhpc1xuICAgICAgICBpZiAodGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKSA9PT0gZmlsZSkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5lZGl0b3IuanVtcF90b19uZXh0X2N1cnNvcl9sb2NhdGlvbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgcHJvY2Vzc19keW5hbWljX3RlbXBsYXRlcyhlbDogSFRNTEVsZW1lbnQsIGN0eDogTWFya2Rvd25Qb3N0UHJvY2Vzc29yQ29udGV4dCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBjb25zdCBkeW5hbWljX2NvbW1hbmRfcmVnZXg6IFJlZ0V4cCA9IC8oPCUoPzotfF8pP1xccypbKn5dezAsMX0pXFwrKCg/Oi58XFxzKSo/JT4pL2c7XG5cbiAgICAgICAgY29uc3Qgd2Fsa2VyID0gZG9jdW1lbnQuY3JlYXRlTm9kZUl0ZXJhdG9yKGVsLCBOb2RlRmlsdGVyLlNIT1dfVEVYVCk7XG4gICAgICAgIGxldCBub2RlO1xuICAgICAgICBsZXQgcGFzcyA9IGZhbHNlO1xuICAgICAgICBsZXQgZnVuY3Rpb25zX29iamVjdDoge307XG4gICAgICAgIHdoaWxlICgobm9kZSA9IHdhbGtlci5uZXh0Tm9kZSgpKSkge1xuICAgICAgICAgICAgbGV0IGNvbnRlbnQgPSBub2RlLm5vZGVWYWx1ZTtcbiAgICAgICAgICAgIGxldCBtYXRjaDtcbiAgICAgICAgICAgIGlmICgobWF0Y2ggPSBkeW5hbWljX2NvbW1hbmRfcmVnZXguZXhlYyhjb250ZW50KSkgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldEZpcnN0TGlua3BhdGhEZXN0KFwiXCIsIGN0eC5zb3VyY2VQYXRoKTtcbiAgICAgICAgICAgICAgICBpZiAoIWZpbGUgfHwgIShmaWxlIGluc3RhbmNlb2YgVEZpbGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFwYXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhc3MgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb25maWcgPSB0aGlzLmNyZWF0ZV9ydW5uaW5nX2NvbmZpZyhmaWxlLCBmaWxlLCBSdW5Nb2RlLkR5bmFtaWNQcm9jZXNzb3IpO1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbnNfb2JqZWN0ID0gYXdhaXQgdGhpcy5mdW5jdGlvbnNfZ2VuZXJhdG9yLmdlbmVyYXRlX29iamVjdChjb25maWcsIEZ1bmN0aW9uc01vZGUuVVNFUl9JTlRFUk5BTCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudF9mdW5jdGlvbnNfb2JqZWN0ID0gZnVuY3Rpb25zX29iamVjdDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB3aGlsZSAobWF0Y2ggIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBOb3QgdGhlIG1vc3QgZWZmaWNpZW50IHdheSB0byBleGNsdWRlIHRoZSAnKycgZnJvbSB0aGUgY29tbWFuZCBidXQgSSBjb3VsZG4ndCBmaW5kIHNvbWV0aGluZyBiZXR0ZXJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29tcGxldGVfY29tbWFuZCA9IG1hdGNoWzFdICsgbWF0Y2hbMl07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbW1hbmRfb3V0cHV0OiBzdHJpbmcgPSBhd2FpdCBlcnJvcldyYXBwZXIoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMucGFyc2VyLnBhcnNlX2NvbW1hbmRzKGNvbXBsZXRlX2NvbW1hbmQsIGZ1bmN0aW9uc19vYmplY3QpO1xuICAgICAgICAgICAgICAgICAgICB9LCBgQ29tbWFuZCBQYXJzaW5nIGVycm9yIGluIGR5bmFtaWMgY29tbWFuZCAnJHtjb21wbGV0ZV9jb21tYW5kfSdgKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbW1hbmRfb3V0cHV0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZXQgc3RhcnQgPSBkeW5hbWljX2NvbW1hbmRfcmVnZXgubGFzdEluZGV4IC0gbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBsZXQgZW5kID0gZHluYW1pY19jb21tYW5kX3JlZ2V4Lmxhc3RJbmRleDtcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IGNvbnRlbnQuc3Vic3RyaW5nKDAsIHN0YXJ0KSArIGNvbW1hbmRfb3V0cHV0ICsgY29udGVudC5zdWJzdHJpbmcoZW5kKTtcblxuICAgICAgICAgICAgICAgICAgICBkeW5hbWljX2NvbW1hbmRfcmVnZXgubGFzdEluZGV4ICs9IChjb21tYW5kX291dHB1dC5sZW5ndGggLSBtYXRjaFswXS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICBtYXRjaCA9IGR5bmFtaWNfY29tbWFuZF9yZWdleC5leGVjKGNvbnRlbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBub2RlLm5vZGVWYWx1ZSA9IGNvbnRlbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblx0fVxuXG4gICAgc3RhdGljIGFzeW5jIG9uX2ZpbGVfY3JlYXRpb24odGVtcGxhdGVyOiBUZW1wbGF0ZXIsIGZpbGU6IFRBYnN0cmFjdEZpbGUpIHtcbiAgICAgICAgaWYgKCEoZmlsZSBpbnN0YW5jZW9mIFRGaWxlKSB8fCBmaWxlLmV4dGVuc2lvbiAhPT0gXCJtZFwiKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBdm9pZHMgdGVtcGxhdGUgcmVwbGFjZW1lbnQgd2hlbiBzeW5jaW5nIHRlbXBsYXRlIGZpbGVzXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlX2ZvbGRlciA9IG5vcm1hbGl6ZVBhdGgodGVtcGxhdGVyLnBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZXNfZm9sZGVyKTtcbiAgICAgICAgaWYgKGZpbGUucGF0aC5pbmNsdWRlcyh0ZW1wbGF0ZV9mb2xkZXIpICYmIHRlbXBsYXRlX2ZvbGRlciAhPT0gXCIvXCIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRPRE86IGZpbmQgYSBiZXR0ZXIgd2F5IHRvIGRvIHRoaXNcbiAgICAgICAgLy8gQ3VycmVudGx5LCBJIGhhdmUgdG8gd2FpdCBmb3IgdGhlIGRhaWx5IG5vdGUgcGx1Z2luIHRvIGFkZCB0aGUgZmlsZSBjb250ZW50IGJlZm9yZSByZXBsYWNpbmdcbiAgICAgICAgLy8gTm90IGEgcHJvYmxlbSB3aXRoIENhbGVuZGFyIGhvd2V2ZXIgc2luY2UgaXQgY3JlYXRlcyB0aGUgZmlsZSB3aXRoIHRoZSBleGlzdGluZyBjb250ZW50XG4gICAgICAgIGF3YWl0IGRlbGF5KDMwMCk7XG5cbiAgICAgICAgaWYgKGZpbGUuc3RhdC5zaXplID09IDAgJiYgdGVtcGxhdGVyLnBsdWdpbi5zZXR0aW5ncy5lbXB0eV9maWxlX3RlbXBsYXRlKSB7XG4gICAgICAgICAgICBjb25zdCB0ZW1wbGF0ZV9maWxlOiBURmlsZSA9IGF3YWl0IGVycm9yV3JhcHBlcihhc3luYyAoKTogUHJvbWlzZTxURmlsZT4gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlX3RmaWxlKHRlbXBsYXRlci5hcHAsIHRlbXBsYXRlci5wbHVnaW4uc2V0dGluZ3MuZW1wdHlfZmlsZV90ZW1wbGF0ZSArIFwiLm1kXCIpO1xuICAgICAgICAgICAgfSwgYENvdWxkbid0IGZpbmQgRW1wdHkgZmlsZSB0ZW1wbGF0ZSAke3RlbXBsYXRlci5wbHVnaW4uc2V0dGluZ3MuZW1wdHlfZmlsZV90ZW1wbGF0ZX1gKTtcbiAgICAgICAgICAgIC8vIGVycm9yV3JhcHBlciBmYWlsZWRcbiAgICAgICAgICAgIGlmICh0ZW1wbGF0ZV9maWxlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhd2FpdCB0ZW1wbGF0ZXIud3JpdGVfdGVtcGxhdGVfdG9fZmlsZSh0ZW1wbGF0ZV9maWxlLCBmaWxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGF3YWl0IHRlbXBsYXRlci5vdmVyd3JpdGVfZmlsZV9jb21tYW5kcyhmaWxlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIGV4ZWN1dGVfc3RhcnR1cF9zY3JpcHRzKCkge1xuICAgICAgICBmb3IgKGNvbnN0IHRlbXBsYXRlIG9mIHRoaXMucGx1Z2luLnNldHRpbmdzLnN0YXJ0dXBfdGVtcGxhdGVzKSB7XG4gICAgICAgICAgICBpZiAodGVtcGxhdGUgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGZpbGUgPSBlcnJvcldyYXBwZXJTeW5jKCgpID0+IHJlc29sdmVfdGZpbGUodGhpcy5hcHAsIHRlbXBsYXRlKSwgYENvdWxkbid0IGZpbmQgc3RhcnR1cCB0ZW1wbGF0ZSBcIiR7dGVtcGxhdGV9XCJgKTtcbiAgICAgICAgICAgIGlmICghZmlsZSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcnVubmluZ19jb25maWcgPSB0aGlzLmNyZWF0ZV9ydW5uaW5nX2NvbmZpZyhmaWxlLCBmaWxlLCBSdW5Nb2RlLlN0YXJ0dXBUZW1wbGF0ZSk7XG4gICAgICAgICAgICBhd2FpdCBlcnJvcldyYXBwZXIoYXN5bmMgKCkgPT4gdGhpcy5yZWFkX2FuZF9wYXJzZV90ZW1wbGF0ZShydW5uaW5nX2NvbmZpZyksIGBTdGFydHVwIFRlbXBsYXRlIHBhcnNpbmcgZXJyb3IsIGFib3J0aW5nLmApO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IFRlbXBsYXRlclBsdWdpbiBmcm9tIFwibWFpblwiO1xuaW1wb3J0IHsgVGVtcGxhdGVyIH0gZnJvbSAnVGVtcGxhdGVyJztcbmltcG9ydCB7IFNldHRpbmdzIH0gZnJvbSAnU2V0dGluZ3MnO1xuaW1wb3J0IHsgQXBwLCBFdmVudFJlZiwgTWVudSwgTWVudUl0ZW0sIFRBYnN0cmFjdEZpbGUsIFRGaWxlLCBURm9sZGVyIH0gZnJvbSAnb2JzaWRpYW4nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFdmVudEhhbmRsZXIge1xuXHRwcml2YXRlIHN5bnRheF9oaWdobGlnaHRpbmdfZXZlbnQ6IEV2ZW50UmVmO1xuXHRwcml2YXRlIHRyaWdnZXJfb25fZmlsZV9jcmVhdGlvbl9ldmVudDogRXZlbnRSZWY7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFwcDogQXBwLCBwcml2YXRlIHBsdWdpbjogVGVtcGxhdGVyUGx1Z2luLCBwcml2YXRlIHRlbXBsYXRlcjogVGVtcGxhdGVyLCBwcml2YXRlIHNldHRpbmdzOiBTZXR0aW5ncykge31cblxuICAgIHNldHVwKCk6IHZvaWQge1xuXHRcdHRoaXMuYXBwLndvcmtzcGFjZS5vbkxheW91dFJlYWR5KCgpID0+IHtcblx0XHRcdHRoaXMudXBkYXRlX3RyaWdnZXJfZmlsZV9vbl9jcmVhdGlvbigpO1x0XG5cdFx0fSk7XG4gICAgICAgIHRoaXMudXBkYXRlX3N5bnRheF9oaWdobGlnaHRpbmcoKTtcbiAgICAgICAgdGhpcy51cGRhdGVfZmlsZV9tZW51KCk7XG4gICAgfVxuXG5cdHVwZGF0ZV9zeW50YXhfaGlnaGxpZ2h0aW5nKCkge1xuXHRcdGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy5zeW50YXhfaGlnaGxpZ2h0aW5nKSB7XG5cdFx0XHR0aGlzLnN5bnRheF9oaWdobGlnaHRpbmdfZXZlbnQgPSB0aGlzLmFwcC53b3Jrc3BhY2Uub24oXCJjb2RlbWlycm9yXCIsIGNtID0+IHtcblx0XHRcdFx0Y20uc2V0T3B0aW9uKFwibW9kZVwiLCBcInRlbXBsYXRlclwiKTtcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5hcHAud29ya3NwYWNlLml0ZXJhdGVDb2RlTWlycm9ycyhjbSA9PiB7XG5cdFx0XHRcdGNtLnNldE9wdGlvbihcIm1vZGVcIiwgXCJ0ZW1wbGF0ZXJcIik7XG5cdFx0XHR9KTtcblx0XHRcdHRoaXMucGx1Z2luLnJlZ2lzdGVyRXZlbnQodGhpcy5zeW50YXhfaGlnaGxpZ2h0aW5nX2V2ZW50KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKHRoaXMuc3ludGF4X2hpZ2hsaWdodGluZ19ldmVudCkge1xuXHRcdFx0XHR0aGlzLmFwcC52YXVsdC5vZmZyZWYodGhpcy5zeW50YXhfaGlnaGxpZ2h0aW5nX2V2ZW50KTtcblx0XHRcdH1cblx0XHRcdHRoaXMuYXBwLndvcmtzcGFjZS5pdGVyYXRlQ29kZU1pcnJvcnMoY20gPT4ge1xuXHRcdFx0XHRjbS5zZXRPcHRpb24oXCJtb2RlXCIsIFwiaHlwZXJtZFwiKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdHVwZGF0ZV90cmlnZ2VyX2ZpbGVfb25fY3JlYXRpb24oKTogdm9pZCB7XG5cdFx0aWYgKHRoaXMuc2V0dGluZ3MudHJpZ2dlcl9vbl9maWxlX2NyZWF0aW9uKSB7XG5cdFx0XHR0aGlzLnRyaWdnZXJfb25fZmlsZV9jcmVhdGlvbl9ldmVudCA9IHRoaXMuYXBwLnZhdWx0Lm9uKFwiY3JlYXRlXCIsIChmaWxlOiBUQWJzdHJhY3RGaWxlKSA9PiBUZW1wbGF0ZXIub25fZmlsZV9jcmVhdGlvbih0aGlzLnRlbXBsYXRlciwgZmlsZSkpO1xuXHRcdFx0dGhpcy5wbHVnaW4ucmVnaXN0ZXJFdmVudCh0aGlzLnRyaWdnZXJfb25fZmlsZV9jcmVhdGlvbl9ldmVudCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmICh0aGlzLnRyaWdnZXJfb25fZmlsZV9jcmVhdGlvbl9ldmVudCkge1xuXHRcdFx0XHR0aGlzLmFwcC52YXVsdC5vZmZyZWYodGhpcy50cmlnZ2VyX29uX2ZpbGVfY3JlYXRpb25fZXZlbnQpO1xuXHRcdFx0XHR0aGlzLnRyaWdnZXJfb25fZmlsZV9jcmVhdGlvbl9ldmVudCA9IHVuZGVmaW5lZDtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuICAgIHVwZGF0ZV9maWxlX21lbnUoKTogdm9pZCB7XG5cdFx0dGhpcy5wbHVnaW4ucmVnaXN0ZXJFdmVudChcblx0XHRcdHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImZpbGUtbWVudVwiLCAobWVudTogTWVudSwgZmlsZTogVEZpbGUpID0+IHtcblx0XHRcdFx0aWYgKGZpbGUgaW5zdGFuY2VvZiBURm9sZGVyKSB7XG5cdFx0XHRcdFx0bWVudS5hZGRJdGVtKChpdGVtOiBNZW51SXRlbSkgPT4ge1xuXHRcdFx0XHRcdFx0aXRlbS5zZXRUaXRsZShcIkNyZWF0ZSBuZXcgbm90ZSBmcm9tIHRlbXBsYXRlXCIpXG5cdFx0XHRcdFx0XHRcdC5zZXRJY29uKFwidGVtcGxhdGVyLWljb25cIilcblx0XHRcdFx0XHRcdFx0Lm9uQ2xpY2soXyA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4uZnV6enlfc3VnZ2VzdGVyLmNyZWF0ZV9uZXdfbm90ZV9mcm9tX3RlbXBsYXRlKGZpbGUpO1xuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQXBwIH0gZnJvbSAnb2JzaWRpYW4nO1xuXG5pbXBvcnQgVGVtcGxhdGVyUGx1Z2luIGZyb20gJ21haW4nO1xuaW1wb3J0IHsgcmVzb2x2ZV90ZmlsZSB9IGZyb20gJ1V0aWxzJztcbmltcG9ydCB7IGVycm9yV3JhcHBlclN5bmMgfSBmcm9tICdFcnJvcic7XG5cbmV4cG9ydCBjbGFzcyBDb21tYW5kSGFuZGxlciB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhcHA6IEFwcCwgcHJpdmF0ZSBwbHVnaW46IFRlbXBsYXRlclBsdWdpbikge31cblxuICAgIHNldHVwKCkge1xuXHRcdHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuXHRcdFx0aWQ6IFwiaW5zZXJ0LXRlbXBsYXRlclwiLFxuXHRcdFx0bmFtZTogXCJPcGVuIEluc2VydCBUZW1wbGF0ZSBtb2RhbFwiLFxuXHRcdFx0aG90a2V5czogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bW9kaWZpZXJzOiBbXCJBbHRcIl0sXG5cdFx0XHRcdFx0a2V5OiAnZScsXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdFx0Y2FsbGJhY2s6ICgpID0+IHtcblx0XHRcdFx0dGhpcy5wbHVnaW4uZnV6enlfc3VnZ2VzdGVyLmluc2VydF90ZW1wbGF0ZSgpO1xuXHRcdFx0fSxcblx0XHR9KTtcblxuXHRcdHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgICAgICAgaWQ6IFwicmVwbGFjZS1pbi1maWxlLXRlbXBsYXRlclwiLFxuICAgICAgICAgICAgbmFtZTogXCJSZXBsYWNlIHRlbXBsYXRlcyBpbiB0aGUgYWN0aXZlIGZpbGVcIixcbiAgICAgICAgICAgIGhvdGtleXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGlmaWVyczogW1wiQWx0XCJdLFxuICAgICAgICAgICAgICAgICAgICBrZXk6ICdyJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG5cdFx0XHRcdHRoaXMucGx1Z2luLnRlbXBsYXRlci5vdmVyd3JpdGVfYWN0aXZlX2ZpbGVfY29tbWFuZHMoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG5cdFx0dGhpcy5wbHVnaW4uYWRkQ29tbWFuZCh7XG5cdFx0XHRpZDogXCJqdW1wLXRvLW5leHQtY3Vyc29yLWxvY2F0aW9uXCIsXG5cdFx0XHRuYW1lOiBcIkp1bXAgdG8gbmV4dCBjdXJzb3IgbG9jYXRpb25cIixcblx0XHRcdGhvdGtleXM6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG1vZGlmaWVyczogW1wiQWx0XCJdLFxuXHRcdFx0XHRcdGtleTogXCJUYWJcIixcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0XHRjYWxsYmFjazogKCkgPT4ge1xuXHRcdFx0XHR0aGlzLnBsdWdpbi50ZW1wbGF0ZXIuZWRpdG9yLmp1bXBfdG9fbmV4dF9jdXJzb3JfbG9jYXRpb24oKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuXHRcdFx0aWQ6IFwiY3JlYXRlLW5ldy1ub3RlLWZyb20tdGVtcGxhdGVcIixcblx0XHRcdG5hbWU6IFwiQ3JlYXRlIG5ldyBub3RlIGZyb20gdGVtcGxhdGVcIixcblx0XHRcdGhvdGtleXM6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG1vZGlmaWVyczogW1wiQWx0XCJdLFxuXHRcdFx0XHRcdGtleTogXCJuXCIsXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdFx0Y2FsbGJhY2s6ICgpID0+IHtcblx0XHRcdFx0dGhpcy5wbHVnaW4uZnV6enlfc3VnZ2VzdGVyLmNyZWF0ZV9uZXdfbm90ZV9mcm9tX3RlbXBsYXRlKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cbiAgICAgICAgdGhpcy5yZWdpc3Rlcl90ZW1wbGF0ZXNfaG90a2V5cygpO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyX3RlbXBsYXRlc19ob3RrZXlzKCkge1xuICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVkX3RlbXBsYXRlc19ob3RrZXlzLmZvckVhY2godGVtcGxhdGUgPT4ge1xuICAgICAgICAgICAgaWYgKHRlbXBsYXRlICE9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRfdGVtcGxhdGVfaG90a2V5KFwiXCIsIHRlbXBsYXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYWRkX3RlbXBsYXRlX2hvdGtleShvbGRfdGVtcGxhdGU6IHN0cmluZywgbmV3X3RlbXBsYXRlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVfdGVtcGxhdGVfaG90a2V5KG9sZF90ZW1wbGF0ZSk7XG5cbiAgICAgICAgaWYgKG5ld190ZW1wbGF0ZSAhPT0gXCJcIikge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgICAgICAgICAgICAgaWQ6IG5ld190ZW1wbGF0ZSxcbiAgICAgICAgICAgICAgICBuYW1lOiBgSW5zZXJ0ICR7bmV3X3RlbXBsYXRlfWAsXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBlcnJvcldyYXBwZXJTeW5jKCgpID0+IHJlc29sdmVfdGZpbGUodGhpcy5hcHAsIG5ld190ZW1wbGF0ZSksIGBDb3VsZG4ndCBmaW5kIHRoZSB0ZW1wbGF0ZSBmaWxlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGhvdGtleWApO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRlbXBsYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4udGVtcGxhdGVyLmFwcGVuZF90ZW1wbGF0ZV90b19hY3RpdmVfZmlsZSh0ZW1wbGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW1vdmVfdGVtcGxhdGVfaG90a2V5KHRlbXBsYXRlOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRlbXBsYXRlICE9PSBcIlwiKSB7XG4gICAgICAgICAgICAvLyBUT0RPOiBGaW5kIG9mZmljaWFsIHdheSB0byBkbyB0aGlzXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICB0aGlzLmFwcC5jb21tYW5kcy5yZW1vdmVDb21tYW5kKGAke3RoaXMucGx1Z2luLm1hbmlmZXN0LmlkfToke3RlbXBsYXRlfWApO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgYWRkSWNvbiwgTm90aWNlLCBQbHVnaW4gfSBmcm9tICdvYnNpZGlhbic7XHJcblxyXG5pbXBvcnQgeyBERUZBVUxUX1NFVFRJTkdTLCBTZXR0aW5ncywgVGVtcGxhdGVyU2V0dGluZ1RhYiB9IGZyb20gJ1NldHRpbmdzJztcclxuaW1wb3J0IHsgRnV6enlTdWdnZXN0ZXIgfSBmcm9tICdGdXp6eVN1Z2dlc3Rlcic7XHJcbmltcG9ydCB7IElDT05fREFUQSB9IGZyb20gJ0NvbnN0YW50cyc7XHJcbmltcG9ydCB7IFRlbXBsYXRlciB9IGZyb20gJ1RlbXBsYXRlcic7XHJcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSAnRXZlbnRIYW5kbGVyJztcclxuaW1wb3J0IHsgQ29tbWFuZEhhbmRsZXIgfSBmcm9tICdDb21tYW5kSGFuZGxlcic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZW1wbGF0ZXJQbHVnaW4gZXh0ZW5kcyBQbHVnaW4ge1xyXG5cdHB1YmxpYyBzZXR0aW5nczogU2V0dGluZ3M7IFxyXG5cdHB1YmxpYyB0ZW1wbGF0ZXI6IFRlbXBsYXRlcjtcclxuICAgIHB1YmxpYyBldmVudF9oYW5kbGVyOiBFdmVudEhhbmRsZXI7XHJcbiAgICBwdWJsaWMgY29tbWFuZF9oYW5kbGVyOiBDb21tYW5kSGFuZGxlcjtcclxuXHRwdWJsaWMgZnV6enlfc3VnZ2VzdGVyOiBGdXp6eVN1Z2dlc3RlcjtcclxuXHJcblx0YXN5bmMgb25sb2FkKCk6IFByb21pc2U8dm9pZD4ge1xyXG5cdFx0YXdhaXQgdGhpcy5sb2FkX3NldHRpbmdzKCk7XHJcblxyXG5cdFx0dGhpcy50ZW1wbGF0ZXIgPSBuZXcgVGVtcGxhdGVyKHRoaXMuYXBwLCB0aGlzKTtcclxuXHRcdGF3YWl0IHRoaXMudGVtcGxhdGVyLnNldHVwKCk7XHJcblxyXG5cdFx0dGhpcy5mdXp6eV9zdWdnZXN0ZXIgPSBuZXcgRnV6enlTdWdnZXN0ZXIodGhpcy5hcHAsIHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLmV2ZW50X2hhbmRsZXIgPSBuZXcgRXZlbnRIYW5kbGVyKHRoaXMuYXBwLCB0aGlzLCB0aGlzLnRlbXBsYXRlciwgdGhpcy5zZXR0aW5ncyk7XHJcbiAgICAgICAgdGhpcy5ldmVudF9oYW5kbGVyLnNldHVwKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29tbWFuZF9oYW5kbGVyID0gbmV3IENvbW1hbmRIYW5kbGVyKHRoaXMuYXBwLCB0aGlzKTtcclxuICAgICAgICB0aGlzLmNvbW1hbmRfaGFuZGxlci5zZXR1cCgpO1xyXG5cclxuXHJcblx0XHRhZGRJY29uKFwidGVtcGxhdGVyLWljb25cIiwgSUNPTl9EQVRBKTtcclxuXHRcdHRoaXMuYWRkUmliYm9uSWNvbigndGVtcGxhdGVyLWljb24nLCAnVGVtcGxhdGVyJywgYXN5bmMgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLmZ1enp5X3N1Z2dlc3Rlci5pbnNlcnRfdGVtcGxhdGUoKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgVGVtcGxhdGVyU2V0dGluZ1RhYih0aGlzLmFwcCwgdGhpcykpO1xyXG5cclxuICAgICAgICAvLyBGaWxlcyBtaWdodCBub3QgYmUgY3JlYXRlZCB5ZXRcclxuICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2Uub25MYXlvdXRSZWFkeSgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGVyLmV4ZWN1dGVfc3RhcnR1cF9zY3JpcHRzKCk7XHJcbiAgICAgICAgfSk7XHJcblx0fVxyXG5cclxuXHRhc3luYyBzYXZlX3NldHRpbmdzKCk6IFByb21pc2U8dm9pZD4ge1xyXG5cdFx0YXdhaXQgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIGxvYWRfc2V0dGluZ3MoKTogUHJvbWlzZTx2b2lkPiB7XHJcblx0XHR0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9TRVRUSU5HUywgYXdhaXQgdGhpcy5sb2FkRGF0YSgpKTtcclxuXHR9XHJcbn07XHJcbiJdLCJuYW1lcyI6WyJOb3RpY2UiLCJlZmZlY3QiLCJyb3VuZCIsIm1pbiIsIm1heCIsIm1hdGhNYXgiLCJtYXRoTWluIiwiaGFzaCIsImFsbFBsYWNlbWVudHMiLCJwbGFjZW1lbnRzIiwicG9wcGVyT2Zmc2V0cyIsImNvbXB1dGVTdHlsZXMiLCJhcHBseVN0eWxlcyIsIm9mZnNldCIsImZsaXAiLCJwcmV2ZW50T3ZlcmZsb3ciLCJhcnJvdyIsImhpZGUiLCJTY29wZSIsIlRGb2xkZXIiLCJub3JtYWxpemVQYXRoIiwiVEZpbGUiLCJWYXVsdCIsIlBsdWdpblNldHRpbmdUYWIiLCJTZXR0aW5nIiwiRnV6enlTdWdnZXN0TW9kYWwiLCJNYXJrZG93blZpZXciLCJwYXJzZUxpbmt0ZXh0IiwicmVzb2x2ZVN1YnBhdGgiLCJQbGF0Zm9ybSIsIkZpbGVTeXN0ZW1BZGFwdGVyIiwiZ2V0QWxsVGFncyIsIk1vZGFsIiwicHJvbWlzaWZ5IiwiZXhlYyIsInBhdGgiLCJleGlzdHNTeW5jIiwicmVhZEZpbGVTeW5jIiwiRXRhLnJlbmRlckFzeW5jIiwiUGx1Z2luIiwiYWRkSWNvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF1REE7QUFDTyxTQUFTLFNBQVMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUU7QUFDN0QsSUFBSSxTQUFTLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEtBQUssWUFBWSxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLFVBQVUsT0FBTyxFQUFFLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7QUFDaEgsSUFBSSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDL0QsUUFBUSxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJ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QUUsSUFBSSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDO0FBQ3ZGLE1BQU0sUUFBUSxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUM7QUFDbEcsTUFBTSxVQUFVLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQztBQUN4RixNQUFNLFVBQVUsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFDdEQsTUFBTSxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQztBQUM1RixNQUFNLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsUUFBUTtBQUNoRSxNQUFNLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSTtBQUNqRyxNQUFNLE1BQU0sRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQztBQUNuRSxNQUFN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QyxDQUFDO0FBQ3BFLEdBQUc7QUFDSCxFQUFFLFNBQVMsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDaEMsSUFBSSxJQUFJLElBQUksSUFBSSxPQUFPLEVBQUU7QUFDekIsTUFBTSxFQUFFLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQztBQUM3QixNQUFNLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzNCLEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxVQUFVLElBQUksRUFBRSxDQUFDLEtBQUssSUFBSSxTQUFTLEVBQUU7QUFDNUQsTUFBTSxFQUFFLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQztBQUM3QixNQUFNLElBQUksS0FBSyxJQUFJLEtBQUssSUFBSSxLQUFLLElBQUksS0FBSyxFQUFFLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3RFLE1BQU0sSUFBSSxFQUFDO0FBQ1gsTUFBTSxJQUFJLElBQUksSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3BHLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU07QUFDekQsTUFBTSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM3QixLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksUUFBUSxJQUFJLElBQUksSUFBSSxRQUFRLEVBQUU7QUFDckQsTUFBTSxFQUFFLENBQUMsTUFBTSxHQUFHLFVBQVUsR0FBRyxVQUFVLElBQUksRUFBRSxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUMsQ0FBQztBQUNyRSxNQUFNLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzdCLEtBQUssTUFBTSxJQUFJ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USxDQUFDO0FBQzNDLEdBQUc7QUFDSCxFQUFFLFNBQVMsU0FBUyxDQUFDLElBQUksRUFBRTtBQUMzQixJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsRUFBRSxPQUFPLElBQUksRUFBRTtBQUM3QyxJQUFJLElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLElBQUksR0FBRyxFQUFFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztBQUMxRCxJQUFJLE9BQU8sSUFBSSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUM7QUFDcEMsR0FBRztBQUNILEVBQUUsU0FBUyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUNqQyxJQUFJLElBQUksSUFBSSxJQUFJLFVBQVUsSUFBSSxFQUFFLENBQUMsS0FBSyxJQUFJLFNBQVMsRUFBRTtBQUNyRCxNQUFNLEVBQUUsQ0FBQyxNQUFNLEdBQUcsV0FBVTtBQUM1QixNQUFNLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUMzQixLQUFLLE1BQU0sSUFBSSxLQUFLLElBQUksR0FBRyxJQUFJLElBQUksSUFBSSxRQUFRLElBQUksSUFBSSxJQUFJLFFBQVEsRUFBRTtBQUNyRSxNQUFNLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUMzQixLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksR0FBRyxFQUFFO0FBQzVCLE1BQU0sT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQzNCLEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxHQUFHLEVBQUU7QUFDNUIsTUFBTSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsYUFBYSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLENBQUM7QUFDM0UsS0FBSyxNQUFNLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRTtBQUM1QixNQUFNLE9BQU8sSUFBSSxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUM7QUFDekMsS0FBSyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxFQUFFO0FBQzFDLE1BQU0sT0FBTyxJQUFJLEVBQUU7QUFDbkIsS0FBSztBQUNMLEdBQUc7QUFDSCxFQUFFLFNBQVMsU0FBUyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDbEMsSUFBSSxJQUFJLElBQUksSUFBSSxPQUFPLEVBQUUsT0FBTyxJQUFJLEVBQUUsQ0FBQztBQUN2QyxJQUFJLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN0RSxJQUFJLE9BQU8sSUFBSSxDQUFDLFFBQVEsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0FBQzdDLEdBQUc7QUFDSCxFQUFFLFNBQVMsaUJBQWlCLENBQUMsSUFBSSxFQUFFO0FBQ25DLElBQUksSUFBSSxJQUFJLElBQUksR0FBRyxFQUFFO0FBQ3JCLE1BQU0sRUFBRSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUM7QUFDN0IsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7QUFDckMsTUFBTSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM3QixLQUFLO0FBQ0wsR0FBRztBQUNILEVBQUUsU0FBUyxPQUFPLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUNoQyxJQUFJLElBQUksSUFBSSxJQUFJLFVBQVUsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDdEcsSUFBSSxJQUFJLElBQUksSUFBSSxHQUFHLEVBQUUsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQzFDLElBQUksSUFBSSxJQUFJLElBQUksUUFBUSxFQUFFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUM5QyxJQUFJLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUN6QixHQUFHO0FBQ0gsRUFBRSxTQUFTLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ2xDLElBQUksSUFBSSxLQUFLLElBQUksR0FBRyxFQUFFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUM7QUFDM0YsSUFBSSxJQUFJLEtBQUssSUFBSSxHQUFHLElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxLQUFLLElBQUksR0FBRyxFQUFFLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUMxRSxJQUFJLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFNBQVMsQ0FBQztBQUNsRSxJQUFJLElBQUksS0FBSyxJQUFJLFNBQVMsSUFBSSxLQUFLLElBQUksWUFBWSxFQUFFLEVBQUUsRUFBRSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUNyRyxJQUFJLElBQUksS0FBSyxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFFBQVEsQ0FBQztBQUNsRSxHQUFHO0FBQ0gsRUFBRSxTQUFTLGFBQWEsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFO0FBQ25DLElBQUksSUFBSSxLQUFLLElBQUksR0FBRyxFQUFFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUM7QUFDM0YsR0FBRztBQUNILEVBQUUsU0FBUyxTQUFTLEdBQUc7QUFDdkIsSUFBSSxPQUFPLElBQUksQ0FBQyxRQUFRLEVBQUUsZ0JBQWdCLENBQUM7QUFDM0MsR0FBRztBQUNILEVBQUUsU0FBUyxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFO0FBQ3RDLElBQUksSUFBSSxLQUFLLElBQUksR0FBRyxFQUFFLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUMzQyxHQUFHO0FBQ0gsRUFBRSxTQUFTLE1BQU0sQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFO0FBQzVCLElBQUksSUFBSSxLQUFLLElBQUksTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN0RSxJQUFJLE9BQU8sSUFBSSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQzdELEdBQUc7QUFDSCxFQUFFLFNBQVMsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDaEMsSUFBSSxJQUFJLElBQUksSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ2xGLElBQUksSUFBSSxJQUFJLElBQUksVUFBVSxFQUFFLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxFQUFFO0FBQy9ELElBQUksSUFBSSxJQUFJLElBQUksUUFBUSxFQUFFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9DLElBQUksSUFBSSxJQUFJLElBQUksR0FBRyxFQUFFLE9BQU8sWUFBWSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUMxRCxJQUFJLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRSxPQUFPLFlBQVksQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDM0QsR0FBRztBQUNILEVBQUUsU0FBUyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUNwQyxJQUFJLElBQUksSUFBSSxJQUFJLFVBQVUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsRUFBRTtBQUNoRSxNQUFNLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN0QixNQUFNLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQy9CLEtBQUs7QUFDTCxJQUFJLElBQUksSUFBSSxJQUFJLFVBQVUsRUFBRSxFQUFFLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQztBQUNuRCxJQUFJLElBQUksSUFBSSxJQUFJLFFBQVEsRUFBRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMvQyxJQUFJLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksRUFBRSxDQUFDO0FBQ25DLElBQUksSUFBSSxJQUFJLElBQUksR0FBRyxFQUFFLE9BQU8sSUFBSSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ3BGLElBQUksT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztBQUNuRCxHQUFHO0FBQ0gsRUFBRSxTQUFTLFVBQVUsR0FBRztBQUN4QixJQUFJLE9BQU8sSUFBSSxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUM7QUFDckMsR0FBRztBQUNILEVBQUUsU0FBUyxXQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUNyQyxJQUFJLElBQUksS0FBSyxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3JELEdBQUc7QUFDSCxFQUFFLFNBQVMsVUFBVSxDQUFDLElBQUksRUFBRTtBQUM1QixJQUFJLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN6QyxHQUFHO0FBQ0gsRUFBRSxTQUFTLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ2xDLElBQUksSUFBSSxJQUFJLElBQUksV0FBVyxJQUFJLEtBQUssSUFBSSxNQUFNLEVBQUUsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDeEcsR0FBRztBQUNILEVBQUUsU0FBUyxPQUFPLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUNoQyxJQUFJLElBQUksS0FBSyxJQUFJLE9BQU8sRUFBRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMvQyxJQUFJLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2pFLEdBQUc7QUFDSCxFQUFFLFNBQVMsUUFBUSxDQUFDLElBQUksRUFBRTtBQUMxQixJQUFJLElBQUksSUFBSSxJQUFJLEtBQUssRUFBRSxPQUFPLElBQUksQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDckQsSUFBSSxJQUFJLElBQUksSUFBSSxVQUFVLEVBQUUsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDbEQsSUFBSSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDekIsR0FBRztBQUNILEVBQUUsU0FBUyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUNqQyxJQUFJLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksRUFBRTtBQUNsQyxJQUFJLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDMUMsSUFBSSxJQUFJLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxJQUFJLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxFQUFFO0FBQ3BHLElBQUksT0FBTyxJQUFJLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQztBQUNyQyxHQUFHO0FBQ0gsRUFBRSxTQUFTLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ3BDLElBQUksSUFBSSxLQUFLLElBQUksR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0FBQ3hFLElBQUksSUFBSSxJQUFJLElBQUksVUFBVSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztBQUN4RSxJQUFJLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDaEksSUFBSSxJQUFJLElBQUksSUFBSSxLQUFLLElBQUksR0FBRyxFQUFFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxXQUFXLENBQUM7QUFDdEcsR0FBRztBQUNILEVBQUUsU0FBUyxZQUFZLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUNyQyxJQUFJLElBQUksS0FBSyxJQUFJLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztBQUN6RSxJQUFJLElBQUksSUFBSSxJQUFJLFVBQVUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7QUFDekUsSUFBSSxJQUFJLElBQUksSUFBSSxHQUFHLEVBQUUsT0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDckgsSUFBSSxJQUFJLElBQUksSUFBSSxLQUFLLElBQUksR0FBRyxFQUFFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxZQUFZLENBQUM7QUFDdkcsR0FBRztBQUNILEVBQUUsU0FBUyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUNqQyxJQUFJLElBQUksSUFBSSxJQUFJLFNBQVMsSUFBSSxJQUFJLElBQUksVUFBVSxFQUFFO0FBQ2pELE1BQU0sRUFBRSxDQUFDLE1BQU0sR0FBRyxPQUFNO0FBQ3hCLE1BQU0sT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQzNCLEtBQUssTUFBTSxJQUFJLEtBQUssSUFBSSxHQUFHLEVBQUU7QUFDN0IsTUFBTSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUM7QUFDakUsS0FBSztBQUNMLEdBQUc7QUFDSCxFQUFFLFNBQVMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDL0IsSUFBSSxJQUFJLEtBQUssSUFBSSxHQUFHLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUM7QUFDOUMsSUFBSSxJQUFJLElBQUksSUFBSSxRQUFRLEVBQUUsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDOUMsSUFBSSxJQUFJLElBQUksSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUU7QUFDbEYsSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksTUFBTSxFQUFFLE9BQU8sSUFBSSxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUM7QUFDbkUsSUFBSSxPQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ2pELEdBQUc7QUFDSCxFQUFFLFNBQVMsZUFBZSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDeEM7QUFDQSxJQUFJLElBQUksSUFBSSxJQUFJLFVBQVUsRUFBRSxPQUFPLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDMUQsSUFBSSxPQUFPLGNBQWMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDdkMsR0FBRztBQUNILEVBQUUsU0FBUyxTQUFTLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUNsQyxJQUFJLElBQUksSUFBSSxJQUFJLFVBQVUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7QUFDM0UsR0FBRztBQUNILEVBQUUsU0FBUyxjQUFjLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUN2QyxJQUFJLElBQUksS0FBSyxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsRUFBRSxNQUFNLEVBQUUsY0FBYyxDQUFDO0FBQ2pHLElBQUksSUFBSSxLQUFLLElBQUksU0FBUyxJQUFJLEtBQUssSUFBSSxZQUFZLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRTtBQUM5RSxNQUFNLElBQUksS0FBSyxJQUFJLFlBQVksRUFBRSxFQUFFLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztBQUN2RCxNQUFNLE9BQU8sSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLEdBQUcsVUFBVSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBQ2hFLEtBQUs7QUFDTCxJQUFJLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2xFLEdBQUc7QUFDSCxFQUFFLFNBQVMsU0FBUyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDbEMsSUFBSSxJQUFJLElBQUksSUFBSSxPQUFPO0FBQ3ZCLFNBQVMsSUFBSSxJQUFJLFVBQVU7QUFDM0IsVUFBVSxLQUFLLElBQUksUUFBUSxJQUFJLEtBQUssSUFBSSxLQUFLLElBQUksS0FBSyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDL0YsU0FBUyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQzFELE1BQU0sRUFBRSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7QUFDNUIsTUFBTSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM3QixLQUFLO0FBQ0wsSUFBSSxJQUFJLElBQUksSUFBSSxVQUFVLElBQUksRUFBRSxDQUFDLEtBQUssSUFBSSxTQUFTLEVBQUU7QUFDckQsTUFBTSxFQUFFLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQztBQUM3QixNQUFNLE9BQU8sSUFBSSxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUN6QyxLQUFLO0FBQ0wsSUFBSSxJQUFJLElBQUksSUFBSSxRQUFRLElBQUksSUFBSSxJQUFJLFFBQVEsRUFBRSxPQUFPLElBQUksQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDakYsSUFBSSxJQUFJLElBQUksSUFBSSxHQUFHO0FBQ25CLE1BQU0sT0FBTyxJQUFJLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLFNBQVMsQ0FBQztBQUM1RSxJQUFJLElBQUksS0FBSyxJQUFJLEdBQUcsRUFBRTtBQUN0QixNQUFNLEVBQUUsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO0FBQzVCLE1BQU0sT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDN0IsS0FBSztBQUNMLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDO0FBQ2pFLElBQUksSUFBSSxJQUFJLElBQUksR0FBRyxJQUFJLElBQUksSUFBSSxHQUFHLEVBQUUsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDM0QsSUFBSSxJQUFJLElBQUksSUFBSSxHQUFHLEVBQUUsT0FBTyxJQUFJLEVBQUUsQ0FBQztBQUNuQyxJQUFJLElBQUksS0FBSyxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDO0FBQ3hELEdBQUc7QUFDSCxFQUFFLFNBQVMsVUFBVSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDbkMsSUFBSSxJQUFJLEtBQUssSUFBSSxHQUFHLEVBQUUsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0FBQzdDLElBQUksSUFBSSxLQUFLLElBQUksR0FBRyxFQUFFLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztBQUM3QyxJQUFJLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDO0FBQ3ZELElBQUksSUFBSSxLQUFLLElBQUksR0FBRyxFQUFFLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDO0FBQ3BELElBQUksSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFdBQVcsR0FBRyxPQUFPLElBQUksT0FBTyxDQUFDLElBQUksSUFBSSxZQUFXO0FBQzdGLElBQUksT0FBTyxJQUFJLENBQUMsV0FBVyxHQUFHLFlBQVksR0FBRyxXQUFXLENBQUM7QUFDekQsR0FBRztBQUNILEVBQUUsU0FBUyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUNwQyxJQUFJLElBQUksS0FBSyxJQUFJLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDckYsSUFBSSxJQUFJLEtBQUssSUFBSSxTQUFTLEVBQUUsRUFBRSxFQUFFLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQzVGLElBQUksSUFBSSxJQUFJLElBQUksR0FBRyxFQUFFLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3JGLElBQUksT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDM0IsR0FBRztBQUNILEVBQUUsU0FBUyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUNwQyxJQUFJLElBQUksS0FBSyxJQUFJLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUNsRixJQUFJLElBQUksSUFBSSxJQUFJLFVBQVUsRUFBRSxPQUFPLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUN4RSxHQUFHO0FBQ0gsRUFBRSxTQUFTLFdBQVcsQ0FBQyxJQUFJLEVBQUU7QUFDN0IsSUFBSSxJQUFJLElBQUksSUFBSSxRQUFRLEVBQUUsT0FBTyxJQUFJLEVBQUUsQ0FBQztBQUN4QyxJQUFJLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM3QyxJQUFJLElBQUksSUFBSSxJQUFJLEdBQUcsRUFBRSxPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3JELElBQUksT0FBTyxJQUFJLENBQUMsVUFBVSxFQUFFLGdCQUFnQixFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3pELEdBQUc7QUFDSCxFQUFFLFNBQVMsVUFBVSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDbkMsSUFBSSxJQUFJLElBQUksSUFBSSxHQUFHLEVBQUUsT0FBTyxZQUFZLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzFELElBQUksSUFBSSxJQUFJLElBQUksVUFBVSxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QyxJQUFJLElBQUksS0FBSyxJQUFJLEdBQUcsRUFBRSxFQUFFLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztBQUM1QyxJQUFJLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3pCLEdBQUc7QUFDSCxFQUFFLFNBQVMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFO0FBQ2xDLElBQUksSUFBSSxJQUFJLElBQUksR0FBRyxFQUFFLE9BQU8sSUFBSSxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQztBQUM5RCxHQUFHO0FBQ0gsRUFBRSxTQUFTLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQ2pDLElBQUksSUFBSSxLQUFLLElBQUksSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFO0FBQzFFLEdBQUc7QUFDSCxFQUFFLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDbkMsSUFBSSxJQUFJLEtBQUssSUFBSSxNQUFNLEVBQUUsRUFBRSxFQUFFLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUU7QUFDNUUsR0FBRztBQUNILEVBQUUsU0FBUyxZQUFZLENBQUMsSUFBSSxFQUFFO0FBQzlCLElBQUksSUFBSSxJQUFJLElBQUksR0FBRyxFQUFFLE9BQU8sSUFBSSxFQUFFLENBQUM7QUFDbkMsSUFBSSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNsRCxHQUFHO0FBQ0gsRUFBRSxTQUFTLE9BQU8sR0FBRztBQUNyQixJQUFJLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUM7QUFDL0csR0FBRztBQUNILEVBQUUsU0FBUyxVQUFVLEdBQUc7QUFDeEIsSUFBSSxPQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDdEMsR0FBRztBQUNIO0FBQ0EsRUFBRSxTQUFTLG9CQUFvQixDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7QUFDbEQsSUFBSSxPQUFPLEtBQUssQ0FBQyxRQUFRLElBQUksVUFBVSxJQUFJLEtBQUssQ0FBQyxRQUFRLElBQUksR0FBRztBQUNoRSxNQUFNLGNBQWMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5QyxNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLEdBQUc7QUFDSDtBQUNBLEVBQUUsU0FBUyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTtBQUNwRCxJQUFJLE9BQU8sS0FBSyxDQUFDLFFBQVEsSUFBSSxTQUFTO0FBQ3RDLE1BQU0sZ0ZBQWdGLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7QUFDM0csT0FBTyxLQUFLLENBQUMsUUFBUSxJQUFJLE9BQU8sSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsR0FBRyxJQUFJLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEcsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEVBQUUsT0FBTztBQUNULElBQUksVUFBVSxFQUFFLFNBQVMsVUFBVSxFQUFFO0FBQ3JDLE1BQU0sSUFBSSxLQUFLLEdBQUc7QUFDbEIsUUFBUSxRQUFRLEVBQUUsU0FBUztBQUMzQixRQUFRLFFBQVEsRUFBRSxLQUFLO0FBQ3ZCLFFBQVEsRUFBRSxFQUFFLEVBQUU7QUFDZCxRQUFRLE9BQU8sRUFBRSxJQUFJLFNBQVMsQ0FBQyxDQUFDLFVBQVUsSUFBSSxDQUFDLElBQUksVUFBVSxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDO0FBQ2pGLFFBQVEsU0FBUyxFQUFFLFlBQVksQ0FBQyxTQUFTO0FBQ3pDLFFBQVEsT0FBTyxFQUFFLFlBQVksQ0FBQyxTQUFTLElBQUksSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUM7QUFDekUsUUFBUSxRQUFRLEVBQUUsVUFBVSxJQUFJLENBQUM7QUFDakMsT0FBTyxDQUFDO0FBQ1IsTUFBTSxJQUFJLFlBQVksQ0FBQyxVQUFVLElBQUksT0FBTyxZQUFZLENBQUMsVUFBVSxJQUFJLFFBQVE7QUFDL0UsUUFBUSxLQUFLLENBQUMsVUFBVSxHQUFHLFlBQVksQ0FBQyxVQUFVLENBQUM7QUFDbkQsTUFBTSxPQUFPLEtBQUssQ0FBQztBQUNuQixLQUFLO0FBQ0w7QUFDQSxJQUFJLEtBQUssRUFBRSxTQUFTLE1BQU0sRUFBRSxLQUFLLEVBQUU7QUFDbkMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxHQUFHLEVBQUUsRUFBRTtBQUN4QixRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUM7QUFDbEQsVUFBVSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDdEMsUUFBUSxLQUFLLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUM5QyxRQUFRLFlBQVksQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDcEMsT0FBTztBQUNQLE1BQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxJQUFJLFlBQVksSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUM7QUFDM0UsTUFBTSxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNoRCxNQUFNLElBQUksSUFBSSxJQUFJLFNBQVMsRUFBRSxPQUFPLEtBQUssQ0FBQztBQUMxQyxNQUFNLEtBQUssQ0FBQyxRQUFRLEdBQUcsSUFBSSxJQUFJLFVBQVUsS0FBSyxPQUFPLElBQUksSUFBSSxJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsR0FBRyxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ3BHLE1BQU0sT0FBTyxPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzFELEtBQUs7QUFDTDtBQUNBLElBQUksTUFBTSxFQUFFLFNBQVMsS0FBSyxFQUFFLFNBQVMsRUFBRTtBQUN2QyxNQUFNLElBQUksS0FBSyxDQUFDLFFBQVEsSUFBSSxZQUFZLElBQUksS0FBSyxDQUFDLFFBQVEsSUFBSSxVQUFVLEVBQUUsT0FBTyxVQUFVLENBQUMsSUFBSSxDQUFDO0FBQ2pHLE1BQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxJQUFJLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNoRCxNQUFNLElBQUksU0FBUyxHQUFHLFNBQVMsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUc7QUFDcEY7QUFDQSxNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDeEYsUUFBUSxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVCLFFBQVEsSUFBSSxDQUFDLElBQUksTUFBTSxFQUFFLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO0FBQ2hELGFBQWEsSUFBSSxDQUFDLElBQUksU0FBUyxJQUFJLENBQUMsSUFBSSxVQUFVLEVBQUUsTUFBTTtBQUMxRCxPQUFPO0FBQ1AsTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxNQUFNLElBQUksT0FBTyxDQUFDLElBQUksSUFBSSxNQUFNO0FBQzlELGNBQWMsU0FBUyxJQUFJLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUN2RSxvQ0FBb0MsR0FBRyxJQUFJLGtCQUFrQixJQUFJLEdBQUcsSUFBSSxvQkFBb0IsQ0FBQztBQUM3RixtQ0FBbUMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztBQUN4RSxRQUFRLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO0FBQy9CLE1BQU0sSUFBSSxlQUFlLElBQUksT0FBTyxDQUFDLElBQUksSUFBSSxHQUFHLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksTUFBTTtBQUMvRSxRQUFRLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO0FBQy9CLE1BQU0sSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLEdBQUcsU0FBUyxJQUFJLElBQUksQ0FBQztBQUMzRDtBQUNBLE1BQU0sSUFBSSxJQUFJLElBQUksUUFBUSxFQUFFLE9BQU8sT0FBTyxDQUFDLFFBQVEsSUFBSSxLQUFLLENBQUMsUUFBUSxJQUFJLFVBQVUsSUFBSSxLQUFLLENBQUMsUUFBUSxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDNUksV0FBVyxJQUFJLElBQUksSUFBSSxNQUFNLElBQUksU0FBUyxJQUFJLEdBQUcsRUFBRSxPQUFPLE9BQU8sQ0FBQyxRQUFRLENBQUM7QUFDM0UsV0FBVyxJQUFJLElBQUksSUFBSSxNQUFNLEVBQUUsT0FBTyxPQUFPLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztBQUNwRSxXQUFXLElBQUksSUFBSSxJQUFJLE1BQU07QUFDN0IsUUFBUSxPQUFPLE9BQU8sQ0FBQyxRQUFRLElBQUksb0JBQW9CLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxHQUFHLGVBQWUsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDL0csV0FBVyxJQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksUUFBUSxJQUFJLENBQUMsT0FBTyxJQUFJLFlBQVksQ0FBQyxrQkFBa0IsSUFBSSxLQUFLO0FBQy9GLFFBQVEsT0FBTyxPQUFPLENBQUMsUUFBUSxJQUFJLHFCQUFxQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDO0FBQ3hHLFdBQVcsSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sT0FBTyxDQUFDLE1BQU0sSUFBSSxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3hFLFdBQVcsT0FBTyxPQUFPLENBQUMsUUFBUSxJQUFJLE9BQU8sR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUM7QUFDaEUsS0FBSztBQUNMO0FBQ0EsSUFBSSxhQUFhLEVBQUUsbUNBQW1DO0FBQ3RELElBQUksaUJBQWlCLEVBQUUsUUFBUSxHQUFHLElBQUksR0FBRyxJQUFJO0FBQzdDLElBQUksZUFBZSxFQUFFLFFBQVEsR0FBRyxJQUFJLEdBQUcsSUFBSTtBQUMzQyxJQUFJLG9CQUFvQixFQUFFLFFBQVEsR0FBRyxJQUFJLEdBQUcsS0FBSztBQUNqRCxJQUFJLFdBQVcsRUFBRSxRQUFRLEdBQUcsSUFBSSxHQUFHLElBQUk7QUFDdkMsSUFBSSxJQUFJLEVBQUUsT0FBTztBQUNqQixJQUFJLGFBQWEsRUFBRSxnQkFBZ0I7QUFDbkM7QUFDQSxJQUFJLFVBQVUsRUFBRSxRQUFRLEdBQUcsTUFBTSxHQUFHLFlBQVk7QUFDaEQsSUFBSSxVQUFVLEVBQUUsVUFBVTtBQUMxQixJQUFJLFFBQVEsRUFBRSxRQUFRO0FBQ3RCO0FBQ0EsSUFBSSxpQkFBaUIsRUFBRSxpQkFBaUI7QUFDeEM7QUFDQSxJQUFJLGNBQWMsRUFBRSxTQUFTLEtBQUssRUFBRTtBQUNwQyxNQUFNLE9BQU8sQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxVQUFVLENBQUMsWUFBWSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUM7QUFDdEYsS0FBSztBQUNMLEdBQUcsQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUFDO0FBQ0g7QUFDQSxVQUFVLENBQUMsY0FBYyxDQUFDLFdBQVcsRUFBRSxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDOUQ7QUFDQSxVQUFVLENBQUMsVUFBVSxDQUFDLGlCQUFpQixFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ3ZELFVBQVUsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDdkQsVUFBVSxDQUFDLFVBQVUsQ0FBQyx3QkFBd0IsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUM5RCxVQUFVLENBQUMsVUFBVSxDQUFDLDBCQUEwQixFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ2hFLFVBQVUsQ0FBQyxVQUFVLENBQUMsd0JBQXdCLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDOUQsVUFBVSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDOUUsVUFBVSxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDaEYsVUFBVSxDQUFDLFVBQVUsQ0FBQywyQkFBMkIsRUFBRSxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFDO0FBQ3RGLFVBQVUsQ0FBQyxVQUFVLENBQUMscUJBQXFCLEVBQUUsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ25GLFVBQVUsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ25GLFVBQVUsQ0FBQyxVQUFVLENBQUMsd0JBQXdCLEVBQUUsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzFGO0FBQ0EsQ0FBQyxDQUFDOztBQ3o3QkY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxTQUFTLEdBQUcsRUFBRTtBQUNmLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN6QixDQUFDLEVBQUUsU0FBUyxVQUFVLEVBQUU7QUFFeEI7QUFDQSxVQUFVLENBQUMsaUJBQWlCLEdBQUcsU0FBUyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTtBQUNoRSxFQUFFLE9BQU87QUFDVCxJQUFJLFVBQVUsRUFBRSxXQUFXO0FBQzNCLE1BQU0sT0FBTztBQUNiLFFBQVEsSUFBSSxFQUFFLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO0FBQ3pDLFFBQVEsT0FBTyxFQUFFLFVBQVUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO0FBQy9DLFFBQVEsT0FBTyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSTtBQUNqQyxRQUFRLFVBQVUsRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLElBQUk7QUFDdkMsUUFBUSxVQUFVLEVBQUUsSUFBSTtBQUN4QixPQUFPLENBQUM7QUFDUixLQUFLO0FBQ0wsSUFBSSxTQUFTLEVBQUUsU0FBUyxLQUFLLEVBQUU7QUFDL0IsTUFBTSxPQUFPO0FBQ2IsUUFBUSxJQUFJLEVBQUUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQztBQUNwRCxRQUFRLE9BQU8sRUFBRSxVQUFVLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDO0FBQzdELFFBQVEsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUk7QUFDN0MsUUFBUSxVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsSUFBSTtBQUN0RCxPQUFPLENBQUM7QUFDUixLQUFLO0FBQ0w7QUFDQSxJQUFJLEtBQUssRUFBRSxTQUFTLE1BQU0sRUFBRSxLQUFLLEVBQUU7QUFDbkMsTUFBTSxJQUFJLE1BQU0sSUFBSSxLQUFLLENBQUMsVUFBVTtBQUNwQyxVQUFVLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRTtBQUNwRSxRQUFRLEtBQUssQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO0FBQ2xDLFFBQVEsS0FBSyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDeEQsT0FBTztBQUNQO0FBQ0EsTUFBTSxJQUFJLE1BQU0sQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRTtBQUN6QyxRQUFRLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZELFFBQVEsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDO0FBQ25DLE9BQU87QUFDUCxNQUFNLElBQUksTUFBTSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsVUFBVSxFQUFFO0FBQzVDLFFBQVEsTUFBTSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2xDLFFBQVEsS0FBSyxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDaEUsUUFBUSxLQUFLLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUM7QUFDdEMsT0FBTztBQUNQLE1BQU0sTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzdEO0FBQ0E7QUFDQSxNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUMsVUFBVSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLHdCQUF3QixDQUFDLEVBQUU7QUFDakcsUUFBUSxLQUFLLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLHVCQUF1QixFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ2pGLFFBQVEsS0FBSyxDQUFDLFVBQVUsSUFBSSxDQUFDLHFDQUFxQyxDQUFDLENBQUM7QUFDcEUsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLE1BQU0sSUFBSSxLQUFLLENBQUMsVUFBVSxJQUFJLElBQUksRUFBRSxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUM7QUFDekQsV0FBVyxJQUFJLEtBQUssQ0FBQyxPQUFPLElBQUksSUFBSTtBQUNwQyxlQUFlLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYTtBQUMxQyxlQUFlLE9BQU8sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsSUFBSSxJQUFJO0FBQzdELFFBQVEsT0FBTyxLQUFLLENBQUMsT0FBTyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO0FBQ3RELFdBQVcsT0FBTyxLQUFLLENBQUMsVUFBVSxDQUFDO0FBQ25DLEtBQUs7QUFDTDtBQUNBLElBQUksTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLElBQUksU0FBUyxLQUFLLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRTtBQUM1RCxNQUFNLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN0RCxLQUFLO0FBQ0wsSUFBSSxhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWE7QUFDckM7QUFDQSxJQUFJLFNBQVMsRUFBRSxTQUFTLEtBQUssRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRTtBQUMxRTtBQUNBLElBQUksU0FBUyxFQUFFLFNBQVMsS0FBSyxFQUFFO0FBQy9CLE1BQU0sSUFBSSxTQUFTLEVBQUUsWUFBWSxDQUFDO0FBQ2xDLE1BQU0sSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqRSxNQUFNLElBQUksT0FBTyxDQUFDLFNBQVMsRUFBRSxZQUFZLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0U7QUFDQSxNQUFNLE9BQU8sWUFBWSxJQUFJLElBQUk7QUFDakMsUUFBUSxTQUFTO0FBQ2pCLFNBQVMsT0FBTyxJQUFJLFNBQVMsSUFBSSxJQUFJLEdBQUcsU0FBUyxHQUFHLEdBQUcsR0FBRyxZQUFZLEdBQUcsWUFBWSxDQUFDLENBQUM7QUFDdkYsS0FBSztBQUNMLEdBQUcsQ0FBQztBQUNKLENBQUMsQ0FBQztBQUNGO0FBQ0EsQ0FBQyxDQUFDOztBQ2xGRjtBQUVBLE1BQU0sa0JBQWtCLEdBQVcsbUJBQW1CLENBQUM7QUFDdkQsTUFBTSxlQUFlLEdBQVcsa0JBQWtCLENBQUM7QUFFbkQsTUFBTSwwQkFBMEIsR0FBVyx1QkFBdUIsQ0FBQztBQUNuRSxNQUFNLDBCQUEwQixHQUFXLHVCQUF1QixDQUFDO0FBRW5FLE1BQU0sZ0NBQWdDLEdBQVcsNkJBQTZCLENBQUM7QUFDL0UsTUFBTSxzQkFBc0IsR0FBVyxtQkFBbUIsQ0FBQztBQUMzRCxNQUFNLHVCQUF1QixHQUFXLHlCQUF5QixDQUFDO01BRXJELE1BQU07SUFHZixZQUEyQixHQUFRLEVBQVUsTUFBdUI7UUFBekMsUUFBRyxHQUFILEdBQUcsQ0FBSztRQUFVLFdBQU0sR0FBTixNQUFNLENBQWlCO1FBQ2hFLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ25EO0lBRUssS0FBSzs7WUFDUCxNQUFNLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDOztTQUV2QztLQUFBO0lBRUssNEJBQTRCOztZQUM5QixJQUFJLENBQUMsYUFBYSxDQUFDLDRCQUE0QixFQUFFLENBQUM7U0FDckQ7S0FBQTtJQUVFLHNCQUFzQjs7Ozs7OztZQU9yQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsbUJBQW1CLEVBQUU7Z0JBQzNDLE9BQU87YUFDVjs7WUFHUCxJQUFJRyxpQkFBUSxDQUFDLFdBQVcsRUFBRTtnQkFDekIsT0FBTzthQUNQO1lBRUssTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQ2xFLElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7Z0JBQ25CLFNBQVMsQ0FBQyxJQUFJLGNBQWMsQ0FBQyw2RUFBNkUsQ0FBQyxDQUFDLENBQUM7Z0JBQzdHLE9BQU87YUFDaEI7OztZQUlLLE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUM7WUFDekQsSUFBSSxZQUFZLElBQUksSUFBSSxFQUFFO2dCQUN0QixTQUFTLENBQUMsSUFBSSxjQUFjLENBQUMsb0VBQW9FLENBQUMsQ0FBQyxDQUFDO2dCQUNwRyxPQUFPO2FBQ1Y7WUFFRCxNQUFNLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsVUFBUyxNQUFNLEVBQUUsWUFBWTtnQkFDNUUsTUFBTSxnQkFBZ0IsR0FBRztvQkFDWixVQUFVLEVBQUU7d0JBQ1IsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7d0JBQ3ZELHVDQUNPLFFBQVEsS0FDWCxTQUFTLEVBQUUsS0FBSyxFQUNoQixTQUFTLEVBQUUsRUFBRSxFQUNiLFFBQVEsRUFBRSxLQUFLLElBQ2pCO3FCQUNMO29CQUNELFNBQVMsRUFBRSxVQUFTLEtBQVU7d0JBQzFCLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3dCQUN2RCxNQUFNLFNBQVMsbUNBQ1IsUUFBUSxLQUNYLFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUyxFQUMxQixTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVMsRUFDMUIsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRLEdBQzNCLENBQUM7d0JBQ0YsT0FBTyxTQUFTLENBQUM7cUJBQ3BCO29CQUNELFNBQVMsRUFBRSxVQUFTLEtBQVU7d0JBQzFCLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRTs0QkFDakIsT0FBTyxzQ0FBc0MsQ0FBQzt5QkFDakQ7d0JBQ0QsT0FBTyxJQUFJLENBQUM7cUJBQ2Y7b0JBQ0QsS0FBSyxFQUFFLFVBQVMsTUFBVyxFQUFFLEtBQVU7d0JBQ25DLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUU7NEJBQ2pDLEtBQUssQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO3lCQUN6Qjt3QkFFRCxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUU7NEJBQ2pCLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQzs0QkFDbEIsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsRUFBRTtnQ0FDcEMsS0FBSyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7Z0NBQ3hCLEtBQUssQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO2dDQUN2QixNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO2dDQUNsQyxLQUFLLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztnQ0FFckIsT0FBTyxRQUFRLGVBQWUsSUFBSSxrQkFBa0IsSUFBSSwwQkFBMEIsSUFBSSxTQUFTLEVBQUUsQ0FBQzs2QkFDckc7NEJBRUQsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7NEJBQy9DLElBQUksTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLElBQUksSUFBSSxLQUFLLENBQUMsUUFBUSxFQUFFO2dDQUN6QyxRQUFRLElBQUksdUNBQXVDLENBQUM7NkJBQ3ZEOzRCQUNELElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO2dDQUNqQixRQUFRLElBQUksU0FBUyxlQUFlLEVBQUUsQ0FBQzs2QkFDMUM7NEJBRUQsT0FBTyxHQUFHLFFBQVEsSUFBSSxrQkFBa0IsSUFBSSxTQUFTLEVBQUUsQ0FBQzt5QkFDM0Q7d0JBRUQsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFDaEUsSUFBSSxLQUFLLElBQUksSUFBSSxFQUFFOzRCQUNmLFFBQVEsS0FBSyxDQUFDLENBQUMsQ0FBQztnQ0FDWixLQUFLLEdBQUc7b0NBQ0osS0FBSyxDQUFDLFNBQVMsR0FBRyx1QkFBdUIsQ0FBQztvQ0FDMUMsTUFBTTtnQ0FDVixLQUFLLEdBQUc7b0NBQ0osS0FBSyxDQUFDLFNBQVMsR0FBRyxzQkFBc0IsQ0FBQztvQ0FDekMsTUFBTTtnQ0FDVjtvQ0FDSSxLQUFLLENBQUMsU0FBUyxHQUFHLGdDQUFnQyxDQUFDO29DQUNuRCxNQUFNOzZCQUNiOzRCQUNELEtBQUssQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDOzRCQUN2QixPQUFPLFFBQVEsZUFBZSxJQUFJLGtCQUFrQixJQUFJLDBCQUEwQixJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQzt5QkFDM0c7d0JBRUQsT0FBTyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDOzRCQUFDLENBQUM7d0JBQzVELE9BQU8sSUFBSSxDQUFDO3FCQUNmO2lCQUNiLENBQUM7Z0JBQ08sT0FBTyxZQUFZLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxFQUFFLGdCQUFnQixDQUFDLENBQUM7YUFDN0YsQ0FBQyxDQUFDO1NBQ0g7S0FBQTtJQUVRLGNBQWM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztTQWtEbkI7S0FBQTs7O0FDdEtMLFNBQVMsY0FBYyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUU7QUFDcEM7QUFDQSxJQUFJLElBQUksTUFBTSxDQUFDLGNBQWMsRUFBRTtBQUMvQixRQUFRLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzFDLEtBQUs7QUFDTCxTQUFTO0FBQ1QsUUFBUSxHQUFHLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztBQUM5QixLQUFLO0FBQ0wsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxNQUFNLENBQUMsT0FBTyxFQUFFO0FBQ3pCLElBQUksSUFBSSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDakMsSUFBSSxjQUFjLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMxQyxJQUFJLE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQztBQUNELE1BQU0sQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFO0FBQ2xELElBQUksSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFO0FBQ25ELENBQUMsQ0FBQyxDQUFDO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsU0FBUyxRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUU7QUFDdEMsSUFBSSxJQUFJLFVBQVUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEQsSUFBSSxJQUFJLE1BQU0sR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO0FBQ25DLElBQUksSUFBSSxLQUFLLEdBQUcsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2xELElBQUksT0FBTztBQUNYLFFBQVEsV0FBVztBQUNuQixZQUFZLE1BQU07QUFDbEIsWUFBWSxPQUFPO0FBQ25CLFlBQVksS0FBSztBQUNqQixZQUFZLE9BQU87QUFDbkIsWUFBWSxJQUFJO0FBQ2hCLFlBQVksR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZDLFlBQVksSUFBSTtBQUNoQixZQUFZLElBQUk7QUFDaEIsWUFBWSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUNsQyxZQUFZLEdBQUcsQ0FBQztBQUNoQixJQUFJLE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzFCLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksV0FBVyxHQUFHLElBQUksUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBLFNBQVMsMkJBQTJCLEdBQUc7QUFDdkMsSUFBSSxJQUFJO0FBQ1IsUUFBUSxPQUFPLElBQUksUUFBUSxDQUFDLHlDQUF5QyxDQUFDLEVBQUUsQ0FBQztBQUN6RSxLQUFLO0FBQ0wsSUFBSSxPQUFPLENBQUMsRUFBRTtBQUNkLFFBQVEsSUFBSSxDQUFDLFlBQVksV0FBVyxFQUFFO0FBQ3RDLFlBQVksTUFBTSxNQUFNLENBQUMsOENBQThDLENBQUMsQ0FBQztBQUN6RSxTQUFTO0FBQ1QsYUFBYTtBQUNiLFlBQVksTUFBTSxDQUFDLENBQUM7QUFDcEIsU0FBUztBQUNULEtBQUs7QUFDTCxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFFBQVEsQ0FBQyxHQUFHLEVBQUU7QUFDdkI7QUFDQSxJQUFJLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFO0FBQ3JDLFFBQVEsT0FBTyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDOUIsS0FBSztBQUNMLFNBQVM7QUFDVCxRQUFRLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDdkMsS0FBSztBQUNMLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsU0FBUyxDQUFDLEdBQUcsRUFBRTtBQUN4QjtBQUNBLElBQUksSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUU7QUFDdEMsUUFBUSxPQUFPLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUMvQixLQUFLO0FBQ0wsU0FBUztBQUNULFFBQVEsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN2QyxLQUFLO0FBQ0wsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFNBQVMsVUFBVSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUU7QUFDL0IsSUFBSSxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDM0QsQ0FBQztBQUNELFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7QUFDbkMsSUFBSSxLQUFLLElBQUksR0FBRyxJQUFJLE9BQU8sRUFBRTtBQUM3QixRQUFRLElBQUksVUFBVSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsRUFBRTtBQUN0QyxZQUFZLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdEMsU0FBUztBQUNULEtBQUs7QUFDTCxJQUFJLE9BQU8sS0FBSyxDQUFDO0FBQ2pCLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxTQUFTLE1BQU0sQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUU7QUFDOUMsSUFBSSxJQUFJLFFBQVEsQ0FBQztBQUNqQixJQUFJLElBQUksU0FBUyxDQUFDO0FBQ2xCLElBQUksSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUN4QztBQUNBO0FBQ0EsUUFBUSxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0QyxRQUFRLFNBQVMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLEtBQUs7QUFDTCxTQUFTO0FBQ1QsUUFBUSxRQUFRLEdBQUcsU0FBUyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDL0MsS0FBSztBQUNMLElBQUksSUFBSSxNQUFNLElBQUksTUFBTSxLQUFLLEtBQUssRUFBRTtBQUNwQyxRQUFRLFFBQVEsR0FBRyxNQUFNLENBQUM7QUFDMUIsS0FBSztBQUNMLElBQUksSUFBSSxPQUFPLElBQUksT0FBTyxLQUFLLEtBQUssRUFBRTtBQUN0QyxRQUFRLFNBQVMsR0FBRyxPQUFPLENBQUM7QUFDNUIsS0FBSztBQUNMLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNqQyxRQUFRLE9BQU8sR0FBRyxDQUFDO0FBQ25CLEtBQUs7QUFDTCxJQUFJLElBQUksUUFBUSxLQUFLLE9BQU8sSUFBSSxTQUFTLEtBQUssT0FBTyxFQUFFO0FBQ3ZELFFBQVEsT0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDMUIsS0FBSztBQUNMLElBQUksSUFBSSxRQUFRLEtBQUssR0FBRyxJQUFJLFFBQVEsS0FBSyxPQUFPLEVBQUU7QUFDbEQ7QUFDQTtBQUNBLFFBQVEsR0FBRyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM1QixLQUFLO0FBQ0wsU0FBUyxJQUFJLFFBQVEsS0FBSyxHQUFHLElBQUksUUFBUSxLQUFLLElBQUksRUFBRTtBQUNwRDtBQUNBLFFBQVEsR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDakQsS0FBSztBQUNMLElBQUksSUFBSSxTQUFTLEtBQUssR0FBRyxJQUFJLFNBQVMsS0FBSyxPQUFPLEVBQUU7QUFDcEQ7QUFDQSxRQUFRLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDN0IsS0FBSztBQUNMLFNBQVMsSUFBSSxTQUFTLEtBQUssR0FBRyxJQUFJLFNBQVMsS0FBSyxJQUFJLEVBQUU7QUFDdEQ7QUFDQSxRQUFRLEdBQUcsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ2pELEtBQUs7QUFDTCxJQUFJLE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLElBQUksTUFBTSxHQUFHO0FBQ2IsSUFBSSxHQUFHLEVBQUUsT0FBTztBQUNoQixJQUFJLEdBQUcsRUFBRSxNQUFNO0FBQ2YsSUFBSSxHQUFHLEVBQUUsTUFBTTtBQUNmLElBQUksR0FBRyxFQUFFLFFBQVE7QUFDakIsSUFBSSxHQUFHLEVBQUUsT0FBTztBQUNoQixDQUFDLENBQUM7QUFDRixTQUFTLFdBQVcsQ0FBQyxDQUFDLEVBQUU7QUFDeEIsSUFBSSxPQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyQixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxTQUFTLENBQUMsR0FBRyxFQUFFO0FBQ3hCO0FBQ0E7QUFDQSxJQUFJLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM3QixJQUFJLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUNoQyxRQUFRLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDdkQsS0FBSztBQUNMLFNBQVM7QUFDVCxRQUFRLE9BQU8sTUFBTSxDQUFDO0FBQ3RCLEtBQUs7QUFDTCxDQUFDO0FBQ0Q7QUFDQTtBQUNBLElBQUksY0FBYyxHQUFHLG9FQUFvRSxDQUFDO0FBQzFGLElBQUksY0FBYyxHQUFHLG1DQUFtQyxDQUFDO0FBQ3pELElBQUksY0FBYyxHQUFHLG1DQUFtQyxDQUFDO0FBQ3pEO0FBQ0EsU0FBUyxZQUFZLENBQUMsTUFBTSxFQUFFO0FBQzlCO0FBQ0EsSUFBSSxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsdUJBQXVCLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDM0QsQ0FBQztBQUNELFNBQVMsS0FBSyxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUU7QUFDNUIsSUFBSSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDcEIsSUFBSSxJQUFJLGlCQUFpQixHQUFHLEtBQUssQ0FBQztBQUNsQyxJQUFJLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQztBQUN0QixJQUFJLElBQUksWUFBWSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDcEMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUU7QUFDeEIsUUFBUSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDeEQsWUFBWSxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNDLFlBQVksSUFBSSxNQUFNLENBQUMsZUFBZSxFQUFFO0FBQ3hDLGdCQUFnQixHQUFHLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDMUQsYUFBYTtBQUNiLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksTUFBTSxDQUFDLFlBQVksRUFBRTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN2RSxLQUFLO0FBQ0w7QUFDQSxJQUFJLGNBQWMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ2pDLElBQUksY0FBYyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDakMsSUFBSSxjQUFjLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUNqQyxJQUFJLFNBQVMsVUFBVSxDQUFDLEtBQUssRUFBRSx1QkFBdUIsRUFBRTtBQUN4RCxRQUFRLElBQUksS0FBSyxFQUFFO0FBQ25CO0FBQ0EsWUFBWSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsaUJBQWlCO0FBQzNELFlBQVksdUJBQXVCLENBQUMsQ0FBQztBQUNyQyxZQUFZLElBQUksS0FBSyxFQUFFO0FBQ3ZCO0FBQ0E7QUFDQSxnQkFBZ0IsS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDckYsZ0JBQWdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkMsYUFBYTtBQUNiLFNBQVM7QUFDVCxLQUFLO0FBQ0wsSUFBSSxJQUFJLFFBQVEsR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLFdBQVcsRUFBRSxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsV0FBVyxFQUFFLE1BQU0sRUFBRTtBQUN6SCxRQUFRLElBQUksV0FBVyxJQUFJLE1BQU0sRUFBRTtBQUNuQyxZQUFZLE9BQU8sV0FBVyxHQUFHLEdBQUcsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDNUQsU0FBUztBQUNULGFBQWEsSUFBSSxNQUFNLEVBQUU7QUFDekI7QUFDQSxZQUFZLE9BQU8sWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hDLFNBQVM7QUFDVCxhQUFhO0FBQ2I7QUFDQSxZQUFZLE9BQU8sV0FBVyxDQUFDO0FBQy9CLFNBQVM7QUFDVCxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDWCxJQUFJLElBQUksWUFBWSxHQUFHLElBQUksTUFBTSxDQUFDLFNBQVMsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLGFBQWEsR0FBRyxRQUFRLEdBQUcsb0JBQW9CLEdBQUcsUUFBUSxHQUFHLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNySixJQUFJLElBQUksYUFBYSxHQUFHLElBQUksTUFBTSxDQUFDLDJCQUEyQixHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzFHO0FBQ0EsSUFBSSxJQUFJLENBQUMsQ0FBQztBQUNWLElBQUksUUFBUSxDQUFDLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRztBQUN6QyxRQUFRLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDMUMsUUFBUSxJQUFJLGVBQWUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkMsUUFBUSxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUIsUUFBUSxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2hDLFFBQVEsVUFBVSxDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUM1QyxRQUFRLGFBQWEsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzVDLFFBQVEsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLENBQUM7QUFDOUIsUUFBUSxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFDL0IsUUFBUSxRQUFRLFFBQVEsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHO0FBQ3JELFlBQVksSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDN0IsZ0JBQWdCLElBQUksT0FBTyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuRSxnQkFBZ0IsWUFBWSxDQUFDLFNBQVMsR0FBRyxTQUFTLEdBQUcsYUFBYSxDQUFDLFNBQVMsQ0FBQztBQUM3RSxnQkFBZ0IsaUJBQWlCLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hELGdCQUFnQixJQUFJLFdBQVcsR0FBRyxNQUFNLEtBQUssWUFBWSxDQUFDLElBQUk7QUFDOUQsc0JBQXNCLEdBQUc7QUFDekIsc0JBQXNCLE1BQU0sS0FBSyxZQUFZLENBQUMsR0FBRztBQUNqRCwwQkFBMEIsR0FBRztBQUM3QiwwQkFBMEIsTUFBTSxLQUFLLFlBQVksQ0FBQyxXQUFXO0FBQzdELDhCQUE4QixHQUFHO0FBQ2pDLDhCQUE4QixFQUFFLENBQUM7QUFDakMsZ0JBQWdCLFVBQVUsR0FBRyxFQUFFLENBQUMsRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxDQUFDO0FBQzlELGdCQUFnQixNQUFNO0FBQ3RCLGFBQWE7QUFDYixpQkFBaUI7QUFDakIsZ0JBQWdCLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2QyxnQkFBZ0IsSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFO0FBQ25DLG9CQUFvQixJQUFJLGVBQWUsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDckYsb0JBQW9CLElBQUksZUFBZSxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ2hELHdCQUF3QixRQUFRLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMxRSxxQkFBcUI7QUFDckIsb0JBQW9CLGFBQWEsQ0FBQyxTQUFTLEdBQUcsZUFBZSxDQUFDO0FBQzlELGlCQUFpQjtBQUNqQixxQkFBcUIsSUFBSSxJQUFJLEtBQUssR0FBRyxFQUFFO0FBQ3ZDLG9CQUFvQixjQUFjLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7QUFDOUQsb0JBQW9CLElBQUksZ0JBQWdCLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNwRSxvQkFBb0IsSUFBSSxnQkFBZ0IsRUFBRTtBQUMxQyx3QkFBd0IsYUFBYSxDQUFDLFNBQVMsR0FBRyxjQUFjLENBQUMsU0FBUyxDQUFDO0FBQzNFLHFCQUFxQjtBQUNyQix5QkFBeUI7QUFDekIsd0JBQXdCLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3pFLHFCQUFxQjtBQUNyQixpQkFBaUI7QUFDakIscUJBQXFCLElBQUksSUFBSSxLQUFLLEdBQUcsRUFBRTtBQUN2QyxvQkFBb0IsY0FBYyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO0FBQzlELG9CQUFvQixJQUFJLGdCQUFnQixHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDcEUsb0JBQW9CLElBQUksZ0JBQWdCLEVBQUU7QUFDMUMsd0JBQXdCLGFBQWEsQ0FBQyxTQUFTLEdBQUcsY0FBYyxDQUFDLFNBQVMsQ0FBQztBQUMzRSxxQkFBcUI7QUFDckIseUJBQXlCO0FBQ3pCLHdCQUF3QixRQUFRLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN6RSxxQkFBcUI7QUFDckIsaUJBQWlCO0FBQ2pCLHFCQUFxQixJQUFJLElBQUksS0FBSyxHQUFHLEVBQUU7QUFDdkMsb0JBQW9CLGNBQWMsQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQztBQUM5RCxvQkFBb0IsSUFBSSxnQkFBZ0IsR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3BFLG9CQUFvQixJQUFJLGdCQUFnQixFQUFFO0FBQzFDLHdCQUF3QixhQUFhLENBQUMsU0FBUyxHQUFHLGNBQWMsQ0FBQyxTQUFTLENBQUM7QUFDM0UscUJBQXFCO0FBQ3JCLHlCQUF5QjtBQUN6Qix3QkFBd0IsUUFBUSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDekUscUJBQXFCO0FBQ3JCLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2IsU0FBUztBQUNULFFBQVEsSUFBSSxVQUFVLEVBQUU7QUFDeEIsWUFBWSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLFNBQVM7QUFDVCxhQUFhO0FBQ2IsWUFBWSxRQUFRLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM1RSxTQUFTO0FBQ1QsS0FBSztBQUNMLElBQUksVUFBVSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN4RCxJQUFJLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRTtBQUN4QixRQUFRLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN4RCxZQUFZLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0MsWUFBWSxJQUFJLE1BQU0sQ0FBQyxVQUFVLEVBQUU7QUFDbkMsZ0JBQWdCLE1BQU0sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUMzRCxhQUFhO0FBQ2IsU0FBUztBQUNULEtBQUs7QUFDTCxJQUFJLE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLGVBQWUsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFO0FBQ3RDLElBQUksSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNwQyxJQUFJLElBQUksR0FBRyxHQUFHLG9CQUFvQjtBQUNsQyxTQUFTLE1BQU0sQ0FBQyxPQUFPLEdBQUcsNEJBQTRCLEdBQUcsRUFBRSxDQUFDO0FBQzVELFNBQVMsTUFBTSxDQUFDLFdBQVcsR0FBRyxvQ0FBb0MsR0FBRyxFQUFFLENBQUM7QUFDeEUsUUFBUSx3Q0FBd0M7QUFDaEQsU0FBUyxNQUFNLENBQUMsV0FBVyxHQUFHLG9CQUFvQixHQUFHLEVBQUUsQ0FBQztBQUN4RCxTQUFTLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUNuRSxRQUFRLFlBQVksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO0FBQ3BDLFNBQVMsTUFBTSxDQUFDLFdBQVc7QUFDM0IsY0FBYyxZQUFZO0FBQzFCLGlCQUFpQixNQUFNLENBQUMsS0FBSyxHQUFHLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDOUMsaUJBQWlCLGdDQUFnQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLEdBQUcscUJBQXFCLENBQUM7QUFDM0YsY0FBYyxNQUFNLENBQUMsT0FBTztBQUM1QixrQkFBa0IsWUFBWTtBQUM5QixxQkFBcUIsTUFBTSxDQUFDLEtBQUssR0FBRyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ2xELHFCQUFxQiw0QkFBNEIsR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLHFCQUFxQixDQUFDO0FBQzNGLGtCQUFrQixFQUFFLENBQUM7QUFDckIsUUFBUSwrQkFBK0I7QUFDdkMsU0FBUyxNQUFNLENBQUMsT0FBTyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUNwQyxJQUFJLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRTtBQUN4QixRQUFRLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN4RCxZQUFZLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0MsWUFBWSxJQUFJLE1BQU0sQ0FBQyxlQUFlLEVBQUU7QUFDeEMsZ0JBQWdCLEdBQUcsR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUMxRCxhQUFhO0FBQ2IsU0FBUztBQUNULEtBQUs7QUFDTCxJQUFJLE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsWUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUU7QUFDcEMsSUFBSSxJQUFJLENBQUMsQ0FBQztBQUNWLElBQUksSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUNqQyxJQUFJLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQztBQUN2QixJQUFJLElBQUksZUFBZSxHQUFHLFlBQVksQ0FBQztBQUN2QyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3JDLFFBQVEsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25DLFFBQVEsSUFBSSxPQUFPLFlBQVksS0FBSyxRQUFRLEVBQUU7QUFDOUMsWUFBWSxJQUFJLEdBQUcsR0FBRyxZQUFZLENBQUM7QUFDbkM7QUFDQSxZQUFZLFNBQVMsSUFBSSxPQUFPLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQztBQUMvQyxTQUFTO0FBQ1QsYUFBYTtBQUNiLFlBQVksSUFBSSxJQUFJLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQztBQUN0QyxZQUFZLElBQUksT0FBTyxHQUFHLFlBQVksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDO0FBQ2pELFlBQVksSUFBSSxJQUFJLEtBQUssR0FBRyxFQUFFO0FBQzlCO0FBQ0EsZ0JBQWdCLElBQUksTUFBTSxDQUFDLFdBQVcsRUFBRTtBQUN4QyxvQkFBb0IsU0FBUyxJQUFJLFlBQVksR0FBRyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQ2pFLG9CQUFvQixTQUFTLElBQUksT0FBTyxHQUFHLGVBQWUsR0FBRyxLQUFLLENBQUM7QUFDbkUsaUJBQWlCO0FBQ2pCLHFCQUFxQjtBQUNyQixvQkFBb0IsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFO0FBQ3ZDLHdCQUF3QixPQUFPLEdBQUcsV0FBVyxHQUFHLE9BQU8sR0FBRyxHQUFHLENBQUM7QUFDOUQscUJBQXFCO0FBQ3JCLG9CQUFvQixTQUFTLElBQUksTUFBTSxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDekQsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYixpQkFBaUIsSUFBSSxJQUFJLEtBQUssR0FBRyxFQUFFO0FBQ25DO0FBQ0EsZ0JBQWdCLElBQUksTUFBTSxDQUFDLFdBQVcsRUFBRTtBQUN4QyxvQkFBb0IsU0FBUyxJQUFJLFlBQVksR0FBRyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQ2pFLG9CQUFvQixTQUFTLElBQUksT0FBTyxHQUFHLGVBQWUsR0FBRyxLQUFLLENBQUM7QUFDbkUsaUJBQWlCO0FBQ2pCLHFCQUFxQjtBQUNyQixvQkFBb0IsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFO0FBQ3ZDLHdCQUF3QixPQUFPLEdBQUcsV0FBVyxHQUFHLE9BQU8sR0FBRyxHQUFHLENBQUM7QUFDOUQscUJBQXFCO0FBQ3JCLG9CQUFvQixTQUFTLElBQUksTUFBTSxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDekQsb0JBQW9CLElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRTtBQUMzQyx3QkFBd0IsT0FBTyxHQUFHLE1BQU0sR0FBRyxPQUFPLEdBQUcsR0FBRyxDQUFDO0FBQ3pELHFCQUFxQjtBQUNyQixvQkFBb0IsU0FBUyxJQUFJLE1BQU0sR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ3pELGlCQUFpQjtBQUNqQixhQUFhO0FBQ2IsaUJBQWlCLElBQUksSUFBSSxLQUFLLEdBQUcsRUFBRTtBQUNuQztBQUNBLGdCQUFnQixTQUFTLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQztBQUM1QyxhQUFhO0FBQ2IsU0FBUztBQUNULEtBQUs7QUFDTCxJQUFJLElBQUksTUFBTSxDQUFDLFdBQVcsRUFBRTtBQUM1QixRQUFRLFNBQVMsSUFBSSwwREFBMEQsR0FBRyxlQUFlLEdBQUcsNEJBQTRCLENBQUM7QUFDakksS0FBSztBQUNMLElBQUksT0FBTyxTQUFTLENBQUM7QUFDckIsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxNQUFNLGtCQUFrQixZQUFZO0FBQ3hDLElBQUksU0FBUyxNQUFNLENBQUMsS0FBSyxFQUFFO0FBQzNCLFFBQVEsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDM0IsS0FBSztBQUNMLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsVUFBVSxHQUFHLEVBQUUsR0FBRyxFQUFFO0FBQ2xELFFBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDOUIsS0FBSyxDQUFDO0FBQ04sSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxVQUFVLEdBQUcsRUFBRTtBQUMxQztBQUNBO0FBQ0E7QUFDQSxRQUFRLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMvQixLQUFLLENBQUM7QUFDTixJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFVBQVUsR0FBRyxFQUFFO0FBQzdDLFFBQVEsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQy9CLEtBQUssQ0FBQztBQUNOLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsWUFBWTtBQUN6QyxRQUFRLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLEtBQUssQ0FBQztBQUNOLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsVUFBVSxRQUFRLEVBQUU7QUFDaEQsUUFBUSxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztBQUN4QyxLQUFLLENBQUM7QUFDTixJQUFJLE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksU0FBUyxHQUFHLElBQUksTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxhQUFhLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxFQUFFO0FBQ2pELElBQUksSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUMxRCxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDbkIsUUFBUSxNQUFNLE1BQU0sQ0FBQyw0QkFBNEIsR0FBRyxrQkFBa0IsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUM5RSxLQUFLO0FBQ0wsSUFBSSxPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDaEMsQ0FBQztBQUNEO0FBQ0EsSUFBSSxNQUFNLEdBQUc7QUFDYixJQUFJLEtBQUssRUFBRSxLQUFLO0FBQ2hCLElBQUksVUFBVSxFQUFFLElBQUk7QUFDcEIsSUFBSSxRQUFRLEVBQUUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDO0FBQzNCLElBQUksS0FBSyxFQUFFLEtBQUs7QUFDaEIsSUFBSSxDQUFDLEVBQUUsU0FBUztBQUNoQixJQUFJLE9BQU8sRUFBRSxhQUFhO0FBQzFCLElBQUksS0FBSyxFQUFFO0FBQ1gsUUFBUSxJQUFJLEVBQUUsRUFBRTtBQUNoQixRQUFRLFdBQVcsRUFBRSxHQUFHO0FBQ3hCLFFBQVEsR0FBRyxFQUFFLEdBQUc7QUFDaEIsS0FBSztBQUNMLElBQUksT0FBTyxFQUFFLEVBQUU7QUFDZixJQUFJLFlBQVksRUFBRSxLQUFLO0FBQ3ZCLElBQUksSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztBQUN0QixJQUFJLFNBQVMsRUFBRSxTQUFTO0FBQ3hCLElBQUksT0FBTyxFQUFFLEtBQUs7QUFDbEIsSUFBSSxPQUFPLEVBQUUsSUFBSTtBQUNqQixDQUFDLENBQUM7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFNBQVMsQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFO0FBQ3pDO0FBQ0EsSUFBSSxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDakIsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzNCLElBQUksSUFBSSxVQUFVLEVBQUU7QUFDcEIsUUFBUSxTQUFTLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ25DLEtBQUs7QUFDTCxJQUFJLElBQUksUUFBUSxFQUFFO0FBQ2xCLFFBQVEsU0FBUyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNqQyxLQUFLO0FBQ0wsSUFBSSxPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUM7QUFLRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxPQUFPLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRTtBQUM5QixJQUFJLElBQUksT0FBTyxHQUFHLFNBQVMsQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLENBQUM7QUFDMUM7QUFDQTtBQUNBLElBQUksSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLEtBQUssR0FBRywyQkFBMkIsRUFBRSxHQUFHLFFBQVEsQ0FBQztBQUN4RTtBQUNBLElBQUksSUFBSTtBQUNSLFFBQVEsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEdBQUc7QUFDNUMsUUFBUSxJQUFJO0FBQ1osUUFBUSxlQUFlLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDdkMsS0FBSztBQUNMLElBQUksT0FBTyxDQUFDLEVBQUU7QUFDZCxRQUFRLElBQUksQ0FBQyxZQUFZLFdBQVcsRUFBRTtBQUN0QyxZQUFZLE1BQU0sTUFBTSxDQUFDLHlCQUF5QjtBQUNsRCxnQkFBZ0IsQ0FBQyxDQUFDLE9BQU87QUFDekIsZ0JBQWdCLElBQUk7QUFDcEIsZ0JBQWdCLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ3JELGdCQUFnQixJQUFJO0FBQ3BCLGdCQUFnQixlQUFlLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQztBQUM3QyxnQkFBZ0IsSUFBSTtBQUNwQixhQUFhLENBQUM7QUFDZCxTQUFTO0FBQ1QsYUFBYTtBQUNiLFlBQVksTUFBTSxDQUFDLENBQUM7QUFDcEIsU0FBUztBQUNULEtBQUs7QUFDTCxDQUFDO0FBQ0Q7QUFDQSxJQUFJLElBQUksR0FBRyxTQUFTLENBQUM7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRTtBQUN6RCxJQUFJLElBQUksV0FBVyxHQUFHTSxlQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxVQUFVLEdBQUdBLGVBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO0FBQ3RGLElBQUksSUFBSTtBQUNSLEtBQUssSUFBSUEsZUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsTUFBTSxDQUFDLENBQUM7QUFDM0MsSUFBSSxPQUFPLFdBQVcsQ0FBQztBQUN2QixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7QUFDaEMsSUFBSSxJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUM7QUFDNUIsSUFBSSxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO0FBQzlCLElBQUksSUFBSSxhQUFhLEdBQUcsRUFBRSxDQUFDO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQ3JDLFFBQVEsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRO0FBQ2xDLFFBQVEsSUFBSSxFQUFFLElBQUk7QUFDbEIsUUFBUSxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7QUFDMUIsUUFBUSxLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUs7QUFDNUIsS0FBSyxDQUFDLENBQUM7QUFDUCxJQUFJLElBQUksT0FBTyxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsYUFBYSxJQUFJLE9BQU8sQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLEVBQUU7QUFDdEY7QUFDQSxRQUFRLE9BQU8sT0FBTyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNsRCxLQUFLO0FBQ0w7QUFDQSxJQUFJLFNBQVMsaUJBQWlCLENBQUMsWUFBWSxFQUFFO0FBQzdDLFFBQVEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEVBQUU7QUFDbkQsWUFBWSxhQUFhLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzdDLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLFNBQVMsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUU7QUFDdEMsUUFBUSxJQUFJLFFBQVEsQ0FBQztBQUNyQjtBQUNBO0FBQ0EsUUFBUSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0FBQ2hDLFlBQVksS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRTtBQUNwQyxnQkFBZ0IsUUFBUSxHQUFHLGdCQUFnQixDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDM0QsZ0JBQWdCLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzVDLGdCQUFnQixPQUFPQyxhQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDNUMsYUFBYSxDQUFDLEVBQUU7QUFDaEI7QUFDQTtBQUNBLFlBQVksT0FBTyxRQUFRLENBQUM7QUFDNUIsU0FBUztBQUNULGFBQWEsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7QUFDNUM7QUFDQSxZQUFZLFFBQVEsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzNELFlBQVksaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDeEMsWUFBWSxJQUFJQSxhQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDdEMsZ0JBQWdCLE9BQU8sUUFBUSxDQUFDO0FBQ2hDLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQSxRQUFRLE9BQU8sS0FBSyxDQUFDO0FBQ3JCLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxLQUFLLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9DO0FBQ0EsSUFBSSxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO0FBQy9CO0FBQ0E7QUFDQSxRQUFRLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3JEO0FBQ0EsUUFBUSxXQUFXLEdBQUcsV0FBVyxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQztBQUN4RCxRQUFRLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDMUI7QUFDQTtBQUNBLFlBQVksSUFBSSxZQUFZLEdBQUcsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxJQUFJLElBQUksR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzFGLFlBQVksaUJBQWlCLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDNUMsWUFBWSxXQUFXLEdBQUcsWUFBWSxDQUFDO0FBQ3ZDLFNBQVM7QUFDVCxLQUFLO0FBQ0wsU0FBUztBQUNUO0FBQ0E7QUFDQSxRQUFRLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRTtBQUM5QixZQUFZLElBQUksUUFBUSxHQUFHLGdCQUFnQixDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDcEUsWUFBWSxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN4QyxZQUFZLElBQUlBLGFBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUN0QyxnQkFBZ0IsV0FBVyxHQUFHLFFBQVEsQ0FBQztBQUN2QyxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLENBQUMsV0FBVyxFQUFFO0FBQzFCLFlBQVksV0FBVyxHQUFHLFdBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDbkQsU0FBUztBQUNULFFBQVEsSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUMxQixZQUFZLE1BQU0sTUFBTSxDQUFDLCtCQUErQixHQUFHLElBQUksR0FBRyxrQkFBa0IsR0FBRyxhQUFhLENBQUMsQ0FBQztBQUN0RyxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQSxJQUFJLElBQUksT0FBTyxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsYUFBYSxFQUFFO0FBQ2hELFFBQVEsT0FBTyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsR0FBRyxXQUFXLENBQUM7QUFDekQsS0FBSztBQUNMLElBQUksT0FBTyxXQUFXLENBQUM7QUFDdkIsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFNBQVMsUUFBUSxDQUFDLFFBQVEsRUFBRTtBQUM1QixJQUFJLElBQUk7QUFDUixRQUFRLE9BQU9DLGVBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ25FLEtBQUs7QUFDTCxJQUFJLE9BQU8sRUFBRSxFQUFFO0FBQ2YsUUFBUSxNQUFNLE1BQU0sQ0FBQyw4QkFBOEIsR0FBRyxRQUFRLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDdEUsS0FBSztBQUNMLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsUUFBUSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFO0FBQzlDLElBQUksSUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3BDLElBQUksSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3RDLElBQUksSUFBSTtBQUNSLFFBQVEsSUFBSSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3pELFFBQVEsSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUN0QixZQUFZLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztBQUN2RSxTQUFTO0FBQ1QsUUFBUSxPQUFPLGdCQUFnQixDQUFDO0FBQ2hDLEtBQUs7QUFDTCxJQUFJLE9BQU8sQ0FBQyxFQUFFO0FBQ2QsUUFBUSxNQUFNLE1BQU0sQ0FBQyxnQkFBZ0IsR0FBRyxRQUFRLEdBQUcsY0FBYyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMvRSxLQUFLO0FBQ0wsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxhQUFhLENBQUMsT0FBTyxFQUFFO0FBQ2hDLElBQUksSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQztBQUNwQyxJQUFJLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRTtBQUN2QixRQUFRLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ25ELFFBQVEsSUFBSSxJQUFJLEVBQUU7QUFDbEIsWUFBWSxPQUFPLElBQUksQ0FBQztBQUN4QixTQUFTO0FBQ1QsUUFBUSxPQUFPLFFBQVEsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDM0MsS0FBSztBQUNMO0FBQ0EsSUFBSSxPQUFPLFFBQVEsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzdDLENBQUM7QUF5Q0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFdBQVcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO0FBQ3BDO0FBQ0EsSUFBSSxJQUFJLGNBQWMsR0FBRyxTQUFTLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ2xGO0FBQ0EsSUFBSSxPQUFPLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBQzNELENBQUM7QUF3REQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRTtBQUN2QyxJQUFJLElBQUksaUJBQWlCLEdBQUcsV0FBVyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNwRCxJQUFJLE9BQU8saUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUQsQ0FBQztBQUNEO0FBQ0E7QUFDQSxTQUFTLFdBQVcsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFO0FBQ3hDLElBQUksSUFBSSxPQUFPLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQzlFLFFBQVEsT0FBTyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbkQsS0FBSztBQUNMLElBQUksSUFBSSxZQUFZLEdBQUcsT0FBTyxRQUFRLEtBQUssVUFBVSxHQUFHLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzlGO0FBQ0E7QUFDQSxJQUFJLElBQUksT0FBTyxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFO0FBQ3ZDLFFBQVEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztBQUM3RCxLQUFLO0FBQ0wsSUFBSSxPQUFPLFlBQVksQ0FBQztBQUN4QixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxNQUFNLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFO0FBQzVDLElBQUksSUFBSSxPQUFPLEdBQUcsU0FBUyxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsQ0FBQztBQUMxQyxJQUFJLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRTtBQUN2QixRQUFRLElBQUksRUFBRSxFQUFFO0FBQ2hCO0FBQ0EsWUFBWSxJQUFJO0FBQ2hCO0FBQ0E7QUFDQSxnQkFBZ0IsSUFBSSxVQUFVLEdBQUcsV0FBVyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNoRSxnQkFBZ0IsVUFBVSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDOUMsYUFBYTtBQUNiLFlBQVksT0FBTyxHQUFHLEVBQUU7QUFDeEIsZ0JBQWdCLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQy9CLGFBQWE7QUFDYixTQUFTO0FBQ1QsYUFBYTtBQUNiO0FBQ0EsWUFBWSxJQUFJLE9BQU8sV0FBVyxLQUFLLFVBQVUsRUFBRTtBQUNuRCxnQkFBZ0IsT0FBTyxJQUFJLFdBQVcsQ0FBQyxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDbEUsb0JBQW9CLElBQUk7QUFDeEIsd0JBQXdCLE9BQU8sQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQy9FLHFCQUFxQjtBQUNyQixvQkFBb0IsT0FBTyxHQUFHLEVBQUU7QUFDaEMsd0JBQXdCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNwQyxxQkFBcUI7QUFDckIsaUJBQWlCLENBQUMsQ0FBQztBQUNuQixhQUFhO0FBQ2IsaUJBQWlCO0FBQ2pCLGdCQUFnQixNQUFNLE1BQU0sQ0FBQyx1RUFBdUUsQ0FBQyxDQUFDO0FBQ3RHLGFBQWE7QUFDYixTQUFTO0FBQ1QsS0FBSztBQUNMLFNBQVM7QUFDVCxRQUFRLE9BQU8sV0FBVyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDN0QsS0FBSztBQUNMLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxXQUFXLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFO0FBQ2pEO0FBQ0EsSUFBSSxPQUFPLE1BQU0sQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ2xGLENBQUM7QUFDRDtBQUNBO0FBQ0EsTUFBTSxDQUFDLFdBQVcsR0FBRyxpQkFBaUIsQ0FBQztBQUN2QyxNQUFNLENBQUMsYUFBYSxHQUFHLEVBQUU7O01DeGdDWixNQUFNO0lBQ2YsaUJBQWdCO0lBRVYsY0FBYyxDQUFDLE9BQWUsRUFBRSxNQUFXOztZQUM3QyxPQUFPLElBQUcsTUFBTUMsV0FBZSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUU7Z0JBQzdDLE9BQU8sRUFBRSxJQUFJO2dCQUNiLEtBQUssRUFBRTtvQkFDSCxJQUFJLEVBQUUsR0FBRztvQkFDVCxXQUFXLEVBQUUsR0FBRztvQkFDaEIsR0FBRyxFQUFFLEVBQUU7aUJBQ1Y7Z0JBQ0QsUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsV0FBVyxFQUFFLElBQUk7YUFDcEIsQ0FBVyxDQUFBLENBQUM7WUFFYixPQUFPLE9BQU8sQ0FBQztTQUNsQjtLQUFBOzs7QUNSTCxJQUFZLE9BT1g7QUFQRCxXQUFZLE9BQU87SUFDZix1RUFBcUIsQ0FBQTtJQUNyQiw2REFBZ0IsQ0FBQTtJQUNoQix1REFBYSxDQUFBO0lBQ2IsbUVBQW1CLENBQUE7SUFDbkIsNkRBQWdCLENBQUE7SUFDaEIsMkRBQWUsQ0FBQTtBQUNuQixDQUFDLEVBUFcsT0FBTyxLQUFQLE9BQU8sUUFPbEI7TUFTWSxTQUFTO0lBTWxCLFlBQW9CLEdBQVEsRUFBVSxNQUF1QjtRQUF6QyxRQUFHLEdBQUgsR0FBRyxDQUFLO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBaUI7UUFDL0QsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekUsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7S0FDOUI7SUFFSyxLQUFLOztZQUNiLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNwQixNQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUM1QyxJQUFJLENBQUMsTUFBTSxDQUFDLDZCQUE2QixDQUFDLENBQUMsRUFBRSxFQUFFLEdBQUcsS0FBSyxJQUFJLENBQUMseUJBQXlCLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDN0Y7S0FBQTtJQUVELHFCQUFxQixDQUFDLGFBQW9CLEVBQUUsV0FBa0IsRUFBRSxRQUFpQjtRQUM5RSxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUV0RCxPQUFPO1lBQ0gsYUFBYSxFQUFFLGFBQWE7WUFDNUIsV0FBVyxFQUFFLFdBQVc7WUFDeEIsUUFBUSxFQUFFLFFBQVE7WUFDbEIsV0FBVyxFQUFFLFdBQVc7U0FDM0IsQ0FBQztLQUNMO0lBRUssdUJBQXVCLENBQUMsTUFBcUI7O1lBQy9DLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3pFLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztTQUN4RDtLQUFBO0lBRUssY0FBYyxDQUFDLE1BQXFCLEVBQUUsZ0JBQXdCOztZQUNoRSxNQUFNLGdCQUFnQixHQUFHLE1BQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzdHLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxnQkFBZ0IsQ0FBQztZQUNqRCxNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFDckYsT0FBTyxPQUFPLENBQUM7U0FDbEI7S0FBQTtJQUVLLDZCQUE2QixDQUFDLFFBQXdCLEVBQUUsTUFBZ0IsRUFBRSxRQUFpQixFQUFFLGdCQUF5QixJQUFJOzs7WUFHNUgsSUFBSSxDQUFDLE1BQU0sRUFBRTs7O2dCQUdULE1BQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQ3RFLFFBQVEsaUJBQWlCO29CQUNyQixLQUFLLFNBQVM7d0JBQ1YsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLENBQUM7d0JBQ3ZELElBQUksV0FBVyxFQUFFOzRCQUNiLE1BQU0sR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO3lCQUMvQjt3QkFDRCxNQUFNO29CQUNWLEtBQUssUUFBUTt3QkFDVCxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQ25ELE1BQU07b0JBQ1YsS0FBSyxNQUFNO3dCQUNQLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQzt3QkFDbEMsTUFBTTtpQkFHYjthQUNKOzs7WUFJRCxNQUFNLFlBQVksR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxRQUFRLGFBQVIsUUFBUSxjQUFSLFFBQVEsR0FBSSxVQUFVLENBQUMsQ0FBQztZQUV0RyxJQUFJLGNBQTZCLENBQUM7WUFDbEMsSUFBSSxjQUFzQixDQUFDO1lBQzNCLElBQUksUUFBUSxZQUFZakIsY0FBSyxFQUFFO2dCQUMzQixjQUFjLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7Z0JBQ25HLGNBQWMsR0FBRyxNQUFNLFlBQVksQ0FBQyxxREFBWSxPQUFBLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxjQUFjLENBQUMsQ0FBQSxHQUFBLEVBQUUsbUNBQW1DLENBQUMsQ0FBQzthQUN0STtpQkFBTTtnQkFDSCxjQUFjLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7Z0JBQ3BHLGNBQWMsR0FBRyxNQUFNLFlBQVksQ0FBQyxxREFBWSxPQUFBLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxFQUFFLFFBQVEsQ0FBQyxDQUFBLEdBQUEsRUFBRSxtQ0FBbUMsQ0FBQyxDQUFDO2FBQ3ZJO1lBRUQsSUFBSSxjQUFjLElBQUksSUFBSSxFQUFFO2dCQUN4QixNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDMUMsT0FBTzthQUNWO1lBRUQsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBRTFELElBQUksYUFBYSxFQUFFO2dCQUNmLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztnQkFDbEQsSUFBSSxDQUFDLFdBQVcsRUFBRTtvQkFDZCxTQUFTLENBQUMsSUFBSSxjQUFjLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO29CQUNoRCxPQUFPO2lCQUNWO2dCQUNELE1BQU0sV0FBVyxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsRUFBQyxLQUFLLEVBQUUsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxFQUFDLENBQUMsQ0FBQztnQkFDN0YsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLDRCQUE0QixFQUFFLENBQUM7YUFDcEQ7WUFFRCxPQUFPLFlBQVksQ0FBQztTQUN2QjtLQUFBO0lBRUssOEJBQThCLENBQUMsYUFBb0I7O1lBQ3JELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDSyxxQkFBWSxDQUFDLENBQUM7WUFDekUsSUFBSSxXQUFXLEtBQUssSUFBSSxFQUFFO2dCQUN0QixTQUFTLENBQUMsSUFBSSxjQUFjLENBQUMseUNBQXlDLENBQUMsQ0FBQyxDQUFDO2dCQUN6RSxPQUFPO2FBQ1Y7WUFDRCxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsYUFBYSxFQUFFLFdBQVcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDN0csTUFBTSxjQUFjLEdBQUcsTUFBTSxZQUFZLENBQUMscURBQVksT0FBQSxJQUFJLENBQUMsdUJBQXVCLENBQUMsY0FBYyxDQUFDLENBQUEsR0FBQSxFQUFFLG1DQUFtQyxDQUFDLENBQUM7O1lBRXpJLElBQUksY0FBYyxJQUFJLElBQUksRUFBRTtnQkFDeEIsT0FBTzthQUNWO1lBRUQsTUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQztZQUNsQyxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDNUIsR0FBRyxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxDQUFDOztZQUdyQyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsNEJBQTRCLEVBQUUsQ0FBQztTQUNwRDtLQUFBO0lBRUssc0JBQXNCLENBQUMsYUFBb0IsRUFBRSxJQUFXOztZQUMxRCxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsYUFBYSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDOUYsTUFBTSxjQUFjLEdBQUcsTUFBTSxZQUFZLENBQUMscURBQVksT0FBQSxJQUFJLENBQUMsdUJBQXVCLENBQUMsY0FBYyxDQUFDLENBQUEsR0FBQSxFQUFFLG1DQUFtQyxDQUFDLENBQUM7O1lBRXpJLElBQUksY0FBYyxJQUFJLElBQUksRUFBRTtnQkFDeEIsT0FBTzthQUNWO1lBQ0QsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1NBQ3JEO0tBQUE7SUFFRCw4QkFBOEI7UUFDMUIsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUNBLHFCQUFZLENBQUMsQ0FBQztRQUN6RSxJQUFJLFdBQVcsS0FBSyxJQUFJLEVBQUU7WUFDL0IsU0FBUyxDQUFDLElBQUksY0FBYyxDQUFDLDhDQUE4QyxDQUFDLENBQUMsQ0FBQztZQUNyRSxPQUFPO1NBQ1Y7UUFDRCxJQUFJLENBQUMsdUJBQXVCLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztLQUMzRDtJQUVRLHVCQUF1QixDQUFDLElBQVcsRUFBRSxjQUF1QixLQUFLOztZQUNuRSxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxXQUFXLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNqSSxNQUFNLGNBQWMsR0FBRyxNQUFNLFlBQVksQ0FBQyxxREFBWSxPQUFBLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxjQUFjLENBQUMsQ0FBQSxHQUFBLEVBQUUsbUNBQW1DLENBQUMsQ0FBQzs7WUFFekksSUFBSSxjQUFjLElBQUksSUFBSSxFQUFFO2dCQUN4QixPQUFPO2FBQ1Y7WUFDRCxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUM7O1lBRWxELElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLEtBQUssSUFBSSxFQUFFO2dCQUM3QyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsNEJBQTRCLEVBQUUsQ0FBQzthQUNwRDtTQUNKO0tBQUE7SUFFSyx5QkFBeUIsQ0FBQyxFQUFlLEVBQUUsR0FBaUM7O1lBQzlFLE1BQU0scUJBQXFCLEdBQVcsMkNBQTJDLENBQUM7WUFFbEYsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsRUFBRSxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDckUsSUFBSSxJQUFJLENBQUM7WUFDVCxJQUFJLElBQUksR0FBRyxLQUFLLENBQUM7WUFDakIsSUFBSSxnQkFBb0IsQ0FBQztZQUN6QixRQUFRLElBQUksR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLEdBQUc7Z0JBQy9CLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQzdCLElBQUksS0FBSyxDQUFDO2dCQUNWLElBQUksQ0FBQyxLQUFLLEdBQUcscUJBQXFCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLElBQUksRUFBRTtvQkFDdkQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDN0UsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFLElBQUksWUFBWUwsY0FBSyxDQUFDLEVBQUU7d0JBQ25DLE9BQU87cUJBQ1Y7b0JBQ0QsSUFBSSxDQUFDLElBQUksRUFBRTt3QkFDUCxJQUFJLEdBQUcsSUFBSSxDQUFDO3dCQUNaLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO3dCQUNoRixnQkFBZ0IsR0FBRyxNQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQzt3QkFDdkcsSUFBSSxDQUFDLHdCQUF3QixHQUFHLGdCQUFnQixDQUFDO3FCQUNwRDtvQkFFRCxPQUFPLEtBQUssSUFBSSxJQUFJLEVBQUU7O3dCQUVsQixNQUFNLGdCQUFnQixHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzdDLE1BQU0sY0FBYyxHQUFXLE1BQU0sWUFBWSxDQUFDOzRCQUM5QyxPQUFPLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQzt5QkFDL0UsQ0FBQSxFQUFFLDZDQUE2QyxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7d0JBQ3JFLElBQUksY0FBYyxJQUFJLElBQUksRUFBRTs0QkFDeEIsT0FBTzt5QkFDVjt3QkFDRCxJQUFJLEtBQUssR0FBRyxxQkFBcUIsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQzt3QkFDOUQsSUFBSSxHQUFHLEdBQUcscUJBQXFCLENBQUMsU0FBUyxDQUFDO3dCQUMxQyxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsY0FBYyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBRWhGLHFCQUFxQixDQUFDLFNBQVMsS0FBSyxjQUFjLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDN0UsS0FBSyxHQUFHLHFCQUFxQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztxQkFDL0M7b0JBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7aUJBQzVCO2FBQ0o7U0FDUDtLQUFBO0lBRUUsT0FBYSxnQkFBZ0IsQ0FBQyxTQUFvQixFQUFFLElBQW1COztZQUNuRSxJQUFJLEVBQUUsSUFBSSxZQUFZQSxjQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLElBQUksRUFBRTtnQkFDckQsT0FBTzthQUNWOztZQUdELE1BQU0sZUFBZSxHQUFHRCxzQkFBYSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDbEYsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxlQUFlLEtBQUssR0FBRyxFQUFFO2dCQUNoRSxPQUFPO2FBQ1Y7Ozs7WUFLRCxNQUFNLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUVqQixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtnQkFDdEUsTUFBTSxhQUFhLEdBQVUsTUFBTSxZQUFZLENBQUM7b0JBQzVDLE9BQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDLENBQUM7aUJBQzlGLENBQUEsRUFBRSxxQ0FBcUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDOztnQkFFekYsSUFBSSxhQUFhLElBQUksSUFBSSxFQUFFO29CQUN2QixPQUFPO2lCQUNWO2dCQUNELE1BQU0sU0FBUyxDQUFDLHNCQUFzQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQzthQUMvRDtpQkFBTTtnQkFDSCxNQUFNLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNqRDtTQUNKO0tBQUE7SUFFSyx1QkFBdUI7O1lBQ3pCLEtBQUssTUFBTSxRQUFRLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsaUJBQWlCLEVBQUU7Z0JBQzNELElBQUksUUFBUSxLQUFLLEVBQUUsRUFBRTtvQkFDakIsU0FBUztpQkFDWjtnQkFDRCxNQUFNLElBQUksR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxFQUFFLG1DQUFtQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO2dCQUN2SCxJQUFJLENBQUMsSUFBSSxFQUFFO29CQUNQLFNBQVM7aUJBQ1o7Z0JBQ0QsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dCQUN2RixNQUFNLFlBQVksQ0FBQyxxREFBWSxPQUFBLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxjQUFjLENBQUMsQ0FBQSxHQUFBLEVBQUUsMkNBQTJDLENBQUMsQ0FBQzthQUM3SDtTQUNKO0tBQUE7OztNQ3BRZ0IsWUFBWTtJQUk3QixZQUFvQixHQUFRLEVBQVUsTUFBdUIsRUFBVSxTQUFvQixFQUFVLFFBQWtCO1FBQW5HLFFBQUcsR0FBSCxHQUFHLENBQUs7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFpQjtRQUFVLGNBQVMsR0FBVCxTQUFTLENBQVc7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFVO0tBQUk7SUFFM0gsS0FBSztRQUNQLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQztZQUNoQyxJQUFJLENBQUMsK0JBQStCLEVBQUUsQ0FBQztTQUN2QyxDQUFDLENBQUM7UUFDRyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztRQUNsQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztLQUMzQjtJQUVKLDBCQUEwQjtRQUN6QixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLG1CQUFtQixFQUFFO1lBQzdDLElBQUksQ0FBQyx5QkFBeUIsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLEVBQUU7Z0JBQ3RFLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO2FBQ2xDLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLEVBQUU7Z0JBQ3ZDLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO2FBQ2xDLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1NBQzFEO2FBQU07WUFDTixJQUFJLElBQUksQ0FBQyx5QkFBeUIsRUFBRTtnQkFDbkMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO2FBQ3REO1lBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsRUFBRTtnQkFDdkMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7YUFDaEMsQ0FBQyxDQUFDO1NBQ0g7S0FDRDtJQUVELCtCQUErQjtRQUM5QixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsd0JBQXdCLEVBQUU7WUFDM0MsSUFBSSxDQUFDLDhCQUE4QixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFtQixLQUFLLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDN0ksSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLDhCQUE4QixDQUFDLENBQUM7U0FDL0Q7YUFBTTtZQUNOLElBQUksSUFBSSxDQUFDLDhCQUE4QixFQUFFO2dCQUN4QyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLDhCQUE4QixDQUFDLENBQUM7Z0JBQzNELElBQUksQ0FBQyw4QkFBOEIsR0FBRyxTQUFTLENBQUM7YUFDaEQ7U0FDRDtLQUNEO0lBRUUsZ0JBQWdCO1FBQ2xCLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUN4QixJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBVSxFQUFFLElBQVc7WUFDMUQsSUFBSSxJQUFJLFlBQVlELGdCQUFPLEVBQUU7Z0JBQzVCLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFjO29CQUMzQixJQUFJLENBQUMsUUFBUSxDQUFDLCtCQUErQixDQUFDO3lCQUM1QyxPQUFPLENBQUMsZ0JBQWdCLENBQUM7eUJBQ3pCLE9BQU8sQ0FBQyxDQUFDO3dCQUNULElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLDZCQUE2QixDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUNoRSxDQUFDLENBQUE7aUJBQ0gsQ0FBQyxDQUFDO2FBQ0g7U0FDRCxDQUFDLENBQ0YsQ0FBQztLQUNDOzs7TUMxRFEsY0FBYztJQUN2QixZQUFvQixHQUFRLEVBQVUsTUFBdUI7UUFBekMsUUFBRyxHQUFILEdBQUcsQ0FBSztRQUFVLFdBQU0sR0FBTixNQUFNLENBQWlCO0tBQUk7SUFFakUsS0FBSztRQUNQLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO1lBQ3RCLEVBQUUsRUFBRSxrQkFBa0I7WUFDdEIsSUFBSSxFQUFFLDRCQUE0QjtZQUNsQyxPQUFPLEVBQUU7Z0JBQ1I7b0JBQ0MsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO29CQUNsQixHQUFHLEVBQUUsR0FBRztpQkFDUjthQUNEO1lBQ0QsUUFBUSxFQUFFO2dCQUNULElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLGVBQWUsRUFBRSxDQUFDO2FBQzlDO1NBQ0QsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDYixFQUFFLEVBQUUsMkJBQTJCO1lBQy9CLElBQUksRUFBRSxzQ0FBc0M7WUFDNUMsT0FBTyxFQUFFO2dCQUNMO29CQUNJLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztvQkFDbEIsR0FBRyxFQUFFLEdBQUc7aUJBQ1g7YUFDSjtZQUNELFFBQVEsRUFBRTtnQkFDbEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsOEJBQThCLEVBQUUsQ0FBQzthQUM5QztTQUNKLENBQUMsQ0FBQztRQUVULElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO1lBQ3RCLEVBQUUsRUFBRSw4QkFBOEI7WUFDbEMsSUFBSSxFQUFFLDhCQUE4QjtZQUNwQyxPQUFPLEVBQUU7Z0JBQ1I7b0JBQ0MsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO29CQUNsQixHQUFHLEVBQUUsS0FBSztpQkFDVjthQUNEO1lBQ0QsUUFBUSxFQUFFO2dCQUNULElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyw0QkFBNEIsRUFBRSxDQUFDO2FBQzVEO1NBQ0QsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDdEIsRUFBRSxFQUFFLCtCQUErQjtZQUNuQyxJQUFJLEVBQUUsK0JBQStCO1lBQ3JDLE9BQU8sRUFBRTtnQkFDUjtvQkFDQyxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7b0JBQ2xCLEdBQUcsRUFBRSxHQUFHO2lCQUNSO2FBQ0Q7WUFDRCxRQUFRLEVBQUU7Z0JBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsNkJBQTZCLEVBQUUsQ0FBQzthQUM1RDtTQUNELENBQUMsQ0FBQztRQUVHLElBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDO0tBQ3JDO0lBRUQsMEJBQTBCO1FBQ3RCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLHlCQUF5QixDQUFDLE9BQU8sQ0FBQyxRQUFRO1lBQzNELElBQUksUUFBUSxLQUFLLEVBQUUsRUFBRTtnQkFDakIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQzthQUMxQztTQUNKLENBQUMsQ0FBQztLQUNOO0lBRUQsbUJBQW1CLENBQUMsWUFBb0IsRUFBRSxZQUFvQjtRQUMxRCxJQUFJLENBQUMsc0JBQXNCLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFMUMsSUFBSSxZQUFZLEtBQUssRUFBRSxFQUFFO1lBQ3JCLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO2dCQUNuQixFQUFFLEVBQUUsWUFBWTtnQkFDaEIsSUFBSSxFQUFFLFVBQVUsWUFBWSxFQUFFO2dCQUM5QixRQUFRLEVBQUU7b0JBQ04sTUFBTSxRQUFRLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxZQUFZLENBQUMsRUFBRSw2REFBNkQsQ0FBQyxDQUFDO29CQUM5SSxJQUFJLENBQUMsUUFBUSxFQUFFO3dCQUNYLE9BQU87cUJBQ1Y7b0JBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsOEJBQThCLENBQUMsUUFBUSxDQUFDLENBQUM7aUJBQ2xFO2FBQ0osQ0FBQyxDQUFDO1NBQ047S0FDSjtJQUVELHNCQUFzQixDQUFDLFFBQWdCO1FBQ25DLElBQUksUUFBUSxLQUFLLEVBQUUsRUFBRTs7O1lBR2pCLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1NBQzdFO0tBQ0o7OztNQzVGZ0IsZUFBZ0IsU0FBUW9CLGVBQU07SUFPNUMsTUFBTTs7WUFDWCxNQUFNLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUUzQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDL0MsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRTdCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUVwRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3JGLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7WUFFM0IsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzFELElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLENBQUM7WUFHbkNDLGdCQUFPLENBQUMsZ0JBQWdCLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDckMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsRUFBRSxXQUFXLEVBQUU7Z0JBQ2pELElBQUksQ0FBQyxlQUFlLENBQUMsZUFBZSxFQUFFLENBQUM7YUFDdkMsQ0FBQSxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksbUJBQW1CLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDOztZQUd0RCxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUM7Z0JBQzdCLElBQUksQ0FBQyxTQUFTLENBQUMsdUJBQXVCLEVBQUUsQ0FBQzthQUM1QyxDQUFDLENBQUM7U0FDVDtLQUFBO0lBRUssYUFBYTs7WUFDbEIsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNuQztLQUFBO0lBRUssYUFBYTs7WUFDbEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1NBQzNFO0tBQUE7Ozs7OyJ9
