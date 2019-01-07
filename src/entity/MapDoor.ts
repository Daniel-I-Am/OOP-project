class MapDoor extends Entity {
    private levelName: string;

    public constructor(location: Vector, levelName: string, rotation: Rotation) {
        super(["./assets/images/mapDoor.png"], location, rotation, new Vector(64, 64));
        this.levelName = levelName;
        this.collision = new CollisionObject(
            this.location.copy().add(this.size.copy().multiply(.5)),
            this.location.copy().sub(this.size.copy().multiply(.5)),
            this.rotation
        );
    }
    public move() {}
    
    public onPlayerCollision() {
        Game.switchView(new DialogueView(this.levelName));
    }

    public drawName(): void {
        this.canvasHelper.writeText(this.levelName, 24, this.location.copy().sub(new Vector(0, 50)), undefined, undefined, "green");
    }
}