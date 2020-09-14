import { scenario356BC } from '../assets/scenarios/356BC-Birth-of-Alexander.js';
import { scenario1206 } from '../assets/scenarios/1206-Rise-of-Mongolia.js';
import { scenario1444 } from '../assets/scenarios/1444AD-Battle-of-Varna.js';
import { scenario1936 } from '../assets/scenarios/1936AD.js';

export class ScenarioLoader {
    constructor() {
        // Scenario order (as dictionaries aren't naturally ordered, but we want them in time order)
        this.scenarioOrder = [
            "356BC",
            "1206",
            "1444",
            "1936",
        ]

        // Scenario dict
        this.scenarioDict = {};
        this.scenarioDict["356BC"] = {};
        this.scenarioDict["356BC"]["file"] = scenario356BC;
        this.scenarioDict["356BC"]["description"] = "Birth of Alexander";
        this.scenarioDict["1206"] = {};
        this.scenarioDict["1206"]["file"] = scenario1206;
        this.scenarioDict["1206"]["description"] = "Rise of Mongolia";
        this.scenarioDict["1444"] = {};
        this.scenarioDict["1444"]["file"] = scenario1444;
        this.scenarioDict["1444"]["description"] = "Battle of Varna";
        this.scenarioDict["1936"] = {};
        this.scenarioDict["1936"]["file"] = scenario1936;
        this.scenarioDict["1936"]["description"] = "Coming of the Storm - WWII";
    }
}