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
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            const urlencoded = new URLSearchParams();
            urlencoded.append("email", email);
            urlencoded.append("password", password);
            const requestOptions = {
                method: "post",
                headers: myHeaders,
                body: urlencoded,
                redirect: "follow"
            };
            console.log("🚀 ~ file: index.ts ~ line 44 ~ requestOptions", requestOptions);
            fetch("https://secret-ocean-49799.herokuapp.com//https://www.paprikaapp.com/api/v2/account/login/", requestOptions)
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
