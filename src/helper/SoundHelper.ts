class SoundHelper {
    private audioElem: HTMLAudioElement;
    private state: number;
    private static audioDiv: HTMLDivElement;
    
    public constructor(src: string) {
        this.audioElem = document.createElement("audio");
        this.audioElem.setAttribute("preload", "auto");
        this.audioElem.setAttribute("controls", "none");
        this.audioElem.style.display = "none";
        this.state = PlayingStat.PLAYING;
        this.audioElem.src = src;
        this.audioElem.play();
    }

    public play() {
        this.audioElem.play();
    }
    
    public pause(state: number = null): void {
        if (this.state == PlayingStat.STOPPED) return;
        if (state) {
            switch(state) {
                case PlayingStat.PLAYING:
                    this.audioElem.play();
                    break;
                case PlayingStat.PAUSED:
                    this.audioElem.pause();
                    break;
            }
            return;
        }
        if (this.state == PlayingStat.PLAYING) {
            this.state = PlayingStat.PAUSED;
            this.audioElem.pause();
        } else if (this.state == PlayingStat.PAUSED) {
            this.state = PlayingStat.PLAYING;
            this.audioElem.play();
        }
    }
} 