/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/mime/Mime.js":
/*!***********************************!*\
  !*** ./node_modules/mime/Mime.js ***!
  \***********************************/
/***/ ((module) => {

"use strict";
eval("\n\n/**\n * @param typeMap [Object] Map of MIME type -> Array[extensions]\n * @param ...\n */\nfunction Mime() {\n  this._types = Object.create(null);\n  this._extensions = Object.create(null);\n\n  for (let i = 0; i < arguments.length; i++) {\n    this.define(arguments[i]);\n  }\n\n  this.define = this.define.bind(this);\n  this.getType = this.getType.bind(this);\n  this.getExtension = this.getExtension.bind(this);\n}\n\n/**\n * Define mimetype -> extension mappings.  Each key is a mime-type that maps\n * to an array of extensions associated with the type.  The first extension is\n * used as the default extension for the type.\n *\n * e.g. mime.define({'audio/ogg', ['oga', 'ogg', 'spx']});\n *\n * If a type declares an extension that has already been defined, an error will\n * be thrown.  To suppress this error and force the extension to be associated\n * with the new type, pass `force`=true.  Alternatively, you may prefix the\n * extension with \"*\" to map the type to extension, without mapping the\n * extension to the type.\n *\n * e.g. mime.define({'audio/wav', ['wav']}, {'audio/x-wav', ['*wav']});\n *\n *\n * @param map (Object) type definitions\n * @param force (Boolean) if true, force overriding of existing definitions\n */\nMime.prototype.define = function(typeMap, force) {\n  for (let type in typeMap) {\n    let extensions = typeMap[type].map(function(t) {\n      return t.toLowerCase();\n    });\n    type = type.toLowerCase();\n\n    for (let i = 0; i < extensions.length; i++) {\n      const ext = extensions[i];\n\n      // '*' prefix = not the preferred type for this extension.  So fixup the\n      // extension, and skip it.\n      if (ext[0] === '*') {\n        continue;\n      }\n\n      if (!force && (ext in this._types)) {\n        throw new Error(\n          'Attempt to change mapping for \"' + ext +\n          '\" extension from \"' + this._types[ext] + '\" to \"' + type +\n          '\". Pass `force=true` to allow this, otherwise remove \"' + ext +\n          '\" from the list of extensions for \"' + type + '\".'\n        );\n      }\n\n      this._types[ext] = type;\n    }\n\n    // Use first extension as default\n    if (force || !this._extensions[type]) {\n      const ext = extensions[0];\n      this._extensions[type] = (ext[0] !== '*') ? ext : ext.substr(1);\n    }\n  }\n};\n\n/**\n * Lookup a mime type based on extension\n */\nMime.prototype.getType = function(path) {\n  path = String(path);\n  let last = path.replace(/^.*[/\\\\]/, '').toLowerCase();\n  let ext = last.replace(/^.*\\./, '').toLowerCase();\n\n  let hasPath = last.length < path.length;\n  let hasDot = ext.length < last.length - 1;\n\n  return (hasDot || !hasPath) && this._types[ext] || null;\n};\n\n/**\n * Return file extension associated with a mime type\n */\nMime.prototype.getExtension = function(type) {\n  type = /^\\s*([^;\\s]*)/.test(type) && RegExp.$1;\n  return type && this._extensions[type.toLowerCase()] || null;\n};\n\nmodule.exports = Mime;\n\n\n//# sourceURL=webpack://obsidian-image-window/./node_modules/mime/Mime.js?");

/***/ }),

/***/ "./node_modules/mime/lite.js":
/*!***********************************!*\
  !*** ./node_modules/mime/lite.js ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nlet Mime = __webpack_require__(/*! ./Mime */ \"./node_modules/mime/Mime.js\");\nmodule.exports = new Mime(__webpack_require__(/*! ./types/standard */ \"./node_modules/mime/types/standard.js\"));\n\n\n//# sourceURL=webpack://obsidian-image-window/./node_modules/mime/lite.js?");

/***/ }),

/***/ "./node_modules/mime/types/standard.js":
/*!*********************************************!*\
  !*** ./node_modules/mime/types/standard.js ***!
  \*********************************************/
