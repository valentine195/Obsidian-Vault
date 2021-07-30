'use strict';

var obsidian = require('obsidian');

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

function createCommonjsModule(fn, basedir, module) {
	return module = {
		path: basedir,
		exports: {},
		require: function (path, base) {
			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
		}
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var lexer = createCommonjsModule(function (module) {
module.exports = Lexer;

Lexer.defunct = function (chr) {
    throw new Error("Unexpected character at index " + (this.index - 1) + ": " + chr);
};

function Lexer(defunct) {
    if (typeof defunct !== "function") defunct = Lexer.defunct;

    var tokens = [];
    var rules = [];
    var remove = 0;
    this.state = 0;
    this.index = 0;
    this.input = "";

    this.addRule = function (pattern, action, start) {
        var global = pattern.global;

        if (!global) {
            var flags = "g";
            if (pattern.multiline) flags += "m";
            if (pattern.ignoreCase) flags += "i";
            pattern = new RegExp(pattern.source, flags);
        }

        if (Object.prototype.toString.call(start) !== "[object Array]") start = [0];

        rules.push({
            pattern: pattern,
            global: global,
            action: action,
            start: start
        });

        return this;
    };

    this.setInput = function (input) {
        remove = 0;
        this.state = 0;
        this.index = 0;
        tokens.length = 0;
        this.input = input;
        return this;
    };

    this.lex = function () {
        if (tokens.length) return tokens.shift();

        this.reject = true;

        while (this.index <= this.input.length) {
            var matches = scan.call(this).splice(remove);
            var index = this.index;

            while (matches.length) {
                if (this.reject) {
                    var match = matches.shift();
                    var result = match.result;
                    var length = match.length;
                    this.index += length;
                    this.reject = false;
                    remove++;

                    var token = match.action.apply(this, result);
                    if (this.reject) this.index = result.index;
                    else if (typeof token !== "undefined") {
                        switch (Object.prototype.toString.call(token)) {
                        case "[object Array]":
                            tokens = token.slice(1);
                            token = token[0];
                        default:
                            if (length) remove = 0;
                            return token;
                        }
                    }
                } else break;
            }

            var input = this.input;

            if (index < input.length) {
                if (this.reject) {
                    remove = 0;
                    var token = defunct.call(this, input.charAt(this.index++));
                    if (typeof token !== "undefined") {
                        if (Object.prototype.toString.call(token) === "[object Array]") {
                            tokens = token.slice(1);
                            return token[0];
                        } else return token;
                    }
                } else {
                    if (this.index !== index) remove = 0;
                    this.reject = true;
                }
            } else if (matches.length)
                this.reject = true;
            else break;
        }
    };

    function scan() {
        var matches = [];
        var index = 0;

        var state = this.state;
        var lastIndex = this.index;
        var input = this.input;

        for (var i = 0, length = rules.length; i < length; i++) {
            var rule = rules[i];
            var start = rule.start;
            var states = start.length;

            if ((!states || start.indexOf(state) >= 0) ||
                (state % 2 && states === 1 && !start[0])) {
                var pattern = rule.pattern;
                pattern.lastIndex = lastIndex;
                var result = pattern.exec(input);

                if (result && result.index === lastIndex) {
                    var j = matches.push({
                        result: result,
                        action: rule.action,
                        length: result[0].length
                    });

                    if (rule.global) index = j;

                    while (--j > index) {
                        var k = j - 1;

                        if (matches[j].length > matches[k].length) {
                            var temple = matches[j];
                            matches[j] = matches[k];
                            matches[k] = temple;
                        }
                    }
                }
            }
        }

        return matches;
    }
}
});

/*!
 * Font Awesome Free 5.15.3 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 */
var faDice = {
  prefix: 'fas',
  iconName: 'dice',
  icon: [640, 512, [], "f522", "M592 192H473.26c12.69 29.59 7.12 65.2-17 89.32L320 417.58V464c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48V240c0-26.51-21.49-48-48-48zM480 376c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm-46.37-186.7L258.7 14.37c-19.16-19.16-50.23-19.16-69.39 0L14.37 189.3c-19.16 19.16-19.16 50.23 0 69.39L189.3 433.63c19.16 19.16 50.23 19.16 69.39 0L433.63 258.7c19.16-19.17 19.16-50.24 0-69.4zM96 248c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm128 128c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm0-128c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm0-128c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm128 128c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24z"]
};

/*!
 * Font Awesome Free 5.15.3 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 */

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
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

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var noop = function noop() {};

var _WINDOW = {};
var _DOCUMENT = {};
var _MUTATION_OBSERVER = null;
var _PERFORMANCE = {
  mark: noop,
  measure: noop
};

try {
  if (typeof window !== 'undefined') _WINDOW = window;
  if (typeof document !== 'undefined') _DOCUMENT = document;
  if (typeof MutationObserver !== 'undefined') _MUTATION_OBSERVER = MutationObserver;
  if (typeof performance !== 'undefined') _PERFORMANCE = performance;
} catch (e) {}

var _ref = _WINDOW.navigator || {},
    _ref$userAgent = _ref.userAgent,
    userAgent = _ref$userAgent === void 0 ? '' : _ref$userAgent;

var WINDOW = _WINDOW;
var DOCUMENT = _DOCUMENT;
var PERFORMANCE = _PERFORMANCE;
!!WINDOW.document;
var IS_DOM = !!DOCUMENT.documentElement && !!DOCUMENT.head && typeof DOCUMENT.addEventListener === 'function' && typeof DOCUMENT.createElement === 'function';
~userAgent.indexOf('MSIE') || ~userAgent.indexOf('Trident/');

var NAMESPACE_IDENTIFIER = '___FONT_AWESOME___';
var DEFAULT_FAMILY_PREFIX = 'fa';
var DEFAULT_REPLACEMENT_CLASS = 'svg-inline--fa';
var DATA_FA_I2SVG = 'data-fa-i2svg';
(function () {
  try {
    return process.env.NODE_ENV === 'production';
  } catch (e) {
    return false;
  }
})();
var DUOTONE_CLASSES = {
  GROUP: 'group',
  SWAP_OPACITY: 'swap-opacity',
  PRIMARY: 'primary',
  SECONDARY: 'secondary'
};

var initial = WINDOW.FontAwesomeConfig || {};

function getAttrConfig(attr) {
  var element = DOCUMENT.querySelector('script[' + attr + ']');

  if (element) {
    return element.getAttribute(attr);
  }
}

function coerce(val) {
  // Getting an empty string will occur if the attribute is set on the HTML tag but without a value
  // We'll assume that this is an indication that it should be toggled to true
  // For example <script data-search-pseudo-elements src="..."></script>
  if (val === '') return true;
  if (val === 'false') return false;
  if (val === 'true') return true;
  return val;
}

if (DOCUMENT && typeof DOCUMENT.querySelector === 'function') {
  var attrs = [['data-family-prefix', 'familyPrefix'], ['data-replacement-class', 'replacementClass'], ['data-auto-replace-svg', 'autoReplaceSvg'], ['data-auto-add-css', 'autoAddCss'], ['data-auto-a11y', 'autoA11y'], ['data-search-pseudo-elements', 'searchPseudoElements'], ['data-observe-mutations', 'observeMutations'], ['data-mutate-approach', 'mutateApproach'], ['data-keep-original-source', 'keepOriginalSource'], ['data-measure-performance', 'measurePerformance'], ['data-show-missing-icons', 'showMissingIcons']];
  attrs.forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        attr = _ref2[0],
        key = _ref2[1];

    var val = coerce(getAttrConfig(attr));

    if (val !== undefined && val !== null) {
      initial[key] = val;
    }
  });
}

var _default = {
  familyPrefix: DEFAULT_FAMILY_PREFIX,
  replacementClass: DEFAULT_REPLACEMENT_CLASS,
  autoReplaceSvg: true,
  autoAddCss: true,
  autoA11y: true,
  searchPseudoElements: false,
  observeMutations: true,
  mutateApproach: 'async',
  keepOriginalSource: true,
  measurePerformance: false,
  showMissingIcons: true
};

var _config = _objectSpread({}, _default, initial);

if (!_config.autoReplaceSvg) _config.observeMutations = false;

var config = _objectSpread({}, _config);

WINDOW.FontAwesomeConfig = config;

var w = WINDOW || {};
if (!w[NAMESPACE_IDENTIFIER]) w[NAMESPACE_IDENTIFIER] = {};
if (!w[NAMESPACE_IDENTIFIER].styles) w[NAMESPACE_IDENTIFIER].styles = {};
if (!w[NAMESPACE_IDENTIFIER].hooks) w[NAMESPACE_IDENTIFIER].hooks = {};
if (!w[NAMESPACE_IDENTIFIER].shims) w[NAMESPACE_IDENTIFIER].shims = [];
var namespace = w[NAMESPACE_IDENTIFIER];

var functions = [];

var listener = function listener() {
  DOCUMENT.removeEventListener('DOMContentLoaded', listener);
  loaded = 1;
  functions.map(function (fn) {
    return fn();
  });
};

var loaded = false;

if (IS_DOM) {
  loaded = (DOCUMENT.documentElement.doScroll ? /^loaded|^c/ : /^loaded|^i|^c/).test(DOCUMENT.readyState);
  if (!loaded) DOCUMENT.addEventListener('DOMContentLoaded', listener);
}

