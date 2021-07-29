'use strict';

var obsidian = require('obsidian');

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
    return isOfType(obj, 'type', 'symbol');
}
function isEditorSuggestion(obj) {
    return isOfType(obj, 'type', 'editor');
}
function isWorkspaceSuggestion(obj) {
    return isOfType(obj, 'type', 'workspace');
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
function isTagCache(obj) {
    return isOfType(obj, 'tag');
}
function isSymbolInfo(obj) {
    return isOfType(obj, 'type', 'symbolInfo');
}
function isWorkspaceInfo(obj) {
    return isOfType(obj, 'type', 'WorkspaceInfo');
}
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function getInternalPluginById(app, id) {
    return app?.internalPlugins?.getPluginById(id);
}
function getSystemSwitcherInstance(app) {
    const plugin = getInternalPluginById(app, 'switcher');
    return plugin?.instance;
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
            workspaceListCommand: '+',
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
    get workspaceListCommand() {
        return this.data.workspaceListCommand;
    }
    set workspaceListCommand(value) {
        this.data.workspaceListCommand = value;
    }
    get workspaceListPlaceholderText() {
        return SwitcherPlusSettings.defaultSettingsData.workspaceListCommand;
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
        SwitcherPlusSettingTab.setWorkspaceModeSettingsGroup(containerEl, settings);
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
    static setWorkspaceModeSettingsGroup(containerEl, settings) {
        new obsidian.Setting(containerEl).setName('Workspace List Mode Settings').setHeading();
        SwitcherPlusSettingTab.setWorkspaceListCommand(containerEl, settings);
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
            .setName('List symbols as indented outline')
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
    static setWorkspaceListCommand(containerEl, settings) {
        new obsidian.Setting(containerEl)
            .setName('Workspace list mode trigger')
            .setDesc('Character that will trigger workspace list mode in the switcher')
            .addText((text) => text
            .setPlaceholder(settings.workspaceListPlaceholderText)
            .setValue(settings.workspaceListCommand)
            .onChange(async (value) => {
            settings.workspaceListCommand = value;
            settings.saveSettings();
        }));
    }
}

var Mode;
(function (Mode) {
    Mode[Mode["Standard"] = 1] = "Standard";
    Mode[Mode["EditorList"] = 2] = "EditorList";
    Mode[Mode["SymbolList"] = 4] = "SymbolList";
    Mode[Mode["WorkspaceList"] = 8] = "WorkspaceList";
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

const WORKSPACE_PLUGIN_ID = 'workspaces';
class WorkspaceHandler {
    constructor(app, settings) {
        this.app = app;
        this.settings = settings;
    }
    validateCommand(inputInfo, index) {
        const { workspaceListCommand } = this.settings;
        const { workspaceCmd, inputText } = inputInfo;
        if (this.isWorkspacesPluginEnabled()) {
            inputInfo.mode = Mode.WorkspaceList;
            workspaceCmd.index = index;
            workspaceCmd.parsedInput = inputText.slice(workspaceListCommand.length);
            workspaceCmd.isValidated = true;
        }
    }
    getSuggestions(inputInfo) {
        const suggestions = [];
        if (inputInfo) {
            inputInfo.buildSearchQuery();
            const { hasSearchTerm, prepQuery } = inputInfo.searchQuery;
            const items = this.getItems();
            items.forEach((item) => {
                let shouldPush = true;
                let match = null;
                if (hasSearchTerm) {
                    match = obsidian.fuzzySearch(prepQuery, item.id);
                    shouldPush = !!match;
                }
                if (shouldPush) {
                    suggestions.push({ type: 'workspace', item, match });
                }
            });
            if (hasSearchTerm) {
                obsidian.sortSearchResults(suggestions);
            }
        }
        return suggestions;
    }
    renderSuggestion(sugg, parentEl) {
        if (sugg) {
            obsidian.renderResults(parentEl, sugg.item.id, sugg.match);
        }
    }
    onChooseSuggestion(sugg) {
        if (sugg) {
            const { id } = sugg.item;
            const pluginInstance = this.getSystemWorkspacesPluginInstance();
            if (typeof pluginInstance['loadWorkspace'] === 'function') {
                pluginInstance.loadWorkspace(id);
            }
        }
    }
    getItems() {
        const items = [];
        const workspaces = this.getSystemWorkspacesPluginInstance()?.workspaces;
        if (workspaces) {
            Object.keys(workspaces).forEach((id) => items.push({ id, type: 'workspaceInfo' }));
        }
        return items;
    }
    isWorkspacesPluginEnabled() {
        const plugin = this.getSystemWorkspacesPlugin();
        return plugin?.enabled;
    }
    getSystemWorkspacesPlugin() {
        return getInternalPluginById(this.app, WORKSPACE_PLUGIN_ID);
    }
    getSystemWorkspacesPluginInstance() {
        const workspacesPlugin = this.getSystemWorkspacesPlugin();
        return workspacesPlugin?.instance;
    }
}

class InputInfo {
    constructor(inputText = '') {
        this.inputText = inputText;
        this.mode = Mode.Standard;
        this.symbolCmd = { ...InputInfo.defaultParsedCommand, target: null };
        this.editorCmd = InputInfo.defaultParsedCommand;
        this.workspaceCmd = InputInfo.defaultParsedCommand;
        this.searchQuery = { hasSearchTerm: false, prepQuery: null };
    }
    static get defaultParsedCommand() {
        return {
            isValidated: false,
            index: -1,
            parsedInput: null,
        };
    }
    buildSearchQuery() {
        const { mode } = this;
        let input = '';
        if (mode === Mode.SymbolList) {
            input = this.symbolCmd.parsedInput;
        }
        else if (mode === Mode.EditorList) {
            input = this.editorCmd.parsedInput;
        }
        else if (mode === Mode.WorkspaceList) {
            input = this.workspaceCmd.parsedInput;
        }
        const prepQuery = obsidian.prepareQuery(input.trim().toLowerCase());
        const hasSearchTerm = prepQuery?.query?.length > 0;
        this.searchQuery = { prepQuery, hasSearchTerm };
    }
}

function fileFromView(view) {
    return view?.file;
}
class ModeHandler {
    constructor(app, settings) {
        this.settings = settings;
        this.workspace = app?.workspace;
        this.metadataCache = app?.metadataCache;
        this.wsHandler = new WorkspaceHandler(app, settings);
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
        const { editorListCommand, symbolListCommand, workspaceListCommand } = this.settings;
        if (mode === Mode.EditorList) {
            val = editorListCommand;
        }
        else if (mode === Mode.SymbolList) {
            val = symbolListCommand;
        }
        else if (mode === Mode.WorkspaceList) {
            val = workspaceListCommand;
        }
        return val;
    }
    onChooseSuggestion(sugg) {
        if (isEditorSuggestion(sugg)) {
            this.activateEditorLeaf(sugg.item, false);
        }
        else if (isWorkspaceSuggestion(sugg)) {
            this.wsHandler.onChooseSuggestion(sugg);
        }
        else {
            this.navigateToSymbol(sugg);
        }
    }
    renderSuggestion(sugg, parentEl) {
        let containerEl = parentEl;
        if (isSymbolSuggestion(sugg)) {
            const { item } = sugg;
            if (this.settings.symbolsInlineOrder && !this.inputInfo.searchQuery.hasSearchTerm) {
                parentEl.addClass(`qsp-symbol-l${item.indentLevel}`);
            }
            ModeHandler.addSymbolIndicator(item, containerEl);
            containerEl = createSpan({
                cls: 'qsp-symbol-text',
                parent: containerEl,
            });
        }
        if (isWorkspaceSuggestion(sugg)) {
            this.wsHandler.renderSuggestion(sugg, parentEl);
        }
        else {
            const text = ModeHandler.getItemText(sugg.item);
            obsidian.renderResults(containerEl, text, sugg.match);
        }
    }
    determineRunMode(inputText, activeSuggestion, activeLeaf) {
        const input = inputText ?? '';
        const { editorListCommand, symbolListCommand, workspaceListCommand } = this.settings;
        const info = new InputInfo(input);
        if (input.length === 0) {
            this.reset();
        }
        const escSymbolCmd = escapeRegExp(symbolListCommand);
        const escEditorCmd = escapeRegExp(editorListCommand);
        const escWorkspaceCmd = escapeRegExp(workspaceListCommand);
        const prefixCmds = [`(?<ep>${escEditorCmd})`, `(?<wp>${escWorkspaceCmd})`].sort((a, b) => b.length - a.length);
        // regex that matches editor, workspace prefixes, and embedded symbol command
        // as long as it's not preceded by another symbol command
        // ^(?:(?<ep>edt )|(?<wp>+))|(?<!@.*)(?<se>@)
        const re = new RegExp(`^(?:${prefixCmds[0]}|${prefixCmds[1]})|(?<!${escSymbolCmd}.*)(?<se>${escSymbolCmd})`, 'g');
        const matches = input.matchAll(re);
        for (const match of matches) {
            if (match.groups) {
                const { groups, index } = match;
                if (groups.ep) {
                    this.validateEditorCommand(info, index);
                }
                else if (groups.wp) {
                    this.wsHandler.validateCommand(info, index);
                }
                else if (groups.se) {
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
        prevTarget = prevInputInfo.symbolCmd?.target;
        hasPrevSymbolTarget = prevInputInfo.mode === Mode.SymbolList && !!prevTarget;
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
        const { excludeViewTypes } = this.settings;
        let file = null, isValidSymbolTarget = false;
        if (activeLeaf) {
            const { view } = activeLeaf;
            let isCurrentEditorValid = false;
            if (view) {
                // determine if the current active editor pane is valid
                isCurrentEditorValid = !excludeViewTypes.includes(view.getViewType());
                file = fileFromView(view);
            }
            // whether or not the current active editor can be used as the target for
            // symbol search
            isValidSymbolTarget = isCurrentEditorValid && !!file;
        }
        return { isValidSymbolTarget, leaf: activeLeaf, file, suggestion: null };
    }
    static getActiveSuggestionInfo(activeSuggestion) {
        let file = null, leaf = null, isValidSymbolTarget = false;
        if (activeSuggestion &&
            !isSymbolSuggestion(activeSuggestion) &&
            !isUnresolvedSuggestion(activeSuggestion) &&
            !isWorkspaceSuggestion(activeSuggestion)) {
            // Can't use a symbol, workspace, unresolved (non-existent file) suggestions as
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
    getSuggestions(inputInfo) {
        let suggestions = [];
        const push = (item, match) => {
            if (isSymbolInfo(item)) {
                suggestions.push({ type: 'symbol', item, match });
            }
            else if (!isWorkspaceInfo(item)) {
                // item is workspace leaf
                suggestions.push({ type: 'editor', item, match });
            }
        };
        if (inputInfo) {
            this.inputInfo = inputInfo;
            inputInfo.buildSearchQuery();
            const { hasSearchTerm, prepQuery } = inputInfo.searchQuery;
            if (inputInfo.mode === Mode.WorkspaceList) {
                suggestions = this.wsHandler.getSuggestions(inputInfo);
            }
            else {
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
        }
        return suggestions;
    }
    getItems(inputInfo) {
        let items = [];
        const { mode, searchQuery: { hasSearchTerm }, symbolCmd: { target }, } = inputInfo;
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
                const push = (symbols = [], symbolType) => {
                    symbols.forEach((symbol) => ret.push({ type: 'symbolInfo', symbol, symbolType }));
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
        if (isSymbolInfo(item)) {
            text = ModeHandler.getSuggestionTextForSymbol(item);
        }
        else if (!isWorkspaceInfo(item)) {
            // item is workspace leaf
            text = item.getDisplayText();
        }
        return text;
    }
    static getSuggestionTextForSymbol(symbolInfo) {
        const { symbol } = symbolInfo;
        let text;
        if (isHeadingCache(symbol)) {
            text = symbol.heading;
        }
        else if (isTagCache(symbol)) {
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
        const { symbolType, symbol } = symbolInfo;
        let indicator;
        if (isHeadingCache(symbol)) {
            indicator = HeadingIndicators[symbol.level];
        }
        else {
            indicator = SymbolIndicators[symbolType];
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
        this.registerCommand('switcher-plus:open-workspaces', 'Open in Workspaces Mode', Mode.WorkspaceList);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzLnRzIiwiLi4vLi4vc3JjL3NldHRpbmdzL3N3aXRjaGVyUGx1c1NldHRpbmdzLnRzIiwiLi4vLi4vc3JjL3NldHRpbmdzL3N3aXRjaGVyUGx1c1NldHRpbmdUYWIudHMiLCIuLi8uLi9zcmMvdHlwZXMvc2hhcmVkVHlwZXMudHMiLCIuLi8uLi9zcmMvSGFuZGxlcnMvd29ya3NwYWNlSGFuZGxlci50cyIsIi4uLy4uL3NyYy9zd2l0Y2hlclBsdXMvaW5wdXRJbmZvLnRzIiwiLi4vLi4vc3JjL3N3aXRjaGVyUGx1cy9tb2RlSGFuZGxlci50cyIsIi4uLy4uL3NyYy9zd2l0Y2hlclBsdXMva2V5bWFwLnRzIiwiLi4vLi4vc3JjL3N3aXRjaGVyUGx1cy9zd2l0Y2hlclBsdXMudHMiLCIuLi8uLi9zcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6bnVsbCwibmFtZXMiOlsiUGx1Z2luU2V0dGluZ1RhYiIsIlNldHRpbmciLCJmdXp6eVNlYXJjaCIsInNvcnRTZWFyY2hSZXN1bHRzIiwicmVuZGVyUmVzdWx0cyIsInByZXBhcmVRdWVyeSIsIlBsdWdpbiJdLCJtYXBwaW5ncyI6Ijs7OztTQWFnQixRQUFRLENBQ3RCLEdBQVksRUFDWixhQUFzQixFQUN0QixHQUFhO0lBRWIsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDO0lBRWhCLElBQUksR0FBRyxJQUFLLEdBQVMsQ0FBQyxhQUFhLENBQUMsS0FBSyxTQUFTLEVBQUU7UUFDbEQsR0FBRyxHQUFHLElBQUksQ0FBQztRQUNYLElBQUksR0FBRyxLQUFLLFNBQVMsSUFBSSxHQUFHLEtBQUssR0FBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFO1lBQ25ELEdBQUcsR0FBRyxLQUFLLENBQUM7U0FDYjtLQUNGO0lBRUQsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO1NBRWUsa0JBQWtCLENBQUMsR0FBWTtJQUM3QyxPQUFPLFFBQVEsQ0FBbUIsR0FBRyxFQUFFLE1BQU0s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
