import { DataStorage } from './data.js';
import { TimelineInterface } from './timeline.js';
import { MapInterface } from './map.js';
import { Menubar } from './menubar.js';

export class AppInterface {
    constructor() {
        this.dataStorage = new DataStorage();
        this.timelineInterface = new TimelineInterface(this);
        this.mapInterface = new MapInterface(this);
        this.menubar = new Menubar(this);
    }
}