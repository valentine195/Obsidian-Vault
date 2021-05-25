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
    disableZoomNotification: false,
};
class SettingsService {
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
    get disableZoomNotification() {
        return this.values.disableZoomNotification;
    }
    set disableZoomNotification(value) {
        this.set("disableZoomNotification", value);
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
            .setName("Disable notification about Obsidian Zoom plugin")
            .addToggle((toggle) => {
            toggle
                .setValue(this.settings.disableZoomNotification)
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.settings.disableZoomNotification = value;
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

class ObsidianService {
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
            const shouldStopPropagation = cb(editor);
            if (!shouldStopPropagation &&
                window.event &&
                window.event.type === "keydown") {
                editor.triggerOnKeyDown(window.event);
            }
        };
    }
}

function cmpPos(a, b) {
    return a.line - b.line || a.ch - b.ch;
}
function maxPos(a, b) {
    return cmpPos(a, b) < 0 ? b : a;
}
function minPos(a, b) {
    return cmpPos(a, b) < 0 ? a : b;
}
class List {
    constructor(root, indent, bullet, firstLine, folded) {
        this.root = root;
        this.indent = indent;
        this.bullet = bullet;
        this.folded = folded;
        this.parent = null;
        this.children = [];
        this.notesIndent = null;
        this.lines = [];
        this.lines.push(firstLine);
    }
    getNotesIndent() {
        return this.notesIndent;
    }
    setNotesIndent(notesIndent) {
        if (this.notesIndent !== null) {
            throw new Error(`Notes indent already provided`);
        }
        this.notesIndent = notesIndent;
    }
    addLine(text) {
        if (this.notesIndent === null) {
            throw new Error(`Unable to add line, notes indent should be provided first`);
        }
        this.lines.push(text);
    }
    replaceLines(lines) {
        if (lines.length > 1 && this.notesIndent === null) {
            throw new Error(`Unable to add line, notes indent should be provided first`);
        }
        this.lines = lines;
    }
    getLineCount() {
        return this.lines.length;
    }
    getRoot() {
        return this.root;
    }
    getChildren() {
        return this.children.concat();
    }
    getLinesInfo() {
        const startLine = this.root.getContentLinesRangeOf(this)[0];
        return this.lines.map((row, i) => {
            const line = startLine + i;
            const startCh = i === 0 ? this.getContentStartCh() : this.notesIndent.length;
            const endCh = startCh + row.length;
            return {
                text: row,
                from: { line, ch: startCh },
                to: { line, ch: endCh },
            };
        });
    }
    getLines() {
        return this.lines.concat();
    }
    getFirstLineContentStart() {
        const startLine = this.root.getContentLinesRangeOf(this)[0];
        return {
            line: startLine,
            ch: this.getContentStartCh(),
        };
    }
    getLastLineContentEnd() {
        const endLine = this.root.getContentLinesRangeOf(this)[1];
        const endCh = this.lines.length === 1
            ? this.getContentStartCh() + this.lines[0].length
            : this.notesIndent.length + this.lines[this.lines.length - 1].length;
        return {
            line: endLine,
            ch: endCh,
        };
    }
    getContentStartCh() {
        return this.indent.length + this.bullet.length + 1;
    }
    isFolded() {
        if (this.folded) {
            return true;
        }
        if (this.parent) {
            return this.parent.isFolded();
        }
        return false;
    }
    isFoldRoot() {
        let parent = this.getParent();
        while (parent) {
            if (parent.folded) {
                return false;
            }
            parent = parent.getParent();
        }
        return this.folded;
    }
    getLevel() {
        if (!this.parent) {
            return 0;
        }
        return this.parent.getLevel() + 1;
    }
    unindentContent(from, till) {
        this.indent = this.indent.slice(0, from) + this.indent.slice(till);
        if (this.notesIndent !== null) {
            this.notesIndent =
                this.notesIndent.slice(0, from) + this.notesIndent.slice(till);
        }
        for (const child of this.children) {
            child.unindentContent(from, till);
        }
    }
    indentContent(indentPos, indentChars) {
        this.indent =
            this.indent.slice(0, indentPos) +
                indentChars +
                this.indent.slice(indentPos);
        if (this.notesIndent !== null) {
            this.notesIndent =
                this.notesIndent.slice(0, indentPos) +
                    indentChars +
                    this.notesIndent.slice(indentPos);
        }
        for (const child of this.children) {
            child.indentContent(indentPos, indentChars);
        }
    }
    getFirstLineIndent() {
        return this.indent;
    }
    getBullet() {
        return this.bullet;
    }
    getParent() {
        return this.parent;
    }
    addBeforeAll(list) {
        this.children.unshift(list);
        list.parent = this;
    }
    addAfterAll(list) {
        this.children.push(list);
        list.parent = this;
    }
    removeChild(list) {
        const i = this.children.indexOf(list);
        this.children.splice(i, 1);
        list.parent = null;
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
    getPrevSiblingOf(list) {
        const i = this.children.indexOf(list);
        return i > 0 ? this.children[i - 1] : null;
    }
    getNextSiblingOf(list) {
        const i = this.children.indexOf(list);
        return i >= 0 && i < this.children.length ? this.children[i + 1] : null;
    }
    isEmpty() {
        return this.children.length === 0;
    }
    print() {
        let res = "";
        for (let i = 0; i < this.lines.length; i++) {
            res += i === 0 ? this.indent + this.bullet + " " : this.notesIndent;
            res += this.lines[i];
            res += "\n";
        }
        for (const child of this.children) {
            res += child.print();
        }
        return res;
    }
}
class Root {
    constructor(start, end, selections) {
        this.start = start;
        this.end = end;
        this.rootList = new List(this, "", "", "", false);
        this.selections = [];
        this.replaceSelections(selections);
    }
    getRootList() {
        return this.rootList;
    }
    getRange() {
        return [Object.assign({}, this.start), Object.assign({}, this.end)];
    }
    getSelections() {
        return this.selections.map((s) => ({
            anchor: Object.assign({}, s.anchor),
            head: Object.assign({}, s.head),
        }));
    }
    hasSingleCursor() {
        if (!this.hasSingleSelection()) {
            return false;
        }
        const selection = this.selections[0];
        return (selection.anchor.line === selection.head.line &&
            selection.anchor.ch === selection.head.ch);
    }
    hasSingleSelection() {
        return this.selections.length === 1;
    }
    getCursor() {
        return Object.assign({}, this.selections[this.selections.length - 1].head);
    }
    replaceCursor(cursor) {
        this.selections = [{ anchor: cursor, head: cursor }];
    }
    replaceSelections(selections) {
        if (selections.length < 1) {
            throw new Error(`Unable to create Root without selections`);
        }
        this.selections = selections;
    }
    getListUnderCursor() {
        return this.getListUnderLine(this.getCursor().line);
    }
    getListUnderLine(line) {
        if (line < this.start.line || line > this.end.line) {
            return;
        }
        let result = null;
        let index = this.start.line;
        const visitArr = (ll) => {
            for (const l of ll) {
                const listFromLine = index;
                const listTillLine = listFromLine + l.getLineCount() - 1;
                if (line >= listFromLine && line <= listTillLine) {
                    result = l;
                }
                else {
                    index = listTillLine + 1;
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
    getContentLinesRangeOf(list) {
        let result = null;
        let line = this.start.line;
        const visitArr = (ll) => {
            for (const l of ll) {
                const listFromLine = line;
                const listTillLine = listFromLine + l.getLineCount() - 1;
                if (l === list) {
                    result = [listFromLine, listTillLine];
                }
                else {
                    line = listTillLine + 1;
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
    getChildren() {
        return this.rootList.getChildren();
    }
    print() {
        let res = "";
        for (const child of this.rootList.getChildren()) {
            res += child.print();
        }
        return res.replace(/\n$/, "");
    }
}

const bulletSign = "-*+";
const listItemWithoutSpacesRe = new RegExp(`^[${bulletSign}] `);
const listItemRe = new RegExp(`^[ \t]*[${bulletSign}] `);
const stringWithSpacesRe = new RegExp(`^[ \t]+`);
const parseListItemRe = new RegExp(`^([ \t]*)([${bulletSign}]) (.*)$`);
class ListsService {
    constructor(loggerService, obsidianService) {
        this.loggerService = loggerService;
        this.obsidianService = obsidianService;
    }
    evalOperation(root, op, editor) {
        op.perform();
        if (op.shouldUpdate()) {
            this.applyChanges(editor, root);
        }
        return {
            shouldUpdate: op.shouldUpdate(),
            shouldStopPropagation: op.shouldStopPropagation(),
        };
    }
    performOperation(cb, editor, cursor = editor.getCursor()) {
        const root = this.parseList(editor, cursor);
        if (!root) {
            return { shouldUpdate: false, shouldStopPropagation: false };
        }
        const op = cb(root);
        return this.evalOperation(root, op, editor);
    }
    parseList(editor, cursor = editor.getCursor()) {
        const d = this.loggerService.bind("parseList");
        const error = (msg) => {
            d(msg);
            return null;
        };
        const line = editor.getLine(cursor.line);
        let listLookingPos = null;
        if (this.isListItem(line)) {
            listLookingPos = cursor.line;
        }
        else if (this.isEmptyLineOrNote(line)) {
            let listLookingPosSearch = cursor.line - 1;
            while (listLookingPosSearch >= editor.firstLine()) {
                const line = editor.getLine(listLookingPosSearch);
                if (this.isListItem(line)) {
                    listLookingPos = listLookingPosSearch;
                    break;
                }
                else if (this.isEmptyLineOrNote(line)) {
                    listLookingPosSearch--;
                }
                else {
                    break;
                }
            }
        }
        if (listLookingPos == null) {
            return null;
        }
        let listStartLine = null;
        let listStartLineLookup = listLookingPos;
        while (listStartLineLookup >= editor.firstLine()) {
            const line = editor.getLine(listStartLineLookup);
            if (!this.isListItem(line) && !this.isEmptyLineOrNote(line)) {
                break;
            }
            if (this.isListItemWithoutSpaces(line)) {
                listStartLine = listStartLineLookup;
            }
            listStartLineLookup--;
        }
        if (listStartLine === null) {
            return null;
        }
        let listEndLine = listLookingPos;
        let listEndLineLookup = listLookingPos;
        while (listEndLineLookup <= editor.lastLine()) {
            const line = editor.getLine(listEndLineLookup);
            if (!this.isListItem(line) && !this.isEmptyLineOrNote(line)) {
                break;
            }
            if (!this.isEmptyLine(line)) {
                listEndLine = listEndLineLookup;
            }
            listEndLineLookup++;
        }
        if (listStartLine > cursor.line || listEndLine < cursor.line) {
            return null;
        }
        const root = new Root({ line: listStartLine, ch: 0 }, { line: listEndLine, ch: editor.getLine(listEndLine).length }, editor.listSelections().map((r) => ({
            anchor: { line: r.anchor.line, ch: r.anchor.ch },
            head: { line: r.head.line, ch: r.head.ch },
        })));
        let currentParent = root.getRootList();
        let currentList = null;
        let currentIndent = "";
        for (let l = listStartLine; l <= listEndLine; l++) {
            const line = editor.getLine(l);
            const matches = parseListItemRe.exec(line);
            if (matches) {
                const [_, indent, bullet, content] = matches;
                const compareLength = Math.min(currentIndent.length, indent.length);
                const indentSlice = indent.slice(0, compareLength);
                const currentIndentSlice = currentIndent.slice(0, compareLength);
                if (indentSlice !== currentIndentSlice) {
                    const expected = currentIndentSlice
                        .replace(/ /g, "S")
                        .replace(/\t/g, "T");
                    const got = indentSlice.replace(/ /g, "S").replace(/\t/g, "T");
                    return error(`Unable to parse list: expected indent "${expected}", got "${got}"`);
                }
                if (indent.length > currentIndent.length) {
                    currentParent = currentList;
                    currentIndent = indent;
                }
                else if (indent.length < currentIndent.length) {
                    while (currentParent.getFirstLineIndent().length >= indent.length &&
                        currentParent.getParent()) {
                        currentParent = currentParent.getParent();
                    }
                    currentIndent = currentParent.getFirstLineIndent();
                }
                const folded = !!editor.isFolded({
                    line: Math.min(l + 1, listEndLine),
                    ch: 0,
                });
                currentList = new List(root, indent, bullet, content, folded);
                currentParent.addAfterAll(currentList);
            }
            else if (this.isEmptyLineOrNote(line)) {
                if (!currentList) {
                    return error(`Unable to parse list: expected list item, got empty line`);
                }
                const indentToCheck = currentList.getNotesIndent() || currentIndent;
                if (line.indexOf(indentToCheck) !== 0) {
                    const expected = indentToCheck.replace(/ /g, "S").replace(/\t/g, "T");
                    const got = line
                        .match(/^[ \t]*/)[0]
                        .replace(/ /g, "S")
                        .replace(/\t/g, "T");
                    return error(`Unable to parse list: expected indent "${expected}", got "${got}"`);
                }
                if (!currentList.getNotesIndent()) {
                    const matches = line.match(/^[ \t]+/);
                    if (!matches || matches[0].length <= currentIndent.length) {
                        return error(`Unable to parse list: expected some indent, got no indent`);
                    }
                    currentList.setNotesIndent(matches[0]);
                }
                currentList.addLine(line.slice(currentList.getNotesIndent().length));
            }
            else {
                return error(`Unable to parse list: expected list item or empty line, got "${line}"`);
            }
        }
        return root;
    }
    applyChanges(editor, root) {
        const rootRange = root.getRange();
        const oldString = editor.getRange(rootRange[0], rootRange[1]);
        const newString = root.print();
        const fromLine = rootRange[0].line;
        const toLine = rootRange[1].line;
        for (let l = fromLine; l <= toLine; l++) {
            editor.foldCode(l, null, "unfold");
        }
        let changeFrom = Object.assign({}, rootRange[0]);
        let changeTo = Object.assign({}, rootRange[1]);
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
        editor.setSelections(root.getSelections());
        // TODO: lines could be different because of deletetion
        for (let l = fromLine; l <= toLine; l++) {
            const line = root.getListUnderLine(l);
            if (line && line.isFoldRoot()) {
                editor.foldCode(l);
            }
        }
    }
    getDefaultIndentChars() {
        const { useTab, tabSize } = this.obsidianService.getObsidianTabsSettigns();
        return useTab ? "\t" : new Array(tabSize).fill(" ").join("");
    }
    isEmptyLine(line) {
        return line.length === 0;
    }
    isEmptyLineOrNote(line) {
        return this.isEmptyLine(line) || stringWithSpacesRe.test(line);
    }
    isListItem(line) {
        return listItemRe.test(line);
    }
    isListItemWithoutSpaces(line) {
        return listItemWithoutSpacesRe.test(line);
    }
}

class LoggerService {
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    log(method, ...args) {
        if (!this.settingsService.debug) {
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
    constructor(plugin, settingsService, obsidianService) {
        this.plugin = plugin;
        this.settingsService = settingsService;
        this.obsidianService = obsidianService;
        this.onStyleListsSettingChange = (styleLists) => {
            if (styleLists) {
                this.addListsStyles();
            }
            else {
                this.removeListsStyles();
            }
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.settingsService.styleLists) {
                this.addListsStyles();
            }
            this.settingsService.onChange("styleLists", this.onStyleListsSettingChange);
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
            this.settingsService.removeCallback("styleLists", this.onStyleListsSettingChange);
            this.removeListsStyles();
        });
    }
    startStatusBarInterval() {
        let visible = null;
        this.interval = window.setInterval(() => {
            const { useTab, tabSize } = this.obsidianService.getObsidianTabsSettigns();
            const shouldBeVisible = this.settingsService.styleLists && useTab && tabSize !== 4;
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
}

class MoveLeftOperation {
    constructor(root) {
        this.root = root;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        this.stopPropagation = true;
        const list = root.getListUnderCursor();
        const parent = list.getParent();
        const grandParent = parent.getParent();
        if (!grandParent) {
            return;
        }
        this.updated = true;
        const listStartLineBefore = root.getContentLinesRangeOf(list)[0];
        const indentRmFrom = parent.getFirstLineIndent().length;
        const indentRmTill = list.getFirstLineIndent().length;
        parent.removeChild(list);
        grandParent.addAfter(parent, list);
        list.unindentContent(indentRmFrom, indentRmTill);
        const listStartLineAfter = root.getContentLinesRangeOf(list)[0];
        const lineDiff = listStartLineAfter - listStartLineBefore;
        const chDiff = indentRmTill - indentRmFrom;
        const cursor = root.getCursor();
        root.replaceCursor({
            line: cursor.line + lineDiff,
            ch: cursor.ch - chDiff,
        });
    }
}

class OutdentIfLineIsEmptyOperation {
    constructor(root) {
        this.root = root;
        this.moveLeftOp = new MoveLeftOperation(root);
    }
    shouldStopPropagation() {
        return this.moveLeftOp.shouldStopPropagation();
    }
    shouldUpdate() {
        return this.moveLeftOp.shouldUpdate();
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        const list = root.getListUnderCursor();
        const lines = list.getLines();
        if (lines.length > 1 || lines[0].length > 0 || list.getLevel() === 1) {
            return;
        }
        this.moveLeftOp.perform();
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
    constructor(plugin, settingsService, listsService) {
        this.plugin = plugin;
        this.settingsService = settingsService;
        this.listsService = listsService;
        this.onKeyDown = (cm, e) => {
            if (!this.settingsService.betterEnter || !isEnter$1(e)) {
                return;
            }
            const { shouldStopPropagation } = this.listsService.performOperation((root) => new OutdentIfLineIsEmptyOperation(root), cm);
            if (shouldStopPropagation) {
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
}

class CreateNewItemOperation {
    constructor(root) {
        this.root = root;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        const list = root.getListUnderCursor();
        const lines = list.getLinesInfo();
        if (lines.length === 1 && lines[0].text === "") {
            return;
        }
        this.stopPropagation = true;
        this.updated = true;
        const cursor = root.getCursor();
        const endPos = list.getLastLineContentEnd();
        const onChildLevel = !list.isEmpty() && cursor.line === endPos.line && cursor.ch === endPos.ch;
        const indent = onChildLevel
            ? list.getChildren()[0].getFirstLineIndent()
            : list.getFirstLineIndent();
        const bullet = onChildLevel
            ? list.getChildren()[0].getBullet()
            : list.getBullet();
        const { oldLines, newLines } = lines.reduce((acc, line) => {
            if (cursor.line > line.from.line) {
                acc.oldLines.push(line.text);
            }
            else if (cursor.line === line.from.line) {
                const a = line.text.slice(0, cursor.ch - line.from.ch);
                const b = line.text.slice(cursor.ch - line.from.ch);
                acc.oldLines.push(a);
                acc.newLines.push(b);
            }
            else if (cursor.line < line.from.line) {
                acc.newLines.push(line.text);
            }
            return acc;
        }, {
            oldLines: [],
            newLines: [],
        });
        const newList = new List(list.getRoot(), indent, bullet, newLines.shift(), false);
        if (newLines.length > 0) {
            newList.setNotesIndent(list.getNotesIndent());
            for (const line of newLines) {
                newList.addLine(line);
            }
        }
        if (onChildLevel) {
            list.addBeforeAll(newList);
        }
        else {
            const children = list.getChildren();
            for (const child of children) {
                list.removeChild(child);
                newList.addAfterAll(child);
            }
            list.getParent().addAfter(list, newList);
        }
        list.replaceLines(oldLines);
        root.replaceCursor(newList.getFirstLineContentStart());
    }
}

function isEnter(e) {
    return ((e.keyCode === 13 || e.code === "Enter") &&
        e.shiftKey === false &&
        e.metaKey === false &&
        e.altKey === false &&
        e.ctrlKey === false);
}
class EnterShouldCreateNewItemFeature {
    constructor(plugin, settingsService, listsService) {
        this.plugin = plugin;
        this.settingsService = settingsService;
        this.listsService = listsService;
        this.onKeyDown = (cm, e) => {
            if (!this.settingsService.betterEnter || !isEnter(e)) {
                return;
            }
            const { shouldStopPropagation } = this.listsService.performOperation((root) => new CreateNewItemOperation(root), cm);
            if (shouldStopPropagation) {
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
}

class MoveCursorToPreviousUnfoldedLineOperation {
    constructor(root) {
        this.root = root;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        const list = this.root.getListUnderCursor();
        const cursor = this.root.getCursor();
        const lines = list.getLinesInfo();
        const lineNo = lines.findIndex((l) => cursor.ch === l.from.ch && cursor.line === l.from.line);
        if (lineNo === 0) {
            this.moveCursorToPreviousUnfoldedItem(root, cursor);
        }
        else if (lineNo > 0) {
            this.moveCursorToPreviousNoteLine(root, lines, lineNo);
        }
    }
    moveCursorToPreviousNoteLine(root, lines, lineNo) {
        this.stopPropagation = true;
        this.updated = true;
        root.replaceCursor(lines[lineNo - 1].to);
    }
    moveCursorToPreviousUnfoldedItem(root, cursor) {
        const prev = root.getListUnderLine(cursor.line - 1);
        if (!prev) {
            return;
        }
        this.stopPropagation = true;
        this.updated = true;
        if (prev.isFolded()) {
            let foldRoot = prev;
            while (!foldRoot.isFoldRoot()) {
                foldRoot = foldRoot.getParent();
            }
            const firstLineEnd = foldRoot.getLinesInfo()[0].to;
            root.replaceCursor(firstLineEnd);
        }
        else {
            root.replaceCursor(prev.getLastLineContentEnd());
        }
    }
}

function isArrowLeft(e) {
    return ((e.keyCode === 37 || e.code === "ArrowLeft") &&
        e.shiftKey === false &&
        e.metaKey === false &&
        e.altKey === false &&
        e.ctrlKey === false);
}
function isCtrlArrowLeft(e) {
    return ((e.keyCode === 37 || e.code === "ArrowLeft") &&
        e.shiftKey === false &&
        e.metaKey === false &&
        e.altKey === false &&
        e.ctrlKey === true);
}
class MoveCursorToPreviousUnfoldedLineFeature {
    constructor(plugin, settingsService, listsService) {
        this.plugin = plugin;
        this.settingsService = settingsService;
        this.listsService = listsService;
        this.onKeyDown = (cm, event) => {
            if (!this.settingsService.stickCursor) {
                return;
            }
            if (isArrowLeft(event) || (!obsidian.Platform.isMacOS && isCtrlArrowLeft(event))) {
                const { shouldStopPropagation } = this.listsService.performOperation((root) => new MoveCursorToPreviousUnfoldedLineOperation(root), cm);
                if (shouldStopPropagation) {
                    event.preventDefault();
                    event.stopPropagation();
                }
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

class EnsureCursorInListContentOperation {
    constructor(root) {
        this.root = root;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        this.stopPropagation = true;
        const cursor = root.getCursor();
        const list = root.getListUnderCursor();
        const contentStart = list.getFirstLineContentStart();
        const linePrefix = contentStart.line === cursor.line
            ? contentStart.ch
            : list.getNotesIndent().length;
        if (cursor.ch < linePrefix) {
            this.updated = true;
            root.replaceCursor({
                line: cursor.line,
                ch: linePrefix,
            });
        }
    }
}

class EnsureCursorIsInUnfoldedLineOperation {
    constructor(root) {
        this.root = root;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        this.stopPropagation = true;
        const cursor = root.getCursor();
        const list = root.getListUnderCursor();
        if (!list.isFolded()) {
            return;
        }
        let foldRoot = list;
        while (!foldRoot.isFoldRoot()) {
            foldRoot = foldRoot.getParent();
        }
        const firstLineEnd = foldRoot.getLinesInfo()[0].to;
        if (cursor.line > firstLineEnd.line) {
            this.updated = true;
            root.replaceCursor(firstLineEnd);
        }
    }
}

class EnsureCursorInListContentFeature {
    constructor(plugin, settingsService, listsService) {
        this.plugin = plugin;
        this.settingsService = settingsService;
        this.listsService = listsService;
        this.handleCursorActivity = (cm) => {
            if (!this.settingsService.stickCursor) {
                return;
            }
            this.listsService.performOperation((root) => new EnsureCursorIsInUnfoldedLineOperation(root), cm);
            this.listsService.performOperation((root) => new EnsureCursorInListContentOperation(root), cm);
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
}

class DeleteAndMergeWithPreviousLineOperation {
    constructor(root) {
        this.root = root;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        const list = root.getListUnderCursor();
        const cursor = root.getCursor();
        const lines = list.getLinesInfo();
        const lineNo = lines.findIndex((l) => cursor.ch === l.from.ch && cursor.line === l.from.line);
        if (lineNo === 0) {
            this.mergeWithPreviousItem(root, cursor, list);
        }
        else if (lineNo > 0) {
            this.mergeNotes(root, cursor, list, lines, lineNo);
        }
    }
    mergeNotes(root, cursor, list, lines, lineNo) {
        this.stopPropagation = true;
        this.updated = true;
        const prevLineNo = lineNo - 1;
        root.replaceCursor({
            line: cursor.line - 1,
            ch: lines[prevLineNo].text.length + lines[prevLineNo].from.ch,
        });
        lines[prevLineNo].text += lines[lineNo].text;
        lines.splice(lineNo, 1);
        list.replaceLines(lines.map((l) => l.text));
    }
    mergeWithPreviousItem(root, cursor, list) {
        if (root.getChildren()[0] === list && list.getChildren().length === 0) {
            return;
        }
        this.stopPropagation = true;
        const prev = root.getListUnderLine(cursor.line - 1);
        if (!prev) {
            return;
        }
        const bothAreEmpty = prev.isEmpty() && list.isEmpty();
        const prevIsEmptyAndSameLevel = prev.isEmpty() && !list.isEmpty() && prev.getLevel() == list.getLevel();
        const listIsEmptyAndPrevIsParent = list.isEmpty() && prev.getLevel() == list.getLevel() - 1;
        if (bothAreEmpty || prevIsEmptyAndSameLevel || listIsEmptyAndPrevIsParent) {
            this.updated = true;
            const parent = list.getParent();
            const prevEnd = prev.getLastLineContentEnd();
            if (!prev.getNotesIndent() && list.getNotesIndent()) {
                prev.setNotesIndent(prev.getFirstLineIndent() +
                    list.getNotesIndent().slice(list.getFirstLineIndent().length));
            }
            const oldLines = prev.getLines();
            const newLines = list.getLines();
            oldLines[oldLines.length - 1] += newLines[0];
            const resultLines = oldLines.concat(newLines.slice(1));
            prev.replaceLines(resultLines);
            parent.removeChild(list);
            for (const c of list.getChildren()) {
                list.removeChild(c);
                prev.addAfterAll(c);
            }
            root.replaceCursor(prevEnd);
        }
    }
}

class DeleteAndMergeWithNextLineOperation {
    constructor(root) {
        this.root = root;
        this.deleteAndMergeWithPrevious =
            new DeleteAndMergeWithPreviousLineOperation(root);
    }
    shouldStopPropagation() {
        return this.deleteAndMergeWithPrevious.shouldStopPropagation();
    }
    shouldUpdate() {
        return this.deleteAndMergeWithPrevious.shouldUpdate();
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        const list = root.getListUnderCursor();
        const cursor = root.getCursor();
        const lines = list.getLinesInfo();
        const lineNo = lines.findIndex((l) => cursor.ch === l.to.ch && cursor.line === l.to.line);
        if (lineNo === lines.length - 1) {
            const nextLine = lines[lineNo].to.line + 1;
            const nextList = root.getListUnderLine(nextLine);
            root.replaceCursor(nextList.getFirstLineContentStart());
            this.deleteAndMergeWithPrevious.perform();
        }
        else if (lineNo >= 0) {
            root.replaceCursor(lines[lineNo + 1].from);
            this.deleteAndMergeWithPrevious.perform();
        }
    }
}

class DeleteTillLineStartOperation {
    constructor(root) {
        this.root = root;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        this.stopPropagation = true;
        this.updated = true;
        const cursor = root.getCursor();
        const list = root.getListUnderCursor();
        const lines = list.getLinesInfo();
        const lineNo = lines.findIndex((l) => l.from.line === cursor.line);
        lines[lineNo].text = lines[lineNo].text.slice(cursor.ch - lines[lineNo].from.ch);
        list.replaceLines(lines.map((l) => l.text));
        root.replaceCursor(lines[lineNo].from);
    }
}

function isBackspace(e) {
    return ((e.keyCode === 8 || e.code === "Backspace") &&
        e.shiftKey === false &&
        e.metaKey === false &&
        e.altKey === false &&
        e.ctrlKey === false);
}
function isCmdBackspace(e) {
    return ((e.keyCode === 8 || e.code === "Backspace") &&
        e.shiftKey === false &&
        e.metaKey === true &&
        e.altKey === false &&
        e.ctrlKey === false);
}
function isDelete(e) {
    return ((e.keyCode === 46 || e.code === "Delete") &&
        e.shiftKey === false &&
        e.metaKey === false &&
        e.altKey === false &&
        e.ctrlKey === false);
}
class DeleteShouldIgnoreBulletsFeature {
    constructor(plugin, settingsService, listsService) {
        this.plugin = plugin;
        this.settingsService = settingsService;
        this.listsService = listsService;
        this.onKeyDown = (cm, event) => {
            if (!this.settingsService.stickCursor) {
                return;
            }
            if (isBackspace(event)) {
                const { shouldStopPropagation } = this.listsService.performOperation((root) => new DeleteAndMergeWithPreviousLineOperation(root), cm);
                if (shouldStopPropagation) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
            if (obsidian.Platform.isMacOS && isCmdBackspace(event)) {
                const { shouldStopPropagation } = this.listsService.performOperation((root) => new DeleteTillLineStartOperation(root), cm);
                if (shouldStopPropagation) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
            if (isDelete(event)) {
                const { shouldStopPropagation } = this.listsService.performOperation((root) => new DeleteAndMergeWithNextLineOperation(root), cm);
                if (shouldStopPropagation) {
                    event.preventDefault();
                    event.stopPropagation();
                }
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

class SelectTillLineStartOperation {
    constructor(root) {
        this.root = root;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        this.stopPropagation = true;
        this.updated = true;
        const cursor = root.getCursor();
        const list = root.getListUnderCursor();
        const lines = list.getLinesInfo();
        const lineNo = lines.findIndex((l) => l.from.line === cursor.line);
        root.replaceSelections([{ head: lines[lineNo].from, anchor: cursor }]);
    }
}

function isCmdShiftLeft(e) {
    return ((e.keyCode === 37 || e.code === "ArrowLeft") &&
        e.shiftKey === true &&
        e.metaKey === true &&
        e.altKey === false &&
        e.ctrlKey === false);
}
class SelectionShouldIgnoreBulletsFeature {
    constructor(plugin, settingsService, listsService) {
        this.plugin = plugin;
        this.settingsService = settingsService;
        this.listsService = listsService;
        this.onKeyDown = (cm, event) => {
            if (!this.settingsService.stickCursor) {
                return;
            }
            if (obsidian.Platform.isMacOS && isCmdShiftLeft(event)) {
                const { shouldStopPropagation } = this.listsService.performOperation((root) => new SelectTillLineStartOperation(root), cm);
                if (shouldStopPropagation) {
                    event.preventDefault();
                    event.stopPropagation();
                }
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

function isCmdDotOrCmdShiftDot(e) {
    return ((e.keyCode === 190 || e.code === "Period") &&
        e.metaKey === true &&
        e.altKey === false &&
        e.ctrlKey === false);
}
function isCtrlDotOrCtrlShiftDot(e) {
    return ((e.keyCode === 190 || e.code === "Period") &&
        e.metaKey === false &&
        e.altKey === false &&
        e.ctrlKey === true);
}
function isModDotOrModShiftDot(e) {
    return obsidian.Platform.isMacOS
        ? isCmdDotOrCmdShiftDot(e)
        : isCtrlDotOrCtrlShiftDot(e);
}
class ZoomFeature {
    constructor(plugin, settingsService) {
        this.plugin = plugin;
        this.settingsService = settingsService;
        this.onKeyDown = (cm, e) => {
            if (window.ObsidianZoomPlugin ||
                this.settingsService.disableZoomNotification ||
                !isModDotOrModShiftDot(e)) {
                return;
            }
            new obsidian.Notice(`Zooming support has been removed from the Obsidian Outliner plugin. Please install the Obsidian Zoom plugin.`, 5000);
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

class FoldFeature {
    constructor(plugin, obsidianService) {
        this.plugin = plugin;
        this.obsidianService = obsidianService;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.addCommand({
                id: "fold",
                name: "Fold the list",
                callback: this.obsidianService.createCommandCallback(this.fold.bind(this)),
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
                callback: this.obsidianService.createCommandCallback(this.unfold.bind(this)),
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
        if (!this.obsidianService.getObsidianFoldSettigns().foldIndent) {
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

class SelectAllOperation {
    constructor(root) {
        this.root = root;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleSelection()) {
            return;
        }
        const selection = root.getSelections()[0];
        const [rootStart, rootEnd] = root.getRange();
        const selectionFrom = minPos(selection.anchor, selection.head);
        const selectionTo = maxPos(selection.anchor, selection.head);
        if (selectionFrom.line < rootStart.line ||
            selectionTo.line > rootEnd.line) {
            return false;
        }
        if (selectionFrom.line === rootStart.line &&
            selectionFrom.ch === rootStart.ch &&
            selectionTo.line === rootEnd.line &&
            selectionTo.ch === rootEnd.ch) {
            return false;
        }
        const list = root.getListUnderCursor();
        const contentStart = list.getFirstLineContentStart();
        const contentEnd = list.getLastLineContentEnd();
        if (selectionFrom.line < contentStart.line ||
            selectionTo.line > contentEnd.line) {
            return false;
        }
        this.stopPropagation = true;
        this.updated = true;
        if (selectionFrom.line === contentStart.line &&
            selectionFrom.ch === contentStart.ch &&
            selectionTo.line === contentEnd.line &&
            selectionTo.ch === contentEnd.ch) {
            // select all list
            root.replaceSelections([{ anchor: rootStart, head: rootEnd }]);
        }
        else {
            // select all line
            root.replaceSelections([{ anchor: contentStart, head: contentEnd }]);
        }
        return true;
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
    return obsidian.Platform.isMacOS ? isCmdA(e) : isCtrlA(e);
}
class SelectAllFeature {
    constructor(plugin, settingsService, listsService) {
        this.plugin = plugin;
        this.settingsService = settingsService;
        this.listsService = listsService;
        this.onKeyDown = (cm, event) => {
            if (!this.settingsService.selectAll || !isSelectAll(event)) {
                return;
            }
            const { shouldStopPropagation } = this.listsService.performOperation((root) => new SelectAllOperation(root), cm);
            if (shouldStopPropagation) {
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
}

class MoveRightOperation {
    constructor(root, defaultIndentChars) {
        this.root = root;
        this.defaultIndentChars = defaultIndentChars;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        this.stopPropagation = true;
        const list = root.getListUnderCursor();
        const parent = list.getParent();
        const prev = parent.getPrevSiblingOf(list);
        if (!prev) {
            return;
        }
        this.updated = true;
        const listStartLineBefore = root.getContentLinesRangeOf(list)[0];
        const indentPos = list.getFirstLineIndent().length;
        let indentChars = "";
        if (indentChars === "" && !prev.isEmpty()) {
            indentChars = prev
                .getChildren()[0]
                .getFirstLineIndent()
                .slice(prev.getFirstLineIndent().length);
        }
        if (indentChars === "") {
            indentChars = list
                .getFirstLineIndent()
                .slice(parent.getFirstLineIndent().length);
        }
        if (indentChars === "" && !list.isEmpty()) {
            indentChars = list.getChildren()[0].getFirstLineIndent();
        }
        if (indentChars === "") {
            indentChars = this.defaultIndentChars;
        }
        parent.removeChild(list);
        prev.addAfterAll(list);
        list.indentContent(indentPos, indentChars);
        const listStartLineAfter = root.getContentLinesRangeOf(list)[0];
        const lineDiff = listStartLineAfter - listStartLineBefore;
        const cursor = root.getCursor();
        root.replaceCursor({
            line: cursor.line + lineDiff,
            ch: cursor.ch + indentChars.length,
        });
    }
}

class MoveDownOperation {
    constructor(root) {
        this.root = root;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        this.stopPropagation = true;
        const list = root.getListUnderCursor();
        const parent = list.getParent();
        const grandParent = parent.getParent();
        const next = parent.getNextSiblingOf(list);
        const listStartLineBefore = root.getContentLinesRangeOf(list)[0];
        if (!next && grandParent) {
            const newParent = grandParent.getNextSiblingOf(parent);
            if (newParent) {
                this.updated = true;
                parent.removeChild(list);
                newParent.addBeforeAll(list);
            }
        }
        else if (next) {
            this.updated = true;
            parent.removeChild(list);
            parent.addAfter(next, list);
        }
        if (!this.updated) {
            return;
        }
        const listStartLineAfter = root.getContentLinesRangeOf(list)[0];
        const lineDiff = listStartLineAfter - listStartLineBefore;
        const cursor = root.getCursor();
        root.replaceCursor({
            line: cursor.line + lineDiff,
            ch: cursor.ch,
        });
    }
}

class MoveUpOperation {
    constructor(root) {
        this.root = root;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        this.stopPropagation = true;
        const list = root.getListUnderCursor();
        const parent = list.getParent();
        const grandParent = parent.getParent();
        const prev = parent.getPrevSiblingOf(list);
        const listStartLineBefore = root.getContentLinesRangeOf(list)[0];
        if (!prev && grandParent) {
            const newParent = grandParent.getPrevSiblingOf(parent);
            if (newParent) {
                this.updated = true;
                parent.removeChild(list);
                newParent.addAfterAll(list);
            }
        }
        else if (prev) {
            this.updated = true;
            parent.removeChild(list);
            parent.addBefore(prev, list);
        }
        if (!this.updated) {
            return;
        }
        const listStartLineAfter = root.getContentLinesRangeOf(list)[0];
        const lineDiff = listStartLineAfter - listStartLineBefore;
        const cursor = root.getCursor();
        root.replaceCursor({
            line: cursor.line + lineDiff,
            ch: cursor.ch,
        });
    }
}

class MoveItemsFeature {
    constructor(plugin, obsidianService, listsService) {
        this.plugin = plugin;
        this.obsidianService = obsidianService;
        this.listsService = listsService;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.addCommand({
                id: "move-list-item-up",
                name: "Move list and sublists up",
                callback: this.obsidianService.createCommandCallback(this.moveListElementUp.bind(this)),
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
                callback: this.obsidianService.createCommandCallback(this.moveListElementDown.bind(this)),
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
                callback: this.obsidianService.createCommandCallback(this.moveListElementRight.bind(this)),
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
                callback: this.obsidianService.createCommandCallback(this.moveListElementLeft.bind(this)),
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
    moveListElementDown(editor) {
        const { shouldStopPropagation } = this.listsService.performOperation((root) => new MoveDownOperation(root), editor);
        return shouldStopPropagation;
    }
    moveListElementUp(editor) {
        const { shouldStopPropagation } = this.listsService.performOperation((root) => new MoveUpOperation(root), editor);
        return shouldStopPropagation;
    }
    moveListElementRight(editor) {
        const { shouldStopPropagation } = this.listsService.performOperation((root) => new MoveRightOperation(root, this.listsService.getDefaultIndentChars()), editor);
        return shouldStopPropagation;
    }
    moveListElementLeft(editor) {
        const { shouldStopPropagation } = this.listsService.performOperation((root) => new MoveLeftOperation(root), editor);
        return shouldStopPropagation;
    }
}

class CreateNoteLineOperation {
    constructor(root, defaultIndentChars) {
        this.root = root;
        this.defaultIndentChars = defaultIndentChars;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        this.stopPropagation = true;
        this.updated = true;
        const cursor = root.getCursor();
        const list = root.getListUnderCursor();
        if (!list.getNotesIndent()) {
            const indent = list.isEmpty()
                ? list.getFirstLineIndent() + this.defaultIndentChars
                : list.getChildren()[0].getFirstLineIndent();
            list.setNotesIndent(indent);
        }
        const lines = list.getLinesInfo().reduce((acc, line) => {
            if (cursor.line === line.from.line) {
                acc.push(line.text.slice(0, cursor.ch - line.from.ch));
                acc.push(line.text.slice(cursor.ch - line.from.ch));
            }
            else {
                acc.push(line.text);
            }
            return acc;
        }, []);
        list.replaceLines(lines);
        root.replaceCursor({
            line: cursor.line + 1,
            ch: list.getNotesIndent().length,
        });
    }
}

function isShiftEnter(e) {
    return ((e.keyCode === 13 || e.code === "Enter") &&
        e.shiftKey === true &&
        e.metaKey === false &&
        e.altKey === false &&
        e.ctrlKey === false);
}
class ShiftEnterShouldCreateNoteFeature {
    constructor(plugin, settingsService, listsService) {
        this.plugin = plugin;
        this.settingsService = settingsService;
        this.listsService = listsService;
        this.onKeyDown = (cm, e) => {
            if (!this.settingsService.betterEnter || !isShiftEnter(e)) {
                return;
            }
            const { shouldStopPropagation } = this.listsService.performOperation((root) => new CreateNoteLineOperation(root, this.listsService.getDefaultIndentChars()), cm);
            if (shouldStopPropagation) {
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
}

class ObsidianOutlinerPlugin extends obsidian.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Loading obsidian-outliner`);
            this.settingsService = new SettingsService(this);
            yield this.settingsService.load();
            this.loggerService = new LoggerService(this.settingsService);
            this.obsidianService = new ObsidianService(this.app);
            this.listsService = new ListsService(this.loggerService, this.obsidianService);
            this.addSettingTab(new ObsidianOutlinerPluginSettingTab(this.app, this, this.settingsService));
            this.features = [
                new ListsStylesFeature(this, this.settingsService, this.obsidianService),
                new EnterOutdentIfLineIsEmptyFeature(this, this.settingsService, this.listsService),
                new EnterShouldCreateNewItemFeature(this, this.settingsService, this.listsService),
                new EnsureCursorInListContentFeature(this, this.settingsService, this.listsService),
                new MoveCursorToPreviousUnfoldedLineFeature(this, this.settingsService, this.listsService),
                new DeleteShouldIgnoreBulletsFeature(this, this.settingsService, this.listsService),
                new SelectionShouldIgnoreBulletsFeature(this, this.settingsService, this.listsService),
                new ZoomFeature(this, this.settingsService),
                new FoldFeature(this, this.obsidianService),
                new SelectAllFeature(this, this.settingsService, this.listsService),
                new MoveItemsFeature(this, this.obsidianService, this.listsService),
                new ShiftEnterShouldCreateNoteFeature(this, this.settingsService, this.listsService),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy9zZXJ2aWNlcy9TZXR0aW5nc1NlcnZpY2UudHMiLCJzcmMvc2VydmljZXMvT2JzaWRpYW5TZXJ2aWNlLnRzIiwic3JjL3Jvb3QvaW5kZXgudHMiLCJzcmMvc2VydmljZXMvTGlzdHNTZXJ2aWNlLnRzIiwic3JjL3NlcnZpY2VzL0xvZ2dlclNlcnZpY2UudHMiLCJzcmMvZmVhdHVyZXMvTGlzdHNTdHlsZXNGZWF0dXJlLnRzIiwic3JjL29wZXJhdGlvbnMvTW92ZUxlZnRPcGVyYXRpb24udHMiLCJzcmMvb3BlcmF0aW9ucy9PdXRkZW50SWZMaW5lSXNFbXB0eU9wZXJhdGlvbi50cyIsInNyYy9mZWF0dXJlcy9FbnRlck91dGRlbnRJZkxpbmVJc0VtcHR5RmVhdHVyZS50cyIsInNyYy9vcGVyYXRpb25zL0NyZWF0ZU5ld0l0ZW1PcGVyYXRpb24udHMiLCJzcmMvZmVhdHVyZXMvRW50ZXJTaG91bGRDcmVhdGVOZXdJdGVtT25DaGlsZExldmVsRmVhdHVyZS50cyIsInNyYy9vcGVyYXRpb25zL01vdmVDdXJzb3JUb1ByZXZpb3VzVW5mb2xkZWRMaW5lT3BlcmF0aW9uLnRzIiwic3JjL2ZlYXR1cmVzL01vdmVDdXJzb3JUb1ByZXZpb3VzVW5mb2xkZWRMaW5lRmVhdHVyZS50cyIsInNyYy9vcGVyYXRpb25zL0Vuc3VyZUN1cnNvckluTGlzdENvbnRlbnRPcGVyYXRpb24udHMiLCJzcmMvb3BlcmF0aW9ucy9FbnN1cmVDdXJzb3JJc0luVW5mb2xkZWRMaW5lT3BlcmF0aW9uLnRzIiwic3JjL2ZlYXR1cmVzL0Vuc3VyZUN1cnNvckluTGlzdENvbnRlbnRGZWF0dXJlLnRzIiwic3JjL29wZXJhdGlvbnMvRGVsZXRlQW5kTWVyZ2VXaXRoUHJldmlvdXNMaW5lT3BlcmF0aW9uLnRzIiwic3JjL29wZXJhdGlvbnMvRGVsZXRlQW5kTWVyZ2VXaXRoTmV4dExpbmVPcGVyYXRpb24udHMiLCJzcmMvb3BlcmF0aW9ucy9EZWxldGVUaWxsTGluZVN0YXJ0T3BlcmF0aW9uLnRzIiwic3JjL2ZlYXR1cmVzL0RlbGV0ZVNob3VsZElnbm9yZUJ1bGxldHNGZWF0dXJlLnRzIiwic3JjL29wZXJhdGlvbnMvU2VsZWN0VGlsbExpbmVTdGFydE9wZXJhdGlvbi50cyIsInNyYy9mZWF0dXJlcy9TZWxlY3Rpb25TaG91bGRJZ25vcmVCdWxsZXRzRmVhdHVyZS50cyIsInNyYy9mZWF0dXJlcy9ab29tRmVhdHVyZS50cyIsInNyYy9mZWF0dXJlcy9Gb2xkRmVhdHVyZS50cyIsInNyYy9vcGVyYXRpb25zL1NlbGVjdEFsbE9wZXJhdGlvbi50cyIsInNyYy9mZWF0dXJlcy9TZWxlY3RBbGxGZWF0dXJlLnRzIiwic3JjL29wZXJhdGlvbnMvTW92ZVJpZ2h0T3BlcmF0aW9uLnRzIiwic3JjL29wZXJhdGlvbnMvTW92ZURvd25PcGVyYXRpb24udHMiLCJzcmMvb3BlcmF0aW9ucy9Nb3ZlVXBPcGVyYXRpb24udHMiLCJzcmMvZmVhdHVyZXMvTW92ZUl0ZW1zRmVhdHVyZS50cyIsInNyYy9vcGVyYXRpb25zL0NyZWF0ZU5vdGVMaW5lT3BlcmF0aW9uLnRzIiwic3JjL2ZlYXR1cmVzL1NoaWZ0RW50ZXJTaG91bGRDcmVhdGVOb3RlRmVhdHVyZS50cyIsInNyYy9PYnNpZGlhbk91dGxpbmVyUGx1Z2luLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxyXG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXHJcblxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxyXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXHJcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxyXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXHJcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fY3JlYXRlQmluZGluZyA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgbykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBwKSkgX19jcmVhdGVCaW5kaW5nKG8sIG0sIHApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXlzKCkge1xyXG4gICAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciByID0gQXJyYXkocyksIGsgPSAwLCBpID0gMDsgaSA8IGlsOyBpKyspXHJcbiAgICAgICAgZm9yICh2YXIgYSA9IGFyZ3VtZW50c1tpXSwgaiA9IDAsIGpsID0gYS5sZW5ndGg7IGogPCBqbDsgaisrLCBrKyspXHJcbiAgICAgICAgICAgIHJba10gPSBhW2pdO1xyXG4gICAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5KHRvLCBmcm9tKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBmcm9tLmxlbmd0aCwgaiA9IHRvLmxlbmd0aDsgaSA8IGlsOyBpKyssIGorKylcclxuICAgICAgICB0b1tqXSA9IGZyb21baV07XHJcbiAgICByZXR1cm4gdG87XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcclxufSkgOiBmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcclxuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRHZXQocmVjZWl2ZXIsIHN0YXRlLCBraW5kLCBmKSB7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBnZXR0ZXJcIik7XHJcbiAgICBpZiAodHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciAhPT0gc3RhdGUgfHwgIWYgOiAhc3RhdGUuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCByZWFkIHByaXZhdGUgbWVtYmVyIGZyb20gYW4gb2JqZWN0IHdob3NlIGNsYXNzIGRpZCBub3QgZGVjbGFyZSBpdFwiKTtcclxuICAgIHJldHVybiBraW5kID09PSBcIm1cIiA/IGYgOiBraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlcikgOiBmID8gZi52YWx1ZSA6IHN0YXRlLmdldChyZWNlaXZlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBzdGF0ZSwgdmFsdWUsIGtpbmQsIGYpIHtcclxuICAgIGlmIChraW5kID09PSBcIm1cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgbWV0aG9kIGlzIG5vdCB3cml0YWJsZVwiKTtcclxuICAgIGlmIChraW5kID09PSBcImFcIiAmJiAhZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgYWNjZXNzb3Igd2FzIGRlZmluZWQgd2l0aG91dCBhIHNldHRlclwiKTtcclxuICAgIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHdyaXRlIHByaXZhdGUgbWVtYmVyIHRvIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XHJcbiAgICByZXR1cm4gKGtpbmQgPT09IFwiYVwiID8gZi5jYWxsKHJlY2VpdmVyLCB2YWx1ZSkgOiBmID8gZi52YWx1ZSA9IHZhbHVlIDogc3RhdGUuc2V0KHJlY2VpdmVyLCB2YWx1ZSkpLCB2YWx1ZTtcclxufVxyXG4iLCJpbXBvcnQgeyBBcHAsIFBsdWdpblNldHRpbmdUYWIsIFBsdWdpbl8yLCBTZXR0aW5nIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgT2JzaWRpYW5PdXRsaW5lclBsdWdpblNldHRpbmdzIHtcbiAgc3R5bGVMaXN0czogYm9vbGVhbjtcbiAgZGVidWc6IGJvb2xlYW47XG4gIHN0aWNrQ3Vyc29yOiBib29sZWFuO1xuICBiZXR0ZXJFbnRlcjogYm9vbGVhbjtcbiAgc2VsZWN0QWxsOiBib29sZWFuO1xuICBkaXNhYmxlWm9vbU5vdGlmaWNhdGlvbjogYm9vbGVhbjtcbn1cblxuY29uc3QgREVGQVVMVF9TRVRUSU5HUzogT2JzaWRpYW5PdXRsaW5lclBsdWdpblNldHRpbmdzID0ge1xuICBzdHlsZUxpc3RzOiBmYWxzZSxcbiAgZGVidWc6IGZhbHNlLFxuICBzdGlja0N1cnNvcjogdHJ1ZSxcbiAgYmV0dGVyRW50ZXI6IHRydWUsXG4gIHNlbGVjdEFsbDogdHJ1ZSxcbiAgZGlzYWJsZVpvb21Ob3RpZmljYXRpb246IGZhbHNlLFxufTtcblxuZXhwb3J0IGludGVyZmFjZSBTdG9yYWdlIHtcbiAgbG9hZERhdGEoKTogUHJvbWlzZTxPYnNpZGlhbk91dGxpbmVyUGx1Z2luU2V0dGluZ3M+O1xuICBzYXZlRGF0YShzZXR0aWduczogT2JzaWRpYW5PdXRsaW5lclBsdWdpblNldHRpbmdzKTogUHJvbWlzZTx2b2lkPjtcbn1cblxudHlwZSBLID0ga2V5b2YgT2JzaWRpYW5PdXRsaW5lclBsdWdpblNldHRpbmdzO1xudHlwZSBWPFQgZXh0ZW5kcyBLPiA9IE9ic2lkaWFuT3V0bGluZXJQbHVnaW5TZXR0aW5nc1tUXTtcbnR5cGUgQ2FsbGJhY2s8VCBleHRlbmRzIEs+ID0gKGNiOiBWPFQ+KSA9PiB2b2lkO1xuXG5leHBvcnQgY2xhc3MgU2V0dGluZ3NTZXJ2aWNlIGltcGxlbWVudHMgT2JzaWRpYW5PdXRsaW5lclBsdWdpblNldHRpbmdzIHtcbiAgcHJpdmF0ZSBzdG9yYWdlOiBTdG9yYWdlO1xuICBwcml2YXRlIHZhbHVlczogT2JzaWRpYW5PdXRsaW5lclBsdWdpblNldHRpbmdzO1xuICBwcml2YXRlIGhhbmRsZXJzOiBNYXA8SywgU2V0PENhbGxiYWNrPEs+Pj47XG5cbiAgY29uc3RydWN0b3Ioc3RvcmFnZTogU3RvcmFnZSkge1xuICAgIHRoaXMuc3RvcmFnZSA9IHN0b3JhZ2U7XG4gICAgdGhpcy5oYW5kbGVycyA9IG5ldyBNYXAoKTtcbiAgfVxuXG4gIGdldCBzdHlsZUxpc3RzKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlcy5zdHlsZUxpc3RzO1xuICB9XG4gIHNldCBzdHlsZUxpc3RzKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5zZXQoXCJzdHlsZUxpc3RzXCIsIHZhbHVlKTtcbiAgfVxuXG4gIGdldCBkZWJ1ZygpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZXMuZGVidWc7XG4gIH1cbiAgc2V0IGRlYnVnKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5zZXQoXCJkZWJ1Z1wiLCB2YWx1ZSk7XG4gIH1cblxuICBnZXQgc3RpY2tDdXJzb3IoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWVzLnN0aWNrQ3Vyc29yO1xuICB9XG4gIHNldCBzdGlja0N1cnNvcih2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuc2V0KFwic3RpY2tDdXJzb3JcIiwgdmFsdWUpO1xuICB9XG5cbiAgZ2V0IGJldHRlckVudGVyKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlcy5iZXR0ZXJFbnRlcjtcbiAgfVxuICBzZXQgYmV0dGVyRW50ZXIodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLnNldChcImJldHRlckVudGVyXCIsIHZhbHVlKTtcbiAgfVxuXG4gIGdldCBzZWxlY3RBbGwoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWVzLnNlbGVjdEFsbDtcbiAgfVxuICBzZXQgc2VsZWN0QWxsKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5zZXQoXCJzZWxlY3RBbGxcIiwgdmFsdWUpO1xuICB9XG5cbiAgZ2V0IGRpc2FibGVab29tTm90aWZpY2F0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlcy5kaXNhYmxlWm9vbU5vdGlmaWNhdGlvbjtcbiAgfVxuICBzZXQgZGlzYWJsZVpvb21Ob3RpZmljYXRpb24odmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLnNldChcImRpc2FibGVab29tTm90aWZpY2F0aW9uXCIsIHZhbHVlKTtcbiAgfVxuXG4gIG9uQ2hhbmdlPFQgZXh0ZW5kcyBLPihrZXk6IFQsIGNiOiBDYWxsYmFjazxUPikge1xuICAgIGlmICghdGhpcy5oYW5kbGVycy5oYXMoa2V5KSkge1xuICAgICAgdGhpcy5oYW5kbGVycy5zZXQoa2V5LCBuZXcgU2V0KCkpO1xuICAgIH1cblxuICAgIHRoaXMuaGFuZGxlcnMuZ2V0KGtleSkuYWRkKGNiKTtcbiAgfVxuXG4gIHJlbW92ZUNhbGxiYWNrPFQgZXh0ZW5kcyBLPihrZXk6IFQsIGNiOiBDYWxsYmFjazxUPik6IHZvaWQge1xuICAgIGNvbnN0IGhhbmRsZXJzID0gdGhpcy5oYW5kbGVycy5nZXQoa2V5KTtcblxuICAgIGlmIChoYW5kbGVycykge1xuICAgICAgaGFuZGxlcnMuZGVsZXRlKGNiKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBsb2FkKCkge1xuICAgIHRoaXMudmFsdWVzID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHt9LFxuICAgICAgREVGQVVMVF9TRVRUSU5HUyxcbiAgICAgIGF3YWl0IHRoaXMuc3RvcmFnZS5sb2FkRGF0YSgpXG4gICAgKTtcbiAgfVxuXG4gIGFzeW5jIHNhdmUoKSB7XG4gICAgYXdhaXQgdGhpcy5zdG9yYWdlLnNhdmVEYXRhKHRoaXMudmFsdWVzKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0PFQgZXh0ZW5kcyBLPihrZXk6IFQsIHZhbHVlOiBWPEs+KTogdm9pZCB7XG4gICAgdGhpcy52YWx1ZXNba2V5XSA9IHZhbHVlO1xuICAgIGNvbnN0IGNhbGxiYWNrcyA9IHRoaXMuaGFuZGxlcnMuZ2V0KGtleSk7XG5cbiAgICBpZiAoIWNhbGxiYWNrcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgY2Igb2YgY2FsbGJhY2tzLnZhbHVlcygpKSB7XG4gICAgICBjYih2YWx1ZSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBPYnNpZGlhbk91dGxpbmVyUGx1Z2luU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBQbHVnaW5fMiwgcHJpdmF0ZSBzZXR0aW5nczogU2V0dGluZ3NTZXJ2aWNlKSB7XG4gICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xuICB9XG5cbiAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICBjb25zdCB7IGNvbnRhaW5lckVsIH0gPSB0aGlzO1xuXG4gICAgY29udGFpbmVyRWwuZW1wdHkoKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJJbXByb3ZlIHRoZSBzdHlsZSBvZiB5b3VyIGxpc3RzXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJTdHlsZXMgYXJlIG9ubHkgY29tcGF0aWJsZSB3aXRoIGJ1aWx0LWluIE9ic2lkaWFuIHRoZW1lcyBhbmQgbWF5IG5vdCBiZSBjb21wYXRpYmxlIHdpdGggb3RoZXIgdGhlbWVzLiBTdHlsZXMgb25seSB3b3JrIHdlbGwgd2l0aCBzcGFjZXMgb3IgZm91ci1zcGFjZSB0YWJzLlwiXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMuc2V0dGluZ3Muc3R5bGVMaXN0cykub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy5zdHlsZUxpc3RzID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5zZXR0aW5ncy5zYXZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiU3RpY2sgdGhlIGN1cnNvciB0byB0aGUgY29udGVudFwiKVxuICAgICAgLnNldERlc2MoXCJEb24ndCBsZXQgdGhlIGN1cnNvciBtb3ZlIHRvIHRoZSBidWxsZXQgcG9zaXRpb24uXCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMuc2V0dGluZ3Muc3RpY2tDdXJzb3IpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0dGluZ3Muc3RpY2tDdXJzb3IgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnNldHRpbmdzLnNhdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJFbmhhbmNlIHRoZSBFbnRlciBrZXlcIilcbiAgICAgIC5zZXREZXNjKFwiTWFrZSB0aGUgRW50ZXIga2V5IGJlaGF2ZSB0aGUgc2FtZSBhcyBvdGhlciBvdXRsaW5lcnMuXCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMuc2V0dGluZ3MuYmV0dGVyRW50ZXIpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0dGluZ3MuYmV0dGVyRW50ZXIgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnNldHRpbmdzLnNhdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJFbmhhbmNlIHRoZSBDdHJsK0Egb3IgQ21kK0EgYmVoYXZpb3JcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIlByZXNzIHRoZSBob3RrZXkgb25jZSB0byBzZWxlY3QgdGhlIGN1cnJlbnQgbGlzdCBpdGVtLiBQcmVzcyB0aGUgaG90a2V5IHR3aWNlIHRvIHNlbGVjdCB0aGUgZW50aXJlIGxpc3QuXCJcbiAgICAgIClcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT4ge1xuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5zZXR0aW5ncy5zZWxlY3RBbGwpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0dGluZ3Muc2VsZWN0QWxsID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5zZXR0aW5ncy5zYXZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiRGlzYWJsZSBub3RpZmljYXRpb24gYWJvdXQgT2JzaWRpYW4gWm9vbSBwbHVnaW5cIilcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT4ge1xuICAgICAgICB0b2dnbGVcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5zZXR0aW5ncy5kaXNhYmxlWm9vbU5vdGlmaWNhdGlvbilcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzLmRpc2FibGVab29tTm90aWZpY2F0aW9uID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnNldHRpbmdzLnNhdmUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkRlYnVnIG1vZGVcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIk9wZW4gRGV2VG9vbHMgKENvbW1hbmQrT3B0aW9uK0kgb3IgQ29udHJvbCtTaGlmdCtJKSB0byBjb3B5IHRoZSBkZWJ1ZyBsb2dzLlwiXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMuc2V0dGluZ3MuZGVidWcpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0dGluZ3MuZGVidWcgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnNldHRpbmdzLnNhdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQXBwLCBNYXJrZG93blZpZXcgfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuZXhwb3J0IGludGVyZmFjZSBJT2JzaWRpYW5UYWJzU2V0dGlnbnMge1xuICB1c2VUYWI6IGJvb2xlYW47XG4gIHRhYlNpemU6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJT2JzaWRpYW5Gb2xkU2V0dGlnbnMge1xuICBmb2xkSW5kZW50OiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgT2JzaWRpYW5TZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBhcHA6IEFwcCkge31cblxuICBnZXRPYnNpZGlhblRhYnNTZXR0aWducygpOiBJT2JzaWRpYW5UYWJzU2V0dGlnbnMge1xuICAgIHJldHVybiB7XG4gICAgICB1c2VUYWI6IHRydWUsXG4gICAgICB0YWJTaXplOiA0LFxuICAgICAgLi4uKHRoaXMuYXBwLnZhdWx0IGFzIGFueSkuY29uZmlnLFxuICAgIH07XG4gIH1cblxuICBnZXRPYnNpZGlhbkZvbGRTZXR0aWducygpOiBJT2JzaWRpYW5Gb2xkU2V0dGlnbnMge1xuICAgIHJldHVybiB7XG4gICAgICBmb2xkSW5kZW50OiBmYWxzZSxcbiAgICAgIC4uLih0aGlzLmFwcC52YXVsdCBhcyBhbnkpLmNvbmZpZyxcbiAgICB9O1xuICB9XG5cbiAgZ2V0QWN0aXZlTGVhZkRpc3BsYXlUZXh0KCkge1xuICAgIHJldHVybiB0aGlzLmFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZi5nZXREaXNwbGF5VGV4dCgpO1xuICB9XG5cbiAgY3JlYXRlQ29tbWFuZENhbGxiYWNrKGNiOiAoZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcikgPT4gYm9vbGVhbikge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjb25zdCB2aWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcblxuICAgICAgaWYgKCF2aWV3KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZWRpdG9yID0gdmlldy5zb3VyY2VNb2RlLmNtRWRpdG9yO1xuXG4gICAgICBjb25zdCBzaG91bGRTdG9wUHJvcGFnYXRpb24gPSBjYihlZGl0b3IpO1xuXG4gICAgICBpZiAoXG4gICAgICAgICFzaG91bGRTdG9wUHJvcGFnYXRpb24gJiZcbiAgICAgICAgd2luZG93LmV2ZW50ICYmXG4gICAgICAgIHdpbmRvdy5ldmVudC50eXBlID09PSBcImtleWRvd25cIlxuICAgICAgKSB7XG4gICAgICAgIChlZGl0b3IgYXMgYW55KS50cmlnZ2VyT25LZXlEb3duKHdpbmRvdy5ldmVudCk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGNtcFBvcyhhOiBJUG9zaXRpb24sIGI6IElQb3NpdGlvbikge1xuICByZXR1cm4gYS5saW5lIC0gYi5saW5lIHx8IGEuY2ggLSBiLmNoO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWF4UG9zKGE6IElQb3NpdGlvbiwgYjogSVBvc2l0aW9uKSB7XG4gIHJldHVybiBjbXBQb3MoYSwgYikgPCAwID8gYiA6IGE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtaW5Qb3MoYTogSVBvc2l0aW9uLCBiOiBJUG9zaXRpb24pIHtcbiAgcmV0dXJuIGNtcFBvcyhhLCBiKSA8IDAgPyBhIDogYjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJUG9zaXRpb24ge1xuICBjaDogbnVtYmVyO1xuICBsaW5lOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUxpc3RMaW5lIHtcbiAgdGV4dDogc3RyaW5nO1xuICBmcm9tOiBJUG9zaXRpb247XG4gIHRvOiBJUG9zaXRpb247XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVJhbmdlIHtcbiAgYW5jaG9yOiBJUG9zaXRpb247XG4gIGhlYWQ6IElQb3NpdGlvbjtcbn1cblxuZXhwb3J0IGNsYXNzIExpc3Qge1xuICBwcml2YXRlIHBhcmVudDogTGlzdCB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGNoaWxkcmVuOiBMaXN0W10gPSBbXTtcbiAgcHJpdmF0ZSBub3Rlc0luZGVudDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgbGluZXM6IHN0cmluZ1tdID0gW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByb290OiBSb290LFxuICAgIHByaXZhdGUgaW5kZW50OiBzdHJpbmcsXG4gICAgcHJpdmF0ZSBidWxsZXQ6IHN0cmluZyxcbiAgICBmaXJzdExpbmU6IHN0cmluZyxcbiAgICBwcml2YXRlIGZvbGRlZDogYm9vbGVhblxuICApIHtcbiAgICB0aGlzLmxpbmVzLnB1c2goZmlyc3RMaW5lKTtcbiAgfVxuXG4gIGdldE5vdGVzSW5kZW50KCk6IHN0cmluZyB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLm5vdGVzSW5kZW50O1xuICB9XG5cbiAgc2V0Tm90ZXNJbmRlbnQobm90ZXNJbmRlbnQ6IHN0cmluZykge1xuICAgIGlmICh0aGlzLm5vdGVzSW5kZW50ICE9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vdGVzIGluZGVudCBhbHJlYWR5IHByb3ZpZGVkYCk7XG4gICAgfVxuICAgIHRoaXMubm90ZXNJbmRlbnQgPSBub3Rlc0luZGVudDtcbiAgfVxuXG4gIGFkZExpbmUodGV4dDogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMubm90ZXNJbmRlbnQgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYFVuYWJsZSB0byBhZGQgbGluZSwgbm90ZXMgaW5kZW50IHNob3VsZCBiZSBwcm92aWRlZCBmaXJzdGBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5saW5lcy5wdXNoKHRleHQpO1xuICB9XG5cbiAgcmVwbGFjZUxpbmVzKGxpbmVzOiBzdHJpbmdbXSkge1xuICAgIGlmIChsaW5lcy5sZW5ndGggPiAxICYmIHRoaXMubm90ZXNJbmRlbnQgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYFVuYWJsZSB0byBhZGQgbGluZSwgbm90ZXMgaW5kZW50IHNob3VsZCBiZSBwcm92aWRlZCBmaXJzdGBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5saW5lcyA9IGxpbmVzO1xuICB9XG5cbiAgZ2V0TGluZUNvdW50KCkge1xuICAgIHJldHVybiB0aGlzLmxpbmVzLmxlbmd0aDtcbiAgfVxuXG4gIGdldFJvb3QoKSB7XG4gICAgcmV0dXJuIHRoaXMucm9vdDtcbiAgfVxuXG4gIGdldENoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmNvbmNhdCgpO1xuICB9XG5cbiAgZ2V0TGluZXNJbmZvKCk6IElMaXN0TGluZVtdIHtcbiAgICBjb25zdCBzdGFydExpbmUgPSB0aGlzLnJvb3QuZ2V0Q29udGVudExpbmVzUmFuZ2VPZih0aGlzKVswXTtcblxuICAgIHJldHVybiB0aGlzLmxpbmVzLm1hcCgocm93LCBpKSA9PiB7XG4gICAgICBjb25zdCBsaW5lID0gc3RhcnRMaW5lICsgaTtcbiAgICAgIGNvbnN0IHN0YXJ0Q2ggPVxuICAgICAgICBpID09PSAwID8gdGhpcy5nZXRDb250ZW50U3RhcnRDaCgpIDogdGhpcy5ub3Rlc0luZGVudC5sZW5ndGg7XG4gICAgICBjb25zdCBlbmRDaCA9IHN0YXJ0Q2ggKyByb3cubGVuZ3RoO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICB0ZXh0OiByb3csXG4gICAgICAgIGZyb206IHsgbGluZSwgY2g6IHN0YXJ0Q2ggfSxcbiAgICAgICAgdG86IHsgbGluZSwgY2g6IGVuZENoIH0sXG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0TGluZXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLmxpbmVzLmNvbmNhdCgpO1xuICB9XG5cbiAgZ2V0Rmlyc3RMaW5lQ29udGVudFN0YXJ0KCkge1xuICAgIGNvbnN0IHN0YXJ0TGluZSA9IHRoaXMucm9vdC5nZXRDb250ZW50TGluZXNSYW5nZU9mKHRoaXMpWzBdO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGxpbmU6IHN0YXJ0TGluZSxcbiAgICAgIGNoOiB0aGlzLmdldENvbnRlbnRTdGFydENoKCksXG4gICAgfTtcbiAgfVxuXG4gIGdldExhc3RMaW5lQ29udGVudEVuZCgpIHtcbiAgICBjb25zdCBlbmRMaW5lID0gdGhpcy5yb290LmdldENvbnRlbnRMaW5lc1JhbmdlT2YodGhpcylbMV07XG4gICAgY29uc3QgZW5kQ2ggPVxuICAgICAgdGhpcy5saW5lcy5sZW5ndGggPT09IDFcbiAgICAgICAgPyB0aGlzLmdldENvbnRlbnRTdGFydENoKCkgKyB0aGlzLmxpbmVzWzBdLmxlbmd0aFxuICAgICAgICA6IHRoaXMubm90ZXNJbmRlbnQubGVuZ3RoICsgdGhpcy5saW5lc1t0aGlzLmxpbmVzLmxlbmd0aCAtIDFdLmxlbmd0aDtcblxuICAgIHJldHVybiB7XG4gICAgICBsaW5lOiBlbmRMaW5lLFxuICAgICAgY2g6IGVuZENoLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIGdldENvbnRlbnRTdGFydENoKCkge1xuICAgIHJldHVybiB0aGlzLmluZGVudC5sZW5ndGggKyB0aGlzLmJ1bGxldC5sZW5ndGggKyAxO1xuICB9XG5cbiAgaXNGb2xkZWQoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuZm9sZGVkKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudC5pc0ZvbGRlZCgpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlzRm9sZFJvb3QoKSB7XG4gICAgbGV0IHBhcmVudCA9IHRoaXMuZ2V0UGFyZW50KCk7XG5cbiAgICB3aGlsZSAocGFyZW50KSB7XG4gICAgICBpZiAocGFyZW50LmZvbGRlZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHBhcmVudCA9IHBhcmVudC5nZXRQYXJlbnQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5mb2xkZWQ7XG4gIH1cblxuICBnZXRMZXZlbCgpOiBudW1iZXIge1xuICAgIGlmICghdGhpcy5wYXJlbnQpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnBhcmVudC5nZXRMZXZlbCgpICsgMTtcbiAgfVxuXG4gIHVuaW5kZW50Q29udGVudChmcm9tOiBudW1iZXIsIHRpbGw6IG51bWJlcikge1xuICAgIHRoaXMuaW5kZW50ID0gdGhpcy5pbmRlbnQuc2xpY2UoMCwgZnJvbSkgKyB0aGlzLmluZGVudC5zbGljZSh0aWxsKTtcbiAgICBpZiAodGhpcy5ub3Rlc0luZGVudCAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5ub3Rlc0luZGVudCA9XG4gICAgICAgIHRoaXMubm90ZXNJbmRlbnQuc2xpY2UoMCwgZnJvbSkgKyB0aGlzLm5vdGVzSW5kZW50LnNsaWNlKHRpbGwpO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbikge1xuICAgICAgY2hpbGQudW5pbmRlbnRDb250ZW50KGZyb20sIHRpbGwpO1xuICAgIH1cbiAgfVxuXG4gIGluZGVudENvbnRlbnQoaW5kZW50UG9zOiBudW1iZXIsIGluZGVudENoYXJzOiBzdHJpbmcpIHtcbiAgICB0aGlzLmluZGVudCA9XG4gICAgICB0aGlzLmluZGVudC5zbGljZSgwLCBpbmRlbnRQb3MpICtcbiAgICAgIGluZGVudENoYXJzICtcbiAgICAgIHRoaXMuaW5kZW50LnNsaWNlKGluZGVudFBvcyk7XG4gICAgaWYgKHRoaXMubm90ZXNJbmRlbnQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMubm90ZXNJbmRlbnQgPVxuICAgICAgICB0aGlzLm5vdGVzSW5kZW50LnNsaWNlKDAsIGluZGVudFBvcykgK1xuICAgICAgICBpbmRlbnRDaGFycyArXG4gICAgICAgIHRoaXMubm90ZXNJbmRlbnQuc2xpY2UoaW5kZW50UG9zKTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMuY2hpbGRyZW4pIHtcbiAgICAgIGNoaWxkLmluZGVudENvbnRlbnQoaW5kZW50UG9zLCBpbmRlbnRDaGFycyk7XG4gICAgfVxuICB9XG5cbiAgZ2V0Rmlyc3RMaW5lSW5kZW50KCkge1xuICAgIHJldHVybiB0aGlzLmluZGVudDtcbiAgfVxuXG4gIGdldEJ1bGxldCgpIHtcbiAgICByZXR1cm4gdGhpcy5idWxsZXQ7XG4gIH1cblxuICBnZXRQYXJlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50O1xuICB9XG5cbiAgYWRkQmVmb3JlQWxsKGxpc3Q6IExpc3QpIHtcbiAgICB0aGlzLmNoaWxkcmVuLnVuc2hpZnQobGlzdCk7XG4gICAgbGlzdC5wYXJlbnQgPSB0aGlzO1xuICB9XG5cbiAgYWRkQWZ0ZXJBbGwobGlzdDogTGlzdCkge1xuICAgIHRoaXMuY2hpbGRyZW4ucHVzaChsaXN0KTtcbiAgICBsaXN0LnBhcmVudCA9IHRoaXM7XG4gIH1cblxuICByZW1vdmVDaGlsZChsaXN0OiBMaXN0KSB7XG4gICAgY29uc3QgaSA9IHRoaXMuY2hpbGRyZW4uaW5kZXhPZihsaXN0KTtcbiAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpLCAxKTtcbiAgICBsaXN0LnBhcmVudCA9IG51bGw7XG4gIH1cblxuICBhZGRCZWZvcmUoYmVmb3JlOiBMaXN0LCBsaXN0OiBMaXN0KSB7XG4gICAgY29uc3QgaSA9IHRoaXMuY2hpbGRyZW4uaW5kZXhPZihiZWZvcmUpO1xuICAgIHRoaXMuY2hpbGRyZW4uc3BsaWNlKGksIDAsIGxpc3QpO1xuICAgIGxpc3QucGFyZW50ID0gdGhpcztcbiAgfVxuXG4gIGFkZEFmdGVyKGJlZm9yZTogTGlzdCwgbGlzdDogTGlzdCkge1xuICAgIGNvbnN0IGkgPSB0aGlzLmNoaWxkcmVuLmluZGV4T2YoYmVmb3JlKTtcbiAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpICsgMSwgMCwgbGlzdCk7XG4gICAgbGlzdC5wYXJlbnQgPSB0aGlzO1xuICB9XG5cbiAgZ2V0UHJldlNpYmxpbmdPZihsaXN0OiBMaXN0KSB7XG4gICAgY29uc3QgaSA9IHRoaXMuY2hpbGRyZW4uaW5kZXhPZihsaXN0KTtcbiAgICByZXR1cm4gaSA+IDAgPyB0aGlzLmNoaWxkcmVuW2kgLSAxXSA6IG51bGw7XG4gIH1cblxuICBnZXROZXh0U2libGluZ09mKGxpc3Q6IExpc3QpIHtcbiAgICBjb25zdCBpID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKGxpc3QpO1xuICAgIHJldHVybiBpID49IDAgJiYgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoID8gdGhpcy5jaGlsZHJlbltpICsgMV0gOiBudWxsO1xuICB9XG5cbiAgaXNFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5sZW5ndGggPT09IDA7XG4gIH1cblxuICBwcmludCgpIHtcbiAgICBsZXQgcmVzID0gXCJcIjtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgcmVzICs9IGkgPT09IDAgPyB0aGlzLmluZGVudCArIHRoaXMuYnVsbGV0ICsgXCIgXCIgOiB0aGlzLm5vdGVzSW5kZW50O1xuICAgICAgcmVzICs9IHRoaXMubGluZXNbaV07XG4gICAgICByZXMgKz0gXCJcXG5cIjtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMuY2hpbGRyZW4pIHtcbiAgICAgIHJlcyArPSBjaGlsZC5wcmludCgpO1xuICAgIH1cblxuICAgIHJldHVybiByZXM7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFJvb3Qge1xuICBwcml2YXRlIHJvb3RMaXN0ID0gbmV3IExpc3QodGhpcywgXCJcIiwgXCJcIiwgXCJcIiwgZmFsc2UpO1xuICBwcml2YXRlIHNlbGVjdGlvbnM6IElSYW5nZVtdID0gW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBzdGFydDogSVBvc2l0aW9uLFxuICAgIHByaXZhdGUgZW5kOiBJUG9zaXRpb24sXG4gICAgc2VsZWN0aW9uczogSVJhbmdlW11cbiAgKSB7XG4gICAgdGhpcy5yZXBsYWNlU2VsZWN0aW9ucyhzZWxlY3Rpb25zKTtcbiAgfVxuXG4gIGdldFJvb3RMaXN0KCkge1xuICAgIHJldHVybiB0aGlzLnJvb3RMaXN0O1xuICB9XG5cbiAgZ2V0UmFuZ2UoKTogW0lQb3NpdGlvbiwgSVBvc2l0aW9uXSB7XG4gICAgcmV0dXJuIFt7IC4uLnRoaXMuc3RhcnQgfSwgeyAuLi50aGlzLmVuZCB9XTtcbiAgfVxuXG4gIGdldFNlbGVjdGlvbnMoKTogSVJhbmdlW10ge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbnMubWFwKChzKSA9PiAoe1xuICAgICAgYW5jaG9yOiB7IC4uLnMuYW5jaG9yIH0sXG4gICAgICBoZWFkOiB7IC4uLnMuaGVhZCB9LFxuICAgIH0pKTtcbiAgfVxuXG4gIGhhc1NpbmdsZUN1cnNvcigpIHtcbiAgICBpZiAoIXRoaXMuaGFzU2luZ2xlU2VsZWN0aW9uKCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBzZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvbnNbMF07XG5cbiAgICByZXR1cm4gKFxuICAgICAgc2VsZWN0aW9uLmFuY2hvci5saW5lID09PSBzZWxlY3Rpb24uaGVhZC5saW5lICYmXG4gICAgICBzZWxlY3Rpb24uYW5jaG9yLmNoID09PSBzZWxlY3Rpb24uaGVhZC5jaFxuICAgICk7XG4gIH1cblxuICBoYXNTaW5nbGVTZWxlY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9ucy5sZW5ndGggPT09IDE7XG4gIH1cblxuICBnZXRDdXJzb3IoKSB7XG4gICAgcmV0dXJuIHsgLi4udGhpcy5zZWxlY3Rpb25zW3RoaXMuc2VsZWN0aW9ucy5sZW5ndGggLSAxXS5oZWFkIH07XG4gIH1cblxuICByZXBsYWNlQ3Vyc29yKGN1cnNvcjogSVBvc2l0aW9uKSB7XG4gICAgdGhpcy5zZWxlY3Rpb25zID0gW3sgYW5jaG9yOiBjdXJzb3IsIGhlYWQ6IGN1cnNvciB9XTtcbiAgfVxuXG4gIHJlcGxhY2VTZWxlY3Rpb25zKHNlbGVjdGlvbnM6IElSYW5nZVtdKSB7XG4gICAgaWYgKHNlbGVjdGlvbnMubGVuZ3RoIDwgMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gY3JlYXRlIFJvb3Qgd2l0aG91dCBzZWxlY3Rpb25zYCk7XG4gICAgfVxuICAgIHRoaXMuc2VsZWN0aW9ucyA9IHNlbGVjdGlvbnM7XG4gIH1cblxuICBnZXRMaXN0VW5kZXJDdXJzb3IoKTogTGlzdCB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0TGlzdFVuZGVyTGluZSh0aGlzLmdldEN1cnNvcigpLmxpbmUpO1xuICB9XG5cbiAgZ2V0TGlzdFVuZGVyTGluZShsaW5lOiBudW1iZXIpIHtcbiAgICBpZiAobGluZSA8IHRoaXMuc3RhcnQubGluZSB8fCBsaW5lID4gdGhpcy5lbmQubGluZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCByZXN1bHQ6IExpc3QgPSBudWxsO1xuICAgIGxldCBpbmRleDogbnVtYmVyID0gdGhpcy5zdGFydC5saW5lO1xuXG4gICAgY29uc3QgdmlzaXRBcnIgPSAobGw6IExpc3RbXSkgPT4ge1xuICAgICAgZm9yIChjb25zdCBsIG9mIGxsKSB7XG4gICAgICAgIGNvbnN0IGxpc3RGcm9tTGluZSA9IGluZGV4O1xuICAgICAgICBjb25zdCBsaXN0VGlsbExpbmUgPSBsaXN0RnJvbUxpbmUgKyBsLmdldExpbmVDb3VudCgpIC0gMTtcblxuICAgICAgICBpZiAobGluZSA+PSBsaXN0RnJvbUxpbmUgJiYgbGluZSA8PSBsaXN0VGlsbExpbmUpIHtcbiAgICAgICAgICByZXN1bHQgPSBsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGluZGV4ID0gbGlzdFRpbGxMaW5lICsgMTtcbiAgICAgICAgICB2aXNpdEFycihsLmdldENoaWxkcmVuKCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQgIT09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmlzaXRBcnIodGhpcy5yb290TGlzdC5nZXRDaGlsZHJlbigpKTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBnZXRDb250ZW50TGluZXNSYW5nZU9mKGxpc3Q6IExpc3QpOiBbbnVtYmVyLCBudW1iZXJdIHwgbnVsbCB7XG4gICAgbGV0IHJlc3VsdDogW251bWJlciwgbnVtYmVyXSB8IG51bGwgPSBudWxsO1xuICAgIGxldCBsaW5lOiBudW1iZXIgPSB0aGlzLnN0YXJ0LmxpbmU7XG5cbiAgICBjb25zdCB2aXNpdEFyciA9IChsbDogTGlzdFtdKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGwgb2YgbGwpIHtcbiAgICAgICAgY29uc3QgbGlzdEZyb21MaW5lID0gbGluZTtcbiAgICAgICAgY29uc3QgbGlzdFRpbGxMaW5lID0gbGlzdEZyb21MaW5lICsgbC5nZXRMaW5lQ291bnQoKSAtIDE7XG5cbiAgICAgICAgaWYgKGwgPT09IGxpc3QpIHtcbiAgICAgICAgICByZXN1bHQgPSBbbGlzdEZyb21MaW5lLCBsaXN0VGlsbExpbmVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxpbmUgPSBsaXN0VGlsbExpbmUgKyAxO1xuICAgICAgICAgIHZpc2l0QXJyKGwuZ2V0Q2hpbGRyZW4oKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVzdWx0ICE9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZpc2l0QXJyKHRoaXMucm9vdExpc3QuZ2V0Q2hpbGRyZW4oKSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZ2V0Q2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMucm9vdExpc3QuZ2V0Q2hpbGRyZW4oKTtcbiAgfVxuXG4gIHByaW50KCkge1xuICAgIGxldCByZXMgPSBcIlwiO1xuXG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLnJvb3RMaXN0LmdldENoaWxkcmVuKCkpIHtcbiAgICAgIHJlcyArPSBjaGlsZC5wcmludCgpO1xuICAgIH1cblxuICAgIHJldHVybiByZXMucmVwbGFjZSgvXFxuJC8sIFwiXCIpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBMb2dnZXJTZXJ2aWNlIH0gZnJvbSBcIi4vTG9nZ2VyU2VydmljZVwiO1xuaW1wb3J0IHsgT2JzaWRpYW5TZXJ2aWNlIH0gZnJvbSBcIi4vT2JzaWRpYW5TZXJ2aWNlXCI7XG5pbXBvcnQgeyBMaXN0LCBSb290IH0gZnJvbSBcIi4uL3Jvb3RcIjtcbmltcG9ydCB7IElPcGVyYXRpb24gfSBmcm9tIFwiLi4vb3BlcmF0aW9ucy9JT3BlcmF0aW9uXCI7XG5cbmNvbnN0IGJ1bGxldFNpZ24gPSBcIi0qK1wiO1xuXG5jb25zdCBsaXN0SXRlbVdpdGhvdXRTcGFjZXNSZSA9IG5ldyBSZWdFeHAoYF5bJHtidWxsZXRTaWdufV0gYCk7XG5jb25zdCBsaXN0SXRlbVJlID0gbmV3IFJlZ0V4cChgXlsgXFx0XSpbJHtidWxsZXRTaWdufV0gYCk7XG5jb25zdCBzdHJpbmdXaXRoU3BhY2VzUmUgPSBuZXcgUmVnRXhwKGBeWyBcXHRdK2ApO1xuY29uc3QgcGFyc2VMaXN0SXRlbVJlID0gbmV3IFJlZ0V4cChgXihbIFxcdF0qKShbJHtidWxsZXRTaWdufV0pICguKikkYCk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUFwcGx5Q2hhbmdlc0xpc3Qge1xuICBpc0ZvbGRSb290KCk6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUFwcGx5Q2hhbmdlc1Jvb3Qge1xuICBnZXRSYW5nZSgpOiBbQ29kZU1pcnJvci5Qb3NpdGlvbiwgQ29kZU1pcnJvci5Qb3NpdGlvbl07XG4gIGdldFNlbGVjdGlvbnMoKTogeyBhbmNob3I6IENvZGVNaXJyb3IuUG9zaXRpb247IGhlYWQ6IENvZGVNaXJyb3IuUG9zaXRpb24gfVtdO1xuICBwcmludCgpOiBzdHJpbmc7XG4gIGdldExpc3RVbmRlckxpbmUobDogbnVtYmVyKTogSUFwcGx5Q2hhbmdlc0xpc3Q7XG59XG5cbmludGVyZmFjZSBJUGFyc2VMaXN0TGlzdCB7XG4gIGdldEZpcnN0TGluZUluZGVudCgpOiBzdHJpbmc7XG4gIHNldE5vdGVzSW5kZW50KG5vdGVzSW5kZW50OiBzdHJpbmcpOiB2b2lkO1xuICBnZXROb3Rlc0luZGVudCgpOiBzdHJpbmcgfCBudWxsO1xuICBhZGRMaW5lKHRleHQ6IHN0cmluZyk6IHZvaWQ7XG4gIGdldFBhcmVudCgpOiBJUGFyc2VMaXN0TGlzdCB8IG51bGw7XG4gIGFkZEFmdGVyQWxsKGxpc3Q6IElQYXJzZUxpc3RMaXN0KTogdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIExpc3RzU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgbG9nZ2VyU2VydmljZTogTG9nZ2VyU2VydmljZSxcbiAgICBwcml2YXRlIG9ic2lkaWFuU2VydmljZTogT2JzaWRpYW5TZXJ2aWNlXG4gICkge31cblxuICBldmFsT3BlcmF0aW9uKHJvb3Q6IFJvb3QsIG9wOiBJT3BlcmF0aW9uLCBlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yKSB7XG4gICAgb3AucGVyZm9ybSgpO1xuXG4gICAgaWYgKG9wLnNob3VsZFVwZGF0ZSgpKSB7XG4gICAgICB0aGlzLmFwcGx5Q2hhbmdlcyhlZGl0b3IsIHJvb3QpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBzaG91bGRVcGRhdGU6IG9wLnNob3VsZFVwZGF0ZSgpLFxuICAgICAgc2hvdWxkU3RvcFByb3BhZ2F0aW9uOiBvcC5zaG91bGRTdG9wUHJvcGFnYXRpb24oKSxcbiAgICB9O1xuICB9XG5cbiAgcGVyZm9ybU9wZXJhdGlvbihcbiAgICBjYjogKHJvb3Q6IFJvb3QpID0+IElPcGVyYXRpb24sXG4gICAgZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcixcbiAgICBjdXJzb3IgPSBlZGl0b3IuZ2V0Q3Vyc29yKClcbiAgKSB7XG4gICAgY29uc3Qgcm9vdCA9IHRoaXMucGFyc2VMaXN0KGVkaXRvciwgY3Vyc29yKTtcblxuICAgIGlmICghcm9vdCkge1xuICAgICAgcmV0dXJuIHsgc2hvdWxkVXBkYXRlOiBmYWxzZSwgc2hvdWxkU3RvcFByb3BhZ2F0aW9uOiBmYWxzZSB9O1xuICAgIH1cblxuICAgIGNvbnN0IG9wID0gY2Iocm9vdCk7XG5cbiAgICByZXR1cm4gdGhpcy5ldmFsT3BlcmF0aW9uKHJvb3QsIG9wLCBlZGl0b3IpO1xuICB9XG5cbiAgcGFyc2VMaXN0KFxuICAgIGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IsXG4gICAgY3Vyc29yID0gZWRpdG9yLmdldEN1cnNvcigpXG4gICk6IFJvb3QgfCBudWxsIHtcbiAgICBjb25zdCBkID0gdGhpcy5sb2dnZXJTZXJ2aWNlLmJpbmQoXCJwYXJzZUxpc3RcIik7XG4gICAgY29uc3QgZXJyb3IgPSAobXNnOiBzdHJpbmcpOiBudWxsID0+IHtcbiAgICAgIGQobXNnKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG5cbiAgICBjb25zdCBsaW5lID0gZWRpdG9yLmdldExpbmUoY3Vyc29yLmxpbmUpO1xuXG4gICAgbGV0IGxpc3RMb29raW5nUG9zOiBudW1iZXIgfCBudWxsID0gbnVsbDtcblxuICAgIGlmICh0aGlzLmlzTGlzdEl0ZW0obGluZSkpIHtcbiAgICAgIGxpc3RMb29raW5nUG9zID0gY3Vyc29yLmxpbmU7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzRW1wdHlMaW5lT3JOb3RlKGxpbmUpKSB7XG4gICAgICBsZXQgbGlzdExvb2tpbmdQb3NTZWFyY2ggPSBjdXJzb3IubGluZSAtIDE7XG4gICAgICB3aGlsZSAobGlzdExvb2tpbmdQb3NTZWFyY2ggPj0gZWRpdG9yLmZpcnN0TGluZSgpKSB7XG4gICAgICAgIGNvbnN0IGxpbmUgPSBlZGl0b3IuZ2V0TGluZShsaXN0TG9va2luZ1Bvc1NlYXJjaCk7XG4gICAgICAgIGlmICh0aGlzLmlzTGlzdEl0ZW0obGluZSkpIHtcbiAgICAgICAgICBsaXN0TG9va2luZ1BvcyA9IGxpc3RMb29raW5nUG9zU2VhcmNoO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNFbXB0eUxpbmVPck5vdGUobGluZSkpIHtcbiAgICAgICAgICBsaXN0TG9va2luZ1Bvc1NlYXJjaC0tO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGxpc3RMb29raW5nUG9zID09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxldCBsaXN0U3RhcnRMaW5lOiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgICBsZXQgbGlzdFN0YXJ0TGluZUxvb2t1cCA9IGxpc3RMb29raW5nUG9zO1xuICAgIHdoaWxlIChsaXN0U3RhcnRMaW5lTG9va3VwID49IGVkaXRvci5maXJzdExpbmUoKSkge1xuICAgICAgY29uc3QgbGluZSA9IGVkaXRvci5nZXRMaW5lKGxpc3RTdGFydExpbmVMb29rdXApO1xuICAgICAgaWYgKCF0aGlzLmlzTGlzdEl0ZW0obGluZSkgJiYgIXRoaXMuaXNFbXB0eUxpbmVPck5vdGUobGluZSkpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5pc0xpc3RJdGVtV2l0aG91dFNwYWNlcyhsaW5lKSkge1xuICAgICAgICBsaXN0U3RhcnRMaW5lID0gbGlzdFN0YXJ0TGluZUxvb2t1cDtcbiAgICAgIH1cbiAgICAgIGxpc3RTdGFydExpbmVMb29rdXAtLTtcbiAgICB9XG5cbiAgICBpZiAobGlzdFN0YXJ0TGluZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IGxpc3RFbmRMaW5lID0gbGlzdExvb2tpbmdQb3M7XG4gICAgbGV0IGxpc3RFbmRMaW5lTG9va3VwID0gbGlzdExvb2tpbmdQb3M7XG4gICAgd2hpbGUgKGxpc3RFbmRMaW5lTG9va3VwIDw9IGVkaXRvci5sYXN0TGluZSgpKSB7XG4gICAgICBjb25zdCBsaW5lID0gZWRpdG9yLmdldExpbmUobGlzdEVuZExpbmVMb29rdXApO1xuICAgICAgaWYgKCF0aGlzLmlzTGlzdEl0ZW0obGluZSkgJiYgIXRoaXMuaXNFbXB0eUxpbmVPck5vdGUobGluZSkpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuaXNFbXB0eUxpbmUobGluZSkpIHtcbiAgICAgICAgbGlzdEVuZExpbmUgPSBsaXN0RW5kTGluZUxvb2t1cDtcbiAgICAgIH1cbiAgICAgIGxpc3RFbmRMaW5lTG9va3VwKys7XG4gICAgfVxuXG4gICAgaWYgKGxpc3RTdGFydExpbmUgPiBjdXJzb3IubGluZSB8fCBsaXN0RW5kTGluZSA8IGN1cnNvci5saW5lKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCByb290ID0gbmV3IFJvb3QoXG4gICAgICB7IGxpbmU6IGxpc3RTdGFydExpbmUsIGNoOiAwIH0sXG4gICAgICB7IGxpbmU6IGxpc3RFbmRMaW5lLCBjaDogZWRpdG9yLmdldExpbmUobGlzdEVuZExpbmUpLmxlbmd0aCB9LFxuICAgICAgZWRpdG9yLmxpc3RTZWxlY3Rpb25zKCkubWFwKChyKSA9PiAoe1xuICAgICAgICBhbmNob3I6IHsgbGluZTogci5hbmNob3IubGluZSwgY2g6IHIuYW5jaG9yLmNoIH0sXG4gICAgICAgIGhlYWQ6IHsgbGluZTogci5oZWFkLmxpbmUsIGNoOiByLmhlYWQuY2ggfSxcbiAgICAgIH0pKVxuICAgICk7XG5cbiAgICBsZXQgY3VycmVudFBhcmVudDogSVBhcnNlTGlzdExpc3QgPSByb290LmdldFJvb3RMaXN0KCk7XG4gICAgbGV0IGN1cnJlbnRMaXN0OiBJUGFyc2VMaXN0TGlzdCB8IG51bGwgPSBudWxsO1xuICAgIGxldCBjdXJyZW50SW5kZW50ID0gXCJcIjtcblxuICAgIGZvciAobGV0IGwgPSBsaXN0U3RhcnRMaW5lOyBsIDw9IGxpc3RFbmRMaW5lOyBsKyspIHtcbiAgICAgIGNvbnN0IGxpbmUgPSBlZGl0b3IuZ2V0TGluZShsKTtcbiAgICAgIGNvbnN0IG1hdGNoZXMgPSBwYXJzZUxpc3RJdGVtUmUuZXhlYyhsaW5lKTtcblxuICAgICAgaWYgKG1hdGNoZXMpIHtcbiAgICAgICAgY29uc3QgW18sIGluZGVudCwgYnVsbGV0LCBjb250ZW50XSA9IG1hdGNoZXM7XG5cbiAgICAgICAgY29uc3QgY29tcGFyZUxlbmd0aCA9IE1hdGgubWluKGN1cnJlbnRJbmRlbnQubGVuZ3RoLCBpbmRlbnQubGVuZ3RoKTtcbiAgICAgICAgY29uc3QgaW5kZW50U2xpY2UgPSBpbmRlbnQuc2xpY2UoMCwgY29tcGFyZUxlbmd0aCk7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRJbmRlbnRTbGljZSA9IGN1cnJlbnRJbmRlbnQuc2xpY2UoMCwgY29tcGFyZUxlbmd0aCk7XG5cbiAgICAgICAgaWYgKGluZGVudFNsaWNlICE9PSBjdXJyZW50SW5kZW50U2xpY2UpIHtcbiAgICAgICAgICBjb25zdCBleHBlY3RlZCA9IGN1cnJlbnRJbmRlbnRTbGljZVxuICAgICAgICAgICAgLnJlcGxhY2UoLyAvZywgXCJTXCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvXFx0L2csIFwiVFwiKTtcbiAgICAgICAgICBjb25zdCBnb3QgPSBpbmRlbnRTbGljZS5yZXBsYWNlKC8gL2csIFwiU1wiKS5yZXBsYWNlKC9cXHQvZywgXCJUXCIpO1xuXG4gICAgICAgICAgcmV0dXJuIGVycm9yKFxuICAgICAgICAgICAgYFVuYWJsZSB0byBwYXJzZSBsaXN0OiBleHBlY3RlZCBpbmRlbnQgXCIke2V4cGVjdGVkfVwiLCBnb3QgXCIke2dvdH1cImBcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGluZGVudC5sZW5ndGggPiBjdXJyZW50SW5kZW50Lmxlbmd0aCkge1xuICAgICAgICAgIGN1cnJlbnRQYXJlbnQgPSBjdXJyZW50TGlzdDtcbiAgICAgICAgICBjdXJyZW50SW5kZW50ID0gaW5kZW50O1xuICAgICAgICB9IGVsc2UgaWYgKGluZGVudC5sZW5ndGggPCBjdXJyZW50SW5kZW50Lmxlbmd0aCkge1xuICAgICAgICAgIHdoaWxlIChcbiAgICAgICAgICAgIGN1cnJlbnRQYXJlbnQuZ2V0Rmlyc3RMaW5lSW5kZW50KCkubGVuZ3RoID49IGluZGVudC5sZW5ndGggJiZcbiAgICAgICAgICAgIGN1cnJlbnRQYXJlbnQuZ2V0UGFyZW50KClcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGN1cnJlbnRQYXJlbnQgPSBjdXJyZW50UGFyZW50LmdldFBhcmVudCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJyZW50SW5kZW50ID0gY3VycmVudFBhcmVudC5nZXRGaXJzdExpbmVJbmRlbnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZvbGRlZCA9ICEhKGVkaXRvciBhcyBhbnkpLmlzRm9sZGVkKHtcbiAgICAgICAgICBsaW5lOiBNYXRoLm1pbihsICsgMSwgbGlzdEVuZExpbmUpLFxuICAgICAgICAgIGNoOiAwLFxuICAgICAgICB9KTtcblxuICAgICAgICBjdXJyZW50TGlzdCA9IG5ldyBMaXN0KHJvb3QsIGluZGVudCwgYnVsbGV0LCBjb250ZW50LCBmb2xkZWQpO1xuICAgICAgICBjdXJyZW50UGFyZW50LmFkZEFmdGVyQWxsKGN1cnJlbnRMaXN0KTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0VtcHR5TGluZU9yTm90ZShsaW5lKSkge1xuICAgICAgICBpZiAoIWN1cnJlbnRMaXN0KSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9yKFxuICAgICAgICAgICAgYFVuYWJsZSB0byBwYXJzZSBsaXN0OiBleHBlY3RlZCBsaXN0IGl0ZW0sIGdvdCBlbXB0eSBsaW5lYFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpbmRlbnRUb0NoZWNrID0gY3VycmVudExpc3QuZ2V0Tm90ZXNJbmRlbnQoKSB8fCBjdXJyZW50SW5kZW50O1xuXG4gICAgICAgIGlmIChsaW5lLmluZGV4T2YoaW5kZW50VG9DaGVjaykgIT09IDApIHtcbiAgICAgICAgICBjb25zdCBleHBlY3RlZCA9IGluZGVudFRvQ2hlY2sucmVwbGFjZSgvIC9nLCBcIlNcIikucmVwbGFjZSgvXFx0L2csIFwiVFwiKTtcbiAgICAgICAgICBjb25zdCBnb3QgPSBsaW5lXG4gICAgICAgICAgICAubWF0Y2goL15bIFxcdF0qLylbMF1cbiAgICAgICAgICAgIC5yZXBsYWNlKC8gL2csIFwiU1wiKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcdC9nLCBcIlRcIik7XG5cbiAgICAgICAgICByZXR1cm4gZXJyb3IoXG4gICAgICAgICAgICBgVW5hYmxlIHRvIHBhcnNlIGxpc3Q6IGV4cGVjdGVkIGluZGVudCBcIiR7ZXhwZWN0ZWR9XCIsIGdvdCBcIiR7Z290fVwiYFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWN1cnJlbnRMaXN0LmdldE5vdGVzSW5kZW50KCkpIHtcbiAgICAgICAgICBjb25zdCBtYXRjaGVzID0gbGluZS5tYXRjaCgvXlsgXFx0XSsvKTtcblxuICAgICAgICAgIGlmICghbWF0Y2hlcyB8fCBtYXRjaGVzWzBdLmxlbmd0aCA8PSBjdXJyZW50SW5kZW50Lmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yKFxuICAgICAgICAgICAgICBgVW5hYmxlIHRvIHBhcnNlIGxpc3Q6IGV4cGVjdGVkIHNvbWUgaW5kZW50LCBnb3Qgbm8gaW5kZW50YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjdXJyZW50TGlzdC5zZXROb3Rlc0luZGVudChtYXRjaGVzWzBdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJlbnRMaXN0LmFkZExpbmUobGluZS5zbGljZShjdXJyZW50TGlzdC5nZXROb3Rlc0luZGVudCgpLmxlbmd0aCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGVycm9yKFxuICAgICAgICAgIGBVbmFibGUgdG8gcGFyc2UgbGlzdDogZXhwZWN0ZWQgbGlzdCBpdGVtIG9yIGVtcHR5IGxpbmUsIGdvdCBcIiR7bGluZX1cImBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcm9vdDtcbiAgfVxuXG4gIHByaXZhdGUgYXBwbHlDaGFuZ2VzKGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IsIHJvb3Q6IElBcHBseUNoYW5nZXNSb290KSB7XG4gICAgY29uc3Qgcm9vdFJhbmdlID0gcm9vdC5nZXRSYW5nZSgpO1xuICAgIGNvbnN0IG9sZFN0cmluZyA9IGVkaXRvci5nZXRSYW5nZShyb290UmFuZ2VbMF0sIHJvb3RSYW5nZVsxXSk7XG4gICAgY29uc3QgbmV3U3RyaW5nID0gcm9vdC5wcmludCgpO1xuXG4gICAgY29uc3QgZnJvbUxpbmUgPSByb290UmFuZ2VbMF0ubGluZTtcbiAgICBjb25zdCB0b0xpbmUgPSByb290UmFuZ2VbMV0ubGluZTtcblxuICAgIGZvciAobGV0IGwgPSBmcm9tTGluZTsgbCA8PSB0b0xpbmU7IGwrKykge1xuICAgICAgKGVkaXRvciBhcyBhbnkpLmZvbGRDb2RlKGwsIG51bGwsIFwidW5mb2xkXCIpO1xuICAgIH1cblxuICAgIGxldCBjaGFuZ2VGcm9tID0geyAuLi5yb290UmFuZ2VbMF0gfTtcbiAgICBsZXQgY2hhbmdlVG8gPSB7IC4uLnJvb3RSYW5nZVsxXSB9O1xuICAgIGxldCBvbGRUbXAgPSBvbGRTdHJpbmc7XG4gICAgbGV0IG5ld1RtcCA9IG5ld1N0cmluZztcblxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBjb25zdCBubEluZGV4ID0gb2xkVG1wLmluZGV4T2YoXCJcXG5cIik7XG4gICAgICBpZiAobmxJbmRleCA8IDApIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjb25zdCBvbGRMaW5lID0gb2xkVG1wLnNsaWNlKDAsIG5sSW5kZXggKyAxKTtcbiAgICAgIGNvbnN0IG5ld0xpbmUgPSBuZXdUbXAuc2xpY2UoMCwgb2xkTGluZS5sZW5ndGgpO1xuICAgICAgaWYgKG9sZExpbmUgIT09IG5ld0xpbmUpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjaGFuZ2VGcm9tLmxpbmUrKztcbiAgICAgIG9sZFRtcCA9IG9sZFRtcC5zbGljZShvbGRMaW5lLmxlbmd0aCk7XG4gICAgICBuZXdUbXAgPSBuZXdUbXAuc2xpY2Uob2xkTGluZS5sZW5ndGgpO1xuICAgIH1cbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgY29uc3QgbmxJbmRleCA9IG9sZFRtcC5sYXN0SW5kZXhPZihcIlxcblwiKTtcbiAgICAgIGlmIChubEluZGV4IDwgMCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNvbnN0IG9sZExpbmUgPSBvbGRUbXAuc2xpY2UobmxJbmRleCk7XG4gICAgICBjb25zdCBuZXdMaW5lID0gbmV3VG1wLnNsaWNlKC1vbGRMaW5lLmxlbmd0aCk7XG4gICAgICBpZiAob2xkTGluZSAhPT0gbmV3TGluZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIG9sZFRtcCA9IG9sZFRtcC5zbGljZSgwLCAtb2xkTGluZS5sZW5ndGgpO1xuICAgICAgbmV3VG1wID0gbmV3VG1wLnNsaWNlKDAsIC1vbGRMaW5lLmxlbmd0aCk7XG5cbiAgICAgIGNvbnN0IG5sSW5kZXgyID0gb2xkVG1wLmxhc3RJbmRleE9mKFwiXFxuXCIpO1xuICAgICAgY2hhbmdlVG8uY2ggPVxuICAgICAgICBubEluZGV4MiA+PSAwID8gb2xkVG1wLmxlbmd0aCAtIG5sSW5kZXgyIC0gMSA6IG9sZFRtcC5sZW5ndGg7XG4gICAgICBjaGFuZ2VUby5saW5lLS07XG4gICAgfVxuXG4gICAgaWYgKG9sZFRtcCAhPT0gbmV3VG1wKSB7XG4gICAgICBlZGl0b3IucmVwbGFjZVJhbmdlKG5ld1RtcCwgY2hhbmdlRnJvbSwgY2hhbmdlVG8pO1xuICAgIH1cblxuICAgIGVkaXRvci5zZXRTZWxlY3Rpb25zKHJvb3QuZ2V0U2VsZWN0aW9ucygpKTtcblxuICAgIC8vIFRPRE86IGxpbmVzIGNvdWxkIGJlIGRpZmZlcmVudCBiZWNhdXNlIG9mIGRlbGV0ZXRpb25cbiAgICBmb3IgKGxldCBsID0gZnJvbUxpbmU7IGwgPD0gdG9MaW5lOyBsKyspIHtcbiAgICAgIGNvbnN0IGxpbmUgPSByb290LmdldExpc3RVbmRlckxpbmUobCk7XG4gICAgICBpZiAobGluZSAmJiBsaW5lLmlzRm9sZFJvb3QoKSkge1xuICAgICAgICAoZWRpdG9yIGFzIGFueSkuZm9sZENvZGUobCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0RGVmYXVsdEluZGVudENoYXJzKCkge1xuICAgIGNvbnN0IHsgdXNlVGFiLCB0YWJTaXplIH0gPSB0aGlzLm9ic2lkaWFuU2VydmljZS5nZXRPYnNpZGlhblRhYnNTZXR0aWducygpO1xuXG4gICAgcmV0dXJuIHVzZVRhYiA/IFwiXFx0XCIgOiBuZXcgQXJyYXkodGFiU2l6ZSkuZmlsbChcIiBcIikuam9pbihcIlwiKTtcbiAgfVxuXG4gIHByaXZhdGUgaXNFbXB0eUxpbmUobGluZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGxpbmUubGVuZ3RoID09PSAwO1xuICB9XG5cbiAgcHJpdmF0ZSBpc0VtcHR5TGluZU9yTm90ZShsaW5lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5pc0VtcHR5TGluZShsaW5lKSB8fCBzdHJpbmdXaXRoU3BhY2VzUmUudGVzdChsaW5lKTtcbiAgfVxuXG4gIHByaXZhdGUgaXNMaXN0SXRlbShsaW5lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbGlzdEl0ZW1SZS50ZXN0KGxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBpc0xpc3RJdGVtV2l0aG91dFNwYWNlcyhsaW5lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbGlzdEl0ZW1XaXRob3V0U3BhY2VzUmUudGVzdChsaW5lKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgU2V0dGluZ3NTZXJ2aWNlIH0gZnJvbSBcIi4vU2V0dGluZ3NTZXJ2aWNlXCI7XG5cbmV4cG9ydCBjbGFzcyBMb2dnZXJTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzZXR0aW5nc1NlcnZpY2U6IFNldHRpbmdzU2VydmljZSkge31cblxuICBsb2cobWV0aG9kOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgaWYgKCF0aGlzLnNldHRpbmdzU2VydmljZS5kZWJ1Zykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnNvbGUuaW5mbyhtZXRob2QsIC4uLmFyZ3MpO1xuICB9XG5cbiAgYmluZChtZXRob2Q6IHN0cmluZykge1xuICAgIHJldHVybiAoLi4uYXJnczogYW55W10pID0+IHRoaXMubG9nKG1ldGhvZCwgLi4uYXJncyk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFNldHRpbmdzU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9TZXR0aW5nc1NlcnZpY2VcIjtcbmltcG9ydCB7IFBsdWdpbl8yIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBJRmVhdHVyZSB9IGZyb20gXCIuL0lGZWF0dXJlXCI7XG5pbXBvcnQgeyBPYnNpZGlhblNlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvT2JzaWRpYW5TZXJ2aWNlXCI7XG5cbmNvbnN0IHRleHQgPSAoc2l6ZTogbnVtYmVyKSA9PlxuICBgT3V0bGluZXIgc3R5bGVzIGRvZXNuJ3Qgd29yayB3aXRoICR7c2l6ZX0tc3BhY2VzLXRhYnMuIFBsZWFzZSBjaGVjayB5b3VyIE9ic2lkaWFuIHNldHRpbmdzLmA7XG5cbmV4cG9ydCBjbGFzcyBMaXN0c1N0eWxlc0ZlYXR1cmUgaW1wbGVtZW50cyBJRmVhdHVyZSB7XG4gIHByaXZhdGUgc3RhdHVzQmFyVGV4dDogSFRNTEVsZW1lbnQ7XG4gIHByaXZhdGUgaW50ZXJ2YWw6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBzZXR0aW5nc1NlcnZpY2U6IFNldHRpbmdzU2VydmljZSxcbiAgICBwcml2YXRlIG9ic2lkaWFuU2VydmljZTogT2JzaWRpYW5TZXJ2aWNlXG4gICkge31cblxuICBhc3luYyBsb2FkKCkge1xuICAgIGlmICh0aGlzLnNldHRpbmdzU2VydmljZS5zdHlsZUxpc3RzKSB7XG4gICAgICB0aGlzLmFkZExpc3RzU3R5bGVzKCk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXR0aW5nc1NlcnZpY2Uub25DaGFuZ2UoXCJzdHlsZUxpc3RzXCIsIHRoaXMub25TdHlsZUxpc3RzU2V0dGluZ0NoYW5nZSk7XG5cbiAgICB0aGlzLmFkZFN0YXR1c0JhclRleHQoKTtcbiAgICB0aGlzLnN0YXJ0U3RhdHVzQmFySW50ZXJ2YWwoKTtcbiAgfVxuXG4gIGFzeW5jIHVubG9hZCgpIHtcbiAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuICAgIGlmICh0aGlzLnN0YXR1c0JhclRleHQucGFyZW50RWxlbWVudCkge1xuICAgICAgdGhpcy5zdGF0dXNCYXJUZXh0LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5zdGF0dXNCYXJUZXh0KTtcbiAgICB9XG4gICAgdGhpcy5zZXR0aW5nc1NlcnZpY2UucmVtb3ZlQ2FsbGJhY2soXG4gICAgICBcInN0eWxlTGlzdHNcIixcbiAgICAgIHRoaXMub25TdHlsZUxpc3RzU2V0dGluZ0NoYW5nZVxuICAgICk7XG4gICAgdGhpcy5yZW1vdmVMaXN0c1N0eWxlcygpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGFydFN0YXR1c0JhckludGVydmFsKCkge1xuICAgIGxldCB2aXNpYmxlOiBudW1iZXIgfCBudWxsID0gbnVsbDtcblxuICAgIHRoaXMuaW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgY29uc3QgeyB1c2VUYWIsIHRhYlNpemUgfSA9XG4gICAgICAgIHRoaXMub2JzaWRpYW5TZXJ2aWNlLmdldE9ic2lkaWFuVGFic1NldHRpZ25zKCk7XG5cbiAgICAgIGNvbnN0IHNob3VsZEJlVmlzaWJsZSA9XG4gICAgICAgIHRoaXMuc2V0dGluZ3NTZXJ2aWNlLnN0eWxlTGlzdHMgJiYgdXNlVGFiICYmIHRhYlNpemUgIT09IDQ7XG5cbiAgICAgIGlmIChzaG91bGRCZVZpc2libGUgJiYgdmlzaWJsZSAhPT0gdGFiU2l6ZSkge1xuICAgICAgICB0aGlzLnN0YXR1c0JhclRleHQuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgdGhpcy5zdGF0dXNCYXJUZXh0LnNldFRleHQodGV4dCh0YWJTaXplKSk7XG4gICAgICAgIHZpc2libGUgPSB0YWJTaXplO1xuICAgICAgfSBlbHNlIGlmICghc2hvdWxkQmVWaXNpYmxlICYmIHZpc2libGUgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5zdGF0dXNCYXJUZXh0LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgdmlzaWJsZSA9IG51bGw7XG4gICAgICB9XG4gICAgfSwgMTAwMCk7XG4gIH1cblxuICBwcml2YXRlIG9uU3R5bGVMaXN0c1NldHRpbmdDaGFuZ2UgPSAoc3R5bGVMaXN0czogYm9vbGVhbikgPT4ge1xuICAgIGlmIChzdHlsZUxpc3RzKSB7XG4gICAgICB0aGlzLmFkZExpc3RzU3R5bGVzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVtb3ZlTGlzdHNTdHlsZXMoKTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSBhZGRTdGF0dXNCYXJUZXh0KCkge1xuICAgIHRoaXMuc3RhdHVzQmFyVGV4dCA9IHRoaXMucGx1Z2luLmFkZFN0YXR1c0Jhckl0ZW0oKTtcbiAgICB0aGlzLnN0YXR1c0JhclRleHQuc3R5bGUuY29sb3IgPSBcInJlZFwiO1xuICAgIHRoaXMuc3RhdHVzQmFyVGV4dC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gIH1cblxuICBwcml2YXRlIGFkZExpc3RzU3R5bGVzKCkge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChcIm91dGxpbmVyLXBsdWdpbi1ibHNcIik7XG4gIH1cblxuICBwcml2YXRlIHJlbW92ZUxpc3RzU3R5bGVzKCkge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcIm91dGxpbmVyLXBsdWdpbi1ibHNcIik7XG4gIH1cbn1cbiIsImltcG9ydCB7IFJvb3QgfSBmcm9tIFwiLi4vcm9vdFwiO1xuaW1wb3J0IHsgSU9wZXJhdGlvbiB9IGZyb20gXCIuL0lPcGVyYXRpb25cIjtcblxuZXhwb3J0IGNsYXNzIE1vdmVMZWZ0T3BlcmF0aW9uIGltcGxlbWVudHMgSU9wZXJhdGlvbiB7XG4gIHByaXZhdGUgc3RvcFByb3BhZ2F0aW9uID0gZmFsc2U7XG4gIHByaXZhdGUgdXBkYXRlZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcm9vdDogUm9vdCkge31cblxuICBzaG91bGRTdG9wUHJvcGFnYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcFByb3BhZ2F0aW9uO1xuICB9XG5cbiAgc2hvdWxkVXBkYXRlKCkge1xuICAgIHJldHVybiB0aGlzLnVwZGF0ZWQ7XG4gIH1cblxuICBwZXJmb3JtKCkge1xuICAgIGNvbnN0IHsgcm9vdCB9ID0gdGhpcztcblxuICAgIGlmICghcm9vdC5oYXNTaW5nbGVDdXJzb3IoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc3RvcFByb3BhZ2F0aW9uID0gdHJ1ZTtcblxuICAgIGNvbnN0IGxpc3QgPSByb290LmdldExpc3RVbmRlckN1cnNvcigpO1xuICAgIGNvbnN0IHBhcmVudCA9IGxpc3QuZ2V0UGFyZW50KCk7XG4gICAgY29uc3QgZ3JhbmRQYXJlbnQgPSBwYXJlbnQuZ2V0UGFyZW50KCk7XG5cbiAgICBpZiAoIWdyYW5kUGFyZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVkID0gdHJ1ZTtcblxuICAgIGNvbnN0IGxpc3RTdGFydExpbmVCZWZvcmUgPSByb290LmdldENvbnRlbnRMaW5lc1JhbmdlT2YobGlzdClbMF07XG4gICAgY29uc3QgaW5kZW50Um1Gcm9tID0gcGFyZW50LmdldEZpcnN0TGluZUluZGVudCgpLmxlbmd0aDtcbiAgICBjb25zdCBpbmRlbnRSbVRpbGwgPSBsaXN0LmdldEZpcnN0TGluZUluZGVudCgpLmxlbmd0aDtcblxuICAgIHBhcmVudC5yZW1vdmVDaGlsZChsaXN0KTtcbiAgICBncmFuZFBhcmVudC5hZGRBZnRlcihwYXJlbnQsIGxpc3QpO1xuICAgIGxpc3QudW5pbmRlbnRDb250ZW50KGluZGVudFJtRnJvbSwgaW5kZW50Um1UaWxsKTtcblxuICAgIGNvbnN0IGxpc3RTdGFydExpbmVBZnRlciA9IHJvb3QuZ2V0Q29udGVudExpbmVzUmFuZ2VPZihsaXN0KVswXTtcbiAgICBjb25zdCBsaW5lRGlmZiA9IGxpc3RTdGFydExpbmVBZnRlciAtIGxpc3RTdGFydExpbmVCZWZvcmU7XG4gICAgY29uc3QgY2hEaWZmID0gaW5kZW50Um1UaWxsIC0gaW5kZW50Um1Gcm9tO1xuXG4gICAgY29uc3QgY3Vyc29yID0gcm9vdC5nZXRDdXJzb3IoKTtcbiAgICByb290LnJlcGxhY2VDdXJzb3Ioe1xuICAgICAgbGluZTogY3Vyc29yLmxpbmUgKyBsaW5lRGlmZixcbiAgICAgIGNoOiBjdXJzb3IuY2ggLSBjaERpZmYsXG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFJvb3QgfSBmcm9tIFwiLi4vcm9vdFwiO1xuaW1wb3J0IHsgTW92ZUxlZnRPcGVyYXRpb24gfSBmcm9tIFwiLi9Nb3ZlTGVmdE9wZXJhdGlvblwiO1xuaW1wb3J0IHsgSU9wZXJhdGlvbiB9IGZyb20gXCIuL0lPcGVyYXRpb25cIjtcblxuZXhwb3J0IGNsYXNzIE91dGRlbnRJZkxpbmVJc0VtcHR5T3BlcmF0aW9uIGltcGxlbWVudHMgSU9wZXJhdGlvbiB7XG4gIHByaXZhdGUgbW92ZUxlZnRPcDogTW92ZUxlZnRPcGVyYXRpb247XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByb290OiBSb290KSB7XG4gICAgdGhpcy5tb3ZlTGVmdE9wID0gbmV3IE1vdmVMZWZ0T3BlcmF0aW9uKHJvb3QpO1xuICB9XG5cbiAgc2hvdWxkU3RvcFByb3BhZ2F0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm1vdmVMZWZ0T3Auc2hvdWxkU3RvcFByb3BhZ2F0aW9uKCk7XG4gIH1cblxuICBzaG91bGRVcGRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMubW92ZUxlZnRPcC5zaG91bGRVcGRhdGUoKTtcbiAgfVxuXG4gIHBlcmZvcm0oKSB7XG4gICAgY29uc3QgeyByb290IH0gPSB0aGlzO1xuXG4gICAgaWYgKCFyb290Lmhhc1NpbmdsZUN1cnNvcigpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbGlzdCA9IHJvb3QuZ2V0TGlzdFVuZGVyQ3Vyc29yKCk7XG4gICAgY29uc3QgbGluZXMgPSBsaXN0LmdldExpbmVzKCk7XG5cbiAgICBpZiAobGluZXMubGVuZ3RoID4gMSB8fCBsaW5lc1swXS5sZW5ndGggPiAwIHx8IGxpc3QuZ2V0TGV2ZWwoKSA9PT0gMSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubW92ZUxlZnRPcC5wZXJmb3JtKCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFBsdWdpbl8yIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBPdXRkZW50SWZMaW5lSXNFbXB0eU9wZXJhdGlvbiB9IGZyb20gXCIuLi9vcGVyYXRpb25zL091dGRlbnRJZkxpbmVJc0VtcHR5T3BlcmF0aW9uXCI7XG5pbXBvcnQgeyBJRmVhdHVyZSB9IGZyb20gXCIuL0lGZWF0dXJlXCI7XG5pbXBvcnQgeyBMaXN0c1NlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvTGlzdHNTZXJ2aWNlXCI7XG5pbXBvcnQgeyBTZXR0aW5nc1NlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvU2V0dGluZ3NTZXJ2aWNlXCI7XG5cbmZ1bmN0aW9uIGlzRW50ZXIoZTogS2V5Ym9hcmRFdmVudCkge1xuICByZXR1cm4gKFxuICAgIChlLmtleUNvZGUgPT09IDEzIHx8IGUuY29kZSA9PT0gXCJFbnRlclwiKSAmJlxuICAgIGUuc2hpZnRLZXkgPT09IGZhbHNlICYmXG4gICAgZS5tZXRhS2V5ID09PSBmYWxzZSAmJlxuICAgIGUuYWx0S2V5ID09PSBmYWxzZSAmJlxuICAgIGUuY3RybEtleSA9PT0gZmFsc2VcbiAgKTtcbn1cblxuZXhwb3J0IGNsYXNzIEVudGVyT3V0ZGVudElmTGluZUlzRW1wdHlGZWF0dXJlIGltcGxlbWVudHMgSUZlYXR1cmUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBzZXR0aW5nc1NlcnZpY2U6IFNldHRpbmdzU2VydmljZSxcbiAgICBwcml2YXRlIGxpc3RzU2VydmljZTogTGlzdHNTZXJ2aWNlXG4gICkge31cblxuICBhc3luYyBsb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLnJlZ2lzdGVyQ29kZU1pcnJvcigoY20pID0+IHtcbiAgICAgIGNtLm9uKFwia2V5ZG93blwiLCB0aGlzLm9uS2V5RG93bik7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyB1bmxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4uYXBwLndvcmtzcGFjZS5pdGVyYXRlQ29kZU1pcnJvcnMoKGNtKSA9PiB7XG4gICAgICBjbS5vZmYoXCJrZXlkb3duXCIsIHRoaXMub25LZXlEb3duKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgb25LZXlEb3duID0gKGNtOiBDb2RlTWlycm9yLkVkaXRvciwgZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgIGlmICghdGhpcy5zZXR0aW5nc1NlcnZpY2UuYmV0dGVyRW50ZXIgfHwgIWlzRW50ZXIoZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7IHNob3VsZFN0b3BQcm9wYWdhdGlvbiB9ID0gdGhpcy5saXN0c1NlcnZpY2UucGVyZm9ybU9wZXJhdGlvbihcbiAgICAgIChyb290KSA9PiBuZXcgT3V0ZGVudElmTGluZUlzRW1wdHlPcGVyYXRpb24ocm9vdCksXG4gICAgICBjbVxuICAgICk7XG5cbiAgICBpZiAoc2hvdWxkU3RvcFByb3BhZ2F0aW9uKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cbiAgfTtcbn1cbiIsImltcG9ydCB7IExpc3QsIFJvb3QgfSBmcm9tIFwiLi4vcm9vdFwiO1xuaW1wb3J0IHsgSU9wZXJhdGlvbiB9IGZyb20gXCIuL0lPcGVyYXRpb25cIjtcblxuZXhwb3J0IGNsYXNzIENyZWF0ZU5ld0l0ZW1PcGVyYXRpb24gaW1wbGVtZW50cyBJT3BlcmF0aW9uIHtcbiAgcHJpdmF0ZSBzdG9wUHJvcGFnYXRpb24gPSBmYWxzZTtcbiAgcHJpdmF0ZSB1cGRhdGVkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByb290OiBSb290KSB7fVxuXG4gIHNob3VsZFN0b3BQcm9wYWdhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5zdG9wUHJvcGFnYXRpb247XG4gIH1cblxuICBzaG91bGRVcGRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMudXBkYXRlZDtcbiAgfVxuXG4gIHBlcmZvcm0oKSB7XG4gICAgY29uc3QgeyByb290IH0gPSB0aGlzO1xuXG4gICAgaWYgKCFyb290Lmhhc1NpbmdsZUN1cnNvcigpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbGlzdCA9IHJvb3QuZ2V0TGlzdFVuZGVyQ3Vyc29yKCk7XG4gICAgY29uc3QgbGluZXMgPSBsaXN0LmdldExpbmVzSW5mbygpO1xuXG4gICAgaWYgKGxpbmVzLmxlbmd0aCA9PT0gMSAmJiBsaW5lc1swXS50ZXh0ID09PSBcIlwiKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zdG9wUHJvcGFnYXRpb24gPSB0cnVlO1xuICAgIHRoaXMudXBkYXRlZCA9IHRydWU7XG5cbiAgICBjb25zdCBjdXJzb3IgPSByb290LmdldEN1cnNvcigpO1xuXG4gICAgY29uc3QgZW5kUG9zID0gbGlzdC5nZXRMYXN0TGluZUNvbnRlbnRFbmQoKTtcbiAgICBjb25zdCBvbkNoaWxkTGV2ZWwgPVxuICAgICAgIWxpc3QuaXNFbXB0eSgpICYmIGN1cnNvci5saW5lID09PSBlbmRQb3MubGluZSAmJiBjdXJzb3IuY2ggPT09IGVuZFBvcy5jaDtcblxuICAgIGNvbnN0IGluZGVudCA9IG9uQ2hpbGRMZXZlbFxuICAgICAgPyBsaXN0LmdldENoaWxkcmVuKClbMF0uZ2V0Rmlyc3RMaW5lSW5kZW50KClcbiAgICAgIDogbGlzdC5nZXRGaXJzdExpbmVJbmRlbnQoKTtcblxuICAgIGNvbnN0IGJ1bGxldCA9IG9uQ2hpbGRMZXZlbFxuICAgICAgPyBsaXN0LmdldENoaWxkcmVuKClbMF0uZ2V0QnVsbGV0KClcbiAgICAgIDogbGlzdC5nZXRCdWxsZXQoKTtcblxuICAgIGNvbnN0IHsgb2xkTGluZXMsIG5ld0xpbmVzIH0gPSBsaW5lcy5yZWR1Y2UoXG4gICAgICAoYWNjLCBsaW5lKSA9PiB7XG4gICAgICAgIGlmIChjdXJzb3IubGluZSA+IGxpbmUuZnJvbS5saW5lKSB7XG4gICAgICAgICAgYWNjLm9sZExpbmVzLnB1c2gobGluZS50ZXh0KTtcbiAgICAgICAgfSBlbHNlIGlmIChjdXJzb3IubGluZSA9PT0gbGluZS5mcm9tLmxpbmUpIHtcbiAgICAgICAgICBjb25zdCBhID0gbGluZS50ZXh0LnNsaWNlKDAsIGN1cnNvci5jaCAtIGxpbmUuZnJvbS5jaCk7XG4gICAgICAgICAgY29uc3QgYiA9IGxpbmUudGV4dC5zbGljZShjdXJzb3IuY2ggLSBsaW5lLmZyb20uY2gpO1xuICAgICAgICAgIGFjYy5vbGRMaW5lcy5wdXNoKGEpO1xuICAgICAgICAgIGFjYy5uZXdMaW5lcy5wdXNoKGIpO1xuICAgICAgICB9IGVsc2UgaWYgKGN1cnNvci5saW5lIDwgbGluZS5mcm9tLmxpbmUpIHtcbiAgICAgICAgICBhY2MubmV3TGluZXMucHVzaChsaW5lLnRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG9sZExpbmVzOiBbXSxcbiAgICAgICAgbmV3TGluZXM6IFtdLFxuICAgICAgfVxuICAgICk7XG5cbiAgICBjb25zdCBuZXdMaXN0ID0gbmV3IExpc3QoXG4gICAgICBsaXN0LmdldFJvb3QoKSxcbiAgICAgIGluZGVudCxcbiAgICAgIGJ1bGxldCxcbiAgICAgIG5ld0xpbmVzLnNoaWZ0KCksXG4gICAgICBmYWxzZVxuICAgICk7XG5cbiAgICBpZiAobmV3TGluZXMubGVuZ3RoID4gMCkge1xuICAgICAgbmV3TGlzdC5zZXROb3Rlc0luZGVudChsaXN0LmdldE5vdGVzSW5kZW50KCkpO1xuICAgICAgZm9yIChjb25zdCBsaW5lIG9mIG5ld0xpbmVzKSB7XG4gICAgICAgIG5ld0xpc3QuYWRkTGluZShsaW5lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob25DaGlsZExldmVsKSB7XG4gICAgICBsaXN0LmFkZEJlZm9yZUFsbChuZXdMaXN0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY2hpbGRyZW4gPSBsaXN0LmdldENoaWxkcmVuKCk7XG4gICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XG4gICAgICAgIGxpc3QucmVtb3ZlQ2hpbGQoY2hpbGQpO1xuICAgICAgICBuZXdMaXN0LmFkZEFmdGVyQWxsKGNoaWxkKTtcbiAgICAgIH1cblxuICAgICAgbGlzdC5nZXRQYXJlbnQoKS5hZGRBZnRlcihsaXN0LCBuZXdMaXN0KTtcbiAgICB9XG5cbiAgICBsaXN0LnJlcGxhY2VMaW5lcyhvbGRMaW5lcyk7XG5cbiAgICByb290LnJlcGxhY2VDdXJzb3IobmV3TGlzdC5nZXRGaXJzdExpbmVDb250ZW50U3RhcnQoKSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFBsdWdpbl8yIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBDcmVhdGVOZXdJdGVtT3BlcmF0aW9uIH0gZnJvbSBcIi4uL29wZXJhdGlvbnMvQ3JlYXRlTmV3SXRlbU9wZXJhdGlvblwiO1xuaW1wb3J0IHsgSUZlYXR1cmUgfSBmcm9tIFwiLi9JRmVhdHVyZVwiO1xuaW1wb3J0IHsgTGlzdHNTZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL0xpc3RzU2VydmljZVwiO1xuaW1wb3J0IHsgU2V0dGluZ3NTZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL1NldHRpbmdzU2VydmljZVwiO1xuXG5mdW5jdGlvbiBpc0VudGVyKGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgcmV0dXJuIChcbiAgICAoZS5rZXlDb2RlID09PSAxMyB8fCBlLmNvZGUgPT09IFwiRW50ZXJcIikgJiZcbiAgICBlLnNoaWZ0S2V5ID09PSBmYWxzZSAmJlxuICAgIGUubWV0YUtleSA9PT0gZmFsc2UgJiZcbiAgICBlLmFsdEtleSA9PT0gZmFsc2UgJiZcbiAgICBlLmN0cmxLZXkgPT09IGZhbHNlXG4gICk7XG59XG5cbmV4cG9ydCBjbGFzcyBFbnRlclNob3VsZENyZWF0ZU5ld0l0ZW1GZWF0dXJlIGltcGxlbWVudHMgSUZlYXR1cmUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBzZXR0aW5nc1NlcnZpY2U6IFNldHRpbmdzU2VydmljZSxcbiAgICBwcml2YXRlIGxpc3RzU2VydmljZTogTGlzdHNTZXJ2aWNlXG4gICkge31cblxuICBhc3luYyBsb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLnJlZ2lzdGVyQ29kZU1pcnJvcigoY20pID0+IHtcbiAgICAgIGNtLm9uKFwia2V5ZG93blwiLCB0aGlzLm9uS2V5RG93bik7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyB1bmxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4uYXBwLndvcmtzcGFjZS5pdGVyYXRlQ29kZU1pcnJvcnMoKGNtKSA9PiB7XG4gICAgICBjbS5vZmYoXCJrZXlkb3duXCIsIHRoaXMub25LZXlEb3duKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgb25LZXlEb3duID0gKGNtOiBDb2RlTWlycm9yLkVkaXRvciwgZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgIGlmICghdGhpcy5zZXR0aW5nc1NlcnZpY2UuYmV0dGVyRW50ZXIgfHwgIWlzRW50ZXIoZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7IHNob3VsZFN0b3BQcm9wYWdhdGlvbiB9ID0gdGhpcy5saXN0c1NlcnZpY2UucGVyZm9ybU9wZXJhdGlvbihcbiAgICAgIChyb290KSA9PiBuZXcgQ3JlYXRlTmV3SXRlbU9wZXJhdGlvbihyb290KSxcbiAgICAgIGNtXG4gICAgKTtcblxuICAgIGlmIChzaG91bGRTdG9wUHJvcGFnYXRpb24pIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICB9O1xufVxuIiwiaW1wb3J0IHsgSUxpc3RMaW5lLCBSb290IH0gZnJvbSBcIi4uL3Jvb3RcIjtcbmltcG9ydCB7IElPcGVyYXRpb24gfSBmcm9tIFwiLi9JT3BlcmF0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBNb3ZlQ3Vyc29yVG9QcmV2aW91c1VuZm9sZGVkTGluZU9wZXJhdGlvbiBpbXBsZW1lbnRzIElPcGVyYXRpb24ge1xuICBwcml2YXRlIHN0b3BQcm9wYWdhdGlvbiA9IGZhbHNlO1xuICBwcml2YXRlIHVwZGF0ZWQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJvb3Q6IFJvb3QpIHt9XG5cbiAgc2hvdWxkU3RvcFByb3BhZ2F0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnN0b3BQcm9wYWdhdGlvbjtcbiAgfVxuXG4gIHNob3VsZFVwZGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy51cGRhdGVkO1xuICB9XG5cbiAgcGVyZm9ybSgpIHtcbiAgICBjb25zdCB7IHJvb3QgfSA9IHRoaXM7XG5cbiAgICBpZiAoIXJvb3QuaGFzU2luZ2xlQ3Vyc29yKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsaXN0ID0gdGhpcy5yb290LmdldExpc3RVbmRlckN1cnNvcigpO1xuICAgIGNvbnN0IGN1cnNvciA9IHRoaXMucm9vdC5nZXRDdXJzb3IoKTtcbiAgICBjb25zdCBsaW5lcyA9IGxpc3QuZ2V0TGluZXNJbmZvKCk7XG4gICAgY29uc3QgbGluZU5vID0gbGluZXMuZmluZEluZGV4KFxuICAgICAgKGwpID0+IGN1cnNvci5jaCA9PT0gbC5mcm9tLmNoICYmIGN1cnNvci5saW5lID09PSBsLmZyb20ubGluZVxuICAgICk7XG5cbiAgICBpZiAobGluZU5vID09PSAwKSB7XG4gICAgICB0aGlzLm1vdmVDdXJzb3JUb1ByZXZpb3VzVW5mb2xkZWRJdGVtKHJvb3QsIGN1cnNvcik7XG4gICAgfSBlbHNlIGlmIChsaW5lTm8gPiAwKSB7XG4gICAgICB0aGlzLm1vdmVDdXJzb3JUb1ByZXZpb3VzTm90ZUxpbmUocm9vdCwgbGluZXMsIGxpbmVObyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBtb3ZlQ3Vyc29yVG9QcmV2aW91c05vdGVMaW5lKFxuICAgIHJvb3Q6IFJvb3QsXG4gICAgbGluZXM6IElMaXN0TGluZVtdLFxuICAgIGxpbmVObzogbnVtYmVyXG4gICkge1xuICAgIHRoaXMuc3RvcFByb3BhZ2F0aW9uID0gdHJ1ZTtcbiAgICB0aGlzLnVwZGF0ZWQgPSB0cnVlO1xuXG4gICAgcm9vdC5yZXBsYWNlQ3Vyc29yKGxpbmVzW2xpbmVObyAtIDFdLnRvKTtcbiAgfVxuXG4gIHByaXZhdGUgbW92ZUN1cnNvclRvUHJldmlvdXNVbmZvbGRlZEl0ZW0ocm9vdDogUm9vdCwgY3Vyc29yOiBJUG9zaXRpb24pIHtcbiAgICBjb25zdCBwcmV2ID0gcm9vdC5nZXRMaXN0VW5kZXJMaW5lKGN1cnNvci5saW5lIC0gMSk7XG5cbiAgICBpZiAoIXByZXYpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnN0b3BQcm9wYWdhdGlvbiA9IHRydWU7XG4gICAgdGhpcy51cGRhdGVkID0gdHJ1ZTtcblxuICAgIGlmIChwcmV2LmlzRm9sZGVkKCkpIHtcbiAgICAgIGxldCBmb2xkUm9vdCA9IHByZXY7XG4gICAgICB3aGlsZSAoIWZvbGRSb290LmlzRm9sZFJvb3QoKSkge1xuICAgICAgICBmb2xkUm9vdCA9IGZvbGRSb290LmdldFBhcmVudCgpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmaXJzdExpbmVFbmQgPSBmb2xkUm9vdC5nZXRMaW5lc0luZm8oKVswXS50bztcbiAgICAgIHJvb3QucmVwbGFjZUN1cnNvcihmaXJzdExpbmVFbmQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByb290LnJlcGxhY2VDdXJzb3IocHJldi5nZXRMYXN0TGluZUNvbnRlbnRFbmQoKSk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBQbGF0Zm9ybSwgUGx1Z2luXzIgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IElGZWF0dXJlIH0gZnJvbSBcIi4vSUZlYXR1cmVcIjtcbmltcG9ydCB7IExpc3RzU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9MaXN0c1NlcnZpY2VcIjtcbmltcG9ydCB7IE1vdmVDdXJzb3JUb1ByZXZpb3VzVW5mb2xkZWRMaW5lT3BlcmF0aW9uIH0gZnJvbSBcIi4uL29wZXJhdGlvbnMvTW92ZUN1cnNvclRvUHJldmlvdXNVbmZvbGRlZExpbmVPcGVyYXRpb25cIjtcbmltcG9ydCB7IFNldHRpbmdzU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9TZXR0aW5nc1NlcnZpY2VcIjtcblxuZnVuY3Rpb24gaXNBcnJvd0xlZnQoZTogS2V5Ym9hcmRFdmVudCkge1xuICByZXR1cm4gKFxuICAgIChlLmtleUNvZGUgPT09IDM3IHx8IGUuY29kZSA9PT0gXCJBcnJvd0xlZnRcIikgJiZcbiAgICBlLnNoaWZ0S2V5ID09PSBmYWxzZSAmJlxuICAgIGUubWV0YUtleSA9PT0gZmFsc2UgJiZcbiAgICBlLmFsdEtleSA9PT0gZmFsc2UgJiZcbiAgICBlLmN0cmxLZXkgPT09IGZhbHNlXG4gICk7XG59XG5cbmZ1bmN0aW9uIGlzQ3RybEFycm93TGVmdChlOiBLZXlib2FyZEV2ZW50KSB7XG4gIHJldHVybiAoXG4gICAgKGUua2V5Q29kZSA9PT0gMzcgfHwgZS5jb2RlID09PSBcIkFycm93TGVmdFwiKSAmJlxuICAgIGUuc2hpZnRLZXkgPT09IGZhbHNlICYmXG4gICAgZS5tZXRhS2V5ID09PSBmYWxzZSAmJlxuICAgIGUuYWx0S2V5ID09PSBmYWxzZSAmJlxuICAgIGUuY3RybEtleSA9PT0gdHJ1ZVxuICApO1xufVxuXG5leHBvcnQgY2xhc3MgTW92ZUN1cnNvclRvUHJldmlvdXNVbmZvbGRlZExpbmVGZWF0dXJlIGltcGxlbWVudHMgSUZlYXR1cmUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBzZXR0aW5nc1NlcnZpY2U6IFNldHRpbmdzU2VydmljZSxcbiAgICBwcml2YXRlIGxpc3RzU2VydmljZTogTGlzdHNTZXJ2aWNlXG4gICkge31cblxuICBhc3luYyBsb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLnJlZ2lzdGVyQ29kZU1pcnJvcigoY20pID0+IHtcbiAgICAgIGNtLm9uKFwia2V5ZG93blwiLCB0aGlzLm9uS2V5RG93bik7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyB1bmxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4uYXBwLndvcmtzcGFjZS5pdGVyYXRlQ29kZU1pcnJvcnMoKGNtKSA9PiB7XG4gICAgICBjbS5vZmYoXCJrZXlkb3duXCIsIHRoaXMub25LZXlEb3duKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgb25LZXlEb3duID0gKGNtOiBDb2RlTWlycm9yLkVkaXRvciwgZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICBpZiAoIXRoaXMuc2V0dGluZ3NTZXJ2aWNlLnN0aWNrQ3Vyc29yKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGlzQXJyb3dMZWZ0KGV2ZW50KSB8fCAoIVBsYXRmb3JtLmlzTWFjT1MgJiYgaXNDdHJsQXJyb3dMZWZ0KGV2ZW50KSkpIHtcbiAgICAgIGNvbnN0IHsgc2hvdWxkU3RvcFByb3BhZ2F0aW9uIH0gPSB0aGlzLmxpc3RzU2VydmljZS5wZXJmb3JtT3BlcmF0aW9uKFxuICAgICAgICAocm9vdCkgPT4gbmV3IE1vdmVDdXJzb3JUb1ByZXZpb3VzVW5mb2xkZWRMaW5lT3BlcmF0aW9uKHJvb3QpLFxuICAgICAgICBjbVxuICAgICAgKTtcblxuICAgICAgaWYgKHNob3VsZFN0b3BQcm9wYWdhdGlvbikge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG4iLCJpbXBvcnQgeyBSb290IH0gZnJvbSBcIi4uL3Jvb3RcIjtcbmltcG9ydCB7IElPcGVyYXRpb24gfSBmcm9tIFwiLi9JT3BlcmF0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBFbnN1cmVDdXJzb3JJbkxpc3RDb250ZW50T3BlcmF0aW9uIGltcGxlbWVudHMgSU9wZXJhdGlvbiB7XG4gIHByaXZhdGUgc3RvcFByb3BhZ2F0aW9uID0gZmFsc2U7XG4gIHByaXZhdGUgdXBkYXRlZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcm9vdDogUm9vdCkge31cblxuICBzaG91bGRTdG9wUHJvcGFnYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcFByb3BhZ2F0aW9uO1xuICB9XG5cbiAgc2hvdWxkVXBkYXRlKCkge1xuICAgIHJldHVybiB0aGlzLnVwZGF0ZWQ7XG4gIH1cblxuICBwZXJmb3JtKCkge1xuICAgIGNvbnN0IHsgcm9vdCB9ID0gdGhpcztcblxuICAgIGlmICghcm9vdC5oYXNTaW5nbGVDdXJzb3IoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc3RvcFByb3BhZ2F0aW9uID0gdHJ1ZTtcblxuICAgIGNvbnN0IGN1cnNvciA9IHJvb3QuZ2V0Q3Vyc29yKCk7XG4gICAgY29uc3QgbGlzdCA9IHJvb3QuZ2V0TGlzdFVuZGVyQ3Vyc29yKCk7XG4gICAgY29uc3QgY29udGVudFN0YXJ0ID0gbGlzdC5nZXRGaXJzdExpbmVDb250ZW50U3RhcnQoKTtcbiAgICBjb25zdCBsaW5lUHJlZml4ID1cbiAgICAgIGNvbnRlbnRTdGFydC5saW5lID09PSBjdXJzb3IubGluZVxuICAgICAgICA/IGNvbnRlbnRTdGFydC5jaFxuICAgICAgICA6IGxpc3QuZ2V0Tm90ZXNJbmRlbnQoKS5sZW5ndGg7XG5cbiAgICBpZiAoY3Vyc29yLmNoIDwgbGluZVByZWZpeCkge1xuICAgICAgdGhpcy51cGRhdGVkID0gdHJ1ZTtcbiAgICAgIHJvb3QucmVwbGFjZUN1cnNvcih7XG4gICAgICAgIGxpbmU6IGN1cnNvci5saW5lLFxuICAgICAgICBjaDogbGluZVByZWZpeCxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgUm9vdCB9IGZyb20gXCIuLi9yb290XCI7XG5pbXBvcnQgeyBJT3BlcmF0aW9uIH0gZnJvbSBcIi4vSU9wZXJhdGlvblwiO1xuXG5leHBvcnQgY2xhc3MgRW5zdXJlQ3Vyc29ySXNJblVuZm9sZGVkTGluZU9wZXJhdGlvbiBpbXBsZW1lbnRzIElPcGVyYXRpb24ge1xuICBwcml2YXRlIHN0b3BQcm9wYWdhdGlvbiA9IGZhbHNlO1xuICBwcml2YXRlIHVwZGF0ZWQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJvb3Q6IFJvb3QpIHt9XG5cbiAgc2hvdWxkU3RvcFByb3BhZ2F0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnN0b3BQcm9wYWdhdGlvbjtcbiAgfVxuXG4gIHNob3VsZFVwZGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy51cGRhdGVkO1xuICB9XG5cbiAgcGVyZm9ybSgpIHtcbiAgICBjb25zdCB7IHJvb3QgfSA9IHRoaXM7XG5cbiAgICBpZiAoIXJvb3QuaGFzU2luZ2xlQ3Vyc29yKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnN0b3BQcm9wYWdhdGlvbiA9IHRydWU7XG5cbiAgICBjb25zdCBjdXJzb3IgPSByb290LmdldEN1cnNvcigpO1xuXG4gICAgY29uc3QgbGlzdCA9IHJvb3QuZ2V0TGlzdFVuZGVyQ3Vyc29yKCk7XG4gICAgaWYgKCFsaXN0LmlzRm9sZGVkKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgZm9sZFJvb3QgPSBsaXN0O1xuICAgIHdoaWxlICghZm9sZFJvb3QuaXNGb2xkUm9vdCgpKSB7XG4gICAgICBmb2xkUm9vdCA9IGZvbGRSb290LmdldFBhcmVudCgpO1xuICAgIH1cblxuICAgIGNvbnN0IGZpcnN0TGluZUVuZCA9IGZvbGRSb290LmdldExpbmVzSW5mbygpWzBdLnRvO1xuXG4gICAgaWYgKGN1cnNvci5saW5lID4gZmlyc3RMaW5lRW5kLmxpbmUpIHtcbiAgICAgIHRoaXMudXBkYXRlZCA9IHRydWU7XG4gICAgICByb290LnJlcGxhY2VDdXJzb3IoZmlyc3RMaW5lRW5kKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IFBsdWdpbl8yIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBJRmVhdHVyZSB9IGZyb20gXCIuL0lGZWF0dXJlXCI7XG5pbXBvcnQgeyBMaXN0c1NlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvTGlzdHNTZXJ2aWNlXCI7XG5pbXBvcnQgeyBFbnN1cmVDdXJzb3JJbkxpc3RDb250ZW50T3BlcmF0aW9uIH0gZnJvbSBcIi4uL29wZXJhdGlvbnMvRW5zdXJlQ3Vyc29ySW5MaXN0Q29udGVudE9wZXJhdGlvblwiO1xuaW1wb3J0IHsgRW5zdXJlQ3Vyc29ySXNJblVuZm9sZGVkTGluZU9wZXJhdGlvbiB9IGZyb20gXCIuLi9vcGVyYXRpb25zL0Vuc3VyZUN1cnNvcklzSW5VbmZvbGRlZExpbmVPcGVyYXRpb25cIjtcbmltcG9ydCB7IFNldHRpbmdzU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9TZXR0aW5nc1NlcnZpY2VcIjtcblxuZXhwb3J0IGNsYXNzIEVuc3VyZUN1cnNvckluTGlzdENvbnRlbnRGZWF0dXJlIGltcGxlbWVudHMgSUZlYXR1cmUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBzZXR0aW5nc1NlcnZpY2U6IFNldHRpbmdzU2VydmljZSxcbiAgICBwcml2YXRlIGxpc3RzU2VydmljZTogTGlzdHNTZXJ2aWNlXG4gICkge31cblxuICBhc3luYyBsb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLnJlZ2lzdGVyQ29kZU1pcnJvcigoY20pID0+IHtcbiAgICAgIGNtLm9uKFwiY3Vyc29yQWN0aXZpdHlcIiwgdGhpcy5oYW5kbGVDdXJzb3JBY3Rpdml0eSk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyB1bmxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4uYXBwLndvcmtzcGFjZS5pdGVyYXRlQ29kZU1pcnJvcnMoKGNtKSA9PiB7XG4gICAgICBjbS5vZmYoXCJjdXJzb3JBY3Rpdml0eVwiLCB0aGlzLmhhbmRsZUN1cnNvckFjdGl2aXR5KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlQ3Vyc29yQWN0aXZpdHkgPSAoY206IENvZGVNaXJyb3IuRWRpdG9yKSA9PiB7XG4gICAgaWYgKCF0aGlzLnNldHRpbmdzU2VydmljZS5zdGlja0N1cnNvcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubGlzdHNTZXJ2aWNlLnBlcmZvcm1PcGVyYXRpb24oXG4gICAgICAocm9vdCkgPT4gbmV3IEVuc3VyZUN1cnNvcklzSW5VbmZvbGRlZExpbmVPcGVyYXRpb24ocm9vdCksXG4gICAgICBjbVxuICAgICk7XG5cbiAgICB0aGlzLmxpc3RzU2VydmljZS5wZXJmb3JtT3BlcmF0aW9uKFxuICAgICAgKHJvb3QpID0+IG5ldyBFbnN1cmVDdXJzb3JJbkxpc3RDb250ZW50T3BlcmF0aW9uKHJvb3QpLFxuICAgICAgY21cbiAgICApO1xuICB9O1xufVxuIiwiaW1wb3J0IHsgSUxpc3RMaW5lLCBMaXN0LCBSb290IH0gZnJvbSBcIi4uL3Jvb3RcIjtcbmltcG9ydCB7IElPcGVyYXRpb24gfSBmcm9tIFwiLi9JT3BlcmF0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBEZWxldGVBbmRNZXJnZVdpdGhQcmV2aW91c0xpbmVPcGVyYXRpb24gaW1wbGVtZW50cyBJT3BlcmF0aW9uIHtcbiAgcHJpdmF0ZSBzdG9wUHJvcGFnYXRpb24gPSBmYWxzZTtcbiAgcHJpdmF0ZSB1cGRhdGVkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByb290OiBSb290KSB7fVxuXG4gIHNob3VsZFN0b3BQcm9wYWdhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5zdG9wUHJvcGFnYXRpb247XG4gIH1cblxuICBzaG91bGRVcGRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMudXBkYXRlZDtcbiAgfVxuXG4gIHBlcmZvcm0oKSB7XG4gICAgY29uc3QgeyByb290IH0gPSB0aGlzO1xuXG4gICAgaWYgKCFyb290Lmhhc1NpbmdsZUN1cnNvcigpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbGlzdCA9IHJvb3QuZ2V0TGlzdFVuZGVyQ3Vyc29yKCk7XG4gICAgY29uc3QgY3Vyc29yID0gcm9vdC5nZXRDdXJzb3IoKTtcbiAgICBjb25zdCBsaW5lcyA9IGxpc3QuZ2V0TGluZXNJbmZvKCk7XG5cbiAgICBjb25zdCBsaW5lTm8gPSBsaW5lcy5maW5kSW5kZXgoXG4gICAgICAobCkgPT4gY3Vyc29yLmNoID09PSBsLmZyb20uY2ggJiYgY3Vyc29yLmxpbmUgPT09IGwuZnJvbS5saW5lXG4gICAgKTtcblxuICAgIGlmIChsaW5lTm8gPT09IDApIHtcbiAgICAgIHRoaXMubWVyZ2VXaXRoUHJldmlvdXNJdGVtKHJvb3QsIGN1cnNvciwgbGlzdCk7XG4gICAgfSBlbHNlIGlmIChsaW5lTm8gPiAwKSB7XG4gICAgICB0aGlzLm1lcmdlTm90ZXMocm9vdCwgY3Vyc29yLCBsaXN0LCBsaW5lcywgbGluZU5vKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG1lcmdlTm90ZXMoXG4gICAgcm9vdDogUm9vdCxcbiAgICBjdXJzb3I6IElQb3NpdGlvbixcbiAgICBsaXN0OiBMaXN0LFxuICAgIGxpbmVzOiBJTGlzdExpbmVbXSxcbiAgICBsaW5lTm86IG51bWJlclxuICApIHtcbiAgICB0aGlzLnN0b3BQcm9wYWdhdGlvbiA9IHRydWU7XG4gICAgdGhpcy51cGRhdGVkID0gdHJ1ZTtcblxuICAgIGNvbnN0IHByZXZMaW5lTm8gPSBsaW5lTm8gLSAxO1xuXG4gICAgcm9vdC5yZXBsYWNlQ3Vyc29yKHtcbiAgICAgIGxpbmU6IGN1cnNvci5saW5lIC0gMSxcbiAgICAgIGNoOiBsaW5lc1twcmV2TGluZU5vXS50ZXh0Lmxlbmd0aCArIGxpbmVzW3ByZXZMaW5lTm9dLmZyb20uY2gsXG4gICAgfSk7XG5cbiAgICBsaW5lc1twcmV2TGluZU5vXS50ZXh0ICs9IGxpbmVzW2xpbmVOb10udGV4dDtcbiAgICBsaW5lcy5zcGxpY2UobGluZU5vLCAxKTtcblxuICAgIGxpc3QucmVwbGFjZUxpbmVzKGxpbmVzLm1hcCgobCkgPT4gbC50ZXh0KSk7XG4gIH1cblxuICBwcml2YXRlIG1lcmdlV2l0aFByZXZpb3VzSXRlbShyb290OiBSb290LCBjdXJzb3I6IElQb3NpdGlvbiwgbGlzdDogTGlzdCkge1xuICAgIGlmIChyb290LmdldENoaWxkcmVuKClbMF0gPT09IGxpc3QgJiYgbGlzdC5nZXRDaGlsZHJlbigpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc3RvcFByb3BhZ2F0aW9uID0gdHJ1ZTtcblxuICAgIGNvbnN0IHByZXYgPSByb290LmdldExpc3RVbmRlckxpbmUoY3Vyc29yLmxpbmUgLSAxKTtcblxuICAgIGlmICghcHJldikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGJvdGhBcmVFbXB0eSA9IHByZXYuaXNFbXB0eSgpICYmIGxpc3QuaXNFbXB0eSgpO1xuICAgIGNvbnN0IHByZXZJc0VtcHR5QW5kU2FtZUxldmVsID1cbiAgICAgIHByZXYuaXNFbXB0eSgpICYmICFsaXN0LmlzRW1wdHkoKSAmJiBwcmV2LmdldExldmVsKCkgPT0gbGlzdC5nZXRMZXZlbCgpO1xuICAgIGNvbnN0IGxpc3RJc0VtcHR5QW5kUHJldklzUGFyZW50ID1cbiAgICAgIGxpc3QuaXNFbXB0eSgpICYmIHByZXYuZ2V0TGV2ZWwoKSA9PSBsaXN0LmdldExldmVsKCkgLSAxO1xuXG4gICAgaWYgKGJvdGhBcmVFbXB0eSB8fCBwcmV2SXNFbXB0eUFuZFNhbWVMZXZlbCB8fCBsaXN0SXNFbXB0eUFuZFByZXZJc1BhcmVudCkge1xuICAgICAgdGhpcy51cGRhdGVkID0gdHJ1ZTtcblxuICAgICAgY29uc3QgcGFyZW50ID0gbGlzdC5nZXRQYXJlbnQoKTtcbiAgICAgIGNvbnN0IHByZXZFbmQgPSBwcmV2LmdldExhc3RMaW5lQ29udGVudEVuZCgpO1xuXG4gICAgICBpZiAoIXByZXYuZ2V0Tm90ZXNJbmRlbnQoKSAmJiBsaXN0LmdldE5vdGVzSW5kZW50KCkpIHtcbiAgICAgICAgcHJldi5zZXROb3Rlc0luZGVudChcbiAgICAgICAgICBwcmV2LmdldEZpcnN0TGluZUluZGVudCgpICtcbiAgICAgICAgICAgIGxpc3QuZ2V0Tm90ZXNJbmRlbnQoKS5zbGljZShsaXN0LmdldEZpcnN0TGluZUluZGVudCgpLmxlbmd0aClcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgb2xkTGluZXMgPSBwcmV2LmdldExpbmVzKCk7XG4gICAgICBjb25zdCBuZXdMaW5lcyA9IGxpc3QuZ2V0TGluZXMoKTtcbiAgICAgIG9sZExpbmVzW29sZExpbmVzLmxlbmd0aCAtIDFdICs9IG5ld0xpbmVzWzBdO1xuICAgICAgY29uc3QgcmVzdWx0TGluZXMgPSBvbGRMaW5lcy5jb25jYXQobmV3TGluZXMuc2xpY2UoMSkpO1xuXG4gICAgICBwcmV2LnJlcGxhY2VMaW5lcyhyZXN1bHRMaW5lcyk7XG4gICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQobGlzdCk7XG5cbiAgICAgIGZvciAoY29uc3QgYyBvZiBsaXN0LmdldENoaWxkcmVuKCkpIHtcbiAgICAgICAgbGlzdC5yZW1vdmVDaGlsZChjKTtcbiAgICAgICAgcHJldi5hZGRBZnRlckFsbChjKTtcbiAgICAgIH1cblxuICAgICAgcm9vdC5yZXBsYWNlQ3Vyc29yKHByZXZFbmQpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgUm9vdCB9IGZyb20gXCIuLi9yb290XCI7XG5pbXBvcnQgeyBEZWxldGVBbmRNZXJnZVdpdGhQcmV2aW91c0xpbmVPcGVyYXRpb24gfSBmcm9tIFwiLi9EZWxldGVBbmRNZXJnZVdpdGhQcmV2aW91c0xpbmVPcGVyYXRpb25cIjtcbmltcG9ydCB7IElPcGVyYXRpb24gfSBmcm9tIFwiLi9JT3BlcmF0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBEZWxldGVBbmRNZXJnZVdpdGhOZXh0TGluZU9wZXJhdGlvbiBpbXBsZW1lbnRzIElPcGVyYXRpb24ge1xuICBwcml2YXRlIGRlbGV0ZUFuZE1lcmdlV2l0aFByZXZpb3VzOiBEZWxldGVBbmRNZXJnZVdpdGhQcmV2aW91c0xpbmVPcGVyYXRpb247XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByb290OiBSb290KSB7XG4gICAgdGhpcy5kZWxldGVBbmRNZXJnZVdpdGhQcmV2aW91cyA9XG4gICAgICBuZXcgRGVsZXRlQW5kTWVyZ2VXaXRoUHJldmlvdXNMaW5lT3BlcmF0aW9uKHJvb3QpO1xuICB9XG5cbiAgc2hvdWxkU3RvcFByb3BhZ2F0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmRlbGV0ZUFuZE1lcmdlV2l0aFByZXZpb3VzLnNob3VsZFN0b3BQcm9wYWdhdGlvbigpO1xuICB9XG5cbiAgc2hvdWxkVXBkYXRlKCkge1xuICAgIHJldHVybiB0aGlzLmRlbGV0ZUFuZE1lcmdlV2l0aFByZXZpb3VzLnNob3VsZFVwZGF0ZSgpO1xuICB9XG5cbiAgcGVyZm9ybSgpIHtcbiAgICBjb25zdCB7IHJvb3QgfSA9IHRoaXM7XG5cbiAgICBpZiAoIXJvb3QuaGFzU2luZ2xlQ3Vyc29yKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsaXN0ID0gcm9vdC5nZXRMaXN0VW5kZXJDdXJzb3IoKTtcbiAgICBjb25zdCBjdXJzb3IgPSByb290LmdldEN1cnNvcigpO1xuICAgIGNvbnN0IGxpbmVzID0gbGlzdC5nZXRMaW5lc0luZm8oKTtcblxuICAgIGNvbnN0IGxpbmVObyA9IGxpbmVzLmZpbmRJbmRleChcbiAgICAgIChsKSA9PiBjdXJzb3IuY2ggPT09IGwudG8uY2ggJiYgY3Vyc29yLmxpbmUgPT09IGwudG8ubGluZVxuICAgICk7XG5cbiAgICBpZiAobGluZU5vID09PSBsaW5lcy5sZW5ndGggLSAxKSB7XG4gICAgICBjb25zdCBuZXh0TGluZSA9IGxpbmVzW2xpbmVOb10udG8ubGluZSArIDE7XG4gICAgICBjb25zdCBuZXh0TGlzdCA9IHJvb3QuZ2V0TGlzdFVuZGVyTGluZShuZXh0TGluZSk7XG4gICAgICByb290LnJlcGxhY2VDdXJzb3IobmV4dExpc3QuZ2V0Rmlyc3RMaW5lQ29udGVudFN0YXJ0KCkpO1xuICAgICAgdGhpcy5kZWxldGVBbmRNZXJnZVdpdGhQcmV2aW91cy5wZXJmb3JtKCk7XG4gICAgfSBlbHNlIGlmIChsaW5lTm8gPj0gMCkge1xuICAgICAgcm9vdC5yZXBsYWNlQ3Vyc29yKGxpbmVzW2xpbmVObyArIDFdLmZyb20pO1xuICAgICAgdGhpcy5kZWxldGVBbmRNZXJnZVdpdGhQcmV2aW91cy5wZXJmb3JtKCk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBSb290IH0gZnJvbSBcIi4uL3Jvb3RcIjtcbmltcG9ydCB7IElPcGVyYXRpb24gfSBmcm9tIFwiLi9JT3BlcmF0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBEZWxldGVUaWxsTGluZVN0YXJ0T3BlcmF0aW9uIGltcGxlbWVudHMgSU9wZXJhdGlvbiB7XG4gIHByaXZhdGUgc3RvcFByb3BhZ2F0aW9uID0gZmFsc2U7XG4gIHByaXZhdGUgdXBkYXRlZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcm9vdDogUm9vdCkge31cblxuICBzaG91bGRTdG9wUHJvcGFnYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcFByb3BhZ2F0aW9uO1xuICB9XG5cbiAgc2hvdWxkVXBkYXRlKCkge1xuICAgIHJldHVybiB0aGlzLnVwZGF0ZWQ7XG4gIH1cblxuICBwZXJmb3JtKCkge1xuICAgIGNvbnN0IHsgcm9vdCB9ID0gdGhpcztcblxuICAgIGlmICghcm9vdC5oYXNTaW5nbGVDdXJzb3IoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc3RvcFByb3BhZ2F0aW9uID0gdHJ1ZTtcbiAgICB0aGlzLnVwZGF0ZWQgPSB0cnVlO1xuXG4gICAgY29uc3QgY3Vyc29yID0gcm9vdC5nZXRDdXJzb3IoKTtcbiAgICBjb25zdCBsaXN0ID0gcm9vdC5nZXRMaXN0VW5kZXJDdXJzb3IoKTtcbiAgICBjb25zdCBsaW5lcyA9IGxpc3QuZ2V0TGluZXNJbmZvKCk7XG4gICAgY29uc3QgbGluZU5vID0gbGluZXMuZmluZEluZGV4KChsKSA9PiBsLmZyb20ubGluZSA9PT0gY3Vyc29yLmxpbmUpO1xuXG4gICAgbGluZXNbbGluZU5vXS50ZXh0ID0gbGluZXNbbGluZU5vXS50ZXh0LnNsaWNlKFxuICAgICAgY3Vyc29yLmNoIC0gbGluZXNbbGluZU5vXS5mcm9tLmNoXG4gICAgKTtcblxuICAgIGxpc3QucmVwbGFjZUxpbmVzKGxpbmVzLm1hcCgobCkgPT4gbC50ZXh0KSk7XG4gICAgcm9vdC5yZXBsYWNlQ3Vyc29yKGxpbmVzW2xpbmVOb10uZnJvbSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFBsYXRmb3JtLCBQbHVnaW5fMiB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgSUZlYXR1cmUgfSBmcm9tIFwiLi9JRmVhdHVyZVwiO1xuaW1wb3J0IHsgTGlzdHNTZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL0xpc3RzU2VydmljZVwiO1xuaW1wb3J0IHsgRGVsZXRlQW5kTWVyZ2VXaXRoTmV4dExpbmVPcGVyYXRpb24gfSBmcm9tIFwiLi4vb3BlcmF0aW9ucy9EZWxldGVBbmRNZXJnZVdpdGhOZXh0TGluZU9wZXJhdGlvblwiO1xuaW1wb3J0IHsgRGVsZXRlQW5kTWVyZ2VXaXRoUHJldmlvdXNMaW5lT3BlcmF0aW9uIH0gZnJvbSBcIi4uL29wZXJhdGlvbnMvRGVsZXRlQW5kTWVyZ2VXaXRoUHJldmlvdXNMaW5lT3BlcmF0aW9uXCI7XG5pbXBvcnQgeyBEZWxldGVUaWxsTGluZVN0YXJ0T3BlcmF0aW9uIH0gZnJvbSBcIi4uL29wZXJhdGlvbnMvRGVsZXRlVGlsbExpbmVTdGFydE9wZXJhdGlvblwiO1xuaW1wb3J0IHsgU2V0dGluZ3NTZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL1NldHRpbmdzU2VydmljZVwiO1xuXG5mdW5jdGlvbiBpc0JhY2tzcGFjZShlOiBLZXlib2FyZEV2ZW50KSB7XG4gIHJldHVybiAoXG4gICAgKGUua2V5Q29kZSA9PT0gOCB8fCBlLmNvZGUgPT09IFwiQmFja3NwYWNlXCIpICYmXG4gICAgZS5zaGlmdEtleSA9PT0gZmFsc2UgJiZcbiAgICBlLm1ldGFLZXkgPT09IGZhbHNlICYmXG4gICAgZS5hbHRLZXkgPT09IGZhbHNlICYmXG4gICAgZS5jdHJsS2V5ID09PSBmYWxzZVxuICApO1xufVxuXG5mdW5jdGlvbiBpc0NtZEJhY2tzcGFjZShlOiBLZXlib2FyZEV2ZW50KSB7XG4gIHJldHVybiAoXG4gICAgKGUua2V5Q29kZSA9PT0gOCB8fCBlLmNvZGUgPT09IFwiQmFja3NwYWNlXCIpICYmXG4gICAgZS5zaGlmdEtleSA9PT0gZmFsc2UgJiZcbiAgICBlLm1ldGFLZXkgPT09IHRydWUgJiZcbiAgICBlLmFsdEtleSA9PT0gZmFsc2UgJiZcbiAgICBlLmN0cmxLZXkgPT09IGZhbHNlXG4gICk7XG59XG5cbmZ1bmN0aW9uIGlzRGVsZXRlKGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgcmV0dXJuIChcbiAgICAoZS5rZXlDb2RlID09PSA0NiB8fCBlLmNvZGUgPT09IFwiRGVsZXRlXCIpICYmXG4gICAgZS5zaGlmdEtleSA9PT0gZmFsc2UgJiZcbiAgICBlLm1ldGFLZXkgPT09IGZhbHNlICYmXG4gICAgZS5hbHRLZXkgPT09IGZhbHNlICYmXG4gICAgZS5jdHJsS2V5ID09PSBmYWxzZVxuICApO1xufVxuXG5leHBvcnQgY2xhc3MgRGVsZXRlU2hvdWxkSWdub3JlQnVsbGV0c0ZlYXR1cmUgaW1wbGVtZW50cyBJRmVhdHVyZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcGx1Z2luOiBQbHVnaW5fMixcbiAgICBwcml2YXRlIHNldHRpbmdzU2VydmljZTogU2V0dGluZ3NTZXJ2aWNlLFxuICAgIHByaXZhdGUgbGlzdHNTZXJ2aWNlOiBMaXN0c1NlcnZpY2VcbiAgKSB7fVxuXG4gIGFzeW5jIGxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4ucmVnaXN0ZXJDb2RlTWlycm9yKChjbSkgPT4ge1xuICAgICAgY20ub24oXCJrZXlkb3duXCIsIHRoaXMub25LZXlEb3duKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHVubG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5hcHAud29ya3NwYWNlLml0ZXJhdGVDb2RlTWlycm9ycygoY20pID0+IHtcbiAgICAgIGNtLm9mZihcImtleWRvd25cIiwgdGhpcy5vbktleURvd24pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBvbktleURvd24gPSAoY206IENvZGVNaXJyb3IuRWRpdG9yLCBldmVudDogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgIGlmICghdGhpcy5zZXR0aW5nc1NlcnZpY2Uuc3RpY2tDdXJzb3IpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoaXNCYWNrc3BhY2UoZXZlbnQpKSB7XG4gICAgICBjb25zdCB7IHNob3VsZFN0b3BQcm9wYWdhdGlvbiB9ID0gdGhpcy5saXN0c1NlcnZpY2UucGVyZm9ybU9wZXJhdGlvbihcbiAgICAgICAgKHJvb3QpID0+IG5ldyBEZWxldGVBbmRNZXJnZVdpdGhQcmV2aW91c0xpbmVPcGVyYXRpb24ocm9vdCksXG4gICAgICAgIGNtXG4gICAgICApO1xuXG4gICAgICBpZiAoc2hvdWxkU3RvcFByb3BhZ2F0aW9uKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChQbGF0Zm9ybS5pc01hY09TICYmIGlzQ21kQmFja3NwYWNlKGV2ZW50KSkge1xuICAgICAgY29uc3QgeyBzaG91bGRTdG9wUHJvcGFnYXRpb24gfSA9IHRoaXMubGlzdHNTZXJ2aWNlLnBlcmZvcm1PcGVyYXRpb24oXG4gICAgICAgIChyb290KSA9PiBuZXcgRGVsZXRlVGlsbExpbmVTdGFydE9wZXJhdGlvbihyb290KSxcbiAgICAgICAgY21cbiAgICAgICk7XG5cbiAgICAgIGlmIChzaG91bGRTdG9wUHJvcGFnYXRpb24pIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGlzRGVsZXRlKGV2ZW50KSkge1xuICAgICAgY29uc3QgeyBzaG91bGRTdG9wUHJvcGFnYXRpb24gfSA9IHRoaXMubGlzdHNTZXJ2aWNlLnBlcmZvcm1PcGVyYXRpb24oXG4gICAgICAgIChyb290KSA9PiBuZXcgRGVsZXRlQW5kTWVyZ2VXaXRoTmV4dExpbmVPcGVyYXRpb24ocm9vdCksXG4gICAgICAgIGNtXG4gICAgICApO1xuXG4gICAgICBpZiAoc2hvdWxkU3RvcFByb3BhZ2F0aW9uKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cbiIsImltcG9ydCB7IFJvb3QgfSBmcm9tIFwiLi4vcm9vdFwiO1xuaW1wb3J0IHsgSU9wZXJhdGlvbiB9IGZyb20gXCIuL0lPcGVyYXRpb25cIjtcblxuZXhwb3J0IGNsYXNzIFNlbGVjdFRpbGxMaW5lU3RhcnRPcGVyYXRpb24gaW1wbGVtZW50cyBJT3BlcmF0aW9uIHtcbiAgcHJpdmF0ZSBzdG9wUHJvcGFnYXRpb24gPSBmYWxzZTtcbiAgcHJpdmF0ZSB1cGRhdGVkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByb290OiBSb290KSB7fVxuXG4gIHNob3VsZFN0b3BQcm9wYWdhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5zdG9wUHJvcGFnYXRpb247XG4gIH1cblxuICBzaG91bGRVcGRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMudXBkYXRlZDtcbiAgfVxuXG4gIHBlcmZvcm0oKSB7XG4gICAgY29uc3QgeyByb290IH0gPSB0aGlzO1xuXG4gICAgaWYgKCFyb290Lmhhc1NpbmdsZUN1cnNvcigpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zdG9wUHJvcGFnYXRpb24gPSB0cnVlO1xuICAgIHRoaXMudXBkYXRlZCA9IHRydWU7XG5cbiAgICBjb25zdCBjdXJzb3IgPSByb290LmdldEN1cnNvcigpO1xuICAgIGNvbnN0IGxpc3QgPSByb290LmdldExpc3RVbmRlckN1cnNvcigpO1xuICAgIGNvbnN0IGxpbmVzID0gbGlzdC5nZXRMaW5lc0luZm8oKTtcbiAgICBjb25zdCBsaW5lTm8gPSBsaW5lcy5maW5kSW5kZXgoKGwpID0+IGwuZnJvbS5saW5lID09PSBjdXJzb3IubGluZSk7XG5cbiAgICByb290LnJlcGxhY2VTZWxlY3Rpb25zKFt7IGhlYWQ6IGxpbmVzW2xpbmVOb10uZnJvbSwgYW5jaG9yOiBjdXJzb3IgfV0pO1xuICB9XG59XG4iLCJpbXBvcnQgeyBQbGF0Zm9ybSwgUGx1Z2luXzIgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IExpc3RzU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9MaXN0c1NlcnZpY2VcIjtcbmltcG9ydCB7IFNlbGVjdFRpbGxMaW5lU3RhcnRPcGVyYXRpb24gfSBmcm9tIFwiLi4vb3BlcmF0aW9ucy9TZWxlY3RUaWxsTGluZVN0YXJ0T3BlcmF0aW9uXCI7XG5pbXBvcnQgeyBJRmVhdHVyZSB9IGZyb20gXCIuL0lGZWF0dXJlXCI7XG5pbXBvcnQgeyBTZXR0aW5nc1NlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvU2V0dGluZ3NTZXJ2aWNlXCI7XG5cbmZ1bmN0aW9uIGlzQ21kU2hpZnRMZWZ0KGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgcmV0dXJuIChcbiAgICAoZS5rZXlDb2RlID09PSAzNyB8fCBlLmNvZGUgPT09IFwiQXJyb3dMZWZ0XCIpICYmXG4gICAgZS5zaGlmdEtleSA9PT0gdHJ1ZSAmJlxuICAgIGUubWV0YUtleSA9PT0gdHJ1ZSAmJlxuICAgIGUuYWx0S2V5ID09PSBmYWxzZSAmJlxuICAgIGUuY3RybEtleSA9PT0gZmFsc2VcbiAgKTtcbn1cblxuZXhwb3J0IGNsYXNzIFNlbGVjdGlvblNob3VsZElnbm9yZUJ1bGxldHNGZWF0dXJlIGltcGxlbWVudHMgSUZlYXR1cmUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBzZXR0aW5nc1NlcnZpY2U6IFNldHRpbmdzU2VydmljZSxcbiAgICBwcml2YXRlIGxpc3RzU2VydmljZTogTGlzdHNTZXJ2aWNlXG4gICkge31cblxuICBhc3luYyBsb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLnJlZ2lzdGVyQ29kZU1pcnJvcigoY20pID0+IHtcbiAgICAgIGNtLm9uKFwia2V5ZG93blwiLCB0aGlzLm9uS2V5RG93bik7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyB1bmxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4uYXBwLndvcmtzcGFjZS5pdGVyYXRlQ29kZU1pcnJvcnMoKGNtKSA9PiB7XG4gICAgICBjbS5vZmYoXCJrZXlkb3duXCIsIHRoaXMub25LZXlEb3duKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgb25LZXlEb3duID0gKGNtOiBDb2RlTWlycm9yLkVkaXRvciwgZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICBpZiAoIXRoaXMuc2V0dGluZ3NTZXJ2aWNlLnN0aWNrQ3Vyc29yKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKFBsYXRmb3JtLmlzTWFjT1MgJiYgaXNDbWRTaGlmdExlZnQoZXZlbnQpKSB7XG4gICAgICBjb25zdCB7IHNob3VsZFN0b3BQcm9wYWdhdGlvbiB9ID0gdGhpcy5saXN0c1NlcnZpY2UucGVyZm9ybU9wZXJhdGlvbihcbiAgICAgICAgKHJvb3QpID0+IG5ldyBTZWxlY3RUaWxsTGluZVN0YXJ0T3BlcmF0aW9uKHJvb3QpLFxuICAgICAgICBjbVxuICAgICAgKTtcblxuICAgICAgaWYgKHNob3VsZFN0b3BQcm9wYWdhdGlvbikge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG4iLCJpbXBvcnQgeyBOb3RpY2UsIFBsYXRmb3JtLCBQbHVnaW5fMiB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgU2V0dGluZ3NTZXJ2aWNlIH0gZnJvbSBcInNyYy9zZXJ2aWNlcy9TZXR0aW5nc1NlcnZpY2VcIjtcbmltcG9ydCB7IElGZWF0dXJlIH0gZnJvbSBcIi4vSUZlYXR1cmVcIjtcblxuZnVuY3Rpb24gaXNDbWREb3RPckNtZFNoaWZ0RG90KGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgcmV0dXJuIChcbiAgICAoZS5rZXlDb2RlID09PSAxOTAgfHwgZS5jb2RlID09PSBcIlBlcmlvZFwiKSAmJlxuICAgIGUubWV0YUtleSA9PT0gdHJ1ZSAmJlxuICAgIGUuYWx0S2V5ID09PSBmYWxzZSAmJlxuICAgIGUuY3RybEtleSA9PT0gZmFsc2VcbiAgKTtcbn1cblxuZnVuY3Rpb24gaXNDdHJsRG90T3JDdHJsU2hpZnREb3QoZTogS2V5Ym9hcmRFdmVudCkge1xuICByZXR1cm4gKFxuICAgIChlLmtleUNvZGUgPT09IDE5MCB8fCBlLmNvZGUgPT09IFwiUGVyaW9kXCIpICYmXG4gICAgZS5tZXRhS2V5ID09PSBmYWxzZSAmJlxuICAgIGUuYWx0S2V5ID09PSBmYWxzZSAmJlxuICAgIGUuY3RybEtleSA9PT0gdHJ1ZVxuICApO1xufVxuXG5mdW5jdGlvbiBpc01vZERvdE9yTW9kU2hpZnREb3QoZTogS2V5Ym9hcmRFdmVudCkge1xuICByZXR1cm4gUGxhdGZvcm0uaXNNYWNPU1xuICAgID8gaXNDbWREb3RPckNtZFNoaWZ0RG90KGUpXG4gICAgOiBpc0N0cmxEb3RPckN0cmxTaGlmdERvdChlKTtcbn1cblxuZXhwb3J0IGNsYXNzIFpvb21GZWF0dXJlIGltcGxlbWVudHMgSUZlYXR1cmUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBzZXR0aW5nc1NlcnZpY2U6IFNldHRpbmdzU2VydmljZVxuICApIHt9XG5cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5yZWdpc3RlckNvZGVNaXJyb3IoKGNtKSA9PiB7XG4gICAgICBjbS5vbihcImtleWRvd25cIiwgdGhpcy5vbktleURvd24pO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdW5sb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLmFwcC53b3Jrc3BhY2UuaXRlcmF0ZUNvZGVNaXJyb3JzKChjbSkgPT4ge1xuICAgICAgY20ub2ZmKFwia2V5ZG93blwiLCB0aGlzLm9uS2V5RG93bik7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIG9uS2V5RG93biA9IChjbTogQ29kZU1pcnJvci5FZGl0b3IsIGU6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICBpZiAoXG4gICAgICAod2luZG93IGFzIGFueSkuT2JzaWRpYW5ab29tUGx1Z2luIHx8XG4gICAgICB0aGlzLnNldHRpbmdzU2VydmljZS5kaXNhYmxlWm9vbU5vdGlmaWNhdGlvbiB8fFxuICAgICAgIWlzTW9kRG90T3JNb2RTaGlmdERvdChlKVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG5ldyBOb3RpY2UoXG4gICAgICBgWm9vbWluZyBzdXBwb3J0IGhhcyBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgT2JzaWRpYW4gT3V0bGluZXIgcGx1Z2luLiBQbGVhc2UgaW5zdGFsbCB0aGUgT2JzaWRpYW4gWm9vbSBwbHVnaW4uYCxcbiAgICAgIDUwMDBcbiAgICApO1xuICB9O1xufVxuIiwiaW1wb3J0IHsgTm90aWNlLCBQbHVnaW5fMiB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgT2JzaWRpYW5TZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL09ic2lkaWFuU2VydmljZVwiO1xuaW1wb3J0IHsgSUZlYXR1cmUgfSBmcm9tIFwiLi9JRmVhdHVyZVwiO1xuXG5leHBvcnQgY2xhc3MgRm9sZEZlYXR1cmUgaW1wbGVtZW50cyBJRmVhdHVyZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcGx1Z2luOiBQbHVnaW5fMixcbiAgICBwcml2YXRlIG9ic2lkaWFuU2VydmljZTogT2JzaWRpYW5TZXJ2aWNlXG4gICkge31cblxuICBhc3luYyBsb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwiZm9sZFwiLFxuICAgICAgbmFtZTogXCJGb2xkIHRoZSBsaXN0XCIsXG4gICAgICBjYWxsYmFjazogdGhpcy5vYnNpZGlhblNlcnZpY2UuY3JlYXRlQ29tbWFuZENhbGxiYWNrKFxuICAgICAgICB0aGlzLmZvbGQuYmluZCh0aGlzKVxuICAgICAgKSxcbiAgICAgIGhvdGtleXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG1vZGlmaWVyczogW1wiTW9kXCJdLFxuICAgICAgICAgIGtleTogXCJBcnJvd1VwXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgdGhpcy5wbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgICBpZDogXCJ1bmZvbGRcIixcbiAgICAgIG5hbWU6IFwiVW5mb2xkIHRoZSBsaXN0XCIsXG4gICAgICBjYWxsYmFjazogdGhpcy5vYnNpZGlhblNlcnZpY2UuY3JlYXRlQ29tbWFuZENhbGxiYWNrKFxuICAgICAgICB0aGlzLnVuZm9sZC5iaW5kKHRoaXMpXG4gICAgICApLFxuICAgICAgaG90a2V5czogW1xuICAgICAgICB7XG4gICAgICAgICAgbW9kaWZpZXJzOiBbXCJNb2RcIl0sXG4gICAgICAgICAga2V5OiBcIkFycm93RG93blwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHVubG9hZCgpIHt9XG5cbiAgcHJpdmF0ZSBzZXRGb2xkKGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IsIHR5cGU6IFwiZm9sZFwiIHwgXCJ1bmZvbGRcIikge1xuICAgIGlmICghdGhpcy5vYnNpZGlhblNlcnZpY2UuZ2V0T2JzaWRpYW5Gb2xkU2V0dGlnbnMoKS5mb2xkSW5kZW50KSB7XG4gICAgICBuZXcgTm90aWNlKFxuICAgICAgICBgVW5hYmxlIHRvICR7dHlwZX0gYmVjYXVzZSBmb2xkaW5nIGlzIGRpc2FibGVkLiBQbGVhc2UgZW5hYmxlIFwiRm9sZCBpbmRlbnRcIiBpbiBPYnNpZGlhbiBzZXR0aW5ncy5gLFxuICAgICAgICA1MDAwXG4gICAgICApO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgKGVkaXRvciBhcyBhbnkpLmZvbGRDb2RlKGVkaXRvci5nZXRDdXJzb3IoKSwgbnVsbCwgdHlwZSk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgZm9sZChlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yKSB7XG4gICAgcmV0dXJuIHRoaXMuc2V0Rm9sZChlZGl0b3IsIFwiZm9sZFwiKTtcbiAgfVxuXG4gIHByaXZhdGUgdW5mb2xkKGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IpIHtcbiAgICByZXR1cm4gdGhpcy5zZXRGb2xkKGVkaXRvciwgXCJ1bmZvbGRcIik7XG4gIH1cbn1cbiIsImltcG9ydCB7IG1heFBvcywgbWluUG9zLCBSb290IH0gZnJvbSBcIi4uL3Jvb3RcIjtcbmltcG9ydCB7IElPcGVyYXRpb24gfSBmcm9tIFwiLi9JT3BlcmF0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBTZWxlY3RBbGxPcGVyYXRpb24gaW1wbGVtZW50cyBJT3BlcmF0aW9uIHtcbiAgcHJpdmF0ZSBzdG9wUHJvcGFnYXRpb24gPSBmYWxzZTtcbiAgcHJpdmF0ZSB1cGRhdGVkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByb290OiBSb290KSB7fVxuXG4gIHNob3VsZFN0b3BQcm9wYWdhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5zdG9wUHJvcGFnYXRpb247XG4gIH1cblxuICBzaG91bGRVcGRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMudXBkYXRlZDtcbiAgfVxuXG4gIHBlcmZvcm0oKSB7XG4gICAgY29uc3QgeyByb290IH0gPSB0aGlzO1xuXG4gICAgaWYgKCFyb290Lmhhc1NpbmdsZVNlbGVjdGlvbigpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc2VsZWN0aW9uID0gcm9vdC5nZXRTZWxlY3Rpb25zKClbMF07XG4gICAgY29uc3QgW3Jvb3RTdGFydCwgcm9vdEVuZF0gPSByb290LmdldFJhbmdlKCk7XG5cbiAgICBjb25zdCBzZWxlY3Rpb25Gcm9tID0gbWluUG9zKHNlbGVjdGlvbi5hbmNob3IsIHNlbGVjdGlvbi5oZWFkKTtcbiAgICBjb25zdCBzZWxlY3Rpb25UbyA9IG1heFBvcyhzZWxlY3Rpb24uYW5jaG9yLCBzZWxlY3Rpb24uaGVhZCk7XG5cbiAgICBpZiAoXG4gICAgICBzZWxlY3Rpb25Gcm9tLmxpbmUgPCByb290U3RhcnQubGluZSB8fFxuICAgICAgc2VsZWN0aW9uVG8ubGluZSA+IHJvb3RFbmQubGluZVxuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgIHNlbGVjdGlvbkZyb20ubGluZSA9PT0gcm9vdFN0YXJ0LmxpbmUgJiZcbiAgICAgIHNlbGVjdGlvbkZyb20uY2ggPT09IHJvb3RTdGFydC5jaCAmJlxuICAgICAgc2VsZWN0aW9uVG8ubGluZSA9PT0gcm9vdEVuZC5saW5lICYmXG4gICAgICBzZWxlY3Rpb25Uby5jaCA9PT0gcm9vdEVuZC5jaFxuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IGxpc3QgPSByb290LmdldExpc3RVbmRlckN1cnNvcigpO1xuICAgIGNvbnN0IGNvbnRlbnRTdGFydCA9IGxpc3QuZ2V0Rmlyc3RMaW5lQ29udGVudFN0YXJ0KCk7XG4gICAgY29uc3QgY29udGVudEVuZCA9IGxpc3QuZ2V0TGFzdExpbmVDb250ZW50RW5kKCk7XG5cbiAgICBpZiAoXG4gICAgICBzZWxlY3Rpb25Gcm9tLmxpbmUgPCBjb250ZW50U3RhcnQubGluZSB8fFxuICAgICAgc2VsZWN0aW9uVG8ubGluZSA+IGNvbnRlbnRFbmQubGluZVxuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMuc3RvcFByb3BhZ2F0aW9uID0gdHJ1ZTtcbiAgICB0aGlzLnVwZGF0ZWQgPSB0cnVlO1xuXG4gICAgaWYgKFxuICAgICAgc2VsZWN0aW9uRnJvbS5saW5lID09PSBjb250ZW50U3RhcnQubGluZSAmJlxuICAgICAgc2VsZWN0aW9uRnJvbS5jaCA9PT0gY29udGVudFN0YXJ0LmNoICYmXG4gICAgICBzZWxlY3Rpb25Uby5saW5lID09PSBjb250ZW50RW5kLmxpbmUgJiZcbiAgICAgIHNlbGVjdGlvblRvLmNoID09PSBjb250ZW50RW5kLmNoXG4gICAgKSB7XG4gICAgICAvLyBzZWxlY3QgYWxsIGxpc3RcbiAgICAgIHJvb3QucmVwbGFjZVNlbGVjdGlvbnMoW3sgYW5jaG9yOiByb290U3RhcnQsIGhlYWQ6IHJvb3RFbmQgfV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBzZWxlY3QgYWxsIGxpbmVcbiAgICAgIHJvb3QucmVwbGFjZVNlbGVjdGlvbnMoW3sgYW5jaG9yOiBjb250ZW50U3RhcnQsIGhlYWQ6IGNvbnRlbnRFbmQgfV0pO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBQbGF0Zm9ybSwgUGx1Z2luXzIgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IExpc3RzU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9MaXN0c1NlcnZpY2VcIjtcbmltcG9ydCB7IFNlbGVjdEFsbE9wZXJhdGlvbiB9IGZyb20gXCIuLi9vcGVyYXRpb25zL1NlbGVjdEFsbE9wZXJhdGlvblwiO1xuaW1wb3J0IHsgU2V0dGluZ3NTZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL1NldHRpbmdzU2VydmljZVwiO1xuaW1wb3J0IHsgSUZlYXR1cmUgfSBmcm9tIFwiLi9JRmVhdHVyZVwiO1xuXG5mdW5jdGlvbiBpc0NtZEEoZTogS2V5Ym9hcmRFdmVudCkge1xuICByZXR1cm4gKFxuICAgIChlLmtleUNvZGUgPT09IDY1IHx8IGUuY29kZSA9PT0gXCJLZXlBXCIpICYmXG4gICAgZS5zaGlmdEtleSA9PT0gZmFsc2UgJiZcbiAgICBlLm1ldGFLZXkgPT09IHRydWUgJiZcbiAgICBlLmFsdEtleSA9PT0gZmFsc2UgJiZcbiAgICBlLmN0cmxLZXkgPT09IGZhbHNlXG4gICk7XG59XG5cbmZ1bmN0aW9uIGlzQ3RybEEoZTogS2V5Ym9hcmRFdmVudCkge1xuICByZXR1cm4gKFxuICAgIChlLmtleUNvZGUgPT09IDY1IHx8IGUuY29kZSA9PT0gXCJLZXlBXCIpICYmXG4gICAgZS5zaGlmdEtleSA9PT0gZmFsc2UgJiZcbiAgICBlLm1ldGFLZXkgPT09IGZhbHNlICYmXG4gICAgZS5hbHRLZXkgPT09IGZhbHNlICYmXG4gICAgZS5jdHJsS2V5ID09PSB0cnVlXG4gICk7XG59XG5cbmZ1bmN0aW9uIGlzU2VsZWN0QWxsKGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgcmV0dXJuIFBsYXRmb3JtLmlzTWFjT1MgPyBpc0NtZEEoZSkgOiBpc0N0cmxBKGUpO1xufVxuXG5leHBvcnQgY2xhc3MgU2VsZWN0QWxsRmVhdHVyZSBpbXBsZW1lbnRzIElGZWF0dXJlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwbHVnaW46IFBsdWdpbl8yLFxuICAgIHByaXZhdGUgc2V0dGluZ3NTZXJ2aWNlOiBTZXR0aW5nc1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBsaXN0c1NlcnZpY2U6IExpc3RzU2VydmljZVxuICApIHt9XG5cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5yZWdpc3RlckNvZGVNaXJyb3IoKGNtKSA9PiB7XG4gICAgICBjbS5vbihcImtleWRvd25cIiwgdGhpcy5vbktleURvd24pO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdW5sb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLmFwcC53b3Jrc3BhY2UuaXRlcmF0ZUNvZGVNaXJyb3JzKChjbSkgPT4ge1xuICAgICAgY20ub2ZmKFwia2V5ZG93blwiLCB0aGlzLm9uS2V5RG93bik7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIG9uS2V5RG93biA9IChjbTogQ29kZU1pcnJvci5FZGl0b3IsIGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgaWYgKCF0aGlzLnNldHRpbmdzU2VydmljZS5zZWxlY3RBbGwgfHwgIWlzU2VsZWN0QWxsKGV2ZW50KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHsgc2hvdWxkU3RvcFByb3BhZ2F0aW9uIH0gPSB0aGlzLmxpc3RzU2VydmljZS5wZXJmb3JtT3BlcmF0aW9uKFxuICAgICAgKHJvb3QpID0+IG5ldyBTZWxlY3RBbGxPcGVyYXRpb24ocm9vdCksXG4gICAgICBjbVxuICAgICk7XG5cbiAgICBpZiAoc2hvdWxkU3RvcFByb3BhZ2F0aW9uKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICB9O1xufVxuIiwiaW1wb3J0IHsgUm9vdCB9IGZyb20gXCIuLi9yb290XCI7XG5pbXBvcnQgeyBJT3BlcmF0aW9uIH0gZnJvbSBcIi4vSU9wZXJhdGlvblwiO1xuXG5leHBvcnQgY2xhc3MgTW92ZVJpZ2h0T3BlcmF0aW9uIGltcGxlbWVudHMgSU9wZXJhdGlvbiB7XG4gIHByaXZhdGUgc3RvcFByb3BhZ2F0aW9uID0gZmFsc2U7XG4gIHByaXZhdGUgdXBkYXRlZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcm9vdDogUm9vdCwgcHJpdmF0ZSBkZWZhdWx0SW5kZW50Q2hhcnM6IHN0cmluZykge31cblxuICBzaG91bGRTdG9wUHJvcGFnYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcFByb3BhZ2F0aW9uO1xuICB9XG5cbiAgc2hvdWxkVXBkYXRlKCkge1xuICAgIHJldHVybiB0aGlzLnVwZGF0ZWQ7XG4gIH1cblxuICBwZXJmb3JtKCkge1xuICAgIGNvbnN0IHsgcm9vdCB9ID0gdGhpcztcblxuICAgIGlmICghcm9vdC5oYXNTaW5nbGVDdXJzb3IoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc3RvcFByb3BhZ2F0aW9uID0gdHJ1ZTtcblxuICAgIGNvbnN0IGxpc3QgPSByb290LmdldExpc3RVbmRlckN1cnNvcigpO1xuICAgIGNvbnN0IHBhcmVudCA9IGxpc3QuZ2V0UGFyZW50KCk7XG4gICAgY29uc3QgcHJldiA9IHBhcmVudC5nZXRQcmV2U2libGluZ09mKGxpc3QpO1xuXG4gICAgaWYgKCFwcmV2KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVkID0gdHJ1ZTtcblxuICAgIGNvbnN0IGxpc3RTdGFydExpbmVCZWZvcmUgPSByb290LmdldENvbnRlbnRMaW5lc1JhbmdlT2YobGlzdClbMF07XG5cbiAgICBjb25zdCBpbmRlbnRQb3MgPSBsaXN0LmdldEZpcnN0TGluZUluZGVudCgpLmxlbmd0aDtcbiAgICBsZXQgaW5kZW50Q2hhcnMgPSBcIlwiO1xuXG4gICAgaWYgKGluZGVudENoYXJzID09PSBcIlwiICYmICFwcmV2LmlzRW1wdHkoKSkge1xuICAgICAgaW5kZW50Q2hhcnMgPSBwcmV2XG4gICAgICAgIC5nZXRDaGlsZHJlbigpWzBdXG4gICAgICAgIC5nZXRGaXJzdExpbmVJbmRlbnQoKVxuICAgICAgICAuc2xpY2UocHJldi5nZXRGaXJzdExpbmVJbmRlbnQoKS5sZW5ndGgpO1xuICAgIH1cblxuICAgIGlmIChpbmRlbnRDaGFycyA9PT0gXCJcIikge1xuICAgICAgaW5kZW50Q2hhcnMgPSBsaXN0XG4gICAgICAgIC5nZXRGaXJzdExpbmVJbmRlbnQoKVxuICAgICAgICAuc2xpY2UocGFyZW50LmdldEZpcnN0TGluZUluZGVudCgpLmxlbmd0aCk7XG4gICAgfVxuXG4gICAgaWYgKGluZGVudENoYXJzID09PSBcIlwiICYmICFsaXN0LmlzRW1wdHkoKSkge1xuICAgICAgaW5kZW50Q2hhcnMgPSBsaXN0LmdldENoaWxkcmVuKClbMF0uZ2V0Rmlyc3RMaW5lSW5kZW50KCk7XG4gICAgfVxuXG4gICAgaWYgKGluZGVudENoYXJzID09PSBcIlwiKSB7XG4gICAgICBpbmRlbnRDaGFycyA9IHRoaXMuZGVmYXVsdEluZGVudENoYXJzO1xuICAgIH1cblxuICAgIHBhcmVudC5yZW1vdmVDaGlsZChsaXN0KTtcbiAgICBwcmV2LmFkZEFmdGVyQWxsKGxpc3QpO1xuICAgIGxpc3QuaW5kZW50Q29udGVudChpbmRlbnRQb3MsIGluZGVudENoYXJzKTtcblxuICAgIGNvbnN0IGxpc3RTdGFydExpbmVBZnRlciA9IHJvb3QuZ2V0Q29udGVudExpbmVzUmFuZ2VPZihsaXN0KVswXTtcbiAgICBjb25zdCBsaW5lRGlmZiA9IGxpc3RTdGFydExpbmVBZnRlciAtIGxpc3RTdGFydExpbmVCZWZvcmU7XG5cbiAgICBjb25zdCBjdXJzb3IgPSByb290LmdldEN1cnNvcigpO1xuICAgIHJvb3QucmVwbGFjZUN1cnNvcih7XG4gICAgICBsaW5lOiBjdXJzb3IubGluZSArIGxpbmVEaWZmLFxuICAgICAgY2g6IGN1cnNvci5jaCArIGluZGVudENoYXJzLmxlbmd0aCxcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUm9vdCB9IGZyb20gXCIuLi9yb290XCI7XG5pbXBvcnQgeyBJT3BlcmF0aW9uIH0gZnJvbSBcIi4vSU9wZXJhdGlvblwiO1xuXG5leHBvcnQgY2xhc3MgTW92ZURvd25PcGVyYXRpb24gaW1wbGVtZW50cyBJT3BlcmF0aW9uIHtcbiAgcHJpdmF0ZSBzdG9wUHJvcGFnYXRpb24gPSBmYWxzZTtcbiAgcHJpdmF0ZSB1cGRhdGVkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByb290OiBSb290KSB7fVxuXG4gIHNob3VsZFN0b3BQcm9wYWdhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5zdG9wUHJvcGFnYXRpb247XG4gIH1cblxuICBzaG91bGRVcGRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMudXBkYXRlZDtcbiAgfVxuXG4gIHBlcmZvcm0oKSB7XG4gICAgY29uc3QgeyByb290IH0gPSB0aGlzO1xuXG4gICAgaWYgKCFyb290Lmhhc1NpbmdsZUN1cnNvcigpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zdG9wUHJvcGFnYXRpb24gPSB0cnVlO1xuXG4gICAgY29uc3QgbGlzdCA9IHJvb3QuZ2V0TGlzdFVuZGVyQ3Vyc29yKCk7XG4gICAgY29uc3QgcGFyZW50ID0gbGlzdC5nZXRQYXJlbnQoKTtcbiAgICBjb25zdCBncmFuZFBhcmVudCA9IHBhcmVudC5nZXRQYXJlbnQoKTtcbiAgICBjb25zdCBuZXh0ID0gcGFyZW50LmdldE5leHRTaWJsaW5nT2YobGlzdCk7XG5cbiAgICBjb25zdCBsaXN0U3RhcnRMaW5lQmVmb3JlID0gcm9vdC5nZXRDb250ZW50TGluZXNSYW5nZU9mKGxpc3QpWzBdO1xuXG4gICAgaWYgKCFuZXh0ICYmIGdyYW5kUGFyZW50KSB7XG4gICAgICBjb25zdCBuZXdQYXJlbnQgPSBncmFuZFBhcmVudC5nZXROZXh0U2libGluZ09mKHBhcmVudCk7XG5cbiAgICAgIGlmIChuZXdQYXJlbnQpIHtcbiAgICAgICAgdGhpcy51cGRhdGVkID0gdHJ1ZTtcbiAgICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKGxpc3QpO1xuICAgICAgICBuZXdQYXJlbnQuYWRkQmVmb3JlQWxsKGxpc3QpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobmV4dCkge1xuICAgICAgdGhpcy51cGRhdGVkID0gdHJ1ZTtcbiAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChsaXN0KTtcbiAgICAgIHBhcmVudC5hZGRBZnRlcihuZXh0LCBsaXN0KTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMudXBkYXRlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGxpc3RTdGFydExpbmVBZnRlciA9IHJvb3QuZ2V0Q29udGVudExpbmVzUmFuZ2VPZihsaXN0KVswXTtcbiAgICBjb25zdCBsaW5lRGlmZiA9IGxpc3RTdGFydExpbmVBZnRlciAtIGxpc3RTdGFydExpbmVCZWZvcmU7XG5cbiAgICBjb25zdCBjdXJzb3IgPSByb290LmdldEN1cnNvcigpO1xuICAgIHJvb3QucmVwbGFjZUN1cnNvcih7XG4gICAgICBsaW5lOiBjdXJzb3IubGluZSArIGxpbmVEaWZmLFxuICAgICAgY2g6IGN1cnNvci5jaCxcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUm9vdCB9IGZyb20gXCIuLi9yb290XCI7XG5pbXBvcnQgeyBJT3BlcmF0aW9uIH0gZnJvbSBcIi4vSU9wZXJhdGlvblwiO1xuXG5leHBvcnQgY2xhc3MgTW92ZVVwT3BlcmF0aW9uIGltcGxlbWVudHMgSU9wZXJhdGlvbiB7XG4gIHByaXZhdGUgc3RvcFByb3BhZ2F0aW9uID0gZmFsc2U7XG4gIHByaXZhdGUgdXBkYXRlZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcm9vdDogUm9vdCkge31cblxuICBzaG91bGRTdG9wUHJvcGFnYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcFByb3BhZ2F0aW9uO1xuICB9XG5cbiAgc2hvdWxkVXBkYXRlKCkge1xuICAgIHJldHVybiB0aGlzLnVwZGF0ZWQ7XG4gIH1cblxuICBwZXJmb3JtKCkge1xuICAgIGNvbnN0IHsgcm9vdCB9ID0gdGhpcztcblxuICAgIGlmICghcm9vdC5oYXNTaW5nbGVDdXJzb3IoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc3RvcFByb3BhZ2F0aW9uID0gdHJ1ZTtcblxuICAgIGNvbnN0IGxpc3QgPSByb290LmdldExpc3RVbmRlckN1cnNvcigpO1xuICAgIGNvbnN0IHBhcmVudCA9IGxpc3QuZ2V0UGFyZW50KCk7XG4gICAgY29uc3QgZ3JhbmRQYXJlbnQgPSBwYXJlbnQuZ2V0UGFyZW50KCk7XG4gICAgY29uc3QgcHJldiA9IHBhcmVudC5nZXRQcmV2U2libGluZ09mKGxpc3QpO1xuXG4gICAgY29uc3QgbGlzdFN0YXJ0TGluZUJlZm9yZSA9IHJvb3QuZ2V0Q29udGVudExpbmVzUmFuZ2VPZihsaXN0KVswXTtcblxuICAgIGlmICghcHJldiAmJiBncmFuZFBhcmVudCkge1xuICAgICAgY29uc3QgbmV3UGFyZW50ID0gZ3JhbmRQYXJlbnQuZ2V0UHJldlNpYmxpbmdPZihwYXJlbnQpO1xuXG4gICAgICBpZiAobmV3UGFyZW50KSB7XG4gICAgICAgIHRoaXMudXBkYXRlZCA9IHRydWU7XG4gICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChsaXN0KTtcbiAgICAgICAgbmV3UGFyZW50LmFkZEFmdGVyQWxsKGxpc3QpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocHJldikge1xuICAgICAgdGhpcy51cGRhdGVkID0gdHJ1ZTtcbiAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChsaXN0KTtcbiAgICAgIHBhcmVudC5hZGRCZWZvcmUocHJldiwgbGlzdCk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnVwZGF0ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsaXN0U3RhcnRMaW5lQWZ0ZXIgPSByb290LmdldENvbnRlbnRMaW5lc1JhbmdlT2YobGlzdClbMF07XG4gICAgY29uc3QgbGluZURpZmYgPSBsaXN0U3RhcnRMaW5lQWZ0ZXIgLSBsaXN0U3RhcnRMaW5lQmVmb3JlO1xuXG4gICAgY29uc3QgY3Vyc29yID0gcm9vdC5nZXRDdXJzb3IoKTtcbiAgICByb290LnJlcGxhY2VDdXJzb3Ioe1xuICAgICAgbGluZTogY3Vyc29yLmxpbmUgKyBsaW5lRGlmZixcbiAgICAgIGNoOiBjdXJzb3IuY2gsXG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFBsdWdpbl8yIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBMaXN0c1NlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvTGlzdHNTZXJ2aWNlXCI7XG5pbXBvcnQgeyBNb3ZlTGVmdE9wZXJhdGlvbiB9IGZyb20gXCIuLi9vcGVyYXRpb25zL01vdmVMZWZ0T3BlcmF0aW9uXCI7XG5pbXBvcnQgeyBPYnNpZGlhblNlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvT2JzaWRpYW5TZXJ2aWNlXCI7XG5pbXBvcnQgeyBJRmVhdHVyZSB9IGZyb20gXCIuL0lGZWF0dXJlXCI7XG5pbXBvcnQgeyBNb3ZlUmlnaHRPcGVyYXRpb24gfSBmcm9tIFwiLi4vb3BlcmF0aW9ucy9Nb3ZlUmlnaHRPcGVyYXRpb25cIjtcbmltcG9ydCB7IE1vdmVEb3duT3BlcmF0aW9uIH0gZnJvbSBcIi4uL29wZXJhdGlvbnMvTW92ZURvd25PcGVyYXRpb25cIjtcbmltcG9ydCB7IE1vdmVVcE9wZXJhdGlvbiB9IGZyb20gXCIuLi9vcGVyYXRpb25zL01vdmVVcE9wZXJhdGlvblwiO1xuXG5leHBvcnQgY2xhc3MgTW92ZUl0ZW1zRmVhdHVyZSBpbXBsZW1lbnRzIElGZWF0dXJlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwbHVnaW46IFBsdWdpbl8yLFxuICAgIHByaXZhdGUgb2JzaWRpYW5TZXJ2aWNlOiBPYnNpZGlhblNlcnZpY2UsXG4gICAgcHJpdmF0ZSBsaXN0c1NlcnZpY2U6IExpc3RzU2VydmljZVxuICApIHt9XG5cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcIm1vdmUtbGlzdC1pdGVtLXVwXCIsXG4gICAgICBuYW1lOiBcIk1vdmUgbGlzdCBhbmQgc3VibGlzdHMgdXBcIixcbiAgICAgIGNhbGxiYWNrOiB0aGlzLm9ic2lkaWFuU2VydmljZS5jcmVhdGVDb21tYW5kQ2FsbGJhY2soXG4gICAgICAgIHRoaXMubW92ZUxpc3RFbGVtZW50VXAuYmluZCh0aGlzKVxuICAgICAgKSxcbiAgICAgIGhvdGtleXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sXG4gICAgICAgICAga2V5OiBcIkFycm93VXBcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICB0aGlzLnBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcIm1vdmUtbGlzdC1pdGVtLWRvd25cIixcbiAgICAgIG5hbWU6IFwiTW92ZSBsaXN0IGFuZCBzdWJsaXN0cyBkb3duXCIsXG4gICAgICBjYWxsYmFjazogdGhpcy5vYnNpZGlhblNlcnZpY2UuY3JlYXRlQ29tbWFuZENhbGxiYWNrKFxuICAgICAgICB0aGlzLm1vdmVMaXN0RWxlbWVudERvd24uYmluZCh0aGlzKVxuICAgICAgKSxcbiAgICAgIGhvdGtleXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sXG4gICAgICAgICAga2V5OiBcIkFycm93RG93blwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwiaW5kZW50LWxpc3RcIixcbiAgICAgIG5hbWU6IFwiSW5kZW50IHRoZSBsaXN0IGFuZCBzdWJsaXN0c1wiLFxuICAgICAgY2FsbGJhY2s6IHRoaXMub2JzaWRpYW5TZXJ2aWNlLmNyZWF0ZUNvbW1hbmRDYWxsYmFjayhcbiAgICAgICAgdGhpcy5tb3ZlTGlzdEVsZW1lbnRSaWdodC5iaW5kKHRoaXMpXG4gICAgICApLFxuICAgICAgaG90a2V5czogW1xuICAgICAgICB7XG4gICAgICAgICAgbW9kaWZpZXJzOiBbXSxcbiAgICAgICAgICBrZXk6IFwiVGFiXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgdGhpcy5wbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgICBpZDogXCJvdXRkZW50LWxpc3RcIixcbiAgICAgIG5hbWU6IFwiT3V0ZGVudCB0aGUgbGlzdCBhbmQgc3VibGlzdHNcIixcbiAgICAgIGNhbGxiYWNrOiB0aGlzLm9ic2lkaWFuU2VydmljZS5jcmVhdGVDb21tYW5kQ2FsbGJhY2soXG4gICAgICAgIHRoaXMubW92ZUxpc3RFbGVtZW50TGVmdC5iaW5kKHRoaXMpXG4gICAgICApLFxuICAgICAgaG90a2V5czogW1xuICAgICAgICB7XG4gICAgICAgICAgbW9kaWZpZXJzOiBbXCJTaGlmdFwiXSxcbiAgICAgICAgICBrZXk6IFwiVGFiXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdW5sb2FkKCkge31cblxuICBwcml2YXRlIG1vdmVMaXN0RWxlbWVudERvd24oZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcikge1xuICAgIGNvbnN0IHsgc2hvdWxkU3RvcFByb3BhZ2F0aW9uIH0gPSB0aGlzLmxpc3RzU2VydmljZS5wZXJmb3JtT3BlcmF0aW9uKFxuICAgICAgKHJvb3QpID0+IG5ldyBNb3ZlRG93bk9wZXJhdGlvbihyb290KSxcbiAgICAgIGVkaXRvclxuICAgICk7XG4gICAgcmV0dXJuIHNob3VsZFN0b3BQcm9wYWdhdGlvbjtcbiAgfVxuXG4gIHByaXZhdGUgbW92ZUxpc3RFbGVtZW50VXAoZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcikge1xuICAgIGNvbnN0IHsgc2hvdWxkU3RvcFByb3BhZ2F0aW9uIH0gPSB0aGlzLmxpc3RzU2VydmljZS5wZXJmb3JtT3BlcmF0aW9uKFxuICAgICAgKHJvb3QpID0+IG5ldyBNb3ZlVXBPcGVyYXRpb24ocm9vdCksXG4gICAgICBlZGl0b3JcbiAgICApO1xuICAgIHJldHVybiBzaG91bGRTdG9wUHJvcGFnYXRpb247XG4gIH1cblxuICBwcml2YXRlIG1vdmVMaXN0RWxlbWVudFJpZ2h0KGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IpIHtcbiAgICBjb25zdCB7IHNob3VsZFN0b3BQcm9wYWdhdGlvbiB9ID0gdGhpcy5saXN0c1NlcnZpY2UucGVyZm9ybU9wZXJhdGlvbihcbiAgICAgIChyb290KSA9PlxuICAgICAgICBuZXcgTW92ZVJpZ2h0T3BlcmF0aW9uKHJvb3QsIHRoaXMubGlzdHNTZXJ2aWNlLmdldERlZmF1bHRJbmRlbnRDaGFycygpKSxcbiAgICAgIGVkaXRvclxuICAgICk7XG4gICAgcmV0dXJuIHNob3VsZFN0b3BQcm9wYWdhdGlvbjtcbiAgfVxuXG4gIHByaXZhdGUgbW92ZUxpc3RFbGVtZW50TGVmdChlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yKSB7XG4gICAgY29uc3QgeyBzaG91bGRTdG9wUHJvcGFnYXRpb24gfSA9IHRoaXMubGlzdHNTZXJ2aWNlLnBlcmZvcm1PcGVyYXRpb24oXG4gICAgICAocm9vdCkgPT4gbmV3IE1vdmVMZWZ0T3BlcmF0aW9uKHJvb3QpLFxuICAgICAgZWRpdG9yXG4gICAgKTtcbiAgICByZXR1cm4gc2hvdWxkU3RvcFByb3BhZ2F0aW9uO1xuICB9XG59XG4iLCJpbXBvcnQgeyBSb290IH0gZnJvbSBcIi4uL3Jvb3RcIjtcbmltcG9ydCB7IElPcGVyYXRpb24gfSBmcm9tIFwiLi9JT3BlcmF0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBDcmVhdGVOb3RlTGluZU9wZXJhdGlvbiBpbXBsZW1lbnRzIElPcGVyYXRpb24ge1xuICBwcml2YXRlIHN0b3BQcm9wYWdhdGlvbiA9IGZhbHNlO1xuICBwcml2YXRlIHVwZGF0ZWQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJvb3Q6IFJvb3QsIHByaXZhdGUgZGVmYXVsdEluZGVudENoYXJzOiBzdHJpbmcpIHt9XG5cbiAgc2hvdWxkU3RvcFByb3BhZ2F0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnN0b3BQcm9wYWdhdGlvbjtcbiAgfVxuXG4gIHNob3VsZFVwZGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy51cGRhdGVkO1xuICB9XG5cbiAgcGVyZm9ybSgpIHtcbiAgICBjb25zdCB7IHJvb3QgfSA9IHRoaXM7XG5cbiAgICBpZiAoIXJvb3QuaGFzU2luZ2xlQ3Vyc29yKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnN0b3BQcm9wYWdhdGlvbiA9IHRydWU7XG4gICAgdGhpcy51cGRhdGVkID0gdHJ1ZTtcblxuICAgIGNvbnN0IGN1cnNvciA9IHJvb3QuZ2V0Q3Vyc29yKCk7XG4gICAgY29uc3QgbGlzdCA9IHJvb3QuZ2V0TGlzdFVuZGVyQ3Vyc29yKCk7XG5cbiAgICBpZiAoIWxpc3QuZ2V0Tm90ZXNJbmRlbnQoKSkge1xuICAgICAgY29uc3QgaW5kZW50ID0gbGlzdC5pc0VtcHR5KClcbiAgICAgICAgPyBsaXN0LmdldEZpcnN0TGluZUluZGVudCgpICsgdGhpcy5kZWZhdWx0SW5kZW50Q2hhcnNcbiAgICAgICAgOiBsaXN0LmdldENoaWxkcmVuKClbMF0uZ2V0Rmlyc3RMaW5lSW5kZW50KCk7XG5cbiAgICAgIGxpc3Quc2V0Tm90ZXNJbmRlbnQoaW5kZW50KTtcbiAgICB9XG5cbiAgICBjb25zdCBsaW5lcyA9IGxpc3QuZ2V0TGluZXNJbmZvKCkucmVkdWNlKChhY2MsIGxpbmUpID0+IHtcbiAgICAgIGlmIChjdXJzb3IubGluZSA9PT0gbGluZS5mcm9tLmxpbmUpIHtcbiAgICAgICAgYWNjLnB1c2gobGluZS50ZXh0LnNsaWNlKDAsIGN1cnNvci5jaCAtIGxpbmUuZnJvbS5jaCkpO1xuICAgICAgICBhY2MucHVzaChsaW5lLnRleHQuc2xpY2UoY3Vyc29yLmNoIC0gbGluZS5mcm9tLmNoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhY2MucHVzaChsaW5lLnRleHQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIFtdIGFzIHN0cmluZ1tdKTtcblxuICAgIGxpc3QucmVwbGFjZUxpbmVzKGxpbmVzKTtcblxuICAgIHJvb3QucmVwbGFjZUN1cnNvcih7XG4gICAgICBsaW5lOiBjdXJzb3IubGluZSArIDEsXG4gICAgICBjaDogbGlzdC5nZXROb3Rlc0luZGVudCgpLmxlbmd0aCxcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUGx1Z2luXzIgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IENyZWF0ZU5vdGVMaW5lT3BlcmF0aW9uIH0gZnJvbSBcIi4uL29wZXJhdGlvbnMvQ3JlYXRlTm90ZUxpbmVPcGVyYXRpb25cIjtcbmltcG9ydCB7IElGZWF0dXJlIH0gZnJvbSBcIi4vSUZlYXR1cmVcIjtcbmltcG9ydCB7IExpc3RzU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9MaXN0c1NlcnZpY2VcIjtcbmltcG9ydCB7IFNldHRpbmdzU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9TZXR0aW5nc1NlcnZpY2VcIjtcblxuZnVuY3Rpb24gaXNTaGlmdEVudGVyKGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgcmV0dXJuIChcbiAgICAoZS5rZXlDb2RlID09PSAxMyB8fCBlLmNvZGUgPT09IFwiRW50ZXJcIikgJiZcbiAgICBlLnNoaWZ0S2V5ID09PSB0cnVlICYmXG4gICAgZS5tZXRhS2V5ID09PSBmYWxzZSAmJlxuICAgIGUuYWx0S2V5ID09PSBmYWxzZSAmJlxuICAgIGUuY3RybEtleSA9PT0gZmFsc2VcbiAgKTtcbn1cblxuZXhwb3J0IGNsYXNzIFNoaWZ0RW50ZXJTaG91bGRDcmVhdGVOb3RlRmVhdHVyZSBpbXBsZW1lbnRzIElGZWF0dXJlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwbHVnaW46IFBsdWdpbl8yLFxuICAgIHByaXZhdGUgc2V0dGluZ3NTZXJ2aWNlOiBTZXR0aW5nc1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBsaXN0c1NlcnZpY2U6IExpc3RzU2VydmljZVxuICApIHt9XG5cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5yZWdpc3RlckNvZGVNaXJyb3IoKGNtKSA9PiB7XG4gICAgICBjbS5vbihcImtleWRvd25cIiwgdGhpcy5vbktleURvd24pO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdW5sb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLmFwcC53b3Jrc3BhY2UuaXRlcmF0ZUNvZGVNaXJyb3JzKChjbSkgPT4ge1xuICAgICAgY20ub2ZmKFwia2V5ZG93blwiLCB0aGlzLm9uS2V5RG93bik7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIG9uS2V5RG93biA9IChjbTogQ29kZU1pcnJvci5FZGl0b3IsIGU6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICBpZiAoIXRoaXMuc2V0dGluZ3NTZXJ2aWNlLmJldHRlckVudGVyIHx8ICFpc1NoaWZ0RW50ZXIoZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7IHNob3VsZFN0b3BQcm9wYWdhdGlvbiB9ID0gdGhpcy5saXN0c1NlcnZpY2UucGVyZm9ybU9wZXJhdGlvbihcbiAgICAgIChyb290KSA9PlxuICAgICAgICBuZXcgQ3JlYXRlTm90ZUxpbmVPcGVyYXRpb24oXG4gICAgICAgICAgcm9vdCxcbiAgICAgICAgICB0aGlzLmxpc3RzU2VydmljZS5nZXREZWZhdWx0SW5kZW50Q2hhcnMoKVxuICAgICAgICApLFxuICAgICAgY21cbiAgICApO1xuXG4gICAgaWYgKHNob3VsZFN0b3BQcm9wYWdhdGlvbikge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH07XG59XG4iLCJpbXBvcnQgeyBQbHVnaW4gfSBmcm9tIFwib2JzaWRpYW5cIjtcclxuaW1wb3J0IHtcclxuICBPYnNpZGlhbk91dGxpbmVyUGx1Z2luU2V0dGluZ1RhYixcclxuICBTZXR0aW5nc1NlcnZpY2UsXHJcbn0gZnJvbSBcIi4vc2VydmljZXMvU2V0dGluZ3NTZXJ2aWNlXCI7XHJcbmltcG9ydCB7IElGZWF0dXJlIH0gZnJvbSBcIi4vZmVhdHVyZXMvSUZlYXR1cmVcIjtcclxuaW1wb3J0IHsgT2JzaWRpYW5TZXJ2aWNlIH0gZnJvbSBcIi4vc2VydmljZXMvT2JzaWRpYW5TZXJ2aWNlXCI7XHJcbmltcG9ydCB7IExpc3RzU2VydmljZSB9IGZyb20gXCIuL3NlcnZpY2VzL0xpc3RzU2VydmljZVwiO1xyXG5pbXBvcnQgeyBMb2dnZXJTZXJ2aWNlIH0gZnJvbSBcIi4vc2VydmljZXMvTG9nZ2VyU2VydmljZVwiO1xyXG5pbXBvcnQgeyBMaXN0c1N0eWxlc0ZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9MaXN0c1N0eWxlc0ZlYXR1cmVcIjtcclxuaW1wb3J0IHsgRW50ZXJPdXRkZW50SWZMaW5lSXNFbXB0eUZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9FbnRlck91dGRlbnRJZkxpbmVJc0VtcHR5RmVhdHVyZVwiO1xyXG5pbXBvcnQgeyBFbnRlclNob3VsZENyZWF0ZU5ld0l0ZW1GZWF0dXJlIH0gZnJvbSBcIi4vZmVhdHVyZXMvRW50ZXJTaG91bGRDcmVhdGVOZXdJdGVtT25DaGlsZExldmVsRmVhdHVyZVwiO1xyXG5pbXBvcnQgeyBNb3ZlQ3Vyc29yVG9QcmV2aW91c1VuZm9sZGVkTGluZUZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9Nb3ZlQ3Vyc29yVG9QcmV2aW91c1VuZm9sZGVkTGluZUZlYXR1cmVcIjtcclxuaW1wb3J0IHsgRW5zdXJlQ3Vyc29ySW5MaXN0Q29udGVudEZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9FbnN1cmVDdXJzb3JJbkxpc3RDb250ZW50RmVhdHVyZVwiO1xyXG5pbXBvcnQgeyBEZWxldGVTaG91bGRJZ25vcmVCdWxsZXRzRmVhdHVyZSB9IGZyb20gXCIuL2ZlYXR1cmVzL0RlbGV0ZVNob3VsZElnbm9yZUJ1bGxldHNGZWF0dXJlXCI7XHJcbmltcG9ydCB7IFNlbGVjdGlvblNob3VsZElnbm9yZUJ1bGxldHNGZWF0dXJlIH0gZnJvbSBcIi4vZmVhdHVyZXMvU2VsZWN0aW9uU2hvdWxkSWdub3JlQnVsbGV0c0ZlYXR1cmVcIjtcclxuaW1wb3J0IHsgWm9vbUZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9ab29tRmVhdHVyZVwiO1xyXG5pbXBvcnQgeyBGb2xkRmVhdHVyZSB9IGZyb20gXCIuL2ZlYXR1cmVzL0ZvbGRGZWF0dXJlXCI7XHJcbmltcG9ydCB7IFNlbGVjdEFsbEZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9TZWxlY3RBbGxGZWF0dXJlXCI7XHJcbmltcG9ydCB7IE1vdmVJdGVtc0ZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9Nb3ZlSXRlbXNGZWF0dXJlXCI7XHJcbmltcG9ydCB7IFNoaWZ0RW50ZXJTaG91bGRDcmVhdGVOb3RlRmVhdHVyZSB9IGZyb20gXCIuL2ZlYXR1cmVzL1NoaWZ0RW50ZXJTaG91bGRDcmVhdGVOb3RlRmVhdHVyZVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT2JzaWRpYW5PdXRsaW5lclBsdWdpbiBleHRlbmRzIFBsdWdpbiB7XHJcbiAgcHJpdmF0ZSBmZWF0dXJlczogSUZlYXR1cmVbXTtcclxuICBwcml2YXRlIHNldHRpbmdzU2VydmljZTogU2V0dGluZ3NTZXJ2aWNlO1xyXG4gIHByaXZhdGUgbG9nZ2VyU2VydmljZTogTG9nZ2VyU2VydmljZTtcclxuICBwcml2YXRlIG9ic2lkaWFuU2VydmljZTogT2JzaWRpYW5TZXJ2aWNlO1xyXG4gIHByaXZhdGUgbGlzdHNTZXJ2aWNlOiBMaXN0c1NlcnZpY2U7XHJcblxyXG4gIGFzeW5jIG9ubG9hZCgpIHtcclxuICAgIGNvbnNvbGUubG9nKGBMb2FkaW5nIG9ic2lkaWFuLW91dGxpbmVyYCk7XHJcblxyXG4gICAgdGhpcy5zZXR0aW5nc1NlcnZpY2UgPSBuZXcgU2V0dGluZ3NTZXJ2aWNlKHRoaXMpO1xyXG4gICAgYXdhaXQgdGhpcy5zZXR0aW5nc1NlcnZpY2UubG9hZCgpO1xyXG5cclxuICAgIHRoaXMubG9nZ2VyU2VydmljZSA9IG5ldyBMb2dnZXJTZXJ2aWNlKHRoaXMuc2V0dGluZ3NTZXJ2aWNlKTtcclxuXHJcbiAgICB0aGlzLm9ic2lkaWFuU2VydmljZSA9IG5ldyBPYnNpZGlhblNlcnZpY2UodGhpcy5hcHApO1xyXG4gICAgdGhpcy5saXN0c1NlcnZpY2UgPSBuZXcgTGlzdHNTZXJ2aWNlKFxyXG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UsXHJcbiAgICAgIHRoaXMub2JzaWRpYW5TZXJ2aWNlXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMuYWRkU2V0dGluZ1RhYihcclxuICAgICAgbmV3IE9ic2lkaWFuT3V0bGluZXJQbHVnaW5TZXR0aW5nVGFiKHRoaXMuYXBwLCB0aGlzLCB0aGlzLnNldHRpbmdzU2VydmljZSlcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5mZWF0dXJlcyA9IFtcclxuICAgICAgbmV3IExpc3RzU3R5bGVzRmVhdHVyZSh0aGlzLCB0aGlzLnNldHRpbmdzU2VydmljZSwgdGhpcy5vYnNpZGlhblNlcnZpY2UpLFxyXG4gICAgICBuZXcgRW50ZXJPdXRkZW50SWZMaW5lSXNFbXB0eUZlYXR1cmUoXHJcbiAgICAgICAgdGhpcyxcclxuICAgICAgICB0aGlzLnNldHRpbmdzU2VydmljZSxcclxuICAgICAgICB0aGlzLmxpc3RzU2VydmljZVxyXG4gICAgICApLFxyXG4gICAgICBuZXcgRW50ZXJTaG91bGRDcmVhdGVOZXdJdGVtRmVhdHVyZShcclxuICAgICAgICB0aGlzLFxyXG4gICAgICAgIHRoaXMuc2V0dGluZ3NTZXJ2aWNlLFxyXG4gICAgICAgIHRoaXMubGlzdHNTZXJ2aWNlXHJcbiAgICAgICksXHJcbiAgICAgIG5ldyBFbnN1cmVDdXJzb3JJbkxpc3RDb250ZW50RmVhdHVyZShcclxuICAgICAgICB0aGlzLFxyXG4gICAgICAgIHRoaXMuc2V0dGluZ3NTZXJ2aWNlLFxyXG4gICAgICAgIHRoaXMubGlzdHNTZXJ2aWNlXHJcbiAgICAgICksXHJcbiAgICAgIG5ldyBNb3ZlQ3Vyc29yVG9QcmV2aW91c1VuZm9sZGVkTGluZUZlYXR1cmUoXHJcbiAgICAgICAgdGhpcyxcclxuICAgICAgICB0aGlzLnNldHRpbmdzU2VydmljZSxcclxuICAgICAgICB0aGlzLmxpc3RzU2VydmljZVxyXG4gICAgICApLFxyXG4gICAgICBuZXcgRGVsZXRlU2hvdWxkSWdub3JlQnVsbGV0c0ZlYXR1cmUoXHJcbiAgICAgICAgdGhpcyxcclxuICAgICAgICB0aGlzLnNldHRpbmdzU2VydmljZSxcclxuICAgICAgICB0aGlzLmxpc3RzU2VydmljZVxyXG4gICAgICApLFxyXG4gICAgICBuZXcgU2VsZWN0aW9uU2hvdWxkSWdub3JlQnVsbGV0c0ZlYXR1cmUoXHJcbiAgICAgICAgdGhpcyxcclxuICAgICAgICB0aGlzLnNldHRpbmdzU2VydmljZSxcclxuICAgICAgICB0aGlzLmxpc3RzU2VydmljZVxyXG4gICAgICApLFxyXG4gICAgICBuZXcgWm9vbUZlYXR1cmUodGhpcywgdGhpcy5zZXR0aW5nc1NlcnZpY2UpLFxyXG4gICAgICBuZXcgRm9sZEZlYXR1cmUodGhpcywgdGhpcy5vYnNpZGlhblNlcnZpY2UpLFxyXG4gICAgICBuZXcgU2VsZWN0QWxsRmVhdHVyZSh0aGlzLCB0aGlzLnNldHRpbmdzU2VydmljZSwgdGhpcy5saXN0c1NlcnZpY2UpLFxyXG4gICAgICBuZXcgTW92ZUl0ZW1zRmVhdHVyZSh0aGlzLCB0aGlzLm9ic2lkaWFuU2VydmljZSwgdGhpcy5saXN0c1NlcnZpY2UpLFxyXG4gICAgICBuZXcgU2hpZnRFbnRlclNob3VsZENyZWF0ZU5vdGVGZWF0dXJlKFxyXG4gICAgICAgIHRoaXMsXHJcbiAgICAgICAgdGhpcy5zZXR0aW5nc1NlcnZpY2UsXHJcbiAgICAgICAgdGhpcy5saXN0c1NlcnZpY2VcclxuICAgICAgKSxcclxuICAgIF07XHJcblxyXG4gICAgZm9yIChjb25zdCBmZWF0dXJlIG9mIHRoaXMuZmVhdHVyZXMpIHtcclxuICAgICAgYXdhaXQgZmVhdHVyZS5sb2FkKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBvbnVubG9hZCgpIHtcclxuICAgIGNvbnNvbGUubG9nKGBVbmxvYWRpbmcgb2JzaWRpYW4tb3V0bGluZXJgKTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IGZlYXR1cmUgb2YgdGhpcy5mZWF0dXJlcykge1xyXG4gICAgICBhd2FpdCBmZWF0dXJlLnVubG9hZCgpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOlsiUGx1Z2luU2V0dGluZ1RhYiIsIlNldHRpbmciLCJNYXJrZG93blZpZXciLCJpc0VudGVyIiwiUGxhdGZvcm0iLCJOb3RpY2UiLCJQbHVnaW4iXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBdURBO0FBQ08sU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQzdELElBQUksU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxLQUFLLFlBQVksQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxVQUFVLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQ2hILElBQUksT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQy9ELFFBQVEsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUNuRyxRQUFRLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFD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
