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

//Taken from https://stackoverflow.com/a/3561711/10365494
function escapeRegex(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}
class TagHighlighter extends obsidian.Plugin {
    constructor() {
        super(...arguments);
        this._selectors = [];
    }
    get selectors() {
        if (!this._selectors.length ||
            this._selectors.length != this.data.tags.length) {
            this._selectors = this.data.tags.map(({ tag }) => `[href='#${tag}']`);
        }
        return this._selectors;
    }
    get selector() {
        return `a.tag:is(${this.selectors.join(",")})`;
    }
    get classes() {
        if (!this._classes.length ||
            this._classes.length != this.data.tags.length) {
            this._classes = this.data.tags.map(({ tag }) => `.cm-tag-${tag}`);
        }
        return this._classes;
    }
    get tags() {
        if (!this._tags.length || this._tags.length != this.data.tags.length) {
            this._tags = this.data.tags.map(({ tag }) => escapeRegex(tag));
        }
        return this._tags;
    }
    get regexp() {
        return new RegExp(`#(${this.tags.join("|")})`);
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.data);
            this._selectors = this.data.tags.map(({ tag }) => `[href='#${tag}']`);
            this._tags = this.data.tags.map(({ tag }) => tag);
            this._classes = this.data.tags.map(({ tag }) => `.cm-tag-${tag}`);
        });
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            let data = Object.assign({}, { tags: [], highlight: false }, yield this.loadData());
            this.data = data;
            this._selectors = this.data.tags.map(({ tag }) => `[href='#${tag}']`);
            this._tags = this.data.tags.map(({ tag }) => escapeRegex(tag));
            this._classes = this.data.tags.map(({ tag }) => `.cm-tag-${tag}`);
        });
    }
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Tag Highlighter v${this.manifest.version} loaded.`);
            yield this.loadSettings();
            this.addSettingTab(new CommentsSettings(this));
            this.registerMarkdownPostProcessor(this.postprocessor.bind(this));
            this.app.workspace.onLayoutReady(() => {
                this.registerCodeMirror((cm) => {
                    cm.on("renderLine", (instance, line, el) => {
                        if (!this.regexp.test(line.text))
                            return;
                        const [, tag] = line.text.match(this.regexp);
                        if (!tag || !this.data.tags.find((t) => t.tag == tag))
                            return;
                        this.setStyle(this.data.tags.find((t) => t.tag == tag), el.firstElementChild);
                    });
                });
            });
        });
    }
    postprocessor(el, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!el.querySelectorAll(this.selector).length)
                return;
            const nodes = el.querySelectorAll(this.selector);
            for (let node of Array.from(nodes)) {
                const href = node.getAttr("href");
                const tag = href.slice(1);
                if (!this.data.tags.find((t) => t.tag == tag))
                    continue;
                this.setStyle(this.data.tags.find((t) => t.tag == tag), node.parentElement);
            }
        });
    }
    setStyle(tag, el) {
        if (tag.highlight || (tag.highlight != false && this.data.highlight)) {
            el.setAttr("style", `color: var(--text-on-accent); background-color: ${tag.color}`);
        }
        else {
            el.setAttr("style", `color: ${tag.color}`);
        }
        el.addClasses(["tag-highlighter", `tag-highlighter-${tag.tag}`]);
    }
    onunload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Tag Highlighter unloaded");
        });
    }
}
class CommentsSettings extends obsidian.PluginSettingTab {
    constructor(plugin) {
        super(plugin.app, plugin);
        this.plugin = plugin;
    }
    display(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const containerEl = createDiv("tag-highlighter-settings");
            this.containerEl.empty();
            this.containerEl.appendChild(containerEl);
            containerEl.createEl("h2", { text: "Tag Highlighter Settings" });
            const additionalContainer = containerEl.createDiv("tag-highlighter-additional-container");
            new obsidian.Setting(additionalContainer)
                .setName("Manage Tags")
                .setDesc("Manage what tags will highlight and their associated colors.")
                .addButton((b) => b
                .setTooltip("Add Tag")
                .setButtonText("+")
                .onClick(() => __awaiter(this, void 0, void 0, function* () {
                this.display(Object.assign(Object.assign({}, (params !== null && params !== void 0 ? params : {})), { adding: true }));
            })));
            const additional = additionalContainer.createDiv("additional");
            if (!this.plugin.data.tags.length && !(params && params.adding)) {
                additional
                    .createDiv({
                    attr: {
                        style: "display: flex; justify-content: center; padding-bottom: 18px;"
                    }
                })
                    .createSpan({
                    text: "No saved tags! Create one to see it here."
                });
                return;
            }
            if (params && params.adding) {
                let text;
                new obsidian.Setting(createDiv()).addText((t) => {
                    t.setPlaceholder("Tag name");
                    text = t;
                });
                const setting = new obsidian.Setting(additional);
                setting.infoEl.appendChild(text.inputEl);
                const color = setting.controlEl.createEl("input", {
                    type: "color"
                });
                setting
                    .addButton((b) => b
                    .setIcon("checkmark")
                    .setTooltip("Save")
                    .onClick(() => __awaiter(this, void 0, void 0, function* () {
                    this.plugin.data.tags.push({
                        tag: text.inputEl.value,
                        color: color.value
                    });
                    yield this.plugin.saveSettings();
                    this.display(Object.assign(Object.assign({}, (params !== null && params !== void 0 ? params : {})), { adding: false }));
                })))
                    .addExtraButton((b) => b
                    .setIcon("cross")
                    .setTooltip("Cancel")
                    .onClick(() => {
                    this.display(Object.assign(Object.assign({}, (params !== null && params !== void 0 ? params : {})), { adding: false }));
                }));
            }
            for (let Tag of this.plugin.data.tags) {
                if (params && params.tag && params.tag == Tag.tag) {
                    let text;
                    new obsidian.Setting(createDiv()).addText((t) => {
                        t.setPlaceholder("Tag name").setValue(Tag.tag);
                        text = t;
                    });
                    const setting = new obsidian.Setting(additional);
                    setting.infoEl.appendChild(text.inputEl);
                    const color = setting.controlEl.createEl("input", {
                        type: "color",
                        value: Tag.color
                    });
                    setting
                        .addToggle((t) => {
                        t.setTooltip("Highlight")
                            .setValue(Tag.highlight)
                            .onChange((v) => __awaiter(this, void 0, void 0, function* () {
                            Tag.highlight = v;
                            yield this.plugin.saveSettings();
                            this.display(Object.assign(Object.assign({}, (params !== null && params !== void 0 ? params : {})), { tag: Tag.tag }));
                        }));
                    })
                        .addButton((b) => b
                        .setIcon("checkmark")
                        .setTooltip("Save")
                        .onClick(() => __awaiter(this, void 0, void 0, function* () {
                        Tag.tag = text.inputEl.value;
                        Tag.color = color.value;
                        yield this.plugin.saveSettings();
                        this.display(Object.assign(Object.assign({}, (params !== null && params !== void 0 ? params : {})), { tag: null }));
                    })))
                        .addExtraButton((b) => b
                        .setIcon("cross")
                        .setTooltip("Cancel")
                        .onClick(() => this.display(Object.assign(Object.assign({}, (params !== null && params !== void 0 ? params : {})), { tag: null }))));
                    continue;
                }
                const tagSetting = new obsidian.Setting(additional)
                    .setName(Tag.tag)
                    .addExtraButton((b) => b
                    .setIcon("pencil")
                    .setTooltip("Edit")
                    .onClick(() => {
                    this.display(Object.assign(Object.assign({}, (params !== null && params !== void 0 ? params : {})), { tag: Tag.tag }));
                }))
                    .addExtraButton((b) => b
                    .setIcon("trash")
                    .setTooltip("Delete")
                    .onClick(() => __awaiter(this, void 0, void 0, function* () {
                    this.plugin.data.tags =
                        this.plugin.data.tags.filter((tag) => tag.tag != Tag.tag);
                    yield this.plugin.saveSettings();
                    this.display(Object.assign({}, (params !== null && params !== void 0 ? params : {})));
                })));
                this.plugin.setStyle(Tag, tagSetting.nameEl);
            }
        });
    }
    onOpen() {
        this.display();
    }
}

module.exports = TagHighlighter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vRG9jdW1lbnRzL0dpdEh1Yi9QZXJzb25hbC90YWctaGlnaGxpZ2h0ZXIvbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uL0RvY3VtZW50cy9HaXRIdWIvUGVyc29uYWwvdGFnLWhpZ2hsaWdodGVyL3NyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpudWxsLCJuYW1lcyI6WyJQbHVnaW4iLCJQbHVnaW5TZXR0aW5nVGFiIiwiU2V0dGluZyJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF1REE7QUFDTyxTQUFTLFNBQVMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUU7QUFDN0QsSUFBSSxTQUFTLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEtBQUssWUFBWSxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLFVBQVUsT0FBTyxFQUFFLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7QUFDaEgsSUFBSSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDL0QsUUFBUSxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ25HLFFBQVEsU0FBUyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFT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
