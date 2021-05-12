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
        if (!/(-?\d+)[dD]?(\d+|%|\[\d+,\s?\d+\])?/.test(dice)) {
            throw new Error("Non parseable dice string passed to DiceRoll.");
        }
        this.dice = dice.split(" ").join("");
        if (/^-?\d+$/.test(this.dice)) {
            this.static = true;
            this.modifiersAllowed = false;
        }
        let [, rolls, min = null, max = 1] = this.dice.match(/(\d+)[dD]\[?(?:(-?\d+)\s?,)?\s?(-?\d+|%|F)\]?/) || [, 1, null, 1];
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
    toString() {
        return this.display;
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
class LinkRoll {
    constructor(rolls, options) {
        this.rolls = rolls;
        this.options = options;
        this.resultArray = this.roll();
    }
    get result() {
        return this.resultArray.join("|");
    }
    get display() {
        return `${this.result}`;
    }
    roll() {
        return [...Array(this.rolls)].map(() => this.options[_getRandomBetween(0, this.options.length)]);
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
        this.tooltip = null;
        this.tooltipTimeout = null;
        this.tooltipTarget = null;
    }
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("DiceRoller plugin loaded");
            console.log(createEl, createDiv().setText, createDiv().detach);
            this.registerMarkdownPostProcessor((el, ctx) => __awaiter(this, void 0, void 0, function* () {
                let nodeList = el.querySelectorAll("code");
                if (!nodeList.length)
                    return;
                for (const node of Array.from(nodeList)) {
                    if (!/^dice:\s*([\s\S]+)\s*?/.test(node.innerText))
                        return;
                    let parent = node.parentElement;
                    try {
                        let [, content] = node.innerText.match(/^dice:\s*([\s\S]+)\s*?/);
                        /* dice = dice.split(" ").join("").trim(); */
                        let { result, text } = yield this.parseDice(content);
                        let container = createDiv().createDiv({
                            cls: "dice-roller"
                        });
                        container.setAttr("data-dice", content);
                        let diceSpan = container.createSpan();
                        diceSpan.innerText = `${result.toLocaleString(navigator.language, { maximumFractionDigits: 2 })}`;
                        container
                            .createDiv({ cls: "dice-roller-button" })
                            .appendChild(icon(faDice).node[0]);
                        parent.replaceChild(container, node);
                        container.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                            ({ result, text } = yield this.parseDice(content));
                            diceSpan.innerText = `${result.toLocaleString(navigator.language, { maximumFractionDigits: 2 })}`;
                            this.buildTooltip(container, `${content}\n${text}`, {
                                delay: 0,
                                gap: 2,
                                placement: "top"
                            });
                        }));
                        container.addEventListener("mouseenter", (evt) => {
                            this.buildTooltip(container, `${content}\n${text}`, {
                                delay: 0,
                                gap: 2,
                                placement: "top"
                            });
                        });
                    }
                    catch (e) {
                        console.error(e);
                        new obsidian.Notice(`There was an error parsing the dice string: ${node.innerText}`);
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
    addLexerRules() {
        this.lexer.addRule(/\s+/, function () {
            /* skip whitespace */
        });
        this.lexer.addRule(/[{}]+/, function () {
            /* skip brackets */
        });
        this.lexer.addRule(/[\(\^\+\-\*\/\)]/, function (lexeme) {
            return {
                type: "math",
                data: lexeme,
                original: lexeme,
                conditionals: null
            }; // punctuation ("^", "(", "+", "-", "*", "/", ")")
        });
        this.lexer.addRule(/\d+[Dd]\[\[[\s\S]+?\]\]/, function (lexeme) {
            /* let [, link] = lexeme.match(/\d+[Dd]\[\[([\s\S]+?)\]\]/); */
            return {
                type: "link",
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
        this.clearTooltip();
        console.log("DiceRoller unloaded");
    }
    parseDice(text) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                let stack = [], diceMap = [], linkMap = [];
                for (const d of this.parse(text)) {
                    switch (d.type) {
                        case "+":
                        case "-":
                        case "*":
                        case "/":
                        case "^":
                        case "math":
                            const b = stack.pop(), a = stack.pop(), result = this.operators[d.data](a, b);
                            stack.push(new DiceRoll(`${result}`).result);
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
                            stack.push(diceMap[diceMap.length - 1].result);
                            break;
                        case "link":
                            const [, roll, link, block] = d.data.match(/(\d+)[Dd]\[\[([\s\S]+?)#\^([\s\S]+?)\]\]/), file = yield this.app.metadataCache.getFirstLinkpathDest(link, "");
                            if (!file || !(file instanceof obsidian.TFile))
                                throw new Error("Could not read file. Is the link correct?");
                            const cache = yield this.app.metadataCache.getFileCache(file);
                            if (!cache)
                                throw new Error("Could not read file cache. Is the link correct?");
                            const data = cache.blocks[block];
                            const content = (_a = (yield this.app.vault.read(file))) === null || _a === void 0 ? void 0 : _a.slice(data.position.start.offset, data.position.end.offset);
                            const options = content
                                .replace(/(^\s*\|\s*|\s*\|\s*$)/gm, "")
                                .split("\n")
                                .slice(2);
                            linkMap.push(new LinkRoll(Number(roll), options));
                            stack.push(linkMap[linkMap.length - 1].result);
                            break;
                    }
                }
                diceMap.forEach((diceInstance) => {
                    text = text.replace(`${diceInstance.dice}${diceInstance.modifiers.join("")}`, diceInstance.display);
                });
                /* linkMap.forEach((linkInstance) => {
                text = text.replace(`${linkInstance.rolls}d`, linkInstance.display);
            }); */
                resolve({
                    result: stack[0],
                    text: text
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
    buildTooltip(element, text, params) {
        let { placement = "top", classes = [], gap = 4, delay = 0 } = params;
        if (delay > 0) {
            setTimeout(() => {
                this.buildTooltip(element, text, {
                    placement: placement,
                    classes: classes,
                    gap: gap,
                    delay: 0
                });
            }, delay);
            return;
        }
        const { top, left, width, height } = element.getBoundingClientRect();
        if (this.tooltip && this.tooltipTarget === element) {
            this.tooltip.setText(text);
        }
        else {
            this.clearTooltip();
            this.tooltip = createDiv({
                cls: "tooltip",
                text: text
            });
            (this.tooltip.parentNode || document.body).appendChild(this.tooltip);
        }
        let arrow = this.tooltip.getElementsByClassName("tooltip-arrow")[0] || this.tooltip.createDiv("tooltip-arrow");
        let bottom = 0;
        let middle = 0;
        if (top - this.tooltip.getBoundingClientRect().height < 0) {
            placement = "bottom";
        }
        switch (placement) {
            case "bottom": {
                bottom = top + height + gap;
                middle = left + width / 2;
                break;
            }
            case "right": {
                bottom = top + height / 2;
                middle = left + width + gap;
                classes.push("mod-right");
                break;
            }
            case "left": {
                bottom = top + height / 2;
                middle = left - gap;
                classes.push("mod-left");
                break;
            }
            case "top": {
                bottom = top - gap - 5;
                middle = left + width / 2;
                classes.push("mod-top");
                break;
            }
        }
        this.tooltip.addClasses(classes);
        this.tooltip.style.top = "0px";
        this.tooltip.style.left = "0px";
        this.tooltip.style.width = "";
        this.tooltip.style.height = "";
        const { width: ttWidth, height: ttHeight } = this.tooltip.getBoundingClientRect();
        const actualWidth = ["bottom", "top"].contains(placement)
            ? ttWidth / 2
            : ttWidth;
        const actualHeight = ["left", "right"].contains(placement)
            ? ttHeight / 2
            : ttHeight;
        if (("left" === placement
            ? (middle -= actualWidth)
            : "top" === placement && (bottom -= actualHeight),
            bottom + actualHeight > window.innerHeight &&
                (bottom = window.innerHeight - actualHeight - gap),
            (bottom = Math.max(bottom, gap)),
            "top" === placement || "bottom" === placement)) {
            if (middle + actualWidth > window.innerWidth) {
                const E = middle + actualWidth + gap - window.innerWidth;
                middle -= E;
                arrow.style.left = "initial";
                arrow.style.right = actualWidth - E - gap / 2 + "px";
            }
            else if (middle - gap - actualWidth < 0) {
                const E = -(middle - gap - actualWidth);
                middle += E;
                arrow.style.right = "initial";
                arrow.style.left = actualWidth - E - gap / 2 + "px";
            }
            middle = Math.max(middle, gap);
        }
        this.tooltip.style.top = bottom + "px";
        this.tooltip.style.left = middle + "px";
        this.tooltip.style.width = ttWidth + "px";
        this.tooltip.style.height = ttHeight + "px";
        this.tooltipTarget = element;
        this.tooltipTarget.addEventListener("mouseleave", () => {
            this.clearTooltip();
        });
    }
    clearTooltipTimeout() {
        if (this.tooltipTimeout) {
            clearTimeout(this.tooltipTimeout);
            this.tooltipTimeout = null;
        }
    }
    clearTooltip() {
        this.clearTooltipTimeout();
        if (this.tooltip) {
            this.tooltip.detach();
            this.tooltip = null;
            this.tooltipTarget = null;
        }
    }
}

module.exports = DiceRoller;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tZGljZS1yb2xsZXIvbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLWRpY2Utcm9sbGVyL25vZGVfbW9kdWxlcy9sZXgvbGV4ZXIuanMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1kaWNlLXJvbGxlci9ub2RlX21vZHVsZXMvQGZvcnRhd2Vzb21lL2ZyZWUtc29saWQtc3ZnLWljb25zL2luZGV4LmVzLmpzIiwiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tZGljZS1yb2xsZXIvbm9kZV9tb2R1bGVzL0Bmb3J0YXdlc29tZS9mb250YXdlc29tZS1zdmctY29yZS9pbmRleC5lcy5qcyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLWRpY2Utcm9sbGVyL3NyYy91dGlsLnRzIiwiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tZGljZS1yb2xsZXIvc3JjL3JvbGxlci50cyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLWRpY2Utcm9sbGVyL3NyYy9wYXJzZXIudHMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1kaWNlLXJvbGxlci9zcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6bnVsbCwibmFtZXMiOlsiTm90aWNlIiwiUGx1Z2luIiwiVEZpbGUiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBdURBO0FBQ08sU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQzdELElBQUksU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxLQUFLLFlBQVksQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxVQUFVLE9BQU8sRUFBRSxFQUFFLE9BQU8s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
