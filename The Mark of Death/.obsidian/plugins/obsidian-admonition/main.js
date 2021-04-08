'use strict';

var obsidian = require('obsidian');
var require$$0 = require('util');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);

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

var toStr$7 = Object.prototype.toString;

var isArguments = function isArguments(value) {
	var str = toStr$7.call(value);
	var isArgs = str === '[object Arguments]';
	if (!isArgs) {
		isArgs = str !== '[object Array]' &&
			value !== null &&
			typeof value === 'object' &&
			typeof value.length === 'number' &&
			value.length >= 0 &&
			toStr$7.call(value.callee) === '[object Function]';
	}
	return isArgs;
};

var keysShim$1;
if (!Object.keys) {
	// modified from https://github.com/es-shims/es5-shim
	var has$2 = Object.prototype.hasOwnProperty;
	var toStr$6 = Object.prototype.toString;
	var isArgs = isArguments; // eslint-disable-line global-require
	var isEnumerable$1 = Object.prototype.propertyIsEnumerable;
	var hasDontEnumBug = !isEnumerable$1.call({ toString: null }, 'toString');
	var hasProtoEnumBug = isEnumerable$1.call(function () {}, 'prototype');
	var dontEnums = [
		'toString',
		'toLocaleString',
		'valueOf',
		'hasOwnProperty',
		'isPrototypeOf',
		'propertyIsEnumerable',
		'constructor'
	];
	var equalsConstructorPrototype = function (o) {
		var ctor = o.constructor;
		return ctor && ctor.prototype === o;
	};
	var excludedKeys = {
		$applicationCache: true,
		$console: true,
		$external: true,
		$frame: true,
		$frameElement: true,
		$frames: true,
		$innerHeight: true,
		$innerWidth: true,
		$onmozfullscreenchange: true,
		$onmozfullscreenerror: true,
		$outerHeight: true,
		$outerWidth: true,
		$pageXOffset: true,
		$pageYOffset: true,
		$parent: true,
		$scrollLeft: true,
		$scrollTop: true,
		$scrollX: true,
		$scrollY: true,
		$self: true,
		$webkitIndexedDB: true,
		$webkitStorageInfo: true,
		$window: true
	};
	var hasAutomationEqualityBug = (function () {
		/* global window */
		if (typeof window === 'undefined') { return false; }
		for (var k in window) {
			try {
				if (!excludedKeys['$' + k] && has$2.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
					try {
						equalsConstructorPrototype(window[k]);
					} catch (e) {
						return true;
					}
				}
			} catch (e) {
				return true;
			}
		}
		return false;
	}());
	var equalsConstructorPrototypeIfNotBuggy = function (o) {
		/* global window */
		if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
			return equalsConstructorPrototype(o);
		}
		try {
			return equalsConstructorPrototype(o);
		} catch (e) {
			return false;
		}
	};

	keysShim$1 = function keys(object) {
		var isObject = object !== null && typeof object === 'object';
		var isFunction = toStr$6.call(object) === '[object Function]';
		var isArguments = isArgs(object);
		var isString = isObject && toStr$6.call(object) === '[object String]';
		var theKeys = [];

		if (!isObject && !isFunction && !isArguments) {
			throw new TypeError('Object.keys called on a non-object');
		}

		var skipProto = hasProtoEnumBug && isFunction;
		if (isString && object.length > 0 && !has$2.call(object, 0)) {
			for (var i = 0; i < object.length; ++i) {
				theKeys.push(String(i));
			}
		}

		if (isArguments && object.length > 0) {
			for (var j = 0; j < object.length; ++j) {
				theKeys.push(String(j));
			}
		} else {
			for (var name in object) {
				if (!(skipProto && name === 'prototype') && has$2.call(object, name)) {
					theKeys.push(String(name));
				}
			}
		}

		if (hasDontEnumBug) {
			var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

			for (var k = 0; k < dontEnums.length; ++k) {
				if (!(skipConstructor && dontEnums[k] === 'constructor') && has$2.call(object, dontEnums[k])) {
					theKeys.push(dontEnums[k]);
				}
			}
		}
		return theKeys;
	};
}
var implementation$2 = keysShim$1;

var slice$1 = Array.prototype.slice;


var origKeys = Object.keys;
var keysShim = origKeys ? function keys(o) { return origKeys(o); } : implementation$2;

var originalKeys = Object.keys;

keysShim.shim = function shimObjectKeys() {
	if (Object.keys) {
		var keysWorksWithArguments = (function () {
			// Safari 5.0 bug
			var args = Object.keys(arguments);
			return args && args.length === arguments.length;
		}(1, 2));
		if (!keysWorksWithArguments) {
			Object.keys = function keys(object) { // eslint-disable-line func-name-matching
				if (isArguments(object)) {
					return originalKeys(slice$1.call(object));
				}
				return originalKeys(object);
			};
		}
	} else {
		Object.keys = keysShim;
	}
	return Object.keys || keysShim;
};

var C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_objectKeys = keysShim;

var hasSymbols$5 = typeof Symbol === 'function' && typeof Symbol('foo') === 'symbol';

var toStr$5 = Object.prototype.toString;
var concat = Array.prototype.concat;
var origDefineProperty = Object.defineProperty;

var isFunction = function (fn) {
	return typeof fn === 'function' && toStr$5.call(fn) === '[object Function]';
};

var arePropertyDescriptorsSupported = function () {
	var obj = {};
	try {
		origDefineProperty(obj, 'x', { enumerable: false, value: obj });
		// eslint-disable-next-line no-unused-vars, no-restricted-syntax
		for (var _ in obj) { // jscs:ignore disallowUnusedVariables
			return false;
		}
		return obj.x === obj;
	} catch (e) { /* this is IE 8. */
		return false;
	}
};
var supportsDescriptors = origDefineProperty && arePropertyDescriptorsSupported();

var defineProperty = function (object, name, value, predicate) {
	if (name in object && (!isFunction(predicate) || !predicate())) {
		return;
	}
	if (supportsDescriptors) {
		origDefineProperty(object, name, {
			configurable: true,
			enumerable: false,
			value: value,
			writable: true
		});
	} else {
		object[name] = value;
	}
};

var defineProperties = function (object, map) {
	var predicates = arguments.length > 2 ? arguments[2] : {};
	var props = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_objectKeys(map);
	if (hasSymbols$5) {
		props = concat.call(props, Object.getOwnPropertySymbols(map));
	}
	for (var i = 0; i < props.length; i += 1) {
		defineProperty(object, props[i], map[props[i]], predicates[props[i]]);
	}
};

defineProperties.supportsDescriptors = !!supportsDescriptors;

var C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_defineProperties = defineProperties;

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

/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr$4 = Object.prototype.toString;
var funcType = '[object Function]';

var implementation$1 = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr$4.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

var C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_functionBind = Function.prototype.bind || implementation$1;

/* eslint complexity: [2, 18], max-statements: [2, 33] */
var shams = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
	if (typeof Symbol.iterator === 'symbol') { return true; }

	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') { return false; }

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	// if (typeof Symbol.prototype.toString !== 'function') { return false; }
	// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) { return false; }

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
	}

	return true;
};

var origSymbol = typeof Symbol !== 'undefined' && Symbol;


var C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_hasSymbols = function hasNativeSymbols() {
	if (typeof origSymbol !== 'function') { return false; }
	if (typeof Symbol !== 'function') { return false; }
	if (typeof origSymbol('foo') !== 'symbol') { return false; }
	if (typeof Symbol('bar') !== 'symbol') { return false; }

	return shams();
};

var C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_has_src = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_functionBind.call(Function.call, Object.prototype.hasOwnProperty);

var undefined$1;

var $SyntaxError$1 = SyntaxError;
var $Function = Function;
var $TypeError$l = TypeError;

// eslint-disable-next-line consistent-return
var getEvalledConstructor = function (expressionSyntax) {
	try {
		return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
	} catch (e) {}
};

var $gOPD$1 = Object.getOwnPropertyDescriptor;
if ($gOPD$1) {
	try {
		$gOPD$1({}, '');
	} catch (e) {
		$gOPD$1 = null; // this is IE 8, which has a broken gOPD
	}
}

