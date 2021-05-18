# Index

<span class="nav">[Locations](#Locations) [NPCs](#NPCs)  [Factions](#Factions)</span>

## Locations

```dataviewjs

dv.list(dv.pages('"2. Compendium"')
  .where(p => p.type == "location")
  .sort(p => p.file.name, 'asc')
  .map(p => p.file.link))
```

## NPCs

```dataviewjs
dv.list(dv.pages('"2. Compendium"')
  .where(p => p.type == "npc" && p.status != "dead")
  .sort(p => p.file.name, 'asc')
  .map(p => p.file.link))
```

## Factions

```dataviewjs
dv.list(dv.pages('"2. Compendium"')
  .where(p => p.type == "faction")
  .sort(p => p.file.name, 'asc')
  .map(p => p.file.link))
```