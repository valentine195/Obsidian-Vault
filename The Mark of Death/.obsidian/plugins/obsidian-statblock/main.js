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
                let { name = "Name", size = "Medium", type = "Humanoid", alignment = "unaligned", ac, hp, speed, stats, imm, res, vulns, senses, cr = "—", languages = "—" } = Object.fromEntries(source.split("\n").map((l) => l.split(/:\s?/)));
                let statblock = createDiv("statblock");
                statblock.createDiv("bar");
                let content = statblock.createDiv("content-wrap");
                this.buildName(content, name, size, type, alignment)
                    .taperedRule(content)
                    .getACHPSPEED(content, ac, hp, speed)
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
                statblock.createDiv("bar");
                el.replaceWith(statblock);
            }));
        });
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
    getACHPSPEED(statblock, ac, hp, speed) {
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
    onunload() {
        console.log("StatBlock unloaded");
    }
}

module.exports = StatBlockPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tc3RhdGJsb2NrL25vZGVfbW9kdWxlcy90c2xpYi90c2xpYi5lczYuanMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1zdGF0YmxvY2svc3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOm51bGwsIm5hbWVzIjpbIlBsdWdpbiJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF1REE7QUFDTyxTQUFTLFNBQVMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUU7QUFDN0QsSUFBSSxTQUFTLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEtBQUssWUFBWSxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLFVBQVUsT0FBTyxFQUFFLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7QUFDaEgsSUFBSSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDL0QsUUFBUSxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ25HLFFBQVEsU0FBUyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMs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
