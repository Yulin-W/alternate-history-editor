import { DataStorage } from './data.js';
import { TimelineInterface } from './timeline.js';
import { MapInterface } from './map.js';
import { Menubar } from './menubar.js';

export class AppInterface {
    constructor() {
        // Note the below ordering matters due to coupling between the classes
        // TODO: somehow reduce the coupling between the classes
        this.dataStorage = new DataStorage();
        this.mapInterface = new MapInterface(this);
        this.timelineInterface = new TimelineInterface(this);
        this.menubar = new Menubar(this);
    }
}