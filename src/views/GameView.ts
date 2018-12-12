class GameView extends BaseView {
    private entities: Array<Entity>;
    private player: Player;

    public constructor() {
        super();
        this.entities = new Array<Entity>();

        this.player = new Player([
            "./assets/player/anim_walk/PlayerAnim1.png",
            "./assets/player/anim_walk/PlayerAnim2.png",
            "./assets/player/anim_walk/PlayerAnim1.png",
            "./assets/player/anim_walk/PlayerAnim3.png",
        ],
        this.canvasHelper.getCenter(),
        new Vector(58.5, 150), 1, 5
        );
        this.entities.push(new FallingTile(
            ["./assets/images/buttonGreen.png"],
            new Vector(100,100),
            new Rotation(0),
            new Vector(-1,-1),
            2,
            0
        ));

        this.entities.push(this.player);
    }

    public update(): void {
        this.entities.forEach(e => {
            e.update();
        });
        this.drawGUI();
    }

    protected drawGUI(): void {
        this.canvasHelper.writeText("Hello World!", 69, this.canvasHelper.getCenter(), undefined, undefined, "black");
    }

    public beforeExit(): void {}

}