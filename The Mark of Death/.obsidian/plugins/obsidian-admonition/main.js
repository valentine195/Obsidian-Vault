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
                    .setIcon("create-new")
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
        console.log("Obsidian Admonition unloaded");
    }
}

module.exports = ObsidianAdmonition;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tYWRtb25pdGlvbi9ub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2LmpzIiwiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tYWRtb25pdGlvbi9zcmMvc2V0dGluZ3MudHMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1hZG1vbml0aW9uL3NyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpudWxsLCJuYW1lcyI6WyJQbHVnaW5TZXR0aW5nVGFiIiwiU2V0dGluZyIsIlBsdWdpbiIsIk5vdGljZSIsIk1hcmtkb3duUmVuZGVyQ2hpbGQiLCJNYXJrZG93blJlbmRlcmVyIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXVEQTtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDbkcsUUFBUSxT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