typeof global !== 'undefined' && typeof global.process !== 'undefined' && typeof global.process.emit === 'function';
typeof setImmediate === 'undefined' ? setTimeout : setImmediate;
var meaninglessTransform = {
  size: 16,
  x: 0,
  y: 0,
  rotate: 0,
  flipX: false,
  flipY: false
};
function insertCss(css) {
  if (!css || !IS_DOM) {
    return;
  }

  var style = DOCUMENT.createElement('style');
  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  var headChildren = DOCUMENT.head.childNodes;
  var beforeChild = null;

  for (var i = headChildren.length - 1; i > -1; i--) {
    var child = headChildren[i];
    var tagName = (child.tagName || '').toUpperCase();

    if (['STYLE', 'LINK'].indexOf(tagName) > -1) {
      beforeChild = child;
    }
  }

  DOCUMENT.head.insertBefore(style, beforeChild);
  return css;
}
var idPool = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
function nextUniqueId() {
  var size = 12;
  var id = '';

  while (size-- > 0) {
    id += idPool[Math.random() * 62 | 0];
  }

  return id;
}
function htmlEscape(str) {
  return "".concat(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function joinAttributes(attributes) {
  return Object.keys(attributes || {}).reduce(function (acc, attributeName) {
    return acc + "".concat(attributeName, "=\"").concat(htmlEscape(attributes[attributeName]), "\" ");
  }, '').trim();
}
function joinStyles(styles) {
  return Object.keys(styles || {}).reduce(function (acc, styleName) {
    return acc + "".concat(styleName, ": ").concat(styles[styleName], ";");
  }, '');
}
function transformIsMeaningful(transform) {
  return transform.size !== meaninglessTransform.size || transform.x !== meaninglessTransform.x || transform.y !== meaninglessTransform.y || transform.rotate !== meaninglessTransform.rotate || transform.flipX || transform.flipY;
}
function transformForSvg(_ref) {
  var transform = _ref.transform,
      containerWidth = _ref.containerWidth,
      iconWidth = _ref.iconWidth;
  var outer = {
    transform: "translate(".concat(containerWidth / 2, " 256)")
  };
  var innerTranslate = "translate(".concat(transform.x * 32, ", ").concat(transform.y * 32, ") ");
  var innerScale = "scale(".concat(transform.size / 16 * (transform.flipX ? -1 : 1), ", ").concat(transform.size / 16 * (transform.flipY ? -1 : 1), ") ");
  var innerRotate = "rotate(".concat(transform.rotate, " 0 0)");
  var inner = {
    transform: "".concat(innerTranslate, " ").concat(innerScale, " ").concat(innerRotate)
  };
  var path = {
    transform: "translate(".concat(iconWidth / 2 * -1, " -256)")
  };
  return {
    outer: outer,
    inner: inner,
    path: path
  };
}

var ALL_SPACE = {
  x: 0,
  y: 0,
  width: '100%',
  height: '100%'
};

function fillBlack(abstract) {
  var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  if (abstract.attributes && (abstract.attributes.fill || force)) {
    abstract.attributes.fill = 'black';
  }

  return abstract;
}

function deGroup(abstract) {
  if (abstract.tag === 'g') {
    return abstract.children;
  } else {
    return [abstract];
  }
}

function makeIconMasking (_ref) {
  var children = _ref.children,
      attributes = _ref.attributes,
      main = _ref.main,
      mask = _ref.mask,
      explicitMaskId = _ref.maskId,
      transform = _ref.transform;
  var mainWidth = main.width,
      mainPath = main.icon;
  var maskWidth = mask.width,
      maskPath = mask.icon;
  var trans = transformForSvg({
    transform: transform,
    containerWidth: maskWidth,
    iconWidth: mainWidth
  });
  var maskRect = {
    tag: 'rect',
    attributes: _objectSpread({}, ALL_SPACE, {
      fill: 'white'
    })
  };
  var maskInnerGroupChildrenMixin = mainPath.children ? {
    children: mainPath.children.map(fillBlack)
  } : {};
  var maskInnerGroup = {
    tag: 'g',
    attributes: _objectSpread({}, trans.inner),
    children: [fillBlack(_objectSpread({
      tag: mainPath.tag,
      attributes: _objectSpread({}, mainPath.attributes, trans.path)
    }, maskInnerGroupChildrenMixin))]
  };
  var maskOuterGroup = {
    tag: 'g',
    attributes: _objectSpread({}, trans.outer),
    children: [maskInnerGroup]
  };
  var maskId = "mask-".concat(explicitMaskId || nextUniqueId());
  var clipId = "clip-".concat(explicitMaskId || nextUniqueId());
  var maskTag = {
    tag: 'mask',
    attributes: _objectSpread({}, ALL_SPACE, {
      id: maskId,
      maskUnits: 'userSpaceOnUse',
      maskContentUnits: 'userSpaceOnUse'
    }),
    children: [maskRect, maskOuterGroup]
  };
  var defs = {
    tag: 'defs',
    children: [{
      tag: 'clipPath',
      attributes: {
        id: clipId
      },
      children: deGroup(maskPath)
    }, maskTag]
  };
  children.push(defs, {
    tag: 'rect',
    attributes: _objectSpread({
      fill: 'currentColor',
      'clip-path': "url(#".concat(clipId, ")"),
      mask: "url(#".concat(maskId, ")")
    }, ALL_SPACE)
  });
  return {
    children: children,
    attributes: attributes
  };
}

function makeIconStandard (_ref) {
  var children = _ref.children,
      attributes = _ref.attributes,
      main = _ref.main,
      transform = _ref.transform,
      styles = _ref.styles;
  var styleString = joinStyles(styles);

  if (styleString.length > 0) {
    attributes['style'] = styleString;
  }

  if (transformIsMeaningful(transform)) {
    var trans = transformForSvg({
      transform: transform,
      containerWidth: main.width,
      iconWidth: main.width
    });
    children.push({
      tag: 'g',
      attributes: _objectSpread({}, trans.outer),
      children: [{
        tag: 'g',
        attributes: _objectSpread({}, trans.inner),
        children: [{
          tag: main.icon.tag,
          children: main.icon.children,
          attributes: _objectSpread({}, main.icon.attributes, trans.path)
        }]
      }]
    });
  } else {
    children.push(main.icon);
  }

  return {
    children: children,
    attributes: attributes
  };
}

function asIcon (_ref) {
  var children = _ref.children,
      main = _ref.main,
      mask = _ref.mask,
      attributes = _ref.attributes,
      styles = _ref.styles,
      transform = _ref.transform;

  if (transformIsMeaningful(transform) && main.found && !mask.found) {
    var width = main.width,
        height = main.height;
    var offset = {
      x: width / height / 2,
      y: 0.5
    };
    attributes['style'] = joinStyles(_objectSpread({}, styles, {
      'transform-origin': "".concat(offset.x + transform.x / 16, "em ").concat(offset.y + transform.y / 16, "em")
    }));
  }

  return [{
    tag: 'svg',
    attributes: attributes,
    children: children
  }];
}

function asSymbol (_ref) {
  var prefix = _ref.prefix,
      iconName = _ref.iconName,
      children = _ref.children,
      attributes = _ref.attributes,
      symbol = _ref.symbol;
  var id = symbol === true ? "".concat(prefix, "-").concat(config.familyPrefix, "-").concat(iconName) : symbol;
  return [{
    tag: 'svg',
    attributes: {
      style: 'display: none;'
    },
    children: [{
      tag: 'symbol',
      attributes: _objectSpread({}, attributes, {
        id: id
      }),
      children: children
    }]
  }];
}

function makeInlineSvgAbstract(params) {
  var _params$icons = params.icons,
      main = _params$icons.main,
      mask = _params$icons.mask,
      prefix = params.prefix,
      iconName = params.iconName,
      transform = params.transform,
      symbol = params.symbol,
      title = params.title,
      maskId = params.maskId,
      titleId = params.titleId,
      extra = params.extra,
      _params$watchable = params.watchable,
      watchable = _params$watchable === void 0 ? false : _params$watchable;

  var _ref = mask.found ? mask : main,
      width = _ref.width,
      height = _ref.height;

  var isUploadedIcon = prefix === 'fak';
  var widthClass = isUploadedIcon ? '' : "fa-w-".concat(Math.ceil(width / height * 16));
  var attrClass = [config.replacementClass, iconName ? "".concat(config.familyPrefix, "-").concat(iconName) : '', widthClass].filter(function (c) {
    return extra.classes.indexOf(c) === -1;
  }).filter(function (c) {
    return c !== '' || !!c;
  }).concat(extra.classes).join(' ');
  var content = {
    children: [],
    attributes: _objectSpread({}, extra.attributes, {
      'data-prefix': prefix,
      'data-icon': iconName,
      'class': attrClass,
      'role': extra.attributes.role || 'img',
      'xmlns': 'http://www.w3.org/2000/svg',
      'viewBox': "0 0 ".concat(width, " ").concat(height)
    })
  };
  var uploadedIconWidthStyle = isUploadedIcon && !~extra.classes.indexOf('fa-fw') ? {
    width: "".concat(width / height * 16 * 0.0625, "em")
  } : {};

  if (watchable) {
    content.attributes[DATA_FA_I2SVG] = '';
  }

  if (title) content.children.push({
    tag: 'title',
    attributes: {
      id: content.attributes['aria-labelledby'] || "title-".concat(titleId || nextUniqueId())
    },
    children: [title]
  });

  var args = _objectSpread({}, content, {
    prefix: prefix,
    iconName: iconName,
    main: main,
    mask: mask,
    maskId: maskId,
    transform: transform,
    symbol: symbol,
    styles: _objectSpread({}, uploadedIconWidthStyle, extra.styles)
  });

  var _ref2 = mask.found && main.found ? makeIconMasking(args) : makeIconStandard(args),
      children = _ref2.children,
      attributes = _ref2.attributes;

  args.children = children;
  args.attributes = attributes;

  if (symbol) {
    return asSymbol(args);
  } else {
    return asIcon(args);
  }
}

var noop$1 = function noop() {};

config.measurePerformance && PERFORMANCE && PERFORMANCE.mark && PERFORMANCE.measure ? PERFORMANCE : {
  mark: noop$1,
  measure: noop$1
};

/**
 * Internal helper to bind a function known to have 4 arguments
 * to a given context.
 */

var bindInternal4 = function bindInternal4(func, thisContext) {
  return function (a, b, c, d) {
    return func.call(thisContext, a, b, c, d);
  };
};

/**
 * # Reduce
 *
 * A fast object `.reduce()` implementation.
 *
 * @param  {Object}   subject      The object to reduce over.
 * @param  {Function} fn           The reducer function.
 * @param  {mixed}    initialValue The initial value for the reducer, defaults to subject[0].
 * @param  {Object}   thisContext  The context for the reducer.
 * @return {mixed}                 The final result.
 */


var reduce = function fastReduceObject(subject, fn, initialValue, thisContext) {
  var keys = Object.keys(subject),
      length = keys.length,
      iterator = thisContext !== undefined ? bindInternal4(fn, thisContext) : fn,
      i,
      key,
      result;

  if (initialValue === undefined) {
    i = 1;
    result = subject[keys[0]];
  } else {
    i = 0;
    result = initialValue;
  }

  for (; i < length; i++) {
    key = keys[i];
    result = iterator(result, subject[key], key, subject);
  }

  return result;
};

function defineIcons(prefix, icons) {
  var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _params$skipHooks = params.skipHooks,
      skipHooks = _params$skipHooks === void 0 ? false : _params$skipHooks;
  var normalized = Object.keys(icons).reduce(function (acc, iconName) {
    var icon = icons[iconName];
    var expanded = !!icon.icon;

    if (expanded) {
      acc[icon.iconName] = icon.icon;
    } else {
      acc[iconName] = icon;
    }

    return acc;
  }, {});

  if (typeof namespace.hooks.addPack === 'function' && !skipHooks) {
    namespace.hooks.addPack(prefix, normalized);
  } else {
    namespace.styles[prefix] = _objectSpread({}, namespace.styles[prefix] || {}, normalized);
  }
  /**
   * Font Awesome 4 used the prefix of `fa` for all icons. With the introduction
   * of new styles we needed to differentiate between them. Prefix `fa` is now an alias
   * for `fas` so we'll easy the upgrade process for our users by automatically defining
   * this as well.
   */


  if (prefix === 'fas') {
    defineIcons('fa', icons);
  }
}

var styles = namespace.styles,
    shims = namespace.shims;
var build = function build() {
  var lookup = function lookup(reducer) {
    return reduce(styles, function (o, style, prefix) {
      o[prefix] = reduce(style, reducer, {});
      return o;
    }, {});
  };

  lookup(function (acc, icon, iconName) {
    if (icon[3]) {
      acc[icon[3]] = iconName;
    }

    return acc;
  });
  lookup(function (acc, icon, iconName) {
    var ligatures = icon[2];
    acc[iconName] = iconName;
    ligatures.forEach(function (ligature) {
      acc[ligature] = iconName;
    });
    return acc;
  });
  var hasRegular = 'far' in styles;
  reduce(shims, function (acc, shim) {
    var oldName = shim[0];
    var prefix = shim[1];
    var iconName = shim[2];

    if (prefix === 'far' && !hasRegular) {
      prefix = 'fas';
    }

    acc[oldName] = {
      prefix: prefix,
      iconName: iconName
    };
    return acc;
  }, {});
};
build();

namespace.styles;
function iconFromMapping(mapping, prefix, iconName) {
  if (mapping && mapping[prefix] && mapping[prefix][iconName]) {
    return {
      prefix: prefix,
      iconName: iconName,
      icon: mapping[prefix][iconName]
    };
  }
}

function toHtml(abstractNodes) {
  var tag = abstractNodes.tag,
      _abstractNodes$attrib = abstractNodes.attributes,
      attributes = _abstractNodes$attrib === void 0 ? {} : _abstractNodes$attrib,
      _abstractNodes$childr = abstractNodes.children,
      children = _abstractNodes$childr === void 0 ? [] : _abstractNodes$childr;

  if (typeof abstractNodes === 'string') {
    return htmlEscape(abstractNodes);
  } else {
    return "<".concat(tag, " ").concat(joinAttributes(attributes), ">").concat(children.map(toHtml).join(''), "</").concat(tag, ">");
  }
}

function MissingIcon(error) {
  this.name = 'MissingIcon';
  this.message = error || 'Icon unavailable';
  this.stack = new Error().stack;
}
MissingIcon.prototype = Object.create(Error.prototype);
MissingIcon.prototype.constructor = MissingIcon;

var FILL = {
  fill: 'currentColor'
};
var ANIMATION_BASE = {
  attributeType: 'XML',
  repeatCount: 'indefinite',
  dur: '2s'
};
({
  tag: 'path',
  attributes: _objectSpread({}, FILL, {
    d: 'M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z'
  })
});

var OPACITY_ANIMATE = _objectSpread({}, ANIMATION_BASE, {
  attributeName: 'opacity'
});

({
  tag: 'circle',
  attributes: _objectSpread({}, FILL, {
    cx: '256',
    cy: '364',
    r: '28'
  }),
  children: [{
    tag: 'animate',
    attributes: _objectSpread({}, ANIMATION_BASE, {
      attributeName: 'r',
      values: '28;14;28;28;14;28;'
    })
  }, {
    tag: 'animate',
    attributes: _objectSpread({}, OPACITY_ANIMATE, {
      values: '1;0;1;1;0;1;'
    })
  }]
});
({
  tag: 'path',
  attributes: _objectSpread({}, FILL, {
    opacity: '1',
    d: 'M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z'
  }),
  children: [{
    tag: 'animate',
    attributes: _objectSpread({}, OPACITY_ANIMATE, {
      values: '1;0;0;0;0;1;'
    })
  }]
});
({
  tag: 'path',
  attributes: _objectSpread({}, FILL, {
    opacity: '0',
    d: 'M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z'
  }),
  children: [{
    tag: 'animate',
    attributes: _objectSpread({}, OPACITY_ANIMATE, {
      values: '0;0;1;1;0;0;'
    })
  }]
});

namespace.styles;
function asFoundIcon(icon) {
  var width = icon[0];
  var height = icon[1];

  var _icon$slice = icon.slice(4),
      _icon$slice2 = _slicedToArray(_icon$slice, 1),
      vectorData = _icon$slice2[0];

  var element = null;

  if (Array.isArray(vectorData)) {
    element = {
      tag: 'g',
      attributes: {
        class: "".concat(config.familyPrefix, "-").concat(DUOTONE_CLASSES.GROUP)
      },
      children: [{
        tag: 'path',
        attributes: {
          class: "".concat(config.familyPrefix, "-").concat(DUOTONE_CLASSES.SECONDARY),
          fill: 'currentColor',
          d: vectorData[0]
        }
      }, {
        tag: 'path',
        attributes: {
          class: "".concat(config.familyPrefix, "-").concat(DUOTONE_CLASSES.PRIMARY),
          fill: 'currentColor',
          d: vectorData[1]
        }
      }]
    };
  } else {
    element = {
      tag: 'path',
      attributes: {
        fill: 'currentColor',
        d: vectorData
      }
    };
  }

  return {
    found: true,
    width: width,
    height: height,
    icon: element
  };
}

namespace.styles;

var baseStyles = "svg:not(:root).svg-inline--fa {\n  overflow: visible;\n}\n\n.svg-inline--fa {\n  display: inline-block;\n  font-size: inherit;\n  height: 1em;\n  overflow: visible;\n  vertical-align: -0.125em;\n}\n.svg-inline--fa.fa-lg {\n  vertical-align: -0.225em;\n}\n.svg-inline--fa.fa-w-1 {\n  width: 0.0625em;\n}\n.svg-inline--fa.fa-w-2 {\n  width: 0.125em;\n}\n.svg-inline--fa.fa-w-3 {\n  width: 0.1875em;\n}\n.svg-inline--fa.fa-w-4 {\n  width: 0.25em;\n}\n.svg-inline--fa.fa-w-5 {\n  width: 0.3125em;\n}\n.svg-inline--fa.fa-w-6 {\n  width: 0.375em;\n}\n.svg-inline--fa.fa-w-7 {\n  width: 0.4375em;\n}\n.svg-inline--fa.fa-w-8 {\n  width: 0.5em;\n}\n.svg-inline--fa.fa-w-9 {\n  width: 0.5625em;\n}\n.svg-inline--fa.fa-w-10 {\n  width: 0.625em;\n}\n.svg-inline--fa.fa-w-11 {\n  width: 0.6875em;\n}\n.svg-inline--fa.fa-w-12 {\n  width: 0.75em;\n}\n.svg-inline--fa.fa-w-13 {\n  width: 0.8125em;\n}\n.svg-inline--fa.fa-w-14 {\n  width: 0.875em;\n}\n.svg-inline--fa.fa-w-15 {\n  width: 0.9375em;\n}\n.svg-inline--fa.fa-w-16 {\n  width: 1em;\n}\n.svg-inline--fa.fa-w-17 {\n  width: 1.0625em;\n}\n.svg-inline--fa.fa-w-18 {\n  width: 1.125em;\n}\n.svg-inline--fa.fa-w-19 {\n  width: 1.1875em;\n}\n.svg-inline--fa.fa-w-20 {\n  width: 1.25em;\n}\n.svg-inline--fa.fa-pull-left {\n  margin-right: 0.3em;\n  width: auto;\n}\n.svg-inline--fa.fa-pull-right {\n  margin-left: 0.3em;\n  width: auto;\n}\n.svg-inline--fa.fa-border {\n  height: 1.5em;\n}\n.svg-inline--fa.fa-li {\n  width: 2em;\n}\n.svg-inline--fa.fa-fw {\n  width: 1.25em;\n}\n\n.fa-layers svg.svg-inline--fa {\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n\n.fa-layers {\n  display: inline-block;\n  height: 1em;\n  position: relative;\n  text-align: center;\n  vertical-align: -0.125em;\n  width: 1em;\n}\n.fa-layers svg.svg-inline--fa {\n  -webkit-transform-origin: center center;\n          transform-origin: center center;\n}\n\n.fa-layers-counter, .fa-layers-text {\n  display: inline-block;\n  position: absolute;\n  text-align: center;\n}\n\n.fa-layers-text {\n  left: 50%;\n  top: 50%;\n  -webkit-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  -webkit-transform-origin: center center;\n          transform-origin: center center;\n}\n\n.fa-layers-counter {\n  background-color: #ff253a;\n  border-radius: 1em;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  color: #fff;\n  height: 1.5em;\n  line-height: 1;\n  max-width: 5em;\n  min-width: 1.5em;\n  overflow: hidden;\n  padding: 0.25em;\n  right: 0;\n  text-overflow: ellipsis;\n  top: 0;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: top right;\n          transform-origin: top right;\n}\n\n.fa-layers-bottom-right {\n  bottom: 0;\n  right: 0;\n  top: auto;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: bottom right;\n          transform-origin: bottom right;\n}\n\n.fa-layers-bottom-left {\n  bottom: 0;\n  left: 0;\n  right: auto;\n  top: auto;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: bottom left;\n          transform-origin: bottom left;\n}\n\n.fa-layers-top-right {\n  right: 0;\n  top: 0;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: top right;\n          transform-origin: top right;\n}\n\n.fa-layers-top-left {\n  left: 0;\n  right: auto;\n  top: 0;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: top left;\n          transform-origin: top left;\n}\n\n.fa-lg {\n  font-size: 1.3333333333em;\n  line-height: 0.75em;\n  vertical-align: -0.0667em;\n}\n\n.fa-xs {\n  font-size: 0.75em;\n}\n\n.fa-sm {\n  font-size: 0.875em;\n}\n\n.fa-1x {\n  font-size: 1em;\n}\n\n.fa-2x {\n  font-size: 2em;\n}\n\n.fa-3x {\n  font-size: 3em;\n}\n\n.fa-4x {\n  font-size: 4em;\n}\n\n.fa-5x {\n  font-size: 5em;\n}\n\n.fa-6x {\n  font-size: 6em;\n}\n\n.fa-7x {\n  font-size: 7em;\n}\n\n.fa-8x {\n  font-size: 8em;\n}\n\n.fa-9x {\n  font-size: 9em;\n}\n\n.fa-10x {\n  font-size: 10em;\n}\n\n.fa-fw {\n  text-align: center;\n  width: 1.25em;\n}\n\n.fa-ul {\n  list-style-type: none;\n  margin-left: 2.5em;\n  padding-left: 0;\n}\n.fa-ul > li {\n  position: relative;\n}\n\n.fa-li {\n  left: -2em;\n  position: absolute;\n  text-align: center;\n  width: 2em;\n  line-height: inherit;\n}\n\n.fa-border {\n  border: solid 0.08em #eee;\n  border-radius: 0.1em;\n  padding: 0.2em 0.25em 0.15em;\n}\n\n.fa-pull-left {\n  float: left;\n}\n\n.fa-pull-right {\n  float: right;\n}\n\n.fa.fa-pull-left,\n.fas.fa-pull-left,\n.far.fa-pull-left,\n.fal.fa-pull-left,\n.fab.fa-pull-left {\n  margin-right: 0.3em;\n}\n.fa.fa-pull-right,\n.fas.fa-pull-right,\n.far.fa-pull-right,\n.fal.fa-pull-right,\n.fab.fa-pull-right {\n  margin-left: 0.3em;\n}\n\n.fa-spin {\n  -webkit-animation: fa-spin 2s infinite linear;\n          animation: fa-spin 2s infinite linear;\n}\n\n.fa-pulse {\n  -webkit-animation: fa-spin 1s infinite steps(8);\n          animation: fa-spin 1s infinite steps(8);\n}\n\n@-webkit-keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n\n@keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n.fa-rotate-90 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=1)\";\n  -webkit-transform: rotate(90deg);\n          transform: rotate(90deg);\n}\n\n.fa-rotate-180 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2)\";\n  -webkit-transform: rotate(180deg);\n          transform: rotate(180deg);\n}\n\n.fa-rotate-270 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=3)\";\n  -webkit-transform: rotate(270deg);\n          transform: rotate(270deg);\n}\n\n.fa-flip-horizontal {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)\";\n  -webkit-transform: scale(-1, 1);\n          transform: scale(-1, 1);\n}\n\n.fa-flip-vertical {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";\n  -webkit-transform: scale(1, -1);\n          transform: scale(1, -1);\n}\n\n.fa-flip-both, .fa-flip-horizontal.fa-flip-vertical {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";\n  -webkit-transform: scale(-1, -1);\n          transform: scale(-1, -1);\n}\n\n:root .fa-rotate-90,\n:root .fa-rotate-180,\n:root .fa-rotate-270,\n:root .fa-flip-horizontal,\n:root .fa-flip-vertical,\n:root .fa-flip-both {\n  -webkit-filter: none;\n          filter: none;\n}\n\n.fa-stack {\n  display: inline-block;\n  height: 2em;\n  position: relative;\n  width: 2.5em;\n}\n\n.fa-stack-1x,\n.fa-stack-2x {\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n\n.svg-inline--fa.fa-stack-1x {\n  height: 1em;\n  width: 1.25em;\n}\n.svg-inline--fa.fa-stack-2x {\n  height: 2em;\n  width: 2.5em;\n}\n\n.fa-inverse {\n  color: #fff;\n}\n\n.sr-only {\n  border: 0;\n  clip: rect(0, 0, 0, 0);\n  height: 1px;\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n  width: 1px;\n}\n\n.sr-only-focusable:active, .sr-only-focusable:focus {\n  clip: auto;\n  height: auto;\n  margin: 0;\n  overflow: visible;\n  position: static;\n  width: auto;\n}\n\n.svg-inline--fa .fa-primary {\n  fill: var(--fa-primary-color, currentColor);\n  opacity: 1;\n  opacity: var(--fa-primary-opacity, 1);\n}\n\n.svg-inline--fa .fa-secondary {\n  fill: var(--fa-secondary-color, currentColor);\n  opacity: 0.4;\n  opacity: var(--fa-secondary-opacity, 0.4);\n}\n\n.svg-inline--fa.fa-swap-opacity .fa-primary {\n  opacity: 0.4;\n  opacity: var(--fa-secondary-opacity, 0.4);\n}\n\n.svg-inline--fa.fa-swap-opacity .fa-secondary {\n  opacity: 1;\n  opacity: var(--fa-primary-opacity, 1);\n}\n\n.svg-inline--fa mask .fa-primary,\n.svg-inline--fa mask .fa-secondary {\n  fill: black;\n}\n\n.fad.fa-inverse {\n  color: #fff;\n}";

function css () {
  var dfp = DEFAULT_FAMILY_PREFIX;
  var drc = DEFAULT_REPLACEMENT_CLASS;
  var fp = config.familyPrefix;
  var rc = config.replacementClass;
  var s = baseStyles;

  if (fp !== dfp || rc !== drc) {
    var dPatt = new RegExp("\\.".concat(dfp, "\\-"), 'g');
    var customPropPatt = new RegExp("\\--".concat(dfp, "\\-"), 'g');
    var rPatt = new RegExp("\\.".concat(drc), 'g');
    s = s.replace(dPatt, ".".concat(fp, "-")).replace(customPropPatt, "--".concat(fp, "-")).replace(rPatt, ".".concat(rc));
  }

  return s;
}

var Library =
/*#__PURE__*/
function () {
  function Library() {
    _classCallCheck(this, Library);

    this.definitions = {};
  }

  _createClass(Library, [{
    key: "add",
    value: function add() {
      var _this = this;

      for (var _len = arguments.length, definitions = new Array(_len), _key = 0; _key < _len; _key++) {
        definitions[_key] = arguments[_key];
      }

      var additions = definitions.reduce(this._pullDefinitions, {});
      Object.keys(additions).forEach(function (key) {
        _this.definitions[key] = _objectSpread({}, _this.definitions[key] || {}, additions[key]);
        defineIcons(key, additions[key]);
        build();
      });
    }
  }, {
    key: "reset",
    value: function reset() {
      this.definitions = {};
    }
  }, {
    key: "_pullDefinitions",
    value: function _pullDefinitions(additions, definition) {
      var normalized = definition.prefix && definition.iconName && definition.icon ? {
        0: definition
      } : definition;
      Object.keys(normalized).map(function (key) {
        var _normalized$key = normalized[key],
            prefix = _normalized$key.prefix,
            iconName = _normalized$key.iconName,
            icon = _normalized$key.icon;
        if (!additions[prefix]) additions[prefix] = {};
        additions[prefix][iconName] = icon;
      });
      return additions;
    }
  }]);

  return Library;
}();

function ensureCss() {
  if (config.autoAddCss && !_cssInserted) {
    insertCss(css());

    _cssInserted = true;
  }
}

function apiObject(val, abstractCreator) {
  Object.defineProperty(val, 'abstract', {
    get: abstractCreator
  });
  Object.defineProperty(val, 'html', {
    get: function get() {
      return val.abstract.map(function (a) {
        return toHtml(a);
      });
    }
  });
  Object.defineProperty(val, 'node', {
    get: function get() {
      if (!IS_DOM) return;
      var container = DOCUMENT.createElement('div');
      container.innerHTML = val.html;
      return container.children;
    }
  });
  return val;
}

function findIconDefinition(iconLookup) {
  var _iconLookup$prefix = iconLookup.prefix,
      prefix = _iconLookup$prefix === void 0 ? 'fa' : _iconLookup$prefix,
      iconName = iconLookup.iconName;
  if (!iconName) return;
  return iconFromMapping(library.definitions, prefix, iconName) || iconFromMapping(namespace.styles, prefix, iconName);
}

function resolveIcons(next) {
  return function (maybeIconDefinition) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var iconDefinition = (maybeIconDefinition || {}).icon ? maybeIconDefinition : findIconDefinition(maybeIconDefinition || {});
    var mask = params.mask;

    if (mask) {
      mask = (mask || {}).icon ? mask : findIconDefinition(mask || {});
    }

    return next(iconDefinition, _objectSpread({}, params, {
      mask: mask
    }));
  };
}

var library = new Library();
var _cssInserted = false;
var icon = resolveIcons(function (iconDefinition) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _params$transform = params.transform,
      transform = _params$transform === void 0 ? meaninglessTransform : _params$transform,
      _params$symbol = params.symbol,
      symbol = _params$symbol === void 0 ? false : _params$symbol,
      _params$mask = params.mask,
      mask = _params$mask === void 0 ? null : _params$mask,
      _params$maskId = params.maskId,
      maskId = _params$maskId === void 0 ? null : _params$maskId,
      _params$title = params.title,
      title = _params$title === void 0 ? null : _params$title,
      _params$titleId = params.titleId,
      titleId = _params$titleId === void 0 ? null : _params$titleId,
      _params$classes = params.classes,
      classes = _params$classes === void 0 ? [] : _params$classes,
      _params$attributes = params.attributes,
      attributes = _params$attributes === void 0 ? {} : _params$attributes,
      _params$styles = params.styles,
      styles = _params$styles === void 0 ? {} : _params$styles;
  if (!iconDefinition) return;
  var prefix = iconDefinition.prefix,
      iconName = iconDefinition.iconName,
      icon = iconDefinition.icon;
  return apiObject(_objectSpread({
    type: 'icon'
  }, iconDefinition), function () {
    ensureCss();

    if (config.autoA11y) {
      if (title) {
        attributes['aria-labelledby'] = "".concat(config.replacementClass, "-title-").concat(titleId || nextUniqueId());
      } else {
        attributes['aria-hidden'] = 'true';
        attributes['focusable'] = 'false';
      }
    }

    return makeInlineSvgAbstract({
      icons: {
        main: asFoundIcon(icon),
        mask: mask ? asFoundIcon(mask.icon) : {
          found: false,
          width: null,
          height: null,
          icon: {}
        }
      },
      prefix: prefix,
      iconName: iconName,
      transform: _objectSpread({}, meaninglessTransform, transform),
      symbol: symbol,
      title: title,
      maskId: maskId,
      titleId: titleId,
      extra: {
        attributes: attributes,
        styles: styles,
        classes: classes
      }
    });
  });
});

