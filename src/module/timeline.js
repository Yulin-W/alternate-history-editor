import { TimelineToolbarInterface } from "./timeline_toolbar.js";

export class TimelineInterface {
    constructor(appInterface) {
        this.appInterface = appInterface; // TODO: I feel that doing this is not a good idea, but can't think of easier way for classes in composition to communciate witht he main class
        this.timelineTable = document.querySelector("table");
        this.tbody = this.timelineTable.querySelector("tbody");
        this.addCellAddSubtractListener();
        this.resetTimeline();
        
        // Things related to timelinetoolbar
        this.timelineToolbarInterface = new TimelineToolbarInterface(this);
        this.playing = false;
    }

    loadTimeline() { // For loading from a json file; practically, it reads the currently loaded timeline records in the dataStorage.entryDict
        this.clearTimeLine();
        let entryDictArray = Object.entries(this.appInterface.dataStorage.entryDict);
        entryDictArray.sort((a, b) => (a[1].order > b[1].order) ? 1 : -1); // sorts entry dict so in order
        entryDictArray.forEach(entry => {
            // TODO: here I copied part of addEntry in as the original add entry coupling with dataStorage meant duplicative entry adding in dataStorage, perhaps can reduce code use
            let entryID = entry[0];
            let value = entry[1];
            let newEntry = document.createElement("tr");

            const newDateCell = document.createElement("td");
            newDateCell.innerText = value["date"];
            newDateCell.classList.add("date-cell", "button");
            newDateCell.setAttribute("contenteditable", "true");

            const newEventCell = document.createElement("td");
            newEventCell.innerText = value["event"];
            newEventCell.classList.add("event-cell", "button");
            newEventCell.setAttribute("contenteditable", "true");

            newEntry.append(newDateCell);
            newEntry.append(newEventCell);

            this.tbody.insertBefore(newEntry, null);

            this.updateCellList(newEntry, entryID);
        });
        Object.values(this.dateCells)[0].click();
    }

    resetTimeline() { // Resets timeline to a 2 entry setup
        this.clearTimeLine();
        this.addEntry("Event date 1", "Event description 1");
        Object.values(this.dateCells)[0].click();
    }

    clearTimeLine() {
        this.tbody.innerHTML = "";
        this.entryCells = {}; // All rows
        this.allCells = []; // All date and event cells
        this.dateCells = {};
        this.eventCells = {};
        this.currentDate = null;
        this.currentEvent = null;
        this.currentCell = null;
        this.currentID = null;
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
        let currentEntryCount = this.appInterface.dataStorage.entryCount; // This is the entry count before the addition of the new entry (as such it becomes the ID of the new entry in dataStorage)

        // Prepare and make the new elements
        let newEntry = document.createElement("tr");

        const newDateCell = document.createElement("td");
        newDateCell.innerText = date;
        newDateCell.classList.add("date-cell", "button");
        newDateCell.setAttribute("contenteditable", "true");
        newDateCell.setAttribute("tabindex", "-1"); // Disables tab selection

        const newEventCell = document.createElement("td");
        newEventCell.innerText = event;
        newEventCell.classList.add("event-cell", "button");
        newEventCell.setAttribute("contenteditable", "true");
        newEventCell.setAttribute("tabindex", "-1"); // Disables tab selection

        newEntry.append(newDateCell);
        newEntry.append(newEventCell);

        // Initialise order variable
        let order = null;

        if (previousEntry !== null) { //  there was a specified previous entry //TODO: this part is pretty bad as its quite coupled
            this.tbody.insertBefore(newEntry, previousEntry.nextSibling);
            // For copying the previous entry's map into the new entry
            let previousID = Object.keys(this.entryCells).find(key => this.entryCells[key] === previousEntry) // TODO: again, such lookup is quite slow I'd reckon; note we didn't just take currentID - 1 as due to insertions and deletions the ids may well not be in order
            order = this.appInterface.dataStorage.entryDict[previousID]["order"]+1;
            this.appInterface.dataStorage.shiftUpOrder(order); // Shifts order of all entries in the entryDict >= orderStart up by 1, this line needs to be before the addEntry, else the added Entry will also get shifted
            this.appInterface.dataStorage.addEntry(date, event, order, {}, {});
            this.appInterface.dataStorage.entryDict[currentEntryCount]["mapData"] = JSON.parse(JSON.stringify(this.appInterface.dataStorage.entryDict[previousID]["mapData"]));
            this.appInterface.dataStorage.entryDict[currentEntryCount]["legendData"] = JSON.parse(JSON.stringify(this.appInterface.dataStorage.entryDict[previousID]["legendData"]));
        } else { // insert at default location at the end and has no content (no previousEntry so no inheriting of previous Entry's map)
            this.tbody.insertBefore(newEntry, null);
            order = Object.keys(this.appInterface.dataStorage.entryDict).length; // number of entries in Entry dict is equal to the order of an appended final element (as order starts from 0)
            this.appInterface.dataStorage.addEntry(date, event, order, {}, {});
        }

        this.updateCellList(newEntry, currentEntryCount);

        return newDateCell;
    }

    addCellChangeListener(cell) { // Adds click event listener
        cell.addEventListener
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
                        this.appendCellAfter();
                    } else if (e.key == "Backspace") { // Delete current cel
                        e.preventDefault(); 
                        this.deleteCurrentCell();
                    }
                }
            }
        });
    }

    appendCellAfter() {
        const currentEntry = this.tbody.querySelector("tr:focus-within");
        if (currentEntry) {
            const newDateCell = this.addEntry("", "", currentEntry);
            newDateCell.click();
        } else {
            const newDateCell = this.addEntry("", "", null);
        }
    }

    deleteCurrentCell() {
        const currentEntry = this.tbody.querySelector("tr:focus-within");
        if (currentEntry && this.tbody.childElementCount > 1) { // Ensures minimum number of entries is 1, this is because when it gets to 0 the leaflet map and map data containers in data storage start to have bugs
            this.currentCell = null;
            // Performs order shift down for all entries after the deleted entry
            let order = this.appInterface.dataStorage.entryDict[this.currentID]["order"];
            this.appInterface.dataStorage.shiftDownOrder(order);
            // Deletes entry data for the entry in dataStorage
            delete this.appInterface.dataStorage.entryDict[this.currentID];
            // Clicks to previous sibling if exists or goes to next sibling if doesn't exist

            if (currentEntry.previousSibling) {
                currentEntry.previousSibling.childNodes[0].click();
            } else if (currentEntry.nextSibling) {
                currentEntry.nextSibling.childNodes[0].click()
            }
            currentEntry.remove(); // Removes entry from the timeline
        }
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
        this.appInterface.mapInterface.legendInterface.updateLegend(this.currentID);
    }

    updateCorrespondingStorage(entryID) { // Updates corresponding Data Storage entry info for date and event for the entryID specified
        this.appInterface.dataStorage.entryDict[entryID]["date"] = this.currentDate.innerText;
        this.appInterface.dataStorage.entryDict[entryID]["event"] = this.currentEvent.innerText;
    }

    goToStart() {
        this.tbody.firstChild.firstChild.click();
    }

    async playTimeline() { // default is 100ms between each timeline date
        this.playing = true;
        while (this.currentCell.parentNode.nextSibling) {
            await new Promise(r => setTimeout(r, 400 / this.timelineToolbarInterface.playSpeed)); // base speed is 400ms
            if (!this.playing) {
                break;
            }
            this.currentCell.parentNode.nextSibling.firstChild.click();
        }
        if (!this.currentCell.parentNode.nextSibling) {
            this.timelineToolbarInterface.playButton.click();
        }
    }
}