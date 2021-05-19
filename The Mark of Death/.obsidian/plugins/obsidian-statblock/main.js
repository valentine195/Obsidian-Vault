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

class StatBlockPlugin extends obsidian.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("StatBlock plugin loaded");
            this.registerMarkdownCodeBlockProcessor("statblock", (source, el, ctx) => __awaiter(this, void 0, void 0, function* () {
                /** Get Parameters */
                let params = 
                /* Object.fromEntries( */
                source.split("\n").map((l) => l.split(/:\s?/));
                /* ); */
                let { name = "Name", size = "Medium", type = "Humanoid", alignment = "unaligned", ac, hp, speed, stats, imm, res, vulns, senses, cr = "—", languages = "—" } = Object.fromEntries(params);
                let statblock = createDiv("statblock");
                statblock.createDiv("bar");
                let content = statblock.createDiv("content-wrap");
                this.buildName(content, name, size, type, alignment)
                    .taperedRule(content)
                    .getTopStats(content, ac, hp, speed)
                    .taperedRule(content)
                    .buildStats(content, stats)
                    .taperedRule(content);
                if (imm) {
                    this.createProperty(content, `Damage Immunities`, imm);
                }
                if (res) {
                    this.createProperty(content, `Damage Resistances`, res);
                }
                if (vulns) {
                    this.createProperty(content, `Damage Vulnerabilities`, vulns);
                }
                if (senses) {
                    this.createProperty(content, `Senses`, senses);
                }
                this.createProperty(content, `Languages`, languages)
                    .createProperty(content, `Challenge`, cr)
                    .taperedRule(content);
                const traits = params.filter(([v]) => v == "trait");
                const actions = params.filter(([v]) => v == "action");
                const reactions = params.filter(([v]) => v == "reaction");
                traits.forEach(([, trait]) => {
                    try {
                        let { name, text } = JSON.parse(trait);
                        this.createPropertyBlock(content, name, text);
                    }
                    catch (e) { }
                });
                if (actions.length)
                    this.createSectionHeader(content, "Actions");
                actions.forEach(([, trait]) => {
                    try {
                        let { name, text } = JSON.parse(trait);
                        this.createPropertyBlock(content, name, text);
                    }
                    catch (e) { }
                });
                if (reactions.length)
                    this.createSectionHeader(content, "Reactions");
                reactions.forEach(([, trait]) => {
                    try {
                        let { name, text } = JSON.parse(trait);
                        this.createPropertyBlock(content, name, text);
                    }
                    catch (e) { }
                });
                statblock.createDiv("bar");
                el.replaceWith(statblock);
            }));
        });
    }
    createSectionHeader(content, text) {
        content.createEl("h3", { cls: "section-header", text: text });
        return this;
    }
    buildStats(statblock, stats) {
        const statsElement = statblock.createDiv("abilities");
        ["STR", "DEX", "CON", "INT", "WIS", "CHA"].forEach((stat) => {
            let el = statsElement.createDiv("ability-score");
            el.createEl("strong", { text: stat });
            el.createDiv({ text: `0 (+0)` });
        });
        return this;
    }
    buildName(statblock, name, size, type, alignment) {
        const nameElement = statblock.createDiv("creature-heading");
        nameElement.createEl("h1", { text: name });
        nameElement.createEl("h2", {
            text: `${size[0].toUpperCase() + size.slice(1).toLowerCase()} ${type}, ${alignment}`
        });
        return this;
    }
    taperedRule(statblock) {
        statblock.createDiv("tapered-rule");
        return this;
    }
    getTopStats(statblock, ac, hp, speed) {
        this.createProperty(statblock, `Armor Class`, ac)
            .createProperty(statblock, `Hit Points`, hp)
            .createProperty(statblock, `Speed`, speed);
        return this;
    }
    createProperty(el, header, text) {
        const property = el.createDiv("property-line");
        property.createEl("h4", { text: header });
        property.createEl("p", { text: text });
        return this;
    }
    createPropertyBlock(el, header, text) {
        const property = el.createDiv("property");
        property.createEl("h4", { text: header });
        property.createEl("p", { text: text });
        return this;
    }
    onunload() {
        console.log("StatBlock unloaded");
    }
}

module.exports = StatBlockPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tc3RhdGJsb2NrL25vZGVfbW9kdWxlcy90c2xpYi90c2xpYi5lczYuanMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1zdGF0YmxvY2svc3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOm51bGwsIm5hbWVzIjpbIlBsdWdpbiJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF1REE7QUFDTyxTQUFTLFNBQVMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUU7QUFDN0QsSUFBSSxTQUFTLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEtBQUssWUFBWSxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLFVBQVUsT0FBTyxFQUFFLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7QUFDaEgsSUFBSSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDL0QsUUFBUSxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ25HLFFBQVEsU0FBUyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMs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