var throwTypeError = function () {
	throw new $TypeError$l();
};
var ThrowTypeError = $gOPD$1
	? (function () {
		try {
			// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
			arguments.callee; // IE 8 does not throw here
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
				return $gOPD$1(arguments, 'callee').get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}())
	: throwTypeError;

var hasSymbols$4 = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_hasSymbols();

var getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto

var needsEval = {};

var TypedArray = typeof Uint8Array === 'undefined' ? undefined$1 : getProto(Uint8Array);

var INTRINSICS = {
	'%AggregateError%': typeof AggregateError === 'undefined' ? undefined$1 : AggregateError,
	'%Array%': Array,
	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined$1 : ArrayBuffer,
	'%ArrayIteratorPrototype%': hasSymbols$4 ? getProto([][Symbol.iterator]()) : undefined$1,
	'%AsyncFromSyncIteratorPrototype%': undefined$1,
	'%AsyncFunction%': needsEval,
	'%AsyncGenerator%': needsEval,
	'%AsyncGeneratorFunction%': needsEval,
	'%AsyncIteratorPrototype%': needsEval,
	'%Atomics%': typeof Atomics === 'undefined' ? undefined$1 : Atomics,
	'%BigInt%': typeof BigInt === 'undefined' ? undefined$1 : BigInt,
	'%Boolean%': Boolean,
	'%DataView%': typeof DataView === 'undefined' ? undefined$1 : DataView,
	'%Date%': Date,
	'%decodeURI%': decodeURI,
	'%decodeURIComponent%': decodeURIComponent,
	'%encodeURI%': encodeURI,
	'%encodeURIComponent%': encodeURIComponent,
	'%Error%': Error,
	'%eval%': eval, // eslint-disable-line no-eval
	'%EvalError%': EvalError,
	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined$1 : Float32Array,
	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined$1 : Float64Array,
	'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined$1 : FinalizationRegistry,
	'%Function%': $Function,
	'%GeneratorFunction%': needsEval,
	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined$1 : Int8Array,
	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined$1 : Int16Array,
	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined$1 : Int32Array,
	'%isFinite%': isFinite,
	'%isNaN%': isNaN,
	'%IteratorPrototype%': hasSymbols$4 ? getProto(getProto([][Symbol.iterator]())) : undefined$1,
	'%JSON%': typeof JSON === 'object' ? JSON : undefined$1,
	'%Map%': typeof Map === 'undefined' ? undefined$1 : Map,
	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols$4 ? undefined$1 : getProto(new Map()[Symbol.iterator]()),
	'%Math%': Math,
	'%Number%': Number,
	'%Object%': Object,
	'%parseFloat%': parseFloat,
	'%parseInt%': parseInt,
	'%Promise%': typeof Promise === 'undefined' ? undefined$1 : Promise,
	'%Proxy%': typeof Proxy === 'undefined' ? undefined$1 : Proxy,
	'%RangeError%': RangeError,
	'%ReferenceError%': ReferenceError,
	'%Reflect%': typeof Reflect === 'undefined' ? undefined$1 : Reflect,
	'%RegExp%': RegExp,
	'%Set%': typeof Set === 'undefined' ? undefined$1 : Set,
	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols$4 ? undefined$1 : getProto(new Set()[Symbol.iterator]()),
	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined$1 : SharedArrayBuffer,
	'%String%': String,
	'%StringIteratorPrototype%': hasSymbols$4 ? getProto(''[Symbol.iterator]()) : undefined$1,
	'%Symbol%': hasSymbols$4 ? Symbol : undefined$1,
	'%SyntaxError%': $SyntaxError$1,
	'%ThrowTypeError%': ThrowTypeError,
	'%TypedArray%': TypedArray,
	'%TypeError%': $TypeError$l,
	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined$1 : Uint8Array,
	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined$1 : Uint8ClampedArray,
	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined$1 : Uint16Array,
	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined$1 : Uint32Array,
	'%URIError%': URIError,
	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined$1 : WeakMap,
	'%WeakRef%': typeof WeakRef === 'undefined' ? undefined$1 : WeakRef,
	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined$1 : WeakSet
};

var doEval = function doEval(name) {
	var value;
	if (name === '%AsyncFunction%') {
		value = getEvalledConstructor('async function () {}');
	} else if (name === '%GeneratorFunction%') {
		value = getEvalledConstructor('function* () {}');
	} else if (name === '%AsyncGeneratorFunction%') {
		value = getEvalledConstructor('async function* () {}');
	} else if (name === '%AsyncGenerator%') {
		var fn = doEval('%AsyncGeneratorFunction%');
		if (fn) {
			value = fn.prototype;
		}
	} else if (name === '%AsyncIteratorPrototype%') {
		var gen = doEval('%AsyncGenerator%');
		if (gen) {
			value = getProto(gen.prototype);
		}
	}

	INTRINSICS[name] = value;

	return value;
};

var LEGACY_ALIASES = {
	'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
	'%ArrayPrototype%': ['Array', 'prototype'],
	'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
	'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
	'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
	'%ArrayProto_values%': ['Array', 'prototype', 'values'],
	'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
	'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
	'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
	'%BooleanPrototype%': ['Boolean', 'prototype'],
	'%DataViewPrototype%': ['DataView', 'prototype'],
	'%DatePrototype%': ['Date', 'prototype'],
	'%ErrorPrototype%': ['Error', 'prototype'],
	'%EvalErrorPrototype%': ['EvalError', 'prototype'],
	'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
	'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
	'%FunctionPrototype%': ['Function', 'prototype'],
	'%Generator%': ['GeneratorFunction', 'prototype'],
	'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
	'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
	'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
	'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
	'%JSONParse%': ['JSON', 'parse'],
	'%JSONStringify%': ['JSON', 'stringify'],
	'%MapPrototype%': ['Map', 'prototype'],
	'%NumberPrototype%': ['Number', 'prototype'],
	'%ObjectPrototype%': ['Object', 'prototype'],
	'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
	'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
	'%PromisePrototype%': ['Promise', 'prototype'],
	'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
	'%Promise_all%': ['Promise', 'all'],
	'%Promise_reject%': ['Promise', 'reject'],
	'%Promise_resolve%': ['Promise', 'resolve'],
	'%RangeErrorPrototype%': ['RangeError', 'prototype'],
	'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
	'%RegExpPrototype%': ['RegExp', 'prototype'],
	'%SetPrototype%': ['Set', 'prototype'],
	'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
	'%StringPrototype%': ['String', 'prototype'],
	'%SymbolPrototype%': ['Symbol', 'prototype'],
	'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
	'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
	'%TypeErrorPrototype%': ['TypeError', 'prototype'],
	'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
	'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
	'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
	'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
	'%URIErrorPrototype%': ['URIError', 'prototype'],
	'%WeakMapPrototype%': ['WeakMap', 'prototype'],
	'%WeakSetPrototype%': ['WeakSet', 'prototype']
};



var $concat = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_functionBind.call(Function.call, Array.prototype.concat);
var $spliceApply = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_functionBind.call(Function.apply, Array.prototype.splice);
var $replace = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_functionBind.call(Function.call, String.prototype.replace);
var $strSlice = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_functionBind.call(Function.call, String.prototype.slice);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var first = $strSlice(string, 0, 1);
	var last = $strSlice(string, -1);
	if (first === '%' && last !== '%') {
		throw new $SyntaxError$1('invalid intrinsic syntax, expected closing `%`');
	} else if (last === '%' && first !== '%') {
		throw new $SyntaxError$1('invalid intrinsic syntax, expected opening `%`');
	}
	var result = [];
	$replace(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	var intrinsicName = name;
	var alias;
	if (C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_has_src(LEGACY_ALIASES, intrinsicName)) {
		alias = LEGACY_ALIASES[intrinsicName];
		intrinsicName = '%' + alias[0] + '%';
	}

	if (C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_has_src(INTRINSICS, intrinsicName)) {
		var value = INTRINSICS[intrinsicName];
		if (value === needsEval) {
			value = doEval(intrinsicName);
		}
		if (typeof value === 'undefined' && !allowMissing) {
			throw new $TypeError$l('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
		}

		return {
			alias: alias,
			name: intrinsicName,
			value: value
		};
	}

	throw new $SyntaxError$1('intrinsic ' + name + ' does not exist!');
};

var C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new $TypeError$l('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new $TypeError$l('"allowMissing" argument must be a boolean');
	}

	var parts = stringToPath(name);
	var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

	var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
	var intrinsicRealName = intrinsic.name;
	var value = intrinsic.value;
	var skipFurtherCaching = false;

	var alias = intrinsic.alias;
	if (alias) {
		intrinsicBaseName = alias[0];
		$spliceApply(parts, $concat([0, 1], alias));
	}

	for (var i = 1, isOwn = true; i < parts.length; i += 1) {
		var part = parts[i];
		var first = $strSlice(part, 0, 1);
		var last = $strSlice(part, -1);
		if (
			(
				(first === '"' || first === "'" || first === '`')
				|| (last === '"' || last === "'" || last === '`')
			)
			&& first !== last
		) {
			throw new $SyntaxError$1('property names with quotes must have matching quotes');
		}
		if (part === 'constructor' || !isOwn) {
			skipFurtherCaching = true;
		}

		intrinsicBaseName += '.' + part;
		intrinsicRealName = '%' + intrinsicBaseName + '%';

		if (C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_has_src(INTRINSICS, intrinsicRealName)) {
			value = INTRINSICS[intrinsicRealName];
		} else if (value != null) {
			if (!(part in value)) {
				if (!allowMissing) {
					throw new $TypeError$l('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				return void undefined$1;
			}
			if ($gOPD$1 && (i + 1) >= parts.length) {
				var desc = $gOPD$1(value, part);
				isOwn = !!desc;

				// By convention, when a data property is converted to an accessor
				// property to emulate a data property that does not suffer from
				// the override mistake, that accessor's getter is marked with
				// an `originalValue` property. Here, when we detect this, we
				// uphold the illusion by pretending to see that original data
				// property, i.e., returning the value rather than the getter
				// itself.
				if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
					value = desc.get;
				} else {
					value = value[part];
				}
			} else {
				isOwn = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_has_src(value, part);
				value = value[part];
			}

			if (isOwn && !skipFurtherCaching) {
				INTRINSICS[intrinsicRealName] = value;
			}
		}
	}
	return value;
};

var C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_callBind = createCommonjsModule(function (module) {




var $apply = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%Function.prototype.apply%');
var $call = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%Function.prototype.call%');
var $reflectApply = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%Reflect.apply%', true) || C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_functionBind.call($call, $apply);

var $gOPD = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%Object.getOwnPropertyDescriptor%', true);
var $defineProperty = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%Object.defineProperty%', true);
var $max = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%Math.max%');

if ($defineProperty) {
	try {
		$defineProperty({}, 'a', { value: 1 });
	} catch (e) {
		// IE 8 has a broken defineProperty
		$defineProperty = null;
	}
}

module.exports = function callBind(originalFunction) {
	var func = $reflectApply(C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_functionBind, $call, arguments);
	if ($gOPD && $defineProperty) {
		var desc = $gOPD(func, 'length');
		if (desc.configurable) {
			// original length, plus the receiver, minus any additional arguments (after the receiver)
			$defineProperty(
				func,
				'length',
				{ value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
			);
		}
	}
	return func;
};

var applyBind = function applyBind() {
	return $reflectApply(C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_functionBind, $apply, arguments);
};

if ($defineProperty) {
	$defineProperty(module.exports, 'apply', { value: applyBind });
} else {
	module.exports.apply = applyBind;
}
});

var util_inspect = require$$0__default['default'].inspect;

var hasMap = typeof Map === 'function' && Map.prototype;
var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, 'size') : null;
var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === 'function' ? mapSizeDescriptor.get : null;
var mapForEach = hasMap && Map.prototype.forEach;
var hasSet = typeof Set === 'function' && Set.prototype;
var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, 'size') : null;
var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === 'function' ? setSizeDescriptor.get : null;
var setForEach = hasSet && Set.prototype.forEach;
var hasWeakMap = typeof WeakMap === 'function' && WeakMap.prototype;
var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
var hasWeakSet = typeof WeakSet === 'function' && WeakSet.prototype;
var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
var booleanValueOf = Boolean.prototype.valueOf;
var objectToString = Object.prototype.toString;
var functionToString = Function.prototype.toString;
var match = String.prototype.match;
var bigIntValueOf = typeof BigInt === 'function' ? BigInt.prototype.valueOf : null;
var gOPS = Object.getOwnPropertySymbols;
var symToString = typeof Symbol === 'function' ? Symbol.prototype.toString : null;
var isEnumerable = Object.prototype.propertyIsEnumerable;

var inspectCustom = util_inspect.custom;
var inspectSymbol = inspectCustom && isSymbol(inspectCustom) ? inspectCustom : null;

var C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_objectInspect = function inspect_(obj, options, depth, seen) {
    var opts = options || {};

    if (has$1(opts, 'quoteStyle') && (opts.quoteStyle !== 'single' && opts.quoteStyle !== 'double')) {
        throw new TypeError('option "quoteStyle" must be "single" or "double"');
    }
    if (
        has$1(opts, 'maxStringLength') && (typeof opts.maxStringLength === 'number'
            ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity
            : opts.maxStringLength !== null
        )
    ) {
        throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
    }
    var customInspect = has$1(opts, 'customInspect') ? opts.customInspect : true;
    if (typeof customInspect !== 'boolean') {
        throw new TypeError('option "customInspect", if provided, must be `true` or `false`');
    }

    if (
        has$1(opts, 'indent')
        && opts.indent !== null
        && opts.indent !== '\t'
        && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)
    ) {
        throw new TypeError('options "indent" must be "\\t", an integer > 0, or `null`');
    }

    if (typeof obj === 'undefined') {
        return 'undefined';
    }
    if (obj === null) {
        return 'null';
    }
    if (typeof obj === 'boolean') {
        return obj ? 'true' : 'false';
    }

    if (typeof obj === 'string') {
        return inspectString(obj, opts);
    }
    if (typeof obj === 'number') {
        if (obj === 0) {
            return Infinity / obj > 0 ? '0' : '-0';
        }
        return String(obj);
    }
    if (typeof obj === 'bigint') {
        return String(obj) + 'n';
    }

    var maxDepth = typeof opts.depth === 'undefined' ? 5 : opts.depth;
    if (typeof depth === 'undefined') { depth = 0; }
    if (depth >= maxDepth && maxDepth > 0 && typeof obj === 'object') {
        return isArray(obj) ? '[Array]' : '[Object]';
    }

    var indent = getIndent(opts, depth);

    if (typeof seen === 'undefined') {
        seen = [];
    } else if (indexOf(seen, obj) >= 0) {
        return '[Circular]';
    }

    function inspect(value, from, noIndent) {
        if (from) {
            seen = seen.slice();
            seen.push(from);
        }
        if (noIndent) {
            var newOpts = {
                depth: opts.depth
            };
            if (has$1(opts, 'quoteStyle')) {
                newOpts.quoteStyle = opts.quoteStyle;
            }
            return inspect_(value, newOpts, depth + 1, seen);
        }
        return inspect_(value, opts, depth + 1, seen);
    }

    if (typeof obj === 'function') {
        var name = nameOf(obj);
        var keys = arrObjKeys(obj, inspect);
        return '[Function' + (name ? ': ' + name : ' (anonymous)') + ']' + (keys.length > 0 ? ' { ' + keys.join(', ') + ' }' : '');
    }
    if (isSymbol(obj)) {
        var symString = symToString.call(obj);
        return typeof obj === 'object' ? markBoxed(symString) : symString;
    }
    if (isElement(obj)) {
        var s = '<' + String(obj.nodeName).toLowerCase();
        var attrs = obj.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
            s += ' ' + attrs[i].name + '=' + wrapQuotes(quote(attrs[i].value), 'double', opts);
        }
        s += '>';
        if (obj.childNodes && obj.childNodes.length) { s += '...'; }
        s += '</' + String(obj.nodeName).toLowerCase() + '>';
        return s;
    }
    if (isArray(obj)) {
        if (obj.length === 0) { return '[]'; }
        var xs = arrObjKeys(obj, inspect);
        if (indent && !singleLineValues(xs)) {
            return '[' + indentedJoin(xs, indent) + ']';
        }
        return '[ ' + xs.join(', ') + ' ]';
    }
    if (isError(obj)) {
        var parts = arrObjKeys(obj, inspect);
        if (parts.length === 0) { return '[' + String(obj) + ']'; }
        return '{ [' + String(obj) + '] ' + parts.join(', ') + ' }';
    }
    if (typeof obj === 'object' && customInspect) {
        if (inspectSymbol && typeof obj[inspectSymbol] === 'function') {
            return obj[inspectSymbol]();
        } else if (typeof obj.inspect === 'function') {
            return obj.inspect();
        }
    }
    if (isMap(obj)) {
        var mapParts = [];
        mapForEach.call(obj, function (value, key) {
            mapParts.push(inspect(key, obj, true) + ' => ' + inspect(value, obj));
        });
        return collectionOf('Map', mapSize.call(obj), mapParts, indent);
    }
    if (isSet(obj)) {
        var setParts = [];
        setForEach.call(obj, function (value) {
            setParts.push(inspect(value, obj));
        });
        return collectionOf('Set', setSize.call(obj), setParts, indent);
    }
    if (isWeakMap(obj)) {
        return weakCollectionOf('WeakMap');
    }
    if (isWeakSet(obj)) {
        return weakCollectionOf('WeakSet');
    }
    if (isNumber(obj)) {
        return markBoxed(inspect(Number(obj)));
    }
    if (isBigInt(obj)) {
        return markBoxed(inspect(bigIntValueOf.call(obj)));
    }
    if (isBoolean(obj)) {
        return markBoxed(booleanValueOf.call(obj));
    }
    if (isString(obj)) {
        return markBoxed(inspect(String(obj)));
    }
    if (!isDate(obj) && !isRegExp(obj)) {
        var ys = arrObjKeys(obj, inspect);
        if (ys.length === 0) { return '{}'; }
        if (indent) {
            return '{' + indentedJoin(ys, indent) + '}';
        }
        return '{ ' + ys.join(', ') + ' }';
    }
    return String(obj);
};

