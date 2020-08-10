export class DataStorage { // Storage class for holding EntryStorage instances indexed by id of entry
    constructor() {
        this.entryDict = {}; // dictionary holding dictionaries indexed by the id of the timeline entry
        this.mapType = "nation";
        this.customMap = false;
        this.customMapGeojson = null;
        this.entryCount = 0;
    }

    resetEntryDict() {
        this.entryDict = {};
    }

    addEntry(date = "", event = "", order = 0, mapData = {}, legendData = {}) {
        let currentID = this.entryCount;
        this.entryDict[currentID] = {
            "date": date, // date string
            "event": event, // event string
            "order": order, // integer holding order of the entry, order starts at 0, note the way I structred the program ensures that order is always keps to its minimal range starting from 0 up to some positive integer by shifting entries' orders corresponding to addition or deletion of entry
            "mapData": mapData, //dictionary of FEATURE_ID: colour_id
            "legendData": legendData //dictionary indexed by colour to dictionary of number of the colour and legend entry
        };
        this.entryCount++; //increments entryCount such that no id (key) in entryDict will ever be the same #TODO: potential loop hole though if you have so many ids that this count overflows, but I doubt it tbh
    }

    shiftUpOrder(orderStart) { // Shifts order of all entries in the entryDict >= orderStart up by 1
        Object.values(this.entryDict).forEach(entry => {
            if (entry["order"] >= orderStart) {
                entry["order"]++;
            }
        });
    }

    shiftDownOrder(orderStart) { // Shfts order of all entries in the entryDct > orderStart down by 1 (note not including orderStart)
        Object.values(this.entryDict).forEach(entry => {
            if (entry["order"] > orderStart) {
                entry["order"]--;
            }
        });
    }
}