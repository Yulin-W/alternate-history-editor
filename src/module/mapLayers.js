import { colours } from './colours.js';
import { geojson_rivers } from '../assets/layers/rivers.js'
import { geojson_lakes } from '../assets/layers/lakes.js'
import { geojson_nation } from './map_nation.js';
import { geojson_admin } from './map_admin.js';

export class MapLayersInterface {
    constructor(mapInterface) {
        this.mapInterface = mapInterface;

        // TODO: consider adding a optiions page to allow options such as adding underneath a OpenStreat map or terrain map or whatever
        // Initialise basemap
        this.geojson = L.geoJSON(geojson_nation, {
            style: this.style,
        }).addTo(this.mapInterface.map); // Here added to map as it is the default base

        // Initialise overlays
        this.initialiseGeoOverlay();
        this.initialiseLakesOverlay();
        this.initialiseRiversOverlay();

        // Add layer control (note the order matters, below overlayer variables are defined in the initialisation part before this)
        this.baseLayers = {
            "Base Map": this.geojson,
        }
        this.overlayers = {
            "Geographic": this.geoOverlay,
            "Lakes": this.lakesOverlay,
            "Rivers": this.riversOverlay,
        }

        // Add layer control to map
        this.layerControl = L.control.layers(this.baseLayers, this.overlayers).addTo(this.mapInterface.map);
        this.layerControl.setPosition("topleft");
    }

    initialiseRiversOverlay() { // adds riverss map overlay
        this.riversOverlay = L.geoJSON(geojson_rivers);
    }

    initialiseLakesOverlay() { // adds lakes map overlay
        this.lakesOverlay = L.geoJSON(geojson_lakes);
    }

    initialiseGeoOverlay() { // adds geographic map underlay
        this.geoOverlay = L.imageOverlay(
            "./assets/layers/mercator-topographic.jpg",
            L.latLngBounds(
                L.latLng(85.5,-180.2),
                L.latLng(-85.5,180)
            ),
        ).addTo(this.mapInterface.map); // As this is the default
    }

    bringOverlayForward(overlayID) {
        this.overlayers[overlayID].bringToFront();
    }

    bringOverlayBack(overlayID) {
        this.overlayers[overlayID].bringToBack();
    }

    addFeatureListeners() { // Adds event listeners to interactionswith the basemap features
        Object.values(this.geojson._layers).forEach(layer => {
            layer.addEventListener("mouseover", (e) => {
                this.highlightFeature(e)
            });
            layer.addEventListener("mouseout", (e) => {
                this.resetHighlight(e)
            });
            layer.addEventListener("click", (e) => {
                this.clickFeature(e)
            });
        });
    }

    initialiseFeatureID() { // Initialises the FEATURE_ID for the layers as their reference (relies on the order preserving nature of geojson js varibles we have to ensure the same feature has the same ID everytime)
        let currentID = 0;
        Object.values(this.geojson._layers).forEach(layer => {
            layer.feature.properties.FEATURE_ID = currentID;
            currentID++;
        });
    }

    style(feature) {
        return {
            fillColor: 'white',
            weight: 1,
            opacity: 1,
            color: 'gray',
            dashArray: '',
            fillOpacity: 0.6
        };
    }

    highlightFeature(e) {
        var layer = e.target;
        let currentID = this.mapInterface.appInterface.timelineInterface.currentID;

        layer.setStyle({
            weight: 2,
            color: 'black',
            dashArray: '',
        });

        if ("colour_on_map" in layer.feature.properties) {
            this.mapInterface.mapToolbar.colourOptionDict[layer.feature.properties.colour_on_map].classList.add("hovered-on"); // Identifies which colour the region is
            this.hadPrevHovered = true; // Keep a status for faster removal fo hovered status
            this.prevHovered = this.mapInterface.mapToolbar.colourOptionDict[layer.feature.properties.colour_on_map] // Keep a reference to the colour for faster class removal later
        }
        this.mapInterface.infoInterface.updateInfo(layer.feature.properties, this.mapInterface.appInterface.dataStorage.entryDict[currentID]["legendData"]);
    }