function wrapQuotes(s, defaultStyle, opts) {
    var quoteChar = (opts.quoteStyle || defaultStyle) === 'double' ? '"' : "'";
    return quoteChar + s + quoteChar;
}

function quote(s) {
    return String(s).replace(/"/g, '&quot;');
}

function isArray(obj) { return toStr$3(obj) === '[object Array]'; }
function isDate(obj) { return toStr$3(obj) === '[object Date]'; }
function isRegExp(obj) { return toStr$3(obj) === '[object RegExp]'; }
function isError(obj) { return toStr$3(obj) === '[object Error]'; }
function isSymbol(obj) { return toStr$3(obj) === '[object Symbol]'; }
function isString(obj) { return toStr$3(obj) === '[object String]'; }
function isNumber(obj) { return toStr$3(obj) === '[object Number]'; }
function isBigInt(obj) { return toStr$3(obj) === '[object BigInt]'; }
function isBoolean(obj) { return toStr$3(obj) === '[object Boolean]'; }

var hasOwn = Object.prototype.hasOwnProperty || function (key) { return key in this; };
function has$1(obj, key) {
    return hasOwn.call(obj, key);
}

function toStr$3(obj) {
    return objectToString.call(obj);
}

function nameOf(f) {
    if (f.name) { return f.name; }
    var m = match.call(functionToString.call(f), /^function\s*([\w$]+)/);
    if (m) { return m[1]; }
    return null;
}

function indexOf(xs, x) {
    if (xs.indexOf) { return xs.indexOf(x); }
    for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) { return i; }
    }
    return -1;
}

