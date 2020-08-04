export class Menubar {
    constructor(appInterface) {
        this.appInterface = appInterface; // TODO: I feel that doing this is not a good idea, but can't think of easier way for classes in composition to communciate witht he main class
        this.newAdmin = document.querySelector("#new-admin");
        this.newAdmin.addEventListener("click", () => {
            this.appInterface.dataStorage.resetEntryDict();
            this.appInterface.dataStorage.mapType = "admin";
            this.appInterface.mapInterface.resetMap();
            this.appInterface.timelineInterface.resetTimeline();
        });
        this.newNation = document.querySelector("#new-nation");
        this.newNation.addEventListener("click", () => {
            this.appInterface.dataStorage.resetEntryDict();
            this.appInterface.dataStorage.mapType = "nation";
            this.appInterface.mapInterface.resetMap();
            this.appInterface.timelineInterface.resetTimeline();
        });
        this.save = document.querySelector("#save");
        this.save.addEventListener("click", () => {
            // Stringifies dataStorage instance to txt for downloading
            Object.values(this.appInterface.timelineInterface.dateCells)[0].click();
            let saveData = {
                entryDict: this.appInterface.dataStorage.entryDict,
                mapType: this.appInterface.dataStorage.mapType,
                entryCount: this.appInterface.dataStorage.entryCount
            };
            this.saveFile("timeline.json", JSON.stringify(saveData));
        });
        this.load = document.querySelector("#load");
        this.fileChoice = this.load.querySelector(".file-choice");
        this.fileChoice.addEventListener("change", () => { // Setup file load TODO: move dis to a function I'd say
            if (this.fileChoice.value !== "") { // avoid triggering the file load process when the fileChoice value is reset to "" at the end of file load processes
                let fr = new FileReader();
                fr.onload = () => {
                    let result = JSON.parse(JSON.stringify(JSON.parse(fr.result))); // for some reason direct parsing cooks with data mutation and so on, so did this
                    this.appInterface.dataStorage.resetEntryDict();
                    this.appInterface.dataStorage.entryDict = result.entryDict;
                    this.appInterface.dataStorage.entryCount = result.entryCount;
                    this.appInterface.dataStorage.mapType = result.mapType;
                    this.appInterface.mapInterface.resetMap();
                    this.appInterface.timelineInterface.loadTimeline();
                    this.fileChoice.value = ""; // reset fileChoice input value so that in the case where the new chosen file was the previous, the load function would still trigger as "change" event would still be fired
                }
                fr.readAsText(this.fileChoice.files[0]);
            }
        });
        this.load.addEventListener("click", () => {
            this.loadFile();
        });
        this.help = document.querySelector("#help");
        this.helpModal = document.querySelector("#help-modal");
        this.helpModalClose = this.helpModal.getElementsByClassName("close")[0];
        this.help.addEventListener("click", () => { // Open help when click
            this.helpModal.style.visibility = "visible";
            this.helpModal.style.opacity = 1;
        });
        this.helpModalClose.addEventListener("click", () => { // Close help when click close
            this.helpModal.style.visibility = "hidden";
            this.helpModal.style.opacity = 0;
        });
    }

    saveFile(filename, text) {
        let element = document.createElement("a");
        element.setAttribute("href", "data:text/json;charset=utf-8," + encodeURIComponent(text));
        element.setAttribute("download", filename);
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    loadFile() {
        this.fileChoice.click();
    }
}