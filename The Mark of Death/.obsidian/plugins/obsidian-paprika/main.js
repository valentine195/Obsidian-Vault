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

const electronPkg = require("electron");
console.log("🚀 ~ file: index.ts ~ line 2 ~ electronPkg", electronPkg);
const { remote, ipcRenderer } = electronPkg;
const { BrowserWindow, ipcMain } = remote;
class API {
    constructor() {
        this.domain = "https://www.paprikaapp.com";
    }
    request(fetch) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("🚀 ~ file: index.ts ~ line 9 ~ fetch", fetch);
            return new Promise((resolve) => {
                const window = new BrowserWindow({
                    width: 1000,
                    height: 600,
                    webPreferences: {
                        webSecurity: false,
                        nodeIntegration: false
                    },
                    show: false
                });
                window.webContents.on("did-finish-load", () => __awaiter(this, void 0, void 0, function* () {
                    console.log("did-finish-load");
                    const result = yield window.webContents.executeJavaScript(`${fetch}`);
                    console.log("🚀 ~ file: index.ts ~ line 21 ~ result", result);
                    window.destroy();
                    resolve(result);
                }));
                window.loadURL("https://github.com");
            });
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const myHeaders = new Headers();
            myHeaders.append("Origin", "Obsidian Paprika");
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            const urlencoded = new URLSearchParams();
            urlencoded.append("email", "emmylou491@gmail.com");
            urlencoded.append("password", "angel4591");
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: urlencoded,
                redirect: "follow"
            };
            fetch("https://vast-woodland-91876.herokuapp.com/https://www.paprikaapp.com/api/v2/account/login/", requestOptions)
                .then((response) => response.text())
                .then((result) => console.log(result))
                .catch((error) => console.log("error", error));
        });
    }
}

const DEFAULT_SETTINGS = {
    mySetting: "default"
};
class PaprikaPlugin extends obsidian.Plugin {
    constructor() {
        super(...arguments);
        this.api = new API();
    }
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("loading plugin");
            yield this.loadSettings();
            this.addSettingTab(new PaprikaSettings(this));
            this.addStatusBarItem().setText("Paprika");
        });
    }
    onunload() {
        console.log("unloading plugin");
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
}
class LoginModal extends obsidian.Modal {
    constructor(plugin) {
        super(plugin.app);
        this.plugin = plugin;
    }
    open() {
        super.open();
        return this;
    }
    onOpen() {
        let { contentEl } = this;
        contentEl.empty();
        new obsidian.Setting(contentEl)
            .setHeading()
            .setName("Login")
            .setDesc("Use the email and password you use for Paprika sync.");
        let pw;
        let eml;
        new obsidian.Setting(contentEl).setName("Email").addText((t) => {
            eml = t;
            eml.setPlaceholder("janedoe@example.com");
        });
        new obsidian.Setting(contentEl)
            .setName("Password")
            .setDesc("Please note that the password is not securely stored.")
            .addText((t) => {
            pw = t;
            pw.setPlaceholder("Password");
        });
        new obsidian.Setting(contentEl).addButton((b) => {
            b.setButtonText("Login").onClick(() => __awaiter(this, void 0, void 0, function* () {
                /* if (!eml.inputEl.value || !pw.inputEl.value) {
                    new Notice("Enter an email and password first.");
                    return;
                } */
                /*
                const email = eml.inputEl.value;
                const password = pw.inputEl.value; */
                const email = "emmylou491@gmail.com";
                const password = "angel4591";
                this.plugin.api.login(email, password);
            }));
        });
    }
    onClose() {
        let { contentEl } = this;
        contentEl.empty();
    }
}
class PaprikaSettings extends obsidian.PluginSettingTab {
    constructor(plugin) {
        super(plugin.app, plugin);
        this.plugin = plugin;
    }
    display() {
        let { containerEl } = this;
        containerEl.empty();
        containerEl.createEl("h2", { text: "Paprika" });
        new obsidian.Setting(containerEl).setName("Login to Paprika").addButton((b) => {
            b.setButtonText("Login")
                .setTooltip("Login to Paprika")
                .onClick(() => {
                new LoginModal(this.plugin).open();
            });
        });
    }
}

module.exports = PaprikaPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tcGFwcmlrYS9ub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2LmpzIiwiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tcGFwcmlrYS9zcmMvYXBpL2luZGV4LnRzIiwiLi4vLi4vLi4vLi4vLi4vb2JzaWRpYW4tcGFwcmlrYS9zcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6bnVsbCwibmFtZXMiOlsiUGx1Z2luIiwiTW9kYWwiLCJTZXR0aW5nIiwiUGx1Z2luU2V0dGluZ1RhYiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXVEQTtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDbkcsUUFBUSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxD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