/***/ ((module) => {

eval("module.exports = {\"application/andrew-inset\":[\"ez\"],\"application/applixware\":[\"aw\"],\"application/atom+xml\":[\"atom\"],\"application/atomcat+xml\":[\"atomcat\"],\"application/atomdeleted+xml\":[\"atomdeleted\"],\"application/atomsvc+xml\":[\"atomsvc\"],\"application/atsc-dwd+xml\":[\"dwd\"],\"application/atsc-held+xml\":[\"held\"],\"application/atsc-rsat+xml\":[\"rsat\"],\"application/bdoc\":[\"bdoc\"],\"application/calendar+xml\":[\"xcs\"],\"application/ccxml+xml\":[\"ccxml\"],\"application/cdfx+xml\":[\"cdfx\"],\"application/cdmi-capability\":[\"cdmia\"],\"application/cdmi-container\":[\"cdmic\"],\"application/cdmi-domain\":[\"cdmid\"],\"application/cdmi-object\":[\"cdmio\"],\"application/cdmi-queue\":[\"cdmiq\"],\"application/cu-seeme\":[\"cu\"],\"application/dash+xml\":[\"mpd\"],\"application/davmount+xml\":[\"davmount\"],\"application/docbook+xml\":[\"dbk\"],\"application/dssc+der\":[\"dssc\"],\"application/dssc+xml\":[\"xdssc\"],\"application/ecmascript\":[\"es\",\"ecma\"],\"application/emma+xml\":[\"emma\"],\"application/emotionml+xml\":[\"emotionml\"],\"application/epub+zip\":[\"epub\"],\"application/exi\":[\"exi\"],\"application/express\":[\"exp\"],\"application/fdt+xml\":[\"fdt\"],\"application/font-tdpfr\":[\"pfr\"],\"application/geo+json\":[\"geojson\"],\"application/gml+xml\":[\"gml\"],\"application/gpx+xml\":[\"gpx\"],\"application/gxf\":[\"gxf\"],\"application/gzip\":[\"gz\"],\"application/hjson\":[\"hjson\"],\"application/hyperstudio\":[\"stk\"],\"application/inkml+xml\":[\"ink\",\"inkml\"],\"application/ipfix\":[\"ipfix\"],\"application/its+xml\":[\"its\"],\"application/java-archive\":[\"jar\",\"war\",\"ear\"],\"application/java-serialized-object\":[\"ser\"],\"application/java-vm\":[\"class\"],\"application/javascript\":[\"js\",\"mjs\"],\"application/json\":[\"json\",\"map\"],\"application/json5\":[\"json5\"],\"application/jsonml+json\":[\"jsonml\"],\"application/ld+json\":[\"jsonld\"],\"application/lgr+xml\":[\"lgr\"],\"application/lost+xml\":[\"lostxml\"],\"application/mac-binhex40\":[\"hqx\"],\"application/mac-compactpro\":[\"cpt\"],\"application/mads+xml\":[\"mads\"],\"application/manifest+json\":[\"webmanifest\"],\"application/marc\":[\"mrc\"],\"application/marcxml+xml\":[\"mrcx\"],\"application/mathematica\":[\"ma\",\"nb\",\"mb\"],\"application/mathml+xml\":[\"mathml\"],\"application/mbox\":[\"mbox\"],\"application/mediaservercontrol+xml\":[\"mscml\"],\"application/metalink+xml\":[\"metalink\"],\"application/metalink4+xml\":[\"meta4\"],\"application/mets+xml\":[\"mets\"],\"application/mmt-aei+xml\":[\"maei\"],\"application/mmt-usd+xml\":[\"musd\"],\"application/mods+xml\":[\"mods\"],\"application/mp21\":[\"m21\",\"mp21\"],\"application/mp4\":[\"mp4s\",\"m4p\"],\"application/msword\":[\"doc\",\"dot\"],\"application/mxf\":[\"mxf\"],\"application/n-quads\":[\"nq\"],\"application/n-triples\":[\"nt\"],\"application/node\":[\"cjs\"],\"application/octet-stream\":[\"bin\",\"dms\",\"lrf\",\"mar\",\"so\",\"dist\",\"distz\",\"pkg\",\"bpk\",\"dump\",\"elc\",\"deploy\",\"exe\",\"dll\",\"deb\",\"dmg\",\"iso\",\"img\",\"msi\",\"msp\",\"msm\",\"buffer\"],\"application/oda\":[\"oda\"],\"application/oebps-package+xml\":[\"opf\"],\"application/ogg\":[\"ogx\"],\"application/omdoc+xml\":[\"omdoc\"],\"application/onenote\":[\"onetoc\",\"onetoc2\",\"onetmp\",\"onepkg\"],\"application/oxps\":[\"oxps\"],\"application/p2p-overlay+xml\":[\"relo\"],\"application/patch-ops-error+xml\":[\"xer\"],\"application/pdf\":[\"pdf\"],\"application/pgp-encrypted\":[\"pgp\"],\"application/pgp-signature\":[\"asc\",\"sig\"],\"application/pics-rules\":[\"prf\"],\"application/pkcs10\":[\"p10\"],\"application/pkcs7-mime\":[\"p7m\",\"p7c\"],\"application/pkcs7-signature\":[\"p7s\"],\"application/pkcs8\":[\"p8\"],\"application/pkix-attr-cert\":[\"ac\"],\"application/pkix-cert\":[\"cer\"],\"application/pkix-crl\":[\"crl\"],\"application/pkix-pkipath\":[\"pkipath\"],\"application/pkixcmp\":[\"pki\"],\"application/pls+xml\":[\"pls\"],\"application/postscript\":[\"ai\",\"eps\",\"ps\"],\"application/provenance+xml\":[\"provx\"],\"application/pskc+xml\":[\"pskcxml\"],\"application/raml+yaml\":[\"raml\"],\"application/rdf+xml\":[\"rdf\",\"owl\"],\"application/reginfo+xml\":[\"rif\"],\"application/relax-ng-compact-syntax\":[\"rnc\"],\"application/resource-lists+xml\":[\"rl\"],\"application/resource-lists-diff+xml\":[\"rld\"],\"application/rls-services+xml\":[\"rs\"],\"application/route-apd+xml\":[\"rapd\"],\"application/route-s-tsid+xml\":[\"sls\"],\"application/route-usd+xml\":[\"rusd\"],\"application/rpki-ghostbusters\":[\"gbr\"],\"application/rpki-manifest\":[\"mft\"],\"application/rpki-roa\":[\"roa\"],\"application/rsd+xml\":[\"rsd\"],\"application/rss+xml\":[\"rss\"],\"application/rtf\":[\"rtf\"],\"application/sbml+xml\":[\"sbml\"],\"application/scvp-cv-request\":[\"scq\"],\"application/scvp-cv-response\":[\"scs\"],\"application/scvp-vp-request\":[\"spq\"],\"application/scvp-vp-response\":[\"spp\"],\"application/sdp\":[\"sdp\"],\"application/senml+xml\":[\"senmlx\"],\"application/sensml+xml\":[\"sensmlx\"],\"application/set-payment-initiation\":[\"setpay\"],\"application/set-registration-initiation\":[\"setreg\"],\"application/shf+xml\":[\"shf\"],\"application/sieve\":[\"siv\",\"sieve\"],\"application/smil+xml\":[\"smi\",\"smil\"],\"application/sparql-query\":[\"rq\"],\"application/sparql-results+xml\":[\"srx\"],\"application/srgs\":[\"gram\"],\"application/srgs+xml\":[\"grxml\"],\"application/sru+xml\":[\"sru\"],\"application/ssdl+xml\":[\"ssdl\"],\"application/ssml+xml\":[\"ssml\"],\"application/swid+xml\":[\"swidtag\"],\"application/tei+xml\":[\"tei\",\"teicorpus\"],\"application/thraud+xml\":[\"tfi\"],\"application/timestamped-data\":[\"tsd\"],\"application/toml\":[\"toml\"],\"application/trig\":[\"trig\"],\"application/ttml+xml\":[\"ttml\"],\"application/ubjson\":[\"ubj\"],\"application/urc-ressheet+xml\":[\"rsheet\"],\"application/urc-targetdesc+xml\":[\"td\"],\"application/voicexml+xml\":[\"vxml\"],\"application/wasm\":[\"wasm\"],\"application/widget\":[\"wgt\"],\"application/winhlp\":[\"hlp\"],\"application/wsdl+xml\":[\"wsdl\"],\"application/wspolicy+xml\":[\"wspolicy\"],\"application/xaml+xml\":[\"xaml\"],\"application/xcap-att+xml\":[\"xav\"],\"application/xcap-caps+xml\":[\"xca\"],\"application/xcap-diff+xml\":[\"xdf\"],\"application/xcap-el+xml\":[\"xel\"],\"application/xcap-ns+xml\":[\"xns\"],\"application/xenc+xml\":[\"xenc\"],\"application/xhtml+xml\":[\"xhtml\",\"xht\"],\"application/xliff+xml\":[\"xlf\"],\"application/xml\":[\"xml\",\"xsl\",\"xsd\",\"rng\"],\"application/xml-dtd\":[\"dtd\"],\"application/xop+xml\":[\"xop\"],\"application/xproc+xml\":[\"xpl\"],\"application/xslt+xml\":[\"*xsl\",\"xslt\"],\"application/xspf+xml\":[\"xspf\"],\"application/xv+xml\":[\"mxml\",\"xhvml\",\"xvml\",\"xvm\"],\"application/yang\":[\"yang\"],\"application/yin+xml\":[\"yin\"],\"application/zip\":[\"zip\"],\"audio/3gpp\":[\"*3gpp\"],\"audio/adpcm\":[\"adp\"],\"audio/amr\":[\"amr\"],\"audio/basic\":[\"au\",\"snd\"],\"audio/midi\":[\"mid\",\"midi\",\"kar\",\"rmi\"],\"audio/mobile-xmf\":[\"mxmf\"],\"audio/mp3\":[\"*mp3\"],\"audio/mp4\":[\"m4a\",\"mp4a\"],\"audio/mpeg\":[\"mpga\",\"mp2\",\"mp2a\",\"mp3\",\"m2a\",\"m3a\"],\"audio/ogg\":[\"oga\",\"ogg\",\"spx\",\"opus\"],\"audio/s3m\":[\"s3m\"],\"audio/silk\":[\"sil\"],\"audio/wav\":[\"wav\"],\"audio/wave\":[\"*wav\"],\"audio/webm\":[\"weba\"],\"audio/xm\":[\"xm\"],\"font/collection\":[\"ttc\"],\"font/otf\":[\"otf\"],\"font/ttf\":[\"ttf\"],\"font/woff\":[\"woff\"],\"font/woff2\":[\"woff2\"],\"image/aces\":[\"exr\"],\"image/apng\":[\"apng\"],\"image/avif\":[\"avif\"],\"image/bmp\":[\"bmp\"],\"image/cgm\":[\"cgm\"],\"image/dicom-rle\":[\"drle\"],\"image/emf\":[\"emf\"],\"image/fits\":[\"fits\"],\"image/g3fax\":[\"g3\"],\"image/gif\":[\"gif\"],\"image/heic\":[\"heic\"],\"image/heic-sequence\":[\"heics\"],\"image/heif\":[\"heif\"],\"image/heif-sequence\":[\"heifs\"],\"image/hej2k\":[\"hej2\"],\"image/hsj2\":[\"hsj2\"],\"image/ief\":[\"ief\"],\"image/jls\":[\"jls\"],\"image/jp2\":[\"jp2\",\"jpg2\"],\"image/jpeg\":[\"jpeg\",\"jpg\",\"jpe\"],\"image/jph\":[\"jph\"],\"image/jphc\":[\"jhc\"],\"image/jpm\":[\"jpm\"],\"image/jpx\":[\"jpx\",\"jpf\"],\"image/jxr\":[\"jxr\"],\"image/jxra\":[\"jxra\"],\"image/jxrs\":[\"jxrs\"],\"image/jxs\":[\"jxs\"],\"image/jxsc\":[\"jxsc\"],\"image/jxsi\":[\"jxsi\"],\"image/jxss\":[\"jxss\"],\"image/ktx\":[\"ktx\"],\"image/ktx2\":[\"ktx2\"],\"image/png\":[\"png\"],\"image/sgi\":[\"sgi\"],\"image/svg+xml\":[\"svg\",\"svgz\"],\"image/t38\":[\"t38\"],\"image/tiff\":[\"tif\",\"tiff\"],\"image/tiff-fx\":[\"tfx\"],\"image/webp\":[\"webp\"],\"image/wmf\":[\"wmf\"],\"message/disposition-notification\":[\"disposition-notification\"],\"message/global\":[\"u8msg\"],\"message/global-delivery-status\":[\"u8dsn\"],\"message/global-disposition-notification\":[\"u8mdn\"],\"message/global-headers\":[\"u8hdr\"],\"message/rfc822\":[\"eml\",\"mime\"],\"model/3mf\":[\"3mf\"],\"model/gltf+json\":[\"gltf\"],\"model/gltf-binary\":[\"glb\"],\"model/iges\":[\"igs\",\"iges\"],\"model/mesh\":[\"msh\",\"mesh\",\"silo\"],\"model/mtl\":[\"mtl\"],\"model/obj\":[\"obj\"],\"model/step+xml\":[\"stpx\"],\"model/step+zip\":[\"stpz\"],\"model/step-xml+zip\":[\"stpxz\"],\"model/stl\":[\"stl\"],\"model/vrml\":[\"wrl\",\"vrml\"],\"model/x3d+binary\":[\"*x3db\",\"x3dbz\"],\"model/x3d+fastinfoset\":[\"x3db\"],\"model/x3d+vrml\":[\"*x3dv\",\"x3dvz\"],\"model/x3d+xml\":[\"x3d\",\"x3dz\"],\"model/x3d-vrml\":[\"x3dv\"],\"text/cache-manifest\":[\"appcache\",\"manifest\"],\"text/calendar\":[\"ics\",\"ifb\"],\"text/coffeescript\":[\"coffee\",\"litcoffee\"],\"text/css\":[\"css\"],\"text/csv\":[\"csv\"],\"text/html\":[\"html\",\"htm\",\"shtml\"],\"text/jade\":[\"jade\"],\"text/jsx\":[\"jsx\"],\"text/less\":[\"less\"],\"text/markdown\":[\"markdown\",\"md\"],\"text/mathml\":[\"mml\"],\"text/mdx\":[\"mdx\"],\"text/n3\":[\"n3\"],\"text/plain\":[\"txt\",\"text\",\"conf\",\"def\",\"list\",\"log\",\"in\",\"ini\"],\"text/richtext\":[\"rtx\"],\"text/rtf\":[\"*rtf\"],\"text/sgml\":[\"sgml\",\"sgm\"],\"text/shex\":[\"shex\"],\"text/slim\":[\"slim\",\"slm\"],\"text/spdx\":[\"spdx\"],\"text/stylus\":[\"stylus\",\"styl\"],\"text/tab-separated-values\":[\"tsv\"],\"text/troff\":[\"t\",\"tr\",\"roff\",\"man\",\"me\",\"ms\"],\"text/turtle\":[\"ttl\"],\"text/uri-list\":[\"uri\",\"uris\",\"urls\"],\"text/vcard\":[\"vcard\"],\"text/vtt\":[\"vtt\"],\"text/xml\":[\"*xml\"],\"text/yaml\":[\"yaml\",\"yml\"],\"video/3gpp\":[\"3gp\",\"3gpp\"],\"video/3gpp2\":[\"3g2\"],\"video/h261\":[\"h261\"],\"video/h263\":[\"h263\"],\"video/h264\":[\"h264\"],\"video/iso.segment\":[\"m4s\"],\"video/jpeg\":[\"jpgv\"],\"video/jpm\":[\"*jpm\",\"jpgm\"],\"video/mj2\":[\"mj2\",\"mjp2\"],\"video/mp2t\":[\"ts\"],\"video/mp4\":[\"mp4\",\"mp4v\",\"mpg4\"],\"video/mpeg\":[\"mpeg\",\"mpg\",\"mpe\",\"m1v\",\"m2v\"],\"video/ogg\":[\"ogv\"],\"video/quicktime\":[\"qt\",\"mov\"],\"video/webm\":[\"webm\"]};\n\n//# sourceURL=webpack://obsidian-image-window/./node_modules/mime/types/standard.js?");

/***/ }),