const MATCH = /^\|?([\s\S]+?)\|?$/;
const SPLIT = /\|/;
function extract(content) {
    const lines = content.split("\n");
    const inner = lines.map((l) => { var _a; return ((_a = l.trim().match(MATCH)) !== null && _a !== void 0 ? _a : [, l.trim()])[1]; });
    const headers = inner[0].split(SPLIT);
    const rows = [];
    const ret = [];
    for (let index in headers) {
        let header = headers[index];
        if (!header.trim().length)
            header = index;
        ret.push([header.trim(), []]);
    }
    for (let line of lines.slice(2)) {
        const entries = line
            .trim()
            .split(SPLIT)
            .map((e) => e.trim())
            .filter((e) => e.length);
        rows.push(entries.join(" | "));
        for (let index in entries) {
            const entry = entries[index].trim();
            if (!entry.length || !ret[index])
                continue;
            ret[index][1].push(entry);
        }
    }
    return {
        columns: Object.fromEntries(ret),
        rows: rows
    };
}
/**
 * Inserts a new result into a results map.
 *
 * @private
 * @param {ResultMapInterface} map Results map to modify.
 * @param {number} index Index to insert the new value.
 * @param {ResultInterface} value Value to insert.
 * @memberof DiceRoll
 */
function _insertIntoMap(map, index, value) {
    /** Get all values above index, then reverse them */
    let toUpdate = [...map].slice(index).reverse();
    /** Loop through the values and re-insert them into the map at key + 1 */
    toUpdate.forEach(([key, value]) => {
        map.set(key + 1, value);
    });
    /** Insert the new value at the specified index */
    map.set(index, value);
}
function _getRandomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function _checkCondition(value, conditions) {
    return conditions.every(({ operator, comparer }) => {
        if (Number.isNaN(value) || Number.isNaN(comparer)) {
            return false;
        }
        let result = false;
        switch (operator) {
            case "=":
                result = value === comparer;
                break;
            case "!=":
            case "=!":
                result = value !== comparer;
                break;
            case "<":
                result = value < comparer;
                break;
            case "<=":
                result = value <= comparer;
                break;
            case ">":
                result = value > comparer;
                break;
            case ">=":
                result = value >= comparer;
                break;
        }
        return result;
    });
}

