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

function createCustomElement(name, contentNode, elementClass = null) {
    if (customElements.get(name))
        return;
    if (elementClass === null) {
        customElements.define(name, class extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: "open" }).appendChild(contentNode.cloneNode(true));
            }
        });
    }
    else {
        customElements.define(name, elementClass(contentNode));
    }
}

// Inline extraction START
function abilityModifier(abilityScore) {
    let score = parseInt(abilityScore, 10);
    return Math.floor((score - 10) / 2);
}
function formattedModifier(abilityModifier) {
    if (abilityModifier >= 0) {
        return "+" + abilityModifier;
    }
    // This is an en dash, NOT a "normal" dash. The minus sign needs to be more
    // visible.
    return "–" + Math.abs(abilityModifier);
}
function abilityText(abilityScore) {
    return [
        String(abilityScore),
        " (",
        formattedModifier(abilityModifier(abilityScore)),
        ")"
    ].join("");
}
function elementClass(contentNode) {
    return class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: "open" }).appendChild(contentNode.cloneNode(true));
        }
        connectedCallback() {
            let root = this.shadowRoot;
            for (let i = 0; i < this.attributes.length; i++) {
                let attribute = this.attributes[i];
                let abilityShortName = attribute.name.split("-")[1];
                root.getElementById(abilityShortName).textContent = abilityText(attribute.value);
            }
        }
    };
}
// Inline extraction END
const HTML_CONTENT$6 = `<style>
  table {
    width: 100%;
    border: 0px;
    border-collapse: collapse;
  }
  th, td {
    width: 50px;
    text-align: center;
  }
</style>
<statblock-plugin-tapered-rule></statblock-plugin-tapered-rule>
<table>
  <tr>
    <th>STR</th>
    <th>DEX</th>
    <th>CON</th>
    <th>INT</th>
    <th>WIS</th>
    <th>CHA</th>
  </tr>
  <tr>
    <td id="str"></td>
    <td id="dex"></td>
    <td id="con"></td>
    <td id="int"></td>
    <td id="wis"></td>
    <td id="cha"></td>
  </tr>
</table>
<statblock-plugin-tapered-rule></statblock-plugin-tapered-rule>`;
const AbilityBlock = () => __awaiter(void 0, void 0, void 0, function* () {
    let contentNode = document
        .createRange()
        .createContextualFragment(HTML_CONTENT$6);
    createCustomElement("statblock-plugin-abilities", contentNode, elementClass);
});

const HTML_CONTENT$5 = `<style>
  ::slotted(h1) {
    font-family: 'Libre Baskerville', 'Lora', 'Calisto MT',
                 'Bookman Old Style', Bookman, 'Goudy Old Style',
                 Garamond, 'Hoefler Text', 'Bitstream Charter',
                 Georgia, serif;
    color: #7A200D;
    font-weight: 700;
    margin: 0px;
    font-size: 23px;
    letter-spacing: 1px;
    font-variant: small-caps;
  }

  ::slotted(h2) {
    font-weight: normal;
    font-style: italic;
    font-size: 12px;
    margin: 0;
  }
</style>
<slot></slot>
`;
const CreatureHeading = () => __awaiter(void 0, void 0, void 0, function* () {
    let contentNode = document
        .createRange()
        .createContextualFragment(HTML_CONTENT$5);
    createCustomElement("statblock-plugin-creature-heading", contentNode);
});

const HTML_CONTENT$4 = `<style>
  :host {
    margin-top: 0.3em;
    margin-bottom: 0.9em;
    line-height: 1.5;
    display: block;
  }

  ::slotted(h4) {
    margin: 0;
    display: inline;
    font-weight: bold;
    font-style: italic;
  }

  ::slotted(p:first-of-type) {
    display: inline;
    text-indent: 0;
  }

  ::slotted(p) {
    text-indent: 1em;
    margin: 0;
  }
</style>
<slot></slot>
`;
const PropertyBlocks = () => __awaiter(void 0, void 0, void 0, function* () {
    let contentNode = document
        .createRange()
        .createContextualFragment(HTML_CONTENT$4);
    createCustomElement("statblock-plugin-property-block", contentNode);
});

const HTML_CONTENT$3 = `<style>
  :host {
    line-height: 1.4;
    display: block;
    text-indent: -1em;
    padding-left: 1em;
  }

  ::slotted(h4) {
    margin: 0;
    display: inline;
    font-weight: bold;
  }

  ::slotted(p:first-of-type) {
    display: inline;
    text-indent: 0;
  }

  ::slotted(p) {
    text-indent: 1em;
    margin: 0;
  }
</style>
<slot></slot>

`;
const PropertyLine = () => __awaiter(void 0, void 0, void 0, function* () {
    let contentNode = document
        .createRange()
        .createContextualFragment(HTML_CONTENT$3);
    createCustomElement("statblock-plugin-property-line", contentNode);
});

