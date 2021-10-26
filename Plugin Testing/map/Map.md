
```leaflet
id: test 3
markerFile: [[Direct Marker 2]]
markerFolder: "Plugin Testing/map/🗺 marker folder"
maxZoom: 8
minZoom: -2
```

%%

```leaflet
id: tester7
image: [[middle-earth-map.jpg|Middle Earth]]
image: [[Khorvaire.jpg|Khorvaire]]
imageOverlay: 
 - [clouds-transparent.png]
bounds: [[0,0], [1411.76, 1882.35]]
height: 500px
lat: 700
long: 900
minZoom: -5
defaultZoom: -2
maxZoom: 2
unit: miles
geojson: 
 - [[geo-fangorn.geojson]]


```



```leaflet
#height: 100%
id: real 2
# defaultZoom: 9
maxZoom: 15
#zoomFeatures: true
markerFolder: Plugin Testing/map/marker folder
marker: location, 50, 50
overlayTag: nearby
#coordinates: [[Direct, Marker]]
gpxColor: red
#geojsonFolder: Plugin Testing/map/geojson
#gpxFolder: Plugin Testing/map/gpx
geojson:
 - [[Gewässer-Informations-Erlebnis-Pfad Münsterhausen.geojson]]
 - [[geo-lk-günzburg-gemeinden.geojson]]
gpx:
 - [[20210729 1859 2021-07-29 Oberegger Stausee mit M&M.gpx]]
 - [[2020-04-24-161243-Running-Jeremy’s Apple Watch.gpx|House Run]]
 - [[route_2018-07-29_12.37pm.gpx]]
 - [[route_2020-04-18_11.38am.gpx]]
gpxMarkers: 
 start: location
 waypoint: event
 end: event
#verbose: true
commandMarker: location,42.78229917261048,-77.59204637917007,workspace:copy-path,,,
```
%%
