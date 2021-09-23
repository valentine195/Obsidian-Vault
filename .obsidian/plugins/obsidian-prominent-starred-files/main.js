/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/main.css":
/*!**********************!*\
  !*** ./src/main.css ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/monkey-around/mjs/index.js":
/*!*************************************************!*\
  !*** ./node_modules/monkey-around/mjs/index.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "around": () => (/* binding */ around),
/* harmony export */   "after": () => (/* binding */ after),
/* harmony export */   "serialize": () => (/* binding */ serialize)
/* harmony export */ });
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
function after(promise, cb) {
    return promise.then(cb, cb);
}
function serialize(asyncFunction) {
    let lastRun = Promise.resolve();
    function wrapper(...args) {
        return lastRun = new Promise((res, rej) => {
            after(lastRun, () => {
                asyncFunction.apply(this, args).then(res, rej);
            });
        });
    }
    wrapper.after = function () {
        return lastRun = new Promise((res, rej) => { after(lastRun, res); });
    };
    return wrapper;
}


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
/* harmony export */   "__spreadArray": () => (/* binding */ __spreadArray),
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
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
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

var __createBinding = Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});

function __exportStar(m, o) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
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

/** @deprecated */
function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

/** @deprecated */
function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

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

var __setModuleDefault = Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
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
/* harmony export */   "default": () => (/* binding */ ProminentStarredFiles)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var obsidian__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! obsidian */ "obsidian");
/* harmony import */ var obsidian__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(obsidian__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var monkey_around__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! monkey-around */ "./node_modules/monkey-around/mjs/index.js");
/* harmony import */ var _main_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./main.css */ "./src/main.css");




