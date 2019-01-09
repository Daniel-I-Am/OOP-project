class TitleView extends BaseView {
    private menuMusic: SoundHelper;
    private active: boolean;

    public constructor(
        buttonCallback: (event: MouseEvent) => void
    ) {
        super();
        this.active = true;
        this.shouldClear = false;
        let buttonImage = new Image();
        buttonImage.addEventListener('load', () => {
            this.canvasHelper.drawButton(
                buttonImage, "Play!", 96,
                this.canvasHelper.getCenter(),
                new Vector(buttonImage.width*5, buttonImage.height*5),
                buttonCallback
            )
        });
        buttonImage.src = "./assets/images/buttonGreen.png";
        let _listener = () => {
            window.removeEventListener('mousemove', _listener);
            if (!this.active) return;
            this.menuMusic = new SoundHelper("./assets/sounds/CupcakeRain.mp3");
            this.menuMusic.toggleLoop();
        }
        window.addEventListener('mousemove', _listener);

        let controlButtonImage = new Image();
        controlButtonImage.addEventListener('load', () => {
            this.canvasHelper.drawButton(
                buttonImage, "Controls", 44,
                this.canvasHelper.getCenter().add(new Vector(0, 200)),
                new Vector(buttonImage.width*5, buttonImage.height*5),
                (event: MouseEvent) => {
                    Game.switchView(new ControlView());
                }
            )
        });
        controlButtonImage.src = "./assets/images/buttonGreen.png"
    }
    
    protected update() {}
    protected drawGUI() {}
    public beforeExit() {
        this.active = false;
        if (this.menuMusic)
            this.menuMusic.pause();
    }
    public onPause() {}
}