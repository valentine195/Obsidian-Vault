/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/main.ts
__export(exports, {
  default: () => SettingsSearch
});
var import_obsidian = __toModule(require("obsidian"));

// node_modules/monkey-around/mjs/index.js
function around(obj, factories) {
  const removers = Object.keys(factories).map((key) => around1(obj, key, factories[key]));
  return removers.length === 1 ? removers[0] : function() {
    removers.forEach((r) => r());
  };
}
function around1(obj, method, createWrapper) {
  const original = obj[method], hadOwn = obj.hasOwnProperty(method);
  let current = createWrapper(original);
  if (original)
    Object.setPrototypeOf(current, original);
  Object.setPrototypeOf(wrapper, current);
  obj[method] = wrapper;
  return remove;
  function wrapper(...args) {
    if (current === original && obj[method] === wrapper)
      remove();
    return current.apply(this, args);
  }
  function remove() {
    if (obj[method] === wrapper) {
      if (hadOwn)
        obj[method] = original;
      else
        delete obj[method];
    }
    if (current === original)
      return;
    current = original;
    Object.setPrototypeOf(wrapper, original || Function);
  }
}

// src/main.ts
var SettingsSearch = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    __publicField(this, "settingsSearchEl", createDiv("settings-search-container vertical-tab-header-group"));
    __publicField(this, "settingsResultsContainerEl", createDiv("settings-search-results-container vertical-tab-content"));
    __publicField(this, "settingsNavItemContainer", this.settingsSearchEl.createDiv("vertical-tab-header-group-items").createDiv("vertical-tab-nav-item settings-search-input"));
    __publicField(this, "settingsResultsEl");
    __publicField(this, "search");
    __publicField(this, "locale");
    __publicField(this, "resources", []);
    __publicField(this, "results", []);
    __publicField(this, "loaded", false);
    __publicField(this, "tabIndex", 0);
    __publicField(this, "pluginTabIndex", 0);
    __publicField(this, "settingCache", new Map());
    __publicField(this, "searchAppended", false);
    __publicField(this, "activeIndex", -1);
    __publicField(this, "activeSetting");
    __publicField(this, "scope", new import_obsidian.Scope(this.app.scope));
    __publicField(this, "mobileContainers", []);
  }
  async onload() {
    (window["SettingsSearch"] = {
      addResources: this.addResources.bind(this),
      removeResources: this.removeResources.bind(this),
      removeTabResources: this.removeTabResources.bind(this)
    }) && this.register(() => delete window["SettingsSearch"]);
    this.app.workspace.onLayoutReady(async () => {
      this.settingsResultsContainerEl.createEl("h3", {
        text: "Settings Search Results"
      });
      this.settingsResultsEl = this.settingsResultsContainerEl.createDiv("settings-search-results");
      this.buildScope();
      this.buildSearch();
      this.buildResources();
      this.buildPluginResources();
      this.patchSettings();
      this.loaded = true;
      this.app.workspace.trigger("settings-search-loaded");
    });
  }
  buildResources() {
    const tab = this.app.setting.settingTabs[this.tabIndex];
    if (tab) {
      this.getTabResources(tab);
      this.tabIndex++;
      setTimeout(() => this.buildResources());
    }
  }
  buildPluginResources() {
    const tab = this.app.setting.pluginTabs[this.pluginTabIndex];
    if (tab) {
      this.getTabResources(tab);
      this.pluginTabIndex++;
      setTimeout(() => this.buildPluginResources());
    }
  }
  get manifests() {
    return Object.values(this.app.plugins.manifests);
  }
  addResourceToCache(resource) {
    if (!resource || !resource.text || !resource.name || !resource.tab) {
      return new Error("A valid resource must be provided.");
    }
    let name;
    if (resource.external) {
      name = createFragment((el) => {
        (0, import_obsidian.setIcon)(el.createSpan({
          attr: {
            "aria-label": "This setting was added by another plugin."
          }
        }), "info");
        el.createSpan({ text: resource.text });
      });
    } else {
      name = resource.text;
    }
    const setting = new import_obsidian.Setting(createDiv()).setName(name).setDesc(createFragment((e) => e.createDiv().innerHTML = resource.desc ?? ""));
    if (resource.external) {
      setting.settingEl.addClass("set-externally");
    }
    if (resource.tab == "community-plugins") {
      let plugin = this.manifests.find((p) => p.name == resource.text);
      if (plugin && this.app.plugins.getPlugin(plugin.id)?._loaded && this.app.setting.pluginTabs.find((t) => t.id == plugin.id)) {
        setting.addExtraButton((b) => {
          b.setTooltip(`Open ${resource.text} Settings`).onClick(() => {
            this.app.setting.openTabById(plugin.id);
          });
        });
      }
    }
    if (resource.tab == "plugins") {
      const plugins = Object.values(this.app.internalPlugins.plugins);
      const plugin = plugins.find((p) => p._loaded && p.instance.name == resource.text);
      if (plugin && this.app.setting.pluginTabs.find((t) => t.id == plugin.instance.id)) {
        setting.addExtraButton((b) => {
          b.setTooltip(`Open ${resource.text} Settings`).onClick(() => {
            this.app.setting.openTabById(plugin.instance.id);
          });
        });
      }
    }
    setting.addExtraButton((b) => {
      b.setIcon("forward-arrow").onClick(() => {
        this.showResult(resource);
      });
    });
    this.settingCache.set(resource, setting);
  }
  getResourceFromCache(resource) {
    if (!this.settingCache.has(resource)) {
      this.addResourceToCache(resource);
    }
    return this.settingCache.get(resource);
  }
  removeResourcesFromCache(resources) {
    for (const resource of resources) {
      this.settingCache.delete(resource);
    }
  }
  addResources(...resources) {
    for (const resource of resources) {
      resource.external = true;
      if (this.resources.find((k) => this.equivalent(resource, k)))
        continue;
      this.resources.push(resource);
      this.addResourceToCache(resource);
    }
    return () => this.removeResources(...resources);
  }
  equivalent(resource1, resource2) {
    return resource1.name == resource2.name && resource1.tab == resource2.tab && resource1.text == resource2.text && resource1.desc == resource2.desc && resource1.external == resource2.external;
  }
  removeResources(...resources) {
    const removing = [];
    const keys = [...this.settingCache.keys()];
    for (const resource of resources) {
      if (!resource || !resource.text || !resource.name || !resource.tab) {
        continue;
      }
      resource.external = true;
      this.resources = this.resources.filter((r) => !this.equivalent(resource, r));
      removing.push(...keys.filter((k) => k == resource || this.equivalent(resource, k)));
    }
    this.removeResourcesFromCache(removing);
  }
  removeTabResources(tab) {
    const removing = this.resources.filter((t) => t.tab == tab);
    this.resources = this.resources.filter((t) => t.tab != tab);
    this.removeResourcesFromCache(removing);
  }
  async getTabResources(tab) {
    await tab.display();
    const settings = tab.containerEl.querySelectorAll(".setting-item:not(.setting-item-header)");
    for (const el of Array.from(settings)) {
      const text = el.querySelector(".setting-item-name")?.textContent;
      if (!text)
        continue;
      const desc = el.querySelector(".setting-item-description")?.innerHTML ?? "";
      const resource = {
        tab: tab.id,
        name: tab.name,
        text,
        desc
      };
      this.resources.push(resource);
      this.addResourceToCache(resource);
    }
    if (this.app.setting.activeTab?.id == tab.id)
      return;
    tab.containerEl.detach();
    tab.hide();
  }
  patchSettings() {
    const self = this;
    this.register(around(this.app.setting, {
      onOpen: function(next) {
        return function() {
          next.apply(this);
          if (!import_obsidian.Platform.isMobile)
            self.search.inputEl.focus();
          return next;
        };
      }
    }));
    this.register(around(this.app.setting, {
      addSettingTab: function(next) {
        return function(tab) {
          self.getTabResources(tab);
          return next.call(this, tab);
        };
      }
    }));
    this.register(around(this.app.setting, {
      removeSettingTab: function(next) {
        return function(tab) {
          if (this.isPluginSettingTab(tab)) {
            self.removeTabResources(tab.id);
          }
          return next.call(this, tab);
        };
      }
    }));
    this.register(around(this.app.setting, {
      openTab: function(next) {
        return function(tab) {
          self.searchAppended = false;
          self.app.keymap.popScope(self.scope);
          return next.call(this, tab);
        };
      },
      openTabById: function(next) {
        return function(tab) {
          self.searchAppended = false;
          self.app.keymap.popScope(self.scope);
          return next.call(this, tab);
        };
      },
      onClose: function(next) {
        return function() {
          if (import_obsidian.Platform.isMobile) {
            self.detach();
          }
          return next.call(this);
        };
      }
    }));
  }
  buildSearch() {
    const tempSetting = new import_obsidian.Setting(createDiv()).addSearch((s) => {
      this.search = s;
    });
    this.settingsNavItemContainer.append(tempSetting.controlEl);
    tempSetting.settingEl.detach();
    this.search.onChange((v) => {
      this.onChange(v);
    });
    this.search.setPlaceholder("Search settings...");
    this.app.setting.tabHeadersEl.prepend(this.settingsSearchEl);
  }
  buildScope() {
    this.scope.register([], "ArrowDown", () => {
      if (this.activeSetting) {
        this.activeSetting.settingEl.removeClass("active");
      }
      this.activeIndex = ((this.activeIndex + 1) % this.results.length + this.results.length) % this.results.length;
      this.centerActiveSetting();
    });
    this.scope.register([], "ArrowUp", () => {
      if (this.activeSetting) {
        this.activeSetting.settingEl.removeClass("active");
      }
      this.activeIndex = ((this.activeIndex - 1) % this.results.length + this.results.length) % this.results.length;
      this.centerActiveSetting();
    });
    this.scope.register([], "Enter", () => {
      if (this.activeSetting) {
        this.showResult(this.results[this.activeIndex]);
      }
    });
  }
  centerActiveSetting() {
    const result = this.results[this.activeIndex];
    this.activeSetting = this.getResourceFromCache(result);
    this.activeSetting.settingEl.addClass("active");
    this.activeSetting.settingEl.scrollIntoView({
      behavior: "auto",
      block: "nearest"
    });
  }
  detachFromMobile() {
    if (import_obsidian.Platform.isMobile) {
      this.settingsResultsContainerEl.detach();
      for (const header of this.mobileContainers) {
        this.app.setting.tabHeadersEl.append(header);
      }
      this.search.setValue("");
    }
  }
  detachFromDesktop() {
    if (import_obsidian.Platform.isDesktop) {
      this.app.setting.openTabById(this.app.setting.lastTabId);
    }
  }
  detach() {
    this.detachFromDesktop();
    this.detachFromMobile();
    this.searchAppended = false;
  }
  onChange(v) {
    if (!v) {
      this.detach();
      this.app.keymap.popScope(this.scope);
      return;
    }
    if (!this.searchAppended) {
      this.activeIndex = -1;
      this.app.keymap.popScope(this.scope);
      this.app.keymap.pushScope(this.scope);
      if (this.activeSetting) {
        this.activeSetting.settingEl.removeClass("active");
        this.activeSetting = null;
      }
      if (!import_obsidian.Platform.isMobile) {
        this.app.setting.activeTab.navEl.removeClass("is-active");
        this.app.setting.tabContentContainer.empty();
        this.app.setting.tabContentContainer.append(this.settingsResultsContainerEl);
      } else {
        const headers = this.app.setting.tabHeadersEl.querySelectorAll(".vertical-tab-header-group:not(.settings-search-container)");
        for (const header of Array.from(headers)) {
          this.mobileContainers.push(header);
          header.detach();
        }
        this.app.setting.tabHeadersEl.append(this.settingsResultsContainerEl);
      }
      this.searchAppended = true;
    }
    this.appendResults(this.performFuzzySearch(v));
  }
  getMatchText(text, result) {
    const matchElements = {};
    return createFragment((content) => {
      for (let i = 0; i < text.length; i++) {
        let match = result.matches.find((m) => m[0] === i);
        if (match) {
          const index = result.matches.indexOf(match);
          if (!matchElements[index]) {
            matchElements[index] = createSpan("suggestion-highlight");
          }
          let element = matchElements[index];
          content.appendChild(element);
          element.appendText(text.substring(match[0], match[1]));
          i += match[1] - match[0] - 1;
          continue;
        }
        content.appendText(text[i]);
      }
    });
  }
  appendResults(results) {
    this.settingsResultsEl.empty();
    if (results.length) {
      const headers = {};
      for (const resource of results) {
        if (!(resource.tab in headers)) {
          headers[resource.tab] = this.settingsResultsEl.createDiv();
          new import_obsidian.Setting(headers[resource.tab]).setHeading().setName(resource.name);
        }
        const setting = this.getResourceFromCache(resource);
        headers[resource.tab].append(setting.settingEl);
      }
    } else {
      this.settingsResultsEl.setText("No results found :(");
    }
  }
  showResult(result) {
    this.search.setValue("");
    const tab = this.app.setting.settingTabs.find((t) => t.id == result.tab) ?? this.app.setting.pluginTabs.find((t) => t.id == result.tab);
    if (!tab) {
      new import_obsidian.Notice("There was an issue opening the setting tab.");
      return;
    }
    this.app.setting.openTabById(tab.id);
    this.app.keymap.popScope(this.scope);
    this.detach();
    try {
      const names = tab.containerEl.querySelectorAll(".setting-item-name");
      const el = Array.from(names).find((n) => n.textContent == result.text);
      if (!el)
        return;
      const setting = el.closest(".setting-item");
      if (!setting)
        return;
      if (tab.id == "obsidian-style-settings") {
        let collapsed = setting.closest(".style-settings-container");
        let previous = collapsed?.previousElementSibling;
        while (previous != null && previous.hasClass("is-collapsed") && previous.hasClass("style-settings-heading")) {
          previous.removeClass("is-collapsed");
          collapsed = collapsed.parentElement?.closest(".style-settings-container");
          previous = collapsed?.previousElementSibling;
        }
      }
      let details = setting.closest("details");
      while (details) {
        details.setAttr("open", "open");
        details = details.parentElement?.closest("details");
      }
      setting.scrollIntoView(true);
      setting.addClass("is-flashing");
      window.setTimeout(() => setting.removeClass("is-flashing"), 3e3);
    } catch (e) {
      console.error(e);
    }
  }
  performFuzzySearch(input) {
    const results = [], hotkeys = [];
    for (const resource of this.resources) {
      let result = (0, import_obsidian.prepareSimpleSearch)(input)(resource.text) ?? (0, import_obsidian.prepareSimpleSearch)(input)(resource.desc);
      if (result) {
        if (resource.tab == "hotkeys") {
          hotkeys.push(resource);
        } else {
          results.push(resource);
        }
      }
    }
    this.results = [...results, ...hotkeys];
    return this.results;
  }
  onunload() {
    this.settingsSearchEl.detach();
    this.settingsResultsEl.detach();
    this.detach();
    if (this.searchAppended && import_obsidian.Platform.isDesktop)
      this.app.setting.openTabById(this.app.setting.lastTabId);
  }
};
