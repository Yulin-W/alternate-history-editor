export class TimelineInterface {

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
        this.currentEvent = null;
        this.currentCell = null;
        this.currentID = null;
        this.addEntry("0", "Beginning of the first millenium");
        this.addEntry("100", "Beginning of the second century");
    }

    updateCellList(newEntry, currentID) { // For whenever new cells are added
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
        let currentID = this.appInterface.dataStorage.entryCount; // TODO: such currentID variable is bad as easily mistaken for the this.currenID variable
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
        newEntry.append(newEventCell);

        this.appInterface.dataStorage.addEntry(newEntry, date, event, {});

        if (previousEntry !== null) { //  there was a specified previous entry
            this.tbody.insertBefore(newEntry, previousEntry.nextSibling);
            // For copying the previous entry's map into the new entry
            let previousID = Object.keys(this.entryCells).find(key => this.entryCells[key] === previousEntry) // TODO: again, such lookup is quite slow I'd reckon; note we didn't just take currentID - 1 as due to insertions and deletions the ids may well not be in order
            this.appInterface.dataStorage.entryDict[currentID]["mapData"] = JSON.parse(JSON.stringify(this.appInterface.dataStorage.entryDict[previousID]["mapData"]));
        } else { // insert at default location at the end
            this.tbody.insertBefore(newEntry, null);
        }

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
                    } else if (e.key == "Backspace") { // Delete current cell //FIXME: add in data storage entry deletion and other cell list deletions
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
        if (this.currentCell) {
            this.currentCell.classList.remove("active");
            this.updateCorrespondingStorage(this.currentID);
        }
        cell.classList.add("active");
        cell.focus();
        this.currentCell = cell;
        this.currentDate = cell.parentNode.children[0];
        this.currentEvent = cell.parentNode.children[1];
        this.currentID = Object.keys(this.dateCells).find(key => this.dateCells[key] === this.currentDate); // TODO: this search may well become rather inefficient, perhaps aim for a 2 way dict?
        this.appInterface.mapInterface.loadMap(this.appInterface.dataStorage.entryDict[this.currentID]["mapData"]);
    }

    updateCorrespondingStorage(entryID) { // Updates corresponding Data Storage entry info for date and event for the entryID specified
        this.appInterface.dataStorage.entryDict[entryID]["date"] = this.currentDate.innerText;
        this.appInterface.dataStorage.entryDict[entryID]["event"] = this.currentEvent.innerText;
    }
}