export class TimelineToolbarInterface {
    constructor(timelineInterface) {
        this.timelineInterface = timelineInterface;
        this.timelineToolbarElement = document.getElementById("timeline-toolbar");
        this.setupToolbar();
    }

    setupToolbar() {
        this.setupPlayButton();
        this.setupGoToStartButton();
        this.setupPlaySpeedButton();
    }

    setupPlayButton() {
        this.playButton = document.createElement("div");
        this.playButton.id = "play-button";
        this.playButton.classList.add("button");
        this.playButton.classList.add("ready");
        this.timelineToolbarElement.appendChild(this.playButton);
        this.playButton.addEventListener("click", () => {
            if (this.playButton.classList.contains("ready")) {
                this.playButton.classList.remove("ready");
                this.playButton.classList.add("playing");
                this.timelineInterface.playTimeline();
            } else if (this.playButton.classList.contains("playing")) {
                this.playButton.classList.remove("playing");
                this.playButton.classList.add("ready");
                this.timelineInterface.playing = false;
            }
        });
    }

    setupGoToStartButton() {
        this.goToStartButton = document.createElement("div");
        this.goToStartButton.id = "go-to-start-button";
        this.goToStartButton.classList.add("button");
        this.timelineToolbarElement.appendChild(this.goToStartButton);
        this.goToStartButton.addEventListener("click", () => {
            if (this.playButton.classList.contains("playing")) {
                this.playButton.click();
            }
            this.timelineInterface.goToStart();
        });
    }

    setupPlaySpeedButton() {
        this.playSpeedButton = document.createElement("div");
        this.playSpeedButton.id = "play-speed-button";
        this.playSpeedButton.classList.add("button");
        this.playSpeedButton.classList.add("one");
        this.timelineToolbarElement.appendChild(this.playSpeedButton);
        this.playSpeed = 1;
        //TODO: perhaps make below into dictionary to allow more variable speeds? less important though tbh
        this.playSpeedButton.addEventListener("click", () => {
            if (this.playSpeed == 1) {
                this.playSpeed = 2;
                this.playSpeedButton.classList.remove("one");
                this.playSpeedButton.classList.add("two");
            } else if (this.playSpeed == 2) {
                this.playSpeed = 4;
                this.playSpeedButton.classList.remove("two");
                this.playSpeedButton.classList.add("four");
            } else if (this.playSpeed == 4) {
                this.playSpeed = 1;
                this.playSpeedButton.classList.remove("four");
                this.playSpeedButton.classList.add("one");
            }
        })
    }
}