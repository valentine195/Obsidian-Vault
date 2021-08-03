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

class BaseRoller {
    _getRandomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

class DiceRoller extends BaseRoller {
    constructor(dice) {
        super();
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
                roll.value = this._getRandomBetween(this.faces.min, this.faces.max);
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
            let newRoll = this._getRandomBetween(this.faces.min, this.faces.max);
            i++;
            value.modifiers.add("!");
            value.value += newRoll;
            this.results.set(index, value);
            while (i < times && _checkCondition(newRoll, conditionals)) {
                i++;
                newRoll = this._getRandomBetween(this.faces.min, this.faces.max);
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
                newRoll = this._getRandomBetween(this.faces.min, this.faces.max);
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
        return [...Array(this.rolls)].map(() => this._getRandomBetween(this.faces.min, this.faces.max));
    }
    element() {
        return createDiv();
    }
}
class StuntRoller extends DiceRoller {
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

class FileRoller extends BaseRoller {
    constructor(rolls = 1, options, cache) {
        super();
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
    element() {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield this.cache.getFirstLinkpathDest(this.display, this.source);
            return createEl("a", {
                cls: "internal-link",
                text: file.basename
            });
        });
    }
    roll() {
        return (this.resultArray = [...Array(this.rolls)].map(() => this.options[this._getRandomBetween(0, this.options.length - 1)]));
    }
}

class SectionRoller extends BaseRoller {
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
                    /*                     this.trigger("open-link", result.file); */
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
            const choice = this.remaining[this._getRandomBetween(0, this.remaining.length - 1)];
            this.selected.add(choice);
            return choice;
        });
        return this.resultArray;
    }
}

