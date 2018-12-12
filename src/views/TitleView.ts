class TitleView extends BaseView {
    public constructor(
        buttonCallback: (event: MouseEvent) => void
    ) {
        super();
        this.shouldClear = false;
        let buttonImage = new Image();
        buttonImage.addEventListener('load', () => {
            this.canvasHelper.drawButton(
                buttonImage, "Play!",
                this.canvasHelper.getCenter(),
                new Vector(buttonImage.width, buttonImage.height),
                buttonCallback
            )
        });
        buttonImage.src = "./assets/images/buttonGreen.png";

        this.canvasHelper.writeText(
            "Dr. Avontuur",
            96,
            new Vector(this.canvasHelper.getCenter().x, 50),
            undefined, undefined,
            "black", "Cabin Sketch"
        )
    }
    
    public update() {}
    protected drawGUI() {}
    public beforeExit() {}
}