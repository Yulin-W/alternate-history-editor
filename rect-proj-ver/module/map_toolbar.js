import { colours } from './colours.js';

export class MapToolbar {
    constructor(mapInterface) {
        this.colourChoice = document.querySelector("#colour-choice");
        this.mapInterface = mapInterface;
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

    resetColourBorders() { // Resets all colour option borders by removing all on-map tags, but not current colour though nor hovered on
        Object.values(this.colourOptionDict).forEach(colour => {
            colour.classList.remove("on-map");
        });
    }
}