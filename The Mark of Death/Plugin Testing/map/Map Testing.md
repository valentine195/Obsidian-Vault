%%
```leaflet
id: tester4
# the image is 1600x1200 px
image: [[middle-earth-map.jpg]]
# bounds uses y,x (CRS.Simple)
# bounds in miles (as per map scale: 100 mi = 85 px)
bounds: [[0,0], [1411.76, 1882.35]]
# after this, southwest = 0,0; northeast = 1411.76, 1882.35
height: 500px
# lat/long in percent doesn’t center
# does ist not respect scale or bounds?
# would be easier if this was a coordinate in "bounds" range,
# as the "final" coordinates will be.
lat: 50
long: 50
minZoom: -2
defaultZoom: -2
maxZoom: 2
unit: miles
# make check markers in the center, SW, NE (y,x in "bounds" coordinates)
# (in the middle of Fangorn!)
# marker: location, 705.88, 941.175
# Southwest (0,0)
# marker: location, 0, 0
# Northeast (1411.76, 1882.35)
# marker: location, 1411.76, 1882.35
markerTag: location
imageOverlay:
 - [[[clouds-transparent.png]]]
verbose: true
```
 %%
#item _test


```leaflet
id: GIEP
maxZoom: 17
#defaultZoom: 4.5
#zoomDelta: 0.5
zoomFeatures: true
geojson:
 - [[Gewässer-Informations-Erlebnis-Pfad Münsterhausen.geojson]]
linksTo: [[Untitled 1]]
linksFrom: [[Link From]]
markerFile: [[Direct, Marker]]
verbose: true
```
