```leaflet
id: tester7
image: 
 - [[middle-earth-map.jpg|Middle Earth]]
 - [[Khorvaire.jpg|Khorvaire]]
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
grid: true

geojsonColor: red
#zoomFeatures: true
#verbose: true
```

%%

```leaflet
#height: 100%
id: real 2
# defaultZoom: 9
maxZoom: 30
#zoomFeatures: true
markerFolder: Plugin Testing/map/marker folder
marker: location, 50, 50
overlayTag: nearby
#coordinates: [[Direct, Marker]]
gpxColor: red
#geojsonFolder: Plugin Testing/map/geojson
#gpxFolder: Plugin Testing/map/gpx
geojson:
# - [[Gewässer-Informations-Erlebnis-Pfad Münsterhausen.geojson]]
gpx:
# - [[20210729 1859 2021-07-29 Oberegger Stausee mit M&M.gpx]]
# - [[2020-04-24-161243-Running-Jeremy’s Apple Watch.gpx]]
 - [[route_2018-07-29_12.37pm.gpx]]
# - [[route_2020-04-18_11.38am.gpx]]
gpxMarkers: 
 start: location
 waypoint: event
 end: event
#verbose: true
```
