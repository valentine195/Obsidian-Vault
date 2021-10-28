---
css:
 test: abc
---

```dataviewjs

app.plugins.plugins["obsidian-admonition"].postprocessor("info", "markdown content", this.container.createDiv());


```

^20470e

````ad-note
title: # Test

```dataview
list from #location
```

````

```ad-info

abc

```