class DiceRoll {
    constructor(dice) {
        this.modifiers = [];
        this.modifiersAllowed = true;
        this.static = false;
        if (!/(\-?\d+)[dD]?(\d+|%|\[\d+,\s?\d+\])?/.test(dice)) {
            throw new Error("Non parseable dice string passed to DiceRoll.");
        }
        this.dice = dice.split(" ").join("");
        if (/^-?\d+$/.test(this.dice)) {
            this.static = true;
            this.modifiersAllowed = false;
        }
        let [, rolls, min = null, max = 1] = this.dice.match(/(\-?\d+)[dD]\[?(?:(-?\d+)\s?,)?\s?(-?\d+|%|F)\]?/) || [, 1, null, 1];
        this.rolls = Number(rolls) || 1;
        if (Number(max) < 0 && !min) {
            min = -1;
        }
        if (max === "%")
            max = 100;
        if (max === "F") {
            max = 1;
            min = -1;
        }
        if (Number(max) < Number(min)) {
            [max, min] = [min, max];
        }
        this.faces = { max: max ? Number(max) : 1, min: min ? Number(min) : 1 };
        this.originalRoll = this.roll();
        this.results = new Map([...this.originalRoll].map((n, i) => {
            return [i, { usable: true, value: n, modifiers: new Set() }];
        }));
    }
    get text() {
        return `${this.result}`;
    }
    get result() {
        if (this.static) {
            return Number(this.dice);
        }
        const results = [...this.results].map(([, { usable, value }]) => usable ? value : 0);
        return results.reduce((a, b) => a + b, 0);
    }
    get display() {
        if (this.static) {
            return `${this.result}`;
        }
        return `[${[...this.results]
            .map(([, { modifiers, value }]) => `${value}${[...modifiers].join("")}`)
            .join(", ")}]`;
    }
    keepLow(drop = 1) {
        if (!this.modifiersAllowed) {
            new obsidian.Notice("Modifiers are only allowed on dice rolls.");
            return;
        }
        [...this.results]
            .sort((a, b) => a[1].value - b[1].value)
            .slice(drop - this.results.size)
            .forEach(([index]) => {
            const previous = this.results.get(index);
            previous.usable = false;
            previous.modifiers.add("d");
            this.results.set(index, Object.assign({}, previous));
        });
    }
    keepHigh(drop = 1) {
        if (!this.modifiersAllowed) {
            new obsidian.Notice("Modifiers are only allowed on dice rolls.");
            return;
        }
        [...this.results]
            .sort((a, b) => b[1].value - a[1].value)
            .slice(drop)
            .forEach(([index]) => {
            const previous = this.results.get(index);
            previous.usable = false;
            previous.modifiers.add("d");
            this.results.set(index, Object.assign({}, previous));
        });
    }
    reroll(times, conditionals) {
        if (!this.modifiersAllowed) {
            new obsidian.Notice("Modifiers are only allowed on dice rolls.");
            return;
        }
        /**
         * Build Conditional
         */
        if (!conditionals.length) {
            conditionals.push({
                operator: "=",
                comparer: this.faces.min
            });
        }
        /**
         * Find values that pass the conditional.
         */
        let i = 0, toReroll = [...this.results].filter(([, { value }]) => _checkCondition(value, conditionals));
        while (i < times &&
            toReroll.filter(([, { value }]) => _checkCondition(value, conditionals)).length > 0) {
            i++;
            toReroll.map(([, roll]) => {
                roll.modifiers.add("r");
                roll.value = _getRandomBetween(this.faces.min, this.faces.max);
            });
        }
        toReroll.forEach(([index, value]) => {
            this.results.set(index, value);
        });
    }
    explodeAndCombine(times, conditionals) {
        if (!this.modifiersAllowed) {
            new obsidian.Notice("Modifiers are only allowed on dice rolls.");
            return;
        }
        /**
         * Build Conditional
         */
        if (!conditionals.length) {
            conditionals.push({
                operator: "=",
                comparer: this.faces.max
            });
        }
        /**
         * Find values that pass the conditional
         */
        let i = 0, toExplode = [...this.results].filter(([, { value }]) => _checkCondition(value, conditionals));
        toExplode.forEach(([index, value]) => {
            let newRoll = _getRandomBetween(this.faces.min, this.faces.max);
            i++;
            value.modifiers.add("!");
            value.value += newRoll;
            this.results.set(index, value);
            while (i < times && _checkCondition(newRoll, conditionals)) {
                i++;
                newRoll = _getRandomBetween(this.faces.min, this.faces.max);
                value.value += newRoll;
                this.results.set(index, value);
            }
        });
    }
    explode(times, conditionals) {
        if (!this.modifiersAllowed) {
            new obsidian.Notice("Modifiers are only allowed on dice rolls.");
            return;
        }
        /**
         * Build Conditional
         */
        if (!conditionals.length) {
            conditionals.push({
                operator: "=",
                comparer: this.faces.max
            });
        }
        /**
         * Find values that pass the conditional
         */
        let toExplode = [...this.results].filter(([, { value }]) => _checkCondition(value, conditionals));
        /** Track how many have been inserted */
        let inserted = 0;
        /** Loop through values that need to explode */
        toExplode.forEach(([key, value]) => {
            /** newRoll is the new value to check against the max face value */
            let newRoll = value.value;
            /** i tracks how many times this roll has been exploded */
            let i = 0;
            /**
             * Explode max rolls.
             */
            while (i < times && _checkCondition(newRoll, conditionals)) {
                let previous = this.results.get(key + inserted + i);
                previous.modifiers.add("!");
                newRoll = _getRandomBetween(this.faces.min, this.faces.max);
                /** Insert the new roll into the results map */
                _insertIntoMap(this.results, key + inserted + i + 1, {
                    usable: true,
                    value: newRoll,
                    modifiers: new Set()
                });
                i++;
            }
            /** Update how many have been inserted. */
            inserted += i;
        });
    }
    roll() {
        if (this.static) {
            return [Number(this.dice)];
        }
        return [...Array(this.rolls)].map(() => _getRandomBetween(this.faces.min, this.faces.max));
    }
}
class StuntRoll extends DiceRoll {
    constructor(dice) {
        super(`3d6`);
        this.dice = dice;
    }
    get doubles() {
        return (new Set([...this.results].map(([, { usable, value }]) => usable ? value : 0)).size < 3);
    }
    get display() {
        let str = [];
        for (let result of this.results) {
            if (result[0] == 0 && this.doubles) {
                str.push(`${result[1].value}S`);
                continue;
            }
            str.push(`${result[1].value}`);
        }
        return `[${str.join(", ")}]`;
    }
}
class TableRoll {
    constructor(rolls, options, text, link, block) {
        this.rolls = rolls;
        this.options = options;
        this.text = text;
        this.link = link;
        this.block = block;
        this.roll();
    }
    get result() {
        return this.resultArray.join("|");
    }
    get display() {
        return `${this.result}`;
    }
    roll() {
        return (this.resultArray = [...Array(this.rolls)].map(() => this.options[_getRandomBetween(0, this.options.length - 1)]));
    }
}
class SectionRoller extends obsidian.Events {
    constructor(rolls = 1, options, content, file) {
        super();
        this.rolls = rolls;
        this.options = options;
        this.content = content;
        this.file = file;
        this.selected = new Set();
        if (!rolls)
            this.rolls = 1;
        this.roll();
    }
    get text() {
        return this.display;
    }
    get result() {
        return this.resultArray[0];
    }
    get display() {
        let res = this.content
            .get(this.file)
            .slice(this.result.position.start.offset, this.result.position.end.offset);
        return `${res}`;
    }
    displayFromCache(cache) {
        let res = this.content
            .get(cache.file)
            .slice(cache.position.start.offset, cache.position.end.offset);
        return `${res}`;
    }
    get remaining() {
        return this.options.filter((o) => !this.selected.has(o));
    }
    element(parent) {
        parent.empty();
        const holder = parent.createDiv();
        for (let result of Array.from(this.selected)) {
            const resultEl = holder.createDiv();
            if (this.content.size > 1) {
                resultEl.createEl("h5", {
                    cls: "dice-file-name",
                    text: result.file
                });
            }
            resultEl.onclick = (evt) => __awaiter(this, void 0, void 0, function* () {
                if ((evt && evt.getModifierState("Control")) ||
                    evt.getModifierState("Meta")) {
                    evt.stopPropagation();
                    this.trigger("open-link", result.file);
                    return;
                }
            });
            const ret = resultEl.createDiv({
                cls: "markdown-embed"
            });
            if (!result) {
                ret.createDiv({
                    cls: "dice-no-results",
                    text: "No results."
                });
                continue;
            }
            const embed = ret.createDiv({
                attr: {
                    "aria-label": `${result.file}: ${result.type}`
                }
            });
            obsidian.MarkdownRenderer.renderMarkdown(this.displayFromCache(result), embed, "", null);
        }
        holder.onclick = (evt) => __awaiter(this, void 0, void 0, function* () {
            evt.stopPropagation();
            this.roll();
            this.element(parent);
        });
        return holder;
    }
    roll() {
        this.selected = new Set();
        this.resultArray = [...Array(this.rolls)].map(() => {
            const choice = this.remaining[_getRandomBetween(0, this.remaining.length - 1)];
            this.selected.add(choice);
            return choice;
        });
        return this.resultArray;
    }
}
class FileRoller {
    constructor(rolls = 1, options, cache) {
        this.rolls = rolls;
        this.options = options;
        this.cache = cache;
        if (!rolls)
            this.rolls = 1;
        this.roll();
    }
    get result() {
        return this.resultArray[0];
    }
    get text() {
        return "";
    }
    get display() {
        return this.result;
    }
    element(sourcePath = "") {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield this.cache.getFirstLinkpathDest(this.display, sourcePath);
            /* return  */ const link = createEl("a", {
                cls: "internal-link",
                text: file.basename
            });
            return link;
        });
    }
    roll() {
        return (this.resultArray = [...Array(this.rolls)].map(() => this.options[_getRandomBetween(0, this.options.length - 1)]));
    }
}

