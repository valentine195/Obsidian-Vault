/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/main.css":
/*!**********************!*\
  !*** ./src/main.css ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://obsidian-info-plugin/./src/main.css?");

/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ MyPlugin)\n/* harmony export */ });\n/* harmony import */ var _main_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./main.css */ \"./src/main.css\");\n/* harmony import */ var obsidian__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! obsidian */ \"obsidian\");\n/* harmony import */ var obsidian__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(obsidian__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! electron */ \"electron\");\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_2__);\n\r\n\r\n\r\n//in the code;\r\nconst DEFAULT_SETTINGS = {};\r\nclass MyPlugin extends obsidian__WEBPACK_IMPORTED_MODULE_1__.Plugin {\r\n    settings;\r\n    async onload() {\r\n        await this.loadSettings();\r\n        this.addCommand({\r\n            id: \"info\",\r\n            name: \"Display Info\",\r\n            callback: () => {\r\n                new InfoModal(this.app);\r\n            }\r\n        });\r\n    }\r\n    onunload() { }\r\n    async loadSettings() {\r\n        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());\r\n    }\r\n    async saveSettings() {\r\n        await this.saveData(this.settings);\r\n    }\r\n}\r\nclass InfoModal extends obsidian__WEBPACK_IMPORTED_MODULE_1__.Modal {\r\n    config;\r\n    constructor(app) {\r\n        super(app);\r\n        this.config = {\r\n            theme: this.app.vault.config.theme,\r\n            cssTheme: this.app.vault.config.cssTheme,\r\n            enabledCssSnippets: this.app.vault.config.enabledCssSnippets,\r\n            enabledPlugins: this.app.plugins.enabledPlugins,\r\n            obsidianVersion: electron__WEBPACK_IMPORTED_MODULE_2__.ipcRenderer.sendSync(\"version\"),\r\n            installerVersion: electron__WEBPACK_IMPORTED_MODULE_2__.remote.app.getVersion()\r\n        };\r\n        this.open();\r\n    }\r\n    onOpen() {\r\n        this.display();\r\n    }\r\n    async display() {\r\n        this.titleEl.setText(\"Obsidian Info\");\r\n        this.contentEl.addClass(\"obsidian-info-plugin\");\r\n        const string = [\r\n            [\"Obsidian Version\", this.config.obsidianVersion],\r\n            [\"Installer Version\", this.config.installerVersion]\r\n        ];\r\n        const theme = this.config.cssTheme.length\r\n            ? this.config.cssTheme\r\n            : \"Default\";\r\n        const mode = this.config.theme === \"moonstone\" ? \"Light\" : \"Dark\";\r\n        string.push([\"Theme\", `${theme} (${mode})`], [\"CSS Snippets\", this.config.enabledCssSnippets.length]);\r\n        if (this.config.enabledPlugins.size > 0) {\r\n            let plugins = [];\r\n            for (const plugin of this.config.enabledPlugins) {\r\n                const manifest = this.app.plugins.manifests[plugin];\r\n                plugins.push(`${manifest.name} (${manifest.version})`);\r\n            }\r\n            string.push([\r\n                `Enabled Community Plugins (${this.config.enabledPlugins.size})`,\r\n                plugins.join(\", \")\r\n            ]);\r\n        }\r\n        else {\r\n            string.push([\"Enabled Community Plugins\", \"None\"]);\r\n        }\r\n        for (const [name, desc] of string) {\r\n            new obsidian__WEBPACK_IMPORTED_MODULE_1__.Setting(this.contentEl)\r\n                .setName(createFragment((e) => e.createEl(\"strong\", { text: name })))\r\n                .controlEl.appendText(desc ? desc : \"\");\r\n        }\r\n        await navigator.clipboard.writeText(string.map((s) => s.join(\": \")).join(\"\\n\"));\r\n        new obsidian__WEBPACK_IMPORTED_MODULE_1__.Notice(\"The information displayed has been copied to the clipboard.\");\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack://obsidian-info-plugin/./src/main.ts?");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.ts");
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;