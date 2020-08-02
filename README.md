# alternate-history-editor

[Click for demo](https://yulin-w.github.io/alternate-history-editor/main.html)

You can also download some of the sample timelines and load them into the demo to play around

## Sample: The Great Penguin War
[Click to download timeline file (can be loaded into the editor)](https://raw.githubusercontent.com/Yulin-W/alternate-history-editor/master/Sample%20Timelines/The%20Great%20Penguin%20War.json)
![](https://raw.githubusercontent.com/Yulin-W/alternate-history-editor/master/Sample%20Timelines/Great%20Penguin%20War.gif)

## Historic (Approximately) Scenarios
[565AD: Dead of Justinian I of Rome (Byzantine)](https://raw.githubusercontent.com/Yulin-W/alternate-history-editor/master/Historic%20Scenarios/565AD.json)
![](https://raw.githubusercontent.com/Yulin-W/alternate-history-editor/master/Historic%20Scenarios/565AD.PNG)

## Usage

### Notes
- Loading up the tool may take some time, please be patient (or come and help refactor code to speed it up ^_^)
- Using the admin level map will be rather laggy, so for most purposes rather use national level map
- Double click legend label to edit (click elsewhere or press Enter to finish editing)
- Added new time points inherit the map of the previous time point (makes timeline mapping easier)
- To use offline, you'll need to setup a local server and then open the main.html there
- Leaflet 1.6.0 was used

### Possible uses
- Alternate history timeline making OFC ^_^
- Creating coloured maps in general with annotations, for say demographics and so on

### Keyboard shortcuts
- Shift + Enter: inserts new timeline entry under currently focused entry
- Shift + Backspace: deletes currently focused timeline entry

## Development

### BUGS
- Tab changeing of timeline cells (currently disabled as might cook many other coupled things relating to focused element and clicked element)

### Planned functionalities
- [x] Timeline editor (each time point specified will have corresponding map; by default map of new time point inherits those of preceding time point)
- [x] Map colourer (via working with Leaflet, geoJSON)
- [x] Save and load files

### Possible future additional changes (unlikely though in the near future)
- Importing not entire timelines but only single timepoint or multiple from a timeline file to next cell (Suggest focus on dis as helps merge timeline files)
- Different map layers (e.g. terrain, population density, etc.)
- Allow somehow to read from say images geojson, e.g. get historic borders
- Allow entry adding that doesn't inherit previous as well for non timeline maps
- More parameter customisation, e.g. (parts could come from the geojson data used) (much of some implementable features should already be in geojson data anyway)
  - Flag
  - Population
  - GDP
- GIF generation of timeline (so like those border youtube videos)
- Loading previously made timelines
- Allow switching between different basemaps (with different divisions)
- More border customisation
- Allow more colour choices and customisation
- Statistics page for evaluations of land size and population to well, make one feel good lol like in civ4
- Get a better interface theme
- Refactor code to reduce coupling, and finish up those optional todos
  - Ideally focus more on functional programming ideas and focus on pure functions and separate data and gui to avoid coupling
- More map options as opposed to just the world map (for faster speeds and also finer regional distinctions, and also to allow use for say different maps in general)

## Extra Acknowledgements
- geoJSON had data originally from Natural Earth (https://www.naturalearthdata.com) and converted to geoJSON at https://geoconverter.hsr.ch/vector
