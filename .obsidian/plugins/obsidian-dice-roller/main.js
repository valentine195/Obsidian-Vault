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
 * Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 */
var faDice = {
  prefix: 'fas',
  iconName: 'dice',
  icon: [640, 512, [], "f522", "M592 192H473.26c12.69 29.59 7.12 65.2-17 89.32L320 417.58V464c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48V240c0-26.51-21.49-48-48-48zM480 376c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm-46.37-186.7L258.7 14.37c-19.16-19.16-50.23-19.16-69.39 0L14.37 189.3c-19.16 19.16-19.16 50.23 0 69.39L189.3 433.63c19.16 19.16 50.23 19.16 69.39 0L433.63 258.7c19.16-19.17 19.16-50.24 0-69.4zM96 248c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm128 128c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm0-128c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm0-128c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm128 128c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24z"]
};

/*!
 * Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 */
var faCopy = {
  prefix: 'far',
  iconName: 'copy',
  icon: [448, 512, [], "f0c5", "M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z"]
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

function around(obj, factories) {
    const removers = Object.keys(factories).map(key => around1(obj, key, factories[key]));
    return removers.length === 1 ? removers[0] : function () { removers.forEach(r => r()); };
}
function around1(obj, method, createWrapper) {
    const original = obj[method], hadOwn = obj.hasOwnProperty(method);
    let current = createWrapper(original);
    // Let our wrapper inherit static props from the wrapping method,
    // and the wrapping method, props from the original method
    if (original)
        Object.setPrototypeOf(current, original);
    Object.setPrototypeOf(wrapper, current);
    obj[method] = wrapper;
    // Return a callback to allow safe removal
    return remove;
    function wrapper(...args) {
        // If we have been deactivated and are no longer wrapped, remove ourselves
        if (current === original && obj[method] === wrapper)
            remove();
        return current.apply(this, args);
    }
    function remove() {
        // If no other patches, just do a direct removal
        if (obj[method] === wrapper) {
            if (hadOwn)
                obj[method] = original;
            else
                delete obj[method];
        }
        if (current === original)
            return;
        // Else pass future calls through, and remove wrapper from the prototype chain
        current = original;
        Object.setPrototypeOf(wrapper, original || Function);
    }
}

const TAG_REGEX = /(?:(?<roll>\d+)[Dd])?#(?<tag>[\p{Letter}\p{Emoji_Presentation}\w/-]+)(?:\|(?<collapse>[\+-]))?(?:\|(?<types>[^\+-]+))?/u;
const TABLE_REGEX = /(?:(?<roll>\d+)[Dd])?\[\[(?<link>[\s\S]+?)#?\^(?<block>[\s\S]+?)\]\]\|?(?<header>[\s\S]+)?/;
const SECTION_REGEX = /(?:(?<roll>\d+)[Dd])?\[\[(?<link>[\s\S]+)\]\]\|?(?<types>[\s\S]+)?/;
const MATH_REGEX = /[\(\^\+\-\*\/\)]/;
const DICE_REGEX = /(?<dice>(?<roll>\d+)(?:[Dd]?\[?(?:-?\d+\s?,)?\s?(?:-?\d+|%|F)\]?)?)(?<conditional>(?:(?:=|=!|<|>|<=|>=|=<|=>|\-=|=\-)\d+)*)?/;
const OMITTED_REGEX = /(?<roll>\d+)?[Dd](?<faces>\[?(?:-?\d+\s?,)?\s?(?:-?\d+|%|F)\]?)?(?<conditional>(?:(?:=|=!|<|>|<=|>=|=<|=>|\-=|=\-)\d+)*)?/;
const CONDITIONAL_REGEX = /(?:(?<operator>=|=!|<|>|<=|>=|=<|=>|\-=|=\-)(?<comparer>\d+))/g;
const ICON_DEFINITION = "dice-roller-icon";
const COPY_DEFINITION = "dice-roller-copy";

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

class BasicRoller extends obsidian.Events {
    constructor(plugin, original, lexemes) {
        super();
        this.plugin = plugin;
        this.original = original;
        this.lexemes = lexemes;
        this.containerEl = createDiv({
            cls: "dice-roller",
            attr: {
                "aria-label-position": "top",
                "data-dice": this.original
            }
        });
        this.resultEl = this.containerEl.createDiv("dice-roller-result");
        const icon = this.containerEl.createDiv({
            cls: "dice-roller-button"
        });
        obsidian.setIcon(icon, ICON_DEFINITION);
        this.containerEl.onclick = this.onClick.bind(this);
        icon.onclick = this.onClick.bind(this);
    }
    setTooltip() {
        if (this.plugin.data.displayResultsInline)
            return;
        this.containerEl.setAttrs({
            "aria-label": this.tooltip
        });
    }
    getRandomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    render() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setTooltip();
            yield this.build();
        });
    }
    onClick(evt) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            evt.stopPropagation();
            evt.stopImmediatePropagation();
            if ((_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.isCollapsed) {
                yield this.roll();
            }
        });
    }
}
class GenericRoller extends BasicRoller {
}
class GenericFileRoller extends GenericRoller {
    constructor(plugin, original, lexeme, source) {
        super(plugin, original, [lexeme]);
        this.plugin = plugin;
        this.original = original;
        this.lexeme = lexeme;
        this.source = source;
        this.getPath();
        this.getFile();
    }
    getFile() {
        return __awaiter(this, void 0, void 0, function* () {
            this.file = this.plugin.app.metadataCache.getFirstLinkpathDest(this.path, this.source);
            if (!this.file || !(this.file instanceof obsidian.TFile))
                throw new Error("Could not load file.");
            yield this.load();
            this.registerFileWatcher();
        });
    }
    registerFileWatcher() {
        this.plugin.registerEvent(this.plugin.app.vault.on("modify", (file) => __awaiter(this, void 0, void 0, function* () {
            if (file !== this.file)
                return;
            yield this.getOptions();
        })));
    }
}

class DiceRoller {
    constructor(dice, lexeme) {
        var _a;
        this.lexeme = lexeme;
        this.modifiers = new Map();
        this.modifiersAllowed = true;
        this.static = false;
        this.conditions = [];
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
        this.conditions = (_a = this.lexeme.conditionals) !== null && _a !== void 0 ? _a : [];
        this.results = new Map([...this.roll()].map((n, i) => {
            return [
                i,
                {
                    usable: true,
                    value: n,
                    display: `${n}`,
                    modifiers: new Set()
                }
            ];
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
            .map(([, { modifiers, display }]) => `${display}${[...modifiers].join("")}`)
            .join(", ")}]`;
    }
    keepLow(drop = 1) {
        if (!this.modifiersAllowed) {
            new obsidian.Notice("Modifiers are only allowed on dice rolls.");
            return;
        }
        /* if (this.conditions?.length) {
            new Notice("Modifiers are not permitted on conditioned dice.");
            return;
        } */
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
        /* if (this.conditions?.length) {
            new Notice("Modifiers are not permitted on conditioned dice.");
            return;
        } */
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
        /* if (this.conditions?.length) {
            new Notice("Modifiers are not permitted on conditioned dice.");
            return;
        } */
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
        let i = 0, toReroll = [...this.results].filter(([, { value }]) => this.checkCondition(value, conditionals));
        while (i < times &&
            toReroll.filter(([, { value }]) => this.checkCondition(value, conditionals)).length > 0) {
            i++;
            toReroll.map(([, roll]) => {
                roll.modifiers.add("r");
                roll.value = this.getRandomBetween(this.faces.min, this.faces.max);
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
        /* if (this.conditions?.length) {
            new Notice("Modifiers are not permitted on conditioned dice.");
            return;
        } */
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
        let i = 0, toExplode = [...this.results].filter(([, { value }]) => this.checkCondition(value, conditionals));
        toExplode.forEach(([index, value]) => {
            let newRoll = this.getRandomBetween(this.faces.min, this.faces.max);
            i++;
            value.modifiers.add("!");
            value.value += newRoll;
            value.display = `${value.value}`;
            this.results.set(index, value);
            while (i < times && this.checkCondition(newRoll, conditionals)) {
                i++;
                newRoll = this.getRandomBetween(this.faces.min, this.faces.max);
                value.value += newRoll;
                value.display = `${value.value}`;
                this.results.set(index, value);
            }
        });
    }
    explode(times, conditionals) {
        if (!this.modifiersAllowed) {
            new obsidian.Notice("Modifiers are only allowed on dice rolls.");
            return;
        }
        /* if (this.conditions?.length) {
            new Notice("Modifiers are not permitted on conditioned dice.");
            return;
        } */
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
        let toExplode = [...this.results].filter(([, { value }]) => this.checkCondition(value, conditionals));
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
            while (i < times && this.checkCondition(newRoll, conditionals)) {
                let previous = this.results.get(key + inserted + i);
                previous.modifiers.add("!");
                newRoll = this.getRandomBetween(this.faces.min, this.faces.max);
                /** Insert the new roll into the results map */
                _insertIntoMap(this.results, key + inserted + i + 1, {
                    usable: true,
                    value: newRoll,
                    display: `${newRoll}`,
                    modifiers: new Set()
                });
                i++;
            }
            /** Update how many have been inserted. */
            inserted += i;
        });
    }
    _roll() {
        if (this.static) {
            return [Number(this.dice)];
        }
        return [...Array(this.rolls)].map(() => this.getRandomBetween(this.faces.min, this.faces.max));
    }
    roll() {
        var _a;
        const roll = this._roll();
        this.results = new Map([...roll].map((n, i) => {
            return [
                i,
                {
                    usable: true,
                    value: n,
                    display: `${n}`,
                    modifiers: new Set()
                }
            ];
        }));
        for (let [type, modifier] of this.modifiers) {
            this.applyModifier(type, modifier);
        }
        if ((_a = this.conditions) === null || _a === void 0 ? void 0 : _a.length)
            this.applyConditions();
        return roll;
    }
    applyConditions() {
        for (let [index, result] of this.results) {
            const negate = this.conditions.find(({ operator }) => operator === "-=" || operator === "=-");
            if (negate) {
                if (result.value === negate.comparer) {
                    result.value = -1;
                    result.modifiers.add("-");
                    continue;
                }
            }
            const check = this.checkCondition(result.value, this.conditions);
            if (!check) {
                result.usable = false;
            }
            else {
                result.modifiers.add("*");
                result.value = 1;
            }
        }
    }
    applyModifier(type, modifier) {
        switch (type) {
            case "kh": {
                this.keepHigh(modifier.data);
                break;
            }
            case "kl": {
                this.keepLow(modifier.data);
                break;
            }
            case "!": {
                this.explode(modifier.data, modifier.conditionals);
                break;
            }
            case "!!": {
                this.explodeAndCombine(modifier.data, modifier.conditionals);
                break;
            }
            case "r": {
                this.reroll(modifier.data, modifier.conditionals);
                break;
            }
        }
    }
    checkCondition(value, conditions) {
        if (!conditions || !conditions.length)
            return value;
        return conditions.some(({ operator, comparer }) => {
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
    getRandomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
class StuntRoller extends DiceRoller {
    constructor(dice, lexeme) {
        super(`3d6`, lexeme);
        this.lexeme = lexeme;
        this.dice = dice;
    }
    get doubles() {
        return (new Set([...this.results].map(([, { usable, value }]) => usable ? value : 0)).size < 3);
    }
    get result() {
        if (this.static) {
            return Number(this.dice);
        }
        const results = [...this.results].map(([, { usable, value }]) => usable ? value : 0);
        return results.reduce((a, b) => a + b, 0);
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
class StackRoller extends GenericRoller {
    constructor(plugin, original, lexemes) {
        super(plugin, original, lexemes);
        this.plugin = plugin;
        this.original = original;
        this.lexemes = lexemes;
        this.stunted = "";
        this.operators = {
            "+": (a, b) => a + b,
            "-": (a, b) => a - b,
            "*": (a, b) => a * b,
            "/": (a, b) => a / b,
            "^": (a, b) => {
                return Math.pow(a, b);
            }
        };
        this.stack = [];
        this.dice = [];
    }
    get tooltip() {
        if (this._tooltip)
            return this._tooltip;
        let text = this.original;
        this.dice.forEach((dice) => {
            text = text.replace(dice.lexeme.original, dice.display);
        });
        return `${this.original}\n${text}`;
    }
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = [
                this.result.toLocaleString(navigator.language, {
                    maximumFractionDigits: 2
                })
            ];
            if (this.plugin.data.displayResultsInline) {
                result.unshift(this.tooltip.split("\n").join(" -> "), " -> ");
            }
            this.resultEl.setText(result.join("") + this.stunted);
        });
    }
    roll() {
        return __awaiter(this, void 0, void 0, function* () {
            let index = 0;
            this.stunted = "";
            for (const dice of this.lexemes) {
                switch (dice.type) {
                    case "+":
                    case "-":
                    case "*":
                    case "/":
                    case "^":
                    case "math":
                        let b = this.stack.pop(), a = this.stack.pop();
                        if (!a) {
                            this.stack.push(b);
                            continue;
                        }
                        b.roll();
                        if (b instanceof StuntRoller) {
                            if (b.doubles) {
                                this.stunted = ` - ${b.results.get(0).value} Stunt Points`;
                            }
                        }
                        a.roll();
                        if (a instanceof StuntRoller) {
                            if (a.doubles) {
                                this.stunted = ` - ${a.results.get(0).value} Stunt Points`;
                            }
                        }
                        const result = this.operators[dice.data](a.result, b.result);
                        this.stack.push(new DiceRoller(`${result}`, dice));
                        break;
                    case "kh": {
                        let diceInstance = this.dice[index - 1];
                        let data = dice.data ? Number(dice.data) : 1;
                        diceInstance.modifiers.set("kh", {
                            data,
                            conditionals: []
                        });
                        break;
                    }
                    case "dl": {
                        let diceInstance = this.dice[index - 1];
                        let data = dice.data ? Number(dice.data) : 1;
                        data = diceInstance.results.size - data;
                        diceInstance.modifiers.set("kh", {
                            data,
                            conditionals: []
                        });
                        break;
                    }
                    case "kl": {
                        let diceInstance = this.dice[index - 1];
                        let data = dice.data ? Number(dice.data) : 1;
                        diceInstance.modifiers.set("kl", {
                            data,
                            conditionals: []
                        });
                        break;
                    }
                    case "dh": {
                        let diceInstance = this.dice[index - 1];
                        let data = dice.data ? Number(dice.data) : 1;
                        data = diceInstance.results.size - data;
                        diceInstance.modifiers.set("kl", {
                            data,
                            conditionals: []
                        });
                        break;
                    }
                    case "!": {
                        let diceInstance = this.dice[index - 1];
                        let data = Number(dice.data) || 1;
                        diceInstance.modifiers.set("!", {
                            data,
                            conditionals: dice.conditionals
                        });
                        break;
                    }
                    case "!!": {
                        let diceInstance = this.dice[index - 1];
                        let data = Number(dice.data) || 1;
                        diceInstance.modifiers.set("!!", {
                            data,
                            conditionals: dice.conditionals
                        });
                        break;
                    }
                    case "r": {
                        let diceInstance = this.dice[index - 1];
                        let data = Number(dice.data) || 1;
                        diceInstance.modifiers.set("r", {
                            data,
                            conditionals: dice.conditionals
                        });
                        break;
                    }
                    case "dice":
                        if (!this.dice[index]) {
                            this.dice[index] = new DiceRoller(dice.data, dice);
                        }
                        this.stack.push(this.dice[index]);
                        index++;
                        break;
                    case "stunt":
                        if (!this.dice[index]) {
                            this.dice[index] = new StuntRoller(dice.original, dice);
                        }
                        this.stack.push(this.dice[index]);
                        index++;
                }
            }
            const final = this.stack.pop();
            final.roll();
            if (final instanceof StuntRoller) {
                if (final.doubles) {
                    this.stunted = ` - ${final.results.get(0).value} Stunt Points`;
                }
            }
            this.result = final.result;
            this._tooltip = null;
            this.render();
            this.trigger("new-result");
            return this.result;
        });
    }
    toResult() {
        return {
            type: "dice",
            result: this.result,
            tooltip: this.tooltip
        };
    }
    applyResult(result) {
        return __awaiter(this, void 0, void 0, function* () {
            if (result.type !== "dice")
                return;
            if (result.result) {
                this.result = result.result;
            }
            if (result.tooltip) {
                this._tooltip = result.tooltip;
            }
            yield this.render();
        });
    }
}

class SectionRoller extends GenericFileRoller {
    constructor(plugin, original, lexeme, source, inline = true) {
        super(plugin, original, lexeme, source);
        this.plugin = plugin;
        this.original = original;
        this.lexeme = lexeme;
        this.inline = inline;
        this.containerEl.addClasses(["has-embed", "markdown-embed"]);
        this.resultEl.addClass("internal-embed");
        this.resultEl.setAttrs({ src: source });
        this.copy = this.containerEl.createDiv({
            cls: "dice-content-copy dice-roller-button no-show",
            attr: { "aria-label": "Copy Contents" }
        });
        this.copy.addEventListener("click", (evt) => {
            evt.stopPropagation();
            navigator.clipboard
                .writeText(this.displayFromCache(...this.results).trim())
                .then(() => __awaiter(this, void 0, void 0, function* () {
                new obsidian.Notice("Result copied to clipboard.");
            }));
        });
        obsidian.setIcon(this.copy, COPY_DEFINITION);
    }
    get tooltip() {
        return `${this.original}\n${this.path}`;
    }
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            this.resultEl.empty();
            if (this.plugin.data.displayResultsInline && this.inline) {
                this.resultEl.createSpan({
                    text: `${this.tooltip.split("\n").join(" -> ")} -> `
                });
            }
            if (!this.results || !this.results.length) {
                this.resultEl.createDiv({
                    cls: "dice-no-results",
                    text: "No results."
                });
                return;
            }
            if (this.plugin.data.copyContentButton) {
                this.copy.removeClass("no-show");
            }
            for (const result of this.results) {
                this.resultEl.onclick = (evt) => __awaiter(this, void 0, void 0, function* () {
                    if ((evt && evt.getModifierState("Control")) ||
                        evt.getModifierState("Meta")) {
                        evt.stopPropagation();
                        return;
                    }
                });
                const ret = this.resultEl.createDiv({
                    cls: "markdown-embed"
                });
                if (!this.plugin.data.displayResultsInline) {
                    ret.setAttrs({
                        "aria-label": `${this.file.basename}: ${result.type}`
                    });
                }
                if (!result) {
                    ret.createDiv({
                        cls: "dice-no-results",
                        text: "No results."
                    });
                    continue;
                }
                obsidian.MarkdownRenderer.renderMarkdown(this.displayFromCache(result), ret.createDiv(), this.source, null);
                if (this.plugin.data.copyContentButton && this.results.length > 1) {
                    let copy = ret.createDiv({
                        cls: "dice-content-copy dice-roller-button",
                        attr: { "aria-label": "Copy Contents" }
                    });
                    copy.addEventListener("click", (evt) => {
                        evt.stopPropagation();
                        navigator.clipboard
                            .writeText(this.displayFromCache(result).trim())
                            .then(() => __awaiter(this, void 0, void 0, function* () {
                            new obsidian.Notice("Result copied to clipboard.");
                        }));
                    });
                    obsidian.setIcon(copy, COPY_DEFINITION);
                }
            }
        });
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getOptions();
        });
    }
    displayFromCache(...caches) {
        let res = [];
        for (let cache of caches) {
            res.push(this.content.slice(cache.position.start.offset, cache.position.end.offset));
        }
        return res.join("\n\n");
    }
    getPath() {
        var _a;
        const { groups } = this.lexeme.data.match(SECTION_REGEX);
        const { roll = 1, link, types } = groups;
        if (!link)
            throw new Error("Could not parse link.");
        this.rolls = (_a = (roll && !isNaN(Number(roll)) && Number(roll))) !== null && _a !== void 0 ? _a : 1;
        this.path = link.replace(/(\[|\])/g, "");
        this.types = types === null || types === void 0 ? void 0 : types.split(",");
    }
    getOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            this.cache = this.plugin.app.metadataCache.getFileCache(this.file);
            if (!this.cache || !this.cache.sections) {
                throw new Error("Could not read file cache.");
            }
            this.content = yield this.plugin.app.vault.cachedRead(this.file);
            this.options = this.cache.sections.filter(({ type }) => this.types
                ? this.types.includes(type)
                : !["yaml", "thematicBreak"].includes(type));
            this.loaded = true;
            this.trigger("loaded");
        });
    }
    roll() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (!this.loaded) {
                    this.on("loaded", () => {
                        const options = [...this.options];
                        this.results = [...Array(this.rolls)]
                            .map(() => {
                            let option = options[this.getRandomBetween(0, options.length - 1)];
                            options.splice(options.indexOf(option), 1);
                            return option;
                        })
                            .filter((r) => r);
                        this.render();
                        this.trigger("new-result");
                        resolve(this.results[0]);
                    });
                }
                else {
                    const options = [...this.options];
                    this.results = [...Array(this.rolls)]
                        .map(() => {
                        let option = options[this.getRandomBetween(0, options.length - 1)];
                        options.splice(options.indexOf(option), 1);
                        return option;
                    })
                        .filter((r) => r);
                    this.render();
                    this.trigger("new-result");
                    resolve(this.results[0]);
                }
            });
        });
    }
    toResult() {
        return {
            type: "section",
            result: this.results
        };
    }
    applyResult(result) {
        return __awaiter(this, void 0, void 0, function* () {
            if (result.type !== "section")
                return;
            if (result.result) {
                this.results = result.result;
            }
            yield this.render();
        });
    }
}
class TagRoller extends GenericRoller {
    constructor(plugin, original, lexeme, source) {
        super(plugin, original, [lexeme]);
        this.plugin = plugin;
        this.original = original;
        this.lexeme = lexeme;
        this.source = source;
        this.loaded = false;
        this.containerEl.addClasses(["has-embed", "markdown-embed"]);
        const { roll = 1, tag, collapse, types } = lexeme.data.match(TAG_REGEX).groups;
        this.collapse =
            collapse === "-"
                ? true
                : collapse === "+"
                    ? false
                    : !this.plugin.data.returnAllTags;
        this.tag = `#${tag}`;
        this.rolls = Number(roll);
        this.types = types;
        this.getFiles();
    }
    get typeText() {
        var _a;
        if (!((_a = this.types) === null || _a === void 0 ? void 0 : _a.length)) {
            return "";
        }
        return `|${this.types}`;
    }
    getFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            const files = this.plugin.app.plugins.plugins.dataview.index.tags.invMap.get(this.tag);
            if (files)
                files.delete(this.source);
            if (!files || !files.size) {
                throw new Error("No files found with that tag. Is the tag correct?\n\n" +
                    this.tag);
            }
            const links = Array.from(files).map((file) => `${this.rolls}d[[${file}]]${this.typeText}`);
            this.results = links.map((link) => {
                return new SectionRoller(this.plugin, link, {
                    data: link,
                    original: link,
                    conditionals: null,
                    type: "section"
                }, this.source, false);
            });
            this.loaded = true;
            this.trigger("loaded");
        });
    }
    build() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.resultEl.empty();
            if (this.plugin.data.displayResultsInline) {
                this.resultEl.createSpan({
                    text: `${this.tooltip.split("\n").join(" -> ")} -> `
                });
            }
            if (this.collapse) {
                this.chosen =
                    (_a = this.random) !== null && _a !== void 0 ? _a : this.getRandomBetween(0, this.results.length - 1);
                let section = this.results[this.chosen];
                this.random = null;
                const container = this.resultEl.createDiv();
                container.createEl("h5", {
                    cls: "dice-file-name",
                    text: section.file.basename
                });
                container.appendChild(section.containerEl);
            }
            else {
                for (let section of this.results) {
                    const container = this.resultEl.createDiv();
                    container.createEl("h5", {
                        cls: "dice-file-name",
                        text: section.file.basename
                    });
                    container.appendChild(section.containerEl);
                }
            }
        });
    }
    roll() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (this.loaded) {
                    this.results.forEach((section) => __awaiter(this, void 0, void 0, function* () { return yield section.roll(); }));
                    this.render();
                    this.trigger("new-result");
                    resolve(this.result);
                }
                else {
                    this.on("loaded", () => {
                        this.results.forEach((section) => __awaiter(this, void 0, void 0, function* () { return yield section.roll(); }));
                        this.render();
                        this.trigger("new-result");
                        resolve(this.result);
                    });
                }
            });
        });
    }
    get tooltip() {
        return this.original;
    }
    toResult() {
        return {
            type: "tag",
            random: this.chosen,
            result: Object.fromEntries(this.results.map((section) => [
                section.path,
                section.toResult()
            ]))
        };
    }
    applyResult(result) {
        return __awaiter(this, void 0, void 0, function* () {
            if (result.type !== "tag")
                return;
            if (result.result) {
                for (let path in result.result) {
                    const section = this.results.find((section) => section.path === path);
                    if (!section)
                        continue;
                    section.applyResult(result.result[path]);
                }
            }
            if (result.random) {
                this.random = result.random;
            }
            yield this.render();
        });
    }
}
class LinkRoller extends GenericRoller {
    constructor(plugin, original, lexeme, source) {
        var _a;
        super(plugin, original, [lexeme]);
        this.plugin = plugin;
        this.original = original;
        this.lexeme = lexeme;
        this.source = source;
        const { roll = 1, tag } = lexeme.data.match(TAG_REGEX).groups;
        this.tag = `#${tag}`;
        this.rolls = (_a = (roll && !isNaN(Number(roll)) && Number(roll))) !== null && _a !== void 0 ? _a : 1;
        this.getFiles();
    }
    get tooltip() {
        return `${this.original}\n${this.result.basename}`;
    }
    roll() {
        return __awaiter(this, void 0, void 0, function* () {
            return ((this.result =
                this.links[this.getRandomBetween(0, this.links.length - 1)]),
                yield this.render(),
                this.trigger("new-result"),
                this.result);
        });
    }
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            this.resultEl.empty();
            if (this.plugin.data.displayResultsInline) {
                this.resultEl.createSpan({
                    text: `${this.tooltip.split("\n").join(" -> ")} -> `
                });
            }
            const link = this.resultEl.createEl("a", {
                cls: "internal-link",
                text: this.result.basename
            });
            link.onclick = (evt) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                evt.stopPropagation();
                this.plugin.app.workspace.openLinkText(this.result.path, (_a = this.plugin.app.workspace.getActiveFile()) === null || _a === void 0 ? void 0 : _a.path, true);
            });
            link.onmouseenter = (evt) => __awaiter(this, void 0, void 0, function* () {
                var _b;
                this.plugin.app.workspace.trigger("link-hover", this, //not sure
                link, //targetEl
                this.result.path, //linkText
                (_b = this.plugin.app.workspace.getActiveFile()) === null || _b === void 0 ? void 0 : _b.path //source
                );
            });
        });
    }
    getFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            const files = this.plugin.app.plugins.plugins.dataview.index.tags.invMap.get(this.tag);
            if (files)
                files.delete(this.source);
            if (!files || !files.size) {
                throw new Error("No files found with that tag. Is the tag correct?\n\n" +
                    this.tag);
            }
            this.links = Array.from(files).map((link) => this.plugin.app.metadataCache.getFirstLinkpathDest(link, this.source));
        });
    }
    toResult() {
        return {
            type: "link",
            result: this.result.path
        };
    }
    applyResult(result) {
        return __awaiter(this, void 0, void 0, function* () {
            if (result.type !== "link")
                return;
            if (result.result) {
                const file = this.plugin.app.vault.getAbstractFileByPath(result.result);
                if (file && file instanceof obsidian.TFile) {
                    this.result = file;
                }
            }
            yield this.render();
        });
    }
}

