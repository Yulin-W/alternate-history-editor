# alternate-history-editor

[Click for demo](https://yulin-w.github.io/alternate-history-editor/main.html)

[Click for equirectangular projection demo](https://yulin-w.github.io/alternate-history-editor/rect-proj-ver/main.html)

You can also download some of the sample timelines and load them into the demo to play around

## Historic (Approximately) Scenarios
Click links to download scenarios; note certain browsers may open the files directly, in which case usually right click save-as will have the file downloaded

Note: some of the below gifs were recorded with older versions of the app; thus map appearance may differ now (regions though stay the same)

Note: scenarios are not guranteed to be historically accurate nor do they represent personal views of the author
[1444AD: Battle of Varna](https://raw.githubusercontent.com/Yulin-W/alternate-history-editor/master/Historic%20Scenarios/1444AD-Battle-of-Varna.json)
![](https://raw.githubusercontent.com/Yulin-W/alternate-history-editor/master/Historic%20Scenarios/1444AD.gif)
[565-742AD: Death of Justinian I of Rome (Byzantine) to Beginning of the Tianbao Era - Peak of Tang](https://raw.githubusercontent.com/Yulin-W/alternate-history-editor/master/Historic%20Scenarios/565-622-668-742AD.json)
![](https://raw.githubusercontent.com/Yulin-W/alternate-history-editor/master/Historic%20Scenarios/565-622-668-742AD.gif)

## Sample: The Great Penguin War
[Click to download timeline file (can be loaded into the editor)](https://raw.githubusercontent.com/Yulin-W/alternate-history-editor/master/Sample%20Timelines/The%20Great%20Penguin%20War.json)
![](https://raw.githubusercontent.com/Yulin-W/alternate-history-editor/master/Sample%20Timelines/Great%20Penguin%20War.gif)

## Usage

### Notes
- Loading up the tool may take some time, please be patient (or come and help refactor code to speed it up ^_^)
- Using the admin level map will be rather laggy, so for most purposes rather use national level map
- Double click legend label to edit (click elsewhere or press Enter to finish editing)
- Added new time points inherit the map of the previous time point (makes timeline mapping easier)
- To use offline, you'll need to setup a local server and then open the main.html there

### Possible uses
- Alternate history timeline making OFC ^_^
- Creating coloured maps in general with annotations, for say demographics and so on

## Extra Acknowledgements
- "map_admin.js", "map_nation.js", "lakes.js", "rivers.js" were modified from:
  - Data source: Made with Natural Earth. Free vector and raster map data @ naturalearthdata.com. 
  - Data transformed to geoJSON at https://geoconverter.hsr.ch/vector, provided by Geometa Lab at IFS HSR
- "mercator-topographic.jpg" made by Daniel R. Strebe; 08:03, 17 December 2011; retrieved from "https://commons.wikimedia.org/wiki/File:Mercator_projection_Square.JPG"
  - Link to license: https://creativecommons.org/licenses/by-sa/3.0/deed.en
  - Modifications made: trimmed white outer borders
