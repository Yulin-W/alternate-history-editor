# alternate-history-editor

## Notes
- Using the admin level map will be rather laggy, so for most purposes rather use national level map
- Nation level map doesn't have nation names yet

## Possible uses
- Alternate history timeline OFC ^_^
- Creating timeline of borders for the existing history (so good for say keep track of border changes for notes for history students (well, maybe))

## Instructions
- Shift + Enter: inserts new timeline entry under currently focused entry
- Shift + Backspace: deletes currently focused timeline entry

## Planned functionalities
- [ ] Timeline editor (each time point specified will have corresponding map; by default map of new time point inherits those of preceding time point)
- [ ] Border/map editor (via working with Leaflet, geoJSON)
- [ ] Exportable to common formats (e.g. timeline to txt, timeline & corresponding maps to word, etc.)

## Possible future additional changes
- Refactoring to clean up code
- Different map layers (e.g. terrain, population density, etc.)
- More parameter customisation, e.g.
  - Flag
  - Population
  - GDP
- GIF generation of timeline (so like those border youtube videos)
- Loading previously made timelines
- Allow switching between different basemaps (with different divisions)
- More border customisation
- Allow more colour choices and customisation
- Statistics page for evaluations of land size and population to well, make one feel good lol like in civ4

## Acknowledgements
- geoJSON Natural Earth data: martynafford (https://github.com/martynafford/natural-earth-geojson)