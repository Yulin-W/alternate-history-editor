## Development

### General
- Leaflet 1.6.0 was used

### Planned functionalities
- [x] Timeline editor (each time point specified will have corresponding map; by default map of new time point inherits those of preceding time point)
- [x] Map colourer (via working with Leaflet, geoJSON)
- [x] Save and load files

### Possible future additional changes (unlikely though in the near future)
- Add in app help
- Refactor menu bar
- Generate colouring based on uploaded images
- Exporting to word format with timeline and images
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