const HTML_CONTENT$2 = `<style>
  .bar {
    height: 5px;
    background: #E69A28;
    border: 1px solid #000;
    position: relative;
    z-index: 1;
  }

  :host {
    display: inline-block;
  }

  #content-wrap {
    font-family: 'Noto Sans', 'Myriad Pro', Calibri, Helvetica, Arial,
                  sans-serif;
    font-size: 13.5px;
    background: #FDF1DC;
    padding: 0.6em;
    padding-bottom: 0.5em;
    border: 1px #DDD solid;
    box-shadow: 0 0 1.5em #867453;

    /* We don't want the box-shadow in front of the bar divs. */
    position: relative;
    z-index: 0;

    /* Leaving room for the two bars to protrude outwards */
    margin-left: 2px;
    margin-right: 2px;

    /* This is possibly overriden by next CSS rule. */
    width: 400px;

    -webkit-columns: 400px;
       -moz-columns: 400px;
            columns: 400px;
    -webkit-column-gap: 40px;
       -moz-column-gap: 40px;
            column-gap: 40px;

    /* We can't use CSS3 attr() here because no browser currently supports it,
       but we can use a CSS custom property instead. */
    height: var(--data-content-height);

    /* When height is constrained, we want sequential filling of columns. */
    -webkit-column-fill: auto;
       -moz-column-fill: auto;
            column-fill: auto;
  }

  :host([data-two-column]) #content-wrap {
    /* One column is 400px and the gap between them is 40px. */
    width: 840px;
  }

  ::slotted(h3) {
    border-bottom: 1px solid #7A200D;
    color: #7A200D;
    font-size: 21px;
    font-variant: small-caps;
    font-weight: normal;
    letter-spacing: 1px;
    margin: 0;
    margin-bottom: 0.3em;

    break-inside: avoid-column;
    break-after: avoid-column;
  }

  /* For user-level p elems. */
  ::slotted(p) {
    margin-top: 0.3em;
    margin-bottom: 0.9em;
    line-height: 1.5;
  }

  /* Last child shouldn't have bottom margin, too much white space. */
  ::slotted(*:last-child) {
    margin-bottom: 0;
  }
</style>
<div class="bar"></div>
<div id="content-wrap">
  <slot></slot>
</div>
<div class="bar"></div>
`;
const StatBlock = () => __awaiter(void 0, void 0, void 0, function* () {
    let contentNode = document
        .createRange()
        .createContextualFragment(HTML_CONTENT$2);
    createCustomElement("statblock-plugin-stat-block", contentNode);
});

const HTML_CONTENT$1 = `<style>
  svg {
    fill: #922610;
    /* Stroke is necessary for good antialiasing in Chrome. */
    stroke: #922610;
    margin-top: 0.6em;
    margin-bottom: 0.35em;
  }
</style>
<svg height="5" width="400">
  <polyline points="0,0 400,2.5 0,5"/>
</svg>

`;
const TaperedRule = () => __awaiter(void 0, void 0, void 0, function* () {
    let contentNode = document
        .createRange()
        .createContextualFragment(HTML_CONTENT$1);
    createCustomElement("statblock-plugin-tapered-rule", contentNode);
});

const HTML_CONTENT = `<style>
  ::slotted(*) {
    color: #7A200D;
  }
</style>

<statblock-plugin-tapered-rule></statblock-plugin-tapered-rule>
<slot></slot>
<statblock-plugin-tapered-rule></statblock-plugin-tapered-rule>
`;
const TopStats = () => __awaiter(void 0, void 0, void 0, function* () {
    let contentNode = document
        .createRange()
        .createContextualFragment(HTML_CONTENT);
    createCustomElement("statblock-plugin-top-stats", contentNode);
});

class StatBlockPlugin extends obsidian.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("StatBlock plugin loaded");
            yield AbilityBlock();
            yield CreatureHeading();
            yield PropertyBlocks();
            yield PropertyLine();
            yield StatBlock();
            yield TaperedRule();
            yield TopStats();
            this.registerMarkdownCodeBlockProcessor("statblock", (source, el, ctx) => __awaiter(this, void 0, void 0, function* () {
                /** Get Parameters */
                Object.fromEntries(source.split("\n").map((l) => l.split(/:\s?/)));
            }));
        });
    }
    onunload() {
        console.log("StatBlock unloaded");
    }
}

