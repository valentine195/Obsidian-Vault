'use strict';

var obsidian = require('obsidian');

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
    constructor(workspace, metadataCache, settings) {
        this.workspace = workspace;
        this.metadataCache = metadataCache;
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
            this.activateEditorLeaf(sugg.item, false);
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
        const { workspace, settings: { excludeViewTypes, includeSidePanelViewTypes }, } = this;
        const leaves = [];
        const saveLeaf = (l) => {
            const viewType = l.view?.getViewType();
            if (this.isMainPanelLeaf(l)) {
                if (!excludeViewTypes.includes(viewType)) {
                    leaves.push(l);
                }
            }
            else if (includeSidePanelViewTypes.includes(viewType)) {
                leaves.push(l);
            }
        };
        workspace.iterateAllLeaves(saveLeaf);
        return leaves;
    }
    isMainPanelLeaf(leaf) {
        return leaf?.getRoot() === this.workspace.rootSplit;
    }
    activateEditorLeaf(leaf, pushHistory, eState) {
        const { workspace } = this;
        const isInSidePanel = !this.isMainPanelLeaf(leaf);
        const state = { focus: true, ...eState };
        if (isInSidePanel) {
            workspace.revealLeaf(leaf);
        }
        workspace.setActiveLeaf(leaf, pushHistory);
        leaf.view.setEphemeralState(state);
    }
    getSymbolsForTarget(targetInfo, orderByLineNumber) {
        const { metadataCache } = this;
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
        const { workspace } = this;
        // determine if the target is already open in a pane
        const { leaf, file: { path }, } = this.findOpenEditorMatchingSymbolTarget();
        const { start: { line, col }, end: endLoc, } = sugg.item.symbol.position;
        // object containing the state information for the target editor,
        // start with the range to highlight in target editor
        const eState = {
            startLoc: { line, col },
            endLoc,
            line,
            cursor: {
                from: { line, ch: col },
                to: { line, ch: col },
            },
        };
        if (leaf && !this.settings.alwaysNewPaneForSymbols) {
            this.activateEditorLeaf(leaf, true, eState);
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
function getSystemSwitcherInstance(app) {
    const switcher = app.internalPlugins?.getPluginById(QUICK_SWITCHER_ID);
    return switcher?.instance;
}
function createSwitcherPlus(app, plugin) {
    const systemSwitcher = getSystemSwitcherInstance(app)
        ?.QuickSwitcherModal;
    if (!systemSwitcher) {
        console.log('Switcher++: unable to extend system switcher. Plugin UI will not be loaded. Use the builtin switcher instead.');
        return null;
    }
    const switcherPlusClass = class extends systemSwitcher {
        constructor(app, plugin) {
            super(app, plugin.options.builtInSystemOptions);
            this.plugin = plugin;
            this.openWithCommandStr = null;
            this.exMode = new ModeHandler(app.workspace, app.metadataCache, plugin.options);
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

class SwitcherPlusSettings {
    constructor(plugin) {
        this.plugin = plugin;
        this.data = SwitcherPlusSettings.defaultSettingsData;
    }
    static get defaultSettingsData() {
        return {
            alwaysNewPaneForSymbols: false,
            symbolsInLineOrder: true,
            editorListCommand: 'edt ',
            symbolListCommand: '@',
            excludeViewTypes: ['empty'],
            referenceViews: ['backlink', 'localgraph', 'outgoing-link', 'outline'],
            includeSidePanelViewTypes: ['backlink', 'image', 'markdown', 'pdf'],
        };
    }
    get builtInSystemOptions() {
        return getSystemSwitcherInstance(this.plugin.app)?.options;
    }
    get showAllFileTypes() {
        // forward to core switcher settings
        return this.builtInSystemOptions?.showAllFileTypes;
    }
    get showAttachments() {
        // forward to core switcher settings
        return this.builtInSystemOptions?.showAttachments;
    }
    get showExistingOnly() {
        // forward to core switcher settings
        return this.builtInSystemOptions?.showExistingOnly;
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
    get editorListPlaceholderText() {
        return SwitcherPlusSettings.defaultSettingsData.editorListCommand;
    }
    get editorListCommand() {
        return this.data.editorListCommand;
    }
    set editorListCommand(value) {
        this.data.editorListCommand = value;
    }
    get symbolListPlaceholderText() {
        return SwitcherPlusSettings.defaultSettingsData.symbolListCommand;
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
    get includeSidePanelViewTypes() {
        return this.data.includeSidePanelViewTypes;
    }
    set includeSidePanelViewTypes(value) {
        // remove any duplicates before storing
        this.data.includeSidePanelViewTypes = [...new Set(value)];
    }
    get includeSidePanelViewTypesPlaceholder() {
        return SwitcherPlusSettings.defaultSettingsData.includeSidePanelViewTypes.join('\n');
    }
    async loadSettings() {
        const { plugin } = this;
        const savedData = (await plugin.loadData());
        this.data = { ...SwitcherPlusSettings.defaultSettingsData, ...savedData };
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
        SwitcherPlusSettingTab.setSymbolModeSettingsGroup(containerEl, settings);
        this.setEditorModeSettingsGroup(containerEl, settings);
    }
    setEditorModeSettingsGroup(containerEl, settings) {
        new obsidian.Setting(containerEl).setName('Editor List Mode Settings').setHeading();
        SwitcherPlusSettingTab.setEditorListCommand(containerEl, settings);
        this.setIncludeSidePanelViews(containerEl, settings);
    }
    static setSymbolModeSettingsGroup(containerEl, settings) {
        new obsidian.Setting(containerEl).setName('Symbol List Mode Settings').setHeading();
        SwitcherPlusSettingTab.setSymbolListCommand(containerEl, settings);
        SwitcherPlusSettingTab.setSymbolsInLineOrder(containerEl, settings);
        SwitcherPlusSettingTab.setAlwaysNewPaneForSymbols(containerEl, settings);
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
    setIncludeSidePanelViews(containerEl, settings) {
        const viewsListing = Object.keys(this.app.viewRegistry.viewByType)
            .sort()
            .join(' ');
        new obsidian.Setting(containerEl)
            .setName('Include side panel views')
            .setDesc(`When in Editor list mode, show the following view types from the side panels. Add one view type per line. Available view types: ${viewsListing}`)
            .addTextArea((textArea) => textArea
            .setPlaceholder(settings.includeSidePanelViewTypesPlaceholder)
            .setValue(settings.includeSidePanelViewTypes.join('\n'))
            .onChange(async (value) => {
            settings.includeSidePanelViewTypes = value.split('\n');
            settings.saveSettings();
        }));
    }
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
                // modal needs to be created dynamically (same as system switcher)
                // as system options are evaluated in the modal constructor
                const modal = createSwitcherPlus(this.app, this);
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
}

module.exports = SwitcherPlusPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3R5cGVzL3NoYXJlZFR5cGVzLnRzIiwiLi4vLi4vc3JjL3N3aXRjaGVyUGx1cy9pbnB1dEluZm8udHMiLCIuLi8uLi9zcmMvdXRpbHMudHMiLCIuLi8uLi9zcmMvc3dpdGNoZXJQbHVzL21vZGVIYW5kbGVyLnRzIiwiLi4vLi4vc3JjL3N3aXRjaGVyUGx1cy9rZXltYXAudHMiLCIuLi8uLi9zcmMvc3dpdGNoZXJQbHVzL3N3aXRjaGVyUGx1cy50cyIsIi4uLy4uL3NyYy9zZXR0aW5ncy9zd2l0Y2hlclBsdXNTZXR0aW5ncy50cyIsIi4uLy4uL3NyYy9zZXR0aW5ncy9zd2l0Y2hlclBsdXNTZXR0aW5nVGFiLnRzIiwiLi4vLi4vc3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOm51bGwsIm5hbWVzIjpbInJlbmRlclJlc3VsdHMiLCJwcmVwYXJlUXVlcnkiLCJXb3Jrc3BhY2VMZWFmIiwiZnV6enlTZWFyY2giLCJzb3J0U2VhcmNoUmVzdWx0cyIsIlBsdWdpblNldHRpbmdUYWIiLCJTZXR0aW5nIiwiUGx1Z2luIl0sIm1hcHBpbmdzIjoiOzs7O0FBWUEsSUFBWSxJQUlYO0FBSkQsV0FBWSxJQUFJO0lBQ2QsdUNBQVksQ0FBQTtJQUNaLDJDQUFjLENBQUE7SUFDZCwyQ0FBYyxDQUFBO0FBQ2hCLENBQUMsRUFKVyxJQUFJLEtBQUosSUFBSSxRQUlmO0FBRUQsSUFBWSxVQUtYO0FBTEQsV0FBWSxVQUFVO0lBQ3BCLDJDQUFRLENBQUE7SUFDUiw2Q0FBUyxDQUFBO0lBQ1QseUNBQU8sQ0FBQTtJQUNQLGlEQUFXLENBQUE7QUFDYixDQUFDLEVBTFcsVUFBVSxLQUFWLFVBQVUsUUFLckI7QUFNTSxNQUFNLGdCQUFnQixHQUF3QixFQUFFLENBQUM7QUFDeEQsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztBQUN6QyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEdB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
