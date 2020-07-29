// Utilities
const colours = {};
colours["white"] = "white";
colours["gray"] = "gray";
colours["silver"] = "silver";
colours["black"] = "black";
colours["red"] = "red";
colours["crimson"] = "crimson";
colours["ruby"] = "#9B111E";
colours["yellow"] = "yellow";
colours["fire"] = "#e25822";
colours["gold"] = "gold";
colours["lime"] = "lime";
colours["persian-green"] = "#00A693";
colours["basil"] = "#579229";
colours["navy"] = "navy";
colours["sky-blue"] = "skyblue";
colours["persian - blue"] = "#1C39BB";
colours["lavender"] = "lavender";
colours["tyrian - purple"] = "#66023C";
colours["wine"] = "#722f37";
colours["brown"] = "brown";

const coloursKeys = Object.keys(colours);

// Data storage class
class EntryStorage { // Storage class for entry id indexed entries, stores date, event, map
    constructor(entryElement = null, date = "", event = "", mapData = {}) {
        this.entryElement = entryElement;
        this.date = date;
        this.event = event;
        this.mapData = mapData;
    }
}

class DataStorage { // Storage class for holding EntryStorage instances indexed by id of entry
    constructor() {
        this.entryDict = {}; // dictionary holding dictionaries indexed by the id of the timeline entry
        this.entryCount = 0;
    }

    addEntry(entryElement = null, date = "", event = "", mapData = {}) {
        let currentID = this.entryCount;
        this.entryDict[currentID] = {
            "entryElement": entryElement,
            "date": date,
            "event": event,
            "mapdata": mapData
        };
        this.entryCount++; //increments entryCount such that no id (key) in entryDict will ever be the same #TODO: potential loop hole though if you have so many ids that this count overflows, but I doubt it tbh
    }
}

// Map setup

function getColor(feature) {
    if ("colour" in feature.properties) {
        return colours[feature.properties.colour];
    } else {
        return "white";
    }
}

function style(feature) {
    return {
        fillColor: getColor(feature),
        weight: 1,
        opacity: 1,
        color: 'gray',
        dashArray: '',
        fillOpacity: 0.7
    };
}

function highlightFeature(e) {
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

    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function clickFeature(e) {
    if (appInterface.mapInterface.currentColour && appInterface.timelineInterface.currentDate) {
        let currentDate = appInterface.timelineInterface.currentDate.innerText;
        let feature = e.target.feature;
        feature.properties.colour = appInterface.mapInterface.currentColour.id;
        //appInterface.mapInterface.mapDict[currentDate][feature.properties.WOE_ID] = feature.properties.colour;
        //console.log(appInterface.mapInterface.mapDict[currentDate]);
        //console.log(feature.properties);
    }
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: clickFeature
    });
}

var map = L.map('map');
map.setView([25, 10], 2);
/*
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
*/

geojson = L.geoJSON(geojson_nation, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

var info = L.control();

info.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

info.update = function(props) {
    this._div.innerHTML = (props ?
        '<b>' + props.name + '</b><br />' :
        'Hover over a region for details');
};

info.addTo(map);


// Map editor interface

class MapInterface {
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
    }

    loadMap(date) { //FIXME: Loads map settings for specified date into map editor
        pass
    }
}



// Timeline editor interface

class TimelineInterface {

    constructor(appInterface) {
        this.appInterface = appInterface; // TODO: I feel that doing this is not a good idea, but can't think of easier way for classes in composition to communciate witht he main class
        this.timelineTable = document.querySelector("table");
        this.tbody = this.timelineTable.querySelector("tbody");
        this.addCellAddSubtractListener();
        this.resetTimeline();
    }

    resetTimeline() {
        this.tbody.innerHTML = "";
        this.entryCells = {}; // All rows
        this.allCells = []; // All date and event cells
        this.dateCells = {};
        this.eventCells = {};
        this.currentDate = null;
        this.currentCell = null;
        this.currentID = null;
        this.addEntry("0", "Beginning of the first millenium");
        this.addEntry("100", "Beginning of the second century");
    }

    updateCellList(newEntry, currentID) { // For whenever new cells are added
        console.log(newEntry);
        let cells = newEntry.querySelectorAll("td");
        this.entryCells[currentID] = newEntry;
        this.allCells.push(cells[0]);
        this.allCells.push(cells[1]);
        this.dateCells[currentID] = cells[0];
        this.eventCells[currentID] = cells[1];
        this.addCellChangeListener(cells[0]);
        this.addCellChangeListener(cells[1]);
    }

