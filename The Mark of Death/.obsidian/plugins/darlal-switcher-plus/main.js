'use strict';

var obsidian = require('obsidian');

function getDefaultData() {
    return {
        alwaysNewPaneForSymbols: false,
        symbolsInLineOrder: true,
        showExistingOnly: false,
        editorListCommand: 'edt ',
        symbolListCommand: '@',
        excludeViewTypes: ['empty'],
        referenceViews: ['backlink', 'outline', 'localgraph'],
    };
}
class SwitcherPlusSettings {
    constructor(plugin) {
        this.plugin = plugin;
        this.data = getDefaultData();
    }
    get alwaysNewPaneForSymbols() {
        return this.data.alwaysNewPaneForSymbols;
    }
    set alwaysNewPaneForSymbols(value) {
        this.data.alwaysNewPaneForSymbols = value;
    }
    get symbolsInlineOrder() {
        return this.data.symbolsInLineOrder;
    }
    set symbolsInlineOrder(value) {
        this.data.symbolsInLineOrder = value;
    }
    get showExistingOnly() {
        return this.data.showExistingOnly;
    }
    set showExistingOnly(value) {
        this.data.showExistingOnly = value;
    }
    get editorListPlaceholderText() {
        return getDefaultData().editorListCommand;
    }
    get symbolListPlaceholderText() {
        return getDefaultData().symbolListCommand;
    }
    get editorListCommand() {
        return this.data.editorListCommand;
    }
    set editorListCommand(value) {
        this.data.editorListCommand = value;
    }
    get symbolListCommand() {
        return this.data.symbolListCommand;
    }
    set symbolListCommand(value) {
        this.data.symbolListCommand = value;
    }
    get excludeViewTypes() {
        return this.data.excludeViewTypes;
    }
    get referenceViews() {
        return this.data.referenceViews;
    }
    async loadSettings() {
        const { plugin } = this;
        const savedData = (await plugin.loadData());
        this.data = { ...getDefaultData(), ...savedData };
    }
    saveSettings() {
        const { plugin, data } = this;
        if (plugin && data) {
            plugin.saveData(data).catch(() => {
                console.log('Switcher++: Error saving settings data');
            });
        }
    }
}

class SwitcherPlusSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin, settings) {
        super(app, plugin);
        this.settings = settings;
    }
    display() {
        const { containerEl, settings } = this;
        containerEl.empty();
        SwitcherPlusSettingTab.setAlwaysNewPaneForSymbols(containerEl, settings);
        SwitcherPlusSettingTab.setSymbolsInLineOrder(containerEl, settings);
        SwitcherPlusSettingTab.setShowExistingOnly(containerEl, settings);
        SwitcherPlusSettingTab.setEditorListCommand(containerEl, settings);
        SwitcherPlusSettingTab.setSymbolListCommand(containerEl, settings);
    }
    static setAlwaysNewPaneForSymbols(containerEl, settings) {
        new obsidian.Setting(containerEl)
            .setName('Open Symbols in new pane')
            .setDesc('Enabled, always open a new pane when navigating to Symbols. Disabled, navigate in an already open pane (if one exists)')
            .addToggle((toggle) => toggle.setValue(settings.alwaysNewPaneForSymbols).onChange((value) => {
            settings.alwaysNewPaneForSymbols = value;
            settings.saveSettings();
        }));
    }
    static setSymbolsInLineOrder(containerEl, settings) {
        new obsidian.Setting(containerEl)
            .setName('List symbols in order they appear')
            .setDesc('Enabled, symbols will be displayed in the (line) order they appear in the source text, indented under any preceding heading. Disabled, symbols will be grouped by type: Headings, Tags, Links, Embeds.')
            .addToggle((toggle) => toggle.setValue(settings.symbolsInlineOrder).onChange((value) => {
            settings.symbolsInlineOrder = value;
            settings.saveSettings();
        }));
    }
    static setShowExistingOnly(containerEl, settings) {
        new obsidian.Setting(containerEl)
            .setName('Show existing only')
            .setDesc('Whether to show links to files that are not yet created.')
            .addToggle((toggle) => toggle.setValue(settings.showExistingOnly).onChange((value) => {
            settings.showExistingOnly = value;
            settings.saveSettings();
        }));
    }
    static setEditorListCommand(containerEl, settings) {
        new obsidian.Setting(containerEl)
            .setName('Editor list mode trigger')
            .setDesc('Character that will trigger editor list mode in the switcher')
            .addText((text) => text
            .setPlaceholder(settings.editorListPlaceholderText)
            .setValue(settings.editorListCommand)
            .onChange(async (value) => {
            settings.editorListCommand = value;
            settings.saveSettings();
        }));
    }
    static setSymbolListCommand(containerEl, settings) {
        new obsidian.Setting(containerEl)
            .setName('Symbol list mode trigger')
            .setDesc('Character that will trigger symbol list mode in the switcher')
            .addText((text) => text
            .setPlaceholder(settings.symbolListPlaceholderText)
            .setValue(settings.symbolListCommand)
            .onChange(async (value) => {
            settings.symbolListCommand = value;
            settings.saveSettings();
        }));
    }
}