module.exports = StatBlockPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tc3RhdGJsb2NrL25vZGVfbW9kdWxlcy90c2xpYi90c2xpYi5lczYuanMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1zdGF0YmxvY2svc3JjL2VsZW1lbnRzL2hlbHBlcnMvY3JlYXRlLWN1c3RvbS1lbGVtZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tc3RhdGJsb2NrL3NyYy9lbGVtZW50cy9hYmlsaXRpZXMtYmxvY2sudHMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1zdGF0YmxvY2svc3JjL2VsZW1lbnRzL2NyZWF0dXJlLWhlYWRpbmcudHMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1zdGF0YmxvY2svc3JjL2VsZW1lbnRzL3Byb3BlcnR5LWJsb2NrLnRzIiwiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tc3RhdGJsb2NrL3NyYy9lbGVtZW50cy9wcm9wZXJ0eS1saW5lLnRzIiwiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tc3RhdGJsb2NrL3NyYy9lbGVtZW50cy9zdGF0LWJsb2NrLnRzIiwiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tc3RhdGJsb2NrL3NyYy9lbGVtZW50cy90YXBlcmVkLXJ1bGUudHMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1zdGF0YmxvY2svc3JjL2VsZW1lbnRzL3RvcC1zdGF0cy50cyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLXN0YXRibG9jay9zcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6bnVsbCwibmFtZXMiOlsiSFRNTF9DT05URU5UIiwiUGx1Z2luIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXVEQTtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDbkcsUUFBUSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDdEcsUUFBUSxTQUFTLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUU7QUFDdEgsUUFBUSxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsVUFBVSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDOUUsS0FBSyxDQUFDLENBQUM7QUFDUDs7U0M3RWdCLG1CQUFtQixDQUMvQixJQUFZLEVBQ1osV0FBaUIsRUFDakIsZUFBeUIsSUFBSTtJQUU3QixJQUFJLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO1FBQUUsT0FBTztJQUNyQyxJQUFJLFlBQVksS0FBSyxJQUFJLEVBQUU7UUFDdkIsY0FBYyxDQUFDLE1BQU0sQ0FDakIsSUFBSSxFQUNKLGNBQWMsV0FBVztZQUNyQjtnQkFDSSxLQUFLLEVBQUUsQ0FBQztnQkFDUixJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsV0FBVyxDQUMzQyxXQUFXLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUM5QixDQUFDO2FBQ0w7U0FDSixDQUNKLENBQUM7S0FDTDtTQUFNO1FBQ0gsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7S0FDMUQ7QUFDTDs7QUNuQkE7QUFDQSxTQUFTLGVBQWUsQ0FBQyxZQUFvQjtJQUN6QyxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDeEMsQ0FBQztBQUVELFNBQVMsaUJBQWlCLENBQUMsZUFBdUI7SUFDOUMsSUFBSSxlQUFlLElBQUksQ0FBQyxFQUFFO1FBQ3RCLE9BQU8sR0FBRyxHQUFHLGVBQWUsQ0FBQztLQUNoQzs7O0lBR0QsT0FBTyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUMzQyxDQUFDO0FBRUQsU0FBUyxXQUFXLENBQUMsWUFBb0I7SUFDckMsT0FBTztRQUNILE1BQU0sQ0FBQyxZQUFZLENBQUM7UUFDcEIsSUFBSTtRQUNKLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNoRCxHQUFHO0tBQ04sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDZixDQUFDO0FBRUQsU0FBUyxZQUFZLENBQUMsV0FBd0I7SUFDMUMsT0FBTyxjQUFjLFdBQVc7UUFDNUI7WUFDSSxLQUFLLEVBQUUsQ0FBQztZQUNSLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQzNDLFdBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQzlCLENBQUM7U0FDTDtRQUNELGlCQUFpQjtZQUNiLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDM0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUM3QyxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxJQUFJLGdCQUFnQixHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwRCxJQUFJLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FDM0QsU0FBUyxDQUFDLEtBQUssQ0FDbEIsQ0FBQzthQUNMO1NBQ0o7S0FDSixDQUFDO0FBQ04sQ0FBQztBQUNEO0FBQ0EsTUFBTUEsY0FBWSxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0VBOEIyQyxDQUFDO0FBRTFELE1BQU0sWUFBWSxHQUFHO0lBQ3hCLElBQUksV0FBVyxHQUFHLFFBQVE7U0FDckIsV0FBVyxFQUFFO1NBQ2Isd0JBQXdCLENBQUNBLGNBQVksQ0FBQyxDQUFDO0lBQzVDLG1CQUFtQixDQUFDLDRCQUE0QixFQUFFLFdBQVcsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUNqRixDQUFDLENBQUE7O0FDbEZELE1BQU1BLGNBQVksR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQXNCcEIsQ0FBQztBQUVLLE1BQU0sZUFBZSxHQUFHO0lBQzNCLElBQUksV0FBVyxHQUFHLFFBQVE7U0FDckIsV0FBVyxFQUFFO1NBQ2Isd0JBQXdCLENBQUNBLGNBQVksQ0FBQyxDQUFDO0lBQzVDLG1CQUFtQixDQUFDLG1DQUFtQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQzFFLENBQUMsQ0FBQTs7QUM3QkQsTUFBTUEsY0FBWSxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQTBCcEIsQ0FBQztBQUVLLE1BQU0sY0FBYyxHQUFHO0lBQzFCLElBQUksV0FBVyxHQUFHLFFBQVE7U0FDckIsV0FBVyxFQUFFO1NBQ2Isd0JBQXdCLENBQUNBLGNBQVksQ0FBQyxDQUFDO0lBQzVDLG1CQUFtQixDQUFDLGlDQUFpQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ3hFLENBQUMsQ0FBQTs7QUNqQ0QsTUFBTUEsY0FBWSxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQTBCcEIsQ0FBQztBQUVLLE1BQU0sWUFBWSxHQUFHO0lBQ3hCLElBQUksV0FBVyxHQUFHLFFBQVE7U0FDckIsV0FBVyxFQUFFO1NBQ2Isd0JBQXdCLENBQUNBLGNBQVksQ0FBQyxDQUFDO0lBQzVDLG1CQUFtQixDQUFDLGdDQUFnQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ3ZFLENBQUMsQ0FBQTs7QUNqQ0QsTUFBTUEsY0FBWSxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0F1RnBCLENBQUM7QUFFSyxNQUFNLFNBQVMsR0FBRztJQUNyQixJQUFJLFdBQVcsR0FBRyxRQUFRO1NBQ3JCLFdBQVcsRUFBRTtTQUNiLHdCQUF3QixDQUFDQSxjQUFZLENBQUMsQ0FBQztJQUM1QyxtQkFBbUIsQ0FBQyw2QkFBNkIsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUNwRSxDQUFDLENBQUE7O0FDOUZELE1BQU1BLGNBQVksR0FBRzs7Ozs7Ozs7Ozs7OztDQWFwQixDQUFDO0FBRUssTUFBTSxXQUFXLEdBQUc7SUFDdkIsSUFBSSxXQUFXLEdBQUcsUUFBUTtTQUNyQixXQUFXLEVBQUU7U0FDYix3QkFBd0IsQ0FBQ0EsY0FBWSxDQUFDLENBQUM7SUFDNUMsbUJBQW1CLENBQUMsK0JBQStCLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDdEUsQ0FBQyxDQUFBOztBQ3BCRCxNQUFNLFlBQVksR0FBRzs7Ozs7Ozs7O0NBU3BCLENBQUM7QUFFSyxNQUFNLFFBQVEsR0FBRztJQUNwQixJQUFJLFdBQVcsR0FBRyxRQUFRO1NBQ3JCLFdBQVcsRUFBRTtTQUNiLHdCQUF3QixDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzVDLG1CQUFtQixDQUFDLDRCQUE0QixFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ25FLENBQUMsQ0FBQTs7TUNQb0IsZUFBZ0IsU0FBUUMsZUFBTTtJQUN6QyxNQUFNOztZQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztZQUV2QyxNQUFNLFlBQVksRUFBRSxDQUFDO1lBQ3JCLE1BQU0sZUFBZSxFQUFFLENBQUM7WUFDeEIsTUFBTSxjQUFjLEVBQUUsQ0FBQztZQUN2QixNQUFNLFlBQVksRUFBRSxDQUFDO1lBQ3JCLE1BQU0sU0FBUyxFQUFFLENBQUM7WUFDbEIsTUFBTSxXQUFXLEVBQUUsQ0FBQztZQUNwQixNQUFNLFFBQVEsRUFBRSxDQUFDO1lBRWpCLElBQUksQ0FBQyxrQ0FBa0MsQ0FDbkMsV0FBVyxFQUNYLENBQU8sTUFBTSxFQUFFLEVBQUUsRUFBRSxHQUFHOztnQkFlZCxNQUFNLENBQUMsV0FBVyxDQUNsQixNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQ2hEO2FBQ0wsQ0FBQSxDQUNKLENBQUM7U0FDTDtLQUFBO0lBRUQsUUFBUTtRQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztLQUNyQzs7Ozs7In0=
