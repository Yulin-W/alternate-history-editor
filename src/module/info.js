import { colours } from './colours.js';

export class InfoInterface {
    constructor (mapInterface) { // Sets up the hover over region info, currently gives label in legend
        this.mapInterface = mapInterface;
        this.info = null;
        this.info = L.control();
        this.info.onAdd = function(map) {
            this._div = L.DomUtil.create("div", "info");
            return this._div;
        };
        this.info.addTo(this.mapInterface.map);
        this.updateInfo();
    }

    updateInfo(properties, legendData) {
        if (properties) { // Check if properties is defined
            this.info._div.innerHTML = "Name: " + properties["name"] + "<br>";
            if (properties.colour_on_map in legendData) {
                this.info._div.innerHTML += legendData[properties.colour_on_map]["entry"];
            }
            else {
                this.info._div.innerHTML += "Unlabelled";
            }
        } else {
            this.info._div.innerHTML = "Hover over a region to see its name and label";
        }
    }
}