class GameOverView extends BaseView {
    public constructor() {
        super();
    }
    public update() {}
    
    public drawGUI() {
        this.canvasHelper.fillRect(new Vector(0, this.canvasHelper.getCenter().y-50), new Vector(this.canvasHelper.getWidth(), this.canvasHelper.getCenter().y+50), "black");
        this.canvasHelper.writeText("You died!", 96, this.canvasHelper.getCenter(), undefined, undefined, "red");
    }

    public beforeExit() {}
}