# alternate-history-editor

## Notes
- Using the admin level map will be rather laggy, so for most purposes rather use national level map
- Nation level map doesn't have nation names yet
- Need to refactor to clean up code and split files

## BUGS
- Admin map colouring appears to colour in everything after switching time poits
- Need to ensure olour change upon assign, not upon mouse leaving region
- Strange map data leak issues and causes colour assigning to cook

## Possible uses
- Alternate history timeline OFC ^_^
- Creating timeline of borders for the existing history (so good for say keep track of border changes for notes for history students (well, maybe))

## Instructions
- Shift + Enter: inserts new timeline entry under currently focused entry
- Shift + Backspace: deletes currently focused timeline entry

## Planned functionalities
- [x] Timeline editor (each time point specified will have corresponding map; by default map of new time point inherits those of preceding time point)
- [x] Map colourer (via working with Leaflet, geoJSON)
- [ ] Exportable to common formats (e.g. timeline to txt, timeline & corresponding maps to word, etc.)

## Possible future additional changes
- Refactoring to clean up code
- Different map layers (e.g. terrain, population density, etc.)
- More parameter customisation, e.g. (parts could come from the geojson data used)
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