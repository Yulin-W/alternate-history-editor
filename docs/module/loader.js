// This file aims to ensure back-ward compatibility of save files
// Right now im doing a graduated thing of converting 1.0 to 1.1 and 1.1 to 1.2 and so on via functions for each, maybe it gets bad later but it'll be easy to refactor I assume so should be fine

export class Loader { // Class which loads saves into the app, converting them regardless of version to the current version
    constructor() {
        this.currentSaveVersion = "1.1";
    }

    processSave(save) { // takes json parsed object file from menubar and converts it to the newest version
        let version = this.detectSaveVersion(save);

        if (version === "1.0") {
            return this.one_zero_to_one_one(save);
        } else if (version == this.currentSaveVersion) { // no modification needed
            return save;
        }
    }

    one_zero_to_one_one(save) { // converts 1.0 ver save to 1.1 ver save TODO: slight concerns as maybe pass by reference not value
        save.version = this.currentSaveVersion;
        let order = 0;
        Object.values(save.entryDict).forEach(entry => {
            // Assigns order based on current order of entryDict (which is insertion order I think if I remembered correction for such string keys)
            entry["order"] = order;
            order++;
        });
        return save;
    }

    detectSaveVersion(save) { // detects save version from
        if ("version" in save) { // case of versions from 1.1 onwards which has
            return save.version;
        } else { // case of version 1.0, as it didn't have a version attribute
            return "1.0";
        }
    }
}