class TitleView extends BaseView {
    public constructor() {
        super();
        let buttonImage = new Image();
        buttonImage.addEventListener('load', () => {
            this.canvasHelper.drawButton(buttonImage, "Play!", this.canvasHelper.getCenter(), (event: MouseEvent) => {})
        });
        buttonImage.src = "./assets/images/buttonGreen.png";
    }
    
    public update() {}
    protected drawGUI() {}
    public beforeExit() {}
}