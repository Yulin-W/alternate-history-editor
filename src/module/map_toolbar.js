export class MapToolbar {
    constructor(mapInterface) {
        this.mapInterface = mapInterface;
        this.colourOptions = document.querySelectorAll(".colour");
        this.currentColour = null; // the element of colour choice currently selected
        this.colourOptions.forEach(colour => {
            colour.addEventListener("click", () => {
                if (this.currentColour) // If there is already a selected colour, remove its active status
                    this.currentColour.classList.remove("active");
                colour.classList.add("active");
                this.currentColour = colour;
            });
        });
    }
}