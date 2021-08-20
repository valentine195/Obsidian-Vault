/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/tslib/tslib.es6.js":
/*!*****************************************!*\
  !*** ./node_modules/tslib/tslib.es6.js ***!
  \*****************************************/
/***/ (() => {

throw new Error("Module parse failed: Cannot read property 'resource' of undefined\nYou may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders\nTypeError: Cannot read property 'resource' of undefined\n    at C:\\Users\\jvalentine\\Documents\\GitHub\\Personal\\obsidian-leaflet-plugin\\node_modules\\workerize-loader\\dist\\index.js:97:44\n    at Hook.eval [as call] (eval at create (C:\\Users\\jvalentine\\Documents\\GitHub\\Personal\\obsidian-leaflet-plugin\\node_modules\\tapable\\lib\\HookCodeFactory.js:19:10), <anonymous>:7:16)\n    at Hook.CALL_DELEGATE [as _call] (C:\\Users\\jvalentine\\Documents\\GitHub\\Personal\\obsidian-leaflet-plugin\\node_modules\\tapable\\lib\\Hook.js:14:14)\n    at JavascriptParser.blockPreWalkExportNamedDeclaration (C:\\Users\\jvalentine\\Documents\\GitHub\\Personal\\obsidian-leaflet-plugin\\node_modules\\webpack\\lib\\javascript\\JavascriptParser.js:1899:35)\n    at JavascriptParser.blockPreWalkStatement (C:\\Users\\jvalentine\\Documents\\GitHub\\Personal\\obsidian-leaflet-plugin\\node_modules\\webpack\\lib\\javascript\\JavascriptParser.js:1491:10)\n    at JavascriptParser.blockPreWalkStatements (C:\\Users\\jvalentine\\Documents\\GitHub\\Personal\\obsidian-leaflet-plugin\\node_modules\\webpack\\lib\\javascript\\JavascriptParser.js:1412:9)\n    at JavascriptParser.parse (C:\\Users\\jvalentine\\Documents\\GitHub\\Personal\\obsidian-leaflet-plugin\\node_modules\\webpack\\lib\\javascript\\JavascriptParser.js:3303:9)\n    at C:\\Users\\jvalentine\\Documents\\GitHub\\Personal\\obsidian-leaflet-plugin\\node_modules\\webpack\\lib\\NormalModule.js:1016:26\n    at processResult (C:\\Users\\jvalentine\\Documents\\GitHub\\Personal\\obsidian-leaflet-plugin\\node_modules\\webpack\\lib\\NormalModule.js:743:11)\n    at C:\\Users\\jvalentine\\Documents\\GitHub\\Personal\\obsidian-leaflet-plugin\\node_modules\\webpack\\lib\\NormalModule.js:807:5");

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
/*!*****************************************************************************************************************************************************!*\
  !*** ./node_modules/workerize-loader/dist/rpc-worker-loader.js!./node_modules/ts-loader/index.js??ruleSet[1].rules[1]!./src/worker/image.worker.ts ***!
  \*****************************************************************************************************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tslib__WEBPACK_IMPORTED_MODULE_0__);

const ctx = self;
// Respond to message from parent thread
ctx.onmessage = (event) => (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__awaiter)(void 0, void 0, void 0, function* () {
    if (!event.data.type)
        return;
    if (event.data.type === "url") {
        for (let { blob, id } of event.data.blobs) {
            ctx.postMessage({ data: yield toDataURL(blob), id });
        }
    }
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({});
function toDataURL(blob) {
    return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__awaiter)(this, void 0, void 0, function* () {
        //determine link type
        return new Promise((resolve, reject) => (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__awaiter)(this, void 0, void 0, function* () {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === "string") {
                    let data = reader.result.slice(reader.result.indexOf(";base64,"));
                    resolve({ data /* , h, w */ });
                }
                else {
                    reject();
                }
            };
            /*         const bitmap = await createImageBitmap(blob);
                    const { height: h, width: w } = bitmap;
             */
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        }));
    });
}

