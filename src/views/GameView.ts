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
        this.background.src = levelJSON.background;
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
            this.entities.push(new Accelerator(
                ((e.sprites == null) ? undefined : e.sprites),
                this.parseLocation(e.location),
                new Rotation(e.rotation),
                new Vector(e.size.x, e.size.y),
                e.yeet
            ));
        });
        levelJSON.Trampolines.forEach(e => {
            this.entities.push(new Trampoline(
                ((e.sprites == null) ? undefined : e.sprites),
                this.parseLocation(e.location),
                new Rotation(e.rotation),
                new Vector(e.size.x, e.size.y),
                2
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

    protected update(): void {
        this.player.setIsLanded(false);
        this.entities.forEach(e => {
            if (e === this.player) return;
            if (this.player.footCollision(e)){
                this.player.setIsLanded(true);
                if(e instanceof FallingTile){
                    e.activated = true;
                }
            }
            if(e.collide(this.player) && e instanceof Accelerator){
                this.player.boost(e);
            }
            if(e.collide(this.player) && e instanceof Trampoline){
                this.player.trampoline();
            }
            if(e.collide(this.player))
            this.player.interact(e);
            if(e instanceof FallingTile){
                if(e.getAlive()){
                    let tile = e
                    this.entities.forEach(e => {
                        if(!(e instanceof Floor)) return;
                        if(tile.collide(e)) tile.kill();
                    });
                }
            }
        });
        this.entities.forEach(e => {
            e.update();
        });
    }

    protected drawGUI(): void {
        if (Game.DEBUG_MODE) {
            this.canvasHelper.writeText(`XPos: ${MathHelper.floor(this.player.getLoc().x, 2)}`, 20, new Vector(50, 20), "left", undefined, "black")
            this.canvasHelper.writeText(`YPos: ${MathHelper.floor(this.player.getLoc().y, 2)}`, 20, new Vector(50, 40), "left", undefined, "black")
            this.canvasHelper.writeText(`XVelo: ${MathHelper.floor(this.player.getVelocity().x, 2)}`, 20, new Vector(50, 60), "left", undefined, "black")
            this.canvasHelper.writeText(`YVelo: ${MathHelper.floor(this.player.getVelocity().y, 2)}`, 20, new Vector(50, 80), "left", undefined, "black")
        }
    }

    public beforeExit(): void {}

}