/***/ "./src/main.css":
/*!**********************!*\
  !*** ./src/main.css ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://obsidian-image-window/./src/main.css?");

/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ ImageWindow)\n/* harmony export */ });\n/* harmony import */ var _main_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./main.css */ \"./src/main.css\");\n/* harmony import */ var obsidian__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! obsidian */ \"obsidian\");\n/* harmony import */ var obsidian__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(obsidian__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var mime_lite__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mime/lite */ \"./node_modules/mime/lite.js\");\n/* harmony import */ var mime_lite__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(mime_lite__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! electron */ \"electron\");\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_3__);\n\r\n\r\n\r\n\r\nconst DEFAULT_SETTINGS = {};\r\nclass ImageWindow extends obsidian__WEBPACK_IMPORTED_MODULE_1__.Plugin {\r\n    settings;\r\n    window;\r\n    async onload() {\r\n        await this.loadSettings();\r\n        this.registerEvent(this.app.workspace.on(\"file-menu\", (menu, file) => {\r\n            if (!(file instanceof obsidian__WEBPACK_IMPORTED_MODULE_1__.TFile))\r\n                return;\r\n            if (!/image/.test((0,mime_lite__WEBPACK_IMPORTED_MODULE_2__.getType)(file.extension)))\r\n                return;\r\n            if (!(this.app.vault.adapter instanceof obsidian__WEBPACK_IMPORTED_MODULE_1__.FileSystemAdapter))\r\n                return;\r\n            menu.addItem((item) => {\r\n                item.setTitle(\"Open in new window\")\r\n                    .setIcon(\"open-elsewhere-glyph\")\r\n                    .onClick(async () => {\r\n                    this.loadFile(file);\r\n                });\r\n            });\r\n        }));\r\n        this.addCommand({\r\n            id: \"open-image\",\r\n            name: \"Open image in new window\",\r\n            callback: () => {\r\n                const files = this.app.vault\r\n                    .getFiles()\r\n                    .filter((file) => /image/.test((0,mime_lite__WEBPACK_IMPORTED_MODULE_2__.getType)(file.extension)));\r\n                const modal = new Suggester(files, this.app);\r\n                modal.onClose = () => {\r\n                    if (modal.file) {\r\n                        this.loadFile(modal.file);\r\n                    }\r\n                };\r\n                modal.open();\r\n            }\r\n        });\r\n        console.log(\"Image Window loaded.\");\r\n    }\r\n    async loadFile(file) {\r\n        if (!(this.app.vault.adapter instanceof obsidian__WEBPACK_IMPORTED_MODULE_1__.FileSystemAdapter))\r\n            return;\r\n        const html = `<div style=\"height: 100%; width: 100%;\"><img src=\"${this.app.vault.adapter.getFullPath(file.path)}\" style=\"height: 100%; width: 100%; object-fit: contain;\"></div>`;\r\n        const encoded = \"data:text/html;charset=utf-8,\" + encodeURI(html);\r\n        if (!this.window) {\r\n            this.window = new electron__WEBPACK_IMPORTED_MODULE_3__.remote.BrowserWindow({\r\n                webPreferences: {\r\n                    webSecurity: false\r\n                }\r\n            });\r\n            this.window.on(\"close\", () => (this.window = null));\r\n        }\r\n        await this.window.loadURL(encoded);\r\n        this.window.moveTop();\r\n    }\r\n    openImageModal() { }\r\n    onunload() {\r\n        if (this.window) {\r\n            this.window.close();\r\n        }\r\n        console.log(\"Image Window unloaded.\");\r\n    }\r\n    async loadSettings() {\r\n        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());\r\n    }\r\n    async saveSettings() {\r\n        await this.saveData(this.settings);\r\n    }\r\n}\r\nclass Suggester extends obsidian__WEBPACK_IMPORTED_MODULE_1__.FuzzySuggestModal {\r\n    files;\r\n    file;\r\n    constructor(files, app) {\r\n        super(app);\r\n        this.files = files;\r\n    }\r\n    getItemText(item) {\r\n        return item.basename;\r\n    }\r\n    getItems() {\r\n        return this.files;\r\n    }\r\n    onChooseItem(item, evt) {\r\n        this.file = item;\r\n        this.close();\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack://obsidian-image-window/./src/main.ts?");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("electron");

/***/ }),

/***/ "obsidian":
/*!***************************!*\
  !*** external "obsidian" ***!
  \***************************/
/***/ ((module) => {

"use strict";
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