    addEntry(date = "", event = "", previousEntry = null) { // Adds new entry directly below current entry where shift enter was called and returns reference to the new date cell in the new entry
        let currentID = this.appInterface.dataStorage.entryCount;
        let newEntry = document.createElement("tr");

        const newDateCell = document.createElement("td");
        newDateCell.innerText = date;
        newDateCell.classList.add("date-cell", "button");
        newDateCell.setAttribute("contenteditable", "true");

        const newEventCell = document.createElement("td");
        newEventCell.innerText = event;
        newEventCell.classList.add("event-cell", "button");
        newEventCell.setAttribute("contenteditable", "true");

        newEntry.append(newDateCell);
        newEntry.append(newEventCell)

        if (previousEntry !== null) {
            this.tbody.insertBefore(newEntry, previousEntry.nextSibling);
        } else { // insert at default location at the end
            this.tbody.insertBefore(newEntry, null);
        }

        this.appInterface.dataStorage.addEntry(newEntry, date, event, {});

        this.updateCellList(newEntry, currentID);

        return newDateCell
    }

    addCellChangeListener(cell) { // Adds click event listener
        cell.addEventListener("click", () => {
            this.clickCell(cell);
        });
    }

    addCellAddSubtractListener() {
        document.addEventListener("keydown", (e) => {
            if (!e.repeat) {
                if (e.shiftKey) {
                    if (e.key == "Enter") { // Add a new cell after current ceell
                        e.preventDefault(); // Stops the default change line behaviour in the editable element
                        const currentEntry = this.tbody.querySelector("tr:focus-within");
                        if (currentEntry) {
                            const newDateCell = this.addEntry("", "", currentEntry);
                            this.clickCell(newDateCell);
                        }
                    } else if (e.key == "Backspace") { // Delete current cell
                        e.preventDefault();
                        const currentEntry = this.tbody.querySelector("tr:focus-within");
                        if (currentEntry) {
                            currentEntry.remove(); //TODO: add in map clearing behaviour when time event is deleted or say go to focus on previous event instead if that exists
                        }
                    }
                }
            }
        });
    }

    clickCell(cell) { // Actions to take when a cell is pressed
        //FIXME: add functionality of changeing maps to those of corresponding date when clicked
        if (this.currentCell) {
            this.currentCell.classList.remove("active");
            this.updateCorrespondingStorage(this.currentCell); // i.e. saves the edit for the current cell before changing
        }
        cell.classList.add("active");
        cell.focus();
        this.currentCell = cell;
        this.currentDate = cell.parentNode.children[0];
        this.currentID = Object.keys(this.dateCells).find(key => this.dateCells[key] === this.currentDate); // TODO: this search may well become rather inefficient, perhaps aim for a 2 way dict?
        this.updateCorrespondingStorage(this.currentID);
    }

    updateCorrespondingStorage(entryID) { // Updates corresponding Data Storage entry for the entryID specified
        this.appInterface.dataStorage.entryDict[entryID]
    }
}

// Menubar
class Menubar {
    constructor(appInterface) {
        this.appInterface = appInterface; // TODO: I feel that doing this is not a good idea, but can't think of easier way for classes in composition to communciate witht he main class
        this.newAdmin = document.querySelector("#new-admin");
        this.newAdmin.addEventListener("click", () => {
            map.removeLayer(geojson);
            geojson = L.geoJSON(geojson_admin, {
                style: style,
                onEachFeature: onEachFeature
            }).addTo(map);
            this.appInterface.timelineInterface.resetTimeline();
        });
        this.newNation = document.querySelector("#new-nation");
        this.newNation.addEventListener("click", () => {
            map.removeLayer(geojson);
            geojson = L.geoJSON(geojson_nation, {
                style: style,
                onEachFeature: onEachFeature
            }).addTo(map);
            this.appInterface.timelineInterface.resetTimeline();
        });
        this.SaveAs = document.querySelector("#save-as");
        this.SaveAs.addEventListener("click", () => {
            //FIXME:
        });
    }
}



// Overall Interface

class AppInterface {
    constructor() {
        this.dataStorage = new DataStorage();
        this.timelineInterface = new TimelineInterface(this);
        this.mapInterface = new MapInterface(this);
        this.menubar = new Menubar(this);
    }
}



// Actual initialisation

appInterface = new AppInterface()