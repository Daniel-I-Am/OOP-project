class TitleView extends BaseView {
    public constructor() {
        super();
        this.shouldClear = false;
        let buttonImage = new Image();
        buttonImage.addEventListener('load', () => {
            this.canvasHelper.drawButton(
                buttonImage, "Play!",
                this.canvasHelper.getCenter(),
                new Vector(buttonImage.width, buttonImage.height),
                (event: MouseEvent) => {}
            )
        });
        buttonImage.src = "./assets/images/buttonGreen.png";
    }
    
    public update() {}
    protected drawGUI() {}
    public beforeExit() {}
}