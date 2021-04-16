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
        this.cursor.ch--;
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
        this.cursor.ch++;
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

class ListUtils {
    constructor(logger, obsidianUtils) {
        this.logger = logger;
        this.obsidianUtils = obsidianUtils;
    }
    getListLineInfo(line, indentSign) {
        const prefixRe = new RegExp(`^(?:${indentSign})*([-*]) `);
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
        const withTabsRe = /^\t+[-*] /;
        const withSpacesRe = /^[ ]+[-*] /;
        const mayBeWithSpacesRe = /^[ ]*[-*] /;
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
            this.statusBarText.parentElement.removeChild(this.statusBarText);
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
        process.nextTick(() => {
            const cursor = editor.getCursor();
            const lineStartCursor = editor.coordsChar(Object.assign(Object.assign({}, editor.cursorCoords()), { left: 0 }));
            if (lineStartCursor.line !== cursor.line) {
                editor.setCursor({
                    line: lineStartCursor.line,
                    ch: editor.getLine(lineStartCursor.line).length,
                });
            }
        });
        const line = editor.getLine(cursor.line);
        const linePrefix = this.listsUtils.getListLineInfo(line, indentSign)
            .prefixLength;
        if (cursor.ch < linePrefix) {
            cursor.ch = linePrefix;
            editor.setCursor(cursor);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy9zZXR0aW5ncy50cyIsInNyYy9vYnNpZGlhbl91dGlscy50cyIsInNyYy9lZGl0b3JfdXRpbHMudHMiLCJub2RlX21vZHVsZXMvZGlmZi9saWIvaW5kZXgubWpzIiwic3JjL3Jvb3QudHMiLCJzcmMvbGlzdF91dGlscy50cyIsInNyYy9sb2dnZXIudHMiLCJzcmMvZmVhdHVyZXMvTGlzdHNTdHlsZXNGZWF0dXJlLnRzIiwic3JjL2ZlYXR1cmVzL0VudGVyT3V0ZGVudElmTGluZUlzRW1wdHlGZWF0dXJlLnRzIiwic3JjL2ZlYXR1cmVzL0VudGVyU2hvdWxkQ3JlYXRlTmV3bGluZU9uQ2hpbGRMZXZlbEZlYXR1cmUudHMiLCJzcmMvZmVhdHVyZXMvTW92ZUN1cnNvclRvUHJldmlvdXNVbmZvbGRlZExpbmVGZWF0dXJlLnRzIiwic3JjL2ZlYXR1cmVzL0Vuc3VyZUN1cnNvckluTGlzdENvbnRlbnRGZWF0dXJlLnRzIiwic3JjL2ZlYXR1cmVzL0RlbGV0ZVNob3VsZElnbm9yZUJ1bGxldHNGZWF0dXJlLnRzIiwic3JjL2ZlYXR1cmVzL1NlbGVjdGlvblNob3VsZElnbm9yZUJ1bGxldHNGZWF0dXJlLnRzIiwic3JjL2ZlYXR1cmVzL1pvb21GZWF0dXJlLnRzIiwic3JjL2ZlYXR1cmVzL0ZvbGRGZWF0dXJlLnRzIiwic3JjL2ZlYXR1cmVzL1NlbGVjdEFsbEZlYXR1cmUudHMiLCJzcmMvZmVhdHVyZXMvTW92ZUl0ZW1zRmVhdHVyZS50cyIsInNyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXHJcblxyXG5QZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcclxucHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLlxyXG5cclxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVMgV0lUSFxyXG5SRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFlcclxuQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULFxyXG5JTkRJUkVDVCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST01cclxuTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1JcclxuT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUlxyXG5QRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbihkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxyXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICAgICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2NyZWF0ZUJpbmRpbmcgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIG8pIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgcCkpIF9fY3JlYXRlQmluZGluZyhvLCBtLCBwKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcclxuICAgIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxyXG4gICAgICAgICAgICByW2tdID0gYVtqXTtcclxuICAgIHJldHVybiByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheSh0bywgZnJvbSkge1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGlsID0gZnJvbS5sZW5ndGgsIGogPSB0by5sZW5ndGg7IGkgPCBpbDsgaSsrLCBqKyspXHJcbiAgICAgICAgdG9bal0gPSBmcm9tW2ldO1xyXG4gICAgcmV0dXJuIHRvO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XHJcbn0pIDogZnVuY3Rpb24obywgdikge1xyXG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XHJcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHJlY2VpdmVyLCBwcml2YXRlTWFwKSB7XHJcbiAgICBpZiAoIXByaXZhdGVNYXAuaGFzKHJlY2VpdmVyKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJhdHRlbXB0ZWQgdG8gZ2V0IHByaXZhdGUgZmllbGQgb24gbm9uLWluc3RhbmNlXCIpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHByaXZhdGVNYXAuZ2V0KHJlY2VpdmVyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRTZXQocmVjZWl2ZXIsIHByaXZhdGVNYXAsIHZhbHVlKSB7XHJcbiAgICBpZiAoIXByaXZhdGVNYXAuaGFzKHJlY2VpdmVyKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJhdHRlbXB0ZWQgdG8gc2V0IHByaXZhdGUgZmllbGQgb24gbm9uLWluc3RhbmNlXCIpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZU1hcC5zZXQocmVjZWl2ZXIsIHZhbHVlKTtcclxuICAgIHJldHVybiB2YWx1ZTtcclxufVxyXG4iLCJpbXBvcnQgeyBBcHAsIFBsdWdpblNldHRpbmdUYWIsIFBsdWdpbl8yLCBTZXR0aW5nIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgT2JzaWRpYW5PdXRsaW5lclBsdWdpblNldHRpbmdzIHtcbiAgc3R5bGVMaXN0czogYm9vbGVhbjtcbiAgZGVidWc6IGJvb2xlYW47XG4gIHN0aWNrQ3Vyc29yOiBib29sZWFuO1xuICBiZXR0ZXJFbnRlcjogYm9vbGVhbjtcbiAgem9vbU9uQ2xpY2s6IGJvb2xlYW47XG59XG5cbmNvbnN0IERFRkFVTFRfU0VUVElOR1M6IE9ic2lkaWFuT3V0bGluZXJQbHVnaW5TZXR0aW5ncyA9IHtcbiAgc3R5bGVMaXN0czogZmFsc2UsXG4gIGRlYnVnOiBmYWxzZSxcbiAgc3RpY2tDdXJzb3I6IHRydWUsXG4gIGJldHRlckVudGVyOiB0cnVlLFxuICB6b29tT25DbGljazogdHJ1ZSxcbn07XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RvcmFnZSB7XG4gIGxvYWREYXRhKCk6IFByb21pc2U8T2JzaWRpYW5PdXRsaW5lclBsdWdpblNldHRpbmdzPjtcbiAgc2F2ZURhdGEoc2V0dGlnbnM6IE9ic2lkaWFuT3V0bGluZXJQbHVnaW5TZXR0aW5ncyk6IFByb21pc2U8dm9pZD47XG59XG5cbnR5cGUgSyA9IGtleW9mIE9ic2lkaWFuT3V0bGluZXJQbHVnaW5TZXR0aW5ncztcbnR5cGUgVjxUIGV4dGVuZHMgSz4gPSBPYnNpZGlhbk91dGxpbmVyUGx1Z2luU2V0dGluZ3NbVF07XG50eXBlIENhbGxiYWNrPFQgZXh0ZW5kcyBLPiA9IChjYjogVjxUPikgPT4gdm9pZDtcblxuZXhwb3J0IGNsYXNzIFNldHRpbmdzIGltcGxlbWVudHMgT2JzaWRpYW5PdXRsaW5lclBsdWdpblNldHRpbmdzIHtcbiAgcHJpdmF0ZSBzdG9yYWdlOiBTdG9yYWdlO1xuICBwcml2YXRlIHZhbHVlczogT2JzaWRpYW5PdXRsaW5lclBsdWdpblNldHRpbmdzO1xuICBwcml2YXRlIGhhbmRsZXJzOiBNYXA8SywgU2V0PENhbGxiYWNrPEs+Pj47XG5cbiAgY29uc3RydWN0b3Ioc3RvcmFnZTogU3RvcmFnZSkge1xuICAgIHRoaXMuc3RvcmFnZSA9IHN0b3JhZ2U7XG4gICAgdGhpcy5oYW5kbGVycyA9IG5ldyBNYXAoKTtcbiAgfVxuXG4gIGdldCBzdHlsZUxpc3RzKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlcy5zdHlsZUxpc3RzO1xuICB9XG4gIHNldCBzdHlsZUxpc3RzKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5zZXQoXCJzdHlsZUxpc3RzXCIsIHZhbHVlKTtcbiAgfVxuXG4gIGdldCBkZWJ1ZygpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZXMuZGVidWc7XG4gIH1cbiAgc2V0IGRlYnVnKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5zZXQoXCJkZWJ1Z1wiLCB2YWx1ZSk7XG4gIH1cblxuICBnZXQgc3RpY2tDdXJzb3IoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWVzLnN0aWNrQ3Vyc29yO1xuICB9XG4gIHNldCBzdGlja0N1cnNvcih2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuc2V0KFwic3RpY2tDdXJzb3JcIiwgdmFsdWUpO1xuICB9XG5cbiAgZ2V0IGJldHRlckVudGVyKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlcy5iZXR0ZXJFbnRlcjtcbiAgfVxuICBzZXQgYmV0dGVyRW50ZXIodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLnNldChcImJldHRlckVudGVyXCIsIHZhbHVlKTtcbiAgfVxuXG4gIGdldCB6b29tT25DbGljaygpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZXMuem9vbU9uQ2xpY2s7XG4gIH1cbiAgc2V0IHpvb21PbkNsaWNrKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5zZXQoXCJ6b29tT25DbGlja1wiLCB2YWx1ZSk7XG4gIH1cblxuICBvbkNoYW5nZTxUIGV4dGVuZHMgSz4oa2V5OiBULCBjYjogQ2FsbGJhY2s8VD4pIHtcbiAgICBpZiAoIXRoaXMuaGFuZGxlcnMuaGFzKGtleSkpIHtcbiAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KGtleSwgbmV3IFNldCgpKTtcbiAgICB9XG5cbiAgICB0aGlzLmhhbmRsZXJzLmdldChrZXkpLmFkZChjYik7XG4gIH1cblxuICByZW1vdmVDYWxsYmFjazxUIGV4dGVuZHMgSz4oa2V5OiBULCBjYjogQ2FsbGJhY2s8VD4pOiB2b2lkIHtcbiAgICBjb25zdCBoYW5kbGVycyA9IHRoaXMuaGFuZGxlcnMuZ2V0KGtleSk7XG5cbiAgICBpZiAoaGFuZGxlcnMpIHtcbiAgICAgIGhhbmRsZXJzLmRlbGV0ZShjYik7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICB0aGlzLnZhbHVlcyA9IE9iamVjdC5hc3NpZ24oXG4gICAgICB7fSxcbiAgICAgIERFRkFVTFRfU0VUVElOR1MsXG4gICAgICBhd2FpdCB0aGlzLnN0b3JhZ2UubG9hZERhdGEoKVxuICAgICk7XG4gIH1cblxuICBhc3luYyBzYXZlKCkge1xuICAgIGF3YWl0IHRoaXMuc3RvcmFnZS5zYXZlRGF0YSh0aGlzLnZhbHVlcyk7XG4gIH1cblxuICBwcml2YXRlIHNldDxUIGV4dGVuZHMgSz4oa2V5OiBULCB2YWx1ZTogVjxLPik6IHZvaWQge1xuICAgIHRoaXMudmFsdWVzW2tleV0gPSB2YWx1ZTtcbiAgICBjb25zdCBjYWxsYmFja3MgPSB0aGlzLmhhbmRsZXJzLmdldChrZXkpO1xuXG4gICAgaWYgKCFjYWxsYmFja3MpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGNiIG9mIGNhbGxiYWNrcy52YWx1ZXMoKSkge1xuICAgICAgY2IodmFsdWUpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgT2JzaWRpYW5PdXRsaW5lclBsdWdpblNldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogUGx1Z2luXzIsIHByaXZhdGUgc2V0dGluZ3M6IFNldHRpbmdzKSB7XG4gICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xuICB9XG5cbiAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICBjb25zdCB7IGNvbnRhaW5lckVsIH0gPSB0aGlzO1xuXG4gICAgY29udGFpbmVyRWwuZW1wdHkoKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJJbXByb3ZlIHRoZSBzdHlsZSBvZiB5b3VyIGxpc3RzXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJTdHlsZXMgYXJlIG9ubHkgY29tcGF0aWJsZSB3aXRoIGJ1aWx0LWluIE9ic2lkaWFuIHRoZW1lcyBhbmQgbWF5IG5vdCBiZSBjb21wYXRpYmxlIHdpdGggb3RoZXIgdGhlbWVzLiBTdHlsZXMgb25seSB3b3JrIHdlbGwgd2l0aCBzcGFjZXMgb3IgZm91ci1zcGFjZSB0YWJzLlwiXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMuc2V0dGluZ3Muc3R5bGVMaXN0cykub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy5zdHlsZUxpc3RzID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5zZXR0aW5ncy5zYXZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiU3RpY2sgdGhlIGN1cnNvciB0byB0aGUgY29udGVudFwiKVxuICAgICAgLnNldERlc2MoXCJEb24ndCBsZXQgdGhlIGN1cnNvciBtb3ZlIHRvIHRoZSBidWxsZXQgcG9zaXRpb24uXCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMuc2V0dGluZ3Muc3RpY2tDdXJzb3IpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0dGluZ3Muc3RpY2tDdXJzb3IgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnNldHRpbmdzLnNhdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJFbmhhbmNlIHRoZSBFbnRlciBrZXlcIilcbiAgICAgIC5zZXREZXNjKFwiTWFrZSB0aGUgRW50ZXIga2V5IGJlaGF2ZSB0aGUgc2FtZSBhcyBvdGhlciBvdXRsaW5lcnMuXCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMuc2V0dGluZ3MuYmV0dGVyRW50ZXIpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0dGluZ3MuYmV0dGVyRW50ZXIgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnNldHRpbmdzLnNhdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJab29taW5nIGluIHdoZW4gY2xpY2tpbmcgb24gdGhlIGJ1bGxldFwiKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PiB7XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnNldHRpbmdzLnpvb21PbkNsaWNrKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnNldHRpbmdzLnpvb21PbkNsaWNrID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5zZXR0aW5ncy5zYXZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiRGVidWcgbW9kZVwiKVxuICAgICAgLnNldERlc2MoXG4gICAgICAgIFwiT3BlbiBEZXZUb29scyAoQ29tbWFuZCtPcHRpb24rSSBvciBDb250cm9sK1NoaWZ0K0kpIHRvIGNvcHkgdGhlIGRlYnVnIGxvZ3MuXCJcbiAgICAgIClcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT4ge1xuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5zZXR0aW5ncy5kZWJ1Zykub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy5kZWJ1ZyA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMuc2V0dGluZ3Muc2F2ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICB9XG59XG4iLCJpbXBvcnQgeyBBcHAsIE1hcmtkb3duVmlldyB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElPYnNpZGlhblRhYnNTZXR0aWducyB7XG4gIHVzZVRhYjogYm9vbGVhbjtcbiAgdGFiU2l6ZTogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElPYnNpZGlhbkZvbGRTZXR0aWducyB7XG4gIGZvbGRJbmRlbnQ6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjbGFzcyBPYnNpZGlhblV0aWxzIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBhcHA6IEFwcCkge31cblxuICBnZXRPYnNpZGlhblRhYnNTZXR0aWducygpOiBJT2JzaWRpYW5UYWJzU2V0dGlnbnMge1xuICAgIHJldHVybiB7XG4gICAgICB1c2VUYWI6IHRydWUsXG4gICAgICB0YWJTaXplOiA0LFxuICAgICAgLi4uKHRoaXMuYXBwLnZhdWx0IGFzIGFueSkuY29uZmlnLFxuICAgIH07XG4gIH1cblxuICBnZXRPYnNpZGlhbkZvbGRTZXR0aWducygpOiBJT2JzaWRpYW5Gb2xkU2V0dGlnbnMge1xuICAgIHJldHVybiB7XG4gICAgICBmb2xkSW5kZW50OiBmYWxzZSxcbiAgICAgIC4uLih0aGlzLmFwcC52YXVsdCBhcyBhbnkpLmNvbmZpZyxcbiAgICB9O1xuICB9XG5cbiAgZ2V0QWN0aXZlTGVhZkRpc3BsYXlUZXh0KCkge1xuICAgIHJldHVybiB0aGlzLmFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZi5nZXREaXNwbGF5VGV4dCgpO1xuICB9XG5cbiAgY3JlYXRlQ29tbWFuZENhbGxiYWNrKGNiOiAoZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcikgPT4gYm9vbGVhbikge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjb25zdCB2aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcblxuICAgICAgaWYgKCF2aWV3KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZWRpdG9yID0gdmlldy5zb3VyY2VNb2RlLmNtRWRpdG9yO1xuXG4gICAgICBjb25zdCB3b3JrZWQgPSBjYihlZGl0b3IpO1xuXG4gICAgICBpZiAoIXdvcmtlZCAmJiB3aW5kb3cuZXZlbnQgJiYgd2luZG93LmV2ZW50LnR5cGUgPT09IFwia2V5ZG93blwiKSB7XG4gICAgICAgIChlZGl0b3IgYXMgYW55KS50cmlnZ2VyT25LZXlEb3duKHdpbmRvdy5ldmVudCk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIEVkaXRvclV0aWxzIHtcbiAgY29udGFpbnNTaW5nbGVDdXJzb3IoZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcikge1xuICAgIGNvbnN0IHNlbGVjdGlvbnMgPSBlZGl0b3IubGlzdFNlbGVjdGlvbnMoKTtcblxuICAgIHJldHVybiBzZWxlY3Rpb25zLmxlbmd0aCA9PT0gMSAmJiB0aGlzLnJhbmdlSXNDdXJzb3Ioc2VsZWN0aW9uc1swXSk7XG4gIH1cblxuICByYW5nZUlzQ3Vyc29yKHNlbGVjdGlvbjogQ29kZU1pcnJvci5SYW5nZSkge1xuICAgIHJldHVybiAoXG4gICAgICBzZWxlY3Rpb24uYW5jaG9yLmxpbmUgPT09IHNlbGVjdGlvbi5oZWFkLmxpbmUgJiZcbiAgICAgIHNlbGVjdGlvbi5hbmNob3IuY2ggPT09IHNlbGVjdGlvbi5oZWFkLmNoXG4gICAgKTtcbiAgfVxufVxuIiwiZnVuY3Rpb24gRGlmZigpIHt9XG5EaWZmLnByb3RvdHlwZSA9IHtcbiAgZGlmZjogZnVuY3Rpb24gZGlmZihvbGRTdHJpbmcsIG5ld1N0cmluZykge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiB7fTtcbiAgICB2YXIgY2FsbGJhY2sgPSBvcHRpb25zLmNhbGxiYWNrO1xuXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjYWxsYmFjayA9IG9wdGlvbnM7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBmdW5jdGlvbiBkb25lKHZhbHVlKSB7XG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY2FsbGJhY2sodW5kZWZpbmVkLCB2YWx1ZSk7XG4gICAgICAgIH0sIDApO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH1cbiAgICB9IC8vIEFsbG93IHN1YmNsYXNzZXMgdG8gbWFzc2FnZSB0aGUgaW5wdXQgcHJpb3IgdG8gcnVubmluZ1xuXG5cbiAgICBvbGRTdHJpbmcgPSB0aGlzLmNhc3RJbnB1dChvbGRTdHJpbmcpO1xuICAgIG5ld1N0cmluZyA9IHRoaXMuY2FzdElucHV0KG5ld1N0cmluZyk7XG4gICAgb2xkU3RyaW5nID0gdGhpcy5yZW1vdmVFbXB0eSh0aGlzLnRva2VuaXplKG9sZFN0cmluZykpO1xuICAgIG5ld1N0cmluZyA9IHRoaXMucmVtb3ZlRW1wdHkodGhpcy50b2tlbml6ZShuZXdTdHJpbmcpKTtcbiAgICB2YXIgbmV3TGVuID0gbmV3U3RyaW5nLmxlbmd0aCxcbiAgICAgICAgb2xkTGVuID0gb2xkU3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgZWRpdExlbmd0aCA9IDE7XG4gICAgdmFyIG1heEVkaXRMZW5ndGggPSBuZXdMZW4gKyBvbGRMZW47XG4gICAgdmFyIGJlc3RQYXRoID0gW3tcbiAgICAgIG5ld1BvczogLTEsXG4gICAgICBjb21wb25lbnRzOiBbXVxuICAgIH1dOyAvLyBTZWVkIGVkaXRMZW5ndGggPSAwLCBpLmUuIHRoZSBjb250ZW50IHN0YXJ0cyB3aXRoIHRoZSBzYW1lIHZhbHVlc1xuXG4gICAgdmFyIG9sZFBvcyA9IHRoaXMuZXh0cmFjdENvbW1vbihiZXN0UGF0aFswXSwgbmV3U3RyaW5nLCBvbGRTdHJpbmcsIDApO1xuXG4gICAgaWYgKGJlc3RQYXRoWzBdLm5ld1BvcyArIDEgPj0gbmV3TGVuICYmIG9sZFBvcyArIDEgPj0gb2xkTGVuKSB7XG4gICAgICAvLyBJZGVudGl0eSBwZXIgdGhlIGVxdWFsaXR5IGFuZCB0b2tlbml6ZXJcbiAgICAgIHJldHVybiBkb25lKFt7XG4gICAgICAgIHZhbHVlOiB0aGlzLmpvaW4obmV3U3RyaW5nKSxcbiAgICAgICAgY291bnQ6IG5ld1N0cmluZy5sZW5ndGhcbiAgICAgIH1dKTtcbiAgICB9IC8vIE1haW4gd29ya2VyIG1ldGhvZC4gY2hlY2tzIGFsbCBwZXJtdXRhdGlvbnMgb2YgYSBnaXZlbiBlZGl0IGxlbmd0aCBmb3IgYWNjZXB0YW5jZS5cblxuXG4gICAgZnVuY3Rpb24gZXhlY0VkaXRMZW5ndGgoKSB7XG4gICAgICBmb3IgKHZhciBkaWFnb25hbFBhdGggPSAtMSAqIGVkaXRMZW5ndGg7IGRpYWdvbmFsUGF0aCA8PSBlZGl0TGVuZ3RoOyBkaWFnb25hbFBhdGggKz0gMikge1xuICAgICAgICB2YXIgYmFzZVBhdGggPSB2b2lkIDA7XG5cbiAgICAgICAgdmFyIGFkZFBhdGggPSBiZXN0UGF0aFtkaWFnb25hbFBhdGggLSAxXSxcbiAgICAgICAgICAgIHJlbW92ZVBhdGggPSBiZXN0UGF0aFtkaWFnb25hbFBhdGggKyAxXSxcbiAgICAgICAgICAgIF9vbGRQb3MgPSAocmVtb3ZlUGF0aCA/IHJlbW92ZVBhdGgubmV3UG9zIDogMCkgLSBkaWFnb25hbFBhdGg7XG5cbiAgICAgICAgaWYgKGFkZFBhdGgpIHtcbiAgICAgICAgICAvLyBObyBvbmUgZWxzZSBpcyBnb2luZyB0byBhdHRlbXB0IHRvIHVzZSB0aGlzIHZhbHVlLCBjbGVhciBpdFxuICAgICAgICAgIGJlc3RQYXRoW2RpYWdvbmFsUGF0aCAtIDFdID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNhbkFkZCA9IGFkZFBhdGggJiYgYWRkUGF0aC5uZXdQb3MgKyAxIDwgbmV3TGVuLFxuICAgICAgICAgICAgY2FuUmVtb3ZlID0gcmVtb3ZlUGF0aCAmJiAwIDw9IF9vbGRQb3MgJiYgX29sZFBvcyA8IG9sZExlbjtcblxuICAgICAgICBpZiAoIWNhbkFkZCAmJiAhY2FuUmVtb3ZlKSB7XG4gICAgICAgICAgLy8gSWYgdGhpcyBwYXRoIGlzIGEgdGVybWluYWwgdGhlbiBwcnVuZVxuICAgICAgICAgIGJlc3RQYXRoW2RpYWdvbmFsUGF0aF0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gLy8gU2VsZWN0IHRoZSBkaWFnb25hbCB0aGF0IHdlIHdhbnQgdG8gYnJhbmNoIGZyb20uIFdlIHNlbGVjdCB0aGUgcHJpb3JcbiAgICAgICAgLy8gcGF0aCB3aG9zZSBwb3NpdGlvbiBpbiB0aGUgbmV3IHN0cmluZyBpcyB0aGUgZmFydGhlc3QgZnJvbSB0aGUgb3JpZ2luXG4gICAgICAgIC8vIGFuZCBkb2VzIG5vdCBwYXNzIHRoZSBib3VuZHMgb2YgdGhlIGRpZmYgZ3JhcGhcblxuXG4gICAgICAgIGlmICghY2FuQWRkIHx8IGNhblJlbW92ZSAmJiBhZGRQYXRoLm5ld1BvcyA8IHJlbW92ZVBhdGgubmV3UG9zKSB7XG4gICAgICAgICAgYmFzZVBhdGggPSBjbG9uZVBhdGgocmVtb3ZlUGF0aCk7XG4gICAgICAgICAgc2VsZi5wdXNoQ29tcG9uZW50KGJhc2VQYXRoLmNvbXBvbmVudHMsIHVuZGVmaW5lZCwgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYmFzZVBhdGggPSBhZGRQYXRoOyAvLyBObyBuZWVkIHRvIGNsb25lLCB3ZSd2ZSBwdWxsZWQgaXQgZnJvbSB0aGUgbGlzdFxuXG4gICAgICAgICAgYmFzZVBhdGgubmV3UG9zKys7XG4gICAgICAgICAgc2VsZi5wdXNoQ29tcG9uZW50KGJhc2VQYXRoLmNvbXBvbmVudHMsIHRydWUsIHVuZGVmaW5lZCk7XG4gICAgICAgIH1cblxuICAgICAgICBfb2xkUG9zID0gc2VsZi5leHRyYWN0Q29tbW9uKGJhc2VQYXRoLCBuZXdTdHJpbmcsIG9sZFN0cmluZywgZGlhZ29uYWxQYXRoKTsgLy8gSWYgd2UgaGF2ZSBoaXQgdGhlIGVuZCBvZiBib3RoIHN0cmluZ3MsIHRoZW4gd2UgYXJlIGRvbmVcblxuICAgICAgICBpZiAoYmFzZVBhdGgubmV3UG9zICsgMSA+PSBuZXdMZW4gJiYgX29sZFBvcyArIDEgPj0gb2xkTGVuKSB7XG4gICAgICAgICAgcmV0dXJuIGRvbmUoYnVpbGRWYWx1ZXMoc2VsZiwgYmFzZVBhdGguY29tcG9uZW50cywgbmV3U3RyaW5nLCBvbGRTdHJpbmcsIHNlbGYudXNlTG9uZ2VzdFRva2VuKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gT3RoZXJ3aXNlIHRyYWNrIHRoaXMgcGF0aCBhcyBhIHBvdGVudGlhbCBjYW5kaWRhdGUgYW5kIGNvbnRpbnVlLlxuICAgICAgICAgIGJlc3RQYXRoW2RpYWdvbmFsUGF0aF0gPSBiYXNlUGF0aDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBlZGl0TGVuZ3RoKys7XG4gICAgfSAvLyBQZXJmb3JtcyB0aGUgbGVuZ3RoIG9mIGVkaXQgaXRlcmF0aW9uLiBJcyBhIGJpdCBmdWdseSBhcyB0aGlzIGhhcyB0byBzdXBwb3J0IHRoZVxuICAgIC8vIHN5bmMgYW5kIGFzeW5jIG1vZGUgd2hpY2ggaXMgbmV2ZXIgZnVuLiBMb29wcyBvdmVyIGV4ZWNFZGl0TGVuZ3RoIHVudGlsIGEgdmFsdWVcbiAgICAvLyBpcyBwcm9kdWNlZC5cblxuXG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAoZnVuY3Rpb24gZXhlYygpIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgLy8gVGhpcyBzaG91bGQgbm90IGhhcHBlbiwgYnV0IHdlIHdhbnQgdG8gYmUgc2FmZS5cblxuICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICAgICAgaWYgKGVkaXRMZW5ndGggPiBtYXhFZGl0TGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIWV4ZWNFZGl0TGVuZ3RoKCkpIHtcbiAgICAgICAgICAgIGV4ZWMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDApO1xuICAgICAgfSkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2hpbGUgKGVkaXRMZW5ndGggPD0gbWF4RWRpdExlbmd0aCkge1xuICAgICAgICB2YXIgcmV0ID0gZXhlY0VkaXRMZW5ndGgoKTtcblxuICAgICAgICBpZiAocmV0KSB7XG4gICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgcHVzaENvbXBvbmVudDogZnVuY3Rpb24gcHVzaENvbXBvbmVudChjb21wb25lbnRzLCBhZGRlZCwgcmVtb3ZlZCkge1xuICAgIHZhciBsYXN0ID0gY29tcG9uZW50c1tjb21wb25lbnRzLmxlbmd0aCAtIDFdO1xuXG4gICAgaWYgKGxhc3QgJiYgbGFzdC5hZGRlZCA9PT0gYWRkZWQgJiYgbGFzdC5yZW1vdmVkID09PSByZW1vdmVkKSB7XG4gICAgICAvLyBXZSBuZWVkIHRvIGNsb25lIGhlcmUgYXMgdGhlIGNvbXBvbmVudCBjbG9uZSBvcGVyYXRpb24gaXMganVzdFxuICAgICAgLy8gYXMgc2hhbGxvdyBhcnJheSBjbG9uZVxuICAgICAgY29tcG9uZW50c1tjb21wb25lbnRzLmxlbmd0aCAtIDFdID0ge1xuICAgICAgICBjb3VudDogbGFzdC5jb3VudCArIDEsXG4gICAgICAgIGFkZGVkOiBhZGRlZCxcbiAgICAgICAgcmVtb3ZlZDogcmVtb3ZlZFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29tcG9uZW50cy5wdXNoKHtcbiAgICAgICAgY291bnQ6IDEsXG4gICAgICAgIGFkZGVkOiBhZGRlZCxcbiAgICAgICAgcmVtb3ZlZDogcmVtb3ZlZFxuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICBleHRyYWN0Q29tbW9uOiBmdW5jdGlvbiBleHRyYWN0Q29tbW9uKGJhc2VQYXRoLCBuZXdTdHJpbmcsIG9sZFN0cmluZywgZGlhZ29uYWxQYXRoKSB7XG4gICAgdmFyIG5ld0xlbiA9IG5ld1N0cmluZy5sZW5ndGgsXG4gICAgICAgIG9sZExlbiA9IG9sZFN0cmluZy5sZW5ndGgsXG4gICAgICAgIG5ld1BvcyA9IGJhc2VQYXRoLm5ld1BvcyxcbiAgICAgICAgb2xkUG9zID0gbmV3UG9zIC0gZGlhZ29uYWxQYXRoLFxuICAgICAgICBjb21tb25Db3VudCA9IDA7XG5cbiAgICB3aGlsZSAobmV3UG9zICsgMSA8IG5ld0xlbiAmJiBvbGRQb3MgKyAxIDwgb2xkTGVuICYmIHRoaXMuZXF1YWxzKG5ld1N0cmluZ1tuZXdQb3MgKyAxXSwgb2xkU3RyaW5nW29sZFBvcyArIDFdKSkge1xuICAgICAgbmV3UG9zKys7XG4gICAgICBvbGRQb3MrKztcbiAgICAgIGNvbW1vbkNvdW50Kys7XG4gICAgfVxuXG4gICAgaWYgKGNvbW1vbkNvdW50KSB7XG4gICAgICBiYXNlUGF0aC5jb21wb25lbnRzLnB1c2goe1xuICAgICAgICBjb3VudDogY29tbW9uQ291bnRcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGJhc2VQYXRoLm5ld1BvcyA9IG5ld1BvcztcbiAgICByZXR1cm4gb2xkUG9zO1xuICB9LFxuICBlcXVhbHM6IGZ1bmN0aW9uIGVxdWFscyhsZWZ0LCByaWdodCkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuY29tcGFyYXRvcikge1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5jb21wYXJhdG9yKGxlZnQsIHJpZ2h0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGxlZnQgPT09IHJpZ2h0IHx8IHRoaXMub3B0aW9ucy5pZ25vcmVDYXNlICYmIGxlZnQudG9Mb3dlckNhc2UoKSA9PT0gcmlnaHQudG9Mb3dlckNhc2UoKTtcbiAgICB9XG4gIH0sXG4gIHJlbW92ZUVtcHR5OiBmdW5jdGlvbiByZW1vdmVFbXB0eShhcnJheSkge1xuICAgIHZhciByZXQgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChhcnJheVtpXSkge1xuICAgICAgICByZXQucHVzaChhcnJheVtpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbiAgfSxcbiAgY2FzdElucHV0OiBmdW5jdGlvbiBjYXN0SW5wdXQodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH0sXG4gIHRva2VuaXplOiBmdW5jdGlvbiB0b2tlbml6ZSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZS5zcGxpdCgnJyk7XG4gIH0sXG4gIGpvaW46IGZ1bmN0aW9uIGpvaW4oY2hhcnMpIHtcbiAgICByZXR1cm4gY2hhcnMuam9pbignJyk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGJ1aWxkVmFsdWVzKGRpZmYsIGNvbXBvbmVudHMsIG5ld1N0cmluZywgb2xkU3RyaW5nLCB1c2VMb25nZXN0VG9rZW4pIHtcbiAgdmFyIGNvbXBvbmVudFBvcyA9IDAsXG4gICAgICBjb21wb25lbnRMZW4gPSBjb21wb25lbnRzLmxlbmd0aCxcbiAgICAgIG5ld1BvcyA9IDAsXG4gICAgICBvbGRQb3MgPSAwO1xuXG4gIGZvciAoOyBjb21wb25lbnRQb3MgPCBjb21wb25lbnRMZW47IGNvbXBvbmVudFBvcysrKSB7XG4gICAgdmFyIGNvbXBvbmVudCA9IGNvbXBvbmVudHNbY29tcG9uZW50UG9zXTtcblxuICAgIGlmICghY29tcG9uZW50LnJlbW92ZWQpIHtcbiAgICAgIGlmICghY29tcG9uZW50LmFkZGVkICYmIHVzZUxvbmdlc3RUb2tlbikge1xuICAgICAgICB2YXIgdmFsdWUgPSBuZXdTdHJpbmcuc2xpY2UobmV3UG9zLCBuZXdQb3MgKyBjb21wb25lbnQuY291bnQpO1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLm1hcChmdW5jdGlvbiAodmFsdWUsIGkpIHtcbiAgICAgICAgICB2YXIgb2xkVmFsdWUgPSBvbGRTdHJpbmdbb2xkUG9zICsgaV07XG4gICAgICAgICAgcmV0dXJuIG9sZFZhbHVlLmxlbmd0aCA+IHZhbHVlLmxlbmd0aCA/IG9sZFZhbHVlIDogdmFsdWU7XG4gICAgICAgIH0pO1xuICAgICAgICBjb21wb25lbnQudmFsdWUgPSBkaWZmLmpvaW4odmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29tcG9uZW50LnZhbHVlID0gZGlmZi5qb2luKG5ld1N0cmluZy5zbGljZShuZXdQb3MsIG5ld1BvcyArIGNvbXBvbmVudC5jb3VudCkpO1xuICAgICAgfVxuXG4gICAgICBuZXdQb3MgKz0gY29tcG9uZW50LmNvdW50OyAvLyBDb21tb24gY2FzZVxuXG4gICAgICBpZiAoIWNvbXBvbmVudC5hZGRlZCkge1xuICAgICAgICBvbGRQb3MgKz0gY29tcG9uZW50LmNvdW50O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb21wb25lbnQudmFsdWUgPSBkaWZmLmpvaW4ob2xkU3RyaW5nLnNsaWNlKG9sZFBvcywgb2xkUG9zICsgY29tcG9uZW50LmNvdW50KSk7XG4gICAgICBvbGRQb3MgKz0gY29tcG9uZW50LmNvdW50OyAvLyBSZXZlcnNlIGFkZCBhbmQgcmVtb3ZlIHNvIHJlbW92ZXMgYXJlIG91dHB1dCBmaXJzdCB0byBtYXRjaCBjb21tb24gY29udmVudGlvblxuICAgICAgLy8gVGhlIGRpZmZpbmcgYWxnb3JpdGhtIGlzIHRpZWQgdG8gYWRkIHRoZW4gcmVtb3ZlIG91dHB1dCBhbmQgdGhpcyBpcyB0aGUgc2ltcGxlc3RcbiAgICAgIC8vIHJvdXRlIHRvIGdldCB0aGUgZGVzaXJlZCBvdXRwdXQgd2l0aCBtaW5pbWFsIG92ZXJoZWFkLlxuXG4gICAgICBpZiAoY29tcG9uZW50UG9zICYmIGNvbXBvbmVudHNbY29tcG9uZW50UG9zIC0gMV0uYWRkZWQpIHtcbiAgICAgICAgdmFyIHRtcCA9IGNvbXBvbmVudHNbY29tcG9uZW50UG9zIC0gMV07XG4gICAgICAgIGNvbXBvbmVudHNbY29tcG9uZW50UG9zIC0gMV0gPSBjb21wb25lbnRzW2NvbXBvbmVudFBvc107XG4gICAgICAgIGNvbXBvbmVudHNbY29tcG9uZW50UG9zXSA9IHRtcDtcbiAgICAgIH1cbiAgICB9XG4gIH0gLy8gU3BlY2lhbCBjYXNlIGhhbmRsZSBmb3Igd2hlbiBvbmUgdGVybWluYWwgaXMgaWdub3JlZCAoaS5lLiB3aGl0ZXNwYWNlKS5cbiAgLy8gRm9yIHRoaXMgY2FzZSB3ZSBtZXJnZSB0aGUgdGVybWluYWwgaW50byB0aGUgcHJpb3Igc3RyaW5nIGFuZCBkcm9wIHRoZSBjaGFuZ2UuXG4gIC8vIFRoaXMgaXMgb25seSBhdmFpbGFibGUgZm9yIHN0cmluZyBtb2RlLlxuXG5cbiAgdmFyIGxhc3RDb21wb25lbnQgPSBjb21wb25lbnRzW2NvbXBvbmVudExlbiAtIDFdO1xuXG4gIGlmIChjb21wb25lbnRMZW4gPiAxICYmIHR5cGVvZiBsYXN0Q29tcG9uZW50LnZhbHVlID09PSAnc3RyaW5nJyAmJiAobGFzdENvbXBvbmVudC5hZGRlZCB8fCBsYXN0Q29tcG9uZW50LnJlbW92ZWQpICYmIGRpZmYuZXF1YWxzKCcnLCBsYXN0Q29tcG9uZW50LnZhbHVlKSkge1xuICAgIGNvbXBvbmVudHNbY29tcG9uZW50TGVuIC0gMl0udmFsdWUgKz0gbGFzdENvbXBvbmVudC52YWx1ZTtcbiAgICBjb21wb25lbnRzLnBvcCgpO1xuICB9XG5cbiAgcmV0dXJuIGNvbXBvbmVudHM7XG59XG5cbmZ1bmN0aW9uIGNsb25lUGF0aChwYXRoKSB7XG4gIHJldHVybiB7XG4gICAgbmV3UG9zOiBwYXRoLm5ld1BvcyxcbiAgICBjb21wb25lbnRzOiBwYXRoLmNvbXBvbmVudHMuc2xpY2UoMClcbiAgfTtcbn1cblxudmFyIGNoYXJhY3RlckRpZmYgPSBuZXcgRGlmZigpO1xuZnVuY3Rpb24gZGlmZkNoYXJzKG9sZFN0ciwgbmV3U3RyLCBvcHRpb25zKSB7XG4gIHJldHVybiBjaGFyYWN0ZXJEaWZmLmRpZmYob2xkU3RyLCBuZXdTdHIsIG9wdGlvbnMpO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZU9wdGlvbnMob3B0aW9ucywgZGVmYXVsdHMpIHtcbiAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XG4gICAgZGVmYXVsdHMuY2FsbGJhY2sgPSBvcHRpb25zO1xuICB9IGVsc2UgaWYgKG9wdGlvbnMpIHtcbiAgICBmb3IgKHZhciBuYW1lIGluIG9wdGlvbnMpIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgICBkZWZhdWx0c1tuYW1lXSA9IG9wdGlvbnNbbmFtZV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRlZmF1bHRzO1xufVxuXG4vL1xuLy8gUmFuZ2VzIGFuZCBleGNlcHRpb25zOlxuLy8gTGF0aW4tMSBTdXBwbGVtZW50LCAwMDgw4oCTMDBGRlxuLy8gIC0gVSswMEQ3ICDDlyBNdWx0aXBsaWNhdGlvbiBzaWduXG4vLyAgLSBVKzAwRjcgIMO3IERpdmlzaW9uIHNpZ25cbi8vIExhdGluIEV4dGVuZGVkLUEsIDAxMDDigJMwMTdGXG4vLyBMYXRpbiBFeHRlbmRlZC1CLCAwMTgw4oCTMDI0RlxuLy8gSVBBIEV4dGVuc2lvbnMsIDAyNTDigJMwMkFGXG4vLyBTcGFjaW5nIE1vZGlmaWVyIExldHRlcnMsIDAyQjDigJMwMkZGXG4vLyAgLSBVKzAyQzcgIMuHICYjNzExOyAgQ2Fyb25cbi8vICAtIFUrMDJEOCAgy5ggJiM3Mjg7ICBCcmV2ZVxuLy8gIC0gVSswMkQ5ICDLmSAmIzcyOTsgIERvdCBBYm92ZVxuLy8gIC0gVSswMkRBICDLmiAmIzczMDsgIFJpbmcgQWJvdmVcbi8vICAtIFUrMDJEQiAgy5sgJiM3MzE7ICBPZ29uZWtcbi8vICAtIFUrMDJEQyAgy5wgJiM3MzI7ICBTbWFsbCBUaWxkZVxuLy8gIC0gVSswMkREICDLnSAmIzczMzsgIERvdWJsZSBBY3V0ZSBBY2NlbnRcbi8vIExhdGluIEV4dGVuZGVkIEFkZGl0aW9uYWwsIDFFMDDigJMxRUZGXG5cbnZhciBleHRlbmRlZFdvcmRDaGFycyA9IC9eW0EtWmEtelxceEMwLVxcdTAyQzZcXHUwMkM4LVxcdTAyRDdcXHUwMkRFLVxcdTAyRkZcXHUxRTAwLVxcdTFFRkZdKyQvO1xudmFyIHJlV2hpdGVzcGFjZSA9IC9cXFMvO1xudmFyIHdvcmREaWZmID0gbmV3IERpZmYoKTtcblxud29yZERpZmYuZXF1YWxzID0gZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7XG4gIGlmICh0aGlzLm9wdGlvbnMuaWdub3JlQ2FzZSkge1xuICAgIGxlZnQgPSBsZWZ0LnRvTG93ZXJDYXNlKCk7XG4gICAgcmlnaHQgPSByaWdodC50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgcmV0dXJuIGxlZnQgPT09IHJpZ2h0IHx8IHRoaXMub3B0aW9ucy5pZ25vcmVXaGl0ZXNwYWNlICYmICFyZVdoaXRlc3BhY2UudGVzdChsZWZ0KSAmJiAhcmVXaGl0ZXNwYWNlLnRlc3QocmlnaHQpO1xufTtcblxud29yZERpZmYudG9rZW5pemUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgLy8gQWxsIHdoaXRlc3BhY2Ugc3ltYm9scyBleGNlcHQgbmV3bGluZSBncm91cCBpbnRvIG9uZSB0b2tlbiwgZWFjaCBuZXdsaW5lIC0gaW4gc2VwYXJhdGUgdG9rZW5cbiAgdmFyIHRva2VucyA9IHZhbHVlLnNwbGl0KC8oW15cXFNcXHJcXG5dK3xbKClbXFxde30nXCJcXHJcXG5dfFxcYikvKTsgLy8gSm9pbiB0aGUgYm91bmRhcnkgc3BsaXRzIHRoYXQgd2UgZG8gbm90IGNvbnNpZGVyIHRvIGJlIGJvdW5kYXJpZXMuIFRoaXMgaXMgcHJpbWFyaWx5IHRoZSBleHRlbmRlZCBMYXRpbiBjaGFyYWN0ZXIgc2V0LlxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aCAtIDE7IGkrKykge1xuICAgIC8vIElmIHdlIGhhdmUgYW4gZW1wdHkgc3RyaW5nIGluIHRoZSBuZXh0IGZpZWxkIGFuZCB3ZSBoYXZlIG9ubHkgd29yZCBjaGFycyBiZWZvcmUgYW5kIGFmdGVyLCBtZXJnZVxuICAgIGlmICghdG9rZW5zW2kgKyAxXSAmJiB0b2tlbnNbaSArIDJdICYmIGV4dGVuZGVkV29yZENoYXJzLnRlc3QodG9rZW5zW2ldKSAmJiBleHRlbmRlZFdvcmRDaGFycy50ZXN0KHRva2Vuc1tpICsgMl0pKSB7XG4gICAgICB0b2tlbnNbaV0gKz0gdG9rZW5zW2kgKyAyXTtcbiAgICAgIHRva2Vucy5zcGxpY2UoaSArIDEsIDIpO1xuICAgICAgaS0tO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0b2tlbnM7XG59O1xuXG5mdW5jdGlvbiBkaWZmV29yZHMob2xkU3RyLCBuZXdTdHIsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IGdlbmVyYXRlT3B0aW9ucyhvcHRpb25zLCB7XG4gICAgaWdub3JlV2hpdGVzcGFjZTogdHJ1ZVxuICB9KTtcbiAgcmV0dXJuIHdvcmREaWZmLmRpZmYob2xkU3RyLCBuZXdTdHIsIG9wdGlvbnMpO1xufVxuZnVuY3Rpb24gZGlmZldvcmRzV2l0aFNwYWNlKG9sZFN0ciwgbmV3U3RyLCBvcHRpb25zKSB7XG4gIHJldHVybiB3b3JkRGlmZi5kaWZmKG9sZFN0ciwgbmV3U3RyLCBvcHRpb25zKTtcbn1cblxudmFyIGxpbmVEaWZmID0gbmV3IERpZmYoKTtcblxubGluZURpZmYudG9rZW5pemUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgdmFyIHJldExpbmVzID0gW10sXG4gICAgICBsaW5lc0FuZE5ld2xpbmVzID0gdmFsdWUuc3BsaXQoLyhcXG58XFxyXFxuKS8pOyAvLyBJZ25vcmUgdGhlIGZpbmFsIGVtcHR5IHRva2VuIHRoYXQgb2NjdXJzIGlmIHRoZSBzdHJpbmcgZW5kcyB3aXRoIGEgbmV3IGxpbmVcblxuICBpZiAoIWxpbmVzQW5kTmV3bGluZXNbbGluZXNBbmROZXdsaW5lcy5sZW5ndGggLSAxXSkge1xuICAgIGxpbmVzQW5kTmV3bGluZXMucG9wKCk7XG4gIH0gLy8gTWVyZ2UgdGhlIGNvbnRlbnQgYW5kIGxpbmUgc2VwYXJhdG9ycyBpbnRvIHNpbmdsZSB0b2tlbnNcblxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGluZXNBbmROZXdsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBsaW5lID0gbGluZXNBbmROZXdsaW5lc1tpXTtcblxuICAgIGlmIChpICUgMiAmJiAhdGhpcy5vcHRpb25zLm5ld2xpbmVJc1Rva2VuKSB7XG4gICAgICByZXRMaW5lc1tyZXRMaW5lcy5sZW5ndGggLSAxXSArPSBsaW5lO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmlnbm9yZVdoaXRlc3BhY2UpIHtcbiAgICAgICAgbGluZSA9IGxpbmUudHJpbSgpO1xuICAgICAgfVxuXG4gICAgICByZXRMaW5lcy5wdXNoKGxpbmUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXRMaW5lcztcbn07XG5cbmZ1bmN0aW9uIGRpZmZMaW5lcyhvbGRTdHIsIG5ld1N0ciwgY2FsbGJhY2spIHtcbiAgcmV0dXJuIGxpbmVEaWZmLmRpZmYob2xkU3RyLCBuZXdTdHIsIGNhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIGRpZmZUcmltbWVkTGluZXMob2xkU3RyLCBuZXdTdHIsIGNhbGxiYWNrKSB7XG4gIHZhciBvcHRpb25zID0gZ2VuZXJhdGVPcHRpb25zKGNhbGxiYWNrLCB7XG4gICAgaWdub3JlV2hpdGVzcGFjZTogdHJ1ZVxuICB9KTtcbiAgcmV0dXJuIGxpbmVEaWZmLmRpZmYob2xkU3RyLCBuZXdTdHIsIG9wdGlvbnMpO1xufVxuXG52YXIgc2VudGVuY2VEaWZmID0gbmV3IERpZmYoKTtcblxuc2VudGVuY2VEaWZmLnRva2VuaXplID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZS5zcGxpdCgvKFxcUy4rP1suIT9dKSg/PVxccyt8JCkvKTtcbn07XG5cbmZ1bmN0aW9uIGRpZmZTZW50ZW5jZXMob2xkU3RyLCBuZXdTdHIsIGNhbGxiYWNrKSB7XG4gIHJldHVybiBzZW50ZW5jZURpZmYuZGlmZihvbGRTdHIsIG5ld1N0ciwgY2FsbGJhY2spO1xufVxuXG52YXIgY3NzRGlmZiA9IG5ldyBEaWZmKCk7XG5cbmNzc0RpZmYudG9rZW5pemUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlLnNwbGl0KC8oW3t9OjssXXxcXHMrKS8pO1xufTtcblxuZnVuY3Rpb24gZGlmZkNzcyhvbGRTdHIsIG5ld1N0ciwgY2FsbGJhY2spIHtcbiAgcmV0dXJuIGNzc0RpZmYuZGlmZihvbGRTdHIsIG5ld1N0ciwgY2FsbGJhY2spO1xufVxuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikge1xuICBcIkBiYWJlbC9oZWxwZXJzIC0gdHlwZW9mXCI7XG5cbiAgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7XG4gICAgX3R5cGVvZiA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHJldHVybiB0eXBlb2Ygb2JqO1xuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgX3R5cGVvZiA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gX3R5cGVvZihvYmopO1xufVxuXG5mdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7XG4gIHJldHVybiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB8fCBfaXRlcmFibGVUb0FycmF5KGFycikgfHwgX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KGFycikgfHwgX25vbkl0ZXJhYmxlU3ByZWFkKCk7XG59XG5cbmZ1bmN0aW9uIF9hcnJheVdpdGhvdXRIb2xlcyhhcnIpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KGFycik7XG59XG5cbmZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXkoaXRlcikge1xuICBpZiAodHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KGl0ZXIpKSByZXR1cm4gQXJyYXkuZnJvbShpdGVyKTtcbn1cblxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikge1xuICBpZiAoIW8pIHJldHVybjtcbiAgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTtcbiAgdmFyIG4gPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpO1xuICBpZiAobiA9PT0gXCJPYmplY3RcIiAmJiBvLmNvbnN0cnVjdG9yKSBuID0gby5jb25zdHJ1Y3Rvci5uYW1lO1xuICBpZiAobiA9PT0gXCJNYXBcIiB8fCBuID09PSBcIlNldFwiKSByZXR1cm4gQXJyYXkuZnJvbShvKTtcbiAgaWYgKG4gPT09IFwiQXJndW1lbnRzXCIgfHwgL14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QobikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pO1xufVxuXG5mdW5jdGlvbiBfYXJyYXlMaWtlVG9BcnJheShhcnIsIGxlbikge1xuICBpZiAobGVuID09IG51bGwgfHwgbGVuID4gYXJyLmxlbmd0aCkgbGVuID0gYXJyLmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIGFycjJbaV0gPSBhcnJbaV07XG5cbiAgcmV0dXJuIGFycjI7XG59XG5cbmZ1bmN0aW9uIF9ub25JdGVyYWJsZVNwcmVhZCgpIHtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBzcHJlYWQgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7XG59XG5cbnZhciBvYmplY3RQcm90b3R5cGVUb1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG52YXIganNvbkRpZmYgPSBuZXcgRGlmZigpOyAvLyBEaXNjcmltaW5hdGUgYmV0d2VlbiB0d28gbGluZXMgb2YgcHJldHR5LXByaW50ZWQsIHNlcmlhbGl6ZWQgSlNPTiB3aGVyZSBvbmUgb2YgdGhlbSBoYXMgYVxuLy8gZGFuZ2xpbmcgY29tbWEgYW5kIHRoZSBvdGhlciBkb2Vzbid0LiBUdXJucyBvdXQgaW5jbHVkaW5nIHRoZSBkYW5nbGluZyBjb21tYSB5aWVsZHMgdGhlIG5pY2VzdCBvdXRwdXQ6XG5cbmpzb25EaWZmLnVzZUxvbmdlc3RUb2tlbiA9IHRydWU7XG5qc29uRGlmZi50b2tlbml6ZSA9IGxpbmVEaWZmLnRva2VuaXplO1xuXG5qc29uRGlmZi5jYXN0SW5wdXQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgdmFyIF90aGlzJG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG4gICAgICB1bmRlZmluZWRSZXBsYWNlbWVudCA9IF90aGlzJG9wdGlvbnMudW5kZWZpbmVkUmVwbGFjZW1lbnQsXG4gICAgICBfdGhpcyRvcHRpb25zJHN0cmluZ2kgPSBfdGhpcyRvcHRpb25zLnN0cmluZ2lmeVJlcGxhY2VyLFxuICAgICAgc3RyaW5naWZ5UmVwbGFjZXIgPSBfdGhpcyRvcHRpb25zJHN0cmluZ2kgPT09IHZvaWQgMCA/IGZ1bmN0aW9uIChrLCB2KSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2ID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZFJlcGxhY2VtZW50IDogdjtcbiAgfSA6IF90aGlzJG9wdGlvbnMkc3RyaW5naTtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyB2YWx1ZSA6IEpTT04uc3RyaW5naWZ5KGNhbm9uaWNhbGl6ZSh2YWx1ZSwgbnVsbCwgbnVsbCwgc3RyaW5naWZ5UmVwbGFjZXIpLCBzdHJpbmdpZnlSZXBsYWNlciwgJyAgJyk7XG59O1xuXG5qc29uRGlmZi5lcXVhbHMgPSBmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHtcbiAgcmV0dXJuIERpZmYucHJvdG90eXBlLmVxdWFscy5jYWxsKGpzb25EaWZmLCBsZWZ0LnJlcGxhY2UoLywoW1xcclxcbl0pL2csICckMScpLCByaWdodC5yZXBsYWNlKC8sKFtcXHJcXG5dKS9nLCAnJDEnKSk7XG59O1xuXG5mdW5jdGlvbiBkaWZmSnNvbihvbGRPYmosIG5ld09iaiwgb3B0aW9ucykge1xuICByZXR1cm4ganNvbkRpZmYuZGlmZihvbGRPYmosIG5ld09iaiwgb3B0aW9ucyk7XG59IC8vIFRoaXMgZnVuY3Rpb24gaGFuZGxlcyB0aGUgcHJlc2VuY2Ugb2YgY2lyY3VsYXIgcmVmZXJlbmNlcyBieSBiYWlsaW5nIG91dCB3aGVuIGVuY291bnRlcmluZyBhblxuLy8gb2JqZWN0IHRoYXQgaXMgYWxyZWFkeSBvbiB0aGUgXCJzdGFja1wiIG9mIGl0ZW1zIGJlaW5nIHByb2Nlc3NlZC4gQWNjZXB0cyBhbiBvcHRpb25hbCByZXBsYWNlclxuXG5mdW5jdGlvbiBjYW5vbmljYWxpemUob2JqLCBzdGFjaywgcmVwbGFjZW1lbnRTdGFjaywgcmVwbGFjZXIsIGtleSkge1xuICBzdGFjayA9IHN0YWNrIHx8IFtdO1xuICByZXBsYWNlbWVudFN0YWNrID0gcmVwbGFjZW1lbnRTdGFjayB8fCBbXTtcblxuICBpZiAocmVwbGFjZXIpIHtcbiAgICBvYmogPSByZXBsYWNlcihrZXksIG9iaik7XG4gIH1cblxuICB2YXIgaTtcblxuICBmb3IgKGkgPSAwOyBpIDwgc3RhY2subGVuZ3RoOyBpICs9IDEpIHtcbiAgICBpZiAoc3RhY2tbaV0gPT09IG9iaikge1xuICAgICAgcmV0dXJuIHJlcGxhY2VtZW50U3RhY2tbaV07XG4gICAgfVxuICB9XG5cbiAgdmFyIGNhbm9uaWNhbGl6ZWRPYmo7XG5cbiAgaWYgKCdbb2JqZWN0IEFycmF5XScgPT09IG9iamVjdFByb3RvdHlwZVRvU3RyaW5nLmNhbGwob2JqKSkge1xuICAgIHN0YWNrLnB1c2gob2JqKTtcbiAgICBjYW5vbmljYWxpemVkT2JqID0gbmV3IEFycmF5KG9iai5sZW5ndGgpO1xuICAgIHJlcGxhY2VtZW50U3RhY2sucHVzaChjYW5vbmljYWxpemVkT2JqKTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBvYmoubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGNhbm9uaWNhbGl6ZWRPYmpbaV0gPSBjYW5vbmljYWxpemUob2JqW2ldLCBzdGFjaywgcmVwbGFjZW1lbnRTdGFjaywgcmVwbGFjZXIsIGtleSk7XG4gICAgfVxuXG4gICAgc3RhY2sucG9wKCk7XG4gICAgcmVwbGFjZW1lbnRTdGFjay5wb3AoKTtcbiAgICByZXR1cm4gY2Fub25pY2FsaXplZE9iajtcbiAgfVxuXG4gIGlmIChvYmogJiYgb2JqLnRvSlNPTikge1xuICAgIG9iaiA9IG9iai50b0pTT04oKTtcbiAgfVxuXG4gIGlmIChfdHlwZW9mKG9iaikgPT09ICdvYmplY3QnICYmIG9iaiAhPT0gbnVsbCkge1xuICAgIHN0YWNrLnB1c2gob2JqKTtcbiAgICBjYW5vbmljYWxpemVkT2JqID0ge307XG4gICAgcmVwbGFjZW1lbnRTdGFjay5wdXNoKGNhbm9uaWNhbGl6ZWRPYmopO1xuXG4gICAgdmFyIHNvcnRlZEtleXMgPSBbXSxcbiAgICAgICAgX2tleTtcblxuICAgIGZvciAoX2tleSBpbiBvYmopIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KF9rZXkpKSB7XG4gICAgICAgIHNvcnRlZEtleXMucHVzaChfa2V5KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzb3J0ZWRLZXlzLnNvcnQoKTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBzb3J0ZWRLZXlzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBfa2V5ID0gc29ydGVkS2V5c1tpXTtcbiAgICAgIGNhbm9uaWNhbGl6ZWRPYmpbX2tleV0gPSBjYW5vbmljYWxpemUob2JqW19rZXldLCBzdGFjaywgcmVwbGFjZW1lbnRTdGFjaywgcmVwbGFjZXIsIF9rZXkpO1xuICAgIH1cblxuICAgIHN0YWNrLnBvcCgpO1xuICAgIHJlcGxhY2VtZW50U3RhY2sucG9wKCk7XG4gIH0gZWxzZSB7XG4gICAgY2Fub25pY2FsaXplZE9iaiA9IG9iajtcbiAgfVxuXG4gIHJldHVybiBjYW5vbmljYWxpemVkT2JqO1xufVxuXG52YXIgYXJyYXlEaWZmID0gbmV3IERpZmYoKTtcblxuYXJyYXlEaWZmLnRva2VuaXplID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZS5zbGljZSgpO1xufTtcblxuYXJyYXlEaWZmLmpvaW4gPSBhcnJheURpZmYucmVtb3ZlRW1wdHkgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlO1xufTtcblxuZnVuY3Rpb24gZGlmZkFycmF5cyhvbGRBcnIsIG5ld0FyciwgY2FsbGJhY2spIHtcbiAgcmV0dXJuIGFycmF5RGlmZi5kaWZmKG9sZEFyciwgbmV3QXJyLCBjYWxsYmFjayk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlUGF0Y2godW5pRGlmZikge1xuICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG4gIHZhciBkaWZmc3RyID0gdW5pRGlmZi5zcGxpdCgvXFxyXFxufFtcXG5cXHZcXGZcXHJcXHg4NV0vKSxcbiAgICAgIGRlbGltaXRlcnMgPSB1bmlEaWZmLm1hdGNoKC9cXHJcXG58W1xcblxcdlxcZlxcclxceDg1XS9nKSB8fCBbXSxcbiAgICAgIGxpc3QgPSBbXSxcbiAgICAgIGkgPSAwO1xuXG4gIGZ1bmN0aW9uIHBhcnNlSW5kZXgoKSB7XG4gICAgdmFyIGluZGV4ID0ge307XG4gICAgbGlzdC5wdXNoKGluZGV4KTsgLy8gUGFyc2UgZGlmZiBtZXRhZGF0YVxuXG4gICAgd2hpbGUgKGkgPCBkaWZmc3RyLmxlbmd0aCkge1xuICAgICAgdmFyIGxpbmUgPSBkaWZmc3RyW2ldOyAvLyBGaWxlIGhlYWRlciBmb3VuZCwgZW5kIHBhcnNpbmcgZGlmZiBtZXRhZGF0YVxuXG4gICAgICBpZiAoL14oXFwtXFwtXFwtfFxcK1xcK1xcK3xAQClcXHMvLnRlc3QobGluZSkpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9IC8vIERpZmYgaW5kZXhcblxuXG4gICAgICB2YXIgaGVhZGVyID0gL14oPzpJbmRleDp8ZGlmZig/OiAtciBcXHcrKSspXFxzKyguKz8pXFxzKiQvLmV4ZWMobGluZSk7XG5cbiAgICAgIGlmIChoZWFkZXIpIHtcbiAgICAgICAgaW5kZXguaW5kZXggPSBoZWFkZXJbMV07XG4gICAgICB9XG5cbiAgICAgIGkrKztcbiAgICB9IC8vIFBhcnNlIGZpbGUgaGVhZGVycyBpZiB0aGV5IGFyZSBkZWZpbmVkLiBVbmlmaWVkIGRpZmYgcmVxdWlyZXMgdGhlbSwgYnV0XG4gICAgLy8gdGhlcmUncyBubyB0ZWNobmljYWwgaXNzdWVzIHRvIGhhdmUgYW4gaXNvbGF0ZWQgaHVuayB3aXRob3V0IGZpbGUgaGVhZGVyXG5cblxuICAgIHBhcnNlRmlsZUhlYWRlcihpbmRleCk7XG4gICAgcGFyc2VGaWxlSGVhZGVyKGluZGV4KTsgLy8gUGFyc2UgaHVua3NcblxuICAgIGluZGV4Lmh1bmtzID0gW107XG5cbiAgICB3aGlsZSAoaSA8IGRpZmZzdHIubGVuZ3RoKSB7XG4gICAgICB2YXIgX2xpbmUgPSBkaWZmc3RyW2ldO1xuXG4gICAgICBpZiAoL14oSW5kZXg6fGRpZmZ8XFwtXFwtXFwtfFxcK1xcK1xcKylcXHMvLnRlc3QoX2xpbmUpKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIGlmICgvXkBALy50ZXN0KF9saW5lKSkge1xuICAgICAgICBpbmRleC5odW5rcy5wdXNoKHBhcnNlSHVuaygpKTtcbiAgICAgIH0gZWxzZSBpZiAoX2xpbmUgJiYgb3B0aW9ucy5zdHJpY3QpIHtcbiAgICAgICAgLy8gSWdub3JlIHVuZXhwZWN0ZWQgY29udGVudCB1bmxlc3MgaW4gc3RyaWN0IG1vZGVcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGxpbmUgJyArIChpICsgMSkgKyAnICcgKyBKU09OLnN0cmluZ2lmeShfbGluZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaSsrO1xuICAgICAgfVxuICAgIH1cbiAgfSAvLyBQYXJzZXMgdGhlIC0tLSBhbmQgKysrIGhlYWRlcnMsIGlmIG5vbmUgYXJlIGZvdW5kLCBubyBsaW5lc1xuICAvLyBhcmUgY29uc3VtZWQuXG5cblxuICBmdW5jdGlvbiBwYXJzZUZpbGVIZWFkZXIoaW5kZXgpIHtcbiAgICB2YXIgZmlsZUhlYWRlciA9IC9eKC0tLXxcXCtcXCtcXCspXFxzKyguKikkLy5leGVjKGRpZmZzdHJbaV0pO1xuXG4gICAgaWYgKGZpbGVIZWFkZXIpIHtcbiAgICAgIHZhciBrZXlQcmVmaXggPSBmaWxlSGVhZGVyWzFdID09PSAnLS0tJyA/ICdvbGQnIDogJ25ldyc7XG4gICAgICB2YXIgZGF0YSA9IGZpbGVIZWFkZXJbMl0uc3BsaXQoJ1xcdCcsIDIpO1xuICAgICAgdmFyIGZpbGVOYW1lID0gZGF0YVswXS5yZXBsYWNlKC9cXFxcXFxcXC9nLCAnXFxcXCcpO1xuXG4gICAgICBpZiAoL15cIi4qXCIkLy50ZXN0KGZpbGVOYW1lKSkge1xuICAgICAgICBmaWxlTmFtZSA9IGZpbGVOYW1lLnN1YnN0cigxLCBmaWxlTmFtZS5sZW5ndGggLSAyKTtcbiAgICAgIH1cblxuICAgICAgaW5kZXhba2V5UHJlZml4ICsgJ0ZpbGVOYW1lJ10gPSBmaWxlTmFtZTtcbiAgICAgIGluZGV4W2tleVByZWZpeCArICdIZWFkZXInXSA9IChkYXRhWzFdIHx8ICcnKS50cmltKCk7XG4gICAgICBpKys7XG4gICAgfVxuICB9IC8vIFBhcnNlcyBhIGh1bmtcbiAgLy8gVGhpcyBhc3N1bWVzIHRoYXQgd2UgYXJlIGF0IHRoZSBzdGFydCBvZiBhIGh1bmsuXG5cblxuICBmdW5jdGlvbiBwYXJzZUh1bmsoKSB7XG4gICAgdmFyIGNodW5rSGVhZGVySW5kZXggPSBpLFxuICAgICAgICBjaHVua0hlYWRlckxpbmUgPSBkaWZmc3RyW2krK10sXG4gICAgICAgIGNodW5rSGVhZGVyID0gY2h1bmtIZWFkZXJMaW5lLnNwbGl0KC9AQCAtKFxcZCspKD86LChcXGQrKSk/IFxcKyhcXGQrKSg/OiwoXFxkKykpPyBAQC8pO1xuICAgIHZhciBodW5rID0ge1xuICAgICAgb2xkU3RhcnQ6ICtjaHVua0hlYWRlclsxXSxcbiAgICAgIG9sZExpbmVzOiB0eXBlb2YgY2h1bmtIZWFkZXJbMl0gPT09ICd1bmRlZmluZWQnID8gMSA6ICtjaHVua0hlYWRlclsyXSxcbiAgICAgIG5ld1N0YXJ0OiArY2h1bmtIZWFkZXJbM10sXG4gICAgICBuZXdMaW5lczogdHlwZW9mIGNodW5rSGVhZGVyWzRdID09PSAndW5kZWZpbmVkJyA/IDEgOiArY2h1bmtIZWFkZXJbNF0sXG4gICAgICBsaW5lczogW10sXG4gICAgICBsaW5lZGVsaW1pdGVyczogW11cbiAgICB9OyAvLyBVbmlmaWVkIERpZmYgRm9ybWF0IHF1aXJrOiBJZiB0aGUgY2h1bmsgc2l6ZSBpcyAwLFxuICAgIC8vIHRoZSBmaXJzdCBudW1iZXIgaXMgb25lIGxvd2VyIHRoYW4gb25lIHdvdWxkIGV4cGVjdC5cbiAgICAvLyBodHRwczovL3d3dy5hcnRpbWEuY29tL3dlYmxvZ3Mvdmlld3Bvc3QuanNwP3RocmVhZD0xNjQyOTNcblxuICAgIGlmIChodW5rLm9sZExpbmVzID09PSAwKSB7XG4gICAgICBodW5rLm9sZFN0YXJ0ICs9IDE7XG4gICAgfVxuXG4gICAgaWYgKGh1bmsubmV3TGluZXMgPT09IDApIHtcbiAgICAgIGh1bmsubmV3U3RhcnQgKz0gMTtcbiAgICB9XG5cbiAgICB2YXIgYWRkQ291bnQgPSAwLFxuICAgICAgICByZW1vdmVDb3VudCA9IDA7XG5cbiAgICBmb3IgKDsgaSA8IGRpZmZzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vIExpbmVzIHN0YXJ0aW5nIHdpdGggJy0tLScgY291bGQgYmUgbWlzdGFrZW4gZm9yIHRoZSBcInJlbW92ZSBsaW5lXCIgb3BlcmF0aW9uXG4gICAgICAvLyBCdXQgdGhleSBjb3VsZCBiZSB0aGUgaGVhZGVyIGZvciB0aGUgbmV4dCBmaWxlLiBUaGVyZWZvcmUgcHJ1bmUgc3VjaCBjYXNlcyBvdXQuXG4gICAgICBpZiAoZGlmZnN0cltpXS5pbmRleE9mKCctLS0gJykgPT09IDAgJiYgaSArIDIgPCBkaWZmc3RyLmxlbmd0aCAmJiBkaWZmc3RyW2kgKyAxXS5pbmRleE9mKCcrKysgJykgPT09IDAgJiYgZGlmZnN0cltpICsgMl0uaW5kZXhPZignQEAnKSA9PT0gMCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgdmFyIG9wZXJhdGlvbiA9IGRpZmZzdHJbaV0ubGVuZ3RoID09IDAgJiYgaSAhPSBkaWZmc3RyLmxlbmd0aCAtIDEgPyAnICcgOiBkaWZmc3RyW2ldWzBdO1xuXG4gICAgICBpZiAob3BlcmF0aW9uID09PSAnKycgfHwgb3BlcmF0aW9uID09PSAnLScgfHwgb3BlcmF0aW9uID09PSAnICcgfHwgb3BlcmF0aW9uID09PSAnXFxcXCcpIHtcbiAgICAgICAgaHVuay5saW5lcy5wdXNoKGRpZmZzdHJbaV0pO1xuICAgICAgICBodW5rLmxpbmVkZWxpbWl0ZXJzLnB1c2goZGVsaW1pdGVyc1tpXSB8fCAnXFxuJyk7XG5cbiAgICAgICAgaWYgKG9wZXJhdGlvbiA9PT0gJysnKSB7XG4gICAgICAgICAgYWRkQ291bnQrKztcbiAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09ICctJykge1xuICAgICAgICAgIHJlbW92ZUNvdW50Kys7XG4gICAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSAnICcpIHtcbiAgICAgICAgICBhZGRDb3VudCsrO1xuICAgICAgICAgIHJlbW92ZUNvdW50Kys7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0gLy8gSGFuZGxlIHRoZSBlbXB0eSBibG9jayBjb3VudCBjYXNlXG5cblxuICAgIGlmICghYWRkQ291bnQgJiYgaHVuay5uZXdMaW5lcyA9PT0gMSkge1xuICAgICAgaHVuay5uZXdMaW5lcyA9IDA7XG4gICAgfVxuXG4gICAgaWYgKCFyZW1vdmVDb3VudCAmJiBodW5rLm9sZExpbmVzID09PSAxKSB7XG4gICAgICBodW5rLm9sZExpbmVzID0gMDtcbiAgICB9IC8vIFBlcmZvcm0gb3B0aW9uYWwgc2FuaXR5IGNoZWNraW5nXG5cblxuICAgIGlmIChvcHRpb25zLnN0cmljdCkge1xuICAgICAgaWYgKGFkZENvdW50ICE9PSBodW5rLm5ld0xpbmVzKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQWRkZWQgbGluZSBjb3VudCBkaWQgbm90IG1hdGNoIGZvciBodW5rIGF0IGxpbmUgJyArIChjaHVua0hlYWRlckluZGV4ICsgMSkpO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVtb3ZlQ291bnQgIT09IGh1bmsub2xkTGluZXMpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZW1vdmVkIGxpbmUgY291bnQgZGlkIG5vdCBtYXRjaCBmb3IgaHVuayBhdCBsaW5lICcgKyAoY2h1bmtIZWFkZXJJbmRleCArIDEpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaHVuaztcbiAgfVxuXG4gIHdoaWxlIChpIDwgZGlmZnN0ci5sZW5ndGgpIHtcbiAgICBwYXJzZUluZGV4KCk7XG4gIH1cblxuICByZXR1cm4gbGlzdDtcbn1cblxuLy8gSXRlcmF0b3IgdGhhdCB0cmF2ZXJzZXMgaW4gdGhlIHJhbmdlIG9mIFttaW4sIG1heF0sIHN0ZXBwaW5nXG4vLyBieSBkaXN0YW5jZSBmcm9tIGEgZ2l2ZW4gc3RhcnQgcG9zaXRpb24uIEkuZS4gZm9yIFswLCA0XSwgd2l0aFxuLy8gc3RhcnQgb2YgMiwgdGhpcyB3aWxsIGl0ZXJhdGUgMiwgMywgMSwgNCwgMC5cbmZ1bmN0aW9uIGRpc3RhbmNlSXRlcmF0b3IgKHN0YXJ0LCBtaW5MaW5lLCBtYXhMaW5lKSB7XG4gIHZhciB3YW50Rm9yd2FyZCA9IHRydWUsXG4gICAgICBiYWNrd2FyZEV4aGF1c3RlZCA9IGZhbHNlLFxuICAgICAgZm9yd2FyZEV4aGF1c3RlZCA9IGZhbHNlLFxuICAgICAgbG9jYWxPZmZzZXQgPSAxO1xuICByZXR1cm4gZnVuY3Rpb24gaXRlcmF0b3IoKSB7XG4gICAgaWYgKHdhbnRGb3J3YXJkICYmICFmb3J3YXJkRXhoYXVzdGVkKSB7XG4gICAgICBpZiAoYmFja3dhcmRFeGhhdXN0ZWQpIHtcbiAgICAgICAgbG9jYWxPZmZzZXQrKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdhbnRGb3J3YXJkID0gZmFsc2U7XG4gICAgICB9IC8vIENoZWNrIGlmIHRyeWluZyB0byBmaXQgYmV5b25kIHRleHQgbGVuZ3RoLCBhbmQgaWYgbm90LCBjaGVjayBpdCBmaXRzXG4gICAgICAvLyBhZnRlciBvZmZzZXQgbG9jYXRpb24gKG9yIGRlc2lyZWQgbG9jYXRpb24gb24gZmlyc3QgaXRlcmF0aW9uKVxuXG5cbiAgICAgIGlmIChzdGFydCArIGxvY2FsT2Zmc2V0IDw9IG1heExpbmUpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsT2Zmc2V0O1xuICAgICAgfVxuXG4gICAgICBmb3J3YXJkRXhoYXVzdGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoIWJhY2t3YXJkRXhoYXVzdGVkKSB7XG4gICAgICBpZiAoIWZvcndhcmRFeGhhdXN0ZWQpIHtcbiAgICAgICAgd2FudEZvcndhcmQgPSB0cnVlO1xuICAgICAgfSAvLyBDaGVjayBpZiB0cnlpbmcgdG8gZml0IGJlZm9yZSB0ZXh0IGJlZ2lubmluZywgYW5kIGlmIG5vdCwgY2hlY2sgaXQgZml0c1xuICAgICAgLy8gYmVmb3JlIG9mZnNldCBsb2NhdGlvblxuXG5cbiAgICAgIGlmIChtaW5MaW5lIDw9IHN0YXJ0IC0gbG9jYWxPZmZzZXQpIHtcbiAgICAgICAgcmV0dXJuIC1sb2NhbE9mZnNldCsrO1xuICAgICAgfVxuXG4gICAgICBiYWNrd2FyZEV4aGF1c3RlZCA9IHRydWU7XG4gICAgICByZXR1cm4gaXRlcmF0b3IoKTtcbiAgICB9IC8vIFdlIHRyaWVkIHRvIGZpdCBodW5rIGJlZm9yZSB0ZXh0IGJlZ2lubmluZyBhbmQgYmV5b25kIHRleHQgbGVuZ3RoLCB0aGVuXG4gICAgLy8gaHVuayBjYW4ndCBmaXQgb24gdGhlIHRleHQuIFJldHVybiB1bmRlZmluZWRcblxuICB9O1xufVxuXG5mdW5jdGlvbiBhcHBseVBhdGNoKHNvdXJjZSwgdW5pRGlmZikge1xuICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDoge307XG5cbiAgaWYgKHR5cGVvZiB1bmlEaWZmID09PSAnc3RyaW5nJykge1xuICAgIHVuaURpZmYgPSBwYXJzZVBhdGNoKHVuaURpZmYpO1xuICB9XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkodW5pRGlmZikpIHtcbiAgICBpZiAodW5pRGlmZi5sZW5ndGggPiAxKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2FwcGx5UGF0Y2ggb25seSB3b3JrcyB3aXRoIGEgc2luZ2xlIGlucHV0LicpO1xuICAgIH1cblxuICAgIHVuaURpZmYgPSB1bmlEaWZmWzBdO1xuICB9IC8vIEFwcGx5IHRoZSBkaWZmIHRvIHRoZSBpbnB1dFxuXG5cbiAgdmFyIGxpbmVzID0gc291cmNlLnNwbGl0KC9cXHJcXG58W1xcblxcdlxcZlxcclxceDg1XS8pLFxuICAgICAgZGVsaW1pdGVycyA9IHNvdXJjZS5tYXRjaCgvXFxyXFxufFtcXG5cXHZcXGZcXHJcXHg4NV0vZykgfHwgW10sXG4gICAgICBodW5rcyA9IHVuaURpZmYuaHVua3MsXG4gICAgICBjb21wYXJlTGluZSA9IG9wdGlvbnMuY29tcGFyZUxpbmUgfHwgZnVuY3Rpb24gKGxpbmVOdW1iZXIsIGxpbmUsIG9wZXJhdGlvbiwgcGF0Y2hDb250ZW50KSB7XG4gICAgcmV0dXJuIGxpbmUgPT09IHBhdGNoQ29udGVudDtcbiAgfSxcbiAgICAgIGVycm9yQ291bnQgPSAwLFxuICAgICAgZnV6ekZhY3RvciA9IG9wdGlvbnMuZnV6ekZhY3RvciB8fCAwLFxuICAgICAgbWluTGluZSA9IDAsXG4gICAgICBvZmZzZXQgPSAwLFxuICAgICAgcmVtb3ZlRU9GTkwsXG4gICAgICBhZGRFT0ZOTDtcbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgaHVuayBleGFjdGx5IGZpdHMgb24gdGhlIHByb3ZpZGVkIGxvY2F0aW9uXG4gICAqL1xuXG5cbiAgZnVuY3Rpb24gaHVua0ZpdHMoaHVuaywgdG9Qb3MpIHtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IGh1bmsubGluZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgIHZhciBsaW5lID0gaHVuay5saW5lc1tqXSxcbiAgICAgICAgICBvcGVyYXRpb24gPSBsaW5lLmxlbmd0aCA+IDAgPyBsaW5lWzBdIDogJyAnLFxuICAgICAgICAgIGNvbnRlbnQgPSBsaW5lLmxlbmd0aCA+IDAgPyBsaW5lLnN1YnN0cigxKSA6IGxpbmU7XG5cbiAgICAgIGlmIChvcGVyYXRpb24gPT09ICcgJyB8fCBvcGVyYXRpb24gPT09ICctJykge1xuICAgICAgICAvLyBDb250ZXh0IHNhbml0eSBjaGVja1xuICAgICAgICBpZiAoIWNvbXBhcmVMaW5lKHRvUG9zICsgMSwgbGluZXNbdG9Qb3NdLCBvcGVyYXRpb24sIGNvbnRlbnQpKSB7XG4gICAgICAgICAgZXJyb3JDb3VudCsrO1xuXG4gICAgICAgICAgaWYgKGVycm9yQ291bnQgPiBmdXp6RmFjdG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdG9Qb3MrKztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSAvLyBTZWFyY2ggYmVzdCBmaXQgb2Zmc2V0cyBmb3IgZWFjaCBodW5rIGJhc2VkIG9uIHRoZSBwcmV2aW91cyBvbmVzXG5cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGh1bmtzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGh1bmsgPSBodW5rc1tpXSxcbiAgICAgICAgbWF4TGluZSA9IGxpbmVzLmxlbmd0aCAtIGh1bmsub2xkTGluZXMsXG4gICAgICAgIGxvY2FsT2Zmc2V0ID0gMCxcbiAgICAgICAgdG9Qb3MgPSBvZmZzZXQgKyBodW5rLm9sZFN0YXJ0IC0gMTtcbiAgICB2YXIgaXRlcmF0b3IgPSBkaXN0YW5jZUl0ZXJhdG9yKHRvUG9zLCBtaW5MaW5lLCBtYXhMaW5lKTtcblxuICAgIGZvciAoOyBsb2NhbE9mZnNldCAhPT0gdW5kZWZpbmVkOyBsb2NhbE9mZnNldCA9IGl0ZXJhdG9yKCkpIHtcbiAgICAgIGlmIChodW5rRml0cyhodW5rLCB0b1BvcyArIGxvY2FsT2Zmc2V0KSkge1xuICAgICAgICBodW5rLm9mZnNldCA9IG9mZnNldCArPSBsb2NhbE9mZnNldDtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGxvY2FsT2Zmc2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IC8vIFNldCBsb3dlciB0ZXh0IGxpbWl0IHRvIGVuZCBvZiB0aGUgY3VycmVudCBodW5rLCBzbyBuZXh0IG9uZXMgZG9uJ3QgdHJ5XG4gICAgLy8gdG8gZml0IG92ZXIgYWxyZWFkeSBwYXRjaGVkIHRleHRcblxuXG4gICAgbWluTGluZSA9IGh1bmsub2Zmc2V0ICsgaHVuay5vbGRTdGFydCArIGh1bmsub2xkTGluZXM7XG4gIH0gLy8gQXBwbHkgcGF0Y2ggaHVua3NcblxuXG4gIHZhciBkaWZmT2Zmc2V0ID0gMDtcblxuICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgaHVua3MubGVuZ3RoOyBfaSsrKSB7XG4gICAgdmFyIF9odW5rID0gaHVua3NbX2ldLFxuICAgICAgICBfdG9Qb3MgPSBfaHVuay5vbGRTdGFydCArIF9odW5rLm9mZnNldCArIGRpZmZPZmZzZXQgLSAxO1xuXG4gICAgZGlmZk9mZnNldCArPSBfaHVuay5uZXdMaW5lcyAtIF9odW5rLm9sZExpbmVzO1xuXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBfaHVuay5saW5lcy5sZW5ndGg7IGorKykge1xuICAgICAgdmFyIGxpbmUgPSBfaHVuay5saW5lc1tqXSxcbiAgICAgICAgICBvcGVyYXRpb24gPSBsaW5lLmxlbmd0aCA+IDAgPyBsaW5lWzBdIDogJyAnLFxuICAgICAgICAgIGNvbnRlbnQgPSBsaW5lLmxlbmd0aCA+IDAgPyBsaW5lLnN1YnN0cigxKSA6IGxpbmUsXG4gICAgICAgICAgZGVsaW1pdGVyID0gX2h1bmsubGluZWRlbGltaXRlcnNbal07XG5cbiAgICAgIGlmIChvcGVyYXRpb24gPT09ICcgJykge1xuICAgICAgICBfdG9Qb3MrKztcbiAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSAnLScpIHtcbiAgICAgICAgbGluZXMuc3BsaWNlKF90b1BvcywgMSk7XG4gICAgICAgIGRlbGltaXRlcnMuc3BsaWNlKF90b1BvcywgMSk7XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gJysnKSB7XG4gICAgICAgIGxpbmVzLnNwbGljZShfdG9Qb3MsIDAsIGNvbnRlbnQpO1xuICAgICAgICBkZWxpbWl0ZXJzLnNwbGljZShfdG9Qb3MsIDAsIGRlbGltaXRlcik7XG4gICAgICAgIF90b1BvcysrO1xuICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09ICdcXFxcJykge1xuICAgICAgICB2YXIgcHJldmlvdXNPcGVyYXRpb24gPSBfaHVuay5saW5lc1tqIC0gMV0gPyBfaHVuay5saW5lc1tqIC0gMV1bMF0gOiBudWxsO1xuXG4gICAgICAgIGlmIChwcmV2aW91c09wZXJhdGlvbiA9PT0gJysnKSB7XG4gICAgICAgICAgcmVtb3ZlRU9GTkwgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKHByZXZpb3VzT3BlcmF0aW9uID09PSAnLScpIHtcbiAgICAgICAgICBhZGRFT0ZOTCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gLy8gSGFuZGxlIEVPRk5MIGluc2VydGlvbi9yZW1vdmFsXG5cblxuICBpZiAocmVtb3ZlRU9GTkwpIHtcbiAgICB3aGlsZSAoIWxpbmVzW2xpbmVzLmxlbmd0aCAtIDFdKSB7XG4gICAgICBsaW5lcy5wb3AoKTtcbiAgICAgIGRlbGltaXRlcnMucG9wKCk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGFkZEVPRk5MKSB7XG4gICAgbGluZXMucHVzaCgnJyk7XG4gICAgZGVsaW1pdGVycy5wdXNoKCdcXG4nKTtcbiAgfVxuXG4gIGZvciAodmFyIF9rID0gMDsgX2sgPCBsaW5lcy5sZW5ndGggLSAxOyBfaysrKSB7XG4gICAgbGluZXNbX2tdID0gbGluZXNbX2tdICsgZGVsaW1pdGVyc1tfa107XG4gIH1cblxuICByZXR1cm4gbGluZXMuam9pbignJyk7XG59IC8vIFdyYXBwZXIgdGhhdCBzdXBwb3J0cyBtdWx0aXBsZSBmaWxlIHBhdGNoZXMgdmlhIGNhbGxiYWNrcy5cblxuZnVuY3Rpb24gYXBwbHlQYXRjaGVzKHVuaURpZmYsIG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiB1bmlEaWZmID09PSAnc3RyaW5nJykge1xuICAgIHVuaURpZmYgPSBwYXJzZVBhdGNoKHVuaURpZmYpO1xuICB9XG5cbiAgdmFyIGN1cnJlbnRJbmRleCA9IDA7XG5cbiAgZnVuY3Rpb24gcHJvY2Vzc0luZGV4KCkge1xuICAgIHZhciBpbmRleCA9IHVuaURpZmZbY3VycmVudEluZGV4KytdO1xuXG4gICAgaWYgKCFpbmRleCkge1xuICAgICAgcmV0dXJuIG9wdGlvbnMuY29tcGxldGUoKTtcbiAgICB9XG5cbiAgICBvcHRpb25zLmxvYWRGaWxlKGluZGV4LCBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLmNvbXBsZXRlKGVycik7XG4gICAgICB9XG5cbiAgICAgIHZhciB1cGRhdGVkQ29udGVudCA9IGFwcGx5UGF0Y2goZGF0YSwgaW5kZXgsIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5wYXRjaGVkKGluZGV4LCB1cGRhdGVkQ29udGVudCwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmV0dXJuIG9wdGlvbnMuY29tcGxldGUoZXJyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByb2Nlc3NJbmRleCgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwcm9jZXNzSW5kZXgoKTtcbn1cblxuZnVuY3Rpb24gc3RydWN0dXJlZFBhdGNoKG9sZEZpbGVOYW1lLCBuZXdGaWxlTmFtZSwgb2xkU3RyLCBuZXdTdHIsIG9sZEhlYWRlciwgbmV3SGVhZGVyLCBvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5jb250ZXh0ID09PSAndW5kZWZpbmVkJykge1xuICAgIG9wdGlvbnMuY29udGV4dCA9IDQ7XG4gIH1cblxuICB2YXIgZGlmZiA9IGRpZmZMaW5lcyhvbGRTdHIsIG5ld1N0ciwgb3B0aW9ucyk7XG4gIGRpZmYucHVzaCh7XG4gICAgdmFsdWU6ICcnLFxuICAgIGxpbmVzOiBbXVxuICB9KTsgLy8gQXBwZW5kIGFuIGVtcHR5IHZhbHVlIHRvIG1ha2UgY2xlYW51cCBlYXNpZXJcblxuICBmdW5jdGlvbiBjb250ZXh0TGluZXMobGluZXMpIHtcbiAgICByZXR1cm4gbGluZXMubWFwKGZ1bmN0aW9uIChlbnRyeSkge1xuICAgICAgcmV0dXJuICcgJyArIGVudHJ5O1xuICAgIH0pO1xuICB9XG5cbiAgdmFyIGh1bmtzID0gW107XG4gIHZhciBvbGRSYW5nZVN0YXJ0ID0gMCxcbiAgICAgIG5ld1JhbmdlU3RhcnQgPSAwLFxuICAgICAgY3VyUmFuZ2UgPSBbXSxcbiAgICAgIG9sZExpbmUgPSAxLFxuICAgICAgbmV3TGluZSA9IDE7XG5cbiAgdmFyIF9sb29wID0gZnVuY3Rpb24gX2xvb3AoaSkge1xuICAgIHZhciBjdXJyZW50ID0gZGlmZltpXSxcbiAgICAgICAgbGluZXMgPSBjdXJyZW50LmxpbmVzIHx8IGN1cnJlbnQudmFsdWUucmVwbGFjZSgvXFxuJC8sICcnKS5zcGxpdCgnXFxuJyk7XG4gICAgY3VycmVudC5saW5lcyA9IGxpbmVzO1xuXG4gICAgaWYgKGN1cnJlbnQuYWRkZWQgfHwgY3VycmVudC5yZW1vdmVkKSB7XG4gICAgICB2YXIgX2N1clJhbmdlO1xuXG4gICAgICAvLyBJZiB3ZSBoYXZlIHByZXZpb3VzIGNvbnRleHQsIHN0YXJ0IHdpdGggdGhhdFxuICAgICAgaWYgKCFvbGRSYW5nZVN0YXJ0KSB7XG4gICAgICAgIHZhciBwcmV2ID0gZGlmZltpIC0gMV07XG4gICAgICAgIG9sZFJhbmdlU3RhcnQgPSBvbGRMaW5lO1xuICAgICAgICBuZXdSYW5nZVN0YXJ0ID0gbmV3TGluZTtcblxuICAgICAgICBpZiAocHJldikge1xuICAgICAgICAgIGN1clJhbmdlID0gb3B0aW9ucy5jb250ZXh0ID4gMCA/IGNvbnRleHRMaW5lcyhwcmV2LmxpbmVzLnNsaWNlKC1vcHRpb25zLmNvbnRleHQpKSA6IFtdO1xuICAgICAgICAgIG9sZFJhbmdlU3RhcnQgLT0gY3VyUmFuZ2UubGVuZ3RoO1xuICAgICAgICAgIG5ld1JhbmdlU3RhcnQgLT0gY3VyUmFuZ2UubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICB9IC8vIE91dHB1dCBvdXIgY2hhbmdlc1xuXG5cbiAgICAgIChfY3VyUmFuZ2UgPSBjdXJSYW5nZSkucHVzaC5hcHBseShfY3VyUmFuZ2UsIF90b0NvbnN1bWFibGVBcnJheShsaW5lcy5tYXAoZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgICAgIHJldHVybiAoY3VycmVudC5hZGRlZCA/ICcrJyA6ICctJykgKyBlbnRyeTtcbiAgICAgIH0pKSk7IC8vIFRyYWNrIHRoZSB1cGRhdGVkIGZpbGUgcG9zaXRpb25cblxuXG4gICAgICBpZiAoY3VycmVudC5hZGRlZCkge1xuICAgICAgICBuZXdMaW5lICs9IGxpbmVzLmxlbmd0aDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9sZExpbmUgKz0gbGluZXMubGVuZ3RoO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZGVudGljYWwgY29udGV4dCBsaW5lcy4gVHJhY2sgbGluZSBjaGFuZ2VzXG4gICAgICBpZiAob2xkUmFuZ2VTdGFydCkge1xuICAgICAgICAvLyBDbG9zZSBvdXQgYW55IGNoYW5nZXMgdGhhdCBoYXZlIGJlZW4gb3V0cHV0IChvciBqb2luIG92ZXJsYXBwaW5nKVxuICAgICAgICBpZiAobGluZXMubGVuZ3RoIDw9IG9wdGlvbnMuY29udGV4dCAqIDIgJiYgaSA8IGRpZmYubGVuZ3RoIC0gMikge1xuICAgICAgICAgIHZhciBfY3VyUmFuZ2UyO1xuXG4gICAgICAgICAgLy8gT3ZlcmxhcHBpbmdcbiAgICAgICAgICAoX2N1clJhbmdlMiA9IGN1clJhbmdlKS5wdXNoLmFwcGx5KF9jdXJSYW5nZTIsIF90b0NvbnN1bWFibGVBcnJheShjb250ZXh0TGluZXMobGluZXMpKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIF9jdXJSYW5nZTM7XG5cbiAgICAgICAgICAvLyBlbmQgdGhlIHJhbmdlIGFuZCBvdXRwdXRcbiAgICAgICAgICB2YXIgY29udGV4dFNpemUgPSBNYXRoLm1pbihsaW5lcy5sZW5ndGgsIG9wdGlvbnMuY29udGV4dCk7XG5cbiAgICAgICAgICAoX2N1clJhbmdlMyA9IGN1clJhbmdlKS5wdXNoLmFwcGx5KF9jdXJSYW5nZTMsIF90b0NvbnN1bWFibGVBcnJheShjb250ZXh0TGluZXMobGluZXMuc2xpY2UoMCwgY29udGV4dFNpemUpKSkpO1xuXG4gICAgICAgICAgdmFyIGh1bmsgPSB7XG4gICAgICAgICAgICBvbGRTdGFydDogb2xkUmFuZ2VTdGFydCxcbiAgICAgICAgICAgIG9sZExpbmVzOiBvbGRMaW5lIC0gb2xkUmFuZ2VTdGFydCArIGNvbnRleHRTaXplLFxuICAgICAgICAgICAgbmV3U3RhcnQ6IG5ld1JhbmdlU3RhcnQsXG4gICAgICAgICAgICBuZXdMaW5lczogbmV3TGluZSAtIG5ld1JhbmdlU3RhcnQgKyBjb250ZXh0U2l6ZSxcbiAgICAgICAgICAgIGxpbmVzOiBjdXJSYW5nZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBpZiAoaSA+PSBkaWZmLmxlbmd0aCAtIDIgJiYgbGluZXMubGVuZ3RoIDw9IG9wdGlvbnMuY29udGV4dCkge1xuICAgICAgICAgICAgLy8gRU9GIGlzIGluc2lkZSB0aGlzIGh1bmtcbiAgICAgICAgICAgIHZhciBvbGRFT0ZOZXdsaW5lID0gL1xcbiQvLnRlc3Qob2xkU3RyKTtcbiAgICAgICAgICAgIHZhciBuZXdFT0ZOZXdsaW5lID0gL1xcbiQvLnRlc3QobmV3U3RyKTtcbiAgICAgICAgICAgIHZhciBub05sQmVmb3JlQWRkcyA9IGxpbmVzLmxlbmd0aCA9PSAwICYmIGN1clJhbmdlLmxlbmd0aCA+IGh1bmsub2xkTGluZXM7XG5cbiAgICAgICAgICAgIGlmICghb2xkRU9GTmV3bGluZSAmJiBub05sQmVmb3JlQWRkcyAmJiBvbGRTdHIubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAvLyBzcGVjaWFsIGNhc2U6IG9sZCBoYXMgbm8gZW9sIGFuZCBubyB0cmFpbGluZyBjb250ZXh0OyBuby1ubCBjYW4gZW5kIHVwIGJlZm9yZSBhZGRzXG4gICAgICAgICAgICAgIC8vIGhvd2V2ZXIsIGlmIHRoZSBvbGQgZmlsZSBpcyBlbXB0eSwgZG8gbm90IG91dHB1dCB0aGUgbm8tbmwgbGluZVxuICAgICAgICAgICAgICBjdXJSYW5nZS5zcGxpY2UoaHVuay5vbGRMaW5lcywgMCwgJ1xcXFwgTm8gbmV3bGluZSBhdCBlbmQgb2YgZmlsZScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIW9sZEVPRk5ld2xpbmUgJiYgIW5vTmxCZWZvcmVBZGRzIHx8ICFuZXdFT0ZOZXdsaW5lKSB7XG4gICAgICAgICAgICAgIGN1clJhbmdlLnB1c2goJ1xcXFwgTm8gbmV3bGluZSBhdCBlbmQgb2YgZmlsZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGh1bmtzLnB1c2goaHVuayk7XG4gICAgICAgICAgb2xkUmFuZ2VTdGFydCA9IDA7XG4gICAgICAgICAgbmV3UmFuZ2VTdGFydCA9IDA7XG4gICAgICAgICAgY3VyUmFuZ2UgPSBbXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBvbGRMaW5lICs9IGxpbmVzLmxlbmd0aDtcbiAgICAgIG5ld0xpbmUgKz0gbGluZXMubGVuZ3RoO1xuICAgIH1cbiAgfTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGRpZmYubGVuZ3RoOyBpKyspIHtcbiAgICBfbG9vcChpKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgb2xkRmlsZU5hbWU6IG9sZEZpbGVOYW1lLFxuICAgIG5ld0ZpbGVOYW1lOiBuZXdGaWxlTmFtZSxcbiAgICBvbGRIZWFkZXI6IG9sZEhlYWRlcixcbiAgICBuZXdIZWFkZXI6IG5ld0hlYWRlcixcbiAgICBodW5rczogaHVua3NcbiAgfTtcbn1cbmZ1bmN0aW9uIGZvcm1hdFBhdGNoKGRpZmYpIHtcbiAgdmFyIHJldCA9IFtdO1xuXG4gIGlmIChkaWZmLm9sZEZpbGVOYW1lID09IGRpZmYubmV3RmlsZU5hbWUpIHtcbiAgICByZXQucHVzaCgnSW5kZXg6ICcgKyBkaWZmLm9sZEZpbGVOYW1lKTtcbiAgfVxuXG4gIHJldC5wdXNoKCc9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Jyk7XG4gIHJldC5wdXNoKCctLS0gJyArIGRpZmYub2xkRmlsZU5hbWUgKyAodHlwZW9mIGRpZmYub2xkSGVhZGVyID09PSAndW5kZWZpbmVkJyA/ICcnIDogJ1xcdCcgKyBkaWZmLm9sZEhlYWRlcikpO1xuICByZXQucHVzaCgnKysrICcgKyBkaWZmLm5ld0ZpbGVOYW1lICsgKHR5cGVvZiBkaWZmLm5ld0hlYWRlciA9PT0gJ3VuZGVmaW5lZCcgPyAnJyA6ICdcXHQnICsgZGlmZi5uZXdIZWFkZXIpKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGRpZmYuaHVua3MubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaHVuayA9IGRpZmYuaHVua3NbaV07IC8vIFVuaWZpZWQgRGlmZiBGb3JtYXQgcXVpcms6IElmIHRoZSBjaHVuayBzaXplIGlzIDAsXG4gICAgLy8gdGhlIGZpcnN0IG51bWJlciBpcyBvbmUgbG93ZXIgdGhhbiBvbmUgd291bGQgZXhwZWN0LlxuICAgIC8vIGh0dHBzOi8vd3d3LmFydGltYS5jb20vd2VibG9ncy92aWV3cG9zdC5qc3A/dGhyZWFkPTE2NDI5M1xuXG4gICAgaWYgKGh1bmsub2xkTGluZXMgPT09IDApIHtcbiAgICAgIGh1bmsub2xkU3RhcnQgLT0gMTtcbiAgICB9XG5cbiAgICBpZiAoaHVuay5uZXdMaW5lcyA9PT0gMCkge1xuICAgICAgaHVuay5uZXdTdGFydCAtPSAxO1xuICAgIH1cblxuICAgIHJldC5wdXNoKCdAQCAtJyArIGh1bmsub2xkU3RhcnQgKyAnLCcgKyBodW5rLm9sZExpbmVzICsgJyArJyArIGh1bmsubmV3U3RhcnQgKyAnLCcgKyBodW5rLm5ld0xpbmVzICsgJyBAQCcpO1xuICAgIHJldC5wdXNoLmFwcGx5KHJldCwgaHVuay5saW5lcyk7XG4gIH1cblxuICByZXR1cm4gcmV0LmpvaW4oJ1xcbicpICsgJ1xcbic7XG59XG5mdW5jdGlvbiBjcmVhdGVUd29GaWxlc1BhdGNoKG9sZEZpbGVOYW1lLCBuZXdGaWxlTmFtZSwgb2xkU3RyLCBuZXdTdHIsIG9sZEhlYWRlciwgbmV3SGVhZGVyLCBvcHRpb25zKSB7XG4gIHJldHVybiBmb3JtYXRQYXRjaChzdHJ1Y3R1cmVkUGF0Y2gob2xkRmlsZU5hbWUsIG5ld0ZpbGVOYW1lLCBvbGRTdHIsIG5ld1N0ciwgb2xkSGVhZGVyLCBuZXdIZWFkZXIsIG9wdGlvbnMpKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZVBhdGNoKGZpbGVOYW1lLCBvbGRTdHIsIG5ld1N0ciwgb2xkSGVhZGVyLCBuZXdIZWFkZXIsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIGNyZWF0ZVR3b0ZpbGVzUGF0Y2goZmlsZU5hbWUsIGZpbGVOYW1lLCBvbGRTdHIsIG5ld1N0ciwgb2xkSGVhZGVyLCBuZXdIZWFkZXIsIG9wdGlvbnMpO1xufVxuXG5mdW5jdGlvbiBhcnJheUVxdWFsKGEsIGIpIHtcbiAgaWYgKGEubGVuZ3RoICE9PSBiLmxlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBhcnJheVN0YXJ0c1dpdGgoYSwgYik7XG59XG5mdW5jdGlvbiBhcnJheVN0YXJ0c1dpdGgoYXJyYXksIHN0YXJ0KSB7XG4gIGlmIChzdGFydC5sZW5ndGggPiBhcnJheS5sZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0YXJ0Lmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0YXJ0W2ldICE9PSBhcnJheVtpXSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBjYWxjTGluZUNvdW50KGh1bmspIHtcbiAgdmFyIF9jYWxjT2xkTmV3TGluZUNvdW50ID0gY2FsY09sZE5ld0xpbmVDb3VudChodW5rLmxpbmVzKSxcbiAgICAgIG9sZExpbmVzID0gX2NhbGNPbGROZXdMaW5lQ291bnQub2xkTGluZXMsXG4gICAgICBuZXdMaW5lcyA9IF9jYWxjT2xkTmV3TGluZUNvdW50Lm5ld0xpbmVzO1xuXG4gIGlmIChvbGRMaW5lcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaHVuay5vbGRMaW5lcyA9IG9sZExpbmVzO1xuICB9IGVsc2Uge1xuICAgIGRlbGV0ZSBodW5rLm9sZExpbmVzO1xuICB9XG5cbiAgaWYgKG5ld0xpbmVzICE9PSB1bmRlZmluZWQpIHtcbiAgICBodW5rLm5ld0xpbmVzID0gbmV3TGluZXM7XG4gIH0gZWxzZSB7XG4gICAgZGVsZXRlIGh1bmsubmV3TGluZXM7XG4gIH1cbn1cbmZ1bmN0aW9uIG1lcmdlKG1pbmUsIHRoZWlycywgYmFzZSkge1xuICBtaW5lID0gbG9hZFBhdGNoKG1pbmUsIGJhc2UpO1xuICB0aGVpcnMgPSBsb2FkUGF0Y2godGhlaXJzLCBiYXNlKTtcbiAgdmFyIHJldCA9IHt9OyAvLyBGb3IgaW5kZXggd2UganVzdCBsZXQgaXQgcGFzcyB0aHJvdWdoIGFzIGl0IGRvZXNuJ3QgaGF2ZSBhbnkgbmVjZXNzYXJ5IG1lYW5pbmcuXG4gIC8vIExlYXZpbmcgc2FuaXR5IGNoZWNrcyBvbiB0aGlzIHRvIHRoZSBBUEkgY29uc3VtZXIgdGhhdCBtYXkga25vdyBtb3JlIGFib3V0IHRoZVxuICAvLyBtZWFuaW5nIGluIHRoZWlyIG93biBjb250ZXh0LlxuXG4gIGlmIChtaW5lLmluZGV4IHx8IHRoZWlycy5pbmRleCkge1xuICAgIHJldC5pbmRleCA9IG1pbmUuaW5kZXggfHwgdGhlaXJzLmluZGV4O1xuICB9XG5cbiAgaWYgKG1pbmUubmV3RmlsZU5hbWUgfHwgdGhlaXJzLm5ld0ZpbGVOYW1lKSB7XG4gICAgaWYgKCFmaWxlTmFtZUNoYW5nZWQobWluZSkpIHtcbiAgICAgIC8vIE5vIGhlYWRlciBvciBubyBjaGFuZ2UgaW4gb3VycywgdXNlIHRoZWlycyAoYW5kIG91cnMgaWYgdGhlaXJzIGRvZXMgbm90IGV4aXN0KVxuICAgICAgcmV0Lm9sZEZpbGVOYW1lID0gdGhlaXJzLm9sZEZpbGVOYW1lIHx8IG1pbmUub2xkRmlsZU5hbWU7XG4gICAgICByZXQubmV3RmlsZU5hbWUgPSB0aGVpcnMubmV3RmlsZU5hbWUgfHwgbWluZS5uZXdGaWxlTmFtZTtcbiAgICAgIHJldC5vbGRIZWFkZXIgPSB0aGVpcnMub2xkSGVhZGVyIHx8IG1pbmUub2xkSGVhZGVyO1xuICAgICAgcmV0Lm5ld0hlYWRlciA9IHRoZWlycy5uZXdIZWFkZXIgfHwgbWluZS5uZXdIZWFkZXI7XG4gICAgfSBlbHNlIGlmICghZmlsZU5hbWVDaGFuZ2VkKHRoZWlycykpIHtcbiAgICAgIC8vIE5vIGhlYWRlciBvciBubyBjaGFuZ2UgaW4gdGhlaXJzLCB1c2Ugb3Vyc1xuICAgICAgcmV0Lm9sZEZpbGVOYW1lID0gbWluZS5vbGRGaWxlTmFtZTtcbiAgICAgIHJldC5uZXdGaWxlTmFtZSA9IG1pbmUubmV3RmlsZU5hbWU7XG4gICAgICByZXQub2xkSGVhZGVyID0gbWluZS5vbGRIZWFkZXI7XG4gICAgICByZXQubmV3SGVhZGVyID0gbWluZS5uZXdIZWFkZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEJvdGggY2hhbmdlZC4uLiBmaWd1cmUgaXQgb3V0XG4gICAgICByZXQub2xkRmlsZU5hbWUgPSBzZWxlY3RGaWVsZChyZXQsIG1pbmUub2xkRmlsZU5hbWUsIHRoZWlycy5vbGRGaWxlTmFtZSk7XG4gICAgICByZXQubmV3RmlsZU5hbWUgPSBzZWxlY3RGaWVsZChyZXQsIG1pbmUubmV3RmlsZU5hbWUsIHRoZWlycy5uZXdGaWxlTmFtZSk7XG4gICAgICByZXQub2xkSGVhZGVyID0gc2VsZWN0RmllbGQocmV0LCBtaW5lLm9sZEhlYWRlciwgdGhlaXJzLm9sZEhlYWRlcik7XG4gICAgICByZXQubmV3SGVhZGVyID0gc2VsZWN0RmllbGQocmV0LCBtaW5lLm5ld0hlYWRlciwgdGhlaXJzLm5ld0hlYWRlcik7XG4gICAgfVxuICB9XG5cbiAgcmV0Lmh1bmtzID0gW107XG4gIHZhciBtaW5lSW5kZXggPSAwLFxuICAgICAgdGhlaXJzSW5kZXggPSAwLFxuICAgICAgbWluZU9mZnNldCA9IDAsXG4gICAgICB0aGVpcnNPZmZzZXQgPSAwO1xuXG4gIHdoaWxlIChtaW5lSW5kZXggPCBtaW5lLmh1bmtzLmxlbmd0aCB8fCB0aGVpcnNJbmRleCA8IHRoZWlycy5odW5rcy5sZW5ndGgpIHtcbiAgICB2YXIgbWluZUN1cnJlbnQgPSBtaW5lLmh1bmtzW21pbmVJbmRleF0gfHwge1xuICAgICAgb2xkU3RhcnQ6IEluZmluaXR5XG4gICAgfSxcbiAgICAgICAgdGhlaXJzQ3VycmVudCA9IHRoZWlycy5odW5rc1t0aGVpcnNJbmRleF0gfHwge1xuICAgICAgb2xkU3RhcnQ6IEluZmluaXR5XG4gICAgfTtcblxuICAgIGlmIChodW5rQmVmb3JlKG1pbmVDdXJyZW50LCB0aGVpcnNDdXJyZW50KSkge1xuICAgICAgLy8gVGhpcyBwYXRjaCBkb2VzIG5vdCBvdmVybGFwIHdpdGggYW55IG9mIHRoZSBvdGhlcnMsIHlheS5cbiAgICAgIHJldC5odW5rcy5wdXNoKGNsb25lSHVuayhtaW5lQ3VycmVudCwgbWluZU9mZnNldCkpO1xuICAgICAgbWluZUluZGV4Kys7XG4gICAgICB0aGVpcnNPZmZzZXQgKz0gbWluZUN1cnJlbnQubmV3TGluZXMgLSBtaW5lQ3VycmVudC5vbGRMaW5lcztcbiAgICB9IGVsc2UgaWYgKGh1bmtCZWZvcmUodGhlaXJzQ3VycmVudCwgbWluZUN1cnJlbnQpKSB7XG4gICAgICAvLyBUaGlzIHBhdGNoIGRvZXMgbm90IG92ZXJsYXAgd2l0aCBhbnkgb2YgdGhlIG90aGVycywgeWF5LlxuICAgICAgcmV0Lmh1bmtzLnB1c2goY2xvbmVIdW5rKHRoZWlyc0N1cnJlbnQsIHRoZWlyc09mZnNldCkpO1xuICAgICAgdGhlaXJzSW5kZXgrKztcbiAgICAgIG1pbmVPZmZzZXQgKz0gdGhlaXJzQ3VycmVudC5uZXdMaW5lcyAtIHRoZWlyc0N1cnJlbnQub2xkTGluZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE92ZXJsYXAsIG1lcmdlIGFzIGJlc3Qgd2UgY2FuXG4gICAgICB2YXIgbWVyZ2VkSHVuayA9IHtcbiAgICAgICAgb2xkU3RhcnQ6IE1hdGgubWluKG1pbmVDdXJyZW50Lm9sZFN0YXJ0LCB0aGVpcnNDdXJyZW50Lm9sZFN0YXJ0KSxcbiAgICAgICAgb2xkTGluZXM6IDAsXG4gICAgICAgIG5ld1N0YXJ0OiBNYXRoLm1pbihtaW5lQ3VycmVudC5uZXdTdGFydCArIG1pbmVPZmZzZXQsIHRoZWlyc0N1cnJlbnQub2xkU3RhcnQgKyB0aGVpcnNPZmZzZXQpLFxuICAgICAgICBuZXdMaW5lczogMCxcbiAgICAgICAgbGluZXM6IFtdXG4gICAgICB9O1xuICAgICAgbWVyZ2VMaW5lcyhtZXJnZWRIdW5rLCBtaW5lQ3VycmVudC5vbGRTdGFydCwgbWluZUN1cnJlbnQubGluZXMsIHRoZWlyc0N1cnJlbnQub2xkU3RhcnQsIHRoZWlyc0N1cnJlbnQubGluZXMpO1xuICAgICAgdGhlaXJzSW5kZXgrKztcbiAgICAgIG1pbmVJbmRleCsrO1xuICAgICAgcmV0Lmh1bmtzLnB1c2gobWVyZ2VkSHVuayk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJldDtcbn1cblxuZnVuY3Rpb24gbG9hZFBhdGNoKHBhcmFtLCBiYXNlKSB7XG4gIGlmICh0eXBlb2YgcGFyYW0gPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKC9eQEAvbS50ZXN0KHBhcmFtKSB8fCAvXkluZGV4Oi9tLnRlc3QocGFyYW0pKSB7XG4gICAgICByZXR1cm4gcGFyc2VQYXRjaChwYXJhbSlbMF07XG4gICAgfVxuXG4gICAgaWYgKCFiYXNlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ011c3QgcHJvdmlkZSBhIGJhc2UgcmVmZXJlbmNlIG9yIHBhc3MgaW4gYSBwYXRjaCcpO1xuICAgIH1cblxuICAgIHJldHVybiBzdHJ1Y3R1cmVkUGF0Y2godW5kZWZpbmVkLCB1bmRlZmluZWQsIGJhc2UsIHBhcmFtKTtcbiAgfVxuXG4gIHJldHVybiBwYXJhbTtcbn1cblxuZnVuY3Rpb24gZmlsZU5hbWVDaGFuZ2VkKHBhdGNoKSB7XG4gIHJldHVybiBwYXRjaC5uZXdGaWxlTmFtZSAmJiBwYXRjaC5uZXdGaWxlTmFtZSAhPT0gcGF0Y2gub2xkRmlsZU5hbWU7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdEZpZWxkKGluZGV4LCBtaW5lLCB0aGVpcnMpIHtcbiAgaWYgKG1pbmUgPT09IHRoZWlycykge1xuICAgIHJldHVybiBtaW5lO1xuICB9IGVsc2Uge1xuICAgIGluZGV4LmNvbmZsaWN0ID0gdHJ1ZTtcbiAgICByZXR1cm4ge1xuICAgICAgbWluZTogbWluZSxcbiAgICAgIHRoZWlyczogdGhlaXJzXG4gICAgfTtcbiAgfVxufVxuXG5mdW5jdGlvbiBodW5rQmVmb3JlKHRlc3QsIGNoZWNrKSB7XG4gIHJldHVybiB0ZXN0Lm9sZFN0YXJ0IDwgY2hlY2sub2xkU3RhcnQgJiYgdGVzdC5vbGRTdGFydCArIHRlc3Qub2xkTGluZXMgPCBjaGVjay5vbGRTdGFydDtcbn1cblxuZnVuY3Rpb24gY2xvbmVIdW5rKGh1bmssIG9mZnNldCkge1xuICByZXR1cm4ge1xuICAgIG9sZFN0YXJ0OiBodW5rLm9sZFN0YXJ0LFxuICAgIG9sZExpbmVzOiBodW5rLm9sZExpbmVzLFxuICAgIG5ld1N0YXJ0OiBodW5rLm5ld1N0YXJ0ICsgb2Zmc2V0LFxuICAgIG5ld0xpbmVzOiBodW5rLm5ld0xpbmVzLFxuICAgIGxpbmVzOiBodW5rLmxpbmVzXG4gIH07XG59XG5cbmZ1bmN0aW9uIG1lcmdlTGluZXMoaHVuaywgbWluZU9mZnNldCwgbWluZUxpbmVzLCB0aGVpck9mZnNldCwgdGhlaXJMaW5lcykge1xuICAvLyBUaGlzIHdpbGwgZ2VuZXJhbGx5IHJlc3VsdCBpbiBhIGNvbmZsaWN0ZWQgaHVuaywgYnV0IHRoZXJlIGFyZSBjYXNlcyB3aGVyZSB0aGUgY29udGV4dFxuICAvLyBpcyB0aGUgb25seSBvdmVybGFwIHdoZXJlIHdlIGNhbiBzdWNjZXNzZnVsbHkgbWVyZ2UgdGhlIGNvbnRlbnQgaGVyZS5cbiAgdmFyIG1pbmUgPSB7XG4gICAgb2Zmc2V0OiBtaW5lT2Zmc2V0LFxuICAgIGxpbmVzOiBtaW5lTGluZXMsXG4gICAgaW5kZXg6IDBcbiAgfSxcbiAgICAgIHRoZWlyID0ge1xuICAgIG9mZnNldDogdGhlaXJPZmZzZXQsXG4gICAgbGluZXM6IHRoZWlyTGluZXMsXG4gICAgaW5kZXg6IDBcbiAgfTsgLy8gSGFuZGxlIGFueSBsZWFkaW5nIGNvbnRlbnRcblxuICBpbnNlcnRMZWFkaW5nKGh1bmssIG1pbmUsIHRoZWlyKTtcbiAgaW5zZXJ0TGVhZGluZyhodW5rLCB0aGVpciwgbWluZSk7IC8vIE5vdyBpbiB0aGUgb3ZlcmxhcCBjb250ZW50LiBTY2FuIHRocm91Z2ggYW5kIHNlbGVjdCB0aGUgYmVzdCBjaGFuZ2VzIGZyb20gZWFjaC5cblxuICB3aGlsZSAobWluZS5pbmRleCA8IG1pbmUubGluZXMubGVuZ3RoICYmIHRoZWlyLmluZGV4IDwgdGhlaXIubGluZXMubGVuZ3RoKSB7XG4gICAgdmFyIG1pbmVDdXJyZW50ID0gbWluZS5saW5lc1ttaW5lLmluZGV4XSxcbiAgICAgICAgdGhlaXJDdXJyZW50ID0gdGhlaXIubGluZXNbdGhlaXIuaW5kZXhdO1xuXG4gICAgaWYgKChtaW5lQ3VycmVudFswXSA9PT0gJy0nIHx8IG1pbmVDdXJyZW50WzBdID09PSAnKycpICYmICh0aGVpckN1cnJlbnRbMF0gPT09ICctJyB8fCB0aGVpckN1cnJlbnRbMF0gPT09ICcrJykpIHtcbiAgICAgIC8vIEJvdGggbW9kaWZpZWQgLi4uXG4gICAgICBtdXR1YWxDaGFuZ2UoaHVuaywgbWluZSwgdGhlaXIpO1xuICAgIH0gZWxzZSBpZiAobWluZUN1cnJlbnRbMF0gPT09ICcrJyAmJiB0aGVpckN1cnJlbnRbMF0gPT09ICcgJykge1xuICAgICAgdmFyIF9odW5rJGxpbmVzO1xuXG4gICAgICAvLyBNaW5lIGluc2VydGVkXG4gICAgICAoX2h1bmskbGluZXMgPSBodW5rLmxpbmVzKS5wdXNoLmFwcGx5KF9odW5rJGxpbmVzLCBfdG9Db25zdW1hYmxlQXJyYXkoY29sbGVjdENoYW5nZShtaW5lKSkpO1xuICAgIH0gZWxzZSBpZiAodGhlaXJDdXJyZW50WzBdID09PSAnKycgJiYgbWluZUN1cnJlbnRbMF0gPT09ICcgJykge1xuICAgICAgdmFyIF9odW5rJGxpbmVzMjtcblxuICAgICAgLy8gVGhlaXJzIGluc2VydGVkXG4gICAgICAoX2h1bmskbGluZXMyID0gaHVuay5saW5lcykucHVzaC5hcHBseShfaHVuayRsaW5lczIsIF90b0NvbnN1bWFibGVBcnJheShjb2xsZWN0Q2hhbmdlKHRoZWlyKSkpO1xuICAgIH0gZWxzZSBpZiAobWluZUN1cnJlbnRbMF0gPT09ICctJyAmJiB0aGVpckN1cnJlbnRbMF0gPT09ICcgJykge1xuICAgICAgLy8gTWluZSByZW1vdmVkIG9yIGVkaXRlZFxuICAgICAgcmVtb3ZhbChodW5rLCBtaW5lLCB0aGVpcik7XG4gICAgfSBlbHNlIGlmICh0aGVpckN1cnJlbnRbMF0gPT09ICctJyAmJiBtaW5lQ3VycmVudFswXSA9PT0gJyAnKSB7XG4gICAgICAvLyBUaGVpciByZW1vdmVkIG9yIGVkaXRlZFxuICAgICAgcmVtb3ZhbChodW5rLCB0aGVpciwgbWluZSwgdHJ1ZSk7XG4gICAgfSBlbHNlIGlmIChtaW5lQ3VycmVudCA9PT0gdGhlaXJDdXJyZW50KSB7XG4gICAgICAvLyBDb250ZXh0IGlkZW50aXR5XG4gICAgICBodW5rLmxpbmVzLnB1c2gobWluZUN1cnJlbnQpO1xuICAgICAgbWluZS5pbmRleCsrO1xuICAgICAgdGhlaXIuaW5kZXgrKztcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQ29udGV4dCBtaXNtYXRjaFxuICAgICAgY29uZmxpY3QoaHVuaywgY29sbGVjdENoYW5nZShtaW5lKSwgY29sbGVjdENoYW5nZSh0aGVpcikpO1xuICAgIH1cbiAgfSAvLyBOb3cgcHVzaCBhbnl0aGluZyB0aGF0IG1heSBiZSByZW1haW5pbmdcblxuXG4gIGluc2VydFRyYWlsaW5nKGh1bmssIG1pbmUpO1xuICBpbnNlcnRUcmFpbGluZyhodW5rLCB0aGVpcik7XG4gIGNhbGNMaW5lQ291bnQoaHVuayk7XG59XG5cbmZ1bmN0aW9uIG11dHVhbENoYW5nZShodW5rLCBtaW5lLCB0aGVpcikge1xuICB2YXIgbXlDaGFuZ2VzID0gY29sbGVjdENoYW5nZShtaW5lKSxcbiAgICAgIHRoZWlyQ2hhbmdlcyA9IGNvbGxlY3RDaGFuZ2UodGhlaXIpO1xuXG4gIGlmIChhbGxSZW1vdmVzKG15Q2hhbmdlcykgJiYgYWxsUmVtb3Zlcyh0aGVpckNoYW5nZXMpKSB7XG4gICAgLy8gU3BlY2lhbCBjYXNlIGZvciByZW1vdmUgY2hhbmdlcyB0aGF0IGFyZSBzdXBlcnNldHMgb2Ygb25lIGFub3RoZXJcbiAgICBpZiAoYXJyYXlTdGFydHNXaXRoKG15Q2hhbmdlcywgdGhlaXJDaGFuZ2VzKSAmJiBza2lwUmVtb3ZlU3VwZXJzZXQodGhlaXIsIG15Q2hhbmdlcywgbXlDaGFuZ2VzLmxlbmd0aCAtIHRoZWlyQ2hhbmdlcy5sZW5ndGgpKSB7XG4gICAgICB2YXIgX2h1bmskbGluZXMzO1xuXG4gICAgICAoX2h1bmskbGluZXMzID0gaHVuay5saW5lcykucHVzaC5hcHBseShfaHVuayRsaW5lczMsIF90b0NvbnN1bWFibGVBcnJheShteUNoYW5nZXMpKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAoYXJyYXlTdGFydHNXaXRoKHRoZWlyQ2hhbmdlcywgbXlDaGFuZ2VzKSAmJiBza2lwUmVtb3ZlU3VwZXJzZXQobWluZSwgdGhlaXJDaGFuZ2VzLCB0aGVpckNoYW5nZXMubGVuZ3RoIC0gbXlDaGFuZ2VzLmxlbmd0aCkpIHtcbiAgICAgIHZhciBfaHVuayRsaW5lczQ7XG5cbiAgICAgIChfaHVuayRsaW5lczQgPSBodW5rLmxpbmVzKS5wdXNoLmFwcGx5KF9odW5rJGxpbmVzNCwgX3RvQ29uc3VtYWJsZUFycmF5KHRoZWlyQ2hhbmdlcykpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuICB9IGVsc2UgaWYgKGFycmF5RXF1YWwobXlDaGFuZ2VzLCB0aGVpckNoYW5nZXMpKSB7XG4gICAgdmFyIF9odW5rJGxpbmVzNTtcblxuICAgIChfaHVuayRsaW5lczUgPSBodW5rLmxpbmVzKS5wdXNoLmFwcGx5KF9odW5rJGxpbmVzNSwgX3RvQ29uc3VtYWJsZUFycmF5KG15Q2hhbmdlcykpO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uZmxpY3QoaHVuaywgbXlDaGFuZ2VzLCB0aGVpckNoYW5nZXMpO1xufVxuXG5mdW5jdGlvbiByZW1vdmFsKGh1bmssIG1pbmUsIHRoZWlyLCBzd2FwKSB7XG4gIHZhciBteUNoYW5nZXMgPSBjb2xsZWN0Q2hhbmdlKG1pbmUpLFxuICAgICAgdGhlaXJDaGFuZ2VzID0gY29sbGVjdENvbnRleHQodGhlaXIsIG15Q2hhbmdlcyk7XG5cbiAgaWYgKHRoZWlyQ2hhbmdlcy5tZXJnZWQpIHtcbiAgICB2YXIgX2h1bmskbGluZXM2O1xuXG4gICAgKF9odW5rJGxpbmVzNiA9IGh1bmsubGluZXMpLnB1c2guYXBwbHkoX2h1bmskbGluZXM2LCBfdG9Db25zdW1hYmxlQXJyYXkodGhlaXJDaGFuZ2VzLm1lcmdlZCkpO1xuICB9IGVsc2Uge1xuICAgIGNvbmZsaWN0KGh1bmssIHN3YXAgPyB0aGVpckNoYW5nZXMgOiBteUNoYW5nZXMsIHN3YXAgPyBteUNoYW5nZXMgOiB0aGVpckNoYW5nZXMpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNvbmZsaWN0KGh1bmssIG1pbmUsIHRoZWlyKSB7XG4gIGh1bmsuY29uZmxpY3QgPSB0cnVlO1xuICBodW5rLmxpbmVzLnB1c2goe1xuICAgIGNvbmZsaWN0OiB0cnVlLFxuICAgIG1pbmU6IG1pbmUsXG4gICAgdGhlaXJzOiB0aGVpclxuICB9KTtcbn1cblxuZnVuY3Rpb24gaW5zZXJ0TGVhZGluZyhodW5rLCBpbnNlcnQsIHRoZWlyKSB7XG4gIHdoaWxlIChpbnNlcnQub2Zmc2V0IDwgdGhlaXIub2Zmc2V0ICYmIGluc2VydC5pbmRleCA8IGluc2VydC5saW5lcy5sZW5ndGgpIHtcbiAgICB2YXIgbGluZSA9IGluc2VydC5saW5lc1tpbnNlcnQuaW5kZXgrK107XG4gICAgaHVuay5saW5lcy5wdXNoKGxpbmUpO1xuICAgIGluc2VydC5vZmZzZXQrKztcbiAgfVxufVxuXG5mdW5jdGlvbiBpbnNlcnRUcmFpbGluZyhodW5rLCBpbnNlcnQpIHtcbiAgd2hpbGUgKGluc2VydC5pbmRleCA8IGluc2VydC5saW5lcy5sZW5ndGgpIHtcbiAgICB2YXIgbGluZSA9IGluc2VydC5saW5lc1tpbnNlcnQuaW5kZXgrK107XG4gICAgaHVuay5saW5lcy5wdXNoKGxpbmUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNvbGxlY3RDaGFuZ2Uoc3RhdGUpIHtcbiAgdmFyIHJldCA9IFtdLFxuICAgICAgb3BlcmF0aW9uID0gc3RhdGUubGluZXNbc3RhdGUuaW5kZXhdWzBdO1xuXG4gIHdoaWxlIChzdGF0ZS5pbmRleCA8IHN0YXRlLmxpbmVzLmxlbmd0aCkge1xuICAgIHZhciBsaW5lID0gc3RhdGUubGluZXNbc3RhdGUuaW5kZXhdOyAvLyBHcm91cCBhZGRpdGlvbnMgdGhhdCBhcmUgaW1tZWRpYXRlbHkgYWZ0ZXIgc3VidHJhY3Rpb25zIGFuZCB0cmVhdCB0aGVtIGFzIG9uZSBcImF0b21pY1wiIG1vZGlmeSBjaGFuZ2UuXG5cbiAgICBpZiAob3BlcmF0aW9uID09PSAnLScgJiYgbGluZVswXSA9PT0gJysnKSB7XG4gICAgICBvcGVyYXRpb24gPSAnKyc7XG4gICAgfVxuXG4gICAgaWYgKG9wZXJhdGlvbiA9PT0gbGluZVswXSkge1xuICAgICAgcmV0LnB1c2gobGluZSk7XG4gICAgICBzdGF0ZS5pbmRleCsrO1xuICAgIH0gZWxzZSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmV0O1xufVxuXG5mdW5jdGlvbiBjb2xsZWN0Q29udGV4dChzdGF0ZSwgbWF0Y2hDaGFuZ2VzKSB7XG4gIHZhciBjaGFuZ2VzID0gW10sXG4gICAgICBtZXJnZWQgPSBbXSxcbiAgICAgIG1hdGNoSW5kZXggPSAwLFxuICAgICAgY29udGV4dENoYW5nZXMgPSBmYWxzZSxcbiAgICAgIGNvbmZsaWN0ZWQgPSBmYWxzZTtcblxuICB3aGlsZSAobWF0Y2hJbmRleCA8IG1hdGNoQ2hhbmdlcy5sZW5ndGggJiYgc3RhdGUuaW5kZXggPCBzdGF0ZS5saW5lcy5sZW5ndGgpIHtcbiAgICB2YXIgY2hhbmdlID0gc3RhdGUubGluZXNbc3RhdGUuaW5kZXhdLFxuICAgICAgICBtYXRjaCA9IG1hdGNoQ2hhbmdlc1ttYXRjaEluZGV4XTsgLy8gT25jZSB3ZSd2ZSBoaXQgb3VyIGFkZCwgdGhlbiB3ZSBhcmUgZG9uZVxuXG4gICAgaWYgKG1hdGNoWzBdID09PSAnKycpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGNvbnRleHRDaGFuZ2VzID0gY29udGV4dENoYW5nZXMgfHwgY2hhbmdlWzBdICE9PSAnICc7XG4gICAgbWVyZ2VkLnB1c2gobWF0Y2gpO1xuICAgIG1hdGNoSW5kZXgrKzsgLy8gQ29uc3VtZSBhbnkgYWRkaXRpb25zIGluIHRoZSBvdGhlciBibG9jayBhcyBhIGNvbmZsaWN0IHRvIGF0dGVtcHRcbiAgICAvLyB0byBwdWxsIGluIHRoZSByZW1haW5pbmcgY29udGV4dCBhZnRlciB0aGlzXG5cbiAgICBpZiAoY2hhbmdlWzBdID09PSAnKycpIHtcbiAgICAgIGNvbmZsaWN0ZWQgPSB0cnVlO1xuXG4gICAgICB3aGlsZSAoY2hhbmdlWzBdID09PSAnKycpIHtcbiAgICAgICAgY2hhbmdlcy5wdXNoKGNoYW5nZSk7XG4gICAgICAgIGNoYW5nZSA9IHN0YXRlLmxpbmVzWysrc3RhdGUuaW5kZXhdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChtYXRjaC5zdWJzdHIoMSkgPT09IGNoYW5nZS5zdWJzdHIoMSkpIHtcbiAgICAgIGNoYW5nZXMucHVzaChjaGFuZ2UpO1xuICAgICAgc3RhdGUuaW5kZXgrKztcbiAgICB9IGVsc2Uge1xuICAgICAgY29uZmxpY3RlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKChtYXRjaENoYW5nZXNbbWF0Y2hJbmRleF0gfHwgJycpWzBdID09PSAnKycgJiYgY29udGV4dENoYW5nZXMpIHtcbiAgICBjb25mbGljdGVkID0gdHJ1ZTtcbiAgfVxuXG4gIGlmIChjb25mbGljdGVkKSB7XG4gICAgcmV0dXJuIGNoYW5nZXM7XG4gIH1cblxuICB3aGlsZSAobWF0Y2hJbmRleCA8IG1hdGNoQ2hhbmdlcy5sZW5ndGgpIHtcbiAgICBtZXJnZWQucHVzaChtYXRjaENoYW5nZXNbbWF0Y2hJbmRleCsrXSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIG1lcmdlZDogbWVyZ2VkLFxuICAgIGNoYW5nZXM6IGNoYW5nZXNcbiAgfTtcbn1cblxuZnVuY3Rpb24gYWxsUmVtb3ZlcyhjaGFuZ2VzKSB7XG4gIHJldHVybiBjaGFuZ2VzLnJlZHVjZShmdW5jdGlvbiAocHJldiwgY2hhbmdlKSB7XG4gICAgcmV0dXJuIHByZXYgJiYgY2hhbmdlWzBdID09PSAnLSc7XG4gIH0sIHRydWUpO1xufVxuXG5mdW5jdGlvbiBza2lwUmVtb3ZlU3VwZXJzZXQoc3RhdGUsIHJlbW92ZUNoYW5nZXMsIGRlbHRhKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZGVsdGE7IGkrKykge1xuICAgIHZhciBjaGFuZ2VDb250ZW50ID0gcmVtb3ZlQ2hhbmdlc1tyZW1vdmVDaGFuZ2VzLmxlbmd0aCAtIGRlbHRhICsgaV0uc3Vic3RyKDEpO1xuXG4gICAgaWYgKHN0YXRlLmxpbmVzW3N0YXRlLmluZGV4ICsgaV0gIT09ICcgJyArIGNoYW5nZUNvbnRlbnQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBzdGF0ZS5pbmRleCArPSBkZWx0YTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGNhbGNPbGROZXdMaW5lQ291bnQobGluZXMpIHtcbiAgdmFyIG9sZExpbmVzID0gMDtcbiAgdmFyIG5ld0xpbmVzID0gMDtcbiAgbGluZXMuZm9yRWFjaChmdW5jdGlvbiAobGluZSkge1xuICAgIGlmICh0eXBlb2YgbGluZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHZhciBteUNvdW50ID0gY2FsY09sZE5ld0xpbmVDb3VudChsaW5lLm1pbmUpO1xuICAgICAgdmFyIHRoZWlyQ291bnQgPSBjYWxjT2xkTmV3TGluZUNvdW50KGxpbmUudGhlaXJzKTtcblxuICAgICAgaWYgKG9sZExpbmVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKG15Q291bnQub2xkTGluZXMgPT09IHRoZWlyQ291bnQub2xkTGluZXMpIHtcbiAgICAgICAgICBvbGRMaW5lcyArPSBteUNvdW50Lm9sZExpbmVzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9sZExpbmVzID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChuZXdMaW5lcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChteUNvdW50Lm5ld0xpbmVzID09PSB0aGVpckNvdW50Lm5ld0xpbmVzKSB7XG4gICAgICAgICAgbmV3TGluZXMgKz0gbXlDb3VudC5uZXdMaW5lcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdMaW5lcyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAobmV3TGluZXMgIT09IHVuZGVmaW5lZCAmJiAobGluZVswXSA9PT0gJysnIHx8IGxpbmVbMF0gPT09ICcgJykpIHtcbiAgICAgICAgbmV3TGluZXMrKztcbiAgICAgIH1cblxuICAgICAgaWYgKG9sZExpbmVzICE9PSB1bmRlZmluZWQgJiYgKGxpbmVbMF0gPT09ICctJyB8fCBsaW5lWzBdID09PSAnICcpKSB7XG4gICAgICAgIG9sZExpbmVzKys7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHtcbiAgICBvbGRMaW5lczogb2xkTGluZXMsXG4gICAgbmV3TGluZXM6IG5ld0xpbmVzXG4gIH07XG59XG5cbi8vIFNlZTogaHR0cDovL2NvZGUuZ29vZ2xlLmNvbS9wL2dvb2dsZS1kaWZmLW1hdGNoLXBhdGNoL3dpa2kvQVBJXG5mdW5jdGlvbiBjb252ZXJ0Q2hhbmdlc1RvRE1QKGNoYW5nZXMpIHtcbiAgdmFyIHJldCA9IFtdLFxuICAgICAgY2hhbmdlLFxuICAgICAgb3BlcmF0aW9uO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2hhbmdlcy5sZW5ndGg7IGkrKykge1xuICAgIGNoYW5nZSA9IGNoYW5nZXNbaV07XG5cbiAgICBpZiAoY2hhbmdlLmFkZGVkKSB7XG4gICAgICBvcGVyYXRpb24gPSAxO1xuICAgIH0gZWxzZSBpZiAoY2hhbmdlLnJlbW92ZWQpIHtcbiAgICAgIG9wZXJhdGlvbiA9IC0xO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcGVyYXRpb24gPSAwO1xuICAgIH1cblxuICAgIHJldC5wdXNoKFtvcGVyYXRpb24sIGNoYW5nZS52YWx1ZV0pO1xuICB9XG5cbiAgcmV0dXJuIHJldDtcbn1cblxuZnVuY3Rpb24gY29udmVydENoYW5nZXNUb1hNTChjaGFuZ2VzKSB7XG4gIHZhciByZXQgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYW5nZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgY2hhbmdlID0gY2hhbmdlc1tpXTtcblxuICAgIGlmIChjaGFuZ2UuYWRkZWQpIHtcbiAgICAgIHJldC5wdXNoKCc8aW5zPicpO1xuICAgIH0gZWxzZSBpZiAoY2hhbmdlLnJlbW92ZWQpIHtcbiAgICAgIHJldC5wdXNoKCc8ZGVsPicpO1xuICAgIH1cblxuICAgIHJldC5wdXNoKGVzY2FwZUhUTUwoY2hhbmdlLnZhbHVlKSk7XG5cbiAgICBpZiAoY2hhbmdlLmFkZGVkKSB7XG4gICAgICByZXQucHVzaCgnPC9pbnM+Jyk7XG4gICAgfSBlbHNlIGlmIChjaGFuZ2UucmVtb3ZlZCkge1xuICAgICAgcmV0LnB1c2goJzwvZGVsPicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXQuam9pbignJyk7XG59XG5cbmZ1bmN0aW9uIGVzY2FwZUhUTUwocykge1xuICB2YXIgbiA9IHM7XG4gIG4gPSBuLnJlcGxhY2UoLyYvZywgJyZhbXA7Jyk7XG4gIG4gPSBuLnJlcGxhY2UoLzwvZywgJyZsdDsnKTtcbiAgbiA9IG4ucmVwbGFjZSgvPi9nLCAnJmd0OycpO1xuICBuID0gbi5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7Jyk7XG4gIHJldHVybiBuO1xufVxuXG5leHBvcnQgeyBEaWZmLCBhcHBseVBhdGNoLCBhcHBseVBhdGNoZXMsIGNhbm9uaWNhbGl6ZSwgY29udmVydENoYW5nZXNUb0RNUCwgY29udmVydENoYW5nZXNUb1hNTCwgY3JlYXRlUGF0Y2gsIGNyZWF0ZVR3b0ZpbGVzUGF0Y2gsIGRpZmZBcnJheXMsIGRpZmZDaGFycywgZGlmZkNzcywgZGlmZkpzb24sIGRpZmZMaW5lcywgZGlmZlNlbnRlbmNlcywgZGlmZlRyaW1tZWRMaW5lcywgZGlmZldvcmRzLCBkaWZmV29yZHNXaXRoU3BhY2UsIG1lcmdlLCBwYXJzZVBhdGNoLCBzdHJ1Y3R1cmVkUGF0Y2ggfTtcbiIsImV4cG9ydCBpbnRlcmZhY2UgSUxpc3Qge1xuICBnZXRMZXZlbCgpOiBudW1iZXI7XG4gIGdldFBhcmVudCgpOiBJTGlzdCB8IG51bGw7XG4gIGFkZEFmdGVyQWxsKGxpc3Q6IElMaXN0KTogdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIExpc3QgaW1wbGVtZW50cyBJTGlzdCB7XG4gIHByaXZhdGUgaW5kZW50U2lnbjogc3RyaW5nO1xuICBwcml2YXRlIGJ1bGxldDogc3RyaW5nO1xuICBwcml2YXRlIGNvbnRlbnQ6IHN0cmluZztcbiAgcHJpdmF0ZSBmb2xkZWQ6IGJvb2xlYW47XG4gIHByaXZhdGUgY2hpbGRyZW46IExpc3RbXTtcbiAgcHJpdmF0ZSBwYXJlbnQ6IExpc3Q7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgaW5kZW50U2lnbjogc3RyaW5nLFxuICAgIGJ1bGxldDogc3RyaW5nLFxuICAgIGNvbnRlbnQ6IHN0cmluZyxcbiAgICBmb2xkZWQ6IGJvb2xlYW5cbiAgKSB7XG4gICAgdGhpcy5pbmRlbnRTaWduID0gaW5kZW50U2lnbjtcbiAgICB0aGlzLmJ1bGxldCA9IGJ1bGxldDtcbiAgICB0aGlzLmNvbnRlbnQgPSBjb250ZW50O1xuICAgIHRoaXMuZm9sZGVkID0gZm9sZGVkO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgICB0aGlzLnBhcmVudCA9IG51bGw7XG4gIH1cblxuICBpc0ZvbGRlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5mb2xkZWQ7XG4gIH1cblxuICBpc0ZvbGRSb290KCkge1xuICAgIGxldCBwYXJlbnQgPSB0aGlzLmdldFBhcmVudCgpO1xuICAgIHdoaWxlIChwYXJlbnQpIHtcbiAgICAgIGlmIChwYXJlbnQuaXNGb2xkZWQoKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBwYXJlbnQgPSBwYXJlbnQuZ2V0UGFyZW50KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaXNGb2xkZWQoKTtcbiAgfVxuXG4gIGdldENoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmNvbmNhdCgpO1xuICB9XG5cbiAgYXBwZW5kQ29udGVudChjb250ZW50OiBzdHJpbmcpIHtcbiAgICB0aGlzLmNvbnRlbnQgKz0gY29udGVudDtcbiAgfVxuXG4gIGdldENvbnRlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGVudDtcbiAgfVxuXG4gIGlzRW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ubGVuZ3RoID09PSAwO1xuICB9XG5cbiAgZ2V0Q29udGVudFN0YXJ0Q2goKSB7XG4gICAgY29uc3QgaW5kZW50TGVuZ3RoID0gKHRoaXMuZ2V0TGV2ZWwoKSAtIDEpICogdGhpcy5pbmRlbnRTaWduLmxlbmd0aDtcbiAgICByZXR1cm4gaW5kZW50TGVuZ3RoICsgMjtcbiAgfVxuXG4gIGdldENvbnRlbnRFbmRDaCgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRDb250ZW50U3RhcnRDaCgpICsgdGhpcy5jb250ZW50Lmxlbmd0aDtcbiAgfVxuXG4gIGdldFBhcmVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQ7XG4gIH1cblxuICBnZXRQcmV2U2libGluZ09mKGxpc3Q6IExpc3QpIHtcbiAgICBjb25zdCBpID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKGxpc3QpO1xuICAgIHJldHVybiBpID4gMCA/IHRoaXMuY2hpbGRyZW5baSAtIDFdIDogbnVsbDtcbiAgfVxuXG4gIGdldE5leHRTaWJsaW5nT2YobGlzdDogTGlzdCkge1xuICAgIGNvbnN0IGkgPSB0aGlzLmNoaWxkcmVuLmluZGV4T2YobGlzdCk7XG4gICAgcmV0dXJuIGkgPj0gMCAmJiBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGggPyB0aGlzLmNoaWxkcmVuW2kgKyAxXSA6IG51bGw7XG4gIH1cblxuICBnZXRMZXZlbCgpIHtcbiAgICBsZXQgbGV2ZWwgPSAwO1xuICAgIGxldCByZWY6IExpc3QgPSB0aGlzO1xuICAgIHdoaWxlIChyZWYucGFyZW50KSB7XG4gICAgICByZWYgPSByZWYucGFyZW50O1xuICAgICAgbGV2ZWwrKztcbiAgICB9XG4gICAgcmV0dXJuIGxldmVsO1xuICB9XG5cbiAgYWRkQWZ0ZXJBbGwobGlzdDogTGlzdCkge1xuICAgIHRoaXMuY2hpbGRyZW4ucHVzaChsaXN0KTtcbiAgICBsaXN0LnBhcmVudCA9IHRoaXM7XG4gIH1cblxuICBhZGRCZWZvcmVBbGwobGlzdDogTGlzdCkge1xuICAgIHRoaXMuY2hpbGRyZW4udW5zaGlmdChsaXN0KTtcbiAgICBsaXN0LnBhcmVudCA9IHRoaXM7XG4gIH1cblxuICBhZGRCZWZvcmUoYmVmb3JlOiBMaXN0LCBsaXN0OiBMaXN0KSB7XG4gICAgY29uc3QgaSA9IHRoaXMuY2hpbGRyZW4uaW5kZXhPZihiZWZvcmUpO1xuICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKGksIDAsIGxpc3QpO1xuICAgIGxpc3QucGFyZW50ID0gdGhpcztcbiAgfVxuXG4gIGFkZEFmdGVyKGJlZm9yZTogTGlzdCwgbGlzdDogTGlzdCkge1xuICAgIGNvbnN0IGkgPSB0aGlzLmNoaWxkcmVuLmluZGV4T2YoYmVmb3JlKTtcbiAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpICsgMSwgMCwgbGlzdCk7XG4gICAgbGlzdC5wYXJlbnQgPSB0aGlzO1xuICB9XG5cbiAgcmVtb3ZlQ2hpbGQobGlzdDogTGlzdCkge1xuICAgIGNvbnN0IGkgPSB0aGlzLmNoaWxkcmVuLmluZGV4T2YobGlzdCk7XG4gICAgdGhpcy5jaGlsZHJlbi5zcGxpY2UoaSwgMSk7XG4gICAgbGlzdC5wYXJlbnQgPSBudWxsO1xuICB9XG5cbiAgcHJpbnQoKSB7XG4gICAgbGV0IHJlcyA9IHRoaXMuZ2V0RnVsbENvbnRlbnQoKSArIFwiXFxuXCI7XG5cbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMuY2hpbGRyZW4pIHtcbiAgICAgIHJlcyArPSBjaGlsZC5wcmludCgpO1xuICAgIH1cblxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBwcml2YXRlIGdldEZ1bGxDb250ZW50KCkge1xuICAgIHJldHVybiAoXG4gICAgICBuZXcgQXJyYXkodGhpcy5nZXRMZXZlbCgpIC0gMSkuZmlsbCh0aGlzLmluZGVudFNpZ24pLmpvaW4oXCJcIikgK1xuICAgICAgdGhpcy5idWxsZXQgK1xuICAgICAgXCIgXCIgK1xuICAgICAgdGhpcy5jb250ZW50XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUm9vdCBpbXBsZW1lbnRzIElMaXN0IHtcbiAgcHJpdmF0ZSBpbmRlbnRTaWduOiBzdHJpbmc7XG4gIHByaXZhdGUgcm9vdExpc3Q6IExpc3Q7XG4gIHByaXZhdGUgc3RhcnQ6IENvZGVNaXJyb3IuUG9zaXRpb247XG4gIHByaXZhdGUgZW5kOiBDb2RlTWlycm9yLlBvc2l0aW9uO1xuICBwcml2YXRlIGN1cnNvcjogQ29kZU1pcnJvci5Qb3NpdGlvbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBpbmRlbnRTaWduOiBzdHJpbmcsXG4gICAgc3RhcnQ6IENvZGVNaXJyb3IuUG9zaXRpb24sXG4gICAgZW5kOiBDb2RlTWlycm9yLlBvc2l0aW9uLFxuICAgIGN1cnNvcjogQ29kZU1pcnJvci5Qb3NpdGlvblxuICApIHtcbiAgICB0aGlzLmluZGVudFNpZ24gPSBpbmRlbnRTaWduO1xuICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgICB0aGlzLmVuZCA9IGVuZDtcbiAgICB0aGlzLmN1cnNvciA9IGN1cnNvcjtcbiAgICB0aGlzLnJvb3RMaXN0ID0gbmV3IExpc3QoXCJcIiwgXCJcIiwgXCJcIiwgZmFsc2UpO1xuICB9XG5cbiAgcmVwbGFjZUN1cnNvcihjdXJzb3I6IENvZGVNaXJyb3IuUG9zaXRpb24pIHtcbiAgICB0aGlzLmN1cnNvciA9IGN1cnNvcjtcbiAgfVxuXG4gIGdldFRvdGFsTGluZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZW5kLmxpbmUgLSB0aGlzLnN0YXJ0LmxpbmUgKyAxO1xuICB9XG5cbiAgZ2V0Q2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMucm9vdExpc3QuZ2V0Q2hpbGRyZW4oKTtcbiAgfVxuXG4gIGdldEluZGVudFNpZ24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5kZW50U2lnbjtcbiAgfVxuXG4gIGdldExldmVsKCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZ2V0UGFyZW50KCk6IExpc3QgfCBudWxsIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGFkZEFmdGVyQWxsKGxpc3Q6IExpc3QpIHtcbiAgICB0aGlzLnJvb3RMaXN0LmFkZEFmdGVyQWxsKGxpc3QpO1xuICB9XG5cbiAgZ2V0TGlzdFN0YXJ0UG9zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQ7XG4gIH1cblxuICBnZXRMaXN0RW5kUG9zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZW5kO1xuICB9XG5cbiAgZ2V0Q3Vyc29yKCkge1xuICAgIHJldHVybiB0aGlzLmN1cnNvcjtcbiAgfVxuXG4gIGdldExpc3RVbmRlckN1cnNvcigpOiBMaXN0IHtcbiAgICByZXR1cm4gdGhpcy5nZXRMaXN0VW5kZXJMaW5lKHRoaXMuY3Vyc29yLmxpbmUpO1xuICB9XG5cbiAgcHJpbnQoKSB7XG4gICAgbGV0IHJlcyA9IFwiXCI7XG5cbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMucm9vdExpc3QuZ2V0Q2hpbGRyZW4oKSkge1xuICAgICAgcmVzICs9IGNoaWxkLnByaW50KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcy5yZXBsYWNlKC9cXG4kLywgXCJcIik7XG4gIH1cblxuICBnZXRMaW5lTnVtYmVyT2YobGlzdDogTGlzdCkge1xuICAgIGxldCByZXN1bHQ6IG51bWJlciA9IG51bGw7XG4gICAgbGV0IGxpbmU6IG51bWJlciA9IDA7XG4gICAgY29uc3QgdmlzaXRBcnIgPSAobGw6IExpc3RbXSkgPT4ge1xuICAgICAgZm9yIChjb25zdCBsIG9mIGxsKSB7XG4gICAgICAgIGlmIChsID09PSBsaXN0KSB7XG4gICAgICAgICAgcmVzdWx0ID0gbGluZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsaW5lKys7XG4gICAgICAgICAgdmlzaXRBcnIobC5nZXRDaGlsZHJlbigpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0ICE9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZpc2l0QXJyKHRoaXMucm9vdExpc3QuZ2V0Q2hpbGRyZW4oKSk7XG5cbiAgICByZXR1cm4gcmVzdWx0ICsgdGhpcy5zdGFydC5saW5lO1xuICB9XG5cbiAgZ2V0TGlzdFVuZGVyTGluZShsaW5lOiBudW1iZXIpIHtcbiAgICBpZiAobGluZSA8IHRoaXMuc3RhcnQubGluZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCByZXN1bHQ6IExpc3QgPSBudWxsO1xuICAgIGxldCBpbmRleDogbnVtYmVyID0gMDtcbiAgICBjb25zdCB2aXNpdEFyciA9IChsbDogTGlzdFtdKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGwgb2YgbGwpIHtcbiAgICAgICAgaWYgKGluZGV4ICsgdGhpcy5zdGFydC5saW5lID09PSBsaW5lKSB7XG4gICAgICAgICAgcmVzdWx0ID0gbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgIHZpc2l0QXJyKGwuZ2V0Q2hpbGRyZW4oKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdCAhPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICB2aXNpdEFycih0aGlzLnJvb3RMaXN0LmdldENoaWxkcmVuKCkpO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIG1vdmVVcCgpIHtcbiAgICBjb25zdCBsaXN0ID0gdGhpcy5nZXRMaXN0VW5kZXJDdXJzb3IoKTtcbiAgICBjb25zdCBwYXJlbnQgPSBsaXN0LmdldFBhcmVudCgpO1xuICAgIGNvbnN0IGdyYW5kUGFyZW50ID0gcGFyZW50LmdldFBhcmVudCgpO1xuICAgIGNvbnN0IHByZXYgPSBwYXJlbnQuZ2V0UHJldlNpYmxpbmdPZihsaXN0KTtcblxuICAgIGlmICghcHJldiAmJiBncmFuZFBhcmVudCkge1xuICAgICAgY29uc3QgbmV3UGFyZW50ID0gZ3JhbmRQYXJlbnQuZ2V0UHJldlNpYmxpbmdPZihwYXJlbnQpO1xuXG4gICAgICBpZiAobmV3UGFyZW50KSB7XG4gICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChsaXN0KTtcbiAgICAgICAgbmV3UGFyZW50LmFkZEFmdGVyQWxsKGxpc3QpO1xuICAgICAgICB0aGlzLmN1cnNvci5saW5lID0gdGhpcy5nZXRMaW5lTnVtYmVyT2YobGlzdCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChwcmV2KSB7XG4gICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQobGlzdCk7XG4gICAgICBwYXJlbnQuYWRkQmVmb3JlKHByZXYsIGxpc3QpO1xuICAgICAgdGhpcy5jdXJzb3IubGluZSA9IHRoaXMuZ2V0TGluZU51bWJlck9mKGxpc3QpO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgbW92ZURvd24oKSB7XG4gICAgY29uc3QgbGlzdCA9IHRoaXMuZ2V0TGlzdFVuZGVyQ3Vyc29yKCk7XG4gICAgY29uc3QgcGFyZW50ID0gbGlzdC5nZXRQYXJlbnQoKTtcbiAgICBjb25zdCBncmFuZFBhcmVudCA9IHBhcmVudC5nZXRQYXJlbnQoKTtcbiAgICBjb25zdCBuZXh0ID0gcGFyZW50LmdldE5leHRTaWJsaW5nT2YobGlzdCk7XG5cbiAgICBpZiAoIW5leHQgJiYgZ3JhbmRQYXJlbnQpIHtcbiAgICAgIGNvbnN0IG5ld1BhcmVudCA9IGdyYW5kUGFyZW50LmdldE5leHRTaWJsaW5nT2YocGFyZW50KTtcblxuICAgICAgaWYgKG5ld1BhcmVudCkge1xuICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQobGlzdCk7XG4gICAgICAgIG5ld1BhcmVudC5hZGRCZWZvcmVBbGwobGlzdCk7XG4gICAgICAgIHRoaXMuY3Vyc29yLmxpbmUgPSB0aGlzLmdldExpbmVOdW1iZXJPZihsaXN0KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG5leHQpIHtcbiAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChsaXN0KTtcbiAgICAgIHBhcmVudC5hZGRBZnRlcihuZXh0LCBsaXN0KTtcbiAgICAgIHRoaXMuY3Vyc29yLmxpbmUgPSB0aGlzLmdldExpbmVOdW1iZXJPZihsaXN0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIG1vdmVMZWZ0KCkge1xuICAgIGNvbnN0IGxpc3QgPSB0aGlzLmdldExpc3RVbmRlckN1cnNvcigpO1xuICAgIGNvbnN0IHBhcmVudCA9IGxpc3QuZ2V0UGFyZW50KCk7XG4gICAgY29uc3QgZ3JhbmRQYXJlbnQgPSBwYXJlbnQuZ2V0UGFyZW50KCk7XG5cbiAgICBpZiAoIWdyYW5kUGFyZW50KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwYXJlbnQucmVtb3ZlQ2hpbGQobGlzdCk7XG4gICAgZ3JhbmRQYXJlbnQuYWRkQWZ0ZXIocGFyZW50LCBsaXN0KTtcbiAgICB0aGlzLmN1cnNvci5saW5lID0gdGhpcy5nZXRMaW5lTnVtYmVyT2YobGlzdCk7XG4gICAgdGhpcy5jdXJzb3IuY2gtLTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgbW92ZVJpZ2h0KCkge1xuICAgIGNvbnN0IGxpc3QgPSB0aGlzLmdldExpc3RVbmRlckN1cnNvcigpO1xuICAgIGNvbnN0IHBhcmVudCA9IGxpc3QuZ2V0UGFyZW50KCk7XG4gICAgY29uc3QgcHJldiA9IHBhcmVudC5nZXRQcmV2U2libGluZ09mKGxpc3QpO1xuXG4gICAgaWYgKCFwcmV2KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwYXJlbnQucmVtb3ZlQ2hpbGQobGlzdCk7XG4gICAgcHJldi5hZGRBZnRlckFsbChsaXN0KTtcbiAgICB0aGlzLmN1cnNvci5saW5lID0gdGhpcy5nZXRMaW5lTnVtYmVyT2YobGlzdCk7XG4gICAgdGhpcy5jdXJzb3IuY2grKztcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZGVsZXRlQW5kTWVyZ2VXaXRoUHJldmlvdXMoKSB7XG4gICAgY29uc3QgbGlzdCA9IHRoaXMuZ2V0TGlzdFVuZGVyQ3Vyc29yKCk7XG5cbiAgICBpZiAodGhpcy5jdXJzb3IuY2ggIT09IGxpc3QuZ2V0Q29udGVudFN0YXJ0Q2goKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHByZXYgPSB0aGlzLmdldExpc3RVbmRlckxpbmUodGhpcy5jdXJzb3IubGluZSAtIDEpO1xuXG4gICAgaWYgKCFwcmV2KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBib3RoQXJlRW1wdHkgPSBwcmV2LmlzRW1wdHkoKSAmJiBsaXN0LmlzRW1wdHkoKTtcbiAgICBjb25zdCBwcmV2SXNFbXB0eUFuZFNhbWVMZXZlbCA9XG4gICAgICBwcmV2LmlzRW1wdHkoKSAmJiAhbGlzdC5pc0VtcHR5KCkgJiYgcHJldi5nZXRMZXZlbCgpID09IGxpc3QuZ2V0TGV2ZWwoKTtcbiAgICBjb25zdCBsaXN0SXNFbXB0eUFuZFByZXZJc1BhcmVudCA9XG4gICAgICBsaXN0LmlzRW1wdHkoKSAmJiBwcmV2LmdldExldmVsKCkgPT0gbGlzdC5nZXRMZXZlbCgpIC0gMTtcblxuICAgIGlmIChib3RoQXJlRW1wdHkgfHwgcHJldklzRW1wdHlBbmRTYW1lTGV2ZWwgfHwgbGlzdElzRW1wdHlBbmRQcmV2SXNQYXJlbnQpIHtcbiAgICAgIGNvbnN0IHBhcmVudCA9IGxpc3QuZ2V0UGFyZW50KCk7XG4gICAgICBjb25zdCBwcmV2RW5kQ2ggPSBwcmV2LmdldENvbnRlbnRFbmRDaCgpO1xuXG4gICAgICBwcmV2LmFwcGVuZENvbnRlbnQobGlzdC5nZXRDb250ZW50KCkpO1xuICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKGxpc3QpO1xuICAgICAgZm9yIChjb25zdCBjIG9mIGxpc3QuZ2V0Q2hpbGRyZW4oKSkge1xuICAgICAgICBsaXN0LnJlbW92ZUNoaWxkKGMpO1xuICAgICAgICBwcmV2LmFkZEFmdGVyQWxsKGMpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmN1cnNvci5saW5lID0gdGhpcy5nZXRMaW5lTnVtYmVyT2YocHJldik7XG4gICAgICB0aGlzLmN1cnNvci5jaCA9IHByZXZFbmRDaDtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgZGlmZkxpbmVzIH0gZnJvbSBcImRpZmZcIjtcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gXCIuL2xvZ2dlclwiO1xuaW1wb3J0IHsgT2JzaWRpYW5VdGlscyB9IGZyb20gXCIuL29ic2lkaWFuX3V0aWxzXCI7XG5pbXBvcnQgeyBJTGlzdCwgTGlzdCwgUm9vdCB9IGZyb20gXCIuL3Jvb3RcIjtcblxuZXhwb3J0IGNsYXNzIExpc3RVdGlscyB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbG9nZ2VyOiBMb2dnZXIsIHByaXZhdGUgb2JzaWRpYW5VdGlsczogT2JzaWRpYW5VdGlscykge31cblxuICBnZXRMaXN0TGluZUluZm8obGluZTogc3RyaW5nLCBpbmRlbnRTaWduOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwcmVmaXhSZSA9IG5ldyBSZWdFeHAoYF4oPzoke2luZGVudFNpZ259KSooWy0qXSkgYCk7XG4gICAgY29uc3QgbWF0Y2hlcyA9IHByZWZpeFJlLmV4ZWMobGluZSk7XG5cbiAgICBpZiAoIW1hdGNoZXMpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHByZWZpeExlbmd0aCA9IG1hdGNoZXNbMF0ubGVuZ3RoO1xuICAgIGNvbnN0IGJ1bGxldCA9IG1hdGNoZXNbMV07XG4gICAgY29uc3QgY29udGVudCA9IGxpbmUuc2xpY2UocHJlZml4TGVuZ3RoKTtcbiAgICBjb25zdCBpbmRlbnRMZXZlbCA9IChwcmVmaXhMZW5ndGggLSAyKSAvIGluZGVudFNpZ24ubGVuZ3RoO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGJ1bGxldCxcbiAgICAgIGNvbnRlbnQsXG4gICAgICBwcmVmaXhMZW5ndGgsXG4gICAgICBpbmRlbnRMZXZlbCxcbiAgICB9O1xuICB9XG5cbiAgcGFyc2VMaXN0KGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IsIGN1cnNvciA9IGVkaXRvci5nZXRDdXJzb3IoKSk6IFJvb3Qge1xuICAgIGNvbnN0IGN1cnNvckxpbmUgPSBjdXJzb3IubGluZTtcbiAgICBjb25zdCBjdXJzb3JDaCA9IGN1cnNvci5jaDtcbiAgICBjb25zdCBsaW5lID0gZWRpdG9yLmdldExpbmUoY3Vyc29yTGluZSk7XG5cbiAgICBjb25zdCBpbmRlbnRTaWduID0gdGhpcy5kZXRlY3RMaXN0SW5kZW50U2lnbihlZGl0b3IsIGN1cnNvcik7XG5cbiAgICBpZiAoaW5kZW50U2lnbiA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IGxpc3RTdGFydExpbmUgPSBjdXJzb3JMaW5lO1xuICAgIGNvbnN0IGxpc3RTdGFydENoID0gMDtcbiAgICB3aGlsZSAobGlzdFN0YXJ0TGluZSA+PSAxKSB7XG4gICAgICBjb25zdCBsaW5lID0gZWRpdG9yLmdldExpbmUobGlzdFN0YXJ0TGluZSAtIDEpO1xuICAgICAgaWYgKCF0aGlzLmdldExpc3RMaW5lSW5mbyhsaW5lLCBpbmRlbnRTaWduKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGxpc3RTdGFydExpbmUtLTtcbiAgICB9XG5cbiAgICBsZXQgbGlzdEVuZExpbmUgPSBjdXJzb3JMaW5lO1xuICAgIGxldCBsaXN0RW5kQ2ggPSBsaW5lLmxlbmd0aDtcbiAgICB3aGlsZSAobGlzdEVuZExpbmUgPCBlZGl0b3IubGluZUNvdW50KCkpIHtcbiAgICAgIGNvbnN0IGxpbmUgPSBlZGl0b3IuZ2V0TGluZShsaXN0RW5kTGluZSArIDEpO1xuICAgICAgaWYgKCF0aGlzLmdldExpc3RMaW5lSW5mbyhsaW5lLCBpbmRlbnRTaWduKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGxpc3RFbmRDaCA9IGxpbmUubGVuZ3RoO1xuICAgICAgbGlzdEVuZExpbmUrKztcbiAgICB9XG5cbiAgICBjb25zdCByb290ID0gbmV3IFJvb3QoXG4gICAgICBpbmRlbnRTaWduLFxuICAgICAgeyBsaW5lOiBsaXN0U3RhcnRMaW5lLCBjaDogbGlzdFN0YXJ0Q2ggfSxcbiAgICAgIHsgbGluZTogbGlzdEVuZExpbmUsIGNoOiBsaXN0RW5kQ2ggfSxcbiAgICAgIHsgbGluZTogY3Vyc29yTGluZSwgY2g6IGN1cnNvckNoIH1cbiAgICApO1xuXG4gICAgbGV0IGN1cnJlbnRMZXZlbDogSUxpc3QgPSByb290O1xuICAgIGxldCBsYXN0TGlzdDogSUxpc3QgPSByb290O1xuXG4gICAgZm9yIChsZXQgbCA9IGxpc3RTdGFydExpbmU7IGwgPD0gbGlzdEVuZExpbmU7IGwrKykge1xuICAgICAgY29uc3QgbGluZSA9IGVkaXRvci5nZXRMaW5lKGwpO1xuICAgICAgY29uc3QgeyBidWxsZXQsIGNvbnRlbnQsIGluZGVudExldmVsIH0gPSB0aGlzLmdldExpc3RMaW5lSW5mbyhcbiAgICAgICAgbGluZSxcbiAgICAgICAgaW5kZW50U2lnblxuICAgICAgKTtcbiAgICAgIGNvbnN0IGZvbGRlZCA9IChlZGl0b3IgYXMgYW55KS5pc0ZvbGRlZCh7XG4gICAgICAgIGxpbmU6IGwsXG4gICAgICAgIGNoOiAwLFxuICAgICAgfSk7XG5cbiAgICAgIGlmIChpbmRlbnRMZXZlbCA9PT0gY3VycmVudExldmVsLmdldExldmVsKCkgKyAxKSB7XG4gICAgICAgIGN1cnJlbnRMZXZlbCA9IGxhc3RMaXN0O1xuICAgICAgfSBlbHNlIGlmIChpbmRlbnRMZXZlbCA8IGN1cnJlbnRMZXZlbC5nZXRMZXZlbCgpKSB7XG4gICAgICAgIHdoaWxlIChpbmRlbnRMZXZlbCA8IGN1cnJlbnRMZXZlbC5nZXRMZXZlbCgpKSB7XG4gICAgICAgICAgY3VycmVudExldmVsID0gY3VycmVudExldmVsLmdldFBhcmVudCgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGluZGVudExldmVsICE9IGN1cnJlbnRMZXZlbC5nZXRMZXZlbCgpKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYFVuYWJsZSB0byBwYXJzZSBsaXN0YCk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBsaXN0ID0gbmV3IExpc3QoaW5kZW50U2lnbiwgYnVsbGV0LCBjb250ZW50LCBmb2xkZWQpO1xuICAgICAgY3VycmVudExldmVsLmFkZEFmdGVyQWxsKGxpc3QpO1xuICAgICAgbGFzdExpc3QgPSBsaXN0O1xuICAgIH1cblxuICAgIHJldHVybiByb290O1xuICB9XG5cbiAgYXBwbHlDaGFuZ2VzKGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IsIHJvb3Q6IFJvb3QpIHtcbiAgICBjb25zdCBvbGRTdHJpbmcgPSBlZGl0b3IuZ2V0UmFuZ2UoXG4gICAgICByb290LmdldExpc3RTdGFydFBvc2l0aW9uKCksXG4gICAgICByb290LmdldExpc3RFbmRQb3NpdGlvbigpXG4gICAgKTtcbiAgICBjb25zdCBuZXdTdHJpbmcgPSByb290LnByaW50KCk7XG5cbiAgICBjb25zdCBmcm9tTGluZSA9IHJvb3QuZ2V0TGlzdFN0YXJ0UG9zaXRpb24oKS5saW5lO1xuICAgIGNvbnN0IHRvTGluZSA9IHJvb3QuZ2V0TGlzdEVuZFBvc2l0aW9uKCkubGluZTtcblxuICAgIGZvciAobGV0IGwgPSBmcm9tTGluZTsgbCA8PSB0b0xpbmU7IGwrKykge1xuICAgICAgKGVkaXRvciBhcyBhbnkpLmZvbGRDb2RlKGwsIG51bGwsIFwidW5mb2xkXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IGRpZmYgPSBkaWZmTGluZXMob2xkU3RyaW5nLCBuZXdTdHJpbmcpO1xuICAgIGxldCBsID0gcm9vdC5nZXRMaXN0U3RhcnRQb3NpdGlvbigpLmxpbmU7XG4gICAgZm9yIChjb25zdCBjaGFuZ2Ugb2YgZGlmZikge1xuICAgICAgaWYgKGNoYW5nZS5hZGRlZCkge1xuICAgICAgICBlZGl0b3IucmVwbGFjZVJhbmdlKGNoYW5nZS52YWx1ZSwgeyBsaW5lOiBsLCBjaDogMCB9KTtcbiAgICAgICAgbCArPSBjaGFuZ2UuY291bnQ7XG4gICAgICB9IGVsc2UgaWYgKGNoYW5nZS5yZW1vdmVkKSB7XG4gICAgICAgIGNvbnN0IHdpdGhOZXdsaW5lID0gL1xcbiQvLnRlc3QoY2hhbmdlLnZhbHVlKTtcbiAgICAgICAgY29uc3QgdGlsbExpbmUgPSB3aXRoTmV3bGluZSA/IGwgKyBjaGFuZ2UuY291bnQgOiBsICsgY2hhbmdlLmNvdW50IC0gMTtcbiAgICAgICAgY29uc3QgdGlsbENoID0gd2l0aE5ld2xpbmUgPyAwIDogZWRpdG9yLmdldExpbmUodGlsbExpbmUpLmxlbmd0aDtcbiAgICAgICAgZWRpdG9yLnJlcGxhY2VSYW5nZShcbiAgICAgICAgICBcIlwiLFxuICAgICAgICAgIHsgbGluZTogbCwgY2g6IDAgfSxcbiAgICAgICAgICB7IGxpbmU6IHRpbGxMaW5lLCBjaDogdGlsbENoIH1cbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGwgKz0gY2hhbmdlLmNvdW50O1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IG9sZEN1cnNvciA9IGVkaXRvci5nZXRDdXJzb3IoKTtcbiAgICBjb25zdCBuZXdDdXJzb3IgPSByb290LmdldEN1cnNvcigpO1xuXG4gICAgaWYgKG9sZEN1cnNvci5saW5lICE9IG5ld0N1cnNvci5saW5lIHx8IG9sZEN1cnNvci5jaCAhPSBuZXdDdXJzb3IuY2gpIHtcbiAgICAgIGVkaXRvci5zZXRDdXJzb3IobmV3Q3Vyc29yKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBsID0gZnJvbUxpbmU7IGwgPD0gdG9MaW5lOyBsKyspIHtcbiAgICAgIGNvbnN0IGxpbmUgPSByb290LmdldExpc3RVbmRlckxpbmUobCk7XG4gICAgICBpZiAobGluZSAmJiBsaW5lLmlzRm9sZFJvb3QoKSkge1xuICAgICAgICAvLyBUT0RPOiB3aHkgd29ya2luZyBvbmx5IHdpdGggLTE/XG4gICAgICAgIChlZGl0b3IgYXMgYW55KS5mb2xkQ29kZShsIC0gMSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGV0ZWN0TGlzdEluZGVudFNpZ24oZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvciwgY3Vyc29yOiBDb2RlTWlycm9yLlBvc2l0aW9uKSB7XG4gICAgY29uc3QgZCA9IHRoaXMubG9nZ2VyLmJpbmQoXCJPYnNpZGlhbk91dGxpbmVyUGx1Z2luOjpkZXRlY3RMaXN0SW5kZW50U2lnblwiKTtcblxuICAgIGNvbnN0IHsgdXNlVGFiLCB0YWJTaXplIH0gPSB0aGlzLm9ic2lkaWFuVXRpbHMuZ2V0T2JzaWRpYW5UYWJzU2V0dGlnbnMoKTtcbiAgICBjb25zdCBkZWZhdWx0SW5kZW50U2lnbiA9IHVzZVRhYlxuICAgICAgPyBcIlxcdFwiXG4gICAgICA6IG5ldyBBcnJheSh0YWJTaXplKS5maWxsKFwiIFwiKS5qb2luKFwiXCIpO1xuXG4gICAgY29uc3QgbGluZSA9IGVkaXRvci5nZXRMaW5lKGN1cnNvci5saW5lKTtcblxuICAgIGNvbnN0IHdpdGhUYWJzUmUgPSAvXlxcdCtbLSpdIC87XG4gICAgY29uc3Qgd2l0aFNwYWNlc1JlID0gL15bIF0rWy0qXSAvO1xuICAgIGNvbnN0IG1heUJlV2l0aFNwYWNlc1JlID0gL15bIF0qWy0qXSAvO1xuXG4gICAgaWYgKHdpdGhUYWJzUmUudGVzdChsaW5lKSkge1xuICAgICAgZChcImRldGVjdGVkIHRhYiBvbiBjdXJyZW50IGxpbmVcIik7XG4gICAgICByZXR1cm4gXCJcXHRcIjtcbiAgICB9XG5cbiAgICBpZiAod2l0aFNwYWNlc1JlLnRlc3QobGluZSkpIHtcbiAgICAgIGQoXCJkZXRlY3RlZCB3aGl0ZXNwYWNlcyBvbiBjdXJyZW50IGxpbmUsIHRyeWluZyB0byBjb3VudFwiKTtcbiAgICAgIGNvbnN0IHNwYWNlc0EgPSBsaW5lLmxlbmd0aCAtIGxpbmUudHJpbUxlZnQoKS5sZW5ndGg7XG5cbiAgICAgIGxldCBsaW5lTm8gPSBjdXJzb3IubGluZSAtIDE7XG4gICAgICB3aGlsZSAobGluZU5vID49IGVkaXRvci5maXJzdExpbmUoKSkge1xuICAgICAgICBjb25zdCBsaW5lID0gZWRpdG9yLmdldExpbmUobGluZU5vKTtcbiAgICAgICAgaWYgKCFtYXlCZVdpdGhTcGFjZXNSZS50ZXN0KGxpbmUpKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc3BhY2VzQiA9IGxpbmUubGVuZ3RoIC0gbGluZS50cmltTGVmdCgpLmxlbmd0aDtcbiAgICAgICAgaWYgKHNwYWNlc0IgPCBzcGFjZXNBKSB7XG4gICAgICAgICAgY29uc3QgbCA9IHNwYWNlc0EgLSBzcGFjZXNCO1xuICAgICAgICAgIGQoYGRldGVjdGVkICR7bH0gd2hpdGVzcGFjZXNgKTtcbiAgICAgICAgICByZXR1cm4gbmV3IEFycmF5KGwpLmZpbGwoXCIgXCIpLmpvaW4oXCJcIik7XG4gICAgICAgIH1cblxuICAgICAgICBsaW5lTm8tLTtcbiAgICAgIH1cblxuICAgICAgZChcInVuYWJsZSB0byBkZXRlY3RcIik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAobWF5QmVXaXRoU3BhY2VzUmUudGVzdChsaW5lKSkge1xuICAgICAgZChcImRldGVjdGVkIG5vdGhpbmcgb24gY3VycmVudCBsaW5lLCBsb29raW5nIGZvcndhcmRcIik7XG4gICAgICBjb25zdCBzcGFjZXNBID0gbGluZS5sZW5ndGggLSBsaW5lLnRyaW1MZWZ0KCkubGVuZ3RoO1xuXG4gICAgICBsZXQgbGluZU5vID0gY3Vyc29yLmxpbmUgKyAxO1xuICAgICAgd2hpbGUgKGxpbmVObyA8PSBlZGl0b3IubGFzdExpbmUoKSkge1xuICAgICAgICBjb25zdCBsaW5lID0gZWRpdG9yLmdldExpbmUobGluZU5vKTtcbiAgICAgICAgaWYgKHdpdGhUYWJzUmUudGVzdChsaW5lKSkge1xuICAgICAgICAgIGQoXCJkZXRlY3RlZCB0YWJcIik7XG4gICAgICAgICAgcmV0dXJuIFwiXFx0XCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFtYXlCZVdpdGhTcGFjZXNSZS50ZXN0KGxpbmUpKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc3BhY2VzQiA9IGxpbmUubGVuZ3RoIC0gbGluZS50cmltTGVmdCgpLmxlbmd0aDtcbiAgICAgICAgaWYgKHNwYWNlc0IgPiBzcGFjZXNBKSB7XG4gICAgICAgICAgY29uc3QgbCA9IHNwYWNlc0IgLSBzcGFjZXNBO1xuICAgICAgICAgIGQoYGRldGVjdGVkICR7bH0gd2hpdGVzcGFjZXNgKTtcbiAgICAgICAgICByZXR1cm4gbmV3IEFycmF5KGwpLmZpbGwoXCIgXCIpLmpvaW4oXCJcIik7XG4gICAgICAgIH1cblxuICAgICAgICBsaW5lTm8rKztcbiAgICAgIH1cblxuICAgICAgZChgZGV0ZWN0ZWQgbm90aGluZywgdXNpbmcgZGVmYXVsdCB1c2VUYWI9JHt1c2VUYWJ9IHRhYlNpemU9JHt0YWJTaXplfWApO1xuICAgICAgcmV0dXJuIGRlZmF1bHRJbmRlbnRTaWduO1xuICAgIH1cblxuICAgIGQoXCJ1bmFibGUgdG8gZGV0ZWN0XCIpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaXNDdXJzb3JJbkxpc3QoZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcikge1xuICAgIHJldHVybiB0aGlzLmRldGVjdExpc3RJbmRlbnRTaWduKGVkaXRvciwgZWRpdG9yLmdldEN1cnNvcigpKSAhPT0gbnVsbDtcbiAgfVxufVxuIiwiaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tIFwiLi9zZXR0aW5nc1wiO1xuXG5leHBvcnQgY2xhc3MgTG9nZ2VyIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzZXR0aW5nczogU2V0dGluZ3MpIHt9XG5cbiAgbG9nKG1ldGhvZDogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSkge1xuICAgIGlmICghdGhpcy5zZXR0aW5ncy5kZWJ1Zykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnNvbGUuaW5mbyhtZXRob2QsIC4uLmFyZ3MpO1xuICB9XG5cbiAgYmluZChtZXRob2Q6IHN0cmluZykge1xuICAgIHJldHVybiAoLi4uYXJnczogYW55W10pID0+IHRoaXMubG9nKG1ldGhvZCwgLi4uYXJncyk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFNldHRpbmdzIH0gZnJvbSBcIi4uL3NldHRpbmdzXCI7XG5pbXBvcnQgeyBQbHVnaW5fMiB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgSUZlYXR1cmUgfSBmcm9tIFwiLi4vZmVhdHVyZVwiO1xuaW1wb3J0IHsgT2JzaWRpYW5VdGlscyB9IGZyb20gXCIuLi9vYnNpZGlhbl91dGlsc1wiO1xuXG5jb25zdCB0ZXh0ID0gKHNpemU6IG51bWJlcikgPT5cbiAgYE91dGxpbmVyIHN0eWxlcyBkb2Vzbid0IHdvcmsgd2l0aCAke3NpemV9LXNwYWNlcy10YWJzLiBQbGVhc2UgY2hlY2sgeW91ciBPYnNpZGlhbiBzZXR0aW5ncy5gO1xuXG5leHBvcnQgY2xhc3MgTGlzdHNTdHlsZXNGZWF0dXJlIGltcGxlbWVudHMgSUZlYXR1cmUge1xuICBwcml2YXRlIHN0YXR1c0JhclRleHQ6IEhUTUxFbGVtZW50O1xuICBwcml2YXRlIGludGVydmFsOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwbHVnaW46IFBsdWdpbl8yLFxuICAgIHByaXZhdGUgc2V0dGluZ3M6IFNldHRpbmdzLFxuICAgIHByaXZhdGUgb2JzaWRpYW5VdGlsczogT2JzaWRpYW5VdGlsc1xuICApIHt9XG5cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5zdHlsZUxpc3RzKSB7XG4gICAgICB0aGlzLmFkZExpc3RzU3R5bGVzKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnNldHRpbmdzLnpvb21PbkNsaWNrKSB7XG4gICAgICB0aGlzLmFkZFpvb21TdHlsZXMoKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldHRpbmdzLm9uQ2hhbmdlKFwic3R5bGVMaXN0c1wiLCB0aGlzLm9uU3R5bGVMaXN0c1NldHRpbmdDaGFuZ2UpO1xuICAgIHRoaXMuc2V0dGluZ3Mub25DaGFuZ2UoXCJ6b29tT25DbGlja1wiLCB0aGlzLm9uWm9vbU9uQ2xpY2tTZXR0aW5nQ2hhbmdlKTtcblxuICAgIHRoaXMuYWRkU3RhdHVzQmFyVGV4dCgpO1xuICAgIHRoaXMuc3RhcnRTdGF0dXNCYXJJbnRlcnZhbCgpO1xuICB9XG5cbiAgYXN5bmMgdW5sb2FkKCkge1xuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgdGhpcy5zdGF0dXNCYXJUZXh0LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5zdGF0dXNCYXJUZXh0KTtcbiAgICB0aGlzLnNldHRpbmdzLnJlbW92ZUNhbGxiYWNrKFxuICAgICAgXCJ6b29tT25DbGlja1wiLFxuICAgICAgdGhpcy5vblpvb21PbkNsaWNrU2V0dGluZ0NoYW5nZVxuICAgICk7XG4gICAgdGhpcy5zZXR0aW5ncy5yZW1vdmVDYWxsYmFjayhcInN0eWxlTGlzdHNcIiwgdGhpcy5vblN0eWxlTGlzdHNTZXR0aW5nQ2hhbmdlKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RzU3R5bGVzKCk7XG4gIH1cblxuICBwcml2YXRlIHN0YXJ0U3RhdHVzQmFySW50ZXJ2YWwoKSB7XG4gICAgbGV0IHZpc2libGU6IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gICAgdGhpcy5pbnRlcnZhbCA9IHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICBjb25zdCB7IHVzZVRhYiwgdGFiU2l6ZSB9ID0gdGhpcy5vYnNpZGlhblV0aWxzLmdldE9ic2lkaWFuVGFic1NldHRpZ25zKCk7XG5cbiAgICAgIGNvbnN0IHNob3VsZEJlVmlzaWJsZSA9XG4gICAgICAgIHRoaXMuc2V0dGluZ3Muc3R5bGVMaXN0cyAmJiB1c2VUYWIgJiYgdGFiU2l6ZSAhPT0gNDtcblxuICAgICAgaWYgKHNob3VsZEJlVmlzaWJsZSAmJiB2aXNpYmxlICE9PSB0YWJTaXplKSB7XG4gICAgICAgIHRoaXMuc3RhdHVzQmFyVGV4dC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICB0aGlzLnN0YXR1c0JhclRleHQuc2V0VGV4dCh0ZXh0KHRhYlNpemUpKTtcbiAgICAgICAgdmlzaWJsZSA9IHRhYlNpemU7XG4gICAgICB9IGVsc2UgaWYgKCFzaG91bGRCZVZpc2libGUgJiYgdmlzaWJsZSAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLnN0YXR1c0JhclRleHQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB2aXNpYmxlID0gbnVsbDtcbiAgICAgIH1cbiAgICB9LCAxMDAwKTtcbiAgfVxuXG4gIHByaXZhdGUgb25TdHlsZUxpc3RzU2V0dGluZ0NoYW5nZSA9IChzdHlsZUxpc3RzOiBib29sZWFuKSA9PiB7XG4gICAgaWYgKHN0eWxlTGlzdHMpIHtcbiAgICAgIHRoaXMuYWRkTGlzdHNTdHlsZXMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW1vdmVMaXN0c1N0eWxlcygpO1xuICAgIH1cbiAgfTtcblxuICBwcml2YXRlIG9uWm9vbU9uQ2xpY2tTZXR0aW5nQ2hhbmdlID0gKHpvb21PbkNsaWNrOiBib29sZWFuKSA9PiB7XG4gICAgaWYgKHpvb21PbkNsaWNrKSB7XG4gICAgICB0aGlzLmFkZFpvb21TdHlsZXMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW1vdmVab29tU3R5bGVzKCk7XG4gICAgfVxuICB9O1xuXG4gIHByaXZhdGUgYWRkU3RhdHVzQmFyVGV4dCgpIHtcbiAgICB0aGlzLnN0YXR1c0JhclRleHQgPSB0aGlzLnBsdWdpbi5hZGRTdGF0dXNCYXJJdGVtKCk7XG4gICAgdGhpcy5zdGF0dXNCYXJUZXh0LnN0eWxlLmNvbG9yID0gXCJyZWRcIjtcbiAgICB0aGlzLnN0YXR1c0JhclRleHQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRMaXN0c1N0eWxlcygpIHtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoXCJvdXRsaW5lci1wbHVnaW4tYmxzXCIpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVMaXN0c1N0eWxlcygpIHtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoXCJvdXRsaW5lci1wbHVnaW4tYmxzXCIpO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRab29tU3R5bGVzKCkge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChcIm91dGxpbmVyLXBsdWdpbi1ibHMtem9vbVwiKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlWm9vbVN0eWxlcygpIHtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoXCJvdXRsaW5lci1wbHVnaW4tYmxzLXpvb21cIik7XG4gIH1cbn1cbiIsImltcG9ydCB7IFBsdWdpbl8yIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBFZGl0b3JVdGlscyB9IGZyb20gXCIuLi9lZGl0b3JfdXRpbHNcIjtcbmltcG9ydCB7IElGZWF0dXJlIH0gZnJvbSBcIi4uL2ZlYXR1cmVcIjtcbmltcG9ydCB7IExpc3RVdGlscyB9IGZyb20gXCIuLi9saXN0X3V0aWxzXCI7XG5pbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gXCIuLi9zZXR0aW5nc1wiO1xuXG5mdW5jdGlvbiBpc0VudGVyKGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgcmV0dXJuIChcbiAgICBlLmNvZGUgPT09IFwiRW50ZXJcIiAmJlxuICAgIGUuc2hpZnRLZXkgPT09IGZhbHNlICYmXG4gICAgZS5tZXRhS2V5ID09PSBmYWxzZSAmJlxuICAgIGUuYWx0S2V5ID09PSBmYWxzZSAmJlxuICAgIGUuY3RybEtleSA9PT0gZmFsc2VcbiAgKTtcbn1cblxuZXhwb3J0IGNsYXNzIEVudGVyT3V0ZGVudElmTGluZUlzRW1wdHlGZWF0dXJlIGltcGxlbWVudHMgSUZlYXR1cmUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBzZXR0aW5nczogU2V0dGluZ3MsXG4gICAgcHJpdmF0ZSBlZGl0b3JVdGlsczogRWRpdG9yVXRpbHMsXG4gICAgcHJpdmF0ZSBsaXN0VXRpbHM6IExpc3RVdGlsc1xuICApIHt9XG5cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5yZWdpc3RlckNvZGVNaXJyb3IoKGNtKSA9PiB7XG4gICAgICBjbS5vbihcImtleWRvd25cIiwgdGhpcy5vbktleURvd24pO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdW5sb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLmFwcC53b3Jrc3BhY2UuaXRlcmF0ZUNvZGVNaXJyb3JzKChjbSkgPT4ge1xuICAgICAgY20ub2ZmKFwia2V5ZG93blwiLCB0aGlzLm9uS2V5RG93bik7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIG91dGRlbnRJZkxpbmVJc0VtcHR5KGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IpIHtcbiAgICBpZiAoIXRoaXMuZWRpdG9yVXRpbHMuY29udGFpbnNTaW5nbGVDdXJzb3IoZWRpdG9yKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHJvb3QgPSB0aGlzLmxpc3RVdGlscy5wYXJzZUxpc3QoZWRpdG9yKTtcblxuICAgIGlmICghcm9vdCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IGxpc3QgPSByb290LmdldExpc3RVbmRlckN1cnNvcigpO1xuXG4gICAgaWYgKGxpc3QuZ2V0Q29udGVudCgpLmxlbmd0aCA+IDAgfHwgbGlzdC5nZXRMZXZlbCgpID09PSAxKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcm9vdC5tb3ZlTGVmdCgpO1xuXG4gICAgdGhpcy5saXN0VXRpbHMuYXBwbHlDaGFuZ2VzKGVkaXRvciwgcm9vdCk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgb25LZXlEb3duID0gKGNtOiBDb2RlTWlycm9yLkVkaXRvciwgZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgIGlmICghdGhpcy5zZXR0aW5ncy5iZXR0ZXJFbnRlciB8fCAhaXNFbnRlcihlKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHdvcmtlZCA9IHRoaXMub3V0ZGVudElmTGluZUlzRW1wdHkoY20pO1xuXG4gICAgaWYgKHdvcmtlZCkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH07XG59XG4iLCJpbXBvcnQgeyBQbHVnaW5fMiB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgSUZlYXR1cmUgfSBmcm9tIFwiLi4vZmVhdHVyZVwiO1xuaW1wb3J0IHsgTGlzdFV0aWxzIH0gZnJvbSBcIi4uL2xpc3RfdXRpbHNcIjtcbmltcG9ydCB7IFNldHRpbmdzIH0gZnJvbSBcIi4uL3NldHRpbmdzXCI7XG5cbmV4cG9ydCBjbGFzcyBFbnRlclNob3VsZENyZWF0ZU5ld2xpbmVPbkNoaWxkTGV2ZWxGZWF0dXJlIGltcGxlbWVudHMgSUZlYXR1cmUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBzZXR0aW5nczogU2V0dGluZ3MsXG4gICAgcHJpdmF0ZSBsaXN0VXRpbHM6IExpc3RVdGlsc1xuICApIHt9XG5cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5yZWdpc3RlckNvZGVNaXJyb3IoKGNtKSA9PiB7XG4gICAgICBjbS5vbihcImJlZm9yZUNoYW5nZVwiLCB0aGlzLm9uQmVmb3JlQ2hhbmdlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHVubG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5hcHAud29ya3NwYWNlLml0ZXJhdGVDb2RlTWlycm9ycygoY20pID0+IHtcbiAgICAgIGNtLm9mZihcImJlZm9yZUNoYW5nZVwiLCB0aGlzLm9uQmVmb3JlQ2hhbmdlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgb25CZWZvcmVDaGFuZ2UgPSAoXG4gICAgY206IENvZGVNaXJyb3IuRWRpdG9yLFxuICAgIGNoYW5nZU9iajogQ29kZU1pcnJvci5FZGl0b3JDaGFuZ2VDYW5jZWxsYWJsZVxuICApID0+IHtcbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MuYmV0dGVyRW50ZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7IGxpc3RVdGlscyB9ID0gdGhpcztcblxuICAgIGNvbnN0IGN1cnJlbnRMaW5lID0gY20uZ2V0TGluZShjaGFuZ2VPYmouZnJvbS5saW5lKTtcbiAgICBjb25zdCBuZXh0TGluZSA9IGNtLmdldExpbmUoY2hhbmdlT2JqLmZyb20ubGluZSArIDEpO1xuXG4gICAgaWYgKCFjdXJyZW50TGluZSB8fCAhbmV4dExpbmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpbmRlbnRTaWduID0gbGlzdFV0aWxzLmRldGVjdExpc3RJbmRlbnRTaWduKGNtLCBjaGFuZ2VPYmouZnJvbSk7XG5cbiAgICBpZiAoaW5kZW50U2lnbiA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGN1cnJlbnRMaW5lSW5mbyA9IGxpc3RVdGlscy5nZXRMaXN0TGluZUluZm8oY3VycmVudExpbmUsIGluZGVudFNpZ24pO1xuICAgIGNvbnN0IG5leHRMaW5lSW5mbyA9IGxpc3RVdGlscy5nZXRMaXN0TGluZUluZm8obmV4dExpbmUsIGluZGVudFNpZ24pO1xuXG4gICAgaWYgKCFjdXJyZW50TGluZUluZm8gfHwgIW5leHRMaW5lSW5mbykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNoYW5nZUlzTmV3bGluZSA9XG4gICAgICBjaGFuZ2VPYmoudGV4dC5sZW5ndGggPT09IDIgJiZcbiAgICAgIGNoYW5nZU9iai50ZXh0WzBdID09PSBcIlwiICYmXG4gICAgICAhIWxpc3RVdGlscy5nZXRMaXN0TGluZUluZm8oY2hhbmdlT2JqLnRleHRbMV0sIGluZGVudFNpZ24pO1xuXG4gICAgY29uc3QgbmV4bGluZUxldmVsSXNCaWdnZXIgPVxuICAgICAgY3VycmVudExpbmVJbmZvLmluZGVudExldmVsICsgMSA9PSBuZXh0TGluZUluZm8uaW5kZW50TGV2ZWw7XG5cbiAgICBjb25zdCBuZXh0TGluZUlzRW1wdHkgPVxuICAgICAgY20uZ2V0UmFuZ2UoY2hhbmdlT2JqLmZyb20sIHtcbiAgICAgICAgbGluZTogY2hhbmdlT2JqLmZyb20ubGluZSxcbiAgICAgICAgY2g6IGNoYW5nZU9iai5mcm9tLmNoICsgMSxcbiAgICAgIH0pLmxlbmd0aCA9PT0gMDtcblxuICAgIGlmIChjaGFuZ2VJc05ld2xpbmUgJiYgbmV4bGluZUxldmVsSXNCaWdnZXIgJiYgbmV4dExpbmVJc0VtcHR5KSB7XG4gICAgICBjaGFuZ2VPYmoudGV4dFsxXSA9IGluZGVudFNpZ24gKyBjaGFuZ2VPYmoudGV4dFsxXTtcbiAgICAgIGNoYW5nZU9iai51cGRhdGUoY2hhbmdlT2JqLmZyb20sIGNoYW5nZU9iai50bywgY2hhbmdlT2JqLnRleHQpO1xuICAgIH1cbiAgfTtcbn1cbiIsImltcG9ydCB7IFBsdWdpbl8yIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBJRmVhdHVyZSB9IGZyb20gXCJzcmMvZmVhdHVyZVwiO1xuaW1wb3J0IHsgTGlzdFV0aWxzIH0gZnJvbSBcInNyYy9saXN0X3V0aWxzXCI7XG5pbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gXCJzcmMvc2V0dGluZ3NcIjtcblxuZXhwb3J0IGNsYXNzIE1vdmVDdXJzb3JUb1ByZXZpb3VzVW5mb2xkZWRMaW5lRmVhdHVyZSBpbXBsZW1lbnRzIElGZWF0dXJlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwbHVnaW46IFBsdWdpbl8yLFxuICAgIHByaXZhdGUgc2V0dGluZ3M6IFNldHRpbmdzLFxuICAgIHByaXZhdGUgbGlzdHNVdGlsczogTGlzdFV0aWxzXG4gICkge31cblxuICBhc3luYyBsb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLnJlZ2lzdGVyQ29kZU1pcnJvcigoY20pID0+IHtcbiAgICAgIGNtLm9uKFwiYmVmb3JlU2VsZWN0aW9uQ2hhbmdlXCIsIHRoaXMuaGFuZGxlQmVmb3JlU2VsZWN0aW9uQ2hhbmdlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHVubG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5hcHAud29ya3NwYWNlLml0ZXJhdGVDb2RlTWlycm9ycygoY20pID0+IHtcbiAgICAgIGNtLm9mZihcImJlZm9yZVNlbGVjdGlvbkNoYW5nZVwiLCB0aGlzLmhhbmRsZUJlZm9yZVNlbGVjdGlvbkNoYW5nZSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGl0ZXJhdGVXaGlsZUZvbGRlZChcbiAgICBlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yLFxuICAgIHBvczogQ29kZU1pcnJvci5Qb3NpdGlvbixcbiAgICBpbmM6IChwb3M6IENvZGVNaXJyb3IuUG9zaXRpb24pID0+IHZvaWRcbiAgKSB7XG4gICAgbGV0IGZvbGRlZCA9IGZhbHNlO1xuICAgIGRvIHtcbiAgICAgIGluYyhwb3MpO1xuICAgICAgZm9sZGVkID0gKGVkaXRvciBhcyBhbnkpLmlzRm9sZGVkKHBvcyk7XG4gICAgfSB3aGlsZSAoZm9sZGVkKTtcbiAgICByZXR1cm4gcG9zO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVCZWZvcmVTZWxlY3Rpb25DaGFuZ2UgPSAoXG4gICAgY206IENvZGVNaXJyb3IuRWRpdG9yLFxuICAgIGNoYW5nZU9iajogQ29kZU1pcnJvci5FZGl0b3JTZWxlY3Rpb25DaGFuZ2VcbiAgKSA9PiB7XG4gICAgaWYgKFxuICAgICAgIXRoaXMuc2V0dGluZ3Muc3RpY2tDdXJzb3IgfHxcbiAgICAgIGNoYW5nZU9iai5vcmlnaW4gIT09IFwiK21vdmVcIiB8fFxuICAgICAgY2hhbmdlT2JqLnJhbmdlcy5sZW5ndGggPiAxXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcmFuZ2UgPSBjaGFuZ2VPYmoucmFuZ2VzWzBdO1xuICAgIGNvbnN0IGN1cnNvciA9IGNtLmdldEN1cnNvcigpO1xuXG4gICAgaWYgKFxuICAgICAgcmFuZ2UuYW5jaG9yLmxpbmUgIT09IHJhbmdlLmhlYWQubGluZSB8fFxuICAgICAgcmFuZ2UuYW5jaG9yLmNoICE9PSByYW5nZS5oZWFkLmNoXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGN1cnNvci5saW5lIDw9IDAgfHwgY3Vyc29yLmxpbmUgIT09IHJhbmdlLmFuY2hvci5saW5lKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgcm9vdCA9IHRoaXMubGlzdHNVdGlscy5wYXJzZUxpc3QoY20pO1xuXG4gICAgaWYgKCFyb290KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbGlzdCA9IHJvb3QuZ2V0TGlzdFVuZGVyQ3Vyc29yKCk7XG4gICAgY29uc3QgbGlzdENvbnRlbnRTdGFydENoID0gbGlzdC5nZXRDb250ZW50U3RhcnRDaCgpO1xuXG4gICAgaWYgKFxuICAgICAgY3Vyc29yLmNoID09PSBsaXN0Q29udGVudFN0YXJ0Q2ggJiZcbiAgICAgIHJhbmdlLmFuY2hvci5jaCA9PT0gbGlzdENvbnRlbnRTdGFydENoIC0gMVxuICAgICkge1xuICAgICAgY29uc3QgbmV3Q3Vyc29yID0gdGhpcy5pdGVyYXRlV2hpbGVGb2xkZWQoXG4gICAgICAgIGNtLFxuICAgICAgICB7XG4gICAgICAgICAgbGluZTogY3Vyc29yLmxpbmUsXG4gICAgICAgICAgY2g6IDAsXG4gICAgICAgIH0sXG4gICAgICAgIChwb3MpID0+IHtcbiAgICAgICAgICBwb3MubGluZS0tO1xuICAgICAgICAgIHBvcy5jaCA9IGNtLmdldExpbmUocG9zLmxpbmUpLmxlbmd0aCAtIDE7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgICBuZXdDdXJzb3IuY2grKztcbiAgICAgIHJhbmdlLmFuY2hvci5saW5lID0gbmV3Q3Vyc29yLmxpbmU7XG4gICAgICByYW5nZS5hbmNob3IuY2ggPSBuZXdDdXJzb3IuY2g7XG4gICAgICByYW5nZS5oZWFkLmxpbmUgPSBuZXdDdXJzb3IubGluZTtcbiAgICAgIHJhbmdlLmhlYWQuY2ggPSBuZXdDdXJzb3IuY2g7XG4gICAgICBjaGFuZ2VPYmoudXBkYXRlKFtyYW5nZV0pO1xuICAgIH1cbiAgfTtcbn1cbiIsImltcG9ydCB7IFBsdWdpbl8yIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBFZGl0b3JVdGlscyB9IGZyb20gXCJzcmMvZWRpdG9yX3V0aWxzXCI7XG5pbXBvcnQgeyBJRmVhdHVyZSB9IGZyb20gXCJzcmMvZmVhdHVyZVwiO1xuaW1wb3J0IHsgTGlzdFV0aWxzIH0gZnJvbSBcInNyYy9saXN0X3V0aWxzXCI7XG5pbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gXCJzcmMvc2V0dGluZ3NcIjtcblxuZXhwb3J0IGNsYXNzIEVuc3VyZUN1cnNvckluTGlzdENvbnRlbnRGZWF0dXJlIGltcGxlbWVudHMgSUZlYXR1cmUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBzZXR0aW5nczogU2V0dGluZ3MsXG4gICAgcHJpdmF0ZSBlZGl0b3JVdGlsczogRWRpdG9yVXRpbHMsXG4gICAgcHJpdmF0ZSBsaXN0c1V0aWxzOiBMaXN0VXRpbHNcbiAgKSB7fVxuXG4gIGFzeW5jIGxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4ucmVnaXN0ZXJDb2RlTWlycm9yKChjbSkgPT4ge1xuICAgICAgY20ub24oXCJjdXJzb3JBY3Rpdml0eVwiLCB0aGlzLmhhbmRsZUN1cnNvckFjdGl2aXR5KTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHVubG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5hcHAud29ya3NwYWNlLml0ZXJhdGVDb2RlTWlycm9ycygoY20pID0+IHtcbiAgICAgIGNtLm9mZihcImN1cnNvckFjdGl2aXR5XCIsIHRoaXMuaGFuZGxlQ3Vyc29yQWN0aXZpdHkpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBlbnN1cmVDdXJzb3JJbkxpc3RDb250ZW50KGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IpIHtcbiAgICBjb25zdCBjdXJzb3IgPSBlZGl0b3IuZ2V0Q3Vyc29yKCk7XG4gICAgY29uc3QgaW5kZW50U2lnbiA9IHRoaXMubGlzdHNVdGlscy5kZXRlY3RMaXN0SW5kZW50U2lnbihlZGl0b3IsIGN1cnNvcik7XG5cbiAgICBpZiAoaW5kZW50U2lnbiA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge1xuICAgICAgY29uc3QgY3Vyc29yID0gZWRpdG9yLmdldEN1cnNvcigpO1xuICAgICAgY29uc3QgbGluZVN0YXJ0Q3Vyc29yID0gZWRpdG9yLmNvb3Jkc0NoYXIoe1xuICAgICAgICAuLi5lZGl0b3IuY3Vyc29yQ29vcmRzKCksXG4gICAgICAgIGxlZnQ6IDAsXG4gICAgICB9KTtcblxuICAgICAgaWYgKGxpbmVTdGFydEN1cnNvci5saW5lICE9PSBjdXJzb3IubGluZSkge1xuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yKHtcbiAgICAgICAgICBsaW5lOiBsaW5lU3RhcnRDdXJzb3IubGluZSxcbiAgICAgICAgICBjaDogZWRpdG9yLmdldExpbmUobGluZVN0YXJ0Q3Vyc29yLmxpbmUpLmxlbmd0aCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBsaW5lID0gZWRpdG9yLmdldExpbmUoY3Vyc29yLmxpbmUpO1xuICAgIGNvbnN0IGxpbmVQcmVmaXggPSB0aGlzLmxpc3RzVXRpbHMuZ2V0TGlzdExpbmVJbmZvKGxpbmUsIGluZGVudFNpZ24pXG4gICAgICAucHJlZml4TGVuZ3RoO1xuXG4gICAgaWYgKGN1cnNvci5jaCA8IGxpbmVQcmVmaXgpIHtcbiAgICAgIGN1cnNvci5jaCA9IGxpbmVQcmVmaXg7XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yKGN1cnNvcik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVDdXJzb3JBY3Rpdml0eSA9IChjbTogQ29kZU1pcnJvci5FZGl0b3IpID0+IHtcbiAgICBpZiAoXG4gICAgICB0aGlzLnNldHRpbmdzLnN0aWNrQ3Vyc29yICYmXG4gICAgICB0aGlzLmVkaXRvclV0aWxzLmNvbnRhaW5zU2luZ2xlQ3Vyc29yKGNtKSAmJlxuICAgICAgdGhpcy5saXN0c1V0aWxzLmlzQ3Vyc29ySW5MaXN0KGNtKVxuICAgICkge1xuICAgICAgdGhpcy5lbnN1cmVDdXJzb3JJbkxpc3RDb250ZW50KGNtKTtcbiAgICB9XG4gIH07XG59XG4iLCJpbXBvcnQgeyBQbHVnaW5fMiB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgRWRpdG9yVXRpbHMgfSBmcm9tIFwic3JjL2VkaXRvcl91dGlsc1wiO1xuaW1wb3J0IHsgSUZlYXR1cmUgfSBmcm9tIFwic3JjL2ZlYXR1cmVcIjtcbmltcG9ydCB7IExpc3RVdGlscyB9IGZyb20gXCJzcmMvbGlzdF91dGlsc1wiO1xuaW1wb3J0IHsgUm9vdCB9IGZyb20gXCJzcmMvcm9vdFwiO1xuaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tIFwic3JjL3NldHRpbmdzXCI7XG5cbmV4cG9ydCBjbGFzcyBEZWxldGVTaG91bGRJZ25vcmVCdWxsZXRzRmVhdHVyZSBpbXBsZW1lbnRzIElGZWF0dXJlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwbHVnaW46IFBsdWdpbl8yLFxuICAgIHByaXZhdGUgc2V0dGluZ3M6IFNldHRpbmdzLFxuICAgIHByaXZhdGUgZWRpdG9yVXRpbHM6IEVkaXRvclV0aWxzLFxuICAgIHByaXZhdGUgbGlzdHNVdGlsczogTGlzdFV0aWxzXG4gICkge31cblxuICBhc3luYyBsb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLnJlZ2lzdGVyQ29kZU1pcnJvcigoY20pID0+IHtcbiAgICAgIGNtLm9uKFwiYmVmb3JlQ2hhbmdlXCIsIHRoaXMuaGFuZGxlQmVmb3JlQ2hhbmdlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHVubG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5hcHAud29ya3NwYWNlLml0ZXJhdGVDb2RlTWlycm9ycygoY20pID0+IHtcbiAgICAgIGNtLm9mZihcImJlZm9yZUNoYW5nZVwiLCB0aGlzLmhhbmRsZUJlZm9yZUNoYW5nZSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZUJlZm9yZUNoYW5nZSA9IChcbiAgICBjbTogQ29kZU1pcnJvci5FZGl0b3IsXG4gICAgY2hhbmdlT2JqOiBDb2RlTWlycm9yLkVkaXRvckNoYW5nZUNhbmNlbGxhYmxlXG4gICkgPT4ge1xuICAgIGlmIChcbiAgICAgIGNoYW5nZU9iai5vcmlnaW4gIT09IFwiK2RlbGV0ZVwiIHx8XG4gICAgICAhdGhpcy5zZXR0aW5ncy5zdGlja0N1cnNvciB8fFxuICAgICAgIXRoaXMuZWRpdG9yVXRpbHMuY29udGFpbnNTaW5nbGVDdXJzb3IoY20pXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgcm9vdCA9IHRoaXMubGlzdHNVdGlscy5wYXJzZUxpc3QoY20pO1xuXG4gICAgaWYgKCFyb290KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbGlzdCA9IHJvb3QuZ2V0TGlzdFVuZGVyQ3Vyc29yKCk7XG4gICAgY29uc3QgbGlzdENvbnRlbnRTdGFydENoID0gbGlzdC5nZXRDb250ZW50U3RhcnRDaCgpO1xuICAgIGNvbnN0IGxpc3RDb250ZW50RW5kQ2ggPSBsaXN0LmdldENvbnRlbnRFbmRDaCgpO1xuXG4gICAgaWYgKHRoaXMuaXNCYWNrc3BhY2VPbkNvbnRlbnRTdGFydChjaGFuZ2VPYmosIGxpc3RDb250ZW50U3RhcnRDaCkpIHtcbiAgICAgIHRoaXMuZGVsZXRlSXRlbUFuZE1lcmdlQ29udGVudFdpdGhQcmV2aW91c0xpbmUoY20sIHJvb3QsIGNoYW5nZU9iaik7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzRGVsZXRpb25JbmNsdWRlc0J1bGxldChjaGFuZ2VPYmosIGxpc3RDb250ZW50U3RhcnRDaCkpIHtcbiAgICAgIHRoaXMubGltaXREZWxldGVSYW5nZVRvQ29udGVudFJhbmdlKGNoYW5nZU9iaiwgbGlzdENvbnRlbnRTdGFydENoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNEZWxldGVPbkxpbmVFbmQoY2hhbmdlT2JqLCBsaXN0Q29udGVudEVuZENoKSkge1xuICAgICAgdGhpcy5kZWxldGVOZXh0SXRlbUFuZE1lcmdlQ29udGVudFdpdGhDdXJyZW50TGluZShjbSwgcm9vdCwgY2hhbmdlT2JqKTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSBpc0RlbGV0ZU9uTGluZUVuZChcbiAgICBjaGFuZ2VPYmo6IENvZGVNaXJyb3IuRWRpdG9yQ2hhbmdlQ2FuY2VsbGFibGUsXG4gICAgbGlzdENvbnRlbnRFbmRDaDogbnVtYmVyXG4gICkge1xuICAgIHJldHVybiAoXG4gICAgICBjaGFuZ2VPYmouZnJvbS5saW5lICsgMSA9PT0gY2hhbmdlT2JqLnRvLmxpbmUgJiZcbiAgICAgIGNoYW5nZU9iai5mcm9tLmNoID09PSBsaXN0Q29udGVudEVuZENoICYmXG4gICAgICBjaGFuZ2VPYmoudG8uY2ggPT09IDBcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBpc0RlbGV0aW9uSW5jbHVkZXNCdWxsZXQoXG4gICAgY2hhbmdlT2JqOiBDb2RlTWlycm9yLkVkaXRvckNoYW5nZUNhbmNlbGxhYmxlLFxuICAgIGxpc3RDb250ZW50U3RhcnRDaDogbnVtYmVyXG4gICkge1xuICAgIHJldHVybiAoXG4gICAgICBjaGFuZ2VPYmouZnJvbS5saW5lID09PSBjaGFuZ2VPYmoudG8ubGluZSAmJlxuICAgICAgY2hhbmdlT2JqLmZyb20uY2ggPCBsaXN0Q29udGVudFN0YXJ0Q2hcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBpc0JhY2tzcGFjZU9uQ29udGVudFN0YXJ0KFxuICAgIGNoYW5nZU9iajogQ29kZU1pcnJvci5FZGl0b3JDaGFuZ2VDYW5jZWxsYWJsZSxcbiAgICBsaXN0Q29udGVudFN0YXJ0Q2g6IG51bWJlclxuICApIHtcbiAgICByZXR1cm4gKFxuICAgICAgY2hhbmdlT2JqLmZyb20ubGluZSA9PT0gY2hhbmdlT2JqLnRvLmxpbmUgJiZcbiAgICAgIGNoYW5nZU9iai5mcm9tLmNoID09PSBsaXN0Q29udGVudFN0YXJ0Q2ggLSAxICYmXG4gICAgICBjaGFuZ2VPYmoudG8uY2ggPT09IGxpc3RDb250ZW50U3RhcnRDaFxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIGxpbWl0RGVsZXRlUmFuZ2VUb0NvbnRlbnRSYW5nZShcbiAgICBjaGFuZ2VPYmo6IENvZGVNaXJyb3IuRWRpdG9yQ2hhbmdlQ2FuY2VsbGFibGUsXG4gICAgbGlzdENvbnRlbnRTdGFydENoOiBudW1iZXJcbiAgKSB7XG4gICAgY29uc3QgZnJvbSA9IHtcbiAgICAgIGxpbmU6IGNoYW5nZU9iai5mcm9tLmxpbmUsXG4gICAgICBjaDogbGlzdENvbnRlbnRTdGFydENoLFxuICAgIH07XG4gICAgY2hhbmdlT2JqLnVwZGF0ZShmcm9tLCBjaGFuZ2VPYmoudG8sIGNoYW5nZU9iai50ZXh0KTtcbiAgfVxuXG4gIHByaXZhdGUgZGVsZXRlSXRlbUFuZE1lcmdlQ29udGVudFdpdGhQcmV2aW91c0xpbmUoXG4gICAgZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcixcbiAgICByb290OiBSb290LFxuICAgIGNoYW5nZU9iajogQ29kZU1pcnJvci5FZGl0b3JDaGFuZ2VDYW5jZWxsYWJsZVxuICApIHtcbiAgICBjb25zdCBsaXN0ID0gcm9vdC5nZXRMaXN0VW5kZXJDdXJzb3IoKTtcbiAgICBpZiAoXG4gICAgICByb290LmdldExpc3RTdGFydFBvc2l0aW9uKCkubGluZSA9PT0gcm9vdC5nZXRMaW5lTnVtYmVyT2YobGlzdCkgJiZcbiAgICAgIGxpc3QuZ2V0Q2hpbGRyZW4oKS5sZW5ndGggPT09IDBcbiAgICApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCByZXMgPSByb290LmRlbGV0ZUFuZE1lcmdlV2l0aFByZXZpb3VzKCk7XG5cbiAgICBpZiAocmVzKSB7XG4gICAgICBjaGFuZ2VPYmouY2FuY2VsKCk7XG4gICAgICB0aGlzLmxpc3RzVXRpbHMuYXBwbHlDaGFuZ2VzKGVkaXRvciwgcm9vdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIHByaXZhdGUgZGVsZXRlTmV4dEl0ZW1BbmRNZXJnZUNvbnRlbnRXaXRoQ3VycmVudExpbmUoXG4gICAgZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcixcbiAgICByb290OiBSb290LFxuICAgIGNoYW5nZU9iajogQ29kZU1pcnJvci5FZGl0b3JDaGFuZ2VDYW5jZWxsYWJsZVxuICApIHtcbiAgICBjb25zdCBsaXN0ID0gcm9vdC5nZXRMaXN0VW5kZXJDdXJzb3IoKTtcbiAgICBjb25zdCBuZXh0TGluZU5vID0gcm9vdC5nZXRDdXJzb3IoKS5saW5lICsgMTtcbiAgICBjb25zdCBuZXh0TGlzdCA9IHJvb3QuZ2V0TGlzdFVuZGVyTGluZShuZXh0TGluZU5vKTtcblxuICAgIGlmICghbmV4dExpc3QgfHwgcm9vdC5nZXRDdXJzb3IoKS5jaCAhPT0gbGlzdC5nZXRDb250ZW50RW5kQ2goKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJvb3QucmVwbGFjZUN1cnNvcih7XG4gICAgICBsaW5lOiBuZXh0TGluZU5vLFxuICAgICAgY2g6IG5leHRMaXN0LmdldENvbnRlbnRTdGFydENoKCksXG4gICAgfSk7XG5cbiAgICBjb25zdCByZXMgPSByb290LmRlbGV0ZUFuZE1lcmdlV2l0aFByZXZpb3VzKCk7XG4gICAgY29uc3QgcmVhbGx5Q2hhbmdlZCA9IHJvb3QuZ2V0Q3Vyc29yKCkubGluZSAhPT0gbmV4dExpbmVObztcblxuICAgIGlmIChyZWFsbHlDaGFuZ2VkKSB7XG4gICAgICBjaGFuZ2VPYmouY2FuY2VsKCk7XG4gICAgICB0aGlzLmxpc3RzVXRpbHMuYXBwbHlDaGFuZ2VzKGVkaXRvciwgcm9vdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcztcbiAgfVxufVxuIiwiaW1wb3J0IHsgUGx1Z2luXzIgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IExpc3RVdGlscyB9IGZyb20gXCJzcmMvbGlzdF91dGlsc1wiO1xuaW1wb3J0IHsgSUZlYXR1cmUgfSBmcm9tIFwiLi4vZmVhdHVyZVwiO1xuaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tIFwiLi4vc2V0dGluZ3NcIjtcblxuZXhwb3J0IGNsYXNzIFNlbGVjdGlvblNob3VsZElnbm9yZUJ1bGxldHNGZWF0dXJlIGltcGxlbWVudHMgSUZlYXR1cmUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBzZXR0aW5nczogU2V0dGluZ3MsXG4gICAgcHJpdmF0ZSBsaXN0c1V0aWxzOiBMaXN0VXRpbHNcbiAgKSB7fVxuXG4gIGFzeW5jIGxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4ucmVnaXN0ZXJDb2RlTWlycm9yKChjbSkgPT4ge1xuICAgICAgY20ub24oXCJiZWZvcmVTZWxlY3Rpb25DaGFuZ2VcIiwgdGhpcy5oYW5kbGVCZWZvcmVTZWxlY3Rpb25DaGFuZ2UpO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdW5sb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLmFwcC53b3Jrc3BhY2UuaXRlcmF0ZUNvZGVNaXJyb3JzKChjbSkgPT4ge1xuICAgICAgY20ub2ZmKFwiYmVmb3JlU2VsZWN0aW9uQ2hhbmdlXCIsIHRoaXMuaGFuZGxlQmVmb3JlU2VsZWN0aW9uQ2hhbmdlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlQmVmb3JlU2VsZWN0aW9uQ2hhbmdlID0gKFxuICAgIGNtOiBDb2RlTWlycm9yLkVkaXRvcixcbiAgICBjaGFuZ2VPYmo6IENvZGVNaXJyb3IuRWRpdG9yU2VsZWN0aW9uQ2hhbmdlXG4gICkgPT4ge1xuICAgIGlmIChcbiAgICAgICF0aGlzLnNldHRpbmdzLnN0aWNrQ3Vyc29yIHx8XG4gICAgICBjaGFuZ2VPYmoub3JpZ2luICE9PSBcIittb3ZlXCIgfHxcbiAgICAgIGNoYW5nZU9iai5yYW5nZXMubGVuZ3RoID4gMVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJhbmdlID0gY2hhbmdlT2JqLnJhbmdlc1swXTtcblxuICAgIGlmIChcbiAgICAgIHJhbmdlLmFuY2hvci5saW5lICE9PSByYW5nZS5oZWFkLmxpbmUgfHxcbiAgICAgIHJhbmdlLmFuY2hvci5jaCA9PT0gcmFuZ2UuaGVhZC5jaFxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJvb3QgPSB0aGlzLmxpc3RzVXRpbHMucGFyc2VMaXN0KGNtKTtcblxuICAgIGlmICghcm9vdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGxpc3QgPSByb290LmdldExpc3RVbmRlckN1cnNvcigpO1xuICAgIGNvbnN0IGxpc3RDb250ZW50U3RhcnRDaCA9IGxpc3QuZ2V0Q29udGVudFN0YXJ0Q2goKTtcblxuICAgIGlmIChyYW5nZS5mcm9tKCkuY2ggPCBsaXN0Q29udGVudFN0YXJ0Q2gpIHtcbiAgICAgIHJhbmdlLmZyb20oKS5jaCA9IGxpc3RDb250ZW50U3RhcnRDaDtcbiAgICAgIGNoYW5nZU9iai51cGRhdGUoW3JhbmdlXSk7XG4gICAgfVxuICB9O1xufVxuIiwiaW1wb3J0IHsgUGx1Z2luXzIgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IExpc3RVdGlscyB9IGZyb20gXCJzcmMvbGlzdF91dGlsc1wiO1xuaW1wb3J0IHsgT2JzaWRpYW5VdGlscyB9IGZyb20gXCJzcmMvb2JzaWRpYW5fdXRpbHNcIjtcbmltcG9ydCB7IFNldHRpbmdzIH0gZnJvbSBcInNyYy9zZXR0aW5nc1wiO1xuaW1wb3J0IHsgSUZlYXR1cmUgfSBmcm9tIFwiLi4vZmVhdHVyZVwiO1xuXG5jbGFzcyBab29tU3RhdGUge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgbGluZTogQ29kZU1pcnJvci5MaW5lSGFuZGxlLCBwdWJsaWMgaGVhZGVyOiBIVE1MRWxlbWVudCkge31cbn1cblxuZXhwb3J0IGNsYXNzIFpvb21GZWF0dXJlIGltcGxlbWVudHMgSUZlYXR1cmUge1xuICBwcml2YXRlIHpvb21TdGF0ZXM6IFdlYWtNYXA8Q29kZU1pcnJvci5FZGl0b3IsIFpvb21TdGF0ZT4gPSBuZXcgV2Vha01hcCgpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcGx1Z2luOiBQbHVnaW5fMixcbiAgICBwcml2YXRlIHNldHRpbmdzOiBTZXR0aW5ncyxcbiAgICBwcml2YXRlIG9ic2lkaWFuVXRpbHM6IE9ic2lkaWFuVXRpbHMsXG4gICAgcHJpdmF0ZSBsaXN0c1V0aWxzOiBMaXN0VXRpbHNcbiAgKSB7XG4gICAgdGhpcy56b29tU3RhdGVzID0gbmV3IFdlYWtNYXAoKTtcbiAgfVxuXG4gIGFzeW5jIGxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4ucmVnaXN0ZXJDb2RlTWlycm9yKChjbSkgPT4ge1xuICAgICAgY20ub24oXCJiZWZvcmVDaGFuZ2VcIiwgdGhpcy5oYW5kbGVCZWZvcmVDaGFuZ2UpO1xuICAgICAgY20ub24oXCJjaGFuZ2VcIiwgdGhpcy5oYW5kbGVDaGFuZ2UpO1xuICAgICAgY20ub24oXCJiZWZvcmVTZWxlY3Rpb25DaGFuZ2VcIiwgdGhpcy5oYW5kbGVCZWZvcmVTZWxlY3Rpb25DaGFuZ2UpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5wbHVnaW4ucmVnaXN0ZXJEb21FdmVudCh3aW5kb3csIFwiY2xpY2tcIiwgdGhpcy5oYW5kbGVDbGljayk7XG5cbiAgICB0aGlzLnBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcInpvb20taW5cIixcbiAgICAgIG5hbWU6IFwiWm9vbSBpbiB0byB0aGUgY3VycmVudCBsaXN0IGl0ZW1cIixcbiAgICAgIGNhbGxiYWNrOiB0aGlzLm9ic2lkaWFuVXRpbHMuY3JlYXRlQ29tbWFuZENhbGxiYWNrKFxuICAgICAgICB0aGlzLnpvb21Jbi5iaW5kKHRoaXMpXG4gICAgICApLFxuICAgICAgaG90a2V5czogW1xuICAgICAgICB7XG4gICAgICAgICAgbW9kaWZpZXJzOiBbXCJNb2RcIl0sXG4gICAgICAgICAga2V5OiBcIi5cIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICB0aGlzLnBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcInpvb20tb3V0XCIsXG4gICAgICBuYW1lOiBcIlpvb20gb3V0IHRoZSBlbnRpcmUgZG9jdW1lbnRcIixcbiAgICAgIGNhbGxiYWNrOiB0aGlzLm9ic2lkaWFuVXRpbHMuY3JlYXRlQ29tbWFuZENhbGxiYWNrKFxuICAgICAgICB0aGlzLnpvb21PdXQuYmluZCh0aGlzKVxuICAgICAgKSxcbiAgICAgIGhvdGtleXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sXG4gICAgICAgICAga2V5OiBcIi5cIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyB1bmxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4uYXBwLndvcmtzcGFjZS5pdGVyYXRlQ29kZU1pcnJvcnMoKGNtKSA9PiB7XG4gICAgICBjbS5vZmYoXCJiZWZvcmVTZWxlY3Rpb25DaGFuZ2VcIiwgdGhpcy5oYW5kbGVCZWZvcmVTZWxlY3Rpb25DaGFuZ2UpO1xuICAgICAgY20ub2ZmKFwiY2hhbmdlXCIsIHRoaXMuaGFuZGxlQ2hhbmdlKTtcbiAgICAgIGNtLm9mZihcImJlZm9yZUNoYW5nZVwiLCB0aGlzLmhhbmRsZUJlZm9yZUNoYW5nZSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZUNsaWNrID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRWxlbWVudCB8IG51bGw7XG5cbiAgICBpZiAoXG4gICAgICAhdGFyZ2V0IHx8XG4gICAgICAhdGhpcy5zZXR0aW5ncy56b29tT25DbGljayB8fFxuICAgICAgIXRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJjbS1mb3JtYXR0aW5nLWxpc3QtdWxcIilcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgd3JhcCA9IHRhcmdldDtcbiAgICB3aGlsZSAod3JhcCkge1xuICAgICAgaWYgKHdyYXAuY2xhc3NMaXN0LmNvbnRhaW5zKFwiQ29kZU1pcnJvci13cmFwXCIpKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgd3JhcCA9IHdyYXAucGFyZW50RWxlbWVudDtcbiAgICB9XG5cbiAgICBpZiAoIXdyYXApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgZm91bmRFZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yIHwgbnVsbCA9IG51bGw7XG5cbiAgICB0aGlzLnBsdWdpbi5hcHAud29ya3NwYWNlLml0ZXJhdGVDb2RlTWlycm9ycygoY20pID0+IHtcbiAgICAgIGlmIChmb3VuZEVkaXRvcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChjbS5nZXRXcmFwcGVyRWxlbWVudCgpID09PSB3cmFwKSB7XG4gICAgICAgIGZvdW5kRWRpdG9yID0gY207XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoIWZvdW5kRWRpdG9yKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcG9zID0gZm91bmRFZGl0b3IuY29vcmRzQ2hhcih7XG4gICAgICBsZWZ0OiBlLngsXG4gICAgICB0b3A6IGUueSxcbiAgICB9KTtcblxuICAgIGlmICghcG9zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICB0aGlzLnpvb21Jbihmb3VuZEVkaXRvciwgcG9zKTtcblxuICAgIGZvdW5kRWRpdG9yLnNldEN1cnNvcih7XG4gICAgICBsaW5lOiBwb3MubGluZSxcbiAgICAgIGNoOiBmb3VuZEVkaXRvci5nZXRMaW5lKHBvcy5saW5lKS5sZW5ndGgsXG4gICAgfSk7XG4gIH07XG5cbiAgcHJpdmF0ZSBoYW5kbGVCZWZvcmVDaGFuZ2UgPSAoXG4gICAgY206IENvZGVNaXJyb3IuRWRpdG9yLFxuICAgIGNoYW5nZU9iajogQ29kZU1pcnJvci5FZGl0b3JDaGFuZ2VDYW5jZWxsYWJsZVxuICApID0+IHtcbiAgICBjb25zdCB6b29tU3RhdGUgPSB0aGlzLnpvb21TdGF0ZXMuZ2V0KGNtKTtcblxuICAgIGlmIChcbiAgICAgICF6b29tU3RhdGUgfHxcbiAgICAgIGNoYW5nZU9iai5vcmlnaW4gIT09IFwic2V0VmFsdWVcIiB8fFxuICAgICAgY2hhbmdlT2JqLmZyb20ubGluZSAhPT0gMCB8fFxuICAgICAgY2hhbmdlT2JqLmZyb20uY2ggIT09IDBcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB0aWxsTGluZSA9IGNtLmxhc3RMaW5lKCk7XG4gICAgY29uc3QgdGlsbENoID0gY20uZ2V0TGluZSh0aWxsTGluZSkubGVuZ3RoO1xuXG4gICAgaWYgKGNoYW5nZU9iai50by5saW5lICE9PSB0aWxsTGluZSB8fCBjaGFuZ2VPYmoudG8uY2ggIT09IHRpbGxDaCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuem9vbU91dChjbSk7XG4gIH07XG5cbiAgcHJpdmF0ZSBoYW5kbGVDaGFuZ2UgPSAoXG4gICAgY206IENvZGVNaXJyb3IuRWRpdG9yLFxuICAgIGNoYW5nZU9iajogQ29kZU1pcnJvci5FZGl0b3JDaGFuZ2VDYW5jZWxsYWJsZVxuICApID0+IHtcbiAgICBjb25zdCB6b29tU3RhdGUgPSB0aGlzLnpvb21TdGF0ZXMuZ2V0KGNtKTtcblxuICAgIGlmICghem9vbVN0YXRlIHx8IGNoYW5nZU9iai5vcmlnaW4gIT09IFwic2V0VmFsdWVcIikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuem9vbUluKGNtLCB7XG4gICAgICBsaW5lOiBjbS5nZXRMaW5lTnVtYmVyKHpvb21TdGF0ZS5saW5lKSxcbiAgICAgIGNoOiAwLFxuICAgIH0pO1xuICB9O1xuXG4gIHByaXZhdGUgaGFuZGxlQmVmb3JlU2VsZWN0aW9uQ2hhbmdlID0gKFxuICAgIGNtOiBDb2RlTWlycm9yLkVkaXRvcixcbiAgICBjaGFuZ2VPYmo6IENvZGVNaXJyb3IuRWRpdG9yU2VsZWN0aW9uQ2hhbmdlXG4gICkgPT4ge1xuICAgIGlmICghdGhpcy56b29tU3RhdGVzLmhhcyhjbSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgdmlzaWJsZUZyb206IENvZGVNaXJyb3IuUG9zaXRpb24gfCBudWxsID0gbnVsbDtcbiAgICBsZXQgdmlzaWJsZVRpbGw6IENvZGVNaXJyb3IuUG9zaXRpb24gfCBudWxsID0gbnVsbDtcblxuICAgIGZvciAobGV0IGkgPSBjbS5maXJzdExpbmUoKTsgaSA8PSBjbS5sYXN0TGluZSgpOyBpKyspIHtcbiAgICAgIGNvbnN0IHdyYXBDbGFzcyA9IGNtLmxpbmVJbmZvKGkpLndyYXBDbGFzcyB8fCBcIlwiO1xuICAgICAgY29uc3QgaXNIaWRkZW4gPSB3cmFwQ2xhc3MuaW5jbHVkZXMoXCJvdXRsaW5lci1wbHVnaW4taGlkZGVuLXJvd1wiKTtcbiAgICAgIGlmICh2aXNpYmxlRnJvbSA9PT0gbnVsbCAmJiAhaXNIaWRkZW4pIHtcbiAgICAgICAgdmlzaWJsZUZyb20gPSB7IGxpbmU6IGksIGNoOiAwIH07XG4gICAgICB9XG4gICAgICBpZiAodmlzaWJsZUZyb20gIT09IG51bGwgJiYgdmlzaWJsZVRpbGwgIT09IG51bGwgJiYgaXNIaWRkZW4pIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAodmlzaWJsZUZyb20gIT09IG51bGwpIHtcbiAgICAgICAgdmlzaWJsZVRpbGwgPSB7IGxpbmU6IGksIGNoOiBjbS5nZXRMaW5lKGkpLmxlbmd0aCB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBjaGFuZ2VkID0gZmFsc2U7XG5cbiAgICBmb3IgKGNvbnN0IHJhbmdlIG9mIGNoYW5nZU9iai5yYW5nZXMpIHtcbiAgICAgIGlmIChyYW5nZS5hbmNob3IubGluZSA8IHZpc2libGVGcm9tLmxpbmUpIHtcbiAgICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgICAgIHJhbmdlLmFuY2hvci5saW5lID0gdmlzaWJsZUZyb20ubGluZTtcbiAgICAgICAgcmFuZ2UuYW5jaG9yLmNoID0gdmlzaWJsZUZyb20uY2g7XG4gICAgICB9XG4gICAgICBpZiAocmFuZ2UuYW5jaG9yLmxpbmUgPiB2aXNpYmxlVGlsbC5saW5lKSB7XG4gICAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgICAgICByYW5nZS5hbmNob3IubGluZSA9IHZpc2libGVUaWxsLmxpbmU7XG4gICAgICAgIHJhbmdlLmFuY2hvci5jaCA9IHZpc2libGVUaWxsLmNoO1xuICAgICAgfVxuICAgICAgaWYgKHJhbmdlLmhlYWQubGluZSA8IHZpc2libGVGcm9tLmxpbmUpIHtcbiAgICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgICAgIHJhbmdlLmhlYWQubGluZSA9IHZpc2libGVGcm9tLmxpbmU7XG4gICAgICAgIHJhbmdlLmhlYWQuY2ggPSB2aXNpYmxlRnJvbS5jaDtcbiAgICAgIH1cbiAgICAgIGlmIChyYW5nZS5oZWFkLmxpbmUgPiB2aXNpYmxlVGlsbC5saW5lKSB7XG4gICAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgICAgICByYW5nZS5oZWFkLmxpbmUgPSB2aXNpYmxlVGlsbC5saW5lO1xuICAgICAgICByYW5nZS5oZWFkLmNoID0gdmlzaWJsZVRpbGwuY2g7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZWQpIHtcbiAgICAgIGNoYW5nZU9iai51cGRhdGUoY2hhbmdlT2JqLnJhbmdlcyk7XG4gICAgfVxuICB9O1xuXG4gIHByaXZhdGUgem9vbU91dChlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yKSB7XG4gICAgY29uc3Qgem9vbVN0YXRlID0gdGhpcy56b29tU3RhdGVzLmdldChlZGl0b3IpO1xuXG4gICAgaWYgKCF6b29tU3RhdGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gZWRpdG9yLmZpcnN0TGluZSgpLCBsID0gZWRpdG9yLmxhc3RMaW5lKCk7IGkgPD0gbDsgaSsrKSB7XG4gICAgICBlZGl0b3IucmVtb3ZlTGluZUNsYXNzKGksIFwid3JhcFwiLCBcIm91dGxpbmVyLXBsdWdpbi1oaWRkZW4tcm93XCIpO1xuICAgIH1cblxuICAgIHpvb21TdGF0ZS5oZWFkZXIucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh6b29tU3RhdGUuaGVhZGVyKTtcblxuICAgIHRoaXMuem9vbVN0YXRlcy5kZWxldGUoZWRpdG9yKTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSB6b29tSW4oXG4gICAgZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcixcbiAgICBjdXJzb3I6IENvZGVNaXJyb3IuUG9zaXRpb24gPSBlZGl0b3IuZ2V0Q3Vyc29yKClcbiAgKSB7XG4gICAgY29uc3QgbGluZU5vID0gY3Vyc29yLmxpbmU7XG4gICAgY29uc3Qgcm9vdCA9IHRoaXMubGlzdHNVdGlscy5wYXJzZUxpc3QoZWRpdG9yLCBjdXJzb3IpO1xuXG4gICAgaWYgKCFyb290KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy56b29tT3V0KGVkaXRvcik7XG5cbiAgICBjb25zdCB7IGluZGVudExldmVsIH0gPSB0aGlzLmxpc3RzVXRpbHMuZ2V0TGlzdExpbmVJbmZvKFxuICAgICAgZWRpdG9yLmdldExpbmUobGluZU5vKSxcbiAgICAgIHJvb3QuZ2V0SW5kZW50U2lnbigpXG4gICAgKTtcblxuICAgIGxldCBhZnRlciA9IGZhbHNlO1xuICAgIGZvciAobGV0IGkgPSBlZGl0b3IuZmlyc3RMaW5lKCksIGwgPSBlZGl0b3IubGFzdExpbmUoKTsgaSA8PSBsOyBpKyspIHtcbiAgICAgIGlmIChpIDwgbGluZU5vKSB7XG4gICAgICAgIGVkaXRvci5hZGRMaW5lQ2xhc3MoaSwgXCJ3cmFwXCIsIFwib3V0bGluZXItcGx1Z2luLWhpZGRlbi1yb3dcIik7XG4gICAgICB9IGVsc2UgaWYgKGkgPiBsaW5lTm8gJiYgIWFmdGVyKSB7XG4gICAgICAgIGNvbnN0IGFmdGVyTGluZUluZm8gPSB0aGlzLmxpc3RzVXRpbHMuZ2V0TGlzdExpbmVJbmZvKFxuICAgICAgICAgIGVkaXRvci5nZXRMaW5lKGkpLFxuICAgICAgICAgIHJvb3QuZ2V0SW5kZW50U2lnbigpXG4gICAgICAgICk7XG4gICAgICAgIGFmdGVyID0gIWFmdGVyTGluZUluZm8gfHwgYWZ0ZXJMaW5lSW5mby5pbmRlbnRMZXZlbCA8PSBpbmRlbnRMZXZlbDtcbiAgICAgIH1cblxuICAgICAgaWYgKGFmdGVyKSB7XG4gICAgICAgIGVkaXRvci5hZGRMaW5lQ2xhc3MoaSwgXCJ3cmFwXCIsIFwib3V0bGluZXItcGx1Z2luLWhpZGRlbi1yb3dcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgY3JlYXRlU2VwYXJhdG9yID0gKCkgPT4ge1xuICAgICAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgc3Bhbi50ZXh0Q29udGVudCA9IFwiID4gXCI7XG4gICAgICByZXR1cm4gc3BhbjtcbiAgICB9O1xuXG4gICAgY29uc3QgY3JlYXRlVGl0bGUgPSAoY29udGVudDogc3RyaW5nLCBjYjogKCkgPT4gdm9pZCkgPT4ge1xuICAgICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgYS5jbGFzc05hbWUgPSBcIm91dGxpbmVyLXBsdWdpbi16b29tLXRpdGxlXCI7XG4gICAgICBpZiAoY29udGVudCkge1xuICAgICAgICBhLnRleHRDb250ZW50ID0gY29udGVudDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGEuaW5uZXJIVE1MID0gXCImbmJzcDsmbmJzcDsmbmJzcDsmbmJzcDsmbmJzcDtcIjtcbiAgICAgIH1cbiAgICAgIGEub25jbGljayA9IChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY2IoKTtcbiAgICAgIH07XG4gICAgICByZXR1cm4gYTtcbiAgICB9O1xuXG4gICAgY29uc3QgY3JlYXRlSGVhZGVyID0gKCkgPT4ge1xuICAgICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIGRpdi5jbGFzc05hbWUgPSBcIm91dGxpbmVyLXBsdWdpbi16b29tLWhlYWRlclwiO1xuXG4gICAgICBsZXQgbGlzdCA9IHJvb3QuZ2V0TGlzdFVuZGVyTGluZShsaW5lTm8pLmdldFBhcmVudCgpO1xuICAgICAgd2hpbGUgKGxpc3QgJiYgbGlzdC5nZXRQYXJlbnQoKSkge1xuICAgICAgICBjb25zdCBsaW5lTm8gPSByb290LmdldExpbmVOdW1iZXJPZihsaXN0KTtcbiAgICAgICAgZGl2LnByZXBlbmQoXG4gICAgICAgICAgY3JlYXRlVGl0bGUobGlzdC5nZXRDb250ZW50KCksICgpID0+XG4gICAgICAgICAgICB0aGlzLnpvb21JbihlZGl0b3IsIHsgbGluZTogbGluZU5vLCBjaDogMCB9KVxuICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICAgICAgZGl2LnByZXBlbmQoY3JlYXRlU2VwYXJhdG9yKCkpO1xuICAgICAgICBsaXN0ID0gbGlzdC5nZXRQYXJlbnQoKTtcbiAgICAgIH1cblxuICAgICAgZGl2LnByZXBlbmQoXG4gICAgICAgIGNyZWF0ZVRpdGxlKHRoaXMub2JzaWRpYW5VdGlscy5nZXRBY3RpdmVMZWFmRGlzcGxheVRleHQoKSwgKCkgPT5cbiAgICAgICAgICB0aGlzLnpvb21PdXQoZWRpdG9yKVxuICAgICAgICApXG4gICAgICApO1xuXG4gICAgICByZXR1cm4gZGl2O1xuICAgIH07XG5cbiAgICBjb25zdCB6b29tSGVhZGVyID0gY3JlYXRlSGVhZGVyKCk7XG4gICAgZWRpdG9yLmdldFdyYXBwZXJFbGVtZW50KCkucHJlcGVuZCh6b29tSGVhZGVyKTtcblxuICAgIHRoaXMuem9vbVN0YXRlcy5zZXQoXG4gICAgICBlZGl0b3IsXG4gICAgICBuZXcgWm9vbVN0YXRlKGVkaXRvci5nZXRMaW5lSGFuZGxlKGxpbmVObyksIHpvb21IZWFkZXIpXG4gICAgKTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBOb3RpY2UsIFBsdWdpbl8yIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBMaXN0VXRpbHMgfSBmcm9tIFwic3JjL2xpc3RfdXRpbHNcIjtcbmltcG9ydCB7IE9ic2lkaWFuVXRpbHMgfSBmcm9tIFwic3JjL29ic2lkaWFuX3V0aWxzXCI7XG5pbXBvcnQgeyBJRmVhdHVyZSB9IGZyb20gXCIuLi9mZWF0dXJlXCI7XG5cbmV4cG9ydCBjbGFzcyBGb2xkRmVhdHVyZSBpbXBsZW1lbnRzIElGZWF0dXJlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwbHVnaW46IFBsdWdpbl8yLFxuICAgIHByaXZhdGUgb2JzaWRpYW5VdGlsczogT2JzaWRpYW5VdGlscyxcbiAgICBwcml2YXRlIGxpc3RzVXRpbHM6IExpc3RVdGlsc1xuICApIHt9XG5cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcImZvbGRcIixcbiAgICAgIG5hbWU6IFwiRm9sZCB0aGUgbGlzdFwiLFxuICAgICAgY2FsbGJhY2s6IHRoaXMub2JzaWRpYW5VdGlscy5jcmVhdGVDb21tYW5kQ2FsbGJhY2sodGhpcy5mb2xkLmJpbmQodGhpcykpLFxuICAgICAgaG90a2V5czogW1xuICAgICAgICB7XG4gICAgICAgICAgbW9kaWZpZXJzOiBbXCJNb2RcIl0sXG4gICAgICAgICAga2V5OiBcIkFycm93VXBcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICB0aGlzLnBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcInVuZm9sZFwiLFxuICAgICAgbmFtZTogXCJVbmZvbGQgdGhlIGxpc3RcIixcbiAgICAgIGNhbGxiYWNrOiB0aGlzLm9ic2lkaWFuVXRpbHMuY3JlYXRlQ29tbWFuZENhbGxiYWNrKFxuICAgICAgICB0aGlzLnVuZm9sZC5iaW5kKHRoaXMpXG4gICAgICApLFxuICAgICAgaG90a2V5czogW1xuICAgICAgICB7XG4gICAgICAgICAgbW9kaWZpZXJzOiBbXCJNb2RcIl0sXG4gICAgICAgICAga2V5OiBcIkFycm93RG93blwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHVubG9hZCgpIHt9XG5cbiAgcHJpdmF0ZSBzZXRGb2xkKGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IsIHR5cGU6IFwiZm9sZFwiIHwgXCJ1bmZvbGRcIikge1xuICAgIGlmICghdGhpcy5saXN0c1V0aWxzLmlzQ3Vyc29ySW5MaXN0KGVkaXRvcikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMub2JzaWRpYW5VdGlscy5nZXRPYnNpZGlhbkZvbGRTZXR0aWducygpLmZvbGRJbmRlbnQpIHtcbiAgICAgIG5ldyBOb3RpY2UoXG4gICAgICAgIGBVbmFibGUgdG8gJHt0eXBlfSBiZWNhdXNlIGZvbGRpbmcgaXMgZGlzYWJsZWQuIFBsZWFzZSBlbmFibGUgXCJGb2xkIGluZGVudFwiIGluIE9ic2lkaWFuIHNldHRpbmdzLmAsXG4gICAgICAgIDUwMDBcbiAgICAgICk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAoZWRpdG9yIGFzIGFueSkuZm9sZENvZGUoZWRpdG9yLmdldEN1cnNvcigpLCBudWxsLCB0eXBlKTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSBmb2xkKGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IpIHtcbiAgICByZXR1cm4gdGhpcy5zZXRGb2xkKGVkaXRvciwgXCJmb2xkXCIpO1xuICB9XG5cbiAgcHJpdmF0ZSB1bmZvbGQoZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcikge1xuICAgIHJldHVybiB0aGlzLnNldEZvbGQoZWRpdG9yLCBcInVuZm9sZFwiKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUGx1Z2luXzIgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IExpc3RVdGlscyB9IGZyb20gXCJzcmMvbGlzdF91dGlsc1wiO1xuaW1wb3J0IHsgT2JzaWRpYW5VdGlscyB9IGZyb20gXCJzcmMvb2JzaWRpYW5fdXRpbHNcIjtcbmltcG9ydCB7IElGZWF0dXJlIH0gZnJvbSBcIi4uL2ZlYXR1cmVcIjtcblxuZXhwb3J0IGNsYXNzIFNlbGVjdEFsbEZlYXR1cmUgaW1wbGVtZW50cyBJRmVhdHVyZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcGx1Z2luOiBQbHVnaW5fMixcbiAgICBwcml2YXRlIG9ic2lkaWFuVXRpbHM6IE9ic2lkaWFuVXRpbHMsXG4gICAgcHJpdmF0ZSBsaXN0c1V0aWxzOiBMaXN0VXRpbHNcbiAgKSB7fVxuXG4gIGFzeW5jIGxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgICBpZDogXCJzZWxlY3QtYWxsXCIsXG4gICAgICBuYW1lOiBcIlNlbGVjdCBhIGxpc3QgaXRlbSBvciB0aGUgZW50aXJlIGxpc3RcIixcbiAgICAgIGNhbGxiYWNrOiB0aGlzLm9ic2lkaWFuVXRpbHMuY3JlYXRlQ29tbWFuZENhbGxiYWNrKFxuICAgICAgICB0aGlzLnNlbGVjdEFsbC5iaW5kKHRoaXMpXG4gICAgICApLFxuICAgICAgaG90a2V5czogW1xuICAgICAgICB7XG4gICAgICAgICAgbW9kaWZpZXJzOiBbXCJNb2RcIl0sXG4gICAgICAgICAga2V5OiBcImFcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyB1bmxvYWQoKSB7fVxuXG4gIHByaXZhdGUgc2VsZWN0QWxsKGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IpIHtcbiAgICBjb25zdCBzZWxlY3Rpb25zID0gZWRpdG9yLmxpc3RTZWxlY3Rpb25zKCk7XG5cbiAgICBpZiAoc2VsZWN0aW9ucy5sZW5ndGggIT09IDEpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBzZWxlY3Rpb24gPSBzZWxlY3Rpb25zWzBdO1xuXG4gICAgaWYgKHNlbGVjdGlvbi5hbmNob3IubGluZSAhPT0gc2VsZWN0aW9uLmhlYWQubGluZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHJvb3QgPSB0aGlzLmxpc3RzVXRpbHMucGFyc2VMaXN0KGVkaXRvciwgc2VsZWN0aW9uLmFuY2hvcik7XG5cbiAgICBpZiAoIXJvb3QpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBsaXN0ID0gcm9vdC5nZXRMaXN0VW5kZXJDdXJzb3IoKTtcbiAgICBjb25zdCBzdGFydENoID0gbGlzdC5nZXRDb250ZW50U3RhcnRDaCgpO1xuICAgIGNvbnN0IGVuZENoID0gbGlzdC5nZXRDb250ZW50RW5kQ2goKTtcblxuICAgIGlmIChzZWxlY3Rpb24uZnJvbSgpLmNoID09PSBzdGFydENoICYmIHNlbGVjdGlvbi50bygpLmNoID09PSBlbmRDaCkge1xuICAgICAgLy8gc2VsZWN0IGFsbCBsaXN0XG4gICAgICBlZGl0b3Iuc2V0U2VsZWN0aW9uKFxuICAgICAgICByb290LmdldExpc3RTdGFydFBvc2l0aW9uKCksXG4gICAgICAgIHJvb3QuZ2V0TGlzdEVuZFBvc2l0aW9uKClcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHNlbGVjdCBhbGwgbGluZVxuICAgICAgZWRpdG9yLnNldFNlbGVjdGlvbihcbiAgICAgICAge1xuICAgICAgICAgIGxpbmU6IHNlbGVjdGlvbi5hbmNob3IubGluZSxcbiAgICAgICAgICBjaDogc3RhcnRDaCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGxpbmU6IHNlbGVjdGlvbi5hbmNob3IubGluZSxcbiAgICAgICAgICBjaDogZW5kQ2gsXG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cbiIsImltcG9ydCB7IFBsdWdpbl8yIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBMaXN0VXRpbHMgfSBmcm9tIFwic3JjL2xpc3RfdXRpbHNcIjtcbmltcG9ydCB7IE9ic2lkaWFuVXRpbHMgfSBmcm9tIFwic3JjL29ic2lkaWFuX3V0aWxzXCI7XG5pbXBvcnQgeyBSb290IH0gZnJvbSBcInNyYy9yb290XCI7XG5pbXBvcnQgeyBJRmVhdHVyZSB9IGZyb20gXCIuLi9mZWF0dXJlXCI7XG5cbmV4cG9ydCBjbGFzcyBNb3ZlSXRlbXNGZWF0dXJlIGltcGxlbWVudHMgSUZlYXR1cmUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBvYnNpZGlhblV0aWxzOiBPYnNpZGlhblV0aWxzLFxuICAgIHByaXZhdGUgbGlzdHNVdGlsczogTGlzdFV0aWxzXG4gICkge31cblxuICBhc3luYyBsb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwibW92ZS1saXN0LWl0ZW0tdXBcIixcbiAgICAgIG5hbWU6IFwiTW92ZSBsaXN0IGFuZCBzdWJsaXN0cyB1cFwiLFxuICAgICAgY2FsbGJhY2s6IHRoaXMub2JzaWRpYW5VdGlscy5jcmVhdGVDb21tYW5kQ2FsbGJhY2soXG4gICAgICAgIHRoaXMubW92ZUxpc3RFbGVtZW50VXAuYmluZCh0aGlzKVxuICAgICAgKSxcbiAgICAgIGhvdGtleXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sXG4gICAgICAgICAga2V5OiBcIkFycm93VXBcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICB0aGlzLnBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcIm1vdmUtbGlzdC1pdGVtLWRvd25cIixcbiAgICAgIG5hbWU6IFwiTW92ZSBsaXN0IGFuZCBzdWJsaXN0cyBkb3duXCIsXG4gICAgICBjYWxsYmFjazogdGhpcy5vYnNpZGlhblV0aWxzLmNyZWF0ZUNvbW1hbmRDYWxsYmFjayhcbiAgICAgICAgdGhpcy5tb3ZlTGlzdEVsZW1lbnREb3duLmJpbmQodGhpcylcbiAgICAgICksXG4gICAgICBob3RrZXlzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBtb2RpZmllcnM6IFtcIk1vZFwiLCBcIlNoaWZ0XCJdLFxuICAgICAgICAgIGtleTogXCJBcnJvd0Rvd25cIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICB0aGlzLnBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcImluZGVudC1saXN0XCIsXG4gICAgICBuYW1lOiBcIkluZGVudCB0aGUgbGlzdCBhbmQgc3VibGlzdHNcIixcbiAgICAgIGNhbGxiYWNrOiB0aGlzLm9ic2lkaWFuVXRpbHMuY3JlYXRlQ29tbWFuZENhbGxiYWNrKFxuICAgICAgICB0aGlzLm1vdmVMaXN0RWxlbWVudFJpZ2h0LmJpbmQodGhpcylcbiAgICAgICksXG4gICAgICBob3RrZXlzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBtb2RpZmllcnM6IFtdLFxuICAgICAgICAgIGtleTogXCJUYWJcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICB0aGlzLnBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcIm91dGRlbnQtbGlzdFwiLFxuICAgICAgbmFtZTogXCJPdXRkZW50IHRoZSBsaXN0IGFuZCBzdWJsaXN0c1wiLFxuICAgICAgY2FsbGJhY2s6IHRoaXMub2JzaWRpYW5VdGlscy5jcmVhdGVDb21tYW5kQ2FsbGJhY2soXG4gICAgICAgIHRoaXMubW92ZUxpc3RFbGVtZW50TGVmdC5iaW5kKHRoaXMpXG4gICAgICApLFxuICAgICAgaG90a2V5czogW1xuICAgICAgICB7XG4gICAgICAgICAgbW9kaWZpZXJzOiBbXCJTaGlmdFwiXSxcbiAgICAgICAgICBrZXk6IFwiVGFiXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdW5sb2FkKCkge31cblxuICBwcml2YXRlIGV4ZWN1dGUoXG4gICAgZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcixcbiAgICBjYjogKHJvb3Q6IFJvb3QpID0+IGJvb2xlYW5cbiAgKTogYm9vbGVhbiB7XG4gICAgY29uc3Qgcm9vdCA9IHRoaXMubGlzdHNVdGlscy5wYXJzZUxpc3QoZWRpdG9yLCBlZGl0b3IuZ2V0Q3Vyc29yKCkpO1xuXG4gICAgaWYgKCFyb290KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gY2Iocm9vdCk7XG5cbiAgICBpZiAocmVzdWx0KSB7XG4gICAgICB0aGlzLmxpc3RzVXRpbHMuYXBwbHlDaGFuZ2VzKGVkaXRvciwgcm9vdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgbW92ZUxpc3RFbGVtZW50RG93bihlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZShlZGl0b3IsIChyb290KSA9PiByb290Lm1vdmVEb3duKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBtb3ZlTGlzdEVsZW1lbnRVcChlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZShlZGl0b3IsIChyb290KSA9PiByb290Lm1vdmVVcCgpKTtcbiAgfVxuXG4gIHByaXZhdGUgbW92ZUxpc3RFbGVtZW50UmlnaHQoZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcikge1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dGUoZWRpdG9yLCAocm9vdCkgPT4gcm9vdC5tb3ZlUmlnaHQoKSk7XG4gIH1cblxuICBwcml2YXRlIG1vdmVMaXN0RWxlbWVudExlZnQoZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcikge1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dGUoZWRpdG9yLCAocm9vdCkgPT4gcm9vdC5tb3ZlTGVmdCgpKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUGx1Z2luIH0gZnJvbSBcIm9ic2lkaWFuXCI7XHJcbmltcG9ydCB7IE9ic2lkaWFuT3V0bGluZXJQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5ncyB9IGZyb20gXCIuL3NldHRpbmdzXCI7XHJcbmltcG9ydCB7IElGZWF0dXJlIH0gZnJvbSBcIi4vZmVhdHVyZVwiO1xyXG5pbXBvcnQgeyBPYnNpZGlhblV0aWxzIH0gZnJvbSBcIi4vb2JzaWRpYW5fdXRpbHNcIjtcclxuaW1wb3J0IHsgRWRpdG9yVXRpbHMgfSBmcm9tIFwiLi9lZGl0b3JfdXRpbHNcIjtcclxuaW1wb3J0IHsgTGlzdFV0aWxzIH0gZnJvbSBcIi4vbGlzdF91dGlsc1wiO1xyXG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tIFwiLi9sb2dnZXJcIjtcclxuaW1wb3J0IHsgTGlzdHNTdHlsZXNGZWF0dXJlIH0gZnJvbSBcIi4vZmVhdHVyZXMvTGlzdHNTdHlsZXNGZWF0dXJlXCI7XHJcbmltcG9ydCB7IEVudGVyT3V0ZGVudElmTGluZUlzRW1wdHlGZWF0dXJlIH0gZnJvbSBcIi4vZmVhdHVyZXMvRW50ZXJPdXRkZW50SWZMaW5lSXNFbXB0eUZlYXR1cmVcIjtcclxuaW1wb3J0IHsgRW50ZXJTaG91bGRDcmVhdGVOZXdsaW5lT25DaGlsZExldmVsRmVhdHVyZSB9IGZyb20gXCIuL2ZlYXR1cmVzL0VudGVyU2hvdWxkQ3JlYXRlTmV3bGluZU9uQ2hpbGRMZXZlbEZlYXR1cmVcIjtcclxuaW1wb3J0IHsgTW92ZUN1cnNvclRvUHJldmlvdXNVbmZvbGRlZExpbmVGZWF0dXJlIH0gZnJvbSBcIi4vZmVhdHVyZXMvTW92ZUN1cnNvclRvUHJldmlvdXNVbmZvbGRlZExpbmVGZWF0dXJlXCI7XHJcbmltcG9ydCB7IEVuc3VyZUN1cnNvckluTGlzdENvbnRlbnRGZWF0dXJlIH0gZnJvbSBcIi4vZmVhdHVyZXMvRW5zdXJlQ3Vyc29ySW5MaXN0Q29udGVudEZlYXR1cmVcIjtcclxuaW1wb3J0IHsgRGVsZXRlU2hvdWxkSWdub3JlQnVsbGV0c0ZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9EZWxldGVTaG91bGRJZ25vcmVCdWxsZXRzRmVhdHVyZVwiO1xyXG5pbXBvcnQgeyBTZWxlY3Rpb25TaG91bGRJZ25vcmVCdWxsZXRzRmVhdHVyZSB9IGZyb20gXCIuL2ZlYXR1cmVzL1NlbGVjdGlvblNob3VsZElnbm9yZUJ1bGxldHNGZWF0dXJlXCI7XHJcbmltcG9ydCB7IFpvb21GZWF0dXJlIH0gZnJvbSBcIi4vZmVhdHVyZXMvWm9vbUZlYXR1cmVcIjtcclxuaW1wb3J0IHsgRm9sZEZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9Gb2xkRmVhdHVyZVwiO1xyXG5pbXBvcnQgeyBTZWxlY3RBbGxGZWF0dXJlIH0gZnJvbSBcIi4vZmVhdHVyZXMvU2VsZWN0QWxsRmVhdHVyZVwiO1xyXG5pbXBvcnQgeyBNb3ZlSXRlbXNGZWF0dXJlIH0gZnJvbSBcIi4vZmVhdHVyZXMvTW92ZUl0ZW1zRmVhdHVyZVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT2JzaWRpYW5PdXRsaW5lclBsdWdpbiBleHRlbmRzIFBsdWdpbiB7XHJcbiAgcHJpdmF0ZSBmZWF0dXJlczogSUZlYXR1cmVbXTtcclxuICBwcml2YXRlIHNldHRpbmdzOiBTZXR0aW5ncztcclxuICBwcml2YXRlIGxvZ2dlcjogTG9nZ2VyO1xyXG4gIHByaXZhdGUgb2JzaWRpYW5VdGlsczogT2JzaWRpYW5VdGlscztcclxuICBwcml2YXRlIGVkaXRvclV0aWxzOiBFZGl0b3JVdGlscztcclxuICBwcml2YXRlIGxpc3RzVXRpbHM6IExpc3RVdGlscztcclxuXHJcbiAgYXN5bmMgb25sb2FkKCkge1xyXG4gICAgY29uc29sZS5sb2coYExvYWRpbmcgb2JzaWRpYW4tb3V0bGluZXJgKTtcclxuXHJcbiAgICB0aGlzLnNldHRpbmdzID0gbmV3IFNldHRpbmdzKHRoaXMpO1xyXG4gICAgYXdhaXQgdGhpcy5zZXR0aW5ncy5sb2FkKCk7XHJcblxyXG4gICAgdGhpcy5sb2dnZXIgPSBuZXcgTG9nZ2VyKHRoaXMuc2V0dGluZ3MpO1xyXG5cclxuICAgIHRoaXMub2JzaWRpYW5VdGlscyA9IG5ldyBPYnNpZGlhblV0aWxzKHRoaXMuYXBwKTtcclxuICAgIHRoaXMuZWRpdG9yVXRpbHMgPSBuZXcgRWRpdG9yVXRpbHMoKTtcclxuICAgIHRoaXMubGlzdHNVdGlscyA9IG5ldyBMaXN0VXRpbHModGhpcy5sb2dnZXIsIHRoaXMub2JzaWRpYW5VdGlscyk7XHJcblxyXG4gICAgdGhpcy5hZGRTZXR0aW5nVGFiKFxyXG4gICAgICBuZXcgT2JzaWRpYW5PdXRsaW5lclBsdWdpblNldHRpbmdUYWIodGhpcy5hcHAsIHRoaXMsIHRoaXMuc2V0dGluZ3MpXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMuZmVhdHVyZXMgPSBbXHJcbiAgICAgIG5ldyBMaXN0c1N0eWxlc0ZlYXR1cmUodGhpcywgdGhpcy5zZXR0aW5ncywgdGhpcy5vYnNpZGlhblV0aWxzKSxcclxuICAgICAgbmV3IEVudGVyT3V0ZGVudElmTGluZUlzRW1wdHlGZWF0dXJlKFxyXG4gICAgICAgIHRoaXMsXHJcbiAgICAgICAgdGhpcy5zZXR0aW5ncyxcclxuICAgICAgICB0aGlzLmVkaXRvclV0aWxzLFxyXG4gICAgICAgIHRoaXMubGlzdHNVdGlsc1xyXG4gICAgICApLFxyXG4gICAgICBuZXcgRW50ZXJTaG91bGRDcmVhdGVOZXdsaW5lT25DaGlsZExldmVsRmVhdHVyZShcclxuICAgICAgICB0aGlzLFxyXG4gICAgICAgIHRoaXMuc2V0dGluZ3MsXHJcbiAgICAgICAgdGhpcy5saXN0c1V0aWxzXHJcbiAgICAgICksXHJcbiAgICAgIG5ldyBFbnN1cmVDdXJzb3JJbkxpc3RDb250ZW50RmVhdHVyZShcclxuICAgICAgICB0aGlzLFxyXG4gICAgICAgIHRoaXMuc2V0dGluZ3MsXHJcbiAgICAgICAgdGhpcy5lZGl0b3JVdGlscyxcclxuICAgICAgICB0aGlzLmxpc3RzVXRpbHNcclxuICAgICAgKSxcclxuICAgICAgbmV3IE1vdmVDdXJzb3JUb1ByZXZpb3VzVW5mb2xkZWRMaW5lRmVhdHVyZShcclxuICAgICAgICB0aGlzLFxyXG4gICAgICAgIHRoaXMuc2V0dGluZ3MsXHJcbiAgICAgICAgdGhpcy5saXN0c1V0aWxzXHJcbiAgICAgICksXHJcbiAgICAgIG5ldyBEZWxldGVTaG91bGRJZ25vcmVCdWxsZXRzRmVhdHVyZShcclxuICAgICAgICB0aGlzLFxyXG4gICAgICAgIHRoaXMuc2V0dGluZ3MsXHJcbiAgICAgICAgdGhpcy5lZGl0b3JVdGlscyxcclxuICAgICAgICB0aGlzLmxpc3RzVXRpbHNcclxuICAgICAgKSxcclxuICAgICAgbmV3IFNlbGVjdGlvblNob3VsZElnbm9yZUJ1bGxldHNGZWF0dXJlKFxyXG4gICAgICAgIHRoaXMsXHJcbiAgICAgICAgdGhpcy5zZXR0aW5ncyxcclxuICAgICAgICB0aGlzLmxpc3RzVXRpbHNcclxuICAgICAgKSxcclxuICAgICAgbmV3IFpvb21GZWF0dXJlKHRoaXMsIHRoaXMuc2V0dGluZ3MsIHRoaXMub2JzaWRpYW5VdGlscywgdGhpcy5saXN0c1V0aWxzKSxcclxuICAgICAgbmV3IEZvbGRGZWF0dXJlKHRoaXMsIHRoaXMub2JzaWRpYW5VdGlscywgdGhpcy5saXN0c1V0aWxzKSxcclxuICAgICAgbmV3IFNlbGVjdEFsbEZlYXR1cmUodGhpcywgdGhpcy5vYnNpZGlhblV0aWxzLCB0aGlzLmxpc3RzVXRpbHMpLFxyXG4gICAgICBuZXcgTW92ZUl0ZW1zRmVhdHVyZSh0aGlzLCB0aGlzLm9ic2lkaWFuVXRpbHMsIHRoaXMubGlzdHNVdGlscyksXHJcbiAgICBdO1xyXG5cclxuICAgIGZvciAoY29uc3QgZmVhdHVyZSBvZiB0aGlzLmZlYXR1cmVzKSB7XHJcbiAgICAgIGF3YWl0IGZlYXR1cmUubG9hZCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgb251bmxvYWQoKSB7XHJcbiAgICBjb25zb2xlLmxvZyhgVW5sb2FkaW5nIG9ic2lkaWFuLW91dGxpbmVyYCk7XHJcblxyXG4gICAgZm9yIChjb25zdCBmZWF0dXJlIG9mIHRoaXMuZmVhdHVyZXMpIHtcclxuICAgICAgYXdhaXQgZmVhdHVyZS51bmxvYWQoKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbIlBsdWdpblNldHRpbmdUYWIiLCJTZXR0aW5nIiwiTWFya2Rvd25WaWV3IiwiTm90aWNlIiwiUGx1Z2luIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXVEQTtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FB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
