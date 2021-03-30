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

const { Prism } = window;
class LinksInCodeBlock extends obsidian.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Links in Code Blocks loaded");
            this.registerMarkdownPostProcessor(this.postprocessor.bind(this));
        });
    }
    postprocessor(el, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!el.querySelector('code[class*="language-links"]'))
                return;
            let blocks = el.querySelectorAll(`code[class*="language-links"]`);
            blocks.forEach((block) => {
                const pre = block.parentElement;
                pre.removeChild(block);
                let newBlock = pre.createEl("code");
                let larr = Array.prototype.join
                    .call(block.classList, "::")
                    .match(/language-links\|(\w+)(?:\:\:)?/);
                console.log("🚀 ~ file: main.ts ~ line 28 ~ LinksInCodeBlock ~ blocks.forEach ~ larr", larr);
                let innerHTML = block.innerHTML.split(/(\[\[[\s\S]+?\]\])/g);
                innerHTML.forEach((htmlBlock) => {
                    let code = createEl("code");
                    code.addClasses(Array.prototype.slice.call(block.classList));
                    if (/\[\[([\s\S]+)\]\]/.test(htmlBlock)) {
                        const [, link] = htmlBlock.match(/\[\[([\s\S]+)\]\]/);
                        const fileLink = this.app.metadataCache.getFirstLinkpathDest(link, link);
                        const div = createDiv();
                        if (fileLink && fileLink.path) {
                            div.createEl("a", {
                                attr: {
                                    "data-href": fileLink.path,
                                    href: fileLink.path,
                                    target: "_blank",
                                    rel: "noopener"
                                },
                                cls: "internal-link",
                                text: link
                            });
                        }
                        else {
                            div.createEl("a", {
                                attr: {
                                    "data-href": link,
                                    href: link,
                                    target: "_blank",
                                    rel: "noopener"
                                },
                                cls: "internal-link is-unresolved",
                                text: link
                            });
                        }
                        code.innerHTML = div.innerHTML;
                    }
                    else {
                        code.innerHTML = htmlBlock;
                        if (larr && larr.length && Prism) {
                            code.removeClass(`language-links|${larr[1]}`);
                            code.addClass(`language-${larr[1]}`);
                            Prism.highlightElement(code);
                        }
                    }
                    code.addClass("is-loaded");
                    newBlock.innerHTML += code.innerHTML;
                });
            });
        });
    }
    onunload() {
        console.log("Links in Code Blocks unloaded");
    }
}

module.exports = LinksInCodeBlock;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vbGlua3MtaW4tY29kZS1ibG9jay9ub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2LmpzIiwiLi4vLi4vLi4vLi4vLi4vbGlua3MtaW4tY29kZS1ibG9jay9zcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6bnVsbCwibmFtZXMiOlsiUGx1Z2luIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXVEQTtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDbkcsUUFBUSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FB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
