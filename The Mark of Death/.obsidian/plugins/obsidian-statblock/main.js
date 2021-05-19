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
                source.split("\n").map((l) => l.split(/(?<!:):(?!:)\s?/));
                /* ); */
                console.log("🚀 ~ file: main.ts ~ line 13 ~ StatBlockPlugin ~ params", params);
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
                console.log("🚀 ~ file: main.ts ~ line 64 ~ StatBlockPlugin ~ traits", traits);
                const actions = params.filter(([v]) => v == "action");
                const reactions = params.filter(([v]) => v == "reaction");
                traits.forEach(([, trait]) => {
                    try {
                        let split = trait.trim().split(/::\s?/);
                        console.log("🚀 ~ file: main.ts ~ line 74 ~ StatBlockPlugin ~ traits.forEach ~ split", split);
                        this.createPropertyBlock(content, split[0], split.slice(1).join(", "));
                    }
                    catch (e) { }
                });
                if (actions.length)
                    this.createSectionHeader(content, "Actions");
                actions.forEach(([, action]) => {
                    try {
                        let split = action.trim().split(/::\s?/);
                        console.log("🚀 ~ file: main.ts ~ line 74 ~ StatBlockPlugin ~ traits.forEach ~ split", split);
                        this.createPropertyBlock(content, split[0], split.slice(1).join(", "));
                    }
                    catch (e) { }
                });
                if (reactions.length)
                    this.createSectionHeader(content, "Reactions");
                reactions.forEach(([, reaction]) => {
                    try {
                        let split = reaction.trim().split(/::\s?/);
                        console.log("🚀 ~ file: main.ts ~ line 74 ~ StatBlockPlugin ~ traits.forEach ~ split", split);
                        this.createPropertyBlock(content, split[0], split.slice(1).join(", "));
                    }
                    catch (e) { }
                });
                statblock.createDiv("bar");
                console.log(el);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tc3RhdGJsb2NrL25vZGVfbW9kdWxlcy90c2xpYi90c2xpYi5lczYuanMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1zdGF0YmxvY2svc3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOm51bGwsIm5hbWVzIjpbIlBsdWdpbiJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF1REE7QUFDTyxTQUFTLFNBQVMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUU7QUFDN0QsSUFBSSxTQUFTLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEtBQUssWUFBWSxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLFVBQVUsT0FBTyxFQUFFLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7QUFDaEgsSUFBSSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDL0QsUUFBUSxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ25HLFFBQVEsU0FBUyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ3RHLFFBQVEsU0FBUyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFO0FBQ3RILFFBQVEsSUFBSSxDQUFDLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLFVBQVUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzlFLEtBQUssQ0FBQyxDQUFDO0FBQ1A7O01DMUVxQixlQUFnQixTQUFRQSxlQUFNO0lBQ3pDLE1BQU07O1lBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1lBRXZDLElBQUksQ0FBQyxrQ0FBa0MsQ0FDbkMsV0FBVyxFQUNYLENBQU8sTUFBTSxFQUFFLEVBQUUsRUFBRSxHQUFHOztnQkFFbEIsSUFBSSxNQUFNOztnQkFFTixNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQzs7Z0JBRTlELE9BQU8sQ0FBQyxHQUFHLENBQ1AseURBQXlELEVBQ3pELE1BQU0sQ0FDVCxDQUFDO2dCQUNGLElBQUksRUFDQSxJQUFJLEdBQUcsTUFBTSxFQUNiLElBQUksR0FBRyxRQUFRLEVBQ2YsSUFBSSxHQUFHLFVBQVUsRUFDakIsU0FBUyxHQUFHLFdBQVcsRUFDdkIsRUFBRSxFQUNGLEVBQUUsRUFDRixLQUFLLEVBQ0wsS0FBSyxFQUNMLEdBQUcsRUFDSCxHQUFHLEVBQ0gsS0FBSyxFQUNMLE1BQU0sRUFDTixFQUFFLEdBQUcsR0FBRyxFQUNSLFNBQVMsR0FBRyxHQUFHLEVBQ2xCLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFFL0IsSUFBSSxTQUFTLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUN2QyxTQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMzQixJQUFJLE9BQU8sR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUVsRCxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLENBQUM7cUJBQy9DLFdBQVcsQ0FBQyxPQUFPLENBQUM7cUJBQ3BCLFdBQVcsQ0FBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUM7cUJBQ25DLFdBQVcsQ0FBQyxPQUFPLENBQUM7cUJBQ3BCLFVBQVUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDO3FCQUMxQixXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQzFCLElBQUksR0FBRyxFQUFFO29CQUNMLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLEdBQUcsQ0FBQyxDQUFDO2lCQUMxRDtnQkFDRCxJQUFJLEdBQUcsRUFBRTtvQkFDTCxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxHQUFHLENBQUMsQ0FBQztpQkFDM0Q7Z0JBQ0QsSUFBSSxLQUFLLEVBQUU7b0JBQ1AsSUFBSSxDQUFDLGNBQWMsQ0FDZixPQUFPLEVBQ1Asd0JBQXdCLEVBQ3hCLEtBQUssQ0FDUixDQUFDO2lCQUNMO2dCQUNELElBQUksTUFBTSxFQUFFO29CQUNSLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztpQkFDbEQ7Z0JBQ0QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLFNBQVMsQ0FBQztxQkFDL0MsY0FBYyxDQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsRUFBRSxDQUFDO3FCQUN4QyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBRTFCLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQztnQkFDcEQsT0FBTyxDQUFDLEdBQUcsQ0FDUCx5REFBeUQsRUFDekQsTUFBTSxDQUNULENBQUM7Z0JBQ0YsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDO2dCQUN0RCxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksVUFBVSxDQUFDLENBQUM7Z0JBRTFELE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztvQkFDckIsSUFBSTt3QkFDQSxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO3dCQUN4QyxPQUFPLENBQUMsR0FBRyxDQUNQLHlFQUF5RSxFQUN6RSxLQUFLLENBQ1IsQ0FBQzt3QkFDRixJQUFJLENBQUMsbUJBQW1CLENBQ3BCLE9BQU8sRUFDUCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQ1IsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQzVCLENBQUM7cUJBQ0w7b0JBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRTtpQkFDakIsQ0FBQyxDQUFDO2dCQUNILElBQUksT0FBTyxDQUFDLE1BQU07b0JBQ2QsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDakQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO29CQUN2QixJQUFJO3dCQUNBLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7d0JBQ3pDLE9BQU8sQ0FBQyxHQUFHLENBQ1AseUVBQXlFLEVBQ3pFLEtBQUssQ0FDUixDQUFDO3dCQUNGLElBQUksQ0FBQyxtQkFBbUIsQ0FDcEIsT0FBTyxFQUNQLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFDUixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FDNUIsQ0FBQztxQkFDTDtvQkFBQyxPQUFPLENBQUMsRUFBRSxHQUFFO2lCQUNqQixDQUFDLENBQUM7Z0JBQ0gsSUFBSSxTQUFTLENBQUMsTUFBTTtvQkFDaEIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFDbkQsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDO29CQUMzQixJQUFJO3dCQUNBLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7d0JBQzNDLE9BQU8sQ0FBQyxHQUFHLENBQ1AseUVBQXlFLEVBQ3pFLEtBQUssQ0FDUixDQUFDO3dCQUNGLElBQUksQ0FBQyxtQkFBbUIsQ0FDcEIsT0FBTyxFQUNQLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFDUixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FDNUIsQ0FBQztxQkFDTDtvQkFBQyxPQUFPLENBQUMsRUFBRSxHQUFFO2lCQUNqQixDQUFDLENBQUM7Z0JBRUgsU0FBUyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDaEIsRUFBRSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUM3QixDQUFBLENBQ0osQ0FBQztTQUNMO0tBQUE7SUFDRCxtQkFBbUIsQ0FBQyxPQUF1QixFQUFFLElBQVk7UUFDckQsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxHQUFHLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDOUQsT0FBTyxJQUFJLENBQUM7S0FDZjtJQUNELFVBQVUsQ0FBQyxTQUF5QixFQUFFLEtBQVU7UUFDNUMsTUFBTSxZQUFZLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN0RCxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSTtZQUNwRCxJQUFJLEVBQUUsR0FBRyxZQUFZLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ2pELEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7WUFDdEMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1NBQ3BDLENBQUMsQ0FBQztRQUNILE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFDRCxTQUFTLENBQ0wsU0FBeUIsRUFDekIsSUFBWSxFQUNaLElBQVksRUFDWixJQUFZLEVBQ1osU0FBaUI7UUFFakIsTUFBTSxXQUFXLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQzVELFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDM0MsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUU7WUFDdkIsSUFBSSxFQUFFLEdBQ0YsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUNyRCxJQUFJLElBQUksS0FBSyxTQUFTLEVBQUU7U0FDM0IsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxJQUFJLENBQUM7S0FDZjtJQUNELFdBQVcsQ0FBQyxTQUFzQjtRQUM5QixTQUFTLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRXBDLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFDRCxXQUFXLENBQUMsU0FBc0IsRUFBRSxFQUFVLEVBQUUsRUFBVSxFQUFFLEtBQWE7UUFDckUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsYUFBYSxFQUFFLEVBQUUsQ0FBQzthQUM1QyxjQUFjLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxFQUFFLENBQUM7YUFDM0MsY0FBYyxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDL0MsT0FBTyxJQUFJLENBQUM7S0FDZjtJQUNELGNBQWMsQ0FBQyxFQUFlLEVBQUUsTUFBYyxFQUFFLElBQVk7UUFDeEQsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUMvQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQzFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDdkMsT0FBTyxJQUFJLENBQUM7S0FDZjtJQUNELG1CQUFtQixDQUFDLEVBQWUsRUFBRSxNQUFjLEVBQUUsSUFBWTtRQUM3RCxNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDMUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUN2QyxPQUFPLElBQUksQ0FBQztLQUNmO0lBQ0QsUUFBUTtRQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztLQUNyQzs7Ozs7In0=
