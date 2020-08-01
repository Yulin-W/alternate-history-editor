import { colours } from './colours.js';
import { geojson_nation } from './map_nation.js';
import { geojson_admin } from './map_admin.js';

// Map editor interface

export class MapInterface {
    constructor(appInterface) {
        this.appInterface = appInterface; // TODO: I feel that doing this is not a good idea, but can't think of easier way for classes in composition to communciate witht he main class
        this.mapEditor = document.querySelector("#map-editor");
        this.colourChooser = document.querySelector("#colour-choice");
        this.colourOptions = document.querySelectorAll(".colour");
        this.currentColour = null;
        this.colourOptions.forEach(colour => {
            colour.addEventListener("click", () => {
                if (this.currentColour)
                    this.currentColour.classList.remove("active");
                colour.classList.add("active");
                this.currentColour = colour;
            });
        });
        this.setupMap();
    }

    setupMap() {
        this.map = L.map('map');
        this.map.setView([25, 10], 2);
        /*
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        */
        this.geojson = L.geoJSON(geojson_nation, {
            style: this.style,
        }).addTo(this.map);
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

    loadMap(mapData = null) {
        // Set properties of all features as white (effectively resetting the map but quicker than reloading) except for those whose WOE_ID are mentioned in the mapData
        if (mapData) {
            Object.values(this.geojson._layers).forEach(layer => {
                let layerID = layer.feature.properties.WOE_ID;
                if (layerID in mapData) {
                    layer.feature.properties.colour = mapData[layerID];
                } else {
                    layer.feature.properties.colour = "white";
                }
                this.geojson.resetStyle(layer); // Refreshes the colour of the layer
            });
        } else {
            Object.values(this.geojson._layers).forEach(layer => {
                layer.feature.properties.colour = "white";
                this.geojson.resetStyle(layer); // Refreshes the colour of the layer
            });
        }
    }

    style(feature) {
        return {
            fillColor: 'white',
            weight: 1,
            opacity: 1,
            color: 'gray',
            dashArray: '',
            fillOpacity: 0.7
        };
    }

    highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 2,
            color: 'black',
            dashArray: '',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }

    resetHighlight(e) {
        this.geojson.resetStyle(e.target);
    }

    clickFeature(e) {
        if (this.appInterface.mapInterface.currentColour && this.appInterface.timelineInterface.currentDate) {
            let feature = e.target.feature;
            feature.properties.colour = this.appInterface.mapInterface.currentColour.id;
            this.appInterface.dataStorage.entryDict[this.appInterface.timelineInterface.currentID]["mapData"][feature.properties.WOE_ID] = feature.properties.colour;
        }
    }
}