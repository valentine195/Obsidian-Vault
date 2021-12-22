
```dataviewjs

const top = this.container.createDiv({ attr: { style: "display: flex; flex-flow: row wrap; gap: 1rem;" } });
const bottom = this.container.createDiv({ attr: { style: "display: flex; flex-flow: row wrap; gap: 0.5rem; justify-content: space-evenly;" } });

["troublesome","dangerous", "formidable","extreme","epic"].forEach(v => {
  const container = top.createDiv();
container.createEl("input", { attr: { name: "tier", id: v, type: "radio"} });
container.createEl("label", { text: v, attr: { for: v } });
});

[...Array(10).keys()].forEach(key => {
  const container = bottom.createDiv({ attr: { style: "display: flex; flex-flow: column nowrap; align-items: center;" } })

container.createEl("input", { attr: { name: "value", id: `id_${key}`, type: "radio" } });

container.createEl("label", { text: `+${key+1}` });
});

```