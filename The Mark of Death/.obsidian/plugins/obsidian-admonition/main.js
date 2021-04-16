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

class AdmonitionSetting extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        return __awaiter(this, void 0, void 0, function* () {
            let { containerEl } = this;
            containerEl.empty();
            containerEl.createEl("h2", { text: "Admonition Settings" });
            new obsidian.Setting(containerEl)
                .setName("Add New")
                .setDesc("Add a new Admonition type.")
                .addButton((button) => {
                let b = button
                    .setTooltip("Add Additional")
                    .setButtonText("+")
                    .onClick(() => __awaiter(this, void 0, void 0, function* () {
                    let modal = new SettingsModal(this.app);
                    modal.open();
                }));
                return b;
            });
        });
    }
}
class SettingsModal extends obsidian.Modal {
    constructor(app) {
        super(app);
        this.color = "#7d7d7d";
        this.icon = "";
        this.title = "New Admonition";
    }
    display(el) {
        return __awaiter(this, void 0, void 0, function* () {
            let { contentEl } = this;
            contentEl.empty();
            const settingDiv = contentEl.createDiv();
            const previewEl = contentEl.createDiv({
                cls: "admonition",
                attr: {
                    style: `border-color: ${this.color};`
                }
            });
            const titleEl = previewEl.createDiv({
                cls: "admonition-title",
                text: this.title,
                attr: {
                    style: `background-color: ${this.color}10;`
                }
            });
            previewEl.createDiv().createEl("p", {
                cls: "admonition-content",
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et euismod nulla."
            });
            new obsidian.Setting(settingDiv)
                .setName("Admonition Title")
                .setDesc("This will be used as the admonition type (e.g., ad-note)")
                .addText((text) => {
                text.onChange((v) => {
                    this.title = v.length ? v : "New Admonition";
                    titleEl.textContent = this.title;
                });
                text.inputEl.id = "new_admonition_title";
                if (el && el === text.inputEl.id) {
                    text.inputEl.value = this.title;
                    text.inputEl.focus();
                }
            });
            new obsidian.Setting(settingDiv).setName("Admonition Icon").addText((text) => {
                text.onChange((v) => {
                    this.icon = v;
                    this.display("new_admonition_icon");
                });
                text.inputEl.id = "new_admonition_icon";
                if (el && el === text.inputEl.id) {
                    text.inputEl.focus();
                }
            });
            const color = new obsidian.Setting(settingDiv).setName("Color");
            color.controlEl.createEl("input", {
                type: "color",
                value: this.color
            }, (el) => {
                el.onchange = ({ target }) => {
                    this.color = target.value;
                    this.display();
                };
            });
            let footerEl = contentEl.createDiv();
            let footerButtons = new obsidian.Setting(footerEl);
            footerButtons.addButton((b) => {
                b.setTooltip("Save")
                    .setIcon("checkmark")
                    .onClick(() => __awaiter(this, void 0, void 0, function* () {
                    // Force refresh
                    this.close();
                }));
                return b;
            });
            footerButtons.addExtraButton((b) => {
                b.setIcon("cross")
                    .setTooltip("Cancel")
                    .onClick(() => {
                    this.close();
                });
                return b;
            });
        });
    }
    onOpen() {
        this.display();
    }
}

Object.fromEntries =
    Object.fromEntries ||
        /** Polyfill taken from https://github.com/tc39/proposal-object-from-entries/blob/master/polyfill.js */
        function (entries) {
            const obj = {};
            for (const pair of entries) {
                if (Object(pair) !== pair) {
                    throw new TypeError("iterable for fromEntries should yield objects");
                }
                // Consistency with Map: contract is that entry has "0" and "1" keys, not
                // that it is an array or iterable.
                const { "0": key, "1": val } = pair;
                Object.defineProperty(obj, key, {
                    configurable: true,
                    enumerable: true,
                    writable: true,
                    value: val
                });
            }
            return obj;
        };
