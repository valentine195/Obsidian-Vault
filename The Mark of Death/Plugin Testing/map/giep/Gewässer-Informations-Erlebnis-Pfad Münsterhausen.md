---
#location: [48.323380433488, 10.443368000767947] # Start Nord
location: [48.2969, 10.459] # Start Süd
mapmarker: Check
# The map overlay shows 11 stations of an educational nature trail
mapoverlay:
  - ['rgba(192, 0, 192, .6)', [48.2969, 10.459], 5 m, "GIEP Startpunkt Süd"]
  - ['rgba(192, 0, 192, .6)', [48.301, 10.4565], 5 m, "GIEP 1. Kanal und Wehr, Fischtreppe"]
  - ['rgba(192, 0, 192, .6)', [48.3061, 10.4542], 5 m, "GIEP 2. Fischregionen, Heimische Fische"]
  - ['rgba(192, 0, 192, .6)', [48.3072, 10.4487], 5 m, "GIEP 3. Ausgleichsfläche, Amphibien, Vegetation Kühgraben"]
  - ['rgba(192, 0, 192, .6)', [48.3118, 10.4463], 5 m, "GIEP 4. Element Wasser, Spielplatz"]
  - ['rgba(192, 0, 192, .6)', [48.3131, 10.4495], 5 m, "GIEP 5. Wasservögel, Hochwasser"]
  - ['rgba(192, 0, 192, .6)', [48.314, 10.449], 5 m, "GIEP 6. Uferbegleitvegetation"]
  - ['rgba(192, 0, 192, .6)', [48.3163, 10.4474], 5 m, "GIEP 7. Wasserkraft, Mühlengeschichte"]
  - ['rgba(192, 0, 192, .6)', [48.3193, 10.4481], 5 m, "GIEP 8. Weißstorch"]
  - ['rgba(192, 0, 192, .6)', [48.3188, 10.4458], 5 m, "GIEP 9. Kiesabbau"]
  - ['rgba(192, 0, 192, .6)', [48.3192, 10.4455], 5 m, "GIEP 10. Biber"]
  - ['rgba(192, 0, 192, .6)', [48.3216, 10.4441], 5 m, "GIEP 11. Naturraum Mindeltal"]
  - ['rgba(192, 0, 192, .6)', [48.3234, 10.4437], 5 m, "GIEP Startpunkt Nord"]
tags: check, location, recreation, walking, lehrpfad, trail, map
#nearby: 2 km
---

[[-Locations TOC]] [[-Map]] `= elink("https://www.google.com/maps/search/?api=1&query=" + this.location[0] + "," + this.location[1], "Google Maps")` `= elink("https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=" + this.location[0] + "," + this.location[1], "Street View")` `= elink("https://www.google.com/maps/dir/?api=1&dir_action=navigate&destination=" + this.location[0] + "," + this.location[1], "Route")`

---

# ![[Check.svg]] ![[Recreation.svg]] Gewässer-Informations-Erlebnis-Pfad Münsterhausen

86505 Münsterhausen

[[Gewässer-Informations-Erlebnis-Pfad Münsterhausen Karte.png]]

### Erlebnispfad mit 11 Stationen

Die rund 5 km lange Route entlang der [[Mindel]] verläuft größtenteil auf dem Mindeltal-Radweg, ermöglicht aber auch Abstecher zu abseits gelegenen, interessanten Wasserorten, an denen Wasser erforscht sowie erlebt werden kann.  
  
An 11 Stationen werden anhand von Informationstafeln verschiedene Facetten des Lebens an und in den Gewässern Münsterhausens gezeigt. Der Lehrpfad soll naturkundliches Wissen vermitteln, zum Nachdenken anregen und letztlich einen behutsamen Umgang mit unserem Lebensraum fördern.

#### Stationen

1. Kanal und Wehr, Fischtreppe
2. Fischregionen, Heimische Fische
3. Ausgleichsfläche, Amphibien, Vegetation Kühgraben
4. Element Wasser, Spielplatz
5. Wasservögel, Hochwasser
6. Uferbegleitvegetation
7. Wasserkraft, Mühlengeschichte
8. Weißstorch
9. Kiesabbau
10. Biber
11. Naturraum Mindeltal

### Karte

```leaflet
id: GIEP
maxZoom: 18
#defaultZoom: 4.5
#zoomDelta: 0.5
zoomFeatures: true
geojson: 
  - [[Gewässer-Informations-Erlebnis-Pfad Münsterhausen.geojson]]
# verbose: true
```

---

Gefunden auf <https://www.familien-und-kinderregion.de/poi/giep-gewaesser-informations-erlebnispfad>.
