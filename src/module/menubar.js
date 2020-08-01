export class Menubar {
    constructor(appInterface) {
        this.appInterface = appInterface; // TODO: I feel that doing this is not a good idea, but can't think of easier way for classes in composition to communciate witht he main class
        this.newAdmin = document.querySelector("#new-admin");
        this.newAdmin.addEventListener("click", () => {
            map.removeLayer(geojson);
            geojson = L.geoJSON(geojson_admin, {
                style: style,
                onEachFeature: onEachFeature
            }).addTo(map);
            this.appInterface.timelineInterface.resetTimeline();
            this.appInterface.mapInterface.loadMap();
        });
        this.newNation = document.querySelector("#new-nation");
        this.newNation.addEventListener("click", () => {
            map.removeLayer(geojson);
            geojson = L.geoJSON(geojson_nation, {
                style: style,
                onEachFeature: onEachFeature
            }).addTo(map);
            this.appInterface.timelineInterface.resetTimeline();
            this.appInterface.mapInterface.loadMap();
        });
        this.SaveAs = document.querySelector("#save-as");
        this.SaveAs.addEventListener("click", () => {
            //FIXME:
        });
    }
}