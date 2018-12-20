class GameOverView extends BaseView {
    private player: Player;
    private entities: Array<Entity>;

    public constructor(
        player: Player, entities: Array<Entity>, background: HTMLImageElement
    ) {
        super();
        this.player = player;
        this.background = background
        this.entities = entities.filter(e => !(e instanceof CollisionObject));
        this.entities.forEach(e => {
            e.removeCollision();
        });
    }

    public update() {
        this.entities.forEach(e => {
            e.update(this.entities);
        });
        if (this.player.getLoc().y > this.canvasHelper.offset.y + 3000) {
            Game.switchView(new GameView('debug_level'));
        }
    }
    
    public drawGUI() {
        for (let i = 0; i < 85; i++) {
            this.canvasHelper.fillRect(new Vector(0, this.canvasHelper.getCenter().y - 50 - i), new Vector(this.canvasHelper.getWidth(), this.canvasHelper.getCenter().y - 51 - i), `rgba(0, 0, 0, ${(85-i)/100})`);
            this.canvasHelper.fillRect(new Vector(0, this.canvasHelper.getCenter().y+ 51 + i), new Vector(this.canvasHelper.getWidth(), this.canvasHelper.getCenter().y + 50 + i), `rgba(0, 0, 0, ${(85-i)/100})`);
        }
        this.canvasHelper.fillRect(new Vector(0, this.canvasHelper.getCenter().y-50), new Vector(this.canvasHelper.getWidth(), this.canvasHelper.getCenter().y+50), `rgba(0, 0, 0, ${85/100})`);
        this.canvasHelper.writeText("Game over!", 96, this.canvasHelper.getCenter(), undefined, undefined, "red");
    }

    public beforeExit() {}
    public onPause() {}
}