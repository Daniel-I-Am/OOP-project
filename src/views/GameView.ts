class GameView extends BaseView {
    private entities: Array<Entity>;
    private player: Player;

    public constructor(levelName: string) {
        super();
        this.entities = new Array<Entity>();
        fetch(`./assets/levels/${levelName}.json`)
            .then(response => {
                return response.json();
            })
            .then(myJson => {
                this.makeLevel(myJson);
            })
    }

    private makeLevel(levelJSON: Level) {
        this.player = new Player(
            levelJSON.player.sprites,
            this.parseLocation(levelJSON.player.location),
            new Vector(levelJSON.player.size.x, levelJSON.player.size.y),
            levelJSON.player.gravity,
            5
        );
        levelJSON.FallingTiles.forEach(e => {
            this.entities.push(new FallingTile(
                ((e.sprites == null) ? undefined : e.sprites),
                this.parseLocation(e.location),
                new Rotation(e.rotation),
                new Vector(e.size.x, e.size.y),
                2, 0
            ));
        });
        levelJSON.Accelerators.forEach(e => {
            this.entities.push(new Accellerator(
                ((e.sprites == null) ? undefined : e.sprites),
                this.parseLocation(e.location),
                new Rotation(e.rotation),
                new Vector(e.size.x, e.size.y),
                2, 0
            ));
        });
        levelJSON.items.forEach(e => {
            this.entities.push(new Item(
                ((e.sprite == null) ? undefined : e.sprite),
                this.parseLocation(e.location),
                new Rotation(e.rotation),
                new Vector(e.size.x, e.size.y),
                e.name
            ));
        });
        this.entities.push(this.player);
    }

    private parseLocation(location: LevelLocations): Vector {
        return new Vector(
            (location.x.center ? this.canvasHelper.getCenter().x : 0) + location.x.offset,
            (location.y.center ? this.canvasHelper.getCenter().y : 0) + location.y.offset
        )
    }

    public update(): void {
        this.player.setIsLanded(false);
        this.entities.forEach(e => {
            if (e === this.player) return;
            if (this.player.footCollision(e))
                this.player.setIsLanded(true);
                if(e.collide(this.player) && e instanceof Accellerator){
                    this.player.boost();
                }
            this.player.interact(e);
        });
        this.entities.forEach(e => {
            e.update();
        });
        this.drawGUI();
    }

    protected drawGUI(): void {}

    public beforeExit(): void {}

}