const ADMONITION_MAP = {
    note: "note",
    seealso: "note",
    abstract: "abstract",
    summary: "abstract",
    info: "info",
    todo: "todo",
    tip: "tip",
    hint: "tip",
    important: "tip",
    success: "success",
    check: "check",
    done: "done",
    question: "question",
    help: "question",
    faq: "question",
    warning: "warning",
    caution: "warning",
    attention: "warning",
    failure: "failure",
    fail: "failure",
    missing: "failure",
    danger: "danger",
    error: "danger",
    bug: "bug",
    example: "example",
    quote: "quote",
    cite: "quote"
};
class ObsidianAdmonition extends obsidian.Plugin {
    constructor() {
        super(...arguments);
        this.admonitions = [];
    }
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Obsidian Admonition loaded");
            yield this.loadData();
            this.addSettingTab(new AdmonitionSetting(this.app, this));
            Object.keys(ADMONITION_MAP).forEach((type) => this.registerMarkdownCodeBlockProcessor(`ad-${type}`, this.postprocessor.bind(this, type)));
        });
    }
    postprocessor(type, src, el, ctx) {
        try {
            /**
             * Find title and collapse parameters.
             */
            let matchedParameters = src.match(/^\b(title|collapse)\b:([\s\S]*?)$/gm) || [];
            let params = Object.fromEntries(matchedParameters.map((p) => p.split(/:\s?/).map((s) => s.trim())));
            let { title = type[0].toUpperCase() + type.slice(1).toLowerCase(), collapse } = params;
            /**
             * Get the content. Content should be everything that is not the title or collapse parameters.
             * Remove any "content: " fields (legacy from < v0.2.0)
             */
            let content = src.replace(/^\b(title|collapse)\b:([\s\S]*?)$/gm, "");
            content = content.replace(/^\bcontent\b:\s?/gm, "");
            /**
             * If the admonition should collapse, but something other than open or closed was provided, set to closed.
             */
            if (Object.prototype.hasOwnProperty.call(params, "collapse") &&
                (params.collapse.length == 0 ||
                    params.collapse === undefined ||
                    collapse !== "open")) {
                collapse = "closed";
            }
            /**
             * If the admonition should collapse, but title was blanked, set the default title.
             */
            if (Object.prototype.hasOwnProperty.call(params, "title") &&
                (params.title === undefined || params.title.length === 0) &&
                collapse) {
                title = type[0].toUpperCase() + type.slice(1).toLowerCase();
                new obsidian.Notice("An admonition must have a title if it is collapsible.");
            }
            /**
             * Build the correct admonition element.
             * Collapsible -> <details> <summary> Title </summary> <div> Content </div> </details>
             * Regular -> <div> <div> Title </div> <div> Content </div> </div>
             */
            let admonitionElement = this.getAdmonitionElement(type, title, collapse);
            /**
             * Create a unloadable component.
             */
            let admonitionContent = admonitionElement.createDiv({
                cls: "admonition-content"
            });
            let markdownRenderChild = new obsidian.MarkdownRenderChild();
            markdownRenderChild.containerEl = admonitionElement;
            /**
             * Render the content as markdown and append it to the admonition.
             */
            obsidian.MarkdownRenderer.renderMarkdown(content, admonitionContent, ctx.sourcePath, markdownRenderChild);
            /**
             * Replace the <pre> tag with the new admonition.
             */
            el.replaceWith(admonitionElement);
        }
        catch (e) {
            console.error(e);
            const pre = createEl("pre");
            pre.createEl("code", {
                attr: {
                    style: `color: var(--text-error) !important`
                }
            }).createSpan({
                text: "There was an error rendering the admonition:" +
                    "\n\n" +
                    src
            });
            el.replaceWith(pre);
        }
    }
    getAdmonitionElement(type, title, collapse) {
        let admonition;
        if (collapse) {
            let attrs;
            if (collapse === "open") {
                attrs = { open: "open" };
            }
            else {
                attrs = {};
            }
            admonition = createEl("details", {
                cls: `admonition admonition-${type}`,
                attr: attrs
            });
            admonition.createEl("summary", {
                cls: `admonition-title ${!title.trim().length ? "no-title" : ""}`,
                text: title
            });
        }
        else {
            admonition = createDiv({
                cls: `admonition admonition-${type}`
            });
            admonition.createDiv({
                cls: `admonition-title ${!title.trim().length ? "no-title" : ""}`,
                text: title
            });
        }
        return admonition;
    }
    onunload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Obsidian Admonition unloaded");
        });
    }
}

module.exports = ObsidianAdmonition;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tYWRtb25pdGlvbi9ub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2LmpzIiwiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tYWRtb25pdGlvbi9zcmMvc2V0dGluZ3MudHMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1hZG1vbml0aW9uL3NyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpudWxsLCJuYW1lcyI6WyJQbHVnaW5TZXR0aW5nVGFiIiwiU2V0dGluZyIsIk1vZGFsIiwiUGx1Z2luIiwiTm90aWNlIiwiTWFya2Rvd25SZW5kZXJDaGlsZCIsIk1hcmtkb3duUmVuZGVyZXIiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBdURBO0FBQ08sU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQzdELElBQUksU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxLQUFLLFlBQVksQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxVQUFVLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQ2hILElBQUksT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQy9ELFFBQVEsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUNu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
