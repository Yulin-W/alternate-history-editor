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

    setupMap() { // For initial starup map setup
        this.map = L.map('map');
        this.map.setView([25, 10], 2);
        this.map.doubleClickZoom.disable(); // Disable double click zoom as it is used for legend editing
        // TODO: consider adding a optiions page to allow options such as adding underneath a OpenStreat map or terrain map or whatever
        this.geojson = L.geoJSON(geojson_nation, {
            style: this.style,
        }).addTo(this.map);
        this.initialiseFeatureID();
        this.addFeatureListeners();
        this.initialiseLegend();
    }

    initialiseLegend() {
        this.legend = null;
        this.legend = L.control({ position: "bottomright" });
        this.legend.onAdd = function(map) {
            const div = L.DomUtil.create("div", "info legend")
            return div;
        };

        this.legend.addTo(this.map);
    }

    resetLegend() {
        this.legend._container.innerHTML = "";
    }

    updateLegend(currentID) { // Updates based on the data stored in dataStorage under appInterface given specified ID
        // TODO: not the most efficient tbh as has to loop over legendData entirely
        this.legend._container.innerHTML = ""; // Clear out legend
        let legendData = this.appInterface.dataStorage.entryDict[currentID]["legendData"];
        Object.keys(legendData).forEach(colourID => {
            const newEntry = document.createElement("div");
            newEntry.classList.add("legend-entry");
            newEntry.innerHTML = '<i style="background:' + colours[colourID] + '"></i>';
            const labelElement = document.createElement("div");
            labelElement.innerText = legendData[colourID]["entry"];
            labelElement.addEventListener("dblclick", () => { // Functionality for editing and updating labels
                let entryInput = document.createElement("input");
                entryInput.classList.add("entry-input");
                entryInput.setAttribute("type", "text");
                entryInput.placeholder = labelElement.innerText;
                labelElement.style.display = "none";
                newEntry.appendChild(entryInput);
                entryInput.click();
                entryInput.addEventListener("focusout", () => {
                    if (entryInput.value != "") { // Update legend label if nonempty input given
                        this.appInterface.dataStorage.entryDict[currentID]["legendData"][colourID]["entry"] = entryInput.value;
                        labelElement.innerText = entryInput.value;
                        newEntry.removeChild(entryInput);
                        labelElement.style.display = "block";
                    } else { // Go back to original entry label
                        newEntry.removeChild(entryInput);
                        labelElement.style.display = "block";
                    }
                });
                entryInput.addEventListener("keydown", (e) => { // Alternative means of finishing entryInput editing
                    if (e.key === "Enter") {
                        e.target.blur();
                    }
                });
            });
            newEntry.appendChild(labelElement);
            this.legend._container.appendChild(newEntry);
        });;
    }

    addFeatureListeners() {
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

    initialiseFeatureID() {
        let currentID = 0;
        Object.values(this.geojson._layers).forEach(layer => {
            layer.feature.properties.FEATURE_ID = currentID;
            currentID++;
        });
    }

    resetMap() { // For resetting map after app has started
        //TODO: this and setupMap method are sharing too much in common, peryhaps make a new function
        let mapType = this.appInterface.dataStorage.mapType;
        this.map.removeLayer(this.geojson);
        if (mapType === "nation") {
            this.geojson = L.geoJSON(geojson_nation, {
                style: this.style,
            }).addTo(this.map);
        } else if (mapType === "admin") {
            this.geojson = L.geoJSON(geojson_admin, {
                style: this.style,
            }).addTo(this.map);
        }
        this.initialiseFeatureID();
        this.addFeatureListeners();
        this.resetLegend();
    }

    loadMap(mapData = null) {
        // Set properties of all features as white (effectively resetting the map but quicker than reloading) except for those whose FEATURE_ID are mentioned in the mapData
        if (mapData) {
            Object.values(this.geojson._layers).forEach(layer => {
                let layerID = layer.feature.properties.FEATURE_ID;
                if (layerID in mapData) {
                    layer.setStyle({
                        fillColor: colours[mapData[layerID]]
                    });
                    layer.feature.properties.colour_on_map = mapData[layerID];
                } else {
                    layer.setStyle({
                        fillColor: "silver"
                    });
                }
            });
        } else {
            Object.values(this.geojson._layers).forEach(layer => {
                layer.setStyle({
                    fillColor: "silver"
                });
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
            fillOpacity: 1
        };
    }

    highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 2,
            color: 'black',
            dashArray: '',
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }

    resetHighlight(e) {
        e.target.setStyle({
            weight: 1,
            color: 'gray',
        });
    }

    clickFeature(e) {
        if (this.appInterface.mapInterface.currentColour && this.appInterface.timelineInterface.currentDate) {
            let currentID = this.appInterface.timelineInterface.currentID;
            let feature = e.target.feature;
            let currentColour = this.appInterface.mapInterface.currentColour.id;

            e.target.setStyle({ // Actual colouring of the feature
                fillColor: colours[currentColour]
            });
            if (feature.properties.colour_on_map in this.appInterface.dataStorage.entryDict[currentID]["legendData"]) { // Deals with legend data
                this.appInterface.dataStorage.entryDict[currentID]["legendData"][feature.properties.colour_on_map]["count"]--; //decrement count on the colour to be altered
                if (this.appInterface.dataStorage.entryDict[currentID]["legendData"][feature.properties.colour_on_map]["count"] === 0) { // Remove colour entry in legendData if its count becomes 0
                    delete this.appInterface.dataStorage.entryDict[currentID]["legendData"][feature.properties.colour_on_map];
                }
            }
            if (currentColour === "no-colour") { // Case of no-colouring option
                delete this.appInterface.dataStorage.entryDict[currentID]["mapData"][feature.properties.FEATURE_ID]; // Deletes mapData entry
            } else if (currentColour !== "no-colour") { // Case other than where no-colour colouring option was selected
                feature.properties.colour_on_map = currentColour;
                this.appInterface.dataStorage.entryDict[currentID]["mapData"][feature.properties.FEATURE_ID] = currentColour; // Alter mapData record for the feature
                if (!(currentColour in this.appInterface.dataStorage.entryDict[currentID]["legendData"])) { // Deal with if the new colour isn't recorded in legendData yet
                    this.appInterface.dataStorage.entryDict[currentID]["legendData"][currentColour] = {
                        count: 0,
                        entry: "Label"
                    }
                }
                this.appInterface.dataStorage.entryDict[currentID]["legendData"][currentColour]["count"]++; // increment count on the colour to be altered
            }
            this.updateLegend(this.appInterface.timelineInterface.currentID);
        }
    }
}