var Mode;
(function (Mode) {
    Mode[Mode["Standard"] = 1] = "Standard";
    Mode[Mode["EditorList"] = 2] = "EditorList";
    Mode[Mode["SymbolList"] = 4] = "SymbolList";
})(Mode || (Mode = {}));
var SymbolType;
(function (SymbolType) {
    SymbolType[SymbolType["Link"] = 1] = "Link";
    SymbolType[SymbolType["Embed"] = 2] = "Embed";
    SymbolType[SymbolType["Tag"] = 4] = "Tag";
    SymbolType[SymbolType["Heading"] = 8] = "Heading";
})(SymbolType || (SymbolType = {}));
const SymbolIndicators = {};
SymbolIndicators[SymbolType.Link] = '🔗';
SymbolIndicators[SymbolType.Embed] = '!';
SymbolIndicators[SymbolType.Tag] = '#';
SymbolIndicators[SymbolType.Heading] = 'H';
const HeadingIndicators = {};
HeadingIndicators[1] = 'H₁';
HeadingIndicators[2] = 'H₂';
HeadingIndicators[3] = 'H₃';
HeadingIndicators[4] = 'H₄';
HeadingIndicators[5] = 'H₅';
HeadingIndicators[6] = 'H₆';

class InputInfo {
    constructor(inputText = '') {
        this.inputText = inputText;
        this.mode = Mode.Standard;
        this.hasSearchTerm = false;
        this.symbolCmd = {
            isValidated: false,
            index: -1,
            parsedInput: null,
            target: null,
        };
        this.editorCmd = {
            isValidated: false,
            index: -1,
            parsedInput: null,
        };
    }
}

