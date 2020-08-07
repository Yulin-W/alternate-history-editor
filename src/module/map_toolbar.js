import { colours } from './colours.js';

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
        Object.values(this.colourOptionDict).forEach(colour => {
            colour.addEventListener("click", () => {
                if (this.currentColour) // If there is already a selected colour, remove its active status
                    this.currentColour.classList.remove("active");
                colour.classList.add("active");
                this.currentColour = colour;
            });
        });
    }

    initialiseColourMode() {
        this.colourModeToolbar = document.querySelector("#colour-mode");
        this.singleFill = document.createElement("li");
        this.singleFill.classList.add("fill-mode");
        this.singleFill.classList.add("active");
        this.singleFill.id = "fill-single";
        this.singleFill.innerText = "Single Fill";
        this.colourModeToolbar.appendChild(this.singleFill);
        this.rectFill = document.createElement("li");
        this.rectFill.classList.add("fill-mode");
        this.rectFill.id = "fill-rect";
        this.rectFill.innerText = "Rectangle Fill";
        this.colourModeToolbar.appendChild(this.rectFill);
    }

    resetColourBorders() { // Resets all colour option borders by removing all on-map tags, but not current colour though nor hovered on
        Object.values(this.colourOptionDict).forEach(colour => {
            colour.classList.remove("on-map");
        });
    }
}