class TableRoller extends GenericFileRoller {
    getPath() {
        var _a;
        const { groups } = this.lexeme.data.match(TABLE_REGEX);
        const { roll = 1, link, block, header } = groups;
        if (!link || !block)
            throw new Error("Could not parse link.");
        this.rolls = (_a = (roll && !isNaN(Number(roll)) && Number(roll))) !== null && _a !== void 0 ? _a : 1;
        this.path = link.replace(/(\[|\])/g, "");
        this.block = block
            .replace(/(\^|#)/g, "")
            .trim()
            .toLowerCase();
        this.header = header;
    }
    get tooltip() {
        return `${this.original}\n${this.path} > ${this.block}${this.header ? " | " + this.header : ""}`;
    }
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            this.resultEl.empty();
            const result = [this.result];
            if (this.plugin.data.displayResultsInline) {
                result.unshift(this.tooltip.split("\n").join(" -> "), " -> ");
            }
            const split = result.join("").split(/(\[\[(?:[\s\S]+?)\]\])/);
            for (let str of split) {
                if (/\[\[(?:[\s\S]+?)\]\]/.test(str)) {
                    //link;
                    const [, match] = str.match(/\[\[([\s\S]+?)\]\]/);
                    const internal = this.resultEl.createEl("a", {
                        cls: "internal-link",
                        text: match
                    });
                    internal.onmouseover = () => {
                        var _a;
                        this.plugin.app.workspace.trigger("link-hover", this, //not sure
                        internal, //targetEl
                        match.replace("^", "#^").split("|").shift(), //linkText
                        (_a = this.plugin.app.workspace.getActiveFile()) === null || _a === void 0 ? void 0 : _a.path //source
                        );
                    };
                    internal.onclick = (ev) => __awaiter(this, void 0, void 0, function* () {
                        var _a;
                        ev.stopPropagation();
                        yield this.plugin.app.workspace.openLinkText(match.replace("^", "#^").split(/\|/).shift(), (_a = this.plugin.app.workspace.getActiveFile()) === null || _a === void 0 ? void 0 : _a.path, ev.getModifierState("Control"));
                    });
                    continue;
                }
                this.resultEl.createSpan({ text: str });
            }
        });
    }
    roll() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                if (this.loaded) {
                    const options = [...this.options];
                    this.result = [...Array(this.rolls)]
                        .map(() => {
                        let option = options[this.getRandomBetween(0, options.length - 1)];
                        options.splice(options.indexOf(option), 1);
                        return option;
                    })
                        .join("||");
                    this.render();
                    this.trigger("new-result");
                    resolve(this.result);
                }
                else {
                    this.on("loaded", () => {
                        const options = [...this.options];
                        this.result = [...Array(this.rolls)]
                            .map(() => {
                            let option = options[this.getRandomBetween(0, options.length - 1)];
                            options.splice(options.indexOf(option), 1);
                            return option;
                        })
                            .join("||");
                        this.render();
                        this.trigger("new-result");
                        resolve(this.result);
                    });
                }
            });
        });
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getOptions();
        });
    }
    getOptions() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.cache = this.plugin.app.metadataCache.getFileCache(this.file);
            if (!this.cache ||
                !this.cache.blocks ||
                !(this.block in this.cache.blocks)) {
                throw new Error("Could not read file cache. Does the block reference exist?\n\n" +
                    `${this.path} > ${this.block}`);
            }
            this.position = this.cache.blocks[this.block].position;
            this.content = (_a = (yield this.plugin.app.vault.cachedRead(this.file))) === null || _a === void 0 ? void 0 : _a.slice(this.position.start.offset, this.position.end.offset);
            let table = extract(this.content);
            if (this.header && table.columns[this.header]) {
                this.options = table.columns[this.header];
            }
            else {
                if (this.header)
                    throw new Error(`Header ${this.header} was not found in table ${this.path} > ${this.block}.`);
                this.options = table.rows;
            }
            this.loaded = true;
            this.trigger("loaded");
        });
    }
    toResult() {
        return {
            type: "table",
            result: this.result
        };
    }
    applyResult(result) {
        return __awaiter(this, void 0, void 0, function* () {
            if (result.type !== "table")
                return;
            if (result.result) {
                this.result = result.result;
            }
            yield this.render();
        });
    }
}
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
            containerEl.addClass("dice-roller-settings");
            containerEl.createEl("h2", { text: "Dice Roller Settings" });
            new obsidian.Setting(containerEl)
                .setName("Roll All Files for Tags")
                .setDesc("Return a result for each file when rolling tags.")
                .addToggle((t) => {
                t.setValue(this.plugin.data.returnAllTags);
                t.onChange((v) => __awaiter(this, void 0, void 0, function* () {
                    this.plugin.data.returnAllTags = v;
                    yield this.plugin.saveSettings();
                }));
            });
            new obsidian.Setting(containerEl)
                .setName("Always Return Links for Tags")
                .setDesc("Enables random link rolling with the link parameter. Override by specifying a section type.")
                .addToggle((t) => {
                t.setValue(this.plugin.data.rollLinksForTags);
                t.onChange((v) => __awaiter(this, void 0, void 0, function* () {
                    this.plugin.data.rollLinksForTags = v;
                    yield this.plugin.saveSettings();
                }));
            });
            new obsidian.Setting(containerEl)
                .setName("Add Copy Button to Section Results")
                .setDesc("Randomly rolled sections will have a copy-content button to easy add result to clipboard.")
                .addToggle((t) => {
                t.setValue(this.plugin.data.copyContentButton);
                t.onChange((v) => __awaiter(this, void 0, void 0, function* () {
                    this.plugin.data.copyContentButton = v;
                    yield this.plugin.saveSettings();
                }));
            });
            new obsidian.Setting(containerEl)
                .setName("Display Formula With Results")
                .setDesc("Both the formula and the results will both be displayed in preview mode.")
                .addToggle((t) => {
                t.setValue(this.plugin.data.displayResultsInline);
                t.onChange((v) => __awaiter(this, void 0, void 0, function* () {
                    this.plugin.data.displayResultsInline = v;
                    yield this.plugin.saveSettings();
                }));
            });
            const save = new obsidian.Setting(containerEl)
                .setName("Globally Save Results")
                .setDesc("Dice results will be saved by default. This can be overridden using ")
                .addToggle((t) => {
                t.setValue(this.plugin.data.persistResults);
                t.onChange((v) => __awaiter(this, void 0, void 0, function* () {
                    this.plugin.data.persistResults = v;
                    yield this.plugin.saveSettings();
                }));
            });
            new obsidian.Setting(containerEl)
                .setName("Default Roll")
                .setDesc("Use this as the number of rolls when it is omitted.")
                .addText((t) => {
                t.setValue(`${this.plugin.data.defaultRoll}`);
                t.inputEl.onblur = () => __awaiter(this, void 0, void 0, function* () {
                    if (isNaN(Number(t.inputEl.value))) {
                        new obsidian.Notice("The default roll must be a number.");
                    }
                    this.plugin.data.defaultRoll = Number(t.inputEl.value);
                    yield this.plugin.saveSettings();
                });
            });
            new obsidian.Setting(containerEl)
                .setName("Default Face")
                .setDesc("Use this as the number of faces when it is omitted.")
                .addText((t) => {
                t.setValue(`${this.plugin.data.defaultFace}`);
                t.inputEl.onblur = () => __awaiter(this, void 0, void 0, function* () {
                    if (isNaN(Number(t.inputEl.value))) {
                        new obsidian.Notice("The default face must be a number.");
                    }
                    this.plugin.data.defaultFace = Number(t.inputEl.value);
                    yield this.plugin.saveSettings();
                });
            });
            save.descEl.createEl("code", { text: `dice-: formula` });
            save.descEl.createEl("p", {
                text: "Please note that the plugin will attempt to save the result but may not be able to."
            });
            this.additionalContainer = containerEl.createDiv("dice-roller-setting-additional-container");
            this.buildFormulaSettings();
            const div = containerEl.createDiv("coffee");
            div.createEl("a", {
                href: "https://www.buymeacoffee.com/valentine195"
            }).createEl("img", {
                attr: {
                    src: "https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=valentine195&button_colour=e3e7ef&font_colour=262626&font_family=Inter&outline_colour=262626&coffee_colour=ff0000"
                }
            });
        });
    }
    buildFormulaSettings() {
        this.additionalContainer.empty();
        const addNew = this.additionalContainer.createDiv();
        new obsidian.Setting(addNew)
            .setName("Add Formula")
            .setDesc("Add a new formula shortcut.")
            .addButton((button) => {
            let b = button
                .setTooltip("Add Formula")
                .setButtonText("+")
                .onClick(() => __awaiter(this, void 0, void 0, function* () {
                const formula = yield this.buildFormulaForm(addNew);
                if (formula) {
                    this.plugin.data.formulas[formula.alias] =
                        formula.formula;
                    this.buildFormulaSettings();
                    yield this.plugin.saveSettings();
                }
            }));
            return b;
        });
        const additional = this.additionalContainer.createDiv("additional");
        const formulas = this.plugin.data.formulas;
        for (const [alias, formula] of Object.entries(formulas)) {
            const setting = new obsidian.Setting(additional).setName(alias);
            setting.controlEl.createSpan({ text: formula });
            setting
                .addExtraButton((b) => b
                .setIcon("pencil")
                .setTooltip("Edit")
                .onClick(() => __awaiter(this, void 0, void 0, function* () {
                const edited = yield this.buildFormulaForm(addNew, {
                    alias,
                    formula
                });
                if (edited) {
                    delete this.plugin.data.formulas[alias];
                    this.plugin.data.formulas[edited.alias] =
                        edited.formula;
                    this.buildFormulaSettings();
                    yield this.plugin.saveSettings();
                }
            })))
                .addExtraButton((b) => b
                .setIcon("trash")
                .setTooltip("Delete")
                .onClick(() => __awaiter(this, void 0, void 0, function* () {
                delete this.plugin.data.formulas[alias];
                yield this.plugin.saveSettings();
                this.buildFormulaSettings();
            })));
        }
        if (!Object.values(formulas).length) {
            additional.createSpan({
                text: "Create a formula to see it here!",
                cls: "no-formulas"
            });
        }
    }
    buildFormulaForm(el, temp = {
        alias: null,
        formula: null
    }) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                const formulaEl = el.createDiv("add-new-formula");
                const dataEl = formulaEl.createDiv("formula-data");
                new obsidian.Setting(dataEl).setName("Alias").addText((t) => {
                    t.setValue(temp.alias).onChange((v) => (temp.alias = v));
                });
                new obsidian.Setting(dataEl).setName("Formula").addText((t) => {
                    t.setValue(temp.formula).onChange((v) => (temp.formula = v));
                });
                const buttonEl = formulaEl.createDiv("formula-buttons");
                new obsidian.Setting(buttonEl)
                    .addButton((b) => b
                    .setCta()
                    .setButtonText("Save")
                    .onClick(() => __awaiter(this, void 0, void 0, function* () {
                    formulaEl.detach();
                    resolve(temp);
                })))
                    .addExtraButton((b) => b
                    .setIcon("cross")
                    .setTooltip("Cancel")
                    .onClick(() => {
                    formulaEl.detach();
                    resolve(null);
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
const DEFAULT_SETTINGS = {
    returnAllTags: true,
    rollLinksForTags: false,
    copyContentButton: true,
    displayResultsInline: false,
    formulas: {},
    persistResults: false,
    results: {},
    defaultRoll: 1,
    defaultFace: 100
};
class DiceRollerPlugin extends obsidian.Plugin {
    constructor() {
        super(...arguments);
        this.persistingFiles = new Set();
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
        return __awaiter(this, void 0, void 0, function* () {
            console.log("DiceRoller plugin loaded");
            this.data = Object.assign(DEFAULT_SETTINGS, yield this.loadData());
            this.addSettingTab(new SettingTab(this.app, this));
            const ICON_SVG = icon(faDice).html[0];
            obsidian.addIcon(ICON_DEFINITION, ICON_SVG);
            const COPY_SVG = icon(faCopy).html[0];
            obsidian.addIcon(COPY_DEFINITION, COPY_SVG);
            this.registerMarkdownPostProcessor((el, ctx) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d, _e;
                let nodeList = el.querySelectorAll("code");
                if (!nodeList.length)
                    return;
                const path = ctx.sourcePath;
                const lineStart = (_a = ctx.getSectionInfo(el)) === null || _a === void 0 ? void 0 : _a.lineStart;
                const toPersist = {};
                for (let index = 0; index < nodeList.length; index++) {
                    const node = nodeList.item(index);
                    if (!/^dice(?:\+|\-)?:\s*([\s\S]+)\s*?/.test(node.innerText))
                        continue;
                    try {
                        let [, content] = node.innerText.match(/^dice(?:\+|\-)?:\s*([\s\S]+)\s*?/);
                        if (content in this.data.formulas) {
                            content = this.data.formulas[content];
                        }
                        //build result map;
                        const roller = this.getRoller(content, ctx.sourcePath);
                        yield roller.roll();
                        if ((this.data.persistResults &&
                            !/dice\-/.test(node.innerText)) ||
                            /dice\+/.test(node.innerText)) {
                            this.persistingFiles.add(ctx.sourcePath);
                            toPersist[index] = roller;
                            const result = (_e = (_d = (_c = (_b = this.data.results) === null || _b === void 0 ? void 0 : _b[path]) === null || _c === void 0 ? void 0 : _c[lineStart]) === null || _d === void 0 ? void 0 : _d[index]) !== null && _e !== void 0 ? _e : null;
                            if (result) {
                                yield roller.applyResult(result);
                            }
                        }
                        node.replaceWith(roller.containerEl);
                    }
                    catch (e) {
                        console.error(e);
                        new obsidian.Notice(`There was an error parsing the dice string: ${node.innerText}.\n\n${e}`, 5000);
                        continue;
                    }
                }
                if (path in this.data.results) {
                    this.data.results[path][lineStart] = {};
                }
                if (Object.entries(toPersist).length) {
                    const view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
                    if (view) {
                        const self = this;
                        const file = this.app.vault.getAbstractFileByPath(ctx.sourcePath);
                        if (!file || !(file instanceof obsidian.TFile))
                            return;
                        let unregisterOnUnloadFile = around(view, {
                            onUnloadFile: function (next) {
                                return function (unloaded) {
                                    var _a, _b, _c, _d;
                                    return __awaiter(this, void 0, void 0, function* () {
                                        if ((unloaded = file)) {
                                            if (self.persistingFiles.has(path)) {
                                                self.persistingFiles.delete(path);
                                                self.data.results[path] = {};
                                            }
                                            for (let index in toPersist) {
                                                const roller = toPersist[index];
                                                const newLineStart = (_a = ctx.getSectionInfo(el)) === null || _a === void 0 ? void 0 : _a.lineStart;
                                                if (newLineStart == null)
                                                    continue;
                                                const result = {
                                                    [newLineStart]: Object.assign(Object.assign({}, ((_c = (_b = self.data.results[path]) === null || _b === void 0 ? void 0 : _b[newLineStart]) !== null && _c !== void 0 ? _c : {})), { [index]: roller.toResult() })
                                                };
                                                self.data.results[path] = Object.assign(Object.assign({}, ((_d = self.data.results[path]) !== null && _d !== void 0 ? _d : {})), result);
                                                yield self.saveSettings();
                                            }
                                        }
                                        unregisterOnUnloadFile();
                                        return yield next.call(this, unloaded);
                                    });
                                };
                            }
                        });
                        view.register(unregisterOnUnloadFile);
                        view.register(() => __awaiter(this, void 0, void 0, function* () {
                            var _f, _g, _h, _j;
                            if (this.persistingFiles.has(path)) {
                                this.persistingFiles.delete(path);
                                this.data.results[path] = {};
                            }
                            for (let index in toPersist) {
                                const roller = toPersist[index];
                                const newLineStart = (_f = ctx.getSectionInfo(el)) === null || _f === void 0 ? void 0 : _f.lineStart;
                                if (newLineStart == null)
                                    continue;
                                const result = {
                                    [newLineStart]: Object.assign(Object.assign({}, ((_h = (_g = this.data.results[path]) === null || _g === void 0 ? void 0 : _g[newLineStart]) !== null && _h !== void 0 ? _h : {})), { [index]: roller.toResult() })
                                };
                                this.data.results[path] = Object.assign(Object.assign({}, ((_j = this.data.results[path]) !== null && _j !== void 0 ? _j : {})), result);
                                yield this.saveSettings();
                            }
                        }));
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
    parseDice(content, source) {
        return __awaiter(this, void 0, void 0, function* () {
            const roller = this.getRoller(content, source);
            return { result: yield roller.roll() };
        });
    }
    clearEmpties(o) {
        for (var k in o) {
            if (!o[k] || typeof o[k] !== "object") {
                continue;
            }
            this.clearEmpties(o[k]);
            if (Object.keys(o[k]).length === 0) {
                delete o[k];
            }
        }
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.clearEmpties(this.data.results);
            yield this.saveData(this.data);
        });
    }
    getRoller(content, source) {
        const lexemes = this.parse(content);
        const type = this.getTypeFromLexemes(lexemes);
        switch (type) {
            case "dice": {
                return new StackRoller(this, content, lexemes);
            }
            case "table": {
                return new TableRoller(this, content, lexemes[0], source);
            }
            case "section": {
                return new SectionRoller(this, content, lexemes[0], source);
            }
            case "tag": {
                if (!this.app.plugins.plugins.dataview) {
                    throw new Error("Tags are only supported with the Dataview plugin installed.");
                }
                return new TagRoller(this, content, lexemes[0], source);
            }
            case "link": {
                return new LinkRoller(this, content, lexemes[0], source);
            }
        }
    }
    getTypeFromLexemes(lexemes) {
        if (lexemes.some(({ type }) => type === "table")) {
            return "table";
        }
        if (lexemes.some(({ type }) => type === "section")) {
            return "section";
        }
        if (lexemes.some(({ type }) => type === "tag")) {
            return "tag";
        }
        if (lexemes.some(({ type }) => type === "link")) {
            return "link";
        }
        return "dice";
    }
    addLexerRules() {
        this.lexer.addRule(/\s+/, function () {
            /* skip whitespace */
        });
        this.lexer.addRule(/[{}]+/, function () {
            /* skip brackets */
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
        this.lexer.addRule(TAG_REGEX, (lexeme) => {
            var _a;
            const { groups } = lexeme.match(TAG_REGEX);
            let type = "tag";
            if (groups.types === "link" ||
                (this.data.rollLinksForTags && !((_a = groups.types) === null || _a === void 0 ? void 0 : _a.length))) {
                type = "link";
            }
            return {
                type,
                data: lexeme,
                original: lexeme,
                conditionals: null
            };
        });
        this.lexer.addRule(DICE_REGEX, function (lexeme) {
            const { dice, conditional } = lexeme.match(DICE_REGEX).groups;
            let conditionals = [];
            if (conditional) {
                let matches = conditional.matchAll(CONDITIONAL_REGEX);
                if (matches) {
                    for (let match of matches) {
                        if (!match)
                            continue;
                        const { comparer, operator } = match.groups;
                        conditionals.push({
                            comparer: Number(comparer),
                            operator
                        });
                    }
                }
            }
            return {
                type: "dice",
                data: dice,
                original: lexeme,
                conditionals
            }; // symbols
        });
        this.lexer.addRule(OMITTED_REGEX, (lexeme) => {
            const { roll = this.data.defaultRoll, faces = this.data.defaultFace, conditional } = lexeme.match(OMITTED_REGEX).groups;
            let conditionals = [];
            if (conditional) {
                let matches = conditional.matchAll(CONDITIONAL_REGEX);
                if (matches) {
                    for (let match of matches) {
                        if (!match)
                            continue;
                        const { comparer, operator } = match.groups;
                        conditionals.push({
                            comparer: Number(comparer),
                            operator
                        });
                    }
                }
            }
            return {
                type: "dice",
                data: `${roll}d${faces}`,
                original: lexeme,
                conditionals
            }; // symbols
        });
        this.lexer.addRule(MATH_REGEX, function (lexeme) {
            return {
                type: "math",
                data: lexeme,
                original: lexeme,
                conditionals: null
            };
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
    parse(input) {
        this.lexer.setInput(input);
        var tokens = [], token;
        while ((token = this.tryLex()))
            tokens.push(token);
        return this.parser.parse(tokens);
    }
    tryLex() {
        try {
            return this.lexer.lex();
        }
        catch (e) { }
    }
}

module.exports = DiceRollerPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vRG9jdW1lbnRzL0dpdEh1Yi9QZXJzb25hbC9vYnNpZGlhbi1kaWNlLXJvbGxlci9ub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2LmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vRG9jdW1lbnRzL0dpdEh1Yi9QZXJzb25hbC9vYnNpZGlhbi1kaWNlLXJvbGxlci9ub2RlX21vZHVsZXMvbGV4L2xleGVyLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vRG9jdW1lbnRzL0dpdEh1Yi9QZXJzb25hbC9vYnNpZGlhbi1kaWNlLXJvbGxlci9ub2RlX21vZHVsZXMvQGZvcnRhd2Vzb21lL2ZyZWUtc29saWQtc3ZnLWljb25zL2luZGV4LmVzLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vRG9jdW1lbnRzL0dpdEh1Yi9QZXJzb25hbC9vYnNpZGlhbi1kaWNlLXJvbGxlci9ub2RlX21vZHVsZXMvQGZvcnRhd2Vzb21lL2ZyZWUtcmVndWxhci1zdmctaWNvbnMvaW5kZXguZXMuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9Eb2N1bWVudHMvR2l0SHViL1BlcnNvbmFsL29ic2lkaWFuLWRpY2Utcm9sbGVyL25vZGVfbW9kdWxlcy9AZm9ydGF3ZXNvbWUvZm9udGF3ZXNvbWUtc3ZnLWNvcmUvaW5kZXguZXMuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9Eb2N1bWVudHMvR2l0SHViL1BlcnNvbmFsL29ic2lkaWFuLWRpY2Utcm9sbGVyL3NyYy9wYXJzZXIvcGFyc2VyLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vRG9jdW1lbnRzL0dpdEh1Yi9QZXJzb25hbC9vYnNpZGlhbi1kaWNlLXJvbGxlci9ub2RlX21vZHVsZXMvbW9ua2V5LWFyb3VuZC9tanMvaW5kZXguanMiLCIuLi8uLi8uLi8uLi8uLi8uLi9Eb2N1bWVudHMvR2l0SHViL1BlcnNvbmFsL29ic2lkaWFuLWRpY2Utcm9sbGVyL3NyYy91dGlscy9jb25zdGFudHMudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9Eb2N1bWVudHMvR2l0SHViL1BlcnNvbmFsL29ic2lkaWFuLWRpY2Utcm9sbGVyL3NyYy91dGlscy91dGlsLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vRG9jdW1lbnRzL0dpdEh1Yi9QZXJzb25hbC9vYnNpZGlhbi1kaWNlLXJvbGxlci9zcmMvcm9sbGVyL3JvbGxlci50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL0RvY3VtZW50cy9HaXRIdWIvUGVyc29uYWwvb2JzaWRpYW4tZGljZS1yb2xsZXIvc3JjL3JvbGxlci9kaWNlLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vRG9jdW1lbnRzL0dpdEh1Yi9QZXJzb25hbC9vYnNpZGlhbi1kaWNlLXJvbGxlci9zcmMvcm9sbGVyL3NlY3Rpb24udHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9Eb2N1bWVudHMvR2l0SHViL1BlcnNvbmFsL29ic2lkaWFuLWRpY2Utcm9sbGVyL3NyYy9yb2xsZXIvdGFibGUudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9Eb2N1bWVudHMvR2l0SHViL1BlcnNvbmFsL29ic2lkaWFuLWRpY2Utcm9sbGVyL3NyYy9zZXR0aW5ncy9zZXR0aW5ncy50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL0RvY3VtZW50cy9HaXRIdWIvUGVyc29uYWwvb2JzaWRpYW4tZGljZS1yb2xsZXIvc3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOm51bGwsIm5hbWVzIjpbIkV2ZW50cyIsInNldEljb24iLCJURmlsZSIsIk5vdGljZSIsIk1hcmtkb3duUmVuZGVyZXIiLCJQbHVnaW5TZXR0aW5nVGFiIiwiU2V0dGluZyIsIlBsdWdpbiIsImFkZEljb24iLCJNYXJrZG93blZpZXciXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBdURBO0FBQ08sU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQzdELElBQUksU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxLQUFLLFlBQVksQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxVQUFVLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQ2hILElBQUksT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQy9ELFFBQVEsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUNuRyxRQUFRLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUN0RyxRQUFRLFNBQVMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUN0SCxRQUFRLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxVQUFVLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM5RSxLQUFLLENBQUMsQ0FBQztBQUNQOzs7Ozs7Ozs7Ozs7Ozs7OztBQzdFc0UsY0FBYyxHQUFHLEtBQUssQ0FBQztBQUM3RjtBQUNBLEtBQUssQ0FBQyxPQUFPLEdBQUcsVUFBVSxHQUFHLEVBQUU7QUFDL0IsSUFBSSxNQUFNLElBQUksS0FBSyxDQUFDLGdDQUFnQyxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ3RGLENBQUMsQ0FBQztBQUNGO0FBQ0EsU0FBUyxLQUFLLENBQUMsT0FBTyxFQUFFO0FBQ3hCLElBQUksSUFBSSxPQUFPLE9BQU8sS0FBSyxVQUFVLEVBQUUsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7QUFDL0Q7QUFDQSxJQUFJLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNwQixJQUFJLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNuQixJQUFJLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNuQixJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDbkIsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNwQjtBQUNBLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO0FBQ3JELFFBQVEsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztBQUNwQztBQUNBLFFBQVEsSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNyQixZQUFZLElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQztBQUM1QixZQUFZLElBQUksT0FBTyxDQUFDLFNBQVMsRUFBRSxLQUFLLElBQUksR0FBRyxDQUFDO0FBQ2hELFlBQVksSUFBSSxPQUFPLENBQUMsVUFBVSxFQUFFLEtBQUssSUFBSSxHQUFHLENBQUM7QUFDakQsWUFBWSxPQUFPLEdBQUcsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN4RCxTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLGdCQUFnQixFQUFFLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BGO0FBQ0EsUUFBUSxLQUFLLENBQUMsSUFBSSxDQUFDO0FBQ25CLFlBQVksT0FBTyxFQUFFLE9BQU87QUFDNUIsWUFBWSxNQUFNLEVBQUUsTUFBTTtBQUMxQixZQUFZLE1BQU0sRUFBRSxNQUFNO0FBQzFCLFlBQVksS0FBSyxFQUFFLEtBQUs7QUFDeEIsU0FBUyxDQUFDLENBQUM7QUFDWDtBQUNBLFFBQVEsT0FBTyxJQUFJLENBQUM7QUFDcEIsS0FBSyxDQUFDO0FBQ047QUFDQSxJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsVUFBVSxLQUFLLEVBQUU7QUFDckMsUUFBUSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLFFBQVEsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDdkIsUUFBUSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztBQUN2QixRQUFRLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQzFCLFFBQVEsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDM0IsUUFBUSxPQUFPLElBQUksQ0FBQztBQUNwQixLQUFLLENBQUM7QUFDTjtBQUNBLElBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxZQUFZO0FBQzNCLFFBQVEsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2pEO0FBQ0EsUUFBUSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUMzQjtBQUNBLFFBQVEsT0FBTyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO0FBQ2hELFlBQVksSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDekQsWUFBWSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ25DO0FBQ0EsWUFBWSxPQUFPLE9BQU8sQ0FBQyxNQUFNLEVBQUU7QUFDbkMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNqQyxvQkFBb0IsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2hELG9CQUFvQixJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQzlDLG9CQUFvQixJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQzlDLG9CQUFvQixJQUFJLENBQUMsS0FBSyxJQUFJLE1BQU0sQ0FBQztBQUN6QyxvQkFBb0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFDeEMsb0JBQW9CLE1BQU0sRUFBRSxDQUFDO0FBQzdCO0FBQ0Esb0JBQW9CLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNqRSxvQkFBb0IsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUMvRCx5QkFBeUIsSUFBSSxPQUFPLEtBQUssS0FBSyxXQUFXLEVBQUU7QUFDM0Qsd0JBQXdCLFFBQVEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUNyRSx3QkFBd0IsS0FBSyxnQkFBZ0I7QUFDN0MsNEJBQTRCLE1BQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BELDRCQUE0QixLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdDLHdCQUF3QjtBQUN4Qiw0QkFBNEIsSUFBSSxNQUFNLEVBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNuRCw0QkFBNEIsT0FBTyxLQUFLLENBQUM7QUFDekMseUJBQXlCO0FBQ3pCLHFCQUFxQjtBQUNyQixpQkFBaUIsTUFBTSxNQUFNO0FBQzdCLGFBQWE7QUFDYjtBQUNBLFlBQVksSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUNuQztBQUNBLFlBQVksSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRTtBQUN0QyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2pDLG9CQUFvQixNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQy9CLG9CQUFvQixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDL0Usb0JBQW9CLElBQUksT0FBTyxLQUFLLEtBQUssV0FBVyxFQUFFO0FBQ3RELHdCQUF3QixJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxnQkFBZ0IsRUFBRTtBQUN4Riw0QkFBNEIsTUFBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEQsNEJBQTRCLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVDLHlCQUF5QixNQUFNLE9BQU8sS0FBSyxDQUFDO0FBQzVDLHFCQUFxQjtBQUNyQixpQkFBaUIsTUFBTTtBQUN2QixvQkFBb0IsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLEtBQUssRUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ3pELG9CQUFvQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUN2QyxpQkFBaUI7QUFDakIsYUFBYSxNQUFNLElBQUksT0FBTyxDQUFDLE1BQU07QUFDckMsZ0JBQWdCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ25DLGlCQUFpQixNQUFNO0FBQ3ZCLFNBQVM7QUFDVCxLQUFLLENBQUM7QUFDTjtBQUNBLElBQUksU0FBUyxJQUFJLEdBQUc7QUFDcEIsUUFBUSxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDekIsUUFBUSxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDdEI7QUFDQSxRQUFRLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDL0IsUUFBUSxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ25DLFFBQVEsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUMvQjtBQUNBLFFBQVEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNoRSxZQUFZLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoQyxZQUFZLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDbkMsWUFBWSxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQ3RDO0FBQ0EsWUFBWSxJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO0FBQ3JELGlCQUFpQixLQUFLLEdBQUcsQ0FBQyxJQUFJLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUMxRCxnQkFBZ0IsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUMzQyxnQkFBZ0IsT0FBTyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7QUFDOUMsZ0JBQWdCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDakQ7QUFDQSxnQkFBZ0IsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLEtBQUssS0FBSyxTQUFTLEVBQUU7QUFDMUQsb0JBQW9CLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7QUFDekMsd0JBQXdCLE1BQU0sRUFBRSxNQUFNO0FBQ3RDLHdCQUF3QixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07QUFDM0Msd0JBQXdCLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTTtBQUNoRCxxQkFBcUIsQ0FBQyxDQUFDO0FBQ3ZCO0FBQ0Esb0JBQW9CLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQy9DO0FBQ0Esb0JBQW9CLE9BQU8sRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFFO0FBQ3hDLHdCQUF3QixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3RDO0FBQ0Esd0JBQXdCLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFO0FBQ25FLDRCQUE0QixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEQsNEJBQTRCLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEQsNEJBQTRCLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7QUFDaEQseUJBQXlCO0FBQ3pCLHFCQUFxQjtBQUNyQixpQkFBaUI7QUFDakIsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBLFFBQVEsT0FBTyxPQUFPLENBQUM7QUFDdkIsS0FBSztBQUNMOzs7QUNqSkE7QUFDQTtBQUNBO0FBQ0E7QUF5dUNBLElBQUksTUFBTSxHQUFHO0FBQ2IsRUFBRSxNQUFNLEVBQUUsS0FBSztBQUNmLEVBQUUsUUFBUSxFQUFFLE1BQU07QUFDbEIsRUFBRSxJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsNjNCQUE2M0IsQ0FBQztBQUM3NUIsQ0FBQzs7QUNodkNEO0FBQ0E7QUFDQTtBQUNBO0FBNEtBLElBQUksTUFBTSxHQUFHO0FBQ2IsRUFBRSxNQUFNLEVBQUUsS0FBSztBQUNmLEVBQUUsUUFBUSxFQUFFLE1BQU07QUFDbEIsRUFBRSxJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsOGZBQThmLENBQUM7QUFDOWhCLENBQUM7O0FDbkxEO0FBQ0E7QUFDQTtBQUNBO0FBY0E7QUFDQSxTQUFTLGVBQWUsQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFO0FBQ2hELEVBQUUsSUFBSSxFQUFFLFFBQVEsWUFBWSxXQUFXLENBQUMsRUFBRTtBQUMxQyxJQUFJLE1BQU0sSUFBSSxTQUFTLENBQUMsbUNBQW1DLENBQUMsQ0FBQztBQUM3RCxHQUFHO0FBQ0gsQ0FBQztBQUNEO0FBQ0EsU0FBUyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFO0FBQzFDLEVBQUUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDekMsSUFBSSxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUIsSUFBSSxVQUFVLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDO0FBQzNELElBQUksVUFBVSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDbkMsSUFBSSxJQUFJLE9BQU8sSUFBSSxVQUFVLEVBQUUsVUFBVSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDMUQsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQzlELEdBQUc7QUFDSCxDQUFDO0FBQ0Q7QUFDQSxTQUFTLFlBQVksQ0FBQyxXQUFXLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRTtBQUM1RCxFQUFFLElBQUksVUFBVSxFQUFFLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDdkUsRUFBRSxJQUFJLFdBQVcsRUFBRSxpQkFBaUIsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDL0QsRUFBRSxPQUFPLFdBQVcsQ0FBQztBQUNyQixDQUFDO0FBQ0Q7QUFDQSxTQUFTLGVBQWUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRTtBQUMxQyxFQUFFLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBRTtBQUNsQixJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRTtBQUNwQyxNQUFNLEtBQUssRUFBRSxLQUFLO0FBQ2xCLE1BQU0sVUFBVSxFQUFFLElBQUk7QUFDdEIsTUFBTSxZQUFZLEVBQUUsSUFBSTtBQUN4QixNQUFNLFFBQVEsRUFBRSxJQUFJO0FBQ3BCLEtBQUssQ0FBQyxDQUFDO0FBQ1AsR0FBRyxNQUFNO0FBQ1QsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQ3JCLEdBQUc7QUFDSDtBQUNBLEVBQUUsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBQ0Q7QUFDQSxTQUFTLGFBQWEsQ0FBQyxNQUFNLEVBQUU7QUFDL0IsRUFBRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUM3QyxJQUFJLElBQUksTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxRCxJQUFJLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdEM7QUFDQSxJQUFJLElBQUksT0FBTyxNQUFNLENBQUMscUJBQXFCLEtBQUssVUFBVSxFQUFFO0FBQzVELE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsRUFBRTtBQUMxRixRQUFRLE9BQU8sTUFBTSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUM7QUFDdkUsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNWLEtBQUs7QUFDTDtBQUNBLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsRUFBRTtBQUNuQyxNQUFNLGVBQWUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2hELEtBQUssQ0FBQyxDQUFDO0FBQ1AsR0FBRztBQUNIO0FBQ0EsRUFBRSxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBQ0Q7QUFDQSxTQUFTLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFO0FBQ2hDLEVBQUUsT0FBTyxlQUFlLENBQUMsR0FBRyxDQUFDLElBQUkscUJBQXFCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLGdCQUFnQixFQUFFLENBQUM7QUFDckYsQ0FBQztBQWFEO0FBQ0EsU0FBUyxlQUFlLENBQUMsR0FBRyxFQUFFO0FBQzlCLEVBQUUsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sR0FBRyxDQUFDO0FBQ3JDLENBQUM7QUFLRDtBQUNBLFNBQVMscUJBQXFCLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRTtBQUN2QyxFQUFFLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNoQixFQUFFLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQztBQUNoQixFQUFFLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQztBQUNqQixFQUFFLElBQUksRUFBRSxHQUFHLFNBQVMsQ0FBQztBQUNyQjtBQUNBLEVBQUUsSUFBSTtBQUNOLElBQUksS0FBSyxJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLEdBQUcsSUFBSSxFQUFFO0FBQ3hGLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDMUI7QUFDQSxNQUFNLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLE1BQU07QUFDeEMsS0FBSztBQUNMLEdBQUcsQ0FBQyxPQUFPLEdBQUcsRUFBRTtBQUNoQixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFDZCxJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUM7QUFDYixHQUFHLFNBQVM7QUFDWixJQUFJLElBQUk7QUFDUixNQUFNLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztBQUN0RCxLQUFLLFNBQVM7QUFDZCxNQUFNLElBQUksRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDO0FBQ3ZCLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQSxFQUFFLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUtEO0FBQ0EsU0FBUyxnQkFBZ0IsR0FBRztBQUM1QixFQUFFLE1BQU0sSUFBSSxTQUFTLENBQUMsc0RBQXNELENBQUMsQ0FBQztBQUM5RSxDQUFDO0FBQ0Q7QUFDQSxJQUFJLElBQUksR0FBRyxTQUFTLElBQUksR0FBRyxFQUFFLENBQUM7QUFDOUI7QUFDQSxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDakIsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ25CLElBQUksa0JBQWtCLEdBQUcsSUFBSSxDQUFDO0FBQzlCLElBQUksWUFBWSxHQUFHO0FBQ25CLEVBQUUsSUFBSSxFQUFFLElBQUk7QUFDWixFQUFFLE9BQU8sRUFBRSxJQUFJO0FBQ2YsQ0FBQyxDQUFDO0FBQ0Y7QUFDQSxJQUFJO0FBQ0osRUFBRSxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsRUFBRSxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQ3RELEVBQUUsSUFBSSxPQUFPLFFBQVEsS0FBSyxXQUFXLEVBQUUsU0FBUyxHQUFHLFFBQVEsQ0FBQztBQUM1RCxFQUFFLElBQUksT0FBTyxnQkFBZ0IsS0FBSyxXQUFXLEVBQUUsa0JBQWtCLEdBQUcsZ0JBQWdCLENBQUM7QUFDckYsRUFBRSxJQUFJLE9BQU8sV0FBVyxLQUFLLFdBQVcsRUFBRSxZQUFZLEdBQUcsV0FBVyxDQUFDO0FBQ3JFLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFO0FBQ2Q7QUFDQSxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsU0FBUyxJQUFJLEVBQUU7QUFDbEMsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLFNBQVM7QUFDbkMsSUFBSSxTQUFTLEdBQUcsY0FBYyxLQUFLLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxjQUFjLENBQUM7QUFDaEU7QUFDQSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUM7QUFDckIsSUFBSSxRQUFRLEdBQUcsU0FBUyxDQUFDO0FBRXpCLElBQUksV0FBVyxHQUFHLFlBQVksQ0FBQztBQUNkLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUztBQUNuQyxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLGVBQWUsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxPQUFPLFFBQVEsQ0FBQyxnQkFBZ0IsS0FBSyxVQUFVLElBQUksT0FBTyxRQUFRLENBQUMsYUFBYSxLQUFLLFVBQVUsQ0FBQztBQUNsSixDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRTtBQUN6RTtBQUNBLElBQUksb0JBQW9CLEdBQUcsb0JBQW9CLENBQUM7QUFFaEQsSUFBSSxxQkFBcUIsR0FBRyxJQUFJLENBQUM7QUFDakMsSUFBSSx5QkFBeUIsR0FBRyxnQkFBZ0IsQ0FBQztBQUNqRCxJQUFJLGFBQWEsR0FBRyxlQUFlLENBQUM7Q0FRbkIsWUFBWTtBQUM3QixFQUFFLElBQUk7QUFDTixJQUFJLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEtBQUssWUFBWSxDQUFDO0FBQ2pELEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNkLElBQUksT0FBTyxLQUFLLENBQUM7QUFDakIsR0FBRztBQUNILEVBQUMsR0FBRztBQThCSixJQUFJLGVBQWUsR0FBRztBQUN0QixFQUFFLEtBQUssRUFBRSxPQUFPO0FBQ2hCLEVBQUUsWUFBWSxFQUFFLGNBQWM7QUFDOUIsRUFBRSxPQUFPLEVBQUUsU0FBUztBQUNwQixFQUFFLFNBQVMsRUFBRSxXQUFXO0FBQ3hCLENBQUMsQ0FBQztBQU1GO0FBQ0EsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixJQUFJLEVBQUUsQ0FBQztBQUM3QztBQUNBLFNBQVMsYUFBYSxDQUFDLElBQUksRUFBRTtBQUM3QixFQUFFLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsU0FBUyxHQUFHLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztBQUMvRDtBQUNBLEVBQUUsSUFBSSxPQUFPLEVBQUU7QUFDZixJQUFJLE9BQU8sT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN0QyxHQUFHO0FBQ0gsQ0FBQztBQUNEO0FBQ0EsU0FBUyxNQUFNLENBQUMsR0FBRyxFQUFFO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBLEVBQUUsSUFBSSxHQUFHLEtBQUssRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFDO0FBQzlCLEVBQUUsSUFBSSxHQUFHLEtBQUssT0FBTyxFQUFFLE9BQU8sS0FBSyxDQUFDO0FBQ3BDLEVBQUUsSUFBSSxHQUFHLEtBQUssTUFBTSxFQUFFLE9BQU8sSUFBSSxDQUFDO0FBQ2xDLEVBQUUsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBQ0Q7QUFDQSxJQUFJLFFBQVEsSUFBSSxPQUFPLFFBQVEsQ0FBQyxhQUFhLEtBQUssVUFBVSxFQUFFO0FBQzlELEVBQUUsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLG9CQUFvQixFQUFFLGNBQWMsQ0FBQyxFQUFFLENBQUMsd0JBQXdCLEVBQUUsa0JBQWtCLENBQUMsRUFBRSxDQUFDLHVCQUF1QixFQUFFLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxZQUFZLENBQUMsRUFBRSxDQUFDLGdCQUFnQixFQUFFLFVBQVUsQ0FBQyxFQUFFLENBQUMsNkJBQTZCLEVBQUUsc0JBQXNCLENBQUMsRUFBRSxDQUFDLHdCQUF3QixFQUFFLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsMkJBQTJCLEVBQUUsb0JBQW9CLENBQUMsRUFBRSxDQUFDLDBCQUEwQixFQUFFLG9CQUFvQixDQUFDLEVBQUUsQ0FBQyx5QkFBeUIsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7QUFDeGdCLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUksRUFBRTtBQUNoQyxJQUFJLElBQUksS0FBSyxHQUFHLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZDLFFBQVEsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDdkIsUUFBUSxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCO0FBQ0EsSUFBSSxJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDMUM7QUFDQSxJQUFJLElBQUksR0FBRyxLQUFLLFNBQVMsSUFBSSxHQUFHLEtBQUssSUFBSSxFQUFFO0FBQzNDLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUN6QixLQUFLO0FBQ0wsR0FBRyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBQ0Q7QUFDQSxJQUFJLFFBQVEsR0FBRztBQUNmLEVBQUUsWUFBWSxFQUFFLHFCQUFxQjtBQUNyQyxFQUFFLGdCQUFnQixFQUFFLHlCQUF5QjtBQUM3QyxFQUFFLGNBQWMsRUFBRSxJQUFJO0FBQ3RCLEVBQUUsVUFBVSxFQUFFLElBQUk7QUFDbEIsRUFBRSxRQUFRLEVBQUUsSUFBSTtBQUNoQixFQUFFLG9CQUFvQixFQUFFLEtBQUs7QUFDN0IsRUFBRSxnQkFBZ0IsRUFBRSxJQUFJO0FBQ3hCLEVBQUUsY0FBYyxFQUFFLE9BQU87QUFDekIsRUFBRSxrQkFBa0IsRUFBRSxJQUFJO0FBQzFCLEVBQUUsa0JBQWtCLEVBQUUsS0FBSztBQUMzQixFQUFFLGdCQUFnQixFQUFFLElBQUk7QUFDeEIsQ0FBQyxDQUFDO0FBQ0Y7QUFDQSxJQUFJLE9BQU8sR0FBRyxhQUFhLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNuRDtBQUNBLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7QUFDOUQ7QUFDQSxJQUFJLE1BQU0sR0FBRyxhQUFhLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3hDO0FBQ0EsTUFBTSxDQUFDLGlCQUFpQixHQUFHLE1BQU0sQ0FBQztBQUNsQztBQUNBLElBQUksQ0FBQyxHQUFHLE1BQU0sSUFBSSxFQUFFLENBQUM7QUFDckIsSUFBSSxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMzRCxJQUFJLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDekUsSUFBSSxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ3ZFLElBQUksQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUN2RSxJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUN4QztBQUNBLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQztBQUNuQjtBQUNBLElBQUksUUFBUSxHQUFHLFNBQVMsUUFBUSxHQUFHO0FBQ25DLEVBQUUsUUFBUSxDQUFDLG1CQUFtQixDQUFDLGtCQUFrQixFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzdELEVBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNiLEVBQUUsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsRUFBRTtBQUM5QixJQUFJLE9BQU8sRUFBRSxFQUFFLENBQUM7QUFDaEIsR0FBRyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUFDRjtBQUNBLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQztBQUNuQjtBQUNBLElBQUksTUFBTSxFQUFFO0FBQ1osRUFBRSxNQUFNLEdBQUcsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLFFBQVEsR0FBRyxZQUFZLEdBQUcsZUFBZSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDMUcsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUN2RSxDQUFDO0FBYUQ7QUFDYSxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksT0FBTyxNQUFNLENBQUMsT0FBTyxLQUFLLFdBQVcsSUFBSSxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLFdBQVc7QUFDN0csT0FBTyxZQUFZLEtBQUssV0FBVyxHQUFHLFVBQVUsR0FBRyxhQUFhO0FBMFJwRixJQUFJLG9CQUFvQixHQUFHO0FBQzNCLEVBQUUsSUFBSSxFQUFFLEVBQUU7QUFDVixFQUFFLENBQUMsRUFBRSxDQUFDO0FBQ04sRUFBRSxDQUFDLEVBQUUsQ0FBQztBQUNOLEVBQUUsTUFBTSxFQUFFLENBQUM7QUFDWCxFQUFFLEtBQUssRUFBRSxLQUFLO0FBQ2QsRUFBRSxLQUFLLEVBQUUsS0FBSztBQUNkLENBQUMsQ0FBQztBQUtGLFNBQVMsU0FBUyxDQUFDLEdBQUcsRUFBRTtBQUN4QixFQUFFLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDdkIsSUFBSSxPQUFPO0FBQ1gsR0FBRztBQUNIO0FBQ0EsRUFBRSxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzlDLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDekMsRUFBRSxLQUFLLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztBQUN4QixFQUFFLElBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO0FBQzlDLEVBQUUsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDO0FBQ3pCO0FBQ0EsRUFBRSxLQUFLLElBQUksQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNyRCxJQUFJLElBQUksS0FBSyxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoQyxJQUFJLElBQUksT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxFQUFFLEVBQUUsV0FBVyxFQUFFLENBQUM7QUFDdEQ7QUFDQSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQ2pELE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQztBQUMxQixLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0EsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDakQsRUFBRSxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFDRCxJQUFJLE1BQU0sR0FBRyxnRUFBZ0UsQ0FBQztBQUM5RSxTQUFTLFlBQVksR0FBRztBQUN4QixFQUFFLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNoQixFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNkO0FBQ0EsRUFBRSxPQUFPLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRTtBQUNyQixJQUFJLEVBQUUsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN6QyxHQUFHO0FBQ0g7QUFDQSxFQUFFLE9BQU8sRUFBRSxDQUFDO0FBQ1osQ0FBQztBQThCRCxTQUFTLFVBQVUsQ0FBQyxHQUFHLEVBQUU7QUFDekIsRUFBRSxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzFJLENBQUM7QUFDRCxTQUFTLGNBQWMsQ0FBQyxVQUFVLEVBQUU7QUFDcEMsRUFBRSxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsRUFBRSxhQUFhLEVBQUU7QUFDNUUsSUFBSSxPQUFPLEdBQUcsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3RHLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNoQixDQUFDO0FBQ0QsU0FBUyxVQUFVLENBQUMsTUFBTSxFQUFFO0FBQzVCLEVBQUUsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHLEVBQUUsU0FBUyxFQUFFO0FBQ3BFLElBQUksT0FBTyxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUMzRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDVCxDQUFDO0FBQ0QsU0FBUyxxQkFBcUIsQ0FBQyxTQUFTLEVBQUU7QUFDMUMsRUFBRSxPQUFPLFNBQVMsQ0FBQyxJQUFJLEtBQUssb0JBQW9CLENBQUMsSUFBSSxJQUFJLFNBQVMsQ0FBQyxDQUFDLEtBQUssb0JBQW9CLENBQUMsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLEtBQUssb0JBQW9CLENBQUMsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxNQUFNLEtBQUssb0JBQW9CLENBQUMsTUFBTSxJQUFJLFNBQVMsQ0FBQyxLQUFLLElBQUksU0FBUyxDQUFDLEtBQUssQ0FBQztBQUNwTyxDQUFDO0FBQ0QsU0FBUyxlQUFlLENBQUMsSUFBSSxFQUFFO0FBQy9CLEVBQUUsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVM7QUFDaEMsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWM7QUFDMUMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztBQUNqQyxFQUFFLElBQUksS0FBSyxHQUFHO0FBQ2QsSUFBSSxTQUFTLEVBQUUsWUFBWSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEdBQUcsQ0FBQyxFQUFFLE9BQU8sQ0FBQztBQUMvRCxHQUFHLENBQUM7QUFDSixFQUFFLElBQUksY0FBYyxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2xHLEVBQUUsSUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLEVBQUUsSUFBSSxTQUFTLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLEVBQUUsSUFBSSxTQUFTLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzFKLEVBQUUsSUFBSSxXQUFXLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ2hFLEVBQUUsSUFBSSxLQUFLLEdBQUc7QUFDZCxJQUFJLFNBQVMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7QUFDekYsR0FBRyxDQUFDO0FBQ0osRUFBRSxJQUFJLElBQUksR0FBRztBQUNiLElBQUksU0FBUyxFQUFFLFlBQVksQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUM7QUFDaEUsR0FBRyxDQUFDO0FBQ0osRUFBRSxPQUFPO0FBQ1QsSUFBSSxLQUFLLEVBQUUsS0FBSztBQUNoQixJQUFJLEtBQUssRUFBRSxLQUFLO0FBQ2hCLElBQUksSUFBSSxFQUFFLElBQUk7QUFDZCxHQUFHLENBQUM7QUFDSixDQUFDO0FBdUJEO0FBQ0EsSUFBSSxTQUFTLEdBQUc7QUFDaEIsRUFBRSxDQUFDLEVBQUUsQ0FBQztBQUNOLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDTixFQUFFLEtBQUssRUFBRSxNQUFNO0FBQ2YsRUFBRSxNQUFNLEVBQUUsTUFBTTtBQUNoQixDQUFDLENBQUM7QUFDRjtBQUNBLFNBQVMsU0FBUyxDQUFDLFFBQVEsRUFBRTtBQUM3QixFQUFFLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUN2RjtBQUNBLEVBQUUsSUFBSSxRQUFRLENBQUMsVUFBVSxLQUFLLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxFQUFFO0FBQ2xFLElBQUksUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO0FBQ3ZDLEdBQUc7QUFDSDtBQUNBLEVBQUUsT0FBTyxRQUFRLENBQUM7QUFDbEIsQ0FBQztBQUNEO0FBQ0EsU0FBUyxPQUFPLENBQUMsUUFBUSxFQUFFO0FBQzNCLEVBQUUsSUFBSSxRQUFRLENBQUMsR0FBRyxLQUFLLEdBQUcsRUFBRTtBQUM1QixJQUFJLE9BQU8sUUFBUSxDQUFDLFFBQVEsQ0FBQztBQUM3QixHQUFHLE1BQU07QUFDVCxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN0QixHQUFHO0FBQ0gsQ0FBQztBQUNEO0FBQ0EsU0FBUyxlQUFlLEVBQUUsSUFBSSxFQUFFO0FBQ2hDLEVBQUUsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVE7QUFDOUIsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVU7QUFDbEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUk7QUFDdEIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUk7QUFDdEIsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLE1BQU07QUFDbEMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztBQUNqQyxFQUFFLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLO0FBQzVCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDM0IsRUFBRSxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSztBQUM1QixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQzNCLEVBQUUsSUFBSSxLQUFLLEdBQUcsZUFBZSxDQUFDO0FBQzlCLElBQUksU0FBUyxFQUFFLFNBQVM7QUFDeEIsSUFBSSxjQUFjLEVBQUUsU0FBUztBQUM3QixJQUFJLFNBQVMsRUFBRSxTQUFTO0FBQ3hCLEdBQUcsQ0FBQyxDQUFDO0FBQ0wsRUFBRSxJQUFJLFFBQVEsR0FBRztBQUNqQixJQUFJLEdBQUcsRUFBRSxNQUFNO0FBQ2YsSUFBSSxVQUFVLEVBQUUsYUFBYSxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUU7QUFDN0MsTUFBTSxJQUFJLEVBQUUsT0FBTztBQUNuQixLQUFLLENBQUM7QUFDTixHQUFHLENBQUM7QUFDSixFQUFFLElBQUksMkJBQTJCLEdBQUcsUUFBUSxDQUFDLFFBQVEsR0FBRztBQUN4RCxJQUFJLFFBQVEsRUFBRSxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUM7QUFDOUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNULEVBQUUsSUFBSSxjQUFjLEdBQUc7QUFDdkIsSUFBSSxHQUFHLEVBQUUsR0FBRztBQUNaLElBQUksVUFBVSxFQUFFLGFBQWEsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQztBQUM5QyxJQUFJLFFBQVEsRUFBRSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUM7QUFDdkMsTUFBTSxHQUFHLEVBQUUsUUFBUSxDQUFDLEdBQUc7QUFDdkIsTUFBTSxVQUFVLEVBQUUsYUFBYSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUM7QUFDcEUsS0FBSyxFQUFFLDJCQUEyQixDQUFDLENBQUMsQ0FBQztBQUNyQyxHQUFHLENBQUM7QUFDSixFQUFFLElBQUksY0FBYyxHQUFHO0FBQ3ZCLElBQUksR0FBRyxFQUFFLEdBQUc7QUFDWixJQUFJLFVBQVUsRUFBRSxhQUFhLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUM7QUFDOUMsSUFBSSxRQUFRLEVBQUUsQ0FBQyxjQUFjLENBQUM7QUFDOUIsR0FBRyxDQUFDO0FBQ0osRUFBRSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsSUFBSSxZQUFZLEVBQUUsQ0FBQyxDQUFDO0FBQ2hFLEVBQUUsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxjQUFjLElBQUksWUFBWSxFQUFFLENBQUMsQ0FBQztBQUNoRSxFQUFFLElBQUksT0FBTyxHQUFHO0FBQ2hCLElBQUksR0FBRyxFQUFFLE1BQU07QUFDZixJQUFJLFVBQVUsRUFBRSxhQUFhLENBQUMsRUFBRSxFQUFFLFNBQVMsRUFBRTtBQUM3QyxNQUFNLEVBQUUsRUFBRSxNQUFNO0FBQ2hCLE1BQU0sU0FBUyxFQUFFLGdCQUFnQjtBQUNqQyxNQUFNLGdCQUFnQixFQUFFLGdCQUFnQjtBQUN4QyxLQUFLLENBQUM7QUFDTixJQUFJLFFBQVEsRUFBRSxDQUFDLFFBQVEsRUFBRSxjQUFjLENBQUM7QUFDeEMsR0FBRyxDQUFDO0FBQ0osRUFBRSxJQUFJLElBQUksR0FBRztBQUNiLElBQUksR0FBRyxFQUFFLE1BQU07QUFDZixJQUFJLFFBQVEsRUFBRSxDQUFDO0FBQ2YsTUFBTSxHQUFHLEVBQUUsVUFBVTtBQUNyQixNQUFNLFVBQVUsRUFBRTtBQUNsQixRQUFRLEVBQUUsRUFBRSxNQUFNO0FBQ2xCLE9BQU87QUFDUCxNQUFNLFFBQVEsRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDO0FBQ2pDLEtBQUssRUFBRSxPQUFPLENBQUM7QUFDZixHQUFHLENBQUM7QUFDSixFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ3RCLElBQUksR0FBRyxFQUFFLE1BQU07QUFDZixJQUFJLFVBQVUsRUFBRSxhQUFhLENBQUM7QUFDOUIsTUFBTSxJQUFJLEVBQUUsY0FBYztBQUMxQixNQUFNLFdBQVcsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUM7QUFDOUMsTUFBTSxJQUFJLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDO0FBQ3ZDLEtBQUssRUFBRSxTQUFTLENBQUM7QUFDakIsR0FBRyxDQUFDLENBQUM7QUFDTCxFQUFFLE9BQU87QUFDVCxJQUFJLFFBQVEsRUFBRSxRQUFRO0FBQ3RCLElBQUksVUFBVSxFQUFFLFVBQVU7QUFDMUIsR0FBRyxDQUFDO0FBQ0osQ0FBQztBQUNEO0FBQ0EsU0FBUyxnQkFBZ0IsRUFBRSxJQUFJLEVBQUU7QUFDakMsRUFBRSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUTtBQUM5QixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVTtBQUNsQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSTtBQUN0QixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUztBQUNoQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQzNCLEVBQUUsSUFBSSxXQUFXLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZDO0FBQ0EsRUFBRSxJQUFJLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQzlCLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLFdBQVcsQ0FBQztBQUN0QyxHQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUkscUJBQXFCLENBQUMsU0FBUyxDQUFDLEVBQUU7QUFDeEMsSUFBSSxJQUFJLEtBQUssR0FBRyxlQUFlLENBQUM7QUFDaEMsTUFBTSxTQUFTLEVBQUUsU0FBUztBQUMxQixNQUFNLGNBQWMsRUFBRSxJQUFJLENBQUMsS0FBSztBQUNoQyxNQUFNLFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSztBQUMzQixLQUFLLENBQUMsQ0FBQztBQUNQLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQztBQUNsQixNQUFNLEdBQUcsRUFBRSxHQUFHO0FBQ2QsTUFBTSxVQUFVLEVBQUUsYUFBYSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDO0FBQ2hELE1BQU0sUUFBUSxFQUFFLENBQUM7QUFDakIsUUFBUSxHQUFHLEVBQUUsR0FBRztBQUNoQixRQUFRLFVBQVUsRUFBRSxhQUFhLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUM7QUFDbEQsUUFBUSxRQUFRLEVBQUUsQ0FBQztBQUNuQixVQUFVLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUc7QUFDNUIsVUFBVSxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRO0FBQ3RDLFVBQVUsVUFBVSxFQUFFLGFBQWEsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQztBQUN6RSxTQUFTLENBQUM7QUFDVixPQUFPLENBQUM7QUFDUixLQUFLLENBQUMsQ0FBQztBQUNQLEdBQUcsTUFBTTtBQUNULElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0IsR0FBRztBQUNIO0FBQ0EsRUFBRSxPQUFPO0FBQ1QsSUFBSSxRQUFRLEVBQUUsUUFBUTtBQUN0QixJQUFJLFVBQVUsRUFBRSxVQUFVO0FBQzFCLEdBQUcsQ0FBQztBQUNKLENBQUM7QUFDRDtBQUNBLFNBQVMsTUFBTSxFQUFFLElBQUksRUFBRTtBQUN2QixFQUFFLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRO0FBQzlCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJO0FBQ3RCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJO0FBQ3RCLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVO0FBQ2xDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNO0FBQzFCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7QUFDakM7QUFDQSxFQUFFLElBQUkscUJBQXFCLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDckUsSUFBSSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSztBQUMxQixRQUFRLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQzdCLElBQUksSUFBSSxNQUFNLEdBQUc7QUFDakIsTUFBTSxDQUFDLEVBQUUsS0FBSyxHQUFHLE1BQU0sR0FBRyxDQUFDO0FBQzNCLE1BQU0sQ0FBQyxFQUFFLEdBQUc7QUFDWixLQUFLLENBQUM7QUFDTixJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxVQUFVLENBQUMsYUFBYSxDQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUU7QUFDL0QsTUFBTSxrQkFBa0IsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsSUFBSSxDQUFDO0FBQ2pILEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDUixHQUFHO0FBQ0g7QUFDQSxFQUFFLE9BQU8sQ0FBQztBQUNWLElBQUksR0FBRyxFQUFFLEtBQUs7QUFDZCxJQUFJLFVBQVUsRUFBRSxVQUFVO0FBQzFCLElBQUksUUFBUSxFQUFFLFFBQVE7QUFDdEIsR0FBRyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBQ0Q7QUFDQSxTQUFTLFFBQVEsRUFBRSxJQUFJLEVBQUU7QUFDekIsRUFBRSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTTtBQUMxQixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUTtBQUM5QixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUTtBQUM5QixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVTtBQUNsQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQzNCLEVBQUUsSUFBSSxFQUFFLEdBQUcsTUFBTSxLQUFLLElBQUksR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsTUFBTSxDQUFDO0FBQy9HLEVBQUUsT0FBTyxDQUFDO0FBQ1YsSUFBSSxHQUFHLEVBQUUsS0FBSztBQUNkLElBQUksVUFBVSxFQUFFO0FBQ2hCLE1BQU0sS0FBSyxFQUFFLGdCQUFnQjtBQUM3QixLQUFLO0FBQ0wsSUFBSSxRQUFRLEVBQUUsQ0FBQztBQUNmLE1BQU0sR0FBRyxFQUFFLFFBQVE7QUFDbkIsTUFBTSxVQUFVLEVBQUUsYUFBYSxDQUFDLEVBQUUsRUFBRSxVQUFVLEVBQUU7QUFDaEQsUUFBUSxFQUFFLEVBQUUsRUFBRTtBQUNkLE9BQU8sQ0FBQztBQUNSLE1BQU0sUUFBUSxFQUFFLFFBQVE7QUFDeEIsS0FBSyxDQUFDO0FBQ04sR0FBRyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBQ0Q7QUFDQSxTQUFTLHFCQUFxQixDQUFDLE1BQU0sRUFBRTtBQUN2QyxFQUFFLElBQUksYUFBYSxHQUFHLE1BQU0sQ0FBQyxLQUFLO0FBQ2xDLE1BQU0sSUFBSSxHQUFHLGFBQWEsQ0FBQyxJQUFJO0FBQy9CLE1BQU0sSUFBSSxHQUFHLGFBQWEsQ0FBQyxJQUFJO0FBQy9CLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNO0FBQzVCLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRO0FBQ2hDLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTO0FBQ2xDLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNO0FBQzVCLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLO0FBQzFCLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNO0FBQzVCLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPO0FBQzlCLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLO0FBQzFCLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDLFNBQVM7QUFDMUMsTUFBTSxTQUFTLEdBQUcsaUJBQWlCLEtBQUssS0FBSyxDQUFDLEdBQUcsS0FBSyxHQUFHLGlCQUFpQixDQUFDO0FBQzNFO0FBQ0EsRUFBRSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksR0FBRyxJQUFJO0FBQ3JDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLO0FBQ3hCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDM0I7QUFDQSxFQUFFLElBQUksY0FBYyxHQUFHLE1BQU0sS0FBSyxLQUFLLENBQUM7QUFDeEMsRUFBRSxJQUFJLFVBQVUsR0FBRyxjQUFjLEdBQUcsRUFBRSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDeEYsRUFBRSxJQUFJLFNBQVMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEVBQUUsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFO0FBQ2xKLElBQUksT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUMzQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUU7QUFDekIsSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzQixHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNyQyxFQUFFLElBQUksT0FBTyxHQUFHO0FBQ2hCLElBQUksUUFBUSxFQUFFLEVBQUU7QUFDaEIsSUFBSSxVQUFVLEVBQUUsYUFBYSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsVUFBVSxFQUFFO0FBQ3BELE1BQU0sYUFBYSxFQUFFLE1BQU07QUFDM0IsTUFBTSxXQUFXLEVBQUUsUUFBUTtBQUMzQixNQUFNLE9BQU8sRUFBRSxTQUFTO0FBQ3hCLE1BQU0sTUFBTSxFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxJQUFJLEtBQUs7QUFDNUMsTUFBTSxPQUFPLEVBQUUsNEJBQTRCO0FBQzNDLE1BQU0sU0FBUyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDekQsS0FBSyxDQUFDO0FBQ04sR0FBRyxDQUFDO0FBQ0osRUFBRSxJQUFJLHNCQUFzQixHQUFHLGNBQWMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUc7QUFDcEYsSUFBSSxLQUFLLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBTSxHQUFHLEVBQUUsR0FBRyxNQUFNLEVBQUUsSUFBSSxDQUFDO0FBQ3hELEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDVDtBQUNBLEVBQUUsSUFBSSxTQUFTLEVBQUU7QUFDakIsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMzQyxHQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksS0FBSyxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO0FBQ25DLElBQUksR0FBRyxFQUFFLE9BQU87QUFDaEIsSUFBSSxVQUFVLEVBQUU7QUFDaEIsTUFBTSxFQUFFLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLFlBQVksRUFBRSxDQUFDO0FBQzdGLEtBQUs7QUFDTCxJQUFJLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQztBQUNyQixHQUFHLENBQUMsQ0FBQztBQUNMO0FBQ0EsRUFBRSxJQUFJLElBQUksR0FBRyxhQUFhLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRTtBQUN4QyxJQUFJLE1BQU0sRUFBRSxNQUFNO0FBQ2xCLElBQUksUUFBUSxFQUFFLFFBQVE7QUFDdEIsSUFBSSxJQUFJLEVBQUUsSUFBSTtBQUNkLElBQUksSUFBSSxFQUFFLElBQUk7QUFDZCxJQUFJLE1BQU0sRUFBRSxNQUFNO0FBQ2xCLElBQUksU0FBUyxFQUFFLFNBQVM7QUFDeEIsSUFBSSxNQUFNLEVBQUUsTUFBTTtBQUNsQixJQUFJLE1BQU0sRUFBRSxhQUFhLENBQUMsRUFBRSxFQUFFLHNCQUFzQixFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDbkUsR0FBRyxDQUFDLENBQUM7QUFDTDtBQUNBLEVBQUUsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUM7QUFDdkYsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVE7QUFDL0IsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztBQUNwQztBQUNBLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7QUFDM0IsRUFBRSxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztBQUMvQjtBQUNBLEVBQUUsSUFBSSxNQUFNLEVBQUU7QUFDZCxJQUFJLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzFCLEdBQUcsTUFBTTtBQUNULElBQUksT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEIsR0FBRztBQUNILENBQUM7QUE4RkQ7QUFDQSxJQUFJLE1BQU0sR0FBRyxTQUFTLElBQUksR0FBRyxFQUFFLENBQUM7QUFDaEM7QUFDUSxNQUFNLENBQUMsa0JBQWtCLElBQUksV0FBVyxJQUFJLFdBQVcsQ0FBQyxJQUFJLElBQUksV0FBVyxDQUFDLE9BQU8sR0FBRyxXQUFXLEdBQUc7QUFDNUcsRUFBRSxJQUFJLEVBQUUsTUFBTTtBQUNkLEVBQUUsT0FBTyxFQUFFLE1BQU07QUFDakIsRUFBRTtBQW1CRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLGFBQWEsR0FBRyxTQUFTLGFBQWEsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFO0FBQzlELEVBQUUsT0FBTyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUMvQixJQUFJLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDOUMsR0FBRyxDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksTUFBTSxHQUFHLFNBQVMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFO0FBQy9FLEVBQUUsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDakMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU07QUFDMUIsTUFBTSxRQUFRLEdBQUcsV0FBVyxLQUFLLFNBQVMsR0FBRyxhQUFhLENBQUMsRUFBRSxFQUFFLFdBQVcsQ0FBQyxHQUFHLEVBQUU7QUFDaEYsTUFBTSxDQUFDO0FBQ1AsTUFBTSxHQUFHO0FBQ1QsTUFBTSxNQUFNLENBQUM7QUFDYjtBQUNBLEVBQUUsSUFBSSxZQUFZLEtBQUssU0FBUyxFQUFFO0FBQ2xDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5QixHQUFHLE1BQU07QUFDVCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDVixJQUFJLE1BQU0sR0FBRyxZQUFZLENBQUM7QUFDMUIsR0FBRztBQUNIO0FBQ0EsRUFBRSxPQUFPLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDMUIsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUMxRCxHQUFHO0FBQ0g7QUFDQSxFQUFFLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMsQ0FBQztBQVlGO0FBQ0EsU0FBUyxXQUFXLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRTtBQUNwQyxFQUFFLElBQUksTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUN0RixFQUFFLElBQUksaUJBQWlCLEdBQUcsTUFBTSxDQUFDLFNBQVM7QUFDMUMsTUFBTSxTQUFTLEdBQUcsaUJBQWlCLEtBQUssS0FBSyxDQUFDLEdBQUcsS0FBSyxHQUFHLGlCQUFpQixDQUFDO0FBQzNFLEVBQUUsSUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHLEVBQUUsUUFBUSxFQUFFO0FBQ3RFLElBQUksSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDL0I7QUFDQSxJQUFJLElBQUksUUFBUSxFQUFFO0FBQ2xCLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3JDLEtBQUssTUFBTTtBQUNYLE1BQU0sR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUMzQixLQUFLO0FBQ0w7QUFDQSxJQUFJLE9BQU8sR0FBRyxDQUFDO0FBQ2YsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ1Q7QUFDQSxFQUFFLElBQUksT0FBTyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxVQUFVLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDbkUsSUFBSSxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDaEQsR0FBRyxNQUFNO0FBQ1QsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLGFBQWEsQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDN0YsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLElBQUksTUFBTSxLQUFLLEtBQUssRUFBRTtBQUN4QixJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDN0IsR0FBRztBQUNILENBQUM7QUFDRDtBQUNBLElBQUksTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNO0FBQzdCLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUM7QUFJNUIsSUFBSSxLQUFLLEdBQUcsU0FBUyxLQUFLLEdBQUc7QUFDN0IsRUFBRSxJQUFJLE1BQU0sR0FBRyxTQUFTLE1BQU0sQ0FBQyxPQUFPLEVBQUU7QUFDeEMsSUFBSSxPQUFPLE1BQU0sQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTtBQUN0RCxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztBQUM3QyxNQUFNLE9BQU8sQ0FBQyxDQUFDO0FBQ2YsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ1gsR0FBRyxDQUFDO0FBQ0o7QUFDQSxFQUFlLE1BQU0sQ0FBQyxVQUFVLEdBQUcsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO0FBQ3JELElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDakIsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDO0FBQzlCLEtBQUs7QUFDTDtBQUNBLElBQUksT0FBTyxHQUFHLENBQUM7QUFDZixHQUFHLENBQUMsQ0FBQztBQUNMLEVBQWdCLE1BQU0sQ0FBQyxVQUFVLEdBQUcsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO0FBQ3RELElBQUksSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVCLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLFFBQVEsQ0FBQztBQUM3QixJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBVSxRQUFRLEVBQUU7QUFDMUMsTUFBTSxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsUUFBUSxDQUFDO0FBQy9CLEtBQUssQ0FBQyxDQUFDO0FBQ1AsSUFBSSxPQUFPLEdBQUcsQ0FBQztBQUNmLEdBQUcsQ0FBQyxDQUFDO0FBQ0wsRUFBRSxJQUFJLFVBQVUsR0FBRyxLQUFLLElBQUksTUFBTSxDQUFDO0FBQ25DLEVBQWUsTUFBTSxDQUFDLEtBQUssRUFBRSxVQUFVLEdBQUcsRUFBRSxJQUFJLEVBQUU7QUFDbEQsSUFBSSxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUIsSUFBSSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekIsSUFBSSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0I7QUFDQSxJQUFJLElBQUksTUFBTSxLQUFLLEtBQUssSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUN6QyxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFDckIsS0FBSztBQUNMO0FBQ0EsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUc7QUFDbkIsTUFBTSxNQUFNLEVBQUUsTUFBTTtBQUNwQixNQUFNLFFBQVEsRUFBRSxRQUFRO0FBQ3hCLEtBQUssQ0FBQztBQUNOLElBQUksT0FBTyxHQUFHLENBQUM7QUFDZixHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDVCxDQUFDLENBQUM7QUFDRixLQUFLLEVBQUUsQ0FBQztBQWFSO0FBQ2UsU0FBUyxDQUFDLE9BQU87QUEyQmhDLFNBQVMsZUFBZSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0FBQ3BELEVBQUUsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUMvRCxJQUFJLE9BQU87QUFDWCxNQUFNLE1BQU0sRUFBRSxNQUFNO0FBQ3BCLE1BQU0sUUFBUSxFQUFFLFFBQVE7QUFDeEIsTUFBTSxJQUFJLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQztBQUNyQyxLQUFLLENBQUM7QUFDTixHQUFHO0FBQ0gsQ0FBQztBQUNEO0FBQ0EsU0FBUyxNQUFNLENBQUMsYUFBYSxFQUFFO0FBQy9CLEVBQUUsSUFBSSxHQUFHLEdBQUcsYUFBYSxDQUFDLEdBQUc7QUFDN0IsTUFBTSxxQkFBcUIsR0FBRyxhQUFhLENBQUMsVUFBVTtBQUN0RCxNQUFNLFVBQVUsR0FBRyxxQkFBcUIsS0FBSyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcscUJBQXFCO0FBQ2hGLE1BQU0scUJBQXFCLEdBQUcsYUFBYSxDQUFDLFFBQVE7QUFDcEQsTUFBTSxRQUFRLEdBQUcscUJBQXFCLEtBQUssS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLHFCQUFxQixDQUFDO0FBQy9FO0FBQ0EsRUFBRSxJQUFJLE9BQU8sYUFBYSxLQUFLLFFBQVEsRUFBRTtBQUN6QyxJQUFJLE9BQU8sVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3JDLEdBQUcsTUFBTTtBQUNULElBQUksT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3JJLEdBQUc7QUFDSCxDQUFDO0FBa1dEO0FBQ0EsU0FBUyxXQUFXLENBQUMsS0FBSyxFQUFFO0FBQzVCLEVBQUUsSUFBSSxDQUFDLElBQUksR0FBRyxhQUFhLENBQUM7QUFDNUIsRUFBRSxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssSUFBSSxrQkFBa0IsQ0FBQztBQUM3QyxFQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUM7QUFDakMsQ0FBQztBQUNELFdBQVcsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdkQsV0FBVyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0FBQ2hEO0FBQ0EsSUFBSSxJQUFJLEdBQUc7QUFDWCxFQUFFLElBQUksRUFBRSxjQUFjO0FBQ3RCLENBQUMsQ0FBQztBQUNGLElBQUksY0FBYyxHQUFHO0FBQ3JCLEVBQUUsYUFBYSxFQUFFLEtBQUs7QUFDdEIsRUFBRSxXQUFXLEVBQUUsWUFBWTtBQUMzQixFQUFFLEdBQUcsRUFBRSxJQUFJO0FBQ1gsQ0FBQyxDQUFDO0NBQ1M7QUFDWCxFQUFFLEdBQUcsRUFBRSxNQUFNO0FBQ2IsRUFBRSxVQUFVLEVBQUUsYUFBYSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUU7QUFDdEMsSUFBSSxDQUFDLEVBQUUsazRDQUFrNEM7QUFDejRDLEdBQUcsQ0FBQztBQUNKLEdBQUU7QUFDRjtBQUNBLElBQUksZUFBZSxHQUFHLGFBQWEsQ0FBQyxFQUFFLEVBQUUsY0FBYyxFQUFFO0FBQ3hELEVBQUUsYUFBYSxFQUFFLFNBQVM7QUFDMUIsQ0FBQyxDQUFDLENBQUM7QUFDSDtDQUNVO0FBQ1YsRUFBRSxHQUFHLEVBQUUsUUFBUTtBQUNmLEVBQUUsVUFBVSxFQUFFLGFBQWEsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFO0FBQ3RDLElBQUksRUFBRSxFQUFFLEtBQUs7QUFDYixJQUFJLEVBQUUsRUFBRSxLQUFLO0FBQ2IsSUFBSSxDQUFDLEVBQUUsSUFBSTtBQUNYLEdBQUcsQ0FBQztBQUNKLEVBQUUsUUFBUSxFQUFFLENBQUM7QUFDYixJQUFJLEdBQUcsRUFBRSxTQUFTO0FBQ2xCLElBQUksVUFBVSxFQUFFLGFBQWEsQ0FBQyxFQUFFLEVBQUUsY0FBYyxFQUFFO0FBQ2xELE1BQU0sYUFBYSxFQUFFLEdBQUc7QUFDeEIsTUFBTSxNQUFNLEVBQUUsb0JBQW9CO0FBQ2xDLEtBQUssQ0FBQztBQUNOLEdBQUcsRUFBRTtBQUNMLElBQUksR0FBRyxFQUFFLFNBQVM7QUFDbEIsSUFBSSxVQUFVLEVBQUUsYUFBYSxDQUFDLEVBQUUsRUFBRSxlQUFlLEVBQUU7QUFDbkQsTUFBTSxNQUFNLEVBQUUsY0FBYztBQUM1QixLQUFLLENBQUM7QUFDTixHQUFHLENBQUM7QUFDSixHQUFFO0NBQ2E7QUFDZixFQUFFLEdBQUcsRUFBRSxNQUFNO0FBQ2IsRUFBRSxVQUFVLEVBQUUsYUFBYSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUU7QUFDdEMsSUFBSSxPQUFPLEVBQUUsR0FBRztBQUNoQixJQUFJLENBQUMsRUFBRSxzU0FBc1M7QUFDN1MsR0FBRyxDQUFDO0FBQ0osRUFBRSxRQUFRLEVBQUUsQ0FBQztBQUNiLElBQUksR0FBRyxFQUFFLFNBQVM7QUFDbEIsSUFBSSxVQUFVLEVBQUUsYUFBYSxDQUFDLEVBQUUsRUFBRSxlQUFlLEVBQUU7QUFDbkQsTUFBTSxNQUFNLEVBQUUsY0FBYztBQUM1QixLQUFLLENBQUM7QUFDTixHQUFHLENBQUM7QUFDSixHQUFFO0NBQ2dCO0FBQ2xCLEVBQUUsR0FBRyxFQUFFLE1BQU07QUFDYixFQUFFLFVBQVUsRUFBRSxhQUFhLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRTtBQUN0QyxJQUFJLE9BQU8sRUFBRSxHQUFHO0FBQ2hCLElBQUksQ0FBQyxFQUFFLDZJQUE2STtBQUNwSixHQUFHLENBQUM7QUFDSixFQUFFLFFBQVEsRUFBRSxDQUFDO0FBQ2IsSUFBSSxHQUFHLEVBQUUsU0FBUztBQUNsQixJQUFJLFVBQVUsRUFBRSxhQUFhLENBQUMsRUFBRSxFQUFFLGVBQWUsRUFBRTtBQUNuRCxNQUFNLE1BQU0sRUFBRSxjQUFjO0FBQzVCLEtBQUssQ0FBQztBQUNOLEdBQUcsQ0FBQztBQUNKLEdBQUU7QUFLRjtBQUNlLFNBQVMsQ0FBQyxPQUFPO0FBQ2hDLFNBQVMsV0FBVyxDQUFDLElBQUksRUFBRTtBQUMzQixFQUFFLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0QixFQUFFLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2QjtBQUNBLEVBQUUsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDakMsTUFBTSxZQUFZLEdBQUcsY0FBYyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7QUFDbkQsTUFBTSxVQUFVLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25DO0FBQ0EsRUFBRSxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDckI7QUFDQSxFQUFFLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRTtBQUNqQyxJQUFJLE9BQU8sR0FBRztBQUNkLE1BQU0sR0FBRyxFQUFFLEdBQUc7QUFDZCxNQUFNLFVBQVUsRUFBRTtBQUNsQixRQUFRLEtBQUssRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUM7QUFDaEYsT0FBTztBQUNQLE1BQU0sUUFBUSxFQUFFLENBQUM7QUFDakIsUUFBUSxHQUFHLEVBQUUsTUFBTTtBQUNuQixRQUFRLFVBQVUsRUFBRTtBQUNwQixVQUFVLEtBQUssRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUM7QUFDdEYsVUFBVSxJQUFJLEVBQUUsY0FBYztBQUM5QixVQUFVLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBQzFCLFNBQVM7QUFDVCxPQUFPLEVBQUU7QUFDVCxRQUFRLEdBQUcsRUFBRSxNQUFNO0FBQ25CLFFBQVEsVUFBVSxFQUFFO0FBQ3BCLFVBQVUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQztBQUNwRixVQUFVLElBQUksRUFBRSxjQUFjO0FBQzlCLFVBQVUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFDMUIsU0FBUztBQUNULE9BQU8sQ0FBQztBQUNSLEtBQUssQ0FBQztBQUNOLEdBQUcsTUFBTTtBQUNULElBQUksT0FBTyxHQUFHO0FBQ2QsTUFBTSxHQUFHLEVBQUUsTUFBTTtBQUNqQixNQUFNLFVBQVUsRUFBRTtBQUNsQixRQUFRLElBQUksRUFBRSxjQUFjO0FBQzVCLFFBQVEsQ0FBQyxFQUFFLFVBQVU7QUFDckIsT0FBTztBQUNQLEtBQUssQ0FBQztBQUNOLEdBQUc7QUFDSDtBQUNBLEVBQUUsT0FBTztBQUNULElBQUksS0FBSyxFQUFFLElBQUk7QUFDZixJQUFJLEtBQUssRUFBRSxLQUFLO0FBQ2hCLElBQUksTUFBTSxFQUFFLE1BQU07QUFDbEIsSUFBSSxJQUFJLEVBQUUsT0FBTztBQUNqQixHQUFHLENBQUM7QUFDSixDQUFDO0FBc0JEO0FBQ2UsU0FBUyxDQUFDLE9BQU87QUFrUWhDO0FBQ0EsSUFBSSxVQUFVLEdBQUcsc2tRQUFza1EsQ0FBQztBQUN4bFE7QUFDQSxTQUFTLEdBQUcsSUFBSTtBQUNoQixFQUFFLElBQUksR0FBRyxHQUFHLHFCQUFxQixDQUFDO0FBQ2xDLEVBQUUsSUFBSSxHQUFHLEdBQUcseUJBQXlCLENBQUM7QUFDdEMsRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDO0FBQy9CLEVBQUUsSUFBSSxFQUFFLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDO0FBQ25DLEVBQUUsSUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDO0FBQ3JCO0FBQ0EsRUFBRSxJQUFJLEVBQUUsS0FBSyxHQUFHLElBQUksRUFBRSxLQUFLLEdBQUcsRUFBRTtBQUNoQyxJQUFJLElBQUksS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzFELElBQUksSUFBSSxjQUFjLEdBQUcsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDcEUsSUFBSSxJQUFJLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ25ELElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzNILEdBQUc7QUFDSDtBQUNBLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBQ0Q7QUFDQSxJQUFJLE9BQU87QUFDWDtBQUNBLFlBQVk7QUFDWixFQUFFLFNBQVMsT0FBTyxHQUFHO0FBQ3JCLElBQUksZUFBZSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNuQztBQUNBLElBQUksSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFDMUIsR0FBRztBQUNIO0FBQ0EsRUFBRSxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDekIsSUFBSSxHQUFHLEVBQUUsS0FBSztBQUNkLElBQUksS0FBSyxFQUFFLFNBQVMsR0FBRyxHQUFHO0FBQzFCLE1BQU0sSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCO0FBQ0EsTUFBTSxLQUFLLElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsV0FBVyxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRTtBQUN0RyxRQUFRLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUMsT0FBTztBQUNQO0FBQ0EsTUFBTSxJQUFJLFNBQVMsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNwRSxNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxFQUFFO0FBQ3BELFFBQVEsS0FBSyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxhQUFhLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2pHLFFBQVEsV0FBVyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN6QyxRQUFRLEtBQUssRUFBRSxDQUFDO0FBQ2hCLE9BQU8sQ0FBQyxDQUFDO0FBQ1QsS0FBSztBQUNMLEdBQUcsRUFBRTtBQUNMLElBQUksR0FBRyxFQUFFLE9BQU87QUFDaEIsSUFBSSxLQUFLLEVBQUUsU0FBUyxLQUFLLEdBQUc7QUFDNUIsTUFBTSxJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztBQUM1QixLQUFLO0FBQ0wsR0FBRyxFQUFFO0FBQ0wsSUFBSSxHQUFHLEVBQUUsa0JBQWtCO0FBQzNCLElBQUksS0FBSyxFQUFFLFNBQVMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRTtBQUM1RCxNQUFNLElBQUksVUFBVSxHQUFHLFVBQVUsQ0FBQyxNQUFNLElBQUksVUFBVSxDQUFDLFFBQVEsSUFBSSxVQUFVLENBQUMsSUFBSSxHQUFHO0FBQ3JGLFFBQVEsQ0FBQyxFQUFFLFVBQVU7QUFDckIsT0FBTyxHQUFHLFVBQVUsQ0FBQztBQUNyQixNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxFQUFFO0FBQ2pELFFBQVEsSUFBSSxlQUFlLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQztBQUM3QyxZQUFZLE1BQU0sR0FBRyxlQUFlLENBQUMsTUFBTTtBQUMzQyxZQUFZLFFBQVEsR0FBRyxlQUFlLENBQUMsUUFBUTtBQUMvQyxZQUFZLElBQUksR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDO0FBQ3hDLFFBQVEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3ZELFFBQVEsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUMzQyxPQUFPLENBQUMsQ0FBQztBQUNULE1BQU0sT0FBTyxTQUFTLENBQUM7QUFDdkIsS0FBSztBQUNMLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDTjtBQUNBLEVBQUUsT0FBTyxPQUFPLENBQUM7QUFDakIsQ0FBQyxFQUFFLENBQUM7QUFDSjtBQUNBLFNBQVMsU0FBUyxHQUFHO0FBQ3JCLEVBQUUsSUFBSSxNQUFNLENBQUMsVUFBVSxJQUFJLENBQUMsWUFBWSxFQUFFO0FBQzFDLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDckI7QUFDQSxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDeEIsR0FBRztBQUNILENBQUM7QUFDRDtBQUNBLFNBQVMsU0FBUyxDQUFDLEdBQUcsRUFBRSxlQUFlLEVBQUU7QUFDekMsRUFBRSxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxVQUFVLEVBQUU7QUFDekMsSUFBSSxHQUFHLEVBQUUsZUFBZTtBQUN4QixHQUFHLENBQUMsQ0FBQztBQUNMLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFO0FBQ3JDLElBQUksR0FBRyxFQUFFLFNBQVMsR0FBRyxHQUFHO0FBQ3hCLE1BQU0sT0FBTyxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRTtBQUMzQyxRQUFRLE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pCLE9BQU8sQ0FBQyxDQUFDO0FBQ1QsS0FBSztBQUNMLEdBQUcsQ0FBQyxDQUFDO0FBQ0wsRUFBRSxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUU7QUFDckMsSUFBSSxHQUFHLEVBQUUsU0FBUyxHQUFHLEdBQUc7QUFDeEIsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU87QUFDMUIsTUFBTSxJQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3BELE1BQU0sU0FBUyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO0FBQ3JDLE1BQU0sT0FBTyxTQUFTLENBQUMsUUFBUSxDQUFDO0FBQ2hDLEtBQUs7QUFDTCxHQUFHLENBQUMsQ0FBQztBQUNMLEVBQUUsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBQ0Q7QUFDQSxTQUFTLGtCQUFrQixDQUFDLFVBQVUsRUFBRTtBQUN4QyxFQUFFLElBQUksa0JBQWtCLEdBQUcsVUFBVSxDQUFDLE1BQU07QUFDNUMsTUFBTSxNQUFNLEdBQUcsa0JBQWtCLEtBQUssS0FBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLGtCQUFrQjtBQUN4RSxNQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDO0FBQ3JDLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPO0FBQ3hCLEVBQUUsT0FBTyxlQUFlLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLElBQUksZUFBZSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3ZILENBQUM7QUFDRDtBQUNBLFNBQVMsWUFBWSxDQUFDLElBQUksRUFBRTtBQUM1QixFQUFFLE9BQU8sVUFBVSxtQkFBbUIsRUFBRTtBQUN4QyxJQUFJLElBQUksTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUN4RixJQUFJLElBQUksY0FBYyxHQUFHLENBQUMsbUJBQW1CLElBQUksRUFBRSxFQUFFLElBQUksR0FBRyxtQkFBbUIsR0FBRyxrQkFBa0IsQ0FBQyxtQkFBbUIsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUNoSSxJQUFJLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDM0I7QUFDQSxJQUFJLElBQUksSUFBSSxFQUFFO0FBQ2QsTUFBTSxJQUFJLEdBQUcsQ0FBQyxJQUFJLElBQUksRUFBRSxFQUFFLElBQUksR0FBRyxJQUFJLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZFLEtBQUs7QUFDTDtBQUNBLElBQUksT0FBTyxJQUFJLENBQUMsY0FBYyxFQUFFLGFBQWEsQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFO0FBQzFELE1BQU0sSUFBSSxFQUFFLElBQUk7QUFDaEIsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNSLEdBQUcsQ0FBQztBQUNKLENBQUM7QUFDRDtBQUNBLElBQUksT0FBTyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7QUFNNUIsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDO0FBeUR6QixJQUFJLElBQUksR0FBRyxZQUFZLENBQUMsVUFBVSxjQUFjLEVBQUU7QUFDbEQsRUFBRSxJQUFJLE1BQU0sR0FBRyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDdEYsRUFBRSxJQUFJLGlCQUFpQixHQUFHLE1BQU0sQ0FBQyxTQUFTO0FBQzFDLE1BQU0sU0FBUyxHQUFHLGlCQUFpQixLQUFLLEtBQUssQ0FBQyxHQUFHLG9CQUFvQixHQUFHLGlCQUFpQjtBQUN6RixNQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsTUFBTTtBQUNwQyxNQUFNLE1BQU0sR0FBRyxjQUFjLEtBQUssS0FBSyxDQUFDLEdBQUcsS0FBSyxHQUFHLGNBQWM7QUFDakUsTUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLElBQUk7QUFDaEMsTUFBTSxJQUFJLEdBQUcsWUFBWSxLQUFLLEtBQUssQ0FBQyxHQUFHLElBQUksR0FBRyxZQUFZO0FBQzFELE1BQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxNQUFNO0FBQ3BDLE1BQU0sTUFBTSxHQUFHLGNBQWMsS0FBSyxLQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsY0FBYztBQUNoRSxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsS0FBSztBQUNsQyxNQUFNLEtBQUssR0FBRyxhQUFhLEtBQUssS0FBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLGFBQWE7QUFDN0QsTUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLE9BQU87QUFDdEMsTUFBTSxPQUFPLEdBQUcsZUFBZSxLQUFLLEtBQUssQ0FBQyxHQUFHLElBQUksR0FBRyxlQUFlO0FBQ25FLE1BQU0sZUFBZSxHQUFHLE1BQU0sQ0FBQyxPQUFPO0FBQ3RDLE1BQU0sT0FBTyxHQUFHLGVBQWUsS0FBSyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsZUFBZTtBQUNqRSxNQUFNLGtCQUFrQixHQUFHLE1BQU0sQ0FBQyxVQUFVO0FBQzVDLE1BQU0sVUFBVSxHQUFHLGtCQUFrQixLQUFLLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxrQkFBa0I7QUFDMUUsTUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLE1BQU07QUFDcEMsTUFBTSxNQUFNLEdBQUcsY0FBYyxLQUFLLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxjQUFjLENBQUM7QUFDL0QsRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLE9BQU87QUFDOUIsRUFBRSxJQUFJLE1BQU0sR0FBRyxjQUFjLENBQUMsTUFBTTtBQUNwQyxNQUFNLFFBQVEsR0FBRyxjQUFjLENBQUMsUUFBUTtBQUN4QyxNQUFNLElBQUksR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDO0FBQ2pDLEVBQUUsT0FBTyxTQUFTLENBQUMsYUFBYSxDQUFDO0FBQ2pDLElBQUksSUFBSSxFQUFFLE1BQU07QUFDaEIsR0FBRyxFQUFFLGNBQWMsQ0FBQyxFQUFFLFlBQVk7QUFDbEMsSUFBSSxTQUFTLEVBQUUsQ0FBQztBQUNoQjtBQUNBLElBQUksSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFO0FBQ3pCLE1BQU0sSUFBSSxLQUFLLEVBQUU7QUFDakIsUUFBUSxVQUFVLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLFlBQVksRUFBRSxDQUFDLENBQUM7QUFDeEgsT0FBTyxNQUFNO0FBQ2IsUUFBUSxVQUFVLENBQUMsYUFBYSxDQUFDLEdBQUcsTUFBTSxDQUFDO0FBQzNDLFFBQVEsVUFBVSxDQUFDLFdBQVcsQ0FBQyxHQUFHLE9BQU8sQ0FBQztBQUMxQyxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0EsSUFBSSxPQUFPLHFCQUFxQixDQUFDO0FBQ2pDLE1BQU0sS0FBSyxFQUFFO0FBQ2IsUUFBUSxJQUFJLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBQztBQUMvQixRQUFRLElBQUksRUFBRSxJQUFJLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRztBQUM5QyxVQUFVLEtBQUssRUFBRSxLQUFLO0FBQ3RCLFVBQVUsS0FBSyxFQUFFLElBQUk7QUFDckIsVUFBVSxNQUFNLEVBQUUsSUFBSTtBQUN0QixVQUFVLElBQUksRUFBRSxFQUFFO0FBQ2xCLFNBQVM7QUFDVCxPQUFPO0FBQ1AsTUFBTSxNQUFNLEVBQUUsTUFBTTtBQUNwQixNQUFNLFFBQVEsRUFBRSxRQUFRO0FBQ3hCLE1BQU0sU0FBUyxFQUFFLGFBQWEsQ0FBQyxFQUFFLEVBQUUsb0JBQW9CLEVBQUUsU0FBUyxDQUFDO0FBQ25FLE1BQU0sTUFBTSxFQUFFLE1BQU07QUFDcEIsTUFBTSxLQUFLLEVBQUUsS0FBSztBQUNsQixNQUFNLE1BQU0sRUFBRSxNQUFNO0FBQ3BCLE1BQU0sT0FBTyxFQUFFLE9BQU87QUFDdEIsTUFBTSxLQUFLLEVBQUU7QUFDYixRQUFRLFVBQVUsRUFBRSxVQUFVO0FBQzlCLFFBQVEsTUFBTSxFQUFFLE1BQU07QUFDdEIsUUFBUSxPQUFPLEVBQUUsT0FBTztBQUN4QixPQUFPO0FBQ1AsS0FBSyxDQUFDLENBQUM7QUFDUCxHQUFHLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQzs7TUMxeEVXLE1BQU07SUFFZixZQUFZLEtBQVU7UUFDbEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7S0FDdEI7SUFDRCxLQUFLLENBQUMsS0FBZTtRQUNqQixJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxFQUNyQixLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFDbEIsTUFBTSxHQUFHLEVBQUUsRUFDWCxLQUFLLEdBQUcsRUFBRSxFQUNWLEtBQUssR0FBRyxDQUFDLENBQUM7UUFFZCxPQUFPLEtBQUssR0FBRyxNQUFNLEVBQUU7WUFDbkIsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7WUFFM0IsUUFBUSxLQUFLLENBQUMsSUFBSTtnQkFDZCxLQUFLLEdBQUc7b0JBQ0osS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDckIsTUFBTTtnQkFDVixLQUFLLEdBQUc7b0JBQ0osT0FBTyxLQUFLLENBQUMsTUFBTSxFQUFFO3dCQUNqQixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7d0JBQzFCLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxHQUFHOzRCQUFFLE1BQU07OzRCQUN6QixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO3FCQUMzQjtvQkFFRCxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssR0FBRzt3QkFDbEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO29CQUMvQyxNQUFNO2dCQUNWO29CQUNJLElBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7d0JBQ2xDLE9BQU8sS0FBSyxDQUFDLE1BQU0sRUFBRTs0QkFDakIsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUUxQixJQUFJLFVBQVUsQ0FBQyxJQUFJLEtBQUssR0FBRztnQ0FBRSxNQUFNOzRCQUVuQyxJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUM1QixVQUFVLEdBQUcsUUFBUSxDQUFDLFVBQVUsRUFDaEMsV0FBVyxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDOzRCQUVwRCxJQUNJLFVBQVUsR0FBRyxXQUFXO2lDQUN2QixVQUFVLEtBQUssV0FBVztvQ0FDdkIsUUFBUSxDQUFDLGFBQWEsS0FBSyxPQUFPLENBQUM7Z0NBRXZDLE1BQU07O2dDQUNMLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7eUJBQ25DO3dCQUVELEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7cUJBQ3hCOzt3QkFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ2pDO1NBQ0o7UUFFRCxPQUFPLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDakIsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzFCLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxHQUFHO2dCQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7O2dCQUN0QyxNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7U0FDbkQ7UUFFRCxPQUFPLE1BQU0sQ0FBQztLQUNqQjs7O0FDL0RFLFNBQVMsTUFBTSxDQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUU7QUFDdkMsSUFBSSxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxRixJQUFJLE9BQU8sUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLFlBQVksRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUM3RixDQUFDO0FBQ0QsU0FBUyxPQUFPLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUU7QUFDN0MsSUFBSSxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxHQUFHLEdBQUcsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdEUsSUFBSSxJQUFJLE9BQU8sR0FBRyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDMUM7QUFDQTtBQUNBLElBQUksSUFBSSxRQUFRO0FBQ2hCLFFBQVEsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDakQsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUM1QyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxPQUFPLENBQUM7QUFDMUI7QUFDQSxJQUFJLE9BQU8sTUFBTSxDQUFDO0FBQ2xCLElBQUksU0FBUyxPQUFPLENBQUMsR0FBRyxJQUFJLEVBQUU7QUFDOUI7QUFDQSxRQUFRLElBQUksT0FBTyxLQUFLLFFBQVEsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssT0FBTztBQUMzRCxZQUFZLE1BQU0sRUFBRSxDQUFDO0FBQ3JCLFFBQVEsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN6QyxLQUFLO0FBQ0wsSUFBSSxTQUFTLE1BQU0sR0FBRztBQUN0QjtBQUNBLFFBQVEsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssT0FBTyxFQUFFO0FBQ3JDLFlBQVksSUFBSSxNQUFNO0FBQ3RCLGdCQUFnQixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFDO0FBQ3ZDO0FBQ0EsZ0JBQWdCLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ25DLFNBQVM7QUFDVCxRQUFRLElBQUksT0FBTyxLQUFLLFFBQVE7QUFDaEMsWUFBWSxPQUFPO0FBQ25CO0FBQ0EsUUFBUSxPQUFPLEdBQUcsUUFBUSxDQUFDO0FBQzNCLFFBQVEsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxJQUFJLFFBQVEsQ0FBQyxDQUFDO0FBQzdELEtBQUs7QUFDTDs7QUNuQ08sTUFBTSxTQUFTLEdBQ2xCLHlIQUF5SCxDQUFDO0FBQ3ZILE1BQU0sV0FBVyxHQUNwQiw0RkFBNEYsQ0FBQztBQUMxRixNQUFNLGFBQWEsR0FDdEIsb0VBQW9FLENBQUM7QUFDbEUsTUFBTSxVQUFVLEdBQUcsa0JBQWtCLENBQUM7QUFDdEMsTUFBTSxVQUFVLEdBQ25CLDhIQUE4SCxDQUFDO0FBQzVILE1BQU0sYUFBYSxHQUN0QiwySEFBMkgsQ0FBQztBQUV6SCxNQUFNLGlCQUFpQixHQUMxQixnRUFBZ0UsQ0FBQztBQUU5RCxNQUFNLGVBQWUsR0FBRyxrQkFBa0IsQ0FBQztBQUUzQyxNQUFNLGVBQWUsR0FBRyxrQkFBa0I7O0FDeUJqRDs7Ozs7Ozs7O1NBU2dCLGNBQWMsQ0FDMUIsR0FBd0MsRUFDeEMsS0FBYSxFQUNiLEtBQXVDOztJQUd2QyxJQUFJLFFBQVEsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDOztJQUUvQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDO1FBQzFCLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUMzQixDQUFDLENBQUM7O0lBRUgsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDMUI7O01DdENzQixXQUFZLFNBQVFBLGVBQU07SUEyQjVDLFlBQ1csTUFBd0IsRUFDeEIsUUFBZ0IsRUFDaEIsT0FBaUI7UUFFeEIsS0FBSyxFQUFFLENBQUM7UUFKRCxXQUFNLEdBQU4sTUFBTSxDQUFrQjtRQUN4QixhQUFRLEdBQVIsUUFBUSxDQUFRO1FBQ2hCLFlBQU8sR0FBUCxPQUFPLENBQVU7UUExQjVCLGdCQUFXLEdBQUcsU0FBUyxDQUFDO1lBQ3BCLEdBQUcsRUFBRSxhQUFhO1lBQ2xCLElBQUksRUFBRTtnQkFDRixxQkFBcUIsRUFBRSxLQUFLO2dCQUM1QixXQUFXLEVBQUUsSUFBSSxDQUFDLFFBQVE7YUFDN0I7U0FDSixDQUFDLENBQUM7UUFDSCxhQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQXNCeEQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUM7WUFDcEMsR0FBRyxFQUFFLG9CQUFvQjtTQUM1QixDQUFDLENBQUM7UUFDSEMsZ0JBQU8sQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFFL0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFbkQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUMxQztJQTdCRCxVQUFVO1FBQ04sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxvQkFBb0I7WUFBRSxPQUFPO1FBQ2xELElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDO1lBQ3RCLFlBQVksRUFBRSxJQUFJLENBQUMsT0FBTztTQUM3QixDQUFDLENBQUM7S0FDTjtJQUNELGdCQUFnQixDQUFDLEdBQVcsRUFBRSxHQUFXO1FBQ3JDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztLQUM1RDtJQUNLLE1BQU07O1lBQ1IsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ2xCLE1BQU0sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ3RCO0tBQUE7SUFtQkssT0FBTyxDQUFDLEdBQWU7OztZQUN6QixHQUFHLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDdEIsR0FBRyxDQUFDLHdCQUF3QixFQUFFLENBQUM7WUFDL0IsSUFBSSxNQUFBLE1BQU0sQ0FBQyxZQUFZLEVBQUUsMENBQUUsV0FBVyxFQUFFO2dCQUNwQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUNyQjs7S0FDSjtDQUlKO01BRXFCLGFBQWlCLFNBQVEsV0FBVztDQUl6RDtNQUVxQixpQkFBcUIsU0FBUSxhQUFnQjtJQU0vRCxZQUNXLE1BQXdCLEVBQ3hCLFFBQWdCLEVBQ2hCLE1BQWMsRUFDZCxNQUFjO1FBRXJCLEtBQUssQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUwzQixXQUFNLEdBQU4sTUFBTSxDQUFrQjtRQUN4QixhQUFRLEdBQVIsUUFBUSxDQUFRO1FBQ2hCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBSXJCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNmLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNsQjtJQUVLLE9BQU87O1lBQ1QsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQzFELElBQUksQ0FBQyxJQUFJLEVBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FDZCxDQUFDO1lBQ0YsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxZQUFZQyxjQUFLLENBQUM7Z0JBQzNDLE1BQU0sSUFBSSxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUU1QyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNsQixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztTQUM5QjtLQUFBO0lBR0QsbUJBQW1CO1FBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQ3JCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQU8sSUFBSTtZQUMxQyxJQUFJLElBQUksS0FBSyxJQUFJLENBQUMsSUFBSTtnQkFBRSxPQUFPO1lBQy9CLE1BQU0sSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1NBQzNCLENBQUEsQ0FBQyxDQUNMLENBQUM7S0FDTDs7O0FDbEhMLE1BQU0sVUFBVTtJQW1DWixZQUFZLElBQVksRUFBUyxNQUFjOztRQUFkLFdBQU0sR0FBTixNQUFNLENBQVE7UUFqQy9DLGNBQVMsR0FBMEIsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUs3QyxxQkFBZ0IsR0FBWSxJQUFJLENBQUM7UUFDakMsV0FBTSxHQUFZLEtBQUssQ0FBQztRQUN4QixlQUFVLEdBQWtCLEVBQUUsQ0FBQztRQTJCM0IsSUFBSSxDQUFDLHNDQUFzQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNwRCxNQUFNLElBQUksS0FBSyxDQUFDLCtDQUErQyxDQUFDLENBQUM7U0FDcEU7UUFDRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXJDLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDM0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDbkIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztTQUNqQztRQUNELElBQUksR0FBRyxLQUFLLEVBQUUsR0FBRyxHQUFHLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQ2hELGtEQUFrRCxDQUNyRCxJQUFJLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEMsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ3pCLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNaO1FBQ0QsSUFBSSxHQUFHLEtBQUssR0FBRztZQUFFLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDM0IsSUFBSSxHQUFHLEtBQUssR0FBRyxFQUFFO1lBQ2IsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNSLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNaO1FBQ0QsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzNCLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQzNCO1FBRUQsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUV4RSxJQUFJLENBQUMsVUFBVSxHQUFHLE1BQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLG1DQUFJLEVBQUUsQ0FBQztRQUVqRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxDQUNsQixDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDdEIsT0FBTztnQkFDSCxDQUFDO2dCQUNEO29CQUNJLE1BQU0sRUFBRSxJQUFJO29CQUNaLEtBQUssRUFBRSxDQUFDO29CQUNSLE9BQU8sRUFBRSxHQUFHLENBQUMsRUFBRTtvQkFDZixTQUFTLEVBQUUsSUFBSSxHQUFHLEVBQUU7aUJBQ3ZCO2FBQ0osQ0FBQztTQUNMLENBQUMsQ0FDTCxDQUFDO0tBQ0w7SUFuRUQsSUFBSSxJQUFJO1FBQ0osT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUMzQjtJQUVELElBQUksTUFBTTtRQUNOLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNiLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM1QjtRQUNELE1BQU0sT0FBTyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQyxLQUN4RCxNQUFNLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FDckIsQ0FBQztRQUNGLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUM3QztJQUNELElBQUksT0FBTztRQUNQLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNiLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDM0I7UUFDRCxPQUFPLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7YUFDdkIsR0FBRyxDQUNBLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxLQUN2QixHQUFHLE9BQU8sR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQzdDO2FBQ0EsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7S0FDdEI7SUE2Q0QsT0FBTyxDQUFDLE9BQWUsQ0FBQztRQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQ3hCLElBQUlDLGVBQU0sQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO1lBQ3hELE9BQU87U0FDVjs7Ozs7UUFNRCxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQzthQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO2FBQ3ZDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7YUFDL0IsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDYixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN6QyxRQUFRLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztZQUN4QixRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM1QixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLG9CQUFPLFFBQVEsRUFBRyxDQUFDO1NBQzVDLENBQUMsQ0FBQztLQUNWO0lBQ0QsUUFBUSxDQUFDLE9BQWUsQ0FBQztRQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQ3hCLElBQUlBLGVBQU0sQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO1lBQ3hELE9BQU87U0FDVjs7Ozs7UUFLRCxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQzthQUNaLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO2FBQ3ZDLEtBQUssQ0FBQyxJQUFJLENBQUM7YUFDWCxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUNiLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3pDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1lBQ3hCLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssb0JBQU8sUUFBUSxFQUFHLENBQUM7U0FDNUMsQ0FBQyxDQUFDO0tBQ1Y7SUFDRCxNQUFNLENBQUMsS0FBYSxFQUFFLFlBQTJCO1FBQzdDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDeEIsSUFBSUEsZUFBTSxDQUFDLDJDQUEyQyxDQUFDLENBQUM7WUFDeEQsT0FBTztTQUNWOzs7Ozs7OztRQVFELElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFO1lBQ3RCLFlBQVksQ0FBQyxJQUFJLENBQUM7Z0JBQ2QsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRzthQUMzQixDQUFDLENBQUM7U0FDTjs7OztRQUtELElBQUksQ0FBQyxHQUFHLENBQUMsRUFDTCxRQUFRLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsS0FDOUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQzNDLENBQUM7UUFDTixPQUNJLENBQUMsR0FBRyxLQUFLO1lBQ1QsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxLQUMxQixJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FDM0MsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUNkO1lBQ0UsQ0FBQyxFQUFFLENBQUM7WUFDSixRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7Z0JBQ2xCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN4QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FDOUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQ2QsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQ2pCLENBQUM7YUFDTCxDQUFDLENBQUM7U0FDTjtRQUVELFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7WUFDNUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ2xDLENBQUMsQ0FBQztLQUNOO0lBQ0QsaUJBQWlCLENBQUMsS0FBYSxFQUFFLFlBQTJCO1FBQ3hELElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDeEIsSUFBSUEsZUFBTSxDQUFDLDJDQUEyQyxDQUFDLENBQUM7WUFDeEQsT0FBTztTQUNWOzs7Ozs7OztRQVNELElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFO1lBQ3RCLFlBQVksQ0FBQyxJQUFJLENBQUM7Z0JBQ2QsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRzthQUMzQixDQUFDLENBQUM7U0FDTjs7OztRQUtELElBQUksQ0FBQyxHQUFHLENBQUMsRUFDTCxTQUFTLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsS0FDL0MsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQzNDLENBQUM7UUFFTixTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDO1lBQzdCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3BFLENBQUMsRUFBRSxDQUFDO1lBQ0osS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDekIsS0FBSyxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUM7WUFDdkIsS0FBSyxDQUFDLE9BQU8sR0FBRyxHQUFHLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNqQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDL0IsT0FBTyxDQUFDLEdBQUcsS0FBSyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxFQUFFO2dCQUM1RCxDQUFDLEVBQUUsQ0FBQztnQkFDSixPQUFPLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2hFLEtBQUssQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDO2dCQUN2QixLQUFLLENBQUMsT0FBTyxHQUFHLEdBQUcsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNqQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDbEM7U0FDSixDQUFDLENBQUM7S0FDTjtJQUNELE9BQU8sQ0FBQyxLQUFhLEVBQUUsWUFBMkI7UUFDOUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUN4QixJQUFJQSxlQUFNLENBQUMsMkNBQTJDLENBQUMsQ0FBQztZQUN4RCxPQUFPO1NBQ1Y7Ozs7Ozs7O1FBU0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUU7WUFDdEIsWUFBWSxDQUFDLElBQUksQ0FBQztnQkFDZCxRQUFRLEVBQUUsR0FBRztnQkFDYixRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHO2FBQzNCLENBQUMsQ0FBQztTQUNOOzs7O1FBS0QsSUFBSSxTQUFTLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsS0FDbkQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQzNDLENBQUM7O1FBR0YsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDOztRQUdqQixTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDOztZQUUzQixJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDOztZQUUxQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Ozs7WUFLVixPQUFPLENBQUMsR0FBRyxLQUFLLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLEVBQUU7Z0JBQzVELElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BELFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUU1QixPQUFPLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7O2dCQUdoRSxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLEdBQUcsUUFBUSxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQ2pELE1BQU0sRUFBRSxJQUFJO29CQUNaLEtBQUssRUFBRSxPQUFPO29CQUNkLE9BQU8sRUFBRSxHQUFHLE9BQU8sRUFBRTtvQkFDckIsU0FBUyxFQUFFLElBQUksR0FBRyxFQUFFO2lCQUN2QixDQUFDLENBQUM7Z0JBQ0gsQ0FBQyxFQUFFLENBQUM7YUFDUDs7WUFFRCxRQUFRLElBQUksQ0FBQyxDQUFDO1NBQ2pCLENBQUMsQ0FBQztLQUNOO0lBQ0QsS0FBSztRQUNELElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNiLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDOUI7UUFDRCxPQUFPLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQzlCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUN4RCxDQUFDO0tBQ0w7SUFDRCxJQUFJOztRQUNBLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUMxQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxDQUNsQixDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDZixPQUFPO2dCQUNILENBQUM7Z0JBQ0Q7b0JBQ0ksTUFBTSxFQUFFLElBQUk7b0JBQ1osS0FBSyxFQUFFLENBQUM7b0JBQ1IsT0FBTyxFQUFFLEdBQUcsQ0FBQyxFQUFFO29CQUNmLFNBQVMsRUFBRSxJQUFJLEdBQUcsRUFBRTtpQkFDdkI7YUFDSixDQUFDO1NBQ0wsQ0FBQyxDQUNMLENBQUM7UUFFRixLQUFLLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUN6QyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztTQUN0QztRQUNELElBQUksTUFBQSxJQUFJLENBQUMsVUFBVSwwQ0FBRSxNQUFNO1lBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBRXBELE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFDRCxlQUFlO1FBQ1gsS0FBSyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDdEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQy9CLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxRQUFRLEtBQUssSUFBSSxJQUFJLFFBQVEsS0FBSyxJQUFJLENBQzNELENBQUM7WUFDRixJQUFJLE1BQU0sRUFBRTtnQkFDUixJQUFJLE1BQU0sQ0FBQyxLQUFLLEtBQUssTUFBTSxDQUFDLFFBQVEsRUFBRTtvQkFDbEMsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDbEIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQzFCLFNBQVM7aUJBQ1o7YUFDSjtZQUVELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFakUsSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDUixNQUFNLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQzthQUN6QjtpQkFBTTtnQkFDSCxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDMUIsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7YUFDcEI7U0FDSjtLQUNKO0lBQ0QsYUFBYSxDQUFDLElBQVksRUFBRSxRQUFrQjtRQUMxQyxRQUFRLElBQUk7WUFDUixLQUFLLElBQUksRUFBRTtnQkFDUCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDN0IsTUFBTTthQUNUO1lBQ0QsS0FBSyxJQUFJLEVBQUU7Z0JBQ1AsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzVCLE1BQU07YUFDVDtZQUNELEtBQUssR0FBRyxFQUFFO2dCQUNOLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQ25ELE1BQU07YUFDVDtZQUNELEtBQUssSUFBSSxFQUFFO2dCQUNQLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDN0QsTUFBTTthQUNUO1lBQ0QsS0FBSyxHQUFHLEVBQUU7Z0JBQ04sSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDbEQsTUFBTTthQUNUO1NBR0o7S0FDSjtJQUVPLGNBQWMsQ0FDbEIsS0FBYSxFQUNiLFVBQXlCO1FBRXpCLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTTtZQUFFLE9BQU8sS0FBSyxDQUFDO1FBQ3BELE9BQU8sVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRTtZQUMxQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDL0MsT0FBTyxLQUFLLENBQUM7YUFDaEI7WUFDRCxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUM7WUFDbkIsUUFBUSxRQUFRO2dCQUNaLEtBQUssR0FBRztvQkFDSixNQUFNLEdBQUcsS0FBSyxLQUFLLFFBQVEsQ0FBQztvQkFDNUIsTUFBTTtnQkFDVixLQUFLLElBQUksQ0FBQztnQkFDVixLQUFLLElBQUk7b0JBQ0wsTUFBTSxHQUFHLEtBQUssS0FBSyxRQUFRLENBQUM7b0JBQzVCLE1BQU07Z0JBQ1YsS0FBSyxHQUFHO29CQUNKLE1BQU0sR0FBRyxLQUFLLEdBQUcsUUFBUSxDQUFDO29CQUMxQixNQUFNO2dCQUNWLEtBQUssSUFBSTtvQkFDTCxNQUFNLEdBQUcsS0FBSyxJQUFJLFFBQVEsQ0FBQztvQkFDM0IsTUFBTTtnQkFDVixLQUFLLEdBQUc7b0JBQ0osTUFBTSxHQUFHLEtBQUssR0FBRyxRQUFRLENBQUM7b0JBQzFCLE1BQU07Z0JBQ1YsS0FBSyxJQUFJO29CQUNMLE1BQU0sR0FBRyxLQUFLLElBQUksUUFBUSxDQUFDO29CQUMzQixNQUFNO2FBQ2I7WUFFRCxPQUFPLE1BQU0sQ0FBQztTQUNqQixDQUFDLENBQUM7S0FDTjtJQUNELGdCQUFnQixDQUFDLEdBQVcsRUFBRSxHQUFXO1FBQ3JDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztLQUM1RDtDQUNKO0FBRUQsTUFBTSxXQUFZLFNBQVEsVUFBVTtJQUNoQyxZQUFZLElBQVksRUFBUyxNQUFjO1FBQzNDLEtBQUssQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFEUSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBRzNDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0tBQ3BCO0lBQ0QsSUFBSSxPQUFPO1FBQ1AsUUFDSSxJQUFJLEdBQUcsQ0FDSCxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsS0FDeEMsTUFBTSxHQUFHLEtBQUssR0FBRyxDQUFDLENBQ3JCLENBQ0osQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUNaO0tBQ0w7SUFDRCxJQUFJLE1BQU07UUFDTixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDYixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDNUI7UUFDRCxNQUFNLE9BQU8sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsS0FDeEQsTUFBTSxHQUFHLEtBQUssR0FBRyxDQUFDLENBQ3JCLENBQUM7UUFDRixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDN0M7SUFDRCxJQUFJLE9BQU87UUFDUCxJQUFJLEdBQUcsR0FBYSxFQUFFLENBQUM7UUFDdkIsS0FBSyxJQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQzdCLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNoQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7Z0JBQ2hDLFNBQVM7YUFDWjtZQUNELEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztTQUNsQztRQUNELE9BQU8sSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7S0FDaEM7Q0FDSjtNQUVZLFdBQVksU0FBUSxhQUFxQjtJQXdCbEQsWUFDVyxNQUF3QixFQUN4QixRQUFnQixFQUNoQixPQUFpQjtRQUV4QixLQUFLLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUoxQixXQUFNLEdBQU4sTUFBTSxDQUFrQjtRQUN4QixhQUFRLEdBQVIsUUFBUSxDQUFRO1FBQ2hCLFlBQU8sR0FBUCxPQUFPLENBQVU7UUF6QjVCLFlBQU8sR0FBVyxFQUFFLENBQUM7UUE2QnJCLGNBQVMsR0FBa0Q7WUFDdkQsR0FBRyxFQUFFLENBQUMsQ0FBUyxFQUFFLENBQVMsS0FBYSxDQUFDLEdBQUcsQ0FBQztZQUM1QyxHQUFHLEVBQUUsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxLQUFhLENBQUMsR0FBRyxDQUFDO1lBQzVDLEdBQUcsRUFBRSxDQUFDLENBQVMsRUFBRSxDQUFTLEtBQWEsQ0FBQyxHQUFHLENBQUM7WUFDNUMsR0FBRyxFQUFFLENBQUMsQ0FBUyxFQUFFLENBQVMsS0FBYSxDQUFDLEdBQUcsQ0FBQztZQUM1QyxHQUFHLEVBQUUsQ0FBQyxDQUFTLEVBQUUsQ0FBUztnQkFDdEIsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUN6QjtTQUNKLENBQUM7UUFDRixVQUFLLEdBQWlCLEVBQUUsQ0FBQztRQUN6QixTQUFJLEdBQWlCLEVBQUUsQ0FBQztLQVh2QjtJQTFCRCxJQUFJLE9BQU87UUFDUCxJQUFJLElBQUksQ0FBQyxRQUFRO1lBQUUsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3hDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJO1lBQ25CLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUMzRCxDQUFDLENBQUM7UUFDSCxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsS0FBSyxJQUFJLEVBQUUsQ0FBQztLQUN0QztJQUNLLEtBQUs7O1lBQ1AsTUFBTSxNQUFNLEdBQUc7Z0JBQ1gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRTtvQkFDM0MscUJBQXFCLEVBQUUsQ0FBQztpQkFDM0IsQ0FBQzthQUNMLENBQUM7WUFDRixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFO2dCQUN2QyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQzthQUNqRTtZQUNELElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3pEO0tBQUE7SUFvQkssSUFBSTs7WUFDTixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7WUFDZCxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNsQixLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQzdCLFFBQVEsSUFBSSxDQUFDLElBQUk7b0JBQ2IsS0FBSyxHQUFHLENBQUM7b0JBQ1QsS0FBSyxHQUFHLENBQUM7b0JBQ1QsS0FBSyxHQUFHLENBQUM7b0JBQ1QsS0FBSyxHQUFHLENBQUM7b0JBQ1QsS0FBSyxHQUFHLENBQUM7b0JBQ1QsS0FBSyxNQUFNO3dCQUNQLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEVBQ3BCLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO3dCQUN6QixJQUFJLENBQUMsQ0FBQyxFQUFFOzRCQUNKLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNuQixTQUFTO3lCQUNaO3dCQUNELENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzt3QkFDVCxJQUFJLENBQUMsWUFBWSxXQUFXLEVBQUU7NEJBQzFCLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRTtnQ0FDWCxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQ1gsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FDckIsZUFBZSxDQUFDOzZCQUNuQjt5QkFDSjt3QkFFRCxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7d0JBQ1QsSUFBSSxDQUFDLFlBQVksV0FBVyxFQUFFOzRCQUMxQixJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUU7Z0NBQ1gsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUNYLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQ3JCLGVBQWUsQ0FBQzs2QkFDbkI7eUJBQ0o7d0JBQ0QsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQ3BDLENBQUMsQ0FBQyxNQUFNLEVBQ1IsQ0FBQyxDQUFDLE1BQU0sQ0FDWCxDQUFDO3dCQUVGLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksVUFBVSxDQUFDLEdBQUcsTUFBTSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDbkQsTUFBTTtvQkFDVixLQUFLLElBQUksRUFBRTt3QkFDUCxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDeEMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFFN0MsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFOzRCQUM3QixJQUFJOzRCQUNKLFlBQVksRUFBRSxFQUFFO3lCQUNuQixDQUFDLENBQUM7d0JBQ0gsTUFBTTtxQkFDVDtvQkFDRCxLQUFLLElBQUksRUFBRTt3QkFDUCxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDeEMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFFN0MsSUFBSSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQzt3QkFFeEMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFOzRCQUM3QixJQUFJOzRCQUNKLFlBQVksRUFBRSxFQUFFO3lCQUNuQixDQUFDLENBQUM7d0JBQ0gsTUFBTTtxQkFDVDtvQkFDRCxLQUFLLElBQUksRUFBRTt3QkFDUCxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDeEMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFFN0MsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFOzRCQUM3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
