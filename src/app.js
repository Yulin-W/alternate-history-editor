// Map editor interface
class MapInterface {
    constructor() {}
}

// Timeline editor interface
class TimelineInterface {
    constructor() {
        this.timelineTable = document.querySelector("table");
        this.entryCells = this.timelineTable.querySelectorAll("tr");
        this.dateCells = this.timelineTable.querySelectorAll("#date-cell");
        this.eventCells = this.timelineTable.querySelectorAll("#event-cell");
        this.eventDict = {}; // For accessing event strings via key (date string)
        this.updateEventDict();
    }

    updateEventDict() {
        this.eventDict = {};
        for (let i = 0; i < this.entryCells.length; i++) {
            this.eventDict[this.dateCells[i].innerText] = this.eventCells[i].innerText;
        }
        console.log(this.eventDict);
    }
}

// Overall Interface
class AppInterface {
    constructor() {
        this.timelineInterface = new TimelineInterface();
        this.mapInterface = new MapInterface();
    }
}

// Actual initialisation
appInterface = new AppInterface()