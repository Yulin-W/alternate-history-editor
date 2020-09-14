import { Loader } from "./loader.js"; // save loader
import { ScenarioLoader } from "./scenarioLoader.js";

//TODO: this should be refined much better and faster

export class Menubar {
    constructor(appInterface) {
        this.appInterface = appInterface; // TODO: I feel that doing this is not a good idea, but can't think of easier way for classes in composition to communciate witht he main class
        this.loader = new Loader();

        // New admin map button
        this.initialiseAdminMapButton();

        // New nation map button
        this.initialiseNationMapButton();

        // Save button
        this.initialiseSaveButton();

        // New map file choice button
        this.initialiseNewMapFromFileButton();

        // Load button
        this.initialiseLoad();

        // Help button
        this.initialiseHelp();

        // Options related: curently useless as no options designed
        // Initialise options holder dict ()
        this.optionsDict = {
            underLay: "geo",
        };

        // Options button
        this.initialiseOptions();
        this.updateOptions(this.optionsDict);

        // Premade Scenarios button
        this.initialisePremadeScenarioButton();

    }

    initialisePremadeScenarioButton() {
        this.premadeScenarioButton = document.getElementById("premade-scenario");
        
        // Create modal HTML
        this.premadeScenarioModal = document.getElementById("premade-scenario-modal");
        this.premadeScenarioModalContent = document.createElement("div");
        this.premadeScenarioModalContent.classList.add("modal-content");
        this.premadeScenarioModal.appendChild(this.premadeScenarioModalContent);
        this.premadeScenarioModalClose = document.createElement("span");
        this.premadeScenarioModalClose.classList.add("close");
        this.premadeScenarioModalClose.innerHTML = "&times;";
        this.premadeScenarioModalContent.appendChild(this.premadeScenarioModalClose);
        this.premadeScenarioModalItemsContainer = document.createElement("ul");
        this.premadeScenarioModalItemsContainer.id = "scenario-container";
        this.premadeScenarioModalContent.appendChild(this.premadeScenarioModalItemsContainer);
        
        // Add modal scenario items
        this.premadeScenarioItems = this.optionsModal.querySelectorAll(".option-item");
        
        // List of scenarios
        this.scenarioLoader = new ScenarioLoader(); // initialise scenario loader
        
        // Making scenario buttons FIXME: need to make load corresponding scenario
        this.scenarioButtonDict = {};
        this.scenarioLoader.scenarioOrder.forEach(key => { // key stands for the year of the scenario
            // Scenario button interaction and appearance
            const scenarioButton = document.createElement("li");
            scenarioButton.classList.add("scenario-button");
            scenarioButton.id = key;
            scenarioButton.classList.add("button");
            scenarioButton.innerText = key + "\n" + this.scenarioLoader.scenarioDict[key]["description"];
            this.premadeScenarioModalItemsContainer.appendChild(scenarioButton);
            this.scenarioButtonDict[key] = scenarioButton;

            // Scenario button functionality
            scenarioButton.addEventListener("click", () => {
                this.loadSaveToMap(this.scenarioLoader.scenarioDict[key]["file"]);
            });
        });


        // Initialising modal click functionalities
        this.premadeScenarioButton.addEventListener("click", () => { // Open when click
            this.premadeScenarioModal.style.visibility = "visible";
            this.premadeScenarioModal.style.opacity = 1;
        });
        this.premadeScenarioModalClose.addEventListener("click", () => { // Close when click close
            this.premadeScenarioModal.style.visibility = "hidden";
            this.premadeScenarioModal.style.opacity = 0;
        });
    }

    initialiseSaveButton() {
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
    }

    initialiseNewMapFromFileButton() {
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
    }

    initialiseAdminMapButton() {
        this.newAdmin = document.querySelector("#new-admin");
        this.newAdmin.addEventListener("click", () => {
            this.appInterface.dataStorage.resetEntryDict();
            this.appInterface.dataStorage.mapType = "admin";
            this.appInterface.dataStorage.customMap = false;
            this.appInterface.dataStorage.customMapGeojson = null;
            this.appInterface.mapInterface.resetMap();
            this.appInterface.timelineInterface.resetTimeline();
        });
    }

    initialiseNationMapButton() {
        this.newNation = document.querySelector("#new-nation");
        this.newNation.addEventListener("click", () => {
            this.appInterface.dataStorage.resetEntryDict();
            this.appInterface.dataStorage.mapType = "nation";
            this.appInterface.dataStorage.customMap = false;
            this.appInterface.dataStorage.customMapGeojson = null;
            this.appInterface.mapInterface.resetMap();
            this.appInterface.timelineInterface.resetTimeline();
        });
    }

    loadSaveToMap(result) {
        this.appInterface.dataStorage.resetEntryDict();
        // Note save version is not loaded into memory as it doesn't need to be, not including it saves a minute bit of memory
        this.appInterface.dataStorage.entryDict = result.entryDict;
        this.appInterface.dataStorage.entryCount = result.entryCount;
        this.appInterface.dataStorage.mapType = result.mapType;
        this.appInterface.dataStorage.customMap = result.customMap;
        this.appInterface.dataStorage.customMapGeojson = result.customMapGeojson;
        this.appInterface.mapInterface.resetMap();
        this.appInterface.timelineInterface.loadTimeline();
    }

    initialiseLoad() {
        this.load = document.querySelector("#load");
        this.fileChoice = document.querySelector("#file-choice");
        this.fileChoice.addEventListener("change", () => { // Setup file load TODO: move dis to a function I'd say
            if (this.fileChoice.value !== "") { // avoid triggering the file load process when the fileChoice value is reset to "" at the end of file load processes
                let fr = new FileReader();
                fr.onload = () => {
                    let result = this.loader.processSave(JSON.parse(JSON.stringify(JSON.parse(fr.result)))); // for some reason direct parsing cooks with data mutation and so on, so did this
                    this.loadSaveToMap(result);
                    this.fileChoice.value = ""; // reset fileChoice input value so that in the case where the new chosen file was the previous, the load function would still trigger as "change" event would still be fired
                }
                fr.readAsText(this.fileChoice.files[0]);
            }
        });
        this.load.addEventListener("click", () => {
            this.fileChoice.click();
        });
    }

    initialiseHelp() {
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