function isMap(x) {
    if (!mapSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        mapSize.call(x);
        try {
            setSize.call(x);
        } catch (s) {
            return true;
        }
        return x instanceof Map; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakMap(x) {
    if (!weakMapHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakMapHas.call(x, weakMapHas);
        try {
            weakSetHas.call(x, weakSetHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakMap; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isSet(x) {
    if (!setSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        setSize.call(x);
        try {
            mapSize.call(x);
        } catch (m) {
            return true;
        }
        return x instanceof Set; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakSet(x) {
    if (!weakSetHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakSetHas.call(x, weakSetHas);
        try {
            weakMapHas.call(x, weakMapHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakSet; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isElement(x) {
    if (!x || typeof x !== 'object') { return false; }
    if (typeof HTMLElement !== 'undefined' && x instanceof HTMLElement) {
        return true;
    }
    return typeof x.nodeName === 'string' && typeof x.getAttribute === 'function';
}

function inspectString(str, opts) {
    if (str.length > opts.maxStringLength) {
        var remaining = str.length - opts.maxStringLength;
        var trailer = '... ' + remaining + ' more character' + (remaining > 1 ? 's' : '');
        return inspectString(str.slice(0, opts.maxStringLength), opts) + trailer;
    }
    // eslint-disable-next-line no-control-regex
    var s = str.replace(/(['\\])/g, '\\$1').replace(/[\x00-\x1f]/g, lowbyte);
    return wrapQuotes(s, 'single', opts);
}

function lowbyte(c) {
    var n = c.charCodeAt(0);
    var x = {
        8: 'b',
        9: 't',
        10: 'n',
        12: 'f',
        13: 'r'
    }[n];
    if (x) { return '\\' + x; }
    return '\\x' + (n < 0x10 ? '0' : '') + n.toString(16).toUpperCase();
}

function markBoxed(str) {
    return 'Object(' + str + ')';
}

function weakCollectionOf(type) {
    return type + ' { ? }';
}

function collectionOf(type, size, entries, indent) {
    var joinedEntries = indent ? indentedJoin(entries, indent) : entries.join(', ');
    return type + ' (' + size + ') {' + joinedEntries + '}';
}

function singleLineValues(xs) {
    for (var i = 0; i < xs.length; i++) {
        if (indexOf(xs[i], '\n') >= 0) {
            return false;
        }
    }
    return true;
}

function getIndent(opts, depth) {
    var baseIndent;
    if (opts.indent === '\t') {
        baseIndent = '\t';
    } else if (typeof opts.indent === 'number' && opts.indent > 0) {
        baseIndent = Array(opts.indent + 1).join(' ');
    } else {
        return null;
    }
    return {
        base: baseIndent,
        prev: Array(depth + 1).join(baseIndent)
    };
}

function indentedJoin(xs, indent) {
    if (xs.length === 0) { return ''; }
    var lineJoiner = '\n' + indent.prev + indent.base;
    return lineJoiner + xs.join(',' + lineJoiner) + '\n' + indent.prev;
}

function arrObjKeys(obj, inspect) {
    var isArr = isArray(obj);
    var xs = [];
    if (isArr) {
        xs.length = obj.length;
        for (var i = 0; i < obj.length; i++) {
            xs[i] = has$1(obj, i) ? inspect(obj[i], obj) : '';
        }
    }
    for (var key in obj) { // eslint-disable-line no-restricted-syntax
        if (!has$1(obj, key)) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
        if (isArr && String(Number(key)) === key && key < obj.length) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
        if ((/[^\w$]/).test(key)) {
            xs.push(inspect(key, obj) + ': ' + inspect(obj[key], obj));
        } else {
            xs.push(key + ': ' + inspect(obj[key], obj));
        }
    }
    if (typeof gOPS === 'function') {
        var syms = gOPS(obj);
        for (var j = 0; j < syms.length; j++) {
            if (isEnumerable.call(obj, syms[j])) {
                xs.push('[' + inspect(syms[j]) + ']: ' + inspect(obj[syms[j]], obj));
            }
        }
    }
    return xs;
}

var $indexOf = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_callBind(C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('String.prototype.indexOf'));

var callBound = function callBoundIntrinsic(name, allowMissing) {
	var intrinsic = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic(name, !!allowMissing);
	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
		return C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_callBind(intrinsic);
	}
	return intrinsic;
};

var $Array = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%Array%');

// eslint-disable-next-line global-require
var toStr$2 = !$Array.isArray && callBound('Object.prototype.toString');

// https://ecma-international.org/ecma-262/6.0/#sec-isarray

var IsArray = $Array.isArray || function IsArray(argument) {
	return toStr$2(argument) === '[object Array]';
};

var $TypeError$k = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%TypeError%');



var $apply = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%Reflect.apply%', true) || callBound('%Function.prototype.apply%');

// https://ecma-international.org/ecma-262/6.0/#sec-call

var Call = function Call(F, V) {
	var argumentsList = arguments.length > 2 ? arguments[2] : [];
	if (!IsArray(argumentsList)) {
		throw new $TypeError$k('Assertion failed: optional `argumentsList`, if provided, must be a List');
	}
	return $apply(F, V, argumentsList);
};

// https://ecma-international.org/ecma-262/6.0/#sec-ispropertykey

var IsPropertyKey = function IsPropertyKey(argument) {
	return typeof argument === 'string' || typeof argument === 'symbol';
};

// https://262.ecma-international.org/5.1/#sec-8

var Type$1 = function Type(x) {
	if (x === null) {
		return 'Null';
	}
	if (typeof x === 'undefined') {
		return 'Undefined';
	}
	if (typeof x === 'function' || typeof x === 'object') {
		return 'Object';
	}
	if (typeof x === 'number') {
		return 'Number';
	}
	if (typeof x === 'boolean') {
		return 'Boolean';
	}
	if (typeof x === 'string') {
		return 'String';
	}
};

// https://262.ecma-international.org/11.0/#sec-ecmascript-data-types-and-values

var Type = function Type(x) {
	if (typeof x === 'symbol') {
		return 'Symbol';
	}
	if (typeof x === 'bigint') {
		return 'BigInt';
	}
	return Type$1(x);
};

var $TypeError$j = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%TypeError%');






/**
 * 7.3.1 Get (O, P) - https://ecma-international.org/ecma-262/6.0/#sec-get-o-p
 * 1. Assert: Type(O) is Object.
 * 2. Assert: IsPropertyKey(P) is true.
 * 3. Return O.[[Get]](P, O).
 */

var Get = function Get(O, P) {
	// 7.3.1.1
	if (Type(O) !== 'Object') {
		throw new $TypeError$j('Assertion failed: Type(O) is not Object');
	}
	// 7.3.1.2
	if (!IsPropertyKey(P)) {
		throw new $TypeError$j('Assertion failed: IsPropertyKey(P) is not true, got ' + C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_objectInspect(P));
	}
	// 7.3.1.3
	return O[P];
};

var hasSymbols$3 = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_hasSymbols();



var $iterator = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%Symbol.iterator%', true);
var $stringSlice = callBound('String.prototype.slice');

var getIteratorMethod = function getIteratorMethod(ES, iterable) {
	var usingIterator;
	if (hasSymbols$3) {
		usingIterator = ES.GetMethod(iterable, $iterator);
	} else if (ES.IsArray(iterable)) {
		usingIterator = function () {
			var i = -1;
			var arr = this; // eslint-disable-line no-invalid-this
			return {
				next: function () {
					i += 1;
					return {
						done: i >= arr.length,
						value: arr[i]
					};
				}
			};
		};
	} else if (ES.Type(iterable) === 'String') {
		usingIterator = function () {
			var i = 0;
			return {
				next: function () {
					var nextIndex = ES.AdvanceStringIndex(iterable, i, true);
					var value = $stringSlice(iterable, i, nextIndex);
					i = nextIndex;
					return {
						done: nextIndex > iterable.length,
						value: value
					};
				}
			};
		};
	}
	return usingIterator;
};

var isLeadingSurrogate = function isLeadingSurrogate(charCode) {
	return typeof charCode === 'number' && charCode >= 0xD800 && charCode <= 0xDBFF;
};

var isTrailingSurrogate = function isTrailingSurrogate(charCode) {
	return typeof charCode === 'number' && charCode >= 0xDC00 && charCode <= 0xDFFF;
};

var $TypeError$i = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%TypeError%');
var $fromCharCode = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%String.fromCharCode%');




// https://262.ecma-international.org/11.0/#sec-utf16decodesurrogatepair

var UTF16DecodeSurrogatePair = function UTF16DecodeSurrogatePair(lead, trail) {
	if (!isLeadingSurrogate(lead) || !isTrailingSurrogate(trail)) {
		throw new $TypeError$i('Assertion failed: `lead` must be a leading surrogate char code, and `trail` must be a trailing surrogate char code');
	}
	// var cp = (lead - 0xD800) * 0x400 + (trail - 0xDC00) + 0x10000;
	return $fromCharCode(lead) + $fromCharCode(trail);
};

var $TypeError$h = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%TypeError%');







var $charAt = callBound('String.prototype.charAt');
var $charCodeAt = callBound('String.prototype.charCodeAt');

// https://262.ecma-international.org/11.0/#sec-codepointat

var CodePointAt = function CodePointAt(string, position) {
	if (Type(string) !== 'String') {
		throw new $TypeError$h('Assertion failed: `string` must be a String');
	}
	var size = string.length;
	if (position < 0 || position >= size) {
		throw new $TypeError$h('Assertion failed: `position` must be >= 0, and < the length of `string`');
	}
	var first = $charCodeAt(string, position);
	var cp = $charAt(string, position);
	var firstIsLeading = isLeadingSurrogate(first);
	var firstIsTrailing = isTrailingSurrogate(first);
	if (!firstIsLeading && !firstIsTrailing) {
		return {
			'[[CodePoint]]': cp,
			'[[CodeUnitCount]]': 1,
			'[[IsUnpairedSurrogate]]': false
		};
	}
	if (firstIsTrailing || (position + 1 === size)) {
		return {
			'[[CodePoint]]': cp,
			'[[CodeUnitCount]]': 1,
			'[[IsUnpairedSurrogate]]': true
		};
	}
	var second = $charCodeAt(string, position + 1);
	if (!isTrailingSurrogate(second)) {
		return {
			'[[CodePoint]]': cp,
			'[[CodeUnitCount]]': 1,
			'[[IsUnpairedSurrogate]]': true
		};
	}

	return {
		'[[CodePoint]]': UTF16DecodeSurrogatePair(first, second),
		'[[CodeUnitCount]]': 2,
		'[[IsUnpairedSurrogate]]': false
	};
};

var $abs = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%Math.abs%');

// http://262.ecma-international.org/5.1/#sec-5.2

var abs = function abs(x) {
	return $abs(x);
};

// var modulo = require('./modulo');
var $floor = Math.floor;

// http://262.ecma-international.org/5.1/#sec-5.2

var floor = function floor(x) {
	// return x - modulo(x, 1);
	return $floor(x);
};

var _isNaN = Number.isNaN || function isNaN(a) {
	return a !== a;
};

var $isNaN = Number.isNaN || function (a) { return a !== a; };

var _isFinite = Number.isFinite || function (x) { return typeof x === 'number' && !$isNaN(x) && x !== Infinity && x !== -Infinity; };

// https://ecma-international.org/ecma-262/6.0/#sec-isinteger

var IsInteger = function IsInteger(argument) {
	if (typeof argument !== 'number' || _isNaN(argument) || !_isFinite(argument)) {
		return false;
	}
	var absValue = abs(argument);
	return floor(absValue) === absValue;
};

var $Math = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%Math%');
var $Number = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%Number%');

var maxSafeInteger = $Number.MAX_SAFE_INTEGER || $Math.pow(2, 53) - 1;

var $TypeError$g = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%TypeError%');

// https://262.ecma-international.org/6.0/#sec-advancestringindex

var AdvanceStringIndex = function AdvanceStringIndex(S, index, unicode) {
	if (Type(S) !== 'String') {
		throw new $TypeError$g('Assertion failed: `S` must be a String');
	}
	if (!IsInteger(index) || index < 0 || index > maxSafeInteger) {
		throw new $TypeError$g('Assertion failed: `length` must be an integer >= 0 and <= 2**53');
	}
	if (Type(unicode) !== 'Boolean') {
		throw new $TypeError$g('Assertion failed: `unicode` must be a Boolean');
	}
	if (!unicode) {
		return index + 1;
	}
	var length = S.length;
	if ((index + 1) >= length) {
		return index + 1;
	}
	var cp = CodePointAt(S, index);
	return index + cp['[[CodeUnitCount]]'];
};

var $TypeError$f = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%TypeError%');

// http://262.ecma-international.org/5.1/#sec-9.10

var CheckObjectCoercible = function CheckObjectCoercible(value, optMessage) {
	if (value == null) {
		throw new $TypeError$f(optMessage || ('Cannot call method on ' + value));
	}
	return value;
};

var RequireObjectCoercible = CheckObjectCoercible;

var $Object$1 = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%Object%');



// https://ecma-international.org/ecma-262/6.0/#sec-toobject

var ToObject = function ToObject(value) {
	RequireObjectCoercible(value);
	return $Object$1(value);
};

var $TypeError$e = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%TypeError%');




/**
 * 7.3.2 GetV (V, P)
 * 1. Assert: IsPropertyKey(P) is true.
 * 2. Let O be ToObject(V).
 * 3. ReturnIfAbrupt(O).
 * 4. Return O.[[Get]](P, V).
 */

var GetV = function GetV(V, P) {
	// 7.3.2.1
	if (!IsPropertyKey(P)) {
		throw new $TypeError$e('Assertion failed: IsPropertyKey(P) is not true');
	}

	// 7.3.2.2-3
	var O = ToObject(V);

	// 7.3.2.4
	return O[P];
};

var fnToStr = Function.prototype.toString;
var reflectApply = typeof Reflect === 'object' && Reflect !== null && Reflect.apply;
var badArrayLike;
var isCallableMarker;
if (typeof reflectApply === 'function' && typeof Object.defineProperty === 'function') {
	try {
		badArrayLike = Object.defineProperty({}, 'length', {
			get: function () {
				throw isCallableMarker;
			}
		});
		isCallableMarker = {};
		// eslint-disable-next-line no-throw-literal
		reflectApply(function () { throw 42; }, null, badArrayLike);
	} catch (_) {
		if (_ !== isCallableMarker) {
			reflectApply = null;
		}
	}
} else {
	reflectApply = null;
}

var constructorRegex = /^\s*class\b/;
var isES6ClassFn = function isES6ClassFunction(value) {
	try {
		var fnStr = fnToStr.call(value);
		return constructorRegex.test(fnStr);
	} catch (e) {
		return false; // not a function
	}
};

var tryFunctionObject = function tryFunctionToStr(value) {
	try {
		if (isES6ClassFn(value)) { return false; }
		fnToStr.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr$1 = Object.prototype.toString;
var fnClass = '[object Function]';
var genClass = '[object GeneratorFunction]';
var hasToStringTag$2 = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
/* globals document: false */
var documentDotAll = typeof document === 'object' && typeof document.all === 'undefined' && document.all !== undefined ? document.all : {};

var C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_isCallable = reflectApply
	? function isCallable(value) {
		if (value === documentDotAll) { return true; }
		if (!value) { return false; }
		if (typeof value !== 'function' && typeof value !== 'object') { return false; }
		if (typeof value === 'function' && !value.prototype) { return true; }
		try {
			reflectApply(value, null, badArrayLike);
		} catch (e) {
			if (e !== isCallableMarker) { return false; }
		}
		return !isES6ClassFn(value);
	}
	: function isCallable(value) {
		if (value === documentDotAll) { return true; }
		if (!value) { return false; }
		if (typeof value !== 'function' && typeof value !== 'object') { return false; }
		if (typeof value === 'function' && !value.prototype) { return true; }
		if (hasToStringTag$2) { return tryFunctionObject(value); }
		if (isES6ClassFn(value)) { return false; }
		var strClass = toStr$1.call(value);
		return strClass === fnClass || strClass === genClass;
	};

// http://262.ecma-international.org/5.1/#sec-9.11

var IsCallable = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_isCallable;

var $TypeError$d = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%TypeError%');





/**
 * 7.3.9 - https://ecma-international.org/ecma-262/6.0/#sec-getmethod
 * 1. Assert: IsPropertyKey(P) is true.
 * 2. Let func be GetV(O, P).
 * 3. ReturnIfAbrupt(func).
 * 4. If func is either undefined or null, return undefined.
 * 5. If IsCallable(func) is false, throw a TypeError exception.
 * 6. Return func.
 */

var GetMethod$1 = function GetMethod(O, P) {
	// 7.3.9.1
	if (!IsPropertyKey(P)) {
		throw new $TypeError$d('Assertion failed: IsPropertyKey(P) is not true');
	}

	// 7.3.9.2
	var func = GetV(O, P);

	// 7.3.9.4
	if (func == null) {
		return void 0;
	}

	// 7.3.9.5
	if (!IsCallable(func)) {
		throw new $TypeError$d(P + 'is not a function');
	}

	// 7.3.9.6
	return func;
};

var $TypeError$c = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%TypeError%');
var $asyncIterator = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%Symbol.asyncIterator%', true);


var hasSymbols$2 = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_hasSymbols();








// https://262.ecma-international.org/9.0/#sec-getiterator
var GetIterator = function GetIterator(obj, hint, method) {
	var actualHint = hint;
	if (arguments.length < 2) {
		actualHint = 'sync';
	}
	if (actualHint !== 'sync' && actualHint !== 'async') {
		throw new $TypeError$c("Assertion failed: `hint` must be one of 'sync' or 'async', got " + C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_objectInspect(hint));
	}

	var actualMethod = method;
	if (arguments.length < 3) {
		if (actualHint === 'async') {
			if (hasSymbols$2 && $asyncIterator) {
				actualMethod = GetMethod$1(obj, $asyncIterator);
			}
			if (actualMethod === undefined) {
				throw new $TypeError$c("async from sync iterators aren't currently supported");
			}
		} else {
			actualMethod = getIteratorMethod(
				{
					AdvanceStringIndex: AdvanceStringIndex,
					GetMethod: GetMethod$1,
					IsArray: IsArray,
					Type: Type
				},
				obj
			);
		}
	}
	var iterator = Call(actualMethod, obj);
	if (Type(iterator) !== 'Object') {
		throw new $TypeError$c('iterator must return an object');
	}

	return iterator;

	// TODO: This should return an IteratorRecord
	/*
	var nextMethod = GetV(iterator, 'next');
	return {
		'[[Iterator]]': iterator,
		'[[NextMethod]]': nextMethod,
		'[[Done]]': false
	};
	*/
};

var $TypeError$b = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%TypeError%');






// https://ecma-international.org/ecma-262/6.0/#sec-iteratorclose

var IteratorClose = function IteratorClose(iterator, completion) {
	if (Type(iterator) !== 'Object') {
		throw new $TypeError$b('Assertion failed: Type(iterator) is not Object');
	}
	if (!IsCallable(completion)) {
		throw new $TypeError$b('Assertion failed: completion is not a thunk for a Completion Record');
	}
	var completionThunk = completion;

	var iteratorReturn = GetMethod$1(iterator, 'return');

	if (typeof iteratorReturn === 'undefined') {
		return completionThunk();
	}

	var completionRecord;
	try {
		var innerResult = Call(iteratorReturn, iterator, []);
	} catch (e) {
		// if we hit here, then "e" is the innerResult completion that needs re-throwing

		// if the completion is of type "throw", this will throw.
		completionThunk();
		completionThunk = null; // ensure it's not called twice.

		// if not, then return the innerResult completion
		throw e;
	}
	completionRecord = completionThunk(); // if innerResult worked, then throw if the completion does
	completionThunk = null; // ensure it's not called twice.

	if (Type(innerResult) !== 'Object') {
		throw new $TypeError$b('iterator .return must return an object');
	}

	return completionRecord;
};

// http://262.ecma-international.org/5.1/#sec-9.2

var ToBoolean = function ToBoolean(value) { return !!value; };

var $TypeError$a = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%TypeError%');





// https://ecma-international.org/ecma-262/6.0/#sec-iteratorcomplete

var IteratorComplete = function IteratorComplete(iterResult) {
	if (Type(iterResult) !== 'Object') {
		throw new $TypeError$a('Assertion failed: Type(iterResult) is not Object');
	}
	return ToBoolean(Get(iterResult, 'done'));
};

var $TypeError$9 = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%TypeError%');






// https://ecma-international.org/ecma-262/6.0/#sec-invoke

var Invoke = function Invoke(O, P) {
	if (!IsPropertyKey(P)) {
		throw new $TypeError$9('Assertion failed: P must be a Property Key');
	}
	var argumentsList = arguments.length > 2 ? arguments[2] : [];
	if (!IsArray(argumentsList)) {
		throw new $TypeError$9('Assertion failed: optional `argumentsList`, if provided, must be a List');
	}
	var func = GetV(O, P);
	return Call(func, O, argumentsList);
};

var $TypeError$8 = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%TypeError%');




// https://ecma-international.org/ecma-262/6.0/#sec-iteratornext

var IteratorNext = function IteratorNext(iterator, value) {
	var result = Invoke(iterator, 'next', arguments.length < 2 ? [] : [value]);
	if (Type(result) !== 'Object') {
		throw new $TypeError$8('iterator next must return an object');
	}
	return result;
};

// https://ecma-international.org/ecma-262/6.0/#sec-iteratorstep

var IteratorStep = function IteratorStep(iterator) {
	var result = IteratorNext(iterator);
	var done = IteratorComplete(result);
	return done === true ? false : result;
};

var $TypeError$7 = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%TypeError%');




// https://ecma-international.org/ecma-262/6.0/#sec-iteratorvalue

var IteratorValue = function IteratorValue(iterResult) {
	if (Type(iterResult) !== 'Object') {
		throw new $TypeError$7('Assertion failed: Type(iterResult) is not Object');
	}
	return Get(iterResult, 'value');
};

var $TypeError$6 = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%TypeError%');










// https://262.ecma-international.org/10.0//#sec-add-entries-from-iterable

var AddEntriesFromIterable = function AddEntriesFromIterable(target, iterable, adder) {
	if (!IsCallable(adder)) {
		throw new $TypeError$6('Assertion failed: `adder` is not callable');
	}
	if (iterable == null) {
		throw new $TypeError$6('Assertion failed: `iterable` is present, and not nullish');
	}
	var iteratorRecord = GetIterator(iterable);
	while (true) { // eslint-disable-line no-constant-condition
		var next = IteratorStep(iteratorRecord);
		if (!next) {
			return target;
		}
		var nextItem = IteratorValue(next);
		if (Type(nextItem) !== 'Object') {
			var error = new $TypeError$6('iterator next must return an Object, got ' + C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_objectInspect(nextItem));
			return IteratorClose(
				iteratorRecord,
				function () { throw error; } // eslint-disable-line no-loop-func
			);
		}
		try {
			var k = Get(nextItem, '0');
			var v = Get(nextItem, '1');
			Call(adder, target, [k, v]);
		} catch (e) {
			return IteratorClose(
				iteratorRecord,
				function () { throw e; }
			);
		}
	}
};

var $defineProperty = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%Object.defineProperty%', true);

if ($defineProperty) {
	try {
		$defineProperty({}, 'a', { value: 1 });
	} catch (e) {
		// IE 8 has a broken defineProperty
		$defineProperty = null;
	}
}



var $isEnumerable$1 = callBound('Object.prototype.propertyIsEnumerable');

// eslint-disable-next-line max-params
var DefineOwnProperty = function DefineOwnProperty(IsDataDescriptor, SameValue, FromPropertyDescriptor, O, P, desc) {
	if (!$defineProperty) {
		if (!IsDataDescriptor(desc)) {
			// ES3 does not support getters/setters
			return false;
		}
		if (!desc['[[Configurable]]'] || !desc['[[Writable]]']) {
			return false;
		}

		// fallback for ES3
		if (P in O && $isEnumerable$1(O, P) !== !!desc['[[Enumerable]]']) {
			// a non-enumerable existing property
			return false;
		}

		// property does not exist at all, or exists but is enumerable
		var V = desc['[[Value]]'];
		// eslint-disable-next-line no-param-reassign
		O[P] = V; // will use [[Define]]
		return SameValue(O[P], V);
	}
	$defineProperty(O, P, FromPropertyDescriptor(desc));
	return true;
};

var $TypeError$5 = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%TypeError%');
var $SyntaxError = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%SyntaxError%');



var predicates = {
	// https://262.ecma-international.org/6.0/#sec-property-descriptor-specification-type
	'Property Descriptor': function isPropertyDescriptor(Type, Desc) {
		if (Type(Desc) !== 'Object') {
			return false;
		}
		var allowed = {
			'[[Configurable]]': true,
			'[[Enumerable]]': true,
			'[[Get]]': true,
			'[[Set]]': true,
			'[[Value]]': true,
			'[[Writable]]': true
		};

		for (var key in Desc) { // eslint-disable-line
			if (C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_has_src(Desc, key) && !allowed[key]) {
				return false;
			}
		}

		var isData = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_has_src(Desc, '[[Value]]');
		var IsAccessor = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_has_src(Desc, '[[Get]]') || C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_has_src(Desc, '[[Set]]');
		if (isData && IsAccessor) {
			throw new $TypeError$5('Property Descriptors may not be both accessor and data descriptors');
		}
		return true;
	}
};

var assertRecord = function assertRecord(Type, recordType, argumentName, value) {
	var predicate = predicates[recordType];
	if (typeof predicate !== 'function') {
		throw new $SyntaxError('unknown record type: ' + recordType);
	}
	if (!predicate(Type, value)) {
		throw new $TypeError$5(argumentName + ' must be a ' + recordType);
	}
};

// https://ecma-international.org/ecma-262/6.0/#sec-frompropertydescriptor

var FromPropertyDescriptor = function FromPropertyDescriptor(Desc) {
	if (typeof Desc === 'undefined') {
		return Desc;
	}

	assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

	var obj = {};
	if ('[[Value]]' in Desc) {
		obj.value = Desc['[[Value]]'];
	}
	if ('[[Writable]]' in Desc) {
		obj.writable = Desc['[[Writable]]'];
	}
	if ('[[Get]]' in Desc) {
		obj.get = Desc['[[Get]]'];
	}
	if ('[[Set]]' in Desc) {
		obj.set = Desc['[[Set]]'];
	}
	if ('[[Enumerable]]' in Desc) {
		obj.enumerable = Desc['[[Enumerable]]'];
	}
	if ('[[Configurable]]' in Desc) {
		obj.configurable = Desc['[[Configurable]]'];
	}
	return obj;
};

var $gOPD = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%Object.getOwnPropertyDescriptor%');
if ($gOPD) {
	try {
		$gOPD([], 'length');
	} catch (e) {
		// IE 8 has a broken gOPD
		$gOPD = null;
	}
}

var getOwnPropertyDescriptor = $gOPD;

var hasSymbols$1 = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_hasSymbols();
var hasToStringTag$1 = hasSymbols$1 && typeof Symbol.toStringTag === 'symbol';
var has;
var $exec;
var isRegexMarker;
var badStringifier;

if (hasToStringTag$1) {
	has = callBound('Object.prototype.hasOwnProperty');
	$exec = callBound('RegExp.prototype.exec');
	isRegexMarker = {};

	var throwRegexMarker = function () {
		throw isRegexMarker;
	};
	badStringifier = {
		toString: throwRegexMarker,
		valueOf: throwRegexMarker
	};

	if (typeof Symbol.toPrimitive === 'symbol') {
		badStringifier[Symbol.toPrimitive] = throwRegexMarker;
	}
}

var $toString = callBound('Object.prototype.toString');
var gOPD = Object.getOwnPropertyDescriptor;
var regexClass = '[object RegExp]';

var C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_isRegex = hasToStringTag$1
	// eslint-disable-next-line consistent-return
	? function isRegex(value) {
		if (!value || typeof value !== 'object') {
			return false;
		}

		var descriptor = gOPD(value, 'lastIndex');
		var hasLastIndexDataProperty = descriptor && has(descriptor, 'value');
		if (!hasLastIndexDataProperty) {
			return false;
		}

		try {
			$exec(value, badStringifier);
		} catch (e) {
			return e === isRegexMarker;
		}
	}
	: function isRegex(value) {
		// In older browsers, typeof regex incorrectly returns 'function'
		if (!value || (typeof value !== 'object' && typeof value !== 'function')) {
			return false;
		}

		return $toString(value) === regexClass;
	};

var $match = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%Symbol.match%', true);





// https://ecma-international.org/ecma-262/6.0/#sec-isregexp

var IsRegExp = function IsRegExp(argument) {
	if (!argument || typeof argument !== 'object') {
		return false;
	}
	if ($match) {
		var isRegExp = argument[$match];
		if (typeof isRegExp !== 'undefined') {
			return ToBoolean(isRegExp);
		}
	}
	return C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_isRegex(argument);
};

var $TypeError$4 = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%TypeError%');





// https://262.ecma-international.org/5.1/#sec-8.10.5

var ToPropertyDescriptor = function ToPropertyDescriptor(Obj) {
	if (Type(Obj) !== 'Object') {
		throw new $TypeError$4('ToPropertyDescriptor requires an object');
	}

	var desc = {};
	if (C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_has_src(Obj, 'enumerable')) {
		desc['[[Enumerable]]'] = ToBoolean(Obj.enumerable);
	}
	if (C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_has_src(Obj, 'configurable')) {
		desc['[[Configurable]]'] = ToBoolean(Obj.configurable);
	}
	if (C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_has_src(Obj, 'value')) {
		desc['[[Value]]'] = Obj.value;
	}
	if (C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_has_src(Obj, 'writable')) {
		desc['[[Writable]]'] = ToBoolean(Obj.writable);
	}
	if (C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_has_src(Obj, 'get')) {
		var getter = Obj.get;
		if (typeof getter !== 'undefined' && !IsCallable(getter)) {
			throw new $TypeError$4('getter must be a function');
		}
		desc['[[Get]]'] = getter;
	}
	if (C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_has_src(Obj, 'set')) {
		var setter = Obj.set;
		if (typeof setter !== 'undefined' && !IsCallable(setter)) {
			throw new $TypeError$4('setter must be a function');
		}
		desc['[[Set]]'] = setter;
	}

	if ((C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_has_src(desc, '[[Get]]') || C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_has_src(desc, '[[Set]]')) && (C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_has_src(desc, '[[Value]]') || C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_has_src(desc, '[[Writable]]'))) {
		throw new $TypeError$4('Invalid property descriptor. Cannot both specify accessors and a value or writable attribute');
	}
	return desc;
};

var $TypeError$3 = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%TypeError%');



var $isEnumerable = callBound('Object.prototype.propertyIsEnumerable');









// https://ecma-international.org/ecma-262/6.0/#sec-ordinarygetownproperty

var OrdinaryGetOwnProperty = function OrdinaryGetOwnProperty(O, P) {
	if (Type(O) !== 'Object') {
		throw new $TypeError$3('Assertion failed: O must be an Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError$3('Assertion failed: P must be a Property Key');
	}
	if (!C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_has_src(O, P)) {
		return void 0;
	}
	if (!getOwnPropertyDescriptor) {
		// ES3 / IE 8 fallback
		var arrayLength = IsArray(O) && P === 'length';
		var regexLastIndex = IsRegExp(O) && P === 'lastIndex';
		return {
			'[[Configurable]]': !(arrayLength || regexLastIndex),
			'[[Enumerable]]': $isEnumerable(O, P),
			'[[Value]]': O[P],
			'[[Writable]]': true
		};
	}
	return ToPropertyDescriptor(getOwnPropertyDescriptor(O, P));
};

// https://ecma-international.org/ecma-262/6.0/#sec-isdatadescriptor

var IsDataDescriptor = function IsDataDescriptor(Desc) {
	if (typeof Desc === 'undefined') {
		return false;
	}

	assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

	if (!C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_has_src(Desc, '[[Value]]') && !C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_has_src(Desc, '[[Writable]]')) {
		return false;
	}

	return true;
};

var isPrimitive$1 = function isPrimitive(value) {
	return value === null || (typeof value !== 'function' && typeof value !== 'object');
};

var $Object = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%Object%');



var $preventExtensions = $Object.preventExtensions;
var $isExtensible = $Object.isExtensible;

// https://ecma-international.org/ecma-262/6.0/#sec-isextensible-o

var IsExtensible = $preventExtensions
	? function IsExtensible(obj) {
		return !isPrimitive$1(obj) && $isExtensible(obj);
	}
	: function IsExtensible(obj) {
		return !isPrimitive$1(obj);
	};

// http://262.ecma-international.org/5.1/#sec-9.12

var SameValue = function SameValue(x, y) {
	if (x === y) { // 0 === -0, but they are not identical.
		if (x === 0) { return 1 / x === 1 / y; }
		return true;
	}
	return _isNaN(x) && _isNaN(y);
};

var $TypeError$2 = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%TypeError%');











// https://ecma-international.org/ecma-262/6.0/#sec-createdataproperty

var CreateDataProperty = function CreateDataProperty(O, P, V) {
	if (Type(O) !== 'Object') {
		throw new $TypeError$2('Assertion failed: Type(O) is not Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError$2('Assertion failed: IsPropertyKey(P) is not true');
	}
	var oldDesc = OrdinaryGetOwnProperty(O, P);
	var extensible = !oldDesc || IsExtensible(O);
	var immutable = oldDesc && (!oldDesc['[[Writable]]'] || !oldDesc['[[Configurable]]']);
	if (immutable || !extensible) {
		return false;
	}
	return DefineOwnProperty(
		IsDataDescriptor,
		SameValue,
		FromPropertyDescriptor,
		O,
		P,
		{
			'[[Configurable]]': true,
			'[[Enumerable]]': true,
			'[[Value]]': V,
			'[[Writable]]': true
		}
	);
};

var $TypeError$1 = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%TypeError%');





// // https://ecma-international.org/ecma-262/6.0/#sec-createdatapropertyorthrow

var CreateDataPropertyOrThrow = function CreateDataPropertyOrThrow(O, P, V) {
	if (Type(O) !== 'Object') {
		throw new $TypeError$1('Assertion failed: Type(O) is not Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError$1('Assertion failed: IsPropertyKey(P) is not true');
	}
	var success = CreateDataProperty(O, P, V);
	if (!success) {
		throw new $TypeError$1('unable to create data property');
	}
	return success;
};

var isPrimitive = function isPrimitive(value) {
	return value === null || (typeof value !== 'function' && typeof value !== 'object');
};

var getDay = Date.prototype.getDay;
var tryDateObject = function tryDateGetDayCall(value) {
	try {
		getDay.call(value);
		return true;
	} catch (e) {
		return false;
	}
};

var toStr = Object.prototype.toString;
var dateClass = '[object Date]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

var C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_isDateObject = function isDateObject(value) {
	if (typeof value !== 'object' || value === null) {
		return false;
	}
	return hasToStringTag ? tryDateObject(value) : toStr.call(value) === dateClass;
};

var C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_isSymbol = createCommonjsModule(function (module) {

var toStr = Object.prototype.toString;
var hasSymbols = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_hasSymbols();

if (hasSymbols) {
	var symToStr = Symbol.prototype.toString;
	var symStringRegex = /^Symbol\(.*\)$/;
	var isSymbolObject = function isRealSymbolObject(value) {
		if (typeof value.valueOf() !== 'symbol') {
			return false;
		}
		return symStringRegex.test(symToStr.call(value));
	};

	module.exports = function isSymbol(value) {
		if (typeof value === 'symbol') {
			return true;
		}
		if (toStr.call(value) !== '[object Symbol]') {
			return false;
		}
		try {
			return isSymbolObject(value);
		} catch (e) {
			return false;
		}
	};
} else {

	module.exports = function isSymbol(value) {
		// this environment does not support Symbols.
		return false ;
	};
}
});

var hasSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol';






var ordinaryToPrimitive = function OrdinaryToPrimitive(O, hint) {
	if (typeof O === 'undefined' || O === null) {
		throw new TypeError('Cannot call method on ' + O);
	}
	if (typeof hint !== 'string' || (hint !== 'number' && hint !== 'string')) {
		throw new TypeError('hint must be "string" or "number"');
	}
	var methodNames = hint === 'string' ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
	var method, result, i;
	for (i = 0; i < methodNames.length; ++i) {
		method = O[methodNames[i]];
		if (C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_isCallable(method)) {
			result = method.call(O);
			if (isPrimitive(result)) {
				return result;
			}
		}
	}
	throw new TypeError('No default value');
};

var GetMethod = function GetMethod(O, P) {
	var func = O[P];
	if (func !== null && typeof func !== 'undefined') {
		if (!C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_isCallable(func)) {
			throw new TypeError(func + ' returned for property ' + P + ' of object ' + O + ' is not a function');
		}
		return func;
	}
	return void 0;
};

// http://www.ecma-international.org/ecma-262/6.0/#sec-toprimitive
var es2015 = function ToPrimitive(input) {
	if (isPrimitive(input)) {
		return input;
	}
	var hint = 'default';
	if (arguments.length > 1) {
		if (arguments[1] === String) {
			hint = 'string';
		} else if (arguments[1] === Number) {
			hint = 'number';
		}
	}

	var exoticToPrim;
	if (hasSymbols) {
		if (Symbol.toPrimitive) {
			exoticToPrim = GetMethod(input, Symbol.toPrimitive);
		} else if (C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_isSymbol(input)) {
			exoticToPrim = Symbol.prototype.valueOf;
		}
	}
	if (typeof exoticToPrim !== 'undefined') {
		var result = exoticToPrim.call(input, hint);
		if (isPrimitive(result)) {
			return result;
		}
		throw new TypeError('unable to convert exotic object to primitive');
	}
	if (hint === 'default' && (C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_isDateObject(input) || C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_isSymbol(input))) {
		hint = 'string';
	}
	return ordinaryToPrimitive(input, hint === 'default' ? 'number' : hint);
};

// https://ecma-international.org/ecma-262/6.0/#sec-toprimitive

var ToPrimitive = function ToPrimitive(input) {
	if (arguments.length > 1) {
		return es2015(input, arguments[1]);
	}
	return es2015(input);
};

var $String$1 = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%String%');
var $TypeError = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%TypeError%');

// https://ecma-international.org/ecma-262/6.0/#sec-tostring

var ToString = function ToString(argument) {
	if (typeof argument === 'symbol') {
		throw new $TypeError('Cannot convert a Symbol value to a string');
	}
	return $String$1(argument);
};

var $String = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_getIntrinsic('%String%');




// https://ecma-international.org/ecma-262/6.0/#sec-topropertykey

var ToPropertyKey = function ToPropertyKey(argument) {
	var key = ToPrimitive(argument, $String);
	return typeof key === 'symbol' ? key : ToString(key);
};

var adder = function addDataProperty(key, value) {
	var O = this; // eslint-disable-line no-invalid-this
	var propertyKey = ToPropertyKey(key);
	CreateDataPropertyOrThrow(O, propertyKey, value);
};

var implementation = function fromEntries(iterable) {
	RequireObjectCoercible(iterable);

	return AddEntriesFromIterable({}, iterable, adder);
};

var polyfill$1 = function getPolyfill() {
	return typeof Object.fromEntries === 'function' ? Object.fromEntries : implementation;
};

var shim = function shimEntries() {
	var polyfill = polyfill$1();
	C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_defineProperties(Object, { fromEntries: polyfill }, {
		fromEntries: function testEntries() {
			return Object.fromEntries !== polyfill;
		}
	});
	return polyfill;
};

var polyfill = C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_callBind(polyfill$1(), Object);

C__Users_jvalentine_Documents_GitHub_Personal_obsidianAdmonition_node_modules_defineProperties(polyfill, {
	getPolyfill: polyfill$1,
	implementation: implementation,
	shim: shim
});

var object_fromentries = polyfill;

if (!Object.fromEntries) {
    //incorrect @types definition
    //I tested that this correctly shims without error
    //@ts-expect-error
    object_fromentries.shim();
}
const ADMONITION_MAP = {
    note: "note",
    seealso: "note",
    abstract: "abstract",
    summary: "abstract",
    info: "info",
    todo: "todo",
    tip: "tip",
    hint: "tip",
    important: "tip",
    success: "success",
    check: "check",
    done: "done",
    question: "question",
    help: "question",
    faq: "question",
    warning: "warning",
    caution: "warning",
    attention: "warning",
    failure: "failure",
    fail: "failure",
    missing: "failure",
    danger: "danger",
    error: "danger",
    bug: "bug",
    example: "example",
    quote: "quote",
    cite: "quote"
};
class ObsidianAdmonition extends obsidian.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Obsidian Admonition loaded");
            Object.keys(ADMONITION_MAP).forEach((type) => this.registerMarkdownCodeBlockProcessor(`ad-${type}`, this.postprocessor.bind(this, type)));
            let data = yield this.loadData();
            if (!data || !data.warned) {
                new obsidian.Notice(`Please note, the syntax for Obsidian Admonition has changed.\n\nYou must prefix your admonitions with "ad-" now.`, 10000);
                yield this.saveData({ warned: true });
            }
        });
    }
    postprocessor(type, src, el, ctx) {
        try {
            /**
             * Find title and collapse parameters.
             */
            let matchedParameters = src.match(/^\b(title|collapse)\b:([\s\S]*?)$/gm) || [];
            let params = Object.fromEntries(matchedParameters.map((p) => p.split(/:\s?/).map((s) => s.trim())));
            let { title = type[0].toUpperCase() + type.slice(1).toLowerCase(), collapse } = params;
            /**
             * Get the content. Content should be everything that is not the title or collapse parameters.
             * Remove any "content: " fields (legacy from < v0.2.0)
             */
            let content = src.replace(/^\b(title|collapse)\b:([\s\S]*?)$/gm, "");
            content = content.replace(/^\bcontent\b:\s?/gm, "");
            /**
             * If the admonition should collapse, but something other than open or closed was provided, set to closed.
             */
            if (Object.prototype.hasOwnProperty.call(params, "collapse") &&
                (params.collapse.length == 0 ||
                    params.collapse === undefined ||
                    collapse !== "open")) {
                collapse = "closed";
            }
            /**
             * If the admonition should collapse, but title was blanked, set the default title.
             */
            if (Object.prototype.hasOwnProperty.call(params, "title") &&
                (params.title === undefined || params.title.length === 0) &&
                collapse) {
                title = type[0].toUpperCase() + type.slice(1).toLowerCase();
                new obsidian.Notice("An admonition must have a title if it is collapsible.");
            }
            /**
             * Build the correct admonition element.
             * Collapsible -> <details> <summary> Title </summary> <div> Content </div> </details>
             * Regular -> <div> <div> Title </div> <div> Content </div> </div>
             */
            let admonitionElement = this.getAdmonitionElement(type, title, collapse);
            /**
             * Create a unloadable component.
             */
            let admonitionContent = admonitionElement.createDiv({
                cls: "admonition-content"
            });
            let markdownRenderChild = new obsidian.MarkdownRenderChild();
            markdownRenderChild.containerEl = admonitionElement;
            /**
             * Render the content as markdown and append it to the admonition.
             */
            obsidian.MarkdownRenderer.renderMarkdown(content, admonitionContent, ctx.sourcePath, markdownRenderChild);
            /**
             * Replace the <pre> tag with the new admonition.
             */
            el.replaceWith(admonitionElement);
        }
        catch (e) {
            console.error(e);
            const pre = createEl("pre");
            pre.createEl("code", {
                attr: {
                    style: `color: var(--text-error) !important`
                }
            }).createSpan({
                text: "There was an error rendering the admonition:" +
                    "\n\n" +
                    src
            });
            el.replaceWith(pre);
        }
    }
    getAdmonitionElement(type, title, collapse) {
        let admonition;
        if (collapse) {
            let attrs;
            if (collapse === "open") {
                attrs = { open: "open" };
            }
            else {
                attrs = {};
            }
            admonition = createEl("details", {
                cls: `admonition admonition-${type}`,
                attr: attrs
            });
            admonition.createEl("summary", {
                cls: `admonition-title ${!title.trim().length ? "no-title" : ""}`,
                text: title
            });
        }
        else {
            admonition = createDiv({
                cls: `admonition admonition-${type}`
            });
            admonition.createDiv({
                cls: `admonition-title ${!title.trim().length ? "no-title" : ""}`,
                text: title
            });
        }
        return admonition;
    }
    onunload() {
        console.log("Obsidian Admonition unloaded");
    }
}

module.exports = ObsidianAdmonition;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tYWRtb25pdGlvbi9ub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2LmpzIiwiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tYWRtb25pdGlvbi9ub2RlX21vZHVsZXMvb2JqZWN0LWtleXMvaXNBcmd1bWVudHMuanMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1hZG1vbml0aW9uL25vZGVfbW9kdWxlcy9vYmplY3Qta2V5cy9pbXBsZW1lbnRhdGlvbi5qcyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLWFkbW9uaXRpb24vbm9kZV9tb2R1bGVzL29iamVjdC1rZXlzL2luZGV4LmpzIiwiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tYWRtb25pdGlvbi9ub2RlX21vZHVsZXMvZGVmaW5lLXByb3BlcnRpZXMvaW5kZXguanMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1hZG1vbml0aW9uL25vZGVfbW9kdWxlcy9mdW5jdGlvbi1iaW5kL2ltcGxlbWVudGF0aW9uLmpzIiwiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tYWRtb25pdGlvbi9ub2RlX21vZHVsZXMvZnVuY3Rpb24tYmluZC9pbmRleC5qcyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLWFkbW9uaXRpb24vbm9kZV9tb2R1bGVzL2hhcy1zeW1ib2xzL3NoYW1zLmpzIiwiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tYWRtb25pdGlvbi9ub2RlX21vZHVsZXMvaGFzLXN5bWJvbHMvaW5kZXguanMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1hZG1vbml0aW9uL25vZGVfbW9kdWxlcy9oYXMvc3JjL2luZGV4LmpzIiwiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tYWRtb25pdGlvbi9ub2RlX21vZHVsZXMvZ2V0LWludHJpbnNpYy9pbmRleC5qcyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLWFkbW9uaXRpb24vbm9kZV9tb2R1bGVzL2NhbGwtYmluZC9pbmRleC5qcyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLWFkbW9uaXRpb24vbm9kZV9tb2R1bGVzL29iamVjdC1pbnNwZWN0L3V0aWwuaW5zcGVjdC5qcyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLWFkbW9uaXRpb24vbm9kZV9tb2R1bGVzL29iamVjdC1pbnNwZWN0L2luZGV4LmpzIiwiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tYWRtb25pdGlvbi9ub2RlX21vZHVsZXMvY2FsbC1iaW5kL2NhbGxCb3VuZC5qcyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLWFkbW9uaXRpb24vbm9kZV9tb2R1bGVzL2VzLWFic3RyYWN0LzIwMjAvSXNBcnJheS5qcyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLWFkbW9uaXRpb24vbm9kZV9tb2R1bGVzL2VzLWFic3RyYWN0LzIwMjAvQ2FsbC5qcyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLWFkbW9uaXRpb24vbm9kZV9tb2R1bGVzL2VzLWFic3RyYWN0LzIwMjAvSXNQcm9wZXJ0eUtleS5qcyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLWFkbW9uaXRpb24vbm9kZV9tb2R1bGVzL2VzLWFic3RyYWN0LzUvVHlwZS5qcyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLWFkbW9uaXRpb24vbm9kZV9tb2R1bGVzL2VzLWFic3RyYWN0LzIwMjAvVHlwZS5qcyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLWFkbW9uaXRpb24vbm9kZV9tb2R1bGVzL2VzLWFic3RyYWN0LzIwMjAvR2V0LmpzIiwiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tYWRtb25pdGlvbi9ub2RlX21vZHVsZXMvZXMtYWJzdHJhY3QvaGVscGVycy9nZXRJdGVyYXRvck1ldGhvZC5qcyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLWFkbW9uaXRpb24vbm9kZV9tb2R1bGVzL2VzLWFic3RyYWN0L2hlbHBlcnMvaXNMZWFkaW5nU3Vycm9nYXRlLmpzIiwiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tYWRtb25pdGlvbi9ub2RlX21vZHVsZXMvZXMtYWJzdHJhY3QvaGVscGVycy9pc1RyYWlsaW5nU3Vycm9nYXRlLmpzIiwiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tYWRtb25pdGlvbi9ub2RlX21vZHVsZXMvZXMtYWJzdHJhY3QvMjAyMC9VVEYxNkRlY29kZVN1cnJvZ2F0ZVBhaXIuanMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1hZG1vbml0aW9uL25vZGVfbW9kdWxlcy9lcy1hYnN0cmFjdC8yMDIwL0NvZGVQb2ludEF0LmpzIiwiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tYWRtb25pdGlvbi9ub2RlX21vZHVsZXMvZXMtYWJzdHJhY3QvMjAyMC9hYnMuanMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1hZG1vbml0aW9uL25vZGVfbW9kdWxlcy9lcy1hYnN0cmFjdC8yMDIwL2Zsb29yLmpzIiwiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tYWRtb25pdGlvbi9ub2RlX21vZHVsZXMvZXMtYWJzdHJhY3QvaGVscGVycy9pc05hTi5qcyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLWFkbW9uaXRpb24vbm9kZV9tb2R1bGVzL2VzLWFic3RyYWN0L2hlbHBlcnMvaXNGaW5pdGUuanMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1hZG1vbml0aW9uL25vZGVfbW9kdWxlcy9lcy1hYnN0cmFjdC8yMDIwL0lzSW50ZWdlci5qcyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLWFkbW9uaXRpb24vbm9kZV9tb2R1bGVzL2VzLWFic3RyYWN0L2hlbHBlcnMvbWF4U2FmZUludGVnZXIuanMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1hZG1vbml0aW9uL25vZGVfbW9kdWxlcy9lcy1hYnN0cmFjdC8yMDIwL0FkdmFuY2VTdHJpbmdJbmRleC5qcyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLWFkbW9uaXRpb24vbm9kZV9tb2R1bGVzL2VzLWFic3RyYWN0LzUvQ2hlY2tPYmplY3RDb2VyY2libGUuanMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1hZG1vbml0aW9uL25vZGVfbW9kdWxlcy9lcy1hYnN0cmFjdC8yMDIwL1JlcXVpcmVPYmplY3RDb2VyY2libGUuanMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1hZG1vbml0aW9uL25vZGVfbW9kdWxlcy9lcy1hYnN0cmFjdC8yMDIwL1RvT2JqZWN0LmpzIiwiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tYWRtb25pdGlvbi9ub2RlX21vZHVsZXMvZXMtYWJzdHJhY3QvMjAyMC9HZXRWLmpzIiwiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tYWRtb25pdGlvbi9ub2RlX21vZHVsZXMvaXMtY2FsbGFibGUvaW5kZXguanMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1hZG1vbml0aW9uL25vZGVfbW9kdWxlcy9lcy1hYnN0cmFjdC8yMDIwL0lzQ2FsbGFibGUuanMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1hZG1vbml0aW9uL25vZGVfbW9kdWxlcy9lcy1hYnN0cmFjdC8yMDIwL0dldE1ldGhvZC5qcyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLWFkbW9uaXRpb24vbm9kZV9tb2R1bGVzL2VzLWFic3RyYWN0LzIwMjAvR2V0SXRlcmF0b3IuanMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1hZG1vbml0aW9uL25vZGVfbW9kdWxlcy9lcy1hYnN0cmFjdC8yMDIwL0l0ZXJhdG9yQ2xvc2UuanMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1hZG1vbml0aW9uL25vZGVfbW9kdWxlcy9lcy1hYnN0cmFjdC8yMDIwL1RvQm9vbGVhbi5qcyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLWFkbW9uaXRpb24vbm9kZV9tb2R1bGVzL2VzLWFic3RyYWN0LzIwMjAvSXRlcmF0b3JDb21wbGV0ZS5qcyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLWFkbW9uaXRpb24vbm9kZV9tb2R1bGVzL2VzLWFic3RyYWN0LzIwMjAvSW52b2tlLmpzIiwiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tYWRtb25pdGlvbi9ub2RlX21vZHVsZXMvZXMtYWJzdHJhY3QvMjAyMC9JdGVyYXRvck5leHQuanMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1hZG1vbml0aW9uL25vZGVfbW9kdWxlcy9lcy1hYnN0cmFjdC8yMDIwL0l0ZXJhdG9yU3RlcC5qcyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLWFkbW9uaXRpb24vbm9kZV9tb2R1bGVzL2VzLWFic3RyYWN0LzIwMjAvSXRlcmF0b3JWYWx1ZS5qcyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLWFkbW9uaXRpb24vbm9kZV9tb2R1bGVzL2VzLWFic3RyYWN0LzIwMjAvQWRkRW50cmllc0Zyb21JdGVyYWJsZS5qcyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLWFkbW9uaXRpb24vbm9kZV9tb2R1bGVzL2VzLWFic3RyYWN0L2hlbHBlcnMvRGVmaW5lT3duUHJvcGVydHkuanMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1hZG1vbml0aW9uL25vZGVfbW9kdWxlcy9lcy1hYnN0cmFjdC9oZWxwZXJzL2Fzc2VydFJlY29yZC5qcyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLWFkbW9uaXRpb24vbm9kZV9tb2R1bGVzL2VzLWFic3RyYWN0LzIwMjAvRnJvbVByb3BlcnR5RGVzY3JpcHRvci5qcyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLWFkbW9uaXRpb24vbm9kZV9tb2R1bGVzL2VzLWFic3RyYWN0L2hlbHBlcnMvZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLmpzIiwiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tYWRtb25pdGlvbi9ub2RlX21vZHVsZXMvaXMtcmVnZXgvaW5kZXguanMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1hZG1vbml0aW9uL25vZGVfbW9kdWxlcy9lcy1hYnN0cmFjdC8yMDIwL0lzUmVnRXhwLmpzIiwiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tYWRtb25pdGlvbi9ub2RlX21vZHVsZXMvZXMtYWJzdHJhY3QvMjAyMC9Ub1Byb3BlcnR5RGVzY3JpcHRvci5qcyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLWFkbW9uaXRpb24vbm9kZV9tb2R1bGVzL2VzLWFic3RyYWN0LzIwMjAvT3JkaW5hcnlHZXRPd25Qcm9wZXJ0eS5qcyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLWFkbW9uaXRpb24vbm9kZV9tb2R1bGVzL2VzLWFic3RyYWN0LzIwMjAvSXNEYXRhRGVzY3JpcHRvci5qcyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLWFkbW9uaXRpb24vbm9kZV9tb2R1bGVzL2VzLWFic3RyYWN0L2hlbHBlcnMvaXNQcmltaXRpdmUuanMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1hZG1vbml0aW9uL25vZGVfbW9kdWxlcy9lcy1hYnN0cmFjdC8yMDIwL0lzRXh0ZW5zaWJsZS5qcyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLWFkbW9uaXRpb24vbm9kZV9tb2R1bGVzL2VzLWFic3RyYWN0LzIwMjAvU2FtZVZhbHVlLmpzIiwiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tYWRtb25pdGlvbi9ub2RlX21vZHVsZXMvZXMtYWJzdHJhY3QvMjAyMC9DcmVhdGVEYXRhUHJvcGVydHkuanMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1hZG1vbml0aW9uL25vZGVfbW9kdWxlcy9lcy1hYnN0cmFjdC8yMDIwL0NyZWF0ZURhdGFQcm9wZXJ0eU9yVGhyb3cuanMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1hZG1vbml0aW9uL25vZGVfbW9kdWxlcy9lcy10by1wcmltaXRpdmUvaGVscGVycy9pc1ByaW1pdGl2ZS5qcyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLWFkbW9uaXRpb24vbm9kZV9tb2R1bGVzL2lzLWRhdGUtb2JqZWN0L2luZGV4LmpzIiwiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tYWRtb25pdGlvbi9ub2RlX21vZHVsZXMvaXMtc3ltYm9sL2luZGV4LmpzIiwiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tYWRtb25pdGlvbi9ub2RlX21vZHVsZXMvZXMtdG8tcHJpbWl0aXZlL2VzMjAxNS5qcyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLWFkbW9uaXRpb24vbm9kZV9tb2R1bGVzL2VzLWFic3RyYWN0LzIwMjAvVG9QcmltaXRpdmUuanMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1hZG1vbml0aW9uL25vZGVfbW9kdWxlcy9lcy1hYnN0cmFjdC8yMDIwL1RvU3RyaW5nLmpzIiwiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tYWRtb25pdGlvbi9ub2RlX21vZHVsZXMvZXMtYWJzdHJhY3QvMjAyMC9Ub1Byb3BlcnR5S2V5LmpzIiwiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tYWRtb25pdGlvbi9ub2RlX21vZHVsZXMvb2JqZWN0LmZyb21lbnRyaWVzL2ltcGxlbWVudGF0aW9uLmpzIiwiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tYWRtb25pdGlvbi9ub2RlX21vZHVsZXMvb2JqZWN0LmZyb21lbnRyaWVzL3BvbHlmaWxsLmpzIiwiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tYWRtb25pdGlvbi9ub2RlX21vZHVsZXMvb2JqZWN0LmZyb21lbnRyaWVzL3NoaW0uanMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1hZG1vbml0aW9uL25vZGVfbW9kdWxlcy9vYmplY3QuZnJvbWVudHJpZXMvaW5kZXguanMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1hZG1vbml0aW9uL3NyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpudWxsLCJuYW1lcyI6WyJ0b1N0ciIsImtleXNTaGltIiwiaGFzIiwicmVxdWlyZSQkMCIsImlzRW51bWVyYWJsZSIsInNsaWNlIiwiaXNBcmdzIiwiaGFzU3ltYm9scyIsImtleXMiLCJpbXBsZW1lbnRhdGlvbiIsImhhc1N5bWJvbFNoYW0iLCJiaW5kIiwidW5kZWZpbmVkIiwiJFN5bnRheEVycm9yIiwiJFR5cGVFcnJvciIsIiRnT1BEIiwiaGFzT3duIiwiR2V0SW50cmluc2ljIiwiY2FsbEJpbmQiLCJFUzVUeXBlIiwiaW5zcGVjdCIsIiRpc05hTiIsIiRpc0Zpbml0ZSIsIk1BWF9TQUZFX0lOVEVHRVIiLCIkT2JqZWN0IiwiaGFzVG9TdHJpbmdUYWciLCJHZXRNZXRob2QiLCIkaXNFbnVtZXJhYmxlIiwiaGFzUmVnRXhwTWF0Y2hlciIsImlzUHJpbWl0aXZlIiwiaXNDYWxsYWJsZSIsImlzU3ltYm9sIiwiaXNEYXRlIiwidG9QcmltaXRpdmUiLCIkU3RyaW5nIiwiZ2V0UG9seWZpbGwiLCJkZWZpbmUiLCJmcm9tRW50cmllcyIsIlBsdWdpbiIsIk5vdGljZSIsIk1hcmtkb3duUmVuZGVyQ2hpbGQiLCJNYXJrZG93blJlbmRlcmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBdURBO0FBQ08sU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQzdELElBQUksU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxLQUFLLFlBQVksQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxVQUFVLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQ2hILElBQUksT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQy9ELFFBQVEsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtB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
