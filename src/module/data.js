export class DataStorage { // Storage class for holding EntryStorage instances indexed by id of entry
    constructor() {
        this.entryDict = {}; // dictionary holding dictionaries indexed by the id of the timeline entry
        this.mapType = "nation";
        this.entryCount = 0;
    }

    resetEntryDict() {
        this.entryDict = {};
    }

    addEntry(date = "", event = "", mapData = {}, legendData = {}) {
        let currentID = this.entryCount;
        this.entryDict[currentID] = {
            "date": date, // date string
            "event": event, // event string
            "mapData": mapData, //dictionary of FEATURE_ID: colour_id
            "legendData": legendData //dictionary indexed by colour to dictionary of number of the colour and legend entry
        };
        this.entryCount++; //increments entryCount such that no id (key) in entryDict will ever be the same #TODO: potential loop hole though if you have so many ids that this count overflows, but I doubt it tbh
    }
}