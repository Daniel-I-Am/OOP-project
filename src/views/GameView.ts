class GameView extends BaseView {

    public constructor() {
        super();
    }

    public update(): void {
        this.drawGUI();
    }

    protected drawGUI(): void {
        this.canvasHelper.writeText("Hello World!", 69, this.canvasHelper.getCenter(), undefined, undefined, "black");
    }

    public beforeExit(): void {}

}