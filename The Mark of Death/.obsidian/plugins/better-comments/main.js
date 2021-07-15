/*
THIS IS A GENERATED/BUNDLED FILE BY ROLLUP
if you want to view the source visit the plugins github repository
*/

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
class BetterComments extends obsidian.Plugin {
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
            console.log(`Better Comments v${this.manifest.version} loaded.`);
            yield this.loadSettings();
            this.addSettingTab(new CommentsSettings(this));
            this.registerMarkdownPostProcessor(this.postprocessor.bind(this));
            this.app.workspace.onLayoutReady(() => {
                this.registerCodeMirror((cm) => {
                    cm.on("renderLine", (instance, line, el) => {
                        console.log("🚀 ~ file: main.ts ~ line 237 ~ this.regexp.test(line.text)", this.regexp, line.text);
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
        console.log("🚀 ~ file: main.ts ~ line 125 ~ tag.highlight", tag.highlight);
        if (tag.highlight || (tag.highlight != false && this.data.highlight)) {
            el.setAttr("style", `color: var(--text-on-accent); background-color: ${tag.color}`);
        }
        else {
            el.setAttr("style", `color: ${tag.color}`);
        }
        el.addClasses(["better-comments", `better-comments-${tag.tag}`]);
    }
    onunload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Better Comments unloaded");
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
            const containerEl = createDiv("better-comments-settings");
            containerEl.createEl("h2", { text: "Better Comments Settings" });
            const additionalContainer = containerEl.createDiv("better-comments-additional-container");
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
            if (!this.plugin.data.tags.length) {
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
            this.containerEl.empty();
            this.containerEl.appendChild(containerEl);
        });
    }
    onOpen() {
        this.display();
    }
}

module.exports = BetterComments;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vYmV0dGVyLWNvbW1lbnRzL25vZGVfbW9kdWxlcy90c2xpYi90c2xpYi5lczYuanMiLCIuLi8uLi8uLi8uLi8uLi9iZXR0ZXItY29tbWVudHMvc3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOm51bGwsIm5hbWVzIjpbIlBsdWdpbiIsIlBsdWdpblNldHRpbmdUYWIiLCJTZXR0aW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBdURBO0FBQ08sU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQzdELElBQUksU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxLQUFLLFlBQVksQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxVQUFVLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQ2hILElBQUksT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQy9ELFFBQVEsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUNuRyxRQUFRLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9B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
