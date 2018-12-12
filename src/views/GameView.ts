class GameView extends BaseView {
    private player: Player;
    private tile: FallingTile;

    public constructor() {
        super();
        this.player = new Player([
            "./assets/player/anim_walk/PlayerAnim1.png",
            "./assets/player/anim_walk/PlayerAnim2.png",
            "./assets/player/anim_walk/PlayerAnim1.png",
            "./assets/player/anim_walk/PlayerAnim3.png",
        ],
        this.canvasHelper.getCenter(),
        new Vector(58.5, 150), 1, 5
        );
        this.tile = new FallingTile(
            undefined,
            new Vector(500,100),
            new Rotation(0),
            new Vector(175,50),
            2,
            0
        );
    }

    public update(): void {
        this.tile.update();
        this.player.update();
        this.drawGUI();
    }

    protected drawGUI(): void {
        this.canvasHelper.writeText("Hello World!", 69, this.canvasHelper.getCenter(), undefined, undefined, "black");
    }

    public beforeExit(): void {}

}