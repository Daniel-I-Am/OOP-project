class TitleView extends BaseView {
    public constructor(
        buttonCallback: (event: MouseEvent) => void
    ) {
        super();
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
    }
    
    public update() {}
    protected drawGUI() {}
    public beforeExit() {}
}