function isOfType(obj, discriminator, val) {
    let ret = false;
    if (obj && obj[discriminator] !== undefined) {
        ret = true;
        if (val !== undefined && val !== obj[discriminator]) {
            ret = false;
        }
    }
    return ret;
}
function isSymbolSuggestion(obj) {
    return isOfType(obj, 'type', 'Symbol');
}
function isEditorSuggestion(obj) {
    return isOfType(obj, 'type', 'Editor');
}
function isFileSuggestion(obj) {
    return isOfType(obj, 'type', 'file');
}
function isAliasSuggestion(obj) {
    return isOfType(obj, 'type', 'alias');
}
function isUnresolvedSuggestion(obj) {
    return isOfType(obj, 'type', 'unresolved');
}
function isSystemSuggestion(obj) {
    return isFileSuggestion(obj) || isUnresolvedSuggestion(obj) || isAliasSuggestion(obj);
}
function isHeadingCache(obj) {
    return isOfType(obj, 'level');
}
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function fileFromView(view) {
    return view?.file;
}
class ModeHandler {
    constructor(app, settings) {
        this.app = app;
        this.settings = settings;
        this.reset();
    }
    get mode() {
        return this.inputInfo.mode;
    }
    reset() {
        this.inputInfo = new InputInfo();
    }
    getCommandStringForMode(mode) {
        let val = '';
        const { editorListCommand, symbolListCommand } = this.settings;
        if (mode === Mode.EditorList) {
            val = editorListCommand;
        }
        else if (mode === Mode.SymbolList) {
            val = symbolListCommand;
        }
        return val;
    }
    onChooseSuggestion(sugg) {
        if (isEditorSuggestion(sugg)) {
            const { item } = sugg;
            this.app.workspace.setActiveLeaf(item);
            item.view.setEphemeralState({ focus: true });
        }
        else {
            this.navigateToSymbol(sugg);
        }
    }
    renderSuggestion(sugg, parentEl) {
        let containerEl = parentEl;
        if (isSymbolSuggestion(sugg)) {
            const { item } = sugg;
            if (this.settings.symbolsInlineOrder && !this.inputInfo.hasSearchTerm) {
                parentEl.addClass(`qsp-symbol-l${item.indentLevel}`);
            }
            ModeHandler.addSymbolIndicator(item, containerEl);
            containerEl = createSpan({
                cls: 'qsp-symbol-text',
                parent: containerEl,
            });
        }
        const text = ModeHandler.getItemText(sugg.item);
        obsidian.renderResults(containerEl, text, sugg.match);
    }
    determineRunMode(input, activeSuggestion, activeLeaf) {
        const { editorListCommand, symbolListCommand } = this.settings;
        const info = new InputInfo(input);
        if (!input || input.length === 0) {
            this.reset();
        }
        const escSymbolCmd = escapeRegExp(symbolListCommand);
        const escEditorCmd = escapeRegExp(editorListCommand);
        const prefixCmds = [`(?<sp>${escSymbolCmd})`, `(?<ep>${escEditorCmd})`].sort((a, b) => b.length - a.length);
        // regex that matches symbol, editor prefixes, and embedded symbol command
        // as long as it's not preceded by another symbol command
        // ^(?:(?<ep>edt )|(?<sp>@))|(?<!@.*)(?<se>@)
        const re = new RegExp(`^(?:${prefixCmds[0]}|${prefixCmds[1]})|(?<!${escSymbolCmd}.*)(?<se>${escSymbolCmd})`, 'g');
        const matches = input.matchAll(re);
        for (const match of matches) {
            if (match.groups) {
                const { groups, index } = match;
                if (groups.ep) {
                    this.validateEditorCommand(info, index);
                }
                else if (groups.sp || groups.se) {
                    this.validateSymbolCommand(info, index, activeSuggestion, activeLeaf);
                }
            }
        }
        return info;
    }
    validateEditorCommand(inputInfo, index) {
        const { editorListCommand } = this.settings;
        const { editorCmd, inputText } = inputInfo;
        inputInfo.mode = Mode.EditorList;
        editorCmd.index = index;
        editorCmd.parsedInput = inputText.slice(editorListCommand.length);
        editorCmd.isValidated = true;
    }
    validateSymbolCommand(inputInfo, index, activeSuggestion, activeLeaf) {
        const { symbolListCommand } = this.settings;
        const { mode, symbolCmd, inputText } = inputInfo;
        // Both Standard and EditorList mode can have an embedded symbol command
        if (mode === Mode.Standard || mode === Mode.EditorList) {
            const target = this.getSymbolTarget(activeSuggestion, activeLeaf, index === 0);
            if (target) {
                inputInfo.mode = Mode.SymbolList;
                symbolCmd.target = target;
                symbolCmd.index = index;
                symbolCmd.parsedInput = inputText.slice(index + symbolListCommand.length);
                symbolCmd.isValidated = true;
            }
        }
    }
    getSymbolTarget(activeSuggestion, activeLeaf, isSymbolCmdPrefix) {
        // figure out if the previous operation was a symbol operation
        const prevInputInfo = this.inputInfo;
        let prevTarget = null;
        let hasPrevSymbolTarget = false;
        if (prevInputInfo) {
            prevTarget = prevInputInfo.symbolCmd?.target;
            hasPrevSymbolTarget = prevInputInfo.mode === Mode.SymbolList && !!prevTarget;
        }
        const activeSuggInfo = ModeHandler.getActiveSuggestionInfo(activeSuggestion);
        const activeEditorInfo = this.getActiveEditorInfo(activeLeaf);
        // Pick the target for a potential symbol operation, prioritizing
        // any pre-existing symbol operation that was in progress
        let target = null;
        if (hasPrevSymbolTarget) {
            target = prevTarget;
        }
        else if (activeSuggInfo.isValidSymbolTarget) {
            target = activeSuggInfo;
        }
        else if (activeEditorInfo.isValidSymbolTarget && isSymbolCmdPrefix) {
            target = activeEditorInfo;
        }
        return target;
    }
    getActiveEditorInfo(activeLeaf) {
        const { view } = activeLeaf;
        const { excludeViewTypes } = this.settings;
        // determine if the current active editor pane is valid
        const isCurrentEditorValid = !excludeViewTypes.includes(view.getViewType());
        const file = fileFromView(view);
        // whether or not the current active editor can be used as the target for
        // symbol search
        const isValidSymbolTarget = isCurrentEditorValid && !!file;
        return { isValidSymbolTarget, leaf: activeLeaf, file, suggestion: null };
    }
    static getActiveSuggestionInfo(activeSuggestion) {
        let file = null, leaf = null, isValidSymbolTarget = false;
        if (activeSuggestion &&
            !isSymbolSuggestion(activeSuggestion) &&
            !isUnresolvedSuggestion(activeSuggestion)) {
            // Can't use a symbol suggestion, or unresolved (non-existent file) as
            // the target for another symbol command
            isValidSymbolTarget = true;
            if (isEditorSuggestion(activeSuggestion)) {
                leaf = activeSuggestion.item;
                file = fileFromView(leaf.view);
            }
            else {
                // this catches system File suggestion and Alias suggestion
                file = activeSuggestion.file;
            }
        }
        return { isValidSymbolTarget, leaf, file, suggestion: activeSuggestion };
    }
    static extractSearchQuery(inputInfo) {
        const { mode, symbolCmd, editorCmd } = inputInfo;
        let input = '';
        if (mode === Mode.SymbolList) {
            input = symbolCmd.parsedInput;
        }
        else if (mode === Mode.EditorList) {
            input = editorCmd.parsedInput;
        }
        const queryStr = input.trim().toLowerCase();
        const prepQuery = obsidian.prepareQuery(queryStr);
        return prepQuery;
    }
    getSuggestions(inputInfo) {
        const suggestions = [];
        const push = (item, match) => {
            if (item instanceof obsidian.WorkspaceLeaf) {
                suggestions.push({ type: 'Editor', item, match });
            }
            else {
                suggestions.push({ type: 'Symbol', item, match });
            }
        };
        if (inputInfo) {
            this.inputInfo = inputInfo;
            const prepQuery = ModeHandler.extractSearchQuery(inputInfo);
            const hasSearchTerm = prepQuery?.query?.length > 0;
            inputInfo.hasSearchTerm = hasSearchTerm;
            const items = this.getItems(inputInfo);
            items.forEach((item) => {
                let match = null;
                if (hasSearchTerm) {
                    const text = ModeHandler.getItemText(item);
                    match = obsidian.fuzzySearch(prepQuery, text);
                    if (match) {
                        push(item, match);
                    }
                }
                else {
                    push(item, null);
                }
            });
            if (hasSearchTerm) {
                obsidian.sortSearchResults(suggestions);
            }
        }
        return suggestions;
    }
    getItems(inputInfo) {
        let items;
        const { mode, hasSearchTerm, symbolCmd: { target }, } = inputInfo;
        if (mode === Mode.EditorList) {
            items = this.getOpenRootSplits();
        }
        else if (mode === Mode.SymbolList) {
            const orderByLineNumber = this.settings.symbolsInlineOrder && !hasSearchTerm;
            items = this.getSymbolsForTarget(target, orderByLineNumber);
        }
        return items;
    }
    getOpenRootSplits() {
        const { app: { workspace }, settings: { excludeViewTypes }, } = this;
        const leaves = [];
        const saveLeaf = (l) => {
            if (!excludeViewTypes.includes(l.view.getViewType())) {
                leaves.push(l);
            }
        };
        workspace.iterateRootLeaves(saveLeaf);
        return leaves;
    }
    getSymbolsForTarget(targetInfo, orderByLineNumber) {
        const { app: { metadataCache }, } = this;
        const ret = [];
        if (targetInfo && targetInfo.file) {
            const file = targetInfo.file;
            const symbolData = metadataCache.getFileCache(file);
            if (symbolData) {
                const push = (symbols = [], type) => {
                    symbols.forEach((symbol) => ret.push({ symbol, type }));
                };
                push(symbolData.headings, SymbolType.Heading);
                push(symbolData.tags, SymbolType.Tag);
                push(symbolData.links, SymbolType.Link);
                push(symbolData.embeds, SymbolType.Embed);
            }
        }
        return orderByLineNumber ? ModeHandler.orderSymbolsByLineNumber(ret) : ret;
    }
    static orderSymbolsByLineNumber(symbols = []) {
        const sorted = symbols.sort((a, b) => {
            const { start: aStart } = a.symbol.position;
            const { start: bStart } = b.symbol.position;
            const lineDiff = aStart.line - bStart.line;
            return lineDiff === 0 ? aStart.col - bStart.col : lineDiff;
        });
        let currIndentLevel = 0;
        sorted.forEach((si) => {
            let indentLevel = 0;
            if (isHeadingCache(si.symbol)) {
                currIndentLevel = si.symbol.level;
                indentLevel = si.symbol.level - 1;
            }
            else {
                indentLevel = currIndentLevel;
            }
            si.indentLevel = indentLevel;
        });
        return sorted;
    }
    static getItemText(item) {
        let text;
        if (item instanceof obsidian.WorkspaceLeaf) {
            text = item.getDisplayText();
        }
        else {
            text = ModeHandler.getSuggestionTextForSymbol(item);
        }
        return text;
    }
    static getSuggestionTextForSymbol(symbolInfo) {
        const { symbol } = symbolInfo;
        let text;
        if (isHeadingCache(symbol)) {
            text = symbol.heading;
        }
        else if (isOfType(symbol, 'tag')) {
            text = symbol.tag.slice(1);
        }
        else {
            const refCache = symbol;
            ({ link: text } = refCache);
            const { displayText } = refCache;
            if (displayText && displayText !== text) {
                text += `|${displayText}`;
            }
        }
        return text;
    }
    navigateToSymbol(sugg) {
        const { workspace } = this.app;
        // determine if the target is already open in a pane
        const { leaf, file: { path }, } = this.findOpenEditorMatchingSymbolTarget();
        const { start: { line, col }, end: endLoc, } = sugg.item.symbol.position;
        // object containing the state information for the target editor,
        // start with the range to highlight in target editor
        const eState = {
            startLoc: { line, col },
            endLoc,
            line,
            focus: true,
            cursor: {
                from: { line, ch: col },
                to: { line, ch: col },
            },
        };
        if (leaf && !this.settings.alwaysNewPaneForSymbols) {
            // activate the already open pane, and set state
            workspace.setActiveLeaf(leaf, true);
            leaf.view.setEphemeralState(eState);
        }
        else {
            workspace
                .openLinkText(path, '', true, { eState })
                .catch(() => console.log('Switcher++: unable to navigate to symbol'));
        }
    }
    findOpenEditorMatchingSymbolTarget() {
        const { referenceViews } = this.settings;
        const { file, leaf } = this.inputInfo.symbolCmd.target;
        const isTargetLeaf = !!leaf;
        const predicate = (l) => {
            let val = false;
            const isRefView = referenceViews.includes(l.view.getViewType());
            const isTargetRefView = isTargetLeaf && referenceViews.includes(leaf.view.getViewType());
            if (!isRefView) {
                val =
                    isTargetLeaf && !isTargetRefView ? l === leaf : fileFromView(l.view) === file;
            }
            return val;
        };
        const l = this.getOpenRootSplits().find(predicate);
        return { leaf: l, file, suggestion: null, isValidSymbolTarget: false };
    }
    static addSymbolIndicator(symbolInfo, parentEl) {
        const { type, symbol } = symbolInfo;
        let indicator;
        if (isHeadingCache(symbol)) {
            indicator = HeadingIndicators[symbol.level];
        }
        else {
            indicator = SymbolIndicators[type];
        }
        createDiv({
            text: indicator,
            cls: 'qsp-symbol-indicator',
            parent: parentEl,
        });
    }
}

