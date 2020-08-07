# Alternate History Timeline Map Editor

Disclaimer: The maps in the editor are not intended to be exact nor do they represent personal views of the author. The maps and the editor are provided without any warranty of any kind whatsoever, either express or implied.

[Click for demo](https://yulin-w.github.io/alternate-history-editor/main.html)

[Click for equirectangular projection demo (doesn't have lasso fill tool nor geographic underlay)](https://yulin-w.github.io/alternate-history-editor/rect-proj-ver/main.html)

You can also download some of the sample timelines and load them into the demo to play around

## Possible uses
- Alternate history timeline making OFC ^_^
- Creating coloured maps in general with annotations, for say demographics and so on

## Sample alternate history

Disclaimer: This is a work of fiction. Names, characters, businesses, places, events, locales, and incidents are either the products of the author’s imagination or used in a fictitious manner. Any resemblance to actual persons, living or dead, or actual events is purely coincidental.

![](https://raw.githubusercontent.com/Yulin-W/alternate-history-editor/master/Sample-gifs/alternate_hist_sample.gif)

## Features
- Easy map timeline editing: added new dates come with its independent map inherited from previous time point
- Simple colouring in of map regions: 
  - Single region colouring
  - Lasso selection colouring of multiple regions
- Choice of 2 base world maps:
  - Countries
  - First level administrative divisions of countries
- Automatically generated legend with editable labels
- Region info including country/provincial name (depending on base map) displayed upon mouse hover
- Range of map overlays
  - Geographic
  - Rivers
  - Lakes
- Simple save/load of map timeline in json format (effectively text file)

## Historic (Approximately) Scenarios
Click links to download scenarios; note certain browsers may open the files directly, in which case usually right click save-as will have the file downloaded

Note: some of the below gifs were recorded with older versions of the app; thus map appearance may differ now (regions though stay the same)

Disclaimer: The below scenario maps were not intended to be historically exact nor do they represent personal views of the author. The maps are provided without any warranty of any kind whatsoever, either express or implied.

[1936AD: Coming of the Storm](https://raw.githubusercontent.com/Yulin-W/alternate-history-editor/master/Historic%20Scenarios/1936AD.json)
![](https://raw.githubusercontent.com/Yulin-W/alternate-history-editor/master/Historic%20Scenarios/1936AD.gif)

[1444AD: Battle of Varna](https://raw.githubusercontent.com/Yulin-W/alternate-history-editor/master/Historic%20Scenarios/1444AD-Battle-of-Varna.json)
![](https://raw.githubusercontent.com/Yulin-W/alternate-history-editor/master/Historic%20Scenarios/1444AD.gif)

[565-742AD: Death of Justinian I of Rome (Byzantine) to Beginning of the Tianbao Era - Peak of Tang](https://raw.githubusercontent.com/Yulin-W/alternate-history-editor/master/Historic%20Scenarios/565-622-668-742AD.json)
![](https://raw.githubusercontent.com/Yulin-W/alternate-history-editor/master/Historic%20Scenarios/565-622-668-742AD.gif)

## Extra Acknowledgements
- "map_admin.js", "map_nation.js", "lakes.js", "rivers.js" were modified from:
  - Data source: Made with Natural Earth. Free vector and raster map data @ naturalearthdata.com. 
  - Data transformed to geoJSON at https://geoconverter.hsr.ch/vector, provided by Geometa Lab at IFS HSR
- "mercator-topographic.jpg" made by Daniel R. Strebe; 08:03, 17 December 2011; retrieved from "https://commons.wikimedia.org/wiki/File:Mercator_projection_Square.JPG"
  - Link to license: https://creativecommons.org/licenses/by-sa/3.0/deed.en
  - Modifications made: trimmed white outer borders
