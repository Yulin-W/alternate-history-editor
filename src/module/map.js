//TODO: reorganise the code in here, too clunky

import { colours } from './colours.js';
import { MapToolbar } from './map_toolbar.js';
import { InfoInterface } from './info.js';
import { LegendInterface } from './legend.js';
import { MapLayersInterface } from './mapLayers.js';

// Map editor interface

export class MapInterface {
    constructor(appInterface) {
        this.appInterface = appInterface; // TODO: I feel that doing this is not a good idea, but can't think of easier way for classes in composition to communciate witht he main class
        this.mapEditor = document.querySelector("#map-editor");
        this.setupMap();
        this.mapToolbar = new MapToolbar(this);
    }

    projectionChange(newProjection, projectionKey) {
        // Takes in a leaflet crs object and projection key in map_toolbar.projectionModeInfo as argument
        // Idea is to delete current map object, reinitiate it, and then load in from the unchanged datastorage mapdata the map
        this.map.remove();
        this.map = null;
        this.setupMap(newProjection, projectionKey);
        this.appInterface.timelineInterface.currentCell.click()// Cell click refreshes map
        this.mapToolbar.initialiseLassoSelect(); // needs to be reinitialised as lasso select requires a event listener on the map
    }

    setupMap(newProjection=null, projectionKey=null) { // For initial starup map setup
        // Takes in optional argumetn indicating the new projection to be used, if none defaults to EPSG3857
        this.currentProjection = newProjection ? newProjection : L.CRS.EPSG3857; // Mercator, default
        this.currentProjectionKey = projectionKey ? projectionKey : "mercator"; // Mercator, default
        this.map = L.map('map', {
            crs : this.currentProjection,
            // Make map scrolling smooth
            scrollWheelZoom: false,
            smoothWheelZoom: true,
            smoothSensitivity: 1,
            maxZoom: 10,
            // Set canvas as default, improves speed considerably
            renderer: L.canvas()
        });
        this.map.setView([25, 10], 2);
        this.map.doubleClickZoom.disable(); // Disable double click zoom as it is used for legend editing
        let currentGeojsonKey = "nation"; // default
        if (this.mapLayersInterface) { // in the case where there was already a mapLayers Interface, i.e. the setupMap call is not for initialising at app start but for projection change/map refresh
            if (this.appInterface.dataStorage.customMap) {
                currentGeojsonKey = "custom";
            } else {
                currentGeojsonKey = this.appInterface.dataStorage.mapType; // for case of the two built in maps nation or admin
            }
        }
        this.mapLayersInterface = new MapLayersInterface(this, this.currentProjectionKey, currentGeojsonKey);
        this.mapLayersInterface.initialiseFeatureID();
        this.mapLayersInterface.addFeatureListeners();
        this.legendInterface = new LegendInterface(this);
        this.infoInterface = new InfoInterface(this);
    }

    resetMap() { // For resetting map after app has started without remaking a map object TODO: make ti work by passing through maptype not by taking maptype from dataStorgae to reduce coupling
        let mapType = this.appInterface.dataStorage.mapType;
        this.mapLayersInterface.resetMap(mapType);
        this.legendInterface.resetLegend();
    }

    loadCustomMap(mapGeojson) { // TODO: merge with reset Map
        this.mapLayersInterface.loadCustomMap(mapGeojson);
        this.legendInterface.resetLegend();
    }

    loadMap(mapData = null) {
        // Set properties of all features as white (effectively resetting the map but quicker than reloading) except for those whose FEATURE_ID are mentioned in the mapData
        if (mapData) {
            Object.values(this.mapLayersInterface.geojson._layers).forEach(layer => {
                let layerID = layer.feature.properties.FEATURE_ID;
                if (layerID in mapData) {
                    layer.setStyle({
                        fillColor: colours[mapData[layerID]]
                    });
                    layer.feature.properties.colour_on_map = mapData[layerID];
                } else {
                    layer.setStyle({
                        fillColor: colours["no-colour"]
                    });
                }
            });
        } else {
            Object.values(this.mapLayersInterface.geojson._layers).forEach(layer => {
                layer.setStyle({
                    fillColor: colours["no-colour"]
                });
            });
        }
    }
}