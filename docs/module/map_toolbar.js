import { colours } from './colours.js';
import "../leaflet-plugins/leaflet-lasso.umd.js";


export class MapToolbar {
    constructor(mapInterface) {
        this.mapInterface = mapInterface
        this.initialiseColourChoice();
        this.initialiseColourMode();
    }

    initialiseColourChoice(mapInterface) {
        this.colourChoice = document.querySelector("#colour-choice");
        this.colourOptionDict = {};
        Object.keys(colours).forEach(colourID => {
            const colourElement = document.createElement("li");
            colourElement.classList.add("colour");
            colourElement.id = colourID;
            colourElement.style.backgroundColor = colours[colourID];
            this.colourChoice.appendChild(colourElement);
            this.colourOptionDict[colourElement.id] = colourElement;
        });
        Object.values(this.colourOptionDict).forEach(colourElement => {
            colourElement.addEventListener("click", () => {
                if (this.currentColour) // If there is already a selected colour, remove its active status
                    this.currentColour.classList.remove("active");
                colourElement.classList.add("active");
                this.currentColour = colourElement; // Note current colour pointsx to colour element
            });
        });
    }

    initialiseColourMode() { // Initialises basics of the colour mode toolbar
        this.colourModeToolbar = document.querySelector("#colour-mode");
        this.fillModeIDText = {
            "fill-single": "Single Fill",
            "fill-lasso": "Lasso Fill"
        };
        this.fillModeDict = {};
        for (let [modeID, modeText] of Object.entries(this.fillModeIDText)) {
            const modeElement = document.createElement("li");
            modeElement.classList.add("fill-mode");
            modeElement.id = modeID;
            modeElement.innerText = modeText;
            this.colourModeToolbar.appendChild(modeElement);
            modeElement.addEventListener("click", () => {
                if (this.currentMode) // If there is already a selected colour, remove its active status
                    this.currentMode.classList.remove("active");
                modeElement.classList.add("active");
                this.currentMode = modeElement;
            });
            this.fillModeDict[modeID] = modeElement; // note current mode points to mode element
        }
        this.initialiseLassoSelect();
        this.fillModeDict["fill-single"].click(); // set to the default single fill option
    }

    initialiseLassoSelect() {
        this.lasso = L.lasso(this.mapInterface.map);
        this.lasso.setOptions({intersect: true});
        this.fillModeDict["fill-lasso"].addEventListener("click", () => {
            if (this.lasso.enabled()) {
                this.lasso.disable();
            } else {
                this.lasso.enable();
            }
        });
        this.mapInterface.map.on('lasso.finished', event => {
            event.layers.forEach(layer => {
                this.mapInterface.mapLayersInterface.singleFill(layer);
            });
            this.fillModeDict["fill-single"].click(); // return to default single fill option TODO: perhaps set lasso fill as right click? so won't need this return to default issue?
        });
    }

    resetColourBorders() { // Resets all colour option borders by removing all on-map tags, but not current colour though nor hovered on
        Object.values(this.colourOptionDict).forEach(colour => {
            colour.classList.remove("on-map");
        });
    }
}