class Keymap {
    constructor(scope, chooser, modalContainerEl) {
        this.scope = scope;
        this.chooser = chooser;
        this.modalContainerEl = modalContainerEl;
    }
    get isOpen() {
        return this._isOpen;
    }
    set isOpen(value) {
        this._isOpen = value;
    }
    registerBindings() {
        const { scope } = this;
        scope.register(['Ctrl'], 'n', this.navigateItems.bind(this));
        scope.register(['Ctrl'], 'p', this.navigateItems.bind(this));
    }
    navigateItems(_evt, ctx) {
        const { isOpen, chooser } = this;
        if (isOpen) {
            const isNext = ctx.key === 'n';
            const index = chooser.selectedItem;
            chooser.setSelectedItem(isNext ? index + 1 : index - 1);
        }
        return false;
    }
    static updateHelperTextForMode(mode, containerEl) {
        const selector = '.prompt-instructions';
        const el = containerEl.querySelector(selector);
        if (el) {
            el.style.display = mode === Mode.Standard ? '' : 'none';
        }
    }
    updateKeymapForMode(mode) {
        const keys = this.scope.keys;
        let { backupKeys = [] } = this;
        Keymap.updateHelperTextForMode(mode, this.modalContainerEl);
        if (mode === Mode.Standard) {
            if (backupKeys.length) {
                backupKeys.forEach((key) => keys.push(key));
            }
            backupKeys = undefined;
        }
        else {
            // unregister unused hotkeys for custom modes
            for (let i = keys.length - 1; i >= 0; --i) {
                const key = keys[i];
                if (key.key === 'Enter' &&
                    (key.modifiers === 'Meta' || key.modifiers === 'Shift')) {
                    keys.splice(i, 1);
                    backupKeys.push(key);
                }
            }
        }
        this.backupKeys = backupKeys;
    }
}