class TableRoller extends BaseRoller {
    constructor(rolls, options, text, link, block) {
        super();
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
        return (this.resultArray = [...Array(this.rolls)].map(() => this.options[this._getRandomBetween(0, this.options.length - 1)]));
    }
    element() {
        return createDiv();
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
class DiceRollerPlugin extends obsidian.Plugin {
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
                        let { text, link, renderMap, tableMap, type, fileMap } = yield this.parseDice(content, ctx.sourcePath);
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
                        this.reroll(null, container, resultEl, content, link, renderMap, tableMap, fileMap, type);
                        const icon = container.createDiv({
                            cls: "dice-roller-button"
                        });
                        obsidian.setIcon(icon, ICON_DEFINITION);
                        node.replaceWith(container);
                        container.onclick = (evt) => this.reroll(evt, container, resultEl, content, link, renderMap, tableMap, fileMap, type);
                        icon.onclick = (evt) => this.reroll(evt, container, resultEl, content, link, renderMap, tableMap, fileMap, type);
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
    reroll(evt, container, resultEl, content, link, renderMap, tableMap, fileMap, type) {
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
                        /* el.on("open-link", async (link) => {
                            if (link) {
                                await this.app.workspace.openLinkText(
                                    link.replace("^", "#^").split(/\|/).shift(),
                                    this.app.workspace.getActiveFile()?.path,
                                    true
                                );
                            }
                        }); */
                    }
                }
            }
            else if (type === "file") {
                fileMap.roll();
                container.setAttrs({
                    "aria-label": `${content}\n${fileMap.display}`
                });
                const link = yield fileMap.element();
                link.onclick = (evt) => __awaiter(this, void 0, void 0, function* () {
                    var _c;
                    evt.stopPropagation();
                    this.app.workspace.openLinkText(fileMap.result.replace("^", "#^").split(/\|/).shift(), (_c = this.app.workspace.getActiveFile()) === null || _c === void 0 ? void 0 : _c.path, true);
                });
                link.onmouseenter = (evt) => __awaiter(this, void 0, void 0, function* () {
                    var _d;
                    this.app.workspace.trigger("link-hover", this, //not sure
                    link, //targetEl
                    fileMap.result, //linkText
                    (_d = this.app.workspace.getActiveFile()) === null || _d === void 0 ? void 0 : _d.path //source
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
    parseDice(text, source) {
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
                        tableMap = new TableRoller(Number(roll !== null && roll !== void 0 ? roll : 1), opts, d.data, link, block);
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
                            fileMap.source = source;
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
                                stack.push(new DiceRoller(`${result}`));
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
                                diceMap.push(new DiceRoller(d.data));
                                stack.push(diceMap[diceMap.length - 1]);
                                break;
                            case "stunt":
                                let stunt = new StuntRoller(d.original);
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

module.exports = DiceRollerPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vRG9jdW1lbnRzL0dpdEh1Yi9QZXJzb25hbC9vYnNpZGlhbi1kaWNlLXJvbGxlci9ub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2LmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vRG9jdW1lbnRzL0dpdEh1Yi9QZXJzb25hbC9vYnNpZGlhbi1kaWNlLXJvbGxlci9ub2RlX21vZHVsZXMvbGV4L2xleGVyLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vRG9jdW1lbnRzL0dpdEh1Yi9QZXJzb25hbC9vYnNpZGlhbi1kaWNlLXJvbGxlci9ub2RlX21vZHVsZXMvQGZvcnRhd2Vzb21lL2ZyZWUtc29saWQtc3ZnLWljb25zL2luZGV4LmVzLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vRG9jdW1lbnRzL0dpdEh1Yi9QZXJzb25hbC9vYnNpZGlhbi1kaWNlLXJvbGxlci9ub2RlX21vZHVsZXMvQGZvcnRhd2Vzb21lL2ZvbnRhd2Vzb21lLXN2Zy1jb3JlL2luZGV4LmVzLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vRG9jdW1lbnRzL0dpdEh1Yi9QZXJzb25hbC9vYnNpZGlhbi1kaWNlLXJvbGxlci9zcmMvdXRpbHMvdXRpbC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL0RvY3VtZW50cy9HaXRIdWIvUGVyc29uYWwvb2JzaWRpYW4tZGljZS1yb2xsZXIvc3JjL3JvbGxlci9yb2xsZXIudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9Eb2N1bWVudHMvR2l0SHViL1BlcnNvbmFsL29ic2lkaWFuLWRpY2Utcm9sbGVyL3NyYy9yb2xsZXIvZGljZS50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL0RvY3VtZW50cy9HaXRIdWIvUGVyc29uYWwvb2JzaWRpYW4tZGljZS1yb2xsZXIvc3JjL3JvbGxlci9maWxlLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vRG9jdW1lbnRzL0dpdEh1Yi9QZXJzb25hbC9vYnNpZGlhbi1kaWNlLXJvbGxlci9zcmMvcm9sbGVyL3NlY3Rpb24udHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9Eb2N1bWVudHMvR2l0SHViL1BlcnNvbmFsL29ic2lkaWFuLWRpY2Utcm9sbGVyL3NyYy9yb2xsZXIvdGFibGUudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9Eb2N1bWVudHMvR2l0SHViL1BlcnNvbmFsL29ic2lkaWFuLWRpY2Utcm9sbGVyL3NyYy9wYXJzZXIvcGFyc2VyLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vRG9jdW1lbnRzL0dpdEh1Yi9QZXJzb25hbC9vYnNpZGlhbi1kaWNlLXJvbGxlci9zcmMvdXRpbHMvY29uc3RhbnRzLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vRG9jdW1lbnRzL0dpdEh1Yi9QZXJzb25hbC9vYnNpZGlhbi1kaWNlLXJvbGxlci9zcmMvc2V0dGluZ3Mvc2V0dGluZ3MudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9Eb2N1bWVudHMvR2l0SHViL1BlcnNvbmFsL29ic2lkaWFuLWRpY2Utcm9sbGVyL3NyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpudWxsLCJuYW1lcyI6WyJOb3RpY2UiLCJNYXJrZG93blJlbmRlcmVyIiwiUGx1Z2luU2V0dGluZ1RhYiIsIlNldHRpbmciLCJQbHVnaW4iLCJhZGRJY29uIiwic2V0SWNvbiIsIlRGaWxlIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXVEQTtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJ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