class Parser {
    constructor(table) {
        this.table = table;
    }
    parse(input) {
        var length = input.length, table = this.table, output = [], stack = [], index = 0;
        while (index < length) {
            var token = input[index++];
            switch (token.data) {
                case "(":
                    stack.unshift(token);
                    break;
                case ")":
                    while (stack.length) {
                        var token = stack.shift();
                        if (token.data === "(")
                            break;
                        else
                            output.push(token);
                    }
                    if (token.data !== "(")
                        throw new Error("Mismatched parentheses.");
                    break;
                default:
                    if (table.hasOwnProperty(token.data)) {
                        while (stack.length) {
                            var punctuator = stack[0];
                            if (punctuator.data === "(")
                                break;
                            var operator = table[token.data], precedence = operator.precedence, antecedence = table[punctuator.data].precedence;
                            if (precedence > antecedence ||
                                (precedence === antecedence &&
                                    operator.associativity === "right"))
                                break;
                            else
                                output.push(stack.shift());
                        }
                        stack.unshift(token);
                    }
                    else
                        output.push(token);
            }
        }
        while (stack.length) {
            var token = stack.shift();
            if (token.data !== "(")
                output.push(token);
            else
                throw new Error("Mismatched parentheses.");
        }
        return output;
    }
}

const TAG_REGEX = /(?:(\d+)[Dd])?(#[\p{Letter}\p{Emoji_Presentation}\w/-]+)(?:\|([\+-]))?(?:\|([^\+-]+))?/u;
const TABLE_REGEX = /(?:(\d+)[Dd])?\[\[([\s\S]+?)#?\^([\s\S]+?)\]\]\|?([\s\S]+)?/;
const SECTION_REGEX = /(?:(\d+)[Dd])?\[\[([\s\S]+)\]\]\|?([\s\S]+)?/;
const MATH_REGEX = /[\(\^\+\-\*\/\)]/;

class SettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
        this.plugin = plugin;
    }
    display() {
        return __awaiter(this, void 0, void 0, function* () {
            let { containerEl } = this;
            containerEl.empty();
            containerEl.createEl("h2", { text: "Dice Roller Settings" });
            new obsidian.Setting(containerEl)
                .setName("Roll All Files for Tags")
                .setDesc("Return a result for each file when rolling tags.")
                .addToggle((t) => {
                t.setValue(this.plugin.returnAllTags);
                t.onChange((v) => __awaiter(this, void 0, void 0, function* () {
                    this.plugin.returnAllTags = v;
                    yield this.plugin.saveData({
                        returnAllTags: this.plugin.returnAllTags,
                        rollLinksForTags: this.plugin.rollLinksForTags
                    });
                }));
            });
            new obsidian.Setting(containerEl)
                .setName("Always Return Links for Tags")
                .setDesc("Enables random link rolling with the link parameter. Override by specifying a section type.")
                .addToggle((t) => {
                t.setValue(this.plugin.rollLinksForTags);
                t.onChange((v) => __awaiter(this, void 0, void 0, function* () {
                    this.plugin.rollLinksForTags = v;
                    yield this.plugin.saveData({
                        returnAllTags: this.plugin.returnAllTags,
                        rollLinksForTags: this.plugin.rollLinksForTags
                    });
                }));
            });
        });
    }
}

String.prototype.matchAll =
    String.prototype.matchAll ||
        function* matchAll(regexp) {
            const flags = regexp.global ? regexp.flags : regexp.flags + "g";
            const re = new RegExp(regexp, flags);
            let match;
            while ((match = re.exec(this))) {
                yield match;
            }
        };
class DiceRoller extends obsidian.Plugin {
    constructor() {
        super(...arguments);
        this.operators = {
            "+": (a, b) => a + b,
            "-": (a, b) => a - b,
            "*": (a, b) => a * b,
            "/": (a, b) => a / b,
            "^": (a, b) => {
                return Math.pow(a, b);
            }
        };
    }
    onload() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            console.log("DiceRoller plugin loaded");
            const data = Object.assign({
                returnAllTags: true,
                rollLinksForTags: false
            }, yield this.loadData());
            this.returnAllTags = (_a = data.returnAllTags) !== null && _a !== void 0 ? _a : true;
            this.rollLinksForTags = (_b = data.rollLinksForTags) !== null && _b !== void 0 ? _b : false;
            this.addSettingTab(new SettingTab(this.app, this));
            const ICON_DEFINITION = Symbol("dice-roller-icon").toString();
            const ICON_SVG = icon(faDice).html[0];
            obsidian.addIcon(ICON_DEFINITION, ICON_SVG);
            this.registerMarkdownPostProcessor((el, ctx) => __awaiter(this, void 0, void 0, function* () {
                let nodeList = el.querySelectorAll("code");
                if (!nodeList.length)
                    return;
                for (const node of Array.from(nodeList)) {
                    if (!/^dice:\s*([\s\S]+)\s*?/.test(node.innerText))
                        return;
                    try {
                        let [, content] = node.innerText.match(/^dice:\s*([\s\S]+)\s*?/);
                        let { text, link, renderMap, tableMap, type, fileMap } = yield this.parseDice(content);
                        let container = createDiv().createDiv({
                            cls: "dice-roller",
                            attr: {
                                "aria-label": `${content}\n${text}`,
                                "aria-label-position": "top",
                                "data-dice": content
                            }
                        });
                        if (type === "render") {
                            container.addClasses([
                                "has-embed",
                                "markdown-embed"
                            ]);
                        }
                        let resultEl = container.createDiv();
                        this.reroll(null, container, resultEl, content, link, renderMap, tableMap, fileMap, type, ctx.sourcePath);
                        const icon = container.createDiv({
                            cls: "dice-roller-button"
                        });
                        obsidian.setIcon(icon, ICON_DEFINITION);
                        node.replaceWith(container);
                        container.onclick = (evt) => this.reroll(evt, container, resultEl, content, link, renderMap, tableMap, fileMap, type, ctx.sourcePath);
                        icon.onclick = (evt) => this.reroll(evt, container, resultEl, content, link, renderMap, tableMap, fileMap, type, ctx.sourcePath);
                    }
                    catch (e) {
                        console.error(e);
                        new obsidian.Notice(`There was an error parsing the dice string: ${node.innerText}.\n\n${e}`, 5000);
                        return;
                    }
                }
            }));
            this.lexer = new lexer();
            this.addLexerRules();
            var exponent = {
                precedence: 3,
                associativity: "right"
            };
            var factor = {
                precedence: 2,
                associativity: "left"
            };
            var term = {
                precedence: 1,
                associativity: "left"
            };
            this.parser = new Parser({
                "+": term,
                "-": term,
                "*": factor,
                "/": factor,
                "^": exponent
            });
        });
    }
    reroll(evt, container, resultEl, content, link, renderMap, tableMap, fileMap, type, sourcePath) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            resultEl.empty();
            if (type === "dice") {
                let { result, text } = yield this.parseDice(content);
                container.setAttrs({
                    "aria-label": `${content}\n${text}`
                });
                resultEl.setText(result.toLocaleString(navigator.language, {
                    maximumFractionDigits: 2
                }));
            }
            else if (type === "table") {
                if (link && evt && evt.getModifierState("Control")) {
                    yield this.app.workspace.openLinkText(link.replace("^", "#^").split(/\|/).shift(), (_a = this.app.workspace.getActiveFile()) === null || _a === void 0 ? void 0 : _a.path, true);
                    return;
                }
                resultEl.empty();
                tableMap.roll();
                const split = tableMap.result.split(/(\[\[(?:[\s\S]+?)\]\])/);
                for (let str of split) {
                    if (/\[\[(?:[\s\S]+?)\]\]/.test(str)) {
                        //link;
                        const [, match] = str.match(/\[\[([\s\S]+?)\]\]/);
                        const internal = resultEl.createEl("a", {
                            cls: "internal-link",
                            text: match
                        });
                        internal.onmouseover = () => {
                            var _a;
                            this.app.workspace.trigger("link-hover", this, //not sure
                            internal, //targetEl
                            match.replace("^", "#^").split("|").shift(), //linkText
                            (_a = this.app.workspace.getActiveFile()) === null || _a === void 0 ? void 0 : _a.path //source
                            );
                        };
                        internal.onclick = (ev) => __awaiter(this, void 0, void 0, function* () {
                            var _b;
                            ev.stopPropagation();
                            yield this.app.workspace.openLinkText(match.replace("^", "#^").split(/\|/).shift(), (_b = this.app.workspace.getActiveFile()) === null || _b === void 0 ? void 0 : _b.path, ev.getModifierState("Control"));
                        });
                        continue;
                    }
                    resultEl.createSpan({ text: str });
                }
            }
            else if (type === "render") {
                resultEl.empty();
                resultEl.addClass("internal-embed");
                for (let [file, elements] of Array.from(renderMap)) {
                    const holder = resultEl.createDiv({
                        attr: {
                            "aria-label": file
                        }
                    });
                    if (renderMap.size > 1) {
                        holder.createEl("h5", {
                            cls: "dice-file-name",
                            text: file
                        });
                    }
                    for (let el of elements) {
                        el.roll();
                        el.element(holder.createDiv());
                        el.on("open-link", (link) => __awaiter(this, void 0, void 0, function* () {
                            var _c;
                            if (link) {
                                yield this.app.workspace.openLinkText(link.replace("^", "#^").split(/\|/).shift(), (_c = this.app.workspace.getActiveFile()) === null || _c === void 0 ? void 0 : _c.path, true);
                            }
                        }));
                    }
                }
            }
            else if (type === "file") {
                fileMap.roll();
                container.setAttrs({
                    "aria-label": `${content}\n${fileMap.display}`
                });
                const link = yield fileMap.element(sourcePath);
                link.onclick = (evt) => __awaiter(this, void 0, void 0, function* () {
                    var _d;
                    evt.stopPropagation();
                    this.app.workspace.openLinkText(fileMap.result.replace("^", "#^").split(/\|/).shift(), (_d = this.app.workspace.getActiveFile()) === null || _d === void 0 ? void 0 : _d.path, true);
                });
                link.onmouseenter = (evt) => __awaiter(this, void 0, void 0, function* () {
                    var _e;
                    this.app.workspace.trigger("link-hover", this, //not sure
                    link, //targetEl
                    fileMap.result, //linkText
                    (_e = this.app.workspace.getActiveFile()) === null || _e === void 0 ? void 0 : _e.path //source
                    );
                });
                resultEl.empty();
                resultEl.appendChild(link);
            }
        });
    }
    addLexerRules() {
        this.lexer.addRule(/\s+/, function () {
            /* skip whitespace */
        });
        this.lexer.addRule(/[{}]+/, function () {
            /* skip brackets */
        });
        this.lexer.addRule(MATH_REGEX, function (lexeme) {
            return {
                type: "math",
                data: lexeme,
                original: lexeme,
                conditionals: null
            };
        });
        this.lexer.addRule(TABLE_REGEX, function (lexeme) {
            return {
                type: "table",
                data: lexeme,
                original: lexeme,
                conditionals: null
            };
        });
        this.lexer.addRule(SECTION_REGEX, function (lexeme) {
            return {
                type: "section",
                data: lexeme,
                original: lexeme,
                conditionals: null
            };
        });
        this.lexer.addRule(TAG_REGEX, function (lexeme) {
            return {
                type: "tag",
                data: lexeme,
                original: lexeme,
                conditionals: null
            };
        });
        this.lexer.addRule(/(\d+)([Dd]\[?(?:(-?\d+)\s?,)?\s?(-?\d+|%|F)\]?)?/, function (lexeme) {
            let [, dice] = lexeme.match(/(\d+(?:[Dd]?\[?(?:-?\d+\s?,)?\s?(?:-?\d+|%|F)\]?)?)/), conditionals = [];
            if (/(?:(!?=|=!|>=?|<=?)(\d+))+/.test(lexeme)) {
                for (const [, operator, comparer] of lexeme.matchAll(/(?:(!?=|=!|>=?|<=?)(\d+))/g)) {
                    conditionals.push({
                        operator: operator,
                        comparer: Number(comparer)
                    });
                }
            }
            return {
                type: "dice",
                data: dice,
                original: lexeme,
                conditionals: conditionals
            }; // symbols
        });
        this.lexer.addRule(/1[Dd]S/, function (lexeme) {
            var _a;
            const [, dice] = (_a = lexeme.match(/1[Dd]S/)) !== null && _a !== void 0 ? _a : [, "1"];
            return {
                type: "stunt",
                data: dice,
                original: lexeme,
                conditionals: []
            }; // symbols
        });
        this.lexer.addRule(/kh?(?!:l)(\d*)/, function (lexeme) {
            /** keep high */
            return {
                type: "kh",
                data: lexeme.replace(/^\D+/g, ""),
                original: lexeme,
                conditionals: null
            };
        });
        this.lexer.addRule(/dl?(?!:h)\d*/, function (lexeme) {
            /** drop low */
            return {
                type: "dl",
                data: lexeme.replace(/^\D+/g, ""),
                original: lexeme,
                conditionals: null
            };
        });
        this.lexer.addRule(/kl\d*/, function (lexeme) {
            /** keep low */
            return {
                type: "kl",
                data: lexeme.replace(/^\D+/g, ""),
                original: lexeme,
                conditionals: null
            };
        });
        this.lexer.addRule(/dh\d*/, function (lexeme) {
            /** drop high */
            return {
                type: "dh",
                data: lexeme.replace(/^\D+/g, ""),
                original: lexeme,
                conditionals: null
            };
        });
        this.lexer.addRule(/!!(i|\d+)?(?:(!?=|=!|>=?|<=?)(-?\d+))*/, function (lexeme) {
            /** explode and combine */
            let [, data = `1`] = lexeme.match(/!!(i|\d+)?(?:(!?=|=!|>=?|<=?)(-?\d+))*/), conditionals = [];
            if (/(?:(!?=|=!|>=?|<=?)(-?\d+))+/.test(lexeme)) {
                for (const [, operator, comparer] of lexeme.matchAll(/(?:(!?=|=!|>=?|<=?)(-?\d+))/g)) {
                    conditionals.push({
                        operator: operator,
                        comparer: Number(comparer)
                    });
                }
            }
            if (/!!i/.test(lexeme)) {
                data = `100`;
            }
            return {
                type: "!!",
                data: data,
                original: lexeme,
                conditionals: conditionals
            };
        });
        this.lexer.addRule(/!(i|\d+)?(?:(!?=|=!?|>=?|<=?)(-?\d+))*/, function (lexeme) {
            /** explode */
            let [, data = `1`] = lexeme.match(/!(i|\d+)?(?:(!?=|=!?|>=?|<=?)(-?\d+))*/), conditionals = [];
            if (/(?:(!?=|=!|>=?|<=?)(\d+))+/.test(lexeme)) {
                for (const [, operator, comparer] of lexeme.matchAll(/(?:(!?=|=!?|>=?|<=?)(-?\d+))/g)) {
                    conditionals.push({
                        operator: operator,
                        comparer: Number(comparer)
                    });
                }
            }
            if (/!i/.test(lexeme)) {
                data = `100`;
            }
            return {
                type: "!",
                data: data,
                original: lexeme,
                conditionals: conditionals
            };
        });
        this.lexer.addRule(/r(i|\d+)?(?:(!?=|=!|>=?|<=?)(-?\d+))*/, function (lexeme) {
            /** reroll */
            let [, data = `1`] = lexeme.match(/r(i|\d+)?(?:(!?=|=!|>=?|<=?)(-?\d+))*/), conditionals = [];
            if (/(?:(!?={1,2}|>=?|<=?)(-?\d+))+/.test(lexeme)) {
                for (const [, operator, comparer] of lexeme.matchAll(/(?:(!?=|=!|>=?|<=?)(-?\d+))/g)) {
                    conditionals.push({
                        operator: operator,
                        comparer: Number(comparer)
                    });
                }
            }
            if (/ri/.test(lexeme)) {
                data = `100`;
            }
            return {
                type: "r",
                data: data,
                original: lexeme,
                conditionals: conditionals
            };
        });
    }
    onunload() {
        console.log("DiceRoller unloaded");
    }
    parseDice(text) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d, _e;
                let stack = [], diceMap = [], tableMap, renderMap = new Map(), fileMap, type = "dice";
                const parsed = this.parse(text);
                let stunted = "";
                for (const d of parsed) {
                    if (d.type === "table") {
                        type = "table";
                        const [, roll = 1, link, block, header] = d.data.match(TABLE_REGEX), file = yield this.app.metadataCache.getFirstLinkpathDest(link, "");
                        if (!file || !(file instanceof obsidian.TFile))
                            reject("Could not read file cache. Is the link correct?\n\n" +
                                link);
                        const cache = yield this.app.metadataCache.getFileCache(file);
                        if (!cache ||
                            !cache.blocks ||
                            !cache.blocks[block.toLowerCase()])
                            reject("Could not read file cache. Does the block reference exist?\n\n" +
                                `${link} > ${block}`);
                        const data = cache.blocks[block.toLowerCase()];
                        const content = (_a = (yield this.app.vault.read(file))) === null || _a === void 0 ? void 0 : _a.slice(data.position.start.offset, data.position.end.offset);
                        let table = extract(content);
                        let opts;
                        if (header && table.columns[header]) {
                            opts = table.columns[header];
                        }
                        else {
                            if (header)
                                reject(`Header ${header} was not found in table ${link} > ${block}.`);
                            opts = table.rows;
                        }
                        tableMap = new TableRoll(Number(roll !== null && roll !== void 0 ? roll : 1), opts, d.data, link, block);
                        if (parsed.length > 1) {
                            new obsidian.Notice(`Random tables cannot be used with modifiers.`);
                        }
                        break;
                    }
                    else if (d.type === "section") {
                        type = "render";
                        const [, roll = 1, link, filter] = d.data.match(SECTION_REGEX), file = yield this.app.metadataCache.getFirstLinkpathDest(link, "");
                        let types;
                        if (filter && filter.length) {
                            types = filter.split(",");
                        }
                        if (!file || !(file instanceof obsidian.TFile))
                            reject("Could not read file cache. Is the link correct?\n\n" +
                                link);
                        const cache = yield this.app.metadataCache.getFileCache(file);
                        if (!cache || !cache.sections || !cache.sections.length)
                            reject("Could not read file cache.");
                        const content = yield this.app.vault.read(file);
                        const data = cache.sections
                            .filter(({ type }) => types
                            ? types.includes(type)
                            : !["yaml", "thematicBreak"].includes(type))
                            .map((cache) => {
                            return Object.assign(Object.assign({}, cache), { file: file.basename });
                        });
                        const roller = new SectionRoller(Number(roll), data, new Map([[file.basename, content]]), file.basename);
                        renderMap.set(file.basename, [
                            ...((_b = renderMap.get(file.basename)) !== null && _b !== void 0 ? _b : []),
                            roller
                        ]);
                        break;
                    }
                    else if (d.type === "tag") {
                        type = "render";
                        if (!this.app.plugins.plugins.dataview) {
                            new obsidian.Notice("Tags are only supported with the Dataview plugin installed.");
                            return;
                        }
                        const [, roll = 1, tag, collapseTrigger, filter] = d.data.match(TAG_REGEX);
                        const collapse = collapseTrigger === "-"
                            ? true
                            : collapseTrigger === "+"
                                ? false
                                : !this.returnAllTags;
                        let types;
                        if (filter && filter.length) {
                            types = filter.split(",");
                        }
                        const files = this.app.plugins.plugins.dataview.index.tags.invMap.get(tag);
                        if (!files || !files.size) {
                            reject("No files found with that tag. Is the tag correct?\n\n" +
                                tag);
                        }
                        if (filter === "link" ||
                            (this.rollLinksForTags && !(types === null || types === void 0 ? void 0 : types.length))) {
                            fileMap = new FileRoller(1, [...files], this.app.metadataCache);
                            type = "file";
                        }
                        else {
                            for (let link of files) {
                                let file = yield this.app.metadataCache.getFirstLinkpathDest(link, "");
                                const cache = yield this.app.metadataCache.getFileCache(file);
                                if (!cache ||
                                    !cache.sections ||
                                    !cache.sections.length)
                                    ;
                                const content = yield this.app.vault.read(file);
                                const data = cache.sections
                                    .filter(({ type }) => types
                                    ? types.includes(type)
                                    : !["yaml", "thematicBreak"].includes(type))
                                    .map((cache) => {
                                    return Object.assign(Object.assign({}, cache), { file: file.basename });
                                });
                                if (collapse) {
                                    let roller;
                                    const rollers = renderMap.get("all");
                                    if (rollers && rollers.length) {
                                        roller = rollers.shift();
                                        roller.options = [
                                            ...roller.options,
                                            ...data
                                        ];
                                        roller.content.set(file.basename, content);
                                    }
                                    else {
                                        roller = new SectionRoller(Number(roll), data, new Map([[file.basename, content]]), "all");
                                    }
                                    renderMap.set("all", [
                                        ...((_c = renderMap.get("all")) !== null && _c !== void 0 ? _c : []),
                                        roller
                                    ]);
                                }
                                else {
                                    const roller = new SectionRoller(Number(roll), data, new Map([[file.basename, content]]), file.basename);
                                    renderMap.set(file.basename, [
                                        ...((_d = renderMap.get(file.basename)) !== null && _d !== void 0 ? _d : []),
                                        roller
                                    ]);
                                }
                            }
                        }
                        break;
                    }
                    else {
                        switch (d.type) {
                            case "+":
                            case "-":
                            case "*":
                            case "/":
                            case "^":
                            case "math":
                                const b = stack.pop(), a = stack.pop(), result = this.operators[d.data](a.result, b.result);
                                stack.push(new DiceRoll(`${result}`));
                                break;
                            case "kh": {
                                let diceInstance = diceMap[diceMap.length - 1];
                                let data = d.data ? Number(d.data) : 1;
                                diceInstance.keepHigh(data);
                                diceInstance.modifiers.push(d.original);
                                break;
                            }
                            case "dl": {
                                let diceInstance = diceMap[diceMap.length - 1];
                                let data = d.data ? Number(d.data) : 1;
                                data = diceInstance.results.size - data;
                                diceInstance.keepHigh(data);
                                diceInstance.modifiers.push(d.original);
                                break;
                            }
                            case "kl": {
                                let diceInstance = diceMap[diceMap.length - 1];
                                let data = d.data ? Number(d.data) : 1;
                                diceInstance.keepLow(data);
                                diceInstance.modifiers.push(d.original);
                                break;
                            }
                            case "dh": {
                                let diceInstance = diceMap[diceMap.length - 1];
                                let data = d.data ? Number(d.data) : 1;
                                data = diceInstance.results.size - data;
                                diceInstance.keepLow(data);
                                diceInstance.modifiers.push(d.original);
                                break;
                            }
                            case "!": {
                                let diceInstance = diceMap[diceMap.length - 1];
                                let data = Number(d.data) || 1;
                                diceInstance.explode(data, d.conditionals);
                                diceInstance.modifiers.push(d.original);
                                break;
                            }
                            case "!!": {
                                let diceInstance = diceMap[diceMap.length - 1];
                                let data = Number(d.data) || 1;
                                diceInstance.explodeAndCombine(data, d.conditionals);
                                diceInstance.modifiers.push(d.original);
                                break;
                            }
                            case "r": {
                                let diceInstance = diceMap[diceMap.length - 1];
                                let data = Number(d.data) || 1;
                                diceInstance.reroll(data, d.conditionals);
                                diceInstance.modifiers.push(d.original);
                                break;
                            }
                            case "dice":
                                ///const res = this.roll(d.data);
                                diceMap.push(new DiceRoll(d.data));
                                stack.push(diceMap[diceMap.length - 1]);
                                break;
                            case "stunt":
                                let stunt = new StuntRoll(d.original);
                                diceMap.push(stunt);
                                if (stunt.doubles) {
                                    stunted = ` - ${stunt.results.get(0).value} Stunt Points`;
                                }
                                stack.push(diceMap[diceMap.length - 1]);
                        }
                    }
                }
                diceMap.forEach((diceInstance) => {
                    text = text.replace(`${diceInstance.dice}${diceInstance.modifiers.join("")}`, diceInstance.display);
                });
                if (tableMap) {
                    text = text.replace(tableMap.text, `${tableMap.link} > ${tableMap.block}`);
                }
                if (renderMap && renderMap.size) {
                    text = `Results from ${renderMap.size} file${renderMap.size != 1 ? "s" : ""}`;
                }
                if (fileMap) {
                    text = fileMap.result;
                }
                resolve({
                    result: stack.length ? `${stack[0].text}${stunted}` : null,
                    text: text,
                    link: (_e = `${tableMap === null || tableMap === void 0 ? void 0 : tableMap.link}#^${tableMap === null || tableMap === void 0 ? void 0 : tableMap.block}`) !== null && _e !== void 0 ? _e : null,
                    type,
                    tableMap,
                    renderMap,
                    fileMap
                });
            }));
        });
    }
    parse(input) {
        this.lexer.setInput(input);
        var tokens = [], token;
        while ((token = this.lexer.lex()))
            tokens.push(token);
        return this.parser.parse(tokens);
    }
}