const QUICK_SWITCHER_ID = 'switcher';
function getSystemSwitcher(app) {
    const switcher = app.internalPlugins.getPluginById(QUICK_SWITCHER_ID);
    return switcher?.instance?.modal?.constructor;
}
function createSwitcherPlus(app, plugin) {
    const systemSwitcher = getSystemSwitcher(app);
    if (!systemSwitcher) {
        console.log('Switcher++: unable to extend system switcher. Plugin UI will not be loaded. Use the builtin switcher instead.');
        return null;
    }
    const switcherPlusClass = class extends systemSwitcher {
        constructor(app, plugin) {
            super(app);
            this.plugin = plugin;
            this.openWithCommandStr = null;
            this.exMode = new ModeHandler(app, plugin.options);
            this.exKeymap = new Keymap(this.scope, this.chooser, this.containerEl);
        }
        openInMode(mode) {
            const { exMode } = this;
            exMode.reset();
            this.chooser.setSuggestions([]);
            if (mode !== Mode.Standard) {
                this.openWithCommandStr = exMode.getCommandStringForMode(mode);
            }
            this.open();
        }
        onOpen() {
            this.exKeymap.isOpen = true;
            super.onOpen();
        }
        onClose() {
            super.onClose();
            this.exKeymap.isOpen = false;
        }
        updateSuggestions() {
            const { exMode, exKeymap, chooser, openWithCommandStr } = this;
            if (openWithCommandStr !== null && openWithCommandStr !== '') {
                // update UI with current command string in the case were openInMode was called
                this.inputEl.value = openWithCommandStr;
                // reset to null so user input is not overridden the next time onInput is called
                this.openWithCommandStr = null;
            }
            const activeSugg = this.getActiveSuggestion();
            const inputInfo = exMode.determineRunMode(this.inputEl.value, activeSugg, this.app.workspace.activeLeaf);
            const { mode } = inputInfo;
            exKeymap.updateKeymapForMode(mode);
            if (mode === Mode.Standard) {
                super.updateSuggestions();
            }
            else {
                chooser.setSuggestions([]);
                const suggestions = exMode.getSuggestions(inputInfo);
                chooser.setSuggestions(suggestions);
            }
        }
        onChooseSuggestion(item, evt) {
            const { exMode } = this;
            const useDefault = exMode.mode === Mode.Standard || item === null;
            if (isSystemSuggestion(item) || useDefault) {
                super.onChooseSuggestion(item, evt);
            }
            else {
                exMode.onChooseSuggestion(item);
            }
        }
        renderSuggestion(value, parentEl) {
            const { exMode } = this;
            const useDefault = exMode.mode === Mode.Standard || value === null;
            if (isSystemSuggestion(value) || useDefault) {
                super.renderSuggestion(value, parentEl);
            }
            else {
                exMode.renderSuggestion(value, parentEl);
            }
        }
        getActiveSuggestion() {
            const { chooser } = this;
            let activeSuggestion = null;
            if (chooser?.values) {
                activeSuggestion = chooser.values[chooser.selectedItem];
            }
            return activeSuggestion;
        }
    };
    return new switcherPlusClass(app, plugin);
}

