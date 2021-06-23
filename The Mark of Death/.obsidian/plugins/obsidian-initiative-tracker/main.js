/*
THIS IS A GENERATED/BUNDLED FILE BY ROLLUP
if you want to view the source visit the plugins github repository
*/

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

const INTIATIVE_TRACKER_VIEW = "initiative-tracker-view";
const INITIATIVE_TRACKER_BASE = "initiative-tracker";
const INITIATIVE_TRACKER_ICON = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="dice-d20" class="svg-inline--fa fa-dice-d20 fa-w-15" role="img" viewBox="0 0 480 512"><path fill="currentColor" d="M106.75 215.06L1.2 370.95c-3.08 5 .1 11.5 5.93 12.14l208.26 22.07-108.64-190.1zM7.41 315.43L82.7 193.08 6.06 147.1c-2.67-1.6-6.06.32-6.06 3.43v162.81c0 4.03 5.29 5.53 7.41 2.09zM18.25 423.6l194.4 87.66c5.3 2.45 11.35-1.43 11.35-7.26v-65.67l-203.55-22.3c-4.45-.5-6.23 5.59-2.2 7.57zm81.22-257.78L179.4 22.88c4.34-7.06-3.59-15.25-10.78-11.14L17.81 110.35c-2.47 1.62-2.39 5.26.13 6.78l81.53 48.69zM240 176h109.21L253.63 7.62C250.5 2.54 245.25 0 240 0s-10.5 2.54-13.63 7.62L130.79 176H240zm233.94-28.9l-76.64 45.99 75.29 122.35c2.11 3.44 7.41 1.94 7.41-2.1V150.53c0-3.11-3.39-5.03-6.06-3.43zm-93.41 18.72l81.53-48.7c2.53-1.52 2.6-5.16.13-6.78l-150.81-98.6c-7.19-4.11-15.12 4.08-10.78 11.14l79.93 142.94zm79.02 250.21L256 438.32v65.67c0 5.84 6.05 9.71 11.35 7.26l194.4-87.66c4.03-1.97 2.25-8.06-2.2-7.56zm-86.3-200.97l-108.63 190.1 208.26-22.07c5.83-.65 9.01-7.14 5.93-12.14L373.25 215.06zM240 208H139.57L240 383.75 340.43 208H240z"/></svg>`;
const INITIATIVE_TRACKER_SAVE = "initiative-tracker-save";
const INITIATIVE_TRACKER_SAVE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="save" class="svg-inline--fa fa-save fa-w-14" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z"/></svg>`;
const INITIATIVE_TRACKER_REMOVE = "initiative-tracker-remove";
const INITIATIVE_TRACKER_REMOVE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash" class="svg-inline--fa fa-trash fa-w-14" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"/></svg>`;
const INITIATIVE_TRACKER_RESTART = "initiative-tracker-restart";
const INITIATIVE_TRACKER_RESTART_ICON = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="redo" class="svg-inline--fa fa-redo fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M500.33 0h-47.41a12 12 0 0 0-12 12.57l4 82.76A247.42 247.42 0 0 0 256 8C119.34 8 7.9 119.53 8 256.19 8.1 393.07 119.1 504 256 504a247.1 247.1 0 0 0 166.18-63.91 12 12 0 0 0 .48-17.43l-34-34a12 12 0 0 0-16.38-.55A176 176 0 1 1 402.1 157.8l-101.53-4.87a12 12 0 0 0-12.57 12v47.41a12 12 0 0 0 12 12h200.33a12 12 0 0 0 12-12V12a12 12 0 0 0-12-12z"/></svg>`;
const INITIATIVE_TRACKER_PLAY = "initiative-tracker-play";
const INITIATIVE_TRACKER_PLAY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="play" class="svg-inline--fa fa-play fa-w-14" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"/></svg>`;
const INITIATIVE_TRACKER_FORWARD = "initiative-tracker-forward";
const INITIATIVE_TRACKER_FORWARD_ICON = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="step-forward" class="svg-inline--fa fa-step-forward fa-w-14" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M384 44v424c0 6.6-5.4 12-12 12h-48c-6.6 0-12-5.4-12-12V291.6l-195.5 181C95.9 489.7 64 475.4 64 448V64c0-27.4 31.9-41.7 52.5-24.6L312 219.3V44c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12z"/></svg>`;
const INITIATIVE_TRACKER_BACKWARD = "initiative-tracker-backward";
const INITIATIVE_TRACKER_BACKWARD_ICON = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="step-backward" class="svg-inline--fa fa-step-backward fa-w-14" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M64 468V44c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12v176.4l195.5-181C352.1 22.3 384 36.6 384 64v384c0 27.4-31.9 41.7-52.5 24.6L136 292.7V468c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12z"/></svg>`;
const INITIATIVE_TRACKER_STOP = "initiative-tracker-stop";
const INITIATIVE_TRACKER_STOP_ICON = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="stop" class="svg-inline--fa fa-stop fa-w-14" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48z"/></svg>`;

