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
        this.newAdmonition = {
            title: "",
            icon: "",
            color: ""
        };
    }
    display() {
        return __awaiter(this, void 0, void 0, function* () {
            let { contentEl } = this;
            contentEl.empty();
            let settingDiv = contentEl.createDiv();
            new obsidian.Setting(settingDiv)
                .setName("Admonition Title")
                .addText((text) => {
                text.onChange((v) => (this.newAdmonition.title = v));
            });
            new obsidian.Setting(settingDiv)
                .setName("Admonition Icon")
                .addText((text) => {
                text.onChange((v) => (this.newAdmonition.icon = v));
            });
            let color = new obsidian.Setting(settingDiv).setName("Color");
            color.controlEl.createEl("input", {
                type: "color"
            });
            contentEl.createDiv();
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
