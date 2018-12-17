class GameOverView extends BaseView {
    private player: Player;

    public constructor(player: Player) {
        super();
        this.player = player;
    }
    public update() {
        this.player.update();
    }
    
    public drawGUI() {
        for (let i = 0; i < 85; i++) {
            this.canvasHelper.fillRect(new Vector(0, this.canvasHelper.getCenter().y - 50 - i), new Vector(this.canvasHelper.getWidth(), this.canvasHelper.getCenter().y - 51 - i), `rgba(0, 0, 0, ${(85-i)/100})`);
            this.canvasHelper.fillRect(new Vector(0, this.canvasHelper.getCenter().y+ 51 + i), new Vector(this.canvasHelper.getWidth(), this.canvasHelper.getCenter().y + 50 + i), `rgba(0, 0, 0, ${(85-i)/100})`);
        }
        this.canvasHelper.fillRect(new Vector(0, this.canvasHelper.getCenter().y-50), new Vector(this.canvasHelper.getWidth(), this.canvasHelper.getCenter().y+50), `rgba(0, 0, 0, ${85/100})`);
        this.canvasHelper.writeText("You died!", 96, this.canvasHelper.getCenter(), undefined, undefined, "red");
    }

    public beforeExit() {}
}