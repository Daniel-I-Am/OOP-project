class GameView extends BaseView {
    private backgroundMusic: SoundHelper;

    public constructor(levelName: string, inventory?: Array<InventoryItem>) {
        super(levelName);
        this.entities = new Array<Entity>();
        fetch(`./assets/levels/${levelName}.json`)
            .then(response => {
                return response.json();
            })
            .then(myJson => {
                this.makeLevel(myJson, inventory);
            })
    }

    private makeLevel(levelJSON: Level, inventory?: Array<InventoryItem>) {
        this.background.src = levelJSON.background;
        if (levelJSON.foreground) {
            this.foreground = new Image();
            this.foreground.src = levelJSON.foreground;
        }
        this.backgroundMusic = new SoundHelper(levelJSON.backgroundMusic, .3);
        this.backgroundMusic.audioElem.addEventListener("ended", () =>{
            console.log("Ended");
            this.backgroundMusic = new SoundHelper("./assets/sounds/Spectacles_loop.wav", .3);
            this.backgroundMusic.toggleLoop();
        })
        
        //this.backgroundMusic.toggleLoop();
        levelJSON.Collisions.forEach(e => {
            this.entities.push(new CollisionObject(
                this.parseLocation(e.topLeft),
                this.parseLocation(e.bottomRight),
                new Rotation(e.rotation)
            ));
        });
        this.player = new Player(
            levelJSON.player.sprites,
            this.parseLocation(levelJSON.player.location),
            new Vector(levelJSON.player.size.x, levelJSON.player.size.y),
            levelJSON.player.gravity,
            2,
            levelJSON.player.jumpHeight,
            levelJSON.player.maxJumps
        );
        levelJSON.berthas.forEach(e => {
            this.entities.push(new Enemy_Bertha(
                ((e.sprites == null) ? undefined : e.sprites),
                this.parseLocation(e.location),
                new Vector(e.size.x, e.size.y),
                e.gravity,
            ));
        });
        levelJSON.Fires.forEach(e => {
            this.entities.push(new Fire(
                ((e.sprites == null) ? undefined : e.sprites),
                this.parseLocation(e.location),
                new Rotation(0),
                new Vector(e.size.x, e.size.y),
                0
            ));
        });
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
                2,
                ((e.shouldDraw == null) ? true : e.shouldDraw)
            ));
        });
        levelJSON.items.forEach(e => {
            this.entities.push(new Item(
                this.parseLocation(e.location),
                new Rotation(e.rotation),
                new Vector(e.size.x, e.size.y),
                e.name
            ));
        });
        this.entities.push(
            new Door(
                this.parseLocation(levelJSON.door.bottomRight),
                this.parseLocation(levelJSON.door.topLeft)
            )
        );
        if (inventory)
            this.player.inventory = inventory;

        this.entities.push(this.player);
    }

    private parseLocation(location: LevelLocations): Vector {
        return new Vector(
            (location.x.center ? this.canvasHelper.getCenter().x : 0) + location.x.offset,
            (location.y.center ? this.canvasHelper.getCenter().y : 0) + location.y.offset
        )
    }

    protected update(): void {
        this.entities.forEach(e => {
            e.update(this.entities);
        });
    }

    protected drawGUI(): void {
        if (Game.DEBUG_MODE) {
            this.canvasHelper.writeText(`XPos: ${MathHelper.floor(this.player.getLoc().x, 2)}`, 20, new Vector(50, 20), "left", undefined, "black")
            this.canvasHelper.writeText(`YPos: ${MathHelper.floor(this.player.getLoc().y, 2)}`, 20, new Vector(50, 40), "left", undefined, "black")
            this.canvasHelper.writeText(`XVelo: ${MathHelper.floor(this.player.getVelocity().x, 2)}`, 20, new Vector(50, 60), "left", undefined, "black")
            this.canvasHelper.writeText(`YVelo: ${MathHelper.floor(this.player.getVelocity().y, 2)}`, 20, new Vector(50, 80), "left", undefined, "black")
        }
        this.canvasHelper.addProgressBar(
            new Vector(this.canvasHelper.getWidth()-100, 20),
            new Vector(180, 20),
            "green",
            "white",
            "black",
            Game.getReputation()
        );
    }

    public reachedDoor(): void {
        Game.setInventory(this.player.getInventory());
        Game.switchView(new LevelEndView(this.levelName));
    }

    public beforeExit(): void {
        this.backgroundMusic.pause(PlayingStat.PAUSED);
    }

    public onPause(): void {
        this.canvasHelper.writeText("PAUSED", 96, this.canvasHelper.getCenter(), "center", "middle", "black")
    }
}
