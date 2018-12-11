class GameView extends BaseView {
    private player: Player;

    public constructor() {
        super();
        this.player = new Player([
            "./assets/player/anim_walk/PlayerAnim1.png",
            "./assets/player/anim_walk/PlayerAnim2.png",
            "./assets/player/anim_walk/PlayerAnim1.png",
            "./assets/player/anim_walk/PlayerAnim3.png",
        ],
        this.canvasHelper.getCenter(),
        new Vector(312, 800), 1, 5
        );
    }

    public update(): void {
        this.player.update();
        this.drawGUI();
    }

    protected drawGUI(): void {
        this.canvasHelper.writeText("Hello World!", 69, this.canvasHelper.getCenter(), undefined, undefined, "black");
    }

    public beforeExit(): void {}

}