class SwitcherPlusPlugin extends obsidian.Plugin {
    async onload() {
        const options = new SwitcherPlusSettings(this);
        await options.loadSettings();
        this.options = options;
        this.addSettingTab(new SwitcherPlusSettingTab(this.app, this, options));
        this.registerCommand('switcher-plus:open', 'Open', Mode.Standard);
        this.registerCommand('switcher-plus:open-editors', 'Open in Editor Mode', Mode.EditorList);
        this.registerCommand('switcher-plus:open-symbols', 'Open in Symbol Mode', Mode.SymbolList);
    }
    onunload() {
        this.modal = null;
    }
    registerCommand(id, name, mode) {
        this.addCommand({
            id,
            name,
            hotkeys: [],
            checkCallback: (checking) => {
                const modal = this.getModal();
                if (modal) {
                    if (!checking) {
                        modal.openInMode(mode);
                    }
                    return true;
                }
                return false;
            },
        });
    }
    getModal() {
        let { modal } = this;
        if (modal) {
            return modal;
        }
        modal = createSwitcherPlus(this.app, this);
        this.modal = modal;
        return modal;
    }
}

module.exports = SwitcherPlusPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NldHRpbmdzL3N3aXRjaGVyUGx1c1NldHRpbmdzLnRzIiwiLi4vLi4vc3JjL3NldHRpbmdzL3N3aXRjaGVyUGx1c1NldHRpbmdUYWIudHMiLCIuLi8uLi9zcmMvdHlwZXMvc2hhcmVkVHlwZXMudHMiLCIuLi8uLi9zcmMvc3dpdGNoZXJQbHVzL2lucHV0SW5mby50cyIsIi4uLy4uL3NyYy91dGlscy50cyIsIi4uLy4uL3NyYy9zd2l0Y2hlclBsdXMvbW9kZUhhbmRsZXIudHMiLCIuLi8uLi9zcmMvc3dpdGNoZXJQbHVzL2tleW1hcC50cyIsIi4uLy4uL3NyYy9zd2l0Y2hlclBsdXMvc3dpdGNoZXJQbHVzLnRzIiwiLi4vLi4vc3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOm51bGwsIm5hbWVzIjpbIlBsdWdpblNldHRpbmdUYWIiLCJTZXR0aW5nIiwicmVuZGVyUmVzdWx0cyIsInByZXBhcmVRdWVyeSIsIldvcmtzcGFjZUxlYWYiLCJmdXp6eVNlYXJjaCIsInNvcnRTZWFyY2hSZXN1bHRzIiwiUGx1Z2luIl0sIm1hcHBpbmdzIjoiOzs7O0FBWUEsU0FBUyxjQUFjO0lBQ3JCLE9BQU87UUFDTCx1QkFBdUIsRUFBRSxLQUFLO1FBQzlCLGtCQUFrQixFQUFFLElBQUk7UUFDeEIsZ0JBQWdCLEVBQUUsS0FBSztRQUN2QixpQkFBaUIsRUFBRSxNQUFNO1FBQ3pCLGlCQUFpQixFQUFFLEdBQUc7UUFDdEIsZ0JBQWdCLEVBQUUsQ0FBQyxPQUFPLENBQUM7UUFDM0IsY0FBYyxFQUFFLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxZQUFZLENBQUM7S0FDdEQsQ0FBQztBQUNKLENBQUM7TUFFWSxvQkFBb0I7SUEyRC9CLFlBQW9CLE1BQTBCO1FBQTFCLFdBQU0sR0FBTixNQUFNLENBQW9CO1FBQzVDLElBQUksQ0FBQyxJQUFJLEdBQUcsY0FBYyxFQUFFLENBQUM7S0FDOUI7SUExREQsSUFBSSx1QkFBdUI7UUFD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
