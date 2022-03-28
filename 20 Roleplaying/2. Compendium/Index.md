# Index

<span class="nav">[Locations](#Locations) [NPCs](#NPCs)  [Factions](#Factions)</span>

## Map
```leaflet
id: full-index
markerTag:
	- location
	- event
	- faction
	- npc
image: [[Khorvaire.jpg]]
image: [[Mine of Whitecliff.png]]
defaultZoom: 6.3
zoomDelta: 0.05
unit: mi
scale: 400
```
^khorvaire-map

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