class ProminentStarredFiles extends obsidian__WEBPACK_IMPORTED_MODULE_0__.Plugin {
    constructor() {
        super(...arguments);
        this.files = new Set();
    }
    get enabled() {
        return this.app.internalPlugins.getPluginById("starred").enabled;
    }
    get starred() {
        return this.app.internalPlugins.getPluginById("starred");
    }
    get instance() {
        if (!this.enabled)
            return;
        return this.starred.instance;
    }
    get fileExplorers() {
        return this.app.workspace.getLeavesOfType("file-explorer");
    }
    onload() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__awaiter)(this, void 0, void 0, function* () {
            console.log("Prominent Starred Files plugin loaded");
            this.app.workspace.onLayoutReady(() => this.checkAndEnable());
        });
    }
    checkAndEnable() {
        setTimeout(() => {
            const self = this;
            if (!this.app.internalPlugins.getPluginById("file-explorer").enabled) {
                new obsidian__WEBPACK_IMPORTED_MODULE_0__.Notice("The File Explorer core plugin must be enabled to use this plugin.");
                const explorer = (0,monkey_around__WEBPACK_IMPORTED_MODULE_1__.around)(this.app.internalPlugins.getPluginById("file-explorer"), {
                    enable: function (next) {
                        return function (b) {
                            const apply = next.call(this, b);
                            explorer();
                            self.checkAndEnable();
                            return apply;
                        };
                    },
                    disable: function (next) {
                        return function (b) {
                            explorer();
                            self.checkAndEnable();
                            return next.call(this, b);
                        };
                    }
                });
                this.register(explorer);
                return;
            }
            this.register((0,monkey_around__WEBPACK_IMPORTED_MODULE_1__.around)(this.starred, {
                enable: function (next) {
                    return function (b) {
                        var _a, _b;
                        const apply = next.call(this, b);
                        self.registerHandlers();
                        for (let item of (_b = (_a = self.instance) === null || _a === void 0 ? void 0 : _a.items) !== null && _b !== void 0 ? _b : []) {
                            self.applyStar(item);
                        }
                        return apply;
                    };
                },
                disable: function (next) {
                    return function (b) {
                        var _a, _b;
                        self.handler();
                        for (let item of (_b = (_a = self.instance) === null || _a === void 0 ? void 0 : _a.items) !== null && _b !== void 0 ? _b : []) {
                            self.removeStar(item);
                        }
                        return next.call(this, b);
                    };
                }
            }));
            if (!this.enabled) {
                new obsidian__WEBPACK_IMPORTED_MODULE_0__.Notice("The Starred core plugin must be enabled to use this plugin.");
            }
            else {
                this.registerHandlers();
            }
        });
    }
    registerHandlers() {
        var _a, _b;
        const self = this;
        for (let item of (_b = (_a = this.instance) === null || _a === void 0 ? void 0 : _a.items) !== null && _b !== void 0 ? _b : []) {
            this.applyStar(item);
        }
        this.handler = (0,monkey_around__WEBPACK_IMPORTED_MODULE_1__.around)(this.starred.instance, {
            addItem: function (next) {
                return function (file) {
                    self.applyStar(file);
                    return next.call(this, file);
                };
            },
            removeItem: function (next) {
                return function (file) {
                    self.removeStar(file);
                    return next.call(this, file);
                };
            }
        });
        this.register(this.handler);
    }
    applyStar(file, el) {
        var _a, _b, _c, _d;
        if (!this.fileExplorers.length)
            return;
        if (this.files.has(file.path))
            return;
        for (let explorer of this.fileExplorers) {
            const element = (_d = el !== null && el !== void 0 ? el : (_c = (_b = (_a = explorer.view) === null || _a === void 0 ? void 0 : _a.fileItems) === null || _b === void 0 ? void 0 : _b[file.path]) === null || _c === void 0 ? void 0 : _c.titleEl) !== null && _d !== void 0 ? _d : explorer.containerEl.querySelector(`.nav-file-title[data-path="${file}"]`);
            if (!element)
                continue;
            this.files.add(file.path);
            (0,obsidian__WEBPACK_IMPORTED_MODULE_0__.setIcon)(element.createDiv("prominent-star"), "star-glyph");
        }
    }
    removeStar(file) {
        if (!this.fileExplorers.length)
            return;
        for (let explorer of this.fileExplorers) {
            const element = explorer.containerEl.querySelector(`.nav-file-title[data-path="${file.path}"]`);
            if (!element)
                continue;
            this.files.delete(file.path);
            const stars = element.querySelectorAll(".prominent-star");
            if (stars.length)
                stars.forEach((star) => star.detach());
        }
    }
    onunload() {
        var _a, _b;
        console.log("Prominent Starred Files plugin unloaded");
        for (let file of (_b = (_a = this.instance) === null || _a === void 0 ? void 0 : _a.items) !== null && _b !== void 0 ? _b : []) {
            this.removeStar(file);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDSCxNQUFNLEVBQ04sTUFBTSxFQUNOLE9BQU8sRUFJVixNQUFNLFVBQVUsQ0FBQztBQUNsQixPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXZDLE9BQU8sWUFBWSxDQUFDO0FBaURwQixNQUFNLENBQUMsT0FBTyxPQUFPLHFCQUFzQixTQUFRLE1BQU07SUFBekQ7O1FBRUksVUFBSyxHQUFnQixJQUFJLEdBQUcsRUFBRSxDQUFDO0lBbUpuQyxDQUFDO0lBbEpHLElBQUksT0FBTztRQUNQLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztJQUNyRSxDQUFDO0lBQ0QsSUFBSSxPQUFPO1FBQ1AsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUNELElBQUksUUFBUTtRQUNSLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTztZQUFFLE9BQU87UUFDMUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztJQUNqQyxDQUFDO0lBQ0QsSUFBSSxhQUFhO1FBQ2IsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQ3JDLGVBQWUsQ0FDYSxDQUFDO0lBQ3JDLENBQUM7SUFDSyxNQUFNOztZQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUNBQXVDLENBQUMsQ0FBQztZQUVyRCxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7UUFDbEUsQ0FBQztLQUFBO0lBQ0QsY0FBYztRQUNWLFVBQVUsQ0FBQyxHQUFHLEVBQUU7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LENBQUMsQ0FBQztZQUUxQixPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDO1NBQzlEO0lBQ0wsQ0FBQztJQUNELFVBQVUsQ0FBQyxJQUFpQjtRQUN4QixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNO1lBQUUsT0FBTztRQUV2QyxLQUFLLElBQUksUUFBUSxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDckMsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQzlDLDhCQUE4QixJQUFJLENBQUMsSUFBSSxJQUFJLENBQzlDLENBQUM7WUFDRixJQUFJLENBQUMsT0FBTztnQkFBRSxTQUFTO1lBQ3ZCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUU3QixNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUMxRCxJQUFJLEtBQUssQ0FBQyxNQUFNO2dCQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1NBQzVEO0lBQ0wsQ0FBQztJQUNELFFBQVE7O1FBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO1FBQ3ZELEtBQUssSUFBSSxJQUFJLElBQUksTUFBQSxNQUFBLElBQUksQ0FBQyxRQUFRLDBDQUFFLEtBQUssbUNBQUksRUFBRSxFQUFFO1lBQ3pDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDekI7SUFDTCxDQUFDO0NBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gICAgTm90aWNlLFxyXG4gICAgUGx1Z2luLFxyXG4gICAgc2V0SWNvbixcclxuICAgIFRBYnN0cmFjdEZpbGUsXHJcbiAgICBWaWV3LFxyXG4gICAgV29ya3NwYWNlTGVhZlxyXG59IGZyb20gXCJvYnNpZGlhblwiO1xyXG5pbXBvcnQgeyBhcm91bmQgfSBmcm9tIFwibW9ua2V5LWFyb3VuZFwiO1xyXG5cclxuaW1wb3J0IFwiLi9tYWluLmNzc1wiO1xyXG5cclxuaW50ZXJmYWNlIEludGVybmFsUGx1Z2luIHtcclxuICAgIGVuYWJsZWQ6IGJvb2xlYW47XHJcbiAgICBlbmFibGU6IChiOiBib29sZWFuKSA9PiB2b2lkO1xyXG4gICAgZGlzYWJsZTogKGI6IGJvb2xlYW4pID0+IHZvaWQ7XHJcbn1cclxuaW50ZXJmYWNlIFN0YXJyZWQgZXh0ZW5kcyBJbnRlcm5hbFBsdWdpbiB7XHJcbiAgICBpbnN0YW5jZToge1xyXG4gICAgICAgIGFkZEl0ZW06IChmaWxlOiBTdGFycmVkRmlsZSkgPT4gdm9pZDtcclxuICAgICAgICByZW1vdmVJdGVtOiAoZmlsZTogU3RhcnJlZEZpbGUpID0+IHZvaWQ7XHJcbiAgICAgICAgaXRlbXM6IFN0YXJyZWRGaWxlW107XHJcbiAgICB9O1xyXG59XHJcbmludGVyZmFjZSBGaWxlRXhwbG9yZXIgZXh0ZW5kcyBJbnRlcm5hbFBsdWdpbiB7fVxyXG5cclxuaW50ZXJmYWNlIFN0YXJyZWRGaWxlIHtcclxuICAgIHR5cGU6IFwiZmlsZVwiO1xyXG4gICAgdGl0bGU6IHN0cmluZztcclxuICAgIHBhdGg6IHN0cmluZztcclxufVxyXG5pbnRlcmZhY2UgSW50ZXJuYWxQbHVnaW5zIHtcclxuICAgIHN0YXJyZWQ6IFN0YXJyZWQ7XHJcbiAgICBcImZpbGUtZXhwbG9yZXJcIjogRmlsZUV4cGxvcmVyO1xyXG59XHJcblxyXG5kZWNsYXJlIG1vZHVsZSBcIm9ic2lkaWFuXCIge1xyXG4gICAgaW50ZXJmYWNlIEFwcCB7XHJcbiAgICAgICAgaW50ZXJuYWxQbHVnaW5zOiB7XHJcbiAgICAgICAgICAgIHBsdWdpbnM6IEludGVybmFsUGx1Z2lucztcclxuICAgICAgICAgICAgZ2V0UGx1Z2luQnlJZDxUIGV4dGVuZHMga2V5b2YgSW50ZXJuYWxQbHVnaW5zPihcclxuICAgICAgICAgICAgICAgIGlkOiBUXHJcbiAgICAgICAgICAgICk6IEludGVybmFsUGx1Z2luc1tUXTtcclxuICAgICAgICAgICAgbG9hZFBsdWdpbiguLi5hcmdzOiBhbnlbXSk6IGFueTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgaW50ZXJmYWNlIFRBYnN0cmFjdEZpbGUge1xyXG4gICAgICAgIHRpdGxlRWw6IEhUTUxFbGVtZW50O1xyXG4gICAgfVxyXG59XHJcbmludGVyZmFjZSBGaWxlRXhwbG9yZXJXb3Jrc3BhY2VMZWFmIGV4dGVuZHMgV29ya3NwYWNlTGVhZiB7XHJcbiAgICBjb250YWluZXJFbDogSFRNTEVsZW1lbnQ7XHJcbiAgICB2aWV3OiBGaWxlRXhwbG9yZXJWaWV3O1xyXG59XHJcblxyXG5pbnRlcmZhY2UgRmlsZUV4cGxvcmVyVmlldyBleHRlbmRzIFZpZXcge1xyXG4gICAgZmlsZUl0ZW1zOiB7IFtwYXRoOiBzdHJpbmddOiBUQWJzdHJhY3RGaWxlIH07XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb21pbmVudFN0YXJyZWRGaWxlcyBleHRlbmRzIFBsdWdpbiB7XHJcbiAgICBoYW5kbGVyOiAoKSA9PiB2b2lkO1xyXG4gICAgZmlsZXM6IFNldDxzdHJpbmc+ID0gbmV3IFNldCgpO1xyXG4gICAgZ2V0IGVuYWJsZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwLmludGVybmFsUGx1Z2lucy5nZXRQbHVnaW5CeUlkKFwic3RhcnJlZFwiKS5lbmFibGVkO1xyXG4gICAgfVxyXG4gICAgZ2V0IHN0YXJyZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwLmludGVybmFsUGx1Z2lucy5nZXRQbHVnaW5CeUlkKFwic3RhcnJlZFwiKTtcclxuICAgIH1cclxuICAgIGdldCBpbnN0YW5jZSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZW5hYmxlZCkgcmV0dXJuO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN0YXJyZWQuaW5zdGFuY2U7XHJcbiAgICB9XHJcbiAgICBnZXQgZmlsZUV4cGxvcmVycygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYXZlc09mVHlwZShcclxuICAgICAgICAgICAgXCJmaWxlLWV4cGxvcmVyXCJcclxuICAgICAgICApIGFzIEZpbGVFeHBsb3JlcldvcmtzcGFjZUxlYWZbXTtcclxuICAgIH1cclxuICAgIGFzeW5jIG9ubG9hZCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlByb21pbmVudCBTdGFycmVkIEZpbGVzIHBsdWdpbiBsb2FkZWRcIik7XHJcblxyXG4gICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5vbkxheW91dFJlYWR5KCgpID0+IHRoaXMuY2hlY2tBbmRFbmFibGUoKSk7XHJcbiAgICB9XHJcbiAgICBjaGVja0FuZEVuYWJsZSgpIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICF0aGlzLmFwcC5pbnRlcm5hbFBsdWdpbnMuZ2V0UGx1Z2luQnlJZChcImZpbGUtZXhwbG9yZXJcIikuZW5hYmxlZFxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UoXHJcbiAgICAgICAgICAgICAgICAgICAgXCJUaGUgRmlsZSBFeHBsb3JlciBjb3JlIHBsdWdpbiBtdXN0IGJlIGVuYWJsZWQgdG8gdXNlIHRoaXMgcGx1Z2luLlwiXHJcbiAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGV4cGxvcmVyID0gYXJvdW5kKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBwLmludGVybmFsUGx1Z2lucy5nZXRQbHVnaW5CeUlkKFwiZmlsZS1leHBsb3JlclwiKSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZTogZnVuY3Rpb24gKG5leHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoYikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFwcGx5ID0gbmV4dC5jYWxsKHRoaXMsIGIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGxvcmVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jaGVja0FuZEVuYWJsZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhcHBseTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGU6IGZ1bmN0aW9uIChuZXh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBsb3JlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY2hlY2tBbmRFbmFibGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV4dC5jYWxsKHRoaXMsIGIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlZ2lzdGVyKGV4cGxvcmVyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5yZWdpc3RlcihcclxuICAgICAgICAgICAgICAgIGFyb3VuZCh0aGlzLnN0YXJyZWQsIHtcclxuICAgICAgICAgICAgICAgICAgICBlbmFibGU6IGZ1bmN0aW9uIChuZXh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoYikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXBwbHkgPSBuZXh0LmNhbGwodGhpcywgYik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnJlZ2lzdGVySGFuZGxlcnMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2Ygc2VsZi5pbnN0YW5jZT8uaXRlbXMgPz8gW10pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFwcGx5U3RhcihpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhcHBseTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGRpc2FibGU6IGZ1bmN0aW9uIChuZXh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoYikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oYW5kbGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpdGVtIG9mIHNlbGYuaW5zdGFuY2U/Lml0ZW1zID8/IFtdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5yZW1vdmVTdGFyKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5leHQuY2FsbCh0aGlzLCBiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuZW5hYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgbmV3IE5vdGljZShcclxuICAgICAgICAgICAgICAgICAgICBcIlRoZSBTdGFycmVkIGNvcmUgcGx1Z2luIG11c3QgYmUgZW5hYmxlZCB0byB1c2UgdGhpcyBwbHVnaW4uXCJcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlZ2lzdGVySGFuZGxlcnMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmVnaXN0ZXJIYW5kbGVycygpIHtcclxuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcclxuICAgICAgICBmb3IgKGxldCBpdGVtIG9mIHRoaXMuaW5zdGFuY2U/Lml0ZW1zID8/IFtdKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwbHlTdGFyKGl0ZW0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5oYW5kbGVyID0gYXJvdW5kKHRoaXMuc3RhcnJlZC5pbnN0YW5jZSwge1xyXG4gICAgICAgICAgICBhZGRJdGVtOiBmdW5jdGlvbiAobmV4dCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmaWxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hcHBseVN0YXIoZmlsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5leHQuY2FsbCh0aGlzLCBmaWxlKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHJlbW92ZUl0ZW06IGZ1bmN0aW9uIChuZXh0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGZpbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnJlbW92ZVN0YXIoZmlsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5leHQuY2FsbCh0aGlzLCBmaWxlKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyKHRoaXMuaGFuZGxlcik7XHJcbiAgICB9XHJcbiAgICBhcHBseVN0YXIoZmlsZTogU3RhcnJlZEZpbGUsIGVsPzogSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZmlsZUV4cGxvcmVycy5sZW5ndGgpIHJldHVybjtcclxuICAgICAgICBpZiAodGhpcy5maWxlcy5oYXMoZmlsZS5wYXRoKSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBleHBsb3JlciBvZiB0aGlzLmZpbGVFeHBsb3JlcnMpIHtcclxuICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9XHJcbiAgICAgICAgICAgICAgICBlbCA/P1xyXG4gICAgICAgICAgICAgICAgZXhwbG9yZXIudmlldz8uZmlsZUl0ZW1zPy5bZmlsZS5wYXRoXT8udGl0bGVFbCA/P1xyXG4gICAgICAgICAgICAgICAgZXhwbG9yZXIuY29udGFpbmVyRWwucXVlcnlTZWxlY3RvcihcclxuICAgICAgICAgICAgICAgICAgICBgLm5hdi1maWxlLXRpdGxlW2RhdGEtcGF0aD1cIiR7ZmlsZX1cIl1gXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBpZiAoIWVsZW1lbnQpIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5maWxlcy5hZGQoZmlsZS5wYXRoKTtcclxuXHJcbiAgICAgICAgICAgIHNldEljb24oZWxlbWVudC5jcmVhdGVEaXYoXCJwcm9taW5lbnQtc3RhclwiKSwgXCJzdGFyLWdseXBoXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJlbW92ZVN0YXIoZmlsZTogU3RhcnJlZEZpbGUpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZmlsZUV4cGxvcmVycy5sZW5ndGgpIHJldHVybjtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgZXhwbG9yZXIgb2YgdGhpcy5maWxlRXhwbG9yZXJzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSBleHBsb3Jlci5jb250YWluZXJFbC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICAgICAgICAgICAgYC5uYXYtZmlsZS10aXRsZVtkYXRhLXBhdGg9XCIke2ZpbGUucGF0aH1cIl1gXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGlmICghZWxlbWVudCkgY29udGludWU7XHJcbiAgICAgICAgICAgIHRoaXMuZmlsZXMuZGVsZXRlKGZpbGUucGF0aCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzdGFycyA9IGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wcm9taW5lbnQtc3RhclwiKTtcclxuICAgICAgICAgICAgaWYgKHN0YXJzLmxlbmd0aCkgc3RhcnMuZm9yRWFjaCgoc3RhcikgPT4gc3Rhci5kZXRhY2goKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgb251bmxvYWQoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJQcm9taW5lbnQgU3RhcnJlZCBGaWxlcyBwbHVnaW4gdW5sb2FkZWRcIik7XHJcbiAgICAgICAgZm9yIChsZXQgZmlsZSBvZiB0aGlzLmluc3RhbmNlPy5pdGVtcyA/PyBbXSkge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZVN0YXIoZmlsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==
})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ0FPO0FBQ1A7QUFDQSwrREFBK0Q7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0EscURBQXFELHNCQUFzQjtBQUMzRTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsZ0JBQWdCLHNDQUFzQyxrQkFBa0I7QUFDbkYsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQSxpREFBaUQsT0FBTztBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZEQUE2RCxjQUFjO0FBQzNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBLDZDQUE2QyxRQUFRO0FBQ3JEO0FBQ0E7QUFDQTtBQUNPO0FBQ1Asb0NBQW9DO0FBQ3BDO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNPO0FBQ1AsNEJBQTRCLCtEQUErRCxpQkFBaUI7QUFDNUc7QUFDQSxvQ0FBb0MsTUFBTSwrQkFBK0IsWUFBWTtBQUNyRixtQ0FBbUMsTUFBTSxtQ0FBbUMsWUFBWTtBQUN4RixnQ0FBZ0M7QUFDaEM7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNPO0FBQ1AsY0FBYyw2QkFBNkIsMEJBQTBCLGNBQWMscUJBQXFCO0FBQ3hHLGlCQUFpQixvREFBb0QscUVBQXFFLGNBQWM7QUFDeEosdUJBQXVCLHNCQUFzQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEMsbUNBQW1DLFNBQVM7QUFDNUMsbUNBQW1DLFdBQVcsVUFBVTtBQUN4RCwwQ0FBMEMsY0FBYztBQUN4RDtBQUNBLDhHQUE4RyxPQUFPO0FBQ3JILGlGQUFpRixpQkFBaUI7QUFDbEcseURBQXlELGdCQUFnQixRQUFRO0FBQ2pGLCtDQUErQyxnQkFBZ0IsZ0JBQWdCO0FBQy9FO0FBQ0Esa0NBQWtDO0FBQ2xDO0FBQ0E7QUFDQSxVQUFVLFlBQVksYUFBYSxTQUFTLFVBQVU7QUFDdEQsb0NBQW9DLFNBQVM7QUFDN0M7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBLG1DQUFtQyxvQ0FBb0MsZ0JBQWdCO0FBQ3ZGLENBQUM7QUFDRDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLE1BQU07QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1AsNkJBQTZCLHNCQUFzQjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUCxrREFBa0QsUUFBUTtBQUMxRCx5Q0FBeUMsUUFBUTtBQUNqRCx5REFBeUQsUUFBUTtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1AsNkVBQTZFLE9BQU87QUFDcEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0EsaUJBQWlCLHVGQUF1RixjQUFjO0FBQ3RILHVCQUF1QixnQ0FBZ0MscUNBQXFDLDJDQUEyQztBQUN2SSw0QkFBNEIsTUFBTSxpQkFBaUIsWUFBWTtBQUMvRCx1QkFBdUI7QUFDdkIsOEJBQThCO0FBQzlCLDZCQUE2QjtBQUM3Qiw0QkFBNEI7QUFDNUI7QUFDQTtBQUNPO0FBQ1A7QUFDQSxpQkFBaUIsNkNBQTZDLFVBQVUsc0RBQXNELGNBQWM7QUFDNUksMEJBQTBCLDZCQUE2QixvQkFBb0IsZ0RBQWdELGtCQUFrQjtBQUM3STtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0EsMkdBQTJHLHVGQUF1RixjQUFjO0FBQ2hOLHVCQUF1Qiw4QkFBOEIsZ0RBQWdELHdEQUF3RDtBQUM3Siw2Q0FBNkMsc0NBQXNDLFVBQVUsbUJBQW1CLElBQUk7QUFDcEg7QUFDQTtBQUNPO0FBQ1AsaUNBQWlDLHVDQUF1QyxZQUFZLEtBQUssT0FBTztBQUNoRztBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQyw0QkFBNEI7QUFDdEUsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQLDZDQUE2QztBQUM3QztBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQzlPQTs7Ozs7O1VDQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOa0M7QUFDaUI7QUFDWjtBQUNuQjtBQUNMLG9DQUFvQyw0Q0FBTTtBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsZ0RBQVM7QUFDeEI7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLDRDQUFNO0FBQzFCLGlDQUFpQyxxREFBTTtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIscURBQU07QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxvQkFBb0IsNENBQU07QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIscURBQU07QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaVdBQWlXLEtBQUs7QUFDdFc7QUFDQTtBQUNBO0FBQ0EsWUFBWSxpREFBTztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2RkFBNkYsVUFBVTtBQUN2RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyxtamUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9vYnNpZGlhbi1wcm9taW5lbnQtc3RhcnJlZC1maWxlcy8uL3NyYy9tYWluLmNzcyIsIndlYnBhY2s6Ly9vYnNpZGlhbi1wcm9taW5lbnQtc3RhcnJlZC1maWxlcy8uL25vZGVfbW9kdWxlcy9tb25rZXktYXJvdW5kL21qcy9pbmRleC5qcyIsIndlYnBhY2s6Ly9vYnNpZGlhbi1wcm9taW5lbnQtc3RhcnJlZC1maWxlcy8uL25vZGVfbW9kdWxlcy90c2xpYi90c2xpYi5lczYuanMiLCJ3ZWJwYWNrOi8vb2JzaWRpYW4tcHJvbWluZW50LXN0YXJyZWQtZmlsZXMvZXh0ZXJuYWwgY29tbW9uanMyIFwib2JzaWRpYW5cIiIsIndlYnBhY2s6Ly9vYnNpZGlhbi1wcm9taW5lbnQtc3RhcnJlZC1maWxlcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9vYnNpZGlhbi1wcm9taW5lbnQtc3RhcnJlZC1maWxlcy93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9vYnNpZGlhbi1wcm9taW5lbnQtc3RhcnJlZC1maWxlcy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vb2JzaWRpYW4tcHJvbWluZW50LXN0YXJyZWQtZmlsZXMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9vYnNpZGlhbi1wcm9taW5lbnQtc3RhcnJlZC1maWxlcy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL29ic2lkaWFuLXByb21pbmVudC1zdGFycmVkLWZpbGVzLy4vc3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiZXhwb3J0IGZ1bmN0aW9uIGFyb3VuZChvYmosIGZhY3Rvcmllcykge1xuICAgIGNvbnN0IHJlbW92ZXJzID0gT2JqZWN0LmtleXMoZmFjdG9yaWVzKS5tYXAoa2V5ID0+IGFyb3VuZDEob2JqLCBrZXksIGZhY3Rvcmllc1trZXldKSk7XG4gICAgcmV0dXJuIHJlbW92ZXJzLmxlbmd0aCA9PT0gMSA/IHJlbW92ZXJzWzBdIDogZnVuY3Rpb24gKCkgeyByZW1vdmVycy5mb3JFYWNoKHIgPT4gcigpKTsgfTtcbn1cbmZ1bmN0aW9uIGFyb3VuZDEob2JqLCBtZXRob2QsIGNyZWF0ZVdyYXBwZXIpIHtcbiAgICBjb25zdCBvcmlnaW5hbCA9IG9ialttZXRob2RdLCBoYWRPd24gPSBvYmouaGFzT3duUHJvcGVydHkobWV0aG9kKTtcbiAgICBsZXQgY3VycmVudCA9IGNyZWF0ZVdyYXBwZXIob3JpZ2luYWwpO1xuICAgIC8vIExldCBvdXIgd3JhcHBlciBpbmhlcml0IHN0YXRpYyBwcm9wcyBmcm9tIHRoZSB3cmFwcGluZyBtZXRob2QsXG4gICAgLy8gYW5kIHRoZSB3cmFwcGluZyBtZXRob2QsIHByb3BzIGZyb20gdGhlIG9yaWdpbmFsIG1ldGhvZFxuICAgIGlmIChvcmlnaW5hbClcbiAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGN1cnJlbnQsIG9yaWdpbmFsKTtcbiAgICBPYmplY3Quc2V0UHJvdG90eXBlT2Yod3JhcHBlciwgY3VycmVudCk7XG4gICAgb2JqW21ldGhvZF0gPSB3cmFwcGVyO1xuICAgIC8vIFJldHVybiBhIGNhbGxiYWNrIHRvIGFsbG93IHNhZmUgcmVtb3ZhbFxuICAgIHJldHVybiByZW1vdmU7XG4gICAgZnVuY3Rpb24gd3JhcHBlciguLi5hcmdzKSB7XG4gICAgICAgIC8vIElmIHdlIGhhdmUgYmVlbiBkZWFjdGl2YXRlZCBhbmQgYXJlIG5vIGxvbmdlciB3cmFwcGVkLCByZW1vdmUgb3Vyc2VsdmVzXG4gICAgICAgIGlmIChjdXJyZW50ID09PSBvcmlnaW5hbCAmJiBvYmpbbWV0aG9kXSA9PT0gd3JhcHBlcilcbiAgICAgICAgICAgIHJlbW92ZSgpO1xuICAgICAgICByZXR1cm4gY3VycmVudC5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgICAvLyBJZiBubyBvdGhlciBwYXRjaGVzLCBqdXN0IGRvIGEgZGlyZWN0IHJlbW92YWxcbiAgICAgICAgaWYgKG9ialttZXRob2RdID09PSB3cmFwcGVyKSB7XG4gICAgICAgICAgICBpZiAoaGFkT3duKVxuICAgICAgICAgICAgICAgIG9ialttZXRob2RdID0gb3JpZ2luYWw7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgZGVsZXRlIG9ialttZXRob2RdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjdXJyZW50ID09PSBvcmlnaW5hbClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgLy8gRWxzZSBwYXNzIGZ1dHVyZSBjYWxscyB0aHJvdWdoLCBhbmQgcmVtb3ZlIHdyYXBwZXIgZnJvbSB0aGUgcHJvdG90eXBlIGNoYWluXG4gICAgICAgIGN1cnJlbnQgPSBvcmlnaW5hbDtcbiAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHdyYXBwZXIsIG9yaWdpbmFsIHx8IEZ1bmN0aW9uKTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gYWZ0ZXIocHJvbWlzZSwgY2IpIHtcbiAgICByZXR1cm4gcHJvbWlzZS50aGVuKGNiLCBjYik7XG59XG5leHBvcnQgZnVuY3Rpb24gc2VyaWFsaXplKGFzeW5jRnVuY3Rpb24pIHtcbiAgICBsZXQgbGFzdFJ1biA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIGZ1bmN0aW9uIHdyYXBwZXIoLi4uYXJncykge1xuICAgICAgICByZXR1cm4gbGFzdFJ1biA9IG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xuICAgICAgICAgICAgYWZ0ZXIobGFzdFJ1biwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGFzeW5jRnVuY3Rpb24uYXBwbHkodGhpcywgYXJncykudGhlbihyZXMsIHJlaik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHdyYXBwZXIuYWZ0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBsYXN0UnVuID0gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7IGFmdGVyKGxhc3RSdW4sIHJlcyk7IH0pO1xuICAgIH07XG4gICAgcmV0dXJuIHdyYXBwZXI7XG59XG4iLCIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXHJcblxyXG5QZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcclxucHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLlxyXG5cclxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVMgV0lUSFxyXG5SRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFlcclxuQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULFxyXG5JTkRJUkVDVCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST01cclxuTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1JcclxuT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUlxyXG5QRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbihkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxyXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICAgICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2NyZWF0ZUJpbmRpbmcgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIG8pIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgcCkpIF9fY3JlYXRlQmluZGluZyhvLCBtLCBwKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcclxuICAgIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxyXG4gICAgICAgICAgICByW2tdID0gYVtqXTtcclxuICAgIHJldHVybiByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheSh0bywgZnJvbSwgcGFjaykge1xyXG4gICAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XHJcbiAgICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XHJcbiAgICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20pKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgc3RhdGUsIGtpbmQsIGYpIHtcclxuICAgIGlmIChraW5kID09PSBcImFcIiAmJiAhZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgYWNjZXNzb3Igd2FzIGRlZmluZWQgd2l0aG91dCBhIGdldHRlclwiKTtcclxuICAgIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHJlYWQgcHJpdmF0ZSBtZW1iZXIgZnJvbSBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIGtpbmQgPT09IFwibVwiID8gZiA6IGtpbmQgPT09IFwiYVwiID8gZi5jYWxsKHJlY2VpdmVyKSA6IGYgPyBmLnZhbHVlIDogc3RhdGUuZ2V0KHJlY2VpdmVyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRTZXQocmVjZWl2ZXIsIHN0YXRlLCB2YWx1ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwibVwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBtZXRob2QgaXMgbm90IHdyaXRhYmxlXCIpO1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgc2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3Qgd3JpdGUgcHJpdmF0ZSBtZW1iZXIgdG8gYW4gb2JqZWN0IHdob3NlIGNsYXNzIGRpZCBub3QgZGVjbGFyZSBpdFwiKTtcclxuICAgIHJldHVybiAoa2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIsIHZhbHVlKSA6IGYgPyBmLnZhbHVlID0gdmFsdWUgOiBzdGF0ZS5zZXQocmVjZWl2ZXIsIHZhbHVlKSksIHZhbHVlO1xyXG59XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm9ic2lkaWFuXCIpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBfX2F3YWl0ZXIgfSBmcm9tIFwidHNsaWJcIjtcclxuaW1wb3J0IHsgTm90aWNlLCBQbHVnaW4sIHNldEljb24gfSBmcm9tIFwib2JzaWRpYW5cIjtcclxuaW1wb3J0IHsgYXJvdW5kIH0gZnJvbSBcIm1vbmtleS1hcm91bmRcIjtcclxuaW1wb3J0IFwiLi9tYWluLmNzc1wiO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcm9taW5lbnRTdGFycmVkRmlsZXMgZXh0ZW5kcyBQbHVnaW4ge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcclxuICAgICAgICB0aGlzLmZpbGVzID0gbmV3IFNldCgpO1xyXG4gICAgfVxyXG4gICAgZ2V0IGVuYWJsZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwLmludGVybmFsUGx1Z2lucy5nZXRQbHVnaW5CeUlkKFwic3RhcnJlZFwiKS5lbmFibGVkO1xyXG4gICAgfVxyXG4gICAgZ2V0IHN0YXJyZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwLmludGVybmFsUGx1Z2lucy5nZXRQbHVnaW5CeUlkKFwic3RhcnJlZFwiKTtcclxuICAgIH1cclxuICAgIGdldCBpbnN0YW5jZSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZW5hYmxlZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN0YXJyZWQuaW5zdGFuY2U7XHJcbiAgICB9XHJcbiAgICBnZXQgZmlsZUV4cGxvcmVycygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYXZlc09mVHlwZShcImZpbGUtZXhwbG9yZXJcIik7XHJcbiAgICB9XHJcbiAgICBvbmxvYWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJQcm9taW5lbnQgU3RhcnJlZCBGaWxlcyBwbHVnaW4gbG9hZGVkXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmFwcC53b3Jrc3BhY2Uub25MYXlvdXRSZWFkeSgoKSA9PiB0aGlzLmNoZWNrQW5kRW5hYmxlKCkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgY2hlY2tBbmRFbmFibGUoKSB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuYXBwLmludGVybmFsUGx1Z2lucy5nZXRQbHVnaW5CeUlkKFwiZmlsZS1leHBsb3JlclwiKS5lbmFibGVkKSB7XHJcbiAgICAgICAgICAgICAgICBuZXcgTm90aWNlKFwiVGhlIEZpbGUgRXhwbG9yZXIgY29yZSBwbHVnaW4gbXVzdCBiZSBlbmFibGVkIHRvIHVzZSB0aGlzIHBsdWdpbi5cIik7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBleHBsb3JlciA9IGFyb3VuZCh0aGlzLmFwcC5pbnRlcm5hbFBsdWdpbnMuZ2V0UGx1Z2luQnlJZChcImZpbGUtZXhwbG9yZXJcIiksIHtcclxuICAgICAgICAgICAgICAgICAgICBlbmFibGU6IGZ1bmN0aW9uIChuZXh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoYikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXBwbHkgPSBuZXh0LmNhbGwodGhpcywgYik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBsb3JlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jaGVja0FuZEVuYWJsZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwcGx5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZTogZnVuY3Rpb24gKG5leHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBsb3JlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jaGVja0FuZEVuYWJsZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5leHQuY2FsbCh0aGlzLCBiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVnaXN0ZXIoZXhwbG9yZXIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXIoYXJvdW5kKHRoaXMuc3RhcnJlZCwge1xyXG4gICAgICAgICAgICAgICAgZW5hYmxlOiBmdW5jdGlvbiAobmV4dCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoYikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgX2EsIF9iO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhcHBseSA9IG5leHQuY2FsbCh0aGlzLCBiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5yZWdpc3RlckhhbmRsZXJzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgKF9iID0gKF9hID0gc2VsZi5pbnN0YW5jZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLml0ZW1zKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBbXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hcHBseVN0YXIoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwcGx5O1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZGlzYWJsZTogZnVuY3Rpb24gKG5leHQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIF9hLCBfYjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5oYW5kbGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGl0ZW0gb2YgKF9iID0gKF9hID0gc2VsZi5pbnN0YW5jZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLml0ZW1zKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBbXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5yZW1vdmVTdGFyKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXh0LmNhbGwodGhpcywgYik7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuZW5hYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgbmV3IE5vdGljZShcIlRoZSBTdGFycmVkIGNvcmUgcGx1Z2luIG11c3QgYmUgZW5hYmxlZCB0byB1c2UgdGhpcyBwbHVnaW4uXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWdpc3RlckhhbmRsZXJzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJlZ2lzdGVySGFuZGxlcnMoKSB7XHJcbiAgICAgICAgdmFyIF9hLCBfYjtcclxuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcclxuICAgICAgICBmb3IgKGxldCBpdGVtIG9mIChfYiA9IChfYSA9IHRoaXMuaW5zdGFuY2UpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5pdGVtcykgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogW10pIHtcclxuICAgICAgICAgICAgdGhpcy5hcHBseVN0YXIoaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaGFuZGxlciA9IGFyb3VuZCh0aGlzLnN0YXJyZWQuaW5zdGFuY2UsIHtcclxuICAgICAgICAgICAgYWRkSXRlbTogZnVuY3Rpb24gKG5leHQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoZmlsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYXBwbHlTdGFyKGZpbGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXh0LmNhbGwodGhpcywgZmlsZSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByZW1vdmVJdGVtOiBmdW5jdGlvbiAobmV4dCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmaWxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5yZW1vdmVTdGFyKGZpbGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXh0LmNhbGwodGhpcywgZmlsZSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3Rlcih0aGlzLmhhbmRsZXIpO1xyXG4gICAgfVxyXG4gICAgYXBwbHlTdGFyKGZpbGUsIGVsKSB7XHJcbiAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kO1xyXG4gICAgICAgIGlmICghdGhpcy5maWxlRXhwbG9yZXJzLmxlbmd0aClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGlmICh0aGlzLmZpbGVzLmhhcyhmaWxlLnBhdGgpKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgZm9yIChsZXQgZXhwbG9yZXIgb2YgdGhpcy5maWxlRXhwbG9yZXJzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSAoX2QgPSBlbCAhPT0gbnVsbCAmJiBlbCAhPT0gdm9pZCAwID8gZWwgOiAoX2MgPSAoX2IgPSAoX2EgPSBleHBsb3Jlci52aWV3KSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZmlsZUl0ZW1zKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2JbZmlsZS5wYXRoXSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLnRpdGxlRWwpICE9PSBudWxsICYmIF9kICE9PSB2b2lkIDAgPyBfZCA6IGV4cGxvcmVyLmNvbnRhaW5lckVsLnF1ZXJ5U2VsZWN0b3IoYC5uYXYtZmlsZS10aXRsZVtkYXRhLXBhdGg9XCIke2ZpbGV9XCJdYCk7XHJcbiAgICAgICAgICAgIGlmICghZWxlbWVudClcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB0aGlzLmZpbGVzLmFkZChmaWxlLnBhdGgpO1xyXG4gICAgICAgICAgICBzZXRJY29uKGVsZW1lbnQuY3JlYXRlRGl2KFwicHJvbWluZW50LXN0YXJcIiksIFwic3Rhci1nbHlwaFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZW1vdmVTdGFyKGZpbGUpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZmlsZUV4cGxvcmVycy5sZW5ndGgpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBmb3IgKGxldCBleHBsb3JlciBvZiB0aGlzLmZpbGVFeHBsb3JlcnMpIHtcclxuICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IGV4cGxvcmVyLmNvbnRhaW5lckVsLnF1ZXJ5U2VsZWN0b3IoYC5uYXYtZmlsZS10aXRsZVtkYXRhLXBhdGg9XCIke2ZpbGUucGF0aH1cIl1gKTtcclxuICAgICAgICAgICAgaWYgKCFlbGVtZW50KVxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIHRoaXMuZmlsZXMuZGVsZXRlKGZpbGUucGF0aCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0YXJzID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnByb21pbmVudC1zdGFyXCIpO1xyXG4gICAgICAgICAgICBpZiAoc3RhcnMubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgc3RhcnMuZm9yRWFjaCgoc3RhcikgPT4gc3Rhci5kZXRhY2goKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgb251bmxvYWQoKSB7XHJcbiAgICAgICAgdmFyIF9hLCBfYjtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlByb21pbmVudCBTdGFycmVkIEZpbGVzIHBsdWdpbiB1bmxvYWRlZFwiKTtcclxuICAgICAgICBmb3IgKGxldCBmaWxlIG9mIChfYiA9IChfYSA9IHRoaXMuaW5zdGFuY2UpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5pdGVtcykgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogW10pIHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVTdGFyKGZpbGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2liV0ZwYmk1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWeklqcGJJbTFoYVc0dWRITWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqdEJRVUZCTEU5QlFVOHNSVUZEU0N4TlFVRk5MRVZCUTA0c1RVRkJUU3hGUVVOT0xFOUJRVThzUlVGSlZpeE5RVUZOTEZWQlFWVXNRMEZCUXp0QlFVTnNRaXhQUVVGUExFVkJRVVVzVFVGQlRTeEZRVUZGTEUxQlFVMHNaVUZCWlN4RFFVRkRPMEZCUlhaRExFOUJRVThzV1VGQldTeERRVUZETzBGQmFVUndRaXhOUVVGTkxFTkJRVU1zVDBGQlR5eFBRVUZQTEhGQ1FVRnpRaXhUUVVGUkxFMUJRVTA3U1VGQmVrUTdPMUZCUlVrc1ZVRkJTeXhIUVVGblFpeEpRVUZKTEVkQlFVY3NSVUZCUlN4RFFVRkRPMGxCYlVwdVF5eERRVUZETzBsQmJFcEhMRWxCUVVrc1QwRkJUenRSUVVOUUxFOUJRVThzU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4bFFVRmxMRU5CUVVNc1lVRkJZU3hEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETEU5QlFVOHNRMEZCUXp0SlFVTnlSU3hEUVVGRE8wbEJRMFFzU1VGQlNTeFBRVUZQTzFGQlExQXNUMEZCVHl4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExHVkJRV1VzUTBGQlF5eGhRVUZoTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNN1NVRkROMFFzUTBGQlF6dEpRVU5FTEVsQlFVa3NVVUZCVVR0UlFVTlNMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zVDBGQlR6dFpRVUZGTEU5QlFVODdVVUZETVVJc1QwRkJUeXhKUVVGSkxFTkJRVU1zVDBGQlR5eERRVUZETEZGQlFWRXNRMEZCUXp0SlFVTnFReXhEUVVGRE8wbEJRMFFzU1VGQlNTeGhRVUZoTzFGQlEySXNUMEZCVHl4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExGTkJRVk1zUTBGQlF5eGxRVUZsTEVOQlEzSkRMR1ZCUVdVc1EwRkRZU3hEUVVGRE8wbEJRM0pETEVOQlFVTTdTVUZEU3l4TlFVRk5PenRaUVVOU0xFOUJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNkVU5CUVhWRExFTkJRVU1zUTBGQlF6dFpRVVZ5UkN4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExGTkJRVk1zUTBGQlF5eGhRVUZoTEVOQlFVTXNSMEZCUnl4RlFVRkZMRU5CUVVNc1NVRkJTU3hEUVVGRExHTkJRV01zUlVGQlJTeERRVUZETEVOQlFVTTdVVUZEYkVVc1EwRkJRenRMUVVGQk8wbEJRMFFzWTBGQll6dFJRVU5XTEZWQlFWVXNRMEZCUXl4SFFVRkhMRVZCUVVVN1dVRkRXaXhOUVVGTkxFbEJRVWtzUjBGQlJ5eEpRVUZKTEVOQlFVTTdXVUZEYkVJc1NVRkRTU3hEUVVGRExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNaVUZCWlN4RFFVRkRMR0ZCUVdFc1EwRkJReXhsUVVGbExFTkJRVU1zUTBGQlF5eFBRVUZQTEVWQlEyeEZPMmRDUVVORkxFbEJRVWtzVFVGQlRTeERRVU5PTEcxRlFVRnRSU3hEUVVOMFJTeERRVUZETzJkQ1FVVkdMRTFCUVUwc1VVRkJVU3hIUVVGSExFMUJRVTBzUTBGRGJrSXNTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhsUVVGbExFTkJRVU1zWVVGQllTeERRVUZETEdWQlFXVXNRMEZCUXl4RlFVTjJSRHR2UWtGRFNTeE5RVUZOTEVWQlFVVXNWVUZCVlN4SlFVRkpPM2RDUVVOc1FpeFBRVUZQTEZWQlFWVXNRMEZCUXpzMFFrRkRaQ3hOUVVGTkxFdEJRVXNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1JVRkJSU3hEUVVGRExFTkJRVU1zUTBGQlF6czBRa0ZEYWtNc1VVRkJVU3hGUVVGRkxFTkJRVU03TkVKQlExZ3NTVUZCU1N4RFFVRkRMR05CUVdNc1JVRkJSU3hEUVVGRE96UkNRVU4wUWl4UFFVRlBMRXRCUVVzc1EwRkJRenQzUWtGRGFrSXNRMEZCUXl4RFFVRkRPMjlDUVVOT0xFTkJRVU03YjBKQlEwUXNUMEZCVHl4RlFVRkZMRlZCUVZVc1NVRkJTVHQzUWtGRGJrSXNUMEZCVHl4VlFVRlZMRU5CUVVNN05FSkJRMlFzVVVGQlVTeEZRVUZGTEVOQlFVTTdORUpCUTFnc1NVRkJTU3hEUVVGRExHTkJRV01zUlVGQlJTeERRVUZET3pSQ1FVTjBRaXhQUVVGUExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVGRE8zZENRVU01UWl4RFFVRkRMRU5CUVVNN2IwSkJRMDRzUTBGQlF6dHBRa0ZEU2l4RFFVTktMRU5CUVVNN1owSkJRMFlzU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenRuUWtGRGVFSXNUMEZCVHp0aFFVTldPMWxCUlVRc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGRFZDeE5RVUZOTEVOQlFVTXNTVUZCU1N4RFFVRkRMRTlCUVU4c1JVRkJSVHRuUWtGRGFrSXNUVUZCVFN4RlFVRkZMRlZCUVZVc1NVRkJTVHR2UWtGRGJFSXNUMEZCVHl4VlFVRlZMRU5CUVVNN08zZENRVU5rTEUxQlFVMHNTMEZCU3l4SFFVRkhMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeEZRVUZGTEVOQlFVTXNRMEZCUXl4RFFVRkRPM2RDUVVOcVF5eEpRVUZKTEVOQlFVTXNaMEpCUVdkQ0xFVkJRVVVzUTBGQlF6dDNRa0ZEZUVJc1MwRkJTeXhKUVVGSkxFbEJRVWtzU1VGQlNTeE5RVUZCTEUxQlFVRXNTVUZCU1N4RFFVRkRMRkZCUVZFc01FTkJRVVVzUzBGQlN5eHRRMEZCU1N4RlFVRkZMRVZCUVVVN05FSkJRM3BETEVsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03ZVVKQlEzaENPM2RDUVVORUxFOUJRVThzUzBGQlN5eERRVUZETzI5Q1FVTnFRaXhEUVVGRExFTkJRVU03WjBKQlEwNHNRMEZCUXp0blFrRkRSQ3hQUVVGUExFVkJRVVVzVlVGQlZTeEpRVUZKTzI5Q1FVTnVRaXhQUVVGUExGVkJRVlVzUTBGQlF6czdkMEpCUTJRc1NVRkJTU3hEUVVGRExFOUJRVThzUlVGQlJTeERRVUZETzNkQ1FVTm1MRXRCUVVzc1NVRkJTU3hKUVVGSkxFbEJRVWtzVFVGQlFTeE5RVUZCTEVsQlFVa3NRMEZCUXl4UlFVRlJMREJEUVVGRkxFdEJRVXNzYlVOQlFVa3NSVUZCUlN4RlFVRkZPelJDUVVONlF5eEpRVUZKTEVOQlFVTXNWVUZCVlN4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8zbENRVU42UWp0M1FrRkRSQ3hQUVVGUExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVGRE8yOUNRVU01UWl4RFFVRkRMRU5CUVVNN1owSkJRMDRzUTBGQlF6dGhRVU5LTEVOQlFVTXNRMEZEVEN4RFFVRkRPMWxCUTBZc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eFBRVUZQTEVWQlFVVTdaMEpCUTJZc1NVRkJTU3hOUVVGTkxFTkJRMDRzTmtSQlFUWkVMRU5CUTJoRkxFTkJRVU03WVVGRFREdHBRa0ZCVFR0blFrRkRTQ3hKUVVGSkxFTkJRVU1zWjBKQlFXZENMRVZCUVVVc1EwRkJRenRoUVVNelFqdFJRVU5NTEVOQlFVTXNRMEZCUXl4RFFVRkRPMGxCUTFBc1EwRkJRenRKUVVORUxHZENRVUZuUWpzN1VVRkRXaXhOUVVGTkxFbEJRVWtzUjBGQlJ5eEpRVUZKTEVOQlFVTTdVVUZEYkVJc1MwRkJTeXhKUVVGSkxFbEJRVWtzU1VGQlNTeE5RVUZCTEUxQlFVRXNTVUZCU1N4RFFVRkRMRkZCUVZFc01FTkJRVVVzUzBGQlN5eHRRMEZCU1N4RlFVRkZMRVZCUVVVN1dVRkRla01zU1VGQlNTeERRVUZETEZOQlFWTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRUUVVONFFqdFJRVVZFTEVsQlFVa3NRMEZCUXl4UFFVRlBMRWRCUVVjc1RVRkJUU3hEUVVGRExFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNVVUZCVVN4RlFVRkZPMWxCUTNwRExFOUJRVThzUlVGQlJTeFZRVUZWTEVsQlFVazdaMEpCUTI1Q0xFOUJRVThzVlVGQlZTeEpRVUZKTzI5Q1FVTnFRaXhKUVVGSkxFTkJRVU1zVTBGQlV5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMjlDUVVOeVFpeFBRVUZQTEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hGUVVGRkxFbEJRVWtzUTBGQlF5eERRVUZETzJkQ1FVTnFReXhEUVVGRExFTkJRVU03V1VGRFRpeERRVUZETzFsQlEwUXNWVUZCVlN4RlFVRkZMRlZCUVZVc1NVRkJTVHRuUWtGRGRFSXNUMEZCVHl4VlFVRlZMRWxCUVVrN2IwSkJRMnBDTEVsQlFVa3NRMEZCUXl4VlFVRlZMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03YjBKQlEzUkNMRTlCUVU4c1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVWQlFVVXNTVUZCU1N4RFFVRkRMRU5CUVVNN1owSkJRMnBETEVOQlFVTXNRMEZCUXp0WlFVTk9MRU5CUVVNN1UwRkRTaXhEUVVGRExFTkJRVU03VVVGRFNDeEpRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEpRVU5vUXl4RFFVRkRPMGxCUTBRc1UwRkJVeXhEUVVGRExFbEJRV2xDTEVWQlFVVXNSVUZCWjBJN08xRkJRM3BETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1lVRkJZU3hEUVVGRExFMUJRVTA3V1VGQlJTeFBRVUZQTzFGQlEzWkRMRWxCUVVrc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJRenRaUVVGRkxFOUJRVTg3VVVGRmRFTXNTMEZCU3l4SlFVRkpMRkZCUVZFc1NVRkJTU3hKUVVGSkxFTkJRVU1zWVVGQllTeEZRVUZGTzFsQlEzSkRMRTFCUVUwc1QwRkJUeXhIUVVOVUxFMUJRVUVzUlVGQlJTeGhRVUZHTEVWQlFVVXNZMEZCUml4RlFVRkZMRWRCUTBZc1RVRkJRU3hOUVVGQkxFMUJRVUVzVVVGQlVTeERRVUZETEVsQlFVa3NNRU5CUVVVc1UwRkJVeXd3UTBGQlJ5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMREJEUVVGRkxFOUJRVThzYlVOQlF6bERMRkZCUVZFc1EwRkJReXhYUVVGWExFTkJRVU1zWVVGQllTeERRVU01UWl3NFFrRkJPRUlzU1VGQlNTeEpRVUZKTEVOQlEzcERMRU5CUVVNN1dVRkRUaXhKUVVGSkxFTkJRVU1zVDBGQlR6dG5Ra0ZCUlN4VFFVRlRPMWxCUlhaQ0xFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dFpRVVV4UWl4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExGTkJRVk1zUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhGUVVGRkxGbEJRVmtzUTBGQlF5eERRVUZETzFOQlF6bEVPMGxCUTB3c1EwRkJRenRKUVVORUxGVkJRVlVzUTBGQlF5eEpRVUZwUWp0UlFVTjRRaXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEdGQlFXRXNRMEZCUXl4TlFVRk5PMWxCUVVVc1QwRkJUenRSUVVWMlF5eExRVUZMTEVsQlFVa3NVVUZCVVN4SlFVRkpMRWxCUVVrc1EwRkJReXhoUVVGaExFVkJRVVU3V1VGRGNrTXNUVUZCVFN4UFFVRlBMRWRCUVVjc1VVRkJVU3hEUVVGRExGZEJRVmNzUTBGQlF5eGhRVUZoTEVOQlF6bERMRGhDUVVFNFFpeEpRVUZKTEVOQlFVTXNTVUZCU1N4SlFVRkpMRU5CUXpsRExFTkJRVU03V1VGRFJpeEpRVUZKTEVOQlFVTXNUMEZCVHp0blFrRkJSU3hUUVVGVE8xbEJRM1pDTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1RVRkJUU3hEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0WlFVVTNRaXhOUVVGTkxFdEJRVXNzUjBGQlJ5eFBRVUZQTEVOQlFVTXNaMEpCUVdkQ0xFTkJRVU1zYVVKQlFXbENMRU5CUVVNc1EwRkJRenRaUVVNeFJDeEpRVUZKTEV0QlFVc3NRMEZCUXl4TlFVRk5PMmRDUVVGRkxFdEJRVXNzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXl4SlFVRkpMRVZCUVVVc1JVRkJSU3hEUVVGRExFbEJRVWtzUTBGQlF5eE5RVUZOTEVWQlFVVXNRMEZCUXl4RFFVRkRPMU5CUXpWRU8wbEJRMHdzUTBGQlF6dEpRVU5FTEZGQlFWRTdPMUZCUTBvc1QwRkJUeXhEUVVGRExFZEJRVWNzUTBGQlF5eDVRMEZCZVVNc1EwRkJReXhEUVVGRE8xRkJRM1pFTEV0QlFVc3NTVUZCU1N4SlFVRkpMRWxCUVVrc1RVRkJRU3hOUVVGQkxFbEJRVWtzUTBGQlF5eFJRVUZSTERCRFFVRkZMRXRCUVVzc2JVTkJRVWtzUlVGQlJTeEZRVUZGTzFsQlEzcERMRWxCUVVrc1EwRkJReXhWUVVGVkxFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdVMEZEZWtJN1NVRkRUQ3hEUVVGRE8wTkJRMG9pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKcGJYQnZjblFnZTF4eVhHNGdJQ0FnVG05MGFXTmxMRnh5WEc0Z0lDQWdVR3gxWjJsdUxGeHlYRzRnSUNBZ2MyVjBTV052Yml4Y2NseHVJQ0FnSUZSQlluTjBjbUZqZEVacGJHVXNYSEpjYmlBZ0lDQldhV1YzTEZ4eVhHNGdJQ0FnVjI5eWEzTndZV05sVEdWaFpseHlYRzU5SUdaeWIyMGdYQ0p2WW5OcFpHbGhibHdpTzF4eVhHNXBiWEJ2Y25RZ2V5QmhjbTkxYm1RZ2ZTQm1jbTl0SUZ3aWJXOXVhMlY1TFdGeWIzVnVaRndpTzF4eVhHNWNjbHh1YVcxd2IzSjBJRndpTGk5dFlXbHVMbU56YzF3aU8xeHlYRzVjY2x4dWFXNTBaWEptWVdObElFbHVkR1Z5Ym1Gc1VHeDFaMmx1SUh0Y2NseHVJQ0FnSUdWdVlXSnNaV1E2SUdKdmIyeGxZVzQ3WEhKY2JpQWdJQ0JsYm1GaWJHVTZJQ2hpT2lCaWIyOXNaV0Z1S1NBOVBpQjJiMmxrTzF4eVhHNGdJQ0FnWkdsellXSnNaVG9nS0dJNklHSnZiMnhsWVc0cElEMCtJSFp2YVdRN1hISmNibjFjY2x4dWFXNTBaWEptWVdObElGTjBZWEp5WldRZ1pYaDBaVzVrY3lCSmJuUmxjbTVoYkZCc2RXZHBiaUI3WEhKY2JpQWdJQ0JwYm5OMFlXNWpaVG9nZTF4eVhHNGdJQ0FnSUNBZ0lHRmtaRWwwWlcwNklDaG1hV3hsT2lCVGRHRnljbVZrUm1sc1pTa2dQVDRnZG05cFpEdGNjbHh1SUNBZ0lDQWdJQ0J5WlcxdmRtVkpkR1Z0T2lBb1ptbHNaVG9nVTNSaGNuSmxaRVpwYkdVcElEMCtJSFp2YVdRN1hISmNiaUFnSUNBZ0lDQWdhWFJsYlhNNklGTjBZWEp5WldSR2FXeGxXMTA3WEhKY2JpQWdJQ0I5TzF4eVhHNTlYSEpjYm1sdWRHVnlabUZqWlNCR2FXeGxSWGh3Ykc5eVpYSWdaWGgwWlc1a2N5QkpiblJsY201aGJGQnNkV2RwYmlCN2ZWeHlYRzVjY2x4dWFXNTBaWEptWVdObElGTjBZWEp5WldSR2FXeGxJSHRjY2x4dUlDQWdJSFI1Y0dVNklGd2labWxzWlZ3aU8xeHlYRzRnSUNBZ2RHbDBiR1U2SUhOMGNtbHVaenRjY2x4dUlDQWdJSEJoZEdnNklITjBjbWx1Wnp0Y2NseHVmVnh5WEc1cGJuUmxjbVpoWTJVZ1NXNTBaWEp1WVd4UWJIVm5hVzV6SUh0Y2NseHVJQ0FnSUhOMFlYSnlaV1E2SUZOMFlYSnlaV1E3WEhKY2JpQWdJQ0JjSW1acGJHVXRaWGh3Ykc5eVpYSmNJam9nUm1sc1pVVjRjR3h2Y21WeU8xeHlYRzU5WEhKY2JseHlYRzVrWldOc1lYSmxJRzF2WkhWc1pTQmNJbTlpYzJsa2FXRnVYQ0lnZTF4eVhHNGdJQ0FnYVc1MFpYSm1ZV05sSUVGd2NDQjdYSEpjYmlBZ0lDQWdJQ0FnYVc1MFpYSnVZV3hRYkhWbmFXNXpPaUI3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSEJzZFdkcGJuTTZJRWx1ZEdWeWJtRnNVR3gxWjJsdWN6dGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ1oyVjBVR3gxWjJsdVFubEpaRHhVSUdWNGRHVnVaSE1nYTJWNWIyWWdTVzUwWlhKdVlXeFFiSFZuYVc1elBpaGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR2xrT2lCVVhISmNiaUFnSUNBZ0lDQWdJQ0FnSUNrNklFbHVkR1Z5Ym1Gc1VHeDFaMmx1YzF0VVhUdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2JHOWhaRkJzZFdkcGJpZ3VMaTVoY21kek9pQmhibmxiWFNrNklHRnVlVHRjY2x4dUlDQWdJQ0FnSUNCOU8xeHlYRzRnSUNBZ2ZWeHlYRzRnSUNBZ2FXNTBaWEptWVdObElGUkJZbk4wY21GamRFWnBiR1VnZTF4eVhHNGdJQ0FnSUNBZ0lIUnBkR3hsUld3NklFaFVUVXhGYkdWdFpXNTBPMXh5WEc0Z0lDQWdmVnh5WEc1OVhISmNibWx1ZEdWeVptRmpaU0JHYVd4bFJYaHdiRzl5WlhKWGIzSnJjM0JoWTJWTVpXRm1JR1Y0ZEdWdVpITWdWMjl5YTNOd1lXTmxUR1ZoWmlCN1hISmNiaUFnSUNCamIyNTBZV2x1WlhKRmJEb2dTRlJOVEVWc1pXMWxiblE3WEhKY2JpQWdJQ0IyYVdWM09pQkdhV3hsUlhod2JHOXlaWEpXYVdWM08xeHlYRzU5WEhKY2JseHlYRzVwYm5SbGNtWmhZMlVnUm1sc1pVVjRjR3h2Y21WeVZtbGxkeUJsZUhSbGJtUnpJRlpwWlhjZ2UxeHlYRzRnSUNBZ1ptbHNaVWwwWlcxek9pQjdJRnR3WVhSb09pQnpkSEpwYm1kZE9pQlVRV0p6ZEhKaFkzUkdhV3hsSUgwN1hISmNibjFjY2x4dVhISmNibVY0Y0c5eWRDQmtaV1poZFd4MElHTnNZWE56SUZCeWIyMXBibVZ1ZEZOMFlYSnlaV1JHYVd4bGN5QmxlSFJsYm1SeklGQnNkV2RwYmlCN1hISmNiaUFnSUNCb1lXNWtiR1Z5T2lBb0tTQTlQaUIyYjJsa08xeHlYRzRnSUNBZ1ptbHNaWE02SUZObGREeHpkSEpwYm1jK0lEMGdibVYzSUZObGRDZ3BPMXh5WEc0Z0lDQWdaMlYwSUdWdVlXSnNaV1FvS1NCN1hISmNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlIUm9hWE11WVhCd0xtbHVkR1Z5Ym1Gc1VHeDFaMmx1Y3k1blpYUlFiSFZuYVc1Q2VVbGtLRndpYzNSaGNuSmxaRndpS1M1bGJtRmliR1ZrTzF4eVhHNGdJQ0FnZlZ4eVhHNGdJQ0FnWjJWMElITjBZWEp5WldRb0tTQjdYSEpjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJSFJvYVhNdVlYQndMbWx1ZEdWeWJtRnNVR3gxWjJsdWN5NW5aWFJRYkhWbmFXNUNlVWxrS0Z3aWMzUmhjbkpsWkZ3aUtUdGNjbHh1SUNBZ0lIMWNjbHh1SUNBZ0lHZGxkQ0JwYm5OMFlXNWpaU2dwSUh0Y2NseHVJQ0FnSUNBZ0lDQnBaaUFvSVhSb2FYTXVaVzVoWW14bFpDa2djbVYwZFhKdU8xeHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQjBhR2x6TG5OMFlYSnlaV1F1YVc1emRHRnVZMlU3WEhKY2JpQWdJQ0I5WEhKY2JpQWdJQ0JuWlhRZ1ptbHNaVVY0Y0d4dmNtVnljeWdwSUh0Y2NseHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2RHaHBjeTVoY0hBdWQyOXlhM053WVdObExtZGxkRXhsWVhabGMwOW1WSGx3WlNoY2NseHVJQ0FnSUNBZ0lDQWdJQ0FnWENKbWFXeGxMV1Y0Y0d4dmNtVnlYQ0pjY2x4dUlDQWdJQ0FnSUNBcElHRnpJRVpwYkdWRmVIQnNiM0psY2xkdmNtdHpjR0ZqWlV4bFlXWmJYVHRjY2x4dUlDQWdJSDFjY2x4dUlDQWdJR0Z6ZVc1aklHOXViRzloWkNncElIdGNjbHh1SUNBZ0lDQWdJQ0JqYjI1emIyeGxMbXh2WnloY0lsQnliMjFwYm1WdWRDQlRkR0Z5Y21Wa0lFWnBiR1Z6SUhCc2RXZHBiaUJzYjJGa1pXUmNJaWs3WEhKY2JseHlYRzRnSUNBZ0lDQWdJSFJvYVhNdVlYQndMbmR2Y210emNHRmpaUzV2Ymt4aGVXOTFkRkpsWVdSNUtDZ3BJRDArSUhSb2FYTXVZMmhsWTJ0QmJtUkZibUZpYkdVb0tTazdYSEpjYmlBZ0lDQjlYSEpjYmlBZ0lDQmphR1ZqYTBGdVpFVnVZV0pzWlNncElIdGNjbHh1SUNBZ0lDQWdJQ0J6WlhSVWFXMWxiM1YwS0NncElEMCtJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdZMjl1YzNRZ2MyVnNaaUE5SUhSb2FYTTdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHbG1JQ2hjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNGMGFHbHpMbUZ3Y0M1cGJuUmxjbTVoYkZCc2RXZHBibk11WjJWMFVHeDFaMmx1UW5sSlpDaGNJbVpwYkdVdFpYaHdiRzl5WlhKY0lpa3VaVzVoWW14bFpGeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBcElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRzVsZHlCT2IzUnBZMlVvWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdYQ0pVYUdVZ1JtbHNaU0JGZUhCc2IzSmxjaUJqYjNKbElIQnNkV2RwYmlCdGRYTjBJR0psSUdWdVlXSnNaV1FnZEc4Z2RYTmxJSFJvYVhNZ2NHeDFaMmx1TGx3aVhISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQXBPMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHTnZibk4wSUdWNGNHeHZjbVZ5SUQwZ1lYSnZkVzVrS0Z4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSFJvYVhNdVlYQndMbWx1ZEdWeWJtRnNVR3gxWjJsdWN5NW5aWFJRYkhWbmFXNUNlVWxrS0Z3aVptbHNaUzFsZUhCc2IzSmxjbHdpS1N4Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdWdVlXSnNaVG9nWm5WdVkzUnBiMjRnS0c1bGVIUXBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCbWRXNWpkR2x2YmlBb1lpa2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR052Ym5OMElHRndjR3g1SUQwZ2JtVjRkQzVqWVd4c0tIUm9hWE1zSUdJcE8xeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHVjRjR3h2Y21WeUtDazdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjMlZzWmk1amFHVmphMEZ1WkVWdVlXSnNaU2dwTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJoY0hCc2VUdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUgwN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIMHNYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR1JwYzJGaWJHVTZJR1oxYm1OMGFXOXVJQ2h1WlhoMEtTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnWm5WdVkzUnBiMjRnS0dJcElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmxlSEJzYjNKbGNpZ3BPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSE5sYkdZdVkyaGxZMnRCYm1SRmJtRmliR1VvS1R0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnYm1WNGRDNWpZV3hzS0hSb2FYTXNJR0lwTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdmVHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZlZ4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDFjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNrN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjBhR2x6TG5KbFoybHpkR1Z5S0dWNGNHeHZjbVZ5S1R0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5Ymp0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2RHaHBjeTV5WldkcGMzUmxjaWhjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdGeWIzVnVaQ2gwYUdsekxuTjBZWEp5WldRc0lIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCbGJtRmliR1U2SUdaMWJtTjBhVzl1SUNodVpYaDBLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJtZFc1amRHbHZiaUFvWWlrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWTI5dWMzUWdZWEJ3YkhrZ1BTQnVaWGgwTG1OaGJHd29kR2hwY3l3Z1lpazdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCelpXeG1MbkpsWjJsemRHVnlTR0Z1Wkd4bGNuTW9LVHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHWnZjaUFvYkdWMElHbDBaVzBnYjJZZ2MyVnNaaTVwYm5OMFlXNWpaVDh1YVhSbGJYTWdQejhnVzEwcElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnpaV3htTG1Gd2NHeDVVM1JoY2locGRHVnRLVHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIMWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJoY0hCc2VUdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdmVHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjlMRnh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHUnBjMkZpYkdVNklHWjFibU4wYVc5dUlDaHVaWGgwS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCbWRXNWpkR2x2YmlBb1lpa2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2MyVnNaaTVvWVc1a2JHVnlLQ2s3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQm1iM0lnS0d4bGRDQnBkR1Z0SUc5bUlITmxiR1l1YVc1emRHRnVZMlUvTG1sMFpXMXpJRDgvSUZ0ZEtTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjMlZzWmk1eVpXMXZkbVZUZEdGeUtHbDBaVzBwTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdmVnh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUc1bGVIUXVZMkZzYkNoMGFHbHpMQ0JpS1R0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZUdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOVhISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjlLVnh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQXBPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnBaaUFvSVhSb2FYTXVaVzVoWW14bFpDa2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYm1WM0lFNXZkR2xqWlNoY2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JjSWxSb1pTQlRkR0Z5Y21Wa0lHTnZjbVVnY0d4MVoybHVJRzExYzNRZ1ltVWdaVzVoWW14bFpDQjBieUIxYzJVZ2RHaHBjeUJ3YkhWbmFXNHVYQ0pjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNrN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUgwZ1pXeHpaU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCMGFHbHpMbkpsWjJsemRHVnlTR0Z1Wkd4bGNuTW9LVHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdmVnh5WEc0Z0lDQWdJQ0FnSUgwcE8xeHlYRzRnSUNBZ2ZWeHlYRzRnSUNBZ2NtVm5hWE4wWlhKSVlXNWtiR1Z5Y3lncElIdGNjbHh1SUNBZ0lDQWdJQ0JqYjI1emRDQnpaV3htSUQwZ2RHaHBjenRjY2x4dUlDQWdJQ0FnSUNCbWIzSWdLR3hsZENCcGRHVnRJRzltSUhSb2FYTXVhVzV6ZEdGdVkyVS9MbWwwWlcxeklEOC9JRnRkS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUhSb2FYTXVZWEJ3YkhsVGRHRnlLR2wwWlcwcE8xeHlYRzRnSUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQWdkR2hwY3k1b1lXNWtiR1Z5SUQwZ1lYSnZkVzVrS0hSb2FYTXVjM1JoY25KbFpDNXBibk4wWVc1alpTd2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQmhaR1JKZEdWdE9pQm1kVzVqZEdsdmJpQW9ibVY0ZENrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlHWjFibU4wYVc5dUlDaG1hV3hsS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYzJWc1ppNWhjSEJzZVZOMFlYSW9abWxzWlNrN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJRzVsZUhRdVkyRnNiQ2gwYUdsekxDQm1hV3hsS1R0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIMDdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIMHNYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxiVzkyWlVsMFpXMDZJR1oxYm1OMGFXOXVJQ2h1WlhoMEtTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdablZ1WTNScGIyNGdLR1pwYkdVcElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCelpXeG1MbkpsYlc5MlpWTjBZWElvWm1sc1pTazdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUc1bGVIUXVZMkZzYkNoMGFHbHpMQ0JtYVd4bEtUdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDA3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSDFjY2x4dUlDQWdJQ0FnSUNCOUtUdGNjbHh1SUNBZ0lDQWdJQ0IwYUdsekxuSmxaMmx6ZEdWeUtIUm9hWE11YUdGdVpHeGxjaWs3WEhKY2JpQWdJQ0I5WEhKY2JpQWdJQ0JoY0hCc2VWTjBZWElvWm1sc1pUb2dVM1JoY25KbFpFWnBiR1VzSUdWc1B6b2dTRlJOVEVWc1pXMWxiblFwSUh0Y2NseHVJQ0FnSUNBZ0lDQnBaaUFvSVhSb2FYTXVabWxzWlVWNGNHeHZjbVZ5Y3k1c1pXNW5kR2dwSUhKbGRIVnlianRjY2x4dUlDQWdJQ0FnSUNCcFppQW9kR2hwY3k1bWFXeGxjeTVvWVhNb1ptbHNaUzV3WVhSb0tTa2djbVYwZFhKdU8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNCbWIzSWdLR3hsZENCbGVIQnNiM0psY2lCdlppQjBhR2x6TG1acGJHVkZlSEJzYjNKbGNuTXBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdZMjl1YzNRZ1pXeGxiV1Z1ZENBOVhISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmxiQ0EvUDF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1pYaHdiRzl5WlhJdWRtbGxkejh1Wm1sc1pVbDBaVzF6UHk1YlptbHNaUzV3WVhSb1hUOHVkR2wwYkdWRmJDQS9QMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWlhod2JHOXlaWEl1WTI5dWRHRnBibVZ5Uld3dWNYVmxjbmxUWld4bFkzUnZjaWhjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmdMbTVoZGkxbWFXeGxMWFJwZEd4bFcyUmhkR0V0Y0dGMGFEMWNJaVI3Wm1sc1pYMWNJbDFnWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBcE8xeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCcFppQW9JV1ZzWlcxbGJuUXBJR052Ym5ScGJuVmxPMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnZEdocGN5NW1hV3hsY3k1aFpHUW9abWxzWlM1d1lYUm9LVHRjY2x4dVhISmNiaUFnSUNBZ0lDQWdJQ0FnSUhObGRFbGpiMjRvWld4bGJXVnVkQzVqY21WaGRHVkVhWFlvWENKd2NtOXRhVzVsYm5RdGMzUmhjbHdpS1N3Z1hDSnpkR0Z5TFdkc2VYQm9YQ0lwTzF4eVhHNGdJQ0FnSUNBZ0lIMWNjbHh1SUNBZ0lIMWNjbHh1SUNBZ0lISmxiVzkyWlZOMFlYSW9abWxzWlRvZ1UzUmhjbkpsWkVacGJHVXBJSHRjY2x4dUlDQWdJQ0FnSUNCcFppQW9JWFJvYVhNdVptbHNaVVY0Y0d4dmNtVnljeTVzWlc1bmRHZ3BJSEpsZEhWeWJqdGNjbHh1WEhKY2JpQWdJQ0FnSUNBZ1ptOXlJQ2hzWlhRZ1pYaHdiRzl5WlhJZ2IyWWdkR2hwY3k1bWFXeGxSWGh3Ykc5eVpYSnpLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJR052Ym5OMElHVnNaVzFsYm5RZ1BTQmxlSEJzYjNKbGNpNWpiMjUwWVdsdVpYSkZiQzV4ZFdWeWVWTmxiR1ZqZEc5eUtGeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdZQzV1WVhZdFptbHNaUzEwYVhSc1pWdGtZWFJoTFhCaGRHZzlYQ0lrZTJacGJHVXVjR0YwYUgxY0lsMWdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDazdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHbG1JQ2doWld4bGJXVnVkQ2tnWTI5dWRHbHVkV1U3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSFJvYVhNdVptbHNaWE11WkdWc1pYUmxLR1pwYkdVdWNHRjBhQ2s3WEhKY2JseHlYRzRnSUNBZ0lDQWdJQ0FnSUNCamIyNXpkQ0J6ZEdGeWN5QTlJR1ZzWlcxbGJuUXVjWFZsY25sVFpXeGxZM1J2Y2tGc2JDaGNJaTV3Y205dGFXNWxiblF0YzNSaGNsd2lLVHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0hOMFlYSnpMbXhsYm1kMGFDa2djM1JoY25NdVptOXlSV0ZqYUNnb2MzUmhjaWtnUFQ0Z2MzUmhjaTVrWlhSaFkyZ29LU2s3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzRnSUNBZ2ZWeHlYRzRnSUNBZ2IyNTFibXh2WVdRb0tTQjdYSEpjYmlBZ0lDQWdJQ0FnWTI5dWMyOXNaUzVzYjJjb1hDSlFjbTl0YVc1bGJuUWdVM1JoY25KbFpDQkdhV3hsY3lCd2JIVm5hVzRnZFc1c2IyRmtaV1JjSWlrN1hISmNiaUFnSUNBZ0lDQWdabTl5SUNoc1pYUWdabWxzWlNCdlppQjBhR2x6TG1sdWMzUmhibU5sUHk1cGRHVnRjeUEvUHlCYlhTa2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjBhR2x6TG5KbGJXOTJaVk4wWVhJb1ptbHNaU2s3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzRnSUNBZ2ZWeHlYRzU5WEhKY2JpSmRmUT09Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9