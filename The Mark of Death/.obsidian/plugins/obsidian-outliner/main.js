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

const DEFAULT_SETTINGS = {
    styleLists: false,
    debug: false,
    stickCursor: true,
    betterEnter: true,
    zoomOnClick: true,
};
class Settings {
    constructor(storage) {
        this.storage = storage;
        this.handlers = new Map();
    }
    get styleLists() {
        return this.values.styleLists;
    }
    set styleLists(value) {
        this.set("styleLists", value);
    }
    get debug() {
        return this.values.debug;
    }
    set debug(value) {
        this.set("debug", value);
    }
    get stickCursor() {
        return this.values.stickCursor;
    }
    set stickCursor(value) {
        this.set("stickCursor", value);
    }
    get betterEnter() {
        return this.values.betterEnter;
    }
    set betterEnter(value) {
        this.set("betterEnter", value);
    }
    get zoomOnClick() {
        return this.values.zoomOnClick;
    }
    set zoomOnClick(value) {
        this.set("zoomOnClick", value);
    }
    onChange(key, cb) {
        if (!this.handlers.has(key)) {
            this.handlers.set(key, new Set());
        }
        this.handlers.get(key).add(cb);
    }
    removeCallback(key, cb) {
        const handlers = this.handlers.get(key);
        if (handlers) {
            handlers.delete(cb);
        }
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.values = Object.assign({}, DEFAULT_SETTINGS, yield this.storage.loadData());
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.storage.saveData(this.values);
        });
    }
    set(key, value) {
        this.values[key] = value;
        const callbacks = this.handlers.get(key);
        if (!callbacks) {
            return;
        }
        for (const cb of callbacks.values()) {
            cb(value);
        }
    }
}
class ObsidianOutlinerPluginSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin, settings) {
        super(app, plugin);
        this.settings = settings;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        new obsidian.Setting(containerEl)
            .setName("Improve the style of your lists")
            .setDesc("Styles are only compatible with built-in Obsidian themes and may not be compatible with other themes. Styles only work well with spaces or four-space tabs.")
            .addToggle((toggle) => {
            toggle.setValue(this.settings.styleLists).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.settings.styleLists = value;
                yield this.settings.save();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName("Stick the cursor to the content")
            .setDesc("Don't let the cursor move to the bullet position.")
            .addToggle((toggle) => {
            toggle.setValue(this.settings.stickCursor).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.settings.stickCursor = value;
                yield this.settings.save();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName("Enhance the Enter key")
            .setDesc("Make the Enter key behave the same as other outliners.")
            .addToggle((toggle) => {
            toggle.setValue(this.settings.betterEnter).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.settings.betterEnter = value;
                yield this.settings.save();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName("Zooming in when clicking on the bullet")
            .addToggle((toggle) => {
            toggle.setValue(this.settings.zoomOnClick).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.settings.zoomOnClick = value;
                yield this.settings.save();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName("Debug mode")
            .setDesc("Open DevTools (Command+Option+I or Control+Shift+I) to copy the debug logs.")
            .addToggle((toggle) => {
            toggle.setValue(this.settings.debug).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.settings.debug = value;
                yield this.settings.save();
            }));
        });
    }
}

class ObsidianUtils {
    constructor(app) {
        this.app = app;
    }
    getObsidianTabsSettigns() {
        return Object.assign({ useTab: true, tabSize: 4 }, this.app.vault.config);
    }
    getObsidianFoldSettigns() {
        return Object.assign({ foldIndent: false }, this.app.vault.config);
    }
    getActiveLeafDisplayText() {
        return this.app.workspace.activeLeaf.getDisplayText();
    }
    createCommandCallback(cb) {
        return () => {
            const view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
            if (!view) {
                return;
            }
            const editor = view.sourceMode.cmEditor;
            const worked = cb(editor);
            if (!worked && window.event && window.event.type === "keydown") {
                editor.triggerOnKeyDown(window.event);
            }
        };
    }
}

class EditorUtils {
    containsSingleCursor(editor) {
        const selections = editor.listSelections();
        return selections.length === 1 && this.rangeIsCursor(selections[0]);
    }
    rangeIsCursor(selection) {
        return (selection.anchor.line === selection.head.line &&
            selection.anchor.ch === selection.head.ch);
    }
}

function Diff() {}
Diff.prototype = {
  diff: function diff(oldString, newString) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var callback = options.callback;

    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    this.options = options;
    var self = this;

    function done(value) {
      if (callback) {
        setTimeout(function () {
          callback(undefined, value);
        }, 0);
        return true;
      } else {
        return value;
      }
    } // Allow subclasses to massage the input prior to running


    oldString = this.castInput(oldString);
    newString = this.castInput(newString);
    oldString = this.removeEmpty(this.tokenize(oldString));
    newString = this.removeEmpty(this.tokenize(newString));
    var newLen = newString.length,
        oldLen = oldString.length;
    var editLength = 1;
    var maxEditLength = newLen + oldLen;
    var bestPath = [{
      newPos: -1,
      components: []
    }]; // Seed editLength = 0, i.e. the content starts with the same values

    var oldPos = this.extractCommon(bestPath[0], newString, oldString, 0);

    if (bestPath[0].newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
      // Identity per the equality and tokenizer
      return done([{
        value: this.join(newString),
        count: newString.length
      }]);
    } // Main worker method. checks all permutations of a given edit length for acceptance.


    function execEditLength() {
      for (var diagonalPath = -1 * editLength; diagonalPath <= editLength; diagonalPath += 2) {
        var basePath = void 0;

        var addPath = bestPath[diagonalPath - 1],
            removePath = bestPath[diagonalPath + 1],
            _oldPos = (removePath ? removePath.newPos : 0) - diagonalPath;

        if (addPath) {
          // No one else is going to attempt to use this value, clear it
          bestPath[diagonalPath - 1] = undefined;
        }

        var canAdd = addPath && addPath.newPos + 1 < newLen,
            canRemove = removePath && 0 <= _oldPos && _oldPos < oldLen;

        if (!canAdd && !canRemove) {
          // If this path is a terminal then prune
          bestPath[diagonalPath] = undefined;
          continue;
        } // Select the diagonal that we want to branch from. We select the prior
        // path whose position in the new string is the farthest from the origin
        // and does not pass the bounds of the diff graph


        if (!canAdd || canRemove && addPath.newPos < removePath.newPos) {
          basePath = clonePath(removePath);
          self.pushComponent(basePath.components, undefined, true);
        } else {
          basePath = addPath; // No need to clone, we've pulled it from the list

          basePath.newPos++;
          self.pushComponent(basePath.components, true, undefined);
        }

        _oldPos = self.extractCommon(basePath, newString, oldString, diagonalPath); // If we have hit the end of both strings, then we are done

        if (basePath.newPos + 1 >= newLen && _oldPos + 1 >= oldLen) {
          return done(buildValues(self, basePath.components, newString, oldString, self.useLongestToken));
        } else {
          // Otherwise track this path as a potential candidate and continue.
          bestPath[diagonalPath] = basePath;
        }
      }

      editLength++;
    } // Performs the length of edit iteration. Is a bit fugly as this has to support the
    // sync and async mode which is never fun. Loops over execEditLength until a value
    // is produced.


    if (callback) {
      (function exec() {
        setTimeout(function () {
          // This should not happen, but we want to be safe.

          /* istanbul ignore next */
          if (editLength > maxEditLength) {
            return callback();
          }

          if (!execEditLength()) {
            exec();
          }
        }, 0);
      })();
    } else {
      while (editLength <= maxEditLength) {
        var ret = execEditLength();

        if (ret) {
          return ret;
        }
      }
    }
  },
  pushComponent: function pushComponent(components, added, removed) {
    var last = components[components.length - 1];

    if (last && last.added === added && last.removed === removed) {
      // We need to clone here as the component clone operation is just
      // as shallow array clone
      components[components.length - 1] = {
        count: last.count + 1,
        added: added,
        removed: removed
      };
    } else {
      components.push({
        count: 1,
        added: added,
        removed: removed
      });
    }
  },
  extractCommon: function extractCommon(basePath, newString, oldString, diagonalPath) {
    var newLen = newString.length,
        oldLen = oldString.length,
        newPos = basePath.newPos,
        oldPos = newPos - diagonalPath,
        commonCount = 0;

    while (newPos + 1 < newLen && oldPos + 1 < oldLen && this.equals(newString[newPos + 1], oldString[oldPos + 1])) {
      newPos++;
      oldPos++;
      commonCount++;
    }

    if (commonCount) {
      basePath.components.push({
        count: commonCount
      });
    }

    basePath.newPos = newPos;
    return oldPos;
  },
  equals: function equals(left, right) {
    if (this.options.comparator) {
      return this.options.comparator(left, right);
    } else {
      return left === right || this.options.ignoreCase && left.toLowerCase() === right.toLowerCase();
    }
  },
  removeEmpty: function removeEmpty(array) {
    var ret = [];

    for (var i = 0; i < array.length; i++) {
      if (array[i]) {
        ret.push(array[i]);
      }
    }

    return ret;
  },
  castInput: function castInput(value) {
    return value;
  },
  tokenize: function tokenize(value) {
    return value.split('');
  },
  join: function join(chars) {
    return chars.join('');
  }
};

function buildValues(diff, components, newString, oldString, useLongestToken) {
  var componentPos = 0,
      componentLen = components.length,
      newPos = 0,
      oldPos = 0;

  for (; componentPos < componentLen; componentPos++) {
    var component = components[componentPos];

    if (!component.removed) {
      if (!component.added && useLongestToken) {
        var value = newString.slice(newPos, newPos + component.count);
        value = value.map(function (value, i) {
          var oldValue = oldString[oldPos + i];
          return oldValue.length > value.length ? oldValue : value;
        });
        component.value = diff.join(value);
      } else {
        component.value = diff.join(newString.slice(newPos, newPos + component.count));
      }

      newPos += component.count; // Common case

      if (!component.added) {
        oldPos += component.count;
      }
    } else {
      component.value = diff.join(oldString.slice(oldPos, oldPos + component.count));
      oldPos += component.count; // Reverse add and remove so removes are output first to match common convention
      // The diffing algorithm is tied to add then remove output and this is the simplest
      // route to get the desired output with minimal overhead.

      if (componentPos && components[componentPos - 1].added) {
        var tmp = components[componentPos - 1];
        components[componentPos - 1] = components[componentPos];
        components[componentPos] = tmp;
      }
    }
  } // Special case handle for when one terminal is ignored (i.e. whitespace).
  // For this case we merge the terminal into the prior string and drop the change.
  // This is only available for string mode.


  var lastComponent = components[componentLen - 1];

  if (componentLen > 1 && typeof lastComponent.value === 'string' && (lastComponent.added || lastComponent.removed) && diff.equals('', lastComponent.value)) {
    components[componentLen - 2].value += lastComponent.value;
    components.pop();
  }

  return components;
}

function clonePath(path) {
  return {
    newPos: path.newPos,
    components: path.components.slice(0)
  };
}

//
// Ranges and exceptions:
// Latin-1 Supplement, 0080–00FF
//  - U+00D7  × Multiplication sign
//  - U+00F7  ÷ Division sign
// Latin Extended-A, 0100–017F
// Latin Extended-B, 0180–024F
// IPA Extensions, 0250–02AF
// Spacing Modifier Letters, 02B0–02FF
//  - U+02C7  ˇ &#711;  Caron
//  - U+02D8  ˘ &#728;  Breve
//  - U+02D9  ˙ &#729;  Dot Above
//  - U+02DA  ˚ &#730;  Ring Above
//  - U+02DB  ˛ &#731;  Ogonek
//  - U+02DC  ˜ &#732;  Small Tilde
//  - U+02DD  ˝ &#733;  Double Acute Accent
// Latin Extended Additional, 1E00–1EFF

var extendedWordChars = /^[A-Za-z\xC0-\u02C6\u02C8-\u02D7\u02DE-\u02FF\u1E00-\u1EFF]+$/;
var reWhitespace = /\S/;
var wordDiff = new Diff();

wordDiff.equals = function (left, right) {
  if (this.options.ignoreCase) {
    left = left.toLowerCase();
    right = right.toLowerCase();
  }

  return left === right || this.options.ignoreWhitespace && !reWhitespace.test(left) && !reWhitespace.test(right);
};

wordDiff.tokenize = function (value) {
  // All whitespace symbols except newline group into one token, each newline - in separate token
  var tokens = value.split(/([^\S\r\n]+|[()[\]{}'"\r\n]|\b)/); // Join the boundary splits that we do not consider to be boundaries. This is primarily the extended Latin character set.

  for (var i = 0; i < tokens.length - 1; i++) {
    // If we have an empty string in the next field and we have only word chars before and after, merge
    if (!tokens[i + 1] && tokens[i + 2] && extendedWordChars.test(tokens[i]) && extendedWordChars.test(tokens[i + 2])) {
      tokens[i] += tokens[i + 2];
      tokens.splice(i + 1, 2);
      i--;
    }
  }

  return tokens;
};

var lineDiff = new Diff();

lineDiff.tokenize = function (value) {
  var retLines = [],
      linesAndNewlines = value.split(/(\n|\r\n)/); // Ignore the final empty token that occurs if the string ends with a new line

  if (!linesAndNewlines[linesAndNewlines.length - 1]) {
    linesAndNewlines.pop();
  } // Merge the content and line separators into single tokens


  for (var i = 0; i < linesAndNewlines.length; i++) {
    var line = linesAndNewlines[i];

    if (i % 2 && !this.options.newlineIsToken) {
      retLines[retLines.length - 1] += line;
    } else {
      if (this.options.ignoreWhitespace) {
        line = line.trim();
      }

      retLines.push(line);
    }
  }

  return retLines;
};

function diffLines(oldStr, newStr, callback) {
  return lineDiff.diff(oldStr, newStr, callback);
}

var sentenceDiff = new Diff();

sentenceDiff.tokenize = function (value) {
  return value.split(/(\S.+?[.!?])(?=\s+|$)/);
};

var cssDiff = new Diff();

cssDiff.tokenize = function (value) {
  return value.split(/([{}:;,]|\s+)/);
};

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

var objectPrototypeToString = Object.prototype.toString;
var jsonDiff = new Diff(); // Discriminate between two lines of pretty-printed, serialized JSON where one of them has a
// dangling comma and the other doesn't. Turns out including the dangling comma yields the nicest output:

jsonDiff.useLongestToken = true;
jsonDiff.tokenize = lineDiff.tokenize;

jsonDiff.castInput = function (value) {
  var _this$options = this.options,
      undefinedReplacement = _this$options.undefinedReplacement,
      _this$options$stringi = _this$options.stringifyReplacer,
      stringifyReplacer = _this$options$stringi === void 0 ? function (k, v) {
    return typeof v === 'undefined' ? undefinedReplacement : v;
  } : _this$options$stringi;
  return typeof value === 'string' ? value : JSON.stringify(canonicalize(value, null, null, stringifyReplacer), stringifyReplacer, '  ');
};

jsonDiff.equals = function (left, right) {
  return Diff.prototype.equals.call(jsonDiff, left.replace(/,([\r\n])/g, '$1'), right.replace(/,([\r\n])/g, '$1'));
};
// object that is already on the "stack" of items being processed. Accepts an optional replacer

function canonicalize(obj, stack, replacementStack, replacer, key) {
  stack = stack || [];
  replacementStack = replacementStack || [];

  if (replacer) {
    obj = replacer(key, obj);
  }

  var i;

  for (i = 0; i < stack.length; i += 1) {
    if (stack[i] === obj) {
      return replacementStack[i];
    }
  }

  var canonicalizedObj;

  if ('[object Array]' === objectPrototypeToString.call(obj)) {
    stack.push(obj);
    canonicalizedObj = new Array(obj.length);
    replacementStack.push(canonicalizedObj);

    for (i = 0; i < obj.length; i += 1) {
      canonicalizedObj[i] = canonicalize(obj[i], stack, replacementStack, replacer, key);
    }

    stack.pop();
    replacementStack.pop();
    return canonicalizedObj;
  }

  if (obj && obj.toJSON) {
    obj = obj.toJSON();
  }

  if (_typeof(obj) === 'object' && obj !== null) {
    stack.push(obj);
    canonicalizedObj = {};
    replacementStack.push(canonicalizedObj);

    var sortedKeys = [],
        _key;

    for (_key in obj) {
      /* istanbul ignore else */
      if (obj.hasOwnProperty(_key)) {
        sortedKeys.push(_key);
      }
    }

    sortedKeys.sort();

    for (i = 0; i < sortedKeys.length; i += 1) {
      _key = sortedKeys[i];
      canonicalizedObj[_key] = canonicalize(obj[_key], stack, replacementStack, replacer, _key);
    }

    stack.pop();
    replacementStack.pop();
  } else {
    canonicalizedObj = obj;
  }

  return canonicalizedObj;
}

var arrayDiff = new Diff();

arrayDiff.tokenize = function (value) {
  return value.slice();
};

arrayDiff.join = arrayDiff.removeEmpty = function (value) {
  return value;
};

class List {
    constructor(indentSign, bullet, content, folded) {
        this.indentSign = indentSign;
        this.bullet = bullet;
        this.content = content;
        this.folded = folded;
        this.children = [];
        this.parent = null;
    }
    isFolded() {
        return this.folded;
    }
    isFoldRoot() {
        let parent = this.getParent();
        while (parent) {
            if (parent.isFolded()) {
                return false;
            }
            parent = parent.getParent();
        }
        return this.isFolded();
    }
    getChildren() {
        return this.children.concat();
    }
    appendContent(content) {
        this.content += content;
    }
    getContent() {
        return this.content;
    }
    isEmpty() {
        return this.children.length === 0;
    }
    getContentStartCh() {
        const indentLength = (this.getLevel() - 1) * this.indentSign.length;
        return indentLength + 2;
    }
    getContentEndCh() {
        return this.getContentStartCh() + this.content.length;
    }
    getParent() {
        return this.parent;
    }
    getPrevSiblingOf(list) {
        const i = this.children.indexOf(list);
        return i > 0 ? this.children[i - 1] : null;
    }
    getNextSiblingOf(list) {
        const i = this.children.indexOf(list);
        return i >= 0 && i < this.children.length ? this.children[i + 1] : null;
    }
    getLevel() {
        let level = 0;
        let ref = this;
        while (ref.parent) {
            ref = ref.parent;
            level++;
        }
        return level;
    }
    addAfterAll(list) {
        this.children.push(list);
        list.parent = this;
    }
    addBeforeAll(list) {
        this.children.unshift(list);
        list.parent = this;
    }
    addBefore(before, list) {
        const i = this.children.indexOf(before);
        this.children.splice(i, 0, list);
        list.parent = this;
    }
    addAfter(before, list) {
        const i = this.children.indexOf(before);
        this.children.splice(i + 1, 0, list);
        list.parent = this;
    }
    removeChild(list) {
        const i = this.children.indexOf(list);
        this.children.splice(i, 1);
        list.parent = null;
    }
    print() {
        let res = this.getFullContent() + "\n";
        for (const child of this.children) {
            res += child.print();
        }
        return res;
    }
    getFullContent() {
        return (new Array(this.getLevel() - 1).fill(this.indentSign).join("") +
            this.bullet +
            " " +
            this.content);
    }
}
class Root {
    constructor(indentSign, start, end, cursor) {
        this.indentSign = indentSign;
        this.start = start;
        this.end = end;
        this.cursor = cursor;
        this.rootList = new List("", "", "", false);
    }
    replaceCursor(cursor) {
        this.cursor = cursor;
    }
    getTotalLines() {
        return this.end.line - this.start.line + 1;
    }
    getChildren() {
        return this.rootList.getChildren();
    }
    getIndentSign() {
        return this.indentSign;
    }
    getLevel() {
        return 0;
    }
    getParent() {
        return null;
    }
    addAfterAll(list) {
        this.rootList.addAfterAll(list);
    }
    getListStartPosition() {
        return this.start;
    }
    getListEndPosition() {
        return this.end;
    }
    getCursor() {
        return this.cursor;
    }
    getListUnderCursor() {
        return this.getListUnderLine(this.cursor.line);
    }
    print() {
        let res = "";
        for (const child of this.rootList.getChildren()) {
            res += child.print();
        }
        return res.replace(/\n$/, "");
    }
    getLineNumberOf(list) {
        let result = null;
        let line = 0;
        const visitArr = (ll) => {
            for (const l of ll) {
                if (l === list) {
                    result = line;
                }
                else {
                    line++;
                    visitArr(l.getChildren());
                }
                if (result !== null) {
                    return;
                }
            }
        };
        visitArr(this.rootList.getChildren());
        return result + this.start.line;
    }
    getListUnderLine(line) {
        if (line < this.start.line) {
            return;
        }
        let result = null;
        let index = 0;
        const visitArr = (ll) => {
            for (const l of ll) {
                if (index + this.start.line === line) {
                    result = l;
                }
                else {
                    index++;
                    visitArr(l.getChildren());
                }
                if (result !== null) {
                    return;
                }
            }
        };
        visitArr(this.rootList.getChildren());
        return result;
    }
    moveUp() {
        const list = this.getListUnderCursor();
        const parent = list.getParent();
        const grandParent = parent.getParent();
        const prev = parent.getPrevSiblingOf(list);
        if (!prev && grandParent) {
            const newParent = grandParent.getPrevSiblingOf(parent);
            if (newParent) {
                parent.removeChild(list);
                newParent.addAfterAll(list);
                this.cursor.line = this.getLineNumberOf(list);
            }
        }
        else if (prev) {
            parent.removeChild(list);
            parent.addBefore(prev, list);
            this.cursor.line = this.getLineNumberOf(list);
        }
        return true;
    }
    moveDown() {
        const list = this.getListUnderCursor();
        const parent = list.getParent();
        const grandParent = parent.getParent();
        const next = parent.getNextSiblingOf(list);
        if (!next && grandParent) {
            const newParent = grandParent.getNextSiblingOf(parent);
            if (newParent) {
                parent.removeChild(list);
                newParent.addBeforeAll(list);
                this.cursor.line = this.getLineNumberOf(list);
            }
        }
        else if (next) {
            parent.removeChild(list);
            parent.addAfter(next, list);
            this.cursor.line = this.getLineNumberOf(list);
        }
        return true;
    }
    moveLeft() {
        const list = this.getListUnderCursor();
        const parent = list.getParent();
        const grandParent = parent.getParent();
        if (!grandParent) {
            return true;
        }
        parent.removeChild(list);
        grandParent.addAfter(parent, list);
        this.cursor.line = this.getLineNumberOf(list);
        this.cursor.ch -= this.getIndentSign().length;
        return true;
    }
    moveRight() {
        const list = this.getListUnderCursor();
        const parent = list.getParent();
        const prev = parent.getPrevSiblingOf(list);
        if (!prev) {
            return true;
        }
        parent.removeChild(list);
        prev.addAfterAll(list);
        this.cursor.line = this.getLineNumberOf(list);
        this.cursor.ch += this.getIndentSign().length;
        return true;
    }
    deleteAndMergeWithPrevious() {
        const list = this.getListUnderCursor();
        if (this.cursor.ch !== list.getContentStartCh()) {
            return false;
        }
        const prev = this.getListUnderLine(this.cursor.line - 1);
        if (!prev) {
            return true;
        }
        const bothAreEmpty = prev.isEmpty() && list.isEmpty();
        const prevIsEmptyAndSameLevel = prev.isEmpty() && !list.isEmpty() && prev.getLevel() == list.getLevel();
        const listIsEmptyAndPrevIsParent = list.isEmpty() && prev.getLevel() == list.getLevel() - 1;
        if (bothAreEmpty || prevIsEmptyAndSameLevel || listIsEmptyAndPrevIsParent) {
            const parent = list.getParent();
            const prevEndCh = prev.getContentEndCh();
            prev.appendContent(list.getContent());
            parent.removeChild(list);
            for (const c of list.getChildren()) {
                list.removeChild(c);
                prev.addAfterAll(c);
            }
            this.cursor.line = this.getLineNumberOf(prev);
            this.cursor.ch = prevEndCh;
        }
        return true;
    }
}

const bulletSign = "-*+";
class ListUtils {
    constructor(logger, obsidianUtils) {
        this.logger = logger;
        this.obsidianUtils = obsidianUtils;
    }
    getListLineInfo(line, indentSign) {
        const prefixRe = new RegExp(`^(?:${indentSign})*([${bulletSign}]) `);
        const matches = prefixRe.exec(line);
        if (!matches) {
            return null;
        }
        const prefixLength = matches[0].length;
        const bullet = matches[1];
        const content = line.slice(prefixLength);
        const indentLevel = (prefixLength - 2) / indentSign.length;
        return {
            bullet,
            content,
            prefixLength,
            indentLevel,
        };
    }
    parseList(editor, cursor = editor.getCursor()) {
        const cursorLine = cursor.line;
        const cursorCh = cursor.ch;
        const line = editor.getLine(cursorLine);
        const indentSign = this.detectListIndentSign(editor, cursor);
        if (indentSign === null) {
            return null;
        }
        let listStartLine = cursorLine;
        const listStartCh = 0;
        while (listStartLine >= 1) {
            const line = editor.getLine(listStartLine - 1);
            if (!this.getListLineInfo(line, indentSign)) {
                break;
            }
            listStartLine--;
        }
        let listEndLine = cursorLine;
        let listEndCh = line.length;
        while (listEndLine < editor.lineCount()) {
            const line = editor.getLine(listEndLine + 1);
            if (!this.getListLineInfo(line, indentSign)) {
                break;
            }
            listEndCh = line.length;
            listEndLine++;
        }
        const root = new Root(indentSign, { line: listStartLine, ch: listStartCh }, { line: listEndLine, ch: listEndCh }, { line: cursorLine, ch: cursorCh });
        let currentLevel = root;
        let lastList = root;
        for (let l = listStartLine; l <= listEndLine; l++) {
            const line = editor.getLine(l);
            const { bullet, content, indentLevel } = this.getListLineInfo(line, indentSign);
            const folded = editor.isFolded({
                line: l,
                ch: 0,
            });
            if (indentLevel === currentLevel.getLevel() + 1) {
                currentLevel = lastList;
            }
            else if (indentLevel < currentLevel.getLevel()) {
                while (indentLevel < currentLevel.getLevel()) {
                    currentLevel = currentLevel.getParent();
                }
            }
            else if (indentLevel != currentLevel.getLevel()) {
                console.error(`Unable to parse list`);
                return null;
            }
            const list = new List(indentSign, bullet, content, folded);
            currentLevel.addAfterAll(list);
            lastList = list;
        }
        return root;
    }
    applyChanges(editor, root) {
        const oldString = editor.getRange(root.getListStartPosition(), root.getListEndPosition());
        const newString = root.print();
        const fromLine = root.getListStartPosition().line;
        const toLine = root.getListEndPosition().line;
        for (let l = fromLine; l <= toLine; l++) {
            editor.foldCode(l, null, "unfold");
        }
        const diff = diffLines(oldString, newString);
        let l = root.getListStartPosition().line;
        for (const change of diff) {
            if (change.added) {
                editor.replaceRange(change.value, { line: l, ch: 0 });
                l += change.count;
            }
            else if (change.removed) {
                const withNewline = /\n$/.test(change.value);
                const tillLine = withNewline ? l + change.count : l + change.count - 1;
                const tillCh = withNewline ? 0 : editor.getLine(tillLine).length;
                editor.replaceRange("", { line: l, ch: 0 }, { line: tillLine, ch: tillCh });
            }
            else {
                l += change.count;
            }
        }
        const oldCursor = editor.getCursor();
        const newCursor = root.getCursor();
        if (oldCursor.line != newCursor.line || oldCursor.ch != newCursor.ch) {
            editor.setCursor(newCursor);
        }
        for (let l = fromLine; l <= toLine; l++) {
            const line = root.getListUnderLine(l);
            if (line && line.isFoldRoot()) {
                // TODO: why working only with -1?
                editor.foldCode(l - 1);
            }
        }
    }
    detectListIndentSign(editor, cursor) {
        const d = this.logger.bind("ObsidianOutlinerPlugin::detectListIndentSign");
        const { useTab, tabSize } = this.obsidianUtils.getObsidianTabsSettigns();
        const defaultIndentSign = useTab
            ? "\t"
            : new Array(tabSize).fill(" ").join("");
        const line = editor.getLine(cursor.line);
        const withTabsRe = new RegExp(`^\t+[${bulletSign}] `);
        const withSpacesRe = new RegExp(`^[ ]+[${bulletSign}] `);
        const mayBeWithSpacesRe = new RegExp(`^[ ]*[${bulletSign}] `);
        if (withTabsRe.test(line)) {
            d("detected tab on current line");
            return "\t";
        }
        if (withSpacesRe.test(line)) {
            d("detected whitespaces on current line, trying to count");
            const spacesA = line.length - line.trimLeft().length;
            let lineNo = cursor.line - 1;
            while (lineNo >= editor.firstLine()) {
                const line = editor.getLine(lineNo);
                if (!mayBeWithSpacesRe.test(line)) {
                    break;
                }
                const spacesB = line.length - line.trimLeft().length;
                if (spacesB < spacesA) {
                    const l = spacesA - spacesB;
                    d(`detected ${l} whitespaces`);
                    return new Array(l).fill(" ").join("");
                }
                lineNo--;
            }
            d("unable to detect");
            return null;
        }
        if (mayBeWithSpacesRe.test(line)) {
            d("detected nothing on current line, looking forward");
            const spacesA = line.length - line.trimLeft().length;
            let lineNo = cursor.line + 1;
            while (lineNo <= editor.lastLine()) {
                const line = editor.getLine(lineNo);
                if (withTabsRe.test(line)) {
                    d("detected tab");
                    return "\t";
                }
                if (!mayBeWithSpacesRe.test(line)) {
                    break;
                }
                const spacesB = line.length - line.trimLeft().length;
                if (spacesB > spacesA) {
                    const l = spacesB - spacesA;
                    d(`detected ${l} whitespaces`);
                    return new Array(l).fill(" ").join("");
                }
                lineNo++;
            }
            d(`detected nothing, using default useTab=${useTab} tabSize=${tabSize}`);
            return defaultIndentSign;
        }
        d("unable to detect");
        return null;
    }
    isCursorInList(editor) {
        return this.detectListIndentSign(editor, editor.getCursor()) !== null;
    }
}

class Logger {
    constructor(settings) {
        this.settings = settings;
    }
    log(method, ...args) {
        if (!this.settings.debug) {
            return;
        }
        console.info(method, ...args);
    }
    bind(method) {
        return (...args) => this.log(method, ...args);
    }
}

const text = (size) => `Outliner styles doesn't work with ${size}-spaces-tabs. Please check your Obsidian settings.`;
class ListsStylesFeature {
    constructor(plugin, settings, obsidianUtils) {
        this.plugin = plugin;
        this.settings = settings;
        this.obsidianUtils = obsidianUtils;
        this.onStyleListsSettingChange = (styleLists) => {
            if (styleLists) {
                this.addListsStyles();
            }
            else {
                this.removeListsStyles();
            }
        };
        this.onZoomOnClickSettingChange = (zoomOnClick) => {
            if (zoomOnClick) {
                this.addZoomStyles();
            }
            else {
                this.removeZoomStyles();
            }
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.settings.styleLists) {
                this.addListsStyles();
            }
            if (this.settings.zoomOnClick) {
                this.addZoomStyles();
            }
            this.settings.onChange("styleLists", this.onStyleListsSettingChange);
            this.settings.onChange("zoomOnClick", this.onZoomOnClickSettingChange);
            this.addStatusBarText();
            this.startStatusBarInterval();
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () {
            clearInterval(this.interval);
            if (this.statusBarText.parentElement) {
                this.statusBarText.parentElement.removeChild(this.statusBarText);
            }
            this.settings.removeCallback("zoomOnClick", this.onZoomOnClickSettingChange);
            this.settings.removeCallback("styleLists", this.onStyleListsSettingChange);
            this.removeListsStyles();
        });
    }
    startStatusBarInterval() {
        let visible = null;
        this.interval = window.setInterval(() => {
            const { useTab, tabSize } = this.obsidianUtils.getObsidianTabsSettigns();
            const shouldBeVisible = this.settings.styleLists && useTab && tabSize !== 4;
            if (shouldBeVisible && visible !== tabSize) {
                this.statusBarText.style.display = "block";
                this.statusBarText.setText(text(tabSize));
                visible = tabSize;
            }
            else if (!shouldBeVisible && visible !== null) {
                this.statusBarText.style.display = "none";
                visible = null;
            }
        }, 1000);
    }
    addStatusBarText() {
        this.statusBarText = this.plugin.addStatusBarItem();
        this.statusBarText.style.color = "red";
        this.statusBarText.style.display = "none";
    }
    addListsStyles() {
        document.body.classList.add("outliner-plugin-bls");
    }
    removeListsStyles() {
        document.body.classList.remove("outliner-plugin-bls");
    }
    addZoomStyles() {
        document.body.classList.add("outliner-plugin-bls-zoom");
    }
    removeZoomStyles() {
        document.body.classList.remove("outliner-plugin-bls-zoom");
    }
}

function isEnter(e) {
    return (e.code === "Enter" &&
        e.shiftKey === false &&
        e.metaKey === false &&
        e.altKey === false &&
        e.ctrlKey === false);
}
class EnterOutdentIfLineIsEmptyFeature {
    constructor(plugin, settings, editorUtils, listUtils) {
        this.plugin = plugin;
        this.settings = settings;
        this.editorUtils = editorUtils;
        this.listUtils = listUtils;
        this.onKeyDown = (cm, e) => {
            if (!this.settings.betterEnter || !isEnter(e)) {
                return;
            }
            const worked = this.outdentIfLineIsEmpty(cm);
            if (worked) {
                e.preventDefault();
                e.stopPropagation();
            }
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerCodeMirror((cm) => {
                cm.on("keydown", this.onKeyDown);
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.app.workspace.iterateCodeMirrors((cm) => {
                cm.off("keydown", this.onKeyDown);
            });
        });
    }
    outdentIfLineIsEmpty(editor) {
        if (!this.editorUtils.containsSingleCursor(editor)) {
            return false;
        }
        const root = this.listUtils.parseList(editor);
        if (!root) {
            return false;
        }
        const list = root.getListUnderCursor();
        if (list.getContent().length > 0 || list.getLevel() === 1) {
            return false;
        }
        root.moveLeft();
        this.listUtils.applyChanges(editor, root);
        return true;
    }
}

class EnterShouldCreateNewlineOnChildLevelFeature {
    constructor(plugin, settings, listUtils) {
        this.plugin = plugin;
        this.settings = settings;
        this.listUtils = listUtils;
        this.onBeforeChange = (cm, changeObj) => {
            if (!this.settings.betterEnter) {
                return;
            }
            const { listUtils } = this;
            const currentLine = cm.getLine(changeObj.from.line);
            const nextLine = cm.getLine(changeObj.from.line + 1);
            if (!currentLine || !nextLine) {
                return;
            }
            const indentSign = listUtils.detectListIndentSign(cm, changeObj.from);
            if (indentSign === null) {
                return;
            }
            const currentLineInfo = listUtils.getListLineInfo(currentLine, indentSign);
            const nextLineInfo = listUtils.getListLineInfo(nextLine, indentSign);
            if (!currentLineInfo || !nextLineInfo) {
                return;
            }
            const changeIsNewline = changeObj.text.length === 2 &&
                changeObj.text[0] === "" &&
                !!listUtils.getListLineInfo(changeObj.text[1], indentSign);
            const nexlineLevelIsBigger = currentLineInfo.indentLevel + 1 == nextLineInfo.indentLevel;
            const nextLineIsEmpty = cm.getRange(changeObj.from, {
                line: changeObj.from.line,
                ch: changeObj.from.ch + 1,
            }).length === 0;
            if (changeIsNewline && nexlineLevelIsBigger && nextLineIsEmpty) {
                changeObj.text[1] = indentSign + changeObj.text[1];
                changeObj.update(changeObj.from, changeObj.to, changeObj.text);
            }
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerCodeMirror((cm) => {
                cm.on("beforeChange", this.onBeforeChange);
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.app.workspace.iterateCodeMirrors((cm) => {
                cm.off("beforeChange", this.onBeforeChange);
            });
        });
    }
}

class MoveCursorToPreviousUnfoldedLineFeature {
    constructor(plugin, settings, listsUtils) {
        this.plugin = plugin;
        this.settings = settings;
        this.listsUtils = listsUtils;
        this.handleBeforeSelectionChange = (cm, changeObj) => {
            if (!this.settings.stickCursor ||
                changeObj.origin !== "+move" ||
                changeObj.ranges.length > 1) {
                return;
            }
            const range = changeObj.ranges[0];
            const cursor = cm.getCursor();
            if (range.anchor.line !== range.head.line ||
                range.anchor.ch !== range.head.ch) {
                return;
            }
            if (cursor.line <= 0 || cursor.line !== range.anchor.line) {
                return;
            }
            const root = this.listsUtils.parseList(cm);
            if (!root) {
                return;
            }
            const list = root.getListUnderCursor();
            const listContentStartCh = list.getContentStartCh();
            if (cursor.ch === listContentStartCh &&
                range.anchor.ch === listContentStartCh - 1) {
                const newCursor = this.iterateWhileFolded(cm, {
                    line: cursor.line,
                    ch: 0,
                }, (pos) => {
                    pos.line--;
                    pos.ch = cm.getLine(pos.line).length - 1;
                });
                newCursor.ch++;
                range.anchor.line = newCursor.line;
                range.anchor.ch = newCursor.ch;
                range.head.line = newCursor.line;
                range.head.ch = newCursor.ch;
                changeObj.update([range]);
            }
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerCodeMirror((cm) => {
                cm.on("beforeSelectionChange", this.handleBeforeSelectionChange);
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.app.workspace.iterateCodeMirrors((cm) => {
                cm.off("beforeSelectionChange", this.handleBeforeSelectionChange);
            });
        });
    }
    iterateWhileFolded(editor, pos, inc) {
        let folded = false;
        do {
            inc(pos);
            folded = editor.isFolded(pos);
        } while (folded);
        return pos;
    }
}

class EnsureCursorInListContentFeature {
    constructor(plugin, settings, editorUtils, listsUtils) {
        this.plugin = plugin;
        this.settings = settings;
        this.editorUtils = editorUtils;
        this.listsUtils = listsUtils;
        this.handleCursorActivity = (cm) => {
            if (this.settings.stickCursor &&
                this.editorUtils.containsSingleCursor(cm) &&
                this.listsUtils.isCursorInList(cm)) {
                this.ensureCursorIsInUnfoldedLine(cm);
                this.ensureCursorInListContent(cm);
            }
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerCodeMirror((cm) => {
                cm.on("cursorActivity", this.handleCursorActivity);
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.app.workspace.iterateCodeMirrors((cm) => {
                cm.off("cursorActivity", this.handleCursorActivity);
            });
        });
    }
    ensureCursorInListContent(editor) {
        const cursor = editor.getCursor();
        const indentSign = this.listsUtils.detectListIndentSign(editor, cursor);
        if (indentSign === null) {
            return;
        }
        const line = editor.getLine(cursor.line);
        const linePrefix = this.listsUtils.getListLineInfo(line, indentSign)
            .prefixLength;
        if (cursor.ch < linePrefix) {
            cursor.ch = linePrefix;
            editor.setCursor(cursor);
        }
    }
    ensureCursorIsInUnfoldedLine(editor) {
        const cursor = editor.getCursor();
        const mark = editor.findMarksAt(cursor).find((m) => m.__isFold);
        if (!mark) {
            return;
        }
        const firstFoldingLine = mark.lines[0];
        if (!firstFoldingLine) {
            return;
        }
        const lineNo = editor.getLineNumber(firstFoldingLine);
        if (lineNo !== cursor.line) {
            editor.setCursor({
                line: lineNo,
                ch: editor.getLine(lineNo).length,
            });
        }
    }
}

class DeleteShouldIgnoreBulletsFeature {
    constructor(plugin, settings, editorUtils, listsUtils) {
        this.plugin = plugin;
        this.settings = settings;
        this.editorUtils = editorUtils;
        this.listsUtils = listsUtils;
        this.handleBeforeChange = (cm, changeObj) => {
            if (changeObj.origin !== "+delete" ||
                !this.settings.stickCursor ||
                !this.editorUtils.containsSingleCursor(cm)) {
                return;
            }
            const root = this.listsUtils.parseList(cm);
            if (!root) {
                return;
            }
            const list = root.getListUnderCursor();
            const listContentStartCh = list.getContentStartCh();
            const listContentEndCh = list.getContentEndCh();
            if (this.isBackspaceOnContentStart(changeObj, listContentStartCh)) {
                this.deleteItemAndMergeContentWithPreviousLine(cm, root, changeObj);
            }
            else if (this.isDeletionIncludesBullet(changeObj, listContentStartCh)) {
                this.limitDeleteRangeToContentRange(changeObj, listContentStartCh);
            }
            else if (this.isDeleteOnLineEnd(changeObj, listContentEndCh)) {
                this.deleteNextItemAndMergeContentWithCurrentLine(cm, root, changeObj);
            }
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerCodeMirror((cm) => {
                cm.on("beforeChange", this.handleBeforeChange);
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.app.workspace.iterateCodeMirrors((cm) => {
                cm.off("beforeChange", this.handleBeforeChange);
            });
        });
    }
    isDeleteOnLineEnd(changeObj, listContentEndCh) {
        return (changeObj.from.line + 1 === changeObj.to.line &&
            changeObj.from.ch === listContentEndCh &&
            changeObj.to.ch === 0);
    }
    isDeletionIncludesBullet(changeObj, listContentStartCh) {
        return (changeObj.from.line === changeObj.to.line &&
            changeObj.from.ch < listContentStartCh);
    }
    isBackspaceOnContentStart(changeObj, listContentStartCh) {
        return (changeObj.from.line === changeObj.to.line &&
            changeObj.from.ch === listContentStartCh - 1 &&
            changeObj.to.ch === listContentStartCh);
    }
    limitDeleteRangeToContentRange(changeObj, listContentStartCh) {
        const from = {
            line: changeObj.from.line,
            ch: listContentStartCh,
        };
        changeObj.update(from, changeObj.to, changeObj.text);
    }
    deleteItemAndMergeContentWithPreviousLine(editor, root, changeObj) {
        const list = root.getListUnderCursor();
        if (root.getListStartPosition().line === root.getLineNumberOf(list) &&
            list.getChildren().length === 0) {
            return false;
        }
        const res = root.deleteAndMergeWithPrevious();
        if (res) {
            changeObj.cancel();
            this.listsUtils.applyChanges(editor, root);
        }
        return res;
    }
    deleteNextItemAndMergeContentWithCurrentLine(editor, root, changeObj) {
        const list = root.getListUnderCursor();
        const nextLineNo = root.getCursor().line + 1;
        const nextList = root.getListUnderLine(nextLineNo);
        if (!nextList || root.getCursor().ch !== list.getContentEndCh()) {
            return false;
        }
        root.replaceCursor({
            line: nextLineNo,
            ch: nextList.getContentStartCh(),
        });
        const res = root.deleteAndMergeWithPrevious();
        const reallyChanged = root.getCursor().line !== nextLineNo;
        if (reallyChanged) {
            changeObj.cancel();
            this.listsUtils.applyChanges(editor, root);
        }
        return res;
    }
}

class SelectionShouldIgnoreBulletsFeature {
    constructor(plugin, settings, listsUtils) {
        this.plugin = plugin;
        this.settings = settings;
        this.listsUtils = listsUtils;
        this.handleBeforeSelectionChange = (cm, changeObj) => {
            if (!this.settings.stickCursor ||
                changeObj.origin !== "+move" ||
                changeObj.ranges.length > 1) {
                return;
            }
            const range = changeObj.ranges[0];
            if (range.anchor.line !== range.head.line ||
                range.anchor.ch === range.head.ch) {
                return;
            }
            const root = this.listsUtils.parseList(cm);
            if (!root) {
                return;
            }
            const list = root.getListUnderCursor();
            const listContentStartCh = list.getContentStartCh();
            if (range.from().ch < listContentStartCh) {
                range.from().ch = listContentStartCh;
                changeObj.update([range]);
            }
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerCodeMirror((cm) => {
                cm.on("beforeSelectionChange", this.handleBeforeSelectionChange);
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.app.workspace.iterateCodeMirrors((cm) => {
                cm.off("beforeSelectionChange", this.handleBeforeSelectionChange);
            });
        });
    }
}

class ZoomState {
    constructor(line, header) {
        this.line = line;
        this.header = header;
    }
}
class ZoomFeature {
    constructor(plugin, settings, obsidianUtils, listsUtils) {
        this.plugin = plugin;
        this.settings = settings;
        this.obsidianUtils = obsidianUtils;
        this.listsUtils = listsUtils;
        this.zoomStates = new WeakMap();
        this.handleClick = (e) => {
            const target = e.target;
            if (!target ||
                !this.settings.zoomOnClick ||
                !target.classList.contains("cm-formatting-list-ul")) {
                return;
            }
            let wrap = target;
            while (wrap) {
                if (wrap.classList.contains("CodeMirror-wrap")) {
                    break;
                }
                wrap = wrap.parentElement;
            }
            if (!wrap) {
                return;
            }
            let foundEditor = null;
            this.plugin.app.workspace.iterateCodeMirrors((cm) => {
                if (foundEditor) {
                    return;
                }
                if (cm.getWrapperElement() === wrap) {
                    foundEditor = cm;
                }
            });
            if (!foundEditor) {
                return;
            }
            const pos = foundEditor.coordsChar({
                left: e.x,
                top: e.y,
            });
            if (!pos) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            this.zoomIn(foundEditor, pos);
            foundEditor.setCursor({
                line: pos.line,
                ch: foundEditor.getLine(pos.line).length,
            });
        };
        this.handleBeforeChange = (cm, changeObj) => {
            const zoomState = this.zoomStates.get(cm);
            if (!zoomState ||
                changeObj.origin !== "setValue" ||
                changeObj.from.line !== 0 ||
                changeObj.from.ch !== 0) {
                return;
            }
            const tillLine = cm.lastLine();
            const tillCh = cm.getLine(tillLine).length;
            if (changeObj.to.line !== tillLine || changeObj.to.ch !== tillCh) {
                return;
            }
            this.zoomOut(cm);
        };
        this.handleChange = (cm, changeObj) => {
            const zoomState = this.zoomStates.get(cm);
            if (!zoomState || changeObj.origin !== "setValue") {
                return;
            }
            this.zoomIn(cm, {
                line: cm.getLineNumber(zoomState.line),
                ch: 0,
            });
        };
        this.handleBeforeSelectionChange = (cm, changeObj) => {
            if (!this.zoomStates.has(cm)) {
                return;
            }
            let visibleFrom = null;
            let visibleTill = null;
            for (let i = cm.firstLine(); i <= cm.lastLine(); i++) {
                const wrapClass = cm.lineInfo(i).wrapClass || "";
                const isHidden = wrapClass.includes("outliner-plugin-hidden-row");
                if (visibleFrom === null && !isHidden) {
                    visibleFrom = { line: i, ch: 0 };
                }
                if (visibleFrom !== null && visibleTill !== null && isHidden) {
                    break;
                }
                if (visibleFrom !== null) {
                    visibleTill = { line: i, ch: cm.getLine(i).length };
                }
            }
            let changed = false;
            for (const range of changeObj.ranges) {
                if (range.anchor.line < visibleFrom.line) {
                    changed = true;
                    range.anchor.line = visibleFrom.line;
                    range.anchor.ch = visibleFrom.ch;
                }
                if (range.anchor.line > visibleTill.line) {
                    changed = true;
                    range.anchor.line = visibleTill.line;
                    range.anchor.ch = visibleTill.ch;
                }
                if (range.head.line < visibleFrom.line) {
                    changed = true;
                    range.head.line = visibleFrom.line;
                    range.head.ch = visibleFrom.ch;
                }
                if (range.head.line > visibleTill.line) {
                    changed = true;
                    range.head.line = visibleTill.line;
                    range.head.ch = visibleTill.ch;
                }
            }
            if (changed) {
                changeObj.update(changeObj.ranges);
            }
        };
        this.zoomStates = new WeakMap();
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerCodeMirror((cm) => {
                cm.on("beforeChange", this.handleBeforeChange);
                cm.on("change", this.handleChange);
                cm.on("beforeSelectionChange", this.handleBeforeSelectionChange);
            });
            this.plugin.registerDomEvent(window, "click", this.handleClick);
            this.plugin.addCommand({
                id: "zoom-in",
                name: "Zoom in to the current list item",
                callback: this.obsidianUtils.createCommandCallback(this.zoomIn.bind(this)),
                hotkeys: [
                    {
                        modifiers: ["Mod"],
                        key: ".",
                    },
                ],
            });
            this.plugin.addCommand({
                id: "zoom-out",
                name: "Zoom out the entire document",
                callback: this.obsidianUtils.createCommandCallback(this.zoomOut.bind(this)),
                hotkeys: [
                    {
                        modifiers: ["Mod", "Shift"],
                        key: ".",
                    },
                ],
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.app.workspace.iterateCodeMirrors((cm) => {
                cm.off("beforeSelectionChange", this.handleBeforeSelectionChange);
                cm.off("change", this.handleChange);
                cm.off("beforeChange", this.handleBeforeChange);
            });
        });
    }
    zoomOut(editor) {
        const zoomState = this.zoomStates.get(editor);
        if (!zoomState) {
            return false;
        }
        for (let i = editor.firstLine(), l = editor.lastLine(); i <= l; i++) {
            editor.removeLineClass(i, "wrap", "outliner-plugin-hidden-row");
        }
        zoomState.header.parentElement.removeChild(zoomState.header);
        this.zoomStates.delete(editor);
        return true;
    }
    zoomIn(editor, cursor = editor.getCursor()) {
        const lineNo = cursor.line;
        const root = this.listsUtils.parseList(editor, cursor);
        if (!root) {
            return false;
        }
        this.zoomOut(editor);
        const { indentLevel } = this.listsUtils.getListLineInfo(editor.getLine(lineNo), root.getIndentSign());
        let after = false;
        for (let i = editor.firstLine(), l = editor.lastLine(); i <= l; i++) {
            if (i < lineNo) {
                editor.addLineClass(i, "wrap", "outliner-plugin-hidden-row");
            }
            else if (i > lineNo && !after) {
                const afterLineInfo = this.listsUtils.getListLineInfo(editor.getLine(i), root.getIndentSign());
                after = !afterLineInfo || afterLineInfo.indentLevel <= indentLevel;
            }
            if (after) {
                editor.addLineClass(i, "wrap", "outliner-plugin-hidden-row");
            }
        }
        const createSeparator = () => {
            const span = document.createElement("span");
            span.textContent = " > ";
            return span;
        };
        const createTitle = (content, cb) => {
            const a = document.createElement("a");
            a.className = "outliner-plugin-zoom-title";
            if (content) {
                a.textContent = content;
            }
            else {
                a.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
            }
            a.onclick = (e) => {
                e.preventDefault();
                cb();
            };
            return a;
        };
        const createHeader = () => {
            const div = document.createElement("div");
            div.className = "outliner-plugin-zoom-header";
            let list = root.getListUnderLine(lineNo).getParent();
            while (list && list.getParent()) {
                const lineNo = root.getLineNumberOf(list);
                div.prepend(createTitle(list.getContent(), () => this.zoomIn(editor, { line: lineNo, ch: 0 })));
                div.prepend(createSeparator());
                list = list.getParent();
            }
            div.prepend(createTitle(this.obsidianUtils.getActiveLeafDisplayText(), () => this.zoomOut(editor)));
            return div;
        };
        const zoomHeader = createHeader();
        editor.getWrapperElement().prepend(zoomHeader);
        this.zoomStates.set(editor, new ZoomState(editor.getLineHandle(lineNo), zoomHeader));
        return true;
    }
}

class FoldFeature {
    constructor(plugin, obsidianUtils, listsUtils) {
        this.plugin = plugin;
        this.obsidianUtils = obsidianUtils;
        this.listsUtils = listsUtils;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.addCommand({
                id: "fold",
                name: "Fold the list",
                callback: this.obsidianUtils.createCommandCallback(this.fold.bind(this)),
                hotkeys: [
                    {
                        modifiers: ["Mod"],
                        key: "ArrowUp",
                    },
                ],
            });
            this.plugin.addCommand({
                id: "unfold",
                name: "Unfold the list",
                callback: this.obsidianUtils.createCommandCallback(this.unfold.bind(this)),
                hotkeys: [
                    {
                        modifiers: ["Mod"],
                        key: "ArrowDown",
                    },
                ],
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    setFold(editor, type) {
        if (!this.listsUtils.isCursorInList(editor)) {
            return false;
        }
        if (!this.obsidianUtils.getObsidianFoldSettigns().foldIndent) {
            new obsidian.Notice(`Unable to ${type} because folding is disabled. Please enable "Fold indent" in Obsidian settings.`, 5000);
            return true;
        }
        editor.foldCode(editor.getCursor(), null, type);
        return true;
    }
    fold(editor) {
        return this.setFold(editor, "fold");
    }
    unfold(editor) {
        return this.setFold(editor, "unfold");
    }
}

class SelectAllFeature {
    constructor(plugin, obsidianUtils, listsUtils) {
        this.plugin = plugin;
        this.obsidianUtils = obsidianUtils;
        this.listsUtils = listsUtils;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.addCommand({
                id: "select-all",
                name: "Select a list item or the entire list",
                callback: this.obsidianUtils.createCommandCallback(this.selectAll.bind(this)),
                hotkeys: [
                    {
                        modifiers: ["Mod"],
                        key: "a",
                    },
                ],
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    selectAll(editor) {
        const selections = editor.listSelections();
        if (selections.length !== 1) {
            return false;
        }
        const selection = selections[0];
        if (selection.anchor.line !== selection.head.line) {
            return false;
        }
        const root = this.listsUtils.parseList(editor, selection.anchor);
        if (!root) {
            return false;
        }
        const list = root.getListUnderCursor();
        const startCh = list.getContentStartCh();
        const endCh = list.getContentEndCh();
        if (selection.from().ch === startCh && selection.to().ch === endCh) {
            // select all list
            editor.setSelection(root.getListStartPosition(), root.getListEndPosition());
        }
        else {
            // select all line
            editor.setSelection({
                line: selection.anchor.line,
                ch: startCh,
            }, {
                line: selection.anchor.line,
                ch: endCh,
            });
        }
        return true;
    }
}

class MoveItemsFeature {
    constructor(plugin, obsidianUtils, listsUtils) {
        this.plugin = plugin;
        this.obsidianUtils = obsidianUtils;
        this.listsUtils = listsUtils;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.addCommand({
                id: "move-list-item-up",
                name: "Move list and sublists up",
                callback: this.obsidianUtils.createCommandCallback(this.moveListElementUp.bind(this)),
                hotkeys: [
                    {
                        modifiers: ["Mod", "Shift"],
                        key: "ArrowUp",
                    },
                ],
            });
            this.plugin.addCommand({
                id: "move-list-item-down",
                name: "Move list and sublists down",
                callback: this.obsidianUtils.createCommandCallback(this.moveListElementDown.bind(this)),
                hotkeys: [
                    {
                        modifiers: ["Mod", "Shift"],
                        key: "ArrowDown",
                    },
                ],
            });
            this.plugin.addCommand({
                id: "indent-list",
                name: "Indent the list and sublists",
                callback: this.obsidianUtils.createCommandCallback(this.moveListElementRight.bind(this)),
                hotkeys: [
                    {
                        modifiers: [],
                        key: "Tab",
                    },
                ],
            });
            this.plugin.addCommand({
                id: "outdent-list",
                name: "Outdent the list and sublists",
                callback: this.obsidianUtils.createCommandCallback(this.moveListElementLeft.bind(this)),
                hotkeys: [
                    {
                        modifiers: ["Shift"],
                        key: "Tab",
                    },
                ],
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    execute(editor, cb) {
        const root = this.listsUtils.parseList(editor, editor.getCursor());
        if (!root) {
            return false;
        }
        const result = cb(root);
        if (result) {
            this.listsUtils.applyChanges(editor, root);
        }
        return result;
    }
    moveListElementDown(editor) {
        return this.execute(editor, (root) => root.moveDown());
    }
    moveListElementUp(editor) {
        return this.execute(editor, (root) => root.moveUp());
    }
    moveListElementRight(editor) {
        return this.execute(editor, (root) => root.moveRight());
    }
    moveListElementLeft(editor) {
        return this.execute(editor, (root) => root.moveLeft());
    }
}

class ObsidianOutlinerPlugin extends obsidian.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Loading obsidian-outliner`);
            this.settings = new Settings(this);
            yield this.settings.load();
            this.logger = new Logger(this.settings);
            this.obsidianUtils = new ObsidianUtils(this.app);
            this.editorUtils = new EditorUtils();
            this.listsUtils = new ListUtils(this.logger, this.obsidianUtils);
            this.addSettingTab(new ObsidianOutlinerPluginSettingTab(this.app, this, this.settings));
            this.features = [
                new ListsStylesFeature(this, this.settings, this.obsidianUtils),
                new EnterOutdentIfLineIsEmptyFeature(this, this.settings, this.editorUtils, this.listsUtils),
                new EnterShouldCreateNewlineOnChildLevelFeature(this, this.settings, this.listsUtils),
                new EnsureCursorInListContentFeature(this, this.settings, this.editorUtils, this.listsUtils),
                new MoveCursorToPreviousUnfoldedLineFeature(this, this.settings, this.listsUtils),
                new DeleteShouldIgnoreBulletsFeature(this, this.settings, this.editorUtils, this.listsUtils),
                new SelectionShouldIgnoreBulletsFeature(this, this.settings, this.listsUtils),
                new ZoomFeature(this, this.settings, this.obsidianUtils, this.listsUtils),
                new FoldFeature(this, this.obsidianUtils, this.listsUtils),
                new SelectAllFeature(this, this.obsidianUtils, this.listsUtils),
                new MoveItemsFeature(this, this.obsidianUtils, this.listsUtils),
            ];
            for (const feature of this.features) {
                yield feature.load();
            }
        });
    }
    onunload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Unloading obsidian-outliner`);
            for (const feature of this.features) {
                yield feature.unload();
            }
        });
    }
}

module.exports = ObsidianOutlinerPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy9zZXR0aW5ncy50cyIsInNyYy9vYnNpZGlhbl91dGlscy50cyIsInNyYy9lZGl0b3JfdXRpbHMudHMiLCJub2RlX21vZHVsZXMvZGlmZi9saWIvaW5kZXgubWpzIiwic3JjL3Jvb3QudHMiLCJzcmMvbGlzdF91dGlscy50cyIsInNyYy9sb2dnZXIudHMiLCJzcmMvZmVhdHVyZXMvTGlzdHNTdHlsZXNGZWF0dXJlLnRzIiwic3JjL2ZlYXR1cmVzL0VudGVyT3V0ZGVudElmTGluZUlzRW1wdHlGZWF0dXJlLnRzIiwic3JjL2ZlYXR1cmVzL0VudGVyU2hvdWxkQ3JlYXRlTmV3bGluZU9uQ2hpbGRMZXZlbEZlYXR1cmUudHMiLCJzcmMvZmVhdHVyZXMvTW92ZUN1cnNvclRvUHJldmlvdXNVbmZvbGRlZExpbmVGZWF0dXJlLnRzIiwic3JjL2ZlYXR1cmVzL0Vuc3VyZUN1cnNvckluTGlzdENvbnRlbnRGZWF0dXJlLnRzIiwic3JjL2ZlYXR1cmVzL0RlbGV0ZVNob3VsZElnbm9yZUJ1bGxldHNGZWF0dXJlLnRzIiwic3JjL2ZlYXR1cmVzL1NlbGVjdGlvblNob3VsZElnbm9yZUJ1bGxldHNGZWF0dXJlLnRzIiwic3JjL2ZlYXR1cmVzL1pvb21GZWF0dXJlLnRzIiwic3JjL2ZlYXR1cmVzL0ZvbGRGZWF0dXJlLnRzIiwic3JjL2ZlYXR1cmVzL1NlbGVjdEFsbEZlYXR1cmUudHMiLCJzcmMvZmVhdHVyZXMvTW92ZUl0ZW1zRmVhdHVyZS50cyIsInNyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXHJcblxyXG5QZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcclxucHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLlxyXG5cclxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVMgV0lUSFxyXG5SRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFlcclxuQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULFxyXG5JTkRJUkVDVCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST01cclxuTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1JcclxuT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUlxyXG5QRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbihkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxyXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICAgICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2NyZWF0ZUJpbmRpbmcgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIG8pIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgcCkpIF9fY3JlYXRlQmluZGluZyhvLCBtLCBwKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcclxuICAgIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxyXG4gICAgICAgICAgICByW2tdID0gYVtqXTtcclxuICAgIHJldHVybiByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheSh0bywgZnJvbSkge1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGlsID0gZnJvbS5sZW5ndGgsIGogPSB0by5sZW5ndGg7IGkgPCBpbDsgaSsrLCBqKyspXHJcbiAgICAgICAgdG9bal0gPSBmcm9tW2ldO1xyXG4gICAgcmV0dXJuIHRvO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XHJcbn0pIDogZnVuY3Rpb24obywgdikge1xyXG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XHJcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHJlY2VpdmVyLCBzdGF0ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgZ2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgcmVhZCBwcml2YXRlIG1lbWJlciBmcm9tIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XHJcbiAgICByZXR1cm4ga2luZCA9PT0gXCJtXCIgPyBmIDoga2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIpIDogZiA/IGYudmFsdWUgOiBzdGF0ZS5nZXQocmVjZWl2ZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgc3RhdGUsIHZhbHVlLCBraW5kLCBmKSB7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJtXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIG1ldGhvZCBpcyBub3Qgd3JpdGFibGVcIik7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBzZXR0ZXJcIik7XHJcbiAgICBpZiAodHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciAhPT0gc3RhdGUgfHwgIWYgOiAhc3RhdGUuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCB3cml0ZSBwcml2YXRlIG1lbWJlciB0byBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIChraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlciwgdmFsdWUpIDogZiA/IGYudmFsdWUgPSB2YWx1ZSA6IHN0YXRlLnNldChyZWNlaXZlciwgdmFsdWUpKSwgdmFsdWU7XHJcbn1cclxuIiwiaW1wb3J0IHsgQXBwLCBQbHVnaW5TZXR0aW5nVGFiLCBQbHVnaW5fMiwgU2V0dGluZyB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIE9ic2lkaWFuT3V0bGluZXJQbHVnaW5TZXR0aW5ncyB7XG4gIHN0eWxlTGlzdHM6IGJvb2xlYW47XG4gIGRlYnVnOiBib29sZWFuO1xuICBzdGlja0N1cnNvcjogYm9vbGVhbjtcbiAgYmV0dGVyRW50ZXI6IGJvb2xlYW47XG4gIHpvb21PbkNsaWNrOiBib29sZWFuO1xufVxuXG5jb25zdCBERUZBVUxUX1NFVFRJTkdTOiBPYnNpZGlhbk91dGxpbmVyUGx1Z2luU2V0dGluZ3MgPSB7XG4gIHN0eWxlTGlzdHM6IGZhbHNlLFxuICBkZWJ1ZzogZmFsc2UsXG4gIHN0aWNrQ3Vyc29yOiB0cnVlLFxuICBiZXR0ZXJFbnRlcjogdHJ1ZSxcbiAgem9vbU9uQ2xpY2s6IHRydWUsXG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0b3JhZ2Uge1xuICBsb2FkRGF0YSgpOiBQcm9taXNlPE9ic2lkaWFuT3V0bGluZXJQbHVnaW5TZXR0aW5ncz47XG4gIHNhdmVEYXRhKHNldHRpZ25zOiBPYnNpZGlhbk91dGxpbmVyUGx1Z2luU2V0dGluZ3MpOiBQcm9taXNlPHZvaWQ+O1xufVxuXG50eXBlIEsgPSBrZXlvZiBPYnNpZGlhbk91dGxpbmVyUGx1Z2luU2V0dGluZ3M7XG50eXBlIFY8VCBleHRlbmRzIEs+ID0gT2JzaWRpYW5PdXRsaW5lclBsdWdpblNldHRpbmdzW1RdO1xudHlwZSBDYWxsYmFjazxUIGV4dGVuZHMgSz4gPSAoY2I6IFY8VD4pID0+IHZvaWQ7XG5cbmV4cG9ydCBjbGFzcyBTZXR0aW5ncyBpbXBsZW1lbnRzIE9ic2lkaWFuT3V0bGluZXJQbHVnaW5TZXR0aW5ncyB7XG4gIHByaXZhdGUgc3RvcmFnZTogU3RvcmFnZTtcbiAgcHJpdmF0ZSB2YWx1ZXM6IE9ic2lkaWFuT3V0bGluZXJQbHVnaW5TZXR0aW5ncztcbiAgcHJpdmF0ZSBoYW5kbGVyczogTWFwPEssIFNldDxDYWxsYmFjazxLPj4+O1xuXG4gIGNvbnN0cnVjdG9yKHN0b3JhZ2U6IFN0b3JhZ2UpIHtcbiAgICB0aGlzLnN0b3JhZ2UgPSBzdG9yYWdlO1xuICAgIHRoaXMuaGFuZGxlcnMgPSBuZXcgTWFwKCk7XG4gIH1cblxuICBnZXQgc3R5bGVMaXN0cygpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZXMuc3R5bGVMaXN0cztcbiAgfVxuICBzZXQgc3R5bGVMaXN0cyh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuc2V0KFwic3R5bGVMaXN0c1wiLCB2YWx1ZSk7XG4gIH1cblxuICBnZXQgZGVidWcoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWVzLmRlYnVnO1xuICB9XG4gIHNldCBkZWJ1Zyh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuc2V0KFwiZGVidWdcIiwgdmFsdWUpO1xuICB9XG5cbiAgZ2V0IHN0aWNrQ3Vyc29yKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlcy5zdGlja0N1cnNvcjtcbiAgfVxuICBzZXQgc3RpY2tDdXJzb3IodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLnNldChcInN0aWNrQ3Vyc29yXCIsIHZhbHVlKTtcbiAgfVxuXG4gIGdldCBiZXR0ZXJFbnRlcigpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZXMuYmV0dGVyRW50ZXI7XG4gIH1cbiAgc2V0IGJldHRlckVudGVyKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5zZXQoXCJiZXR0ZXJFbnRlclwiLCB2YWx1ZSk7XG4gIH1cblxuICBnZXQgem9vbU9uQ2xpY2soKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWVzLnpvb21PbkNsaWNrO1xuICB9XG4gIHNldCB6b29tT25DbGljayh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuc2V0KFwiem9vbU9uQ2xpY2tcIiwgdmFsdWUpO1xuICB9XG5cbiAgb25DaGFuZ2U8VCBleHRlbmRzIEs+KGtleTogVCwgY2I6IENhbGxiYWNrPFQ+KSB7XG4gICAgaWYgKCF0aGlzLmhhbmRsZXJzLmhhcyhrZXkpKSB7XG4gICAgICB0aGlzLmhhbmRsZXJzLnNldChrZXksIG5ldyBTZXQoKSk7XG4gICAgfVxuXG4gICAgdGhpcy5oYW5kbGVycy5nZXQoa2V5KS5hZGQoY2IpO1xuICB9XG5cbiAgcmVtb3ZlQ2FsbGJhY2s8VCBleHRlbmRzIEs+KGtleTogVCwgY2I6IENhbGxiYWNrPFQ+KTogdm9pZCB7XG4gICAgY29uc3QgaGFuZGxlcnMgPSB0aGlzLmhhbmRsZXJzLmdldChrZXkpO1xuXG4gICAgaWYgKGhhbmRsZXJzKSB7XG4gICAgICBoYW5kbGVycy5kZWxldGUoY2IpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGxvYWQoKSB7XG4gICAgdGhpcy52YWx1ZXMgPSBPYmplY3QuYXNzaWduKFxuICAgICAge30sXG4gICAgICBERUZBVUxUX1NFVFRJTkdTLFxuICAgICAgYXdhaXQgdGhpcy5zdG9yYWdlLmxvYWREYXRhKClcbiAgICApO1xuICB9XG5cbiAgYXN5bmMgc2F2ZSgpIHtcbiAgICBhd2FpdCB0aGlzLnN0b3JhZ2Uuc2F2ZURhdGEodGhpcy52YWx1ZXMpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXQ8VCBleHRlbmRzIEs+KGtleTogVCwgdmFsdWU6IFY8Sz4pOiB2b2lkIHtcbiAgICB0aGlzLnZhbHVlc1trZXldID0gdmFsdWU7XG4gICAgY29uc3QgY2FsbGJhY2tzID0gdGhpcy5oYW5kbGVycy5nZXQoa2V5KTtcblxuICAgIGlmICghY2FsbGJhY2tzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBjYiBvZiBjYWxsYmFja3MudmFsdWVzKCkpIHtcbiAgICAgIGNiKHZhbHVlKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE9ic2lkaWFuT3V0bGluZXJQbHVnaW5TZXR0aW5nVGFiIGV4dGVuZHMgUGx1Z2luU2V0dGluZ1RhYiB7XG4gIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwbHVnaW46IFBsdWdpbl8yLCBwcml2YXRlIHNldHRpbmdzOiBTZXR0aW5ncykge1xuICAgIHN1cGVyKGFwcCwgcGx1Z2luKTtcbiAgfVxuXG4gIGRpc3BsYXkoKTogdm9pZCB7XG4gICAgY29uc3QgeyBjb250YWluZXJFbCB9ID0gdGhpcztcblxuICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiSW1wcm92ZSB0aGUgc3R5bGUgb2YgeW91ciBsaXN0c1wiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiU3R5bGVzIGFyZSBvbmx5IGNvbXBhdGlibGUgd2l0aCBidWlsdC1pbiBPYnNpZGlhbiB0aGVtZXMgYW5kIG1heSBub3QgYmUgY29tcGF0aWJsZSB3aXRoIG90aGVyIHRoZW1lcy4gU3R5bGVzIG9ubHkgd29yayB3ZWxsIHdpdGggc3BhY2VzIG9yIGZvdXItc3BhY2UgdGFicy5cIlxuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PiB7XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnNldHRpbmdzLnN0eWxlTGlzdHMpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0dGluZ3Muc3R5bGVMaXN0cyA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMuc2V0dGluZ3Muc2F2ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlN0aWNrIHRoZSBjdXJzb3IgdG8gdGhlIGNvbnRlbnRcIilcbiAgICAgIC5zZXREZXNjKFwiRG9uJ3QgbGV0IHRoZSBjdXJzb3IgbW92ZSB0byB0aGUgYnVsbGV0IHBvc2l0aW9uLlwiKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PiB7XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnNldHRpbmdzLnN0aWNrQ3Vyc29yKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnNldHRpbmdzLnN0aWNrQ3Vyc29yID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5zZXR0aW5ncy5zYXZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiRW5oYW5jZSB0aGUgRW50ZXIga2V5XCIpXG4gICAgICAuc2V0RGVzYyhcIk1ha2UgdGhlIEVudGVyIGtleSBiZWhhdmUgdGhlIHNhbWUgYXMgb3RoZXIgb3V0bGluZXJzLlwiKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PiB7XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnNldHRpbmdzLmJldHRlckVudGVyKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnNldHRpbmdzLmJldHRlckVudGVyID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5zZXR0aW5ncy5zYXZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiWm9vbWluZyBpbiB3aGVuIGNsaWNraW5nIG9uIHRoZSBidWxsZXRcIilcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT4ge1xuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5zZXR0aW5ncy56b29tT25DbGljaykub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy56b29tT25DbGljayA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMuc2V0dGluZ3Muc2F2ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkRlYnVnIG1vZGVcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIk9wZW4gRGV2VG9vbHMgKENvbW1hbmQrT3B0aW9uK0kgb3IgQ29udHJvbCtTaGlmdCtJKSB0byBjb3B5IHRoZSBkZWJ1ZyBsb2dzLlwiXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMuc2V0dGluZ3MuZGVidWcpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0dGluZ3MuZGVidWcgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnNldHRpbmdzLnNhdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQXBwLCBNYXJrZG93blZpZXcgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuZXhwb3J0IGludGVyZmFjZSBJT2JzaWRpYW5UYWJzU2V0dGlnbnMge1xuICB1c2VUYWI6IGJvb2xlYW47XG4gIHRhYlNpemU6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJT2JzaWRpYW5Gb2xkU2V0dGlnbnMge1xuICBmb2xkSW5kZW50OiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgT2JzaWRpYW5VdGlscyB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBwOiBBcHApIHt9XG5cbiAgZ2V0T2JzaWRpYW5UYWJzU2V0dGlnbnMoKTogSU9ic2lkaWFuVGFic1NldHRpZ25zIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXNlVGFiOiB0cnVlLFxuICAgICAgdGFiU2l6ZTogNCxcbiAgICAgIC4uLih0aGlzLmFwcC52YXVsdCBhcyBhbnkpLmNvbmZpZyxcbiAgICB9O1xuICB9XG5cbiAgZ2V0T2JzaWRpYW5Gb2xkU2V0dGlnbnMoKTogSU9ic2lkaWFuRm9sZFNldHRpZ25zIHtcbiAgICByZXR1cm4ge1xuICAgICAgZm9sZEluZGVudDogZmFsc2UsXG4gICAgICAuLi4odGhpcy5hcHAudmF1bHQgYXMgYW55KS5jb25maWcsXG4gICAgfTtcbiAgfVxuXG4gIGdldEFjdGl2ZUxlYWZEaXNwbGF5VGV4dCgpIHtcbiAgICByZXR1cm4gdGhpcy5hcHAud29ya3NwYWNlLmFjdGl2ZUxlYWYuZ2V0RGlzcGxheVRleHQoKTtcbiAgfVxuXG4gIGNyZWF0ZUNvbW1hbmRDYWxsYmFjayhjYjogKGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IpID0+IGJvb2xlYW4pIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgY29uc3QgdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG5cbiAgICAgIGlmICghdmlldykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGVkaXRvciA9IHZpZXcuc291cmNlTW9kZS5jbUVkaXRvcjtcblxuICAgICAgY29uc3Qgd29ya2VkID0gY2IoZWRpdG9yKTtcblxuICAgICAgaWYgKCF3b3JrZWQgJiYgd2luZG93LmV2ZW50ICYmIHdpbmRvdy5ldmVudC50eXBlID09PSBcImtleWRvd25cIikge1xuICAgICAgICAoZWRpdG9yIGFzIGFueSkudHJpZ2dlck9uS2V5RG93bih3aW5kb3cuZXZlbnQpO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBFZGl0b3JVdGlscyB7XG4gIGNvbnRhaW5zU2luZ2xlQ3Vyc29yKGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IpIHtcbiAgICBjb25zdCBzZWxlY3Rpb25zID0gZWRpdG9yLmxpc3RTZWxlY3Rpb25zKCk7XG5cbiAgICByZXR1cm4gc2VsZWN0aW9ucy5sZW5ndGggPT09IDEgJiYgdGhpcy5yYW5nZUlzQ3Vyc29yKHNlbGVjdGlvbnNbMF0pO1xuICB9XG5cbiAgcmFuZ2VJc0N1cnNvcihzZWxlY3Rpb246IENvZGVNaXJyb3IuUmFuZ2UpIHtcbiAgICByZXR1cm4gKFxuICAgICAgc2VsZWN0aW9uLmFuY2hvci5saW5lID09PSBzZWxlY3Rpb24uaGVhZC5saW5lICYmXG4gICAgICBzZWxlY3Rpb24uYW5jaG9yLmNoID09PSBzZWxlY3Rpb24uaGVhZC5jaFxuICAgICk7XG4gIH1cbn1cbiIsImZ1bmN0aW9uIERpZmYoKSB7fVxuRGlmZi5wcm90b3R5cGUgPSB7XG4gIGRpZmY6IGZ1bmN0aW9uIGRpZmYob2xkU3RyaW5nLCBuZXdTdHJpbmcpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDoge307XG4gICAgdmFyIGNhbGxiYWNrID0gb3B0aW9ucy5jYWxsYmFjaztcblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY2FsbGJhY2sgPSBvcHRpb25zO1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cblxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgZnVuY3Rpb24gZG9uZSh2YWx1ZSkge1xuICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNhbGxiYWNrKHVuZGVmaW5lZCwgdmFsdWUpO1xuICAgICAgICB9LCAwKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9XG4gICAgfSAvLyBBbGxvdyBzdWJjbGFzc2VzIHRvIG1hc3NhZ2UgdGhlIGlucHV0IHByaW9yIHRvIHJ1bm5pbmdcblxuXG4gICAgb2xkU3RyaW5nID0gdGhpcy5jYXN0SW5wdXQob2xkU3RyaW5nKTtcbiAgICBuZXdTdHJpbmcgPSB0aGlzLmNhc3RJbnB1dChuZXdTdHJpbmcpO1xuICAgIG9sZFN0cmluZyA9IHRoaXMucmVtb3ZlRW1wdHkodGhpcy50b2tlbml6ZShvbGRTdHJpbmcpKTtcbiAgICBuZXdTdHJpbmcgPSB0aGlzLnJlbW92ZUVtcHR5KHRoaXMudG9rZW5pemUobmV3U3RyaW5nKSk7XG4gICAgdmFyIG5ld0xlbiA9IG5ld1N0cmluZy5sZW5ndGgsXG4gICAgICAgIG9sZExlbiA9IG9sZFN0cmluZy5sZW5ndGg7XG4gICAgdmFyIGVkaXRMZW5ndGggPSAxO1xuICAgIHZhciBtYXhFZGl0TGVuZ3RoID0gbmV3TGVuICsgb2xkTGVuO1xuICAgIHZhciBiZXN0UGF0aCA9IFt7XG4gICAgICBuZXdQb3M6IC0xLFxuICAgICAgY29tcG9uZW50czogW11cbiAgICB9XTsgLy8gU2VlZCBlZGl0TGVuZ3RoID0gMCwgaS5lLiB0aGUgY29udGVudCBzdGFydHMgd2l0aCB0aGUgc2FtZSB2YWx1ZXNcblxuICAgIHZhciBvbGRQb3MgPSB0aGlzLmV4dHJhY3RDb21tb24oYmVzdFBhdGhbMF0sIG5ld1N0cmluZywgb2xkU3RyaW5nLCAwKTtcblxuICAgIGlmIChiZXN0UGF0aFswXS5uZXdQb3MgKyAxID49IG5ld0xlbiAmJiBvbGRQb3MgKyAxID49IG9sZExlbikge1xuICAgICAgLy8gSWRlbnRpdHkgcGVyIHRoZSBlcXVhbGl0eSBhbmQgdG9rZW5pemVyXG4gICAgICByZXR1cm4gZG9uZShbe1xuICAgICAgICB2YWx1ZTogdGhpcy5qb2luKG5ld1N0cmluZyksXG4gICAgICAgIGNvdW50OiBuZXdTdHJpbmcubGVuZ3RoXG4gICAgICB9XSk7XG4gICAgfSAvLyBNYWluIHdvcmtlciBtZXRob2QuIGNoZWNrcyBhbGwgcGVybXV0YXRpb25zIG9mIGEgZ2l2ZW4gZWRpdCBsZW5ndGggZm9yIGFjY2VwdGFuY2UuXG5cblxuICAgIGZ1bmN0aW9uIGV4ZWNFZGl0TGVuZ3RoKCkge1xuICAgICAgZm9yICh2YXIgZGlhZ29uYWxQYXRoID0gLTEgKiBlZGl0TGVuZ3RoOyBkaWFnb25hbFBhdGggPD0gZWRpdExlbmd0aDsgZGlhZ29uYWxQYXRoICs9IDIpIHtcbiAgICAgICAgdmFyIGJhc2VQYXRoID0gdm9pZCAwO1xuXG4gICAgICAgIHZhciBhZGRQYXRoID0gYmVzdFBhdGhbZGlhZ29uYWxQYXRoIC0gMV0sXG4gICAgICAgICAgICByZW1vdmVQYXRoID0gYmVzdFBhdGhbZGlhZ29uYWxQYXRoICsgMV0sXG4gICAgICAgICAgICBfb2xkUG9zID0gKHJlbW92ZVBhdGggPyByZW1vdmVQYXRoLm5ld1BvcyA6IDApIC0gZGlhZ29uYWxQYXRoO1xuXG4gICAgICAgIGlmIChhZGRQYXRoKSB7XG4gICAgICAgICAgLy8gTm8gb25lIGVsc2UgaXMgZ29pbmcgdG8gYXR0ZW1wdCB0byB1c2UgdGhpcyB2YWx1ZSwgY2xlYXIgaXRcbiAgICAgICAgICBiZXN0UGF0aFtkaWFnb25hbFBhdGggLSAxXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjYW5BZGQgPSBhZGRQYXRoICYmIGFkZFBhdGgubmV3UG9zICsgMSA8IG5ld0xlbixcbiAgICAgICAgICAgIGNhblJlbW92ZSA9IHJlbW92ZVBhdGggJiYgMCA8PSBfb2xkUG9zICYmIF9vbGRQb3MgPCBvbGRMZW47XG5cbiAgICAgICAgaWYgKCFjYW5BZGQgJiYgIWNhblJlbW92ZSkge1xuICAgICAgICAgIC8vIElmIHRoaXMgcGF0aCBpcyBhIHRlcm1pbmFsIHRoZW4gcHJ1bmVcbiAgICAgICAgICBiZXN0UGF0aFtkaWFnb25hbFBhdGhdID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IC8vIFNlbGVjdCB0aGUgZGlhZ29uYWwgdGhhdCB3ZSB3YW50IHRvIGJyYW5jaCBmcm9tLiBXZSBzZWxlY3QgdGhlIHByaW9yXG4gICAgICAgIC8vIHBhdGggd2hvc2UgcG9zaXRpb24gaW4gdGhlIG5ldyBzdHJpbmcgaXMgdGhlIGZhcnRoZXN0IGZyb20gdGhlIG9yaWdpblxuICAgICAgICAvLyBhbmQgZG9lcyBub3QgcGFzcyB0aGUgYm91bmRzIG9mIHRoZSBkaWZmIGdyYXBoXG5cblxuICAgICAgICBpZiAoIWNhbkFkZCB8fCBjYW5SZW1vdmUgJiYgYWRkUGF0aC5uZXdQb3MgPCByZW1vdmVQYXRoLm5ld1Bvcykge1xuICAgICAgICAgIGJhc2VQYXRoID0gY2xvbmVQYXRoKHJlbW92ZVBhdGgpO1xuICAgICAgICAgIHNlbGYucHVzaENvbXBvbmVudChiYXNlUGF0aC5jb21wb25lbnRzLCB1bmRlZmluZWQsIHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJhc2VQYXRoID0gYWRkUGF0aDsgLy8gTm8gbmVlZCB0byBjbG9uZSwgd2UndmUgcHVsbGVkIGl0IGZyb20gdGhlIGxpc3RcblxuICAgICAgICAgIGJhc2VQYXRoLm5ld1BvcysrO1xuICAgICAgICAgIHNlbGYucHVzaENvbXBvbmVudChiYXNlUGF0aC5jb21wb25lbnRzLCB0cnVlLCB1bmRlZmluZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgX29sZFBvcyA9IHNlbGYuZXh0cmFjdENvbW1vbihiYXNlUGF0aCwgbmV3U3RyaW5nLCBvbGRTdHJpbmcsIGRpYWdvbmFsUGF0aCk7IC8vIElmIHdlIGhhdmUgaGl0IHRoZSBlbmQgb2YgYm90aCBzdHJpbmdzLCB0aGVuIHdlIGFyZSBkb25lXG5cbiAgICAgICAgaWYgKGJhc2VQYXRoLm5ld1BvcyArIDEgPj0gbmV3TGVuICYmIF9vbGRQb3MgKyAxID49IG9sZExlbikge1xuICAgICAgICAgIHJldHVybiBkb25lKGJ1aWxkVmFsdWVzKHNlbGYsIGJhc2VQYXRoLmNvbXBvbmVudHMsIG5ld1N0cmluZywgb2xkU3RyaW5nLCBzZWxmLnVzZUxvbmdlc3RUb2tlbikpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIE90aGVyd2lzZSB0cmFjayB0aGlzIHBhdGggYXMgYSBwb3RlbnRpYWwgY2FuZGlkYXRlIGFuZCBjb250aW51ZS5cbiAgICAgICAgICBiZXN0UGF0aFtkaWFnb25hbFBhdGhdID0gYmFzZVBhdGg7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZWRpdExlbmd0aCsrO1xuICAgIH0gLy8gUGVyZm9ybXMgdGhlIGxlbmd0aCBvZiBlZGl0IGl0ZXJhdGlvbi4gSXMgYSBiaXQgZnVnbHkgYXMgdGhpcyBoYXMgdG8gc3VwcG9ydCB0aGVcbiAgICAvLyBzeW5jIGFuZCBhc3luYyBtb2RlIHdoaWNoIGlzIG5ldmVyIGZ1bi4gTG9vcHMgb3ZlciBleGVjRWRpdExlbmd0aCB1bnRpbCBhIHZhbHVlXG4gICAgLy8gaXMgcHJvZHVjZWQuXG5cblxuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgKGZ1bmN0aW9uIGV4ZWMoKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vIFRoaXMgc2hvdWxkIG5vdCBoYXBwZW4sIGJ1dCB3ZSB3YW50IHRvIGJlIHNhZmUuXG5cbiAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgICAgIGlmIChlZGl0TGVuZ3RoID4gbWF4RWRpdExlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFleGVjRWRpdExlbmd0aCgpKSB7XG4gICAgICAgICAgICBleGVjKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCAwKTtcbiAgICAgIH0pKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdoaWxlIChlZGl0TGVuZ3RoIDw9IG1heEVkaXRMZW5ndGgpIHtcbiAgICAgICAgdmFyIHJldCA9IGV4ZWNFZGl0TGVuZ3RoKCk7XG5cbiAgICAgICAgaWYgKHJldCkge1xuICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHB1c2hDb21wb25lbnQ6IGZ1bmN0aW9uIHB1c2hDb21wb25lbnQoY29tcG9uZW50cywgYWRkZWQsIHJlbW92ZWQpIHtcbiAgICB2YXIgbGFzdCA9IGNvbXBvbmVudHNbY29tcG9uZW50cy5sZW5ndGggLSAxXTtcblxuICAgIGlmIChsYXN0ICYmIGxhc3QuYWRkZWQgPT09IGFkZGVkICYmIGxhc3QucmVtb3ZlZCA9PT0gcmVtb3ZlZCkge1xuICAgICAgLy8gV2UgbmVlZCB0byBjbG9uZSBoZXJlIGFzIHRoZSBjb21wb25lbnQgY2xvbmUgb3BlcmF0aW9uIGlzIGp1c3RcbiAgICAgIC8vIGFzIHNoYWxsb3cgYXJyYXkgY2xvbmVcbiAgICAgIGNvbXBvbmVudHNbY29tcG9uZW50cy5sZW5ndGggLSAxXSA9IHtcbiAgICAgICAgY291bnQ6IGxhc3QuY291bnQgKyAxLFxuICAgICAgICBhZGRlZDogYWRkZWQsXG4gICAgICAgIHJlbW92ZWQ6IHJlbW92ZWRcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbXBvbmVudHMucHVzaCh7XG4gICAgICAgIGNvdW50OiAxLFxuICAgICAgICBhZGRlZDogYWRkZWQsXG4gICAgICAgIHJlbW92ZWQ6IHJlbW92ZWRcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgZXh0cmFjdENvbW1vbjogZnVuY3Rpb24gZXh0cmFjdENvbW1vbihiYXNlUGF0aCwgbmV3U3RyaW5nLCBvbGRTdHJpbmcsIGRpYWdvbmFsUGF0aCkge1xuICAgIHZhciBuZXdMZW4gPSBuZXdTdHJpbmcubGVuZ3RoLFxuICAgICAgICBvbGRMZW4gPSBvbGRTdHJpbmcubGVuZ3RoLFxuICAgICAgICBuZXdQb3MgPSBiYXNlUGF0aC5uZXdQb3MsXG4gICAgICAgIG9sZFBvcyA9IG5ld1BvcyAtIGRpYWdvbmFsUGF0aCxcbiAgICAgICAgY29tbW9uQ291bnQgPSAwO1xuXG4gICAgd2hpbGUgKG5ld1BvcyArIDEgPCBuZXdMZW4gJiYgb2xkUG9zICsgMSA8IG9sZExlbiAmJiB0aGlzLmVxdWFscyhuZXdTdHJpbmdbbmV3UG9zICsgMV0sIG9sZFN0cmluZ1tvbGRQb3MgKyAxXSkpIHtcbiAgICAgIG5ld1BvcysrO1xuICAgICAgb2xkUG9zKys7XG4gICAgICBjb21tb25Db3VudCsrO1xuICAgIH1cblxuICAgIGlmIChjb21tb25Db3VudCkge1xuICAgICAgYmFzZVBhdGguY29tcG9uZW50cy5wdXNoKHtcbiAgICAgICAgY291bnQ6IGNvbW1vbkNvdW50XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBiYXNlUGF0aC5uZXdQb3MgPSBuZXdQb3M7XG4gICAgcmV0dXJuIG9sZFBvcztcbiAgfSxcbiAgZXF1YWxzOiBmdW5jdGlvbiBlcXVhbHMobGVmdCwgcmlnaHQpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmNvbXBhcmF0b3IpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuY29tcGFyYXRvcihsZWZ0LCByaWdodCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBsZWZ0ID09PSByaWdodCB8fCB0aGlzLm9wdGlvbnMuaWdub3JlQ2FzZSAmJiBsZWZ0LnRvTG93ZXJDYXNlKCkgPT09IHJpZ2h0LnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuICB9LFxuICByZW1vdmVFbXB0eTogZnVuY3Rpb24gcmVtb3ZlRW1wdHkoYXJyYXkpIHtcbiAgICB2YXIgcmV0ID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoYXJyYXlbaV0pIHtcbiAgICAgICAgcmV0LnB1c2goYXJyYXlbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG4gIH0sXG4gIGNhc3RJbnB1dDogZnVuY3Rpb24gY2FzdElucHV0KHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9LFxuICB0b2tlbml6ZTogZnVuY3Rpb24gdG9rZW5pemUodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUuc3BsaXQoJycpO1xuICB9LFxuICBqb2luOiBmdW5jdGlvbiBqb2luKGNoYXJzKSB7XG4gICAgcmV0dXJuIGNoYXJzLmpvaW4oJycpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBidWlsZFZhbHVlcyhkaWZmLCBjb21wb25lbnRzLCBuZXdTdHJpbmcsIG9sZFN0cmluZywgdXNlTG9uZ2VzdFRva2VuKSB7XG4gIHZhciBjb21wb25lbnRQb3MgPSAwLFxuICAgICAgY29tcG9uZW50TGVuID0gY29tcG9uZW50cy5sZW5ndGgsXG4gICAgICBuZXdQb3MgPSAwLFxuICAgICAgb2xkUG9zID0gMDtcblxuICBmb3IgKDsgY29tcG9uZW50UG9zIDwgY29tcG9uZW50TGVuOyBjb21wb25lbnRQb3MrKykge1xuICAgIHZhciBjb21wb25lbnQgPSBjb21wb25lbnRzW2NvbXBvbmVudFBvc107XG5cbiAgICBpZiAoIWNvbXBvbmVudC5yZW1vdmVkKSB7XG4gICAgICBpZiAoIWNvbXBvbmVudC5hZGRlZCAmJiB1c2VMb25nZXN0VG9rZW4pIHtcbiAgICAgICAgdmFyIHZhbHVlID0gbmV3U3RyaW5nLnNsaWNlKG5ld1BvcywgbmV3UG9zICsgY29tcG9uZW50LmNvdW50KTtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5tYXAoZnVuY3Rpb24gKHZhbHVlLCBpKSB7XG4gICAgICAgICAgdmFyIG9sZFZhbHVlID0gb2xkU3RyaW5nW29sZFBvcyArIGldO1xuICAgICAgICAgIHJldHVybiBvbGRWYWx1ZS5sZW5ndGggPiB2YWx1ZS5sZW5ndGggPyBvbGRWYWx1ZSA6IHZhbHVlO1xuICAgICAgICB9KTtcbiAgICAgICAgY29tcG9uZW50LnZhbHVlID0gZGlmZi5qb2luKHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbXBvbmVudC52YWx1ZSA9IGRpZmYuam9pbihuZXdTdHJpbmcuc2xpY2UobmV3UG9zLCBuZXdQb3MgKyBjb21wb25lbnQuY291bnQpKTtcbiAgICAgIH1cblxuICAgICAgbmV3UG9zICs9IGNvbXBvbmVudC5jb3VudDsgLy8gQ29tbW9uIGNhc2VcblxuICAgICAgaWYgKCFjb21wb25lbnQuYWRkZWQpIHtcbiAgICAgICAgb2xkUG9zICs9IGNvbXBvbmVudC5jb3VudDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29tcG9uZW50LnZhbHVlID0gZGlmZi5qb2luKG9sZFN0cmluZy5zbGljZShvbGRQb3MsIG9sZFBvcyArIGNvbXBvbmVudC5jb3VudCkpO1xuICAgICAgb2xkUG9zICs9IGNvbXBvbmVudC5jb3VudDsgLy8gUmV2ZXJzZSBhZGQgYW5kIHJlbW92ZSBzbyByZW1vdmVzIGFyZSBvdXRwdXQgZmlyc3QgdG8gbWF0Y2ggY29tbW9uIGNvbnZlbnRpb25cbiAgICAgIC8vIFRoZSBkaWZmaW5nIGFsZ29yaXRobSBpcyB0aWVkIHRvIGFkZCB0aGVuIHJlbW92ZSBvdXRwdXQgYW5kIHRoaXMgaXMgdGhlIHNpbXBsZXN0XG4gICAgICAvLyByb3V0ZSB0byBnZXQgdGhlIGRlc2lyZWQgb3V0cHV0IHdpdGggbWluaW1hbCBvdmVyaGVhZC5cblxuICAgICAgaWYgKGNvbXBvbmVudFBvcyAmJiBjb21wb25lbnRzW2NvbXBvbmVudFBvcyAtIDFdLmFkZGVkKSB7XG4gICAgICAgIHZhciB0bXAgPSBjb21wb25lbnRzW2NvbXBvbmVudFBvcyAtIDFdO1xuICAgICAgICBjb21wb25lbnRzW2NvbXBvbmVudFBvcyAtIDFdID0gY29tcG9uZW50c1tjb21wb25lbnRQb3NdO1xuICAgICAgICBjb21wb25lbnRzW2NvbXBvbmVudFBvc10gPSB0bXA7XG4gICAgICB9XG4gICAgfVxuICB9IC8vIFNwZWNpYWwgY2FzZSBoYW5kbGUgZm9yIHdoZW4gb25lIHRlcm1pbmFsIGlzIGlnbm9yZWQgKGkuZS4gd2hpdGVzcGFjZSkuXG4gIC8vIEZvciB0aGlzIGNhc2Ugd2UgbWVyZ2UgdGhlIHRlcm1pbmFsIGludG8gdGhlIHByaW9yIHN0cmluZyBhbmQgZHJvcCB0aGUgY2hhbmdlLlxuICAvLyBUaGlzIGlzIG9ubHkgYXZhaWxhYmxlIGZvciBzdHJpbmcgbW9kZS5cblxuXG4gIHZhciBsYXN0Q29tcG9uZW50ID0gY29tcG9uZW50c1tjb21wb25lbnRMZW4gLSAxXTtcblxuICBpZiAoY29tcG9uZW50TGVuID4gMSAmJiB0eXBlb2YgbGFzdENvbXBvbmVudC52YWx1ZSA9PT0gJ3N0cmluZycgJiYgKGxhc3RDb21wb25lbnQuYWRkZWQgfHwgbGFzdENvbXBvbmVudC5yZW1vdmVkKSAmJiBkaWZmLmVxdWFscygnJywgbGFzdENvbXBvbmVudC52YWx1ZSkpIHtcbiAgICBjb21wb25lbnRzW2NvbXBvbmVudExlbiAtIDJdLnZhbHVlICs9IGxhc3RDb21wb25lbnQudmFsdWU7XG4gICAgY29tcG9uZW50cy5wb3AoKTtcbiAgfVxuXG4gIHJldHVybiBjb21wb25lbnRzO1xufVxuXG5mdW5jdGlvbiBjbG9uZVBhdGgocGF0aCkge1xuICByZXR1cm4ge1xuICAgIG5ld1BvczogcGF0aC5uZXdQb3MsXG4gICAgY29tcG9uZW50czogcGF0aC5jb21wb25lbnRzLnNsaWNlKDApXG4gIH07XG59XG5cbnZhciBjaGFyYWN0ZXJEaWZmID0gbmV3IERpZmYoKTtcbmZ1bmN0aW9uIGRpZmZDaGFycyhvbGRTdHIsIG5ld1N0ciwgb3B0aW9ucykge1xuICByZXR1cm4gY2hhcmFjdGVyRGlmZi5kaWZmKG9sZFN0ciwgbmV3U3RyLCBvcHRpb25zKTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVPcHRpb25zKG9wdGlvbnMsIGRlZmF1bHRzKSB7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGRlZmF1bHRzLmNhbGxiYWNrID0gb3B0aW9ucztcbiAgfSBlbHNlIGlmIChvcHRpb25zKSB7XG4gICAgZm9yICh2YXIgbmFtZSBpbiBvcHRpb25zKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKG9wdGlvbnMuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgZGVmYXVsdHNbbmFtZV0gPSBvcHRpb25zW25hbWVdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkZWZhdWx0cztcbn1cblxuLy9cbi8vIFJhbmdlcyBhbmQgZXhjZXB0aW9uczpcbi8vIExhdGluLTEgU3VwcGxlbWVudCwgMDA4MOKAkzAwRkZcbi8vICAtIFUrMDBENyAgw5cgTXVsdGlwbGljYXRpb24gc2lnblxuLy8gIC0gVSswMEY3ICDDtyBEaXZpc2lvbiBzaWduXG4vLyBMYXRpbiBFeHRlbmRlZC1BLCAwMTAw4oCTMDE3RlxuLy8gTGF0aW4gRXh0ZW5kZWQtQiwgMDE4MOKAkzAyNEZcbi8vIElQQSBFeHRlbnNpb25zLCAwMjUw4oCTMDJBRlxuLy8gU3BhY2luZyBNb2RpZmllciBMZXR0ZXJzLCAwMkIw4oCTMDJGRlxuLy8gIC0gVSswMkM3ICDLhyAmIzcxMTsgIENhcm9uXG4vLyAgLSBVKzAyRDggIMuYICYjNzI4OyAgQnJldmVcbi8vICAtIFUrMDJEOSAgy5kgJiM3Mjk7ICBEb3QgQWJvdmVcbi8vICAtIFUrMDJEQSAgy5ogJiM3MzA7ICBSaW5nIEFib3ZlXG4vLyAgLSBVKzAyREIgIMubICYjNzMxOyAgT2dvbmVrXG4vLyAgLSBVKzAyREMgIMucICYjNzMyOyAgU21hbGwgVGlsZGVcbi8vICAtIFUrMDJERCAgy50gJiM3MzM7ICBEb3VibGUgQWN1dGUgQWNjZW50XG4vLyBMYXRpbiBFeHRlbmRlZCBBZGRpdGlvbmFsLCAxRTAw4oCTMUVGRlxuXG52YXIgZXh0ZW5kZWRXb3JkQ2hhcnMgPSAvXltBLVphLXpcXHhDMC1cXHUwMkM2XFx1MDJDOC1cXHUwMkQ3XFx1MDJERS1cXHUwMkZGXFx1MUUwMC1cXHUxRUZGXSskLztcbnZhciByZVdoaXRlc3BhY2UgPSAvXFxTLztcbnZhciB3b3JkRGlmZiA9IG5ldyBEaWZmKCk7XG5cbndvcmREaWZmLmVxdWFscyA9IGZ1bmN0aW9uIChsZWZ0LCByaWdodCkge1xuICBpZiAodGhpcy5vcHRpb25zLmlnbm9yZUNhc2UpIHtcbiAgICBsZWZ0ID0gbGVmdC50b0xvd2VyQ2FzZSgpO1xuICAgIHJpZ2h0ID0gcmlnaHQudG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIHJldHVybiBsZWZ0ID09PSByaWdodCB8fCB0aGlzLm9wdGlvbnMuaWdub3JlV2hpdGVzcGFjZSAmJiAhcmVXaGl0ZXNwYWNlLnRlc3QobGVmdCkgJiYgIXJlV2hpdGVzcGFjZS50ZXN0KHJpZ2h0KTtcbn07XG5cbndvcmREaWZmLnRva2VuaXplID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIC8vIEFsbCB3aGl0ZXNwYWNlIHN5bWJvbHMgZXhjZXB0IG5ld2xpbmUgZ3JvdXAgaW50byBvbmUgdG9rZW4sIGVhY2ggbmV3bGluZSAtIGluIHNlcGFyYXRlIHRva2VuXG4gIHZhciB0b2tlbnMgPSB2YWx1ZS5zcGxpdCgvKFteXFxTXFxyXFxuXSt8WygpW1xcXXt9J1wiXFxyXFxuXXxcXGIpLyk7IC8vIEpvaW4gdGhlIGJvdW5kYXJ5IHNwbGl0cyB0aGF0IHdlIGRvIG5vdCBjb25zaWRlciB0byBiZSBib3VuZGFyaWVzLiBUaGlzIGlzIHByaW1hcmlseSB0aGUgZXh0ZW5kZWQgTGF0aW4gY2hhcmFjdGVyIHNldC5cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRva2Vucy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAvLyBJZiB3ZSBoYXZlIGFuIGVtcHR5IHN0cmluZyBpbiB0aGUgbmV4dCBmaWVsZCBhbmQgd2UgaGF2ZSBvbmx5IHdvcmQgY2hhcnMgYmVmb3JlIGFuZCBhZnRlciwgbWVyZ2VcbiAgICBpZiAoIXRva2Vuc1tpICsgMV0gJiYgdG9rZW5zW2kgKyAyXSAmJiBleHRlbmRlZFdvcmRDaGFycy50ZXN0KHRva2Vuc1tpXSkgJiYgZXh0ZW5kZWRXb3JkQ2hhcnMudGVzdCh0b2tlbnNbaSArIDJdKSkge1xuICAgICAgdG9rZW5zW2ldICs9IHRva2Vuc1tpICsgMl07XG4gICAgICB0b2tlbnMuc3BsaWNlKGkgKyAxLCAyKTtcbiAgICAgIGktLTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdG9rZW5zO1xufTtcblxuZnVuY3Rpb24gZGlmZldvcmRzKG9sZFN0ciwgbmV3U3RyLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBnZW5lcmF0ZU9wdGlvbnMob3B0aW9ucywge1xuICAgIGlnbm9yZVdoaXRlc3BhY2U6IHRydWVcbiAgfSk7XG4gIHJldHVybiB3b3JkRGlmZi5kaWZmKG9sZFN0ciwgbmV3U3RyLCBvcHRpb25zKTtcbn1cbmZ1bmN0aW9uIGRpZmZXb3Jkc1dpdGhTcGFjZShvbGRTdHIsIG5ld1N0ciwgb3B0aW9ucykge1xuICByZXR1cm4gd29yZERpZmYuZGlmZihvbGRTdHIsIG5ld1N0ciwgb3B0aW9ucyk7XG59XG5cbnZhciBsaW5lRGlmZiA9IG5ldyBEaWZmKCk7XG5cbmxpbmVEaWZmLnRva2VuaXplID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHZhciByZXRMaW5lcyA9IFtdLFxuICAgICAgbGluZXNBbmROZXdsaW5lcyA9IHZhbHVlLnNwbGl0KC8oXFxufFxcclxcbikvKTsgLy8gSWdub3JlIHRoZSBmaW5hbCBlbXB0eSB0b2tlbiB0aGF0IG9jY3VycyBpZiB0aGUgc3RyaW5nIGVuZHMgd2l0aCBhIG5ldyBsaW5lXG5cbiAgaWYgKCFsaW5lc0FuZE5ld2xpbmVzW2xpbmVzQW5kTmV3bGluZXMubGVuZ3RoIC0gMV0pIHtcbiAgICBsaW5lc0FuZE5ld2xpbmVzLnBvcCgpO1xuICB9IC8vIE1lcmdlIHRoZSBjb250ZW50IGFuZCBsaW5lIHNlcGFyYXRvcnMgaW50byBzaW5nbGUgdG9rZW5zXG5cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpbmVzQW5kTmV3bGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbGluZSA9IGxpbmVzQW5kTmV3bGluZXNbaV07XG5cbiAgICBpZiAoaSAlIDIgJiYgIXRoaXMub3B0aW9ucy5uZXdsaW5lSXNUb2tlbikge1xuICAgICAgcmV0TGluZXNbcmV0TGluZXMubGVuZ3RoIC0gMV0gKz0gbGluZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5pZ25vcmVXaGl0ZXNwYWNlKSB7XG4gICAgICAgIGxpbmUgPSBsaW5lLnRyaW0oKTtcbiAgICAgIH1cblxuICAgICAgcmV0TGluZXMucHVzaChsaW5lKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmV0TGluZXM7XG59O1xuXG5mdW5jdGlvbiBkaWZmTGluZXMob2xkU3RyLCBuZXdTdHIsIGNhbGxiYWNrKSB7XG4gIHJldHVybiBsaW5lRGlmZi5kaWZmKG9sZFN0ciwgbmV3U3RyLCBjYWxsYmFjayk7XG59XG5mdW5jdGlvbiBkaWZmVHJpbW1lZExpbmVzKG9sZFN0ciwgbmV3U3RyLCBjYWxsYmFjaykge1xuICB2YXIgb3B0aW9ucyA9IGdlbmVyYXRlT3B0aW9ucyhjYWxsYmFjaywge1xuICAgIGlnbm9yZVdoaXRlc3BhY2U6IHRydWVcbiAgfSk7XG4gIHJldHVybiBsaW5lRGlmZi5kaWZmKG9sZFN0ciwgbmV3U3RyLCBvcHRpb25zKTtcbn1cblxudmFyIHNlbnRlbmNlRGlmZiA9IG5ldyBEaWZmKCk7XG5cbnNlbnRlbmNlRGlmZi50b2tlbml6ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUuc3BsaXQoLyhcXFMuKz9bLiE/XSkoPz1cXHMrfCQpLyk7XG59O1xuXG5mdW5jdGlvbiBkaWZmU2VudGVuY2VzKG9sZFN0ciwgbmV3U3RyLCBjYWxsYmFjaykge1xuICByZXR1cm4gc2VudGVuY2VEaWZmLmRpZmYob2xkU3RyLCBuZXdTdHIsIGNhbGxiYWNrKTtcbn1cblxudmFyIGNzc0RpZmYgPSBuZXcgRGlmZigpO1xuXG5jc3NEaWZmLnRva2VuaXplID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZS5zcGxpdCgvKFt7fTo7LF18XFxzKykvKTtcbn07XG5cbmZ1bmN0aW9uIGRpZmZDc3Mob2xkU3RyLCBuZXdTdHIsIGNhbGxiYWNrKSB7XG4gIHJldHVybiBjc3NEaWZmLmRpZmYob2xkU3RyLCBuZXdTdHIsIGNhbGxiYWNrKTtcbn1cblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHtcbiAgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiO1xuXG4gIGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikge1xuICAgIF90eXBlb2YgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iajtcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIF90eXBlb2YgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIF90eXBlb2Yob2JqKTtcbn1cblxuZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikge1xuICByZXR1cm4gX2FycmF5V2l0aG91dEhvbGVzKGFycikgfHwgX2l0ZXJhYmxlVG9BcnJheShhcnIpIHx8IF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShhcnIpIHx8IF9ub25JdGVyYWJsZVNwcmVhZCgpO1xufVxuXG5mdW5jdGlvbiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShhcnIpO1xufVxuXG5mdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5KGl0ZXIpIHtcbiAgaWYgKHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgJiYgU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChpdGVyKSkgcmV0dXJuIEFycmF5LmZyb20oaXRlcik7XG59XG5cbmZ1bmN0aW9uIF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvLCBtaW5MZW4pIHtcbiAgaWYgKCFvKSByZXR1cm47XG4gIGlmICh0eXBlb2YgbyA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7XG4gIHZhciBuID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pLnNsaWNlKDgsIC0xKTtcbiAgaWYgKG4gPT09IFwiT2JqZWN0XCIgJiYgby5jb25zdHJ1Y3RvcikgbiA9IG8uY29uc3RydWN0b3IubmFtZTtcbiAgaWYgKG4gPT09IFwiTWFwXCIgfHwgbiA9PT0gXCJTZXRcIikgcmV0dXJuIEFycmF5LmZyb20obyk7XG4gIGlmIChuID09PSBcIkFyZ3VtZW50c1wiIHx8IC9eKD86VWl8SSludCg/Ojh8MTZ8MzIpKD86Q2xhbXBlZCk/QXJyYXkkLy50ZXN0KG4pKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTtcbn1cblxuZnVuY3Rpb24gX2FycmF5TGlrZVRvQXJyYXkoYXJyLCBsZW4pIHtcbiAgaWYgKGxlbiA9PSBudWxsIHx8IGxlbiA+IGFyci5sZW5ndGgpIGxlbiA9IGFyci5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkobGVuKTsgaSA8IGxlbjsgaSsrKSBhcnIyW2ldID0gYXJyW2ldO1xuXG4gIHJldHVybiBhcnIyO1xufVxuXG5mdW5jdGlvbiBfbm9uSXRlcmFibGVTcHJlYWQoKSB7XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gc3ByZWFkIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpO1xufVxuXG52YXIgb2JqZWN0UHJvdG90eXBlVG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xudmFyIGpzb25EaWZmID0gbmV3IERpZmYoKTsgLy8gRGlzY3JpbWluYXRlIGJldHdlZW4gdHdvIGxpbmVzIG9mIHByZXR0eS1wcmludGVkLCBzZXJpYWxpemVkIEpTT04gd2hlcmUgb25lIG9mIHRoZW0gaGFzIGFcbi8vIGRhbmdsaW5nIGNvbW1hIGFuZCB0aGUgb3RoZXIgZG9lc24ndC4gVHVybnMgb3V0IGluY2x1ZGluZyB0aGUgZGFuZ2xpbmcgY29tbWEgeWllbGRzIHRoZSBuaWNlc3Qgb3V0cHV0OlxuXG5qc29uRGlmZi51c2VMb25nZXN0VG9rZW4gPSB0cnVlO1xuanNvbkRpZmYudG9rZW5pemUgPSBsaW5lRGlmZi50b2tlbml6ZTtcblxuanNvbkRpZmYuY2FzdElucHV0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHZhciBfdGhpcyRvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuICAgICAgdW5kZWZpbmVkUmVwbGFjZW1lbnQgPSBfdGhpcyRvcHRpb25zLnVuZGVmaW5lZFJlcGxhY2VtZW50LFxuICAgICAgX3RoaXMkb3B0aW9ucyRzdHJpbmdpID0gX3RoaXMkb3B0aW9ucy5zdHJpbmdpZnlSZXBsYWNlcixcbiAgICAgIHN0cmluZ2lmeVJlcGxhY2VyID0gX3RoaXMkb3B0aW9ucyRzdHJpbmdpID09PSB2b2lkIDAgPyBmdW5jdGlvbiAoaywgdikge1xuICAgIHJldHVybiB0eXBlb2YgdiA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWRSZXBsYWNlbWVudCA6IHY7XG4gIH0gOiBfdGhpcyRvcHRpb25zJHN0cmluZ2k7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnID8gdmFsdWUgOiBKU09OLnN0cmluZ2lmeShjYW5vbmljYWxpemUodmFsdWUsIG51bGwsIG51bGwsIHN0cmluZ2lmeVJlcGxhY2VyKSwgc3RyaW5naWZ5UmVwbGFjZXIsICcgICcpO1xufTtcblxuanNvbkRpZmYuZXF1YWxzID0gZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7XG4gIHJldHVybiBEaWZmLnByb3RvdHlwZS5lcXVhbHMuY2FsbChqc29uRGlmZiwgbGVmdC5yZXBsYWNlKC8sKFtcXHJcXG5dKS9nLCAnJDEnKSwgcmlnaHQucmVwbGFjZSgvLChbXFxyXFxuXSkvZywgJyQxJykpO1xufTtcblxuZnVuY3Rpb24gZGlmZkpzb24ob2xkT2JqLCBuZXdPYmosIG9wdGlvbnMpIHtcbiAgcmV0dXJuIGpzb25EaWZmLmRpZmYob2xkT2JqLCBuZXdPYmosIG9wdGlvbnMpO1xufSAvLyBUaGlzIGZ1bmN0aW9uIGhhbmRsZXMgdGhlIHByZXNlbmNlIG9mIGNpcmN1bGFyIHJlZmVyZW5jZXMgYnkgYmFpbGluZyBvdXQgd2hlbiBlbmNvdW50ZXJpbmcgYW5cbi8vIG9iamVjdCB0aGF0IGlzIGFscmVhZHkgb24gdGhlIFwic3RhY2tcIiBvZiBpdGVtcyBiZWluZyBwcm9jZXNzZWQuIEFjY2VwdHMgYW4gb3B0aW9uYWwgcmVwbGFjZXJcblxuZnVuY3Rpb24gY2Fub25pY2FsaXplKG9iaiwgc3RhY2ssIHJlcGxhY2VtZW50U3RhY2ssIHJlcGxhY2VyLCBrZXkpIHtcbiAgc3RhY2sgPSBzdGFjayB8fCBbXTtcbiAgcmVwbGFjZW1lbnRTdGFjayA9IHJlcGxhY2VtZW50U3RhY2sgfHwgW107XG5cbiAgaWYgKHJlcGxhY2VyKSB7XG4gICAgb2JqID0gcmVwbGFjZXIoa2V5LCBvYmopO1xuICB9XG5cbiAgdmFyIGk7XG5cbiAgZm9yIChpID0gMDsgaSA8IHN0YWNrLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgaWYgKHN0YWNrW2ldID09PSBvYmopIHtcbiAgICAgIHJldHVybiByZXBsYWNlbWVudFN0YWNrW2ldO1xuICAgIH1cbiAgfVxuXG4gIHZhciBjYW5vbmljYWxpemVkT2JqO1xuXG4gIGlmICgnW29iamVjdCBBcnJheV0nID09PSBvYmplY3RQcm90b3R5cGVUb1N0cmluZy5jYWxsKG9iaikpIHtcbiAgICBzdGFjay5wdXNoKG9iaik7XG4gICAgY2Fub25pY2FsaXplZE9iaiA9IG5ldyBBcnJheShvYmoubGVuZ3RoKTtcbiAgICByZXBsYWNlbWVudFN0YWNrLnB1c2goY2Fub25pY2FsaXplZE9iaik7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgb2JqLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBjYW5vbmljYWxpemVkT2JqW2ldID0gY2Fub25pY2FsaXplKG9ialtpXSwgc3RhY2ssIHJlcGxhY2VtZW50U3RhY2ssIHJlcGxhY2VyLCBrZXkpO1xuICAgIH1cblxuICAgIHN0YWNrLnBvcCgpO1xuICAgIHJlcGxhY2VtZW50U3RhY2sucG9wKCk7XG4gICAgcmV0dXJuIGNhbm9uaWNhbGl6ZWRPYmo7XG4gIH1cblxuICBpZiAob2JqICYmIG9iai50b0pTT04pIHtcbiAgICBvYmogPSBvYmoudG9KU09OKCk7XG4gIH1cblxuICBpZiAoX3R5cGVvZihvYmopID09PSAnb2JqZWN0JyAmJiBvYmogIT09IG51bGwpIHtcbiAgICBzdGFjay5wdXNoKG9iaik7XG4gICAgY2Fub25pY2FsaXplZE9iaiA9IHt9O1xuICAgIHJlcGxhY2VtZW50U3RhY2sucHVzaChjYW5vbmljYWxpemVkT2JqKTtcblxuICAgIHZhciBzb3J0ZWRLZXlzID0gW10sXG4gICAgICAgIF9rZXk7XG5cbiAgICBmb3IgKF9rZXkgaW4gb2JqKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShfa2V5KSkge1xuICAgICAgICBzb3J0ZWRLZXlzLnB1c2goX2tleSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc29ydGVkS2V5cy5zb3J0KCk7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgc29ydGVkS2V5cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgX2tleSA9IHNvcnRlZEtleXNbaV07XG4gICAgICBjYW5vbmljYWxpemVkT2JqW19rZXldID0gY2Fub25pY2FsaXplKG9ialtfa2V5XSwgc3RhY2ssIHJlcGxhY2VtZW50U3RhY2ssIHJlcGxhY2VyLCBfa2V5KTtcbiAgICB9XG5cbiAgICBzdGFjay5wb3AoKTtcbiAgICByZXBsYWNlbWVudFN0YWNrLnBvcCgpO1xuICB9IGVsc2Uge1xuICAgIGNhbm9uaWNhbGl6ZWRPYmogPSBvYmo7XG4gIH1cblxuICByZXR1cm4gY2Fub25pY2FsaXplZE9iajtcbn1cblxudmFyIGFycmF5RGlmZiA9IG5ldyBEaWZmKCk7XG5cbmFycmF5RGlmZi50b2tlbml6ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUuc2xpY2UoKTtcbn07XG5cbmFycmF5RGlmZi5qb2luID0gYXJyYXlEaWZmLnJlbW92ZUVtcHR5ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZTtcbn07XG5cbmZ1bmN0aW9uIGRpZmZBcnJheXMob2xkQXJyLCBuZXdBcnIsIGNhbGxiYWNrKSB7XG4gIHJldHVybiBhcnJheURpZmYuZGlmZihvbGRBcnIsIG5ld0FyciwgY2FsbGJhY2spO1xufVxuXG5mdW5jdGlvbiBwYXJzZVBhdGNoKHVuaURpZmYpIHtcbiAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICB2YXIgZGlmZnN0ciA9IHVuaURpZmYuc3BsaXQoL1xcclxcbnxbXFxuXFx2XFxmXFxyXFx4ODVdLyksXG4gICAgICBkZWxpbWl0ZXJzID0gdW5pRGlmZi5tYXRjaCgvXFxyXFxufFtcXG5cXHZcXGZcXHJcXHg4NV0vZykgfHwgW10sXG4gICAgICBsaXN0ID0gW10sXG4gICAgICBpID0gMDtcblxuICBmdW5jdGlvbiBwYXJzZUluZGV4KCkge1xuICAgIHZhciBpbmRleCA9IHt9O1xuICAgIGxpc3QucHVzaChpbmRleCk7IC8vIFBhcnNlIGRpZmYgbWV0YWRhdGFcblxuICAgIHdoaWxlIChpIDwgZGlmZnN0ci5sZW5ndGgpIHtcbiAgICAgIHZhciBsaW5lID0gZGlmZnN0cltpXTsgLy8gRmlsZSBoZWFkZXIgZm91bmQsIGVuZCBwYXJzaW5nIGRpZmYgbWV0YWRhdGFcblxuICAgICAgaWYgKC9eKFxcLVxcLVxcLXxcXCtcXCtcXCt8QEApXFxzLy50ZXN0KGxpbmUpKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfSAvLyBEaWZmIGluZGV4XG5cblxuICAgICAgdmFyIGhlYWRlciA9IC9eKD86SW5kZXg6fGRpZmYoPzogLXIgXFx3KykrKVxccysoLis/KVxccyokLy5leGVjKGxpbmUpO1xuXG4gICAgICBpZiAoaGVhZGVyKSB7XG4gICAgICAgIGluZGV4LmluZGV4ID0gaGVhZGVyWzFdO1xuICAgICAgfVxuXG4gICAgICBpKys7XG4gICAgfSAvLyBQYXJzZSBmaWxlIGhlYWRlcnMgaWYgdGhleSBhcmUgZGVmaW5lZC4gVW5pZmllZCBkaWZmIHJlcXVpcmVzIHRoZW0sIGJ1dFxuICAgIC8vIHRoZXJlJ3Mgbm8gdGVjaG5pY2FsIGlzc3VlcyB0byBoYXZlIGFuIGlzb2xhdGVkIGh1bmsgd2l0aG91dCBmaWxlIGhlYWRlclxuXG5cbiAgICBwYXJzZUZpbGVIZWFkZXIoaW5kZXgpO1xuICAgIHBhcnNlRmlsZUhlYWRlcihpbmRleCk7IC8vIFBhcnNlIGh1bmtzXG5cbiAgICBpbmRleC5odW5rcyA9IFtdO1xuXG4gICAgd2hpbGUgKGkgPCBkaWZmc3RyLmxlbmd0aCkge1xuICAgICAgdmFyIF9saW5lID0gZGlmZnN0cltpXTtcblxuICAgICAgaWYgKC9eKEluZGV4OnxkaWZmfFxcLVxcLVxcLXxcXCtcXCtcXCspXFxzLy50ZXN0KF9saW5lKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSBpZiAoL15AQC8udGVzdChfbGluZSkpIHtcbiAgICAgICAgaW5kZXguaHVua3MucHVzaChwYXJzZUh1bmsoKSk7XG4gICAgICB9IGVsc2UgaWYgKF9saW5lICYmIG9wdGlvbnMuc3RyaWN0KSB7XG4gICAgICAgIC8vIElnbm9yZSB1bmV4cGVjdGVkIGNvbnRlbnQgdW5sZXNzIGluIHN0cmljdCBtb2RlXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBsaW5lICcgKyAoaSArIDEpICsgJyAnICsgSlNPTi5zdHJpbmdpZnkoX2xpbmUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGkrKztcbiAgICAgIH1cbiAgICB9XG4gIH0gLy8gUGFyc2VzIHRoZSAtLS0gYW5kICsrKyBoZWFkZXJzLCBpZiBub25lIGFyZSBmb3VuZCwgbm8gbGluZXNcbiAgLy8gYXJlIGNvbnN1bWVkLlxuXG5cbiAgZnVuY3Rpb24gcGFyc2VGaWxlSGVhZGVyKGluZGV4KSB7XG4gICAgdmFyIGZpbGVIZWFkZXIgPSAvXigtLS18XFwrXFwrXFwrKVxccysoLiopJC8uZXhlYyhkaWZmc3RyW2ldKTtcblxuICAgIGlmIChmaWxlSGVhZGVyKSB7XG4gICAgICB2YXIga2V5UHJlZml4ID0gZmlsZUhlYWRlclsxXSA9PT0gJy0tLScgPyAnb2xkJyA6ICduZXcnO1xuICAgICAgdmFyIGRhdGEgPSBmaWxlSGVhZGVyWzJdLnNwbGl0KCdcXHQnLCAyKTtcbiAgICAgIHZhciBmaWxlTmFtZSA9IGRhdGFbMF0ucmVwbGFjZSgvXFxcXFxcXFwvZywgJ1xcXFwnKTtcblxuICAgICAgaWYgKC9eXCIuKlwiJC8udGVzdChmaWxlTmFtZSkpIHtcbiAgICAgICAgZmlsZU5hbWUgPSBmaWxlTmFtZS5zdWJzdHIoMSwgZmlsZU5hbWUubGVuZ3RoIC0gMik7XG4gICAgICB9XG5cbiAgICAgIGluZGV4W2tleVByZWZpeCArICdGaWxlTmFtZSddID0gZmlsZU5hbWU7XG4gICAgICBpbmRleFtrZXlQcmVmaXggKyAnSGVhZGVyJ10gPSAoZGF0YVsxXSB8fCAnJykudHJpbSgpO1xuICAgICAgaSsrO1xuICAgIH1cbiAgfSAvLyBQYXJzZXMgYSBodW5rXG4gIC8vIFRoaXMgYXNzdW1lcyB0aGF0IHdlIGFyZSBhdCB0aGUgc3RhcnQgb2YgYSBodW5rLlxuXG5cbiAgZnVuY3Rpb24gcGFyc2VIdW5rKCkge1xuICAgIHZhciBjaHVua0hlYWRlckluZGV4ID0gaSxcbiAgICAgICAgY2h1bmtIZWFkZXJMaW5lID0gZGlmZnN0cltpKytdLFxuICAgICAgICBjaHVua0hlYWRlciA9IGNodW5rSGVhZGVyTGluZS5zcGxpdCgvQEAgLShcXGQrKSg/OiwoXFxkKykpPyBcXCsoXFxkKykoPzosKFxcZCspKT8gQEAvKTtcbiAgICB2YXIgaHVuayA9IHtcbiAgICAgIG9sZFN0YXJ0OiArY2h1bmtIZWFkZXJbMV0sXG4gICAgICBvbGRMaW5lczogdHlwZW9mIGNodW5rSGVhZGVyWzJdID09PSAndW5kZWZpbmVkJyA/IDEgOiArY2h1bmtIZWFkZXJbMl0sXG4gICAgICBuZXdTdGFydDogK2NodW5rSGVhZGVyWzNdLFxuICAgICAgbmV3TGluZXM6IHR5cGVvZiBjaHVua0hlYWRlcls0XSA9PT0gJ3VuZGVmaW5lZCcgPyAxIDogK2NodW5rSGVhZGVyWzRdLFxuICAgICAgbGluZXM6IFtdLFxuICAgICAgbGluZWRlbGltaXRlcnM6IFtdXG4gICAgfTsgLy8gVW5pZmllZCBEaWZmIEZvcm1hdCBxdWlyazogSWYgdGhlIGNodW5rIHNpemUgaXMgMCxcbiAgICAvLyB0aGUgZmlyc3QgbnVtYmVyIGlzIG9uZSBsb3dlciB0aGFuIG9uZSB3b3VsZCBleHBlY3QuXG4gICAgLy8gaHR0cHM6Ly93d3cuYXJ0aW1hLmNvbS93ZWJsb2dzL3ZpZXdwb3N0LmpzcD90aHJlYWQ9MTY0MjkzXG5cbiAgICBpZiAoaHVuay5vbGRMaW5lcyA9PT0gMCkge1xuICAgICAgaHVuay5vbGRTdGFydCArPSAxO1xuICAgIH1cblxuICAgIGlmIChodW5rLm5ld0xpbmVzID09PSAwKSB7XG4gICAgICBodW5rLm5ld1N0YXJ0ICs9IDE7XG4gICAgfVxuXG4gICAgdmFyIGFkZENvdW50ID0gMCxcbiAgICAgICAgcmVtb3ZlQ291bnQgPSAwO1xuXG4gICAgZm9yICg7IGkgPCBkaWZmc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvLyBMaW5lcyBzdGFydGluZyB3aXRoICctLS0nIGNvdWxkIGJlIG1pc3Rha2VuIGZvciB0aGUgXCJyZW1vdmUgbGluZVwiIG9wZXJhdGlvblxuICAgICAgLy8gQnV0IHRoZXkgY291bGQgYmUgdGhlIGhlYWRlciBmb3IgdGhlIG5leHQgZmlsZS4gVGhlcmVmb3JlIHBydW5lIHN1Y2ggY2FzZXMgb3V0LlxuICAgICAgaWYgKGRpZmZzdHJbaV0uaW5kZXhPZignLS0tICcpID09PSAwICYmIGkgKyAyIDwgZGlmZnN0ci5sZW5ndGggJiYgZGlmZnN0cltpICsgMV0uaW5kZXhPZignKysrICcpID09PSAwICYmIGRpZmZzdHJbaSArIDJdLmluZGV4T2YoJ0BAJykgPT09IDApIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIHZhciBvcGVyYXRpb24gPSBkaWZmc3RyW2ldLmxlbmd0aCA9PSAwICYmIGkgIT0gZGlmZnN0ci5sZW5ndGggLSAxID8gJyAnIDogZGlmZnN0cltpXVswXTtcblxuICAgICAgaWYgKG9wZXJhdGlvbiA9PT0gJysnIHx8IG9wZXJhdGlvbiA9PT0gJy0nIHx8IG9wZXJhdGlvbiA9PT0gJyAnIHx8IG9wZXJhdGlvbiA9PT0gJ1xcXFwnKSB7XG4gICAgICAgIGh1bmsubGluZXMucHVzaChkaWZmc3RyW2ldKTtcbiAgICAgICAgaHVuay5saW5lZGVsaW1pdGVycy5wdXNoKGRlbGltaXRlcnNbaV0gfHwgJ1xcbicpO1xuXG4gICAgICAgIGlmIChvcGVyYXRpb24gPT09ICcrJykge1xuICAgICAgICAgIGFkZENvdW50Kys7XG4gICAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSAnLScpIHtcbiAgICAgICAgICByZW1vdmVDb3VudCsrO1xuICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gJyAnKSB7XG4gICAgICAgICAgYWRkQ291bnQrKztcbiAgICAgICAgICByZW1vdmVDb3VudCsrO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IC8vIEhhbmRsZSB0aGUgZW1wdHkgYmxvY2sgY291bnQgY2FzZVxuXG5cbiAgICBpZiAoIWFkZENvdW50ICYmIGh1bmsubmV3TGluZXMgPT09IDEpIHtcbiAgICAgIGh1bmsubmV3TGluZXMgPSAwO1xuICAgIH1cblxuICAgIGlmICghcmVtb3ZlQ291bnQgJiYgaHVuay5vbGRMaW5lcyA9PT0gMSkge1xuICAgICAgaHVuay5vbGRMaW5lcyA9IDA7XG4gICAgfSAvLyBQZXJmb3JtIG9wdGlvbmFsIHNhbml0eSBjaGVja2luZ1xuXG5cbiAgICBpZiAob3B0aW9ucy5zdHJpY3QpIHtcbiAgICAgIGlmIChhZGRDb3VudCAhPT0gaHVuay5uZXdMaW5lcykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FkZGVkIGxpbmUgY291bnQgZGlkIG5vdCBtYXRjaCBmb3IgaHVuayBhdCBsaW5lICcgKyAoY2h1bmtIZWFkZXJJbmRleCArIDEpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlbW92ZUNvdW50ICE9PSBodW5rLm9sZExpbmVzKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignUmVtb3ZlZCBsaW5lIGNvdW50IGRpZCBub3QgbWF0Y2ggZm9yIGh1bmsgYXQgbGluZSAnICsgKGNodW5rSGVhZGVySW5kZXggKyAxKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGh1bms7XG4gIH1cblxuICB3aGlsZSAoaSA8IGRpZmZzdHIubGVuZ3RoKSB7XG4gICAgcGFyc2VJbmRleCgpO1xuICB9XG5cbiAgcmV0dXJuIGxpc3Q7XG59XG5cbi8vIEl0ZXJhdG9yIHRoYXQgdHJhdmVyc2VzIGluIHRoZSByYW5nZSBvZiBbbWluLCBtYXhdLCBzdGVwcGluZ1xuLy8gYnkgZGlzdGFuY2UgZnJvbSBhIGdpdmVuIHN0YXJ0IHBvc2l0aW9uLiBJLmUuIGZvciBbMCwgNF0sIHdpdGhcbi8vIHN0YXJ0IG9mIDIsIHRoaXMgd2lsbCBpdGVyYXRlIDIsIDMsIDEsIDQsIDAuXG5mdW5jdGlvbiBkaXN0YW5jZUl0ZXJhdG9yIChzdGFydCwgbWluTGluZSwgbWF4TGluZSkge1xuICB2YXIgd2FudEZvcndhcmQgPSB0cnVlLFxuICAgICAgYmFja3dhcmRFeGhhdXN0ZWQgPSBmYWxzZSxcbiAgICAgIGZvcndhcmRFeGhhdXN0ZWQgPSBmYWxzZSxcbiAgICAgIGxvY2FsT2Zmc2V0ID0gMTtcbiAgcmV0dXJuIGZ1bmN0aW9uIGl0ZXJhdG9yKCkge1xuICAgIGlmICh3YW50Rm9yd2FyZCAmJiAhZm9yd2FyZEV4aGF1c3RlZCkge1xuICAgICAgaWYgKGJhY2t3YXJkRXhoYXVzdGVkKSB7XG4gICAgICAgIGxvY2FsT2Zmc2V0Kys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3YW50Rm9yd2FyZCA9IGZhbHNlO1xuICAgICAgfSAvLyBDaGVjayBpZiB0cnlpbmcgdG8gZml0IGJleW9uZCB0ZXh0IGxlbmd0aCwgYW5kIGlmIG5vdCwgY2hlY2sgaXQgZml0c1xuICAgICAgLy8gYWZ0ZXIgb2Zmc2V0IGxvY2F0aW9uIChvciBkZXNpcmVkIGxvY2F0aW9uIG9uIGZpcnN0IGl0ZXJhdGlvbilcblxuXG4gICAgICBpZiAoc3RhcnQgKyBsb2NhbE9mZnNldCA8PSBtYXhMaW5lKSB7XG4gICAgICAgIHJldHVybiBsb2NhbE9mZnNldDtcbiAgICAgIH1cblxuICAgICAgZm9yd2FyZEV4aGF1c3RlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCFiYWNrd2FyZEV4aGF1c3RlZCkge1xuICAgICAgaWYgKCFmb3J3YXJkRXhoYXVzdGVkKSB7XG4gICAgICAgIHdhbnRGb3J3YXJkID0gdHJ1ZTtcbiAgICAgIH0gLy8gQ2hlY2sgaWYgdHJ5aW5nIHRvIGZpdCBiZWZvcmUgdGV4dCBiZWdpbm5pbmcsIGFuZCBpZiBub3QsIGNoZWNrIGl0IGZpdHNcbiAgICAgIC8vIGJlZm9yZSBvZmZzZXQgbG9jYXRpb25cblxuXG4gICAgICBpZiAobWluTGluZSA8PSBzdGFydCAtIGxvY2FsT2Zmc2V0KSB7XG4gICAgICAgIHJldHVybiAtbG9jYWxPZmZzZXQrKztcbiAgICAgIH1cblxuICAgICAgYmFja3dhcmRFeGhhdXN0ZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yKCk7XG4gICAgfSAvLyBXZSB0cmllZCB0byBmaXQgaHVuayBiZWZvcmUgdGV4dCBiZWdpbm5pbmcgYW5kIGJleW9uZCB0ZXh0IGxlbmd0aCwgdGhlblxuICAgIC8vIGh1bmsgY2FuJ3QgZml0IG9uIHRoZSB0ZXh0LiBSZXR1cm4gdW5kZWZpbmVkXG5cbiAgfTtcbn1cblxuZnVuY3Rpb24gYXBwbHlQYXRjaChzb3VyY2UsIHVuaURpZmYpIHtcbiAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHt9O1xuXG4gIGlmICh0eXBlb2YgdW5pRGlmZiA9PT0gJ3N0cmluZycpIHtcbiAgICB1bmlEaWZmID0gcGFyc2VQYXRjaCh1bmlEaWZmKTtcbiAgfVxuXG4gIGlmIChBcnJheS5pc0FycmF5KHVuaURpZmYpKSB7XG4gICAgaWYgKHVuaURpZmYubGVuZ3RoID4gMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdhcHBseVBhdGNoIG9ubHkgd29ya3Mgd2l0aCBhIHNpbmdsZSBpbnB1dC4nKTtcbiAgICB9XG5cbiAgICB1bmlEaWZmID0gdW5pRGlmZlswXTtcbiAgfSAvLyBBcHBseSB0aGUgZGlmZiB0byB0aGUgaW5wdXRcblxuXG4gIHZhciBsaW5lcyA9IHNvdXJjZS5zcGxpdCgvXFxyXFxufFtcXG5cXHZcXGZcXHJcXHg4NV0vKSxcbiAgICAgIGRlbGltaXRlcnMgPSBzb3VyY2UubWF0Y2goL1xcclxcbnxbXFxuXFx2XFxmXFxyXFx4ODVdL2cpIHx8IFtdLFxuICAgICAgaHVua3MgPSB1bmlEaWZmLmh1bmtzLFxuICAgICAgY29tcGFyZUxpbmUgPSBvcHRpb25zLmNvbXBhcmVMaW5lIHx8IGZ1bmN0aW9uIChsaW5lTnVtYmVyLCBsaW5lLCBvcGVyYXRpb24sIHBhdGNoQ29udGVudCkge1xuICAgIHJldHVybiBsaW5lID09PSBwYXRjaENvbnRlbnQ7XG4gIH0sXG4gICAgICBlcnJvckNvdW50ID0gMCxcbiAgICAgIGZ1enpGYWN0b3IgPSBvcHRpb25zLmZ1enpGYWN0b3IgfHwgMCxcbiAgICAgIG1pbkxpbmUgPSAwLFxuICAgICAgb2Zmc2V0ID0gMCxcbiAgICAgIHJlbW92ZUVPRk5MLFxuICAgICAgYWRkRU9GTkw7XG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGh1bmsgZXhhY3RseSBmaXRzIG9uIHRoZSBwcm92aWRlZCBsb2NhdGlvblxuICAgKi9cblxuXG4gIGZ1bmN0aW9uIGh1bmtGaXRzKGh1bmssIHRvUG9zKSB7XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBodW5rLmxpbmVzLmxlbmd0aDsgaisrKSB7XG4gICAgICB2YXIgbGluZSA9IGh1bmsubGluZXNbal0sXG4gICAgICAgICAgb3BlcmF0aW9uID0gbGluZS5sZW5ndGggPiAwID8gbGluZVswXSA6ICcgJyxcbiAgICAgICAgICBjb250ZW50ID0gbGluZS5sZW5ndGggPiAwID8gbGluZS5zdWJzdHIoMSkgOiBsaW5lO1xuXG4gICAgICBpZiAob3BlcmF0aW9uID09PSAnICcgfHwgb3BlcmF0aW9uID09PSAnLScpIHtcbiAgICAgICAgLy8gQ29udGV4dCBzYW5pdHkgY2hlY2tcbiAgICAgICAgaWYgKCFjb21wYXJlTGluZSh0b1BvcyArIDEsIGxpbmVzW3RvUG9zXSwgb3BlcmF0aW9uLCBjb250ZW50KSkge1xuICAgICAgICAgIGVycm9yQ291bnQrKztcblxuICAgICAgICAgIGlmIChlcnJvckNvdW50ID4gZnV6ekZhY3Rvcikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRvUG9zKys7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH0gLy8gU2VhcmNoIGJlc3QgZml0IG9mZnNldHMgZm9yIGVhY2ggaHVuayBiYXNlZCBvbiB0aGUgcHJldmlvdXMgb25lc1xuXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBodW5rcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBodW5rID0gaHVua3NbaV0sXG4gICAgICAgIG1heExpbmUgPSBsaW5lcy5sZW5ndGggLSBodW5rLm9sZExpbmVzLFxuICAgICAgICBsb2NhbE9mZnNldCA9IDAsXG4gICAgICAgIHRvUG9zID0gb2Zmc2V0ICsgaHVuay5vbGRTdGFydCAtIDE7XG4gICAgdmFyIGl0ZXJhdG9yID0gZGlzdGFuY2VJdGVyYXRvcih0b1BvcywgbWluTGluZSwgbWF4TGluZSk7XG5cbiAgICBmb3IgKDsgbG9jYWxPZmZzZXQgIT09IHVuZGVmaW5lZDsgbG9jYWxPZmZzZXQgPSBpdGVyYXRvcigpKSB7XG4gICAgICBpZiAoaHVua0ZpdHMoaHVuaywgdG9Qb3MgKyBsb2NhbE9mZnNldCkpIHtcbiAgICAgICAgaHVuay5vZmZzZXQgPSBvZmZzZXQgKz0gbG9jYWxPZmZzZXQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChsb2NhbE9mZnNldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSAvLyBTZXQgbG93ZXIgdGV4dCBsaW1pdCB0byBlbmQgb2YgdGhlIGN1cnJlbnQgaHVuaywgc28gbmV4dCBvbmVzIGRvbid0IHRyeVxuICAgIC8vIHRvIGZpdCBvdmVyIGFscmVhZHkgcGF0Y2hlZCB0ZXh0XG5cblxuICAgIG1pbkxpbmUgPSBodW5rLm9mZnNldCArIGh1bmsub2xkU3RhcnQgKyBodW5rLm9sZExpbmVzO1xuICB9IC8vIEFwcGx5IHBhdGNoIGh1bmtzXG5cblxuICB2YXIgZGlmZk9mZnNldCA9IDA7XG5cbiAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGh1bmtzLmxlbmd0aDsgX2krKykge1xuICAgIHZhciBfaHVuayA9IGh1bmtzW19pXSxcbiAgICAgICAgX3RvUG9zID0gX2h1bmsub2xkU3RhcnQgKyBfaHVuay5vZmZzZXQgKyBkaWZmT2Zmc2V0IC0gMTtcblxuICAgIGRpZmZPZmZzZXQgKz0gX2h1bmsubmV3TGluZXMgLSBfaHVuay5vbGRMaW5lcztcblxuICAgIGZvciAodmFyIGogPSAwOyBqIDwgX2h1bmsubGluZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgIHZhciBsaW5lID0gX2h1bmsubGluZXNbal0sXG4gICAgICAgICAgb3BlcmF0aW9uID0gbGluZS5sZW5ndGggPiAwID8gbGluZVswXSA6ICcgJyxcbiAgICAgICAgICBjb250ZW50ID0gbGluZS5sZW5ndGggPiAwID8gbGluZS5zdWJzdHIoMSkgOiBsaW5lLFxuICAgICAgICAgIGRlbGltaXRlciA9IF9odW5rLmxpbmVkZWxpbWl0ZXJzW2pdO1xuXG4gICAgICBpZiAob3BlcmF0aW9uID09PSAnICcpIHtcbiAgICAgICAgX3RvUG9zKys7XG4gICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gJy0nKSB7XG4gICAgICAgIGxpbmVzLnNwbGljZShfdG9Qb3MsIDEpO1xuICAgICAgICBkZWxpbWl0ZXJzLnNwbGljZShfdG9Qb3MsIDEpO1xuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09ICcrJykge1xuICAgICAgICBsaW5lcy5zcGxpY2UoX3RvUG9zLCAwLCBjb250ZW50KTtcbiAgICAgICAgZGVsaW1pdGVycy5zcGxpY2UoX3RvUG9zLCAwLCBkZWxpbWl0ZXIpO1xuICAgICAgICBfdG9Qb3MrKztcbiAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSAnXFxcXCcpIHtcbiAgICAgICAgdmFyIHByZXZpb3VzT3BlcmF0aW9uID0gX2h1bmsubGluZXNbaiAtIDFdID8gX2h1bmsubGluZXNbaiAtIDFdWzBdIDogbnVsbDtcblxuICAgICAgICBpZiAocHJldmlvdXNPcGVyYXRpb24gPT09ICcrJykge1xuICAgICAgICAgIHJlbW92ZUVPRk5MID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChwcmV2aW91c09wZXJhdGlvbiA9PT0gJy0nKSB7XG4gICAgICAgICAgYWRkRU9GTkwgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IC8vIEhhbmRsZSBFT0ZOTCBpbnNlcnRpb24vcmVtb3ZhbFxuXG5cbiAgaWYgKHJlbW92ZUVPRk5MKSB7XG4gICAgd2hpbGUgKCFsaW5lc1tsaW5lcy5sZW5ndGggLSAxXSkge1xuICAgICAgbGluZXMucG9wKCk7XG4gICAgICBkZWxpbWl0ZXJzLnBvcCgpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChhZGRFT0ZOTCkge1xuICAgIGxpbmVzLnB1c2goJycpO1xuICAgIGRlbGltaXRlcnMucHVzaCgnXFxuJyk7XG4gIH1cblxuICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbGluZXMubGVuZ3RoIC0gMTsgX2srKykge1xuICAgIGxpbmVzW19rXSA9IGxpbmVzW19rXSArIGRlbGltaXRlcnNbX2tdO1xuICB9XG5cbiAgcmV0dXJuIGxpbmVzLmpvaW4oJycpO1xufSAvLyBXcmFwcGVyIHRoYXQgc3VwcG9ydHMgbXVsdGlwbGUgZmlsZSBwYXRjaGVzIHZpYSBjYWxsYmFja3MuXG5cbmZ1bmN0aW9uIGFwcGx5UGF0Y2hlcyh1bmlEaWZmLCBvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgdW5pRGlmZiA9PT0gJ3N0cmluZycpIHtcbiAgICB1bmlEaWZmID0gcGFyc2VQYXRjaCh1bmlEaWZmKTtcbiAgfVxuXG4gIHZhciBjdXJyZW50SW5kZXggPSAwO1xuXG4gIGZ1bmN0aW9uIHByb2Nlc3NJbmRleCgpIHtcbiAgICB2YXIgaW5kZXggPSB1bmlEaWZmW2N1cnJlbnRJbmRleCsrXTtcblxuICAgIGlmICghaW5kZXgpIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmNvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgb3B0aW9ucy5sb2FkRmlsZShpbmRleCwgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5jb21wbGV0ZShlcnIpO1xuICAgICAgfVxuXG4gICAgICB2YXIgdXBkYXRlZENvbnRlbnQgPSBhcHBseVBhdGNoKGRhdGEsIGluZGV4LCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMucGF0Y2hlZChpbmRleCwgdXBkYXRlZENvbnRlbnQsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJldHVybiBvcHRpb25zLmNvbXBsZXRlKGVycik7XG4gICAgICAgIH1cblxuICAgICAgICBwcm9jZXNzSW5kZXgoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJvY2Vzc0luZGV4KCk7XG59XG5cbmZ1bmN0aW9uIHN0cnVjdHVyZWRQYXRjaChvbGRGaWxlTmFtZSwgbmV3RmlsZU5hbWUsIG9sZFN0ciwgbmV3U3RyLCBvbGRIZWFkZXIsIG5ld0hlYWRlciwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cblxuICBpZiAodHlwZW9mIG9wdGlvbnMuY29udGV4dCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBvcHRpb25zLmNvbnRleHQgPSA0O1xuICB9XG5cbiAgdmFyIGRpZmYgPSBkaWZmTGluZXMob2xkU3RyLCBuZXdTdHIsIG9wdGlvbnMpO1xuICBkaWZmLnB1c2goe1xuICAgIHZhbHVlOiAnJyxcbiAgICBsaW5lczogW11cbiAgfSk7IC8vIEFwcGVuZCBhbiBlbXB0eSB2YWx1ZSB0byBtYWtlIGNsZWFudXAgZWFzaWVyXG5cbiAgZnVuY3Rpb24gY29udGV4dExpbmVzKGxpbmVzKSB7XG4gICAgcmV0dXJuIGxpbmVzLm1hcChmdW5jdGlvbiAoZW50cnkpIHtcbiAgICAgIHJldHVybiAnICcgKyBlbnRyeTtcbiAgICB9KTtcbiAgfVxuXG4gIHZhciBodW5rcyA9IFtdO1xuICB2YXIgb2xkUmFuZ2VTdGFydCA9IDAsXG4gICAgICBuZXdSYW5nZVN0YXJ0ID0gMCxcbiAgICAgIGN1clJhbmdlID0gW10sXG4gICAgICBvbGRMaW5lID0gMSxcbiAgICAgIG5ld0xpbmUgPSAxO1xuXG4gIHZhciBfbG9vcCA9IGZ1bmN0aW9uIF9sb29wKGkpIHtcbiAgICB2YXIgY3VycmVudCA9IGRpZmZbaV0sXG4gICAgICAgIGxpbmVzID0gY3VycmVudC5saW5lcyB8fCBjdXJyZW50LnZhbHVlLnJlcGxhY2UoL1xcbiQvLCAnJykuc3BsaXQoJ1xcbicpO1xuICAgIGN1cnJlbnQubGluZXMgPSBsaW5lcztcblxuICAgIGlmIChjdXJyZW50LmFkZGVkIHx8IGN1cnJlbnQucmVtb3ZlZCkge1xuICAgICAgdmFyIF9jdXJSYW5nZTtcblxuICAgICAgLy8gSWYgd2UgaGF2ZSBwcmV2aW91cyBjb250ZXh0LCBzdGFydCB3aXRoIHRoYXRcbiAgICAgIGlmICghb2xkUmFuZ2VTdGFydCkge1xuICAgICAgICB2YXIgcHJldiA9IGRpZmZbaSAtIDFdO1xuICAgICAgICBvbGRSYW5nZVN0YXJ0ID0gb2xkTGluZTtcbiAgICAgICAgbmV3UmFuZ2VTdGFydCA9IG5ld0xpbmU7XG5cbiAgICAgICAgaWYgKHByZXYpIHtcbiAgICAgICAgICBjdXJSYW5nZSA9IG9wdGlvbnMuY29udGV4dCA+IDAgPyBjb250ZXh0TGluZXMocHJldi5saW5lcy5zbGljZSgtb3B0aW9ucy5jb250ZXh0KSkgOiBbXTtcbiAgICAgICAgICBvbGRSYW5nZVN0YXJ0IC09IGN1clJhbmdlLmxlbmd0aDtcbiAgICAgICAgICBuZXdSYW5nZVN0YXJ0IC09IGN1clJhbmdlLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgfSAvLyBPdXRwdXQgb3VyIGNoYW5nZXNcblxuXG4gICAgICAoX2N1clJhbmdlID0gY3VyUmFuZ2UpLnB1c2guYXBwbHkoX2N1clJhbmdlLCBfdG9Db25zdW1hYmxlQXJyYXkobGluZXMubWFwKGZ1bmN0aW9uIChlbnRyeSkge1xuICAgICAgICByZXR1cm4gKGN1cnJlbnQuYWRkZWQgPyAnKycgOiAnLScpICsgZW50cnk7XG4gICAgICB9KSkpOyAvLyBUcmFjayB0aGUgdXBkYXRlZCBmaWxlIHBvc2l0aW9uXG5cblxuICAgICAgaWYgKGN1cnJlbnQuYWRkZWQpIHtcbiAgICAgICAgbmV3TGluZSArPSBsaW5lcy5sZW5ndGg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvbGRMaW5lICs9IGxpbmVzLmxlbmd0aDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWRlbnRpY2FsIGNvbnRleHQgbGluZXMuIFRyYWNrIGxpbmUgY2hhbmdlc1xuICAgICAgaWYgKG9sZFJhbmdlU3RhcnQpIHtcbiAgICAgICAgLy8gQ2xvc2Ugb3V0IGFueSBjaGFuZ2VzIHRoYXQgaGF2ZSBiZWVuIG91dHB1dCAob3Igam9pbiBvdmVybGFwcGluZylcbiAgICAgICAgaWYgKGxpbmVzLmxlbmd0aCA8PSBvcHRpb25zLmNvbnRleHQgKiAyICYmIGkgPCBkaWZmLmxlbmd0aCAtIDIpIHtcbiAgICAgICAgICB2YXIgX2N1clJhbmdlMjtcblxuICAgICAgICAgIC8vIE92ZXJsYXBwaW5nXG4gICAgICAgICAgKF9jdXJSYW5nZTIgPSBjdXJSYW5nZSkucHVzaC5hcHBseShfY3VyUmFuZ2UyLCBfdG9Db25zdW1hYmxlQXJyYXkoY29udGV4dExpbmVzKGxpbmVzKSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBfY3VyUmFuZ2UzO1xuXG4gICAgICAgICAgLy8gZW5kIHRoZSByYW5nZSBhbmQgb3V0cHV0XG4gICAgICAgICAgdmFyIGNvbnRleHRTaXplID0gTWF0aC5taW4obGluZXMubGVuZ3RoLCBvcHRpb25zLmNvbnRleHQpO1xuXG4gICAgICAgICAgKF9jdXJSYW5nZTMgPSBjdXJSYW5nZSkucHVzaC5hcHBseShfY3VyUmFuZ2UzLCBfdG9Db25zdW1hYmxlQXJyYXkoY29udGV4dExpbmVzKGxpbmVzLnNsaWNlKDAsIGNvbnRleHRTaXplKSkpKTtcblxuICAgICAgICAgIHZhciBodW5rID0ge1xuICAgICAgICAgICAgb2xkU3RhcnQ6IG9sZFJhbmdlU3RhcnQsXG4gICAgICAgICAgICBvbGRMaW5lczogb2xkTGluZSAtIG9sZFJhbmdlU3RhcnQgKyBjb250ZXh0U2l6ZSxcbiAgICAgICAgICAgIG5ld1N0YXJ0OiBuZXdSYW5nZVN0YXJ0LFxuICAgICAgICAgICAgbmV3TGluZXM6IG5ld0xpbmUgLSBuZXdSYW5nZVN0YXJ0ICsgY29udGV4dFNpemUsXG4gICAgICAgICAgICBsaW5lczogY3VyUmFuZ2VcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgaWYgKGkgPj0gZGlmZi5sZW5ndGggLSAyICYmIGxpbmVzLmxlbmd0aCA8PSBvcHRpb25zLmNvbnRleHQpIHtcbiAgICAgICAgICAgIC8vIEVPRiBpcyBpbnNpZGUgdGhpcyBodW5rXG4gICAgICAgICAgICB2YXIgb2xkRU9GTmV3bGluZSA9IC9cXG4kLy50ZXN0KG9sZFN0cik7XG4gICAgICAgICAgICB2YXIgbmV3RU9GTmV3bGluZSA9IC9cXG4kLy50ZXN0KG5ld1N0cik7XG4gICAgICAgICAgICB2YXIgbm9ObEJlZm9yZUFkZHMgPSBsaW5lcy5sZW5ndGggPT0gMCAmJiBjdXJSYW5nZS5sZW5ndGggPiBodW5rLm9sZExpbmVzO1xuXG4gICAgICAgICAgICBpZiAoIW9sZEVPRk5ld2xpbmUgJiYgbm9ObEJlZm9yZUFkZHMgJiYgb2xkU3RyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgLy8gc3BlY2lhbCBjYXNlOiBvbGQgaGFzIG5vIGVvbCBhbmQgbm8gdHJhaWxpbmcgY29udGV4dDsgbm8tbmwgY2FuIGVuZCB1cCBiZWZvcmUgYWRkc1xuICAgICAgICAgICAgICAvLyBob3dldmVyLCBpZiB0aGUgb2xkIGZpbGUgaXMgZW1wdHksIGRvIG5vdCBvdXRwdXQgdGhlIG5vLW5sIGxpbmVcbiAgICAgICAgICAgICAgY3VyUmFuZ2Uuc3BsaWNlKGh1bmsub2xkTGluZXMsIDAsICdcXFxcIE5vIG5ld2xpbmUgYXQgZW5kIG9mIGZpbGUnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFvbGRFT0ZOZXdsaW5lICYmICFub05sQmVmb3JlQWRkcyB8fCAhbmV3RU9GTmV3bGluZSkge1xuICAgICAgICAgICAgICBjdXJSYW5nZS5wdXNoKCdcXFxcIE5vIG5ld2xpbmUgYXQgZW5kIG9mIGZpbGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBodW5rcy5wdXNoKGh1bmspO1xuICAgICAgICAgIG9sZFJhbmdlU3RhcnQgPSAwO1xuICAgICAgICAgIG5ld1JhbmdlU3RhcnQgPSAwO1xuICAgICAgICAgIGN1clJhbmdlID0gW107XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgb2xkTGluZSArPSBsaW5lcy5sZW5ndGg7XG4gICAgICBuZXdMaW5lICs9IGxpbmVzLmxlbmd0aDtcbiAgICB9XG4gIH07XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBkaWZmLmxlbmd0aDsgaSsrKSB7XG4gICAgX2xvb3AoaSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIG9sZEZpbGVOYW1lOiBvbGRGaWxlTmFtZSxcbiAgICBuZXdGaWxlTmFtZTogbmV3RmlsZU5hbWUsXG4gICAgb2xkSGVhZGVyOiBvbGRIZWFkZXIsXG4gICAgbmV3SGVhZGVyOiBuZXdIZWFkZXIsXG4gICAgaHVua3M6IGh1bmtzXG4gIH07XG59XG5mdW5jdGlvbiBmb3JtYXRQYXRjaChkaWZmKSB7XG4gIHZhciByZXQgPSBbXTtcblxuICBpZiAoZGlmZi5vbGRGaWxlTmFtZSA9PSBkaWZmLm5ld0ZpbGVOYW1lKSB7XG4gICAgcmV0LnB1c2goJ0luZGV4OiAnICsgZGlmZi5vbGRGaWxlTmFtZSk7XG4gIH1cblxuICByZXQucHVzaCgnPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PScpO1xuICByZXQucHVzaCgnLS0tICcgKyBkaWZmLm9sZEZpbGVOYW1lICsgKHR5cGVvZiBkaWZmLm9sZEhlYWRlciA9PT0gJ3VuZGVmaW5lZCcgPyAnJyA6ICdcXHQnICsgZGlmZi5vbGRIZWFkZXIpKTtcbiAgcmV0LnB1c2goJysrKyAnICsgZGlmZi5uZXdGaWxlTmFtZSArICh0eXBlb2YgZGlmZi5uZXdIZWFkZXIgPT09ICd1bmRlZmluZWQnID8gJycgOiAnXFx0JyArIGRpZmYubmV3SGVhZGVyKSk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBkaWZmLmh1bmtzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGh1bmsgPSBkaWZmLmh1bmtzW2ldOyAvLyBVbmlmaWVkIERpZmYgRm9ybWF0IHF1aXJrOiBJZiB0aGUgY2h1bmsgc2l6ZSBpcyAwLFxuICAgIC8vIHRoZSBmaXJzdCBudW1iZXIgaXMgb25lIGxvd2VyIHRoYW4gb25lIHdvdWxkIGV4cGVjdC5cbiAgICAvLyBodHRwczovL3d3dy5hcnRpbWEuY29tL3dlYmxvZ3Mvdmlld3Bvc3QuanNwP3RocmVhZD0xNjQyOTNcblxuICAgIGlmIChodW5rLm9sZExpbmVzID09PSAwKSB7XG4gICAgICBodW5rLm9sZFN0YXJ0IC09IDE7XG4gICAgfVxuXG4gICAgaWYgKGh1bmsubmV3TGluZXMgPT09IDApIHtcbiAgICAgIGh1bmsubmV3U3RhcnQgLT0gMTtcbiAgICB9XG5cbiAgICByZXQucHVzaCgnQEAgLScgKyBodW5rLm9sZFN0YXJ0ICsgJywnICsgaHVuay5vbGRMaW5lcyArICcgKycgKyBodW5rLm5ld1N0YXJ0ICsgJywnICsgaHVuay5uZXdMaW5lcyArICcgQEAnKTtcbiAgICByZXQucHVzaC5hcHBseShyZXQsIGh1bmsubGluZXMpO1xuICB9XG5cbiAgcmV0dXJuIHJldC5qb2luKCdcXG4nKSArICdcXG4nO1xufVxuZnVuY3Rpb24gY3JlYXRlVHdvRmlsZXNQYXRjaChvbGRGaWxlTmFtZSwgbmV3RmlsZU5hbWUsIG9sZFN0ciwgbmV3U3RyLCBvbGRIZWFkZXIsIG5ld0hlYWRlciwgb3B0aW9ucykge1xuICByZXR1cm4gZm9ybWF0UGF0Y2goc3RydWN0dXJlZFBhdGNoKG9sZEZpbGVOYW1lLCBuZXdGaWxlTmFtZSwgb2xkU3RyLCBuZXdTdHIsIG9sZEhlYWRlciwgbmV3SGVhZGVyLCBvcHRpb25zKSk7XG59XG5mdW5jdGlvbiBjcmVhdGVQYXRjaChmaWxlTmFtZSwgb2xkU3RyLCBuZXdTdHIsIG9sZEhlYWRlciwgbmV3SGVhZGVyLCBvcHRpb25zKSB7XG4gIHJldHVybiBjcmVhdGVUd29GaWxlc1BhdGNoKGZpbGVOYW1lLCBmaWxlTmFtZSwgb2xkU3RyLCBuZXdTdHIsIG9sZEhlYWRlciwgbmV3SGVhZGVyLCBvcHRpb25zKTtcbn1cblxuZnVuY3Rpb24gYXJyYXlFcXVhbChhLCBiKSB7XG4gIGlmIChhLmxlbmd0aCAhPT0gYi5sZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gYXJyYXlTdGFydHNXaXRoKGEsIGIpO1xufVxuZnVuY3Rpb24gYXJyYXlTdGFydHNXaXRoKGFycmF5LCBzdGFydCkge1xuICBpZiAoc3RhcnQubGVuZ3RoID4gYXJyYXkubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGFydC5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdGFydFtpXSAhPT0gYXJyYXlbaV0pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gY2FsY0xpbmVDb3VudChodW5rKSB7XG4gIHZhciBfY2FsY09sZE5ld0xpbmVDb3VudCA9IGNhbGNPbGROZXdMaW5lQ291bnQoaHVuay5saW5lcyksXG4gICAgICBvbGRMaW5lcyA9IF9jYWxjT2xkTmV3TGluZUNvdW50Lm9sZExpbmVzLFxuICAgICAgbmV3TGluZXMgPSBfY2FsY09sZE5ld0xpbmVDb3VudC5uZXdMaW5lcztcblxuICBpZiAob2xkTGluZXMgIT09IHVuZGVmaW5lZCkge1xuICAgIGh1bmsub2xkTGluZXMgPSBvbGRMaW5lcztcbiAgfSBlbHNlIHtcbiAgICBkZWxldGUgaHVuay5vbGRMaW5lcztcbiAgfVxuXG4gIGlmIChuZXdMaW5lcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaHVuay5uZXdMaW5lcyA9IG5ld0xpbmVzO1xuICB9IGVsc2Uge1xuICAgIGRlbGV0ZSBodW5rLm5ld0xpbmVzO1xuICB9XG59XG5mdW5jdGlvbiBtZXJnZShtaW5lLCB0aGVpcnMsIGJhc2UpIHtcbiAgbWluZSA9IGxvYWRQYXRjaChtaW5lLCBiYXNlKTtcbiAgdGhlaXJzID0gbG9hZFBhdGNoKHRoZWlycywgYmFzZSk7XG4gIHZhciByZXQgPSB7fTsgLy8gRm9yIGluZGV4IHdlIGp1c3QgbGV0IGl0IHBhc3MgdGhyb3VnaCBhcyBpdCBkb2Vzbid0IGhhdmUgYW55IG5lY2Vzc2FyeSBtZWFuaW5nLlxuICAvLyBMZWF2aW5nIHNhbml0eSBjaGVja3Mgb24gdGhpcyB0byB0aGUgQVBJIGNvbnN1bWVyIHRoYXQgbWF5IGtub3cgbW9yZSBhYm91dCB0aGVcbiAgLy8gbWVhbmluZyBpbiB0aGVpciBvd24gY29udGV4dC5cblxuICBpZiAobWluZS5pbmRleCB8fCB0aGVpcnMuaW5kZXgpIHtcbiAgICByZXQuaW5kZXggPSBtaW5lLmluZGV4IHx8IHRoZWlycy5pbmRleDtcbiAgfVxuXG4gIGlmIChtaW5lLm5ld0ZpbGVOYW1lIHx8IHRoZWlycy5uZXdGaWxlTmFtZSkge1xuICAgIGlmICghZmlsZU5hbWVDaGFuZ2VkKG1pbmUpKSB7XG4gICAgICAvLyBObyBoZWFkZXIgb3Igbm8gY2hhbmdlIGluIG91cnMsIHVzZSB0aGVpcnMgKGFuZCBvdXJzIGlmIHRoZWlycyBkb2VzIG5vdCBleGlzdClcbiAgICAgIHJldC5vbGRGaWxlTmFtZSA9IHRoZWlycy5vbGRGaWxlTmFtZSB8fCBtaW5lLm9sZEZpbGVOYW1lO1xuICAgICAgcmV0Lm5ld0ZpbGVOYW1lID0gdGhlaXJzLm5ld0ZpbGVOYW1lIHx8IG1pbmUubmV3RmlsZU5hbWU7XG4gICAgICByZXQub2xkSGVhZGVyID0gdGhlaXJzLm9sZEhlYWRlciB8fCBtaW5lLm9sZEhlYWRlcjtcbiAgICAgIHJldC5uZXdIZWFkZXIgPSB0aGVpcnMubmV3SGVhZGVyIHx8IG1pbmUubmV3SGVhZGVyO1xuICAgIH0gZWxzZSBpZiAoIWZpbGVOYW1lQ2hhbmdlZCh0aGVpcnMpKSB7XG4gICAgICAvLyBObyBoZWFkZXIgb3Igbm8gY2hhbmdlIGluIHRoZWlycywgdXNlIG91cnNcbiAgICAgIHJldC5vbGRGaWxlTmFtZSA9IG1pbmUub2xkRmlsZU5hbWU7XG4gICAgICByZXQubmV3RmlsZU5hbWUgPSBtaW5lLm5ld0ZpbGVOYW1lO1xuICAgICAgcmV0Lm9sZEhlYWRlciA9IG1pbmUub2xkSGVhZGVyO1xuICAgICAgcmV0Lm5ld0hlYWRlciA9IG1pbmUubmV3SGVhZGVyO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBCb3RoIGNoYW5nZWQuLi4gZmlndXJlIGl0IG91dFxuICAgICAgcmV0Lm9sZEZpbGVOYW1lID0gc2VsZWN0RmllbGQocmV0LCBtaW5lLm9sZEZpbGVOYW1lLCB0aGVpcnMub2xkRmlsZU5hbWUpO1xuICAgICAgcmV0Lm5ld0ZpbGVOYW1lID0gc2VsZWN0RmllbGQocmV0LCBtaW5lLm5ld0ZpbGVOYW1lLCB0aGVpcnMubmV3RmlsZU5hbWUpO1xuICAgICAgcmV0Lm9sZEhlYWRlciA9IHNlbGVjdEZpZWxkKHJldCwgbWluZS5vbGRIZWFkZXIsIHRoZWlycy5vbGRIZWFkZXIpO1xuICAgICAgcmV0Lm5ld0hlYWRlciA9IHNlbGVjdEZpZWxkKHJldCwgbWluZS5uZXdIZWFkZXIsIHRoZWlycy5uZXdIZWFkZXIpO1xuICAgIH1cbiAgfVxuXG4gIHJldC5odW5rcyA9IFtdO1xuICB2YXIgbWluZUluZGV4ID0gMCxcbiAgICAgIHRoZWlyc0luZGV4ID0gMCxcbiAgICAgIG1pbmVPZmZzZXQgPSAwLFxuICAgICAgdGhlaXJzT2Zmc2V0ID0gMDtcblxuICB3aGlsZSAobWluZUluZGV4IDwgbWluZS5odW5rcy5sZW5ndGggfHwgdGhlaXJzSW5kZXggPCB0aGVpcnMuaHVua3MubGVuZ3RoKSB7XG4gICAgdmFyIG1pbmVDdXJyZW50ID0gbWluZS5odW5rc1ttaW5lSW5kZXhdIHx8IHtcbiAgICAgIG9sZFN0YXJ0OiBJbmZpbml0eVxuICAgIH0sXG4gICAgICAgIHRoZWlyc0N1cnJlbnQgPSB0aGVpcnMuaHVua3NbdGhlaXJzSW5kZXhdIHx8IHtcbiAgICAgIG9sZFN0YXJ0OiBJbmZpbml0eVxuICAgIH07XG5cbiAgICBpZiAoaHVua0JlZm9yZShtaW5lQ3VycmVudCwgdGhlaXJzQ3VycmVudCkpIHtcbiAgICAgIC8vIFRoaXMgcGF0Y2ggZG9lcyBub3Qgb3ZlcmxhcCB3aXRoIGFueSBvZiB0aGUgb3RoZXJzLCB5YXkuXG4gICAgICByZXQuaHVua3MucHVzaChjbG9uZUh1bmsobWluZUN1cnJlbnQsIG1pbmVPZmZzZXQpKTtcbiAgICAgIG1pbmVJbmRleCsrO1xuICAgICAgdGhlaXJzT2Zmc2V0ICs9IG1pbmVDdXJyZW50Lm5ld0xpbmVzIC0gbWluZUN1cnJlbnQub2xkTGluZXM7XG4gICAgfSBlbHNlIGlmIChodW5rQmVmb3JlKHRoZWlyc0N1cnJlbnQsIG1pbmVDdXJyZW50KSkge1xuICAgICAgLy8gVGhpcyBwYXRjaCBkb2VzIG5vdCBvdmVybGFwIHdpdGggYW55IG9mIHRoZSBvdGhlcnMsIHlheS5cbiAgICAgIHJldC5odW5rcy5wdXNoKGNsb25lSHVuayh0aGVpcnNDdXJyZW50LCB0aGVpcnNPZmZzZXQpKTtcbiAgICAgIHRoZWlyc0luZGV4Kys7XG4gICAgICBtaW5lT2Zmc2V0ICs9IHRoZWlyc0N1cnJlbnQubmV3TGluZXMgLSB0aGVpcnNDdXJyZW50Lm9sZExpbmVzO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBPdmVybGFwLCBtZXJnZSBhcyBiZXN0IHdlIGNhblxuICAgICAgdmFyIG1lcmdlZEh1bmsgPSB7XG4gICAgICAgIG9sZFN0YXJ0OiBNYXRoLm1pbihtaW5lQ3VycmVudC5vbGRTdGFydCwgdGhlaXJzQ3VycmVudC5vbGRTdGFydCksXG4gICAgICAgIG9sZExpbmVzOiAwLFxuICAgICAgICBuZXdTdGFydDogTWF0aC5taW4obWluZUN1cnJlbnQubmV3U3RhcnQgKyBtaW5lT2Zmc2V0LCB0aGVpcnNDdXJyZW50Lm9sZFN0YXJ0ICsgdGhlaXJzT2Zmc2V0KSxcbiAgICAgICAgbmV3TGluZXM6IDAsXG4gICAgICAgIGxpbmVzOiBbXVxuICAgICAgfTtcbiAgICAgIG1lcmdlTGluZXMobWVyZ2VkSHVuaywgbWluZUN1cnJlbnQub2xkU3RhcnQsIG1pbmVDdXJyZW50LmxpbmVzLCB0aGVpcnNDdXJyZW50Lm9sZFN0YXJ0LCB0aGVpcnNDdXJyZW50LmxpbmVzKTtcbiAgICAgIHRoZWlyc0luZGV4Kys7XG4gICAgICBtaW5lSW5kZXgrKztcbiAgICAgIHJldC5odW5rcy5wdXNoKG1lcmdlZEh1bmspO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXQ7XG59XG5cbmZ1bmN0aW9uIGxvYWRQYXRjaChwYXJhbSwgYmFzZSkge1xuICBpZiAodHlwZW9mIHBhcmFtID09PSAnc3RyaW5nJykge1xuICAgIGlmICgvXkBAL20udGVzdChwYXJhbSkgfHwgL15JbmRleDovbS50ZXN0KHBhcmFtKSkge1xuICAgICAgcmV0dXJuIHBhcnNlUGF0Y2gocGFyYW0pWzBdO1xuICAgIH1cblxuICAgIGlmICghYmFzZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNdXN0IHByb3ZpZGUgYSBiYXNlIHJlZmVyZW5jZSBvciBwYXNzIGluIGEgcGF0Y2gnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RydWN0dXJlZFBhdGNoKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBiYXNlLCBwYXJhbSk7XG4gIH1cblxuICByZXR1cm4gcGFyYW07XG59XG5cbmZ1bmN0aW9uIGZpbGVOYW1lQ2hhbmdlZChwYXRjaCkge1xuICByZXR1cm4gcGF0Y2gubmV3RmlsZU5hbWUgJiYgcGF0Y2gubmV3RmlsZU5hbWUgIT09IHBhdGNoLm9sZEZpbGVOYW1lO1xufVxuXG5mdW5jdGlvbiBzZWxlY3RGaWVsZChpbmRleCwgbWluZSwgdGhlaXJzKSB7XG4gIGlmIChtaW5lID09PSB0aGVpcnMpIHtcbiAgICByZXR1cm4gbWluZTtcbiAgfSBlbHNlIHtcbiAgICBpbmRleC5jb25mbGljdCA9IHRydWU7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1pbmU6IG1pbmUsXG4gICAgICB0aGVpcnM6IHRoZWlyc1xuICAgIH07XG4gIH1cbn1cblxuZnVuY3Rpb24gaHVua0JlZm9yZSh0ZXN0LCBjaGVjaykge1xuICByZXR1cm4gdGVzdC5vbGRTdGFydCA8IGNoZWNrLm9sZFN0YXJ0ICYmIHRlc3Qub2xkU3RhcnQgKyB0ZXN0Lm9sZExpbmVzIDwgY2hlY2sub2xkU3RhcnQ7XG59XG5cbmZ1bmN0aW9uIGNsb25lSHVuayhodW5rLCBvZmZzZXQpIHtcbiAgcmV0dXJuIHtcbiAgICBvbGRTdGFydDogaHVuay5vbGRTdGFydCxcbiAgICBvbGRMaW5lczogaHVuay5vbGRMaW5lcyxcbiAgICBuZXdTdGFydDogaHVuay5uZXdTdGFydCArIG9mZnNldCxcbiAgICBuZXdMaW5lczogaHVuay5uZXdMaW5lcyxcbiAgICBsaW5lczogaHVuay5saW5lc1xuICB9O1xufVxuXG5mdW5jdGlvbiBtZXJnZUxpbmVzKGh1bmssIG1pbmVPZmZzZXQsIG1pbmVMaW5lcywgdGhlaXJPZmZzZXQsIHRoZWlyTGluZXMpIHtcbiAgLy8gVGhpcyB3aWxsIGdlbmVyYWxseSByZXN1bHQgaW4gYSBjb25mbGljdGVkIGh1bmssIGJ1dCB0aGVyZSBhcmUgY2FzZXMgd2hlcmUgdGhlIGNvbnRleHRcbiAgLy8gaXMgdGhlIG9ubHkgb3ZlcmxhcCB3aGVyZSB3ZSBjYW4gc3VjY2Vzc2Z1bGx5IG1lcmdlIHRoZSBjb250ZW50IGhlcmUuXG4gIHZhciBtaW5lID0ge1xuICAgIG9mZnNldDogbWluZU9mZnNldCxcbiAgICBsaW5lczogbWluZUxpbmVzLFxuICAgIGluZGV4OiAwXG4gIH0sXG4gICAgICB0aGVpciA9IHtcbiAgICBvZmZzZXQ6IHRoZWlyT2Zmc2V0LFxuICAgIGxpbmVzOiB0aGVpckxpbmVzLFxuICAgIGluZGV4OiAwXG4gIH07IC8vIEhhbmRsZSBhbnkgbGVhZGluZyBjb250ZW50XG5cbiAgaW5zZXJ0TGVhZGluZyhodW5rLCBtaW5lLCB0aGVpcik7XG4gIGluc2VydExlYWRpbmcoaHVuaywgdGhlaXIsIG1pbmUpOyAvLyBOb3cgaW4gdGhlIG92ZXJsYXAgY29udGVudC4gU2NhbiB0aHJvdWdoIGFuZCBzZWxlY3QgdGhlIGJlc3QgY2hhbmdlcyBmcm9tIGVhY2guXG5cbiAgd2hpbGUgKG1pbmUuaW5kZXggPCBtaW5lLmxpbmVzLmxlbmd0aCAmJiB0aGVpci5pbmRleCA8IHRoZWlyLmxpbmVzLmxlbmd0aCkge1xuICAgIHZhciBtaW5lQ3VycmVudCA9IG1pbmUubGluZXNbbWluZS5pbmRleF0sXG4gICAgICAgIHRoZWlyQ3VycmVudCA9IHRoZWlyLmxpbmVzW3RoZWlyLmluZGV4XTtcblxuICAgIGlmICgobWluZUN1cnJlbnRbMF0gPT09ICctJyB8fCBtaW5lQ3VycmVudFswXSA9PT0gJysnKSAmJiAodGhlaXJDdXJyZW50WzBdID09PSAnLScgfHwgdGhlaXJDdXJyZW50WzBdID09PSAnKycpKSB7XG4gICAgICAvLyBCb3RoIG1vZGlmaWVkIC4uLlxuICAgICAgbXV0dWFsQ2hhbmdlKGh1bmssIG1pbmUsIHRoZWlyKTtcbiAgICB9IGVsc2UgaWYgKG1pbmVDdXJyZW50WzBdID09PSAnKycgJiYgdGhlaXJDdXJyZW50WzBdID09PSAnICcpIHtcbiAgICAgIHZhciBfaHVuayRsaW5lcztcblxuICAgICAgLy8gTWluZSBpbnNlcnRlZFxuICAgICAgKF9odW5rJGxpbmVzID0gaHVuay5saW5lcykucHVzaC5hcHBseShfaHVuayRsaW5lcywgX3RvQ29uc3VtYWJsZUFycmF5KGNvbGxlY3RDaGFuZ2UobWluZSkpKTtcbiAgICB9IGVsc2UgaWYgKHRoZWlyQ3VycmVudFswXSA9PT0gJysnICYmIG1pbmVDdXJyZW50WzBdID09PSAnICcpIHtcbiAgICAgIHZhciBfaHVuayRsaW5lczI7XG5cbiAgICAgIC8vIFRoZWlycyBpbnNlcnRlZFxuICAgICAgKF9odW5rJGxpbmVzMiA9IGh1bmsubGluZXMpLnB1c2guYXBwbHkoX2h1bmskbGluZXMyLCBfdG9Db25zdW1hYmxlQXJyYXkoY29sbGVjdENoYW5nZSh0aGVpcikpKTtcbiAgICB9IGVsc2UgaWYgKG1pbmVDdXJyZW50WzBdID09PSAnLScgJiYgdGhlaXJDdXJyZW50WzBdID09PSAnICcpIHtcbiAgICAgIC8vIE1pbmUgcmVtb3ZlZCBvciBlZGl0ZWRcbiAgICAgIHJlbW92YWwoaHVuaywgbWluZSwgdGhlaXIpO1xuICAgIH0gZWxzZSBpZiAodGhlaXJDdXJyZW50WzBdID09PSAnLScgJiYgbWluZUN1cnJlbnRbMF0gPT09ICcgJykge1xuICAgICAgLy8gVGhlaXIgcmVtb3ZlZCBvciBlZGl0ZWRcbiAgICAgIHJlbW92YWwoaHVuaywgdGhlaXIsIG1pbmUsIHRydWUpO1xuICAgIH0gZWxzZSBpZiAobWluZUN1cnJlbnQgPT09IHRoZWlyQ3VycmVudCkge1xuICAgICAgLy8gQ29udGV4dCBpZGVudGl0eVxuICAgICAgaHVuay5saW5lcy5wdXNoKG1pbmVDdXJyZW50KTtcbiAgICAgIG1pbmUuaW5kZXgrKztcbiAgICAgIHRoZWlyLmluZGV4Kys7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIENvbnRleHQgbWlzbWF0Y2hcbiAgICAgIGNvbmZsaWN0KGh1bmssIGNvbGxlY3RDaGFuZ2UobWluZSksIGNvbGxlY3RDaGFuZ2UodGhlaXIpKTtcbiAgICB9XG4gIH0gLy8gTm93IHB1c2ggYW55dGhpbmcgdGhhdCBtYXkgYmUgcmVtYWluaW5nXG5cblxuICBpbnNlcnRUcmFpbGluZyhodW5rLCBtaW5lKTtcbiAgaW5zZXJ0VHJhaWxpbmcoaHVuaywgdGhlaXIpO1xuICBjYWxjTGluZUNvdW50KGh1bmspO1xufVxuXG5mdW5jdGlvbiBtdXR1YWxDaGFuZ2UoaHVuaywgbWluZSwgdGhlaXIpIHtcbiAgdmFyIG15Q2hhbmdlcyA9IGNvbGxlY3RDaGFuZ2UobWluZSksXG4gICAgICB0aGVpckNoYW5nZXMgPSBjb2xsZWN0Q2hhbmdlKHRoZWlyKTtcblxuICBpZiAoYWxsUmVtb3ZlcyhteUNoYW5nZXMpICYmIGFsbFJlbW92ZXModGhlaXJDaGFuZ2VzKSkge1xuICAgIC8vIFNwZWNpYWwgY2FzZSBmb3IgcmVtb3ZlIGNoYW5nZXMgdGhhdCBhcmUgc3VwZXJzZXRzIG9mIG9uZSBhbm90aGVyXG4gICAgaWYgKGFycmF5U3RhcnRzV2l0aChteUNoYW5nZXMsIHRoZWlyQ2hhbmdlcykgJiYgc2tpcFJlbW92ZVN1cGVyc2V0KHRoZWlyLCBteUNoYW5nZXMsIG15Q2hhbmdlcy5sZW5ndGggLSB0aGVpckNoYW5nZXMubGVuZ3RoKSkge1xuICAgICAgdmFyIF9odW5rJGxpbmVzMztcblxuICAgICAgKF9odW5rJGxpbmVzMyA9IGh1bmsubGluZXMpLnB1c2guYXBwbHkoX2h1bmskbGluZXMzLCBfdG9Db25zdW1hYmxlQXJyYXkobXlDaGFuZ2VzKSk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2UgaWYgKGFycmF5U3RhcnRzV2l0aCh0aGVpckNoYW5nZXMsIG15Q2hhbmdlcykgJiYgc2tpcFJlbW92ZVN1cGVyc2V0KG1pbmUsIHRoZWlyQ2hhbmdlcywgdGhlaXJDaGFuZ2VzLmxlbmd0aCAtIG15Q2hhbmdlcy5sZW5ndGgpKSB7XG4gICAgICB2YXIgX2h1bmskbGluZXM0O1xuXG4gICAgICAoX2h1bmskbGluZXM0ID0gaHVuay5saW5lcykucHVzaC5hcHBseShfaHVuayRsaW5lczQsIF90b0NvbnN1bWFibGVBcnJheSh0aGVpckNoYW5nZXMpKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfSBlbHNlIGlmIChhcnJheUVxdWFsKG15Q2hhbmdlcywgdGhlaXJDaGFuZ2VzKSkge1xuICAgIHZhciBfaHVuayRsaW5lczU7XG5cbiAgICAoX2h1bmskbGluZXM1ID0gaHVuay5saW5lcykucHVzaC5hcHBseShfaHVuayRsaW5lczUsIF90b0NvbnN1bWFibGVBcnJheShteUNoYW5nZXMpKTtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbmZsaWN0KGh1bmssIG15Q2hhbmdlcywgdGhlaXJDaGFuZ2VzKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZhbChodW5rLCBtaW5lLCB0aGVpciwgc3dhcCkge1xuICB2YXIgbXlDaGFuZ2VzID0gY29sbGVjdENoYW5nZShtaW5lKSxcbiAgICAgIHRoZWlyQ2hhbmdlcyA9IGNvbGxlY3RDb250ZXh0KHRoZWlyLCBteUNoYW5nZXMpO1xuXG4gIGlmICh0aGVpckNoYW5nZXMubWVyZ2VkKSB7XG4gICAgdmFyIF9odW5rJGxpbmVzNjtcblxuICAgIChfaHVuayRsaW5lczYgPSBodW5rLmxpbmVzKS5wdXNoLmFwcGx5KF9odW5rJGxpbmVzNiwgX3RvQ29uc3VtYWJsZUFycmF5KHRoZWlyQ2hhbmdlcy5tZXJnZWQpKTtcbiAgfSBlbHNlIHtcbiAgICBjb25mbGljdChodW5rLCBzd2FwID8gdGhlaXJDaGFuZ2VzIDogbXlDaGFuZ2VzLCBzd2FwID8gbXlDaGFuZ2VzIDogdGhlaXJDaGFuZ2VzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjb25mbGljdChodW5rLCBtaW5lLCB0aGVpcikge1xuICBodW5rLmNvbmZsaWN0ID0gdHJ1ZTtcbiAgaHVuay5saW5lcy5wdXNoKHtcbiAgICBjb25mbGljdDogdHJ1ZSxcbiAgICBtaW5lOiBtaW5lLFxuICAgIHRoZWlyczogdGhlaXJcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGluc2VydExlYWRpbmcoaHVuaywgaW5zZXJ0LCB0aGVpcikge1xuICB3aGlsZSAoaW5zZXJ0Lm9mZnNldCA8IHRoZWlyLm9mZnNldCAmJiBpbnNlcnQuaW5kZXggPCBpbnNlcnQubGluZXMubGVuZ3RoKSB7XG4gICAgdmFyIGxpbmUgPSBpbnNlcnQubGluZXNbaW5zZXJ0LmluZGV4KytdO1xuICAgIGh1bmsubGluZXMucHVzaChsaW5lKTtcbiAgICBpbnNlcnQub2Zmc2V0Kys7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5zZXJ0VHJhaWxpbmcoaHVuaywgaW5zZXJ0KSB7XG4gIHdoaWxlIChpbnNlcnQuaW5kZXggPCBpbnNlcnQubGluZXMubGVuZ3RoKSB7XG4gICAgdmFyIGxpbmUgPSBpbnNlcnQubGluZXNbaW5zZXJ0LmluZGV4KytdO1xuICAgIGh1bmsubGluZXMucHVzaChsaW5lKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjb2xsZWN0Q2hhbmdlKHN0YXRlKSB7XG4gIHZhciByZXQgPSBbXSxcbiAgICAgIG9wZXJhdGlvbiA9IHN0YXRlLmxpbmVzW3N0YXRlLmluZGV4XVswXTtcblxuICB3aGlsZSAoc3RhdGUuaW5kZXggPCBzdGF0ZS5saW5lcy5sZW5ndGgpIHtcbiAgICB2YXIgbGluZSA9IHN0YXRlLmxpbmVzW3N0YXRlLmluZGV4XTsgLy8gR3JvdXAgYWRkaXRpb25zIHRoYXQgYXJlIGltbWVkaWF0ZWx5IGFmdGVyIHN1YnRyYWN0aW9ucyBhbmQgdHJlYXQgdGhlbSBhcyBvbmUgXCJhdG9taWNcIiBtb2RpZnkgY2hhbmdlLlxuXG4gICAgaWYgKG9wZXJhdGlvbiA9PT0gJy0nICYmIGxpbmVbMF0gPT09ICcrJykge1xuICAgICAgb3BlcmF0aW9uID0gJysnO1xuICAgIH1cblxuICAgIGlmIChvcGVyYXRpb24gPT09IGxpbmVbMF0pIHtcbiAgICAgIHJldC5wdXNoKGxpbmUpO1xuICAgICAgc3RhdGUuaW5kZXgrKztcbiAgICB9IGVsc2Uge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJldDtcbn1cblxuZnVuY3Rpb24gY29sbGVjdENvbnRleHQoc3RhdGUsIG1hdGNoQ2hhbmdlcykge1xuICB2YXIgY2hhbmdlcyA9IFtdLFxuICAgICAgbWVyZ2VkID0gW10sXG4gICAgICBtYXRjaEluZGV4ID0gMCxcbiAgICAgIGNvbnRleHRDaGFuZ2VzID0gZmFsc2UsXG4gICAgICBjb25mbGljdGVkID0gZmFsc2U7XG5cbiAgd2hpbGUgKG1hdGNoSW5kZXggPCBtYXRjaENoYW5nZXMubGVuZ3RoICYmIHN0YXRlLmluZGV4IDwgc3RhdGUubGluZXMubGVuZ3RoKSB7XG4gICAgdmFyIGNoYW5nZSA9IHN0YXRlLmxpbmVzW3N0YXRlLmluZGV4XSxcbiAgICAgICAgbWF0Y2ggPSBtYXRjaENoYW5nZXNbbWF0Y2hJbmRleF07IC8vIE9uY2Ugd2UndmUgaGl0IG91ciBhZGQsIHRoZW4gd2UgYXJlIGRvbmVcblxuICAgIGlmIChtYXRjaFswXSA9PT0gJysnKSB7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBjb250ZXh0Q2hhbmdlcyA9IGNvbnRleHRDaGFuZ2VzIHx8IGNoYW5nZVswXSAhPT0gJyAnO1xuICAgIG1lcmdlZC5wdXNoKG1hdGNoKTtcbiAgICBtYXRjaEluZGV4Kys7IC8vIENvbnN1bWUgYW55IGFkZGl0aW9ucyBpbiB0aGUgb3RoZXIgYmxvY2sgYXMgYSBjb25mbGljdCB0byBhdHRlbXB0XG4gICAgLy8gdG8gcHVsbCBpbiB0aGUgcmVtYWluaW5nIGNvbnRleHQgYWZ0ZXIgdGhpc1xuXG4gICAgaWYgKGNoYW5nZVswXSA9PT0gJysnKSB7XG4gICAgICBjb25mbGljdGVkID0gdHJ1ZTtcblxuICAgICAgd2hpbGUgKGNoYW5nZVswXSA9PT0gJysnKSB7XG4gICAgICAgIGNoYW5nZXMucHVzaChjaGFuZ2UpO1xuICAgICAgICBjaGFuZ2UgPSBzdGF0ZS5saW5lc1srK3N0YXRlLmluZGV4XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobWF0Y2guc3Vic3RyKDEpID09PSBjaGFuZ2Uuc3Vic3RyKDEpKSB7XG4gICAgICBjaGFuZ2VzLnB1c2goY2hhbmdlKTtcbiAgICAgIHN0YXRlLmluZGV4Kys7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbmZsaWN0ZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGlmICgobWF0Y2hDaGFuZ2VzW21hdGNoSW5kZXhdIHx8ICcnKVswXSA9PT0gJysnICYmIGNvbnRleHRDaGFuZ2VzKSB7XG4gICAgY29uZmxpY3RlZCA9IHRydWU7XG4gIH1cblxuICBpZiAoY29uZmxpY3RlZCkge1xuICAgIHJldHVybiBjaGFuZ2VzO1xuICB9XG5cbiAgd2hpbGUgKG1hdGNoSW5kZXggPCBtYXRjaENoYW5nZXMubGVuZ3RoKSB7XG4gICAgbWVyZ2VkLnB1c2gobWF0Y2hDaGFuZ2VzW21hdGNoSW5kZXgrK10pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBtZXJnZWQ6IG1lcmdlZCxcbiAgICBjaGFuZ2VzOiBjaGFuZ2VzXG4gIH07XG59XG5cbmZ1bmN0aW9uIGFsbFJlbW92ZXMoY2hhbmdlcykge1xuICByZXR1cm4gY2hhbmdlcy5yZWR1Y2UoZnVuY3Rpb24gKHByZXYsIGNoYW5nZSkge1xuICAgIHJldHVybiBwcmV2ICYmIGNoYW5nZVswXSA9PT0gJy0nO1xuICB9LCB0cnVlKTtcbn1cblxuZnVuY3Rpb24gc2tpcFJlbW92ZVN1cGVyc2V0KHN0YXRlLCByZW1vdmVDaGFuZ2VzLCBkZWx0YSkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGRlbHRhOyBpKyspIHtcbiAgICB2YXIgY2hhbmdlQ29udGVudCA9IHJlbW92ZUNoYW5nZXNbcmVtb3ZlQ2hhbmdlcy5sZW5ndGggLSBkZWx0YSArIGldLnN1YnN0cigxKTtcblxuICAgIGlmIChzdGF0ZS5saW5lc1tzdGF0ZS5pbmRleCArIGldICE9PSAnICcgKyBjaGFuZ2VDb250ZW50KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgc3RhdGUuaW5kZXggKz0gZGVsdGE7XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBjYWxjT2xkTmV3TGluZUNvdW50KGxpbmVzKSB7XG4gIHZhciBvbGRMaW5lcyA9IDA7XG4gIHZhciBuZXdMaW5lcyA9IDA7XG4gIGxpbmVzLmZvckVhY2goZnVuY3Rpb24gKGxpbmUpIHtcbiAgICBpZiAodHlwZW9mIGxpbmUgIT09ICdzdHJpbmcnKSB7XG4gICAgICB2YXIgbXlDb3VudCA9IGNhbGNPbGROZXdMaW5lQ291bnQobGluZS5taW5lKTtcbiAgICAgIHZhciB0aGVpckNvdW50ID0gY2FsY09sZE5ld0xpbmVDb3VudChsaW5lLnRoZWlycyk7XG5cbiAgICAgIGlmIChvbGRMaW5lcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChteUNvdW50Lm9sZExpbmVzID09PSB0aGVpckNvdW50Lm9sZExpbmVzKSB7XG4gICAgICAgICAgb2xkTGluZXMgKz0gbXlDb3VudC5vbGRMaW5lcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvbGRMaW5lcyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAobmV3TGluZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAobXlDb3VudC5uZXdMaW5lcyA9PT0gdGhlaXJDb3VudC5uZXdMaW5lcykge1xuICAgICAgICAgIG5ld0xpbmVzICs9IG15Q291bnQubmV3TGluZXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3TGluZXMgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG5ld0xpbmVzICE9PSB1bmRlZmluZWQgJiYgKGxpbmVbMF0gPT09ICcrJyB8fCBsaW5lWzBdID09PSAnICcpKSB7XG4gICAgICAgIG5ld0xpbmVzKys7XG4gICAgICB9XG5cbiAgICAgIGlmIChvbGRMaW5lcyAhPT0gdW5kZWZpbmVkICYmIChsaW5lWzBdID09PSAnLScgfHwgbGluZVswXSA9PT0gJyAnKSkge1xuICAgICAgICBvbGRMaW5lcysrO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiB7XG4gICAgb2xkTGluZXM6IG9sZExpbmVzLFxuICAgIG5ld0xpbmVzOiBuZXdMaW5lc1xuICB9O1xufVxuXG4vLyBTZWU6IGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC9nb29nbGUtZGlmZi1tYXRjaC1wYXRjaC93aWtpL0FQSVxuZnVuY3Rpb24gY29udmVydENoYW5nZXNUb0RNUChjaGFuZ2VzKSB7XG4gIHZhciByZXQgPSBbXSxcbiAgICAgIGNoYW5nZSxcbiAgICAgIG9wZXJhdGlvbjtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYW5nZXMubGVuZ3RoOyBpKyspIHtcbiAgICBjaGFuZ2UgPSBjaGFuZ2VzW2ldO1xuXG4gICAgaWYgKGNoYW5nZS5hZGRlZCkge1xuICAgICAgb3BlcmF0aW9uID0gMTtcbiAgICB9IGVsc2UgaWYgKGNoYW5nZS5yZW1vdmVkKSB7XG4gICAgICBvcGVyYXRpb24gPSAtMTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3BlcmF0aW9uID0gMDtcbiAgICB9XG5cbiAgICByZXQucHVzaChbb3BlcmF0aW9uLCBjaGFuZ2UudmFsdWVdKTtcbiAgfVxuXG4gIHJldHVybiByZXQ7XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRDaGFuZ2VzVG9YTUwoY2hhbmdlcykge1xuICB2YXIgcmV0ID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGFuZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGNoYW5nZSA9IGNoYW5nZXNbaV07XG5cbiAgICBpZiAoY2hhbmdlLmFkZGVkKSB7XG4gICAgICByZXQucHVzaCgnPGlucz4nKTtcbiAgICB9IGVsc2UgaWYgKGNoYW5nZS5yZW1vdmVkKSB7XG4gICAgICByZXQucHVzaCgnPGRlbD4nKTtcbiAgICB9XG5cbiAgICByZXQucHVzaChlc2NhcGVIVE1MKGNoYW5nZS52YWx1ZSkpO1xuXG4gICAgaWYgKGNoYW5nZS5hZGRlZCkge1xuICAgICAgcmV0LnB1c2goJzwvaW5zPicpO1xuICAgIH0gZWxzZSBpZiAoY2hhbmdlLnJlbW92ZWQpIHtcbiAgICAgIHJldC5wdXNoKCc8L2RlbD4nKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmV0LmpvaW4oJycpO1xufVxuXG5mdW5jdGlvbiBlc2NhcGVIVE1MKHMpIHtcbiAgdmFyIG4gPSBzO1xuICBuID0gbi5yZXBsYWNlKC8mL2csICcmYW1wOycpO1xuICBuID0gbi5yZXBsYWNlKC88L2csICcmbHQ7Jyk7XG4gIG4gPSBuLnJlcGxhY2UoLz4vZywgJyZndDsnKTtcbiAgbiA9IG4ucmVwbGFjZSgvXCIvZywgJyZxdW90OycpO1xuICByZXR1cm4gbjtcbn1cblxuZXhwb3J0IHsgRGlmZiwgYXBwbHlQYXRjaCwgYXBwbHlQYXRjaGVzLCBjYW5vbmljYWxpemUsIGNvbnZlcnRDaGFuZ2VzVG9ETVAsIGNvbnZlcnRDaGFuZ2VzVG9YTUwsIGNyZWF0ZVBhdGNoLCBjcmVhdGVUd29GaWxlc1BhdGNoLCBkaWZmQXJyYXlzLCBkaWZmQ2hhcnMsIGRpZmZDc3MsIGRpZmZKc29uLCBkaWZmTGluZXMsIGRpZmZTZW50ZW5jZXMsIGRpZmZUcmltbWVkTGluZXMsIGRpZmZXb3JkcywgZGlmZldvcmRzV2l0aFNwYWNlLCBtZXJnZSwgcGFyc2VQYXRjaCwgc3RydWN0dXJlZFBhdGNoIH07XG4iLCJleHBvcnQgaW50ZXJmYWNlIElMaXN0IHtcbiAgZ2V0TGV2ZWwoKTogbnVtYmVyO1xuICBnZXRQYXJlbnQoKTogSUxpc3QgfCBudWxsO1xuICBhZGRBZnRlckFsbChsaXN0OiBJTGlzdCk6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBMaXN0IGltcGxlbWVudHMgSUxpc3Qge1xuICBwcml2YXRlIGluZGVudFNpZ246IHN0cmluZztcbiAgcHJpdmF0ZSBidWxsZXQ6IHN0cmluZztcbiAgcHJpdmF0ZSBjb250ZW50OiBzdHJpbmc7XG4gIHByaXZhdGUgZm9sZGVkOiBib29sZWFuO1xuICBwcml2YXRlIGNoaWxkcmVuOiBMaXN0W107XG4gIHByaXZhdGUgcGFyZW50OiBMaXN0O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGluZGVudFNpZ246IHN0cmluZyxcbiAgICBidWxsZXQ6IHN0cmluZyxcbiAgICBjb250ZW50OiBzdHJpbmcsXG4gICAgZm9sZGVkOiBib29sZWFuXG4gICkge1xuICAgIHRoaXMuaW5kZW50U2lnbiA9IGluZGVudFNpZ247XG4gICAgdGhpcy5idWxsZXQgPSBidWxsZXQ7XG4gICAgdGhpcy5jb250ZW50ID0gY29udGVudDtcbiAgICB0aGlzLmZvbGRlZCA9IGZvbGRlZDtcbiAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICB9XG5cbiAgaXNGb2xkZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZm9sZGVkO1xuICB9XG5cbiAgaXNGb2xkUm9vdCgpIHtcbiAgICBsZXQgcGFyZW50ID0gdGhpcy5nZXRQYXJlbnQoKTtcbiAgICB3aGlsZSAocGFyZW50KSB7XG4gICAgICBpZiAocGFyZW50LmlzRm9sZGVkKCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcGFyZW50ID0gcGFyZW50LmdldFBhcmVudCgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmlzRm9sZGVkKCk7XG4gIH1cblxuICBnZXRDaGlsZHJlbigpIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5jb25jYXQoKTtcbiAgfVxuXG4gIGFwcGVuZENvbnRlbnQoY29udGVudDogc3RyaW5nKSB7XG4gICAgdGhpcy5jb250ZW50ICs9IGNvbnRlbnQ7XG4gIH1cblxuICBnZXRDb250ZW50KCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRlbnQ7XG4gIH1cblxuICBpc0VtcHR5KCkge1xuICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmxlbmd0aCA9PT0gMDtcbiAgfVxuXG4gIGdldENvbnRlbnRTdGFydENoKCkge1xuICAgIGNvbnN0IGluZGVudExlbmd0aCA9ICh0aGlzLmdldExldmVsKCkgLSAxKSAqIHRoaXMuaW5kZW50U2lnbi5sZW5ndGg7XG4gICAgcmV0dXJuIGluZGVudExlbmd0aCArIDI7XG4gIH1cblxuICBnZXRDb250ZW50RW5kQ2goKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Q29udGVudFN0YXJ0Q2goKSArIHRoaXMuY29udGVudC5sZW5ndGg7XG4gIH1cblxuICBnZXRQYXJlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50O1xuICB9XG5cbiAgZ2V0UHJldlNpYmxpbmdPZihsaXN0OiBMaXN0KSB7XG4gICAgY29uc3QgaSA9IHRoaXMuY2hpbGRyZW4uaW5kZXhPZihsaXN0KTtcbiAgICByZXR1cm4gaSA+IDAgPyB0aGlzLmNoaWxkcmVuW2kgLSAxXSA6IG51bGw7XG4gIH1cblxuICBnZXROZXh0U2libGluZ09mKGxpc3Q6IExpc3QpIHtcbiAgICBjb25zdCBpID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKGxpc3QpO1xuICAgIHJldHVybiBpID49IDAgJiYgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoID8gdGhpcy5jaGlsZHJlbltpICsgMV0gOiBudWxsO1xuICB9XG5cbiAgZ2V0TGV2ZWwoKSB7XG4gICAgbGV0IGxldmVsID0gMDtcbiAgICBsZXQgcmVmOiBMaXN0ID0gdGhpcztcbiAgICB3aGlsZSAocmVmLnBhcmVudCkge1xuICAgICAgcmVmID0gcmVmLnBhcmVudDtcbiAgICAgIGxldmVsKys7XG4gICAgfVxuICAgIHJldHVybiBsZXZlbDtcbiAgfVxuXG4gIGFkZEFmdGVyQWxsKGxpc3Q6IExpc3QpIHtcbiAgICB0aGlzLmNoaWxkcmVuLnB1c2gobGlzdCk7XG4gICAgbGlzdC5wYXJlbnQgPSB0aGlzO1xuICB9XG5cbiAgYWRkQmVmb3JlQWxsKGxpc3Q6IExpc3QpIHtcbiAgICB0aGlzLmNoaWxkcmVuLnVuc2hpZnQobGlzdCk7XG4gICAgbGlzdC5wYXJlbnQgPSB0aGlzO1xuICB9XG5cbiAgYWRkQmVmb3JlKGJlZm9yZTogTGlzdCwgbGlzdDogTGlzdCkge1xuICAgIGNvbnN0IGkgPSB0aGlzLmNoaWxkcmVuLmluZGV4T2YoYmVmb3JlKTtcbiAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpLCAwLCBsaXN0KTtcbiAgICBsaXN0LnBhcmVudCA9IHRoaXM7XG4gIH1cblxuICBhZGRBZnRlcihiZWZvcmU6IExpc3QsIGxpc3Q6IExpc3QpIHtcbiAgICBjb25zdCBpID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKGJlZm9yZSk7XG4gICAgdGhpcy5jaGlsZHJlbi5zcGxpY2UoaSArIDEsIDAsIGxpc3QpO1xuICAgIGxpc3QucGFyZW50ID0gdGhpcztcbiAgfVxuXG4gIHJlbW92ZUNoaWxkKGxpc3Q6IExpc3QpIHtcbiAgICBjb25zdCBpID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKGxpc3QpO1xuICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKGksIDEpO1xuICAgIGxpc3QucGFyZW50ID0gbnVsbDtcbiAgfVxuXG4gIHByaW50KCkge1xuICAgIGxldCByZXMgPSB0aGlzLmdldEZ1bGxDb250ZW50KCkgKyBcIlxcblwiO1xuXG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLmNoaWxkcmVuKSB7XG4gICAgICByZXMgKz0gY2hpbGQucHJpbnQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRGdWxsQ29udGVudCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgbmV3IEFycmF5KHRoaXMuZ2V0TGV2ZWwoKSAtIDEpLmZpbGwodGhpcy5pbmRlbnRTaWduKS5qb2luKFwiXCIpICtcbiAgICAgIHRoaXMuYnVsbGV0ICtcbiAgICAgIFwiIFwiICtcbiAgICAgIHRoaXMuY29udGVudFxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFJvb3QgaW1wbGVtZW50cyBJTGlzdCB7XG4gIHByaXZhdGUgaW5kZW50U2lnbjogc3RyaW5nO1xuICBwcml2YXRlIHJvb3RMaXN0OiBMaXN0O1xuICBwcml2YXRlIHN0YXJ0OiBDb2RlTWlycm9yLlBvc2l0aW9uO1xuICBwcml2YXRlIGVuZDogQ29kZU1pcnJvci5Qb3NpdGlvbjtcbiAgcHJpdmF0ZSBjdXJzb3I6IENvZGVNaXJyb3IuUG9zaXRpb247XG5cbiAgY29uc3RydWN0b3IoXG4gICAgaW5kZW50U2lnbjogc3RyaW5nLFxuICAgIHN0YXJ0OiBDb2RlTWlycm9yLlBvc2l0aW9uLFxuICAgIGVuZDogQ29kZU1pcnJvci5Qb3NpdGlvbixcbiAgICBjdXJzb3I6IENvZGVNaXJyb3IuUG9zaXRpb25cbiAgKSB7XG4gICAgdGhpcy5pbmRlbnRTaWduID0gaW5kZW50U2lnbjtcbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG4gICAgdGhpcy5lbmQgPSBlbmQ7XG4gICAgdGhpcy5jdXJzb3IgPSBjdXJzb3I7XG4gICAgdGhpcy5yb290TGlzdCA9IG5ldyBMaXN0KFwiXCIsIFwiXCIsIFwiXCIsIGZhbHNlKTtcbiAgfVxuXG4gIHJlcGxhY2VDdXJzb3IoY3Vyc29yOiBDb2RlTWlycm9yLlBvc2l0aW9uKSB7XG4gICAgdGhpcy5jdXJzb3IgPSBjdXJzb3I7XG4gIH1cblxuICBnZXRUb3RhbExpbmVzKCkge1xuICAgIHJldHVybiB0aGlzLmVuZC5saW5lIC0gdGhpcy5zdGFydC5saW5lICsgMTtcbiAgfVxuXG4gIGdldENoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLnJvb3RMaXN0LmdldENoaWxkcmVuKCk7XG4gIH1cblxuICBnZXRJbmRlbnRTaWduKCkge1xuICAgIHJldHVybiB0aGlzLmluZGVudFNpZ247XG4gIH1cblxuICBnZXRMZXZlbCgpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGdldFBhcmVudCgpOiBMaXN0IHwgbnVsbCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBhZGRBZnRlckFsbChsaXN0OiBMaXN0KSB7XG4gICAgdGhpcy5yb290TGlzdC5hZGRBZnRlckFsbChsaXN0KTtcbiAgfVxuXG4gIGdldExpc3RTdGFydFBvc2l0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0O1xuICB9XG5cbiAgZ2V0TGlzdEVuZFBvc2l0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmVuZDtcbiAgfVxuXG4gIGdldEN1cnNvcigpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJzb3I7XG4gIH1cblxuICBnZXRMaXN0VW5kZXJDdXJzb3IoKTogTGlzdCB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0TGlzdFVuZGVyTGluZSh0aGlzLmN1cnNvci5saW5lKTtcbiAgfVxuXG4gIHByaW50KCkge1xuICAgIGxldCByZXMgPSBcIlwiO1xuXG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLnJvb3RMaXN0LmdldENoaWxkcmVuKCkpIHtcbiAgICAgIHJlcyArPSBjaGlsZC5wcmludCgpO1xuICAgIH1cblxuICAgIHJldHVybiByZXMucmVwbGFjZSgvXFxuJC8sIFwiXCIpO1xuICB9XG5cbiAgZ2V0TGluZU51bWJlck9mKGxpc3Q6IExpc3QpIHtcbiAgICBsZXQgcmVzdWx0OiBudW1iZXIgPSBudWxsO1xuICAgIGxldCBsaW5lOiBudW1iZXIgPSAwO1xuICAgIGNvbnN0IHZpc2l0QXJyID0gKGxsOiBMaXN0W10pID0+IHtcbiAgICAgIGZvciAoY29uc3QgbCBvZiBsbCkge1xuICAgICAgICBpZiAobCA9PT0gbGlzdCkge1xuICAgICAgICAgIHJlc3VsdCA9IGxpbmU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGluZSsrO1xuICAgICAgICAgIHZpc2l0QXJyKGwuZ2V0Q2hpbGRyZW4oKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdCAhPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICB2aXNpdEFycih0aGlzLnJvb3RMaXN0LmdldENoaWxkcmVuKCkpO1xuXG4gICAgcmV0dXJuIHJlc3VsdCArIHRoaXMuc3RhcnQubGluZTtcbiAgfVxuXG4gIGdldExpc3RVbmRlckxpbmUobGluZTogbnVtYmVyKSB7XG4gICAgaWYgKGxpbmUgPCB0aGlzLnN0YXJ0LmxpbmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgcmVzdWx0OiBMaXN0ID0gbnVsbDtcbiAgICBsZXQgaW5kZXg6IG51bWJlciA9IDA7XG4gICAgY29uc3QgdmlzaXRBcnIgPSAobGw6IExpc3RbXSkgPT4ge1xuICAgICAgZm9yIChjb25zdCBsIG9mIGxsKSB7XG4gICAgICAgIGlmIChpbmRleCArIHRoaXMuc3RhcnQubGluZSA9PT0gbGluZSkge1xuICAgICAgICAgIHJlc3VsdCA9IGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgICB2aXNpdEFycihsLmdldENoaWxkcmVuKCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQgIT09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmlzaXRBcnIodGhpcy5yb290TGlzdC5nZXRDaGlsZHJlbigpKTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBtb3ZlVXAoKSB7XG4gICAgY29uc3QgbGlzdCA9IHRoaXMuZ2V0TGlzdFVuZGVyQ3Vyc29yKCk7XG4gICAgY29uc3QgcGFyZW50ID0gbGlzdC5nZXRQYXJlbnQoKTtcbiAgICBjb25zdCBncmFuZFBhcmVudCA9IHBhcmVudC5nZXRQYXJlbnQoKTtcbiAgICBjb25zdCBwcmV2ID0gcGFyZW50LmdldFByZXZTaWJsaW5nT2YobGlzdCk7XG5cbiAgICBpZiAoIXByZXYgJiYgZ3JhbmRQYXJlbnQpIHtcbiAgICAgIGNvbnN0IG5ld1BhcmVudCA9IGdyYW5kUGFyZW50LmdldFByZXZTaWJsaW5nT2YocGFyZW50KTtcblxuICAgICAgaWYgKG5ld1BhcmVudCkge1xuICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQobGlzdCk7XG4gICAgICAgIG5ld1BhcmVudC5hZGRBZnRlckFsbChsaXN0KTtcbiAgICAgICAgdGhpcy5jdXJzb3IubGluZSA9IHRoaXMuZ2V0TGluZU51bWJlck9mKGxpc3QpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocHJldikge1xuICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKGxpc3QpO1xuICAgICAgcGFyZW50LmFkZEJlZm9yZShwcmV2LCBsaXN0KTtcbiAgICAgIHRoaXMuY3Vyc29yLmxpbmUgPSB0aGlzLmdldExpbmVOdW1iZXJPZihsaXN0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIG1vdmVEb3duKCkge1xuICAgIGNvbnN0IGxpc3QgPSB0aGlzLmdldExpc3RVbmRlckN1cnNvcigpO1xuICAgIGNvbnN0IHBhcmVudCA9IGxpc3QuZ2V0UGFyZW50KCk7XG4gICAgY29uc3QgZ3JhbmRQYXJlbnQgPSBwYXJlbnQuZ2V0UGFyZW50KCk7XG4gICAgY29uc3QgbmV4dCA9IHBhcmVudC5nZXROZXh0U2libGluZ09mKGxpc3QpO1xuXG4gICAgaWYgKCFuZXh0ICYmIGdyYW5kUGFyZW50KSB7XG4gICAgICBjb25zdCBuZXdQYXJlbnQgPSBncmFuZFBhcmVudC5nZXROZXh0U2libGluZ09mKHBhcmVudCk7XG5cbiAgICAgIGlmIChuZXdQYXJlbnQpIHtcbiAgICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKGxpc3QpO1xuICAgICAgICBuZXdQYXJlbnQuYWRkQmVmb3JlQWxsKGxpc3QpO1xuICAgICAgICB0aGlzLmN1cnNvci5saW5lID0gdGhpcy5nZXRMaW5lTnVtYmVyT2YobGlzdCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChuZXh0KSB7XG4gICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQobGlzdCk7XG4gICAgICBwYXJlbnQuYWRkQWZ0ZXIobmV4dCwgbGlzdCk7XG4gICAgICB0aGlzLmN1cnNvci5saW5lID0gdGhpcy5nZXRMaW5lTnVtYmVyT2YobGlzdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBtb3ZlTGVmdCgpIHtcbiAgICBjb25zdCBsaXN0ID0gdGhpcy5nZXRMaXN0VW5kZXJDdXJzb3IoKTtcbiAgICBjb25zdCBwYXJlbnQgPSBsaXN0LmdldFBhcmVudCgpO1xuICAgIGNvbnN0IGdyYW5kUGFyZW50ID0gcGFyZW50LmdldFBhcmVudCgpO1xuXG4gICAgaWYgKCFncmFuZFBhcmVudCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcGFyZW50LnJlbW92ZUNoaWxkKGxpc3QpO1xuICAgIGdyYW5kUGFyZW50LmFkZEFmdGVyKHBhcmVudCwgbGlzdCk7XG4gICAgdGhpcy5jdXJzb3IubGluZSA9IHRoaXMuZ2V0TGluZU51bWJlck9mKGxpc3QpO1xuICAgIHRoaXMuY3Vyc29yLmNoIC09IHRoaXMuZ2V0SW5kZW50U2lnbigpLmxlbmd0aDtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgbW92ZVJpZ2h0KCkge1xuICAgIGNvbnN0IGxpc3QgPSB0aGlzLmdldExpc3RVbmRlckN1cnNvcigpO1xuICAgIGNvbnN0IHBhcmVudCA9IGxpc3QuZ2V0UGFyZW50KCk7XG4gICAgY29uc3QgcHJldiA9IHBhcmVudC5nZXRQcmV2U2libGluZ09mKGxpc3QpO1xuXG4gICAgaWYgKCFwcmV2KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwYXJlbnQucmVtb3ZlQ2hpbGQobGlzdCk7XG4gICAgcHJldi5hZGRBZnRlckFsbChsaXN0KTtcbiAgICB0aGlzLmN1cnNvci5saW5lID0gdGhpcy5nZXRMaW5lTnVtYmVyT2YobGlzdCk7XG4gICAgdGhpcy5jdXJzb3IuY2ggKz0gdGhpcy5nZXRJbmRlbnRTaWduKCkubGVuZ3RoO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBkZWxldGVBbmRNZXJnZVdpdGhQcmV2aW91cygpIHtcbiAgICBjb25zdCBsaXN0ID0gdGhpcy5nZXRMaXN0VW5kZXJDdXJzb3IoKTtcblxuICAgIGlmICh0aGlzLmN1cnNvci5jaCAhPT0gbGlzdC5nZXRDb250ZW50U3RhcnRDaCgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgcHJldiA9IHRoaXMuZ2V0TGlzdFVuZGVyTGluZSh0aGlzLmN1cnNvci5saW5lIC0gMSk7XG5cbiAgICBpZiAoIXByZXYpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGJvdGhBcmVFbXB0eSA9IHByZXYuaXNFbXB0eSgpICYmIGxpc3QuaXNFbXB0eSgpO1xuICAgIGNvbnN0IHByZXZJc0VtcHR5QW5kU2FtZUxldmVsID1cbiAgICAgIHByZXYuaXNFbXB0eSgpICYmICFsaXN0LmlzRW1wdHkoKSAmJiBwcmV2LmdldExldmVsKCkgPT0gbGlzdC5nZXRMZXZlbCgpO1xuICAgIGNvbnN0IGxpc3RJc0VtcHR5QW5kUHJldklzUGFyZW50ID1cbiAgICAgIGxpc3QuaXNFbXB0eSgpICYmIHByZXYuZ2V0TGV2ZWwoKSA9PSBsaXN0LmdldExldmVsKCkgLSAxO1xuXG4gICAgaWYgKGJvdGhBcmVFbXB0eSB8fCBwcmV2SXNFbXB0eUFuZFNhbWVMZXZlbCB8fCBsaXN0SXNFbXB0eUFuZFByZXZJc1BhcmVudCkge1xuICAgICAgY29uc3QgcGFyZW50ID0gbGlzdC5nZXRQYXJlbnQoKTtcbiAgICAgIGNvbnN0IHByZXZFbmRDaCA9IHByZXYuZ2V0Q29udGVudEVuZENoKCk7XG5cbiAgICAgIHByZXYuYXBwZW5kQ29udGVudChsaXN0LmdldENvbnRlbnQoKSk7XG4gICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQobGlzdCk7XG4gICAgICBmb3IgKGNvbnN0IGMgb2YgbGlzdC5nZXRDaGlsZHJlbigpKSB7XG4gICAgICAgIGxpc3QucmVtb3ZlQ2hpbGQoYyk7XG4gICAgICAgIHByZXYuYWRkQWZ0ZXJBbGwoYyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY3Vyc29yLmxpbmUgPSB0aGlzLmdldExpbmVOdW1iZXJPZihwcmV2KTtcbiAgICAgIHRoaXMuY3Vyc29yLmNoID0gcHJldkVuZENoO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBkaWZmTGluZXMgfSBmcm9tIFwiZGlmZlwiO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcIi4vbG9nZ2VyXCI7XG5pbXBvcnQgeyBPYnNpZGlhblV0aWxzIH0gZnJvbSBcIi4vb2JzaWRpYW5fdXRpbHNcIjtcbmltcG9ydCB7IElMaXN0LCBMaXN0LCBSb290IH0gZnJvbSBcIi4vcm9vdFwiO1xuXG5jb25zdCBidWxsZXRTaWduID0gXCItKitcIjtcblxuZXhwb3J0IGNsYXNzIExpc3RVdGlscyB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbG9nZ2VyOiBMb2dnZXIsIHByaXZhdGUgb2JzaWRpYW5VdGlsczogT2JzaWRpYW5VdGlscykge31cblxuICBnZXRMaXN0TGluZUluZm8obGluZTogc3RyaW5nLCBpbmRlbnRTaWduOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwcmVmaXhSZSA9IG5ldyBSZWdFeHAoYF4oPzoke2luZGVudFNpZ259KSooWyR7YnVsbGV0U2lnbn1dKSBgKTtcbiAgICBjb25zdCBtYXRjaGVzID0gcHJlZml4UmUuZXhlYyhsaW5lKTtcblxuICAgIGlmICghbWF0Y2hlcykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgcHJlZml4TGVuZ3RoID0gbWF0Y2hlc1swXS5sZW5ndGg7XG4gICAgY29uc3QgYnVsbGV0ID0gbWF0Y2hlc1sxXTtcbiAgICBjb25zdCBjb250ZW50ID0gbGluZS5zbGljZShwcmVmaXhMZW5ndGgpO1xuICAgIGNvbnN0IGluZGVudExldmVsID0gKHByZWZpeExlbmd0aCAtIDIpIC8gaW5kZW50U2lnbi5sZW5ndGg7XG5cbiAgICByZXR1cm4ge1xuICAgICAgYnVsbGV0LFxuICAgICAgY29udGVudCxcbiAgICAgIHByZWZpeExlbmd0aCxcbiAgICAgIGluZGVudExldmVsLFxuICAgIH07XG4gIH1cblxuICBwYXJzZUxpc3QoZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvciwgY3Vyc29yID0gZWRpdG9yLmdldEN1cnNvcigpKTogUm9vdCB7XG4gICAgY29uc3QgY3Vyc29yTGluZSA9IGN1cnNvci5saW5lO1xuICAgIGNvbnN0IGN1cnNvckNoID0gY3Vyc29yLmNoO1xuICAgIGNvbnN0IGxpbmUgPSBlZGl0b3IuZ2V0TGluZShjdXJzb3JMaW5lKTtcblxuICAgIGNvbnN0IGluZGVudFNpZ24gPSB0aGlzLmRldGVjdExpc3RJbmRlbnRTaWduKGVkaXRvciwgY3Vyc29yKTtcblxuICAgIGlmIChpbmRlbnRTaWduID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgbGlzdFN0YXJ0TGluZSA9IGN1cnNvckxpbmU7XG4gICAgY29uc3QgbGlzdFN0YXJ0Q2ggPSAwO1xuICAgIHdoaWxlIChsaXN0U3RhcnRMaW5lID49IDEpIHtcbiAgICAgIGNvbnN0IGxpbmUgPSBlZGl0b3IuZ2V0TGluZShsaXN0U3RhcnRMaW5lIC0gMSk7XG4gICAgICBpZiAoIXRoaXMuZ2V0TGlzdExpbmVJbmZvKGxpbmUsIGluZGVudFNpZ24pKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgbGlzdFN0YXJ0TGluZS0tO1xuICAgIH1cblxuICAgIGxldCBsaXN0RW5kTGluZSA9IGN1cnNvckxpbmU7XG4gICAgbGV0IGxpc3RFbmRDaCA9IGxpbmUubGVuZ3RoO1xuICAgIHdoaWxlIChsaXN0RW5kTGluZSA8IGVkaXRvci5saW5lQ291bnQoKSkge1xuICAgICAgY29uc3QgbGluZSA9IGVkaXRvci5nZXRMaW5lKGxpc3RFbmRMaW5lICsgMSk7XG4gICAgICBpZiAoIXRoaXMuZ2V0TGlzdExpbmVJbmZvKGxpbmUsIGluZGVudFNpZ24pKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgbGlzdEVuZENoID0gbGluZS5sZW5ndGg7XG4gICAgICBsaXN0RW5kTGluZSsrO1xuICAgIH1cblxuICAgIGNvbnN0IHJvb3QgPSBuZXcgUm9vdChcbiAgICAgIGluZGVudFNpZ24sXG4gICAgICB7IGxpbmU6IGxpc3RTdGFydExpbmUsIGNoOiBsaXN0U3RhcnRDaCB9LFxuICAgICAgeyBsaW5lOiBsaXN0RW5kTGluZSwgY2g6IGxpc3RFbmRDaCB9LFxuICAgICAgeyBsaW5lOiBjdXJzb3JMaW5lLCBjaDogY3Vyc29yQ2ggfVxuICAgICk7XG5cbiAgICBsZXQgY3VycmVudExldmVsOiBJTGlzdCA9IHJvb3Q7XG4gICAgbGV0IGxhc3RMaXN0OiBJTGlzdCA9IHJvb3Q7XG5cbiAgICBmb3IgKGxldCBsID0gbGlzdFN0YXJ0TGluZTsgbCA8PSBsaXN0RW5kTGluZTsgbCsrKSB7XG4gICAgICBjb25zdCBsaW5lID0gZWRpdG9yLmdldExpbmUobCk7XG4gICAgICBjb25zdCB7IGJ1bGxldCwgY29udGVudCwgaW5kZW50TGV2ZWwgfSA9IHRoaXMuZ2V0TGlzdExpbmVJbmZvKFxuICAgICAgICBsaW5lLFxuICAgICAgICBpbmRlbnRTaWduXG4gICAgICApO1xuICAgICAgY29uc3QgZm9sZGVkID0gKGVkaXRvciBhcyBhbnkpLmlzRm9sZGVkKHtcbiAgICAgICAgbGluZTogbCxcbiAgICAgICAgY2g6IDAsXG4gICAgICB9KTtcblxuICAgICAgaWYgKGluZGVudExldmVsID09PSBjdXJyZW50TGV2ZWwuZ2V0TGV2ZWwoKSArIDEpIHtcbiAgICAgICAgY3VycmVudExldmVsID0gbGFzdExpc3Q7XG4gICAgICB9IGVsc2UgaWYgKGluZGVudExldmVsIDwgY3VycmVudExldmVsLmdldExldmVsKCkpIHtcbiAgICAgICAgd2hpbGUgKGluZGVudExldmVsIDwgY3VycmVudExldmVsLmdldExldmVsKCkpIHtcbiAgICAgICAgICBjdXJyZW50TGV2ZWwgPSBjdXJyZW50TGV2ZWwuZ2V0UGFyZW50KCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaW5kZW50TGV2ZWwgIT0gY3VycmVudExldmVsLmdldExldmVsKCkpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgVW5hYmxlIHRvIHBhcnNlIGxpc3RgKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGxpc3QgPSBuZXcgTGlzdChpbmRlbnRTaWduLCBidWxsZXQsIGNvbnRlbnQsIGZvbGRlZCk7XG4gICAgICBjdXJyZW50TGV2ZWwuYWRkQWZ0ZXJBbGwobGlzdCk7XG4gICAgICBsYXN0TGlzdCA9IGxpc3Q7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJvb3Q7XG4gIH1cblxuICBhcHBseUNoYW5nZXMoZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvciwgcm9vdDogUm9vdCkge1xuICAgIGNvbnN0IG9sZFN0cmluZyA9IGVkaXRvci5nZXRSYW5nZShcbiAgICAgIHJvb3QuZ2V0TGlzdFN0YXJ0UG9zaXRpb24oKSxcbiAgICAgIHJvb3QuZ2V0TGlzdEVuZFBvc2l0aW9uKClcbiAgICApO1xuICAgIGNvbnN0IG5ld1N0cmluZyA9IHJvb3QucHJpbnQoKTtcblxuICAgIGNvbnN0IGZyb21MaW5lID0gcm9vdC5nZXRMaXN0U3RhcnRQb3NpdGlvbigpLmxpbmU7XG4gICAgY29uc3QgdG9MaW5lID0gcm9vdC5nZXRMaXN0RW5kUG9zaXRpb24oKS5saW5lO1xuXG4gICAgZm9yIChsZXQgbCA9IGZyb21MaW5lOyBsIDw9IHRvTGluZTsgbCsrKSB7XG4gICAgICAoZWRpdG9yIGFzIGFueSkuZm9sZENvZGUobCwgbnVsbCwgXCJ1bmZvbGRcIik7XG4gICAgfVxuXG4gICAgY29uc3QgZGlmZiA9IGRpZmZMaW5lcyhvbGRTdHJpbmcsIG5ld1N0cmluZyk7XG4gICAgbGV0IGwgPSByb290LmdldExpc3RTdGFydFBvc2l0aW9uKCkubGluZTtcbiAgICBmb3IgKGNvbnN0IGNoYW5nZSBvZiBkaWZmKSB7XG4gICAgICBpZiAoY2hhbmdlLmFkZGVkKSB7XG4gICAgICAgIGVkaXRvci5yZXBsYWNlUmFuZ2UoY2hhbmdlLnZhbHVlLCB7IGxpbmU6IGwsIGNoOiAwIH0pO1xuICAgICAgICBsICs9IGNoYW5nZS5jb3VudDtcbiAgICAgIH0gZWxzZSBpZiAoY2hhbmdlLnJlbW92ZWQpIHtcbiAgICAgICAgY29uc3Qgd2l0aE5ld2xpbmUgPSAvXFxuJC8udGVzdChjaGFuZ2UudmFsdWUpO1xuICAgICAgICBjb25zdCB0aWxsTGluZSA9IHdpdGhOZXdsaW5lID8gbCArIGNoYW5nZS5jb3VudCA6IGwgKyBjaGFuZ2UuY291bnQgLSAxO1xuICAgICAgICBjb25zdCB0aWxsQ2ggPSB3aXRoTmV3bGluZSA/IDAgOiBlZGl0b3IuZ2V0TGluZSh0aWxsTGluZSkubGVuZ3RoO1xuICAgICAgICBlZGl0b3IucmVwbGFjZVJhbmdlKFxuICAgICAgICAgIFwiXCIsXG4gICAgICAgICAgeyBsaW5lOiBsLCBjaDogMCB9LFxuICAgICAgICAgIHsgbGluZTogdGlsbExpbmUsIGNoOiB0aWxsQ2ggfVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbCArPSBjaGFuZ2UuY291bnQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgb2xkQ3Vyc29yID0gZWRpdG9yLmdldEN1cnNvcigpO1xuICAgIGNvbnN0IG5ld0N1cnNvciA9IHJvb3QuZ2V0Q3Vyc29yKCk7XG5cbiAgICBpZiAob2xkQ3Vyc29yLmxpbmUgIT0gbmV3Q3Vyc29yLmxpbmUgfHwgb2xkQ3Vyc29yLmNoICE9IG5ld0N1cnNvci5jaCkge1xuICAgICAgZWRpdG9yLnNldEN1cnNvcihuZXdDdXJzb3IpO1xuICAgIH1cblxuICAgIGZvciAobGV0IGwgPSBmcm9tTGluZTsgbCA8PSB0b0xpbmU7IGwrKykge1xuICAgICAgY29uc3QgbGluZSA9IHJvb3QuZ2V0TGlzdFVuZGVyTGluZShsKTtcbiAgICAgIGlmIChsaW5lICYmIGxpbmUuaXNGb2xkUm9vdCgpKSB7XG4gICAgICAgIC8vIFRPRE86IHdoeSB3b3JraW5nIG9ubHkgd2l0aCAtMT9cbiAgICAgICAgKGVkaXRvciBhcyBhbnkpLmZvbGRDb2RlKGwgLSAxKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkZXRlY3RMaXN0SW5kZW50U2lnbihlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yLCBjdXJzb3I6IENvZGVNaXJyb3IuUG9zaXRpb24pIHtcbiAgICBjb25zdCBkID0gdGhpcy5sb2dnZXIuYmluZChcIk9ic2lkaWFuT3V0bGluZXJQbHVnaW46OmRldGVjdExpc3RJbmRlbnRTaWduXCIpO1xuXG4gICAgY29uc3QgeyB1c2VUYWIsIHRhYlNpemUgfSA9IHRoaXMub2JzaWRpYW5VdGlscy5nZXRPYnNpZGlhblRhYnNTZXR0aWducygpO1xuICAgIGNvbnN0IGRlZmF1bHRJbmRlbnRTaWduID0gdXNlVGFiXG4gICAgICA/IFwiXFx0XCJcbiAgICAgIDogbmV3IEFycmF5KHRhYlNpemUpLmZpbGwoXCIgXCIpLmpvaW4oXCJcIik7XG5cbiAgICBjb25zdCBsaW5lID0gZWRpdG9yLmdldExpbmUoY3Vyc29yLmxpbmUpO1xuXG4gICAgY29uc3Qgd2l0aFRhYnNSZSA9IG5ldyBSZWdFeHAoYF5cXHQrWyR7YnVsbGV0U2lnbn1dIGApO1xuICAgIGNvbnN0IHdpdGhTcGFjZXNSZSA9IG5ldyBSZWdFeHAoYF5bIF0rWyR7YnVsbGV0U2lnbn1dIGApO1xuICAgIGNvbnN0IG1heUJlV2l0aFNwYWNlc1JlID0gbmV3IFJlZ0V4cChgXlsgXSpbJHtidWxsZXRTaWdufV0gYCk7XG5cbiAgICBpZiAod2l0aFRhYnNSZS50ZXN0KGxpbmUpKSB7XG4gICAgICBkKFwiZGV0ZWN0ZWQgdGFiIG9uIGN1cnJlbnQgbGluZVwiKTtcbiAgICAgIHJldHVybiBcIlxcdFwiO1xuICAgIH1cblxuICAgIGlmICh3aXRoU3BhY2VzUmUudGVzdChsaW5lKSkge1xuICAgICAgZChcImRldGVjdGVkIHdoaXRlc3BhY2VzIG9uIGN1cnJlbnQgbGluZSwgdHJ5aW5nIHRvIGNvdW50XCIpO1xuICAgICAgY29uc3Qgc3BhY2VzQSA9IGxpbmUubGVuZ3RoIC0gbGluZS50cmltTGVmdCgpLmxlbmd0aDtcblxuICAgICAgbGV0IGxpbmVObyA9IGN1cnNvci5saW5lIC0gMTtcbiAgICAgIHdoaWxlIChsaW5lTm8gPj0gZWRpdG9yLmZpcnN0TGluZSgpKSB7XG4gICAgICAgIGNvbnN0IGxpbmUgPSBlZGl0b3IuZ2V0TGluZShsaW5lTm8pO1xuICAgICAgICBpZiAoIW1heUJlV2l0aFNwYWNlc1JlLnRlc3QobGluZSkpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzcGFjZXNCID0gbGluZS5sZW5ndGggLSBsaW5lLnRyaW1MZWZ0KCkubGVuZ3RoO1xuICAgICAgICBpZiAoc3BhY2VzQiA8IHNwYWNlc0EpIHtcbiAgICAgICAgICBjb25zdCBsID0gc3BhY2VzQSAtIHNwYWNlc0I7XG4gICAgICAgICAgZChgZGV0ZWN0ZWQgJHtsfSB3aGl0ZXNwYWNlc2ApO1xuICAgICAgICAgIHJldHVybiBuZXcgQXJyYXkobCkuZmlsbChcIiBcIikuam9pbihcIlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxpbmVOby0tO1xuICAgICAgfVxuXG4gICAgICBkKFwidW5hYmxlIHRvIGRldGVjdFwiKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmIChtYXlCZVdpdGhTcGFjZXNSZS50ZXN0KGxpbmUpKSB7XG4gICAgICBkKFwiZGV0ZWN0ZWQgbm90aGluZyBvbiBjdXJyZW50IGxpbmUsIGxvb2tpbmcgZm9yd2FyZFwiKTtcbiAgICAgIGNvbnN0IHNwYWNlc0EgPSBsaW5lLmxlbmd0aCAtIGxpbmUudHJpbUxlZnQoKS5sZW5ndGg7XG5cbiAgICAgIGxldCBsaW5lTm8gPSBjdXJzb3IubGluZSArIDE7XG4gICAgICB3aGlsZSAobGluZU5vIDw9IGVkaXRvci5sYXN0TGluZSgpKSB7XG4gICAgICAgIGNvbnN0IGxpbmUgPSBlZGl0b3IuZ2V0TGluZShsaW5lTm8pO1xuICAgICAgICBpZiAod2l0aFRhYnNSZS50ZXN0KGxpbmUpKSB7XG4gICAgICAgICAgZChcImRldGVjdGVkIHRhYlwiKTtcbiAgICAgICAgICByZXR1cm4gXCJcXHRcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW1heUJlV2l0aFNwYWNlc1JlLnRlc3QobGluZSkpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzcGFjZXNCID0gbGluZS5sZW5ndGggLSBsaW5lLnRyaW1MZWZ0KCkubGVuZ3RoO1xuICAgICAgICBpZiAoc3BhY2VzQiA+IHNwYWNlc0EpIHtcbiAgICAgICAgICBjb25zdCBsID0gc3BhY2VzQiAtIHNwYWNlc0E7XG4gICAgICAgICAgZChgZGV0ZWN0ZWQgJHtsfSB3aGl0ZXNwYWNlc2ApO1xuICAgICAgICAgIHJldHVybiBuZXcgQXJyYXkobCkuZmlsbChcIiBcIikuam9pbihcIlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxpbmVObysrO1xuICAgICAgfVxuXG4gICAgICBkKGBkZXRlY3RlZCBub3RoaW5nLCB1c2luZyBkZWZhdWx0IHVzZVRhYj0ke3VzZVRhYn0gdGFiU2l6ZT0ke3RhYlNpemV9YCk7XG4gICAgICByZXR1cm4gZGVmYXVsdEluZGVudFNpZ247XG4gICAgfVxuXG4gICAgZChcInVuYWJsZSB0byBkZXRlY3RcIik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpc0N1cnNvckluTGlzdChlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yKSB7XG4gICAgcmV0dXJuIHRoaXMuZGV0ZWN0TGlzdEluZGVudFNpZ24oZWRpdG9yLCBlZGl0b3IuZ2V0Q3Vyc29yKCkpICE9PSBudWxsO1xuICB9XG59XG4iLCJpbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gXCIuL3NldHRpbmdzXCI7XG5cbmV4cG9ydCBjbGFzcyBMb2dnZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNldHRpbmdzOiBTZXR0aW5ncykge31cblxuICBsb2cobWV0aG9kOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgaWYgKCF0aGlzLnNldHRpbmdzLmRlYnVnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc29sZS5pbmZvKG1ldGhvZCwgLi4uYXJncyk7XG4gIH1cblxuICBiaW5kKG1ldGhvZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuICguLi5hcmdzOiBhbnlbXSkgPT4gdGhpcy5sb2cobWV0aG9kLCAuLi5hcmdzKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tIFwiLi4vc2V0dGluZ3NcIjtcbmltcG9ydCB7IFBsdWdpbl8yIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBJRmVhdHVyZSB9IGZyb20gXCIuLi9mZWF0dXJlXCI7XG5pbXBvcnQgeyBPYnNpZGlhblV0aWxzIH0gZnJvbSBcIi4uL29ic2lkaWFuX3V0aWxzXCI7XG5cbmNvbnN0IHRleHQgPSAoc2l6ZTogbnVtYmVyKSA9PlxuICBgT3V0bGluZXIgc3R5bGVzIGRvZXNuJ3Qgd29yayB3aXRoICR7c2l6ZX0tc3BhY2VzLXRhYnMuIFBsZWFzZSBjaGVjayB5b3VyIE9ic2lkaWFuIHNldHRpbmdzLmA7XG5cbmV4cG9ydCBjbGFzcyBMaXN0c1N0eWxlc0ZlYXR1cmUgaW1wbGVtZW50cyBJRmVhdHVyZSB7XG4gIHByaXZhdGUgc3RhdHVzQmFyVGV4dDogSFRNTEVsZW1lbnQ7XG4gIHByaXZhdGUgaW50ZXJ2YWw6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBzZXR0aW5nczogU2V0dGluZ3MsXG4gICAgcHJpdmF0ZSBvYnNpZGlhblV0aWxzOiBPYnNpZGlhblV0aWxzXG4gICkge31cblxuICBhc3luYyBsb2FkKCkge1xuICAgIGlmICh0aGlzLnNldHRpbmdzLnN0eWxlTGlzdHMpIHtcbiAgICAgIHRoaXMuYWRkTGlzdHNTdHlsZXMoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2V0dGluZ3Muem9vbU9uQ2xpY2spIHtcbiAgICAgIHRoaXMuYWRkWm9vbVN0eWxlcygpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0dGluZ3Mub25DaGFuZ2UoXCJzdHlsZUxpc3RzXCIsIHRoaXMub25TdHlsZUxpc3RzU2V0dGluZ0NoYW5nZSk7XG4gICAgdGhpcy5zZXR0aW5ncy5vbkNoYW5nZShcInpvb21PbkNsaWNrXCIsIHRoaXMub25ab29tT25DbGlja1NldHRpbmdDaGFuZ2UpO1xuXG4gICAgdGhpcy5hZGRTdGF0dXNCYXJUZXh0KCk7XG4gICAgdGhpcy5zdGFydFN0YXR1c0JhckludGVydmFsKCk7XG4gIH1cblxuICBhc3luYyB1bmxvYWQoKSB7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICBpZiAodGhpcy5zdGF0dXNCYXJUZXh0LnBhcmVudEVsZW1lbnQpIHtcbiAgICAgIHRoaXMuc3RhdHVzQmFyVGV4dC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuc3RhdHVzQmFyVGV4dCk7XG4gICAgfVxuICAgIHRoaXMuc2V0dGluZ3MucmVtb3ZlQ2FsbGJhY2soXG4gICAgICBcInpvb21PbkNsaWNrXCIsXG4gICAgICB0aGlzLm9uWm9vbU9uQ2xpY2tTZXR0aW5nQ2hhbmdlXG4gICAgKTtcbiAgICB0aGlzLnNldHRpbmdzLnJlbW92ZUNhbGxiYWNrKFwic3R5bGVMaXN0c1wiLCB0aGlzLm9uU3R5bGVMaXN0c1NldHRpbmdDaGFuZ2UpO1xuICAgIHRoaXMucmVtb3ZlTGlzdHNTdHlsZXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhcnRTdGF0dXNCYXJJbnRlcnZhbCgpIHtcbiAgICBsZXQgdmlzaWJsZTogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgICB0aGlzLmludGVydmFsID0gd2luZG93LnNldEludGVydmFsKCgpID0+IHtcbiAgICAgIGNvbnN0IHsgdXNlVGFiLCB0YWJTaXplIH0gPSB0aGlzLm9ic2lkaWFuVXRpbHMuZ2V0T2JzaWRpYW5UYWJzU2V0dGlnbnMoKTtcblxuICAgICAgY29uc3Qgc2hvdWxkQmVWaXNpYmxlID1cbiAgICAgICAgdGhpcy5zZXR0aW5ncy5zdHlsZUxpc3RzICYmIHVzZVRhYiAmJiB0YWJTaXplICE9PSA0O1xuXG4gICAgICBpZiAoc2hvdWxkQmVWaXNpYmxlICYmIHZpc2libGUgIT09IHRhYlNpemUpIHtcbiAgICAgICAgdGhpcy5zdGF0dXNCYXJUZXh0LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgIHRoaXMuc3RhdHVzQmFyVGV4dC5zZXRUZXh0KHRleHQodGFiU2l6ZSkpO1xuICAgICAgICB2aXNpYmxlID0gdGFiU2l6ZTtcbiAgICAgIH0gZWxzZSBpZiAoIXNob3VsZEJlVmlzaWJsZSAmJiB2aXNpYmxlICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuc3RhdHVzQmFyVGV4dC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIHZpc2libGUgPSBudWxsO1xuICAgICAgfVxuICAgIH0sIDEwMDApO1xuICB9XG5cbiAgcHJpdmF0ZSBvblN0eWxlTGlzdHNTZXR0aW5nQ2hhbmdlID0gKHN0eWxlTGlzdHM6IGJvb2xlYW4pID0+IHtcbiAgICBpZiAoc3R5bGVMaXN0cykge1xuICAgICAgdGhpcy5hZGRMaXN0c1N0eWxlcygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbW92ZUxpc3RzU3R5bGVzKCk7XG4gICAgfVxuICB9O1xuXG4gIHByaXZhdGUgb25ab29tT25DbGlja1NldHRpbmdDaGFuZ2UgPSAoem9vbU9uQ2xpY2s6IGJvb2xlYW4pID0+IHtcbiAgICBpZiAoem9vbU9uQ2xpY2spIHtcbiAgICAgIHRoaXMuYWRkWm9vbVN0eWxlcygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbW92ZVpvb21TdHlsZXMoKTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSBhZGRTdGF0dXNCYXJUZXh0KCkge1xuICAgIHRoaXMuc3RhdHVzQmFyVGV4dCA9IHRoaXMucGx1Z2luLmFkZFN0YXR1c0Jhckl0ZW0oKTtcbiAgICB0aGlzLnN0YXR1c0JhclRleHQuc3R5bGUuY29sb3IgPSBcInJlZFwiO1xuICAgIHRoaXMuc3RhdHVzQmFyVGV4dC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gIH1cblxuICBwcml2YXRlIGFkZExpc3RzU3R5bGVzKCkge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChcIm91dGxpbmVyLXBsdWdpbi1ibHNcIik7XG4gIH1cblxuICBwcml2YXRlIHJlbW92ZUxpc3RzU3R5bGVzKCkge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcIm91dGxpbmVyLXBsdWdpbi1ibHNcIik7XG4gIH1cblxuICBwcml2YXRlIGFkZFpvb21TdHlsZXMoKSB7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKFwib3V0bGluZXItcGx1Z2luLWJscy16b29tXCIpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVab29tU3R5bGVzKCkge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcIm91dGxpbmVyLXBsdWdpbi1ibHMtem9vbVwiKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUGx1Z2luXzIgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IEVkaXRvclV0aWxzIH0gZnJvbSBcIi4uL2VkaXRvcl91dGlsc1wiO1xuaW1wb3J0IHsgSUZlYXR1cmUgfSBmcm9tIFwiLi4vZmVhdHVyZVwiO1xuaW1wb3J0IHsgTGlzdFV0aWxzIH0gZnJvbSBcIi4uL2xpc3RfdXRpbHNcIjtcbmltcG9ydCB7IFNldHRpbmdzIH0gZnJvbSBcIi4uL3NldHRpbmdzXCI7XG5cbmZ1bmN0aW9uIGlzRW50ZXIoZTogS2V5Ym9hcmRFdmVudCkge1xuICByZXR1cm4gKFxuICAgIGUuY29kZSA9PT0gXCJFbnRlclwiICYmXG4gICAgZS5zaGlmdEtleSA9PT0gZmFsc2UgJiZcbiAgICBlLm1ldGFLZXkgPT09IGZhbHNlICYmXG4gICAgZS5hbHRLZXkgPT09IGZhbHNlICYmXG4gICAgZS5jdHJsS2V5ID09PSBmYWxzZVxuICApO1xufVxuXG5leHBvcnQgY2xhc3MgRW50ZXJPdXRkZW50SWZMaW5lSXNFbXB0eUZlYXR1cmUgaW1wbGVtZW50cyBJRmVhdHVyZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcGx1Z2luOiBQbHVnaW5fMixcbiAgICBwcml2YXRlIHNldHRpbmdzOiBTZXR0aW5ncyxcbiAgICBwcml2YXRlIGVkaXRvclV0aWxzOiBFZGl0b3JVdGlscyxcbiAgICBwcml2YXRlIGxpc3RVdGlsczogTGlzdFV0aWxzXG4gICkge31cblxuICBhc3luYyBsb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLnJlZ2lzdGVyQ29kZU1pcnJvcigoY20pID0+IHtcbiAgICAgIGNtLm9uKFwia2V5ZG93blwiLCB0aGlzLm9uS2V5RG93bik7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyB1bmxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4uYXBwLndvcmtzcGFjZS5pdGVyYXRlQ29kZU1pcnJvcnMoKGNtKSA9PiB7XG4gICAgICBjbS5vZmYoXCJrZXlkb3duXCIsIHRoaXMub25LZXlEb3duKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgb3V0ZGVudElmTGluZUlzRW1wdHkoZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcikge1xuICAgIGlmICghdGhpcy5lZGl0b3JVdGlscy5jb250YWluc1NpbmdsZUN1cnNvcihlZGl0b3IpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3Qgcm9vdCA9IHRoaXMubGlzdFV0aWxzLnBhcnNlTGlzdChlZGl0b3IpO1xuXG4gICAgaWYgKCFyb290KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgbGlzdCA9IHJvb3QuZ2V0TGlzdFVuZGVyQ3Vyc29yKCk7XG5cbiAgICBpZiAobGlzdC5nZXRDb250ZW50KCkubGVuZ3RoID4gMCB8fCBsaXN0LmdldExldmVsKCkgPT09IDEpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByb290Lm1vdmVMZWZ0KCk7XG5cbiAgICB0aGlzLmxpc3RVdGlscy5hcHBseUNoYW5nZXMoZWRpdG9yLCByb290KTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSBvbktleURvd24gPSAoY206IENvZGVNaXJyb3IuRWRpdG9yLCBlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgaWYgKCF0aGlzLnNldHRpbmdzLmJldHRlckVudGVyIHx8ICFpc0VudGVyKGUpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgd29ya2VkID0gdGhpcy5vdXRkZW50SWZMaW5lSXNFbXB0eShjbSk7XG5cbiAgICBpZiAod29ya2VkKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cbiAgfTtcbn1cbiIsImltcG9ydCB7IFBsdWdpbl8yIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBJRmVhdHVyZSB9IGZyb20gXCIuLi9mZWF0dXJlXCI7XG5pbXBvcnQgeyBMaXN0VXRpbHMgfSBmcm9tIFwiLi4vbGlzdF91dGlsc1wiO1xuaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tIFwiLi4vc2V0dGluZ3NcIjtcblxuZXhwb3J0IGNsYXNzIEVudGVyU2hvdWxkQ3JlYXRlTmV3bGluZU9uQ2hpbGRMZXZlbEZlYXR1cmUgaW1wbGVtZW50cyBJRmVhdHVyZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcGx1Z2luOiBQbHVnaW5fMixcbiAgICBwcml2YXRlIHNldHRpbmdzOiBTZXR0aW5ncyxcbiAgICBwcml2YXRlIGxpc3RVdGlsczogTGlzdFV0aWxzXG4gICkge31cblxuICBhc3luYyBsb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLnJlZ2lzdGVyQ29kZU1pcnJvcigoY20pID0+IHtcbiAgICAgIGNtLm9uKFwiYmVmb3JlQ2hhbmdlXCIsIHRoaXMub25CZWZvcmVDaGFuZ2UpO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdW5sb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLmFwcC53b3Jrc3BhY2UuaXRlcmF0ZUNvZGVNaXJyb3JzKChjbSkgPT4ge1xuICAgICAgY20ub2ZmKFwiYmVmb3JlQ2hhbmdlXCIsIHRoaXMub25CZWZvcmVDaGFuZ2UpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBvbkJlZm9yZUNoYW5nZSA9IChcbiAgICBjbTogQ29kZU1pcnJvci5FZGl0b3IsXG4gICAgY2hhbmdlT2JqOiBDb2RlTWlycm9yLkVkaXRvckNoYW5nZUNhbmNlbGxhYmxlXG4gICkgPT4ge1xuICAgIGlmICghdGhpcy5zZXR0aW5ncy5iZXR0ZXJFbnRlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHsgbGlzdFV0aWxzIH0gPSB0aGlzO1xuXG4gICAgY29uc3QgY3VycmVudExpbmUgPSBjbS5nZXRMaW5lKGNoYW5nZU9iai5mcm9tLmxpbmUpO1xuICAgIGNvbnN0IG5leHRMaW5lID0gY20uZ2V0TGluZShjaGFuZ2VPYmouZnJvbS5saW5lICsgMSk7XG5cbiAgICBpZiAoIWN1cnJlbnRMaW5lIHx8ICFuZXh0TGluZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGluZGVudFNpZ24gPSBsaXN0VXRpbHMuZGV0ZWN0TGlzdEluZGVudFNpZ24oY20sIGNoYW5nZU9iai5mcm9tKTtcblxuICAgIGlmIChpbmRlbnRTaWduID09PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY3VycmVudExpbmVJbmZvID0gbGlzdFV0aWxzLmdldExpc3RMaW5lSW5mbyhjdXJyZW50TGluZSwgaW5kZW50U2lnbik7XG4gICAgY29uc3QgbmV4dExpbmVJbmZvID0gbGlzdFV0aWxzLmdldExpc3RMaW5lSW5mbyhuZXh0TGluZSwgaW5kZW50U2lnbik7XG5cbiAgICBpZiAoIWN1cnJlbnRMaW5lSW5mbyB8fCAhbmV4dExpbmVJbmZvKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY2hhbmdlSXNOZXdsaW5lID1cbiAgICAgIGNoYW5nZU9iai50ZXh0Lmxlbmd0aCA9PT0gMiAmJlxuICAgICAgY2hhbmdlT2JqLnRleHRbMF0gPT09IFwiXCIgJiZcbiAgICAgICEhbGlzdFV0aWxzLmdldExpc3RMaW5lSW5mbyhjaGFuZ2VPYmoudGV4dFsxXSwgaW5kZW50U2lnbik7XG5cbiAgICBjb25zdCBuZXhsaW5lTGV2ZWxJc0JpZ2dlciA9XG4gICAgICBjdXJyZW50TGluZUluZm8uaW5kZW50TGV2ZWwgKyAxID09IG5leHRMaW5lSW5mby5pbmRlbnRMZXZlbDtcblxuICAgIGNvbnN0IG5leHRMaW5lSXNFbXB0eSA9XG4gICAgICBjbS5nZXRSYW5nZShjaGFuZ2VPYmouZnJvbSwge1xuICAgICAgICBsaW5lOiBjaGFuZ2VPYmouZnJvbS5saW5lLFxuICAgICAgICBjaDogY2hhbmdlT2JqLmZyb20uY2ggKyAxLFxuICAgICAgfSkubGVuZ3RoID09PSAwO1xuXG4gICAgaWYgKGNoYW5nZUlzTmV3bGluZSAmJiBuZXhsaW5lTGV2ZWxJc0JpZ2dlciAmJiBuZXh0TGluZUlzRW1wdHkpIHtcbiAgICAgIGNoYW5nZU9iai50ZXh0WzFdID0gaW5kZW50U2lnbiArIGNoYW5nZU9iai50ZXh0WzFdO1xuICAgICAgY2hhbmdlT2JqLnVwZGF0ZShjaGFuZ2VPYmouZnJvbSwgY2hhbmdlT2JqLnRvLCBjaGFuZ2VPYmoudGV4dCk7XG4gICAgfVxuICB9O1xufVxuIiwiaW1wb3J0IHsgUGx1Z2luXzIgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IElGZWF0dXJlIH0gZnJvbSBcInNyYy9mZWF0dXJlXCI7XG5pbXBvcnQgeyBMaXN0VXRpbHMgfSBmcm9tIFwic3JjL2xpc3RfdXRpbHNcIjtcbmltcG9ydCB7IFNldHRpbmdzIH0gZnJvbSBcInNyYy9zZXR0aW5nc1wiO1xuXG5leHBvcnQgY2xhc3MgTW92ZUN1cnNvclRvUHJldmlvdXNVbmZvbGRlZExpbmVGZWF0dXJlIGltcGxlbWVudHMgSUZlYXR1cmUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBzZXR0aW5nczogU2V0dGluZ3MsXG4gICAgcHJpdmF0ZSBsaXN0c1V0aWxzOiBMaXN0VXRpbHNcbiAgKSB7fVxuXG4gIGFzeW5jIGxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4ucmVnaXN0ZXJDb2RlTWlycm9yKChjbSkgPT4ge1xuICAgICAgY20ub24oXCJiZWZvcmVTZWxlY3Rpb25DaGFuZ2VcIiwgdGhpcy5oYW5kbGVCZWZvcmVTZWxlY3Rpb25DaGFuZ2UpO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdW5sb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLmFwcC53b3Jrc3BhY2UuaXRlcmF0ZUNvZGVNaXJyb3JzKChjbSkgPT4ge1xuICAgICAgY20ub2ZmKFwiYmVmb3JlU2VsZWN0aW9uQ2hhbmdlXCIsIHRoaXMuaGFuZGxlQmVmb3JlU2VsZWN0aW9uQ2hhbmdlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgaXRlcmF0ZVdoaWxlRm9sZGVkKFxuICAgIGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IsXG4gICAgcG9zOiBDb2RlTWlycm9yLlBvc2l0aW9uLFxuICAgIGluYzogKHBvczogQ29kZU1pcnJvci5Qb3NpdGlvbikgPT4gdm9pZFxuICApIHtcbiAgICBsZXQgZm9sZGVkID0gZmFsc2U7XG4gICAgZG8ge1xuICAgICAgaW5jKHBvcyk7XG4gICAgICBmb2xkZWQgPSAoZWRpdG9yIGFzIGFueSkuaXNGb2xkZWQocG9zKTtcbiAgICB9IHdoaWxlIChmb2xkZWQpO1xuICAgIHJldHVybiBwb3M7XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZUJlZm9yZVNlbGVjdGlvbkNoYW5nZSA9IChcbiAgICBjbTogQ29kZU1pcnJvci5FZGl0b3IsXG4gICAgY2hhbmdlT2JqOiBDb2RlTWlycm9yLkVkaXRvclNlbGVjdGlvbkNoYW5nZVxuICApID0+IHtcbiAgICBpZiAoXG4gICAgICAhdGhpcy5zZXR0aW5ncy5zdGlja0N1cnNvciB8fFxuICAgICAgY2hhbmdlT2JqLm9yaWdpbiAhPT0gXCIrbW92ZVwiIHx8XG4gICAgICBjaGFuZ2VPYmoucmFuZ2VzLmxlbmd0aCA+IDFcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCByYW5nZSA9IGNoYW5nZU9iai5yYW5nZXNbMF07XG4gICAgY29uc3QgY3Vyc29yID0gY20uZ2V0Q3Vyc29yKCk7XG5cbiAgICBpZiAoXG4gICAgICByYW5nZS5hbmNob3IubGluZSAhPT0gcmFuZ2UuaGVhZC5saW5lIHx8XG4gICAgICByYW5nZS5hbmNob3IuY2ggIT09IHJhbmdlLmhlYWQuY2hcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY3Vyc29yLmxpbmUgPD0gMCB8fCBjdXJzb3IubGluZSAhPT0gcmFuZ2UuYW5jaG9yLmxpbmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCByb290ID0gdGhpcy5saXN0c1V0aWxzLnBhcnNlTGlzdChjbSk7XG5cbiAgICBpZiAoIXJvb3QpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsaXN0ID0gcm9vdC5nZXRMaXN0VW5kZXJDdXJzb3IoKTtcbiAgICBjb25zdCBsaXN0Q29udGVudFN0YXJ0Q2ggPSBsaXN0LmdldENvbnRlbnRTdGFydENoKCk7XG5cbiAgICBpZiAoXG4gICAgICBjdXJzb3IuY2ggPT09IGxpc3RDb250ZW50U3RhcnRDaCAmJlxuICAgICAgcmFuZ2UuYW5jaG9yLmNoID09PSBsaXN0Q29udGVudFN0YXJ0Q2ggLSAxXG4gICAgKSB7XG4gICAgICBjb25zdCBuZXdDdXJzb3IgPSB0aGlzLml0ZXJhdGVXaGlsZUZvbGRlZChcbiAgICAgICAgY20sXG4gICAgICAgIHtcbiAgICAgICAgICBsaW5lOiBjdXJzb3IubGluZSxcbiAgICAgICAgICBjaDogMCxcbiAgICAgICAgfSxcbiAgICAgICAgKHBvcykgPT4ge1xuICAgICAgICAgIHBvcy5saW5lLS07XG4gICAgICAgICAgcG9zLmNoID0gY20uZ2V0TGluZShwb3MubGluZSkubGVuZ3RoIC0gMTtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICAgIG5ld0N1cnNvci5jaCsrO1xuICAgICAgcmFuZ2UuYW5jaG9yLmxpbmUgPSBuZXdDdXJzb3IubGluZTtcbiAgICAgIHJhbmdlLmFuY2hvci5jaCA9IG5ld0N1cnNvci5jaDtcbiAgICAgIHJhbmdlLmhlYWQubGluZSA9IG5ld0N1cnNvci5saW5lO1xuICAgICAgcmFuZ2UuaGVhZC5jaCA9IG5ld0N1cnNvci5jaDtcbiAgICAgIGNoYW5nZU9iai51cGRhdGUoW3JhbmdlXSk7XG4gICAgfVxuICB9O1xufVxuIiwiaW1wb3J0IHsgUGx1Z2luXzIgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IEVkaXRvclV0aWxzIH0gZnJvbSBcInNyYy9lZGl0b3JfdXRpbHNcIjtcbmltcG9ydCB7IElGZWF0dXJlIH0gZnJvbSBcInNyYy9mZWF0dXJlXCI7XG5pbXBvcnQgeyBMaXN0VXRpbHMgfSBmcm9tIFwic3JjL2xpc3RfdXRpbHNcIjtcbmltcG9ydCB7IFNldHRpbmdzIH0gZnJvbSBcInNyYy9zZXR0aW5nc1wiO1xuXG5leHBvcnQgY2xhc3MgRW5zdXJlQ3Vyc29ySW5MaXN0Q29udGVudEZlYXR1cmUgaW1wbGVtZW50cyBJRmVhdHVyZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcGx1Z2luOiBQbHVnaW5fMixcbiAgICBwcml2YXRlIHNldHRpbmdzOiBTZXR0aW5ncyxcbiAgICBwcml2YXRlIGVkaXRvclV0aWxzOiBFZGl0b3JVdGlscyxcbiAgICBwcml2YXRlIGxpc3RzVXRpbHM6IExpc3RVdGlsc1xuICApIHt9XG5cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5yZWdpc3RlckNvZGVNaXJyb3IoKGNtKSA9PiB7XG4gICAgICBjbS5vbihcImN1cnNvckFjdGl2aXR5XCIsIHRoaXMuaGFuZGxlQ3Vyc29yQWN0aXZpdHkpO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdW5sb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLmFwcC53b3Jrc3BhY2UuaXRlcmF0ZUNvZGVNaXJyb3JzKChjbSkgPT4ge1xuICAgICAgY20ub2ZmKFwiY3Vyc29yQWN0aXZpdHlcIiwgdGhpcy5oYW5kbGVDdXJzb3JBY3Rpdml0eSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGVuc3VyZUN1cnNvckluTGlzdENvbnRlbnQoZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcikge1xuICAgIGNvbnN0IGN1cnNvciA9IGVkaXRvci5nZXRDdXJzb3IoKTtcbiAgICBjb25zdCBpbmRlbnRTaWduID0gdGhpcy5saXN0c1V0aWxzLmRldGVjdExpc3RJbmRlbnRTaWduKGVkaXRvciwgY3Vyc29yKTtcblxuICAgIGlmIChpbmRlbnRTaWduID09PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbGluZSA9IGVkaXRvci5nZXRMaW5lKGN1cnNvci5saW5lKTtcbiAgICBjb25zdCBsaW5lUHJlZml4ID0gdGhpcy5saXN0c1V0aWxzLmdldExpc3RMaW5lSW5mbyhsaW5lLCBpbmRlbnRTaWduKVxuICAgICAgLnByZWZpeExlbmd0aDtcblxuICAgIGlmIChjdXJzb3IuY2ggPCBsaW5lUHJlZml4KSB7XG4gICAgICBjdXJzb3IuY2ggPSBsaW5lUHJlZml4O1xuICAgICAgZWRpdG9yLnNldEN1cnNvcihjdXJzb3IpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZW5zdXJlQ3Vyc29ySXNJblVuZm9sZGVkTGluZShlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yKSB7XG4gICAgY29uc3QgY3Vyc29yID0gZWRpdG9yLmdldEN1cnNvcigpO1xuXG4gICAgY29uc3QgbWFyayA9IGVkaXRvci5maW5kTWFya3NBdChjdXJzb3IpLmZpbmQoKG0pID0+IChtIGFzIGFueSkuX19pc0ZvbGQpO1xuXG4gICAgaWYgKCFtYXJrKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZmlyc3RGb2xkaW5nTGluZTogQ29kZU1pcnJvci5MaW5lSGFuZGxlID0gKG1hcmsgYXMgYW55KS5saW5lc1swXTtcblxuICAgIGlmICghZmlyc3RGb2xkaW5nTGluZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGxpbmVObyA9IGVkaXRvci5nZXRMaW5lTnVtYmVyKGZpcnN0Rm9sZGluZ0xpbmUpO1xuXG4gICAgaWYgKGxpbmVObyAhPT0gY3Vyc29yLmxpbmUpIHtcbiAgICAgIGVkaXRvci5zZXRDdXJzb3Ioe1xuICAgICAgICBsaW5lOiBsaW5lTm8sXG4gICAgICAgIGNoOiBlZGl0b3IuZ2V0TGluZShsaW5lTm8pLmxlbmd0aCxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlQ3Vyc29yQWN0aXZpdHkgPSAoY206IENvZGVNaXJyb3IuRWRpdG9yKSA9PiB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5zZXR0aW5ncy5zdGlja0N1cnNvciAmJlxuICAgICAgdGhpcy5lZGl0b3JVdGlscy5jb250YWluc1NpbmdsZUN1cnNvcihjbSkgJiZcbiAgICAgIHRoaXMubGlzdHNVdGlscy5pc0N1cnNvckluTGlzdChjbSlcbiAgICApIHtcbiAgICAgIHRoaXMuZW5zdXJlQ3Vyc29ySXNJblVuZm9sZGVkTGluZShjbSk7XG4gICAgICB0aGlzLmVuc3VyZUN1cnNvckluTGlzdENvbnRlbnQoY20pO1xuICAgIH1cbiAgfTtcbn1cbiIsImltcG9ydCB7IFBsdWdpbl8yIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBFZGl0b3JVdGlscyB9IGZyb20gXCJzcmMvZWRpdG9yX3V0aWxzXCI7XG5pbXBvcnQgeyBJRmVhdHVyZSB9IGZyb20gXCJzcmMvZmVhdHVyZVwiO1xuaW1wb3J0IHsgTGlzdFV0aWxzIH0gZnJvbSBcInNyYy9saXN0X3V0aWxzXCI7XG5pbXBvcnQgeyBSb290IH0gZnJvbSBcInNyYy9yb290XCI7XG5pbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gXCJzcmMvc2V0dGluZ3NcIjtcblxuZXhwb3J0IGNsYXNzIERlbGV0ZVNob3VsZElnbm9yZUJ1bGxldHNGZWF0dXJlIGltcGxlbWVudHMgSUZlYXR1cmUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBzZXR0aW5nczogU2V0dGluZ3MsXG4gICAgcHJpdmF0ZSBlZGl0b3JVdGlsczogRWRpdG9yVXRpbHMsXG4gICAgcHJpdmF0ZSBsaXN0c1V0aWxzOiBMaXN0VXRpbHNcbiAgKSB7fVxuXG4gIGFzeW5jIGxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4ucmVnaXN0ZXJDb2RlTWlycm9yKChjbSkgPT4ge1xuICAgICAgY20ub24oXCJiZWZvcmVDaGFuZ2VcIiwgdGhpcy5oYW5kbGVCZWZvcmVDaGFuZ2UpO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdW5sb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLmFwcC53b3Jrc3BhY2UuaXRlcmF0ZUNvZGVNaXJyb3JzKChjbSkgPT4ge1xuICAgICAgY20ub2ZmKFwiYmVmb3JlQ2hhbmdlXCIsIHRoaXMuaGFuZGxlQmVmb3JlQ2hhbmdlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlQmVmb3JlQ2hhbmdlID0gKFxuICAgIGNtOiBDb2RlTWlycm9yLkVkaXRvcixcbiAgICBjaGFuZ2VPYmo6IENvZGVNaXJyb3IuRWRpdG9yQ2hhbmdlQ2FuY2VsbGFibGVcbiAgKSA9PiB7XG4gICAgaWYgKFxuICAgICAgY2hhbmdlT2JqLm9yaWdpbiAhPT0gXCIrZGVsZXRlXCIgfHxcbiAgICAgICF0aGlzLnNldHRpbmdzLnN0aWNrQ3Vyc29yIHx8XG4gICAgICAhdGhpcy5lZGl0b3JVdGlscy5jb250YWluc1NpbmdsZUN1cnNvcihjbSlcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCByb290ID0gdGhpcy5saXN0c1V0aWxzLnBhcnNlTGlzdChjbSk7XG5cbiAgICBpZiAoIXJvb3QpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsaXN0ID0gcm9vdC5nZXRMaXN0VW5kZXJDdXJzb3IoKTtcbiAgICBjb25zdCBsaXN0Q29udGVudFN0YXJ0Q2ggPSBsaXN0LmdldENvbnRlbnRTdGFydENoKCk7XG4gICAgY29uc3QgbGlzdENvbnRlbnRFbmRDaCA9IGxpc3QuZ2V0Q29udGVudEVuZENoKCk7XG5cbiAgICBpZiAodGhpcy5pc0JhY2tzcGFjZU9uQ29udGVudFN0YXJ0KGNoYW5nZU9iaiwgbGlzdENvbnRlbnRTdGFydENoKSkge1xuICAgICAgdGhpcy5kZWxldGVJdGVtQW5kTWVyZ2VDb250ZW50V2l0aFByZXZpb3VzTGluZShjbSwgcm9vdCwgY2hhbmdlT2JqKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNEZWxldGlvbkluY2x1ZGVzQnVsbGV0KGNoYW5nZU9iaiwgbGlzdENvbnRlbnRTdGFydENoKSkge1xuICAgICAgdGhpcy5saW1pdERlbGV0ZVJhbmdlVG9Db250ZW50UmFuZ2UoY2hhbmdlT2JqLCBsaXN0Q29udGVudFN0YXJ0Q2gpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc0RlbGV0ZU9uTGluZUVuZChjaGFuZ2VPYmosIGxpc3RDb250ZW50RW5kQ2gpKSB7XG4gICAgICB0aGlzLmRlbGV0ZU5leHRJdGVtQW5kTWVyZ2VDb250ZW50V2l0aEN1cnJlbnRMaW5lKGNtLCByb290LCBjaGFuZ2VPYmopO1xuICAgIH1cbiAgfTtcblxuICBwcml2YXRlIGlzRGVsZXRlT25MaW5lRW5kKFxuICAgIGNoYW5nZU9iajogQ29kZU1pcnJvci5FZGl0b3JDaGFuZ2VDYW5jZWxsYWJsZSxcbiAgICBsaXN0Q29udGVudEVuZENoOiBudW1iZXJcbiAgKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIGNoYW5nZU9iai5mcm9tLmxpbmUgKyAxID09PSBjaGFuZ2VPYmoudG8ubGluZSAmJlxuICAgICAgY2hhbmdlT2JqLmZyb20uY2ggPT09IGxpc3RDb250ZW50RW5kQ2ggJiZcbiAgICAgIGNoYW5nZU9iai50by5jaCA9PT0gMFxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIGlzRGVsZXRpb25JbmNsdWRlc0J1bGxldChcbiAgICBjaGFuZ2VPYmo6IENvZGVNaXJyb3IuRWRpdG9yQ2hhbmdlQ2FuY2VsbGFibGUsXG4gICAgbGlzdENvbnRlbnRTdGFydENoOiBudW1iZXJcbiAgKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIGNoYW5nZU9iai5mcm9tLmxpbmUgPT09IGNoYW5nZU9iai50by5saW5lICYmXG4gICAgICBjaGFuZ2VPYmouZnJvbS5jaCA8IGxpc3RDb250ZW50U3RhcnRDaFxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIGlzQmFja3NwYWNlT25Db250ZW50U3RhcnQoXG4gICAgY2hhbmdlT2JqOiBDb2RlTWlycm9yLkVkaXRvckNoYW5nZUNhbmNlbGxhYmxlLFxuICAgIGxpc3RDb250ZW50U3RhcnRDaDogbnVtYmVyXG4gICkge1xuICAgIHJldHVybiAoXG4gICAgICBjaGFuZ2VPYmouZnJvbS5saW5lID09PSBjaGFuZ2VPYmoudG8ubGluZSAmJlxuICAgICAgY2hhbmdlT2JqLmZyb20uY2ggPT09IGxpc3RDb250ZW50U3RhcnRDaCAtIDEgJiZcbiAgICAgIGNoYW5nZU9iai50by5jaCA9PT0gbGlzdENvbnRlbnRTdGFydENoXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgbGltaXREZWxldGVSYW5nZVRvQ29udGVudFJhbmdlKFxuICAgIGNoYW5nZU9iajogQ29kZU1pcnJvci5FZGl0b3JDaGFuZ2VDYW5jZWxsYWJsZSxcbiAgICBsaXN0Q29udGVudFN0YXJ0Q2g6IG51bWJlclxuICApIHtcbiAgICBjb25zdCBmcm9tID0ge1xuICAgICAgbGluZTogY2hhbmdlT2JqLmZyb20ubGluZSxcbiAgICAgIGNoOiBsaXN0Q29udGVudFN0YXJ0Q2gsXG4gICAgfTtcbiAgICBjaGFuZ2VPYmoudXBkYXRlKGZyb20sIGNoYW5nZU9iai50bywgY2hhbmdlT2JqLnRleHQpO1xuICB9XG5cbiAgcHJpdmF0ZSBkZWxldGVJdGVtQW5kTWVyZ2VDb250ZW50V2l0aFByZXZpb3VzTGluZShcbiAgICBlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yLFxuICAgIHJvb3Q6IFJvb3QsXG4gICAgY2hhbmdlT2JqOiBDb2RlTWlycm9yLkVkaXRvckNoYW5nZUNhbmNlbGxhYmxlXG4gICkge1xuICAgIGNvbnN0IGxpc3QgPSByb290LmdldExpc3RVbmRlckN1cnNvcigpO1xuICAgIGlmIChcbiAgICAgIHJvb3QuZ2V0TGlzdFN0YXJ0UG9zaXRpb24oKS5saW5lID09PSByb290LmdldExpbmVOdW1iZXJPZihsaXN0KSAmJlxuICAgICAgbGlzdC5nZXRDaGlsZHJlbigpLmxlbmd0aCA9PT0gMFxuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHJlcyA9IHJvb3QuZGVsZXRlQW5kTWVyZ2VXaXRoUHJldmlvdXMoKTtcblxuICAgIGlmIChyZXMpIHtcbiAgICAgIGNoYW5nZU9iai5jYW5jZWwoKTtcbiAgICAgIHRoaXMubGlzdHNVdGlscy5hcHBseUNoYW5nZXMoZWRpdG9yLCByb290KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgcHJpdmF0ZSBkZWxldGVOZXh0SXRlbUFuZE1lcmdlQ29udGVudFdpdGhDdXJyZW50TGluZShcbiAgICBlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yLFxuICAgIHJvb3Q6IFJvb3QsXG4gICAgY2hhbmdlT2JqOiBDb2RlTWlycm9yLkVkaXRvckNoYW5nZUNhbmNlbGxhYmxlXG4gICkge1xuICAgIGNvbnN0IGxpc3QgPSByb290LmdldExpc3RVbmRlckN1cnNvcigpO1xuICAgIGNvbnN0IG5leHRMaW5lTm8gPSByb290LmdldEN1cnNvcigpLmxpbmUgKyAxO1xuICAgIGNvbnN0IG5leHRMaXN0ID0gcm9vdC5nZXRMaXN0VW5kZXJMaW5lKG5leHRMaW5lTm8pO1xuXG4gICAgaWYgKCFuZXh0TGlzdCB8fCByb290LmdldEN1cnNvcigpLmNoICE9PSBsaXN0LmdldENvbnRlbnRFbmRDaCgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcm9vdC5yZXBsYWNlQ3Vyc29yKHtcbiAgICAgIGxpbmU6IG5leHRMaW5lTm8sXG4gICAgICBjaDogbmV4dExpc3QuZ2V0Q29udGVudFN0YXJ0Q2goKSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHJlcyA9IHJvb3QuZGVsZXRlQW5kTWVyZ2VXaXRoUHJldmlvdXMoKTtcbiAgICBjb25zdCByZWFsbHlDaGFuZ2VkID0gcm9vdC5nZXRDdXJzb3IoKS5saW5lICE9PSBuZXh0TGluZU5vO1xuXG4gICAgaWYgKHJlYWxseUNoYW5nZWQpIHtcbiAgICAgIGNoYW5nZU9iai5jYW5jZWwoKTtcbiAgICAgIHRoaXMubGlzdHNVdGlscy5hcHBseUNoYW5nZXMoZWRpdG9yLCByb290KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzO1xuICB9XG59XG4iLCJpbXBvcnQgeyBQbHVnaW5fMiB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgTGlzdFV0aWxzIH0gZnJvbSBcInNyYy9saXN0X3V0aWxzXCI7XG5pbXBvcnQgeyBJRmVhdHVyZSB9IGZyb20gXCIuLi9mZWF0dXJlXCI7XG5pbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gXCIuLi9zZXR0aW5nc1wiO1xuXG5leHBvcnQgY2xhc3MgU2VsZWN0aW9uU2hvdWxkSWdub3JlQnVsbGV0c0ZlYXR1cmUgaW1wbGVtZW50cyBJRmVhdHVyZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcGx1Z2luOiBQbHVnaW5fMixcbiAgICBwcml2YXRlIHNldHRpbmdzOiBTZXR0aW5ncyxcbiAgICBwcml2YXRlIGxpc3RzVXRpbHM6IExpc3RVdGlsc1xuICApIHt9XG5cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5yZWdpc3RlckNvZGVNaXJyb3IoKGNtKSA9PiB7XG4gICAgICBjbS5vbihcImJlZm9yZVNlbGVjdGlvbkNoYW5nZVwiLCB0aGlzLmhhbmRsZUJlZm9yZVNlbGVjdGlvbkNoYW5nZSk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyB1bmxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4uYXBwLndvcmtzcGFjZS5pdGVyYXRlQ29kZU1pcnJvcnMoKGNtKSA9PiB7XG4gICAgICBjbS5vZmYoXCJiZWZvcmVTZWxlY3Rpb25DaGFuZ2VcIiwgdGhpcy5oYW5kbGVCZWZvcmVTZWxlY3Rpb25DaGFuZ2UpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVCZWZvcmVTZWxlY3Rpb25DaGFuZ2UgPSAoXG4gICAgY206IENvZGVNaXJyb3IuRWRpdG9yLFxuICAgIGNoYW5nZU9iajogQ29kZU1pcnJvci5FZGl0b3JTZWxlY3Rpb25DaGFuZ2VcbiAgKSA9PiB7XG4gICAgaWYgKFxuICAgICAgIXRoaXMuc2V0dGluZ3Muc3RpY2tDdXJzb3IgfHxcbiAgICAgIGNoYW5nZU9iai5vcmlnaW4gIT09IFwiK21vdmVcIiB8fFxuICAgICAgY2hhbmdlT2JqLnJhbmdlcy5sZW5ndGggPiAxXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcmFuZ2UgPSBjaGFuZ2VPYmoucmFuZ2VzWzBdO1xuXG4gICAgaWYgKFxuICAgICAgcmFuZ2UuYW5jaG9yLmxpbmUgIT09IHJhbmdlLmhlYWQubGluZSB8fFxuICAgICAgcmFuZ2UuYW5jaG9yLmNoID09PSByYW5nZS5oZWFkLmNoXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgcm9vdCA9IHRoaXMubGlzdHNVdGlscy5wYXJzZUxpc3QoY20pO1xuXG4gICAgaWYgKCFyb290KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbGlzdCA9IHJvb3QuZ2V0TGlzdFVuZGVyQ3Vyc29yKCk7XG4gICAgY29uc3QgbGlzdENvbnRlbnRTdGFydENoID0gbGlzdC5nZXRDb250ZW50U3RhcnRDaCgpO1xuXG4gICAgaWYgKHJhbmdlLmZyb20oKS5jaCA8IGxpc3RDb250ZW50U3RhcnRDaCkge1xuICAgICAgcmFuZ2UuZnJvbSgpLmNoID0gbGlzdENvbnRlbnRTdGFydENoO1xuICAgICAgY2hhbmdlT2JqLnVwZGF0ZShbcmFuZ2VdKTtcbiAgICB9XG4gIH07XG59XG4iLCJpbXBvcnQgeyBQbHVnaW5fMiB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgTGlzdFV0aWxzIH0gZnJvbSBcInNyYy9saXN0X3V0aWxzXCI7XG5pbXBvcnQgeyBPYnNpZGlhblV0aWxzIH0gZnJvbSBcInNyYy9vYnNpZGlhbl91dGlsc1wiO1xuaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tIFwic3JjL3NldHRpbmdzXCI7XG5pbXBvcnQgeyBJRmVhdHVyZSB9IGZyb20gXCIuLi9mZWF0dXJlXCI7XG5cbmNsYXNzIFpvb21TdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBsaW5lOiBDb2RlTWlycm9yLkxpbmVIYW5kbGUsIHB1YmxpYyBoZWFkZXI6IEhUTUxFbGVtZW50KSB7fVxufVxuXG5leHBvcnQgY2xhc3MgWm9vbUZlYXR1cmUgaW1wbGVtZW50cyBJRmVhdHVyZSB7XG4gIHByaXZhdGUgem9vbVN0YXRlczogV2Vha01hcDxDb2RlTWlycm9yLkVkaXRvciwgWm9vbVN0YXRlPiA9IG5ldyBXZWFrTWFwKCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwbHVnaW46IFBsdWdpbl8yLFxuICAgIHByaXZhdGUgc2V0dGluZ3M6IFNldHRpbmdzLFxuICAgIHByaXZhdGUgb2JzaWRpYW5VdGlsczogT2JzaWRpYW5VdGlscyxcbiAgICBwcml2YXRlIGxpc3RzVXRpbHM6IExpc3RVdGlsc1xuICApIHtcbiAgICB0aGlzLnpvb21TdGF0ZXMgPSBuZXcgV2Vha01hcCgpO1xuICB9XG5cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5yZWdpc3RlckNvZGVNaXJyb3IoKGNtKSA9PiB7XG4gICAgICBjbS5vbihcImJlZm9yZUNoYW5nZVwiLCB0aGlzLmhhbmRsZUJlZm9yZUNoYW5nZSk7XG4gICAgICBjbS5vbihcImNoYW5nZVwiLCB0aGlzLmhhbmRsZUNoYW5nZSk7XG4gICAgICBjbS5vbihcImJlZm9yZVNlbGVjdGlvbkNoYW5nZVwiLCB0aGlzLmhhbmRsZUJlZm9yZVNlbGVjdGlvbkNoYW5nZSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnBsdWdpbi5yZWdpc3RlckRvbUV2ZW50KHdpbmRvdywgXCJjbGlja1wiLCB0aGlzLmhhbmRsZUNsaWNrKTtcblxuICAgIHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwiem9vbS1pblwiLFxuICAgICAgbmFtZTogXCJab29tIGluIHRvIHRoZSBjdXJyZW50IGxpc3QgaXRlbVwiLFxuICAgICAgY2FsbGJhY2s6IHRoaXMub2JzaWRpYW5VdGlscy5jcmVhdGVDb21tYW5kQ2FsbGJhY2soXG4gICAgICAgIHRoaXMuem9vbUluLmJpbmQodGhpcylcbiAgICAgICksXG4gICAgICBob3RrZXlzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBtb2RpZmllcnM6IFtcIk1vZFwiXSxcbiAgICAgICAgICBrZXk6IFwiLlwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwiem9vbS1vdXRcIixcbiAgICAgIG5hbWU6IFwiWm9vbSBvdXQgdGhlIGVudGlyZSBkb2N1bWVudFwiLFxuICAgICAgY2FsbGJhY2s6IHRoaXMub2JzaWRpYW5VdGlscy5jcmVhdGVDb21tYW5kQ2FsbGJhY2soXG4gICAgICAgIHRoaXMuem9vbU91dC5iaW5kKHRoaXMpXG4gICAgICApLFxuICAgICAgaG90a2V5czogW1xuICAgICAgICB7XG4gICAgICAgICAgbW9kaWZpZXJzOiBbXCJNb2RcIiwgXCJTaGlmdFwiXSxcbiAgICAgICAgICBrZXk6IFwiLlwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHVubG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5hcHAud29ya3NwYWNlLml0ZXJhdGVDb2RlTWlycm9ycygoY20pID0+IHtcbiAgICAgIGNtLm9mZihcImJlZm9yZVNlbGVjdGlvbkNoYW5nZVwiLCB0aGlzLmhhbmRsZUJlZm9yZVNlbGVjdGlvbkNoYW5nZSk7XG4gICAgICBjbS5vZmYoXCJjaGFuZ2VcIiwgdGhpcy5oYW5kbGVDaGFuZ2UpO1xuICAgICAgY20ub2ZmKFwiYmVmb3JlQ2hhbmdlXCIsIHRoaXMuaGFuZGxlQmVmb3JlQ2hhbmdlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlQ2xpY2sgPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcblxuICAgIGlmIChcbiAgICAgICF0YXJnZXQgfHxcbiAgICAgICF0aGlzLnNldHRpbmdzLnpvb21PbkNsaWNrIHx8XG4gICAgICAhdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImNtLWZvcm1hdHRpbmctbGlzdC11bFwiKVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCB3cmFwID0gdGFyZ2V0O1xuICAgIHdoaWxlICh3cmFwKSB7XG4gICAgICBpZiAod3JhcC5jbGFzc0xpc3QuY29udGFpbnMoXCJDb2RlTWlycm9yLXdyYXBcIikpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICB3cmFwID0gd3JhcC5wYXJlbnRFbGVtZW50O1xuICAgIH1cblxuICAgIGlmICghd3JhcCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBmb3VuZEVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IgfCBudWxsID0gbnVsbDtcblxuICAgIHRoaXMucGx1Z2luLmFwcC53b3Jrc3BhY2UuaXRlcmF0ZUNvZGVNaXJyb3JzKChjbSkgPT4ge1xuICAgICAgaWYgKGZvdW5kRWRpdG9yKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGNtLmdldFdyYXBwZXJFbGVtZW50KCkgPT09IHdyYXApIHtcbiAgICAgICAgZm91bmRFZGl0b3IgPSBjbTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICghZm91bmRFZGl0b3IpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwb3MgPSBmb3VuZEVkaXRvci5jb29yZHNDaGFyKHtcbiAgICAgIGxlZnQ6IGUueCxcbiAgICAgIHRvcDogZS55LFxuICAgIH0pO1xuXG4gICAgaWYgKCFwb3MpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgIHRoaXMuem9vbUluKGZvdW5kRWRpdG9yLCBwb3MpO1xuXG4gICAgZm91bmRFZGl0b3Iuc2V0Q3Vyc29yKHtcbiAgICAgIGxpbmU6IHBvcy5saW5lLFxuICAgICAgY2g6IGZvdW5kRWRpdG9yLmdldExpbmUocG9zLmxpbmUpLmxlbmd0aCxcbiAgICB9KTtcbiAgfTtcblxuICBwcml2YXRlIGhhbmRsZUJlZm9yZUNoYW5nZSA9IChcbiAgICBjbTogQ29kZU1pcnJvci5FZGl0b3IsXG4gICAgY2hhbmdlT2JqOiBDb2RlTWlycm9yLkVkaXRvckNoYW5nZUNhbmNlbGxhYmxlXG4gICkgPT4ge1xuICAgIGNvbnN0IHpvb21TdGF0ZSA9IHRoaXMuem9vbVN0YXRlcy5nZXQoY20pO1xuXG4gICAgaWYgKFxuICAgICAgIXpvb21TdGF0ZSB8fFxuICAgICAgY2hhbmdlT2JqLm9yaWdpbiAhPT0gXCJzZXRWYWx1ZVwiIHx8XG4gICAgICBjaGFuZ2VPYmouZnJvbS5saW5lICE9PSAwIHx8XG4gICAgICBjaGFuZ2VPYmouZnJvbS5jaCAhPT0gMFxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRpbGxMaW5lID0gY20ubGFzdExpbmUoKTtcbiAgICBjb25zdCB0aWxsQ2ggPSBjbS5nZXRMaW5lKHRpbGxMaW5lKS5sZW5ndGg7XG5cbiAgICBpZiAoY2hhbmdlT2JqLnRvLmxpbmUgIT09IHRpbGxMaW5lIHx8IGNoYW5nZU9iai50by5jaCAhPT0gdGlsbENoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy56b29tT3V0KGNtKTtcbiAgfTtcblxuICBwcml2YXRlIGhhbmRsZUNoYW5nZSA9IChcbiAgICBjbTogQ29kZU1pcnJvci5FZGl0b3IsXG4gICAgY2hhbmdlT2JqOiBDb2RlTWlycm9yLkVkaXRvckNoYW5nZUNhbmNlbGxhYmxlXG4gICkgPT4ge1xuICAgIGNvbnN0IHpvb21TdGF0ZSA9IHRoaXMuem9vbVN0YXRlcy5nZXQoY20pO1xuXG4gICAgaWYgKCF6b29tU3RhdGUgfHwgY2hhbmdlT2JqLm9yaWdpbiAhPT0gXCJzZXRWYWx1ZVwiKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy56b29tSW4oY20sIHtcbiAgICAgIGxpbmU6IGNtLmdldExpbmVOdW1iZXIoem9vbVN0YXRlLmxpbmUpLFxuICAgICAgY2g6IDAsXG4gICAgfSk7XG4gIH07XG5cbiAgcHJpdmF0ZSBoYW5kbGVCZWZvcmVTZWxlY3Rpb25DaGFuZ2UgPSAoXG4gICAgY206IENvZGVNaXJyb3IuRWRpdG9yLFxuICAgIGNoYW5nZU9iajogQ29kZU1pcnJvci5FZGl0b3JTZWxlY3Rpb25DaGFuZ2VcbiAgKSA9PiB7XG4gICAgaWYgKCF0aGlzLnpvb21TdGF0ZXMuaGFzKGNtKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCB2aXNpYmxlRnJvbTogQ29kZU1pcnJvci5Qb3NpdGlvbiB8IG51bGwgPSBudWxsO1xuICAgIGxldCB2aXNpYmxlVGlsbDogQ29kZU1pcnJvci5Qb3NpdGlvbiB8IG51bGwgPSBudWxsO1xuXG4gICAgZm9yIChsZXQgaSA9IGNtLmZpcnN0TGluZSgpOyBpIDw9IGNtLmxhc3RMaW5lKCk7IGkrKykge1xuICAgICAgY29uc3Qgd3JhcENsYXNzID0gY20ubGluZUluZm8oaSkud3JhcENsYXNzIHx8IFwiXCI7XG4gICAgICBjb25zdCBpc0hpZGRlbiA9IHdyYXBDbGFzcy5pbmNsdWRlcyhcIm91dGxpbmVyLXBsdWdpbi1oaWRkZW4tcm93XCIpO1xuICAgICAgaWYgKHZpc2libGVGcm9tID09PSBudWxsICYmICFpc0hpZGRlbikge1xuICAgICAgICB2aXNpYmxlRnJvbSA9IHsgbGluZTogaSwgY2g6IDAgfTtcbiAgICAgIH1cbiAgICAgIGlmICh2aXNpYmxlRnJvbSAhPT0gbnVsbCAmJiB2aXNpYmxlVGlsbCAhPT0gbnVsbCAmJiBpc0hpZGRlbikge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmICh2aXNpYmxlRnJvbSAhPT0gbnVsbCkge1xuICAgICAgICB2aXNpYmxlVGlsbCA9IHsgbGluZTogaSwgY2g6IGNtLmdldExpbmUoaSkubGVuZ3RoIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IGNoYW5nZWQgPSBmYWxzZTtcblxuICAgIGZvciAoY29uc3QgcmFuZ2Ugb2YgY2hhbmdlT2JqLnJhbmdlcykge1xuICAgICAgaWYgKHJhbmdlLmFuY2hvci5saW5lIDwgdmlzaWJsZUZyb20ubGluZSkge1xuICAgICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgcmFuZ2UuYW5jaG9yLmxpbmUgPSB2aXNpYmxlRnJvbS5saW5lO1xuICAgICAgICByYW5nZS5hbmNob3IuY2ggPSB2aXNpYmxlRnJvbS5jaDtcbiAgICAgIH1cbiAgICAgIGlmIChyYW5nZS5hbmNob3IubGluZSA+IHZpc2libGVUaWxsLmxpbmUpIHtcbiAgICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgICAgIHJhbmdlLmFuY2hvci5saW5lID0gdmlzaWJsZVRpbGwubGluZTtcbiAgICAgICAgcmFuZ2UuYW5jaG9yLmNoID0gdmlzaWJsZVRpbGwuY2g7XG4gICAgICB9XG4gICAgICBpZiAocmFuZ2UuaGVhZC5saW5lIDwgdmlzaWJsZUZyb20ubGluZSkge1xuICAgICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgcmFuZ2UuaGVhZC5saW5lID0gdmlzaWJsZUZyb20ubGluZTtcbiAgICAgICAgcmFuZ2UuaGVhZC5jaCA9IHZpc2libGVGcm9tLmNoO1xuICAgICAgfVxuICAgICAgaWYgKHJhbmdlLmhlYWQubGluZSA+IHZpc2libGVUaWxsLmxpbmUpIHtcbiAgICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgICAgIHJhbmdlLmhlYWQubGluZSA9IHZpc2libGVUaWxsLmxpbmU7XG4gICAgICAgIHJhbmdlLmhlYWQuY2ggPSB2aXNpYmxlVGlsbC5jaDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlZCkge1xuICAgICAgY2hhbmdlT2JqLnVwZGF0ZShjaGFuZ2VPYmoucmFuZ2VzKTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSB6b29tT3V0KGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IpIHtcbiAgICBjb25zdCB6b29tU3RhdGUgPSB0aGlzLnpvb21TdGF0ZXMuZ2V0KGVkaXRvcik7XG5cbiAgICBpZiAoIXpvb21TdGF0ZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSBlZGl0b3IuZmlyc3RMaW5lKCksIGwgPSBlZGl0b3IubGFzdExpbmUoKTsgaSA8PSBsOyBpKyspIHtcbiAgICAgIGVkaXRvci5yZW1vdmVMaW5lQ2xhc3MoaSwgXCJ3cmFwXCIsIFwib3V0bGluZXItcGx1Z2luLWhpZGRlbi1yb3dcIik7XG4gICAgfVxuXG4gICAgem9vbVN0YXRlLmhlYWRlci5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHpvb21TdGF0ZS5oZWFkZXIpO1xuXG4gICAgdGhpcy56b29tU3RhdGVzLmRlbGV0ZShlZGl0b3IpO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBwcml2YXRlIHpvb21JbihcbiAgICBlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yLFxuICAgIGN1cnNvcjogQ29kZU1pcnJvci5Qb3NpdGlvbiA9IGVkaXRvci5nZXRDdXJzb3IoKVxuICApIHtcbiAgICBjb25zdCBsaW5lTm8gPSBjdXJzb3IubGluZTtcbiAgICBjb25zdCByb290ID0gdGhpcy5saXN0c1V0aWxzLnBhcnNlTGlzdChlZGl0b3IsIGN1cnNvcik7XG5cbiAgICBpZiAoIXJvb3QpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLnpvb21PdXQoZWRpdG9yKTtcblxuICAgIGNvbnN0IHsgaW5kZW50TGV2ZWwgfSA9IHRoaXMubGlzdHNVdGlscy5nZXRMaXN0TGluZUluZm8oXG4gICAgICBlZGl0b3IuZ2V0TGluZShsaW5lTm8pLFxuICAgICAgcm9vdC5nZXRJbmRlbnRTaWduKClcbiAgICApO1xuXG4gICAgbGV0IGFmdGVyID0gZmFsc2U7XG4gICAgZm9yIChsZXQgaSA9IGVkaXRvci5maXJzdExpbmUoKSwgbCA9IGVkaXRvci5sYXN0TGluZSgpOyBpIDw9IGw7IGkrKykge1xuICAgICAgaWYgKGkgPCBsaW5lTm8pIHtcbiAgICAgICAgZWRpdG9yLmFkZExpbmVDbGFzcyhpLCBcIndyYXBcIiwgXCJvdXRsaW5lci1wbHVnaW4taGlkZGVuLXJvd1wiKTtcbiAgICAgIH0gZWxzZSBpZiAoaSA+IGxpbmVObyAmJiAhYWZ0ZXIpIHtcbiAgICAgICAgY29uc3QgYWZ0ZXJMaW5lSW5mbyA9IHRoaXMubGlzdHNVdGlscy5nZXRMaXN0TGluZUluZm8oXG4gICAgICAgICAgZWRpdG9yLmdldExpbmUoaSksXG4gICAgICAgICAgcm9vdC5nZXRJbmRlbnRTaWduKClcbiAgICAgICAgKTtcbiAgICAgICAgYWZ0ZXIgPSAhYWZ0ZXJMaW5lSW5mbyB8fCBhZnRlckxpbmVJbmZvLmluZGVudExldmVsIDw9IGluZGVudExldmVsO1xuICAgICAgfVxuXG4gICAgICBpZiAoYWZ0ZXIpIHtcbiAgICAgICAgZWRpdG9yLmFkZExpbmVDbGFzcyhpLCBcIndyYXBcIiwgXCJvdXRsaW5lci1wbHVnaW4taGlkZGVuLXJvd1wiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBjcmVhdGVTZXBhcmF0b3IgPSAoKSA9PiB7XG4gICAgICBjb25zdCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICBzcGFuLnRleHRDb250ZW50ID0gXCIgPiBcIjtcbiAgICAgIHJldHVybiBzcGFuO1xuICAgIH07XG5cbiAgICBjb25zdCBjcmVhdGVUaXRsZSA9IChjb250ZW50OiBzdHJpbmcsIGNiOiAoKSA9PiB2b2lkKSA9PiB7XG4gICAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgICBhLmNsYXNzTmFtZSA9IFwib3V0bGluZXItcGx1Z2luLXpvb20tdGl0bGVcIjtcbiAgICAgIGlmIChjb250ZW50KSB7XG4gICAgICAgIGEudGV4dENvbnRlbnQgPSBjb250ZW50O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYS5pbm5lckhUTUwgPSBcIiZuYnNwOyZuYnNwOyZuYnNwOyZuYnNwOyZuYnNwO1wiO1xuICAgICAgfVxuICAgICAgYS5vbmNsaWNrID0gKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjYigpO1xuICAgICAgfTtcbiAgICAgIHJldHVybiBhO1xuICAgIH07XG5cbiAgICBjb25zdCBjcmVhdGVIZWFkZXIgPSAoKSA9PiB7XG4gICAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgZGl2LmNsYXNzTmFtZSA9IFwib3V0bGluZXItcGx1Z2luLXpvb20taGVhZGVyXCI7XG5cbiAgICAgIGxldCBsaXN0ID0gcm9vdC5nZXRMaXN0VW5kZXJMaW5lKGxpbmVObykuZ2V0UGFyZW50KCk7XG4gICAgICB3aGlsZSAobGlzdCAmJiBsaXN0LmdldFBhcmVudCgpKSB7XG4gICAgICAgIGNvbnN0IGxpbmVObyA9IHJvb3QuZ2V0TGluZU51bWJlck9mKGxpc3QpO1xuICAgICAgICBkaXYucHJlcGVuZChcbiAgICAgICAgICBjcmVhdGVUaXRsZShsaXN0LmdldENvbnRlbnQoKSwgKCkgPT5cbiAgICAgICAgICAgIHRoaXMuem9vbUluKGVkaXRvciwgeyBsaW5lOiBsaW5lTm8sIGNoOiAwIH0pXG4gICAgICAgICAgKVxuICAgICAgICApO1xuICAgICAgICBkaXYucHJlcGVuZChjcmVhdGVTZXBhcmF0b3IoKSk7XG4gICAgICAgIGxpc3QgPSBsaXN0LmdldFBhcmVudCgpO1xuICAgICAgfVxuXG4gICAgICBkaXYucHJlcGVuZChcbiAgICAgICAgY3JlYXRlVGl0bGUodGhpcy5vYnNpZGlhblV0aWxzLmdldEFjdGl2ZUxlYWZEaXNwbGF5VGV4dCgpLCAoKSA9PlxuICAgICAgICAgIHRoaXMuem9vbU91dChlZGl0b3IpXG4gICAgICAgIClcbiAgICAgICk7XG5cbiAgICAgIHJldHVybiBkaXY7XG4gICAgfTtcblxuICAgIGNvbnN0IHpvb21IZWFkZXIgPSBjcmVhdGVIZWFkZXIoKTtcbiAgICBlZGl0b3IuZ2V0V3JhcHBlckVsZW1lbnQoKS5wcmVwZW5kKHpvb21IZWFkZXIpO1xuXG4gICAgdGhpcy56b29tU3RhdGVzLnNldChcbiAgICAgIGVkaXRvcixcbiAgICAgIG5ldyBab29tU3RhdGUoZWRpdG9yLmdldExpbmVIYW5kbGUobGluZU5vKSwgem9vbUhlYWRlcilcbiAgICApO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cbiIsImltcG9ydCB7IE5vdGljZSwgUGx1Z2luXzIgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IExpc3RVdGlscyB9IGZyb20gXCJzcmMvbGlzdF91dGlsc1wiO1xuaW1wb3J0IHsgT2JzaWRpYW5VdGlscyB9IGZyb20gXCJzcmMvb2JzaWRpYW5fdXRpbHNcIjtcbmltcG9ydCB7IElGZWF0dXJlIH0gZnJvbSBcIi4uL2ZlYXR1cmVcIjtcblxuZXhwb3J0IGNsYXNzIEZvbGRGZWF0dXJlIGltcGxlbWVudHMgSUZlYXR1cmUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBvYnNpZGlhblV0aWxzOiBPYnNpZGlhblV0aWxzLFxuICAgIHByaXZhdGUgbGlzdHNVdGlsczogTGlzdFV0aWxzXG4gICkge31cblxuICBhc3luYyBsb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwiZm9sZFwiLFxuICAgICAgbmFtZTogXCJGb2xkIHRoZSBsaXN0XCIsXG4gICAgICBjYWxsYmFjazogdGhpcy5vYnNpZGlhblV0aWxzLmNyZWF0ZUNvbW1hbmRDYWxsYmFjayh0aGlzLmZvbGQuYmluZCh0aGlzKSksXG4gICAgICBob3RrZXlzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBtb2RpZmllcnM6IFtcIk1vZFwiXSxcbiAgICAgICAgICBrZXk6IFwiQXJyb3dVcFwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwidW5mb2xkXCIsXG4gICAgICBuYW1lOiBcIlVuZm9sZCB0aGUgbGlzdFwiLFxuICAgICAgY2FsbGJhY2s6IHRoaXMub2JzaWRpYW5VdGlscy5jcmVhdGVDb21tYW5kQ2FsbGJhY2soXG4gICAgICAgIHRoaXMudW5mb2xkLmJpbmQodGhpcylcbiAgICAgICksXG4gICAgICBob3RrZXlzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBtb2RpZmllcnM6IFtcIk1vZFwiXSxcbiAgICAgICAgICBrZXk6IFwiQXJyb3dEb3duXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdW5sb2FkKCkge31cblxuICBwcml2YXRlIHNldEZvbGQoZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvciwgdHlwZTogXCJmb2xkXCIgfCBcInVuZm9sZFwiKSB7XG4gICAgaWYgKCF0aGlzLmxpc3RzVXRpbHMuaXNDdXJzb3JJbkxpc3QoZWRpdG9yKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5vYnNpZGlhblV0aWxzLmdldE9ic2lkaWFuRm9sZFNldHRpZ25zKCkuZm9sZEluZGVudCkge1xuICAgICAgbmV3IE5vdGljZShcbiAgICAgICAgYFVuYWJsZSB0byAke3R5cGV9IGJlY2F1c2UgZm9sZGluZyBpcyBkaXNhYmxlZC4gUGxlYXNlIGVuYWJsZSBcIkZvbGQgaW5kZW50XCIgaW4gT2JzaWRpYW4gc2V0dGluZ3MuYCxcbiAgICAgICAgNTAwMFxuICAgICAgKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIChlZGl0b3IgYXMgYW55KS5mb2xkQ29kZShlZGl0b3IuZ2V0Q3Vyc29yKCksIG51bGwsIHR5cGUpO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBwcml2YXRlIGZvbGQoZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcikge1xuICAgIHJldHVybiB0aGlzLnNldEZvbGQoZWRpdG9yLCBcImZvbGRcIik7XG4gIH1cblxuICBwcml2YXRlIHVuZm9sZChlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yKSB7XG4gICAgcmV0dXJuIHRoaXMuc2V0Rm9sZChlZGl0b3IsIFwidW5mb2xkXCIpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBQbHVnaW5fMiB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgTGlzdFV0aWxzIH0gZnJvbSBcInNyYy9saXN0X3V0aWxzXCI7XG5pbXBvcnQgeyBPYnNpZGlhblV0aWxzIH0gZnJvbSBcInNyYy9vYnNpZGlhbl91dGlsc1wiO1xuaW1wb3J0IHsgSUZlYXR1cmUgfSBmcm9tIFwiLi4vZmVhdHVyZVwiO1xuXG5leHBvcnQgY2xhc3MgU2VsZWN0QWxsRmVhdHVyZSBpbXBsZW1lbnRzIElGZWF0dXJlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwbHVnaW46IFBsdWdpbl8yLFxuICAgIHByaXZhdGUgb2JzaWRpYW5VdGlsczogT2JzaWRpYW5VdGlscyxcbiAgICBwcml2YXRlIGxpc3RzVXRpbHM6IExpc3RVdGlsc1xuICApIHt9XG5cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcInNlbGVjdC1hbGxcIixcbiAgICAgIG5hbWU6IFwiU2VsZWN0IGEgbGlzdCBpdGVtIG9yIHRoZSBlbnRpcmUgbGlzdFwiLFxuICAgICAgY2FsbGJhY2s6IHRoaXMub2JzaWRpYW5VdGlscy5jcmVhdGVDb21tYW5kQ2FsbGJhY2soXG4gICAgICAgIHRoaXMuc2VsZWN0QWxsLmJpbmQodGhpcylcbiAgICAgICksXG4gICAgICBob3RrZXlzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBtb2RpZmllcnM6IFtcIk1vZFwiXSxcbiAgICAgICAgICBrZXk6IFwiYVwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHVubG9hZCgpIHt9XG5cbiAgcHJpdmF0ZSBzZWxlY3RBbGwoZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcikge1xuICAgIGNvbnN0IHNlbGVjdGlvbnMgPSBlZGl0b3IubGlzdFNlbGVjdGlvbnMoKTtcblxuICAgIGlmIChzZWxlY3Rpb25zLmxlbmd0aCAhPT0gMSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHNlbGVjdGlvbiA9IHNlbGVjdGlvbnNbMF07XG5cbiAgICBpZiAoc2VsZWN0aW9uLmFuY2hvci5saW5lICE9PSBzZWxlY3Rpb24uaGVhZC5saW5lKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3Qgcm9vdCA9IHRoaXMubGlzdHNVdGlscy5wYXJzZUxpc3QoZWRpdG9yLCBzZWxlY3Rpb24uYW5jaG9yKTtcblxuICAgIGlmICghcm9vdCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IGxpc3QgPSByb290LmdldExpc3RVbmRlckN1cnNvcigpO1xuICAgIGNvbnN0IHN0YXJ0Q2ggPSBsaXN0LmdldENvbnRlbnRTdGFydENoKCk7XG4gICAgY29uc3QgZW5kQ2ggPSBsaXN0LmdldENvbnRlbnRFbmRDaCgpO1xuXG4gICAgaWYgKHNlbGVjdGlvbi5mcm9tKCkuY2ggPT09IHN0YXJ0Q2ggJiYgc2VsZWN0aW9uLnRvKCkuY2ggPT09IGVuZENoKSB7XG4gICAgICAvLyBzZWxlY3QgYWxsIGxpc3RcbiAgICAgIGVkaXRvci5zZXRTZWxlY3Rpb24oXG4gICAgICAgIHJvb3QuZ2V0TGlzdFN0YXJ0UG9zaXRpb24oKSxcbiAgICAgICAgcm9vdC5nZXRMaXN0RW5kUG9zaXRpb24oKVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gc2VsZWN0IGFsbCBsaW5lXG4gICAgICBlZGl0b3Iuc2V0U2VsZWN0aW9uKFxuICAgICAgICB7XG4gICAgICAgICAgbGluZTogc2VsZWN0aW9uLmFuY2hvci5saW5lLFxuICAgICAgICAgIGNoOiBzdGFydENoLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbGluZTogc2VsZWN0aW9uLmFuY2hvci5saW5lLFxuICAgICAgICAgIGNoOiBlbmRDaCxcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUGx1Z2luXzIgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IExpc3RVdGlscyB9IGZyb20gXCJzcmMvbGlzdF91dGlsc1wiO1xuaW1wb3J0IHsgT2JzaWRpYW5VdGlscyB9IGZyb20gXCJzcmMvb2JzaWRpYW5fdXRpbHNcIjtcbmltcG9ydCB7IFJvb3QgfSBmcm9tIFwic3JjL3Jvb3RcIjtcbmltcG9ydCB7IElGZWF0dXJlIH0gZnJvbSBcIi4uL2ZlYXR1cmVcIjtcblxuZXhwb3J0IGNsYXNzIE1vdmVJdGVtc0ZlYXR1cmUgaW1wbGVtZW50cyBJRmVhdHVyZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcGx1Z2luOiBQbHVnaW5fMixcbiAgICBwcml2YXRlIG9ic2lkaWFuVXRpbHM6IE9ic2lkaWFuVXRpbHMsXG4gICAgcHJpdmF0ZSBsaXN0c1V0aWxzOiBMaXN0VXRpbHNcbiAgKSB7fVxuXG4gIGFzeW5jIGxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgICBpZDogXCJtb3ZlLWxpc3QtaXRlbS11cFwiLFxuICAgICAgbmFtZTogXCJNb3ZlIGxpc3QgYW5kIHN1Ymxpc3RzIHVwXCIsXG4gICAgICBjYWxsYmFjazogdGhpcy5vYnNpZGlhblV0aWxzLmNyZWF0ZUNvbW1hbmRDYWxsYmFjayhcbiAgICAgICAgdGhpcy5tb3ZlTGlzdEVsZW1lbnRVcC5iaW5kKHRoaXMpXG4gICAgICApLFxuICAgICAgaG90a2V5czogW1xuICAgICAgICB7XG4gICAgICAgICAgbW9kaWZpZXJzOiBbXCJNb2RcIiwgXCJTaGlmdFwiXSxcbiAgICAgICAgICBrZXk6IFwiQXJyb3dVcFwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwibW92ZS1saXN0LWl0ZW0tZG93blwiLFxuICAgICAgbmFtZTogXCJNb3ZlIGxpc3QgYW5kIHN1Ymxpc3RzIGRvd25cIixcbiAgICAgIGNhbGxiYWNrOiB0aGlzLm9ic2lkaWFuVXRpbHMuY3JlYXRlQ29tbWFuZENhbGxiYWNrKFxuICAgICAgICB0aGlzLm1vdmVMaXN0RWxlbWVudERvd24uYmluZCh0aGlzKVxuICAgICAgKSxcbiAgICAgIGhvdGtleXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sXG4gICAgICAgICAga2V5OiBcIkFycm93RG93blwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwiaW5kZW50LWxpc3RcIixcbiAgICAgIG5hbWU6IFwiSW5kZW50IHRoZSBsaXN0IGFuZCBzdWJsaXN0c1wiLFxuICAgICAgY2FsbGJhY2s6IHRoaXMub2JzaWRpYW5VdGlscy5jcmVhdGVDb21tYW5kQ2FsbGJhY2soXG4gICAgICAgIHRoaXMubW92ZUxpc3RFbGVtZW50UmlnaHQuYmluZCh0aGlzKVxuICAgICAgKSxcbiAgICAgIGhvdGtleXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG1vZGlmaWVyczogW10sXG4gICAgICAgICAga2V5OiBcIlRhYlwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwib3V0ZGVudC1saXN0XCIsXG4gICAgICBuYW1lOiBcIk91dGRlbnQgdGhlIGxpc3QgYW5kIHN1Ymxpc3RzXCIsXG4gICAgICBjYWxsYmFjazogdGhpcy5vYnNpZGlhblV0aWxzLmNyZWF0ZUNvbW1hbmRDYWxsYmFjayhcbiAgICAgICAgdGhpcy5tb3ZlTGlzdEVsZW1lbnRMZWZ0LmJpbmQodGhpcylcbiAgICAgICksXG4gICAgICBob3RrZXlzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBtb2RpZmllcnM6IFtcIlNoaWZ0XCJdLFxuICAgICAgICAgIGtleTogXCJUYWJcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyB1bmxvYWQoKSB7fVxuXG4gIHByaXZhdGUgZXhlY3V0ZShcbiAgICBlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yLFxuICAgIGNiOiAocm9vdDogUm9vdCkgPT4gYm9vbGVhblxuICApOiBib29sZWFuIHtcbiAgICBjb25zdCByb290ID0gdGhpcy5saXN0c1V0aWxzLnBhcnNlTGlzdChlZGl0b3IsIGVkaXRvci5nZXRDdXJzb3IoKSk7XG5cbiAgICBpZiAoIXJvb3QpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBjYihyb290KTtcblxuICAgIGlmIChyZXN1bHQpIHtcbiAgICAgIHRoaXMubGlzdHNVdGlscy5hcHBseUNoYW5nZXMoZWRpdG9yLCByb290KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHJpdmF0ZSBtb3ZlTGlzdEVsZW1lbnREb3duKGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjdXRlKGVkaXRvciwgKHJvb3QpID0+IHJvb3QubW92ZURvd24oKSk7XG4gIH1cblxuICBwcml2YXRlIG1vdmVMaXN0RWxlbWVudFVwKGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjdXRlKGVkaXRvciwgKHJvb3QpID0+IHJvb3QubW92ZVVwKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBtb3ZlTGlzdEVsZW1lbnRSaWdodChlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZShlZGl0b3IsIChyb290KSA9PiByb290Lm1vdmVSaWdodCgpKTtcbiAgfVxuXG4gIHByaXZhdGUgbW92ZUxpc3RFbGVtZW50TGVmdChlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZShlZGl0b3IsIChyb290KSA9PiByb290Lm1vdmVMZWZ0KCkpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBQbHVnaW4gfSBmcm9tIFwib2JzaWRpYW5cIjtcclxuaW1wb3J0IHsgT2JzaWRpYW5PdXRsaW5lclBsdWdpblNldHRpbmdUYWIsIFNldHRpbmdzIH0gZnJvbSBcIi4vc2V0dGluZ3NcIjtcclxuaW1wb3J0IHsgSUZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlXCI7XHJcbmltcG9ydCB7IE9ic2lkaWFuVXRpbHMgfSBmcm9tIFwiLi9vYnNpZGlhbl91dGlsc1wiO1xyXG5pbXBvcnQgeyBFZGl0b3JVdGlscyB9IGZyb20gXCIuL2VkaXRvcl91dGlsc1wiO1xyXG5pbXBvcnQgeyBMaXN0VXRpbHMgfSBmcm9tIFwiLi9saXN0X3V0aWxzXCI7XHJcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gXCIuL2xvZ2dlclwiO1xyXG5pbXBvcnQgeyBMaXN0c1N0eWxlc0ZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9MaXN0c1N0eWxlc0ZlYXR1cmVcIjtcclxuaW1wb3J0IHsgRW50ZXJPdXRkZW50SWZMaW5lSXNFbXB0eUZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9FbnRlck91dGRlbnRJZkxpbmVJc0VtcHR5RmVhdHVyZVwiO1xyXG5pbXBvcnQgeyBFbnRlclNob3VsZENyZWF0ZU5ld2xpbmVPbkNoaWxkTGV2ZWxGZWF0dXJlIH0gZnJvbSBcIi4vZmVhdHVyZXMvRW50ZXJTaG91bGRDcmVhdGVOZXdsaW5lT25DaGlsZExldmVsRmVhdHVyZVwiO1xyXG5pbXBvcnQgeyBNb3ZlQ3Vyc29yVG9QcmV2aW91c1VuZm9sZGVkTGluZUZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9Nb3ZlQ3Vyc29yVG9QcmV2aW91c1VuZm9sZGVkTGluZUZlYXR1cmVcIjtcclxuaW1wb3J0IHsgRW5zdXJlQ3Vyc29ySW5MaXN0Q29udGVudEZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9FbnN1cmVDdXJzb3JJbkxpc3RDb250ZW50RmVhdHVyZVwiO1xyXG5pbXBvcnQgeyBEZWxldGVTaG91bGRJZ25vcmVCdWxsZXRzRmVhdHVyZSB9IGZyb20gXCIuL2ZlYXR1cmVzL0RlbGV0ZVNob3VsZElnbm9yZUJ1bGxldHNGZWF0dXJlXCI7XHJcbmltcG9ydCB7IFNlbGVjdGlvblNob3VsZElnbm9yZUJ1bGxldHNGZWF0dXJlIH0gZnJvbSBcIi4vZmVhdHVyZXMvU2VsZWN0aW9uU2hvdWxkSWdub3JlQnVsbGV0c0ZlYXR1cmVcIjtcclxuaW1wb3J0IHsgWm9vbUZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9ab29tRmVhdHVyZVwiO1xyXG5pbXBvcnQgeyBGb2xkRmVhdHVyZSB9IGZyb20gXCIuL2ZlYXR1cmVzL0ZvbGRGZWF0dXJlXCI7XHJcbmltcG9ydCB7IFNlbGVjdEFsbEZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9TZWxlY3RBbGxGZWF0dXJlXCI7XHJcbmltcG9ydCB7IE1vdmVJdGVtc0ZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9Nb3ZlSXRlbXNGZWF0dXJlXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPYnNpZGlhbk91dGxpbmVyUGx1Z2luIGV4dGVuZHMgUGx1Z2luIHtcclxuICBwcml2YXRlIGZlYXR1cmVzOiBJRmVhdHVyZVtdO1xyXG4gIHByaXZhdGUgc2V0dGluZ3M6IFNldHRpbmdzO1xyXG4gIHByaXZhdGUgbG9nZ2VyOiBMb2dnZXI7XHJcbiAgcHJpdmF0ZSBvYnNpZGlhblV0aWxzOiBPYnNpZGlhblV0aWxzO1xyXG4gIHByaXZhdGUgZWRpdG9yVXRpbHM6IEVkaXRvclV0aWxzO1xyXG4gIHByaXZhdGUgbGlzdHNVdGlsczogTGlzdFV0aWxzO1xyXG5cclxuICBhc3luYyBvbmxvYWQoKSB7XHJcbiAgICBjb25zb2xlLmxvZyhgTG9hZGluZyBvYnNpZGlhbi1vdXRsaW5lcmApO1xyXG5cclxuICAgIHRoaXMuc2V0dGluZ3MgPSBuZXcgU2V0dGluZ3ModGhpcyk7XHJcbiAgICBhd2FpdCB0aGlzLnNldHRpbmdzLmxvYWQoKTtcclxuXHJcbiAgICB0aGlzLmxvZ2dlciA9IG5ldyBMb2dnZXIodGhpcy5zZXR0aW5ncyk7XHJcblxyXG4gICAgdGhpcy5vYnNpZGlhblV0aWxzID0gbmV3IE9ic2lkaWFuVXRpbHModGhpcy5hcHApO1xyXG4gICAgdGhpcy5lZGl0b3JVdGlscyA9IG5ldyBFZGl0b3JVdGlscygpO1xyXG4gICAgdGhpcy5saXN0c1V0aWxzID0gbmV3IExpc3RVdGlscyh0aGlzLmxvZ2dlciwgdGhpcy5vYnNpZGlhblV0aWxzKTtcclxuXHJcbiAgICB0aGlzLmFkZFNldHRpbmdUYWIoXHJcbiAgICAgIG5ldyBPYnNpZGlhbk91dGxpbmVyUGx1Z2luU2V0dGluZ1RhYih0aGlzLmFwcCwgdGhpcywgdGhpcy5zZXR0aW5ncylcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5mZWF0dXJlcyA9IFtcclxuICAgICAgbmV3IExpc3RzU3R5bGVzRmVhdHVyZSh0aGlzLCB0aGlzLnNldHRpbmdzLCB0aGlzLm9ic2lkaWFuVXRpbHMpLFxyXG4gICAgICBuZXcgRW50ZXJPdXRkZW50SWZMaW5lSXNFbXB0eUZlYXR1cmUoXHJcbiAgICAgICAgdGhpcyxcclxuICAgICAgICB0aGlzLnNldHRpbmdzLFxyXG4gICAgICAgIHRoaXMuZWRpdG9yVXRpbHMsXHJcbiAgICAgICAgdGhpcy5saXN0c1V0aWxzXHJcbiAgICAgICksXHJcbiAgICAgIG5ldyBFbnRlclNob3VsZENyZWF0ZU5ld2xpbmVPbkNoaWxkTGV2ZWxGZWF0dXJlKFxyXG4gICAgICAgIHRoaXMsXHJcbiAgICAgICAgdGhpcy5zZXR0aW5ncyxcclxuICAgICAgICB0aGlzLmxpc3RzVXRpbHNcclxuICAgICAgKSxcclxuICAgICAgbmV3IEVuc3VyZUN1cnNvckluTGlzdENvbnRlbnRGZWF0dXJlKFxyXG4gICAgICAgIHRoaXMsXHJcbiAgICAgICAgdGhpcy5zZXR0aW5ncyxcclxuICAgICAgICB0aGlzLmVkaXRvclV0aWxzLFxyXG4gICAgICAgIHRoaXMubGlzdHNVdGlsc1xyXG4gICAgICApLFxyXG4gICAgICBuZXcgTW92ZUN1cnNvclRvUHJldmlvdXNVbmZvbGRlZExpbmVGZWF0dXJlKFxyXG4gICAgICAgIHRoaXMsXHJcbiAgICAgICAgdGhpcy5zZXR0aW5ncyxcclxuICAgICAgICB0aGlzLmxpc3RzVXRpbHNcclxuICAgICAgKSxcclxuICAgICAgbmV3IERlbGV0ZVNob3VsZElnbm9yZUJ1bGxldHNGZWF0dXJlKFxyXG4gICAgICAgIHRoaXMsXHJcbiAgICAgICAgdGhpcy5zZXR0aW5ncyxcclxuICAgICAgICB0aGlzLmVkaXRvclV0aWxzLFxyXG4gICAgICAgIHRoaXMubGlzdHNVdGlsc1xyXG4gICAgICApLFxyXG4gICAgICBuZXcgU2VsZWN0aW9uU2hvdWxkSWdub3JlQnVsbGV0c0ZlYXR1cmUoXHJcbiAgICAgICAgdGhpcyxcclxuICAgICAgICB0aGlzLnNldHRpbmdzLFxyXG4gICAgICAgIHRoaXMubGlzdHNVdGlsc1xyXG4gICAgICApLFxyXG4gICAgICBuZXcgWm9vbUZlYXR1cmUodGhpcywgdGhpcy5zZXR0aW5ncywgdGhpcy5vYnNpZGlhblV0aWxzLCB0aGlzLmxpc3RzVXRpbHMpLFxyXG4gICAgICBuZXcgRm9sZEZlYXR1cmUodGhpcywgdGhpcy5vYnNpZGlhblV0aWxzLCB0aGlzLmxpc3RzVXRpbHMpLFxyXG4gICAgICBuZXcgU2VsZWN0QWxsRmVhdHVyZSh0aGlzLCB0aGlzLm9ic2lkaWFuVXRpbHMsIHRoaXMubGlzdHNVdGlscyksXHJcbiAgICAgIG5ldyBNb3ZlSXRlbXNGZWF0dXJlKHRoaXMsIHRoaXMub2JzaWRpYW5VdGlscywgdGhpcy5saXN0c1V0aWxzKSxcclxuICAgIF07XHJcblxyXG4gICAgZm9yIChjb25zdCBmZWF0dXJlIG9mIHRoaXMuZmVhdHVyZXMpIHtcclxuICAgICAgYXdhaXQgZmVhdHVyZS5sb2FkKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBvbnVubG9hZCgpIHtcclxuICAgIGNvbnNvbGUubG9nKGBVbmxvYWRpbmcgb2JzaWRpYW4tb3V0bGluZXJgKTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IGZlYXR1cmUgb2YgdGhpcy5mZWF0dXJlcykge1xyXG4gICAgICBhd2FpdCBmZWF0dXJlLnVubG9hZCgpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOlsiUGx1Z2luU2V0dGluZ1RhYiIsIlNldHRpbmciLCJNYXJrZG93blZpZXciLCJOb3RpY2UiLCJQbHVnaW4iXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBdURBO0FBQ08sU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQzdELElBQUksU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxLQUFLLFlBQVksQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxVQUFVLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQ2hILElBQUksT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQy9ELFFBQVEsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFT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
