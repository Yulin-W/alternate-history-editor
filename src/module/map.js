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

    setupMap() { // For initial starup map setup
        this.map = L.map('map');
        this.map.setView([25, 10], 2);
        this.map.doubleClickZoom.disable(); // Disable double click zoom as it is used for legend editing
        this.mapLayersInterface = new MapLayersInterface(this);
        this.mapLayersInterface.initialiseFeatureID();
        this.mapLayersInterface.addFeatureListeners();
        this.legendInterface = new LegendInterface(this);
        this.infoInterface = new InfoInterface(this);
    }

    resetMap() { // For resetting map after app has started
        let mapType = this.appInterface.dataStorage.mapType;
        this.mapLayersInterface.resetMap(mapType);
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