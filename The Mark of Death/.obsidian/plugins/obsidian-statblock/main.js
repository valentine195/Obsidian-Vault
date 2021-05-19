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

class StatBlock {
    constructor(params) {
        let { name = "Name", size = "Medium", type = "Humanoid", alignment = "unaligned", ac, hp, speed, stats, imm, res, vulns, senses, cr = "—", languages = "—" } = Object.fromEntries(params);
        /** Build Structure */
        this.containerEl = createDiv("statblock");
        this.containerEl.createDiv("bar top");
        this.contentEl = this.containerEl.createDiv("content-wrap");
        this.containerEl.createDiv("bar bottom");
        /** Build Inner Blocks */
        // Name Block
        this.creatureHeadingEl = this.contentEl.createDiv("creature-heading");
        this.contentEl.createDiv("tapered-rule");
        // Top Stats ( ac, hp, speed )
        this.topStatsEl = this.contentEl.createDiv("top-stats");
        this.contentEl.createDiv("tapered-rule");
        // Ability Score Table
        this.abilityScoresEl = this.contentEl.createDiv("abilities");
        this.contentEl.createDiv("tapered-rule");
        // Additional Information
        // Immunities, resistances, senses, languages, cr
        this.informationEl = this.contentEl.createDiv("information");
        this.contentEl.createDiv("tapered-rule");
        this.buildName(name, size, type, alignment)
            .buildTopStats(ac, hp, speed)
            .buildAbilityScores(stats);
        if (imm) {
            this.buildProperty(this.informationEl, `Damage Immunities`, imm);
        }
        if (res) {
            this.buildProperty(this.informationEl, `Damage Resistances`, res);
        }
        if (vulns) {
            this.buildProperty(this.informationEl, `Damage Vulnerabilities`, vulns);
        }
        if (senses) {
            this.buildProperty(this.informationEl, `Senses`, senses);
        }
        this.buildProperty(this.informationEl, `Languages`, languages).buildProperty(this.informationEl, `Challenge`, cr);
        this.traitsEl = this.contentEl.createDiv("traits");
        this.actionsEl = this.contentEl.createDiv("actions");
        this.reactionsEl = this.contentEl.createDiv("reactions");
        const traits = params.filter(([v]) => v == "trait");
        const actions = params.filter(([v]) => v == "action");
        const reactions = params.filter(([v]) => v == "reaction");
        traits.forEach(([, trait]) => {
            try {
                let split = trait.trim().split(/::\s?/);
                console.log("🚀 ~ file: main.ts ~ line 74 ~ StatBlockPlugin ~ traits.forEach ~ split", split);
                this.buildPropertyBlock(this.traitsEl, split[0], split.slice(1).join(", "));
            }
            catch (e) { }
        });
        if (actions.length)
            this.createSectionHeader(this.actionsEl, "Actions");
        actions.forEach(([, action]) => {
            try {
                let split = action.trim().split(/::\s?/);
                this.buildPropertyBlock(this.actionsEl, split[0], split.slice(1).join(", "));
            }
            catch (e) { }
        });
        if (reactions.length)
            this.createSectionHeader(this.reactionsEl, "Reactions");
        reactions.forEach(([, reaction]) => {
            try {
                let split = reaction.trim().split(/::\s?/);
                this.buildPropertyBlock(this.reactionsEl, split[0], split.slice(1).join(", "));
            }
            catch (e) { }
        });
    }
    createSectionHeader(el, text) {
        el.createEl("h3", { cls: "section-header", text: text });
        return this;
    }
    buildAbilityScores(stats) {
        ["STR", "DEX", "CON", "INT", "WIS", "CHA"].forEach((stat) => {
            let el = this.abilityScoresEl.createDiv("ability-score");
            el.createEl("strong", { text: stat });
            el.createDiv({ text: `0 (+0)` });
        });
        return this;
    }
    buildName(name, size, type, alignment) {
        this.creatureHeadingEl.createDiv({ cls: "name", text: name });
        this.creatureHeadingEl.createDiv({
            cls: "subheading",
            text: `${size[0].toUpperCase() + size.slice(1).toLowerCase()} ${type}, ${alignment}`
        });
        return this;
    }
    buildTopStats(ac, hp, speed) {
        this.buildProperty(this.topStatsEl, `Armor Class`, ac)
            .buildProperty(this.topStatsEl, `Hit Points`, hp)
            .buildProperty(this.topStatsEl, `Speed`, speed);
        return this;
    }
    buildProperty(el, header, text) {
        const property = el.createDiv("property-line");
        property.createDiv({ cls: "property-name", text: header });
        property.createDiv({ cls: "property-text", text: text });
        return this;
    }
    buildPropertyBlock(el, header, text) {
        const property = el.createDiv("property");
        property.createDiv({ cls: "property-name", text: header });
        property.createDiv({ cls: "property-text", text: text });
        return this;
    }
}

class StatBlockPlugin extends obsidian.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("StatBlock plugin loaded");
            this.registerMarkdownCodeBlockProcessor("statblock", (source, el, ctx) => __awaiter(this, void 0, void 0, function* () {
                /** Get Parameters */
                let params = source
                    .split("\n")
                    .map((l) => l.split(/(?<!:):(?!:)\s?/));
                const statblock = new StatBlock(params);
                //let statblock = createDiv("statblock");
                console.log(el);
                el.replaceWith(statblock.containerEl);
            }));
        });
    }
    onunload() {
        console.log("StatBlock unloaded");
    }
}

module.exports = StatBlockPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tc3RhdGJsb2NrL25vZGVfbW9kdWxlcy90c2xpYi90c2xpYi5lczYuanMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1zdGF0YmxvY2svc3JjL3N0YXRibG9jay50cyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLXN0YXRibG9jay9zcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6bnVsbCwibmFtZXMiOlsiUGx1Z2luIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXVEQTtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDbkcsUUFBUSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENB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
