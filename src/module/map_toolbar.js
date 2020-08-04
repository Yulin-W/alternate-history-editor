export class MapToolbar {
    constructor(mapInterface) {
        this.mapInterface = mapInterface;
        this.colourOptionDict = {};
        document.querySelectorAll(".colour").forEach(colourElement => {
            this.colourOptionDict[colourElement.id] = colourElement;
        });
        this.currentColour = null; // the element of colour choice currently selected
        Object.values(this.colourOptionDict).forEach(colour => {
            colour.addEventListener("click", () => {
                if (this.currentColour) // If there is already a selected colour, remove its active status
                    this.currentColour.classList.remove("active");
                colour.classList.add("active");
                this.currentColour = colour;
            });
        });
    }
}