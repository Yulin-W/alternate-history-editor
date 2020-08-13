import { colours } from './colours.js';

export class LegendInterface {
    constructor (mapInterface) {
        this.mapInterface = mapInterface;
        this.legend = null;
        this.legend = L.control({ position: "bottomright" });
        this.legend.onAdd = function(map) {
            const div = L.DomUtil.create("div", "info legend")
            return div;
        };

        this.legend.addTo(this.mapInterface.map);
    }

    resetLegend() {
        this.legend._container.innerHTML = "";
    }

    updateLegend(currentID) { // Updates based on the data stored in dataStorage under appInterface given specified ID, also updates the color toolbar borders correspondingly
        // TODO: not the most efficient tbh as has to loop over legendData entirely
        this.legend._container.innerHTML = ""; // Clear out legend
        let legendData = this.mapInterface.appInterface.dataStorage.entryDict[currentID]["legendData"];
        this.mapInterface.mapToolbar.resetColourBorders();
        Object.keys(legendData).forEach(colourID => {
            const newEntry = document.createElement("div");
            newEntry.classList.add("legend-entry");
            const colourElement = document.createElement("div");
            colourElement.innerHTML = '<i style="background:' + colours[colourID] + '"></i>';
            // Selecting colour from legend
            colourElement.addEventListener("click", () => {
                this.selectColourByLegend(colourID);
            });
            const labelElement = document.createElement("div");
            labelElement.innerText = legendData[colourID]["entry"];

            // Functionality for editing and updating labels
            labelElement.addEventListener("dblclick", () => {
                this.legendLabelEdit(colourID, currentID, newEntry, labelElement);
            });
            newEntry.appendChild(colourElement);
            newEntry.appendChild(labelElement);
            this.legend._container.appendChild(newEntry);

            // Updates the borders of color toolbar to doubel border to show on map
            this.mapInterface.mapToolbar.colourOptionDict[colourID].classList.add("on-map");
        });;
    }

    /* FIXME:
    initialiseLegendHover(entry) { // initialises for legend element hovered functionality
        entry.addEventListener("mouseover")
        entry.addEventListener("mouseout")
    }
    FIXME:
    onHoverLegend() { // function for legend element hover behaviour

    }
    */

    selectColourByLegend(colourID) { // Selects clicked colour in legend as current colour
        this.mapInterface.mapToolbar.colourOptionDict[colourID].click();
    }

    legendLabelEdit(colourID, currentID, newEntry, labelElement) { // Edits label for a entry in a legend
        let entryInput = document.createElement("input");
        entryInput.classList.add("entry-input");
        entryInput.setAttribute("type", "text");
        entryInput.placeholder = labelElement.innerText;
        labelElement.style.display = "none";
        newEntry.appendChild(entryInput);
        entryInput.focus(); // Note click seems to not go into edit mode of input, so needed focus() instead
        entryInput.addEventListener("focusout", () => {
            if (entryInput.value != "") { // Update legend label if nonempty input given
                this.mapInterface.appInterface.dataStorage.entryDict[currentID]["legendData"][colourID]["entry"] = entryInput.value;
                labelElement.innerText = entryInput.value;
                newEntry.removeChild(entryInput);
                labelElement.style.display = "block";
            } else { // Go back to original entry label
                newEntry.removeChild(entryInput);
                labelElement.style.display = "block";
            }
        });
        entryInput.addEventListener("keydown", (e) => { // Alternative means of finishing entryInput editing
            if (e.key === "Enter") {
                e.target.blur();
            }
        });
    }
}