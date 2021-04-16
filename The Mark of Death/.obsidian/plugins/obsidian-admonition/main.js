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
                    .onClick(() => __awaiter(this, void 0, void 0, function* () { }));
                return b;
            });
        });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tYWRtb25pdGlvbi9ub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2LmpzIiwiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tYWRtb25pdGlvbi9zcmMvc2V0dGluZ3MudHMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1hZG1vbml0aW9uL3NyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpudWxsLCJuYW1lcyI6WyJQbHVnaW5TZXR0aW5nVGFiIiwiU2V0dGluZyIsIlBsdWdpbiIsIk5vdGljZSIsIk1hcmtkb3duUmVuZGVyQ2hpbGQiLCJNYXJrZG93blJlbmRlcmVyIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXVEQTtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDbkcsUUFBUSxT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
