
%%
```leaflet
id: test
tileOverlay:
  - http://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png|rails|on
geojson: [[geo-usa-columbus.json]]||[[This File]]
```
%%

```leaflet
id: stress
image: https://i.imgur.com/FqZ5r3E.jpeg
image: [[Sword-Coast-Map_HighRes.jpeg]]
bounds: [[0,0], [1823,2818]]
minZoom: -3
maxZoom: 18
defaultZoom: -2
zoomDelta: 0.5
coordinates: [911, 1409]
recenter: true
noScrollZoom: true
```

```leaflet
id: leaflet-map
image: [[khorvaire.png]]
height: 500px
lat: 50
long: 50
minZoom: 1
maxZoom: 10
defaultZoom: 5
unit: meters
scale: 1
marker: location,-3.6875,4.6873387096774195
lock: true
```


