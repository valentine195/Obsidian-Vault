'use strict';

var obsidian_module = require('obsidian');
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
                    get: function () {
                        return e[k];
                    }
                });
            }
        });
    }
    n['default'] = e;
    return Object.freeze(n);
}

var obsidian_module__namespace = /*#__PURE__*/_interopNamespace(obsidian_module);
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
    const notice = new obsidian_module.Notice("", 8000);
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

// import { isHTMLElement } from './instanceOf';
function getBoundingClientRect(element, // eslint-disable-next-line unused-imports/no-unused-vars
includeScale) {

  var rect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1; // FIXME:
  // `offsetWidth` returns an integer while `getBoundingClientRect`
  // returns a float. This results in `scaleX` or `scaleY` being
  // non-1 when it should be for elements that aren't a full pixel in
  // width or height.
  // if (isHTMLElement(element) && includeScale) {
  //   const offsetHeight = element.offsetHeight;
  //   const offsetWidth = element.offsetWidth;
  //   // Do not attempt to divide by 0, otherwise we get `Infinity` as scale
  //   // Fallback to 1 in case both values are `0`
  //   if (offsetWidth > 0) {
  //     scaleX = rect.width / offsetWidth || 1;
  //   }
  //   if (offsetHeight > 0) {
  //     scaleY = rect.height / offsetHeight || 1;
  //   }
  // }

  return {
    width: rect.width / scaleX,
    height: rect.height / scaleY,
    top: rect.top / scaleY,
    right: rect.right / scaleX,
    bottom: rect.bottom / scaleY,
    left: rect.left / scaleX,
    x: rect.left / scaleX,
    y: rect.top / scaleY
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
  isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement);
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
      offsets = getBoundingClientRect(offsetParent);
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
        this.scope = new obsidian_module.Scope();
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
            if (folder instanceof obsidian_module.TFolder &&
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

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function escape_RegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
function resolve_tfolder(app, folder_str) {
    folder_str = obsidian_module.normalizePath(folder_str);
    const folder = app.vault.getAbstractFileByPath(folder_str);
    if (!folder) {
        throw new TemplaterError(`Folder "${folder_str}" doesn't exist`);
    }
    if (!(folder instanceof obsidian_module.TFolder)) {
        throw new TemplaterError(`${folder_str} is a file, not a folder`);
    }
    return folder;
}
function resolve_tfile(app, file_str) {
    file_str = obsidian_module.normalizePath(file_str);
    const file = app.vault.getAbstractFileByPath(file_str);
    if (!file) {
        throw new TemplaterError(`File "${file_str}" doesn't exist`);
    }
    if (!(file instanceof obsidian_module.TFile)) {
        throw new TemplaterError(`${file_str} is a folder, not a file`);
    }
    return file;
}
function get_tfiles_from_folder(app, folder_str) {
    const folder = resolve_tfolder(app, folder_str);
    const files = [];
    obsidian_module.Vault.recurseChildren(folder, (file) => {
        if (file instanceof obsidian_module.TFile) {
            files.push(file);
        }
    });
    files.sort((a, b) => {
        return a.basename.localeCompare(b.basename);
    });
    return files;
}
function arraymove(arr, fromIndex, toIndex) {
    if (toIndex < 0 || toIndex === arr.length) {
        return;
    }
    const element = arr[fromIndex];
    arr[fromIndex] = arr[toIndex];
    arr[toIndex] = element;
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
            if (file instanceof obsidian_module.TFile &&
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
    user_scripts_folder: "",
    enable_folder_templates: true,
    folder_templates: [{ folder: "", template: "" }],
    syntax_highlighting: true,
    enabled_templates_hotkeys: [""],
    startup_templates: [""],
};
class TemplaterSettingTab extends obsidian_module.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.app = app;
        this.plugin = plugin;
    }
    display() {
        this.containerEl.empty();
        this.add_general_setting_header();
        this.add_template_folder_setting();
        this.add_internal_functions_setting();
        this.add_syntax_highlighting_setting();
        this.add_trigger_on_new_file_creation_setting();
        this.add_templates_hotkeys_setting();
        if (this.plugin.settings.trigger_on_file_creation) {
            this.add_folder_templates_setting();
        }
        this.add_startup_templates_setting();
        this.add_user_script_functions_setting();
        this.add_user_system_command_functions_setting();
    }
    add_general_setting_header() {
        this.containerEl.createEl("h2", { text: "General Settings" });
    }
    add_template_folder_setting() {
        new obsidian_module.Setting(this.containerEl)
            .setName("Template folder location")
            .setDesc("Files in this folder will be available as templates.")
            .addSearch((cb) => {
            new FolderSuggest(this.app, cb.inputEl);
            cb.setPlaceholder("Example: folder1/folder2")
                .setValue(this.plugin.settings.templates_folder)
                .onChange((new_folder) => {
                this.plugin.settings.templates_folder = new_folder;
                this.plugin.save_settings();
            });
            // @ts-ignore
            cb.containerEl.addClass("templater_search");
        });
    }
    add_internal_functions_setting() {
        const desc = document.createDocumentFragment();
        desc.append("Templater provides multiples predefined variables / functions that you can use.", desc.createEl("br"), "Check the ", desc.createEl("a", {
            href: "https://silentvoid13.github.io/Templater/",
            text: "documentation",
        }), " to get a list of all the available internal variables / functions.");
        new obsidian_module.Setting(this.containerEl)
            .setName("Internal Variables and Functions")
            .setDesc(desc);
    }
    add_syntax_highlighting_setting() {
        const desc = document.createDocumentFragment();
        desc.append("Adds syntax highlighting for Templater commands in edit mode.");
        new obsidian_module.Setting(this.containerEl)
            .setName("Syntax Highlighting")
            .setDesc(desc)
            .addToggle((toggle) => {
            toggle
                .setValue(this.plugin.settings.syntax_highlighting)
                .onChange((syntax_highlighting) => {
                this.plugin.settings.syntax_highlighting =
                    syntax_highlighting;
                this.plugin.save_settings();
                this.plugin.event_handler.update_syntax_highlighting();
            });
        });
    }
    add_trigger_on_new_file_creation_setting() {
        const desc = document.createDocumentFragment();
        desc.append("Templater will listen for the new file creation event, and replace every command it finds in the new file's content.", desc.createEl("br"), "This makes Templater compatible with other plugins like the Daily note core plugin, Calendar plugin, Review plugin, Note refactor plugin, ...", desc.createEl("br"), desc.createEl("b", {
            text: "Warning: ",
        }), "This can be dangerous if you create new files with unknown / unsafe content on creation. Make sure that every new file's content is safe on creation.");
        new obsidian_module.Setting(this.containerEl)
            .setName("Trigger Templater on new file creation")
            .setDesc(desc)
            .addToggle((toggle) => {
            toggle
                .setValue(this.plugin.settings.trigger_on_file_creation)
                .onChange((trigger_on_file_creation) => {
                this.plugin.settings.trigger_on_file_creation =
                    trigger_on_file_creation;
                this.plugin.save_settings();
                this.plugin.event_handler.update_trigger_file_on_creation();
                // Force refresh
                this.display();
            });
        });
    }
    add_templates_hotkeys_setting() {
        this.containerEl.createEl("h2", { text: "Template Hotkeys" });
        const desc = document.createDocumentFragment();
        desc.append("Template Hotkeys allows you to bind a template to a hotkey.");
        new obsidian_module.Setting(this.containerEl).setDesc(desc);
        this.plugin.settings.enabled_templates_hotkeys.forEach((template, index) => {
            const s = new obsidian_module.Setting(this.containerEl)
                .addSearch((cb) => {
                new FileSuggest(this.app, cb.inputEl, this.plugin, FileSuggestMode.TemplateFiles);
                cb.setPlaceholder("Example: folder1/template_file")
                    .setValue(template)
                    .onChange((new_template) => {
                    if (new_template &&
                        this.plugin.settings.enabled_templates_hotkeys.contains(new_template)) {
                        log_error(new TemplaterError("This template is already bound to a hotkey"));
                        return;
                    }
                    this.plugin.command_handler.add_template_hotkey(this.plugin.settings
                        .enabled_templates_hotkeys[index], new_template);
                    this.plugin.settings.enabled_templates_hotkeys[index] = new_template;
                    this.plugin.save_settings();
                });
                // @ts-ignore
                cb.containerEl.addClass("templater_search");
            })
                .addExtraButton((cb) => {
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
                .addExtraButton((cb) => {
                cb.setIcon("up-chevron-glyph")
                    .setTooltip("Move up")
                    .onClick(() => {
                    arraymove(this.plugin.settings
                        .enabled_templates_hotkeys, index, index - 1);
                    this.plugin.save_settings();
                    this.display();
                });
            })
                .addExtraButton((cb) => {
                cb.setIcon("down-chevron-glyph")
                    .setTooltip("Move down")
                    .onClick(() => {
                    arraymove(this.plugin.settings
                        .enabled_templates_hotkeys, index, index + 1);
                    this.plugin.save_settings();
                    this.display();
                });
            })
                .addExtraButton((cb) => {
                cb.setIcon("cross")
                    .setTooltip("Delete")
                    .onClick(() => {
                    this.plugin.command_handler.remove_template_hotkey(this.plugin.settings
                        .enabled_templates_hotkeys[index]);
                    this.plugin.settings.enabled_templates_hotkeys.splice(index, 1);
                    this.plugin.save_settings();
                    // Force refresh
                    this.display();
                });
            });
            s.infoEl.remove();
        });
        new obsidian_module.Setting(this.containerEl).addButton((cb) => {
            cb.setButtonText("Add new hotkey for template")
                .setCta()
                .onClick(() => {
                this.plugin.settings.enabled_templates_hotkeys.push("");
                this.plugin.save_settings();
                // Force refresh
                this.display();
            });
        });
    }
    add_folder_templates_setting() {
        this.containerEl.createEl("h2", { text: "Folder Templates" });
        const descHeading = document.createDocumentFragment();
        descHeading.append("Folder Templates are triggered when a new ", descHeading.createEl("strong", { text: "empty " }), "file is created in a given folder.", descHeading.createEl("br"), "Templater will fill the empty file with the specified template.", descHeading.createEl("br"), "The deepest match is used. A global default template would be defined on the root ", descHeading.createEl("code", { text: "/" }), ".");
        new obsidian_module.Setting(this.containerEl).setDesc(descHeading);
        const descUseNewFileTemplate = document.createDocumentFragment();
        descUseNewFileTemplate.append("When enabled Templater will make use of the folder templates defined below.");
        new obsidian_module.Setting(this.containerEl)
            .setName("Enable Folder Templates")
            .setDesc(descUseNewFileTemplate)
            .addToggle((toggle) => {
            toggle
                .setValue(this.plugin.settings.enable_folder_templates)
                .onChange((use_new_file_templates) => {
                this.plugin.settings.enable_folder_templates =
                    use_new_file_templates;
                this.plugin.save_settings();
                // Force refresh
                this.display();
            });
        });
        if (!this.plugin.settings.enable_folder_templates) {
            return;
        }
        new obsidian_module.Setting(this.containerEl)
            .setName("Add New")
            .setDesc("Add new folder template")
            .addButton((button) => {
            button
                .setTooltip("Add additional folder template")
                .setButtonText("+")
                .setCta()
                .onClick(() => {
                this.plugin.settings.folder_templates.push({
                    folder: "",
                    template: "",
                });
                this.plugin.save_settings();
                this.display();
            });
        });
        this.plugin.settings.folder_templates.forEach((folder_template, index) => {
            const s = new obsidian_module.Setting(this.containerEl)
                .addSearch((cb) => {
                new FolderSuggest(this.app, cb.inputEl);
                cb.setPlaceholder("Folder")
                    .setValue(folder_template.folder)
                    .onChange((new_folder) => {
                    if (new_folder &&
                        this.plugin.settings.folder_templates.some((e) => e.folder == new_folder)) {
                        log_error(new TemplaterError("This folder already has a template associated with it"));
                        return;
                    }
                    this.plugin.settings.folder_templates[index].folder = new_folder;
                    this.plugin.save_settings();
                });
                // @ts-ignore
                cb.containerEl.addClass("templater_search");
            })
                .addSearch((cb) => {
                new FileSuggest(this.app, cb.inputEl, this.plugin, FileSuggestMode.TemplateFiles);
                cb.setPlaceholder("Template")
                    .setValue(folder_template.template)
                    .onChange((new_template) => {
                    this.plugin.settings.folder_templates[index].template = new_template;
                    this.plugin.save_settings();
                });
                // @ts-ignore
                cb.containerEl.addClass("templater_search");
            })
                .addExtraButton((cb) => {
                cb.setIcon("up-chevron-glyph")
                    .setTooltip("Move up")
                    .onClick(() => {
                    arraymove(this.plugin.settings.folder_templates, index, index - 1);
                    this.plugin.save_settings();
                    this.display();
                });
            })
                .addExtraButton((cb) => {
                cb.setIcon("down-chevron-glyph")
                    .setTooltip("Move down")
                    .onClick(() => {
                    arraymove(this.plugin.settings.folder_templates, index, index + 1);
                    this.plugin.save_settings();
                    this.display();
                });
            })
                .addExtraButton((cb) => {
                cb.setIcon("cross")
                    .setTooltip("Delete")
                    .onClick(() => {
                    this.plugin.settings.folder_templates.splice(index, 1);
                    this.plugin.save_settings();
                    this.display();
                });
            });
            s.infoEl.remove();
        });
    }
    add_startup_templates_setting() {
        this.containerEl.createEl("h2", { text: "Startup Templates" });
        const desc = document.createDocumentFragment();
        desc.append("Startup Templates are templates that will get executed once when Templater starts.", desc.createEl("br"), "These templates won't output anything.", desc.createEl("br"), "This can be useful to set up templates adding hooks to obsidian events for example.");
        new obsidian_module.Setting(this.containerEl).setDesc(desc);
        this.plugin.settings.startup_templates.forEach((template, index) => {
            const s = new obsidian_module.Setting(this.containerEl)
                .addSearch((cb) => {
                new FileSuggest(this.app, cb.inputEl, this.plugin, FileSuggestMode.TemplateFiles);
                cb.setPlaceholder("Example: folder1/template_file")
                    .setValue(template)
                    .onChange((new_template) => {
                    if (new_template &&
                        this.plugin.settings.startup_templates.contains(new_template)) {
                        log_error(new TemplaterError("This startup template already exist"));
                        return;
                    }
                    this.plugin.settings.startup_templates[index] =
                        new_template;
                    this.plugin.save_settings();
                });
                // @ts-ignore
                cb.containerEl.addClass("templater_search");
            })
                .addExtraButton((cb) => {
                cb.setIcon("cross")
                    .setTooltip("Delete")
                    .onClick(() => {
                    this.plugin.settings.startup_templates.splice(index, 1);
                    this.plugin.save_settings();
                    // Force refresh
                    this.display();
                });
            });
            s.infoEl.remove();
        });
        new obsidian_module.Setting(this.containerEl).addButton((cb) => {
            cb.setButtonText("Add new startup template")
                .setCta()
                .onClick(() => {
                this.plugin.settings.startup_templates.push("");
                this.plugin.save_settings();
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
        new obsidian_module.Setting(this.containerEl)
            .setName("Script files folder location")
            .setDesc(desc)
            .addSearch((cb) => {
            new FolderSuggest(this.app, cb.inputEl);
            cb.setPlaceholder("Example: folder1/folder2")
                .setValue(this.plugin.settings.user_scripts_folder)
                .onChange((new_folder) => {
                this.plugin.settings.user_scripts_folder = new_folder;
                this.plugin.save_settings();
            });
            // @ts-ignore
            cb.containerEl.addClass("templater_search");
        });
        desc = document.createDocumentFragment();
        let name;
        if (!this.plugin.settings.user_scripts_folder) {
            name = "No User Scripts folder set";
        }
        else {
            const files = errorWrapperSync(() => get_tfiles_from_folder(this.app, this.plugin.settings.user_scripts_folder), `User Scripts folder doesn't exist`);
            if (!files || files.length === 0) {
                name = "No User Scripts detected";
            }
            else {
                let count = 0;
                for (const file of files) {
                    if (file.extension === "js") {
                        count++;
                        desc.append(desc.createEl("li", {
                            text: `tp.user.${file.basename}`,
                        }));
                    }
                }
                name = `Detected ${count} User Script(s)`;
            }
        }
        new obsidian_module.Setting(this.containerEl)
            .setName(name)
            .setDesc(desc)
            .addExtraButton((extra) => {
            extra
                .setIcon("sync")
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
            text: "Warning: ",
        }), "It can be dangerous to execute arbitrary system commands from untrusted sources. Only run system commands that you understand, from trusted sources.");
        this.containerEl.createEl("h2", {
            text: "User System Command Functions",
        });
        new obsidian_module.Setting(this.containerEl)
            .setName("Enable User System Command Functions")
            .setDesc(desc)
            .addToggle((toggle) => {
            toggle
                .setValue(this.plugin.settings.enable_system_commands)
                .onChange((enable_system_commands) => {
                this.plugin.settings.enable_system_commands =
                    enable_system_commands;
                this.plugin.save_settings();
                // Force refresh
                this.display();
            });
        });
        if (this.plugin.settings.enable_system_commands) {
            new obsidian_module.Setting(this.containerEl)
                .setName("Timeout")
                .setDesc("Maximum timeout in seconds for a system command.")
                .addText((text) => {
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
            new obsidian_module.Setting(this.containerEl)
                .setName("Shell binary location")
                .setDesc(desc)
                .addText((text) => {
                text.setPlaceholder("Example: /bin/bash, ...")
                    .setValue(this.plugin.settings.shell_path)
                    .onChange((shell_path) => {
                    this.plugin.settings.shell_path = shell_path;
                    this.plugin.save_settings();
                });
            });
            let i = 1;
            this.plugin.settings.templates_pairs.forEach((template_pair) => {
                const div = this.containerEl.createEl("div");
                div.addClass("templater_div");
                const title = this.containerEl.createEl("h4", {
                    text: "User Function n°" + i,
                });
                title.addClass("templater_title");
                const setting = new obsidian_module.Setting(this.containerEl)
                    .addExtraButton((extra) => {
                    extra
                        .setIcon("cross")
                        .setTooltip("Delete")
                        .onClick(() => {
                        const index = this.plugin.settings.templates_pairs.indexOf(template_pair);
                        if (index > -1) {
                            this.plugin.settings.templates_pairs.splice(index, 1);
                            this.plugin.save_settings();
                            // Force refresh
                            this.display();
                        }
                    });
                })
                    .addText((text) => {
                    const t = text
                        .setPlaceholder("Function name")
                        .setValue(template_pair[0])
                        .onChange((new_value) => {
                        const index = this.plugin.settings.templates_pairs.indexOf(template_pair);
                        if (index > -1) {
                            this.plugin.settings.templates_pairs[index][0] = new_value;
                            this.plugin.save_settings();
                        }
                    });
                    t.inputEl.addClass("templater_template");
                    return t;
                })
                    .addTextArea((text) => {
                    const t = text
                        .setPlaceholder("System Command")
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
            const div = this.containerEl.createEl("div");
            div.addClass("templater_div2");
            const setting = new obsidian_module.Setting(this.containerEl).addButton((button) => {
                button
                    .setButtonText("Add New User Function")
                    .setCta()
                    .onClick(() => {
                    this.plugin.settings.templates_pairs.push(["", ""]);
                    this.plugin.save_settings();
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
class FuzzySuggester extends obsidian_module.FuzzySuggestModal {
    constructor(app, plugin) {
        super(app);
        this.app = app;
        this.plugin = plugin;
        this.setPlaceholder("Type name of a template...");
    }
    getItems() {
        if (!this.plugin.settings.templates_folder) {
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
            if (reference &&
                !window.moment(reference, reference_format).isValid()) {
                throw new TemplaterError("Invalid reference date format, try specifying one with the argument 'reference_format'");
            }
            let duration;
            if (typeof offset === "string") {
                duration = window.moment.duration(offset);
            }
            else if (typeof offset === "number") {
                duration = window.moment.duration(offset, "days");
            }
            return window
                .moment(reference, reference_format)
                .add(duration)
                .format(format);
        };
    }
    generate_tomorrow() {
        return (format = "YYYY-MM-DD") => {
            return window.moment().add(1, "days").format(format);
        };
    }
    generate_weekday() {
        return (format = "YYYY-MM-DD", weekday, reference, reference_format) => {
            if (reference &&
                !window.moment(reference, reference_format).isValid()) {
                throw new TemplaterError("Invalid reference date format, try specifying one with the argument 'reference_format'");
            }
            return window
                .moment(reference, reference_format)
                .weekday(weekday)
                .format(format);
        };
    }
    generate_yesterday() {
        return (format = "YYYY-MM-DD") => {
            return window.moment().add(-1, "days").format(format);
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
            return window
                .moment(this.config.target_file.stat.ctime)
                .format(format);
        };
    }
    generate_cursor() {
        return (order) => {
            // Hack to prevent empty output
            return `<% tp.file.cursor(${order !== null && order !== void 0 ? order : ""}) %>`;
        };
    }
    generate_cursor_append() {
        return (content) => {
            const active_view = this.app.workspace.getActiveViewOfType(obsidian_module.MarkdownView);
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
            const path = obsidian_module.normalizePath(filename);
            return this.app.metadataCache.getFirstLinkpathDest(path, "");
        };
    }
    generate_folder() {
        return (relative = false) => {
            const parent = this.config.target_file.parent;
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
            // TODO: Add mutex for this, this may currently lead to a race condition.
            // While not very impactful, that could still be annoying.
            this.include_depth += 1;
            if (this.include_depth > DEPTH_LIMIT) {
                this.include_depth -= 1;
                throw new TemplaterError("Reached inclusion depth limit (max = 10)");
            }
            let inc_file_content;
            if (include_link instanceof obsidian_module.TFile) {
                inc_file_content = yield this.app.vault.read(include_link);
            }
            else {
                let match;
                if ((match = this.linkpath_regex.exec(include_link)) === null) {
                    this.include_depth -= 1;
                    throw new TemplaterError("Invalid file format, provide an obsidian link between quotes.");
                }
                const { path, subpath } = obsidian_module.parseLinktext(match[1]);
                const inc_file = this.app.metadataCache.getFirstLinkpathDest(path, "");
                if (!inc_file) {
                    this.include_depth -= 1;
                    throw new TemplaterError(`File ${include_link} doesn't exist`);
                }
                inc_file_content = yield this.app.vault.read(inc_file);
                if (subpath) {
                    const cache = this.app.metadataCache.getFileCache(inc_file);
                    if (cache) {
                        const result = obsidian_module.resolveSubpath(cache, subpath);
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
            return window
                .moment(this.config.target_file.stat.mtime)
                .format(format);
        };
    }
    generate_move() {
        return (path) => __awaiter(this, void 0, void 0, function* () {
            const new_path = obsidian_module.normalizePath(`${path}.${this.config.target_file.extension}`);
            yield this.app.fileManager.renameFile(this.config.target_file, new_path);
            return "";
        });
    }
    generate_path() {
        return (relative = false) => {
            // TODO: Add mobile support
            if (obsidian_module.Platform.isMobileApp) {
                return UNSUPPORTED_MOBILE_TEMPLATE;
            }
            if (!(this.app.vault.adapter instanceof obsidian_module.FileSystemAdapter)) {
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
            if (new_title.match(/[\\/:]+/g)) {
                throw new TemplaterError("File name cannot contain any of these characters: \\ / :");
            }
            const new_path = obsidian_module.normalizePath(`${this.config.target_file.parent.path}/${new_title}.${this.config.target_file.extension}`);
            yield this.app.fileManager.renameFile(this.config.target_file, new_path);
            return "";
        });
    }
    generate_selection() {
        return () => {
            const active_view = this.app.workspace.getActiveViewOfType(obsidian_module.MarkdownView);
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
        return obsidian_module.getAllTags(cache);
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
            const response = yield fetch(url);
            if (!response.ok) {
                throw new TemplaterError("Error performing GET request");
            }
            return response;
        });
    }
    generate_daily_quote() {
        return () => __awaiter(this, void 0, void 0, function* () {
            const response = yield this.getRequest("https://quotes.rest/qod");
            const json = yield response.json();
            const author = json.contents.quotes[0].author;
            const quote = json.contents.quotes[0].quote;
            const new_content = `> ${quote}\n> &mdash; <cite>${author}</cite>`;
            return new_content;
        });
    }
    generate_random_picture() {
        return (size, query) => __awaiter(this, void 0, void 0, function* () {
            const response = yield this.getRequest(`https://source.unsplash.com/random/${size !== null && size !== void 0 ? size : ""}?${query !== null && query !== void 0 ? query : ""}`);
            const url = response.url;
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

class PromptModal extends obsidian_module.Modal {
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

class SuggesterModal extends obsidian_module.FuzzySuggestModal {
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
        return (this.text_items[this.items.indexOf(item)] || "Undefined Text Item");
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
            if (obsidian_module.Platform.isMobileApp) {
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
        this.modules_array = [];
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
                internal_functions_object[mod.getName()] =
                    yield mod.generate_object(config);
            }
            return internal_functions_object;
        });
    }
}

class UserSystemFunctions {
    constructor(app, plugin) {
        this.plugin = plugin;
        if (obsidian_module.Platform.isMobileApp ||
            !(app.vault.adapter instanceof obsidian_module.FileSystemAdapter)) {
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
            for (const template_pair of this.plugin.settings.templates_pairs) {
                const template = template_pair[0];
                let cmd = template_pair[1];
                if (!template || !cmd) {
                    continue;
                }
                if (obsidian_module.Platform.isMobileApp) {
                    user_system_functions.set(template, (_user_args) => {
                        return new Promise((resolve) => resolve(UNSUPPORTED_MOBILE_TEMPLATE));
                    });
                }
                else {
                    cmd = yield this.plugin.templater.parser.parse_commands(cmd, internal_functions_object);
                    user_system_functions.set(template, (user_args) => __awaiter(this, void 0, void 0, function* () {
                        const process_env = Object.assign(Object.assign({}, process.env), user_args);
                        const cmd_options = Object.assign({ timeout: this.plugin.settings.command_timeout * 1000, cwd: this.cwd, env: process_env }, (this.plugin.settings.shell_path && {
                            shell: this.plugin.settings.shell_path,
                        }));
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
            const files = errorWrapperSync(() => get_tfiles_from_folder(this.app, this.plugin.settings.user_scripts_folder), `Couldn't find user script folder "${this.plugin.settings.user_scripts_folder}"`);
            if (!files) {
                return new Map();
            }
            for (const file of files) {
                if (file.extension.toLowerCase() === "js") {
                    yield this.load_user_script_function(config, file, user_script_functions);
                }
            }
            return user_script_functions;
        });
    }
    load_user_script_function(config, file, user_script_functions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(this.app.vault.adapter instanceof obsidian_module.FileSystemAdapter)) {
                throw new TemplaterError("app.vault is not a FileSystemAdapter instance");
            }
            const vault_path = this.app.vault.adapter.getBasePath();
            const file_path = `${vault_path}/${file.path}`;
            // https://stackoverflow.com/questions/26633901/reload-module-at-runtime
            // https://stackoverflow.com/questions/1972242/how-to-auto-reload-files-in-node-js
            if (Object.keys(window.require.cache).contains(file_path)) {
                delete window.require.cache[window.require.resolve(file_path)];
            }
            const user_function = yield Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require(file_path)); });
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
                user_system_functions =
                    yield this.user_system_functions.generate_object(config);
            }
            // TODO: Add mobile support
            // user_scripts_folder needs to be explicitly set to '/' to query from root
            if (obsidian_module.Platform.isDesktopApp && this.plugin.settings.user_scripts_folder) {
                user_script_functions =
                    yield this.user_script_functions.generate_object(config);
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
            obsidian: obsidian_module__namespace,
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
                    user_functions_object =
                        yield this.user_functions.generate_object(config);
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
            const active_view = this.app.workspace.getActiveViewOfType(obsidian_module.MarkdownView);
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
        cursor_matches = cursor_matches.filter((m) => {
            return m[0] === match_str;
        });
        const positions = [];
        let index_offset = 0;
        for (const match of cursor_matches) {
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
        const active_view = this.app.workspace.getActiveViewOfType(obsidian_module.MarkdownView);
        if (!active_view) {
            return;
        }
        const editor = active_view.editor;
        editor.focus();
        const selections = [];
        for (const pos of positions) {
            selections.push({ from: pos });
        }
        const transaction = {
            selections: selections,
        };
        editor.transaction(transaction);
    }
}

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function (mod) {
    mod(window.CodeMirror);
})(function (CodeMirror) {

    CodeMirror.defineMode("javascript", function (config, parserConfig) {
        var indentUnit = config.indentUnit;
        var statementIndent = parserConfig.statementIndent;
        var jsonldMode = parserConfig.jsonld;
        var jsonMode = parserConfig.json || jsonldMode;
        var trackScope = parserConfig.trackScope !== false;
        var isTS = parserConfig.typescript;
        var wordRE = parserConfig.wordCharacters || /[\w$\xa1-\uffff]/;

        // Tokenizer

        var keywords = (function () {
            function kw(type) {
                return { type: type, style: "keyword" };
            }
            var A = kw("keyword a"),
                B = kw("keyword b"),
                C = kw("keyword c"),
                D = kw("keyword d");
            var operator = kw("operator"),
                atom = { type: "atom", style: "atom" };

            return {
                if: kw("if"),
                while: A,
                with: A,
                else: B,
                do: B,
                try: B,
                finally: B,
                return: D,
                break: D,
                continue: D,
                new: kw("new"),
                delete: C,
                void: C,
                throw: C,
                debugger: kw("debugger"),
                var: kw("var"),
                const: kw("var"),
                let: kw("var"),
                function: kw("function"),
                catch: kw("catch"),
                for: kw("for"),
                switch: kw("switch"),
                case: kw("case"),
                default: kw("default"),
                in: operator,
                typeof: operator,
                instanceof: operator,
                true: atom,
                false: atom,
                null: atom,
                undefined: atom,
                NaN: atom,
                Infinity: atom,
                this: kw("this"),
                class: kw("class"),
                super: kw("atom"),
                yield: C,
                export: kw("export"),
                import: kw("import"),
                extends: C,
                await: C,
            };
        })();

        var isOperatorChar = /[+\-*&%=<>!?|~^@]/;
        var isJsonldKeyword =
            /^@(context|id|value|language|type|container|list|set|reverse|index|base|vocab|graph)"/;

        function readRegexp(stream) {
            var escaped = false,
                next,
                inSet = false;
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
            type = tp;
            content = cont;
            return style;
        }
        function tokenBase(stream, state) {
            var ch = stream.next();
            if (ch == '"' || ch == "'") {
                state.tokenize = tokenString(ch);
                return state.tokenize(stream, state);
            } else if (
                ch == "." &&
                stream.match(/^\d[\d_]*(?:[eE][+\-]?[\d_]+)?/)
            ) {
                return ret("number", "number");
            } else if (ch == "." && stream.match("..")) {
                return ret("spread", "meta");
            } else if (/[\[\]{}\(\),;\:\.]/.test(ch)) {
                return ret(ch);
            } else if (ch == "=" && stream.eat(">")) {
                return ret("=>", "operator");
            } else if (
                ch == "0" &&
                stream.match(/^(?:x[\dA-Fa-f_]+|o[0-7_]+|b[01_]+)n?/)
            ) {
                return ret("number", "number");
            } else if (/\d/.test(ch)) {
                stream.match(
                    /^[\d_]*(?:n|(?:\.[\d_]*)?(?:[eE][+\-]?[\d_]+)?)?/
                );
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
                return ret("variable", "property");
            } else if (
                (ch == "<" && stream.match("!--")) ||
                (ch == "-" &&
                    stream.match("->") &&
                    !/\S/.test(stream.string.slice(0, stream.start)))
            ) {
                stream.skipToEnd();
                return ret("comment", "comment");
            } else if (isOperatorChar.test(ch)) {
                if (ch != ">" || !state.lexical || state.lexical.type != ">") {
                    if (stream.eat("=")) {
                        if (ch == "!" || ch == "=") stream.eat("=");
                    } else if (/[<>*+\-|&?]/.test(ch)) {
                        stream.eat(ch);
                        if (ch == ">") stream.eat(ch);
                    }
                }
                if (ch == "?" && stream.eat(".")) return ret(".");
                return ret("operator", "operator", stream.current());
            } else if (wordRE.test(ch)) {
                stream.eatWhile(wordRE);
                var word = stream.current();
                if (state.lastType != ".") {
                    if (keywords.propertyIsEnumerable(word)) {
                        var kw = keywords[word];
                        return ret(kw.type, kw.style, word);
                    }
                    if (
                        word == "async" &&
                        stream.match(
                            /^(\s|\/\*([^*]|\*(?!\/))*?\*\/)*[\[\(\w]/,
                            false
                        )
                    )
                        return ret("async", "keyword", word);
                }
                return ret("variable", "variable", word);
            }
        }

        function tokenString(quote) {
            return function (stream, state) {
                var escaped = false,
                    next;
                if (
                    jsonldMode &&
                    stream.peek() == "@" &&
                    stream.match(isJsonldKeyword)
                ) {
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
            var maybeEnd = false,
                ch;
            while ((ch = stream.next())) {
                if (ch == "/" && maybeEnd) {
                    state.tokenize = tokenBase;
                    break;
                }
                maybeEnd = ch == "*";
            }
            return ret("comment", "comment");
        }

        function tokenQuasi(stream, state) {
            var escaped = false,
                next;
            while ((next = stream.next()) != null) {
                if (
                    !escaped &&
                    (next == "`" || (next == "$" && stream.eat("{")))
                ) {
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

            if (isTS) {
                // Try to skip TypeScript return type declarations after the arguments
                var m = /:\s*(?:\w+(?:<[^>]*>|\[\])?|\{[^}]*\})\s*$/.exec(
                    stream.string.slice(stream.start, arrow)
                );
                if (m) arrow = m.index;
            }

            var depth = 0,
                sawSomething = false;
            for (var pos = arrow - 1; pos >= 0; --pos) {
                var ch = stream.string.charAt(pos);
                var bracket = brackets.indexOf(ch);
                if (bracket >= 0 && bracket < 3) {
                    if (!depth) {
                        ++pos;
                        break;
                    }
                    if (--depth == 0) {
                        if (ch == "(") sawSomething = true;
                        break;
                    }
                } else if (bracket >= 3 && bracket < 6) {
                    ++depth;
                } else if (wordRE.test(ch)) {
                    sawSomething = true;
                } else if (/["'\/`]/.test(ch)) {
                    for (; ; --pos) {
                        if (pos == 0) return;
                        var next = stream.string.charAt(pos - 1);
                        if (
                            next == ch &&
                            stream.string.charAt(pos - 2) != "\\"
                        ) {
                            pos--;
                            break;
                        }
                    }
                } else if (sawSomething && !depth) {
                    ++pos;
                    break;
                }
            }
            if (sawSomething && !depth) state.fatArrowAt = pos;
        }

        // Parser

        var atomicTypes = {
            atom: true,
            number: true,
            variable: true,
            string: true,
            regexp: true,
            this: true,
            import: true,
            "jsonld-keyword": true,
        };

        function JSLexical(indented, column, type, align, prev, info) {
            this.indented = indented;
            this.column = column;
            this.type = type;
            this.prev = prev;
            this.info = info;
            if (align != null) this.align = align;
        }

        function inScope(state, varname) {
            if (!trackScope) return false;
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
            cx.state = state;
            cx.stream = stream;
            (cx.marked = null), (cx.cc = cc);
            cx.style = style;

            if (!state.lexical.hasOwnProperty("align"))
                state.lexical.align = true;

            while (true) {
                var combinator = cc.length
                    ? cc.pop()
                    : jsonMode
                    ? expression
                    : statement;
                if (combinator(type, content)) {
                    while (cc.length && cc[cc.length - 1].lex) cc.pop()();
                    if (cx.marked) return cx.marked;
                    if (type == "variable" && inScope(state, content))
                        return "variable-2";
                    return style;
                }
            }
        }

        // Combinator utils

        var cx = { state: null, column: null, marked: null, cc: null };
        function pass() {
            for (var i = arguments.length - 1; i >= 0; i--)
                cx.cc.push(arguments[i]);
        }
        function cont() {
            pass.apply(null, arguments);
            return true;
        }
        function inList(name, list) {
            for (var v = list; v; v = v.next) if (v.name == name) return true;
            return false;
        }
        function register(varname) {
            var state = cx.state;
            cx.marked = "def";
            if (!trackScope) return;
            if (state.context) {
                if (
                    state.lexical.info == "var" &&
                    state.context &&
                    state.context.block
                ) {
                    // FIXME function decls are also not block scoped
                    var newContext = registerVarScoped(varname, state.context);
                    if (newContext != null) {
                        state.context = newContext;
                        return;
                    }
                } else if (!inList(varname, state.localVars)) {
                    state.localVars = new Var(varname, state.localVars);
                    return;
                }
            }
            // Fall through means this is global
            if (parserConfig.globalVars && !inList(varname, state.globalVars))
                state.globalVars = new Var(varname, state.globalVars);
        }
        function registerVarScoped(varname, context) {
            if (!context) {
                return null;
            } else if (context.block) {
                var inner = registerVarScoped(varname, context.prev);
                if (!inner) return null;
                if (inner == context.prev) return context;
                return new Context(inner, context.vars, true);
            } else if (inList(varname, context.vars)) {
                return context;
            } else {
                return new Context(
                    context.prev,
                    new Var(varname, context.vars),
                    false
                );
            }
        }

        function isModifier(name) {
            return (
                name == "public" ||
                name == "private" ||
                name == "protected" ||
                name == "abstract" ||
                name == "readonly"
            );
        }

        // Combinators

        function Context(prev, vars, block) {
            this.prev = prev;
            this.vars = vars;
            this.block = block;
        }
        function Var(name, next) {
            this.name = name;
            this.next = next;
        }

        var defaultVars = new Var("this", new Var("arguments", null));
        function pushcontext() {
            cx.state.context = new Context(
                cx.state.context,
                cx.state.localVars,
                false
            );
            cx.state.localVars = defaultVars;
        }
        function pushblockcontext() {
            cx.state.context = new Context(
                cx.state.context,
                cx.state.localVars,
                true
            );
            cx.state.localVars = null;
        }
        function popcontext() {
            cx.state.localVars = cx.state.context.vars;
            cx.state.context = cx.state.context.prev;
        }
        popcontext.lex = true;
        function pushlex(type, info) {
            var result = function () {
                var state = cx.state,
                    indent = state.indented;
                if (state.lexical.type == "stat")
                    indent = state.lexical.indented;
                else
                    for (
                        var outer = state.lexical;
                        outer && outer.type == ")" && outer.align;
                        outer = outer.prev
                    )
                        indent = outer.indented;
                state.lexical = new JSLexical(
                    indent,
                    cx.stream.column(),
                    type,
                    null,
                    state.lexical,
                    info
                );
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
                else if (
                    wanted == ";" ||
                    type == "}" ||
                    type == ")" ||
                    type == "]"
                )
                    return pass();
                else return cont(exp);
            }
            return exp;
        }

        function statement(type, value) {
            if (type == "var")
                return cont(
                    pushlex("vardef", value),
                    vardef,
                    expect(";"),
                    poplex
                );
            if (type == "keyword a")
                return cont(pushlex("form"), parenExpr, statement, poplex);
            if (type == "keyword b")
                return cont(pushlex("form"), statement, poplex);
            if (type == "keyword d")
                return cx.stream.match(/^\s*$/, false)
                    ? cont()
                    : cont(
                          pushlex("stat"),
                          maybeexpression,
                          expect(";"),
                          poplex
                      );
            if (type == "debugger") return cont(expect(";"));
            if (type == "{")
                return cont(
                    pushlex("}"),
                    pushblockcontext,
                    block,
                    poplex,
                    popcontext
                );
            if (type == ";") return cont();
            if (type == "if") {
                if (
                    cx.state.lexical.info == "else" &&
                    cx.state.cc[cx.state.cc.length - 1] == poplex
                )
                    cx.state.cc.pop()();
                return cont(
                    pushlex("form"),
                    parenExpr,
                    statement,
                    poplex,
                    maybeelse
                );
            }
            if (type == "function") return cont(functiondef);
            if (type == "for")
                return cont(
                    pushlex("form"),
                    pushblockcontext,
                    forspec,
                    statement,
                    popcontext,
                    poplex
                );
            if (type == "class" || (isTS && value == "interface")) {
                cx.marked = "keyword";
                return cont(
                    pushlex("form", type == "class" ? type : value),
                    className,
                    poplex
                );
            }
            if (type == "variable") {
                if (isTS && value == "declare") {
                    cx.marked = "keyword";
                    return cont(statement);
                } else if (
                    isTS &&
                    (value == "module" || value == "enum" || value == "type") &&
                    cx.stream.match(/^\s*\w/, false)
                ) {
                    cx.marked = "keyword";
                    if (value == "enum") return cont(enumdef);
                    else if (value == "type")
                        return cont(
                            typename,
                            expect("operator"),
                            typeexpr,
                            expect(";")
                        );
                    else
                        return cont(
                            pushlex("form"),
                            pattern,
                            expect("{"),
                            pushlex("}"),
                            block,
                            poplex,
                            poplex
                        );
                } else if (isTS && value == "namespace") {
                    cx.marked = "keyword";
                    return cont(pushlex("form"), expression, statement, poplex);
                } else if (isTS && value == "abstract") {
                    cx.marked = "keyword";
                    return cont(statement);
                } else {
                    return cont(pushlex("stat"), maybelabel);
                }
            }
            if (type == "switch")
                return cont(
                    pushlex("form"),
                    parenExpr,
                    expect("{"),
                    pushlex("}", "switch"),
                    pushblockcontext,
                    block,
                    poplex,
                    poplex,
                    popcontext
                );
            if (type == "case") return cont(expression, expect(":"));
            if (type == "default") return cont(expect(":"));
            if (type == "catch")
                return cont(
                    pushlex("form"),
                    pushcontext,
                    maybeCatchBinding,
                    statement,
                    poplex,
                    popcontext
                );
            if (type == "export")
                return cont(pushlex("stat"), afterExport, poplex);
            if (type == "import")
                return cont(pushlex("stat"), afterImport, poplex);
            if (type == "async") return cont(statement);
            if (value == "@") return cont(expression, statement);
            return pass(pushlex("stat"), expression, expect(";"), poplex);
        }
        function maybeCatchBinding(type) {
            if (type == "(") return cont(funarg, expect(")"));
        }
        function expression(type, value) {
            return expressionInner(type, value, false);
        }
        function expressionNoComma(type, value) {
            return expressionInner(type, value, true);
        }
        function parenExpr(type) {
            if (type != "(") return pass();
            return cont(pushlex(")"), maybeexpression, expect(")"), poplex);
        }
        function expressionInner(type, value, noComma) {
            if (cx.state.fatArrowAt == cx.stream.start) {
                var body = noComma ? arrowBodyNoComma : arrowBody;
                if (type == "(")
                    return cont(
                        pushcontext,
                        pushlex(")"),
                        commasep(funarg, ")"),
                        poplex,
                        expect("=>"),
                        body,
                        popcontext
                    );
                else if (type == "variable")
                    return pass(
                        pushcontext,
                        pattern,
                        expect("=>"),
                        body,
                        popcontext
                    );
            }

            var maybeop = noComma ? maybeoperatorNoComma : maybeoperatorComma;
            if (atomicTypes.hasOwnProperty(type)) return cont(maybeop);
            if (type == "function") return cont(functiondef, maybeop);
            if (type == "class" || (isTS && value == "interface")) {
                cx.marked = "keyword";
                return cont(pushlex("form"), classExpression, poplex);
            }
            if (type == "keyword c" || type == "async")
                return cont(noComma ? expressionNoComma : expression);
            if (type == "(")
                return cont(
                    pushlex(")"),
                    maybeexpression,
                    expect(")"),
                    poplex,
                    maybeop
                );
            if (type == "operator" || type == "spread")
                return cont(noComma ? expressionNoComma : expression);
            if (type == "[")
                return cont(pushlex("]"), arrayLiteral, poplex, maybeop);
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
            var me =
                noComma == false ? maybeoperatorComma : maybeoperatorNoComma;
            var expr = noComma == false ? expression : expressionNoComma;
            if (type == "=>")
                return cont(
                    pushcontext,
                    noComma ? arrowBodyNoComma : arrowBody,
                    popcontext
                );
            if (type == "operator") {
                if (/\+\+|--/.test(value) || (isTS && value == "!"))
                    return cont(me);
                if (
                    isTS &&
                    value == "<" &&
                    cx.stream.match(/^([^<>]|<[^<>]*>)*>\s*\(/, false)
                )
                    return cont(
                        pushlex(">"),
                        commasep(typeexpr, ">"),
                        poplex,
                        me
                    );
                if (value == "?") return cont(expression, expect(":"), expr);
                return cont(expr);
            }
            if (type == "quasi") {
                return pass(quasi, me);
            }
            if (type == ";") return;
            if (type == "(")
                return contCommasep(expressionNoComma, ")", "call", me);
            if (type == ".") return cont(property, me);
            if (type == "[")
                return cont(
                    pushlex("]"),
                    maybeexpression,
                    expect("]"),
                    poplex,
                    me
                );
            if (isTS && value == "as") {
                cx.marked = "keyword";
                return cont(typeexpr, me);
            }
            if (type == "regexp") {
                cx.state.lastType = cx.marked = "operator";
                cx.stream.backUp(cx.stream.pos - cx.stream.start - 1);
                return cont(expr);
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
            return function (type) {
                if (type == ".") return cont(noComma ? targetNoComma : target);
                else if (type == "variable" && isTS)
                    return cont(
                        maybeTypeArgs,
                        noComma ? maybeoperatorNoComma : maybeoperatorComma
                    );
                else return pass(noComma ? expressionNoComma : expression);
            };
        }
        function target(_, value) {
            if (value == "target") {
                cx.marked = "keyword";
                return cont(maybeoperatorComma);
            }
        }
        function targetNoComma(_, value) {
            if (value == "target") {
                cx.marked = "keyword";
                return cont(maybeoperatorNoComma);
            }
        }
        function maybelabel(type) {
            if (type == ":") return cont(poplex, statement);
            return pass(maybeoperatorComma, expect(";"), poplex);
        }
        function property(type) {
            if (type == "variable") {
                cx.marked = "property";
                return cont();
            }
        }
        function objprop(type, value) {
            if (type == "async") {
                cx.marked = "property";
                return cont(objprop);
            } else if (type == "variable" || cx.style == "keyword") {
                cx.marked = "property";
                if (value == "get" || value == "set") return cont(getterSetter);
                var m; // Work around fat-arrow-detection complication for detecting typescript typed arrow params
                if (
                    isTS &&
                    cx.state.fatArrowAt == cx.stream.start &&
                    (m = cx.stream.match(/^\s*:\s*/, false))
                )
                    cx.state.fatArrowAt = cx.stream.pos + m[0].length;
                return cont(afterprop);
            } else if (type == "number" || type == "string") {
                cx.marked = jsonldMode ? "property" : cx.style + " property";
                return cont(afterprop);
            } else if (type == "jsonld-keyword") {
                return cont(afterprop);
            } else if (isTS && isModifier(value)) {
                cx.marked = "keyword";
                return cont(objprop);
            } else if (type == "[") {
                return cont(expression, maybetype, expect("]"), afterprop);
            } else if (type == "spread") {
                return cont(expressionNoComma, afterprop);
            } else if (value == "*") {
                cx.marked = "keyword";
                return cont(objprop);
            } else if (type == ":") {
                return pass(afterprop);
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
                    return cont(function (type, value) {
                        if (type == end || value == end) return pass();
                        return pass(what);
                    }, proceed);
                }
                if (type == end || value == end) return cont();
                if (sep && sep.indexOf(";") > -1) return pass(what);
                return cont(expect(end));
            }
            return function (type, value) {
                if (type == end || value == end) return cont();
                return pass(what, proceed);
            };
        }
        function contCommasep(what, end, info) {
            for (var i = 3; i < arguments.length; i++) cx.cc.push(arguments[i]);
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
            if (isTS && (type == ":" || value == "in")) return cont(typeexpr);
        }
        function mayberettype(type) {
            if (isTS && type == ":") {
                if (cx.stream.match(/^\s*\w+\s+is\b/, false))
                    return cont(expression, isKW, typeexpr);
                else return cont(typeexpr);
            }
        }
        function isKW(_, value) {
            if (value == "is") {
                cx.marked = "keyword";
                return cont();
            }
        }
        function typeexpr(type, value) {
            if (
                value == "keyof" ||
                value == "typeof" ||
                value == "infer" ||
                value == "readonly"
            ) {
                cx.marked = "keyword";
                return cont(value == "typeof" ? expressionNoComma : typeexpr);
            }
            if (type == "variable" || value == "void") {
                cx.marked = "type";
                return cont(afterType);
            }
            if (value == "|" || value == "&") return cont(typeexpr);
            if (type == "string" || type == "number" || type == "atom")
                return cont(afterType);
            if (type == "[")
                return cont(
                    pushlex("]"),
                    commasep(typeexpr, "]", ","),
                    poplex,
                    afterType
                );
            if (type == "{")
                return cont(pushlex("}"), typeprops, poplex, afterType);
            if (type == "(")
                return cont(commasep(typearg, ")"), maybeReturnType, afterType);
            if (type == "<") return cont(commasep(typeexpr, ">"), typeexpr);
            if (type == "quasi") {
                return pass(quasiType, afterType);
            }
        }
        function maybeReturnType(type) {
            if (type == "=>") return cont(typeexpr);
        }
        function typeprops(type) {
            if (type.match(/[\}\)\]]/)) return cont();
            if (type == "," || type == ";") return cont(typeprops);
            return pass(typeprop, typeprops);
        }
        function typeprop(type, value) {
            if (type == "variable" || cx.style == "keyword") {
                cx.marked = "property";
                return cont(typeprop);
            } else if (value == "?" || type == "number" || type == "string") {
                return cont(typeprop);
            } else if (type == ":") {
                return cont(typeexpr);
            } else if (type == "[") {
                return cont(
                    expect("variable"),
                    maybetypeOrIn,
                    expect("]"),
                    typeprop
                );
            } else if (type == "(") {
                return pass(functiondecl, typeprop);
            } else if (!type.match(/[;\}\)\],]/)) {
                return cont();
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
            if (
                (type == "variable" && cx.stream.match(/^\s*[?:]/, false)) ||
                value == "?"
            )
                return cont(typearg);
            if (type == ":") return cont(typeexpr);
            if (type == "spread") return cont(typearg);
            return pass(typeexpr);
        }
        function afterType(type, value) {
            if (value == "<")
                return cont(
                    pushlex(">"),
                    commasep(typeexpr, ">"),
                    poplex,
                    afterType
                );
            if (value == "|" || type == "." || value == "&")
                return cont(typeexpr);
            if (type == "[") return cont(typeexpr, expect("]"), afterType);
            if (value == "extends" || value == "implements") {
                cx.marked = "keyword";
                return cont(typeexpr);
            }
            if (value == "?") return cont(typeexpr, expect(":"), typeexpr);
        }
        function maybeTypeArgs(_, value) {
            if (value == "<")
                return cont(
                    pushlex(">"),
                    commasep(typeexpr, ">"),
                    poplex,
                    afterType
                );
        }
        function typeparam() {
            return pass(typeexpr, maybeTypeDefault);
        }
        function maybeTypeDefault(_, value) {
            if (value == "=") return cont(typeexpr);
        }
        function vardef(_, value) {
            if (value == "enum") {
                cx.marked = "keyword";
                return cont(enumdef);
            }
            return pass(pattern, maybetype, maybeAssign, vardefCont);
        }
        function pattern(type, value) {
            if (isTS && isModifier(value)) {
                cx.marked = "keyword";
                return cont(pattern);
            }
            if (type == "variable") {
                register(value);
                return cont();
            }
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
            if (type == "[")
                return cont(expression, expect("]"), expect(":"), proppattern);
            return cont(expect(":"), pattern, maybeAssign);
        }
        function eltpattern() {
            return pass(pattern, maybeAssign);
        }
        function maybeAssign(_type, value) {
            if (value == "=") return cont(expressionNoComma);
        }
        function vardefCont(type) {
            if (type == ",") return cont(vardef);
        }
        function maybeelse(type, value) {
            if (type == "keyword b" && value == "else")
                return cont(pushlex("form", "else"), statement, poplex);
        }
        function forspec(type, value) {
            if (value == "await") return cont(forspec);
            if (type == "(") return cont(pushlex(")"), forspec1, poplex);
        }
        function forspec1(type) {
            if (type == "var") return cont(vardef, forspec2);
            if (type == "variable") return cont(forspec2);
            return pass(forspec2);
        }
        function forspec2(type, value) {
            if (type == ")") return cont();
            if (type == ";") return cont(forspec2);
            if (value == "in" || value == "of") {
                cx.marked = "keyword";
                return cont(expression, forspec2);
            }
            return pass(expression, forspec2);
        }
        function functiondef(type, value) {
            if (value == "*") {
                cx.marked = "keyword";
                return cont(functiondef);
            }
            if (type == "variable") {
                register(value);
                return cont(functiondef);
            }
            if (type == "(")
                return cont(
                    pushcontext,
                    pushlex(")"),
                    commasep(funarg, ")"),
                    poplex,
                    mayberettype,
                    statement,
                    popcontext
                );
            if (isTS && value == "<")
                return cont(
                    pushlex(">"),
                    commasep(typeparam, ">"),
                    poplex,
                    functiondef
                );
        }
        function functiondecl(type, value) {
            if (value == "*") {
                cx.marked = "keyword";
                return cont(functiondecl);
            }
            if (type == "variable") {
                register(value);
                return cont(functiondecl);
            }
            if (type == "(")
                return cont(
                    pushcontext,
                    pushlex(")"),
                    commasep(funarg, ")"),
                    poplex,
                    mayberettype,
                    popcontext
                );
            if (isTS && value == "<")
                return cont(
                    pushlex(">"),
                    commasep(typeparam, ">"),
                    poplex,
                    functiondecl
                );
        }
        function typename(type, value) {
            if (type == "keyword" || type == "variable") {
                cx.marked = "type";
                return cont(typename);
            } else if (value == "<") {
                return cont(pushlex(">"), commasep(typeparam, ">"), poplex);
            }
        }
        function funarg(type, value) {
            if (value == "@") cont(expression, funarg);
            if (type == "spread") return cont(funarg);
            if (isTS && isModifier(value)) {
                cx.marked = "keyword";
                return cont(funarg);
            }
            if (isTS && type == "this") return cont(maybetype, maybeAssign);
            return pass(pattern, maybetype, maybeAssign);
        }
        function classExpression(type, value) {
            // Class expressions may have an optional name.
            if (type == "variable") return className(type, value);
            return classNameAfter(type, value);
        }
        function className(type, value) {
            if (type == "variable") {
                register(value);
                return cont(classNameAfter);
            }
        }
        function classNameAfter(type, value) {
            if (value == "<")
                return cont(
                    pushlex(">"),
                    commasep(typeparam, ">"),
                    poplex,
                    classNameAfter
                );
            if (
                value == "extends" ||
                value == "implements" ||
                (isTS && type == ",")
            ) {
                if (value == "implements") cx.marked = "keyword";
                return cont(isTS ? typeexpr : expression, classNameAfter);
            }
            if (type == "{") return cont(pushlex("}"), classBody, poplex);
        }
        function classBody(type, value) {
            if (
                type == "async" ||
                (type == "variable" &&
                    (value == "static" ||
                        value == "get" ||
                        value == "set" ||
                        (isTS && isModifier(value))) &&
                    cx.stream.match(/^\s+[\w$\xa1-\uffff]/, false))
            ) {
                cx.marked = "keyword";
                return cont(classBody);
            }
            if (type == "variable" || cx.style == "keyword") {
                cx.marked = "property";
                return cont(classfield, classBody);
            }
            if (type == "number" || type == "string")
                return cont(classfield, classBody);
            if (type == "[")
                return cont(
                    expression,
                    maybetype,
                    expect("]"),
                    classfield,
                    classBody
                );
            if (value == "*") {
                cx.marked = "keyword";
                return cont(classBody);
            }
            if (isTS && type == "(") return pass(functiondecl, classBody);
            if (type == ";" || type == ",") return cont(classBody);
            if (type == "}") return cont();
            if (value == "@") return cont(expression, classBody);
        }
        function classfield(type, value) {
            if (value == "!") return cont(classfield);
            if (value == "?") return cont(classfield);
            if (type == ":") return cont(typeexpr, maybeAssign);
            if (value == "=") return cont(expressionNoComma);
            var context = cx.state.lexical.prev,
                isInterface = context && context.info == "interface";
            return pass(isInterface ? functiondecl : functiondef);
        }
        function afterExport(type, value) {
            if (value == "*") {
                cx.marked = "keyword";
                return cont(maybeFrom, expect(";"));
            }
            if (value == "default") {
                cx.marked = "keyword";
                return cont(expression, expect(";"));
            }
            if (type == "{")
                return cont(commasep(exportField, "}"), maybeFrom, expect(";"));
            return pass(statement);
        }
        function exportField(type, value) {
            if (value == "as") {
                cx.marked = "keyword";
                return cont(expect("variable"));
            }
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
            if (type == ",") return cont(importSpec, maybeMoreImports);
        }
        function maybeAs(_type, value) {
            if (value == "as") {
                cx.marked = "keyword";
                return cont(importSpec);
            }
        }
        function maybeFrom(_type, value) {
            if (value == "from") {
                cx.marked = "keyword";
                return cont(expression);
            }
        }
        function arrayLiteral(type) {
            if (type == "]") return cont();
            return pass(commasep(expressionNoComma, "]"));
        }
        function enumdef() {
            return pass(
                pushlex("form"),
                pattern,
                expect("{"),
                pushlex("}"),
                commasep(enummember, "}"),
                poplex,
                poplex
            );
        }
        function enummember() {
            return pass(pattern, maybeAssign);
        }

        function isContinuedStatement(state, textAfter) {
            return (
                state.lastType == "operator" ||
                state.lastType == "," ||
                isOperatorChar.test(textAfter.charAt(0)) ||
                /[,.]/.test(textAfter.charAt(0))
            );
        }

        function expressionAllowed(stream, state, backUp) {
            return (
                (state.tokenize == tokenBase &&
                    /^(?:operator|sof|keyword [bcd]|case|new|export|default|spread|[\[{}\(,;:]|=>)$/.test(
                        state.lastType
                    )) ||
                (state.lastType == "quasi" &&
                    /\{\s*$/.test(
                        stream.string.slice(0, stream.pos - (backUp || 0))
                    ))
            );
        }

        // Interface

        return {
            startState: function (basecolumn) {
                var state = {
                    tokenize: tokenBase,
                    lastType: "sof",
                    cc: [],
                    lexical: new JSLexical(
                        (basecolumn || 0) - indentUnit,
                        0,
                        "block",
                        false
                    ),
                    localVars: parserConfig.localVars,
                    context:
                        parserConfig.localVars &&
                        new Context(null, null, false),
                    indented: basecolumn || 0,
                };
                if (
                    parserConfig.globalVars &&
                    typeof parserConfig.globalVars == "object"
                )
                    state.globalVars = parserConfig.globalVars;
                return state;
            },

            token: function (stream, state) {
                if (stream.sol()) {
                    if (!state.lexical.hasOwnProperty("align"))
                        state.lexical.align = false;
                    state.indented = stream.indentation();
                    findFatArrow(stream, state);
                }
                if (state.tokenize != tokenComment && stream.eatSpace())
                    return null;
                var style = state.tokenize(stream, state);
                if (type == "comment") return style;
                state.lastType =
                    type == "operator" && (content == "++" || content == "--")
                        ? "incdec"
                        : type;
                return parseJS(state, style, type, content, stream);
            },

            indent: function (state, textAfter) {
                if (
                    state.tokenize == tokenComment ||
                    state.tokenize == tokenQuasi
                )
                    return CodeMirror.Pass;
                if (state.tokenize != tokenBase) return 0;
                var firstChar = textAfter && textAfter.charAt(0),
                    lexical = state.lexical,
                    top;
                // Kludge to prevent 'maybelse' from blocking lexical scope pops
                if (!/^\s*else\b/.test(textAfter))
                    for (var i = state.cc.length - 1; i >= 0; --i) {
                        var c = state.cc[i];
                        if (c == poplex) lexical = lexical.prev;
                        else if (c != maybeelse && c != popcontext) break;
                    }
                while (
                    (lexical.type == "stat" || lexical.type == "form") &&
                    (firstChar == "}" ||
                        ((top = state.cc[state.cc.length - 1]) &&
                            (top == maybeoperatorComma ||
                                top == maybeoperatorNoComma) &&
                            !/^[,\.=+\-*:?[\(]/.test(textAfter)))
                )
                    lexical = lexical.prev;
                if (
                    statementIndent &&
                    lexical.type == ")" &&
                    lexical.prev.type == "stat"
                )
                    lexical = lexical.prev;
                var type = lexical.type,
                    closing = firstChar == type;

                if (type == "vardef")
                    return (
                        lexical.indented +
                        (state.lastType == "operator" || state.lastType == ","
                            ? lexical.info.length + 1
                            : 0)
                    );
                else if (type == "form" && firstChar == "{")
                    return lexical.indented;
                else if (type == "form") return lexical.indented + indentUnit;
                else if (type == "stat")
                    return (
                        lexical.indented +
                        (isContinuedStatement(state, textAfter)
                            ? statementIndent || indentUnit
                            : 0)
                    );
                else if (
                    lexical.info == "switch" &&
                    !closing &&
                    parserConfig.doubleIndentSwitch != false
                )
                    return (
                        lexical.indented +
                        (/^(?:case|default)\b/.test(textAfter)
                            ? indentUnit
                            : 2 * indentUnit)
                    );
                else if (lexical.align)
                    return lexical.column + (closing ? 0 : 1);
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

            skipExpression: function (state) {
                parseJS(
                    state,
                    "atom",
                    "atom",
                    "true",
                    new CodeMirror.StringStream("", 2, null)
                );
            },
        };
    });

    CodeMirror.registerHelper("wordChars", "javascript", /[\w$]/);

    CodeMirror.defineMIME("text/javascript", "javascript");
    CodeMirror.defineMIME("text/ecmascript", "javascript");
    CodeMirror.defineMIME("application/javascript", "javascript");
    CodeMirror.defineMIME("application/x-javascript", "javascript");
    CodeMirror.defineMIME("application/ecmascript", "javascript");
    CodeMirror.defineMIME("application/json", {
        name: "javascript",
        json: true,
    });
    CodeMirror.defineMIME("application/x-json", {
        name: "javascript",
        json: true,
    });
    CodeMirror.defineMIME("application/manifest+json", {
        name: "javascript",
        json: true,
    });
    CodeMirror.defineMIME("application/ld+json", {
        name: "javascript",
        jsonld: true,
    });
    CodeMirror.defineMIME("text/typescript", {
        name: "javascript",
        typescript: true,
    });
    CodeMirror.defineMIME("application/typescript", {
        name: "javascript",
        typescript: true,
    });
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

(function (mod) {
    mod(window.CodeMirror);
})(function (CodeMirror) {

    CodeMirror.customOverlayMode = function (base, overlay, combine) {
        return {
            startState: function () {
                return {
                    base: CodeMirror.startState(base),
                    overlay: CodeMirror.startState(overlay),
                    basePos: 0,
                    baseCur: null,
                    overlayPos: 0,
                    overlayCur: null,
                    streamSeen: null,
                };
            },
            copyState: function (state) {
                return {
                    base: CodeMirror.copyState(base, state.base),
                    overlay: CodeMirror.copyState(overlay, state.overlay),
                    basePos: state.basePos,
                    baseCur: null,
                    overlayPos: state.overlayPos,
                    overlayCur: null,
                };
            },

            token: function (stream, state) {
                if (
                    stream != state.streamSeen ||
                    Math.min(state.basePos, state.overlayPos) < stream.start
                ) {
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
                if (
                    state.baseCur &&
                    state.overlayCur &&
                    state.baseCur.contains("line-HyperMD-codeblock")
                ) {
                    state.overlayCur = state.overlayCur.replace(
                        "line-templater-inline",
                        ""
                    );
                    state.overlayCur += ` line-background-HyperMD-codeblock-bg`;
                }

                // state.overlay.combineTokens always takes precedence over combine,
                // unless set to null
                if (state.overlayCur == null) return state.baseCur;
                else if (
                    (state.baseCur != null && state.overlay.combineTokens) ||
                    (combine && state.overlay.combineTokens == null)
                )
                    return state.baseCur + " " + state.overlayCur;
                else return state.overlayCur;
            },

            indent:
                base.indent &&
                function (state, textAfter, line) {
                    return base.indent(state.base, textAfter, line);
                },
            electricChars: base.electricChars,

            innerMode: function (state) {
                return { state: state.base, mode: base };
            },

            blankLine: function (state) {
                var baseToken, overlayToken;
                if (base.blankLine) baseToken = base.blankLine(state.base);
                if (overlay.blankLine)
                    overlayToken = overlay.blankLine(state.overlay);

                return overlayToken == null
                    ? baseToken
                    : combine && baseToken != null
                    ? baseToken + " " + overlayToken
                    : overlayToken;
            },
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
            if (obsidian_module.Platform.isMobileApp) {
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
            window.CodeMirror.defineMode("templater", function (config, _parserConfig) {
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
                                case "*":
                                    state.tag_class = TP_EXEC_TAG_TOKEN_CLASS;
                                    break;
                                case "~":
                                    state.tag_class = TP_RAW_TAG_TOKEN_CLASS;
                                    break;
                                default:
                                    state.tag_class =
                                        TP_INTERPOLATION_TAG_TOKEN_CLASS;
                                    break;
                            }
                            state.inCommand = true;
                            return `line-${TP_INLINE_CLASS} ${TP_CMD_TOKEN_CLASS} ${TP_OPENING_TAG_TOKEN_CLASS} ${state.tag_class}`;
                        }
                        while (stream.next() != null &&
                            !stream.match(/<%/, false))
                            ;
                        return null;
                    },
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
                    case "current": {
                        const active_file = this.app.workspace.getActiveFile();
                        if (active_file) {
                            folder = active_file.parent;
                        }
                        break;
                    }
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
            if (template instanceof obsidian_module.TFile) {
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
                yield active_leaf.openFile(created_note, {
                    state: { mode: "source" },
                    eState: { rename: "all" },
                });
                yield this.editor.jump_to_next_cursor_location();
            }
            return created_note;
        });
    }
    append_template_to_active_file(template_file) {
        return __awaiter(this, void 0, void 0, function* () {
            const active_view = this.app.workspace.getActiveViewOfType(obsidian_module.MarkdownView);
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
        const active_view = this.app.workspace.getActiveViewOfType(obsidian_module.MarkdownView);
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
                    if (!file || !(file instanceof obsidian_module.TFile)) {
                        return;
                    }
                    if (!pass) {
                        pass = true;
                        const config = this.create_running_config(file, file, RunMode.DynamicProcessor);
                        functions_object =
                            yield this.functions_generator.generate_object(config, FunctionsMode.USER_INTERNAL);
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
                        const start = dynamic_command_regex.lastIndex - match[0].length;
                        const end = dynamic_command_regex.lastIndex;
                        content =
                            content.substring(0, start) +
                                command_output +
                                content.substring(end);
                        dynamic_command_regex.lastIndex +=
                            command_output.length - match[0].length;
                        match = dynamic_command_regex.exec(content);
                    }
                    node.nodeValue = content;
                }
            }
        });
    }
    get_new_file_template_for_folder(folder) {
        do {
            const match = this.plugin.settings.folder_templates.find((e) => e.folder == folder.path);
            if (match && match.template) {
                return match.template;
            }
            folder = folder.parent;
        } while (!folder.isRoot());
    }
    static on_file_creation(templater, file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(file instanceof obsidian_module.TFile) || file.extension !== "md") {
                return;
            }
            // Avoids template replacement when syncing template files
            const template_folder = obsidian_module.normalizePath(templater.plugin.settings.templates_folder);
            if (file.path.includes(template_folder) && template_folder !== "/") {
                return;
            }
            // TODO: find a better way to do this
            // Currently, I have to wait for the daily note plugin to add the file content before replacing
            // Not a problem with Calendar however since it creates the file with the existing content
            yield delay(300);
            if (file.stat.size == 0 &&
                templater.plugin.settings.enable_folder_templates) {
                const folder_template_match = templater.get_new_file_template_for_folder(file.parent);
                if (!folder_template_match) {
                    return;
                }
                const template_file = yield errorWrapper(() => __awaiter(this, void 0, void 0, function* () {
                    return resolve_tfile(templater.app, folder_template_match);
                }), `Couldn't find template ${folder_template_match}`);
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
                if (!template) {
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
            this.syntax_highlighting_event = this.app.workspace.on("codemirror", (cm) => {
                cm.setOption("mode", "templater");
            });
            this.app.workspace.iterateCodeMirrors((cm) => {
                cm.setOption("mode", "templater");
            });
            this.plugin.registerEvent(this.syntax_highlighting_event);
        }
        else {
            if (this.syntax_highlighting_event) {
                this.app.vault.offref(this.syntax_highlighting_event);
            }
            this.app.workspace.iterateCodeMirrors((cm) => {
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
            if (file instanceof obsidian_module.TFolder) {
                menu.addItem((item) => {
                    item.setTitle("Create new note from template")
                        .setIcon("templater-icon")
                        .onClick(() => {
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
                    key: "e",
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
                    key: "r",
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
            },
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
            },
        });
        this.register_templates_hotkeys();
    }
    register_templates_hotkeys() {
        this.plugin.settings.enabled_templates_hotkeys.forEach((template) => {
            if (template) {
                this.add_template_hotkey(null, template);
            }
        });
    }
    add_template_hotkey(old_template, new_template) {
        this.remove_template_hotkey(old_template);
        if (new_template) {
            this.plugin.addCommand({
                id: new_template,
                name: `Insert ${new_template}`,
                callback: () => {
                    const template = errorWrapperSync(() => resolve_tfile(this.app, new_template), `Couldn't find the template file associated with this hotkey`);
                    if (!template) {
                        return;
                    }
                    this.plugin.templater.append_template_to_active_file(template);
                },
            });
        }
    }
    remove_template_hotkey(template) {
        if (template) {
            // TODO: Find official way to do this
            // @ts-ignore
            this.app.commands.removeCommand(`${this.plugin.manifest.id}:${template}`);
        }
    }
}

class TemplaterPlugin extends obsidian_module.Plugin {
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
            obsidian_module.addIcon("templater-icon", ICON_DATA);
            this.addRibbonIcon("templater-icon", "Templater", () => __awaiter(this, void 0, void 0, function* () {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy9Mb2cudHMiLCJzcmMvRXJyb3IudHMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2VudW1zLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0Tm9kZU5hbWUuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRXaW5kb3cuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9pbnN0YW5jZU9mLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9tb2RpZmllcnMvYXBwbHlTdHlsZXMuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2dldEJhc2VQbGFjZW1lbnQuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRCb3VuZGluZ0NsaWVudFJlY3QuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRMYXlvdXRSZWN0LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvY29udGFpbnMuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRDb21wdXRlZFN0eWxlLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvaXNUYWJsZUVsZW1lbnQuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXREb2N1bWVudEVsZW1lbnQuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRQYXJlbnROb2RlLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0T2Zmc2V0UGFyZW50LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL21hdGguanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL3dpdGhpbi5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvZ2V0RnJlc2hTaWRlT2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9tZXJnZVBhZGRpbmdPYmplY3QuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2V4cGFuZFRvSGFzaE1hcC5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvbW9kaWZpZXJzL2Fycm93LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRWYXJpYXRpb24uanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL21vZGlmaWVycy9jb21wdXRlU3R5bGVzLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9tb2RpZmllcnMvZXZlbnRMaXN0ZW5lcnMuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2dldE9wcG9zaXRlUGxhY2VtZW50LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRPcHBvc2l0ZVZhcmlhdGlvblBsYWNlbWVudC5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldFdpbmRvd1Njcm9sbC5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldFdpbmRvd1Njcm9sbEJhclguanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXRWaWV3cG9ydFJlY3QuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXREb2N1bWVudFJlY3QuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9pc1Njcm9sbFBhcmVudC5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2dldFNjcm9sbFBhcmVudC5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvZG9tLXV0aWxzL2xpc3RTY3JvbGxQYXJlbnRzLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9yZWN0VG9DbGllbnRSZWN0LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0Q2xpcHBpbmdSZWN0LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9jb21wdXRlT2Zmc2V0cy5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvZGV0ZWN0T3ZlcmZsb3cuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2NvbXB1dGVBdXRvUGxhY2VtZW50LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9tb2RpZmllcnMvZmxpcC5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvbW9kaWZpZXJzL2hpZGUuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL21vZGlmaWVycy9vZmZzZXQuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL21vZGlmaWVycy9wb3BwZXJPZmZzZXRzLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9nZXRBbHRBeGlzLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9tb2RpZmllcnMvcHJldmVudE92ZXJmbG93LmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0SFRNTEVsZW1lbnRTY3JvbGwuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2RvbS11dGlscy9nZXROb2RlU2Nyb2xsLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi9kb20tdXRpbHMvZ2V0Q29tcG9zaXRlUmVjdC5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvb3JkZXJNb2RpZmllcnMuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL2RlYm91bmNlLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy9mb3JtYXQuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL3V0aWxzL3ZhbGlkYXRlTW9kaWZpZXJzLmpzIiwibm9kZV9tb2R1bGVzL0Bwb3BwZXJqcy9jb3JlL2xpYi91dGlscy91bmlxdWVCeS5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvdXRpbHMvbWVyZ2VCeU5hbWUuanMiLCJub2RlX21vZHVsZXMvQHBvcHBlcmpzL2NvcmUvbGliL2NyZWF0ZVBvcHBlci5qcyIsIm5vZGVfbW9kdWxlcy9AcG9wcGVyanMvY29yZS9saWIvcG9wcGVyLmpzIiwic3JjL3N1Z2dlc3RlcnMvc3VnZ2VzdC50cyIsInNyYy9zdWdnZXN0ZXJzL0ZvbGRlclN1Z2dlc3Rlci50cyIsInNyYy9VdGlscy50cyIsInNyYy9zdWdnZXN0ZXJzL0ZpbGVTdWdnZXN0ZXIudHMiLCJzcmMvU2V0dGluZ3MudHMiLCJzcmMvRnV6enlTdWdnZXN0ZXIudHMiLCJzcmMvQ29uc3RhbnRzLnRzIiwic3JjL2Z1bmN0aW9ucy9pbnRlcm5hbF9mdW5jdGlvbnMvSW50ZXJuYWxNb2R1bGUudHMiLCJzcmMvZnVuY3Rpb25zL2ludGVybmFsX2Z1bmN0aW9ucy9kYXRlL0ludGVybmFsTW9kdWxlRGF0ZS50cyIsInNyYy9mdW5jdGlvbnMvaW50ZXJuYWxfZnVuY3Rpb25zL2ZpbGUvSW50ZXJuYWxNb2R1bGVGaWxlLnRzIiwic3JjL2Z1bmN0aW9ucy9pbnRlcm5hbF9mdW5jdGlvbnMvd2ViL0ludGVybmFsTW9kdWxlV2ViLnRzIiwic3JjL2Z1bmN0aW9ucy9pbnRlcm5hbF9mdW5jdGlvbnMvZnJvbnRtYXR0ZXIvSW50ZXJuYWxNb2R1bGVGcm9udG1hdHRlci50cyIsInNyYy9mdW5jdGlvbnMvaW50ZXJuYWxfZnVuY3Rpb25zL3N5c3RlbS9Qcm9tcHRNb2RhbC50cyIsInNyYy9mdW5jdGlvbnMvaW50ZXJuYWxfZnVuY3Rpb25zL3N5c3RlbS9TdWdnZXN0ZXJNb2RhbC50cyIsInNyYy9mdW5jdGlvbnMvaW50ZXJuYWxfZnVuY3Rpb25zL3N5c3RlbS9JbnRlcm5hbE1vZHVsZVN5c3RlbS50cyIsInNyYy9mdW5jdGlvbnMvaW50ZXJuYWxfZnVuY3Rpb25zL2NvbmZpZy9JbnRlcm5hbE1vZHVsZUNvbmZpZy50cyIsInNyYy9mdW5jdGlvbnMvaW50ZXJuYWxfZnVuY3Rpb25zL0ludGVybmFsRnVuY3Rpb25zLnRzIiwic3JjL2Z1bmN0aW9ucy91c2VyX2Z1bmN0aW9ucy9Vc2VyU3lzdGVtRnVuY3Rpb25zLnRzIiwic3JjL2Z1bmN0aW9ucy91c2VyX2Z1bmN0aW9ucy9Vc2VyU2NyaXB0RnVuY3Rpb25zLnRzIiwic3JjL2Z1bmN0aW9ucy91c2VyX2Z1bmN0aW9ucy9Vc2VyRnVuY3Rpb25zLnRzIiwic3JjL2Z1bmN0aW9ucy9GdW5jdGlvbnNHZW5lcmF0b3IudHMiLCJzcmMvZWRpdG9yL0N1cnNvckp1bXBlci50cyIsInNyYy9lZGl0b3IvbW9kZS9qYXZhc2NyaXB0LmpzIiwic3JjL2VkaXRvci9tb2RlL2N1c3RvbV9vdmVybGF5LmpzIiwic3JjL2VkaXRvci9FZGl0b3IudHMiLCJub2RlX21vZHVsZXMvZXRhL2Rpc3QvZXRhLmVzLmpzIiwic3JjL3BhcnNlci9QYXJzZXIudHMiLCJzcmMvVGVtcGxhdGVyLnRzIiwic3JjL0V2ZW50SGFuZGxlci50cyIsInNyYy9Db21tYW5kSGFuZGxlci50cyIsInNyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxyXG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXHJcblxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxyXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXHJcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxyXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXHJcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fY3JlYXRlQmluZGluZyA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgbykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBwKSkgX19jcmVhdGVCaW5kaW5nKG8sIG0sIHApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXlzKCkge1xyXG4gICAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciByID0gQXJyYXkocyksIGsgPSAwLCBpID0gMDsgaSA8IGlsOyBpKyspXHJcbiAgICAgICAgZm9yICh2YXIgYSA9IGFyZ3VtZW50c1tpXSwgaiA9IDAsIGpsID0gYS5sZW5ndGg7IGogPCBqbDsgaisrLCBrKyspXHJcbiAgICAgICAgICAgIHJba10gPSBhW2pdO1xyXG4gICAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5KHRvLCBmcm9tLCBwYWNrKSB7XHJcbiAgICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgIGlmIChhciB8fCAhKGkgaW4gZnJvbSkpIHtcclxuICAgICAgICAgICAgaWYgKCFhcikgYXIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tLCAwLCBpKTtcclxuICAgICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XHJcbn0pIDogZnVuY3Rpb24obywgdikge1xyXG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XHJcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHJlY2VpdmVyLCBzdGF0ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgZ2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgcmVhZCBwcml2YXRlIG1lbWJlciBmcm9tIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XHJcbiAgICByZXR1cm4ga2luZCA9PT0gXCJtXCIgPyBmIDoga2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIpIDogZiA/IGYudmFsdWUgOiBzdGF0ZS5nZXQocmVjZWl2ZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgc3RhdGUsIHZhbHVlLCBraW5kLCBmKSB7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJtXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIG1ldGhvZCBpcyBub3Qgd3JpdGFibGVcIik7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBzZXR0ZXJcIik7XHJcbiAgICBpZiAodHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciAhPT0gc3RhdGUgfHwgIWYgOiAhc3RhdGUuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCB3cml0ZSBwcml2YXRlIG1lbWJlciB0byBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIChraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlciwgdmFsdWUpIDogZiA/IGYudmFsdWUgPSB2YWx1ZSA6IHN0YXRlLnNldChyZWNlaXZlciwgdmFsdWUpKSwgdmFsdWU7XHJcbn1cclxuIiwiaW1wb3J0IHsgTm90aWNlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBUZW1wbGF0ZXJFcnJvciB9IGZyb20gXCJFcnJvclwiO1xuXG5leHBvcnQgZnVuY3Rpb24gbG9nX3VwZGF0ZShtc2c6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IG5vdGljZSA9IG5ldyBOb3RpY2UoXCJcIiwgMTUwMDApO1xuICAgIC8vIFRPRE86IEZpbmQgYmV0dGVyIHdheSBmb3IgdGhpc1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBub3RpY2Uubm90aWNlRWwuaW5uZXJIVE1MID0gYDxiPlRlbXBsYXRlciB1cGRhdGU8L2I+Ojxici8+JHttc2d9YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ19lcnJvcihlOiBFcnJvciB8IFRlbXBsYXRlckVycm9yKTogdm9pZCB7XG4gICAgY29uc3Qgbm90aWNlID0gbmV3IE5vdGljZShcIlwiLCA4MDAwKTtcbiAgICBpZiAoZSBpbnN0YW5jZW9mIFRlbXBsYXRlckVycm9yICYmIGUuY29uc29sZV9tc2cpIHtcbiAgICAgICAgLy8gVE9ETzogRmluZCBhIGJldHRlciB3YXkgZm9yIHRoaXNcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBub3RpY2Uubm90aWNlRWwuaW5uZXJIVE1MID0gYDxiPlRlbXBsYXRlciBFcnJvcjwvYj46PGJyLz4ke2UubWVzc2FnZX08YnIvPkNoZWNrIGNvbnNvbGUgZm9yIG1vcmUgaW5mb3JtYXRpb25zYDtcbiAgICAgICAgY29uc29sZS5lcnJvcihgVGVtcGxhdGVyIEVycm9yOmAsIGUubWVzc2FnZSwgXCJcXG5cIiwgZS5jb25zb2xlX21zZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBub3RpY2Uubm90aWNlRWwuaW5uZXJIVE1MID0gYDxiPlRlbXBsYXRlciBFcnJvcjwvYj46PGJyLz4ke2UubWVzc2FnZX1gO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IGxvZ19lcnJvciB9IGZyb20gXCJMb2dcIjtcblxuZXhwb3J0IGNsYXNzIFRlbXBsYXRlckVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1zZzogc3RyaW5nLCBwdWJsaWMgY29uc29sZV9tc2c/OiBzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIobXNnKTtcbiAgICAgICAgdGhpcy5uYW1lID0gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yKTtcbiAgICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBlcnJvcldyYXBwZXIoZm46IEZ1bmN0aW9uLCBtc2c6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IGZuKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoIShlIGluc3RhbmNlb2YgVGVtcGxhdGVyRXJyb3IpKSB7XG4gICAgICAgICAgICBsb2dfZXJyb3IobmV3IFRlbXBsYXRlckVycm9yKG1zZywgZS5tZXNzYWdlKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsb2dfZXJyb3IoZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZXJyb3JXcmFwcGVyU3luYyhmbjogRnVuY3Rpb24sIG1zZzogc3RyaW5nKTogYW55IHtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gZm4oKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGxvZ19lcnJvcihuZXcgVGVtcGxhdGVyRXJyb3IobXNnLCBlLm1lc3NhZ2UpKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufVxuIiwiZXhwb3J0IHZhciB0b3AgPSAndG9wJztcbmV4cG9ydCB2YXIgYm90dG9tID0gJ2JvdHRvbSc7XG5leHBvcnQgdmFyIHJpZ2h0ID0gJ3JpZ2h0JztcbmV4cG9ydCB2YXIgbGVmdCA9ICdsZWZ0JztcbmV4cG9ydCB2YXIgYXV0byA9ICdhdXRvJztcbmV4cG9ydCB2YXIgYmFzZVBsYWNlbWVudHMgPSBbdG9wLCBib3R0b20sIHJpZ2h0LCBsZWZ0XTtcbmV4cG9ydCB2YXIgc3RhcnQgPSAnc3RhcnQnO1xuZXhwb3J0IHZhciBlbmQgPSAnZW5kJztcbmV4cG9ydCB2YXIgY2xpcHBpbmdQYXJlbnRzID0gJ2NsaXBwaW5nUGFyZW50cyc7XG5leHBvcnQgdmFyIHZpZXdwb3J0ID0gJ3ZpZXdwb3J0JztcbmV4cG9ydCB2YXIgcG9wcGVyID0gJ3BvcHBlcic7XG5leHBvcnQgdmFyIHJlZmVyZW5jZSA9ICdyZWZlcmVuY2UnO1xuZXhwb3J0IHZhciB2YXJpYXRpb25QbGFjZW1lbnRzID0gLyojX19QVVJFX18qL2Jhc2VQbGFjZW1lbnRzLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBwbGFjZW1lbnQpIHtcbiAgcmV0dXJuIGFjYy5jb25jYXQoW3BsYWNlbWVudCArIFwiLVwiICsgc3RhcnQsIHBsYWNlbWVudCArIFwiLVwiICsgZW5kXSk7XG59LCBbXSk7XG5leHBvcnQgdmFyIHBsYWNlbWVudHMgPSAvKiNfX1BVUkVfXyovW10uY29uY2F0KGJhc2VQbGFjZW1lbnRzLCBbYXV0b10pLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBwbGFjZW1lbnQpIHtcbiAgcmV0dXJuIGFjYy5jb25jYXQoW3BsYWNlbWVudCwgcGxhY2VtZW50ICsgXCItXCIgKyBzdGFydCwgcGxhY2VtZW50ICsgXCItXCIgKyBlbmRdKTtcbn0sIFtdKTsgLy8gbW9kaWZpZXJzIHRoYXQgbmVlZCB0byByZWFkIHRoZSBET01cblxuZXhwb3J0IHZhciBiZWZvcmVSZWFkID0gJ2JlZm9yZVJlYWQnO1xuZXhwb3J0IHZhciByZWFkID0gJ3JlYWQnO1xuZXhwb3J0IHZhciBhZnRlclJlYWQgPSAnYWZ0ZXJSZWFkJzsgLy8gcHVyZS1sb2dpYyBtb2RpZmllcnNcblxuZXhwb3J0IHZhciBiZWZvcmVNYWluID0gJ2JlZm9yZU1haW4nO1xuZXhwb3J0IHZhciBtYWluID0gJ21haW4nO1xuZXhwb3J0IHZhciBhZnRlck1haW4gPSAnYWZ0ZXJNYWluJzsgLy8gbW9kaWZpZXIgd2l0aCB0aGUgcHVycG9zZSB0byB3cml0ZSB0byB0aGUgRE9NIChvciB3cml0ZSBpbnRvIGEgZnJhbWV3b3JrIHN0YXRlKVxuXG5leHBvcnQgdmFyIGJlZm9yZVdyaXRlID0gJ2JlZm9yZVdyaXRlJztcbmV4cG9ydCB2YXIgd3JpdGUgPSAnd3JpdGUnO1xuZXhwb3J0IHZhciBhZnRlcldyaXRlID0gJ2FmdGVyV3JpdGUnO1xuZXhwb3J0IHZhciBtb2RpZmllclBoYXNlcyA9IFtiZWZvcmVSZWFkLCByZWFkLCBhZnRlclJlYWQsIGJlZm9yZU1haW4sIG1haW4sIGFmdGVyTWFpbiwgYmVmb3JlV3JpdGUsIHdyaXRlLCBhZnRlcldyaXRlXTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXROb2RlTmFtZShlbGVtZW50KSB7XG4gIHJldHVybiBlbGVtZW50ID8gKGVsZW1lbnQubm9kZU5hbWUgfHwgJycpLnRvTG93ZXJDYXNlKCkgOiBudWxsO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFdpbmRvdyhub2RlKSB7XG4gIGlmIChub2RlID09IG51bGwpIHtcbiAgICByZXR1cm4gd2luZG93O1xuICB9XG5cbiAgaWYgKG5vZGUudG9TdHJpbmcoKSAhPT0gJ1tvYmplY3QgV2luZG93XScpIHtcbiAgICB2YXIgb3duZXJEb2N1bWVudCA9IG5vZGUub3duZXJEb2N1bWVudDtcbiAgICByZXR1cm4gb3duZXJEb2N1bWVudCA/IG93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXcgfHwgd2luZG93IDogd2luZG93O1xuICB9XG5cbiAgcmV0dXJuIG5vZGU7XG59IiwiaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi9nZXRXaW5kb3cuanNcIjtcblxuZnVuY3Rpb24gaXNFbGVtZW50KG5vZGUpIHtcbiAgdmFyIE93bkVsZW1lbnQgPSBnZXRXaW5kb3cobm9kZSkuRWxlbWVudDtcbiAgcmV0dXJuIG5vZGUgaW5zdGFuY2VvZiBPd25FbGVtZW50IHx8IG5vZGUgaW5zdGFuY2VvZiBFbGVtZW50O1xufVxuXG5mdW5jdGlvbiBpc0hUTUxFbGVtZW50KG5vZGUpIHtcbiAgdmFyIE93bkVsZW1lbnQgPSBnZXRXaW5kb3cobm9kZSkuSFRNTEVsZW1lbnQ7XG4gIHJldHVybiBub2RlIGluc3RhbmNlb2YgT3duRWxlbWVudCB8fCBub2RlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIGlzU2hhZG93Um9vdChub2RlKSB7XG4gIC8vIElFIDExIGhhcyBubyBTaGFkb3dSb290XG4gIGlmICh0eXBlb2YgU2hhZG93Um9vdCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgT3duRWxlbWVudCA9IGdldFdpbmRvdyhub2RlKS5TaGFkb3dSb290O1xuICByZXR1cm4gbm9kZSBpbnN0YW5jZW9mIE93bkVsZW1lbnQgfHwgbm9kZSBpbnN0YW5jZW9mIFNoYWRvd1Jvb3Q7XG59XG5cbmV4cG9ydCB7IGlzRWxlbWVudCwgaXNIVE1MRWxlbWVudCwgaXNTaGFkb3dSb290IH07IiwiaW1wb3J0IGdldE5vZGVOYW1lIGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0Tm9kZU5hbWUuanNcIjtcbmltcG9ydCB7IGlzSFRNTEVsZW1lbnQgfSBmcm9tIFwiLi4vZG9tLXV0aWxzL2luc3RhbmNlT2YuanNcIjsgLy8gVGhpcyBtb2RpZmllciB0YWtlcyB0aGUgc3R5bGVzIHByZXBhcmVkIGJ5IHRoZSBgY29tcHV0ZVN0eWxlc2AgbW9kaWZpZXJcbi8vIGFuZCBhcHBsaWVzIHRoZW0gdG8gdGhlIEhUTUxFbGVtZW50cyBzdWNoIGFzIHBvcHBlciBhbmQgYXJyb3dcblxuZnVuY3Rpb24gYXBwbHlTdHlsZXMoX3JlZikge1xuICB2YXIgc3RhdGUgPSBfcmVmLnN0YXRlO1xuICBPYmplY3Qua2V5cyhzdGF0ZS5lbGVtZW50cykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciBzdHlsZSA9IHN0YXRlLnN0eWxlc1tuYW1lXSB8fCB7fTtcbiAgICB2YXIgYXR0cmlidXRlcyA9IHN0YXRlLmF0dHJpYnV0ZXNbbmFtZV0gfHwge307XG4gICAgdmFyIGVsZW1lbnQgPSBzdGF0ZS5lbGVtZW50c1tuYW1lXTsgLy8gYXJyb3cgaXMgb3B0aW9uYWwgKyB2aXJ0dWFsIGVsZW1lbnRzXG5cbiAgICBpZiAoIWlzSFRNTEVsZW1lbnQoZWxlbWVudCkgfHwgIWdldE5vZGVOYW1lKGVsZW1lbnQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfSAvLyBGbG93IGRvZXNuJ3Qgc3VwcG9ydCB0byBleHRlbmQgdGhpcyBwcm9wZXJ0eSwgYnV0IGl0J3MgdGhlIG1vc3RcbiAgICAvLyBlZmZlY3RpdmUgd2F5IHRvIGFwcGx5IHN0eWxlcyB0byBhbiBIVE1MRWxlbWVudFxuICAgIC8vICRGbG93Rml4TWVbY2Fubm90LXdyaXRlXVxuXG5cbiAgICBPYmplY3QuYXNzaWduKGVsZW1lbnQuc3R5bGUsIHN0eWxlKTtcbiAgICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICB2YXIgdmFsdWUgPSBhdHRyaWJ1dGVzW25hbWVdO1xuXG4gICAgICBpZiAodmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUgPT09IHRydWUgPyAnJyA6IHZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGVmZmVjdChfcmVmMikge1xuICB2YXIgc3RhdGUgPSBfcmVmMi5zdGF0ZTtcbiAgdmFyIGluaXRpYWxTdHlsZXMgPSB7XG4gICAgcG9wcGVyOiB7XG4gICAgICBwb3NpdGlvbjogc3RhdGUub3B0aW9ucy5zdHJhdGVneSxcbiAgICAgIGxlZnQ6ICcwJyxcbiAgICAgIHRvcDogJzAnLFxuICAgICAgbWFyZ2luOiAnMCdcbiAgICB9LFxuICAgIGFycm93OiB7XG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJ1xuICAgIH0sXG4gICAgcmVmZXJlbmNlOiB7fVxuICB9O1xuICBPYmplY3QuYXNzaWduKHN0YXRlLmVsZW1lbnRzLnBvcHBlci5zdHlsZSwgaW5pdGlhbFN0eWxlcy5wb3BwZXIpO1xuICBzdGF0ZS5zdHlsZXMgPSBpbml0aWFsU3R5bGVzO1xuXG4gIGlmIChzdGF0ZS5lbGVtZW50cy5hcnJvdykge1xuICAgIE9iamVjdC5hc3NpZ24oc3RhdGUuZWxlbWVudHMuYXJyb3cuc3R5bGUsIGluaXRpYWxTdHlsZXMuYXJyb3cpO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBPYmplY3Qua2V5cyhzdGF0ZS5lbGVtZW50cykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgdmFyIGVsZW1lbnQgPSBzdGF0ZS5lbGVtZW50c1tuYW1lXTtcbiAgICAgIHZhciBhdHRyaWJ1dGVzID0gc3RhdGUuYXR0cmlidXRlc1tuYW1lXSB8fCB7fTtcbiAgICAgIHZhciBzdHlsZVByb3BlcnRpZXMgPSBPYmplY3Qua2V5cyhzdGF0ZS5zdHlsZXMuaGFzT3duUHJvcGVydHkobmFtZSkgPyBzdGF0ZS5zdHlsZXNbbmFtZV0gOiBpbml0aWFsU3R5bGVzW25hbWVdKTsgLy8gU2V0IGFsbCB2YWx1ZXMgdG8gYW4gZW1wdHkgc3RyaW5nIHRvIHVuc2V0IHRoZW1cblxuICAgICAgdmFyIHN0eWxlID0gc3R5bGVQcm9wZXJ0aWVzLnJlZHVjZShmdW5jdGlvbiAoc3R5bGUsIHByb3BlcnR5KSB7XG4gICAgICAgIHN0eWxlW3Byb3BlcnR5XSA9ICcnO1xuICAgICAgICByZXR1cm4gc3R5bGU7XG4gICAgICB9LCB7fSk7IC8vIGFycm93IGlzIG9wdGlvbmFsICsgdmlydHVhbCBlbGVtZW50c1xuXG4gICAgICBpZiAoIWlzSFRNTEVsZW1lbnQoZWxlbWVudCkgfHwgIWdldE5vZGVOYW1lKGVsZW1lbnQpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgT2JqZWN0LmFzc2lnbihlbGVtZW50LnN0eWxlLCBzdHlsZSk7XG4gICAgICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xufSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnYXBwbHlTdHlsZXMnLFxuICBlbmFibGVkOiB0cnVlLFxuICBwaGFzZTogJ3dyaXRlJyxcbiAgZm46IGFwcGx5U3R5bGVzLFxuICBlZmZlY3Q6IGVmZmVjdCxcbiAgcmVxdWlyZXM6IFsnY29tcHV0ZVN0eWxlcyddXG59OyIsImltcG9ydCB7IGF1dG8gfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldEJhc2VQbGFjZW1lbnQocGxhY2VtZW50KSB7XG4gIHJldHVybiBwbGFjZW1lbnQuc3BsaXQoJy0nKVswXTtcbn0iLCIvLyBpbXBvcnQgeyBpc0hUTUxFbGVtZW50IH0gZnJvbSAnLi9pbnN0YW5jZU9mJztcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldEJvdW5kaW5nQ2xpZW50UmVjdChlbGVtZW50LCAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgdW51c2VkLWltcG9ydHMvbm8tdW51c2VkLXZhcnNcbmluY2x1ZGVTY2FsZSkge1xuICBpZiAoaW5jbHVkZVNjYWxlID09PSB2b2lkIDApIHtcbiAgICBpbmNsdWRlU2NhbGUgPSBmYWxzZTtcbiAgfVxuXG4gIHZhciByZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgdmFyIHNjYWxlWCA9IDE7XG4gIHZhciBzY2FsZVkgPSAxOyAvLyBGSVhNRTpcbiAgLy8gYG9mZnNldFdpZHRoYCByZXR1cm5zIGFuIGludGVnZXIgd2hpbGUgYGdldEJvdW5kaW5nQ2xpZW50UmVjdGBcbiAgLy8gcmV0dXJucyBhIGZsb2F0LiBUaGlzIHJlc3VsdHMgaW4gYHNjYWxlWGAgb3IgYHNjYWxlWWAgYmVpbmdcbiAgLy8gbm9uLTEgd2hlbiBpdCBzaG91bGQgYmUgZm9yIGVsZW1lbnRzIHRoYXQgYXJlbid0IGEgZnVsbCBwaXhlbCBpblxuICAvLyB3aWR0aCBvciBoZWlnaHQuXG4gIC8vIGlmIChpc0hUTUxFbGVtZW50KGVsZW1lbnQpICYmIGluY2x1ZGVTY2FsZSkge1xuICAvLyAgIGNvbnN0IG9mZnNldEhlaWdodCA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAvLyAgIGNvbnN0IG9mZnNldFdpZHRoID0gZWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgLy8gICAvLyBEbyBub3QgYXR0ZW1wdCB0byBkaXZpZGUgYnkgMCwgb3RoZXJ3aXNlIHdlIGdldCBgSW5maW5pdHlgIGFzIHNjYWxlXG4gIC8vICAgLy8gRmFsbGJhY2sgdG8gMSBpbiBjYXNlIGJvdGggdmFsdWVzIGFyZSBgMGBcbiAgLy8gICBpZiAob2Zmc2V0V2lkdGggPiAwKSB7XG4gIC8vICAgICBzY2FsZVggPSByZWN0LndpZHRoIC8gb2Zmc2V0V2lkdGggfHwgMTtcbiAgLy8gICB9XG4gIC8vICAgaWYgKG9mZnNldEhlaWdodCA+IDApIHtcbiAgLy8gICAgIHNjYWxlWSA9IHJlY3QuaGVpZ2h0IC8gb2Zmc2V0SGVpZ2h0IHx8IDE7XG4gIC8vICAgfVxuICAvLyB9XG5cbiAgcmV0dXJuIHtcbiAgICB3aWR0aDogcmVjdC53aWR0aCAvIHNjYWxlWCxcbiAgICBoZWlnaHQ6IHJlY3QuaGVpZ2h0IC8gc2NhbGVZLFxuICAgIHRvcDogcmVjdC50b3AgLyBzY2FsZVksXG4gICAgcmlnaHQ6IHJlY3QucmlnaHQgLyBzY2FsZVgsXG4gICAgYm90dG9tOiByZWN0LmJvdHRvbSAvIHNjYWxlWSxcbiAgICBsZWZ0OiByZWN0LmxlZnQgLyBzY2FsZVgsXG4gICAgeDogcmVjdC5sZWZ0IC8gc2NhbGVYLFxuICAgIHk6IHJlY3QudG9wIC8gc2NhbGVZXG4gIH07XG59IiwiaW1wb3J0IGdldEJvdW5kaW5nQ2xpZW50UmVjdCBmcm9tIFwiLi9nZXRCb3VuZGluZ0NsaWVudFJlY3QuanNcIjsgLy8gUmV0dXJucyB0aGUgbGF5b3V0IHJlY3Qgb2YgYW4gZWxlbWVudCByZWxhdGl2ZSB0byBpdHMgb2Zmc2V0UGFyZW50LiBMYXlvdXRcbi8vIG1lYW5zIGl0IGRvZXNuJ3QgdGFrZSBpbnRvIGFjY291bnQgdHJhbnNmb3Jtcy5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0TGF5b3V0UmVjdChlbGVtZW50KSB7XG4gIHZhciBjbGllbnRSZWN0ID0gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KGVsZW1lbnQpOyAvLyBVc2UgdGhlIGNsaWVudFJlY3Qgc2l6ZXMgaWYgaXQncyBub3QgYmVlbiB0cmFuc2Zvcm1lZC5cbiAgLy8gRml4ZXMgaHR0cHM6Ly9naXRodWIuY29tL3BvcHBlcmpzL3BvcHBlci1jb3JlL2lzc3Vlcy8xMjIzXG5cbiAgdmFyIHdpZHRoID0gZWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgdmFyIGhlaWdodCA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuXG4gIGlmIChNYXRoLmFicyhjbGllbnRSZWN0LndpZHRoIC0gd2lkdGgpIDw9IDEpIHtcbiAgICB3aWR0aCA9IGNsaWVudFJlY3Qud2lkdGg7XG4gIH1cblxuICBpZiAoTWF0aC5hYnMoY2xpZW50UmVjdC5oZWlnaHQgLSBoZWlnaHQpIDw9IDEpIHtcbiAgICBoZWlnaHQgPSBjbGllbnRSZWN0LmhlaWdodDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgeDogZWxlbWVudC5vZmZzZXRMZWZ0LFxuICAgIHk6IGVsZW1lbnQub2Zmc2V0VG9wLFxuICAgIHdpZHRoOiB3aWR0aCxcbiAgICBoZWlnaHQ6IGhlaWdodFxuICB9O1xufSIsImltcG9ydCB7IGlzU2hhZG93Um9vdCB9IGZyb20gXCIuL2luc3RhbmNlT2YuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbnRhaW5zKHBhcmVudCwgY2hpbGQpIHtcbiAgdmFyIHJvb3ROb2RlID0gY2hpbGQuZ2V0Um9vdE5vZGUgJiYgY2hpbGQuZ2V0Um9vdE5vZGUoKTsgLy8gRmlyc3QsIGF0dGVtcHQgd2l0aCBmYXN0ZXIgbmF0aXZlIG1ldGhvZFxuXG4gIGlmIChwYXJlbnQuY29udGFpbnMoY2hpbGQpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gLy8gdGhlbiBmYWxsYmFjayB0byBjdXN0b20gaW1wbGVtZW50YXRpb24gd2l0aCBTaGFkb3cgRE9NIHN1cHBvcnRcbiAgZWxzZSBpZiAocm9vdE5vZGUgJiYgaXNTaGFkb3dSb290KHJvb3ROb2RlKSkge1xuICAgICAgdmFyIG5leHQgPSBjaGlsZDtcblxuICAgICAgZG8ge1xuICAgICAgICBpZiAobmV4dCAmJiBwYXJlbnQuaXNTYW1lTm9kZShuZXh0KSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IC8vICRGbG93Rml4TWVbcHJvcC1taXNzaW5nXTogbmVlZCBhIGJldHRlciB3YXkgdG8gaGFuZGxlIHRoaXMuLi5cblxuXG4gICAgICAgIG5leHQgPSBuZXh0LnBhcmVudE5vZGUgfHwgbmV4dC5ob3N0O1xuICAgICAgfSB3aGlsZSAobmV4dCk7XG4gICAgfSAvLyBHaXZlIHVwLCB0aGUgcmVzdWx0IGlzIGZhbHNlXG5cblxuICByZXR1cm4gZmFsc2U7XG59IiwiaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi9nZXRXaW5kb3cuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkge1xuICByZXR1cm4gZ2V0V2luZG93KGVsZW1lbnQpLmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XG59IiwiaW1wb3J0IGdldE5vZGVOYW1lIGZyb20gXCIuL2dldE5vZGVOYW1lLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc1RhYmxlRWxlbWVudChlbGVtZW50KSB7XG4gIHJldHVybiBbJ3RhYmxlJywgJ3RkJywgJ3RoJ10uaW5kZXhPZihnZXROb2RlTmFtZShlbGVtZW50KSkgPj0gMDtcbn0iLCJpbXBvcnQgeyBpc0VsZW1lbnQgfSBmcm9tIFwiLi9pbnN0YW5jZU9mLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXREb2N1bWVudEVsZW1lbnQoZWxlbWVudCkge1xuICAvLyAkRmxvd0ZpeE1lW2luY29tcGF0aWJsZS1yZXR1cm5dOiBhc3N1bWUgYm9keSBpcyBhbHdheXMgYXZhaWxhYmxlXG4gIHJldHVybiAoKGlzRWxlbWVudChlbGVtZW50KSA/IGVsZW1lbnQub3duZXJEb2N1bWVudCA6IC8vICRGbG93Rml4TWVbcHJvcC1taXNzaW5nXVxuICBlbGVtZW50LmRvY3VtZW50KSB8fCB3aW5kb3cuZG9jdW1lbnQpLmRvY3VtZW50RWxlbWVudDtcbn0iLCJpbXBvcnQgZ2V0Tm9kZU5hbWUgZnJvbSBcIi4vZ2V0Tm9kZU5hbWUuanNcIjtcbmltcG9ydCBnZXREb2N1bWVudEVsZW1lbnQgZnJvbSBcIi4vZ2V0RG9jdW1lbnRFbGVtZW50LmpzXCI7XG5pbXBvcnQgeyBpc1NoYWRvd1Jvb3QgfSBmcm9tIFwiLi9pbnN0YW5jZU9mLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRQYXJlbnROb2RlKGVsZW1lbnQpIHtcbiAgaWYgKGdldE5vZGVOYW1lKGVsZW1lbnQpID09PSAnaHRtbCcpIHtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIHJldHVybiAoLy8gdGhpcyBpcyBhIHF1aWNrZXIgKGJ1dCBsZXNzIHR5cGUgc2FmZSkgd2F5IHRvIHNhdmUgcXVpdGUgc29tZSBieXRlcyBmcm9tIHRoZSBidW5kbGVcbiAgICAvLyAkRmxvd0ZpeE1lW2luY29tcGF0aWJsZS1yZXR1cm5dXG4gICAgLy8gJEZsb3dGaXhNZVtwcm9wLW1pc3NpbmddXG4gICAgZWxlbWVudC5hc3NpZ25lZFNsb3QgfHwgLy8gc3RlcCBpbnRvIHRoZSBzaGFkb3cgRE9NIG9mIHRoZSBwYXJlbnQgb2YgYSBzbG90dGVkIG5vZGVcbiAgICBlbGVtZW50LnBhcmVudE5vZGUgfHwgKCAvLyBET00gRWxlbWVudCBkZXRlY3RlZFxuICAgIGlzU2hhZG93Um9vdChlbGVtZW50KSA/IGVsZW1lbnQuaG9zdCA6IG51bGwpIHx8IC8vIFNoYWRvd1Jvb3QgZGV0ZWN0ZWRcbiAgICAvLyAkRmxvd0ZpeE1lW2luY29tcGF0aWJsZS1jYWxsXTogSFRNTEVsZW1lbnQgaXMgYSBOb2RlXG4gICAgZ2V0RG9jdW1lbnRFbGVtZW50KGVsZW1lbnQpIC8vIGZhbGxiYWNrXG5cbiAgKTtcbn0iLCJpbXBvcnQgZ2V0V2luZG93IGZyb20gXCIuL2dldFdpbmRvdy5qc1wiO1xuaW1wb3J0IGdldE5vZGVOYW1lIGZyb20gXCIuL2dldE5vZGVOYW1lLmpzXCI7XG5pbXBvcnQgZ2V0Q29tcHV0ZWRTdHlsZSBmcm9tIFwiLi9nZXRDb21wdXRlZFN0eWxlLmpzXCI7XG5pbXBvcnQgeyBpc0hUTUxFbGVtZW50IH0gZnJvbSBcIi4vaW5zdGFuY2VPZi5qc1wiO1xuaW1wb3J0IGlzVGFibGVFbGVtZW50IGZyb20gXCIuL2lzVGFibGVFbGVtZW50LmpzXCI7XG5pbXBvcnQgZ2V0UGFyZW50Tm9kZSBmcm9tIFwiLi9nZXRQYXJlbnROb2RlLmpzXCI7XG5cbmZ1bmN0aW9uIGdldFRydWVPZmZzZXRQYXJlbnQoZWxlbWVudCkge1xuICBpZiAoIWlzSFRNTEVsZW1lbnQoZWxlbWVudCkgfHwgLy8gaHR0cHM6Ly9naXRodWIuY29tL3BvcHBlcmpzL3BvcHBlci1jb3JlL2lzc3Vlcy84MzdcbiAgZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5wb3NpdGlvbiA9PT0gJ2ZpeGVkJykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnQub2Zmc2V0UGFyZW50O1xufSAvLyBgLm9mZnNldFBhcmVudGAgcmVwb3J0cyBgbnVsbGAgZm9yIGZpeGVkIGVsZW1lbnRzLCB3aGlsZSBhYnNvbHV0ZSBlbGVtZW50c1xuLy8gcmV0dXJuIHRoZSBjb250YWluaW5nIGJsb2NrXG5cblxuZnVuY3Rpb24gZ2V0Q29udGFpbmluZ0Jsb2NrKGVsZW1lbnQpIHtcbiAgdmFyIGlzRmlyZWZveCA9IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdmaXJlZm94JykgIT09IC0xO1xuICB2YXIgaXNJRSA9IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignVHJpZGVudCcpICE9PSAtMTtcblxuICBpZiAoaXNJRSAmJiBpc0hUTUxFbGVtZW50KGVsZW1lbnQpKSB7XG4gICAgLy8gSW4gSUUgOSwgMTAgYW5kIDExIGZpeGVkIGVsZW1lbnRzIGNvbnRhaW5pbmcgYmxvY2sgaXMgYWx3YXlzIGVzdGFibGlzaGVkIGJ5IHRoZSB2aWV3cG9ydFxuICAgIHZhciBlbGVtZW50Q3NzID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KTtcblxuICAgIGlmIChlbGVtZW50Q3NzLnBvc2l0aW9uID09PSAnZml4ZWQnKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICB2YXIgY3VycmVudE5vZGUgPSBnZXRQYXJlbnROb2RlKGVsZW1lbnQpO1xuXG4gIHdoaWxlIChpc0hUTUxFbGVtZW50KGN1cnJlbnROb2RlKSAmJiBbJ2h0bWwnLCAnYm9keSddLmluZGV4T2YoZ2V0Tm9kZU5hbWUoY3VycmVudE5vZGUpKSA8IDApIHtcbiAgICB2YXIgY3NzID0gZ2V0Q29tcHV0ZWRTdHlsZShjdXJyZW50Tm9kZSk7IC8vIFRoaXMgaXMgbm9uLWV4aGF1c3RpdmUgYnV0IGNvdmVycyB0aGUgbW9zdCBjb21tb24gQ1NTIHByb3BlcnRpZXMgdGhhdFxuICAgIC8vIGNyZWF0ZSBhIGNvbnRhaW5pbmcgYmxvY2suXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQ1NTL0NvbnRhaW5pbmdfYmxvY2sjaWRlbnRpZnlpbmdfdGhlX2NvbnRhaW5pbmdfYmxvY2tcblxuICAgIGlmIChjc3MudHJhbnNmb3JtICE9PSAnbm9uZScgfHwgY3NzLnBlcnNwZWN0aXZlICE9PSAnbm9uZScgfHwgY3NzLmNvbnRhaW4gPT09ICdwYWludCcgfHwgWyd0cmFuc2Zvcm0nLCAncGVyc3BlY3RpdmUnXS5pbmRleE9mKGNzcy53aWxsQ2hhbmdlKSAhPT0gLTEgfHwgaXNGaXJlZm94ICYmIGNzcy53aWxsQ2hhbmdlID09PSAnZmlsdGVyJyB8fCBpc0ZpcmVmb3ggJiYgY3NzLmZpbHRlciAmJiBjc3MuZmlsdGVyICE9PSAnbm9uZScpIHtcbiAgICAgIHJldHVybiBjdXJyZW50Tm9kZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVudE5vZGUgPSBjdXJyZW50Tm9kZS5wYXJlbnROb2RlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufSAvLyBHZXRzIHRoZSBjbG9zZXN0IGFuY2VzdG9yIHBvc2l0aW9uZWQgZWxlbWVudC4gSGFuZGxlcyBzb21lIGVkZ2UgY2FzZXMsXG4vLyBzdWNoIGFzIHRhYmxlIGFuY2VzdG9ycyBhbmQgY3Jvc3MgYnJvd3NlciBidWdzLlxuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldE9mZnNldFBhcmVudChlbGVtZW50KSB7XG4gIHZhciB3aW5kb3cgPSBnZXRXaW5kb3coZWxlbWVudCk7XG4gIHZhciBvZmZzZXRQYXJlbnQgPSBnZXRUcnVlT2Zmc2V0UGFyZW50KGVsZW1lbnQpO1xuXG4gIHdoaWxlIChvZmZzZXRQYXJlbnQgJiYgaXNUYWJsZUVsZW1lbnQob2Zmc2V0UGFyZW50KSAmJiBnZXRDb21wdXRlZFN0eWxlKG9mZnNldFBhcmVudCkucG9zaXRpb24gPT09ICdzdGF0aWMnKSB7XG4gICAgb2Zmc2V0UGFyZW50ID0gZ2V0VHJ1ZU9mZnNldFBhcmVudChvZmZzZXRQYXJlbnQpO1xuICB9XG5cbiAgaWYgKG9mZnNldFBhcmVudCAmJiAoZ2V0Tm9kZU5hbWUob2Zmc2V0UGFyZW50KSA9PT0gJ2h0bWwnIHx8IGdldE5vZGVOYW1lKG9mZnNldFBhcmVudCkgPT09ICdib2R5JyAmJiBnZXRDb21wdXRlZFN0eWxlKG9mZnNldFBhcmVudCkucG9zaXRpb24gPT09ICdzdGF0aWMnKSkge1xuICAgIHJldHVybiB3aW5kb3c7XG4gIH1cblxuICByZXR1cm4gb2Zmc2V0UGFyZW50IHx8IGdldENvbnRhaW5pbmdCbG9jayhlbGVtZW50KSB8fCB3aW5kb3c7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0TWFpbkF4aXNGcm9tUGxhY2VtZW50KHBsYWNlbWVudCkge1xuICByZXR1cm4gWyd0b3AnLCAnYm90dG9tJ10uaW5kZXhPZihwbGFjZW1lbnQpID49IDAgPyAneCcgOiAneSc7XG59IiwiZXhwb3J0IHZhciBtYXggPSBNYXRoLm1heDtcbmV4cG9ydCB2YXIgbWluID0gTWF0aC5taW47XG5leHBvcnQgdmFyIHJvdW5kID0gTWF0aC5yb3VuZDsiLCJpbXBvcnQgeyBtYXggYXMgbWF0aE1heCwgbWluIGFzIG1hdGhNaW4gfSBmcm9tIFwiLi9tYXRoLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB3aXRoaW4obWluLCB2YWx1ZSwgbWF4KSB7XG4gIHJldHVybiBtYXRoTWF4KG1pbiwgbWF0aE1pbih2YWx1ZSwgbWF4KSk7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0RnJlc2hTaWRlT2JqZWN0KCkge1xuICByZXR1cm4ge1xuICAgIHRvcDogMCxcbiAgICByaWdodDogMCxcbiAgICBib3R0b206IDAsXG4gICAgbGVmdDogMFxuICB9O1xufSIsImltcG9ydCBnZXRGcmVzaFNpZGVPYmplY3QgZnJvbSBcIi4vZ2V0RnJlc2hTaWRlT2JqZWN0LmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtZXJnZVBhZGRpbmdPYmplY3QocGFkZGluZ09iamVjdCkge1xuICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgZ2V0RnJlc2hTaWRlT2JqZWN0KCksIHBhZGRpbmdPYmplY3QpO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGV4cGFuZFRvSGFzaE1hcCh2YWx1ZSwga2V5cykge1xuICByZXR1cm4ga2V5cy5yZWR1Y2UoZnVuY3Rpb24gKGhhc2hNYXAsIGtleSkge1xuICAgIGhhc2hNYXBba2V5XSA9IHZhbHVlO1xuICAgIHJldHVybiBoYXNoTWFwO1xuICB9LCB7fSk7XG59IiwiaW1wb3J0IGdldEJhc2VQbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldEJhc2VQbGFjZW1lbnQuanNcIjtcbmltcG9ydCBnZXRMYXlvdXRSZWN0IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0TGF5b3V0UmVjdC5qc1wiO1xuaW1wb3J0IGNvbnRhaW5zIGZyb20gXCIuLi9kb20tdXRpbHMvY29udGFpbnMuanNcIjtcbmltcG9ydCBnZXRPZmZzZXRQYXJlbnQgZnJvbSBcIi4uL2RvbS11dGlscy9nZXRPZmZzZXRQYXJlbnQuanNcIjtcbmltcG9ydCBnZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldE1haW5BeGlzRnJvbVBsYWNlbWVudC5qc1wiO1xuaW1wb3J0IHdpdGhpbiBmcm9tIFwiLi4vdXRpbHMvd2l0aGluLmpzXCI7XG5pbXBvcnQgbWVyZ2VQYWRkaW5nT2JqZWN0IGZyb20gXCIuLi91dGlscy9tZXJnZVBhZGRpbmdPYmplY3QuanNcIjtcbmltcG9ydCBleHBhbmRUb0hhc2hNYXAgZnJvbSBcIi4uL3V0aWxzL2V4cGFuZFRvSGFzaE1hcC5qc1wiO1xuaW1wb3J0IHsgbGVmdCwgcmlnaHQsIGJhc2VQbGFjZW1lbnRzLCB0b3AsIGJvdHRvbSB9IGZyb20gXCIuLi9lbnVtcy5qc1wiO1xuaW1wb3J0IHsgaXNIVE1MRWxlbWVudCB9IGZyb20gXCIuLi9kb20tdXRpbHMvaW5zdGFuY2VPZi5qc1wiOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbnZhciB0b1BhZGRpbmdPYmplY3QgPSBmdW5jdGlvbiB0b1BhZGRpbmdPYmplY3QocGFkZGluZywgc3RhdGUpIHtcbiAgcGFkZGluZyA9IHR5cGVvZiBwYWRkaW5nID09PSAnZnVuY3Rpb24nID8gcGFkZGluZyhPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5yZWN0cywge1xuICAgIHBsYWNlbWVudDogc3RhdGUucGxhY2VtZW50XG4gIH0pKSA6IHBhZGRpbmc7XG4gIHJldHVybiBtZXJnZVBhZGRpbmdPYmplY3QodHlwZW9mIHBhZGRpbmcgIT09ICdudW1iZXInID8gcGFkZGluZyA6IGV4cGFuZFRvSGFzaE1hcChwYWRkaW5nLCBiYXNlUGxhY2VtZW50cykpO1xufTtcblxuZnVuY3Rpb24gYXJyb3coX3JlZikge1xuICB2YXIgX3N0YXRlJG1vZGlmaWVyc0RhdGEkO1xuXG4gIHZhciBzdGF0ZSA9IF9yZWYuc3RhdGUsXG4gICAgICBuYW1lID0gX3JlZi5uYW1lLFxuICAgICAgb3B0aW9ucyA9IF9yZWYub3B0aW9ucztcbiAgdmFyIGFycm93RWxlbWVudCA9IHN0YXRlLmVsZW1lbnRzLmFycm93O1xuICB2YXIgcG9wcGVyT2Zmc2V0cyA9IHN0YXRlLm1vZGlmaWVyc0RhdGEucG9wcGVyT2Zmc2V0cztcbiAgdmFyIGJhc2VQbGFjZW1lbnQgPSBnZXRCYXNlUGxhY2VtZW50KHN0YXRlLnBsYWNlbWVudCk7XG4gIHZhciBheGlzID0gZ2V0TWFpbkF4aXNGcm9tUGxhY2VtZW50KGJhc2VQbGFjZW1lbnQpO1xuICB2YXIgaXNWZXJ0aWNhbCA9IFtsZWZ0LCByaWdodF0uaW5kZXhPZihiYXNlUGxhY2VtZW50KSA+PSAwO1xuICB2YXIgbGVuID0gaXNWZXJ0aWNhbCA/ICdoZWlnaHQnIDogJ3dpZHRoJztcblxuICBpZiAoIWFycm93RWxlbWVudCB8fCAhcG9wcGVyT2Zmc2V0cykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBwYWRkaW5nT2JqZWN0ID0gdG9QYWRkaW5nT2JqZWN0KG9wdGlvbnMucGFkZGluZywgc3RhdGUpO1xuICB2YXIgYXJyb3dSZWN0ID0gZ2V0TGF5b3V0UmVjdChhcnJvd0VsZW1lbnQpO1xuICB2YXIgbWluUHJvcCA9IGF4aXMgPT09ICd5JyA/IHRvcCA6IGxlZnQ7XG4gIHZhciBtYXhQcm9wID0gYXhpcyA9PT0gJ3knID8gYm90dG9tIDogcmlnaHQ7XG4gIHZhciBlbmREaWZmID0gc3RhdGUucmVjdHMucmVmZXJlbmNlW2xlbl0gKyBzdGF0ZS5yZWN0cy5yZWZlcmVuY2VbYXhpc10gLSBwb3BwZXJPZmZzZXRzW2F4aXNdIC0gc3RhdGUucmVjdHMucG9wcGVyW2xlbl07XG4gIHZhciBzdGFydERpZmYgPSBwb3BwZXJPZmZzZXRzW2F4aXNdIC0gc3RhdGUucmVjdHMucmVmZXJlbmNlW2F4aXNdO1xuICB2YXIgYXJyb3dPZmZzZXRQYXJlbnQgPSBnZXRPZmZzZXRQYXJlbnQoYXJyb3dFbGVtZW50KTtcbiAgdmFyIGNsaWVudFNpemUgPSBhcnJvd09mZnNldFBhcmVudCA/IGF4aXMgPT09ICd5JyA/IGFycm93T2Zmc2V0UGFyZW50LmNsaWVudEhlaWdodCB8fCAwIDogYXJyb3dPZmZzZXRQYXJlbnQuY2xpZW50V2lkdGggfHwgMCA6IDA7XG4gIHZhciBjZW50ZXJUb1JlZmVyZW5jZSA9IGVuZERpZmYgLyAyIC0gc3RhcnREaWZmIC8gMjsgLy8gTWFrZSBzdXJlIHRoZSBhcnJvdyBkb2Vzbid0IG92ZXJmbG93IHRoZSBwb3BwZXIgaWYgdGhlIGNlbnRlciBwb2ludCBpc1xuICAvLyBvdXRzaWRlIG9mIHRoZSBwb3BwZXIgYm91bmRzXG5cbiAgdmFyIG1pbiA9IHBhZGRpbmdPYmplY3RbbWluUHJvcF07XG4gIHZhciBtYXggPSBjbGllbnRTaXplIC0gYXJyb3dSZWN0W2xlbl0gLSBwYWRkaW5nT2JqZWN0W21heFByb3BdO1xuICB2YXIgY2VudGVyID0gY2xpZW50U2l6ZSAvIDIgLSBhcnJvd1JlY3RbbGVuXSAvIDIgKyBjZW50ZXJUb1JlZmVyZW5jZTtcbiAgdmFyIG9mZnNldCA9IHdpdGhpbihtaW4sIGNlbnRlciwgbWF4KTsgLy8gUHJldmVudHMgYnJlYWtpbmcgc3ludGF4IGhpZ2hsaWdodGluZy4uLlxuXG4gIHZhciBheGlzUHJvcCA9IGF4aXM7XG4gIHN0YXRlLm1vZGlmaWVyc0RhdGFbbmFtZV0gPSAoX3N0YXRlJG1vZGlmaWVyc0RhdGEkID0ge30sIF9zdGF0ZSRtb2RpZmllcnNEYXRhJFtheGlzUHJvcF0gPSBvZmZzZXQsIF9zdGF0ZSRtb2RpZmllcnNEYXRhJC5jZW50ZXJPZmZzZXQgPSBvZmZzZXQgLSBjZW50ZXIsIF9zdGF0ZSRtb2RpZmllcnNEYXRhJCk7XG59XG5cbmZ1bmN0aW9uIGVmZmVjdChfcmVmMikge1xuICB2YXIgc3RhdGUgPSBfcmVmMi5zdGF0ZSxcbiAgICAgIG9wdGlvbnMgPSBfcmVmMi5vcHRpb25zO1xuICB2YXIgX29wdGlvbnMkZWxlbWVudCA9IG9wdGlvbnMuZWxlbWVudCxcbiAgICAgIGFycm93RWxlbWVudCA9IF9vcHRpb25zJGVsZW1lbnQgPT09IHZvaWQgMCA/ICdbZGF0YS1wb3BwZXItYXJyb3ddJyA6IF9vcHRpb25zJGVsZW1lbnQ7XG5cbiAgaWYgKGFycm93RWxlbWVudCA9PSBudWxsKSB7XG4gICAgcmV0dXJuO1xuICB9IC8vIENTUyBzZWxlY3RvclxuXG5cbiAgaWYgKHR5cGVvZiBhcnJvd0VsZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgYXJyb3dFbGVtZW50ID0gc3RhdGUuZWxlbWVudHMucG9wcGVyLnF1ZXJ5U2VsZWN0b3IoYXJyb3dFbGVtZW50KTtcblxuICAgIGlmICghYXJyb3dFbGVtZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAgIGlmICghaXNIVE1MRWxlbWVudChhcnJvd0VsZW1lbnQpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFsnUG9wcGVyOiBcImFycm93XCIgZWxlbWVudCBtdXN0IGJlIGFuIEhUTUxFbGVtZW50IChub3QgYW4gU1ZHRWxlbWVudCkuJywgJ1RvIHVzZSBhbiBTVkcgYXJyb3csIHdyYXAgaXQgaW4gYW4gSFRNTEVsZW1lbnQgdGhhdCB3aWxsIGJlIHVzZWQgYXMnLCAndGhlIGFycm93LiddLmpvaW4oJyAnKSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFjb250YWlucyhzdGF0ZS5lbGVtZW50cy5wb3BwZXIsIGFycm93RWxlbWVudCkpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFsnUG9wcGVyOiBcImFycm93XCIgbW9kaWZpZXJcXCdzIGBlbGVtZW50YCBtdXN0IGJlIGEgY2hpbGQgb2YgdGhlIHBvcHBlcicsICdlbGVtZW50LiddLmpvaW4oJyAnKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgc3RhdGUuZWxlbWVudHMuYXJyb3cgPSBhcnJvd0VsZW1lbnQ7XG59IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdhcnJvdycsXG4gIGVuYWJsZWQ6IHRydWUsXG4gIHBoYXNlOiAnbWFpbicsXG4gIGZuOiBhcnJvdyxcbiAgZWZmZWN0OiBlZmZlY3QsXG4gIHJlcXVpcmVzOiBbJ3BvcHBlck9mZnNldHMnXSxcbiAgcmVxdWlyZXNJZkV4aXN0czogWydwcmV2ZW50T3ZlcmZsb3cnXVxufTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRWYXJpYXRpb24ocGxhY2VtZW50KSB7XG4gIHJldHVybiBwbGFjZW1lbnQuc3BsaXQoJy0nKVsxXTtcbn0iLCJpbXBvcnQgeyB0b3AsIGxlZnQsIHJpZ2h0LCBib3R0b20sIGVuZCB9IGZyb20gXCIuLi9lbnVtcy5qc1wiO1xuaW1wb3J0IGdldE9mZnNldFBhcmVudCBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldE9mZnNldFBhcmVudC5qc1wiO1xuaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldFdpbmRvdy5qc1wiO1xuaW1wb3J0IGdldERvY3VtZW50RWxlbWVudCBmcm9tIFwiLi4vZG9tLXV0aWxzL2dldERvY3VtZW50RWxlbWVudC5qc1wiO1xuaW1wb3J0IGdldENvbXB1dGVkU3R5bGUgZnJvbSBcIi4uL2RvbS11dGlscy9nZXRDb21wdXRlZFN0eWxlLmpzXCI7XG5pbXBvcnQgZ2V0QmFzZVBsYWNlbWVudCBmcm9tIFwiLi4vdXRpbHMvZ2V0QmFzZVBsYWNlbWVudC5qc1wiO1xuaW1wb3J0IGdldFZhcmlhdGlvbiBmcm9tIFwiLi4vdXRpbHMvZ2V0VmFyaWF0aW9uLmpzXCI7XG5pbXBvcnQgeyByb3VuZCB9IGZyb20gXCIuLi91dGlscy9tYXRoLmpzXCI7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxudmFyIHVuc2V0U2lkZXMgPSB7XG4gIHRvcDogJ2F1dG8nLFxuICByaWdodDogJ2F1dG8nLFxuICBib3R0b206ICdhdXRvJyxcbiAgbGVmdDogJ2F1dG8nXG59OyAvLyBSb3VuZCB0aGUgb2Zmc2V0cyB0byB0aGUgbmVhcmVzdCBzdWl0YWJsZSBzdWJwaXhlbCBiYXNlZCBvbiB0aGUgRFBSLlxuLy8gWm9vbWluZyBjYW4gY2hhbmdlIHRoZSBEUFIsIGJ1dCBpdCBzZWVtcyB0byByZXBvcnQgYSB2YWx1ZSB0aGF0IHdpbGxcbi8vIGNsZWFubHkgZGl2aWRlIHRoZSB2YWx1ZXMgaW50byB0aGUgYXBwcm9wcmlhdGUgc3VicGl4ZWxzLlxuXG5mdW5jdGlvbiByb3VuZE9mZnNldHNCeURQUihfcmVmKSB7XG4gIHZhciB4ID0gX3JlZi54LFxuICAgICAgeSA9IF9yZWYueTtcbiAgdmFyIHdpbiA9IHdpbmRvdztcbiAgdmFyIGRwciA9IHdpbi5kZXZpY2VQaXhlbFJhdGlvIHx8IDE7XG4gIHJldHVybiB7XG4gICAgeDogcm91bmQocm91bmQoeCAqIGRwcikgLyBkcHIpIHx8IDAsXG4gICAgeTogcm91bmQocm91bmQoeSAqIGRwcikgLyBkcHIpIHx8IDBcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcFRvU3R5bGVzKF9yZWYyKSB7XG4gIHZhciBfT2JqZWN0JGFzc2lnbjI7XG5cbiAgdmFyIHBvcHBlciA9IF9yZWYyLnBvcHBlcixcbiAgICAgIHBvcHBlclJlY3QgPSBfcmVmMi5wb3BwZXJSZWN0LFxuICAgICAgcGxhY2VtZW50ID0gX3JlZjIucGxhY2VtZW50LFxuICAgICAgdmFyaWF0aW9uID0gX3JlZjIudmFyaWF0aW9uLFxuICAgICAgb2Zmc2V0cyA9IF9yZWYyLm9mZnNldHMsXG4gICAgICBwb3NpdGlvbiA9IF9yZWYyLnBvc2l0aW9uLFxuICAgICAgZ3B1QWNjZWxlcmF0aW9uID0gX3JlZjIuZ3B1QWNjZWxlcmF0aW9uLFxuICAgICAgYWRhcHRpdmUgPSBfcmVmMi5hZGFwdGl2ZSxcbiAgICAgIHJvdW5kT2Zmc2V0cyA9IF9yZWYyLnJvdW5kT2Zmc2V0cztcblxuICB2YXIgX3JlZjMgPSByb3VuZE9mZnNldHMgPT09IHRydWUgPyByb3VuZE9mZnNldHNCeURQUihvZmZzZXRzKSA6IHR5cGVvZiByb3VuZE9mZnNldHMgPT09ICdmdW5jdGlvbicgPyByb3VuZE9mZnNldHMob2Zmc2V0cykgOiBvZmZzZXRzLFxuICAgICAgX3JlZjMkeCA9IF9yZWYzLngsXG4gICAgICB4ID0gX3JlZjMkeCA9PT0gdm9pZCAwID8gMCA6IF9yZWYzJHgsXG4gICAgICBfcmVmMyR5ID0gX3JlZjMueSxcbiAgICAgIHkgPSBfcmVmMyR5ID09PSB2b2lkIDAgPyAwIDogX3JlZjMkeTtcblxuICB2YXIgaGFzWCA9IG9mZnNldHMuaGFzT3duUHJvcGVydHkoJ3gnKTtcbiAgdmFyIGhhc1kgPSBvZmZzZXRzLmhhc093blByb3BlcnR5KCd5Jyk7XG4gIHZhciBzaWRlWCA9IGxlZnQ7XG4gIHZhciBzaWRlWSA9IHRvcDtcbiAgdmFyIHdpbiA9IHdpbmRvdztcblxuICBpZiAoYWRhcHRpdmUpIHtcbiAgICB2YXIgb2Zmc2V0UGFyZW50ID0gZ2V0T2Zmc2V0UGFyZW50KHBvcHBlcik7XG4gICAgdmFyIGhlaWdodFByb3AgPSAnY2xpZW50SGVpZ2h0JztcbiAgICB2YXIgd2lkdGhQcm9wID0gJ2NsaWVudFdpZHRoJztcblxuICAgIGlmIChvZmZzZXRQYXJlbnQgPT09IGdldFdpbmRvdyhwb3BwZXIpKSB7XG4gICAgICBvZmZzZXRQYXJlbnQgPSBnZXREb2N1bWVudEVsZW1lbnQocG9wcGVyKTtcblxuICAgICAgaWYgKGdldENvbXB1dGVkU3R5bGUob2Zmc2V0UGFyZW50KS5wb3NpdGlvbiAhPT0gJ3N0YXRpYycgJiYgcG9zaXRpb24gPT09ICdhYnNvbHV0ZScpIHtcbiAgICAgICAgaGVpZ2h0UHJvcCA9ICdzY3JvbGxIZWlnaHQnO1xuICAgICAgICB3aWR0aFByb3AgPSAnc2Nyb2xsV2lkdGgnO1xuICAgICAgfVxuICAgIH0gLy8gJEZsb3dGaXhNZVtpbmNvbXBhdGlibGUtY2FzdF06IGZvcmNlIHR5cGUgcmVmaW5lbWVudCwgd2UgY29tcGFyZSBvZmZzZXRQYXJlbnQgd2l0aCB3aW5kb3cgYWJvdmUsIGJ1dCBGbG93IGRvZXNuJ3QgZGV0ZWN0IGl0XG5cblxuICAgIG9mZnNldFBhcmVudCA9IG9mZnNldFBhcmVudDtcblxuICAgIGlmIChwbGFjZW1lbnQgPT09IHRvcCB8fCAocGxhY2VtZW50ID09PSBsZWZ0IHx8IHBsYWNlbWVudCA9PT0gcmlnaHQpICYmIHZhcmlhdGlvbiA9PT0gZW5kKSB7XG4gICAgICBzaWRlWSA9IGJvdHRvbTsgLy8gJEZsb3dGaXhNZVtwcm9wLW1pc3NpbmddXG5cbiAgICAgIHkgLT0gb2Zmc2V0UGFyZW50W2hlaWdodFByb3BdIC0gcG9wcGVyUmVjdC5oZWlnaHQ7XG4gICAgICB5ICo9IGdwdUFjY2VsZXJhdGlvbiA/IDEgOiAtMTtcbiAgICB9XG5cbiAgICBpZiAocGxhY2VtZW50ID09PSBsZWZ0IHx8IChwbGFjZW1lbnQgPT09IHRvcCB8fCBwbGFjZW1lbnQgPT09IGJvdHRvbSkgJiYgdmFyaWF0aW9uID09PSBlbmQpIHtcbiAgICAgIHNpZGVYID0gcmlnaHQ7IC8vICRGbG93Rml4TWVbcHJvcC1taXNzaW5nXVxuXG4gICAgICB4IC09IG9mZnNldFBhcmVudFt3aWR0aFByb3BdIC0gcG9wcGVyUmVjdC53aWR0aDtcbiAgICAgIHggKj0gZ3B1QWNjZWxlcmF0aW9uID8gMSA6IC0xO1xuICAgIH1cbiAgfVxuXG4gIHZhciBjb21tb25TdHlsZXMgPSBPYmplY3QuYXNzaWduKHtcbiAgICBwb3NpdGlvbjogcG9zaXRpb25cbiAgfSwgYWRhcHRpdmUgJiYgdW5zZXRTaWRlcyk7XG5cbiAgaWYgKGdwdUFjY2VsZXJhdGlvbikge1xuICAgIHZhciBfT2JqZWN0JGFzc2lnbjtcblxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBjb21tb25TdHlsZXMsIChfT2JqZWN0JGFzc2lnbiA9IHt9LCBfT2JqZWN0JGFzc2lnbltzaWRlWV0gPSBoYXNZID8gJzAnIDogJycsIF9PYmplY3QkYXNzaWduW3NpZGVYXSA9IGhhc1ggPyAnMCcgOiAnJywgX09iamVjdCRhc3NpZ24udHJhbnNmb3JtID0gKHdpbi5kZXZpY2VQaXhlbFJhdGlvIHx8IDEpIDw9IDEgPyBcInRyYW5zbGF0ZShcIiArIHggKyBcInB4LCBcIiArIHkgKyBcInB4KVwiIDogXCJ0cmFuc2xhdGUzZChcIiArIHggKyBcInB4LCBcIiArIHkgKyBcInB4LCAwKVwiLCBfT2JqZWN0JGFzc2lnbikpO1xuICB9XG5cbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGNvbW1vblN0eWxlcywgKF9PYmplY3QkYXNzaWduMiA9IHt9LCBfT2JqZWN0JGFzc2lnbjJbc2lkZVldID0gaGFzWSA/IHkgKyBcInB4XCIgOiAnJywgX09iamVjdCRhc3NpZ24yW3NpZGVYXSA9IGhhc1ggPyB4ICsgXCJweFwiIDogJycsIF9PYmplY3QkYXNzaWduMi50cmFuc2Zvcm0gPSAnJywgX09iamVjdCRhc3NpZ24yKSk7XG59XG5cbmZ1bmN0aW9uIGNvbXB1dGVTdHlsZXMoX3JlZjQpIHtcbiAgdmFyIHN0YXRlID0gX3JlZjQuc3RhdGUsXG4gICAgICBvcHRpb25zID0gX3JlZjQub3B0aW9ucztcbiAgdmFyIF9vcHRpb25zJGdwdUFjY2VsZXJhdCA9IG9wdGlvbnMuZ3B1QWNjZWxlcmF0aW9uLFxuICAgICAgZ3B1QWNjZWxlcmF0aW9uID0gX29wdGlvbnMkZ3B1QWNjZWxlcmF0ID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkZ3B1QWNjZWxlcmF0LFxuICAgICAgX29wdGlvbnMkYWRhcHRpdmUgPSBvcHRpb25zLmFkYXB0aXZlLFxuICAgICAgYWRhcHRpdmUgPSBfb3B0aW9ucyRhZGFwdGl2ZSA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJGFkYXB0aXZlLFxuICAgICAgX29wdGlvbnMkcm91bmRPZmZzZXRzID0gb3B0aW9ucy5yb3VuZE9mZnNldHMsXG4gICAgICByb3VuZE9mZnNldHMgPSBfb3B0aW9ucyRyb3VuZE9mZnNldHMgPT09IHZvaWQgMCA/IHRydWUgOiBfb3B0aW9ucyRyb3VuZE9mZnNldHM7XG5cbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAgIHZhciB0cmFuc2l0aW9uUHJvcGVydHkgPSBnZXRDb21wdXRlZFN0eWxlKHN0YXRlLmVsZW1lbnRzLnBvcHBlcikudHJhbnNpdGlvblByb3BlcnR5IHx8ICcnO1xuXG4gICAgaWYgKGFkYXB0aXZlICYmIFsndHJhbnNmb3JtJywgJ3RvcCcsICdyaWdodCcsICdib3R0b20nLCAnbGVmdCddLnNvbWUoZnVuY3Rpb24gKHByb3BlcnR5KSB7XG4gICAgICByZXR1cm4gdHJhbnNpdGlvblByb3BlcnR5LmluZGV4T2YocHJvcGVydHkpID49IDA7XG4gICAgfSkpIHtcbiAgICAgIGNvbnNvbGUud2FybihbJ1BvcHBlcjogRGV0ZWN0ZWQgQ1NTIHRyYW5zaXRpb25zIG9uIGF0IGxlYXN0IG9uZSBvZiB0aGUgZm9sbG93aW5nJywgJ0NTUyBwcm9wZXJ0aWVzOiBcInRyYW5zZm9ybVwiLCBcInRvcFwiLCBcInJpZ2h0XCIsIFwiYm90dG9tXCIsIFwibGVmdFwiLicsICdcXG5cXG4nLCAnRGlzYWJsZSB0aGUgXCJjb21wdXRlU3R5bGVzXCIgbW9kaWZpZXJcXCdzIGBhZGFwdGl2ZWAgb3B0aW9uIHRvIGFsbG93JywgJ2ZvciBzbW9vdGggdHJhbnNpdGlvbnMsIG9yIHJlbW92ZSB0aGVzZSBwcm9wZXJ0aWVzIGZyb20gdGhlIENTUycsICd0cmFuc2l0aW9uIGRlY2xhcmF0aW9uIG9uIHRoZSBwb3BwZXIgZWxlbWVudCBpZiBvbmx5IHRyYW5zaXRpb25pbmcnLCAnb3BhY2l0eSBvciBiYWNrZ3JvdW5kLWNvbG9yIGZvciBleGFtcGxlLicsICdcXG5cXG4nLCAnV2UgcmVjb21tZW5kIHVzaW5nIHRoZSBwb3BwZXIgZWxlbWVudCBhcyBhIHdyYXBwZXIgYXJvdW5kIGFuIGlubmVyJywgJ2VsZW1lbnQgdGhhdCBjYW4gaGF2ZSBhbnkgQ1NTIHByb3BlcnR5IHRyYW5zaXRpb25lZCBmb3IgYW5pbWF0aW9ucy4nXS5qb2luKCcgJykpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBjb21tb25TdHlsZXMgPSB7XG4gICAgcGxhY2VtZW50OiBnZXRCYXNlUGxhY2VtZW50KHN0YXRlLnBsYWNlbWVudCksXG4gICAgdmFyaWF0aW9uOiBnZXRWYXJpYXRpb24oc3RhdGUucGxhY2VtZW50KSxcbiAgICBwb3BwZXI6IHN0YXRlLmVsZW1lbnRzLnBvcHBlcixcbiAgICBwb3BwZXJSZWN0OiBzdGF0ZS5yZWN0cy5wb3BwZXIsXG4gICAgZ3B1QWNjZWxlcmF0aW9uOiBncHVBY2NlbGVyYXRpb25cbiAgfTtcblxuICBpZiAoc3RhdGUubW9kaWZpZXJzRGF0YS5wb3BwZXJPZmZzZXRzICE9IG51bGwpIHtcbiAgICBzdGF0ZS5zdHlsZXMucG9wcGVyID0gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuc3R5bGVzLnBvcHBlciwgbWFwVG9TdHlsZXMoT2JqZWN0LmFzc2lnbih7fSwgY29tbW9uU3R5bGVzLCB7XG4gICAgICBvZmZzZXRzOiBzdGF0ZS5tb2RpZmllcnNEYXRhLnBvcHBlck9mZnNldHMsXG4gICAgICBwb3NpdGlvbjogc3RhdGUub3B0aW9ucy5zdHJhdGVneSxcbiAgICAgIGFkYXB0aXZlOiBhZGFwdGl2ZSxcbiAgICAgIHJvdW5kT2Zmc2V0czogcm91bmRPZmZzZXRzXG4gICAgfSkpKTtcbiAgfVxuXG4gIGlmIChzdGF0ZS5tb2RpZmllcnNEYXRhLmFycm93ICE9IG51bGwpIHtcbiAgICBzdGF0ZS5zdHlsZXMuYXJyb3cgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5zdHlsZXMuYXJyb3csIG1hcFRvU3R5bGVzKE9iamVjdC5hc3NpZ24oe30sIGNvbW1vblN0eWxlcywge1xuICAgICAgb2Zmc2V0czogc3RhdGUubW9kaWZpZXJzRGF0YS5hcnJvdyxcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgYWRhcHRpdmU6IGZhbHNlLFxuICAgICAgcm91bmRPZmZzZXRzOiByb3VuZE9mZnNldHNcbiAgICB9KSkpO1xuICB9XG5cbiAgc3RhdGUuYXR0cmlidXRlcy5wb3BwZXIgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5hdHRyaWJ1dGVzLnBvcHBlciwge1xuICAgICdkYXRhLXBvcHBlci1wbGFjZW1lbnQnOiBzdGF0ZS5wbGFjZW1lbnRcbiAgfSk7XG59IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdjb21wdXRlU3R5bGVzJyxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgcGhhc2U6ICdiZWZvcmVXcml0ZScsXG4gIGZuOiBjb21wdXRlU3R5bGVzLFxuICBkYXRhOiB7fVxufTsiLCJpbXBvcnQgZ2V0V2luZG93IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0V2luZG93LmpzXCI7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxudmFyIHBhc3NpdmUgPSB7XG4gIHBhc3NpdmU6IHRydWVcbn07XG5cbmZ1bmN0aW9uIGVmZmVjdChfcmVmKSB7XG4gIHZhciBzdGF0ZSA9IF9yZWYuc3RhdGUsXG4gICAgICBpbnN0YW5jZSA9IF9yZWYuaW5zdGFuY2UsXG4gICAgICBvcHRpb25zID0gX3JlZi5vcHRpb25zO1xuICB2YXIgX29wdGlvbnMkc2Nyb2xsID0gb3B0aW9ucy5zY3JvbGwsXG4gICAgICBzY3JvbGwgPSBfb3B0aW9ucyRzY3JvbGwgPT09IHZvaWQgMCA/IHRydWUgOiBfb3B0aW9ucyRzY3JvbGwsXG4gICAgICBfb3B0aW9ucyRyZXNpemUgPSBvcHRpb25zLnJlc2l6ZSxcbiAgICAgIHJlc2l6ZSA9IF9vcHRpb25zJHJlc2l6ZSA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJHJlc2l6ZTtcbiAgdmFyIHdpbmRvdyA9IGdldFdpbmRvdyhzdGF0ZS5lbGVtZW50cy5wb3BwZXIpO1xuICB2YXIgc2Nyb2xsUGFyZW50cyA9IFtdLmNvbmNhdChzdGF0ZS5zY3JvbGxQYXJlbnRzLnJlZmVyZW5jZSwgc3RhdGUuc2Nyb2xsUGFyZW50cy5wb3BwZXIpO1xuXG4gIGlmIChzY3JvbGwpIHtcbiAgICBzY3JvbGxQYXJlbnRzLmZvckVhY2goZnVuY3Rpb24gKHNjcm9sbFBhcmVudCkge1xuICAgICAgc2Nyb2xsUGFyZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGluc3RhbmNlLnVwZGF0ZSwgcGFzc2l2ZSk7XG4gICAgfSk7XG4gIH1cblxuICBpZiAocmVzaXplKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGluc3RhbmNlLnVwZGF0ZSwgcGFzc2l2ZSk7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGlmIChzY3JvbGwpIHtcbiAgICAgIHNjcm9sbFBhcmVudHMuZm9yRWFjaChmdW5jdGlvbiAoc2Nyb2xsUGFyZW50KSB7XG4gICAgICAgIHNjcm9sbFBhcmVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBpbnN0YW5jZS51cGRhdGUsIHBhc3NpdmUpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHJlc2l6ZSkge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGluc3RhbmNlLnVwZGF0ZSwgcGFzc2l2ZSk7XG4gICAgfVxuICB9O1xufSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnZXZlbnRMaXN0ZW5lcnMnLFxuICBlbmFibGVkOiB0cnVlLFxuICBwaGFzZTogJ3dyaXRlJyxcbiAgZm46IGZ1bmN0aW9uIGZuKCkge30sXG4gIGVmZmVjdDogZWZmZWN0LFxuICBkYXRhOiB7fVxufTsiLCJ2YXIgaGFzaCA9IHtcbiAgbGVmdDogJ3JpZ2h0JyxcbiAgcmlnaHQ6ICdsZWZ0JyxcbiAgYm90dG9tOiAndG9wJyxcbiAgdG9wOiAnYm90dG9tJ1xufTtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldE9wcG9zaXRlUGxhY2VtZW50KHBsYWNlbWVudCkge1xuICByZXR1cm4gcGxhY2VtZW50LnJlcGxhY2UoL2xlZnR8cmlnaHR8Ym90dG9tfHRvcC9nLCBmdW5jdGlvbiAobWF0Y2hlZCkge1xuICAgIHJldHVybiBoYXNoW21hdGNoZWRdO1xuICB9KTtcbn0iLCJ2YXIgaGFzaCA9IHtcbiAgc3RhcnQ6ICdlbmQnLFxuICBlbmQ6ICdzdGFydCdcbn07XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRPcHBvc2l0ZVZhcmlhdGlvblBsYWNlbWVudChwbGFjZW1lbnQpIHtcbiAgcmV0dXJuIHBsYWNlbWVudC5yZXBsYWNlKC9zdGFydHxlbmQvZywgZnVuY3Rpb24gKG1hdGNoZWQpIHtcbiAgICByZXR1cm4gaGFzaFttYXRjaGVkXTtcbiAgfSk7XG59IiwiaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi9nZXRXaW5kb3cuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFdpbmRvd1Njcm9sbChub2RlKSB7XG4gIHZhciB3aW4gPSBnZXRXaW5kb3cobm9kZSk7XG4gIHZhciBzY3JvbGxMZWZ0ID0gd2luLnBhZ2VYT2Zmc2V0O1xuICB2YXIgc2Nyb2xsVG9wID0gd2luLnBhZ2VZT2Zmc2V0O1xuICByZXR1cm4ge1xuICAgIHNjcm9sbExlZnQ6IHNjcm9sbExlZnQsXG4gICAgc2Nyb2xsVG9wOiBzY3JvbGxUb3BcbiAgfTtcbn0iLCJpbXBvcnQgZ2V0Qm91bmRpbmdDbGllbnRSZWN0IGZyb20gXCIuL2dldEJvdW5kaW5nQ2xpZW50UmVjdC5qc1wiO1xuaW1wb3J0IGdldERvY3VtZW50RWxlbWVudCBmcm9tIFwiLi9nZXREb2N1bWVudEVsZW1lbnQuanNcIjtcbmltcG9ydCBnZXRXaW5kb3dTY3JvbGwgZnJvbSBcIi4vZ2V0V2luZG93U2Nyb2xsLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRXaW5kb3dTY3JvbGxCYXJYKGVsZW1lbnQpIHtcbiAgLy8gSWYgPGh0bWw+IGhhcyBhIENTUyB3aWR0aCBncmVhdGVyIHRoYW4gdGhlIHZpZXdwb3J0LCB0aGVuIHRoaXMgd2lsbCBiZVxuICAvLyBpbmNvcnJlY3QgZm9yIFJUTC5cbiAgLy8gUG9wcGVyIDEgaXMgYnJva2VuIGluIHRoaXMgY2FzZSBhbmQgbmV2ZXIgaGFkIGEgYnVnIHJlcG9ydCBzbyBsZXQncyBhc3N1bWVcbiAgLy8gaXQncyBub3QgYW4gaXNzdWUuIEkgZG9uJ3QgdGhpbmsgYW55b25lIGV2ZXIgc3BlY2lmaWVzIHdpZHRoIG9uIDxodG1sPlxuICAvLyBhbnl3YXkuXG4gIC8vIEJyb3dzZXJzIHdoZXJlIHRoZSBsZWZ0IHNjcm9sbGJhciBkb2Vzbid0IGNhdXNlIGFuIGlzc3VlIHJlcG9ydCBgMGAgZm9yXG4gIC8vIHRoaXMgKGUuZy4gRWRnZSAyMDE5LCBJRTExLCBTYWZhcmkpXG4gIHJldHVybiBnZXRCb3VuZGluZ0NsaWVudFJlY3QoZ2V0RG9jdW1lbnRFbGVtZW50KGVsZW1lbnQpKS5sZWZ0ICsgZ2V0V2luZG93U2Nyb2xsKGVsZW1lbnQpLnNjcm9sbExlZnQ7XG59IiwiaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi9nZXRXaW5kb3cuanNcIjtcbmltcG9ydCBnZXREb2N1bWVudEVsZW1lbnQgZnJvbSBcIi4vZ2V0RG9jdW1lbnRFbGVtZW50LmpzXCI7XG5pbXBvcnQgZ2V0V2luZG93U2Nyb2xsQmFyWCBmcm9tIFwiLi9nZXRXaW5kb3dTY3JvbGxCYXJYLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRWaWV3cG9ydFJlY3QoZWxlbWVudCkge1xuICB2YXIgd2luID0gZ2V0V2luZG93KGVsZW1lbnQpO1xuICB2YXIgaHRtbCA9IGdldERvY3VtZW50RWxlbWVudChlbGVtZW50KTtcbiAgdmFyIHZpc3VhbFZpZXdwb3J0ID0gd2luLnZpc3VhbFZpZXdwb3J0O1xuICB2YXIgd2lkdGggPSBodG1sLmNsaWVudFdpZHRoO1xuICB2YXIgaGVpZ2h0ID0gaHRtbC5jbGllbnRIZWlnaHQ7XG4gIHZhciB4ID0gMDtcbiAgdmFyIHkgPSAwOyAvLyBOQjogVGhpcyBpc24ndCBzdXBwb3J0ZWQgb24gaU9TIDw9IDEyLiBJZiB0aGUga2V5Ym9hcmQgaXMgb3BlbiwgdGhlIHBvcHBlclxuICAvLyBjYW4gYmUgb2JzY3VyZWQgdW5kZXJuZWF0aCBpdC5cbiAgLy8gQWxzbywgYGh0bWwuY2xpZW50SGVpZ2h0YCBhZGRzIHRoZSBib3R0b20gYmFyIGhlaWdodCBpbiBTYWZhcmkgaU9TLCBldmVuXG4gIC8vIGlmIGl0IGlzbid0IG9wZW4sIHNvIGlmIHRoaXMgaXNuJ3QgYXZhaWxhYmxlLCB0aGUgcG9wcGVyIHdpbGwgYmUgZGV0ZWN0ZWRcbiAgLy8gdG8gb3ZlcmZsb3cgdGhlIGJvdHRvbSBvZiB0aGUgc2NyZWVuIHRvbyBlYXJseS5cblxuICBpZiAodmlzdWFsVmlld3BvcnQpIHtcbiAgICB3aWR0aCA9IHZpc3VhbFZpZXdwb3J0LndpZHRoO1xuICAgIGhlaWdodCA9IHZpc3VhbFZpZXdwb3J0LmhlaWdodDsgLy8gVXNlcyBMYXlvdXQgVmlld3BvcnQgKGxpa2UgQ2hyb21lOyBTYWZhcmkgZG9lcyBub3QgY3VycmVudGx5KVxuICAgIC8vIEluIENocm9tZSwgaXQgcmV0dXJucyBhIHZhbHVlIHZlcnkgY2xvc2UgdG8gMCAoKy8tKSBidXQgY29udGFpbnMgcm91bmRpbmdcbiAgICAvLyBlcnJvcnMgZHVlIHRvIGZsb2F0aW5nIHBvaW50IG51bWJlcnMsIHNvIHdlIG5lZWQgdG8gY2hlY2sgcHJlY2lzaW9uLlxuICAgIC8vIFNhZmFyaSByZXR1cm5zIGEgbnVtYmVyIDw9IDAsIHVzdWFsbHkgPCAtMSB3aGVuIHBpbmNoLXpvb21lZFxuICAgIC8vIEZlYXR1cmUgZGV0ZWN0aW9uIGZhaWxzIGluIG1vYmlsZSBlbXVsYXRpb24gbW9kZSBpbiBDaHJvbWUuXG4gICAgLy8gTWF0aC5hYnMod2luLmlubmVyV2lkdGggLyB2aXN1YWxWaWV3cG9ydC5zY2FsZSAtIHZpc3VhbFZpZXdwb3J0LndpZHRoKSA8XG4gICAgLy8gMC4wMDFcbiAgICAvLyBGYWxsYmFjayBoZXJlOiBcIk5vdCBTYWZhcmlcIiB1c2VyQWdlbnRcblxuICAgIGlmICghL14oKD8hY2hyb21lfGFuZHJvaWQpLikqc2FmYXJpL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSkge1xuICAgICAgeCA9IHZpc3VhbFZpZXdwb3J0Lm9mZnNldExlZnQ7XG4gICAgICB5ID0gdmlzdWFsVmlld3BvcnQub2Zmc2V0VG9wO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0LFxuICAgIHg6IHggKyBnZXRXaW5kb3dTY3JvbGxCYXJYKGVsZW1lbnQpLFxuICAgIHk6IHlcbiAgfTtcbn0iLCJpbXBvcnQgZ2V0RG9jdW1lbnRFbGVtZW50IGZyb20gXCIuL2dldERvY3VtZW50RWxlbWVudC5qc1wiO1xuaW1wb3J0IGdldENvbXB1dGVkU3R5bGUgZnJvbSBcIi4vZ2V0Q29tcHV0ZWRTdHlsZS5qc1wiO1xuaW1wb3J0IGdldFdpbmRvd1Njcm9sbEJhclggZnJvbSBcIi4vZ2V0V2luZG93U2Nyb2xsQmFyWC5qc1wiO1xuaW1wb3J0IGdldFdpbmRvd1Njcm9sbCBmcm9tIFwiLi9nZXRXaW5kb3dTY3JvbGwuanNcIjtcbmltcG9ydCB7IG1heCB9IGZyb20gXCIuLi91dGlscy9tYXRoLmpzXCI7IC8vIEdldHMgdGhlIGVudGlyZSBzaXplIG9mIHRoZSBzY3JvbGxhYmxlIGRvY3VtZW50IGFyZWEsIGV2ZW4gZXh0ZW5kaW5nIG91dHNpZGVcbi8vIG9mIHRoZSBgPGh0bWw+YCBhbmQgYDxib2R5PmAgcmVjdCBib3VuZHMgaWYgaG9yaXpvbnRhbGx5IHNjcm9sbGFibGVcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0RG9jdW1lbnRSZWN0KGVsZW1lbnQpIHtcbiAgdmFyIF9lbGVtZW50JG93bmVyRG9jdW1lbjtcblxuICB2YXIgaHRtbCA9IGdldERvY3VtZW50RWxlbWVudChlbGVtZW50KTtcbiAgdmFyIHdpblNjcm9sbCA9IGdldFdpbmRvd1Njcm9sbChlbGVtZW50KTtcbiAgdmFyIGJvZHkgPSAoX2VsZW1lbnQkb3duZXJEb2N1bWVuID0gZWxlbWVudC5vd25lckRvY3VtZW50KSA9PSBudWxsID8gdm9pZCAwIDogX2VsZW1lbnQkb3duZXJEb2N1bWVuLmJvZHk7XG4gIHZhciB3aWR0aCA9IG1heChodG1sLnNjcm9sbFdpZHRoLCBodG1sLmNsaWVudFdpZHRoLCBib2R5ID8gYm9keS5zY3JvbGxXaWR0aCA6IDAsIGJvZHkgPyBib2R5LmNsaWVudFdpZHRoIDogMCk7XG4gIHZhciBoZWlnaHQgPSBtYXgoaHRtbC5zY3JvbGxIZWlnaHQsIGh0bWwuY2xpZW50SGVpZ2h0LCBib2R5ID8gYm9keS5zY3JvbGxIZWlnaHQgOiAwLCBib2R5ID8gYm9keS5jbGllbnRIZWlnaHQgOiAwKTtcbiAgdmFyIHggPSAtd2luU2Nyb2xsLnNjcm9sbExlZnQgKyBnZXRXaW5kb3dTY3JvbGxCYXJYKGVsZW1lbnQpO1xuICB2YXIgeSA9IC13aW5TY3JvbGwuc2Nyb2xsVG9wO1xuXG4gIGlmIChnZXRDb21wdXRlZFN0eWxlKGJvZHkgfHwgaHRtbCkuZGlyZWN0aW9uID09PSAncnRsJykge1xuICAgIHggKz0gbWF4KGh0bWwuY2xpZW50V2lkdGgsIGJvZHkgPyBib2R5LmNsaWVudFdpZHRoIDogMCkgLSB3aWR0aDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0LFxuICAgIHg6IHgsXG4gICAgeTogeVxuICB9O1xufSIsImltcG9ydCBnZXRDb21wdXRlZFN0eWxlIGZyb20gXCIuL2dldENvbXB1dGVkU3R5bGUuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzU2Nyb2xsUGFyZW50KGVsZW1lbnQpIHtcbiAgLy8gRmlyZWZveCB3YW50cyB1cyB0byBjaGVjayBgLXhgIGFuZCBgLXlgIHZhcmlhdGlvbnMgYXMgd2VsbFxuICB2YXIgX2dldENvbXB1dGVkU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLFxuICAgICAgb3ZlcmZsb3cgPSBfZ2V0Q29tcHV0ZWRTdHlsZS5vdmVyZmxvdyxcbiAgICAgIG92ZXJmbG93WCA9IF9nZXRDb21wdXRlZFN0eWxlLm92ZXJmbG93WCxcbiAgICAgIG92ZXJmbG93WSA9IF9nZXRDb21wdXRlZFN0eWxlLm92ZXJmbG93WTtcblxuICByZXR1cm4gL2F1dG98c2Nyb2xsfG92ZXJsYXl8aGlkZGVuLy50ZXN0KG92ZXJmbG93ICsgb3ZlcmZsb3dZICsgb3ZlcmZsb3dYKTtcbn0iLCJpbXBvcnQgZ2V0UGFyZW50Tm9kZSBmcm9tIFwiLi9nZXRQYXJlbnROb2RlLmpzXCI7XG5pbXBvcnQgaXNTY3JvbGxQYXJlbnQgZnJvbSBcIi4vaXNTY3JvbGxQYXJlbnQuanNcIjtcbmltcG9ydCBnZXROb2RlTmFtZSBmcm9tIFwiLi9nZXROb2RlTmFtZS5qc1wiO1xuaW1wb3J0IHsgaXNIVE1MRWxlbWVudCB9IGZyb20gXCIuL2luc3RhbmNlT2YuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFNjcm9sbFBhcmVudChub2RlKSB7XG4gIGlmIChbJ2h0bWwnLCAnYm9keScsICcjZG9jdW1lbnQnXS5pbmRleE9mKGdldE5vZGVOYW1lKG5vZGUpKSA+PSAwKSB7XG4gICAgLy8gJEZsb3dGaXhNZVtpbmNvbXBhdGlibGUtcmV0dXJuXTogYXNzdW1lIGJvZHkgaXMgYWx3YXlzIGF2YWlsYWJsZVxuICAgIHJldHVybiBub2RlLm93bmVyRG9jdW1lbnQuYm9keTtcbiAgfVxuXG4gIGlmIChpc0hUTUxFbGVtZW50KG5vZGUpICYmIGlzU2Nyb2xsUGFyZW50KG5vZGUpKSB7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICByZXR1cm4gZ2V0U2Nyb2xsUGFyZW50KGdldFBhcmVudE5vZGUobm9kZSkpO1xufSIsImltcG9ydCBnZXRTY3JvbGxQYXJlbnQgZnJvbSBcIi4vZ2V0U2Nyb2xsUGFyZW50LmpzXCI7XG5pbXBvcnQgZ2V0UGFyZW50Tm9kZSBmcm9tIFwiLi9nZXRQYXJlbnROb2RlLmpzXCI7XG5pbXBvcnQgZ2V0V2luZG93IGZyb20gXCIuL2dldFdpbmRvdy5qc1wiO1xuaW1wb3J0IGlzU2Nyb2xsUGFyZW50IGZyb20gXCIuL2lzU2Nyb2xsUGFyZW50LmpzXCI7XG4vKlxuZ2l2ZW4gYSBET00gZWxlbWVudCwgcmV0dXJuIHRoZSBsaXN0IG9mIGFsbCBzY3JvbGwgcGFyZW50cywgdXAgdGhlIGxpc3Qgb2YgYW5jZXNvcnNcbnVudGlsIHdlIGdldCB0byB0aGUgdG9wIHdpbmRvdyBvYmplY3QuIFRoaXMgbGlzdCBpcyB3aGF0IHdlIGF0dGFjaCBzY3JvbGwgbGlzdGVuZXJzXG50bywgYmVjYXVzZSBpZiBhbnkgb2YgdGhlc2UgcGFyZW50IGVsZW1lbnRzIHNjcm9sbCwgd2UnbGwgbmVlZCB0byByZS1jYWxjdWxhdGUgdGhlXG5yZWZlcmVuY2UgZWxlbWVudCdzIHBvc2l0aW9uLlxuKi9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbGlzdFNjcm9sbFBhcmVudHMoZWxlbWVudCwgbGlzdCkge1xuICB2YXIgX2VsZW1lbnQkb3duZXJEb2N1bWVuO1xuXG4gIGlmIChsaXN0ID09PSB2b2lkIDApIHtcbiAgICBsaXN0ID0gW107XG4gIH1cblxuICB2YXIgc2Nyb2xsUGFyZW50ID0gZ2V0U2Nyb2xsUGFyZW50KGVsZW1lbnQpO1xuICB2YXIgaXNCb2R5ID0gc2Nyb2xsUGFyZW50ID09PSAoKF9lbGVtZW50JG93bmVyRG9jdW1lbiA9IGVsZW1lbnQub3duZXJEb2N1bWVudCkgPT0gbnVsbCA/IHZvaWQgMCA6IF9lbGVtZW50JG93bmVyRG9jdW1lbi5ib2R5KTtcbiAgdmFyIHdpbiA9IGdldFdpbmRvdyhzY3JvbGxQYXJlbnQpO1xuICB2YXIgdGFyZ2V0ID0gaXNCb2R5ID8gW3dpbl0uY29uY2F0KHdpbi52aXN1YWxWaWV3cG9ydCB8fCBbXSwgaXNTY3JvbGxQYXJlbnQoc2Nyb2xsUGFyZW50KSA/IHNjcm9sbFBhcmVudCA6IFtdKSA6IHNjcm9sbFBhcmVudDtcbiAgdmFyIHVwZGF0ZWRMaXN0ID0gbGlzdC5jb25jYXQodGFyZ2V0KTtcbiAgcmV0dXJuIGlzQm9keSA/IHVwZGF0ZWRMaXN0IDogLy8gJEZsb3dGaXhNZVtpbmNvbXBhdGlibGUtY2FsbF06IGlzQm9keSB0ZWxscyB1cyB0YXJnZXQgd2lsbCBiZSBhbiBIVE1MRWxlbWVudCBoZXJlXG4gIHVwZGF0ZWRMaXN0LmNvbmNhdChsaXN0U2Nyb2xsUGFyZW50cyhnZXRQYXJlbnROb2RlKHRhcmdldCkpKTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZWN0VG9DbGllbnRSZWN0KHJlY3QpIHtcbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHJlY3QsIHtcbiAgICBsZWZ0OiByZWN0LngsXG4gICAgdG9wOiByZWN0LnksXG4gICAgcmlnaHQ6IHJlY3QueCArIHJlY3Qud2lkdGgsXG4gICAgYm90dG9tOiByZWN0LnkgKyByZWN0LmhlaWdodFxuICB9KTtcbn0iLCJpbXBvcnQgeyB2aWV3cG9ydCB9IGZyb20gXCIuLi9lbnVtcy5qc1wiO1xuaW1wb3J0IGdldFZpZXdwb3J0UmVjdCBmcm9tIFwiLi9nZXRWaWV3cG9ydFJlY3QuanNcIjtcbmltcG9ydCBnZXREb2N1bWVudFJlY3QgZnJvbSBcIi4vZ2V0RG9jdW1lbnRSZWN0LmpzXCI7XG5pbXBvcnQgbGlzdFNjcm9sbFBhcmVudHMgZnJvbSBcIi4vbGlzdFNjcm9sbFBhcmVudHMuanNcIjtcbmltcG9ydCBnZXRPZmZzZXRQYXJlbnQgZnJvbSBcIi4vZ2V0T2Zmc2V0UGFyZW50LmpzXCI7XG5pbXBvcnQgZ2V0RG9jdW1lbnRFbGVtZW50IGZyb20gXCIuL2dldERvY3VtZW50RWxlbWVudC5qc1wiO1xuaW1wb3J0IGdldENvbXB1dGVkU3R5bGUgZnJvbSBcIi4vZ2V0Q29tcHV0ZWRTdHlsZS5qc1wiO1xuaW1wb3J0IHsgaXNFbGVtZW50LCBpc0hUTUxFbGVtZW50IH0gZnJvbSBcIi4vaW5zdGFuY2VPZi5qc1wiO1xuaW1wb3J0IGdldEJvdW5kaW5nQ2xpZW50UmVjdCBmcm9tIFwiLi9nZXRCb3VuZGluZ0NsaWVudFJlY3QuanNcIjtcbmltcG9ydCBnZXRQYXJlbnROb2RlIGZyb20gXCIuL2dldFBhcmVudE5vZGUuanNcIjtcbmltcG9ydCBjb250YWlucyBmcm9tIFwiLi9jb250YWlucy5qc1wiO1xuaW1wb3J0IGdldE5vZGVOYW1lIGZyb20gXCIuL2dldE5vZGVOYW1lLmpzXCI7XG5pbXBvcnQgcmVjdFRvQ2xpZW50UmVjdCBmcm9tIFwiLi4vdXRpbHMvcmVjdFRvQ2xpZW50UmVjdC5qc1wiO1xuaW1wb3J0IHsgbWF4LCBtaW4gfSBmcm9tIFwiLi4vdXRpbHMvbWF0aC5qc1wiO1xuXG5mdW5jdGlvbiBnZXRJbm5lckJvdW5kaW5nQ2xpZW50UmVjdChlbGVtZW50KSB7XG4gIHZhciByZWN0ID0gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KGVsZW1lbnQpO1xuICByZWN0LnRvcCA9IHJlY3QudG9wICsgZWxlbWVudC5jbGllbnRUb3A7XG4gIHJlY3QubGVmdCA9IHJlY3QubGVmdCArIGVsZW1lbnQuY2xpZW50TGVmdDtcbiAgcmVjdC5ib3R0b20gPSByZWN0LnRvcCArIGVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICByZWN0LnJpZ2h0ID0gcmVjdC5sZWZ0ICsgZWxlbWVudC5jbGllbnRXaWR0aDtcbiAgcmVjdC53aWR0aCA9IGVsZW1lbnQuY2xpZW50V2lkdGg7XG4gIHJlY3QuaGVpZ2h0ID0gZWxlbWVudC5jbGllbnRIZWlnaHQ7XG4gIHJlY3QueCA9IHJlY3QubGVmdDtcbiAgcmVjdC55ID0gcmVjdC50b3A7XG4gIHJldHVybiByZWN0O1xufVxuXG5mdW5jdGlvbiBnZXRDbGllbnRSZWN0RnJvbU1peGVkVHlwZShlbGVtZW50LCBjbGlwcGluZ1BhcmVudCkge1xuICByZXR1cm4gY2xpcHBpbmdQYXJlbnQgPT09IHZpZXdwb3J0ID8gcmVjdFRvQ2xpZW50UmVjdChnZXRWaWV3cG9ydFJlY3QoZWxlbWVudCkpIDogaXNIVE1MRWxlbWVudChjbGlwcGluZ1BhcmVudCkgPyBnZXRJbm5lckJvdW5kaW5nQ2xpZW50UmVjdChjbGlwcGluZ1BhcmVudCkgOiByZWN0VG9DbGllbnRSZWN0KGdldERvY3VtZW50UmVjdChnZXREb2N1bWVudEVsZW1lbnQoZWxlbWVudCkpKTtcbn0gLy8gQSBcImNsaXBwaW5nIHBhcmVudFwiIGlzIGFuIG92ZXJmbG93YWJsZSBjb250YWluZXIgd2l0aCB0aGUgY2hhcmFjdGVyaXN0aWMgb2Zcbi8vIGNsaXBwaW5nIChvciBoaWRpbmcpIG92ZXJmbG93aW5nIGVsZW1lbnRzIHdpdGggYSBwb3NpdGlvbiBkaWZmZXJlbnQgZnJvbVxuLy8gYGluaXRpYWxgXG5cblxuZnVuY3Rpb24gZ2V0Q2xpcHBpbmdQYXJlbnRzKGVsZW1lbnQpIHtcbiAgdmFyIGNsaXBwaW5nUGFyZW50cyA9IGxpc3RTY3JvbGxQYXJlbnRzKGdldFBhcmVudE5vZGUoZWxlbWVudCkpO1xuICB2YXIgY2FuRXNjYXBlQ2xpcHBpbmcgPSBbJ2Fic29sdXRlJywgJ2ZpeGVkJ10uaW5kZXhPZihnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLnBvc2l0aW9uKSA+PSAwO1xuICB2YXIgY2xpcHBlckVsZW1lbnQgPSBjYW5Fc2NhcGVDbGlwcGluZyAmJiBpc0hUTUxFbGVtZW50KGVsZW1lbnQpID8gZ2V0T2Zmc2V0UGFyZW50KGVsZW1lbnQpIDogZWxlbWVudDtcblxuICBpZiAoIWlzRWxlbWVudChjbGlwcGVyRWxlbWVudCkpIHtcbiAgICByZXR1cm4gW107XG4gIH0gLy8gJEZsb3dGaXhNZVtpbmNvbXBhdGlibGUtcmV0dXJuXTogaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL2Zsb3cvaXNzdWVzLzE0MTRcblxuXG4gIHJldHVybiBjbGlwcGluZ1BhcmVudHMuZmlsdGVyKGZ1bmN0aW9uIChjbGlwcGluZ1BhcmVudCkge1xuICAgIHJldHVybiBpc0VsZW1lbnQoY2xpcHBpbmdQYXJlbnQpICYmIGNvbnRhaW5zKGNsaXBwaW5nUGFyZW50LCBjbGlwcGVyRWxlbWVudCkgJiYgZ2V0Tm9kZU5hbWUoY2xpcHBpbmdQYXJlbnQpICE9PSAnYm9keSc7XG4gIH0pO1xufSAvLyBHZXRzIHRoZSBtYXhpbXVtIGFyZWEgdGhhdCB0aGUgZWxlbWVudCBpcyB2aXNpYmxlIGluIGR1ZSB0byBhbnkgbnVtYmVyIG9mXG4vLyBjbGlwcGluZyBwYXJlbnRzXG5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0Q2xpcHBpbmdSZWN0KGVsZW1lbnQsIGJvdW5kYXJ5LCByb290Qm91bmRhcnkpIHtcbiAgdmFyIG1haW5DbGlwcGluZ1BhcmVudHMgPSBib3VuZGFyeSA9PT0gJ2NsaXBwaW5nUGFyZW50cycgPyBnZXRDbGlwcGluZ1BhcmVudHMoZWxlbWVudCkgOiBbXS5jb25jYXQoYm91bmRhcnkpO1xuICB2YXIgY2xpcHBpbmdQYXJlbnRzID0gW10uY29uY2F0KG1haW5DbGlwcGluZ1BhcmVudHMsIFtyb290Qm91bmRhcnldKTtcbiAgdmFyIGZpcnN0Q2xpcHBpbmdQYXJlbnQgPSBjbGlwcGluZ1BhcmVudHNbMF07XG4gIHZhciBjbGlwcGluZ1JlY3QgPSBjbGlwcGluZ1BhcmVudHMucmVkdWNlKGZ1bmN0aW9uIChhY2NSZWN0LCBjbGlwcGluZ1BhcmVudCkge1xuICAgIHZhciByZWN0ID0gZ2V0Q2xpZW50UmVjdEZyb21NaXhlZFR5cGUoZWxlbWVudCwgY2xpcHBpbmdQYXJlbnQpO1xuICAgIGFjY1JlY3QudG9wID0gbWF4KHJlY3QudG9wLCBhY2NSZWN0LnRvcCk7XG4gICAgYWNjUmVjdC5yaWdodCA9IG1pbihyZWN0LnJpZ2h0LCBhY2NSZWN0LnJpZ2h0KTtcbiAgICBhY2NSZWN0LmJvdHRvbSA9IG1pbihyZWN0LmJvdHRvbSwgYWNjUmVjdC5ib3R0b20pO1xuICAgIGFjY1JlY3QubGVmdCA9IG1heChyZWN0LmxlZnQsIGFjY1JlY3QubGVmdCk7XG4gICAgcmV0dXJuIGFjY1JlY3Q7XG4gIH0sIGdldENsaWVudFJlY3RGcm9tTWl4ZWRUeXBlKGVsZW1lbnQsIGZpcnN0Q2xpcHBpbmdQYXJlbnQpKTtcbiAgY2xpcHBpbmdSZWN0LndpZHRoID0gY2xpcHBpbmdSZWN0LnJpZ2h0IC0gY2xpcHBpbmdSZWN0LmxlZnQ7XG4gIGNsaXBwaW5nUmVjdC5oZWlnaHQgPSBjbGlwcGluZ1JlY3QuYm90dG9tIC0gY2xpcHBpbmdSZWN0LnRvcDtcbiAgY2xpcHBpbmdSZWN0LnggPSBjbGlwcGluZ1JlY3QubGVmdDtcbiAgY2xpcHBpbmdSZWN0LnkgPSBjbGlwcGluZ1JlY3QudG9wO1xuICByZXR1cm4gY2xpcHBpbmdSZWN0O1xufSIsImltcG9ydCBnZXRCYXNlUGxhY2VtZW50IGZyb20gXCIuL2dldEJhc2VQbGFjZW1lbnQuanNcIjtcbmltcG9ydCBnZXRWYXJpYXRpb24gZnJvbSBcIi4vZ2V0VmFyaWF0aW9uLmpzXCI7XG5pbXBvcnQgZ2V0TWFpbkF4aXNGcm9tUGxhY2VtZW50IGZyb20gXCIuL2dldE1haW5BeGlzRnJvbVBsYWNlbWVudC5qc1wiO1xuaW1wb3J0IHsgdG9wLCByaWdodCwgYm90dG9tLCBsZWZ0LCBzdGFydCwgZW5kIH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb21wdXRlT2Zmc2V0cyhfcmVmKSB7XG4gIHZhciByZWZlcmVuY2UgPSBfcmVmLnJlZmVyZW5jZSxcbiAgICAgIGVsZW1lbnQgPSBfcmVmLmVsZW1lbnQsXG4gICAgICBwbGFjZW1lbnQgPSBfcmVmLnBsYWNlbWVudDtcbiAgdmFyIGJhc2VQbGFjZW1lbnQgPSBwbGFjZW1lbnQgPyBnZXRCYXNlUGxhY2VtZW50KHBsYWNlbWVudCkgOiBudWxsO1xuICB2YXIgdmFyaWF0aW9uID0gcGxhY2VtZW50ID8gZ2V0VmFyaWF0aW9uKHBsYWNlbWVudCkgOiBudWxsO1xuICB2YXIgY29tbW9uWCA9IHJlZmVyZW5jZS54ICsgcmVmZXJlbmNlLndpZHRoIC8gMiAtIGVsZW1lbnQud2lkdGggLyAyO1xuICB2YXIgY29tbW9uWSA9IHJlZmVyZW5jZS55ICsgcmVmZXJlbmNlLmhlaWdodCAvIDIgLSBlbGVtZW50LmhlaWdodCAvIDI7XG4gIHZhciBvZmZzZXRzO1xuXG4gIHN3aXRjaCAoYmFzZVBsYWNlbWVudCkge1xuICAgIGNhc2UgdG9wOlxuICAgICAgb2Zmc2V0cyA9IHtcbiAgICAgICAgeDogY29tbW9uWCxcbiAgICAgICAgeTogcmVmZXJlbmNlLnkgLSBlbGVtZW50LmhlaWdodFxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBib3R0b206XG4gICAgICBvZmZzZXRzID0ge1xuICAgICAgICB4OiBjb21tb25YLFxuICAgICAgICB5OiByZWZlcmVuY2UueSArIHJlZmVyZW5jZS5oZWlnaHRcbiAgICAgIH07XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgcmlnaHQ6XG4gICAgICBvZmZzZXRzID0ge1xuICAgICAgICB4OiByZWZlcmVuY2UueCArIHJlZmVyZW5jZS53aWR0aCxcbiAgICAgICAgeTogY29tbW9uWVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBsZWZ0OlxuICAgICAgb2Zmc2V0cyA9IHtcbiAgICAgICAgeDogcmVmZXJlbmNlLnggLSBlbGVtZW50LndpZHRoLFxuICAgICAgICB5OiBjb21tb25ZXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgb2Zmc2V0cyA9IHtcbiAgICAgICAgeDogcmVmZXJlbmNlLngsXG4gICAgICAgIHk6IHJlZmVyZW5jZS55XG4gICAgICB9O1xuICB9XG5cbiAgdmFyIG1haW5BeGlzID0gYmFzZVBsYWNlbWVudCA/IGdldE1haW5BeGlzRnJvbVBsYWNlbWVudChiYXNlUGxhY2VtZW50KSA6IG51bGw7XG5cbiAgaWYgKG1haW5BeGlzICE9IG51bGwpIHtcbiAgICB2YXIgbGVuID0gbWFpbkF4aXMgPT09ICd5JyA/ICdoZWlnaHQnIDogJ3dpZHRoJztcblxuICAgIHN3aXRjaCAodmFyaWF0aW9uKSB7XG4gICAgICBjYXNlIHN0YXJ0OlxuICAgICAgICBvZmZzZXRzW21haW5BeGlzXSA9IG9mZnNldHNbbWFpbkF4aXNdIC0gKHJlZmVyZW5jZVtsZW5dIC8gMiAtIGVsZW1lbnRbbGVuXSAvIDIpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBlbmQ6XG4gICAgICAgIG9mZnNldHNbbWFpbkF4aXNdID0gb2Zmc2V0c1ttYWluQXhpc10gKyAocmVmZXJlbmNlW2xlbl0gLyAyIC0gZWxlbWVudFtsZW5dIC8gMik7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvZmZzZXRzO1xufSIsImltcG9ydCBnZXRDbGlwcGluZ1JlY3QgZnJvbSBcIi4uL2RvbS11dGlscy9nZXRDbGlwcGluZ1JlY3QuanNcIjtcbmltcG9ydCBnZXREb2N1bWVudEVsZW1lbnQgZnJvbSBcIi4uL2RvbS11dGlscy9nZXREb2N1bWVudEVsZW1lbnQuanNcIjtcbmltcG9ydCBnZXRCb3VuZGluZ0NsaWVudFJlY3QgZnJvbSBcIi4uL2RvbS11dGlscy9nZXRCb3VuZGluZ0NsaWVudFJlY3QuanNcIjtcbmltcG9ydCBjb21wdXRlT2Zmc2V0cyBmcm9tIFwiLi9jb21wdXRlT2Zmc2V0cy5qc1wiO1xuaW1wb3J0IHJlY3RUb0NsaWVudFJlY3QgZnJvbSBcIi4vcmVjdFRvQ2xpZW50UmVjdC5qc1wiO1xuaW1wb3J0IHsgY2xpcHBpbmdQYXJlbnRzLCByZWZlcmVuY2UsIHBvcHBlciwgYm90dG9tLCB0b3AsIHJpZ2h0LCBiYXNlUGxhY2VtZW50cywgdmlld3BvcnQgfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbmltcG9ydCB7IGlzRWxlbWVudCB9IGZyb20gXCIuLi9kb20tdXRpbHMvaW5zdGFuY2VPZi5qc1wiO1xuaW1wb3J0IG1lcmdlUGFkZGluZ09iamVjdCBmcm9tIFwiLi9tZXJnZVBhZGRpbmdPYmplY3QuanNcIjtcbmltcG9ydCBleHBhbmRUb0hhc2hNYXAgZnJvbSBcIi4vZXhwYW5kVG9IYXNoTWFwLmpzXCI7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGV0ZWN0T3ZlcmZsb3coc3RhdGUsIG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuXG4gIHZhciBfb3B0aW9ucyA9IG9wdGlvbnMsXG4gICAgICBfb3B0aW9ucyRwbGFjZW1lbnQgPSBfb3B0aW9ucy5wbGFjZW1lbnQsXG4gICAgICBwbGFjZW1lbnQgPSBfb3B0aW9ucyRwbGFjZW1lbnQgPT09IHZvaWQgMCA/IHN0YXRlLnBsYWNlbWVudCA6IF9vcHRpb25zJHBsYWNlbWVudCxcbiAgICAgIF9vcHRpb25zJGJvdW5kYXJ5ID0gX29wdGlvbnMuYm91bmRhcnksXG4gICAgICBib3VuZGFyeSA9IF9vcHRpb25zJGJvdW5kYXJ5ID09PSB2b2lkIDAgPyBjbGlwcGluZ1BhcmVudHMgOiBfb3B0aW9ucyRib3VuZGFyeSxcbiAgICAgIF9vcHRpb25zJHJvb3RCb3VuZGFyeSA9IF9vcHRpb25zLnJvb3RCb3VuZGFyeSxcbiAgICAgIHJvb3RCb3VuZGFyeSA9IF9vcHRpb25zJHJvb3RCb3VuZGFyeSA9PT0gdm9pZCAwID8gdmlld3BvcnQgOiBfb3B0aW9ucyRyb290Qm91bmRhcnksXG4gICAgICBfb3B0aW9ucyRlbGVtZW50Q29udGUgPSBfb3B0aW9ucy5lbGVtZW50Q29udGV4dCxcbiAgICAgIGVsZW1lbnRDb250ZXh0ID0gX29wdGlvbnMkZWxlbWVudENvbnRlID09PSB2b2lkIDAgPyBwb3BwZXIgOiBfb3B0aW9ucyRlbGVtZW50Q29udGUsXG4gICAgICBfb3B0aW9ucyRhbHRCb3VuZGFyeSA9IF9vcHRpb25zLmFsdEJvdW5kYXJ5LFxuICAgICAgYWx0Qm91bmRhcnkgPSBfb3B0aW9ucyRhbHRCb3VuZGFyeSA9PT0gdm9pZCAwID8gZmFsc2UgOiBfb3B0aW9ucyRhbHRCb3VuZGFyeSxcbiAgICAgIF9vcHRpb25zJHBhZGRpbmcgPSBfb3B0aW9ucy5wYWRkaW5nLFxuICAgICAgcGFkZGluZyA9IF9vcHRpb25zJHBhZGRpbmcgPT09IHZvaWQgMCA/IDAgOiBfb3B0aW9ucyRwYWRkaW5nO1xuICB2YXIgcGFkZGluZ09iamVjdCA9IG1lcmdlUGFkZGluZ09iamVjdCh0eXBlb2YgcGFkZGluZyAhPT0gJ251bWJlcicgPyBwYWRkaW5nIDogZXhwYW5kVG9IYXNoTWFwKHBhZGRpbmcsIGJhc2VQbGFjZW1lbnRzKSk7XG4gIHZhciBhbHRDb250ZXh0ID0gZWxlbWVudENvbnRleHQgPT09IHBvcHBlciA/IHJlZmVyZW5jZSA6IHBvcHBlcjtcbiAgdmFyIHBvcHBlclJlY3QgPSBzdGF0ZS5yZWN0cy5wb3BwZXI7XG4gIHZhciBlbGVtZW50ID0gc3RhdGUuZWxlbWVudHNbYWx0Qm91bmRhcnkgPyBhbHRDb250ZXh0IDogZWxlbWVudENvbnRleHRdO1xuICB2YXIgY2xpcHBpbmdDbGllbnRSZWN0ID0gZ2V0Q2xpcHBpbmdSZWN0KGlzRWxlbWVudChlbGVtZW50KSA/IGVsZW1lbnQgOiBlbGVtZW50LmNvbnRleHRFbGVtZW50IHx8IGdldERvY3VtZW50RWxlbWVudChzdGF0ZS5lbGVtZW50cy5wb3BwZXIpLCBib3VuZGFyeSwgcm9vdEJvdW5kYXJ5KTtcbiAgdmFyIHJlZmVyZW5jZUNsaWVudFJlY3QgPSBnZXRCb3VuZGluZ0NsaWVudFJlY3Qoc3RhdGUuZWxlbWVudHMucmVmZXJlbmNlKTtcbiAgdmFyIHBvcHBlck9mZnNldHMgPSBjb21wdXRlT2Zmc2V0cyh7XG4gICAgcmVmZXJlbmNlOiByZWZlcmVuY2VDbGllbnRSZWN0LFxuICAgIGVsZW1lbnQ6IHBvcHBlclJlY3QsXG4gICAgc3RyYXRlZ3k6ICdhYnNvbHV0ZScsXG4gICAgcGxhY2VtZW50OiBwbGFjZW1lbnRcbiAgfSk7XG4gIHZhciBwb3BwZXJDbGllbnRSZWN0ID0gcmVjdFRvQ2xpZW50UmVjdChPYmplY3QuYXNzaWduKHt9LCBwb3BwZXJSZWN0LCBwb3BwZXJPZmZzZXRzKSk7XG4gIHZhciBlbGVtZW50Q2xpZW50UmVjdCA9IGVsZW1lbnRDb250ZXh0ID09PSBwb3BwZXIgPyBwb3BwZXJDbGllbnRSZWN0IDogcmVmZXJlbmNlQ2xpZW50UmVjdDsgLy8gcG9zaXRpdmUgPSBvdmVyZmxvd2luZyB0aGUgY2xpcHBpbmcgcmVjdFxuICAvLyAwIG9yIG5lZ2F0aXZlID0gd2l0aGluIHRoZSBjbGlwcGluZyByZWN0XG5cbiAgdmFyIG92ZXJmbG93T2Zmc2V0cyA9IHtcbiAgICB0b3A6IGNsaXBwaW5nQ2xpZW50UmVjdC50b3AgLSBlbGVtZW50Q2xpZW50UmVjdC50b3AgKyBwYWRkaW5nT2JqZWN0LnRvcCxcbiAgICBib3R0b206IGVsZW1lbnRDbGllbnRSZWN0LmJvdHRvbSAtIGNsaXBwaW5nQ2xpZW50UmVjdC5ib3R0b20gKyBwYWRkaW5nT2JqZWN0LmJvdHRvbSxcbiAgICBsZWZ0OiBjbGlwcGluZ0NsaWVudFJlY3QubGVmdCAtIGVsZW1lbnRDbGllbnRSZWN0LmxlZnQgKyBwYWRkaW5nT2JqZWN0LmxlZnQsXG4gICAgcmlnaHQ6IGVsZW1lbnRDbGllbnRSZWN0LnJpZ2h0IC0gY2xpcHBpbmdDbGllbnRSZWN0LnJpZ2h0ICsgcGFkZGluZ09iamVjdC5yaWdodFxuICB9O1xuICB2YXIgb2Zmc2V0RGF0YSA9IHN0YXRlLm1vZGlmaWVyc0RhdGEub2Zmc2V0OyAvLyBPZmZzZXRzIGNhbiBiZSBhcHBsaWVkIG9ubHkgdG8gdGhlIHBvcHBlciBlbGVtZW50XG5cbiAgaWYgKGVsZW1lbnRDb250ZXh0ID09PSBwb3BwZXIgJiYgb2Zmc2V0RGF0YSkge1xuICAgIHZhciBvZmZzZXQgPSBvZmZzZXREYXRhW3BsYWNlbWVudF07XG4gICAgT2JqZWN0LmtleXMob3ZlcmZsb3dPZmZzZXRzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHZhciBtdWx0aXBseSA9IFtyaWdodCwgYm90dG9tXS5pbmRleE9mKGtleSkgPj0gMCA/IDEgOiAtMTtcbiAgICAgIHZhciBheGlzID0gW3RvcCwgYm90dG9tXS5pbmRleE9mKGtleSkgPj0gMCA/ICd5JyA6ICd4JztcbiAgICAgIG92ZXJmbG93T2Zmc2V0c1trZXldICs9IG9mZnNldFtheGlzXSAqIG11bHRpcGx5O1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIG92ZXJmbG93T2Zmc2V0cztcbn0iLCJpbXBvcnQgZ2V0VmFyaWF0aW9uIGZyb20gXCIuL2dldFZhcmlhdGlvbi5qc1wiO1xuaW1wb3J0IHsgdmFyaWF0aW9uUGxhY2VtZW50cywgYmFzZVBsYWNlbWVudHMsIHBsYWNlbWVudHMgYXMgYWxsUGxhY2VtZW50cyB9IGZyb20gXCIuLi9lbnVtcy5qc1wiO1xuaW1wb3J0IGRldGVjdE92ZXJmbG93IGZyb20gXCIuL2RldGVjdE92ZXJmbG93LmpzXCI7XG5pbXBvcnQgZ2V0QmFzZVBsYWNlbWVudCBmcm9tIFwiLi9nZXRCYXNlUGxhY2VtZW50LmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb21wdXRlQXV0b1BsYWNlbWVudChzdGF0ZSwgb3B0aW9ucykge1xuICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgdmFyIF9vcHRpb25zID0gb3B0aW9ucyxcbiAgICAgIHBsYWNlbWVudCA9IF9vcHRpb25zLnBsYWNlbWVudCxcbiAgICAgIGJvdW5kYXJ5ID0gX29wdGlvbnMuYm91bmRhcnksXG4gICAgICByb290Qm91bmRhcnkgPSBfb3B0aW9ucy5yb290Qm91bmRhcnksXG4gICAgICBwYWRkaW5nID0gX29wdGlvbnMucGFkZGluZyxcbiAgICAgIGZsaXBWYXJpYXRpb25zID0gX29wdGlvbnMuZmxpcFZhcmlhdGlvbnMsXG4gICAgICBfb3B0aW9ucyRhbGxvd2VkQXV0b1AgPSBfb3B0aW9ucy5hbGxvd2VkQXV0b1BsYWNlbWVudHMsXG4gICAgICBhbGxvd2VkQXV0b1BsYWNlbWVudHMgPSBfb3B0aW9ucyRhbGxvd2VkQXV0b1AgPT09IHZvaWQgMCA/IGFsbFBsYWNlbWVudHMgOiBfb3B0aW9ucyRhbGxvd2VkQXV0b1A7XG4gIHZhciB2YXJpYXRpb24gPSBnZXRWYXJpYXRpb24ocGxhY2VtZW50KTtcbiAgdmFyIHBsYWNlbWVudHMgPSB2YXJpYXRpb24gPyBmbGlwVmFyaWF0aW9ucyA/IHZhcmlhdGlvblBsYWNlbWVudHMgOiB2YXJpYXRpb25QbGFjZW1lbnRzLmZpbHRlcihmdW5jdGlvbiAocGxhY2VtZW50KSB7XG4gICAgcmV0dXJuIGdldFZhcmlhdGlvbihwbGFjZW1lbnQpID09PSB2YXJpYXRpb247XG4gIH0pIDogYmFzZVBsYWNlbWVudHM7XG4gIHZhciBhbGxvd2VkUGxhY2VtZW50cyA9IHBsYWNlbWVudHMuZmlsdGVyKGZ1bmN0aW9uIChwbGFjZW1lbnQpIHtcbiAgICByZXR1cm4gYWxsb3dlZEF1dG9QbGFjZW1lbnRzLmluZGV4T2YocGxhY2VtZW50KSA+PSAwO1xuICB9KTtcblxuICBpZiAoYWxsb3dlZFBsYWNlbWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgYWxsb3dlZFBsYWNlbWVudHMgPSBwbGFjZW1lbnRzO1xuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAgICAgY29uc29sZS5lcnJvcihbJ1BvcHBlcjogVGhlIGBhbGxvd2VkQXV0b1BsYWNlbWVudHNgIG9wdGlvbiBkaWQgbm90IGFsbG93IGFueScsICdwbGFjZW1lbnRzLiBFbnN1cmUgdGhlIGBwbGFjZW1lbnRgIG9wdGlvbiBtYXRjaGVzIHRoZSB2YXJpYXRpb24nLCAnb2YgdGhlIGFsbG93ZWQgcGxhY2VtZW50cy4nLCAnRm9yIGV4YW1wbGUsIFwiYXV0b1wiIGNhbm5vdCBiZSB1c2VkIHRvIGFsbG93IFwiYm90dG9tLXN0YXJ0XCIuJywgJ1VzZSBcImF1dG8tc3RhcnRcIiBpbnN0ZWFkLiddLmpvaW4oJyAnKSk7XG4gICAgfVxuICB9IC8vICRGbG93Rml4TWVbaW5jb21wYXRpYmxlLXR5cGVdOiBGbG93IHNlZW1zIHRvIGhhdmUgcHJvYmxlbXMgd2l0aCB0d28gYXJyYXkgdW5pb25zLi4uXG5cblxuICB2YXIgb3ZlcmZsb3dzID0gYWxsb3dlZFBsYWNlbWVudHMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIHBsYWNlbWVudCkge1xuICAgIGFjY1twbGFjZW1lbnRdID0gZGV0ZWN0T3ZlcmZsb3coc3RhdGUsIHtcbiAgICAgIHBsYWNlbWVudDogcGxhY2VtZW50LFxuICAgICAgYm91bmRhcnk6IGJvdW5kYXJ5LFxuICAgICAgcm9vdEJvdW5kYXJ5OiByb290Qm91bmRhcnksXG4gICAgICBwYWRkaW5nOiBwYWRkaW5nXG4gICAgfSlbZ2V0QmFzZVBsYWNlbWVudChwbGFjZW1lbnQpXTtcbiAgICByZXR1cm4gYWNjO1xuICB9LCB7fSk7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvdmVyZmxvd3MpLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICByZXR1cm4gb3ZlcmZsb3dzW2FdIC0gb3ZlcmZsb3dzW2JdO1xuICB9KTtcbn0iLCJpbXBvcnQgZ2V0T3Bwb3NpdGVQbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldE9wcG9zaXRlUGxhY2VtZW50LmpzXCI7XG5pbXBvcnQgZ2V0QmFzZVBsYWNlbWVudCBmcm9tIFwiLi4vdXRpbHMvZ2V0QmFzZVBsYWNlbWVudC5qc1wiO1xuaW1wb3J0IGdldE9wcG9zaXRlVmFyaWF0aW9uUGxhY2VtZW50IGZyb20gXCIuLi91dGlscy9nZXRPcHBvc2l0ZVZhcmlhdGlvblBsYWNlbWVudC5qc1wiO1xuaW1wb3J0IGRldGVjdE92ZXJmbG93IGZyb20gXCIuLi91dGlscy9kZXRlY3RPdmVyZmxvdy5qc1wiO1xuaW1wb3J0IGNvbXB1dGVBdXRvUGxhY2VtZW50IGZyb20gXCIuLi91dGlscy9jb21wdXRlQXV0b1BsYWNlbWVudC5qc1wiO1xuaW1wb3J0IHsgYm90dG9tLCB0b3AsIHN0YXJ0LCByaWdodCwgbGVmdCwgYXV0byB9IGZyb20gXCIuLi9lbnVtcy5qc1wiO1xuaW1wb3J0IGdldFZhcmlhdGlvbiBmcm9tIFwiLi4vdXRpbHMvZ2V0VmFyaWF0aW9uLmpzXCI7IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuZnVuY3Rpb24gZ2V0RXhwYW5kZWRGYWxsYmFja1BsYWNlbWVudHMocGxhY2VtZW50KSB7XG4gIGlmIChnZXRCYXNlUGxhY2VtZW50KHBsYWNlbWVudCkgPT09IGF1dG8pIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICB2YXIgb3Bwb3NpdGVQbGFjZW1lbnQgPSBnZXRPcHBvc2l0ZVBsYWNlbWVudChwbGFjZW1lbnQpO1xuICByZXR1cm4gW2dldE9wcG9zaXRlVmFyaWF0aW9uUGxhY2VtZW50KHBsYWNlbWVudCksIG9wcG9zaXRlUGxhY2VtZW50LCBnZXRPcHBvc2l0ZVZhcmlhdGlvblBsYWNlbWVudChvcHBvc2l0ZVBsYWNlbWVudCldO1xufVxuXG5mdW5jdGlvbiBmbGlwKF9yZWYpIHtcbiAgdmFyIHN0YXRlID0gX3JlZi5zdGF0ZSxcbiAgICAgIG9wdGlvbnMgPSBfcmVmLm9wdGlvbnMsXG4gICAgICBuYW1lID0gX3JlZi5uYW1lO1xuXG4gIGlmIChzdGF0ZS5tb2RpZmllcnNEYXRhW25hbWVdLl9za2lwKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIF9vcHRpb25zJG1haW5BeGlzID0gb3B0aW9ucy5tYWluQXhpcyxcbiAgICAgIGNoZWNrTWFpbkF4aXMgPSBfb3B0aW9ucyRtYWluQXhpcyA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJG1haW5BeGlzLFxuICAgICAgX29wdGlvbnMkYWx0QXhpcyA9IG9wdGlvbnMuYWx0QXhpcyxcbiAgICAgIGNoZWNrQWx0QXhpcyA9IF9vcHRpb25zJGFsdEF4aXMgPT09IHZvaWQgMCA/IHRydWUgOiBfb3B0aW9ucyRhbHRBeGlzLFxuICAgICAgc3BlY2lmaWVkRmFsbGJhY2tQbGFjZW1lbnRzID0gb3B0aW9ucy5mYWxsYmFja1BsYWNlbWVudHMsXG4gICAgICBwYWRkaW5nID0gb3B0aW9ucy5wYWRkaW5nLFxuICAgICAgYm91bmRhcnkgPSBvcHRpb25zLmJvdW5kYXJ5LFxuICAgICAgcm9vdEJvdW5kYXJ5ID0gb3B0aW9ucy5yb290Qm91bmRhcnksXG4gICAgICBhbHRCb3VuZGFyeSA9IG9wdGlvbnMuYWx0Qm91bmRhcnksXG4gICAgICBfb3B0aW9ucyRmbGlwVmFyaWF0aW8gPSBvcHRpb25zLmZsaXBWYXJpYXRpb25zLFxuICAgICAgZmxpcFZhcmlhdGlvbnMgPSBfb3B0aW9ucyRmbGlwVmFyaWF0aW8gPT09IHZvaWQgMCA/IHRydWUgOiBfb3B0aW9ucyRmbGlwVmFyaWF0aW8sXG4gICAgICBhbGxvd2VkQXV0b1BsYWNlbWVudHMgPSBvcHRpb25zLmFsbG93ZWRBdXRvUGxhY2VtZW50cztcbiAgdmFyIHByZWZlcnJlZFBsYWNlbWVudCA9IHN0YXRlLm9wdGlvbnMucGxhY2VtZW50O1xuICB2YXIgYmFzZVBsYWNlbWVudCA9IGdldEJhc2VQbGFjZW1lbnQocHJlZmVycmVkUGxhY2VtZW50KTtcbiAgdmFyIGlzQmFzZVBsYWNlbWVudCA9IGJhc2VQbGFjZW1lbnQgPT09IHByZWZlcnJlZFBsYWNlbWVudDtcbiAgdmFyIGZhbGxiYWNrUGxhY2VtZW50cyA9IHNwZWNpZmllZEZhbGxiYWNrUGxhY2VtZW50cyB8fCAoaXNCYXNlUGxhY2VtZW50IHx8ICFmbGlwVmFyaWF0aW9ucyA/IFtnZXRPcHBvc2l0ZVBsYWNlbWVudChwcmVmZXJyZWRQbGFjZW1lbnQpXSA6IGdldEV4cGFuZGVkRmFsbGJhY2tQbGFjZW1lbnRzKHByZWZlcnJlZFBsYWNlbWVudCkpO1xuICB2YXIgcGxhY2VtZW50cyA9IFtwcmVmZXJyZWRQbGFjZW1lbnRdLmNvbmNhdChmYWxsYmFja1BsYWNlbWVudHMpLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBwbGFjZW1lbnQpIHtcbiAgICByZXR1cm4gYWNjLmNvbmNhdChnZXRCYXNlUGxhY2VtZW50KHBsYWNlbWVudCkgPT09IGF1dG8gPyBjb21wdXRlQXV0b1BsYWNlbWVudChzdGF0ZSwge1xuICAgICAgcGxhY2VtZW50OiBwbGFjZW1lbnQsXG4gICAgICBib3VuZGFyeTogYm91bmRhcnksXG4gICAgICByb290Qm91bmRhcnk6IHJvb3RCb3VuZGFyeSxcbiAgICAgIHBhZGRpbmc6IHBhZGRpbmcsXG4gICAgICBmbGlwVmFyaWF0aW9uczogZmxpcFZhcmlhdGlvbnMsXG4gICAgICBhbGxvd2VkQXV0b1BsYWNlbWVudHM6IGFsbG93ZWRBdXRvUGxhY2VtZW50c1xuICAgIH0pIDogcGxhY2VtZW50KTtcbiAgfSwgW10pO1xuICB2YXIgcmVmZXJlbmNlUmVjdCA9IHN0YXRlLnJlY3RzLnJlZmVyZW5jZTtcbiAgdmFyIHBvcHBlclJlY3QgPSBzdGF0ZS5yZWN0cy5wb3BwZXI7XG4gIHZhciBjaGVja3NNYXAgPSBuZXcgTWFwKCk7XG4gIHZhciBtYWtlRmFsbGJhY2tDaGVja3MgPSB0cnVlO1xuICB2YXIgZmlyc3RGaXR0aW5nUGxhY2VtZW50ID0gcGxhY2VtZW50c1swXTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHBsYWNlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgcGxhY2VtZW50ID0gcGxhY2VtZW50c1tpXTtcblxuICAgIHZhciBfYmFzZVBsYWNlbWVudCA9IGdldEJhc2VQbGFjZW1lbnQocGxhY2VtZW50KTtcblxuICAgIHZhciBpc1N0YXJ0VmFyaWF0aW9uID0gZ2V0VmFyaWF0aW9uKHBsYWNlbWVudCkgPT09IHN0YXJ0O1xuICAgIHZhciBpc1ZlcnRpY2FsID0gW3RvcCwgYm90dG9tXS5pbmRleE9mKF9iYXNlUGxhY2VtZW50KSA+PSAwO1xuICAgIHZhciBsZW4gPSBpc1ZlcnRpY2FsID8gJ3dpZHRoJyA6ICdoZWlnaHQnO1xuICAgIHZhciBvdmVyZmxvdyA9IGRldGVjdE92ZXJmbG93KHN0YXRlLCB7XG4gICAgICBwbGFjZW1lbnQ6IHBsYWNlbWVudCxcbiAgICAgIGJvdW5kYXJ5OiBib3VuZGFyeSxcbiAgICAgIHJvb3RCb3VuZGFyeTogcm9vdEJvdW5kYXJ5LFxuICAgICAgYWx0Qm91bmRhcnk6IGFsdEJvdW5kYXJ5LFxuICAgICAgcGFkZGluZzogcGFkZGluZ1xuICAgIH0pO1xuICAgIHZhciBtYWluVmFyaWF0aW9uU2lkZSA9IGlzVmVydGljYWwgPyBpc1N0YXJ0VmFyaWF0aW9uID8gcmlnaHQgOiBsZWZ0IDogaXNTdGFydFZhcmlhdGlvbiA/IGJvdHRvbSA6IHRvcDtcblxuICAgIGlmIChyZWZlcmVuY2VSZWN0W2xlbl0gPiBwb3BwZXJSZWN0W2xlbl0pIHtcbiAgICAgIG1haW5WYXJpYXRpb25TaWRlID0gZ2V0T3Bwb3NpdGVQbGFjZW1lbnQobWFpblZhcmlhdGlvblNpZGUpO1xuICAgIH1cblxuICAgIHZhciBhbHRWYXJpYXRpb25TaWRlID0gZ2V0T3Bwb3NpdGVQbGFjZW1lbnQobWFpblZhcmlhdGlvblNpZGUpO1xuICAgIHZhciBjaGVja3MgPSBbXTtcblxuICAgIGlmIChjaGVja01haW5BeGlzKSB7XG4gICAgICBjaGVja3MucHVzaChvdmVyZmxvd1tfYmFzZVBsYWNlbWVudF0gPD0gMCk7XG4gICAgfVxuXG4gICAgaWYgKGNoZWNrQWx0QXhpcykge1xuICAgICAgY2hlY2tzLnB1c2gob3ZlcmZsb3dbbWFpblZhcmlhdGlvblNpZGVdIDw9IDAsIG92ZXJmbG93W2FsdFZhcmlhdGlvblNpZGVdIDw9IDApO1xuICAgIH1cblxuICAgIGlmIChjaGVja3MuZXZlcnkoZnVuY3Rpb24gKGNoZWNrKSB7XG4gICAgICByZXR1cm4gY2hlY2s7XG4gICAgfSkpIHtcbiAgICAgIGZpcnN0Rml0dGluZ1BsYWNlbWVudCA9IHBsYWNlbWVudDtcbiAgICAgIG1ha2VGYWxsYmFja0NoZWNrcyA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY2hlY2tzTWFwLnNldChwbGFjZW1lbnQsIGNoZWNrcyk7XG4gIH1cblxuICBpZiAobWFrZUZhbGxiYWNrQ2hlY2tzKSB7XG4gICAgLy8gYDJgIG1heSBiZSBkZXNpcmVkIGluIHNvbWUgY2FzZXMg4oCTIHJlc2VhcmNoIGxhdGVyXG4gICAgdmFyIG51bWJlck9mQ2hlY2tzID0gZmxpcFZhcmlhdGlvbnMgPyAzIDogMTtcblxuICAgIHZhciBfbG9vcCA9IGZ1bmN0aW9uIF9sb29wKF9pKSB7XG4gICAgICB2YXIgZml0dGluZ1BsYWNlbWVudCA9IHBsYWNlbWVudHMuZmluZChmdW5jdGlvbiAocGxhY2VtZW50KSB7XG4gICAgICAgIHZhciBjaGVja3MgPSBjaGVja3NNYXAuZ2V0KHBsYWNlbWVudCk7XG5cbiAgICAgICAgaWYgKGNoZWNrcykge1xuICAgICAgICAgIHJldHVybiBjaGVja3Muc2xpY2UoMCwgX2kpLmV2ZXJ5KGZ1bmN0aW9uIChjaGVjaykge1xuICAgICAgICAgICAgcmV0dXJuIGNoZWNrO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKGZpdHRpbmdQbGFjZW1lbnQpIHtcbiAgICAgICAgZmlyc3RGaXR0aW5nUGxhY2VtZW50ID0gZml0dGluZ1BsYWNlbWVudDtcbiAgICAgICAgcmV0dXJuIFwiYnJlYWtcIjtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZm9yICh2YXIgX2kgPSBudW1iZXJPZkNoZWNrczsgX2kgPiAwOyBfaS0tKSB7XG4gICAgICB2YXIgX3JldCA9IF9sb29wKF9pKTtcblxuICAgICAgaWYgKF9yZXQgPT09IFwiYnJlYWtcIikgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKHN0YXRlLnBsYWNlbWVudCAhPT0gZmlyc3RGaXR0aW5nUGxhY2VtZW50KSB7XG4gICAgc3RhdGUubW9kaWZpZXJzRGF0YVtuYW1lXS5fc2tpcCA9IHRydWU7XG4gICAgc3RhdGUucGxhY2VtZW50ID0gZmlyc3RGaXR0aW5nUGxhY2VtZW50O1xuICAgIHN0YXRlLnJlc2V0ID0gdHJ1ZTtcbiAgfVxufSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnZmxpcCcsXG4gIGVuYWJsZWQ6IHRydWUsXG4gIHBoYXNlOiAnbWFpbicsXG4gIGZuOiBmbGlwLFxuICByZXF1aXJlc0lmRXhpc3RzOiBbJ29mZnNldCddLFxuICBkYXRhOiB7XG4gICAgX3NraXA6IGZhbHNlXG4gIH1cbn07IiwiaW1wb3J0IHsgdG9wLCBib3R0b20sIGxlZnQsIHJpZ2h0IH0gZnJvbSBcIi4uL2VudW1zLmpzXCI7XG5pbXBvcnQgZGV0ZWN0T3ZlcmZsb3cgZnJvbSBcIi4uL3V0aWxzL2RldGVjdE92ZXJmbG93LmpzXCI7XG5cbmZ1bmN0aW9uIGdldFNpZGVPZmZzZXRzKG92ZXJmbG93LCByZWN0LCBwcmV2ZW50ZWRPZmZzZXRzKSB7XG4gIGlmIChwcmV2ZW50ZWRPZmZzZXRzID09PSB2b2lkIDApIHtcbiAgICBwcmV2ZW50ZWRPZmZzZXRzID0ge1xuICAgICAgeDogMCxcbiAgICAgIHk6IDBcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0b3A6IG92ZXJmbG93LnRvcCAtIHJlY3QuaGVpZ2h0IC0gcHJldmVudGVkT2Zmc2V0cy55LFxuICAgIHJpZ2h0OiBvdmVyZmxvdy5yaWdodCAtIHJlY3Qud2lkdGggKyBwcmV2ZW50ZWRPZmZzZXRzLngsXG4gICAgYm90dG9tOiBvdmVyZmxvdy5ib3R0b20gLSByZWN0LmhlaWdodCArIHByZXZlbnRlZE9mZnNldHMueSxcbiAgICBsZWZ0OiBvdmVyZmxvdy5sZWZ0IC0gcmVjdC53aWR0aCAtIHByZXZlbnRlZE9mZnNldHMueFxuICB9O1xufVxuXG5mdW5jdGlvbiBpc0FueVNpZGVGdWxseUNsaXBwZWQob3ZlcmZsb3cpIHtcbiAgcmV0dXJuIFt0b3AsIHJpZ2h0LCBib3R0b20sIGxlZnRdLnNvbWUoZnVuY3Rpb24gKHNpZGUpIHtcbiAgICByZXR1cm4gb3ZlcmZsb3dbc2lkZV0gPj0gMDtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGhpZGUoX3JlZikge1xuICB2YXIgc3RhdGUgPSBfcmVmLnN0YXRlLFxuICAgICAgbmFtZSA9IF9yZWYubmFtZTtcbiAgdmFyIHJlZmVyZW5jZVJlY3QgPSBzdGF0ZS5yZWN0cy5yZWZlcmVuY2U7XG4gIHZhciBwb3BwZXJSZWN0ID0gc3RhdGUucmVjdHMucG9wcGVyO1xuICB2YXIgcHJldmVudGVkT2Zmc2V0cyA9IHN0YXRlLm1vZGlmaWVyc0RhdGEucHJldmVudE92ZXJmbG93O1xuICB2YXIgcmVmZXJlbmNlT3ZlcmZsb3cgPSBkZXRlY3RPdmVyZmxvdyhzdGF0ZSwge1xuICAgIGVsZW1lbnRDb250ZXh0OiAncmVmZXJlbmNlJ1xuICB9KTtcbiAgdmFyIHBvcHBlckFsdE92ZXJmbG93ID0gZGV0ZWN0T3ZlcmZsb3coc3RhdGUsIHtcbiAgICBhbHRCb3VuZGFyeTogdHJ1ZVxuICB9KTtcbiAgdmFyIHJlZmVyZW5jZUNsaXBwaW5nT2Zmc2V0cyA9IGdldFNpZGVPZmZzZXRzKHJlZmVyZW5jZU92ZXJmbG93LCByZWZlcmVuY2VSZWN0KTtcbiAgdmFyIHBvcHBlckVzY2FwZU9mZnNldHMgPSBnZXRTaWRlT2Zmc2V0cyhwb3BwZXJBbHRPdmVyZmxvdywgcG9wcGVyUmVjdCwgcHJldmVudGVkT2Zmc2V0cyk7XG4gIHZhciBpc1JlZmVyZW5jZUhpZGRlbiA9IGlzQW55U2lkZUZ1bGx5Q2xpcHBlZChyZWZlcmVuY2VDbGlwcGluZ09mZnNldHMpO1xuICB2YXIgaGFzUG9wcGVyRXNjYXBlZCA9IGlzQW55U2lkZUZ1bGx5Q2xpcHBlZChwb3BwZXJFc2NhcGVPZmZzZXRzKTtcbiAgc3RhdGUubW9kaWZpZXJzRGF0YVtuYW1lXSA9IHtcbiAgICByZWZlcmVuY2VDbGlwcGluZ09mZnNldHM6IHJlZmVyZW5jZUNsaXBwaW5nT2Zmc2V0cyxcbiAgICBwb3BwZXJFc2NhcGVPZmZzZXRzOiBwb3BwZXJFc2NhcGVPZmZzZXRzLFxuICAgIGlzUmVmZXJlbmNlSGlkZGVuOiBpc1JlZmVyZW5jZUhpZGRlbixcbiAgICBoYXNQb3BwZXJFc2NhcGVkOiBoYXNQb3BwZXJFc2NhcGVkXG4gIH07XG4gIHN0YXRlLmF0dHJpYnV0ZXMucG9wcGVyID0gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuYXR0cmlidXRlcy5wb3BwZXIsIHtcbiAgICAnZGF0YS1wb3BwZXItcmVmZXJlbmNlLWhpZGRlbic6IGlzUmVmZXJlbmNlSGlkZGVuLFxuICAgICdkYXRhLXBvcHBlci1lc2NhcGVkJzogaGFzUG9wcGVyRXNjYXBlZFxuICB9KTtcbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ2hpZGUnLFxuICBlbmFibGVkOiB0cnVlLFxuICBwaGFzZTogJ21haW4nLFxuICByZXF1aXJlc0lmRXhpc3RzOiBbJ3ByZXZlbnRPdmVyZmxvdyddLFxuICBmbjogaGlkZVxufTsiLCJpbXBvcnQgZ2V0QmFzZVBsYWNlbWVudCBmcm9tIFwiLi4vdXRpbHMvZ2V0QmFzZVBsYWNlbWVudC5qc1wiO1xuaW1wb3J0IHsgdG9wLCBsZWZ0LCByaWdodCwgcGxhY2VtZW50cyB9IGZyb20gXCIuLi9lbnVtcy5qc1wiO1xuZXhwb3J0IGZ1bmN0aW9uIGRpc3RhbmNlQW5kU2tpZGRpbmdUb1hZKHBsYWNlbWVudCwgcmVjdHMsIG9mZnNldCkge1xuICB2YXIgYmFzZVBsYWNlbWVudCA9IGdldEJhc2VQbGFjZW1lbnQocGxhY2VtZW50KTtcbiAgdmFyIGludmVydERpc3RhbmNlID0gW2xlZnQsIHRvcF0uaW5kZXhPZihiYXNlUGxhY2VtZW50KSA+PSAwID8gLTEgOiAxO1xuXG4gIHZhciBfcmVmID0gdHlwZW9mIG9mZnNldCA9PT0gJ2Z1bmN0aW9uJyA/IG9mZnNldChPYmplY3QuYXNzaWduKHt9LCByZWN0cywge1xuICAgIHBsYWNlbWVudDogcGxhY2VtZW50XG4gIH0pKSA6IG9mZnNldCxcbiAgICAgIHNraWRkaW5nID0gX3JlZlswXSxcbiAgICAgIGRpc3RhbmNlID0gX3JlZlsxXTtcblxuICBza2lkZGluZyA9IHNraWRkaW5nIHx8IDA7XG4gIGRpc3RhbmNlID0gKGRpc3RhbmNlIHx8IDApICogaW52ZXJ0RGlzdGFuY2U7XG4gIHJldHVybiBbbGVmdCwgcmlnaHRdLmluZGV4T2YoYmFzZVBsYWNlbWVudCkgPj0gMCA/IHtcbiAgICB4OiBkaXN0YW5jZSxcbiAgICB5OiBza2lkZGluZ1xuICB9IDoge1xuICAgIHg6IHNraWRkaW5nLFxuICAgIHk6IGRpc3RhbmNlXG4gIH07XG59XG5cbmZ1bmN0aW9uIG9mZnNldChfcmVmMikge1xuICB2YXIgc3RhdGUgPSBfcmVmMi5zdGF0ZSxcbiAgICAgIG9wdGlvbnMgPSBfcmVmMi5vcHRpb25zLFxuICAgICAgbmFtZSA9IF9yZWYyLm5hbWU7XG4gIHZhciBfb3B0aW9ucyRvZmZzZXQgPSBvcHRpb25zLm9mZnNldCxcbiAgICAgIG9mZnNldCA9IF9vcHRpb25zJG9mZnNldCA9PT0gdm9pZCAwID8gWzAsIDBdIDogX29wdGlvbnMkb2Zmc2V0O1xuICB2YXIgZGF0YSA9IHBsYWNlbWVudHMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIHBsYWNlbWVudCkge1xuICAgIGFjY1twbGFjZW1lbnRdID0gZGlzdGFuY2VBbmRTa2lkZGluZ1RvWFkocGxhY2VtZW50LCBzdGF0ZS5yZWN0cywgb2Zmc2V0KTtcbiAgICByZXR1cm4gYWNjO1xuICB9LCB7fSk7XG4gIHZhciBfZGF0YSRzdGF0ZSRwbGFjZW1lbnQgPSBkYXRhW3N0YXRlLnBsYWNlbWVudF0sXG4gICAgICB4ID0gX2RhdGEkc3RhdGUkcGxhY2VtZW50LngsXG4gICAgICB5ID0gX2RhdGEkc3RhdGUkcGxhY2VtZW50Lnk7XG5cbiAgaWYgKHN0YXRlLm1vZGlmaWVyc0RhdGEucG9wcGVyT2Zmc2V0cyAhPSBudWxsKSB7XG4gICAgc3RhdGUubW9kaWZpZXJzRGF0YS5wb3BwZXJPZmZzZXRzLnggKz0geDtcbiAgICBzdGF0ZS5tb2RpZmllcnNEYXRhLnBvcHBlck9mZnNldHMueSArPSB5O1xuICB9XG5cbiAgc3RhdGUubW9kaWZpZXJzRGF0YVtuYW1lXSA9IGRhdGE7XG59IC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW51c2VkLW1vZHVsZXNcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdvZmZzZXQnLFxuICBlbmFibGVkOiB0cnVlLFxuICBwaGFzZTogJ21haW4nLFxuICByZXF1aXJlczogWydwb3BwZXJPZmZzZXRzJ10sXG4gIGZuOiBvZmZzZXRcbn07IiwiaW1wb3J0IGNvbXB1dGVPZmZzZXRzIGZyb20gXCIuLi91dGlscy9jb21wdXRlT2Zmc2V0cy5qc1wiO1xuXG5mdW5jdGlvbiBwb3BwZXJPZmZzZXRzKF9yZWYpIHtcbiAgdmFyIHN0YXRlID0gX3JlZi5zdGF0ZSxcbiAgICAgIG5hbWUgPSBfcmVmLm5hbWU7XG4gIC8vIE9mZnNldHMgYXJlIHRoZSBhY3R1YWwgcG9zaXRpb24gdGhlIHBvcHBlciBuZWVkcyB0byBoYXZlIHRvIGJlXG4gIC8vIHByb3Blcmx5IHBvc2l0aW9uZWQgbmVhciBpdHMgcmVmZXJlbmNlIGVsZW1lbnRcbiAgLy8gVGhpcyBpcyB0aGUgbW9zdCBiYXNpYyBwbGFjZW1lbnQsIGFuZCB3aWxsIGJlIGFkanVzdGVkIGJ5XG4gIC8vIHRoZSBtb2RpZmllcnMgaW4gdGhlIG5leHQgc3RlcFxuICBzdGF0ZS5tb2RpZmllcnNEYXRhW25hbWVdID0gY29tcHV0ZU9mZnNldHMoe1xuICAgIHJlZmVyZW5jZTogc3RhdGUucmVjdHMucmVmZXJlbmNlLFxuICAgIGVsZW1lbnQ6IHN0YXRlLnJlY3RzLnBvcHBlcixcbiAgICBzdHJhdGVneTogJ2Fic29sdXRlJyxcbiAgICBwbGFjZW1lbnQ6IHN0YXRlLnBsYWNlbWVudFxuICB9KTtcbn0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ3BvcHBlck9mZnNldHMnLFxuICBlbmFibGVkOiB0cnVlLFxuICBwaGFzZTogJ3JlYWQnLFxuICBmbjogcG9wcGVyT2Zmc2V0cyxcbiAgZGF0YToge31cbn07IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0QWx0QXhpcyhheGlzKSB7XG4gIHJldHVybiBheGlzID09PSAneCcgPyAneScgOiAneCc7XG59IiwiaW1wb3J0IHsgdG9wLCBsZWZ0LCByaWdodCwgYm90dG9tLCBzdGFydCB9IGZyb20gXCIuLi9lbnVtcy5qc1wiO1xuaW1wb3J0IGdldEJhc2VQbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldEJhc2VQbGFjZW1lbnQuanNcIjtcbmltcG9ydCBnZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQgZnJvbSBcIi4uL3V0aWxzL2dldE1haW5BeGlzRnJvbVBsYWNlbWVudC5qc1wiO1xuaW1wb3J0IGdldEFsdEF4aXMgZnJvbSBcIi4uL3V0aWxzL2dldEFsdEF4aXMuanNcIjtcbmltcG9ydCB3aXRoaW4gZnJvbSBcIi4uL3V0aWxzL3dpdGhpbi5qc1wiO1xuaW1wb3J0IGdldExheW91dFJlY3QgZnJvbSBcIi4uL2RvbS11dGlscy9nZXRMYXlvdXRSZWN0LmpzXCI7XG5pbXBvcnQgZ2V0T2Zmc2V0UGFyZW50IGZyb20gXCIuLi9kb20tdXRpbHMvZ2V0T2Zmc2V0UGFyZW50LmpzXCI7XG5pbXBvcnQgZGV0ZWN0T3ZlcmZsb3cgZnJvbSBcIi4uL3V0aWxzL2RldGVjdE92ZXJmbG93LmpzXCI7XG5pbXBvcnQgZ2V0VmFyaWF0aW9uIGZyb20gXCIuLi91dGlscy9nZXRWYXJpYXRpb24uanNcIjtcbmltcG9ydCBnZXRGcmVzaFNpZGVPYmplY3QgZnJvbSBcIi4uL3V0aWxzL2dldEZyZXNoU2lkZU9iamVjdC5qc1wiO1xuaW1wb3J0IHsgbWF4IGFzIG1hdGhNYXgsIG1pbiBhcyBtYXRoTWluIH0gZnJvbSBcIi4uL3V0aWxzL21hdGguanNcIjtcblxuZnVuY3Rpb24gcHJldmVudE92ZXJmbG93KF9yZWYpIHtcbiAgdmFyIHN0YXRlID0gX3JlZi5zdGF0ZSxcbiAgICAgIG9wdGlvbnMgPSBfcmVmLm9wdGlvbnMsXG4gICAgICBuYW1lID0gX3JlZi5uYW1lO1xuICB2YXIgX29wdGlvbnMkbWFpbkF4aXMgPSBvcHRpb25zLm1haW5BeGlzLFxuICAgICAgY2hlY2tNYWluQXhpcyA9IF9vcHRpb25zJG1haW5BeGlzID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkbWFpbkF4aXMsXG4gICAgICBfb3B0aW9ucyRhbHRBeGlzID0gb3B0aW9ucy5hbHRBeGlzLFxuICAgICAgY2hlY2tBbHRBeGlzID0gX29wdGlvbnMkYWx0QXhpcyA9PT0gdm9pZCAwID8gZmFsc2UgOiBfb3B0aW9ucyRhbHRBeGlzLFxuICAgICAgYm91bmRhcnkgPSBvcHRpb25zLmJvdW5kYXJ5LFxuICAgICAgcm9vdEJvdW5kYXJ5ID0gb3B0aW9ucy5yb290Qm91bmRhcnksXG4gICAgICBhbHRCb3VuZGFyeSA9IG9wdGlvbnMuYWx0Qm91bmRhcnksXG4gICAgICBwYWRkaW5nID0gb3B0aW9ucy5wYWRkaW5nLFxuICAgICAgX29wdGlvbnMkdGV0aGVyID0gb3B0aW9ucy50ZXRoZXIsXG4gICAgICB0ZXRoZXIgPSBfb3B0aW9ucyR0ZXRoZXIgPT09IHZvaWQgMCA/IHRydWUgOiBfb3B0aW9ucyR0ZXRoZXIsXG4gICAgICBfb3B0aW9ucyR0ZXRoZXJPZmZzZXQgPSBvcHRpb25zLnRldGhlck9mZnNldCxcbiAgICAgIHRldGhlck9mZnNldCA9IF9vcHRpb25zJHRldGhlck9mZnNldCA9PT0gdm9pZCAwID8gMCA6IF9vcHRpb25zJHRldGhlck9mZnNldDtcbiAgdmFyIG92ZXJmbG93ID0gZGV0ZWN0T3ZlcmZsb3coc3RhdGUsIHtcbiAgICBib3VuZGFyeTogYm91bmRhcnksXG4gICAgcm9vdEJvdW5kYXJ5OiByb290Qm91bmRhcnksXG4gICAgcGFkZGluZzogcGFkZGluZyxcbiAgICBhbHRCb3VuZGFyeTogYWx0Qm91bmRhcnlcbiAgfSk7XG4gIHZhciBiYXNlUGxhY2VtZW50ID0gZ2V0QmFzZVBsYWNlbWVudChzdGF0ZS5wbGFjZW1lbnQpO1xuICB2YXIgdmFyaWF0aW9uID0gZ2V0VmFyaWF0aW9uKHN0YXRlLnBsYWNlbWVudCk7XG4gIHZhciBpc0Jhc2VQbGFjZW1lbnQgPSAhdmFyaWF0aW9uO1xuICB2YXIgbWFpbkF4aXMgPSBnZXRNYWluQXhpc0Zyb21QbGFjZW1lbnQoYmFzZVBsYWNlbWVudCk7XG4gIHZhciBhbHRBeGlzID0gZ2V0QWx0QXhpcyhtYWluQXhpcyk7XG4gIHZhciBwb3BwZXJPZmZzZXRzID0gc3RhdGUubW9kaWZpZXJzRGF0YS5wb3BwZXJPZmZzZXRzO1xuICB2YXIgcmVmZXJlbmNlUmVjdCA9IHN0YXRlLnJlY3RzLnJlZmVyZW5jZTtcbiAgdmFyIHBvcHBlclJlY3QgPSBzdGF0ZS5yZWN0cy5wb3BwZXI7XG4gIHZhciB0ZXRoZXJPZmZzZXRWYWx1ZSA9IHR5cGVvZiB0ZXRoZXJPZmZzZXQgPT09ICdmdW5jdGlvbicgPyB0ZXRoZXJPZmZzZXQoT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUucmVjdHMsIHtcbiAgICBwbGFjZW1lbnQ6IHN0YXRlLnBsYWNlbWVudFxuICB9KSkgOiB0ZXRoZXJPZmZzZXQ7XG4gIHZhciBkYXRhID0ge1xuICAgIHg6IDAsXG4gICAgeTogMFxuICB9O1xuXG4gIGlmICghcG9wcGVyT2Zmc2V0cykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChjaGVja01haW5BeGlzIHx8IGNoZWNrQWx0QXhpcykge1xuICAgIHZhciBtYWluU2lkZSA9IG1haW5BeGlzID09PSAneScgPyB0b3AgOiBsZWZ0O1xuICAgIHZhciBhbHRTaWRlID0gbWFpbkF4aXMgPT09ICd5JyA/IGJvdHRvbSA6IHJpZ2h0O1xuICAgIHZhciBsZW4gPSBtYWluQXhpcyA9PT0gJ3knID8gJ2hlaWdodCcgOiAnd2lkdGgnO1xuICAgIHZhciBvZmZzZXQgPSBwb3BwZXJPZmZzZXRzW21haW5BeGlzXTtcbiAgICB2YXIgbWluID0gcG9wcGVyT2Zmc2V0c1ttYWluQXhpc10gKyBvdmVyZmxvd1ttYWluU2lkZV07XG4gICAgdmFyIG1heCA9IHBvcHBlck9mZnNldHNbbWFpbkF4aXNdIC0gb3ZlcmZsb3dbYWx0U2lkZV07XG4gICAgdmFyIGFkZGl0aXZlID0gdGV0aGVyID8gLXBvcHBlclJlY3RbbGVuXSAvIDIgOiAwO1xuICAgIHZhciBtaW5MZW4gPSB2YXJpYXRpb24gPT09IHN0YXJ0ID8gcmVmZXJlbmNlUmVjdFtsZW5dIDogcG9wcGVyUmVjdFtsZW5dO1xuICAgIHZhciBtYXhMZW4gPSB2YXJpYXRpb24gPT09IHN0YXJ0ID8gLXBvcHBlclJlY3RbbGVuXSA6IC1yZWZlcmVuY2VSZWN0W2xlbl07IC8vIFdlIG5lZWQgdG8gaW5jbHVkZSB0aGUgYXJyb3cgaW4gdGhlIGNhbGN1bGF0aW9uIHNvIHRoZSBhcnJvdyBkb2Vzbid0IGdvXG4gICAgLy8gb3V0c2lkZSB0aGUgcmVmZXJlbmNlIGJvdW5kc1xuXG4gICAgdmFyIGFycm93RWxlbWVudCA9IHN0YXRlLmVsZW1lbnRzLmFycm93O1xuICAgIHZhciBhcnJvd1JlY3QgPSB0ZXRoZXIgJiYgYXJyb3dFbGVtZW50ID8gZ2V0TGF5b3V0UmVjdChhcnJvd0VsZW1lbnQpIDoge1xuICAgICAgd2lkdGg6IDAsXG4gICAgICBoZWlnaHQ6IDBcbiAgICB9O1xuICAgIHZhciBhcnJvd1BhZGRpbmdPYmplY3QgPSBzdGF0ZS5tb2RpZmllcnNEYXRhWydhcnJvdyNwZXJzaXN0ZW50J10gPyBzdGF0ZS5tb2RpZmllcnNEYXRhWydhcnJvdyNwZXJzaXN0ZW50J10ucGFkZGluZyA6IGdldEZyZXNoU2lkZU9iamVjdCgpO1xuICAgIHZhciBhcnJvd1BhZGRpbmdNaW4gPSBhcnJvd1BhZGRpbmdPYmplY3RbbWFpblNpZGVdO1xuICAgIHZhciBhcnJvd1BhZGRpbmdNYXggPSBhcnJvd1BhZGRpbmdPYmplY3RbYWx0U2lkZV07IC8vIElmIHRoZSByZWZlcmVuY2UgbGVuZ3RoIGlzIHNtYWxsZXIgdGhhbiB0aGUgYXJyb3cgbGVuZ3RoLCB3ZSBkb24ndCB3YW50XG4gICAgLy8gdG8gaW5jbHVkZSBpdHMgZnVsbCBzaXplIGluIHRoZSBjYWxjdWxhdGlvbi4gSWYgdGhlIHJlZmVyZW5jZSBpcyBzbWFsbFxuICAgIC8vIGFuZCBuZWFyIHRoZSBlZGdlIG9mIGEgYm91bmRhcnksIHRoZSBwb3BwZXIgY2FuIG92ZXJmbG93IGV2ZW4gaWYgdGhlXG4gICAgLy8gcmVmZXJlbmNlIGlzIG5vdCBvdmVyZmxvd2luZyBhcyB3ZWxsIChlLmcuIHZpcnR1YWwgZWxlbWVudHMgd2l0aCBub1xuICAgIC8vIHdpZHRoIG9yIGhlaWdodClcblxuICAgIHZhciBhcnJvd0xlbiA9IHdpdGhpbigwLCByZWZlcmVuY2VSZWN0W2xlbl0sIGFycm93UmVjdFtsZW5dKTtcbiAgICB2YXIgbWluT2Zmc2V0ID0gaXNCYXNlUGxhY2VtZW50ID8gcmVmZXJlbmNlUmVjdFtsZW5dIC8gMiAtIGFkZGl0aXZlIC0gYXJyb3dMZW4gLSBhcnJvd1BhZGRpbmdNaW4gLSB0ZXRoZXJPZmZzZXRWYWx1ZSA6IG1pbkxlbiAtIGFycm93TGVuIC0gYXJyb3dQYWRkaW5nTWluIC0gdGV0aGVyT2Zmc2V0VmFsdWU7XG4gICAgdmFyIG1heE9mZnNldCA9IGlzQmFzZVBsYWNlbWVudCA/IC1yZWZlcmVuY2VSZWN0W2xlbl0gLyAyICsgYWRkaXRpdmUgKyBhcnJvd0xlbiArIGFycm93UGFkZGluZ01heCArIHRldGhlck9mZnNldFZhbHVlIDogbWF4TGVuICsgYXJyb3dMZW4gKyBhcnJvd1BhZGRpbmdNYXggKyB0ZXRoZXJPZmZzZXRWYWx1ZTtcbiAgICB2YXIgYXJyb3dPZmZzZXRQYXJlbnQgPSBzdGF0ZS5lbGVtZW50cy5hcnJvdyAmJiBnZXRPZmZzZXRQYXJlbnQoc3RhdGUuZWxlbWVudHMuYXJyb3cpO1xuICAgIHZhciBjbGllbnRPZmZzZXQgPSBhcnJvd09mZnNldFBhcmVudCA/IG1haW5BeGlzID09PSAneScgPyBhcnJvd09mZnNldFBhcmVudC5jbGllbnRUb3AgfHwgMCA6IGFycm93T2Zmc2V0UGFyZW50LmNsaWVudExlZnQgfHwgMCA6IDA7XG4gICAgdmFyIG9mZnNldE1vZGlmaWVyVmFsdWUgPSBzdGF0ZS5tb2RpZmllcnNEYXRhLm9mZnNldCA/IHN0YXRlLm1vZGlmaWVyc0RhdGEub2Zmc2V0W3N0YXRlLnBsYWNlbWVudF1bbWFpbkF4aXNdIDogMDtcbiAgICB2YXIgdGV0aGVyTWluID0gcG9wcGVyT2Zmc2V0c1ttYWluQXhpc10gKyBtaW5PZmZzZXQgLSBvZmZzZXRNb2RpZmllclZhbHVlIC0gY2xpZW50T2Zmc2V0O1xuICAgIHZhciB0ZXRoZXJNYXggPSBwb3BwZXJPZmZzZXRzW21haW5BeGlzXSArIG1heE9mZnNldCAtIG9mZnNldE1vZGlmaWVyVmFsdWU7XG5cbiAgICBpZiAoY2hlY2tNYWluQXhpcykge1xuICAgICAgdmFyIHByZXZlbnRlZE9mZnNldCA9IHdpdGhpbih0ZXRoZXIgPyBtYXRoTWluKG1pbiwgdGV0aGVyTWluKSA6IG1pbiwgb2Zmc2V0LCB0ZXRoZXIgPyBtYXRoTWF4KG1heCwgdGV0aGVyTWF4KSA6IG1heCk7XG4gICAgICBwb3BwZXJPZmZzZXRzW21haW5BeGlzXSA9IHByZXZlbnRlZE9mZnNldDtcbiAgICAgIGRhdGFbbWFpbkF4aXNdID0gcHJldmVudGVkT2Zmc2V0IC0gb2Zmc2V0O1xuICAgIH1cblxuICAgIGlmIChjaGVja0FsdEF4aXMpIHtcbiAgICAgIHZhciBfbWFpblNpZGUgPSBtYWluQXhpcyA9PT0gJ3gnID8gdG9wIDogbGVmdDtcblxuICAgICAgdmFyIF9hbHRTaWRlID0gbWFpbkF4aXMgPT09ICd4JyA/IGJvdHRvbSA6IHJpZ2h0O1xuXG4gICAgICB2YXIgX29mZnNldCA9IHBvcHBlck9mZnNldHNbYWx0QXhpc107XG5cbiAgICAgIHZhciBfbWluID0gX29mZnNldCArIG92ZXJmbG93W19tYWluU2lkZV07XG5cbiAgICAgIHZhciBfbWF4ID0gX29mZnNldCAtIG92ZXJmbG93W19hbHRTaWRlXTtcblxuICAgICAgdmFyIF9wcmV2ZW50ZWRPZmZzZXQgPSB3aXRoaW4odGV0aGVyID8gbWF0aE1pbihfbWluLCB0ZXRoZXJNaW4pIDogX21pbiwgX29mZnNldCwgdGV0aGVyID8gbWF0aE1heChfbWF4LCB0ZXRoZXJNYXgpIDogX21heCk7XG5cbiAgICAgIHBvcHBlck9mZnNldHNbYWx0QXhpc10gPSBfcHJldmVudGVkT2Zmc2V0O1xuICAgICAgZGF0YVthbHRBeGlzXSA9IF9wcmV2ZW50ZWRPZmZzZXQgLSBfb2Zmc2V0O1xuICAgIH1cbiAgfVxuXG4gIHN0YXRlLm1vZGlmaWVyc0RhdGFbbmFtZV0gPSBkYXRhO1xufSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAncHJldmVudE92ZXJmbG93JyxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgcGhhc2U6ICdtYWluJyxcbiAgZm46IHByZXZlbnRPdmVyZmxvdyxcbiAgcmVxdWlyZXNJZkV4aXN0czogWydvZmZzZXQnXVxufTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRIVE1MRWxlbWVudFNjcm9sbChlbGVtZW50KSB7XG4gIHJldHVybiB7XG4gICAgc2Nyb2xsTGVmdDogZWxlbWVudC5zY3JvbGxMZWZ0LFxuICAgIHNjcm9sbFRvcDogZWxlbWVudC5zY3JvbGxUb3BcbiAgfTtcbn0iLCJpbXBvcnQgZ2V0V2luZG93U2Nyb2xsIGZyb20gXCIuL2dldFdpbmRvd1Njcm9sbC5qc1wiO1xuaW1wb3J0IGdldFdpbmRvdyBmcm9tIFwiLi9nZXRXaW5kb3cuanNcIjtcbmltcG9ydCB7IGlzSFRNTEVsZW1lbnQgfSBmcm9tIFwiLi9pbnN0YW5jZU9mLmpzXCI7XG5pbXBvcnQgZ2V0SFRNTEVsZW1lbnRTY3JvbGwgZnJvbSBcIi4vZ2V0SFRNTEVsZW1lbnRTY3JvbGwuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldE5vZGVTY3JvbGwobm9kZSkge1xuICBpZiAobm9kZSA9PT0gZ2V0V2luZG93KG5vZGUpIHx8ICFpc0hUTUxFbGVtZW50KG5vZGUpKSB7XG4gICAgcmV0dXJuIGdldFdpbmRvd1Njcm9sbChub2RlKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZ2V0SFRNTEVsZW1lbnRTY3JvbGwobm9kZSk7XG4gIH1cbn0iLCJpbXBvcnQgZ2V0Qm91bmRpbmdDbGllbnRSZWN0IGZyb20gXCIuL2dldEJvdW5kaW5nQ2xpZW50UmVjdC5qc1wiO1xuaW1wb3J0IGdldE5vZGVTY3JvbGwgZnJvbSBcIi4vZ2V0Tm9kZVNjcm9sbC5qc1wiO1xuaW1wb3J0IGdldE5vZGVOYW1lIGZyb20gXCIuL2dldE5vZGVOYW1lLmpzXCI7XG5pbXBvcnQgeyBpc0hUTUxFbGVtZW50IH0gZnJvbSBcIi4vaW5zdGFuY2VPZi5qc1wiO1xuaW1wb3J0IGdldFdpbmRvd1Njcm9sbEJhclggZnJvbSBcIi4vZ2V0V2luZG93U2Nyb2xsQmFyWC5qc1wiO1xuaW1wb3J0IGdldERvY3VtZW50RWxlbWVudCBmcm9tIFwiLi9nZXREb2N1bWVudEVsZW1lbnQuanNcIjtcbmltcG9ydCBpc1Njcm9sbFBhcmVudCBmcm9tIFwiLi9pc1Njcm9sbFBhcmVudC5qc1wiO1xuXG5mdW5jdGlvbiBpc0VsZW1lbnRTY2FsZWQoZWxlbWVudCkge1xuICB2YXIgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIHZhciBzY2FsZVggPSByZWN0LndpZHRoIC8gZWxlbWVudC5vZmZzZXRXaWR0aCB8fCAxO1xuICB2YXIgc2NhbGVZID0gcmVjdC5oZWlnaHQgLyBlbGVtZW50Lm9mZnNldEhlaWdodCB8fCAxO1xuICByZXR1cm4gc2NhbGVYICE9PSAxIHx8IHNjYWxlWSAhPT0gMTtcbn0gLy8gUmV0dXJucyB0aGUgY29tcG9zaXRlIHJlY3Qgb2YgYW4gZWxlbWVudCByZWxhdGl2ZSB0byBpdHMgb2Zmc2V0UGFyZW50LlxuLy8gQ29tcG9zaXRlIG1lYW5zIGl0IHRha2VzIGludG8gYWNjb3VudCB0cmFuc2Zvcm1zIGFzIHdlbGwgYXMgbGF5b3V0LlxuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldENvbXBvc2l0ZVJlY3QoZWxlbWVudE9yVmlydHVhbEVsZW1lbnQsIG9mZnNldFBhcmVudCwgaXNGaXhlZCkge1xuICBpZiAoaXNGaXhlZCA9PT0gdm9pZCAwKSB7XG4gICAgaXNGaXhlZCA9IGZhbHNlO1xuICB9XG5cbiAgdmFyIGlzT2Zmc2V0UGFyZW50QW5FbGVtZW50ID0gaXNIVE1MRWxlbWVudChvZmZzZXRQYXJlbnQpO1xuICB2YXIgb2Zmc2V0UGFyZW50SXNTY2FsZWQgPSBpc0hUTUxFbGVtZW50KG9mZnNldFBhcmVudCkgJiYgaXNFbGVtZW50U2NhbGVkKG9mZnNldFBhcmVudCk7XG4gIHZhciBkb2N1bWVudEVsZW1lbnQgPSBnZXREb2N1bWVudEVsZW1lbnQob2Zmc2V0UGFyZW50KTtcbiAgdmFyIHJlY3QgPSBnZXRCb3VuZGluZ0NsaWVudFJlY3QoZWxlbWVudE9yVmlydHVhbEVsZW1lbnQsIG9mZnNldFBhcmVudElzU2NhbGVkKTtcbiAgdmFyIHNjcm9sbCA9IHtcbiAgICBzY3JvbGxMZWZ0OiAwLFxuICAgIHNjcm9sbFRvcDogMFxuICB9O1xuICB2YXIgb2Zmc2V0cyA9IHtcbiAgICB4OiAwLFxuICAgIHk6IDBcbiAgfTtcblxuICBpZiAoaXNPZmZzZXRQYXJlbnRBbkVsZW1lbnQgfHwgIWlzT2Zmc2V0UGFyZW50QW5FbGVtZW50ICYmICFpc0ZpeGVkKSB7XG4gICAgaWYgKGdldE5vZGVOYW1lKG9mZnNldFBhcmVudCkgIT09ICdib2R5JyB8fCAvLyBodHRwczovL2dpdGh1Yi5jb20vcG9wcGVyanMvcG9wcGVyLWNvcmUvaXNzdWVzLzEwNzhcbiAgICBpc1Njcm9sbFBhcmVudChkb2N1bWVudEVsZW1lbnQpKSB7XG4gICAgICBzY3JvbGwgPSBnZXROb2RlU2Nyb2xsKG9mZnNldFBhcmVudCk7XG4gICAgfVxuXG4gICAgaWYgKGlzSFRNTEVsZW1lbnQob2Zmc2V0UGFyZW50KSkge1xuICAgICAgb2Zmc2V0cyA9IGdldEJvdW5kaW5nQ2xpZW50UmVjdChvZmZzZXRQYXJlbnQsIHRydWUpO1xuICAgICAgb2Zmc2V0cy54ICs9IG9mZnNldFBhcmVudC5jbGllbnRMZWZ0O1xuICAgICAgb2Zmc2V0cy55ICs9IG9mZnNldFBhcmVudC5jbGllbnRUb3A7XG4gICAgfSBlbHNlIGlmIChkb2N1bWVudEVsZW1lbnQpIHtcbiAgICAgIG9mZnNldHMueCA9IGdldFdpbmRvd1Njcm9sbEJhclgoZG9jdW1lbnRFbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHg6IHJlY3QubGVmdCArIHNjcm9sbC5zY3JvbGxMZWZ0IC0gb2Zmc2V0cy54LFxuICAgIHk6IHJlY3QudG9wICsgc2Nyb2xsLnNjcm9sbFRvcCAtIG9mZnNldHMueSxcbiAgICB3aWR0aDogcmVjdC53aWR0aCxcbiAgICBoZWlnaHQ6IHJlY3QuaGVpZ2h0XG4gIH07XG59IiwiaW1wb3J0IHsgbW9kaWZpZXJQaGFzZXMgfSBmcm9tIFwiLi4vZW51bXMuanNcIjsgLy8gc291cmNlOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80OTg3NTI1NVxuXG5mdW5jdGlvbiBvcmRlcihtb2RpZmllcnMpIHtcbiAgdmFyIG1hcCA9IG5ldyBNYXAoKTtcbiAgdmFyIHZpc2l0ZWQgPSBuZXcgU2V0KCk7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgbW9kaWZpZXJzLmZvckVhY2goZnVuY3Rpb24gKG1vZGlmaWVyKSB7XG4gICAgbWFwLnNldChtb2RpZmllci5uYW1lLCBtb2RpZmllcik7XG4gIH0pOyAvLyBPbiB2aXNpdGluZyBvYmplY3QsIGNoZWNrIGZvciBpdHMgZGVwZW5kZW5jaWVzIGFuZCB2aXNpdCB0aGVtIHJlY3Vyc2l2ZWx5XG5cbiAgZnVuY3Rpb24gc29ydChtb2RpZmllcikge1xuICAgIHZpc2l0ZWQuYWRkKG1vZGlmaWVyLm5hbWUpO1xuICAgIHZhciByZXF1aXJlcyA9IFtdLmNvbmNhdChtb2RpZmllci5yZXF1aXJlcyB8fCBbXSwgbW9kaWZpZXIucmVxdWlyZXNJZkV4aXN0cyB8fCBbXSk7XG4gICAgcmVxdWlyZXMuZm9yRWFjaChmdW5jdGlvbiAoZGVwKSB7XG4gICAgICBpZiAoIXZpc2l0ZWQuaGFzKGRlcCkpIHtcbiAgICAgICAgdmFyIGRlcE1vZGlmaWVyID0gbWFwLmdldChkZXApO1xuXG4gICAgICAgIGlmIChkZXBNb2RpZmllcikge1xuICAgICAgICAgIHNvcnQoZGVwTW9kaWZpZXIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmVzdWx0LnB1c2gobW9kaWZpZXIpO1xuICB9XG5cbiAgbW9kaWZpZXJzLmZvckVhY2goZnVuY3Rpb24gKG1vZGlmaWVyKSB7XG4gICAgaWYgKCF2aXNpdGVkLmhhcyhtb2RpZmllci5uYW1lKSkge1xuICAgICAgLy8gY2hlY2sgZm9yIHZpc2l0ZWQgb2JqZWN0XG4gICAgICBzb3J0KG1vZGlmaWVyKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBvcmRlck1vZGlmaWVycyhtb2RpZmllcnMpIHtcbiAgLy8gb3JkZXIgYmFzZWQgb24gZGVwZW5kZW5jaWVzXG4gIHZhciBvcmRlcmVkTW9kaWZpZXJzID0gb3JkZXIobW9kaWZpZXJzKTsgLy8gb3JkZXIgYmFzZWQgb24gcGhhc2VcblxuICByZXR1cm4gbW9kaWZpZXJQaGFzZXMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIHBoYXNlKSB7XG4gICAgcmV0dXJuIGFjYy5jb25jYXQob3JkZXJlZE1vZGlmaWVycy5maWx0ZXIoZnVuY3Rpb24gKG1vZGlmaWVyKSB7XG4gICAgICByZXR1cm4gbW9kaWZpZXIucGhhc2UgPT09IHBoYXNlO1xuICAgIH0pKTtcbiAgfSwgW10pO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRlYm91bmNlKGZuKSB7XG4gIHZhciBwZW5kaW5nO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGlmICghcGVuZGluZykge1xuICAgICAgcGVuZGluZyA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHBlbmRpbmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgcmVzb2x2ZShmbigpKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGVuZGluZztcbiAgfTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBmb3JtYXQoc3RyKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHJldHVybiBbXS5jb25jYXQoYXJncykucmVkdWNlKGZ1bmN0aW9uIChwLCBjKSB7XG4gICAgcmV0dXJuIHAucmVwbGFjZSgvJXMvLCBjKTtcbiAgfSwgc3RyKTtcbn0iLCJpbXBvcnQgZm9ybWF0IGZyb20gXCIuL2Zvcm1hdC5qc1wiO1xuaW1wb3J0IHsgbW9kaWZpZXJQaGFzZXMgfSBmcm9tIFwiLi4vZW51bXMuanNcIjtcbnZhciBJTlZBTElEX01PRElGSUVSX0VSUk9SID0gJ1BvcHBlcjogbW9kaWZpZXIgXCIlc1wiIHByb3ZpZGVkIGFuIGludmFsaWQgJXMgcHJvcGVydHksIGV4cGVjdGVkICVzIGJ1dCBnb3QgJXMnO1xudmFyIE1JU1NJTkdfREVQRU5ERU5DWV9FUlJPUiA9ICdQb3BwZXI6IG1vZGlmaWVyIFwiJXNcIiByZXF1aXJlcyBcIiVzXCIsIGJ1dCBcIiVzXCIgbW9kaWZpZXIgaXMgbm90IGF2YWlsYWJsZSc7XG52YXIgVkFMSURfUFJPUEVSVElFUyA9IFsnbmFtZScsICdlbmFibGVkJywgJ3BoYXNlJywgJ2ZuJywgJ2VmZmVjdCcsICdyZXF1aXJlcycsICdvcHRpb25zJ107XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB2YWxpZGF0ZU1vZGlmaWVycyhtb2RpZmllcnMpIHtcbiAgbW9kaWZpZXJzLmZvckVhY2goZnVuY3Rpb24gKG1vZGlmaWVyKSB7XG4gICAgW10uY29uY2F0KE9iamVjdC5rZXlzKG1vZGlmaWVyKSwgVkFMSURfUFJPUEVSVElFUykgLy8gSUUxMS1jb21wYXRpYmxlIHJlcGxhY2VtZW50IGZvciBgbmV3IFNldChpdGVyYWJsZSlgXG4gICAgLmZpbHRlcihmdW5jdGlvbiAodmFsdWUsIGluZGV4LCBzZWxmKSB7XG4gICAgICByZXR1cm4gc2VsZi5pbmRleE9mKHZhbHVlKSA9PT0gaW5kZXg7XG4gICAgfSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICBjYXNlICduYW1lJzpcbiAgICAgICAgICBpZiAodHlwZW9mIG1vZGlmaWVyLm5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGZvcm1hdChJTlZBTElEX01PRElGSUVSX0VSUk9SLCBTdHJpbmcobW9kaWZpZXIubmFtZSksICdcIm5hbWVcIicsICdcInN0cmluZ1wiJywgXCJcXFwiXCIgKyBTdHJpbmcobW9kaWZpZXIubmFtZSkgKyBcIlxcXCJcIikpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ2VuYWJsZWQnOlxuICAgICAgICAgIGlmICh0eXBlb2YgbW9kaWZpZXIuZW5hYmxlZCAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGZvcm1hdChJTlZBTElEX01PRElGSUVSX0VSUk9SLCBtb2RpZmllci5uYW1lLCAnXCJlbmFibGVkXCInLCAnXCJib29sZWFuXCInLCBcIlxcXCJcIiArIFN0cmluZyhtb2RpZmllci5lbmFibGVkKSArIFwiXFxcIlwiKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAncGhhc2UnOlxuICAgICAgICAgIGlmIChtb2RpZmllclBoYXNlcy5pbmRleE9mKG1vZGlmaWVyLnBoYXNlKSA8IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZm9ybWF0KElOVkFMSURfTU9ESUZJRVJfRVJST1IsIG1vZGlmaWVyLm5hbWUsICdcInBoYXNlXCInLCBcImVpdGhlciBcIiArIG1vZGlmaWVyUGhhc2VzLmpvaW4oJywgJyksIFwiXFxcIlwiICsgU3RyaW5nKG1vZGlmaWVyLnBoYXNlKSArIFwiXFxcIlwiKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnZm4nOlxuICAgICAgICAgIGlmICh0eXBlb2YgbW9kaWZpZXIuZm4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZm9ybWF0KElOVkFMSURfTU9ESUZJRVJfRVJST1IsIG1vZGlmaWVyLm5hbWUsICdcImZuXCInLCAnXCJmdW5jdGlvblwiJywgXCJcXFwiXCIgKyBTdHJpbmcobW9kaWZpZXIuZm4pICsgXCJcXFwiXCIpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdlZmZlY3QnOlxuICAgICAgICAgIGlmIChtb2RpZmllci5lZmZlY3QgIT0gbnVsbCAmJiB0eXBlb2YgbW9kaWZpZXIuZWZmZWN0ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGZvcm1hdChJTlZBTElEX01PRElGSUVSX0VSUk9SLCBtb2RpZmllci5uYW1lLCAnXCJlZmZlY3RcIicsICdcImZ1bmN0aW9uXCInLCBcIlxcXCJcIiArIFN0cmluZyhtb2RpZmllci5mbikgKyBcIlxcXCJcIikpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ3JlcXVpcmVzJzpcbiAgICAgICAgICBpZiAobW9kaWZpZXIucmVxdWlyZXMgIT0gbnVsbCAmJiAhQXJyYXkuaXNBcnJheShtb2RpZmllci5yZXF1aXJlcykpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZm9ybWF0KElOVkFMSURfTU9ESUZJRVJfRVJST1IsIG1vZGlmaWVyLm5hbWUsICdcInJlcXVpcmVzXCInLCAnXCJhcnJheVwiJywgXCJcXFwiXCIgKyBTdHJpbmcobW9kaWZpZXIucmVxdWlyZXMpICsgXCJcXFwiXCIpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdyZXF1aXJlc0lmRXhpc3RzJzpcbiAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkobW9kaWZpZXIucmVxdWlyZXNJZkV4aXN0cykpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZm9ybWF0KElOVkFMSURfTU9ESUZJRVJfRVJST1IsIG1vZGlmaWVyLm5hbWUsICdcInJlcXVpcmVzSWZFeGlzdHNcIicsICdcImFycmF5XCInLCBcIlxcXCJcIiArIFN0cmluZyhtb2RpZmllci5yZXF1aXJlc0lmRXhpc3RzKSArIFwiXFxcIlwiKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnb3B0aW9ucyc6XG4gICAgICAgIGNhc2UgJ2RhdGEnOlxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcIlBvcHBlckpTOiBhbiBpbnZhbGlkIHByb3BlcnR5IGhhcyBiZWVuIHByb3ZpZGVkIHRvIHRoZSBcXFwiXCIgKyBtb2RpZmllci5uYW1lICsgXCJcXFwiIG1vZGlmaWVyLCB2YWxpZCBwcm9wZXJ0aWVzIGFyZSBcIiArIFZBTElEX1BST1BFUlRJRVMubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJcXFwiXCIgKyBzICsgXCJcXFwiXCI7XG4gICAgICAgICAgfSkuam9pbignLCAnKSArIFwiOyBidXQgXFxcIlwiICsga2V5ICsgXCJcXFwiIHdhcyBwcm92aWRlZC5cIik7XG4gICAgICB9XG5cbiAgICAgIG1vZGlmaWVyLnJlcXVpcmVzICYmIG1vZGlmaWVyLnJlcXVpcmVzLmZvckVhY2goZnVuY3Rpb24gKHJlcXVpcmVtZW50KSB7XG4gICAgICAgIGlmIChtb2RpZmllcnMuZmluZChmdW5jdGlvbiAobW9kKSB7XG4gICAgICAgICAgcmV0dXJuIG1vZC5uYW1lID09PSByZXF1aXJlbWVudDtcbiAgICAgICAgfSkgPT0gbnVsbCkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZm9ybWF0KE1JU1NJTkdfREVQRU5ERU5DWV9FUlJPUiwgU3RyaW5nKG1vZGlmaWVyLm5hbWUpLCByZXF1aXJlbWVudCwgcmVxdWlyZW1lbnQpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVuaXF1ZUJ5KGFyciwgZm4pIHtcbiAgdmFyIGlkZW50aWZpZXJzID0gbmV3IFNldCgpO1xuICByZXR1cm4gYXJyLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xuICAgIHZhciBpZGVudGlmaWVyID0gZm4oaXRlbSk7XG5cbiAgICBpZiAoIWlkZW50aWZpZXJzLmhhcyhpZGVudGlmaWVyKSkge1xuICAgICAgaWRlbnRpZmllcnMuYWRkKGlkZW50aWZpZXIpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9KTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtZXJnZUJ5TmFtZShtb2RpZmllcnMpIHtcbiAgdmFyIG1lcmdlZCA9IG1vZGlmaWVycy5yZWR1Y2UoZnVuY3Rpb24gKG1lcmdlZCwgY3VycmVudCkge1xuICAgIHZhciBleGlzdGluZyA9IG1lcmdlZFtjdXJyZW50Lm5hbWVdO1xuICAgIG1lcmdlZFtjdXJyZW50Lm5hbWVdID0gZXhpc3RpbmcgPyBPYmplY3QuYXNzaWduKHt9LCBleGlzdGluZywgY3VycmVudCwge1xuICAgICAgb3B0aW9uczogT2JqZWN0LmFzc2lnbih7fSwgZXhpc3Rpbmcub3B0aW9ucywgY3VycmVudC5vcHRpb25zKSxcbiAgICAgIGRhdGE6IE9iamVjdC5hc3NpZ24oe30sIGV4aXN0aW5nLmRhdGEsIGN1cnJlbnQuZGF0YSlcbiAgICB9KSA6IGN1cnJlbnQ7XG4gICAgcmV0dXJuIG1lcmdlZDtcbiAgfSwge30pOyAvLyBJRTExIGRvZXMgbm90IHN1cHBvcnQgT2JqZWN0LnZhbHVlc1xuXG4gIHJldHVybiBPYmplY3Qua2V5cyhtZXJnZWQpLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIG1lcmdlZFtrZXldO1xuICB9KTtcbn0iLCJpbXBvcnQgZ2V0Q29tcG9zaXRlUmVjdCBmcm9tIFwiLi9kb20tdXRpbHMvZ2V0Q29tcG9zaXRlUmVjdC5qc1wiO1xuaW1wb3J0IGdldExheW91dFJlY3QgZnJvbSBcIi4vZG9tLXV0aWxzL2dldExheW91dFJlY3QuanNcIjtcbmltcG9ydCBsaXN0U2Nyb2xsUGFyZW50cyBmcm9tIFwiLi9kb20tdXRpbHMvbGlzdFNjcm9sbFBhcmVudHMuanNcIjtcbmltcG9ydCBnZXRPZmZzZXRQYXJlbnQgZnJvbSBcIi4vZG9tLXV0aWxzL2dldE9mZnNldFBhcmVudC5qc1wiO1xuaW1wb3J0IGdldENvbXB1dGVkU3R5bGUgZnJvbSBcIi4vZG9tLXV0aWxzL2dldENvbXB1dGVkU3R5bGUuanNcIjtcbmltcG9ydCBvcmRlck1vZGlmaWVycyBmcm9tIFwiLi91dGlscy9vcmRlck1vZGlmaWVycy5qc1wiO1xuaW1wb3J0IGRlYm91bmNlIGZyb20gXCIuL3V0aWxzL2RlYm91bmNlLmpzXCI7XG5pbXBvcnQgdmFsaWRhdGVNb2RpZmllcnMgZnJvbSBcIi4vdXRpbHMvdmFsaWRhdGVNb2RpZmllcnMuanNcIjtcbmltcG9ydCB1bmlxdWVCeSBmcm9tIFwiLi91dGlscy91bmlxdWVCeS5qc1wiO1xuaW1wb3J0IGdldEJhc2VQbGFjZW1lbnQgZnJvbSBcIi4vdXRpbHMvZ2V0QmFzZVBsYWNlbWVudC5qc1wiO1xuaW1wb3J0IG1lcmdlQnlOYW1lIGZyb20gXCIuL3V0aWxzL21lcmdlQnlOYW1lLmpzXCI7XG5pbXBvcnQgZGV0ZWN0T3ZlcmZsb3cgZnJvbSBcIi4vdXRpbHMvZGV0ZWN0T3ZlcmZsb3cuanNcIjtcbmltcG9ydCB7IGlzRWxlbWVudCB9IGZyb20gXCIuL2RvbS11dGlscy9pbnN0YW5jZU9mLmpzXCI7XG5pbXBvcnQgeyBhdXRvIH0gZnJvbSBcIi4vZW51bXMuanNcIjtcbnZhciBJTlZBTElEX0VMRU1FTlRfRVJST1IgPSAnUG9wcGVyOiBJbnZhbGlkIHJlZmVyZW5jZSBvciBwb3BwZXIgYXJndW1lbnQgcHJvdmlkZWQuIFRoZXkgbXVzdCBiZSBlaXRoZXIgYSBET00gZWxlbWVudCBvciB2aXJ0dWFsIGVsZW1lbnQuJztcbnZhciBJTkZJTklURV9MT09QX0VSUk9SID0gJ1BvcHBlcjogQW4gaW5maW5pdGUgbG9vcCBpbiB0aGUgbW9kaWZpZXJzIGN5Y2xlIGhhcyBiZWVuIGRldGVjdGVkISBUaGUgY3ljbGUgaGFzIGJlZW4gaW50ZXJydXB0ZWQgdG8gcHJldmVudCBhIGJyb3dzZXIgY3Jhc2guJztcbnZhciBERUZBVUxUX09QVElPTlMgPSB7XG4gIHBsYWNlbWVudDogJ2JvdHRvbScsXG4gIG1vZGlmaWVyczogW10sXG4gIHN0cmF0ZWd5OiAnYWJzb2x1dGUnXG59O1xuXG5mdW5jdGlvbiBhcmVWYWxpZEVsZW1lbnRzKCkge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgcmV0dXJuICFhcmdzLnNvbWUoZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gIShlbGVtZW50ICYmIHR5cGVvZiBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCA9PT0gJ2Z1bmN0aW9uJyk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcG9wcGVyR2VuZXJhdG9yKGdlbmVyYXRvck9wdGlvbnMpIHtcbiAgaWYgKGdlbmVyYXRvck9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgIGdlbmVyYXRvck9wdGlvbnMgPSB7fTtcbiAgfVxuXG4gIHZhciBfZ2VuZXJhdG9yT3B0aW9ucyA9IGdlbmVyYXRvck9wdGlvbnMsXG4gICAgICBfZ2VuZXJhdG9yT3B0aW9ucyRkZWYgPSBfZ2VuZXJhdG9yT3B0aW9ucy5kZWZhdWx0TW9kaWZpZXJzLFxuICAgICAgZGVmYXVsdE1vZGlmaWVycyA9IF9nZW5lcmF0b3JPcHRpb25zJGRlZiA9PT0gdm9pZCAwID8gW10gOiBfZ2VuZXJhdG9yT3B0aW9ucyRkZWYsXG4gICAgICBfZ2VuZXJhdG9yT3B0aW9ucyRkZWYyID0gX2dlbmVyYXRvck9wdGlvbnMuZGVmYXVsdE9wdGlvbnMsXG4gICAgICBkZWZhdWx0T3B0aW9ucyA9IF9nZW5lcmF0b3JPcHRpb25zJGRlZjIgPT09IHZvaWQgMCA/IERFRkFVTFRfT1BUSU9OUyA6IF9nZW5lcmF0b3JPcHRpb25zJGRlZjI7XG4gIHJldHVybiBmdW5jdGlvbiBjcmVhdGVQb3BwZXIocmVmZXJlbmNlLCBwb3BwZXIsIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgICBvcHRpb25zID0gZGVmYXVsdE9wdGlvbnM7XG4gICAgfVxuXG4gICAgdmFyIHN0YXRlID0ge1xuICAgICAgcGxhY2VtZW50OiAnYm90dG9tJyxcbiAgICAgIG9yZGVyZWRNb2RpZmllcnM6IFtdLFxuICAgICAgb3B0aW9uczogT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9PUFRJT05TLCBkZWZhdWx0T3B0aW9ucyksXG4gICAgICBtb2RpZmllcnNEYXRhOiB7fSxcbiAgICAgIGVsZW1lbnRzOiB7XG4gICAgICAgIHJlZmVyZW5jZTogcmVmZXJlbmNlLFxuICAgICAgICBwb3BwZXI6IHBvcHBlclxuICAgICAgfSxcbiAgICAgIGF0dHJpYnV0ZXM6IHt9LFxuICAgICAgc3R5bGVzOiB7fVxuICAgIH07XG4gICAgdmFyIGVmZmVjdENsZWFudXBGbnMgPSBbXTtcbiAgICB2YXIgaXNEZXN0cm95ZWQgPSBmYWxzZTtcbiAgICB2YXIgaW5zdGFuY2UgPSB7XG4gICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICBzZXRPcHRpb25zOiBmdW5jdGlvbiBzZXRPcHRpb25zKHNldE9wdGlvbnNBY3Rpb24pIHtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB0eXBlb2Ygc2V0T3B0aW9uc0FjdGlvbiA9PT0gJ2Z1bmN0aW9uJyA/IHNldE9wdGlvbnNBY3Rpb24oc3RhdGUub3B0aW9ucykgOiBzZXRPcHRpb25zQWN0aW9uO1xuICAgICAgICBjbGVhbnVwTW9kaWZpZXJFZmZlY3RzKCk7XG4gICAgICAgIHN0YXRlLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0T3B0aW9ucywgc3RhdGUub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICAgIHN0YXRlLnNjcm9sbFBhcmVudHMgPSB7XG4gICAgICAgICAgcmVmZXJlbmNlOiBpc0VsZW1lbnQocmVmZXJlbmNlKSA/IGxpc3RTY3JvbGxQYXJlbnRzKHJlZmVyZW5jZSkgOiByZWZlcmVuY2UuY29udGV4dEVsZW1lbnQgPyBsaXN0U2Nyb2xsUGFyZW50cyhyZWZlcmVuY2UuY29udGV4dEVsZW1lbnQpIDogW10sXG4gICAgICAgICAgcG9wcGVyOiBsaXN0U2Nyb2xsUGFyZW50cyhwb3BwZXIpXG4gICAgICAgIH07IC8vIE9yZGVycyB0aGUgbW9kaWZpZXJzIGJhc2VkIG9uIHRoZWlyIGRlcGVuZGVuY2llcyBhbmQgYHBoYXNlYFxuICAgICAgICAvLyBwcm9wZXJ0aWVzXG5cbiAgICAgICAgdmFyIG9yZGVyZWRNb2RpZmllcnMgPSBvcmRlck1vZGlmaWVycyhtZXJnZUJ5TmFtZShbXS5jb25jYXQoZGVmYXVsdE1vZGlmaWVycywgc3RhdGUub3B0aW9ucy5tb2RpZmllcnMpKSk7IC8vIFN0cmlwIG91dCBkaXNhYmxlZCBtb2RpZmllcnNcblxuICAgICAgICBzdGF0ZS5vcmRlcmVkTW9kaWZpZXJzID0gb3JkZXJlZE1vZGlmaWVycy5maWx0ZXIoZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgICByZXR1cm4gbS5lbmFibGVkO1xuICAgICAgICB9KTsgLy8gVmFsaWRhdGUgdGhlIHByb3ZpZGVkIG1vZGlmaWVycyBzbyB0aGF0IHRoZSBjb25zdW1lciB3aWxsIGdldCB3YXJuZWRcbiAgICAgICAgLy8gaWYgb25lIG9mIHRoZSBtb2RpZmllcnMgaXMgaW52YWxpZCBmb3IgYW55IHJlYXNvblxuXG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAgICAgICB2YXIgbW9kaWZpZXJzID0gdW5pcXVlQnkoW10uY29uY2F0KG9yZGVyZWRNb2RpZmllcnMsIHN0YXRlLm9wdGlvbnMubW9kaWZpZXJzKSwgZnVuY3Rpb24gKF9yZWYpIHtcbiAgICAgICAgICAgIHZhciBuYW1lID0gX3JlZi5uYW1lO1xuICAgICAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdmFsaWRhdGVNb2RpZmllcnMobW9kaWZpZXJzKTtcblxuICAgICAgICAgIGlmIChnZXRCYXNlUGxhY2VtZW50KHN0YXRlLm9wdGlvbnMucGxhY2VtZW50KSA9PT0gYXV0bykge1xuICAgICAgICAgICAgdmFyIGZsaXBNb2RpZmllciA9IHN0YXRlLm9yZGVyZWRNb2RpZmllcnMuZmluZChmdW5jdGlvbiAoX3JlZjIpIHtcbiAgICAgICAgICAgICAgdmFyIG5hbWUgPSBfcmVmMi5uYW1lO1xuICAgICAgICAgICAgICByZXR1cm4gbmFtZSA9PT0gJ2ZsaXAnO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICghZmxpcE1vZGlmaWVyKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoWydQb3BwZXI6IFwiYXV0b1wiIHBsYWNlbWVudHMgcmVxdWlyZSB0aGUgXCJmbGlwXCIgbW9kaWZpZXIgYmUnLCAncHJlc2VudCBhbmQgZW5hYmxlZCB0byB3b3JrLiddLmpvaW4oJyAnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIF9nZXRDb21wdXRlZFN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShwb3BwZXIpLFxuICAgICAgICAgICAgICBtYXJnaW5Ub3AgPSBfZ2V0Q29tcHV0ZWRTdHlsZS5tYXJnaW5Ub3AsXG4gICAgICAgICAgICAgIG1hcmdpblJpZ2h0ID0gX2dldENvbXB1dGVkU3R5bGUubWFyZ2luUmlnaHQsXG4gICAgICAgICAgICAgIG1hcmdpbkJvdHRvbSA9IF9nZXRDb21wdXRlZFN0eWxlLm1hcmdpbkJvdHRvbSxcbiAgICAgICAgICAgICAgbWFyZ2luTGVmdCA9IF9nZXRDb21wdXRlZFN0eWxlLm1hcmdpbkxlZnQ7IC8vIFdlIG5vIGxvbmdlciB0YWtlIGludG8gYWNjb3VudCBgbWFyZ2luc2Agb24gdGhlIHBvcHBlciwgYW5kIGl0IGNhblxuICAgICAgICAgIC8vIGNhdXNlIGJ1Z3Mgd2l0aCBwb3NpdGlvbmluZywgc28gd2UnbGwgd2FybiB0aGUgY29uc3VtZXJcblxuXG4gICAgICAgICAgaWYgKFttYXJnaW5Ub3AsIG1hcmdpblJpZ2h0LCBtYXJnaW5Cb3R0b20sIG1hcmdpbkxlZnRdLnNvbWUoZnVuY3Rpb24gKG1hcmdpbikge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQobWFyZ2luKTtcbiAgICAgICAgICB9KSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFsnUG9wcGVyOiBDU1MgXCJtYXJnaW5cIiBzdHlsZXMgY2Fubm90IGJlIHVzZWQgdG8gYXBwbHkgcGFkZGluZycsICdiZXR3ZWVuIHRoZSBwb3BwZXIgYW5kIGl0cyByZWZlcmVuY2UgZWxlbWVudCBvciBib3VuZGFyeS4nLCAnVG8gcmVwbGljYXRlIG1hcmdpbiwgdXNlIHRoZSBgb2Zmc2V0YCBtb2RpZmllciwgYXMgd2VsbCBhcycsICd0aGUgYHBhZGRpbmdgIG9wdGlvbiBpbiB0aGUgYHByZXZlbnRPdmVyZmxvd2AgYW5kIGBmbGlwYCcsICdtb2RpZmllcnMuJ10uam9pbignICcpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBydW5Nb2RpZmllckVmZmVjdHMoKTtcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlLnVwZGF0ZSgpO1xuICAgICAgfSxcbiAgICAgIC8vIFN5bmMgdXBkYXRlIOKAkyBpdCB3aWxsIGFsd2F5cyBiZSBleGVjdXRlZCwgZXZlbiBpZiBub3QgbmVjZXNzYXJ5LiBUaGlzXG4gICAgICAvLyBpcyB1c2VmdWwgZm9yIGxvdyBmcmVxdWVuY3kgdXBkYXRlcyB3aGVyZSBzeW5jIGJlaGF2aW9yIHNpbXBsaWZpZXMgdGhlXG4gICAgICAvLyBsb2dpYy5cbiAgICAgIC8vIEZvciBoaWdoIGZyZXF1ZW5jeSB1cGRhdGVzIChlLmcuIGByZXNpemVgIGFuZCBgc2Nyb2xsYCBldmVudHMpLCBhbHdheXNcbiAgICAgIC8vIHByZWZlciB0aGUgYXN5bmMgUG9wcGVyI3VwZGF0ZSBtZXRob2RcbiAgICAgIGZvcmNlVXBkYXRlOiBmdW5jdGlvbiBmb3JjZVVwZGF0ZSgpIHtcbiAgICAgICAgaWYgKGlzRGVzdHJveWVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIF9zdGF0ZSRlbGVtZW50cyA9IHN0YXRlLmVsZW1lbnRzLFxuICAgICAgICAgICAgcmVmZXJlbmNlID0gX3N0YXRlJGVsZW1lbnRzLnJlZmVyZW5jZSxcbiAgICAgICAgICAgIHBvcHBlciA9IF9zdGF0ZSRlbGVtZW50cy5wb3BwZXI7IC8vIERvbid0IHByb2NlZWQgaWYgYHJlZmVyZW5jZWAgb3IgYHBvcHBlcmAgYXJlIG5vdCB2YWxpZCBlbGVtZW50c1xuICAgICAgICAvLyBhbnltb3JlXG5cbiAgICAgICAgaWYgKCFhcmVWYWxpZEVsZW1lbnRzKHJlZmVyZW5jZSwgcG9wcGVyKSkge1xuICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoSU5WQUxJRF9FTEVNRU5UX0VSUk9SKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gLy8gU3RvcmUgdGhlIHJlZmVyZW5jZSBhbmQgcG9wcGVyIHJlY3RzIHRvIGJlIHJlYWQgYnkgbW9kaWZpZXJzXG5cblxuICAgICAgICBzdGF0ZS5yZWN0cyA9IHtcbiAgICAgICAgICByZWZlcmVuY2U6IGdldENvbXBvc2l0ZVJlY3QocmVmZXJlbmNlLCBnZXRPZmZzZXRQYXJlbnQocG9wcGVyKSwgc3RhdGUub3B0aW9ucy5zdHJhdGVneSA9PT0gJ2ZpeGVkJyksXG4gICAgICAgICAgcG9wcGVyOiBnZXRMYXlvdXRSZWN0KHBvcHBlcilcbiAgICAgICAgfTsgLy8gTW9kaWZpZXJzIGhhdmUgdGhlIGFiaWxpdHkgdG8gcmVzZXQgdGhlIGN1cnJlbnQgdXBkYXRlIGN5Y2xlLiBUaGVcbiAgICAgICAgLy8gbW9zdCBjb21tb24gdXNlIGNhc2UgZm9yIHRoaXMgaXMgdGhlIGBmbGlwYCBtb2RpZmllciBjaGFuZ2luZyB0aGVcbiAgICAgICAgLy8gcGxhY2VtZW50LCB3aGljaCB0aGVuIG5lZWRzIHRvIHJlLXJ1biBhbGwgdGhlIG1vZGlmaWVycywgYmVjYXVzZSB0aGVcbiAgICAgICAgLy8gbG9naWMgd2FzIHByZXZpb3VzbHkgcmFuIGZvciB0aGUgcHJldmlvdXMgcGxhY2VtZW50IGFuZCBpcyB0aGVyZWZvcmVcbiAgICAgICAgLy8gc3RhbGUvaW5jb3JyZWN0XG5cbiAgICAgICAgc3RhdGUucmVzZXQgPSBmYWxzZTtcbiAgICAgICAgc3RhdGUucGxhY2VtZW50ID0gc3RhdGUub3B0aW9ucy5wbGFjZW1lbnQ7IC8vIE9uIGVhY2ggdXBkYXRlIGN5Y2xlLCB0aGUgYG1vZGlmaWVyc0RhdGFgIHByb3BlcnR5IGZvciBlYWNoIG1vZGlmaWVyXG4gICAgICAgIC8vIGlzIGZpbGxlZCB3aXRoIHRoZSBpbml0aWFsIGRhdGEgc3BlY2lmaWVkIGJ5IHRoZSBtb2RpZmllci4gVGhpcyBtZWFuc1xuICAgICAgICAvLyBpdCBkb2Vzbid0IHBlcnNpc3QgYW5kIGlzIGZyZXNoIG9uIGVhY2ggdXBkYXRlLlxuICAgICAgICAvLyBUbyBlbnN1cmUgcGVyc2lzdGVudCBkYXRhLCB1c2UgYCR7bmFtZX0jcGVyc2lzdGVudGBcblxuICAgICAgICBzdGF0ZS5vcmRlcmVkTW9kaWZpZXJzLmZvckVhY2goZnVuY3Rpb24gKG1vZGlmaWVyKSB7XG4gICAgICAgICAgcmV0dXJuIHN0YXRlLm1vZGlmaWVyc0RhdGFbbW9kaWZpZXIubmFtZV0gPSBPYmplY3QuYXNzaWduKHt9LCBtb2RpZmllci5kYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBfX2RlYnVnX2xvb3BzX18gPSAwO1xuXG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBzdGF0ZS5vcmRlcmVkTW9kaWZpZXJzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAgICAgICAgIF9fZGVidWdfbG9vcHNfXyArPSAxO1xuXG4gICAgICAgICAgICBpZiAoX19kZWJ1Z19sb29wc19fID4gMTAwKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoSU5GSU5JVEVfTE9PUF9FUlJPUik7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzdGF0ZS5yZXNldCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgc3RhdGUucmVzZXQgPSBmYWxzZTtcbiAgICAgICAgICAgIGluZGV4ID0gLTE7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgX3N0YXRlJG9yZGVyZWRNb2RpZmllID0gc3RhdGUub3JkZXJlZE1vZGlmaWVyc1tpbmRleF0sXG4gICAgICAgICAgICAgIGZuID0gX3N0YXRlJG9yZGVyZWRNb2RpZmllLmZuLFxuICAgICAgICAgICAgICBfc3RhdGUkb3JkZXJlZE1vZGlmaWUyID0gX3N0YXRlJG9yZGVyZWRNb2RpZmllLm9wdGlvbnMsXG4gICAgICAgICAgICAgIF9vcHRpb25zID0gX3N0YXRlJG9yZGVyZWRNb2RpZmllMiA9PT0gdm9pZCAwID8ge30gOiBfc3RhdGUkb3JkZXJlZE1vZGlmaWUyLFxuICAgICAgICAgICAgICBuYW1lID0gX3N0YXRlJG9yZGVyZWRNb2RpZmllLm5hbWU7XG5cbiAgICAgICAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBzdGF0ZSA9IGZuKHtcbiAgICAgICAgICAgICAgc3RhdGU6IHN0YXRlLFxuICAgICAgICAgICAgICBvcHRpb25zOiBfb3B0aW9ucyxcbiAgICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgICAgaW5zdGFuY2U6IGluc3RhbmNlXG4gICAgICAgICAgICB9KSB8fCBzdGF0ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvLyBBc3luYyBhbmQgb3B0aW1pc3RpY2FsbHkgb3B0aW1pemVkIHVwZGF0ZSDigJMgaXQgd2lsbCBub3QgYmUgZXhlY3V0ZWQgaWZcbiAgICAgIC8vIG5vdCBuZWNlc3NhcnkgKGRlYm91bmNlZCB0byBydW4gYXQgbW9zdCBvbmNlLXBlci10aWNrKVxuICAgICAgdXBkYXRlOiBkZWJvdW5jZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgICAgIGluc3RhbmNlLmZvcmNlVXBkYXRlKCk7XG4gICAgICAgICAgcmVzb2x2ZShzdGF0ZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSksXG4gICAgICBkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgICAgICBjbGVhbnVwTW9kaWZpZXJFZmZlY3RzKCk7XG4gICAgICAgIGlzRGVzdHJveWVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKCFhcmVWYWxpZEVsZW1lbnRzKHJlZmVyZW5jZSwgcG9wcGVyKSkge1xuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAgICAgICBjb25zb2xlLmVycm9yKElOVkFMSURfRUxFTUVOVF9FUlJPUik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICB9XG5cbiAgICBpbnN0YW5jZS5zZXRPcHRpb25zKG9wdGlvbnMpLnRoZW4oZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICBpZiAoIWlzRGVzdHJveWVkICYmIG9wdGlvbnMub25GaXJzdFVwZGF0ZSkge1xuICAgICAgICBvcHRpb25zLm9uRmlyc3RVcGRhdGUoc3RhdGUpO1xuICAgICAgfVxuICAgIH0pOyAvLyBNb2RpZmllcnMgaGF2ZSB0aGUgYWJpbGl0eSB0byBleGVjdXRlIGFyYml0cmFyeSBjb2RlIGJlZm9yZSB0aGUgZmlyc3RcbiAgICAvLyB1cGRhdGUgY3ljbGUgcnVucy4gVGhleSB3aWxsIGJlIGV4ZWN1dGVkIGluIHRoZSBzYW1lIG9yZGVyIGFzIHRoZSB1cGRhdGVcbiAgICAvLyBjeWNsZS4gVGhpcyBpcyB1c2VmdWwgd2hlbiBhIG1vZGlmaWVyIGFkZHMgc29tZSBwZXJzaXN0ZW50IGRhdGEgdGhhdFxuICAgIC8vIG90aGVyIG1vZGlmaWVycyBuZWVkIHRvIHVzZSwgYnV0IHRoZSBtb2RpZmllciBpcyBydW4gYWZ0ZXIgdGhlIGRlcGVuZGVudFxuICAgIC8vIG9uZS5cblxuICAgIGZ1bmN0aW9uIHJ1bk1vZGlmaWVyRWZmZWN0cygpIHtcbiAgICAgIHN0YXRlLm9yZGVyZWRNb2RpZmllcnMuZm9yRWFjaChmdW5jdGlvbiAoX3JlZjMpIHtcbiAgICAgICAgdmFyIG5hbWUgPSBfcmVmMy5uYW1lLFxuICAgICAgICAgICAgX3JlZjMkb3B0aW9ucyA9IF9yZWYzLm9wdGlvbnMsXG4gICAgICAgICAgICBvcHRpb25zID0gX3JlZjMkb3B0aW9ucyA9PT0gdm9pZCAwID8ge30gOiBfcmVmMyRvcHRpb25zLFxuICAgICAgICAgICAgZWZmZWN0ID0gX3JlZjMuZWZmZWN0O1xuXG4gICAgICAgIGlmICh0eXBlb2YgZWZmZWN0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgdmFyIGNsZWFudXBGbiA9IGVmZmVjdCh7XG4gICAgICAgICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgaW5zdGFuY2U6IGluc3RhbmNlLFxuICAgICAgICAgICAgb3B0aW9uczogb3B0aW9uc1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdmFyIG5vb3BGbiA9IGZ1bmN0aW9uIG5vb3BGbigpIHt9O1xuXG4gICAgICAgICAgZWZmZWN0Q2xlYW51cEZucy5wdXNoKGNsZWFudXBGbiB8fCBub29wRm4pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhbnVwTW9kaWZpZXJFZmZlY3RzKCkge1xuICAgICAgZWZmZWN0Q2xlYW51cEZucy5mb3JFYWNoKGZ1bmN0aW9uIChmbikge1xuICAgICAgICByZXR1cm4gZm4oKTtcbiAgICAgIH0pO1xuICAgICAgZWZmZWN0Q2xlYW51cEZucyA9IFtdO1xuICAgIH1cblxuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfTtcbn1cbmV4cG9ydCB2YXIgY3JlYXRlUG9wcGVyID0gLyojX19QVVJFX18qL3BvcHBlckdlbmVyYXRvcigpOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbmV4cG9ydCB7IGRldGVjdE92ZXJmbG93IH07IiwiaW1wb3J0IHsgcG9wcGVyR2VuZXJhdG9yLCBkZXRlY3RPdmVyZmxvdyB9IGZyb20gXCIuL2NyZWF0ZVBvcHBlci5qc1wiO1xuaW1wb3J0IGV2ZW50TGlzdGVuZXJzIGZyb20gXCIuL21vZGlmaWVycy9ldmVudExpc3RlbmVycy5qc1wiO1xuaW1wb3J0IHBvcHBlck9mZnNldHMgZnJvbSBcIi4vbW9kaWZpZXJzL3BvcHBlck9mZnNldHMuanNcIjtcbmltcG9ydCBjb21wdXRlU3R5bGVzIGZyb20gXCIuL21vZGlmaWVycy9jb21wdXRlU3R5bGVzLmpzXCI7XG5pbXBvcnQgYXBwbHlTdHlsZXMgZnJvbSBcIi4vbW9kaWZpZXJzL2FwcGx5U3R5bGVzLmpzXCI7XG5pbXBvcnQgb2Zmc2V0IGZyb20gXCIuL21vZGlmaWVycy9vZmZzZXQuanNcIjtcbmltcG9ydCBmbGlwIGZyb20gXCIuL21vZGlmaWVycy9mbGlwLmpzXCI7XG5pbXBvcnQgcHJldmVudE92ZXJmbG93IGZyb20gXCIuL21vZGlmaWVycy9wcmV2ZW50T3ZlcmZsb3cuanNcIjtcbmltcG9ydCBhcnJvdyBmcm9tIFwiLi9tb2RpZmllcnMvYXJyb3cuanNcIjtcbmltcG9ydCBoaWRlIGZyb20gXCIuL21vZGlmaWVycy9oaWRlLmpzXCI7XG52YXIgZGVmYXVsdE1vZGlmaWVycyA9IFtldmVudExpc3RlbmVycywgcG9wcGVyT2Zmc2V0cywgY29tcHV0ZVN0eWxlcywgYXBwbHlTdHlsZXMsIG9mZnNldCwgZmxpcCwgcHJldmVudE92ZXJmbG93LCBhcnJvdywgaGlkZV07XG52YXIgY3JlYXRlUG9wcGVyID0gLyojX19QVVJFX18qL3BvcHBlckdlbmVyYXRvcih7XG4gIGRlZmF1bHRNb2RpZmllcnM6IGRlZmF1bHRNb2RpZmllcnNcbn0pOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbmV4cG9ydCB7IGNyZWF0ZVBvcHBlciwgcG9wcGVyR2VuZXJhdG9yLCBkZWZhdWx0TW9kaWZpZXJzLCBkZXRlY3RPdmVyZmxvdyB9OyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVudXNlZC1tb2R1bGVzXG5cbmV4cG9ydCB7IGNyZWF0ZVBvcHBlciBhcyBjcmVhdGVQb3BwZXJMaXRlIH0gZnJvbSBcIi4vcG9wcGVyLWxpdGUuanNcIjsgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnVzZWQtbW9kdWxlc1xuXG5leHBvcnQgKiBmcm9tIFwiLi9tb2RpZmllcnMvaW5kZXguanNcIjsiLCIvLyBDcmVkaXRzIGdvIHRvIExpYW0ncyBQZXJpb2RpYyBOb3RlcyBQbHVnaW46IGh0dHBzOi8vZ2l0aHViLmNvbS9saWFtY2Fpbi9vYnNpZGlhbi1wZXJpb2RpYy1ub3Rlc1xuXG5pbXBvcnQgeyBBcHAsIElTdWdnZXN0T3duZXIsIFNjb3BlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBjcmVhdGVQb3BwZXIsIEluc3RhbmNlIGFzIFBvcHBlckluc3RhbmNlIH0gZnJvbSBcIkBwb3BwZXJqcy9jb3JlXCI7XG5cbmNvbnN0IHdyYXBBcm91bmQgPSAodmFsdWU6IG51bWJlciwgc2l6ZTogbnVtYmVyKTogbnVtYmVyID0+IHtcbiAgICByZXR1cm4gKCh2YWx1ZSAlIHNpemUpICsgc2l6ZSkgJSBzaXplO1xufTtcblxuY2xhc3MgU3VnZ2VzdDxUPiB7XG4gICAgcHJpdmF0ZSBvd25lcjogSVN1Z2dlc3RPd25lcjxUPjtcbiAgICBwcml2YXRlIHZhbHVlczogVFtdO1xuICAgIHByaXZhdGUgc3VnZ2VzdGlvbnM6IEhUTUxEaXZFbGVtZW50W107XG4gICAgcHJpdmF0ZSBzZWxlY3RlZEl0ZW06IG51bWJlcjtcbiAgICBwcml2YXRlIGNvbnRhaW5lckVsOiBIVE1MRWxlbWVudDtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBvd25lcjogSVN1Z2dlc3RPd25lcjxUPixcbiAgICAgICAgY29udGFpbmVyRWw6IEhUTUxFbGVtZW50LFxuICAgICAgICBzY29wZTogU2NvcGVcbiAgICApIHtcbiAgICAgICAgdGhpcy5vd25lciA9IG93bmVyO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckVsID0gY29udGFpbmVyRWw7XG5cbiAgICAgICAgY29udGFpbmVyRWwub24oXG4gICAgICAgICAgICBcImNsaWNrXCIsXG4gICAgICAgICAgICBcIi5zdWdnZXN0aW9uLWl0ZW1cIixcbiAgICAgICAgICAgIHRoaXMub25TdWdnZXN0aW9uQ2xpY2suYmluZCh0aGlzKVxuICAgICAgICApO1xuICAgICAgICBjb250YWluZXJFbC5vbihcbiAgICAgICAgICAgIFwibW91c2Vtb3ZlXCIsXG4gICAgICAgICAgICBcIi5zdWdnZXN0aW9uLWl0ZW1cIixcbiAgICAgICAgICAgIHRoaXMub25TdWdnZXN0aW9uTW91c2VvdmVyLmJpbmQodGhpcylcbiAgICAgICAgKTtcblxuICAgICAgICBzY29wZS5yZWdpc3RlcihbXSwgXCJBcnJvd1VwXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKCFldmVudC5pc0NvbXBvc2luZykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U2VsZWN0ZWRJdGVtKHRoaXMuc2VsZWN0ZWRJdGVtIC0gMSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBzY29wZS5yZWdpc3RlcihbXSwgXCJBcnJvd0Rvd25cIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAoIWV2ZW50LmlzQ29tcG9zaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3RlZEl0ZW0odGhpcy5zZWxlY3RlZEl0ZW0gKyAxLCB0cnVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNjb3BlLnJlZ2lzdGVyKFtdLCBcIkVudGVyXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKCFldmVudC5pc0NvbXBvc2luZykge1xuICAgICAgICAgICAgICAgIHRoaXMudXNlU2VsZWN0ZWRJdGVtKGV2ZW50KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uU3VnZ2VzdGlvbkNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50LCBlbDogSFRNTERpdkVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5zdWdnZXN0aW9ucy5pbmRleE9mKGVsKTtcbiAgICAgICAgdGhpcy5zZXRTZWxlY3RlZEl0ZW0oaXRlbSwgZmFsc2UpO1xuICAgICAgICB0aGlzLnVzZVNlbGVjdGVkSXRlbShldmVudCk7XG4gICAgfVxuXG4gICAgb25TdWdnZXN0aW9uTW91c2VvdmVyKF9ldmVudDogTW91c2VFdmVudCwgZWw6IEhUTUxEaXZFbGVtZW50KTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLnN1Z2dlc3Rpb25zLmluZGV4T2YoZWwpO1xuICAgICAgICB0aGlzLnNldFNlbGVjdGVkSXRlbShpdGVtLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgc2V0U3VnZ2VzdGlvbnModmFsdWVzOiBUW10pIHtcbiAgICAgICAgdGhpcy5jb250YWluZXJFbC5lbXB0eSgpO1xuICAgICAgICBjb25zdCBzdWdnZXN0aW9uRWxzOiBIVE1MRGl2RWxlbWVudFtdID0gW107XG5cbiAgICAgICAgdmFsdWVzLmZvckVhY2goKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzdWdnZXN0aW9uRWwgPSB0aGlzLmNvbnRhaW5lckVsLmNyZWF0ZURpdihcInN1Z2dlc3Rpb24taXRlbVwiKTtcbiAgICAgICAgICAgIHRoaXMub3duZXIucmVuZGVyU3VnZ2VzdGlvbih2YWx1ZSwgc3VnZ2VzdGlvbkVsKTtcbiAgICAgICAgICAgIHN1Z2dlc3Rpb25FbHMucHVzaChzdWdnZXN0aW9uRWwpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnZhbHVlcyA9IHZhbHVlcztcbiAgICAgICAgdGhpcy5zdWdnZXN0aW9ucyA9IHN1Z2dlc3Rpb25FbHM7XG4gICAgICAgIHRoaXMuc2V0U2VsZWN0ZWRJdGVtKDAsIGZhbHNlKTtcbiAgICB9XG5cbiAgICB1c2VTZWxlY3RlZEl0ZW0oZXZlbnQ6IE1vdXNlRXZlbnQgfCBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRWYWx1ZSA9IHRoaXMudmFsdWVzW3RoaXMuc2VsZWN0ZWRJdGVtXTtcbiAgICAgICAgaWYgKGN1cnJlbnRWYWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5vd25lci5zZWxlY3RTdWdnZXN0aW9uKGN1cnJlbnRWYWx1ZSwgZXZlbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0U2VsZWN0ZWRJdGVtKHNlbGVjdGVkSW5kZXg6IG51bWJlciwgc2Nyb2xsSW50b1ZpZXc6IGJvb2xlYW4pIHtcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZEluZGV4ID0gd3JhcEFyb3VuZChcbiAgICAgICAgICAgIHNlbGVjdGVkSW5kZXgsXG4gICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb25zLmxlbmd0aFxuICAgICAgICApO1xuICAgICAgICBjb25zdCBwcmV2U2VsZWN0ZWRTdWdnZXN0aW9uID0gdGhpcy5zdWdnZXN0aW9uc1t0aGlzLnNlbGVjdGVkSXRlbV07XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkU3VnZ2VzdGlvbiA9IHRoaXMuc3VnZ2VzdGlvbnNbbm9ybWFsaXplZEluZGV4XTtcblxuICAgICAgICBwcmV2U2VsZWN0ZWRTdWdnZXN0aW9uPy5yZW1vdmVDbGFzcyhcImlzLXNlbGVjdGVkXCIpO1xuICAgICAgICBzZWxlY3RlZFN1Z2dlc3Rpb24/LmFkZENsYXNzKFwiaXMtc2VsZWN0ZWRcIik7XG5cbiAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW0gPSBub3JtYWxpemVkSW5kZXg7XG5cbiAgICAgICAgaWYgKHNjcm9sbEludG9WaWV3KSB7XG4gICAgICAgICAgICBzZWxlY3RlZFN1Z2dlc3Rpb24uc2Nyb2xsSW50b1ZpZXcoZmFsc2UpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVGV4dElucHV0U3VnZ2VzdDxUPiBpbXBsZW1lbnRzIElTdWdnZXN0T3duZXI8VD4ge1xuICAgIHByb3RlY3RlZCBhcHA6IEFwcDtcbiAgICBwcm90ZWN0ZWQgaW5wdXRFbDogSFRNTElucHV0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQ7XG5cbiAgICBwcml2YXRlIHBvcHBlcjogUG9wcGVySW5zdGFuY2U7XG4gICAgcHJpdmF0ZSBzY29wZTogU2NvcGU7XG4gICAgcHJpdmF0ZSBzdWdnZXN0RWw6IEhUTUxFbGVtZW50O1xuICAgIHByaXZhdGUgc3VnZ2VzdDogU3VnZ2VzdDxUPjtcblxuICAgIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBpbnB1dEVsOiBIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFRleHRBcmVhRWxlbWVudCkge1xuICAgICAgICB0aGlzLmFwcCA9IGFwcDtcbiAgICAgICAgdGhpcy5pbnB1dEVsID0gaW5wdXRFbDtcbiAgICAgICAgdGhpcy5zY29wZSA9IG5ldyBTY29wZSgpO1xuXG4gICAgICAgIHRoaXMuc3VnZ2VzdEVsID0gY3JlYXRlRGl2KFwic3VnZ2VzdGlvbi1jb250YWluZXJcIik7XG4gICAgICAgIGNvbnN0IHN1Z2dlc3Rpb24gPSB0aGlzLnN1Z2dlc3RFbC5jcmVhdGVEaXYoXCJzdWdnZXN0aW9uXCIpO1xuICAgICAgICB0aGlzLnN1Z2dlc3QgPSBuZXcgU3VnZ2VzdCh0aGlzLCBzdWdnZXN0aW9uLCB0aGlzLnNjb3BlKTtcblxuICAgICAgICB0aGlzLnNjb3BlLnJlZ2lzdGVyKFtdLCBcIkVzY2FwZVwiLCB0aGlzLmNsb3NlLmJpbmQodGhpcykpO1xuXG4gICAgICAgIHRoaXMuaW5wdXRFbC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgdGhpcy5vbklucHV0Q2hhbmdlZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5pbnB1dEVsLmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCB0aGlzLm9uSW5wdXRDaGFuZ2VkLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLmlucHV0RWwuYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgdGhpcy5jbG9zZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5zdWdnZXN0RWwub24oXG4gICAgICAgICAgICBcIm1vdXNlZG93blwiLFxuICAgICAgICAgICAgXCIuc3VnZ2VzdGlvbi1jb250YWluZXJcIixcbiAgICAgICAgICAgIChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgb25JbnB1dENoYW5nZWQoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGlucHV0U3RyID0gdGhpcy5pbnB1dEVsLnZhbHVlO1xuICAgICAgICBjb25zdCBzdWdnZXN0aW9ucyA9IHRoaXMuZ2V0U3VnZ2VzdGlvbnMoaW5wdXRTdHIpO1xuXG4gICAgICAgIGlmICghc3VnZ2VzdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdWdnZXN0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLnN1Z2dlc3Quc2V0U3VnZ2VzdGlvbnMoc3VnZ2VzdGlvbnMpO1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICAgICAgICAgIHRoaXMub3BlbigoPGFueT50aGlzLmFwcCkuZG9tLmFwcENvbnRhaW5lckVsLCB0aGlzLmlucHV0RWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb3Blbihjb250YWluZXI6IEhUTUxFbGVtZW50LCBpbnB1dEVsOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgICAgICAoPGFueT50aGlzLmFwcCkua2V5bWFwLnB1c2hTY29wZSh0aGlzLnNjb3BlKTtcblxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5zdWdnZXN0RWwpO1xuICAgICAgICB0aGlzLnBvcHBlciA9IGNyZWF0ZVBvcHBlcihpbnB1dEVsLCB0aGlzLnN1Z2dlc3RFbCwge1xuICAgICAgICAgICAgcGxhY2VtZW50OiBcImJvdHRvbS1zdGFydFwiLFxuICAgICAgICAgICAgbW9kaWZpZXJzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNhbWVXaWR0aFwiLFxuICAgICAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBmbjogKHsgc3RhdGUsIGluc3RhbmNlIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5vdGU6IHBvc2l0aW9uaW5nIG5lZWRzIHRvIGJlIGNhbGN1bGF0ZWQgdHdpY2UgLVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmlyc3QgcGFzcyAtIHBvc2l0aW9uaW5nIGl0IGFjY29yZGluZyB0byB0aGUgd2lkdGggb2YgdGhlIHBvcHBlclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2Vjb25kIHBhc3MgLSBwb3NpdGlvbiBpdCB3aXRoIHRoZSB3aWR0aCBib3VuZCB0byB0aGUgcmVmZXJlbmNlIGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdlIG5lZWQgdG8gZWFybHkgZXhpdCB0byBhdm9pZCBhbiBpbmZpbml0ZSBsb29wXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRXaWR0aCA9IGAke3N0YXRlLnJlY3RzLnJlZmVyZW5jZS53aWR0aH1weGA7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdGUuc3R5bGVzLnBvcHBlci53aWR0aCA9PT0gdGFyZ2V0V2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5zdHlsZXMucG9wcGVyLndpZHRoID0gdGFyZ2V0V2lkdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZS51cGRhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcGhhc2U6IFwiYmVmb3JlV3JpdGVcIixcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZXM6IFtcImNvbXB1dGVTdHlsZXNcIl0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNsb3NlKCk6IHZvaWQge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgICAgICAoPGFueT50aGlzLmFwcCkua2V5bWFwLnBvcFNjb3BlKHRoaXMuc2NvcGUpO1xuXG4gICAgICAgIHRoaXMuc3VnZ2VzdC5zZXRTdWdnZXN0aW9ucyhbXSk7XG4gICAgICAgIGlmICh0aGlzLnBvcHBlcikgdGhpcy5wb3BwZXIuZGVzdHJveSgpO1xuICAgICAgICB0aGlzLnN1Z2dlc3RFbC5kZXRhY2goKTtcbiAgICB9XG5cbiAgICBhYnN0cmFjdCBnZXRTdWdnZXN0aW9ucyhpbnB1dFN0cjogc3RyaW5nKTogVFtdO1xuICAgIGFic3RyYWN0IHJlbmRlclN1Z2dlc3Rpb24oaXRlbTogVCwgZWw6IEhUTUxFbGVtZW50KTogdm9pZDtcbiAgICBhYnN0cmFjdCBzZWxlY3RTdWdnZXN0aW9uKGl0ZW06IFQpOiB2b2lkO1xufVxuIiwiLy8gQ3JlZGl0cyBnbyB0byBMaWFtJ3MgUGVyaW9kaWMgTm90ZXMgUGx1Z2luOiBodHRwczovL2dpdGh1Yi5jb20vbGlhbWNhaW4vb2JzaWRpYW4tcGVyaW9kaWMtbm90ZXNcblxuaW1wb3J0IHsgVEFic3RyYWN0RmlsZSwgVEZvbGRlciB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgVGV4dElucHV0U3VnZ2VzdCB9IGZyb20gXCJzdWdnZXN0ZXJzL3N1Z2dlc3RcIjtcblxuZXhwb3J0IGNsYXNzIEZvbGRlclN1Z2dlc3QgZXh0ZW5kcyBUZXh0SW5wdXRTdWdnZXN0PFRGb2xkZXI+IHtcbiAgICBnZXRTdWdnZXN0aW9ucyhpbnB1dFN0cjogc3RyaW5nKTogVEZvbGRlcltdIHtcbiAgICAgICAgY29uc3QgYWJzdHJhY3RGaWxlcyA9IHRoaXMuYXBwLnZhdWx0LmdldEFsbExvYWRlZEZpbGVzKCk7XG4gICAgICAgIGNvbnN0IGZvbGRlcnM6IFRGb2xkZXJbXSA9IFtdO1xuICAgICAgICBjb25zdCBsb3dlckNhc2VJbnB1dFN0ciA9IGlucHV0U3RyLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgYWJzdHJhY3RGaWxlcy5mb3JFYWNoKChmb2xkZXI6IFRBYnN0cmFjdEZpbGUpID0+IHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBmb2xkZXIgaW5zdGFuY2VvZiBURm9sZGVyICYmXG4gICAgICAgICAgICAgICAgZm9sZGVyLnBhdGgudG9Mb3dlckNhc2UoKS5jb250YWlucyhsb3dlckNhc2VJbnB1dFN0cilcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGZvbGRlcnMucHVzaChmb2xkZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZm9sZGVycztcbiAgICB9XG5cbiAgICByZW5kZXJTdWdnZXN0aW9uKGZpbGU6IFRGb2xkZXIsIGVsOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgICAgICBlbC5zZXRUZXh0KGZpbGUucGF0aCk7XG4gICAgfVxuXG4gICAgc2VsZWN0U3VnZ2VzdGlvbihmaWxlOiBURm9sZGVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaW5wdXRFbC52YWx1ZSA9IGZpbGUucGF0aDtcbiAgICAgICAgdGhpcy5pbnB1dEVsLnRyaWdnZXIoXCJpbnB1dFwiKTtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFRlbXBsYXRlckVycm9yIH0gZnJvbSBcIkVycm9yXCI7XG5pbXBvcnQge1xuICAgIEFwcCxcbiAgICBub3JtYWxpemVQYXRoLFxuICAgIFRBYnN0cmFjdEZpbGUsXG4gICAgVEZpbGUsXG4gICAgVEZvbGRlcixcbiAgICBWYXVsdCxcbn0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWxheShtczogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlc2NhcGVfUmVnRXhwKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLCBcIlxcXFwkJlwiKTsgLy8gJCYgbWVhbnMgdGhlIHdob2xlIG1hdGNoZWQgc3RyaW5nXG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlX3Rmb2xkZXIoYXBwOiBBcHAsIGZvbGRlcl9zdHI6IHN0cmluZyk6IFRGb2xkZXIge1xuICAgIGZvbGRlcl9zdHIgPSBub3JtYWxpemVQYXRoKGZvbGRlcl9zdHIpO1xuXG4gICAgY29uc3QgZm9sZGVyID0gYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChmb2xkZXJfc3RyKTtcbiAgICBpZiAoIWZvbGRlcikge1xuICAgICAgICB0aHJvdyBuZXcgVGVtcGxhdGVyRXJyb3IoYEZvbGRlciBcIiR7Zm9sZGVyX3N0cn1cIiBkb2Vzbid0IGV4aXN0YCk7XG4gICAgfVxuICAgIGlmICghKGZvbGRlciBpbnN0YW5jZW9mIFRGb2xkZXIpKSB7XG4gICAgICAgIHRocm93IG5ldyBUZW1wbGF0ZXJFcnJvcihgJHtmb2xkZXJfc3RyfSBpcyBhIGZpbGUsIG5vdCBhIGZvbGRlcmApO1xuICAgIH1cblxuICAgIHJldHVybiBmb2xkZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlX3RmaWxlKGFwcDogQXBwLCBmaWxlX3N0cjogc3RyaW5nKTogVEZpbGUge1xuICAgIGZpbGVfc3RyID0gbm9ybWFsaXplUGF0aChmaWxlX3N0cik7XG5cbiAgICBjb25zdCBmaWxlID0gYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChmaWxlX3N0cik7XG4gICAgaWYgKCFmaWxlKSB7XG4gICAgICAgIHRocm93IG5ldyBUZW1wbGF0ZXJFcnJvcihgRmlsZSBcIiR7ZmlsZV9zdHJ9XCIgZG9lc24ndCBleGlzdGApO1xuICAgIH1cbiAgICBpZiAoIShmaWxlIGluc3RhbmNlb2YgVEZpbGUpKSB7XG4gICAgICAgIHRocm93IG5ldyBUZW1wbGF0ZXJFcnJvcihgJHtmaWxlX3N0cn0gaXMgYSBmb2xkZXIsIG5vdCBhIGZpbGVgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmlsZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldF90ZmlsZXNfZnJvbV9mb2xkZXIoXG4gICAgYXBwOiBBcHAsXG4gICAgZm9sZGVyX3N0cjogc3RyaW5nXG4pOiBBcnJheTxURmlsZT4ge1xuICAgIGNvbnN0IGZvbGRlciA9IHJlc29sdmVfdGZvbGRlcihhcHAsIGZvbGRlcl9zdHIpO1xuXG4gICAgY29uc3QgZmlsZXM6IEFycmF5PFRGaWxlPiA9IFtdO1xuICAgIFZhdWx0LnJlY3Vyc2VDaGlsZHJlbihmb2xkZXIsIChmaWxlOiBUQWJzdHJhY3RGaWxlKSA9PiB7XG4gICAgICAgIGlmIChmaWxlIGluc3RhbmNlb2YgVEZpbGUpIHtcbiAgICAgICAgICAgIGZpbGVzLnB1c2goZmlsZSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGZpbGVzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgcmV0dXJuIGEuYmFzZW5hbWUubG9jYWxlQ29tcGFyZShiLmJhc2VuYW1lKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBmaWxlcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFycmF5bW92ZShcbiAgICBhcnI6IGFueVtdLFxuICAgIGZyb21JbmRleDogbnVtYmVyLFxuICAgIHRvSW5kZXg6IG51bWJlclxuKTogdm9pZCB7XG4gICAgaWYgKHRvSW5kZXggPCAwIHx8IHRvSW5kZXggPT09IGFyci5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBlbGVtZW50ID0gYXJyW2Zyb21JbmRleF07XG4gICAgYXJyW2Zyb21JbmRleF0gPSBhcnJbdG9JbmRleF07XG4gICAgYXJyW3RvSW5kZXhdID0gZWxlbWVudDtcbn1cbiIsIi8vIENyZWRpdHMgZ28gdG8gTGlhbSdzIFBlcmlvZGljIE5vdGVzIFBsdWdpbjogaHR0cHM6Ly9naXRodWIuY29tL2xpYW1jYWluL29ic2lkaWFuLXBlcmlvZGljLW5vdGVzXG5cbmltcG9ydCB7IEFwcCwgVEFic3RyYWN0RmlsZSwgVEZpbGUgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IFRleHRJbnB1dFN1Z2dlc3QgfSBmcm9tIFwic3VnZ2VzdGVycy9zdWdnZXN0XCI7XG5pbXBvcnQgeyBnZXRfdGZpbGVzX2Zyb21fZm9sZGVyIH0gZnJvbSBcIlV0aWxzXCI7XG5pbXBvcnQgVGVtcGxhdGVyUGx1Z2luIGZyb20gXCJtYWluXCI7XG5pbXBvcnQgeyBlcnJvcldyYXBwZXJTeW5jIH0gZnJvbSBcIkVycm9yXCI7XG5cbmV4cG9ydCBlbnVtIEZpbGVTdWdnZXN0TW9kZSB7XG4gICAgVGVtcGxhdGVGaWxlcyxcbiAgICBTY3JpcHRGaWxlcyxcbn1cblxuZXhwb3J0IGNsYXNzIEZpbGVTdWdnZXN0IGV4dGVuZHMgVGV4dElucHV0U3VnZ2VzdDxURmlsZT4ge1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwdWJsaWMgYXBwOiBBcHAsXG4gICAgICAgIHB1YmxpYyBpbnB1dEVsOiBIVE1MSW5wdXRFbGVtZW50LFxuICAgICAgICBwcml2YXRlIHBsdWdpbjogVGVtcGxhdGVyUGx1Z2luLFxuICAgICAgICBwcml2YXRlIG1vZGU6IEZpbGVTdWdnZXN0TW9kZVxuICAgICkge1xuICAgICAgICBzdXBlcihhcHAsIGlucHV0RWwpO1xuICAgIH1cblxuICAgIGdldF9mb2xkZXIobW9kZTogRmlsZVN1Z2dlc3RNb2RlKTogc3RyaW5nIHtcbiAgICAgICAgc3dpdGNoIChtb2RlKSB7XG4gICAgICAgICAgICBjYXNlIEZpbGVTdWdnZXN0TW9kZS5UZW1wbGF0ZUZpbGVzOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZXNfZm9sZGVyO1xuICAgICAgICAgICAgY2FzZSBGaWxlU3VnZ2VzdE1vZGUuU2NyaXB0RmlsZXM6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGx1Z2luLnNldHRpbmdzLnVzZXJfc2NyaXB0c19mb2xkZXI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRfZXJyb3JfbXNnKG1vZGU6IEZpbGVTdWdnZXN0TW9kZSk6IHN0cmluZyB7XG4gICAgICAgIHN3aXRjaCAobW9kZSkge1xuICAgICAgICAgICAgY2FzZSBGaWxlU3VnZ2VzdE1vZGUuVGVtcGxhdGVGaWxlczpcbiAgICAgICAgICAgICAgICByZXR1cm4gYFRlbXBsYXRlcyBmb2xkZXIgZG9lc24ndCBleGlzdGA7XG4gICAgICAgICAgICBjYXNlIEZpbGVTdWdnZXN0TW9kZS5TY3JpcHRGaWxlczpcbiAgICAgICAgICAgICAgICByZXR1cm4gYFVzZXIgU2NyaXB0cyBmb2xkZXIgZG9lc24ndCBleGlzdGA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRTdWdnZXN0aW9ucyhpbnB1dF9zdHI6IHN0cmluZyk6IFRGaWxlW10ge1xuICAgICAgICBjb25zdCBhbGxfZmlsZXMgPSBlcnJvcldyYXBwZXJTeW5jKFxuICAgICAgICAgICAgKCkgPT4gZ2V0X3RmaWxlc19mcm9tX2ZvbGRlcih0aGlzLmFwcCwgdGhpcy5nZXRfZm9sZGVyKHRoaXMubW9kZSkpLFxuICAgICAgICAgICAgdGhpcy5nZXRfZXJyb3JfbXNnKHRoaXMubW9kZSlcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKCFhbGxfZmlsZXMpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZpbGVzOiBURmlsZVtdID0gW107XG4gICAgICAgIGNvbnN0IGxvd2VyX2lucHV0X3N0ciA9IGlucHV0X3N0ci50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgIGFsbF9maWxlcy5mb3JFYWNoKChmaWxlOiBUQWJzdHJhY3RGaWxlKSA9PiB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgZmlsZSBpbnN0YW5jZW9mIFRGaWxlICYmXG4gICAgICAgICAgICAgICAgZmlsZS5leHRlbnNpb24gPT09IFwibWRcIiAmJlxuICAgICAgICAgICAgICAgIGZpbGUucGF0aC50b0xvd2VyQ2FzZSgpLmNvbnRhaW5zKGxvd2VyX2lucHV0X3N0cilcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGZpbGVzLnB1c2goZmlsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBmaWxlcztcbiAgICB9XG5cbiAgICByZW5kZXJTdWdnZXN0aW9uKGZpbGU6IFRGaWxlLCBlbDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgZWwuc2V0VGV4dChmaWxlLnBhdGgpO1xuICAgIH1cblxuICAgIHNlbGVjdFN1Z2dlc3Rpb24oZmlsZTogVEZpbGUpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pbnB1dEVsLnZhbHVlID0gZmlsZS5wYXRoO1xuICAgICAgICB0aGlzLmlucHV0RWwudHJpZ2dlcihcImlucHV0XCIpO1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQXBwLCBCdXR0b25Db21wb25lbnQsIFBsdWdpblNldHRpbmdUYWIsIFNldHRpbmcgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IGVycm9yV3JhcHBlclN5bmMsIFRlbXBsYXRlckVycm9yIH0gZnJvbSBcIkVycm9yXCI7XG5pbXBvcnQgeyBGb2xkZXJTdWdnZXN0IH0gZnJvbSBcInN1Z2dlc3RlcnMvRm9sZGVyU3VnZ2VzdGVyXCI7XG5pbXBvcnQgeyBGaWxlU3VnZ2VzdCwgRmlsZVN1Z2dlc3RNb2RlIH0gZnJvbSBcInN1Z2dlc3RlcnMvRmlsZVN1Z2dlc3RlclwiO1xuaW1wb3J0IFRlbXBsYXRlclBsdWdpbiBmcm9tIFwiLi9tYWluXCI7XG5pbXBvcnQgeyBhcnJheW1vdmUsIGdldF90ZmlsZXNfZnJvbV9mb2xkZXIgfSBmcm9tIFwiVXRpbHNcIjtcbmltcG9ydCB7IGxvZ19lcnJvciB9IGZyb20gXCJMb2dcIjtcblxuZXhwb3J0IGludGVyZmFjZSBGb2xkZXJUZW1wbGF0ZSB7XG4gICAgZm9sZGVyOiBzdHJpbmc7XG4gICAgdGVtcGxhdGU6IHN0cmluZztcbn1cblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfU0VUVElOR1M6IFNldHRpbmdzID0ge1xuICAgIGNvbW1hbmRfdGltZW91dDogNSxcbiAgICB0ZW1wbGF0ZXNfZm9sZGVyOiBcIlwiLFxuICAgIHRlbXBsYXRlc19wYWlyczogW1tcIlwiLCBcIlwiXV0sXG4gICAgdHJpZ2dlcl9vbl9maWxlX2NyZWF0aW9uOiBmYWxzZSxcbiAgICBlbmFibGVfc3lzdGVtX2NvbW1hbmRzOiBmYWxzZSxcbiAgICBzaGVsbF9wYXRoOiBcIlwiLFxuICAgIHVzZXJfc2NyaXB0c19mb2xkZXI6IFwiXCIsXG4gICAgZW5hYmxlX2ZvbGRlcl90ZW1wbGF0ZXM6IHRydWUsXG4gICAgZm9sZGVyX3RlbXBsYXRlczogW3sgZm9sZGVyOiBcIlwiLCB0ZW1wbGF0ZTogXCJcIiB9XSxcbiAgICBzeW50YXhfaGlnaGxpZ2h0aW5nOiB0cnVlLFxuICAgIGVuYWJsZWRfdGVtcGxhdGVzX2hvdGtleXM6IFtcIlwiXSxcbiAgICBzdGFydHVwX3RlbXBsYXRlczogW1wiXCJdLFxufTtcblxuZXhwb3J0IGludGVyZmFjZSBTZXR0aW5ncyB7XG4gICAgY29tbWFuZF90aW1lb3V0OiBudW1iZXI7XG4gICAgdGVtcGxhdGVzX2ZvbGRlcjogc3RyaW5nO1xuICAgIHRlbXBsYXRlc19wYWlyczogQXJyYXk8W3N0cmluZywgc3RyaW5nXT47XG4gICAgdHJpZ2dlcl9vbl9maWxlX2NyZWF0aW9uOiBib29sZWFuO1xuICAgIGVuYWJsZV9zeXN0ZW1fY29tbWFuZHM6IGJvb2xlYW47XG4gICAgc2hlbGxfcGF0aDogc3RyaW5nO1xuICAgIHVzZXJfc2NyaXB0c19mb2xkZXI6IHN0cmluZztcbiAgICBlbmFibGVfZm9sZGVyX3RlbXBsYXRlczogYm9vbGVhbjtcbiAgICBmb2xkZXJfdGVtcGxhdGVzOiBBcnJheTxGb2xkZXJUZW1wbGF0ZT47XG4gICAgc3ludGF4X2hpZ2hsaWdodGluZzogYm9vbGVhbjtcbiAgICBlbmFibGVkX3RlbXBsYXRlc19ob3RrZXlzOiBBcnJheTxzdHJpbmc+O1xuICAgIHN0YXJ0dXBfdGVtcGxhdGVzOiBBcnJheTxzdHJpbmc+O1xufVxuXG5leHBvcnQgY2xhc3MgVGVtcGxhdGVyU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBhcHA6IEFwcCwgcHJpdmF0ZSBwbHVnaW46IFRlbXBsYXRlclBsdWdpbikge1xuICAgICAgICBzdXBlcihhcHAsIHBsdWdpbik7XG4gICAgfVxuXG4gICAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jb250YWluZXJFbC5lbXB0eSgpO1xuXG4gICAgICAgIHRoaXMuYWRkX2dlbmVyYWxfc2V0dGluZ19oZWFkZXIoKTtcbiAgICAgICAgdGhpcy5hZGRfdGVtcGxhdGVfZm9sZGVyX3NldHRpbmcoKTtcbiAgICAgICAgdGhpcy5hZGRfaW50ZXJuYWxfZnVuY3Rpb25zX3NldHRpbmcoKTtcbiAgICAgICAgdGhpcy5hZGRfc3ludGF4X2hpZ2hsaWdodGluZ19zZXR0aW5nKCk7XG4gICAgICAgIHRoaXMuYWRkX3RyaWdnZXJfb25fbmV3X2ZpbGVfY3JlYXRpb25fc2V0dGluZygpO1xuICAgICAgICB0aGlzLmFkZF90ZW1wbGF0ZXNfaG90a2V5c19zZXR0aW5nKCk7XG4gICAgICAgIGlmICh0aGlzLnBsdWdpbi5zZXR0aW5ncy50cmlnZ2VyX29uX2ZpbGVfY3JlYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuYWRkX2ZvbGRlcl90ZW1wbGF0ZXNfc2V0dGluZygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWRkX3N0YXJ0dXBfdGVtcGxhdGVzX3NldHRpbmcoKTtcbiAgICAgICAgdGhpcy5hZGRfdXNlcl9zY3JpcHRfZnVuY3Rpb25zX3NldHRpbmcoKTtcbiAgICAgICAgdGhpcy5hZGRfdXNlcl9zeXN0ZW1fY29tbWFuZF9mdW5jdGlvbnNfc2V0dGluZygpO1xuICAgIH1cblxuICAgIGFkZF9nZW5lcmFsX3NldHRpbmdfaGVhZGVyKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiaDJcIiwgeyB0ZXh0OiBcIkdlbmVyYWwgU2V0dGluZ3NcIiB9KTtcbiAgICB9XG5cbiAgICBhZGRfdGVtcGxhdGVfZm9sZGVyX3NldHRpbmcoKTogdm9pZCB7XG4gICAgICAgIG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZShcIlRlbXBsYXRlIGZvbGRlciBsb2NhdGlvblwiKVxuICAgICAgICAgICAgLnNldERlc2MoXCJGaWxlcyBpbiB0aGlzIGZvbGRlciB3aWxsIGJlIGF2YWlsYWJsZSBhcyB0ZW1wbGF0ZXMuXCIpXG4gICAgICAgICAgICAuYWRkU2VhcmNoKChjYikgPT4ge1xuICAgICAgICAgICAgICAgIG5ldyBGb2xkZXJTdWdnZXN0KHRoaXMuYXBwLCBjYi5pbnB1dEVsKTtcbiAgICAgICAgICAgICAgICBjYi5zZXRQbGFjZWhvbGRlcihcIkV4YW1wbGU6IGZvbGRlcjEvZm9sZGVyMlwiKVxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVzX2ZvbGRlcilcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKChuZXdfZm9sZGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZXNfZm9sZGVyID0gbmV3X2ZvbGRlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVfc2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgIGNiLmNvbnRhaW5lckVsLmFkZENsYXNzKFwidGVtcGxhdGVyX3NlYXJjaFwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFkZF9pbnRlcm5hbF9mdW5jdGlvbnNfc2V0dGluZygpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGVzYyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgZGVzYy5hcHBlbmQoXG4gICAgICAgICAgICBcIlRlbXBsYXRlciBwcm92aWRlcyBtdWx0aXBsZXMgcHJlZGVmaW5lZCB2YXJpYWJsZXMgLyBmdW5jdGlvbnMgdGhhdCB5b3UgY2FuIHVzZS5cIixcbiAgICAgICAgICAgIGRlc2MuY3JlYXRlRWwoXCJiclwiKSxcbiAgICAgICAgICAgIFwiQ2hlY2sgdGhlIFwiLFxuICAgICAgICAgICAgZGVzYy5jcmVhdGVFbChcImFcIiwge1xuICAgICAgICAgICAgICAgIGhyZWY6IFwiaHR0cHM6Ly9zaWxlbnR2b2lkMTMuZ2l0aHViLmlvL1RlbXBsYXRlci9cIixcbiAgICAgICAgICAgICAgICB0ZXh0OiBcImRvY3VtZW50YXRpb25cIixcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgXCIgdG8gZ2V0IGEgbGlzdCBvZiBhbGwgdGhlIGF2YWlsYWJsZSBpbnRlcm5hbCB2YXJpYWJsZXMgLyBmdW5jdGlvbnMuXCJcbiAgICAgICAgKTtcblxuICAgICAgICBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoXCJJbnRlcm5hbCBWYXJpYWJsZXMgYW5kIEZ1bmN0aW9uc1wiKVxuICAgICAgICAgICAgLnNldERlc2MoZGVzYyk7XG4gICAgfVxuXG4gICAgYWRkX3N5bnRheF9oaWdobGlnaHRpbmdfc2V0dGluZygpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGVzYyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgZGVzYy5hcHBlbmQoXG4gICAgICAgICAgICBcIkFkZHMgc3ludGF4IGhpZ2hsaWdodGluZyBmb3IgVGVtcGxhdGVyIGNvbW1hbmRzIGluIGVkaXQgbW9kZS5cIlxuICAgICAgICApO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZShcIlN5bnRheCBIaWdobGlnaHRpbmdcIilcbiAgICAgICAgICAgIC5zZXREZXNjKGRlc2MpXG4gICAgICAgICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgICAgICAgICB0b2dnbGVcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bnRheF9oaWdobGlnaHRpbmcpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgoc3ludGF4X2hpZ2hsaWdodGluZykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3ludGF4X2hpZ2hsaWdodGluZyA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3ludGF4X2hpZ2hsaWdodGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVfc2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmV2ZW50X2hhbmRsZXIudXBkYXRlX3N5bnRheF9oaWdobGlnaHRpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhZGRfdHJpZ2dlcl9vbl9uZXdfZmlsZV9jcmVhdGlvbl9zZXR0aW5nKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBkZXNjID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgICBkZXNjLmFwcGVuZChcbiAgICAgICAgICAgIFwiVGVtcGxhdGVyIHdpbGwgbGlzdGVuIGZvciB0aGUgbmV3IGZpbGUgY3JlYXRpb24gZXZlbnQsIGFuZCByZXBsYWNlIGV2ZXJ5IGNvbW1hbmQgaXQgZmluZHMgaW4gdGhlIG5ldyBmaWxlJ3MgY29udGVudC5cIixcbiAgICAgICAgICAgIGRlc2MuY3JlYXRlRWwoXCJiclwiKSxcbiAgICAgICAgICAgIFwiVGhpcyBtYWtlcyBUZW1wbGF0ZXIgY29tcGF0aWJsZSB3aXRoIG90aGVyIHBsdWdpbnMgbGlrZSB0aGUgRGFpbHkgbm90ZSBjb3JlIHBsdWdpbiwgQ2FsZW5kYXIgcGx1Z2luLCBSZXZpZXcgcGx1Z2luLCBOb3RlIHJlZmFjdG9yIHBsdWdpbiwgLi4uXCIsXG4gICAgICAgICAgICBkZXNjLmNyZWF0ZUVsKFwiYnJcIiksXG4gICAgICAgICAgICBkZXNjLmNyZWF0ZUVsKFwiYlwiLCB7XG4gICAgICAgICAgICAgICAgdGV4dDogXCJXYXJuaW5nOiBcIixcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgXCJUaGlzIGNhbiBiZSBkYW5nZXJvdXMgaWYgeW91IGNyZWF0ZSBuZXcgZmlsZXMgd2l0aCB1bmtub3duIC8gdW5zYWZlIGNvbnRlbnQgb24gY3JlYXRpb24uIE1ha2Ugc3VyZSB0aGF0IGV2ZXJ5IG5ldyBmaWxlJ3MgY29udGVudCBpcyBzYWZlIG9uIGNyZWF0aW9uLlwiXG4gICAgICAgICk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKFwiVHJpZ2dlciBUZW1wbGF0ZXIgb24gbmV3IGZpbGUgY3JlYXRpb25cIilcbiAgICAgICAgICAgIC5zZXREZXNjKGRlc2MpXG4gICAgICAgICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgICAgICAgICB0b2dnbGVcbiAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnRyaWdnZXJfb25fZmlsZV9jcmVhdGlvbilcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKCh0cmlnZ2VyX29uX2ZpbGVfY3JlYXRpb24pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnRyaWdnZXJfb25fZmlsZV9jcmVhdGlvbiA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJpZ2dlcl9vbl9maWxlX2NyZWF0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZV9zZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZXZlbnRfaGFuZGxlci51cGRhdGVfdHJpZ2dlcl9maWxlX29uX2NyZWF0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3JjZSByZWZyZXNoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhZGRfdGVtcGxhdGVzX2hvdGtleXNfc2V0dGluZygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jb250YWluZXJFbC5jcmVhdGVFbChcImgyXCIsIHsgdGV4dDogXCJUZW1wbGF0ZSBIb3RrZXlzXCIgfSk7XG5cbiAgICAgICAgY29uc3QgZGVzYyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgZGVzYy5hcHBlbmQoXG4gICAgICAgICAgICBcIlRlbXBsYXRlIEhvdGtleXMgYWxsb3dzIHlvdSB0byBiaW5kIGEgdGVtcGxhdGUgdG8gYSBob3RrZXkuXCJcbiAgICAgICAgKTtcblxuICAgICAgICBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKS5zZXREZXNjKGRlc2MpO1xuXG4gICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZWRfdGVtcGxhdGVzX2hvdGtleXMuZm9yRWFjaChcbiAgICAgICAgICAgICh0ZW1wbGF0ZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzID0gbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcbiAgICAgICAgICAgICAgICAgICAgLmFkZFNlYXJjaCgoY2IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBGaWxlU3VnZ2VzdChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYi5pbnB1dEVsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEZpbGVTdWdnZXN0TW9kZS5UZW1wbGF0ZUZpbGVzXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2Iuc2V0UGxhY2Vob2xkZXIoXCJFeGFtcGxlOiBmb2xkZXIxL3RlbXBsYXRlX2ZpbGVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGVtcGxhdGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKChuZXdfdGVtcGxhdGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3X3RlbXBsYXRlICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVkX3RlbXBsYXRlc19ob3RrZXlzLmNvbnRhaW5zKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld190ZW1wbGF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ19lcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVGVtcGxhdGVyRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiVGhpcyB0ZW1wbGF0ZSBpcyBhbHJlYWR5IGJvdW5kIHRvIGEgaG90a2V5XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmNvbW1hbmRfaGFuZGxlci5hZGRfdGVtcGxhdGVfaG90a2V5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZW5hYmxlZF90ZW1wbGF0ZXNfaG90a2V5c1tpbmRleF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdfdGVtcGxhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlZF90ZW1wbGF0ZXNfaG90a2V5c1tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0gPSBuZXdfdGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVfc2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiLmNvbnRhaW5lckVsLmFkZENsYXNzKFwidGVtcGxhdGVyX3NlYXJjaFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmFkZEV4dHJhQnV0dG9uKChjYikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2Iuc2V0SWNvbihcImFueS1rZXlcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2V0VG9vbHRpcChcIkNvbmZpZ3VyZSBIb3RrZXlcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRPRE86IFJlcGxhY2Ugd2l0aCBmdXR1cmUgXCJvZmZpY2lhbFwiIHdheSB0byBkbyB0aGlzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcHAuc2V0dGluZy5vcGVuVGFiQnlJZChcImhvdGtleXNcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFiID0gdGhpcy5hcHAuc2V0dGluZy5hY3RpdmVUYWI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhYi5zZWFyY2hJbnB1dEVsLnZhbHVlID0gXCJUZW1wbGF0ZXI6IEluc2VydFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWIudXBkYXRlSG90a2V5VmlzaWJpbGl0eSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuYWRkRXh0cmFCdXR0b24oKGNiKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYi5zZXRJY29uKFwidXAtY2hldnJvbi1nbHlwaFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRUb29sdGlwKFwiTW92ZSB1cFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyYXltb3ZlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZW5hYmxlZF90ZW1wbGF0ZXNfaG90a2V5cyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggLSAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVfc2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5hZGRFeHRyYUJ1dHRvbigoY2IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiLnNldEljb24oXCJkb3duLWNoZXZyb24tZ2x5cGhcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2V0VG9vbHRpcChcIk1vdmUgZG93blwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyYXltb3ZlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZW5hYmxlZF90ZW1wbGF0ZXNfaG90a2V5cyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggKyAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVfc2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5hZGRFeHRyYUJ1dHRvbigoY2IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiLnNldEljb24oXCJjcm9zc1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRUb29sdGlwKFwiRGVsZXRlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5jb21tYW5kX2hhbmRsZXIucmVtb3ZlX3RlbXBsYXRlX2hvdGtleShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmVuYWJsZWRfdGVtcGxhdGVzX2hvdGtleXNbaW5kZXhdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZWRfdGVtcGxhdGVzX2hvdGtleXMuc3BsaWNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVfc2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yY2UgcmVmcmVzaFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcy5pbmZvRWwucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbCkuYWRkQnV0dG9uKChjYikgPT4ge1xuICAgICAgICAgICAgY2Iuc2V0QnV0dG9uVGV4dChcIkFkZCBuZXcgaG90a2V5IGZvciB0ZW1wbGF0ZVwiKVxuICAgICAgICAgICAgICAgIC5zZXRDdGEoKVxuICAgICAgICAgICAgICAgIC5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlZF90ZW1wbGF0ZXNfaG90a2V5cy5wdXNoKFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlX3NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIEZvcmNlIHJlZnJlc2hcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFkZF9mb2xkZXJfdGVtcGxhdGVzX3NldHRpbmcoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoMlwiLCB7IHRleHQ6IFwiRm9sZGVyIFRlbXBsYXRlc1wiIH0pO1xuXG4gICAgICAgIGNvbnN0IGRlc2NIZWFkaW5nID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgICBkZXNjSGVhZGluZy5hcHBlbmQoXG4gICAgICAgICAgICBcIkZvbGRlciBUZW1wbGF0ZXMgYXJlIHRyaWdnZXJlZCB3aGVuIGEgbmV3IFwiLFxuICAgICAgICAgICAgZGVzY0hlYWRpbmcuY3JlYXRlRWwoXCJzdHJvbmdcIiwgeyB0ZXh0OiBcImVtcHR5IFwiIH0pLFxuICAgICAgICAgICAgXCJmaWxlIGlzIGNyZWF0ZWQgaW4gYSBnaXZlbiBmb2xkZXIuXCIsXG4gICAgICAgICAgICBkZXNjSGVhZGluZy5jcmVhdGVFbChcImJyXCIpLFxuICAgICAgICAgICAgXCJUZW1wbGF0ZXIgd2lsbCBmaWxsIHRoZSBlbXB0eSBmaWxlIHdpdGggdGhlIHNwZWNpZmllZCB0ZW1wbGF0ZS5cIixcbiAgICAgICAgICAgIGRlc2NIZWFkaW5nLmNyZWF0ZUVsKFwiYnJcIiksXG4gICAgICAgICAgICBcIlRoZSBkZWVwZXN0IG1hdGNoIGlzIHVzZWQuIEEgZ2xvYmFsIGRlZmF1bHQgdGVtcGxhdGUgd291bGQgYmUgZGVmaW5lZCBvbiB0aGUgcm9vdCBcIixcbiAgICAgICAgICAgIGRlc2NIZWFkaW5nLmNyZWF0ZUVsKFwiY29kZVwiLCB7IHRleHQ6IFwiL1wiIH0pLFxuICAgICAgICAgICAgXCIuXCJcbiAgICAgICAgKTtcblxuICAgICAgICBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKS5zZXREZXNjKGRlc2NIZWFkaW5nKTtcblxuICAgICAgICBjb25zdCBkZXNjVXNlTmV3RmlsZVRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgICBkZXNjVXNlTmV3RmlsZVRlbXBsYXRlLmFwcGVuZChcbiAgICAgICAgICAgIFwiV2hlbiBlbmFibGVkIFRlbXBsYXRlciB3aWxsIG1ha2UgdXNlIG9mIHRoZSBmb2xkZXIgdGVtcGxhdGVzIGRlZmluZWQgYmVsb3cuXCJcbiAgICAgICAgKTtcblxuICAgICAgICBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoXCJFbmFibGUgRm9sZGVyIFRlbXBsYXRlc1wiKVxuICAgICAgICAgICAgLnNldERlc2MoZGVzY1VzZU5ld0ZpbGVUZW1wbGF0ZSlcbiAgICAgICAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRvZ2dsZVxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlX2ZvbGRlcl90ZW1wbGF0ZXMpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgodXNlX25ld19maWxlX3RlbXBsYXRlcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlX2ZvbGRlcl90ZW1wbGF0ZXMgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZV9uZXdfZmlsZV90ZW1wbGF0ZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlX3NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3JjZSByZWZyZXNoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIXRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZV9mb2xkZXJfdGVtcGxhdGVzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoXCJBZGQgTmV3XCIpXG4gICAgICAgICAgICAuc2V0RGVzYyhcIkFkZCBuZXcgZm9sZGVyIHRlbXBsYXRlXCIpXG4gICAgICAgICAgICAuYWRkQnV0dG9uKChidXR0b246IEJ1dHRvbkNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAuc2V0VG9vbHRpcChcIkFkZCBhZGRpdGlvbmFsIGZvbGRlciB0ZW1wbGF0ZVwiKVxuICAgICAgICAgICAgICAgICAgICAuc2V0QnV0dG9uVGV4dChcIitcIilcbiAgICAgICAgICAgICAgICAgICAgLnNldEN0YSgpXG4gICAgICAgICAgICAgICAgICAgIC5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmZvbGRlcl90ZW1wbGF0ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9sZGVyOiBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlX3NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5mb2xkZXJfdGVtcGxhdGVzLmZvckVhY2goXG4gICAgICAgICAgICAoZm9sZGVyX3RlbXBsYXRlLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHMgPSBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKVxuICAgICAgICAgICAgICAgICAgICAuYWRkU2VhcmNoKChjYikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IEZvbGRlclN1Z2dlc3QodGhpcy5hcHAsIGNiLmlucHV0RWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2Iuc2V0UGxhY2Vob2xkZXIoXCJGb2xkZXJcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUoZm9sZGVyX3RlbXBsYXRlLmZvbGRlcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoKG5ld19mb2xkZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3X2ZvbGRlciAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZm9sZGVyX3RlbXBsYXRlcy5zb21lKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChlKSA9PiBlLmZvbGRlciA9PSBuZXdfZm9sZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nX2Vycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBUZW1wbGF0ZXJFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJUaGlzIGZvbGRlciBhbHJlYWR5IGhhcyBhIHRlbXBsYXRlIGFzc29jaWF0ZWQgd2l0aCBpdFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmZvbGRlcl90ZW1wbGF0ZXNbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLmZvbGRlciA9IG5ld19mb2xkZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVfc2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiLmNvbnRhaW5lckVsLmFkZENsYXNzKFwidGVtcGxhdGVyX3NlYXJjaFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmFkZFNlYXJjaCgoY2IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBGaWxlU3VnZ2VzdChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYi5pbnB1dEVsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEZpbGVTdWdnZXN0TW9kZS5UZW1wbGF0ZUZpbGVzXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2Iuc2V0UGxhY2Vob2xkZXIoXCJUZW1wbGF0ZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZShmb2xkZXJfdGVtcGxhdGUudGVtcGxhdGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKChuZXdfdGVtcGxhdGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZm9sZGVyX3RlbXBsYXRlc1tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0udGVtcGxhdGUgPSBuZXdfdGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVfc2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiLmNvbnRhaW5lckVsLmFkZENsYXNzKFwidGVtcGxhdGVyX3NlYXJjaFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmFkZEV4dHJhQnV0dG9uKChjYikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2Iuc2V0SWNvbihcInVwLWNoZXZyb24tZ2x5cGhcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2V0VG9vbHRpcChcIk1vdmUgdXBcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5bW92ZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmZvbGRlcl90ZW1wbGF0ZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4IC0gMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlX3NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuYWRkRXh0cmFCdXR0b24oKGNiKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYi5zZXRJY29uKFwiZG93bi1jaGV2cm9uLWdseXBoXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldFRvb2x0aXAoXCJNb3ZlIGRvd25cIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5bW92ZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmZvbGRlcl90ZW1wbGF0ZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ICsgMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlX3NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuYWRkRXh0cmFCdXR0b24oKGNiKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYi5zZXRJY29uKFwiY3Jvc3NcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2V0VG9vbHRpcChcIkRlbGV0ZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZm9sZGVyX3RlbXBsYXRlcy5zcGxpY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZV9zZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcy5pbmZvRWwucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgYWRkX3N0YXJ0dXBfdGVtcGxhdGVzX3NldHRpbmcoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoMlwiLCB7IHRleHQ6IFwiU3RhcnR1cCBUZW1wbGF0ZXNcIiB9KTtcblxuICAgICAgICBjb25zdCBkZXNjID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgICBkZXNjLmFwcGVuZChcbiAgICAgICAgICAgIFwiU3RhcnR1cCBUZW1wbGF0ZXMgYXJlIHRlbXBsYXRlcyB0aGF0IHdpbGwgZ2V0IGV4ZWN1dGVkIG9uY2Ugd2hlbiBUZW1wbGF0ZXIgc3RhcnRzLlwiLFxuICAgICAgICAgICAgZGVzYy5jcmVhdGVFbChcImJyXCIpLFxuICAgICAgICAgICAgXCJUaGVzZSB0ZW1wbGF0ZXMgd29uJ3Qgb3V0cHV0IGFueXRoaW5nLlwiLFxuICAgICAgICAgICAgZGVzYy5jcmVhdGVFbChcImJyXCIpLFxuICAgICAgICAgICAgXCJUaGlzIGNhbiBiZSB1c2VmdWwgdG8gc2V0IHVwIHRlbXBsYXRlcyBhZGRpbmcgaG9va3MgdG8gb2JzaWRpYW4gZXZlbnRzIGZvciBleGFtcGxlLlwiXG4gICAgICAgICk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbCkuc2V0RGVzYyhkZXNjKTtcblxuICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zdGFydHVwX3RlbXBsYXRlcy5mb3JFYWNoKCh0ZW1wbGF0ZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHMgPSBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKVxuICAgICAgICAgICAgICAgIC5hZGRTZWFyY2goKGNiKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIG5ldyBGaWxlU3VnZ2VzdChcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2IuaW5wdXRFbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgRmlsZVN1Z2dlc3RNb2RlLlRlbXBsYXRlRmlsZXNcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgY2Iuc2V0UGxhY2Vob2xkZXIoXCJFeGFtcGxlOiBmb2xkZXIxL3RlbXBsYXRlX2ZpbGVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0ZW1wbGF0ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgobmV3X3RlbXBsYXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdfdGVtcGxhdGUgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3RhcnR1cF90ZW1wbGF0ZXMuY29udGFpbnMoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdfdGVtcGxhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dfZXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVGVtcGxhdGVyRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJUaGlzIHN0YXJ0dXAgdGVtcGxhdGUgYWxyZWFkeSBleGlzdFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3RhcnR1cF90ZW1wbGF0ZXNbaW5kZXhdID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3X3RlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVfc2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgIGNiLmNvbnRhaW5lckVsLmFkZENsYXNzKFwidGVtcGxhdGVyX3NlYXJjaFwiKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5hZGRFeHRyYUJ1dHRvbigoY2IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY2Iuc2V0SWNvbihcImNyb3NzXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2V0VG9vbHRpcChcIkRlbGV0ZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnN0YXJ0dXBfdGVtcGxhdGVzLnNwbGljZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVfc2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3JjZSByZWZyZXNoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHMuaW5mb0VsLnJlbW92ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKS5hZGRCdXR0b24oKGNiKSA9PiB7XG4gICAgICAgICAgICBjYi5zZXRCdXR0b25UZXh0KFwiQWRkIG5ldyBzdGFydHVwIHRlbXBsYXRlXCIpXG4gICAgICAgICAgICAgICAgLnNldEN0YSgpXG4gICAgICAgICAgICAgICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zdGFydHVwX3RlbXBsYXRlcy5wdXNoKFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlX3NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIEZvcmNlIHJlZnJlc2hcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFkZF91c2VyX3NjcmlwdF9mdW5jdGlvbnNfc2V0dGluZygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jb250YWluZXJFbC5jcmVhdGVFbChcImgyXCIsIHsgdGV4dDogXCJVc2VyIFNjcmlwdCBGdW5jdGlvbnNcIiB9KTtcblxuICAgICAgICBsZXQgZGVzYyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgZGVzYy5hcHBlbmQoXG4gICAgICAgICAgICBcIkFsbCBKYXZhU2NyaXB0IGZpbGVzIGluIHRoaXMgZm9sZGVyIHdpbGwgYmUgbG9hZGVkIGFzIENvbW1vbkpTIG1vZHVsZXMsIHRvIGltcG9ydCBjdXN0b20gdXNlciBmdW5jdGlvbnMuXCIsXG4gICAgICAgICAgICBkZXNjLmNyZWF0ZUVsKFwiYnJcIiksXG4gICAgICAgICAgICBcIlRoZSBmb2xkZXIgbmVlZHMgdG8gYmUgYWNjZXNzaWJsZSBmcm9tIHRoZSB2YXVsdC5cIixcbiAgICAgICAgICAgIGRlc2MuY3JlYXRlRWwoXCJiclwiKSxcbiAgICAgICAgICAgIFwiQ2hlY2sgdGhlIFwiLFxuICAgICAgICAgICAgZGVzYy5jcmVhdGVFbChcImFcIiwge1xuICAgICAgICAgICAgICAgIGhyZWY6IFwiaHR0cHM6Ly9zaWxlbnR2b2lkMTMuZ2l0aHViLmlvL1RlbXBsYXRlci9cIixcbiAgICAgICAgICAgICAgICB0ZXh0OiBcImRvY3VtZW50YXRpb25cIixcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgXCIgZm9yIG1vcmUgaW5mb3JtYXRpb25zLlwiXG4gICAgICAgICk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKFwiU2NyaXB0IGZpbGVzIGZvbGRlciBsb2NhdGlvblwiKVxuICAgICAgICAgICAgLnNldERlc2MoZGVzYylcbiAgICAgICAgICAgIC5hZGRTZWFyY2goKGNiKSA9PiB7XG4gICAgICAgICAgICAgICAgbmV3IEZvbGRlclN1Z2dlc3QodGhpcy5hcHAsIGNiLmlucHV0RWwpO1xuICAgICAgICAgICAgICAgIGNiLnNldFBsYWNlaG9sZGVyKFwiRXhhbXBsZTogZm9sZGVyMS9mb2xkZXIyXCIpXG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy51c2VyX3NjcmlwdHNfZm9sZGVyKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoKG5ld19mb2xkZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnVzZXJfc2NyaXB0c19mb2xkZXIgPSBuZXdfZm9sZGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZV9zZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgY2IuY29udGFpbmVyRWwuYWRkQ2xhc3MoXCJ0ZW1wbGF0ZXJfc2VhcmNoXCIpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgZGVzYyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgbGV0IG5hbWU6IHN0cmluZztcbiAgICAgICAgaWYgKCF0aGlzLnBsdWdpbi5zZXR0aW5ncy51c2VyX3NjcmlwdHNfZm9sZGVyKSB7XG4gICAgICAgICAgICBuYW1lID0gXCJObyBVc2VyIFNjcmlwdHMgZm9sZGVyIHNldFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZmlsZXMgPSBlcnJvcldyYXBwZXJTeW5jKFxuICAgICAgICAgICAgICAgICgpID0+XG4gICAgICAgICAgICAgICAgICAgIGdldF90ZmlsZXNfZnJvbV9mb2xkZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnVzZXJfc2NyaXB0c19mb2xkZXJcbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICBgVXNlciBTY3JpcHRzIGZvbGRlciBkb2Vzbid0IGV4aXN0YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmICghZmlsZXMgfHwgZmlsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgbmFtZSA9IFwiTm8gVXNlciBTY3JpcHRzIGRldGVjdGVkXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBmaWxlIG9mIGZpbGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmaWxlLmV4dGVuc2lvbiA9PT0gXCJqc1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVzYy5hcHBlbmQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzYy5jcmVhdGVFbChcImxpXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogYHRwLnVzZXIuJHtmaWxlLmJhc2VuYW1lfWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbmFtZSA9IGBEZXRlY3RlZCAke2NvdW50fSBVc2VyIFNjcmlwdChzKWA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBuZXcgU2V0dGluZyh0aGlzLmNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUobmFtZSlcbiAgICAgICAgICAgIC5zZXREZXNjKGRlc2MpXG4gICAgICAgICAgICAuYWRkRXh0cmFCdXR0b24oKGV4dHJhKSA9PiB7XG4gICAgICAgICAgICAgICAgZXh0cmFcbiAgICAgICAgICAgICAgICAgICAgLnNldEljb24oXCJzeW5jXCIpXG4gICAgICAgICAgICAgICAgICAgIC5zZXRUb29sdGlwKFwiUmVmcmVzaFwiKVxuICAgICAgICAgICAgICAgICAgICAub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3JjZSByZWZyZXNoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhZGRfdXNlcl9zeXN0ZW1fY29tbWFuZF9mdW5jdGlvbnNfc2V0dGluZygpOiB2b2lkIHtcbiAgICAgICAgbGV0IGRlc2MgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICAgIGRlc2MuYXBwZW5kKFxuICAgICAgICAgICAgXCJBbGxvd3MgeW91IHRvIGNyZWF0ZSB1c2VyIGZ1bmN0aW9ucyBsaW5rZWQgdG8gc3lzdGVtIGNvbW1hbmRzLlwiLFxuICAgICAgICAgICAgZGVzYy5jcmVhdGVFbChcImJyXCIpLFxuICAgICAgICAgICAgZGVzYy5jcmVhdGVFbChcImJcIiwge1xuICAgICAgICAgICAgICAgIHRleHQ6IFwiV2FybmluZzogXCIsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIFwiSXQgY2FuIGJlIGRhbmdlcm91cyB0byBleGVjdXRlIGFyYml0cmFyeSBzeXN0ZW0gY29tbWFuZHMgZnJvbSB1bnRydXN0ZWQgc291cmNlcy4gT25seSBydW4gc3lzdGVtIGNvbW1hbmRzIHRoYXQgeW91IHVuZGVyc3RhbmQsIGZyb20gdHJ1c3RlZCBzb3VyY2VzLlwiXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5jb250YWluZXJFbC5jcmVhdGVFbChcImgyXCIsIHtcbiAgICAgICAgICAgIHRleHQ6IFwiVXNlciBTeXN0ZW0gQ29tbWFuZCBGdW5jdGlvbnNcIixcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcbiAgICAgICAgICAgIC5zZXROYW1lKFwiRW5hYmxlIFVzZXIgU3lzdGVtIENvbW1hbmQgRnVuY3Rpb25zXCIpXG4gICAgICAgICAgICAuc2V0RGVzYyhkZXNjKVxuICAgICAgICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PiB7XG4gICAgICAgICAgICAgICAgdG9nZ2xlXG4gICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVfc3lzdGVtX2NvbW1hbmRzKVxuICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoKGVuYWJsZV9zeXN0ZW1fY29tbWFuZHMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZV9zeXN0ZW1fY29tbWFuZHMgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZV9zeXN0ZW1fY29tbWFuZHM7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlX3NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3JjZSByZWZyZXNoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlX3N5c3RlbV9jb21tYW5kcykge1xuICAgICAgICAgICAgbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcbiAgICAgICAgICAgICAgICAuc2V0TmFtZShcIlRpbWVvdXRcIilcbiAgICAgICAgICAgICAgICAuc2V0RGVzYyhcIk1heGltdW0gdGltZW91dCBpbiBzZWNvbmRzIGZvciBhIHN5c3RlbSBjb21tYW5kLlwiKVxuICAgICAgICAgICAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQuc2V0UGxhY2Vob2xkZXIoXCJUaW1lb3V0XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY29tbWFuZF90aW1lb3V0LnRvU3RyaW5nKClcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZSgobmV3X3ZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3X3RpbWVvdXQgPSBOdW1iZXIobmV3X3ZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNOYU4obmV3X3RpbWVvdXQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ19lcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBUZW1wbGF0ZXJFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlRpbWVvdXQgbXVzdCBiZSBhIG51bWJlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuY29tbWFuZF90aW1lb3V0ID0gbmV3X3RpbWVvdXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZV9zZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRlc2MgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICAgICAgICBkZXNjLmFwcGVuZChcbiAgICAgICAgICAgICAgICBcIkZ1bGwgcGF0aCB0byB0aGUgc2hlbGwgYmluYXJ5IHRvIGV4ZWN1dGUgdGhlIGNvbW1hbmQgd2l0aC5cIixcbiAgICAgICAgICAgICAgICBkZXNjLmNyZWF0ZUVsKFwiYnJcIiksXG4gICAgICAgICAgICAgICAgXCJUaGlzIHNldHRpbmcgaXMgb3B0aW9uYWwgYW5kIHdpbGwgZGVmYXVsdCB0byB0aGUgc3lzdGVtJ3MgZGVmYXVsdCBzaGVsbCBpZiBub3Qgc3BlY2lmaWVkLlwiLFxuICAgICAgICAgICAgICAgIGRlc2MuY3JlYXRlRWwoXCJiclwiKSxcbiAgICAgICAgICAgICAgICBcIllvdSBjYW4gdXNlIGZvcndhcmQgc2xhc2hlcyAoJy8nKSBhcyBwYXRoIHNlcGFyYXRvcnMgb24gYWxsIHBsYXRmb3JtcyBpZiBpbiBkb3VidC5cIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpXG4gICAgICAgICAgICAgICAgLnNldE5hbWUoXCJTaGVsbCBiaW5hcnkgbG9jYXRpb25cIilcbiAgICAgICAgICAgICAgICAuc2V0RGVzYyhkZXNjKVxuICAgICAgICAgICAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQuc2V0UGxhY2Vob2xkZXIoXCJFeGFtcGxlOiAvYmluL2Jhc2gsIC4uLlwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnNoZWxsX3BhdGgpXG4gICAgICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoKHNoZWxsX3BhdGgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaGVsbF9wYXRoID0gc2hlbGxfcGF0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlX3NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbGV0IGkgPSAxO1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVzX3BhaXJzLmZvckVhY2goKHRlbXBsYXRlX3BhaXIpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBkaXYgPSB0aGlzLmNvbnRhaW5lckVsLmNyZWF0ZUVsKFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgIGRpdi5hZGRDbGFzcyhcInRlbXBsYXRlcl9kaXZcIik7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB0aXRsZSA9IHRoaXMuY29udGFpbmVyRWwuY3JlYXRlRWwoXCJoNFwiLCB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiVXNlciBGdW5jdGlvbiBuwrBcIiArIGksXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGl0bGUuYWRkQ2xhc3MoXCJ0ZW1wbGF0ZXJfdGl0bGVcIik7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzZXR0aW5nID0gbmV3IFNldHRpbmcodGhpcy5jb250YWluZXJFbClcbiAgICAgICAgICAgICAgICAgICAgLmFkZEV4dHJhQnV0dG9uKChleHRyYSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2V0SWNvbihcImNyb3NzXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldFRvb2x0aXAoXCJEZWxldGVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnRlbXBsYXRlc19wYWlycy5pbmRleE9mKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlX3BhaXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZXNfcGFpcnMuc3BsaWNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlX3NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3JjZSByZWZyZXNoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuYWRkVGV4dCgodGV4dCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdCA9IHRleHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoXCJGdW5jdGlvbiBuYW1lXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHRlbXBsYXRlX3BhaXJbMF0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKChuZXdfdmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVzX3BhaXJzLmluZGV4T2YoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVfcGFpclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnRlbXBsYXRlc19wYWlyc1tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVswXSA9IG5ld192YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVfc2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdC5pbnB1dEVsLmFkZENsYXNzKFwidGVtcGxhdGVyX3RlbXBsYXRlXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdDtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmFkZFRleHRBcmVhKCh0ZXh0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0ID0gdGV4dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcihcIlN5c3RlbSBDb21tYW5kXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHRlbXBsYXRlX3BhaXJbMV0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKChuZXdfY21kKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnRlbXBsYXRlc19wYWlycy5pbmRleE9mKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlX3BhaXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZXNfcGFpcnNbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1bMV0gPSBuZXdfY21kO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZV9zZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHQuaW5wdXRFbC5zZXRBdHRyKFwicm93c1wiLCAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHQuaW5wdXRFbC5hZGRDbGFzcyhcInRlbXBsYXRlcl9jbWRcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0O1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHNldHRpbmcuaW5mb0VsLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgZGl2LmFwcGVuZENoaWxkKHRpdGxlKTtcbiAgICAgICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQodGhpcy5jb250YWluZXJFbC5sYXN0Q2hpbGQpO1xuXG4gICAgICAgICAgICAgICAgaSArPSAxO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGRpdiA9IHRoaXMuY29udGFpbmVyRWwuY3JlYXRlRWwoXCJkaXZcIik7XG4gICAgICAgICAgICBkaXYuYWRkQ2xhc3MoXCJ0ZW1wbGF0ZXJfZGl2MlwiKTtcblxuICAgICAgICAgICAgY29uc3Qgc2V0dGluZyA9IG5ldyBTZXR0aW5nKHRoaXMuY29udGFpbmVyRWwpLmFkZEJ1dHRvbihcbiAgICAgICAgICAgICAgICAoYnV0dG9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgLnNldEJ1dHRvblRleHQoXCJBZGQgTmV3IFVzZXIgRnVuY3Rpb25cIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRDdGEoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLnRlbXBsYXRlc19wYWlycy5wdXNoKFtcIlwiLCBcIlwiXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZV9zZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvcmNlIHJlZnJlc2hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBzZXR0aW5nLmluZm9FbC5yZW1vdmUoKTtcblxuICAgICAgICAgICAgZGl2LmFwcGVuZENoaWxkKHRoaXMuY29udGFpbmVyRWwubGFzdENoaWxkKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IEFwcCwgRnV6enlTdWdnZXN0TW9kYWwsIFRGaWxlLCBURm9sZGVyIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBnZXRfdGZpbGVzX2Zyb21fZm9sZGVyIH0gZnJvbSBcIlV0aWxzXCI7XG5pbXBvcnQgVGVtcGxhdGVyUGx1Z2luIGZyb20gXCIuL21haW5cIjtcbmltcG9ydCB7IGVycm9yV3JhcHBlclN5bmMgfSBmcm9tIFwiRXJyb3JcIjtcbmltcG9ydCB7IGxvZ19lcnJvciB9IGZyb20gXCJMb2dcIjtcblxuZXhwb3J0IGVudW0gT3Blbk1vZGUge1xuICAgIEluc2VydFRlbXBsYXRlLFxuICAgIENyZWF0ZU5vdGVUZW1wbGF0ZSxcbn1cblxuZXhwb3J0IGNsYXNzIEZ1enp5U3VnZ2VzdGVyIGV4dGVuZHMgRnV6enlTdWdnZXN0TW9kYWw8VEZpbGU+IHtcbiAgICBwdWJsaWMgYXBwOiBBcHA7XG4gICAgcHJpdmF0ZSBwbHVnaW46IFRlbXBsYXRlclBsdWdpbjtcbiAgICBwcml2YXRlIG9wZW5fbW9kZTogT3Blbk1vZGU7XG4gICAgcHJpdmF0ZSBjcmVhdGlvbl9mb2xkZXI6IFRGb2xkZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW4pIHtcbiAgICAgICAgc3VwZXIoYXBwKTtcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG4gICAgICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xuICAgICAgICB0aGlzLnNldFBsYWNlaG9sZGVyKFwiVHlwZSBuYW1lIG9mIGEgdGVtcGxhdGUuLi5cIik7XG4gICAgfVxuXG4gICAgZ2V0SXRlbXMoKTogVEZpbGVbXSB7XG4gICAgICAgIGlmICghdGhpcy5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVzX2ZvbGRlcikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXBwLnZhdWx0LmdldE1hcmtkb3duRmlsZXMoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmaWxlcyA9IGVycm9yV3JhcHBlclN5bmMoXG4gICAgICAgICAgICAoKSA9PlxuICAgICAgICAgICAgICAgIGdldF90ZmlsZXNfZnJvbV9mb2xkZXIoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZXNfZm9sZGVyXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIGBDb3VsZG4ndCByZXRyaWV2ZSB0ZW1wbGF0ZSBmaWxlcyBmcm9tIHRlbXBsYXRlcyBmb2xkZXIgJHt0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZXNfZm9sZGVyfWBcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKCFmaWxlcykge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmaWxlcztcbiAgICB9XG5cbiAgICBnZXRJdGVtVGV4dChpdGVtOiBURmlsZSk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBpdGVtLmJhc2VuYW1lO1xuICAgIH1cblxuICAgIG9uQ2hvb3NlSXRlbShpdGVtOiBURmlsZSwgX2V2dDogTW91c2VFdmVudCB8IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLm9wZW5fbW9kZSkge1xuICAgICAgICAgICAgY2FzZSBPcGVuTW9kZS5JbnNlcnRUZW1wbGF0ZTpcbiAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi50ZW1wbGF0ZXIuYXBwZW5kX3RlbXBsYXRlX3RvX2FjdGl2ZV9maWxlKGl0ZW0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBPcGVuTW9kZS5DcmVhdGVOb3RlVGVtcGxhdGU6XG4gICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4udGVtcGxhdGVyLmNyZWF0ZV9uZXdfbm90ZV9mcm9tX3RlbXBsYXRlKFxuICAgICAgICAgICAgICAgICAgICBpdGVtLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0aW9uX2ZvbGRlclxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGFydCgpOiB2b2lkIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMub3BlbigpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBsb2dfZXJyb3IoZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbnNlcnRfdGVtcGxhdGUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMub3Blbl9tb2RlID0gT3Blbk1vZGUuSW5zZXJ0VGVtcGxhdGU7XG4gICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICB9XG5cbiAgICBjcmVhdGVfbmV3X25vdGVfZnJvbV90ZW1wbGF0ZShmb2xkZXI/OiBURm9sZGVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY3JlYXRpb25fZm9sZGVyID0gZm9sZGVyO1xuICAgICAgICB0aGlzLm9wZW5fbW9kZSA9IE9wZW5Nb2RlLkNyZWF0ZU5vdGVUZW1wbGF0ZTtcbiAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgIH1cbn1cbiIsImV4cG9ydCBjb25zdCBVTlNVUFBPUlRFRF9NT0JJTEVfVEVNUExBVEUgPSBcIkVycm9yX01vYmlsZVVuc3VwcG9ydGVkVGVtcGxhdGVcIjtcbmV4cG9ydCBjb25zdCBJQ09OX0RBVEEgPSBgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCA1MS4xMzI4IDI4LjdcIj48cGF0aCBkPVwiTTAgMTUuMTQgMCAxMC4xNSAxOC42NyAxLjUxIDE4LjY3IDYuMDMgNC43MiAxMi4zMyA0LjcyIDEyLjc2IDE4LjY3IDE5LjIyIDE4LjY3IDIzLjc0IDAgMTUuMTRaTTMzLjY5MjggMS44NEMzMy42OTI4IDEuODQgMzMuOTc2MSAyLjE0NjcgMzQuNTQyOCAyLjc2QzM1LjEwOTQgMy4zOCAzNS4zOTI4IDQuNTYgMzUuMzkyOCA2LjNDMzUuMzkyOCA4LjA0NjYgMzQuODE5NSA5LjU0IDMzLjY3MjggMTAuNzhDMzIuNTI2MSAxMi4wMiAzMS4wOTk1IDEyLjY0IDI5LjM5MjggMTIuNjRDMjcuNjg2MiAxMi42NCAyNi4yNjYxIDEyLjAyNjcgMjUuMTMyOCAxMC44QzIzLjk5MjggOS41NzMzIDIzLjQyMjggOC4wODY3IDIzLjQyMjggNi4zNEMyMy40MjI4IDQuNiAyMy45OTk1IDMuMTA2NiAyNS4xNTI4IDEuODZDMjYuMjk5NC42MiAyNy43MjYxIDAgMjkuNDMyOCAwQzMxLjEzOTUgMCAzMi41NTk0LjYxMzMgMzMuNjkyOCAxLjg0TTQ5LjgyMjguNjcgMjkuNTMyOCAyOC4zOCAyNC40MTI4IDI4LjM4IDQ0LjcxMjguNjcgNDkuODIyOC42N00zMS4wMzI4IDguMzhDMzEuMDMyOCA4LjM4IDMxLjEzOTUgOC4yNDY3IDMxLjM1MjggNy45OEMzMS41NjYyIDcuNzA2NyAzMS42NzI4IDcuMTczMyAzMS42NzI4IDYuMzhDMzEuNjcyOCA1LjU4NjcgMzEuNDQ2MSA0LjkyIDMwLjk5MjggNC4zOEMzMC41NDYxIDMuODQgMjkuOTk5NSAzLjU3IDI5LjM1MjggMy41N0MyOC43MDYxIDMuNTcgMjguMTY5NSAzLjg0IDI3Ljc0MjggNC4zOEMyNy4zMjI4IDQuOTIgMjcuMTEyOCA1LjU4NjcgMjcuMTEyOCA2LjM4QzI3LjExMjggNy4xNzMzIDI3LjMzNjEgNy44NCAyNy43ODI4IDguMzhDMjguMjM2MSA4LjkyNjcgMjguNzg2MSA5LjIgMjkuNDMyOCA5LjJDMzAuMDc5NSA5LjIgMzAuNjEyOCA4LjkyNjcgMzEuMDMyOCA4LjM4TTQ5LjQzMjggMTcuOUM0OS40MzI4IDE3LjkgNDkuNzE2MSAxOC4yMDY3IDUwLjI4MjggMTguODJDNTAuODQ5NSAxOS40MzMzIDUxLjEzMjggMjAuNjEzMyA1MS4xMzI4IDIyLjM2QzUxLjEzMjggMjQuMSA1MC41NTk0IDI1LjU5IDQ5LjQxMjggMjYuODNDNDguMjU5NSAyOC4wNzY2IDQ2LjgyOTUgMjguNyA0NS4xMjI4IDI4LjdDNDMuNDIyOCAyOC43IDQyLjAwMjggMjguMDgzMyA0MC44NjI4IDI2Ljg1QzM5LjcyOTUgMjUuNjIzMyAzOS4xNjI4IDI0LjEzNjYgMzkuMTYyOCAyMi4zOUMzOS4xNjI4IDIwLjY1IDM5LjczNjEgMTkuMTYgNDAuODgyOCAxNy45MkM0Mi4wMzYxIDE2LjY3MzMgNDMuNDYyOCAxNi4wNSA0NS4xNjI4IDE2LjA1QzQ2Ljg2OTQgMTYuMDUgNDguMjkyOCAxNi42NjY3IDQ5LjQzMjggMTcuOU00Ni44NTI4IDI0LjUyQzQ2Ljg1MjggMjQuNTIgNDYuOTU5NSAyNC4zODMzIDQ3LjE3MjggMjQuMTFDNDcuMzc5NSAyMy44MzY3IDQ3LjQ4MjggMjMuMzAzMyA0Ny40ODI4IDIyLjUxQzQ3LjQ4MjggMjEuNzE2NyA0Ny4yNTk1IDIxLjA1IDQ2LjgxMjggMjAuNTFDNDYuMzY2MSAxOS45NyA0NS44MTYyIDE5LjcgNDUuMTYyOCAxOS43QzQ0LjUxNjEgMTkuNyA0My45ODI4IDE5Ljk3IDQzLjU2MjggMjAuNTFDNDMuMTQyOCAyMS4wNSA0Mi45MzI4IDIxLjcxNjcgNDIuOTMyOCAyMi41MUM0Mi45MzI4IDIzLjMwMzMgNDMuMTU2MSAyMy45NzMzIDQzLjYwMjggMjQuNTJDNDQuMDQ5NCAyNS4wNiA0NC41OTYxIDI1LjMzIDQ1LjI0MjggMjUuMzNDNDUuODg5NSAyNS4zMyA0Ni40MjYxIDI1LjA2IDQ2Ljg1MjggMjQuNTJaXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiLz48L3N2Zz5gO1xuIiwiaW1wb3J0IFRlbXBsYXRlclBsdWdpbiBmcm9tIFwibWFpblwiO1xuaW1wb3J0IHsgQXBwIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBSdW5uaW5nQ29uZmlnIH0gZnJvbSBcIlRlbXBsYXRlclwiO1xuaW1wb3J0IHsgSUdlbmVyYXRlT2JqZWN0IH0gZnJvbSBcImZ1bmN0aW9ucy9JR2VuZXJhdGVPYmplY3RcIjtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEludGVybmFsTW9kdWxlIGltcGxlbWVudHMgSUdlbmVyYXRlT2JqZWN0IHtcbiAgICBwdWJsaWMgYWJzdHJhY3QgbmFtZTogc3RyaW5nO1xuICAgIHByb3RlY3RlZCBzdGF0aWNfZnVuY3Rpb25zOiBNYXA8c3RyaW5nLCBhbnk+ID0gbmV3IE1hcCgpO1xuICAgIHByb3RlY3RlZCBkeW5hbWljX2Z1bmN0aW9uczogTWFwPHN0cmluZywgYW55PiA9IG5ldyBNYXAoKTtcbiAgICBwcm90ZWN0ZWQgY29uZmlnOiBSdW5uaW5nQ29uZmlnO1xuICAgIHByb3RlY3RlZCBzdGF0aWNfb2JqZWN0OiB7IFt4OiBzdHJpbmddOiBhbnkgfTtcblxuICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBhcHA6IEFwcCwgcHJvdGVjdGVkIHBsdWdpbjogVGVtcGxhdGVyUGx1Z2luKSB7fVxuXG4gICAgZ2V0TmFtZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5uYW1lO1xuICAgIH1cblxuICAgIGFic3RyYWN0IGNyZWF0ZV9zdGF0aWNfdGVtcGxhdGVzKCk6IFByb21pc2U8dm9pZD47XG4gICAgYWJzdHJhY3QgY3JlYXRlX2R5bmFtaWNfdGVtcGxhdGVzKCk6IFByb21pc2U8dm9pZD47XG5cbiAgICBhc3luYyBpbml0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBhd2FpdCB0aGlzLmNyZWF0ZV9zdGF0aWNfdGVtcGxhdGVzKCk7XG4gICAgICAgIHRoaXMuc3RhdGljX29iamVjdCA9IE9iamVjdC5mcm9tRW50cmllcyh0aGlzLnN0YXRpY19mdW5jdGlvbnMpO1xuICAgIH1cblxuICAgIGFzeW5jIGdlbmVyYXRlX29iamVjdChcbiAgICAgICAgbmV3X2NvbmZpZzogUnVubmluZ0NvbmZpZ1xuICAgICk6IFByb21pc2U8eyBbeDogc3RyaW5nXTogYW55IH0+IHtcbiAgICAgICAgdGhpcy5jb25maWcgPSBuZXdfY29uZmlnO1xuICAgICAgICBhd2FpdCB0aGlzLmNyZWF0ZV9keW5hbWljX3RlbXBsYXRlcygpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi50aGlzLnN0YXRpY19vYmplY3QsXG4gICAgICAgICAgICAuLi5PYmplY3QuZnJvbUVudHJpZXModGhpcy5keW5hbWljX2Z1bmN0aW9ucyksXG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgVGVtcGxhdGVyRXJyb3IgfSBmcm9tIFwiRXJyb3JcIjtcbmltcG9ydCB7IEludGVybmFsTW9kdWxlIH0gZnJvbSBcIi4uL0ludGVybmFsTW9kdWxlXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnRlcm5hbE1vZHVsZURhdGUgZXh0ZW5kcyBJbnRlcm5hbE1vZHVsZSB7XG4gICAgcHVibGljIG5hbWUgPSBcImRhdGVcIjtcblxuICAgIGFzeW5jIGNyZWF0ZV9zdGF0aWNfdGVtcGxhdGVzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwibm93XCIsIHRoaXMuZ2VuZXJhdGVfbm93KCkpO1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwidG9tb3Jyb3dcIiwgdGhpcy5nZW5lcmF0ZV90b21vcnJvdygpKTtcbiAgICAgICAgdGhpcy5zdGF0aWNfZnVuY3Rpb25zLnNldChcIndlZWtkYXlcIiwgdGhpcy5nZW5lcmF0ZV93ZWVrZGF5KCkpO1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwieWVzdGVyZGF5XCIsIHRoaXMuZ2VuZXJhdGVfeWVzdGVyZGF5KCkpO1xuICAgIH1cblxuICAgIGFzeW5jIGNyZWF0ZV9keW5hbWljX3RlbXBsYXRlcygpOiBQcm9taXNlPHZvaWQ+IHt9XG5cbiAgICBnZW5lcmF0ZV9ub3coKTogKFxuICAgICAgICBmb3JtYXQ/OiBzdHJpbmcsXG4gICAgICAgIG9mZnNldD86IG51bWJlciB8IHN0cmluZyxcbiAgICAgICAgcmVmZXJlbmNlPzogc3RyaW5nLFxuICAgICAgICByZWZlcmVuY2VfZm9ybWF0Pzogc3RyaW5nXG4gICAgKSA9PiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgZm9ybWF0ID0gXCJZWVlZLU1NLUREXCIsXG4gICAgICAgICAgICBvZmZzZXQ/OiBudW1iZXIgfCBzdHJpbmcsXG4gICAgICAgICAgICByZWZlcmVuY2U/OiBzdHJpbmcsXG4gICAgICAgICAgICByZWZlcmVuY2VfZm9ybWF0Pzogc3RyaW5nXG4gICAgICAgICkgPT4ge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHJlZmVyZW5jZSAmJlxuICAgICAgICAgICAgICAgICF3aW5kb3cubW9tZW50KHJlZmVyZW5jZSwgcmVmZXJlbmNlX2Zvcm1hdCkuaXNWYWxpZCgpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVGVtcGxhdGVyRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIFwiSW52YWxpZCByZWZlcmVuY2UgZGF0ZSBmb3JtYXQsIHRyeSBzcGVjaWZ5aW5nIG9uZSB3aXRoIHRoZSBhcmd1bWVudCAncmVmZXJlbmNlX2Zvcm1hdCdcIlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgZHVyYXRpb247XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9mZnNldCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uID0gd2luZG93Lm1vbWVudC5kdXJhdGlvbihvZmZzZXQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb2Zmc2V0ID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb24gPSB3aW5kb3cubW9tZW50LmR1cmF0aW9uKG9mZnNldCwgXCJkYXlzXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gd2luZG93XG4gICAgICAgICAgICAgICAgLm1vbWVudChyZWZlcmVuY2UsIHJlZmVyZW5jZV9mb3JtYXQpXG4gICAgICAgICAgICAgICAgLmFkZChkdXJhdGlvbilcbiAgICAgICAgICAgICAgICAuZm9ybWF0KGZvcm1hdCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfdG9tb3Jyb3coKTogKGZvcm1hdD86IHN0cmluZykgPT4gc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIChmb3JtYXQgPSBcIllZWVktTU0tRERcIikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5tb21lbnQoKS5hZGQoMSwgXCJkYXlzXCIpLmZvcm1hdChmb3JtYXQpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdlbmVyYXRlX3dlZWtkYXkoKTogKFxuICAgICAgICBmb3JtYXQ6IHN0cmluZyxcbiAgICAgICAgd2Vla2RheTogbnVtYmVyLFxuICAgICAgICByZWZlcmVuY2U/OiBzdHJpbmcsXG4gICAgICAgIHJlZmVyZW5jZV9mb3JtYXQ/OiBzdHJpbmdcbiAgICApID0+IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBmb3JtYXQgPSBcIllZWVktTU0tRERcIixcbiAgICAgICAgICAgIHdlZWtkYXk6IG51bWJlcixcbiAgICAgICAgICAgIHJlZmVyZW5jZT86IHN0cmluZyxcbiAgICAgICAgICAgIHJlZmVyZW5jZV9mb3JtYXQ/OiBzdHJpbmdcbiAgICAgICAgKSA9PiB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlICYmXG4gICAgICAgICAgICAgICAgIXdpbmRvdy5tb21lbnQocmVmZXJlbmNlLCByZWZlcmVuY2VfZm9ybWF0KS5pc1ZhbGlkKClcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUZW1wbGF0ZXJFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgXCJJbnZhbGlkIHJlZmVyZW5jZSBkYXRlIGZvcm1hdCwgdHJ5IHNwZWNpZnlpbmcgb25lIHdpdGggdGhlIGFyZ3VtZW50ICdyZWZlcmVuY2VfZm9ybWF0J1wiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB3aW5kb3dcbiAgICAgICAgICAgICAgICAubW9tZW50KHJlZmVyZW5jZSwgcmVmZXJlbmNlX2Zvcm1hdClcbiAgICAgICAgICAgICAgICAud2Vla2RheSh3ZWVrZGF5KVxuICAgICAgICAgICAgICAgIC5mb3JtYXQoZm9ybWF0KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZV95ZXN0ZXJkYXkoKTogKGZvcm1hdD86IHN0cmluZykgPT4gc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIChmb3JtYXQgPSBcIllZWVktTU0tRERcIikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5tb21lbnQoKS5hZGQoLTEsIFwiZGF5c1wiKS5mb3JtYXQoZm9ybWF0KTtcbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJbnRlcm5hbE1vZHVsZSB9IGZyb20gXCIuLi9JbnRlcm5hbE1vZHVsZVwiO1xuXG5pbXBvcnQge1xuICAgIEZpbGVTeXN0ZW1BZGFwdGVyLFxuICAgIGdldEFsbFRhZ3MsXG4gICAgTWFya2Rvd25WaWV3LFxuICAgIG5vcm1hbGl6ZVBhdGgsXG4gICAgcGFyc2VMaW5rdGV4dCxcbiAgICBQbGF0Zm9ybSxcbiAgICByZXNvbHZlU3VicGF0aCxcbiAgICBURmlsZSxcbiAgICBURm9sZGVyLFxufSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IFVOU1VQUE9SVEVEX01PQklMRV9URU1QTEFURSB9IGZyb20gXCJDb25zdGFudHNcIjtcbmltcG9ydCB7IFRlbXBsYXRlckVycm9yIH0gZnJvbSBcIkVycm9yXCI7XG5cbmV4cG9ydCBjb25zdCBERVBUSF9MSU1JVCA9IDEwO1xuXG5leHBvcnQgY2xhc3MgSW50ZXJuYWxNb2R1bGVGaWxlIGV4dGVuZHMgSW50ZXJuYWxNb2R1bGUge1xuICAgIHB1YmxpYyBuYW1lID0gXCJmaWxlXCI7XG4gICAgcHJpdmF0ZSBpbmNsdWRlX2RlcHRoID0gMDtcbiAgICBwcml2YXRlIGNyZWF0ZV9uZXdfZGVwdGggPSAwO1xuICAgIHByaXZhdGUgbGlua3BhdGhfcmVnZXggPSBuZXcgUmVnRXhwKFwiXlxcXFxbXFxcXFsoLiopXFxcXF1cXFxcXSRcIik7XG5cbiAgICBhc3luYyBjcmVhdGVfc3RhdGljX3RlbXBsYXRlcygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdGhpcy5zdGF0aWNfZnVuY3Rpb25zLnNldChcbiAgICAgICAgICAgIFwiY3JlYXRpb25fZGF0ZVwiLFxuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZV9jcmVhdGlvbl9kYXRlKClcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zdGF0aWNfZnVuY3Rpb25zLnNldChcImNyZWF0ZV9uZXdcIiwgdGhpcy5nZW5lcmF0ZV9jcmVhdGVfbmV3KCkpO1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwiY3Vyc29yXCIsIHRoaXMuZ2VuZXJhdGVfY3Vyc29yKCkpO1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFxuICAgICAgICAgICAgXCJjdXJzb3JfYXBwZW5kXCIsXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlX2N1cnNvcl9hcHBlbmQoKVxuICAgICAgICApO1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwiZXhpc3RzXCIsIHRoaXMuZ2VuZXJhdGVfZXhpc3RzKCkpO1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwiZmluZF90ZmlsZVwiLCB0aGlzLmdlbmVyYXRlX2ZpbmRfdGZpbGUoKSk7XG4gICAgICAgIHRoaXMuc3RhdGljX2Z1bmN0aW9ucy5zZXQoXCJmb2xkZXJcIiwgdGhpcy5nZW5lcmF0ZV9mb2xkZXIoKSk7XG4gICAgICAgIHRoaXMuc3RhdGljX2Z1bmN0aW9ucy5zZXQoXCJpbmNsdWRlXCIsIHRoaXMuZ2VuZXJhdGVfaW5jbHVkZSgpKTtcbiAgICAgICAgdGhpcy5zdGF0aWNfZnVuY3Rpb25zLnNldChcbiAgICAgICAgICAgIFwibGFzdF9tb2RpZmllZF9kYXRlXCIsXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlX2xhc3RfbW9kaWZpZWRfZGF0ZSgpXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuc3RhdGljX2Z1bmN0aW9ucy5zZXQoXCJtb3ZlXCIsIHRoaXMuZ2VuZXJhdGVfbW92ZSgpKTtcbiAgICAgICAgdGhpcy5zdGF0aWNfZnVuY3Rpb25zLnNldChcInBhdGhcIiwgdGhpcy5nZW5lcmF0ZV9wYXRoKCkpO1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwicmVuYW1lXCIsIHRoaXMuZ2VuZXJhdGVfcmVuYW1lKCkpO1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwic2VsZWN0aW9uXCIsIHRoaXMuZ2VuZXJhdGVfc2VsZWN0aW9uKCkpO1xuICAgIH1cblxuICAgIGFzeW5jIGNyZWF0ZV9keW5hbWljX3RlbXBsYXRlcygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdGhpcy5keW5hbWljX2Z1bmN0aW9ucy5zZXQoXCJjb250ZW50XCIsIGF3YWl0IHRoaXMuZ2VuZXJhdGVfY29udGVudCgpKTtcbiAgICAgICAgdGhpcy5keW5hbWljX2Z1bmN0aW9ucy5zZXQoXCJ0YWdzXCIsIHRoaXMuZ2VuZXJhdGVfdGFncygpKTtcbiAgICAgICAgdGhpcy5keW5hbWljX2Z1bmN0aW9ucy5zZXQoXCJ0aXRsZVwiLCB0aGlzLmdlbmVyYXRlX3RpdGxlKCkpO1xuICAgIH1cblxuICAgIGFzeW5jIGdlbmVyYXRlX2NvbnRlbnQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQodGhpcy5jb25maWcudGFyZ2V0X2ZpbGUpO1xuICAgIH1cblxuICAgIGdlbmVyYXRlX2NyZWF0ZV9uZXcoKTogKFxuICAgICAgICB0ZW1wbGF0ZTogVEZpbGUgfCBzdHJpbmcsXG4gICAgICAgIGZpbGVuYW1lOiBzdHJpbmcsXG4gICAgICAgIG9wZW5fbmV3OiBib29sZWFuLFxuICAgICAgICBmb2xkZXI/OiBURm9sZGVyXG4gICAgKSA9PiBQcm9taXNlPFRGaWxlPiB7XG4gICAgICAgIHJldHVybiBhc3luYyAoXG4gICAgICAgICAgICB0ZW1wbGF0ZTogVEZpbGUgfCBzdHJpbmcsXG4gICAgICAgICAgICBmaWxlbmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgb3Blbl9uZXcgPSBmYWxzZSxcbiAgICAgICAgICAgIGZvbGRlcj86IFRGb2xkZXJcbiAgICAgICAgKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZV9uZXdfZGVwdGggKz0gMTtcbiAgICAgICAgICAgIGlmICh0aGlzLmNyZWF0ZV9uZXdfZGVwdGggPiBERVBUSF9MSU1JVCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlX25ld19kZXB0aCA9IDA7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFRlbXBsYXRlckVycm9yKFxuICAgICAgICAgICAgICAgICAgICBcIlJlYWNoZWQgY3JlYXRlX25ldyBkZXB0aCBsaW1pdCAobWF4ID0gMTApXCJcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBuZXdfZmlsZSA9XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4udGVtcGxhdGVyLmNyZWF0ZV9uZXdfbm90ZV9mcm9tX3RlbXBsYXRlKFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgZm9sZGVyLFxuICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgb3Blbl9uZXdcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZV9uZXdfZGVwdGggLT0gMTtcblxuICAgICAgICAgICAgcmV0dXJuIG5ld19maWxlO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdlbmVyYXRlX2NyZWF0aW9uX2RhdGUoKTogKGZvcm1hdD86IHN0cmluZykgPT4gc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIChmb3JtYXQgPSBcIllZWVktTU0tREQgSEg6bW1cIikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHdpbmRvd1xuICAgICAgICAgICAgICAgIC5tb21lbnQodGhpcy5jb25maWcudGFyZ2V0X2ZpbGUuc3RhdC5jdGltZSlcbiAgICAgICAgICAgICAgICAuZm9ybWF0KGZvcm1hdCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfY3Vyc29yKCk6IChvcmRlcj86IG51bWJlcikgPT4gc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIChvcmRlcj86IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgLy8gSGFjayB0byBwcmV2ZW50IGVtcHR5IG91dHB1dFxuICAgICAgICAgICAgcmV0dXJuIGA8JSB0cC5maWxlLmN1cnNvcigke29yZGVyID8/IFwiXCJ9KSAlPmA7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfY3Vyc29yX2FwcGVuZCgpOiAoY29udGVudDogc3RyaW5nKSA9PiB2b2lkIHtcbiAgICAgICAgcmV0dXJuIChjb250ZW50OiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgICAgICAgY29uc3QgYWN0aXZlX3ZpZXcgPVxuICAgICAgICAgICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgICAgICAgICBpZiAoYWN0aXZlX3ZpZXcgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5sb2dfZXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIG5ldyBUZW1wbGF0ZXJFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiTm8gYWN0aXZlIHZpZXcsIGNhbid0IGFwcGVuZCB0byBjdXJzb3IuXCJcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBlZGl0b3IgPSBhY3RpdmVfdmlldy5lZGl0b3I7XG4gICAgICAgICAgICBjb25zdCBkb2MgPSBlZGl0b3IuZ2V0RG9jKCk7XG4gICAgICAgICAgICBkb2MucmVwbGFjZVNlbGVjdGlvbihjb250ZW50KTtcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdlbmVyYXRlX2V4aXN0cygpOiAoZmlsZW5hbWU6IHN0cmluZykgPT4gYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAoZmlsZW5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgLy8gVE9ETzogUmVtb3ZlIHRoaXMsIG9ubHkgaGVyZSB0byBzdXBwb3J0IHRoZSBvbGQgd2F5XG4gICAgICAgICAgICBsZXQgbWF0Y2g7XG4gICAgICAgICAgICBpZiAoKG1hdGNoID0gdGhpcy5saW5rcGF0aF9yZWdleC5leGVjKGZpbGVuYW1lKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWxlbmFtZSA9IG1hdGNoWzFdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaXJzdExpbmtwYXRoRGVzdChcbiAgICAgICAgICAgICAgICBmaWxlbmFtZSxcbiAgICAgICAgICAgICAgICBcIlwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGZpbGUgIT0gbnVsbDtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZV9maW5kX3RmaWxlKCk6IChmaWxlbmFtZTogc3RyaW5nKSA9PiBURmlsZSB7XG4gICAgICAgIHJldHVybiAoZmlsZW5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGF0aCA9IG5vcm1hbGl6ZVBhdGgoZmlsZW5hbWUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Rmlyc3RMaW5rcGF0aERlc3QocGF0aCwgXCJcIik7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfZm9sZGVyKCk6IChyZWxhdGl2ZT86IGJvb2xlYW4pID0+IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAocmVsYXRpdmUgPSBmYWxzZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5jb25maWcudGFyZ2V0X2ZpbGUucGFyZW50O1xuICAgICAgICAgICAgbGV0IGZvbGRlcjtcblxuICAgICAgICAgICAgaWYgKHJlbGF0aXZlKSB7XG4gICAgICAgICAgICAgICAgZm9sZGVyID0gcGFyZW50LnBhdGg7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvbGRlciA9IHBhcmVudC5uYW1lO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZm9sZGVyO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdlbmVyYXRlX2luY2x1ZGUoKTogKGluY2x1ZGVfbGluazogc3RyaW5nIHwgVEZpbGUpID0+IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIHJldHVybiBhc3luYyAoaW5jbHVkZV9saW5rOiBzdHJpbmcgfCBURmlsZSkgPT4ge1xuICAgICAgICAgICAgLy8gVE9ETzogQWRkIG11dGV4IGZvciB0aGlzLCB0aGlzIG1heSBjdXJyZW50bHkgbGVhZCB0byBhIHJhY2UgY29uZGl0aW9uLlxuICAgICAgICAgICAgLy8gV2hpbGUgbm90IHZlcnkgaW1wYWN0ZnVsLCB0aGF0IGNvdWxkIHN0aWxsIGJlIGFubm95aW5nLlxuICAgICAgICAgICAgdGhpcy5pbmNsdWRlX2RlcHRoICs9IDE7XG4gICAgICAgICAgICBpZiAodGhpcy5pbmNsdWRlX2RlcHRoID4gREVQVEhfTElNSVQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluY2x1ZGVfZGVwdGggLT0gMTtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVGVtcGxhdGVyRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIFwiUmVhY2hlZCBpbmNsdXNpb24gZGVwdGggbGltaXQgKG1heCA9IDEwKVwiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGluY19maWxlX2NvbnRlbnQ6IHN0cmluZztcblxuICAgICAgICAgICAgaWYgKGluY2x1ZGVfbGluayBpbnN0YW5jZW9mIFRGaWxlKSB7XG4gICAgICAgICAgICAgICAgaW5jX2ZpbGVfY29udGVudCA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQoaW5jbHVkZV9saW5rKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IG1hdGNoO1xuICAgICAgICAgICAgICAgIGlmICgobWF0Y2ggPSB0aGlzLmxpbmtwYXRoX3JlZ2V4LmV4ZWMoaW5jbHVkZV9saW5rKSkgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmNsdWRlX2RlcHRoIC09IDE7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUZW1wbGF0ZXJFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiSW52YWxpZCBmaWxlIGZvcm1hdCwgcHJvdmlkZSBhbiBvYnNpZGlhbiBsaW5rIGJldHdlZW4gcXVvdGVzLlwiXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHsgcGF0aCwgc3VicGF0aCB9ID0gcGFyc2VMaW5rdGV4dChtYXRjaFsxXSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBpbmNfZmlsZSA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0Rmlyc3RMaW5rcGF0aERlc3QoXG4gICAgICAgICAgICAgICAgICAgIHBhdGgsXG4gICAgICAgICAgICAgICAgICAgIFwiXCJcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGlmICghaW5jX2ZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmNsdWRlX2RlcHRoIC09IDE7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUZW1wbGF0ZXJFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGBGaWxlICR7aW5jbHVkZV9saW5rfSBkb2Vzbid0IGV4aXN0YFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpbmNfZmlsZV9jb250ZW50ID0gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZChpbmNfZmlsZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoc3VicGF0aCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYWNoZSA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKGluY19maWxlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhY2hlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSByZXNvbHZlU3VicGF0aChjYWNoZSwgc3VicGF0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jX2ZpbGVfY29udGVudCA9IGluY19maWxlX2NvbnRlbnQuc2xpY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5zdGFydC5vZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5lbmQ/Lm9mZnNldFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGFyc2VkX2NvbnRlbnQgPVxuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi50ZW1wbGF0ZXIucGFyc2VyLnBhcnNlX2NvbW1hbmRzKFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5jX2ZpbGVfY29udGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnRlbXBsYXRlci5jdXJyZW50X2Z1bmN0aW9uc19vYmplY3RcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB0aGlzLmluY2x1ZGVfZGVwdGggLT0gMTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VkX2NvbnRlbnQ7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmNsdWRlX2RlcHRoIC09IDE7XG4gICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZV9sYXN0X21vZGlmaWVkX2RhdGUoKTogKGZvcm1hdD86IHN0cmluZykgPT4gc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIChmb3JtYXQgPSBcIllZWVktTU0tREQgSEg6bW1cIik6IHN0cmluZyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gd2luZG93XG4gICAgICAgICAgICAgICAgLm1vbWVudCh0aGlzLmNvbmZpZy50YXJnZXRfZmlsZS5zdGF0Lm10aW1lKVxuICAgICAgICAgICAgICAgIC5mb3JtYXQoZm9ybWF0KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZV9tb3ZlKCk6IChwYXRoOiBzdHJpbmcpID0+IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIHJldHVybiBhc3luYyAocGF0aDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZXdfcGF0aCA9IG5vcm1hbGl6ZVBhdGgoXG4gICAgICAgICAgICAgICAgYCR7cGF0aH0uJHt0aGlzLmNvbmZpZy50YXJnZXRfZmlsZS5leHRlbnNpb259YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuYXBwLmZpbGVNYW5hZ2VyLnJlbmFtZUZpbGUoXG4gICAgICAgICAgICAgICAgdGhpcy5jb25maWcudGFyZ2V0X2ZpbGUsXG4gICAgICAgICAgICAgICAgbmV3X3BhdGhcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZV9wYXRoKCk6IChyZWxhdGl2ZTogYm9vbGVhbikgPT4gc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIChyZWxhdGl2ZSA9IGZhbHNlKSA9PiB7XG4gICAgICAgICAgICAvLyBUT0RPOiBBZGQgbW9iaWxlIHN1cHBvcnRcbiAgICAgICAgICAgIGlmIChQbGF0Zm9ybS5pc01vYmlsZUFwcCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBVTlNVUFBPUlRFRF9NT0JJTEVfVEVNUExBVEU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoISh0aGlzLmFwcC52YXVsdC5hZGFwdGVyIGluc3RhbmNlb2YgRmlsZVN5c3RlbUFkYXB0ZXIpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFRlbXBsYXRlckVycm9yKFxuICAgICAgICAgICAgICAgICAgICBcImFwcC52YXVsdCBpcyBub3QgYSBGaWxlU3lzdGVtQWRhcHRlciBpbnN0YW5jZVwiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHZhdWx0X3BhdGggPSB0aGlzLmFwcC52YXVsdC5hZGFwdGVyLmdldEJhc2VQYXRoKCk7XG5cbiAgICAgICAgICAgIGlmIChyZWxhdGl2ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy50YXJnZXRfZmlsZS5wYXRoO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7dmF1bHRfcGF0aH0vJHt0aGlzLmNvbmZpZy50YXJnZXRfZmlsZS5wYXRofWA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVfcmVuYW1lKCk6IChuZXdfdGl0bGU6IHN0cmluZykgPT4gUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgcmV0dXJuIGFzeW5jIChuZXdfdGl0bGU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgaWYgKG5ld190aXRsZS5tYXRjaCgvW1xcXFwvOl0rL2cpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFRlbXBsYXRlckVycm9yKFxuICAgICAgICAgICAgICAgICAgICBcIkZpbGUgbmFtZSBjYW5ub3QgY29udGFpbiBhbnkgb2YgdGhlc2UgY2hhcmFjdGVyczogXFxcXCAvIDpcIlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBuZXdfcGF0aCA9IG5vcm1hbGl6ZVBhdGgoXG4gICAgICAgICAgICAgICAgYCR7dGhpcy5jb25maWcudGFyZ2V0X2ZpbGUucGFyZW50LnBhdGh9LyR7bmV3X3RpdGxlfS4ke3RoaXMuY29uZmlnLnRhcmdldF9maWxlLmV4dGVuc2lvbn1gXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5hcHAuZmlsZU1hbmFnZXIucmVuYW1lRmlsZShcbiAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZy50YXJnZXRfZmlsZSxcbiAgICAgICAgICAgICAgICBuZXdfcGF0aFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdlbmVyYXRlX3NlbGVjdGlvbigpOiAoKSA9PiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYWN0aXZlX3ZpZXcgPVxuICAgICAgICAgICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgICAgICAgICBpZiAoYWN0aXZlX3ZpZXcgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUZW1wbGF0ZXJFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgXCJBY3RpdmUgdmlldyBpcyBudWxsLCBjYW4ndCByZWFkIHNlbGVjdGlvbi5cIlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGVkaXRvciA9IGFjdGl2ZV92aWV3LmVkaXRvcjtcbiAgICAgICAgICAgIHJldHVybiBlZGl0b3IuZ2V0U2VsZWN0aW9uKCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gVE9ETzogVHVybiB0aGlzIGludG8gYSBmdW5jdGlvblxuICAgIGdlbmVyYXRlX3RhZ3MoKTogc3RyaW5nW10ge1xuICAgICAgICBjb25zdCBjYWNoZSA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKFxuICAgICAgICAgICAgdGhpcy5jb25maWcudGFyZ2V0X2ZpbGVcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIGdldEFsbFRhZ3MoY2FjaGUpO1xuICAgIH1cblxuICAgIC8vIFRPRE86IFR1cm4gdGhpcyBpbnRvIGEgZnVuY3Rpb25cbiAgICBnZW5lcmF0ZV90aXRsZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcudGFyZ2V0X2ZpbGUuYmFzZW5hbWU7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgVGVtcGxhdGVyRXJyb3IgfSBmcm9tIFwiRXJyb3JcIjtcbmltcG9ydCB7IEludGVybmFsTW9kdWxlIH0gZnJvbSBcIi4uL0ludGVybmFsTW9kdWxlXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnRlcm5hbE1vZHVsZVdlYiBleHRlbmRzIEludGVybmFsTW9kdWxlIHtcbiAgICBuYW1lID0gXCJ3ZWJcIjtcblxuICAgIGFzeW5jIGNyZWF0ZV9zdGF0aWNfdGVtcGxhdGVzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0aGlzLnN0YXRpY19mdW5jdGlvbnMuc2V0KFwiZGFpbHlfcXVvdGVcIiwgdGhpcy5nZW5lcmF0ZV9kYWlseV9xdW90ZSgpKTtcbiAgICAgICAgdGhpcy5zdGF0aWNfZnVuY3Rpb25zLnNldChcbiAgICAgICAgICAgIFwicmFuZG9tX3BpY3R1cmVcIixcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVfcmFuZG9tX3BpY3R1cmUoKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGFzeW5jIGNyZWF0ZV9keW5hbWljX3RlbXBsYXRlcygpOiBQcm9taXNlPHZvaWQ+IHt9XG5cbiAgICBhc3luYyBnZXRSZXF1ZXN0KHVybDogc3RyaW5nKTogUHJvbWlzZTxSZXNwb25zZT4ge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCk7XG4gICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUZW1wbGF0ZXJFcnJvcihcIkVycm9yIHBlcmZvcm1pbmcgR0VUIHJlcXVlc3RcIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH1cblxuICAgIGdlbmVyYXRlX2RhaWx5X3F1b3RlKCk6ICgpID0+IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIHJldHVybiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuZ2V0UmVxdWVzdChcImh0dHBzOi8vcXVvdGVzLnJlc3QvcW9kXCIpO1xuICAgICAgICAgICAgY29uc3QganNvbiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcblxuICAgICAgICAgICAgY29uc3QgYXV0aG9yID0ganNvbi5jb250ZW50cy5xdW90ZXNbMF0uYXV0aG9yO1xuICAgICAgICAgICAgY29uc3QgcXVvdGUgPSBqc29uLmNvbnRlbnRzLnF1b3Rlc1swXS5xdW90ZTtcbiAgICAgICAgICAgIGNvbnN0IG5ld19jb250ZW50ID0gYD4gJHtxdW90ZX1cXG4+ICZtZGFzaDsgPGNpdGU+JHthdXRob3J9PC9jaXRlPmA7XG5cbiAgICAgICAgICAgIHJldHVybiBuZXdfY29udGVudDtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZV9yYW5kb21fcGljdHVyZSgpOiAoXG4gICAgICAgIHNpemU6IHN0cmluZyxcbiAgICAgICAgcXVlcnk/OiBzdHJpbmdcbiAgICApID0+IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIHJldHVybiBhc3luYyAoc2l6ZTogc3RyaW5nLCBxdWVyeT86IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmdldFJlcXVlc3QoXG4gICAgICAgICAgICAgICAgYGh0dHBzOi8vc291cmNlLnVuc3BsYXNoLmNvbS9yYW5kb20vJHtzaXplID8/IFwiXCJ9PyR7XG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5ID8/IFwiXCJcbiAgICAgICAgICAgICAgICB9YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IHJlc3BvbnNlLnVybDtcbiAgICAgICAgICAgIHJldHVybiBgIVt0cC53ZWIucmFuZG9tX3BpY3R1cmVdKCR7dXJsfSlgO1xuICAgICAgICB9O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEludGVybmFsTW9kdWxlIH0gZnJvbSBcIi4uL0ludGVybmFsTW9kdWxlXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnRlcm5hbE1vZHVsZUZyb250bWF0dGVyIGV4dGVuZHMgSW50ZXJuYWxNb2R1bGUge1xuICAgIHB1YmxpYyBuYW1lID0gXCJmcm9udG1hdHRlclwiO1xuXG4gICAgYXN5bmMgY3JlYXRlX3N0YXRpY190ZW1wbGF0ZXMoKTogUHJvbWlzZTx2b2lkPiB7fVxuXG4gICAgYXN5bmMgY3JlYXRlX2R5bmFtaWNfdGVtcGxhdGVzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBjb25zdCBjYWNoZSA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKFxuICAgICAgICAgICAgdGhpcy5jb25maWcudGFyZ2V0X2ZpbGVcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5keW5hbWljX2Z1bmN0aW9ucyA9IG5ldyBNYXAoXG4gICAgICAgICAgICBPYmplY3QuZW50cmllcyhjYWNoZT8uZnJvbnRtYXR0ZXIgfHwge30pXG4gICAgICAgICk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgVGVtcGxhdGVyRXJyb3IgfSBmcm9tIFwiRXJyb3JcIjtcbmltcG9ydCB7IEFwcCwgTW9kYWwgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuZXhwb3J0IGNsYXNzIFByb21wdE1vZGFsIGV4dGVuZHMgTW9kYWwge1xuICAgIHByaXZhdGUgcHJvbXB0RWw6IEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSByZXNvbHZlOiAodmFsdWU6IHN0cmluZykgPT4gdm9pZDtcbiAgICBwcml2YXRlIHJlamVjdDogKHJlYXNvbj86IGFueSkgPT4gdm9pZDtcbiAgICBwcml2YXRlIHN1Ym1pdHRlZCA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIGFwcDogQXBwLFxuICAgICAgICBwcml2YXRlIHByb21wdF90ZXh0OiBzdHJpbmcsXG4gICAgICAgIHByaXZhdGUgZGVmYXVsdF92YWx1ZTogc3RyaW5nXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKGFwcCk7XG4gICAgfVxuXG4gICAgb25PcGVuKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnRpdGxlRWwuc2V0VGV4dCh0aGlzLnByb21wdF90ZXh0KTtcbiAgICAgICAgdGhpcy5jcmVhdGVGb3JtKCk7XG4gICAgfVxuXG4gICAgb25DbG9zZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jb250ZW50RWwuZW1wdHkoKTtcbiAgICAgICAgaWYgKCF0aGlzLnN1Ym1pdHRlZCkge1xuICAgICAgICAgICAgdGhpcy5yZWplY3QobmV3IFRlbXBsYXRlckVycm9yKFwiQ2FuY2VsbGVkIHByb21wdFwiKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVGb3JtKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBkaXYgPSB0aGlzLmNvbnRlbnRFbC5jcmVhdGVEaXYoKTtcbiAgICAgICAgZGl2LmFkZENsYXNzKFwidGVtcGxhdGVyLXByb21wdC1kaXZcIik7XG5cbiAgICAgICAgY29uc3QgZm9ybSA9IGRpdi5jcmVhdGVFbChcImZvcm1cIik7XG4gICAgICAgIGZvcm0uYWRkQ2xhc3MoXCJ0ZW1wbGF0ZXItcHJvbXB0LWZvcm1cIik7XG4gICAgICAgIGZvcm0udHlwZSA9IFwic3VibWl0XCI7XG4gICAgICAgIGZvcm0ub25zdWJtaXQgPSAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3VibWl0dGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZSh0aGlzLnByb21wdEVsLnZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnByb21wdEVsID0gZm9ybS5jcmVhdGVFbChcImlucHV0XCIpO1xuICAgICAgICB0aGlzLnByb21wdEVsLnR5cGUgPSBcInRleHRcIjtcbiAgICAgICAgdGhpcy5wcm9tcHRFbC5wbGFjZWhvbGRlciA9IFwiVHlwZSB0ZXh0IGhlcmUuLi5cIjtcbiAgICAgICAgdGhpcy5wcm9tcHRFbC52YWx1ZSA9IHRoaXMuZGVmYXVsdF92YWx1ZSA/PyBcIlwiO1xuICAgICAgICB0aGlzLnByb21wdEVsLmFkZENsYXNzKFwidGVtcGxhdGVyLXByb21wdC1pbnB1dFwiKTtcbiAgICAgICAgdGhpcy5wcm9tcHRFbC5zZWxlY3QoKTtcbiAgICB9XG5cbiAgICBhc3luYyBvcGVuQW5kR2V0VmFsdWUoXG4gICAgICAgIHJlc29sdmU6ICh2YWx1ZTogc3RyaW5nKSA9PiB2b2lkLFxuICAgICAgICByZWplY3Q6IChyZWFzb24/OiBhbnkpID0+IHZvaWRcbiAgICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdGhpcy5yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgICAgdGhpcy5yZWplY3QgPSByZWplY3Q7XG4gICAgICAgIHRoaXMub3BlbigpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFRlbXBsYXRlckVycm9yIH0gZnJvbSBcIkVycm9yXCI7XG5pbXBvcnQgeyBBcHAsIEZ1enp5TWF0Y2gsIEZ1enp5U3VnZ2VzdE1vZGFsIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmV4cG9ydCBjbGFzcyBTdWdnZXN0ZXJNb2RhbDxUPiBleHRlbmRzIEZ1enp5U3VnZ2VzdE1vZGFsPFQ+IHtcbiAgICBwcml2YXRlIHJlc29sdmU6ICh2YWx1ZTogVCkgPT4gdm9pZDtcbiAgICBwcml2YXRlIHJlamVjdDogKHJlYXNvbj86IGFueSkgPT4gdm9pZDtcbiAgICBwcml2YXRlIHN1Ym1pdHRlZCA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIGFwcDogQXBwLFxuICAgICAgICBwcml2YXRlIHRleHRfaXRlbXM6IHN0cmluZ1tdIHwgKChpdGVtOiBUKSA9PiBzdHJpbmcpLFxuICAgICAgICBwcml2YXRlIGl0ZW1zOiBUW10sXG4gICAgICAgIHBsYWNlaG9sZGVyOiBzdHJpbmdcbiAgICApIHtcbiAgICAgICAgc3VwZXIoYXBwKTtcbiAgICAgICAgdGhpcy5zZXRQbGFjZWhvbGRlcihwbGFjZWhvbGRlcik7XG4gICAgfVxuXG4gICAgZ2V0SXRlbXMoKTogVFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXRlbXM7XG4gICAgfVxuXG4gICAgb25DbG9zZSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLnN1Ym1pdHRlZCkge1xuICAgICAgICAgICAgdGhpcy5yZWplY3QobmV3IFRlbXBsYXRlckVycm9yKFwiQ2FuY2VsbGVkIHByb21wdFwiKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZWxlY3RTdWdnZXN0aW9uKFxuICAgICAgICB2YWx1ZTogRnV6enlNYXRjaDxUPixcbiAgICAgICAgZXZ0OiBNb3VzZUV2ZW50IHwgS2V5Ym9hcmRFdmVudFxuICAgICk6IHZvaWQge1xuICAgICAgICB0aGlzLnN1Ym1pdHRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgdGhpcy5vbkNob29zZVN1Z2dlc3Rpb24odmFsdWUsIGV2dCk7XG4gICAgfVxuXG4gICAgZ2V0SXRlbVRleHQoaXRlbTogVCk6IHN0cmluZyB7XG4gICAgICAgIGlmICh0aGlzLnRleHRfaXRlbXMgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudGV4dF9pdGVtcyhpdGVtKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgdGhpcy50ZXh0X2l0ZW1zW3RoaXMuaXRlbXMuaW5kZXhPZihpdGVtKV0gfHwgXCJVbmRlZmluZWQgVGV4dCBJdGVtXCJcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBvbkNob29zZUl0ZW0oaXRlbTogVCwgX2V2dDogTW91c2VFdmVudCB8IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yZXNvbHZlKGl0ZW0pO1xuICAgIH1cblxuICAgIGFzeW5jIG9wZW5BbmRHZXRWYWx1ZShcbiAgICAgICAgcmVzb2x2ZTogKHZhbHVlOiBUKSA9PiB2b2lkLFxuICAgICAgICByZWplY3Q6IChyZWFzb24/OiBhbnkpID0+IHZvaWRcbiAgICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdGhpcy5yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgICAgdGhpcy5yZWplY3QgPSByZWplY3Q7XG4gICAgICAgIHRoaXMub3BlbigpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFVOU1VQUE9SVEVEX01PQklMRV9URU1QTEFURSB9IGZyb20gXCJDb25zdGFudHNcIjtcbmltcG9ydCB7IEludGVybmFsTW9kdWxlIH0gZnJvbSBcIi4uL0ludGVybmFsTW9kdWxlXCI7XG5pbXBvcnQgeyBQbGF0Zm9ybSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgUHJvbXB0TW9kYWwgfSBmcm9tIFwiLi9Qcm9tcHRNb2RhbFwiO1xuaW1wb3J0IHsgU3VnZ2VzdGVyTW9kYWwgfSBmcm9tIFwiLi9TdWdnZXN0ZXJNb2RhbFwiO1xuXG5leHBvcnQgY2xhc3MgSW50ZXJuYWxNb2R1bGVTeXN0ZW0gZXh0ZW5kcyBJbnRlcm5hbE1vZHVsZSB7XG4gICAgcHVibGljIG5hbWUgPSBcInN5c3RlbVwiO1xuXG4gICAgYXN5bmMgY3JlYXRlX3N0YXRpY190ZW1wbGF0ZXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRoaXMuc3RhdGljX2Z1bmN0aW9ucy5zZXQoXCJjbGlwYm9hcmRcIiwgdGhpcy5nZW5lcmF0ZV9jbGlwYm9hcmQoKSk7XG4gICAgICAgIHRoaXMuc3RhdGljX2Z1bmN0aW9ucy5zZXQoXCJwcm9tcHRcIiwgdGhpcy5nZW5lcmF0ZV9wcm9tcHQoKSk7XG4gICAgICAgIHRoaXMuc3RhdGljX2Z1bmN0aW9ucy5zZXQoXCJzdWdnZXN0ZXJcIiwgdGhpcy5nZW5lcmF0ZV9zdWdnZXN0ZXIoKSk7XG4gICAgfVxuXG4gICAgYXN5bmMgY3JlYXRlX2R5bmFtaWNfdGVtcGxhdGVzKCk6IFByb21pc2U8dm9pZD4ge31cblxuICAgIGdlbmVyYXRlX2NsaXBib2FyZCgpOiAoKSA9PiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICByZXR1cm4gYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgLy8gVE9ETzogQWRkIG1vYmlsZSBzdXBwb3J0XG4gICAgICAgICAgICBpZiAoUGxhdGZvcm0uaXNNb2JpbGVBcHApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gVU5TVVBQT1JURURfTU9CSUxFX1RFTVBMQVRFO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQucmVhZFRleHQoKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZV9wcm9tcHQoKTogKFxuICAgICAgICBwcm9tcHRfdGV4dDogc3RyaW5nLFxuICAgICAgICBkZWZhdWx0X3ZhbHVlOiBzdHJpbmcsXG4gICAgICAgIHRocm93X29uX2NhbmNlbDogYm9vbGVhblxuICAgICkgPT4gUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgcmV0dXJuIGFzeW5jIChcbiAgICAgICAgICAgIHByb21wdF90ZXh0OiBzdHJpbmcsXG4gICAgICAgICAgICBkZWZhdWx0X3ZhbHVlOiBzdHJpbmcsXG4gICAgICAgICAgICB0aHJvd19vbl9jYW5jZWwgPSBmYWxzZVxuICAgICAgICApOiBQcm9taXNlPHN0cmluZz4gPT4ge1xuICAgICAgICAgICAgY29uc3QgcHJvbXB0ID0gbmV3IFByb21wdE1vZGFsKFxuICAgICAgICAgICAgICAgIHRoaXMuYXBwLFxuICAgICAgICAgICAgICAgIHByb21wdF90ZXh0LFxuICAgICAgICAgICAgICAgIGRlZmF1bHRfdmFsdWVcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoXG4gICAgICAgICAgICAgICAgKFxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlOiAodmFsdWU6IHN0cmluZykgPT4gdm9pZCxcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0OiAocmVhc29uPzogYW55KSA9PiB2b2lkXG4gICAgICAgICAgICAgICAgKSA9PiBwcm9tcHQub3BlbkFuZEdldFZhbHVlKHJlc29sdmUsIHJlamVjdClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCBwcm9taXNlO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhyb3dfb25fY2FuY2VsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZV9zdWdnZXN0ZXIoKTogPFQ+KFxuICAgICAgICB0ZXh0X2l0ZW1zOiBzdHJpbmdbXSB8ICgoaXRlbTogVCkgPT4gc3RyaW5nKSxcbiAgICAgICAgaXRlbXM6IFRbXSxcbiAgICAgICAgdGhyb3dfb25fY2FuY2VsOiBib29sZWFuLFxuICAgICAgICBwbGFjZWhvbGRlcjogc3RyaW5nXG4gICAgKSA9PiBQcm9taXNlPFQ+IHtcbiAgICAgICAgcmV0dXJuIGFzeW5jIDxUPihcbiAgICAgICAgICAgIHRleHRfaXRlbXM6IHN0cmluZ1tdIHwgKChpdGVtOiBUKSA9PiBzdHJpbmcpLFxuICAgICAgICAgICAgaXRlbXM6IFRbXSxcbiAgICAgICAgICAgIHRocm93X29uX2NhbmNlbCA9IGZhbHNlLFxuICAgICAgICAgICAgcGxhY2Vob2xkZXIgPSBcIlwiXG4gICAgICAgICk6IFByb21pc2U8VD4gPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3VnZ2VzdGVyID0gbmV3IFN1Z2dlc3Rlck1vZGFsKFxuICAgICAgICAgICAgICAgIHRoaXMuYXBwLFxuICAgICAgICAgICAgICAgIHRleHRfaXRlbXMsXG4gICAgICAgICAgICAgICAgaXRlbXMsXG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoXG4gICAgICAgICAgICAgICAgKHJlc29sdmU6ICh2YWx1ZTogVCkgPT4gdm9pZCwgcmVqZWN0OiAocmVhc29uPzogYW55KSA9PiB2b2lkKSA9PlxuICAgICAgICAgICAgICAgICAgICBzdWdnZXN0ZXIub3BlbkFuZEdldFZhbHVlKHJlc29sdmUsIHJlamVjdClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCBwcm9taXNlO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhyb3dfb25fY2FuY2VsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJbnRlcm5hbE1vZHVsZSB9IGZyb20gXCJmdW5jdGlvbnMvaW50ZXJuYWxfZnVuY3Rpb25zL0ludGVybmFsTW9kdWxlXCI7XG5pbXBvcnQgeyBSdW5uaW5nQ29uZmlnIH0gZnJvbSBcIlRlbXBsYXRlclwiO1xuXG5leHBvcnQgY2xhc3MgSW50ZXJuYWxNb2R1bGVDb25maWcgZXh0ZW5kcyBJbnRlcm5hbE1vZHVsZSB7XG4gICAgcHVibGljIG5hbWUgPSBcImNvbmZpZ1wiO1xuXG4gICAgYXN5bmMgY3JlYXRlX3N0YXRpY190ZW1wbGF0ZXMoKTogUHJvbWlzZTx2b2lkPiB7fVxuXG4gICAgYXN5bmMgY3JlYXRlX2R5bmFtaWNfdGVtcGxhdGVzKCk6IFByb21pc2U8dm9pZD4ge31cblxuICAgIGFzeW5jIGdlbmVyYXRlX29iamVjdChcbiAgICAgICAgY29uZmlnOiBSdW5uaW5nQ29uZmlnXG4gICAgKTogUHJvbWlzZTx7IFt4OiBzdHJpbmddOiBhbnkgfT4ge1xuICAgICAgICByZXR1cm4gY29uZmlnO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEFwcCB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5pbXBvcnQgVGVtcGxhdGVyUGx1Z2luIGZyb20gXCJtYWluXCI7XG5pbXBvcnQgeyBJR2VuZXJhdGVPYmplY3QgfSBmcm9tIFwiZnVuY3Rpb25zL0lHZW5lcmF0ZU9iamVjdFwiO1xuaW1wb3J0IHsgSW50ZXJuYWxNb2R1bGUgfSBmcm9tIFwiLi9JbnRlcm5hbE1vZHVsZVwiO1xuaW1wb3J0IHsgSW50ZXJuYWxNb2R1bGVEYXRlIH0gZnJvbSBcIi4vZGF0ZS9JbnRlcm5hbE1vZHVsZURhdGVcIjtcbmltcG9ydCB7IEludGVybmFsTW9kdWxlRmlsZSB9IGZyb20gXCIuL2ZpbGUvSW50ZXJuYWxNb2R1bGVGaWxlXCI7XG5pbXBvcnQgeyBJbnRlcm5hbE1vZHVsZVdlYiB9IGZyb20gXCIuL3dlYi9JbnRlcm5hbE1vZHVsZVdlYlwiO1xuaW1wb3J0IHsgSW50ZXJuYWxNb2R1bGVGcm9udG1hdHRlciB9IGZyb20gXCIuL2Zyb250bWF0dGVyL0ludGVybmFsTW9kdWxlRnJvbnRtYXR0ZXJcIjtcbmltcG9ydCB7IEludGVybmFsTW9kdWxlU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtL0ludGVybmFsTW9kdWxlU3lzdGVtXCI7XG5pbXBvcnQgeyBSdW5uaW5nQ29uZmlnIH0gZnJvbSBcIlRlbXBsYXRlclwiO1xuaW1wb3J0IHsgSW50ZXJuYWxNb2R1bGVDb25maWcgfSBmcm9tIFwiLi9jb25maWcvSW50ZXJuYWxNb2R1bGVDb25maWdcIjtcblxuZXhwb3J0IGNsYXNzIEludGVybmFsRnVuY3Rpb25zIGltcGxlbWVudHMgSUdlbmVyYXRlT2JqZWN0IHtcbiAgICBwcml2YXRlIG1vZHVsZXNfYXJyYXk6IEFycmF5PEludGVybmFsTW9kdWxlPiA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGFwcDogQXBwLCBwcm90ZWN0ZWQgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW4pIHtcbiAgICAgICAgdGhpcy5tb2R1bGVzX2FycmF5LnB1c2gobmV3IEludGVybmFsTW9kdWxlRGF0ZSh0aGlzLmFwcCwgdGhpcy5wbHVnaW4pKTtcbiAgICAgICAgdGhpcy5tb2R1bGVzX2FycmF5LnB1c2gobmV3IEludGVybmFsTW9kdWxlRmlsZSh0aGlzLmFwcCwgdGhpcy5wbHVnaW4pKTtcbiAgICAgICAgdGhpcy5tb2R1bGVzX2FycmF5LnB1c2gobmV3IEludGVybmFsTW9kdWxlV2ViKHRoaXMuYXBwLCB0aGlzLnBsdWdpbikpO1xuICAgICAgICB0aGlzLm1vZHVsZXNfYXJyYXkucHVzaChcbiAgICAgICAgICAgIG5ldyBJbnRlcm5hbE1vZHVsZUZyb250bWF0dGVyKHRoaXMuYXBwLCB0aGlzLnBsdWdpbilcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5tb2R1bGVzX2FycmF5LnB1c2goXG4gICAgICAgICAgICBuZXcgSW50ZXJuYWxNb2R1bGVTeXN0ZW0odGhpcy5hcHAsIHRoaXMucGx1Z2luKVxuICAgICAgICApO1xuICAgICAgICB0aGlzLm1vZHVsZXNfYXJyYXkucHVzaChcbiAgICAgICAgICAgIG5ldyBJbnRlcm5hbE1vZHVsZUNvbmZpZyh0aGlzLmFwcCwgdGhpcy5wbHVnaW4pXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgYXN5bmMgaW5pdCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgZm9yIChjb25zdCBtb2Qgb2YgdGhpcy5tb2R1bGVzX2FycmF5KSB7XG4gICAgICAgICAgICBhd2FpdCBtb2QuaW5pdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgZ2VuZXJhdGVfb2JqZWN0KFxuICAgICAgICBjb25maWc6IFJ1bm5pbmdDb25maWdcbiAgICApOiBQcm9taXNlPFJlY29yZDxzdHJpbmcsIHVua25vd24+PiB7XG4gICAgICAgIGNvbnN0IGludGVybmFsX2Z1bmN0aW9uc19vYmplY3Q6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSB7fTtcblxuICAgICAgICBmb3IgKGNvbnN0IG1vZCBvZiB0aGlzLm1vZHVsZXNfYXJyYXkpIHtcbiAgICAgICAgICAgIGludGVybmFsX2Z1bmN0aW9uc19vYmplY3RbbW9kLmdldE5hbWUoKV0gPVxuICAgICAgICAgICAgICAgIGF3YWl0IG1vZC5nZW5lcmF0ZV9vYmplY3QoY29uZmlnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpbnRlcm5hbF9mdW5jdGlvbnNfb2JqZWN0O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IGV4ZWMgfSBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiO1xuaW1wb3J0IHsgcHJvbWlzaWZ5IH0gZnJvbSBcInV0aWxcIjtcbmltcG9ydCB7IEFwcCwgUGxhdGZvcm0sIEZpbGVTeXN0ZW1BZGFwdGVyIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmltcG9ydCBUZW1wbGF0ZXJQbHVnaW4gZnJvbSBcIm1haW5cIjtcbmltcG9ydCB7IElHZW5lcmF0ZU9iamVjdCB9IGZyb20gXCJmdW5jdGlvbnMvSUdlbmVyYXRlT2JqZWN0XCI7XG5pbXBvcnQgeyBSdW5uaW5nQ29uZmlnIH0gZnJvbSBcIlRlbXBsYXRlclwiO1xuaW1wb3J0IHsgVU5TVVBQT1JURURfTU9CSUxFX1RFTVBMQVRFIH0gZnJvbSBcIkNvbnN0YW50c1wiO1xuaW1wb3J0IHsgVGVtcGxhdGVyRXJyb3IgfSBmcm9tIFwiRXJyb3JcIjtcbmltcG9ydCB7IEZ1bmN0aW9uc01vZGUgfSBmcm9tIFwiZnVuY3Rpb25zL0Z1bmN0aW9uc0dlbmVyYXRvclwiO1xuXG5leHBvcnQgY2xhc3MgVXNlclN5c3RlbUZ1bmN0aW9ucyBpbXBsZW1lbnRzIElHZW5lcmF0ZU9iamVjdCB7XG4gICAgcHJpdmF0ZSBjd2Q6IHN0cmluZztcbiAgICBwcml2YXRlIGV4ZWNfcHJvbWlzZTogRnVuY3Rpb247XG5cbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcHJpdmF0ZSBwbHVnaW46IFRlbXBsYXRlclBsdWdpbikge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICBQbGF0Zm9ybS5pc01vYmlsZUFwcCB8fFxuICAgICAgICAgICAgIShhcHAudmF1bHQuYWRhcHRlciBpbnN0YW5jZW9mIEZpbGVTeXN0ZW1BZGFwdGVyKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMuY3dkID0gXCJcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3dkID0gYXBwLnZhdWx0LmFkYXB0ZXIuZ2V0QmFzZVBhdGgoKTtcbiAgICAgICAgICAgIHRoaXMuZXhlY19wcm9taXNlID0gcHJvbWlzaWZ5KGV4ZWMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gVE9ETzogQWRkIG1vYmlsZSBzdXBwb3J0XG4gICAgYXN5bmMgZ2VuZXJhdGVfc3lzdGVtX2Z1bmN0aW9ucyhcbiAgICAgICAgY29uZmlnOiBSdW5uaW5nQ29uZmlnXG4gICAgKTogUHJvbWlzZTxNYXA8c3RyaW5nLCAodXNlcl9hcmdzPzogYW55KSA9PiBQcm9taXNlPHN0cmluZz4+PiB7XG4gICAgICAgIGNvbnN0IHVzZXJfc3lzdGVtX2Z1bmN0aW9uczogTWFwPFxuICAgICAgICAgICAgc3RyaW5nLFxuICAgICAgICAgICAgKHVzZXJfYXJncz86IGFueSkgPT4gUHJvbWlzZTxzdHJpbmc+XG4gICAgICAgID4gPSBuZXcgTWFwKCk7XG4gICAgICAgIGNvbnN0IGludGVybmFsX2Z1bmN0aW9uc19vYmplY3QgPVxuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4udGVtcGxhdGVyLmZ1bmN0aW9uc19nZW5lcmF0b3IuZ2VuZXJhdGVfb2JqZWN0KFxuICAgICAgICAgICAgICAgIGNvbmZpZyxcbiAgICAgICAgICAgICAgICBGdW5jdGlvbnNNb2RlLklOVEVSTkFMXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIGZvciAoY29uc3QgdGVtcGxhdGVfcGFpciBvZiB0aGlzLnBsdWdpbi5zZXR0aW5ncy50ZW1wbGF0ZXNfcGFpcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IHRlbXBsYXRlID0gdGVtcGxhdGVfcGFpclswXTtcbiAgICAgICAgICAgIGxldCBjbWQgPSB0ZW1wbGF0ZV9wYWlyWzFdO1xuICAgICAgICAgICAgaWYgKCF0ZW1wbGF0ZSB8fCAhY21kKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChQbGF0Zm9ybS5pc01vYmlsZUFwcCkge1xuICAgICAgICAgICAgICAgIHVzZXJfc3lzdGVtX2Z1bmN0aW9ucy5zZXQoXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlLFxuICAgICAgICAgICAgICAgICAgICAoX3VzZXJfYXJncz86IGFueSk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShVTlNVUFBPUlRFRF9NT0JJTEVfVEVNUExBVEUpXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY21kID0gYXdhaXQgdGhpcy5wbHVnaW4udGVtcGxhdGVyLnBhcnNlci5wYXJzZV9jb21tYW5kcyhcbiAgICAgICAgICAgICAgICAgICAgY21kLFxuICAgICAgICAgICAgICAgICAgICBpbnRlcm5hbF9mdW5jdGlvbnNfb2JqZWN0XG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIHVzZXJfc3lzdGVtX2Z1bmN0aW9ucy5zZXQoXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlLFxuICAgICAgICAgICAgICAgICAgICBhc3luYyAodXNlcl9hcmdzPzogYW55KTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb2Nlc3NfZW52ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLnByb2Nlc3MuZW52LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLnVzZXJfYXJncyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNtZF9vcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVvdXQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmNvbW1hbmRfdGltZW91dCAqIDEwMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3dkOiB0aGlzLmN3ZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnY6IHByb2Nlc3NfZW52LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLih0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaGVsbF9wYXRoICYmIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGw6IHRoaXMucGx1Z2luLnNldHRpbmdzLnNoZWxsX3BhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgc3Rkb3V0IH0gPSBhd2FpdCB0aGlzLmV4ZWNfcHJvbWlzZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY21kLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbWRfb3B0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0ZG91dC50cmltUmlnaHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFRlbXBsYXRlckVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgRXJyb3Igd2l0aCBVc2VyIFRlbXBsYXRlICR7dGVtcGxhdGV9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdXNlcl9zeXN0ZW1fZnVuY3Rpb25zO1xuICAgIH1cblxuICAgIGFzeW5jIGdlbmVyYXRlX29iamVjdChcbiAgICAgICAgY29uZmlnOiBSdW5uaW5nQ29uZmlnXG4gICAgKTogUHJvbWlzZTxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4ge1xuICAgICAgICBjb25zdCB1c2VyX3N5c3RlbV9mdW5jdGlvbnMgPSBhd2FpdCB0aGlzLmdlbmVyYXRlX3N5c3RlbV9mdW5jdGlvbnMoXG4gICAgICAgICAgICBjb25maWdcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyh1c2VyX3N5c3RlbV9mdW5jdGlvbnMpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEFwcCwgRmlsZVN5c3RlbUFkYXB0ZXIsIFRGaWxlIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmltcG9ydCBUZW1wbGF0ZXJQbHVnaW4gZnJvbSBcIm1haW5cIjtcbmltcG9ydCB7IElHZW5lcmF0ZU9iamVjdCB9IGZyb20gXCJmdW5jdGlvbnMvSUdlbmVyYXRlT2JqZWN0XCI7XG5pbXBvcnQgeyBSdW5uaW5nQ29uZmlnIH0gZnJvbSBcIlRlbXBsYXRlclwiO1xuaW1wb3J0IHsgZ2V0X3RmaWxlc19mcm9tX2ZvbGRlciB9IGZyb20gXCJVdGlsc1wiO1xuaW1wb3J0IHsgZXJyb3JXcmFwcGVyU3luYywgVGVtcGxhdGVyRXJyb3IgfSBmcm9tIFwiRXJyb3JcIjtcblxuZXhwb3J0IGNsYXNzIFVzZXJTY3JpcHRGdW5jdGlvbnMgaW1wbGVtZW50cyBJR2VuZXJhdGVPYmplY3Qge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBwOiBBcHAsIHByaXZhdGUgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW4pIHt9XG5cbiAgICBhc3luYyBnZW5lcmF0ZV91c2VyX3NjcmlwdF9mdW5jdGlvbnMoXG4gICAgICAgIGNvbmZpZzogUnVubmluZ0NvbmZpZ1xuICAgICk6IFByb21pc2U8TWFwPHN0cmluZywgRnVuY3Rpb24+PiB7XG4gICAgICAgIGNvbnN0IHVzZXJfc2NyaXB0X2Z1bmN0aW9uczogTWFwPHN0cmluZywgRnVuY3Rpb24+ID0gbmV3IE1hcCgpO1xuICAgICAgICBjb25zdCBmaWxlcyA9IGVycm9yV3JhcHBlclN5bmMoXG4gICAgICAgICAgICAoKSA9PlxuICAgICAgICAgICAgICAgIGdldF90ZmlsZXNfZnJvbV9mb2xkZXIoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy51c2VyX3NjcmlwdHNfZm9sZGVyXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIGBDb3VsZG4ndCBmaW5kIHVzZXIgc2NyaXB0IGZvbGRlciBcIiR7dGhpcy5wbHVnaW4uc2V0dGluZ3MudXNlcl9zY3JpcHRzX2ZvbGRlcn1cImBcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKCFmaWxlcykge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBNYXAoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3QgZmlsZSBvZiBmaWxlcykge1xuICAgICAgICAgICAgaWYgKGZpbGUuZXh0ZW5zaW9uLnRvTG93ZXJDYXNlKCkgPT09IFwianNcIikge1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMubG9hZF91c2VyX3NjcmlwdF9mdW5jdGlvbihcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLFxuICAgICAgICAgICAgICAgICAgICBmaWxlLFxuICAgICAgICAgICAgICAgICAgICB1c2VyX3NjcmlwdF9mdW5jdGlvbnNcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1c2VyX3NjcmlwdF9mdW5jdGlvbnM7XG4gICAgfVxuXG4gICAgYXN5bmMgbG9hZF91c2VyX3NjcmlwdF9mdW5jdGlvbihcbiAgICAgICAgY29uZmlnOiBSdW5uaW5nQ29uZmlnLFxuICAgICAgICBmaWxlOiBURmlsZSxcbiAgICAgICAgdXNlcl9zY3JpcHRfZnVuY3Rpb25zOiBNYXA8c3RyaW5nLCBGdW5jdGlvbj5cbiAgICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKCEodGhpcy5hcHAudmF1bHQuYWRhcHRlciBpbnN0YW5jZW9mIEZpbGVTeXN0ZW1BZGFwdGVyKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFRlbXBsYXRlckVycm9yKFxuICAgICAgICAgICAgICAgIFwiYXBwLnZhdWx0IGlzIG5vdCBhIEZpbGVTeXN0ZW1BZGFwdGVyIGluc3RhbmNlXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdmF1bHRfcGF0aCA9IHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIuZ2V0QmFzZVBhdGgoKTtcbiAgICAgICAgY29uc3QgZmlsZV9wYXRoID0gYCR7dmF1bHRfcGF0aH0vJHtmaWxlLnBhdGh9YDtcblxuICAgICAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yNjYzMzkwMS9yZWxvYWQtbW9kdWxlLWF0LXJ1bnRpbWVcbiAgICAgICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTk3MjI0Mi9ob3ctdG8tYXV0by1yZWxvYWQtZmlsZXMtaW4tbm9kZS1qc1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMod2luZG93LnJlcXVpcmUuY2FjaGUpLmNvbnRhaW5zKGZpbGVfcGF0aCkpIHtcbiAgICAgICAgICAgIGRlbGV0ZSB3aW5kb3cucmVxdWlyZS5jYWNoZVt3aW5kb3cucmVxdWlyZS5yZXNvbHZlKGZpbGVfcGF0aCldO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXNlcl9mdW5jdGlvbiA9IGF3YWl0IGltcG9ydChmaWxlX3BhdGgpO1xuICAgICAgICBpZiAoIXVzZXJfZnVuY3Rpb24uZGVmYXVsdCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFRlbXBsYXRlckVycm9yKFxuICAgICAgICAgICAgICAgIGBGYWlsZWQgdG8gbG9hZCB1c2VyIHNjcmlwdCAke2ZpbGVfcGF0aH0uIE5vIGV4cG9ydHMgZGV0ZWN0ZWQuYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoISh1c2VyX2Z1bmN0aW9uLmRlZmF1bHQgaW5zdGFuY2VvZiBGdW5jdGlvbikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUZW1wbGF0ZXJFcnJvcihcbiAgICAgICAgICAgICAgICBgRmFpbGVkIHRvIGxvYWQgdXNlciBzY3JpcHQgJHtmaWxlX3BhdGh9LiBEZWZhdWx0IGV4cG9ydCBpcyBub3QgYSBmdW5jdGlvbi5gXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHVzZXJfc2NyaXB0X2Z1bmN0aW9ucy5zZXQoYCR7ZmlsZS5iYXNlbmFtZX1gLCB1c2VyX2Z1bmN0aW9uLmRlZmF1bHQpO1xuICAgIH1cblxuICAgIGFzeW5jIGdlbmVyYXRlX29iamVjdChcbiAgICAgICAgY29uZmlnOiBSdW5uaW5nQ29uZmlnXG4gICAgKTogUHJvbWlzZTxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4ge1xuICAgICAgICBjb25zdCB1c2VyX3NjcmlwdF9mdW5jdGlvbnMgPSBhd2FpdCB0aGlzLmdlbmVyYXRlX3VzZXJfc2NyaXB0X2Z1bmN0aW9ucyhcbiAgICAgICAgICAgIGNvbmZpZ1xuICAgICAgICApO1xuICAgICAgICByZXR1cm4gT2JqZWN0LmZyb21FbnRyaWVzKHVzZXJfc2NyaXB0X2Z1bmN0aW9ucyk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQXBwLCBQbGF0Zm9ybSB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5pbXBvcnQgVGVtcGxhdGVyUGx1Z2luIGZyb20gXCJtYWluXCI7XG5pbXBvcnQgeyBSdW5uaW5nQ29uZmlnIH0gZnJvbSBcIlRlbXBsYXRlclwiO1xuaW1wb3J0IHsgSUdlbmVyYXRlT2JqZWN0IH0gZnJvbSBcImZ1bmN0aW9ucy9JR2VuZXJhdGVPYmplY3RcIjtcbmltcG9ydCB7IFVzZXJTeXN0ZW1GdW5jdGlvbnMgfSBmcm9tIFwiZnVuY3Rpb25zL3VzZXJfZnVuY3Rpb25zL1VzZXJTeXN0ZW1GdW5jdGlvbnNcIjtcbmltcG9ydCB7IFVzZXJTY3JpcHRGdW5jdGlvbnMgfSBmcm9tIFwiZnVuY3Rpb25zL3VzZXJfZnVuY3Rpb25zL1VzZXJTY3JpcHRGdW5jdGlvbnNcIjtcblxuZXhwb3J0IGNsYXNzIFVzZXJGdW5jdGlvbnMgaW1wbGVtZW50cyBJR2VuZXJhdGVPYmplY3Qge1xuICAgIHByaXZhdGUgdXNlcl9zeXN0ZW1fZnVuY3Rpb25zOiBVc2VyU3lzdGVtRnVuY3Rpb25zO1xuICAgIHByaXZhdGUgdXNlcl9zY3JpcHRfZnVuY3Rpb25zOiBVc2VyU2NyaXB0RnVuY3Rpb25zO1xuXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHByaXZhdGUgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW4pIHtcbiAgICAgICAgdGhpcy51c2VyX3N5c3RlbV9mdW5jdGlvbnMgPSBuZXcgVXNlclN5c3RlbUZ1bmN0aW9ucyhhcHAsIHBsdWdpbik7XG4gICAgICAgIHRoaXMudXNlcl9zY3JpcHRfZnVuY3Rpb25zID0gbmV3IFVzZXJTY3JpcHRGdW5jdGlvbnMoYXBwLCBwbHVnaW4pO1xuICAgIH1cblxuICAgIGFzeW5jIGdlbmVyYXRlX29iamVjdChcbiAgICAgICAgY29uZmlnOiBSdW5uaW5nQ29uZmlnXG4gICAgKTogUHJvbWlzZTxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4ge1xuICAgICAgICBsZXQgdXNlcl9zeXN0ZW1fZnVuY3Rpb25zID0ge307XG4gICAgICAgIGxldCB1c2VyX3NjcmlwdF9mdW5jdGlvbnMgPSB7fTtcblxuICAgICAgICBpZiAodGhpcy5wbHVnaW4uc2V0dGluZ3MuZW5hYmxlX3N5c3RlbV9jb21tYW5kcykge1xuICAgICAgICAgICAgdXNlcl9zeXN0ZW1fZnVuY3Rpb25zID1cbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnVzZXJfc3lzdGVtX2Z1bmN0aW9ucy5nZW5lcmF0ZV9vYmplY3QoY29uZmlnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRPRE86IEFkZCBtb2JpbGUgc3VwcG9ydFxuICAgICAgICAvLyB1c2VyX3NjcmlwdHNfZm9sZGVyIG5lZWRzIHRvIGJlIGV4cGxpY2l0bHkgc2V0IHRvICcvJyB0byBxdWVyeSBmcm9tIHJvb3RcbiAgICAgICAgaWYgKFBsYXRmb3JtLmlzRGVza3RvcEFwcCAmJiB0aGlzLnBsdWdpbi5zZXR0aW5ncy51c2VyX3NjcmlwdHNfZm9sZGVyKSB7XG4gICAgICAgICAgICB1c2VyX3NjcmlwdF9mdW5jdGlvbnMgPVxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMudXNlcl9zY3JpcHRfZnVuY3Rpb25zLmdlbmVyYXRlX29iamVjdChjb25maWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLnVzZXJfc3lzdGVtX2Z1bmN0aW9ucyxcbiAgICAgICAgICAgIC4uLnVzZXJfc2NyaXB0X2Z1bmN0aW9ucyxcbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBBcHAgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW1wb3J0IHsgSW50ZXJuYWxGdW5jdGlvbnMgfSBmcm9tIFwiZnVuY3Rpb25zL2ludGVybmFsX2Z1bmN0aW9ucy9JbnRlcm5hbEZ1bmN0aW9uc1wiO1xuaW1wb3J0IHsgVXNlckZ1bmN0aW9ucyB9IGZyb20gXCJmdW5jdGlvbnMvdXNlcl9mdW5jdGlvbnMvVXNlckZ1bmN0aW9uc1wiO1xuaW1wb3J0IFRlbXBsYXRlclBsdWdpbiBmcm9tIFwibWFpblwiO1xuaW1wb3J0IHsgSUdlbmVyYXRlT2JqZWN0IH0gZnJvbSBcImZ1bmN0aW9ucy9JR2VuZXJhdGVPYmplY3RcIjtcbmltcG9ydCB7IFJ1bm5pbmdDb25maWcgfSBmcm9tIFwiVGVtcGxhdGVyXCI7XG5pbXBvcnQgKiBhcyBvYnNpZGlhbl9tb2R1bGUgZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmV4cG9ydCBlbnVtIEZ1bmN0aW9uc01vZGUge1xuICAgIElOVEVSTkFMLFxuICAgIFVTRVJfSU5URVJOQUwsXG59XG5cbmV4cG9ydCBjbGFzcyBGdW5jdGlvbnNHZW5lcmF0b3IgaW1wbGVtZW50cyBJR2VuZXJhdGVPYmplY3Qge1xuICAgIHB1YmxpYyBpbnRlcm5hbF9mdW5jdGlvbnM6IEludGVybmFsRnVuY3Rpb25zO1xuICAgIHB1YmxpYyB1c2VyX2Z1bmN0aW9uczogVXNlckZ1bmN0aW9ucztcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBwOiBBcHAsIHByaXZhdGUgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW4pIHtcbiAgICAgICAgdGhpcy5pbnRlcm5hbF9mdW5jdGlvbnMgPSBuZXcgSW50ZXJuYWxGdW5jdGlvbnModGhpcy5hcHAsIHRoaXMucGx1Z2luKTtcbiAgICAgICAgdGhpcy51c2VyX2Z1bmN0aW9ucyA9IG5ldyBVc2VyRnVuY3Rpb25zKHRoaXMuYXBwLCB0aGlzLnBsdWdpbik7XG4gICAgfVxuXG4gICAgYXN5bmMgaW5pdCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgYXdhaXQgdGhpcy5pbnRlcm5hbF9mdW5jdGlvbnMuaW5pdCgpO1xuICAgIH1cblxuICAgIGFkZGl0aW9uYWxfZnVuY3Rpb25zKCk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9ic2lkaWFuOiBvYnNpZGlhbl9tb2R1bGUsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgYXN5bmMgZ2VuZXJhdGVfb2JqZWN0KFxuICAgICAgICBjb25maWc6IFJ1bm5pbmdDb25maWcsXG4gICAgICAgIGZ1bmN0aW9uc19tb2RlOiBGdW5jdGlvbnNNb2RlID0gRnVuY3Rpb25zTW9kZS5VU0VSX0lOVEVSTkFMXG4gICAgKTogUHJvbWlzZTxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4ge1xuICAgICAgICBjb25zdCBmaW5hbF9vYmplY3QgPSB7fTtcbiAgICAgICAgY29uc3QgYWRkaXRpb25hbF9mdW5jdGlvbnNfb2JqZWN0ID0gdGhpcy5hZGRpdGlvbmFsX2Z1bmN0aW9ucygpO1xuICAgICAgICBjb25zdCBpbnRlcm5hbF9mdW5jdGlvbnNfb2JqZWN0ID1cbiAgICAgICAgICAgIGF3YWl0IHRoaXMuaW50ZXJuYWxfZnVuY3Rpb25zLmdlbmVyYXRlX29iamVjdChjb25maWcpO1xuICAgICAgICBsZXQgdXNlcl9mdW5jdGlvbnNfb2JqZWN0ID0ge307XG5cbiAgICAgICAgT2JqZWN0LmFzc2lnbihmaW5hbF9vYmplY3QsIGFkZGl0aW9uYWxfZnVuY3Rpb25zX29iamVjdCk7XG4gICAgICAgIHN3aXRjaCAoZnVuY3Rpb25zX21vZGUpIHtcbiAgICAgICAgICAgIGNhc2UgRnVuY3Rpb25zTW9kZS5JTlRFUk5BTDpcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKGZpbmFsX29iamVjdCwgaW50ZXJuYWxfZnVuY3Rpb25zX29iamVjdCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEZ1bmN0aW9uc01vZGUuVVNFUl9JTlRFUk5BTDpcbiAgICAgICAgICAgICAgICB1c2VyX2Z1bmN0aW9uc19vYmplY3QgPVxuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnVzZXJfZnVuY3Rpb25zLmdlbmVyYXRlX29iamVjdChjb25maWcpO1xuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oZmluYWxfb2JqZWN0LCB7XG4gICAgICAgICAgICAgICAgICAgIC4uLmludGVybmFsX2Z1bmN0aW9uc19vYmplY3QsXG4gICAgICAgICAgICAgICAgICAgIHVzZXI6IHVzZXJfZnVuY3Rpb25zX29iamVjdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaW5hbF9vYmplY3Q7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtcbiAgICBBcHAsXG4gICAgRWRpdG9yUG9zaXRpb24sXG4gICAgRWRpdG9yUmFuZ2VPckNhcmV0LFxuICAgIEVkaXRvclRyYW5zYWN0aW9uLFxuICAgIE1hcmtkb3duVmlldyxcbn0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBlc2NhcGVfUmVnRXhwIH0gZnJvbSBcIlV0aWxzXCI7XG5cbmV4cG9ydCBjbGFzcyBDdXJzb3JKdW1wZXIge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBwOiBBcHApIHt9XG5cbiAgICBhc3luYyBqdW1wX3RvX25leHRfY3Vyc29yX2xvY2F0aW9uKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBjb25zdCBhY3RpdmVfdmlldyA9XG4gICAgICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgICAgICBpZiAoIWFjdGl2ZV92aWV3KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYWN0aXZlX2ZpbGUgPSBhY3RpdmVfdmlldy5maWxlO1xuICAgICAgICBhd2FpdCBhY3RpdmVfdmlldy5zYXZlKCk7XG5cbiAgICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWQoYWN0aXZlX2ZpbGUpO1xuXG4gICAgICAgIGNvbnN0IHsgbmV3X2NvbnRlbnQsIHBvc2l0aW9ucyB9ID1cbiAgICAgICAgICAgIHRoaXMucmVwbGFjZV9hbmRfZ2V0X2N1cnNvcl9wb3NpdGlvbnMoY29udGVudCk7XG4gICAgICAgIGlmIChwb3NpdGlvbnMpIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0Lm1vZGlmeShhY3RpdmVfZmlsZSwgbmV3X2NvbnRlbnQpO1xuICAgICAgICAgICAgdGhpcy5zZXRfY3Vyc29yX2xvY2F0aW9uKHBvc2l0aW9ucyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRfZWRpdG9yX3Bvc2l0aW9uX2Zyb21faW5kZXgoXG4gICAgICAgIGNvbnRlbnQ6IHN0cmluZyxcbiAgICAgICAgaW5kZXg6IG51bWJlclxuICAgICk6IEVkaXRvclBvc2l0aW9uIHtcbiAgICAgICAgY29uc3Qgc3Vic3RyID0gY29udGVudC5zdWJzdHIoMCwgaW5kZXgpO1xuXG4gICAgICAgIGxldCBsID0gMDtcbiAgICAgICAgbGV0IG9mZnNldCA9IC0xO1xuICAgICAgICBsZXQgciA9IC0xO1xuICAgICAgICBmb3IgKDsgKHIgPSBzdWJzdHIuaW5kZXhPZihcIlxcblwiLCByICsgMSkpICE9PSAtMTsgbCsrLCBvZmZzZXQgPSByKTtcbiAgICAgICAgb2Zmc2V0ICs9IDE7XG5cbiAgICAgICAgY29uc3QgY2ggPSBjb250ZW50LnN1YnN0cihvZmZzZXQsIGluZGV4IC0gb2Zmc2V0KS5sZW5ndGg7XG5cbiAgICAgICAgcmV0dXJuIHsgbGluZTogbCwgY2g6IGNoIH07XG4gICAgfVxuXG4gICAgcmVwbGFjZV9hbmRfZ2V0X2N1cnNvcl9wb3NpdGlvbnMoY29udGVudDogc3RyaW5nKToge1xuICAgICAgICBuZXdfY29udGVudD86IHN0cmluZztcbiAgICAgICAgcG9zaXRpb25zPzogRWRpdG9yUG9zaXRpb25bXTtcbiAgICB9IHtcbiAgICAgICAgbGV0IGN1cnNvcl9tYXRjaGVzID0gW107XG4gICAgICAgIGxldCBtYXRjaDtcbiAgICAgICAgY29uc3QgY3Vyc29yX3JlZ2V4ID0gbmV3IFJlZ0V4cChcbiAgICAgICAgICAgIFwiPCVcXFxccyp0cC5maWxlLmN1cnNvclxcXFwoKD88b3JkZXI+WzAtOV17MCwyfSlcXFxcKVxcXFxzKiU+XCIsXG4gICAgICAgICAgICBcImdcIlxuICAgICAgICApO1xuXG4gICAgICAgIHdoaWxlICgobWF0Y2ggPSBjdXJzb3JfcmVnZXguZXhlYyhjb250ZW50KSkgIT0gbnVsbCkge1xuICAgICAgICAgICAgY3Vyc29yX21hdGNoZXMucHVzaChtYXRjaCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGN1cnNvcl9tYXRjaGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgY3Vyc29yX21hdGNoZXMuc29ydCgobTEsIG0yKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gTnVtYmVyKG0xLmdyb3Vwc1tcIm9yZGVyXCJdKSAtIE51bWJlcihtMi5ncm91cHNbXCJvcmRlclwiXSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBtYXRjaF9zdHIgPSBjdXJzb3JfbWF0Y2hlc1swXVswXTtcblxuICAgICAgICBjdXJzb3JfbWF0Y2hlcyA9IGN1cnNvcl9tYXRjaGVzLmZpbHRlcigobSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG1bMF0gPT09IG1hdGNoX3N0cjtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgcG9zaXRpb25zID0gW107XG4gICAgICAgIGxldCBpbmRleF9vZmZzZXQgPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IG1hdGNoIG9mIGN1cnNvcl9tYXRjaGVzKSB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IG1hdGNoLmluZGV4IC0gaW5kZXhfb2Zmc2V0O1xuICAgICAgICAgICAgcG9zaXRpb25zLnB1c2godGhpcy5nZXRfZWRpdG9yX3Bvc2l0aW9uX2Zyb21faW5kZXgoY29udGVudCwgaW5kZXgpKTtcblxuICAgICAgICAgICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZShuZXcgUmVnRXhwKGVzY2FwZV9SZWdFeHAobWF0Y2hbMF0pKSwgXCJcIik7XG4gICAgICAgICAgICBpbmRleF9vZmZzZXQgKz0gbWF0Y2hbMF0ubGVuZ3RoO1xuXG4gICAgICAgICAgICAvLyBGb3IgdHAuZmlsZS5jdXJzb3IoKSwgd2Uga2VlcCB0aGUgZGVmYXVsdCB0b3AgdG8gYm90dG9tXG4gICAgICAgICAgICBpZiAobWF0Y2hbMV0gPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7IG5ld19jb250ZW50OiBjb250ZW50LCBwb3NpdGlvbnM6IHBvc2l0aW9ucyB9O1xuICAgIH1cblxuICAgIHNldF9jdXJzb3JfbG9jYXRpb24ocG9zaXRpb25zOiBFZGl0b3JQb3NpdGlvbltdKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGFjdGl2ZV92aWV3ID1cbiAgICAgICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgICAgIGlmICghYWN0aXZlX3ZpZXcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVkaXRvciA9IGFjdGl2ZV92aWV3LmVkaXRvcjtcbiAgICAgICAgZWRpdG9yLmZvY3VzKCk7XG5cbiAgICAgICAgY29uc3Qgc2VsZWN0aW9uczogQXJyYXk8RWRpdG9yUmFuZ2VPckNhcmV0PiA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHBvcyBvZiBwb3NpdGlvbnMpIHtcbiAgICAgICAgICAgIHNlbGVjdGlvbnMucHVzaCh7IGZyb206IHBvcyB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRyYW5zYWN0aW9uOiBFZGl0b3JUcmFuc2FjdGlvbiA9IHtcbiAgICAgICAgICAgIHNlbGVjdGlvbnM6IHNlbGVjdGlvbnMsXG4gICAgICAgIH07XG4gICAgICAgIGVkaXRvci50cmFuc2FjdGlvbih0cmFuc2FjdGlvbik7XG4gICAgfVxufVxuIiwiLy8gQ29kZU1pcnJvciwgY29weXJpZ2h0IChjKSBieSBNYXJpam4gSGF2ZXJiZWtlIGFuZCBvdGhlcnNcbi8vIERpc3RyaWJ1dGVkIHVuZGVyIGFuIE1JVCBsaWNlbnNlOiBodHRwczovL2NvZGVtaXJyb3IubmV0L0xJQ0VOU0VcblxuKGZ1bmN0aW9uIChtb2QpIHtcbiAgICBtb2Qod2luZG93LkNvZGVNaXJyb3IpO1xufSkoZnVuY3Rpb24gKENvZGVNaXJyb3IpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIENvZGVNaXJyb3IuZGVmaW5lTW9kZShcImphdmFzY3JpcHRcIiwgZnVuY3Rpb24gKGNvbmZpZywgcGFyc2VyQ29uZmlnKSB7XG4gICAgICAgIHZhciBpbmRlbnRVbml0ID0gY29uZmlnLmluZGVudFVuaXQ7XG4gICAgICAgIHZhciBzdGF0ZW1lbnRJbmRlbnQgPSBwYXJzZXJDb25maWcuc3RhdGVtZW50SW5kZW50O1xuICAgICAgICB2YXIganNvbmxkTW9kZSA9IHBhcnNlckNvbmZpZy5qc29ubGQ7XG4gICAgICAgIHZhciBqc29uTW9kZSA9IHBhcnNlckNvbmZpZy5qc29uIHx8IGpzb25sZE1vZGU7XG4gICAgICAgIHZhciB0cmFja1Njb3BlID0gcGFyc2VyQ29uZmlnLnRyYWNrU2NvcGUgIT09IGZhbHNlO1xuICAgICAgICB2YXIgaXNUUyA9IHBhcnNlckNvbmZpZy50eXBlc2NyaXB0O1xuICAgICAgICB2YXIgd29yZFJFID0gcGFyc2VyQ29uZmlnLndvcmRDaGFyYWN0ZXJzIHx8IC9bXFx3JFxceGExLVxcdWZmZmZdLztcblxuICAgICAgICAvLyBUb2tlbml6ZXJcblxuICAgICAgICB2YXIga2V5d29yZHMgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZnVuY3Rpb24ga3codHlwZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IHR5cGU6IHR5cGUsIHN0eWxlOiBcImtleXdvcmRcIiB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIEEgPSBrdyhcImtleXdvcmQgYVwiKSxcbiAgICAgICAgICAgICAgICBCID0ga3coXCJrZXl3b3JkIGJcIiksXG4gICAgICAgICAgICAgICAgQyA9IGt3KFwia2V5d29yZCBjXCIpLFxuICAgICAgICAgICAgICAgIEQgPSBrdyhcImtleXdvcmQgZFwiKTtcbiAgICAgICAgICAgIHZhciBvcGVyYXRvciA9IGt3KFwib3BlcmF0b3JcIiksXG4gICAgICAgICAgICAgICAgYXRvbSA9IHsgdHlwZTogXCJhdG9tXCIsIHN0eWxlOiBcImF0b21cIiB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGlmOiBrdyhcImlmXCIpLFxuICAgICAgICAgICAgICAgIHdoaWxlOiBBLFxuICAgICAgICAgICAgICAgIHdpdGg6IEEsXG4gICAgICAgICAgICAgICAgZWxzZTogQixcbiAgICAgICAgICAgICAgICBkbzogQixcbiAgICAgICAgICAgICAgICB0cnk6IEIsXG4gICAgICAgICAgICAgICAgZmluYWxseTogQixcbiAgICAgICAgICAgICAgICByZXR1cm46IEQsXG4gICAgICAgICAgICAgICAgYnJlYWs6IEQsXG4gICAgICAgICAgICAgICAgY29udGludWU6IEQsXG4gICAgICAgICAgICAgICAgbmV3OiBrdyhcIm5ld1wiKSxcbiAgICAgICAgICAgICAgICBkZWxldGU6IEMsXG4gICAgICAgICAgICAgICAgdm9pZDogQyxcbiAgICAgICAgICAgICAgICB0aHJvdzogQyxcbiAgICAgICAgICAgICAgICBkZWJ1Z2dlcjoga3coXCJkZWJ1Z2dlclwiKSxcbiAgICAgICAgICAgICAgICB2YXI6IGt3KFwidmFyXCIpLFxuICAgICAgICAgICAgICAgIGNvbnN0OiBrdyhcInZhclwiKSxcbiAgICAgICAgICAgICAgICBsZXQ6IGt3KFwidmFyXCIpLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uOiBrdyhcImZ1bmN0aW9uXCIpLFxuICAgICAgICAgICAgICAgIGNhdGNoOiBrdyhcImNhdGNoXCIpLFxuICAgICAgICAgICAgICAgIGZvcjoga3coXCJmb3JcIiksXG4gICAgICAgICAgICAgICAgc3dpdGNoOiBrdyhcInN3aXRjaFwiKSxcbiAgICAgICAgICAgICAgICBjYXNlOiBrdyhcImNhc2VcIiksXG4gICAgICAgICAgICAgICAgZGVmYXVsdDoga3coXCJkZWZhdWx0XCIpLFxuICAgICAgICAgICAgICAgIGluOiBvcGVyYXRvcixcbiAgICAgICAgICAgICAgICB0eXBlb2Y6IG9wZXJhdG9yLFxuICAgICAgICAgICAgICAgIGluc3RhbmNlb2Y6IG9wZXJhdG9yLFxuICAgICAgICAgICAgICAgIHRydWU6IGF0b20sXG4gICAgICAgICAgICAgICAgZmFsc2U6IGF0b20sXG4gICAgICAgICAgICAgICAgbnVsbDogYXRvbSxcbiAgICAgICAgICAgICAgICB1bmRlZmluZWQ6IGF0b20sXG4gICAgICAgICAgICAgICAgTmFOOiBhdG9tLFxuICAgICAgICAgICAgICAgIEluZmluaXR5OiBhdG9tLFxuICAgICAgICAgICAgICAgIHRoaXM6IGt3KFwidGhpc1wiKSxcbiAgICAgICAgICAgICAgICBjbGFzczoga3coXCJjbGFzc1wiKSxcbiAgICAgICAgICAgICAgICBzdXBlcjoga3coXCJhdG9tXCIpLFxuICAgICAgICAgICAgICAgIHlpZWxkOiBDLFxuICAgICAgICAgICAgICAgIGV4cG9ydDoga3coXCJleHBvcnRcIiksXG4gICAgICAgICAgICAgICAgaW1wb3J0OiBrdyhcImltcG9ydFwiKSxcbiAgICAgICAgICAgICAgICBleHRlbmRzOiBDLFxuICAgICAgICAgICAgICAgIGF3YWl0OiBDLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSkoKTtcblxuICAgICAgICB2YXIgaXNPcGVyYXRvckNoYXIgPSAvWytcXC0qJiU9PD4hP3x+XkBdLztcbiAgICAgICAgdmFyIGlzSnNvbmxkS2V5d29yZCA9XG4gICAgICAgICAgICAvXkAoY29udGV4dHxpZHx2YWx1ZXxsYW5ndWFnZXx0eXBlfGNvbnRhaW5lcnxsaXN0fHNldHxyZXZlcnNlfGluZGV4fGJhc2V8dm9jYWJ8Z3JhcGgpXCIvO1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlYWRSZWdleHAoc3RyZWFtKSB7XG4gICAgICAgICAgICB2YXIgZXNjYXBlZCA9IGZhbHNlLFxuICAgICAgICAgICAgICAgIG5leHQsXG4gICAgICAgICAgICAgICAgaW5TZXQgPSBmYWxzZTtcbiAgICAgICAgICAgIHdoaWxlICgobmV4dCA9IHN0cmVhbS5uZXh0KCkpICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWVzY2FwZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHQgPT0gXCIvXCIgJiYgIWluU2V0KSByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0ID09IFwiW1wiKSBpblNldCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGluU2V0ICYmIG5leHQgPT0gXCJdXCIpIGluU2V0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVzY2FwZWQgPSAhZXNjYXBlZCAmJiBuZXh0ID09IFwiXFxcXFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gVXNlZCBhcyBzY3JhdGNoIHZhcmlhYmxlcyB0byBjb21tdW5pY2F0ZSBtdWx0aXBsZSB2YWx1ZXMgd2l0aG91dFxuICAgICAgICAvLyBjb25zaW5nIHVwIHRvbnMgb2Ygb2JqZWN0cy5cbiAgICAgICAgdmFyIHR5cGUsIGNvbnRlbnQ7XG4gICAgICAgIGZ1bmN0aW9uIHJldCh0cCwgc3R5bGUsIGNvbnQpIHtcbiAgICAgICAgICAgIHR5cGUgPSB0cDtcbiAgICAgICAgICAgIGNvbnRlbnQgPSBjb250O1xuICAgICAgICAgICAgcmV0dXJuIHN0eWxlO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHRva2VuQmFzZShzdHJlYW0sIHN0YXRlKSB7XG4gICAgICAgICAgICB2YXIgY2ggPSBzdHJlYW0ubmV4dCgpO1xuICAgICAgICAgICAgaWYgKGNoID09ICdcIicgfHwgY2ggPT0gXCInXCIpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS50b2tlbml6ZSA9IHRva2VuU3RyaW5nKGNoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGUudG9rZW5pemUoc3RyZWFtLCBzdGF0ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgIGNoID09IFwiLlwiICYmXG4gICAgICAgICAgICAgICAgc3RyZWFtLm1hdGNoKC9eXFxkW1xcZF9dKig/OltlRV1bK1xcLV0/W1xcZF9dKyk/LylcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXQoXCJudW1iZXJcIiwgXCJudW1iZXJcIik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNoID09IFwiLlwiICYmIHN0cmVhbS5tYXRjaChcIi4uXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldChcInNwcmVhZFwiLCBcIm1ldGFcIik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKC9bXFxbXFxde31cXChcXCksO1xcOlxcLl0vLnRlc3QoY2gpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldChjaCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNoID09IFwiPVwiICYmIHN0cmVhbS5lYXQoXCI+XCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldChcIj0+XCIsIFwib3BlcmF0b3JcIik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgIGNoID09IFwiMFwiICYmXG4gICAgICAgICAgICAgICAgc3RyZWFtLm1hdGNoKC9eKD86eFtcXGRBLUZhLWZfXSt8b1swLTdfXSt8YlswMV9dKyluPy8pXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0KFwibnVtYmVyXCIsIFwibnVtYmVyXCIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgvXFxkLy50ZXN0KGNoKSkge1xuICAgICAgICAgICAgICAgIHN0cmVhbS5tYXRjaChcbiAgICAgICAgICAgICAgICAgICAgL15bXFxkX10qKD86bnwoPzpcXC5bXFxkX10qKT8oPzpbZUVdWytcXC1dP1tcXGRfXSspPyk/L1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldChcIm51bWJlclwiLCBcIm51bWJlclwiKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2ggPT0gXCIvXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3RyZWFtLmVhdChcIipcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUudG9rZW5pemUgPSB0b2tlbkNvbW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0b2tlbkNvbW1lbnQoc3RyZWFtLCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdHJlYW0uZWF0KFwiL1wiKSkge1xuICAgICAgICAgICAgICAgICAgICBzdHJlYW0uc2tpcFRvRW5kKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQoXCJjb21tZW50XCIsIFwiY29tbWVudFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGV4cHJlc3Npb25BbGxvd2VkKHN0cmVhbSwgc3RhdGUsIDEpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlYWRSZWdleHAoc3RyZWFtKTtcbiAgICAgICAgICAgICAgICAgICAgc3RyZWFtLm1hdGNoKC9eXFxiKChbZ2lteXVzXSkoPyFbZ2lteXVzXSpcXDIpKStcXGIvKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldChcInJlZ2V4cFwiLCBcInN0cmluZy0yXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHN0cmVhbS5lYXQoXCI9XCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV0KFwib3BlcmF0b3JcIiwgXCJvcGVyYXRvclwiLCBzdHJlYW0uY3VycmVudCgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNoID09IFwiYFwiKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUudG9rZW5pemUgPSB0b2tlblF1YXNpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0b2tlblF1YXNpKHN0cmVhbSwgc3RhdGUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjaCA9PSBcIiNcIiAmJiBzdHJlYW0ucGVlaygpID09IFwiIVwiKSB7XG4gICAgICAgICAgICAgICAgc3RyZWFtLnNraXBUb0VuZCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXQoXCJtZXRhXCIsIFwibWV0YVwiKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2ggPT0gXCIjXCIgJiYgc3RyZWFtLmVhdFdoaWxlKHdvcmRSRSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0KFwidmFyaWFibGVcIiwgXCJwcm9wZXJ0eVwiKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgKGNoID09IFwiPFwiICYmIHN0cmVhbS5tYXRjaChcIiEtLVwiKSkgfHxcbiAgICAgICAgICAgICAgICAoY2ggPT0gXCItXCIgJiZcbiAgICAgICAgICAgICAgICAgICAgc3RyZWFtLm1hdGNoKFwiLT5cIikgJiZcbiAgICAgICAgICAgICAgICAgICAgIS9cXFMvLnRlc3Qoc3RyZWFtLnN0cmluZy5zbGljZSgwLCBzdHJlYW0uc3RhcnQpKSlcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHN0cmVhbS5za2lwVG9FbmQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0KFwiY29tbWVudFwiLCBcImNvbW1lbnRcIik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlzT3BlcmF0b3JDaGFyLnRlc3QoY2gpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoICE9IFwiPlwiIHx8ICFzdGF0ZS5sZXhpY2FsIHx8IHN0YXRlLmxleGljYWwudHlwZSAhPSBcIj5cIikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3RyZWFtLmVhdChcIj1cIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaCA9PSBcIiFcIiB8fCBjaCA9PSBcIj1cIikgc3RyZWFtLmVhdChcIj1cIik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoL1s8PiorXFwtfCY/XS8udGVzdChjaCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmVhbS5lYXQoY2gpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoID09IFwiPlwiKSBzdHJlYW0uZWF0KGNoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoY2ggPT0gXCI/XCIgJiYgc3RyZWFtLmVhdChcIi5cIikpIHJldHVybiByZXQoXCIuXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXQoXCJvcGVyYXRvclwiLCBcIm9wZXJhdG9yXCIsIHN0cmVhbS5jdXJyZW50KCkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh3b3JkUkUudGVzdChjaCkpIHtcbiAgICAgICAgICAgICAgICBzdHJlYW0uZWF0V2hpbGUod29yZFJFKTtcbiAgICAgICAgICAgICAgICB2YXIgd29yZCA9IHN0cmVhbS5jdXJyZW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlLmxhc3RUeXBlICE9IFwiLlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXl3b3Jkcy5wcm9wZXJ0eUlzRW51bWVyYWJsZSh3b3JkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGt3ID0ga2V5d29yZHNbd29yZF07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV0KGt3LnR5cGUsIGt3LnN0eWxlLCB3b3JkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICB3b3JkID09IFwiYXN5bmNcIiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyZWFtLm1hdGNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC9eKFxcc3xcXC9cXCooW14qXXxcXCooPyFcXC8pKSo/XFwqXFwvKSpbXFxbXFwoXFx3XS8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldChcImFzeW5jXCIsIFwia2V5d29yZFwiLCB3b3JkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldChcInZhcmlhYmxlXCIsIFwidmFyaWFibGVcIiwgd29yZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB0b2tlblN0cmluZyhxdW90ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChzdHJlYW0sIHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVzY2FwZWQgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgbmV4dDtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGpzb25sZE1vZGUgJiZcbiAgICAgICAgICAgICAgICAgICAgc3RyZWFtLnBlZWsoKSA9PSBcIkBcIiAmJlxuICAgICAgICAgICAgICAgICAgICBzdHJlYW0ubWF0Y2goaXNKc29ubGRLZXl3b3JkKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS50b2tlbml6ZSA9IHRva2VuQmFzZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldChcImpzb25sZC1rZXl3b3JkXCIsIFwibWV0YVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgd2hpbGUgKChuZXh0ID0gc3RyZWFtLm5leHQoKSkgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dCA9PSBxdW90ZSAmJiAhZXNjYXBlZCkgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGVzY2FwZWQgPSAhZXNjYXBlZCAmJiBuZXh0ID09IFwiXFxcXFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWVzY2FwZWQpIHN0YXRlLnRva2VuaXplID0gdG9rZW5CYXNlO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXQoXCJzdHJpbmdcIiwgXCJzdHJpbmdcIik7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdG9rZW5Db21tZW50KHN0cmVhbSwgc3RhdGUpIHtcbiAgICAgICAgICAgIHZhciBtYXliZUVuZCA9IGZhbHNlLFxuICAgICAgICAgICAgICAgIGNoO1xuICAgICAgICAgICAgd2hpbGUgKChjaCA9IHN0cmVhbS5uZXh0KCkpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoID09IFwiL1wiICYmIG1heWJlRW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLnRva2VuaXplID0gdG9rZW5CYXNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbWF5YmVFbmQgPSBjaCA9PSBcIipcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXQoXCJjb21tZW50XCIsIFwiY29tbWVudFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHRva2VuUXVhc2koc3RyZWFtLCBzdGF0ZSkge1xuICAgICAgICAgICAgdmFyIGVzY2FwZWQgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICBuZXh0O1xuICAgICAgICAgICAgd2hpbGUgKChuZXh0ID0gc3RyZWFtLm5leHQoKSkgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgIWVzY2FwZWQgJiZcbiAgICAgICAgICAgICAgICAgICAgKG5leHQgPT0gXCJgXCIgfHwgKG5leHQgPT0gXCIkXCIgJiYgc3RyZWFtLmVhdChcIntcIikpKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS50b2tlbml6ZSA9IHRva2VuQmFzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVzY2FwZWQgPSAhZXNjYXBlZCAmJiBuZXh0ID09IFwiXFxcXFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJldChcInF1YXNpXCIsIFwic3RyaW5nLTJcIiwgc3RyZWFtLmN1cnJlbnQoKSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYnJhY2tldHMgPSBcIihbe31dKVwiO1xuICAgICAgICAvLyBUaGlzIGlzIGEgY3J1ZGUgbG9va2FoZWFkIHRyaWNrIHRvIHRyeSBhbmQgbm90aWNlIHRoYXQgd2UncmVcbiAgICAgICAgLy8gcGFyc2luZyB0aGUgYXJndW1lbnQgcGF0dGVybnMgZm9yIGEgZmF0LWFycm93IGZ1bmN0aW9uIGJlZm9yZSB3ZVxuICAgICAgICAvLyBhY3R1YWxseSBoaXQgdGhlIGFycm93IHRva2VuLiBJdCBvbmx5IHdvcmtzIGlmIHRoZSBhcnJvdyBpcyBvblxuICAgICAgICAvLyB0aGUgc2FtZSBsaW5lIGFzIHRoZSBhcmd1bWVudHMgYW5kIHRoZXJlJ3Mgbm8gc3RyYW5nZSBub2lzZVxuICAgICAgICAvLyAoY29tbWVudHMpIGluIGJldHdlZW4uIEZhbGxiYWNrIGlzIHRvIG9ubHkgbm90aWNlIHdoZW4gd2UgaGl0IHRoZVxuICAgICAgICAvLyBhcnJvdywgYW5kIG5vdCBkZWNsYXJlIHRoZSBhcmd1bWVudHMgYXMgbG9jYWxzIGZvciB0aGUgYXJyb3dcbiAgICAgICAgLy8gYm9keS5cbiAgICAgICAgZnVuY3Rpb24gZmluZEZhdEFycm93KHN0cmVhbSwgc3RhdGUpIHtcbiAgICAgICAgICAgIGlmIChzdGF0ZS5mYXRBcnJvd0F0KSBzdGF0ZS5mYXRBcnJvd0F0ID0gbnVsbDtcbiAgICAgICAgICAgIHZhciBhcnJvdyA9IHN0cmVhbS5zdHJpbmcuaW5kZXhPZihcIj0+XCIsIHN0cmVhbS5zdGFydCk7XG4gICAgICAgICAgICBpZiAoYXJyb3cgPCAwKSByZXR1cm47XG5cbiAgICAgICAgICAgIGlmIChpc1RTKSB7XG4gICAgICAgICAgICAgICAgLy8gVHJ5IHRvIHNraXAgVHlwZVNjcmlwdCByZXR1cm4gdHlwZSBkZWNsYXJhdGlvbnMgYWZ0ZXIgdGhlIGFyZ3VtZW50c1xuICAgICAgICAgICAgICAgIHZhciBtID0gLzpcXHMqKD86XFx3Kyg/OjxbXj5dKj58XFxbXFxdKT98XFx7W159XSpcXH0pXFxzKiQvLmV4ZWMoXG4gICAgICAgICAgICAgICAgICAgIHN0cmVhbS5zdHJpbmcuc2xpY2Uoc3RyZWFtLnN0YXJ0LCBhcnJvdylcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGlmIChtKSBhcnJvdyA9IG0uaW5kZXg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBkZXB0aCA9IDAsXG4gICAgICAgICAgICAgICAgc2F3U29tZXRoaW5nID0gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKHZhciBwb3MgPSBhcnJvdyAtIDE7IHBvcyA+PSAwOyAtLXBvcykge1xuICAgICAgICAgICAgICAgIHZhciBjaCA9IHN0cmVhbS5zdHJpbmcuY2hhckF0KHBvcyk7XG4gICAgICAgICAgICAgICAgdmFyIGJyYWNrZXQgPSBicmFja2V0cy5pbmRleE9mKGNoKTtcbiAgICAgICAgICAgICAgICBpZiAoYnJhY2tldCA+PSAwICYmIGJyYWNrZXQgPCAzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZGVwdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICsrcG9zO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKC0tZGVwdGggPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoID09IFwiKFwiKSBzYXdTb21ldGhpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGJyYWNrZXQgPj0gMyAmJiBicmFja2V0IDwgNikge1xuICAgICAgICAgICAgICAgICAgICArK2RlcHRoO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAod29yZFJFLnRlc3QoY2gpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNhd1NvbWV0aGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgvW1wiJ1xcL2BdLy50ZXN0KGNoKSkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKDsgOyAtLXBvcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBvcyA9PSAwKSByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV4dCA9IHN0cmVhbS5zdHJpbmcuY2hhckF0KHBvcyAtIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHQgPT0gY2ggJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJlYW0uc3RyaW5nLmNoYXJBdChwb3MgLSAyKSAhPSBcIlxcXFxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zLS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNhd1NvbWV0aGluZyAmJiAhZGVwdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgKytwb3M7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzYXdTb21ldGhpbmcgJiYgIWRlcHRoKSBzdGF0ZS5mYXRBcnJvd0F0ID0gcG9zO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUGFyc2VyXG5cbiAgICAgICAgdmFyIGF0b21pY1R5cGVzID0ge1xuICAgICAgICAgICAgYXRvbTogdHJ1ZSxcbiAgICAgICAgICAgIG51bWJlcjogdHJ1ZSxcbiAgICAgICAgICAgIHZhcmlhYmxlOiB0cnVlLFxuICAgICAgICAgICAgc3RyaW5nOiB0cnVlLFxuICAgICAgICAgICAgcmVnZXhwOiB0cnVlLFxuICAgICAgICAgICAgdGhpczogdHJ1ZSxcbiAgICAgICAgICAgIGltcG9ydDogdHJ1ZSxcbiAgICAgICAgICAgIFwianNvbmxkLWtleXdvcmRcIjogdHJ1ZSxcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBKU0xleGljYWwoaW5kZW50ZWQsIGNvbHVtbiwgdHlwZSwgYWxpZ24sIHByZXYsIGluZm8pIHtcbiAgICAgICAgICAgIHRoaXMuaW5kZW50ZWQgPSBpbmRlbnRlZDtcbiAgICAgICAgICAgIHRoaXMuY29sdW1uID0gY29sdW1uO1xuICAgICAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgICAgIHRoaXMucHJldiA9IHByZXY7XG4gICAgICAgICAgICB0aGlzLmluZm8gPSBpbmZvO1xuICAgICAgICAgICAgaWYgKGFsaWduICE9IG51bGwpIHRoaXMuYWxpZ24gPSBhbGlnbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGluU2NvcGUoc3RhdGUsIHZhcm5hbWUpIHtcbiAgICAgICAgICAgIGlmICghdHJhY2tTY29wZSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgZm9yICh2YXIgdiA9IHN0YXRlLmxvY2FsVmFyczsgdjsgdiA9IHYubmV4dClcbiAgICAgICAgICAgICAgICBpZiAodi5uYW1lID09IHZhcm5hbWUpIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgZm9yICh2YXIgY3ggPSBzdGF0ZS5jb250ZXh0OyBjeDsgY3ggPSBjeC5wcmV2KSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgdiA9IGN4LnZhcnM7IHY7IHYgPSB2Lm5leHQpXG4gICAgICAgICAgICAgICAgICAgIGlmICh2Lm5hbWUgPT0gdmFybmFtZSkgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBwYXJzZUpTKHN0YXRlLCBzdHlsZSwgdHlwZSwgY29udGVudCwgc3RyZWFtKSB7XG4gICAgICAgICAgICB2YXIgY2MgPSBzdGF0ZS5jYztcbiAgICAgICAgICAgIC8vIENvbW11bmljYXRlIG91ciBjb250ZXh0IHRvIHRoZSBjb21iaW5hdG9ycy5cbiAgICAgICAgICAgIC8vIChMZXNzIHdhc3RlZnVsIHRoYW4gY29uc2luZyB1cCBhIGh1bmRyZWQgY2xvc3VyZXMgb24gZXZlcnkgY2FsbC4pXG4gICAgICAgICAgICBjeC5zdGF0ZSA9IHN0YXRlO1xuICAgICAgICAgICAgY3guc3RyZWFtID0gc3RyZWFtO1xuICAgICAgICAgICAgKGN4Lm1hcmtlZCA9IG51bGwpLCAoY3guY2MgPSBjYyk7XG4gICAgICAgICAgICBjeC5zdHlsZSA9IHN0eWxlO1xuXG4gICAgICAgICAgICBpZiAoIXN0YXRlLmxleGljYWwuaGFzT3duUHJvcGVydHkoXCJhbGlnblwiKSlcbiAgICAgICAgICAgICAgICBzdGF0ZS5sZXhpY2FsLmFsaWduID0gdHJ1ZTtcblxuICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgY29tYmluYXRvciA9IGNjLmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICA/IGNjLnBvcCgpXG4gICAgICAgICAgICAgICAgICAgIDoganNvbk1vZGVcbiAgICAgICAgICAgICAgICAgICAgPyBleHByZXNzaW9uXG4gICAgICAgICAgICAgICAgICAgIDogc3RhdGVtZW50O1xuICAgICAgICAgICAgICAgIGlmIChjb21iaW5hdG9yKHR5cGUsIGNvbnRlbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChjYy5sZW5ndGggJiYgY2NbY2MubGVuZ3RoIC0gMV0ubGV4KSBjYy5wb3AoKSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3gubWFya2VkKSByZXR1cm4gY3gubWFya2VkO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZSA9PSBcInZhcmlhYmxlXCIgJiYgaW5TY29wZShzdGF0ZSwgY29udGVudCkpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJ2YXJpYWJsZS0yXCI7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdHlsZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDb21iaW5hdG9yIHV0aWxzXG5cbiAgICAgICAgdmFyIGN4ID0geyBzdGF0ZTogbnVsbCwgY29sdW1uOiBudWxsLCBtYXJrZWQ6IG51bGwsIGNjOiBudWxsIH07XG4gICAgICAgIGZ1bmN0aW9uIHBhc3MoKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxuICAgICAgICAgICAgICAgIGN4LmNjLnB1c2goYXJndW1lbnRzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjb250KCkge1xuICAgICAgICAgICAgcGFzcy5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaW5MaXN0KG5hbWUsIGxpc3QpIHtcbiAgICAgICAgICAgIGZvciAodmFyIHYgPSBsaXN0OyB2OyB2ID0gdi5uZXh0KSBpZiAodi5uYW1lID09IG5hbWUpIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHJlZ2lzdGVyKHZhcm5hbWUpIHtcbiAgICAgICAgICAgIHZhciBzdGF0ZSA9IGN4LnN0YXRlO1xuICAgICAgICAgICAgY3gubWFya2VkID0gXCJkZWZcIjtcbiAgICAgICAgICAgIGlmICghdHJhY2tTY29wZSkgcmV0dXJuO1xuICAgICAgICAgICAgaWYgKHN0YXRlLmNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmxleGljYWwuaW5mbyA9PSBcInZhclwiICYmXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmNvbnRleHQgJiZcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuY29udGV4dC5ibG9ja1xuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAvLyBGSVhNRSBmdW5jdGlvbiBkZWNscyBhcmUgYWxzbyBub3QgYmxvY2sgc2NvcGVkXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdDb250ZXh0ID0gcmVnaXN0ZXJWYXJTY29wZWQodmFybmFtZSwgc3RhdGUuY29udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdDb250ZXh0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmNvbnRleHQgPSBuZXdDb250ZXh0O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghaW5MaXN0KHZhcm5hbWUsIHN0YXRlLmxvY2FsVmFycykpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUubG9jYWxWYXJzID0gbmV3IFZhcih2YXJuYW1lLCBzdGF0ZS5sb2NhbFZhcnMpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gRmFsbCB0aHJvdWdoIG1lYW5zIHRoaXMgaXMgZ2xvYmFsXG4gICAgICAgICAgICBpZiAocGFyc2VyQ29uZmlnLmdsb2JhbFZhcnMgJiYgIWluTGlzdCh2YXJuYW1lLCBzdGF0ZS5nbG9iYWxWYXJzKSlcbiAgICAgICAgICAgICAgICBzdGF0ZS5nbG9iYWxWYXJzID0gbmV3IFZhcih2YXJuYW1lLCBzdGF0ZS5nbG9iYWxWYXJzKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiByZWdpc3RlclZhclNjb3BlZCh2YXJuYW1lLCBjb250ZXh0KSB7XG4gICAgICAgICAgICBpZiAoIWNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5ibG9jaykge1xuICAgICAgICAgICAgICAgIHZhciBpbm5lciA9IHJlZ2lzdGVyVmFyU2NvcGVkKHZhcm5hbWUsIGNvbnRleHQucHJldik7XG4gICAgICAgICAgICAgICAgaWYgKCFpbm5lcikgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKGlubmVyID09IGNvbnRleHQucHJldikgcmV0dXJuIGNvbnRleHQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDb250ZXh0KGlubmVyLCBjb250ZXh0LnZhcnMsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpbkxpc3QodmFybmFtZSwgY29udGV4dC52YXJzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250ZXh0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IENvbnRleHQoXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQucHJldixcbiAgICAgICAgICAgICAgICAgICAgbmV3IFZhcih2YXJuYW1lLCBjb250ZXh0LnZhcnMpLFxuICAgICAgICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpc01vZGlmaWVyKG5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgbmFtZSA9PSBcInB1YmxpY1wiIHx8XG4gICAgICAgICAgICAgICAgbmFtZSA9PSBcInByaXZhdGVcIiB8fFxuICAgICAgICAgICAgICAgIG5hbWUgPT0gXCJwcm90ZWN0ZWRcIiB8fFxuICAgICAgICAgICAgICAgIG5hbWUgPT0gXCJhYnN0cmFjdFwiIHx8XG4gICAgICAgICAgICAgICAgbmFtZSA9PSBcInJlYWRvbmx5XCJcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDb21iaW5hdG9yc1xuXG4gICAgICAgIGZ1bmN0aW9uIENvbnRleHQocHJldiwgdmFycywgYmxvY2spIHtcbiAgICAgICAgICAgIHRoaXMucHJldiA9IHByZXY7XG4gICAgICAgICAgICB0aGlzLnZhcnMgPSB2YXJzO1xuICAgICAgICAgICAgdGhpcy5ibG9jayA9IGJsb2NrO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIFZhcihuYW1lLCBuZXh0KSB7XG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICAgICAgdGhpcy5uZXh0ID0gbmV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkZWZhdWx0VmFycyA9IG5ldyBWYXIoXCJ0aGlzXCIsIG5ldyBWYXIoXCJhcmd1bWVudHNcIiwgbnVsbCkpO1xuICAgICAgICBmdW5jdGlvbiBwdXNoY29udGV4dCgpIHtcbiAgICAgICAgICAgIGN4LnN0YXRlLmNvbnRleHQgPSBuZXcgQ29udGV4dChcbiAgICAgICAgICAgICAgICBjeC5zdGF0ZS5jb250ZXh0LFxuICAgICAgICAgICAgICAgIGN4LnN0YXRlLmxvY2FsVmFycyxcbiAgICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGN4LnN0YXRlLmxvY2FsVmFycyA9IGRlZmF1bHRWYXJzO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHB1c2hibG9ja2NvbnRleHQoKSB7XG4gICAgICAgICAgICBjeC5zdGF0ZS5jb250ZXh0ID0gbmV3IENvbnRleHQoXG4gICAgICAgICAgICAgICAgY3guc3RhdGUuY29udGV4dCxcbiAgICAgICAgICAgICAgICBjeC5zdGF0ZS5sb2NhbFZhcnMsXG4gICAgICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGN4LnN0YXRlLmxvY2FsVmFycyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gcG9wY29udGV4dCgpIHtcbiAgICAgICAgICAgIGN4LnN0YXRlLmxvY2FsVmFycyA9IGN4LnN0YXRlLmNvbnRleHQudmFycztcbiAgICAgICAgICAgIGN4LnN0YXRlLmNvbnRleHQgPSBjeC5zdGF0ZS5jb250ZXh0LnByZXY7XG4gICAgICAgIH1cbiAgICAgICAgcG9wY29udGV4dC5sZXggPSB0cnVlO1xuICAgICAgICBmdW5jdGlvbiBwdXNobGV4KHR5cGUsIGluZm8pIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gY3guc3RhdGUsXG4gICAgICAgICAgICAgICAgICAgIGluZGVudCA9IHN0YXRlLmluZGVudGVkO1xuICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5sZXhpY2FsLnR5cGUgPT0gXCJzdGF0XCIpXG4gICAgICAgICAgICAgICAgICAgIGluZGVudCA9IHN0YXRlLmxleGljYWwuaW5kZW50ZWQ7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBmb3IgKFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG91dGVyID0gc3RhdGUubGV4aWNhbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dGVyICYmIG91dGVyLnR5cGUgPT0gXCIpXCIgJiYgb3V0ZXIuYWxpZ247XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRlciA9IG91dGVyLnByZXZcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZW50ID0gb3V0ZXIuaW5kZW50ZWQ7XG4gICAgICAgICAgICAgICAgc3RhdGUubGV4aWNhbCA9IG5ldyBKU0xleGljYWwoXG4gICAgICAgICAgICAgICAgICAgIGluZGVudCxcbiAgICAgICAgICAgICAgICAgICAgY3guc3RyZWFtLmNvbHVtbigpLFxuICAgICAgICAgICAgICAgICAgICB0eXBlLFxuICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5sZXhpY2FsLFxuICAgICAgICAgICAgICAgICAgICBpbmZvXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXN1bHQubGV4ID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gcG9wbGV4KCkge1xuICAgICAgICAgICAgdmFyIHN0YXRlID0gY3guc3RhdGU7XG4gICAgICAgICAgICBpZiAoc3RhdGUubGV4aWNhbC5wcmV2KSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlLmxleGljYWwudHlwZSA9PSBcIilcIilcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuaW5kZW50ZWQgPSBzdGF0ZS5sZXhpY2FsLmluZGVudGVkO1xuICAgICAgICAgICAgICAgIHN0YXRlLmxleGljYWwgPSBzdGF0ZS5sZXhpY2FsLnByZXY7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcG9wbGV4LmxleCA9IHRydWU7XG5cbiAgICAgICAgZnVuY3Rpb24gZXhwZWN0KHdhbnRlZCkge1xuICAgICAgICAgICAgZnVuY3Rpb24gZXhwKHR5cGUpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZSA9PSB3YW50ZWQpIHJldHVybiBjb250KCk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHdhbnRlZCA9PSBcIjtcIiB8fFxuICAgICAgICAgICAgICAgICAgICB0eXBlID09IFwifVwiIHx8XG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPT0gXCIpXCIgfHxcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9PSBcIl1cIlxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhc3MoKTtcbiAgICAgICAgICAgICAgICBlbHNlIHJldHVybiBjb250KGV4cCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZXhwO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc3RhdGVtZW50KHR5cGUsIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcInZhclwiKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250KFxuICAgICAgICAgICAgICAgICAgICBwdXNobGV4KFwidmFyZGVmXCIsIHZhbHVlKSxcbiAgICAgICAgICAgICAgICAgICAgdmFyZGVmLFxuICAgICAgICAgICAgICAgICAgICBleHBlY3QoXCI7XCIpLFxuICAgICAgICAgICAgICAgICAgICBwb3BsZXhcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJrZXl3b3JkIGFcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChwdXNobGV4KFwiZm9ybVwiKSwgcGFyZW5FeHByLCBzdGF0ZW1lbnQsIHBvcGxleCk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcImtleXdvcmQgYlwiKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250KHB1c2hsZXgoXCJmb3JtXCIpLCBzdGF0ZW1lbnQsIHBvcGxleCk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcImtleXdvcmQgZFwiKVxuICAgICAgICAgICAgICAgIHJldHVybiBjeC5zdHJlYW0ubWF0Y2goL15cXHMqJC8sIGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICA/IGNvbnQoKVxuICAgICAgICAgICAgICAgICAgICA6IGNvbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hsZXgoXCJzdGF0XCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBtYXliZWV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdChcIjtcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHBvcGxleFxuICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcImRlYnVnZ2VyXCIpIHJldHVybiBjb250KGV4cGVjdChcIjtcIikpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ7XCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoXG4gICAgICAgICAgICAgICAgICAgIHB1c2hsZXgoXCJ9XCIpLFxuICAgICAgICAgICAgICAgICAgICBwdXNoYmxvY2tjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgICBibG9jayxcbiAgICAgICAgICAgICAgICAgICAgcG9wbGV4LFxuICAgICAgICAgICAgICAgICAgICBwb3Bjb250ZXh0XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiO1wiKSByZXR1cm4gY29udCgpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJpZlwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBjeC5zdGF0ZS5sZXhpY2FsLmluZm8gPT0gXCJlbHNlXCIgJiZcbiAgICAgICAgICAgICAgICAgICAgY3guc3RhdGUuY2NbY3guc3RhdGUuY2MubGVuZ3RoIC0gMV0gPT0gcG9wbGV4XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICBjeC5zdGF0ZS5jYy5wb3AoKSgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KFxuICAgICAgICAgICAgICAgICAgICBwdXNobGV4KFwiZm9ybVwiKSxcbiAgICAgICAgICAgICAgICAgICAgcGFyZW5FeHByLFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgIHBvcGxleCxcbiAgICAgICAgICAgICAgICAgICAgbWF5YmVlbHNlXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGNvbnQoZnVuY3Rpb25kZWYpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJmb3JcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChcbiAgICAgICAgICAgICAgICAgICAgcHVzaGxleChcImZvcm1cIiksXG4gICAgICAgICAgICAgICAgICAgIHB1c2hibG9ja2NvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgIGZvcnNwZWMsXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgcG9wY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgcG9wbGV4XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiY2xhc3NcIiB8fCAoaXNUUyAmJiB2YWx1ZSA9PSBcImludGVyZmFjZVwiKSkge1xuICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KFxuICAgICAgICAgICAgICAgICAgICBwdXNobGV4KFwiZm9ybVwiLCB0eXBlID09IFwiY2xhc3NcIiA/IHR5cGUgOiB2YWx1ZSksXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgcG9wbGV4XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlID09IFwidmFyaWFibGVcIikge1xuICAgICAgICAgICAgICAgIGlmIChpc1RTICYmIHZhbHVlID09IFwiZGVjbGFyZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udChzdGF0ZW1lbnQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGlzVFMgJiZcbiAgICAgICAgICAgICAgICAgICAgKHZhbHVlID09IFwibW9kdWxlXCIgfHwgdmFsdWUgPT0gXCJlbnVtXCIgfHwgdmFsdWUgPT0gXCJ0eXBlXCIpICYmXG4gICAgICAgICAgICAgICAgICAgIGN4LnN0cmVhbS5tYXRjaCgvXlxccypcXHcvLCBmYWxzZSlcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcImVudW1cIikgcmV0dXJuIGNvbnQoZW51bWRlZik7XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHZhbHVlID09IFwidHlwZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0KFwib3BlcmF0b3JcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZWV4cHIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0KFwiO1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHVzaGxleChcImZvcm1cIiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0dGVybixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBlY3QoXCJ7XCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hsZXgoXCJ9XCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcGxleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3BsZXhcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpc1RTICYmIHZhbHVlID09IFwibmFtZXNwYWNlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250KHB1c2hsZXgoXCJmb3JtXCIpLCBleHByZXNzaW9uLCBzdGF0ZW1lbnQsIHBvcGxleCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpc1RTICYmIHZhbHVlID09IFwiYWJzdHJhY3RcIikge1xuICAgICAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoc3RhdGVtZW50KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udChwdXNobGV4KFwic3RhdFwiKSwgbWF5YmVsYWJlbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJzd2l0Y2hcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChcbiAgICAgICAgICAgICAgICAgICAgcHVzaGxleChcImZvcm1cIiksXG4gICAgICAgICAgICAgICAgICAgIHBhcmVuRXhwcixcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KFwie1wiKSxcbiAgICAgICAgICAgICAgICAgICAgcHVzaGxleChcIn1cIiwgXCJzd2l0Y2hcIiksXG4gICAgICAgICAgICAgICAgICAgIHB1c2hibG9ja2NvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLFxuICAgICAgICAgICAgICAgICAgICBwb3BsZXgsXG4gICAgICAgICAgICAgICAgICAgIHBvcGxleCxcbiAgICAgICAgICAgICAgICAgICAgcG9wY29udGV4dFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcImNhc2VcIikgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbiwgZXhwZWN0KFwiOlwiKSk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcImRlZmF1bHRcIikgcmV0dXJuIGNvbnQoZXhwZWN0KFwiOlwiKSk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcImNhdGNoXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoXG4gICAgICAgICAgICAgICAgICAgIHB1c2hsZXgoXCJmb3JtXCIpLFxuICAgICAgICAgICAgICAgICAgICBwdXNoY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgbWF5YmVDYXRjaEJpbmRpbmcsXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgcG9wbGV4LFxuICAgICAgICAgICAgICAgICAgICBwb3Bjb250ZXh0XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiZXhwb3J0XCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQocHVzaGxleChcInN0YXRcIiksIGFmdGVyRXhwb3J0LCBwb3BsZXgpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJpbXBvcnRcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChwdXNobGV4KFwic3RhdFwiKSwgYWZ0ZXJJbXBvcnQsIHBvcGxleCk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcImFzeW5jXCIpIHJldHVybiBjb250KHN0YXRlbWVudCk7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gXCJAXCIpIHJldHVybiBjb250KGV4cHJlc3Npb24sIHN0YXRlbWVudCk7XG4gICAgICAgICAgICByZXR1cm4gcGFzcyhwdXNobGV4KFwic3RhdFwiKSwgZXhwcmVzc2lvbiwgZXhwZWN0KFwiO1wiKSwgcG9wbGV4KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBtYXliZUNhdGNoQmluZGluZyh0eXBlKSB7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIihcIikgcmV0dXJuIGNvbnQoZnVuYXJnLCBleHBlY3QoXCIpXCIpKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBleHByZXNzaW9uKHR5cGUsIHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gZXhwcmVzc2lvbklubmVyKHR5cGUsIHZhbHVlLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZXhwcmVzc2lvbk5vQ29tbWEodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBleHByZXNzaW9uSW5uZXIodHlwZSwgdmFsdWUsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHBhcmVuRXhwcih0eXBlKSB7XG4gICAgICAgICAgICBpZiAodHlwZSAhPSBcIihcIikgcmV0dXJuIHBhc3MoKTtcbiAgICAgICAgICAgIHJldHVybiBjb250KHB1c2hsZXgoXCIpXCIpLCBtYXliZWV4cHJlc3Npb24sIGV4cGVjdChcIilcIiksIHBvcGxleCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZXhwcmVzc2lvbklubmVyKHR5cGUsIHZhbHVlLCBub0NvbW1hKSB7XG4gICAgICAgICAgICBpZiAoY3guc3RhdGUuZmF0QXJyb3dBdCA9PSBjeC5zdHJlYW0uc3RhcnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgYm9keSA9IG5vQ29tbWEgPyBhcnJvd0JvZHlOb0NvbW1hIDogYXJyb3dCb2R5O1xuICAgICAgICAgICAgICAgIGlmICh0eXBlID09IFwiKFwiKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udChcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcHVzaGxleChcIilcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tYXNlcChmdW5hcmcsIFwiKVwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcGxleCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdChcIj0+XCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm9keSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcGNvbnRleHRcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlID09IFwidmFyaWFibGVcIilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhc3MoXG4gICAgICAgICAgICAgICAgICAgICAgICBwdXNoY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdHRlcm4sXG4gICAgICAgICAgICAgICAgICAgICAgICBleHBlY3QoXCI9PlwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvZHksXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3Bjb250ZXh0XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBtYXliZW9wID0gbm9Db21tYSA/IG1heWJlb3BlcmF0b3JOb0NvbW1hIDogbWF5YmVvcGVyYXRvckNvbW1hO1xuICAgICAgICAgICAgaWYgKGF0b21pY1R5cGVzLmhhc093blByb3BlcnR5KHR5cGUpKSByZXR1cm4gY29udChtYXliZW9wKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGNvbnQoZnVuY3Rpb25kZWYsIG1heWJlb3ApO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJjbGFzc1wiIHx8IChpc1RTICYmIHZhbHVlID09IFwiaW50ZXJmYWNlXCIpKSB7XG4gICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQocHVzaGxleChcImZvcm1cIiksIGNsYXNzRXhwcmVzc2lvbiwgcG9wbGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlID09IFwia2V5d29yZCBjXCIgfHwgdHlwZSA9PSBcImFzeW5jXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQobm9Db21tYSA/IGV4cHJlc3Npb25Ob0NvbW1hIDogZXhwcmVzc2lvbik7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIihcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChcbiAgICAgICAgICAgICAgICAgICAgcHVzaGxleChcIilcIiksXG4gICAgICAgICAgICAgICAgICAgIG1heWJlZXhwcmVzc2lvbixcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KFwiKVwiKSxcbiAgICAgICAgICAgICAgICAgICAgcG9wbGV4LFxuICAgICAgICAgICAgICAgICAgICBtYXliZW9wXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwib3BlcmF0b3JcIiB8fCB0eXBlID09IFwic3ByZWFkXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQobm9Db21tYSA/IGV4cHJlc3Npb25Ob0NvbW1hIDogZXhwcmVzc2lvbik7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIltcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChwdXNobGV4KFwiXVwiKSwgYXJyYXlMaXRlcmFsLCBwb3BsZXgsIG1heWJlb3ApO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ7XCIpIHJldHVybiBjb250Q29tbWFzZXAob2JqcHJvcCwgXCJ9XCIsIG51bGwsIG1heWJlb3ApO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJxdWFzaVwiKSByZXR1cm4gcGFzcyhxdWFzaSwgbWF5YmVvcCk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIm5ld1wiKSByZXR1cm4gY29udChtYXliZVRhcmdldChub0NvbW1hKSk7XG4gICAgICAgICAgICByZXR1cm4gY29udCgpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIG1heWJlZXhwcmVzc2lvbih0eXBlKSB7XG4gICAgICAgICAgICBpZiAodHlwZS5tYXRjaCgvWztcXH1cXClcXF0sXS8pKSByZXR1cm4gcGFzcygpO1xuICAgICAgICAgICAgcmV0dXJuIHBhc3MoZXhwcmVzc2lvbik7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBtYXliZW9wZXJhdG9yQ29tbWEodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiLFwiKSByZXR1cm4gY29udChtYXliZWV4cHJlc3Npb24pO1xuICAgICAgICAgICAgcmV0dXJuIG1heWJlb3BlcmF0b3JOb0NvbW1hKHR5cGUsIHZhbHVlLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gbWF5YmVvcGVyYXRvck5vQ29tbWEodHlwZSwgdmFsdWUsIG5vQ29tbWEpIHtcbiAgICAgICAgICAgIHZhciBtZSA9XG4gICAgICAgICAgICAgICAgbm9Db21tYSA9PSBmYWxzZSA/IG1heWJlb3BlcmF0b3JDb21tYSA6IG1heWJlb3BlcmF0b3JOb0NvbW1hO1xuICAgICAgICAgICAgdmFyIGV4cHIgPSBub0NvbW1hID09IGZhbHNlID8gZXhwcmVzc2lvbiA6IGV4cHJlc3Npb25Ob0NvbW1hO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCI9PlwiKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250KFxuICAgICAgICAgICAgICAgICAgICBwdXNoY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgbm9Db21tYSA/IGFycm93Qm9keU5vQ29tbWEgOiBhcnJvd0JvZHksXG4gICAgICAgICAgICAgICAgICAgIHBvcGNvbnRleHRcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJvcGVyYXRvclwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKC9cXCtcXCt8LS0vLnRlc3QodmFsdWUpIHx8IChpc1RTICYmIHZhbHVlID09IFwiIVwiKSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQobWUpO1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgaXNUUyAmJlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9PSBcIjxcIiAmJlxuICAgICAgICAgICAgICAgICAgICBjeC5zdHJlYW0ubWF0Y2goL14oW148Pl18PFtePD5dKj4pKj5cXHMqXFwoLywgZmFsc2UpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udChcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hsZXgoXCI+XCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWFzZXAodHlwZWV4cHIsIFwiPlwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcGxleCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiP1wiKSByZXR1cm4gY29udChleHByZXNzaW9uLCBleHBlY3QoXCI6XCIpLCBleHByKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChleHByKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlID09IFwicXVhc2lcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXNzKHF1YXNpLCBtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIjtcIikgcmV0dXJuO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCIoXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRDb21tYXNlcChleHByZXNzaW9uTm9Db21tYSwgXCIpXCIsIFwiY2FsbFwiLCBtZSk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIi5cIikgcmV0dXJuIGNvbnQocHJvcGVydHksIG1lKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiW1wiKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250KFxuICAgICAgICAgICAgICAgICAgICBwdXNobGV4KFwiXVwiKSxcbiAgICAgICAgICAgICAgICAgICAgbWF5YmVleHByZXNzaW9uLFxuICAgICAgICAgICAgICAgICAgICBleHBlY3QoXCJdXCIpLFxuICAgICAgICAgICAgICAgICAgICBwb3BsZXgsXG4gICAgICAgICAgICAgICAgICAgIG1lXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChpc1RTICYmIHZhbHVlID09IFwiYXNcIikge1xuICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KHR5cGVleHByLCBtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcInJlZ2V4cFwiKSB7XG4gICAgICAgICAgICAgICAgY3guc3RhdGUubGFzdFR5cGUgPSBjeC5tYXJrZWQgPSBcIm9wZXJhdG9yXCI7XG4gICAgICAgICAgICAgICAgY3guc3RyZWFtLmJhY2tVcChjeC5zdHJlYW0ucG9zIC0gY3guc3RyZWFtLnN0YXJ0IC0gMSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoZXhwcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gcXVhc2kodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlICE9IFwicXVhc2lcIikgcmV0dXJuIHBhc3MoKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZS5zbGljZSh2YWx1ZS5sZW5ndGggLSAyKSAhPSBcIiR7XCIpIHJldHVybiBjb250KHF1YXNpKTtcbiAgICAgICAgICAgIHJldHVybiBjb250KG1heWJlZXhwcmVzc2lvbiwgY29udGludWVRdWFzaSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY29udGludWVRdWFzaSh0eXBlKSB7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIn1cIikge1xuICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwic3RyaW5nLTJcIjtcbiAgICAgICAgICAgICAgICBjeC5zdGF0ZS50b2tlbml6ZSA9IHRva2VuUXVhc2k7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQocXVhc2kpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGFycm93Qm9keSh0eXBlKSB7XG4gICAgICAgICAgICBmaW5kRmF0QXJyb3coY3guc3RyZWFtLCBjeC5zdGF0ZSk7XG4gICAgICAgICAgICByZXR1cm4gcGFzcyh0eXBlID09IFwie1wiID8gc3RhdGVtZW50IDogZXhwcmVzc2lvbik7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gYXJyb3dCb2R5Tm9Db21tYSh0eXBlKSB7XG4gICAgICAgICAgICBmaW5kRmF0QXJyb3coY3guc3RyZWFtLCBjeC5zdGF0ZSk7XG4gICAgICAgICAgICByZXR1cm4gcGFzcyh0eXBlID09IFwie1wiID8gc3RhdGVtZW50IDogZXhwcmVzc2lvbk5vQ29tbWEpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIG1heWJlVGFyZ2V0KG5vQ29tbWEpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAodHlwZSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlID09IFwiLlwiKSByZXR1cm4gY29udChub0NvbW1hID8gdGFyZ2V0Tm9Db21tYSA6IHRhcmdldCk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZSA9PSBcInZhcmlhYmxlXCIgJiYgaXNUUylcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXliZVR5cGVBcmdzLFxuICAgICAgICAgICAgICAgICAgICAgICAgbm9Db21tYSA/IG1heWJlb3BlcmF0b3JOb0NvbW1hIDogbWF5YmVvcGVyYXRvckNvbW1hXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gcGFzcyhub0NvbW1hID8gZXhwcmVzc2lvbk5vQ29tbWEgOiBleHByZXNzaW9uKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gdGFyZ2V0KF8sIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gXCJ0YXJnZXRcIikge1xuICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KG1heWJlb3BlcmF0b3JDb21tYSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gdGFyZ2V0Tm9Db21tYShfLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwidGFyZ2V0XCIpIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChtYXliZW9wZXJhdG9yTm9Db21tYSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gbWF5YmVsYWJlbCh0eXBlKSB7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIjpcIikgcmV0dXJuIGNvbnQocG9wbGV4LCBzdGF0ZW1lbnQpO1xuICAgICAgICAgICAgcmV0dXJuIHBhc3MobWF5YmVvcGVyYXRvckNvbW1hLCBleHBlY3QoXCI7XCIpLCBwb3BsZXgpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHByb3BlcnR5KHR5cGUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwidmFyaWFibGVcIikge1xuICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwicHJvcGVydHlcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIG9ianByb3AodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiYXN5bmNcIikge1xuICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwicHJvcGVydHlcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChvYmpwcm9wKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcInZhcmlhYmxlXCIgfHwgY3guc3R5bGUgPT0gXCJrZXl3b3JkXCIpIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcInByb3BlcnR5XCI7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiZ2V0XCIgfHwgdmFsdWUgPT0gXCJzZXRcIikgcmV0dXJuIGNvbnQoZ2V0dGVyU2V0dGVyKTtcbiAgICAgICAgICAgICAgICB2YXIgbTsgLy8gV29yayBhcm91bmQgZmF0LWFycm93LWRldGVjdGlvbiBjb21wbGljYXRpb24gZm9yIGRldGVjdGluZyB0eXBlc2NyaXB0IHR5cGVkIGFycm93IHBhcmFtc1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgaXNUUyAmJlxuICAgICAgICAgICAgICAgICAgICBjeC5zdGF0ZS5mYXRBcnJvd0F0ID09IGN4LnN0cmVhbS5zdGFydCAmJlxuICAgICAgICAgICAgICAgICAgICAobSA9IGN4LnN0cmVhbS5tYXRjaCgvXlxccyo6XFxzKi8sIGZhbHNlKSlcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIGN4LnN0YXRlLmZhdEFycm93QXQgPSBjeC5zdHJlYW0ucG9zICsgbVswXS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoYWZ0ZXJwcm9wKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcIm51bWJlclwiIHx8IHR5cGUgPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IGpzb25sZE1vZGUgPyBcInByb3BlcnR5XCIgOiBjeC5zdHlsZSArIFwiIHByb3BlcnR5XCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoYWZ0ZXJwcm9wKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcImpzb25sZC1rZXl3b3JkXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChhZnRlcnByb3ApO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpc1RTICYmIGlzTW9kaWZpZXIodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQob2JqcHJvcCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJbXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChleHByZXNzaW9uLCBtYXliZXR5cGUsIGV4cGVjdChcIl1cIiksIGFmdGVycHJvcCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJzcHJlYWRcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KGV4cHJlc3Npb25Ob0NvbW1hLCBhZnRlcnByb3ApO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PSBcIipcIikge1xuICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KG9ianByb3ApO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiOlwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhc3MoYWZ0ZXJwcm9wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBnZXR0ZXJTZXR0ZXIodHlwZSkge1xuICAgICAgICAgICAgaWYgKHR5cGUgIT0gXCJ2YXJpYWJsZVwiKSByZXR1cm4gcGFzcyhhZnRlcnByb3ApO1xuICAgICAgICAgICAgY3gubWFya2VkID0gXCJwcm9wZXJ0eVwiO1xuICAgICAgICAgICAgcmV0dXJuIGNvbnQoZnVuY3Rpb25kZWYpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGFmdGVycHJvcCh0eXBlKSB7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIjpcIikgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbk5vQ29tbWEpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCIoXCIpIHJldHVybiBwYXNzKGZ1bmN0aW9uZGVmKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjb21tYXNlcCh3aGF0LCBlbmQsIHNlcCkge1xuICAgICAgICAgICAgZnVuY3Rpb24gcHJvY2VlZCh0eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChzZXAgPyBzZXAuaW5kZXhPZih0eXBlKSA+IC0xIDogdHlwZSA9PSBcIixcIikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGV4ID0gY3guc3RhdGUubGV4aWNhbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxleC5pbmZvID09IFwiY2FsbFwiKSBsZXgucG9zID0gKGxleC5wb3MgfHwgMCkgKyAxO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udChmdW5jdGlvbiAodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09IGVuZCB8fCB2YWx1ZSA9PSBlbmQpIHJldHVybiBwYXNzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFzcyh3aGF0KTtcbiAgICAgICAgICAgICAgICAgICAgfSwgcHJvY2VlZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlID09IGVuZCB8fCB2YWx1ZSA9PSBlbmQpIHJldHVybiBjb250KCk7XG4gICAgICAgICAgICAgICAgaWYgKHNlcCAmJiBzZXAuaW5kZXhPZihcIjtcIikgPiAtMSkgcmV0dXJuIHBhc3Mod2hhdCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoZXhwZWN0KGVuZCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlID09IGVuZCB8fCB2YWx1ZSA9PSBlbmQpIHJldHVybiBjb250KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhc3Mod2hhdCwgcHJvY2VlZCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGNvbnRDb21tYXNlcCh3aGF0LCBlbmQsIGluZm8pIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAzOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSBjeC5jYy5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gICAgICAgICAgICByZXR1cm4gY29udChwdXNobGV4KGVuZCwgaW5mbyksIGNvbW1hc2VwKHdoYXQsIGVuZCksIHBvcGxleCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gYmxvY2sodHlwZSkge1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ9XCIpIHJldHVybiBjb250KCk7XG4gICAgICAgICAgICByZXR1cm4gcGFzcyhzdGF0ZW1lbnQsIGJsb2NrKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBtYXliZXR5cGUodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChpc1RTKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCI6XCIpIHJldHVybiBjb250KHR5cGVleHByKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT0gXCI/XCIpIHJldHVybiBjb250KG1heWJldHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gbWF5YmV0eXBlT3JJbih0eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKGlzVFMgJiYgKHR5cGUgPT0gXCI6XCIgfHwgdmFsdWUgPT0gXCJpblwiKSkgcmV0dXJuIGNvbnQodHlwZWV4cHIpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIG1heWJlcmV0dHlwZSh0eXBlKSB7XG4gICAgICAgICAgICBpZiAoaXNUUyAmJiB0eXBlID09IFwiOlwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGN4LnN0cmVhbS5tYXRjaCgvXlxccypcXHcrXFxzK2lzXFxiLywgZmFsc2UpKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udChleHByZXNzaW9uLCBpc0tXLCB0eXBlZXhwcik7XG4gICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gY29udCh0eXBlZXhwcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaXNLVyhfLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiaXNcIikge1xuICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gdHlwZWV4cHIodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB2YWx1ZSA9PSBcImtleW9mXCIgfHxcbiAgICAgICAgICAgICAgICB2YWx1ZSA9PSBcInR5cGVvZlwiIHx8XG4gICAgICAgICAgICAgICAgdmFsdWUgPT0gXCJpbmZlclwiIHx8XG4gICAgICAgICAgICAgICAgdmFsdWUgPT0gXCJyZWFkb25seVwiXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udCh2YWx1ZSA9PSBcInR5cGVvZlwiID8gZXhwcmVzc2lvbk5vQ29tbWEgOiB0eXBlZXhwcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcInZhcmlhYmxlXCIgfHwgdmFsdWUgPT0gXCJ2b2lkXCIpIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcInR5cGVcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChhZnRlclR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwifFwiIHx8IHZhbHVlID09IFwiJlwiKSByZXR1cm4gY29udCh0eXBlZXhwcik7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcInN0cmluZ1wiIHx8IHR5cGUgPT0gXCJudW1iZXJcIiB8fCB0eXBlID09IFwiYXRvbVwiKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250KGFmdGVyVHlwZSk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIltcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChcbiAgICAgICAgICAgICAgICAgICAgcHVzaGxleChcIl1cIiksXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hc2VwKHR5cGVleHByLCBcIl1cIiwgXCIsXCIpLFxuICAgICAgICAgICAgICAgICAgICBwb3BsZXgsXG4gICAgICAgICAgICAgICAgICAgIGFmdGVyVHlwZVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIntcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChwdXNobGV4KFwifVwiKSwgdHlwZXByb3BzLCBwb3BsZXgsIGFmdGVyVHlwZSk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIihcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChjb21tYXNlcCh0eXBlYXJnLCBcIilcIiksIG1heWJlUmV0dXJuVHlwZSwgYWZ0ZXJUeXBlKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiPFwiKSByZXR1cm4gY29udChjb21tYXNlcCh0eXBlZXhwciwgXCI+XCIpLCB0eXBlZXhwcik7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcInF1YXNpXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFzcyhxdWFzaVR5cGUsIGFmdGVyVHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gbWF5YmVSZXR1cm5UeXBlKHR5cGUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiPT5cIikgcmV0dXJuIGNvbnQodHlwZWV4cHIpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHR5cGVwcm9wcyh0eXBlKSB7XG4gICAgICAgICAgICBpZiAodHlwZS5tYXRjaCgvW1xcfVxcKVxcXV0vKSkgcmV0dXJuIGNvbnQoKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiLFwiIHx8IHR5cGUgPT0gXCI7XCIpIHJldHVybiBjb250KHR5cGVwcm9wcyk7XG4gICAgICAgICAgICByZXR1cm4gcGFzcyh0eXBlcHJvcCwgdHlwZXByb3BzKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiB0eXBlcHJvcCh0eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ2YXJpYWJsZVwiIHx8IGN4LnN0eWxlID09IFwia2V5d29yZFwiKSB7XG4gICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJwcm9wZXJ0eVwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KHR5cGVwcm9wKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT0gXCI/XCIgfHwgdHlwZSA9PSBcIm51bWJlclwiIHx8IHR5cGUgPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KHR5cGVwcm9wKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcIjpcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KHR5cGVleHByKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcIltcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KFxuICAgICAgICAgICAgICAgICAgICBleHBlY3QoXCJ2YXJpYWJsZVwiKSxcbiAgICAgICAgICAgICAgICAgICAgbWF5YmV0eXBlT3JJbixcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KFwiXVwiKSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZXByb3BcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiKFwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhc3MoZnVuY3Rpb25kZWNsLCB0eXBlcHJvcCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCF0eXBlLm1hdGNoKC9bO1xcfVxcKVxcXSxdLykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHF1YXNpVHlwZSh0eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHR5cGUgIT0gXCJxdWFzaVwiKSByZXR1cm4gcGFzcygpO1xuICAgICAgICAgICAgaWYgKHZhbHVlLnNsaWNlKHZhbHVlLmxlbmd0aCAtIDIpICE9IFwiJHtcIikgcmV0dXJuIGNvbnQocXVhc2lUeXBlKTtcbiAgICAgICAgICAgIHJldHVybiBjb250KHR5cGVleHByLCBjb250aW51ZVF1YXNpVHlwZSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY29udGludWVRdWFzaVR5cGUodHlwZSkge1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ9XCIpIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcInN0cmluZy0yXCI7XG4gICAgICAgICAgICAgICAgY3guc3RhdGUudG9rZW5pemUgPSB0b2tlblF1YXNpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KHF1YXNpVHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gdHlwZWFyZyh0eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICh0eXBlID09IFwidmFyaWFibGVcIiAmJiBjeC5zdHJlYW0ubWF0Y2goL15cXHMqWz86XS8sIGZhbHNlKSkgfHxcbiAgICAgICAgICAgICAgICB2YWx1ZSA9PSBcIj9cIlxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250KHR5cGVhcmcpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCI6XCIpIHJldHVybiBjb250KHR5cGVleHByKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwic3ByZWFkXCIpIHJldHVybiBjb250KHR5cGVhcmcpO1xuICAgICAgICAgICAgcmV0dXJuIHBhc3ModHlwZWV4cHIpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGFmdGVyVHlwZSh0eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiPFwiKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250KFxuICAgICAgICAgICAgICAgICAgICBwdXNobGV4KFwiPlwiKSxcbiAgICAgICAgICAgICAgICAgICAgY29tbWFzZXAodHlwZWV4cHIsIFwiPlwiKSxcbiAgICAgICAgICAgICAgICAgICAgcG9wbGV4LFxuICAgICAgICAgICAgICAgICAgICBhZnRlclR5cGVcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwifFwiIHx8IHR5cGUgPT0gXCIuXCIgfHwgdmFsdWUgPT0gXCImXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQodHlwZWV4cHIpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJbXCIpIHJldHVybiBjb250KHR5cGVleHByLCBleHBlY3QoXCJdXCIpLCBhZnRlclR5cGUpO1xuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiZXh0ZW5kc1wiIHx8IHZhbHVlID09IFwiaW1wbGVtZW50c1wiKSB7XG4gICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQodHlwZWV4cHIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiP1wiKSByZXR1cm4gY29udCh0eXBlZXhwciwgZXhwZWN0KFwiOlwiKSwgdHlwZWV4cHIpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIG1heWJlVHlwZUFyZ3MoXywgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcIjxcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChcbiAgICAgICAgICAgICAgICAgICAgcHVzaGxleChcIj5cIiksXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hc2VwKHR5cGVleHByLCBcIj5cIiksXG4gICAgICAgICAgICAgICAgICAgIHBvcGxleCxcbiAgICAgICAgICAgICAgICAgICAgYWZ0ZXJUeXBlXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiB0eXBlcGFyYW0oKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFzcyh0eXBlZXhwciwgbWF5YmVUeXBlRGVmYXVsdCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gbWF5YmVUeXBlRGVmYXVsdChfLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiPVwiKSByZXR1cm4gY29udCh0eXBlZXhwcik7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gdmFyZGVmKF8sIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gXCJlbnVtXCIpIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChlbnVtZGVmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwYXNzKHBhdHRlcm4sIG1heWJldHlwZSwgbWF5YmVBc3NpZ24sIHZhcmRlZkNvbnQpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHBhdHRlcm4odHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChpc1RTICYmIGlzTW9kaWZpZXIodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQocGF0dGVybik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcInZhcmlhYmxlXCIpIHtcbiAgICAgICAgICAgICAgICByZWdpc3Rlcih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlID09IFwic3ByZWFkXCIpIHJldHVybiBjb250KHBhdHRlcm4pO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJbXCIpIHJldHVybiBjb250Q29tbWFzZXAoZWx0cGF0dGVybiwgXCJdXCIpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ7XCIpIHJldHVybiBjb250Q29tbWFzZXAocHJvcHBhdHRlcm4sIFwifVwiKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBwcm9wcGF0dGVybih0eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ2YXJpYWJsZVwiICYmICFjeC5zdHJlYW0ubWF0Y2goL15cXHMqOi8sIGZhbHNlKSkge1xuICAgICAgICAgICAgICAgIHJlZ2lzdGVyKHZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChtYXliZUFzc2lnbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcInZhcmlhYmxlXCIpIGN4Lm1hcmtlZCA9IFwicHJvcGVydHlcIjtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwic3ByZWFkXCIpIHJldHVybiBjb250KHBhdHRlcm4pO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ9XCIpIHJldHVybiBwYXNzKCk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIltcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChleHByZXNzaW9uLCBleHBlY3QoXCJdXCIpLCBleHBlY3QoXCI6XCIpLCBwcm9wcGF0dGVybik7XG4gICAgICAgICAgICByZXR1cm4gY29udChleHBlY3QoXCI6XCIpLCBwYXR0ZXJuLCBtYXliZUFzc2lnbik7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gZWx0cGF0dGVybigpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXNzKHBhdHRlcm4sIG1heWJlQXNzaWduKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBtYXliZUFzc2lnbihfdHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcIj1cIikgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbk5vQ29tbWEpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHZhcmRlZkNvbnQodHlwZSkge1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCIsXCIpIHJldHVybiBjb250KHZhcmRlZik7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gbWF5YmVlbHNlKHR5cGUsIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcImtleXdvcmQgYlwiICYmIHZhbHVlID09IFwiZWxzZVwiKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250KHB1c2hsZXgoXCJmb3JtXCIsIFwiZWxzZVwiKSwgc3RhdGVtZW50LCBwb3BsZXgpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGZvcnNwZWModHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcImF3YWl0XCIpIHJldHVybiBjb250KGZvcnNwZWMpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCIoXCIpIHJldHVybiBjb250KHB1c2hsZXgoXCIpXCIpLCBmb3JzcGVjMSwgcG9wbGV4KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBmb3JzcGVjMSh0eXBlKSB7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcInZhclwiKSByZXR1cm4gY29udCh2YXJkZWYsIGZvcnNwZWMyKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwidmFyaWFibGVcIikgcmV0dXJuIGNvbnQoZm9yc3BlYzIpO1xuICAgICAgICAgICAgcmV0dXJuIHBhc3MoZm9yc3BlYzIpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGZvcnNwZWMyKHR5cGUsIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIilcIikgcmV0dXJuIGNvbnQoKTtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiO1wiKSByZXR1cm4gY29udChmb3JzcGVjMik7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gXCJpblwiIHx8IHZhbHVlID09IFwib2ZcIikge1xuICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KGV4cHJlc3Npb24sIGZvcnNwZWMyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwYXNzKGV4cHJlc3Npb24sIGZvcnNwZWMyKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBmdW5jdGlvbmRlZih0eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiKlwiKSB7XG4gICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoZnVuY3Rpb25kZWYpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ2YXJpYWJsZVwiKSB7XG4gICAgICAgICAgICAgICAgcmVnaXN0ZXIodmFsdWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KGZ1bmN0aW9uZGVmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlID09IFwiKFwiKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250KFxuICAgICAgICAgICAgICAgICAgICBwdXNoY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgcHVzaGxleChcIilcIiksXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hc2VwKGZ1bmFyZywgXCIpXCIpLFxuICAgICAgICAgICAgICAgICAgICBwb3BsZXgsXG4gICAgICAgICAgICAgICAgICAgIG1heWJlcmV0dHlwZSxcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50LFxuICAgICAgICAgICAgICAgICAgICBwb3Bjb250ZXh0XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChpc1RTICYmIHZhbHVlID09IFwiPFwiKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250KFxuICAgICAgICAgICAgICAgICAgICBwdXNobGV4KFwiPlwiKSxcbiAgICAgICAgICAgICAgICAgICAgY29tbWFzZXAodHlwZXBhcmFtLCBcIj5cIiksXG4gICAgICAgICAgICAgICAgICAgIHBvcGxleCxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25kZWZcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGZ1bmN0aW9uZGVjbCh0eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiKlwiKSB7XG4gICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoZnVuY3Rpb25kZWNsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlID09IFwidmFyaWFibGVcIikge1xuICAgICAgICAgICAgICAgIHJlZ2lzdGVyKHZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChmdW5jdGlvbmRlY2wpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCIoXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoXG4gICAgICAgICAgICAgICAgICAgIHB1c2hjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgICBwdXNobGV4KFwiKVwiKSxcbiAgICAgICAgICAgICAgICAgICAgY29tbWFzZXAoZnVuYXJnLCBcIilcIiksXG4gICAgICAgICAgICAgICAgICAgIHBvcGxleCxcbiAgICAgICAgICAgICAgICAgICAgbWF5YmVyZXR0eXBlLFxuICAgICAgICAgICAgICAgICAgICBwb3Bjb250ZXh0XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChpc1RTICYmIHZhbHVlID09IFwiPFwiKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250KFxuICAgICAgICAgICAgICAgICAgICBwdXNobGV4KFwiPlwiKSxcbiAgICAgICAgICAgICAgICAgICAgY29tbWFzZXAodHlwZXBhcmFtLCBcIj5cIiksXG4gICAgICAgICAgICAgICAgICAgIHBvcGxleCxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25kZWNsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiB0eXBlbmFtZSh0eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJrZXl3b3JkXCIgfHwgdHlwZSA9PSBcInZhcmlhYmxlXCIpIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcInR5cGVcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udCh0eXBlbmFtZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID09IFwiPFwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQocHVzaGxleChcIj5cIiksIGNvbW1hc2VwKHR5cGVwYXJhbSwgXCI+XCIpLCBwb3BsZXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGZ1bmFyZyh0eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiQFwiKSBjb250KGV4cHJlc3Npb24sIGZ1bmFyZyk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcInNwcmVhZFwiKSByZXR1cm4gY29udChmdW5hcmcpO1xuICAgICAgICAgICAgaWYgKGlzVFMgJiYgaXNNb2RpZmllcih2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChmdW5hcmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzVFMgJiYgdHlwZSA9PSBcInRoaXNcIikgcmV0dXJuIGNvbnQobWF5YmV0eXBlLCBtYXliZUFzc2lnbik7XG4gICAgICAgICAgICByZXR1cm4gcGFzcyhwYXR0ZXJuLCBtYXliZXR5cGUsIG1heWJlQXNzaWduKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjbGFzc0V4cHJlc3Npb24odHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIC8vIENsYXNzIGV4cHJlc3Npb25zIG1heSBoYXZlIGFuIG9wdGlvbmFsIG5hbWUuXG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcInZhcmlhYmxlXCIpIHJldHVybiBjbGFzc05hbWUodHlwZSwgdmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuIGNsYXNzTmFtZUFmdGVyKHR5cGUsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBjbGFzc05hbWUodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwidmFyaWFibGVcIikge1xuICAgICAgICAgICAgICAgIHJlZ2lzdGVyKHZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChjbGFzc05hbWVBZnRlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY2xhc3NOYW1lQWZ0ZXIodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcIjxcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChcbiAgICAgICAgICAgICAgICAgICAgcHVzaGxleChcIj5cIiksXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hc2VwKHR5cGVwYXJhbSwgXCI+XCIpLFxuICAgICAgICAgICAgICAgICAgICBwb3BsZXgsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZUFmdGVyXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB2YWx1ZSA9PSBcImV4dGVuZHNcIiB8fFxuICAgICAgICAgICAgICAgIHZhbHVlID09IFwiaW1wbGVtZW50c1wiIHx8XG4gICAgICAgICAgICAgICAgKGlzVFMgJiYgdHlwZSA9PSBcIixcIilcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcImltcGxlbWVudHNcIikgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoaXNUUyA/IHR5cGVleHByIDogZXhwcmVzc2lvbiwgY2xhc3NOYW1lQWZ0ZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ7XCIpIHJldHVybiBjb250KHB1c2hsZXgoXCJ9XCIpLCBjbGFzc0JvZHksIHBvcGxleCk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY2xhc3NCb2R5KHR5cGUsIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgdHlwZSA9PSBcImFzeW5jXCIgfHxcbiAgICAgICAgICAgICAgICAodHlwZSA9PSBcInZhcmlhYmxlXCIgJiZcbiAgICAgICAgICAgICAgICAgICAgKHZhbHVlID09IFwic3RhdGljXCIgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID09IFwiZ2V0XCIgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID09IFwic2V0XCIgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIChpc1RTICYmIGlzTW9kaWZpZXIodmFsdWUpKSkgJiZcbiAgICAgICAgICAgICAgICAgICAgY3guc3RyZWFtLm1hdGNoKC9eXFxzK1tcXHckXFx4YTEtXFx1ZmZmZl0vLCBmYWxzZSkpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChjbGFzc0JvZHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ2YXJpYWJsZVwiIHx8IGN4LnN0eWxlID09IFwia2V5d29yZFwiKSB7XG4gICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJwcm9wZXJ0eVwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KGNsYXNzZmllbGQsIGNsYXNzQm9keSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIm51bWJlclwiIHx8IHR5cGUgPT0gXCJzdHJpbmdcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChjbGFzc2ZpZWxkLCBjbGFzc0JvZHkpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJbXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoXG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgIG1heWJldHlwZSxcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KFwiXVwiKSxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NmaWVsZCxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NCb2R5XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcIipcIikge1xuICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KGNsYXNzQm9keSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNUUyAmJiB0eXBlID09IFwiKFwiKSByZXR1cm4gcGFzcyhmdW5jdGlvbmRlY2wsIGNsYXNzQm9keSk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIjtcIiB8fCB0eXBlID09IFwiLFwiKSByZXR1cm4gY29udChjbGFzc0JvZHkpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ9XCIpIHJldHVybiBjb250KCk7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gXCJAXCIpIHJldHVybiBjb250KGV4cHJlc3Npb24sIGNsYXNzQm9keSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gY2xhc3NmaWVsZCh0eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiIVwiKSByZXR1cm4gY29udChjbGFzc2ZpZWxkKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcIj9cIikgcmV0dXJuIGNvbnQoY2xhc3NmaWVsZCk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIjpcIikgcmV0dXJuIGNvbnQodHlwZWV4cHIsIG1heWJlQXNzaWduKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcIj1cIikgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbk5vQ29tbWEpO1xuICAgICAgICAgICAgdmFyIGNvbnRleHQgPSBjeC5zdGF0ZS5sZXhpY2FsLnByZXYsXG4gICAgICAgICAgICAgICAgaXNJbnRlcmZhY2UgPSBjb250ZXh0ICYmIGNvbnRleHQuaW5mbyA9PSBcImludGVyZmFjZVwiO1xuICAgICAgICAgICAgcmV0dXJuIHBhc3MoaXNJbnRlcmZhY2UgPyBmdW5jdGlvbmRlY2wgOiBmdW5jdGlvbmRlZik7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gYWZ0ZXJFeHBvcnQodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcIipcIikge1xuICAgICAgICAgICAgICAgIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250KG1heWJlRnJvbSwgZXhwZWN0KFwiO1wiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gXCJkZWZhdWx0XCIpIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChleHByZXNzaW9uLCBleHBlY3QoXCI7XCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlID09IFwie1wiKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250KGNvbW1hc2VwKGV4cG9ydEZpZWxkLCBcIn1cIiksIG1heWJlRnJvbSwgZXhwZWN0KFwiO1wiKSk7XG4gICAgICAgICAgICByZXR1cm4gcGFzcyhzdGF0ZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGV4cG9ydEZpZWxkKHR5cGUsIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gXCJhc1wiKSB7XG4gICAgICAgICAgICAgICAgY3gubWFya2VkID0gXCJrZXl3b3JkXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnQoZXhwZWN0KFwidmFyaWFibGVcIikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ2YXJpYWJsZVwiKSByZXR1cm4gcGFzcyhleHByZXNzaW9uTm9Db21tYSwgZXhwb3J0RmllbGQpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGFmdGVySW1wb3J0KHR5cGUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlID09IFwic3RyaW5nXCIpIHJldHVybiBjb250KCk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIihcIikgcmV0dXJuIHBhc3MoZXhwcmVzc2lvbik7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIi5cIikgcmV0dXJuIHBhc3MobWF5YmVvcGVyYXRvckNvbW1hKTtcbiAgICAgICAgICAgIHJldHVybiBwYXNzKGltcG9ydFNwZWMsIG1heWJlTW9yZUltcG9ydHMsIG1heWJlRnJvbSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gaW1wb3J0U3BlYyh0eXBlLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ7XCIpIHJldHVybiBjb250Q29tbWFzZXAoaW1wb3J0U3BlYywgXCJ9XCIpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJ2YXJpYWJsZVwiKSByZWdpc3Rlcih2YWx1ZSk7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gXCIqXCIpIGN4Lm1hcmtlZCA9IFwia2V5d29yZFwiO1xuICAgICAgICAgICAgcmV0dXJuIGNvbnQobWF5YmVBcyk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gbWF5YmVNb3JlSW1wb3J0cyh0eXBlKSB7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcIixcIikgcmV0dXJuIGNvbnQoaW1wb3J0U3BlYywgbWF5YmVNb3JlSW1wb3J0cyk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gbWF5YmVBcyhfdHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcImFzXCIpIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChpbXBvcnRTcGVjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBtYXliZUZyb20oX3R5cGUsIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gXCJmcm9tXCIpIHtcbiAgICAgICAgICAgICAgICBjeC5tYXJrZWQgPSBcImtleXdvcmRcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udChleHByZXNzaW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBhcnJheUxpdGVyYWwodHlwZSkge1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJdXCIpIHJldHVybiBjb250KCk7XG4gICAgICAgICAgICByZXR1cm4gcGFzcyhjb21tYXNlcChleHByZXNzaW9uTm9Db21tYSwgXCJdXCIpKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBlbnVtZGVmKCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhc3MoXG4gICAgICAgICAgICAgICAgcHVzaGxleChcImZvcm1cIiksXG4gICAgICAgICAgICAgICAgcGF0dGVybixcbiAgICAgICAgICAgICAgICBleHBlY3QoXCJ7XCIpLFxuICAgICAgICAgICAgICAgIHB1c2hsZXgoXCJ9XCIpLFxuICAgICAgICAgICAgICAgIGNvbW1hc2VwKGVudW1tZW1iZXIsIFwifVwiKSxcbiAgICAgICAgICAgICAgICBwb3BsZXgsXG4gICAgICAgICAgICAgICAgcG9wbGV4XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGVudW1tZW1iZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFzcyhwYXR0ZXJuLCBtYXliZUFzc2lnbik7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpc0NvbnRpbnVlZFN0YXRlbWVudChzdGF0ZSwgdGV4dEFmdGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIHN0YXRlLmxhc3RUeXBlID09IFwib3BlcmF0b3JcIiB8fFxuICAgICAgICAgICAgICAgIHN0YXRlLmxhc3RUeXBlID09IFwiLFwiIHx8XG4gICAgICAgICAgICAgICAgaXNPcGVyYXRvckNoYXIudGVzdCh0ZXh0QWZ0ZXIuY2hhckF0KDApKSB8fFxuICAgICAgICAgICAgICAgIC9bLC5dLy50ZXN0KHRleHRBZnRlci5jaGFyQXQoMCkpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZXhwcmVzc2lvbkFsbG93ZWQoc3RyZWFtLCBzdGF0ZSwgYmFja1VwKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIChzdGF0ZS50b2tlbml6ZSA9PSB0b2tlbkJhc2UgJiZcbiAgICAgICAgICAgICAgICAgICAgL14oPzpvcGVyYXRvcnxzb2Z8a2V5d29yZCBbYmNkXXxjYXNlfG5ld3xleHBvcnR8ZGVmYXVsdHxzcHJlYWR8W1xcW3t9XFwoLDs6XXw9PikkLy50ZXN0KFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUubGFzdFR5cGVcbiAgICAgICAgICAgICAgICAgICAgKSkgfHxcbiAgICAgICAgICAgICAgICAoc3RhdGUubGFzdFR5cGUgPT0gXCJxdWFzaVwiICYmXG4gICAgICAgICAgICAgICAgICAgIC9cXHtcXHMqJC8udGVzdChcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmVhbS5zdHJpbmcuc2xpY2UoMCwgc3RyZWFtLnBvcyAtIChiYWNrVXAgfHwgMCkpXG4gICAgICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSW50ZXJmYWNlXG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXJ0U3RhdGU6IGZ1bmN0aW9uIChiYXNlY29sdW1uKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN0YXRlID0ge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbml6ZTogdG9rZW5CYXNlLFxuICAgICAgICAgICAgICAgICAgICBsYXN0VHlwZTogXCJzb2ZcIixcbiAgICAgICAgICAgICAgICAgICAgY2M6IFtdLFxuICAgICAgICAgICAgICAgICAgICBsZXhpY2FsOiBuZXcgSlNMZXhpY2FsKFxuICAgICAgICAgICAgICAgICAgICAgICAgKGJhc2Vjb2x1bW4gfHwgMCkgLSBpbmRlbnRVbml0LFxuICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYmxvY2tcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsVmFyczogcGFyc2VyQ29uZmlnLmxvY2FsVmFycyxcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlckNvbmZpZy5sb2NhbFZhcnMgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBDb250ZXh0KG51bGwsIG51bGwsIGZhbHNlKSxcbiAgICAgICAgICAgICAgICAgICAgaW5kZW50ZWQ6IGJhc2Vjb2x1bW4gfHwgMCxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VyQ29uZmlnLmdsb2JhbFZhcnMgJiZcbiAgICAgICAgICAgICAgICAgICAgdHlwZW9mIHBhcnNlckNvbmZpZy5nbG9iYWxWYXJzID09IFwib2JqZWN0XCJcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmdsb2JhbFZhcnMgPSBwYXJzZXJDb25maWcuZ2xvYmFsVmFycztcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICB0b2tlbjogZnVuY3Rpb24gKHN0cmVhbSwgc3RhdGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3RyZWFtLnNvbCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghc3RhdGUubGV4aWNhbC5oYXNPd25Qcm9wZXJ0eShcImFsaWduXCIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUubGV4aWNhbC5hbGlnbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5pbmRlbnRlZCA9IHN0cmVhbS5pbmRlbnRhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICBmaW5kRmF0QXJyb3coc3RyZWFtLCBzdGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzdGF0ZS50b2tlbml6ZSAhPSB0b2tlbkNvbW1lbnQgJiYgc3RyZWFtLmVhdFNwYWNlKCkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIHZhciBzdHlsZSA9IHN0YXRlLnRva2VuaXplKHN0cmVhbSwgc3RhdGUpO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlID09IFwiY29tbWVudFwiKSByZXR1cm4gc3R5bGU7XG4gICAgICAgICAgICAgICAgc3RhdGUubGFzdFR5cGUgPVxuICAgICAgICAgICAgICAgICAgICB0eXBlID09IFwib3BlcmF0b3JcIiAmJiAoY29udGVudCA9PSBcIisrXCIgfHwgY29udGVudCA9PSBcIi0tXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICA/IFwiaW5jZGVjXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogdHlwZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VKUyhzdGF0ZSwgc3R5bGUsIHR5cGUsIGNvbnRlbnQsIHN0cmVhbSk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBpbmRlbnQ6IGZ1bmN0aW9uIChzdGF0ZSwgdGV4dEFmdGVyKSB7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS50b2tlbml6ZSA9PSB0b2tlbkNvbW1lbnQgfHxcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUudG9rZW5pemUgPT0gdG9rZW5RdWFzaVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIENvZGVNaXJyb3IuUGFzcztcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUudG9rZW5pemUgIT0gdG9rZW5CYXNlKSByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICB2YXIgZmlyc3RDaGFyID0gdGV4dEFmdGVyICYmIHRleHRBZnRlci5jaGFyQXQoMCksXG4gICAgICAgICAgICAgICAgICAgIGxleGljYWwgPSBzdGF0ZS5sZXhpY2FsLFxuICAgICAgICAgICAgICAgICAgICB0b3A7XG4gICAgICAgICAgICAgICAgLy8gS2x1ZGdlIHRvIHByZXZlbnQgJ21heWJlbHNlJyBmcm9tIGJsb2NraW5nIGxleGljYWwgc2NvcGUgcG9wc1xuICAgICAgICAgICAgICAgIGlmICghL15cXHMqZWxzZVxcYi8udGVzdCh0ZXh0QWZ0ZXIpKVxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gc3RhdGUuY2MubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjID0gc3RhdGUuY2NbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYyA9PSBwb3BsZXgpIGxleGljYWwgPSBsZXhpY2FsLnByZXY7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChjICE9IG1heWJlZWxzZSAmJiBjICE9IHBvcGNvbnRleHQpIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgd2hpbGUgKFxuICAgICAgICAgICAgICAgICAgICAobGV4aWNhbC50eXBlID09IFwic3RhdFwiIHx8IGxleGljYWwudHlwZSA9PSBcImZvcm1cIikgJiZcbiAgICAgICAgICAgICAgICAgICAgKGZpcnN0Q2hhciA9PSBcIn1cIiB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgKCh0b3AgPSBzdGF0ZS5jY1tzdGF0ZS5jYy5sZW5ndGggLSAxXSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAodG9wID09IG1heWJlb3BlcmF0b3JDb21tYSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3AgPT0gbWF5YmVvcGVyYXRvck5vQ29tbWEpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIS9eWyxcXC49K1xcLSo6P1tcXChdLy50ZXN0KHRleHRBZnRlcikpKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgbGV4aWNhbCA9IGxleGljYWwucHJldjtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlbWVudEluZGVudCAmJlxuICAgICAgICAgICAgICAgICAgICBsZXhpY2FsLnR5cGUgPT0gXCIpXCIgJiZcbiAgICAgICAgICAgICAgICAgICAgbGV4aWNhbC5wcmV2LnR5cGUgPT0gXCJzdGF0XCJcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIGxleGljYWwgPSBsZXhpY2FsLnByZXY7XG4gICAgICAgICAgICAgICAgdmFyIHR5cGUgPSBsZXhpY2FsLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgIGNsb3NpbmcgPSBmaXJzdENoYXIgPT0gdHlwZTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlID09IFwidmFyZGVmXCIpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXhpY2FsLmluZGVudGVkICtcbiAgICAgICAgICAgICAgICAgICAgICAgIChzdGF0ZS5sYXN0VHlwZSA9PSBcIm9wZXJhdG9yXCIgfHwgc3RhdGUubGFzdFR5cGUgPT0gXCIsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGxleGljYWwuaW5mby5sZW5ndGggKyAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAwKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGUgPT0gXCJmb3JtXCIgJiYgZmlyc3RDaGFyID09IFwie1wiKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGV4aWNhbC5pbmRlbnRlZDtcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlID09IFwiZm9ybVwiKSByZXR1cm4gbGV4aWNhbC5pbmRlbnRlZCArIGluZGVudFVuaXQ7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZSA9PSBcInN0YXRcIilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGxleGljYWwuaW5kZW50ZWQgK1xuICAgICAgICAgICAgICAgICAgICAgICAgKGlzQ29udGludWVkU3RhdGVtZW50KHN0YXRlLCB0ZXh0QWZ0ZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBzdGF0ZW1lbnRJbmRlbnQgfHwgaW5kZW50VW5pdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogMClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAgICAgbGV4aWNhbC5pbmZvID09IFwic3dpdGNoXCIgJiZcbiAgICAgICAgICAgICAgICAgICAgIWNsb3NpbmcgJiZcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VyQ29uZmlnLmRvdWJsZUluZGVudFN3aXRjaCAhPSBmYWxzZVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGxleGljYWwuaW5kZW50ZWQgK1xuICAgICAgICAgICAgICAgICAgICAgICAgKC9eKD86Y2FzZXxkZWZhdWx0KVxcYi8udGVzdCh0ZXh0QWZ0ZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBpbmRlbnRVbml0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAyICogaW5kZW50VW5pdClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChsZXhpY2FsLmFsaWduKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGV4aWNhbC5jb2x1bW4gKyAoY2xvc2luZyA/IDAgOiAxKTtcbiAgICAgICAgICAgICAgICBlbHNlIHJldHVybiBsZXhpY2FsLmluZGVudGVkICsgKGNsb3NpbmcgPyAwIDogaW5kZW50VW5pdCk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBlbGVjdHJpY0lucHV0OiAvXlxccyooPzpjYXNlIC4qPzp8ZGVmYXVsdDp8XFx7fFxcfSkkLyxcbiAgICAgICAgICAgIGJsb2NrQ29tbWVudFN0YXJ0OiBqc29uTW9kZSA/IG51bGwgOiBcIi8qXCIsXG4gICAgICAgICAgICBibG9ja0NvbW1lbnRFbmQ6IGpzb25Nb2RlID8gbnVsbCA6IFwiKi9cIixcbiAgICAgICAgICAgIGJsb2NrQ29tbWVudENvbnRpbnVlOiBqc29uTW9kZSA/IG51bGwgOiBcIiAqIFwiLFxuICAgICAgICAgICAgbGluZUNvbW1lbnQ6IGpzb25Nb2RlID8gbnVsbCA6IFwiLy9cIixcbiAgICAgICAgICAgIGZvbGQ6IFwiYnJhY2VcIixcbiAgICAgICAgICAgIGNsb3NlQnJhY2tldHM6IFwiKClbXXt9JydcXFwiXFxcImBgXCIsXG5cbiAgICAgICAgICAgIGhlbHBlclR5cGU6IGpzb25Nb2RlID8gXCJqc29uXCIgOiBcImphdmFzY3JpcHRcIixcbiAgICAgICAgICAgIGpzb25sZE1vZGU6IGpzb25sZE1vZGUsXG4gICAgICAgICAgICBqc29uTW9kZToganNvbk1vZGUsXG5cbiAgICAgICAgICAgIGV4cHJlc3Npb25BbGxvd2VkOiBleHByZXNzaW9uQWxsb3dlZCxcblxuICAgICAgICAgICAgc2tpcEV4cHJlc3Npb246IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgICAgICAgICAgIHBhcnNlSlMoXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgICAgICAgICAgICBcImF0b21cIixcbiAgICAgICAgICAgICAgICAgICAgXCJhdG9tXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidHJ1ZVwiLFxuICAgICAgICAgICAgICAgICAgICBuZXcgQ29kZU1pcnJvci5TdHJpbmdTdHJlYW0oXCJcIiwgMiwgbnVsbClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIENvZGVNaXJyb3IucmVnaXN0ZXJIZWxwZXIoXCJ3b3JkQ2hhcnNcIiwgXCJqYXZhc2NyaXB0XCIsIC9bXFx3JF0vKTtcblxuICAgIENvZGVNaXJyb3IuZGVmaW5lTUlNRShcInRleHQvamF2YXNjcmlwdFwiLCBcImphdmFzY3JpcHRcIik7XG4gICAgQ29kZU1pcnJvci5kZWZpbmVNSU1FKFwidGV4dC9lY21hc2NyaXB0XCIsIFwiamF2YXNjcmlwdFwiKTtcbiAgICBDb2RlTWlycm9yLmRlZmluZU1JTUUoXCJhcHBsaWNhdGlvbi9qYXZhc2NyaXB0XCIsIFwiamF2YXNjcmlwdFwiKTtcbiAgICBDb2RlTWlycm9yLmRlZmluZU1JTUUoXCJhcHBsaWNhdGlvbi94LWphdmFzY3JpcHRcIiwgXCJqYXZhc2NyaXB0XCIpO1xuICAgIENvZGVNaXJyb3IuZGVmaW5lTUlNRShcImFwcGxpY2F0aW9uL2VjbWFzY3JpcHRcIiwgXCJqYXZhc2NyaXB0XCIpO1xuICAgIENvZGVNaXJyb3IuZGVmaW5lTUlNRShcImFwcGxpY2F0aW9uL2pzb25cIiwge1xuICAgICAgICBuYW1lOiBcImphdmFzY3JpcHRcIixcbiAgICAgICAganNvbjogdHJ1ZSxcbiAgICB9KTtcbiAgICBDb2RlTWlycm9yLmRlZmluZU1JTUUoXCJhcHBsaWNhdGlvbi94LWpzb25cIiwge1xuICAgICAgICBuYW1lOiBcImphdmFzY3JpcHRcIixcbiAgICAgICAganNvbjogdHJ1ZSxcbiAgICB9KTtcbiAgICBDb2RlTWlycm9yLmRlZmluZU1JTUUoXCJhcHBsaWNhdGlvbi9tYW5pZmVzdCtqc29uXCIsIHtcbiAgICAgICAgbmFtZTogXCJqYXZhc2NyaXB0XCIsXG4gICAgICAgIGpzb246IHRydWUsXG4gICAgfSk7XG4gICAgQ29kZU1pcnJvci5kZWZpbmVNSU1FKFwiYXBwbGljYXRpb24vbGQranNvblwiLCB7XG4gICAgICAgIG5hbWU6IFwiamF2YXNjcmlwdFwiLFxuICAgICAgICBqc29ubGQ6IHRydWUsXG4gICAgfSk7XG4gICAgQ29kZU1pcnJvci5kZWZpbmVNSU1FKFwidGV4dC90eXBlc2NyaXB0XCIsIHtcbiAgICAgICAgbmFtZTogXCJqYXZhc2NyaXB0XCIsXG4gICAgICAgIHR5cGVzY3JpcHQ6IHRydWUsXG4gICAgfSk7XG4gICAgQ29kZU1pcnJvci5kZWZpbmVNSU1FKFwiYXBwbGljYXRpb24vdHlwZXNjcmlwdFwiLCB7XG4gICAgICAgIG5hbWU6IFwiamF2YXNjcmlwdFwiLFxuICAgICAgICB0eXBlc2NyaXB0OiB0cnVlLFxuICAgIH0pO1xufSk7XG4iLCIvLyBDb2RlTWlycm9yLCBjb3B5cmlnaHQgKGMpIGJ5IE1hcmlqbiBIYXZlcmJla2UgYW5kIG90aGVyc1xuLy8gRGlzdHJpYnV0ZWQgdW5kZXIgYW4gTUlUIGxpY2Vuc2U6IGh0dHBzOi8vY29kZW1pcnJvci5uZXQvTElDRU5TRVxuXG4vLyBVdGlsaXR5IGZ1bmN0aW9uIHRoYXQgYWxsb3dzIG1vZGVzIHRvIGJlIGNvbWJpbmVkLiBUaGUgbW9kZSBnaXZlblxuLy8gYXMgdGhlIGJhc2UgYXJndW1lbnQgdGFrZXMgY2FyZSBvZiBtb3N0IG9mIHRoZSBub3JtYWwgbW9kZVxuLy8gZnVuY3Rpb25hbGl0eSwgYnV0IGEgc2Vjb25kICh0eXBpY2FsbHkgc2ltcGxlKSBtb2RlIGlzIHVzZWQsIHdoaWNoXG4vLyBjYW4gb3ZlcnJpZGUgdGhlIHN0eWxlIG9mIHRleHQuIEJvdGggbW9kZXMgZ2V0IHRvIHBhcnNlIGFsbCBvZiB0aGVcbi8vIHRleHQsIGJ1dCB3aGVuIGJvdGggYXNzaWduIGEgbm9uLW51bGwgc3R5bGUgdG8gYSBwaWVjZSBvZiBjb2RlLCB0aGVcbi8vIG92ZXJsYXkgd2lucywgdW5sZXNzIHRoZSBjb21iaW5lIGFyZ3VtZW50IHdhcyB0cnVlIGFuZCBub3Qgb3ZlcnJpZGRlbixcbi8vIG9yIHN0YXRlLm92ZXJsYXkuY29tYmluZVRva2VucyB3YXMgdHJ1ZSwgaW4gd2hpY2ggY2FzZSB0aGUgc3R5bGVzIGFyZVxuLy8gY29tYmluZWQuXG5cbihmdW5jdGlvbiAobW9kKSB7XG4gICAgbW9kKHdpbmRvdy5Db2RlTWlycm9yKTtcbn0pKGZ1bmN0aW9uIChDb2RlTWlycm9yKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBDb2RlTWlycm9yLmN1c3RvbU92ZXJsYXlNb2RlID0gZnVuY3Rpb24gKGJhc2UsIG92ZXJsYXksIGNvbWJpbmUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXJ0U3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBiYXNlOiBDb2RlTWlycm9yLnN0YXJ0U3RhdGUoYmFzZSksXG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXk6IENvZGVNaXJyb3Iuc3RhcnRTdGF0ZShvdmVybGF5KSxcbiAgICAgICAgICAgICAgICAgICAgYmFzZVBvczogMCxcbiAgICAgICAgICAgICAgICAgICAgYmFzZUN1cjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheVBvczogMCxcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheUN1cjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgc3RyZWFtU2VlbjogbnVsbCxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvcHlTdGF0ZTogZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgYmFzZTogQ29kZU1pcnJvci5jb3B5U3RhdGUoYmFzZSwgc3RhdGUuYmFzZSksXG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXk6IENvZGVNaXJyb3IuY29weVN0YXRlKG92ZXJsYXksIHN0YXRlLm92ZXJsYXkpLFxuICAgICAgICAgICAgICAgICAgICBiYXNlUG9zOiBzdGF0ZS5iYXNlUG9zLFxuICAgICAgICAgICAgICAgICAgICBiYXNlQ3VyOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBvdmVybGF5UG9zOiBzdGF0ZS5vdmVybGF5UG9zLFxuICAgICAgICAgICAgICAgICAgICBvdmVybGF5Q3VyOiBudWxsLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICB0b2tlbjogZnVuY3Rpb24gKHN0cmVhbSwgc3RhdGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHN0cmVhbSAhPSBzdGF0ZS5zdHJlYW1TZWVuIHx8XG4gICAgICAgICAgICAgICAgICAgIE1hdGgubWluKHN0YXRlLmJhc2VQb3MsIHN0YXRlLm92ZXJsYXlQb3MpIDwgc3RyZWFtLnN0YXJ0XG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLnN0cmVhbVNlZW4gPSBzdHJlYW07XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmJhc2VQb3MgPSBzdGF0ZS5vdmVybGF5UG9zID0gc3RyZWFtLnN0YXJ0O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChzdHJlYW0uc3RhcnQgPT0gc3RhdGUuYmFzZVBvcykge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5iYXNlQ3VyID0gYmFzZS50b2tlbihzdHJlYW0sIHN0YXRlLmJhc2UpO1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5iYXNlUG9zID0gc3RyZWFtLnBvcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHN0cmVhbS5zdGFydCA9PSBzdGF0ZS5vdmVybGF5UG9zKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0cmVhbS5wb3MgPSBzdHJlYW0uc3RhcnQ7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLm92ZXJsYXlDdXIgPSBvdmVybGF5LnRva2VuKHN0cmVhbSwgc3RhdGUub3ZlcmxheSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLm92ZXJsYXlQb3MgPSBzdHJlYW0ucG9zO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdHJlYW0ucG9zID0gTWF0aC5taW4oc3RhdGUuYmFzZVBvcywgc3RhdGUub3ZlcmxheVBvcyk7XG5cbiAgICAgICAgICAgICAgICAvLyBFZGdlIGNhc2UgZm9yIGNvZGVibG9ja3MgaW4gdGVtcGxhdGVyIG1vZGVcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmJhc2VDdXIgJiZcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUub3ZlcmxheUN1ciAmJlxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5iYXNlQ3VyLmNvbnRhaW5zKFwibGluZS1IeXBlck1ELWNvZGVibG9ja1wiKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5vdmVybGF5Q3VyID0gc3RhdGUub3ZlcmxheUN1ci5yZXBsYWNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJsaW5lLXRlbXBsYXRlci1pbmxpbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiXCJcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUub3ZlcmxheUN1ciArPSBgIGxpbmUtYmFja2dyb3VuZC1IeXBlck1ELWNvZGVibG9jay1iZ2A7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gc3RhdGUub3ZlcmxheS5jb21iaW5lVG9rZW5zIGFsd2F5cyB0YWtlcyBwcmVjZWRlbmNlIG92ZXIgY29tYmluZSxcbiAgICAgICAgICAgICAgICAvLyB1bmxlc3Mgc2V0IHRvIG51bGxcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUub3ZlcmxheUN1ciA9PSBudWxsKSByZXR1cm4gc3RhdGUuYmFzZUN1cjtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAgICAgKHN0YXRlLmJhc2VDdXIgIT0gbnVsbCAmJiBzdGF0ZS5vdmVybGF5LmNvbWJpbmVUb2tlbnMpIHx8XG4gICAgICAgICAgICAgICAgICAgIChjb21iaW5lICYmIHN0YXRlLm92ZXJsYXkuY29tYmluZVRva2VucyA9PSBudWxsKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmJhc2VDdXIgKyBcIiBcIiArIHN0YXRlLm92ZXJsYXlDdXI7XG4gICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gc3RhdGUub3ZlcmxheUN1cjtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGluZGVudDpcbiAgICAgICAgICAgICAgICBiYXNlLmluZGVudCAmJlxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChzdGF0ZSwgdGV4dEFmdGVyLCBsaW5lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiYXNlLmluZGVudChzdGF0ZS5iYXNlLCB0ZXh0QWZ0ZXIsIGxpbmUpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbGVjdHJpY0NoYXJzOiBiYXNlLmVsZWN0cmljQ2hhcnMsXG5cbiAgICAgICAgICAgIGlubmVyTW9kZTogZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgc3RhdGU6IHN0YXRlLmJhc2UsIG1vZGU6IGJhc2UgfTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGJsYW5rTGluZTogZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJhc2VUb2tlbiwgb3ZlcmxheVRva2VuO1xuICAgICAgICAgICAgICAgIGlmIChiYXNlLmJsYW5rTGluZSkgYmFzZVRva2VuID0gYmFzZS5ibGFua0xpbmUoc3RhdGUuYmFzZSk7XG4gICAgICAgICAgICAgICAgaWYgKG92ZXJsYXkuYmxhbmtMaW5lKVxuICAgICAgICAgICAgICAgICAgICBvdmVybGF5VG9rZW4gPSBvdmVybGF5LmJsYW5rTGluZShzdGF0ZS5vdmVybGF5KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBvdmVybGF5VG9rZW4gPT0gbnVsbFxuICAgICAgICAgICAgICAgICAgICA/IGJhc2VUb2tlblxuICAgICAgICAgICAgICAgICAgICA6IGNvbWJpbmUgJiYgYmFzZVRva2VuICE9IG51bGxcbiAgICAgICAgICAgICAgICAgICAgPyBiYXNlVG9rZW4gKyBcIiBcIiArIG92ZXJsYXlUb2tlblxuICAgICAgICAgICAgICAgICAgICA6IG92ZXJsYXlUb2tlbjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgfTtcbn0pO1xuIiwiaW1wb3J0IHsgQXBwLCBQbGF0Zm9ybSB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IFRlbXBsYXRlclBsdWdpbiBmcm9tIFwibWFpblwiO1xuaW1wb3J0IHsgVGVtcGxhdGVyRXJyb3IgfSBmcm9tIFwiRXJyb3JcIjtcbmltcG9ydCB7IEN1cnNvckp1bXBlciB9IGZyb20gXCJlZGl0b3IvQ3Vyc29ySnVtcGVyXCI7XG5pbXBvcnQgeyBsb2dfZXJyb3IgfSBmcm9tIFwiTG9nXCI7XG5cbmltcG9ydCBcImVkaXRvci9tb2RlL2phdmFzY3JpcHRcIjtcbmltcG9ydCBcImVkaXRvci9tb2RlL2N1c3RvbV9vdmVybGF5XCI7XG4vL2ltcG9ydCBcImVkaXRvci9tb2RlL3Nob3ctaGludFwiO1xuXG5jb25zdCBUUF9DTURfVE9LRU5fQ0xBU1MgPSBcInRlbXBsYXRlci1jb21tYW5kXCI7XG5jb25zdCBUUF9JTkxJTkVfQ0xBU1MgPSBcInRlbXBsYXRlci1pbmxpbmVcIjtcblxuY29uc3QgVFBfT1BFTklOR19UQUdfVE9LRU5fQ0xBU1MgPSBcInRlbXBsYXRlci1vcGVuaW5nLXRhZ1wiO1xuY29uc3QgVFBfQ0xPU0lOR19UQUdfVE9LRU5fQ0xBU1MgPSBcInRlbXBsYXRlci1jbG9zaW5nLXRhZ1wiO1xuXG5jb25zdCBUUF9JTlRFUlBPTEFUSU9OX1RBR19UT0tFTl9DTEFTUyA9IFwidGVtcGxhdGVyLWludGVycG9sYXRpb24tdGFnXCI7XG5jb25zdCBUUF9SQVdfVEFHX1RPS0VOX0NMQVNTID0gXCJ0ZW1wbGF0ZXItcmF3LXRhZ1wiO1xuY29uc3QgVFBfRVhFQ19UQUdfVE9LRU5fQ0xBU1MgPSBcInRlbXBsYXRlci1leGVjdXRpb24tdGFnXCI7XG5cbmV4cG9ydCBjbGFzcyBFZGl0b3Ige1xuICAgIHByaXZhdGUgY3Vyc29yX2p1bXBlcjogQ3Vyc29ySnVtcGVyO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBwOiBBcHAsIHByaXZhdGUgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW4pIHtcbiAgICAgICAgdGhpcy5jdXJzb3JfanVtcGVyID0gbmV3IEN1cnNvckp1bXBlcih0aGlzLmFwcCk7XG4gICAgfVxuXG4gICAgYXN5bmMgc2V0dXAoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGF3YWl0IHRoaXMucmVnaXN0ZXJDb2RlTWlycm9yTW9kZSgpO1xuICAgICAgICAvL2F3YWl0IHRoaXMucmVnaXN0ZXJIaW50ZXIoKTtcbiAgICB9XG5cbiAgICBhc3luYyBqdW1wX3RvX25leHRfY3Vyc29yX2xvY2F0aW9uKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0aGlzLmN1cnNvcl9qdW1wZXIuanVtcF90b19uZXh0X2N1cnNvcl9sb2NhdGlvbigpO1xuICAgIH1cblxuICAgIGFzeW5jIHJlZ2lzdGVyQ29kZU1pcnJvck1vZGUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIC8vIGNtLWVkaXRvci1zeW50YXgtaGlnaGxpZ2h0LW9ic2lkaWFuIHBsdWdpblxuICAgICAgICAvLyBodHRwczovL2NvZGVtaXJyb3IubmV0L2RvYy9tYW51YWwuaHRtbCNtb2RlYXBpXG4gICAgICAgIC8vIGh0dHBzOi8vY29kZW1pcnJvci5uZXQvbW9kZS9kaWZmL2RpZmYuanNcbiAgICAgICAgLy8gaHR0cHM6Ly9jb2RlbWlycm9yLm5ldC9kZW1vL211c3RhY2hlLmh0bWxcbiAgICAgICAgLy8gaHR0cHM6Ly9tYXJpam5oYXZlcmJla2UubmwvYmxvZy9jb2RlbWlycm9yLW1vZGUtc3lzdGVtLmh0bWxcblxuICAgICAgICBpZiAoIXRoaXMucGx1Z2luLnNldHRpbmdzLnN5bnRheF9oaWdobGlnaHRpbmcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRPRE86IEFkZCBtb2JpbGUgc3VwcG9ydFxuICAgICAgICBpZiAoUGxhdGZvcm0uaXNNb2JpbGVBcHApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGpzX21vZGUgPSB3aW5kb3cuQ29kZU1pcnJvci5nZXRNb2RlKHt9LCBcImphdmFzY3JpcHRcIik7XG4gICAgICAgIGlmIChqc19tb2RlLm5hbWUgPT09IFwibnVsbFwiKSB7XG4gICAgICAgICAgICBsb2dfZXJyb3IoXG4gICAgICAgICAgICAgICAgbmV3IFRlbXBsYXRlckVycm9yKFxuICAgICAgICAgICAgICAgICAgICBcIkphdmFzY3JpcHQgc3ludGF4IG1vZGUgY291bGRuJ3QgYmUgZm91bmQsIGNhbid0IGVuYWJsZSBzeW50YXggaGlnaGxpZ2h0aW5nLlwiXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEN1c3RvbSBvdmVybGF5IG1vZGUgdXNlZCB0byBoYW5kbGUgZWRnZSBjYXNlc1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGNvbnN0IG92ZXJsYXlfbW9kZSA9IHdpbmRvdy5Db2RlTWlycm9yLmN1c3RvbU92ZXJsYXlNb2RlO1xuICAgICAgICBpZiAob3ZlcmxheV9tb2RlID09IG51bGwpIHtcbiAgICAgICAgICAgIGxvZ19lcnJvcihcbiAgICAgICAgICAgICAgICBuZXcgVGVtcGxhdGVyRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIFwiQ291bGRuJ3QgZmluZCBjdXN0b21PdmVybGF5TW9kZSwgY2FuJ3QgZW5hYmxlIHN5bnRheCBoaWdobGlnaHRpbmcuXCJcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgd2luZG93LkNvZGVNaXJyb3IuZGVmaW5lTW9kZShcbiAgICAgICAgICAgIFwidGVtcGxhdGVyXCIsXG4gICAgICAgICAgICBmdW5jdGlvbiAoY29uZmlnLCBfcGFyc2VyQ29uZmlnKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGVtcGxhdGVyT3ZlcmxheSA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QganNfc3RhdGUgPSB3aW5kb3cuQ29kZU1pcnJvci5zdGFydFN0YXRlKGpzX21vZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5qc19zdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbkNvbW1hbmQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhZ19jbGFzczogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcmVlTGluZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjb3B5U3RhdGU6IGZ1bmN0aW9uIChzdGF0ZTogYW55KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBqc19zdGF0ZSA9IHdpbmRvdy5Db2RlTWlycm9yLnN0YXJ0U3RhdGUoanNfbW9kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdfc3RhdGUgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uanNfc3RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5Db21tYW5kOiBzdGF0ZS5pbkNvbW1hbmQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFnX2NsYXNzOiBzdGF0ZS50YWdfY2xhc3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJlZUxpbmU6IHN0YXRlLmZyZWVMaW5lLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXdfc3RhdGU7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGJsYW5rTGluZTogZnVuY3Rpb24gKHN0YXRlOiBhbnkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5pbkNvbW1hbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYGxpbmUtYmFja2dyb3VuZC10ZW1wbGF0ZXItY29tbWFuZC1iZ2A7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgdG9rZW46IGZ1bmN0aW9uIChzdHJlYW06IGFueSwgc3RhdGU6IGFueSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0cmVhbS5zb2woKSAmJiBzdGF0ZS5pbkNvbW1hbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5mcmVlTGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGF0ZS5pbkNvbW1hbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQga2V5d29yZHMgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdHJlYW0ubWF0Y2goL1tcXC1fXXswLDF9JT4vLCB0cnVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS5pbkNvbW1hbmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuZnJlZUxpbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFnX2NsYXNzID0gc3RhdGUudGFnX2NsYXNzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS50YWdfY2xhc3MgPSBcIlwiO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBgbGluZS0ke1RQX0lOTElORV9DTEFTU30gJHtUUF9DTURfVE9LRU5fQ0xBU1N9ICR7VFBfQ0xPU0lOR19UQUdfVE9LRU5fQ0xBU1N9ICR7dGFnX2NsYXNzfWA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QganNfcmVzdWx0ID0ganNfbW9kZS50b2tlbihzdHJlYW0sIHN0YXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RyZWFtLnBlZWsoKSA9PSBudWxsICYmIHN0YXRlLmZyZWVMaW5lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleXdvcmRzICs9IGAgbGluZS1iYWNrZ3JvdW5kLXRlbXBsYXRlci1jb21tYW5kLWJnYDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzdGF0ZS5mcmVlTGluZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXl3b3JkcyArPSBgIGxpbmUtJHtUUF9JTkxJTkVfQ0xBU1N9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7a2V5d29yZHN9ICR7VFBfQ01EX1RPS0VOX0NMQVNTfSAke2pzX3Jlc3VsdH1gO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXRjaCA9IHN0cmVhbS5tYXRjaChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPCVbXFwtX117MCwxfVxccyooWyp+K117MCwxfSkvLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWF0Y2ggIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAobWF0Y2hbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIipcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLnRhZ19jbGFzcyA9IFRQX0VYRUNfVEFHX1RPS0VOX0NMQVNTO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ+XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS50YWdfY2xhc3MgPSBUUF9SQVdfVEFHX1RPS0VOX0NMQVNTO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS50YWdfY2xhc3MgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRQX0lOVEVSUE9MQVRJT05fVEFHX1RPS0VOX0NMQVNTO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmluQ29tbWFuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGBsaW5lLSR7VFBfSU5MSU5FX0NMQVNTfSAke1RQX0NNRF9UT0tFTl9DTEFTU30gJHtUUF9PUEVOSU5HX1RBR19UT0tFTl9DTEFTU30gJHtzdGF0ZS50YWdfY2xhc3N9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cmVhbS5uZXh0KCkgIT0gbnVsbCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICFzdHJlYW0ubWF0Y2goLzwlLywgZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3ZlcmxheV9tb2RlKFxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuQ29kZU1pcnJvci5nZXRNb2RlKGNvbmZpZywgXCJoeXBlcm1kXCIpLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZXJPdmVybGF5XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBhc3luYyByZWdpc3RlckhpbnRlcigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgLy8gVE9ET1xuICAgICAgICAvKlxuICAgICAgICBhd2FpdCBkZWxheSgxMDAwKTtcblxuICAgICAgICB2YXIgY29tcCA9IFtcbiAgICAgICAgICAgIFtcImhlcmVcIiwgXCJoaXRoZXJcIl0sXG4gICAgICAgICAgICBbXCJhc3luY2hyb25vdXNcIiwgXCJub25zeW5jaHJvbm91c1wiXSxcbiAgICAgICAgICAgIFtcImNvbXBsZXRpb25cIiwgXCJhY2hpZXZlbWVudFwiLCBcImNvbmNsdXNpb25cIiwgXCJjdWxtaW5hdGlvblwiLCBcImV4cGlyYXRpb25zXCJdLFxuICAgICAgICAgICAgW1wiaGludGluZ1wiLCBcImFkdmlzZVwiLCBcImJyb2FjaFwiLCBcImltcGx5XCJdLFxuICAgICAgICAgICAgW1wiZnVuY3Rpb25cIixcImFjdGlvblwiXSxcbiAgICAgICAgICAgIFtcInByb3ZpZGVcIiwgXCJhZGRcIiwgXCJicmluZ1wiLCBcImdpdmVcIl0sXG4gICAgICAgICAgICBbXCJzeW5vbnltc1wiLCBcImVxdWl2YWxlbnRzXCJdLFxuICAgICAgICAgICAgW1wid29yZHNcIiwgXCJ0b2tlblwiXSxcbiAgICAgICAgICAgIFtcImVhY2hcIiwgXCJldmVyeVwiXSxcbiAgICAgICAgXTtcbiAgICBcbiAgICAgICAgZnVuY3Rpb24gc3lub255bXMoY206IGFueSwgb3B0aW9uOiBhbnkpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihhY2NlcHQpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY3Vyc29yID0gY20uZ2V0Q3Vyc29yKCksIGxpbmUgPSBjbS5nZXRMaW5lKGN1cnNvci5saW5lKVxuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhcnQgPSBjdXJzb3IuY2gsIGVuZCA9IGN1cnNvci5jaFxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoc3RhcnQgJiYgL1xcdy8udGVzdChsaW5lLmNoYXJBdChzdGFydCAtIDEpKSkgLS1zdGFydFxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoZW5kIDwgbGluZS5sZW5ndGggJiYgL1xcdy8udGVzdChsaW5lLmNoYXJBdChlbmQpKSkgKytlbmRcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdvcmQgPSBsaW5lLnNsaWNlKHN0YXJ0LCBlbmQpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb21wLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcFtpXS5pbmRleE9mKHdvcmQpICE9IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFjY2VwdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3Q6IGNvbXBbaV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb206IHdpbmRvdy5Db2RlTWlycm9yLlBvcyhjdXJzb3IubGluZSwgc3RhcnQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0bzogd2luZG93LkNvZGVNaXJyb3IuUG9zKGN1cnNvci5saW5lLCBlbmQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFjY2VwdChudWxsKTtcbiAgICAgICAgICAgICAgICB9LCAxMDApXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImNvZGVtaXJyb3JcIiwgY20gPT4ge1xuICAgICAgICAgICAgY20uc2V0T3B0aW9uKFwiZXh0cmFLZXlzXCIsIHtcIkN0cmwtU3BhY2VcIjogXCJhdXRvY29tcGxldGVcIn0pO1xuICAgICAgICAgICAgY20uc2V0T3B0aW9uKFwiaGludE9wdGlvbnNcIiwge2hpbnQ6IHN5bm9ueW1zfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5pdGVyYXRlQ29kZU1pcnJvcnMoY20gPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJDTTpcIiwgY20pO1xuICAgICAgICAgICAgY20uc2V0T3B0aW9uKFwiZXh0cmFLZXlzXCIsIHtcIlNwYWNlXCI6IFwiYXV0b2NvbXBsZXRlXCJ9KTtcbiAgICAgICAgICAgIGNtLnNldE9wdGlvbihcImhpbnRPcHRpb25zXCIsIHtoaW50OiBzeW5vbnltc30pO1xuICAgICAgICB9KTtcbiAgICAgICAgKi9cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBleGlzdHNTeW5jLCByZWFkRmlsZVN5bmMgfSBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuXG4vKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXHJcblxyXG5QZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcclxucHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLlxyXG5cclxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVMgV0lUSFxyXG5SRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFlcclxuQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULFxyXG5JTkRJUkVDVCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST01cclxuTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1JcclxuT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUlxyXG5QRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG5cclxudmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH07XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufTtcblxuZnVuY3Rpb24gc2V0UHJvdG90eXBlT2Yob2JqLCBwcm90bykge1xyXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XHJcbiAgICBpZiAoT2JqZWN0LnNldFByb3RvdHlwZU9mKSB7XHJcbiAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKG9iaiwgcHJvdG8pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgb2JqLl9fcHJvdG9fXyA9IHByb3RvO1xyXG4gICAgfVxyXG59XHJcbi8vIFRoaXMgaXMgcHJldHR5IG11Y2ggdGhlIG9ubHkgd2F5IHRvIGdldCBuaWNlLCBleHRlbmRlZCBFcnJvcnNcclxuLy8gd2l0aG91dCB1c2luZyBFUzZcclxuLyoqXHJcbiAqIFRoaXMgcmV0dXJucyBhIG5ldyBFcnJvciB3aXRoIGEgY3VzdG9tIHByb3RvdHlwZS4gTm90ZSB0aGF0IGl0J3MgX25vdF8gYSBjb25zdHJ1Y3RvclxyXG4gKlxyXG4gKiBAcGFyYW0gbWVzc2FnZSBFcnJvciBtZXNzYWdlXHJcbiAqXHJcbiAqICoqRXhhbXBsZSoqXHJcbiAqXHJcbiAqIGBgYGpzXHJcbiAqIHRocm93IEV0YUVycihcInRlbXBsYXRlIG5vdCBmb3VuZFwiKVxyXG4gKiBgYGBcclxuICovXHJcbmZ1bmN0aW9uIEV0YUVycihtZXNzYWdlKSB7XHJcbiAgICB2YXIgZXJyID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xyXG4gICAgc2V0UHJvdG90eXBlT2YoZXJyLCBFdGFFcnIucHJvdG90eXBlKTtcclxuICAgIHJldHVybiBlcnI7XHJcbn1cclxuRXRhRXJyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlLCB7XHJcbiAgICBuYW1lOiB7IHZhbHVlOiAnRXRhIEVycm9yJywgZW51bWVyYWJsZTogZmFsc2UgfVxyXG59KTtcclxuLyoqXHJcbiAqIFRocm93cyBhbiBFdGFFcnIgd2l0aCBhIG5pY2VseSBmb3JtYXR0ZWQgZXJyb3IgYW5kIG1lc3NhZ2Ugc2hvd2luZyB3aGVyZSBpbiB0aGUgdGVtcGxhdGUgdGhlIGVycm9yIG9jY3VycmVkLlxyXG4gKi9cclxuZnVuY3Rpb24gUGFyc2VFcnIobWVzc2FnZSwgc3RyLCBpbmR4KSB7XHJcbiAgICB2YXIgd2hpdGVzcGFjZSA9IHN0ci5zbGljZSgwLCBpbmR4KS5zcGxpdCgvXFxuLyk7XHJcbiAgICB2YXIgbGluZU5vID0gd2hpdGVzcGFjZS5sZW5ndGg7XHJcbiAgICB2YXIgY29sTm8gPSB3aGl0ZXNwYWNlW2xpbmVObyAtIDFdLmxlbmd0aCArIDE7XHJcbiAgICBtZXNzYWdlICs9XHJcbiAgICAgICAgJyBhdCBsaW5lICcgK1xyXG4gICAgICAgICAgICBsaW5lTm8gK1xyXG4gICAgICAgICAgICAnIGNvbCAnICtcclxuICAgICAgICAgICAgY29sTm8gK1xyXG4gICAgICAgICAgICAnOlxcblxcbicgK1xyXG4gICAgICAgICAgICAnICAnICtcclxuICAgICAgICAgICAgc3RyLnNwbGl0KC9cXG4vKVtsaW5lTm8gLSAxXSArXHJcbiAgICAgICAgICAgICdcXG4nICtcclxuICAgICAgICAgICAgJyAgJyArXHJcbiAgICAgICAgICAgIEFycmF5KGNvbE5vKS5qb2luKCcgJykgK1xyXG4gICAgICAgICAgICAnXic7XHJcbiAgICB0aHJvdyBFdGFFcnIobWVzc2FnZSk7XHJcbn1cblxuLyoqXHJcbiAqIEByZXR1cm5zIFRoZSBnbG9iYWwgUHJvbWlzZSBmdW5jdGlvblxyXG4gKi9cclxudmFyIHByb21pc2VJbXBsID0gbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCkuUHJvbWlzZTtcclxuLyoqXHJcbiAqIEByZXR1cm5zIEEgbmV3IEFzeW5jRnVuY3Rpb24gY29uc3R1Y3RvclxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0QXN5bmNGdW5jdGlvbkNvbnN0cnVjdG9yKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKCdyZXR1cm4gKGFzeW5jIGZ1bmN0aW9uKCl7fSkuY29uc3RydWN0b3InKSgpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIFN5bnRheEVycm9yKSB7XHJcbiAgICAgICAgICAgIHRocm93IEV0YUVycihcIlRoaXMgZW52aXJvbm1lbnQgZG9lc24ndCBzdXBwb3J0IGFzeW5jL2F3YWl0XCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIHN0ci50cmltTGVmdCBwb2x5ZmlsbFxyXG4gKlxyXG4gKiBAcGFyYW0gc3RyIC0gSW5wdXQgc3RyaW5nXHJcbiAqIEByZXR1cm5zIFRoZSBzdHJpbmcgd2l0aCBsZWZ0IHdoaXRlc3BhY2UgcmVtb3ZlZFxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gdHJpbUxlZnQoc3RyKSB7XHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZXh0cmEtYm9vbGVhbi1jYXN0XHJcbiAgICBpZiAoISFTdHJpbmcucHJvdG90eXBlLnRyaW1MZWZ0KSB7XHJcbiAgICAgICAgcmV0dXJuIHN0ci50cmltTGVmdCgpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzKy8sICcnKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogc3RyLnRyaW1SaWdodCBwb2x5ZmlsbFxyXG4gKlxyXG4gKiBAcGFyYW0gc3RyIC0gSW5wdXQgc3RyaW5nXHJcbiAqIEByZXR1cm5zIFRoZSBzdHJpbmcgd2l0aCByaWdodCB3aGl0ZXNwYWNlIHJlbW92ZWRcclxuICpcclxuICovXHJcbmZ1bmN0aW9uIHRyaW1SaWdodChzdHIpIHtcclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1leHRyYS1ib29sZWFuLWNhc3RcclxuICAgIGlmICghIVN0cmluZy5wcm90b3R5cGUudHJpbVJpZ2h0KSB7XHJcbiAgICAgICAgcmV0dXJuIHN0ci50cmltUmlnaHQoKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvXFxzKyQvLCAnJyk7IC8vIFRPRE86IGRvIHdlIHJlYWxseSBuZWVkIHRvIHJlcGxhY2UgQk9NJ3M/XHJcbiAgICB9XHJcbn1cblxuLy8gVE9ETzogYWxsb3cgJy0nIHRvIHRyaW0gdXAgdW50aWwgbmV3bGluZS4gVXNlIFteXFxTXFxuXFxyXSBpbnN0ZWFkIG9mIFxcc1xyXG4vKiBFTkQgVFlQRVMgKi9cclxuZnVuY3Rpb24gaGFzT3duUHJvcChvYmosIHByb3ApIHtcclxuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcclxufVxyXG5mdW5jdGlvbiBjb3B5UHJvcHModG9PYmosIGZyb21PYmopIHtcclxuICAgIGZvciAodmFyIGtleSBpbiBmcm9tT2JqKSB7XHJcbiAgICAgICAgaWYgKGhhc093blByb3AoZnJvbU9iaiwga2V5KSkge1xyXG4gICAgICAgICAgICB0b09ialtrZXldID0gZnJvbU9ialtrZXldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0b09iajtcclxufVxyXG4vKipcclxuICogVGFrZXMgYSBzdHJpbmcgd2l0aGluIGEgdGVtcGxhdGUgYW5kIHRyaW1zIGl0LCBiYXNlZCBvbiB0aGUgcHJlY2VkaW5nIHRhZydzIHdoaXRlc3BhY2UgY29udHJvbCBhbmQgYGNvbmZpZy5hdXRvVHJpbWBcclxuICovXHJcbmZ1bmN0aW9uIHRyaW1XUyhzdHIsIGNvbmZpZywgd3NMZWZ0LCB3c1JpZ2h0KSB7XHJcbiAgICB2YXIgbGVmdFRyaW07XHJcbiAgICB2YXIgcmlnaHRUcmltO1xyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoY29uZmlnLmF1dG9UcmltKSkge1xyXG4gICAgICAgIC8vIGtpbmRhIGNvbmZ1c2luZ1xyXG4gICAgICAgIC8vIGJ1dCBffX0gd2lsbCB0cmltIHRoZSBsZWZ0IHNpZGUgb2YgdGhlIGZvbGxvd2luZyBzdHJpbmdcclxuICAgICAgICBsZWZ0VHJpbSA9IGNvbmZpZy5hdXRvVHJpbVsxXTtcclxuICAgICAgICByaWdodFRyaW0gPSBjb25maWcuYXV0b1RyaW1bMF07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBsZWZ0VHJpbSA9IHJpZ2h0VHJpbSA9IGNvbmZpZy5hdXRvVHJpbTtcclxuICAgIH1cclxuICAgIGlmICh3c0xlZnQgfHwgd3NMZWZ0ID09PSBmYWxzZSkge1xyXG4gICAgICAgIGxlZnRUcmltID0gd3NMZWZ0O1xyXG4gICAgfVxyXG4gICAgaWYgKHdzUmlnaHQgfHwgd3NSaWdodCA9PT0gZmFsc2UpIHtcclxuICAgICAgICByaWdodFRyaW0gPSB3c1JpZ2h0O1xyXG4gICAgfVxyXG4gICAgaWYgKCFyaWdodFRyaW0gJiYgIWxlZnRUcmltKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0cjtcclxuICAgIH1cclxuICAgIGlmIChsZWZ0VHJpbSA9PT0gJ3NsdXJwJyAmJiByaWdodFRyaW0gPT09ICdzbHVycCcpIHtcclxuICAgICAgICByZXR1cm4gc3RyLnRyaW0oKTtcclxuICAgIH1cclxuICAgIGlmIChsZWZ0VHJpbSA9PT0gJ18nIHx8IGxlZnRUcmltID09PSAnc2x1cnAnKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3RyaW1taW5nIGxlZnQnICsgbGVmdFRyaW0pXHJcbiAgICAgICAgLy8gZnVsbCBzbHVycFxyXG4gICAgICAgIHN0ciA9IHRyaW1MZWZ0KHN0cik7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChsZWZ0VHJpbSA9PT0gJy0nIHx8IGxlZnRUcmltID09PSAnbmwnKSB7XHJcbiAgICAgICAgLy8gbmwgdHJpbVxyXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9eKD86XFxyXFxufFxcbnxcXHIpLywgJycpO1xyXG4gICAgfVxyXG4gICAgaWYgKHJpZ2h0VHJpbSA9PT0gJ18nIHx8IHJpZ2h0VHJpbSA9PT0gJ3NsdXJwJykge1xyXG4gICAgICAgIC8vIGZ1bGwgc2x1cnBcclxuICAgICAgICBzdHIgPSB0cmltUmlnaHQoc3RyKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHJpZ2h0VHJpbSA9PT0gJy0nIHx8IHJpZ2h0VHJpbSA9PT0gJ25sJykge1xyXG4gICAgICAgIC8vIG5sIHRyaW1cclxuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZSgvKD86XFxyXFxufFxcbnxcXHIpJC8sICcnKTsgLy8gVE9ETzogbWFrZSBzdXJlIHRoaXMgZ2V0cyBcXHJcXG5cclxuICAgIH1cclxuICAgIHJldHVybiBzdHI7XHJcbn1cclxuLyoqXHJcbiAqIEEgbWFwIG9mIHNwZWNpYWwgSFRNTCBjaGFyYWN0ZXJzIHRvIHRoZWlyIFhNTC1lc2NhcGVkIGVxdWl2YWxlbnRzXHJcbiAqL1xyXG52YXIgZXNjTWFwID0ge1xyXG4gICAgJyYnOiAnJmFtcDsnLFxyXG4gICAgJzwnOiAnJmx0OycsXHJcbiAgICAnPic6ICcmZ3Q7JyxcclxuICAgICdcIic6ICcmcXVvdDsnLFxyXG4gICAgXCInXCI6ICcmIzM5OydcclxufTtcclxuZnVuY3Rpb24gcmVwbGFjZUNoYXIocykge1xyXG4gICAgcmV0dXJuIGVzY01hcFtzXTtcclxufVxyXG4vKipcclxuICogWE1MLWVzY2FwZXMgYW4gaW5wdXQgdmFsdWUgYWZ0ZXIgY29udmVydGluZyBpdCB0byBhIHN0cmluZ1xyXG4gKlxyXG4gKiBAcGFyYW0gc3RyIC0gSW5wdXQgdmFsdWUgKHVzdWFsbHkgYSBzdHJpbmcpXHJcbiAqIEByZXR1cm5zIFhNTC1lc2NhcGVkIHN0cmluZ1xyXG4gKi9cclxuZnVuY3Rpb24gWE1MRXNjYXBlKHN0cikge1xyXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XHJcbiAgICAvLyBUbyBkZWFsIHdpdGggWFNTLiBCYXNlZCBvbiBFc2NhcGUgaW1wbGVtZW50YXRpb25zIG9mIE11c3RhY2hlLkpTIGFuZCBNYXJrbywgdGhlbiBjdXN0b21pemVkLlxyXG4gICAgdmFyIG5ld1N0ciA9IFN0cmluZyhzdHIpO1xyXG4gICAgaWYgKC9bJjw+XCInXS8udGVzdChuZXdTdHIpKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ld1N0ci5yZXBsYWNlKC9bJjw+XCInXS9nLCByZXBsYWNlQ2hhcik7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gbmV3U3RyO1xyXG4gICAgfVxyXG59XG5cbi8qIEVORCBUWVBFUyAqL1xyXG52YXIgdGVtcGxhdGVMaXRSZWcgPSAvYCg/OlxcXFxbXFxzXFxTXXxcXCR7KD86W157fV18eyg/Oltee31dfHtbXn1dKn0pKn0pKn18KD8hXFwkeylbXlxcXFxgXSkqYC9nO1xyXG52YXIgc2luZ2xlUXVvdGVSZWcgPSAvJyg/OlxcXFxbXFxzXFx3XCInXFxcXGBdfFteXFxuXFxyJ1xcXFxdKSo/Jy9nO1xyXG52YXIgZG91YmxlUXVvdGVSZWcgPSAvXCIoPzpcXFxcW1xcc1xcd1wiJ1xcXFxgXXxbXlxcblxcclwiXFxcXF0pKj9cIi9nO1xyXG4vKiogRXNjYXBlIHNwZWNpYWwgcmVndWxhciBleHByZXNzaW9uIGNoYXJhY3RlcnMgaW5zaWRlIGEgc3RyaW5nICovXHJcbmZ1bmN0aW9uIGVzY2FwZVJlZ0V4cChzdHJpbmcpIHtcclxuICAgIC8vIEZyb20gTUROXHJcbiAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoL1suKitcXC0/XiR7fSgpfFtcXF1cXFxcXS9nLCAnXFxcXCQmJyk7IC8vICQmIG1lYW5zIHRoZSB3aG9sZSBtYXRjaGVkIHN0cmluZ1xyXG59XHJcbmZ1bmN0aW9uIHBhcnNlKHN0ciwgY29uZmlnKSB7XHJcbiAgICB2YXIgYnVmZmVyID0gW107XHJcbiAgICB2YXIgdHJpbUxlZnRPZk5leHRTdHIgPSBmYWxzZTtcclxuICAgIHZhciBsYXN0SW5kZXggPSAwO1xyXG4gICAgdmFyIHBhcnNlT3B0aW9ucyA9IGNvbmZpZy5wYXJzZTtcclxuICAgIGlmIChjb25maWcucGx1Z2lucykge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29uZmlnLnBsdWdpbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHBsdWdpbiA9IGNvbmZpZy5wbHVnaW5zW2ldO1xyXG4gICAgICAgICAgICBpZiAocGx1Z2luLnByb2Nlc3NUZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgc3RyID0gcGx1Z2luLnByb2Nlc3NUZW1wbGF0ZShzdHIsIGNvbmZpZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKiBBZGRpbmcgZm9yIEVKUyBjb21wYXRpYmlsaXR5ICovXHJcbiAgICBpZiAoY29uZmlnLnJtV2hpdGVzcGFjZSkge1xyXG4gICAgICAgIC8vIENvZGUgdGFrZW4gZGlyZWN0bHkgZnJvbSBFSlNcclxuICAgICAgICAvLyBIYXZlIHRvIHVzZSB0d28gc2VwYXJhdGUgcmVwbGFjZXMgaGVyZSBhcyBgXmAgYW5kIGAkYCBvcGVyYXRvcnMgZG9uJ3RcclxuICAgICAgICAvLyB3b3JrIHdlbGwgd2l0aCBgXFxyYCBhbmQgZW1wdHkgbGluZXMgZG9uJ3Qgd29yayB3ZWxsIHdpdGggdGhlIGBtYCBmbGFnLlxyXG4gICAgICAgIC8vIEVzc2VudGlhbGx5LCB0aGlzIHJlcGxhY2VzIHRoZSB3aGl0ZXNwYWNlIGF0IHRoZSBiZWdpbm5pbmcgYW5kIGVuZCBvZlxyXG4gICAgICAgIC8vIGVhY2ggbGluZSBhbmQgcmVtb3ZlcyBtdWx0aXBsZSBuZXdsaW5lcy5cclxuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZSgvW1xcclxcbl0rL2csICdcXG4nKS5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nbSwgJycpO1xyXG4gICAgfVxyXG4gICAgLyogRW5kIHJtV2hpdGVzcGFjZSBvcHRpb24gKi9cclxuICAgIHRlbXBsYXRlTGl0UmVnLmxhc3RJbmRleCA9IDA7XHJcbiAgICBzaW5nbGVRdW90ZVJlZy5sYXN0SW5kZXggPSAwO1xyXG4gICAgZG91YmxlUXVvdGVSZWcubGFzdEluZGV4ID0gMDtcclxuICAgIGZ1bmN0aW9uIHB1c2hTdHJpbmcoc3RybmcsIHNob3VsZFRyaW1SaWdodE9mU3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHN0cm5nKSB7XHJcbiAgICAgICAgICAgIC8vIGlmIHN0cmluZyBpcyB0cnV0aHkgaXQgbXVzdCBiZSBvZiB0eXBlICdzdHJpbmcnXHJcbiAgICAgICAgICAgIHN0cm5nID0gdHJpbVdTKHN0cm5nLCBjb25maWcsIHRyaW1MZWZ0T2ZOZXh0U3RyLCAvLyB0aGlzIHdpbGwgb25seSBiZSBmYWxzZSBvbiB0aGUgZmlyc3Qgc3RyLCB0aGUgbmV4dCBvbmVzIHdpbGwgYmUgbnVsbCBvciB1bmRlZmluZWRcclxuICAgICAgICAgICAgc2hvdWxkVHJpbVJpZ2h0T2ZTdHJpbmcpO1xyXG4gICAgICAgICAgICBpZiAoc3RybmcpIHtcclxuICAgICAgICAgICAgICAgIC8vIHJlcGxhY2UgXFwgd2l0aCBcXFxcLCAnIHdpdGggXFwnXHJcbiAgICAgICAgICAgICAgICAvLyB3ZSdyZSBnb2luZyB0byBjb252ZXJ0IGFsbCBDUkxGIHRvIExGIHNvIGl0IGRvZXNuJ3QgdGFrZSBtb3JlIHRoYW4gb25lIHJlcGxhY2VcclxuICAgICAgICAgICAgICAgIHN0cm5nID0gc3RybmcucmVwbGFjZSgvXFxcXHwnL2csICdcXFxcJCYnKS5yZXBsYWNlKC9cXHJcXG58XFxufFxcci9nLCAnXFxcXG4nKTtcclxuICAgICAgICAgICAgICAgIGJ1ZmZlci5wdXNoKHN0cm5nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHZhciBwcmVmaXhlcyA9IFtwYXJzZU9wdGlvbnMuZXhlYywgcGFyc2VPcHRpb25zLmludGVycG9sYXRlLCBwYXJzZU9wdGlvbnMucmF3XS5yZWR1Y2UoZnVuY3Rpb24gKGFjY3VtdWxhdG9yLCBwcmVmaXgpIHtcclxuICAgICAgICBpZiAoYWNjdW11bGF0b3IgJiYgcHJlZml4KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhY2N1bXVsYXRvciArICd8JyArIGVzY2FwZVJlZ0V4cChwcmVmaXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChwcmVmaXgpIHtcclxuICAgICAgICAgICAgLy8gYWNjdW11bGF0b3IgaXMgZmFsc3lcclxuICAgICAgICAgICAgcmV0dXJuIGVzY2FwZVJlZ0V4cChwcmVmaXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gcHJlZml4IGFuZCBhY2N1bXVsYXRvciBhcmUgYm90aCBmYWxzeVxyXG4gICAgICAgICAgICByZXR1cm4gYWNjdW11bGF0b3I7XHJcbiAgICAgICAgfVxyXG4gICAgfSwgJycpO1xyXG4gICAgdmFyIHBhcnNlT3BlblJlZyA9IG5ldyBSZWdFeHAoJyhbXl0qPyknICsgZXNjYXBlUmVnRXhwKGNvbmZpZy50YWdzWzBdKSArICcoLXxfKT9cXFxccyooJyArIHByZWZpeGVzICsgJyk/XFxcXHMqKD8hW1xcXFxzK1xcXFwtXycgKyBwcmVmaXhlcyArICddKScsICdnJyk7XHJcbiAgICB2YXIgcGFyc2VDbG9zZVJlZyA9IG5ldyBSZWdFeHAoJ1xcJ3xcInxgfFxcXFwvXFxcXCp8KFxcXFxzKigtfF8pPycgKyBlc2NhcGVSZWdFeHAoY29uZmlnLnRhZ3NbMV0pICsgJyknLCAnZycpO1xyXG4gICAgLy8gVE9ETzogYmVuY2htYXJrIGhhdmluZyB0aGUgXFxzKiBvbiBlaXRoZXIgc2lkZSB2cyB1c2luZyBzdHIudHJpbSgpXHJcbiAgICB2YXIgbTtcclxuICAgIHdoaWxlICgobSA9IHBhcnNlT3BlblJlZy5leGVjKHN0cikpKSB7XHJcbiAgICAgICAgbGFzdEluZGV4ID0gbVswXS5sZW5ndGggKyBtLmluZGV4O1xyXG4gICAgICAgIHZhciBwcmVjZWRpbmdTdHJpbmcgPSBtWzFdO1xyXG4gICAgICAgIHZhciB3c0xlZnQgPSBtWzJdO1xyXG4gICAgICAgIHZhciBwcmVmaXggPSBtWzNdIHx8ICcnOyAvLyBieSBkZWZhdWx0IGVpdGhlciB+LCA9LCBvciBlbXB0eVxyXG4gICAgICAgIHB1c2hTdHJpbmcocHJlY2VkaW5nU3RyaW5nLCB3c0xlZnQpO1xyXG4gICAgICAgIHBhcnNlQ2xvc2VSZWcubGFzdEluZGV4ID0gbGFzdEluZGV4O1xyXG4gICAgICAgIHZhciBjbG9zZVRhZyA9IHZvaWQgMDtcclxuICAgICAgICB2YXIgY3VycmVudE9iaiA9IGZhbHNlO1xyXG4gICAgICAgIHdoaWxlICgoY2xvc2VUYWcgPSBwYXJzZUNsb3NlUmVnLmV4ZWMoc3RyKSkpIHtcclxuICAgICAgICAgICAgaWYgKGNsb3NlVGFnWzFdKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29udGVudCA9IHN0ci5zbGljZShsYXN0SW5kZXgsIGNsb3NlVGFnLmluZGV4KTtcclxuICAgICAgICAgICAgICAgIHBhcnNlT3BlblJlZy5sYXN0SW5kZXggPSBsYXN0SW5kZXggPSBwYXJzZUNsb3NlUmVnLmxhc3RJbmRleDtcclxuICAgICAgICAgICAgICAgIHRyaW1MZWZ0T2ZOZXh0U3RyID0gY2xvc2VUYWdbMl07XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudFR5cGUgPSBwcmVmaXggPT09IHBhcnNlT3B0aW9ucy5leGVjXHJcbiAgICAgICAgICAgICAgICAgICAgPyAnZSdcclxuICAgICAgICAgICAgICAgICAgICA6IHByZWZpeCA9PT0gcGFyc2VPcHRpb25zLnJhd1xyXG4gICAgICAgICAgICAgICAgICAgICAgICA/ICdyJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IHByZWZpeCA9PT0gcGFyc2VPcHRpb25zLmludGVycG9sYXRlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdpJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnJztcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRPYmogPSB7IHQ6IGN1cnJlbnRUeXBlLCB2YWw6IGNvbnRlbnQgfTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNoYXIgPSBjbG9zZVRhZ1swXTtcclxuICAgICAgICAgICAgICAgIGlmIChjaGFyID09PSAnLyonKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbW1lbnRDbG9zZUluZCA9IHN0ci5pbmRleE9mKCcqLycsIHBhcnNlQ2xvc2VSZWcubGFzdEluZGV4KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY29tbWVudENsb3NlSW5kID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQYXJzZUVycigndW5jbG9zZWQgY29tbWVudCcsIHN0ciwgY2xvc2VUYWcuaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBwYXJzZUNsb3NlUmVnLmxhc3RJbmRleCA9IGNvbW1lbnRDbG9zZUluZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNoYXIgPT09IFwiJ1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2luZ2xlUXVvdGVSZWcubGFzdEluZGV4ID0gY2xvc2VUYWcuaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNpbmdsZVF1b3RlTWF0Y2ggPSBzaW5nbGVRdW90ZVJlZy5leGVjKHN0cik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNpbmdsZVF1b3RlTWF0Y2gpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VDbG9zZVJlZy5sYXN0SW5kZXggPSBzaW5nbGVRdW90ZVJlZy5sYXN0SW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQYXJzZUVycigndW5jbG9zZWQgc3RyaW5nJywgc3RyLCBjbG9zZVRhZy5pbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoY2hhciA9PT0gJ1wiJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvdWJsZVF1b3RlUmVnLmxhc3RJbmRleCA9IGNsb3NlVGFnLmluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkb3VibGVRdW90ZU1hdGNoID0gZG91YmxlUXVvdGVSZWcuZXhlYyhzdHIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkb3VibGVRdW90ZU1hdGNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlQ2xvc2VSZWcubGFzdEluZGV4ID0gZG91YmxlUXVvdGVSZWcubGFzdEluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUGFyc2VFcnIoJ3VuY2xvc2VkIHN0cmluZycsIHN0ciwgY2xvc2VUYWcuaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNoYXIgPT09ICdgJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlTGl0UmVnLmxhc3RJbmRleCA9IGNsb3NlVGFnLmluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZUxpdE1hdGNoID0gdGVtcGxhdGVMaXRSZWcuZXhlYyhzdHIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZW1wbGF0ZUxpdE1hdGNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlQ2xvc2VSZWcubGFzdEluZGV4ID0gdGVtcGxhdGVMaXRSZWcubGFzdEluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUGFyc2VFcnIoJ3VuY2xvc2VkIHN0cmluZycsIHN0ciwgY2xvc2VUYWcuaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY3VycmVudE9iaikge1xyXG4gICAgICAgICAgICBidWZmZXIucHVzaChjdXJyZW50T2JqKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIFBhcnNlRXJyKCd1bmNsb3NlZCB0YWcnLCBzdHIsIG0uaW5kZXggKyBwcmVjZWRpbmdTdHJpbmcubGVuZ3RoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdXNoU3RyaW5nKHN0ci5zbGljZShsYXN0SW5kZXgsIHN0ci5sZW5ndGgpLCBmYWxzZSk7XHJcbiAgICBpZiAoY29uZmlnLnBsdWdpbnMpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbmZpZy5wbHVnaW5zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBwbHVnaW4gPSBjb25maWcucGx1Z2luc1tpXTtcclxuICAgICAgICAgICAgaWYgKHBsdWdpbi5wcm9jZXNzQVNUKSB7XHJcbiAgICAgICAgICAgICAgICBidWZmZXIgPSBwbHVnaW4ucHJvY2Vzc0FTVChidWZmZXIsIGNvbmZpZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYnVmZmVyO1xyXG59XG5cbi8qIEVORCBUWVBFUyAqL1xyXG4vKipcclxuICogQ29tcGlsZXMgYSB0ZW1wbGF0ZSBzdHJpbmcgdG8gYSBmdW5jdGlvbiBzdHJpbmcuIE1vc3Qgb2Z0ZW4gdXNlcnMganVzdCB1c2UgYGNvbXBpbGUoKWAsIHdoaWNoIGNhbGxzIGBjb21waWxlVG9TdHJpbmdgIGFuZCBjcmVhdGVzIGEgbmV3IGZ1bmN0aW9uIHVzaW5nIHRoZSByZXN1bHRcclxuICpcclxuICogKipFeGFtcGxlKipcclxuICpcclxuICogYGBganNcclxuICogY29tcGlsZVRvU3RyaW5nKFwiSGkgPCU9IGl0LnVzZXIgJT5cIiwgZXRhLmNvbmZpZylcclxuICogLy8gXCJ2YXIgdFI9JycsaW5jbHVkZT1FLmluY2x1ZGUuYmluZChFKSxpbmNsdWRlRmlsZT1FLmluY2x1ZGVGaWxlLmJpbmQoRSk7dFIrPSdIaSAnO3RSKz1FLmUoaXQudXNlcik7aWYoY2Ipe2NiKG51bGwsdFIpfSByZXR1cm4gdFJcIlxyXG4gKiBgYGBcclxuICovXHJcbmZ1bmN0aW9uIGNvbXBpbGVUb1N0cmluZyhzdHIsIGNvbmZpZykge1xyXG4gICAgdmFyIGJ1ZmZlciA9IHBhcnNlKHN0ciwgY29uZmlnKTtcclxuICAgIHZhciByZXMgPSBcInZhciB0Uj0nJyxfX2wsX19sUFwiICtcclxuICAgICAgICAoY29uZmlnLmluY2x1ZGUgPyAnLGluY2x1ZGU9RS5pbmNsdWRlLmJpbmQoRSknIDogJycpICtcclxuICAgICAgICAoY29uZmlnLmluY2x1ZGVGaWxlID8gJyxpbmNsdWRlRmlsZT1FLmluY2x1ZGVGaWxlLmJpbmQoRSknIDogJycpICtcclxuICAgICAgICAnXFxuZnVuY3Rpb24gbGF5b3V0KHAsZCl7X19sPXA7X19sUD1kfVxcbicgK1xyXG4gICAgICAgIChjb25maWcuZ2xvYmFsQXdhaXQgPyAnY29uc3QgX3BycyA9IFtdO1xcbicgOiAnJykgK1xyXG4gICAgICAgIChjb25maWcudXNlV2l0aCA/ICd3aXRoKCcgKyBjb25maWcudmFyTmFtZSArICd8fHt9KXsnIDogJycpICtcclxuICAgICAgICBjb21waWxlU2NvcGUoYnVmZmVyLCBjb25maWcpICtcclxuICAgICAgICAoY29uZmlnLmluY2x1ZGVGaWxlXHJcbiAgICAgICAgICAgID8gJ2lmKF9fbCl0Uj0nICtcclxuICAgICAgICAgICAgICAgIChjb25maWcuYXN5bmMgPyAnYXdhaXQgJyA6ICcnKSArXHJcbiAgICAgICAgICAgICAgICAoXCJpbmNsdWRlRmlsZShfX2wsT2JqZWN0LmFzc2lnbihcIiArIGNvbmZpZy52YXJOYW1lICsgXCIse2JvZHk6dFJ9LF9fbFApKVxcblwiKVxyXG4gICAgICAgICAgICA6IGNvbmZpZy5pbmNsdWRlXHJcbiAgICAgICAgICAgICAgICA/ICdpZihfX2wpdFI9JyArXHJcbiAgICAgICAgICAgICAgICAgICAgKGNvbmZpZy5hc3luYyA/ICdhd2FpdCAnIDogJycpICtcclxuICAgICAgICAgICAgICAgICAgICAoXCJpbmNsdWRlKF9fbCxPYmplY3QuYXNzaWduKFwiICsgY29uZmlnLnZhck5hbWUgKyBcIix7Ym9keTp0Un0sX19sUCkpXFxuXCIpXHJcbiAgICAgICAgICAgICAgICA6ICcnKSArXHJcbiAgICAgICAgJ2lmKGNiKXtjYihudWxsLHRSKX0gcmV0dXJuIHRSJyArXHJcbiAgICAgICAgKGNvbmZpZy51c2VXaXRoID8gJ30nIDogJycpO1xyXG4gICAgaWYgKGNvbmZpZy5wbHVnaW5zKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb25maWcucGx1Z2lucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcGx1Z2luID0gY29uZmlnLnBsdWdpbnNbaV07XHJcbiAgICAgICAgICAgIGlmIChwbHVnaW4ucHJvY2Vzc0ZuU3RyaW5nKSB7XHJcbiAgICAgICAgICAgICAgICByZXMgPSBwbHVnaW4ucHJvY2Vzc0ZuU3RyaW5nKHJlcywgY29uZmlnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXM7XHJcbn1cclxuLyoqXHJcbiAqIExvb3BzIHRocm91Z2ggdGhlIEFTVCBnZW5lcmF0ZWQgYnkgYHBhcnNlYCBhbmQgdHJhbnNmb3JtIGVhY2ggaXRlbSBpbnRvIEpTIGNhbGxzXHJcbiAqXHJcbiAqICoqRXhhbXBsZSoqXHJcbiAqXHJcbiAqIGBgYGpzXHJcbiAqIC8vIEFTVCB2ZXJzaW9uIG9mICdIaSA8JT0gaXQudXNlciAlPidcclxuICogbGV0IHRlbXBsYXRlQVNUID0gWydIaSAnLCB7IHZhbDogJ2l0LnVzZXInLCB0OiAnaScgfV1cclxuICogY29tcGlsZVNjb3BlKHRlbXBsYXRlQVNULCBldGEuY29uZmlnKVxyXG4gKiAvLyBcInRSKz0nSGkgJzt0Uis9RS5lKGl0LnVzZXIpO1wiXHJcbiAqIGBgYFxyXG4gKi9cclxuZnVuY3Rpb24gY29tcGlsZVNjb3BlKGJ1ZmYsIGNvbmZpZykge1xyXG4gICAgdmFyIGk7XHJcbiAgICB2YXIgYnVmZkxlbmd0aCA9IGJ1ZmYubGVuZ3RoO1xyXG4gICAgdmFyIHJldHVyblN0ciA9ICcnO1xyXG4gICAgdmFyIFJFUExBQ0VNRU5UX1NUUiA9IFwickoyS3FYenhRZ1wiO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IGJ1ZmZMZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBjdXJyZW50QmxvY2sgPSBidWZmW2ldO1xyXG4gICAgICAgIGlmICh0eXBlb2YgY3VycmVudEJsb2NrID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICB2YXIgc3RyID0gY3VycmVudEJsb2NrO1xyXG4gICAgICAgICAgICAvLyB3ZSBrbm93IHN0cmluZyBleGlzdHNcclxuICAgICAgICAgICAgcmV0dXJuU3RyICs9IFwidFIrPSdcIiArIHN0ciArIFwiJ1xcblwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHR5cGUgPSBjdXJyZW50QmxvY2sudDsgLy8gfiwgcywgISwgPywgclxyXG4gICAgICAgICAgICB2YXIgY29udGVudCA9IGN1cnJlbnRCbG9jay52YWwgfHwgJyc7XHJcbiAgICAgICAgICAgIGlmICh0eXBlID09PSAncicpIHtcclxuICAgICAgICAgICAgICAgIC8vIHJhd1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvbmZpZy5nbG9iYWxBd2FpdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblN0ciArPSBcIl9wcnMucHVzaChcIiArIGNvbnRlbnQgKyBcIik7XFxuXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuU3RyICs9IFwidFIrPSdcIiArIFJFUExBQ0VNRU5UX1NUUiArIFwiJ1xcblwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbmZpZy5maWx0ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudCA9ICdFLmZpbHRlcignICsgY29udGVudCArICcpJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuU3RyICs9ICd0Uis9JyArIGNvbnRlbnQgKyAnXFxuJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlID09PSAnaScpIHtcclxuICAgICAgICAgICAgICAgIC8vIGludGVycG9sYXRlXHJcbiAgICAgICAgICAgICAgICBpZiAoY29uZmlnLmdsb2JhbEF3YWl0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuU3RyICs9IFwiX3Bycy5wdXNoKFwiICsgY29udGVudCArIFwiKTtcXG5cIjtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm5TdHIgKz0gXCJ0Uis9J1wiICsgUkVQTEFDRU1FTlRfU1RSICsgXCInXFxuXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY29uZmlnLmZpbHRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gJ0UuZmlsdGVyKCcgKyBjb250ZW50ICsgJyknO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm5TdHIgKz0gJ3RSKz0nICsgY29udGVudCArICdcXG4nO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb25maWcuYXV0b0VzY2FwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gJ0UuZSgnICsgY29udGVudCArICcpJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuU3RyICs9ICd0Uis9JyArIGNvbnRlbnQgKyAnXFxuJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlID09PSAnZScpIHtcclxuICAgICAgICAgICAgICAgIC8vIGV4ZWN1dGVcclxuICAgICAgICAgICAgICAgIHJldHVyblN0ciArPSBjb250ZW50ICsgJ1xcbic7IC8vIHlvdSBuZWVkIGEgXFxuIGluIGNhc2UgeW91IGhhdmUgPCUgfSAlPlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKGNvbmZpZy5nbG9iYWxBd2FpdCkge1xyXG4gICAgICAgIHJldHVyblN0ciArPSBcImNvbnN0IF9yc3QgPSBhd2FpdCBQcm9taXNlLmFsbChfcHJzKTtcXG50UiA9IHRSLnJlcGxhY2UoL1wiICsgUkVQTEFDRU1FTlRfU1RSICsgXCIvZywgKCkgPT4gX3JzdC5zaGlmdCgpKTtcXG5cIjtcclxuICAgIH1cclxuICAgIHJldHVybiByZXR1cm5TdHI7XHJcbn1cblxuLyoqXHJcbiAqIEhhbmRsZXMgc3RvcmFnZSBhbmQgYWNjZXNzaW5nIG9mIHZhbHVlc1xyXG4gKlxyXG4gKiBJbiB0aGlzIGNhc2UsIHdlIHVzZSBpdCB0byBzdG9yZSBjb21waWxlZCB0ZW1wbGF0ZSBmdW5jdGlvbnNcclxuICogSW5kZXhlZCBieSB0aGVpciBgbmFtZWAgb3IgYGZpbGVuYW1lYFxyXG4gKi9cclxudmFyIENhY2hlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIENhY2hlcihjYWNoZSkge1xyXG4gICAgICAgIHRoaXMuY2FjaGUgPSBjYWNoZTtcclxuICAgIH1cclxuICAgIENhY2hlci5wcm90b3R5cGUuZGVmaW5lID0gZnVuY3Rpb24gKGtleSwgdmFsKSB7XHJcbiAgICAgICAgdGhpcy5jYWNoZVtrZXldID0gdmFsO1xyXG4gICAgfTtcclxuICAgIENhY2hlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgIC8vIHN0cmluZyB8IGFycmF5LlxyXG4gICAgICAgIC8vIFRPRE86IGFsbG93IGFycmF5IG9mIGtleXMgdG8gbG9vayBkb3duXHJcbiAgICAgICAgLy8gVE9ETzogY3JlYXRlIHBsdWdpbiB0byBhbGxvdyByZWZlcmVuY2luZyBoZWxwZXJzLCBmaWx0ZXJzIHdpdGggZG90IG5vdGF0aW9uXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVba2V5XTtcclxuICAgIH07XHJcbiAgICBDYWNoZXIucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICBkZWxldGUgdGhpcy5jYWNoZVtrZXldO1xyXG4gICAgfTtcclxuICAgIENhY2hlci5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5jYWNoZSA9IHt9O1xyXG4gICAgfTtcclxuICAgIENhY2hlci5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uIChjYWNoZU9iaikge1xyXG4gICAgICAgIGNvcHlQcm9wcyh0aGlzLmNhY2hlLCBjYWNoZU9iaik7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIENhY2hlcjtcclxufSgpKTtcblxuLyogRU5EIFRZUEVTICovXHJcbi8qKlxyXG4gKiBFdGEncyB0ZW1wbGF0ZSBzdG9yYWdlXHJcbiAqXHJcbiAqIFN0b3JlcyBwYXJ0aWFscyBhbmQgY2FjaGVkIHRlbXBsYXRlc1xyXG4gKi9cclxudmFyIHRlbXBsYXRlcyA9IG5ldyBDYWNoZXIoe30pO1xuXG4vKiBFTkQgVFlQRVMgKi9cclxuLyoqXHJcbiAqIEluY2x1ZGUgYSB0ZW1wbGF0ZSBiYXNlZCBvbiBpdHMgbmFtZSAob3IgZmlsZXBhdGgsIGlmIGl0J3MgYWxyZWFkeSBiZWVuIGNhY2hlZCkuXHJcbiAqXHJcbiAqIENhbGxlZCBsaWtlIGBpbmNsdWRlKHRlbXBsYXRlTmFtZU9yUGF0aCwgZGF0YSlgXHJcbiAqL1xyXG5mdW5jdGlvbiBpbmNsdWRlSGVscGVyKHRlbXBsYXRlTmFtZU9yUGF0aCwgZGF0YSkge1xyXG4gICAgdmFyIHRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZXMuZ2V0KHRlbXBsYXRlTmFtZU9yUGF0aCk7XHJcbiAgICBpZiAoIXRlbXBsYXRlKSB7XHJcbiAgICAgICAgdGhyb3cgRXRhRXJyKCdDb3VsZCBub3QgZmV0Y2ggdGVtcGxhdGUgXCInICsgdGVtcGxhdGVOYW1lT3JQYXRoICsgJ1wiJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGVtcGxhdGUoZGF0YSwgdGhpcyk7XHJcbn1cclxuLyoqIEV0YSdzIGJhc2UgKGdsb2JhbCkgY29uZmlndXJhdGlvbiAqL1xyXG52YXIgY29uZmlnID0ge1xyXG4gICAgYXN5bmM6IGZhbHNlLFxyXG4gICAgYXV0b0VzY2FwZTogdHJ1ZSxcclxuICAgIGF1dG9UcmltOiBbZmFsc2UsICdubCddLFxyXG4gICAgY2FjaGU6IGZhbHNlLFxyXG4gICAgZTogWE1MRXNjYXBlLFxyXG4gICAgaW5jbHVkZTogaW5jbHVkZUhlbHBlcixcclxuICAgIHBhcnNlOiB7XHJcbiAgICAgICAgZXhlYzogJycsXHJcbiAgICAgICAgaW50ZXJwb2xhdGU6ICc9JyxcclxuICAgICAgICByYXc6ICd+J1xyXG4gICAgfSxcclxuICAgIHBsdWdpbnM6IFtdLFxyXG4gICAgcm1XaGl0ZXNwYWNlOiBmYWxzZSxcclxuICAgIHRhZ3M6IFsnPCUnLCAnJT4nXSxcclxuICAgIHRlbXBsYXRlczogdGVtcGxhdGVzLFxyXG4gICAgdXNlV2l0aDogZmFsc2UsXHJcbiAgICB2YXJOYW1lOiAnaXQnXHJcbn07XHJcbi8qKlxyXG4gKiBUYWtlcyBvbmUgb3IgdHdvIHBhcnRpYWwgKG5vdCBuZWNlc3NhcmlseSBjb21wbGV0ZSkgY29uZmlndXJhdGlvbiBvYmplY3RzLCBtZXJnZXMgdGhlbSAxIGxheWVyIGRlZXAgaW50byBldGEuY29uZmlnLCBhbmQgcmV0dXJucyB0aGUgcmVzdWx0XHJcbiAqXHJcbiAqIEBwYXJhbSBvdmVycmlkZSBQYXJ0aWFsIGNvbmZpZ3VyYXRpb24gb2JqZWN0XHJcbiAqIEBwYXJhbSBiYXNlQ29uZmlnIFBhcnRpYWwgY29uZmlndXJhdGlvbiBvYmplY3QgdG8gbWVyZ2UgYmVmb3JlIGBvdmVycmlkZWBcclxuICpcclxuICogKipFeGFtcGxlKipcclxuICpcclxuICogYGBganNcclxuICogbGV0IGN1c3RvbUNvbmZpZyA9IGdldENvbmZpZyh7dGFnczogWychIycsICcjISddfSlcclxuICogYGBgXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRDb25maWcob3ZlcnJpZGUsIGJhc2VDb25maWcpIHtcclxuICAgIC8vIFRPRE86IHJ1biBtb3JlIHRlc3RzIG9uIHRoaXNcclxuICAgIHZhciByZXMgPSB7fTsgLy8gTGlua2VkXHJcbiAgICBjb3B5UHJvcHMocmVzLCBjb25maWcpOyAvLyBDcmVhdGVzIGRlZXAgY2xvbmUgb2YgZXRhLmNvbmZpZywgMSBsYXllciBkZWVwXHJcbiAgICBpZiAoYmFzZUNvbmZpZykge1xyXG4gICAgICAgIGNvcHlQcm9wcyhyZXMsIGJhc2VDb25maWcpO1xyXG4gICAgfVxyXG4gICAgaWYgKG92ZXJyaWRlKSB7XHJcbiAgICAgICAgY29weVByb3BzKHJlcywgb3ZlcnJpZGUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlcztcclxufVxyXG4vKiogVXBkYXRlIEV0YSdzIGJhc2UgY29uZmlnICovXHJcbmZ1bmN0aW9uIGNvbmZpZ3VyZShvcHRpb25zKSB7XHJcbiAgICByZXR1cm4gY29weVByb3BzKGNvbmZpZywgb3B0aW9ucyk7XHJcbn1cblxuLyogRU5EIFRZUEVTICovXHJcbi8qKlxyXG4gKiBUYWtlcyBhIHRlbXBsYXRlIHN0cmluZyBhbmQgcmV0dXJucyBhIHRlbXBsYXRlIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIGNhbGxlZCB3aXRoIChkYXRhLCBjb25maWcsIFtjYl0pXHJcbiAqXHJcbiAqIEBwYXJhbSBzdHIgLSBUaGUgdGVtcGxhdGUgc3RyaW5nXHJcbiAqIEBwYXJhbSBjb25maWcgLSBBIGN1c3RvbSBjb25maWd1cmF0aW9uIG9iamVjdCAob3B0aW9uYWwpXHJcbiAqXHJcbiAqICoqRXhhbXBsZSoqXHJcbiAqXHJcbiAqIGBgYGpzXHJcbiAqIGxldCBjb21waWxlZEZuID0gZXRhLmNvbXBpbGUoXCJIaSA8JT0gaXQudXNlciAlPlwiKVxyXG4gKiAvLyBmdW5jdGlvbiBhbm9ueW1vdXMoKVxyXG4gKiBsZXQgY29tcGlsZWRGblN0ciA9IGNvbXBpbGVkRm4udG9TdHJpbmcoKVxyXG4gKiAvLyBcImZ1bmN0aW9uIGFub255bW91cyhpdCxFLGNiXFxuKSB7XFxudmFyIHRSPScnLGluY2x1ZGU9RS5pbmNsdWRlLmJpbmQoRSksaW5jbHVkZUZpbGU9RS5pbmNsdWRlRmlsZS5iaW5kKEUpO3RSKz0nSGkgJzt0Uis9RS5lKGl0LnVzZXIpO2lmKGNiKXtjYihudWxsLHRSKX0gcmV0dXJuIHRSXFxufVwiXHJcbiAqIGBgYFxyXG4gKi9cclxuZnVuY3Rpb24gY29tcGlsZShzdHIsIGNvbmZpZykge1xyXG4gICAgdmFyIG9wdGlvbnMgPSBnZXRDb25maWcoY29uZmlnIHx8IHt9KTtcclxuICAgIC8qIEFTWU5DIEhBTkRMSU5HICovXHJcbiAgICAvLyBUaGUgYmVsb3cgY29kZSBpcyBtb2RpZmllZCBmcm9tIG1kZS9lanMuIEFsbCBjcmVkaXQgc2hvdWxkIGdvIHRvIHRoZW0uXHJcbiAgICB2YXIgY3RvciA9IG9wdGlvbnMuYXN5bmMgPyBnZXRBc3luY0Z1bmN0aW9uQ29uc3RydWN0b3IoKSA6IEZ1bmN0aW9uO1xyXG4gICAgLyogRU5EIEFTWU5DIEhBTkRMSU5HICovXHJcbiAgICB0cnkge1xyXG4gICAgICAgIHJldHVybiBuZXcgY3RvcihvcHRpb25zLnZhck5hbWUsICdFJywgLy8gRXRhQ29uZmlnXHJcbiAgICAgICAgJ2NiJywgLy8gb3B0aW9uYWwgY2FsbGJhY2tcclxuICAgICAgICBjb21waWxlVG9TdHJpbmcoc3RyLCBvcHRpb25zKSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3LWZ1bmNcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBTeW50YXhFcnJvcikge1xyXG4gICAgICAgICAgICB0aHJvdyBFdGFFcnIoJ0JhZCB0ZW1wbGF0ZSBzeW50YXhcXG5cXG4nICtcclxuICAgICAgICAgICAgICAgIGUubWVzc2FnZSArXHJcbiAgICAgICAgICAgICAgICAnXFxuJyArXHJcbiAgICAgICAgICAgICAgICBBcnJheShlLm1lc3NhZ2UubGVuZ3RoICsgMSkuam9pbignPScpICtcclxuICAgICAgICAgICAgICAgICdcXG4nICtcclxuICAgICAgICAgICAgICAgIGNvbXBpbGVUb1N0cmluZyhzdHIsIG9wdGlvbnMpICtcclxuICAgICAgICAgICAgICAgICdcXG4nIC8vIFRoaXMgd2lsbCBwdXQgYW4gZXh0cmEgbmV3bGluZSBiZWZvcmUgdGhlIGNhbGxzdGFjayBmb3IgZXh0cmEgcmVhZGFiaWxpdHlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IGU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XG5cbnZhciBfQk9NID0gL15cXHVGRUZGLztcclxuLyogRU5EIFRZUEVTICovXHJcbi8qKlxyXG4gKiBHZXQgdGhlIHBhdGggdG8gdGhlIGluY2x1ZGVkIGZpbGUgZnJvbSB0aGUgcGFyZW50IGZpbGUgcGF0aCBhbmQgdGhlXHJcbiAqIHNwZWNpZmllZCBwYXRoLlxyXG4gKlxyXG4gKiBJZiBgbmFtZWAgZG9lcyBub3QgaGF2ZSBhbiBleHRlbnNpb24sIGl0IHdpbGwgZGVmYXVsdCB0byBgLmV0YWBcclxuICpcclxuICogQHBhcmFtIG5hbWUgc3BlY2lmaWVkIHBhdGhcclxuICogQHBhcmFtIHBhcmVudGZpbGUgcGFyZW50IGZpbGUgcGF0aFxyXG4gKiBAcGFyYW0gaXNEaXJlY3Rvcnkgd2hldGhlciBwYXJlbnRmaWxlIGlzIGEgZGlyZWN0b3J5XHJcbiAqIEByZXR1cm4gYWJzb2x1dGUgcGF0aCB0byB0ZW1wbGF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0V2hvbGVGaWxlUGF0aChuYW1lLCBwYXJlbnRmaWxlLCBpc0RpcmVjdG9yeSkge1xyXG4gICAgdmFyIGluY2x1ZGVQYXRoID0gcGF0aC5yZXNvbHZlKGlzRGlyZWN0b3J5ID8gcGFyZW50ZmlsZSA6IHBhdGguZGlybmFtZShwYXJlbnRmaWxlKSwgLy8gcmV0dXJucyBkaXJlY3RvcnkgdGhlIHBhcmVudCBmaWxlIGlzIGluXHJcbiAgICBuYW1lIC8vIGZpbGVcclxuICAgICkgKyAocGF0aC5leHRuYW1lKG5hbWUpID8gJycgOiAnLmV0YScpO1xyXG4gICAgcmV0dXJuIGluY2x1ZGVQYXRoO1xyXG59XHJcbi8qKlxyXG4gKiBHZXQgdGhlIGFic29sdXRlIHBhdGggdG8gYW4gaW5jbHVkZWQgdGVtcGxhdGVcclxuICpcclxuICogSWYgdGhpcyBpcyBjYWxsZWQgd2l0aCBhbiBhYnNvbHV0ZSBwYXRoIChmb3IgZXhhbXBsZSwgc3RhcnRpbmcgd2l0aCAnLycgb3IgJ0M6XFwnKVxyXG4gKiB0aGVuIEV0YSB3aWxsIGF0dGVtcHQgdG8gcmVzb2x2ZSB0aGUgYWJzb2x1dGUgcGF0aCB3aXRoaW4gb3B0aW9ucy52aWV3cy4gSWYgaXQgY2Fubm90LFxyXG4gKiBFdGEgd2lsbCBmYWxsYmFjayB0byBvcHRpb25zLnJvb3Qgb3IgJy8nXHJcbiAqXHJcbiAqIElmIHRoaXMgaXMgY2FsbGVkIHdpdGggYSByZWxhdGl2ZSBwYXRoLCBFdGEgd2lsbDpcclxuICogLSBMb29rIHJlbGF0aXZlIHRvIHRoZSBjdXJyZW50IHRlbXBsYXRlIChpZiB0aGUgY3VycmVudCB0ZW1wbGF0ZSBoYXMgdGhlIGBmaWxlbmFtZWAgcHJvcGVydHkpXHJcbiAqIC0gTG9vayBpbnNpZGUgZWFjaCBkaXJlY3RvcnkgaW4gb3B0aW9ucy52aWV3c1xyXG4gKlxyXG4gKiBOb3RlOiBpZiBFdGEgaXMgdW5hYmxlIHRvIGZpbmQgYSB0ZW1wbGF0ZSB1c2luZyBwYXRoIGFuZCBvcHRpb25zLCBpdCB3aWxsIHRocm93IGFuIGVycm9yLlxyXG4gKlxyXG4gKiBAcGFyYW0gcGF0aCAgICBzcGVjaWZpZWQgcGF0aFxyXG4gKiBAcGFyYW0gb3B0aW9ucyBjb21waWxhdGlvbiBvcHRpb25zXHJcbiAqIEByZXR1cm4gYWJzb2x1dGUgcGF0aCB0byB0ZW1wbGF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0UGF0aChwYXRoLCBvcHRpb25zKSB7XHJcbiAgICB2YXIgaW5jbHVkZVBhdGggPSBmYWxzZTtcclxuICAgIHZhciB2aWV3cyA9IG9wdGlvbnMudmlld3M7XHJcbiAgICB2YXIgc2VhcmNoZWRQYXRocyA9IFtdO1xyXG4gICAgLy8gSWYgdGhlc2UgZm91ciB2YWx1ZXMgYXJlIHRoZSBzYW1lLFxyXG4gICAgLy8gZ2V0UGF0aCgpIHdpbGwgcmV0dXJuIHRoZSBzYW1lIHJlc3VsdCBldmVyeSB0aW1lLlxyXG4gICAgLy8gV2UgY2FuIGNhY2hlIHRoZSByZXN1bHQgdG8gYXZvaWQgZXhwZW5zaXZlXHJcbiAgICAvLyBmaWxlIG9wZXJhdGlvbnMuXHJcbiAgICB2YXIgcGF0aE9wdGlvbnMgPSBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgZmlsZW5hbWU6IG9wdGlvbnMuZmlsZW5hbWUsXHJcbiAgICAgICAgcGF0aDogcGF0aCxcclxuICAgICAgICByb290OiBvcHRpb25zLnJvb3QsXHJcbiAgICAgICAgdmlld3M6IG9wdGlvbnMudmlld3NcclxuICAgIH0pO1xyXG4gICAgaWYgKG9wdGlvbnMuY2FjaGUgJiYgb3B0aW9ucy5maWxlcGF0aENhY2hlICYmIG9wdGlvbnMuZmlsZXBhdGhDYWNoZVtwYXRoT3B0aW9uc10pIHtcclxuICAgICAgICAvLyBVc2UgdGhlIGNhY2hlZCBmaWxlcGF0aFxyXG4gICAgICAgIHJldHVybiBvcHRpb25zLmZpbGVwYXRoQ2FjaGVbcGF0aE9wdGlvbnNdO1xyXG4gICAgfVxyXG4gICAgLyoqIEFkZCBhIGZpbGVwYXRoIHRvIHRoZSBsaXN0IG9mIHBhdGhzIHdlJ3ZlIGNoZWNrZWQgZm9yIGEgdGVtcGxhdGUgKi9cclxuICAgIGZ1bmN0aW9uIGFkZFBhdGhUb1NlYXJjaGVkKHBhdGhTZWFyY2hlZCkge1xyXG4gICAgICAgIGlmICghc2VhcmNoZWRQYXRocy5pbmNsdWRlcyhwYXRoU2VhcmNoZWQpKSB7XHJcbiAgICAgICAgICAgIHNlYXJjaGVkUGF0aHMucHVzaChwYXRoU2VhcmNoZWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogVGFrZSBhIGZpbGVwYXRoIChsaWtlICdwYXJ0aWFscy9teXBhcnRpYWwuZXRhJykuIEF0dGVtcHQgdG8gZmluZCB0aGUgdGVtcGxhdGUgZmlsZSBpbnNpZGUgYHZpZXdzYDtcclxuICAgICAqIHJldHVybiB0aGUgcmVzdWx0aW5nIHRlbXBsYXRlIGZpbGUgcGF0aCwgb3IgYGZhbHNlYCB0byBpbmRpY2F0ZSB0aGF0IHRoZSB0ZW1wbGF0ZSB3YXMgbm90IGZvdW5kLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB2aWV3cyB0aGUgZmlsZXBhdGggdGhhdCBob2xkcyB0ZW1wbGF0ZXMsIG9yIGFuIGFycmF5IG9mIGZpbGVwYXRocyB0aGF0IGhvbGQgdGVtcGxhdGVzXHJcbiAgICAgKiBAcGFyYW0gcGF0aCB0aGUgcGF0aCB0byB0aGUgdGVtcGxhdGVcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gc2VhcmNoVmlld3Modmlld3MsIHBhdGgpIHtcclxuICAgICAgICB2YXIgZmlsZVBhdGg7XHJcbiAgICAgICAgLy8gSWYgdmlld3MgaXMgYW4gYXJyYXksIHRoZW4gbG9vcCB0aHJvdWdoIGVhY2ggZGlyZWN0b3J5XHJcbiAgICAgICAgLy8gQW5kIGF0dGVtcHQgdG8gZmluZCB0aGUgdGVtcGxhdGVcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2aWV3cykgJiZcclxuICAgICAgICAgICAgdmlld3Muc29tZShmdW5jdGlvbiAodikge1xyXG4gICAgICAgICAgICAgICAgZmlsZVBhdGggPSBnZXRXaG9sZUZpbGVQYXRoKHBhdGgsIHYsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgYWRkUGF0aFRvU2VhcmNoZWQoZmlsZVBhdGgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGV4aXN0c1N5bmMoZmlsZVBhdGgpO1xyXG4gICAgICAgICAgICB9KSkge1xyXG4gICAgICAgICAgICAvLyBJZiB0aGUgYWJvdmUgcmV0dXJuZWQgdHJ1ZSwgd2Uga25vdyB0aGF0IHRoZSBmaWxlUGF0aCB3YXMganVzdCBzZXQgdG8gYSBwYXRoXHJcbiAgICAgICAgICAgIC8vIFRoYXQgZXhpc3RzIChBcnJheS5zb21lKCkgcmV0dXJucyBhcyBzb29uIGFzIGl0IGZpbmRzIGEgdmFsaWQgZWxlbWVudClcclxuICAgICAgICAgICAgcmV0dXJuIGZpbGVQYXRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlb2Ygdmlld3MgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIC8vIFNlYXJjaCBmb3IgdGhlIGZpbGUgaWYgdmlld3MgaXMgYSBzaW5nbGUgZGlyZWN0b3J5XHJcbiAgICAgICAgICAgIGZpbGVQYXRoID0gZ2V0V2hvbGVGaWxlUGF0aChwYXRoLCB2aWV3cywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGFkZFBhdGhUb1NlYXJjaGVkKGZpbGVQYXRoKTtcclxuICAgICAgICAgICAgaWYgKGV4aXN0c1N5bmMoZmlsZVBhdGgpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmlsZVBhdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gVW5hYmxlIHRvIGZpbmQgYSBmaWxlXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgLy8gUGF0aCBzdGFydHMgd2l0aCAnLycsICdDOlxcJywgZXRjLlxyXG4gICAgdmFyIG1hdGNoID0gL15bQS1aYS16XSs6XFxcXHxeXFwvLy5leGVjKHBhdGgpO1xyXG4gICAgLy8gQWJzb2x1dGUgcGF0aCwgbGlrZSAvcGFydGlhbHMvcGFydGlhbC5ldGFcclxuICAgIGlmIChtYXRjaCAmJiBtYXRjaC5sZW5ndGgpIHtcclxuICAgICAgICAvLyBXZSBoYXZlIHRvIHRyaW0gdGhlIGJlZ2lubmluZyAnLycgb2ZmIHRoZSBwYXRoLCBvciBlbHNlXHJcbiAgICAgICAgLy8gcGF0aC5yZXNvbHZlKGRpciwgcGF0aCkgd2lsbCBhbHdheXMgcmVzb2x2ZSB0byBqdXN0IHBhdGhcclxuICAgICAgICB2YXIgZm9ybWF0dGVkUGF0aCA9IHBhdGgucmVwbGFjZSgvXlxcLyovLCAnJyk7XHJcbiAgICAgICAgLy8gRmlyc3QsIHRyeSB0byByZXNvbHZlIHRoZSBwYXRoIHdpdGhpbiBvcHRpb25zLnZpZXdzXHJcbiAgICAgICAgaW5jbHVkZVBhdGggPSBzZWFyY2hWaWV3cyh2aWV3cywgZm9ybWF0dGVkUGF0aCk7XHJcbiAgICAgICAgaWYgKCFpbmNsdWRlUGF0aCkge1xyXG4gICAgICAgICAgICAvLyBJZiB0aGF0IGZhaWxzLCBzZWFyY2hWaWV3cyB3aWxsIHJldHVybiBmYWxzZS4gVHJ5IHRvIGZpbmQgdGhlIHBhdGhcclxuICAgICAgICAgICAgLy8gaW5zaWRlIG9wdGlvbnMucm9vdCAoYnkgZGVmYXVsdCAnLycsIHRoZSBiYXNlIG9mIHRoZSBmaWxlc3lzdGVtKVxyXG4gICAgICAgICAgICB2YXIgcGF0aEZyb21Sb290ID0gZ2V0V2hvbGVGaWxlUGF0aChmb3JtYXR0ZWRQYXRoLCBvcHRpb25zLnJvb3QgfHwgJy8nLCB0cnVlKTtcclxuICAgICAgICAgICAgYWRkUGF0aFRvU2VhcmNoZWQocGF0aEZyb21Sb290KTtcclxuICAgICAgICAgICAgaW5jbHVkZVBhdGggPSBwYXRoRnJvbVJvb3Q7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy8gUmVsYXRpdmUgcGF0aHNcclxuICAgICAgICAvLyBMb29rIHJlbGF0aXZlIHRvIGEgcGFzc2VkIGZpbGVuYW1lIGZpcnN0XHJcbiAgICAgICAgaWYgKG9wdGlvbnMuZmlsZW5hbWUpIHtcclxuICAgICAgICAgICAgdmFyIGZpbGVQYXRoID0gZ2V0V2hvbGVGaWxlUGF0aChwYXRoLCBvcHRpb25zLmZpbGVuYW1lKTtcclxuICAgICAgICAgICAgYWRkUGF0aFRvU2VhcmNoZWQoZmlsZVBhdGgpO1xyXG4gICAgICAgICAgICBpZiAoZXhpc3RzU3luYyhmaWxlUGF0aCkpIHtcclxuICAgICAgICAgICAgICAgIGluY2x1ZGVQYXRoID0gZmlsZVBhdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gVGhlbiBsb29rIGZvciB0aGUgdGVtcGxhdGUgaW4gb3B0aW9ucy52aWV3c1xyXG4gICAgICAgIGlmICghaW5jbHVkZVBhdGgpIHtcclxuICAgICAgICAgICAgaW5jbHVkZVBhdGggPSBzZWFyY2hWaWV3cyh2aWV3cywgcGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghaW5jbHVkZVBhdGgpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXRhRXJyKCdDb3VsZCBub3QgZmluZCB0aGUgdGVtcGxhdGUgXCInICsgcGF0aCArICdcIi4gUGF0aHMgdHJpZWQ6ICcgKyBzZWFyY2hlZFBhdGhzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBJZiBjYWNoaW5nIGFuZCBmaWxlcGF0aENhY2hlIGFyZSBlbmFibGVkLFxyXG4gICAgLy8gY2FjaGUgdGhlIGlucHV0ICYgb3V0cHV0IG9mIHRoaXMgZnVuY3Rpb24uXHJcbiAgICBpZiAob3B0aW9ucy5jYWNoZSAmJiBvcHRpb25zLmZpbGVwYXRoQ2FjaGUpIHtcclxuICAgICAgICBvcHRpb25zLmZpbGVwYXRoQ2FjaGVbcGF0aE9wdGlvbnNdID0gaW5jbHVkZVBhdGg7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaW5jbHVkZVBhdGg7XHJcbn1cclxuLyoqXHJcbiAqIFJlYWRzIGEgZmlsZSBzeW5jaHJvbm91c2x5XHJcbiAqL1xyXG5mdW5jdGlvbiByZWFkRmlsZShmaWxlUGF0aCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gcmVhZEZpbGVTeW5jKGZpbGVQYXRoKS50b1N0cmluZygpLnJlcGxhY2UoX0JPTSwgJycpOyAvLyBUT0RPOiBpcyByZXBsYWNpbmcgQk9NJ3MgbmVjZXNzYXJ5P1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKF9hKSB7XHJcbiAgICAgICAgdGhyb3cgRXRhRXJyKFwiRmFpbGVkIHRvIHJlYWQgdGVtcGxhdGUgYXQgJ1wiICsgZmlsZVBhdGggKyBcIidcIik7XHJcbiAgICB9XHJcbn1cblxuLy8gZXhwcmVzcyBpcyBzZXQgbGlrZTogYXBwLmVuZ2luZSgnaHRtbCcsIHJlcXVpcmUoJ2V0YScpLnJlbmRlckZpbGUpXHJcbi8qIEVORCBUWVBFUyAqL1xyXG4vKipcclxuICogUmVhZHMgYSB0ZW1wbGF0ZSwgY29tcGlsZXMgaXQgaW50byBhIGZ1bmN0aW9uLCBjYWNoZXMgaXQgaWYgY2FjaGluZyBpc24ndCBkaXNhYmxlZCwgcmV0dXJucyB0aGUgZnVuY3Rpb25cclxuICpcclxuICogQHBhcmFtIGZpbGVQYXRoIEFic29sdXRlIHBhdGggdG8gdGVtcGxhdGUgZmlsZVxyXG4gKiBAcGFyYW0gb3B0aW9ucyBFdGEgY29uZmlndXJhdGlvbiBvdmVycmlkZXNcclxuICogQHBhcmFtIG5vQ2FjaGUgT3B0aW9uYWxseSwgbWFrZSBFdGEgbm90IGNhY2hlIHRoZSB0ZW1wbGF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gbG9hZEZpbGUoZmlsZVBhdGgsIG9wdGlvbnMsIG5vQ2FjaGUpIHtcclxuICAgIHZhciBjb25maWcgPSBnZXRDb25maWcob3B0aW9ucyk7XHJcbiAgICB2YXIgdGVtcGxhdGUgPSByZWFkRmlsZShmaWxlUGF0aCk7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHZhciBjb21waWxlZFRlbXBsYXRlID0gY29tcGlsZSh0ZW1wbGF0ZSwgY29uZmlnKTtcclxuICAgICAgICBpZiAoIW5vQ2FjaGUpIHtcclxuICAgICAgICAgICAgY29uZmlnLnRlbXBsYXRlcy5kZWZpbmUoY29uZmlnLmZpbGVuYW1lLCBjb21waWxlZFRlbXBsYXRlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvbXBpbGVkVGVtcGxhdGU7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIHRocm93IEV0YUVycignTG9hZGluZyBmaWxlOiAnICsgZmlsZVBhdGggKyAnIGZhaWxlZDpcXG5cXG4nICsgZS5tZXNzYWdlKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogR2V0IHRoZSB0ZW1wbGF0ZSBmcm9tIGEgc3RyaW5nIG9yIGEgZmlsZSwgZWl0aGVyIGNvbXBpbGVkIG9uLXRoZS1mbHkgb3JcclxuICogcmVhZCBmcm9tIGNhY2hlIChpZiBlbmFibGVkKSwgYW5kIGNhY2hlIHRoZSB0ZW1wbGF0ZSBpZiBuZWVkZWQuXHJcbiAqXHJcbiAqIElmIGBvcHRpb25zLmNhY2hlYCBpcyB0cnVlLCB0aGlzIGZ1bmN0aW9uIHJlYWRzIHRoZSBmaWxlIGZyb21cclxuICogYG9wdGlvbnMuZmlsZW5hbWVgIHNvIGl0IG11c3QgYmUgc2V0IHByaW9yIHRvIGNhbGxpbmcgdGhpcyBmdW5jdGlvbi5cclxuICpcclxuICogQHBhcmFtIG9wdGlvbnMgICBjb21waWxhdGlvbiBvcHRpb25zXHJcbiAqIEByZXR1cm4gRXRhIHRlbXBsYXRlIGZ1bmN0aW9uXHJcbiAqL1xyXG5mdW5jdGlvbiBoYW5kbGVDYWNoZSQxKG9wdGlvbnMpIHtcclxuICAgIHZhciBmaWxlbmFtZSA9IG9wdGlvbnMuZmlsZW5hbWU7XHJcbiAgICBpZiAob3B0aW9ucy5jYWNoZSkge1xyXG4gICAgICAgIHZhciBmdW5jID0gb3B0aW9ucy50ZW1wbGF0ZXMuZ2V0KGZpbGVuYW1lKTtcclxuICAgICAgICBpZiAoZnVuYykge1xyXG4gICAgICAgICAgICByZXR1cm4gZnVuYztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxvYWRGaWxlKGZpbGVuYW1lLCBvcHRpb25zKTtcclxuICAgIH1cclxuICAgIC8vIENhY2hpbmcgaXMgZGlzYWJsZWQsIHNvIHBhc3Mgbm9DYWNoZSA9IHRydWVcclxuICAgIHJldHVybiBsb2FkRmlsZShmaWxlbmFtZSwgb3B0aW9ucywgdHJ1ZSk7XHJcbn1cclxuLyoqXHJcbiAqIFRyeSBjYWxsaW5nIGhhbmRsZUNhY2hlIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMgYW5kIGRhdGEgYW5kIGNhbGwgdGhlXHJcbiAqIGNhbGxiYWNrIHdpdGggdGhlIHJlc3VsdC4gSWYgYW4gZXJyb3Igb2NjdXJzLCBjYWxsIHRoZSBjYWxsYmFjayB3aXRoXHJcbiAqIHRoZSBlcnJvci4gVXNlZCBieSByZW5kZXJGaWxlKCkuXHJcbiAqXHJcbiAqIEBwYXJhbSBkYXRhIHRlbXBsYXRlIGRhdGFcclxuICogQHBhcmFtIG9wdGlvbnMgY29tcGlsYXRpb24gb3B0aW9uc1xyXG4gKiBAcGFyYW0gY2IgY2FsbGJhY2tcclxuICovXHJcbmZ1bmN0aW9uIHRyeUhhbmRsZUNhY2hlKGRhdGEsIG9wdGlvbnMsIGNiKSB7XHJcbiAgICBpZiAoY2IpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAvLyBOb3RlOiBpZiB0aGVyZSBpcyBhbiBlcnJvciB3aGlsZSByZW5kZXJpbmcgdGhlIHRlbXBsYXRlLFxyXG4gICAgICAgICAgICAvLyBJdCB3aWxsIGJ1YmJsZSB1cCBhbmQgYmUgY2F1Z2h0IGhlcmVcclxuICAgICAgICAgICAgdmFyIHRlbXBsYXRlRm4gPSBoYW5kbGVDYWNoZSQxKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZUZuKGRhdGEsIG9wdGlvbnMsIGNiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICAvLyBObyBjYWxsYmFjaywgdHJ5IHJldHVybmluZyBhIHByb21pc2VcclxuICAgICAgICBpZiAodHlwZW9mIHByb21pc2VJbXBsID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgcHJvbWlzZUltcGwoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcGxhdGVGbiA9IGhhbmRsZUNhY2hlJDEob3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRlbXBsYXRlRm4oZGF0YSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IEV0YUVycihcIlBsZWFzZSBwcm92aWRlIGEgY2FsbGJhY2sgZnVuY3Rpb24sIHRoaXMgZW52IGRvZXNuJ3Qgc3VwcG9ydCBQcm9taXNlc1wiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIEdldCB0aGUgdGVtcGxhdGUgZnVuY3Rpb24uXHJcbiAqXHJcbiAqIElmIGBvcHRpb25zLmNhY2hlYCBpcyBgdHJ1ZWAsIHRoZW4gdGhlIHRlbXBsYXRlIGlzIGNhY2hlZC5cclxuICpcclxuICogVGhpcyByZXR1cm5zIGEgdGVtcGxhdGUgZnVuY3Rpb24gYW5kIHRoZSBjb25maWcgb2JqZWN0IHdpdGggd2hpY2ggdGhhdCB0ZW1wbGF0ZSBmdW5jdGlvbiBzaG91bGQgYmUgY2FsbGVkLlxyXG4gKlxyXG4gKiBAcmVtYXJrc1xyXG4gKlxyXG4gKiBJdCdzIGltcG9ydGFudCB0aGF0IHRoaXMgcmV0dXJucyBhIGNvbmZpZyBvYmplY3Qgd2l0aCBgZmlsZW5hbWVgIHNldC5cclxuICogT3RoZXJ3aXNlLCB0aGUgaW5jbHVkZWQgZmlsZSB3b3VsZCBub3QgYmUgYWJsZSB0byB1c2UgcmVsYXRpdmUgcGF0aHNcclxuICpcclxuICogQHBhcmFtIHBhdGggcGF0aCBmb3IgdGhlIHNwZWNpZmllZCBmaWxlIChpZiByZWxhdGl2ZSwgc3BlY2lmeSBgdmlld3NgIG9uIGBvcHRpb25zYClcclxuICogQHBhcmFtIG9wdGlvbnMgY29tcGlsYXRpb24gb3B0aW9uc1xyXG4gKiBAcmV0dXJuIFtFdGEgdGVtcGxhdGUgZnVuY3Rpb24sIG5ldyBjb25maWcgb2JqZWN0XVxyXG4gKi9cclxuZnVuY3Rpb24gaW5jbHVkZUZpbGUocGF0aCwgb3B0aW9ucykge1xyXG4gICAgLy8gdGhlIGJlbG93IGNyZWF0ZXMgYSBuZXcgb3B0aW9ucyBvYmplY3QsIHVzaW5nIHRoZSBwYXJlbnQgZmlsZXBhdGggb2YgdGhlIG9sZCBvcHRpb25zIG9iamVjdCBhbmQgdGhlIHBhdGhcclxuICAgIHZhciBuZXdGaWxlT3B0aW9ucyA9IGdldENvbmZpZyh7IGZpbGVuYW1lOiBnZXRQYXRoKHBhdGgsIG9wdGlvbnMpIH0sIG9wdGlvbnMpO1xyXG4gICAgLy8gVE9ETzogbWFrZSBzdXJlIHByb3BlcnRpZXMgYXJlIGN1cnJlY3RseSBjb3BpZWQgb3ZlclxyXG4gICAgcmV0dXJuIFtoYW5kbGVDYWNoZSQxKG5ld0ZpbGVPcHRpb25zKSwgbmV3RmlsZU9wdGlvbnNdO1xyXG59XHJcbmZ1bmN0aW9uIHJlbmRlckZpbGUoZmlsZW5hbWUsIGRhdGEsIGNvbmZpZywgY2IpIHtcclxuICAgIC8qXHJcbiAgICBIZXJlIHdlIGhhdmUgc29tZSBmdW5jdGlvbiBvdmVybG9hZGluZy5cclxuICAgIEVzc2VudGlhbGx5LCB0aGUgZmlyc3QgMiBhcmd1bWVudHMgdG8gcmVuZGVyRmlsZSBzaG91bGQgYWx3YXlzIGJlIHRoZSBmaWxlbmFtZSBhbmQgZGF0YVxyXG4gICAgSG93ZXZlciwgd2l0aCBFeHByZXNzLCBjb25maWd1cmF0aW9uIG9wdGlvbnMgd2lsbCBiZSBwYXNzZWQgYWxvbmcgd2l0aCB0aGUgZGF0YS5cclxuICAgIFRodXMsIEV4cHJlc3Mgd2lsbCBjYWxsIHJlbmRlckZpbGUgd2l0aCAoZmlsZW5hbWUsIGRhdGFBbmRPcHRpb25zLCBjYilcclxuICAgIEFuZCB3ZSB3YW50IHRvIGFsc28gbWFrZSAoZmlsZW5hbWUsIGRhdGEsIG9wdGlvbnMsIGNiKSBhdmFpbGFibGVcclxuICAgICovXHJcbiAgICB2YXIgcmVuZGVyQ29uZmlnO1xyXG4gICAgdmFyIGNhbGxiYWNrO1xyXG4gICAgZGF0YSA9IGRhdGEgfHwge307IC8vIElmIGRhdGEgaXMgdW5kZWZpbmVkLCB3ZSBkb24ndCB3YW50IGFjY2Vzc2luZyBkYXRhLnNldHRpbmdzIHRvIGVycm9yXHJcbiAgICAvLyBGaXJzdCwgYXNzaWduIG91ciBjYWxsYmFjayBmdW5jdGlvbiB0byBgY2FsbGJhY2tgXHJcbiAgICAvLyBXZSBjYW4gbGVhdmUgaXQgdW5kZWZpbmVkIGlmIG5laXRoZXIgcGFyYW1ldGVyIGlzIGEgZnVuY3Rpb247XHJcbiAgICAvLyBDYWxsYmFja3MgYXJlIG9wdGlvbmFsXHJcbiAgICBpZiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgLy8gVGhlIDR0aCBhcmd1bWVudCBpcyB0aGUgY2FsbGJhY2tcclxuICAgICAgICBjYWxsYmFjayA9IGNiO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIC8vIFRoZSAzcmQgYXJnIGlzIHRoZSBjYWxsYmFja1xyXG4gICAgICAgIGNhbGxiYWNrID0gY29uZmlnO1xyXG4gICAgfVxyXG4gICAgLy8gSWYgdGhlcmUgaXMgYSBjb25maWcgb2JqZWN0IHBhc3NlZCBpbiBleHBsaWNpdGx5LCB1c2UgaXRcclxuICAgIGlmICh0eXBlb2YgY29uZmlnID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIHJlbmRlckNvbmZpZyA9IGdldENvbmZpZyhjb25maWcgfHwge30pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBnZXQgdGhlIGNvbmZpZyBmcm9tIHRoZSBkYXRhIG9iamVjdFxyXG4gICAgICAgIC8vIEFuZCB0aGVuIGdyYWIgc29tZSBjb25maWcgb3B0aW9ucyBmcm9tIGRhdGEuc2V0dGluZ3NcclxuICAgICAgICAvLyBXaGljaCBpcyB3aGVyZSBFeHByZXNzIHNvbWV0aW1lcyBzdG9yZXMgdGhlbVxyXG4gICAgICAgIHJlbmRlckNvbmZpZyA9IGdldENvbmZpZyhkYXRhKTtcclxuICAgICAgICBpZiAoZGF0YS5zZXR0aW5ncykge1xyXG4gICAgICAgICAgICAvLyBQdWxsIGEgZmV3IHRoaW5ncyBmcm9tIGtub3duIGxvY2F0aW9uc1xyXG4gICAgICAgICAgICBpZiAoZGF0YS5zZXR0aW5ncy52aWV3cykge1xyXG4gICAgICAgICAgICAgICAgcmVuZGVyQ29uZmlnLnZpZXdzID0gZGF0YS5zZXR0aW5ncy52aWV3cztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZGF0YS5zZXR0aW5nc1sndmlldyBjYWNoZSddKSB7XHJcbiAgICAgICAgICAgICAgICByZW5kZXJDb25maWcuY2FjaGUgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIFVuZG9jdW1lbnRlZCBhZnRlciBFeHByZXNzIDIsIGJ1dCBzdGlsbCB1c2FibGUsIGVzcC4gZm9yXHJcbiAgICAgICAgICAgIC8vIGl0ZW1zIHRoYXQgYXJlIHVuc2FmZSB0byBiZSBwYXNzZWQgYWxvbmcgd2l0aCBkYXRhLCBsaWtlIGByb290YFxyXG4gICAgICAgICAgICB2YXIgdmlld09wdHMgPSBkYXRhLnNldHRpbmdzWyd2aWV3IG9wdGlvbnMnXTtcclxuICAgICAgICAgICAgaWYgKHZpZXdPcHRzKSB7XHJcbiAgICAgICAgICAgICAgICBjb3B5UHJvcHMocmVuZGVyQ29uZmlnLCB2aWV3T3B0cyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBTZXQgdGhlIGZpbGVuYW1lIG9wdGlvbiBvbiB0aGUgdGVtcGxhdGVcclxuICAgIC8vIFRoaXMgd2lsbCBmaXJzdCB0cnkgdG8gcmVzb2x2ZSB0aGUgZmlsZSBwYXRoIChzZWUgZ2V0UGF0aCBmb3IgZGV0YWlscylcclxuICAgIHJlbmRlckNvbmZpZy5maWxlbmFtZSA9IGdldFBhdGgoZmlsZW5hbWUsIHJlbmRlckNvbmZpZyk7XHJcbiAgICByZXR1cm4gdHJ5SGFuZGxlQ2FjaGUoZGF0YSwgcmVuZGVyQ29uZmlnLCBjYWxsYmFjayk7XHJcbn1cclxuZnVuY3Rpb24gcmVuZGVyRmlsZUFzeW5jKGZpbGVuYW1lLCBkYXRhLCBjb25maWcsIGNiKSB7XHJcbiAgICByZXR1cm4gcmVuZGVyRmlsZShmaWxlbmFtZSwgdHlwZW9mIGNvbmZpZyA9PT0gJ2Z1bmN0aW9uJyA/IF9fYXNzaWduKF9fYXNzaWduKHt9LCBkYXRhKSwgeyBhc3luYzogdHJ1ZSB9KSA6IGRhdGEsIHR5cGVvZiBjb25maWcgPT09ICdvYmplY3QnID8gX19hc3NpZ24oX19hc3NpZ24oe30sIGNvbmZpZyksIHsgYXN5bmM6IHRydWUgfSkgOiBjb25maWcsIGNiKTtcclxufVxuXG4vKiBFTkQgVFlQRVMgKi9cclxuLyoqXHJcbiAqIENhbGxlZCB3aXRoIGBpbmNsdWRlRmlsZShwYXRoLCBkYXRhKWBcclxuICovXHJcbmZ1bmN0aW9uIGluY2x1ZGVGaWxlSGVscGVyKHBhdGgsIGRhdGEpIHtcclxuICAgIHZhciB0ZW1wbGF0ZUFuZENvbmZpZyA9IGluY2x1ZGVGaWxlKHBhdGgsIHRoaXMpO1xyXG4gICAgcmV0dXJuIHRlbXBsYXRlQW5kQ29uZmlnWzBdKGRhdGEsIHRlbXBsYXRlQW5kQ29uZmlnWzFdKTtcclxufVxuXG4vKiBFTkQgVFlQRVMgKi9cclxuZnVuY3Rpb24gaGFuZGxlQ2FjaGUodGVtcGxhdGUsIG9wdGlvbnMpIHtcclxuICAgIGlmIChvcHRpb25zLmNhY2hlICYmIG9wdGlvbnMubmFtZSAmJiBvcHRpb25zLnRlbXBsYXRlcy5nZXQob3B0aW9ucy5uYW1lKSkge1xyXG4gICAgICAgIHJldHVybiBvcHRpb25zLnRlbXBsYXRlcy5nZXQob3B0aW9ucy5uYW1lKTtcclxuICAgIH1cclxuICAgIHZhciB0ZW1wbGF0ZUZ1bmMgPSB0eXBlb2YgdGVtcGxhdGUgPT09ICdmdW5jdGlvbicgPyB0ZW1wbGF0ZSA6IGNvbXBpbGUodGVtcGxhdGUsIG9wdGlvbnMpO1xyXG4gICAgLy8gTm90ZSB0aGF0IHdlIGRvbid0IGhhdmUgdG8gY2hlY2sgaWYgaXQgYWxyZWFkeSBleGlzdHMgaW4gdGhlIGNhY2hlO1xyXG4gICAgLy8gaXQgd291bGQgaGF2ZSByZXR1cm5lZCBlYXJsaWVyIGlmIGl0IGhhZFxyXG4gICAgaWYgKG9wdGlvbnMuY2FjaGUgJiYgb3B0aW9ucy5uYW1lKSB7XHJcbiAgICAgICAgb3B0aW9ucy50ZW1wbGF0ZXMuZGVmaW5lKG9wdGlvbnMubmFtZSwgdGVtcGxhdGVGdW5jKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0ZW1wbGF0ZUZ1bmM7XHJcbn1cclxuLyoqXHJcbiAqIFJlbmRlciBhIHRlbXBsYXRlXHJcbiAqXHJcbiAqIElmIGB0ZW1wbGF0ZWAgaXMgYSBzdHJpbmcsIEV0YSB3aWxsIGNvbXBpbGUgaXQgdG8gYSBmdW5jdGlvbiBhbmQgdGhlbiBjYWxsIGl0IHdpdGggdGhlIHByb3ZpZGVkIGRhdGEuXHJcbiAqIElmIGB0ZW1wbGF0ZWAgaXMgYSB0ZW1wbGF0ZSBmdW5jdGlvbiwgRXRhIHdpbGwgY2FsbCBpdCB3aXRoIHRoZSBwcm92aWRlZCBkYXRhLlxyXG4gKlxyXG4gKiBJZiBgY29uZmlnLmFzeW5jYCBpcyBgZmFsc2VgLCBFdGEgd2lsbCByZXR1cm4gdGhlIHJlbmRlcmVkIHRlbXBsYXRlLlxyXG4gKlxyXG4gKiBJZiBgY29uZmlnLmFzeW5jYCBpcyBgdHJ1ZWAgYW5kIHRoZXJlJ3MgYSBjYWxsYmFjayBmdW5jdGlvbiwgRXRhIHdpbGwgY2FsbCB0aGUgY2FsbGJhY2sgd2l0aCBgKGVyciwgcmVuZGVyZWRUZW1wbGF0ZSlgLlxyXG4gKiBJZiBgY29uZmlnLmFzeW5jYCBpcyBgdHJ1ZWAgYW5kIHRoZXJlJ3Mgbm90IGEgY2FsbGJhY2sgZnVuY3Rpb24sIEV0YSB3aWxsIHJldHVybiBhIFByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0aGUgcmVuZGVyZWQgdGVtcGxhdGUuXHJcbiAqXHJcbiAqIElmIGBjb25maWcuY2FjaGVgIGlzIGB0cnVlYCBhbmQgYGNvbmZpZ2AgaGFzIGEgYG5hbWVgIG9yIGBmaWxlbmFtZWAgcHJvcGVydHksIEV0YSB3aWxsIGNhY2hlIHRoZSB0ZW1wbGF0ZSBvbiB0aGUgZmlyc3QgcmVuZGVyIGFuZCB1c2UgdGhlIGNhY2hlZCB0ZW1wbGF0ZSBmb3IgYWxsIHN1YnNlcXVlbnQgcmVuZGVycy5cclxuICpcclxuICogQHBhcmFtIHRlbXBsYXRlIFRlbXBsYXRlIHN0cmluZyBvciB0ZW1wbGF0ZSBmdW5jdGlvblxyXG4gKiBAcGFyYW0gZGF0YSBEYXRhIHRvIHJlbmRlciB0aGUgdGVtcGxhdGUgd2l0aFxyXG4gKiBAcGFyYW0gY29uZmlnIE9wdGlvbmFsIGNvbmZpZyBvcHRpb25zXHJcbiAqIEBwYXJhbSBjYiBDYWxsYmFjayBmdW5jdGlvblxyXG4gKi9cclxuZnVuY3Rpb24gcmVuZGVyKHRlbXBsYXRlLCBkYXRhLCBjb25maWcsIGNiKSB7XHJcbiAgICB2YXIgb3B0aW9ucyA9IGdldENvbmZpZyhjb25maWcgfHwge30pO1xyXG4gICAgaWYgKG9wdGlvbnMuYXN5bmMpIHtcclxuICAgICAgICBpZiAoY2IpIHtcclxuICAgICAgICAgICAgLy8gSWYgdXNlciBwYXNzZXMgY2FsbGJhY2tcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIC8vIE5vdGU6IGlmIHRoZXJlIGlzIGFuIGVycm9yIHdoaWxlIHJlbmRlcmluZyB0aGUgdGVtcGxhdGUsXHJcbiAgICAgICAgICAgICAgICAvLyBJdCB3aWxsIGJ1YmJsZSB1cCBhbmQgYmUgY2F1Z2h0IGhlcmVcclxuICAgICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZUZuID0gaGFuZGxlQ2FjaGUodGVtcGxhdGUsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVGbihkYXRhLCBvcHRpb25zLCBjYik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIE5vIGNhbGxiYWNrLCB0cnkgcmV0dXJuaW5nIGEgcHJvbWlzZVxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHByb21pc2VJbXBsID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHByb21pc2VJbXBsKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGhhbmRsZUNhY2hlKHRlbXBsYXRlLCBvcHRpb25zKShkYXRhLCBvcHRpb25zKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFdGFFcnIoXCJQbGVhc2UgcHJvdmlkZSBhIGNhbGxiYWNrIGZ1bmN0aW9uLCB0aGlzIGVudiBkb2Vzbid0IHN1cHBvcnQgUHJvbWlzZXNcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gaGFuZGxlQ2FjaGUodGVtcGxhdGUsIG9wdGlvbnMpKGRhdGEsIG9wdGlvbnMpO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBSZW5kZXIgYSB0ZW1wbGF0ZSBhc3luY2hyb25vdXNseVxyXG4gKlxyXG4gKiBJZiBgdGVtcGxhdGVgIGlzIGEgc3RyaW5nLCBFdGEgd2lsbCBjb21waWxlIGl0IHRvIGEgZnVuY3Rpb24gYW5kIGNhbGwgaXQgd2l0aCB0aGUgcHJvdmlkZWQgZGF0YS5cclxuICogSWYgYHRlbXBsYXRlYCBpcyBhIGZ1bmN0aW9uLCBFdGEgd2lsbCBjYWxsIGl0IHdpdGggdGhlIHByb3ZpZGVkIGRhdGEuXHJcbiAqXHJcbiAqIElmIHRoZXJlIGlzIGEgY2FsbGJhY2sgZnVuY3Rpb24sIEV0YSB3aWxsIGNhbGwgaXQgd2l0aCBgKGVyciwgcmVuZGVyZWRUZW1wbGF0ZSlgLlxyXG4gKiBJZiB0aGVyZSBpcyBub3QgYSBjYWxsYmFjayBmdW5jdGlvbiwgRXRhIHdpbGwgcmV0dXJuIGEgUHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRoZSByZW5kZXJlZCB0ZW1wbGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0gdGVtcGxhdGUgVGVtcGxhdGUgc3RyaW5nIG9yIHRlbXBsYXRlIGZ1bmN0aW9uXHJcbiAqIEBwYXJhbSBkYXRhIERhdGEgdG8gcmVuZGVyIHRoZSB0ZW1wbGF0ZSB3aXRoXHJcbiAqIEBwYXJhbSBjb25maWcgT3B0aW9uYWwgY29uZmlnIG9wdGlvbnNcclxuICogQHBhcmFtIGNiIENhbGxiYWNrIGZ1bmN0aW9uXHJcbiAqL1xyXG5mdW5jdGlvbiByZW5kZXJBc3luYyh0ZW1wbGF0ZSwgZGF0YSwgY29uZmlnLCBjYikge1xyXG4gICAgLy8gVXNpbmcgT2JqZWN0LmFzc2lnbiB0byBsb3dlciBidW5kbGUgc2l6ZSwgdXNpbmcgc3ByZWFkIG9wZXJhdG9yIG1ha2VzIGl0IGxhcmdlciBiZWNhdXNlIG9mIHR5cGVzY3JpcHQgaW5qZWN0ZWQgcG9seWZpbGxzXHJcbiAgICByZXR1cm4gcmVuZGVyKHRlbXBsYXRlLCBkYXRhLCBPYmplY3QuYXNzaWduKHt9LCBjb25maWcsIHsgYXN5bmM6IHRydWUgfSksIGNiKTtcclxufVxuXG4vLyBAZGVub2lmeS1pZ25vcmVcclxuY29uZmlnLmluY2x1ZGVGaWxlID0gaW5jbHVkZUZpbGVIZWxwZXI7XHJcbmNvbmZpZy5maWxlcGF0aENhY2hlID0ge307XG5cbmV4cG9ydCB7IHJlbmRlckZpbGUgYXMgX19leHByZXNzLCBjb21waWxlLCBjb21waWxlVG9TdHJpbmcsIGNvbmZpZywgY29uZmlndXJlLCBjb25maWcgYXMgZGVmYXVsdENvbmZpZywgZ2V0Q29uZmlnLCBsb2FkRmlsZSwgcGFyc2UsIHJlbmRlciwgcmVuZGVyQXN5bmMsIHJlbmRlckZpbGUsIHJlbmRlckZpbGVBc3luYywgdGVtcGxhdGVzIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ldGEuZXMuanMubWFwXG4iLCJpbXBvcnQgKiBhcyBFdGEgZnJvbSBcImV0YVwiO1xuXG5leHBvcnQgY2xhc3MgUGFyc2VyIHtcbiAgICBhc3luYyBwYXJzZV9jb21tYW5kcyhjb250ZW50OiBzdHJpbmcsIG9iamVjdDogYW55KTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgY29udGVudCA9IChhd2FpdCBFdGEucmVuZGVyQXN5bmMoY29udGVudCwgb2JqZWN0LCB7XG4gICAgICAgICAgICB2YXJOYW1lOiBcInRwXCIsXG4gICAgICAgICAgICBwYXJzZToge1xuICAgICAgICAgICAgICAgIGV4ZWM6IFwiKlwiLFxuICAgICAgICAgICAgICAgIGludGVycG9sYXRlOiBcIn5cIixcbiAgICAgICAgICAgICAgICByYXc6IFwiXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYXV0b1RyaW06IGZhbHNlLFxuICAgICAgICAgICAgZ2xvYmFsQXdhaXQ6IHRydWUsXG4gICAgICAgIH0pKSBhcyBzdHJpbmc7XG5cbiAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtcbiAgICBBcHAsXG4gICAgbm9ybWFsaXplUGF0aCxcbiAgICBNYXJrZG93blBvc3RQcm9jZXNzb3JDb250ZXh0LFxuICAgIE1hcmtkb3duVmlldyxcbiAgICBUQWJzdHJhY3RGaWxlLFxuICAgIFRGaWxlLFxuICAgIFRGb2xkZXIsXG59IGZyb20gXCJvYnNpZGlhblwiO1xuXG5pbXBvcnQgeyByZXNvbHZlX3RmaWxlLCBkZWxheSB9IGZyb20gXCJVdGlsc1wiO1xuaW1wb3J0IFRlbXBsYXRlclBsdWdpbiBmcm9tIFwibWFpblwiO1xuaW1wb3J0IHtcbiAgICBGdW5jdGlvbnNNb2RlLFxuICAgIEZ1bmN0aW9uc0dlbmVyYXRvcixcbn0gZnJvbSBcImZ1bmN0aW9ucy9GdW5jdGlvbnNHZW5lcmF0b3JcIjtcbmltcG9ydCB7IGVycm9yV3JhcHBlciwgZXJyb3JXcmFwcGVyU3luYywgVGVtcGxhdGVyRXJyb3IgfSBmcm9tIFwiRXJyb3JcIjtcbmltcG9ydCB7IEVkaXRvciB9IGZyb20gXCJlZGl0b3IvRWRpdG9yXCI7XG5pbXBvcnQgeyBQYXJzZXIgfSBmcm9tIFwicGFyc2VyL1BhcnNlclwiO1xuaW1wb3J0IHsgbG9nX2Vycm9yIH0gZnJvbSBcIkxvZ1wiO1xuXG5leHBvcnQgZW51bSBSdW5Nb2RlIHtcbiAgICBDcmVhdGVOZXdGcm9tVGVtcGxhdGUsXG4gICAgQXBwZW5kQWN0aXZlRmlsZSxcbiAgICBPdmVyd3JpdGVGaWxlLFxuICAgIE92ZXJ3cml0ZUFjdGl2ZUZpbGUsXG4gICAgRHluYW1pY1Byb2Nlc3NvcixcbiAgICBTdGFydHVwVGVtcGxhdGUsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUnVubmluZ0NvbmZpZyB7XG4gICAgdGVtcGxhdGVfZmlsZTogVEZpbGU7XG4gICAgdGFyZ2V0X2ZpbGU6IFRGaWxlO1xuICAgIHJ1bl9tb2RlOiBSdW5Nb2RlO1xuICAgIGFjdGl2ZV9maWxlPzogVEZpbGU7XG59XG5cbmV4cG9ydCBjbGFzcyBUZW1wbGF0ZXIge1xuICAgIHB1YmxpYyBwYXJzZXI6IFBhcnNlcjtcbiAgICBwdWJsaWMgZnVuY3Rpb25zX2dlbmVyYXRvcjogRnVuY3Rpb25zR2VuZXJhdG9yO1xuICAgIHB1YmxpYyBlZGl0b3I6IEVkaXRvcjtcbiAgICBwdWJsaWMgY3VycmVudF9mdW5jdGlvbnNfb2JqZWN0OiB7fTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBwOiBBcHAsIHByaXZhdGUgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW4pIHtcbiAgICAgICAgdGhpcy5mdW5jdGlvbnNfZ2VuZXJhdG9yID0gbmV3IEZ1bmN0aW9uc0dlbmVyYXRvcihcbiAgICAgICAgICAgIHRoaXMuYXBwLFxuICAgICAgICAgICAgdGhpcy5wbHVnaW5cbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5lZGl0b3IgPSBuZXcgRWRpdG9yKHRoaXMuYXBwLCB0aGlzLnBsdWdpbik7XG4gICAgICAgIHRoaXMucGFyc2VyID0gbmV3IFBhcnNlcigpO1xuICAgIH1cblxuICAgIGFzeW5jIHNldHVwKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBhd2FpdCB0aGlzLmVkaXRvci5zZXR1cCgpO1xuICAgICAgICBhd2FpdCB0aGlzLmZ1bmN0aW9uc19nZW5lcmF0b3IuaW5pdCgpO1xuICAgICAgICB0aGlzLnBsdWdpbi5yZWdpc3Rlck1hcmtkb3duUG9zdFByb2Nlc3NvcigoZWwsIGN0eCkgPT5cbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc19keW5hbWljX3RlbXBsYXRlcyhlbCwgY3R4KVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGNyZWF0ZV9ydW5uaW5nX2NvbmZpZyhcbiAgICAgICAgdGVtcGxhdGVfZmlsZTogVEZpbGUsXG4gICAgICAgIHRhcmdldF9maWxlOiBURmlsZSxcbiAgICAgICAgcnVuX21vZGU6IFJ1bk1vZGVcbiAgICApOiBSdW5uaW5nQ29uZmlnIHtcbiAgICAgICAgY29uc3QgYWN0aXZlX2ZpbGUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0ZW1wbGF0ZV9maWxlOiB0ZW1wbGF0ZV9maWxlLFxuICAgICAgICAgICAgdGFyZ2V0X2ZpbGU6IHRhcmdldF9maWxlLFxuICAgICAgICAgICAgcnVuX21vZGU6IHJ1bl9tb2RlLFxuICAgICAgICAgICAgYWN0aXZlX2ZpbGU6IGFjdGl2ZV9maWxlLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGFzeW5jIHJlYWRfYW5kX3BhcnNlX3RlbXBsYXRlKGNvbmZpZzogUnVubmluZ0NvbmZpZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIGNvbnN0IHRlbXBsYXRlX2NvbnRlbnQgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5yZWFkKFxuICAgICAgICAgICAgY29uZmlnLnRlbXBsYXRlX2ZpbGVcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VfdGVtcGxhdGUoY29uZmlnLCB0ZW1wbGF0ZV9jb250ZW50KTtcbiAgICB9XG5cbiAgICBhc3luYyBwYXJzZV90ZW1wbGF0ZShcbiAgICAgICAgY29uZmlnOiBSdW5uaW5nQ29uZmlnLFxuICAgICAgICB0ZW1wbGF0ZV9jb250ZW50OiBzdHJpbmdcbiAgICApOiBQcm9taXNlPHN0cmluZz4ge1xuICAgICAgICBjb25zdCBmdW5jdGlvbnNfb2JqZWN0ID0gYXdhaXQgdGhpcy5mdW5jdGlvbnNfZ2VuZXJhdG9yLmdlbmVyYXRlX29iamVjdChcbiAgICAgICAgICAgIGNvbmZpZyxcbiAgICAgICAgICAgIEZ1bmN0aW9uc01vZGUuVVNFUl9JTlRFUk5BTFxuICAgICAgICApO1xuICAgICAgICB0aGlzLmN1cnJlbnRfZnVuY3Rpb25zX29iamVjdCA9IGZ1bmN0aW9uc19vYmplY3Q7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCB0aGlzLnBhcnNlci5wYXJzZV9jb21tYW5kcyhcbiAgICAgICAgICAgIHRlbXBsYXRlX2NvbnRlbnQsXG4gICAgICAgICAgICBmdW5jdGlvbnNfb2JqZWN0XG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH1cblxuICAgIGFzeW5jIGNyZWF0ZV9uZXdfbm90ZV9mcm9tX3RlbXBsYXRlKFxuICAgICAgICB0ZW1wbGF0ZTogVEZpbGUgfCBzdHJpbmcsXG4gICAgICAgIGZvbGRlcj86IFRGb2xkZXIsXG4gICAgICAgIGZpbGVuYW1lPzogc3RyaW5nLFxuICAgICAgICBvcGVuX25ld19ub3RlID0gdHJ1ZVxuICAgICk6IFByb21pc2U8VEZpbGU+IHtcbiAgICAgICAgLy8gVE9ETzogTWF5YmUgdGhlcmUgaXMgYW4gb2JzaWRpYW4gQVBJIGZ1bmN0aW9uIGZvciB0aGF0XG4gICAgICAgIGlmICghZm9sZGVyKSB7XG4gICAgICAgICAgICAvLyBUT0RPOiBGaXggdGhhdFxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgY29uc3QgbmV3X2ZpbGVfbG9jYXRpb24gPVxuICAgICAgICAgICAgICAgIHRoaXMuYXBwLnZhdWx0LmdldENvbmZpZyhcIm5ld0ZpbGVMb2NhdGlvblwiKTtcbiAgICAgICAgICAgIHN3aXRjaCAobmV3X2ZpbGVfbG9jYXRpb24pIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwiY3VycmVudFwiOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFjdGl2ZV9maWxlID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZUZpbGUoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZV9maWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb2xkZXIgPSBhY3RpdmVfZmlsZS5wYXJlbnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhc2UgXCJmb2xkZXJcIjpcbiAgICAgICAgICAgICAgICAgICAgZm9sZGVyID0gdGhpcy5hcHAuZmlsZU1hbmFnZXIuZ2V0TmV3RmlsZVBhcmVudChcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcInJvb3RcIjpcbiAgICAgICAgICAgICAgICAgICAgZm9sZGVyID0gdGhpcy5hcHAudmF1bHQuZ2V0Um9vdCgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRPRE86IENoYW5nZSB0aGF0LCBub3Qgc3RhYmxlIGF0bVxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGNvbnN0IGNyZWF0ZWRfbm90ZSA9IGF3YWl0IHRoaXMuYXBwLmZpbGVNYW5hZ2VyLmNyZWF0ZU5ld01hcmtkb3duRmlsZShcbiAgICAgICAgICAgIGZvbGRlcixcbiAgICAgICAgICAgIGZpbGVuYW1lID8/IFwiVW50aXRsZWRcIlxuICAgICAgICApO1xuXG4gICAgICAgIGxldCBydW5uaW5nX2NvbmZpZzogUnVubmluZ0NvbmZpZztcbiAgICAgICAgbGV0IG91dHB1dF9jb250ZW50OiBzdHJpbmc7XG4gICAgICAgIGlmICh0ZW1wbGF0ZSBpbnN0YW5jZW9mIFRGaWxlKSB7XG4gICAgICAgICAgICBydW5uaW5nX2NvbmZpZyA9IHRoaXMuY3JlYXRlX3J1bm5pbmdfY29uZmlnKFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlLFxuICAgICAgICAgICAgICAgIGNyZWF0ZWRfbm90ZSxcbiAgICAgICAgICAgICAgICBSdW5Nb2RlLkNyZWF0ZU5ld0Zyb21UZW1wbGF0ZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIG91dHB1dF9jb250ZW50ID0gYXdhaXQgZXJyb3JXcmFwcGVyKFxuICAgICAgICAgICAgICAgIGFzeW5jICgpID0+IHRoaXMucmVhZF9hbmRfcGFyc2VfdGVtcGxhdGUocnVubmluZ19jb25maWcpLFxuICAgICAgICAgICAgICAgIFwiVGVtcGxhdGUgcGFyc2luZyBlcnJvciwgYWJvcnRpbmcuXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBydW5uaW5nX2NvbmZpZyA9IHRoaXMuY3JlYXRlX3J1bm5pbmdfY29uZmlnKFxuICAgICAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjcmVhdGVkX25vdGUsXG4gICAgICAgICAgICAgICAgUnVuTW9kZS5DcmVhdGVOZXdGcm9tVGVtcGxhdGVcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBvdXRwdXRfY29udGVudCA9IGF3YWl0IGVycm9yV3JhcHBlcihcbiAgICAgICAgICAgICAgICBhc3luYyAoKSA9PiB0aGlzLnBhcnNlX3RlbXBsYXRlKHJ1bm5pbmdfY29uZmlnLCB0ZW1wbGF0ZSksXG4gICAgICAgICAgICAgICAgXCJUZW1wbGF0ZSBwYXJzaW5nIGVycm9yLCBhYm9ydGluZy5cIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvdXRwdXRfY29udGVudCA9PSBudWxsKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5kZWxldGUoY3JlYXRlZF9ub3RlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0Lm1vZGlmeShjcmVhdGVkX25vdGUsIG91dHB1dF9jb250ZW50KTtcblxuICAgICAgICBpZiAob3Blbl9uZXdfbm90ZSkge1xuICAgICAgICAgICAgY29uc3QgYWN0aXZlX2xlYWYgPSB0aGlzLmFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZjtcbiAgICAgICAgICAgIGlmICghYWN0aXZlX2xlYWYpIHtcbiAgICAgICAgICAgICAgICBsb2dfZXJyb3IobmV3IFRlbXBsYXRlckVycm9yKFwiTm8gYWN0aXZlIGxlYWZcIikpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGF3YWl0IGFjdGl2ZV9sZWFmLm9wZW5GaWxlKGNyZWF0ZWRfbm90ZSwge1xuICAgICAgICAgICAgICAgIHN0YXRlOiB7IG1vZGU6IFwic291cmNlXCIgfSxcbiAgICAgICAgICAgICAgICBlU3RhdGU6IHsgcmVuYW1lOiBcImFsbFwiIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuZWRpdG9yLmp1bXBfdG9fbmV4dF9jdXJzb3JfbG9jYXRpb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjcmVhdGVkX25vdGU7XG4gICAgfVxuXG4gICAgYXN5bmMgYXBwZW5kX3RlbXBsYXRlX3RvX2FjdGl2ZV9maWxlKHRlbXBsYXRlX2ZpbGU6IFRGaWxlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IGFjdGl2ZV92aWV3ID1cbiAgICAgICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgICAgIGlmIChhY3RpdmVfdmlldyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgbG9nX2Vycm9yKFxuICAgICAgICAgICAgICAgIG5ldyBUZW1wbGF0ZXJFcnJvcihcIk5vIGFjdGl2ZSB2aWV3LCBjYW4ndCBhcHBlbmQgdGVtcGxhdGVzLlwiKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBydW5uaW5nX2NvbmZpZyA9IHRoaXMuY3JlYXRlX3J1bm5pbmdfY29uZmlnKFxuICAgICAgICAgICAgdGVtcGxhdGVfZmlsZSxcbiAgICAgICAgICAgIGFjdGl2ZV92aWV3LmZpbGUsXG4gICAgICAgICAgICBSdW5Nb2RlLkFwcGVuZEFjdGl2ZUZpbGVcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3Qgb3V0cHV0X2NvbnRlbnQgPSBhd2FpdCBlcnJvcldyYXBwZXIoXG4gICAgICAgICAgICBhc3luYyAoKSA9PiB0aGlzLnJlYWRfYW5kX3BhcnNlX3RlbXBsYXRlKHJ1bm5pbmdfY29uZmlnKSxcbiAgICAgICAgICAgIFwiVGVtcGxhdGUgcGFyc2luZyBlcnJvciwgYWJvcnRpbmcuXCJcbiAgICAgICAgKTtcbiAgICAgICAgLy8gZXJyb3JXcmFwcGVyIGZhaWxlZFxuICAgICAgICBpZiAob3V0cHV0X2NvbnRlbnQgPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZWRpdG9yID0gYWN0aXZlX3ZpZXcuZWRpdG9yO1xuICAgICAgICBjb25zdCBkb2MgPSBlZGl0b3IuZ2V0RG9jKCk7XG4gICAgICAgIGRvYy5yZXBsYWNlU2VsZWN0aW9uKG91dHB1dF9jb250ZW50KTtcblxuICAgICAgICAvLyBUT0RPOiBSZW1vdmUgdGhpc1xuICAgICAgICBhd2FpdCB0aGlzLmVkaXRvci5qdW1wX3RvX25leHRfY3Vyc29yX2xvY2F0aW9uKCk7XG4gICAgfVxuXG4gICAgYXN5bmMgd3JpdGVfdGVtcGxhdGVfdG9fZmlsZShcbiAgICAgICAgdGVtcGxhdGVfZmlsZTogVEZpbGUsXG4gICAgICAgIGZpbGU6IFRGaWxlXG4gICAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IHJ1bm5pbmdfY29uZmlnID0gdGhpcy5jcmVhdGVfcnVubmluZ19jb25maWcoXG4gICAgICAgICAgICB0ZW1wbGF0ZV9maWxlLFxuICAgICAgICAgICAgZmlsZSxcbiAgICAgICAgICAgIFJ1bk1vZGUuT3ZlcndyaXRlRmlsZVxuICAgICAgICApO1xuICAgICAgICBjb25zdCBvdXRwdXRfY29udGVudCA9IGF3YWl0IGVycm9yV3JhcHBlcihcbiAgICAgICAgICAgIGFzeW5jICgpID0+IHRoaXMucmVhZF9hbmRfcGFyc2VfdGVtcGxhdGUocnVubmluZ19jb25maWcpLFxuICAgICAgICAgICAgXCJUZW1wbGF0ZSBwYXJzaW5nIGVycm9yLCBhYm9ydGluZy5cIlxuICAgICAgICApO1xuICAgICAgICAvLyBlcnJvcldyYXBwZXIgZmFpbGVkXG4gICAgICAgIGlmIChvdXRwdXRfY29udGVudCA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQubW9kaWZ5KGZpbGUsIG91dHB1dF9jb250ZW50KTtcbiAgICB9XG5cbiAgICBvdmVyd3JpdGVfYWN0aXZlX2ZpbGVfY29tbWFuZHMoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGFjdGl2ZV92aWV3ID1cbiAgICAgICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG4gICAgICAgIGlmIChhY3RpdmVfdmlldyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgbG9nX2Vycm9yKFxuICAgICAgICAgICAgICAgIG5ldyBUZW1wbGF0ZXJFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgXCJBY3RpdmUgdmlldyBpcyBudWxsLCBjYW4ndCBvdmVyd3JpdGUgY29udGVudFwiXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm92ZXJ3cml0ZV9maWxlX2NvbW1hbmRzKGFjdGl2ZV92aWV3LmZpbGUsIHRydWUpO1xuICAgIH1cblxuICAgIGFzeW5jIG92ZXJ3cml0ZV9maWxlX2NvbW1hbmRzKFxuICAgICAgICBmaWxlOiBURmlsZSxcbiAgICAgICAgYWN0aXZlX2ZpbGUgPSBmYWxzZVxuICAgICk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBjb25zdCBydW5uaW5nX2NvbmZpZyA9IHRoaXMuY3JlYXRlX3J1bm5pbmdfY29uZmlnKFxuICAgICAgICAgICAgZmlsZSxcbiAgICAgICAgICAgIGZpbGUsXG4gICAgICAgICAgICBhY3RpdmVfZmlsZSA/IFJ1bk1vZGUuT3ZlcndyaXRlQWN0aXZlRmlsZSA6IFJ1bk1vZGUuT3ZlcndyaXRlRmlsZVxuICAgICAgICApO1xuICAgICAgICBjb25zdCBvdXRwdXRfY29udGVudCA9IGF3YWl0IGVycm9yV3JhcHBlcihcbiAgICAgICAgICAgIGFzeW5jICgpID0+IHRoaXMucmVhZF9hbmRfcGFyc2VfdGVtcGxhdGUocnVubmluZ19jb25maWcpLFxuICAgICAgICAgICAgXCJUZW1wbGF0ZSBwYXJzaW5nIGVycm9yLCBhYm9ydGluZy5cIlxuICAgICAgICApO1xuICAgICAgICAvLyBlcnJvcldyYXBwZXIgZmFpbGVkXG4gICAgICAgIGlmIChvdXRwdXRfY29udGVudCA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQubW9kaWZ5KGZpbGUsIG91dHB1dF9jb250ZW50KTtcbiAgICAgICAgLy8gVE9ETzogUmVtb3ZlIHRoaXNcbiAgICAgICAgaWYgKHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCkgPT09IGZpbGUpIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuZWRpdG9yLmp1bXBfdG9fbmV4dF9jdXJzb3JfbG9jYXRpb24oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIHByb2Nlc3NfZHluYW1pY190ZW1wbGF0ZXMoXG4gICAgICAgIGVsOiBIVE1MRWxlbWVudCxcbiAgICAgICAgY3R4OiBNYXJrZG93blBvc3RQcm9jZXNzb3JDb250ZXh0XG4gICAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IGR5bmFtaWNfY29tbWFuZF9yZWdleCA9XG4gICAgICAgICAgICAvKDwlKD86LXxfKT9cXHMqWyp+XXswLDF9KVxcKygoPzoufFxccykqPyU+KS9nO1xuXG4gICAgICAgIGNvbnN0IHdhbGtlciA9IGRvY3VtZW50LmNyZWF0ZU5vZGVJdGVyYXRvcihlbCwgTm9kZUZpbHRlci5TSE9XX1RFWFQpO1xuICAgICAgICBsZXQgbm9kZTtcbiAgICAgICAgbGV0IHBhc3MgPSBmYWxzZTtcbiAgICAgICAgbGV0IGZ1bmN0aW9uc19vYmplY3Q6IHt9O1xuICAgICAgICB3aGlsZSAoKG5vZGUgPSB3YWxrZXIubmV4dE5vZGUoKSkpIHtcbiAgICAgICAgICAgIGxldCBjb250ZW50ID0gbm9kZS5ub2RlVmFsdWU7XG4gICAgICAgICAgICBsZXQgbWF0Y2g7XG4gICAgICAgICAgICBpZiAoKG1hdGNoID0gZHluYW1pY19jb21tYW5kX3JlZ2V4LmV4ZWMoY29udGVudCkpICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlID0gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaXJzdExpbmtwYXRoRGVzdChcbiAgICAgICAgICAgICAgICAgICAgXCJcIixcbiAgICAgICAgICAgICAgICAgICAgY3R4LnNvdXJjZVBhdGhcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGlmICghZmlsZSB8fCAhKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIXBhc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFzcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuY3JlYXRlX3J1bm5pbmdfY29uZmlnKFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBSdW5Nb2RlLkR5bmFtaWNQcm9jZXNzb3JcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25zX29iamVjdCA9XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmZ1bmN0aW9uc19nZW5lcmF0b3IuZ2VuZXJhdGVfb2JqZWN0KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBGdW5jdGlvbnNNb2RlLlVTRVJfSU5URVJOQUxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudF9mdW5jdGlvbnNfb2JqZWN0ID0gZnVuY3Rpb25zX29iamVjdDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB3aGlsZSAobWF0Y2ggIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBOb3QgdGhlIG1vc3QgZWZmaWNpZW50IHdheSB0byBleGNsdWRlIHRoZSAnKycgZnJvbSB0aGUgY29tbWFuZCBidXQgSSBjb3VsZG4ndCBmaW5kIHNvbWV0aGluZyBiZXR0ZXJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29tcGxldGVfY29tbWFuZCA9IG1hdGNoWzFdICsgbWF0Y2hbMl07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbW1hbmRfb3V0cHV0OiBzdHJpbmcgPSBhd2FpdCBlcnJvcldyYXBwZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMucGFyc2VyLnBhcnNlX2NvbW1hbmRzKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZV9jb21tYW5kLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbnNfb2JqZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBgQ29tbWFuZCBQYXJzaW5nIGVycm9yIGluIGR5bmFtaWMgY29tbWFuZCAnJHtjb21wbGV0ZV9jb21tYW5kfSdgXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21tYW5kX291dHB1dCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhcnQgPVxuICAgICAgICAgICAgICAgICAgICAgICAgZHluYW1pY19jb21tYW5kX3JlZ2V4Lmxhc3RJbmRleCAtIG1hdGNoWzBdLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZW5kID0gZHluYW1pY19jb21tYW5kX3JlZ2V4Lmxhc3RJbmRleDtcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50LnN1YnN0cmluZygwLCBzdGFydCkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWFuZF9vdXRwdXQgK1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudC5zdWJzdHJpbmcoZW5kKTtcblxuICAgICAgICAgICAgICAgICAgICBkeW5hbWljX2NvbW1hbmRfcmVnZXgubGFzdEluZGV4ICs9XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tYW5kX291dHB1dC5sZW5ndGggLSBtYXRjaFswXS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoID0gZHluYW1pY19jb21tYW5kX3JlZ2V4LmV4ZWMoY29udGVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG5vZGUubm9kZVZhbHVlID0gY29udGVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldF9uZXdfZmlsZV90ZW1wbGF0ZV9mb3JfZm9sZGVyKGZvbGRlcjogVEZvbGRlcik6IHN0cmluZyB7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gdGhpcy5wbHVnaW4uc2V0dGluZ3MuZm9sZGVyX3RlbXBsYXRlcy5maW5kKFxuICAgICAgICAgICAgICAgIChlKSA9PiBlLmZvbGRlciA9PSBmb2xkZXIucGF0aFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChtYXRjaCAmJiBtYXRjaC50ZW1wbGF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtYXRjaC50ZW1wbGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvbGRlciA9IGZvbGRlci5wYXJlbnQ7XG4gICAgICAgIH0gd2hpbGUgKCFmb2xkZXIuaXNSb290KCkpO1xuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBvbl9maWxlX2NyZWF0aW9uKFxuICAgICAgICB0ZW1wbGF0ZXI6IFRlbXBsYXRlcixcbiAgICAgICAgZmlsZTogVEFic3RyYWN0RmlsZVxuICAgICk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBpZiAoIShmaWxlIGluc3RhbmNlb2YgVEZpbGUpIHx8IGZpbGUuZXh0ZW5zaW9uICE9PSBcIm1kXCIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEF2b2lkcyB0ZW1wbGF0ZSByZXBsYWNlbWVudCB3aGVuIHN5bmNpbmcgdGVtcGxhdGUgZmlsZXNcbiAgICAgICAgY29uc3QgdGVtcGxhdGVfZm9sZGVyID0gbm9ybWFsaXplUGF0aChcbiAgICAgICAgICAgIHRlbXBsYXRlci5wbHVnaW4uc2V0dGluZ3MudGVtcGxhdGVzX2ZvbGRlclxuICAgICAgICApO1xuICAgICAgICBpZiAoZmlsZS5wYXRoLmluY2x1ZGVzKHRlbXBsYXRlX2ZvbGRlcikgJiYgdGVtcGxhdGVfZm9sZGVyICE9PSBcIi9cIikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVE9ETzogZmluZCBhIGJldHRlciB3YXkgdG8gZG8gdGhpc1xuICAgICAgICAvLyBDdXJyZW50bHksIEkgaGF2ZSB0byB3YWl0IGZvciB0aGUgZGFpbHkgbm90ZSBwbHVnaW4gdG8gYWRkIHRoZSBmaWxlIGNvbnRlbnQgYmVmb3JlIHJlcGxhY2luZ1xuICAgICAgICAvLyBOb3QgYSBwcm9ibGVtIHdpdGggQ2FsZW5kYXIgaG93ZXZlciBzaW5jZSBpdCBjcmVhdGVzIHRoZSBmaWxlIHdpdGggdGhlIGV4aXN0aW5nIGNvbnRlbnRcbiAgICAgICAgYXdhaXQgZGVsYXkoMzAwKTtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICBmaWxlLnN0YXQuc2l6ZSA9PSAwICYmXG4gICAgICAgICAgICB0ZW1wbGF0ZXIucGx1Z2luLnNldHRpbmdzLmVuYWJsZV9mb2xkZXJfdGVtcGxhdGVzXG4gICAgICAgICkge1xuICAgICAgICAgICAgY29uc3QgZm9sZGVyX3RlbXBsYXRlX21hdGNoID1cbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZXIuZ2V0X25ld19maWxlX3RlbXBsYXRlX2Zvcl9mb2xkZXIoZmlsZS5wYXJlbnQpO1xuICAgICAgICAgICAgaWYgKCFmb2xkZXJfdGVtcGxhdGVfbWF0Y2gpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHRlbXBsYXRlX2ZpbGU6IFRGaWxlID0gYXdhaXQgZXJyb3JXcmFwcGVyKFxuICAgICAgICAgICAgICAgIGFzeW5jICgpOiBQcm9taXNlPFRGaWxlPiA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlX3RmaWxlKHRlbXBsYXRlci5hcHAsIGZvbGRlcl90ZW1wbGF0ZV9tYXRjaCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBgQ291bGRuJ3QgZmluZCB0ZW1wbGF0ZSAke2ZvbGRlcl90ZW1wbGF0ZV9tYXRjaH1gXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgLy8gZXJyb3JXcmFwcGVyIGZhaWxlZFxuICAgICAgICAgICAgaWYgKHRlbXBsYXRlX2ZpbGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGF3YWl0IHRlbXBsYXRlci53cml0ZV90ZW1wbGF0ZV90b19maWxlKHRlbXBsYXRlX2ZpbGUsIGZpbGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXdhaXQgdGVtcGxhdGVyLm92ZXJ3cml0ZV9maWxlX2NvbW1hbmRzKGZpbGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgZXhlY3V0ZV9zdGFydHVwX3NjcmlwdHMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGZvciAoY29uc3QgdGVtcGxhdGUgb2YgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3RhcnR1cF90ZW1wbGF0ZXMpIHtcbiAgICAgICAgICAgIGlmICghdGVtcGxhdGUpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGZpbGUgPSBlcnJvcldyYXBwZXJTeW5jKFxuICAgICAgICAgICAgICAgICgpID0+IHJlc29sdmVfdGZpbGUodGhpcy5hcHAsIHRlbXBsYXRlKSxcbiAgICAgICAgICAgICAgICBgQ291bGRuJ3QgZmluZCBzdGFydHVwIHRlbXBsYXRlIFwiJHt0ZW1wbGF0ZX1cImBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoIWZpbGUpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHJ1bm5pbmdfY29uZmlnID0gdGhpcy5jcmVhdGVfcnVubmluZ19jb25maWcoXG4gICAgICAgICAgICAgICAgZmlsZSxcbiAgICAgICAgICAgICAgICBmaWxlLFxuICAgICAgICAgICAgICAgIFJ1bk1vZGUuU3RhcnR1cFRlbXBsYXRlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgYXdhaXQgZXJyb3JXcmFwcGVyKFxuICAgICAgICAgICAgICAgIGFzeW5jICgpID0+IHRoaXMucmVhZF9hbmRfcGFyc2VfdGVtcGxhdGUocnVubmluZ19jb25maWcpLFxuICAgICAgICAgICAgICAgIGBTdGFydHVwIFRlbXBsYXRlIHBhcnNpbmcgZXJyb3IsIGFib3J0aW5nLmBcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgVGVtcGxhdGVyUGx1Z2luIGZyb20gXCJtYWluXCI7XG5pbXBvcnQgeyBUZW1wbGF0ZXIgfSBmcm9tIFwiVGVtcGxhdGVyXCI7XG5pbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gXCJTZXR0aW5nc1wiO1xuaW1wb3J0IHtcbiAgICBBcHAsXG4gICAgRXZlbnRSZWYsXG4gICAgTWVudSxcbiAgICBNZW51SXRlbSxcbiAgICBUQWJzdHJhY3RGaWxlLFxuICAgIFRGaWxlLFxuICAgIFRGb2xkZXIsXG59IGZyb20gXCJvYnNpZGlhblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFdmVudEhhbmRsZXIge1xuICAgIHByaXZhdGUgc3ludGF4X2hpZ2hsaWdodGluZ19ldmVudDogRXZlbnRSZWY7XG4gICAgcHJpdmF0ZSB0cmlnZ2VyX29uX2ZpbGVfY3JlYXRpb25fZXZlbnQ6IEV2ZW50UmVmO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgYXBwOiBBcHAsXG4gICAgICAgIHByaXZhdGUgcGx1Z2luOiBUZW1wbGF0ZXJQbHVnaW4sXG4gICAgICAgIHByaXZhdGUgdGVtcGxhdGVyOiBUZW1wbGF0ZXIsXG4gICAgICAgIHByaXZhdGUgc2V0dGluZ3M6IFNldHRpbmdzXG4gICAgKSB7fVxuXG4gICAgc2V0dXAoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5vbkxheW91dFJlYWR5KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlX3RyaWdnZXJfZmlsZV9vbl9jcmVhdGlvbigpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy51cGRhdGVfc3ludGF4X2hpZ2hsaWdodGluZygpO1xuICAgICAgICB0aGlzLnVwZGF0ZV9maWxlX21lbnUoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVfc3ludGF4X2hpZ2hsaWdodGluZygpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLnN5bnRheF9oaWdobGlnaHRpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuc3ludGF4X2hpZ2hsaWdodGluZ19ldmVudCA9IHRoaXMuYXBwLndvcmtzcGFjZS5vbihcbiAgICAgICAgICAgICAgICBcImNvZGVtaXJyb3JcIixcbiAgICAgICAgICAgICAgICAoY20pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY20uc2V0T3B0aW9uKFwibW9kZVwiLCBcInRlbXBsYXRlclwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLml0ZXJhdGVDb2RlTWlycm9ycygoY20pID0+IHtcbiAgICAgICAgICAgICAgICBjbS5zZXRPcHRpb24oXCJtb2RlXCIsIFwidGVtcGxhdGVyXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5yZWdpc3RlckV2ZW50KHRoaXMuc3ludGF4X2hpZ2hsaWdodGluZ19ldmVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zeW50YXhfaGlnaGxpZ2h0aW5nX2V2ZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHAudmF1bHQub2ZmcmVmKHRoaXMuc3ludGF4X2hpZ2hsaWdodGluZ19ldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2UuaXRlcmF0ZUNvZGVNaXJyb3JzKChjbSkgPT4ge1xuICAgICAgICAgICAgICAgIGNtLnNldE9wdGlvbihcIm1vZGVcIiwgXCJoeXBlcm1kXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVfdHJpZ2dlcl9maWxlX29uX2NyZWF0aW9uKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy50cmlnZ2VyX29uX2ZpbGVfY3JlYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlcl9vbl9maWxlX2NyZWF0aW9uX2V2ZW50ID0gdGhpcy5hcHAudmF1bHQub24oXG4gICAgICAgICAgICAgICAgXCJjcmVhdGVcIixcbiAgICAgICAgICAgICAgICAoZmlsZTogVEFic3RyYWN0RmlsZSkgPT5cbiAgICAgICAgICAgICAgICAgICAgVGVtcGxhdGVyLm9uX2ZpbGVfY3JlYXRpb24odGhpcy50ZW1wbGF0ZXIsIGZpbGUpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVnaXN0ZXJFdmVudCh0aGlzLnRyaWdnZXJfb25fZmlsZV9jcmVhdGlvbl9ldmVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy50cmlnZ2VyX29uX2ZpbGVfY3JlYXRpb25fZXZlbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcC52YXVsdC5vZmZyZWYodGhpcy50cmlnZ2VyX29uX2ZpbGVfY3JlYXRpb25fZXZlbnQpO1xuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlcl9vbl9maWxlX2NyZWF0aW9uX2V2ZW50ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlX2ZpbGVfbWVudSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wbHVnaW4ucmVnaXN0ZXJFdmVudChcbiAgICAgICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5vbihcImZpbGUtbWVudVwiLCAobWVudTogTWVudSwgZmlsZTogVEZpbGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGb2xkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgbWVudS5hZGRJdGVtKChpdGVtOiBNZW51SXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5zZXRUaXRsZShcIkNyZWF0ZSBuZXcgbm90ZSBmcm9tIHRlbXBsYXRlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldEljb24oXCJ0ZW1wbGF0ZXItaWNvblwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZnV6enlfc3VnZ2VzdGVyLmNyZWF0ZV9uZXdfbm90ZV9mcm9tX3RlbXBsYXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEFwcCB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5pbXBvcnQgVGVtcGxhdGVyUGx1Z2luIGZyb20gXCJtYWluXCI7XG5pbXBvcnQgeyByZXNvbHZlX3RmaWxlIH0gZnJvbSBcIlV0aWxzXCI7XG5pbXBvcnQgeyBlcnJvcldyYXBwZXJTeW5jIH0gZnJvbSBcIkVycm9yXCI7XG5cbmV4cG9ydCBjbGFzcyBDb21tYW5kSGFuZGxlciB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhcHA6IEFwcCwgcHJpdmF0ZSBwbHVnaW46IFRlbXBsYXRlclBsdWdpbikge31cblxuICAgIHNldHVwKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICAgICAgICAgIGlkOiBcImluc2VydC10ZW1wbGF0ZXJcIixcbiAgICAgICAgICAgIG5hbWU6IFwiT3BlbiBJbnNlcnQgVGVtcGxhdGUgbW9kYWxcIixcbiAgICAgICAgICAgIGhvdGtleXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGlmaWVyczogW1wiQWx0XCJdLFxuICAgICAgICAgICAgICAgICAgICBrZXk6IFwiZVwiLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5mdXp6eV9zdWdnZXN0ZXIuaW5zZXJ0X3RlbXBsYXRlKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICAgICAgICAgIGlkOiBcInJlcGxhY2UtaW4tZmlsZS10ZW1wbGF0ZXJcIixcbiAgICAgICAgICAgIG5hbWU6IFwiUmVwbGFjZSB0ZW1wbGF0ZXMgaW4gdGhlIGFjdGl2ZSBmaWxlXCIsXG4gICAgICAgICAgICBob3RrZXlzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBtb2RpZmllcnM6IFtcIkFsdFwiXSxcbiAgICAgICAgICAgICAgICAgICAga2V5OiBcInJcIixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4udGVtcGxhdGVyLm92ZXJ3cml0ZV9hY3RpdmVfZmlsZV9jb21tYW5kcygpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5wbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgICAgICAgICBpZDogXCJqdW1wLXRvLW5leHQtY3Vyc29yLWxvY2F0aW9uXCIsXG4gICAgICAgICAgICBuYW1lOiBcIkp1bXAgdG8gbmV4dCBjdXJzb3IgbG9jYXRpb25cIixcbiAgICAgICAgICAgIGhvdGtleXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGlmaWVyczogW1wiQWx0XCJdLFxuICAgICAgICAgICAgICAgICAgICBrZXk6IFwiVGFiXCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnRlbXBsYXRlci5lZGl0b3IuanVtcF90b19uZXh0X2N1cnNvcl9sb2NhdGlvbigpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5wbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgICAgICAgICBpZDogXCJjcmVhdGUtbmV3LW5vdGUtZnJvbS10ZW1wbGF0ZVwiLFxuICAgICAgICAgICAgbmFtZTogXCJDcmVhdGUgbmV3IG5vdGUgZnJvbSB0ZW1wbGF0ZVwiLFxuICAgICAgICAgICAgaG90a2V5czogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbW9kaWZpZXJzOiBbXCJBbHRcIl0sXG4gICAgICAgICAgICAgICAgICAgIGtleTogXCJuXCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLmZ1enp5X3N1Z2dlc3Rlci5jcmVhdGVfbmV3X25vdGVfZnJvbV90ZW1wbGF0ZSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5yZWdpc3Rlcl90ZW1wbGF0ZXNfaG90a2V5cygpO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyX3RlbXBsYXRlc19ob3RrZXlzKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVkX3RlbXBsYXRlc19ob3RrZXlzLmZvckVhY2goKHRlbXBsYXRlKSA9PiB7XG4gICAgICAgICAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZF90ZW1wbGF0ZV9ob3RrZXkobnVsbCwgdGVtcGxhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhZGRfdGVtcGxhdGVfaG90a2V5KG9sZF90ZW1wbGF0ZTogc3RyaW5nLCBuZXdfdGVtcGxhdGU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLnJlbW92ZV90ZW1wbGF0ZV9ob3RrZXkob2xkX3RlbXBsYXRlKTtcblxuICAgICAgICBpZiAobmV3X3RlbXBsYXRlKSB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICAgICAgICAgICAgICBpZDogbmV3X3RlbXBsYXRlLFxuICAgICAgICAgICAgICAgIG5hbWU6IGBJbnNlcnQgJHtuZXdfdGVtcGxhdGV9YCxcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGVycm9yV3JhcHBlclN5bmMoXG4gICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiByZXNvbHZlX3RmaWxlKHRoaXMuYXBwLCBuZXdfdGVtcGxhdGUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgYENvdWxkbid0IGZpbmQgdGhlIHRlbXBsYXRlIGZpbGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgaG90a2V5YFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRlbXBsYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4udGVtcGxhdGVyLmFwcGVuZF90ZW1wbGF0ZV90b19hY3RpdmVfZmlsZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVtb3ZlX3RlbXBsYXRlX2hvdGtleSh0ZW1wbGF0ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGlmICh0ZW1wbGF0ZSkge1xuICAgICAgICAgICAgLy8gVE9ETzogRmluZCBvZmZpY2lhbCB3YXkgdG8gZG8gdGhpc1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgdGhpcy5hcHAuY29tbWFuZHMucmVtb3ZlQ29tbWFuZChcbiAgICAgICAgICAgICAgICBgJHt0aGlzLnBsdWdpbi5tYW5pZmVzdC5pZH06JHt0ZW1wbGF0ZX1gXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgYWRkSWNvbiwgUGx1Z2luIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmltcG9ydCB7IERFRkFVTFRfU0VUVElOR1MsIFNldHRpbmdzLCBUZW1wbGF0ZXJTZXR0aW5nVGFiIH0gZnJvbSBcIlNldHRpbmdzXCI7XG5pbXBvcnQgeyBGdXp6eVN1Z2dlc3RlciB9IGZyb20gXCJGdXp6eVN1Z2dlc3RlclwiO1xuaW1wb3J0IHsgSUNPTl9EQVRBIH0gZnJvbSBcIkNvbnN0YW50c1wiO1xuaW1wb3J0IHsgVGVtcGxhdGVyIH0gZnJvbSBcIlRlbXBsYXRlclwiO1xuaW1wb3J0IEV2ZW50SGFuZGxlciBmcm9tIFwiRXZlbnRIYW5kbGVyXCI7XG5pbXBvcnQgeyBDb21tYW5kSGFuZGxlciB9IGZyb20gXCJDb21tYW5kSGFuZGxlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZW1wbGF0ZXJQbHVnaW4gZXh0ZW5kcyBQbHVnaW4ge1xuICAgIHB1YmxpYyBzZXR0aW5nczogU2V0dGluZ3M7XG4gICAgcHVibGljIHRlbXBsYXRlcjogVGVtcGxhdGVyO1xuICAgIHB1YmxpYyBldmVudF9oYW5kbGVyOiBFdmVudEhhbmRsZXI7XG4gICAgcHVibGljIGNvbW1hbmRfaGFuZGxlcjogQ29tbWFuZEhhbmRsZXI7XG4gICAgcHVibGljIGZ1enp5X3N1Z2dlc3RlcjogRnV6enlTdWdnZXN0ZXI7XG5cbiAgICBhc3luYyBvbmxvYWQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGF3YWl0IHRoaXMubG9hZF9zZXR0aW5ncygpO1xuXG4gICAgICAgIHRoaXMudGVtcGxhdGVyID0gbmV3IFRlbXBsYXRlcih0aGlzLmFwcCwgdGhpcyk7XG4gICAgICAgIGF3YWl0IHRoaXMudGVtcGxhdGVyLnNldHVwKCk7XG5cbiAgICAgICAgdGhpcy5mdXp6eV9zdWdnZXN0ZXIgPSBuZXcgRnV6enlTdWdnZXN0ZXIodGhpcy5hcHAsIHRoaXMpO1xuXG4gICAgICAgIHRoaXMuZXZlbnRfaGFuZGxlciA9IG5ldyBFdmVudEhhbmRsZXIoXG4gICAgICAgICAgICB0aGlzLmFwcCxcbiAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICB0aGlzLnRlbXBsYXRlcixcbiAgICAgICAgICAgIHRoaXMuc2V0dGluZ3NcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5ldmVudF9oYW5kbGVyLnNldHVwKCk7XG5cbiAgICAgICAgdGhpcy5jb21tYW5kX2hhbmRsZXIgPSBuZXcgQ29tbWFuZEhhbmRsZXIodGhpcy5hcHAsIHRoaXMpO1xuICAgICAgICB0aGlzLmNvbW1hbmRfaGFuZGxlci5zZXR1cCgpO1xuXG4gICAgICAgIGFkZEljb24oXCJ0ZW1wbGF0ZXItaWNvblwiLCBJQ09OX0RBVEEpO1xuICAgICAgICB0aGlzLmFkZFJpYmJvbkljb24oXCJ0ZW1wbGF0ZXItaWNvblwiLCBcIlRlbXBsYXRlclwiLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZ1enp5X3N1Z2dlc3Rlci5pbnNlcnRfdGVtcGxhdGUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBUZW1wbGF0ZXJTZXR0aW5nVGFiKHRoaXMuYXBwLCB0aGlzKSk7XG5cbiAgICAgICAgLy8gRmlsZXMgbWlnaHQgbm90IGJlIGNyZWF0ZWQgeWV0XG4gICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5vbkxheW91dFJlYWR5KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGVyLmV4ZWN1dGVfc3RhcnR1cF9zY3JpcHRzKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIHNhdmVfc2V0dGluZ3MoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XG4gICAgfVxuXG4gICAgYXN5bmMgbG9hZF9zZXR0aW5ncygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAgICB7fSxcbiAgICAgICAgICAgIERFRkFVTFRfU0VUVElOR1MsXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmxvYWREYXRhKClcbiAgICAgICAgKTtcbiAgICB9XG59XG4iXSwibmFtZXMiOlsiTm90aWNlIiwiZWZmZWN0IiwibWluIiwibWF4IiwibWF0aE1heCIsIm1hdGhNaW4iLCJoYXNoIiwiYWxsUGxhY2VtZW50cyIsInBsYWNlbWVudHMiLCJwb3BwZXJPZmZzZXRzIiwiY29tcHV0ZVN0eWxlcyIsImFwcGx5U3R5bGVzIiwib2Zmc2V0IiwiZmxpcCIsInByZXZlbnRPdmVyZmxvdyIsImFycm93IiwiaGlkZSIsIlNjb3BlIiwiVEZvbGRlciIsIm5vcm1hbGl6ZVBhdGgiLCJURmlsZSIsIlZhdWx0IiwiUGx1Z2luU2V0dGluZ1RhYiIsIlNldHRpbmciLCJGdXp6eVN1Z2dlc3RNb2RhbCIsIk1hcmtkb3duVmlldyIsInBhcnNlTGlua3RleHQiLCJyZXNvbHZlU3VicGF0aCIsIlBsYXRmb3JtIiwiRmlsZVN5c3RlbUFkYXB0ZXIiLCJnZXRBbGxUYWdzIiwiTW9kYWwiLCJwcm9taXNpZnkiLCJleGVjIiwib2JzaWRpYW5fbW9kdWxlIiwicGF0aCIsImV4aXN0c1N5bmMiLCJyZWFkRmlsZVN5bmMiLCJFdGEucmVuZGVyQXN5bmMiLCJQbHVnaW4iLCJhZGRJY29uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXVEQTtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFF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
