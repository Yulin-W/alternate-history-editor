import { colours } from './colours.js';
import { geojson_nation } from './map_nation.js';
import { geojson_admin } from './map_admin.js';
import { MapToolbar } from './map_toolbar.js';

// Map editor interface

export class MapInterface {
    constructor(appInterface) {
        this.appInterface = appInterface; // TODO: I feel that doing this is not a good idea, but can't think of easier way for classes in composition to communciate witht he main class
        this.mapEditor = document.querySelector("#map-editor");
        this.mapToolbar = new MapToolbar(this);
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
        this.initialiseInfo();
    }

    initialiseInfo() { // Sets up the hover over region info, currently gives label in legend
        this.info = null;
        this.info = L.control();
        this.info.onAdd = function(map) {;
            this._div = L.DomUtil.create("div", "info")
            return this._div;
        };
        this.info.addTo(this.map);
        this.updateInfo();
    }

    updateInfo(properties, legendData) {
        if (properties) { // Check if properties is defined
            this.info._div.innerHTML = "Name: " + properties["name"] + "<br>";
            if (properties.colour_on_map in legendData) {
                this.info._div.innerHTML += legendData[properties.colour_on_map]["entry"];
            }
            else {
                this.info._div.innerHTML += "Unlabelled";
            }
        } else {
            this.info._div.innerHTML += "Hover over a region to see its name and label";
        }
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
            const colourElement = document.createElement("div");
            colourElement.innerHTML = '<i style="background:' + colours[colourID] + '"></i>';
            // Selecting colour from legend
            colourElement.addEventListener("click", () => {
                this.selectColourByLegend(colourID);
            });
            const labelElement = document.createElement("div");
            labelElement.innerText = legendData[colourID]["entry"];

            // Functionality for editing and updating labels
            labelElement.addEventListener("dblclick", () => {
                this.legendLabelEdit(colourID, currentID, newEntry, labelElement);
            });
            newEntry.appendChild(colourElement);
            newEntry.appendChild(labelElement);
            this.legend._container.appendChild(newEntry);

            // Updates the borders of color toolbar to doubel border to show on map
            this.mapToolbar.colourOptionDict[colourID].classList.add("on-map");
        });;
    }

    selectColourByLegend(colourID) { // Selects clicked colour in legend as current colour
        this.mapToolbar.colourOptionDict[colourID].click();
    }

    legendLabelEdit(colourID, currentID, newEntry, labelElement) { // Edits label for a entry in a legend
        let entryInput = document.createElement("input");
        entryInput.classList.add("entry-input");
        entryInput.setAttribute("type", "text");
        entryInput.placeholder = labelElement.innerText;
        labelElement.style.display = "none";
        newEntry.appendChild(entryInput);
        entryInput.focus(); // Note click seems to not go into edit mode of input, so needed focus() instead
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
                        fillColor: colours["no-colour"]
                    });
                }
            });
        } else {
            Object.values(this.geojson._layers).forEach(layer => {
                layer.setStyle({
                    fillColor: colours["no-colour"]
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
        let currentID = this.appInterface.timelineInterface.currentID;

        layer.setStyle({
            weight: 2,
            color: 'black',
            dashArray: '',
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
        if ("colour_on_map" in layer.feature.properties) {
            this.mapToolbar.colourOptionDict[layer.feature.properties.colour_on_map].classList.add("hovered-on"); // Identifies which colour the region is
            this.hadPrevHovered = true; // Keep a status for faster removal fo hovered status
            this.prevHovered = this.mapToolbar.colourOptionDict[layer.feature.properties.colour_on_map] // Keep a reference to the colour for faster class removal later
        }
        this.updateInfo(layer.feature.properties, this.appInterface.dataStorage.entryDict[currentID]["legendData"]);
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
        this.updateInfo();
    }

    clickFeature(e) { // TODO: refactor to simplify
        if (this.mapToolbar.currentColour && this.appInterface.timelineInterface.currentDate) { // Given there is a current colour and current date selected
            let currentID = this.appInterface.timelineInterface.currentID;
            let feature = e.target.feature;
            let currentColour = this.mapToolbar.currentColour.id; // id of the currentColour element.
            e.target.setStyle({ // Actual colouring of the feature
                fillColor: colours[currentColour]
            });
            console.log(feature.properties.colour_on_map);
            if (feature.properties.colour_on_map in this.appInterface.dataStorage.entryDict[currentID]["legendData"]) { // Deals with legend data
                this.appInterface.dataStorage.entryDict[currentID]["legendData"][feature.properties.colour_on_map]["count"]--; //decrement count on the colour to be altered
                console.log(this.appInterface.dataStorage.entryDict[currentID]["legendData"][feature.properties.colour_on_map]["count"]);
                console.log(this.appInterface.dataStorage.entryDict[currentID]["legendData"]);
                if (this.appInterface.dataStorage.entryDict[currentID]["legendData"][feature.properties.colour_on_map]["count"] === 0) { // Remove colour entry in legendData if its count becomes 0
                    delete this.appInterface.dataStorage.entryDict[currentID]["legendData"][feature.properties.colour_on_map];
                    this.mapToolbar.colourOptionDict[feature.properties.colour_on_map].classList.remove("on-map"); // Changes look of corresponding colour on colour choice to signal not on map anymore
                }
            }
            if (currentColour === "no-colour") { // Case of no-colouring option
                delete this.appInterface.dataStorage.entryDict[currentID]["mapData"][feature.properties.FEATURE_ID]; // Deletes mapData entry
                delete feature.properties["colour_on_map"];
            } else if (currentColour !== "no-colour") { // Case other than where no-colour colouring option was selected
                feature.properties.colour_on_map = currentColour;
                this.appInterface.dataStorage.entryDict[currentID]["mapData"][feature.properties.FEATURE_ID] = currentColour; // Alter mapData record for the feature
                if (!(currentColour in this.appInterface.dataStorage.entryDict[currentID]["legendData"])) { // Deal with if the new colour isn't recorded in legendData yet
                    this.appInterface.dataStorage.entryDict[currentID]["legendData"][currentColour] = {
                        count: 0,
                        entry: "Label"
                    };
                    this.mapToolbar.colourOptionDict[feature.properties.colour_on_map].classList.add("on-map"); // Changes look on colour choice for corresponding colour to signal on map
                }
                this.appInterface.dataStorage.entryDict[currentID]["legendData"][currentColour]["count"]++; // increment count on the colour to be altered
                console.log(this.appInterface.dataStorage.entryDict[currentID]["legendData"][feature.properties.colour_on_map]["count"]);
                console.log(this.appInterface.dataStorage.entryDict[currentID]["legendData"]);
            }
            this.updateLegend(this.appInterface.timelineInterface.currentID);
            this.updateInfo(feature.properties, this.appInterface.dataStorage.entryDict[currentID]["legendData"]);
        }
    }
}