addEventListener('message', function (e) {var _e$data = e.data,type = _e$data.type,method = _e$data.method,id = _e$data.id,params = _e$data.params,f,p;if (type === 'RPC' && method) {if (f = __webpack_exports__[method]) {p = Promise.resolve().then(function () {return f.apply(__webpack_exports__, params);});} else {p = Promise.reject('No such method');}p.then(function (result) {postMessage({type: 'RPC',id: id,result: result});}).catch(function (e) {var error = {message: e};if (e.stack) {error.message = e.message;error.stack = e.stack;error.name = e.name;}postMessage({type: 'RPC',id: id,error: error});});}});postMessage({type: 'RPC',method: 'ready'});
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9vYnNpZGlhbi1sZWFmbGV0LXBsdWdpbi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9vYnNpZGlhbi1sZWFmbGV0LXBsdWdpbi93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9vYnNpZGlhbi1sZWFmbGV0LXBsdWdpbi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vb2JzaWRpYW4tbGVhZmxldC1wbHVnaW4vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9vYnNpZGlhbi1sZWFmbGV0LXBsdWdpbi93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL29ic2lkaWFuLWxlYWZsZXQtcGx1Z2luLy4vc3JjL3dvcmtlci9pbWFnZS53b3JrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztVQUFBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxnQ0FBZ0MsWUFBWTtXQUM1QztXQUNBLEU7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7Ozs7Ozs7Ozs7Ozs7OztBQ05BLE1BQU0sR0FBRyxHQUFXLElBQVcsQ0FBQztBQUVoQyx3Q0FBd0M7QUFDeEMsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFPLEtBQUssRUFBRSxFQUFFLENBQUM7SUFDN0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSTtRQUFFLE9BQU87SUFFN0IsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxLQUFLLEVBQUU7UUFDM0IsS0FBSyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ3ZDLEdBQUcsQ0FBQyxXQUFXLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztTQUN4RDtLQUNKO0FBQ0wsQ0FBQyxFQUFDO0FBRUYsaUVBQWUsRUFBd0MsRUFBQztBQUV4RCxTQUFlLFNBQVMsQ0FDcEIsSUFBVTs7UUFFVixxQkFBcUI7UUFDckIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFPLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDO1lBQzFDLE1BQU0sTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7WUFDaEMsTUFBTSxDQUFDLFNBQVMsR0FBRyxHQUFHLEVBQUU7Z0JBQ3BCLElBQUksT0FBTyxNQUFNLENBQUMsTUFBTSxLQUFLLFFBQVEsRUFBRTtvQkFDbkMsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQzFCLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUNwQyxDQUFDO29CQUNGLE9BQU8sQ0FBQyxFQUFFLElBQUksYUFBWSxFQUFFLENBQUMsQ0FBQztpQkFDakM7cUJBQU07b0JBQ0gsTUFBTSxFQUFFLENBQUM7aUJBQ1o7WUFDTCxDQUFDLENBQUM7WUFFVjs7ZUFFRztZQUNLLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0IsQ0FBQyxFQUFDLENBQUM7SUFDUCxDQUFDO0NBQUEiLCJmaWxlIjoiNTJjYmI4MDY0NWM2YTcxNzg5ODkud29ya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImNvbnN0IGN0eDogV29ya2VyID0gc2VsZiBhcyBhbnk7XHJcblxyXG4vLyBSZXNwb25kIHRvIG1lc3NhZ2UgZnJvbSBwYXJlbnQgdGhyZWFkXHJcbmN0eC5vbm1lc3NhZ2UgPSBhc3luYyAoZXZlbnQpID0+IHtcclxuICAgIGlmICghZXZlbnQuZGF0YS50eXBlKSByZXR1cm47XHJcblxyXG4gICAgaWYgKGV2ZW50LmRhdGEudHlwZSA9PT0gXCJ1cmxcIikge1xyXG4gICAgICAgIGZvciAobGV0IHsgYmxvYiwgaWQgfSBvZiBldmVudC5kYXRhLmJsb2JzKSB7XHJcbiAgICAgICAgICAgIGN0eC5wb3N0TWVzc2FnZSh7IGRhdGE6IGF3YWl0IHRvRGF0YVVSTChibG9iKSwgaWQgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge30gYXMgdHlwZW9mIFdvcmtlciAmIChuZXcgKCkgPT4gV29ya2VyKTtcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHRvRGF0YVVSTChcclxuICAgIGJsb2I6IEJsb2JcclxuKTogUHJvbWlzZTx7IGRhdGE6IHN0cmluZzsgLyogaDogbnVtYmVyOyB3OiBudW1iZXIgKi8gfT4ge1xyXG4gICAgLy9kZXRlcm1pbmUgbGluayB0eXBlXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgICAgcmVhZGVyLm9ubG9hZGVuZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiByZWFkZXIucmVzdWx0ID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IHJlYWRlci5yZXN1bHQuc2xpY2UoXHJcbiAgICAgICAgICAgICAgICAgICAgcmVhZGVyLnJlc3VsdC5pbmRleE9mKFwiO2Jhc2U2NCxcIilcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHsgZGF0YS8qICwgaCwgdyAqLyB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlamVjdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbi8qICAgICAgICAgY29uc3QgYml0bWFwID0gYXdhaXQgY3JlYXRlSW1hZ2VCaXRtYXAoYmxvYik7XHJcbiAgICAgICAgY29uc3QgeyBoZWlnaHQ6IGgsIHdpZHRoOiB3IH0gPSBiaXRtYXA7XHJcbiAqL1xyXG4gICAgICAgIHJlYWRlci5vbmVycm9yID0gcmVqZWN0O1xyXG4gICAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGJsb2IpO1xyXG4gICAgfSk7XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==