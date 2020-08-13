import { Loader } from "./loader.js";

//TODO: this should be refined much better and faster

export class Menubar {
    constructor(appInterface) {
        this.appInterface = appInterface; // TODO: I feel that doing this is not a good idea, but can't think of easier way for classes in composition to communciate witht he main class
        this.loader = new Loader();

        // New admin map button TODO: refactor together into a single function the common parts of the load, new admin, new nation, new map choice 
        this.newAdmin = document.querySelector("#new-admin");
        this.newAdmin.addEventListener("click", () => {
            this.appInterface.dataStorage.resetEntryDict();
            this.appInterface.dataStorage.mapType = "admin";
            this.appInterface.dataStorage.customMap = false;
            this.appInterface.dataStorage.customMapGeojson = null;
            this.appInterface.mapInterface.resetMap();
            this.appInterface.timelineInterface.resetTimeline();
        });

        // New nation map button
        this.newNation = document.querySelector("#new-nation");
        this.newNation.addEventListener("click", () => {
            this.appInterface.dataStorage.resetEntryDict();
            this.appInterface.dataStorage.mapType = "nation";
            this.appInterface.dataStorage.customMap = false;
            this.appInterface.dataStorage.customMapGeojson = null;
            this.appInterface.mapInterface.resetMap();
            this.appInterface.timelineInterface.resetTimeline();
        });

        // Save button
        this.save = document.querySelector("#save");
        this.save.addEventListener("click", () => {
            // Stringifies dataStorage instance to txt for downloading
            this.appInterface.timelineInterface.updateCorrespondingStorage(this.appInterface.timelineInterface.currentID);
            let saveData = {
                version: this.loader.currentSaveVersion,
                customMap : !["nation", "admin"].includes(this.appInterface.dataStorage.mapType),
                customMapGeojson : null,
                entryDict: this.appInterface.dataStorage.entryDict,
                mapType: this.appInterface.dataStorage.mapType,
                entryCount: this.appInterface.dataStorage.entryCount
            };
            if (saveData.customMap) { // Assign geojson data if is a custom map
                saveData.customMapGeojson = this.appInterface.dataStorage.customMapGeojson;
            }
            this.saveFile("timeline.json", JSON.stringify(saveData));
        });

        // New map file choice button
        this.mapFromFile = document.querySelector("#custom-map");
        this.fileChoiceMap = document.querySelector("#file-choice-map"); //TODO: ideally make this same class as below fle choice and resue the read filel functionality
        this.fileChoiceMap.addEventListener("change", () => { // Setup file load TODO: move dis to a function I'd say, alongside load button for some reuse ability
            if (this.fileChoiceMap.value !== "") { // avoid triggering the file load process when the fileChoice value is reset to "" at the end of file load processes
                let fr = new FileReader();
                fr.onload = () => {
                    let geojson_new = JSON.parse(JSON.stringify(JSON.parse(fr.result))); // for some reason direct parsing cooks with data mutation and so on, so did this
                    // Update data storage
                    this.appInterface.dataStorage.resetEntryDict();
                    this.appInterface.dataStorage.mapType = this.fileChoiceMap.files[0].name;
                    this.appInterface.dataStorage.customMap = true;
                    this.appInterface.dataStorage.customMapGeojson = geojson_new;
                    // Load in map
                    this.appInterface.mapInterface.loadCustomMap(geojson_new);
                    this.appInterface.timelineInterface.resetTimeline();
                    this.fileChoiceMap.value = ""; // reset fileChoice input value so that in the case where the new chosen file was the previous, the load function would still trigger as "change" event would still be fired
                }
                fr.readAsText(this.fileChoiceMap.files[0]);
            }
        });
        this.mapFromFile.addEventListener("click", () => {
            this.fileChoiceMap.click();
        });

        // Load button
        this.load = document.querySelector("#load");
        this.fileChoice = document.querySelector("#file-choice");
        this.fileChoice.addEventListener("change", () => { // Setup file load TODO: move dis to a function I'd say
            if (this.fileChoice.value !== "") { // avoid triggering the file load process when the fileChoice value is reset to "" at the end of file load processes
                let fr = new FileReader();
                fr.onload = () => {
                    let result = this.loader.processSave(JSON.parse(JSON.stringify(JSON.parse(fr.result)))); // for some reason direct parsing cooks with data mutation and so on, so did this
                    this.appInterface.dataStorage.resetEntryDict();
                    // Note save version is not loaded into memory as it doesn't need to be, not including it saves a minute bit of memory
                    this.appInterface.dataStorage.entryDict = result.entryDict;
                    this.appInterface.dataStorage.entryCount = result.entryCount;
                    this.appInterface.dataStorage.mapType = result.mapType;
                    this.appInterface.dataStorage.customMap = result.customMap;
                    this.appInterface.dataStorage.customMapGeojson = result.customMapGeojson;
                    this.appInterface.mapInterface.resetMap();
                    this.appInterface.timelineInterface.loadTimeline();
                    this.fileChoice.value = ""; // reset fileChoice input value so that in the case where the new chosen file was the previous, the load function would still trigger as "change" event would still be fired
                }
                fr.readAsText(this.fileChoice.files[0]);
            }
        });
        this.load.addEventListener("click", () => {
            this.fileChoice.click();
        });

        // Help button
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

        // Initialise options holder dict
        this.optionsDict = {
            underLay: "geo",
        };

        // Options button
        this.initialiseOptions();
        this.updateOptions(this.optionsDict);

    }

    initialiseOptions() { // Initialise options button
        this.options = document.querySelector("#options");
        this.optionsModal = document.querySelector("#options-modal");
        this.optionsModalClose = this.optionsModal.getElementsByClassName("close")[0];
        this.optionsItems = this.optionsModal.querySelectorAll(".option-item");
        this.optionSettings = {};
        this.writeOptions();
        this.updateOptions();

        this.options.addEventListener("click", () => { // Open help when click
            this.optionsModal.style.visibility = "visible";
            this.optionsModal.style.opacity = 1;
        });
        this.optionsModalClose.addEventListener("click", () => { // Close help when click close
            this.optionsModal.style.visibility = "hidden";
            this.optionsModal.style.opacity = 0;
            this.writeOptions();
            this.updateOptions();
        });
    }

    writeOptions() { // Writes options in option input to options dict
        this.optionsItems.forEach(item => {
            this.optionSettings[item.id] = item.checked;
        });
    }

    updateOptions(optionsDict) { // Updates underlying options based on options dict input
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
}