class TrackerView extends obsidian.ItemView {
    constructor(leaf) {
        super(leaf);
        this.buttons = createDiv("initiative-tracker-buttons nav-buttons-container");
        this.table = createDiv("initiative-tracker-table");
        this.state = false;
        this.creatures = [];
        this.buildControls();
        /*         setIcon(
            this.buttons.createDiv("play nav-action-button"),
            INITIATIVE_TRACKER_PLAY
        );
        setIcon(
            this.buttons.createDiv("back nav-action-button"),
            INITIATIVE_TRACKER_BACKWARD
        );
        setIcon(
            this.buttons.createDiv("next nav-action-button"),
            INITIATIVE_TRACKER_FORWARD
        ); */
    }
    get stateIcon() {
        return this.state ? INITIATIVE_TRACKER_STOP : INITIATIVE_TRACKER_PLAY;
    }
    get stateMessage() {
        return this.state ? "End" : "Start";
    }
    buildControls() {
        this.buttons.empty();
        new obsidian.ExtraButtonComponent(this.buttons)
            .setIcon(this.stateIcon)
            .setTooltip(this.stateMessage)
            .onClick(() => {
            this.state = !this.state;
            this.buildControls();
        });
    }
    getViewType() {
        return INTIATIVE_TRACKER_VIEW;
    }
    getDisplayText() {
        return "Initiative Tracker";
    }
    getIcon() {
        return INITIATIVE_TRACKER_BASE;
    }
    onOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(this);
            this.build();
        });
    }
    build() {
        const { containerEl } = this;
        const contentEl = createDiv("obsidian-initiative-tracker");
        /** Add Control Buttons */
        contentEl.appendChild(this.buttons);
        /** Add Creatures Table */
        contentEl.appendChild(this.table);
        /** Add New Creature Button */
        const addEl = contentEl.createDiv("initiative-add-creature-container");
        new obsidian.ExtraButtonComponent(addEl.createDiv("initiative-add-creature-button"))
            .setTooltip("Add Creature")
            .setIcon("plus-with-circle")
            .onClick(() => {
            console.log("Add New");
        });
        containerEl.empty();
        containerEl.appendChild(contentEl);
    }
}

class InitiativeTracker extends obsidian.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Loading Initiative Tracker v" + this.manifest.version);
            this.registerIcons();
            yield this.loadSettings();
            this.registerView(INTIATIVE_TRACKER_VIEW, (leaf) => (this.view = new TrackerView(leaf)));
            this.addCommand({
                id: "open-tracker",
                name: "Open Initiative Tracker",
                checkCallback: (checking) => {
                    if (checking)
                        return (this.app.workspace.getLeavesOfType(INTIATIVE_TRACKER_VIEW).length === 0);
                    this.addTrackerView();
                }
            });
            if (this.app.workspace.layoutReady) {
                this.addTrackerView();
            }
            else {
                this.registerEvent(this.app.workspace.on("layout-ready", this.addTrackerView.bind(this)));
            }
        });
    }
    onunload() {
        this.app.workspace
            .getLeavesOfType(INTIATIVE_TRACKER_VIEW)
            .forEach((leaf) => leaf.detach());
        console.log("Initiative Tracker unloaded");
    }
    addTrackerView() {
        if (this.app.workspace.getLeavesOfType(INTIATIVE_TRACKER_VIEW).length) {
            return;
        }
        this.app.workspace.getRightLeaf(false).setViewState({
            type: INTIATIVE_TRACKER_VIEW,
            active: true //TODO: CHANGE BEFORE BUILD
        });
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    registerIcons() {
        obsidian.addIcon(INITIATIVE_TRACKER_BASE, INITIATIVE_TRACKER_ICON);
        obsidian.addIcon(INITIATIVE_TRACKER_SAVE, INITIATIVE_TRACKER_SAVE_ICON);
        obsidian.addIcon(INITIATIVE_TRACKER_REMOVE, INITIATIVE_TRACKER_REMOVE_ICON);
        obsidian.addIcon(INITIATIVE_TRACKER_RESTART, INITIATIVE_TRACKER_RESTART_ICON);
        obsidian.addIcon(INITIATIVE_TRACKER_PLAY, INITIATIVE_TRACKER_PLAY_ICON);
        obsidian.addIcon(INITIATIVE_TRACKER_FORWARD, INITIATIVE_TRACKER_FORWARD_ICON);
        obsidian.addIcon(INITIATIVE_TRACKER_BACKWARD, INITIATIVE_TRACKER_BACKWARD_ICON);
        obsidian.addIcon(INITIATIVE_TRACKER_STOP, INITIATIVE_TRACKER_STOP_ICON);
    }
}

module.exports = InitiativeTracker;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4taW5pdGlhdGl2ZS10cmFja2VyL25vZGVfbW9kdWxlcy90c2xpYi90c2xpYi5lczYuanMiLCIuLi8uLi8uLi8uLi8uLi9vYnNpZGlhbi1pbml0aWF0aXZlLXRyYWNrZXIvc3JjL3V0aWxzL2NvbnN0YW50cy50cyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLWluaXRpYXRpdmUtdHJhY2tlci9zcmMvdmlldy50cyIsIi4uLy4uLy4uLy4uLy4uL29ic2lkaWFuLWluaXRpYXRpdmUtdHJhY2tlci9zcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6bnVsbCwibmFtZXMiOlsiSXRlbVZpZXciLCJFeHRyYUJ1dHRvbkNvbXBvbmVudCIsIlBsdWdpbiIsImFkZEljb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF1REE7QUFDTyxTQUFTLFNBQVMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUU7QUFDN0QsSUFBSSxTQUFTLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEtBQUssWUFBWSxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLFVBQVUsT0FBTyxFQUFFLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7QUFDaEgsSUFBSSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDL0QsUUFBUSxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFD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
