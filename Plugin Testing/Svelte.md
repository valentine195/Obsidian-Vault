## Svelte

Svelte is a lightwight alternative to traditional frontend frameworks like React and Vue. However, unlike other frameworks, Svelte is built around a compiler that preprocesses your code and outputs vanilla JavaScript - it does not rely on loading libraries at run time. This also has the added benefit of not needing a virtual DOM to track state changes, which can allow your plugin to run with minimal additional overhead.

Svelte has a [tutorial](https://svelte.dev/tutorial/basics) that will introduce the framework and go into more depth on its various features. It also has extensive [documentation](https://svelte.dev/docs). 

### Configure your plugin

Svelte is compiled during the build step, which means the bulk of the depencies are centered around the *actual compiling*. These dependencies change depending on your chosen bundler. Two common methods are shown below.

However, in both cases, you will need to install Svelte and Svelte-Preprocess:

```js
npm i -D svelte svelte-preprocess
```

#### Visual Studio Code
Svelte has an [official Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) that enables syntax highlighting and rich intellisense in Svelte Components. If you are using Visual Studio Code to work on your plugin, it is highly recommended to install this extension.

#### Typescript
If you are using Typescript, is also recommended to install `@tsconfig/svelte` and using it to extend your `tsconfig.json` file. This has additional type checking for common Svelte issues.

```js
npm i -D @tsconfig/svelte

//tsconfig.json
{
	"extends": "@tsconfig/svelte/tsconfig.json",
	"compilerOptions": {
		...
	}
}

```
#### Webpack

Webpack requires the use of both `babel-loader` and `svelte-loader` to compile Svelte.

```js
	
npm i -D babel-loader svelte-loader

//webpack.config.js
const sveltePreprocess = require("svelte-preprocess");

module.exports = {
	...
	module: {
		rules: [
			{
				test: /\.(svelte)$/,
				use: [
					{ loader: "babel-loader" },
					{
						loader: "svelte-loader",
						options: {
							preprocess: sveltePreprocess({})
						}
					}
				]
			},
		]
	},
	...
};

```

Final list:
	1. `svelte`
	2. `svelte-preprocess`
	3. `@tsconfig/svelte`
	4. `babel-loader`
	5. `svelte-loader`

#### Rollup

Rollup requires `rollup-plugin-svelte`.

```js
npm i -D rollup-plugin-svelte

//rollup.config.js

const svelte = require("rollup-plugin-svelte");
const process = require("svelte-preprocess");


module.exports = {
	...
	plugins: [
		svelte({ emitCss: false, preprocess: process() }), //Do not emit extra CSS files.
		...
	]
};
```

Final list:
	1. `svelte`
	2. `svelte-preprocess`
	3. `@tsconfig/svelte`
	4. `rollup-plugin-svelte`

### Create a Svelte Component
A Svelte component has three main sections, all three of which are optional.
1. Script
2. Markup
3. Style

A basic component takes the following form:


```jsx
//Component.svelte

//Script
//Note: in order to enable Typescript checking, lang="ts" must be set.
<script lang="ts">

	export let variable: number;

</script>

//Markup
<div class="number">
	<span>My number is {variable}!</span>
</div>

//Style
<style>
	.number {
		color: red;
	}
</style>
```

### Mount the Svelte Component

The Svelte component created above must be mounted onto an existing HTML element. For example, if you are mounting on a custom `ItemView` in Obsidian:

```js
import { ItemView, WorkspaceLeaf } from "obsidian";

import Component from "./Component.svelte";

const VIEW_TYPE_EXAMPLE = "example-view";

class ExampleView extends ItemView {
  component: Component;
  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType() {
    return VIEW_TYPE_EXAMPLE;
  }

  getDisplayText() {
    return "Example view";
  }

  async onOpen() {
  	//Mount the component onto the content element and pass any props.
    this.component = new Component({
		target: this.contentEl,
		props: {
			number: 1
		}
	});
  }

  async onClose() {
    this.component.$destroy();
  }
}
```
	
### Create a Svelte Store

Optionally, as your plugin grows in size, it may be worthwile to create a Svelte store.

For example, you could create a store for your plugin and access it from within a generic Svelte component instead of passing the plugin as a prop.

```jsx
//store.ts

import { writable } from "svelte/store";
import type MyPlugin from "./main";

const plugin = writable<MyPlugin>();
export default { plugin };
```

```js
//view.ts
import { ItemView, WorkspaceLeaf } from "obsidian";
import type MyPlugin from "./main"; 

const VIEW_TYPE_EXAMPLE = "example-view";

import store from "./store";
import Component from "./Component.svelte";

class ExampleView extends ItemView {
  component: Component;
  constructor(leaf: WorkspaceLeaf, public plugin: MyPlugin) {
    super(leaf);
  }

  getViewType() {
    return VIEW_TYPE_EXAMPLE;
  }

  getDisplayText() {
    return "Example view";
  }

  async onOpen() {
  	//set the store value
	store.plugin.set(this.plugin);
  
  	//Mount the component onto the content element and pass any props.
    this.component = new Component({
		target: this.contentEl,
		props: {
			number: 1
		}
	});
  }

  async onClose() {
    this.component.$destroy();
  }
}
```

```jsx
//Component.svelte

<script lang="ts">
 import type MyPlugin from "./main";

 let plugin: MyPlugin;
 store.plugin.subscribe((p) => (plugin = p));

</script>

```