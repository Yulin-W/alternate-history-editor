export class DataStorage { // Storage class for holding EntryStorage instances indexed by id of entry
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
            "mapData": mapData
        };
        this.entryCount++; //increments entryCount such that no id (key) in entryDict will ever be the same #TODO: potential loop hole though if you have so many ids that this count overflows, but I doubt it tbh
    }
}