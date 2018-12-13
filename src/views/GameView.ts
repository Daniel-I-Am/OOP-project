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
            undefined,
            new Vector(500,100),
            new Rotation(0),
            new Vector(175,50),
            2,
            0
        ));
        this.entities.push(new Accelerator(
            undefined,
            new Vector(900,300),
            new Rotation(0),
            new Vector(175,50),
            2,
            0
        ));
        this.entities.push(new Trampoline(
            undefined,
            new Vector(50,500),
            new Rotation(0),
            new Vector(175,50),
            2,
        ));
        this.entities.push(new Item(
            "./assets/images/default.png",
            new Vector(700, 300),
            new Rotation(0),
            new Vector(64,64),
            'Default'
        ));

        this.entities.push(this.player);
    }

    public update(): void {
        this.player.setIsLanded(false);
        this.entities.forEach(e => {
            if (e === this.player) return;
            if (this.player.footCollision(e))
                this.player.setIsLanded(true);
                if(e.collide(this.player) && e instanceof Accelerator){
                    this.player.boost();
                }
                if(e.collide(this.player) && e instanceof Trampoline){
                    this.player.trampoline();
                }
            this.player.interact(e);
        });
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
