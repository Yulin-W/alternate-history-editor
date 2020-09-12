## Development

### General
- Leaflet 1.6.0 was used

### Bugs
- Lasso tool doesn't wor under equirectangular projection

### Possible future additional changes (unlikely though in the near future)
- Timeline features
	- Allow shuffling timeline entry order around
	- Allow timeline entry duplication
	- Allow entry adding that doesn't inherit previous as well for non timeline maps
- Map
	- Change colours from legend/select regions of same colour; perhaps use leaflet search?
	- On map label functionality
	- Different map layers (e.g. terrain, population density, etc.)
	- Statistics page for evaluations of say number of regions under a colour, etc.
	- Don't render borders when zoomed far out for ease of view
	- Highlight all regions belonging to the legend entry when hovering over legend
- Colouring
	- Styling polygons with images and patterns other than pure colours (should be a plugin somewhere)
- General
	- Allow arrow key switching between timeline entries
	- Get a better interface theme
	- Integrate historic scenario and additional basemaps
	- Refactor code to reduce coupling, and finish up those optional todos
  		- Ideally focus more on functional programming ideas and focus on pure functions and separate data and gui to avoid coupling
