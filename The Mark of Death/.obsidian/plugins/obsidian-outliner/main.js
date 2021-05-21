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
    selectAll: true,
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
    get selectAll() {
        return this.values.selectAll;
    }
    set selectAll(value) {
        this.set("selectAll", value);
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
            .setName("Enhance the Ctrl+A or Cmd+A behavior")
            .setDesc("Press the hotkey once to select the current list item. Press the hotkey twice to select the entire list.")
            .addToggle((toggle) => {
            toggle.setValue(this.settings.selectAll).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.settings.selectAll = value;
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
    copy(override = {}) {
        const { indentSign, bullet, content, folded } = Object.assign({ indentSign: this.indentSign, bullet: this.bullet, content: this.content, folded: this.folded }, override);
        return new List(indentSign, bullet, content, folded);
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
    createNewlineOnChildLevel() {
        const list = this.getListUnderCursor();
        if (list.isEmpty()) {
            return false;
        }
        if (this.cursor.ch !== list.getContentEndCh()) {
            return false;
        }
        const newList = list.getChildren()[0].copy({ content: "", folded: false });
        list.addBeforeAll(newList);
        this.cursor.line = this.getLineNumberOf(newList);
        this.cursor.ch = newList.getContentStartCh();
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
        let changeFrom = root.getListStartPosition();
        let changeTo = root.getListEndPosition();
        let oldTmp = oldString;
        let newTmp = newString;
        while (true) {
            const nlIndex = oldTmp.indexOf("\n");
            if (nlIndex < 0) {
                break;
            }
            const oldLine = oldTmp.slice(0, nlIndex + 1);
            const newLine = newTmp.slice(0, oldLine.length);
            if (oldLine !== newLine) {
                break;
            }
            changeFrom.line++;
            oldTmp = oldTmp.slice(oldLine.length);
            newTmp = newTmp.slice(oldLine.length);
        }
        while (true) {
            const nlIndex = oldTmp.lastIndexOf("\n");
            if (nlIndex < 0) {
                break;
            }
            const oldLine = oldTmp.slice(nlIndex);
            const newLine = newTmp.slice(-oldLine.length);
            if (oldLine !== newLine) {
                break;
            }
            oldTmp = oldTmp.slice(0, -oldLine.length);
            newTmp = newTmp.slice(0, -oldLine.length);
            const nlIndex2 = oldTmp.lastIndexOf("\n");
            changeTo.ch =
                nlIndex2 >= 0 ? oldTmp.length - nlIndex2 - 1 : oldTmp.length;
            changeTo.line--;
        }
        if (oldTmp !== newTmp) {
            editor.replaceRange(newTmp, changeFrom, changeTo);
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

function isEnter$1(e) {
    return ((e.keyCode === 13 || e.code === "Enter") &&
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
            if (!this.settings.betterEnter || !isEnter$1(e)) {
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

function isEnter(e) {
    return ((e.keyCode === 13 || e.code === "Enter") &&
        e.shiftKey === false &&
        e.metaKey === false &&
        e.altKey === false &&
        e.ctrlKey === false);
}
class EnterShouldCreateNewlineOnChildLevelFeature {
    constructor(plugin, settings, editorUtils, listUtils) {
        this.plugin = plugin;
        this.settings = settings;
        this.editorUtils = editorUtils;
        this.listUtils = listUtils;
        this.onKeyDown = (cm, e) => {
            if (!this.settings.betterEnter ||
                !isEnter(e) ||
                !this.editorUtils.containsSingleCursor(cm)) {
                return;
            }
            const root = this.listUtils.parseList(cm);
            if (!root) {
                return;
            }
            const worked = root.createNewlineOnChildLevel();
            if (worked) {
                e.preventDefault();
                e.stopPropagation();
                this.listUtils.applyChanges(cm, root);
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

function isCmdA(e) {
    return ((e.keyCode === 65 || e.code === "KeyA") &&
        e.shiftKey === false &&
        e.metaKey === true &&
        e.altKey === false &&
        e.ctrlKey === false);
}
function isCtrlA(e) {
    return ((e.keyCode === 65 || e.code === "KeyA") &&
        e.shiftKey === false &&
        e.metaKey === false &&
        e.altKey === false &&
        e.ctrlKey === true);
}
function isSelectAll(e) {
    return process.platform === "darwin" ? isCmdA(e) : isCtrlA(e);
}
class SelectAllFeature {
    constructor(plugin, settings, listsUtils) {
        this.plugin = plugin;
        this.settings = settings;
        this.listsUtils = listsUtils;
        this.onKeyDown = (cm, event) => {
            if (!this.settings.selectAll || !isSelectAll(event)) {
                return;
            }
            const worked = this.selectAll(cm);
            if (worked) {
                event.preventDefault();
                event.stopPropagation();
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
                new EnterShouldCreateNewlineOnChildLevelFeature(this, this.settings, this.editorUtils, this.listsUtils),
                new EnsureCursorInListContentFeature(this, this.settings, this.editorUtils, this.listsUtils),
                new MoveCursorToPreviousUnfoldedLineFeature(this, this.settings, this.listsUtils),
                new DeleteShouldIgnoreBulletsFeature(this, this.settings, this.editorUtils, this.listsUtils),
                new SelectionShouldIgnoreBulletsFeature(this, this.settings, this.listsUtils),
                new ZoomFeature(this, this.settings, this.obsidianUtils, this.listsUtils),
                new FoldFeature(this, this.obsidianUtils, this.listsUtils),
                new SelectAllFeature(this, this.settings, this.listsUtils),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy9zZXR0aW5ncy50cyIsInNyYy9vYnNpZGlhbl91dGlscy50cyIsInNyYy9lZGl0b3JfdXRpbHMudHMiLCJzcmMvcm9vdC50cyIsInNyYy9saXN0X3V0aWxzLnRzIiwic3JjL2xvZ2dlci50cyIsInNyYy9mZWF0dXJlcy9MaXN0c1N0eWxlc0ZlYXR1cmUudHMiLCJzcmMvZmVhdHVyZXMvRW50ZXJPdXRkZW50SWZMaW5lSXNFbXB0eUZlYXR1cmUudHMiLCJzcmMvZmVhdHVyZXMvRW50ZXJTaG91bGRDcmVhdGVOZXdsaW5lT25DaGlsZExldmVsRmVhdHVyZS50cyIsInNyYy9mZWF0dXJlcy9Nb3ZlQ3Vyc29yVG9QcmV2aW91c1VuZm9sZGVkTGluZUZlYXR1cmUudHMiLCJzcmMvZmVhdHVyZXMvRW5zdXJlQ3Vyc29ySW5MaXN0Q29udGVudEZlYXR1cmUudHMiLCJzcmMvZmVhdHVyZXMvRGVsZXRlU2hvdWxkSWdub3JlQnVsbGV0c0ZlYXR1cmUudHMiLCJzcmMvZmVhdHVyZXMvU2VsZWN0aW9uU2hvdWxkSWdub3JlQnVsbGV0c0ZlYXR1cmUudHMiLCJzcmMvZmVhdHVyZXMvWm9vbUZlYXR1cmUudHMiLCJzcmMvZmVhdHVyZXMvRm9sZEZlYXR1cmUudHMiLCJzcmMvZmVhdHVyZXMvU2VsZWN0QWxsRmVhdHVyZS50cyIsInNyYy9mZWF0dXJlcy9Nb3ZlSXRlbXNGZWF0dXJlLnRzIiwic3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxyXG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXHJcblxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxyXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXHJcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxyXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXHJcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fY3JlYXRlQmluZGluZyA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgbykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBwKSkgX19jcmVhdGVCaW5kaW5nKG8sIG0sIHApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXlzKCkge1xyXG4gICAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciByID0gQXJyYXkocyksIGsgPSAwLCBpID0gMDsgaSA8IGlsOyBpKyspXHJcbiAgICAgICAgZm9yICh2YXIgYSA9IGFyZ3VtZW50c1tpXSwgaiA9IDAsIGpsID0gYS5sZW5ndGg7IGogPCBqbDsgaisrLCBrKyspXHJcbiAgICAgICAgICAgIHJba10gPSBhW2pdO1xyXG4gICAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5KHRvLCBmcm9tKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBmcm9tLmxlbmd0aCwgaiA9IHRvLmxlbmd0aDsgaSA8IGlsOyBpKyssIGorKylcclxuICAgICAgICB0b1tqXSA9IGZyb21baV07XHJcbiAgICByZXR1cm4gdG87XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcclxufSkgOiBmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcclxuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRHZXQocmVjZWl2ZXIsIHN0YXRlLCBraW5kLCBmKSB7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBnZXR0ZXJcIik7XHJcbiAgICBpZiAodHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciAhPT0gc3RhdGUgfHwgIWYgOiAhc3RhdGUuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCByZWFkIHByaXZhdGUgbWVtYmVyIGZyb20gYW4gb2JqZWN0IHdob3NlIGNsYXNzIGRpZCBub3QgZGVjbGFyZSBpdFwiKTtcclxuICAgIHJldHVybiBraW5kID09PSBcIm1cIiA/IGYgOiBraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlcikgOiBmID8gZi52YWx1ZSA6IHN0YXRlLmdldChyZWNlaXZlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBzdGF0ZSwgdmFsdWUsIGtpbmQsIGYpIHtcclxuICAgIGlmIChraW5kID09PSBcIm1cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgbWV0aG9kIGlzIG5vdCB3cml0YWJsZVwiKTtcclxuICAgIGlmIChraW5kID09PSBcImFcIiAmJiAhZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgYWNjZXNzb3Igd2FzIGRlZmluZWQgd2l0aG91dCBhIHNldHRlclwiKTtcclxuICAgIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHdyaXRlIHByaXZhdGUgbWVtYmVyIHRvIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XHJcbiAgICByZXR1cm4gKGtpbmQgPT09IFwiYVwiID8gZi5jYWxsKHJlY2VpdmVyLCB2YWx1ZSkgOiBmID8gZi52YWx1ZSA9IHZhbHVlIDogc3RhdGUuc2V0KHJlY2VpdmVyLCB2YWx1ZSkpLCB2YWx1ZTtcclxufVxyXG4iLCJpbXBvcnQgeyBBcHAsIFBsdWdpblNldHRpbmdUYWIsIFBsdWdpbl8yLCBTZXR0aW5nIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgT2JzaWRpYW5PdXRsaW5lclBsdWdpblNldHRpbmdzIHtcbiAgc3R5bGVMaXN0czogYm9vbGVhbjtcbiAgZGVidWc6IGJvb2xlYW47XG4gIHN0aWNrQ3Vyc29yOiBib29sZWFuO1xuICBiZXR0ZXJFbnRlcjogYm9vbGVhbjtcbiAgc2VsZWN0QWxsOiBib29sZWFuO1xuICB6b29tT25DbGljazogYm9vbGVhbjtcbn1cblxuY29uc3QgREVGQVVMVF9TRVRUSU5HUzogT2JzaWRpYW5PdXRsaW5lclBsdWdpblNldHRpbmdzID0ge1xuICBzdHlsZUxpc3RzOiBmYWxzZSxcbiAgZGVidWc6IGZhbHNlLFxuICBzdGlja0N1cnNvcjogdHJ1ZSxcbiAgYmV0dGVyRW50ZXI6IHRydWUsXG4gIHNlbGVjdEFsbDogdHJ1ZSxcbiAgem9vbU9uQ2xpY2s6IHRydWUsXG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0b3JhZ2Uge1xuICBsb2FkRGF0YSgpOiBQcm9taXNlPE9ic2lkaWFuT3V0bGluZXJQbHVnaW5TZXR0aW5ncz47XG4gIHNhdmVEYXRhKHNldHRpZ25zOiBPYnNpZGlhbk91dGxpbmVyUGx1Z2luU2V0dGluZ3MpOiBQcm9taXNlPHZvaWQ+O1xufVxuXG50eXBlIEsgPSBrZXlvZiBPYnNpZGlhbk91dGxpbmVyUGx1Z2luU2V0dGluZ3M7XG50eXBlIFY8VCBleHRlbmRzIEs+ID0gT2JzaWRpYW5PdXRsaW5lclBsdWdpblNldHRpbmdzW1RdO1xudHlwZSBDYWxsYmFjazxUIGV4dGVuZHMgSz4gPSAoY2I6IFY8VD4pID0+IHZvaWQ7XG5cbmV4cG9ydCBjbGFzcyBTZXR0aW5ncyBpbXBsZW1lbnRzIE9ic2lkaWFuT3V0bGluZXJQbHVnaW5TZXR0aW5ncyB7XG4gIHByaXZhdGUgc3RvcmFnZTogU3RvcmFnZTtcbiAgcHJpdmF0ZSB2YWx1ZXM6IE9ic2lkaWFuT3V0bGluZXJQbHVnaW5TZXR0aW5ncztcbiAgcHJpdmF0ZSBoYW5kbGVyczogTWFwPEssIFNldDxDYWxsYmFjazxLPj4+O1xuXG4gIGNvbnN0cnVjdG9yKHN0b3JhZ2U6IFN0b3JhZ2UpIHtcbiAgICB0aGlzLnN0b3JhZ2UgPSBzdG9yYWdlO1xuICAgIHRoaXMuaGFuZGxlcnMgPSBuZXcgTWFwKCk7XG4gIH1cblxuICBnZXQgc3R5bGVMaXN0cygpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZXMuc3R5bGVMaXN0cztcbiAgfVxuICBzZXQgc3R5bGVMaXN0cyh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuc2V0KFwic3R5bGVMaXN0c1wiLCB2YWx1ZSk7XG4gIH1cblxuICBnZXQgZGVidWcoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWVzLmRlYnVnO1xuICB9XG4gIHNldCBkZWJ1Zyh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuc2V0KFwiZGVidWdcIiwgdmFsdWUpO1xuICB9XG5cbiAgZ2V0IHN0aWNrQ3Vyc29yKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlcy5zdGlja0N1cnNvcjtcbiAgfVxuICBzZXQgc3RpY2tDdXJzb3IodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLnNldChcInN0aWNrQ3Vyc29yXCIsIHZhbHVlKTtcbiAgfVxuXG4gIGdldCBiZXR0ZXJFbnRlcigpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZXMuYmV0dGVyRW50ZXI7XG4gIH1cbiAgc2V0IGJldHRlckVudGVyKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5zZXQoXCJiZXR0ZXJFbnRlclwiLCB2YWx1ZSk7XG4gIH1cblxuICBnZXQgc2VsZWN0QWxsKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlcy5zZWxlY3RBbGw7XG4gIH1cbiAgc2V0IHNlbGVjdEFsbCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuc2V0KFwic2VsZWN0QWxsXCIsIHZhbHVlKTtcbiAgfVxuXG4gIGdldCB6b29tT25DbGljaygpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZXMuem9vbU9uQ2xpY2s7XG4gIH1cbiAgc2V0IHpvb21PbkNsaWNrKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5zZXQoXCJ6b29tT25DbGlja1wiLCB2YWx1ZSk7XG4gIH1cblxuICBvbkNoYW5nZTxUIGV4dGVuZHMgSz4oa2V5OiBULCBjYjogQ2FsbGJhY2s8VD4pIHtcbiAgICBpZiAoIXRoaXMuaGFuZGxlcnMuaGFzKGtleSkpIHtcbiAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KGtleSwgbmV3IFNldCgpKTtcbiAgICB9XG5cbiAgICB0aGlzLmhhbmRsZXJzLmdldChrZXkpLmFkZChjYik7XG4gIH1cblxuICByZW1vdmVDYWxsYmFjazxUIGV4dGVuZHMgSz4oa2V5OiBULCBjYjogQ2FsbGJhY2s8VD4pOiB2b2lkIHtcbiAgICBjb25zdCBoYW5kbGVycyA9IHRoaXMuaGFuZGxlcnMuZ2V0KGtleSk7XG5cbiAgICBpZiAoaGFuZGxlcnMpIHtcbiAgICAgIGhhbmRsZXJzLmRlbGV0ZShjYik7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICB0aGlzLnZhbHVlcyA9IE9iamVjdC5hc3NpZ24oXG4gICAgICB7fSxcbiAgICAgIERFRkFVTFRfU0VUVElOR1MsXG4gICAgICBhd2FpdCB0aGlzLnN0b3JhZ2UubG9hZERhdGEoKVxuICAgICk7XG4gIH1cblxuICBhc3luYyBzYXZlKCkge1xuICAgIGF3YWl0IHRoaXMuc3RvcmFnZS5zYXZlRGF0YSh0aGlzLnZhbHVlcyk7XG4gIH1cblxuICBwcml2YXRlIHNldDxUIGV4dGVuZHMgSz4oa2V5OiBULCB2YWx1ZTogVjxLPik6IHZvaWQge1xuICAgIHRoaXMudmFsdWVzW2tleV0gPSB2YWx1ZTtcbiAgICBjb25zdCBjYWxsYmFja3MgPSB0aGlzLmhhbmRsZXJzLmdldChrZXkpO1xuXG4gICAgaWYgKCFjYWxsYmFja3MpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGNiIG9mIGNhbGxiYWNrcy52YWx1ZXMoKSkge1xuICAgICAgY2IodmFsdWUpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgT2JzaWRpYW5PdXRsaW5lclBsdWdpblNldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogUGx1Z2luXzIsIHByaXZhdGUgc2V0dGluZ3M6IFNldHRpbmdzKSB7XG4gICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xuICB9XG5cbiAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICBjb25zdCB7IGNvbnRhaW5lckVsIH0gPSB0aGlzO1xuXG4gICAgY29udGFpbmVyRWwuZW1wdHkoKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJJbXByb3ZlIHRoZSBzdHlsZSBvZiB5b3VyIGxpc3RzXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJTdHlsZXMgYXJlIG9ubHkgY29tcGF0aWJsZSB3aXRoIGJ1aWx0LWluIE9ic2lkaWFuIHRoZW1lcyBhbmQgbWF5IG5vdCBiZSBjb21wYXRpYmxlIHdpdGggb3RoZXIgdGhlbWVzLiBTdHlsZXMgb25seSB3b3JrIHdlbGwgd2l0aCBzcGFjZXMgb3IgZm91ci1zcGFjZSB0YWJzLlwiXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMuc2V0dGluZ3Muc3R5bGVMaXN0cykub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy5zdHlsZUxpc3RzID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5zZXR0aW5ncy5zYXZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiU3RpY2sgdGhlIGN1cnNvciB0byB0aGUgY29udGVudFwiKVxuICAgICAgLnNldERlc2MoXCJEb24ndCBsZXQgdGhlIGN1cnNvciBtb3ZlIHRvIHRoZSBidWxsZXQgcG9zaXRpb24uXCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMuc2V0dGluZ3Muc3RpY2tDdXJzb3IpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0dGluZ3Muc3RpY2tDdXJzb3IgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnNldHRpbmdzLnNhdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJFbmhhbmNlIHRoZSBFbnRlciBrZXlcIilcbiAgICAgIC5zZXREZXNjKFwiTWFrZSB0aGUgRW50ZXIga2V5IGJlaGF2ZSB0aGUgc2FtZSBhcyBvdGhlciBvdXRsaW5lcnMuXCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMuc2V0dGluZ3MuYmV0dGVyRW50ZXIpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0dGluZ3MuYmV0dGVyRW50ZXIgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnNldHRpbmdzLnNhdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJFbmhhbmNlIHRoZSBDdHJsK0Egb3IgQ21kK0EgYmVoYXZpb3JcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIlByZXNzIHRoZSBob3RrZXkgb25jZSB0byBzZWxlY3QgdGhlIGN1cnJlbnQgbGlzdCBpdGVtLiBQcmVzcyB0aGUgaG90a2V5IHR3aWNlIHRvIHNlbGVjdCB0aGUgZW50aXJlIGxpc3QuXCJcbiAgICAgIClcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT4ge1xuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5zZXR0aW5ncy5zZWxlY3RBbGwpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0dGluZ3Muc2VsZWN0QWxsID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5zZXR0aW5ncy5zYXZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiWm9vbWluZyBpbiB3aGVuIGNsaWNraW5nIG9uIHRoZSBidWxsZXRcIilcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT4ge1xuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5zZXR0aW5ncy56b29tT25DbGljaykub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy56b29tT25DbGljayA9IHZhbHVlO1xuICAgICAgICAgIGF3YWl0IHRoaXMuc2V0dGluZ3Muc2F2ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkRlYnVnIG1vZGVcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIk9wZW4gRGV2VG9vbHMgKENvbW1hbmQrT3B0aW9uK0kgb3IgQ29udHJvbCtTaGlmdCtJKSB0byBjb3B5IHRoZSBkZWJ1ZyBsb2dzLlwiXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMuc2V0dGluZ3MuZGVidWcpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0dGluZ3MuZGVidWcgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnNldHRpbmdzLnNhdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQXBwLCBNYXJrZG93blZpZXcgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuZXhwb3J0IGludGVyZmFjZSBJT2JzaWRpYW5UYWJzU2V0dGlnbnMge1xuICB1c2VUYWI6IGJvb2xlYW47XG4gIHRhYlNpemU6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJT2JzaWRpYW5Gb2xkU2V0dGlnbnMge1xuICBmb2xkSW5kZW50OiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgT2JzaWRpYW5VdGlscyB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBwOiBBcHApIHt9XG5cbiAgZ2V0T2JzaWRpYW5UYWJzU2V0dGlnbnMoKTogSU9ic2lkaWFuVGFic1NldHRpZ25zIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXNlVGFiOiB0cnVlLFxuICAgICAgdGFiU2l6ZTogNCxcbiAgICAgIC4uLih0aGlzLmFwcC52YXVsdCBhcyBhbnkpLmNvbmZpZyxcbiAgICB9O1xuICB9XG5cbiAgZ2V0T2JzaWRpYW5Gb2xkU2V0dGlnbnMoKTogSU9ic2lkaWFuRm9sZFNldHRpZ25zIHtcbiAgICByZXR1cm4ge1xuICAgICAgZm9sZEluZGVudDogZmFsc2UsXG4gICAgICAuLi4odGhpcy5hcHAudmF1bHQgYXMgYW55KS5jb25maWcsXG4gICAgfTtcbiAgfVxuXG4gIGdldEFjdGl2ZUxlYWZEaXNwbGF5VGV4dCgpIHtcbiAgICByZXR1cm4gdGhpcy5hcHAud29ya3NwYWNlLmFjdGl2ZUxlYWYuZ2V0RGlzcGxheVRleHQoKTtcbiAgfVxuXG4gIGNyZWF0ZUNvbW1hbmRDYWxsYmFjayhjYjogKGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IpID0+IGJvb2xlYW4pIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgY29uc3QgdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG5cbiAgICAgIGlmICghdmlldykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGVkaXRvciA9IHZpZXcuc291cmNlTW9kZS5jbUVkaXRvcjtcblxuICAgICAgY29uc3Qgd29ya2VkID0gY2IoZWRpdG9yKTtcblxuICAgICAgaWYgKCF3b3JrZWQgJiYgd2luZG93LmV2ZW50ICYmIHdpbmRvdy5ldmVudC50eXBlID09PSBcImtleWRvd25cIikge1xuICAgICAgICAoZWRpdG9yIGFzIGFueSkudHJpZ2dlck9uS2V5RG93bih3aW5kb3cuZXZlbnQpO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBFZGl0b3JVdGlscyB7XG4gIGNvbnRhaW5zU2luZ2xlQ3Vyc29yKGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IpIHtcbiAgICBjb25zdCBzZWxlY3Rpb25zID0gZWRpdG9yLmxpc3RTZWxlY3Rpb25zKCk7XG5cbiAgICByZXR1cm4gc2VsZWN0aW9ucy5sZW5ndGggPT09IDEgJiYgdGhpcy5yYW5nZUlzQ3Vyc29yKHNlbGVjdGlvbnNbMF0pO1xuICB9XG5cbiAgcmFuZ2VJc0N1cnNvcihzZWxlY3Rpb246IENvZGVNaXJyb3IuUmFuZ2UpIHtcbiAgICByZXR1cm4gKFxuICAgICAgc2VsZWN0aW9uLmFuY2hvci5saW5lID09PSBzZWxlY3Rpb24uaGVhZC5saW5lICYmXG4gICAgICBzZWxlY3Rpb24uYW5jaG9yLmNoID09PSBzZWxlY3Rpb24uaGVhZC5jaFxuICAgICk7XG4gIH1cbn1cbiIsImV4cG9ydCBpbnRlcmZhY2UgSUxpc3Qge1xuICBnZXRMZXZlbCgpOiBudW1iZXI7XG4gIGdldFBhcmVudCgpOiBJTGlzdCB8IG51bGw7XG4gIGFkZEFmdGVyQWxsKGxpc3Q6IElMaXN0KTogdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIExpc3QgaW1wbGVtZW50cyBJTGlzdCB7XG4gIHByaXZhdGUgaW5kZW50U2lnbjogc3RyaW5nO1xuICBwcml2YXRlIGJ1bGxldDogc3RyaW5nO1xuICBwcml2YXRlIGNvbnRlbnQ6IHN0cmluZztcbiAgcHJpdmF0ZSBmb2xkZWQ6IGJvb2xlYW47XG4gIHByaXZhdGUgY2hpbGRyZW46IExpc3RbXTtcbiAgcHJpdmF0ZSBwYXJlbnQ6IExpc3Q7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgaW5kZW50U2lnbjogc3RyaW5nLFxuICAgIGJ1bGxldDogc3RyaW5nLFxuICAgIGNvbnRlbnQ6IHN0cmluZyxcbiAgICBmb2xkZWQ6IGJvb2xlYW5cbiAgKSB7XG4gICAgdGhpcy5pbmRlbnRTaWduID0gaW5kZW50U2lnbjtcbiAgICB0aGlzLmJ1bGxldCA9IGJ1bGxldDtcbiAgICB0aGlzLmNvbnRlbnQgPSBjb250ZW50O1xuICAgIHRoaXMuZm9sZGVkID0gZm9sZGVkO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgICB0aGlzLnBhcmVudCA9IG51bGw7XG4gIH1cblxuICBpc0ZvbGRlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5mb2xkZWQ7XG4gIH1cblxuICBpc0ZvbGRSb290KCkge1xuICAgIGxldCBwYXJlbnQgPSB0aGlzLmdldFBhcmVudCgpO1xuICAgIHdoaWxlIChwYXJlbnQpIHtcbiAgICAgIGlmIChwYXJlbnQuaXNGb2xkZWQoKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBwYXJlbnQgPSBwYXJlbnQuZ2V0UGFyZW50KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaXNGb2xkZWQoKTtcbiAgfVxuXG4gIGdldENoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmNvbmNhdCgpO1xuICB9XG5cbiAgYXBwZW5kQ29udGVudChjb250ZW50OiBzdHJpbmcpIHtcbiAgICB0aGlzLmNvbnRlbnQgKz0gY29udGVudDtcbiAgfVxuXG4gIGdldENvbnRlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGVudDtcbiAgfVxuXG4gIGlzRW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ubGVuZ3RoID09PSAwO1xuICB9XG5cbiAgZ2V0Q29udGVudFN0YXJ0Q2goKSB7XG4gICAgY29uc3QgaW5kZW50TGVuZ3RoID0gKHRoaXMuZ2V0TGV2ZWwoKSAtIDEpICogdGhpcy5pbmRlbnRTaWduLmxlbmd0aDtcbiAgICByZXR1cm4gaW5kZW50TGVuZ3RoICsgMjtcbiAgfVxuXG4gIGdldENvbnRlbnRFbmRDaCgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRDb250ZW50U3RhcnRDaCgpICsgdGhpcy5jb250ZW50Lmxlbmd0aDtcbiAgfVxuXG4gIGdldFBhcmVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQ7XG4gIH1cblxuICBnZXRQcmV2U2libGluZ09mKGxpc3Q6IExpc3QpIHtcbiAgICBjb25zdCBpID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKGxpc3QpO1xuICAgIHJldHVybiBpID4gMCA/IHRoaXMuY2hpbGRyZW5baSAtIDFdIDogbnVsbDtcbiAgfVxuXG4gIGdldE5leHRTaWJsaW5nT2YobGlzdDogTGlzdCkge1xuICAgIGNvbnN0IGkgPSB0aGlzLmNoaWxkcmVuLmluZGV4T2YobGlzdCk7XG4gICAgcmV0dXJuIGkgPj0gMCAmJiBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGggPyB0aGlzLmNoaWxkcmVuW2kgKyAxXSA6IG51bGw7XG4gIH1cblxuICBnZXRMZXZlbCgpIHtcbiAgICBsZXQgbGV2ZWwgPSAwO1xuICAgIGxldCByZWY6IExpc3QgPSB0aGlzO1xuICAgIHdoaWxlIChyZWYucGFyZW50KSB7XG4gICAgICByZWYgPSByZWYucGFyZW50O1xuICAgICAgbGV2ZWwrKztcbiAgICB9XG4gICAgcmV0dXJuIGxldmVsO1xuICB9XG5cbiAgYWRkQWZ0ZXJBbGwobGlzdDogTGlzdCkge1xuICAgIHRoaXMuY2hpbGRyZW4ucHVzaChsaXN0KTtcbiAgICBsaXN0LnBhcmVudCA9IHRoaXM7XG4gIH1cblxuICBhZGRCZWZvcmVBbGwobGlzdDogTGlzdCkge1xuICAgIHRoaXMuY2hpbGRyZW4udW5zaGlmdChsaXN0KTtcbiAgICBsaXN0LnBhcmVudCA9IHRoaXM7XG4gIH1cblxuICBhZGRCZWZvcmUoYmVmb3JlOiBMaXN0LCBsaXN0OiBMaXN0KSB7XG4gICAgY29uc3QgaSA9IHRoaXMuY2hpbGRyZW4uaW5kZXhPZihiZWZvcmUpO1xuICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKGksIDAsIGxpc3QpO1xuICAgIGxpc3QucGFyZW50ID0gdGhpcztcbiAgfVxuXG4gIGFkZEFmdGVyKGJlZm9yZTogTGlzdCwgbGlzdDogTGlzdCkge1xuICAgIGNvbnN0IGkgPSB0aGlzLmNoaWxkcmVuLmluZGV4T2YoYmVmb3JlKTtcbiAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpICsgMSwgMCwgbGlzdCk7XG4gICAgbGlzdC5wYXJlbnQgPSB0aGlzO1xuICB9XG5cbiAgcmVtb3ZlQ2hpbGQobGlzdDogTGlzdCkge1xuICAgIGNvbnN0IGkgPSB0aGlzLmNoaWxkcmVuLmluZGV4T2YobGlzdCk7XG4gICAgdGhpcy5jaGlsZHJlbi5zcGxpY2UoaSwgMSk7XG4gICAgbGlzdC5wYXJlbnQgPSBudWxsO1xuICB9XG5cbiAgcHJpbnQoKSB7XG4gICAgbGV0IHJlcyA9IHRoaXMuZ2V0RnVsbENvbnRlbnQoKSArIFwiXFxuXCI7XG5cbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMuY2hpbGRyZW4pIHtcbiAgICAgIHJlcyArPSBjaGlsZC5wcmludCgpO1xuICAgIH1cblxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBjb3B5KFxuICAgIG92ZXJyaWRlOiB7XG4gICAgICBpbmRlbnRTaWduPzogc3RyaW5nO1xuICAgICAgYnVsbGV0Pzogc3RyaW5nO1xuICAgICAgY29udGVudD86IHN0cmluZztcbiAgICAgIGZvbGRlZD86IGJvb2xlYW47XG4gICAgfSA9IHt9XG4gICkge1xuICAgIGNvbnN0IHsgaW5kZW50U2lnbiwgYnVsbGV0LCBjb250ZW50LCBmb2xkZWQgfSA9IHtcbiAgICAgIGluZGVudFNpZ246IHRoaXMuaW5kZW50U2lnbixcbiAgICAgIGJ1bGxldDogdGhpcy5idWxsZXQsXG4gICAgICBjb250ZW50OiB0aGlzLmNvbnRlbnQsXG4gICAgICBmb2xkZWQ6IHRoaXMuZm9sZGVkLFxuICAgICAgLi4ub3ZlcnJpZGUsXG4gICAgfTtcblxuICAgIHJldHVybiBuZXcgTGlzdChpbmRlbnRTaWduLCBidWxsZXQsIGNvbnRlbnQsIGZvbGRlZCk7XG4gIH1cblxuICBwcml2YXRlIGdldEZ1bGxDb250ZW50KCkge1xuICAgIHJldHVybiAoXG4gICAgICBuZXcgQXJyYXkodGhpcy5nZXRMZXZlbCgpIC0gMSkuZmlsbCh0aGlzLmluZGVudFNpZ24pLmpvaW4oXCJcIikgK1xuICAgICAgdGhpcy5idWxsZXQgK1xuICAgICAgXCIgXCIgK1xuICAgICAgdGhpcy5jb250ZW50XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUm9vdCBpbXBsZW1lbnRzIElMaXN0IHtcbiAgcHJpdmF0ZSBpbmRlbnRTaWduOiBzdHJpbmc7XG4gIHByaXZhdGUgcm9vdExpc3Q6IExpc3Q7XG4gIHByaXZhdGUgc3RhcnQ6IENvZGVNaXJyb3IuUG9zaXRpb247XG4gIHByaXZhdGUgZW5kOiBDb2RlTWlycm9yLlBvc2l0aW9uO1xuICBwcml2YXRlIGN1cnNvcjogQ29kZU1pcnJvci5Qb3NpdGlvbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBpbmRlbnRTaWduOiBzdHJpbmcsXG4gICAgc3RhcnQ6IENvZGVNaXJyb3IuUG9zaXRpb24sXG4gICAgZW5kOiBDb2RlTWlycm9yLlBvc2l0aW9uLFxuICAgIGN1cnNvcjogQ29kZU1pcnJvci5Qb3NpdGlvblxuICApIHtcbiAgICB0aGlzLmluZGVudFNpZ24gPSBpbmRlbnRTaWduO1xuICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgICB0aGlzLmVuZCA9IGVuZDtcbiAgICB0aGlzLmN1cnNvciA9IGN1cnNvcjtcbiAgICB0aGlzLnJvb3RMaXN0ID0gbmV3IExpc3QoXCJcIiwgXCJcIiwgXCJcIiwgZmFsc2UpO1xuICB9XG5cbiAgcmVwbGFjZUN1cnNvcihjdXJzb3I6IENvZGVNaXJyb3IuUG9zaXRpb24pIHtcbiAgICB0aGlzLmN1cnNvciA9IGN1cnNvcjtcbiAgfVxuXG4gIGdldFRvdGFsTGluZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZW5kLmxpbmUgLSB0aGlzLnN0YXJ0LmxpbmUgKyAxO1xuICB9XG5cbiAgZ2V0Q2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMucm9vdExpc3QuZ2V0Q2hpbGRyZW4oKTtcbiAgfVxuXG4gIGdldEluZGVudFNpZ24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5kZW50U2lnbjtcbiAgfVxuXG4gIGdldExldmVsKCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZ2V0UGFyZW50KCk6IExpc3QgfCBudWxsIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGFkZEFmdGVyQWxsKGxpc3Q6IExpc3QpIHtcbiAgICB0aGlzLnJvb3RMaXN0LmFkZEFmdGVyQWxsKGxpc3QpO1xuICB9XG5cbiAgZ2V0TGlzdFN0YXJ0UG9zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQ7XG4gIH1cblxuICBnZXRMaXN0RW5kUG9zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZW5kO1xuICB9XG5cbiAgZ2V0Q3Vyc29yKCkge1xuICAgIHJldHVybiB0aGlzLmN1cnNvcjtcbiAgfVxuXG4gIGdldExpc3RVbmRlckN1cnNvcigpOiBMaXN0IHtcbiAgICByZXR1cm4gdGhpcy5nZXRMaXN0VW5kZXJMaW5lKHRoaXMuY3Vyc29yLmxpbmUpO1xuICB9XG5cbiAgcHJpbnQoKSB7XG4gICAgbGV0IHJlcyA9IFwiXCI7XG5cbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMucm9vdExpc3QuZ2V0Q2hpbGRyZW4oKSkge1xuICAgICAgcmVzICs9IGNoaWxkLnByaW50KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcy5yZXBsYWNlKC9cXG4kLywgXCJcIik7XG4gIH1cblxuICBnZXRMaW5lTnVtYmVyT2YobGlzdDogTGlzdCkge1xuICAgIGxldCByZXN1bHQ6IG51bWJlciA9IG51bGw7XG4gICAgbGV0IGxpbmU6IG51bWJlciA9IDA7XG4gICAgY29uc3QgdmlzaXRBcnIgPSAobGw6IExpc3RbXSkgPT4ge1xuICAgICAgZm9yIChjb25zdCBsIG9mIGxsKSB7XG4gICAgICAgIGlmIChsID09PSBsaXN0KSB7XG4gICAgICAgICAgcmVzdWx0ID0gbGluZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsaW5lKys7XG4gICAgICAgICAgdmlzaXRBcnIobC5nZXRDaGlsZHJlbigpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0ICE9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZpc2l0QXJyKHRoaXMucm9vdExpc3QuZ2V0Q2hpbGRyZW4oKSk7XG5cbiAgICByZXR1cm4gcmVzdWx0ICsgdGhpcy5zdGFydC5saW5lO1xuICB9XG5cbiAgZ2V0TGlzdFVuZGVyTGluZShsaW5lOiBudW1iZXIpIHtcbiAgICBpZiAobGluZSA8IHRoaXMuc3RhcnQubGluZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCByZXN1bHQ6IExpc3QgPSBudWxsO1xuICAgIGxldCBpbmRleDogbnVtYmVyID0gMDtcbiAgICBjb25zdCB2aXNpdEFyciA9IChsbDogTGlzdFtdKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGwgb2YgbGwpIHtcbiAgICAgICAgaWYgKGluZGV4ICsgdGhpcy5zdGFydC5saW5lID09PSBsaW5lKSB7XG4gICAgICAgICAgcmVzdWx0ID0gbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgIHZpc2l0QXJyKGwuZ2V0Q2hpbGRyZW4oKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdCAhPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICB2aXNpdEFycih0aGlzLnJvb3RMaXN0LmdldENoaWxkcmVuKCkpO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIG1vdmVVcCgpIHtcbiAgICBjb25zdCBsaXN0ID0gdGhpcy5nZXRMaXN0VW5kZXJDdXJzb3IoKTtcbiAgICBjb25zdCBwYXJlbnQgPSBsaXN0LmdldFBhcmVudCgpO1xuICAgIGNvbnN0IGdyYW5kUGFyZW50ID0gcGFyZW50LmdldFBhcmVudCgpO1xuICAgIGNvbnN0IHByZXYgPSBwYXJlbnQuZ2V0UHJldlNpYmxpbmdPZihsaXN0KTtcblxuICAgIGlmICghcHJldiAmJiBncmFuZFBhcmVudCkge1xuICAgICAgY29uc3QgbmV3UGFyZW50ID0gZ3JhbmRQYXJlbnQuZ2V0UHJldlNpYmxpbmdPZihwYXJlbnQpO1xuXG4gICAgICBpZiAobmV3UGFyZW50KSB7XG4gICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChsaXN0KTtcbiAgICAgICAgbmV3UGFyZW50LmFkZEFmdGVyQWxsKGxpc3QpO1xuICAgICAgICB0aGlzLmN1cnNvci5saW5lID0gdGhpcy5nZXRMaW5lTnVtYmVyT2YobGlzdCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChwcmV2KSB7XG4gICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQobGlzdCk7XG4gICAgICBwYXJlbnQuYWRkQmVmb3JlKHByZXYsIGxpc3QpO1xuICAgICAgdGhpcy5jdXJzb3IubGluZSA9IHRoaXMuZ2V0TGluZU51bWJlck9mKGxpc3QpO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgY3JlYXRlTmV3bGluZU9uQ2hpbGRMZXZlbCgpIHtcbiAgICBjb25zdCBsaXN0ID0gdGhpcy5nZXRMaXN0VW5kZXJDdXJzb3IoKTtcblxuICAgIGlmIChsaXN0LmlzRW1wdHkoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmN1cnNvci5jaCAhPT0gbGlzdC5nZXRDb250ZW50RW5kQ2goKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IG5ld0xpc3QgPSBsaXN0LmdldENoaWxkcmVuKClbMF0uY29weSh7IGNvbnRlbnQ6IFwiXCIsIGZvbGRlZDogZmFsc2UgfSk7XG5cbiAgICBsaXN0LmFkZEJlZm9yZUFsbChuZXdMaXN0KTtcblxuICAgIHRoaXMuY3Vyc29yLmxpbmUgPSB0aGlzLmdldExpbmVOdW1iZXJPZihuZXdMaXN0KTtcbiAgICB0aGlzLmN1cnNvci5jaCA9IG5ld0xpc3QuZ2V0Q29udGVudFN0YXJ0Q2goKTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgbW92ZURvd24oKSB7XG4gICAgY29uc3QgbGlzdCA9IHRoaXMuZ2V0TGlzdFVuZGVyQ3Vyc29yKCk7XG4gICAgY29uc3QgcGFyZW50ID0gbGlzdC5nZXRQYXJlbnQoKTtcbiAgICBjb25zdCBncmFuZFBhcmVudCA9IHBhcmVudC5nZXRQYXJlbnQoKTtcbiAgICBjb25zdCBuZXh0ID0gcGFyZW50LmdldE5leHRTaWJsaW5nT2YobGlzdCk7XG5cbiAgICBpZiAoIW5leHQgJiYgZ3JhbmRQYXJlbnQpIHtcbiAgICAgIGNvbnN0IG5ld1BhcmVudCA9IGdyYW5kUGFyZW50LmdldE5leHRTaWJsaW5nT2YocGFyZW50KTtcblxuICAgICAgaWYgKG5ld1BhcmVudCkge1xuICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQobGlzdCk7XG4gICAgICAgIG5ld1BhcmVudC5hZGRCZWZvcmVBbGwobGlzdCk7XG4gICAgICAgIHRoaXMuY3Vyc29yLmxpbmUgPSB0aGlzLmdldExpbmVOdW1iZXJPZihsaXN0KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG5leHQpIHtcbiAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChsaXN0KTtcbiAgICAgIHBhcmVudC5hZGRBZnRlcihuZXh0LCBsaXN0KTtcbiAgICAgIHRoaXMuY3Vyc29yLmxpbmUgPSB0aGlzLmdldExpbmVOdW1iZXJPZihsaXN0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIG1vdmVMZWZ0KCkge1xuICAgIGNvbnN0IGxpc3QgPSB0aGlzLmdldExpc3RVbmRlckN1cnNvcigpO1xuICAgIGNvbnN0IHBhcmVudCA9IGxpc3QuZ2V0UGFyZW50KCk7XG4gICAgY29uc3QgZ3JhbmRQYXJlbnQgPSBwYXJlbnQuZ2V0UGFyZW50KCk7XG5cbiAgICBpZiAoIWdyYW5kUGFyZW50KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwYXJlbnQucmVtb3ZlQ2hpbGQobGlzdCk7XG4gICAgZ3JhbmRQYXJlbnQuYWRkQWZ0ZXIocGFyZW50LCBsaXN0KTtcbiAgICB0aGlzLmN1cnNvci5saW5lID0gdGhpcy5nZXRMaW5lTnVtYmVyT2YobGlzdCk7XG4gICAgdGhpcy5jdXJzb3IuY2ggLT0gdGhpcy5nZXRJbmRlbnRTaWduKCkubGVuZ3RoO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBtb3ZlUmlnaHQoKSB7XG4gICAgY29uc3QgbGlzdCA9IHRoaXMuZ2V0TGlzdFVuZGVyQ3Vyc29yKCk7XG4gICAgY29uc3QgcGFyZW50ID0gbGlzdC5nZXRQYXJlbnQoKTtcbiAgICBjb25zdCBwcmV2ID0gcGFyZW50LmdldFByZXZTaWJsaW5nT2YobGlzdCk7XG5cbiAgICBpZiAoIXByZXYpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHBhcmVudC5yZW1vdmVDaGlsZChsaXN0KTtcbiAgICBwcmV2LmFkZEFmdGVyQWxsKGxpc3QpO1xuICAgIHRoaXMuY3Vyc29yLmxpbmUgPSB0aGlzLmdldExpbmVOdW1iZXJPZihsaXN0KTtcbiAgICB0aGlzLmN1cnNvci5jaCArPSB0aGlzLmdldEluZGVudFNpZ24oKS5sZW5ndGg7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGRlbGV0ZUFuZE1lcmdlV2l0aFByZXZpb3VzKCkge1xuICAgIGNvbnN0IGxpc3QgPSB0aGlzLmdldExpc3RVbmRlckN1cnNvcigpO1xuXG4gICAgaWYgKHRoaXMuY3Vyc29yLmNoICE9PSBsaXN0LmdldENvbnRlbnRTdGFydENoKCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBwcmV2ID0gdGhpcy5nZXRMaXN0VW5kZXJMaW5lKHRoaXMuY3Vyc29yLmxpbmUgLSAxKTtcblxuICAgIGlmICghcHJldikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgY29uc3QgYm90aEFyZUVtcHR5ID0gcHJldi5pc0VtcHR5KCkgJiYgbGlzdC5pc0VtcHR5KCk7XG4gICAgY29uc3QgcHJldklzRW1wdHlBbmRTYW1lTGV2ZWwgPVxuICAgICAgcHJldi5pc0VtcHR5KCkgJiYgIWxpc3QuaXNFbXB0eSgpICYmIHByZXYuZ2V0TGV2ZWwoKSA9PSBsaXN0LmdldExldmVsKCk7XG4gICAgY29uc3QgbGlzdElzRW1wdHlBbmRQcmV2SXNQYXJlbnQgPVxuICAgICAgbGlzdC5pc0VtcHR5KCkgJiYgcHJldi5nZXRMZXZlbCgpID09IGxpc3QuZ2V0TGV2ZWwoKSAtIDE7XG5cbiAgICBpZiAoYm90aEFyZUVtcHR5IHx8IHByZXZJc0VtcHR5QW5kU2FtZUxldmVsIHx8IGxpc3RJc0VtcHR5QW5kUHJldklzUGFyZW50KSB7XG4gICAgICBjb25zdCBwYXJlbnQgPSBsaXN0LmdldFBhcmVudCgpO1xuICAgICAgY29uc3QgcHJldkVuZENoID0gcHJldi5nZXRDb250ZW50RW5kQ2goKTtcblxuICAgICAgcHJldi5hcHBlbmRDb250ZW50KGxpc3QuZ2V0Q29udGVudCgpKTtcbiAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChsaXN0KTtcbiAgICAgIGZvciAoY29uc3QgYyBvZiBsaXN0LmdldENoaWxkcmVuKCkpIHtcbiAgICAgICAgbGlzdC5yZW1vdmVDaGlsZChjKTtcbiAgICAgICAgcHJldi5hZGRBZnRlckFsbChjKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jdXJzb3IubGluZSA9IHRoaXMuZ2V0TGluZU51bWJlck9mKHByZXYpO1xuICAgICAgdGhpcy5jdXJzb3IuY2ggPSBwcmV2RW5kQ2g7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cbiIsImltcG9ydCB7IExvZ2dlciB9IGZyb20gXCIuL2xvZ2dlclwiO1xuaW1wb3J0IHsgT2JzaWRpYW5VdGlscyB9IGZyb20gXCIuL29ic2lkaWFuX3V0aWxzXCI7XG5pbXBvcnQgeyBJTGlzdCwgTGlzdCwgUm9vdCB9IGZyb20gXCIuL3Jvb3RcIjtcblxuY29uc3QgYnVsbGV0U2lnbiA9IFwiLSorXCI7XG5cbmV4cG9ydCBjbGFzcyBMaXN0VXRpbHMge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGxvZ2dlcjogTG9nZ2VyLCBwcml2YXRlIG9ic2lkaWFuVXRpbHM6IE9ic2lkaWFuVXRpbHMpIHt9XG5cbiAgZ2V0TGlzdExpbmVJbmZvKGxpbmU6IHN0cmluZywgaW5kZW50U2lnbjogc3RyaW5nKSB7XG4gICAgY29uc3QgcHJlZml4UmUgPSBuZXcgUmVnRXhwKGBeKD86JHtpbmRlbnRTaWdufSkqKFske2J1bGxldFNpZ259XSkgYCk7XG4gICAgY29uc3QgbWF0Y2hlcyA9IHByZWZpeFJlLmV4ZWMobGluZSk7XG5cbiAgICBpZiAoIW1hdGNoZXMpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHByZWZpeExlbmd0aCA9IG1hdGNoZXNbMF0ubGVuZ3RoO1xuICAgIGNvbnN0IGJ1bGxldCA9IG1hdGNoZXNbMV07XG4gICAgY29uc3QgY29udGVudCA9IGxpbmUuc2xpY2UocHJlZml4TGVuZ3RoKTtcbiAgICBjb25zdCBpbmRlbnRMZXZlbCA9IChwcmVmaXhMZW5ndGggLSAyKSAvIGluZGVudFNpZ24ubGVuZ3RoO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGJ1bGxldCxcbiAgICAgIGNvbnRlbnQsXG4gICAgICBwcmVmaXhMZW5ndGgsXG4gICAgICBpbmRlbnRMZXZlbCxcbiAgICB9O1xuICB9XG5cbiAgcGFyc2VMaXN0KGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IsIGN1cnNvciA9IGVkaXRvci5nZXRDdXJzb3IoKSk6IFJvb3Qge1xuICAgIGNvbnN0IGN1cnNvckxpbmUgPSBjdXJzb3IubGluZTtcbiAgICBjb25zdCBjdXJzb3JDaCA9IGN1cnNvci5jaDtcbiAgICBjb25zdCBsaW5lID0gZWRpdG9yLmdldExpbmUoY3Vyc29yTGluZSk7XG5cbiAgICBjb25zdCBpbmRlbnRTaWduID0gdGhpcy5kZXRlY3RMaXN0SW5kZW50U2lnbihlZGl0b3IsIGN1cnNvcik7XG5cbiAgICBpZiAoaW5kZW50U2lnbiA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IGxpc3RTdGFydExpbmUgPSBjdXJzb3JMaW5lO1xuICAgIGNvbnN0IGxpc3RTdGFydENoID0gMDtcbiAgICB3aGlsZSAobGlzdFN0YXJ0TGluZSA+PSAxKSB7XG4gICAgICBjb25zdCBsaW5lID0gZWRpdG9yLmdldExpbmUobGlzdFN0YXJ0TGluZSAtIDEpO1xuICAgICAgaWYgKCF0aGlzLmdldExpc3RMaW5lSW5mbyhsaW5lLCBpbmRlbnRTaWduKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGxpc3RTdGFydExpbmUtLTtcbiAgICB9XG5cbiAgICBsZXQgbGlzdEVuZExpbmUgPSBjdXJzb3JMaW5lO1xuICAgIGxldCBsaXN0RW5kQ2ggPSBsaW5lLmxlbmd0aDtcbiAgICB3aGlsZSAobGlzdEVuZExpbmUgPCBlZGl0b3IubGluZUNvdW50KCkpIHtcbiAgICAgIGNvbnN0IGxpbmUgPSBlZGl0b3IuZ2V0TGluZShsaXN0RW5kTGluZSArIDEpO1xuICAgICAgaWYgKCF0aGlzLmdldExpc3RMaW5lSW5mbyhsaW5lLCBpbmRlbnRTaWduKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGxpc3RFbmRDaCA9IGxpbmUubGVuZ3RoO1xuICAgICAgbGlzdEVuZExpbmUrKztcbiAgICB9XG5cbiAgICBjb25zdCByb290ID0gbmV3IFJvb3QoXG4gICAgICBpbmRlbnRTaWduLFxuICAgICAgeyBsaW5lOiBsaXN0U3RhcnRMaW5lLCBjaDogbGlzdFN0YXJ0Q2ggfSxcbiAgICAgIHsgbGluZTogbGlzdEVuZExpbmUsIGNoOiBsaXN0RW5kQ2ggfSxcbiAgICAgIHsgbGluZTogY3Vyc29yTGluZSwgY2g6IGN1cnNvckNoIH1cbiAgICApO1xuXG4gICAgbGV0IGN1cnJlbnRMZXZlbDogSUxpc3QgPSByb290O1xuICAgIGxldCBsYXN0TGlzdDogSUxpc3QgPSByb290O1xuXG4gICAgZm9yIChsZXQgbCA9IGxpc3RTdGFydExpbmU7IGwgPD0gbGlzdEVuZExpbmU7IGwrKykge1xuICAgICAgY29uc3QgbGluZSA9IGVkaXRvci5nZXRMaW5lKGwpO1xuICAgICAgY29uc3QgeyBidWxsZXQsIGNvbnRlbnQsIGluZGVudExldmVsIH0gPSB0aGlzLmdldExpc3RMaW5lSW5mbyhcbiAgICAgICAgbGluZSxcbiAgICAgICAgaW5kZW50U2lnblxuICAgICAgKTtcbiAgICAgIGNvbnN0IGZvbGRlZCA9IChlZGl0b3IgYXMgYW55KS5pc0ZvbGRlZCh7XG4gICAgICAgIGxpbmU6IGwsXG4gICAgICAgIGNoOiAwLFxuICAgICAgfSk7XG5cbiAgICAgIGlmIChpbmRlbnRMZXZlbCA9PT0gY3VycmVudExldmVsLmdldExldmVsKCkgKyAxKSB7XG4gICAgICAgIGN1cnJlbnRMZXZlbCA9IGxhc3RMaXN0O1xuICAgICAgfSBlbHNlIGlmIChpbmRlbnRMZXZlbCA8IGN1cnJlbnRMZXZlbC5nZXRMZXZlbCgpKSB7XG4gICAgICAgIHdoaWxlIChpbmRlbnRMZXZlbCA8IGN1cnJlbnRMZXZlbC5nZXRMZXZlbCgpKSB7XG4gICAgICAgICAgY3VycmVudExldmVsID0gY3VycmVudExldmVsLmdldFBhcmVudCgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGluZGVudExldmVsICE9IGN1cnJlbnRMZXZlbC5nZXRMZXZlbCgpKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYFVuYWJsZSB0byBwYXJzZSBsaXN0YCk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBsaXN0ID0gbmV3IExpc3QoaW5kZW50U2lnbiwgYnVsbGV0LCBjb250ZW50LCBmb2xkZWQpO1xuICAgICAgY3VycmVudExldmVsLmFkZEFmdGVyQWxsKGxpc3QpO1xuICAgICAgbGFzdExpc3QgPSBsaXN0O1xuICAgIH1cblxuICAgIHJldHVybiByb290O1xuICB9XG5cbiAgYXBwbHlDaGFuZ2VzKGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IsIHJvb3Q6IFJvb3QpIHtcbiAgICBjb25zdCBvbGRTdHJpbmcgPSBlZGl0b3IuZ2V0UmFuZ2UoXG4gICAgICByb290LmdldExpc3RTdGFydFBvc2l0aW9uKCksXG4gICAgICByb290LmdldExpc3RFbmRQb3NpdGlvbigpXG4gICAgKTtcbiAgICBjb25zdCBuZXdTdHJpbmcgPSByb290LnByaW50KCk7XG5cbiAgICBjb25zdCBmcm9tTGluZSA9IHJvb3QuZ2V0TGlzdFN0YXJ0UG9zaXRpb24oKS5saW5lO1xuICAgIGNvbnN0IHRvTGluZSA9IHJvb3QuZ2V0TGlzdEVuZFBvc2l0aW9uKCkubGluZTtcblxuICAgIGZvciAobGV0IGwgPSBmcm9tTGluZTsgbCA8PSB0b0xpbmU7IGwrKykge1xuICAgICAgKGVkaXRvciBhcyBhbnkpLmZvbGRDb2RlKGwsIG51bGwsIFwidW5mb2xkXCIpO1xuICAgIH1cblxuICAgIGxldCBjaGFuZ2VGcm9tID0gcm9vdC5nZXRMaXN0U3RhcnRQb3NpdGlvbigpO1xuICAgIGxldCBjaGFuZ2VUbyA9IHJvb3QuZ2V0TGlzdEVuZFBvc2l0aW9uKCk7XG4gICAgbGV0IG9sZFRtcCA9IG9sZFN0cmluZztcbiAgICBsZXQgbmV3VG1wID0gbmV3U3RyaW5nO1xuXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGNvbnN0IG5sSW5kZXggPSBvbGRUbXAuaW5kZXhPZihcIlxcblwiKTtcbiAgICAgIGlmIChubEluZGV4IDwgMCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNvbnN0IG9sZExpbmUgPSBvbGRUbXAuc2xpY2UoMCwgbmxJbmRleCArIDEpO1xuICAgICAgY29uc3QgbmV3TGluZSA9IG5ld1RtcC5zbGljZSgwLCBvbGRMaW5lLmxlbmd0aCk7XG4gICAgICBpZiAob2xkTGluZSAhPT0gbmV3TGluZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNoYW5nZUZyb20ubGluZSsrO1xuICAgICAgb2xkVG1wID0gb2xkVG1wLnNsaWNlKG9sZExpbmUubGVuZ3RoKTtcbiAgICAgIG5ld1RtcCA9IG5ld1RtcC5zbGljZShvbGRMaW5lLmxlbmd0aCk7XG4gICAgfVxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBjb25zdCBubEluZGV4ID0gb2xkVG1wLmxhc3RJbmRleE9mKFwiXFxuXCIpO1xuICAgICAgaWYgKG5sSW5kZXggPCAwKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY29uc3Qgb2xkTGluZSA9IG9sZFRtcC5zbGljZShubEluZGV4KTtcbiAgICAgIGNvbnN0IG5ld0xpbmUgPSBuZXdUbXAuc2xpY2UoLW9sZExpbmUubGVuZ3RoKTtcbiAgICAgIGlmIChvbGRMaW5lICE9PSBuZXdMaW5lKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgb2xkVG1wID0gb2xkVG1wLnNsaWNlKDAsIC1vbGRMaW5lLmxlbmd0aCk7XG4gICAgICBuZXdUbXAgPSBuZXdUbXAuc2xpY2UoMCwgLW9sZExpbmUubGVuZ3RoKTtcblxuICAgICAgY29uc3QgbmxJbmRleDIgPSBvbGRUbXAubGFzdEluZGV4T2YoXCJcXG5cIik7XG4gICAgICBjaGFuZ2VUby5jaCA9XG4gICAgICAgIG5sSW5kZXgyID49IDAgPyBvbGRUbXAubGVuZ3RoIC0gbmxJbmRleDIgLSAxIDogb2xkVG1wLmxlbmd0aDtcbiAgICAgIGNoYW5nZVRvLmxpbmUtLTtcbiAgICB9XG5cbiAgICBpZiAob2xkVG1wICE9PSBuZXdUbXApIHtcbiAgICAgIGVkaXRvci5yZXBsYWNlUmFuZ2UobmV3VG1wLCBjaGFuZ2VGcm9tLCBjaGFuZ2VUbyk7XG4gICAgfVxuXG4gICAgY29uc3Qgb2xkQ3Vyc29yID0gZWRpdG9yLmdldEN1cnNvcigpO1xuICAgIGNvbnN0IG5ld0N1cnNvciA9IHJvb3QuZ2V0Q3Vyc29yKCk7XG5cbiAgICBpZiAob2xkQ3Vyc29yLmxpbmUgIT0gbmV3Q3Vyc29yLmxpbmUgfHwgb2xkQ3Vyc29yLmNoICE9IG5ld0N1cnNvci5jaCkge1xuICAgICAgZWRpdG9yLnNldEN1cnNvcihuZXdDdXJzb3IpO1xuICAgIH1cblxuICAgIGZvciAobGV0IGwgPSBmcm9tTGluZTsgbCA8PSB0b0xpbmU7IGwrKykge1xuICAgICAgY29uc3QgbGluZSA9IHJvb3QuZ2V0TGlzdFVuZGVyTGluZShsKTtcbiAgICAgIGlmIChsaW5lICYmIGxpbmUuaXNGb2xkUm9vdCgpKSB7XG4gICAgICAgIC8vIFRPRE86IHdoeSB3b3JraW5nIG9ubHkgd2l0aCAtMT9cbiAgICAgICAgKGVkaXRvciBhcyBhbnkpLmZvbGRDb2RlKGwgLSAxKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkZXRlY3RMaXN0SW5kZW50U2lnbihlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yLCBjdXJzb3I6IENvZGVNaXJyb3IuUG9zaXRpb24pIHtcbiAgICBjb25zdCBkID0gdGhpcy5sb2dnZXIuYmluZChcIk9ic2lkaWFuT3V0bGluZXJQbHVnaW46OmRldGVjdExpc3RJbmRlbnRTaWduXCIpO1xuXG4gICAgY29uc3QgeyB1c2VUYWIsIHRhYlNpemUgfSA9IHRoaXMub2JzaWRpYW5VdGlscy5nZXRPYnNpZGlhblRhYnNTZXR0aWducygpO1xuICAgIGNvbnN0IGRlZmF1bHRJbmRlbnRTaWduID0gdXNlVGFiXG4gICAgICA/IFwiXFx0XCJcbiAgICAgIDogbmV3IEFycmF5KHRhYlNpemUpLmZpbGwoXCIgXCIpLmpvaW4oXCJcIik7XG5cbiAgICBjb25zdCBsaW5lID0gZWRpdG9yLmdldExpbmUoY3Vyc29yLmxpbmUpO1xuXG4gICAgY29uc3Qgd2l0aFRhYnNSZSA9IG5ldyBSZWdFeHAoYF5cXHQrWyR7YnVsbGV0U2lnbn1dIGApO1xuICAgIGNvbnN0IHdpdGhTcGFjZXNSZSA9IG5ldyBSZWdFeHAoYF5bIF0rWyR7YnVsbGV0U2lnbn1dIGApO1xuICAgIGNvbnN0IG1heUJlV2l0aFNwYWNlc1JlID0gbmV3IFJlZ0V4cChgXlsgXSpbJHtidWxsZXRTaWdufV0gYCk7XG5cbiAgICBpZiAod2l0aFRhYnNSZS50ZXN0KGxpbmUpKSB7XG4gICAgICBkKFwiZGV0ZWN0ZWQgdGFiIG9uIGN1cnJlbnQgbGluZVwiKTtcbiAgICAgIHJldHVybiBcIlxcdFwiO1xuICAgIH1cblxuICAgIGlmICh3aXRoU3BhY2VzUmUudGVzdChsaW5lKSkge1xuICAgICAgZChcImRldGVjdGVkIHdoaXRlc3BhY2VzIG9uIGN1cnJlbnQgbGluZSwgdHJ5aW5nIHRvIGNvdW50XCIpO1xuICAgICAgY29uc3Qgc3BhY2VzQSA9IGxpbmUubGVuZ3RoIC0gbGluZS50cmltTGVmdCgpLmxlbmd0aDtcblxuICAgICAgbGV0IGxpbmVObyA9IGN1cnNvci5saW5lIC0gMTtcbiAgICAgIHdoaWxlIChsaW5lTm8gPj0gZWRpdG9yLmZpcnN0TGluZSgpKSB7XG4gICAgICAgIGNvbnN0IGxpbmUgPSBlZGl0b3IuZ2V0TGluZShsaW5lTm8pO1xuICAgICAgICBpZiAoIW1heUJlV2l0aFNwYWNlc1JlLnRlc3QobGluZSkpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzcGFjZXNCID0gbGluZS5sZW5ndGggLSBsaW5lLnRyaW1MZWZ0KCkubGVuZ3RoO1xuICAgICAgICBpZiAoc3BhY2VzQiA8IHNwYWNlc0EpIHtcbiAgICAgICAgICBjb25zdCBsID0gc3BhY2VzQSAtIHNwYWNlc0I7XG4gICAgICAgICAgZChgZGV0ZWN0ZWQgJHtsfSB3aGl0ZXNwYWNlc2ApO1xuICAgICAgICAgIHJldHVybiBuZXcgQXJyYXkobCkuZmlsbChcIiBcIikuam9pbihcIlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxpbmVOby0tO1xuICAgICAgfVxuXG4gICAgICBkKFwidW5hYmxlIHRvIGRldGVjdFwiKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmIChtYXlCZVdpdGhTcGFjZXNSZS50ZXN0KGxpbmUpKSB7XG4gICAgICBkKFwiZGV0ZWN0ZWQgbm90aGluZyBvbiBjdXJyZW50IGxpbmUsIGxvb2tpbmcgZm9yd2FyZFwiKTtcbiAgICAgIGNvbnN0IHNwYWNlc0EgPSBsaW5lLmxlbmd0aCAtIGxpbmUudHJpbUxlZnQoKS5sZW5ndGg7XG5cbiAgICAgIGxldCBsaW5lTm8gPSBjdXJzb3IubGluZSArIDE7XG4gICAgICB3aGlsZSAobGluZU5vIDw9IGVkaXRvci5sYXN0TGluZSgpKSB7XG4gICAgICAgIGNvbnN0IGxpbmUgPSBlZGl0b3IuZ2V0TGluZShsaW5lTm8pO1xuICAgICAgICBpZiAod2l0aFRhYnNSZS50ZXN0KGxpbmUpKSB7XG4gICAgICAgICAgZChcImRldGVjdGVkIHRhYlwiKTtcbiAgICAgICAgICByZXR1cm4gXCJcXHRcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW1heUJlV2l0aFNwYWNlc1JlLnRlc3QobGluZSkpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzcGFjZXNCID0gbGluZS5sZW5ndGggLSBsaW5lLnRyaW1MZWZ0KCkubGVuZ3RoO1xuICAgICAgICBpZiAoc3BhY2VzQiA+IHNwYWNlc0EpIHtcbiAgICAgICAgICBjb25zdCBsID0gc3BhY2VzQiAtIHNwYWNlc0E7XG4gICAgICAgICAgZChgZGV0ZWN0ZWQgJHtsfSB3aGl0ZXNwYWNlc2ApO1xuICAgICAgICAgIHJldHVybiBuZXcgQXJyYXkobCkuZmlsbChcIiBcIikuam9pbihcIlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxpbmVObysrO1xuICAgICAgfVxuXG4gICAgICBkKGBkZXRlY3RlZCBub3RoaW5nLCB1c2luZyBkZWZhdWx0IHVzZVRhYj0ke3VzZVRhYn0gdGFiU2l6ZT0ke3RhYlNpemV9YCk7XG4gICAgICByZXR1cm4gZGVmYXVsdEluZGVudFNpZ247XG4gICAgfVxuXG4gICAgZChcInVuYWJsZSB0byBkZXRlY3RcIik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpc0N1cnNvckluTGlzdChlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yKSB7XG4gICAgcmV0dXJuIHRoaXMuZGV0ZWN0TGlzdEluZGVudFNpZ24oZWRpdG9yLCBlZGl0b3IuZ2V0Q3Vyc29yKCkpICE9PSBudWxsO1xuICB9XG59XG4iLCJpbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gXCIuL3NldHRpbmdzXCI7XG5cbmV4cG9ydCBjbGFzcyBMb2dnZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNldHRpbmdzOiBTZXR0aW5ncykge31cblxuICBsb2cobWV0aG9kOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgaWYgKCF0aGlzLnNldHRpbmdzLmRlYnVnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc29sZS5pbmZvKG1ldGhvZCwgLi4uYXJncyk7XG4gIH1cblxuICBiaW5kKG1ldGhvZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuICguLi5hcmdzOiBhbnlbXSkgPT4gdGhpcy5sb2cobWV0aG9kLCAuLi5hcmdzKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tIFwiLi4vc2V0dGluZ3NcIjtcbmltcG9ydCB7IFBsdWdpbl8yIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBJRmVhdHVyZSB9IGZyb20gXCIuLi9mZWF0dXJlXCI7XG5pbXBvcnQgeyBPYnNpZGlhblV0aWxzIH0gZnJvbSBcIi4uL29ic2lkaWFuX3V0aWxzXCI7XG5cbmNvbnN0IHRleHQgPSAoc2l6ZTogbnVtYmVyKSA9PlxuICBgT3V0bGluZXIgc3R5bGVzIGRvZXNuJ3Qgd29yayB3aXRoICR7c2l6ZX0tc3BhY2VzLXRhYnMuIFBsZWFzZSBjaGVjayB5b3VyIE9ic2lkaWFuIHNldHRpbmdzLmA7XG5cbmV4cG9ydCBjbGFzcyBMaXN0c1N0eWxlc0ZlYXR1cmUgaW1wbGVtZW50cyBJRmVhdHVyZSB7XG4gIHByaXZhdGUgc3RhdHVzQmFyVGV4dDogSFRNTEVsZW1lbnQ7XG4gIHByaXZhdGUgaW50ZXJ2YWw6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBzZXR0aW5nczogU2V0dGluZ3MsXG4gICAgcHJpdmF0ZSBvYnNpZGlhblV0aWxzOiBPYnNpZGlhblV0aWxzXG4gICkge31cblxuICBhc3luYyBsb2FkKCkge1xuICAgIGlmICh0aGlzLnNldHRpbmdzLnN0eWxlTGlzdHMpIHtcbiAgICAgIHRoaXMuYWRkTGlzdHNTdHlsZXMoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2V0dGluZ3Muem9vbU9uQ2xpY2spIHtcbiAgICAgIHRoaXMuYWRkWm9vbVN0eWxlcygpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0dGluZ3Mub25DaGFuZ2UoXCJzdHlsZUxpc3RzXCIsIHRoaXMub25TdHlsZUxpc3RzU2V0dGluZ0NoYW5nZSk7XG4gICAgdGhpcy5zZXR0aW5ncy5vbkNoYW5nZShcInpvb21PbkNsaWNrXCIsIHRoaXMub25ab29tT25DbGlja1NldHRpbmdDaGFuZ2UpO1xuXG4gICAgdGhpcy5hZGRTdGF0dXNCYXJUZXh0KCk7XG4gICAgdGhpcy5zdGFydFN0YXR1c0JhckludGVydmFsKCk7XG4gIH1cblxuICBhc3luYyB1bmxvYWQoKSB7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICBpZiAodGhpcy5zdGF0dXNCYXJUZXh0LnBhcmVudEVsZW1lbnQpIHtcbiAgICAgIHRoaXMuc3RhdHVzQmFyVGV4dC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuc3RhdHVzQmFyVGV4dCk7XG4gICAgfVxuICAgIHRoaXMuc2V0dGluZ3MucmVtb3ZlQ2FsbGJhY2soXG4gICAgICBcInpvb21PbkNsaWNrXCIsXG4gICAgICB0aGlzLm9uWm9vbU9uQ2xpY2tTZXR0aW5nQ2hhbmdlXG4gICAgKTtcbiAgICB0aGlzLnNldHRpbmdzLnJlbW92ZUNhbGxiYWNrKFwic3R5bGVMaXN0c1wiLCB0aGlzLm9uU3R5bGVMaXN0c1NldHRpbmdDaGFuZ2UpO1xuICAgIHRoaXMucmVtb3ZlTGlzdHNTdHlsZXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhcnRTdGF0dXNCYXJJbnRlcnZhbCgpIHtcbiAgICBsZXQgdmlzaWJsZTogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgICB0aGlzLmludGVydmFsID0gd2luZG93LnNldEludGVydmFsKCgpID0+IHtcbiAgICAgIGNvbnN0IHsgdXNlVGFiLCB0YWJTaXplIH0gPSB0aGlzLm9ic2lkaWFuVXRpbHMuZ2V0T2JzaWRpYW5UYWJzU2V0dGlnbnMoKTtcblxuICAgICAgY29uc3Qgc2hvdWxkQmVWaXNpYmxlID1cbiAgICAgICAgdGhpcy5zZXR0aW5ncy5zdHlsZUxpc3RzICYmIHVzZVRhYiAmJiB0YWJTaXplICE9PSA0O1xuXG4gICAgICBpZiAoc2hvdWxkQmVWaXNpYmxlICYmIHZpc2libGUgIT09IHRhYlNpemUpIHtcbiAgICAgICAgdGhpcy5zdGF0dXNCYXJUZXh0LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgIHRoaXMuc3RhdHVzQmFyVGV4dC5zZXRUZXh0KHRleHQodGFiU2l6ZSkpO1xuICAgICAgICB2aXNpYmxlID0gdGFiU2l6ZTtcbiAgICAgIH0gZWxzZSBpZiAoIXNob3VsZEJlVmlzaWJsZSAmJiB2aXNpYmxlICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuc3RhdHVzQmFyVGV4dC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIHZpc2libGUgPSBudWxsO1xuICAgICAgfVxuICAgIH0sIDEwMDApO1xuICB9XG5cbiAgcHJpdmF0ZSBvblN0eWxlTGlzdHNTZXR0aW5nQ2hhbmdlID0gKHN0eWxlTGlzdHM6IGJvb2xlYW4pID0+IHtcbiAgICBpZiAoc3R5bGVMaXN0cykge1xuICAgICAgdGhpcy5hZGRMaXN0c1N0eWxlcygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbW92ZUxpc3RzU3R5bGVzKCk7XG4gICAgfVxuICB9O1xuXG4gIHByaXZhdGUgb25ab29tT25DbGlja1NldHRpbmdDaGFuZ2UgPSAoem9vbU9uQ2xpY2s6IGJvb2xlYW4pID0+IHtcbiAgICBpZiAoem9vbU9uQ2xpY2spIHtcbiAgICAgIHRoaXMuYWRkWm9vbVN0eWxlcygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbW92ZVpvb21TdHlsZXMoKTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSBhZGRTdGF0dXNCYXJUZXh0KCkge1xuICAgIHRoaXMuc3RhdHVzQmFyVGV4dCA9IHRoaXMucGx1Z2luLmFkZFN0YXR1c0Jhckl0ZW0oKTtcbiAgICB0aGlzLnN0YXR1c0JhclRleHQuc3R5bGUuY29sb3IgPSBcInJlZFwiO1xuICAgIHRoaXMuc3RhdHVzQmFyVGV4dC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gIH1cblxuICBwcml2YXRlIGFkZExpc3RzU3R5bGVzKCkge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChcIm91dGxpbmVyLXBsdWdpbi1ibHNcIik7XG4gIH1cblxuICBwcml2YXRlIHJlbW92ZUxpc3RzU3R5bGVzKCkge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcIm91dGxpbmVyLXBsdWdpbi1ibHNcIik7XG4gIH1cblxuICBwcml2YXRlIGFkZFpvb21TdHlsZXMoKSB7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKFwib3V0bGluZXItcGx1Z2luLWJscy16b29tXCIpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVab29tU3R5bGVzKCkge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcIm91dGxpbmVyLXBsdWdpbi1ibHMtem9vbVwiKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUGx1Z2luXzIgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IEVkaXRvclV0aWxzIH0gZnJvbSBcIi4uL2VkaXRvcl91dGlsc1wiO1xuaW1wb3J0IHsgSUZlYXR1cmUgfSBmcm9tIFwiLi4vZmVhdHVyZVwiO1xuaW1wb3J0IHsgTGlzdFV0aWxzIH0gZnJvbSBcIi4uL2xpc3RfdXRpbHNcIjtcbmltcG9ydCB7IFNldHRpbmdzIH0gZnJvbSBcIi4uL3NldHRpbmdzXCI7XG5cbmZ1bmN0aW9uIGlzRW50ZXIoZTogS2V5Ym9hcmRFdmVudCkge1xuICByZXR1cm4gKFxuICAgIChlLmtleUNvZGUgPT09IDEzIHx8IGUuY29kZSA9PT0gXCJFbnRlclwiKSAmJlxuICAgIGUuc2hpZnRLZXkgPT09IGZhbHNlICYmXG4gICAgZS5tZXRhS2V5ID09PSBmYWxzZSAmJlxuICAgIGUuYWx0S2V5ID09PSBmYWxzZSAmJlxuICAgIGUuY3RybEtleSA9PT0gZmFsc2VcbiAgKTtcbn1cblxuZXhwb3J0IGNsYXNzIEVudGVyT3V0ZGVudElmTGluZUlzRW1wdHlGZWF0dXJlIGltcGxlbWVudHMgSUZlYXR1cmUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBzZXR0aW5nczogU2V0dGluZ3MsXG4gICAgcHJpdmF0ZSBlZGl0b3JVdGlsczogRWRpdG9yVXRpbHMsXG4gICAgcHJpdmF0ZSBsaXN0VXRpbHM6IExpc3RVdGlsc1xuICApIHt9XG5cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5yZWdpc3RlckNvZGVNaXJyb3IoKGNtKSA9PiB7XG4gICAgICBjbS5vbihcImtleWRvd25cIiwgdGhpcy5vbktleURvd24pO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdW5sb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLmFwcC53b3Jrc3BhY2UuaXRlcmF0ZUNvZGVNaXJyb3JzKChjbSkgPT4ge1xuICAgICAgY20ub2ZmKFwia2V5ZG93blwiLCB0aGlzLm9uS2V5RG93bik7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIG91dGRlbnRJZkxpbmVJc0VtcHR5KGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IpIHtcbiAgICBpZiAoIXRoaXMuZWRpdG9yVXRpbHMuY29udGFpbnNTaW5nbGVDdXJzb3IoZWRpdG9yKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHJvb3QgPSB0aGlzLmxpc3RVdGlscy5wYXJzZUxpc3QoZWRpdG9yKTtcblxuICAgIGlmICghcm9vdCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IGxpc3QgPSByb290LmdldExpc3RVbmRlckN1cnNvcigpO1xuXG4gICAgaWYgKGxpc3QuZ2V0Q29udGVudCgpLmxlbmd0aCA+IDAgfHwgbGlzdC5nZXRMZXZlbCgpID09PSAxKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcm9vdC5tb3ZlTGVmdCgpO1xuXG4gICAgdGhpcy5saXN0VXRpbHMuYXBwbHlDaGFuZ2VzKGVkaXRvciwgcm9vdCk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgb25LZXlEb3duID0gKGNtOiBDb2RlTWlycm9yLkVkaXRvciwgZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgIGlmICghdGhpcy5zZXR0aW5ncy5iZXR0ZXJFbnRlciB8fCAhaXNFbnRlcihlKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHdvcmtlZCA9IHRoaXMub3V0ZGVudElmTGluZUlzRW1wdHkoY20pO1xuXG4gICAgaWYgKHdvcmtlZCkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH07XG59XG4iLCJpbXBvcnQgeyBQbHVnaW5fMiB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgRWRpdG9yVXRpbHMgfSBmcm9tIFwic3JjL2VkaXRvcl91dGlsc1wiO1xuaW1wb3J0IHsgSUZlYXR1cmUgfSBmcm9tIFwiLi4vZmVhdHVyZVwiO1xuaW1wb3J0IHsgTGlzdFV0aWxzIH0gZnJvbSBcIi4uL2xpc3RfdXRpbHNcIjtcbmltcG9ydCB7IFNldHRpbmdzIH0gZnJvbSBcIi4uL3NldHRpbmdzXCI7XG5cbmZ1bmN0aW9uIGlzRW50ZXIoZTogS2V5Ym9hcmRFdmVudCkge1xuICByZXR1cm4gKFxuICAgIChlLmtleUNvZGUgPT09IDEzIHx8IGUuY29kZSA9PT0gXCJFbnRlclwiKSAmJlxuICAgIGUuc2hpZnRLZXkgPT09IGZhbHNlICYmXG4gICAgZS5tZXRhS2V5ID09PSBmYWxzZSAmJlxuICAgIGUuYWx0S2V5ID09PSBmYWxzZSAmJlxuICAgIGUuY3RybEtleSA9PT0gZmFsc2VcbiAgKTtcbn1cblxuZXhwb3J0IGNsYXNzIEVudGVyU2hvdWxkQ3JlYXRlTmV3bGluZU9uQ2hpbGRMZXZlbEZlYXR1cmUgaW1wbGVtZW50cyBJRmVhdHVyZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcGx1Z2luOiBQbHVnaW5fMixcbiAgICBwcml2YXRlIHNldHRpbmdzOiBTZXR0aW5ncyxcbiAgICBwcml2YXRlIGVkaXRvclV0aWxzOiBFZGl0b3JVdGlscyxcbiAgICBwcml2YXRlIGxpc3RVdGlsczogTGlzdFV0aWxzXG4gICkge31cblxuICBhc3luYyBsb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLnJlZ2lzdGVyQ29kZU1pcnJvcigoY20pID0+IHtcbiAgICAgIGNtLm9uKFwia2V5ZG93blwiLCB0aGlzLm9uS2V5RG93bik7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyB1bmxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4uYXBwLndvcmtzcGFjZS5pdGVyYXRlQ29kZU1pcnJvcnMoKGNtKSA9PiB7XG4gICAgICBjbS5vZmYoXCJrZXlkb3duXCIsIHRoaXMub25LZXlEb3duKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgb25LZXlEb3duID0gKGNtOiBDb2RlTWlycm9yLkVkaXRvciwgZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgIGlmIChcbiAgICAgICF0aGlzLnNldHRpbmdzLmJldHRlckVudGVyIHx8XG4gICAgICAhaXNFbnRlcihlKSB8fFxuICAgICAgIXRoaXMuZWRpdG9yVXRpbHMuY29udGFpbnNTaW5nbGVDdXJzb3IoY20pXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgcm9vdCA9IHRoaXMubGlzdFV0aWxzLnBhcnNlTGlzdChjbSk7XG5cbiAgICBpZiAoIXJvb3QpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB3b3JrZWQgPSByb290LmNyZWF0ZU5ld2xpbmVPbkNoaWxkTGV2ZWwoKTtcblxuICAgIGlmICh3b3JrZWQpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB0aGlzLmxpc3RVdGlscy5hcHBseUNoYW5nZXMoY20sIHJvb3QpO1xuICAgIH1cbiAgfTtcbn1cbiIsImltcG9ydCB7IFBsdWdpbl8yIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBJRmVhdHVyZSB9IGZyb20gXCJzcmMvZmVhdHVyZVwiO1xuaW1wb3J0IHsgTGlzdFV0aWxzIH0gZnJvbSBcInNyYy9saXN0X3V0aWxzXCI7XG5pbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gXCJzcmMvc2V0dGluZ3NcIjtcblxuZXhwb3J0IGNsYXNzIE1vdmVDdXJzb3JUb1ByZXZpb3VzVW5mb2xkZWRMaW5lRmVhdHVyZSBpbXBsZW1lbnRzIElGZWF0dXJlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwbHVnaW46IFBsdWdpbl8yLFxuICAgIHByaXZhdGUgc2V0dGluZ3M6IFNldHRpbmdzLFxuICAgIHByaXZhdGUgbGlzdHNVdGlsczogTGlzdFV0aWxzXG4gICkge31cblxuICBhc3luYyBsb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLnJlZ2lzdGVyQ29kZU1pcnJvcigoY20pID0+IHtcbiAgICAgIGNtLm9uKFwiYmVmb3JlU2VsZWN0aW9uQ2hhbmdlXCIsIHRoaXMuaGFuZGxlQmVmb3JlU2VsZWN0aW9uQ2hhbmdlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHVubG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5hcHAud29ya3NwYWNlLml0ZXJhdGVDb2RlTWlycm9ycygoY20pID0+IHtcbiAgICAgIGNtLm9mZihcImJlZm9yZVNlbGVjdGlvbkNoYW5nZVwiLCB0aGlzLmhhbmRsZUJlZm9yZVNlbGVjdGlvbkNoYW5nZSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGl0ZXJhdGVXaGlsZUZvbGRlZChcbiAgICBlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yLFxuICAgIHBvczogQ29kZU1pcnJvci5Qb3NpdGlvbixcbiAgICBpbmM6IChwb3M6IENvZGVNaXJyb3IuUG9zaXRpb24pID0+IHZvaWRcbiAgKSB7XG4gICAgbGV0IGZvbGRlZCA9IGZhbHNlO1xuICAgIGRvIHtcbiAgICAgIGluYyhwb3MpO1xuICAgICAgZm9sZGVkID0gKGVkaXRvciBhcyBhbnkpLmlzRm9sZGVkKHBvcyk7XG4gICAgfSB3aGlsZSAoZm9sZGVkKTtcbiAgICByZXR1cm4gcG9zO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVCZWZvcmVTZWxlY3Rpb25DaGFuZ2UgPSAoXG4gICAgY206IENvZGVNaXJyb3IuRWRpdG9yLFxuICAgIGNoYW5nZU9iajogQ29kZU1pcnJvci5FZGl0b3JTZWxlY3Rpb25DaGFuZ2VcbiAgKSA9PiB7XG4gICAgaWYgKFxuICAgICAgIXRoaXMuc2V0dGluZ3Muc3RpY2tDdXJzb3IgfHxcbiAgICAgIGNoYW5nZU9iai5vcmlnaW4gIT09IFwiK21vdmVcIiB8fFxuICAgICAgY2hhbmdlT2JqLnJhbmdlcy5sZW5ndGggPiAxXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcmFuZ2UgPSBjaGFuZ2VPYmoucmFuZ2VzWzBdO1xuICAgIGNvbnN0IGN1cnNvciA9IGNtLmdldEN1cnNvcigpO1xuXG4gICAgaWYgKFxuICAgICAgcmFuZ2UuYW5jaG9yLmxpbmUgIT09IHJhbmdlLmhlYWQubGluZSB8fFxuICAgICAgcmFuZ2UuYW5jaG9yLmNoICE9PSByYW5nZS5oZWFkLmNoXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGN1cnNvci5saW5lIDw9IDAgfHwgY3Vyc29yLmxpbmUgIT09IHJhbmdlLmFuY2hvci5saW5lKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgcm9vdCA9IHRoaXMubGlzdHNVdGlscy5wYXJzZUxpc3QoY20pO1xuXG4gICAgaWYgKCFyb290KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbGlzdCA9IHJvb3QuZ2V0TGlzdFVuZGVyQ3Vyc29yKCk7XG4gICAgY29uc3QgbGlzdENvbnRlbnRTdGFydENoID0gbGlzdC5nZXRDb250ZW50U3RhcnRDaCgpO1xuXG4gICAgaWYgKFxuICAgICAgY3Vyc29yLmNoID09PSBsaXN0Q29udGVudFN0YXJ0Q2ggJiZcbiAgICAgIHJhbmdlLmFuY2hvci5jaCA9PT0gbGlzdENvbnRlbnRTdGFydENoIC0gMVxuICAgICkge1xuICAgICAgY29uc3QgbmV3Q3Vyc29yID0gdGhpcy5pdGVyYXRlV2hpbGVGb2xkZWQoXG4gICAgICAgIGNtLFxuICAgICAgICB7XG4gICAgICAgICAgbGluZTogY3Vyc29yLmxpbmUsXG4gICAgICAgICAgY2g6IDAsXG4gICAgICAgIH0sXG4gICAgICAgIChwb3MpID0+IHtcbiAgICAgICAgICBwb3MubGluZS0tO1xuICAgICAgICAgIHBvcy5jaCA9IGNtLmdldExpbmUocG9zLmxpbmUpLmxlbmd0aCAtIDE7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgICBuZXdDdXJzb3IuY2grKztcbiAgICAgIHJhbmdlLmFuY2hvci5saW5lID0gbmV3Q3Vyc29yLmxpbmU7XG4gICAgICByYW5nZS5hbmNob3IuY2ggPSBuZXdDdXJzb3IuY2g7XG4gICAgICByYW5nZS5oZWFkLmxpbmUgPSBuZXdDdXJzb3IubGluZTtcbiAgICAgIHJhbmdlLmhlYWQuY2ggPSBuZXdDdXJzb3IuY2g7XG4gICAgICBjaGFuZ2VPYmoudXBkYXRlKFtyYW5nZV0pO1xuICAgIH1cbiAgfTtcbn1cbiIsImltcG9ydCB7IFBsdWdpbl8yIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBFZGl0b3JVdGlscyB9IGZyb20gXCJzcmMvZWRpdG9yX3V0aWxzXCI7XG5pbXBvcnQgeyBJRmVhdHVyZSB9IGZyb20gXCJzcmMvZmVhdHVyZVwiO1xuaW1wb3J0IHsgTGlzdFV0aWxzIH0gZnJvbSBcInNyYy9saXN0X3V0aWxzXCI7XG5pbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gXCJzcmMvc2V0dGluZ3NcIjtcblxuZXhwb3J0IGNsYXNzIEVuc3VyZUN1cnNvckluTGlzdENvbnRlbnRGZWF0dXJlIGltcGxlbWVudHMgSUZlYXR1cmUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBzZXR0aW5nczogU2V0dGluZ3MsXG4gICAgcHJpdmF0ZSBlZGl0b3JVdGlsczogRWRpdG9yVXRpbHMsXG4gICAgcHJpdmF0ZSBsaXN0c1V0aWxzOiBMaXN0VXRpbHNcbiAgKSB7fVxuXG4gIGFzeW5jIGxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4ucmVnaXN0ZXJDb2RlTWlycm9yKChjbSkgPT4ge1xuICAgICAgY20ub24oXCJjdXJzb3JBY3Rpdml0eVwiLCB0aGlzLmhhbmRsZUN1cnNvckFjdGl2aXR5KTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHVubG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5hcHAud29ya3NwYWNlLml0ZXJhdGVDb2RlTWlycm9ycygoY20pID0+IHtcbiAgICAgIGNtLm9mZihcImN1cnNvckFjdGl2aXR5XCIsIHRoaXMuaGFuZGxlQ3Vyc29yQWN0aXZpdHkpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBlbnN1cmVDdXJzb3JJbkxpc3RDb250ZW50KGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IpIHtcbiAgICBjb25zdCBjdXJzb3IgPSBlZGl0b3IuZ2V0Q3Vyc29yKCk7XG4gICAgY29uc3QgaW5kZW50U2lnbiA9IHRoaXMubGlzdHNVdGlscy5kZXRlY3RMaXN0SW5kZW50U2lnbihlZGl0b3IsIGN1cnNvcik7XG5cbiAgICBpZiAoaW5kZW50U2lnbiA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGxpbmUgPSBlZGl0b3IuZ2V0TGluZShjdXJzb3IubGluZSk7XG4gICAgY29uc3QgbGluZVByZWZpeCA9IHRoaXMubGlzdHNVdGlscy5nZXRMaXN0TGluZUluZm8obGluZSwgaW5kZW50U2lnbilcbiAgICAgIC5wcmVmaXhMZW5ndGg7XG5cbiAgICBpZiAoY3Vyc29yLmNoIDwgbGluZVByZWZpeCkge1xuICAgICAgY3Vyc29yLmNoID0gbGluZVByZWZpeDtcbiAgICAgIGVkaXRvci5zZXRDdXJzb3IoY3Vyc29yKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGVuc3VyZUN1cnNvcklzSW5VbmZvbGRlZExpbmUoZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcikge1xuICAgIGNvbnN0IGN1cnNvciA9IGVkaXRvci5nZXRDdXJzb3IoKTtcblxuICAgIGNvbnN0IG1hcmsgPSBlZGl0b3IuZmluZE1hcmtzQXQoY3Vyc29yKS5maW5kKChtKSA9PiAobSBhcyBhbnkpLl9faXNGb2xkKTtcblxuICAgIGlmICghbWFyaykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGZpcnN0Rm9sZGluZ0xpbmU6IENvZGVNaXJyb3IuTGluZUhhbmRsZSA9IChtYXJrIGFzIGFueSkubGluZXNbMF07XG5cbiAgICBpZiAoIWZpcnN0Rm9sZGluZ0xpbmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsaW5lTm8gPSBlZGl0b3IuZ2V0TGluZU51bWJlcihmaXJzdEZvbGRpbmdMaW5lKTtcblxuICAgIGlmIChsaW5lTm8gIT09IGN1cnNvci5saW5lKSB7XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yKHtcbiAgICAgICAgbGluZTogbGluZU5vLFxuICAgICAgICBjaDogZWRpdG9yLmdldExpbmUobGluZU5vKS5sZW5ndGgsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZUN1cnNvckFjdGl2aXR5ID0gKGNtOiBDb2RlTWlycm9yLkVkaXRvcikgPT4ge1xuICAgIGlmIChcbiAgICAgIHRoaXMuc2V0dGluZ3Muc3RpY2tDdXJzb3IgJiZcbiAgICAgIHRoaXMuZWRpdG9yVXRpbHMuY29udGFpbnNTaW5nbGVDdXJzb3IoY20pICYmXG4gICAgICB0aGlzLmxpc3RzVXRpbHMuaXNDdXJzb3JJbkxpc3QoY20pXG4gICAgKSB7XG4gICAgICB0aGlzLmVuc3VyZUN1cnNvcklzSW5VbmZvbGRlZExpbmUoY20pO1xuICAgICAgdGhpcy5lbnN1cmVDdXJzb3JJbkxpc3RDb250ZW50KGNtKTtcbiAgICB9XG4gIH07XG59XG4iLCJpbXBvcnQgeyBQbHVnaW5fMiB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgRWRpdG9yVXRpbHMgfSBmcm9tIFwic3JjL2VkaXRvcl91dGlsc1wiO1xuaW1wb3J0IHsgSUZlYXR1cmUgfSBmcm9tIFwic3JjL2ZlYXR1cmVcIjtcbmltcG9ydCB7IExpc3RVdGlscyB9IGZyb20gXCJzcmMvbGlzdF91dGlsc1wiO1xuaW1wb3J0IHsgUm9vdCB9IGZyb20gXCJzcmMvcm9vdFwiO1xuaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tIFwic3JjL3NldHRpbmdzXCI7XG5cbmV4cG9ydCBjbGFzcyBEZWxldGVTaG91bGRJZ25vcmVCdWxsZXRzRmVhdHVyZSBpbXBsZW1lbnRzIElGZWF0dXJlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwbHVnaW46IFBsdWdpbl8yLFxuICAgIHByaXZhdGUgc2V0dGluZ3M6IFNldHRpbmdzLFxuICAgIHByaXZhdGUgZWRpdG9yVXRpbHM6IEVkaXRvclV0aWxzLFxuICAgIHByaXZhdGUgbGlzdHNVdGlsczogTGlzdFV0aWxzXG4gICkge31cblxuICBhc3luYyBsb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLnJlZ2lzdGVyQ29kZU1pcnJvcigoY20pID0+IHtcbiAgICAgIGNtLm9uKFwiYmVmb3JlQ2hhbmdlXCIsIHRoaXMuaGFuZGxlQmVmb3JlQ2hhbmdlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHVubG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5hcHAud29ya3NwYWNlLml0ZXJhdGVDb2RlTWlycm9ycygoY20pID0+IHtcbiAgICAgIGNtLm9mZihcImJlZm9yZUNoYW5nZVwiLCB0aGlzLmhhbmRsZUJlZm9yZUNoYW5nZSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZUJlZm9yZUNoYW5nZSA9IChcbiAgICBjbTogQ29kZU1pcnJvci5FZGl0b3IsXG4gICAgY2hhbmdlT2JqOiBDb2RlTWlycm9yLkVkaXRvckNoYW5nZUNhbmNlbGxhYmxlXG4gICkgPT4ge1xuICAgIGlmIChcbiAgICAgIGNoYW5nZU9iai5vcmlnaW4gIT09IFwiK2RlbGV0ZVwiIHx8XG4gICAgICAhdGhpcy5zZXR0aW5ncy5zdGlja0N1cnNvciB8fFxuICAgICAgIXRoaXMuZWRpdG9yVXRpbHMuY29udGFpbnNTaW5nbGVDdXJzb3IoY20pXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgcm9vdCA9IHRoaXMubGlzdHNVdGlscy5wYXJzZUxpc3QoY20pO1xuXG4gICAgaWYgKCFyb290KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbGlzdCA9IHJvb3QuZ2V0TGlzdFVuZGVyQ3Vyc29yKCk7XG4gICAgY29uc3QgbGlzdENvbnRlbnRTdGFydENoID0gbGlzdC5nZXRDb250ZW50U3RhcnRDaCgpO1xuICAgIGNvbnN0IGxpc3RDb250ZW50RW5kQ2ggPSBsaXN0LmdldENvbnRlbnRFbmRDaCgpO1xuXG4gICAgaWYgKHRoaXMuaXNCYWNrc3BhY2VPbkNvbnRlbnRTdGFydChjaGFuZ2VPYmosIGxpc3RDb250ZW50U3RhcnRDaCkpIHtcbiAgICAgIHRoaXMuZGVsZXRlSXRlbUFuZE1lcmdlQ29udGVudFdpdGhQcmV2aW91c0xpbmUoY20sIHJvb3QsIGNoYW5nZU9iaik7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzRGVsZXRpb25JbmNsdWRlc0J1bGxldChjaGFuZ2VPYmosIGxpc3RDb250ZW50U3RhcnRDaCkpIHtcbiAgICAgIHRoaXMubGltaXREZWxldGVSYW5nZVRvQ29udGVudFJhbmdlKGNoYW5nZU9iaiwgbGlzdENvbnRlbnRTdGFydENoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNEZWxldGVPbkxpbmVFbmQoY2hhbmdlT2JqLCBsaXN0Q29udGVudEVuZENoKSkge1xuICAgICAgdGhpcy5kZWxldGVOZXh0SXRlbUFuZE1lcmdlQ29udGVudFdpdGhDdXJyZW50TGluZShjbSwgcm9vdCwgY2hhbmdlT2JqKTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSBpc0RlbGV0ZU9uTGluZUVuZChcbiAgICBjaGFuZ2VPYmo6IENvZGVNaXJyb3IuRWRpdG9yQ2hhbmdlQ2FuY2VsbGFibGUsXG4gICAgbGlzdENvbnRlbnRFbmRDaDogbnVtYmVyXG4gICkge1xuICAgIHJldHVybiAoXG4gICAgICBjaGFuZ2VPYmouZnJvbS5saW5lICsgMSA9PT0gY2hhbmdlT2JqLnRvLmxpbmUgJiZcbiAgICAgIGNoYW5nZU9iai5mcm9tLmNoID09PSBsaXN0Q29udGVudEVuZENoICYmXG4gICAgICBjaGFuZ2VPYmoudG8uY2ggPT09IDBcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBpc0RlbGV0aW9uSW5jbHVkZXNCdWxsZXQoXG4gICAgY2hhbmdlT2JqOiBDb2RlTWlycm9yLkVkaXRvckNoYW5nZUNhbmNlbGxhYmxlLFxuICAgIGxpc3RDb250ZW50U3RhcnRDaDogbnVtYmVyXG4gICkge1xuICAgIHJldHVybiAoXG4gICAgICBjaGFuZ2VPYmouZnJvbS5saW5lID09PSBjaGFuZ2VPYmoudG8ubGluZSAmJlxuICAgICAgY2hhbmdlT2JqLmZyb20uY2ggPCBsaXN0Q29udGVudFN0YXJ0Q2hcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBpc0JhY2tzcGFjZU9uQ29udGVudFN0YXJ0KFxuICAgIGNoYW5nZU9iajogQ29kZU1pcnJvci5FZGl0b3JDaGFuZ2VDYW5jZWxsYWJsZSxcbiAgICBsaXN0Q29udGVudFN0YXJ0Q2g6IG51bWJlclxuICApIHtcbiAgICByZXR1cm4gKFxuICAgICAgY2hhbmdlT2JqLmZyb20ubGluZSA9PT0gY2hhbmdlT2JqLnRvLmxpbmUgJiZcbiAgICAgIGNoYW5nZU9iai5mcm9tLmNoID09PSBsaXN0Q29udGVudFN0YXJ0Q2ggLSAxICYmXG4gICAgICBjaGFuZ2VPYmoudG8uY2ggPT09IGxpc3RDb250ZW50U3RhcnRDaFxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIGxpbWl0RGVsZXRlUmFuZ2VUb0NvbnRlbnRSYW5nZShcbiAgICBjaGFuZ2VPYmo6IENvZGVNaXJyb3IuRWRpdG9yQ2hhbmdlQ2FuY2VsbGFibGUsXG4gICAgbGlzdENvbnRlbnRTdGFydENoOiBudW1iZXJcbiAgKSB7XG4gICAgY29uc3QgZnJvbSA9IHtcbiAgICAgIGxpbmU6IGNoYW5nZU9iai5mcm9tLmxpbmUsXG4gICAgICBjaDogbGlzdENvbnRlbnRTdGFydENoLFxuICAgIH07XG4gICAgY2hhbmdlT2JqLnVwZGF0ZShmcm9tLCBjaGFuZ2VPYmoudG8sIGNoYW5nZU9iai50ZXh0KTtcbiAgfVxuXG4gIHByaXZhdGUgZGVsZXRlSXRlbUFuZE1lcmdlQ29udGVudFdpdGhQcmV2aW91c0xpbmUoXG4gICAgZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcixcbiAgICByb290OiBSb290LFxuICAgIGNoYW5nZU9iajogQ29kZU1pcnJvci5FZGl0b3JDaGFuZ2VDYW5jZWxsYWJsZVxuICApIHtcbiAgICBjb25zdCBsaXN0ID0gcm9vdC5nZXRMaXN0VW5kZXJDdXJzb3IoKTtcbiAgICBpZiAoXG4gICAgICByb290LmdldExpc3RTdGFydFBvc2l0aW9uKCkubGluZSA9PT0gcm9vdC5nZXRMaW5lTnVtYmVyT2YobGlzdCkgJiZcbiAgICAgIGxpc3QuZ2V0Q2hpbGRyZW4oKS5sZW5ndGggPT09IDBcbiAgICApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCByZXMgPSByb290LmRlbGV0ZUFuZE1lcmdlV2l0aFByZXZpb3VzKCk7XG5cbiAgICBpZiAocmVzKSB7XG4gICAgICBjaGFuZ2VPYmouY2FuY2VsKCk7XG4gICAgICB0aGlzLmxpc3RzVXRpbHMuYXBwbHlDaGFuZ2VzKGVkaXRvciwgcm9vdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIHByaXZhdGUgZGVsZXRlTmV4dEl0ZW1BbmRNZXJnZUNvbnRlbnRXaXRoQ3VycmVudExpbmUoXG4gICAgZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcixcbiAgICByb290OiBSb290LFxuICAgIGNoYW5nZU9iajogQ29kZU1pcnJvci5FZGl0b3JDaGFuZ2VDYW5jZWxsYWJsZVxuICApIHtcbiAgICBjb25zdCBsaXN0ID0gcm9vdC5nZXRMaXN0VW5kZXJDdXJzb3IoKTtcbiAgICBjb25zdCBuZXh0TGluZU5vID0gcm9vdC5nZXRDdXJzb3IoKS5saW5lICsgMTtcbiAgICBjb25zdCBuZXh0TGlzdCA9IHJvb3QuZ2V0TGlzdFVuZGVyTGluZShuZXh0TGluZU5vKTtcblxuICAgIGlmICghbmV4dExpc3QgfHwgcm9vdC5nZXRDdXJzb3IoKS5jaCAhPT0gbGlzdC5nZXRDb250ZW50RW5kQ2goKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJvb3QucmVwbGFjZUN1cnNvcih7XG4gICAgICBsaW5lOiBuZXh0TGluZU5vLFxuICAgICAgY2g6IG5leHRMaXN0LmdldENvbnRlbnRTdGFydENoKCksXG4gICAgfSk7XG5cbiAgICBjb25zdCByZXMgPSByb290LmRlbGV0ZUFuZE1lcmdlV2l0aFByZXZpb3VzKCk7XG4gICAgY29uc3QgcmVhbGx5Q2hhbmdlZCA9IHJvb3QuZ2V0Q3Vyc29yKCkubGluZSAhPT0gbmV4dExpbmVObztcblxuICAgIGlmIChyZWFsbHlDaGFuZ2VkKSB7XG4gICAgICBjaGFuZ2VPYmouY2FuY2VsKCk7XG4gICAgICB0aGlzLmxpc3RzVXRpbHMuYXBwbHlDaGFuZ2VzKGVkaXRvciwgcm9vdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcztcbiAgfVxufVxuIiwiaW1wb3J0IHsgUGx1Z2luXzIgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IExpc3RVdGlscyB9IGZyb20gXCJzcmMvbGlzdF91dGlsc1wiO1xuaW1wb3J0IHsgSUZlYXR1cmUgfSBmcm9tIFwiLi4vZmVhdHVyZVwiO1xuaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tIFwiLi4vc2V0dGluZ3NcIjtcblxuZXhwb3J0IGNsYXNzIFNlbGVjdGlvblNob3VsZElnbm9yZUJ1bGxldHNGZWF0dXJlIGltcGxlbWVudHMgSUZlYXR1cmUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBzZXR0aW5nczogU2V0dGluZ3MsXG4gICAgcHJpdmF0ZSBsaXN0c1V0aWxzOiBMaXN0VXRpbHNcbiAgKSB7fVxuXG4gIGFzeW5jIGxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4ucmVnaXN0ZXJDb2RlTWlycm9yKChjbSkgPT4ge1xuICAgICAgY20ub24oXCJiZWZvcmVTZWxlY3Rpb25DaGFuZ2VcIiwgdGhpcy5oYW5kbGVCZWZvcmVTZWxlY3Rpb25DaGFuZ2UpO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdW5sb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLmFwcC53b3Jrc3BhY2UuaXRlcmF0ZUNvZGVNaXJyb3JzKChjbSkgPT4ge1xuICAgICAgY20ub2ZmKFwiYmVmb3JlU2VsZWN0aW9uQ2hhbmdlXCIsIHRoaXMuaGFuZGxlQmVmb3JlU2VsZWN0aW9uQ2hhbmdlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlQmVmb3JlU2VsZWN0aW9uQ2hhbmdlID0gKFxuICAgIGNtOiBDb2RlTWlycm9yLkVkaXRvcixcbiAgICBjaGFuZ2VPYmo6IENvZGVNaXJyb3IuRWRpdG9yU2VsZWN0aW9uQ2hhbmdlXG4gICkgPT4ge1xuICAgIGlmIChcbiAgICAgICF0aGlzLnNldHRpbmdzLnN0aWNrQ3Vyc29yIHx8XG4gICAgICBjaGFuZ2VPYmoub3JpZ2luICE9PSBcIittb3ZlXCIgfHxcbiAgICAgIGNoYW5nZU9iai5yYW5nZXMubGVuZ3RoID4gMVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJhbmdlID0gY2hhbmdlT2JqLnJhbmdlc1swXTtcblxuICAgIGlmIChcbiAgICAgIHJhbmdlLmFuY2hvci5saW5lICE9PSByYW5nZS5oZWFkLmxpbmUgfHxcbiAgICAgIHJhbmdlLmFuY2hvci5jaCA9PT0gcmFuZ2UuaGVhZC5jaFxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJvb3QgPSB0aGlzLmxpc3RzVXRpbHMucGFyc2VMaXN0KGNtKTtcblxuICAgIGlmICghcm9vdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGxpc3QgPSByb290LmdldExpc3RVbmRlckN1cnNvcigpO1xuICAgIGNvbnN0IGxpc3RDb250ZW50U3RhcnRDaCA9IGxpc3QuZ2V0Q29udGVudFN0YXJ0Q2goKTtcblxuICAgIGlmIChyYW5nZS5mcm9tKCkuY2ggPCBsaXN0Q29udGVudFN0YXJ0Q2gpIHtcbiAgICAgIHJhbmdlLmZyb20oKS5jaCA9IGxpc3RDb250ZW50U3RhcnRDaDtcbiAgICAgIGNoYW5nZU9iai51cGRhdGUoW3JhbmdlXSk7XG4gICAgfVxuICB9O1xufVxuIiwiaW1wb3J0IHsgUGx1Z2luXzIgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IExpc3RVdGlscyB9IGZyb20gXCJzcmMvbGlzdF91dGlsc1wiO1xuaW1wb3J0IHsgT2JzaWRpYW5VdGlscyB9IGZyb20gXCJzcmMvb2JzaWRpYW5fdXRpbHNcIjtcbmltcG9ydCB7IFNldHRpbmdzIH0gZnJvbSBcInNyYy9zZXR0aW5nc1wiO1xuaW1wb3J0IHsgSUZlYXR1cmUgfSBmcm9tIFwiLi4vZmVhdHVyZVwiO1xuXG5jbGFzcyBab29tU3RhdGUge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgbGluZTogQ29kZU1pcnJvci5MaW5lSGFuZGxlLCBwdWJsaWMgaGVhZGVyOiBIVE1MRWxlbWVudCkge31cbn1cblxuZXhwb3J0IGNsYXNzIFpvb21GZWF0dXJlIGltcGxlbWVudHMgSUZlYXR1cmUge1xuICBwcml2YXRlIHpvb21TdGF0ZXM6IFdlYWtNYXA8Q29kZU1pcnJvci5FZGl0b3IsIFpvb21TdGF0ZT4gPSBuZXcgV2Vha01hcCgpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcGx1Z2luOiBQbHVnaW5fMixcbiAgICBwcml2YXRlIHNldHRpbmdzOiBTZXR0aW5ncyxcbiAgICBwcml2YXRlIG9ic2lkaWFuVXRpbHM6IE9ic2lkaWFuVXRpbHMsXG4gICAgcHJpdmF0ZSBsaXN0c1V0aWxzOiBMaXN0VXRpbHNcbiAgKSB7XG4gICAgdGhpcy56b29tU3RhdGVzID0gbmV3IFdlYWtNYXAoKTtcbiAgfVxuXG4gIGFzeW5jIGxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4ucmVnaXN0ZXJDb2RlTWlycm9yKChjbSkgPT4ge1xuICAgICAgY20ub24oXCJiZWZvcmVDaGFuZ2VcIiwgdGhpcy5oYW5kbGVCZWZvcmVDaGFuZ2UpO1xuICAgICAgY20ub24oXCJjaGFuZ2VcIiwgdGhpcy5oYW5kbGVDaGFuZ2UpO1xuICAgICAgY20ub24oXCJiZWZvcmVTZWxlY3Rpb25DaGFuZ2VcIiwgdGhpcy5oYW5kbGVCZWZvcmVTZWxlY3Rpb25DaGFuZ2UpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5wbHVnaW4ucmVnaXN0ZXJEb21FdmVudCh3aW5kb3csIFwiY2xpY2tcIiwgdGhpcy5oYW5kbGVDbGljayk7XG5cbiAgICB0aGlzLnBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcInpvb20taW5cIixcbiAgICAgIG5hbWU6IFwiWm9vbSBpbiB0byB0aGUgY3VycmVudCBsaXN0IGl0ZW1cIixcbiAgICAgIGNhbGxiYWNrOiB0aGlzLm9ic2lkaWFuVXRpbHMuY3JlYXRlQ29tbWFuZENhbGxiYWNrKFxuICAgICAgICB0aGlzLnpvb21Jbi5iaW5kKHRoaXMpXG4gICAgICApLFxuICAgICAgaG90a2V5czogW1xuICAgICAgICB7XG4gICAgICAgICAgbW9kaWZpZXJzOiBbXCJNb2RcIl0sXG4gICAgICAgICAga2V5OiBcIi5cIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICB0aGlzLnBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcInpvb20tb3V0XCIsXG4gICAgICBuYW1lOiBcIlpvb20gb3V0IHRoZSBlbnRpcmUgZG9jdW1lbnRcIixcbiAgICAgIGNhbGxiYWNrOiB0aGlzLm9ic2lkaWFuVXRpbHMuY3JlYXRlQ29tbWFuZENhbGxiYWNrKFxuICAgICAgICB0aGlzLnpvb21PdXQuYmluZCh0aGlzKVxuICAgICAgKSxcbiAgICAgIGhvdGtleXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sXG4gICAgICAgICAga2V5OiBcIi5cIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyB1bmxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4uYXBwLndvcmtzcGFjZS5pdGVyYXRlQ29kZU1pcnJvcnMoKGNtKSA9PiB7XG4gICAgICBjbS5vZmYoXCJiZWZvcmVTZWxlY3Rpb25DaGFuZ2VcIiwgdGhpcy5oYW5kbGVCZWZvcmVTZWxlY3Rpb25DaGFuZ2UpO1xuICAgICAgY20ub2ZmKFwiY2hhbmdlXCIsIHRoaXMuaGFuZGxlQ2hhbmdlKTtcbiAgICAgIGNtLm9mZihcImJlZm9yZUNoYW5nZVwiLCB0aGlzLmhhbmRsZUJlZm9yZUNoYW5nZSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZUNsaWNrID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MRWxlbWVudCB8IG51bGw7XG5cbiAgICBpZiAoXG4gICAgICAhdGFyZ2V0IHx8XG4gICAgICAhdGhpcy5zZXR0aW5ncy56b29tT25DbGljayB8fFxuICAgICAgIXRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJjbS1mb3JtYXR0aW5nLWxpc3QtdWxcIilcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgd3JhcCA9IHRhcmdldDtcbiAgICB3aGlsZSAod3JhcCkge1xuICAgICAgaWYgKHdyYXAuY2xhc3NMaXN0LmNvbnRhaW5zKFwiQ29kZU1pcnJvci13cmFwXCIpKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgd3JhcCA9IHdyYXAucGFyZW50RWxlbWVudDtcbiAgICB9XG5cbiAgICBpZiAoIXdyYXApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgZm91bmRFZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yIHwgbnVsbCA9IG51bGw7XG5cbiAgICB0aGlzLnBsdWdpbi5hcHAud29ya3NwYWNlLml0ZXJhdGVDb2RlTWlycm9ycygoY20pID0+IHtcbiAgICAgIGlmIChmb3VuZEVkaXRvcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChjbS5nZXRXcmFwcGVyRWxlbWVudCgpID09PSB3cmFwKSB7XG4gICAgICAgIGZvdW5kRWRpdG9yID0gY207XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoIWZvdW5kRWRpdG9yKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcG9zID0gZm91bmRFZGl0b3IuY29vcmRzQ2hhcih7XG4gICAgICBsZWZ0OiBlLngsXG4gICAgICB0b3A6IGUueSxcbiAgICB9KTtcblxuICAgIGlmICghcG9zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICB0aGlzLnpvb21Jbihmb3VuZEVkaXRvciwgcG9zKTtcblxuICAgIGZvdW5kRWRpdG9yLnNldEN1cnNvcih7XG4gICAgICBsaW5lOiBwb3MubGluZSxcbiAgICAgIGNoOiBmb3VuZEVkaXRvci5nZXRMaW5lKHBvcy5saW5lKS5sZW5ndGgsXG4gICAgfSk7XG4gIH07XG5cbiAgcHJpdmF0ZSBoYW5kbGVCZWZvcmVDaGFuZ2UgPSAoXG4gICAgY206IENvZGVNaXJyb3IuRWRpdG9yLFxuICAgIGNoYW5nZU9iajogQ29kZU1pcnJvci5FZGl0b3JDaGFuZ2VDYW5jZWxsYWJsZVxuICApID0+IHtcbiAgICBjb25zdCB6b29tU3RhdGUgPSB0aGlzLnpvb21TdGF0ZXMuZ2V0KGNtKTtcblxuICAgIGlmIChcbiAgICAgICF6b29tU3RhdGUgfHxcbiAgICAgIGNoYW5nZU9iai5vcmlnaW4gIT09IFwic2V0VmFsdWVcIiB8fFxuICAgICAgY2hhbmdlT2JqLmZyb20ubGluZSAhPT0gMCB8fFxuICAgICAgY2hhbmdlT2JqLmZyb20uY2ggIT09IDBcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB0aWxsTGluZSA9IGNtLmxhc3RMaW5lKCk7XG4gICAgY29uc3QgdGlsbENoID0gY20uZ2V0TGluZSh0aWxsTGluZSkubGVuZ3RoO1xuXG4gICAgaWYgKGNoYW5nZU9iai50by5saW5lICE9PSB0aWxsTGluZSB8fCBjaGFuZ2VPYmoudG8uY2ggIT09IHRpbGxDaCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuem9vbU91dChjbSk7XG4gIH07XG5cbiAgcHJpdmF0ZSBoYW5kbGVDaGFuZ2UgPSAoXG4gICAgY206IENvZGVNaXJyb3IuRWRpdG9yLFxuICAgIGNoYW5nZU9iajogQ29kZU1pcnJvci5FZGl0b3JDaGFuZ2VDYW5jZWxsYWJsZVxuICApID0+IHtcbiAgICBjb25zdCB6b29tU3RhdGUgPSB0aGlzLnpvb21TdGF0ZXMuZ2V0KGNtKTtcblxuICAgIGlmICghem9vbVN0YXRlIHx8IGNoYW5nZU9iai5vcmlnaW4gIT09IFwic2V0VmFsdWVcIikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuem9vbUluKGNtLCB7XG4gICAgICBsaW5lOiBjbS5nZXRMaW5lTnVtYmVyKHpvb21TdGF0ZS5saW5lKSxcbiAgICAgIGNoOiAwLFxuICAgIH0pO1xuICB9O1xuXG4gIHByaXZhdGUgaGFuZGxlQmVmb3JlU2VsZWN0aW9uQ2hhbmdlID0gKFxuICAgIGNtOiBDb2RlTWlycm9yLkVkaXRvcixcbiAgICBjaGFuZ2VPYmo6IENvZGVNaXJyb3IuRWRpdG9yU2VsZWN0aW9uQ2hhbmdlXG4gICkgPT4ge1xuICAgIGlmICghdGhpcy56b29tU3RhdGVzLmhhcyhjbSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgdmlzaWJsZUZyb206IENvZGVNaXJyb3IuUG9zaXRpb24gfCBudWxsID0gbnVsbDtcbiAgICBsZXQgdmlzaWJsZVRpbGw6IENvZGVNaXJyb3IuUG9zaXRpb24gfCBudWxsID0gbnVsbDtcblxuICAgIGZvciAobGV0IGkgPSBjbS5maXJzdExpbmUoKTsgaSA8PSBjbS5sYXN0TGluZSgpOyBpKyspIHtcbiAgICAgIGNvbnN0IHdyYXBDbGFzcyA9IGNtLmxpbmVJbmZvKGkpLndyYXBDbGFzcyB8fCBcIlwiO1xuICAgICAgY29uc3QgaXNIaWRkZW4gPSB3cmFwQ2xhc3MuaW5jbHVkZXMoXCJvdXRsaW5lci1wbHVnaW4taGlkZGVuLXJvd1wiKTtcbiAgICAgIGlmICh2aXNpYmxlRnJvbSA9PT0gbnVsbCAmJiAhaXNIaWRkZW4pIHtcbiAgICAgICAgdmlzaWJsZUZyb20gPSB7IGxpbmU6IGksIGNoOiAwIH07XG4gICAgICB9XG4gICAgICBpZiAodmlzaWJsZUZyb20gIT09IG51bGwgJiYgdmlzaWJsZVRpbGwgIT09IG51bGwgJiYgaXNIaWRkZW4pIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAodmlzaWJsZUZyb20gIT09IG51bGwpIHtcbiAgICAgICAgdmlzaWJsZVRpbGwgPSB7IGxpbmU6IGksIGNoOiBjbS5nZXRMaW5lKGkpLmxlbmd0aCB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBjaGFuZ2VkID0gZmFsc2U7XG5cbiAgICBmb3IgKGNvbnN0IHJhbmdlIG9mIGNoYW5nZU9iai5yYW5nZXMpIHtcbiAgICAgIGlmIChyYW5nZS5hbmNob3IubGluZSA8IHZpc2libGVGcm9tLmxpbmUpIHtcbiAgICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgICAgIHJhbmdlLmFuY2hvci5saW5lID0gdmlzaWJsZUZyb20ubGluZTtcbiAgICAgICAgcmFuZ2UuYW5jaG9yLmNoID0gdmlzaWJsZUZyb20uY2g7XG4gICAgICB9XG4gICAgICBpZiAocmFuZ2UuYW5jaG9yLmxpbmUgPiB2aXNpYmxlVGlsbC5saW5lKSB7XG4gICAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgICAgICByYW5nZS5hbmNob3IubGluZSA9IHZpc2libGVUaWxsLmxpbmU7XG4gICAgICAgIHJhbmdlLmFuY2hvci5jaCA9IHZpc2libGVUaWxsLmNoO1xuICAgICAgfVxuICAgICAgaWYgKHJhbmdlLmhlYWQubGluZSA8IHZpc2libGVGcm9tLmxpbmUpIHtcbiAgICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgICAgIHJhbmdlLmhlYWQubGluZSA9IHZpc2libGVGcm9tLmxpbmU7XG4gICAgICAgIHJhbmdlLmhlYWQuY2ggPSB2aXNpYmxlRnJvbS5jaDtcbiAgICAgIH1cbiAgICAgIGlmIChyYW5nZS5oZWFkLmxpbmUgPiB2aXNpYmxlVGlsbC5saW5lKSB7XG4gICAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgICAgICByYW5nZS5oZWFkLmxpbmUgPSB2aXNpYmxlVGlsbC5saW5lO1xuICAgICAgICByYW5nZS5oZWFkLmNoID0gdmlzaWJsZVRpbGwuY2g7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZWQpIHtcbiAgICAgIGNoYW5nZU9iai51cGRhdGUoY2hhbmdlT2JqLnJhbmdlcyk7XG4gICAgfVxuICB9O1xuXG4gIHByaXZhdGUgem9vbU91dChlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yKSB7XG4gICAgY29uc3Qgem9vbVN0YXRlID0gdGhpcy56b29tU3RhdGVzLmdldChlZGl0b3IpO1xuXG4gICAgaWYgKCF6b29tU3RhdGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gZWRpdG9yLmZpcnN0TGluZSgpLCBsID0gZWRpdG9yLmxhc3RMaW5lKCk7IGkgPD0gbDsgaSsrKSB7XG4gICAgICBlZGl0b3IucmVtb3ZlTGluZUNsYXNzKGksIFwid3JhcFwiLCBcIm91dGxpbmVyLXBsdWdpbi1oaWRkZW4tcm93XCIpO1xuICAgIH1cblxuICAgIHpvb21TdGF0ZS5oZWFkZXIucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh6b29tU3RhdGUuaGVhZGVyKTtcblxuICAgIHRoaXMuem9vbVN0YXRlcy5kZWxldGUoZWRpdG9yKTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSB6b29tSW4oXG4gICAgZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcixcbiAgICBjdXJzb3I6IENvZGVNaXJyb3IuUG9zaXRpb24gPSBlZGl0b3IuZ2V0Q3Vyc29yKClcbiAgKSB7XG4gICAgY29uc3QgbGluZU5vID0gY3Vyc29yLmxpbmU7XG4gICAgY29uc3Qgcm9vdCA9IHRoaXMubGlzdHNVdGlscy5wYXJzZUxpc3QoZWRpdG9yLCBjdXJzb3IpO1xuXG4gICAgaWYgKCFyb290KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy56b29tT3V0KGVkaXRvcik7XG5cbiAgICBjb25zdCB7IGluZGVudExldmVsIH0gPSB0aGlzLmxpc3RzVXRpbHMuZ2V0TGlzdExpbmVJbmZvKFxuICAgICAgZWRpdG9yLmdldExpbmUobGluZU5vKSxcbiAgICAgIHJvb3QuZ2V0SW5kZW50U2lnbigpXG4gICAgKTtcblxuICAgIGxldCBhZnRlciA9IGZhbHNlO1xuICAgIGZvciAobGV0IGkgPSBlZGl0b3IuZmlyc3RMaW5lKCksIGwgPSBlZGl0b3IubGFzdExpbmUoKTsgaSA8PSBsOyBpKyspIHtcbiAgICAgIGlmIChpIDwgbGluZU5vKSB7XG4gICAgICAgIGVkaXRvci5hZGRMaW5lQ2xhc3MoaSwgXCJ3cmFwXCIsIFwib3V0bGluZXItcGx1Z2luLWhpZGRlbi1yb3dcIik7XG4gICAgICB9IGVsc2UgaWYgKGkgPiBsaW5lTm8gJiYgIWFmdGVyKSB7XG4gICAgICAgIGNvbnN0IGFmdGVyTGluZUluZm8gPSB0aGlzLmxpc3RzVXRpbHMuZ2V0TGlzdExpbmVJbmZvKFxuICAgICAgICAgIGVkaXRvci5nZXRMaW5lKGkpLFxuICAgICAgICAgIHJvb3QuZ2V0SW5kZW50U2lnbigpXG4gICAgICAgICk7XG4gICAgICAgIGFmdGVyID0gIWFmdGVyTGluZUluZm8gfHwgYWZ0ZXJMaW5lSW5mby5pbmRlbnRMZXZlbCA8PSBpbmRlbnRMZXZlbDtcbiAgICAgIH1cblxuICAgICAgaWYgKGFmdGVyKSB7XG4gICAgICAgIGVkaXRvci5hZGRMaW5lQ2xhc3MoaSwgXCJ3cmFwXCIsIFwib3V0bGluZXItcGx1Z2luLWhpZGRlbi1yb3dcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgY3JlYXRlU2VwYXJhdG9yID0gKCkgPT4ge1xuICAgICAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgc3Bhbi50ZXh0Q29udGVudCA9IFwiID4gXCI7XG4gICAgICByZXR1cm4gc3BhbjtcbiAgICB9O1xuXG4gICAgY29uc3QgY3JlYXRlVGl0bGUgPSAoY29udGVudDogc3RyaW5nLCBjYjogKCkgPT4gdm9pZCkgPT4ge1xuICAgICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgYS5jbGFzc05hbWUgPSBcIm91dGxpbmVyLXBsdWdpbi16b29tLXRpdGxlXCI7XG4gICAgICBpZiAoY29udGVudCkge1xuICAgICAgICBhLnRleHRDb250ZW50ID0gY29udGVudDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGEuaW5uZXJIVE1MID0gXCImbmJzcDsmbmJzcDsmbmJzcDsmbmJzcDsmbmJzcDtcIjtcbiAgICAgIH1cbiAgICAgIGEub25jbGljayA9IChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY2IoKTtcbiAgICAgIH07XG4gICAgICByZXR1cm4gYTtcbiAgICB9O1xuXG4gICAgY29uc3QgY3JlYXRlSGVhZGVyID0gKCkgPT4ge1xuICAgICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIGRpdi5jbGFzc05hbWUgPSBcIm91dGxpbmVyLXBsdWdpbi16b29tLWhlYWRlclwiO1xuXG4gICAgICBsZXQgbGlzdCA9IHJvb3QuZ2V0TGlzdFVuZGVyTGluZShsaW5lTm8pLmdldFBhcmVudCgpO1xuICAgICAgd2hpbGUgKGxpc3QgJiYgbGlzdC5nZXRQYXJlbnQoKSkge1xuICAgICAgICBjb25zdCBsaW5lTm8gPSByb290LmdldExpbmVOdW1iZXJPZihsaXN0KTtcbiAgICAgICAgZGl2LnByZXBlbmQoXG4gICAgICAgICAgY3JlYXRlVGl0bGUobGlzdC5nZXRDb250ZW50KCksICgpID0+XG4gICAgICAgICAgICB0aGlzLnpvb21JbihlZGl0b3IsIHsgbGluZTogbGluZU5vLCBjaDogMCB9KVxuICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICAgICAgZGl2LnByZXBlbmQoY3JlYXRlU2VwYXJhdG9yKCkpO1xuICAgICAgICBsaXN0ID0gbGlzdC5nZXRQYXJlbnQoKTtcbiAgICAgIH1cblxuICAgICAgZGl2LnByZXBlbmQoXG4gICAgICAgIGNyZWF0ZVRpdGxlKHRoaXMub2JzaWRpYW5VdGlscy5nZXRBY3RpdmVMZWFmRGlzcGxheVRleHQoKSwgKCkgPT5cbiAgICAgICAgICB0aGlzLnpvb21PdXQoZWRpdG9yKVxuICAgICAgICApXG4gICAgICApO1xuXG4gICAgICByZXR1cm4gZGl2O1xuICAgIH07XG5cbiAgICBjb25zdCB6b29tSGVhZGVyID0gY3JlYXRlSGVhZGVyKCk7XG4gICAgZWRpdG9yLmdldFdyYXBwZXJFbGVtZW50KCkucHJlcGVuZCh6b29tSGVhZGVyKTtcblxuICAgIHRoaXMuem9vbVN0YXRlcy5zZXQoXG4gICAgICBlZGl0b3IsXG4gICAgICBuZXcgWm9vbVN0YXRlKGVkaXRvci5nZXRMaW5lSGFuZGxlKGxpbmVObyksIHpvb21IZWFkZXIpXG4gICAgKTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBOb3RpY2UsIFBsdWdpbl8yIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBMaXN0VXRpbHMgfSBmcm9tIFwic3JjL2xpc3RfdXRpbHNcIjtcbmltcG9ydCB7IE9ic2lkaWFuVXRpbHMgfSBmcm9tIFwic3JjL29ic2lkaWFuX3V0aWxzXCI7XG5pbXBvcnQgeyBJRmVhdHVyZSB9IGZyb20gXCIuLi9mZWF0dXJlXCI7XG5cbmV4cG9ydCBjbGFzcyBGb2xkRmVhdHVyZSBpbXBsZW1lbnRzIElGZWF0dXJlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwbHVnaW46IFBsdWdpbl8yLFxuICAgIHByaXZhdGUgb2JzaWRpYW5VdGlsczogT2JzaWRpYW5VdGlscyxcbiAgICBwcml2YXRlIGxpc3RzVXRpbHM6IExpc3RVdGlsc1xuICApIHt9XG5cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcImZvbGRcIixcbiAgICAgIG5hbWU6IFwiRm9sZCB0aGUgbGlzdFwiLFxuICAgICAgY2FsbGJhY2s6IHRoaXMub2JzaWRpYW5VdGlscy5jcmVhdGVDb21tYW5kQ2FsbGJhY2sodGhpcy5mb2xkLmJpbmQodGhpcykpLFxuICAgICAgaG90a2V5czogW1xuICAgICAgICB7XG4gICAgICAgICAgbW9kaWZpZXJzOiBbXCJNb2RcIl0sXG4gICAgICAgICAga2V5OiBcIkFycm93VXBcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICB0aGlzLnBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcInVuZm9sZFwiLFxuICAgICAgbmFtZTogXCJVbmZvbGQgdGhlIGxpc3RcIixcbiAgICAgIGNhbGxiYWNrOiB0aGlzLm9ic2lkaWFuVXRpbHMuY3JlYXRlQ29tbWFuZENhbGxiYWNrKFxuICAgICAgICB0aGlzLnVuZm9sZC5iaW5kKHRoaXMpXG4gICAgICApLFxuICAgICAgaG90a2V5czogW1xuICAgICAgICB7XG4gICAgICAgICAgbW9kaWZpZXJzOiBbXCJNb2RcIl0sXG4gICAgICAgICAga2V5OiBcIkFycm93RG93blwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHVubG9hZCgpIHt9XG5cbiAgcHJpdmF0ZSBzZXRGb2xkKGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IsIHR5cGU6IFwiZm9sZFwiIHwgXCJ1bmZvbGRcIikge1xuICAgIGlmICghdGhpcy5saXN0c1V0aWxzLmlzQ3Vyc29ySW5MaXN0KGVkaXRvcikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMub2JzaWRpYW5VdGlscy5nZXRPYnNpZGlhbkZvbGRTZXR0aWducygpLmZvbGRJbmRlbnQpIHtcbiAgICAgIG5ldyBOb3RpY2UoXG4gICAgICAgIGBVbmFibGUgdG8gJHt0eXBlfSBiZWNhdXNlIGZvbGRpbmcgaXMgZGlzYWJsZWQuIFBsZWFzZSBlbmFibGUgXCJGb2xkIGluZGVudFwiIGluIE9ic2lkaWFuIHNldHRpbmdzLmAsXG4gICAgICAgIDUwMDBcbiAgICAgICk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAoZWRpdG9yIGFzIGFueSkuZm9sZENvZGUoZWRpdG9yLmdldEN1cnNvcigpLCBudWxsLCB0eXBlKTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSBmb2xkKGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IpIHtcbiAgICByZXR1cm4gdGhpcy5zZXRGb2xkKGVkaXRvciwgXCJmb2xkXCIpO1xuICB9XG5cbiAgcHJpdmF0ZSB1bmZvbGQoZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcikge1xuICAgIHJldHVybiB0aGlzLnNldEZvbGQoZWRpdG9yLCBcInVuZm9sZFwiKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUGx1Z2luXzIgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IExpc3RVdGlscyB9IGZyb20gXCJzcmMvbGlzdF91dGlsc1wiO1xuaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tIFwic3JjL3NldHRpbmdzXCI7XG5pbXBvcnQgeyBJRmVhdHVyZSB9IGZyb20gXCIuLi9mZWF0dXJlXCI7XG5cbmZ1bmN0aW9uIGlzQ21kQShlOiBLZXlib2FyZEV2ZW50KSB7XG4gIHJldHVybiAoXG4gICAgKGUua2V5Q29kZSA9PT0gNjUgfHwgZS5jb2RlID09PSBcIktleUFcIikgJiZcbiAgICBlLnNoaWZ0S2V5ID09PSBmYWxzZSAmJlxuICAgIGUubWV0YUtleSA9PT0gdHJ1ZSAmJlxuICAgIGUuYWx0S2V5ID09PSBmYWxzZSAmJlxuICAgIGUuY3RybEtleSA9PT0gZmFsc2VcbiAgKTtcbn1cblxuZnVuY3Rpb24gaXNDdHJsQShlOiBLZXlib2FyZEV2ZW50KSB7XG4gIHJldHVybiAoXG4gICAgKGUua2V5Q29kZSA9PT0gNjUgfHwgZS5jb2RlID09PSBcIktleUFcIikgJiZcbiAgICBlLnNoaWZ0S2V5ID09PSBmYWxzZSAmJlxuICAgIGUubWV0YUtleSA9PT0gZmFsc2UgJiZcbiAgICBlLmFsdEtleSA9PT0gZmFsc2UgJiZcbiAgICBlLmN0cmxLZXkgPT09IHRydWVcbiAgKTtcbn1cblxuZnVuY3Rpb24gaXNTZWxlY3RBbGwoZTogS2V5Ym9hcmRFdmVudCkge1xuICByZXR1cm4gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gXCJkYXJ3aW5cIiA/IGlzQ21kQShlKSA6IGlzQ3RybEEoZSk7XG59XG5cbmV4cG9ydCBjbGFzcyBTZWxlY3RBbGxGZWF0dXJlIGltcGxlbWVudHMgSUZlYXR1cmUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBzZXR0aW5nczogU2V0dGluZ3MsXG4gICAgcHJpdmF0ZSBsaXN0c1V0aWxzOiBMaXN0VXRpbHNcbiAgKSB7fVxuXG4gIGFzeW5jIGxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4ucmVnaXN0ZXJDb2RlTWlycm9yKChjbSkgPT4ge1xuICAgICAgY20ub24oXCJrZXlkb3duXCIsIHRoaXMub25LZXlEb3duKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHVubG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5hcHAud29ya3NwYWNlLml0ZXJhdGVDb2RlTWlycm9ycygoY20pID0+IHtcbiAgICAgIGNtLm9mZihcImtleWRvd25cIiwgdGhpcy5vbktleURvd24pO1xuICAgIH0pO1xuICB9XG5cbiAgb25LZXlEb3duID0gKGNtOiBDb2RlTWlycm9yLkVkaXRvciwgZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICBpZiAoIXRoaXMuc2V0dGluZ3Muc2VsZWN0QWxsIHx8ICFpc1NlbGVjdEFsbChldmVudCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB3b3JrZWQgPSB0aGlzLnNlbGVjdEFsbChjbSk7XG5cbiAgICBpZiAod29ya2VkKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICB9O1xuXG4gIHByaXZhdGUgc2VsZWN0QWxsKGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IpIHtcbiAgICBjb25zdCBzZWxlY3Rpb25zID0gZWRpdG9yLmxpc3RTZWxlY3Rpb25zKCk7XG5cbiAgICBpZiAoc2VsZWN0aW9ucy5sZW5ndGggIT09IDEpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBzZWxlY3Rpb24gPSBzZWxlY3Rpb25zWzBdO1xuXG4gICAgaWYgKHNlbGVjdGlvbi5hbmNob3IubGluZSAhPT0gc2VsZWN0aW9uLmhlYWQubGluZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHJvb3QgPSB0aGlzLmxpc3RzVXRpbHMucGFyc2VMaXN0KGVkaXRvciwgc2VsZWN0aW9uLmFuY2hvcik7XG5cbiAgICBpZiAoIXJvb3QpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBsaXN0ID0gcm9vdC5nZXRMaXN0VW5kZXJDdXJzb3IoKTtcbiAgICBjb25zdCBzdGFydENoID0gbGlzdC5nZXRDb250ZW50U3RhcnRDaCgpO1xuICAgIGNvbnN0IGVuZENoID0gbGlzdC5nZXRDb250ZW50RW5kQ2goKTtcblxuICAgIGlmIChzZWxlY3Rpb24uZnJvbSgpLmNoID09PSBzdGFydENoICYmIHNlbGVjdGlvbi50bygpLmNoID09PSBlbmRDaCkge1xuICAgICAgLy8gc2VsZWN0IGFsbCBsaXN0XG4gICAgICBlZGl0b3Iuc2V0U2VsZWN0aW9uKFxuICAgICAgICByb290LmdldExpc3RTdGFydFBvc2l0aW9uKCksXG4gICAgICAgIHJvb3QuZ2V0TGlzdEVuZFBvc2l0aW9uKClcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHNlbGVjdCBhbGwgbGluZVxuICAgICAgZWRpdG9yLnNldFNlbGVjdGlvbihcbiAgICAgICAge1xuICAgICAgICAgIGxpbmU6IHNlbGVjdGlvbi5hbmNob3IubGluZSxcbiAgICAgICAgICBjaDogc3RhcnRDaCxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGxpbmU6IHNlbGVjdGlvbi5hbmNob3IubGluZSxcbiAgICAgICAgICBjaDogZW5kQ2gsXG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cbiIsImltcG9ydCB7IFBsdWdpbl8yIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBMaXN0VXRpbHMgfSBmcm9tIFwic3JjL2xpc3RfdXRpbHNcIjtcbmltcG9ydCB7IE9ic2lkaWFuVXRpbHMgfSBmcm9tIFwic3JjL29ic2lkaWFuX3V0aWxzXCI7XG5pbXBvcnQgeyBSb290IH0gZnJvbSBcInNyYy9yb290XCI7XG5pbXBvcnQgeyBJRmVhdHVyZSB9IGZyb20gXCIuLi9mZWF0dXJlXCI7XG5cbmV4cG9ydCBjbGFzcyBNb3ZlSXRlbXNGZWF0dXJlIGltcGxlbWVudHMgSUZlYXR1cmUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBvYnNpZGlhblV0aWxzOiBPYnNpZGlhblV0aWxzLFxuICAgIHByaXZhdGUgbGlzdHNVdGlsczogTGlzdFV0aWxzXG4gICkge31cblxuICBhc3luYyBsb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwibW92ZS1saXN0LWl0ZW0tdXBcIixcbiAgICAgIG5hbWU6IFwiTW92ZSBsaXN0IGFuZCBzdWJsaXN0cyB1cFwiLFxuICAgICAgY2FsbGJhY2s6IHRoaXMub2JzaWRpYW5VdGlscy5jcmVhdGVDb21tYW5kQ2FsbGJhY2soXG4gICAgICAgIHRoaXMubW92ZUxpc3RFbGVtZW50VXAuYmluZCh0aGlzKVxuICAgICAgKSxcbiAgICAgIGhvdGtleXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sXG4gICAgICAgICAga2V5OiBcIkFycm93VXBcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICB0aGlzLnBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcIm1vdmUtbGlzdC1pdGVtLWRvd25cIixcbiAgICAgIG5hbWU6IFwiTW92ZSBsaXN0IGFuZCBzdWJsaXN0cyBkb3duXCIsXG4gICAgICBjYWxsYmFjazogdGhpcy5vYnNpZGlhblV0aWxzLmNyZWF0ZUNvbW1hbmRDYWxsYmFjayhcbiAgICAgICAgdGhpcy5tb3ZlTGlzdEVsZW1lbnREb3duLmJpbmQodGhpcylcbiAgICAgICksXG4gICAgICBob3RrZXlzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBtb2RpZmllcnM6IFtcIk1vZFwiLCBcIlNoaWZ0XCJdLFxuICAgICAgICAgIGtleTogXCJBcnJvd0Rvd25cIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICB0aGlzLnBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcImluZGVudC1saXN0XCIsXG4gICAgICBuYW1lOiBcIkluZGVudCB0aGUgbGlzdCBhbmQgc3VibGlzdHNcIixcbiAgICAgIGNhbGxiYWNrOiB0aGlzLm9ic2lkaWFuVXRpbHMuY3JlYXRlQ29tbWFuZENhbGxiYWNrKFxuICAgICAgICB0aGlzLm1vdmVMaXN0RWxlbWVudFJpZ2h0LmJpbmQodGhpcylcbiAgICAgICksXG4gICAgICBob3RrZXlzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBtb2RpZmllcnM6IFtdLFxuICAgICAgICAgIGtleTogXCJUYWJcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICB0aGlzLnBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcIm91dGRlbnQtbGlzdFwiLFxuICAgICAgbmFtZTogXCJPdXRkZW50IHRoZSBsaXN0IGFuZCBzdWJsaXN0c1wiLFxuICAgICAgY2FsbGJhY2s6IHRoaXMub2JzaWRpYW5VdGlscy5jcmVhdGVDb21tYW5kQ2FsbGJhY2soXG4gICAgICAgIHRoaXMubW92ZUxpc3RFbGVtZW50TGVmdC5iaW5kKHRoaXMpXG4gICAgICApLFxuICAgICAgaG90a2V5czogW1xuICAgICAgICB7XG4gICAgICAgICAgbW9kaWZpZXJzOiBbXCJTaGlmdFwiXSxcbiAgICAgICAgICBrZXk6IFwiVGFiXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdW5sb2FkKCkge31cblxuICBwcml2YXRlIGV4ZWN1dGUoXG4gICAgZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcixcbiAgICBjYjogKHJvb3Q6IFJvb3QpID0+IGJvb2xlYW5cbiAgKTogYm9vbGVhbiB7XG4gICAgY29uc3Qgcm9vdCA9IHRoaXMubGlzdHNVdGlscy5wYXJzZUxpc3QoZWRpdG9yLCBlZGl0b3IuZ2V0Q3Vyc29yKCkpO1xuXG4gICAgaWYgKCFyb290KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gY2Iocm9vdCk7XG5cbiAgICBpZiAocmVzdWx0KSB7XG4gICAgICB0aGlzLmxpc3RzVXRpbHMuYXBwbHlDaGFuZ2VzKGVkaXRvciwgcm9vdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgbW92ZUxpc3RFbGVtZW50RG93bihlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZShlZGl0b3IsIChyb290KSA9PiByb290Lm1vdmVEb3duKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBtb3ZlTGlzdEVsZW1lbnRVcChlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZShlZGl0b3IsIChyb290KSA9PiByb290Lm1vdmVVcCgpKTtcbiAgfVxuXG4gIHByaXZhdGUgbW92ZUxpc3RFbGVtZW50UmlnaHQoZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcikge1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dGUoZWRpdG9yLCAocm9vdCkgPT4gcm9vdC5tb3ZlUmlnaHQoKSk7XG4gIH1cblxuICBwcml2YXRlIG1vdmVMaXN0RWxlbWVudExlZnQoZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcikge1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dGUoZWRpdG9yLCAocm9vdCkgPT4gcm9vdC5tb3ZlTGVmdCgpKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUGx1Z2luIH0gZnJvbSBcIm9ic2lkaWFuXCI7XHJcbmltcG9ydCB7IE9ic2lkaWFuT3V0bGluZXJQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5ncyB9IGZyb20gXCIuL3NldHRpbmdzXCI7XHJcbmltcG9ydCB7IElGZWF0dXJlIH0gZnJvbSBcIi4vZmVhdHVyZVwiO1xyXG5pbXBvcnQgeyBPYnNpZGlhblV0aWxzIH0gZnJvbSBcIi4vb2JzaWRpYW5fdXRpbHNcIjtcclxuaW1wb3J0IHsgRWRpdG9yVXRpbHMgfSBmcm9tIFwiLi9lZGl0b3JfdXRpbHNcIjtcclxuaW1wb3J0IHsgTGlzdFV0aWxzIH0gZnJvbSBcIi4vbGlzdF91dGlsc1wiO1xyXG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tIFwiLi9sb2dnZXJcIjtcclxuaW1wb3J0IHsgTGlzdHNTdHlsZXNGZWF0dXJlIH0gZnJvbSBcIi4vZmVhdHVyZXMvTGlzdHNTdHlsZXNGZWF0dXJlXCI7XHJcbmltcG9ydCB7IEVudGVyT3V0ZGVudElmTGluZUlzRW1wdHlGZWF0dXJlIH0gZnJvbSBcIi4vZmVhdHVyZXMvRW50ZXJPdXRkZW50SWZMaW5lSXNFbXB0eUZlYXR1cmVcIjtcclxuaW1wb3J0IHsgRW50ZXJTaG91bGRDcmVhdGVOZXdsaW5lT25DaGlsZExldmVsRmVhdHVyZSB9IGZyb20gXCIuL2ZlYXR1cmVzL0VudGVyU2hvdWxkQ3JlYXRlTmV3bGluZU9uQ2hpbGRMZXZlbEZlYXR1cmVcIjtcclxuaW1wb3J0IHsgTW92ZUN1cnNvclRvUHJldmlvdXNVbmZvbGRlZExpbmVGZWF0dXJlIH0gZnJvbSBcIi4vZmVhdHVyZXMvTW92ZUN1cnNvclRvUHJldmlvdXNVbmZvbGRlZExpbmVGZWF0dXJlXCI7XHJcbmltcG9ydCB7IEVuc3VyZUN1cnNvckluTGlzdENvbnRlbnRGZWF0dXJlIH0gZnJvbSBcIi4vZmVhdHVyZXMvRW5zdXJlQ3Vyc29ySW5MaXN0Q29udGVudEZlYXR1cmVcIjtcclxuaW1wb3J0IHsgRGVsZXRlU2hvdWxkSWdub3JlQnVsbGV0c0ZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9EZWxldGVTaG91bGRJZ25vcmVCdWxsZXRzRmVhdHVyZVwiO1xyXG5pbXBvcnQgeyBTZWxlY3Rpb25TaG91bGRJZ25vcmVCdWxsZXRzRmVhdHVyZSB9IGZyb20gXCIuL2ZlYXR1cmVzL1NlbGVjdGlvblNob3VsZElnbm9yZUJ1bGxldHNGZWF0dXJlXCI7XHJcbmltcG9ydCB7IFpvb21GZWF0dXJlIH0gZnJvbSBcIi4vZmVhdHVyZXMvWm9vbUZlYXR1cmVcIjtcclxuaW1wb3J0IHsgRm9sZEZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9Gb2xkRmVhdHVyZVwiO1xyXG5pbXBvcnQgeyBTZWxlY3RBbGxGZWF0dXJlIH0gZnJvbSBcIi4vZmVhdHVyZXMvU2VsZWN0QWxsRmVhdHVyZVwiO1xyXG5pbXBvcnQgeyBNb3ZlSXRlbXNGZWF0dXJlIH0gZnJvbSBcIi4vZmVhdHVyZXMvTW92ZUl0ZW1zRmVhdHVyZVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT2JzaWRpYW5PdXRsaW5lclBsdWdpbiBleHRlbmRzIFBsdWdpbiB7XHJcbiAgcHJpdmF0ZSBmZWF0dXJlczogSUZlYXR1cmVbXTtcclxuICBwcml2YXRlIHNldHRpbmdzOiBTZXR0aW5ncztcclxuICBwcml2YXRlIGxvZ2dlcjogTG9nZ2VyO1xyXG4gIHByaXZhdGUgb2JzaWRpYW5VdGlsczogT2JzaWRpYW5VdGlscztcclxuICBwcml2YXRlIGVkaXRvclV0aWxzOiBFZGl0b3JVdGlscztcclxuICBwcml2YXRlIGxpc3RzVXRpbHM6IExpc3RVdGlscztcclxuXHJcbiAgYXN5bmMgb25sb2FkKCkge1xyXG4gICAgY29uc29sZS5sb2coYExvYWRpbmcgb2JzaWRpYW4tb3V0bGluZXJgKTtcclxuXHJcbiAgICB0aGlzLnNldHRpbmdzID0gbmV3IFNldHRpbmdzKHRoaXMpO1xyXG4gICAgYXdhaXQgdGhpcy5zZXR0aW5ncy5sb2FkKCk7XHJcblxyXG4gICAgdGhpcy5sb2dnZXIgPSBuZXcgTG9nZ2VyKHRoaXMuc2V0dGluZ3MpO1xyXG5cclxuICAgIHRoaXMub2JzaWRpYW5VdGlscyA9IG5ldyBPYnNpZGlhblV0aWxzKHRoaXMuYXBwKTtcclxuICAgIHRoaXMuZWRpdG9yVXRpbHMgPSBuZXcgRWRpdG9yVXRpbHMoKTtcclxuICAgIHRoaXMubGlzdHNVdGlscyA9IG5ldyBMaXN0VXRpbHModGhpcy5sb2dnZXIsIHRoaXMub2JzaWRpYW5VdGlscyk7XHJcblxyXG4gICAgdGhpcy5hZGRTZXR0aW5nVGFiKFxyXG4gICAgICBuZXcgT2JzaWRpYW5PdXRsaW5lclBsdWdpblNldHRpbmdUYWIodGhpcy5hcHAsIHRoaXMsIHRoaXMuc2V0dGluZ3MpXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMuZmVhdHVyZXMgPSBbXHJcbiAgICAgIG5ldyBMaXN0c1N0eWxlc0ZlYXR1cmUodGhpcywgdGhpcy5zZXR0aW5ncywgdGhpcy5vYnNpZGlhblV0aWxzKSxcclxuICAgICAgbmV3IEVudGVyT3V0ZGVudElmTGluZUlzRW1wdHlGZWF0dXJlKFxyXG4gICAgICAgIHRoaXMsXHJcbiAgICAgICAgdGhpcy5zZXR0aW5ncyxcclxuICAgICAgICB0aGlzLmVkaXRvclV0aWxzLFxyXG4gICAgICAgIHRoaXMubGlzdHNVdGlsc1xyXG4gICAgICApLFxyXG4gICAgICBuZXcgRW50ZXJTaG91bGRDcmVhdGVOZXdsaW5lT25DaGlsZExldmVsRmVhdHVyZShcclxuICAgICAgICB0aGlzLFxyXG4gICAgICAgIHRoaXMuc2V0dGluZ3MsXHJcbiAgICAgICAgdGhpcy5lZGl0b3JVdGlscyxcclxuICAgICAgICB0aGlzLmxpc3RzVXRpbHNcclxuICAgICAgKSxcclxuICAgICAgbmV3IEVuc3VyZUN1cnNvckluTGlzdENvbnRlbnRGZWF0dXJlKFxyXG4gICAgICAgIHRoaXMsXHJcbiAgICAgICAgdGhpcy5zZXR0aW5ncyxcclxuICAgICAgICB0aGlzLmVkaXRvclV0aWxzLFxyXG4gICAgICAgIHRoaXMubGlzdHNVdGlsc1xyXG4gICAgICApLFxyXG4gICAgICBuZXcgTW92ZUN1cnNvclRvUHJldmlvdXNVbmZvbGRlZExpbmVGZWF0dXJlKFxyXG4gICAgICAgIHRoaXMsXHJcbiAgICAgICAgdGhpcy5zZXR0aW5ncyxcclxuICAgICAgICB0aGlzLmxpc3RzVXRpbHNcclxuICAgICAgKSxcclxuICAgICAgbmV3IERlbGV0ZVNob3VsZElnbm9yZUJ1bGxldHNGZWF0dXJlKFxyXG4gICAgICAgIHRoaXMsXHJcbiAgICAgICAgdGhpcy5zZXR0aW5ncyxcclxuICAgICAgICB0aGlzLmVkaXRvclV0aWxzLFxyXG4gICAgICAgIHRoaXMubGlzdHNVdGlsc1xyXG4gICAgICApLFxyXG4gICAgICBuZXcgU2VsZWN0aW9uU2hvdWxkSWdub3JlQnVsbGV0c0ZlYXR1cmUoXHJcbiAgICAgICAgdGhpcyxcclxuICAgICAgICB0aGlzLnNldHRpbmdzLFxyXG4gICAgICAgIHRoaXMubGlzdHNVdGlsc1xyXG4gICAgICApLFxyXG4gICAgICBuZXcgWm9vbUZlYXR1cmUodGhpcywgdGhpcy5zZXR0aW5ncywgdGhpcy5vYnNpZGlhblV0aWxzLCB0aGlzLmxpc3RzVXRpbHMpLFxyXG4gICAgICBuZXcgRm9sZEZlYXR1cmUodGhpcywgdGhpcy5vYnNpZGlhblV0aWxzLCB0aGlzLmxpc3RzVXRpbHMpLFxyXG4gICAgICBuZXcgU2VsZWN0QWxsRmVhdHVyZSh0aGlzLCB0aGlzLnNldHRpbmdzLCB0aGlzLmxpc3RzVXRpbHMpLFxyXG4gICAgICBuZXcgTW92ZUl0ZW1zRmVhdHVyZSh0aGlzLCB0aGlzLm9ic2lkaWFuVXRpbHMsIHRoaXMubGlzdHNVdGlscyksXHJcbiAgICBdO1xyXG5cclxuICAgIGZvciAoY29uc3QgZmVhdHVyZSBvZiB0aGlzLmZlYXR1cmVzKSB7XHJcbiAgICAgIGF3YWl0IGZlYXR1cmUubG9hZCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgb251bmxvYWQoKSB7XHJcbiAgICBjb25zb2xlLmxvZyhgVW5sb2FkaW5nIG9ic2lkaWFuLW91dGxpbmVyYCk7XHJcblxyXG4gICAgZm9yIChjb25zdCBmZWF0dXJlIG9mIHRoaXMuZmVhdHVyZXMpIHtcclxuICAgICAgYXdhaXQgZmVhdHVyZS51bmxvYWQoKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbIlBsdWdpblNldHRpbmdUYWIiLCJTZXR0aW5nIiwiTWFya2Rvd25WaWV3IiwiaXNFbnRlciIsIk5vdGljZSIsIlBsdWdpbiJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF1REE7QUFDTyxTQUFTLFNBQVMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUU7QUFDN0QsSUFBSSxTQUFTLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEtBQUssWUFBWSxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLFVBQVUsT0FBTyxFQUFFLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7QUFDaEgsSUFBSSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDL0QsUUFBUSxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ25HLFFBQVEsU0FBUyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ3RHLFFBQVEsU0FBUyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFO0FBQ3RILFFBQVEsSUFB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