    resetHighlight(e) {
        let layer = e.target;
        layer.setStyle({
            weight: 1,
            color: 'gray',
        });
        if (this.hadPrevHovered) {
            this.prevHovered.classList.remove("hovered-on");
        }
        this.mapInterface.infoInterface.updateInfo();
    }

    clickFeature(e) { // TODO: refactor to simplify
        if (this.mapInterface.mapToolbar.currentColour && this.mapInterface.appInterface.timelineInterface.currentDate) { // Given there is a current colour and current date selected
            let currentID = this.mapInterface.appInterface.timelineInterface.currentID;
            let feature = e.target.feature;
            let currentColour = this.mapInterface.mapToolbar.currentColour.id; // id of the currentColour element.
            e.target.setStyle({ // Actual colouring of the feature
                fillColor: colours[currentColour]
            });
            if (feature.properties.colour_on_map in this.mapInterface.appInterface.dataStorage.entryDict[currentID]["legendData"]) { // Deals with legend data
                this.mapInterface.appInterface.dataStorage.entryDict[currentID]["legendData"][feature.properties.colour_on_map]["count"]--; //decrement count on the colour to be altered
                if (this.mapInterface.appInterface.dataStorage.entryDict[currentID]["legendData"][feature.properties.colour_on_map]["count"] === 0) { // Remove colour entry in legendData if its count becomes 0
                    delete this.mapInterface.appInterface.dataStorage.entryDict[currentID]["legendData"][feature.properties.colour_on_map];
                    this.mapInterface.mapToolbar.colourOptionDict[feature.properties.colour_on_map].classList.remove("on-map"); // Changes look of corresponding colour on colour choice to signal not on map anymore
                }
            }
            if (currentColour === "no-colour") { // Case of no-colouring option
                delete this.mapInterface.appInterface.dataStorage.entryDict[currentID]["mapData"][feature.properties.FEATURE_ID]; // Deletes mapData entry
                delete feature.properties["colour_on_map"];
            } else if (currentColour !== "no-colour") { // Case other than where no-colour colouring option was selected
                feature.properties.colour_on_map = currentColour;
                this.mapInterface.appInterface.dataStorage.entryDict[currentID]["mapData"][feature.properties.FEATURE_ID] = currentColour; // Alter mapData record for the feature
                if (!(currentColour in this.mapInterface.appInterface.dataStorage.entryDict[currentID]["legendData"])) { // Deal with if the new colour isn't recorded in legendData yet
                    this.mapInterface.appInterface.dataStorage.entryDict[currentID]["legendData"][currentColour] = {
                        count: 0,
                        entry: "Label"
                    };
                    this.mapInterface.mapToolbar.colourOptionDict[feature.properties.colour_on_map].classList.add("on-map"); // Changes look on colour choice for corresponding colour to signal on map
                }
                this.mapInterface.appInterface.dataStorage.entryDict[currentID]["legendData"][currentColour]["count"]++; // increment count on the colour to be altered
            }
            this.mapInterface.legendInterface.updateLegend(this.mapInterface.appInterface.timelineInterface.currentID);
            this.mapInterface.infoInterface.updateInfo(feature.properties, this.mapInterface.appInterface.dataStorage.entryDict[currentID]["legendData"]);
        }
    }

    resetMap(mapType) {
        this.mapInterface.map.removeLayer(this.geojson);
        this.layerControl.removeLayer(this.geojson);
        if (mapType === "nation") {
            this.geojson = L.geoJSON(geojson_nation, {
                style: this.style,
            }).addTo(this.mapInterface.map);
        } else if (mapType === "admin") {
            this.geojson = L.geoJSON(geojson_admin, {
                style: this.style,
            }).addTo(this.mapInterface.map);
        }
        this.geojson.bringToBack(); // This is to ensure that the overlay features are always visible above the map surface (note though the base image features seems to stay under, not sure why, but I'd like that anyway TODO: check why image stays under)
        this.layerControl.addBaseLayer(this.geojson, "Base Map");
        this.initialiseFeatureID();
        this.addFeatureListeners();
    }
}