module.exports = DiceRoller;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vRG9jdW1lbnRzL0dpdEh1Yi9QZXJzb25hbC9vYnNpZGlhbi1kaWNlLXJvbGxlci9ub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2LmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vRG9jdW1lbnRzL0dpdEh1Yi9QZXJzb25hbC9vYnNpZGlhbi1kaWNlLXJvbGxlci9ub2RlX21vZHVsZXMvbGV4L2xleGVyLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vRG9jdW1lbnRzL0dpdEh1Yi9QZXJzb25hbC9vYnNpZGlhbi1kaWNlLXJvbGxlci9ub2RlX21vZHVsZXMvQGZvcnRhd2Vzb21lL2ZyZWUtc29saWQtc3ZnLWljb25zL2luZGV4LmVzLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vRG9jdW1lbnRzL0dpdEh1Yi9QZXJzb25hbC9vYnNpZGlhbi1kaWNlLXJvbGxlci9ub2RlX21vZHVsZXMvQGZvcnRhd2Vzb21lL2ZvbnRhd2Vzb21lLXN2Zy1jb3JlL2luZGV4LmVzLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vRG9jdW1lbnRzL0dpdEh1Yi9QZXJzb25hbC9vYnNpZGlhbi1kaWNlLXJvbGxlci9zcmMvdXRpbC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL0RvY3VtZW50cy9HaXRIdWIvUGVyc29uYWwvb2JzaWRpYW4tZGljZS1yb2xsZXIvc3JjL3JvbGxlci50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL0RvY3VtZW50cy9HaXRIdWIvUGVyc29uYWwvb2JzaWRpYW4tZGljZS1yb2xsZXIvc3JjL3BhcnNlci50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL0RvY3VtZW50cy9HaXRIdWIvUGVyc29uYWwvb2JzaWRpYW4tZGljZS1yb2xsZXIvc3JjL2NvbnN0YW50cy50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL0RvY3VtZW50cy9HaXRIdWIvUGVyc29uYWwvb2JzaWRpYW4tZGljZS1yb2xsZXIvc3JjL3NldHRpbmdzLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vRG9jdW1lbnRzL0dpdEh1Yi9QZXJzb25hbC9vYnNpZGlhbi1kaWNlLXJvbGxlci9zcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6bnVsbCwibmFtZXMiOlsiTm90aWNlIiwiRXZlbnRzIiwiTWFya2Rvd25SZW5kZXJlciIsIlBsdWdpblNldHRpbmdUYWIiLCJTZXR0aW5nIiwiUGx1Z2luIiwiYWRkSWNvbiIsInNldEljb24iLCJURmlsZSJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF1REE7QUFDTyxTQUFTLFNBQVMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUU7QUFDN0QsSUFBSSxTQUFTLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEtBQUssWUFBWSxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLFVBQVUsT0FBTyxFQUFFLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7QUFDaEgsSUFBSSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDL0QsUUFBUSxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ25HLFFBQVEsU0FBUyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxN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
