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
            useActivePaneForSymbolsOnMobile: false,
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
    get useActivePaneForSymbolsOnMobile() {
        return this.data.useActivePaneForSymbolsOnMobile;
    }
    set useActivePaneForSymbolsOnMobile(value) {
        this.data.useActivePaneForSymbolsOnMobile = value;
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
        const savedData = (await plugin?.loadData());
        this.data = { ...SwitcherPlusSettings.defaultSettingsData, ...savedData };
    }
    async saveSettings() {
        const { plugin, data } = this;
        await plugin?.saveData(data);
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
        SwitcherPlusSettingTab.setUseActivePaneForSymbolsOnMobile(containerEl, settings);
    }
    static setWorkspaceModeSettingsGroup(containerEl, settings) {
        new obsidian.Setting(containerEl).setName('Workspace List Mode Settings').setHeading();
        SwitcherPlusSettingTab.setWorkspaceListCommand(containerEl, settings);
    }
    static saveChanges(settings) {
        settings.saveSettings().catch((e) => {
            console.log('Switcher++: error saving changes to settings');
            console.log(e);
        });
    }
    static setAlwaysNewPaneForSymbols(containerEl, settings) {
        new obsidian.Setting(containerEl)
            .setName('Open Symbols in new pane')
            .setDesc('Enabled, always open a new pane when navigating to Symbols. Disabled, navigate in an already open pane (if one exists)')
            .addToggle((toggle) => toggle.setValue(settings.alwaysNewPaneForSymbols).onChange((value) => {
            settings.alwaysNewPaneForSymbols = value;
            SwitcherPlusSettingTab.saveChanges(settings);
        }));
    }
    static setUseActivePaneForSymbolsOnMobile(containerEl, settings) {
        new obsidian.Setting(containerEl)
            .setName('Open Symbols in active pane on mobile devices')
            .setDesc('Enabled, navigate to the target file and symbol in the active editor pane. Disabled, open a new pane when navigating to Symbols, even on mobile devices.')
            .addToggle((toggle) => toggle.setValue(settings.useActivePaneForSymbolsOnMobile).onChange((value) => {
            settings.useActivePaneForSymbolsOnMobile = value;
            SwitcherPlusSettingTab.saveChanges(settings);
        }));
    }
    static setSymbolsInLineOrder(containerEl, settings) {
        new obsidian.Setting(containerEl)
            .setName('List symbols as indented outline')
            .setDesc('Enabled, symbols will be displayed in the (line) order they appear in the source text, indented under any preceding heading. Disabled, symbols will be grouped by type: Headings, Tags, Links, Embeds.')
            .addToggle((toggle) => toggle.setValue(settings.symbolsInlineOrder).onChange((value) => {
            settings.symbolsInlineOrder = value;
            SwitcherPlusSettingTab.saveChanges(settings);
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
            SwitcherPlusSettingTab.saveChanges(settings);
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
            SwitcherPlusSettingTab.saveChanges(settings);
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
            SwitcherPlusSettingTab.saveChanges(settings);
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
            SwitcherPlusSettingTab.saveChanges(settings);
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
    validateCommand(inputInfo, index, filterText) {
        const { workspaceCmd } = inputInfo;
        if (this.isWorkspacesPluginEnabled()) {
            inputInfo.mode = Mode.WorkspaceList;
            workspaceCmd.index = index;
            workspaceCmd.parsedInput = filterText;
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
        const info = new InputInfo(input);
        if (input.length === 0) {
            this.reset();
        }
        this.validatePrefixCommands(info);
        this.validateSymbolCommand(info, activeSuggestion, activeLeaf);
        return info;
    }
    validatePrefixCommands(info) {
        const { inputText } = info;
        const { editorListCommand, workspaceListCommand } = this.settings;
        const escEditorCmd = escapeRegExp(editorListCommand);
        const escWorkspaceCmd = escapeRegExp(workspaceListCommand);
        // account for potential overlapping command strings
        const prefixCmds = [`(?<ep>${escEditorCmd})`, `(?<wp>${escWorkspaceCmd})`].sort((a, b) => b.length - a.length);
        // regex that matches editor, workspace prefixes, and extract filter text
        // ^(?:(?<ep>edt )|(?<wp>+))(?<ft>.*)$
        const match = inputText.match(`^(?:${prefixCmds[0]}|${prefixCmds[1]})(?<ft>.*)$`);
        if (match?.groups) {
            const { index, groups: { ep, wp, ft }, } = match;
            if (ep) {
                this.validateEditorCommand(info, index, ft);
            }
            else if (wp) {
                this.wsHandler.validateCommand(info, index, ft);
            }
        }
    }
    validateEditorCommand(inputInfo, index, filterText) {
        const { editorCmd } = inputInfo;
        inputInfo.mode = Mode.EditorList;
        editorCmd.index = index;
        editorCmd.parsedInput = filterText;
        editorCmd.isValidated = true;
    }
    validateSymbolCommand(inputInfo, activeSuggestion, activeLeaf) {
        const { mode, symbolCmd, inputText } = inputInfo;
        // Both Standard and EditorList mode can have an embedded symbol command
        if (mode === Mode.Standard || mode === Mode.EditorList) {
            const { symbolListCommand } = this.settings;
            const escSymbolCmd = escapeRegExp(symbolListCommand);
            // regex that matches symbol command, and extract filter text
            // @(?<ft>.*)$
            const match = inputText.match(`${escSymbolCmd}(?<ft>.*)$`);
            if (match?.groups) {
                const { index, groups: { ft }, } = match;
                const target = this.getSymbolTarget(activeSuggestion, activeLeaf, index === 0);
                if (target) {
                    inputInfo.mode = Mode.SymbolList;
                    symbolCmd.target = target;
                    symbolCmd.index = index;
                    symbolCmd.parsedInput = ft;
                    symbolCmd.isValidated = true;
                }
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
        const { workspace, settings: { alwaysNewPaneForSymbols, useActivePaneForSymbolsOnMobile }, } = this;
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
        if (leaf && !alwaysNewPaneForSymbols) {
            this.activateEditorLeaf(leaf, true, eState);
        }
        else {
            const { isDesktop, isMobile } = obsidian.Platform;
            const createNewLeaf = isDesktop || (isMobile && !useActivePaneForSymbolsOnMobile);
            workspace
                .openLinkText(path, '', createNewLeaf, { eState })
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
            super.open();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzLnRzIiwiLi4vLi4vc3JjL3NldHRpbmdzL3N3aXRjaGVyUGx1c1NldHRpbmdzLnRzIiwiLi4vLi4vc3JjL3NldHRpbmdzL3N3aXRjaGVyUGx1c1NldHRpbmdUYWIudHMiLCIuLi8uLi9zcmMvdHlwZXMvc2hhcmVkVHlwZXMudHMiLCIuLi8uLi9zcmMvSGFuZGxlcnMvd29ya3NwYWNlSGFuZGxlci50cyIsIi4uLy4uL3NyYy9zd2l0Y2hlclBsdXMvaW5wdXRJbmZvLnRzIiwiLi4vLi4vc3JjL3N3aXRjaGVyUGx1cy9tb2RlSGFuZGxlci50cyIsIi4uLy4uL3NyYy9zd2l0Y2hlclBsdXMva2V5bWFwLnRzIiwiLi4vLi4vc3JjL3N3aXRjaGVyUGx1cy9zd2l0Y2hlclBsdXMudHMiLCIuLi8uLi9zcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6bnVsbCwibmFtZXMiOlsiUGx1Z2luU2V0dGluZ1RhYiIsIlNldHRpbmciLCJmdXp6eVNlYXJjaCIsInNvcnRTZWFyY2hSZXN1bHRzIiwicmVuZGVyUmVzdWx0cyIsInByZXBhcmVRdWVyeSIsIlBsYXRmb3JtIiwiUGx1Z2luIl0sIm1hcHBpbmdzIjoiOzs7O1NBYWdCLFFBQVEsQ0FDdEIsR0FBWSxFQUNaLGFBQXNCLEVBQ3RCLEdBQWE7SUFFYixJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUM7SUFFaEIsSUFBSSxHQUFHLElBQUssR0FBUyxDQUFDLGFBQWEsQ0FBQyxLQUFLLFNBQVMsRUFBRTtRQUNsRCxHQUFHLEdBQUcsSUFBSSxDQUFDO1FBQ1gsSUFBSSxHQUFHLEtBQUssU0FBUyxJQUFJLEdBQUcsS0FBSyxHQUFHLENBQUMsYUFBYSxDQUFDLEVBQUU7WUFDbkQsR0FBRyxHQUFHLEtBQUssQ0FBQztTQUNiO0tBQ0Y7SUFFRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7U0FFZSxrQkFBa0IsQ0FBQyxHQUFZO0lBQzdDLE9BQU8sUUFBUSxDQUFtQixHQUFH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
