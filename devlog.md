## Development

### General
- Leaflet 1.6.0 was used

### Planned core functionalities
- [x] Timeline editor (each time point specified will have corresponding map; by default map of new time point inherits those of preceding time point)
- [x] Map colourer (via working with Leaflet, geoJSON)
- [x] Save and load files

### Possible future additional changes (unlikely though in the near future)
- Generate colouring based on uploaded images
- Exporting to word format with timeline and images
- Importing not entire timelines but only single timepoint or multiple from a timeline file to next cell (Suggest focus on dis as helps merge timeline files)
- Different map layers (e.g. terrain, population density, etc.)
- Allow somehow to read from say images geojson, e.g. get historic borders
- Allow shuffling timeline entry order around
- Allow timeline duplication entries
- Change colours from legend/select regions of same colour; perhaps use leaflet search?
- Allow entry adding that doesn't inherit previous as well for non timeline maps
- More parameter customisation, e.g. (parts could come from the geojson data used) (much of some implementable features should already be in geojson data anyway)
- GIF generation of timeline (so like those border youtube videos)
- Onmap label functionality
- Styling polygons with images and patterns other than pure colours (should be a pluging somewhere)
- Statistics page for evaluations of say number of regions uncder a colour, etc.
- Leaflet measure for area measuring and length measurememnt and coordinate finding
- Don't render borders when zoomed far out for ease of view
- Highlight all regions belonging to the legend entry when hovering over legend
- Allow arrow key switching between timeline entries
- Get a better interface theme
- Integrate historic scenario and additional basemaps
- Refactor code to reduce coupling, and finish up those optional todos
  - Ideally focus more on functional programming ideas and focus on pure functions and separate data and gui to avoid coupling
